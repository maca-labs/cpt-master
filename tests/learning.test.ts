import { describe, expect, it } from 'vitest';
import type { Attempt, DomainId, Exposure, Question } from '../src/domain/types';
import {
  createSession,
  diagnosticAvailability,
  eligible,
  examReadiness,
  isFirstSeen,
  localDay,
  mastery,
  nextReview,
  scoreAnswer,
  selectDiagnostic,
  selectPractice,
  shuffle,
  streak,
} from '../src/engines/learning';

const at = '2026-11-04T00:00:00.000Z';
const quotas: Record<DomainId, number> = { assessment: 12, planning: 16, technique: 15, safety: 7 };

function question(id: string, patch: Partial<Question> = {}): Question {
  return {
    id,
    revision: 1,
    groupId: `group-${id}`,
    domainId: 'assessment',
    unitId: 'assessment',
    objectiveIds: ['assessment-o1'],
    format: 'single_choice',
    context: 'text',
    difficulty: 1,
    pool: 'diagnostic',
    prompt: `独立した検証用設問 ${id}`,
    choices: [
      { id: `${id}-a`, text: '選択肢A', explanation: 'Aの根拠' },
      { id: `${id}-b`, text: '選択肢B', explanation: 'Bの根拠' },
      { id: `${id}-c`, text: '選択肢C', explanation: 'Cの根拠' },
    ],
    correctChoiceId: `${id}-b`,
    explanation: '正答を支える検証用の説明',
    sourceRefs: [{ sourceId: 'test-source', locator: '検証用の参照箇所' }],
    review: {
      status: 'source_checked',
      reviewerType: 'ai',
      method: 'テスト用',
      checkedAt: '2026-11-04',
      revision: 1,
    },
    ...patch,
  };
}

function diagnosticBank(): Question[] {
  return (Object.entries(quotas) as [DomainId, number][]).flatMap(([domainId, count]) =>
    Array.from({ length: count }, (_, index) => question(`${domainId}-${index}`, { domainId })),
  );
}

function attempt(q: Question, patch: Partial<Attempt> = {}): Attempt {
  return {
    id: `attempt-${q.id}`,
    sessionId: 'prior-session',
    questionId: q.id,
    questionRevision: q.revision,
    groupId: q.groupId,
    domainId: q.domainId,
    unitId: q.unitId,
    selectedChoiceId: q.correctChoiceId,
    correctChoiceId: q.correctChoiceId,
    correct: true,
    firstSeen: true,
    canExplain: true,
    elapsedMs: 15000,
    choiceOrder: q.choices.map((c) => c.id),
    at,
    ...patch,
  };
}

function exposure(q: Question, sessionId: string, kind: Exposure['kind'] = 'question'): Exposure {
  return {
    id: `exposure-${sessionId}-${kind}`,
    questionId: q.id,
    groupId: q.groupId,
    kind,
    sessionId,
    at,
  };
}

describe('diagnostic selection', () => {
  it('allocates 50 unique questions as 12 / 16 / 15 / 7', () => {
    const bank = diagnosticBank();
    const duplicate = question('duplicate', { groupId: bank[0].groupId });
    const selected = selectDiagnostic([...bank, duplicate], () => 0.37);
    expect(selected).toHaveLength(50);
    expect(new Set(selected.map((q) => q.groupId)).size).toBe(50);
    for (const [domainId, count] of Object.entries(quotas)) {
      expect(selected.filter((q) => q.domainId === domainId)).toHaveLength(count);
    }
  });

  it('accepts source checked questions only at the current question revision', () => {
    const q = question('current');
    expect(eligible(q)).toBe(true);
    expect(eligible({ ...q, review: { ...q.review, status: 'expert_reviewed' } })).toBe(true);
    expect(eligible({ ...q, review: { ...q.review, status: 'draft' } })).toBe(false);
    expect(eligible({ ...q, revision: 2 })).toBe(false);
    expect(eligible({ ...q, sourceRefs: [] })).toBe(false);
    expect(eligible({ ...q, choices: q.choices.slice(0, 2) })).toBe(false);
    expect(eligible({ ...q, format: 'true_false' })).toBe(false);
  });

  it('rejects insufficient current reviewed questions instead of silently duplicating', () => {
    const bank = diagnosticBank();
    const q = bank[0];
    bank[0] = { ...q, review: { ...q.review, status: 'draft' } };
    expect(diagnosticAvailability(bank).find((d) => d.id === 'assessment')).toMatchObject({
      available: 11,
      needed: 12,
    });
    expect(() => selectDiagnostic(bank)).toThrow(/不足/);
  });

  it('does not count stale revisions toward availability', () => {
    const bank = diagnosticBank();
    bank[0] = { ...bank[0], revision: 2 };
    expect(() => selectDiagnostic(bank)).toThrow(/不足/);
  });
});

