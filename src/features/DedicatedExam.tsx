import { liveQuery } from 'dexie';
import { useEffect, useMemo, useRef, useState } from 'react';
import { domains } from '../content/blueprints';
import {
  remainingDedicatedSeconds,
  validateDedicatedExamPack,
  type DedicatedExamItem,
  type DedicatedExamPack,
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
}: {
  session: DedicatedExamSession;
  index: number;
  disabled?: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <details className="dedicated-navigator">
      <summary>解答状況・見直し</summary>
      <p className="muted">● 回答済み　⚑ 見直しフラグ</p>
      <div className="dedicated-grid">
        {session.questionIds.map((id, position) => {
          const answered = Boolean(session.answers[id]);
          const flagged = session.flags.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`button ${position === index ? 'primary' : 'secondary'}`}
              aria-current={position === index ? 'step' : undefined}
              aria-label={`問題 ${position + 1}${answered ? '、回答済み' : '、未回答'}${flagged ? '、フラグあり' : ''}`}
              disabled={disabled}
              onClick={() => onSelect(position)}
            >
              {position + 1}
              {answered && <span aria-hidden="true">●</span>}
              {flagged && <span aria-hidden="true">⚑</span>}
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
  const [session, setSession] = useState<DedicatedExamSession | null>();
  const [now, setNow] = useState(Date.now);
  const [taking, setTaking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reviewIndex, setReviewIndex] = useState<number>();
  const running = useRef(false);
  const quiz = useRef<HTMLElement>(null);
  const items = useMemo(() => new Map(pack.items.map((item) => [item.id, item])), [pack]);

  useEffect(() => {
    const subscription = liveQuery(() => database.sessionFor(pack)).subscribe({
      next: (value) => {
        setSession(value ?? null);
        setNow(Date.now());
      },
      error: () => setError('模試の保存データを読み込めませんでした。'),
    });
    return () => subscription.unsubscribe();
  }, [database, pack]);

  useEffect(() => {
    if (session?.status !== 'active') return;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [session?.status]);

  useEffect(() => {
    if (taking && quiz.current) {
      quiz.current.scrollIntoView({ block: 'start' });
      quiz.current.querySelector('h1')?.focus({ preventScroll: true });
    }
  }, [taking, session?.index]);

  const seconds = session?.status === 'active' ? remainingDedicatedSeconds(session, now) : 0;

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
    if (!session || session.status !== 'active' || seconds !== 0 || busy) return;
    if (finishRequested.current === session.id) return;
    finishRequested.current = session.id;
    setConfirming(false);
    void save(() => database.finish(pack, session.id, 'timeout'));
  }, [database, pack, session, seconds, busy]);

  const label =
    access === 'preview'
      ? (pack.title ?? '専用模試') + ' · ローカル検証'
      : (pack.title ?? '本番形式の専用模試');
  const item = session && items.get(session.questionIds[session.index]);
  const update = (action: Parameters<DedicatedExamDB['update']>[2]) => {
    if (session) void save(() => database.update(pack, session.id, action));
  };
  const start = () =>
    void save(async () => {
      const next = await database.start(pack);
      setSession(next);
      setTaking(true);
      setConfirming(false);
      setReviewIndex(undefined);
    });

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
          <h1>専用模試の結果</h1>
          <p>{session.finishedReason === 'timeout' ? '制限時間終了' : '提出済み'}</p>
          <div className="result-stats">
            <div>
              <span>採点対象の得点</span>
              <b>
                {session.result.correct} / {session.result.total} 問
              </b>
            </div>
            <div>
              <span>採点対象の正答率</span>
              <b>{session.result.rate}%</b>
            </div>
            <div>
              <span>採点対象の未回答</span>
              <b>{session.result.unanswered} 問</b>
            </div>
          </div>
          <p>
            採点対象外15問の回答は得点に含みません。全155問の回答数は{' '}
            {Object.keys(session.answers).length} 問です。
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>分野</th>
                  <th>正答</th>
                  <th>採点対象</th>
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
          <QuestionNavigator
            session={session}
            index={reviewIndex ?? -1}
            onSelect={setReviewIndex}
          />
          {reviewIndex !== undefined && (
            <ReviewedItem
              key={session.questionIds[reviewIndex]}
              item={items.get(session.questionIds[reviewIndex])!}
              selected={session.answers[session.questionIds[reviewIndex]]}
              number={reviewIndex + 1}
            />
          )}
          <button className="button secondary" type="button" onClick={start} disabled={busy}>
            同じセットで再受験する
          </button>
        </section>
      ) : session?.status === 'active' && taking && item ? (
        <section className="panel dedicated-run" ref={quiz}>
          <div className="quiz-top">
            <span className="pill">
              問題 {session.index + 1} / {session.questionIds.length}
            </span>
            <span role="timer" aria-label="残り時間">
              {timeLabel(seconds)}
            </span>
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                setTaking(false);
                setConfirming(false);
              }}
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
                  disabled={busy || seconds === 0}
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
              disabled={busy || seconds === 0 || session.index === 0}
              onClick={() => update({ type: 'navigate', index: session.index - 1 })}
            >
              前の問題へ
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={busy || seconds === 0}
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
              disabled={busy || seconds === 0 || session.index === session.questionIds.length - 1}
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
            disabled={busy || seconds === 0}
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
                disabled={busy || seconds === 0}
                onClick={() => void save(() => database.finish(pack, session.id, 'submitted'))}
              >
                提出して採点する
              </button>
            </div>
          ) : seconds === 0 ? (
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
              受験を終了する
            </button>
          )}
        </section>
      ) : session !== undefined ? (
        <section className="panel">
          <h1>{label}</h1>
          <p>155問・180分・3択。採点対象は140問です。中断中も時計は進みます。</p>
          {session?.status === 'active' ? (
            <>
              <p>
                残り時間{' '}
                <span role="timer" aria-label="残り時間">
                  {timeLabel(seconds)}
                </span>
              </p>
              <button
                type="button"
                className="button primary"
                disabled={busy || seconds === 0}
                onClick={() => setTaking(true)}
              >
                保存した模試を再開する
              </button>
              {seconds === 0 && (
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
  number,
}: {
  item: DedicatedExamItem;
  selected?: string;
  number: number;
}) {
  return (
    <section className="dedicated-review">
      <h2>
        問題 {number} · {item.scored ? '採点対象' : '採点対象外'}
      </h2>
      <p>{item.prompt}</p>
      {item.media && <Media media={item.media} />}
      <dl className="choice-reasons">
        {item.choices.map((choice) => (
          <div key={choice.id}>
            <dt>
              {choice.id === item.correctChoiceId ? '正答 · ' : ''}
              {choice.id === selected ? 'あなたの回答 · ' : ''}
              {choice.text}
            </dt>
            <dd>{choice.explanation}</dd>
          </div>
        ))}
      </dl>
      <p>{item.explanation}</p>
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
