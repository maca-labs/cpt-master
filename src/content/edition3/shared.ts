import type { DomainId, Question, Source } from '../../domain/types';

export type EditionItem = [
  objective: number,
  judgment: string,
  prompt: string,
  correct: [text: string, reason: string],
  distractor1: [text: string, reason: string],
  distractor2: [text: string, reason: string],
  explanation: string,
  locator: string,
  difficulty?: 1 | 2 | 3,
];

export const editionDomainPrefix = {
  assessment: 'a',
  planning: 'p',
  technique: 't',
  safety: 's',
} as const;

export function orderEditionChoices(item: EditionItem, number: number) {
  const correct = (number - 1) % 3;
  const options = [item[4], item[5]];
  options.splice(correct, 0, item[3]);
  return { correct: correct as 0 | 1 | 2, options };
}

/** Formats manually authored items after the cited passage has been read and checked. */
export function editionPractice(
  domainId: DomainId,
  firstNumber: number,
  unitId: string,
  source: Source,
  records: EditionItem[],
): Question[] {
  return records.map((item, index) => {
    const [objective, judgment, prompt, , , , explanation, locator, difficulty] = item;
    const number = firstNumber + index;
    const id = `ed3-${editionDomainPrefix[domainId]}-${String(number).padStart(3, '0')}`;
    const { correct, options } = orderEditionChoices(item, number);
    return {
      id,
      groupId: id,
      domainId,
      unitId,
      revision: 1,
      objectiveIds: [`${unitId}-o${objective}`],
      pool: 'practice',
      format: 'single_choice',
      context: 'case',
      difficulty: difficulty ?? 2,
      prompt,
      explanation,
      choices: options.map(([text, reason], option) => ({
        id: ['a', 'b', 'c'][option],
        text,
        explanation: reason,
      })),
      correctChoiceId: ['a', 'b', 'c'][correct],
      sourceRefs: [{ sourceId: source.id, locator }],
      review: {
        status: 'source_checked',
        reviewerType: 'ai',
        checkedAt: source.checkedAt,
        revision: 1,
        method: 'AIが設問・正答・誤答理由と、記載した公開資料の該当箇所を照合。',
        notes: `判断軸：${judgment}`,
      },
    };
  });
}

export function editionSources(sources: Source[]) {
  return [...new Map(sources.map((source) => [source.id, source])).values()];
}
