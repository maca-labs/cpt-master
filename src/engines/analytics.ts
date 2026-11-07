import type { Attempt, DomainId, Exposure, Session, StudyEvent, Unit } from '../domain/types';
import { domainIds } from '../content/blueprints';
import { partitionAttempts } from './learning';

export const learningModes = ['diagnostic', 'practice', 'review', 'mock'] as const;
export type LearningMode = (typeof learningModes)[number];

export interface ResponseMetrics {
  answerCount: number;
  correctCount: number;
  accuracy: number | null;
  independentGroups: number;
  firstCount: number;
  firstAccuracy: number | null;
  repeatCount: number;
  repeatAccuracy: number | null;
  explainCount: number;
  explainRate: number | null;
  medianResponseMs: number | null;
  latestUnderstandingRate: number | null;
  latestIssueGroups: number;
  latestWrongGroups: number;
}

export interface UnitMetrics extends ResponseMetrics {
  id: string;
  title: string;
  domainId: DomainId;
}

export interface SessionPerformance {
  id: string;
  mode: LearningMode;
  startedAt: string;
  completedAt: string | null;
  total: number;
  answered: number;
  unanswered: number;
  correct: number;
  accuracy: number | null;
  firstCount: number;
  repeatCount: number;
  independentGroups: number;
  medianResponseMs: number | null;
  mockTimeMode: 'study' | 'continuous' | null;
  mockFormat?: NonNullable<Session['mock']>['format'] | null;
  practice?: Session['practice'];
  evaluatedTotal?: number;
  excludedCount?: number;
}

export interface DayActivity {
  date: string;
  answerCount: number;
  firstCount: number;
  repeatCount: number;
  completedSessions: number;
  studySeconds: number | null;
}

export interface AnalyticsInput {
  attempts: readonly Attempt[];
  exposures: readonly Exposure[];
  sessions: readonly Session[];
  studyEvents: readonly StudyEvent[];
  units: readonly Pick<Unit, 'id' | 'title' | 'domainId'>[];
  timezone: string;
}

export interface LearningAnalytics {
  overall: ResponseMetrics;
  domains: (ResponseMetrics & { id: DomainId })[];
  units: UnitMetrics[];
  weakUnits: UnitMetrics[];
  sessions: SessionPerformance[];
  days: DayActivity[];
  studySeconds: number | null;
}

/** Ratios remain unrounded so a comparison is not a difference of rounded scores. */
export function percentage(numerator: number, denominator: number): number | null {
  return denominator > 0 ? (numerator / denominator) * 100 : null;
}

