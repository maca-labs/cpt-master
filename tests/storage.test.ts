import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { questions, seedVideos, units } from '../src/content';
import { createSession } from '../src/engines/learning';
import {
  LearningDB,
  defaultSettings,
  exportBackup,
  parseYoutubeUrl,
  restoreBackup,
  snapshot,
  toPersonalVideo,
  tableNames,
  validateBackup,
  type Backup,
  type Snapshot,
} from '../src/storage/db';

const at = '2026-11-04T00:00:00.000Z';
let source: LearningDB;
let target: LearningDB;

function fixture(): Snapshot {
  const q = questions.find((candidate) => candidate.choices.length === 3);
  if (!q || !units.some((u) => u.id === q.unitId) || !seedVideos[0])
    throw new Error('教材のテスト用参照が不足しています。');
  const session = createSession('practice', [q], [], [], () => 0);
  session.startedAt = at;
  const video = {
    ...toPersonalVideo(structuredClone(seedVideos[0])),
    id: 'user-video',
    unitIds: [q.unitId],
    objectiveIds: [...q.objectiveIds],
  };
  return {
    attempts: [
      {
        id: 'attempt-one',
        sessionId: session.id,
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
        elapsedMs: 13500,
        choiceOrder: session.choiceOrders[q.id],
        at,
      },
    ],
    exposures: [
      {
        id: 'display-one',
        questionId: q.id,
        groupId: q.groupId,
        kind: 'question',
        sessionId: session.id,
        at,
      },
    ],
    reviews: [
      {
        questionId: q.id,
        dueAt: '2026-11-05T00:00:00.000Z',
        intervalDays: 1,
        wrongStreak: 1,
        manual: true,
      },
    ],
    sessions: [session],
    videoProgress: [
      { videoId: video.id, watched: true, note: '視聴メモ\n根拠も確認する。', updatedAt: at },
    ],
    unitProgress: [{ unitId: q.unitId, rating: 3, note: '自己評価の記録', updatedAt: at }],
    videoOverrides: [{ id: video.id, video }],
    settings: [{ ...defaultSettings, theme: 'dark', diagnosticStatus: 'completed' }],
    favorites: [{ questionId: q.id }],
    studyEvents: [{ id: 'study-one', seconds: 75, at, localDate: '2026-11-04' }],
  };
}

async function populate(database: LearningDB, records: Snapshot = fixture()) {
  await database.transaction('rw', database.tables, async () => {
    for (const name of tableNames) await database.table(name).bulkAdd(records[name]);
  });
  return records;
}

beforeEach(() => {
  source = new LearningDB(`cpt-test-source-${crypto.randomUUID()}`);
  target = new LearningDB(`cpt-test-target-${crypto.randomUUID()}`);
});

afterEach(async () => {
  await Promise.all([source.delete(), target.delete()]);
});

