import type { Question, SourceRef } from '../../domain/types';

export const checkedAt = '2026-11-04';
export const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });
export interface TechniqueItem {
  number: number;
  unit: string;
  objective: number;
  prompt: string;
  options: [string, string][];
  answer: 0 | 1 | 2;
  explanation: string;
  refs: SourceRef[];
  difficulty?: 2 | 3;
  context?: Question['context'];
}
/** Original cases; only call after checking the specific cited passages. */
export function techniqueQuestion(item: TechniqueItem, reviewedAt: string): Question {
  const id = `ex-tech-${String(item.number).padStart(3, '0')}`;
  return {
    id,
    revision: 1,
    groupId: `${id}-g1`,
    domainId: 'technique',
    unitId: item.unit,
    objectiveIds: [`${item.unit}-o${item.objective}`],
    format: 'single_choice',
    context: item.context ?? 'case',
    difficulty: item.difficulty ?? 2,
    pool: 'practice',
    prompt: item.prompt,
    choices: item.options.map(([text, explanation], index) => ({
      id: `${id}-${['a', 'b', 'c'][index]}`,
      text,
      explanation,
    })),
    correctChoiceId: `${id}-${['a', 'b', 'c'][item.answer]}`,
    explanation: item.explanation,
    sourceRefs: item.refs,
    review: {
      status: 'source_checked',
      reviewerType: 'ai',
      checkedAt: reviewedAt,
      revision: 1,
      method:
        '公開一次資料の記載箇所を実読し、設問の前提・正答・各誤答理由を個別に照合。独自ケースとして作成。',
      notes: `AIによる出典照合であり、人間の専門家レビューではない。個人の診断や実施時の安全性を保証しない。独立した判断観点：${item.explanation}`,
    },
  };
}
export type TechniqueMedia = Record<
  string,
  {
    kind: 'diagram' | 'sequence';
    assetId: string;
    caption: string;
    alt: string;
  }
>;
