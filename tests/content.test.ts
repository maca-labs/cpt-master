import { describe, expect, it, vi } from 'vitest';
import {
  canUseInExam,
  normalizePrompt,
  promptSimilarity,
  runContentValidation,
  seedContent,
  validateContent,
} from '../scripts/validate-content';
import type { ContentBundle } from '../scripts/validate-content';
import type { Question } from '../src/domain/types';
import { isRecommendedVideo } from '../src/engines/video-review';

const copy = () =>
  structuredClone(seedContent) as {
    units: ContentBundle['units'][number][];
    questions: ContentBundle['questions'][number][];
    sources: ContentBundle['sources'][number][];
    videos: ContentBundle['videos'][number][];
  };
const codes = (input: unknown) => validateContent(input).errors.map((issue) => issue.code);

describe('initial content publishing checks', () => {
  it('meets the approved unit, question, video and domain allocations', () => {
    const report = validateContent();
    expect(report.errors).toEqual([]);
    expect(report.summary).toMatchObject({
      units: 36,
      questions: 300,
      videos: seedContent.videos.length,
      byDomain: { assessment: 69, planning: 96, technique: 93, safety: 42 },
      diagnosticByDomain: { assessment: 12, planning: 16, technique: 15, safety: 7 },
      videoReviewDeclarations: {
        unreviewed: 8,
        source_checked: seedContent.videos.length - 8,
        expert_reviewed: 0,
      },
      recommendedVideos: seedContent.videos.length - 8,
      candidateVideos: 8,
      examEligible: 0,
    });
    expect(report.verificationScope).toContain('内容照合');
  });

  it('reports malformed nested data without throwing', () => {
    const input = copy();
    input.questions[0].choices = undefined as unknown as Question['choices'];
    expect(() => validateContent(input)).not.toThrow();
    expect(codes(input).some((code) => code.startsWith('schema.'))).toBe(true);
    expect(codes({ units: 'invalid' }).some((code) => code.startsWith('schema.'))).toBe(true);
  });

  it('requires choice-level explanations and an unambiguous correct ID', () => {
    const missingReason = copy();
    missingReason.questions[0].choices[0].explanation = '  ';
    expect(codes(missingReason).some((code) => code.startsWith('schema.'))).toBe(true);
    const badCorrect = copy();
    badCorrect.questions[0].correctChoiceId = 'missing-choice';
    expect(codes(badCorrect)).toContain('choice.correct');
    const repeatedId = copy();
    repeatedId.questions[0].choices[1].id = repeatedId.questions[0].choices[0].id;
    expect(codes(repeatedId)).toContain('choice.id-duplicate');
  });

  it('requires three distinct choices and rejects normalized duplicate choice text', () => {
    const twoChoices = copy();
    twoChoices.questions[0].choices.pop();
    expect(codes(twoChoices)).toContain('question.format');
    const sameText = copy();
    sameText.questions[0].choices[1].text = `${sameText.questions[0].choices[0].text}。`;
    expect(codes(sameText)).toContain('choice.text-duplicate');
  });

  it('checks source existence and locators independently from stored review status', () => {
    const missingSource = copy();
    missingSource.questions[0].sourceRefs[0].sourceId = 'nonexistent-source';
    expect(codes(missingSource)).toContain('source.missing');
    const missingLocator = copy();
    missingLocator.questions[0].sourceRefs[0].locator = '';
    expect(codes(missingLocator).some((code) => code.startsWith('schema.'))).toBe(true);
  });

  it('rejects stale review revisions and AI declarations of expert review', () => {
    const stale = copy();
    stale.questions[0].revision++;
    expect(codes(stale)).toContain('review.revision');
    const falseExpert = copy();
    falseExpert.questions[0].review.status = 'expert_reviewed';
    falseExpert.questions[0].review.reviewerType = 'ai';
    expect(codes(falseExpert)).toContain('review.expert');
    const draftDiagnostic = copy();
    draftDiagnostic.questions.find((q) => q.pool === 'diagnostic')!.review.status = 'draft';
    expect(codes(draftDiagnostic)).toContain('diagnostic.review');
  });

  it('keeps objective membership, source IDs and question IDs referentially consistent', () => {
    const badObjective = copy();
    badObjective.questions[0].objectiveIds = ['physiology-o1'];
    expect(codes(badObjective)).toContain('question.objective');
    const wrongDomain = copy();
    wrongDomain.questions[0].domainId = 'safety';
    expect(codes(wrongDomain)).toContain('question.domain');
    const duplicate = copy();
    duplicate.questions[1].id = duplicate.questions[0].id;
    expect(codes(duplicate)).toContain('id.duplicate');
  });

  it('rejects repeated diagnostic groups and leaks into the practice pool', () => {
    const duplicateDiagnostic = copy();
    const diagnostic = duplicateDiagnostic.questions.filter((q) => q.pool === 'diagnostic');
    diagnostic[1].groupId = diagnostic[0].groupId;
    expect(codes(duplicateDiagnostic)).toContain('diagnostic.group-duplicate');
    const exposed = copy();
    exposed.questions.find((q) => q.pool === 'practice')!.groupId = exposed.questions.find(
      (q) => q.pool === 'diagnostic',
    )!.groupId;
    expect(codes(exposed)).toContain('diagnostic.exposure-leak');
    expect(codes(exposed)).toContain('group.duplicate');
  });

  it('requires meaningful anatomy and physiology section coverage in addition to titles', () => {
    const anatomy = copy();
    anatomy.units.find((unit) => unit.id === 'anatomy')!.sections = [
      { title: '仮の説明', body: '本文' },
    ];
    expect(codes(anatomy)).toContain('foundation.completeness');
    const physiology = copy();
    physiology.units.find((unit) => unit.id === 'physiology')!.terms.pop();
    expect(codes(physiology)).toContain('foundation.completeness');
  });

  it('requires metadata evidence to identify the actual assigned video', () => {
    const badEvidence = copy();
    badEvidence.videos[0].metadata.evidenceUrl =
      'https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Daaaaaaaaaaa&format=json';
    expect(codes(badEvidence)).toContain('video.evidence-id');
    const mismatch = copy();
    mismatch.videos[0].url = 'https://www.youtube.com/watch?v=bbbbbbbbbbb';
    expect(codes(mismatch)).toContain('video.url');
    const badUnit = copy();
    badUnit.videos[0].unitIds = ['nonexistent-unit'];
    expect(codes(badUnit)).toContain('video.unit');
  });

  it('does not promote metadata confirmation into a content or playback review', () => {
    const changed = copy();
    changed.videos[0].content.status = 'source_checked';
    expect(codes(changed)).toContain('video.content-status');
    const noPlaybackEvidence = copy();
    noPlaybackEvidence.videos[0].playback.status = 'playable';
    expect(codes(noPlaybackEvidence)).toContain('video.playback-record');
    const noEmbedEvidence = copy();
    noEmbedEvidence.videos[0].embed = { status: 'embeddable', checkedAt: null, method: null };
    expect(codes(noEmbedEvidence)).toContain('video.embed-record');
    expect(validateContent().warnings.some((issue) => issue.code === 'scope.video-metadata')).toBe(
      true,
    );
  });

  it('retains distinct transcript and visual recommendations and eight candidates without re-reviewing their content', () => {
    const input = copy();
    const recommended = input.videos.filter((video) => isRecommendedVideo(video));
    expect(recommended.map((video) => video.youtubeId)).toEqual(
      expect.arrayContaining(['XBkaAAwyS4s', 'fIvDJoyVgRQ']),
    );
    expect(
      recommended.find((video) => video.youtubeId === 'XBkaAAwyS4s')!.content.review,
    ).toMatchObject({
      decision: 'recommended',
      reviewerType: 'ai',
      method: 'transcript',
      objectiveIds: ['professional-o4'],
    });
    const squat = recommended.find((video) => video.youtubeId === 'fIvDJoyVgRQ')!;
    expect(squat.content.review).toMatchObject({
      decision: 'recommended',
      reviewerType: 'ai',
      method: 'visual',
      objectiveIds: ['technique-o4'],
    });
    expect(isRecommendedVideo(squat, 'technique')).toBe(true);
    expect(isRecommendedVideo(squat, 'professional')).toBe(false);
    expect(input.videos.filter((video) => !isRecommendedVideo(video))).toHaveLength(8);
    expect(validateContent(input).errors).toEqual([]);
  });

  it('allows an unavailable transcript or unresolved transcript review to remain on hold', () => {
    const input = copy();
    const unavailable = input.videos.find((video) => video.youtubeId === '0VT-7KAtOxw')!;
    const unresolved = input.videos.find((video) => video.youtubeId === 'hdtWEM3Oqwc')!;
    expect(unavailable.content.review).toMatchObject({ decision: 'hold', method: 'unavailable' });
    expect(unresolved.content.review).toMatchObject({ decision: 'hold', method: 'transcript' });
    expect(unresolved.content.status).toBe('unreviewed');
    expect(isRecommendedVideo(unavailable)).toBe(false);
    expect(isRecommendedVideo(unresolved)).toBe(false);
    const report = validateContent(input);
    expect(report.errors).toEqual([]);
    expect(report.warnings.some((issue) => issue.code === 'video.content-hold')).toBe(true);
  });

  it('keeps unassigned candidates with a warning, but rejects their recommendation', () => {
    const input = copy();
    const candidate = input.videos.find((video) => video.youtubeId === 'vfyowlhlRlA')!;
    expect(candidate.objectiveIds).toEqual([]);
    expect(validateContent(input).errors).toEqual([]);
    expect(
      validateContent(input).warnings.some(
        (issue) =>
          issue.code === 'video.objective-unassigned' &&
          issue.path === `videos.${input.videos.indexOf(candidate)}`,
      ),
    ).toBe(true);
    expect(isRecommendedVideo(candidate)).toBe(false);
    candidate.content.review!.decision = 'recommended';
    expect(codes(input)).toContain('video.unit-objective');
    expect(codes(input)).toContain('video.review-decision');
    expect(codes(input)).toContain('video.recommendation-ineligible');
  });

  it('rejects AI expert labels and recommendation claims without source evidence', () => {
    const fakeExpert = copy();
    const expert = fakeExpert.videos.find((video) => video.youtubeId === 'XBkaAAwyS4s')!;
    expert.content.status = 'expert_reviewed';
    expect(codes(fakeExpert)).toContain('video.review-expert');
    expect(isRecommendedVideo(expert)).toBe(false);
    const noEvidence = copy();
    const unsupported = noEvidence.videos.find((video) => video.youtubeId === 'XBkaAAwyS4s')!;
    unsupported.content.sourceRefs = [];
    expect(codes(noEvidence)).toContain('video.content-status');
    expect(codes(noEvidence)).toContain('video.recommendation-ineligible');
    expect(isRecommendedVideo(unsupported)).toBe(false);
  });

  it('validates review provenance, dates, source membership and objective assignments', () => {
    const noReview = copy();
    delete noReview.videos.find((video) => video.youtubeId === 'XBkaAAwyS4s')!.content.review;
    expect(codes(noReview)).toContain('video.content-status');
    const wrongDate = copy();
    wrongDate.videos.find((video) => video.youtubeId === 'XBkaAAwyS4s')!.content.review!.checkedAt =
      '2026-11-03';
    expect(codes(wrongDate)).toContain('video.review-date');
    const wrongObjective = copy();
    wrongObjective.videos.find(
      (video) => video.youtubeId === 'XBkaAAwyS4s',
    )!.content.review!.objectiveIds = ['assessment-o1'];
    expect(codes(wrongObjective)).toContain('video.review-objective');
    const unknownSource = copy();
    unknownSource.videos.find(
      (video) => video.youtubeId === 'XBkaAAwyS4s',
    )!.content.sourceRefs[0].sourceId = 'nonexistent-video-source';
    expect(codes(unknownSource)).toContain('source.missing');
    expect(codes(unknownSource)).toContain('video.recommendation-ineligible');
    const missingLocator = copy();
    missingLocator.videos.find(
      (video) => video.youtubeId === 'XBkaAAwyS4s',
    )!.content.review!.evidence[0].locator = '';
    expect(codes(missingLocator).some((code) => code.startsWith('schema.'))).toBe(true);
  });

  it('does not use the current recommendation count as automatic content approval', () => {
    const input = copy();
    for (const video of input.videos.filter((candidate) => isRecommendedVideo(candidate)))
      video.content.review!.decision = 'hold';
    const report = validateContent(input);
    expect(report.errors).toEqual([]);
    expect(report.summary.recommendedVideos).toBe(0);
    expect(report.summary.candidateVideos).toBe(input.videos.length);
    expect(report.verificationScope).toContain('審査状態を変更しません');
  });

  it('does not mutate records or treat structure checks as new content review', () => {
    const input = copy();
    const before = structuredClone(input);
    const report = validateContent(input);
    expect(input).toEqual(before);
    expect(report.warnings.some((issue) => issue.code === 'scope.source-check-declaration')).toBe(
      true,
    );
    expect(report.summary.reviewDeclarations.source_checked).toBe(300);
  });

  it('returns a nonzero CLI result for errors and a clear success summary otherwise', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      expect(runContentValidation({})).toBe(1);
      expect(error).toHaveBeenCalled();
      expect(runContentValidation()).toBe(0);
      expect(log.mock.calls.flat().join(' ')).toContain('内容審査状態の変更なし');
    } finally {
      log.mockRestore();
      error.mockRestore();
      warn.mockRestore();
    }
  });
});

