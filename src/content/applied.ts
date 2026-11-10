import type { Question, Source, SourceRef, Unit } from '../domain/types';

// These are original learning materials. Source checking by AI is not expert review.
const checkedAt = '2026-11-04T02:00:29Z';
const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });

export const appliedSources: Source[] = [
  {
    id: 'applied-principles',
    title: 'NSCA: Principle-Based Program Design—A Practical, Step-by-Step Guide',
    url: 'https://www.nsca.com/contentassets/ae95c28e2bdf43c7b69636eacd3e4c72/ptq3.2-3-principle-based_program_design.pdf',
    edition: 'Personal Training Quarterly, Vol. 3, Issue 2',
    checkedAt,
    locator: 'pp.12–13: What Program Design Really Is; Steps 1–4',
    note: 'トレーニング原則の参照。本文・設問・指導事例は独自に作成。',
  },
  {
    id: 'applied-mhlw-strength',
    title: '厚生労働省：筋力トレーニングについて',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-005.html',
    edition: '身体活動・運動ガイド2023情報シート／最終更新2024-02-22',
    checkedAt,
    locator: '1. 筋力トレーニングのポイント; 2. 筋トレとは; 3-3. 実施／推奨する際の注意点',
  },
  {
    id: 'applied-rest',
    title: 'NSCA: How to Manipulate Rest Intervals to Maximize Strength Training Effectiveness',
    url: 'https://www.nsca.com/contentassets/fb8a7be6eb174934bb8844703c4de4cc/ptq-10.1.3-how-to-manipulate-rest-intervals-to-maixmize-strength-training-effectiveness.pdf',
    edition: 'Personal Training Quarterly, Vol. 10, Issue 1 (2023)',
    checkedAt,
    locator:
      'p.20: Rest Between Sets; Sleep and Stress; Training Age; Adjusting Rest Intervals Each Session',
  },
  {
    id: 'applied-concurrent',
    title: 'NSCA: To “Cardio” or Not to “Cardio?”—A Brief Review of Concurrent Training',
    url: 'https://www.nsca.com/education/articles/ptq/to-cardio-or-not-to-cardio-that-is-the-question-a-brief-review-of-concurrent-training/',
    edition: '公式Web記事・2026年8月掲載',
    checkedAt,
    locator:
      'Which Should Be Performed First: Cardio or Resistance Training?; Practical Applications',
  },
  {
    id: 'applied-technique',
    title: 'NSCA: Exercise Technique—Fundamentals, Warm-Up and Resistance Training',
    url: 'https://www.nsca.com/contentassets/24f7e187e9aa4a588439c9612231c7fd/tsac-module-3.0--3.3.pdf',
    edition: 'Essentials of Tactical Strength and Conditioning Exam Prep Online, 2013',
    checkedAt,
    locator: 'Module 3.1 pp.3–7; Module 3.2 pp.6–7 (PDF pp.8–12,19–20)',
    note: '技術原則を参照。資料中の設問や図版は転用しない。古い資料の一律な可動域・膝位置の記述は設問に採用しない。',
  },
  {
    id: 'applied-rdl',
    title: 'NSCA: Romanian Deadlift (RDL)',
    url: 'https://www.nsca.com/education/articles/kinetic-select/romanian-deadlift-rdl/',
    edition: 'Exercise Technique Manual for Resistance Training, 3rd ed. の公式公開抜粋／2019年3月',
    checkedAt,
    locator: 'Starting Position内の開始姿勢・下降・上昇の箇条書き',
  },
  {
    id: 'applied-standards',
    title: 'NSCA Strength and Conditioning Professional Standards and Guidelines—Executive Summary',
    url: 'https://www.nsca.com/contentassets/477221070254471aab20116550658891/standards-and-guidelines-summary-rev.-dec.-2018.pdf',
    edition: '2018年11月表記のExecutive Summary（配布ファイル名はrev. Dec. 2018）',
    checkedAt,
    locator: '§3 Supervision; §4 Facility & Equipment; §5 Emergency Planning; §6 Records',
    note: '米国の専門職向け指針。日本の法律の解説や法的結論としては用いない。',
  },
  {
    id: 'applied-ethics',
    title: 'NSCA Standards and Procedures—Professional Code of Ethics',
    url: 'https://www.nsca.com/codes-policies-procedures/',
    edition: '公開Web版（ページ記載の採択決議2017-10-27-01）',
    checkedAt,
    locator: 'Professional Code of Ethics, Principles 1–4',
    note: '閲覧時点の条文を確認。法域ごとの法的助言とは区別する。',
  },
  {
    id: 'applied-aed',
    title: '日本心臓財団：AEDを使った救命の仕方',
    url: 'https://www.jhf.or.jp/check/aed/how/',
    edition: null,
    checkedAt,
    locator: '救命処置の手順; AED操作の手順1–4',
    note: '成人の救命の基本原則を参照。実技講習・現場の通信指令員やAEDの指示を代替しない。',
  },
  {
    id: 'applied-fdma',
    title: '消防庁：一般市民向け応急手当WEB講習 コンテンツの概要と学習方法',
    url: 'https://www.fdma.go.jp/relocation/kyukyukikaku/oukyu/img/manual.pdf',
    edition: '2023年3月',
    checkedAt,
    locator: 'p.3: WEB講習受講証明書と実技講習; p.5: 普通救命講習編',
  },
  {
    id: 'applied-eap',
    title: 'OSHA（米国）：Evacuation Plans and Procedures—Emergency Action Plan',
    url: 'https://www.osha.gov/etools/evacuation-plans-procedures/eap',
    edition: null,
    checkedAt,
    locator: 'Emergency Action Plan; Develop & Implement an EAP',
    note: '施設に合わせた計画と訓練の一般原則を参照。米国規則を日本の義務として扱わない。',
  },
];

