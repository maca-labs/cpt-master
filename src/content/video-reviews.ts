import type { Source, VideoContentReview } from '../domain/types';

export const videoCatalogVersion = '2026-11-04.2';
export const videoReviewSources: Source[] = [
  {
    id: 'video-jspo-ethics',
    title: '日本スポーツ協会：スポーツ指導者のための倫理ガイドライン',
    url: 'https://www.japan-sports.or.jp/Portals/0/rinri_gidelines.pdf',
    edition: '公開PDF（平成30年7月18日会長メッセージ。発行版未確認）',
    checkedAt: '2026-11-04',
    locator:
      'PDF pp.15–16：Ⅳ1 倫理的問題が生じやすい構造的要因／Ⅳ2 表面化しにくい倫理的問題への対応',
  },
  {
    id: 'video-jspo-handbook1',
    title: '日本スポーツ協会：女性スポーツ促進に向けたスポーツ指導者ハンドブック1',
    url: 'https://www.japan-sports.or.jp/Portals/0/data/supotsu/doc/womensport/womensportsbook01.pdf',
    edition: '平成30年度スポーツ庁委託事業（表紙記載。詳細版未確認）',
    checkedAt: '2026-11-04',
    locator: '本文p.17 / PDFp.18：3 女性スポーツにおけるハラスメント、1 ハラスメントの考え方',
  },
  {
    id: 'video-nsca-power',
    title: 'NSCAジャパン：パワーについて考えてみましょう！',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1921/',
    edition: '2024-09-27公開記事',
    checkedAt: '2026-11-04',
    locator: 'パワーの定義（仕事量を時間で割ったもの）',
  },
  {
    id: 'video-jrc-2025',
    title: '日本蘇生協議会：JRC蘇生ガイドライン2025 書籍版発刊告知',
    url: 'https://www.jrc-cpr.org/2026/07/11/jrc2025-3/',
    edition: '2026-07-11告知（2026-07-13発刊）',
    checkedAt: '2026-11-04',
    locator: '2025書籍版の発刊。本文の差分照合は未実施。',
  },
];

const checkedAt = '2026-11-04';
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const unavailable = (id: string, objectives: string[], limitation: string): VideoContentReview => ({
  decision: 'hold',
  reviewerType: 'ai',
  method: 'unavailable',
  coverage:
    '公開動画ページへの到達と字幕取得可否を確認。本編・音声・焼き付け字幕の全編照合は未実施。',
  objectiveIds: objectives,
  checkedAt,
  findings: [
    'YouTubeの字幕取得機能では「No transcript is available」が返り、照合できる字幕本文を取得できなかった。メタデータは内容確認の代わりにしない。',
  ],
  limitations: [
    limitation,
    '再生・埋め込みの通し確認、映像と音声の内容確認、人間の専門家レビューは未実施。',
  ],
  evidence: [
    { url: watch(id), locator: '登録済み公開動画ページ。字幕取得を試行したが本文取得不可。' },
  ],
});

