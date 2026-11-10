import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { practiceQuestions, questions } from '../src/content';
import { advancedTargets, v062ContentVersion } from '../src/content/release';
import { expansionQuestionIds, initialQuestionIds } from '../src/content/batches';
import type { Attempt, Exposure, Question, Session } from '../src/domain/types';
import { createSession, isFirstSeen, partitionAttempts } from '../src/engines/learning';
import {
  practiceAllocation,
  advancedPracticeOptions,
  practiceInventory,
  reservedStrictGroups,
  selectPracticeQuestions,
  type PracticeHistory,
  type PracticeOptions,
} from '../src/engines/practice-selection';
import { recordPracticeResultsDisplay, startPracticeSession } from '../src/app/actions';
import {
  LearningDB,
  defaultSettings,
  exportBackup,
  restoreBackup,
  validateBackup,
} from '../src/storage/db';

const empty = (): PracticeHistory => ({ attempts: [], exposures: [], sessions: [] });
const strict: PracticeOptions = {
  batch: 'expansion-2026-11-04',
  selection: 'strict_unseen',
  requestedCount: 50,
};
const expansion = questions.filter((question) => expansionQuestionIds.has(question.id));
const byDomain = (items: readonly Question[]) =>
  Object.fromEntries(
    ['assessment', 'planning', 'technique', 'safety'].map((id) => [
      id,
      items.filter((question) => question.domainId === id).length,
    ]),
  );
const at = '2026-11-05T00:00:00.000Z';
function exposure(
  question: Question,
  kind: Exposure['kind'] = 'question',
  sessionId = 'prior',
): Exposure {
  return {
    id: `${sessionId}:${question.id}:${kind}`,
    questionId: question.id,
    groupId: question.groupId,
    kind,
    sessionId,
    at,
  };
}
function attempt(question: Question, sessionId = 'prior', patch: Partial<Attempt> = {}): Attempt {
  return {
    id: `${sessionId}:${question.id}`,
    sessionId,
    questionId: question.id,
    questionRevision: question.revision,
    groupId: question.groupId,
    domainId: question.domainId,
    unitId: question.unitId,
    selectedChoiceId: question.correctChoiceId,
    correctChoiceId: question.correctChoiceId,
    correct: true,
    firstSeen: true,
    canExplain: true,
    elapsedMs: 1000,
    choiceOrder: question.choices.map((choice) => choice.id),
    at,
    ...patch,
  };
}
const databases: LearningDB[] = [];
afterEach(async () => {
  for (const database of databases.splice(0)) {
    database.close();
    await database.delete();
  }
});
const database = () => {
  const database = new LearningDB(`practice-selection-${crypto.randomUUID()}`);
  databases.push(database);
  return database;
};

