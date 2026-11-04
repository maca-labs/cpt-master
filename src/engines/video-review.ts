import { sources, units } from '../content';
import type { Video } from '../domain/types';

/** The registry is explicit so the decision can also be tested without changing
 * distributed content. Do not import this engine from content/videos.ts. */
export interface VideoReviewRegistry {
  sourceIds: ReadonlySet<string>;
  objectiveUnits: ReadonlyMap<string, string>;
}

const defaultRegistry: VideoReviewRegistry = {
  sourceIds: new Set(sources.map((source) => source.id)),
  objectiveUnits: new Map(
    units.flatMap((unit) => unit.objectives.map((objective) => [objective.id, unit.id] as const)),
  ),
};

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
function validDate(value: unknown): value is string {
  if (
    !hasText(value) ||
    !/^\d{4}-\d{2}-\d{2}(?:T.+)?$/.test(value) ||
    !Number.isFinite(Date.parse(value))
  )
    return false;
  return (
    new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) === value.slice(0, 10)
  );
}
function httpsUrl(value: unknown): URL | null {
  if (!hasText(value)) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}
function matchingYoutubeUrl(value: unknown, youtubeId: string): boolean {
  const url = httpsUrl(value);
  if (!url) return false;
  if (url.hostname === 'youtu.be') return url.pathname === `/${youtubeId}`;
  if (!['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) return false;
  return url.pathname === '/watch'
    ? url.searchParams.get('v') === youtubeId
    : [`/embed/${youtubeId}`, `/shorts/${youtubeId}`].includes(url.pathname);
}

/** Returns whether a saved content review meets the recommendation conditions.
 * This function never fetches a video, performs a review, changes a status, or
 * converts metadata confirmation into content verification. */
export function isRecommendedVideo(
  video: Video,
  unitId?: string,
  registry: VideoReviewRegistry = defaultRegistry,
): boolean {
  const content = video?.content,
    review = content?.review;
  if (!content || !review || !['source_checked', 'expert_reviewed'].includes(content.status))
    return false;
  if (
    review.decision !== 'recommended' ||
    !['transcript', 'visual', 'transcript_and_visual'].includes(review.method)
  )
    return false;
  if (!['ai', 'human_expert'].includes(review.reviewerType)) return false;
  if (content.status === 'expert_reviewed' && review.reviewerType !== 'human_expert') return false;
  if (
    !validDate(review.checkedAt) ||
    !validDate(content.checkedAt) ||
    review.checkedAt.slice(0, 10) !== content.checkedAt.slice(0, 10)
  )
    return false;
  if (!hasText(content.method) || !hasText(review.coverage)) return false;
  if (
    !Array.isArray(review.findings) ||
    review.findings.length === 0 ||
    !review.findings.every(hasText)
  )
    return false;
  if (!Array.isArray(review.limitations) || !review.limitations.every(hasText)) return false;
  if (
    !Array.isArray(review.evidence) ||
    review.evidence.length === 0 ||
    !review.evidence.every((item) => item && httpsUrl(item.url) && hasText(item.locator))
  )
    return false;
  if (
    !Array.isArray(content.sourceRefs) ||
    content.sourceRefs.length === 0 ||
    !content.sourceRefs.every(
      (item) => item && registry.sourceIds.has(item.sourceId) && hasText(item.locator),
    )
  )
    return false;

  if (
    !hasText(video.youtubeId) ||
    !/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId) ||
    !matchingYoutubeUrl(video.url, video.youtubeId) ||
    !hasText(video.title) ||
    !hasText(video.channel)
  )
    return false;
  if (
    video.metadata?.status !== 'confirmed' ||
    !validDate(video.metadata.checkedAt) ||
    !hasText(video.metadata.method) ||
    !httpsUrl(video.metadata.evidenceUrl)
  )
    return false;
  // A transcript can support a content review without proving embed playback.
  // A known unavailable video, however, is not a usable recommendation.
  if (video.playback?.status === 'unavailable') return false;

  if (
    !Array.isArray(video.unitIds) ||
    !video.unitIds.length ||
    !video.unitIds.every(hasText) ||
    new Set(video.unitIds).size !== video.unitIds.length
  )
    return false;
  const actualUnitIds = new Set(registry.objectiveUnits.values());
  if (!video.unitIds.every((id) => actualUnitIds.has(id))) return false;
  if (
    !Array.isArray(video.objectiveIds) ||
    !video.objectiveIds.length ||
    !video.objectiveIds.every(hasText) ||
    new Set(video.objectiveIds).size !== video.objectiveIds.length
  )
    return false;
  if (
    !video.objectiveIds.every((id) => {
      const actualUnit = registry.objectiveUnits.get(id);
      return actualUnit !== undefined && video.unitIds.includes(actualUnit);
    })
  )
    return false;
  if (
    !Array.isArray(review.objectiveIds) ||
    !review.objectiveIds.length ||
    !review.objectiveIds.every(hasText) ||
    new Set(review.objectiveIds).size !== review.objectiveIds.length
  )
    return false;
  if (
    !review.objectiveIds.every(
      (id) =>
        video.objectiveIds.includes(id) &&
        registry.objectiveUnits.has(id) &&
        video.unitIds.includes(registry.objectiveUnits.get(id)!),
    )
  )
    return false;
  return (
    unitId === undefined ||
    (video.unitIds.includes(unitId) &&
      review.objectiveIds.some((id) => registry.objectiveUnits.get(id) === unitId))
  );
}
