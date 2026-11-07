import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { allQuestions, questions } from '../src/content';
import { focusMockQuestions } from '../src/content/focus-mock';
import {
  finishMock,
  mockSummary,
  pauseMock,
  selectThrough,
  startFocusMock,
  withMockDraft,
} from '../src/engines/mock';
import { LearningDB, exportBackup, restoreBackup, validateBackup } from '../src/storage/db';

const databases: LearningDB[] = [];
const database = () => {
  const db = new LearningDB(`focus-test-${crypto.randomUUID()}`);
  databases.push(db);
  return db;
};
const now = new Date('2026-11-08T03:00:00Z');
const after = new Date('2026-11-08T03:00:05Z');

afterEach(async () => {
  await Promise.all(databases.splice(0).map((db) => db.delete()));
});

describe('focus mock', () => {
  it('reuses an active set across concurrent starts and isolates it from other selections', async () => {
    const db = database();
    const [one, two] = await Promise.all([startFocusMock(db, now), startFocusMock(db, now)]);
    expect(one.id).toBe(two.id);
    expect(one.questionIds.toSorted()).toEqual(focusMockQuestions.map((q) => q.id).toSorted());
    expect(await db.sessions.toArray()).toHaveLength(1);
    expect(questions).toHaveLength(300);
    expect(selectThrough(allQuestions, true).every((q) => q.pool !== 'focus')).toBe(true);
  });

  it('validates paused answers, restores them, and scores all 20 once', async () => {
    const source = database(),
      restored = database();
    const session = await startFocusMock(source, now);
    const first = focusMockQuestions.find((q) => q.id === session.questionIds[0])!;
    const draft = withMockDraft(session, first, first.correctChoiceId, true, 5000, after);
    await source.sessions.put(pauseMock(draft, after));
    const backup = await exportBackup(source);
    expect(
      validateBackup(JSON.stringify({ ...backup, contentVersion: '2026-11-04.2' })).data.sessions,
    ).toEqual(backup.data.sessions);
    await restoreBackup(validateBackup(JSON.stringify(backup)), restored);
    expect(await restored.sessions.get(session.id)).toEqual(pauseMock(draft, after));
    const completed = await finishMock(session.id, 'submitted', restored, after);
    await finishMock(session.id, 'submitted', restored, after);
    const attempts = await restored.attempts.toArray();
    expect(attempts).toHaveLength(1);
    expect(mockSummary(completed, attempts)).toMatchObject({
      total: 20,
      correct: 1,
      unanswered: 19,
      rate: 5,
    });
    expect(validateBackup(JSON.stringify(await exportBackup(restored))).data.attempts).toEqual(
      attempts,
    );

    const wrongFormat = structuredClone(backup);
    wrongFormat.data.sessions[0].mock!.format = 'short';
    expect(() => validateBackup(JSON.stringify(wrongFormat))).toThrow('出題枠');
  });
});
