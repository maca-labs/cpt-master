import type { Question, Source, SourceRef, Unit } from '../../domain/types';
export const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });
export const safetySources: Source[] = [
  {
    id: 'ex-safe-consent-form',
    title: 'Fitness Alberta: Informed Consent',
    url: 'https://www.fitnessalberta.com/sites/default/files/2021-06/Informed_Consent.pdf',
    edition: '公開様式（本文版年なし、ファイルパス2021-06）',
    checkedAt: '2026-11-04',
    locator: 'PDF pp.1–2：Purpose/Risks/Benefits、E-Communications、Inquiries',
    note: 'カナダの運動指導団体の説明事項を参考にした。書式を転載せず、日本での契約効力の根拠としない。',
  },
  {
    id: 'ex-safe-standards',
    title:
      'NSCA Executive Summary: Strength and Conditioning Professional Standards and Guidelines',
    url: 'https://www.nsca.com/contentassets/477221070254471aab20116550658891/standards-and-guidelines-summary-rev.-dec.-2018.pdf',
    edition: '本文2018年11月表記／配布ファイル名rev. Dec. 2018',
    checkedAt: '2026-11-04',
    locator: 'PDF pp.4–5: Standards 4.2–4.4, 5.2; Guidelines 5.1, 6.1',
    note: '米国の専門職指針。日本の法令上の義務や責任成立条件と同一視しない。',
  },
  {
    id: 'ex-safe-resuscitation',
    title: '日本救急医療財団 改訂7版 救急蘇生法の指針2025 市民用',
    url: 'https://qqzaidan.jp/wp-content/uploads/2026/09/shishin2025_shimin_teisei_0910.pdf',
    edition: '2026年7月刊／2026年9月10日訂正反映PDF',
    checkedAt: '2026-11-04',
    locator: '本文pp.26–28,33–34,37,39,41（PDF pp.35–37,42–43,46,48,50）',
    note: '参照した本文ページを記録し、独自の場面問題を作成。図表・フローチャートは転載しない。本教材は実技講習の代替ではない。',
  },
  {
    id: 'ex-safe-heat',
    title: '厚生労働省：熱中症が疑われる人を見かけたら',
    url: 'https://www.mhlw.go.jp/seisakunitsuite/bunya/kenkou_iryou/kenkou/nettyuu/nettyuu_taisaku/happen.html',
    edition: '公開Web本文（版表示なし）',
    checkedAt: '2026-11-04',
    locator: '症状例／涼しい場所へ／からだを冷やす／水分補給／自力で水が飲めない・意識がない場合',
  },
  {
    id: 'ex-safe-concussion',
    title: 'JFA掲載：グラスルーツ向け FIFA脳振盪プロトコル「かもしれない」疑って守る',
    url: 'https://www.jfa.jp/medical/pdf/medical_concussion.pdf',
    edition: '2024年8月',
    checkedAt: '2026-11-04',
    locator: '本文・PDF pp.4–7：重要なポイント、兆候・症状、危険な兆候',
    note: 'JFAが公開するFIFA資料。スポーツ現場の認識と受診の判断に限定し、トレーナーによる診断や復帰許可には用いない。',
  },
  {
    id: 'ex-safe-ethics',
    title: 'NSCA Professional Code of Ethics',
    url: 'https://www.nsca.com/codes-policies-procedures/',
    edition: '現行公開WebのProfessional Code of Ethics',
    checkedAt: '2026-11-04',
    locator: 'Principles 1.1–1.4, 3.2–3.8',
    note: '倫理上の判断を学ぶ資料。日本法上の個別の法的結論を導くものではない。',
  },
  {
    id: 'ex-safe-privacy',
    title: '個人情報保護委員会：個人情報保護法ガイドライン（通則編）',
    url: 'https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/',
    edition: '平成28年11月／令和8年6月一部改正（条番号は2026年6月14日時点）',
    checkedAt: '2026-11-04',
    locator: '3-1-1〜3-1-3、3-3-2、3-4-4、3-5-2、3-6-1、3-6-3',
    note: '設問の条件に限定した一般学習。例外や具体的な報告義務は事案ごとに適用資料を確認する。',
  },
];
export interface SafetyItem {
  n: number;
  unit: string;
  goal: number;
  group: string;
  prompt: string;
  options: [string, string][];
  why: string;
  refs: SourceRef[];
  check: string;
  difficulty?: 1 | 2 | 3;
}
// Formats a completed, individual source check; schema validation never grants this status.
export const checkedSafetyBatch = (at: string, items: SafetyItem[]): Question[] =>
  items.map((x) => {
    const correct = x.n % 3,
      options = [...x.options];
    options.splice(correct, 0, options.shift()!);
    return {
      id: `ex-safe-${String(x.n).padStart(3, '0')}`,
      revision: 1,
      groupId: `ex-safe-${x.group}`,
      domainId: 'safety',
      unitId: x.unit,
      objectiveIds: [`${x.unit}-o${x.goal}`],
      format: 'single_choice',
      context: 'case',
      difficulty: x.difficulty ?? 2,
      pool: 'practice',
      prompt: x.prompt,
      choices: options.map(([text, explanation], i) => ({
        id: ['a', 'b', 'c'][i],
        text,
        explanation,
      })),
      correctChoiceId: ['a', 'b', 'c'][correct],
      explanation: x.why,
      sourceRefs: x.refs,
      review: {
        status: 'source_checked',
        reviewerType: 'ai',
        method: `AIが参照箇所を実読し、設問の条件・正答・各誤答理由・解説を逐問照合。${x.check}`,
        checkedAt: at,
        revision: 1,
        notes: '独自作成。人間の専門家レビュー未実施。出典照合と独立AIレビューは別に記録する。',
      },
    };
  });
export const unit = (
  id: string,
  title: string,
  subtitle: string,
  goals: string[],
  sections: Unit['sections'],
  example: Unit['example'],
  terms: Unit['terms'],
  refs: SourceRef[],
): Unit => ({
  id,
  domainId: 'safety',
  title,
  subtitle,
  minutes: 22,
  level: '応用',
  objectives: goals.map((text, i) => ({ id: `${id}-o${i + 1}`, text })),
  sections,
  example,
  terms,
  sourceRefs: refs,
});
