import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';

const unitId = 'ex-plan-load';
export const planningBatch01Sources: Source[] = [
  {
    id: 'ex-plan-load-quantifying',
    title: 'NSCA: Quantifying Training and Competition Load',
    url: 'https://www.nsca.com/education/articles/kinetic-select/quantifying-training-and-competition-load/',
    edition: 'NSCA’s Essentials of Sport Science公式抜粋／Kinetic Select 2021年8月',
    checkedAt: planningCheckedAt,
    locator: '外的・内的負荷の区別、抵抗運動の反復総数とvolume loadおよび相対強度に関する本文段落',
    note: '計算式と指標の限界を参照。記事の事例・表を転用せず、数値と指導場面は独自に設定した。',
  },
  {
    id: 'ex-plan-load-relative',
    title:
      'NSCA: Using Intensity Based on Sets and Repetitions—A Brief Overview of Load Setting and Programming Strategy',
    url: 'https://www.nsca.com/globalassets/education/articles/coaches/12.3/nsca-coach-12.3.8_using-intensity-based-on-sets-and-repetitions.pdf',
    edition: 'NSCA Coach 12.3（2025）、公式Web掲載は2025年12月',
    checkedAt: planningCheckedAt,
    locator: '印刷p.50「Percent of 1RM (Relative Intensity)」Rationale / Potential Limitations',
    note: '1RM割合の算出と、その割合だけでは反復能力や疲労を固定できない点を実読。最大挙上テストの実施手順や全員共通の処方には使用しない。',
  },
  {
    id: 'ex-plan-load-rest',
    title: 'NSCA: How to Manipulate Rest Intervals to Maximize Strength Training Effectiveness',
    url: 'https://www.nsca.com/contentassets/fb8a7be6eb174934bb8844703c4de4cc/ptq-10.1.3-how-to-manipulate-rest-intervals-to-maixmize-strength-training-effectiveness.pdf',
    edition: 'Personal Training Quarterly 10.1（2023）',
    checkedAt: planningCheckedAt,
    locator: '印刷pp.20–22：セット間休息、疲労、休息とtraining density、Quality over Quantity',
    note: '設問に示す作業・休息時間は所要時間を計算するための仮定で、個人への推奨時間ではない。',
  },
  {
    id: 'ex-plan-load-tracking',
    title:
      'Maupin et al.: Tracking Training Load and Its Implementation in Tactical Populations: A Narrative Review',
    url: 'https://www.nsca.com/contentassets/9e8aec0cd6ca40cda8de918bf0751e02/tracking_training_load_and_its_implementation_in.1.pdf',
    edition: 'Strength and Conditioning Journal 41(6), December 2019、NSCA公式公開PDF',
    checkedAt: planningCheckedAt,
    locator:
      'PDF pp.3–4：volume load、repetition volume、Internal measurements / session RPEの算出',
    note: 'sRPEの定義と単位を参照。戦術職集団の傷害率・ACWR閾値を一般成人の安全判定や処方へ外挿しない。',
  },
];

