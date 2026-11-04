import { describe, expect, it } from 'vitest';
import { seedVideos } from '../src/content';
import type { Video } from '../src/domain/types';
import { isRecommendedVideo, type VideoReviewRegistry } from '../src/engines/video-review';

// Synthetic review records exercise the gate; these tests do not review a video.
function fixture(): Video {
  const video = structuredClone(seedVideos[0]);
  video.unitIds = ['anatomy'];
  video.objectiveIds = ['anatomy-o2'];
  video.content = {
    status: 'source_checked',
    checkedAt: '2026-11-04',
    method: 'テスト用の本編確認・一次資料との照合記録。実際の動画推薦ではない。',
    sourceRefs: [{ sourceId: 'f-body-movements', locator: '9.5 Types of Body Movements' }],
    review: {
      decision: 'recommended',
      reviewerType: 'ai',
      method: 'transcript',
      checkedAt: '2026-11-04',
      coverage: 'テスト用の対象区間 00:00–01:00',
      objectiveIds: ['anatomy-o2'],
      findings: ['テスト用：対象の運動用語を一次資料の該当節と照合した記録。'],
      limitations: ['合成データであり、実動画の正確性を示さない。'],
      evidence: [{ url: video.url, locator: 'テスト用区間 00:00–01:00' }],
    },
  };
  return video;
}

