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