describe('practice and answer identity', () => {
  it('keeps diagnostic reservations hidden before unlock and excludes exam questions', () => {
    const practice = question('practice', { pool: 'practice' });
    const diagnostic = question('reserved');
    const exam = question('exam', { pool: 'exam' });
    expect(selectPractice([practice, diagnostic, exam], false, []).map((q) => q.id)).toEqual([
      'practice',
    ]);
    expect(
      new Set(selectPractice([practice, diagnostic, exam], true, []).map((q) => q.id)),
    ).toEqual(new Set(['practice', 'reserved']));
  });

  it('prioritizes unseen groups and avoids alternative versions of the same group', () => {
    const seen = question('seen', { pool: 'practice' });
    const alternate = question('alternate', { pool: 'practice', groupId: seen.groupId });
    const fresh = question('fresh', { pool: 'practice' });
    const result = selectPractice([seen, alternate, fresh], true, [attempt(seen)]);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('fresh');
    expect(new Set(result.map((q) => q.groupId)).size).toBe(2);
  });

  it('shuffles without mutating the source and keeps grading bound to choice IDs', () => {
    const q = question('shuffle');
    const original = q.choices.map((c) => c.id);
    const session = createSession('practice', [q], [], [], () => 0);
    expect(q.choices.map((c) => c.id)).toEqual(original);
    expect(session.choiceOrders[q.id]).not.toEqual(original);
    expect([...session.choiceOrders[q.id]].sort()).toEqual([...original].sort());
    expect(session.choiceOrders[q.id].filter((choice) => scoreAnswer(q, choice))).toEqual([
      q.correctChoiceId,
    ]);
    expect(() => scoreAnswer(q, 'forged-choice')).toThrow(/選択肢/);
    expect(shuffle(original, () => 0)).not.toBe(original);
  });

  it('refuses an empty session or duplicated question group', () => {
    const q = question('one');
    expect(() => createSession('practice', [], [], [])).toThrow();
    expect(() =>
      createSession('practice', [q, question('two', { groupId: q.groupId })], [], []),
    ).toThrow(/重複/);
  });
});

describe('first exposure and review', () => {
  it('does not mark its own question display as a prior exposure', () => {
    const q = question('first');
    const session = createSession('practice', [q], [], []);
    expect(isFirstSeen(q, session, [exposure(q, session.id)], [])).toBe(true);
  });

  it('excludes previously displayed questions, explanations and prior answers', () => {
    const q = question('exposed');
    for (const kind of ['question', 'explanation'] as const) {
      const prior = exposure(q, 'older-session', kind);
      const session = createSession('practice', [q], [prior], []);
      expect(session.firstSeenByQuestion[q.id]).toBe(false);
      expect(isFirstSeen(q, session, [prior], [])).toBe(false);
    }
    const session = createSession('practice', [q], [], []);
    expect(isFirstSeen(q, session, [exposure(q, session.id, 'explanation')], [])).toBe(false);
    expect(isFirstSeen(q, session, [], [attempt(q)])).toBe(false);
  });

  it('recognizes exposure to another question with the same group', () => {
    const q = question('version-two', { groupId: 'same-concept' });
    const earlier = question('version-one', { groupId: 'same-concept' });
    const session = createSession('practice', [q], [exposure(earlier, 'older-session')], []);
    expect(session.firstSeenByQuestion[q.id]).toBe(false);
  });

  it('schedules a correct answer without an explanation for next-day review', () => {
    const previous = {
      questionId: 'q1',
      dueAt: at,
      intervalDays: 14,
      wrongStreak: 2,
      manual: true,
    };
    const result = nextReview(previous, true, false, new Date(at));
    expect(result).toEqual({
      ...previous,
      intervalDays: 1,
      wrongStreak: 3,
      dueAt: '2026-11-05T00:00:00.000Z',
    });
    expect(nextReview(previous, true, true, new Date(at))).toMatchObject({
      intervalDays: 30,
      wrongStreak: 0,
    });
  });

  it('estimates mastery from the latest answer per group and requires an explanation', () => {
    const q = question('mastery');
    const old = attempt(q, { id: 'old', at: '2026-11-01T00:00:00.000Z' });
    const latest = attempt(q, { id: 'latest', canExplain: false });
    expect(mastery([old, latest])).toBe(0);
    expect(mastery([latest, old])).toBe(0);
    expect(mastery([])).toBeNull();
  });

  it('counts learning days in the selected timezone and allows an unfinished current day', () => {
    expect(localDay('Asia/Tokyo', new Date('2026-11-03T16:00:00.000Z'))).toBe('2026-11-04');
    expect(streak(['2026-11-03', '2026-11-03', '2026-11-02'], '2026-11-04')).toBe(2);
    expect(streak(['2026-11-02'], '2026-11-04')).toBe(0);
  });

  it('counts only expert-reviewed exam-pool questions toward mock exam readiness', () => {
    const sourceChecked = question('source-only', { pool: 'exam' });
    const expert = question('expert', {
      pool: 'exam',
      review: { ...sourceChecked.review, status: 'expert_reviewed', reviewerType: 'human_expert' },
    });
    const practice = question('practice-expert', {
      ...expert,
      id: 'practice-expert',
      groupId: 'practice-expert',
      pool: 'practice',
    });
    expect(
      examReadiness([sourceChecked, expert, practice]).find((d) => d.id === 'assessment')
        ?.available,
    ).toBe(1);
  });
});
