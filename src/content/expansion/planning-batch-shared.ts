import type { Question, Source, SourceRef } from '../../domain/types';

export const planningCheckedAt = '2026-11-04';
export const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });

export interface PlanningItem {
  number: number;
  group: string;
  objective: number;
  difficulty?: 1 | 2 | 3;
  prompt: string;
  options: [string, string][];
  explanation: string;
  refs: SourceRef[];
  verification: string;
}

/** Only call for original items already read and checked individually against
 * their cited passages. This formats that completed review; it does not perform
 * a content review or turn schema validation into source verification. */
export function reviewedPlanningItems(
  unitId: string,
  sources: Source[],
  reviewedAt: string,
  items: PlanningItem[],
): Question[] {
  return items.map((item) => {
    const correct = item.number % 3;
    const ordered = [...item.options];
    ordered.splice(correct, 0, ordered.shift()!);
    const references = item.refs.map((entry) => {
      const source = sources.find((candidate) => candidate.id === entry.sourceId);
      if (!source) throw new Error(`Missing reviewed planning source: ${entry.sourceId}`);
      return `${source.url} の ${entry.locator}`;
    });
    return {
      id: `${unitId}-${String(item.number).padStart(2, '0')}`,
      revision: 1,
      groupId: `ex-plan-${item.group}`,
      domainId: 'planning',
      unitId,
      objectiveIds: [`${unitId}-o${item.objective}`],
      format: 'single_choice',
      context: 'case',
      difficulty: item.difficulty ?? 2,
      pool: 'practice',
      prompt: item.prompt,
      choices: ordered.map(([text, explanation], index) => ({
        id: ['a', 'b', 'c'][index],
        text,
        explanation,
      })),
      correctChoiceId: ['a', 'b', 'c'][correct],
      explanation: item.explanation,
      sourceRefs: item.refs,
      review: {
        status: 'source_checked',
        reviewerType: 'ai',
        checkedAt: reviewedAt,
        revision: 1,
        method: `AIが${references.join('、')}を実読し、この設問の条件・正答・誤答2つの理由・解説を逐問照合。${item.verification}`,
        notes: '独自作成問題。構造検査による内容審査の代用ではなく、人間の専門家レビューは未実施。',
      },
    };
  });
}
