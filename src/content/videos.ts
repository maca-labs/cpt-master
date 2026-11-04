import type { Video } from '../domain/types';
import { videoReviews } from './video-reviews';

// Metadata was fetched from YouTube's oEmbed endpoint on the stated date.
// A successful metadata response does not establish playback or content accuracy.
const checkedAt = '2026-11-04';

type Candidate = Pick<
  Video,
  'youtubeId' | 'title' | 'channel' | 'unitIds' | 'difficulty' | 'order' | 'reason'
> & {
  discoveryUrl: string;
};

const candidates: Candidate[] = [
  {
    youtubeId: 'eXl-2JuEYpk',
    title: '関節の種類の覚え方',
    channel: 'ゴロー/イラストで学ぶ体の仕組み',
    unitIds: ['anatomy'],
    difficulty: '基礎',
    order: 1,
    reason: '解剖学の学習目標に関連する補助候補です。学習対象との対応と説明の正確性は未審査です。',
    discoveryUrl: 'https://www.youtube.com/watch?v=eXl-2JuEYpk',
  },
  {
    youtubeId: 'to4SW3kqm9Y',
    title: '【ゴロ覚えあり】超絶わかりやすい！！筋収縮の生理【解剖生理学25】',
    channel: 'メディカルロックティーチャーリョウ',
    unitIds: ['anatomy', 'physiology'],
    difficulty: '基礎',
    order: 2,
    reason:
      '骨格筋に関する解剖学と運動生理学を結びつける学習目標の補助候補です。内容は未審査です。',
    discoveryUrl: 'https://www.youtube.com/watch?v=to4SW3kqm9Y',
  },
  {
    youtubeId: 'e_OrhETNKio',
    title: '【運動生理学】ATP CP系をわかりやすく解説！',
    channel: '本屋敷裕太【骨格美ボディメイクトレーナー養成講座】',
    unitIds: ['physiology'],
    difficulty: '基礎',
    order: 1,
    reason: '運動生理学のエネルギー供給に関する学習目標の補助候補です。内容は未審査です。',
    discoveryUrl: 'https://www.youtube.com/watch?v=e_OrhETNKio',
  },
  {
    youtubeId: 'dOlSdv_YyuI',
    title: '握力',
    channel: 'aichi-taiku',
    unitIds: ['assessment'],
    difficulty: '基礎',
    order: 1,
    reason:
      '愛知県教育委員会の体力測定資料に掲載された、測定に関する学習目標の補助候補です。学校向け資料のため成人クライアントへの適用範囲は要確認です。内容は未審査です。',
    discoveryUrl: 'https://taiiku.aichi-c.ed.jp/fullness/index0403.php',
  },
  {
    youtubeId: '0VT-7KAtOxw',
    title: 'スポーツと栄養',
    channel: '鳥大スポーツ医科学センター',
    unitIds: ['nutrition'],
    difficulty: '基礎',
    order: 1,
    reason:
      '鳥取大学病院スポーツ医科学センターが掲載する、栄養の学習目標の補助候補です。内容と一般クライアントへの適用範囲は未審査です。',
    discoveryUrl: 'https://www2.hosp.med.tottori-u.ac.jp/tsa/movie/',
  },
  {
    youtubeId: 'hdtWEM3Oqwc',
    title: 'How to design a complete training program',
    channel: 'Human Kinetics',
    unitIds: ['program'],
    difficulty: '応用',
    order: 1,
    reason:
      '専門出版社Human Kineticsが掲載する、プログラム計画の学習目標の補助候補です。英語の動画で、日本語字幕の有無と内容は未確認です。',
    discoveryUrl:
      'https://us.humankinetics.com/blogs/strength-conditioning-fitness/how-to-design-a-complete-training-program',
  },
  {
    youtubeId: 'fIvDJoyVgRQ',
    title: 'バックスクワット',
    channel: 'NSCA Japan',
    unitIds: ['technique'],
    difficulty: '基礎',
    order: 1,
    reason:
      'NSCAジャパンの一般公開記事に掲載された、エクササイズ指導の学習目標の補助候補です。内容は未審査です。',
    discoveryUrl: 'https://park.nsca-japan.or.jp/category-13/post-1106/',
  },
  {
    youtubeId: 'NGNaD_UY-A4',
    title: '【日本赤十字社】心肺蘇生とAEDの使い方 ～JRC蘇生ガイドライン2020対応～',
    channel: 'JapaneseRedCrossPR',
    unitIds: ['safety'],
    difficulty: '基礎',
    order: 1,
    reason:
      '日本赤十字社が掲載する、緊急時対応の学習目標の補助候補です。2020年版対応の資料であり、現行指針との差分確認と内容審査が必要です。',
    discoveryUrl: 'https://www.jrc.or.jp/study/news/2024/0701_041552.html',
  },
  {
    youtubeId: 'vfyowlhlRlA',
    title: 'スポーツと頭部外傷',
    channel: '鳥大スポーツ医科学センター',
    unitIds: ['safety'],
    difficulty: '応用',
    order: 2,
    reason:
      '鳥取大学病院スポーツ医科学センターが掲載する、安全管理の学習目標の補助候補です。内容と現行指針への適合性は未審査です。',
    discoveryUrl: 'https://www2.hosp.med.tottori-u.ac.jp/tsa/movie/',
  },
  {
    youtubeId: 'XBkaAAwyS4s',
    title: '※字幕あり【スポーツ現場におけるハラスメント防止動画】ch1.ハラスメントの考え方',
    channel: ' JSPO -日本スポーツ協会-',
    unitIds: ['professional'],
    difficulty: '基礎',
    order: 1,
    reason:
      '日本スポーツ協会が掲載する、指導者の専門職倫理に関する学習目標の補助候補です。内容と資格試験範囲への対応は未審査です。',
    discoveryUrl: 'https://www.japan-sports.or.jp/women/tabid1331.html',
  },
];

