import { describe, expect, it } from 'vitest';
import type { Attempt, Exposure, Session, StudyEvent } from '../src/domain/types';
import {
  buildAnalytics,
  comparableSessions,
  dayInTimezone,
  median,
  sessionDifference,
  type AnalyticsInput,
  type SessionPerformance,
} from '../src/engines/analytics';

const units: AnalyticsInput['units'] = [
  { id: 'one', title: '計画の単元', domainId: 'planning' },
  { id: 'two', title: '安全の単元', domainId: 'safety' },
  { id: 'unseen', title: '未学習の単元', domainId: 'assessment' },
];
function attempt(values: Partial<Attempt> = {}): Attempt {
  return {
    id: 'a1',
    sessionId: 's1',
    questionId: 'q1',
    questionRevision: 1,
    groupId: 'g1',
    domainId: 'planning',
    unitId: 'one',
    selectedChoiceId: 'a',
    correctChoiceId: 'a',
    correct: true,
    firstSeen: true,
    canExplain: true,
    elapsedMs: 1000,
    choiceOrder: ['a', 'b', 'c'],
    at: '2026-11-01T12:00:00Z',
    ...values,
  };
}
function session(values: Partial<Session> = {}): Session {
  return {
    id: 's1',
    mode: 'practice',
    questionIds: ['q1'],
    choiceOrders: { q1: ['a', 'b', 'c'] },
    index: 0,
    status: 'completed',
    startedAt: '2026-11-01T11:00:00Z',
    completedAt: '2026-11-01T12:01:00Z',
    firstSeenByQuestion: { q1: true },
    ...values,
  };
}
const input = (values: Partial<AnalyticsInput> = {}): AnalyticsInput => ({
  attempts: [],
  exposures: [],
  sessions: [],
  studyEvents: [],
  units,
  timezone: 'Asia/Tokyo',
  ...values,
});
function mockState(timeMode: 'study' | 'continuous' = 'study'): NonNullable<Session['mock']> {
  return {
    format: 'short',
    questionCount: 10,
    timeMode,
    limitSeconds: 700,
    remainingSeconds: 0,
    deadlineAt: null,
    paused: false,
    flags: [],
    draftAnswers: {},
    finishedReason: 'submitted',
  };
}

