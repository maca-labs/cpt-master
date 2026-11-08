import Dexie, { type Table } from 'dexie';
import {
  createDedicatedExamSession,
  createDedicatedMissedRetake,
  dedicatedExamPackKey,
  remainingDedicatedMilliseconds,
  scoreDedicatedExam,
  validateDedicatedExamPack,
  type DedicatedExamAccess,
  type DedicatedExamAction,
  type DedicatedExamPack,
  type DedicatedExamRetake,
  type DedicatedExamSession,
} from '../engines/dedicated-exam';

interface DedicatedExamPointer {
  packKey: string;
  sessionId: string;
}

export class DedicatedExamDB extends Dexie {
  private sessions!: Table<DedicatedExamSession, string>;
  private current!: Table<DedicatedExamPointer, string>;

  constructor(
    private readonly access: DedicatedExamAccess,
    name = access === 'preview' ? 'cpt-master-dedicated-preview' : 'cpt-master-dedicated',
    private readonly clock = () => Date.now(),
  ) {
    super(name);
    this.version(1).stores({ sessions: 'id', current: 'packKey' });
    this.version(2).stores({ sessions: 'id,retakeOf' });
  }

  sessionFor(pack: DedicatedExamPack) {
    this.requireEligiblePack(pack);
    return this.transaction('r', [this.sessions, this.current], () => this.readCurrent(pack));
  }

  sessionById(pack: DedicatedExamPack, sessionId: string) {
    this.requireEligiblePack(pack);
    return this.readSession(pack, sessionId);
  }

  missedRetakesFor(pack: DedicatedExamPack, sourceSessionId: string) {
    this.requireEligiblePack(pack);
    return this.readMissedRetakes(pack, sourceSessionId);
  }

