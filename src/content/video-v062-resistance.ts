import type { Source, SourceRef, Video, VideoContentReview } from '../domain/types';
import { videoV05Additions } from './video-additions-v05';

const checkedAt = '2026-11-08';
const unitId = 'ed3-tech-resistance-tools';
const suspensionObjective = unitId + '-o1';
const setupSource = 'v062-trx-setup';
const progressionSource = 'v062-trx-progression';
const setupUrl = 'https://trxtraining.jp/news/trx-how-to-anchor';
const progressionUrl = 'https://www.trxtraining.jp/index.php/progression-principle';
const machineUrl = 'https://park.nsca-japan.or.jp/category-13/post-2435/';
const machineVideoUrl = 'https://www.youtube.com/watch?v=QB-r-j_lciA';
const machineObjective = unitId + '-o3';
const originalMachine = videoV05Additions.find((video) => video.url === machineVideoUrl)!;
const originalMachineReview = originalMachine.content.review!;
const machineObjectives = [...originalMachine.objectiveIds, machineObjective];

export const resistanceV062Sources: Source[] = [
  {
    id: setupSource,
    title: 'TRX Training Japan：TRXサスペンショントレーナーの設置方法',
    url: setupUrl,
    edition: 'メーカー公式記事',
    checkedAt,
    locator: 'サスペンションアンカーを使って固定する方法',
  },
  {
    id: progressionSource,
    title: 'TRX Training Japan：TRXサスペンショントレーニングの基本：強度変換の原則',
    url: progressionUrl,
    edition: '2021年7月19日公開',
    checkedAt,
    locator: 'ベクトル負荷の原則、安定性の原則、振り子の原則',
  },
];

type Observation = {
  youtubeId: string;
  title: string;
  order: number;
  reason: string;
  coverage: string;
  findings: string[];
  limitations: string[];
  sourceRefs: SourceRef[];
  evidence: VideoContentReview['evidence'];
};

function reviewedTrx(observation: Observation): Video {
  const url = `https://www.youtube.com/watch?v=${observation.youtubeId}`;
  const objectiveIds = [suspensionObjective];
  return {
    id: `yt-${observation.youtubeId}`,
    youtubeId: observation.youtubeId,
    title: observation.title,
    channel: 'TRX Training Japan',
    url,
    unitIds: [unitId],
    objectiveIds,
    difficulty: '基礎',
    order: observation.order,
    reason: observation.reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method: 'YouTube公式視聴ページと公式oEmbedで動画ID、正式タイトル、発信元のチャンネルを照合。',
      evidenceUrl: 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(url),
    },
    playback: {
      status: 'playable',
      checkedAt,
      method: '公式視聴ページで再生し、時間の進行、シーク後の再生画面と操作表示を確認。',
    },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt,
      method: 'AIがYouTubeの再生映像で視認した範囲をメーカーとNSCAの資料へ照合。',
      sourceRefs: observation.sourceRefs,
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage: observation.coverage,
        objectiveIds,
        findings: observation.findings,
        limitations: observation.limitations,
        evidence: observation.evidence,
      },
    },
  };
}

