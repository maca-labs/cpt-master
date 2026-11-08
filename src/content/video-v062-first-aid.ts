import type { Source, SourceRef, Video } from '../domain/types';
import { resuscitation } from './edition3/safety-sources';

const checkedAt = '2026-11-08';
const unitId = 'ed3-safe-first-aid';
const catalog = 'https://www.jrc.or.jp/lp/webcross/movie.html';
const bleedSourceId = 'v062-jrc-direct-pressure';
const restSourceId = 'v062-jrc-recovery-position';

export const firstAidV062Sources: Source[] = [
  {
    id: bleedSourceId,
    title: '日本赤十字社：多量の出血',
    url: 'https://www.jrc.or.jp/study/safety/bleed/',
    edition: '公開Web版',
    checkedAt,
    locator: '「直接圧迫止血法」の本文と手袋についての注記',
    note: '出血点へのガーゼと直接圧迫、救助者の感染予防、医師の診療を受けることの根拠。',
  },
  {
    id: restSourceId,
    title: '日本赤十字社：傷病者の安静',
    url: 'https://www.jrc.or.jp/study/safety/rest/',
    edition: '公開Web版',
    checkedAt,
    locator: '「回復体位」の本文と3枚の手順図',
    note: '体を支えながら横向きにする実演の照合に使用。適用条件と継続観察は現行の市民用指針で照合。',
  },
];

interface VisualReview {
  youtubeId: string;
  title: string;
  objective: 'o1' | 'o3';
  order: number;
  reason: string;
  coverage: string;
  findings: string[];
  limitations: string[];
  sourceRefs: SourceRef[];
  playback: string;
}

function reviewedJapaneseRedCrossVideo(review: VisualReview): Video {
  const url = `https://www.youtube.com/watch?v=${review.youtubeId}`;
  const objectiveIds = [`${unitId}-${review.objective}`];
  return {
    id: `yt-${review.youtubeId}`,
    youtubeId: review.youtubeId,
    title: review.title,
    channel: 'JapaneseRedCrossPR',
    url,
    unitIds: [unitId],
    objectiveIds,
    difficulty: '基礎',
    order: review.order,
    reason: review.reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '赤十字WEB CROSSの公式動画一覧で同一動画IDを確認し、YouTube公式oEmbedと視聴ページで正式タイトル・チャンネルを照合。',
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    },
    playback: { status: 'playable', checkedAt, method: review.playback },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIがYouTube視聴ページの実映像と画面内の日本語説明を確認し、学習目標と日本の現行市民用指針、公開手技資料と照合。',
      sourceRefs: review.sourceRefs,
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        objectiveIds,
        coverage: review.coverage,
        findings: review.findings,
        limitations: review.limitations,
        evidence: [
          { url, locator: review.coverage },
          { url: catalog, locator: '救急法の動画一覧に掲載された同一YouTube ID。' },
          { url: resuscitation.url, locator: 'Ⅵ「ファーストエイド」本文pp.46–47・51–52。' },
        ],
      },
    },
  };
}

export const firstAidV062Videos: Video[] = [
  reviewedJapaneseRedCrossVideo({
    youtubeId: '2QPrkzrXpVA',
    title: '【日本赤十字社】直接圧迫止血法',
    objective: 'o3',
    order: 1,
    reason:
      '日本語。手袋で救助者を守り、ガーゼを出血部位に当てて直接圧迫する手の置き方を確認できます。',
    coverage:
      'YouTubeの実演と画面内の日本語説明を0:04、0:09、0:14、0:19、0:25、0:32で確認。照合範囲は手袋、出血部位の特定、直接圧迫、止血後の固定。',
    findings: [
      '0:09に手袋を着けて出血箇所を探し、0:14・0:19にその箇所へガーゼを当てて手で圧迫する実演を確認。市民用指針の出血部位を特定し直接圧迫する手順と一致。',
      '0:25の包帯固定は出血が収まったことを確認してから行うと画面に表示。出血が続く場合は市民用指針に沿って圧迫を継続します。',
    ],
    limitations: [
      '照合は実演と画面内の説明に限定。音声の実聴、他サイトでの埋め込み、人間の専門家レビューは未確認。',
      '大量出血時の救急要請、圧迫を継続する条件と受診の判断は出典と併せて確認してください。',
    ],
    sourceRefs: [
      {
        sourceId: resuscitation.id,
        locator: '本文pp.51–52「9 出血」・図39。出血点への直接圧迫、圧迫の継続、手袋等。',
      },
      { sourceId: bleedSourceId, locator: '「直接圧迫止血法」。出血部位、ガーゼ、手袋、診療。' },
    ],
    playback:
      'YouTube視聴ページのプレーヤーで36秒の本編再生と時刻進行、実演が描画されたフレームを確認。',
  }),
  reviewedJapaneseRedCrossVideo({
    youtubeId: 'f2wMz9eG1_c',
    title: '【日本赤十字社】体位変換・回復体位',
    objective: 'o1',
    order: 2,
    reason:
      '日本語。0:26からの回復体位を学びます。反応がなく普段どおりの呼吸があるときの姿勢と、体を支えて横向きにする動きを確認できます。',
    coverage:
      'YouTubeの0:26からの回復体位の章を、0:28、0:34、0:40、0:46、0:54、0:58の実映像と日本語説明で確認。推薦する範囲は回復体位の適用条件と姿勢の実演。',
    findings: [
      '0:28のテロップは反応がなく普段どおりの呼吸がある傷病者を対象としており、市民用指針の適用条件と一致。',
      '0:34から0:54の確認箇所では身体を支えながら横向きにして姿勢を整える。市民用指針の図36と、赤十字社の「傷病者の安静」に示す手技を照合した。',
    ],
    limitations: [
      '推薦範囲は0:26以降の回復体位。通報・呼吸の判断、救急隊到着までの観察、呼吸の変化への対応は市民用指針と単元本文で学んでください。',
      '音声の実聴、他サイトでの埋め込み、人間の専門家レビューは未確認。',
    ],
    sourceRefs: [
      {
        sourceId: resuscitation.id,
        locator: '本文pp.46–47「1 傷病者の体位と移動」・図36。適用条件、呼吸の継続観察、再確認。',
      },
      {
        sourceId: restSourceId,
        locator: '「回復体位」。肩・腰を支え横向きにし、姿勢を安定させる手順。',
      },
    ],
    playback:
      'YouTube視聴ページのプレーヤーで61秒の動画の時刻進行と実演が描画されたフレームを確認。',
  }),
];
