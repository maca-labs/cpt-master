import { describe, expect, it } from 'vitest';
import { questions } from '../src/content';
import type { Attempt, DomainId, Question } from '../src/domain/types';
import {
  createMockSession,
  mockAllocation,
  mockAvailability,
  mockSummary,
  pauseMock,
  remainingMockSeconds,
  resumeMock,
  selectMock,
  withMockDraft,
} from '../src/engines/mock';

const now = new Date('2026-11-04T09:00:00.000Z');
const after = (seconds: number) => new Date(now.getTime() + seconds * 1000);
function exactBank(): Question[] {
  return (Object.entries(mockAllocation(20)) as [DomainId, number][]).flatMap(
    ([domainId, count]) => {
      const template = questions.find((q) => q.domainId === domainId)!;
      return Array.from({ length: count }, (_, index) => ({
        ...structuredClone(template),
        id: `${domainId}-${index}`,
        groupId: `${domainId}-${index}`,
        pool: 'practice' as const,
      }));
    },
  );
}

describe('short mock selection', () => {
  it('uses largest remainders of 32/45/43/20 and conserves the question count', () => {
    expect(Object.values(mockAllocation(10))).toEqual([2, 3, 3, 2]);
    expect(Object.values(mockAllocation(20))).toEqual([5, 6, 6, 3]);
    expect(Object.values(mockAllocation(50))).toEqual([12, 16, 15, 7]);
    expect(() => mockAllocation(0)).toThrow();
    expect(() => mockAllocation(10.5)).toThrow();
  });
  it('keeps reserved diagnostic questions out before completion or skip', () => {
    const selected = selectMock(questions, 20, false, () => 0.4);
    expect(selected).toHaveLength(20);
    expect(selected.every((q) => q.pool === 'practice')).toBe(true);
    expect(new Set(selected.map((q) => q.groupId)).size).toBe(20);
    for (const [id, count] of Object.entries(mockAllocation(20)))
      expect(selected.filter((q) => q.domainId === id)).toHaveLength(count);
    expect(mockAvailability(questions, 50, false).every((row) => row.missing === 0)).toBe(true);
    expect(selectMock(questions, 50, false).every((q) => q.pool === 'practice')).toBe(true);
    expect(() => selectMock(exactBank(), 50, false)).toThrow(/不足/);
    expect(selectMock(questions, 50, true)).toHaveLength(50);
  });
  it('does not count draft, stale, unsupported or exam-pool questions toward quotas', () => {
    for (const kind of ['draft', 'revision', 'format', 'exam'] as const) {
      const bank = exactBank();
      const first = bank[0];
      if (kind === 'draft') first.review.status = 'draft';
      if (kind === 'revision') first.revision++;
      if (kind === 'format') first.format = 'true_false';
      if (kind === 'exam') first.pool = 'exam';
      expect(() => selectMock(bank, 20, true)).toThrow(/1問不足/);
    }
  });
  it('finds a feasible allocation across shared groups instead of duplicating a group', () => {
    const bank = exactBank();
    const assessment = bank.find((q) => q.domainId === 'assessment')!;
    const planning = bank.find((q) => q.domainId === 'planning')!;
    assessment.groupId = 'shared';
    planning.groupId = 'shared';
    expect(() => selectMock(bank, 20, true)).toThrow(/1問不足/);
    bank.push({ ...structuredClone(assessment), id: 'alternative', groupId: 'alternative' });
    const selected = selectMock(bank, 20, true, () => 0);
    expect(new Set(selected.map((q) => q.groupId)).size).toBe(20);
    expect(selected.filter((q) => q.domainId === 'assessment')).toHaveLength(5);
    expect(selected.filter((q) => q.domainId === 'planning')).toHaveLength(6);
  });
  it('shuffles question and choice order while retaining IDs and never starts a 155-question short mock', () => {
    const session = createMockSession(questions, 20, false, 'study', [], [], now, () => 0);
    const other = createMockSession(questions, 20, false, 'study', [], [], now, () => 0.9);
    expect(session.questionIds).not.toEqual(other.questionIds);
    for (const qid of session.questionIds)
      expect([...session.choiceOrders[qid]].sort()).toEqual(
        questions
          .find((q) => q.id === qid)!
          .choices.map((c) => c.id)
          .sort(),
      );
    expect(() =>
      createMockSession(questions, 155 as 20, true, 'continuous', [], [], now),
    ).toThrow();
  });
});

