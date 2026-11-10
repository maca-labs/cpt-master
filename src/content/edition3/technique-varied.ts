import type { Source } from '../../domain/types';
import { editionPractice } from './shared';
import { techSources as s } from './technique-sources';

function material(id: string, title: string, url: string, locator: string): Source {
  return { id: 'e3-t-' + id, title, url, locator, edition: '公開版', checkedAt: '2026-11-08' };
}
export const mechanicsSource = material(
  'mechanics',
  'OpenStax: College Physics 2e, statics and torque',
  'https://openstax.org/books/college-physics-2e/pages/9-section-summary',
  '§9.1–9.6',
);
export const energySource = material(
  'energy',
  'OpenStax: College Physics 2e, work and energy',
  'https://openstax.org/books/college-physics-2e/pages/7-section-summary',
  '§7.1–7.7',
);
export const accelerationSource = material(
  'acceleration',
  'NSCA: Acceleration and Deceleration Mechanics',
  'https://www.nsca.com/education/articles/kinetic-select/acceleration-and-deceleration-mechanics/',
  'Posture／Arm Action／Leg Action',
);
export const rotationSource = material(
  'rotation',
  'NSCA: Rotational Movement Skills',
  'https://www.nsca.com/education/articles/kinetic-select/rotational-movement-skills/',
  'Crossover Step／Open Step／Drop Step',
);
export const bikeSource = material(
  'bike',
  'Concept2: Setting Up the BikeErg',
  'https://www.concept2.com/training/articles/setting-up-the-bikeerg',
  'How to Adjust the Saddle／Handlebars',
);
export const bandSource = material(
  'band',
  'NSCA: Resistance Band Training',
  'https://dxpprod.nsca.com/education/articles/kinetic-select/resistance-band-training/',
  'Resistance bands and cords／Fig. 6.12',
);
export const reactionSource = material(
  'reaction',
  'NSCA: 5 Reaction Drills to Build Quickness',
  'https://dxpprod.nsca.com/education/articles/kinetic-select/5-reaction-drills-to-build-quickness/',
  'Cone and shuffle drills',
);
export const stepSource = material(
  'step',
  'ACE: Step-up',
  'https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/',
  'Steps 1–4',
);
export const toolSources = [
  mechanicsSource,
  energySource,
  accelerationSource,
  rotationSource,
  bikeSource,
  bandSource,
  reactionSource,
  stepSource,
];

