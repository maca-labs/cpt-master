import { ArrowLeft, ArrowRight, Check, ChevronRight, Flag, RotateCcw, Target } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLearning } from '../app/context';
import { useStartLearning } from '../app/actions';
import { questions, units } from '../content';
import { domainIds, domains } from '../content/blueprints';
import {
  diagnosticAvailability,
  domainResults,
  isFirstSeen,
  nextReview,
  partitionAttempts,
  rate,
  scoreAnswer,
} from '../engines/learning';
import { db, recordExposure } from '../storage/db';
import { Empty, FavoriteButton, PageTitle, Pill, SourceList } from '../components/Shared';
export function Diagnostic() {
  const { data, settings } = useLearning(),
    start = useStartLearning();
  const availability = diagnosticAvailability(questions);
  const enough = availability.every((d) => d.available >= d.needed);
  const previous = data.sessions.filter((s) => s.mode === 'diagnostic' && s.status === 'completed');
  return (
    <>
      <PageTitle
        eyebrow="FIND YOUR STARTING POINT"
        title="まずは、学習の現在地を。"
        description="50問で4分野を確認し、どこから学ぶかを見つけましょう。"
      />
      <section className="panel diagnostic-intro">
        <div className="intro-symbol">
          <Target size={39} />
        </div>
        <Pill tone="green">3択・単一正答 / 中断・再開できます</Pill>
        <h2>経験を活かすための実力診断</h2>
        <p>
          本番の難易度や合格可能性を示すテストではありません。初版の教材に基づく、学習開始位置の参考値です。診断には、設問・正答・解説を根拠資料とAIが照合した問題だけを使用します。人間の専門家レビューは未実施です。
        </p>
        <div className="diagnostic-counts">
          {availability.map((d) => (
            <div key={d.id}>
              <b>
                {d.needed}
                <small>問</small>
              </b>
              <span>{domains[d.id].short}</span>
              <small>
                利用可能 {d.available} / 不足 {Math.max(0, d.needed - d.available)}
              </small>
            </div>
          ))}
        </div>
        <div className="notice">
          診断前の50問は通常演習に出しません。以前に見た問題や、解説を先に見た問題は厳密な初見評価から除外します。解答後の解説は、診断終了後にまとめて確認できます。
        </div>
        <div className="hero-actions">
          <button
            className="button primary"
            disabled={!enough}
            onClick={() => void start.diagnostic()}
          >
            {settings.diagnosticStatus === 'started'
              ? '診断を再開する'
              : previous.length
                ? '診断をもう一度受ける'
                : '50問の診断を始める'}
            <ArrowRight size={17} />
          </button>
          {!['completed', 'skipped'].includes(settings.diagnosticStatus) && (
            <button className="button ghost" onClick={() => void start.skip()}>
              診断をスキップして学ぶ
            </button>
          )}
        </div>
        {previous.length > 0 && (
          <p className="muted small-text">同じ問題への再回答は解き直しとして記録されます。</p>
        )}
      </section>
      {previous.length > 0 && (
        <section className="panel">
          <h2>これまでの診断</h2>
          {previous.map((s) => (
            <Link className="list-row" key={s.id} to={`/results/${s.id}`}>
              <span>{new Date(s.startedAt).toLocaleString('ja-JP')}</span>
              <b>{rate(data.attempts.filter((a) => a.sessionId === s.id))}%</b>
              <ChevronRight size={17} />
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
export function Practice() {
  const { data, settings } = useLearning(),
    start = useStartLearning();
  const [unit, setUnit] = useState('');
  const active = data.sessions.filter((s) => s.status === 'active' && s.mode !== 'mock');
  return (
    <>
      <PageTitle
        eyebrow="PRACTICE WITH PURPOSE"
        title="答えより、根拠を身につける。"
        description="正答と誤答の理由を比べて、指導の判断につなげましょう。"
      />
      <div className="two-columns">
        <section className="panel">
          <Pill>3択・単一正答</Pill>
          <h2>確認問題に取り組む</h2>
          <label className="field-label">
            学習する単元
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">すべての単元から</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>
          </label>
          <p>未回答の問題グループを優先し、1回につき最大10問を出題します。</p>
          <button className="button primary" onClick={() => void start.practice(unit || undefined)}>
            問題演習を始める
            <ArrowRight size={17} />
          </button>
          <p className="muted small-text">
            {['completed', 'skipped'].includes(settings.diagnosticStatus)
              ? '診断用問題も演習に利用できます。'
              : '診断前の50問は保留しています。先に診断するか、スキップすると利用できます。'}
          </p>
        </section>
        <section className="panel">
          <Pill tone="amber">YOUR COLLECTION</Pill>
          <h2>お気に入りから</h2>
          <p>覚えておきたい問題を集めて、自分の問題集に。</p>
          <strong className="big-number">
            {data.favorites.length}
            <small>問</small>
          </strong>
          <button
            className="button secondary"
            disabled={!data.favorites.length}
            onClick={() => void start.practice(undefined, true)}
          >
            お気に入りを解く
            <ArrowRight size={16} />
          </button>
        </section>
      </div>
      {active.length > 0 && (
        <section className="panel">
          <h2>中断中の学習</h2>
          {active.map((s) => (
            <Link className="list-row" to={`/session/${s.id}`} key={s.id}>
              <span>
                {s.mode === 'diagnostic' ? '実力診断' : s.mode === 'review' ? '復習' : '問題演習'} ·{' '}
                {s.index + 1} / {s.questionIds.length}問目
              </span>
              <span>
                再開する <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </section>
      )}
      <section className="panel">
        <h2>演習の記録</h2>
        {data.sessions
          .filter((s) => s.status === 'completed' && s.mode !== 'mock')
          .reverse()
          .slice(0, 10)
          .map((s) => (
            <Link className="list-row" key={s.id} to={`/results/${s.id}`}>
              <span>
                {s.mode === 'diagnostic' ? '診断' : s.mode === 'review' ? '復習' : '演習'} ·{' '}
                {new Date(s.startedAt).toLocaleDateString('ja-JP')}
              </span>
              <b>{rate(data.attempts.filter((a) => a.sessionId === s.id))}%</b>
              <ChevronRight size={17} />
            </Link>
          ))}
        {!data.sessions.some((s) => s.status === 'completed' && s.mode !== 'mock') && (
          <p className="muted">完了した学習はここに表示されます。</p>
        )}
      </section>
    </>
  );
}
export function Quiz() {
  const { id } = useParams();
  const { data, run } = useLearning();
  const session = data.sessions.find((s) => s.id === id);
  const navigate = useNavigate();
  const q = session
    ? questions.find((q) => q.id === session.questionIds[session.index])
    : undefined;
  const [selected, setSelected] = useState(''),
    [canExplain, setCanExplain] = useState(false),
    [peek, setPeek] = useState(false),
    [busy, setBusy] = useState(false);
  const began = useRef(Date.now());
  const attempt = data.attempts.find((a) => a.sessionId === id && a.questionId === q?.id);
  useEffect(() => {
    setSelected('');
    setCanExplain(false);
    setPeek(false);
    began.current = Date.now();
    if (session && q && session.status === 'active' && session.mode !== 'mock')
      void run(() =>
        recordExposure({
          id: `${session.id}:${q.id}:question`,
          questionId: q.id,
          groupId: q.groupId,
          kind: 'question',
          sessionId: session.id,
          at: new Date().toISOString(),
        }),
      );
  }, [q?.id, session?.id, session?.status]);
  if (session?.mode === 'mock') return <Navigate to={`/exam/${session.id}`} replace />;
  if (!session || !q)
    return (
      <Empty title="学習セッションが見つかりません" body="問題演習から始めてください。">
        <Link to="/practice">問題演習へ</Link>
      </Empty>
    );
  if (session.status === 'completed')
    return (
      <Empty title="この学習は完了しました" body="結果から解説と次の単元を確認できます。">
        <Link className="button primary" to={`/results/${session.id}`}>
          結果を見る
        </Link>
      </Empty>
    );
  const diag = session.mode === 'diagnostic';
  const answer = async () => {
    if (!selected || busy) return;
    setBusy(true);
    await run(async () => {
      const attemptId = `${session.id}:${q.id}`;
      await db.transaction('rw', [db.attempts, db.reviews, db.exposures], async () => {
        if (await db.attempts.get(attemptId)) throw new Error('この問題はすでに保存されています。');
        const correct = scoreAnswer(q, selected);
        const exposures = await db.exposures.toArray(),
          attempts = await db.attempts.toArray();
        await db.attempts.add({
          id: attemptId,
          sessionId: session.id,
          questionId: q.id,
          questionRevision: q.revision,
          groupId: q.groupId,
          domainId: q.domainId,
          unitId: q.unitId,
          selectedChoiceId: selected,
          correctChoiceId: q.correctChoiceId,
          correct,
          firstSeen: isFirstSeen(q, session, exposures, attempts),
          canExplain,
          elapsedMs: Math.min(86400000, Math.max(0, Date.now() - began.current)),
          choiceOrder: session.choiceOrders[q.id],
          at: new Date().toISOString(),
        });
        const prev = await db.reviews.get(q.id);
        const review = nextReview(prev, correct, canExplain);
        await db.reviews.put({ ...review, questionId: q.id });
        if (!diag)
          await recordExposure({
            id: `${session.id}:${q.id}:explanation`,
            questionId: q.id,
            groupId: q.groupId,
            kind: 'explanation',
            sessionId: session.id,
            at: new Date().toISOString(),
          });
      });
    });
    setBusy(false);
  };
  const next = () =>
    run(async () => {
      if (session.index === session.questionIds.length - 1) {
        await db.transaction('rw', [db.sessions, db.settings], async () => {
          await db.sessions.update(session.id, {
            status: 'completed',
            completedAt: new Date().toISOString(),
          });
          if (diag) await db.settings.update('main', { diagnosticStatus: 'completed' });
        });
        navigate(`/results/${session.id}`);
      } else await db.sessions.update(session.id, { index: session.index + 1 });
    });
  const preview = () =>
    run(async () => {
      await recordExposure({
        id: `${session.id}:${q.id}:explanation`,
        questionId: q.id,
        groupId: q.groupId,
        kind: 'explanation',
        sessionId: session.id,
        at: new Date().toISOString(),
      });
      setPeek(true);
    });
  return (
    <>
      <div className="quiz-top">
        <Link to={diag ? '/diagnostic' : '/practice'} className="back-link">
          <ArrowLeft size={15} />
          保存して中断
        </Link>
        <Pill>
          {diag ? '実力診断' : session.mode === 'review' ? '復習' : '確認問題'} ·{' '}
          {session.index + 1} / {session.questionIds.length}
        </Pill>
      </div>
      <div className="quiz-progress">
        <span
          style={{
            width: `${((session.index + (attempt ? 1 : 0)) / session.questionIds.length) * 100}%`,
          }}
        />
      </div>
      <section className="panel quiz-card">
        <div className="question-meta">
          <Pill>{domains[q.domainId].short}</Pill>
          <span>難易度 {['基礎', '標準', '応用'][q.difficulty - 1]}</span>
          <FavoriteButton questionId={q.id} />
        </div>
        <small className="eyebrow">QUESTION {String(session.index + 1).padStart(2, '0')}</small>
        <h1>{q.prompt}</h1>
        <div className="choices">
          {session.choiceOrders[q.id].map((cid, i) => {
            const choice = q.choices.find((c) => c.id === cid)!;
            const picked = (attempt?.selectedChoiceId ?? selected) === cid;
            const cls =
              attempt && !diag
                ? cid === q.correctChoiceId
                  ? 'correct'
                  : picked
                    ? 'incorrect'
                    : ''
                : picked
                  ? 'selected'
                  : '';
            return (
              <button
                key={cid}
                className={`choice ${cls}`}
                disabled={!!attempt}
                onClick={() => setSelected(cid)}
                aria-pressed={picked}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {choice.text}
                {picked && <Check size={18} />}
              </button>
            );
          })}
        </div>
        {!attempt && (
          <>
            <label className="check-line reason-check">
              <input
                type="checkbox"
                checked={canExplain}
                onChange={(e) => setCanExplain(e.target.checked)}
              />
              この答えを選ぶ根拠を、自分の言葉で説明できる
            </label>
            <p className="muted small-text">チェックなしで正解した問題も復習対象になります。</p>
            <button
              className="button primary full-width"
              disabled={!selected || busy}
              onClick={() => void answer()}
            >
              {busy ? '保存中…' : '回答を保存'}
              <ArrowRight size={17} />
            </button>
            {!diag && (
              <button className="text-button" onClick={() => void preview()}>
                先に解説を見る（初見評価から除外）
              </button>
            )}
          </>
        )}
        {attempt && (
          <div
            className={`answer-notice ${diag ? 'neutral' : attempt.correct ? 'good' : 'bad'}`}
            role="status"
          >
            {diag
              ? '回答を保存しました。解説は診断終了後に確認できます。'
              : attempt.correct
                ? '正解です。根拠も確認しましょう。'
                : 'もう一度、判断の理由を確認しましょう。'}{' '}
            {!attempt.firstSeen && <small>この回答は解き直しとして記録しています。</small>}
          </div>
        )}
        {((attempt && !diag) || peek) && <Explanation questionId={q.id} sessionId={session.id} />}
        <div className="question-footer">
          <small>
            {q.id} · rev.{q.revision} ·{' '}
            {q.review.status === 'expert_reviewed'
              ? '専門家レビュー済み'
              : q.review.status === 'source_checked'
                ? 'AIによる出典照合済み'
                : '未検証'}
          </small>
          {attempt && (
            <button className="button primary" onClick={() => void next()}>
              {session.index === session.questionIds.length - 1 ? '結果を見る' : '次の問題へ'}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </section>
    </>
  );
}
export function Explanation({ questionId, sessionId }: { questionId: string; sessionId?: string }) {
  const q = questions.find((q) => q.id === questionId)!;
  const { data, run } = useLearning();
  const registered = data.reviews.some((r) => r.questionId === q.id && r.manual);
  return (
    <div className="explanation">
      <h3>正答：{q.choices.find((c) => c.id === q.correctChoiceId)?.text}</h3>
      <p>{q.explanation}</p>
      <dl className="choice-reasons">
        {q.choices.map((c) => (
          <div key={c.id}>
            <dt>
              {c.id === q.correctChoiceId ? <Check size={16} /> : <span>×</span>}
              {c.text}
            </dt>
            <dd>{c.explanation}</dd>
          </div>
        ))}
      </dl>
      <div className="notice">
        {q.review.reviewerType === 'ai'
          ? 'AIによる出典照合。人間の専門家レビューではありません。'
          : '専門家による確認記録あり。'}
        <br />
        rev.{q.review.revision} · {q.review.checkedAt}
        <br />
        {q.review.method}
      </div>
      <details>
        <summary>根拠資料と該当箇所</summary>
        <SourceList refs={q.sourceRefs} />
      </details>
      <small>学習目標：{q.objectiveIds.join(' / ')}</small>
      <div className="hero-actions">
        <Link className="button small secondary" to={`/learn/${q.unitId}`}>
          関連単元・動画へ <ArrowRight size={15} />
        </Link>
        <button
          className="button small ghost"
          onClick={() =>
            void run(async () => {
              const prev = await db.reviews.get(q.id);
              await db.reviews.put({
                questionId: q.id,
                dueAt: new Date().toISOString(),
                intervalDays: prev?.intervalDays ?? 0,
                wrongStreak: prev?.wrongStreak ?? 0,
                manual: true,
              });
              if (sessionId)
                await recordExposure({
                  id: `${sessionId}:${q.id}:explanation`,
                  questionId: q.id,
                  groupId: q.groupId,
                  kind: 'explanation',
                  sessionId,
                  at: new Date().toISOString(),
                });
            })
          }
        >
          <Flag size={15} />
          {registered ? '復習登録済み' : '復習に登録'}
        </button>
      </div>
    </div>
  );
}
export function Results() {
  const { id } = useParams();
  const { data, run } = useLearning();
  const session = data.sessions.find((s) => s.id === id);
  const [opened, setOpened] = useState<string | null>(null);
  if (session?.mode === 'mock') return <Navigate to={`/exam-results/${session.id}`} replace />;
  if (!session || session.status !== 'completed')
    return <Empty title="完了した結果がありません" body="学習を完了すると結果を確認できます。" />;
  const attempts = data.attempts.filter((a) => a.sessionId === id);
  const partition = partitionAttempts(data.attempts, data.exposures);
  const first = partition.first.filter((a) => a.sessionId === id),
    repeated = partition.repeat.filter((a) => a.sessionId === id);
  const firstIds = new Set(first.map((a) => a.id));
  const results = domainResults(attempts)
    .filter((d) => d.count > 0)
    .sort((a, b) => a.rate! - b.rate!);
  return (
    <>
      <PageTitle
        eyebrow="YOUR LEARNING INSIGHTS"
        title={
          session.mode === 'diagnostic'
            ? '学ぶ場所が、見えてきました。'
            : 'ひとつ、理解が深まりました。'
        }
        description="この結果は学習の参考値です。公式換算スコア・合格確率は算出しません。"
      />
      <div className="result-stats">
        <div>
          <span>今回の正答率</span>
          <b>
            {rate(attempts) ?? '—'}
            <small>%</small>
          </b>
          <p>
            {attempts.filter((a) => a.correct).length} / {attempts.length}問 正解
          </p>
        </div>
        <div>
          <span>厳密な初見</span>
          <b>
            {rate(first) ?? '—'}
            <small>{first.length ? '%' : ''}</small>
          </b>
          <p>初見 {first.length}問</p>
        </div>
        <div>
          <span>解き直し</span>
          <b>
            {rate(repeated) ?? '—'}
            <small>{repeated.length ? '%' : ''}</small>
          </b>
          <p>既出・解説先読み {repeated.length}問</p>
        </div>
      </div>
      <section className="panel">
        <h2>次に学ぶ分野</h2>
        <p className="muted">今回の正答率が低い順に表示しています。少数の問題による推定です。</p>
        {results.map((r, i) => {
          const unitIds = [
            ...new Set(
              attempts.filter((a) => a.domainId === r.id && !a.correct).map((a) => a.unitId),
            ),
          ];
          const recommended = units.filter(
            (u) => u.domainId === r.id && (unitIds.length === 0 || unitIds.includes(u.id)),
          );
          return (
            <div className="weak-row" key={r.id}>
              <div>
                <Pill tone={i === 0 ? 'amber' : 'neutral'}>
                  {i === 0 ? '優先して学ぶ' : `おすすめ ${i + 1}`}
                </Pill>
                <h3>
                  {domains[r.id].short}
                  <span>{r.rate}%</span>
                </h3>
                <small>{r.count}問の回答から</small>
              </div>
              <div className="weak-links">
                {recommended.map((u) => (
                  <Link key={u.id} className="text-link" to={`/learn/${u.id}`}>
                    {u.title}
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
      <section className="panel">
        <h2>解答を振り返る</h2>
        {attempts.map((a) => {
          const q = questions.find((q) => q.id === a.questionId)!;
          return (
            <div className="result-question" key={a.id}>
              <button
                className="result-question-button"
                onClick={() =>
                  void run(async () => {
                    if (opened !== q.id) {
                      await recordExposure({
                        id: `${session.id}:${q.id}:explanation`,
                        questionId: q.id,
                        groupId: q.groupId,
                        kind: 'explanation',
                        sessionId: session.id,
                        at: new Date().toISOString(),
                      });
                    }
                    setOpened(opened === q.id ? null : q.id);
                  })
                }
              >
                <span className={a.correct ? 'answer-dot good' : 'answer-dot bad'}>
                  {a.correct ? <Check size={15} /> : '×'}
                </span>
                <span>
                  {q.prompt}
                  <small>
                    {firstIds.has(a.id) ? '初見' : '解き直し'} ·{' '}
                    {a.canExplain ? '根拠を説明できた' : '根拠を復習'} ·{' '}
                    {Math.round(a.elapsedMs / 1000)}秒
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
              {opened === q.id && <Explanation questionId={q.id} sessionId={session.id} />}
            </div>
          );
        })}
      </section>
      <Link to="/review" className="button primary">
        <RotateCcw size={17} />
        復習一覧へ
      </Link>
    </>
  );
}
export function Review() {
  const { data } = useLearning(),
    start = useStartLearning();
  const now = new Date().toISOString(),
    due = data.reviews.filter((r) => r.dueAt <= now);
  return (
    <>
      <PageTitle
        eyebrow="MAKE IT STICK"
        title="忘れる前に、もう一度。"
        description="誤答や、根拠を説明できなかった問題を間隔をあけて復習します。"
      >
        <button
          className="button primary"
          disabled={!due.length}
          onClick={() => void start.review()}
        >
          今日の復習 {due.length}問<ArrowRight size={16} />
        </button>
      </PageTitle>
      <div className="notice">
        復習間隔は1・3・7・14・30日を基本に調整。誤答・根拠が曖昧なときは翌日へ戻します。期限超過・繰り返すつまずき・手動登録を優先し、回答時間を補助情報として順番を調整します。
      </div>
      {!data.reviews.length ? (
        <Empty
          title="復習ノートは、これから。"
          body="演習後の復習登録や回答結果に応じて、問題がここに集まります。"
        >
          <Link to="/practice" className="button secondary">
            問題演習へ
          </Link>
        </Empty>
      ) : (
        <section className="panel">
          {[...data.reviews]
            .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
            .map((r) => {
              const q = questions.find((q) => q.id === r.questionId)!;
              return (
                <div className="review-row" key={r.questionId}>
                  <div>
                    <Pill tone={r.dueAt <= now ? 'amber' : 'neutral'}>
                      {r.dueAt <= now
                        ? '復習できます'
                        : `${new Date(r.dueAt).toLocaleDateString('ja-JP')} 予定`}
                    </Pill>
                    <h3>{q.prompt}</h3>
                    <small>
                      {domains[q.domainId].short} · 連続つまずき {r.wrongStreak}回
                      {r.manual ? ' · 手動登録' : ''}
                    </small>
                  </div>
                  <Link to={`/learn/${q.unitId}`} className="text-link">
                    単元へ
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
        </section>
      )}
    </>
  );
}