describe('video recommendation content-review gate', () => {
  it('accepts a complete source-checked review for its actual learning objective', () => {
    const video = fixture();
    expect(isRecommendedVideo(video)).toBe(true);
    expect(isRecommendedVideo(video, 'anatomy')).toBe(true);
    expect(isRecommendedVideo(video, 'physiology')).toBe(false);
  });

  it.each(['transcript', 'visual', 'transcript_and_visual'] as const)(
    'accepts the recorded review method %s',
    (method) => {
      const video = fixture();
      video.content.review!.method = method;
      expect(isRecommendedVideo(video)).toBe(true);
    },
  );

  it('requires a human expert to use expert_reviewed status', () => {
    const video = fixture();
    video.content.status = 'expert_reviewed';
    expect(isRecommendedVideo(video)).toBe(false);
    video.content.review!.reviewerType = 'human_expert';
    expect(isRecommendedVideo(video)).toBe(true);
    video.content.status = 'source_checked';
    expect(isRecommendedVideo(video)).toBe(true);
  });

  it('keeps metadata-only or explicitly unreviewed candidates out of recommendations', () => {
    const video = fixture();
    delete video.content.review;
    expect(isRecommendedVideo(video)).toBe(false);
    const unreviewed = fixture();
    unreviewed.content.status = 'unreviewed';
    expect(isRecommendedVideo(unreviewed)).toBe(false);
  });

  it('keeps hold and unavailable-method reviews as candidates', () => {
    const hold = fixture();
    hold.content.review!.decision = 'hold';
    expect(isRecommendedVideo(hold)).toBe(false);
    const unavailable = fixture();
    unavailable.content.review!.method = 'unavailable';
    expect(isRecommendedVideo(unavailable)).toBe(false);
  });

  it('requires findings, coverage and actual inspection evidence', () => {
    const cases: ((video: Video) => void)[] = [
      (v) => {
        v.content.review!.findings = [];
      },
      (v) => {
        v.content.review!.findings = [' '];
      },
      (v) => {
        v.content.review!.coverage = ' ';
      },
      (v) => {
        v.content.review!.evidence = [];
      },
      (v) => {
        v.content.review!.evidence[0].locator = '';
      },
      (v) => {
        v.content.review!.evidence[0].url = 'javascript:alert(1)';
      },
      (v) => {
        v.content.method = null;
      },
    ];
    for (const change of cases) {
      const video = fixture();
      change(video);
      expect(isRecommendedVideo(video)).toBe(false);
    }
  });

  it('requires resolvable source IDs and precise nonempty source locators', () => {
    const cases: ((video: Video) => void)[] = [
      (v) => {
        v.content.sourceRefs = [];
      },
      (v) => {
        v.content.sourceRefs[0].sourceId = 'missing-source';
      },
      (v) => {
        v.content.sourceRefs[0].locator = ' ';
      },
    ];
    for (const change of cases) {
      const video = fixture();
      change(video);
      expect(isRecommendedVideo(video)).toBe(false);
    }
  });

  it('rejects invalid or inconsistent review dates, including impossible calendar dates', () => {
    for (const invalid of ['', 'unknown', '2026-02-30', '2026-13-01', '2026-11-04T99:00:00Z']) {
      const video = fixture();
      video.content.review!.checkedAt = invalid;
      expect(isRecommendedVideo(video)).toBe(false);
    }
    const missingContentDate = fixture();
    missingContentDate.content.checkedAt = null;
    expect(isRecommendedVideo(missingContentDate)).toBe(false);
    const differentDay = fixture();
    differentDay.content.review!.checkedAt = '2026-11-05';
    expect(isRecommendedVideo(differentDay)).toBe(false);
    const fullTimestamp = fixture();
    fullTimestamp.content.review!.checkedAt = '2026-11-04T12:00:00+09:00';
    expect(isRecommendedVideo(fullTimestamp)).toBe(true);
  });

  it('rejects an unconfirmed or mismatched video identity even with a content-review claim', () => {
    const metadata = fixture();
    metadata.metadata.status = 'unconfirmed';
    expect(isRecommendedVideo(metadata)).toBe(false);
    const mismatch = fixture();
    mismatch.url = 'https://www.youtube.com/watch?v=aaaaaaaaaaa';
    expect(isRecommendedVideo(mismatch)).toBe(false);
    const missingEvidence = fixture();
    missingEvidence.metadata.evidenceUrl = '';
    expect(isRecommendedVideo(missingEvidence)).toBe(false);
    const unavailable = fixture();
    unavailable.playback.status = 'unavailable';
    expect(isRecommendedVideo(unavailable)).toBe(false);
  });

  it('requires the reviewed objectives to be assigned to the video and exist in the actual curriculum', () => {
    const notAssigned = fixture();
    notAssigned.content.review!.objectiveIds = ['anatomy-o1'];
    expect(isRecommendedVideo(notAssigned)).toBe(false);
    const fakeButPlausiblePrefix = fixture();
    fakeButPlausiblePrefix.objectiveIds = ['anatomy-made-up-objective'];
    fakeButPlausiblePrefix.content.review!.objectiveIds = ['anatomy-made-up-objective'];
    expect(isRecommendedVideo(fakeButPlausiblePrefix)).toBe(false);
    const wrongUnit = fixture();
    wrongUnit.unitIds = ['physiology'];
    expect(isRecommendedVideo(wrongUnit)).toBe(false);
    const empty = fixture();
    empty.content.review!.objectiveIds = [];
    expect(isRecommendedVideo(empty)).toBe(false);
  });

  it('does not recommend an unreviewed unit merely because another assigned unit was reviewed', () => {
    const video = fixture();
    video.unitIds = ['anatomy', 'physiology'];
    video.objectiveIds = ['anatomy-o2', 'physiology-o1'];
    expect(isRecommendedVideo(video)).toBe(true);
    expect(isRecommendedVideo(video, 'anatomy')).toBe(true);
    expect(isRecommendedVideo(video, 'physiology')).toBe(false);
  });

  it('accepts explicit registries without relying on a unit-ID prefix shortcut', () => {
    const video = fixture();
    const registry: VideoReviewRegistry = {
      sourceIds: new Set(['f-body-movements']),
      objectiveUnits: new Map([['anatomy-o2', 'anatomy']]),
    };
    expect(isRecommendedVideo(video, 'anatomy', registry)).toBe(true);
    expect(isRecommendedVideo(video, 'anatomy', { ...registry, sourceIds: new Set() })).toBe(false);
    expect(isRecommendedVideo(video, 'anatomy', { ...registry, objectiveUnits: new Map() })).toBe(
      false,
    );
  });

  it('is pure: it neither promotes a hold nor removes or changes candidate records', () => {
    const candidates = [fixture(), fixture()];
    candidates[1].content.review!.decision = 'hold';
    const before = structuredClone(candidates);
    expect(candidates.filter((video) => isRecommendedVideo(video))).toHaveLength(1);
    expect(candidates).toHaveLength(2);
    expect(candidates).toEqual(before);
    expect(candidates[1].content.review!.decision).toBe('hold');
  });

  it('returns false for incomplete review objects at the runtime boundary', () => {
    const video = fixture();
    video.content.review = { decision: 'recommended' } as Video['content']['review'];
    expect(() => isRecommendedVideo(video)).not.toThrow();
    expect(isRecommendedVideo(video)).toBe(false);
  });
});
