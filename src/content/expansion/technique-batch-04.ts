import type { Source, Unit } from '../../domain/types';
import {
  checkedAt,
  ref,
  techniqueQuestion,
  type TechniqueItem,
  type TechniqueMedia,
} from './technique-batch-shared';
const q = (item: TechniqueItem) =>
  techniqueQuestion(item, item.number === 28 ? '2026-11-04T12:35:50Z' : '2026-11-04T12:11:44Z');
export const sources: Source[] = [
  {
    id: 'ex-tech-birddog',
    title: 'American Council on Exercise: Bird-dog',
    url: 'https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/',
    edition: 'Exercise Library公開Web版（更新日記載なし）',
    checkedAt,
    locator: 'Steps 1–7、特に4–6の対側肢・骨盤肩の制御・挙上範囲',
  },
  {
    id: 'ex-tech-plank',
    title: 'American Council on Exercise: Front Plank',
    url: 'https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/',
    edition: 'Exercise Library公開Web版（更新日記載なし）',
    checkedAt,
    locator: 'Steps 1–3、呼吸継続と腰痛時の中止注記',
  },
  {
    id: 'ex-tech-pushup',
    title: 'American Council on Exercise: Push-up',
    url: 'https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/',
    edition: 'Exercise Library公開Web版（更新日記載なし）',
    checkedAt,
    locator: 'Steps 2–4：体幹・頭部の配列、下降と上昇',
  },
  {
    id: 'ex-tech-suspension',
    title: 'NSCA: Suspension Training',
    url: 'https://www.nsca.com/education/articles/kinetic-select/suspension-training/',
    edition: '2022年7月、Strength Training, 2nd ed.の公式公開抜粋',
    checkedAt,
    locator: '本文：身体角度と強度、プランク、固定箇所と転倒の注意',
  },
];
export const units: Unit[] = [
  {
    id: 'ex-tech-core',
    domainId: 'technique',
    title: '体幹と自重動作の制御',
    subtitle: '大きく動かすことと、動かさずに支えることを区別する',
    minutes: 20,
    level: '応用',
    objectives: [
      { id: 'ex-tech-core-o1', text: 'バードドッグで四肢の運動と体幹の制御を区別する' },
      { id: 'ex-tech-core-o2', text: 'プランクの姿勢・呼吸・症状を確認し、保持条件を選ぶ' },
      {
        id: 'ex-tech-core-o3',
        text: '自重プッシュとサスペンションの支持・角度による要求を説明する',
      },
    ],
    sections: [
      {
        title: '四肢は動かし、体幹は制御する',
        body: 'バードドッグでは、たとえば左股関節を伸展しながら右肩を屈曲させ、対側の腕と脚を挙げる。その間も骨盤や肩を大きく傾けず、腰の位置を管理する。四肢の高さは最大を目指すのではなく、体幹を制御できる範囲で決める。横からの腰の反りと、後ろから見た骨盤の回旋は別の観察項目である。骨盤を横切る軽い棒などの水平な目印や鏡を使うと、左右の高さの変化を本人へ示す補助になる。目印は強く押さえつける器具ではなく、観察のためのフィードバックである。',
      },
      {
        title: 'プランクは秒数だけで評価しない',
        body: '肘と肩の位置、体幹・下肢の配列を整え、保持中も呼吸を続ける。腰が沈む、臀部が大きく上がるなどの変化を無視して長時間を達成することを目的にしない。腰部の痛みがあれば中止し、医療者へ相談する。',
      },
      {
        title: 'プッシュアップは身体全体の移動',
        body: '胸だけ先に動かす、頭だけを床へ近づける、腰を落として回数を増やす、といった動きと、体幹と頭部を保って上下する反復を区別する。上昇と下降の両方で同じ観察項目を使う。',
      },
      {
        title: '自重でも支持条件で要求は変わる',
        body: 'サスペンションを使うプッシュでは、身体を立てた姿勢から水平に近づけると要求が増す。姿勢の角度や支持の安定性を記録して比較する。器具は体重を支えられる固定点と、滑りや転倒のない構造へ設置する必要があり、自作図を設置の安全保証には用いない。',
      },
    ],
    example: {
      situation: 'バードドッグで脚を高く上げようとすると腰が反るが、低い位置なら体幹を保てる。',
      judgment:
        '脚の高さより体幹の制御を優先し、保てる範囲へ戻す。腰の形が変わった原因を、特定筋の弱さだけで断定しない。',
    },
    terms: [
      { term: '対側', meaning: '右腕と左脚など、身体の反対側の組合せ。' },
      {
        term: 'ブレーシング',
        meaning: '体幹の姿勢を保つため腹部などの筋を働かせること。呼吸停止と同義ではない。',
      },
      {
        term: 'サスペンション',
        meaning: '固定したストラップ等に手や足を支え、自重を利用する方法。',
      },
    ],
    sourceRefs: [
      ref('ex-tech-birddog', 'Steps4–6'),
      ref('ex-tech-plank', 'Steps1–3と腰痛注'),
      ref('ex-tech-pushup', 'Steps2–4'),
      ref('ex-tech-suspension', '本文の角度・固定箇所の説明'),
    ],
  },
];
export const questions = [
  q({
    number: 25,
    unit: 'ex-tech-core',
    objective: 1,
    context: 'video',
    prompt:
      '自作のバードドッグ連続図で、Bでは腰の形を保てるが、四肢をさらに高く上げたCでは腰の反りが増えている。体幹を制御する練習として選ぶ調整はどれか。',
    options: [
      [
        '腰の反りが増えたCを、四肢が高いという理由で成功とする',
        '四肢の高さを優先し、練習目的の体幹制御を評価していない。',
      ],
      [
        'Bのように腰の位置を保てる挙上範囲へ戻す',
        'ACEは腰部を制御できる高さに四肢の挙上を限定している。',
      ],
      ['四肢の高さを維持するため、さらに腰を反らす', '観察された制御の変化を増やす。'],
    ],
    answer: 1,
    explanation:
      'バードドッグの目的に合わせ、四肢の高さと体幹の制御を別に評価する。腰の変化だけで原因や病名を確定しない。',
    refs: [ref('ex-tech-birddog', 'Step6、末尾の制御能力の注')],
  }),
  q({
    number: 26,
    unit: 'ex-tech-core',
    objective: 1,
    prompt:
      '基本のバードドッグを「左股関節を伸展し、対側上肢を挙上する」と記録した。動かす上肢と、その主な肩関節運動の組合せはどれか。',
    options: [
      ['左上肢の肩伸展', '左脚の対側ではなく、肩を後ろへ動かす記述にもなっている。'],
      ['左上肢の肩屈曲', '肩の運動は対応するが、同側の上肢を指定している。'],
      ['右上肢の肩屈曲', '左股関節伸展と右肩屈曲という資料の対側組合せに対応する。'],
    ],
    answer: 2,
    explanation: '対側の意味と関節運動の用語を組み合わせて、指導と記録を一致させる。',
    refs: [ref('ex-tech-birddog', 'Steps4–5：left hip / right arm shoulder flexion')],
  }),
  q({
    number: 27,
    unit: 'ex-tech-core',
    objective: 1,
    difficulty: 3,
    prompt:
      'バードドッグを後方から観察すると、脚を上げた側の骨盤が大きく持ち上がる。腰に痛みはない。骨盤の回旋を確認するためのフィードバックとして適切なのはどれか。',
    options: [
      [
        '骨盤を横切る水平な目印を用い、左右の高さの変化を本人と確認する',
        'ACEは骨盤の回旋を可視化する目印によるフィードバックを示している。',
      ],
      ['脚の高さだけを測り、骨盤の位置は見ない', '確認したい回旋や左右の変化を評価できない。'],
      [
        'この観察だけで骨盤の構造異常があると伝える',
        '動作時の変化から構造的な病態を確定している。',
      ],
    ],
    answer: 0,
    explanation:
      '観察したい動きに合う方向と目印を選ぶ。フィードバックは修正の助けであり、医療的な診断とは別である。',
    refs: [ref('ex-tech-birddog', 'Step4：hips parallel、light barによるvisual feedback')],
  }),
  q({
    number: 28,
    unit: 'ex-tech-core',
    objective: 2,
    prompt:
      '前腕支持の基本プランクでは姿勢を保てるが、呼吸の合図を入れると下腹部を緩めて腰が落ちる。ACEの手順に沿って、姿勢と呼吸の両立を確かめる指示はどれか。',
    options: [
      [
        '呼気の間だけ体幹を固め、吸気のたびに腹部を緩めて保持時間を数える',
        '呼吸は続くが、保持局面の体幹の形を継続して保つ条件と異なる。',
      ],
      ['体幹を保ちながら呼吸を続ける', '姿勢の保持と呼吸の継続を両立する指示である。'],
      [
        '上げる前に吸い、保持中は息を止め、床へ戻ってから次の呼吸を行う',
        '挙上前後の呼吸だけでは、保持しながら呼吸を続ける手順に対応しない。',
      ],
    ],
    answer: 1,
    explanation:
      '保持中の体幹の制御と呼吸を同時に確認する。吸う局面で姿勢を緩める方法や、動作の前後だけに呼吸する方法とは区別する。',
    refs: [
      ref(
        'ex-tech-plank',
        'Step1：stiffen torso、Step2：maintaining stiff torso / continue to breathe',
      ),
    ],
  }),
  q({
    number: 29,
    unit: 'ex-tech-core',
    objective: 2,
    prompt:
      'プランク開始直後に腰部の痛みを訴えた。本人は「予定の60秒だけ我慢して続ける」と言う。参照資料に沿う対応はどれか。',
    options: [
      ['60秒を完了するまでは痛みを評価しない', '資料の腰痛時の中止注記と逆である。'],
      ['痛みを感じる姿勢のまま追加セットを行う', '症状を無視して同じ負荷を繰り返す対応である。'],
      [
        'その運動を中止し、医療者への相談につなげる',
        'ACEはこの動作で腰部に痛みがあれば中止し医師へ相談するよう記している。',
      ],
    ],
    answer: 2,
    explanation:
      '時間目標より症状への対応を優先する。トレーナーが図や痛みの申告だけで原因を診断して治療を指示するものではない。',
    refs: [ref('ex-tech-plank', 'Step3直後の腰痛時注記')],
  }),
  q({
    number: 30,
    unit: 'ex-tech-core',
    objective: 2,
    difficulty: 3,
    prompt:
      'プランクを30秒までは体幹を保って呼吸できるが、その後は腰が沈み、息も止まる。今回は「姿勢と呼吸を保った保持」を記録したい。適切な記録と次の調整はどれか。',
    options: [
      [
        '形が変わる前までの保持を記録し、条件を保てる時間から練習する',
        '記録する能力と観察基準を一致させている。',
      ],
      [
        '腰が沈んでからも合計時間だけを延ばし、同じ質の保持と記録する',
        '姿勢と呼吸の基準を外れた時間まで同一の達成として扱う。',
      ],
      [
        '姿勢に関係なく、60秒を超えれば医療的に安全と判定する',
        '時間から個人の安全性を保証する根拠はない。',
      ],
    ],
    answer: 0,
    explanation:
      '保持時間は、どの条件を保った時間かと合わせて解釈する。秒数だけでは動作の質を表せない。',
    refs: [ref('ex-tech-plank', 'Steps1–3：体幹・下肢の保持と呼吸')],
  }),
  q({
    number: 31,
    unit: 'ex-tech-core',
    objective: 3,
    context: 'video',
    prompt:
      '自作のプッシュアップ連続図では、上昇時に胸だけが先に上がり、骨盤が低いまま残っている。修正する動作の焦点はどれか。',
    options: [
      ['顎だけを上げ、身体全体の位置は確認しない', '胸と骨盤の動きのずれを修正していない。'],
      [
        '体幹と頭部の配列を保ち、身体全体を制御して押し上げる',
        'ACEの上昇・下降を通じた体幹と頭部の保持に対応する。',
      ],
      [
        '骨盤をさらに低く残せば、同じ条件の反復として回数を増やせる',
        '制御できていない動きをさらに増やす判断である。',
      ],
    ],
    answer: 1,
    explanation:
      'プッシュアップでは胸の移動だけを数えず、体幹を含む身体の動きを観察する。図の変化から特定筋の弱さを断定しない。',
    refs: [ref('ex-tech-pushup', 'Steps2–4：rigid torso、head alignment')],
  }),
  q({
    number: 32,
    unit: 'ex-tech-core',
    objective: 3,
    difficulty: 3,
    prompt:
      '安全に固定された同じサスペンションでプッシュを行う。身体をほぼ立てた位置では制御できるが、より水平に近づけると保持が難しくなる。自重が同じでも難度が変わる説明として適切なのはどれか。',
    options: [
      [
        '体重が変わらない限り、身体の角度で要求は変わらない',
        'サスペンションでは身体の角度が要求を調整する条件になる。',
      ],
      [
        '水平に近づくと、支持のために必要な要求は必ず消える',
        '公式抜粋が示す角度と要求の関係に反する。',
      ],
      [
        '身体の角度と支持条件が変わるため、自重でも要求は変化する',
        '直立に近い姿勢と水平に近い姿勢を区別している。',
      ],
    ],
    answer: 2,
    explanation:
      '器具や体重だけで練習条件を比較しない。角度と制御できた姿勢を記録し、本人の能力に合わせる。',
    refs: [ref('ex-tech-suspension', '本文第2–3段落：body angles / push-ups')],
  }),
];
export const media: TechniqueMedia = {
  'ex-tech-025': {
    kind: 'sequence',
    assetId: 'ex-tech-birddog-range',
    caption:
      '自作模式アニメーション。実写ではなく、原因診断や個人評価の保証には使わない。四肢を上げる高さと腰の形を比較する。',
    alt: '側面3コマ。A四つ這い、B対側の腕脚を低く伸ばして腰の形を保持、Cさらに高く上げて腰の反りが増える。',
  },
  'ex-tech-031': {
    kind: 'sequence',
    assetId: 'ex-tech-pushup-body',
    caption:
      '自作模式アニメーション。実写ではなく、原因診断や個人評価の保証には使わない。胸と骨盤の移動のずれだけを観察する。',
    alt: 'プッシュアップ側面の2コマ。下降位置から上昇時に胸は上がるが骨盤が低いまま残り、腰が沈む。',
  },
};
