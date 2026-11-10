import 'fake-indexeddb/auto';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { questions, units, contentVersion, legacyQuestionIds } from '../src/content';
import { advancedContentVersion, legacyContentVersion } from '../src/content/release';
import { previousReviewedRevisions } from '../src/content/question-quality-review';
import {
  LearningDB,
  exportBackup,
  restoreBackup,
  snapshot,
  validateBackup,
  type Backup,
} from '../src/storage/db';
import { mediaAssets } from '../src/content/media';
import { createSession, eligible, isFirstSeen, selectPractice } from '../src/engines/learning';
import { normalizeChoice } from '../scripts/validate-content';
const legacyText = readFileSync(
  new URL('./fixtures/legacy-v1-backup.json', import.meta.url),
  'utf8',
);
const manifest = JSON.parse(
  readFileSync(new URL('./fixtures/legacy-question-manifest.json', import.meta.url), 'utf8'),
);
const databases: LearningDB[] = [];
const database = () => {
  const db = new LearningDB(`cpt-upgrade-${crypto.randomUUID()}`);
  databases.push(db);
  return db;
};
afterEach(async () => {
  await Promise.all(databases.splice(0).map((db) => db.delete()));
});
describe('curriculum expansion compatibility', () => {
  it('preserves meaningful mathematical signs in duplicate-choice detection', () => {
    expect(normalizeChoice('100 J')).not.toBe(normalizeChoice('−100 J'));
    expect(normalizeChoice('−100 J')).toBe(normalizeChoice('-100J'));
    expect(normalizeChoice('同じ。')).toBe(normalizeChoice(' 同じ '));
  });
  it('preserves original question bytes outside the explicitly reviewed revisions', () => {
    const rows = Array.isArray(manifest) ? manifest : manifest.questions;
    expect(rows).toHaveLength(100);
    expect(legacyQuestionIds.size).toBe(100);
    for (const old of rows) {
      const q = questions.find((q) => q.id === old.id)!;
      expect(q).toBeDefined();
      const previous = previousReviewedRevisions.get(q.id);
      if (previous === undefined) {
        expect(createHash('sha256').update(JSON.stringify(q)).digest('hex')).toBe(old.sha256);
      } else {
        expect(previous).toBe(old.revision);
        expect(q.revision).toBe(previous + 1);
        expect(q.review.revision).toBe(q.revision);
        expect(q.groupId).toBe(old.groupId);
        expect(q.unitId).toBe(old.unitId);
        expect(q.domainId).toBe(old.domainId);
        expect(q.choices.map((choice) => choice.id)).toEqual(old.choiceIds);
        expect(q.correctChoiceId).toBe(old.correctChoiceId);
      }
    }
  });
  it('migrates a backup exported by the actual old code without losing any record', async () => {
    const raw = JSON.parse(legacyText) as Backup;
    expect(raw.contentVersion).toBe(legacyContentVersion);
    const checked = validateBackup(legacyText);
    expect(checked.contentVersion).toBe(contentVersion);
    expect(checked.data).toEqual(raw.data);
    const db = database();
    await restoreBackup(checked, db);
    expect(await snapshot(db)).toEqual(raw.data);
    db.close();
    await db.open();
    expect(await snapshot(db)).toEqual(raw.data);
    const exported = await exportBackup(db);
    expect(exported.contentVersion).toBe(contentVersion);
    expect(validateBackup(JSON.stringify(exported)).data).toEqual(raw.data);
    await restoreBackup(raw, db);
    expect(await snapshot(db)).toEqual(raw.data);
  });
  it('keeps an existing version-1 IndexedDB intact while the content grows', async () => {
    const raw = JSON.parse(legacyText) as Backup,
      db = database();
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables)
        await table.bulkAdd(raw.data[table.name as keyof typeof raw.data]);
    });
    db.close();
    await db.open();
    expect(db.verno).toBe(1);
    expect(await snapshot(db)).toEqual(raw.data);
    expect(units.length).toBeGreaterThan(8);
    expect(questions.length).toBeGreaterThan(100);
  });
  it('restores a reviewed question’s previous grading revision without resetting first-seen history', async () => {
    const q = questions.find((q) => q.id === 'professional-02')!;
    const saved = database();
    const session = createSession('diagnostic', [q], [], []);
    const record = {
      id: `${session.id}:${q.id}`,
      sessionId: session.id,
      questionId: q.id,
      questionRevision: 2,
      groupId: q.groupId,
      domainId: q.domainId,
      unitId: q.unitId,
      selectedChoiceId: q.choices.find((choice) => choice.id !== q.correctChoiceId)!.id,
      correctChoiceId: q.correctChoiceId,
      correct: false,
      firstSeen: true,
      canExplain: false,
      elapsedMs: 2000,
      choiceOrder: session.choiceOrders[q.id],
      at: session.startedAt,
    };
    expect(q.revision).toBe(3);
    await saved.sessions.add(session);
    await saved.attempts.add(record);
    const backup = { ...(await exportBackup(saved)), contentVersion: advancedContentVersion };
    const restored = database();
    await restoreBackup(backup, restored);
    const data = await snapshot(restored);
    expect(data.attempts).toEqual([record]);
    expect(validateBackup(JSON.stringify(await exportBackup(restored))).data).toEqual(data);
    const next = createSession('practice', [q], data.exposures, data.attempts);
    expect(isFirstSeen(q, next, data.exposures, data.attempts)).toBe(false);
    backup.data.attempts[0].questionRevision = 1;
    await expect(restoreBackup(backup, restored)).rejects.toThrow();
    expect(await snapshot(restored)).toEqual(data);
  });
  it.each(['new-question', 'new-unit', 'bad-revision', 'future-version'])(
    'rejects %s in an old backup without changing the database',
    async (kind) => {
      const db = database(),
        raw = JSON.parse(legacyText) as Backup;
      await restoreBackup(raw, db);
      const before = await snapshot(db);
      const changed = structuredClone(raw);
      if (kind === 'new-question')
        changed.data.favorites.push({
          questionId: questions.find((q) => !legacyQuestionIds.has(q.id))!.id,
        });
      if (kind === 'new-unit')
        changed.data.unitProgress.push({
          unitId: units.find((u) => u.id.startsWith('ex-'))!.id,
          rating: 2,
          note: 'invalid legacy ref',
          updatedAt: raw.createdAt,
        });
      if (kind === 'bad-revision') changed.data.attempts[0].questionRevision++;
      if (kind === 'future-version') changed.contentVersion = '2099-01-01.1';
      await expect(restoreBackup(changed, db)).rejects.toThrow();
      expect(await snapshot(db)).toEqual(before);
    },
  );
  it.each([
    'extra-order-key',
    'extra-first-seen-key',
    'outside-session-answer',
    'duplicate-answer',
    'outside-session-exposure',
    'different-order',
  ])('rejects corrupted session ledger: %s before any write', async (kind) => {
    const db = database(),
      raw = JSON.parse(legacyText) as Backup;
    await restoreBackup(raw, db);
    const before = await snapshot(db),
      changed = structuredClone(raw),
      s = changed.data.sessions[0];
    const q = questions.find((q) => q.id === 'anatomy-p-02')!;
    if (kind === 'extra-order-key') s.choiceOrders['ex-tech-001'] = ['a', 'b', 'c'];
    if (kind === 'extra-first-seen-key') s.firstSeenByQuestion['ex-tech-001'] = true;
    if (kind === 'outside-session-answer')
      Object.assign(changed.data.attempts[0], {
        questionId: q.id,
        questionRevision: q.revision,
        groupId: q.groupId,
        domainId: q.domainId,
        unitId: q.unitId,
        selectedChoiceId: q.correctChoiceId,
        correctChoiceId: q.correctChoiceId,
        choiceOrder: q.choices.map((c) => c.id),
      });
    if (kind === 'duplicate-answer')
      changed.data.attempts.push({ ...changed.data.attempts[0], id: 'another-answer-id' });
    if (kind === 'outside-session-exposure')
      Object.assign(changed.data.exposures[0], { questionId: q.id, groupId: q.groupId });
    if (kind === 'different-order') changed.data.attempts[0].choiceOrder.reverse();
    await expect(restoreBackup(changed, db)).rejects.toThrow();
    expect(await snapshot(db)).toEqual(before);
  });
  it('contains independent groups and actual original assets for every media item', () => {
    expect(new Set(questions.map((q) => q.groupId)).size).toBe(questions.length);
    const media = questions.filter((q) => q.context === 'image' || q.context === 'video');
    expect(media.length).toBe(12);
    for (const q of media) {
      expect(q.media).toBeDefined();
      const a = mediaAssets[q.media!.assetId as keyof typeof mediaAssets];
      expect(a.kind).toBe(q.media!.kind);
      if (q.context === 'video') expect(a.frames).toBeGreaterThan(1);
    }
  });
  it('does not expose draft or stale-review items through normal practice', () => {
    const q = questions.find((q) => q.pool === 'practice')!;
    const draft = { ...q, review: { ...q.review, status: 'draft' as const } };
    const stale = { ...q, revision: q.revision + 1 };
    expect(eligible(draft)).toBe(false);
    expect(eligible(stale)).toBe(false);
    expect(selectPractice([draft, stale], true, [], undefined, 10)).toHaveLength(0);
  });
});
