import { describe, it, expect } from 'vitest';
import { prioritizeReview } from '../src/engines/learning';
import { questions } from '../src/content';
import type { Attempt, ReviewItem } from '../src/domain/types';
const now = new Date('2026-11-04T09:00:00.000Z');
const due = (questionId: string, patch: Partial<ReviewItem> = {}): ReviewItem => ({
  questionId,
  dueAt: now.toISOString(),
  intervalDays: 1,
  wrongStreak: 0,
  manual: false,
  ...patch,
});
describe('adaptive review priority', () => {
  it('excludes future or unknown reviews even when marked manual', () => {
    const q = questions[0];
    expect(
      prioritizeReview(
        questions,
        [due(q.id, { manual: true, dueAt: '2026-11-05T09:00:00.000Z' }), due('missing')],
        [],
        now,
      ),
    ).toEqual([]);
  });
  it('prioritizes repeated difficulty and explicit review registration over an ordinary due item', () => {
    const [normal, difficult, manual] = questions;
    const result = prioritizeReview(
      questions,
      [due(normal.id), due(difficult.id, { wrongStreak: 3 }), due(manual.id, { manual: true })],
      [],
      now,
    );
    expect(result.map((q) => q.id)).toEqual([difficult.id, manual.id, normal.id]);
  });
  it('uses the most recent reasoning outcome and only one question per group', () => {
    const [first, second] = questions;
    const variant = { ...first, id: 'variant' };
    const a = (patch: Partial<Attempt>) =>
      ({
        id: 'a',
        sessionId: 's',
        questionId: first.id,
        questionRevision: first.revision,
        groupId: first.groupId,
        domainId: first.domainId,
        unitId: first.unitId,
        selectedChoiceId: first.correctChoiceId,
        correctChoiceId: first.correctChoiceId,
        correct: true,
        firstSeen: true,
        canExplain: true,
        elapsedMs: 1000,
        choiceOrder: first.choices.map((c) => c.id),
        at: '2026-11-03T00:00:00.000Z',
        ...patch,
      }) as Attempt;
    const history = [a({}), a({ id: 'b', at: '2026-11-04T00:00:00.000Z', canExplain: false })];
    const result = prioritizeReview(
      [first, second, variant],
      [due(second.id), due(first.id), due(variant.id)],
      history,
      now,
    );
    expect(result[0].groupId).toBe(first.groupId);
    expect(result).toHaveLength(2);
  });
  it('gives overdue reviews priority and never mutates stored inputs', () => {
    const items = [
      due(questions[0].id),
      due(questions[1].id, { dueAt: '2026-10-25T09:00:00.000Z' }),
    ];
    const original = structuredClone(items);
    expect(prioritizeReview(questions, items, [], now, 1).map((q) => q.id)).toEqual([
      questions[1].id,
    ]);
    expect(items).toEqual(original);
  });
});
