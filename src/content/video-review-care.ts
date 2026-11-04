import type { Source, SourceRef, VideoContentReview } from '../domain/types';

// These are review records, not transcripts. No downloaded video/audio is used.
const checkedAt = '2026-11-04';
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const gripPointsUrl = 'https://taiiku.aichi-c.ed.jp/images/pdf/shido-point.pdf';
const tottoriCatalogUrl = 'https://www2.hosp.med.tottori-u.ac.jp/tsa/movie/';
const citizenGuidelineUrl =
  'https://qqzaidan.jp/wp-content/uploads/2026/09/shishin2025_shimin_teisei_0910.pdf';

export const careVideoSources: Source[] = [
  {
    id: 'video-care-grip-points',
    title: '愛知県教育委員会：体力測定直前実地指導・各種目の指導ポイント',
    url: gripPointsUrl,
    edition: '公開PDF。版・作成年・改訂日は資料内で確認できず',
    checkedAt,
    locator: 'PDF p.1「握力」。息を吐くこと、腕を振らないこと等の指導ポイント',
    note: '動画掲載ページが配布する同じ実地指導の資料。小中学校の教員・児童生徒向けであり、動画全編の台本ではない。',
  },
  {
    id: 'video-care-grip-context',
    title: '愛知県教育委員会：体力測定直前実地指導',
    url: 'https://taiiku.aichi-c.ed.jp/fullness/index0403.php',
    edition: '公開ページ。公開日・改訂日未確認',
    checkedAt,
    locator: '冒頭の事業説明、「各種目の指導ポイント」、指導ポイント解説動画「握力」',
    note: '対象が小中学校教員であることと、登録動画IDへの公式リンクを確認。掲載元の確認を本編内容の検証の代わりにはしない。',
  },
  {
    id: 'video-care-tottori-catalog',
    title: '鳥取大学医学部附属病院スポーツ医科学センター：動画コンテンツ',
    url: tottoriCatalogUrl,
    edition: '栄養は2023-03-10、頭部外傷は2023-09-19と掲載。ページ改訂日は未確認',
    checkedAt,
    locator: '「第4回 スポーツと栄養」「第6回 スポーツと頭部外傷」の説明本文',
    note: '動画に対応する短い紹介本文のみを実読。詳細な台本・字幕・スライドの代わりにはならない。',
  },
  {
    id: 'video-care-tottori-nutrition',
    title: '鳥取大学医学部附属病院スポーツ医科学センター：栄養部',
    url: 'https://www2.hosp.med.tottori-u.ac.jp/tsa/outline/department/details_nutrition.html',
    edition: '公開ページ。公開日・改訂日未確認',
    checkedAt,
    locator: '「アスリートのための栄養学的支援」：日々の食事、栄養バランス、必要量の個人差',
    note: '関連する診療科の一次説明本文を実読したが、登録動画と同一の台本・講義資料であることは確認できない。',
  },
  {
    id: 'video-care-head-announcement',
    title: '鳥取大学医学部附属病院：動画公開 第6回 スポーツと頭部外傷',
    url: 'https://www2.hosp.med.tottori-u.ac.jp/tsa/topics/34567.html',
    edition: '公開告知。本文の配信開始日は9月19日、年は動画一覧の2023年と照合',
    checkedAt,
    locator: '脳神経外科医監修の説明、登録動画ID vfyowlhlRlA へのリンク',
    note: '同一動画の掲載元を確認する資料。監修者の所属だけで内容を確認済みにはしない。',
  },
  {
    id: 'video-care-fifa-concussion',
    title: 'FIFA：グラスルーツ向け脳振盪プロトコル「かもしれない」疑って守る（JFA掲載）',
    url: 'https://www.jfa.jp/medical/pdf/medical_concussion.pdf',
    edition: '2024年8月（表紙記載）。2026-11-04閲覧時のJFA公開PDF',
    checkedAt,
    locator: '本文pp.4–9：症状・疑った際の中止と医学的評価・危険な兆候・回復の個人差・相対的安静',
    note: 'サッカー向けの一次プロトコルを比較資料として実読。すべての競技への適用や動画内容との一致は未確認。',
  },
  {
    id: 'video-care-redcross-context',
    title: '日本赤十字社：AEDが使えるようになって20周年',
    url: 'https://www.jrc.or.jp/study/news/2024/0701_041552.html',
    edition: '2024-07-01公開',
    checkedAt,
    locator: '「心肺蘇生とAEDを用いた電気ショック」「日本赤十字社の取り組み」',
    note: '登録動画がJRC蘇生ガイドライン2020に基づくことと、その掲載元を本文で確認。',
  },
  {
    id: 'video-care-cpr2025-citizen',
    title: '日本救急医療財団：改訂7版 救急蘇生法の指針2025 市民用',
    url: citizenGuidelineUrl,
    edition: 'JRC蘇生ガイドライン2025確定版準拠。財団公開ページの2026-09-10更新PDF',
    checkedAt,
    locator:
      '序文、本文pp.20–38「一次救命処置」、pp.42–44「乳児に対する一次救命処置」。p.42はPDF51枚目',
    note: '草案ではなく、2026年7月確定書籍準拠と序文に明記された市民用最終テキスト。該当本文を実読し、p.42は画像でも確認。JRC原著第1章全文を読んだという記録ではない。',
  },
  {
    id: 'video-care-cpr2025-publication',
    title: '日本救急医療財団：刊行物・救急蘇生法の指針2025 市民用',
    url: 'https://qqzaidan.jp/publish/',
    edition: '閲覧時の公式公開ページ。市民用PDFは2026-09-10更新と表示',
    checkedAt,
    locator:
      '「救急蘇生法の指針2025（市民用）」：確定ガイドラインへの準拠、更新PDF・訂正告知へのリンク',
    note: '掲載ページは2026年7月末発行、訂正告知は2026年8月発行と記載。月の表記差を統合せず、それぞれの記載として保持する。',
  },
  {
    id: 'video-care-cpr2025-correction',
    title: '日本救急医療財団：救急蘇生法の指針2025 訂正のお知らせとお詫び',
    url: 'https://qqzaidan.jp/wp-content/uploads/2026/09/shishin2025_shimin_oshirase_owabi_20260916.pdf',
    edition: '2026-09-08（告知本文記載）',
    checkedAt,
    locator: 'PDF p.1：市民用p.19／市民用・解説編p.23のワクチン記述の訂正',
    note: '訂正告知を画像で実読。今回比較したCPR・AED・乳児胸骨圧迫の節を訂正する告知ではない。',
  },
];

