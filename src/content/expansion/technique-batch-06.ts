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
    [41, 43, 46].includes(item.number) ? '2026-11-04T12:35:50Z' : '2026-11-04T12:17:39Z',
  );
export const sources: Source[] = [
  {
    id: 'ex-tech-row',
    title: 'Concept2: Indoor Rowing Technique',
    url: 'https://www.concept2.com/training/rowing-technique',
    edition: 'メーカー公開Web版（更新日記載なし）',
    checkedAt,
    locator: 'The Catch / The Drive / The Finish / The Recoveryの本文全項目',
    note: '記事本文のRowErg技術を参照。埋め込み動画の内容を確認したという意味ではない。',
  },
  {
    id: 'ex-tech-damper',
    title: 'Concept2: Damper Setting 101',
    url: 'https://www.concept2.cn/en/indoor-rowers/training/tips-and-general-info/damper-setting-101',
    edition: 'メーカー公式地域サイトの公開英語版（更新日記載なし）',
    checkedAt,
    locator: 'Damper Setting is / is Not / Drag Factor / What Damper Setting to Use',
  },
  {
    id: 'ex-tech-bike',
    title: 'Life Fitness: How to Adjust the Seat on Your Life Fitness Atmos Upright Bike',
    url: 'https://support.lifefitness.com/hc/en-us/articles/42862231037335-How-to-Adjust-the-Seat-on-Your-Life-Fitness-Atmos-Upright-Bike',
    edition: '2026-09-11更新。Atmos Home Upright Bike SL/SE4',
    checkedAt,
    locator: 'Finding the right position / Adjusting it / Troubleshooting / Safety',
    note: '公式公開Help Center APIのarticle.body全文を実読。機種別の手順であり、他機種へ操作部を一般化しない。',
  },
  {
    id: 'ex-tech-treadmill',
    title: 'Precor: TRM 211 Treadmill Owner’s Manual',
    url: 'https://static.precor.com/precor-at-home/legacy/TRM_211_Manuals_103117_ENU.pdf',
    edition: '2017年10月配布版（追加資料を含むPDF）',
    checkedAt,
    locator: '本文pp.13–14 / PDF19–20枚目：Safety Clip、p.16 / PDF22枚目：Heart Rate Features',
    note: '安全クリップの機構と表示の限界のみ参照。古い心拍ゾーン・乳酸・処方の説明は教材根拠に採用しない。',
  },
];
export const units: Unit[] = [
  {
    id: 'ex-tech-cardio',
    domainId: 'technique',
    title: '有酸素機器の設定と動作',
    subtitle: 'ローイング・バイク・トレッドミルを機器別に学ぶ',
    minutes: 20,
    level: '応用',
    objectives: [
      {
        id: 'ex-tech-cardio-o1',
        text: 'ローイングの駆動と復帰の順序、ダンパーと運動強度の違いを説明する',
      },
      { id: 'ex-tech-cardio-o2', text: 'バイクの姿勢と、機種の手順に沿った調整を確認する' },
      { id: 'ex-tech-cardio-o3', text: 'トレッドミルの停止機構と機器表示の限界を説明する' },
    ],
    sections: [
      {
        title: 'ローイングは動作の順序を整える',
        body: 'Concept2の基本手順では、ドライブは脚で押すことから始め、体幹の移動、腕の引きをつなぐ。復帰では腕を伸ばし、股関節から前傾してから、手が膝を通過した後に膝を曲げる。腕を早く曲げることや、復帰で膝を先に立てることを分けて観察する。',
      },
      {
        title: 'ダンパーの数字は強度そのものではない',
        body: '空気抵抗式ローイングのダンパーは、空気の流れと漕ぎ心地を変える設定である。運動強度は本人の引く努力にも左右される。異なる機械の同じダンパー番号が同じドラッグファクターとは限らず、汚れや環境も関わる。',
      },
      {
        title: 'バイクは姿勢を見てから微調整する',
        body: '参照するAtmosアップライトバイクでは、ペダルが最も遠い位置でも膝にわずかな曲がりが残り、骨盤を揺らしたり膝を伸ばし切ったりせずに回せる設定を探す。調整は降りてから行い、固定ノブの係合を確認する。別機種ではその取扱説明書を優先する。',
      },
      {
        title: '停止機構と表示の限界',
        body: '参照するPrecor TRM211では、安全クリップを衣服につけ、ひもが引かれると磁気キーが外れてベルトを止める。キーを本体に置くだけでは身体の移動と連動しない。心拍表示は参考値で、医療機器としての精度や個人の安全性を保証するものではない。',
      },
    ],
    example: {
      situation: '別のRowErgに移った利用者が、ダンパーを同じ番号にしたのに漕ぎ心地が違うと感じる。',
      judgment:
        '同じ番号を同じ負荷と決めつけず、ドラッグファクターと本人の動作・努力を確認して設定する。',
    },
    terms: [
      {
        term: 'ドライブ',
        meaning: 'ローイングで脚・体幹・腕をつなぎ、ハンドルへ仕事を伝える局面。',
      },
      { term: 'リカバリー', meaning: '次のドライブへ戻る局面。腕、体幹、脚の順序を確認する。' },
      {
        term: 'ドラッグファクター',
        meaning: 'Concept2でフライホイールの減速から算出する指標。ダンパー番号とは異なる。',
      },
    ],
    sourceRefs: [
      ref('ex-tech-row', 'The Drive / The Recovery'),
      ref('ex-tech-damper', 'is Not / Drag Factor'),
      ref('ex-tech-bike', 'Finding the right position / Adjusting it'),
      ref('ex-tech-treadmill', '本文pp.13–14、16'),
    ],
  },
];
export const questions = [
  q({
    number: 41,
    unit: 'ex-tech-cardio',
    objective: 1,
    context: 'video',
    prompt:
      '自作のRowErg連続模式図で、キャッチからハンドルを引くドライブの順序を確認する。メーカー本文に最も対応する要約はどれか。',
    options: [
      [
        '脚で押す動きから、体幹の移動、最後の腕の引きへつなぐ',
        'Concept2が説明するドライブの順序に対応する。',
      ],
      [
        '脚で押す動きから、先に腕を引き、最後に体幹を後ろへ移す',
        '脚から始める点は合うが、体幹と腕の順序を入れ替えている。',
      ],
      [
        '体幹を後ろへ移す動きから、脚で押し、最後に腕を引く',
        '最後の腕の引きは合うが、脚で始める局面と体幹の順序が逆である。',
      ],
    ],
    answer: 0,
    explanation:
      '三つの動きを滑らかにつなぐための順序である。図の区分ごとに動作を完全停止させることを求めているのではない。',
    refs: [ref('ex-tech-row', 'The Drive')],
  }),
  q({
    number: 42,
    unit: 'ex-tech-cardio',
    objective: 1,
    prompt:
      'RowErgの復帰で、腕を伸ばす前に膝を曲げるため、ハンドルを膝の上へ大きく持ち上げて回避している。手順の修正として適切なのはどれか。',
    options: [
      [
        'ハンドルをさらに高く迂回させ、順序は確認しない',
        '膝との干渉を生む復帰の順序を修正していない。',
      ],
      [
        '腕を伸ばして股関節から前傾し、手が膝を通過してから膝を曲げる',
        'メーカーが示す復帰局面の順序に対応する。',
      ],
      ['腕を曲げたままシートだけを前へ戻し切る', '腕・体幹・脚の連動をさらに崩す。'],
    ],
    answer: 1,
    explanation:
      '引く局面の順序と復帰局面の順序は同じではない。膝との干渉を、ハンドルの高さだけで解決しようとしない。',
    refs: [ref('ex-tech-row', 'The Recoveryの最初の2項目')],
  }),
  q({
    number: 43,
    unit: 'ex-tech-cardio',
    objective: 1,
    difficulty: 3,
    prompt:
      'Concept2の同じ機器でダンパーを低くしたら、利用者が「これで軽い運動に設定できた」と考えた。設定と実際の運動強度の関係を説明するものはどれか。',
    options: [
      [
        'ダンパーを下げた幅を、そのまま運動強度が下がった幅として説明する',
        '空気の流れや漕ぎ心地の変化を、実際の強度の変化へ直接換算している。',
      ],
      [
        '1分間のストローク数を維持すれば、1回ごとの引く強さが変わっても強度はそろうと説明する',
        '同じ反復頻度でも、各ストロークの努力や出力が同じとは限らない。',
      ],
      [
        'ダンパーと本人の引く努力を分け、強く漕ぐほど要求が変わると説明する',
        'Damper Setting is Notの説明に対応する。',
      ],
    ],
    answer: 2,
    explanation:
      '設定値、反復の頻度、1回ごとの引く努力を区別する。機器の方式を限定した説明である。',
    refs: [ref('ex-tech-damper', 'Damper Setting is / is Not、引く努力で強度が変わる説明')],
  }),
  q({
    number: 44,
    unit: 'ex-tech-cardio',
    objective: 1,
    difficulty: 3,
    prompt:
      '同じ利用者が2台のConcept2でフォームを撮影する。ダンパーは両方4、ドラッグファクターは1台目115、2台目128だった。漕ぐ人の出力とは別に、フライホイールの減速のしかたを近づける調整はどれか。',
    options: [
      [
        '2台目のダンパーを調整し、モニターでドラッグファクターが115に近いことを確かめる',
        'この表示はストローク間のフライホイールの減速を表し、同じ番号でも機器によって変わる。',
      ],
      [
        '2台目のダンパーは4に保ち、モニターの出力が1台目と同じになるよう漕ぐ',
        '出力をそろえる比較には使えるが、フライホイールの減速条件が同じになるわけではない。',
      ],
      [
        '2台目のダンパーは4に保ち、1分あたりのストローク数を1台目にそろえる',
        '漕ぐ頻度と、ストローク間に機械側で生じる減速のしかたは別の指標である。',
      ],
    ],
    answer: 0,
    explanation:
      '同じドラッグファクターに近づける調整と、運動の出力や頻度をそろえる調整を区別する。モニターはドラッグファクターを使って仕事量を算出するため、出力が同じでもドラッグファクターまで同じとは限らない。',
    refs: [
      ref('ex-tech-damper', 'Drag Factor：ストローク間の減速、機器間の差、モニターの出力計算'),
    ],
  }),
  q({
    number: 45,
    unit: 'ex-tech-cardio',
    objective: 2,
    prompt:
      'Life Fitness Atmosアップライトバイクで、ペダルが最も遠い位置になるたびに骨盤を左右へ揺らして届かせ、膝も伸び切っている。座面の調整を確認するときの目標はどれか。',
    options: [
      [
        '膝を伸び切らせ、骨盤を毎回大きく動かすことを目標にする',
        'メーカーが示す適切な位置の確認条件と逆である。',
      ],
      [
        '最遠位置でも膝に軽い曲がりを残し、骨盤を揺らさず回せる位置を探す',
        'Finding the right positionの条件に対応する。',
      ],
      [
        '身長が同じ人の座面番号へ固定し、実際のペダリングは確認しない',
        '個別の姿勢や機器の設定を観察せず、他人の番号へ合わせている。',
      ],
    ],
    answer: 1,
    explanation:
      '特定の座面番号より、実際の膝と骨盤の動きを確認する。痛みや疾患の診断を、この観察だけで行うものではない。',
    refs: [ref('ex-tech-bike', 'Finding the right position、Troubleshooting rocking side to side')],
  }),
  q({
    number: 46,
    unit: 'ex-tech-cardio',
    objective: 2,
    prompt:
      'Atmosアップライトバイクを降りて座面高さを変えた。調整ノブを離した後、再び乗る前の確認としてメーカー手順に合うものはどれか。',
    options: [
      [
        'ノブから手を離せたことを確認し、再乗車後の体重で固定具合を確かめる',
        '手を離したこととノブが穴へ十分に係合したことは異なり、係合を再乗車前に確認する。',
      ],
      [
        '座面が目標の高さにあることを確認し、ノブの係合はペダリングを始めてから確かめる',
        '高さの設定は合っても、係合を確認する順序がメーカーの手順より遅い。',
      ],
      [
        'ノブが十分に係合したことを確認してから乗り、膝と骨盤の位置を再確認する',
        'Adjusting itとSafetyに沿う手順である。',
      ],
    ],
    answer: 2,
    explanation:
      '目標の高さ、ノブから手を離す操作、固定の係合、再乗車後の姿勢は別の確認段階である。別機種にはその機種の手順を用いる。',
    refs: [ref('ex-tech-bike', 'Adjusting it 4–5、Safety：fully engaged before getting back on')],
  }),
  q({
    number: 47,
    unit: 'ex-tech-cardio',
    objective: 3,
    prompt:
      'Precor TRM211で磁気キーは本体にあるが、安全クリップを衣服につけていない。ひもによる停止機能を利用するための準備はどれか。',
    options: [
      [
        '運動前に安全クリップを衣服へ装着し、停止操作も確認する',
        '身体の移動とキーを結ぶひもが機能する準備になる。',
      ],
      [
        'クリップを本体に置いたまま、転倒時には自動で必ず作動すると説明する',
        '身体に接続されておらず、ひもが身体の移動で引かれる条件がない。',
      ],
      [
        '安全クリップを外したまま、通常の速度操作と同じ機能とみなす',
        '停止機構と速度調整の区別を失っている。',
      ],
    ],
    answer: 0,
    explanation:
      'この機種の安全クリップは、ひもが引かれてキーが外れることでベルトを停止させる。装着しても事故が起こらないという保証ではない。',
    refs: [ref('ex-tech-treadmill', '本文pp.13–14 / PDF19–20枚目：Using the Safety Clip')],
  }),
  q({
    number: 48,
    unit: 'ex-tech-cardio',
    objective: 3,
    difficulty: 3,
    prompt:
      'TRM211の心拍表示が目標内なので、利用者は「この数字だけで医学的に安全と判定できる」と考えている。機器資料に沿う説明はどれか。',
    options: [
      [
        '機器の表示は医療機器と同じ精度を必ず持つ',
        '取扱説明は医療機器としての使用を意図せず、精度の限界を示している。',
      ],
      [
        '表示は参考情報であり、数字だけで個人の医学的な安全性を保証しない',
        'メーカーが示す用途と精度の限界を説明している。',
      ],
      [
        '画面に数値が出れば、症状や実施状態を確認しなくてよい',
        '機器表示以外の情報を無視する判断である。',
      ],
    ],
    answer: 1,
    explanation:
      '機器から得られる値には用途と限界がある。表示の範囲だけで診断や安全保証を行わない。',
    refs: [ref('ex-tech-treadmill', '本文p.16 / PDF22枚目：Heart Rate FeaturesのImportant')],
  }),
];
export const media: TechniqueMedia = {
  'ex-tech-041': {
    kind: 'sequence',
    assetId: 'ex-tech-row-drive',
    caption:
      '自作模式アニメーション。実写ではなく、原因診断や個人評価の保証には使わない。ローイングの脚・体幹・腕をつなぐ局面を示す。',
    alt: 'RowErg側面3コマ。Aキャッチで膝屈曲・腕伸展、B脚で押して腕は伸ばしたまま、C体幹の移動に続き腕を引きハンドルが肋骨下へ来る。',
  },
};
