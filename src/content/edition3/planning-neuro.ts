import type { Unit } from '../../domain/types';
import { editionPractice, type EditionItem } from './shared';
import { planningSource } from './planning-sources';

export const sci = planningSource(
  'sci',
  'Martin Ginis et al.: Evidence-based exercise guidelines for adults with spinal cord injury',
  'https://pubmed.ncbi.nlm.nih.gov/29070812/',
  'Spinal Cord 2018;56:308–321',
  'Abstract—Results and Conclusions',
);
export const sciSafety = planningSource(
  'sci-safety',
  'UBC SCI Guidelines: Safety tips',
  'https://ok-sciguidelines.sites.olt.ubc.ca/topic-1/safety-tips/',
  'SCI Action Canada・公開安全資料',
  'Safety tips',
);
export const ms = planningSource(
  'ms',
  'Kalb et al.: Exercise and lifestyle physical activity recommendations for people with multiple sclerosis',
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC7575303/',
  'Multiple Sclerosis 2020;26:1459–1469',
  'Table 2 and general recommendations',
);
export const cp = planningSource(
  'cp',
  'Verschuren et al.: Exercise and physical activity recommendations for people with cerebral palsy',
  'https://www.cern.fst.br/wp-content/uploads/2020/10/dmcn.13053-1.pdf',
  'Dev Med Child Neurol 2016;58:798–808',
  'Tables I–III and recommendations',
);
export const epilepsy = planningSource(
  'epilepsy',
  'ILAE Task Force: Epilepsy, seizures, physical exercise, and sports',
  'https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/epi.13261',
  'Epilepsia 2016;57:6–12',
  'Tables 1–2 and Clinical Aspects',
);
export const planningNeuroSources = [sci, sciSafety, ms, cp, epilepsy];
export const neuroUnit = 'ed3-plan-neuro';

export const editionPlanningUnits: Unit[] = [
  {
    id: neuroUnit,
    domainId: 'planning',
    title: '神経系の状態に合わせた運動計画',
    subtitle: '生活機能、医療職と共有した条件、環境に合わせて運動を選ぶ',
    minutes: 22,
    level: '応用',
    objectives: [
      { id: neuroUnit + '-o1', text: '脊髄損傷の体力・心血管代謝目標と開始時の注意を区別する' },
      { id: neuroUnit + '-o2', text: '多発性硬化症と脳性まひの運動を機能・症状・支援に合わせる' },
      {
        id: neuroUnit + '-o3',
        text: 'てんかんのある人の運動を発作時の危険と医療職の条件から考える',
      },
    ],
    sections: [
      {
        title: '脊髄損傷の運動',
        body: '慢性期の成人を対象にした国際指針には、体力を改善するための量と、心血管代謝の健康を目的とした別の量がある。発症からの期間や損傷部位によって根拠や注意が異なる。上肢を移動にも使う場合の使い過ぎ、皮膚の圧迫や擦れ、体温調節などを、本人と医療職から確認して計画する。',
      },
      {
        title: '多発性硬化症と脳性まひの運動',
        body: '同じ診断でも、移動、姿勢、感覚、疲労の出方は異なる。できる動作を確認し、支持の有無、練習場所、機器、見守りを選ぶ。熱で症状が出やすい場合は涼しい環境や休息を検討する。運動と生活内の身体活動は目的に応じて両方記録できる。',
      },
      {
        title: 'てんかんと環境ごとの危険',
        body: '発作の可能性だけで運動全般を決めず、もし発作が起きたらどのような危険が生じるかを考える。水中、高所、交通のある環境は、地上で安全を確保しやすい練習と条件が異なる。個別の参加条件を確認し、応急手順を共有する。',
      },
    ],
    example: {
      situation:
        '多発性硬化症の利用者が、暑い施設では予定した練習の後半に動きにくくなる。医療職からは涼しい環境で実施できる活動が共有された。',
      judgment: '空調のある場所で実施し、予定を短い区間へ分け、本人の疲労と症状の変化を記録する。',
    },
    terms: [
      {
        term: '自律神経過反射',
        meaning:
          '脊髄損傷のある人に起こり得る、刺激に対する急な血圧上昇。医療職と緊急時の手順を共有しておく。',
      },
      {
        term: 'EDSS',
        meaning:
          '多発性硬化症の障害の程度を表す医療評価尺度。トレーナーは共有された状態を参考にする。',
      },
      {
        term: 'GMFCS',
        meaning: '脳性まひの粗大運動機能の分類。実際の移動方法や支援の確認と組み合わせる。',
      },
    ],
    sourceRefs: planningNeuroSources.map((source) => ({
      sourceId: source.id,
      locator: source.locator,
    })),
  },
];

