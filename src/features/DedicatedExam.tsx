import { liveQuery } from 'dexie';
import { useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExamReviewFilter } from '../components/ExamReviewFilter';
import {
  ExamVerdict,
  examVerdictLabels,
  getExamVerdict,
  type ExamVerdictStatus,
} from '../components/ExamVerdict';
import { domains } from '../content/blueprints';
import {
  remainingDedicatedSeconds,
  dedicatedMissedQuestionIds,
  validateDedicatedExamPack,
  type DedicatedExamItem,
  type DedicatedExamPack,
  type DedicatedExamRetake,
  type DedicatedExamSession,
} from '../engines/dedicated-exam';
import { DedicatedExamDB } from '../storage/dedicated-exam';

function Media({ media }: { media: NonNullable<DedicatedExamItem['media']> }) {
  const [playing, setPlaying] = useState(false);
  if (media.kind === 'video')
    return (
      <figure className="dedicated-media">
        <video controls playsInline preload="metadata" src={media.src} aria-label={media.alt} />
        <details>
          <summary>映像の説明</summary>
          <p>{media.alt}</p>
        </details>
      </figure>
    );
  return (
    <figure className="dedicated-media">
      {media.kind === 'diagram' ? (
        <img src={media.src} alt={media.alt} />
      ) : (
        <>
          <button className="button secondary" type="button" onClick={() => setPlaying(!playing)}>
            {playing ? 'アニメーションを停止' : 'アニメーションを再生'}
          </button>
          {playing && <img src={media.src} alt={media.alt} />}
        </>
      )}
      <details>
        <summary>{media.kind === 'diagram' ? '図の説明' : 'アニメーションの説明'}</summary>
        <p>{media.alt}</p>
      </details>
    </figure>
  );
}

function timeLabel(seconds: number) {
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}

function QuestionNavigator({
  session,
  index,
  disabled,
  onSelect,
  getVerdict,
  detailsRef,
  visibleIndices,
}: {
  session: DedicatedExamSession;
  index: number;
  disabled?: boolean;
  onSelect: (index: number) => void;
  getVerdict?: (id: string) => ExamVerdictStatus;
  detailsRef?: Ref<HTMLDetailsElement>;
  visibleIndices?: number[];
}) {
  const positions = visibleIndices ?? session.questionIds.map((_, position) => position);
  return (
    <details className="dedicated-navigator" ref={detailsRef}>
      <summary>解答状況・見直し</summary>
      <p className="muted">
        {getVerdict
          ? '問題を選ぶと解説へ移動します。⚑は見直しフラグです。'
          : '● 回答済み　⚑ 見直しフラグ'}
      </p>
      <div className="dedicated-grid">
        {positions.map((position) => {
          const id = session.questionIds[position];
          const answered = Boolean(session.answers[id]);
          const flagged = session.flags.includes(id);
          const verdict = getVerdict?.(id);
          const status = verdict ? examVerdictLabels[verdict] : answered ? '回答済み' : '未回答';
          return (
            <button
              key={id}
              type="button"
              className={`button ${position === index ? 'primary' : 'secondary'}${verdict ? ' has-verdict' : ''}`}
              aria-current={position === index ? 'step' : undefined}
              aria-label={`問題 ${position + 1}、${status}${flagged ? '、フラグあり' : ''}`}
              disabled={disabled}
              onClick={() => onSelect(position)}
            >
              {verdict ? (
                <>
                  <span className="dedicated-grid-number">
                    {position + 1}
                    {flagged ? ' ⚑' : ''}
                  </span>
                  <span>{status}</span>
                </>
              ) : (
                <>
                  {position + 1}
                  {answered && <span aria-hidden="true">●</span>}
                  {flagged && <span aria-hidden="true">⚑</span>}
                </>
              )}
            </button>
          );
        })}
      </div>
    </details>
  );
}

