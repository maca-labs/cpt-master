import type { Attempt, DomainId, Exposure, Question, Session } from '../domain/types';
import { domainIds } from '../content/blueprints';
import { isInPracticeBatch, type PracticeBatch } from '../content/batches';
import { eligible, shuffle, uniqueGroups } from './learning';

export type PracticeSelection = 'unseen_first' | 'strict_unseen' | 'review';
export interface PracticeOptions {
  batch: PracticeBatch;
  selection: PracticeSelection;
  requestedCount: 10 | 20 | 50;
}
export interface PracticeRequest extends PracticeOptions {
  unitId?: string;
  onlyFavorites?: boolean;
  questionIds?: readonly string[];
  allowSmaller?: boolean;
  expectedAvailableCount?: number;
}
export interface PracticeHistory {
  exposures: readonly Exposure[];
  attempts: readonly Attempt[];
  sessions: readonly Session[];
}
export const practiceSelectionLabel = (selection: PracticeSelection) =>
  ({
    unseen_first: '通常学習（未見を優先）',
    strict_unseen: '厳密な未見問題のみで評価',
    review: '復習・再演習（既出を含む）',
  })[selection];

export function observedGroups(
  exposures: readonly Exposure[],
  attempts: readonly Attempt[],
): Set<string> {
  return new Set([
    ...exposures.map((exposure) => exposure.groupId),
    ...attempts.map((attempt) => attempt.groupId),
  ]);
}

/** A selected but not yet displayed item is reserved while its strict session is
 * active. Resume that session to use it; other practice/mock modes must not take it. */
export function reservedStrictGroups(
  sessions: readonly Session[],
  bank: readonly Question[],
): Set<string> {
  const groupsById = new Map(bank.map((question) => [question.id, question.groupId]));
  return new Set(
    sessions
      .filter(
        (session) =>
          session.status === 'active' &&
          session.mode === 'practice' &&
          session.practice?.selection === 'strict_unseen',
      )
      .flatMap((session) =>
        session.questionIds.flatMap((id) => (groupsById.has(id) ? [groupsById.get(id)!] : [])),
      ),
  );
}

const zero = (): Record<DomainId, number> => ({
  assessment: 0,
  planning: 0,
  technique: 0,
  safety: 0,
});
export function practiceAllocation(
  items: readonly Question[],
  count: number,
): Record<DomainId, number> {
  if (!Number.isInteger(count) || count < 0 || count > items.length)
    throw new Error('利用可能数を超える配分はできません。');
  const result = zero();
  if (!count) return result;
  const rows = domainIds.map((id, index) => ({
    id,
    index,
    available: items.filter((item) => item.domainId === id).length,
    exact: (count * items.filter((item) => item.domainId === id).length) / items.length,
  }));
  for (const row of rows) result[row.id] = Math.floor(row.exact);
  let remainder = count - Object.values(result).reduce((a, b) => a + b, 0);
  rows.sort(
    (a, b) => b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)) || a.index - b.index,
  );
  for (const row of rows)
    if (remainder > 0 && result[row.id] < row.available) {
      result[row.id]++;
      remainder--;
    }
  if (remainder) throw new Error('分野別在庫から配分できません。');
  return result;
}

export function practiceInventory(
  bank: readonly Question[],
  unlocked: boolean,
  history: PracticeHistory,
  options: PracticeOptions & { unitId?: string; questionIds?: readonly string[] },
) {
  const seen = observedGroups(history.exposures, history.attempts),
    reserved = reservedStrictGroups(history.sessions, bank);
  const total = uniqueGroups(
    bank.filter(
      (question) =>
        eligible(question) &&
        question.pool !== 'exam' &&
        (unlocked || question.pool !== 'diagnostic') &&
        isInPracticeBatch(question, options.batch) &&
        (!options.unitId || question.unitId === options.unitId) &&
        (!options.questionIds || options.questionIds.includes(question.id)),
    ),
  );
  const available = total.filter(
    (question) =>
      !reserved.has(question.groupId) &&
      (options.selection !== 'strict_unseen' || !seen.has(question.groupId)),
  );
  const unseen = total.filter(
    (question) => !seen.has(question.groupId) && !reserved.has(question.groupId),
  );
  const selectedCount = Math.min(options.requestedCount, available.length);
  const allocation =
    options.selection === 'unseen_first'
      ? (() => {
          const a = practiceAllocation(unseen, Math.min(selectedCount, unseen.length)),
            b = practiceAllocation(
              available.filter((q) => seen.has(q.groupId)),
              Math.max(0, selectedCount - unseen.length),
            );
          return Object.fromEntries(domainIds.map((id) => [id, a[id] + b[id]])) as Record<
            DomainId,
            number
          >;
        })()
      : practiceAllocation(available, selectedCount);
  return {
    total: total.length,
    available: available.length,
    unseen: unseen.length,
    seen: total.filter((question) => seen.has(question.groupId) && !reserved.has(question.groupId))
      .length,
    reserved: total.filter((question) => reserved.has(question.groupId)).length,
    missing: Math.max(0, options.requestedCount - available.length),
    allocation,
    byDomain: Object.fromEntries(
      domainIds.map((id) => [id, available.filter((question) => question.domainId === id).length]),
    ) as Record<DomainId, number>,
  };
}

function balanced(items: Question[], count: number, rng: () => number): Question[] {
  const quotas = practiceAllocation(items, count);
  return domainIds.flatMap((id) =>
    shuffle(
      items.filter((question) => question.domainId === id),
      rng,
    ).slice(0, quotas[id]),
  );
}

export function selectPracticeQuestions(
  bank: readonly Question[],
  unlocked: boolean,
  history: PracticeHistory,
  options: PracticeRequest,
  rng: () => number = Math.random,
): Question[] {
  if (
    !['all', 'expansion-2026-11-04'].includes(options.batch) ||
    !['unseen_first', 'strict_unseen', 'review'].includes(options.selection) ||
    ![10, 20, 50].includes(options.requestedCount)
  )
    throw new Error('演習条件が不正です。');
  const seen = observedGroups(history.exposures, history.attempts),
    reserved = reservedStrictGroups(history.sessions, bank);
  const pool = uniqueGroups(
    shuffle(
      bank.filter(
        (question) =>
          eligible(question) &&
          question.pool !== 'exam' &&
          (unlocked || question.pool !== 'diagnostic') &&
          isInPracticeBatch(question, options.batch) &&
          (!options.unitId || question.unitId === options.unitId) &&
          (!options.questionIds || options.questionIds.includes(question.id)) &&
          !reserved.has(question.groupId) &&
          (options.selection !== 'strict_unseen' || !seen.has(question.groupId)),
      ),
      rng,
    ),
  );
  if (pool.length < options.requestedCount && !options.allowSmaller)
    throw new Error(
      `指定した${options.requestedCount}問に対して${options.requestedCount - pool.length}問不足しています。既出問題で補充しません。利用可能数で始めるか、条件を変更してください。`,
    );
  const count = Math.min(options.requestedCount, pool.length);
  if (!count)
    throw new Error(
      'この条件で利用できる問題がありません。予約中の演習を再開するか、条件を変更してください。',
    );
  if (options.selection !== 'unseen_first') return shuffle(balanced(pool, count, rng), rng);
  const unseen = pool.filter((question) => !seen.has(question.groupId));
  const first = balanced(unseen, Math.min(count, unseen.length), rng);
  return shuffle(
    [
      ...first,
      ...balanced(
        pool.filter((question) => seen.has(question.groupId)),
        count - first.length,
        rng,
      ),
    ],
    rng,
  );
}
