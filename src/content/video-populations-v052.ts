import type { Source, Video } from '../domain/types';
import { videoSafetyV051Additions } from './video-additions-safety-v051';

const checkedAt = '2026-11-08';
const reviewedAt = '2026-11-08T07:19:01+09:00';
const visualRecordedAt = '2026-11-08T07:33:03+09:00';
const brooks = 'https://brooksrehab.org/resources/strength-exercises-to-prevent-falls/';
const nhsBalance = 'https://www.nhs.uk/live-well/exercise/balance-exercises/';
const olderAdults = 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-004.html';
const nzdf = 'https://health.nzdf.mil.nz/resources/healthy-habits-exercise-for-post-partum';
const acog = 'https://www.acog.org/womens-health/faqs/exercise-after-pregnancy';
const acogClinical =
  'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period';
const japanPt = 'https://www.japanpt.or.jp/activity/women_lifestage/';
const locomoPage = 'https://locomo-joa.jp/project/locomochannel';
const csep =
  'https://csepguidelines.ca/wp-content/uploads/2025/03/2025-Canadian-Guideline-for-Physical-Activity-Sedentary-Behaviour-and-Sleep-throughout-the-First-Year-Postpartum_EN.pdf';

export const populationsV052Sources: Source[] = [
  {
    id: 'v052-age-brooks-transcript',
    title: 'Brooks Rehabilitation: Strength Exercises to Prevent Falls',
    url: brooks,
    edition: '2021-09-22公開、2024-10-31更新の公式動画ページ',
    checkedAt,
    locator:
      '同一ID VnlaGnfYyR0 の埋め込み直下のVideo Transcript。両手で壁に届く位置、難しければ足を離すという調整、初回の見守り。',
    note: '動画の英語全文文字起こしを実読。閉眼や頭部を動かす進行は推薦範囲外。',
  },
  {
    id: 'v052-age-nhs-balance',
    title: 'NHS: Balance exercises',
    url: nhsBalance,
    edition: '2023-11-07最終レビューと表示された公開版',
    checkedAt,
    locator:
      '冒頭の壁・安定した椅子を近くに置く説明、Simple grapevine・Heel-to-toe walkの支持に関する注意。',
  },
  {
    id: 'v052-age-mhlw-older',
    title: '厚生労働省：健康づくりのための身体活動・運動ガイド2023 推奨シート 高齢者版',
    url: olderAdults,
    edition: 'ガイド2023、e-ヘルスネット公開本文2024-03-19更新',
    checkedAt,
    locator: '1．推奨事項の個人差と転倒への配慮、3．多要素な運動について。',
    note: '高齢者の能力と健康状態に応じて課題を調整する原則を参照。個人の実施可否や効果量は評価しない。',
  },
  {
    id: 'v052-postpartum-nzdf-transcript',
    title: 'New Zealand Defence Force: Healthy Habits - Exercise for post-partum',
    url: nzdf,
    edition: '公式公開動画ページの時刻付き文字起こし（版日付記載を確認できず）',
    checkedAt,
    locator:
      '同一ID AzjWJ5AMHKU の直下のRead transcript for this video。4:26–5:14の個人差、7:15–7:29の帝王切開後の抵抗運動前の相談。',
    note: 'ニュージーランド国防軍の研修例。軍の復職基準・週数・制度・訓練内容は推薦範囲外。',
  },
  {
    id: 'v052-postpartum-csep',
    title:
      'CSEP: 2025 Canadian Guideline for Physical Activity, Sedentary Behaviour & Sleep Throughout the First Year Postpartum',
    url: csep,
    edition: '2025年版、CSEP公式PDF',
    checkedAt,
    locator:
      'PDFのRecommendations 2・6・7。運動への医療相談、回復後の段階的な移行、症状と個人差。Relative contraindicationsも参照。',
    note: '産後の再開時期を個別化する原則を参照。各国の活動量目標や週数をこの動画の推薦へ持ち込まない。',
  },
  {
    id: 'v052-pregnancy-japanpt',
    title: '日本理学療法士協会：女性のライフステージと理学療法',
    url: japanPt,
    edition: '公式掲載ページ、対応YouTube動画の公開表示2026-10-13',
    checkedAt,
    locator:
      '産前・産後サポート事業「妊娠中の方が自宅で出来る快適な身体の使い方」から同一ID et6UXotNb7w。動画1:38・1:41・1:44・2:38の画面字幕と実演を目視。',
    note: '妊娠中の日常姿勢の調整例。動画の選択箇所以外の運動や個別の医療条件は推薦範囲外。',
  },
];