export default function DedicatedExamWorkspace({
  pack,
  access,
}: {
  pack: DedicatedExamPack;
  access: 'preview' | 'released';
}) {
  const errors = useMemo(() => validateDedicatedExamPack(pack, access), [pack, access]);
  if (errors.length)
    return (
      <section className="panel">
        <h1>155問の本番形式模試は、準備中です。</h1>
        <p>開始条件を確認できませんでした。</p>
        {access === 'preview' && (
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </section>
    );
  return <DedicatedExam pack={pack} access={access} />;
}

function DedicatedExam({
  pack,
  access,
}: {
  pack: DedicatedExamPack;
  access: 'preview' | 'released';
}) {
  const [database] = useState(() => new DedicatedExamDB(access));
  const [params, setParams] = useSearchParams();
  const originalId = params.get('original');
  const retakeId = params.get('retake');
  const [saved, setSaved] = useState<{
    requestedId: string | null;
    original: DedicatedExamSession | null;
    retakes: DedicatedExamRetake[];
  }>();
  const loaded = saved?.requestedId === originalId ? saved : undefined;
  const session = loaded
    ? retakeId
      ? (loaded.retakes.find((retake) => retake.id === retakeId) ?? null)
      : loaded.original
    : undefined;
  const isRetake = !!session?.retakeOf;
  const activeRetake = loaded?.retakes.find((retake) => retake.status === 'active');
  const [now, setNow] = useState(Date.now);
  const [takingId, setTakingId] = useState<string>();
  const taking = !!session && takingId === session.id;
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState<{ sessionId: string; index: number }>();
  const [filterSessionId, setFilterSessionId] = useState<string>();
  const reviewIndex = review?.sessionId === session?.id ? review?.index : undefined;
  const onlyMissed = !!session && filterSessionId === session.id;
  const running = useRef(false);
  const quiz = useRef<HTMLElement>(null);
  const retakeResultHeading = useRef<HTMLHeadingElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const reviewNavigator = useRef<HTMLDetailsElement>(null);
  const resultFilterButton = useRef<HTMLButtonElement>(null);
  const items = useMemo(() => new Map(pack.items.map((item) => [item.id, item])), [pack]);

  useEffect(() => {
    const subscription = liveQuery(async () => {
      const original = originalId
        ? await database.sessionById(pack, originalId)
        : await database.sessionFor(pack);
      const retakes =
        original?.status === 'completed' ? await database.missedRetakesFor(pack, original.id) : [];
      return { requestedId: originalId, original: original ?? null, retakes };
    }).subscribe({
      next: (value) => {
        setSaved(value);
        setNow(Date.now());
      },
      error: () => setError('模試の保存データを読み込めませんでした。'),
    });
    return () => subscription.unsubscribe();
  }, [database, pack, originalId]);

  const timed = !!session && session.deadlineAt !== null;
  const paused = session?.pausedRemainingMs !== undefined;

  useEffect(() => {
    if (session?.status !== 'active' || !timed || paused) return;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [session?.status, timed, paused]);

  useEffect(() => {
    if (taking && quiz.current) {
      quiz.current.scrollIntoView({ block: 'start' });
      quiz.current.querySelector('h1')?.focus({ preventScroll: true });
    }
  }, [taking, session?.index]);

  useEffect(() => {
    if (!isRetake || session?.status !== 'completed') return;
    retakeResultHeading.current?.scrollIntoView({ block: 'start' });
    retakeResultHeading.current?.focus({ preventScroll: true });
  }, [isRetake, session?.id, session?.status]);

  function focusReview() {
    reviewHeading.current?.scrollIntoView({ block: 'start' });
    reviewHeading.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (reviewIndex !== undefined) focusReview();
  }, [reviewIndex]);

  function selectReview(index: number) {
    if (!session) return;
    if (reviewNavigator.current) reviewNavigator.current.open = false;
    if (index === reviewIndex) focusReview();
    else setReview({ sessionId: session.id, index });
  }

  function showQuestionList() {
    if (!reviewNavigator.current) return;
    reviewNavigator.current.open = true;
    const summary = reviewNavigator.current.querySelector('summary');
    summary?.scrollIntoView({ block: 'start' });
    summary?.focus({ preventScroll: true });
  }

  function verdictFor(id: string) {
    return getExamVerdict(session?.answers[id], items.get(id)!.correctChoiceId);
  }

  const reviewQuestionIds = session?.status === 'completed' ? session.questionIds : [];
  const allReviewIndices = reviewQuestionIds.map((_, index) => index);
  const missedReviewIndices = allReviewIndices.filter(
    (index) => verdictFor(reviewQuestionIds[index]) !== 'correct',
  );
  const reviewIndices = onlyMissed ? missedReviewIndices : allReviewIndices;
  const reviewPosition = reviewIndex === undefined ? -1 : reviewIndices.indexOf(reviewIndex);

  function toggleMissed() {
    if (!session) return;
    setFilterSessionId(onlyMissed ? undefined : session.id);
    if (onlyMissed || reviewIndex === undefined || missedReviewIndices.includes(reviewIndex))
      return;
    const next = missedReviewIndices.find((index) => index > reviewIndex) ?? missedReviewIndices[0];
    if (next !== undefined) {
      selectReview(next);
    } else {
      setReview(undefined);
      resultFilterButton.current?.focus();
    }
  }

  function startReview() {
    if (!session || !reviewIndices.length) return;
    if (reviewIndex !== undefined && reviewPosition >= 0) {
      selectReview(reviewIndex);
      return;
    }
    const incorrect = reviewIndices.find(
      (index) => verdictFor(session.questionIds[index]) === 'incorrect',
    );
    const unanswered = reviewIndices.find(
      (index) => verdictFor(session.questionIds[index]) === 'unanswered',
    );
    selectReview(incorrect ?? unanswered ?? reviewIndices[0]);
  }

  const seconds =
    session?.status === 'active' && timed ? remainingDedicatedSeconds(session, now) : 0;
  const expired = timed && !paused && seconds === 0;

  async function save(action: () => Promise<unknown>) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : '模試を保存できませんでした。');
    } finally {
      running.current = false;
      setBusy(false);
      setNow(Date.now());
    }
  }

  const finishRequested = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!session || session.status !== 'active' || !expired || busy) return;
    const requestKey = `${session.id}:${session.deadlineAt}`;
    if (finishRequested.current === requestKey) return;
    finishRequested.current = requestKey;
    setConfirming(false);
    void save(() => database.finish(pack, session.id, 'timeout'));
  }, [database, pack, session, expired, busy]);

  const label =
    access === 'preview'
      ? (pack.title ?? '専用模試') + ' · ローカル検証'
      : (pack.title ?? '本番形式の専用模試');
  const item = session && items.get(session.questionIds[session.index]);
  const update = (action: Parameters<DedicatedExamDB['update']>[2]) => {
    if (session) void save(() => database.update(pack, session.id, action));
  };
  const viewParams = (source?: string, retake?: string) => {
    const next = new URLSearchParams(params);
    next.delete('original');
    next.delete('retake');
    if (source) next.set('original', source);
    if (retake) next.set('retake', retake);
    return next;
  };
  const viewLink = (source?: string, retake?: string) => ({
    search: viewParams(source, retake).toString(),
  });
  const start = () =>
    void save(async () => {
      const next = await database.start(pack);
      setSaved({ requestedId: null, original: next, retakes: [] });
      if (originalId || retakeId) setParams(viewParams());
      setTakingId(next.id);
      setConfirming(false);
      setReview(undefined);
      setFilterSessionId(undefined);
    });
  const startRetake = () =>
    void save(async () => {
      if (!session || session.status !== 'completed' || isRetake) return;
      const next = await database.startMissedRetake(pack, session.id);
      setTakingId(next.id);
      setConfirming(false);
      setParams(viewParams(session.id, next.id));
    });
  const interrupt = () =>
    void save(async () => {
      if (!session) return;
      if (timed) await database.pause(pack, session.id);
      setTakingId(undefined);
      setConfirming(false);
    });
  const resume = () =>
    void save(async () => {
      if (!session) return;
      if (timed) await database.resume(pack, session.id);
      setTakingId(session.id);
      setConfirming(false);
    });
  const retakeCount =
    session?.status === 'completed' && !isRetake
      ? dedicatedMissedQuestionIds(pack, session).length
      : 0;

  return (
    <div className="dedicated-workspace">
      {access === 'preview' && (
        <p className="notice">
          非公開の動作検証です。この画面での受験記録は公開版と別に保存します。
        </p>
      )}
      {access === 'released' && pack.status === 'released_study' && (
        <p className="notice">
          AIによる出典照合済みです。人間の専門家レビューは未実施です。非公式の学習用模試で、公式の合否や換算スコアは示しません。
        </p>
      )}
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      {session === undefined && !error && <p role="status">模試を読み込んでいます。</p>}
      {session?.status === 'completed' && session.result ? (
        <section className="panel">
          <h1 ref={retakeResultHeading} tabIndex={isRetake ? -1 : undefined}>
            {isRetake ? '模試の解き直し結果' : '専用模試の結果'}
          </h1>
          <p>
            {isRetake
              ? '元の模試で不正解・未回答だった問題の解き直し成績です。'
              : session.finishedReason === 'timeout'
                ? '制限時間終了'
                : '提出済み'}
          </p>
          {isRetake ? (
            <p>
              <Link className="button secondary" to={viewLink(session.retakeOf)}>
                元の模試結果へ
              </Link>
            </p>
          ) : retakeCount > 0 ? (
            <div className="exam-review-actions">
              <button
                className="button primary"
                type="button"
                onClick={startRetake}
                disabled={busy}
              >
                {activeRetake ? '解き直しを再開する' : '不正解・未回答を解き直す'}
              </button>
              <span className="muted small-text">
                解き直しの対象 {retakeCount} 問 · 時間制限なし
              </span>
            </div>
          ) : (
            <p className="muted small-text">解き直しの対象はありません。</p>
          )}
          <div className="exam-review-actions">
            <button
              className="button primary"
              type="button"
              onClick={startReview}
              disabled={reviewIndices.length === 0}
            >
              解答・解説を見る
            </button>
            <ExamReviewFilter
              onlyMissed={onlyMissed}
              onToggle={toggleMissed}
              buttonRef={resultFilterButton}
            />
          </div>
          <p className="muted small-text" role="status">
            {reviewIndices.length === 0
              ? '不正解・未回答の問題はありません。'
              : `表示対象 ${reviewIndices.length} / ${allReviewIndices.length} 問`}
          </p>
          <div className="result-stats">
            <div>
              <span>{isRetake ? '解き直しの得点' : '採点対象の得点'}</span>
              <b>
                {session.result.correct} / {session.result.total} 問
              </b>
            </div>
            <div>
              <span>{isRetake ? '解き直しの正答率' : '採点対象の正答率'}</span>
              <b>{session.result.rate}%</b>
            </div>
            <div>
              <span>{isRetake ? '解き直しの未回答' : '採点対象の未回答'}</span>
              <b>{session.result.unanswered} 問</b>
            </div>
          </div>
          {isRetake ? (
            <p>解き直しでは対象の全問題を採点します。</p>
          ) : (
            <p>
              採点対象外15問の回答は得点に含みません。全155問の回答数は{' '}
              {Object.keys(session.answers).length} 問です。
            </p>
          )}
          {reviewIndices.length > 0 && (
            <QuestionNavigator
              session={session}
              index={reviewIndex ?? -1}
              onSelect={selectReview}
              getVerdict={verdictFor}
              detailsRef={reviewNavigator}
              visibleIndices={reviewIndices}
            />
          )}
          {reviewIndex !== undefined && reviewPosition >= 0 && (
            <ReviewedItem
              key={session.questionIds[reviewIndex]}
              item={items.get(session.questionIds[reviewIndex])!}
              selected={session.answers[session.questionIds[reviewIndex]]}
              choiceOrder={session.choiceOrders[session.questionIds[reviewIndex]]}
              index={reviewIndex}
              position={reviewPosition}
              total={reviewIndices.length}
              previousIndex={reviewIndices[reviewPosition - 1]}
              nextIndex={reviewIndices[reviewPosition + 1]}
              onlyMissed={onlyMissed}
              isRetake={isRetake}
              headingRef={reviewHeading}
              onSelect={selectReview}
              onShowQuestionList={showQuestionList}
              onToggleMissed={toggleMissed}
            />
          )}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>分野</th>
                  <th>正答</th>
                  <th>{isRetake ? '解き直し対象' : '採点対象'}</th>
                  <th>未回答</th>
                </tr>
              </thead>
              <tbody>
                {session.result.domains.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{domains[row.id].short}</th>
                    <td>{row.correct}</td>
                    <td>{row.total}</td>
                    <td>{row.unanswered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isRetake && (
            <>
              {loaded?.retakes.some((retake) => retake.result) && (
                <section aria-label="解き直しの記録">
                  <h2>解き直しの記録</h2>
                  {loaded.retakes.map(
                    (retake) =>
                      retake.result && (
                        <div className="list-row" key={retake.id}>
                          <span>
                            第{retake.retakeNumber}回 · {retake.result.correct} /{' '}
                            {retake.result.total} 問正解
                          </span>
                          <Link className="text-link" to={viewLink(session.id, retake.id)}>
                            解き直し結果を見る
                          </Link>
                        </div>
                      ),
                  )}
                </section>
              )}
              <button className="button secondary" type="button" onClick={start} disabled={busy}>
                同じセットで再受験する
              </button>
            </>
          )}
        </section>
      ) : session?.status === 'active' && taking && !paused && item ? (
        <section className="panel dedicated-run" ref={quiz}>
          <div className="quiz-top">
            <span className="pill">
              {isRetake ? '解き直し' : '問題'} {session.index + 1} / {session.questionIds.length}
            </span>
            {timed && (
              <span role="timer" aria-label="残り時間">
                {timeLabel(seconds)}
              </span>
            )}
            <button
              className="button secondary"
              type="button"
              disabled={busy || expired}
              onClick={interrupt}
            >
              中断する
            </button>
          </div>
          <h1 tabIndex={-1}>{item.prompt}</h1>
          {item.media && <Media key={item.id} media={item.media} />}
          <div className="choices">
            {session.choiceOrders[item.id].map((choiceId, position) => {
              const choice = item.choices.find((candidate) => candidate.id === choiceId)!;
              const selected = session.answers[item.id] === choiceId;
              return (
                <button
                  type="button"
                  key={choiceId}
                  className={`choice${selected ? ' selected' : ''}`}
                  aria-pressed={selected}
                  disabled={busy || expired}
                  onClick={() => update({ type: 'answer', questionId: item.id, choiceId })}
                >
                  <span aria-hidden="true">{String.fromCharCode(65 + position)}</span>
                  {choice.text}
                </button>
              );
            })}
          </div>
          <div className="dedicated-actions">
            <button
              type="button"
              className="button secondary"
              disabled={busy || expired || session.index === 0}
              onClick={() => update({ type: 'navigate', index: session.index - 1 })}
            >
              前の問題へ
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={busy || expired}
              aria-pressed={session.flags.includes(item.id)}
              onClick={() =>
                update({
                  type: 'flag',
                  questionId: item.id,
                  flagged: !session.flags.includes(item.id),
                })
              }
            >
              見直しフラグ
            </button>
            <button
              type="button"
              className="button primary"
              disabled={busy || expired || session.index === session.questionIds.length - 1}
              onClick={() => update({ type: 'navigate', index: session.index + 1 })}
            >
              次の問題へ
            </button>
          </div>
          <p aria-live="polite">
            回答済み {Object.keys(session.answers).length} / {session.questionIds.length} 問
          </p>
          <QuestionNavigator
            session={session}
            index={session.index}
            disabled={busy || expired}
            onSelect={(index) => update({ type: 'navigate', index })}
          />
          {confirming ? (
            <div className="notice dedicated-actions" role="group" aria-label="提出の確認">
              <p>
                未回答は {session.questionIds.length - Object.keys(session.answers).length} 問です。
              </p>
              <button
                type="button"
                className="button secondary"
                disabled={busy}
                onClick={() => setConfirming(false)}
              >
                見直しに戻る
              </button>
              <button
                type="button"
                className="button primary"
                disabled={busy || expired}
                onClick={() => void save(() => database.finish(pack, session.id, 'submitted'))}
              >
                提出して採点する
              </button>
            </div>
          ) : expired ? (
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => void save(() => database.finish(pack, session.id, 'timeout'))}
            >
              時間切れの結果を表示
            </button>
          ) : (
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => setConfirming(true)}
            >
              {isRetake ? '解き直しを終了する' : '受験を終了する'}
            </button>
          )}
        </section>
      ) : session === null && (originalId || retakeId) ? (
        <section className="panel">
          <h1>指定された記録が見つかりません</h1>
          <Link className="button secondary" to={viewLink()}>
            現在の専用模試へ
          </Link>
        </section>
      ) : session !== undefined ? (
        <section className="panel">
          <h1>{isRetake ? '模試の解き直し' : label}</h1>
          <p>
            {isRetake
              ? `${session?.questionIds.length}問・時間制限なし。`
              : '155問・180分・3択。採点対象は140問です。中断すると時計は停止します。'}
          </p>
          {session?.status === 'active' ? (
            <>
              {timed && (
                <p>
                  {paused ? '中断中 · ' : ''}残り時間{' '}
                  <span role="timer" aria-label="残り時間">
                    {timeLabel(seconds)}
                  </span>
                </p>
              )}
              <button
                type="button"
                className="button primary"
                disabled={busy || expired}
                onClick={resume}
              >
                {isRetake ? '解き直しを再開する' : '保存した模試を再開する'}
              </button>
              {isRetake && (
                <Link className="button secondary" to={viewLink(session.retakeOf)}>
                  元の模試結果へ
                </Link>
              )}
              {expired && (
                <button
                  type="button"
                  className="button secondary"
                  disabled={busy}
                  onClick={() => void save(() => database.finish(pack, session.id, 'timeout'))}
                >
                  時間切れの結果を表示
                </button>
              )}
            </>
          ) : (
            <button type="button" className="button primary" disabled={busy} onClick={start}>
              155問の模試を始める
            </button>
          )}
        </section>
      ) : null}
    </div>
  );
}

