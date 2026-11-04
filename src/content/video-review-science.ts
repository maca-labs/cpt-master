import type { Source, SourceRef, VideoContentReview } from '../domain/types';

const checkedAt = '2026-11-04';
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const openstax = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/';

// Review notes summarize the evidence; no transcript text or exported files are bundled.
// A transcript review that remains on hold must not promote Video.content.status.
export const scienceVideoSources: Source[] = [
  {
    id: 'video-science-joint-classification',
    title: 'OpenStax Anatomy and Physiology 2e — 9.1 Classification of Joints',
    url: `${openstax}9-1-classification-of-joints`,
    edition: '第2版（2022年）',
    checkedAt,
    locator: 'Structural Classification of Joints / Functional Classification of Joints',
    note: '不動・微動・可動の機能分類と、構造分類の区別を本文で確認。日本の全教材が同じ分類語を使うという根拠にはしない。',
  },
  {
    id: 'video-science-synovial-joints',
    title: 'OpenStax Anatomy and Physiology 2e — 9.4 Synovial Joints',
    url: `${openstax}9-4-synovial-joints`,
    edition: '第2版（2022年）',
    checkedAt,
    locator:
      'Structural Features of Synovial Joints / Pivot Joint / Hinge Joint / Condyloid Joint / Saddle Joint / Plane Joint / Ball-and-Socket Joint',
    note: '関節腔・包・滑液、形態と運動例を照合。平面関節の運動は周囲組織にも制約される。分類名の教材差だけで動画の誤りとは断定しない。',
  },
  {
    id: 'video-science-carpal-bones',
    title: 'OpenStax Anatomy and Physiology 2e — 8.2 Bones of the Upper Limb',
    url: `${openstax}8-2-bones-of-the-upper-limb`,
    edition: '第2版（2022年）',
    checkedAt,
    locator: 'Carpal Bones：橈骨手根関節の構成と、三角骨の関節円板を介する関節',
    note: '舟状骨・月状骨は橈骨と直接関節し、三角骨は線維軟骨性の円板と関節するという本文を確認。',
  },
  {
    id: 'video-science-skeletal-muscle',
    title: 'OpenStax Anatomy and Physiology 2e — 10.2 Skeletal Muscle',
    url: `${openstax}10-2-skeletal-muscle`,
    edition: '第2版（2022年）',
    checkedAt,
    locator: 'Skeletal Muscle Fibers / The Sarcomere / Figure 10.5の説明文',
    note: '筋線維内の筋原線維と、その中に直列に並ぶ機能単位サルコメアの区別を本文で確認。動画の模式図自体は照合していない。',
  },
  {
    id: 'video-science-thumb-mcp',
    title:
      'Estimation of the Abduction/Adduction Movement of the Metacarpophalangeal Joint of the Thumb',
    url: 'https://www.mdpi.com/2076-3417/11/7/3158',
    edition: 'Applied Sciences 2021, 11(7), 3158（2021-04-01公開、DOI: 10.3390/app11073158）',
    checkedAt,
    locator: 'Abstract / 2.1.1 Experimental Procedure：母指MCPの屈曲・外転角を含む実測',
    note: '原著の公開本文をWeb検索取得し、抄録と方法節を実読。出版社ページへの直接取得は429となる場合があった。全図表・生データ・全論文の再検証は未実施。個人の可動域や臨床診断を決める資料ではない。',
  },
  {
    id: 'video-science-creatine',
    title: 'NSCA: Creatine — Essentials of Strength Training and Conditioning, Fourth Edition抜粋',
    url: 'https://www.nsca.com/education/articles/kinetic-select/creatine-essentials/',
    edition: 'Kinetic Select, January 2021／原著第4版の公式公開抜粋',
    checkedAt,
    locator:
      'Importance of Creatine to Exercise：CPによるADPの再リン酸化、クレアチンキナーゼ、短時間高強度運動でのCP減少',
    note: 'ATP再合成機構と時間経過の照合に使用。サプリメント摂取の処方・推奨には使用しない。',
  },
  {
    id: 'video-science-oxygen',
    title:
      'Ellis & Burns: All about oxygen: using near-infrared spectroscopy to understand bioenergetics',
    url: 'https://journals.physiology.org/doi/full/10.1152/advan.00106.2022',
    edition: 'Advances in Physiology Education 46(4), 685–692（2022年、最終版）',
    checkedAt,
    locator:
      'Introduction — Objectives and Overview / Background：各供給系の協働、PCr反応の酸素非依存性と回復時の酸素利用',
    note: '出版社が公開する本文の該当節をWeb検索取得して実読。直接取得は403となる場合があった。代謝反応の酸素非依存性を呼吸停止と区別するために参照。個人への息止めや運動負荷の処方には使用しない。',
  },
];