export const appliedUnits: Unit[] = [
  {
    id: 'program',
    domainId: 'planning',
    title: '目的から組み立てるプログラム',
    subtitle: '自分の成功体験を、相手に合う計画へ変える',
    minutes: 18,
    level: '応用',
    objectives: [
      { id: 'program-o1', text: '特異性・個別性・漸進性・変化の原則を計画に結び付ける' },
      { id: 'program-o2', text: '負荷と休息を、実施能力や当日の状態に合わせて調整する' },
      { id: 'program-o3', text: '目標・設備・時間に応じて運動様式と優先順位を選ぶ' },
    ],
    sections: [
      {
        title: '先に決めるのは「何を変えたいか」',
        body: '人気の種目を並べる前に、達成したい変化を具体化する。筋力、持久力、生活動作では必要な刺激が異なる。次に、経験・動作能力・利用できる設備を確認し、本人が実施できる方法に落とし込む。',
        bullets: [
          '目標→本人の条件→負荷の進め方→計画的な変更、の順に考える。',
          '複数の目標には、複数の運動要素が必要になることがある。',
        ],
      },
      {
        title: '漸進はカレンダーより実施能力を基準にする',
        body: '過負荷は重量の追加だけではない。同じ重量で反復回数を増やすことなども、刺激を高める方法になる。動作の管理が崩れたまま増量せず、実施内容を確認して段階的に調整する。変化をつける場合も、目標とのつながりを残す。',
      },
      {
        title: '休息はプログラムの一部',
        body: 'セット間の休息と、日単位の回復は別に考える。種目や負荷、蓄積した疲労、トレーニング経験によって必要な休息は変わる。本人の申告と動作の観察を合わせ、睡眠不足などがある日は休息延長や実施量の調整を検討する。',
        bullets: [
          '健康づくりでは筋トレに休息日を設け、有酸素性身体活動も組み合わせる。',
          '短時間に詰め込むためだけに休息を削らない。',
        ],
      },
      {
        title: '目標と現実の両方に合う計画',
        body: '最大筋力が優先なら、その練習を強く疲労する前に置くなど、重要な課題に取り組める順序を選ぶ。一般的な健康づくりでは、自重運動も有効な選択肢になる。広い施設の計画を、狭い自宅へそのまま持ち込まない。',
      },
    ],
    example: {
      situation:
        '筋トレ経験はあるが、仕事が忙しく自宅でしか運動できない人が、階段で疲れにくくなることを望んでいる。',
      judgment:
        '使える時間と器具を確認し、目標に合う持久的活動と筋トレを組み合わせる。実施記録を見ながら進め、経験者という理由だけで高重量の計画を移植しない。',
    },
    terms: [
      { term: '特異性', meaning: '加えた刺激の特徴に応じた適応が生じる性質。' },
      { term: '個別性', meaning: '能力や環境など、本人の条件に合わせて計画する考え方。' },
      { term: '漸進性過負荷', meaning: '適応に合わせて刺激を段階的に高めること。' },
      {
        term: 'オートレギュレーション',
        meaning: '当日の実施能力や状態を使って計画を調整する方法。',
      },
      {
        term: 'コンカレントトレーニング',
        meaning: '筋力と有酸素持久力のトレーニングを同じ計画に組み込むこと。',
      },
    ],
    sourceRefs: [
      ref('applied-principles', 'pp.12–13, Steps 1–4'),
      ref('applied-mhlw-strength', '1; 3-3'),
      ref('applied-rest', 'p.20'),
      ref('applied-concurrent', 'Which Should Be Performed First; Practical Applications'),
    ],
  },
  {
    id: 'technique',
    domainId: 'technique',
    title: '動作を観察して伝える',
    subtitle: 'ベンチプレス・ヒップヒンジ・スクワット・準備運動',
    minutes: 18,
    level: '応用',
    objectives: [
      { id: 'technique-o1', text: '安定した開始姿勢と、ベンチプレスで修正したい動作を説明する' },
      { id: 'technique-o2', text: 'RDLとローイングの基本動作を観察し、修正点を選ぶ' },
      { id: 'technique-o3', text: '準備運動・呼吸・補助者との意思疎通を指導に組み込む' },
      {
        id: 'technique-o4',
        text: 'ハイバーバックスクワットの開始姿勢と動作制御を説明し、個人に合う可動域と安全設定・補助の条件を確認する',
      },
    ],
    sections: [
      {
        title: '反復の前に、開始姿勢を見る',
        body: '動作の観察は重量の大小だけでは行えない。ベンチ上では頭部・肩から上背部・臀部を支持し、左右の足も安定させる。ベンチプレスで胸の反動を使う場合は、重量や制御を見直す。マシンでも、使い方と身体を支える位置の確認は必要になる。',
      },
      {
        title: 'ヒンジとローの観察点',
        body: 'ルーマニアンデッドリフト（RDL）は、軽く曲げた膝の角度を大きく変えず、股関節を曲げながら臀部を後ろへ動かす。バーは身体の近くを通す。床へ届くことを優先せず、脊柱の姿勢を管理できる範囲で行う。ローでは体幹を大きく振って引く反復と、狙った動作を区別する。',
        bullets: [
          'RDLでは腕で引き上げず、股関節の動きを使う。',
          '動作の指示は、観察した変化に対して一つずつ伝える。',
        ],
      },
      {
        title: '準備運動を本練習につなげる',
        body: '軽い全身活動から始め、行う種目に近い動きを低い負荷で練習する。動的ストレッチは身体を動かしながら可動域を使う方法で、同じ姿勢を保持する静的ストレッチと区別する。本練習前に疲労しきることを準備運動の目的にしない。',
      },
      {
        title: '呼吸と補助の合図も技術の一部',
        body: '一般的な健康づくりの筋トレでは、息をこらえ続けないよう促す。補助者が必要な種目では、実施回数、ラックへの戻し方、助けを求める合図を先に共有する。安全器具と補助者を準備し、実施中は観察と意思疎通を続ける。',
      },
      {
        title: 'バックスクワットは、深さと安全条件を個別に決める',
        body: '動画はハイバーバックスクワットの実施例である。開始姿勢、膝とつま先の方向、足裏の接地、動作の制御を観察する。大腿を床と平行にする表示を、すべてのクライアントに一律に求めない。本人の柔軟性や筋力を確認し、背中が丸まる、かかとが浮くなどの変化が出る前に上昇へ切り替える。',
        bullets: [
          '足幅と握り幅は個人の特性に合わせて確認する。動画の深さや重量をそのまま再現することを目標にしない。',
          '実施前にラックのセーフティーバーの設定と、補助者の配置・意思疎通を含む補助の条件を確認する。初めての実施は有資格指導者に教わる。',
          'おすすめは開始姿勢と動作制御を学ぶ確認範囲に限定する。音声・全フレームや、個人の動作を専門家が評価したものではない。',
        ],
      },
    ],
    example: {
      situation: 'RDLで「床まで下ろす」と考えた利用者の背中が、下降の終わりに丸くなっている。',
      judgment:
        '床への到達を目標にせず、姿勢を管理できる範囲へ可動域と負荷を調整する。臀部を後ろへ動かすことと、バーを身体の近くで動かすことを確認する。',
    },
    terms: [
      { term: 'ヒップヒンジ', meaning: '股関節を中心に曲げ伸ばしする動作パターン。' },
      {
        term: 'ニュートラルスパイン',
        meaning: '脊柱を極端に曲げたり反らしたりせず、管理された自然な配列を保つこと。',
      },
      {
        term: '5点接触',
        meaning: 'ベンチ上の頭部・肩／上背部・臀部と、床上の左右の足による支持。',
      },
      { term: 'スポッティング', meaning: '必要な場面で適切な位置と方法で行う補助。' },
      { term: '特異的ウォームアップ', meaning: '本練習の種目や動作に近い内容で行う準備運動。' },
    ],
    sourceRefs: [
      ref('applied-technique', 'Module 3.1 pp.3–7; Module 3.2 pp.6–7'),
      ref('applied-rdl', 'Starting Position内の動作説明'),
      ref('applied-mhlw-strength', '3-3. 注意点'),
      ref('applied-standards', 'Standards 3.1–3.2'),
      ref('video-nsca-backsquat-article', '注意ポイント1–8、直後の安全に関する注記2項'),
      ref('video-nsca-backsquat-wl', 'pp.2–4、特にp.3の個別可動域の注'),
    ],
  },
  {
    id: 'safety',
    domainId: 'safety',
    title: '安全な環境と緊急時の初動',
    subtitle: '事前の準備が、現場の迷いを減らす',
    minutes: 14,
    level: '基礎',
    objectives: [
      { id: 'safety-o1', text: '施設に合う緊急対応計画と日常点検の要点を説明する' },
      {
        id: 'safety-o2',
        text: '成人の心停止が疑われる場面で、通報・CPR・AEDを遅らせない原則を説明する',
      },
      { id: 'safety-o3', text: '知識学習と実技講習を区別し、技能維持の計画を立てる' },
    ],
    sections: [
      {
        title: '施設ごとの緊急対応計画',
        body: '緊急対応計画（EAP）には、通報手段、施設の所在地、救急隊の入口、AEDなどの位置、担当者の役割を具体的にまとめる。文書を置くだけで終えず、現地で役割を確認して練習し、設備や人員が変わったら見直す。OSHAなど米国の指針は海外の参考資料であり、日本の法的義務を示すものではない。実際の施設の規程と地域の連絡体制に合わせて使う。',
      },
      {
        title: '使う前の点検と使用停止',
        body: '器具は製造者の説明に従って設置・使用・点検する。修理が必要な器具は使用対象から外し、修理後にも正常に動くことを確認する。床の状態、照明、室温や換気も、運動を始める前の確認対象にする。',
      },
      {
        title: '成人の救命で覚える基本原則',
        body: '周囲の安全を確かめ、呼びかけなどに反応がなければ助けを呼び、119番通報とAEDの手配を頼む。続いて呼吸を確認し、普段どおりの呼吸がない、または判断に迷う場合は、ただちに胸骨圧迫を始める。AED到着後は装置の指示に従い、心電図の解析時と電気ショック時には全員が傷病者から離れる。',
        bullets: [
          '実際の対応では通信指令員とAEDの指示に従う。',
          '本単元は成人の基本原則の学習であり、すべての救急場面の手順書ではない。',
        ],
      },
      {
        title: '動画で知り、実技で練習する',
        body: 'CPR・AEDの動画は予習や知識確認に使えるが、対面の実技練習や資格要件を満たす講習の代わりにはならない。消防庁のWEB講習受講証明書も、実技を含む救命講習の修了を示すものではない。地域の消防署などで実技講習を受け、技能を更新する。',
      },
    ],
    example: {
      situation:
        '新しい施設へ異動した。救命講習は受けたが、AEDと救急隊の入口の位置をまだ知らない。',
      judgment:
        '勤務前に現地のEAP、機器の場所、通報と誘導の役割を確認する。資格の保有と、その場所で動ける準備を分けて点検する。',
    },
    terms: [
      { term: 'EAP', meaning: '予測される緊急事態に対する、施設ごとの対応計画。' },
      { term: 'CPR', meaning: '心肺蘇生。胸骨圧迫などで循環・呼吸を支える救命処置。' },
      {
        term: 'AED',
        meaning: '心電図を解析して電気ショックの必要性を判断し、操作を案内する機器。',
      },
      {
        term: '普段どおりの呼吸',
        meaning: '通常の呼吸。途切れ途切れにあえぐような呼吸は、正常な呼吸と扱わない。',
      },
    ],
    sourceRefs: [
      ref('applied-standards', '§4; §5'),
      ref('applied-eap', 'Emergency Action Plan; Develop & Implement'),
      ref(
        'ex-safe-resuscitation',
        '本文pp.20–26、35–37：反応、119番通報・AED依頼、呼吸、AEDの解析とショック',
      ),
      ref('applied-aed', '救命処置とAED操作の手順'),
      ref('applied-fdma', 'pp.3,5'),
    ],
  },
  {
    id: 'professional',
    domainId: 'safety',
    title: '専門職としての境界と信頼',
    subtitle: '守秘・紹介・記録・誠実な情報発信',
    minutes: 13,
    level: '基礎',
    objectives: [
      { id: 'professional-o1', text: '個人情報と記録の扱いを、専門職としての守秘原則から判断する' },
      { id: 'professional-o2', text: '自分の提供範囲を認識し、適切な専門家への紹介を選ぶ' },
      { id: 'professional-o3', text: '資格表示・継続学習・著作物の利用を誠実に行う' },
      {
        id: 'professional-o4',
        text: 'ハラスメントが起こりやすい力関係や環境を説明し、相手が拒否しにくい状況に配慮する',
      },
    ],
    sections: [
      {
        title: '話された情報は宣伝素材ではない',
        body: '身体情報や相談内容を知ったことと、第三者に公開できることは別である。NSCAの倫理規程では守秘を求め、ケアに関わらない第三者への開示は、法令による場合を除き書面での同意を必要としている。SNSでも専門職としての責任は続く。',
      },
      {
        title: '提供できる範囲を明確にする',
        body: '教育・経験と適用される規則の範囲でサービスを提供する。資格があることだけを理由に、医療などの別分野の権限まで持つと考えない。自分の範囲を超える相談は、適任の専門家へつなぐ。売上より利用者の利益を優先する。',
      },
      {
        title: '記録は残し、アクセスを絞る',
        body: '指導内容や事故・点検の記録は、経過の確認と説明のために管理する。紙は施錠、電子データは適切なアクセス管理など、保管方法も決める。保存期間や契約・同意文書の法的な扱いは、所属先の規程とその地域の適切な専門家の助言を確認する。',
      },
      {
        title: '資格と教材を正しく扱う',
        body: '保有していない資格を表示せず、最新の実務知識を継続して学ぶ。公式試験問題や有料教材を無断で複製・配布しない。本アプリの設問は独自の学習用問題であり、NSCA公式問題や専門家の検証済み問題という表示はしない。',
      },
      {
        title: '拒否の言葉がないことを、同意と決めつけない',
        body: '指導者と利用者の力関係や、成果を優先する環境は、相手が不安や不快を訴えにくい状況を生む。自分の指導意図だけで判断せず、言動と周囲の環境を振り返る。懸念があるときは相手の安全と意思を尊重し、所属先や適切な相談窓口につなぐ。個別行為が違法かどうかをこの説明だけで決めず、必要に応じて適切な専門家へ相談する。',
        bullets: [
          '利用者が黙って従っていても、痛みや身体への接触について安心して断れるかを確認する。',
          '過去に自分が受けた指導や、成果が出た経験だけを根拠に、同じ言動を正当化しない。',
        ],
      },
    ],
    example: {
      situation: '利用者が薬の量を変えたいと相談し、同時に体験談を広告に使ってよいか尋ねられた。',
      judgment:
        '薬の変更は担当医療者へ相談してもらう。広告利用は指導契約と切り離し、内容・利用先などを明確にした同意を確認する。信頼関係があるだけで公開許可があるとは考えない。',
    },
    terms: [
      { term: '守秘', meaning: '業務で得た個人の情報を、不適切に第三者へ開示しないこと。' },
      {
        term: 'スコープ・オブ・プラクティス',
        meaning: '教育・経験・資格と適用される規則によって定まる業務の範囲。',
      },
      { term: 'リファーラル', meaning: 'より適任の専門家への紹介。' },
      { term: '利益相反', meaning: '金銭的な利益などが、利用者のための判断に影響し得る状態。' },
      { term: '継続教育', meaning: '資格取得後も知識と技能を更新する学習。' },
      {
        term: 'ハラスメント',
        meaning:
          '相手の尊厳や安心を損なう言動、またはそうした状況をつくること。個別行為の法的判断とは分けて考える。',
      },
      {
        term: '力関係',
        meaning:
          '評価や指導の決定権などが一方に偏り、相手が断ったり懸念を伝えたりしにくくなる関係。',
      },
    ],
    sourceRefs: [
      ref('applied-ethics', 'Principles 1.3–1.5, 2.3, 3.1–3.3, 3.5, 3.8, 4.1–4.2, 4.7'),
      ref('applied-standards', '§6 Records & Record Keeping'),
      ref('video-jspo-ethics', 'PDF pp.15–16：Ⅳ1 構造的要因／Ⅳ2 表面化しにくい倫理的問題への対応'),
      ref('video-jspo-handbook1', '本文p.17 / PDFp.18：1 ハラスメントの考え方'),
    ],
  },
];

