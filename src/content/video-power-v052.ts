import type { Source, SourceRef, Video } from '../domain/types';

const checkedAt = '2026-11-08';
const reviewedAt = '2026-11-07T22:28:04Z';
const jfaTrainingPdf =
  'https://www.jfa.jp/youth_development/national_tracen_u14w_2026/trainingmenu.pdf';
const jfaSourceId = 'v052-power-jfa-u14-fitness';

export const powerV052Sources: Source[] = [
  {
    id: jfaSourceId,
    title: '日本サッカー協会：2026 ナショナルトレセン女子 U-14 トレーニングメニュー',
    url: jfaTrainingPdf,
    edition: '2026年、JFA公式公開PDF',
    checkedAt,
    locator:
      'PDF p.7「バランス／アジリティエクササイズ」の①スクワットジャンプと③サイドホップ。指導ポイントの本文と両動画のリンク注釈を確認。',
    note: '育成年代のサッカー向けの例。支持脚、着地姿勢、難度を進める条件の照合に使用。',
  },
];

interface JumpObservation {
  youtubeId: string;
  title: string;
  difficulty: Video['difficulty'];
  order: number;
  reason: string;
  playback: string;
  coverage: string;
  findings: string[];
  limitations: string[];
  sourceRefs: SourceRef[];
}

function reviewedJfaJump(observation: JumpObservation): Video {
  const url = `https://www.youtube.com/watch?v=${observation.youtubeId}`;
  const objectiveIds = ['ex-plan-power-o1', 'ex-tech-power-o1'];
  return {
    id: `yt-${observation.youtubeId}`,
    youtubeId: observation.youtubeId,
    title: observation.title,
    channel: 'JFA Technical Center TV',
    url,
    unitIds: ['ex-plan-power', 'ex-tech-power'],
    objectiveIds,
    difficulty: observation.difficulty,
    order: observation.order,
    reason: observation.reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        'JFA公式公開PDF p.7のリンク注釈で動画IDを特定。YouTube公式oEmbedと視聴ページでタイトル・チャンネルを照合。視聴ページは限定公開表示で、JFA資料から到達できる。',
      evidenceUrl: `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    },
    playback: { status: 'playable', checkedAt: reviewedAt, method: observation.playback },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIがYouTube視聴ページの実映像と日本語テロップを目視し、JFAの指導ポイントと関連する一次資料を照合。対象は記録した部分。',
      sourceRefs: observation.sourceRefs,
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt: reviewedAt,
        coverage: observation.coverage,
        objectiveIds,
        findings: observation.findings,
        limitations: [
          'JFAの育成年代向け練習例。成人や別競技では対象者の経験と着地制御に合わせて課題を選ぶ。',
          '主要場面の確認。音声・埋め込み再生・人間の専門家による審査は未確認。',
          ...observation.limitations,
        ],
        evidence: [
          { url, locator: observation.coverage },
          {
            url: `${jfaTrainingPdf}#page=7`,
            locator: '同一IDへのリンク注釈と、該当種目のコーチングポイント。',
          },
        ],
      },
    },
  };
}

export const powerV052Videos: Video[] = [
  reviewedJfaJump({
    youtubeId: 'Lw5kIzal9rw',
    title: 'NTCWU-14 女子 バランス・アジリティ ①スクワットジャンプ',
    difficulty: '基礎',
    order: 1,
    reason:
      '0:06の正面と0:15〜0:17の側面を見比べ、両脚で跳んでから股関節と膝を曲げて着地する動作を確認します。次の片脚サイドホップと支持脚の違いを比較できます。',
    playback: 'YouTube視聴ページで0:01から0:06、側面場面で0:15から0:17への時間進行と実映像を確認。',
    coverage:
      '0:06の正面の両脚離地、0:15〜0:17の側面からの接地と股関節・膝の屈曲。0:15以降のスクワット姿勢で着地する指導テロップ。',
    findings: [
      '正面で両脚が地面を離れ、側面の再接地では股関節と膝を曲げる。JFA p.7の着地姿勢の指導ポイントと照合した。',
      '両脚で着地を制御する課題の例。支持と難度を段階的に選ぶNSCA p.23および、反復数より着地の質を重視するACE p.1と照合した。',
    ],
    limitations: [
      '学習目標の両脚支持と着地姿勢に限る。片脚・多方向・反応課題への進行は単元本文と関連動画を参照。',
      '映像で視認できる股関節と膝の動きに限る。足関節の角度・接地順・着地衝撃の計測は対象外。',
    ],
    sourceRefs: [
      { sourceId: jfaSourceId, locator: 'PDF p.7 ①スクワットジャンプの着地指導と動画リンク。' },
      {
        sourceId: 'ex-plan-power-plyometric',
        locator: '印刷p.23、Exercise Selectionの両脚での動的制御と、低い複雑さからの進行。',
      },
      { sourceId: 'ex-tech-landing', locator: 'PDF p.1、Quality, Not Quantityの着地制御。' },
    ],
  }),
  reviewedJfaJump({
    youtubeId: 'bRFbTsZ-PMM',
    title: 'NTCWU-14 女子 バランス・アジリティ ③サイドホップ',
    difficulty: '応用',
    order: 2,
    reason:
      '0:15〜0:16の片脚着地で、横へ移動した後の姿勢と股関節・膝の動きを確認します。安定を確かめてから高さや距離を進める判断の例です。',
    playback: 'YouTube視聴ページで0:00から0:04、0:16への時間進行と実映像を確認。',
    coverage:
      '0:15〜0:16の正面映像。横移動の前後で支持脚が切り替わる場面、片脚着地時の股関節・膝の屈曲、0:16の着地の安定と難度調整のテロップ。',
    findings: [
      '横移動の前後で支持脚が切り替わり、片脚で身体を受け止める。着地時は股関節と膝が曲がっている。',
      'テロップとJFA p.7の双方で、着地姿勢の安定を確認してから高さ・距離を伸ばす指導を確認。支持や複雑さを段階的に変えるNSCA p.23の考え方と照合した。',
    ],
    limitations: [
      '学習目標の片脚支持・横方向・着地の質を基準にした難度調整に限る。高さや距離の具体的な設定、接地回数、回復時間は単元本文を参照。',
      '前方の画角から確認できる動きのみ。関節の正確な角度や負荷、傷害の診断は個別評価が必要。',
    ],
    sourceRefs: [
      {
        sourceId: jfaSourceId,
        locator: 'PDF p.7 ③サイドホップの片脚着地・姿勢の安定・高さと距離の進行。',
      },
      {
        sourceId: 'ex-plan-power-plyometric',
        locator: '印刷p.23、Exercise Selectionの両脚から片脚の横方向ジャンプへの進行。',
      },
      {
        sourceId: 'ex-tech-landing',
        locator: 'PDF p.1、Proceed with Caution / Quality, Not Quantity。',
      },
    ],
  }),
];
