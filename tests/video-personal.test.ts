import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { seedVideos } from '../src/content';
import type { Video } from '../src/domain/types';
import { isRecommendedVideo } from '../src/engines/video-review';
import {
  LearningDB,
  exportBackup,
  mergedVideos,
  toPersonalVideo,
  validateBackup,
} from '../src/storage/db';

let database: LearningDB;

function reviewed(youtubeId = 'XBkaAAwyS4s'): Video {
  const video = seedVideos.find((candidate) => candidate.youtubeId === youtubeId);
  if (!video || !isRecommendedVideo(video))
    throw new Error('照合済み動画のテスト用参照がありません。');
  return structuredClone(video);
}

beforeEach(() => {
  database = new LearningDB(`cpt-video-personal-${crypto.randomUUID()}`);
});

afterEach(async () => {
  await database.delete();
});

describe('personal video settings and bundled content reviews', () => {
  it('keeps only personal data in a saved override and validates its JSON backup', async () => {
    const source = reviewed();
    const originalContent = structuredClone(source.content);
    const personal = toPersonalVideo(source);
    expect(personal.content).toEqual({
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
    });
    expect(personal.youtubeId).toBe(source.youtubeId);
    expect(personal.objectiveIds).toEqual(source.objectiveIds);
    expect(source.content).toEqual(originalContent);
    await database.videoOverrides.add({ id: personal.id, video: personal });
    const backup = await exportBackup(database);
    expect(validateBackup(JSON.stringify(backup)).data.videoOverrides[0].video?.content).toEqual(
      personal.content,
    );
  });

  it('exports valid backups after reordering all videos and hiding a reviewed video', async () => {
    const reordered = [...seedVideos].reverse().map((video, order) => ({
      id: video.id,
      video: toPersonalVideo({ ...video, order }),
    }));
    await database.videoOverrides.bulkPut(reordered);
    const beforeHide = await exportBackup(database);
    expect(() => validateBackup(JSON.stringify(beforeHide))).not.toThrow();
    const source = reviewed();
    await database.videoOverrides.put({
      id: source.id,
      deleted: true,
      video: toPersonalVideo(source),
    });
    const afterHide = await exportBackup(database);
    expect(() => validateBackup(JSON.stringify(afterHide))).not.toThrow();
    expect(
      mergedVideos(seedVideos, afterHide.data.videoOverrides).some(
        (video) => video.id === source.id,
      ),
    ).toBe(false);
  });

  it.each([
    ['XBkaAAwyS4s', 'professional', 'transcript'],
    ['fIvDJoyVgRQ', 'technique', 'visual'],
  ])(
    'uses the current bundled review for %s when only ordering changes',
    (youtubeId, unitId, method) => {
      const source = reviewed(youtubeId);
      const override = toPersonalVideo({ ...source, order: 999 });
      const result = mergedVideos([source], [{ id: source.id, video: override }])[0];
      expect(result.order).toBe(999);
      expect(result.content).toEqual(source.content);
      expect(isRecommendedVideo(result, unitId)).toBe(true);
      expect(result.content.review?.method).toBe(method);
      expect(override.content.status).toBe('unreviewed');
    },
  );

  it('does not let an old unreviewed personal override hide an updated bundled review', () => {
    const source = reviewed();
    const oldOverride = toPersonalVideo(source);
    const updated = structuredClone(source);
    updated.content.review!.findings = ['一次資料を再照合した現行の記録'];
    const result = mergedVideos([updated], [{ id: source.id, video: oldOverride }])[0];
    expect(result.content.review?.findings).toEqual(['一次資料を再照合した現行の記録']);
    expect(isRecommendedVideo(result)).toBe(true);
  });

  it.each(['youtube', 'objective', 'unit'] as const)(
    'removes bundled review when the %s assignment changes',
    (kind) => {
      const source = reviewed();
      const override = toPersonalVideo(source);
      if (kind === 'youtube') {
        override.youtubeId = 'qL7C2MzikiU';
        override.url = 'https://www.youtube.com/watch?v=qL7C2MzikiU';
      } else if (kind === 'objective') {
        override.objectiveIds = ['professional-o1'];
      } else {
        override.unitIds = ['anatomy'];
        override.objectiveIds = ['anatomy-o1'];
      }
      const result = mergedVideos([source], [{ id: source.id, video: override }])[0];
      expect(result.content.status).toBe('unreviewed');
      expect(result.content.review).toBeUndefined();
      expect(isRecommendedVideo(result)).toBe(false);
    },
  );

  it('does not promote a personal duplicate of reviewed media to a bundled recommendation', () => {
    const personal = { ...reviewed(), id: 'personal-same-media' };
    const result = mergedVideos(seedVideos, [{ id: personal.id, video: personal }]).find(
      (video) => video.id === personal.id,
    )!;
    expect(result.content).toEqual({
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
    });
    expect(isRecommendedVideo(result)).toBe(false);
    expect(seedVideos.filter((video) => isRecommendedVideo(video))).toHaveLength(2);
  });

  it('ignores a forged personal review and rejects it in imported backup data', async () => {
    const forged = { ...reviewed(), id: 'personal-forged-review' };
    const shown = mergedVideos([], [{ id: forged.id, video: forged }])[0];
    expect(shown.content.review).toBeUndefined();
    expect(isRecommendedVideo(shown)).toBe(false);
    await database.videoOverrides.add({ id: forged.id, video: forged });
    const backup = await exportBackup(database);
    expect(() => validateBackup(JSON.stringify(backup))).toThrow();
  });

  it('rejects an injected review even when its surrounding status is unreviewed', async () => {
    const source = reviewed();
    const injected = toPersonalVideo(source);
    injected.content.review = source.content.review;
    await database.videoOverrides.add({ id: injected.id, video: injected });
    const backup = await exportBackup(database);
    expect(() => validateBackup(JSON.stringify(backup))).toThrow();
  });

  it('can hide and restore a recommendation without changing the distributed catalog', () => {
    const source = reviewed();
    const original = structuredClone(source);
    const personal = toPersonalVideo(source);
    expect(mergedVideos([source], [{ id: source.id, deleted: true, video: personal }])).toEqual([]);
    const restored = mergedVideos([source], [{ id: source.id, video: personal }]);
    expect(restored).toHaveLength(1);
    expect(isRecommendedVideo(restored[0])).toBe(true);
    expect(source).toEqual(original);
  });
});
