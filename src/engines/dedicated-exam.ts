import { blueprint, domainIds } from '../content/blueprints';
import type { DomainId, ReviewStatus } from '../domain/types';
import { shuffle } from './learning';

export type DedicatedExamAccess = 'preview' | 'released';

export interface DedicatedExamItem {
  id: string;
  revision: number;
  groupId: string;
  domainId: DomainId;
  prompt: string;
  scored: boolean;
  choices: { id: string; text: string; explanation: string }[];
  correctChoiceId: string;
  explanation: string;
  sourceRefs?: { title: string; url: string; locator: string }[];
  review: {
    status: ReviewStatus;
    reviewerType: 'ai' | 'human_expert';
    revision: number;
    checkedAt: string;
    method: string;
    reviewer?: string;
  };
  media?: {
    kind: 'diagram' | 'animation' | 'video';
    src: string;
    alt: string;
    rights: {
      decision: 'usable';
      basis: 'original' | 'licensed';
      holder: string;
      evidence: string;
      checkedAt: string;
    };
  };
}

export interface DedicatedExamPack {
  id: string;
  title?: string;
  revision: number;
  status: 'preparing' | 'released_study' | 'released';
  items: DedicatedExamItem[];
}

interface Score {
  correct: number;
  total: number;
  answered: number;
  unanswered: number;
  rate: number;
}

export interface DedicatedExamResult extends Score {
  domains: (Score & { id: DomainId })[];
}

interface DedicatedExamSessionBase {
  id: string;
  packKey: string;
  status: 'active' | 'completed';
  questionIds: string[];
  choiceOrders: Record<string, string[]>;
  index: number;
  flags: string[];
  answers: Record<string, string>;
  startedAt: number;
  completedAt?: number;
  finishedReason?: 'submitted' | 'timeout';
  result?: DedicatedExamResult;
}

type DedicatedExamAttempt = DedicatedExamSessionBase & {
  deadlineAt: number;
  pausedRemainingMs?: number;
  retakeOf?: never;
};

export type DedicatedExamRetake = DedicatedExamSessionBase & {
  deadlineAt: null;
  pausedRemainingMs?: never;
  retakeOf: string;
  retakeNumber: number;
};

export type DedicatedExamSession = DedicatedExamAttempt | DedicatedExamRetake;

export type DedicatedExamAction =
  | { type: 'answer'; questionId: string; choiceId: string }
  | { type: 'flag'; questionId: string; flagged?: boolean }
  | { type: 'navigate'; index: number };

export const dedicatedExamLimitMs = blueprint.durationMinutes * 60 * 1000;

const validRevision = (revision: number) => Number.isSafeInteger(revision) && revision >= 1;
const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const safeId = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[a-z0-9][a-z0-9_-]*$/i.test(value) &&
  !Object.hasOwn(Object.prototype, value);
function validDate(value: string) {
  const day = /^\d{4}-\d{2}-\d{2}(?=$|T)/.exec(value)?.[0];
  if (!day || !Number.isFinite(Date.parse(value))) return false;
  const timestamp = Date.parse(day);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().startsWith(day);
}

function validSourceUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function hasUsableMedia(media: NonNullable<DedicatedExamItem['media']>) {
  return (
    ['diagram', 'animation', 'video'].includes(media.kind) &&
    hasText(media.src) &&
    !/^\s*(?:javascript|vbscript):/i.test(media.src) &&
    hasText(media.alt) &&
    media.rights?.decision === 'usable' &&
    ['original', 'licensed'].includes(media.rights.basis) &&
    hasText(media.rights.holder) &&
    hasText(media.rights.evidence) &&
    validDate(media.rights.checkedAt)
  );
}

function hasReview(item: DedicatedExamItem, allowAiReview: boolean) {
  const review = item.review;
  if (
    !review ||
    review.revision !== item.revision ||
    !validDate(review.checkedAt) ||
    !hasText(review.method)
  )
    return false;
  if (review.status === 'expert_reviewed')
    return review.reviewerType === 'human_expert' && hasText(review.reviewer);
  return allowAiReview && review.status === 'source_checked' && review.reviewerType === 'ai';
}