export const planningBatch01Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '抵抗運動の負荷・量を計算して読む',
    subtitle: '同じ数字でも、何を測るかで意味が変わる',
    minutes: 24,
    level: '応用',
    objectives: [
      {
        id: `${unitId}-o1`,
        text: '1RM割合・増量率を条件と単位付きで計算し、絶対負荷と相対負荷を区別する',
      },
      {
        id: `${unitId}-o2`,
        text: '反復総数・volume load・内的負荷を計算し、指標だけでは示せない違いを説明する',
      },
      {
        id: `${unitId}-o3`,
        text: 'セット間休息の回数を含めて所要時間を見積もり、記録から計画を比較する',
      },
    ],
    sections: [
      {
        title: '負荷のkgと1RM割合',
        body: '1RMが既知なら、計算上の使用重量は1RM×割合で求める。同じ種目でも、同じkgが2人にとって同じ相対負荷とは限らない。割合から反復限界を一意に決めず、器具の刻み幅、当日の能力、動作の質も確認する。ここで与える1RMは条件値であり、全員へ最大挙上テストを行う指示ではない。',
      },
      {
        title: '反復数とvolume loadは別の記録',
        body: '同じ重量を用いる各セットでは、セット数×反復数×外的負荷kgでvolume loadを求められる。重量や回数が異なる場合は各セットの積を合計する。反復総数だけでは重さを反映しない。一方、volume loadが等しくても、1RM割合・休息・動作範囲・内的反応は同じとは限らず、適応や安全を一つの数値で保証しない。',
      },
      {
        title: '休息の回数を数えて見積もる',
        body: '連続する4セットの間にだけ休息を入れるなら休息は3回である。最後のセット後の休息、移動、準備、ウォームアップ等を含めるか先に決めてから計算する。時間不足を理由に必要な回復を自動的に削らず、何の時間を計算したかを記録へ残す。',
      },
      {
        title: '外から加えた量と本人の反応',
        body: '挙上した重量や回数は外的負荷、心拍や主観的きつさは内的反応の手がかりである。セッション全体の0〜10尺度のRPEを分単位の時間に掛けるsRPEは、任意単位（AU）の指標となる。kgやkcalへ変換した値ではない。異なる尺度を混在させず、同じ測定方法で経過を読む。',
      },
    ],
    example: {
      situation: '前回より反復数が減ったため「負荷量も必ず減った」と利用者が考えている。',
      judgment:
        '各セットの重量と回数を取り出して合計する。量が同じでも負荷割合や本人のきつさは変わり得るため、休息と内的反応を合わせて比較する。',
    },
    terms: [
      { term: '相対負荷', meaning: 'その種目の1RMなど、本人の基準に対する使用重量の割合。' },
      {
        term: 'volume load',
        meaning: '外的負荷と反復回数の積をセット間で合計した量。記録の単位・数え方を統一する。',
      },
      {
        term: '反復総数',
        meaning: '実施した反復の合計。挙上重量を含まないためvolume loadとは別。',
      },
      { term: 'sRPE', meaning: 'セッション全体の主観的きつさと時間を組み合わせる内的負荷指標。' },
    ],
    sourceRefs: planningBatch01Sources.map((source) => ref(source.id, source.locator)),
  },
];

