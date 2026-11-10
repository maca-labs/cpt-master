import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';
const unitId = 'ex-plan-age';
export const planningBatch05Sources: Source[] = [
  {
    id: 'ex-plan-age-youth',
    title: 'NSCA: Youth Resistance Training—Updated Position Statement',
    url: 'https://www.nsca.com/globalassets/about/position-statements/position_stand_youth_resistance_training---2009.pdf',
    edition: 'JSCR 23(Suppl5), S60–S79、2009年8月',
    checkedAt: planningCheckedAt,
    locator: '印刷S67：心理面、S68–S69：参加準備と監督、S70 Table1：ウォームアップ等',
    note: '2009年版として参照し、日本公式試験の詳細出題表や新しい個別医学的判断とは区別する。',
  },
  {
    id: 'ex-plan-age-who',
    title: 'WHO Europe: Physical activity',
    url: 'https://www.who.int/europe/news-room/fact-sheets/item/physical-activity',
    edition: '2021-09-01公開、WHO身体活動・座位行動ガイドライン2020の説明',
    checkedAt: planningCheckedAt,
    locator: 'Physical activity recommendations：5–17歳、65歳以上の多要素活動',
    note: '世界的な公衆衛生上の推奨。個別の医療処方やNSCA日本試験固有の数値として扱わない。',
  },
  {
    id: 'ex-plan-age-older',
    title: 'NSCA: Resistance Training for Older Adults—Position Statement',
    url: 'https://www.nsca.com/contentassets/2a4112fb355a4a48853bbafbe070fb8e/resistance_training_for_older_adults__position.1.pdf',
    edition: 'JSCR 33(8), 2019–2052、2019年8月',
    checkedAt: planningCheckedAt,
    locator: '印刷pp.2023–2025：パワーと生活動作、個別化／p.2032：座位からの適応',
    note: '機能・体調・医学的条件に合わせる原則を参照。研究中の負荷範囲を全員の開始負荷にしない。',
  },
];
export const planningBatch05Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '若年者と高齢者の計画',
    subtitle: '参加準備・監督・生活機能を具体化する',
    minutes: 25,
    level: '応用',
    objectives: [
      { id: `${unitId}-o1`, text: '若年者の安全な監督、参加準備、学習を支える環境を選ぶ' },
      { id: `${unitId}-o2`, text: '高齢者のバランス・筋力・生活動作を組み合わせて計画する' },
      { id: `${unitId}-o3`, text: '座位での適応やパワー練習を、能力と習得状況に合わせる' },
    ],
    sections: [
      {
        title: '若年者は監督と学習環境から',
        body: '適切な設計と監督のある抵抗運動は若年者にも利益がある。成人の縮小版として扱わず、若年者の指導知識をもつ人、適した器具、安全な環境を確保する。参加準備には指示を理解して行動できることも含み、誕生日だけで決めない。',
      },
      {
        title: '技能と継続する気持ちを育てる',
        body: '動的な準備運動から始め、比較的軽い負荷で技能を学ぶ。本人の関心や不安を聞き、できるようになった変化を伝える。過度な結果の要求や罰としての運動を、長期の健康習慣づくりと混同しない。WHOの5〜17歳の推奨は身体活動全体のもので、毎日を重い筋力練習にする指示ではない。',
      },
      {
        title: '高齢者の目標は生活につなげる',
        body: '筋力だけでなく、立ち上がり、段差、姿勢の制御など、生活で必要な動作も扱う。WHOは65歳以上に、バランスと筋力を重視した多要素活動を週3日以上行うことを示す。これは有酸素や筋力の推奨をすべて不要にする意味ではない。能力や医療上の条件へ合わせて構成する。',
      },
      {
        title: 'できる姿勢から必要な速さへ',
        body: '立位で安全に運動しにくい場合、座位などの方法へ適応できる。状態に応じて立位へ進むことも検討する。高齢者のパワー練習は、必ず最大重量を使うという意味ではなく、技能を習得したうえで適切な負荷の挙上局面を速く動かす方法などがある。特別な注意を要するため、適応と監督を確認する。',
      },
    ],
    example: {
      situation:
        '自立した外出を目標にする高齢者は、脚の筋力は改善したが段差の上り下りに不安が残る。',
      judgment:
        '重量だけを追加して終わらず、医療上の条件と安全な支持を確認し、バランスと段差に近い課題を段階的に組み込む。',
    },
    terms: [
      { term: '参加準備', meaning: '身体的能力と、指示を理解し守る準備を含む参加の条件。' },
      { term: '多要素活動', meaning: '筋力、機能的バランスなど複数の能力を組み合わせる活動。' },
      { term: '生活動作', meaning: '立ち上がりや歩行など日々の生活で必要な動き。' },
      {
        term: '求心性局面',
        meaning: '筋が力を発揮しながら短くなる局面。速度を扱う際も適切な技能が必要。',
      },
    ],
    sourceRefs: planningBatch05Sources.map((s) => ref(s.id, s.locator)),
  },
];
export const planningBatch05Questions = reviewedPlanningItems(
  unitId,
  planningBatch05Sources,
  '2026-11-04T12:28:23Z',
  [
    {
      number: 1,
      group: 'age-youth-supervision-resource',
      objective: 1,
      prompt:
        '健康な小学生の筋力練習を計画するが、その日は若年者の指導を担える監督者も適した器具も確保できない。適切な対応はどれか。',
      options: [
        [
          '監督・器具・安全環境を整えた機会へ計画を変更する',
          '若年者の抵抗運動では適切な指導と環境を前提とする。',
        ],
        [
          '大人用の器具の重量を軽くし、若年者指導に不慣れな受付担当へ見守りを頼む',
          '重量を下げても器具の適合と若年者への適切な監督は確保されていない。',
        ],
        [
          '競技経験のある年上の子へ監督を任せ、予定メニューを行う',
          '競技経験のある子どもは若年者指導の知識をもつ成人監督者の代わりにはならない。',
        ],
      ],
      explanation:
        '許可か全面禁止かだけでなく、実施に必要な条件を整える。成人用の計画を監督なしで渡すだけでは不十分である。',
      refs: [ref('ex-plan-age-youth', '印刷S69：qualified supervision、器具・環境がない場合')],
      verification:
        '若年者監督と環境を実読し、軽量化と不慣れな成人、年長児への委任では前提が整わない点を再照合。',
    },
    {
      number: 2,
      group: 'age-youth-instruction-readiness',
      objective: 1,
      prompt:
        '同年齢の子ども2人のうち、一人は合図や安全上の指示を理解して実行でき、もう一人はまだ難しい。抵抗運動への参加準備の考え方はどれか。',
      options: [
        [
          '身体的能力に加え、指示へ従える準備を個別に確認する',
          '精神面・身体面の両方の準備が必要である。',
        ],
        [
          '年齢が等しいので同一の課題へ同時参加させる',
          '同年齢でも指示理解などの準備が同じとは限らない。',
        ],
        [
          '指示理解が難しい子は体力テストの結果が良ければ同じ課題へ進める',
          '体力結果は指示を守る準備の確認を置き換えない。',
        ],
      ],
      explanation:
        '開始を暦年齢だけで機械的に決めない。理解しやすい指示や環境を工夫し、準備が整う課題を選ぶ。',
      refs: [
        ref(
          'ex-plan-age-youth',
          '印刷S68–S69 Youth Resistance Training Guidelines：mentally and physically ready',
        ),
      ],
      verification:
        '指示へ従う精神的・身体的準備を実読。同年齢や持てる重さへの単一基準化が不十分な理由を確認。',
    },
    {
      number: 3,
      group: 'age-youth-session-warmup',
      objective: 1,
      prompt:
        '若年初心者の抵抗運動セッションを組む。到着後すぐに高い負荷へ入る案に対する、適切な修正はどれか。',
      options: [
        [
          '動的なウォームアップと軽い負荷での技能確認を先に置く',
          '準備運動と正しい技術を学ぶ段階を設ける。',
        ],
        [
          '長い静的ストレッチの後、軽い負荷での練習を省いて予定の高い負荷へ入る',
          '動的な準備と種目技能を学ぶ段階を、静的ストレッチだけで代替している。',
        ],
        [
          '低強度の歩行で温まった後、初めての種目も予定の高い負荷から始める',
          '一般的な準備運動を行っても、初めての種目の軽負荷での技能確認は別に必要。',
        ],
      ],
      explanation:
        '開始前に身体を準備し、種目では適した負荷で動作を学ぶ。ウォームアップを行ったことだけで高負荷への準備完了とはしない。',
      refs: [
        ref('ex-plan-age-youth', '印刷S70 Table1：dynamic warm-up、light loads、correct technique'),
      ],
      verification:
        '動的準備と軽負荷技能を実読し、静的準備のみ/一般的歩行のみから高負荷へ進む案を再照合。',
    },
    {
      number: 4,
      group: 'age-youth-autonomy-pressure',
      objective: 1,
      prompt:
        '若年者の集団教室で、本人は仲間より軽い重量を使うことを気にして参加が減った。一方、先月よりフォームは安定し、本人はボールを強く投げたいと話している。負荷の安全条件を保ちながら継続を支える計画はどれか。',
      options: [
        [
          '本人が大事にする目標を聞き、安定したフォームの改善を一緒に振り返って、次の達成可能な課題を決める',
          '自己改善や肯定的な体験を支える関わりに合う。',
        ],
        [
          'フォームの改善は個別に伝え、次の短期目標は全員共通の重量への到達にする',
          '個別に伝える点は役立つが、本人の現状や関心に合わせて達成できる目標を作っていない。',
        ],
        [
          '関心のある投球を教室に加え、抵抗運動は重量の自己記録が伸びたときに達成を認める',
          '関心を取り入れ、自分の記録を比べる点は役立つ。今回すでに見られるフォームの改善も、達成として評価する余地がある。',
        ],
      ],
      explanation:
        '短期の記録だけでなく、技能を身につけて続けられる環境を設計する。心理的利益はどの指導法でも自動的に起こるものではない。',
      refs: [
        ref(
          'ex-plan-age-youth',
          '印刷S67 Psychosocial Health and Well-being：self-improvement、過度の圧力への注意',
        ),
      ],
      verification:
        '印刷S67の自己改善と心理的圧力の記載、およびS69の技能向上と楽しさの記載を再確認。共通重量と重量の自己記録だけを達成基準とする案を区別した。',
    },
    {
      number: 5,
      group: 'age-older-multicomponent-frequency',
      objective: 2,
      prompt:
        'WHOの2020年ガイドラインに基づく説明を使い、65歳以上の人の機能と転倒予防も考える。週の計画へ追加すべき内容はどれか。',
      options: [
        [
          'バランスと筋力を重視する多要素活動を週3日以上、能力に合わせて組む',
          '65歳以上への追加推奨の趣旨に対応する。',
        ],
        [
          '会話できる速さの歩行を週3日に分け、それをバランス・筋力の追加推奨と同じものとして集計する',
          '有酸素歩行の頻度だけでは、機能的バランスと筋力を重視した多要素の追加を示さない。',
        ],
        [
          '全身の静的ストレッチを週3日に追加し、多要素の条件を満たしたとする',
          '柔軟性だけでは、ここで問うバランスと筋力の重点を満たさない。',
        ],
      ],
      explanation:
        '対象と参照するガイドラインを明示した公衆衛生の推奨であり、個別の開始負荷や医学的許可ではない。',
      refs: [
        ref(
          'ex-plan-age-who',
          'Older adults aged65+：functional balance and strength、3 or more days',
        ),
      ],
      verification:
        'WHOの対象・頻度・要素を実読し、歩行や柔軟性だけを多要素追加へ読み替える誤りを再照合。',
    },
    {
      number: 6,
      group: 'age-older-chair-adaptation',
      objective: 3,
      prompt:
        '医療上の条件が共有された高齢者は、支えなしの立位では安全な練習が難しい。抵抗運動の導入案はどれか。',
      options: [
        [
          '安定した座位など実行できる姿勢へ適応し、状態に応じて進める',
          '立位が難しい場合の座位での方法と段階的進行が考えられる。',
        ],
        [
          '立位で行う回数を減らせば姿勢を変えずに導入できると判断する',
          '回数を減らしても、支えなしの立位で安全に実行できないという条件は解決しない。',
        ],
        [
          '筋力練習の前に、まず支えなし立位の保持時間を毎回延ばして慣らす',
          '現在安全に保持しにくい姿勢を開始条件にするより、実行可能な座位等へ適応する。',
        ],
      ],
      explanation:
        '移動能力やバランスの制約は方法を適応する理由になる。必要な介助や専門職の条件を守り、立位へ進めるかは反応から判断する。',
      refs: [ref('ex-plan-age-older', '印刷p.2032：chair-based exercise、改善後にstandingへ進行')],
      verification:
        '座位での適応を実読し、回数削減のみ/支えなし立位の時間延長では姿勢条件を解決しない点を再照合。',
    },
    {
      number: 7,
      group: 'age-older-power-not-maxload',
      objective: 3,
      prompt:
        '基本動作を習得し、必要な評価と監督が整った高齢者に、生活機能を目的としたパワー要素を検討する。正しい説明はどれか。',
      options: [
        [
          '適切な中程度の負荷で挙上局面を速く行う方法もあり、最大重量は必須ではない',
          'NSCAは技能と個別化を前提に中程度負荷での速い求心性動作を扱う。',
        ],
        [
          '動作速度を抑えた重い単発挙上を選び、速く力を出す要素も同時に十分扱えたとする',
          '高い重量を動かすことだけでは、この例で求める速い求心性動作を扱ったことにならない。',
        ],
        [
          '挙上はゆっくり保ち、下降局面だけを速くして同じパワー課題にする',
          '参照した高齢者のパワー要素は速い求心性動作で、下降だけを速くする課題への置換ではない。',
        ],
      ],
      explanation:
        '高齢者全員へ高速動作を一律導入する意味ではない。技能を確保し、医学的・整形外科的条件に合う種目と負荷を選ぶ。',
      refs: [
        ref(
          'ex-plan-age-older',
          '印刷pp.2023–2024 Speed of Movement and Power：中程度負荷と適切な技術',
        ),
      ],
      verification:
        '速い求心性動作と中程度強度を実読し、重い低速単発/下降だけ高速という目的の取り違えを再照合。',
    },
    {
      number: 8,
      group: 'age-older-task-transfer',
      objective: 2,
      prompt:
        '高齢者の脚筋力は改善したが、本人が目標にする椅子からの立ち上がりはまだ難しい。次の計画評価として適切なのはどれか。',
      options: [
        [
          'バランスや協調性も確認し、安全な範囲で生活動作に近い課題を組み合わせる',
          '生活機能は筋力だけでなく動作制御にも影響される。',
        ],
        [
          '同じ座位の脚筋力種目を増量することを優先し、動作課題の確認は次の期へ延ばす',
          '筋力以外の動作制御が課題となり得る状況で、生活動作の確認を後回しにしている。',
        ],
        [
          '脚の筋力測定が改善しているので、立ち上がりは有酸素歩行だけで練習する',
          '歩行量の変更だけでは、立ち上がりに関わるバランスや協調、課題特異的な確認を扱えない。',
        ],
      ],
      explanation:
        '評価項目と本人の生活目標をつなぐ。必要な支持や範囲を調整し、生活動作の変化も確認する。',
      refs: [
        ref(
          'ex-plan-age-older',
          '印刷pp.2024–2025 Functional Movement：ADL、動的バランス、chair stands、個別化',
        ),
      ],
      verification:
        '生活動作と筋力以外の制御要素を実読し、増量優先で課題確認を延期/歩行だけへ置換する案を再照合。',
    },
  ],
);
