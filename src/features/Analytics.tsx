import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, Clock3, History, Target } from 'lucide-react';
import { useLearning } from '../app/context';
import { units } from '../content';
import { practiceBatchShortLabel } from '../content/batches';
import { domains } from '../content/blueprints';
import { Empty, PageTitle, Pill } from '../components/Shared';
import {
  buildAnalytics,
  comparableSessions,
  learningModes,
  sessionDifference,
  type DayActivity,
  type LearningMode,
  type SessionPerformance,
} from '../engines/analytics';

const modeNames: Record<LearningMode, string> = {
  diagnostic: '実力診断',
  practice: '問題演習',
  review: '復習',
  mock: '時間付き学習演習',
};
const number = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 1 });
const percent = (value: number | null) => (value === null ? '—' : `${number.format(value)}%`);
const responseTime = (value: number | null) =>
  value === null ? '—' : `${number.format(value / 1000)}秒`;
function studyTime(value: number | null) {
  if (value === null) return '未記録';
  const seconds = Math.round(value),
    minutes = Math.floor(seconds / 60);
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}時間${minutes % 60}分`
    : minutes
      ? `${minutes}分${seconds % 60}秒`
      : `${seconds}秒`;
}
function dateLabel(value: string, timezone: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
function resultUrl(session: SessionPerformance) {
  return session.mode === 'mock' ? `/exam-results/${session.id}` : `/results/${session.id}`;
}
function timerLabel(session: SessionPerformance) {
  if (session.mode !== 'mock') return '';
  return session.mockTimeMode === 'continuous'
    ? '時間配分練習'
    : session.mockTimeMode === 'study'
      ? '中断できるタイマー'
      : '時間方式の記録なし';
}
function sessionLabel(session: SessionPerformance) {
  if (session.mockRetakeOf) return '模試の解き直し';
  if (session.mode === 'mock')
    return { short: '短縮模試', through: '学習用通し演習', focus: '集中模試' }[
      session.mockFormat ?? 'short'
    ];
  if (session.mode === 'practice' && session.practice)
    return `${practiceBatchShortLabel(session.practice.batch)}・${
      session.practice.selection === 'strict_unseen'
        ? '厳密未見'
        : session.practice.selection === 'review'
          ? '既出を含む復習'
          : '未見優先'
    }`;
  return modeNames[session.mode];
}

function DailyChart({ days }: { days: DayActivity[] }) {
  const shown = days.slice(-14);
  const maximum = Math.max(...shown.map((day) => day.answerCount), 0);
  if (!maximum) return null;
  const step = 560 / shown.length;
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="学習日別の回答数グラフ">
      <svg
        viewBox="0 0 640 190"
        role="img"
        aria-label="記録のある直近14日分の回答数"
        style={{ minWidth: 520, width: '100%', display: 'block' }}
      >
        <title>記録のある日の回答数。空白の日の記録は補っていません。</title>
        <line x1="50" y1="145" x2="620" y2="145" stroke="var(--line)" />
        <text x="34" y="149" fontSize="11" fill="var(--muted)" textAnchor="end">
          0
        </text>
        <text x="34" y="30" fontSize="11" fill="var(--muted)" textAnchor="end">
          {maximum}
        </text>
        {shown.map((day, index) => {
          const height = (day.answerCount / maximum) * 112;
          const x = 54 + step * index;
          return (
            <g key={day.date}>
              <rect
                x={x}
                y={145 - height}
                width={Math.min(step - 8, 34)}
                height={height}
                rx="3"
                fill="var(--green)"
              >
                <title>
                  {day.date}：{day.answerCount}回答
                </title>
              </rect>
              <text
                x={x + Math.min(step - 8, 34) / 2}
                y="164"
                fontSize="10"
                fill="var(--muted)"
                textAnchor="middle"
              >
                {day.date.slice(5).replace('-', '/')}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Analytics() {
  const { data, settings } = useLearning();
  const analytics = buildAnalytics({ ...data, units, timezone: settings.timezone });
  const [mode, setMode] = useState<LearningMode>(() => analytics.sessions[0]?.mode ?? 'diagnostic');
  const [previousId, setPreviousId] = useState('');
  const comparable = comparableSessions(analytics.sessions, mode);
  const latest = comparable[0];
  const previous =
    comparable.slice(1).find((session) => session.id === previousId) ?? comparable[1];
  const difference = sessionDifference(latest, previous);
  const overall = analytics.overall;
  const hasAnswers = overall.answerCount > 0;
  return (
    <>
      <PageTitle
        eyebrow="YOUR LEARNING RECORD"
        title="積み重ねを、次の学びへ。"
        description="初見と解き直しを分け、記録された回答と学習時間から次の学習を考えます。"
      />
      <div className="notice">
        <BarChart3 size={18} />
        正答率は学習の目安です。少数の問題、既出問題、問題の難易度の違いが影響します。公式換算スコア・合格確率は計算しません。
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-0">
            <Target size={20} />
          </div>
          <span>厳密な初見の正答率</span>
          <strong data-testid="analytics-first-rate">{percent(overall.firstAccuracy)}</strong>
          <p>初見 {overall.firstCount}回答</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-1">
            <History size={20} />
          </div>
          <span>解き直しの正答率</span>
          <strong data-testid="analytics-repeat-rate">{percent(overall.repeatAccuracy)}</strong>
          <p>既出・先読み {overall.repeatCount}回答</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-2">
            <BookOpen size={20} />
          </div>
          <span>回答数と独立した内容</span>
          <strong data-testid="analytics-answer-count">
            {overall.answerCount}
            <small>回答</small>
          </strong>
          <p>{overall.independentGroups}問題グループ。同じ内容への反復を区別</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-3">
            <Clock3 size={20} />
          </div>
          <span>記録された学習時間</span>
          <strong style={{ fontSize: 24 }}>{studyTime(analytics.studySeconds)}</strong>
          <p>回答時間の中央値 {responseTime(overall.medianResponseMs)}</p>
        </div>
      </div>
      {!hasAnswers && (
        <Empty
          title="分析する回答は、まだありません。"
          body="診断や確認問題に回答すると、実際の記録に基づく集計を表示します。未学習の正答率は0%にしません。"
        >
          <Link className="button primary" to="/diagnostic">
            実力診断へ
            <ArrowRight size={16} />
          </Link>
          <Link className="button secondary" to="/practice">
            問題演習へ
          </Link>
        </Empty>
      )}
      <section className="panel">
        <h2>分野別の回答と理解の手がかり</h2>
        <p className="muted small-text">
          回答数には中断中の通常演習で保存した回答も含みます。時間付き学習演習の途中回答は、終了して採点するまで集計しません。「説明可」は自己申告です。初版50問の診断だけで全問題・全学習目標の習熟を判定しません。
        </p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="分野別の成績表">
          <table>
            <thead>
              <tr>
                <th scope="col">分野</th>
                <th scope="col">回答数</th>
                <th scope="col">独立グループ</th>
                <th scope="col">初見の正答率</th>
                <th scope="col">解き直し</th>
                <th scope="col">説明可</th>
                <th scope="col">回答時間中央値</th>
              </tr>
            </thead>
            <tbody>
              {analytics.domains.map((domain) => (
                <tr key={domain.id} data-testid={`analytics-domain-${domain.id}`}>
                  <th scope="row">{domains[domain.id].short}</th>
                  <td>{domain.answerCount}回答</td>
                  <td>{domain.independentGroups}グループ</td>
                  <td>
                    {percent(domain.firstAccuracy)}
                    <small>（{domain.firstCount}回答）</small>
                  </td>
                  <td>
                    {percent(domain.repeatAccuracy)}
                    <small>（{domain.repeatCount}回答）</small>
                  </td>
                  <td>
                    {percent(domain.explainRate)}
                    <small>
                      （{domain.explainCount}/{domain.answerCount}）
                    </small>
                  </td>
                  <td>{responseTime(domain.medianResponseMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small-text muted">
          初見は全履歴で最初の回答を基準にし、以前の設問表示や解説先読みがある場合は除外します。解き直しで改善しても、独立した初見の証拠が増えたとは数えません。
        </p>
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>優先して復習する単元</h2>
          <Link className="text-link" to="/review">
            復習一覧
            <ArrowRight size={15} />
          </Link>
        </div>
        <p className="muted small-text">
          各問題グループの最新回答で「正解し、根拠を説明できた」割合が低い順。未学習単元は順位に入れません。
        </p>
        {analytics.weakUnits.length ? (
          analytics.weakUnits.map((unit, index) => (
            <div className="weak-row" key={unit.id}>
              <div>
                <Pill tone={index === 0 ? 'amber' : 'neutral'}>優先 {index + 1}</Pill>
                <h3>{unit.title}</h3>
                <p className="small-text">
                  最新の理解目安 {percent(unit.latestUnderstandingRate)} · 要復習{' '}
                  {unit.latestIssueGroups}/{unit.independentGroups}グループ
                </p>
                <small>
                  {unit.answerCount}回答からの目安。
                  {unit.independentGroups < 5
                    ? '件数が少ないため、追加の演習で確かめてください。'
                    : '同じ内容の反復による影響があります。'}
                </small>
              </div>
              <Link className="button small secondary" to={`/learn/${unit.id}`}>
                教材・関連動画へ
                <ArrowRight size={15} />
              </Link>
            </div>
          ))
        ) : (
          <p className="muted">
            {hasAnswers
              ? '現在の回答記録では、優先復習の対象はありません。未学習の分野も確認しましょう。'
              : '回答後に、誤答や根拠が曖昧だった単元を表示します。'}
          </p>
        )}
      </section>
      <section className="panel">
        <h2>同じ形式の過去の記録と比べる</h2>
        <div className="filter-row">
          <label>
            比較する学習形式{' '}
            <select
              aria-label="比較する学習形式"
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as LearningMode);
                setPreviousId('');
              }}
            >
              {learningModes.map((value) => (
                <option key={value} value={value}>
                  {modeNames[value]}
                </option>
              ))}
            </select>
          </label>
          {comparable.length > 1 && (
            <label>
              比較する過去の記録{' '}
              <select
                aria-label="比較する過去の記録"
                value={previous?.id ?? ''}
                onChange={(event) => setPreviousId(event.target.value)}
              >
                {comparable.slice(1).map((session) => (
                  <option key={session.id} value={session.id}>
                    {dateLabel(session.completedAt ?? session.startedAt, settings.timezone)} ·{' '}
                    {session.total}問
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {latest ? (
          <>
            <div className="result-stats">
              <div>
                <span>最新の{sessionLabel(latest)}</span>
                <b>{percent(latest.accuracy)}</b>
                <p>
                  {latest.correct}/{latest.evaluatedTotal ?? latest.total}問 正解 · 未回答{' '}
                  {latest.unanswered}問
                </p>
                <small>
                  初見 {latest.firstCount} · 解き直し {latest.repeatCount}
                  {latest.practice?.selection === 'strict_unseen' &&
                    ` · 出題${latest.total}問・評価除外${latest.excludedCount ?? 0}問`}
                </small>
              </div>
              <div>
                <span>比較する過去の記録</span>
                <b>{percent(previous?.accuracy ?? null)}</b>
                <p>
                  {previous
                    ? `${previous.correct}/${previous.evaluatedTotal ?? previous.total}問 正解 · 未回答 ${previous.unanswered}問`
                    : '比較できる過去の完了記録がありません'}
                </p>
                {previous && (
                  <small>
                    初見 {previous.firstCount} · 解き直し {previous.repeatCount}
                  </small>
                )}
              </div>
              <div>
                <span>差（最新 − 過去）</span>
                <b data-testid="analytics-session-difference">
                  {difference === null
                    ? '—'
                    : `${difference > 0 ? '+' : ''}${number.format(difference)}`}
                </b>
                <p>
                  {difference === null
                    ? '比較するには同じ形式の完了記録が必要です'
                    : 'ポイント。丸め前の比率から算出'}
                </p>
              </div>
            </div>
            <p className="muted small-text">
              完了した学習だけを比較します。通常学習・時間付き演習は未回答も出題数の分母に含めます。厳密未見演習は実際に初見と判定できた回答だけを評価し、既出・先読みは除外します。
              {mode === 'mock' &&
                `${sessionLabel(latest)}は最新と同じ${latest.total}問・${timerLabel(latest)}の記録だけを比較候補にします。`}
              {mode === 'practice' &&
                '問題演習は問題数・対象バッチ・未見条件が同じ記録だけを比べます。'}
              問題・単元・難易度・初見の比率が違うため、率の差をそのまま学習効果とは判断できません。
            </p>
          </>
        ) : (
          <p className="muted">
            この形式の完了記録はまだありません。中断中の学習は比較対象に含めません。
          </p>
        )}
      </section>
      <section className="panel">
        <h2>完了した学習の履歴</h2>
        {analytics.sessions.length ? (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="完了した学習の成績表"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">日付</th>
                  <th scope="col">形式</th>
                  <th scope="col">正解／採点対象</th>
                  <th scope="col">正答率</th>
                  <th scope="col">未回答</th>
                  <th scope="col">初見／解き直し</th>
                  <th scope="col">結果</th>
                </tr>
              </thead>
              <tbody>
                {analytics.sessions.slice(0, 30).map((session) => (
                  <tr key={session.id}>
                    <td>
                      {!session.completedAt && '開始 '}
                      {dateLabel(session.completedAt ?? session.startedAt, settings.timezone)}
                    </td>
                    <td>
                      {sessionLabel(session)}
                      {session.mode === 'mock' && <small> · {timerLabel(session)}</small>}
                    </td>
                    <td>
                      {session.correct}/{session.evaluatedTotal ?? session.total}問
                      {session.practice?.selection === 'strict_unseen' && (
                        <small>
                          （出題{session.total}・除外{session.excludedCount ?? 0}）
                        </small>
                      )}
                    </td>
                    <td>{percent(session.accuracy)}</td>
                    <td>{session.unanswered}問</td>
                    <td>
                      {session.firstCount}/{session.repeatCount}回答
                    </td>
                    <td>
                      <Link className="text-link" to={resultUrl(session)}>
                        結果へ
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">完了した学習がここに表示されます。</p>
        )}
        {analytics.sessions.length > 30 && (
          <p className="small-text muted">
            この表は直近30件。集計と過去比較の候補には全履歴を使います。
          </p>
        )}
      </section>
      <section className="panel">
        <h2>学習日別の記録</h2>
        <p className="muted small-text">
          保存時刻を{settings.timezone}
          に換算。時間はアプリ内で記録した操作中の時間で、回答時間とは別です。完了日時のない旧記録は日別の完了数へ含めません。
        </p>
        {!analytics.days.length ? (
          <p className="muted">日別の記録はまだありません。</p>
        ) : (
          <>
            <DailyChart days={analytics.days} />
            <div className="table-scroll" tabIndex={0} role="region" aria-label="学習日別の記録表">
              <table>
                <thead>
                  <tr>
                    <th scope="col">日付</th>
                    <th scope="col">回答</th>
                    <th scope="col">初見</th>
                    <th scope="col">解き直し</th>
                    <th scope="col">完了した学習</th>
                    <th scope="col">学習時間</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.days
                    .slice(-30)
                    .reverse()
                    .map((day) => (
                      <tr key={day.date}>
                        <th scope="row">{day.date}</th>
                        <td>{day.answerCount}回答</td>
                        <td>{day.firstCount}</td>
                        <td>{day.repeatCount}</td>
                        <td>{day.completedSessions}回</td>
                        <td>{studyTime(day.studySeconds)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="muted small-text">
              表は記録のある直近30日分、グラフは直近14日分です。記録のない日の値は補っていません。
            </p>
          </>
        )}
      </section>
    </>
  );
}