describe('learning backup persistence', () => {
  it('round-trips every IndexedDB table through JSON without losing notes or identities', async () => {
    const initial = await populate(source);
    const backup = await exportBackup(source);
    const parsed = validateBackup(JSON.stringify(backup));
    await restoreBackup(parsed, target);
    expect(Object.keys(parsed.data).sort()).toEqual([...tableNames].sort());
    expect(await snapshot(target)).toEqual(initial);
  });

  it('keeps saved data after closing and reopening IndexedDB', async () => {
    const initial = await populate(source);
    source.close();
    await source.open();
    expect(await snapshot(source)).toEqual(initial);
  });

  it('merges without duplicate records when the same backup is restored twice', async () => {
    await populate(source);
    const backup = await exportBackup(source);
    await target.studyEvents.add({ id: 'local-study', seconds: 30, at, localDate: '2026-11-04' });
    await restoreBackup(backup, target);
    const first = await snapshot(target);
    await restoreBackup(backup, target);
    expect(await snapshot(target)).toEqual(first);
    expect(await target.studyEvents.count()).toBe(2);
    for (const name of tableNames.filter((name) => name !== 'studyEvents')) {
      expect(await target.table(name).count()).toBe(backup.data[name].length);
    }
  });

  it('preserves current local notes and theme while restoring a completed diagnostic state', async () => {
    await populate(source);
    const backup = await exportBackup(source);
    const progress = backup.data.videoProgress[0];
    await target.videoProgress.add({ ...progress, note: '端末側で追記したメモ' });
    await target.settings.add({ ...defaultSettings, theme: 'system', diagnosticStatus: 'started' });
    await restoreBackup(backup, target);
    expect((await target.videoProgress.get(progress.videoId))?.note).toBe('端末側で追記したメモ');
    expect(await target.settings.get('main')).toMatchObject({
      theme: 'system',
      diagnosticStatus: 'completed',
    });
  });

  it('rejects malformed JSON without changing existing data', async () => {
    await populate(target);
    const before = await snapshot(target);
    expect(() => validateBackup('{broken json')).toThrow(/JSON/);
    expect(await snapshot(target)).toEqual(before);
  });

  it('rejects incompatible content versions without changing existing data', async () => {
    await populate(source);
    await populate(target);
    const before = await snapshot(target);
    const backup = await exportBackup(source);
    backup.contentVersion = 'unknown-future-content-version';
    await expect(restoreBackup(backup, target)).rejects.toThrow(/版/);
    expect(await snapshot(target)).toEqual(before);
  });

  const corruptions: { name: string; mutate: (backup: Backup) => void }[] = [
    {
      name: 'answer question ID',
      mutate: (b) => {
        b.data.attempts[0].questionId = 'missing-question';
      },
    },
    {
      name: 'exposure session ID',
      mutate: (b) => {
        b.data.exposures[0].sessionId = 'missing-session';
      },
    },
    {
      name: 'review question ID',
      mutate: (b) => {
        b.data.reviews[0].questionId = 'missing-question';
      },
    },
    {
      name: 'favorite question ID',
      mutate: (b) => {
        b.data.favorites[0].questionId = 'missing-question';
      },
    },
    {
      name: 'unit progress ID',
      mutate: (b) => {
        b.data.unitProgress[0].unitId = 'missing-unit';
      },
    },
    {
      name: 'duplicate primary key',
      mutate: (b) => {
        b.data.studyEvents.push({ ...b.data.studyEvents[0] });
      },
    },
    {
      name: 'video URL and ID mismatch',
      mutate: (b) => {
        b.data.videoOverrides[0].video!.youtubeId = 'xxxxxxxxxxx';
      },
    },
    {
      name: 'video progress ID',
      mutate: (b) => {
        b.data.videoProgress[0].videoId = 'missing-video';
      },
    },
    {
      name: 'video objective ID',
      mutate: (b) => {
        b.data.videoOverrides[0].video!.objectiveIds = ['missing-objective'];
      },
    },
    {
      name: 'duplicated answer choice ID',
      mutate: (b) => {
        b.data.attempts[0].choiceOrder.push(b.data.attempts[0].choiceOrder[0]);
      },
    },
    {
      name: 'duplicated session choice ID',
      mutate: (b) => {
        const s = b.data.sessions[0];
        const order = s.choiceOrders[s.questionIds[0]];
        order.push(order[0]);
      },
    },
  ];

  for (const { name, mutate } of corruptions) {
    it(`rejects invalid ${name} before writing any table`, async () => {
      await populate(source);
      await populate(target);
      const before = await snapshot(target);
      const backup = await exportBackup(source);
      mutate(backup);
      await expect(restoreBackup(backup, target)).rejects.toThrow();
      expect(await snapshot(target)).toEqual(before);
    });
  }
});

describe('YouTube URL trust boundary', () => {
  it('extracts IDs from supported HTTPS YouTube URL formats', () => {
    expect(parseYoutubeUrl('https://www.youtube.com/watch?v=to4SW3kqm9Y&t=30')).toBe('to4SW3kqm9Y');
    expect(parseYoutubeUrl('https://youtu.be/to4SW3kqm9Y')).toBe('to4SW3kqm9Y');
    expect(parseYoutubeUrl('https://www.youtube.com/embed/to4SW3kqm9Y')).toBe('to4SW3kqm9Y');
    expect(parseYoutubeUrl('https://m.youtube.com/shorts/to4SW3kqm9Y')).toBe('to4SW3kqm9Y');
  });

  it.each([
    'javascript:alert(1)',
    'http://www.youtube.com/watch?v=to4SW3kqm9Y',
    'https://youtube.com.evil.example/watch?v=to4SW3kqm9Y',
    'https://www.youtube.com@evil.example/watch?v=to4SW3kqm9Y',
    'https://youtu.be/short',
    'https://www.youtube.com/playlist?list=not-a-video',
  ])('rejects an unsafe or non-video URL: %s', (value) => {
    expect(() => parseYoutubeUrl(value)).toThrow();
  });
});
