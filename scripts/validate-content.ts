import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { units, questions, sources, seedVideos } from '../src/content';
import { blueprint, domainIds, domains } from '../src/content/blueprints';
import { isRecommendedVideo } from '../src/engines/video-review';
import { releaseTargets } from '../src/content/release';
import { mediaAssets } from '../src/content/media';
import { eligible } from '../src/engines/learning';
import type { DomainId, Question, Source, Unit, Video } from '../src/domain/types';

export interface ContentBundle {
  units: readonly Unit[];
  questions: readonly Question[];
  sources: readonly Source[];
  videos: readonly Video[];
}
export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
}
export interface ValidationReport {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  summary: {
    units: number;
    questions: number;
    sources: number;
    videos: number;
    byDomain: Record<DomainId, number>;
    diagnosticByDomain: Record<DomainId, number>;
    reviewDeclarations: { draft: number; source_checked: number; expert_reviewed: number };
    videoReviewDeclarations: {
      unreviewed: number;
      source_checked: number;
      expert_reviewed: number;
    };
    recommendedVideos: number;
    candidateVideos: number;
    examEligible: number;
    independentGroups: number;
    usableQuestions: number;
    mediaQuestions: number;
  };
  verificationScope: string;
}

export const seedContent: ContentBundle = { units, questions, sources, videos: seedVideos };
const text = z.string().trim().min(1);
const domain = z.enum(['assessment', 'planning', 'technique', 'safety']);
const https = text.refine((value) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}, 'HTTPSの実在確認用URLが必要です（ここでは通信確認はしません）');
const date = text.refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) || !Number.isFinite(Date.parse(value)))
    return false;
  return (
    new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) === value.slice(0, 10)
  );
}, '有効な確認日またはISO日時が必要です');
const sourceRef = z.object({ sourceId: text, locator: text });
const sourceSchema = z.object({
  id: text,
  title: text,
  url: https,
  edition: text.nullable(),
  checkedAt: date,
  locator: text,
  note: text.optional(),
});
const unitSchema = z.object({
  id: text,
  domainId: domain,
  title: text,
  subtitle: text,
  minutes: z.number().positive(),
  level: z.enum(['基礎', '応用']),
  foundation: text.optional(),
  objectives: z.array(z.object({ id: text, text })).min(1),
  sections: z
    .array(z.object({ title: text, body: text, bullets: z.array(text).optional() }))
    .min(1),
  example: z.object({ situation: text, judgment: text }),
  terms: z.array(z.object({ term: text, meaning: text })).min(1),
  sourceRefs: z.array(sourceRef).min(1),
});
const reviewSchema = z.object({
  status: z.enum(['draft', 'source_checked', 'expert_reviewed']),
  reviewerType: z.enum(['ai', 'human_expert']),
  method: text,
  checkedAt: date,
  revision: z.number().int().positive(),
  notes: text.optional(),
});
const questionSchema = z.object({
  id: text,
  revision: z.number().int().positive(),
  groupId: text,
  domainId: domain,
  unitId: text,
  objectiveIds: z.array(text).min(1),
  format: z.enum(['single_choice', 'true_false']),
  context: z.enum(['text', 'case', 'image', 'video']),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  pool: z.enum(['diagnostic', 'practice', 'exam']),
  prompt: text,
  choices: z.array(z.object({ id: text, text, explanation: text })).min(1),
  correctChoiceId: text,
  explanation: text,
  media: z
    .object({ kind: z.enum(['diagram', 'sequence']), assetId: text, caption: text, alt: text })
    .optional(),
  sourceRefs: z.array(sourceRef).min(1),
  review: reviewSchema,
});
const videoContentReviewSchema = z.object({
  decision: z.enum(['recommended', 'hold']),
  reviewerType: z.enum(['ai', 'human_expert']),
  method: z.enum(['transcript', 'visual', 'transcript_and_visual', 'unavailable']),
  coverage: text,
  objectiveIds: z.array(text),
  checkedAt: date,
  findings: z.array(text).min(1),
  limitations: z.array(text),
  evidence: z.array(z.object({ url: https, locator: text })).min(1),
});
const videoSchema = z.object({
  id: text,
  youtubeId: text.regex(/^[A-Za-z0-9_-]{11}$/),
  title: text,
  channel: text,
  url: https,
  unitIds: z.array(text).min(1),
  objectiveIds: z.array(text),
  difficulty: z.enum(['基礎', '応用']),
  order: z.number().int().positive(),
  reason: text,
  metadata: z.object({
    status: z.enum(['confirmed', 'unconfirmed']),
    checkedAt: date,
    method: text,
    evidenceUrl: https,
  }),
  playback: z.object({
    status: z.enum(['unconfirmed', 'playable', 'embed_blocked', 'unavailable']),
    checkedAt: date.nullable(),
    method: text.nullable(),
  }),
  content: z.object({
    status: z.enum(['unreviewed', 'source_checked', 'expert_reviewed']),
    checkedAt: date.nullable(),
    method: text.nullable(),
    sourceRefs: z.array(sourceRef),
    review: videoContentReviewSchema.optional(),
  }),
});
const contentSchema = z.object({
  units: z.array(unitSchema),
  questions: z.array(questionSchema),
  sources: z.array(sourceSchema),
  videos: z.array(videoSchema),
});

