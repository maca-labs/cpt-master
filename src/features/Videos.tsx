import { ArrowDown, ArrowUp, Edit3, Plus, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { useLearning } from '../app/context';
import { seedVideos, units } from '../content';
import type { Video } from '../domain/types';
import { db, downloadJson, mergedVideos, parseYoutubeUrl, toPersonalVideo } from '../storage/db';
import { isRecommendedVideo } from '../engines/video-review';
import { PageTitle, Pill, VideoCard } from '../components/Shared';
export default function Videos() {
  const { data, run } = useLearning();
  const videos = mergedVideos(seedVideos, data.videoOverrides);
  const [filter, setFilter] = useState('all'),
    [editing, setEditing] = useState<Video | null>(null),
    [show, setShow] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'recommended' | 'candidate'>('all');
  const [url, setUrl] = useState(''),
    [title, setTitle] = useState(''),
    [channel, setChannel] = useState(''),
    [reason, setReason] = useState(''),
    [unitIds, setUnitIds] = useState<string[]>([]),
    [confirmed, setConfirmed] = useState(false);
  const open = (video?: Video) => {
    setEditing(video ?? null);
    setUrl(video?.url ?? '');
    setTitle(video?.title ?? '');
    setChannel(video?.channel ?? '');
    setReason(video?.reason ?? '');
    setUnitIds(video?.unitIds ?? []);
    setConfirmed(false);
    setShow(true);
  };
  const save = () =>
    run(async () => {
      const youtubeId = parseYoutubeUrl(url);
      if (!title.trim() || !channel.trim() || !reason.trim() || !unitIds.length)
        throw new Error('タイトル・チャンネル・学習目的・単元を入力してください。');
      if (videos.some((v) => v.youtubeId === youtubeId && v.id !== editing?.id))
        throw new Error('同じ動画は登録済みです。既存動画を編集してください。');
      const id = editing?.id ?? `personal-${crypto.randomUUID()}`;
      const video: Video = {
        id,
        youtubeId,
        title: title.trim(),
        channel: channel.trim(),
        url: `https://www.youtube.com/watch?v=${youtubeId}`,
        unitIds,
        objectiveIds: unitIds.map((uid) => units.find((u) => u.id === uid)!.objectives[0].id),
        difficulty: editing?.difficulty ?? '基礎',
        order: editing?.order ?? videos.length + 1,
        reason: reason.trim(),
        metadata: {
          status: confirmed ? 'confirmed' : 'unconfirmed',
          checkedAt: new Date().toISOString(),
          method: confirmed
            ? '利用者が元動画のタイトル・チャンネルを手動確認'
            : '利用者の入力。実在・正式メタデータは未確認',
          evidenceUrl: url,
        },
        playback: { status: 'unconfirmed', checkedAt: null, method: null },
        content: { status: 'unreviewed', checkedAt: null, method: null, sourceRefs: [] },
      };
      await db.videoOverrides.put({ id, video });
      setShow(false);
    });
  const reorder = (index: number, direction: number) =>
    run(async () => {
      const other = videos[index + direction];
      if (!other) return;
      const reordered = [...videos];
      [reordered[index], reordered[index + direction]] = [
        reordered[index + direction],
        reordered[index],
      ];
      await db.videoOverrides.bulkPut(
        reordered.map((v, i) => ({ id: v.id, video: toPersonalVideo({ ...v, order: i }) })),
      );
    });
  return (
    <>
      <PageTitle
        eyebrow="WATCH, CONNECT, UNDERSTAND"
        title="知識を、動きと結びつける。"
        description="単元につながる動画候補と、自分だけの学習メモ。"
      >
        <button className="button primary" onClick={() => open()}>
          <Plus size={17} />
          動画を追加
        </button>
      </PageTitle>
      <div className="notice">
        編集はこの端末の個人設定です。配布教材やGitHub上のファイルは更新しません。内容未確認の候補を、内容確認済みのおすすめ動画とは区別しています。動画は取得・保存しません。
      </div>
      <div className="filter-row">
        <button
          className={reviewFilter === 'all' ? 'chip active' : 'chip'}
          onClick={() => setReviewFilter('all')}
        >
          すべて {videos.length}本
        </button>
        <button
          className={reviewFilter === 'recommended' ? 'chip active' : 'chip'}
          onClick={() => setReviewFilter('recommended')}
        >
          おすすめ {videos.filter((v) => isRecommendedVideo(v)).length}本
        </button>
        <button
          className={reviewFilter === 'candidate' ? 'chip active' : 'chip'}
          onClick={() => setReviewFilter('candidate')}
        >
          候補・確認保留 {videos.filter((v) => !isRecommendedVideo(v)).length}本
        </button>
        <select
          aria-label="動画の対応単元"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">すべての単元</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.title}
            </option>
          ))}
        </select>
        <button
          className="button small ghost"
          onClick={() =>
            downloadJson(
              { app: 'cpt-master-videos', formatVersion: 1, videos },
              'cpt-master-videos.json',
            )
          }
        >
          動画一覧JSONを書き出す
        </button>
        <small>個人設定の取り込みは設定画面のバックアップから</small>
      </div>
      <div className="video-grid">
        {videos
          .map((v, i) => ({ v, i }))
          .filter(({ v }) => filter === 'all' || v.unitIds.includes(filter))
          .filter(
            ({ v }) =>
              reviewFilter === 'all' ||
              (reviewFilter === 'recommended' ? isRecommendedVideo(v) : !isRecommendedVideo(v)),
          )
          .map(({ v, i }) => (
            <div key={v.id}>
              <div className="video-management">
                <span>
                  {v.unitIds.map((id) => units.find((u) => u.id === id)?.title).join(' / ')}
                </span>
                <div>
                  {seedVideos.some((seed) => seed.id === v.id) &&
                    data.videoOverrides.some((o) => o.id === v.id) && (
                      <button
                        className="icon-button"
                        aria-label={`${v.title}を配布設定に戻す`}
                        title="配布設定に戻す（視聴記録とメモは保持）"
                        onClick={() => void run(() => db.videoOverrides.delete(v.id))}
                      >
                        <RotateCcw size={15} />
                      </button>
                    )}
                  <button
                    className="icon-button"
                    aria-label={`${v.title}を上へ`}
                    disabled={i === 0}
                    onClick={() => void reorder(i, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`${v.title}を下へ`}
                    disabled={i === videos.length - 1}
                    onClick={() => void reorder(i, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`${v.title}を編集`}
                    onClick={() => open(v)}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`${v.title}をこの端末で非表示`}
                    onClick={() =>
                      void run(() =>
                        db.videoOverrides.put({
                          id: v.id,
                          deleted: true,
                          video: toPersonalVideo(v),
                        }),
                      )
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
              <VideoCard video={v} />
            </div>
          ))}
      </div>
      {data.videoOverrides.some((o) => o.deleted) && (
        <section className="panel">
          <h2>この端末で非表示にした動画</h2>
          {data.videoOverrides
            .filter((o) => o.deleted)
            .map((o) => (
              <div className="list-row" key={o.id}>
                <span>{o.video?.title ?? o.id}</span>
                <button
                  className="button small ghost"
                  onClick={() =>
                    void run(() =>
                      o.video
                        ? db.videoOverrides.put({ id: o.id, video: toPersonalVideo(o.video) })
                        : db.videoOverrides.delete(o.id),
                    )
                  }
                >
                  <RotateCcw size={14} />
                  再表示
                </button>
              </div>
            ))}
        </section>
      )}
      {show && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-dialog-title"
          >
            <div className="section-heading">
              <h2 id="video-dialog-title">
                {editing ? '動画の個人設定を編集' : '個人用の動画を追加'}
              </h2>
              <button className="icon-button" aria-label="閉じる" onClick={() => setShow(false)}>
                <X size={20} />
              </button>
            </div>
            <Pill>この端末に保存</Pill>
            <label className="field-label">
              YouTube URL
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                maxLength={2000}
              />
            </label>
            <label className="field-label">
              正式タイトル
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={500} />
            </label>
            <label className="field-label">
              チャンネル名
              <input value={channel} onChange={(e) => setChannel(e.target.value)} maxLength={300} />
            </label>
            <label className="field-label">
              何を学ぶために見るか
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={3000}
              />
            </label>
            <fieldset>
              <legend>対応単元</legend>
              {units.map((u) => (
                <label key={u.id} className="check-line">
                  <input
                    type="checkbox"
                    checked={unitIds.includes(u.id)}
                    onChange={(e) =>
                      setUnitIds(
                        e.target.checked ? [...unitIds, u.id] : unitIds.filter((id) => id !== u.id),
                      )
                    }
                  />
                  {u.title}
                </label>
              ))}
            </fieldset>
            <label className="check-line">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              元動画で正式タイトル・チャンネルを確認した
            </label>
            <p className="muted small-text">
              再生と内容の審査は未確認として保存します。URLだけから動画内容を判定しません。
            </p>
            <button className="button primary" onClick={() => void save()}>
              個人設定として保存
            </button>
          </section>
        </div>
      )}
    </>
  );
}
