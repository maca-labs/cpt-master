import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';

const unitId = 'ex-plan-progression';
export const planningBatch03Sources: Source[] = [
  {
    id: 'ex-plan-period-hierarchy',
    title: 'NSCA: Hierarchical Structure of Periodization Cycles',
    url: 'https://www.nsca.com/education/articles/kinetic-select/hierarchical-structure-of-periodization-cycles/',
    edition: 'Developing Power抜粋／Kinetic Select 2018年8月',
    checkedAt: planningCheckedAt,
    locator:
      '本文：annual planとmacrocycle、preparation/competition/transition、mesocycleとmicrocycle',
    note: '競技者向け計画の階層を参照。全利用者に同一の期間・競技期分けを義務づけない。',
  },
  {
    id: 'ex-plan-period-taper',
    title: 'NSCA: Tapering and Peaking',
    url: 'https://www.nsca.com/education/articles/kinetic-select/tapering-and-peaking/',
    edition: 'Developing Endurance pp.51–52抜粋／2019年3月',
    checkedAt: planningCheckedAt,
    locator: '本文：taperの定義、volume/intensityの調整と個人・競技に応じた期間',
    note: '負荷を下げて疲労を減らす考え方を参照。本文の数値範囲を全員への処方に転用しない。',
  },
  {
    id: 'ex-plan-period-concurrent',
    title: 'NSCA: To “Cardio” or Not to “Cardio?”—A Brief Review of Concurrent Training',
    url: 'https://www.nsca.com/education/articles/ptq/to-cardio-or-not-to-cardio-that-is-the-question-a-brief-review-of-concurrent-training/',
    edition: 'Personal Training Quarterly 13(2)、2026年8月',
    checkedAt: planningCheckedAt,
    locator:
      'WHAT ARE THE EFFECTS OF CT ON POWER AND PERFORMANCE? / WHAT IF CARDIO IS PERFORMED ON A SEPARATE DAY?',
    note: '対象・目的・評価項目ごとに結果が異なるレビュー。別日なら全員に同じ利益があるとはしない。',
  },
  {
    id: 'ex-plan-period-integration',
    title: 'NSCA: Integration of Endurance Resistance Training',
    url: 'https://www.nsca.com/education/articles/kinetic-select/integration-of-endurance-resistance-training/',
    edition: 'Developing Endurance抜粋／2017年5月',
    checkedAt: planningCheckedAt,
    locator: '冒頭：既存持久系計画への抵抗運動追加、両様式の総負荷と疲労の管理',
    note: '持久系競技者の例を参照。研究中の削減率を個別計画へ一律適用しない。',
  },
];

