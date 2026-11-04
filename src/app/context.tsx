import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { db, defaultSettings, initialize, snapshot, type Snapshot } from '../storage/db';
import type { AppSettings } from '../domain/types';
import { localDay } from '../engines/learning';
interface Context {
  data: Snapshot;
  settings: AppSettings;
  refresh: () => Promise<void>;
  run: (action: () => Promise<unknown>) => Promise<void>;
  error: string;
  clearError: () => void;
}
const ctx = createContext<Context | null>(null);
export function useLearning() {
  const value = useContext(ctx);
  if (!value) throw new Error('学習データが準備できていません。');
  return value;
}
export function LearningProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Snapshot | null>(null),
    [error, setError] = useState('');
  const refresh = useCallback(async () => setData(await snapshot()), []);
  const run = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        await action();
        await refresh();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : '処理に失敗しました。保存状況を確認してください。',
        );
      }
    },
    [refresh],
  );
  useEffect(() => {
    initialize()
      .then(refresh)
      .catch((e) => setError(`保存領域を開けません：${String(e)}`));
  }, [refresh]);
  const settings = data?.settings[0] ?? defaultSettings;
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () =>
      (document.documentElement.dataset.theme =
        settings.theme === 'system' ? (media.matches ? 'dark' : 'light') : settings.theme);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [settings.theme]);
  useEffect(() => {
    let last = Date.now(),
      tick = Date.now();
    const active = () => {
      last = Date.now();
    };
    ['pointerdown', 'keydown', 'scroll'].forEach((e) =>
      window.addEventListener(e, active, { passive: true }),
    );
    const timer = setInterval(() => {
      const now = Date.now();
      const seconds = Math.min(30, Math.floor((now - tick) / 1000));
      tick = now;
      if (document.visibilityState === 'visible' && now - last < 90000 && seconds > 0)
        void db.studyEvents
          .put({
            id: crypto.randomUUID(),
            seconds,
            at: new Date().toISOString(),
            localDate: localDay(settings.timezone),
          })
          .then(refresh)
          .catch((e) => setError(String(e)));
    }, 30000);
    return () => {
      clearInterval(timer);
      ['pointerdown', 'keydown', 'scroll'].forEach((e) => window.removeEventListener(e, active));
    };
  }, [settings.timezone, refresh]);
  if (!data)
    return (
      <div className="loading">
        <b>CPT Master</b>
        <p>{error || '学習ノートを開いています…'}</p>
      </div>
    );
  return (
    <ctx.Provider value={{ data, settings, refresh, run, error, clearError: () => setError('') }}>
      {children}
    </ctx.Provider>
  );
}