describe('release catalog and strict stock', () => {
  it('isolates all 50 advanced questions from ordinary practice and requires unseen selection', () => {
    const advanced = selectPracticeQuestions(
      practiceQuestions,
      false,
      empty(),
      advancedPracticeOptions,
    );
    expect(advanced).toHaveLength(50);
    expect(byDomain(advanced)).toEqual(advancedTargets);
    expect(new Set(advanced.map((question) => question.groupId)).size).toBe(50);
    const ordinary = { ...advancedPracticeOptions, batch: 'all' as const };
    expect(practiceInventory(practiceQuestions, true, empty(), ordinary).total).toBe(
      questions.length,
    );
    expect(() =>
      selectPracticeQuestions(practiceQuestions, true, empty(), {
        ...advancedPracticeOptions,
        selection: 'review',
      }),
    ).toThrow(/厳密な未見演習/);
    const history = { ...empty(), exposures: [exposure(advanced[0], 'explanation')] };
    expect(
      practiceInventory(practiceQuestions, false, history, advancedPracticeOptions),
    ).toMatchObject({
      available: 49,
      missing: 1,
    });
    expect(() =>
      selectPracticeQuestions(practiceQuestions, false, history, advancedPracticeOptions),
    ).toThrow(/既出問題で補充しません/);
  });

  it('restores a pre-advanced backup and preserves both active reservations through export and restore', async () => {
    const original = database();
    const prior = await startPracticeSession(strict, original);
    const upgraded = database();
    const oldBackup = { ...(await exportBackup(original)), contentVersion: v062ContentVersion };
    await restoreBackup(oldBackup, upgraded);
    const fresh = await startPracticeSession(advancedPracticeOptions, upgraded);
    expect(fresh.questionIds).toHaveLength(50);
    expect(Object.values(fresh.firstSeenByQuestion).every(Boolean)).toBe(true);
    expect(await upgraded.sessions.get(prior.id)).toEqual(prior);
    await expect(startPracticeSession(advancedPracticeOptions, upgraded)).rejects.toThrow(
      /50問不足/,
    );
    const transferred = database();
    await restoreBackup(await exportBackup(upgraded), transferred);
    expect(await transferred.sessions.get(fresh.id)).toEqual(fresh);
    expect(await transferred.sessions.get(prior.id)).toEqual(prior);
  });

  it('identifies the actual additional 200 independently of the initial 100', () => {
    expect(initialQuestionIds.size).toBe(100);
    expect(expansionQuestionIds.size).toBe(200);
    expect([...expansionQuestionIds].filter((id) => initialQuestionIds.has(id))).toEqual([]);
    expect(new Set(expansion.map((question) => question.groupId)).size).toBe(200);
    expect(byDomain(expansion)).toEqual({
      assessment: 46,
      planning: 64,
      technique: 62,
      safety: 28,
    });
    const selected = selectPracticeQuestions(questions, false, empty(), strict, () => 0.2);
    expect(selected.every((question) => expansionQuestionIds.has(question.id))).toBe(true);
  });

  it('excludes all question, explanation and answer exposures across modes and alternate versions', () => {
    const bank = expansion.slice(0, 14),
      alias = { ...bank[0], id: 'test-alternate-id', groupId: bank[0].groupId };
    const history = {
      ...empty(),
      exposures: [exposure(bank[0]), exposure(bank[1], 'explanation', 'old-mock')],
      attempts: [attempt(bank[2], 'old-review')],
    };
    const selected = selectPracticeQuestions(
      [...bank, alias],
      true,
      history,
      { ...strict, batch: 'all', requestedCount: 10 },
      () => 0.6,
    );
    expect(selected).toHaveLength(10);
    expect(
      selected.every(
        (question) => !bank.slice(0, 3).some((seen) => seen.groupId === question.groupId),
      ),
    ).toBe(true);
    expect(new Set(selected.map((question) => question.groupId)).size).toBe(10);
  });

  it('reserves every selected group of an active strict session, even before display', () => {
    const first = selectPracticeQuestions(questions, false, empty(), strict, () => 0.25);
    const active = createSession('practice', first, [], []);
    active.practice = strict;
    const history = { ...empty(), sessions: [active] };
    expect(reservedStrictGroups(history.sessions, questions).size).toBe(50);
    for (const selection of ['strict_unseen', 'unseen_first', 'review'] as const) {
      const selected = selectPracticeQuestions(
        questions,
        false,
        history,
        { ...strict, selection },
        () => 0.8,
      );
      expect(
        selected.some((question) =>
          first.some((reserved) => question.groupId === reserved.groupId),
        ),
      ).toBe(false);
    }
    expect(practiceInventory(questions, false, history, strict)).toMatchObject({
      available: 150,
      unseen: 150,
      seen: 0,
      reserved: 50,
    });
    active.status = 'completed';
    expect(reservedStrictGroups([active], questions).size).toBe(0);
  });

  it('runs four 50-question rounds without group reuse and reallocates from remaining domains', () => {
    const history = empty(),
      all: Question[] = [],
      allocations: ReturnType<typeof byDomain>[] = [];
    for (let round = 0; round < 4; round++) {
      const inventory = practiceInventory(questions, false, history, strict);
      const selected = selectPracticeQuestions(questions, false, history, strict, () => 0.43);
      expect(byDomain(selected)).toEqual(inventory.allocation);
      expect(selected).toHaveLength(50);
      expect(
        selected.some((question) => all.some((prior) => prior.groupId === question.groupId)),
      ).toBe(false);
      const session = createSession(
        'practice',
        selected,
        history.exposures as Exposure[],
        history.attempts as Attempt[],
      );
      session.practice = strict;
      session.status = 'completed';
      (history.sessions as Session[]).push(session);
      (history.exposures as Exposure[]).push(
        ...selected.map((question) => exposure(question, 'question', session.id)),
      );
      (history.attempts as Attempt[]).push(
        ...selected.map((question) => attempt(question, session.id)),
      );
      allocations.push(byDomain(selected));
      all.push(...selected);
    }
    expect(allocations[0]).toEqual({ assessment: 12, planning: 16, technique: 15, safety: 7 });
    expect(
      allocations.some(
        (allocation) => JSON.stringify(allocation) !== JSON.stringify(allocations[0]),
      ),
    ).toBe(true);
    expect(new Set(all.map((question) => question.groupId)).size).toBe(200);
    expect(byDomain(all)).toEqual(byDomain(expansion));
    expect(practiceInventory(questions, false, history, strict)).toMatchObject({
      available: 0,
      missing: 50,
    });
    expect(() => selectPracticeQuestions(questions, false, history, strict)).toThrow(/不足/);
  });

  it('never silently backfills scarce strict stock, but allows an explicit smaller session', () => {
    const history = {
      ...empty(),
      exposures: expansion.slice(3).map((question) => exposure(question)),
    };
    const inventory = practiceInventory(questions, false, history, {
      ...strict,
      requestedCount: 10,
    });
    expect(inventory).toMatchObject({ available: 3, unseen: 3, seen: 197, missing: 7 });
    expect(() =>
      selectPracticeQuestions(questions, false, history, { ...strict, requestedCount: 10 }),
    ).toThrow(/7問不足/);
    const selected = selectPracticeQuestions(questions, false, history, {
      ...strict,
      requestedCount: 10,
      allowSmaller: true,
    });
    expect(new Set(selected.map((question) => question.id))).toEqual(
      new Set(expansion.slice(0, 3).map((question) => question.id)),
    );
  });

  it('prioritizes all unseen before repeats, while explicit review may select seen groups', () => {
    const history = {
      ...empty(),
      exposures: expansion.slice(0, 190).map((question) => exposure(question, 'explanation')),
    };
    const normal = selectPracticeQuestions(
      questions,
      false,
      history,
      { ...strict, selection: 'unseen_first', requestedCount: 10 },
      () => 0.19,
    );
    expect(normal.every((question) => expansion.slice(190).includes(question))).toBe(true);
    const review = selectPracticeQuestions(
      questions,
      false,
      history,
      { ...strict, selection: 'review' },
      () => 0.19,
    );
    expect(review.some((question) => expansion.slice(0, 190).includes(question))).toBe(true);
    expect(
      practiceInventory(questions, false, history, {
        ...strict,
        selection: 'unseen_first',
        requestedCount: 20,
      }).allocation,
    ).toEqual(
      byDomain(
        selectPracticeQuestions(
          questions,
          false,
          history,
          { ...strict, selection: 'unseen_first', requestedCount: 20 },
          () => 0.19,
        ),
      ),
    );
  });

  it('keeps diagnostic and dedicated exam pools reserved and rejects unreviewed/stale questions', () => {
    const bank = [
      ...questions,
      { ...questions[0], id: 'future-exam', groupId: 'future-exam', pool: 'exam' as const },
      {
        ...questions[0],
        id: 'draft-test',
        groupId: 'draft-test',
        pool: 'practice' as const,
        review: { ...questions[0].review, status: 'draft' as const },
      },
      {
        ...questions[0],
        id: 'stale-test',
        groupId: 'stale-test',
        pool: 'practice' as const,
        revision: 2,
      },
    ];
    const options = { ...strict, batch: 'all' as const, requestedCount: 50 as const };
    const history = empty();
    const selected = selectPracticeQuestions(bank, false, history, options);
    expect(selected.every((question) => question.pool === 'practice')).toBe(true);
    expect(practiceInventory(bank, false, history, options).total).toBe(550);
    expect(practiceInventory(bank, true, history, options).total).toBe(600);
    expect(() => practiceAllocation(expansion, 201)).toThrow();
    expect(() =>
      selectPracticeQuestions(bank, true, history, { ...options, requestedCount: 155 as 50 }),
    ).toThrow(/条件/);
  });

  it('keeps a later explanation or other-tab exposure out of strict evaluation', () => {
    const question = expansion[0],
      session = createSession('practice', [question], [], []);
    session.practice = { ...strict, requestedCount: 10 };
    expect(isFirstSeen(question, session, [exposure(question, 'question', session.id)], [])).toBe(
      true,
    );
    const shown = [
      exposure(question, 'question', session.id),
      exposure(question, 'explanation', 'other-tab'),
    ];
    expect(isFirstSeen(question, session, shown, [])).toBe(false);
    const saved = attempt(question, session.id, {
      firstSeen: false,
      at: '2026-11-05T00:01:00.000Z',
    });
    expect(partitionAttempts([saved], shown)).toEqual({ first: [], repeat: [saved] });
  });
});

