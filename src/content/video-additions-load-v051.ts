import type { Source, SourceRef, Video } from '../domain/types';

// Each state records an observation. In particular, oEmbed is metadata evidence,
// and a published transcript does not establish playback or embedding.
const checkedAt = '2026-11-05';
const reviewedAt = '2026-11-05T02:15:54Z';
const khanPercent =
  'https://www.khanacademy.org/math/grade-6-fl-best/x9def9752caf9d75b%3Arates-and-percentages/x9def9752caf9d75b%3Apercent-problems/v/finding-percentages-example';
const khanGrowth =
  'https://www.khanacademy.org/math/grade-8-math-cambridge/xe0bfd77fbeddfff9%3Anumbers/xe0bfd77fbeddfff9%3Apercentages/v/growing-by-a-percentage';
const percentTranscript =
  'https://filmot.com/sidebyside/FaDtge_vkbg/en/th/English/Thai/Finding%2Ba%2Bpercentage%2B%7C%2BDecimals%2B%7C%2BPre-Algebra%2B%7C%2BKhan%2BAcademy';
const lawsPage = 'https://kyushu-cc.hosp.go.jp/section/department_rehabilitation_activity.html';
const flexibilityPage =
  'https://www.tfhd.com/video-library/dynamic-vs-static-stretching-for-better-performance-and-flexibility/';

export const videoLoadV051Sources: Source[] = [
  {
    id: 'v051-load-periodization',
    title: 'NSCA: Hierarchical Structure of Periodization Cycles',
    url: 'https://www.nsca.com/education/articles/kinetic-select/hierarchical-structure-of-periodization-cycles/',
    edition: 'Kinetic Select 2018年8月、Developing Powerの公式公開抜粋',
    checkedAt,
    locator: '冒頭の目標に沿う階層、年間計画内の複数マクロ周期、メゾ周期とミクロ周期の関係の段落。',
    note: '公開本文を実読。動画内の期間例は固定規則ではない。公開された抜粋だけを参照し、書籍全体を読んだとは扱わない。',
  },
  {
    id: 'v051-load-khan-percent',
    title: 'Khan Academy: Finding a percent — Video transcript',
    url: khanPercent,
    edition: '公式公開教材Web版（確認時に更新日記載なし）',
    checkedAt,
    locator: 'Video transcript：16を基準とする4の割合を、分数・小数・百分率で表す説明段落。',
    note: '公式ページの公開字幕を実読。同一IDの公開字幕表示とも例を照合。運動処方の資料ではなく割合の数学的補助に限定。字幕本文は収録しない。',
  },
  {
    id: 'v051-load-khan-growth',
    title: 'Khan Academy: Growing by a percentage — Video transcript',
    url: khanGrowth,
    edition: '公式公開教材Web版（確認時に更新日記載なし）',
    checkedAt,
    locator:
      'Video transcript：基準量に対する増加分、途中の計算ミスを自ら訂正する部分、増加後の量から基準量を求める例。',
    note: '公式字幕は実読したが、同一YouTube IDの実画面・字幕を直接照合できるまでは候補。1RMテストや増量率の処方を説明する教材ではない。',
  },
  {
    id: 'v051-load-laws',
    title: '国立病院機構九州がんセンター：がんリハビリテーション／LAWS',
    url: lawsPage,
    edition: '2025-05-29更新の公式ページ',
    checkedAt,
    locator: 'LAWSの紹介と、2番目のYouTube埋め込み（FEl4xyx_usc：運動強度の調整方法）。',
    note: '公式掲載元と同一IDを同定。がん患者向けの医療管理を前提とする動画で、一般成人へ頻度・尺度の数値を一律適用しない。',
  },
  {
    id: 'v051-load-tfhd-flexibility',
    title:
      'Tahoe Forest Health System: Dynamic vs Static Stretching for Better Performance and Flexibility',
    url: flexibilityPage,
    edition: '公式公開動画・全文Transcript（確認時に更新日記載なし）',
    checkedAt,
    locator:
      'Transcript：Static stretching / Dynamic stretching の方法を説明する段落。掲載プレーヤーID fB5KnkRoleE。',
    note: '公式公開字幕を実読。推薦は静的・動的方法の区別のみ。字幕中の保持秒数、優越性、傷害予防の主張全般を確認済みとは扱わない。',
  },
  {
    id: 'v051-load-cleveland-flexibility',
    title: 'Cleveland Clinic: Dynamic vs. Static Stretching: Is One Better?',
    url: 'https://health.clevelandclinic.org/dynamic-stretching-vs-static-stretching',
    edition: '2024-08-29公開、医師Anne Rexへの公式インタビュー',
    checkedAt,
    locator:
      'What’s the difference / What is dynamic stretching / What is static stretching / Is ... better? の定義と目的による使い分け。',
    note: '本文を実読し、保持と反復運動の区別・目的に依存する使い分けのみ照合。個人への秒数処方、全主張の科学的再検証は実施していない。',
  },
];

