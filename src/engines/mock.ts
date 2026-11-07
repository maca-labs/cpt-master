import type { Attempt, DomainId, Exposure, Question, Session } from '../domain/types';
import { allQuestions } from '../content';
import { domainIds, domains } from '../content/blueprints';
import { focusMock, focusMockQuestions } from '../content/focus-mock';
import { createSession, eligible, isFirstSeen, nextReview, shuffle } from './learning';
import { db, recordExposure, type LearningDB } from '../storage/db';
import { reservedStrictGroups } from './practice-selection';

export type MockState = NonNullable<Session['mock']>;
export const THROUGH_QUESTION_COUNT = 155;
export const THROUGH_LIMIT_SECONDS = 180 * 60;

/** Strict practice reservations are not silently consumed by timed exercises. */
export function availableMockBank(bank: Question[], sessions: readonly Session[]) {
  const reserved = reservedStrictGroups(sessions, bank);
  return bank.filter((q) => !reserved.has(q.groupId));
}

export type MockDisplay =
  | { status: 'ready' }
  | { status: 'stale' }
  | { status: 'reserved'; sessionIds: string[]; count: number };

/** Older sessions must also respect reservations made after they were created.
 * The sessions lock serializes this check with strict-practice selection. */
export async function recordMockDisplay(
  sessionId: string,
  questionIds: string[],
  database: LearningDB = db,
  now = new Date(),
): Promise<MockDisplay> {
  return database.transaction('rw', [database.sessions, database.exposures], async () => {
    const session = await database.sessions.get(sessionId);
    if (!session?.mock || session.mode !== 'mock') throw new Error('学習用演習が見つかりません。');
    if (
      !questionIds.length ||
      questionIds.some((id) => !session.questionIds.includes(id)) ||
      (session.status === 'active' &&
        (session.mock.paused ||
          questionIds.length !== 1 ||
          session.questionIds[session.index] !== questionIds[0]))
    )
      return { status: 'stale' };
    const selected = questionIds.map((id) => allQuestions.find((q) => q.id === id)!);
    const groups = new Set(selected.map((q) => q.groupId));
    const blockers = (await database.sessions.toArray()).filter(
      (other) =>
        other.status === 'active' &&
        other.mode === 'practice' &&
        other.practice?.selection === 'strict_unseen' &&
        other.questionIds.some((id) => groups.has(allQuestions.find((q) => q.id === id)!.groupId)),
    );
    if (blockers.length) {
      const reserved = reservedStrictGroups(blockers, allQuestions);
      return {
        status: 'reserved',
        sessionIds: blockers.map((other) => other.id),
        count: selected.filter((q) => reserved.has(q.groupId)).length,
      };
    }
    for (const question of selected)
      await recordExposure(
        {
          id: `${session.id}:${question.id}:question`,
          questionId: question.id,
          groupId: question.groupId,
          kind: 'question',
          sessionId: session.id,
          at: now.toISOString(),
        },
        database,
      );
    return { status: 'ready' };
  });
}

export function mockComposition(
  selected: Question[],
  firstSeenByQuestion: Record<string, boolean>,
) {
  const unseen = selected.filter((q) => firstSeenByQuestion[q.id] === true).length;
  return {
    total: selected.length,
    unseen,
    seen: selected.length - unseen,
    diagrams: selected.filter((q) => q.media?.kind === 'diagram').length,
    animations: selected.filter((q) => q.media?.kind === 'sequence').length,
    realImages: selected.filter((q) => q.context === 'image' && !q.media).length,
    realVideos: selected.filter((q) => q.context === 'video' && !q.media).length,
    sourceChecked: selected.filter(
      (q) => q.review.status === 'source_checked' && q.review.reviewerType === 'ai',
    ).length,
    expertReviewed: selected.filter(
      (q) => q.review.status === 'expert_reviewed' && q.review.reviewerType === 'human_expert',
    ).length,
  };
}

export function previewComposition(
  selected: Question[],
  exposures: Exposure[],
  attempts: Attempt[],
) {
  const seen = new Set([...exposures.map((e) => e.groupId), ...attempts.map((a) => a.groupId)]);
  return mockComposition(
    selected,
    Object.fromEntries(selected.map((q) => [q.id, !seen.has(q.groupId)])),
  );
}