function videoIdentity(
  youtubeId: string,
  title: string,
  channel: string,
  unitId: string,
  objectiveId: string,
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
    difficulty: '基礎',
    order: 1,
    reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '発信元の公式ページの同一YouTube埋め込みIDと、YouTube oEmbed実応答の正式タイトル・チャンネルを照合。',
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
  };
}

const existingLocomo = videoSafetyV051Additions.find((video) => video.youtubeId === 'naxwLgfB644')!;

export const populationsV052Videos: Video[] = [
  {
    ...videoIdentity(
      'VnlaGnfYyR0',
      'Strength Exercises to Prevent Falls | Brooks Rehabilitation',
      'Brooks Rehabilitation',
      'ex-plan-age',
      'ex-plan-age-o2',
      '確認範囲は、立位バランス練習で壁に手が届く位置を確保し、難しければ足幅を広げる調整です。閉眼と頭部を動かす進行は対象外です。',
    ),
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが公式ページの同一IDの英語全文文字起こしを実読。NHSと厚生労働省の公開本文に照合。記録時のUTC時計は2026-11-07T22:19:01Z。',
      sourceRefs: [
        {
          sourceId: 'v052-age-brooks-transcript',
          locator: 'Video Transcriptの壁・足幅・初回見守りの段落。',
        },
        { sourceId: 'v052-age-nhs-balance', locator: '冒頭の壁・安定した椅子、必要時の支持。' },
        {
          sourceId: 'v052-age-mhlw-older',
          locator: '1．可能なものから取り組むこと、身体機能低下時の転倒への配慮。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt: reviewedAt,
        objectiveIds: ['ex-plan-age-o2'],
        coverage:
          '公式ページのVideo Transcript全文を実読。壁に手が届く開始位置、難しい場合の足幅の調整、初回の見守りに範囲を限定。公式本文に時刻の記載なし。',
        findings: [
          '壁に手が届く配置で始める説明をNHSの安定した支持物を近くに置く方法と照合。',
          '足を離して課題を易しくする説明を厚生労働省の能力に応じた課題調整の原則と照合。高齢者の多要素な計画のうち、立位バランス環境を考える補助。',
        ],
        limitations: [
          '閉眼、頭部運動、固定した保持時間・反復数、転倒予防効果の保証は対象外。見守りが必要な人の運動可否や、単独練習への進行は個別に判断する。',
          '若年者の監督、座位への変更、筋力・パワーの計画、生活動作への進行は本動画の確認範囲外。',
          '映像・音声・実再生・埋め込み・人間の専門家による本データの審査は未実施。',
        ],
        evidence: [
          { url: brooks, locator: '同一ID VnlaGnfYyR0 の埋め込み直下にあるVideo Transcript。' },
          { url: nhsBalance, locator: '冒頭と各種目の支持物の記載。' },
          { url: olderAdults, locator: '1．推奨事項の個人差と転倒への配慮。' },
        ],
      },
    },
  },
  {
    ...existingLocomo,
    reason:
      'ロコモ対策の候補。実再生と踏み込みの一場面を確認しました。高齢者の能力に応じた支持や動作の調整は確認できていません。',
    metadata: {
      ...existingLocomo.metadata,
      checkedAt,
      method:
        '日本整形外科学会の公式掲載ID、YouTube oEmbed実応答、同一IDのYouTube視聴ページの正式タイトル・チャンネルを再照合。',
    },
    playback: {
      status: 'playable',
      checkedAt: visualRecordedAt,
      method:
        '同一YouTube watchで0:02→0:13の時間進行と実映像を確認。プレーヤーの全長表示は0:57。全編連続視聴は未実施。',
    },
    content: {
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
      review: {
        decision: 'hold',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt: visualRecordedAt,
        objectiveIds: existingLocomo.objectiveIds,
        coverage:
          '0:03・0:13・0:28・0:46の実画面を目視。0:28の立位踏み込み場面と支持の有無を観察した。記録時のUTC時計は2026-11-07T22:33:03Z。',
        findings: [
          '0:28に両手を腰へ当てた深い踏み込みの姿勢が見えた。支えや座位での変更は確認できず、運動の選び方や進行の条件を根拠に照合できなかったため候補。',
        ],
        limitations: [
          '一部画面の観察。対象者・負荷・回数・高齢者への適用・音声・字幕本文・YouTube埋め込みは未確認。',
          '高齢者の立位バランスや筋力練習、座位・パワー練習の安全をこの動画で確認済みとは扱わない。',
        ],
        evidence: [
          { url: existingLocomo.url, locator: '同一IDのYouTube watchの0:28実画面。' },
          { url: locomoPage, locator: '日本整形外科学会の掲載ページ「千葉大学整形外科」。' },
        ],
      },
    },
  },
  {
    ...videoIdentity(
      'et6UXotNb7w',
      '妊娠中の方が自宅で出来る快適な身体の使い方',
      '公益社団法人日本理学療法士協会',
      'ex-plan-pregnancy',
      'ex-plan-pregnancy-o2',
      '1:38–1:44の仰向けでの不快感と姿勢変更、2:38の横向きで腹部を支える例を日本語の字幕と実演で確認します。個別の運動条件は産科と相談して決めます。',
    ),
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '日本理学療法士協会の公式掲載リンク、YouTube oEmbed実応答、同一IDのYouTube視聴ページの正式タイトル・チャンネルを照合。',
      evidenceUrl:
        'https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Det6UXotNb7w&format=json',
    },
    playback: {
      status: 'playable',
      checkedAt: visualRecordedAt,
      method:
        'YouTube視聴ページの0:00→0:11の時間進行と実映像を確認。プレーヤーの全長表示は10:01。全編連続視聴は未実施。',
    },
    content: {
      status: 'source_checked',
      checkedAt: visualRecordedAt,
      method:
        'AIが同一IDの実画面に焼き込まれた日本語字幕と実演を目視し、ACOG Committee Opinion 804の仰臥位に関する公式検索取得本文を実読して照合。画面観察の記録時のUTC時計は2026-11-07T22:33:03Z。',
      sourceRefs: [
        {
          sourceId: 'v052-pregnancy-japanpt',
          locator:
            '1:38・1:41・1:44の仰向けでの圧迫・不快と横向きの提案、2:38の横向きで腹部を支える実演。',
        },
        {
          sourceId: 'ex-plan-pregnancy-clinical',
          locator:
            'Anatomic and Physiologic Aspects / Recommending an Exercise Program。妊娠期に長い仰臥位を保つ場合の循環と姿勢変更。2026-11-08再読。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt: visualRecordedAt,
        objectiveIds: ['ex-plan-pregnancy-o2'],
        coverage:
          '同一YouTube視聴ページの1:38・1:41・1:44・2:38の実画面と日本語字幕を目視。長い仰臥位への配慮と、横向きの日常姿勢の支え方を検討する例に限定。',
        findings: [
          '1:38・1:41の仰向けで腹部の大きな血管が圧迫され不快になりうる説明と、1:44の横向きの提案を確認。ACOGの妊娠中に長い仰臥位を避け、循環への影響を考慮する説明と照合。',
          '2:38の横向き姿勢で折ったタオルを腹部の下に入れて支える例を実画面で確認。お腹に負担を感じるときに姿勢や支えを選ぶ観察例として、o2の姿勢調整の部分に限定。',
        ],
        limitations: [
          '確認範囲は妊娠中の日常姿勢とその調整の例。具体的な妊娠週数・仰臥位の時間、全員への寝方の指定、症状の診断・治療や運動許可は対象外。',
          '転倒、暑熱、運動強度・禁忌・中止徴候、産後の再開はこの動画の推薦範囲外。',
          '日本語の主要画面・焼き込み字幕を確認。音声・字幕全文・実埋め込み・人間の専門家による本データの審査は未実施。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=et6UXotNb7w',
            locator:
              '実画面1:38・1:41・1:44・2:38。視聴ページで正式タイトル・チャンネル・公開日も確認。',
          },
          {
            url: japanPt,
            locator: '公式ページ「妊娠中の方が自宅で出来る快適な身体の使い方」の動画リンク。',
          },
          {
            url: acogClinical,
            locator: '仰臥位での静脈還流への影響と長時間の仰臥位を避ける段落。',
          },
        ],
      },
    },
  },
  {
    ...videoIdentity(
      'AzjWJ5AMHKU',
      'Healthy Habits - Exercise for Post-Partum',
      'Force4Families',
      'ex-plan-pregnancy',
      'ex-plan-pregnancy-o3',
      '4:26–5:14の分娩後の回復の個人差と、7:15–7:29の帝王切開後の運動再開を医療者に相談する部分を確認します。英語の国防軍向け研修で、動画の週数や復職基準は対象外です。',
    ),
    order: 2,
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが発信元の同一IDに紐づく時刻付き文字起こしの該当箇所を実読し、ACOG FAQ131とCSEP公式2025年版に照合。記録時のUTC時計は2026-11-07T22:19:01Z。',
      sourceRefs: [
        {
          sourceId: 'v052-postpartum-nzdf-transcript',
          locator: '4:26–5:14、7:15–7:29の産後再開と医療者への相談。',
        },
        {
          sourceId: 'ex-plan-pregnancy-postpartum',
          locator:
            'Starting to Exercise：分娩様式・合併症に応じた産科相談と段階的再開。2026-11-08再読。',
        },
        {
          sourceId: 'v052-postpartum-csep',
          locator: 'PDFのRecommendations 2・6・7、Relative contraindications。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt: reviewedAt,
        objectiveIds: ['ex-plan-pregnancy-o3'],
        coverage:
          '公式の時刻付き文字起こし4:26–5:14、7:15–7:29を実読して産後の回復の個人差と帝王切開後に抵抗運動を始める前の医療者への相談を照合。',
        findings: [
          '合併症や分娩時の損傷によって回復に差があり、ほかの人の経過と一律に比べない説明を確認。CSEPの回復・症状に応じた段階的な進行と整合。',
          '帝王切開後の抵抗運動について担当医療者と相談する説明を、ACOGの帝王切開・合併症時の運動再開の相談と照合。',
        ],
        limitations: [
          '国防軍の産後復帰研修の限られた箇所。軍の就業・体力試験条件、個別の訓練、動画内の固定週数、ニュージーランドの制度は対象外。',
          '妊娠期の開始条件・中止徴候、産後の診断・個人の再開許可、運動の具体的な処方は対象外。',
          '英語の文字起こし該当箇所を確認。全編内容、映像・音声・実再生・埋め込み・人間の専門家による本データの審査は未実施。',
        ],
        evidence: [
          {
            url: nzdf,
            locator:
              '同一ID AzjWJ5AMHKU と直下のRead transcript for this video。4:26–5:14、7:15–7:29。',
          },
          { url: acog, locator: 'FAQ131 Starting to Exercise。公式検索取得本文を実読。' },
          {
            url: csep,
            locator: 'CSEP 2025年版PDFのRecommendations 2・6・7、Relative contraindications。',
          },
        ],
      },
    },
  },
];
