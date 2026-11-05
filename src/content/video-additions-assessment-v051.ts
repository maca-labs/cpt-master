import type { Source, Video } from '../domain/types';

const checkedAt = '2026-11-05';
const reviewedAt = '2026-11-05T02:06:15Z';
const ahrqUrl = 'https://www.ahrq.gov/ncepcr/tools/self-mgmt/how.html';
const transcriptUrl = 'https://www.ahrq.gov/ncepcr/tools/self-mgmt/how-script.html';
export const videoAssessmentV051Sources: Source[] = [
  {
    id: 'v051-ahrq-self-management',
    title: 'AHRQ：自己管理支援の導入と公式動画の文字起こし',
    url: transcriptUrl,
    edition: '公式公開本文、最終レビュー2016年2月',
    checkedAt,
    locator:
      '冒頭の開かれた質問・反映的傾聴、共同での目標と行動計画、家族・チームの支援の段落。掲載元から同一YouTube埋め込みID DrSaYzWWWJ0 に対応する全文文字起こしへのリンクを実際に確認。',
    note: '英文の公式文字起こしを実読。映像・音声・再生・埋め込みは未確認。医療行為や診療体制をトレーナーへ移す根拠にはしない。',
  },
  {
    id: 'v051-niddk-behavior',
    title: 'NIH NIDDK：健康行動の計画と障壁への備え',
    url: 'https://www.niddk.nih.gov/health-information/diet-nutrition/changing-habits-better-health',
    edition: '公開本文、Last Reviewed November 2020',
    checkedAt,
    locator:
      'Preparation / Overcome roadblocks / Deal with unexpected setbacks。本人に合う小さな行動目標・周囲の支援・障壁への代案の該当本文を実読。',
  },
];
videoAssessmentV051Sources.push(
  {
    id: 'v051-nimh-consent',
    title: 'NIMH：研究参加の同意説明（公式動画文字起こし）',
    url: 'https://www.nimh.nih.gov/news/media/2022/what-is-informed-consent',
    edition: '2022-01-11公開、現在はArchived Contentの表示あり',
    checkedAt,
    locator:
      '同一動画ID y7BCOolGVcM のTranscript第1〜3段落。研究の説明・利益とリスク・質問・本人の任意の選択の部分を実読。',
    note: 'アーカイブであり現行医療・法令の包括的根拠とはしない。代理同意や研究特有の手続きは推薦対象外。',
  },
  {
    id: 'v051-fitness-consent',
    title: 'Fitness Alberta：運動指導の同意説明の項目',
    url: 'https://www.fitnessalberta.com/sites/default/files/2021-06/Informed_Consent.pdf',
    edition: '公開様式、版年記載なし（URLは2021-06）',
    checkedAt,
    locator:
      'pp.1–2 Purpose / Risks / Benefits / Inquiries and Freedom of Consent。説明と質問・理解の機会を再読。',
    note: 'カナダの運動団体の公開様式。様式の転載、日本の法律上の効力・免責の保証はしない。',
  },
);