interface Seed {
  id: string;
  unit: 'program' | 'technique' | 'safety' | 'professional';
  revision?: number;
  reviewedAt?: string;
  objective: 1 | 2 | 3;
  pool: 'diagnostic' | 'practice';
  context?: 'text' | 'case';
  difficulty?: 1 | 2 | 3;
  group?: string;
  prompt: string;
  // The first tuple is correct; makeQuestion rotates display order without changing choice IDs.
  options: [string, string][];
  explanation: string;
  refs: SourceRef[];
}

const seeds: Seed[] = [
  {
    id: 'program-01',
    unit: 'program',
    objective: 1,
    pool: 'diagnostic',
    prompt: 'プログラム設計で「特異性」に最も直接結び付く判断はどれか。',
    options: [
      ['改善したい能力に合う刺激を選ぶ', '適応を求める能力と、加える刺激を対応させる。'],
      ['全員に同じ負荷を使う', 'これは本人の能力差を無視している。'],
      ['毎回すべての種目を変える', '変化だけでは目標に合う刺激を保証できない。'],
    ],
    explanation: '目的に必要な刺激を選ぶのが特異性の使い方である。',
    refs: [ref('applied-principles', 'p.13, Step 1')],
  },
  {
    id: 'program-02',
    unit: 'program',
    objective: 1,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      '同じ種目でも、体格の異なる2人では無理なく行える姿勢が違う。個別性を踏まえた対応はどれか。',
    options: [
      ['各人の動作能力に合う方法を選ぶ', '体格や動作の違いを計画へ反映する。'],
      ['指導者の姿勢と完全に一致させる', '指導者の体格を利用者へ強制する根拠はない。'],
      ['同じ経験年数なら姿勢の違いを無視する', '経験年数だけでは身体の条件は決まらない。'],
    ],
    explanation: '人を種目へ無理に合わせず、実施できる方法を選ぶ。',
    refs: [ref('applied-principles', 'p.13, Step 2: ability/body proportions')],
  },
  {
    id: 'program-03',
    unit: 'program',
    objective: 2,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      '予定では増量する週だが、利用者は現在の負荷でも姿勢を維持できない。増量の判断として適切なのはどれか。',
    options: [
      ['実施能力を確かめて進度を調整する', '進行は本人の適応と能力に基づける。'],
      ['予定どおり必ず増量する', '日程だけを優先すると能力との不一致を招く。'],
      ['姿勢の変化を無視して回数だけ数える', '回数だけでは動作品質を評価できない。'],
    ],
    explanation: '進行の基準を予定日だけに置かず、現在の実施能力を確認する。',
    refs: [ref('applied-principles', 'p.13, Step 3: individual progression')],
  },
  {
    id: 'program-04',
    unit: 'program',
    objective: 1,
    pool: 'diagnostic',
    prompt: 'トレーニングの「変化（variation）」を適切に使う説明はどれか。',
    options: [
      ['目標との整合性を保ちながら計画的に変える', '変化も特異性と進歩を支えるために使う。'],
      ['比較できないよう毎回無作為に全変更する', '継続した進歩を追いにくくする。'],
      ['停滞しても条件を永久に固定する', '必要な刺激の見直しを行っていない。'],
    ],
    explanation: '変更そのものを目的にせず、目標への適応を続けるために使う。',
    refs: [ref('applied-principles', 'p.13, Step 4')],
  },
  {
    id: 'program-05',
    unit: 'program',
    objective: 3,
    pool: 'diagnostic',
    prompt: '健康づくりのための運動計画について、厚生労働省の情報シートに沿う考え方はどれか。',
    options: [
      ['筋トレと有酸素性身体活動を組み合わせる', '両者を組み合わせる健康上の利点が示されている。'],
      [
        '筋トレをすれば有酸素性身体活動は必ず不要になる',
        '一方の実施で他方が常に不要になるとはされていない。',
      ],
      [
        '有酸素性身体活動をすれば筋トレは必ず不要になる',
        '筋力への刺激を計画から一律に除く理由にはならない。',
      ],
    ],
    explanation: '可能な場合には両者を組み合わせる考え方が示されている。',
    refs: [ref('applied-mhlw-strength', '1. ポイント; 3-2. 健康増進効果')],
  },
  {
    id: 'program-06',
    unit: 'program',
    objective: 2,
    pool: 'diagnostic',
    prompt: '健康づくりの筋トレで、休息日を設ける理由として適切なのはどれか。',
    options: [
      ['負荷と回復の過程を通して適応を促すため', '休息も適応を支える計画の一部となる。'],
      ['筋肉への刺激をすべて避けるため', '休息は運動刺激そのものを否定する考え方ではない。'],
      ['休息中は適応が一切起こらないため', '負荷後の回復過程を無視した説明である。'],
    ],
    explanation: '筋トレは負荷をかける日だけでなく、回復を含めて計画する。',
    refs: [ref('applied-mhlw-strength', '3-3. 休息日と適応')],
  },
  {
    id: 'program-07',
    unit: 'program',
    objective: 2,
    pool: 'diagnostic',
    prompt: '高い負荷の多関節種目と軽い単関節種目では、セット間休息をどう考えるか。',
    options: [
      [
        '種目や強度に応じて必要な休息を変える',
        '大きな筋量を使う高負荷種目では、長い休息が必要になりやすい。',
      ],
      ['すべて一律に最短の休息にする', '種目と強度による必要性の違いを無視する。'],
      ['挙上重量だけを見て、疲労状態は考慮しない', '累積疲労も休息の判断材料となる。'],
    ],
    explanation: '休息時間は、運動の特徴と利用者の状態の両方で決める。',
    refs: [ref('applied-rest', 'p.20, Is 60 Seconds or Less Rest Between Sets Good?')],
  },
  {
    id: 'program-08',
    unit: 'program',
    objective: 3,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      '広いジムで実施していた計画を、狭い自宅へ変更する。最初に行う調整として適切なのはどれか。',
    options: [
      [
        '空間と器具を確認し、同じ目標に合う方法へ置き換える',
        '本人の能力だけでなく環境も種目選択へ反映する。',
      ],
      [
        '設備が違っても全種目を同じ方法で行わせる',
        '安全に実施できる空間や器具があるとは限らない。',
      ],
      ['ジムと同じ器具がなければ一切運動できないとする', '目標に合う代替手段を検討していない。'],
    ],
    explanation: '利用可能な環境の中で、目的と安全性に合う方法を選ぶ。',
    refs: [ref('applied-principles', 'p.13, Step 2: training environment')],
  },
  {
    id: 'program-09',
    unit: 'program',
    objective: 3,
    pool: 'practice',
    context: 'case',
    prompt:
      '利用者が筋力と長距離歩行の持久力の両方を改善したい。計画の考え方として適切なのはどれか。',
    options: [
      ['両方の目的を扱える運動要素を組み込む', '複数の目標には複数の刺激が必要になることがある。'],
      ['どんな目的にも一種類の種目だけで十分と決める', '異なる能力へ必要な刺激を区別していない。'],
      ['測定しやすい一方の目標を本人に断りなく削る', '本人の望む目標を計画に反映していない。'],
    ],
    explanation: '複数の目標を整理し、必要な運動要素の組合せを考える。',
    refs: [ref('applied-principles', 'p.13, Step 1: multifaceted goals')],
  },
  {
    id: 'program-10',
    unit: 'program',
    objective: 2,
    pool: 'practice',
    prompt: '重量を変えない場合でも、漸進性過負荷の方法になり得る変更はどれか。',
    options: [
      [
        '適切な動作で行える反復回数を段階的に増やす',
        '同じ重量で反復を増やすことも刺激を高める方法となる。',
      ],
      ['必ず全反復を省略する', '運動刺激を増やす変更ではない。'],
      ['運動記録の単位表記だけを変える', '表記の変更で身体への刺激は変わらない。'],
    ],
    explanation: '過負荷を、重量の増加だけと混同しない。',
    refs: [ref('applied-principles', 'p.13, Step 3: same load/more repetitions')],
  },
  {
    id: 'program-11',
    unit: 'program',
    objective: 2,
    pool: 'practice',
    context: 'case',
    prompt:
      '睡眠不足を訴え、準備運動でも普段より疲労が強い。予定した筋トレへの対応として適切なのはどれか。',
    options: [
      ['休息延長や負荷・実施量の調整を検討する', '当日の回復状態を反映する判断である。'],
      ['疲労の申告を無視して予定量を必ず完遂させる', '累積疲労を調整材料にしていない。'],
      ['休息をさらに削り、疲労を判別しにくくする', '実施能力を支える調整になっていない。'],
    ],
    explanation: '睡眠やストレスによる当日の変化は、計画の調整材料になる。',
    refs: [ref('applied-rest', 'p.20, How Sleep and Stress Should Impact Rest Intervals')],
  },
  {
    id: 'program-12',
    unit: 'program',
    objective: 2,
    pool: 'practice',
    prompt: 'セット間休息を当日の状態に合わせて調整するとき、情報の集め方として適切なのはどれか。',
    options: [
      [
        '本人の申告と指導者による実施状況の観察を組み合わせる',
        '主観的な情報と観察を合わせて判断する。',
      ],
      ['前回の時間だけで決め、今回は観察しない', '今回の疲労や実施能力の違いを反映できない。'],
      ['本人の感覚も動作も一切用いない', '調整に必要な情報を捨ててしまう。'],
    ],
    explanation: '休息の判断には、自己申告と実際の様子の両方が役立つ。',
    refs: [
      ref(
        'applied-rest',
        'p.20, Nutrition and Rest Intervals末尾; Adjusting Rest Intervals Each Session',
      ),
    ],
  },
  {
    id: 'program-13',
    unit: 'program',
    objective: 3,
    pool: 'practice',
    context: 'case',
    prompt:
      '同日に有酸素運動と筋トレを行い、優先目標は筋力向上である。順序を決める際の基本的な考え方はどれか。',
    options: [
      [
        '筋力の練習を十分な状態で行えるよう、前半への配置を検討する',
        '優先する能力へ質の高い練習を配分する。',
      ],
      ['目標にかかわらず有酸素運動で先に疲労しきる', '目標を優先順位へ反映していない。'],
      ['両方を計画に入れることは常に不可能とする', '組合せは可能であり、条件に応じて調整する。'],
    ],
    explanation: '順序は目標に応じて選ぶ。組合せによる影響を一律に決めつけない。',
    refs: [
      ref('applied-concurrent', 'Which Should Be Performed First: Cardio or Resistance Training?'),
    ],
  },
  {
    id: 'program-14',
    unit: 'program',
    objective: 3,
    pool: 'practice',
    prompt: '筋力トレーニングに含まれる運動として、適切なのはどれか。',
    options: [
      ['自分の体重を抵抗に使う腕立て伏せ', '自重も筋肉に負荷を与える抵抗となる。'],
      ['筋トレはマシンで行うものだけを指す', '自重やダンベルなどを除外する説明は適切でない。'],
      [
        '器具を使わない運動はすべて筋トレに含まれない',
        '器具の有無だけでは運動様式を分類できない。',
      ],
    ],
    explanation: '筋トレは、専用器具の使用だけで定義されない。',
    refs: [ref('applied-mhlw-strength', '2. 筋力トレーニングとは')],
  },
  {
    id: 'program-15',
    unit: 'program',
    objective: 2,
    pool: 'practice',
    prompt:
      '厚生労働省ガイド2023の情報シートで、成人・高齢者の健康づくりに推奨する筋トレ頻度はどれか。',
    options: [
      ['週2～3日', 'このシートに記載された一般的な推奨である。'],
      ['必ず毎日、休息日なし', '同資料は休息日を設けることも示している。'],
      ['年1回だけ', '継続した健康づくりの推奨頻度ではない。'],
    ],
    explanation: '一般的な健康づくりの推奨と、個人向けの処方は区別する。',
    refs: [ref('applied-mhlw-strength', '1. 筋力トレーニングのポイント')],
  },
  {
    id: 'program-16',
    unit: 'program',
    objective: 2,
    pool: 'practice',
    prompt: '休息の判断で使う「training age（トレーニング年齢）」は何を意味するか。',
    options: [
      ['トレーニングの経験の程度', '実年齢とは別に、実施経験を表す考え方である。'],
      ['生年月日から算出した年齢だけ', '暦年齢とは区別される。'],
      ['その施設が開業してからの年数', '施設の経過年数ではない。'],
    ],
    explanation: '経験の程度は、扱える負荷や休息の検討材料になる。',
    refs: [ref('applied-rest', 'p.20, Training Age and Rest Intervals')],
  },
  {
    id: 'technique-01',
    unit: 'technique',
    objective: 1,
    pool: 'diagnostic',
    prompt: '仰向けのベンチプレスで維持する5点接触の組合せはどれか。',
    options: [
      ['頭部・肩／上背部・臀部・右足・左足', 'ベンチ上の支持と左右の足による支持を数える。'],
      ['頭部・左右の肘・左右の膝', '肘と膝をベンチや床への支持点とする説明ではない。'],
      ['左右の手・左右の肩・頭部', '臀部と左右の足による支持を含んでいない。'],
    ],
    explanation: '重さを動かす前に、身体の支持を確認する。',
    refs: [ref('applied-technique', 'Module 3.1 p.3, Body Position')],
  },
  {
    id: 'technique-02',
    unit: 'technique',
    objective: 2,
    pool: 'diagnostic',
    prompt: 'RDLの下降局面で中心となる動作はどれか。',
    options: [
      ['股関節を曲げ、臀部を後方へ動かす', 'ヒップヒンジでバーを下ろす。'],
      ['肘を曲げてバーを胸へ引く', '腕で引く動作を主動作にする種目ではない。'],
      [
        '膝を深く曲げ続け、臀部を真下だけへ下げる',
        'RDLでは膝の軽い屈曲を保ち、股関節の動きを使う。',
      ],
    ],
    explanation: 'RDLを、腕での引き上げや膝主導の下降と区別する。',
    refs: [ref('applied-rdl', 'Starting Position: hips flex and move backward')],
  },
  {
    id: 'technique-03',
    unit: 'technique',
    objective: 2,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      'ベントオーバーローで、体幹を大きく振る反動が増えている。まず再確認したい技術上の原則はどれか。',
    options: [
      ['体幹と脊柱の姿勢を管理して引く', '資料では体幹の安定と反動の抑制を確認点としている。'],
      ['体幹の振りをさらに大きくする', '観察された反動を増大させる。'],
      ['重量が動けば姿勢の確認は不要とする', '移動した重量だけでは技術を評価できない。'],
    ],
    explanation: '反動で反復を作っていないかを観察し、必要なら負荷も見直す。',
    refs: [ref('applied-technique', 'Module 3.2 p.6, Bent-Over Row: key points/common errors')],
  },
  {
    id: 'technique-04',
    unit: 'technique',
    objective: 2,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      'RDLでバーを下ろすほど背中の姿勢を維持できなくなる。下降範囲の考え方として適切なのはどれか。',
    options: [
      [
        '姿勢を管理できる範囲で下降を止める',
        '床への到達より脊柱の姿勢を管理できる範囲を優先する。',
      ],
      ['全員が必ず床まで下ろす', '個々の動作能力を無視した一律の基準である。'],
      ['背中をさらに丸めて距離を稼ぐ', '維持できていない姿勢を悪化させる。'],
    ],
    explanation: '可動域を、床までの距離だけで判断しない。',
    refs: [
      ref('applied-rdl', 'Starting Position: lower until a neutral spine cannot be maintained'),
    ],
  },
  {
    id: 'technique-05',
    unit: 'technique',
    objective: 3,
    pool: 'diagnostic',
    prompt: '動的ストレッチに当たる説明はどれか。',
    options: [
      ['動きながら必要な可動域を使う', '動的な方法は運動を伴って可動域を使う。'],
      ['一定の伸張姿勢を保つ方法だけを指す', 'これは静的ストレッチの特徴である。'],
      ['可動域を使わず完全に静止する', '動的な準備活動の説明ではない。'],
    ],
    explanation: '動きの有無に注目して、動的と静的の方法を区別する。',
    refs: [ref('applied-technique', 'Module 3.1 pp.5–6, flexibility/types of stretching')],
  },
  {
    id: 'technique-06',
    unit: 'technique',
    objective: 3,
    pool: 'diagnostic',
    prompt: '本練習前のウォームアップを進める原則として適切なのはどれか。',
    options: [
      ['疲労しきらない範囲で徐々に強度を上げる', '準備を整え、本練習へつなげる。'],
      ['開始直後から限界反復を続ける', '準備の段階で過大な疲労を生じさせる。'],
      ['準備運動と本練習の目的を同じ限界疲労にする', '準備運動の目的を取り違えている。'],
    ],
    explanation: '準備運動は、本練習の実施能力を整えるために行う。',
    refs: [ref('applied-technique', 'Module 3.1 p.6, Warm-up Progression')],
  },
  {
    id: 'technique-07',
    unit: 'technique',
    objective: 3,
    pool: 'diagnostic',
    context: 'case',
    prompt: 'ベンチプレスの補助を頼まれた。開始前に最も適切な確認はどれか。',
    options: [
      ['実施内容と、補助を求める合図を共有する', '補助では開始前から意思疎通する。'],
      ['合図は不要として相手の希望を聞かない', '補助のタイミングや方法の認識がずれやすい。'],
      ['補助中は利用者の動作を見ないと伝える', '必要な観察と補助を行えない。'],
    ],
    explanation: '補助者との意思疎通も安全な実施の一部である。',
    refs: [
      ref('applied-technique', 'Module 3.1 p.3, Spotting Fundamentals: Communication'),
      ref('applied-standards', 'Standard 3.1'),
    ],
  },
  {
    id: 'technique-08',
    unit: 'technique',
    objective: 1,
    pool: 'practice',
    context: 'case',
    prompt: 'ベンチプレスでバーを胸に弾ませて上げている。技術上の修正として適切なのはどれか。',
    options: [
      [
        '反動に頼らず下降と切り返しを制御する',
        '胸で弾ませることは技術上のエラーとして挙げられる。',
      ],
      ['反動を強めるため勢いよく落とす', '胸で弾ませる動作を悪化させる。'],
      ['バーを動かす速度だけで成功と判定する', '制御の有無を確認していない。'],
    ],
    explanation: '反復回数だけでなく、負荷を管理した動作かを確認する。',
    refs: [
      ref('applied-technique', 'Module 3.2 p.6, Barbell Bench Press: Bouncing bar off the chest'),
    ],
  },
  {
    id: 'technique-09',
    unit: 'technique',
    objective: 2,
    pool: 'practice',
    prompt: '基本的なベントオーバーローで、バーを引く方向として適切なのはどれか。',
    options: [
      ['上腹部へ向けて引く', '資料の基本動作に沿う方向である。'],
      ['首の後ろへ向けて引く', 'ベントオーバーローの基本動作ではない。'],
      ['腕を伸ばしたまま頭上へ運ぶ', 'ローイングとは異なる動作になる。'],
    ],
    explanation: 'ここでは基本型のベントオーバーローを対象としている。',
    refs: [
      ref(
        'applied-technique',
        'Module 3.2 p.6, Bent-Over Row: Pull the bar towards the upper abdomen',
      ),
    ],
  },
  {
    id: 'technique-10',
    unit: 'technique',
    objective: 2,
    pool: 'practice',
    prompt: 'RDLの反復中、膝の扱いとして適切なのはどれか。',
    options: [
      ['軽く曲げた位置を大きく変えずに保つ', '下降・上昇とも軽い膝屈曲を維持する。'],
      ['各反復で膝を完全伸展と深い屈曲へ交互に変える', '資料のRDLの基本動作とは異なる。'],
      ['膝を過伸展させて固定する', '軽い膝屈曲の開始姿勢と一致しない。'],
    ],
    explanation: '膝を大きく曲げ伸ばしするより、股関節の動きに着目する。',
    refs: [
      ref('applied-rdl', 'Starting Position: knees slightly flexed and remain in this position'),
    ],
  },
  {
    id: 'technique-11',
    unit: 'technique',
    objective: 2,
    pool: 'practice',
    prompt: 'RDLでバーを身体の近くに保つ指導として適切なのはどれか。',
    options: [
      ['下降・上昇とも、バーを身体から大きく離さない', '両局面で身体の近くを通す。'],
      ['下降だけバーを遠くへ投げ出す', '身体の近くを通す動作と反する。'],
      ['遠くへ離せば脊柱の姿勢確認は不要になる', 'バーの位置が姿勢管理を不要にすることはない。'],
    ],
    explanation: 'バーの軌道も観察し、身体から離れすぎていないかを確かめる。',
    refs: [
      ref('applied-rdl', 'Starting Position: bar remains close during downward/upward movement'),
    ],
  },
  {
    id: 'technique-12',
    unit: 'technique',
    objective: 3,
    pool: 'practice',
    prompt: '軽い全身活動による一般的ウォームアップで、期待する変化はどれか。',
    options: [
      ['血流や体温を高め、運動への準備を進める', '一般的ウォームアップの目的に沿っている。'],
      ['体温と血流を意図的に下げる', '資料に示された準備の目的とは反対である。'],
      ['準備段階で必ず最大挙上重量を測定する', '一般的ウォームアップの目的ではない。'],
    ],
    explanation: '全身を準備してから、種目に近い練習へつなげる。',
    refs: [ref('applied-technique', 'Module 3.1 pp.5,7: Physiological Benefits; General Warm-up')],
  },
  {
    id: 'technique-13',
    unit: 'technique',
    objective: 3,
    pool: 'practice',
    prompt: 'スクワット前に、その動きを軽い負荷で練習するのは主に何のためか。',
    options: [
      ['本練習に特異的な動作の準備をするため', '実施する動作を準備運動へつなげている。'],
      ['無関係な技術だけを測るため', '行う種目との関連を無視した説明である。'],
      ['本練習の動作確認を永久に省略するため', '準備をした後も動作の観察は必要である。'],
    ],
    explanation: '特異的な準備運動は、本練習の動きを段階的に確認する機会となる。',
    refs: [ref('applied-technique', 'Module 3.1 pp.6–7: Technique/workout specific warm-up')],
  },
  {
    id: 'technique-14',
    unit: 'technique',
    objective: 3,
    pool: 'practice',
    prompt: '一般的な健康づくりの筋トレで、厚生労働省の情報シートに沿う呼吸の注意はどれか。',
    options: [
      ['息をこらえ続けないようにする', '血圧の急激な上昇を抑えるための注意として示される。'],
      ['すべての人に長時間の息こらえを指示する', '同資料の健康づくり向けの注意と反する。'],
      ['呼吸の様子は指導中に確認しない', '安全に関わる観察を省いている。'],
    ],
    explanation: '対象者と目的を限定した一般原則であり、高度な競技挙上技術の一律な説明ではない。',
    refs: [ref('applied-mhlw-strength', '3-3. 息をこらえない注意')],
  },
  {
    id: 'technique-15',
    unit: 'technique',
    objective: 1,
    pool: 'practice',
    context: 'case',
    prompt: 'フリーウエイトを顔の上方へ動かす種目を実施する。監督体制として適切なのはどれか。',
    options: [
      [
        '適切な安全器具と、注意を払った補助を確保する',
        '安全器具と適切な補助を組み合わせる原則に沿う。',
      ],
      [
        '安全器具があれば補助者は必ず不要とする',
        '器具の存在だけで必要な補助を一律に省略できない。',
      ],
      ['経験者なら指導者は見えない別室へ移動する', '監督と必要時の対応ができなくなる。'],
    ],
    explanation: '実施種目に合う安全器具と補助を、開始前から準備する。',
    refs: [ref('applied-standards', 'Standards 3.1–3.2')],
  },
  {
    id: 'safety-01',
    unit: 'safety',
    objective: 1,
    pool: 'diagnostic',
    prompt: '施設の緊急対応計画（EAP）に必要な内容として最も適切なのはどれか。',
    options: [
      ['その施設の通報方法、機器の位置、担当者の役割', '現地で実行できる具体的な対応を決める。'],
      ['別施設の計画を所在地も変えずに保管するだけ', 'その場所で使える情報になっていない。'],
      ['器具の購入価格一覧だけ', '緊急対応の手順や役割を定めていない。'],
    ],
    explanation: '計画は施設の条件に合わせ、実行できる内容にする。',
    refs: [
      ref('applied-standards', 'Standard 5.2; Guideline 5.1'),
      ref('applied-eap', 'Emergency Action Plan; site-specific layout'),
    ],
  },
  {
    id: 'safety-02',
    unit: 'safety',
    objective: 1,
    pool: 'diagnostic',
    context: 'case',
    prompt: '定期点検でケーブルに損傷が見つかり、修理が必要と判断された。適切な対応はどれか。',
    options: [
      [
        '使用を停止し、修理と再点検後に使用へ戻す',
        '修理が必要な器具は正常を確認するまで使用させない。',
      ],
      ['軽い重量なら継続使用してもらう', '修理が必要という判断に反して使用させている。'],
      ['損傷箇所を利用者から見えなくするだけ', '危険を解消していない。'],
    ],
    explanation: '修理が必要な器具は直ちに使用対象から外す。',
    refs: [ref('applied-standards', 'Standard 4.4')],
  },
  {
    id: 'safety-03',
    unit: 'safety',
    objective: 2,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      '施設で倒れた成人に呼びかけても反応がない。周囲は安全で、胸と腹を確認すると、しゃくり上げるような不規則な息が時折ある。近くに通報とAEDを頼める人が2人いる。最初の対応はどれか。',
    options: [
      [
        '周囲に119番とAEDの手配を頼み、不規則な息を正常な呼吸とはみなさず胸骨圧迫を始める',
        '反応がなく正常な呼吸がない場合は心停止を疑う。人手があるので通報とAEDの手配を分担する。',
      ],
      [
        '周囲に119番とAEDの手配を頼み、呼吸が止まるかを回復体位で観察してから圧迫する',
        '回復体位での観察は普段どおりの呼吸がある場合。不規則なあえぎでは圧迫を待たない。',
      ],
      [
        '周囲に119番とAEDの手配を頼み、通信指令員が呼吸を判断するまで胸骨圧迫を保留する',
        '指令員の助言は活用するが、正常な呼吸がないと判断できた場面で圧迫の開始を待たない。',
      ],
    ],
    explanation:
      'ときどき息をしているように見えても、普段どおりの呼吸とは限らない。通報とAEDの手配を分担し、指令員の指示にも従いながら心肺蘇生を始める。',
    refs: [
      ref(
        'ex-safe-resuscitation',
        '本文pp.20–26：反応・119番・AEDの手配・普段どおりの呼吸・死戦期呼吸',
      ),
    ],
  },
  {
    id: 'safety-04',
    unit: 'safety',
    objective: 2,
    pool: 'diagnostic',
    prompt:
      '成人に胸骨圧迫を続けながら、別の救助者がAEDパッドを貼った。AEDが「心電図を解析します。離れてください」と案内した。この時点の対応はどれか。',
    options: [
      [
        '胸骨圧迫を一時中断し、全員が傷病者から離れる',
        '解析中は、圧迫担当者も含めて誰も傷病者に触れない。',
      ],
      [
        '胸骨圧迫は続け、電気ショックの指示が出たときだけ全員が離れる',
        '胸骨圧迫中の動きが心電図の解析を妨げることがある。',
      ],
      [
        '胸骨圧迫を中断し、呼吸を確認するため一人が傷病者の胸に手を当てる',
        '圧迫を中断しても、解析中に傷病者に触れると解析を妨げることがある。',
      ],
    ],
    explanation:
      'パッドを貼る間はできるだけ胸骨圧迫を続け、解析の指示が出たら一時中断する。解析中と電気ショック時は全員が離れ、その後はAEDの案内に従って胸骨圧迫を再開する。',
    refs: [
      ref('ex-safe-resuscitation', '本文pp.33、35–37：パッド貼付、心電図の解析、心肺蘇生の再開'),
    ],
  },
  {
    id: 'safety-05',
    unit: 'safety',
    objective: 1,
    pool: 'practice',
    context: 'case',
    prompt:
      'EAPを作成したが、スタッフは実際の動きを練習していない。次の対応として適切なのはどれか。',
    options: [
      ['役割を共有し、現地で定期的に練習する', '文書だけでなく実行できる準備が必要である。'],
      ['文書があるので訓練は不要とする', '作成だけでは実行を保証しない。'],
      ['計画をスタッフが読めない場所へ隠す', '現場で必要な手順を共有できない。'],
    ],
    explanation: '計画と、訓練された担当者の行動を結び付ける。',
    refs: [
      ref('applied-standards', 'Standard 5.2'),
      ref('applied-eap', 'Develop & Implement an EAP'),
    ],
  },
  {
    id: 'safety-06',
    unit: 'safety',
    objective: 3,
    pool: 'practice',
    prompt: 'CPR・AEDの動画視聴と、実技を含む救命講習の関係はどれか。',
    options: [
      [
        '動画は知識の学習に使い、実技講習は別に受ける',
        '知識学習の証明と実技を含む講習の修了は異なる。',
      ],
      ['どの動画でも視聴だけで救命講習修了となる', '動画視聴だけでは実技講習の修了を示さない。'],
      ['動画を見れば資格の更新条件も自動的に満たす', '各資格の要件は別に確認する必要がある。'],
    ],
    explanation: '本アプリの学習は、CPR・AEDの実技講習や資格認定の代替ではない。',
    refs: [ref('applied-fdma', 'p.3: WEB証明書と実技; p.5: 講習の代替ではない旨')],
  },
  {
    id: 'safety-07',
    unit: 'safety',
    objective: 1,
    pool: 'practice',
    prompt: '運動開始前の施設確認に含める項目として適切なのはどれか。',
    options: [
      ['床の状態、照明、室温や換気', '安全な実施環境を確認する項目である。'],
      ['広告の閲覧数だけ', '運動場所の安全確認になっていない。'],
      ['音楽の好みだけで他の環境を確認しない', '床や照明などの重要な条件が残る。'],
    ],
    explanation: '運動の安全性は、器具の状態と実施環境の両方から確認する。',
    refs: [ref('applied-standards', 'Guideline 4.1')],
  },
  {
    id: 'professional-01',
    unit: 'professional',
    objective: 1,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      '利用者の身体情報を、ケアに関与しない広告会社へ渡したい。NSCA倫理規程に沿う原則はどれか。',
    options: [
      ['法令による場合を除き、本人の書面による同意を得る', '守秘と第三者への開示条件を確認する。'],
      [
        '契約中なら指導者の判断だけで渡せる',
        '指導契約だけで広告目的の開示が許可されるわけではない。',
      ],
      ['匿名のつもりなら氏名付きのまま渡してよい', '氏名付きの情報は匿名化されていない。'],
    ],
    explanation: 'ここではNSCAの倫理原則を問う。実際には適用される法令や規程も確認する。',
    refs: [ref('applied-ethics', 'Principles 1.3–1.4')],
  },
  {
    id: 'professional-02',
    unit: 'professional',
    objective: 2,
    pool: 'diagnostic',
    context: 'case',
    revision: 2,
    reviewedAt: '2026-11-04T02:10:11Z',
    prompt:
      '認定トレーナーが、一般向けの筋力クラスに加えて、術後の個別運動を依頼された。医療者の運動許可はあるが、本人には術後の個別指導を行う教育も経験もない。NSCAの倫理規程に沿う提供の判断はどれか。',
    options: [
      [
        '適格性と適用規則を確認し、術後の個別指導は適格な専門家につなぐ',
        '教育または経験で適格な範囲と適用規則の両方を確認する。必要なら適格な相手へ紹介する。',
      ],
      [
        '運動許可書に従って術後の個別指導を始め、必要な教育は提供しながら補う',
        'クライアントが運動できることと、提供者がそのサービスに適格であることは別の条件。',
      ],
      [
        '術後の個別指導を一般筋力クラスとして契約し、本人の希望する内容で実施する',
        '契約の名称では提供する行為の範囲や担当者の適格性は変わらない。',
      ],
    ],
    explanation:
      '医療者の許可は利用者の運動条件に関わる。担当者は、教育または経験に基づく適格性と、適用規則で認められる範囲を別に確認する。',
    refs: [ref('applied-ethics', 'Professional Code of Ethics 3.2–3.3：提供範囲と紹介')],
  },
  {
    id: 'professional-03',
    unit: 'professional',
    objective: 3,
    pool: 'diagnostic',
    context: 'case',
    prompt:
      '資格試験を受験予定だが、まだ取得していない。プロフィールの書き方として適切なのはどれか。',
    options: [
      ['未取得であることが分かるよう、実際の状況を記す', '資格と能力を誤認させない表示にする。'],
      ['取得したものとして認定者を名乗る', '保有していない資格を表示している。'],
      ['他人の認定番号を使う', '他人の資格を自分のものとして扱っている。'],
    ],
    explanation: '資格や能力の表示は、直接・間接に誤認を生じさせないようにする。',
    refs: [ref('applied-ethics', 'Principles 3.1, 4.5')],
  },
  {
    id: 'professional-04',
    unit: 'professional',
    objective: 3,
    pool: 'practice',
    prompt: '資格取得後の専門職としての学習について、適切な考え方はどれか。',
    options: [
      ['継続教育で知識と技能を更新する', '利用者を守るために実務と理論の知識を新しく保つ。'],
      ['取得時の知識があれば新しい情報を確認しない', '知識と技能を継続して改善する姿勢に反する。'],
      ['肩書があれば指導技能を振り返る必要はない', '資格表示だけで実務能力の維持は保証されない。'],
    ],
    explanation: '資格取得を学習の終点にしない。',
    refs: [ref('applied-ethics', 'Principle 3.8')],
  },
  {
    id: 'professional-05',
    unit: 'professional',
    objective: 2,
    pool: 'practice',
    context: 'case',
    prompt:
      '紹介料の高い商品を勧めると売上が増えるが、利用者の利益と両立しない。判断の原則はどれか。',
    options: [
      ['金銭的利益より利用者の福祉を優先する', '販売利益のために利用者を搾取しない。'],
      ['紹介料が最も高い商品を必ず優先する', '専門的な判断より金銭的利益を優先している。'],
      [
        '利益関係を隠せば利用者への影響はなくなる',
        '隠すことで不適切な判断が解消するわけではない。',
      ],
    ],
    explanation: '利益関係がある場面でも、利用者の利益を中心に判断する。',
    refs: [ref('applied-ethics', 'Principle 4.2')],
  },
  {
    id: 'professional-06',
    unit: 'professional',
    objective: 3,
    pool: 'practice',
    context: 'case',
    prompt:
      '実際の資格試験問題を無断で複製し、学習サイトへ掲載する提案を受けた。適切な対応はどれか。',
    options: [
      ['掲載せず、権利を尊重した独自問題を作る', '試験問題の無断複製・配布を避ける。'],
      ['無料公開なら無断複製でもよいとする', '無料であることだけで権利処理は不要にならない。'],
      ['問題文の出所を隠して転載する', '出所を隠すことで無断利用が解消するわけではない。'],
    ],
    explanation: '公式試験問題や有料教材は無断転載せず、独自の学習問題を作成する。',
    refs: [ref('applied-ethics', 'Principles 2.3, 4.7')],
  },
  {
    id: 'professional-07',
    unit: 'professional',
    objective: 1,
    pool: 'practice',
    context: 'case',
    prompt: '指導記録を電子保存する。適切な管理方法はどれか。',
    options: [
      ['必要な人だけがアクセスできるよう保護する', '記録の保管とアクセス制限を合わせて行う。'],
      ['誰でも閲覧できる公開フォルダーへ置く', '個人の指導記録へのアクセスを制限できない。'],
      ['閲覧権限が不要になるよう全記録をSNSへ投稿する', '保護された記録管理とは逆の対応である。'],
    ],
    explanation: '保存するだけでなく、閲覧できる範囲と保管方法を管理する。',
    refs: [ref('applied-standards', 'Guideline 6.1: secure records and limited access')],
  },
];

