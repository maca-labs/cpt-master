import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCheck,
  Clock3,
  Flame,
  Target,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLearning } from '../app/context';
import { useStartLearning } from '../app/actions';
import { questions, units } from '../content';
import { domainIds, domains } from '../content/blueprints';
import { localDay, mastery, partitionAttempts, rate, streak } from '../engines/learning';
import { Pill, UnitCard } from '../components/Shared';
export default function Dashboard() {
  const { data, settings } = useLearning(),
    start = useStartLearning();
  const { first, repeat } = partitionAttempts(data.attempts, data.exposures);
  const studied = new Set(data.attempts.map((a) => a.groupId)).size;
  const due = data.reviews.filter((r) => r.dueAt <= new Date().toISOString()).length;
  const days = streak(
    [
      ...data.studyEvents.map((e) => localDay(settings.timezone, new Date(e.at))),
      ...data.attempts.map((a) => localDay(settings.timezone, new Date(a.at))),
    ],
    localDay(settings.timezone),
  );
  const weak = domainIds
    .map((id) => ({ id, score: mastery(data.attempts, id) }))
    .filter((d) => d.score !== null)
    .sort((a, b) => a.score! - b.score!);
  const recommended = weak.length ? units.filter((u) => u.domainId === weak[0].id)[0] : units[0];
  const complete = settings.diagnosticStatus === 'completed';
  return (
    <>
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">YOUR PERSONAL LEARNING SPACE</div>
          <h1>理解から、指導できる知識へ。</h1>
          <p>今日の一歩を、あなたのペースで。</p>
        </div>
        <div className="date-chip">
          {new Intl.DateTimeFormat('ja-JP', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            timeZone: settings.timezone,
          }).format(new Date())}
          <span>NSCA-CPT 学習ノート</span>
        </div>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <Pill tone="hero-pill">
            <Sparkles size={13} /> あなたに合った学習から
          </Pill>
          <h2>
            {complete
              ? '見つかった弱点を、\n確かな理解に変えよう。'
              : '知っていることを活かして、\n苦手なところから学ぼう。'}
          </h2>
          <p>
            {complete
              ? '診断の結果から次の学習へ。動画と要点で整理し、確認問題で理解を確かめましょう。'
              : 'まずは50問で学習の現在地をチェック。\n筋トレの経験を、根拠をもって伝えられる知識へ。'}
          </p>
          <div className="hero-actions">
            {complete ? (
              <Link className="button primary" to={`/learn/${recommended?.id}`}>
                おすすめ単元へ <ArrowRight size={17} />
              </Link>
            ) : (
              <button className="button primary" onClick={() => void start.diagnostic()}>
                {settings.diagnosticStatus === 'started'
                  ? '実力診断を再開'
                  : '50問の実力診断を始める'}
                <ArrowRight size={17} />
              </button>
            )}
            <Link className="text-link" to="/learn">
              教材から学ぶ <ArrowUpRight size={15} />
            </Link>
          </div>
          <small>診断は学習開始位置の参考です。合格可能性の判定ではありません。</small>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 350 270">
            <circle cx="190" cy="130" r="105" fill="#e4ebd5" />
            <circle cx="190" cy="130" r="85" fill="none" stroke="#b6c6a7" strokeDasharray="4 8" />
            <g transform="rotate(-13 180 140)">
              <rect
                x="108"
                y="41"
                width="139"
                height="187"
                rx="14"
                fill="#fdfdf6"
                stroke="#344b40"
                strokeWidth="2"
              />
              <path d="M129 77h76M129 87h48" stroke="#a1b39d" strokeWidth="4" />
              <circle cx="178" cy="135" r="30" fill="#e9d0ae" />
              <path
                d="m163 136 11 11 21-24"
                fill="none"
                stroke="#344b40"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M129 186h93m-93 12h65" stroke="#c5d0bc" strokeWidth="4" />
            </g>
            <g transform="rotate(17 260 196)" fill="#344b40">
              <rect x="218" y="187" width="86" height="12" rx="6" />
              <rect x="223" y="171" width="13" height="44" rx="4" />
              <rect x="211" y="179" width="9" height="28" rx="3" />
              <rect x="286" y="171" width="13" height="44" rx="4" />
              <rect x="302" y="179" width="9" height="28" rx="3" />
            </g>
            <circle cx="72" cy="96" r="24" fill="#f8fbf1" />
            <path d="M62 96h20m-10-10v20" stroke="#526d54" strokeWidth="2" />
            <circle cx="282" cy="59" r="17" fill="#eccba6" />
            <path d="m275 59 5 5 9-11" stroke="#465b45" fill="none" strokeWidth="2" />
            <path d="M74 209q-20-38-1-60 18 27 1 60m0 0q25-36 42-25-10 25-42 25" fill="#9caf90" />
          </svg>
        </div>
      </section>
      <div className="stats-grid">
        {[
          {
            icon: BookOpen,
            label: '取り組んだ問題',
            value: String(studied),
            unit: `/ ${questions.length}問`,
            hint: '同じ問題グループは1問として集計',
          },
          {
            icon: Target,
            label: '初見の正答率',
            value: first.length ? String(rate(first)) : '—',
            unit: first.length ? '%' : '',
            hint: `初見 ${first.length}問 · 解き直し ${repeat.length ? rate(repeat) + '%' : '未実施'}`,
          },
          {
            icon: Clock3,
            label: 'アプリ内学習時間',
            value: String(Math.floor(data.studyEvents.reduce((n, e) => n + e.seconds, 0) / 60)),
            unit: '分',
            hint: '前面で操作中の時間を記録',
          },
          {
            icon: Flame,
            label: '連続学習',
            value: String(days),
            unit: '日',
            hint: `学習日の基準：${settings.timezone}`,
          },
        ].map((s, i) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon stat-${i}`}>
              <s.icon size={20} />
            </div>
            <span>{s.label}</span>
            <strong>
              {s.value}
              <small>{s.unit}</small>
            </strong>
            <p>{s.hint}</p>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LEARNING MAP</span>
              <h2>分野ごとの理解度</h2>
            </div>
            <Link to="/learn" className="text-link">
              学習一覧 <ArrowUpRight size={15} />
            </Link>
          </div>
          <p className="muted small-text">
            各問題グループの最新回答で「正解し、根拠を説明できた」割合。
          </p>
          {domainIds.map((id) => {
            const score = mastery(data.attempts, id),
              count = data.attempts.filter((a) => a.domainId === id).length;
            return (
              <div className="domain-row" key={id}>
                <div>
                  <span className="domain-dot" style={{ background: domains[id].color }} />
                  {domains[id].short}
                  <strong>{score === null ? '未学習' : `${score}%`}</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${score ?? 0}%`, background: domains[id].color }} />
                </div>
                <small>
                  {count ? `${count}回答の記録` : 'まだ回答の記録がありません'} · 出題基準{' '}
                  {domains[id].scored} / 140問
                </small>
              </div>
            );
          })}
        </section>
        <section className="today-panel">
          <div className="eyebrow">YOUR NEXT STEP</div>
          <h2>今日のおすすめ</h2>
          <div className="today-icon">
            <CheckCheck size={29} />
          </div>
          <Pill>{weak.length ? '回答から選んだ単元' : 'まずは現在地を知る'}</Pill>
          <h3>{complete ? recommended?.title : '50問の実力診断'}</h3>
          <p>
            {complete
              ? '理解度の低い分野から、要点を整理しましょう。すでに知っている内容は確認問題から始められます。'
              : '4つの出題分野をひと通り確認。結果をもとに次に学ぶ単元を提案します。'}
          </p>
          {complete ? (
            <Link to={`/learn/${recommended?.id}`} className="button secondary">
              単元を開く <ArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/diagnostic" className="button secondary">
              診断について見る <ArrowRight size={16} />
            </Link>
          )}
          <div className="review-callout">
            <RotateCcw size={18} />
            <div>
              <b>復習待ち {due}問</b>
              <small>{due ? '忘れる前に、もう一度。' : '登録した問題がここに集まります。'}</small>
            </div>
            <Link to="/review" aria-label="復習一覧へ">
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </section>
      </div>
      <div className="section-heading spaced">
        <div>
          <span className="eyebrow">BUILD YOUR FOUNDATION</span>
          <h2>基礎から、つながる学び</h2>
        </div>
        <Link to="/learn" className="text-link">
          全8単元を見る <ArrowRight size={16} />
        </Link>
      </div>
      <div className="unit-grid featured">
        {units.slice(0, 4).map((u, i) => (
          <UnitCard key={u.id} unit={u} index={i} />
        ))}
      </div>
      <div className="bottom-note">
        <span className="status-dot" />
        学習履歴はこの端末に保存されます。<Link to="/settings">バックアップと採用した出題基準</Link>
      </div>
    </>
  );
}
