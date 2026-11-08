import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Pause, Play, Check } from 'lucide-react';
import { liveQuery } from 'dexie';
import { allQuestions, questions, units } from '../content';
import { domains } from '../content/blueprints';
import { focusMock } from '../content/focus-mock';
import type { Question, Session } from '../domain/types';
import { useLearning } from '../app/context';
import { db, recordExposure } from '../storage/db';
import {
  createMockSession,
  finishMock,
  mockAvailability,
  mockSummary,
  pauseMock,
  remainingMockSeconds,
  resumeMock,
  withMockDraft,
  availableMockBank,
  createThroughSession,
  mockComposition,
  previewComposition,
  recordMockDisplay,
  selectThrough,
  startFocusMock,
  type MockDisplay,
} from '../engines/mock';
import { partitionAttempts, rate } from '../engines/learning';
import { Empty, PageTitle, Pill } from '../components/Shared';
import { ExamReviewFilter } from '../components/ExamReviewFilter';
import { ExamVerdict, takenChoiceLabel } from '../components/ExamVerdict';
import { Explanation } from './Practice';
import './mock-review.css';

const timeText = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const mockLabels = { short: '短縮模試', through: '学習用通し演習', focus: '集中模試' };

function Composition({ counts }: { counts: ReturnType<typeof mockComposition> }) {
  return (
    <div className="notice" data-testid="through-composition">
      <b>
        開始時の出題構成：厳密な未見 {counts.unseen}問 ／ 既出 {counts.seen}問
      </b>
      <p>
        模式図 {counts.diagrams}問・アニメーション {counts.animations}問・実写写真{' '}
        {counts.realImages}問・実写映像 {counts.realVideos}問
      </p>
      <p>
        AIによる出典照合 {counts.sourceChecked}問 ／ 人間の専門家レビュー {counts.expertReviewed}
        問。媒体・審査状態は現行教材から集計します。未見は問題グループの表示・解説・解答履歴から判定します。
      </p>
    </div>
  );
}

function ReservedDisplay({ state }: { state: Extract<MockDisplay, { status: 'reserved' }> }) {
  return (
    <section className="panel" role="status">
      <h2>厳密な未見評価のため、問題の表示を保留しています</h2>
      <p>
        {state.count}
        問は後から開始した厳密な未見演習で予約されています。先に予約中の演習を完了してください。
        問題や解説を表示して未見の在庫を消費しないよう、表示履歴もまだ付けていません。
      </p>
      {state.sessionIds.map((id, index) => (
        <Link key={id} className="button secondary" to={`/session/${id}`}>
          予約中の未見評価を再開する{state.sessionIds.length > 1 ? `（${index + 1}）` : ''}
        </Link>
      ))}
    </section>
  );
}

