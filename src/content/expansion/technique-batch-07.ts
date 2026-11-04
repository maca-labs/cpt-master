import type { Source, Unit } from '../../domain/types';
import {
  checkedAt,
  ref,
  techniqueQuestion,
  type TechniqueItem,
  type TechniqueMedia,
} from './technique-batch-shared';
const q = (item: TechniqueItem) =>
  techniqueQuestion(
    item,
    [49, 52, 53, 54].includes(item.number) ? '2026-11-04T12:35:50Z' : '2026-11-04T12:24:19Z',
  );
export const sources: Source[] = [
  {
    id: 'ex-tech-landing',
    title: 'American Council on Exercise: Plyometrics—Controlled Impact/Maximum Power',
    url: 'https://contentcdn.eacefitness.com/assets/education-resources/lifestyle/fitfacts/pdfs/fitfacts/itemid_2658.pdf',
    edition: 'Fit Facts FF115、2013',
    checkedAt,
    locator: 'PDF p.1：Proceed with Caution / Quality, Not Quantity',
    note: '進行・着地の原則を参照し、全員への傷害予防効果や特定強度への適性を保証しない。',
  },
  {
    id: 'ex-tech-deceleration',
    title: 'NSCA: Effective Deceleration Technique for Court and Field Sports',
    url: 'https://www.nsca.com/education/articles/kinetic-select/effective-deceleration-technique-for-court-and-field-sports/',
    edition: '2017年5月、Developing Speedの公式公開抜粋',
    checkedAt,
    locator: 'Deceleration本文全文：下肢屈曲、SSC、屈曲量、planned/unplanned task',
  },
  {
    id: 'ex-tech-acceleration',
    title: 'NSCA: Acceleration vs. Maximum Speed',
    url: 'https://www.nsca.com/education/articles/kinetic-select/acceleration-vs.-maximum-speed/',
    edition: '2017年6月、Developing Speedの公式公開抜粋',
    checkedAt,
    locator: '公開本文全文：acceleration/maximum speedの定義と速度の大きさ・方向',
  },
];
export const units: Unit[] = [
  {
    id: 'ex-tech-power',
    domainId: 'technique',
    title: '着地・減速・スピードの技術',
    subtitle: '跳ぶ前の吸収、次動作へのつなぎ、速度変化を学ぶ',
    minutes: 22,
    level: '応用',
    objectives: [
      { id: 'ex-tech-power-o1', text: '着地の関節運動と、質を基準にした難度調整を説明する' },
      {
        id: 'ex-tech-power-o2',
        text: '減速とSSC、次動作に合う屈曲・体幹姿勢、腕による制御の役割を説明する',
      },
      { id: 'ex-tech-power-o3', text: '加速度と最高速度、予定・反応課題の違いを解釈する' },
    ],
    sections: [
      {
        title: '高さより先に着地の質を確かめる',
        body: '接地後には下肢の関節を使って身体を制御する。初めから高い台からの落下や複雑な連続跳躍を課すのではなく、本人の経験と着地を確認して段階的に進める。反復数を満たしたことだけを、同じ質で着地できた証拠にはしない。',
      },
      {
        title: '吸収して次の動作へつなぐ',
        body: 'SSCは伸張性の局面から短縮性の局面へつながる過程であり、その間の時間や負荷条件が関わる。着地して安定を保つ練習と、短時間で次の跳躍へつなぐ練習では課題が異なる。速い切り返しは、適切な実施能力を確認したうえで導入する。',
      },
      {
        title: '減速の深さは次の動作に合わせる',
        body: '減速では足関節・膝・股関節の屈曲を利用し、身体の運動を制御する。大きくしゃがめば常に良いわけではなく、次に加速や方向転換を行えるかも確認する。資料では初期に後傾し、その程度は入りの速度に依存するとされるが、次の競技動作に合わせ前傾へ移る場合もある。下肢と対側へ動く腕は、吸収とバランス・身体重心の制御を助けるため、脚から切り離して評価しない。予定した方向転換と合図へ反応する方向転換では、要求が同じとは限らない。',
      },
      {
        title: '速さと加速度を区別する',
        body: '最高速度は到達する速度の大きさで、加速度は速度の変化率である。速度には方向も含むため、走る速さが同じでも方向が変われば速度は変化する。区間タイムや短距離での速度だけから、最高速度への到達を断定しない。',
      },
    ],
    example: {
      situation:
        '低い跳躍では着地を制御できるが、高い台から下りると姿勢を保てない。回数は予定どおり終えた。',
      judgment:
        '回数達成を進行の根拠にせず、まず制御できる低い要求へ戻す。高い台からの反応的跳躍を誰にでも適切な開始条件とはしない。',
    },
    terms: [
      { term: 'SSC', meaning: '伸張性局面から短縮性局面へつながる伸張・短縮サイクル。' },
      { term: '減速', meaning: '身体の運動を制御して速度を下げること。次の課題への位置も考える。' },
      { term: '加速度', meaning: '単位時間あたりの速度の変化。速さや方向の変化を含む。' },
      {
        term: '反応課題',
        meaning: '事前に決まった動きだけでなく、合図や相手などに応じて動作を選ぶ課題。',
      },
    ],
    sourceRefs: [
      ref('ex-tech-landing', 'p.1：Proceed with Caution / Quality, Not Quantity'),
      ref('ex-tech-deceleration', 'Deceleration本文'),
      ref('ex-tech-acceleration', '定義と速度変化の説明'),
    ],
  },
];
export const questions = [
  q({
    number: 49,
    unit: 'ex-tech-power',
    objective: 1,
    context: 'video',
    prompt:
      '自作の着地連続模式図で、B接地からCへ、股関節・膝・足関節が曲がっている。この区間を読み取る説明として適切なのはどれか。',
    options: [
      [
        'Cは次に地面を押して再び離地するため、下肢を伸展させている区間である',
        '再跳躍へ押し出す局面と、図にある接地後の屈曲による吸収局面を取り違えている。',
      ],
      [
        'BからCはまだ空中にあり、接地前に脚を引きつけている区間である',
        '接地後という時間関係を、空中で着地を準備する動きへ入れ替えている。',
      ],
      [
        'Cは下肢の関節を屈曲させ、接地後の身体を制御する区間である',
        '図の接地時点と関節運動を、着地の吸収局面へ対応させている。',
      ],
    ],
    answer: 2,
    explanation:
      '接地前、接地後の吸収、次の押し出しを時系列で区別する。図だけで衝撃力の値や傷害の有無までは判定しない。',
    refs: [
      ref('ex-tech-deceleration', 'Deceleration：absorb force through ankle/knee/hip flexion'),
      ref('ex-tech-landing', 'p.1：Quality, Not Quantity'),
    ],
  }),
  q({
    number: 50,
    unit: 'ex-tech-power',
    objective: 2,
    difficulty: 3,
    prompt:
      '痛みがなく反応的跳躍を実施できると評価された成人が、短い切り返しを練習する。着地後に数秒静止する反復へ変更したとき、SSCに関する説明として適切なのはどれか。',
    options: [
      [
        '伸張性から短縮性へ移る遅れが変わるため、同じ課題とはみなさない',
        'SSCは両局面の間の遅れにも影響され、静止を挟む課題とは区別できる。',
      ],
      [
        '着地と跳躍が含まれれば、間の静止時間は一切関係しない',
        '資料のshort delayに関する説明を無視している。',
      ],
      [
        '静止を挟めば、すべての人に高い台からの跳躍が適する',
        '切り返し時間から実施適性や開始強度を保証することはできない。',
      ],
    ],
    answer: 0,
    explanation:
      '静止して姿勢を確かめる練習にも目的はあるが、短い切り返しと同じ要求ではない。速さの追求だけで個人の適性を判断しない。',
    refs: [ref('ex-tech-deceleration', 'SSCの機能とeccentric/concentric間のshort delay')],
  }),
  q({
    number: 51,
    unit: 'ex-tech-power',
    objective: 1,
    prompt:
      '連続跳躍で後半に着地の制御が崩れているが、予定回数だけは達成できた。次回の難度を上げる判断として適切なのはどれか。',
    options: [
      [
        '回数が達成できたので、すぐに台の高さと反復数を同時に増やす',
        '着地の質が崩れている情報を進行に反映していない。',
      ],
      [
        '回数と着地の質を分け、制御できる要求へ調整してから進行を考える',
        '質を重視し、段階的に難度を進める原則に対応する。',
      ],
      ['反復後半の動作は進行の判断に使わない', '疲労等で変わった実施能力を確認できない。'],
    ],
    answer: 1,
    explanation:
      '「終えた量」と「保てた技術」は別に記録する。高い要求へ進める前に、実施できている質を確認する。',
    refs: [ref('ex-tech-landing', 'p.1：Proceed with Caution / Quality, Not Quantity')],
  }),
  q({
    number: 52,
    unit: 'ex-tech-power',
    objective: 2,
    difficulty: 3,
    prompt:
      'NSCAの減速手順では、減速の初期と、その後に次の競技動作へ入る局面で体幹の傾きが変わることがある。資料に対応する観察の整理はどれか。',
    options: [
      [
        '減速の初期も加速と同じ前傾を出発点とし、停止に近づいてから後傾へ移す',
        '資料は初期の後傾を加速の前傾と対比し、その後の課題で前傾へ移る場合を説明している。',
      ],
      [
        '初期の後傾が確認できれば、次の競技動作へ入ってもその傾きを維持することを基準にする',
        '初期の位置を、次の動作への適応を含む全局面の基準へ広げている。',
      ],
      [
        '初期の後傾を入りの速度と合わせて見て、その後は次の動作に必要な姿勢への移行を見る',
        '入りの速度に応じる初期後傾と、減速後の競技課題の姿勢を分けている。',
      ],
    ],
    answer: 2,
    explanation:
      '一枚の傾きの大小だけで良否を決めず、どの局面で次に何を行うかを確認する。資料にない共通の角度の数値は課さない。',
    refs: [
      ref(
        'ex-tech-deceleration',
        'Deceleration第2–4段落：initial rearward lean / initial velocity / subsequent sport-based task',
      ),
    ],
  }),
  q({
    number: 53,
    unit: 'ex-tech-power',
    objective: 2,
    difficulty: 3,
    prompt:
      '減速後にすぐ反対方向へ押し出したいが、深く沈み込むと次の動作が遅れる。吸収と切り返しを両立するための見直しはどれか。',
    options: [
      [
        '吸収と次の力発揮の両方を確認し、課題に合う屈曲量を探す',
        '資料は過大な屈曲で次の短縮性力発揮が妨げられる可能性を説明する。',
      ],
      [
        '吸収に使う関節運動を増やすことを優先し、最も深く曲げた試行を選ぶ',
        '吸収の側だけに基準を置き、次の押し出しに適する位置と移行の遅れを反映していない。',
      ],
      [
        '切り返しを始めるまでの時間を優先し、最も浅い試行を選ぶ',
        '時間の短さだけに基準を置き、減速の吸収を実施できているかを反映していない。',
      ],
    ],
    answer: 0,
    explanation:
      '深さや切り返し時間の一項目だけを最小・最大にする課題ではない。吸収した後に次の力を出せるかも見る。',
    refs: [
      ref('ex-tech-deceleration', 'too much flexion / ideal position depends on subsequent action'),
    ],
  }),
  q({
    number: 54,
    unit: 'ex-tech-power',
    objective: 2,
    prompt:
      '走行からの減速で、下肢の屈曲だけを観察していた。資料では腕も対側へ動くと説明される。この腕の役割として適切なのはどれか。',
    options: [
      [
        '腕は次の加速の準備だけを担うため、減速中は評価対象から外す',
        '資料は減速中にも力の吸収やバランス制御を助ける役割を挙げている。',
      ],
      [
        '下肢と組み合わさり、吸収とバランス・身体重心の制御を助ける',
        '減速時の腕の対側動作に関する記載に対応する。',
      ],
      [
        '腕の振幅を記録できれば、下肢と体幹の制御をその指標へ置き換える',
        '補助する役割を、身体全体の制御に代わる単独指標へ拡張している。',
      ],
    ],
    answer: 1,
    explanation:
      '腕を下肢と無関係な動きとして除外せず、身体全体の減速とバランスの中で見る。腕だけで下肢の制御まで代表させない。',
    refs: [
      ref(
        'ex-tech-deceleration',
        'Deceleration第4段落：arms oppose lower body / balance and center of mass',
      ),
    ],
  }),
  q({
    number: 55,
    unit: 'ex-tech-power',
    objective: 3,
    prompt:
      '一定の速さで走りながら進行方向を変えている区間がある。「速さが同じなので加速度は必ずゼロ」という説明をどう修正するか。',
    options: [
      ['加速度は最高速度に達した瞬間だけに存在する', '加速度を特定の到達点だけに限定している。'],
      [
        '方向は速度に含まれないため、その説明でよい',
        '速度は大きさと方向を持つという定義に反する。',
      ],
      [
        '速さが同じでも方向が変われば速度は変化し、加速度を持ちうる',
        '資料の速度の大きさ・方向の変化に対応する。',
      ],
    ],
    answer: 2,
    explanation:
      '日常語の「速さ」と、方向を含む「速度」を区別する。方向転換も速度変化の一つである。',
    refs: [ref('ex-tech-acceleration', '定義の第2段落：magnitude / direction')],
  }),
  q({
    number: 56,
    unit: 'ex-tech-power',
    objective: 3,
    difficulty: 3,
    prompt:
      '一直線上で同じ方向へ走り、速度が2m/sから6m/sへ2秒で増えた。この区間の平均加速度はいくらか。',
    options: [
      ['2m/s²', '速度変化(6−2)m/sを2秒で割ると2m/s²になる。'],
      ['3m/s²', '終点の速度6だけを2秒で割り、開始速度を引いていない。'],
      ['4m/s²', '速度変化4m/sを、時間で割らずに加速度とした値である。'],
    ],
    answer: 0,
    explanation:
      '平均加速度は速度の変化を経過時間で割る。終点の6m/sはその区間の最高速度の候補だが、加速度の値とは別である。',
    refs: [ref('ex-tech-acceleration', 'Acceleration is the rate of change of velocity')],
  }),
];
export const media: TechniqueMedia = {
  'ex-tech-049': {
    kind: 'sequence',
    assetId: 'ex-tech-landing-absorption',
    caption:
      '自作模式アニメーション。実写ではなく、原因診断や個人評価の保証には使わない。接地後の関節運動を示し、衝撃力の値や傷害予防効果は表さない。',
    alt: '側面3コマ。A小さな跳躍で空中、B接地、C接地後に股関節と膝と足関節を曲げ身体を制御する吸収局面。',
  },
};