function ReviewedItem({
  item,
  selected,
  choiceOrder,
  index,
  position,
  total,
  previousIndex,
  nextIndex,
  onlyMissed,
  isRetake,
  headingRef,
  onSelect,
  onShowQuestionList,
  onToggleMissed,
}: {
  item: DedicatedExamItem;
  selected?: string;
  choiceOrder: string[];
  index: number;
  position: number;
  total: number;
  previousIndex?: number;
  nextIndex?: number;
  onlyMissed: boolean;
  isRetake: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  onSelect: (index: number) => void;
  onShowQuestionList: () => void;
  onToggleMissed: () => void;
}) {
  const choices = choiceOrder.map((id) => item.choices.find((choice) => choice.id === id)!);
  const labels = new Map(
    choices.map((choice, position) => [
      choice.id,
      String.fromCharCode(65 + position) + '．' + choice.text,
    ]),
  );
  const verdict = getExamVerdict(selected, item.correctChoiceId);
  return (
    <section className="dedicated-review" aria-labelledby="dedicated-review-title">
      <header className="dedicated-review-heading">
        <h2
          id="dedicated-review-title"
          ref={headingRef}
          tabIndex={-1}
          aria-describedby="dedicated-review-verdict"
        >
          問題 {index + 1} · {isRetake ? '解き直し' : item.scored ? '採点対象' : '採点対象外'}
        </h2>
        <span id="dedicated-review-verdict">
          <ExamVerdict status={verdict} />
        </span>
      </header>
      <div className="dedicated-review-nav" role="group" aria-label="解説の移動">
        <button
          className="button secondary small"
          type="button"
          disabled={previousIndex === undefined}
          onClick={() => previousIndex !== undefined && onSelect(previousIndex)}
        >
          前の解説
        </button>
        <span>
          {onlyMissed ? '対象 ' : ''}
          {position + 1} / {total}
        </span>
        <button
          className="button secondary small"
          type="button"
          disabled={nextIndex === undefined}
          onClick={() => nextIndex !== undefined && onSelect(nextIndex)}
        >
          次の解説
        </button>
        <button className="button secondary small" type="button" onClick={onShowQuestionList}>
          問題一覧
        </button>
        <ExamReviewFilter onlyMissed={onlyMissed} onToggle={onToggleMissed} />
      </div>
      <p className="dedicated-review-prompt">{item.prompt}</p>
      <dl className="dedicated-answer-summary">
        <div>
          <dt>あなたの回答</dt>
          <dd>{(selected && labels.get(selected)) || '未回答'}</dd>
        </div>
        <div>
          <dt>正答</dt>
          <dd>{labels.get(item.correctChoiceId)}</dd>
        </div>
      </dl>
      <div className="explanation">
        <h3>正答解説</h3>
        <p>{item.explanation}</p>
      </div>
      {item.media && <Media media={item.media} />}
      <details className="dedicated-choice-details">
        <summary>選択肢ごとの解説</summary>
        <dl className="choice-reasons">
          {choices.map((choice) => (
            <div key={choice.id}>
              <dt>
                {choice.id === item.correctChoiceId ? '正答 · ' : ''}
                {choice.id === selected ? 'あなたの回答 · ' : ''}
                {labels.get(choice.id)}
              </dt>
              <dd>{choice.explanation}</dd>
            </div>
          ))}
        </dl>
      </details>
      {item.sourceRefs?.length ? (
        <ul>
          {item.sourceRefs.map((source, index) => (
            <li key={index}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>{' '}
              · {source.locator}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