export function selectThrough(
  bank: Question[],
  unlocked: boolean,
  sessions: readonly Session[] = [],
  rng: () => number = Math.random,
) {
  return selectMock(availableMockBank(bank, sessions), THROUGH_QUESTION_COUNT, unlocked, rng);
}

/** A separate learning format; this does not grant exclusive-exam eligibility. */
export function createThroughSession(
  bank: Question[],
  unlocked: boolean,
  exposures: Exposure[],
  attempts: Attempt[],
  sessions: readonly Session[] = [],
  now = new Date(),
  rng: () => number = Math.random,
  previewIds?: string[],
): Session {
  const available = availableMockBank(bank, sessions).filter(
    (q) => eligible(q) && (q.pool === 'practice' || (unlocked && q.pool === 'diagnostic')),
  );
  const selected = previewIds
    ? previewIds.map((id) => available.find((q) => q.id === id))
    : selectThrough(bank, unlocked, sessions, rng);
  if (
    selected.length !== THROUGH_QUESTION_COUNT ||
    selected.some((q) => !q) ||
    new Set(selected.map((q) => q?.groupId)).size !== THROUGH_QUESTION_COUNT
  )
    throw new Error(
      '候補の在庫または未見演習の予約が変わりました。通し演習の出題構成を再確認してください。',
    );
  const checked = selected as Question[];
  const allocation = mockAllocation(THROUGH_QUESTION_COUNT);
  if (domainIds.some((id) => checked.filter((q) => q.domainId === id).length !== allocation[id]))
    throw new Error('学習用通し演習の分野配分が不正です。');
  return startTimedMock(
    checked,
    exposures,
    attempts,
    'through',
    'continuous',
    THROUGH_LIMIT_SECONDS,
    now,
    rng,
  );
}
export function mockAllocation(count: number): Record<DomainId, number> {
  if (!Number.isInteger(count) || count < 1 || count > 155) throw new Error('問題数が不正です。');
  const total = domainIds.reduce((sum, id) => sum + domains[id].scored, 0);
  const rows = domainIds.map((id, index) => ({
    id,
    index,
    exact: (count * domains[id].scored) / total,
  }));
  const result = Object.fromEntries(rows.map((row) => [row.id, Math.floor(row.exact)])) as Record<
    DomainId,
    number
  >;
  let remaining = count - Object.values(result).reduce((a, b) => a + b, 0);
  rows.sort(
    (a, b) => b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)) || a.index - b.index,
  );
  for (const row of rows) if (remaining-- > 0) result[row.id]++;
  return result;
}

function plan(bank: Question[], count: number, unlocked: boolean, rng: () => number) {
  const allocation = mockAllocation(count);
  const pool = bank.filter(
    (q) => eligible(q) && (q.pool === 'practice' || (unlocked && q.pool === 'diagnostic')),
  );
  const slots = domainIds.flatMap((id) => Array<DomainId>(allocation[id]).fill(id));
  const choices = new Map(
    domainIds.map((id) => [
      id,
      shuffle([...new Set(pool.filter((q) => q.domainId === id).map((q) => q.groupId))], rng),
    ]),
  );
  const assigned = new Map<string, number>();
  const assign = (slot: number, visited: Set<string>): boolean => {
    for (const group of choices.get(slots[slot])!) {
      if (visited.has(group)) continue;
      visited.add(group);
      const prior = assigned.get(group);
      if (prior === undefined || assign(prior, visited)) {
        assigned.set(group, slot);
        return true;
      }
    }
    return false;
  };
  slots.forEach((_, index) => assign(index, new Set()));
  const entries = [...assigned].map(([group, slot]) => ({ group, domainId: slots[slot] }));
  return {
    pool,
    entries,
    availability: domainIds.map((id) => ({
      id,
      needed: allocation[id],
      available: choices.get(id)!.length,
      missing: allocation[id] - entries.filter((entry) => entry.domainId === id).length,
    })),
  };
}
export function mockAvailability(bank: Question[], count: number, unlocked: boolean) {
  return plan(bank, count, unlocked, () => 0.5).availability;
}
export function selectMock(
  bank: Question[],
  count: number,
  unlocked: boolean,
  rng: () => number = Math.random,
) {
  const result = plan(bank, count, unlocked, rng);
  if (result.entries.length !== count)
    throw new Error(`照合済みの学習用問題が${count - result.entries.length}問不足しています。`);
  return shuffle(
    result.entries.map(
      ({ group, domainId }) =>
        shuffle(
          result.pool.filter((q) => q.groupId === group && q.domainId === domainId),
          rng,
        )[0],
    ),
    rng,
  );
}
export function createMockSession(
  bank: Question[],
  count: 10 | 20 | 50,
  unlocked: boolean,
  timeMode: MockState['timeMode'],
  exposures: Exposure[],
  attempts: Attempt[],
  now = new Date(),
  rng: () => number = Math.random,
): Session {
  if (![10, 20, 50].includes(count)) throw new Error('短縮模試は10・20・50問から選んでください。');
  const selected = selectMock(bank, count, unlocked, rng);
  return startTimedMock(selected, exposures, attempts, 'short', timeMode, count * 70, now, rng);
}