export const videoAssessmentV051Additions: Video[] = [
  {
    id: 'yt-y7BCOolGVcM',
    youtubeId: 'y7BCOolGVcM',
    title: 'What is informed consent?',
    channel: 'National Institute of Mental Health (NIMH)',
    url: 'https://www.youtube.com/watch?v=y7BCOolGVcM',
    unitIds: ['ex-safe-consent'],
    objectiveIds: ['ex-safe-consent-o1'],
    difficulty: '基礎',
    order: 1,
    reason:
      '2022年の研究説明動画です。目的・利益とリスクを伝え、質問と本人の理解・選択の機会を設ける基本部分を英語で学びます。現行の日本の同意手続きや契約効力を示す教材ではありません。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        'NIMH公式掲載元の同一埋め込みIDと、YouTube公式oEmbedのtitle・author_nameを照合。公式掲載元にArchived Contentの表示があることも確認。',
      evidenceUrl:
        'https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dy7BCOolGVcM&format=json',
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt: '2026-11-05T02:11:33Z',
      method:
        'AIが同一IDへ直接対応するNIMH公式の全文文字起こしを実読し、説明と質問・理解の基本部分だけをFitness Albertaの公開運動指導様式pp.1–2と照合。',
      sourceRefs: [
        {
          sourceId: 'v051-nimh-consent',
          locator: 'Transcript第1〜3段落の説明・リスク・質問・任意性の基本部分',
        },
        {
          sourceId: 'v051-fitness-consent',
          locator: 'pp.1–2 Purpose / Risks / Benefits / Inquiries and Freedom of Consent',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt: '2026-11-05T02:11:33Z',
        objectiveIds: ['ex-safe-consent-o1'],
        coverage:
          '公式全文文字起こしを実読。推薦は冒頭の説明項目、質問と理解・選択の機会というo1の基本部分のみ。字幕のタイムコードがないため時刻を推定しない。',
        findings: [
          '署名より前に説明と質問・理解の機会を設ける部分を、運動指導の公開様式の説明項目へ照合した。',
        ],
        limitations: [
          'NIMH掲載元はアーカイブ表示。最新の研究手続きや医療・法令を包括的に確認した意味ではない。',
          '研究参加と一般の運動指導は異なる。代理同意、米国の研究手続き・法律、契約効力や免責、電子通信や指導記録の条件は確認対象外。日本の法的文書の代わりにしない。',
          '英語の公式文字起こしのみ。映像・音声・実再生・埋め込み、人間の専門家によるレビューは未実施。',
        ],
        evidence: [
          {
            url: 'https://www.nimh.nih.gov/news/media/2022/what-is-informed-consent',
            locator: '同一埋め込みIDの直下のTranscript。アーカイブ表示も確認',
          },
          {
            url: 'https://www.fitnessalberta.com/sites/default/files/2021-06/Informed_Consent.pdf',
            locator: 'pp.1–2の説明項目と質問・理解の記載',
          },
        ],
      },
    },
  },
  {
    id: 'yt-DrSaYzWWWJ0',
    youtubeId: 'DrSaYzWWWJ0',
    title: 'How To Implement Self-Management Support into Your Practice',
    channel: 'AHRQ Primary Care',
    url: 'https://www.youtube.com/watch?v=DrSaYzWWWJ0',
    unitIds: ['ex-assess-behavior'],
    objectiveIds: ['ex-assess-behavior-o1', 'ex-assess-behavior-o3'],
    difficulty: '基礎',
    order: 2,
    reason:
      '英語の医療面談の例から、本人の話を聞き、共同で目標と行動計画を作り、周囲の支援につなぐ部分を学びます。準備状態の分類や医療行為の実践は確認範囲外です。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method:
        '公式掲載ページの埋め込みIDと対応する文字起こしリンクを確認。YouTube公式oEmbedのtitle・author_name・author_urlをHTTPSで照会した。',
      evidenceUrl:
        'https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDrSaYzWWWJ0&format=json',
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが公式掲載元から同一動画へ対応づけられた英文全文文字起こしを実読し、下記の目標部分をNIDDKの公開本文と照合。動画・音声・字幕全文の保存や転載は行っていない。',
      sourceRefs: [
        {
          sourceId: 'v051-ahrq-self-management',
          locator: '共同の目標・行動計画、家族やチームの支援の段落',
        },
        {
          sourceId: 'v051-niddk-behavior',
          locator: 'Preparation / Overcome roadblocks / Deal with unexpected setbacks',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt: reviewedAt,
        objectiveIds: ['ex-assess-behavior-o1', 'ex-assess-behavior-o3'],
        coverage:
          '公式文字起こしの全段落を実読。推薦は開かれた質問と傾聴、共同の目標・行動計画、家族やチームとの障壁の確認・継続支援の部分に限定。時刻表示がないためタイムスタンプは付けない。',
        findings: [
          'o1の共同で具体的な目標と行動計画を作る部分を、NIDDKの本人に合う小さな行動目標の考え方と照合した。準備状態のモデル全体を動画が教えているとは扱わない。',
          'o3の周囲の支援と継続を妨げる条件への対応を、NIDDKの障壁・支援・中断への代案の本文へ照合した。',
        ],
        limitations: [
          '医療従事者の面談・チーム運営の例。薬剤・医療機器・治療や支援制度の運用をパーソナルトレーナーへ移さない。',
          '英語。公式文字起こしの確認であり、映像・音声の聴取、再生・埋め込み、全端末、人間の専門家によるレビューは未実施。',
          'o1の準備状態の分類、o2の自己記録の具体的な実施法、o3の全ての再開計画を確認した意味ではない。',
        ],
        evidence: [
          { url: ahrqUrl, locator: '同一IDの埋め込みとRead video transcriptの直接対応' },
          {
            url: transcriptUrl,
            locator: '公式全文文字起こし。共同目標・行動計画・家族やチーム支援の段落',
          },
        ],
      },
    },
  },
];

