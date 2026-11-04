import 'fake-indexeddb/auto';
import { writeFile, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { questions, contentVersion, seedVideos } from '../src/content';
import {
  LearningDB,
  exportBackup,
  validateBackup,
  toPersonalVideo,
  defaultSettings,
} from '../src/storage/db';
import { createSession } from '../src/engines/learning';
// Run once before changing the session/backup schema. These are isolated,
// synthetic records, never an export from the user's browser/database.
if (questions.length !== 300 || String(contentVersion) !== '2026-11-04.2')
  throw new Error('v0.4 baseline required');
const database = new LearningDB('cpt-v04-compat-fixture');
const at = new Date('2026-11-04T12:00:00Z');
const historicalModule = new URL('../src/engines/.v04-mock-snapshot.ts', import.meta.url);
await writeFile(
  historicalModule,
  execFileSync('git', ['show', '8f37099:src/engines/mock.ts'], { encoding: 'utf8' }),
  { flag: 'wx' },
);
try {
  const { createMockSession, withMockDraft } = await import(historicalModule.href);
  const q = questions.find((q) => q.id === 'ex-plan-load-01')!;
  const practice = createSession('practice', [q], [], [], () => 0.5);
  Object.assign(practice, {
    id: 'v04-practice',
    startedAt: at.toISOString(),
    status: 'completed',
    completedAt: '2026-11-04T12:00:20Z',
  });
  await database.sessions.put(practice);
  await database.attempts.put({
    id: 'v04-answer',
    sessionId: practice.id,
    questionId: q.id,
    questionRevision: q.revision,
    groupId: q.groupId,
    domainId: q.domainId,
    unitId: q.unitId,
    selectedChoiceId: q.correctChoiceId,
    correctChoiceId: q.correctChoiceId,
    correct: true,
    firstSeen: true,
    canExplain: false,
    elapsedMs: 20000,
    choiceOrder: practice.choiceOrders[q.id],
    at: '2026-11-04T12:00:20Z',
  });
  await database.exposures.put({
    id: 'v04-display',
    sessionId: practice.id,
    questionId: q.id,
    groupId: q.groupId,
    kind: 'question',
    at: at.toISOString(),
  });
  let short = createMockSession(questions, 20, true, 'study', [], [], at, () => 0.4);
  short = { ...short, id: 'v04-active-short' };
  const mq = questions.find((q) => q.id === short.questionIds[0])!;
  short = withMockDraft(
    short,
    mq,
    mq.correctChoiceId,
    true,
    5000,
    new Date('2026-11-04T12:00:05Z'),
  );
  short.mock!.flags = [mq.id];
  await database.sessions.put(short);
  await database.unitProgress.put({
    unitId: q.unitId,
    rating: 3,
    note: 'v0.4の追加単元メモ',
    updatedAt: at.toISOString(),
  });
  await database.favorites.put({ questionId: q.id });
  await database.reviews.put({
    questionId: q.id,
    dueAt: '2026-11-05T12:00:00Z',
    intervalDays: 1,
    wrongStreak: 0,
    manual: true,
  });
  const v = seedVideos.find((v) => v.youtubeId === 'fIvDJoyVgRQ')!;
  await database.videoProgress.put({
    videoId: v.id,
    watched: true,
    note: 'v0.4の動画メモ',
    updatedAt: at.toISOString(),
  });
  await database.videoOverrides.put({ id: v.id, video: toPersonalVideo({ ...v, order: 88 }) });
  await database.settings.put({ ...defaultSettings, theme: 'dark', diagnosticStatus: 'completed' });
  const backup = await exportBackup(database);
  validateBackup(JSON.stringify(backup));
  await writeFile('tests/fixtures/v04-backup.json', JSON.stringify(backup, null, 2) + '\n', {
    flag: 'wx',
  });
  await writeFile(
    'tests/fixtures/v04-question-manifest.json',
    JSON.stringify(
      questions.map((q) => ({
        id: q.id,
        revision: q.revision,
        groupId: q.groupId,
        sha256: createHash('sha256').update(JSON.stringify(q)).digest('hex'),
      })),
      null,
      2,
    ) + '\n',
    { flag: 'wx' },
  );
  console.log('Saved v0.4 schema backup and immutable 300-question manifest');
} finally {
  await database.delete();
  await unlink(historicalModule);
}