export async function startFocusMock(database: LearningDB = db, now = new Date()) {
  return database.transaction(
    'rw',
    [database.sessions, database.exposures, database.attempts],
    async () => {
      const active = await database.sessions
        .where('status')
        .equals('active')
        .filter((s) => s.mock?.format === 'focus')
        .first();
      if (active) return active;
      const selected = focusMockQuestions.filter(eligible);
      if (
        selected.length !== focusMock.questionCount ||
        new Set(selected.map((q) => q.groupId)).size !== selected.length
      )
        throw new Error('集中模試の問題セットが揃っていません。');
      const session = startTimedMock(
        shuffle(selected),
        await database.exposures.toArray(),
        await database.attempts.toArray(),
        'focus',
        'study',
        focusMock.limitSeconds,
        now,
        Math.random,
      );
      await database.sessions.add(session);
      return session;
    },
  );
}

function startTimedMock(
  selected: Question[],
  exposures: Exposure[],
  attempts: Attempt[],
  format: MockState['format'],
  timeMode: MockState['timeMode'],
  limitSeconds: number,
  now: Date,
  rng: () => number,
): Session {
  return {
    ...createSession('mock', selected, exposures, attempts, rng),
    startedAt: now.toISOString(),
    mock: {
      format,
      questionCount: selected.length as MockState['questionCount'],
      timeMode,
      limitSeconds,
      remainingSeconds: limitSeconds,
      deadlineAt: new Date(now.getTime() + limitSeconds * 1000).toISOString(),
      paused: false,
      flags: [],
      draftAnswers: {},
    },
  };
}
export function remainingMockSeconds(session: Session, now = new Date()) {
  const state = session.mock;
  if (!state) throw new Error('短縮模試の設定がありません。');
  return state.paused || !state.deadlineAt
    ? state.remainingSeconds
    : Math.max(
        0,
        Math.min(
          state.limitSeconds,
          Math.ceil((Date.parse(state.deadlineAt) - now.getTime()) / 1000),
        ),
      );
}
export function pauseMock(session: Session, now = new Date()): Session {
  if (!session.mock || session.mode !== 'mock' || session.status !== 'active')
    throw new Error('進行中の短縮模試ではありません。');
  if (session.mock.format === 'through' || session.mock.timeMode !== 'study')
    throw new Error('時間継続モードでは停止できません。');
  return {
    ...session,
    mock: {
      ...session.mock,
      paused: true,
      remainingSeconds: remainingMockSeconds(session, now),
      deadlineAt: null,
    },
  };
}
export function resumeMock(session: Session, now = new Date()): Session {
  if (
    !session.mock ||
    session.mock.format === 'through' ||
    session.status !== 'active' ||
    !session.mock.paused
  )
    throw new Error('停止中の短縮模試ではありません。');
  return {
    ...session,
    mock: {
      ...session.mock,
      paused: false,
      deadlineAt: new Date(now.getTime() + session.mock.remainingSeconds * 1000).toISOString(),
    },
  };
}
export function withMockDraft(
  session: Session,
  question: Question,
  choiceId: string,
  canExplain: boolean,
  elapsedMs: number,
  now = new Date(),
): Session {
  if (
    session.status !== 'active' ||
    !session.mock ||
    session.mock.paused ||
    remainingMockSeconds(session, now) <= 0
  )
    throw new Error('回答を保存できる状態ではありません。');
  if (
    !session.questionIds.includes(question.id) ||
    !question.choices.some((choice) => choice.id === choiceId)
  )
    throw new Error('設問または選択肢が不正です。');
  const old = session.mock.draftAnswers[question.id];
  return {
    ...session,
    mock: {
      ...session.mock,
      remainingSeconds: remainingMockSeconds(session, now),
      draftAnswers: {
        ...session.mock.draftAnswers,
        [question.id]: {
          choiceId,
          canExplain,
          elapsedMs: Math.min(86400000, (old?.elapsedMs ?? 0) + Math.max(0, Math.round(elapsedMs))),
          answeredAt:
            old?.choiceId === choiceId && old.canExplain === canExplain
              ? old.answeredAt
              : now.toISOString(),
        },
      },
    },
  };
}
export function mockSummary(
  session: Session,
  attempts: Attempt[],
  bank: Question[] = allQuestions,
) {
  const records = attempts.filter(
    (a) => a.sessionId === session.id && session.questionIds.includes(a.questionId),
  );
  const correct = records.filter((a) => a.correct).length;
  const total = session.questionIds.length;
  return {
    total,
    answered: records.length,
    unanswered: total - records.length,
    correct,
    rate: total ? Math.round((correct / total) * 100) : 0,
    domains: domainIds.map((id) => {
      const ids = session.questionIds.filter(
        (qid) => bank.find((q) => q.id === qid)?.domainId === id,
      );
      const answered = records.filter((a) => ids.includes(a.questionId));
      return {
        id,
        total: ids.length,
        answered: answered.length,
        correct: answered.filter((a) => a.correct).length,
        rate: ids.length
          ? Math.round((answered.filter((a) => a.correct).length / ids.length) * 100)
          : null,
      };
    }),
  };
}