const commonLimitations = [
  'AIによる自動字幕と一次資料の照合。音声の実聴、映像・模式図・実演の通し確認、人間の専門家による監修は未実施。',
  '自動字幕には専門用語の誤認がある。解消できない表現を動画の実際の発言の誤りとは断定しない。',
  '実再生・埋め込み可否と、字幕に表れない情報は確認できていない。字幕を取得できたことだけでおすすめや習得済みにはしない。',
];

export const scienceVideoReviews: Record<string, VideoContentReview> = {
  'eXl-2JuEYpk': {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '公開動画ページのcontent.exportYouTubeTranscriptで取得した日本語自動字幕0:00–12:47を全行実読。主な解説0:24–9:38を一次資料と照合し、他資格の国試例9:41–11:26と終盤の案内も読んだ。音声・映像の視聴ではない。',
    objectiveIds: ['anatomy-o2'],
    checkedAt,
    findings: [
      '関節の構造・軸と、屈伸・回旋・内外転などの動きの例はanatomy-o2に関連する。ただし目標全体を網羅せず、関節分類を通じた補助候補として扱う。',
      '0:46–1:16の関節包・関節腔・滑液と、2:20–9:38の車軸・蝶番・楕円・鞍・球関節などの代表例はOpenStax 9.4の説明と概ね対応する。1:50–2:17で教材による分類差や単純な型に収まらない例にも注意している。',
      '0:24–0:42の字幕は不動・可動の二分法として読める。OpenStax 9.1は機能分類を不動・微動・可動の三つで整理するため、分類の前提を補足する必要がある。日本の分類語の違いだけで誤りとは判断しない。',
      '5:28–5:49の舟状骨・月状骨・三角骨が橈骨手根関節を構成するという内容はOpenStax 8.2と対応する。同資料では三角骨は関節円板と関節する。字幕だけでは、動画が全骨の橈骨への直接接触を断定したとは判断できない。',
      '6:46–6:56の字幕は母指MCPで内外転できないと断定する表現として読める。一方、2021年原著のAbstractと2.1.1では母指MCP内外転を実測している。音声・図示による限定か字幕誤認かを解消できないため、全編の推薦を保留する。',
      '9:41–11:26は看護師・理学療法士・作業療法士等の国試例を扱う部分で、NSCA-CPTの公式問題や公式出題範囲の根拠としては扱わない。問題文は本アプリへ転載しない。',
    ],
    limitations: [
      ...commonLimitations,
      '平面関節・らせん関節・臼状関節などの分類名や軸数を、NSCAの使用教材との照合なしに唯一の正解として暗記させない。',
      '母指MCPの断定を音声・映像または発信者の補足で確認し、適切な留保を明示できるまで内容確認済みにはしない。',
    ],
    evidence: [
      {
        url: watch('eXl-2JuEYpk'),
        locator:
          '日本語自動字幕0:00–12:47。主な留保0:24–0:42、5:28–5:49、6:46–6:56。取得本文SHA-256: DEA7B7124534F01C93070941C45370F5059695D9583ADC24D5B6DD6027FE7BD5。',
      },
      {
        url: `${openstax}9-1-classification-of-joints`,
        locator: 'Functional Classification of Joints：不動・微動・可動の機能分類。',
      },
      {
        url: `${openstax}9-4-synovial-joints`,
        locator: 'Structural Features of Synovial Joints / 各関節型の説明。代表例と運動の対応。',
      },
      {
        url: `${openstax}8-2-bones-of-the-upper-limb`,
        locator: 'Carpal Bones：橈骨手根関節を構成する三骨と直接接触の区別。',
      },
      {
        url: 'https://www.mdpi.com/2076-3417/11/7/3158',
        locator: 'Abstract / 2.1.1 Experimental Procedure：母指MCP内外転の実測。',
      },
    ],
  },
  to4SW3kqm9Y: {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '公開動画ページのcontent.exportYouTubeTranscriptで取得した日本語自動字幕0:00–21:21を全行実読。筋の分類・構造・滑走・興奮収縮連関・弛緩を扱う0:59–19:50を一次資料と照合。導入と終盤の案内も読んだ。音声・模式図の視聴ではない。',
    objectiveIds: ['physiology-o1'],
    checkedAt,
    findings: [
      '筋収縮の仕組みを扱いphysiology-o1に対応する。解剖学的肢位の目標には割り当てない。ATP再合成の全経路を網羅する動画とは扱わない。',
      '6:50–7:00のZ線間の単位と、11:53–12:30のフィラメント自体の長さを変えず重なりを増やす説明は、OpenStax 10.2のサルコメアと10.3の滑走モデルに概ね対応する。',
      '14:07–18:59のCa、筋小胞体、T管、ACh、ATPを用いる収縮とCa回収による弛緩という核心はOpenStax 10.3と概ね整合する。比喩のタイヤ・ロック自体を実際の分子構造として扱わない。',
      '4:59–5:22の字幕は筋原線維を最小単位とする表現として読める。後にサルコメアを説明するが、OpenStax 10.2の機能単位との区別を模式図・音声で確認できていない。',
      '11:17–11:31の字幕は収縮を必ず短縮することとして一般化する表現に読める。OpenStax 10.4は等尺性・伸張性収縮も区別する。本教材の収縮様式の説明と混同しないため、短縮性の説明に限定した発言かを確認する必要がある。',
      '13:45–14:29のトロポニン・トロポミオシンをロックとする比喩は簡略化されている。原典ではCaがトロポニンに結合し、トロポミオシンの位置が変わるという別の役割がある。字幕の用語誤認と図示の限定を解消できず、全編推薦を保留する。',
    ],
    limitations: [
      ...commonLimitations,
      '中核の収縮機構に対応する箇所があることと、導入の神経支配の一般化・明暗の語呂・死後硬直の説明を含む全編の正確性は区別する。これらを包括的に確認済みとはしない。',
      '筋原線維とサルコメア、収縮と短縮の区別を補足し、疑義を音声・模式図で解消するまでは候補に留める。',
    ],
    evidence: [
      {
        url: watch('to4SW3kqm9Y'),
        locator:
          '日本語自動字幕0:00–21:21。核心11:53–19:50、主な留保4:59–5:22、11:17–11:31、13:45–14:29。取得本文SHA-256: 5A6DA460A0F46350681CEC8063DB61AB9749B49538EC6D8E7F0B2349F2A28382。',
      },
      {
        url: `${openstax}10-2-skeletal-muscle`,
        locator: 'Skeletal Muscle Fibers / The Sarcomere：構造階層と機能単位。',
      },
      {
        url: `${openstax}10-3-muscle-fiber-contraction-and-relaxation`,
        locator:
          '冒頭の興奮収縮連関 / The Sliding Filament Model of Contraction / ATP and Muscle Contraction：Ca・調節タンパク・ATP・Caポンプ。',
      },
      {
        url: `${openstax}10-4-nervous-system-control-of-muscle-tension`,
        locator: '冒頭からFigure 10.13の説明：短縮性・伸張性・等尺性収縮の区別。',
      },
    ],
  },
  e_OrhETNKio: {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '公開動画ページのcontent.exportYouTubeTranscriptで取得した日本語自動字幕0:00–9:16を全行実読。ATPからADPへの変化、CPによる再合成、時間の目安、無酸素性の説明を一次資料と照合。音声・板書の視聴ではない。',
    objectiveIds: ['physiology-o1'],
    checkedAt,
    findings: [
      'ATP再合成のうちATP-CP系を扱いphysiology-o1に対応する。全供給系や筋収縮機構を網羅する動画とは扱わない。',
      '2:13–4:38および5:16–6:35のCPからADPへリン酸を移しATPを再合成するという核心は、OpenStax 10.3とNSCAのCreatine記事のImportance of Creatine to Exerciseに概ね整合する。',
      '4:44–5:14、6:35–6:55で全力運動の持続を8〜10秒とする目安を説明している。NSCA資料は運動時間とCPの減少を扱うが、全員共通の厳密な枯渇時刻を示すものではない。この秒数を供給系の完全切替時刻として扱わない。',
      '7:00–8:29の字幕は短時間の全力運動で息を吸わない・止めることと、無酸素性を結びつける説明として読める。Ellis & BurnsのIntroduction–Backgroundでは、PCr反応の酸素非依存性と、各供給系の協働・回復時の酸素利用を区別する。',
      '代謝反応が酸素を直接必要としないことは、呼吸を止める条件や指導を意味しない。字幕の聞き取りや板書での限定を解消できず、誤解を招く可能性が残るため推薦を保留する。',
    ],
    limitations: [
      ...commonLimitations,
      '呼吸と代謝の区別を音声・板書または発信者の補足で確認するまで、無酸素性を学ぶおすすめにはしない。字幕だけで動画が息止めを指示した、または発言自体が誤りと断定しない。',
      '8〜10秒という目安を個人の能力判定・運動処方・供給系の排他的な境界に使用しない。',
    ],
    evidence: [
      {
        url: watch('e_OrhETNKio'),
        locator:
          '日本語自動字幕0:00–9:16。核心2:13–4:38、5:16–6:35、主な留保4:44–5:14、6:35–6:55、7:00–8:29。取得本文SHA-256: F634758A66934BD373FBF62664416008D6338202C26E20D525E1FC0AF37A4D0E。',
      },
      {
        url: `${openstax}10-3-muscle-fiber-contraction-and-relaxation`,
        locator: 'ATP and Muscle Contraction：CPによるADPからのATP再合成。',
      },
      {
        url: 'https://www.nsca.com/education/articles/kinetic-select/creatine-essentials/',
        locator: 'Importance of Creatine to Exercise：ADP再リン酸化、CPと時間経過。',
      },
      {
        url: 'https://journals.physiology.org/doi/full/10.1152/advan.00106.2022',
        locator:
          'Introduction — Objectives and Overview / Background：供給系の協働、PCr反応の酸素非依存性、回復時の酸素利用。',
      },
    ],
  },
};

