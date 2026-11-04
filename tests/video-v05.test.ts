import { describe, expect, it } from 'vitest';
import { seedVideos, sources, units } from '../src/content';
import { videoV05Additions } from '../src/content/video-additions-v05';
import { isRecommendedVideo } from '../src/engines/video-review';

// These checks audit saved identities, evidence records and scope. They do not
// replay videos or replace the visual/source review documented in VIDEO_REVIEW_0.5.
describe('v0.5 scoped video review records', () => {
  it('adds eight distinct reviewed videos and retains eight existing holds', () => {
    expect(videoV05Additions.map((v) => v.youtubeId).sort()).toEqual(
      [
        'K0aNKaCKBsE',
        'QB-r-j_lciA',
        'hSTnDmUm3MY',
        'IZEN9zAMjqA',
        'tRk3t97VBLs',
        'UlUjS6_A0Qc',
        '4zWu1yuJ0_g',
        'RpbxIG5HTf4',
      ].sort(),
    );
    expect(seedVideos).toHaveLength(18);
    expect(new Set(seedVideos.map((v) => v.youtubeId)).size).toBe(18);
    expect(seedVideos.filter((v) => isRecommendedVideo(v))).toHaveLength(10);
    expect(seedVideos.filter((v) => !isRecommendedVideo(v))).toHaveLength(8);
  });
  it('keeps metadata, actual visual scope, source references and reviewer type explicit', () => {
    for (const video of videoV05Additions) {
      expect(isRecommendedVideo(video, video.unitIds[0])).toBe(true);
      expect(video.metadata.status).toBe('confirmed');
      expect(video.content.review).toMatchObject({
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
      });
      expect(video.content.review!.coverage).toMatch(/0:/);
      expect(video.content.review!.limitations.join(' ')).toMatch(/音声.*未実施/);
      expect(video.content.review!.limitations.join(' ')).toContain(
        '全学習目標を確認した意味ではありません',
      );
      for (const id of video.content.review!.objectiveIds)
        expect(
          units.some((u) => video.unitIds.includes(u.id) && u.objectives.some((o) => o.id === id)),
        ).toBe(true);
      for (const ref of video.content.sourceRefs)
        expect(sources.some((s) => s.id === ref.sourceId)).toBe(true);
    }
    expect(new Set(videoV05Additions.flatMap((v) => v.unitIds)).size).toBe(6);
  });
  it('does not infer embedding or full viewing from playback in a normal watch page', () => {
    expect(videoV05Additions.filter((v) => v.playback.status === 'playable')).toHaveLength(8);
    expect(videoV05Additions.filter((v) => v.embed?.status === 'embeddable')).toHaveLength(6);
    const unknown = videoV05Additions.filter((v) => v.embed?.status === 'unconfirmed');
    expect(unknown.map((v) => v.youtubeId).sort()).toEqual(['UlUjS6_A0Qc', 'RpbxIG5HTf4'].sort());
    expect(unknown.every((v) => v.embed?.checkedAt === null && v.embed.method === null)).toBe(true);
    expect(
      videoV05Additions.every((v) =>
        v.playback.method!.includes('全編連続再生・音声の聴取は未実施'),
      ),
    ).toBe(true);
  });
});
