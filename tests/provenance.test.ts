import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { questions, seedVideos, contentVersion } from '../src/content';
import type { Attempt, Exposure } from '../src/domain/types';
import { createSession, partitionAttempts } from '../src/engines/learning';
import {
  LearningDB,
  exportBackup,
  recordExposure,
  restoreBackup,
  tableNames,
  validateBackup,
} from '../src/storage/db';

const sample = questions.find((q) => q.pool === 'practice')!;
const before = '2026-11-04T00:00:00.000Z';
const earliest = '2026-11-04T01:00:00.000Z';
const later = '2026-11-04T02:00:00.000Z';

function attempt(id: string, patch: Partial<Attempt> = {}): Attempt {
  return {
    id,
    sessionId: `session-${id}`,
    questionId: sample.id,
    questionRevision: sample.revision,
    groupId: sample.groupId,
    domainId: sample.domainId,
    unitId: sample.unitId,
    selectedChoiceId: sample.correctChoiceId,
    correctChoiceId: sample.correctChoiceId,
    correct: true,
    firstSeen: true,
    canExplain: true,
    elapsedMs: 10000,
    choiceOrder: sample.choices.map((choice) => choice.id),
    at: earliest,
    ...patch,
  };
}
function exposure(id: string, patch: Partial<Exposure> = {}): Exposure {
  return {
    id,
    questionId: sample.id,
    groupId: sample.groupId,
    kind: 'explanation',
    sessionId: `session-${id}`,
    at: before,
    ...patch,
  };
}

describe('first-exposure provenance after backup merging', () => {
  it('counts only the earliest attempt when two devices recorded the same group as first seen', () => {
    const phone = attempt('phone', { at: earliest, correct: false });
    const pc = attempt('pc', { at: later });
    const result = partitionAttempts([pc, phone], []);
    expect(result.first.map((a) => a.id)).toEqual(['phone']);
    expect(result.repeat.map((a) => a.id)).toEqual(['pc']);
    expect(result.first).toHaveLength(1);
    expect(result.first[0].correct).toBe(false);
  });

  it('excludes an answer if an older explanation was exposed in another session', () => {
    const answer = attempt('phone');
    const priorExplanation = exposure('pc-preview');
    const result = partitionAttempts([answer], [priorExplanation]);
    expect(result.first).toEqual([]);
    expect(result.repeat).toEqual([answer]);
  });

  it('does not promote a later true flag if the earliest answer was already a repeat', () => {
    const repeatedFirst = attempt('earlier-repeat', { firstSeen: false });
    const laterClaim = attempt('later-claim', { at: later, firstSeen: true });
    const result = partitionAttempts([laterClaim, repeatedFirst], []);
    expect(result.first).toEqual([]);
    expect(new Set(result.repeat.map((a) => a.id))).toEqual(
      new Set(['earlier-repeat', 'later-claim']),
    );
  });

  it('allows the current question display but excludes a same-session explanation peek', () => {
    const answer = attempt('current');
    const ownDisplay = exposure('own-question', { sessionId: answer.sessionId, kind: 'question' });
    expect(partitionAttempts([answer], [ownDisplay]).first).toEqual([answer]);
    const ownPeek = exposure('own-explanation', {
      sessionId: answer.sessionId,
      kind: 'explanation',
    });
    expect(partitionAttempts([answer], [ownDisplay, ownPeek]).first).toEqual([]);
  });

  it('excludes earlier question displays from another session, including an alternate question in the same group', () => {
    const answer = attempt('answer');
    const alternateDisplay = exposure('alternate', {
      questionId: 'another-question-same-group',
      kind: 'question',
    });
    expect(partitionAttempts([answer], [alternateDisplay]).first).toEqual([]);
  });

  it('does not retrospectively exclude a first answer because of a later explanation', () => {
    const answer = attempt('first');
    const futureExplanation = exposure('later-session', { at: later });
    expect(partitionAttempts([answer], [futureExplanation]).first).toEqual([answer]);
  });

  it('keeps independent groups separate and does not mutate stored firstSeen declarations', () => {
    const a = attempt('group-a');
    const b = attempt('group-b', { groupId: 'independent-group-b', at: later });
    const records = [b, a];
    const displays = [exposure('a-preview')];
    const originalRecords = structuredClone(records),
      originalDisplays = structuredClone(displays);
    const result = partitionAttempts(records, displays);
    expect(result.first).toEqual([b]);
    expect(result.repeat).toEqual([a]);
    expect(records).toEqual(originalRecords);
    expect(displays).toEqual(originalDisplays);
    expect(a.firstSeen).toBe(true);
  });
});

function videoBackup() {
  const data = Object.fromEntries(tableNames.map((name) => [name, []])) as Record<
    string,
    unknown[]
  >;
  const video = structuredClone(seedVideos[0]);
  video.id = 'personal-provenance-video';
  video.content = { status: 'unreviewed', checkedAt: null, method: null, sourceRefs: [] };
  data.videoOverrides.push({ id: video.id, video });
  return {
    app: 'cpt-master',
    formatVersion: 1,
    contentVersion,
    createdAt: earliest,
    data,
  };
}