function makeQuestion(seed: Seed, index: number): Question {
  const unit = appliedUnits.find((item) => item.id === seed.unit)!;
  const revision = seed.revision ?? 1;
  const choices = seed.options.map(([text, explanation], optionIndex) => ({
    id: `${seed.id}-c${optionIndex}`,
    text,
    explanation,
  }));
  const offset = index % choices.length;
  return {
    id: seed.id,
    revision,
    groupId: seed.group ?? `applied-${seed.id}`,
    domainId: unit.domainId,
    unitId: seed.unit,
    objectiveIds: [`${seed.unit}-o${seed.objective}`],
    format: 'single_choice',
    context: seed.context ?? 'text',
    difficulty: seed.difficulty ?? (seed.context === 'case' ? 2 : 1),
    pool: seed.pool,
    prompt: seed.prompt,
    choices: [...choices.slice(offset), ...choices.slice(0, offset)],
    correctChoiceId: `${seed.id}-c0`,
    explanation: seed.explanation,
    sourceRefs: seed.refs,
    review: {
      status: 'source_checked',
      reviewerType: 'ai',
      checkedAt: seed.reviewedAt ?? checkedAt,
      revision,
      method:
        '参照先の該当節をWebで閲覧し、正答と各誤答理由を照合。単一正答・対象条件・用語の整合性を確認した独自問題。',
      notes: 'AIによる一次資料照合。専門家による検証、NSCAの承認、公式試験問題の転載ではない。',
    },
  };
}

export const appliedQuestions: Question[] = seeds.map(makeQuestion);