/** One transaction makes grading idempotent across reloads and competing tabs. */
export async function finishMock(
  sessionId: string,
  reason: 'submitted' | 'timeout',
  database: LearningDB = db,
  now?: Date,
) {
  return database.transaction(
    'rw',
    [database.sessions, database.attempts, database.exposures, database.reviews],
    async () => {
      const session = await database.sessions.get(sessionId);
      if (!session || session.mode !== 'mock' || !session.mock)
        throw new Error('短縮模試が見つかりません。');
      if (session.status === 'completed') return session;
      const finishedAt = now ?? new Date();
      const remaining = remainingMockSeconds(session, finishedAt);
      if (reason === 'timeout' && remaining > 0) throw new Error('まだ制限時間内です。');
      const exposures = await database.exposures.toArray(),
        attempts = await database.attempts.toArray();
      for (const qid of session.questionIds) {
        const q = allQuestions.find((item) => item.id === qid);
        if (!q) throw new Error('教材と模試の対応を確認できません。');
        const draft = session.mock.draftAnswers[qid];
        const correct = !!draft && draft.choiceId === q.correctChoiceId;
        if (draft)
          await database.attempts.add({
            id: `${session.id}:${q.id}`,
            sessionId: session.id,
            questionId: q.id,
            questionRevision: q.revision,
            groupId: q.groupId,
            domainId: q.domainId,
            unitId: q.unitId,
            selectedChoiceId: draft.choiceId,
            correctChoiceId: q.correctChoiceId,
            correct,
            firstSeen: isFirstSeen(
              q,
              session,
              exposures.filter((e) => e.at <= draft.answeredAt),
              attempts.filter((a) => a.at <= draft.answeredAt),
            ),
            canExplain: draft.canExplain,
            elapsedMs: draft.elapsedMs,
            choiceOrder: session.choiceOrders[qid],
            at: draft.answeredAt,
          });
        const review = nextReview(
          await database.reviews.get(qid),
          correct,
          draft?.canExplain ?? false,
          finishedAt,
        );
        await database.reviews.put({ ...review, questionId: qid });
      }
      const completed: Session = {
        ...session,
        status: 'completed',
        completedAt: finishedAt.toISOString(),
        mock: {
          ...session.mock,
          remainingSeconds: remaining,
          deadlineAt: null,
          paused: false,
          finishedReason: remaining === 0 ? 'timeout' : reason,
        },
      };
      await database.sessions.put(completed);
      return completed;
    },
  );
}