export function normalizePrompt(prompt: string): string {
  return prompt
    .normalize('NFKC')
    .toLocaleLowerCase('ja-JP')
    .replace(/[\p{P}\p{S}\s]/gu, '');
}
// Mathematical signs carry meaning (100 J differs from −100 J). They cannot be
// erased when detecting identical answer choices.
export function normalizeChoice(choice: string): string {
  return choice
    .normalize('NFKC')
    .toLocaleLowerCase('ja-JP')
    .replace(/−/g, '-')
    .replace(/[\s、。,.「」『』！？!?]/gu, '');
}
function bigrams(value: string): Set<string> {
  return new Set(
    Array.from({ length: Math.max(value.length - 1, 0) }, (_, index) =>
      value.slice(index, index + 2),
    ),
  );
}
export function promptSimilarity(a: string, b: string): number {
  const normalizedA = normalizePrompt(a),
    normalizedB = normalizePrompt(b);
  if (normalizedA === normalizedB) return 1;
  const aa = bigrams(normalizedA),
    bb = bigrams(normalizedB);
  if (!aa.size || !bb.size) return 0;
  let overlap = 0;
  for (const item of aa) if (bb.has(item)) overlap++;
  return (2 * overlap) / (aa.size + bb.size);
}

/** The current question model has no media ownership/licence evidence fields.
 * Media items therefore remain ineligible even if somebody sets expert_reviewed.
 * Schema/provenance validation cannot establish content accuracy or media rights. */
export function canUseInExam(q: Question): boolean {
  return (
    q.pool === 'exam' &&
    q.review.status === 'expert_reviewed' &&
    q.review.reviewerType === 'human_expert' &&
    q.review.revision === q.revision &&
    q.format === 'single_choice' &&
    q.choices.length === 3 &&
    (q.context === 'text' || q.context === 'case') &&
    q.sourceRefs.length > 0 &&
    q.sourceRefs.every((item) => Boolean(item.sourceId.trim() && item.locator.trim())) &&
    q.choices.filter((item) => item.id === q.correctChoiceId).length === 1 &&
    new Set(q.choices.map((item) => item.id)).size === 3 &&
    q.choices.every((item) => Boolean(item.text.trim() && item.explanation.trim())) &&
    Boolean(q.explanation.trim() && q.review.method.trim() && q.review.checkedAt.trim())
  );
}

const zeroCounts = (): Record<DomainId, number> => ({
  assessment: 0,
  planning: 0,
  technique: 0,
  safety: 0,
});
const initialCounts: Record<DomainId, number> = {
  assessment: 23,
  planning: 32,
  technique: 31,
  safety: 14,
};
const diagnosticCounts: Record<DomainId, number> = {
  assessment: 12,
  planning: 16,
  technique: 15,
  safety: 7,
};
const scoredCounts: Record<DomainId, number> = {
  assessment: 32,
  planning: 45,
  technique: 43,
  safety: 20,
};
const scope =
  'この検査はスキーマ・件数・参照整合性・審査記録・公開条件を確認します。出典本文や動画本編を再閲覧した内容照合、医学的正確性、権利許諾の確認は行いません。審査状態を変更しません。';

