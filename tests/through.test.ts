import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { questions } from '../src/content';
import type { Attempt, Exposure, Session } from '../src/domain/types';
import { createSession, examReadiness } from '../src/engines/learning';
import { startPracticeSession } from '../src/app/actions';
import {
  availableMockBank,
  createMockSession,
  createThroughSession,
  finishMock,
  mockAllocation,
  mockComposition,
  mockSummary,
  pauseMock,
  previewComposition,
  remainingMockSeconds,
  resumeMock,
  recordMockDisplay,
  selectThrough,
  withMockDraft,
} from '../src/engines/mock';
import {
  LearningDB,
  defaultSettings,
  exportBackup,
  restoreBackup,
  snapshot,
  validateBackup,
} from '../src/storage/db';
const now = new Date('2026-11-05T00:00:00.000Z');
const after = (seconds: number) => new Date(now.getTime() + seconds * 1000);
const databases: LearningDB[] = [];
const db = () => {
  const database = new LearningDB(`through-${crypto.randomUUID()}`);
  databases.push(database);
  return database;
};
afterEach(async () => {
  await Promise.all(databases.splice(0).map((database) => database.delete()));
});
function reserved(qids: string[]): Session {
  const selected = qids.map((id) => questions.find((q) => q.id === id)!);
  return {
    ...createSession('practice', selected, [], []),
    practice: { batch: 'all', selection: 'strict_unseen', requestedCount: 50 },
  };
}
describe('155-question continuous learning format', () => {
  it('blocks old quiz and result prompts reserved by a later strict session without consuming them', async () => {
    const database = db();
    const session = createThroughSession(questions, false, [], [], [], now, () => 0.35);
    const strict = reserved([session.questionIds[0]]);
    await database.sessions.bulkAdd([session, strict]);
    expect(await recordMockDisplay(session.id, [session.questionIds[1]], database, now)).toEqual({
      status: 'stale',
    });
    expect(await recordMockDisplay(session.id, [session.questionIds[0]], database, now)).toEqual({
      status: 'reserved',
      sessionIds: [strict.id],
      count: 1,
    });
    expect(await database.exposures.count()).toBe(0);
    await finishMock(session.id, 'submitted', database, after(10));
    expect(await recordMockDisplay(session.id, session.questionIds, database, after(11))).toEqual({
      status: 'reserved',
      sessionIds: [strict.id],
      count: 1,
    });
    expect(await database.exposures.count()).toBe(0);
    await database.sessions.update(strict.id, {
      status: 'completed',
      completedAt: after(12).toISOString(),
    });
    expect(await recordMockDisplay(session.id, session.questionIds, database, after(13))).toEqual({
      status: 'ready',
    });
    expect(await database.exposures.count()).toBe(155);
    expect(validateBackup(JSON.stringify(await exportBackup(database))).data.sessions).toHaveLength(
      2,
    );
  });

  it('serializes prompt exposure with a competing strict reservation', async () => {
    for (const reserveFirst of [true, false]) {
      const database = db();
      await database.settings.put(defaultSettings);
      const session = createThroughSession(questions, false, [], [], [], now, () => 0.35);
      await database.sessions.add(session);
      const qid = session.questionIds[0];
      const reserve = () =>
        startPracticeSession(
          {
            batch: 'all',
            selection: 'strict_unseen',
            requestedCount: 10,
            questionIds: [qid],
            allowSmaller: true,
          },
          database,
        );
      const display = () => recordMockDisplay(session.id, [qid], database, now);
      const operations = reserveFirst ? [reserve(), display()] : [display(), reserve()];
      const outcomes = await Promise.allSettled(operations);
      const strict = (await database.sessions.toArray()).filter(
        (s) => s.practice?.selection === 'strict_unseen',
      );
      const exposed = (await database.exposures.toArray()).some((e) => e.questionId === qid);
      expect(strict.length === 1 && exposed).toBe(false);
      expect(strict.length === 1 || exposed).toBe(true);
      expect(outcomes[reserveFirst ? 1 : 0].status).toBe('fulfilled');
      expect(validateBackup(JSON.stringify(await exportBackup(database)))).toBeDefined();
    }
  });

  it('selects 155 unique groups with declared domain counts and keeps exclusive-exam gates closed', () => {
    const before = examReadiness(questions);
    const session = createThroughSession(questions, false, [], [], [], now, () => 0.35);
    expect(session.mock).toMatchObject({
      format: 'through',
      questionCount: 155,
      timeMode: 'continuous',
      limitSeconds: 10800,
      remainingSeconds: 10800,
      paused: false,
      deadlineAt: after(10800).toISOString(),
    });
    expect(session.questionIds).toHaveLength(155);
    const selected = session.questionIds.map((id) => questions.find((q) => q.id === id)!);
    expect(new Set(selected.map((q) => q.groupId)).size).toBe(155);
    expect(selected.every((q) => q.pool === 'practice')).toBe(true);
    expect(mockAllocation(155)).toEqual({
      assessment: 35,
      planning: 50,
      technique: 48,
      safety: 22,
    });
    for (const [id, n] of Object.entries(mockAllocation(155)))
      expect(selected.filter((q) => q.domainId === id)).toHaveLength(n);
    for (const q of selected)
      expect([...session.choiceOrders[q.id]].sort()).toEqual(q.choices.map((c) => c.id).sort());
    expect(examReadiness(questions)).toEqual(before);
    expect(before.every((row) => row.available === 0)).toBe(true);
    expect(() => createMockSession(questions, 155 as 50, true, 'continuous', [], [])).toThrow(
      /短縮模試/,
    );
  });
  it('counts display, explanation and answer history at group level without pretending all media are real footage', () => {
    const selected = selectThrough(questions, true, [], () => 0.2);
    const a = selected[0],
      b = selected[1],
      c = selected[2];
    const exposures: Exposure[] = [
      {
        id: 'display',
        questionId: a.id,
        groupId: a.groupId,
        sessionId: 'old',
        kind: 'question',
        at: now.toISOString(),
      },
      {
        id: 'explain',
        questionId: b.id,
        groupId: b.groupId,
        sessionId: 'old',
        kind: 'explanation',
        at: now.toISOString(),
      },
      {
        id: 'also-display',
        questionId: b.id,
        groupId: b.groupId,
        sessionId: 'old',
        kind: 'question',
        at: now.toISOString(),
      },
    ];
    const attempts = [{ groupId: c.groupId }] as Attempt[];
    const counts = previewComposition(selected, exposures, attempts);
    expect(counts).toMatchObject({
      total: 155,
      seen: 3,
      unseen: 152,
      sourceChecked: 155,
      expertReviewed: 0,
      realImages: 0,
      realVideos: 0,
    });
    expect(counts.diagrams).toBe(selected.filter((q) => q.media?.kind === 'diagram').length);
    expect(counts.animations).toBe(selected.filter((q) => q.media?.kind === 'sequence').length);
    const session = createThroughSession(
      questions,
      true,
      exposures,
      attempts,
      [],
      now,
      () => 0.2,
      selected.map((q) => q.id),
    );
    expect(session.questionIds).toEqual(selected.map((q) => q.id));
    expect(mockComposition(selected, session.firstSeenByQuestion)).toEqual(counts);
  });
  it('respects active strict-practice reservations and rejects a stale preview instead of substituting questions', () => {
    const selected = selectThrough(questions, true, [], () => 0.2),
      active = reserved([selected[0].id]);
    expect(
      availableMockBank(questions, [active]).some((q) => q.groupId === selected[0].groupId),
    ).toBe(false);
    expect(
      selectThrough(questions, true, [active], () => 0.2).some(
        (q) => q.groupId === selected[0].groupId,
      ),
    ).toBe(false);
    expect(() =>
      createThroughSession(
        questions,
        true,
        [],
        [],
        [active],
        now,
        () => 0.2,
        selected.map((q) => q.id),
      ),
    ).toThrow(/予約|在庫/);
    active.status = 'completed';
    expect(availableMockBank(questions, [active])).toHaveLength(600);
  });
  it('reports unavailable domain stock and never borrows reserved exam-pool or unreviewed items', () => {
    const blocked = reserved(questions.filter((q) => q.domainId === 'assessment').map((q) => q.id));
    expect(() => selectThrough(questions, true, [blocked])).toThrow(/不足/);
    const bank = questions.filter((q) => q.domainId !== 'assessment');
    const template = questions.find((q) => q.domainId === 'assessment')!;
    const exam = { ...template, id: 'exclusive', pool: 'exam' as const };
    const draft = {
      ...template,
      id: 'draft',
      review: { ...template.review, status: 'draft' as const },
    };
    expect(() => selectThrough([...bank, exam, draft], true)).toThrow(/不足/);
  });
  it('keeps its 180-minute deadline until explicitly paused, then resumes from the saved time', () => {
    const session = createThroughSession(questions, true, [], [], [], now, () => 0.4);
    expect(remainingMockSeconds(session, after(60))).toBe(10740);
    expect(remainingMockSeconds(session, after(10801))).toBe(0);

    const paused = pauseMock(session, after(60));
    expect(remainingMockSeconds(paused, after(12000))).toBe(10740);
    const resumed = resumeMock(paused, after(12000));
    expect(resumed.mock?.deadlineAt).toBe(after(22740).toISOString());
    expect(remainingMockSeconds(resumed, after(12010))).toBe(10730);
  });
  it('round-trips flags, selected order and drafts, then grades all 155 as the denominator exactly once', async () => {
    const source = db(),
      target = db();
    await source.settings.add(defaultSettings);
    await target.settings.add(defaultSettings);
    let session = createThroughSession(questions, false, [], [], [], now, () => 0.3);
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    session = withMockDraft(session, q, q.correctChoiceId, false, 12000, after(12));
    session.mock!.flags = [q.id];
    session.index = 1;
    await source.sessions.add(session);
    const backup = await exportBackup(source);
    expect(() => validateBackup(JSON.stringify(backup))).not.toThrow();
    await restoreBackup(backup, target);
    expect(await snapshot(target)).toEqual(await snapshot(source));
    target.close();
    await target.open();
    expect((await target.sessions.get(session.id))?.mock?.deadlineAt).toBe(
      after(10800).toISOString(),
    );
    await expect(finishMock(session.id, 'timeout', target, after(60))).rejects.toThrow(
      /制限時間内/,
    );
    await Promise.all([
      finishMock(session.id, 'timeout', target, after(10801)),
      finishMock(session.id, 'timeout', target, after(10801)),
    ]);
    const completed = (await target.sessions.get(session.id))!;
    expect(completed.mock).toMatchObject({
      finishedReason: 'timeout',
      remainingSeconds: 0,
      deadlineAt: null,
      format: 'through',
    });
    expect(await target.attempts.count()).toBe(1);
    expect(await target.reviews.count()).toBe(155);
    expect(mockSummary(completed, await target.attempts.toArray())).toMatchObject({
      total: 155,
      correct: 1,
      answered: 1,
      unanswered: 154,
      rate: 1,
    });
    expect((await target.reviews.get(q.id))?.wrongStreak).toBe(1);
    const exported = await exportBackup(target);
    expect(() => validateBackup(JSON.stringify(exported))).not.toThrow();
  });
  it('keeps start-time unseen inventory separate from contamination before an answer', async () => {
    const database = db();
    await database.settings.add(defaultSettings);
    let session = createThroughSession(questions, true, [], [], [], now, () => 0.4);
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    session = withMockDraft(session, q, q.correctChoiceId, true, 3000, after(3));
    const other = createSession('practice', [q], [], []);
    other.startedAt = after(1).toISOString();
    await database.sessions.bulkAdd([session, other]);
    await database.exposures.add({
      id: 'cross-tab-explanation',
      sessionId: other.id,
      questionId: q.id,
      groupId: q.groupId,
      kind: 'explanation',
      at: after(2).toISOString(),
    });
    await finishMock(session.id, 'submitted', database, after(10));
    expect(session.firstSeenByQuestion[q.id]).toBe(true);
    expect((await database.attempts.get(`${session.id}:${q.id}`))?.firstSeen).toBe(false);
  });
});