describe('atomic IndexedDB selection', () => {
  it('blocks an old completed result before recording any question reserved by a newer strict session', async () => {
    const local = database(),
      selected = expansion.slice(0, 10);
    const old = createSession('practice', selected, [], []);
    old.status = 'completed';
    old.completedAt = at;
    const reserved = createSession('practice', selected, [], []);
    reserved.practice = { ...strict, requestedCount: 10 };
    await local.sessions.bulkAdd([old, reserved]);
    expect(await recordPracticeResultsDisplay(old.id, local)).toEqual({
      status: 'reserved',
      sessionIds: [reserved.id],
      count: 10,
    });
    expect(await local.exposures.count()).toBe(0);
    await local.sessions.update(reserved.id, { status: 'completed', completedAt: at });
    expect(await recordPracticeResultsDisplay(old.id, local)).toEqual({ status: 'ready' });
    expect(
      (await local.exposures.toArray()).every((exposure) => exposure.sessionId === old.id),
    ).toBe(true);
    expect(await local.exposures.count()).toBe(10);
    expect(await recordPracticeResultsDisplay('missing-session', local)).toEqual({
      status: 'stale',
    });
  });
  it('serializes concurrent starts and reserves 200 distinct groups before any question displays', async () => {
    const local = database();
    await local.settings.put({ ...defaultSettings, diagnosticStatus: 'skipped' });
    const sessions = await Promise.all(
      Array.from({ length: 4 }, () => startPracticeSession(strict, local)),
    );
    expect(sessions.flatMap((session) => session.questionIds)).toHaveLength(200);
    expect(new Set(sessions.flatMap((session) => session.questionIds)).size).toBe(200);
    expect(await local.exposures.count()).toBe(0);
    expect(await local.attempts.count()).toBe(0);
    await expect(startPracticeSession(strict, local)).rejects.toThrow(/不足/);
    expect(await local.sessions.count()).toBe(4);
    const restored = validateBackup(JSON.stringify(await exportBackup(local)));
    expect(restored.data.sessions.map((session) => session.practice)).toEqual(
      sessions.map(() => strict),
    );
  });

  it('re-reads updated history/settings/favorites and requires reconfirmation if smaller stock changes', async () => {
    const local = database();
    const session = createSession('practice', expansion.slice(3), [], []);
    session.status = 'completed';
    await local.sessions.add(session);
    await local.exposures.bulkAdd(
      expansion.slice(3).map((question) => exposure(question, 'explanation', session.id)),
    );
    await expect(
      startPracticeSession(
        { ...strict, requestedCount: 10, allowSmaller: true, expectedAvailableCount: 4 },
        local,
      ),
    ).rejects.toThrow(/変わりました/);
    expect(await local.sessions.count()).toBe(1);
    const smaller = await startPracticeSession(
      { ...strict, requestedCount: 10, allowSmaller: true, expectedAvailableCount: 3 },
      local,
    );
    expect(smaller.questionIds).toHaveLength(3);
    expect(smaller.practice?.requestedCount).toBe(10);
    await local.favorites.put({
      questionId: questions.find((question) => question.pool === 'diagnostic')!.id,
    });
    await expect(
      startPracticeSession(
        {
          ...strict,
          batch: 'all',
          selection: 'review',
          requestedCount: 10,
          allowSmaller: true,
          onlyFavorites: true,
        },
        local,
      ),
    ).rejects.toThrow(/利用できる/);
    await local.settings.put({ ...defaultSettings, diagnosticStatus: 'skipped' });
    const favorite = await startPracticeSession(
      {
        ...strict,
        batch: 'all',
        selection: 'review',
        requestedCount: 10,
        allowSmaller: true,
        onlyFavorites: true,
      },
      local,
    );
    expect(favorite.questionIds).toHaveLength(1);
    expect(questions.find((question) => question.id === favorite.questionIds[0])!.pool).toBe(
      'diagnostic',
    );
  });
});
