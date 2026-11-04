import type { DomainId, Source } from '../domain/types';
export const domainIds: DomainId[] = ['assessment', 'planning', 'technique', 'safety'];
export const domains: Record<
  DomainId,
  {
    name: string;
    short: string;
    color: string;
    scored: number;
    diagnostic: number;
    initial: number;
  }
> = {
  assessment: {
    name: 'クライアントに対する面談と評価',
    short: '面談・評価',
    color: '#7aa68d',
    scored: 32,
    diagnostic: 12,
    initial: 23,
  },
  planning: {
    name: 'プログラムプランニング',
    short: 'プログラム計画',
    color: '#ddac61',
    scored: 45,
    diagnostic: 16,
    initial: 32,
  },
  technique: {
    name: 'エクササイズテクニック',
    short: '実技・テクニック',
    color: '#8c9cce',
    scored: 43,
    diagnostic: 15,
    initial: 31,
  },
  safety: {
    name: '安全性・緊急時の手順・法的諸問題',
    short: '安全・法的問題',
    color: '#ce8e7c',
    scored: 20,
    diagnostic: 7,
    initial: 14,
  },
};
export const blueprint = {
  id: 'jp-observed-2026-11-04',
  region: '日本',
  language: '日本語',
  provisional: true,
  observedAt: '2026-11-04',
  effectiveFrom: null,
  scoredDomainCounts: { assessment: 32, planning: 45, technique: 43, safety: 20 },
  diagnosticCounts: { assessment: 12, planning: 16, technique: 15, safety: 7 },
  scored: 140,
  unscored: 15,
  durationMinutes: 180,
  choiceCount: 3,
  mediaMinimum: 25,
  mediaMaximum: 35,
  discrepancies: [
    '日本公式Webの割合は23・32・31・14%、日本語ハンドブックp.10は25・31・31・13%。整数問題数32・45・43・20は共通のため、整数値を採用。割合から再計算しません。',
    '米国公式Webは23・29・36・12%、整数問題数32・41・50・17、第3分野はProgram Execution。日本への適用時期を確認できていないため、初期設定には混在させません。',
    '日本語ハンドブックp.10の3択・単一正答を初期形式とします。日本資料の確実な版・適用開始日は未確認で、この設定は確認日時点の暫定値です。',
  ],
  usReference: {
    counts: [32, 41, 50, 17],
    percentages: [23, 29, 36, 12],
    domain3: 'Program Execution',
    appliesToJapan: null,
  },
};
export const blueprintSources: Source[] = [
  {
    id: 'nsca-jp-web',
    title: 'NSCAジャパン：NSCA-CPT出題範囲',
    url: 'https://nsca-japan.or.jp/certification/exam/nsca-cpt/',
    edition: null,
    checkedAt: '2026-11-04',
    locator: 'NSCA-CPT出題範囲・問題配分表・試験時間',
    note: '公開Webの版・適用開始日記載を確認できず。',
  },
  {
    id: 'nsca-jp-handbook',
    title: 'NSCA資格認定試験ハンドブック（日本語）',
    url: 'https://nsca-japan.or.jp/pdf/certification/exam/cbt_handbook.pdf',
    edition: null,
    checkedAt: '2026-11-04',
    locator: 'p.10 NSCA-CPT、p.18 CPR/AED',
    note: '割合表のWebとの不整合を保持。版・更新日未確認。',
  },
  {
    id: 'nsca-us-web',
    title: 'NSCA-CPT Exam Description（米国・比較用）',
    url: 'https://www.nsca.com/certification/nsca-cpt/nsca-cpt-exam-description/',
    edition: null,
    checkedAt: '2026-11-04',
    locator: 'Summary：32/41/50/17、140 scored + 15 non-scored',
    note: '日本向け教材の配分に使用しない。',
  },
];