export const videoReviews: Record<string, VideoContentReview> = {
  'eXl-2JuEYpk': unavailable(
    'eXl-2JuEYpk',
    ['anatomy-o2'],
    '関節運動の前提となる関節分類の補助候補。実際の分類・部位・説明の正確性は未確認。',
  ),
  to4SW3kqm9Y: unavailable(
    'to4SW3kqm9Y',
    ['physiology-o1'],
    '筋収縮機構の発言を取得できず、ATPの役割・滑走説の正確性を照合できない。解剖学的肢位の目標との紐づけは解除。',
  ),
  e_OrhETNKio: unavailable(
    'e_OrhETNKio',
    ['physiology-o1'],
    'ATP再合成の補助候補。供給機構を時間だけで完全に切り替える説明かどうかを含め、本編未確認。',
  ),
  dOlSdv_YyuI: unavailable(
    'dOlSdv_YyuI',
    ['assessment-o3'],
    '学校向けの測定資料に掲載された動画。成人クライアントへの適用範囲と本編手順は未確認。面談目標から体力評価目標へ修正。',
  ),
  '0VT-7KAtOxw': unavailable(
    '0VT-7KAtOxw',
    ['nutrition-o2'],
    '栄養の一般原則を学ぶ補助候補。本編の数値・対象者・一般成人への適用は未確認。',
  ),
  hdtWEM3Oqwc: {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '取得した英語の自動字幕0:00–22:26を全行読み、目標・NSCA資料と照合。動画全編の音声・映像の視聴ではない。',
    objectiveIds: ['program-o3'],
    checkedAt,
    findings: [
      '週日程・目標に合わせた分割やプログラム構成の説明は学習目標に関連する。',
      '4:45–4:53の字幕におけるパワーの定義は、仕事との混同または自動字幕の誤認の疑いがある。NSCA資料との照合だけでは原因を確定できない。',
      '16:49–16:56の休息値は字幕が不明瞭で確定できない。',
    ],
    limitations: [
      '字幕の不明点を音声で解消できていないため、おすすめにはしない。動画の発言自体が誤りであるとは断定しない。',
      '日本語字幕、実再生、図表・実演、人間の専門家レビューは未確認。',
    ],
    evidence: [
      {
        url: watch('hdtWEM3Oqwc'),
        locator: '取得した英語自動字幕0:00–22:26。照合保留箇所4:45–4:53、16:49–16:56。',
      },
      {
        url: 'https://park.nsca-japan.or.jp/category-13/post-1921/',
        locator: 'パワーの定義。字幕の発言内容を確定する根拠には使わない。',
      },
    ],
  },
  fIvDJoyVgRQ: unavailable(
    'fIvDJoyVgRQ',
    [],
    '字幕を取得できず、動作・注意点の全編照合は未実施。既存のベンチプレス目標とは一致しないため、個別学習目標の紐づけを保留。',
  ),
  'NGNaD_UY-A4': unavailable(
    'NGNaD_UY-A4',
    ['safety-o2'],
    '2020年版指針対応。2025書籍版は2026年7月発刊だが、その本文と動画との差分は未照合。現在の指針に適合するおすすめとは表示しない。',
  ),
  vfyowlhlRlA: unavailable(
    'vfyowlhlRlA',
    [],
    '現単元には頭部外傷に対応する個別目標がまだない。本編内容・現行指針を確認するまで目標対応も推薦も保留。',
  ),
  XBkaAAwyS4s: {
    decision: 'recommended',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '取得した日本語自動字幕0:05–4:31を全行読み、ハラスメントの構造・力関係・拒否しにくさという説明を一次資料と照合。字幕による言語内容の確認に限定する。',
    objectiveIds: ['professional-o4'],
    checkedAt,
    findings: [
      '勝利・成果の優先、指導者と競技者の力関係、問題の隠蔽や負の連鎖の説明は、JSPO倫理ガイドラインの構造的要因・問題の表面化しにくさと整合。',
      'ハラスメントの捉え方と相手が拒否しにくい状況の説明は、JSPOハンドブックの該当節と照合できた。',
      '明白な自動字幕の表記誤りは公式資料の対応する語句・文脈から確認し、字幕をそのまま教材本文として転載していない。',
    ],
    limitations: [
      'AIによる字幕と一次資料の照合であり、人間の専門家による監修ではない。',
      '音声の実聴、映像に含まれる統計グラフ・図表、埋め込み可否の通し確認は未実施。',
      '個別行為の法的結論、守秘義務全般、資格試験の全範囲を説明する動画としては推薦しない。',
    ],
    evidence: [
      {
        url: watch('XBkaAAwyS4s'),
        locator: '取得した日本語自動字幕0:05–4:31。主な照合箇所2:21–3:32、4:01–4:28。',
      },
      {
        url: 'https://www.japan-sports.or.jp/Portals/0/rinri_gidelines.pdf',
        locator: 'PDF pp.15–16：構造的要因、表面化しにくい問題。',
      },
      {
        url: 'https://www.japan-sports.or.jp/Portals/0/data/supotsu/doc/womensport/womensportsbook01.pdf',
        locator: '本文p.17 / PDFp.18：ハラスメントの考え方。',
      },
    ],
  },
};
