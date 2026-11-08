import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { blueprint, domainIds } from '../src/content/blueprints';
import {
  dedicatedExamLimitMs,
  remainingDedicatedSeconds,
  validateDedicatedExamPack,
  type DedicatedExamItem,
  type DedicatedExamPack,
} from '../src/engines/dedicated-exam';
import { DedicatedExamDB } from '../src/storage/dedicated-exam';

const unofficial = { assessment: 3, planning: 5, technique: 5, safety: 2 };
const startedAt = Date.parse('2026-11-08T00:00:00Z');

function createPack(status: DedicatedExamPack['status'] = 'preparing'): DedicatedExamPack {
  const human = status === 'released';
  const items = domainIds.flatMap((domainId) =>
    Array.from(
      { length: blueprint.scoredDomainCounts[domainId] + unofficial[domainId] },
      (_, index): DedicatedExamItem => ({
        id: domainId + '-' + index,
        groupId: domainId + '-' + index,
        domainId,
        revision: 1,
        scored: index < blueprint.scoredDomainCounts[domainId],
        prompt: '設問 ' + index,
        choices: ['a', 'b', 'c'].map((id) => ({
          id,
          text: '選択肢 ' + id,
          explanation: '理由 ' + id,
        })),
        correctChoiceId: 'a',
        explanation: '解説',
        sourceRefs: [{ title: 'テストの出典', url: 'https://example.com/', locator: 'p.1' }],
        review: {
          status: human ? 'expert_reviewed' : 'source_checked',
          reviewerType: human ? 'human_expert' : 'ai',
          revision: 1,
          method: 'テストの確認方法',
          checkedAt: '2026-11-08',
          ...(human ? { reviewer: 'テストの確認者' } : {}),
        },
        ...(domainId === 'assessment' && index < 25
          ? {
              media: {
                kind: 'diagram',
                src: '/media/' + index + '.svg',
                alt: 'テストの図 ' + index,
                rights: {
                  decision: 'usable',
                  basis: 'original',
                  holder: 'テストの制作者',
                  evidence: 'テストの権利資料',
                  checkedAt: '2026-11-08',
                },
              },
            }
          : {}),
      }),
    ),
  );
  return { id: 'dedicated-test', revision: 1, status, items };
}

describe('専用模試の公開条件', () => {
  it('現在の人間による専門家レビューが全問そろうまで公開扱いにしない', () => {
    const preview = createPack();
    expect(validateDedicatedExamPack(preview, 'preview')).toEqual([]);
    expect(validateDedicatedExamPack(preview, 'released')).not.toEqual([]);
    preview.status = 'released';
    expect(validateDedicatedExamPack(preview, 'released')).toHaveLength(155);

    const approved = createPack('released');
    expect(validateDedicatedExamPack(approved, 'released')).toEqual([]);
    approved.items[17].revision += 1;
    expect(validateDedicatedExamPack(approved, 'released')).toHaveLength(1);
    approved.items[18].review.checkedAt = '2026-02-30';
    approved.items[19].sourceRefs![0].url = 'https://';
    expect(validateDedicatedExamPack(approved, 'released')).toHaveLength(3);
  });

  it('媒体の数や利用権、問題グループ、採点対象の配分を公開前に検査する', () => {
    const pack = createPack('released');
    pack.items[0].media!.rights.evidence = '';
    delete pack.items[1].media;
    pack.items[2].groupId = pack.items[3].groupId;
    const scored = pack.items.find((item) => item.domainId === 'assessment' && item.scored)!;
    const unscored = pack.items.find((item) => item.domainId === 'safety' && !item.scored)!;
    [scored.scored, unscored.scored] = [unscored.scored, scored.scored];
    expect(validateDedicatedExamPack(pack, 'released')).toEqual(
      expect.arrayContaining([
        expect.stringContaining('25〜35問'),
        expect.stringContaining('利用権'),
        expect.stringContaining('グループに重複'),
        expect.stringContaining('分野配分'),
      ]),
    );
  });
});