export const seedVideos: Video[] = candidates.map(({ discoveryUrl, ...candidate }) => ({
  ...candidate,
  id: `yt-${candidate.youtubeId}`,
  url: `https://www.youtube.com/watch?v=${candidate.youtubeId}`,
  unitIds: candidate.youtubeId === 'to4SW3kqm9Y' ? ['physiology'] : candidate.unitIds,
  objectiveIds: videoReviews[candidate.youtubeId].objectiveIds,
  reason:
    candidate.youtubeId === 'XBkaAAwyS4s'
      ? 'ハラスメントが生じやすい力関係と、相手が拒否しにくい状況への配慮を学ぶためのおすすめ。日本語の自動字幕をJSPOの一次資料とAIが照合しました。音声・図表は未確認です。'
      : candidate.youtubeId === 'hdtWEM3Oqwc'
        ? '週日程・目標に応じた計画の補助候補。全自動字幕を読みましたが、定義や数値の不明瞭な箇所を解消できず、おすすめは保留しています。'
        : candidate.reason,
  metadata: {
    status: 'confirmed',
    checkedAt,
    method: `Web検索で候補を発見し、YouTube公式oEmbedへHTTPS GETを実行。JSON応答のtitle・author_nameを確認。掲載元: ${discoveryUrl}。これはメタデータの確認記録で、内容の照合は別に記録。`,
    evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${candidate.youtubeId}`)}&format=json`,
  },
  playback: { status: 'unconfirmed', checkedAt: null, method: null },
  content: {
    status: candidate.youtubeId === 'XBkaAAwyS4s' ? 'source_checked' : 'unreviewed',
    checkedAt: candidate.youtubeId === 'XBkaAAwyS4s' ? checkedAt : null,
    method:
      candidate.youtubeId === 'XBkaAAwyS4s'
        ? 'AIが取得できた全自動字幕とJSPO一次資料を照合。音声・図表の実視聴や人間専門家レビューではない。'
        : null,
    sourceRefs:
      candidate.youtubeId === 'XBkaAAwyS4s'
        ? [
            {
              sourceId: 'video-jspo-ethics',
              locator: 'PDF pp.15–16：構造的要因、表面化しにくい問題。',
            },
            {
              sourceId: 'video-jspo-handbook1',
              locator: '本文p.17 / PDFp.18：ハラスメントの考え方。',
            },
          ]
        : candidate.youtubeId === 'hdtWEM3Oqwc'
          ? [
              {
                sourceId: 'video-nsca-power',
                locator: 'パワーの定義。字幕の疑義を検討した比較資料。',
              },
            ]
          : [],
    review: videoReviews[candidate.youtubeId],
  },
}));
