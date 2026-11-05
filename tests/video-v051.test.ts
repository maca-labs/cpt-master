import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { seedVideos, sources, units } from '../src/content';
import type { Source, Video } from '../src/domain/types';
import { isRecommendedVideo } from '../src/engines/video-review';
import v05VideoManifest from './fixtures/v05-video-manifest.json';

// Discover complete additive batches rather than pinning a changing total or
// silently allowing a newly authored batch to be omitted from the registry.
const batches = import.meta.glob<Record<string, unknown>>(
  '../src/content/video-additions-*-v051.ts',
  { eager: true },
);
const originalIds = new Set(v05VideoManifest.map((video) => video.id));
const originalVideos = seedVideos.filter((video) => originalIds.has(video.id));
const additions = seedVideos.filter((video) => !originalIds.has(video.id));
const videoExports = Object.entries(batches).flatMap(([path, exports]) =>
  Object.entries(exports)
    .filter(
      ([, value]) =>
        Array.isArray(value) && value.length > 0 && value.every((record) => record?.youtubeId),
    )
    .map(([name, value]) => ({ path, name, records: value as Video[] })),
);
const sourceExports = Object.values(batches).flatMap((exports) =>
  Object.values(exports)
    .filter(
      (value) =>
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((record) => record?.locator && !record?.youtubeId),
    )
    .flatMap((value) => value as Source[]),
);

describe('v0.5.1 additive video publishing regression', () => {
  it('preserves all 18 original video records byte-for-byte when serialized', () => {
    expect(v05VideoManifest).toHaveLength(18);
    expect(originalIds.size).toBe(18);
    expect(
      originalVideos.map((video) => ({
        id: video.id,
        youtubeId: video.youtubeId,
        sha256: createHash('sha256').update(JSON.stringify(video)).digest('hex'),
      })),
    ).toEqual(v05VideoManifest);
    expect(originalVideos.filter((video) => isRecommendedVideo(video))).toHaveLength(10);
    expect(originalVideos.filter((video) => !isRecommendedVideo(video))).toHaveLength(8);
  });

  it('publishes every authored addition exactly once without replacing original identities', () => {
    expect(Object.keys(batches)).toEqual(
      expect.arrayContaining([
        '../src/content/video-additions-assessment-v051.ts',
        '../src/content/video-additions-load-v051.ts',
        '../src/content/video-additions-nutrition-v051.ts',
      ]),
    );
    expect(videoExports).toHaveLength(Object.keys(batches).length);
    const authored = videoExports.flatMap((batch) => batch.records);
    expect(authored.length).toBeGreaterThan(0);
    expect(new Set(authored.map((video) => video.id)).size).toBe(authored.length);
    expect(authored.every((video) => !originalIds.has(video.id))).toBe(true);
    expect(additions.map((video) => video.id).sort()).toEqual(
      authored.map((video) => video.id).sort(),
    );
    for (const video of authored)
      expect(seedVideos.find((entry) => entry.id === video.id)).toEqual(video);
    expect(seedVideos).toHaveLength(v05VideoManifest.length + authored.length);
    expect(new Set(seedVideos.map((video) => video.id)).size).toBe(seedVideos.length);
    expect(new Set(seedVideos.map((video) => video.youtubeId)).size).toBe(seedVideos.length);
    for (const source of sourceExports)
      expect(sources.find((entry) => entry.id === source.id)).toEqual(source);
  });

  it('enforces the recommendation gate on every new declaration and objective assignment', () => {
    expect(additions.length).toBeGreaterThan(0);
    for (const video of additions) {
      const review = video.content.review;
      expect(review, video.id).toBeDefined();
      expect(video.metadata.status, video.id).toBe('confirmed');
      expect(review!.reviewerType, video.id).toBe('ai');
      expect(video.content.status, video.id).not.toBe('expert_reviewed');
      expect(isRecommendedVideo(video), video.id).toBe(review!.decision === 'recommended');
      if (review!.decision === 'recommended') {
        expect(video.content.status, video.id).toBe('source_checked');
        expect(['transcript', 'visual', 'transcript_and_visual']).toContain(review!.method);
        expect(review!.findings.length, video.id).toBeGreaterThan(0);
        expect(review!.limitations.length, video.id).toBeGreaterThan(0);
        expect(review!.evidence.length, video.id).toBeGreaterThan(0);
        expect(video.content.sourceRefs.length, video.id).toBeGreaterThan(0);
        for (const objectiveId of review!.objectiveIds) {
          const unit = units.find((entry) =>
            entry.objectives.some((goal) => goal.id === objectiveId),
          );
          expect(unit, `${video.id}: ${objectiveId}`).toBeDefined();
          expect(isRecommendedVideo(video, unit!.id), video.id).toBe(true);
        }
      } else {
        expect(isRecommendedVideo(video), video.id).toBe(false);
        for (const unitId of video.unitIds)
          expect(isRecommendedVideo(video, unitId), video.id).toBe(false);
      }
    }
  });

  it('never treats metadata, playback or missing evidence as a new review', () => {
    for (const video of additions.filter((entry) => isRecommendedVideo(entry))) {
      const metadataOnly = structuredClone(video);
      metadataOnly.content = {
        status: 'unreviewed',
        checkedAt: null,
        method: null,
        sourceRefs: [],
      };
      expect(isRecommendedVideo(metadataOnly), video.id).toBe(false);
      const noSource = structuredClone(video);
      noSource.content.sourceRefs = [];
      expect(isRecommendedVideo(noSource), video.id).toBe(false);
      const held = structuredClone(video);
      held.content.review!.decision = 'hold';
      expect(isRecommendedVideo(held), video.id).toBe(false);
    }
    for (const video of additions.filter((entry) => !isRecommendedVideo(entry))) {
      const playedCandidate: Video = {
        ...structuredClone(video),
        playback: {
          status: 'playable',
          checkedAt: '2026-11-05',
          method: 'Test playback observation',
        },
      };
      expect(isRecommendedVideo(playedCandidate), video.id).toBe(false);
    }
  });
});
