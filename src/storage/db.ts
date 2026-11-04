import Dexie, { type Table } from 'dexie';
import { z } from 'zod';
import type {
  AppSettings,
  Attempt,
  Exposure,
  ReviewItem,
  Session,
  StudyEvent,
  UnitProgress,
  Video,
  VideoOverride,
  VideoProgress,
} from '../domain/types';
import { contentVersion, questions, units, seedVideos } from '../content';
export interface Favorite {
  questionId: string;
}
export class LearningDB extends Dexie {
  attempts!: Table<Attempt, string>;
  exposures!: Table<Exposure, string>;
  reviews!: Table<ReviewItem, string>;
  sessions!: Table<Session, string>;
  videoProgress!: Table<VideoProgress, string>;
  unitProgress!: Table<UnitProgress, string>;
  videoOverrides!: Table<VideoOverride, string>;
  settings!: Table<AppSettings, string>;
  favorites!: Table<Favorite, string>;
  studyEvents!: Table<StudyEvent, string>;
  constructor(name = 'cpt-master') {
    super(name);
    this.version(1).stores({
      attempts: 'id,sessionId,questionId,groupId,at',
      exposures: 'id,groupId,questionId,sessionId',
      reviews: 'questionId,dueAt',
      sessions: 'id,status,mode',
      videoProgress: 'videoId',
      unitProgress: 'unitId',
      videoOverrides: 'id',
      settings: 'id',
      favorites: 'questionId',
      studyEvents: 'id,localDate',
    });
  }
}
export const db = new LearningDB();
export const defaultSettings: AppSettings = {
  id: 'main',
  theme: 'light',
  diagnosticStatus: 'not_started',
  timezone: 'Asia/Tokyo',
};
export const tableNames = [
  'attempts',
  'exposures',
  'reviews',
  'sessions',
  'videoProgress',
  'unitProgress',
  'videoOverrides',
  'settings',
  'favorites',
  'studyEvents',
] as const;
export interface Snapshot {
  attempts: Attempt[];
  exposures: Exposure[];
  reviews: ReviewItem[];
  sessions: Session[];
  videoProgress: VideoProgress[];
  unitProgress: UnitProgress[];
  videoOverrides: VideoOverride[];
  settings: AppSettings[];
  favorites: Favorite[];
  studyEvents: StudyEvent[];
}
export async function snapshot(database: LearningDB = db): Promise<Snapshot> {
  const data = await database.transaction('r', database.tables, () =>
    Promise.all(tableNames.map((n) => database.table(n).toArray())),
  );
  return Object.fromEntries(tableNames.map((n, i) => [n, data[i]])) as unknown as Snapshot;
}
export async function initialize() {
  if (!(await db.settings.get('main'))) await db.settings.put(defaultSettings);
}
export async function recordExposure(exposure: Exposure, database: LearningDB = db) {
  return database.transaction('rw', database.exposures, async () => {
    const prior = await database.exposures.get(exposure.id);
    if (!prior || exposure.at < prior.at) await database.exposures.put(exposure);
  });
}
const id = z.string().min(1).max(160),
  date = z.string().datetime(),
  domain = z.enum(['assessment', 'planning', 'technique', 'safety']);
const refs = z
  .array(z.object({ sourceId: id, locator: z.string().min(1).max(3000) }).strict())
  .max(50);
const videoSchema = z
  .object({
    id,
    youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
    title: z.string().min(1).max(500),
    channel: z.string().min(1).max(300),
    url: z.string().url(),
    unitIds: z.array(id).min(1).max(30),
    objectiveIds: z.array(id).max(100),
    difficulty: z.enum(['基礎', '応用']),
    order: z.number().int().min(0).max(1000),
    reason: z.string().min(1).max(3000),
    metadata: z
      .object({
        status: z.enum(['confirmed', 'unconfirmed']),
        checkedAt: z.string().max(80),
        method: z.string().max(3000),
        evidenceUrl: z.string().max(2000),
      })
      .strict(),
    playback: z
      .object({
        status: z.enum(['unconfirmed', 'playable', 'embed_blocked', 'unavailable']),
        checkedAt: z.string().max(80).nullable(),
        method: z.string().max(3000).nullable(),
      })
      .strict(),
    content: z
      .object({
        status: z.enum(['unreviewed', 'source_checked', 'expert_reviewed']),
        checkedAt: z.string().max(80).nullable(),
        method: z.string().max(3000).nullable(),
        sourceRefs: refs,
      })
      .strict(),
  })
  .strict();
