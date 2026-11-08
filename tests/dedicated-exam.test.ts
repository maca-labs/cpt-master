import 'fake-indexeddb/auto';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import Dexie from 'dexie';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { allQuestions } from '../src/content';
import { blueprint, domainIds } from '../src/content/blueprints';
import {
  createDedicatedExamSession,
  dedicatedExamLimitMs,
  dedicatedMissedQuestionIds,
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
  it('専門家レビュー版の公開には全問の現在の人間によるレビューが必要', () => {
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

  it('学習用公開版は現在のAI出典照合と人間による専門家レビューを受け付ける', () => {
    const pack = createPack('released_study');
    pack.items[1].review = createPack('released').items[1].review;
    expect(validateDedicatedExamPack(pack, 'released')).toEqual([]);
    expect(validateDedicatedExamPack(pack, 'preview')).toEqual(
      expect.arrayContaining([expect.stringContaining('公開状態')]),
    );
  });

  it('学習用公開版でも照合前の下書き、古い改訂、審査記録や出典の欠落を拒否する', () => {
    const pack = createPack('released_study');
    pack.items[0].review.status = 'draft';
    pack.items[1].revision += 1;
    pack.items[2].review.method = '';
    pack.items[3].review.reviewerType = 'human_expert';
    pack.items[4].sourceRefs = [];
    const issues = validateDedicatedExamPack(pack, 'released');
    expect(issues).toHaveLength(5);
    expect(issues.slice(0, 4).every((issue) => issue.includes('審査記録'))).toBe(true);
    expect(issues[4]).toContain('出典');
  });

  it('媒体の数や利用権、問題グループ、採点対象の配分を公開前に検査する', () => {
    const pack = createPack('released_study');
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

it('公開する3セットは一般教材と重複せず、掲載する図版は出典・利用権を記録した原本と一致する', () => {
  const ids = new Set(allQuestions.map((item) => item.id));
  const groups = new Set(allQuestions.map((item) => item.groupId));
  const mediaDigests = new Set<string>();
  for (const [number, mediaCount] of [
    ['01', 29],
    ['02', 28],
    ['03', 26],
  ] as const) {
    const pack = JSON.parse(
      readFileSync(
        new URL('../src/content/dedicated-packs/set-' + number + '.json', import.meta.url),
        'utf8',
      ),
    ) as DedicatedExamPack;
    expect(pack).toMatchObject({ id: 'jp-dedicated-' + number, status: 'released_study' });
    expect(validateDedicatedExamPack(pack, 'released')).toEqual([]);
    expect(pack.items.filter((item) => item.media)).toHaveLength(mediaCount);
    for (const item of pack.items) {
      expect(ids.has(item.id)).toBe(false);
      expect(groups.has(item.groupId)).toBe(false);
      ids.add(item.id);
      groups.add(item.groupId);
      expect(item.review).toMatchObject({ status: 'source_checked', reviewerType: 'ai' });
      if (!item.media) continue;
      expect(item.media.src).toMatch(/^exam-media\/[a-z0-9-]+\.svg$/);
      const file = readFileSync(new URL('../public/' + item.media.src, import.meta.url));
      const digest = createHash('sha256').update(file).digest('hex');
      expect(item.media.rights.evidence).toContain('SHA-256: ' + digest);
      expect(mediaDigests.has(digest)).toBe(false);
      mediaDigests.add(digest);
    }
  }
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

  it('v1の受験を保持し、中断した時間を再開後の締切から除く', async () => {
    const legacyDatabase = new Dexie(database.name);
    legacyDatabase.version(1).stores({ sessions: 'id', current: 'packKey' });
    const original = createDedicatedExamSession(pack, startedAt);
    await legacyDatabase.table('sessions').add(original);
    await legacyDatabase
      .table('current')
      .add({ packKey: original.packKey, sessionId: original.id });
    legacyDatabase.close();

    expect(await database.sessionFor(pack)).toEqual(original);
    now += 15_250;
    const paused = await database.pause(pack, original.id);
    const frozen = dedicatedExamLimitMs - 15_250;
    expect(paused.pausedRemainingMs).toBe(frozen);

    now += dedicatedExamLimitMs;
    database.close();
    await database.open();
    expect(await database.start(pack)).toEqual(paused);
    expect(remainingDedicatedSeconds(paused, now)).toBe(Math.ceil(frozen / 1000));
    expect(await otherTab.finish(pack, original.id, 'timeout')).toEqual(paused);
    const questionId = original.questionIds[0];
    await expect(
      otherTab.update(pack, original.id, { type: 'answer', questionId, choiceId: 'a' }),
    ).rejects.toThrow('再開');
    await expect(otherTab.finish(pack, original.id, 'submitted')).rejects.toThrow('再開');

    const resumed = await database.resume(pack, original.id);
    expect(resumed.pausedRemainingMs).toBeUndefined();
    expect(resumed.deadlineAt).toBe(now + frozen);
    expect(await otherTab.resume(pack, original.id)).toEqual(resumed);
    await otherTab.update(pack, original.id, { type: 'answer', questionId, choiceId: 'a' });
    now += frozen;
    expect(await database.finish(pack, original.id, 'timeout')).toMatchObject({
      status: 'completed',
      finishedReason: 'timeout',
      completedAt: resumed.deadlineAt,
      answers: { [questionId]: 'a' },
    });
  });

  it('不正解・未回答だけを別の解き直しに保存し、元の成績と履歴を保持する', async () => {
    const full = await database.start(pack);
    await expect(database.startMissedRetake(pack, full.id)).rejects.toThrow('完了した専用模試');
    const scoredCorrect = pack.items.find((item) => item.scored)!;
    const unscoredCorrect = pack.items.find((item) => !item.scored)!;
    const missed = pack.items.find((item) => item.id !== scoredCorrect.id && item.scored)!;
    const missedUnscored = pack.items.find(
      (item) => item.id !== unscoredCorrect.id && !item.scored,
    )!;
    for (const item of [scoredCorrect, unscoredCorrect])
      await database.update(pack, full.id, { type: 'answer', questionId: item.id, choiceId: 'a' });
    await database.update(pack, full.id, { type: 'answer', questionId: missed.id, choiceId: 'b' });
    const original = await database.finish(pack, full.id, 'submitted');
    const questionIds = dedicatedMissedQuestionIds(pack, original);
    expect(questionIds).toHaveLength(153);
    expect(questionIds).toEqual(
      full.questionIds.filter((id) => id !== scoredCorrect.id && id !== unscoredCorrect.id),
    );

    const [first, other] = await Promise.all([
      database.startMissedRetake(pack, full.id),
      otherTab.startMissedRetake(pack, full.id),
    ]);
    expect(first).toEqual(other);
    expect(first).toMatchObject({ retakeOf: full.id, retakeNumber: 1, deadlineAt: null });
    expect(new Set(first.questionIds)).toEqual(new Set(questionIds));
    expect(new Set(Object.keys(first.choiceOrders))).toEqual(new Set(questionIds));
    await expect(
      database.update(pack, first.id, {
        type: 'answer',
        questionId: scoredCorrect.id,
        choiceId: 'a',
      }),
    ).rejects.toThrow('含まれない');

    now += dedicatedExamLimitMs + 1000;
    await otherTab.update(pack, first.id, { type: 'answer', questionId: missed.id, choiceId: 'a' });
    await database.update(pack, first.id, {
      type: 'answer',
      questionId: missedUnscored.id,
      choiceId: 'a',
    });
    expect(await database.missedRetakesFor(pack, full.id)).toMatchObject([
      { id: first.id, status: 'active', answers: { [missed.id]: 'a', [missedUnscored.id]: 'a' } },
    ]);
    const retaken = await database.finish(pack, first.id, 'submitted');
    expect(retaken.result).toMatchObject({ correct: 2, total: 153, answered: 2, unanswered: 151 });
    expect(retaken.result?.domains[0]).toMatchObject({ correct: 2, total: 33 });
    expect((await database.sessionFor(pack))?.result).toEqual(original.result);
    await expect(database.startMissedRetake(pack, first.id)).rejects.toThrow('完了した専用模試');

    const second = await database.startMissedRetake(pack, full.id);
    expect(second).toMatchObject({ retakeOf: full.id, retakeNumber: 2, answers: {} });
    const nextOriginal = await database.start(pack);
    expect((await database.sessionFor(pack))?.id).toBe(nextOriginal.id);
    expect(await database.sessionById(pack, full.id)).toEqual(original);
    expect(await database.sessionById({ ...pack, revision: 2 }, full.id)).toBeUndefined();
    expect((await database.missedRetakesFor(pack, full.id)).map(({ id }) => id)).toEqual([
      second.id,
      first.id,
    ]);
  });

  it('公開側は準備中のセットを拒否し、学習用公開版の受験を保存して採点する', async () => {
    const released = new DedicatedExamDB('released', 'dedicated-released-' + crypto.randomUUID());
    try {
      expect(() => released.start(pack)).toThrow('公開状態');

      const studyPack: DedicatedExamPack = { ...pack, status: 'released_study' };
      const session = await released.start(studyPack);
      const scored = studyPack.items.find((item) => item.scored)!;
      const unscored = studyPack.items.find((item) => !item.scored)!;
      for (const item of [scored, unscored])
        await released.update(studyPack, session.id, {
          type: 'answer',
          questionId: item.id,
          choiceId: item.correctChoiceId,
        });
      const result = await released.finish(studyPack, session.id, 'submitted');
      expect(result.result).toMatchObject({ correct: 1, total: 140, answered: 1, unanswered: 139 });
      expect(await released.sessionFor(studyPack)).toEqual(result);
      expect(await database.sessionFor(pack)).toBeUndefined();
    } finally {
      await released.delete();
    }
  });
});
