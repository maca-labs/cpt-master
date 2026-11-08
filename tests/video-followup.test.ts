import { describe, expect, it } from 'vitest';
import { questions, seedVideos, sources, units } from '../src/content';
import { isRecommendedVideo } from '../src/engines/video-review';
import { videoReviews } from '../src/content/video-reviews';

const video = (youtubeId: string) => seedVideos.find((item) => item.youtubeId === youtubeId)!;
const originalVideos = seedVideos.filter((item) => Object.hasOwn(videoReviews, item.youtubeId));

describe('follow-up video review scope', () => {
  it('distinguishes seven transcript reads, one visual review and two unavailable transcripts', () => {
    expect(
      originalVideos.filter((item) =>
        ['transcript', 'transcript_and_visual'].includes(item.content.review!.method),
      ),
    ).toHaveLength(7);
    expect(originalVideos.filter((item) => item.content.review!.method === 'visual')).toHaveLength(
      1,
    );
    expect(
      originalVideos
        .filter((item) => item.content.review!.method === 'unavailable')
        .map((item) => item.youtubeId)
        .sort(),
    ).toEqual(['0VT-7KAtOxw', 'vfyowlhlRlA']);
    expect(originalVideos.filter((item) => isRecommendedVideo(item))).toHaveLength(2);
  });

  it('limits the squat recommendation to its observed frames and technique objective', () => {
    const squat = video('fIvDJoyVgRQ');
    const review = squat.content.review!;
    expect(review.method).toBe('visual');
    expect(review.objectiveIds).toEqual(['technique-o4']);
    expect(squat.objectiveIds).toEqual(['technique-o4']);
    expect(isRecommendedVideo(squat, 'technique')).toBe(true);
    expect(isRecommendedVideo(squat, 'safety')).toBe(false);
    expect(review.coverage).toContain('0:05');
    expect(review.coverage).toContain('1:05');
    expect(review.coverage).toMatch(/全フレーム.*ではない/);
    expect(review.limitations.join(' ')).toMatch(/音声.*確認していない/);
    expect(review.limitations.join(' ')).toMatch(/埋め込み.*未確認/);
    expect(review.limitations.join(' ')).toMatch(/人間の専門家.*未実施/);
    const citedUrls = squat.content.sourceRefs.map(
      (ref) => sources.find((source) => source.id === ref.sourceId)?.url,
    );
    expect(citedUrls).toContain('https://park.nsca-japan.or.jp/category-13/post-1106/');
    expect(citedUrls).toContain(
      'https://nsca-japan.or.jp/pdf/education/wl-test/wl_test_basic_backsquat.pdf',
    );
  });

  it('adds individual range and safety guidance without fabricating questions for the new objective', () => {
    const technique = units.find((unit) => unit.id === 'technique')!;
    expect(technique.objectives.find((item) => item.id === 'technique-o4')).toBeDefined();
    const section = technique.sections.find((item) =>
      item.body.includes('ハイバーバックスクワット'),
    );
    expect(section).toBeDefined();
    const text = `${section!.body} ${section!.bullets?.join(' ') ?? ''}`;
    expect(text).toMatch(/平行|パラレル/);
    expect(text).toMatch(/一律.*(?:求め|要求|再現).*ない|全員.*(?:求め|要求|再現).*ない/);
    expect(text).toMatch(/柔軟性|可動域/);
    expect(text).toMatch(/かかと|踵/);
    expect(text).toContain('セーフティ');
    expect(text).toContain('補助');
    expect(questions).toHaveLength(600);
    expect(questions.some((item) => item.objectiveIds.includes('technique-o4'))).toBe(false);
  });

  it('keeps CPR on hold after the scoped current-guideline comparison leaves an infant-method discrepancy', () => {
    const cpr = video('NGNaD_UY-A4');
    expect(cpr.content.review).toMatchObject({
      method: 'transcript',
      decision: 'hold',
      objectiveIds: ['safety-o2'],
    });
    expect(cpr.content.status).toBe('unreviewed');
    expect(isRecommendedVideo(cpr)).toBe(false);
    const reviewText = [
      cpr.content.review!.coverage,
      ...cpr.content.review!.findings,
      ...cpr.content.review!.limitations,
    ].join(' ');
    expect(reviewText).toContain('2020');
    expect(reviewText).toContain('2025');
    expect(cpr.content.review!.coverage).toContain('pp.20–38・42–44');
    expect(reviewText).toContain('16:19–16:31');
    expect(reviewText).toContain('乳児');
    expect(reviewText).toContain('2本指');
    expect(reviewText).toContain('手のひら');
    expect(reviewText).toContain('音声・実演を未確認');
    expect(reviewText).toContain('全改訂差分を確認したという意味ではない');
  });
});
