import type { Source, Video } from '../domain/types';

const checkedAt = '2026-11-08';
const unit = 'ed3-assess-test-methods';
const selection = unit + '-o1';
const protocol = unit + '-o2';
const reporting = unit + '-o3';
const officialGuide = 'https://locomo-joa.jp/check/test';
const twoStepProtocol = 'https://locomo-joa.jp/check/test/two-step';
const locomo = 'https://www.youtube.com/watch?v=QY4P9TNJU68';
const niaGuide =
  'https://www.nia.nih.gov/research/labs/leps/short-physical-performance-battery-sppb';
const niaVideo = 'https://www.youtube.com/watch?v=XgiuciJXPm4';

export const fitnessV062Sources: Source[] = [
  {
    id: 'v062-joa-two-step',
    title: '日本整形外科学会 ロコモ度テスト 2ステップテスト',
    url: twoStepProtocol,
    edition: 'ロコモONLINE 公式掲載ページ',
    checkedAt,
    locator: '「2ステップテストの方法」1〜5と「注意すること」。',
    note: 'スタートライン、大股2歩、着地点の測定、2試技の扱いと身長で正規化する計算を確認。',
  },
];

export const fitnessV062Videos: Video[] = [
  {
    id: 'yt-QY4P9TNJU68',
    youtubeId: 'QY4P9TNJU68',
    title: 'ロコモティブシンドローム ガイドムービー',
    channel: 'ロコモチャレンジ',
    url: locomo,
    unitIds: [unit],
    objectiveIds: [selection],
    difficulty: '基礎',
    order: 1,
    reason:
      '歩行に関わる機能を、所要時間ではなく歩幅で捉える日本語の実演です。公式案内の2ステップテストの区間は6:28からです。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '日本整形外科学会のロコモONLINEに埋め込まれた同一IDをYouTube公式oEmbedのタイトルとチャンネルで照合。',
      evidenceUrl:
        'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQY4P9TNJU68',
    },
    playback: {
      status: 'playable',
      checkedAt,
      method: 'YouTube視聴ページで冒頭の再生進行と7:28の実映像の表示を確認。',
    },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIがYouTubeプレーヤーの実演画面を、日本整形外科学会の2ステップテストの公式手順と照合。',
      sourceRefs: [{ sourceId: 'v062-joa-two-step', locator: '「2ステップテストの方法」1〜3。' }],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage: '7:28の2ステップテストの実演で、目盛り付きマットの開始側から大きく踏み出す動き。',
        objectiveIds: [selection],
        findings: [
          '開始側の足位置を基準に、目盛り付きマットに沿って大きく踏み出す動作が見える。通常歩行の所要時間を測る種目と比較して、歩幅に着目する課題の例として学べる。',
        ],
        limitations: [
          '確認対象は2ステップテストの該当画面。採用する試技、測定の終点、身長による正規化と実施条件は公式手順を参照。SPPBやスポーツ庁の新体力テストとは別のプロトコル。',
          '音声・字幕・全編・アプリ内の埋め込み再生は未確認。',
        ],
        evidence: [
          { url: officialGuide, locator: 'ガイドムービーの2ステップテスト埋め込み（開始6:28）。' },
          { url: locomo + '&t=448s', locator: '7:28の目盛り付きマットでの実演画面。' },
          { url: twoStepProtocol, locator: '公式手順の「2ステップテストの方法」1〜3。' },
        ],
      },
    },
  },
  {
    id: 'yt-XgiuciJXPm4',
    youtubeId: 'XgiuciJXPm4',
    title: 'SPPB tips by Dr. Jack Guralnik',
    channel: 'DrJackGuralnik',
    url: niaVideo,
    unitIds: [unit],
    objectiveIds: [protocol, reporting],
    difficulty: '応用',
    order: 2,
    reason:
      '米国国立老化研究所のSPPB研修資料が案内する英語の補足講義です。講義の測定手順や記録方法は内容照合待ちです。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '米国国立老化研究所の公式研修ページの埋め込みIDをYouTube公式oEmbedのタイトル・チャンネルで照合。',
      evidenceUrl:
        'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DXgiuciJXPm4',
    },
    playback: {
      status: 'playable',
      checkedAt,
      method: 'YouTube視聴ページで冒頭の再生進行と1:05・2:35の講義画面の表示を確認。',
    },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
      review: {
        decision: 'hold',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage: '1:05と2:35の講師の画面を確認。測定手順と記録方法を解説する発話は未照合。',
        objectiveIds: [protocol, reporting],
        findings: ['観察した2場面には講師が映っていた。測定動作と記録方法の照合は保留した。'],
        limitations: ['該当する発話または字幕の照合後に、推薦範囲を判断する。'],
        evidence: [
          { url: niaGuide, locator: '公式SPPB研修ページの補足講義埋め込み。' },
          { url: niaVideo, locator: '1:05と2:35の講師の画面。' },
        ],
      },
    },
  },
];