describe('persistable mock clock and drafts', () => {
  it('freezes study time and resumes from the exact saved remaining seconds', () => {
    const session = createMockSession(questions, 20, false, 'study', [], [], now);
    const paused = pauseMock(session, after(123));
    expect(paused.mock).toMatchObject({ paused: true, remainingSeconds: 1277, deadlineAt: null });
    expect(remainingMockSeconds(paused, after(3600))).toBe(1277);
    const resumed = resumeMock(paused, after(3600));
    expect(remainingMockSeconds(resumed, after(3610))).toBe(1267);
  });
  it('continues across reloads until explicitly paused and preserves fractional remaining time', () => {
    const session = createMockSession(questions, 20, false, 'continuous', [], [], now);
    const restored = JSON.parse(JSON.stringify(session));
    expect(remainingMockSeconds(restored, after(1399))).toBe(1);
    expect(remainingMockSeconds(restored, after(1401))).toBe(0);
    expect(pauseMock(restored, after(1401))).toBe(restored);

    const paused = pauseMock(restored, after(10.25));
    expect(paused.mock?.clockAnchor?.remainingMs).toBe(1389750);
    expect(remainingMockSeconds(paused, after(2500))).toBe(1390);
    const resumed = resumeMock(paused, after(2500));
    expect(resumed.mock?.deadlineAt).toBe(after(3889.75).toISOString());
    const pausedAgain = pauseMock(resumed, after(2500.35));
    expect(pausedAgain.mock?.clockAnchor?.remainingMs).toBe(1389400);
  });
  it('keeps choice IDs and reasoning confidence in a draft without grading', () => {
    const session = createMockSession(questions, 20, false, 'study', [], [], now);
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    const saved = withMockDraft(session, q, q.correctChoiceId, false, 1200, after(3));
    expect(saved.status).toBe('active');
    expect(saved.mock!.draftAnswers[q.id]).toMatchObject({
      choiceId: q.correctChoiceId,
      canExplain: false,
      elapsedMs: 1200,
      answeredAt: after(3).toISOString(),
    });
    expect(session.mock!.draftAnswers).toEqual({});
    const revisited = withMockDraft(saved, q, q.correctChoiceId, false, 200, after(4));
    expect(revisited.mock!.draftAnswers[q.id]).toMatchObject({
      answeredAt: after(3).toISOString(),
      elapsedMs: 1400,
    });
    expect(() => withMockDraft(saved, q, 'forged', true, 1, after(4))).toThrow();
    expect(() =>
      withMockDraft(pauseMock(saved, after(5)), q, q.correctChoiceId, true, 1, after(6)),
    ).toThrow();
    expect(() => withMockDraft(saved, q, q.correctChoiceId, true, 1, after(1401))).toThrow();
  });
  it('includes unanswered questions in total and domain denominators', () => {
    const session = createMockSession(questions, 20, false, 'study', [], [], now);
    const q = questions.find((q) => q.id === session.questionIds[0])!;
    const answer: Attempt = {
      id: 'a',
      sessionId: session.id,
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
      elapsedMs: 1000,
      choiceOrder: session.choiceOrders[q.id],
      at: after(3).toISOString(),
    };
    const summary = mockSummary(session, [answer]);
    expect(summary).toMatchObject({ total: 20, answered: 1, unanswered: 19, correct: 1, rate: 5 });
    const domain = summary.domains.find((row) => row.id === q.domainId)!;
    expect(domain.rate).toBe(Math.round(100 / domain.total));
  });
});