describe('personal video review provenance in imported JSON', () => {
  it('accepts a normal personal override without promoting its unreviewed content', () => {
    const parsed = validateBackup(JSON.stringify(videoBackup()));
    expect(parsed.data.videoOverrides[0].video?.content).toEqual({
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
    });
  });

  it('rejects an imported expert-review label with no review date, method or evidence', () => {
    const candidate = videoBackup();
    const override = candidate.data.videoOverrides[0] as { video: (typeof seedVideos)[number] };
    override.video.content = {
      status: 'expert_reviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
    };
    expect(() => validateBackup(JSON.stringify(candidate))).toThrow();
  });

  it('also rejects a source-checked declaration rather than trusting a personal JSON label', () => {
    const candidate = videoBackup();
    const override = candidate.data.videoOverrides[0] as { video: (typeof seedVideos)[number] };
    override.video.content = {
      status: 'source_checked',
      checkedAt: earliest,
      method: '利用者がJSONに書き込んだ内容照合済みという主張',
      sourceRefs: [{ sourceId: 'unverified-personal-source', locator: '確認できない参照箇所' }],
    };
    expect(() => validateBackup(JSON.stringify(candidate))).toThrow();
  });
});

describe('earliest exposure timestamp persistence', () => {
  let source: LearningDB;
  let target: LearningDB;

  beforeEach(() => {
    source = new LearningDB(`provenance-source-${crypto.randomUUID()}`);
    target = new LearningDB(`provenance-target-${crypto.randomUUID()}`);
  });
  afterEach(async () => {
    await Promise.all([source.delete(), target.delete()]);
  });

  it('stores a newly observed exposure with its original time', async () => {
    const firstDisplay = exposure('new-exposure');
    await recordExposure(firstDisplay, target);
    expect(await target.exposures.get(firstDisplay.id)).toEqual(firstDisplay);
    expect(await target.exposures.count()).toBe(1);
  });

  it('does not overwrite the first time when the same content is displayed again', async () => {
    const firstDisplay = exposure('repeated-exposure', { at: before });
    await recordExposure(firstDisplay, target);
    await recordExposure({ ...firstDisplay, at: later }, target);
    expect(await target.exposures.get(firstDisplay.id)).toEqual(firstDisplay);
    expect(await target.exposures.count()).toBe(1);
  });

  it('accepts an older exposure timestamp instead of preserving a newer one', async () => {
    const priorRecord = exposure('out-of-order', { at: later });
    await recordExposure(priorRecord, target);
    const olderRecord = { ...priorRecord, at: before };
    await recordExposure(olderRecord, target);
    expect(await target.exposures.get(priorRecord.id)).toEqual(olderRecord);
    expect(await target.exposures.count()).toBe(1);
  });

  it('keeps the earliest timestamp under concurrent recording attempts', async () => {
    const event = exposure('concurrent-exposure');
    await Promise.all([
      recordExposure({ ...event, at: later }, target),
      recordExposure({ ...event, at: before }, target),
      recordExposure({ ...event, at: earliest }, target),
    ]);
    expect(await target.exposures.get(event.id)).toEqual({ ...event, at: before });
    expect(await target.exposures.count()).toBe(1);
  });

  async function mergeExposureTimes(importedAt: string, localAt: string) {
    const session = createSession('practice', [sample], [], []);
    session.startedAt = before;
    await source.sessions.put(session);
    const imported = exposure(`${session.id}:${sample.id}:explanation`, {
      sessionId: session.id,
      at: importedAt,
    });
    const local = { ...imported, at: localAt };
    await recordExposure(imported, source);
    await recordExposure(local, target);
    await source.unitProgress.put({
      unitId: sample.unitId,
      rating: 1,
      note: '取り込み元のメモ',
      updatedAt: before,
    });
    await target.unitProgress.put({
      unitId: sample.unitId,
      rating: 5,
      note: 'この端末で育てたメモ',
      updatedAt: later,
    });
    await restoreBackup(await exportBackup(source), target);
    return { imported, local };
  }

  it('uses an earlier imported exposure on ID collision while preserving local notes', async () => {
    const { imported } = await mergeExposureTimes(before, later);
    expect(await target.exposures.get(imported.id)).toEqual(imported);
    expect(await target.exposures.count()).toBe(1);
    expect(await target.unitProgress.get(sample.unitId)).toMatchObject({
      rating: 5,
      note: 'この端末で育てたメモ',
    });
  });

  it('keeps an earlier local exposure when an imported copy has a later timestamp', async () => {
    const { local } = await mergeExposureTimes(later, before);
    expect(await target.exposures.get(local.id)).toEqual(local);
    expect(await target.exposures.count()).toBe(1);
  });

  it('retains the pre-answer explanation evidence needed to exclude an answer from strict first-seen scoring', async () => {
    const { imported } = await mergeExposureTimes(before, later);
    // A different device answered after the original peek but before its later redisplay.
    const otherDeviceAnswer = attempt('other-device-answer', { at: earliest });
    const history = await target.exposures.toArray();
    expect(history[0].id).toBe(imported.id);
    expect(partitionAttempts([otherDeviceAnswer], history).first).toEqual([]);
    expect(partitionAttempts([otherDeviceAnswer], history).repeat).toEqual([otherDeviceAnswer]);
  });
});
