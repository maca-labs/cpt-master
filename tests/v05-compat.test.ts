import 'fake-indexeddb/auto';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { contentVersion, questions } from '../src/content';
import {
  advancedContentVersion,
  qualityReviewContentVersion,
  v052ContentVersion,
  v060ContentVersion,
} from '../src/content/release';
import { previousReviewedRevisions } from '../src/content/question-quality-review';
import type { Session } from '../src/domain/types';
import { createSession } from '../src/engines/learning';
import { createThroughSession, withMockDraft } from '../src/engines/mock';
import { selectPracticeQuestions } from '../src/engines/practice-selection';
import {
  LearningDB,
  exportBackup,
  restoreBackup,
  snapshot,
  validateBackup,
  type Backup,
} from '../src/storage/db';

const fixture = (name: string): Backup =>
  JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));
const databases: LearningDB[] = [];
const database = () => {
  const db = new LearningDB(`v05-compat-${crypto.randomUUID()}`);
  databases.push(db);
  return db;
};
afterEach(async () => {
  await Promise.all(databases.splice(0).map((db) => db.delete()));
});
const now = new Date('2026-11-05T01:00:00Z');
function strictSession(): Session {
  const options = {
    batch: 'expansion-2026-11-04',
    selection: 'strict_unseen',
    requestedCount: 50,
  } as const;
  const selected = selectPracticeQuestions(
    questions,
    true,
    { exposures: [], attempts: [], sessions: [] },
    options,
    () => 0.4,
  );
  return {
    ...createSession('practice', selected, [], [], () => 0.4),
    practice: options,
    startedAt: now.toISOString(),
  };
}

describe('v0.5 additive schema compatibility', () => {
  it('preserves all v0.4 identities and the original bytes of questions outside the quality review', () => {
    const manifest = JSON.parse(
      readFileSync(new URL('./fixtures/v04-question-manifest.json', import.meta.url), 'utf8'),
    );
    for (const [index, old] of manifest.entries()) {
      const q = questions[index];
      expect(q.id).toBe(old.id);
      expect(q.groupId).toBe(old.groupId);
      const previous = previousReviewedRevisions.get(q.id);
      if (previous === undefined) {
        expect(q.revision).toBe(old.revision);
        expect(createHash('sha256').update(JSON.stringify(q)).digest('hex')).toBe(old.sha256);
      } else {
        expect(previous).toBe(old.revision);
        expect(q.revision).toBe(previous + 1);
      }
    }
    expect(contentVersion).toBe('2026-11-10.2');
  });
  it.each(['v04-backup.json', 'legacy-v1-backup.json'])(
    'restores %s without replacing notes, answers, settings or active drafts',
    async (name) => {
      const old = fixture(name),
        db = database();
      const validated = validateBackup(JSON.stringify(old));
      await restoreBackup(validated, db);
      expect(await snapshot(db)).toEqual(old.data);
      db.close();
      await db.open();
      expect((await exportBackup(db)).data).toEqual(old.data);
      await restoreBackup(validated, db);
      expect(await snapshot(db)).toEqual(old.data);
    },
  );
  it.each([
    v052ContentVersion,
    v060ContentVersion,
    advancedContentVersion,
    qualityReviewContentVersion,
  ])('restores an active strict reservation from content %s', async (version) => {
    const previous = database(),
      restored = database();
    await previous.sessions.add(strictSession());
    const exported = await exportBackup(previous);
    const backup = validateBackup(JSON.stringify({ ...exported, contentVersion: version }));
    await restoreBackup(backup, restored);
    expect(await snapshot(restored)).toEqual(await snapshot(previous));
  });
  it('round-trips strict reservations and all 155 draft flags without a schema migration', async () => {
    const db = database(),
      restored = database();
    const strict = strictSession();
    let through = createThroughSession(questions, true, [], [], [strict], now, () => 0.6);
    const q = questions.find((q) => q.id === through.questionIds[0])!;
    through = withMockDraft(
      through,
      q,
      q.correctChoiceId,
      false,
      12000,
      new Date(now.getTime() + 12000),
    );
    through.mock!.flags = [...through.questionIds];
    await db.sessions.bulkAdd([strict, through]);
    const backup = await exportBackup(db);
    await restoreBackup(validateBackup(JSON.stringify(backup)), restored);
    expect((await snapshot(restored)).sessions).toEqual((await snapshot(db)).sessions);
    expect((await restored.sessions.get(through.id))!.mock!.flags).toHaveLength(155);
    expect(restored.verno).toBe(1);
  });
  it('accepts an explicitly smaller strict session with the original requested count', async () => {
    const db = database(),
      s = strictSession();
    s.questionIds = s.questionIds.slice(0, 7);
    s.choiceOrders = Object.fromEntries(s.questionIds.map((id) => [id, s.choiceOrders[id]]));
    s.firstSeenByQuestion = Object.fromEntries(s.questionIds.map((id) => [id, true]));
    await db.sessions.add(s);
    expect(() =>
      validateBackup(
        JSON.stringify({
          app: 'cpt-master',
          formatVersion: 1,
          contentVersion,
          createdAt: now.toISOString(),
          data: {
            attempts: [],
            exposures: [],
            reviews: [],
            sessions: [s],
            videoProgress: [],
            unitProgress: [],
            videoOverrides: [],
            settings: [],
            favorites: [],
            studyEvents: [],
          },
        }),
      ),
    ).not.toThrow();
  });
  it('rejects conflicting imported strict reservations atomically and leaves local records unchanged', async () => {
    const db = database(),
      local = strictSession();
    await db.sessions.add(local);
    const remote = await exportBackup(db);
    remote.data.sessions[0].id = 'another-device-reservation';
    const before = await snapshot(db);
    await expect(restoreBackup(remote, db)).rejects.toThrow(/重複予約/);
    expect(await snapshot(db)).toEqual(before);
  });
  it('rejects invalid new metadata before writing to the existing database', async () => {
    const db = database(),
      s = strictSession();
    await db.sessions.add(s);
    const through = createThroughSession(questions, true, [], [], [s], now, () => 0.5);
    await db.sessions.add(through);
    const valid = await exportBackup(db),
      before = await snapshot(db);
    const mutations: ((b: Backup) => void)[] = [
      (b) => {
        b.data.sessions.find((x) => x.mock)!.mock!.format = 'short';
      },
      (b) => {
        b.data.sessions.find((x) => x.mock)!.mock!.timeMode = 'study';
      },
      (b) => {
        b.data.sessions.find((x) => x.mock)!.mock!.limitSeconds = 100;
      },
      (b) => {
        b.data.sessions.find((x) => x.practice)!.mode = 'review';
      },
      (b) => {
        const s = b.data.sessions.find((x) => x.practice)!;
        s.firstSeenByQuestion[s.questionIds[0]] = false;
      },
      (b) => {
        b.contentVersion = 'unknown-future';
      },
    ];
    for (const mutate of mutations) {
      const invalid = structuredClone(valid);
      mutate(invalid);
      await expect(restoreBackup(invalid, db)).rejects.toThrow();
      expect(await snapshot(db)).toEqual(before);
    }
  });
});
