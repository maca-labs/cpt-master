import type { Source, Unit } from '../../domain/types';
import {
  checkedAt,
  ref,
  techniqueQuestion,
  type TechniqueItem,
  type TechniqueMedia,
} from './technique-batch-shared';
const q = (item: TechniqueItem) => techniqueQuestion(item, '2026-11-04T12:26:20Z');
export const sources: Source[] = [
  {
    id: 'ex-tech-torque',
    title: 'OpenStax: College Physics 2e — 9.2 The Second Condition for Equilibrium',
    url: 'https://openstax.org/books/college-physics-2e/pages/9-2-the-second-condition-for-equilibrium',
    edition: '第2版、2022-07-13公開',
    checkedAt,
    locator: '§9.2 Torque、式9.3–9.6：垂直な力の腕と符号付きモーメントの和',
    note: '定義・力学の事実を照合。図・例題・本文は転載せず、独自の抽象モデルと数値を作成。姿勢から傷害を推定する用途には使わない。',
  },
  {
    id: 'ex-tech-work',
    title: 'OpenStax: College Physics 2e — 7.1 Work: The Scientific Definition',
    url: 'https://openstax.org/books/college-physics-2e/pages/7-1-work-the-scientific-definition',
    edition: '第2版、2022-07-13公開',
    checkedAt,
    locator: '§7.1 What It Means to Do Work、式7.1–7.3と静止荷物の説明',
    note: '一定力と変位の方向、対象物への仕事を参照。図・例題・本文は転載せず、独自の数値とケースを作成。',
  },
  {
    id: 'ex-tech-power-formula',
    title: 'NSCAジャパン：パワーについて考えてみましょう！',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1921/',
    edition: '2024-09-27公開',
    checkedAt,
    locator: 'パワーの定義：P=W/t、P=F×v、移動がない運動の説明',
    note: '力と移動が同方向の単純化条件で式を使用。特定競技の比較数値や全身代謝量へ拡張しない。',
  },
];
export const units: Unit[] = [
  {
    id: 'ex-tech-mechanics',
    domainId: 'technique',
    title: '力の腕・仕事・パワーの使い分け',
    subtitle: '模式図の距離と計算の対象を読み分ける',
    minutes: 20,
    level: '応用',
    foundation: 'バイオメカニクス',
    objectives: [
      {
        id: 'ex-tech-mechanics-o1',
        text: '力の作用線への垂直距離を使い、モーメントとつり合いを計算する',
      },
      {
        id: 'ex-tech-mechanics-o2',
        text: '対象物への仕事と、その平均パワーを条件に合わせて求める',
      },
      { id: 'ex-tech-mechanics-o3', text: '外部への機械的な出力と、筋の努力・代謝を区別する' },
    ],
    sections: [
      {
        title: '力の腕は作用線までの垂直距離',
        body: '同じ力でも、回転中心から力の作用線までの垂直距離が変わるとモーメントが変わる。作用点までの斜めの距離を、そのまま力の腕に置き換えない。計算では回転中心と力の方向を先に定める。',
      },
      {
        title: 'つり合いは向きと対象をそろえる',
        body: '回転方向が逆のモーメントには逆の符号を付け、同じ点のまわりで合計する。回転のつり合いだけでなく、力のつり合いも静止の条件になる。ここで使う単純な棒のモデルは、実際の関節内の力や組織の安全性を測定したものではない。',
      },
      {
        title: '仕事では力と変位の方向を見る',
        body: '一定の力が変位と同方向なら、対象物への仕事は力と移動距離の積で求める。力の向きと移動が逆ならその力による仕事は負になる。同じニュートンメートルの次元でも、回転を扱うモーメントとエネルギー移動を扱う仕事を混同しない。',
      },
      {
        title: 'パワーの比較と静止の解釈',
        body: '平均パワーは仕事を要した時間で割る。同じ仕事を短い時間で行えば平均パワーは大きい。負荷を動かさず保持したとき、その負荷への外部の機械的仕事はゼロでも、筋の努力やエネルギー消費までゼロになるわけではない。',
      },
    ],
    example: {
      situation:
        '同じ重さの器具を持つ位置を変えたところ、関節の回転中心から力の作用線までが遠くなった。',
      judgment:
        '重量だけで負担が同じとせず、力の腕を確認する。単純モデルの計算値を、そのまま本人の関節内部の力や傷害リスクとして表示しない。',
    },
    terms: [
      { term: '力の腕', meaning: '回転中心から力の作用線までの最短の垂直距離。' },
      { term: 'モーメント', meaning: 'ある点のまわりで力が生む回転の作用。単位はN·m。' },
      { term: '仕事', meaning: '力の変位方向の成分と変位の積で表すエネルギー移動。単位はJ。' },
      { term: '平均パワー', meaning: '仕事を経過時間で割った仕事率。単位はW。' },
    ],
    sourceRefs: [
      ref('ex-tech-torque', '§9.2 Torque、式9.3–9.6'),
      ref('ex-tech-work', '§7.1 定義と静止荷物の説明'),
      ref('ex-tech-power-formula', 'パワーの定義'),
    ],
  },
];
export const questions = [
  q({
    number: 57,
    unit: 'ex-tech-mechanics',
    objective: 1,
    context: 'image',
    difficulty: 3,
    prompt:
      '自作図は回転中心Oと下向き100Nの力を示す。Oから作用点への斜距離は0.50m、力の作用線までの垂直距離は0.30mである。この力のOまわりのモーメントの大きさはどれか。',
    options: [
      ['50N·m', '作用点までの斜距離をそのまま掛けており、力の腕を取り違えている。'],
      ['30N·m', '100N×0.30mで求める。回転中心から作用線への垂直距離を使う。'],
      ['20N·m', '斜距離から垂直距離を引いた0.20mは、力の腕ではない。'],
    ],
    answer: 1,
    explanation:
      '作用点の距離と、作用線までの垂直距離を区別する。ここでは与えられた外力による抽象モデル上の値だけを求めている。',
    refs: [ref('ex-tech-torque', '§9.2 式9.4–9.5、perpendicular lever armの定義')],
  }),
  q({
    number: 58,
    unit: 'ex-tech-mechanics',
    objective: 1,
    difficulty: 3,
    prompt:
      '重さを無視できる棒を静止させる抽象モデルで、50Nの外力の腕は0.40m、逆向きの回転作用を生む別の力の腕は0.04mとする。他のモーメントはない。この別の力はいくら必要か。',
    options: [
      ['50N', '力の大きさだけをそろえ、力の腕が10倍異なる条件を反映していない。'],
      ['5N', '腕が短い側で必要な力が小さくなるよう、比を逆にしている。'],
      ['500N', '50×0.40=20N·mを0.04mで割り、逆向きの20N·mをつくる。'],
    ],
    answer: 2,
    explanation:
      '力のつり合いを支える支点反力もあるとする。計算対象は回転のつり合いであり、この500Nを実際の筋力・関節内力の測定値として扱わない。',
    refs: [ref('ex-tech-torque', '§9.2 式9.5–9.6、逆向きのモーメントの符号とつり合い')],
  }),
  q({
    number: 59,
    unit: 'ex-tech-mechanics',
    objective: 1,
    difficulty: 3,
    prompt:
      '同じ回転中心のまわりに、時計回り120N×0.20mと、反時計回り80N×0.30mのモーメントだけが作用する。支点反力を含む力のつり合いは別途満たす。この2つのモーメントの合計はどれか。',
    options: [
      ['0N·m', '向きは逆で大きさはどちらも24N·mなので、符号付きの和はゼロになる。'],
      ['48N·m', '逆向きの作用を同じ符号で足している。'],
      ['8N·m', '40Nの力の差に一方の腕0.20mだけを掛けており、各モーメントを求めていない。'],
    ],
    answer: 0,
    explanation:
      '力の大きさが違っても、力の腕との積が等しく逆向きなら回転の作用はつり合う。共通の回転中心で各項を計算する。',
    refs: [ref('ex-tech-torque', '§9.2 式9.5–9.6、opposite directions / opposite signs')],
  }),
  q({
    number: 60,
    unit: 'ex-tech-mechanics',
    objective: 2,
    prompt:
      '上向きに一定200Nの力を物体に加え、その物体が上向きへ0.50m移動した。この上向きの力が物体にした仕事はいくらか。',
    options: [
      ['400J', '力を移動距離で割っている。仕事は力と同方向の変位の積で求める。'],
      ['100J', '200N×0.50mで100Jになる。'],
      ['−100J', 'この力と変位は同じ向きなので、その力による仕事は正である。'],
    ],
    answer: 1,
    explanation:
      '計算するのは指定された上向きの力による仕事である。重力などを含めた合計の仕事や、身体全体の代謝量を尋ねているわけではない。',
    refs: [ref('ex-tech-work', '§7.1 式7.1–7.3、力と変位が同方向の場合')],
  }),
  q({
    number: 61,
    unit: 'ex-tech-mechanics',
    objective: 2,
    difficulty: 3,
    prompt:
      '同じ対象物への正の仕事100Jを、試行Aは1.0秒、試行Bは0.50秒で行った。この仕事に関する平均パワーの比較はどれか。',
    options: [
      ['Aが100W、Bが50W', '時間が短い側のパワーを小さくしており、仕事を時間で割る関係と逆である。'],
      ['Aが200W、Bが200W', 'Aの1.0秒という時間を反映していない。'],
      ['Aが100W、Bが200W', '100Jをそれぞれの時間で割ると、BはAの2倍になる。'],
    ],
    answer: 2,
    explanation:
      '仕事の量が等しい条件で時間が半分なら平均パワーは2倍である。この1回の外部仕事だけから、人の総合的能力や消費カロリーを評価しない。',
    refs: [ref('ex-tech-power-formula', 'パワーの定義：P=W/t')],
  }),
  q({
    number: 62,
    unit: 'ex-tech-mechanics',
    objective: 3,
    difficulty: 3,
    prompt:
      '負荷を空間内の同じ位置で10秒保持し、対象の負荷に変位はない。「この負荷への外部の機械的仕事は0J」という計算を、筋の努力と合わせてどう説明するか。',
    options: [
      [
        '対象の負荷への仕事はゼロだが、保持のための筋活動や代謝までゼロという意味ではない',
        '対象物の変位と、身体の内部で必要な活動・エネルギー消費を区別している。',
      ],
      [
        '力が作用しているので、変位ゼロでも力×10秒を仕事としてJで報告する',
        '力×時間は仕事ではない。対象物への仕事には変位方向の条件が必要である。',
      ],
      [
        '負荷を動かしていないので、同じ力で上へ持ち上げた場合も仕事はゼロとして比較する',
        '保持と上向きの移動を同じ条件にしている。移動が生じれば指定した力の仕事は変わる。',
      ],
    ],
    answer: 0,
    explanation:
      '外部への機械的出力と、等尺性の努力を同一視しない。計算の対象が負荷なのか身体全体なのかを明示する。',
    refs: [
      ref('ex-tech-work', '§7.1 Figure7.2(b)の説明：d=0の荷物と筋の活動'),
      ref('ex-tech-power-formula', 'パワーの定義：移動がない運動の例'),
    ],
  }),
];
export const media: TechniqueMedia = {
  'ex-tech-057': {
    kind: 'diagram',
    assetId: 'ex-tech-moment-arm',
    caption:
      '自作の抽象力学モデル。Oから作用線までの垂直距離と、作用点までの斜距離を区別する。人体や関節の内部の力を測定した図ではない。',
    alt: '回転中心O、下向き100Nの力の矢印と作用線、Oから作用線まで水平な垂直距離0.30m、Oから作用点までの斜距離0.50m。',
  },
};