const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });

export const careVideoSourceRefs: Record<string, SourceRef[]> = {
  dOlSdv_YyuI: [
    ref('video-care-grip-points', 'PDF p.1「握力」：呼気・発声・腕を振らない指導'),
    ref('video-care-grip-context', '冒頭の事業説明：小中学校教員を対象とする実地指導'),
    ref(
      'f-sports-test-adult',
      '印刷p.2 / PDF4枚目「握力」2 方法：身体・衣服への接触と振り回しを避ける',
    ),
  ],
  '0VT-7KAtOxw': [
    ref('video-care-tottori-catalog', '第4回の紹介本文。字幕・詳細台本としては扱わない'),
    ref('video-care-tottori-nutrition', 'アスリートのための栄養学的支援。動画と同一本文かは未確認'),
  ],
  'NGNaD_UY-A4': [
    ref('video-care-redcross-context', '日本赤十字社の取り組み：2020年版指針に基づく動画'),
    ref('video-care-cpr2025-citizen', '本文pp.20–38：成人の初動、119番、胸骨圧迫、人工呼吸、AED'),
    ref(
      'video-care-cpr2025-citizen',
      '本文p.34：下着の取扱い、p.42 / PDF51枚目：乳児胸骨圧迫の方法',
    ),
    ref('video-care-cpr2025-correction', 'PDF p.1：2026-09-08の訂正範囲を確認'),
    ref(
      'video-care-cpr2025-publication',
      '2026-09-10更新の確定ガイドライン準拠市民用PDFへの公式リンク',
    ),
  ],
  vfyowlhlRlA: [
    ref('video-care-tottori-catalog', '第6回の紹介本文。字幕・詳細台本としては扱わない'),
    ref('video-care-head-announcement', '同一動画への公式リンクと監修についての説明'),
    ref('video-care-fifa-concussion', '本文pp.4–9。動画未読のため内容の一致は判定できない比較資料'),
  ],
};