// Both identities were checked against official oEmbed and their listed page.
// These are discovery records only; no content check is inferred from a title.
videoAssessmentV051Additions.push(
  ...[
    {
      youtubeId: '-Ne23lcEECk',
      title: 'Reliability and Validity for School Leaders: What Every Principal Needs to Know',
      channel: 'Matthew B. Courtney, Ed.D.',
      unitId: 'ex-assess-quality',
      objectiveId: 'ex-assess-quality-o1',
      page: 'https://libguides.ucmerced.edu/research-methods/quantitative/4-other',
      reason:
        '大学図書館が案内する測定の信頼性・妥当性の候補です。学校評価向けの動画で、本編と身体能力評価への対応は未確認です。',
      limitation:
        'UC Mercedの紹介ページと同一埋め込みID、正式タイトル・チャンネルのみ確認。動画本編と身体能力測定への適用は未確認。',
    },
    {
      youtubeId: 'JUFuuTxh9vs',
      title: '【新体力テスト】握力のコツ',
      channel: '大阪府教育庁保健体育課official',
      unitId: 'ex-assess-adult-tests',
      objectiveId: 'ex-assess-adult-tests-o1',
      page: 'https://www.pref.osaka.lg.jp/o180070/hokentaiku/kyougisupo-tutop/sintairyokutestdouga.html',
      reason:
        '自治体公式の握力測定の補助候補です。小学生向けのため、成人20〜64歳要項の手順・集計へ転用できるかは未確認です。成人の採点手順は教材本文を参照してください。',
      limitation:
        '小学生向けと公式ページに明記。成人20〜64歳要項への一致、動画本編・実演・集計は未確認。年齢群を混在させない。',
    },
  ].map((item) => ({
    id: `yt-${item.youtubeId}`,
    youtubeId: item.youtubeId,
    title: item.title,
    channel: item.channel,
    url: `https://www.youtube.com/watch?v=${item.youtubeId}`,
    unitIds: [item.unitId],
    objectiveIds: [item.objectiveId],
    difficulty: '基礎' as const,
    order: 3,
    reason: item.reason,
    metadata: {
      status: 'confirmed' as const,
      checkedAt,
      method: `公式掲載元 ${item.page} のリンク/埋め込みIDと、YouTube公式oEmbedのtitle・author_nameを照合。動画の内容確認ではない。`,
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${item.youtubeId}`)}&format=json`,
    },
    playback: { status: 'unconfirmed' as const, checkedAt: null, method: null },
    embed: { status: 'unconfirmed' as const, checkedAt: null, method: null },
    content: {
      status: 'unreviewed' as const,
      checkedAt: null,
      method: null,
      sourceRefs: [],
      review: {
        decision: 'hold' as const,
        reviewerType: 'ai' as const,
        method: 'unavailable' as const,
        checkedAt: reviewedAt,
        objectiveIds: [],
        coverage: 'メタデータと掲載元を確認。本編の画面・音声・字幕は確認できていない。',
        findings: ['正式なID・タイトル・チャンネルの実在確認のみで、内容審査は未完了。'],
        limitations: [
          item.limitation,
          '対応目標は候補の仮割当。再生・埋め込み・人間の専門家レビューも未実施。',
        ],
        evidence: [{ url: item.page, locator: '動画への公式リンク/埋め込みと対象者の説明' }],
      },
    },
  })),
);