// These refs document a review on hold. Presence of refs does not establish source_checked.
export const scienceVideoSourceRefs: Record<string, SourceRef[]> = {
  'eXl-2JuEYpk': [
    {
      sourceId: 'video-science-joint-classification',
      locator: 'Functional Classification of Joints：不動・微動・可動の区別。字幕0:24–0:42の留保。',
    },
    {
      sourceId: 'video-science-synovial-joints',
      locator: 'Structural Features / 各関節型：字幕0:46–9:38の構造・運動例の照合。',
    },
    {
      sourceId: 'video-science-carpal-bones',
      locator: 'Carpal Bones：字幕5:28–5:49の構成三骨と、直接接触の区別。',
    },
    {
      sourceId: 'video-science-thumb-mcp',
      locator: 'Abstract / 2.1.1：母指MCP内外転の実測。字幕6:46–6:56は音声・図示の確認待ち。',
    },
  ],
  to4SW3kqm9Y: [
    {
      sourceId: 'video-science-skeletal-muscle',
      locator: 'The Sarcomere：字幕4:59–5:22と6:50–7:00の構造階層・機能単位。',
    },
    {
      sourceId: 'f-muscle-contraction',
      locator:
        '10.3 興奮収縮連関 / Sliding Filament Model / ATP and Muscle Contraction：字幕11:53–19:50。',
    },
    {
      sourceId: 'f-muscle-tension',
      locator: '10.4 冒頭〜Figure 10.13：収縮様式の区別。字幕11:17–11:31の一般化は確認待ち。',
    },
  ],
  e_OrhETNKio: [
    {
      sourceId: 'f-muscle-contraction',
      locator: '10.3 ATP and Muscle Contraction：CPからADPへのリン酸転移によるATP再合成。',
    },
    {
      sourceId: 'video-science-creatine',
      locator: 'Importance of Creatine to Exercise：字幕2:13–6:55の機構・時間の目安の照合。',
    },
    {
      sourceId: 'video-science-oxygen',
      locator: 'Introduction / Background：字幕7:00–8:29の呼吸と無酸素性の結びつけは確認待ち。',
    },
  ],
};

export const scienceVideoReasons: Record<string, string> = {
  'eXl-2JuEYpk':
    '関節の型と動きの補助候補。全自動字幕を読みましたが、分類と母指MCPの表現に確認事項が残るため、おすすめは保留しています。',
  to4SW3kqm9Y:
    '滑走・Ca・ATPによる筋収縮の補助候補。全自動字幕を読みましたが、機能単位と収縮様式の表現を音声・図で解消できず、推薦は保留しています。',
  e_OrhETNKio:
    'CPによるATP再合成の補助候補。全自動字幕を読みましたが、呼吸と無酸素性を結びつける表現を確認できず、おすすめは保留しています。',
};
