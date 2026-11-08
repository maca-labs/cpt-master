import { Download, ExternalLink, FileCheck2, Info, ShieldCheck, Upload } from 'lucide-react';
import { useState } from 'react';
import { useLearning } from '../app/context';
import {
  db,
  downloadJson,
  exportBackup,
  restoreBackup,
  tableNames,
  validateBackup,
  type Backup,
} from '../storage/db';
import { blueprint, blueprintSources, domainIds, domains } from '../content/blueprints';
import { questions, seedVideos, units, contentVersion } from '../content';
import { isRecommendedVideo } from '../engines/video-review';
import { PageTitle, Pill } from '../components/Shared';
import { finalDevelopmentTargets } from '../content/release';
export function BlueprintDetails() {
  return (
    <section className="panel" id="blueprint">
      <div className="section-heading">
        <h2>採用した出題基準</h2>
        <Pill tone="amber">日本向け・暫定設定</Pill>
      </div>
      <p>整数問題数を設定として保持しています。割合の丸め値から配分を再計算しません。</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>分野</th>
              <th>採点対象</th>
              <th>50問診断</th>
              <th>Web割合</th>
              <th>日本PDF割合</th>
              <th>米国・参考のみ</th>
            </tr>
          </thead>
          <tbody>
            {domainIds.map((id, i) => (
              <tr key={id}>
                <td>{domains[id].short}</td>
                <td>{domains[id].scored}</td>
                <td>{domains[id].diagnostic}</td>
                <td>{[23, 32, 31, 14][i]}%</td>
                <td>{[25, 31, 31, 13][i]}%</td>
                <td>{blueprint.usReference.counts[i]}問</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small-text">
        専用模試の配分：採点対象140問 ＋ 参考の採点対象外15問 ／ 180分 ／ 3択・単一正答。
      </p>
      <ul className="plain-list">
        {blueprint.discrepancies.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <div className="source-list">
        {blueprintSources.map((s) => (
          <div key={s.id}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title}
              <ExternalLink size={12} />
            </a>
            <small>
              {s.locator} · 確認日 {s.checkedAt} · 版 {s.edition ?? '未確認'}
            </small>
          </div>
        ))}
      </div>
      <small>基準ID：{blueprint.id} ／ 適用開始日：未確認</small>
    </section>
  );
}
export default function Settings() {
  const { data, settings, run } = useLearning();
  const [pending, setPending] = useState<Backup | null>(null),
    [confirmed, setConfirmed] = useState(false),
    [notice, setNotice] = useState('');
  const exportData = () =>
    run(async () => {
      downloadJson(
        await exportBackup(),
        `cpt-master-backup-${new Date().toISOString().slice(0, 10)}.json`,
      );
      setNotice('JSONを書き出しました。安全な場所に保存してください。');
    });
  return (
    <>
      <PageTitle
        eyebrow="YOUR SPACE, YOUR DATA"
        title="学習ノートを、安心して育てる。"
        description="端末内の保存、見た目、バックアップと出題基準を確認できます。"
      />
      {notice && (
        <div className="notice success" role="status">
          {notice}
        </div>
      )}
      <div className="two-columns">
        <section className="panel">
          <h2>表示と保存</h2>
          <label className="field-label">
            テーマ
            <select
              value={settings.theme}
              onChange={(e) =>
                void run(() =>
                  db.settings.update('main', { theme: e.target.value as typeof settings.theme }),
                )
              }
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
              <option value="system">端末に合わせる</option>
            </select>
          </label>
          <p>学習日の基準：{settings.timezone}</p>
          <div className="notice">
            <ShieldCheck size={18} />
            学習履歴・メモ・動画の個人設定はIndexedDBでこのブラウザーに保存します。
          </div>
          <p className="small-text">
            端末間の自動同期はありません。PCとスマートフォン間はJSONを移してください。ブラウザーのデータ削除や公開先の変更では履歴を引き継げないことがあります。
          </p>
          <small>教材版 {contentVersion} · アプリ 0.6.6</small>
        </section>
        <section className="panel">
          <h2>教材の収録状況</h2>
          <div className="inventory">
            <span>学習本文</span>
            <b>{units.length}単元</b>
            <span>問題 / AIによる出典照合</span>
            <b>
              {questions.length} /{' '}
              {questions.filter((q) => q.review.status === 'source_checked').length}問
            </b>
            <span>人間の専門家レビュー</span>
            <b>{questions.filter((q) => q.review.status === 'expert_reviewed').length}問</b>
            <span>初期動画 / メタデータ確認</span>
            <b>
              {seedVideos.length} /{' '}
              {seedVideos.filter((v) => v.metadata.status === 'confirmed').length}本
            </b>
            <span>AIによる内容照合済みのおすすめ（確認範囲付き）</span>
            <b>{seedVideos.filter((v) => isRecommendedVideo(v)).length}本</b>
          </div>
          <p className="muted small-text">
            自動検査への合格は、科学的な正確性や専門家レビューを意味しません。公式問題の転載はしていません。
          </p>
          <a
            className="text-link"
            href="https://github.com/maca-labs/cpt-master/blob/main/docs/CONTENT_EXPANSION_REVIEW.md"
            target="_blank"
            rel="noreferrer"
          >
            出典照合・AIレビューの対象と留保
          </a>
        </section>
      </div>
      <section className="panel">
        <h2>
          <Download size={21} />
          バックアップと復元
        </h2>
        <p>解答・表示履歴、復習、視聴記録、メモ、お気に入り、動画の個人設定をJSONで移せます。</p>
        <div className="hero-actions">
          <button className="button secondary" onClick={() => void exportData()}>
            <Download size={17} />
            JSONを書き出す
          </button>
          <label className="button ghost file-button">
            <Upload size={17} />
            JSONを取り込む
            <input
              type="file"
              accept="application/json,.json"
              aria-label="バックアップJSONを選択"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPending(null);
                setConfirmed(false);
                if (file)
                  void run(async () => {
                    if (file.size > 15 * 1024 * 1024)
                      throw new Error('ファイルは15MB以下にしてください。');
                    const result = validateBackup(await file.text());
                    setPending(result);
                  });
                e.target.value = '';
              }}
            />
          </label>
        </div>
        {pending && (
          <div className="import-preview">
            <h3>
              <FileCheck2 size={20} />
              事前検査が完了しました
            </h3>
            <p>{new Date(pending.createdAt).toLocaleString('ja-JP')} のバックアップ</p>
            <div className="inventory">
              <span>解答履歴</span>
              <b>{pending.data.attempts.length}件</b>
              <span>動画の個人設定</span>
              <b>{pending.data.videoOverrides.length}件</b>
              <span>全レコード</span>
              <b>{tableNames.reduce((n, k) => n + pending.data[k].length, 0)}件</b>
            </div>
            <p className="small-text">
              現在のデータを残してマージします。同じIDはこの端末の記録を優先します。旧教材版2026-11-04.1と2026-11-04.2も、問題と選択肢への参照を検査して現行版へ移行します。
            </p>
            <label className="check-line">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              内容とマージ方法を確認しました
            </label>
            <button
              className="button primary"
              disabled={!confirmed}
              onClick={() =>
                void run(async () => {
                  downloadJson(await exportBackup(), 'cpt-master-before-import.json');
                  await restoreBackup(pending);
                  setPending(null);
                  setConfirmed(false);
                  setNotice('復元しました。復元前のバックアップも書き出しました。');
                })
              }
            >
              復元前バックアップを保存してマージ
            </button>
            <button className="button ghost" onClick={() => setPending(null)}>
              キャンセル
            </button>
          </div>
        )}
      </section>
      <BlueprintDetails />
      <section className="panel">
        <h2>
          <Info size={20} />
          このアプリについて
        </h2>
        <p>
          個人学習用の非公式アプリです。NSCAの認定教材ではありません。動画視聴はCPR/AED実技講習や資格認定条件の代替にはなりません。
        </p>
        <p className="muted small-text">
          通常教材{questions.length}
          問、学習用の集中模試20問、155問180分の通し演習、短縮模試を利用できます。
          専用模試3セットも利用できます。専用模試の出典照合はAIによるもので、人間の専門家レビューは未実施です。
          YouTubeの視聴には通信が必要です。
        </p>
        <p className="muted small-text">
          独自の最終開発目標：小単元{finalDevelopmentTargets.units.join('〜')}、通常
          {finalDevelopmentTargets.regularQuestions}問（診断
          {finalDevelopmentTargets.diagnosticIncluded}問を含む）、通常学習とは別の模試専用
          {finalDevelopmentTargets.questionsPerMock}問×{finalDevelopmentTargets.exclusiveMockSets}
          セット。公式の合格条件ではありません。
        </p>
      </section>
    </>
  );
}
