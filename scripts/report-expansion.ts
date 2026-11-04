import { writeFile } from 'node:fs/promises';
import { units, questions, seedVideos, contentVersion } from '../src/content';
import { domainIds, domains } from '../src/content/blueprints';
import { isRecommendedVideo } from '../src/engines/video-review';
import { validateContent } from './validate-content';
const report = validateContent();
if (report.errors.length) throw new Error(JSON.stringify(report.errors));
const added = units.filter((u) => u.id.startsWith('ex-'));
const rows = added.map((u) => ({
  domain: domains[u.domainId].name ?? domains[u.domainId].short,
  unitId: u.id,
  title: u.title,
  objectives: u.objectives.map((o) => o.id),
  text: u.sections.map((s) => s.title),
  questions: questions.filter((q) => q.unitId === u.id),
  videos: seedVideos.filter((v) => v.unitIds.includes(u.id)),
}));
const header = `# 日本向け出題範囲との対応・残る不足\n\n確認日2026-11-04（日本時間）。教材版${contentVersion}。実装前の[8単元・100問の対応表](CURRICULUM_baseline-100.md)を先に保存してから、今回の追加教材を作成した。現在は${units.length}単元・${questions.length}問・${new Set(questions.map((q) => q.groupId)).size}問題グループ。\n\n日本向けの親項目は[NSCAジャパンの出題範囲](https://nsca-japan.or.jp/certification/exam/nsca-cpt/)と[日本語ハンドブック](https://nsca-japan.or.jp/pdf/certification/exam/cbt_handbook.pdf)印刷p.10を参照（確認日2026-11-04、版・適用開始日不明）。本番設計の採点対象140問の内訳32/45/43/20（別に採点外15問）を採用し、Web割合23/32/31/14とPDF割合25/31/31/13の不一致は未解消。米国DCOは別資料の参考で、日本版正式細目として混在させない。以下の小単元・目標は公開された日本公式の説明を本アプリが細分化したもので、公式の詳細DCOコードを再現したものではない。\n\n全${units.length}単元について「親分野→学習目標→本文の節→全問題ID/グループ→動画」を追える[詳細対応表](CURRICULUM_expanded-300.md)と[機械可読JSON](CURRICULUM_expanded-300.json)を用意した。問題の多さや参照の存在だけで説明十分性や臨床能力を保証しない。\n\n## 追加28小単元と実収録\n\n元の8単元・100問はID・改訂・本文・選択肢を維持。各追加単元には目的、本文、具体例、用語、出典と以下の問題がある。動画欄の不足を未確認の候補で埋めない。\n\n| 日本公式の親分野→独自小単元 | 目標ID→解説の節 | 問題数 / ID範囲 | 動画の直接対応 |\n|---|---|---|---|\n`;
const table = rows
  .map(
    (r) =>
      `| ${r.domain} → ${r.title} (${r.unitId}) | ${r.objectives.join(', ')} → ${r.text.join('／')} | ${r.questions.length}問 / ${r.questions[0]?.id}〜${r.questions.at(-1)?.id} | ${r.videos.length ? `${r.videos.length}本、推薦${r.videos.filter((v) => isRecommendedVideo(v, r.unitId)).length}本` : '**未収録・内容確認待ち**'} |`,
  )
  .join('\n');
const counts =
  '\n\n## 問題数と利用条件\n\n| 分野 | 元の問題 | 追加 | 現在 | 診断予約 |\n|---|---:|---:|---:|---:|\n' +
  domainIds
    .map((id) => {
      const total = questions.filter((q) => q.domainId === id).length;
      return `| ${domains[id].short} | ${domains[id].initial} | ${total - domains[id].initial} | ${total} | ${domains[id].diagnostic} |`;
    })
    .join('\n') +
  '\n\n300問は通常学習用の総数で、診断50問を含む。初回診断前に通常演習へ出るのは250問で、完了・スキップ後は300問。全問AIによる出典照合記録あり。人間専門家レビューは0問、本番形式模試専用は0問。出典照合と独立AIレビューの方法・対象・修正は[教材レビュー記録](CONTENT_EXPANSION_REVIEW.md)に分ける。問題グループは同じ判断の言換えや数値違いを別件にしないための管理単位であり、300種類の独立した能力を心理測定で検証した数ではない。\n';
const remaining = `\n## 未収録・説明や問題がまだ足りない範囲\n\n- 基礎科学：神経・内分泌・循環呼吸の詳細、エネルギー供給と適応の発展的適用。初版の基礎本文は維持しており、全機序を詳述したものではない。\n- 面談・評価：全対象者の標準化された体力評価、規準値や再検査の解釈、動作評価の広い事例。成人要項の一部と体組成・記録の問題を追加した段階。\n- 栄養：摂取量・タイミング・競技/生活条件への応用、補助食品の根拠とアンチドーピングの詳細。個人の治療食や服薬の処方は扱わない。\n- 計画：複数週の具体的な抵抗運動/持久力計画、疲労と再評価を組み合わせる複合ケース。対象者は若年・高齢・妊娠産後・代謝疾患・運動器の選定事例に限られ、心疾患・呼吸器疾患等を網羅しない。\n- 技術：全器具・全種目、詳細な補助法、オリンピックリフト等。画像・映像形式12問は独自模式図6件・コマ送りアニメーション6件で、権利確認済み実写写真/実写動画の問題は0問。模式図で実際の人を診断しない。\n- 安全・職務：成人救命の一部と暑熱・頭部衝撃・窒息、説明・記録、日本の個人情報法の選定場面を追加。小児救命、全外傷、施設条件別の詳細、保険・契約・民事責任等の網羅は未完了。海外指針を日本の法律として適用しない。\n- 動画：登録10本中、確認範囲を限定したおすすめ2本、候補/保留8本。追加28単元の目標へ直接対応する内容確認済み動画は未収録。既存の推薦2本を新目標へ無審査で転用しない。重要目標への内容確認済み動画の追加は継続課題。\n- 模試：通常問題と独立した専用155問×3セットは0/465問。専門家審査・媒体と権利・分野数等の条件が揃うまで本番形式は準備中。既存の10/20/50問短縮模試は通常問題を使う学習練習。\n\n## 独自の最終開発目標\n\n小単元40〜60、通常600問（診断50を含む）、模試専用155問×3セット、重要目標に対応する内容確認済み動画。今回の36単元・300問は途中段階であり完成目標ではない。これらは公式の合格条件ではなく、公式換算スコアや合格確率は算出しない。\n`;
await writeFile('docs/CURRICULUM_GAPS.md', header + table + counts + remaining, 'utf8');
console.log(JSON.stringify(report.summary, null, 2));
