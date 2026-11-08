import type { Source } from '../../domain/types';

export const resuscitation: Source = {
  id: 'ed3-safe-jrc-2025',
  title: '日本救急医療財団「改訂7版 救急蘇生法の指針2025 市民用」',
  url: 'https://qqzaidan.jp/wp-content/uploads/2026/09/shishin2025_shimin_teisei_0910.pdf',
  edition: '2026年7月刊・2026年9月10日訂正版',
  checkedAt: '2026-11-08',
  locator: '本文pp.9–19 突然の心停止の予防、pp.20–45 一次救命処置、pp.46–57 ファーストエイド',
  note: '日本の市民用指針。エッセンシャル第3版とは別の改訂。',
};

export const standards: Source = {
  id: 'ed3-safe-nsca-standards',
  title: 'NSCA Strength and Conditioning Professional Standards and Guidelines',
  url: 'https://dxpprod.nsca.com/globalassets/about/position-statements/nsca_strength_and_conditioning_professional_standards_and_guidelines.pdf',
  edition: 'Strength and Conditioning Journal 39(6), 2017',
  checkedAt: '2026-11-08',
  locator: '印刷pp.10–13 Standards 3–5、Guidelines 4–9',
  note: 'NSCAの米国専門職資料。日本での義務は個別の国内資料で判断する。',
};

export const ethics: Source = {
  id: 'ed3-safe-nsca-ethics',
  title: 'NSCA Professional Code of Ethics',
  url: 'https://www.nsca.com/codes-policies-procedures/',
  edition: 'NSCA現行公開ページ',
  checkedAt: '2026-11-08',
  locator: 'Professional Code of Ethics、Principles 1–4',
};

export const privacy: Source = {
  id: 'ed3-safe-ppc',
  title: '個人情報保護委員会「個人情報保護法ガイドライン（通則編）」',
  url: 'https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/',
  edition: '令和8年6月一部改正の公開本文',
  checkedAt: '2026-11-08',
  locator: '3-1 利用目的、3-4 管理、3-5 漏えい等、3-6 第三者提供、3-8 開示等',
};

export const ads: Source = {
  id: 'ed3-safe-caa-ads',
  title: '消費者庁「ステルスマーケティングに関するQ&A」',
  url: 'https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing',
  edition: '現行公開Web、2023年10月1日施行の告示に関するQ&A',
  checkedAt: '2026-11-08',
  locator: 'Q1、Q4–Q16',
};

export const heat: Source = {
  id: 'ed3-safe-jspo-heat',
  title: '日本スポーツ協会「スポーツ活動中の熱中症予防ガイドブック」第6版抜粋',
  url: 'https://www.japan-sports.or.jp/Portals/0/data/supoken/doc/heatstroke/heatstroke_leaflet202506.pdf',
  edition: '2025年6月改訂（第6版）',
  checkedAt: '2026-11-08',
  locator: 'PDF「新しい熱中症予防5ヶ条」「冷やそう、からだの外から内から」「身体冷却の効果」',
  note: '日本の運動時暑熱指針であり、エッセンシャル第3版の変更箇所ではない。',
};
export const heatPolicy: Source = {
  id: 'ed3-safe-jspo-heat-policy',
  title: '日本スポーツ協会「スポーツ界における熱中症予防について」',
  url: 'https://www.mext.go.jp/sports/content/20250724-spt_kensport01-000043921_05.pdf',
  edition: '2025年7月24日 スポーツ審議会資料5',
  checkedAt: '2026-11-08',
  locator: '印刷pp.5–7、III「熱中症予防運動指針」、IV「主な改訂ポイント」、V「対応方針」',
};

export const suspension: Source = {
  id: 'ed3-safe-trx-commercial',
  title: 'TRX Commercial Product Safety & Use Guides',
  url: 'https://commercial.trxtraining.com/pages/product-safety',
  edition: '業務用向け現行公開Web',
  checkedAt: '2026-11-08',
  locator: 'Suspension Trainers、Suspension Anchor、XMount、Xtender、Rip Trainer',
  note: '器具の安全に関する製造元の指示。対象品目の具体的条件として使用する。',
};
