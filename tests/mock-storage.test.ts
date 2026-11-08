import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { questions } from '../src/content';
import type { Session } from '../src/domain/types';
import { createSession } from '../src/engines/learning';
import {
  createMockSession,
  finishMock,
  mockSummary,
  pauseMock,
  resumeMock,
  startMockRetake,
  withMockDraft,
} from '../src/engines/mock';
import {
  LearningDB,
  defaultSettings,
  exportBackup,
  restoreBackup,
  snapshot,
  validateBackup,
  type Backup,
} from '../src/storage/db';

const now = new Date('2026-11-04T09:00:00.000Z');
const after = (seconds: number) => new Date(now.getTime() + seconds * 1000);
let database: LearningDB, target: LearningDB;
beforeEach(async () => {
  database = new LearningDB(`mock-${crypto.randomUUID()}`);
  target = new LearningDB(`mock-target-${crypto.randomUUID()}`);
  await Promise.all([database.settings.add(defaultSettings), target.settings.add(defaultSettings)]);
});
afterEach(async () => {
  await Promise.all([database.delete(), target.delete()]);
});
async function setup(mode: 'study' | 'continuous' = 'study', answered = 0): Promise<Session> {
  let session = createMockSession(questions, 20, false, mode, [], [], now, () => 0.3);
  for (let index = 0; index < answered; index++) {
    const q = questions.find((q) => q.id === session.questionIds[index])!;
    const choice =
      index === 0 ? q.correctChoiceId : q.choices.find((c) => c.id !== q.correctChoiceId)!.id;
    session = withMockDraft(session, q, choice, index === 0, 1000, after(index + 1));
  }
  await database.sessions.add(session);
  return session;
}

describe('mock retakes', () => {
  it('creates one active retake of missed questions without modifying the original session', async () => {
    const source = await setup('study', 2);
    const original = await finishMock(source.id, 'submitted', database, after(60));
    const before = await snapshot(database);
    const [first, concurrent] = await Promise.all([
      startMockRetake(source.id, database),
      startMockRetake(source.id, database),
    ]);

    expect(first).toEqual(concurrent);
    expect(first).toMatchObject({
      mode: 'review',
      status: 'active',
      mockRetakeOf: source.id,
      questionIds: source.questionIds.slice(1),
    });
    expect(first.id).not.toBe(source.id);
    expect(Object.values(first.firstSeenByQuestion)).toEqual(Array(19).fill(false));
    expect(await snapshot(database)).toEqual({
      ...before,
      sessions: expect.arrayContaining([original, first]),
    });
    expect(await database.sessions.count()).toBe(2);

    const backup = validateBackup(JSON.stringify(await exportBackup(database)));
    await restoreBackup(backup, target);
    expect(await snapshot(target)).toEqual(await snapshot(database));
    backup.data.sessions.find((session) => session.id === first.id)!.questionIds.reverse();
    expect(() => validateBackup(JSON.stringify(backup))).toThrow(/解き直し/);

    await database.sessions.update(first.id, { status: 'completed' });
    const next = await startMockRetake(source.id, database);
    expect(next.id).not.toBe(first.id);
    expect(next.questionIds).toEqual(first.questionIds);
  });

  it('blocks ungraded or reserved sessions without making a partial retake', async () => {
    const source = await setup('study', 2);
    await expect(startMockRetake(source.id, database)).rejects.toThrow(/採点済み/);
    await finishMock(source.id, 'submitted', database, after(60));
    const reserved = questions.find((question) => question.id === source.questionIds[1])!;
    await database.sessions.add({
      ...createSession('practice', [reserved], [], []),
      practice: { batch: 'all', selection: 'strict_unseen', requestedCount: 10 },
    });
    await expect(startMockRetake(source.id, database)).rejects.toThrow(/予約中/);
    expect(await database.sessions.count()).toBe(2);
  });

  it('does not start a retake of an all-correct session', async () => {
    let source = await setup();
    for (const [index, id] of source.questionIds.entries()) {
      const question = questions.find((item) => item.id === id)!;
      source = withMockDraft(
        source,
        question,
        question.correctChoiceId,
        true,
        1000,
        after(index + 1),
      );
    }
    await database.sessions.put(source);
    await finishMock(source.id, 'submitted', database, after(60));
    await expect(startMockRetake(source.id, database)).rejects.toThrow(
      /不正解・未回答の問題はありません/,
    );
    expect(await database.sessions.count()).toBe(1);
  });
});

