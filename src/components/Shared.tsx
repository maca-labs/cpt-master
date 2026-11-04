import { ArrowUpRight, Check, ExternalLink, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SourceRef, Unit, Video } from '../domain/types';
import { sources, units } from '../content';
import { domains } from '../content/blueprints';
import { useLearning } from '../app/context';
import { db } from '../storage/db';
import { useState } from 'react';
import { isRecommendedVideo } from '../engines/video-review';
const unitsForReviewLabel = (id: string) =>
  units.flatMap((u) => u.objectives).find((o) => o.id === id)?.text ?? id;
export function PageTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
export function Empty({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">✧</div>
      <h3>{title}</h3>
      <p>{body}</p>
      {children}
    </div>
  );
}
export function SourceList({ refs }: { refs: SourceRef[] }) {
  return (
    <div className="source-list">
      {refs.map((r, i) => {
        const s = sources.find((s) => s.id === r.sourceId);
        return (
          <div key={`${r.sourceId}-${i}`}>
            <a href={s?.url} target="_blank" rel="noreferrer">
              {s?.title ?? r.sourceId}
              <ExternalLink size={12} />
            </a>
            <small>
              {r.locator} · {s?.edition ?? '版表示未確認'} · 確認 {s?.checkedAt}
            </small>
            {s?.note && <small>{s.note}</small>}
          </div>
        );
      })}
    </div>
  );
}
export function UnitArt({ unit, large = false }: { unit: Unit; large?: boolean }) {
  const i = unit.id;
  return (
    <div className={`unit-art ${i} ${large ? 'large' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 220 130">
        <circle cx="170" cy="24" r="60" fill="currentColor" opacity=".08" />
        <path d="M30 105h160" stroke="currentColor" opacity=".18" />
        {i === 'anatomy' ? (
          <g stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round">
            <circle cx="112" cy="27" r="12" />
            <path d="M112 40v38m-28-25 28-7 28 7m-28 0-22 14m22-14 22 14m-22 11-19 31m19-31 20 31M99 53h26m-24 9h22m-21 9h20" />
            <circle cx="112" cy="78" r="4" />
          </g>
        ) : i === 'physiology' ? (
          <g stroke="currentColor" fill="none" strokeWidth="3">
            <path d="m124 15-33 55h24l-16 45 45-60h-27z" fill="currentColor" opacity=".18" />
            <path d="M40 67h28l10-21 13 42 12-21h20m29 0h27" />
            <circle cx="113" cy="65" r="46" strokeDasharray="3 6" opacity=".4" />
          </g>
        ) : i === 'assessment' ? (
          <g stroke="currentColor" fill="none" strokeWidth="3">
            <rect x="77" y="25" width="70" height="85" rx="9" />
            <rect x="95" y="20" width="35" height="14" rx="4" fill="currentColor" />
            <path d="m89 53 5 5 9-11m9 7h23m-46 23 5 5 9-11m9 7h23m-46 23h45" />
          </g>
        ) : i === 'nutrition' ? (
          <g stroke="currentColor" fill="none" strokeWidth="3">
            <circle cx="111" cy="70" r="42" />
            <circle cx="111" cy="70" r="31" opacity=".4" />
            <path d="M111 39v62m0-31h31M47 33v39m-7-39v22h14V33m-7 39v34m124-73v73m0-73q-16 23 0 34" />
          </g>
        ) : i === 'program' ? (
          <g stroke="currentColor" fill="none" strokeWidth="3">
            <path d="M62 104V78h22v26m16 0V57h22v47m16 0V35h22v69M58 104h111m-99-49 32-16 27 4 28-25" />
            <path d="m145 18h12v12" />
          </g>
        ) : i === 'technique' ? (
          <g stroke="currentColor" fill="none" strokeWidth="6" strokeLinecap="round">
            <path d="m64 81 91-43m-86 55-12-26m104-16-12-26m-88 77L45 64m128-20-16-38" />
            <circle cx="110" cy="66" r="39" opacity=".14" strokeWidth="1" />
          </g>
        ) : i === 'safety' ? (
          <g stroke="currentColor" fill="none" strokeWidth="3">
            <path d="m111 18 39 16v30q0 32-39 48-39-16-39-48V34z" />
            <path d="M111 44v40M91 64h40" strokeWidth="8" />
          </g>
        ) : (
          <g stroke="currentColor" fill="none" strokeWidth="3">
            <path d="M62 35q24-10 49 7v65q-25-17-49-7zm99 0q-24-10-50 7v65q25-17 50-7zM73 53l25 7m-25 9 25 7m26-16 25-7m-25 23 25-7" />
          </g>
        )}
      </svg>
    </div>
  );
}
export function UnitCard({ unit, index }: { unit: Unit; index: number }) {
  const { data } = useLearning();
  const count = new Set(data.attempts.filter((a) => a.unitId === unit.id).map((a) => a.groupId))
    .size;
  return (
    <Link to={`/learn/${unit.id}`} className="unit-card">
      <UnitArt unit={unit} />
      <div className="unit-card-body">
        <div className="card-meta">
          <span>UNIT {String(index + 1).padStart(2, '0')}</span>
          <span>{unit.minutes}分目安</span>
        </div>
        <h3>{unit.title}</h3>
        <p>{unit.subtitle}</p>
        <div className="card-foot">
          <Pill>
            {unit.level} · {domains[unit.domainId].short}
          </Pill>
          <ArrowUpRight size={17} />
        </div>
        <small>{count ? `${count}問に取り組み済み` : 'ここから学習を始める'}</small>
      </div>
    </Link>
  );
}
export function VideoCard({ video, unitId }: { video: Video; unitId?: string }) {
  const { data, run } = useLearning();
  const progress = data.videoProgress.find((v) => v.videoId === video.id);
  const [embed, setEmbed] = useState(false),
    [note, setNote] = useState(progress?.note ?? '');
  const recommended = isRecommendedVideo(video, unitId);
  const review = video.content.review;
  const methodLabel =
    review?.method === 'transcript' ? '字幕' : review?.method === 'visual' ? '映像' : '字幕・映像';
  const save = (watched = progress?.watched ?? false) =>
    run(() =>
      db.videoProgress.put({
        videoId: video.id,
        watched,
        note,
        updatedAt: new Date().toISOString(),
      }),
    );
  return (
    <article className="video-card">
      <div className="video-preview">
        <button
          className="play-circle"
          aria-label={`${video.title}を埋め込みで開く`}
          onClick={() => setEmbed(!embed)}
        >
          <Play size={20} fill="currentColor" />
        </button>
        <span>YouTube</span>
      </div>
      <div className="video-body">
        <Pill tone={recommended ? 'green' : 'amber'}>
          {recommended
            ? `おすすめ · ${review?.reviewerType === 'ai' ? 'AIによる' : '専門家による'}${methodLabel}照合`
            : review?.method === 'transcript'
              ? '確認保留の候補'
              : '内容未確認の候補'}
        </Pill>
        <h3>{video.title}</h3>
        <small>
          {video.channel} · {video.difficulty}
        </small>
        <p>{video.reason}</p>
        <a className="text-link" href={video.url} target="_blank" rel="noopener noreferrer">
          YouTubeで開く <ExternalLink size={14} />
        </a>
        <div className="video-status">
          メタデータ：{video.metadata.status === 'confirmed' ? '確認済み' : '未確認'} ／ 再生：
          {video.playback.status === 'unconfirmed' ? '未確認' : video.playback.status}
          <br />
          確認日 {video.metadata.checkedAt}
          <details>
            <summary>確認方法と内容審査の状態</summary>
            <p>{video.metadata.method}</p>
            {review ? (
              <>
                <p>
                  <b>内容確認日 {review.checkedAt}</b> ·{' '}
                  {review.reviewerType === 'ai' ? 'AIによる確認' : '人間の専門家による確認'}
                  <br />
                  {review.coverage}
                </p>
                <p>
                  対応する目標：
                  {review.objectiveIds.length
                    ? review.objectiveIds.map((id) => unitsForReviewLabel(id)).join(' / ')
                    : '対応確認待ち'}
                </p>
                <ul>
                  {review.findings.map((finding, i) => (
                    <li key={i}>{finding}</li>
                  ))}
                </ul>
                <p>
                  <b>確認できていない範囲・利用上の条件</b>
                </p>
                <ul>
                  {review.limitations.map((limitation, i) => (
                    <li key={i}>{limitation}</li>
                  ))}
                </ul>
                {video.content.sourceRefs.length > 0 && (
                  <SourceList refs={video.content.sourceRefs} />
                )}
                {review.evidence.map((e, i) => (
                  <p key={i}>
                    <a href={e.url} target="_blank" rel="noreferrer">
                      確認対象・照合資料 <ExternalLink size={10} />
                    </a>
                    <br />
                    {e.locator}
                  </p>
                ))}
              </>
            ) : (
              <p>内容未確認。タイトルや視聴済み記録だけではおすすめに変更しません。</p>
            )}
          </details>
        </div>
        <label className="check-line">
          <input
            type="checkbox"
            checked={progress?.watched ?? false}
            onChange={(e) => void save(e.target.checked)}
          />
          視聴済みとして記録（習熟度とは別）
        </label>
        <label className="field-label">
          学習メモ
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={20000}
            placeholder="気づいたこと、確認したいこと"
          />
        </label>
        <button className="button small ghost" onClick={() => void save()}>
          <Check size={14} />
          メモを保存
        </button>
      </div>
      {embed && (
        <div className="embed-wrap">
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <p>
            オンラインで利用します。埋め込めない場合は「YouTubeで開く」を使用してください。表示しただけでは再生確認済みにしません。
          </p>
        </div>
      )}
    </article>
  );
}
export function FavoriteButton({ questionId }: { questionId: string }) {
  const { data, run } = useLearning();
  const yes = data.favorites.some((f) => f.questionId === questionId);
  return (
    <button
      className={`icon-button ${yes ? 'starred' : ''}`}
      aria-label={yes ? 'お気に入りを解除' : 'お気に入りに登録'}
      onClick={() =>
        void run(() => (yes ? db.favorites.delete(questionId) : db.favorites.put({ questionId })))
      }
    >
      <Star size={19} fill={yes ? 'currentColor' : 'none'} />
    </button>
  );
}