export const planningBatch03Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '周期化・ピーキングと並行トレーニング',
    subtitle: '目標日から計画し、複数の運動を総負荷で調整する',
    minutes: 24,
    level: '応用',
    objectives: [
      {
        id: `${unitId}-o1`,
        text: '年間・マクロ・メゾ・マイクロの階層と各期の目的を計画例へ対応づける',
      },
      {
        id: `${unitId}-o2`,
        text: 'テーパリングを競技へ向けた疲労軽減と能力維持の調整として説明する',
      },
      { id: `${unitId}-o3`, text: '並行トレーニングで目的・回復時間・両様式の総負荷を調整する' },
    ],
    sections: [
      {
        title: '大きな目標を日々の練習へつなぐ',
        body: '年間計画は年内の目標を扱い、競技シーズンの数に応じて複数のマクロサイクルを含み得る。中程度のまとまりであるメゾサイクルは複数のマイクロサイクルからなり、その中に日・セッションを置く。名前の暗記より、上位の目標と日々の内容がつながることが大切である。',
      },
      {
        title: '期が変われば役割も変わる',
        body: '一般準備では広い身体的基盤を作り、専門的準備では目的の競技へ近づける。競技期では獲得した能力の維持・調整が必要になる。移行期は次のサイクルへつなぐ期間であり、年間を通じて高い負荷を保ち続けるための別名ではない。個人の目標が競技でなければ、その生活や到達目標に合わせて構成する。',
      },
      {
        title: '直前に疲労を積み増さない',
        body: 'テーパリングでは負荷を計画的に下げ、蓄積した身体的・心理的疲労を減らして目標日に能力を発揮しやすくする。量を減らしつつ必要な強度を保つなど、刺激と回復を調整する。完全休止と同義ではなく、期間や減量幅を一律に決める方法でもない。',
      },
      {
        title: '二つの様式を別勘定にしない',
        body: '筋力と有酸素運動の併用には利益があるが、影響は目的や対象、組合せに左右される。特にパワーを重視するときは、長い有酸素運動を直前へ繰り返し置くことを見直し、可能なら回復時間を設ける。持久系計画へ筋力運動を追加するときも、既存量へ単純に上乗せせず、両方の総負荷と反応を確認する。',
      },
    ],
    example: {
      situation:
        '市民ランナーが走行量を保ったまま筋力セッションを追加し、予定していた練習の質を維持できなくなった。',
      judgment:
        '走る日と筋力の日を別々に成功判定せず、全体の量・強度・配置を見直す。医療上の問題が疑われる場合は評価につなぐ。',
    },
    terms: [
      {
        term: 'マクロサイクル',
        meaning: '準備・競技・移行などを含む大きな計画のまとまり。常に暦年1回とは限らない。',
      },
      { term: 'メゾサイクル', meaning: '複数の小さな周期を含む中期間の計画単位。' },
      {
        term: 'テーパリング',
        meaning: '目標日に向けて負荷を下げ、疲労と必要な刺激の釣合いを整えること。',
      },
      { term: '並行トレーニング', meaning: '一つの計画に抵抗運動と有酸素運動を組み合わせること。' },
    ],
    sourceRefs: planningBatch03Sources.map((s) => ref(s.id, s.locator)),
  },
];

