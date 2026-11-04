import type { Attempt, DomainId, Exposure, Question, Session } from '../domain/types';
import { questions } from '../content';
import { domainIds, domains } from '../content/blueprints';
import { createSession, eligible, isFirstSeen, nextReview, shuffle } from './learning';
import { db, type LearningDB } from '../storage/db';

export type MockState = NonNullable<Session['mock']>;
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
    (q) => eligible(q) && q.pool !== 'exam' && (unlocked || q.pool !== 'diagnostic'),
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
    throw new Error(`照合済みの短縮模試用問題が${count - result.entries.length}問不足しています。`);
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
  const limitSeconds = count * 70;
  return {
    ...createSession('mock', selected, exposures, attempts, rng),
    startedAt: now.toISOString(),
    mock: {
      format: 'short',
      questionCount: count,
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
  if (session.mock.timeMode !== 'study') throw new Error('時間継続モードでは停止できません。');
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
  if (!session.mock || session.status !== 'active' || !session.mock.paused)
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
export function mockSummary(session: Session, attempts: Attempt[], bank: Question[] = questions) {
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
  now = new Date(),
) {
  return database.transaction(
    'rw',
    [database.sessions, database.attempts, database.exposures, database.reviews],
    async () => {
      const session = await database.sessions.get(sessionId);
      if (!session || session.mode !== 'mock' || !session.mock)
        throw new Error('短縮模試が見つかりません。');
      if (session.status === 'completed') return session;
      const remaining = remainingMockSeconds(session, now);
      if (reason === 'timeout' && remaining > 0) throw new Error('まだ制限時間内です。');
      const exposures = await database.exposures.toArray(),
        attempts = await database.attempts.toArray();
      for (const qid of session.questionIds) {
        const q = questions.find((item) => item.id === qid);
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
          now,
        );
        await database.reviews.put({ ...review, questionId: qid });
      }
      const completed: Session = {
        ...session,
        status: 'completed',
        completedAt: now.toISOString(),
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
