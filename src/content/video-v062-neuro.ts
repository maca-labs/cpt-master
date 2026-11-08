import type { Source, Video } from '../domain/types';

const checkedAt = '2026-11-08';
const unitId = 'ed3-plan-neuro';
const cpfPage = 'https://cpresource.org/media/cpf-live/cpf-live-byron-lai-phd';
const cpfTranscript = 'https://cpresource.org/cpf-live-byron-lai-transcript';
const nagasakiGuide = 'https://nagasaki-mc.hosp.go.jp/section/epilepsy_guidebook.html';

export const neuroV062Sources: Source[] = [
  {
    id: 'v062-neuro-cpf-transcript',
    title: 'Cerebral Palsy Foundation: CPF LIVE with Byron Lai Transcript',
    url: cpfTranscript,
    edition: '公式動画ページの2021-09-28公開表示と同じ対談の文字起こし',
    checkedAt,
    locator:
      '運動計画の相談先を尋ねる箇所、脳性まひの身体機能の個人差と活動の選択肢を説明する箇所。',
  },
  {
    id: 'v062-neuro-nice-cp',
    title: 'NICE NG119: Cerebral palsy in adults',
    url: 'https://www.nice.org.uk/guidance/ng119/chapter/Recommendations',
    edition: '2019年公開ガイドライン',
    checkedAt,
    locator:
      'Recommendations 1.2.18–1.2.20。身体活動の意義、利用しやすい地域サービス、必要に応じた専門職への相談。',
  },
];

function videoIdentity(
  youtubeId: string,
  title: string,
  channel: string,
  objectiveId: string,
  order: number,
  reason: string,
): Omit<Video, 'content'> {
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  return {
    id: `yt-${youtubeId}`,
    youtubeId,
    title,
    channel,
    url,
    unitIds: [unitId],
    objectiveIds: [objectiveId],
    difficulty: '応用',
    order,
    reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '発信元の公式ページのYouTube動画IDと、YouTube oEmbedの正式タイトル・チャンネルを照合。',
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
  };
}

export const neuroV062Videos: Video[] = [
  {
    ...videoIdentity(
      'NPeDYdDhlFI',
      '「日常生活編①：入浴やスポーツ」',
      '長崎医療センターてんかんセンター',
      unitId + '-o3',
      1,
      '国立病院機構の日本語資料。てんかんのある人のスポーツ参加を考えるための候補。',
    ),
    playback: {
      status: 'playable',
      checkedAt,
      method: 'YouTube視聴ページをブラウザで開き、動画の再生と43秒の映像を確認。',
    },
    content: {
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
      review: {
        decision: 'hold',
        reviewerType: 'ai',
        method: 'unavailable',
        checkedAt,
        coverage: '長崎医療センターの公式掲載とYouTubeの書誌情報を確認。',
        objectiveIds: [unitId + '-o3'],
        findings: ['公式ガイドの動画リンクが同じIDを指すことを確認。'],
        limitations: ['公式ガイド本文は動画の逐語記録と確認できず、本編の内容照合を保留。'],
        evidence: [
          {
            url: nagasakiGuide,
            locator: '動画6「日常生活編（1）：入浴やスポーツ」の埋め込みと第2章の動画リンク。',
          },
        ],
      },
    },
  },
  {
    ...videoIdentity(
      'Z_Z61O7GxmY',
      'CPF LIVE! with Byron Lai, PhD - Sports and Recreation for individuals with Cerebral Palsy',
      'Cerebral Palsy Foundation',
      unitId + '-o2',
      2,
      '脳性まひのある人の身体機能や相談先に合わせ、運動への参加方法を選ぶ視点を学ぶ。英語。',
    ),
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        '公式動画ページに紐づく対談本文を実読し、学習目標の脳性まひの範囲をNICEの成人ガイドラインと照合。',
      sourceRefs: [
        {
          sourceId: 'v062-neuro-cpf-transcript',
          locator: '運動計画の相談先を尋ねる箇所、身体機能の個人差と活動の選択肢を説明する箇所。',
        },
        {
          sourceId: 'v062-neuro-nice-cp',
          locator: 'Recommendations 1.2.18–1.2.20。利用しやすい活動先と専門職の支援。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt,
        objectiveIds: [unitId + '-o2'],
        coverage:
          '発信元が公開した英語対談の文字起こし。相談先と身体機能の個人差についての発言を照合。',
        findings: [
          '身体機能には個人差があり、活動を一律に選べないという説明を確認。',
          '本人に合う活動を選ぶ際に、理学療法士などの専門職へ相談する説明を確認。',
        ],
        limitations: [
          '推薦範囲は脳性まひの活動選択と相談先。多発性硬化症、運動量の数値、機器の効果や個人の実施可否は含めない。',
          '対談に登場する支援先は米国の例。NICEの参照箇所は成人が対象。',
        ],
        evidence: [
          {
            url: cpfPage,
            locator: 'YouTube ID Z_Z61O7GxmY の埋め込みと発信元のTranscriptリンク。',
          },
          {
            url: cpfTranscript,
            locator:
              '運動計画をどこへ相談するかという質問への回答と、終盤の身体機能の個人差についての回答。',
          },
        ],
      },
    },
  },
];