export function validateDedicatedExamPack(
  pack: DedicatedExamPack | null | undefined,
  access: DedicatedExamAccess,
): string[] {
  if (!pack) return ['専用模試のセットがありません。'];
  if (!Array.isArray(pack.items) || pack.items.some((item) => !item || typeof item !== 'object'))
    return ['専用模試の問題データを確認できません。'];
  const issues: string[] = [];
  const eligibleStatus =
    access === 'preview'
      ? pack.status === 'preparing'
      : pack.status === 'released' || pack.status === 'released_study';
  if (!eligibleStatus) issues.push('このセットは受験を開始できる公開状態ではありません。');
  if (!safeId(pack.id) || !validRevision(pack.revision))
    issues.push('セットIDまたは改訂番号が不正です。');
  if (pack.items.length !== blueprint.scored + blueprint.unscored)
    issues.push('採点対象140問と採点対象外15問が必要です。');

  const ids = new Set(pack.items.map((item) => item.id));
  const groups = new Set(pack.items.map((item) => item.groupId));
  if (ids.size !== pack.items.length || groups.size !== pack.items.length)
    issues.push('問題IDまたは問題グループに重複があります。');

  const scored = pack.items.filter((item) => item.scored === true);
  const unscored = pack.items.filter((item) => item.scored === false);
  if (
    scored.length !== blueprint.scored ||
    unscored.length !== blueprint.unscored ||
    domainIds.some(
      (domain) =>
        scored.filter((item) => item.domainId === domain).length !==
        blueprint.scoredDomainCounts[domain],
    )
  )
    issues.push('採点区分または採点対象の分野配分が設定と一致しません。');

  const media = pack.items.flatMap((item) => (item.media ? [item.media] : []));
  if (media.length < blueprint.mediaMinimum || media.length > blueprint.mediaMaximum)
    issues.push('画像・映像問題が25〜35問必要です。');
  if (media.some((asset) => !hasUsableMedia(asset)))
    issues.push('画像・映像に利用権の記録または代替テキストがありません。');

  for (const item of pack.items) {
    if (
      !safeId(item.id) ||
      !safeId(item.groupId) ||
      !validRevision(item.revision) ||
      !domainIds.includes(item.domainId) ||
      !hasText(item.prompt) ||
      !hasText(item.explanation) ||
      !Array.isArray(item.choices) ||
      item.choices.length !== blueprint.choiceCount ||
      item.choices.some(
        (choice) =>
          !choice || !safeId(choice.id) || !hasText(choice.text) || !hasText(choice.explanation),
      ) ||
      new Set(item.choices.map((choice) => choice.id)).size !== blueprint.choiceCount ||
      !item.choices.some((choice) => choice.id === item.correctChoiceId) ||
      new Set(item.choices.map((choice) => choice.text.normalize('NFKC').trim())).size !==
        blueprint.choiceCount
    )
      issues.push(item.id + ' の設問または選択肢が不正です。');
    if (!hasReview(item, pack.status === 'preparing' || pack.status === 'released_study'))
      issues.push(item.id + ' の現在の改訂に必要な審査記録がありません。');
    if (
      !Array.isArray(item.sourceRefs) ||
      !item.sourceRefs.length ||
      item.sourceRefs.some(
        (source) =>
          !source ||
          !hasText(source.title) ||
          !validSourceUrl(source.url) ||
          !hasText(source.locator),
      )
    )
      issues.push(item.id + ' の出典の記録がありません。');
  }
  return issues;
}

export function dedicatedExamPackKey(pack: DedicatedExamPack) {
  return pack.id + ':' + pack.revision;
}

function createSession(
  pack: DedicatedExamPack,
  items: DedicatedExamItem[],
  now: number,
  rng: () => number,
): DedicatedExamSessionBase {
  return {
    id: crypto.randomUUID(),
    packKey: dedicatedExamPackKey(pack),
    status: 'active',
    questionIds: shuffle(
      items.map((item) => item.id),
      rng,
    ),
    choiceOrders: Object.fromEntries(
      items.map((item) => [
        item.id,
        shuffle(
          item.choices.map((choice) => choice.id),
          rng,
        ),
      ]),
    ),
    index: 0,
    flags: [],
    answers: {},
    startedAt: now,
  };
}

export function createDedicatedExamSession(
  pack: DedicatedExamPack,
  now: number,
  rng: () => number = Math.random,
): DedicatedExamAttempt {
  return {
    ...createSession(pack, pack.items, now, rng),
    deadlineAt: now + dedicatedExamLimitMs,
  };
}

export function dedicatedMissedQuestionIds(pack: DedicatedExamPack, source: DedicatedExamSession) {
  if (
    source.status !== 'completed' ||
    source.retakeOf ||
    source.packKey !== dedicatedExamPackKey(pack)
  )
    return [];

  const answers = new Map(pack.items.map((item) => [item.id, item.correctChoiceId]));
  return source.questionIds.filter(
    (id) => answers.has(id) && source.answers[id] !== answers.get(id),
  );
}

export function createDedicatedMissedRetake(
  pack: DedicatedExamPack,
  source: DedicatedExamSession,
  retakeNumber: number,
  now: number,
  rng: () => number = Math.random,
): DedicatedExamRetake {
  const missed = new Set(dedicatedMissedQuestionIds(pack, source));
  if (!missed.size) throw new Error('解き直しの対象になる不正解・未回答の問題はありません。');
  return {
    ...createSession(
      pack,
      pack.items.filter((item) => missed.has(item.id)),
      now,
      rng,
    ),
    deadlineAt: null,
    retakeOf: source.id,
    retakeNumber,
  };
}

export function remainingDedicatedMilliseconds(session: DedicatedExamSession, now = Date.now()) {
  if (session.deadlineAt === null) return 0;
  if (session.pausedRemainingMs !== undefined) return session.pausedRemainingMs;
  const until = Math.max(session.startedAt, session.completedAt ?? now);
  return Math.max(0, Math.min(dedicatedExamLimitMs, session.deadlineAt - until));
}

export function remainingDedicatedSeconds(session: DedicatedExamSession, now = Date.now()) {
  return Math.ceil(remainingDedicatedMilliseconds(session, now) / 1000);
}

function score(items: DedicatedExamItem[], answers: Record<string, string>): Score {
  const answered = items.filter((item) =>
    item.choices.some((choice) => choice.id === answers[item.id]),
  );
  const correct = answered.filter((item) => answers[item.id] === item.correctChoiceId).length;
  return {
    correct,
    total: items.length,
    answered: answered.length,
    unanswered: items.length - answered.length,
    rate: items.length ? Math.round((correct / items.length) * 100) : 0,
  };
}

export function scoreDedicatedExam(
  pack: DedicatedExamPack,
  answers: Record<string, string>,
  retakeQuestionIds?: readonly string[],
): DedicatedExamResult {
  const retakeIds = retakeQuestionIds ? new Set(retakeQuestionIds) : undefined;
  const scored = pack.items.filter((item) => (retakeIds ? retakeIds.has(item.id) : item.scored));
  return {
    ...score(scored, answers),
    domains: domainIds.map((id) => ({
      id,
      ...score(
        scored.filter((item) => item.domainId === id),
        answers,
      ),
    })),
  };
}
