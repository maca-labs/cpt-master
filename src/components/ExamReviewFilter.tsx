import type { Ref } from 'react';
import { Check } from 'lucide-react';

export function ExamReviewFilter({
  onlyMissed,
  onToggle,
  buttonRef,
}: {
  onlyMissed: boolean;
  onToggle: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      className="button secondary exam-review-filter"
      type="button"
      aria-pressed={onlyMissed}
      onClick={onToggle}
    >
      <Check size={16} aria-hidden="true" />
      不正解・未回答のみ
    </button>
  );
}