describe('mock-exam eligibility and duplicate screening', () => {
  it('requires human expert review and excludes media without a rights-evidence model', () => {
    const checked = { ...structuredClone(seedContent.questions[0]), pool: 'exam' } as Question;
    expect(canUseInExam(checked)).toBe(false);
    const expert: Question = {
      ...checked,
      review: { ...checked.review, status: 'expert_reviewed', reviewerType: 'human_expert' },
    };
    expect(canUseInExam(expert)).toBe(true);
    expect(canUseInExam({ ...expert, context: 'image' })).toBe(false);
    expect(canUseInExam({ ...expert, context: 'video' })).toBe(false);
    expect(canUseInExam({ ...expert, revision: expert.revision + 1 })).toBe(false);
    const input = copy();
    input.questions[0] = { ...expert, context: 'image' };
    expect(codes(input)).toContain('exam.ineligible');
  });

  it('detects punctuation/width variants and warns about close wording without asserting semantic identity', () => {
    expect(normalizePrompt('ＡＴＰ は？')).toBe(normalizePrompt('ATPは。'));
    const exact = copy();
    exact.questions[1].prompt = `${exact.questions[0].prompt}。`;
    expect(codes(exact)).toContain('prompt.duplicate');
    const similar = copy();
    similar.questions[0].prompt =
      '運動前の面談で利用者の目標を理解するために、最初に確認する内容として適切なのはどれか。';
    similar.questions[1].prompt =
      '運動前の面談で利用者の目標を理解するために、最初に確認する内容として最適なのはどれか。';
    expect(
      promptSimilarity(similar.questions[0].prompt, similar.questions[1].prompt),
    ).toBeGreaterThan(0.78);
    expect(validateContent(similar).warnings.some((issue) => issue.code === 'prompt.similar')).toBe(
      true,
    );
  });
});