describe('record-based learning analytics', () => {
  it('keeps unlearned rates and time empty rather than inventing zero scores or chart rows', () => {
    const result = buildAnalytics(input());
    expect(result.overall).toMatchObject({
      answerCount: 0,
      independentGroups: 0,
      accuracy: null,
      firstAccuracy: null,
      repeatAccuracy: null,
      explainRate: null,
      medianResponseMs: null,
      latestUnderstandingRate: null,
    });
    expect(result.domains.every((domain) => domain.accuracy === null)).toBe(true);
    expect(result.units.every((unit) => unit.latestUnderstandingRate === null)).toBe(true);
    expect(result.weakUnits).toEqual([]);
    expect(result.sessions).toEqual([]);
    expect(result.days).toEqual([]);
    expect(result.studySeconds).toBeNull();
  });

  it('separates genuine first-seen answers from repeats and earlier explanation exposure', () => {
    const attempts = [
      attempt({
        id: 'later',
        sessionId: 's2',
        correct: false,
        canExplain: false,
        elapsedMs: 9000,
        at: '2026-11-02T12:00:00Z',
      }),
      attempt({ id: 'earliest', elapsedMs: 1000 }),
      attempt({
        id: 'previewed',
        questionId: 'q2',
        groupId: 'g2',
        canExplain: false,
        elapsedMs: 3000,
      }),
    ];
    const exposures: Exposure[] = [
      {
        id: 'seen',
        questionId: 'q2',
        groupId: 'g2',
        kind: 'explanation',
        sessionId: 'earlier-session',
        at: '2026-11-01T10:00:00Z',
      },
    ];
    const result = buildAnalytics(input({ attempts, exposures }));
    expect(result.overall).toMatchObject({
      answerCount: 3,
      independentGroups: 2,
      firstCount: 1,
      firstAccuracy: 100,
      repeatCount: 2,
      repeatAccuracy: 50,
      explainCount: 1,
      medianResponseMs: 3000,
      latestUnderstandingRate: 0,
      latestIssueGroups: 2,
    });
    expect(result.overall.explainRate).toBeCloseTo(100 / 3);
    expect(result.domains.find((domain) => domain.id === 'planning')!.firstCount).toBe(1);
  });

  it('ranks only observed weak units using one latest answer per independent group', () => {
    const result = buildAnalytics(
      input({
        attempts: [
          attempt({ id: 'old', correct: false, canExplain: false }),
          attempt({ id: 'new', sessionId: 's2', firstSeen: false, at: '2026-11-02T12:00:00Z' }),
          attempt({
            id: 'uncertain',
            groupId: 'g2',
            questionId: 'q2',
            unitId: 'two',
            domainId: 'safety',
            canExplain: false,
          }),
        ],
      }),
    );
    expect(result.units.find((unit) => unit.id === 'one')).toMatchObject({
      answerCount: 2,
      independentGroups: 1,
      latestUnderstandingRate: 100,
      latestIssueGroups: 0,
    });
    expect(result.weakUnits.map((unit) => unit.id)).toEqual(['two']);
    expect(result.weakUnits[0]).toMatchObject({
      latestUnderstandingRate: 0,
      latestIssueGroups: 1,
      latestWrongGroups: 0,
    });
    expect(result.units.find((unit) => unit.id === 'unseen')!.accuracy).toBeNull();
  });

  it('uses the actual median and ignores nonfinite or impossible negative durations', () => {
    expect(median([9000, 1000, 3000])).toBe(3000);
    expect(median([4000, 1000, 3000, 2000])).toBe(2500);
    expect(median([NaN, Infinity, -1])).toBeNull();
    expect(median([0, -10, 2000])).toBe(1000);
  });

  it('includes unanswered assigned questions in completed session rates, including mocks', () => {
    const mockIds = Array.from({ length: 10 }, (_, index) => `mq${index}`);
    const attempts = [
      attempt(),
      attempt({ id: 'a2', questionId: 'q2', groupId: 'g2', correct: false, elapsedMs: 3000 }),
      attempt({ id: 'm1', sessionId: 'mock', questionId: mockIds[0], groupId: 'mg1' }),
      attempt({
        id: 'm2',
        sessionId: 'mock',
        questionId: mockIds[1],
        groupId: 'mg2',
        correct: false,
      }),
      attempt({ id: 'active-answer', sessionId: 'active', groupId: 'active-g' }),
    ];
    const result = buildAnalytics(
      input({
        attempts,
        sessions: [
          session({ questionIds: ['q1', 'q2', 'q3'] }),
          session({ id: 'mock', mode: 'mock', questionIds: mockIds, mock: mockState() }),
          session({ id: 'active', status: 'active', completedAt: undefined }),
        ],
      }),
    );
    expect(result.sessions).toHaveLength(2);
    expect(result.sessions.find((item) => item.id === 's1')).toMatchObject({
      total: 3,
      answered: 2,
      unanswered: 1,
      correct: 1,
      medianResponseMs: 2000,
    });
    expect(result.sessions.find((item) => item.id === 's1')!.accuracy).toBeCloseTo(100 / 3);
    expect(result.sessions.find((item) => item.id === 'mock')).toMatchObject({
      total: 10,
      answered: 2,
      unanswered: 8,
      correct: 1,
      accuracy: 10,
    });
    expect(result.overall.answerCount).toBe(5); // Saved active answers are real; comparisons still exclude active sessions.
  });

  it('does not count mock draft answers as response history', () => {
    const state = mockState();
    state.draftAnswers.q1 = {
      choiceId: 'a',
      canExplain: true,
      elapsedMs: 1000,
      answeredAt: '2026-11-01T12:00:00Z',
    };
    const result = buildAnalytics(
      input({ sessions: [session({ mode: 'mock', status: 'active', mock: state })] }),
    );
    expect(result.overall.answerCount).toBe(0);
    expect(result.sessions).toEqual([]);
  });

  it('rebuckets answer and study timestamps using the chosen timezone across midnight', () => {
    const attempts = [
      attempt({ id: 'before', at: '2026-11-03T14:59:59Z' }),
      attempt({ id: 'after', groupId: 'g2', at: '2026-11-03T15:00:00Z' }),
    ];
    const studyEvents: StudyEvent[] = [
      { id: 't1', seconds: 90, at: '2026-11-03T14:59:59Z', localDate: '2026-11-03' },
      { id: 't2', seconds: 30, at: '2026-11-03T15:00:00Z', localDate: '2026-11-03' },
    ];
    const sessions = [session({ completedAt: '2026-11-03T15:03:00Z' })];
    const tokyo = buildAnalytics(input({ attempts, studyEvents, sessions }));
    expect(tokyo.days).toEqual([
      {
        date: '2026-11-03',
        answerCount: 1,
        firstCount: 1,
        repeatCount: 0,
        completedSessions: 0,
        studySeconds: 90,
      },
      {
        date: '2026-11-04',
        answerCount: 1,
        firstCount: 1,
        repeatCount: 0,
        completedSessions: 1,
        studySeconds: 30,
      },
    ]);
    expect(tokyo.studySeconds).toBe(120);
    const utc = buildAnalytics(input({ attempts, studyEvents, sessions, timezone: 'UTC' }));
    expect(utc.days).toEqual([
      {
        date: '2026-11-03',
        answerCount: 2,
        firstCount: 2,
        repeatCount: 0,
        completedSessions: 1,
        studySeconds: 120,
      },
    ]);
    expect(dayInTimezone('invalid', 'Asia/Tokyo')).toBeNull();
    expect(dayInTimezone('2026-11-04T00:00:00Z', 'invalid-timezone')).toBeNull();
  });

  it('keeps answer-only study time unrecorded and does not invent a completion date', () => {
    const result = buildAnalytics(
      input({ attempts: [attempt()], sessions: [session({ completedAt: undefined })] }),
    );
    expect(result.studySeconds).toBeNull();
    expect(result.days[0].studySeconds).toBeNull();
    expect(result.days[0].completedSessions).toBe(0);
    expect(result.sessions[0].completedAt).toBeNull();
  });

  it('compares modes separately and limits mock comparison to the same size and timer', () => {
    const rows = (
      id: string,
      mode: SessionPerformance['mode'],
      total: number,
      day: number,
      mockTimeMode: SessionPerformance['mockTimeMode'] = null,
    ): SessionPerformance => ({
      id,
      mode,
      total,
      mockTimeMode,
      startedAt: `2026-11-0${day}T10:00:00Z`,
      completedAt: `2026-11-0${day}T11:00:00Z`,
      answered: total,
      unanswered: 0,
      correct: total / 2,
      accuracy: 50,
      firstCount: total,
      repeatCount: 0,
      independentGroups: total,
      medianResponseMs: 1000,
    });
    const sessions = [
      rows('other-size', 'mock', 20, 3, 'study'),
      rows('baseline', 'mock', 10, 1, 'study'),
      rows('diagnosis', 'diagnostic', 50, 4),
      rows('latest', 'mock', 10, 4, 'study'),
      rows('other-timer', 'mock', 10, 2, 'continuous'),
    ];
    expect(comparableSessions(sessions, 'mock').map((item) => item.id)).toEqual([
      'latest',
      'baseline',
    ]);
    const latest = { ...sessions.find((item) => item.id === 'latest')!, accuracy: 100 / 3 };
    const previous = { ...sessions.find((item) => item.id === 'baseline')!, accuracy: 200 / 3 };
    expect(sessionDifference(latest, previous)).toBeCloseTo(-100 / 3);
    expect(sessionDifference(latest, latest)).toBeNull();
    expect(sessionDifference(latest, sessions[0])).toBeNull();
    expect(sessionDifference(latest, sessions[2])).toBeNull();
    expect(sessionDifference(latest, undefined)).toBeNull();
  });

  it('does not compare different practice batches or strict evaluation with seen review', () => {
    const practice = {
      batch: 'expansion-2026-11-04',
      selection: 'strict_unseen',
      requestedCount: 50,
    } as const;
    const result = buildAnalytics(
      input({
        sessions: [
          session({
            id: 'strict-latest',
            startedAt: '2026-11-05T01:00:00Z',
            completedAt: '2026-11-05T02:00:00Z',
            practice,
          }),
          session({ id: 'strict-before', practice }),
          session({ id: 'review', practice: { ...practice, selection: 'review' } }),
          session({ id: 'all', practice: { ...practice, batch: 'all' } }),
          session({ id: 'legacy' }),
        ],
      }),
    );
    expect(comparableSessions(result.sessions, 'practice').map((s) => s.id)).toEqual([
      'strict-latest',
      'strict-before',
    ]);
    expect(
      sessionDifference(
        result.sessions[0],
        result.sessions.find((s) => s.id === 'review'),
      ),
    ).toBeNull();
  });

  it('does not mutate persisted records while sorting and deriving statistics', () => {
    const data = input({
      attempts: [attempt({ at: '2026-11-02T12:00:00Z' }), attempt({ id: 'earlier' })],
      sessions: [session()],
    });
    const before = structuredClone(data);
    buildAnalytics(data);
    expect(data).toEqual(before);
  });
  it('keeps the atomically recorded first answer when a same-millisecond repeat has a smaller ID', () => {
    const result = buildAnalytics(
      input({
        attempts: [
          attempt({ id: 'z-first', firstSeen: true }),
          attempt({
            id: 'a-repeat',
            firstSeen: false,
            sessionId: 'repeat',
            at: '2026-11-01T12:00:00.000Z',
          }),
        ],
      }),
    );
    expect(result.overall).toMatchObject({ firstCount: 1, repeatCount: 1, independentGroups: 1 });
  });
  it('excludes contaminated answers from strict session history and comparisons as well as the result screen', () => {
    const result = buildAnalytics(
      input({
        sessions: [
          session({
            questionIds: ['q1', 'q2'],
            practice: { batch: 'all', selection: 'strict_unseen', requestedCount: 10 },
          }),
        ],
        attempts: [
          attempt({ correct: false }),
          attempt({
            id: 'repeat',
            questionId: 'q2',
            groupId: 'g2',
            correct: true,
            firstSeen: false,
          }),
        ],
      }),
    );
    expect(result.sessions[0]).toMatchObject({
      total: 2,
      answered: 2,
      correct: 0,
      accuracy: 0,
      evaluatedTotal: 1,
      excludedCount: 1,
      firstCount: 1,
      repeatCount: 1,
    });
  });
});