describe('専用模試の保存と採点', () => {
  let now: number;
  let database: DedicatedExamDB;
  let otherTab: DedicatedExamDB;
  let pack: DedicatedExamPack;

  beforeEach(() => {
    now = startedAt;
    const dbName = 'dedicated-test-' + crypto.randomUUID();
    database = new DedicatedExamDB('preview', dbName, () => now);
    otherTab = new DedicatedExamDB('preview', dbName, () => now);
    pack = createPack();
  });

  afterEach(async () => {
    otherTab.close();
    await database.delete();
  });

  it('別タブの開始を同じ受験にまとめ、順番・下書き・フラグ・締切を再読み込み後も残す', async () => {
    const [first, second] = await Promise.all([database.start(pack), otherTab.start(pack)]);
    expect(first.id).toBe(second.id);
    expect(first.questionIds).toHaveLength(155);
    expect(new Set(first.questionIds).size).toBe(155);
    expect(first.choiceOrders[first.questionIds[0]].toSorted()).toEqual(['a', 'b', 'c']);
    const questionId = first.questionIds[0];
    await Promise.all([
      database.update(pack, first.id, { type: 'answer', questionId, choiceId: 'b' }),
      otherTab.update(pack, first.id, { type: 'flag', questionId, flagged: true }),
    ]);
    await database.update(pack, first.id, { type: 'navigate', index: 154 });
    now += 5000;
    database.close();
    await database.open();
    const resumed = await database.start(pack);
    expect(resumed).toMatchObject({
      id: first.id,
      questionIds: first.questionIds,
      choiceOrders: first.choiceOrders,
      index: 154,
      flags: [questionId],
      answers: { [questionId]: 'b' },
      deadlineAt: startedAt + dedicatedExamLimitMs,
    });
    expect(remainingDedicatedSeconds(resumed, now)).toBe(180 * 60 - 5);
  });

  it('全15問の採点対象外の正答を全体・分野の得点と回答数に加えない', async () => {
    const session = await database.start(pack);
    const scored = pack.items.find((item) => item.scored)!;
    const wrong = pack.items.find((item) => item.domainId === 'safety' && item.scored)!;
    for (const item of pack.items.filter((item) => !item.scored))
      await database.update(pack, session.id, {
        type: 'answer',
        questionId: item.id,
        choiceId: item.correctChoiceId,
      });
    await database.update(pack, session.id, {
      type: 'answer',
      questionId: scored.id,
      choiceId: scored.correctChoiceId,
    });
    await database.update(pack, session.id, {
      type: 'answer',
      questionId: wrong.id,
      choiceId: 'b',
    });
    const [result, concurrent] = await Promise.all([
      database.finish(pack, session.id, 'submitted'),
      otherTab.finish(pack, session.id, 'submitted'),
    ]);
    expect(concurrent).toEqual(result);
    expect(Object.keys(result.answers)).toHaveLength(17);
    expect(result.result).toMatchObject({ correct: 1, total: 140, answered: 2, unanswered: 138 });
    expect(result.result?.domains).toMatchObject([
      { id: 'assessment', correct: 1, total: 32, answered: 1, unanswered: 31 },
      { id: 'planning', correct: 0, total: 45, answered: 0, unanswered: 45 },
      { id: 'technique', correct: 0, total: 43, answered: 0, unanswered: 43 },
      { id: 'safety', correct: 0, total: 20, answered: 1, unanswered: 19 },
    ]);
    const attemptedEdit = await database.update(pack, session.id, {
      type: 'answer',
      questionId: wrong.id,
      choiceId: 'a',
    });
    expect(attemptedEdit).toEqual(result);
  });

  it('時間切れの回答を保存せず、最初の締切で一度だけ確定する', async () => {
    const session = await database.start(pack);
    await expect(database.finish(pack, session.id, 'timeout')).rejects.toThrow('まだ制限時間内');
    const question = pack.items.find((item) => item.scored)!;
    now += dedicatedExamLimitMs;
    const [lateAnswer, submit] = await Promise.all([
      database.update(pack, session.id, {
        type: 'answer',
        questionId: question.id,
        choiceId: question.correctChoiceId,
      }),
      otherTab.finish(pack, session.id, 'submitted'),
    ]);
    expect(lateAnswer).toEqual(submit);
    expect(submit).toMatchObject({
      finishedReason: 'timeout',
      completedAt: session.deadlineAt,
      answers: {},
      result: { correct: 0, total: 140, unanswered: 140 },
    });
    now += 2000;
    const newSession = await database.start(pack);
    expect(newSession.id).not.toBe(session.id);
    expect(newSession.deadlineAt).toBe(now + dedicatedExamLimitMs);
  });

  it('同じデータでも公開側の開始を許可しない', async () => {
    const released = new DedicatedExamDB('released', 'dedicated-released-' + crypto.randomUUID());
    try {
      expect(() => released.start(pack)).toThrow('公開状態');
    } finally {
      await released.delete();
    }
  });
});
