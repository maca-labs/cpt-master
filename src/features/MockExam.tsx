import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Pause, Play, Check } from 'lucide-react';
import { questions, units } from '../content';
import { domains } from '../content/blueprints';
import type { Session } from '../domain/types';
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
} from '../engines/mock';
import { partitionAttempts, rate } from '../engines/learning';
import { Empty, PageTitle, Pill } from '../components/Shared';
import { Explanation } from './Practice';

const timeText = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function MockExamHome() {
  const { data, settings, run } = useLearning();
  const [count, setCount] = useState<10 | 20 | 50>(20);
  const [timeMode, setTimeMode] = useState<'study' | 'continuous'>('study');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false),
    navigate = useNavigate();
  const unlocked = ['completed', 'skipped'].includes(settings.diagnosticStatus);
  const available = mockAvailability(questions, count, unlocked);
  const missing = available.reduce((sum, row) => sum + row.missing, 0);
  const start = async () => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await run(async () => {
        const session = createMockSession(
          questions,
          count,
          unlocked,
          timeMode,
          data.exposures,
          data.attempts,
        );
        await db.sessions.add(session);
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
        title="短い模試で、学びを確かめる。"
        description="見直しと時間配分を練習し、次に学ぶ単元を見つけましょう。"
      />
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
      {data.sessions.some((s) => s.mode === 'mock' && s.status === 'active') && (
        <section className="panel">
          <h2>中断中の短縮模試</h2>
          {data.sessions
            .filter((s) => s.mode === 'mock' && s.status === 'active')
            .map((s) => (
              <Link key={s.id} className="list-row" to={`/exam/${s.id}`}>
                <span>
                  {s.questionIds.length}問 · {s.mock?.paused ? '一時停止中' : '進行中'} · 回答{' '}
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
        <h2>これまでの短縮模試</h2>
        {data.sessions
          .filter((s) => s.mode === 'mock' && s.status === 'completed')
          .reverse()
          .map((s) => (
            <Link key={s.id} className="list-row" to={`/exam-results/${s.id}`}>
              <span>
                {new Date(s.startedAt).toLocaleString('ja-JP')} · {s.questionIds.length}問
              </span>
              <b>{mockSummary(s, data.attempts).rate}%</b>
            </Link>
          ))}
        {!data.sessions.some((s) => s.mode === 'mock' && s.status === 'completed') && (
          <p className="muted">完了した短縮模試はここに残ります。</p>
        )}
      </section>
      <Link className="button secondary" to="/exam/full">
        155問模試の準備状況
        <ArrowRight size={16} />
      </Link>
    </>
  );
}

export function MockExamSession() {
  const { id } = useParams(),
    { data, run } = useLearning(),
    navigate = useNavigate();
  const session = data.sessions.find((s) => s.id === id && s.mode === 'mock');
  const question = questions.find((q) => q.id === session?.questionIds[session.index]);
  const [now, setNow] = useState(() => Date.now()),
    [selected, setSelected] = useState(''),
    [canExplain, setCanExplain] = useState(false),
    [busy, setBusy] = useState(false),
    [showReview, setShowReview] = useState(false),
    [confirm, setConfirm] = useState(false),
    [notice, setNotice] = useState('');
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
    const draft = question && session?.mock?.draftAnswers[question.id];
    setSelected(draft?.choiceId ?? '');
    setCanExplain(draft?.canExplain ?? false);
    setNotice('');
    began.current = Date.now();
    if (question && session?.status === 'active' && !session.mock?.paused)
      void run(() =>
        recordExposure({
          id: `${session.id}:${question.id}:question`,
          questionId: question.id,
          groupId: question.groupId,
          kind: 'question',
          sessionId: session.id,
          at: new Date().toISOString(),
        }),
      );
  }, [question?.id, session?.id, session?.status, session?.mock?.paused]);
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
    setSelected(choice);
    setCanExplain(explain);
    return update(
      (fresh) => withMockDraft(fresh, question, choice, explain, Date.now() - began.current),
      () => setNotice('下書きを保存しました。採点は終了時に行います。'),
    );
  };
  const flush = (fresh: Session) =>
    selected && question && !fresh.mock?.paused
      ? withMockDraft(fresh, question, selected, canExplain, Date.now() - began.current)
      : fresh;
  const move = (index: number) =>
    update(
      (fresh) => ({ ...flush(fresh), index }),
      () => {
        setShowReview(false);
        setConfirm(false);
      },
    );
  const interrupt = () =>
    update(
      (fresh) => {
        const saved = flush(fresh);
        return saved.mock!.timeMode === 'study' ? pauseMock(saved) : saved;
      },
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
      <Empty title="この短縮模試は完了しました" body="結果から復習する単元を確認できます。">
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
          短縮模試 · {session.index + 1} / {session.questionIds.length}
        </Pill>
        <strong role="timer" aria-label="短縮模試の残り時間">
          残り {timeText(remaining)}
          {state.paused ? ' · 停止中' : ''}
        </strong>
      </div>
      <p className="muted small-text">
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
            onClick={() => void update((fresh) => pauseMock(flush(fresh)))}
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
        <section className="panel" role="dialog" aria-label="短縮模試の提出確認">
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
          <h1>短縮模試を一時停止しています</h1>
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
                setCanExplain(event.target.checked);
                if (selected) void saveChoice(selected, event.target.checked);
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
  const [opened, setOpened] = useState<string | null>(null);
  useEffect(() => {
    if (!session?.mock) return;
    void run(async () => {
      for (const qid of session.questionIds) {
        const q = questions.find((item) => item.id === qid)!;
        await recordExposure({
          id: `${session.id}:${qid}:question`,
          questionId: qid,
          groupId: q.groupId,
          kind: 'question',
          sessionId: session.id,
          at: new Date().toISOString(),
        });
      }
    });
  }, [session?.id]);
  if (!session?.mock)
    return (
      <Empty title="完了した短縮模試がありません" body="短縮模試を採点すると結果が残ります。">
        <Link to="/exam">短縮模試へ</Link>
      </Empty>
    );
  const result = mockSummary(session, data.attempts);
  const records = data.attempts.filter((a) => a.sessionId === session.id);
  const first = partitionAttempts(data.attempts, data.exposures).first.filter(
    (a) => a.sessionId === session.id,
  );
  const previous = data.sessions
    .filter(
      (s) =>
        s.mode === 'mock' &&
        s.status === 'completed' &&
        s.id !== session.id &&
        s.questionIds.length === session.questionIds.length,
    )
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 5);
  return (
    <>
      <PageTitle
        eyebrow="SHORT MOCK RESULTS"
        title="短縮模試の結果"
        description="今回の学習上の正答率です。公式換算スコア・合否・合格確率は算出しません。"
      />
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
              {result.domains.map((row) => (
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
      <section className="panel">
        <h2>解答と次に学ぶ単元</h2>
        {session.questionIds.map((qid) => {
          const q = questions.find((item) => item.id === qid)!;
          const answer = records.find((a) => a.questionId === qid);
          return (
            <div className="result-question" key={qid}>
              <button
                className="result-question-button"
                onClick={() =>
                  void run(async () => {
                    if (opened !== qid)
                      await recordExposure({
                        id: `${session.id}:${qid}:explanation`,
                        questionId: qid,
                        groupId: q.groupId,
                        kind: 'explanation',
                        sessionId: session.id,
                        at: new Date().toISOString(),
                      });
                    setOpened(opened === qid ? null : qid);
                  })
                }
              >
                <span className={answer?.correct ? 'answer-dot good' : 'answer-dot bad'}>
                  {answer?.correct ? '✓' : '×'}
                </span>
                <span>
                  {q.prompt}
                  <small>
                    {answer ? (answer.correct ? '正解' : '誤答') : '未回答'}
                    {session.mock!.flags.includes(qid) ? ' · フラグ付き' : ''}
                  </small>
                </span>
              </button>
              {!answer?.correct && (
                <Link className="text-link" to={`/learn/${q.unitId}`}>
                  {units.find((u) => u.id === q.unitId)?.title}・関連動画へ
                  <ArrowRight size={15} />
                </Link>
              )}
              {opened === qid && <Explanation questionId={qid} sessionId={session.id} />}
            </div>
          );
        })}
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
          短縮模試の一覧へ
        </Link>
      </div>
    </>
  );
}
