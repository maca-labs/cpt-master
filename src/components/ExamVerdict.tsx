import type { Question } from '../domain/types';

export type ExamVerdictStatus = 'correct' | 'incorrect' | 'unanswered';

export const examVerdictLabels: Record<ExamVerdictStatus, string> = {
  correct: '正解',
  incorrect: '不正解',
  unanswered: '未回答',
};

const symbols: Record<ExamVerdictStatus, string> = {
  correct: '○',
  incorrect: '×',
  unanswered: '—',
};

export function getExamVerdict(
  selectedId: string | undefined,
  correctId: string,
): ExamVerdictStatus {
  if (!selectedId) return 'unanswered';
  return selectedId === correctId ? 'correct' : 'incorrect';
}

export function ExamVerdict({ status }: { status: ExamVerdictStatus }) {
  return (
    <span className={'exam-verdict exam-verdict-' + status}>
      <span aria-hidden="true">{symbols[status]}</span>
      {examVerdictLabels[status]}
    </span>
  );
}

export function takenChoiceLabel(question: Question, choiceOrder: string[], choiceId: string) {
  const choice = question.choices.find((item) => item.id === choiceId);
  const position = choiceOrder.indexOf(choiceId);
  if (!choice) return '選択肢を表示できません';
  return position >= 0 ? String.fromCharCode(65 + position) + '．' + choice.text : choice.text;
}