describe('atomic short mock grading and backup', () => {
  it('stores drafts without attempts, then grades answered questions and schedules all missed questions', async () => {
    const session = await setup('study', 2);
    expect(await database.attempts.count()).toBe(0);
    expect(await database.reviews.count()).toBe(0);
    await finishMock(session.id, 'submitted', database, after(60));
    const attempts = await database.attempts.toArray();
    expect(attempts).toHaveLength(2);
    expect(attempts.every((a) => !!a.selectedChoiceId)).toBe(true);
    expect(await database.reviews.count()).toBe(20);
    expect(await database.exposures.filter((e) => e.kind === 'explanation').count()).toBe(0);
    expect(mockSummary(session, attempts)).toMatchObject({ rate: 5, unanswered: 18 });
    expect((await database.reviews.get(session.questionIds[2]))?.wrongStreak).toBe(1);
    const backup = await exportBackup(database);
    expect(() => validateBackup(JSON.stringify(backup))).not.toThrow();
  });
  it('grades once even if two tabs submit concurrently', async () => {
    const session = await setup('study', 2);
    await Promise.all([
      finishMock(session.id, 'submitted', database, after(60)),
      finishMock(session.id, 'submitted', database, after(60)),
    ]);
    expect(await database.attempts.count()).toBe(2);
    expect((await database.reviews.get(session.questionIds[1]))?.wrongStreak).toBe(1);
  });
  it('excludes a previously exposed question from first-seen scoring', async () => {
    const session = await setup('study', 2);
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    const old = createSession('practice', [q], [], []);
    old.startedAt = after(-60).toISOString();
    await database.sessions.add(old);
    await database.exposures.add({
      id: 'old',
      questionId: q.id,
      groupId: q.groupId,
      kind: 'explanation',
      sessionId: old.id,
      at: after(-30).toISOString(),
    });
    await finishMock(session.id, 'submitted', database, after(60));
    expect((await database.attempts.get(`${session.id}:${q.id}`))?.firstSeen).toBe(false);
    expect(
      (await database.attempts.get(`${session.id}:${session.questionIds[1]}`))?.firstSeen,
    ).toBe(true);
  });
  it('does not allow an early timeout and grades an expired continuous session without empty attempts', async () => {
    const session = await setup('continuous');
    await expect(finishMock(session.id, 'timeout', database, after(1))).rejects.toThrow(
      /制限時間内/,
    );
    expect((await database.sessions.get(session.id))?.status).toBe('active');
    await finishMock(session.id, 'timeout', database, after(1401));
    const completed = (await database.sessions.get(session.id))!;
    expect(completed.mock).toMatchObject({
      remainingSeconds: 0,
      finishedReason: 'timeout',
      deadlineAt: null,
    });
    expect(await database.attempts.count()).toBe(0);
    expect(mockSummary(completed, [])).toMatchObject({ rate: 0, unanswered: 20 });
  });
  it('round-trips a paused session including flags, order and drafts, and keeps legacy v1 sessions valid', async () => {
    const session = await setup('study', 2);
    const paused = pauseMock(session, after(30));
    paused.mock!.flags = [session.questionIds[0]];
    await database.sessions.put(paused);
    const legacy = createSession('practice', [questions[0]], [], []);
    await database.sessions.add(legacy);
    const backup = await exportBackup(database);
    expect(backup.formatVersion).toBe(1);
    await restoreBackup(backup, target);
    expect(await snapshot(target)).toEqual(await snapshot(database));
    target.close();
    await target.open();
    expect((await target.sessions.get(session.id))?.mock).toEqual(paused.mock);
    expect((await target.sessions.get(legacy.id))?.mock).toBeUndefined();
  });
  it('round-trips an explicitly paused continuous session and its rebased deadline', async () => {
    const source = await setup('continuous', 2);
    const paused = pauseMock(source, after(30.25));
    await database.sessions.put(paused);

    const backup = validateBackup(JSON.stringify(await exportBackup(database)));
    await restoreBackup(backup, target);
    expect(await target.sessions.get(source.id)).toEqual(paused);

    const resumed = resumeMock(paused, after(2500));
    await target.sessions.put(resumed);
    const running = validateBackup(JSON.stringify(await exportBackup(target)));
    expect(running.data.sessions).toEqual([resumed]);
    running.data.sessions[0].mock!.deadlineAt = after(3900).toISOString();
    expect(() => validateBackup(JSON.stringify(running))).toThrow();
  });

  const corruptions: { name: string; mutate: (b: Backup) => void }[] = [
    {
      name: 'missing mock data',
      mutate: (b) => {
        delete b.data.sessions[0].mock;
      },
    },
    {
      name: 'mock data on a practice session',
      mutate: (b) => {
        b.data.sessions[0].mode = 'practice';
      },
    },
    {
      name: 'invalid question count',
      mutate: (b) => {
        b.data.sessions[0].mock!.questionCount = 10;
      },
    },
    {
      name: 'remaining above limit',
      mutate: (b) => {
        b.data.sessions[0].mock!.remainingSeconds = 9999;
      },
    },
    {
      name: 'unknown flag',
      mutate: (b) => {
        b.data.sessions[0].mock!.flags = ['missing'];
      },
    },
    {
      name: 'duplicate flags',
      mutate: (b) => {
        const s = b.data.sessions[0];
        s.mock!.flags = [s.questionIds[0], s.questionIds[0]];
      },
    },
    {
      name: 'unknown draft question',
      mutate: (b) => {
        const m = b.data.sessions[0].mock!;
        m.draftAnswers.missing = Object.values(m.draftAnswers)[0];
      },
    },
    {
      name: 'unknown draft choice',
      mutate: (b) => {
        Object.values(b.data.sessions[0].mock!.draftAnswers)[0].choiceId = 'missing';
      },
    },
    {
      name: 'running session without a deadline',
      mutate: (b) => {
        b.data.sessions[0].mock!.deadlineAt = null;
      },
    },
    {
      name: 'legacy continuous mode marked paused without a saved clock',
      mutate: (b) => {
        const m = b.data.sessions[0].mock!;
        m.timeMode = 'continuous';
        m.paused = true;
        m.deadlineAt = null;
      },
    },
  ];
  for (const { name, mutate } of corruptions)
    it(`rejects ${name} without changing existing records`, async () => {
      await setup('study', 1);
      const before = await snapshot(database);
      const backup = await exportBackup(database);
      mutate(backup);
      await expect(restoreBackup(backup, database)).rejects.toThrow();
      expect(await snapshot(database)).toEqual(before);
    });
  it('rejects a completed mock whose answer ledger is missing a graded draft', async () => {
    const session = await setup('study', 2);
    await finishMock(session.id, 'submitted', database, after(60));
    const backup = await exportBackup(database);
    backup.data.attempts.pop();
    expect(() => validateBackup(JSON.stringify(backup))).toThrow(/下書きと採点履歴/);
  });
  it('keeps a local active mock and its ledger together when importing the completed copy', async () => {
    const session = await setup('study', 1);
    await target.sessions.add(structuredClone(session));
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    const exposure = {
      id: `${session.id}:${q.id}:question`,
      questionId: q.id,
      groupId: q.groupId,
      kind: 'question' as const,
      sessionId: session.id,
      at: after(5).toISOString(),
    };
    await database.exposures.add(exposure);
    await target.exposures.add({ ...exposure, at: after(10).toISOString() });
    await finishMock(session.id, 'submitted', database, after(60));
    await restoreBackup(await exportBackup(database), target);
    expect((await target.sessions.get(session.id))?.status).toBe('active');
    expect(await target.attempts.count()).toBe(0);
    expect(await target.reviews.count()).toBe(0);
    expect((await target.exposures.get(exposure.id))?.at).toBe(exposure.at);
    const combined = await exportBackup(target);
    expect(() => validateBackup(JSON.stringify(combined))).not.toThrow();
    await finishMock(session.id, 'submitted', target, after(90));
    expect(await target.attempts.count()).toBe(1);
  });
  it('keeps a local completed mock when importing the older active copy', async () => {
    const session = await setup('study', 1);
    const active = await exportBackup(database);
    await finishMock(session.id, 'submitted', database, after(60));
    const before = await snapshot(database);
    await restoreBackup(active, database);
    expect(await snapshot(database)).toEqual(before);
  });
  it('preserves local completed drafts and attempts when another completed copy answered more questions', async () => {
    const session = await setup('study', 2);
    const local = structuredClone(session);
    delete local.mock!.draftAnswers[session.questionIds[1]];
    await target.sessions.add(local);
    await finishMock(session.id, 'submitted', target, after(70));
    await finishMock(session.id, 'submitted', database, after(60));
    const before = await snapshot(target);
    await restoreBackup(await exportBackup(database), target);
    expect(await snapshot(target)).toEqual(before);
    const combined = await exportBackup(target);
    expect(() => validateBackup(JSON.stringify(combined))).not.toThrow();
  });
  it('rolls back all writes if separately valid backups compose into an invalid ledger', async () => {
    const session = await setup('study', 1);
    await finishMock(session.id, 'submitted', database, after(60));
    const incoming = await exportBackup(database),
      existing = incoming.data.attempts[0];
    const q = questions.find((q) => q.id === existing.questionId)!;
    const other = createSession('practice', [q], [], []);
    other.startedAt = now.toISOString();
    await target.sessions.add(other);
    other.choiceOrders[q.id] = [...existing.choiceOrder];
    await target.sessions.put(other);
    await target.attempts.add({ ...existing, sessionId: other.id });
    const before = await snapshot(target);
    expect(() => validateBackup(JSON.stringify({ ...incoming, data: before }))).not.toThrow();
    await expect(restoreBackup(incoming, target)).rejects.toThrow(/下書きと採点履歴/);
    expect(await snapshot(target)).toEqual(before);
  });
  it('does not retroactively remove first-seen status for an explanation opened after the saved answer', async () => {
    const session = await setup('study', 1);
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    const later = createSession('practice', [q], [], []);
    later.startedAt = after(5).toISOString();
    await database.sessions.add(later);
    await database.exposures.add({
      id: 'later',
      questionId: q.id,
      groupId: q.groupId,
      kind: 'explanation',
      sessionId: later.id,
      at: after(10).toISOString(),
    });
    await finishMock(session.id, 'submitted', database, after(60));
    expect((await database.attempts.get(`${session.id}:${q.id}`))?.firstSeen).toBe(true);
  });
  it('does not mark unseen unanswered prompts as exposed merely because grading completed', async () => {
    const session = await setup('study');
    await finishMock(session.id, 'submitted', database, after(60));
    expect(await database.exposures.count()).toBe(0);
  });
});
