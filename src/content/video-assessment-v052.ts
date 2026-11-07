import type { Source, Video } from '../domain/types';

const checkedAt = '2026-11-08';
const openLearn = 'https://www.open.edu/openlearn/one-minute-methods-validity-reliability';
const transcript =
  'https://www.open.edu/openlearn/pluginfile.php/4386494/tool_ocwmanage/article/1/Transcript%20-%20One%20minute%20methods%20%E2%80%93%20validity%20and%20reliability.pdf';
const uva = 'https://tlc.uva.nl/en/article/1-designing/?faculty=54';
const qualityGoal = 'ex-assess-quality-o1';
const gripGoal = 'ex-assess-adult-tests-o1';
const gripCheckedAt = '2026-11-07T22:33:03Z';
const yokohama =
  'https://www.city.yokohama.lg.jp/nishi/kenko-iryo-fukushi/kenko_iryo/kenkozukuri/sonota/kenkou-check.html';
const adultProtocol =
  'https://www.mext.go.jp/sports/content/20220517-spt-kensport01-300000771_3.pdf';

export const assessmentV052Sources: Source[] = [
  {
    id: 'v052-openlearn-measurement-transcript',
    title: 'The Open University: One minute methods – validity and reliability',
    url: transcript,
    edition: '公式掲載ページ 2024-06-03更新',
    checkedAt,
    locator: '1ページの公式文字起こし。目的に合う測定と繰り返した結果の一貫性を説明する箇所。',
    note: '同じ公式掲載ページが同一YouTube IDの埋め込みとPDFを案内。公開検索取得のPDF本文を実読。映像・実再生は未確認。',
  },
  {
    id: 'v052-uva-assessment-quality',
    title: 'University of Amsterdam Teaching and Learning Centres: Assessment quality standards',
    url: uva,
    edition: '公開Web本文',
    checkedAt,
    locator: '6. Assessment quality standards / Validity / Reliability',
    note: '目的に合う測定と反復結果の一貫性の区別を照合。大学の教育評価資料で、成人の体力テストの基準値は扱わない。',
  },
  {
    id: 'v052-sports-agency-grip',
    title: 'スポーツ庁 新体力テスト実施要項（20～64歳対象）',
    url: adultProtocol,
    edition: '公式要項ページ掲載PDF',
    checkedAt,
    locator: '印刷p.2（PDF第3ページ）握力、方法と記録。',
    note: '立位、腕の位置、身体・衣服との接触回避と握り幅を実映像に照合。集計は公式要項と単元本文を参照。',
  },
];

export const assessmentV052Videos: Video[] = [
  {
    id: 'yt-6soE-apwodw',
    youtubeId: '6soE-apwodw',
    title: 'One minute methods - Validity and reliability',
    channel: 'OpenLearn from The Open University',
    url: 'https://www.youtube.com/watch?v=6soE-apwodw',
    unitIds: ['ex-assess-quality'],
    objectiveIds: [qualityGoal],
    difficulty: '基礎',
    order: 1,
    reason:
      '目的に合う量を測れているかと、同じ条件で結果がそろうかを分けて考える英語の短編。公式文字起こしで二つの定義を照合しました。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        'OpenLearnの公式掲載ページで同一の埋め込みIDを確認し、YouTube公式oEmbedのタイトル・チャンネルと照合。',
      evidenceUrl:
        'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6soE-apwodw',
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIが同じ公式掲載ページの埋め込みIDと1ページの公式文字起こしを対応づけ、取得できた本文を実読して独立資料と照合。',
      sourceRefs: [
        {
          sourceId: 'v052-openlearn-measurement-transcript',
          locator: '1ページ、妥当性と信頼性の各説明。',
        },
        {
          sourceId: 'v052-uva-assessment-quality',
          locator: '6. Assessment quality standardsのValidityとReliability。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt,
        coverage:
          '公式文字起こし全体のうち、測定の目的との一致と、同条件での結果の一貫性を区別する説明。',
        objectiveIds: [qualityGoal],
        findings: ['同じ結果を繰り返せることと、測りたいものを捉えていることの二つを区別できる。'],
        limitations: [
          '英語の研究方法の入門。体力測定での一般化の範囲、検者の具体的な手順、器具の誤差や最小変化量は単元本文で確認する。実映像、再生、埋め込みは未確認。',
        ],
        evidence: [
          { url: openLearn, locator: '同一動画IDの公式埋め込みと直下のTranscriptリンク。' },
          { url: transcript, locator: '1ページの検索取得本文。時刻表示なし。' },
          { url: uva, locator: '6. Assessment quality standards / Validity / Reliability。' },
        ],
      },
    },
  },
  {
    id: 'yt-fxXRSLr9FUA',
    youtubeId: 'fxXRSLr9FUA',
    title: '健康チェック機器の使い方～握力計・足指力計測機器編～',
    channel: 'CityOfYokohama',
    url: 'https://www.youtube.com/watch?v=fxXRSLr9FUA',
    unitIds: ['ex-assess-adult-tests'],
    objectiveIds: [gripGoal],
    difficulty: '基礎',
    order: 1,
    reason:
      '握力計の握り幅の調整と、立位で身体や衣服に触れさせずに構える姿勢を確認できます。左右の記録と集計は単元本文で学びます。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '横浜市西区公式ページに掲載された同一IDを、YouTube公式oEmbedのタイトルとチャンネルで照合。',
      evidenceUrl:
        'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DfxXRSLr9FUA',
    },
    playback: {
      status: 'playable',
      checkedAt: gripCheckedAt,
      method:
        'YouTube視聴ページで動画内時刻0:00から0:09の進行と、0:51および1:17の表示内容を実画面で確認。',
    },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt: gripCheckedAt,
      method:
        'AIが同一YouTube IDの動画内スライド・モデル写真・テロップを確認し、スポーツ庁の成人要項の握力測定と照合。',
      sourceRefs: [
        { sourceId: 'v052-sports-agency-grip', locator: '印刷p.2 握力の方法（1）と（2）。' },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt: gripCheckedAt,
        coverage:
          '0:51の握り幅を調節するノブと第2関節の角度、1:17の立位・腕の位置・身体や衣服との接触回避の写真とテロップ。',
        objectiveIds: [gripGoal],
        findings: [
          '0:51の画面は第2関節がほぼ直角となる握り幅の調節を示す。成人要項では人差し指の第2関節を使う。',
          '1:17の画面は両足を自然に開いて立ち、腕を体側に下げ、握力計を身体や衣服に触れさせない姿勢を示す。',
        ],
        limitations: [
          '確認した画面文字では指の名称まで確認できなかったため、成人要項で人差し指を確認する。左右の試行順・端数処理・集計と足指力の部分は推薦範囲外。',
          '主要画面を照合。音声・全編・埋め込み・人間の専門家レビューは未確認。',
        ],
        evidence: [
          { url: yokohama, locator: '握力計・足指力計測機器編の公式掲載箇所。' },
          {
            url: 'https://www.youtube.com/watch?v=fxXRSLr9FUA',
            locator: '0:51と1:17の動画内画面。',
          },
          { url: adultProtocol, locator: '印刷p.2（PDF第3ページ）握力の測定方法。' },
        ],
      },
    },
  },
];
