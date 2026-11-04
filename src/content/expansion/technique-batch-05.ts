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
    [33, 36, 37, 39].includes(item.number) ? '2026-11-04T12:35:50Z' : '2026-11-04T12:14:23Z',
  );
export const sources: Source[] = [
  {
    id: 'ex-tech-static',
    title: 'NSCA: Static Stretching and Performance',
    url: 'https://www.nsca.com/education/articles/kinetic-select/static-stretching-and-performance/',
    edition: '2018年9月、NSCA’s Guide to Program Designの公式公開抜粋',
    checkedAt,
    locator: '公開本文全文、特に急性効果・長期の柔軟性、終盤の体操選手の例',
    note: '研究の可能性を個人の必然的な低下や全種目一律の禁止へ一般化しない。',
  },
  {
    id: 'ex-tech-warmup',
    title: 'NSCA: Introduction to Dynamic Warm-Up',
    url: 'https://www.nsca.com/education/articles/kinetic-select/introduction-to-dynamic-warm-up/',
    edition: '2017年6月、NSCA’s Guide to Program Designの公式公開抜粋',
    checkedAt,
    locator: '公開本文全文：warm-upとstretchingの区別、general/specific、undue fatigue',
  },
];
export const units: Unit[] = [
  {
    id: 'ex-tech-flex',
    domainId: 'technique',
    title: '柔軟性と準備運動の使い分け',
    subtitle: '直前の課題、方法、能動・他動の違いで選ぶ',
    minutes: 20,
    level: '応用',
    objectives: [
      { id: 'ex-tech-flex-o1', text: '運動直前の準備と、長期的な柔軟性練習を目的別に組み合わせる' },
      { id: 'ex-tech-flex-o2', text: '静的・動的・バリスティック・PNFの実施方法を区別する' },
      { id: 'ex-tech-flex-o3', text: '能動と他動の可動域、関節構造と制御の情報を分けて解釈する' },
    ],
    sections: [
      {
        title: '準備運動とストレッチは同じではない',
        body: '準備運動はこれから行う運動へ心身を備える活動であり、ストレッチは主に柔軟性を高めるための方法である。身体的な反応だけでなく、次の課題を理解して注意を向け、本練習のテンポを整える役割もある。一般的な活動から種目に近い動きへ進めても、疲労しきって本練習の動作を保てなくなれば目的に合わない。',
      },
      {
        title: '静的ストレッチを一律に禁止しない',
        body: '力やパワーが必要な運動の直前に静的ストレッチを行う影響と、長期の柔軟性練習の価値を分けて考える。高い柔軟性を要する競技では、一般的な準備の後に必要な静的ストレッチを行い、その後に動的な動作を組み込む例もある。個人の必然的な成績低下や完全な傷害予防は保証しない。',
      },
      {
        title: '動いたというだけで方法は決まらない',
        body: '制御した活動的な動き、反動を使うバウンド、姿勢を保つ静的な方法、筋活動と他動的な動きを組み合わせるPNFは区別する。方法の名称だけで対象者やその場面に適切と判定せず、必要な範囲と制御を確認する。',
      },
      {
        title: '出せる範囲と動かされる範囲を分ける',
        body: '他動で得られる可動域と、自分の筋活動で使える可動域は同じとは限らない。差が見られても、その測定だけで原因を特定しない。関節の構造や軟部組織、温度、活動なども柔軟性に関わるため、すべてを強く伸ばせば同じ範囲になると考えない。',
      },
    ],
    example: {
      situation:
        '跳躍テストの直前に長い静的ストレッチだけを入れようとしている。本人は柔軟性向上も目標にしている。',
      judgment:
        '直前のパワー発揮の準備と、柔軟性を高める別の練習機会を分けて計画し、必要な動的な準備を確認する。静的ストレッチ全般を不要とは説明しない。',
    },
    terms: [
      { term: '能動可動域', meaning: '自分の筋活動を使って動かせる関節の範囲。' },
      { term: '他動可動域', meaning: '外部からの力で動かしたときの関節の範囲。' },
      { term: 'PNF', meaning: '筋活動と他動的な動き等を組み合わせるストレッチ方法の総称。' },
      {
        term: 'バリスティック',
        meaning: '反動やバウンドを用いる方法。動的な方法すべてと同じではない。',
      },
    ],
    sourceRefs: [
      ref('ex-tech-static', '公開本文全文'),
      ref('ex-tech-warmup', 'warm-upとstretchingの区別、終盤'),
      ref('ex-tech-tsac', 'Module3.1 pp.5–7 / PDFpp.10–12'),
    ],
  },
];
export const questions = [
  q({
    number: 33,
    unit: 'ex-tech-flex',
    objective: 1,
    difficulty: 3,
    prompt:
      '直後に最大跳躍を評価する。準備を長い静的ストレッチだけで終えようとしている利用者へ、参照資料に沿う説明はどれか。',
    options: [
      [
        '直前の関節可動域が増えたかで準備を評価し、跳躍への準備も完了したと扱う',
        '柔軟性という一つの変化だけでは、直前の力・パワー課題への影響や準備を評価できない。',
      ],
      [
        '動的な動きは測定結果を変えるため評価後へ回し、静的ストレッチの直後に測定をそろえる',
        '動的な準備を単に除外するより、直前のパワー発揮と準備の目的に合った配置を検討する。',
      ],
      [
        '直前のパワー発揮への影響を考え、目的に合う動的な準備も検討する',
        '直前の準備の目的に合わせて方法を選び、個人の成績低下を断定していない。',
      ],
    ],
    answer: 2,
    explanation:
      '測定前の条件をそろえることは必要でも、何を準備として採用するかは別に検討する。柔軟性への効果と直前のパワー課題への影響を区別する。',
    refs: [ref('ex-tech-static', '力・パワーへの急性影響と終盤の配置の説明')],
  }),
  q({
    number: 34,
    unit: 'ex-tech-flex',
    objective: 1,
    difficulty: 3,
    prompt:
      '高い柔軟性が必要な体操競技の準備で、必要な静的ストレッチを含めたい。NSCA公開抜粋が示す例に合う考え方はどれか。',
    options: [
      [
        '一般的な準備後に必要な静的ストレッチを行い、その後の動的な動作も組み込む',
        '記事の体操選手の例に対応し、競技の要求を反映している。',
      ],
      [
        '競技の要求に関係なく、静的ストレッチをすべて永久に禁止する',
        '記事は一律の排除ではなく目的に合わせた組込みを説明している。',
      ],
      [
        '静的ストレッチだけで体温上昇や動作練習もすべて代替できるとする',
        '柔軟性練習と準備運動の役割を同一視している。',
      ],
    ],
    answer: 0,
    explanation:
      '一つの方法の是非を競技の要求から切り離して決めない。参照した例は全員共通の実施順序を強制する規定でもない。',
    refs: [ref('ex-tech-static', '終盤：gymnasts、general warm-up、series of dynamic movements')],
  }),
  q({
    number: 35,
    unit: 'ex-tech-flex',
    objective: 1,
    prompt:
      '利用者が「運動直前に静的ストレッチをすると成績へ影響する可能性があるなら、柔軟性練習自体をやめたい」と言う。区別して説明したい点はどれか。',
    options: [
      [
        '急性の影響があれば、長期に関節可動域が変化することはない',
        '直前の効果と、継続的な練習による可動域の変化を混同している。',
      ],
      [
        '直前の課題への影響と、継続的な柔軟性練習の役割は別に考える',
        '資料は静的ストレッチの全廃を求めず、配置を検討している。',
      ],
      [
        '長期の柔軟性向上を目指すなら、必ず最大負荷の運動直前だけに行う',
        '配置をその場面に限定する根拠はない。',
      ],
    ],
    answer: 1,
    explanation: 'ある場面に合わないことは、その方法がすべての目的に無価値という意味ではない。',
    refs: [ref('ex-tech-static', 'chronic stretchingとcool-down / separate sessionの説明')],
  }),
  q({
    number: 36,
    unit: 'ex-tech-flex',
    objective: 1,
    prompt:
      'ウォームアップ記録を、生理的な反応だけでなく「心理的な準備と本練習のテンポ」という目的でも整理したい。後者に直接対応する観察はどれか。',
    options: [
      [
        '軽い活動に伴い、心拍数と呼吸の頻度が上がった',
        '生理的な準備に関する記録であり、課題の理解や本練習への取り組み方とは区別する。',
      ],
      [
        '開始前より関節を大きな範囲で動かせた',
        '可動域という身体的な準備の記録であり、心理面とセッションのテンポを直接示していない。',
      ],
      [
        '利用者が次の課題を理解し、共有した進行のテンポに注意を向けられた',
        '資料のmental preparationと、upcoming activitiesのdesired tempoに対応する観察である。',
      ],
    ],
    answer: 2,
    explanation:
      '準備の目的には身体的な変化に加え、これからの活動への心理的な準備やテンポを整えることもある。ここでの観察を心理疾患の評価へ拡張しない。',
    refs: [
      ref('ex-tech-warmup', '冒頭：mentally and physically prepare / set the tone / desired tempo'),
    ],
  }),
  q({
    number: 37,
    unit: 'ex-tech-flex',
    objective: 2,
    prompt:
      '柔軟性練習の記録に「対象筋の収縮の局面を入れ、その後に弛緩して補助者による他動的ストレッチへ移る」とある。この組合せ全体の分類として適切なのはどれか。',
    options: [
      ['PNFに含まれる方法として整理する', '筋活動と他動的な動きを組み合わせる説明に対応する。'],
      [
        '最後に他動的に保つので、他動的な静的保持だけを行ったと記録する',
        '最後の局面だけを見て、その前の意図的な筋収縮との組合せを記録から落としている。',
      ],
      [
        '本人が筋を収縮させたので、能動的な動的ストレッチだけを行ったと記録する',
        '筋収縮という一部だけを見て、弛緩後の他動的な局面を除いている。',
      ],
    ],
    answer: 0,
    explanation:
      '最後の姿勢や本人の動き一つだけで分類せず、収縮と他動的ストレッチの組合せを記録する。',
    refs: [
      ref('ex-tech-static', 'PNF：passive movements and active muscle actions'),
      ref('ex-tech-tsac', 'Module3.1 p.6 / PDFp.11：PNF'),
    ],
  }),
  q({
    number: 38,
    unit: 'ex-tech-flex',
    objective: 2,
    prompt:
      '準備運動で「制御した動きの中で可動域を使う」と説明したが、利用者は終末域で急なバウンドを繰り返している。方法の区別として適切なのはどれか。',
    options: [
      [
        '動いていればすべて同じ方法なので、速度や反動は確認しない',
        '動的な方法とバウンドを用いる方法を区別していない。',
      ],
      [
        '反動を使う方法になっていることを共有し、目的に合う制御した動きへ戻す',
        '実際の方法と練習目的のずれを修正する。',
      ],
      [
        '反動を加えるほど、関節の構造による制約は必ずなくなる',
        '方法の分類から構造的な制約の消失を保証することはできない。',
      ],
    ],
    answer: 1,
    explanation:
      '「動的」という名称だけで正しく実施できたと判断しない。反動、速度、使っている範囲を具体的に観察する。',
    refs: [ref('ex-tech-tsac', 'Module3.1 p.6 / PDFp.11：Ballistic / Dynamic')],
  }),
  q({
    number: 39,
    unit: 'ex-tech-flex',
    objective: 3,
    context: 'image',
    difficulty: 3,
    prompt:
      '自作図は、同じ痛みのない関節で、能動90°・他動120°という仮想測定値を示す。再測定に使う記録の残し方として適切なのはどれか。',
    options: [
      [
        '大きい方の120°を代表値にし、能動と他動をまとめて関節可動域120°と残す',
        '代表値だけでは、本人が使えた範囲と補助で得られた範囲を後で比較できない。',
      ],
      [
        '差の30°だけを残し、二つの角度と動かした条件を省く',
        '差が同じでも元の能動・他動角度は異なりうるため、再測定との比較情報が不足する。',
      ],
      [
        '能動で使える範囲と他動で得られる範囲を区別して記録する',
        '二つの条件の違いを残し、原因を断定していない。',
      ],
    ],
    answer: 2,
    explanation:
      '仮想値は正常範囲の基準ではない。同じ条件で比較できるよう、各測定値と能動・他動の別を残す。',
    refs: [
      ref('ex-tech-tsac', 'Module3.1 p.5 / PDFp.10：static flexibility / dynamic flexibility'),
    ],
  }),
  q({
    number: 40,
    unit: 'ex-tech-flex',
    objective: 3,
    prompt:
      '利用者が「関節可動域の違いはすべて努力不足。強く伸ばせば全員同じ範囲になる」と話す。資料の柔軟性に関わる要因から適切な説明はどれか。',
    options: [
      [
        '関節構造なども関わるため、努力だけで全員同じ範囲になるとはいえない',
        '資料は関節構造や筋・結合組織など複数の要因を挙げている。',
      ],
      ['関節の構造は可動域と無関係である', '資料に挙げられる要因を否定している。'],
      [
        '他人と同じ角度になるまで、制御の変化を無視して伸ばす',
        '個人の条件を確認せず他人の値へ合わせる判断である。',
      ],
    ],
    answer: 0,
    explanation:
      '柔軟性の違いは複数の条件から考える。努力の有無だけへ還元せず、個別の目的と範囲を確認する。',
    refs: [ref('ex-tech-tsac', 'Module3.1 p.5 / PDFp.10：Factors Affecting Flexibility')],
  }),
];
export const media: TechniqueMedia = {
  'ex-tech-039': {
    kind: 'diagram',
    assetId: 'ex-tech-active-passive',
    caption:
      '自作の仮想測定図。能動90°、他動120°はこの設問だけの前提であり、正常値や疾患の判定基準ではない。',
    alt: '同じ開始位置の関節を二つのパネルで示す。Aは本人が能動で90度まで、Bは外力で他動120度まで動く。いずれも痛みなし。',
  },
};