export const planningBatch03Questions = reviewedPlanningItems(
  unitId,
  planningBatch03Sources,
  '2026-11-04T12:10:08Z',
  [
    {
      number: 1,
      group: 'period-nested-blocks',
      objective: 1,
      prompt:
        'ある計画では、4週間の重点ブロック内に4つの週計画があり、各週にセッションがある。この階層の説明として最も適切なのはどれか。',
      options: [
        [
          '重点ブロックをメゾサイクル、週計画をマイクロサイクルとして整理する',
          '中期間のブロックから小周期・日・セッションへ分ける階層に対応する。',
        ],
        ['各セッションを年間計画として扱う', '年間から日々へ向かう階層を逆にしている。'],
        [
          '4週間という長さだけで必ずマクロサイクルと呼ぶ',
          'ここで示したまとまり方はメゾと小周期の関係であり、長さだけで上位周期とは決まらない。',
        ],
      ],
      explanation:
        'この例は上位の重点を小周期と各回へ落とす構造を問う。すべてのメゾが4週間でなければならないという意味ではない。',
      refs: [ref('ex-plan-period-hierarchy', '本文末：mesocycle→microcycle→days/sessions')],
      verification:
        'メゾとマイクロの包含関係を実読し、設問の4週という任意条件と、上位・下位を取り違えた誤答を照合。',
    },
    {
      number: 2,
      group: 'period-multiple-seasons',
      objective: 1,
      prompt:
        '春と秋に重要大会があり、それぞれへ準備・競技・移行を組みたい。一年にはマクロサイクルを一つしか置けないと言われた。適切な判断はどれか。',
      options: [
        [
          '年間計画内に複数のマクロサイクルを構成し得る',
          'NSCAの階層説明ではシーズン数に応じて一つ以上を含められる。',
        ],
        [
          '暦年が同じなので秋大会へ向けた準備期は作れない',
          '年間内の構成を暦年一つへ固定している。',
        ],
        [
          '重要大会の数に関係なく毎週を独立した年間計画にする',
          '大会までの長期のつながりを失い、階層も取り違えている。',
        ],
      ],
      explanation:
        '競技日程と目標から年間の構成を決める。一年＝必ず一マクロという固定的な対応ではない。',
      refs: [
        ref('ex-plan-period-hierarchy', 'annual plans can contain one or more macrocyclesの段落'),
      ],
      verification:
        '年間内に複数マクロを含み得る本文と照合。大会の時期は独自のケース条件で、固定暦年説と週への分断を誤答として確認。',
    },
    {
      number: 3,
      group: 'period-general-to-specific',
      objective: 1,
      prompt:
        '競技復帰の準備で、まず広い身体的基盤を作り、その後に競技に近い能力・課題の比重を高める構成を採る。この変化の説明はどれか。',
      options: [
        [
          '一般的準備から専門的準備への重点の移行',
          '広い基盤から競技特有の発達へ向かう各期の役割に合う。',
        ],
        [
          '競技期から移行期へ移ったので競技性を高めている',
          '準備の段階を、競技後のつなぎの役割と取り違えている。',
        ],
        [
          '専門的準備になった時点で一般的能力は不要になる',
          '重点を変えることは、基盤を無価値とすることではない。',
        ],
      ],
      explanation:
        '競技に近づける重点変更を判断する問題であり、全員に同じ種目や負荷を指示するものではない。復帰の可否は必要な医療上の条件と区別する。',
      refs: [ref('ex-plan-period-hierarchy', 'general preparation / specific preparationの説明')],
      verification:
        '各準備期の目的を実読し、移行期との混同、基盤を完全に捨てる推論が本文から支持されないことを照合。',
    },
    {
      number: 4,
      group: 'period-transition-link',
      objective: 1,
      prompt:
        '競技シーズンが終了し、次の準備サイクルへ向けた移行期を設ける。その位置づけとして適切なのはどれか。',
      options: [
        [
          '前の競技期と次の準備をつなぐ期間として計画する',
          '各周期を結び、次の発達へつなぐ役割がある。',
        ],
        [
          '重要大会と同じ負荷を年中維持する期間と定義する',
          '移行という役割を失い、負荷を一律に固定している。',
        ],
        ['移行期へ入ると次の年間目標は計画から外す', '次の周期とのつながりを切ってしまう。'],
      ],
      explanation:
        '移行期も長期計画の一部である。具体的な活動や休養の量は状態と次の目標から考え、名称だけで全員を同じ完全休止にしない。',
      refs: [ref('ex-plan-period-hierarchy', 'competitionとtransitionがcyclesを結ぶ説明')],
      verification:
        '移行期の周期間のつながりを実読。通年の競技負荷維持・次の目標の放棄という対案を個別に確認。',
    },
    {
      number: 5,
      group: 'period-taper-stimulus-fatigue',
      objective: 2,
      prompt:
        '持久系大会の直前期に、これまでの練習で得た能力を残しつつ疲労を減らす計画を検討している。テーパリングの考え方に最も合うのはどれか。',
      options: [
        [
          '練習量を減らし、必要な強度の刺激と回復を個別に調整する',
          '負荷を下げて疲労を軽減し、必要な刺激を保つという目的に合う。',
        ],
        [
          '遅れを取り戻すため量と強度を同時に最大化する',
          '目標日前の疲労軽減という目的と逆になる。',
        ],
        [
          'テーパリングという名前なら全競技で同日数の完全休止にする',
          '強度維持や個人・競技による期間の違いを無視する。',
        ],
      ],
      explanation:
        'テーパリングは能力発揮へ向けた調整で、完全休止や一律日程の別名ではない。数値的な減量幅はここでは処方していない。',
      refs: [
        ref(
          'ex-plan-period-taper',
          '本文：progressive reduction / intensity / duration depends on athlete and event',
        ),
      ],
      verification:
        '疲労軽減と強度を含む負荷調整の本文を照合。直前の最大化と一律完全休止が目的・条件に合わない理由を確認。',
    },
    {
      number: 6,
      group: 'period-concurrent-recovery-placement',
      objective: 3,
      prompt:
        'ジャンプ能力の向上を重視する成人が、毎回長い有酸素運動の直後に脚のパワー練習を行い、動作速度が落ちている。両様式を続ける前提で、最も適切な変更案はどれか。',
      options: [
        [
          '可能なら様式間へ回復時間を置き、直前の有酸素量と配置を見直す',
          'パワー目標では直前の長い有酸素運動と回復不足を見直す意義がある。',
        ],
        [
          '動作速度低下は必ず有効な刺激なので長い有酸素を追加する',
          '目標のパワー発揮を損なっている状況を無視する。',
        ],
        [
          '併用する限り回復時間や配置は結果に影響しない',
          'NSCAレビューの回復・配置に関する実践上の注意と合わない。',
        ],
      ],
      explanation:
        '有酸素運動を一律に禁止するのではなく、目標となる質を保てる配置を考える。全員に同じ回復時間を保証する結論ではない。',
      refs: [
        ref(
          'ex-plan-period-concurrent',
          'WHAT ARE THE EFFECTS OF CT ON POWER AND PERFORMANCE? 最終段落',
        ),
      ],
      verification:
        '長時間有酸素を筋力前に頻回配置する条件と回復の推奨を実読し、速度低下への追加負荷と配置無関係説を照合。',
    },
    {
      number: 7,
      group: 'period-concurrent-outcome-inference',
      objective: 3,
      prompt:
        'ある併用研究で、別日に分けた群は同一セッション群より脚筋力が伸びたが、VO₂maxや筋量の差は小さかった。利用者へ伝える解釈はどれか。',
      options: [
        [
          '評価項目ごとに効果が違い、脚筋力の結果だけで全利益の優劣を断定しない',
          '一つの評価項目の差を他の項目へ自動的に広げない。',
        ],
        [
          '筋力の差があったので同一セッションは健康上無価値である',
          '健康指標全体の無価値は示されていない。',
        ],
        [
          'VO₂maxの差が小さいので筋力の差も存在しなかったことになる',
          '異なる評価項目を同一視している。',
        ],
      ],
      explanation:
        'NSCAレビューは同日・別日の結果が筋力、筋量、有酸素能力で一致しないことを紹介する。個人の目的、時間制約、継続性も含めて選ぶ。',
      refs: [ref('ex-plan-period-concurrent', 'WHAT IF CARDIO IS PERFORMED ON A SEPARATE DAY?')],
      verification:
        '筋力とCSA/VO₂maxの結果の違いを実読。数値を暗記させず、結果の過度な一般化と異なる指標の取り違えを確認。',
    },
    {
      number: 8,
      group: 'period-added-mode-total-workload',
      objective: 3,
      prompt:
        '持久系競技者が走行練習を変更せず、抵抗運動を週内へ追加した後、予定した走行量をこなせなくなった。新しい計画で優先する見方はどれか。',
      options: [
        [
          '追加分も含めた総負荷を確認し、両方の量・強度・配置を調整する',
          '二つの様式の負荷と累積疲労を合わせて扱う。',
        ],
        [
          '走行量さえ同じなら週間総負荷は増えていないとする',
          '追加した抵抗運動の負荷を除外している。',
        ],
        [
          '走行と抵抗運動は別様式なので互いの回復へ影響しないとする',
          '両様式を総合するという考え方と合わない。',
        ],
      ],
      explanation:
        '追加だけで全体の負荷が増えることを見落とさない。削減率は目標や時期、反応で異なり、本文の研究例を一律に当てはめない。',
      refs: [
        ref(
          'ex-plan-period-integration',
          '冒頭：単純追加による疲労、両様式の負荷調整、削減量に合意なし',
        ),
      ],
      verification:
        '既存持久計画への追加で総負荷が増える本文を実読し、追加負荷を無視する二つの推論を条件ごとに照合。',
    },
  ],
);
