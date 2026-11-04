import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, ListChecks } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isRecommendedVideo } from '../engines/video-review';
import { eligible } from '../engines/learning';
import { reservedStrictGroups } from '../engines/practice-selection';
import { units, questions, seedVideos } from '../content';
import { domains, domainIds } from '../content/blueprints';
import { useLearning } from '../app/context';
import { useStartLearning } from '../app/actions';
import { db, mergedVideos } from '../storage/db';
import {
  Empty,
  PageTitle,
  Pill,
  SourceList,
  UnitArt,
  UnitCard,
  VideoCard,
} from '../components/Shared';
export function Catalog() {
  const [filter, setFilter] = useState('all');
  return (
    <>
      <PageTitle
        eyebrow="CURRICULUM"
        title="学びを、ひとつずつ。"
        description="知っている単元は確認問題から。迷ったら基礎からつなげて学びましょう。"
      />
      <div className="filter-row">
        <button
          className={filter === 'all' ? 'chip active' : 'chip'}
          onClick={() => setFilter('all')}
        >
          すべての単元
        </button>
        {domainIds.map((id) => (
          <button
            key={id}
            className={filter === id ? 'chip active' : 'chip'}
            onClick={() => setFilter(id)}
          >
            {domains[id].short}
          </button>
        ))}
      </div>
      <div className="unit-grid">
        {units
          .map((u, i) => ({ u, i }))
          .filter(({ u }) => filter === 'all' || u.domainId === filter)
          .map(({ u, i }) => (
            <UnitCard key={u.id} unit={u} index={i} />
          ))}
      </div>
      <p className="muted small-text">
        {units.length}単元・{questions.length}
        問を収録。公式出題範囲の全項目を網羅したものではありません。
        <a
          className="text-link"
          href="https://github.com/maca-labs/cpt-master/blob/main/docs/CURRICULUM_GAPS.md"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          出題範囲との対応・未収録項目
        </a>
      </p>
    </>
  );
}
export function Lesson() {
  const { id } = useParams();
  const unit = units.find((u) => u.id === id);
  const { data, settings, run } = useLearning(),
    start = useStartLearning();
  const saved = data.unitProgress.find((p) => p.unitId === id);
  const [rating, setRating] = useState(saved?.rating ?? 0),
    [note, setNote] = useState(saved?.note ?? '');
  useEffect(() => {
    setRating(saved?.rating ?? 0);
    setNote(saved?.note ?? '');
  }, [id]);
  if (!unit)
    return (
      <Empty title="単元が見つかりません" body="学習一覧から選んでください。">
        <Link to="/learn">学習一覧へ</Link>
      </Empty>
    );
  const videos = mergedVideos(seedVideos, data.videoOverrides).filter((v) =>
    v.unitIds.includes(unit.id),
  );
  const allCount = questions.filter(
    (q) => eligible(q) && q.unitId === unit.id && q.pool !== 'exam',
  ).length;
  const reserved = reservedStrictGroups(data.sessions, questions);
  const diagnosticHeld = questions.filter(
    (q) =>
      eligible(q) &&
      q.unitId === unit.id &&
      q.pool === 'diagnostic' &&
      !['completed', 'skipped'].includes(settings.diagnosticStatus),
  ).length;
  const strictHeld = questions.filter(
    (q) =>
      eligible(q) &&
      q.unitId === unit.id &&
      q.pool !== 'exam' &&
      reserved.has(q.groupId) &&
      (['completed', 'skipped'].includes(settings.diagnosticStatus) || q.pool !== 'diagnostic'),
  ).length;
  const available = questions.filter(
    (q) =>
      eligible(q) &&
      q.unitId === unit.id &&
      q.pool !== 'exam' &&
      !reserved.has(q.groupId) &&
      (['completed', 'skipped'].includes(settings.diagnosticStatus) || q.pool !== 'diagnostic'),
  ).length;
  return (
    <>
      <Link className="back-link" to="/learn">
        <ArrowLeft size={15} />
        学習一覧
      </Link>
      <div className="lesson-header">
        <div>
          <Pill>
            {domains[unit.domainId].short} / {unit.level}
          </Pill>
          <h1>{unit.title}</h1>
          <p>{unit.subtitle}</p>
          <span className="muted">
            <Clock3 size={15} /> {unit.minutes}分目安 · 確認問題 {allCount}問
          </span>
          <div className="hero-actions">
            <button
              onClick={() =>
                document.getElementById('lesson-check')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="button primary"
            >
              <ListChecks size={17} />
              確認問題から始める
            </button>
            <button
              className="text-link anchor-button"
              onClick={() =>
                document.getElementById('lesson-text')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              要点解説へ <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <UnitArt unit={unit} large />
      </div>
      <div className="lesson-layout">
        <article className="lesson-content">
          <section className="panel" id="lesson-objectives">
            <div className="step-label">01 / LEARNING OBJECTIVES</div>
            <h2>この単元でできるようになること</h2>
            <ul className="objective-list">
              {unit.objectives.map((o) => (
                <li key={o.id}>
                  <Check size={16} />
                  {o.text}
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <div className="step-label">02 / PRE-CHECK</div>
            <h2>いまの理解を振り返る</h2>
            <p>
              上の学習目標を、自分の言葉で説明できますか？
              自己評価は演習の習熟度とは別に記録します。
            </p>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={rating === n ? 'rating active' : 'rating'}
                  onClick={() => setRating(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <small>1：まだ説明できない　〜　5：指導例とともに説明できる</small>
            <button
              className="button small ghost"
              onClick={() =>
                void run(() =>
                  db.unitProgress.put({
                    unitId: unit.id,
                    rating,
                    note,
                    updatedAt: new Date().toISOString(),
                  }),
                )
              }
            >
              自己評価を保存
            </button>
          </section>
          <section id="lesson-videos">
            <div className="section-heading">
              <div>
                <div className="step-label">03 / WATCH & CONNECT</div>
                <h2>動画で、イメージをつかむ</h2>
              </div>
            </div>
            <div className="notice">
              内容未確認の動画は補助候補です。要点・正答根拠は下記の参照資料から作成しています。動画はオンラインで利用します。
            </div>
            {videos.some((v) => isRecommendedVideo(v, unit.id)) ? (
              <>
                <h3>内容を照合したおすすめ</h3>
                {videos
                  .filter((v) => isRecommendedVideo(v, unit.id))
                  .map((v) => (
                    <VideoCard key={v.id} video={v} unitId={unit.id} />
                  ))}
              </>
            ) : (
              <div className="notice">
                この単元のおすすめは確認待ちです。以下は未確認・確認保留の候補です。
              </div>
            )}
            {videos.some((v) => !isRecommendedVideo(v, unit.id)) && <h3>未確認・確認保留の候補</h3>}
            {videos.length ? (
              videos
                .filter((v) => !isRecommendedVideo(v, unit.id))
                .map((v) => <VideoCard key={v.id} video={v} unitId={unit.id} />)
            ) : (
              <Empty
                title="確認できた動画がありません"
                body="動画管理から個人用の動画を追加できます。"
              />
            )}
          </section>
          <section className="panel lesson-text" id="lesson-text">
            <div className="step-label">04 / KEY CONCEPTS</div>
            <h2>要点をつなげて理解する</h2>
            {unit.sections.map((s, i) => (
              <div className="text-section" key={s.title}>
                <span className="section-number">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {['anatomy', 'physiology'].includes(unit.id) && (
              <div className="concept-flow" aria-label="学習のつながり">
                {(unit.id === 'anatomy'
                  ? ['関節運動を観察', '関わる筋を考える', '負荷と目的を確認', '指導の理由を説明']
                  : ['運動の条件を確認', '供給機構を考える', '疲労と回復を評価', '負荷・休息を調整']
                ).map((t, i) => (
                  <div key={t}>
                    <span>{i + 1}</span>
                    {t}
                    {i < 3 && <ArrowRight size={15} />}
                  </div>
                ))}
              </div>
            )}
            <div className="case-box">
              <Pill>指導の現場で考える</Pill>
              <h3>{unit.example.situation}</h3>
              <p>{unit.example.judgment}</p>
            </div>
          </section>
          <section className="panel">
            <div className="step-label">05 / GLOSSARY</div>
            <h2>押さえたい重要語句</h2>
            <dl className="glossary">
              {unit.terms.map((t) => (
                <div key={t.term}>
                  <dt>{t.term}</dt>
                  <dd>{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="panel check-panel" id="lesson-check">
            <div className="step-label">06 / CHECK YOUR UNDERSTANDING</div>
            <h2>根拠まで、説明できますか？</h2>
            <p>3択問題で理解を確認。正解しても理由が曖昧なら、復習に登録しましょう。</p>
            <button
              className="button primary"
              disabled={!available}
              onClick={() => void start.practice(unit.id)}
            >
              確認問題を解く（{Math.min(10, available)}問）
              <ArrowRight size={17} />
            </button>
            {diagnosticHeld > 0 && (
              <small>
                診断前のため、初回診断用の{diagnosticHeld}
                問は保留中です。診断完了またはスキップ後に利用できます。
              </small>
            )}
            {strictHeld > 0 && (
              <p className="muted small-text">
                {strictHeld}問は中断中の厳密未見演習で予約しています。
                <Link to="/practice">問題演習から再開する</Link>
              </p>
            )}
            <p className="muted small-text">
              解答後に正答・誤答理由・関連する学習目標と出典を表示します。
            </p>
          </section>
          <section className="panel">
            <div className="step-label">07 / YOUR LEARNING NOTE</div>
            <h2>気づきを残す</h2>
            <label className="field-label">
              単元メモ
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={20000}
                placeholder="自分の言葉で要点や指導例を書いてみましょう。"
              />
            </label>
            <button
              className="button secondary"
              onClick={() =>
                void run(() =>
                  db.unitProgress.put({
                    unitId: unit.id,
                    rating,
                    note,
                    updatedAt: new Date().toISOString(),
                  }),
                )
              }
            >
              <Check size={16} />
              メモを保存
            </button>
          </section>
          <section className="panel">
            <h2>
              <BookOpen size={20} />
              参照資料
            </h2>
            <p className="muted small-text">
              本文は独自に作成。資料との照合はAIによるもので、専門家レビューは未実施です。
            </p>
            <SourceList refs={unit.sourceRefs} />
          </section>
        </article>
        <aside className="lesson-toc">
          <span className="eyebrow">IN THIS UNIT</span>
          {[
            ['lesson-objectives', '学習目標'],
            ['lesson-videos', '動画学習'],
            ['lesson-text', '要点解説'],
            ['lesson-check', '確認問題'],
          ].map(([anchor, label]) => (
            <button
              key={anchor}
              onClick={() =>
                document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {label}
              <ArrowRight size={14} />
            </button>
          ))}
          <div className="notice">
            視聴だけで習得済みにはしません。確認問題と、根拠の説明で理解を確かめます。
          </div>
        </aside>
      </div>
    </>
  );
}
