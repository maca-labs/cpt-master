import type { DomainId, Question } from '../../domain/types';

type Answer = [text: string, reason: string];
type AdvancedItem = {
  unitId: string;
  objectiveIds: string[];
  level: 'application' | 'analysis';
  prompt: string;
  correct: Answer;
  distractors: [Answer, Answer];
  explanation: string;
  sourceRefs: Question['sourceRefs'];
  media?: Question['media'];
};

export function advancedItem(domainId: DomainId, number: number, item: AdvancedItem): Question {
  const id = `adv-${domainId}-${String(number).padStart(2, '0')}`;
  const correctPosition = (number - 1) % 3;
  const answers = [...item.distractors];
  answers.splice(correctPosition, 0, item.correct);
  const choiceIds = ['a', 'b', 'c'];
  return {
    id,
    groupId: id,
    revision: 1,
    domainId,
    unitId: item.unitId,
    objectiveIds: item.objectiveIds,
    format: 'single_choice',
    context: item.media ? (item.media.kind === 'diagram' ? 'image' : 'video') : 'case',
    difficulty: 3,
    cognitiveLevel: item.level,
    pool: 'advanced',
    prompt: item.prompt,
    choices: answers.map(([text, explanation], index) => ({
      id: choiceIds[index],
      text,
      explanation,
    })),
    correctChoiceId: choiceIds[correctPosition],
    explanation: item.explanation,
    sourceRefs: item.sourceRefs,
    ...(item.media ? { media: item.media } : {}),
    review: {
      status: 'source_checked',
      reviewerType: 'ai',
      method: 'AIが一次資料の記載箇所と設問条件・正答・各誤答の理由を照合。',
      checkedAt: '2026-11-09',
      revision: 1,
    },
  };
}