export function median(values: readonly number[]): number | null {
  const sorted = values
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function dayInTimezone(at: string, timezone: string): string | null {
  const date = new Date(at);
  if (!Number.isFinite(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return null;
  }
}

function byTime(a: Attempt, b: Attempt) {
  return Date.parse(a.at) - Date.parse(b.at) || a.id.localeCompare(b.id);
}

export function responseMetrics(
  items: readonly Attempt[],
  firstIds: ReadonlySet<string>,
): ResponseMetrics {
  const first = items.filter((attempt) => firstIds.has(attempt.id));
  const repeat = items.filter((attempt) => !firstIds.has(attempt.id));
  const latest = new Map<string, Attempt>();
  for (const attempt of [...items].sort(byTime)) latest.set(attempt.groupId, attempt);
  const latestAnswers = [...latest.values()];
  const correctCount = items.filter((attempt) => attempt.correct).length;
  const explainCount = items.filter((attempt) => attempt.canExplain).length;
  return {
    answerCount: items.length,
    correctCount,
    accuracy: percentage(correctCount, items.length),
    independentGroups: latest.size,
    firstCount: first.length,
    firstAccuracy: percentage(first.filter((attempt) => attempt.correct).length, first.length),
    repeatCount: repeat.length,
    repeatAccuracy: percentage(repeat.filter((attempt) => attempt.correct).length, repeat.length),
    explainCount,
    explainRate: percentage(explainCount, items.length),
    medianResponseMs: median(items.map((attempt) => attempt.elapsedMs)),
    latestUnderstandingRate: percentage(
      latestAnswers.filter((attempt) => attempt.correct && attempt.canExplain).length,
      latest.size,
    ),
    latestIssueGroups: latestAnswers.filter((attempt) => !attempt.correct || !attempt.canExplain)
      .length,
    latestWrongGroups: latestAnswers.filter((attempt) => !attempt.correct).length,
  };
}

export function completedSessionPerformance(
  sessions: readonly Session[],
  attempts: readonly Attempt[],
  firstIds: ReadonlySet<string>,
): SessionPerformance[] {
  return sessions
    .filter((session) => session.status === 'completed' && learningModes.includes(session.mode))
    .map((session): SessionPerformance => {
      const assigned = new Set(session.questionIds);
      const answers = new Map<string, Attempt>();
      // Each assigned question contributes at most one answer to this session.
      // Draft answers from an active mock are not Attempt records and are never read here.
      for (const attempt of attempts.filter((a) => a.sessionId === session.id).sort(byTime))
        if (assigned.has(attempt.questionId)) answers.set(attempt.questionId, attempt);
      const responses = [...answers.values()];
      const firstCount = responses.filter((attempt) => firstIds.has(attempt.id)).length;
      const strict = session.practice?.selection === 'strict_unseen';
      const evaluated = strict
        ? responses.filter((attempt) => firstIds.has(attempt.id))
        : responses;
      const correct = evaluated.filter((attempt) => attempt.correct).length;
      const evaluatedTotal = strict ? evaluated.length : assigned.size;
      return {
        id: session.id,
        mode: session.mode,
        startedAt: session.startedAt,
        completedAt: session.completedAt ?? null,
        total: assigned.size,
        answered: responses.length,
        unanswered: Math.max(0, assigned.size - responses.length),
        correct,
        accuracy: percentage(correct, evaluatedTotal),
        firstCount,
        repeatCount: responses.length - firstCount,
        independentGroups: new Set(responses.map((attempt) => attempt.groupId)).size,
        medianResponseMs: median(responses.map((attempt) => attempt.elapsedMs)),
        mockTimeMode: session.mode === 'mock' ? (session.mock?.timeMode ?? null) : null,
        mockFormat: session.mode === 'mock' ? (session.mock?.format ?? 'short') : null,
        practice: session.practice,
        evaluatedTotal,
        excludedCount: strict ? responses.length - evaluated.length : 0,
      };
    })
    .sort(sessionOrder);
}

function sessionOrder(a: SessionPerformance, b: SessionPerformance) {
  return (
    Date.parse(b.completedAt ?? b.startedAt) - Date.parse(a.completedAt ?? a.startedAt) ||
    b.id.localeCompare(a.id)
  );
}

function sameFormat(a: SessionPerformance, b: SessionPerformance): boolean {
  if (a.mode !== b.mode) return false;
  if (a.mode === 'mock')
    return (
      a.total === b.total &&
      a.mockTimeMode === b.mockTimeMode &&
      (a.mockFormat ?? 'short') === (b.mockFormat ?? 'short')
    );
  if (a.mode === 'practice')
    return (
      a.total === b.total &&
      (a.practice?.batch ?? 'all') === (b.practice?.batch ?? 'all') &&
      (a.practice?.selection ?? 'unseen_first') === (b.practice?.selection ?? 'unseen_first')
    );
  return true;
}

/** Different batches, exposure rules, sizes and timer formats are not interchangeable. */
export function comparableSessions(sessions: readonly SessionPerformance[], mode: LearningMode) {
  const matching = sessions.filter((session) => session.mode === mode).sort(sessionOrder);
  const latest = matching[0];
  if (!latest) return matching;
  return matching.filter((session) => sameFormat(session, latest));
}

export function sessionDifference(
  latest?: SessionPerformance,
  previous?: SessionPerformance,
): number | null {
  if (
    !latest ||
    !previous ||
    latest.id === previous.id ||
    !sameFormat(latest, previous) ||
    latest.accuracy === null ||
    previous.accuracy === null
  )
    return null;
  return latest.accuracy - previous.accuracy;
}

export function buildAnalytics(input: AnalyticsInput): LearningAnalytics {
  const attempts = [...input.attempts];
  // Partition against the whole history before aggregating a unit or learning mode.
  // Filtering first would incorrectly label a repeat in another mode as first-seen.
  const firstIds = new Set(
    partitionAttempts(attempts, [...input.exposures]).first.map((attempt) => attempt.id),
  );
  const sessionRows = completedSessionPerformance(input.sessions, attempts, firstIds);
  const units = input.units.map((unit): UnitMetrics => ({
    ...unit,
    ...responseMetrics(
      attempts.filter((attempt) => attempt.unitId === unit.id),
      firstIds,
    ),
  }));
  const weakUnits = units
    .filter((unit) => unit.answerCount > 0 && unit.latestIssueGroups > 0)
    .sort(
      (a, b) =>
        a.latestUnderstandingRate! - b.latestUnderstandingRate! ||
        b.latestWrongGroups - a.latestWrongGroups ||
        b.independentGroups - a.independentGroups ||
        a.id.localeCompare(b.id),
    );
  const days = new Map<string, DayActivity>();
  const getDay = (at: string) => {
    const date = dayInTimezone(at, input.timezone);
    if (!date) return null;
    if (!days.has(date))
      days.set(date, {
        date,
        answerCount: 0,
        firstCount: 0,
        repeatCount: 0,
        completedSessions: 0,
        studySeconds: null,
      });
    return days.get(date)!;
  };
  for (const attempt of attempts) {
    const day = getDay(attempt.at);
    if (!day) continue;
    day.answerCount++;
    if (firstIds.has(attempt.id)) day.firstCount++;
    else day.repeatCount++;
  }
  for (const session of sessionRows)
    if (session.completedAt) {
      const day = getDay(session.completedAt);
      if (day) day.completedSessions++;
    }
  let studySeconds: number | null = null;
  for (const event of input.studyEvents) {
    if (!Number.isFinite(event.seconds) || event.seconds < 0) continue;
    studySeconds = (studySeconds ?? 0) + event.seconds;
    const day = getDay(event.at);
    if (day) day.studySeconds = (day.studySeconds ?? 0) + event.seconds;
  }
  return {
    overall: responseMetrics(attempts, firstIds),
    units,
    weakUnits,
    sessions: sessionRows,
    domains: domainIds.map((id) => ({
      id,
      ...responseMetrics(
        attempts.filter((a) => a.domainId === id),
        firstIds,
      ),
    })),
    days: [...days.values()].sort((a, b) => a.date.localeCompare(b.date)),
    studySeconds,
  };
}
