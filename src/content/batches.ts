import type { Question } from '../domain/types';
import { foundationQuestions } from './foundations';
import { appliedQuestions } from './applied';
import { assessmentExpansionQuestions } from './expansion/assessment';
import { planningExpansionQuestions } from './expansion/planning';
import { techniqueExpansionQuestions } from './expansion/technique';
import { safetyExpansionQuestions } from './expansion/safety';

export type PracticeBatch = 'all' | 'expansion-2026-11-04';

// Catalog membership is separate from immutable question/revision objects.
// IDs come from the release's actual source modules, not a naming convention.
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
] as const;

export const practiceBatchLabel = (batch: PracticeBatch) =>
  batch === 'all' ? 'すべての通常学習問題' : '今回追加された200問のみ';

export function isInPracticeBatch(question: Question, batch: PracticeBatch): boolean {
  return batch === 'all' || expansionQuestionIds.has(question.id);
}