export default function MockExamHome() {
  const { data, settings, run } = useLearning();
  const [count, setCount] = useState<10 | 20 | 50>(20);
  const [timeMode, setTimeMode] = useState<'study' | 'continuous'>('study');
  const [busy, setBusy] = useState(false);
  const [throughPreview, setThroughPreview] = useState<Question[] | null>(null);
  const activeFocus = data.sessions.find(
    (s) => s.status === 'active' && s.mock?.format === 'focus',
  );
  const lock = useRef(false),
    navigate = useNavigate();
  const unlocked = ['completed', 'skipped'].includes(settings.diagnosticStatus);
  const pool = availableMockBank(questions, data.sessions);
  const available = mockAvailability(pool, count, unlocked);
  const missing = available.reduce((sum, row) => sum + row.missing, 0);
  const throughAvailable = mockAvailability(pool, 155, unlocked);
  const throughMissing = throughAvailable.reduce((sum, row) => sum + row.missing, 0);
  const reserved = new Set(
    questions.filter((q) => !pool.some((item) => item.id === q.id)).map((q) => q.groupId),
  ).size;
  const start = async () => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await run(async () => {
        const session = await db.transaction(
          'rw',
          [db.sessions, db.settings, db.exposures, db.attempts],
          async () => {
            const current = await db.settings.get('main');
            const session = createMockSession(
              availableMockBank(questions, await db.sessions.toArray()),
              count,
              ['completed', 'skipped'].includes(current?.diagnosticStatus ?? 'not_started'),
              timeMode,
              await db.exposures.toArray(),
              await db.attempts.toArray(),
            );
            await db.sessions.add(session);
            return session;
          },
        );
        navigate(`/exam/${session.id}`);
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const startThrough = async () => {
    if (lock.current || !throughPreview) return;
    lock.current = true;
    setBusy(true);
    const previewCounts = previewComposition(throughPreview, data.exposures, data.attempts);
    try {
      await run(async () => {
        const session = await db.transaction(
          'rw',
          [db.sessions, db.settings, db.exposures, db.attempts],
          async () => {
            const [settings, sessions, exposures, attempts] = await Promise.all([
              db.settings.get('main'),
              db.sessions.toArray(),
              db.exposures.toArray(),
              db.attempts.toArray(),
            ]);
            const freshCounts = previewComposition(throughPreview, exposures, attempts);
            if (freshCounts.unseen !== previewCounts.unseen)
              throw new Error('既出状況が変わりました。出題構成を更新して確認してください。');
            const session = createThroughSession(
              questions,
              ['completed', 'skipped'].includes(settings?.diagnosticStatus ?? 'not_started'),
              exposures,
              attempts,
              sessions,
              new Date(),
              Math.random,
              throughPreview.map((q) => q.id),
            );
            await db.sessions.add(session);
            return session;
          },
        );
        navigate(`/exam/${session.id}`);
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="PRACTICE THE WHOLE FLOW"
        title="問題に向き合い、時間配分も練習する。"
        description="見直しと時間配分を練習し、次に学ぶ単元を見つけましょう。"
      />
      <section className="panel" id="dedicated-mock">
        <h2>専用模試 · 155問・180分 × 3セット</h2>
        <p>
          通常学習とは別の専用問題です。各セットは採点対象140問と採点対象外15問で、
          中断中も時計は進みます。
        </p>
        <p className="muted small-text">
          AIによる出典照合済みです。人間の専門家レビューは未実施です。
        </p>
        <Link className="button primary" to="/exam/full">
          専用模試のセットを選ぶ
          <ArrowRight size={16} />
        </Link>
      </section>
      <section className="panel" id="focus-mock">
        <Pill tone="green">学習用の新規ケース問題</Pill>
        <h2>{focusMock.title}</h2>
        <p>
          計画10問と安全管理10問で、若年者・高齢者、妊娠期、代謝疾患、関節の条件、
          緊急計画、成人救命、暑熱・頭部衝撃などの場面を扱います。
        </p>
        <p>
          3択・全{focusMock.questionCount}問。制限時間は{timeText(focusMock.limitSeconds)}で、
          保存して中断すると時計も停止します。全問を採点し、未回答も分母に含めます。
          解説と出典は採点後に確認できます。
        </p>
        <p className="muted small-text">
          AIによる出典照合済みの固定セットです。再挑戦では同じ問題を、問題順と選択肢順を変えて出題します。
        </p>
        {activeFocus ? (
          <Link className="button primary" to={`/exam/${activeFocus.id}`}>
            集中模試を再開
          </Link>
        ) : (
          <button
            className="button primary"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                const session = await startFocusMock();
                navigate(`/exam/${session.id}`);
              })
            }
          >
            集中模試20問を始める <ArrowRight size={16} />
          </button>
        )}
      </section>
      <section className="panel">
        <Pill tone="amber">学習用の短縮模試 · AIによる出典照合済み問題</Pill>
        <h2>10・20・50問の短縮模試</h2>
        <p>
          既存の学習問題を使います。人間の専門家レビューは未実施です。3択・単一正答で、採点するまで正答・解説を表示しません。公式換算スコアや合否判定は行いません。
        </p>
        <div className="two-columns">
          <label className="field-label">
            問題数
            <select
              aria-label="短縮模試の問題数"
              value={count}
              onChange={(event) => setCount(Number(event.target.value) as 10 | 20 | 50)}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}問
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            時間の扱い
            <select
              aria-label="短縮模試の時間モード"
              value={timeMode}
              onChange={(event) => setTimeMode(event.target.value as typeof timeMode)}
            >
              <option value="study">学習用：一時停止できる</option>
              <option value="continuous">時間配分練習：中断中も時間が進む</option>
            </select>
          </label>
        </div>
        <p>
          制限時間の目安 {timeText(count * 70)}（1問70秒の独自設定）。
          {timeMode === 'study'
            ? '保存して中断すると時計も停止します。'
            : 'タブを閉じても時計は進み、期限を過ぎた再開時に自動採点します。'}
        </p>
        {!unlocked && (
          <div className="notice">
            初回診断用の50問は保留しています。短縮模試には通常演習用の問題だけを使います。
          </div>
        )}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>分野</th>
                <th>今回の配分</th>
                <th>照合済み候補</th>
                <th>不足</th>
              </tr>
            </thead>
            <tbody>
              {available.map((row) => (
                <tr key={row.id}>
                  <td>{domains[row.id].short}</td>
                  <td>{row.needed}問</td>
                  <td>{row.available}問</td>
                  <td>{row.missing}問</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small-text">
          日本向け設定の整数配分32・45・43・20を基準に、最大剰余方式で配分します。同じ問題グループを重複して出題しません。
        </p>
        {missing > 0 && (
          <p role="status">
            この配分では照合済みの問題が{missing}
            問不足しています。問題数を減らすか、診断を完了・スキップしてから始めてください。
          </p>
        )}
        <button
          className="button primary"
          disabled={missing > 0 || busy}
          onClick={() => void start()}
        >
          {count}問の短縮模試を始める
          <ArrowRight size={16} />
        </button>
      </section>
      <section className="panel" id="through-practice">
        <Pill tone="amber">時間配分の練習用・既出問題を含む</Pill>
        <h2>155問・180分の学習用通し演習</h2>
        <p>
          通常学習の{questions.length}
          問から、セッション内で同じ問題グループを重複せず選びます。専用模試や初見専用の評価ではありません。中断・タブを閉じている間も時計が進みます。
        </p>
        <p>
          学習用配分は面談・評価35問、計画50問、技術48問、安全22問。整数32・45・43・20の比を155問へ最大剰余方式で配分します。
          <b>全155問を採点し、未回答も分母に含めます。</b>
          本試験の採点対象140問＋採点対象外15問の方式は再現しません。
        </p>
        <p className="muted small-text">
          AIによる出典照合済みの通常問題を使う時間配分練習です。公式換算スコア、合格確率、合否判定は算出しません。
        </p>
        {!unlocked && (
          <p className="notice">
            初回診断50問は保留し、通常演習用
            {questions.filter((question) => question.pool === 'practice').length}問から選びます。
          </p>
        )}
        {reserved > 0 && (
          <p className="notice">
            厳密な未見演習が予約している{reserved}
            問題グループは除外しています。予約済みの演習は問題演習画面から再開できます。
          </p>
        )}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>分野</th>
                <th>学習用配分</th>
                <th>利用可能</th>
                <th>不足</th>
              </tr>
            </thead>
            <tbody>
              {throughAvailable.map((row) => (
                <tr key={row.id}>
                  <td>{domains[row.id].short}</td>
                  <td>{row.needed}問</td>
                  <td>{row.available}問</td>
                  <td>{row.missing}問</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {throughMissing > 0 && (
          <p role="status">
            この配分では{throughMissing}
            問不足しています。予約中の演習を再開するか、診断の完了・スキップを確認してください。既出や専用問題で不足を補いません。
          </p>
        )}
        <button
          className="button secondary"
          disabled={throughMissing > 0 || busy}
          onClick={() =>
            void run(async () =>
              setThroughPreview(selectThrough(questions, unlocked, data.sessions)),
            )
          }
        >
          {throughPreview ? '出題構成を更新する' : '出題構成を確認する'}
        </button>
        {throughPreview && (
          <>
            <Composition
              counts={previewComposition(throughPreview, data.exposures, data.attempts)}
            />
            <button
              className="button primary"
              disabled={throughMissing > 0 || busy}
              onClick={() => void startThrough()}
            >
              155問の学習用通し演習を始める
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </section>
      {data.sessions.some((s) => s.mode === 'mock' && s.status === 'active') && (
        <section className="panel">
          <h2>
            {activeFocus
              ? '中断中の模試・演習'
              : data.sessions.some((s) => s.status === 'active' && s.mock?.format === 'through')
                ? '中断中の短縮模試・通し演習'
                : '中断中の短縮模試'}
          </h2>
          {data.sessions
            .filter((s) => s.mode === 'mock' && s.status === 'active')
            .map((s) => (
              <Link key={s.id} className="list-row" to={`/exam/${s.id}`}>
                <span>
                  {mockLabels[s.mock?.format ?? 'short']} · {s.questionIds.length}問 ·{' '}
                  {s.mock?.paused ? '一時停止中' : '進行中'} · 回答{' '}
                  {Object.keys(s.mock?.draftAnswers ?? {}).length}問
                </span>
                <span>
                  再開する
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
        </section>
      )}
      <section className="panel">
        <h2>
          {data.sessions.some((s) => s.status === 'completed' && s.mock?.format === 'focus')
            ? 'これまでの模試・演習'
            : data.sessions.some((s) => s.status === 'completed' && s.mock?.format === 'through')
              ? 'これまでの短縮模試・通し演習'
              : 'これまでの短縮模試'}
        </h2>
        {data.sessions
          .filter((s) => s.mode === 'mock' && s.status === 'completed')
          .reverse()
          .map((s) => (
            <Link key={s.id} className="list-row" to={`/exam-results/${s.id}`}>
              <span>
                {new Date(s.startedAt).toLocaleString('ja-JP')} ·{' '}
                {mockLabels[s.mock?.format ?? 'short']} · {s.questionIds.length}問
              </span>
              <b>{mockSummary(s, data.attempts).rate}%</b>
            </Link>
          ))}
        {!data.sessions.some((s) => s.mode === 'mock' && s.status === 'completed') && (
          <p className="muted">完了した模試と通し演習はここに残ります。</p>
        )}
      </section>
    </>
  );
}

export function MockExamSession() {
  const { id } = useParams(),
    { data, run } = useLearning(),
    navigate = useNavigate();
  const [observedSession, setObservedSession] = useState<Session>();
  useEffect(() => {
    if (!id) return;
    const subscription = liveQuery(() => db.sessions.get(id)).subscribe({
      next: setObservedSession,
      error: () => setObservedSession(undefined),
    });
    return () => subscription.unsubscribe();
  }, [id]);
  const session =
    observedSession?.id === id && observedSession?.mode === 'mock'
      ? observedSession
      : data.sessions.find((s) => s.id === id && s.mode === 'mock');
  const isThrough = session?.mock?.format === 'through';
  const label = mockLabels[session?.mock?.format ?? 'short'];
  const question = allQuestions.find((q) => q.id === session?.questionIds[session.index]);
  const savedDraft = question && session?.mock?.draftAnswers[question.id];
  const [now, setNow] = useState(() => Date.now()),
    [selected, setSelected] = useState(''),
    [canExplain, setCanExplain] = useState(false),
    [busy, setBusy] = useState(false),
    [showReview, setShowReview] = useState(false),
    [confirm, setConfirm] = useState(false),
    [notice, setNotice] = useState('');
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [displayState, setDisplayState] = useState<MockDisplay>({ status: 'stale' });
  const reservations = data.sessions
    .filter((s) => s.status === 'active' && s.practice?.selection === 'strict_unseen')
    .map((s) => `${s.id}:${s.questionIds.join(',')}`)
    .join('|');
  const began = useRef(Date.now()),
    lock = useRef(false),
    finishing = useRef(false);
  const remaining = session?.mock ? remainingMockSeconds(session, new Date(now)) : 0;
  const finish = async (reason: 'submitted' | 'timeout') => {
    if (!id || finishing.current) return;
    finishing.current = true;
    setBusy(true);
    try {
      await run(async () => {
        await finishMock(id, reason);
        navigate(`/exam-results/${id}`);
      });
    } finally {
      finishing.current = false;
      setBusy(false);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    setSelected(savedDraft?.choiceId ?? '');
    setCanExplain(savedDraft?.canExplain ?? false);
  }, [
    question?.id,
    session?.id,
    session?.mock?.paused,
    savedDraft?.choiceId,
    savedDraft?.canExplain,
  ]);
  useEffect(() => {
    let cancelled = false;
    setDisplayState({ status: 'stale' });
    setNotice('');
    began.current = Date.now();
    if (question && session?.status === 'active' && !session.mock?.paused)
      void run(async () => {
        const result = await recordMockDisplay(session.id, [question.id]);
        if (!cancelled) {
          setDisplayState(result);
          if (result.status === 'ready') setDisplayedQuestion(`${session.id}:${question.id}`);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [question?.id, session?.id, session?.status, session?.mock?.paused, reservations]);
  useEffect(() => {
    if (session?.status === 'active' && session.mock && !session.mock.paused && remaining === 0)
      void finish('timeout');
  }, [session?.id, session?.status, session?.mock?.paused, remaining]);
  const update = async (change: (fresh: Session) => Session, after?: () => void) => {
    if (!id || lock.current || finishing.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await run(async () => {
        await db.transaction('rw', db.sessions, async () => {
          const fresh = await db.sessions.get(id);
          if (!fresh || fresh.status !== 'active' || !fresh.mock)
            throw new Error('模試はすでに終了しています。');
          await db.sessions.put(change(fresh));
        });
        began.current = Date.now();
        after?.();
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const saveChoice = (choice: string, explain = canExplain) => {
    if (!question) return;
    return update(
      (fresh) => {
        if (fresh.questionIds[fresh.index] !== question.id)
          throw new Error('別のタブで問題が切り替わりました。表示中の問題を確認してください。');
        return withMockDraft(fresh, question, choice, explain, Date.now() - began.current);
      },
      () => {
        setSelected(choice);
        setCanExplain(explain);
        setNotice('下書きを保存しました。採点は終了時に行います。');
      },
    );
  };
  const move = (index: number) =>
    update(
      (fresh) => ({ ...fresh, index }),
      () => {
        setShowReview(false);
        setConfirm(false);
      },
    );
  const interrupt = () =>
    update(
      (fresh) => (fresh.mock!.timeMode === 'study' ? pauseMock(fresh) : fresh),
      () => navigate('/exam'),
    );
  if (!session?.mock || !question)
    return (
      <Empty title="短縮模試が見つかりません" body="短縮模試の一覧から選んでください。">
        <Link to="/exam">模試一覧へ</Link>
      </Empty>
    );
  if (session.status === 'completed')
    return (
      <Empty
        title={isThrough ? 'この通し演習は完了しました' : `この${label}は完了しました`}
        body="結果から復習する単元を確認できます。"
      >
        <Link className="button primary" to={`/exam-results/${session.id}`}>
          結果を見る
        </Link>
      </Empty>
    );
  const state = session.mock,
    answered = Object.keys(state.draftAnswers).length;
  return (
    <>
      <div className="quiz-top">
        <button className="text-button" disabled={busy} onClick={() => void interrupt()}>
          <ArrowLeft size={15} />
          保存して中断
        </button>
        <Pill>
          {label} · {session.index + 1} / {session.questionIds.length}
        </Pill>
        <strong role="timer" aria-label={`${label}の残り時間`}>
          残り {timeText(remaining)}
          {state.paused ? ' · 停止中' : ''}
        </strong>
      </div>
      <p className="muted small-text">
        {isThrough && '155問・180分の時間配分練習。既出問題を含み、全155問を学習上採点します。'}
        {state.timeMode === 'study'
          ? '学習用：一時停止できます。'
          : '時間配分練習：中断中も時間は進みます。'}{' '}
        · AIによる出典照合済み問題 · 下書き回答 {answered}問
      </p>
      <div className="hero-actions">
        <button className="button small secondary" onClick={() => setShowReview(!showReview)}>
          解答を見直す
        </button>
        {state.timeMode === 'study' && !state.paused && (
          <button
            className="button small ghost"
            disabled={busy}
            onClick={() => void update((fresh) => pauseMock(fresh))}
          >
            <Pause size={15} />
            一時停止
          </button>
        )}
        <button
          className="button small primary"
          disabled={busy}
          onClick={() => {
            setConfirm(true);
            setShowReview(true);
          }}
        >
          採点して終了
        </button>
      </div>
      {showReview && (
        <section className="panel">
          <h2>解答の見直し</h2>
          <p>
            回答済み {answered}問 · 未回答 {session.questionIds.length - answered}問 · フラグ{' '}
            {state.flags.length}問
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(64px,1fr))',
              gap: 8,
            }}
          >
            {session.questionIds.map((qid, index) => (
              <button
                key={qid}
                className={`button small ${session.index === index ? 'primary' : 'secondary'}`}
                disabled={busy}
                aria-label={`${index + 1}問目 ${state.draftAnswers[qid] ? '回答済み' : '未回答'}${state.flags.includes(qid) ? ' フラグ付き' : ''}`}
                onClick={() => void move(index)}
              >
                {index + 1}
                {state.draftAnswers[qid] ? ' ✓' : ' —'}
                {state.flags.includes(qid) ? ' ⚑' : ''}
              </button>
            ))}
          </div>
        </section>
      )}
      {confirm && (
        <section className="panel" role="dialog" aria-label={`${label}の提出確認`}>
          <h2>この内容で採点しますか？</h2>
          <p>
            未回答 {session.questionIds.length - answered}
            問も分母に含めます。提出後に解説を確認できます。
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              disabled={busy}
              onClick={() => void finish('submitted')}
            >
              この内容で採点する
            </button>
            <button className="button ghost" onClick={() => setConfirm(false)}>
              見直しに戻る
            </button>
          </div>
        </section>
      )}
      {state.paused ? (
        <section className="panel">
          <h1>{label}を一時停止しています</h1>
          <p>回答・フラグ・残り時間を保存しました。</p>
          <button
            className="button primary"
            disabled={busy || remaining === 0}
            onClick={() => void update((fresh) => resumeMock(fresh))}
          >
            <Play size={16} />
            模試を再開する
          </button>
          {remaining === 0 && (
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void finish('timeout')}
            >
              時間切れの結果を見る
            </button>
          )}
        </section>
      ) : displayState.status === 'reserved' ? (
        <ReservedDisplay state={displayState} />
      ) : displayedQuestion !== `${session.id}:${question.id}` ||
        displayState.status !== 'ready' ? (
        <section className="panel">
          <p role="status">表示履歴を保存して問題を準備しています…</p>
        </section>
      ) : (
        <section className="panel quiz-card">
          <div className="question-meta">
            <Pill>{domains[question.domainId].short}</Pill>
            <button
              className="button small ghost"
              aria-pressed={state.flags.includes(question.id)}
              disabled={busy}
              onClick={() =>
                void update((fresh) => ({
                  ...fresh,
                  mock: {
                    ...fresh.mock!,
                    flags: fresh.mock!.flags.includes(question.id)
                      ? fresh.mock!.flags.filter((qid) => qid !== question.id)
                      : [...fresh.mock!.flags, question.id],
                  },
                }))
              }
            >
              <Flag size={15} />
              {state.flags.includes(question.id) ? 'フラグを解除' : 'フラグを付ける'}
            </button>
          </div>
          <small className="eyebrow">QUESTION {String(session.index + 1).padStart(2, '0')}</small>
          <h1>{question.prompt}</h1>
          <QuestionMedia question={question} />
          <div className="choices">
            {session.choiceOrders[question.id].map((choiceId, index) => {
              const choice = question.choices.find((item) => item.id === choiceId)!;
              return (
                <button
                  key={choiceId}
                  className={`choice ${selected === choiceId ? 'selected' : ''}`}
                  aria-pressed={selected === choiceId}
                  disabled={busy}
                  onClick={() => void saveChoice(choiceId)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {choice.text}
                  {selected === choiceId && <Check size={17} />}
                </button>
              );
            })}
          </div>
          <label className="check-line">
            <input
              type="checkbox"
              checked={canExplain}
              disabled={busy}
              onChange={(event) => {
                if (selected) void saveChoice(selected, event.target.checked);
                else setCanExplain(event.target.checked);
              }}
            />
            この答えの根拠を説明できる
          </label>
          <p className="muted small-text">
            選択は自動保存します。根拠が曖昧な正解も復習対象です。採点前に正答・解説は表示しません。
          </p>
          {notice && <p role="status">{notice}</p>}
          <div className="question-footer">
            <button
              className="button secondary"
              disabled={busy || session.index === 0}
              onClick={() => void move(session.index - 1)}
            >
              前の問題へ
            </button>
            <small>{question.id}</small>
            <button
              className="button primary"
              disabled={busy || session.index === session.questionIds.length - 1}
              onClick={() => void move(session.index + 1)}
            >
              次の問題へ
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export function MockExamResults() {
  const { id } = useParams(),
    { data, run } = useLearning();
  const session = data.sessions.find(
    (s) => s.id === id && s.mode === 'mock' && s.status === 'completed',
  );
  const [opened, setOpened] = useState<{ sessionId: string; questionId: string }>();
  const [filteredSession, setFilteredSession] = useState<string>();
  const summaryFilter = useRef<HTMLButtonElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const reviewPending = useRef(false);
  const [recordedSession, setRecordedSession] = useState('');
  const [displayState, setDisplayState] = useState<MockDisplay>({ status: 'stale' });
  const reservations = data.sessions
    .filter((s) => s.status === 'active' && s.practice?.selection === 'strict_unseen')
    .map((s) => `${s.id}:${s.questionIds.join(',')}`)
    .join('|');
  useEffect(() => {
    if (!session?.mock) return;
    let cancelled = false;
    setDisplayState({ status: 'stale' });
    void run(async () => {
      const result = await recordMockDisplay(session.id, session.questionIds);
      if (!cancelled) {
        setDisplayState(result);
        if (result.status === 'ready') setRecordedSession(session.id);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [session?.id, reservations]);
  useEffect(() => {
    if (opened?.sessionId !== session?.id) return;
    const heading = reviewHeading.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start' });
  }, [opened, session?.id]);
  if (!session?.mock)
    return (
      <Empty title="完了した短縮模試がありません" body="短縮模試を採点すると結果が残ります。">
        <Link to="/exam">短縮模試へ</Link>
      </Empty>
    );
  const result = mockSummary(session, data.attempts);
  const isThrough = session.mock.format === 'through';
  const questionOrder = session.questionIds.map((qid) => allQuestions.find((q) => q.id === qid)!);
  const composition = mockComposition(questionOrder, session.firstSeenByQuestion);
  const records = data.attempts.filter((a) => a.sessionId === session.id);
  const rows = questionOrder.map((question, index) => ({
    index,
    question,
    answer: records.find((attempt) => attempt.questionId === question.id),
  }));
  const canReview = recordedSession === session.id && displayState.status === 'ready';
  const openedIndex =
    opened?.sessionId === session.id ? session.questionIds.indexOf(opened.questionId) : -1;
  const onlyMissed = filteredSession === session.id;
  const missedRows = rows.filter(({ answer }) => !answer?.correct);
  const reviewRows = onlyMissed ? missedRows : rows;
  const reviewIndex = reviewRows.findIndex(({ index }) => index === openedIndex);
  const current = canReview ? reviewRows[reviewIndex] : undefined;
  const previousReview = reviewRows[reviewIndex - 1];
  const nextReview = reviewRows[reviewIndex + 1];
  const reviewStart =
    current ??
    reviewRows.find(({ answer }) => answer?.correct === false) ??
    missedRows[0] ??
    reviewRows[0];

  function toggleReviewFilter() {
    if (!session || reviewPending.current) return;
    setFilteredSession(onlyMissed ? undefined : session.id);
    if (onlyMissed || !current?.answer?.correct) return;

    const replacement = missedRows.find(({ index }) => index > openedIndex) ?? missedRows[0];
    if (replacement) {
      openReview(replacement.index);
    } else {
      setOpened(undefined);
      summaryFilter.current?.focus();
    }
  }

  function openReview(index: number) {
    const row = rows[index];
    if (!session || !canReview || !row || reviewPending.current) return;
    const { question } = row;
    const selection = { sessionId: session.id, questionId: question.id };
    if (openedIndex === index) {
      setOpened(selection);
      return;
    }
    reviewPending.current = true;
    void run(async () => {
      try {
        await recordExposure({
          id: session.id + ':' + question.id + ':explanation',
          questionId: question.id,
          groupId: question.groupId,
          kind: 'explanation',
          sessionId: session.id,
          at: new Date().toISOString(),
        });
        setOpened(selection);
      } finally {
        reviewPending.current = false;
      }
    });
  }
  const first = partitionAttempts(data.attempts, data.exposures).first.filter(
    (a) => a.sessionId === session.id,
  );
  const previous = data.sessions
    .filter(
      (s) =>
        s.mode === 'mock' &&
        s.status === 'completed' &&
        s.id !== session.id &&
        (s.completedAt ?? '') < (session.completedAt ?? '') &&
        s.mock?.format === session.mock?.format &&
        s.questionIds.length === session.questionIds.length,
    )
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 5);
  return (
    <>
      <PageTitle
        eyebrow={isThrough ? 'TIMED LEARNING RESULTS' : 'SHORT MOCK RESULTS'}
        title={`${mockLabels[session.mock.format]}の結果`}
        description="今回の学習上の正答率です。公式換算スコア・合否・合格確率は算出しません。"
      >
        {canReview && (
          <div className="mock-review-summary-actions">
            <button
              className="button primary"
              type="button"
              disabled={!reviewStart}
              onClick={() => reviewStart && openReview(reviewStart.index)}
            >
              解答・解説を見る
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <ExamReviewFilter
              onlyMissed={onlyMissed}
              onToggle={toggleReviewFilter}
              buttonRef={summaryFilter}
            />
            <div className="mock-review-summary-status" role="status">
              <p>
                表示対象 {reviewRows.length} / {rows.length} 問
              </p>
              {onlyMissed && reviewRows.length === 0 && <p>不正解・未回答の問題はありません。</p>}
            </div>
          </div>
        )}
      </PageTitle>
      {session.mock.format === 'focus' && (
        <p className="notice">{focusMock.title}。計画10問と安全管理10問の学習結果です。</p>
      )}
      {isThrough && (
        <>
          <p className="notice">
            時間配分の練習用・既出問題を含む演習です。全155問を採点し、未回答も分母に含めます。本試験の140問採点＋15問採点外の方式や、専用模試を再現したものではありません。
          </p>
          <Composition counts={composition} />
          <p className="muted small-text">
            上の未見件数は開始時の在庫です。回答前に別の演習・解説を見た場合等は、下の厳密な初見回答から除外します。
          </p>
        </>
      )}
      <div className="notice">
        {session.mock.finishedReason === 'timeout'
          ? '制限時間に達したため自動採点しました。'
          : '提出した回答を採点しました。'}{' '}
        · {session.questionIds.length}問 ·{' '}
        {session.mock.timeMode === 'study' ? '一時停止できる学習用' : '時間が進み続ける練習用'} ·
        AIによる出典照合済み問題
      </div>
      <div className="result-stats">
        <div>
          <span>正答率（未回答を含む）</span>
          <b>
            {result.rate}
            <small>%</small>
          </b>
          <p>
            {result.correct} / {result.total}問 正解
          </p>
        </div>
        <div>
          <span>回答済み / 未回答</span>
          <b>
            {result.answered}
            <small> / {result.unanswered}問</small>
          </b>
          <p>未回答も採点分母に含みます。</p>
        </div>
        <div>
          <span>厳密な初見の回答</span>
          <b>
            {rate(first) ?? '—'}
            <small>{first.length ? '%' : ''}</small>
          </b>
          <p>
            初見 {first.length}問 · 解き直し {records.length - first.length}問
          </p>
        </div>
      </div>
      {current && (
        <section
          className="panel mock-review"
          id="mock-answer-review"
          aria-labelledby="mock-answer-review-heading"
        >
          <div className="mock-review-toolbar">
            <div>
              <h2
                id="mock-answer-review-heading"
                ref={reviewHeading}
                tabIndex={-1}
                aria-describedby="mock-answer-review-verdict"
              >
                第{openedIndex + 1}問の解答・解説
              </h2>
              <span id="mock-answer-review-verdict">
                <ExamVerdict
                  status={
                    current.answer
                      ? current.answer.correct
                        ? 'correct'
                        : 'incorrect'
                      : 'unanswered'
                  }
                />
              </span>
            </div>
            <div className="mock-review-navigation" role="group" aria-label="解説の移動">
              <button
                type="button"
                className="button secondary"
                disabled={!previousReview}
                onClick={() => previousReview && openReview(previousReview.index)}
              >
                <ArrowLeft size={16} aria-hidden="true" /> 前の解説
              </button>
              <button
                type="button"
                className="button secondary"
                disabled={!nextReview}
                onClick={() => nextReview && openReview(nextReview.index)}
              >
                次の解説 <ArrowRight size={16} aria-hidden="true" />
              </button>
              <ExamReviewFilter onlyMissed={onlyMissed} onToggle={toggleReviewFilter} />
            </div>
          </div>
          <dl className="mock-review-answers">
            <div>
              <dt>あなたの回答</dt>
              <dd>
                {current.answer
                  ? takenChoiceLabel(
                      current.question,
                      current.answer.choiceOrder,
                      current.answer.selectedChoiceId,
                    )
                  : '未回答'}
              </dd>
            </div>
            <div>
              <dt>正答</dt>
              <dd>
                {takenChoiceLabel(
                  current.question,
                  current.answer?.choiceOrder ?? session.choiceOrders[current.question.id] ?? [],
                  current.question.correctChoiceId,
                )}
              </dd>
            </div>
          </dl>
          {current.answer && current.answer.questionRevision !== current.question.revision && (
            <p className="muted small-text">
              正誤は受験時の記録です。選択肢の文面と解説は現在の問題に基づきます。
            </p>
          )}
          <details key={current.question.id + '-prompt'} className="mock-review-media">
            <summary>{current.question.media ? '問題文・図・映像を見る' : '問題文を見る'}</summary>
            <p className="mock-review-prompt">{current.question.prompt}</p>
            {current.question.media && <QuestionMedia question={current.question} />}
          </details>
          <Explanation
            key={current.question.id + '-explanation'}
            questionId={current.question.id}
            sessionId={session.id}
            showMedia={false}
            showCorrectAnswer={false}
          />
        </section>
      )}
      <section className="panel">
        <h2>分野別の結果</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>分野</th>
                <th>正解 / 全問</th>
                <th>未回答</th>
                <th>正答率</th>
              </tr>
            </thead>
            <tbody>
              {result.domains
                .filter((row) => row.total > 0)
                .map((row) => (
                  <tr key={row.id}>
                    <td>{domains[row.id].short}</td>
                    <td>
                      {row.correct} / {row.total}
                    </td>
                    <td>{row.total - row.answered}</td>
                    <td>{row.rate ?? '—'}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel" hidden={canReview && reviewRows.length === 0}>
        <h2>解答と次に学ぶ単元</h2>
        {displayState.status === 'reserved' && <ReservedDisplay state={displayState} />}
        {displayState.status === 'stale' && (
          <p role="status">表示履歴を保存して解答一覧を準備しています…</p>
        )}
        {canReview &&
          reviewRows.map(({ index, question: q, answer }) => (
            <div className="result-question" key={q.id}>
              <button
                type="button"
                className="result-question-button mock-review-row"
                aria-controls={current ? 'mock-answer-review' : undefined}
                aria-current={index === openedIndex ? 'true' : undefined}
                onClick={() => openReview(index)}
              >
                <span className="mock-review-row-meta">
                  <span>第{index + 1}問</span>
                  <ExamVerdict
                    status={answer ? (answer.correct ? 'correct' : 'incorrect') : 'unanswered'}
                  />
                  {session.mock!.flags.includes(q.id) && <span>フラグ付き</span>}
                </span>
                <span className="mock-review-row-prompt">{q.prompt}</span>
              </button>
              {(!answer?.correct || !answer?.canExplain) && (
                <Link className="text-link" to={`/learn/${q.unitId}`}>
                  {units.find((u) => u.id === q.unitId)?.title}・関連動画へ
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          ))}
      </section>
      {previous.length > 0 && (
        <section className="panel">
          <h2>同じ問題数の過去結果と比べる</h2>
          <p className="muted small-text">
            問題・既出状況・時間モードが異なるため参考値として比べてください。
          </p>
          {previous.map((s) => (
            <Link className="list-row" key={s.id} to={`/exam-results/${s.id}`}>
              <span>
                {new Date(s.startedAt).toLocaleString('ja-JP')} ·{' '}
                {s.mock?.timeMode === 'study' ? '停止可' : '時間継続'}
              </span>
              <b>{mockSummary(s, data.attempts).rate}%</b>
            </Link>
          ))}
        </section>
      )}
      <div className="hero-actions">
        <Link className="button primary" to="/review">
          復習ノートへ
          <ArrowRight size={16} />
        </Link>
        <Link className="button secondary" to="/exam">
          短縮模試・通し演習の一覧へ
        </Link>
      </div>
    </>
  );
}
import { QuestionMedia } from '../components/QuestionMedia';