export const planningBatch01Questions = reviewedPlanningItems(
  unitId,
  planningBatch01Sources,
  '2026-11-04T12:04:00Z',
  [
    {
      number: 1,
      group: 'load-percent-rounding',
      objective: 1,
      prompt:
        '健康な成人の既知のスクワット1RMを92 kgとする。計算練習として65%1RMの重量を求め、使用可能な2.5 kg刻みの総重量のうち最も近い値へ丸める。結果はどれか。',
      options: [
        ['60.0 kg', '92×0.65＝59.8 kg。最も近い2.5 kg刻みは60.0 kg。'],
        ['57.5 kg', '59.8との差は2.3 kgで、60.0との差0.2 kgより大きい。切捨てという条件でもない。'],
        ['65.0 kg', '65は割合の数字であり、そのまま使用重量kgにはならない。'],
      ],
      explanation:
        '割合を小数へ変換して掛け、指定された器具の刻みと丸め方を最後に適用する。これは条件値による計算で、個人への使用重量の処方ではない。',
      refs: [ref('ex-plan-load-relative', '印刷p.50 Percent of 1RM / Rationale：1RM×割合')],
      verification:
        '92×0.65＝59.8、59.8と57.5/60.0の距離を再計算。65%を65 kgとする誤りと、丸め方向の誤りを区別した。',
    },
    {
      number: 2,
      group: 'load-variable-set-sum',
      objective: 2,
      prompt:
        '同一種目で25 kg×12回、30 kg×10回、35 kg×8回を各1セット実施した。全セットで総重量をkgで記録するものとし、volume load＝各セットの重量×回数の合計とする。合計はどれか。',
      options: [
        ['880 kg', '300＋300＋280＝880 kg。各セットの条件を個別に掛ける。'],
        ['900 kg', '平均重量30 kg×合計30回では、回数の違いを重み付けできない。'],
        ['30 kg', 'これは3つの重量の単純平均で、volume loadの合計ではない。'],
      ],
      explanation:
        '重量と回数が変わる場合は、各セットの積を先に求めて足す。ここでのkgは負荷量の記録であり、力学的仕事のジュールを直接計算したものではない。',
      refs: [
        ref('ex-plan-load-quantifying', '抵抗運動のsets × repetitions × weight liftedを扱う段落'),
      ],
      verification:
        '25×12＋30×10＋35×8＝880を再計算。単純平均を使う誤答と単位・指標を取り違える誤答を照合。',
    },
    {
      number: 3,
      group: 'load-repetition-volume-ranking',
      objective: 2,
      prompt:
        '同じ種目・同じ可動域で、A日は20 kgを3セット×15回、B日は30 kgを3セット×10回行った。volume loadの計算だけから正しくいえるのはどれか。',
      options: [
        [
          '反復総数はAが多いが、volume loadは両日900 kgで等しい',
          'Aは45回、Bは30回。20×45と30×30はいずれも900 kg。',
        ],
        [
          'Aは反復が多いのでvolume loadも必ず大きい',
          '回数だけでは重量の違いを反映できず、実際の積は等しい。',
        ],
        ['Bは重いので反復総数もAより多い', '重量と回数は別の変数であり、Bの反復総数は30回である。'],
      ],
      explanation:
        '反復総数とvolume loadは順位が一致するとは限らない。どの指標について比較しているかを先に明確にする。',
      refs: [ref('ex-plan-load-tracking', 'PDF p.3：repetition volumeとvolume loadの区別')],
      verification: '45対30回、両日900 kgを再計算し、重量と回数を混同する各誤答を該当定義と照合。',
    },
    {
      number: 4,
      group: 'load-between-client-relative',
      objective: 1,
      prompt:
        '同一種目の既知の1RMは甲80 kg、乙120 kg。両者が60 kgを使うとき、絶対重量と1RM割合の関係として正しいのはどれか。',
      options: [
        [
          '重量は同じだが、甲75%1RM・乙50%1RMである',
          '60÷80と60÷120は異なる。kgの一致は相対負荷の一致ではない。',
        ],
        ['両者とも60%1RMである', 'kgの数値をそのまま百分率へ置き換えている。'],
        [
          '乙のほうが1RMが大きいため60 kgの相対負荷も高い',
          '同じ分子なら基準の1RMが大きいほど割合は低い。',
        ],
      ],
      explanation:
        '同じ重量の比較だけでは個人に対する強度を比較できない。この計算から、両者の疲労や可能な反復回数が同じとも断定できない。',
      refs: [ref('ex-plan-load-relative', '印刷p.50 Percent of 1RM：計算と個人差の限界')],
      verification: '60/80＝0.75、60/120＝0.50を再計算し、基準値の違いを反映する正答を確認。',
    },
    {
      number: 5,
      group: 'load-between-set-time-budget',
      objective: 3,
      prompt:
        '所要時間の計算例として、1セット30秒の運動を4セット行い、セットと次セットの間だけ2分休む。準備・移動・最後のセット後の休息を含めないとき、この種目に必要な時間はどれか。',
      options: [
        ['8分', '運動は4×30秒＝2分、セット間休息は3回×2分＝6分で合計8分。'],
        ['10分', 'セット間だけという条件に対し、最後のセット後の2分まで加えている。'],
        ['6分', '3回のセット間休息のみで、運動している2分が含まれていない。'],
      ],
      explanation:
        'セット数とセット間の休息回数を区別する。指定の時間は計算例であり、すべての種目・利用者へ2分休息を勧める問題ではない。',
      refs: [
        ref('ex-plan-load-rest', '印刷pp.20–21：セット間休息とセッション時間・training density'),
      ],
      verification: '4セットの間隔は3回であることを確認し、4×30＋3×120＝480秒＝8分を再計算。',
    },
    {
      number: 6,
      group: 'load-percentage-change-base',
      objective: 1,
      prompt:
        '同一種目の記録で総重量を50.0 kgから52.5 kgへ変更した。元の重量を基準にした増量率を、小数点以下なしの百分率で表すとどれか。安全な進行率を問う問題ではない。',
      options: [
        ['5%', '増加2.5 kgを元の50.0 kgで割り、100を掛ける。'],
        ['2.5%', '増えたkgの数字をそのまま百分率へ置き換えている。'],
        ['105%', 'これは変更後の重量が元の何%かを表す値で、増加分の率ではない。'],
      ],
      explanation:
        '増量率＝（変更後−変更前）÷変更前×100。変更の割合を計算できても、その増量を行ってよいかは別の判断である。',
      refs: [
        ref(
          'ex-plan-load-quantifying',
          '冒頭：負荷を定量化し、経時的なprogression / regressionを追う目的',
        ),
      ],
      verification:
        '（52.5−50）÷50×100＝5%を再計算。増分kg、変更後の比率、増加率を別量として確認。',
    },
    {
      number: 7,
      group: 'load-equal-tonnage-not-equivalent',
      objective: 2,
      prompt:
        '同じ利用者が同じ種目で、50 kgを3セット×10回行う日と、60 kgを5セット×5回行う日を比較した。両日ともvolume loadは1,500 kgである。次の結論として最も適切なのはどれか。',
      options: [
        [
          '外的負荷量のこの指標は等しいが、相対強度や疲労まで同じとはいえない',
          'セット構成・重量・休息や内的反応の違いはvolume loadの一致だけでは消えない。',
        ],
        [
          'volume loadが同じなので筋力への適応も必ず同じである',
          '一つの外的負荷指標から適応全体の同一性は保証できない。',
        ],
        [
          'volume loadが同じなので休息を記録する必要はない',
          '回復や実施状況を読むための別の変数を捨てている。',
        ],
      ],
      explanation: '集計値は計画を比較する手がかりだが、セット構成と本人の反応も残して解釈する。',
      refs: [
        ref(
          'ex-plan-load-quantifying',
          '外的負荷と内的反応の併用、volume loadは最大筋力に対する強度を反映しないという段落',
        ),
      ],
      verification:
        '両日1,500 kgを再計算し、記事のvolume loadの限界に照らして適応・休息を同一視する誤答を退けた。',
    },
    {
      number: 8,
      group: 'load-session-rpe-arbitrary-units',
      objective: 2,
      prompt:
        'セッション全体を0〜10尺度のRPEで評価し、sRPE＝RPE×時間（分）として記録する。40分の運動をRPE 6と評価したとき、記録値とその意味はどれか。',
      options: [
        [
          '240 AUで、主観的反応と時間を組み合わせた指標である',
          '6×40＝240。AUは任意単位であり、消費熱量ではない。',
        ],
        ['240 kcalで、実測した消費熱量である', 'RPEと分の積をkcalへ変換する式ではない。'],
        ['6 AUで、時間は計算に含めない', '示したsRPEの定義では、セッション時間も掛ける。'],
      ],
      explanation:
        '尺度・採点対象・時間単位をそろえる。ここでのsRPEはセッション全体の指標で、セット単位のRIR尺度や6〜20尺度を混ぜない。',
      refs: [
        ref(
          'ex-plan-load-tracking',
          'PDF p.4 Internal measurements：修正0–10 RPE×セッション時間、arbitrary units',
        ),
      ],
      verification:
        '6×40＝240 AUを再計算し、内的負荷指標をkcalや時間なしのRPEと混同する誤答を原典と照合。',
    },
  ],
);
