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
  {
    id: 'ex-plan-period-recovery-trial',
    title:
      'Robineau et al. Specific Training Effects of Concurrent Aerobic and Strength Exercises Depend on Recovery Duration',
    url: 'https://pubmed.ncbi.nlm.nih.gov/25546450/',
    edition: 'J Strength Cond Res 30(3):672–683、2016',
    checkedAt: '2026-11-10',
    locator: 'Abstract：7週間の介入、0・6・24時間の比較、最大筋力とVO₂peakの結果',
    note: '運動の間隔を調整する根拠に使う。研究対象はラグビー選手で、個人のジャンプの反応や必要な休息時間を直接示さない。',
  },
  {
    id: 'ex-plan-period-same-day-trial',
    title: 'Sale et al. Comparison of two regimens of concurrent strength and endurance training',
    url: 'https://pubmed.ncbi.nlm.nih.gov/2381303/',
    edition: 'Med Sci Sports Exerc 22(3):348–356、1990',
    checkedAt: '2026-11-10',
    locator: 'Abstract：群別人数、レッグプレス1RM、筋横断面積とVO₂maxの変化',
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
        'ジャンプ能力を優先する成人は、長い有酸素運動の直後にはジャンプ速度が落ちるが、短い準備運動の後は速度を保てる。通える日は週2日で、どちらの日も朝と夕方の枠がある。両方の様式の週間量を保ち、ジャンプの質を確かめる次の試行はどれか。',
      options: [
        [
          '朝は短い準備運動からジャンプを行い、夕方へ有酸素運動を移して速度を比較する',
          '速度を保てた準備条件を使い、様式間に時間を置いたうえで週間量と評価指標を保てる。',
        ],
        [
          '朝に長い有酸素運動を行い、心拍数が平常に近づくまでの休息を加えてからジャンプする',
          '週間量を保って休息を追加できるが、心拍数の回復だけではジャンプ速度が回復したか判断できない。',
        ],
        [
          '朝はジャンプを行い、有酸素運動は両日とも短くして朝の枠へまとめる',
          'ジャンプを先にする点は目標に合うが、有酸素運動の週間量を保つ条件から外れる。',
        ],
      ],
      explanation:
        'このケースでは、本人の記録からジャンプ速度を保てた準備条件を選び、同日の別枠で有酸素運動を続ける。回復間隔を変えた研究は配置を検討する根拠になる。朝夕に分けた結果は本人の速度を測って確かめる。',
      refs: [ref('ex-plan-period-recovery-trial', 'Abstract：介入の回復間隔と筋力・有酸素の結果')],
      verification:
        '原著抄録の0・6・24時間の条件と結果を確認。架空例の個別の速度記録、設備の枠、週間量の三条件を各案と照合した。',
    },
    {
      number: 7,
      group: 'period-concurrent-outcome-inference',
      objective: 3,
      prompt:
        '若年男性15人の研究では、筋力運動と有酸素運動を別日に分けた群のレッグプレス1RMが同日群より伸びた。膝周囲筋の横断面積とVO₂maxの変化には明確な群間差が示されなかった。この結果を利用者へどう説明するか。',
      options: [
        [
          '別日案をレッグプレス筋力の根拠の一つとし、筋量や有酸素能力の判断には各指標の結果を使う',
          '筋力で観察された群間差と、他の指標で差が示されなかった結果を分けている。',
        ],
        [
          '別日案を筋力と筋肥大の根拠とし、有酸素能力の判断に限ってVO₂maxの結果を使う',
          '筋力の改善差から筋肥大まで推定しているが、筋横断面積には明確な群間差が示されていない。',
        ],
        [
          '筋力の違いは利用者に伝え、差が示されなかった二指標については両計画の同等性が確かめられたと説明する',
          'この研究で群間差が示されないことと、同等性を検証して確認することは異なる。',
        ],
      ],
      explanation:
        '一つの評価項目の改善差は別の評価項目へ広げられない。小規模研究で差が示されなかった結果を同等性の証明とは扱わず、利用者の目的と継続できる条件を踏まえる。',
      refs: [ref('ex-plan-period-same-day-trial', 'Abstract：群別人数、1RM、横断面積、VO₂max')],
      verification:
        '原著抄録の2群各7人・8人と指標別の群間比較を確認。筋力から筋肥大を推定する誤りと、差の未検出から同等性を推定する誤りを分けた。',
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