export const resistanceV062Videos: Video[] = [
  reviewedTrx({
    youtubeId: 'E4_sT0rEPWc',
    title: 'TRXサスペンショントレーナーの使い方①　最適な高さと設置の方法',
    order: 1,
    reason: '水平バーにサスペンションアンカーを巻き付け、カラビナで固定する手元を観察できます。',
    coverage: '1:55付近。水平バーを回ったアンカーと、カラビナを操作する手元の拡大。',
    findings: [
      '黄色のアンカーを水平バーに回し、カラビナを操作する実演を確認。TRX Training Japan公式記事の巻き付けと固定方法に対応する。',
      'NSCAの公開資料でも、十分な強度があり器具が滑りにくい固定点を選ぶ。映像は専用のフレームでの実演。',
    ],
    limitations: [
      '確認範囲は水平バーへの固定例。高さの数値や別の固定方法、実際の耐荷重は各器具と設置先の資料で確認する。',
      '再生画面の照合。全編音声・埋め込み再生は確認範囲外。',
    ],
    sourceRefs: [
      { sourceId: setupSource, locator: 'サスペンションアンカーを使って固定する方法。' },
      { sourceId: 'e3-t-suspension', locator: '本文末尾の固定点の強度・ずれに関する段落。' },
    ],
    evidence: [
      {
        url: 'https://www.youtube.com/watch?v=E4_sT0rEPWc&t=115s',
        locator: '1:55付近。水平バーとカラビナの手元。',
      },
      { url: setupUrl, locator: '固定方法と公式の取り付け図。' },
    ],
  }),
  reviewedTrx({
    youtubeId: 'y45lBUT7FKk',
    title: '【TRXトレーニングの基本】強度変換の3原則',
    order: 2,
    reason: '足を床につけて行うサスペンションロウを見て、体の傾きによる難度調整を学びます。',
    coverage:
      '1:05と2:39の「ベクトル負荷の原則」場面。足を床につけたロウで、体の傾きとストラップの向きを観察。',
    findings: [
      'ベクトル負荷のテロップと、足を床につけて後ろへ傾くロウの実演を確認。公式解説は同種目の足の位置と体の角度を変える例を掲載。',
      '身体角度によってサスペンション種目の難度が変わる考え方は、NSCAの公開資料と一致する。',
    ],
    limitations: [
      'ロウの角度調整を学ぶための確認。異なる動作局面の静止場面だけから負荷の数値を推定しない。',
      '動画の他の原則と全編音声、埋め込み再生は確認範囲外。',
    ],
    sourceRefs: [
      { sourceId: progressionSource, locator: '1. ベクトル負荷の原則、ローロウの説明と図。' },
      { sourceId: 'e3-t-suspension', locator: '身体角度と難度の説明、図6.10。' },
    ],
    evidence: [
      {
        url: 'https://www.youtube.com/watch?v=y45lBUT7FKk&t=65s',
        locator: '1:05と2:39のロウ実演とベクトル負荷のテロップ。',
      },
      { url: progressionUrl, locator: 'ローロウで足の位置と身体の角度を変える例。' },
    ],
  }),
  {
    ...originalMachine,
    unitIds: [...originalMachine.unitIds, unitId],
    objectiveIds: machineObjectives,
    reason:
      originalMachine.reason +
      ' ケーブル式マシンの例として、太ももの支持、ケーブルと重りの動きも観察できます。',
    content: {
      ...originalMachine.content,
      checkedAt,
      method: 'AIが実演と日本語テロップをNSCAジャパンの記事および第3版の公開抜粋へ照合。',
      sourceRefs: [
        ...originalMachine.content.sourceRefs,
        {
          sourceId: 'e3-t-equipment',
          locator: 'MachinesとSelectorized。安定性と、ケーブルで重りに抵抗を伝える機構。',
        },
      ],
      review: {
        ...originalMachineReview,
        checkedAt,
        coverage:
          originalMachineReview.coverage +
          ' 0:05・0:12付近の背面と0:21・0:30付近の側面で、バーとケーブル、太もものパッド、引く経路と重りの動きを確認。',
        objectiveIds: machineObjectives,
        findings: [
          ...originalMachineReview.findings,
          '上方からバーにケーブルがつながり、側面ではパッドが太ももを支持し、重りの動きが見える。NSCAの公開抜粋のケーブルで重りを動かすマシンの例に対応する。',
        ],
        limitations: [
          ...originalMachineReview.limitations,
          '器具の確認範囲はこの機種での支持と抵抗の伝わり方。ピンの設定、負荷の数値、パッドの調整操作、フリーウエイトとの比較は扱わない。',
        ],
        evidence: [
          ...originalMachineReview.evidence,
          { url: machineVideoUrl, locator: '0:05・0:12・0:21・0:30付近の背面と側面の実演。' },
          { url: machineUrl, locator: '同一動画と注意ポイント。' },
        ],
      },
    },
  },
];