const attempt = z
  .object({
    id,
    sessionId: id,
    questionId: id,
    questionRevision: z.number().int().positive(),
    groupId: id,
    domainId: domain,
    unitId: id,
    selectedChoiceId: id,
    correctChoiceId: id,
    correct: z.boolean(),
    firstSeen: z.boolean(),
    canExplain: z.boolean(),
    elapsedMs: z.number().finite().min(0).max(86400000),
    choiceOrder: z.array(id).min(2).max(4),
    at: date,
  })
  .strict();
const session = z
  .object({
    id,
    mode: z.enum(['diagnostic', 'practice', 'review', 'mock']),
    questionIds: z.array(id).min(1).max(200),
    choiceOrders: z.record(id, z.array(id).min(2).max(4)),
    index: z.number().int().min(0).max(200),
    status: z.enum(['active', 'completed']),
    startedAt: date,
    completedAt: date.optional(),
    firstSeenByQuestion: z.record(id, z.boolean()),
    mock: z
      .object({
        format: z.literal('short'),
        questionCount: z.union([z.literal(10), z.literal(20), z.literal(50)]),
        timeMode: z.enum(['study', 'continuous']),
        limitSeconds: z.number().int().min(1).max(21600),
        remainingSeconds: z.number().int().min(0).max(21600),
        deadlineAt: date.nullable(),
        paused: z.boolean(),
        flags: z.array(id).max(50),
        draftAnswers: z.record(
          id,
          z
            .object({
              choiceId: id,
              canExplain: z.boolean(),
              elapsedMs: z.number().int().min(0).max(86400000),
              answeredAt: date,
            })
            .strict(),
        ),
        finishedReason: z.enum(['submitted', 'timeout']).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
const dataSchema = z
  .object({
    attempts: z.array(attempt).max(100000),
    exposures: z
      .array(
        z
          .object({
            id,
            questionId: id,
            groupId: id,
            kind: z.enum(['question', 'explanation']),
            sessionId: id,
            at: date,
          })
          .strict(),
      )
      .max(200000),
    reviews: z
      .array(
        z
          .object({
            questionId: id,
            dueAt: date,
            intervalDays: z.number().int().min(0).max(3650),
            wrongStreak: z.number().int().min(0).max(100000),
            manual: z.boolean(),
          })
          .strict(),
      )
      .max(10000),
    sessions: z.array(session).max(20000),
    videoProgress: z
      .array(
        z
          .object({
            videoId: id,
            watched: z.boolean(),
            note: z.string().max(20000),
            updatedAt: date,
          })
          .strict(),
      )
      .max(10000),
    unitProgress: z
      .array(
        z
          .object({
            unitId: id,
            rating: z.number().int().min(0).max(5),
            note: z.string().max(20000),
            updatedAt: date,
          })
          .strict(),
      )
      .max(1000),
    videoOverrides: z
      .array(
        z.object({ id, deleted: z.boolean().optional(), video: videoSchema.optional() }).strict(),
      )
      .max(10000),
    settings: z
      .array(
        z
          .object({
            id: z.literal('main'),
            theme: z.enum(['light', 'dark', 'system']),
            diagnosticStatus: z.enum(['not_started', 'started', 'completed', 'skipped']),
            timezone: z.string().min(1).max(100),
          })
          .strict(),
      )
      .max(1),
    favorites: z.array(z.object({ questionId: id }).strict()).max(10000),
    studyEvents: z
      .array(
        z
          .object({
            id,
            seconds: z.number().int().min(0).max(3600),
            at: date,
            localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          })
          .strict(),
      )
      .max(200000),
  })
  .strict();
const backupSchema = z
  .object({
    app: z.literal('cpt-master'),
    formatVersion: z.literal(1),
    contentVersion: z.string().min(1),
    createdAt: date,
    data: dataSchema,
  })
  .strict();
export interface Backup {
  app: 'cpt-master';
  formatVersion: 1;
  contentVersion: string;
  createdAt: string;
  data: Snapshot;
}
export function parseYoutubeUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('YouTubeのURLを入力してください。');
  }
  if (url.protocol !== 'https:') throw new Error('httpsのYouTube URLを使用してください。');
  const host = url.hostname.toLowerCase();
  let videoId: string | null = null;
  if (host === 'youtu.be') videoId = url.pathname.split('/')[1];
  else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    videoId =
      url.pathname === '/watch'
        ? url.searchParams.get('v')
        : /^\/(shorts|embed)\//.test(url.pathname)
          ? url.pathname.split('/')[2]
          : null;
  }
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId))
    throw new Error('有効なYouTube動画URLを指定してください。');
  return videoId;
}
export function validateBackup(text: string): Backup {
  if (text.length > 15 * 1024 * 1024) throw new Error('バックアップは15MB以下にしてください。');
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('JSONを読み取れません。');
  }
  const result = backupSchema.safeParse(raw);
  if (!result.success)
    throw new Error(
      `形式が不正です：${result.error.issues[0]?.path.join('.')}。既存データは変更していません。`,
    );
  const backup = result.data as Backup;
  if (backup.contentVersion !== contentVersion)
    throw new Error('教材の版が異なります。この初版では同じ教材版のバックアップのみ復元できます。');
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const uids = new Set(units.map((u) => u.id));
  for (const name of tableNames) {
    const keys = backup.data[name].map((r: unknown) => {
      const obj = r as Record<string, unknown>;
      return obj.id ?? obj.questionId ?? obj.videoId ?? obj.unitId;
    });
    if (new Set(keys).size !== keys.length) throw new Error(`${name}に重複IDがあります。`);
  }
  const sessionIds = new Set(backup.data.sessions.map((s) => s.id));
  for (const a of backup.data.attempts) {
    const q = qMap.get(a.questionId);
    if (
      !q ||
      q.revision !== a.questionRevision ||
      q.groupId !== a.groupId ||
      q.unitId !== a.unitId ||
      q.domainId !== a.domainId ||
      q.correctChoiceId !== a.correctChoiceId ||
      !q.choices.some((c) => c.id === a.selectedChoiceId) ||
      a.correct !== (a.selectedChoiceId === q.correctChoiceId) ||
      !sessionIds.has(a.sessionId) ||
      a.choiceOrder.length !== q.choices.length ||
      new Set(a.choiceOrder).size !== q.choices.length ||
      q.choices.some((c) => !a.choiceOrder.includes(c.id))
    )
      throw new Error('解答履歴と教材の対応が不正です。');
  }
  for (const s of backup.data.sessions) {
    if ((s.mode === 'mock') !== !!s.mock)
      throw new Error('短縮模試の設定とセッション形式が一致しません。');
    if (s.mock) {
      const m = s.mock;
      if (
        m.questionCount !== s.questionIds.length ||
        m.remainingSeconds > m.limitSeconds ||
        new Set(m.flags).size !== m.flags.length ||
        m.flags.some((qid) => !s.questionIds.includes(qid))
      )
        throw new Error('短縮模試の件数・時間・フラグが不正です。');
      if (m.timeMode === 'continuous' && m.paused)
        throw new Error('時間継続モードは停止できません。');
      if (
        s.status === 'active' &&
        (s.completedAt !== undefined ||
          m.finishedReason !== undefined ||
          m.paused !== (m.deadlineAt === null))
      )
        throw new Error('進行中の短縮模試の時計が不正です。');
      if (
        s.status === 'completed' &&
        (!s.completedAt ||
          !m.finishedReason ||
          m.deadlineAt !== null ||
          m.paused ||
          (m.finishedReason === 'timeout' && m.remainingSeconds !== 0))
      )
        throw new Error('完了した短縮模試の時計が不正です。');
      if (
        m.deadlineAt &&
        (Date.parse(m.deadlineAt) < Date.parse(s.startedAt) ||
          (m.timeMode === 'continuous' &&
            Date.parse(m.deadlineAt) !== Date.parse(s.startedAt) + m.limitSeconds * 1000))
      )
        throw new Error('短縮模試の締切が不正です。');
      for (const [qid, draft] of Object.entries(m.draftAnswers)) {
        const q = qMap.get(qid);
        if (
          !s.questionIds.includes(qid) ||
          !q?.choices.some((c) => c.id === draft.choiceId) ||
          Date.parse(draft.answeredAt) < Date.parse(s.startedAt) ||
          (s.completedAt && Date.parse(draft.answeredAt) > Date.parse(s.completedAt))
        )
          throw new Error('短縮模試の下書き回答が不正です。');
      }
      const records = backup.data.attempts.filter((a) => a.sessionId === s.id);
      if (s.status === 'active' && records.length)
        throw new Error('採点前の短縮模試に採点済み回答があります。');
      if (
        s.status === 'completed' &&
        (new Set(records.map((a) => a.questionId)).size !== records.length ||
          records.length !== Object.keys(m.draftAnswers).length ||
          records.some((a) => {
            const draft = m.draftAnswers[a.questionId];
            return (
              !draft ||
              a.selectedChoiceId !== draft.choiceId ||
              a.canExplain !== draft.canExplain ||
              a.elapsedMs !== draft.elapsedMs ||
              a.at !== draft.answeredAt
            );
          }))
      )
        throw new Error('短縮模試の下書きと採点履歴が一致しません。');
    }
    if (s.index >= s.questionIds.length || new Set(s.questionIds).size !== s.questionIds.length)
      throw new Error('セッションの問題順が不正です。');
    const groups = new Set<string>();
    for (const qid of s.questionIds) {
      const q = qMap.get(qid);
      const order = s.choiceOrders[qid];
      if (
        s.mock &&
        q &&
        (q.pool === 'exam' ||
          q.review.status === 'draft' ||
          q.review.revision !== q.revision ||
          q.sourceRefs.length === 0 ||
          q.choices.length !== 3 ||
          q.format !== 'single_choice')
      )
        throw new Error('短縮模試に照合済みの3択問題を使用してください。');
      if (
        !q ||
        groups.has(q.groupId) ||
        !order ||
        order.length !== q.choices.length ||
        new Set(order).size !== q.choices.length ||
        q.choices.some((c) => !order.includes(c.id)) ||
        typeof s.firstSeenByQuestion[qid] !== 'boolean'
      )
        throw new Error('セッションの参照が不正です。');
      groups.add(q.groupId);
    }
  }
  for (const e of backup.data.exposures)
    if (
      qMap.get(e.questionId)?.groupId !== e.groupId ||
      !sessionIds.has(e.sessionId) ||
      backup.data.sessions.some(
        (s) => s.id === e.sessionId && s.mode === 'mock' && !s.questionIds.includes(e.questionId),
      )
    )
      throw new Error('表示履歴の参照が不正です。');
  for (const r of [...backup.data.reviews, ...backup.data.favorites])
    if (!qMap.has(r.questionId)) throw new Error('問題IDが見つかりません。');
  for (const u of backup.data.unitProgress)
    if (!uids.has(u.unitId)) throw new Error('単元IDが見つかりません。');
  const videoIds = new Set([
    ...seedVideos.map((v) => v.id),
    ...backup.data.videoOverrides.filter((v) => v.video).map((v) => v.id),
  ]);
  const objectiveUnits = new Map(
    units.flatMap((u) => u.objectives.map((o) => [o.id, u.id] as const)),
  );
  for (const o of backup.data.videoOverrides) {
    if (o.video) {
      if (
        o.id !== o.video.id ||
        parseYoutubeUrl(o.video.url) !== o.video.youtubeId ||
        o.video.unitIds.some((u) => !uids.has(u)) ||
        o.video.objectiveIds.some(
          (oId) => !objectiveUnits.has(oId) || !o.video!.unitIds.includes(objectiveUnits.get(oId)!),
        )
      )
        throw new Error('動画の参照が不正です。');
      if (
        o.video.content.status !== 'unreviewed' ||
        o.video.content.checkedAt !== null ||
        o.video.content.method !== null ||
        o.video.content.sourceRefs.length !== 0
      )
        throw new Error(
          '個人動画の審査状態は未審査である必要があります。教材の専門家審査記録として取り込めません。',
        );
    }
  }
  for (const v of backup.data.videoProgress)
    if (!videoIds.has(v.videoId)) throw new Error('動画視聴記録の参照が不正です。');
  for (const s of backup.data.settings) {
    try {
      new Intl.DateTimeFormat('ja', { timeZone: s.timezone });
    } catch {
      throw new Error('タイムゾーンが不正です。');
    }
  }
  return backup;
}
export async function exportBackup(database: LearningDB = db): Promise<Backup> {
  return {
    app: 'cpt-master',
    formatVersion: 1,
    contentVersion,
    createdAt: new Date().toISOString(),
    data: await snapshot(database),
  };
}
export async function restoreBackup(candidate: Backup, database: LearningDB = db) {
  const backup = validateBackup(JSON.stringify(candidate));
  await database.transaction('rw', database.tables, async () => {
    const localSessions = new Map((await database.sessions.toArray()).map((s) => [s.id, s]));
    // A mock session and its graded ledger form one record of a submission.
    // Keeping a local draft while adding a remote completed ledger would make
    // it impossible to resume or export. Preserve the local session as a unit.
    const protectedIds = new Set(
      backup.data.sessions
        .filter(
          (s) =>
            localSessions.has(s.id) &&
            (s.mode === 'mock' || localSessions.get(s.id)!.mode === 'mock'),
        )
        .map((s) => s.id),
    );
    const protectedQuestions = new Set(
      backup.data.sessions
        .filter((s) => protectedIds.has(s.id))
        .flatMap((s) => [...s.questionIds, ...localSessions.get(s.id)!.questionIds]),
    );
    const canMerge = (name: (typeof tableNames)[number], record: Record<string, unknown>) => {
      if (name === 'attempts' && protectedIds.has(record.sessionId as string)) return false;
      // Reviews are a per-question projection with no originating session ID.
      // Do not project a remote, skipped mock submission into a local draft.
      if (name === 'reviews' && protectedQuestions.has(record.questionId as string)) return false;
      if (name === 'exposures' && protectedIds.has(record.sessionId as string))
        return localSessions
          .get(record.sessionId as string)!
          .questionIds.includes(record.questionId as string);
      return true;
    };
    for (const name of tableNames) {
      const table = database.table(name);
      const existing = new Set(await table.toCollection().primaryKeys());
      const key = (r: Record<string, unknown>) => r.id ?? r.questionId ?? r.videoId ?? r.unitId;
      const added = (backup.data[name] as unknown as Record<string, unknown>[]).filter(
        (r) => !existing.has(key(r) as string) && canMerge(name, r),
      );
      await table.bulkAdd(added);
    }
    for (const exposure of backup.data.exposures) {
      if (!canMerge('exposures', exposure as unknown as Record<string, unknown>)) continue;
      const existing = await database.exposures.get(exposure.id);
      if (existing && exposure.at < existing.at) await database.exposures.put(exposure);
    }
    const current = await database.settings.get('main');
    const imported = backup.data.settings[0];
    if (current && imported) {
      const ranks = { not_started: 0, started: 1, skipped: 2, completed: 3 };
      if (ranks[imported.diagnosticStatus] > ranks[current.diagnosticStatus])
        await database.settings.update('main', { diagnosticStatus: imported.diagnosticStatus });
    }
    // Source validity alone cannot detect cross-device primary-key conflicts.
    // Validate the composed state before commit so every write rolls back if
    // any ledger/reference becomes invalid during merging.
    validateBackup(JSON.stringify(await exportBackup(database)));
  });
}
export function downloadJson(value: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function mergedVideos(seed: Video[], overrides: VideoOverride[]) {
  const map = new Map(seed.map((v) => [v.id, v]));
  overrides.forEach((o) => {
    if (o.deleted) map.delete(o.id);
    else if (o.video) {
      const bundled = seed.find((v) => v.id === o.id);
      const sameSet = (a: string[], b: string[]) =>
        a.length === b.length && a.every((x) => b.includes(x));
      const sameContent =
        bundled &&
        bundled.youtubeId === o.video.youtubeId &&
        sameSet(bundled.unitIds, o.video.unitIds) &&
        sameSet(bundled.objectiveIds, o.video.objectiveIds);
      map.set(o.id, {
        ...toPersonalVideo(o.video),
        content: sameContent
          ? bundled.content
          : { status: 'unreviewed', checkedAt: null, method: null, sourceRefs: [] },
      });
    }
  });
  return [...map.values()].sort((a, b) => a.order - b.order);
}
export function toPersonalVideo(video: Video): Video {
  return {
    ...video,
    content: { status: 'unreviewed', checkedAt: null, method: null, sourceRefs: [] },
  };
}