interface Entry {
  youtubeId: string;
  title: string;
  channel: string;
  unitIds: string[];
  objectiveIds: string[];
  order: number;
  reason: string;
  discoveryUrl: string;
}

function base(input: Entry): Omit<Video, 'content'> {
  const url = `https://www.youtube.com/watch?v=${input.youtubeId}`;
  return {
    id: `yt-${input.youtubeId}`,
    youtubeId: input.youtubeId,
    title: input.title,
    channel: input.channel,
    url,
    unitIds: input.unitIds,
    objectiveIds: input.objectiveIds,
    difficulty: '基礎',
    order: input.order,
    reason: input.reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method: `公開検索・掲載元 ${input.discoveryUrl} から同定し、同じIDのYouTube公式oEmbedのtitle・author_nameを照合。メタデータと内容・再生の確認は別々に記録。`,
      evidenceUrl: `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
  };
}

function transcript(
  input: Entry,
  coverage: string,
  findings: string[],
  limitations: string[],
  sourceRefs: SourceRef[],
  evidence: { url: string; locator: string }[],
): Video {
  return {
    ...base(input),
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが実際に読めた公開字幕・公式一次資料を照合した限定レビュー。人間の専門家レビューではありません。映像・音声・再生の確認とは区別します。',
      sourceRefs,
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt: reviewedAt,
        coverage,
        objectiveIds: input.objectiveIds,
        findings,
        limitations: [
          '英語教材。公開字幕で確認した説明に限る。実映像・音声の全編視聴、再生・埋め込み動作、人間の専門家レビューは未実施。',
          ...limitations,
        ],
        evidence,
      },
    },
  };
}

function candidate(input: Entry, limitations: string[]): Video {
  return {
    ...base(input),
    content: {
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
      review: {
        decision: 'hold',
        reviewerType: 'ai',
        method: 'unavailable',
        checkedAt: reviewedAt,
        coverage:
          'メタデータの実在を確認。設けた学習目標に照らすための同一IDの本編・字幕の確認は未完了。',
        objectiveIds: input.objectiveIds,
        findings: [
          'YouTube公式oEmbedの正式タイトル・チャンネル・動画IDを確認。タイトルや説明欄を本編の内容確認へ置き換えていない。',
        ],
        limitations,
        evidence: [
          {
            url: input.discoveryUrl,
            locator:
              '公開掲載元または動画ページ。候補を発見・同定した根拠であり、内容の推薦根拠ではない。',
          },
        ],
      },
    },
  };
}

const lawsInput: Entry = {
  youtubeId: 'FEl4xyx_usc',
  title: '九州がんセンター 運動習慣（LAWS）のご案内（その２：運動強度）',
  channel: '国立病院機構九州がんセンター',
  unitIds: ['ex-plan-cardio'],
  objectiveIds: ['ex-plan-cardio-o2'],
  order: 1,
  reason:
    '内容確認範囲：本人が感じるきつさに応じて運動の回数・種類を調整するという考え方。がん患者向け医療管理下の例で、動画の尺度・頻度を一般処方へ転用しません。',
  discoveryUrl: lawsPage,
};

const lawsVideo: Video = {
  ...base(lawsInput),
  playback: {
    status: 'playable',
    checkedAt: reviewedAt,
    method:
      'AIによる実ブラウザー観察。公式病院ページの同一ID埋め込みで再生後の経過1秒から6秒への進行と映像を確認。全編連続再生・音声聴取は未実施。',
  },
  embed: {
    status: 'embeddable',
    checkedAt: reviewedAt,
    method:
      '公式病院ページの2番目のiframeが同じIDであること、実映像と時間の進行を確認。CPT Master内・全端末での動作保証ではない。',
  },
  content: {
    status: 'source_checked',
    checkedAt: reviewedAt,
    method:
      'AIが実プレーヤーの主要画面を目視し、別途実読したCDC・厚生労働省の公開本文と照合。確認した原則の範囲に限定し、人間の専門家レビューと区別。',
    sourceRefs: [
      {
        sourceId: 'v051-load-laws',
        locator: '公式掲載元のLAWS運動強度動画、同一IDの1:00・1:40の説明画面。',
      },
      {
        sourceId: 'ex-plan-cardio-intensity',
        locator:
          'Relative intensity：同じ活動の相対的なきつさは体力により異なる。尺度とTalk Testは別途公式本文で確認。',
      },
      {
        sourceId: 'ex-plan-cardio-safety',
        locator:
          '3．2 新たに運動を開始する時の確認事項：内服薬と主観的運動強度。3．4：運動中の体調異変。',
      },
    ],
    review: {
      decision: 'recommended',
      reviewerType: 'ai',
      method: 'visual',
      checkedAt: reviewedAt,
      coverage:
        '1:00の主観的なきつさの尺度と、1:40のきつさに応じ回数・種類を調整する説明画面。相対的な強度を本人の反応に照らす原則のみ。',
      objectiveIds: lawsInput.objectiveIds,
      findings: [
        'きつさに応じて運動を調整する説明を実画面で確認。CDCの相対強度、厚労省の体調・服薬と主観的強度に基づく判断という原則と照合した。',
        '映像に示す0–10尺度の3・4と、CDCの一般的な相対中強度の5・6は同じ数値設定ではない。この動画から一般成人の中強度数値を教えない。',
      ],
      limitations: [
        'がん患者を対象とする医療管理を前提とした例。視聴者本人の診療・運動許可や個別指導の代替ではない。',
        '動画の毎日という頻度、尺度の3・4、個別の反復数を全員の有酸素処方として推薦する範囲には含めない。',
        '主要画面の限定レビュー。全編の音声・映像、人間の専門家レビューは未実施。心拍予備能の計算・会話テストの実演を確認した動画ではない。',
      ],
      evidence: [
        {
          url: 'https://www.youtube.com/watch?v=FEl4xyx_usc',
          locator: '実プレーヤー1:00・1:40。再生時間1秒→6秒の進行も独立に確認。',
        },
        { url: lawsPage, locator: '2番目のYouTube iframe、FEl4xyx_usc。' },
        {
          url: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
          locator: 'Relative intensity、Talk Test。2025-12-04版の本文を2026-11-05実読。',
        },
        {
          url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-008',
          locator: '3．2・3．4。2024-03-19更新本文を2026-11-05実読。',
        },
      ],
    },
  },
};

export const videoLoadV051Additions: Video[] = [
  transcript(
    {
      youtubeId: 'FaDtge_vkbg',
      title: 'Finding a percentage | Decimals | Pre-Algebra | Khan Academy',
      channel: 'Khan Academy',
      unitIds: ['ex-plan-load'],
      objectiveIds: ['ex-plan-load-o1'],
      order: 1,
      reason:
        '内容確認範囲：比較する量÷基準量を小数・百分率へ表す数学的補助。1RM割合の分母を取り違えない練習に使い、運動処方は単元本文で確認します。',
      discoveryUrl: khanPercent,
    },
    '公開字幕の「16を基準とする4の割合」を分数・小数・百分率で表す例（取得した字幕に時刻表示なし）。学習目標の割合を読む数学部分に限定。',
    [
      '公式公開字幕と同一IDの公開字幕表示で例の対応を確認。基準量に対する比を百分率へ直す手順を、NSCAの相対強度の割合計算と照合した。',
    ],
    [
      '運動・1RM測定・安全な増量幅を説明する動画ではない。kg・器具の刻み・疲労等は本単元で学ぶ。目標全体の習得をこの動画だけで判定しない。',
      '第三者の字幕表示は同一ID・例の照合補助にのみ使用。正答根拠は公式数学教材とNSCA資料を参照。',
    ],
    [
      {
        sourceId: 'v051-load-khan-percent',
        locator: 'Video transcript：基準量、分数、小数と百分率の関係。',
      },
      {
        sourceId: 'ex-plan-load-relative',
        locator:
          '印刷p.50 Percent of 1RM：相対強度の割合による重量算出とPotential Limitations。2026-11-05に本文を再読。',
      },
    ],
    [
      {
        url: khanPercent,
        locator: '公式Video transcript、16と4の割合を扱う説明。Web検索で取得した本文を実読。',
      },
      {
        url: percentTranscript,
        locator:
          '同一YouTube ID FaDtge_vkbgの英語公開字幕。公式字幕と例を照合。時刻情報は記録しない。',
      },
    ],
  ),
  candidate(
    {
      youtubeId: 'X2jVap1YgwI',
      title: 'Growing by a percentage | Linear equations | Algebra I | Khan Academy',
      channel: 'Khan Academy',
      unitIds: ['ex-plan-load'],
      objectiveIds: ['ex-plan-load-o1'],
      order: 2,
      reason:
        '候補：基準量に増加率を掛け、増加後の量と区別する計算の補助。同一IDの実画面・字幕の照合が完了するまでおすすめには含めません。',
      discoveryUrl: khanGrowth,
    },
    [
      '公式ページの公開字幕は実読したが、同一IDの字幕・映像との直接照合は未完了。',
      '公式字幕に途中の計算誤りを自ら訂正する場面がある。未訂正の答えだけを抜き出さない。運動処方の動画ではない。',
      '再生・埋め込みは未確認。内容未確認の候補として保持。',
    ],
  ),
  lawsVideo,
  transcript(
    {
      youtubeId: 'fB5KnkRoleE',
      title: 'Dynamic vs Static Stretching for Better Performance and Flexibility',
      channel: 'Tahoe Forest Health System',
      unitIds: ['ex-tech-flex'],
      objectiveIds: ['ex-tech-flex-o2'],
      order: 1,
      reason:
        '内容確認範囲：姿勢を保つ静的ストレッチと、動きを繰り返す動的方法の区別。英語の公式公開字幕を確認。秒数の個別処方や傷害予防効果の保証には使いません。',
      discoveryUrl: flexibilityPage,
    },
    '病院公式ページが同じ動画IDに添付する全文Transcriptのうち、静的・動的ストレッチの定義と例の段落（時刻表示なし）。',
    [
      '保持と反復運動による方法の区別を確認し、Cleveland Clinicの定義と照合。NSCAのウォームアップと柔軟性練習を目的で区別する本文とも整合する範囲に限定した。',
    ],
    [
      '動画中の保持秒数・回数を一般成人すべてへの処方として採用しない。動的ストレッチが常に優れるとの一般化、傷害予防の保証は推薦範囲外。',
      'PNF・バリスティック、痛み・疾患への適否はこの確認範囲で網羅していない。医療職の個別評価の代替ではない。',
    ],
    [
      {
        sourceId: 'v051-load-tfhd-flexibility',
        locator: 'TranscriptのStatic stretching / Dynamic stretchingの説明段落。',
      },
      {
        sourceId: 'v051-load-cleveland-flexibility',
        locator: '定義と、目的・時機によって使い分ける段落。',
      },
      {
        sourceId: 'ex-tech-warmup',
        locator: 'ウォームアップとストレッチを区別する本文段落。2026-11-05に実読。',
      },
    ],
    [
      {
        url: flexibilityPage,
        locator:
          '公式Transcript全文を実読。静的・動的の定義段落だけを推薦対象に限定。掲載プレーヤーのリンクがfB5KnkRoleEであることを同定。',
      },
    ],
  ),
  candidate(
    {
      youtubeId: 'H4JRuKXGUxI',
      title: 'Dynamic Warm-Up for Speed & Power Athletes, with Bobby Smith | NSCA.com',
      channel: 'NSCA',
      unitIds: ['ex-tech-flex'],
      objectiveIds: ['ex-tech-flex-o1'],
      order: 2,
      reason:
        '候補：運動前の動的な準備と種目に応じたウォームアップ。公式掲載元・メタデータの確認のみで、本編内容は未確認です。',
      discoveryUrl:
        'https://www.nsca.com/education/videos/dynamic-warm-up-for-speed-and-power-athletes/',
    },
    [
      '公式の講演紹介を本編の代わりにしていない。YouTube字幕取得は空応答となり、本編の説明・実演を未確認。',
      '再生・埋め込み未確認。タイトルだけで方法や効果を推薦しない。',
    ],
  ),
  {
    ...base({
      youtubeId: '0LyBXhgXzBE',
      title: 'Understanding Periodization for Strength and Fitness Training',
      channel: 'Human Kinetics',
      unitIds: ['ex-plan-progression'],
      objectiveIds: ['ex-plan-progression-o1'],
      order: 1,
      reason:
        '確認範囲：マクロ・メゾ・ミクロ周期の階層関係と、短い周期を目標に合わせて構造化する部分。英語の主要画面を照合しました。動画の期間例を固定ルールとして使いません。',
      discoveryUrl:
        'https://us.humankinetics.com/blogs/learning-with-hk/understanding-periodization-for-strength-training-and-fitness',
    }),
    playback: {
      status: 'playable',
      checkedAt: '2026-11-05T02:25:34Z',
      method:
        'AIが同一YouTube watchページの映像と経過を確認。0:13から4:02、5:10〜5:19への進行を観察。全編連続再生・音声聴取は未実施。',
    },
    content: {
      status: 'source_checked',
      checkedAt: '2026-11-05T02:25:34Z',
      method:
        'AIが同一IDの実プレーヤーの主要説明画面を読み、NSCAの公式公開抜粋と階層関係を照合。人間の専門家レビューではない。',
      sourceRefs: [
        {
          sourceId: 'v051-load-periodization',
          locator: '目標に沿う階層と、マクロ・メゾ・ミクロ周期の関係の本文。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt: '2026-11-05T02:25:34Z',
        objectiveIds: ['ex-plan-progression-o1'],
        coverage:
          '4:02のMACROCYCLE、5:10〜5:19のMESOCYCLE、14:46のMICROCYCLES説明画面。o1の周期の階層と目標に沿う構造の部分だけ。',
        findings: [
          '短い周期が長い周期の中に含まれ、目標・量・強度・方法に合わせて構造化される説明を実画面で確認し、NSCA公開本文と照合した。',
        ],
        limitations: [
          '動画の年・月・週の例を必須の期間としない。NSCA本文では年間に複数のマクロ周期もあり得る。',
          'テーパー・並行トレーニング・回復や各段階の処方、全編の映像と音声は未確認。英語の一部画面のみ。',
          '実再生は一部確認、埋め込みは未確認。人間の専門家レビューは未実施。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=0LyBXhgXzBE',
            locator:
              '実プレーヤーの4:02、5:10〜5:19、14:46の文字入り説明画面。同一タイトル・Human Kinetics・長さ23:31を実画面で確認。',
          },
          {
            url: 'https://www.nsca.com/education/articles/kinetic-select/hierarchical-structure-of-periodization-cycles/',
            locator: '目標に基づく階層と各周期の関係を実読。',
          },
        ],
      },
    },
  },
  candidate(
    {
      youtubeId: 'xeR4RprByc4',
      title: 'A Coaches Guide to Plyometric Training',
      channel: 'The Movement System',
      unitIds: ['ex-plan-power', 'ex-tech-power'],
      objectiveIds: ['ex-plan-power-o1', 'ex-tech-power-o1'],
      order: 1,
      reason:
        '候補：プライオメトリクスの進行と着地を調べるための英語教材。動画のメタデータと発信者の公式プロフィールのみ確認し、実演の妥当性は未確認です。',
      discoveryUrl: 'https://www.youtube.com/watch?v=xeR4RprByc4',
    },
    [
      '発信者公式AboutでMatt CasturoのDPT・CSCS表記を確認したが、人間の専門家レビュー済みという意味ではない。',
      '説明欄の章名だけで動作・接地回数・進行・安全基準を確認済みにしない。本編内容・再生・埋め込みは未確認。',
      '大学・公的機関の公式発信ではない。内容照合を完了するまで候補に留める。',
    ],
  ),
];