export function validateContent(input: unknown = seedContent): ValidationReport {
  const report: ValidationReport = {
    errors: [],
    warnings: [],
    verificationScope: scope,
    summary: {
      units: 0,
      questions: 0,
      sources: 0,
      videos: 0,
      byDomain: zeroCounts(),
      diagnosticByDomain: zeroCounts(),
      reviewDeclarations: { draft: 0, source_checked: 0, expert_reviewed: 0 },
      videoReviewDeclarations: { unreviewed: 0, source_checked: 0, expert_reviewed: 0 },
      recommendedVideos: 0,
      candidateVideos: 0,
      examEligible: 0,
      independentGroups: 0,
      usableQuestions: 0,
      mediaQuestions: 0,
    },
  };
  const error = (code: string, path: string, message: string) =>
    report.errors.push({ code, path, message });
  const warn = (code: string, path: string, message: string) =>
    report.warnings.push({ code, path, message });
  const parsed = contentSchema.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues)
      error(`schema.${issue.code}`, issue.path.join('.'), issue.message);
    return report;
  }
  const data = parsed.data;
  report.summary.units = data.units.length;
  report.summary.questions = data.questions.length;
  report.summary.sources = data.sources.length;
  report.summary.videos = data.videos.length;
  if (data.units.length !== releaseTargets.units)
    error(
      'counts.units',
      'units',
      `今回の収録目標は${releaseTargets.units}単元です（${data.units.length}件）。`,
    );
  if (data.questions.length !== releaseTargets.questions)
    error(
      'counts.questions',
      'questions',
      `今回の収録目標は${releaseTargets.questions}問です（${data.questions.length}件）。`,
    );
  if (data.videos.length !== 10)
    error(
      'counts.videos',
      'videos',
      `確認済みメタデータを持つ動画候補は10件必要です（${data.videos.length}件）。`,
    );

  const checkIds = (items: readonly { id: string }[], path: string) => {
    const seen = new Set<string>();
    items.forEach((item, index) => {
      if (seen.has(item.id))
        error('id.duplicate', `${path}.${index}.id`, `ID「${item.id}」が重複しています。`);
      seen.add(item.id);
    });
  };
  checkIds(data.units, 'units');
  checkIds(data.questions, 'questions');
  checkIds(data.sources, 'sources');
  checkIds(data.videos, 'videos');
  const sourceMap = new Map(data.sources.map((item) => [item.id, item]));
  const unitMap = new Map(data.units.map((item) => [item.id, item]));
  const objectives = new Map<string, string>();
  const checkRefs = (refs: readonly { sourceId: string; locator: string }[], path: string) =>
    refs.forEach((item, index) => {
      if (!sourceMap.has(item.sourceId))
        error('source.missing', `${path}.${index}`, `参照元「${item.sourceId}」が存在しません。`);
    });

  for (const [index, unit] of data.units.entries()) {
    const path = `units.${index}`;
    checkRefs(unit.sourceRefs, `${path}.sourceRefs`);
    unit.objectives.forEach((objective, objectiveIndex) => {
      if (objectives.has(objective.id))
        error(
          'objective.duplicate',
          `${path}.objectives.${objectiveIndex}`,
          `学習目標「${objective.id}」が重複しています。`,
        );
      if (!objective.id.startsWith(`${unit.id}-`))
        error(
          'objective.unit',
          `${path}.objectives.${objectiveIndex}`,
          '学習目標IDに所属単元IDが必要です。',
        );
      objectives.set(objective.id, unit.id);
    });
    const count = data.questions.filter((q) => q.unitId === unit.id).length;
    if (count < 5)
      error(
        'unit.questions',
        path,
        `単元「${unit.id}」には確認問題が5件以上必要です（${count}件）。`,
      );
    const videoCount = data.videos.filter((video) => video.unitIds.includes(unit.id)).length;
    if (videoCount < 1 || videoCount > 3)
      warn(
        'unit.videos',
        path,
        `単元「${unit.id}」の動画は${videoCount}本。対応する実在動画の内容確認が未完了です。`,
      );
    if (
      unit.id.startsWith('ex-') &&
      (unit.sections.length < 3 || unit.terms.length < 3 || unit.objectives.length < 3)
    )
      error(
        'unit.completeness',
        path,
        '追加単元は本文3節・3用語・3目標以上が必要です。量の検査は内容審査ではありません。',
      );
  }
  for (const id of ['anatomy', 'physiology']) {
    const unit = unitMap.get(id);
    if (!unit) {
      error('foundation.missing', 'units', `基礎試作単元「${id}」がありません。`);
      continue;
    }
    const limits =
      id === 'anatomy'
        ? { sections: 5, characters: 500, terms: 8 }
        : { sections: 6, characters: 700, terms: 10 };
    if (
      unit.sections.length < limits.sections ||
      unit.sections.reduce((sum, part) => sum + part.body.length, 0) < limits.characters ||
      unit.terms.length < limits.terms ||
      unit.objectives.length < 3
    ) {
      error(
        'foundation.completeness',
        `units.${id}`,
        `基礎単元の最低構成量（${limits.sections}節・本文${limits.characters}字・${limits.terms}用語・3目標）を満たしません。量の検査は内容の正しさを保証しません。`,
      );
    }
  }

  const groups = new Map<string, Question[]>();
  for (const [index, q] of data.questions.entries()) {
    const path = `questions.${index}`;
    report.summary.byDomain[q.domainId]++;
    if (q.pool === 'diagnostic') report.summary.diagnosticByDomain[q.domainId]++;
    report.summary.reviewDeclarations[q.review.status]++;
    if (canUseInExam(q)) report.summary.examEligible++;
    if (eligible(q)) report.summary.usableQuestions++;
    if (q.media) report.summary.mediaQuestions++;
    if (q.context === 'image' || q.context === 'video') {
      const asset = q.media && mediaAssets[q.media.assetId as keyof typeof mediaAssets];
      if (
        !asset ||
        asset.kind !== q.media?.kind ||
        (q.context === 'video' && (asset.kind !== 'sequence' || asset.frames < 2))
      )
        error(
          'question.media',
          path,
          '画像・映像問題には対応する自作図/アニメーションの実体が必要です。',
        );
    } else if (q.media)
      error('question.media-context', path, '図を使う問題はimageまたはvideoのcontextが必要です。');
    const unit = unitMap.get(q.unitId);
    if (!unit) error('question.unit', path, `所属単元「${q.unitId}」が存在しません。`);
    else if (unit.domainId !== q.domainId)
      error('question.domain', path, '問題と所属単元の分野が一致しません。');
    q.objectiveIds.forEach((objectiveId) => {
      if (objectives.get(objectiveId) !== q.unitId)
        error('question.objective', path, `学習目標「${objectiveId}」はこの単元に属しません。`);
    });
    if (new Set(q.objectiveIds).size !== q.objectiveIds.length)
      error('question.objective-duplicate', path, '学習目標IDが重複しています。');
    if (q.format !== 'single_choice' || q.choices.length !== 3)
      error('question.format', path, '初期問題は3択の単一正答形式である必要があります。');
    if (new Set(q.choices.map((choice) => choice.id)).size !== q.choices.length)
      error('choice.id-duplicate', path, '選択肢IDが重複しています。');
    if (q.choices.filter((choice) => choice.id === q.correctChoiceId).length !== 1)
      error('choice.correct', path, '正答IDは、存在する一つの選択肢だけに対応する必要があります。');
    if (new Set(q.choices.map((choice) => normalizeChoice(choice.text))).size !== q.choices.length)
      error('choice.text-duplicate', path, '同じ内容の選択肢が重複しています。');
    checkRefs(q.sourceRefs, `${path}.sourceRefs`);
    if (q.review.revision !== q.revision)
      error(
        'review.revision',
        path,
        '照合・審査記録のrevisionが問題の現行revisionと一致しません。',
      );
    if (q.review.status !== 'draft' && q.review.method.length < 20)
      error('review.method', path, '審査済み状態には、照合・審査方法の具体的な記録が必要です。');
    if (q.review.status === 'expert_reviewed' && q.review.reviewerType !== 'human_expert')
      error('review.expert', path, '専門家審査済みはhuman_expertの記録が必要です。');
    if (q.pool === 'diagnostic' && q.review.status === 'draft')
      error(
        'diagnostic.review',
        path,
        '診断には現行revisionの出典照合または専門家審査の記録が必要です。',
      );
    if (q.pool === 'exam' && !canUseInExam(q))
      error(
        'exam.ineligible',
        path,
        '本番形式用には現行revisionの人間専門家審査などの条件が必要です。現モデルで権利証跡を管理できない画像・動画問題は使用できません。',
      );
    const members = groups.get(q.groupId) ?? [];
    members.push(q);
    groups.set(q.groupId, members);
  }
  for (const [groupId, members] of groups) {
    if (members.length > 1)
      error(
        'group.duplicate',
        'questions',
        `同一問題グループ「${groupId}」が重複しています：${members.map((q) => q.id).join(', ')}。`,
      );
    if (members.filter((q) => q.pool === 'diagnostic').length > 1)
      error(
        'diagnostic.group-duplicate',
        'questions',
        `診断内の同一内容グループ「${groupId}」が重複しています。`,
      );
    if (
      members.some((q) => q.pool === 'diagnostic') &&
      members.some((q) => q.pool !== 'diagnostic')
    )
      error(
        'diagnostic.exposure-leak',
        'questions',
        `診断の予約グループ「${groupId}」が通常問題等と共有されています。`,
      );
  }
  report.summary.independentGroups = groups.size;
  for (const id of domainIds) {
    if (report.summary.byDomain[id] !== releaseTargets.domains[id])
      error(
        'counts.domain',
        `questions.${id}`,
        `今回の配分は${releaseTargets.domains[id]}問、実際は${report.summary.byDomain[id]}問です。`,
      );
    if (report.summary.diagnosticByDomain[id] !== diagnosticCounts[id])
      error(
        'counts.diagnostic',
        `questions.${id}`,
        `診断配分は${diagnosticCounts[id]}問、実際は${report.summary.diagnosticByDomain[id]}問です。`,
      );
    if (
      domains[id].initial !== initialCounts[id] ||
      domains[id].diagnostic !== diagnosticCounts[id] ||
      blueprint.diagnosticCounts[id] !== diagnosticCounts[id] ||
      domains[id].scored !== scoredCounts[id] ||
      blueprint.scoredDomainCounts[id] !== scoredCounts[id]
    )
      error(
        'blueprint.domain',
        `blueprint.${id}`,
        '出題配分の定義が承認された初期・診断・採点問題の整数配分と一致しません。',
      );
  }
  if (
    blueprint.scored !== 140 ||
    blueprint.unscored !== 15 ||
    blueprint.durationMinutes !== 180 ||
    blueprint.choiceCount !== 3 ||
    blueprint.mediaMinimum !== 25 ||
    blueprint.mediaMaximum !== 35
  )
    error(
      'blueprint.format',
      'blueprint',
      '本番参考仕様（140+15問・180分・3択・画像映像25〜35問）と一致しません。',
    );

  const seenYoutubeIds = new Set<string>();
  const videoRegistry = { sourceIds: new Set(sourceMap.keys()), objectiveUnits: objectives };
  for (const [index, video] of data.videos.entries()) {
    const path = `videos.${index}`;
    const review = video.content.review;
    const contentChecked = video.content.status !== 'unreviewed';
    report.summary.videoReviewDeclarations[video.content.status]++;
    if (isRecommendedVideo(video, undefined, videoRegistry)) report.summary.recommendedVideos++;
    else report.summary.candidateVideos++;
    if (seenYoutubeIds.has(video.youtubeId))
      error('video.duplicate', path, '同じYouTube動画が重複登録されています。');
    seenYoutubeIds.add(video.youtubeId);
    const url = new URL(video.url);
    if (
      !['youtube.com', 'www.youtube.com'].includes(url.hostname) ||
      url.pathname !== '/watch' ||
      url.searchParams.get('v') !== video.youtubeId
    )
      error('video.url', path, '登録URLとYouTube動画IDが一致しません。');
    if (video.metadata.status !== 'confirmed' || video.metadata.method.length < 20)
      error(
        'video.metadata',
        path,
        '初期候補にはメタデータの確認日・確認方法・証拠URLが必要です。',
      );
    const evidence = new URL(video.metadata.evidenceUrl);
    if (
      !['youtube.com', 'www.youtube.com'].includes(evidence.hostname) ||
      evidence.pathname !== '/oembed'
    )
      error(
        'video.evidence',
        path,
        '初期動画の証拠URLはYouTube公式oEmbedのURLである必要があります。',
      );
    else {
      const target = evidence.searchParams.get('url');
      try {
        if (!target || new URL(target).searchParams.get('v') !== video.youtubeId)
          error('video.evidence-id', path, '証拠URLが対象動画IDと一致しません。');
      } catch {
        error('video.evidence-id', path, '証拠URLの動画参照が不正です。');
      }
    }
    if (
      new Set(video.unitIds).size !== video.unitIds.length ||
      new Set(video.objectiveIds).size !== video.objectiveIds.length
    )
      error('video.assignment-duplicate', path, '単元または目標の割当が重複しています。');
    video.unitIds.forEach((unitId) => {
      if (!unitMap.has(unitId)) error('video.unit', path, `対応単元「${unitId}」が存在しません。`);
      if (!video.objectiveIds.some((objectiveId) => objectives.get(objectiveId) === unitId)) {
        if (contentChecked || review?.decision === 'recommended')
          error(
            'video.unit-objective',
            path,
            `内容確認済み・おすすめ動画には対応単元「${unitId}」の学習目標が必要です。`,
          );
        else
          warn(
            'video.objective-unassigned',
            path,
            `候補の対応単元「${unitId}」は個別学習目標への割当を保留しています。おすすめにはできません。`,
          );
      }
    });
    video.objectiveIds.forEach((objectiveId) => {
      const assignedUnit = objectives.get(objectiveId);
      if (!assignedUnit || !video.unitIds.includes(assignedUnit))
        error('video.objective', path, '動画の学習目標が対応単元に属していません。');
    });
    if (contentChecked) {
      if (
        !review ||
        !video.content.checkedAt ||
        !video.content.method ||
        video.content.sourceRefs.length === 0
      )
        error(
          'video.content-status',
          path,
          '内容確認済み状態には、日時・具体的な方法・根拠資料・本編審査記録が必要です。メタデータの確認だけでは変更できません。',
        );
      if (review?.method === 'unavailable')
        error(
          'video.content-method',
          path,
          '内容を取得できなかった記録を、内容確認済み状態にはできません。',
        );
      if (review && !review.objectiveIds.length)
        error(
          'video.review-objective',
          path,
          '内容確認済み記録には照合した個別学習目標が必要です。',
        );
      if (video.content.status === 'expert_reviewed' && review?.reviewerType !== 'human_expert')
        error(
          'video.review-expert',
          path,
          '動画の専門家審査済み状態にはhuman_expertの審査記録が必要です。',
        );
    } else {
      if (review?.decision === 'recommended')
        error('video.review-decision', path, '未審査の動画をおすすめとして表示できません。');
      if (
        !review &&
        (video.content.checkedAt !== null ||
          video.content.method !== null ||
          video.content.sourceRefs.length !== 0)
      )
        error(
          'video.content-status',
          path,
          '未審査の候補に内容確認の情報を保存する場合は、保留理由を含む審査記録が必要です。',
        );
      if (review)
        warn(
          'video.content-hold',
          path,
          `本編の確認・推薦を保留中です（確認方法: ${review.method}）。記録の存在を内容審査の完了と扱いません。`,
        );
    }
    if ((video.content.checkedAt === null) !== (video.content.method === null))
      error('video.content-record', path, '内容の確認日と方法は対で記録してください。');
    if (video.content.method && video.content.method.length < 20)
      error(
        'video.content-method',
        path,
        '内容の確認方法には、確認した範囲と方法の具体的な記録が必要です。',
      );
    if (review) {
      if (
        video.content.checkedAt &&
        video.content.checkedAt.slice(0, 10) !== review.checkedAt.slice(0, 10)
      )
        error('video.review-date', path, '内容確認日と審査記録の確認日が一致しません。');
      if (new Set(review.objectiveIds).size !== review.objectiveIds.length)
        error('video.review-objective', path, '審査記録の学習目標が重複しています。');
      review.objectiveIds.forEach((objectiveId) => {
        const assignedUnit = objectives.get(objectiveId);
        if (
          !assignedUnit ||
          !video.objectiveIds.includes(objectiveId) ||
          !video.unitIds.includes(assignedUnit)
        )
          error('video.review-objective', path, '審査記録の学習目標と動画の割当が一致しません。');
      });
      if (review.decision === 'recommended' && !isRecommendedVideo(video, undefined, videoRegistry))
        error(
          'video.recommendation-ineligible',
          path,
          'おすすめの宣言が、状態・方法・根拠・学習目標・利用可能性の条件と一致しません。',
        );
    }
    if (
      video.playback.status === 'unconfirmed' &&
      (video.playback.checkedAt !== null || video.playback.method !== null)
    )
      error('video.playback-record', path, '再生未確認では再生確認記録をnullにしてください。');
    if (
      video.playback.status !== 'unconfirmed' &&
      (!video.playback.checkedAt || !video.playback.method)
    )
      error('video.playback-record', path, '再生状態を確認した場合は確認日と方法が必要です。');
    checkRefs(video.content.sourceRefs, `${path}.content.sourceRefs`);
  }
  // Cache each prompt once: hundreds of questions require tens of thousands of
  // comparisons, but their normalization/bigram sets do not change per pair.
  const promptIndex = data.questions.map((q) => {
    const normalized = normalizePrompt(q.prompt);
    return { normalized, grams: bigrams(normalized) };
  });
  for (let i = 0; i < data.questions.length; i++)
    for (let j = i + 1; j < data.questions.length; j++) {
      const a = data.questions[i],
        b = data.questions[j];
      const normalizedA = promptIndex[i].normalized,
        normalizedB = promptIndex[j].normalized;
      if (normalizedA === normalizedB)
        error(
          'prompt.duplicate',
          'questions',
          `正規化後の設問が重複しています：${a.id} / ${b.id}。`,
        );
      else if (
        Math.min(normalizedA.length, normalizedB.length) >= 16 &&
        (() => {
          const aa = promptIndex[i].grams,
            bb = promptIndex[j].grams;
          if (!aa.size || !bb.size || (2 * Math.min(aa.size, bb.size)) / (aa.size + bb.size) < 0.78)
            return false;
          let overlap = 0;
          for (const gram of aa) if (bb.has(gram)) overlap++;
          return (2 * overlap) / (aa.size + bb.size) >= 0.78;
        })()
      ) {
        warn(
          'prompt.similar',
          'questions',
          `類似文面候補：${a.id} / ${b.id}。意味の重複・条件差・group設計を人が確認してください。`,
        );
      }
    }
  if (report.summary.reviewDeclarations.source_checked)
    warn(
      'scope.source-check-declaration',
      'questions',
      `source_checkedは${report.summary.reviewDeclarations.source_checked}問の保存済み照合記録です。この検査で正誤を再確認した数ではありません。`,
    );
  if (data.videos.length)
    warn(
      'scope.video-metadata',
      'videos',
      '動画はメタデータ確認済み候補です。本編の正確性・再生可否・現行指針との適合を、この検査で確認したとは扱いません。',
    );
  warn(
    'scope.exam-unavailable',
    'questions',
    `現在の本番形式利用条件を満たす問題は${report.summary.examEligible}問です。155問模試の十分性や画像権利の確認を保証しません。`,
  );
  return report;
}

export function runContentValidation(input: unknown = seedContent): number {
  const report = validateContent(input);
  console.log('教材の構造・参照整合性検査');
  console.log(report.verificationScope);
  console.log(JSON.stringify(report.summary, null, 2));
  for (const issue of report.errors)
    console.error(`ERROR [${issue.code}] ${issue.path}: ${issue.message}`);
  for (const issue of report.warnings)
    console.warn(`WARN [${issue.code}] ${issue.path}: ${issue.message}`);
  console.log(
    report.errors.length
      ? `検査失敗：${report.errors.length}件のエラー、${report.warnings.length}件の警告。`
      : `構造・参照整合性検査は正常：${report.warnings.length}件の確認事項。内容審査状態の変更なし。`,
  );
  return report.errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  process.exitCode = runContentValidation();
