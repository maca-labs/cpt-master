import Dexie, { type Table } from 'dexie';
import {
  createDedicatedExamSession,
  dedicatedExamPackKey,
  remainingDedicatedSeconds,
  scoreDedicatedExam,
  validateDedicatedExamPack,
  type DedicatedExamAccess,
  type DedicatedExamAction,
  type DedicatedExamPack,
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
  }

  sessionFor(pack: DedicatedExamPack) {
    this.requireEligiblePack(pack);
    return this.transaction('r', [this.sessions, this.current], () => this.readCurrent(pack));
  }

  start(pack: DedicatedExamPack) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', [this.sessions, this.current], async () => {
      const current = await this.readCurrent(pack);
      const now = this.clock();
      if (current?.status === 'active') {
        return remainingDedicatedSeconds(current, now) === 0
          ? this.complete(pack, current, 'timeout', now)
          : current;
      }
      const session = createDedicatedExamSession(pack, now);
      await this.sessions.add(session);
      await this.current.put({ packKey: session.packKey, sessionId: session.id });
      return session;
    });
  }

  update(pack: DedicatedExamPack, sessionId: string, action: DedicatedExamAction) {
    this.requireEligiblePack(pack);
    return this.transaction('rw', this.sessions, async () => {
      const session = await this.requireSession(pack, sessionId);
      if (session.status === 'completed') return session;
      const now = this.clock();
      if (remainingDedicatedSeconds(session, now) === 0)
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
      const now = this.clock();
      const expired = remainingDedicatedSeconds(session, now) === 0;
      if (!expired && reason === 'timeout') throw new Error('まだ制限時間内です。');
      return this.complete(pack, session, expired ? 'timeout' : reason, now);
    });
  }

  private async readCurrent(pack: DedicatedExamPack) {
    const pointer = await this.current.get(dedicatedExamPackKey(pack));
    return pointer ? this.sessions.get(pointer.sessionId) : undefined;
  }

  private requireEligiblePack(pack: DedicatedExamPack) {
    const issues = validateDedicatedExamPack(pack, this.access);
    if (issues.length) throw new Error(issues[0]);
  }

  private async requireSession(pack: DedicatedExamPack, sessionId: string) {
    const session = await this.sessions.get(sessionId);
    if (!session || session.packKey !== dedicatedExamPackKey(pack))
      throw new Error('この専用模試の受験記録が見つかりません。');
    return session;
  }

  private async complete(
    pack: DedicatedExamPack,
    session: DedicatedExamSession,
    reason: 'submitted' | 'timeout',
    now: number,
  ) {
    const completed: DedicatedExamSession = {
      ...session,
      status: 'completed',
      completedAt: Math.min(session.deadlineAt, Math.max(now, session.startedAt)),
      finishedReason: reason,
      result: scoreDedicatedExam(pack, session.answers),
    };
    await this.sessions.put(completed);
    return completed;
  }
}
