import { useNavigate } from 'react-router-dom';
import { useLearning } from './context';
import { createSession, selectDiagnostic, selectPractice, uniqueGroups } from '../engines/learning';
import { questions } from '../content';
import { db } from '../storage/db';
export function useStartLearning() {
  const { data, settings, run } = useLearning();
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
            const session = createSession(
              'diagnostic',
              selectDiagnostic(questions),
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
    practice: (unitId?: string, onlyFavorites = false) =>
      run(async () => {
        const unlocked = ['completed', 'skipped'].includes(settings.diagnosticStatus);
        let bank = questions;
        if (onlyFavorites)
          bank = bank.filter((q) => data.favorites.some((f) => f.questionId === q.id));
        const selected = selectPractice(bank, unlocked, data.attempts, unitId, 10);
        const session = createSession('practice', selected, data.exposures, data.attempts);
        await db.sessions.put(session);
        navigate(`/session/${session.id}`);
      }),
    review: () =>
      run(async () => {
        const due = data.reviews.filter((r) => r.dueAt <= new Date().toISOString());
        const selected = uniqueGroups(
          questions.filter((q) => due.some((r) => r.questionId === q.id)),
        ).slice(0, 10);
        const session = createSession('review', selected, data.exposures, data.attempts);
        await db.sessions.put(session);
        navigate(`/session/${session.id}`);
      }),
    skip: () =>
      run(async () => {
        await db.settings.update('main', { diagnosticStatus: 'skipped' });
        navigate('/learn');
      }),
  };
}