export const variedQuestions = [
  ...editionPractice('technique', 54, 'ex-tech-core', s.getup, [
    [
      3,
      '起き上がりの床の支持側',
      '左手でケトルベルを頭上に保持するターキッシュゲットアップの開始。座位へ移る段階で、床の支持に使う手はどちらか。',
      ['右手', '左手で器具を保持し、反対の手が床につく。'],
      ['左手', '負荷を支えている手を床につけるのではない。'],
      ['両手', '片手は器具の支持を続ける。'],
      '手を床に置く局面では、荷重を保持する手と床を押す手の役割を分ける。',
      'Movement Phases 1／Fig. 5.3 b–c',
    ],
    [
      3,
      'ゲットアップの荷重と支持の移行順',
      'ターキッシュゲットアップで床に片手を置いた座位に入った。次に膝を床に入れる空間を作るにはどれか。',
      ['床の手と曲げた脚の足で押し、腰を持ち上げる', '腰を上げることで膝を移す空間を確保する。'],
      ['床から手を先に外して腰を下ろす', '腰の下の空間を作れない。'],
      ['頭上の肘を曲げて器具を腰に置く', '頭上の保持が失われる。'],
      '座位から床支持を使って腰を上げ、それから半膝立ちに移る。',
      'Movement Phases 2–4／Fig. 5.3 d–f',
    ],
    [
      3,
      '戻りの局面を逆順で計画',
      'ターキッシュゲットアップの立位まで到達した。床まで戻る手順を決める考え方はどれか。',
      ['通ってきた各支持姿勢を逆順でたどる', '足、膝、手の支持を段階的に戻す。'],
      ['立位から直接あおむけに下りる', '支持の移行がなく安全な制御を失う。'],
      ['立位で器具を手放してから同じ反復を続ける', '負荷を保持した戻りの手順と異なる。'],
      '戻りは各支持姿勢の順を逆にし、安定を確認しながら進む。',
      'Movement Phase 5: reverse order',
    ],
  ]),
  ...editionPractice('technique', 57, 'ex-tech-squat', stepSource, [
    [
      2,
      '台上に先行足の足底を確実に置く',
      'ステップアップの第一歩で、右足は台の端に前足部だけ乗り、踵が外に出ている。上昇前に修正する位置はどれか。',
      ['足底を台上にしっかり置ける位置', '先行足の支持を確保する。'],
      ['先に後行足を床から離す位置', '不十分な先行足で支持を引き受ける。'],
      ['さらに前足部だけを端に寄せる位置', '支持条件が改善しない。'],
      '最初に台上の接地を作ってから、先行脚を使う。',
      'Step 2: leading foot firmly on deck',
    ],
    [
      2,
      '台上で反対脚の支持を外す進行を識別',
      '両足をそろえるステップアップを安定して行える人に、同じ高さと負荷で、上昇が終わった位置での安定を比較する。反対足へ荷重を逃がさず、その位置で観察するにはどの進行を選ぶか。',
      [
        '先行足で台に上がり、反対足を台につけずに短く止まってから下りる',
        '最上部で先行脚が支持を続けるため、片足で保持する様子を観察できる。',
      ],
      [
        '台に上がる前に床で先行足だけで短く止まり、台の上では両足をそろえる',
        '床での保持は見られるが、評価したい台上では反対足も支持に参加する。',
      ],
      [
        '台上で両足をそろえて短く止まり、反対足を台から離したらすぐに下りる',
        '下り始めの支持は片足になるが、停止中は両足で支えている。',
      ],
      '片足支持が現れる時点をそろえる。上昇の完了位置で反対足を置かずに止まることで、床での保持や下降時の片足支持と分けて評価できる。',
      'Step 4: single-leg pause',
    ],
  ]),
  ...editionPractice('technique', 59, 'ex-tech-mechanics', bandSource, [
    [
      1,
      '弾性帯の長さと張力の関係',
      '固定した抵抗帯を手で前方へ押すと、開始から終点まで伸びが増える。同じ帯と固定点なら、帯の張力は一般にどうなるか。',
      ['伸びるにつれて増える', '伸ばされた帯の戻ろうとする作用が大きくなる。'],
      ['腕が伸びるほど帯の張力は小さくなる', '伸びが増えている条件に反する。'],
      ['全域で一定になる', '固定質量の単純な重力とは負荷特性が異なる。'],
      '弾性帯の伸びは負荷曲線に影響する。関節の外部トルクには力の方向も関与する。',
      'Fig. 6.12: punches increase band tension',
    ],
    [
      1,
      '帯の色を共通重量に変換しない',
      'メーカーAとBの赤い抵抗帯には、どちらも「張力3 kgf」とある。ただしAは自然長の1.5倍、Bは2倍に伸ばしたときの表示で、自然長も異なる。張力が近いか確かめるにはどの比較が適切か。',
      [
        '両製品の張力表や実測値から、同じ伸長率での張力を比較する',
        '表示の測定条件が異なるため、自然長に対する伸びをそろえた張力を確認する。',
      ],
      [
        '各製品が指定する伸長条件の3 kgfを、そのまま同じ負荷として扱う',
        '表示値が等しくても、別々の伸長率で得た値は共通の条件を示さない。',
      ],
      [
        '帯を伸ばした後の全長を同じにし、その長さでの張力を比較する',
        '自然長が違うため、伸ばした後の全長が同じでも伸長率はそろわない。',
      ],
      '色と表示値に加え、どの製品をどの伸長率で測った値かを確認する。伸長率は自然長に対する伸びの割合である。',
      'Resistance Band Training：抵抗帯の色・形状と、伸長時の張力',
    ],
  ]),
  ...editionPractice('technique', 61, 'ex-tech-power', accelerationSource, [
    [
      3,
      '腰だけの屈曲と全身の前傾を識別',
      '加速ドリルで前傾を指示したら、腰だけを深く曲げ、頭が体幹から離れる姿勢になった。資料に沿う観察点はどれか。',
      ['支持脚から体幹・頭にかけておおむね揃った前傾', '腰だけで折れない姿勢を評価する。'],
      ['頭だけをさらに下げる', '腰折れと全身の向きは異なる。'],
      ['最初の数歩で後ろへ傾く', '線形加速の姿勢と異なる。'],
      '加速初期の前傾は、腰だけの屈曲で作らない。',
      'Posture: not achieved by flexing at the waist',
    ],
    [
      3,
      '加速時に手を正中線から外す',
      '正面から撮影すると加速時の腕が胸の前を大きく横切る。直線加速の腕振りとして何を調整するか。',
      ['前後方向を主体にし、手が正中を越えないようにする', '左右への余分な動きを抑える。'],
      ['交差をさらに大きくして体幹を回す', '資料が示す腕振りと異なる。'],
      ['両腕を横に固定する', '加速中の腕振りを失う。'],
      '手を正中の反対側へ大きく振らず、腕を前後へ使う。',
      'Arm Action: hands should not cross midline',
    ],
    [
      3,
      '加速の初回接地を短さだけで採点しない',
      '最初の一歩と加速が進んだ歩を比較する。最初の接地時間が長いことについて、どの説明が資料に沿うか。',
      ['最初が長く、その後短くなる傾向もある', '加速に伴って接地時間は変わる。'],
      ['最初が最も短いことが標準', '接地時間の傾向を逆にしている。'],
      ['全歩同じでなければ速度は変わらない', '歩ごとの条件は変わり得る。'],
      '加速の中では接地時間、歩幅、頻度が移行する。初回だけ短さを合否にしない。',
      'Leg Action: longest contact on first stride',
    ],
    [
      3,
      '初期加速の歩幅を段階別に評価',
      '加速開始から直ちに最大歩幅で走るよう指示した。資料に沿う修正はどれか。',
      ['初めは短く、加速に合わせて歩幅を伸ばす', '進行に伴う変化を評価する。'],
      ['初回を最長にして以降を短くする', '資料の記述と逆。'],
      ['速度が増しても全歩を同じ長さにする', '初期の移行を無視している。'],
      '初期は短い歩幅から入り、速度が上がるにつれて歩幅を広げる。',
      'Leg Action: stride length starts short',
    ],
  ]),
  ...editionPractice('technique', 65, 'ex-tech-power', rotationSource, [
    [
      3,
      '横向きの開きと180度の向き替えを区別',
      '相手に背を向けた守備者が、真後ろへ抜けたボールを追う。資料が示す素早い180度方向転換の第一歩はどれか。',
      ['ドロップステップ', '向きがほぼ反対の場合の切り替えに対応。'],
      ['正面のまま両脚垂直ジャンプ', '必要な方向へ向き直らない。'],
      ['上体を横に向けたまま前へ一歩だけ', '後方への向き替えを満たさない。'],
      '向いている方向と進みたい方向の関係から第一歩を選ぶ。',
      'Drop Step: facing directly opposite, 180-degree turn',
    ],
    [
      3,
      '回旋初動の後に加速と減速を置く',
      '横向きからのオープンステップでボールへ向かう。途中で走行距離が変わる課題で、第一歩以降に必要な練習はどれか。',
      ['第一歩の後に加速し、目標に合わせて減速する', '移動距離が変わる状況へ対応する。'],
      ['一歩目を開いたら静止だけを繰り返す', '加速と減速を扱わない。'],
      ['毎回同じ距離だけを止まらず走り抜ける', '目的地の変化に対応しない。'],
      '第一歩だけの型と、加速・減速を含む場面練習を分けて扱う。',
      'Open Step: movement sequence and uncertain distance',
    ],
  ]),
  ...editionPractice('technique', 67, 'ex-tech-cardio', bikeSource, [
    [
      2,
      'サドル高と前後位置が連動する設計',
      'BikeErgでサドルを上げると、独立した水平調整はしていないのに位置が後方へ移った。機種の設計に沿う説明はどれか。',
      ['支柱の設計で高さと前後位置が連動する', '後方への移動は設計に含まれる。'],
      ['ラチェットが壊れていると断定する', '高さに伴う移動は仕様の範囲。'],
      ['ペダルの取付け位置が後方へ動いたため', '説明されているのはサドル位置の変化。'],
      '機種によって、高さを変えると座面の前後関係も変わる。',
      'How to Adjust the Saddle: raising also moves rider back',
    ],
    [
      2,
      '踵試行と実際に漕ぐ足部を区別',
      'BikeErgの高さ確認で、踵を最下点のペダルへ置く静止確認を行った。実際に足の前部で漕ぐときの膝の目安はどれか。',
      ['最も伸びるところでも少し曲がる', '踵で確認する姿勢と実際のペダル位置が異なる。'],
      ['毎回最下点で膝を強く伸ばし切る', 'メーカーの漕動時の目安と異なる。'],
      ['足の前部でも踵の確認と同じ関節角度を強制する', '接触部位が変わることを無視している。'],
      '高さ合わせでは踵で静止確認し、実際の漕動では前足部を使って最大伸展時に軽い屈曲を残す。',
      'Recommendations for Saddle Position: heel vs ball of foot',
    ],
    [
      2,
      'ハンドル前後と上下の操作を区別',
      'BikeErgでハンドルの高さは合うが、遠さだけを調整したい。メーカー説明の機構はどれか。',
      ['モニターを支える水平アーム側の前後調整', '上下とは別の調整ノブである。'],
      ['サドルの高さのラチェットだけ', 'ハンドル前後は直接変わらない。'],
      ['ダンパーの数値を一段変える', '空気抵抗の設定でハンドル位置は変わらない。'],
      '高さ、前後、サドルを別々に調整できる。調整後の固定を確認する。',
      'How to Adjust the Handlebars: fore/aft knob',
    ],
  ]),
];
