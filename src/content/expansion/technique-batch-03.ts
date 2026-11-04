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
    [17, 18, 21].includes(item.number) ? '2026-11-04T12:35:50Z' : '2026-11-04T12:09:09Z',
  );
export const sources: Source[] = [
  {
    id: 'ex-tech-bench',
    title: 'NSCAジャパン：ベンチプレス種目説明_WL実技検定',
    url: 'https://nsca-japan.or.jp/pdf/education/wl-test/wl_test_basic_benchpress.pdf',
    edition: '公開実技検定資料（版・改訂日記載なし）',
    checkedAt,
    locator: '全3頁。p.2開始・下降、p.3上昇・ラックへの復帰',
  },
  {
    id: 'ex-tech-tsac',
    title: 'NSCA: Exercise Technique Modules 3.0–3.3',
    url: 'https://www.nsca.com/contentassets/24f7e187e9aa4a588439c9612231c7fd/tsac-module-3.0--3.3.pdf',
    edition: 'Essentials of Tactical Strength and Conditioning Exam Prep Online (2013)',
    checkedAt,
    locator: 'Module 3.1 pp.3–8、3.2 pp.6–7、3.3 pp.4–5',
    note: '公開資料の原則を参照。古い一律の膝位置・可動域、予防効果の断定は採用しない。原典の図・設問を転載しない。',
  },
  {
    id: 'ex-tech-pulldown',
    title: 'NASM: The Biomechanics of the Lat Pulldown: Muscles, Grips, and Form',
    url: 'https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form',
    edition: 'Brian Sutton、2021公開・2026-07-21更新',
    checkedAt,
    locator:
      'Primary Muscle / More Than a Lat Exercise / Coaching the Movement / Common Compensations',
    note: '技術の公開本文を参照。NASM独自のプログラム段階をNSCAの規定として扱わない。',
  },
];
export const units: Unit[] = [
  {
    id: 'ex-tech-upper',
    domainId: 'technique',
    title: 'プレスとプルの支持・軌道',
    subtitle: '手首、体幹、肩甲帯と戻し動作を観察する',
    minutes: 20,
    level: '応用',
    objectives: [
      { id: 'ex-tech-upper-o1', text: 'プレス動作の保持・支持とラックへ戻すまでの制御を確認する' },
      { id: 'ex-tech-upper-o2', text: 'ラットプルダウンの設定・軌道・肩甲帯の動きを説明する' },
      { id: 'ex-tech-upper-o3', text: '引く動作の共同作用と下降・復帰局面の制御を評価する' },
    ],
    sections: [
      {
        title: 'バーと前腕の位置関係',
        body: 'ベンチプレスでは手首を過度に反らすのではなく、バーを保持する手と前腕の位置関係を確認する。握り幅は身体の特性と姿勢を踏まえて調整する。反復終了後も、バーがラックへ戻って静止するまでは保持を続ける。',
      },
      {
        title: '座ったプレスでも体幹を観察する',
        body: '座位のショルダープレスでも、負荷を上げるために臀部が支持面から離れたり腰の反りが増えたりすれば、開始姿勢の制御を再確認する。器具に座っていることだけを姿勢が保てている証拠にはしない。',
      },
      {
        title: 'ラットプルダウンは設定から',
        body: '足を床につけ、大腿パッドで姿勢を支えられる設定を確認する。わずかな後傾と、反復ごとに大きく身体を振る動きは区別する。バーは上胸部へ向かって引き、頭を前へ突き出して首の後ろへ通すことを一般的な目的にしない。',
      },
      {
        title: '肩甲帯と復帰局面も見る',
        body: '肩をすくめ続けず、肘を身体の側へ運ぶ指示などを使いながら、肩甲帯と上腕の動きを確認する。広背筋を狙う動作でも肘を曲げる筋などが共同する。引いた局面だけでなく、負荷を戻すときも反動に任せず制御する。',
      },
    ],
    example: {
      situation:
        'ラットプルダウンで大腿がパッドから浮き、体幹を大きく振るときだけ設定回数を達成できる。',
      judgment:
        '回数だけを成功の基準にせず、パッド設定・足の接地・負荷を見直し、体幹を安定させて反復できる条件を選ぶ。',
    },
    terms: [
      { term: '肩甲帯', meaning: '鎖骨と肩甲骨を含み、上肢の位置や動きを支える構造。' },
      { term: '共同作用', meaning: '狙う筋だけでなく、他の筋も動作や姿勢保持に加わること。' },
      { term: '復帰局面', meaning: '負荷を開始位置へ戻す局面。勢い任せにせず観察する。' },
    ],
    sourceRefs: [
      ref('ex-tech-bench', 'pp.2–3'),
      ref('ex-tech-tsac', 'Module3.2 p.7 / PDFp.20'),
      ref('ex-tech-pulldown', 'Coaching the Movement / Common Compensations'),
    ],
  },
];
export const questions = [
  q({
    number: 17,
    unit: 'ex-tech-upper',
    objective: 1,
    context: 'image',
    prompt:
      '自作のベンチプレス模式図では、前腕の鉛直線からバーが外れ、手首が強く反っている。図で確認したい保持上の関係はどれか。',
    options: [
      [
        '左右の握り幅が同じかを確認し、その幅が対称なら保持の修正を終える',
        '左右対称な握りと、手首・前腕に対するバーの位置は別の確認項目である。',
      ],
      [
        '肘が十分に伸びたかを確認し、バーと前腕の線のずれは終了位置で再確認する',
        '肘の伸展の確認へ焦点を移しており、図の保持位置の修正を先送りしている。',
      ],
      [
        '手首を過度に反らさず、バーと前腕の位置関係を確認する',
        '資料が示す手首の固定と前腕の向きに対応する。',
      ],
    ],
    answer: 2,
    explanation:
      '握りの左右差、肘の伸展、バーと前腕の位置関係は別の観察である。この図が示す手首の位置を直接確認する。',
    refs: [ref('ex-tech-bench', 'p.2②、p.3③と手首・前腕の図')],
  }),
  q({
    number: 18,
    unit: 'ex-tech-upper',
    objective: 1,
    prompt:
      'ベンチプレスのラックへの戻しを観察する。セット中の反復回数とは別に、手を離してよい終了条件はどれか。',
    options: [
      [
        'バーをラックへ戻し、静止したことを確認するまで保持する',
        'セット後も、バーが静止するまで手を離さないという手順に対応する。',
      ],
      [
        '左右のラックへの接触を確認した時点とし、小さな揺れが残っていても保持を終える',
        '接触と静止は異なる。資料はバーの静止まで保持する条件を示す。',
      ],
      [
        '最終反復で肘が伸びた時点とし、ラックへの戻しは別の動作として終了条件から除く',
        '反復の上昇終了と、バーを置いて手を離す条件を混同している。',
      ],
    ],
    answer: 0,
    explanation:
      '最終反復の終了、ラックへの接触、ラック上での静止を区別する。終了操作までが技術である。',
    refs: [ref('ex-tech-bench', 'p.3③最終箇条書き')],
  }),
  q({
    number: 19,
    unit: 'ex-tech-upper',
    objective: 1,
    prompt:
      '座位ショルダープレスで、軽い重量では体幹が安定しているが、増量後は臀部が浮き、腰の反りで押し上げている。技術練習を続ける条件として適切なのはどれか。',
    options: [
      [
        '座っているので臀部と体幹の変化は確認しなくてよい',
        '座位でも支持と体幹の制御は観察対象になる。',
      ],
      [
        '支持と体幹を保てる負荷へ戻し、押す動作を再確認する',
        '資料の開始姿勢保持と、臀部浮き・腰の反りというエラーに対応する。',
      ],
      [
        '反りを増やすほど、肩の押す動作を正確に評価できる',
        '別の身体動作が増え、狙う技術の評価をむしろ難しくする。',
      ],
    ],
    answer: 1,
    explanation:
      '器具の種類ではなく、実際に保てている支持と姿勢を確認する。既に安定していた条件へ戻して観察できる。',
    refs: [ref('ex-tech-tsac', 'Module3.2 p.7 / PDFp.20：Seated Barbell Shoulder Press')],
  }),
  q({
    number: 20,
    unit: 'ex-tech-upper',
    objective: 2,
    prompt:
      'ラットプルダウンで、引くたびに大腿がパッドから浮き、身体全体を後ろへ振っている。設定と動作を見直す順序として適切なのはどれか。',
    options: [
      ['パッドをさらに上げ、浮く動きを大きくする', '大腿を安定させる設定から離れる。'],
      [
        '回数を達成できていれば、パッドと体幹は記録しない',
        '目的と異なる反動を使っている可能性を確認できない。',
      ],
      [
        '大腿パッドと足の接地を確認し、体幹を安定させられる負荷を選ぶ',
        '機器の設定と動作の制御を合わせて見直す。',
      ],
    ],
    answer: 2,
    explanation:
      '体幹のわずかな後傾と、大きく振る反動を区別する。引く前の設定が維持できるかも確認する。',
    refs: [ref('ex-tech-pulldown', 'Coaching the Movement / Common Compensations')],
  }),
  q({
    number: 21,
    unit: 'ex-tech-upper',
    objective: 2,
    prompt:
      '一般成人のラットプルダウンで、バーを首の後ろへ通すため頭を前へ出している。標準的な前方へのプルダウンを練習する際、上体の反動を増やさずに軌道を修正する方法はどれか。',
    options: [
      [
        '頭を突き出して通す動きから、上胸部へ引く制御された軌道へ変更する',
        '参照資料の前方へ引く方法と代償動作の回避に対応する。',
      ],
      [
        'バーの到達点を腹部へ下げ、上体を後ろへ倒す量で到達を合わせる',
        '上胸部への軌道から外れ、上体の動きで引く距離を作る変更になっている。',
      ],
      [
        '首の後ろへの軌道を残し、到達するまでの速度だけをゆっくりにする',
        '速度は変わるが、今回共有する前方への軌道と頭部位置の修正には対応しない。',
      ],
    ],
    answer: 0,
    explanation:
      '軌道、頭の位置、上体の反動を分けて確認する。ゆっくり動かすことだけでは、異なる軌道が同じ課題になるわけではない。',
    refs: [
      ref('ex-tech-pulldown', 'Coaching the Movement / Common Compensations、FAQ behind-the-neck'),
    ],
  }),
  q({
    number: 22,
    unit: 'ex-tech-upper',
    objective: 3,
    difficulty: 3,
    prompt:
      '利用者が「広背筋を狙うラットプルダウンなのに上腕にも疲労を感じた。上腕が働いたら必ず失敗か」と質問した。動作分析として適切なのはどれか。',
    options: [
      [
        '一つの筋を狙う種目では、他の筋の活動は起こらない',
        '多関節運動での共同作用を否定している。',
      ],
      [
        '肘の屈曲には上腕の筋も共同するため、疲労感だけで失敗としない',
        '狙う筋と共同する筋を区別し、フォーム等も合わせて判断する。',
      ],
      [
        '上腕が疲れたという申告だけで、広背筋の活動量を数値化する',
        '主観的な疲労感から筋活動量の数値は算出できない。',
      ],
    ],
    answer: 1,
    explanation:
      '狙う筋だけが働くとは限らない。一方、主に腕だけで引く代償がないかは、実際の動作を別に観察する。',
    refs: [ref('ex-tech-pulldown', 'More Than a Lat Exercise / Common Compensations')],
  }),
  q({
    number: 23,
    unit: 'ex-tech-upper',
    objective: 2,
    prompt:
      'パッドと体幹は安定したラットプルダウンで、肩が耳へ近づくようにすくみ続けている。次に用いる指導の焦点として適切なのはどれか。',
    options: [
      ['引く方向に関係なく、肩を耳へ近づけ続ける', '観察された肩すくみをさらに強める。'],
      [
        '足の接地を外し、肩の動きを調整する',
        '安定していた設定を崩しても、肩甲帯の動きの確認にはならない。',
      ],
      [
        '肩を耳から離す動きと、肘を身体の側へ運ぶ動きを確認する',
        '資料の肩甲帯と肘のコーチングに対応する。',
      ],
    ],
    answer: 2,
    explanation:
      '安定している条件は保ち、次に観察された肩甲帯の動きへ焦点を移す。すべての問題を負荷重量だけで説明しない。',
    refs: [
      ref(
        'ex-tech-pulldown',
        'Coaching the Movement：shoulders away from ears / elbows toward ribs',
      ),
    ],
  }),
  q({
    number: 24,
    unit: 'ex-tech-upper',
    objective: 3,
    difficulty: 3,
    prompt:
      'ラットプルダウンの引く局面は安定しているが、復帰時は手を上へ引かれるままにし、ウエイトが勢いよく戻る。評価として適切なのはどれか。',
    options: [
      [
        '引く局面と分けて復帰局面の速度と制御を見直す',
        '参照資料は動作の両方向で制御することを求めている。',
      ],
      [
        '引く局面がよければ、復帰局面は評価対象外とする',
        '反復の半分に残った制御の課題を見落とす。',
      ],
      [
        '引く局面まで同じ速さで反動を加えてそろえる',
        '両方向を制御するのではなく、制御されていない動きを増やしている。',
      ],
    ],
    answer: 0,
    explanation: '一つの反復を局面別に観察する。引くことができても、戻す局面まで適切とは限らない。',
    refs: [ref('ex-tech-pulldown', 'Coaching the Movement：control both directions')],
  }),
];
export const media: TechniqueMedia = {
  'ex-tech-017': {
    kind: 'diagram',
    assetId: 'ex-tech-bench-stack',
    caption: '自作の保持模式図。バー、手首、前腕の位置関係のみを示し、肩関節の診断には使わない。',
    alt: 'ベンチプレス保持の拡大模式図。手首が反り、バーが肘と前腕の鉛直線からずれている。足や肩の情報は省略。',
  },
};
