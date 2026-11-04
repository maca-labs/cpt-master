import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { units, questions, seedVideos, contentVersion } from '../src/content';
import { isRecommendedVideo } from '../src/engines/video-review';

// Run only for an explicitly versioned snapshot; never overwrite the baseline.
const name = process.argv[2];
if (!name || !/^[a-z0-9-]+$/.test(name)) throw new Error('スナップショット名が必要です');
const snapshotDate = process.argv[3] ?? '2026-11-04';
if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate) || !Number.isFinite(Date.parse(snapshotDate)))
  throw new Error('有効な作成日が必要です');
const rows = units.flatMap((unit) =>
  unit.objectives.map((objective) => {
    const qs = questions.filter((q) => q.objectiveIds.includes(objective.id));
    const videos = seedVideos.filter((v) => v.objectiveIds.includes(objective.id));
    return {
      domain: unit.domainId,
      unitId: unit.id,
      unit: unit.title,
      objective,
      explanations: unit.sections.map((section) => section.title),
      questions: qs.map((q) => q.id),
      groups: [...new Set(qs.map((q) => q.groupId))],
      videos: videos.map((v) => ({
        youtubeId: v.youtubeId,
        title: v.title,
        recommended: isRecommendedVideo(v, unit.id),
      })),
    };
  }),
);
const header = `# 教材対応表スナップショット：${name}\n\n作成日${snapshotDate}（日本時間）。教材版 ${contentVersion}、${units.length}単元・${questions.length}問・${new Set(questions.map((q) => q.groupId)).size}独立グループ。動画の確認日・範囲は動画別の審査記録を参照。\n\n`;
const scope =
  '日本向けの参照は[NSCAジャパン出題範囲](https://nsca-japan.or.jp/certification/exam/nsca-cpt/)の分野別説明と[日本語ハンドブック](https://nsca-japan.or.jp/pdf/certification/exam/cbt_handbook.pdf)印刷p.10。確認日2026-11-04、版・適用開始日不明。整数配分32/45/43/20を維持し、Web割合23/32/31/14とPDF割合25/31/31/13の差は未解消として保持する。米国のProgram Execution等を日本の正式細目として転記しない。\n\n以下の目標と節名は本アプリ独自の整理であり、日本版の未公開・未確認の公式DCO細目を再現したものではない。関連動画は目標IDで直接対応するものだけを載せ、候補を推薦と数えない。節の関連付けは単元内の参照であり、目標の説明十分性を自動保証しない。\n\n';
const domains = {
  assessment: '① 面談・評価（栄養を含む）',
  planning: '② 計画（適応・対象者を含む）',
  technique: '③ 技術（解剖・力学を含む）',
  safety: '④ 安全・緊急時・職務',
};
const table =
  '| 日本公式の親分野 → アプリ単元 | 学習目標 | 解説（単元内の節） | 問題ID／独立グループ | 関連動画 |\n|---|---|---|---|---|\n' +
  rows
    .map(
      (row) =>
        `| ${domains[row.domain]} → ${row.unit} (${row.unitId}) | ${row.objective.id}: ${row.objective.text} | ${row.explanations.join('／')} | ${row.questions.join(', ') || '**未収録**'} (${row.groups.length}群) | ${row.videos.map((v) => `[${v.title}](https://www.youtube.com/watch?v=${v.youtubeId})：${v.recommended ? '限定おすすめ' : '候補・保留'}`).join('／') || '**目標に直接対応する動画なし**'} |`,
    )
    .join('\n');
await mkdir('docs', { recursive: true });
await writeFile(`docs/CURRICULUM_${name}.md`, header + scope + table + '\n', {
  encoding: 'utf8',
  flag: 'wx',
});
await writeFile(
  `docs/CURRICULUM_${name}.json`,
  JSON.stringify(
    { snapshotDate, officialScopeCheckedAt: '2026-11-04', contentVersion, rows },
    null,
    2,
  ) + '\n',
  { encoding: 'utf8', flag: 'wx' },
);
if (name === 'baseline-100') {
  await mkdir('tests/fixtures', { recursive: true });
  await writeFile(
    'tests/fixtures/legacy-question-manifest.json',
    JSON.stringify(
      questions.map((q) => ({
        id: q.id,
        revision: q.revision,
        groupId: q.groupId,
        unitId: q.unitId,
        domainId: q.domainId,
        choiceIds: q.choices.map((c) => c.id),
        correctChoiceId: q.correctChoiceId,
        sha256: createHash('sha256').update(JSON.stringify(q)).digest('hex'),
      })),
      null,
      2,
    ) + '\n',
    { encoding: 'utf8', flag: 'wx' },
  );
}
console.log(`対応表を保存：${name} (${rows.length}目標)`);
