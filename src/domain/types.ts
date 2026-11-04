export type DomainId = 'assessment' | 'planning' | 'technique' | 'safety';
export type ReviewStatus = 'draft' | 'source_checked' | 'expert_reviewed';
export interface Source {
  id: string;
  title: string;
  url: string;
  edition: string | null;
  checkedAt: string;
  locator: string;
  note?: string;
}
export interface SourceRef {
  sourceId: string;
  locator: string;
}
export interface Unit {
  id: string;
  domainId: DomainId;
  title: string;
  subtitle: string;
  minutes: number;
  level: '基礎' | '応用';
  foundation?: string;
  objectives: { id: string; text: string }[];
  sections: { title: string; body: string; bullets?: string[] }[];
  example: { situation: string; judgment: string };
  terms: { term: string; meaning: string }[];
  sourceRefs: SourceRef[];
}
export interface Question {
  id: string;
  revision: number;
  groupId: string;
  domainId: DomainId;
  unitId: string;
  objectiveIds: string[];
  format: 'single_choice' | 'true_false';
  context: 'text' | 'case' | 'image' | 'video';
  difficulty: 1 | 2 | 3;
  pool: 'diagnostic' | 'practice' | 'exam';
  prompt: string;
  choices: { id: string; text: string; explanation: string }[];
  correctChoiceId: string;
  explanation: string;
  sourceRefs: SourceRef[];
  review: {
    status: ReviewStatus;
    reviewerType: 'ai' | 'human_expert';
    method: string;
    checkedAt: string;
    revision: number;
    notes?: string;
  };
}
export interface VideoContentReview {
  decision: 'recommended' | 'hold';
  reviewerType: 'ai' | 'human_expert';
  method: 'transcript' | 'visual' | 'transcript_and_visual' | 'unavailable';
  coverage: string;
  objectiveIds: string[];
  checkedAt: string;
  findings: string[];
  limitations: string[];
  evidence: { url: string; locator: string }[];
}
export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  url: string;
  unitIds: string[];
  objectiveIds: string[];
  difficulty: '基礎' | '応用';
  order: number;
  reason: string;
  metadata: {
    status: 'confirmed' | 'unconfirmed';
    checkedAt: string;
    method: string;
    evidenceUrl: string;
  };
  playback: {
    status: 'unconfirmed' | 'playable' | 'embed_blocked' | 'unavailable';
    checkedAt: string | null;
    method: string | null;
  };
  content: {
    status: 'unreviewed' | 'source_checked' | 'expert_reviewed';
    checkedAt: string | null;
    method: string | null;
    sourceRefs: SourceRef[];
    review?: VideoContentReview;
  };
}
export interface Exposure {
  id: string;
  questionId: string;
  groupId: string;
  kind: 'question' | 'explanation';
  sessionId: string;
  at: string;
}
export interface Attempt {
  id: string;
  sessionId: string;
  questionId: string;
  questionRevision: number;
  groupId: string;
  domainId: DomainId;
  unitId: string;
  selectedChoiceId: string;
  correctChoiceId: string;
  correct: boolean;
  firstSeen: boolean;
  canExplain: boolean;
  elapsedMs: number;
  choiceOrder: string[];
  at: string;
}
export interface ReviewItem {
  questionId: string;
  dueAt: string;
  intervalDays: number;
  wrongStreak: number;
  manual: boolean;
}
export interface Session {
  id: string;
  mode: 'diagnostic' | 'practice' | 'review';
  questionIds: string[];
  choiceOrders: Record<string, string[]>;
  index: number;
  status: 'active' | 'completed';
  startedAt: string;
  completedAt?: string;
  firstSeenByQuestion: Record<string, boolean>;
}
export interface VideoProgress {
  videoId: string;
  watched: boolean;
  note: string;
  updatedAt: string;
}
export interface UnitProgress {
  unitId: string;
  rating: number;
  note: string;
  updatedAt: string;
}
export interface StudyEvent {
  id: string;
  seconds: number;
  at: string;
  localDate: string;
}
export interface VideoOverride {
  id: string;
  deleted?: boolean;
  video?: Video;
}
export interface AppSettings {
  id: 'main';
  theme: 'light' | 'dark' | 'system';
  diagnosticStatus: 'not_started' | 'started' | 'completed' | 'skipped';
  timezone: string;
}
