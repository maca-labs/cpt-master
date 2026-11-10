import { useNavigate } from 'react-router-dom';
import { useLearning } from './context';
import { createSession, selectDiagnostic, prioritizeReview, eligible } from '../engines/learning';
import { allQuestions, practiceQuestions, questions } from '../content';
import { db, defaultSettings, recordExposure, type LearningDB } from '../storage/db';
import type { Session } from '../domain/types';
import {
  reservedStrictGroups,
  selectPracticeQuestions,
  type PracticeRequest,
} from '../engines/practice-selection';

export type PracticeResultsDisplay =
  | { status: 'ready' }
  | { status: 'stale' }
  | { status: 'reserved'; sessionIds: string[]; count: number };

/** A valid old backup may contain a completed practice with unshown items.
 * Serialize result-list exposure with strict selection before revealing it. */
export async function recordPracticeResultsDisplay(
  sessionId: string,
  database: LearningDB = db,
): Promise<PracticeResultsDisplay> {
  return database.transaction('rw', [database.sessions, database.exposures], async () => {
    const session = await database.sessions.get(sessionId);
    if (!session || session.mode === 'mock' || session.status !== 'completed')
      return { status: 'stale' };
    const selected = session.questionIds.map((id) =>
      allQuestions.find((question) => question.id === id)!,
    );
    const groups = new Set(selected.map((question) => question.groupId));
    const owners = (await database.sessions.toArray()).filter(
      (other) =>
        other.id !== sessionId &&
        other.status === 'active' &&
        other.mode === 'practice' &&
        other.practice?.selection === 'strict_unseen' &&
        other.questionIds.some((id) =>
          groups.has(allQuestions.find((question) => question.id === id)!.groupId),
        ),
    );
    if (owners.length) {
      const reserved = reservedStrictGroups(owners, questions);
      return {
        status: 'reserved',
        sessionIds: owners.map((owner) => owner.id),
        count: selected.filter((question) => reserved.has(question.groupId)).length,
      };
    }
    for (const question of selected)
      await recordExposure(
        {
          id: `${session.id}:${question.id}:question`,
          questionId: question.id,
          groupId: question.groupId,
          kind: 'question',
          sessionId: session.id,
          at: new Date().toISOString(),
        },
        database,
      );
    return { status: 'ready' };
  });
}

/** Re-read all selection inputs and reserve the selected groups in one IndexedDB
 * transaction. Stale UI snapshots cannot start two overlapping strict sessions. */
export async function startPracticeSession(
  request: PracticeRequest,
  database: LearningDB = db,
): Promise<Session> {
  return database.transaction(
    'rw',
    [
      database.sessions,
      database.settings,
      database.exposures,
      database.attempts,
      database.favorites,
    ],
    async () => {
      const settings = (await database.settings.get('main')) ?? defaultSettings;
      const history = {
        exposures: await database.exposures.toArray(),
        attempts: await database.attempts.toArray(),
        sessions: await database.sessions.toArray(),
      };
      const selected = selectPracticeQuestions(
        practiceQuestions,
        ['completed', 'skipped'].includes(settings.diagnosticStatus),
        history,
        {
          ...request,
          ...(request.onlyFavorites
            ? {
                questionIds: (await database.favorites.toArray()).map(
                  (favorite) => favorite.questionId,
                ),
              }
            : {}),
        },
      );
      if (
        request.allowSmaller &&
        request.expectedAvailableCount !== undefined &&
        selected.length !== request.expectedAvailableCount
      )
        throw new Error(
          '利用可能数が別の学習操作で変わりました。更新された在庫を確認して、もう一度開始してください。',
        );
      const session = createSession('practice', selected, history.exposures, history.attempts);
      session.practice = {
        batch: request.batch,
        selection: request.selection,
        requestedCount: request.requestedCount,
      };
      await database.sessions.add(session);
      return session;
    },
  );
}
export function useStartLearning() {
  const { run, refresh } = useLearning();
  const navigate = useNavigate();
  return {
    diagnostic: () =>
      run(async () => {
        let sessionId = '';
        await db.transaction(
          'rw',
          [db.sessions, db.settings, db.exposures, db.attempts],
          async () => {
            const active = await db.sessions
              .where('status')
              .equals('active')
              .filter((s) => s.mode === 'diagnostic')
              .first();
            if (active) {
              sessionId = active.id;
              return;
            }
            const reserved = reservedStrictGroups(await db.sessions.toArray(), questions);
            const session = createSession(
              'diagnostic',
              selectDiagnostic(questions.filter((q) => !reserved.has(q.groupId))),
              await db.exposures.toArray(),
              await db.attempts.toArray(),
            );
            await db.sessions.put(session);
            const current = await db.settings.get('main');
            if (!current || !['completed', 'skipped'].includes(current.diagnosticStatus))
              await db.settings.update('main', { diagnosticStatus: 'started' });
            sessionId = session.id;
          },
        );
        navigate(`/session/${sessionId}`);
      }),
    practice: (unitId?: string, onlyFavorites = false, options?: Partial<PracticeRequest>) =>
      run(async () => {
        let session: Session;
        try {
          session = await startPracticeSession({
            batch: 'all',
            selection: 'unseen_first',
            requestedCount: 10,
            allowSmaller: options === undefined,
            ...options,
            unitId,
            onlyFavorites,
          });
        } finally {
          await refresh();
        }
        navigate(`/session/${session.id}`);
      }),
    review: () =>
      run(async () => {
        const session = await db.transaction(
          'rw',
          [db.sessions, db.settings, db.reviews, db.attempts, db.exposures],
          async () => {
            const sessions = await db.sessions.toArray(),
              reserved = reservedStrictGroups(sessions, practiceQuestions);
            const settings = (await db.settings.get('main')) ?? defaultSettings;
            const unlocked = ['completed', 'skipped'].includes(settings.diagnosticStatus);
            const due = (await db.reviews.toArray()).filter(
              (review) => review.dueAt <= new Date().toISOString(),
            );
            const attempts = await db.attempts.toArray(),
              exposures = await db.exposures.toArray();
            const answered = new Set(attempts.map((attempt) => attempt.questionId));
            const selected = prioritizeReview(
              allQuestions.filter(
                (question) =>
                  eligible(question) &&
                  question.pool !== 'exam' &&
                  (question.pool !== 'advanced' || answered.has(question.id)) &&
                  (unlocked || question.pool !== 'diagnostic') &&
                  !reserved.has(question.groupId),
              ),
              due,
              attempts,
            );
            const created = createSession('review', selected, exposures, attempts);
            await db.sessions.add(created);
            return created;
          },
        );
        navigate(`/session/${session.id}`);
      }),
    skip: () =>
      run(async () => {
        await db.settings.update('main', { diagnosticStatus: 'skipped' });
        navigate('/learn');
      }),
  };
}
