import type { Attempt, DomainId, Exposure, Question, ReviewItem, Session } from '../domain/types';
import { domainIds, domains } from '../content/blueprints';
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function eligible(q: Question) {
  return (
    q.review.status !== 'draft' &&
    q.review.revision === q.revision &&
    q.sourceRefs.length > 0 &&
    q.choices.length === 3 &&
    q.format === 'single_choice'
  );
}
export function uniqueGroups(items: Question[]) {
  const groups = new Set<string>();
  return items.filter((q) => {
    if (groups.has(q.groupId)) return false;
    groups.add(q.groupId);
    return true;
  });
}
export function diagnosticAvailability(bank: Question[]) {
  return domainIds.map((id) => ({
    id,
    needed: domains[id].diagnostic,
    available: uniqueGroups(
      bank.filter((q) => q.domainId === id && q.pool === 'diagnostic' && eligible(q)),
    ).length,
  }));
}
export function selectDiagnostic(bank: Question[], rng: () => number = Math.random): Question[] {
  const availability = diagnosticAvailability(bank);
  if (availability.some((d) => d.available < d.needed))
    throw new Error('出典照合済みの診断問題が不足しています。');
  return shuffle(
    domainIds.flatMap((id) =>
      shuffle(
        uniqueGroups(
          bank.filter((q) => q.domainId === id && q.pool === 'diagnostic' && eligible(q)),
        ),
        rng,
      ).slice(0, domains[id].diagnostic),
    ),
    rng,
  );
}
export function selectPractice(
  bank: Question[],
  unlocked: boolean,
  attempts: Attempt[],
  unitId?: string,
  count = 10,
): Question[] {
  const pool = uniqueGroups(
    shuffle(
      bank.filter(
        (q) =>
          q.pool !== 'exam' &&
          (unlocked || q.pool !== 'diagnostic') &&
          (!unitId || q.unitId === unitId),
      ),
    ),
  );
  const seen = new Set(attempts.map((a) => a.groupId));
  return pool
    .sort((a, b) => Number(seen.has(a.groupId)) - Number(seen.has(b.groupId)))
    .slice(0, count);
}
export function createSession(
  mode: Session['mode'],
  selected: Question[],
  exposures: Exposure[],
  attempts: Attempt[],
  rng: () => number = Math.random,
): Session {
  if (selected.length === 0) throw new Error('利用できる問題がありません。');
  if (uniqueGroups(selected).length !== selected.length)
    throw new Error('同じ問題グループが重複しています。');
  const seen = new Set([...exposures.map((e) => e.groupId), ...attempts.map((a) => a.groupId)]);
  return {
    id: crypto.randomUUID(),
    mode,
    questionIds: selected.map((q) => q.id),
    choiceOrders: Object.fromEntries(
      selected.map((q) => [
        q.id,
        shuffle(
          q.choices.map((c) => c.id),
          rng,
        ),
      ]),
    ),
    firstSeenByQuestion: Object.fromEntries(selected.map((q) => [q.id, !seen.has(q.groupId)])),
    index: 0,
    status: 'active',
    startedAt: new Date().toISOString(),
  };
}
export function scoreAnswer(q: Question, choiceId: string) {
  if (!q.choices.some((c) => c.id === choiceId)) throw new Error('選択肢が不正です。');
  return choiceId === q.correctChoiceId;
}
export function isFirstSeen(
  q: Question,
  session: Session,
  exposures: Exposure[],
  attempts: Attempt[],
) {
  return (
    session.firstSeenByQuestion[q.id] === true &&
    !exposures.some(
      (e) => e.groupId === q.groupId && (e.sessionId !== session.id || e.kind === 'explanation'),
    ) &&
    !attempts.some((a) => a.groupId === q.groupId)
  );
}
export function nextReview(
  previous: ReviewItem | undefined,
  correct: boolean,
  canExplain: boolean,
  now = new Date(),
): ReviewItem {
  const good = correct && canExplain;
  const steps = [1, 3, 7, 14, 30];
  const interval = good ? (steps.find((n) => n > (previous?.intervalDays ?? 0)) ?? 30) : 1;
  return {
    questionId: previous?.questionId ?? '',
    dueAt: new Date(now.getTime() + interval * 86400000).toISOString(),
    intervalDays: interval,
    wrongStreak: good ? 0 : (previous?.wrongStreak ?? 0) + 1,
    manual: previous?.manual ?? false,
  };
}
export function rate(items: Attempt[]) {
  return items.length
    ? Math.round((items.filter((a) => a.correct).length / items.length) * 100)
    : null;
}
export function partitionAttempts(
  items: Attempt[],
  exposures: Exposure[],
): { first: Attempt[]; repeat: Attempt[] } {
  const earliest = new Map<string, Attempt>();
  for (const a of [...items].sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id)))
    if (!earliest.has(a.groupId)) earliest.set(a.groupId, a);
  const first = [...earliest.values()].filter(
    (a) =>
      a.firstSeen &&
      !exposures.some(
        (e) =>
          e.groupId === a.groupId &&
          e.at < a.at &&
          (e.sessionId !== a.sessionId || e.kind === 'explanation'),
      ),
  );
  const firstIds = new Set(first.map((a) => a.id));
  return { first, repeat: items.filter((a) => !firstIds.has(a.id)) };
}
export function domainResults(items: Attempt[]) {
  return domainIds.map((id) => ({
    id,
    count: items.filter((a) => a.domainId === id).length,
    rate: rate(items.filter((a) => a.domainId === id)),
  }));
}
export function mastery(items: Attempt[], domainId?: DomainId) {
  const relevant = domainId ? items.filter((a) => a.domainId === domainId) : items;
  const latest = new Map<string, Attempt>();
  relevant.forEach((a) => {
    if (!latest.has(a.groupId) || latest.get(a.groupId)!.at < a.at) latest.set(a.groupId, a);
  });
  const values = [...latest.values()];
  return values.length
    ? Math.round((values.filter((a) => a.correct && a.canExplain).length / values.length) * 100)
    : null;
}
export function streak(dates: string[], today: string) {
  const days = new Set(dates);
  const cursor = new Date(`${today}T12:00:00Z`);
  if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let count = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    count++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}
export function localDay(timezone = 'Asia/Tokyo', date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
export function examReadiness(bank: Question[]) {
  return domainIds.map((id) => ({
    id,
    needed: domains[id].scored,
    available: uniqueGroups(
      bank.filter(
        (q) =>
          q.domainId === id &&
          q.pool === 'exam' &&
          q.review.status === 'expert_reviewed' &&
          q.review.reviewerType === 'human_expert' &&
          ['text', 'case'].includes(q.context) &&
          eligible(q),
      ),
    ).length,
  }));
}
