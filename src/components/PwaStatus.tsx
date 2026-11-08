import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Download, RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLearning } from '../app/context';
import { releasedDedicatedExams } from '../content/dedicated-exam';
import {
  canApplyPwaUpdate,
  isPwaUpdateBlocked,
  PWA_UPDATE_INTERVAL_MS,
  shouldCheckPwaUpdate,
  shouldReloadPwa,
} from '../engines/pwa';

/** Vite preview is a production bundle; the ordinary dev server never mounts
 * the registration hook or changes the browser's service-worker registration. */
export default function PwaStatus() {
  return import.meta.env.DEV ? null : <ProductionPwaStatus />;
}

function ProductionPwaStatus() {
  const { pathname } = useLocation();
  const { data } = useLearning();
  const activeDiagnostic = data.sessions.some(
    (session) => session.mode === 'diagnostic' && session.status === 'active',
  );
  const dedicatedExamOpen =
    /^\/exam\/full\/?$/.test(pathname) && releasedDedicatedExams().length > 0;
  const blocked = dedicatedExamOpen || isPwaUpdateBlocked(pathname, activeDiagnostic);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const mounted = useRef(true),
    approved = useRef(false),
    checking = useRef(false);
  const activationCleanup = useRef<(() => void) | null>(null);
  const reloading = useRef(false);
  const lastCheckedAt = useRef(0);
  const manualCheck = useRef<(() => Promise<void>) | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [workerUrl, setWorkerUrl] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [checkMessage, setCheckMessage] = useState('');
  const [controllerChanged, setControllerChanged] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [applying, setApplying] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const supported = 'serviceWorker' in navigator;

  const completeUpdate = () => {
    activationCleanup.current?.();
    if (!mounted.current || reloading.current) return;
    if (shouldReloadPwa({ approved: approved.current, blocked: blockedRef.current })) {
      reloading.current = true;
      window.location.reload();
    } else {
      approved.current = false;
      setControllerChanged(true);
      setApplying(false);
      setDismissed(false);
    }
  };
  const failUpdate = (error: unknown) => {
    activationCleanup.current?.();
    approved.current = false;
    if (!mounted.current) return;
    setRegistrationError(error instanceof Error ? error.message : String(error));
    setApplying(false);
    setAcknowledged(false);
  };

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(url, registered) {
      if (!mounted.current) return;
      setWorkerUrl(url);
      setRegistration(registered ?? null);
      setRegistrationError('');
    },
    onRegisterError(error) {
      if (!mounted.current) return;
      setRegistrationError(error instanceof Error ? error.message : String(error));
    },
    onNeedReload() {
      // An activation in another tab never grants this tab reload permission.
      completeUpdate();
    },
  });
  const available = needRefresh || controllerChanged;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      approved.current = false;
      activationCleanup.current?.();
    };
  }, []);
  useEffect(() => {
    approved.current = false;
    setAcknowledged(false);
    setDismissed(false);
  }, [pathname, available]);

  useEffect(() => {
    if (!registration || !workerUrl) return;
    let cancelled = false;
    let request: AbortController | null = null;
    const check = async (force = false) => {
      if (
        !shouldCheckPwaUpdate({
          online: navigator.onLine,
          visible: document.visibilityState === 'visible',
          installing: Boolean(registration.installing),
          waiting: Boolean(registration.waiting),
          checking: checking.current,
          now: Date.now(),
          lastCheckedAt: lastCheckedAt.current,
          force,
        })
      )
        return;
      checking.current = true;
      lastCheckedAt.current = Date.now();
      request = new AbortController();
      try {
        const response = await fetch(workerUrl, { cache: 'no-store', signal: request.signal });
        if (!response.ok) throw new Error(`更新確認: HTTP ${response.status}`);
        if (!cancelled) {
          await registration.update();
          if (!cancelled)
            setCheckMessage('更新を確認しました。更新が届くと、この画面に案内します。');
        }
      } catch (error) {
        if (!cancelled && !(error instanceof DOMException && error.name === 'AbortError')) {
          setCheckMessage(
            '更新を確認できませんでした。接続が安定してから、もう一度お試しください。',
          );
        }
      } finally {
        checking.current = false;
        request = null;
      }
    };
    manualCheck.current = () => check(true);
    const interval = window.setInterval(() => void check(), PWA_UPDATE_INTERVAL_MS);
    const resumed = () => {
      void check();
    };
    window.addEventListener('online', resumed);
    document.addEventListener('visibilitychange', resumed);
    return () => {
      cancelled = true;
      request?.abort();
      manualCheck.current = null;
      window.clearInterval(interval);
      window.removeEventListener('online', resumed);
      document.removeEventListener('visibilitychange', resumed);
    };
  }, [registration, workerUrl]);

  const applyUpdate = async () => {
    if (!canApplyPwaUpdate({ available, blocked: blockedRef.current, acknowledged, applying }))
      return;
    approved.current = true;
    setApplying(true);
    try {
      const waiting = registration?.waiting;
      if (controllerChanged || (!waiting && registration?.active)) {
        completeUpdate();
        return;
      }
      if (!waiting)
        throw new Error('更新の準備を確認できません。通信を確認して再度お試しください。');

      // On a first visit the page may still have no controller. Workbox's
      // controlling callback then need not run, even after explicit activation.
      // Observe this exact waiting worker and reload only on this tab's approval.
      activationCleanup.current?.();
      const activated = () => {
        if (waiting.state === 'activated') completeUpdate();
        else if (waiting.state === 'redundant')
          failUpdate(new Error('更新の適用を完了できませんでした。もう一度確認してください。'));
      };
      const timeout = window.setTimeout(() => {
        if (waiting.state === 'activated') completeUpdate();
        else
          failUpdate(
            new Error('更新の適用に時間がかかっています。接続を確認して再度お試しください。'),
          );
      }, 15000);
      activationCleanup.current = () => {
        window.clearTimeout(timeout);
        waiting.removeEventListener('statechange', activated);
        activationCleanup.current = null;
      };
      waiting.addEventListener('statechange', activated);
      await updateServiceWorker(true);
      activated();
    } catch (error) {
      failUpdate(error);
    }
  };

  return (
    <section
      aria-label="オフライン保存とアプリの更新"
      className="pwa-status"
      data-testid="pwa-status"
    >
      {registrationError && (
        <div className="notice" role="alert">
          <div>
            <b>アプリの保存・更新を完了できませんでした</b>
            <p>
              このタブの学習は続けられますが、新しい教材のオフライン準備は確認できていません。通信が安定してから再読み込みしてください。
            </p>
            <details>
              <summary>エラーの詳細</summary>
              <p className="small-text">{registrationError}</p>
            </details>
          </div>
          <button
            className="icon-button"
            aria-label="アプリ保存のエラー案内を閉じる"
            onClick={() => setRegistrationError('')}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {available && !dismissed && (
        <div className="notice" role="status" data-testid="pwa-update-notice">
          <div style={{ width: '100%' }}>
            <b>
              <RefreshCw size={17} /> アプリの更新を利用できます
            </b>
            <p>
              更新すると画面を再読み込みします。保存済みの学習記録は保持します。未保存のメモは、先に保存してください。
            </p>
            {blocked ? (
              <p className="small-text" data-testid="pwa-update-blocked">
                解答中の更新はできません。回答を保存して学習を中断し、演習・設定などの画面へ移動してから更新してください。
              </p>
            ) : (
              <label className="check-line">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                />
                必要な回答・メモを保存し、再読み込みしてよいことを確認しました
              </label>
            )}
            <div className="hero-actions">
              <button
                className="button small primary"
                disabled={!canApplyPwaUpdate({ available, blocked, acknowledged, applying })}
                onClick={() => void applyUpdate()}
              >
                <RefreshCw size={15} />
                {applying ? '更新中…' : '更新して再読み込み'}
              </button>
              <button
                className="button small ghost"
                disabled={applying}
                onClick={() => setDismissed(true)}
              >
                あとで
              </button>
            </div>
          </div>
        </div>
      )}
      {offlineReady && !available && (
        <div className="notice success" role="status" data-testid="pwa-offline-ready">
          <div>
            <b>
              <Check size={17} /> 教材のオフライン準備ができました
            </b>
            <p>
              保存済みの本文と問題を、通信がなくても学習できます。YouTubeの視聴には通信が必要です。
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="オフライン準備完了の案内を閉じる"
            onClick={() => setOfflineReady(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <details className="notice" style={{ display: 'block' }}>
        <summary>
          <Download size={15} /> オフライン学習・ホーム画面への追加{available ? '（更新あり）' : ''}
        </summary>
        <p className="small-text">
          最初は通信できる状態で開き、「オフライン準備ができました」の案内を確認してください。動画をダウンロードする機能はありません。
        </p>
        {!supported && (
          <p className="small-text">
            このブラウザーはアプリ内のオフライン保存機能に対応していません。
          </p>
        )}
        <ul className="plain-list small-text">
          <li>
            PC・Android：対応ブラウザーのアドレスバーまたはメニューから「アプリをインストール」などを選びます。
          </li>
          <li>
            iPhone・iPad：Safariで開き、共有メニューから「ホーム画面に追加」を選びます。表示される場合は「Webアプリとして開く」を有効にします。
          </li>
        </ul>
        <p className="small-text">
          毎時、または通信・画面の復帰時に更新を確認します。学習中に自動で再読み込みすることはありません。端末間の学習データ移動には設定画面のJSONバックアップを使ってください。
        </p>
        <div className="hero-actions">
          {available && (
            <button className="button small ghost" onClick={() => setDismissed(false)}>
              更新の案内を表示
            </button>
          )}
          <button
            className="button small ghost"
            disabled={!registration || available}
            onClick={() => void manualCheck.current?.()}
          >
            更新を確認する
          </button>
        </div>
        {checkMessage && (
          <p className="small-text" role="status">
            {checkMessage}
          </p>
        )}
      </details>
    </section>
  );
}
