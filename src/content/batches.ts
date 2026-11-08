import type { PracticeBatch, Question } from '../domain/types';
import { foundationQuestions } from './foundations';
import { appliedQuestions } from './applied';
import { assessmentExpansionQuestions } from './expansion/assessment';
import { planningExpansionQuestions } from './expansion/planning';
import { techniqueExpansionQuestions } from './expansion/technique';
import { safetyExpansionQuestions } from './expansion/safety';
import { edition3Questions } from './edition3';
export type { PracticeBatch } from '../domain/types';

// IDs come from the published batches without changing existing question records.
export const initialQuestionIds = new Set(
  [...foundationQuestions, ...appliedQuestions].map((question) => question.id),
);
export const expansionQuestionIds = new Set(
  [
    ...assessmentExpansionQuestions,
    ...planningExpansionQuestions,
    ...techniqueExpansionQuestions,
    ...safetyExpansionQuestions,
  ].map((question) => question.id),
);
export const edition3QuestionIds = new Set(edition3Questions.map((question) => question.id));
export const contentBatches = [
  {
    id: 'initial-100',
    title: '初版の100問',
    releasedAt: '2026-11-04',
    questionIds: [...initialQuestionIds],
  },
  {
    id: 'expansion-2026-11-04',
    title: '0.4で追加された200問',
    releasedAt: '2026-11-04',
    questionIds: [...expansionQuestionIds],
  },
  {
    id: 'edition3-2026-11-08',
    title: '第3版を優先した追加問題',
    releasedAt: '2026-11-08',
    questionIds: [...edition3QuestionIds],
  },
] as const;

export const practiceBatchLabel = (batch: PracticeBatch) =>
  ({
    all: 'すべての通常学習問題',
    'expansion-2026-11-04': '0.4で追加された200問のみ',
    'edition3-2026-11-08': '第3版を優先した追加問題のみ',
  })[batch];

export const practiceBatchShortLabel = (batch: PracticeBatch) =>
  ({
    all: '全問題',
    'expansion-2026-11-04': '追加200問',
    'edition3-2026-11-08': '第3版追加問題',
  })[batch];

export function isInPracticeBatch(question: Question, batch: PracticeBatch): boolean {
  if (batch === 'all') return true;
  const ids = batch === 'expansion-2026-11-04' ? expansionQuestionIds : edition3QuestionIds;
  return ids.has(question.id);
}