  startMissedRetake(pack: DedicatedExamPack, sourceSessionId: string) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', this.sessions, async () => {
      const source = await this.requireSession(pack, sourceSessionId);
      if (source.status !== 'completed' || source.retakeOf)
        throw new Error('完了した専用模試から解き直しを始めてください。');
      const [latest] = await this.readMissedRetakes(pack, source.id);
      if (latest?.status === 'active') return latest;
      const retake = createDedicatedMissedRetake(
        pack,
        source,
        (latest?.retakeNumber ?? 0) + 1,
        this.clock(),
      );
      await this.sessions.add(retake);
      return retake;
    });
  }

  start(pack: DedicatedExamPack) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', [this.sessions, this.current], async () => {
      const current = await this.readCurrent(pack);
      const now = this.clock();
      if (current?.status === 'active') {
        return remainingDedicatedMilliseconds(current, now) === 0
          ? this.complete(pack, current, 'timeout', now)
          : current;
      }
      const session = createDedicatedExamSession(pack, now);
      await this.sessions.add(session);
      await this.current.put({ packKey: session.packKey, sessionId: session.id });
      return session;
    });
  }

  pause(pack: DedicatedExamPack, sessionId: string) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', this.sessions, async () => {
      const session = await this.requireSession(pack, sessionId);
      if (
        session.status === 'completed' ||
        session.deadlineAt === null ||
        session.pausedRemainingMs !== undefined
      )
        return session;
      const now = this.clock();
      const remaining = remainingDedicatedMilliseconds(session, now);
      if (!remaining) return this.complete(pack, session, 'timeout', now);
      session.pausedRemainingMs = remaining;
      await this.sessions.put(session);
      return session;
    });
  }

  resume(pack: DedicatedExamPack, sessionId: string) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', this.sessions, async () => {
      const session = await this.requireSession(pack, sessionId);
      if (session.status === 'completed' || session.pausedRemainingMs === undefined) return session;
      session.deadlineAt = this.clock() + session.pausedRemainingMs;
      delete session.pausedRemainingMs;
      await this.sessions.put(session);
      return session;
    });
  }

  update(pack: DedicatedExamPack, sessionId: string, action: DedicatedExamAction) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', this.sessions, async () => {
      const session = await this.requireSession(pack, sessionId);
      if (session.status === 'completed') return session;
      if (session.pausedRemainingMs !== undefined) throw new Error('模試を再開してください。');
      const now = this.clock();
      if (session.deadlineAt !== null && remainingDedicatedMilliseconds(session, now) === 0)
        return this.complete(pack, session, 'timeout', now);

      if (action.type === 'navigate') {
        if (
          !Number.isInteger(action.index) ||
          action.index < 0 ||
          action.index >= session.questionIds.length
        )
          throw new Error('問題番号が不正です。');
        session.index = action.index;
      } else {
        const choices = session.choiceOrders[action.questionId];
        if (!Array.isArray(choices)) throw new Error('この模試に含まれない問題です。');
        if (action.type === 'answer') {
          if (!choices.includes(action.choiceId)) throw new Error('選択肢が不正です。');
          session.answers[action.questionId] = action.choiceId;
        } else {
          const flagged = action.flagged ?? !session.flags.includes(action.questionId);
          session.flags = session.flags.filter((id) => id !== action.questionId);
          if (flagged) session.flags.push(action.questionId);
        }
      }
      await this.sessions.put(session);
      return session;
    });
  }

  finish(pack: DedicatedExamPack, sessionId: string, reason: 'submitted' | 'timeout') {
    this.requireEligiblePack(pack);
    return this.transaction('rw', this.sessions, async () => {
      const session = await this.requireSession(pack, sessionId);
      if (session.status === 'completed') return session;
      if (session.pausedRemainingMs !== undefined) {
        if (reason === 'timeout') return session;
        throw new Error('模試を再開してから提出してください。');
      }
      const now = this.clock();
      const expired =
        session.deadlineAt !== null && remainingDedicatedMilliseconds(session, now) === 0;
      if (!expired && reason === 'timeout') throw new Error('まだ制限時間内です。');
      return this.complete(pack, session, expired ? 'timeout' : reason, now);
    });
  }

  private async readCurrent(pack: DedicatedExamPack) {
    const pointer = await this.current.get(dedicatedExamPackKey(pack));
    const session = pointer ? await this.readSession(pack, pointer.sessionId) : undefined;
    return session?.deadlineAt !== null ? session : undefined;
  }

  private async readSession(pack: DedicatedExamPack, sessionId: string) {
    const session = await this.sessions.get(sessionId);
    return session?.packKey === dedicatedExamPackKey(pack) ? session : undefined;
  }

  private async readMissedRetakes(pack: DedicatedExamPack, sourceSessionId: string) {
    const packKey = dedicatedExamPackKey(pack);
    return (await this.sessions.where('retakeOf').equals(sourceSessionId).toArray())
      .filter(
        (session): session is DedicatedExamRetake =>
          session.packKey === packKey && session.deadlineAt === null,
      )
      .sort((a, b) => b.retakeNumber - a.retakeNumber);
  }

  private requireEligiblePack(pack: DedicatedExamPack) {
    const issues = validateDedicatedExamPack(pack, this.access);
    if (issues.length) throw new Error(issues[0]);
  }

  private async requireSession(pack: DedicatedExamPack, sessionId: string) {
    const session = await this.readSession(pack, sessionId);
    if (!session) throw new Error('この専用模試の受験記録が見つかりません。');
    return session;
  }

  private async complete(
    pack: DedicatedExamPack,
    session: DedicatedExamSession,
    reason: 'submitted' | 'timeout',
    now: number,
  ) {
    const end = Math.max(now, session.startedAt);
    const completed: DedicatedExamSession = {
      ...session,
      status: 'completed',
      completedAt: session.deadlineAt === null ? end : Math.min(session.deadlineAt, end),
      finishedReason: reason,
      result: scoreDedicatedExam(
        pack,
        session.answers,
        session.retakeOf ? session.questionIds : undefined,
      ),
    };
    await this.sessions.put(completed);
    return completed;
  }
}