export const careVideoReviews: Record<string, VideoContentReview> = {
  dOlSdv_YyuI: {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '取得した日本語自動字幕0:04–2:31を全行読み、同じ実地指導の配布資料とスポーツ庁の成人向け測定要項を照合。音声・実演の視聴による確認ではない。',
    objectiveIds: ['assessment-o3'],
    checkedAt,
    findings: [
      '1:00–1:28の呼気と腕を振らない説明は、愛知県配布PDF p.1の握力節に対応する。腕を振り回さない点はスポーツ庁の成人向け要項p.2とも整合し、測定条件を区別するassessment-o3の補助になる。',
      '0:08–0:54の他の筋力との相関・代表性については自動字幕の誤認が多く、発言内容や適用範囲を確定できない。',
      '1:21付近の呼気による力発揮の断定的な比較と、2:17–2:24の校正間隔の一般化は、読めた配布資料・成人要項だけでは裏付けられない。特定機器の仕様を全機器の基準にしない。',
    ],
    limitations: [
      '自動字幕の不明点を音声で解消できていない。動画の発言自体の誤りと断定せず、全編の推薦は保留する。',
      '学校での実地指導であり、成人の個別評価や握力測定の完全な標準手順を教える教材としては未確認。',
      'AIによる資料照合であり、人間の専門家レビュー、実演の姿勢・器具の視覚確認、埋め込み再生の通し確認は未実施。',
    ],
    evidence: [
      {
        url: watch('dOlSdv_YyuI'),
        locator:
          '取得した日本語自動字幕0:04–2:31の全行。主な照合箇所1:00–1:28、保留箇所0:08–0:54・1:21付近・2:17–2:24',
      },
      { url: gripPointsUrl, locator: 'PDF p.1「握力」' },
      {
        url: 'https://www.mext.go.jp/sports/content/250424-spt_kensport01-300000992_04.pdf',
        locator: '印刷p.2 / PDF4枚目「握力」2 方法',
      },
    ],
  },
  '0VT-7KAtOxw': {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'unavailable',
    coverage:
      '正式な動画タイトルの表示後に字幕取得を再試行したが本文を取得できず。公式掲載ページの第4回紹介本文と関連栄養部ページは読んだが、動画の台本・字幕とは確認できない。',
    objectiveIds: ['nutrition-o2'],
    checkedAt,
    findings: [
      '公式紹介はアスリートの栄養管理・食べ方の基本を扱うとしている。栄養部本文には日々の食事の栄養バランスや必要量の個人差が説明されるが、同じ説明が動画に含まれるとは判定できない。',
      'nutrition-o2の食品の多様性・食物繊維・食品表示それぞれを説明しているか、動画中の数値と対象者は確認できない。',
      '字幕取得機能は「No transcript is available」を返した。これは動画の実在や内容の不適切さを意味しない。',
    ],
    limitations: [
      '本編の音声・映像・図表を未確認。詳細台本やスライドを見つけられず、一般成人への適用や現行資料との内容照合は未完了。',
      '大学病院の公式発信であることを内容確認済みの根拠にせず、候補として保持する。人間の専門家レビューは未実施。',
    ],
    evidence: [
      {
        url: watch('0VT-7KAtOxw'),
        locator: '正式タイトル表示後も字幕本文取得不可。本編内容は未確認',
      },
      { url: tottoriCatalogUrl, locator: '2023-03-10「第4回 スポーツと栄養」の紹介本文' },
      {
        url: 'https://www2.hosp.med.tottori-u.ac.jp/tsa/outline/department/details_nutrition.html',
        locator: 'アスリートのための栄養学的支援。動画と同一の台本ではない関連説明',
      },
    ],
  },
  'NGNaD_UY-A4': {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '取得した日本語自動字幕0:00–18:00を全行読み、2020年版対応である公式掲載説明、およびJRC2025確定書籍に準拠する市民用指針の該当本文pp.20–38・42–44と照合。p.42は画像でも確認した。',
    objectiveIds: ['safety-o2'],
    checkedAt,
    findings: [
      '1:31–4:46の安全確認・反応・119番とAED手配・普段どおりでない呼吸時の胸骨圧迫、10:37–13:31のAED解析とショック時に離れ速やかに再開する原則は、現行市民用指針pp.20–25・35–37と整合し、成人のsafety-o2に対応する。',
      '自動字幕16:19–16:31は乳児胸骨圧迫を2本指で行う説明として記録されている。一方、現行市民用指針p.42は片手の手のひらの付け根を用いる方法を記載している。音声・実演を未確認のため発言の最終確定はできないが、現行手順として推薦する前に解消すべき具体的な相違がある。',
      '9:19–9:38の衣服を取り除く説明に対し、現行市民用指針pp.33–34は、正しい素肌の位置にパッドを貼れるならブラジャーを完全に外す必要はないと明記する。この補足を含む現行手順全体の教材としては扱わない。',
      '7:08付近の交代時間は自動字幕で12分と連結表示される。現行市民用指針p.26は1〜2分を目安とする。字幕の誤認が疑われるため、動画が12分を勧めたとは断定しない。',
    ],
    limitations: [
      'AIによる自動字幕と一次資料の照合である。音声、実演の手位置・圧迫深度、画面上の注意書き、人間の専門家レビューは未確認。',
      '2025確定版に準拠する市民用最終テキストを比較に用いた。JRC蘇生ガイドライン2025原著第1章全文や全章を精読し、全改訂差分を確認したという意味ではない。',
      '成人に関する原則の一致だけで乳児手順を含む動画全体を現行版適合としない。おすすめは保留し、実技講習・通信指令員やAEDの指示の代わりに使わない。',
    ],
    evidence: [
      {
        url: watch('NGNaD_UY-A4'),
        locator:
          '取得した日本語自動字幕0:00–18:00全行。成人原則1:31–4:46・10:37–13:31、相違候補16:19–16:31、字幕疑義7:08付近',
      },
      {
        url: 'https://www.jrc.or.jp/study/news/2024/0701_041552.html',
        locator: '2024-07-01「日本赤十字社の取り組み」：JRC2020対応の動画と明記',
      },
      {
        url: citizenGuidelineUrl,
        locator: '序文、本文pp.20–38、pp.42–44。乳児胸骨圧迫p.42（PDF51枚目）は画像でも確認',
      },
      {
        url: 'https://qqzaidan.jp/publish/',
        locator: '2026-09-10更新PDFへのリンクとJRC2025確定版準拠の説明',
      },
    ],
  },
  vfyowlhlRlA: {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'unavailable',
    coverage:
      '正式な動画タイトルの表示後も字幕本文を取得できず。公式第6回の紹介・公開告知を実読し、比較に使うFIFA/JFA脳振盪プロトコルpp.4–9を読んだが、本編と比較できる言語内容は得られていない。',
    objectiveIds: [],
    checkedAt,
    findings: [
      '公式紹介は頭部外傷の症状・危険性・対処を扱うとしているが、詳細台本やスライドは確認できない。紹介本文から本編の個々の説明を推定しない。',
      '現safety単元の目標は緊急対応計画、成人の心停止初動、実技講習の区別であり、頭部外傷の認識・中止・医学的評価への引継ぎに対応する個別目標がない。',
      '比較資料FIFA/JFA 2024年版には、疑った際のプレー中止と医学的評価、危険な兆候、回復期間の個人差、相対的安静が記載される。本編の説明との一致や差分は確認できない。',
    ],
    limitations: [
      '本編の音声・映像・図表は未確認。受診・救急搬送・復帰判断の説明や対象者、現在の指針との適合性は未審査。',
      '関連する同大学の診療科説明を動画の台本として転用せず、公式監修だけを根拠に推薦しない。人間の専門家レビューは未実施。',
      '将来目標を追加する際も、非医療者の認識と活動中止・専門職への引継ぎに範囲を定め、診断や個別の復帰許可をトレーナーが行う教材にはしない。',
    ],
    evidence: [
      {
        url: watch('vfyowlhlRlA'),
        locator: '正式タイトル表示後も字幕本文取得不可。本編内容は未確認',
      },
      { url: tottoriCatalogUrl, locator: '2023-09-19「第6回 スポーツと頭部外傷」の紹介本文' },
      {
        url: 'https://www2.hosp.med.tottori-u.ac.jp/tsa/topics/34567.html',
        locator: '同一動画へのリンクと監修についての公開告知',
      },
      {
        url: 'https://www.jfa.jp/medical/pdf/medical_concussion.pdf',
        locator: '2024年8月版、本文pp.4–9。本編との照合を終えたという根拠には使わない',
      },
    ],
  },
};

export const careVideoReasons: Record<string, string> = {
  dOlSdv_YyuI:
    '測定条件を学ぶ補助候補。自動字幕全行と公式の指導資料を一部照合しましたが、相関・校正間隔の説明や字幕の不明点を解消できず、おすすめは保留しています。',
  '0VT-7KAtOxw':
    'アスリートの食事を扱う補助候補。公式の紹介本文を読みましたが字幕を取得できず、食品表示・食物繊維など現目標への対応と本編内容は未確認です。',
  'NGNaD_UY-A4':
    '2020年版指針対応の参考候補。成人の初動は自動字幕と2025年版準拠の市民用指針で照合しましたが、乳児手順の自動字幕に現行資料との相違があり、音声・実演を未確認のため動画全体のおすすめは保留しています。',
  vfyowlhlRlA:
    '頭部外傷の啓発動画の候補。字幕・本編を確認できず、現単元の個別目標ともまだ対応していないため、おすすめは保留しています。',
};