const sciItems: EditionItem[] = [
  [
    1,
    '慢性期脊髄損傷の体力向上に向け、有酸素と筋力の強度・量・頻度を区別する',
    '慢性期の脊髄損傷がある成人に、専門職が中〜高強度の運動を認めた。心肺体力と筋力の向上を目指す長期計画について、国際指針が示す目安はどれか。',
    [
      '中〜高強度の有酸素を各20分以上で週2回、主要な機能筋群の中〜高強度の筋力運動を各3セットで週2回',
      '有酸素と筋力の両方について、指針が示す強度、1回の量、頻度を満たす。',
    ],
    [
      '中〜高強度の有酸素を40分で週1回、主要な機能筋群の中〜高強度の筋力運動を各3セットで週2回',
      '有酸素の週合計は40分でも、目安は20分以上のセッションを週2回である。',
    ],
    [
      '中〜高強度の有酸素を各20分以上で週2回、主要な機能筋群の低強度の筋力運動を各3セットで週2回',
      '筋力運動のセット数と頻度は一致するが、指針の目安では筋力運動にも中〜高強度を示している。',
    ],
    '心肺体力と筋力に関する強い推奨には、有酸素運動と筋力運動が両方含まれる。個人の開始量は専門職と共有した条件に従う。',
    'Abstract—Results：cardiorespiratory fitness and muscle strength benefitsの量・強度・頻度。',
  ],
  [
    1,
    '代謝目的の脊髄損傷ガイドの推奨の強さを読む',
    '指針の運動量を、慢性期の脊髄損傷がある成人の心血管代謝の健康について説明する。資料の表現はどれか。',
    [
      '中〜高強度有酸素30分以上を週3日とする条件付き推奨',
      '対象のアウトカムと推奨の強さを正しく示している。',
    ],
    ['同じ量は全員の開始時からの必須条件', '条件付きの集団推奨であり個別の開始量ではない。'],
    ['体力を目的とする量も代謝を目的とする量も同じ', '目的ごとに示された目安が異なる。'],
    '根拠の確かさに応じた推奨の強さと、個人に適した開始点を分ける。',
    'Abstract—Resultsのcardiometabolic health。',
  ],
];
const safetyItems: EditionItem[] = [
  [
    1,
    '移動でも使う肩の負担を週量へ含める',
    '手動車いすで坂道を長く移動した日に、上肢の反復を増やそうとしている。本人は肩を普段より使ったと話す。次の計画はどれか。',
    ['移動も肩の負担として把握し、上肢の反復と回復を見直す', '日常の負担を計画時に考慮できる。'],
    [
      '運動時間の記録から坂道を外し、反復を予定より増やす',
      '目的上の運動量と使い過ぎの検討は別である。',
    ],
    ['移動時は肩の負担がなく、筋力運動だけを数える', '日常で上肢を使っている条件を落とす。'],
    '移動と運動で同じ部位を使う場合、個別の使い過ぎ対策が必要になる。',
    'Safety tips—overuse injuries。',
  ],
  [
    1,
    '感覚が乏しい部位を痛みの自己申告だけで確認しない',
    '脊髄損傷がある利用者は、ベルトの当たる部位の感覚が乏しいと申告した。医療職から教わった皮膚の確認法がある。初回に行う準備はどれか。',
    [
      'ベルトの接触と本人の確認方法を共有する',
      '痛みが出にくい部位も圧迫や皮膚の変化を確認できる。',
    ],
    ['痛みがなければ摩擦の影響はないと記録する', '感覚低下があるため痛みだけでは判断できない。'],
    ['運動の強度が低ければ皮膚の確認は不要とする', '接触部の圧迫は強度だけで決まらない。'],
    '用具が触れる箇所と、本人が教わった皮膚確認の方法を開始前に照らし合わせる。',
    'Safety tips—skin and pressure sores/ulcers。',
  ],
];
const msItems: EditionItem[] = [
  [
    2,
    '熱で症状が変わる多発性硬化症の環境を先に調整する',
    '医療職と運動条件を確認済みの利用者は、同じ時間でも暑い室内で疲労が強まりやすい。涼しい部屋と短い休憩を使える。どの変更が適切か。',
    ['涼しい場所へ移し、休息を挟み症状を記録する', '本人の熱への反応に合う変更である。'],
    ['温度を保ち、目標時間だけを優先して連続する', '悪化しやすい条件を変えていない。'],
    ['疲労はすべて強度だけで決まるとして温度を記録しない', '温度の影響を切り分けられない。'],
    '熱への敏感さがある場合、同じ処方でも環境と休息を調整する。',
    'Table 2のEDSS 0–4.5、5.0–6.5のheat sensitivity。',
  ],
  [
    2,
    '立位が不安定なとき有酸素の目的を支持付き手段で維持する',
    'バランスに課題のある多発性硬化症の利用者に、医療職は座位での運動を許可した。立位の移動練習とは別に有酸素運動を続けたい。適切な選択はどれか。',
    [
      '許可範囲で支持のある座位エルゴメーターを検討する',
      '有酸素の目的を保ちつつ転倒条件を下げられる。',
    ],
    ['支持のないステップ練習を有酸素枠に採用する', 'バランスの制約を無視する。'],
    ['立位でなければ有酸素の計画から除く', '座位でも有酸素活動は可能である。'],
    '目的に合う有酸素の手段を、姿勢の安定性から選ぶ。',
    'Table 2のEDSS 5.0–6.5、adaptive exercise。',
  ],
  [
    2,
    '移動能力が低い場合の活動の記録範囲を広げる',
    '歩行を日課にできない多発性硬化症の成人が、医療職の支援で座位活動や日常生活の動作を増やした。記録の考え方はどれか。',
    ['実際に行った機能的動作も身体活動として記録する', '生活内の動きも身体活動に含まれる。'],
    ['歩数が増えなければ全活動を0とする', '歩数に現れない活動を落としている。'],
    ['座位での活動を全て運動不足と同じ記録にする', '姿勢だけでは活動量を表せない。'],
    '活動の把握には、実施可能な動作に対応する記録を選ぶ。',
    'Table 2のEDSS 7.0–7.5、Functional movement。',
  ],
  [
    2,
    '進行した状態の提案の根拠レベルを確認する',
    '多発性硬化症の重い機能障害のある利用者について、表の推奨を根拠として説明する。どの説明が適切か。',
    [
      '試験データの不足した項目には専門家意見があり、個別に専門職と調整する',
      '資料は根拠の限界と専門職による調整を示す。',
    ],
    [
      '全項目が当該の重症度で大規模比較試験により証明されたと説明する',
      '資料の根拠の区別に反する。',
    ],
    [
      '根拠が少ないため専門職と合意した生活活動まで禁止する',
      '根拠の不足は一律の禁止を意味しない。',
    ],
    '処方表は根拠の種類を確認し、個別の計画を代替しない。',
    'Table 2のEDSS 7.0–7.5のKey messages。',
  ],
];
const cpItems: EditionItem[] = [
  [
    2,
    '脳性まひの有酸素様式を実際に使える運動から選ぶ',
    '脳性まひのある利用者は歩行の連続時間が短いが、適合した固定自転車で活動できる。専門職の条件内で、有酸素の計画をどう考えるか。',
    [
      '利用できる自転車で実施時間と反応を記録する',
      '自転車を使った有酸素の研究例があり、実施能力に合う。',
    ],
    ['歩行を続けられなければ有酸素計画を作らない', '他の様式の可能性を除外している。'],
    ['歩行研究と同じ時間・速度を自転車へ移す', '機器や動きの違いがあり同じ値の意味ではない。'],
    '活動の様式を決める際、医療職の条件と利用者が実際にできる動きを確認する。',
    'Table IのType（Cycling等）。',
  ],
  [
    2,
    '脳性まひの抵抗運動で導入と進行を別の期間にする',
    '脳性まひの成人が専門職の条件内で初めて抵抗運動を行う。筋力を評価する計画は4週間で、初回から目標の量と強度を予定している。資料に沿う変更はどれか。',
    [
      '軽く少量の慣熟期間を取り、その後段階的に量と強度を上げる期間を別に確保する',
      '動きに慣れる数週間と漸進する期間を分けて計画できる。',
    ],
    ['期間はそのままにし、目標量を初回で行う', '動作に慣れる段階を省く。'],
    [
      '4週間で変化がなければ、抵抗運動を行う能力がないと結論づける',
      '慣熟期間と変化が現れるまでの期間を考慮していない。',
    ],
    '初期に動作の習得時間を設け、筋力の変化を確認する期間も十分に取る。',
    '印刷pp.801–802：Time/duration, Summary of training parameters, Table III。',
  ],
];
const epilepsyItems: EditionItem[] = [
  [
    3,
    '発作時の結果から運動の危険を分類する',
    'てんかんがある成人の運動を検討する。本人は水中の活動と地上で実施できる活動を希望する。ILAEの枠組みで最初に比較する点はどれか。',
    [
      '各活動中に発作が起きた場合のけがや生命の危険',
      '分類は活動中の発作が生じた場合の危険に基づく。',
    ],
    ['両活動の消費エネルギーの多寡', '運動強度だけでは環境による危険を比較できない。'],
    ['会場の利用料金の違いだけ', '料金は危険分類の根拠ではない。'],
    '参加条件は、発作が生じたときの結果と医療職の個別判断を組み合わせる。',
    'Table 1のリスク分類と本文Sports and Epilepsy。',
  ],
  [
    3,
    'スポーツ危険分類と発作の個人条件を組み合わせる',
    '一人の利用者の発作は睡眠時のみと医療職から共有された。別の利用者には覚醒時の意識障害を伴う発作がある。参加を判断する資料の読み方はどれか。',
    [
      '同じ活動でも各人の発作の特徴と医療職の条件を確認する',
      '活動の危険分類だけで全員同じ参加条件を決めない。',
    ],
    ['診断名が同じなので両者の参加条件を同一にする', '発作の特徴が異なる。'],
    ['発作の特徴だけを比較し、活動中の環境は確認しない', '環境で発作時の結果が変わり得る。'],
    '活動のリスクと、本人に関する臨床情報の両方が判断材料になる。',
    'Table 2のSleep-related seizures only、Seizures with impaired awareness。',
  ],
];

export const planningNeuroQuestions = [
  ...editionPractice('planning', 29, neuroUnit, sci, sciItems),
  ...editionPractice('planning', 31, neuroUnit, sciSafety, safetyItems),
  ...editionPractice('planning', 33, neuroUnit, ms, msItems),
  ...editionPractice('planning', 37, neuroUnit, cp, cpItems),
  ...editionPractice('planning', 39, neuroUnit, epilepsy, epilepsyItems),
];
