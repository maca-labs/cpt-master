import { writeFile } from 'node:fs/promises';
import { units, questions, seedVideos } from '../src/content';
import { isRecommendedVideo } from '../src/engines/video-review';
import baseline from '../tests/fixtures/v05-video-manifest.json';

const priorIds = new Set(baseline.map((v) => v.id));
const prior = seedVideos.filter((v) => priorIds.has(v.id));
const additions = seedVideos.filter((v) => !priorIds.has(v.id));
const recommended = seedVideos.filter((v) => isRecommendedVideo(v));
const target = units.filter(
  (u) => u.id.startsWith('ex-') && !prior.some((v) => isRecommendedVideo(v, u.id)),
);
if (target.length !== 22)
  throw new Error(`対象は旧版で推薦のなかった22単元、実際は${target.length}`);
const covered = target.filter((u) => recommended.some((v) => isRecommendedVideo(v, u.id)));
const rows = target.flatMap((u) =>
  u.objectives.map((o) => {
    const mapped = seedVideos.filter((v) => v.objectiveIds.includes(o.id));
    return {
      unit: u,
      objective: o,
      recommended: mapped.filter((v) => isRecommendedVideo(v, u.id)),
      candidates: mapped.filter((v) => !isRecommendedVideo(v, u.id)),
    };
  }),
);
const link = (v: (typeof seedVideos)[number]) => `[${v.youtubeId}](${v.url})`;
const report = `# 0.5.1 動画の内容確認と22単元の対応表

確認日2026-11-05（JST）。旧版18本のうちおすすめ10本・候補8本は全レコードを維持し、動画を追加した。問題は${questions.length}問・教材${units.length}単元のまま。教材版・問題ID・IndexedDB構造は変更しない。

追加${additions.length}本：限定おすすめ${additions.filter((v) => isRecommendedVideo(v)).length}本、候補${additions.filter((v) => !isRecommendedVideo(v)).length}本。合計${seedVideos.length}本：限定おすすめ${recommended.length}本、候補${seedVideos.length - recommended.length}本。元の不足22単元のうち${covered.length}単元に、少なくとも1つの目標の**一部分**を確認した動画がある。${target.length - covered.length}単元はおすすめ未収録。単元の全目標や全主張を満たしたという意味ではない。

メタデータ、内容、再生、埋め込みの状態は独立。全てAIによる照合で、人間の専門家レビューは0本。公開された同一動画の文字起こしは本文との対応を確認して利用し、映像や実演まで確認したとは扱わない。主要画面レビューは観測した画面と範囲に限定。動画・字幕本体の取得保存・転載・再配布は行わない。

## 目標別対応（旧版で不足していた22単元）

候補の目標割当は調査予定の仮対応。おすすめが付く目標も、下記の動画別確認範囲に限る。空欄は未収録であり、単元本文・問題自体がないという意味ではない。

| 単元 | 学習目標 | 内容を照合した動画 | 候補・保留 |
|---|---|---|---|
${rows.map((r) => `| ${r.unit.title} (${r.unit.id}) | ${r.objective.id}: ${r.objective.text} | ${r.recommended.map(link).join('、') || '**未収録**'} | ${r.candidates.map(link).join('、') || 'なし'} |`).join('\n')}

## 新規動画の状態・確認箇所

| 動画・発信者 | 目標 | 内容確認の方法・範囲 | 再生 / 埋め込み |
|---|---|---|---|
${additions.map((v) => `| [${v.title}](${v.url}) — ${v.channel} | ${v.objectiveIds.join('、')} | ${isRecommendedVideo(v) ? '**限定おすすめ**' : '**候補・保留**'} / ${v.content.review?.method} / ${v.content.review?.coverage.replaceAll('|', '／')} | ${v.playback.status} / ${v.embed?.status ?? 'unconfirmed'} |`).join('\n')}

## 確認記録と残る不足

- [栄養・身体評価](VIDEO_REVIEW_NUTRITION_0.5.1.md)：基準量、水分の分類、家庭血圧の測定条件、BMIの関係式など。塩分換算、発汗量、kg/mによる実計算全体などは動画では未確認。
- [計算・強度・柔軟性](VIDEO_REVIEW_LOAD_0.5.1.md)：割合、相対強度、静的と動的の区別。周期化は上記の実映像4:02、5:10〜5:19、14:46とNSCAの公開階層説明を照合し、階層関係のみ追加。年/月/週を固定規則とせず、テーパーや回復処方は未確認。
- [行動支援・同意・評価候補](VIDEO_REVIEW_ASSESSMENT_0.5.1.md)：英語公式文字起こしによる限定照合。旧版・アーカイブ・海外制度の限界を明示。
- [特別な対象者・安全](VIDEO_REVIEW_SAFETY_0.5.1.md)：医療条件、版・適用地域、未確認の初動や実技を区別。
- おすすめ未収録の単元：${target
  .filter((u) => !covered.includes(u))
  .map((u) => u.title)
  .join('、')}。候補の有無と目標別不足は表のとおり。
- 数値処方、全対象者への適否、全救急手順、日本の法的効力を動画タイトルや一部画面から推定しない。CPR/AED実技講習の代替ではない。海外の臨床研究・患者・小学生向けの候補は対象の違いも確認するまで推薦しない。
- [全教材・問題・動画対応表](CURRICULUM_v051-300.md)、[機械可読JSON](CURRICULUM_v051-300.json)、[教材全体の不足](CURRICULUM_GAPS.md)。日本向け出題範囲の照合日は2026-11-04を維持し、今回再審査したとは表示しない。
`;
await writeFile('docs/VIDEO_REVIEW_0.5.1.md', report, 'utf8');
console.log(
  JSON.stringify(
    {
      added: additions.length,
      newRecommended: additions.filter((v) => isRecommendedVideo(v)).length,
      total: seedVideos.length,
      recommended: recommended.length,
      candidates: seedVideos.length - recommended.length,
      target: target.length,
      covered: covered.length,
      remaining: target.filter((u) => !covered.includes(u)).map((u) => u.id),
      playback: seedVideos.filter((v) => v.playback.status === 'playable').length,
      embed: seedVideos.filter((v) => v.embed?.status === 'embeddable').length,
    },
    null,
    2,
  ),
);
