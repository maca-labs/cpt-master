import type { Source } from '../../domain/types';
import { advancedItem } from './shared';

function source(id: string, title: string, url: string, edition: string, locator: string): Source {
  return { id: `adv-plan-${id}`, title, url, edition, locator, checkedAt: '2026-11-09' };
}

const foster = source(
  'foster-srpe',
  'Foster et al. A New Approach to Monitoring Exercise Training',
  'https://paulogentil.com/pdf/A%20New%20Approach%20to%20Monitoring%20Exercise%20Training.pdf',
  'J Strength Cond Res 15(1), 2001',
  '印刷p.111 Part 1（セッション時間×セッションRPE）、p.114 Table 5（週集計）',
);
const density = source(
  'density',
  'NSCA PTQ: How to Manipulate Rest Intervals to Maximize Strength Training Effectiveness',
  'https://www.nsca.com/contentassets/fb8a7be6eb174934bb8844703c4de4cc/ptq-10.1.3-how-to-manipulate-rest-intervals-to-maixmize-strength-training-effectiveness.pdf',
  'PTQ 10.1, 2023',
  '印刷pp.20–22、Training Density、Quality over Quantity',
);
const relative = source(
  'relative-intensity',
  'NSCA Coach: Using Intensity Based on Sets and Repetitions',
  'https://www.nsca.com/globalassets/education/articles/coaches/12.3/nsca-coach-12.3.8_using-intensity-based-on-sets-and-repetitions.pdf',
  'NSCA Coach 12.3, 2025',
  '印刷p.50、Percent of 1RM (Relative Intensity)',
);
const hrr = source(
  'hrr',
  'NSCA: TSAC Module 4.0 Program Design',
  'https://www.nsca.com/contentassets/53f36e5db26a4729b251fb794c166af1/tsac-module-4.0--4.5.pdf',
  '2013',
  'Module 4.0 p.8、Prescribing Aerobic Intensity、% heart rate reserve method',
);
const cdcAdult = source(
  'cdc-adult',
  'CDC: Adult Activity: An Overview',
  'https://www.cdc.gov/physical-activity-basics/guidelines/adults.html',
  '2023-12-20',
  'Recommendations for adults、週の有酸素活動と筋力活動の日数',
);
const cdcEquivalence = source(
  'cdc-equivalence',
  'CDC: What Counts as Physical Activity for Adults',
  'https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html',
  '公開Web版',
  'Aerobic activity、強度が異なる有酸素活動の1分対2分の換算',
);
const sprint = source(
  'sprint',
  'NSCA: Designing Speed Training Sessions',
  'https://www.nsca.com/education/articles/kinetic-select/designing-speed-training-sessions/',
  '2019・Developing Speed公開抜粋',
  '本文冒頭、疾走速度による質の確認、試行間の回復',
);
const taper = source(
  'taper',
  'NSCA: Tapering and Peaking',
  'https://www.nsca.com/education/articles/kinetic-select/tapering-and-peaking/',
  '2019・Developing Endurance pp.51–52公開抜粋',
  '本文、量と強度の調整、過去にうまくいったテーパーの活用',
);
const youth = source(
  'youth',
  'NSCA: Youth Resistance Training Position Statement',
  'https://www.nsca.com/globalassets/about/position-statements/position_stand_youth_resistance_training---2009.pdf',
  '2009',
  '印刷p.S70、Table 1、監督・軽い負荷での習得・個別の漸進',
);
const older = source(
  'older',
  'NSCA: Resistance Training for Older Adults Position Statement',
  'https://www.nsca.com/contentassets/2a4112fb355a4a48853bbafbe070fb8e/resistance_training_for_older_adults__position.1.pdf',
  '2019',
  '印刷p.2025、Functional TrainingとTable 1。p.2032、Table 2のProgression',
);
const stroke = source(
  'stroke',
  'MacKay-Lyons et al. AEROBICS 2019 Update',
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC8204880/',
  'Phys Ther 100(1), 2020',
  'Recommendations、Format、Mode、Session Duration、Exercise Intensity、Monitoring',
);
const parkinson = source(
  'parkinson',
  'APTA: Physical Therapist Management of Parkinson Disease',
  'https://www.aptahomehealth.org/assets/Physical%20Therapist%20Management%20of%20Parkinson%20Disease%20Practice%20Guideline%20from%20APTA.pdf',
  'Phys Ther 102(4), 2022',
  'External Cueing、Rationale、Freezing of gait、Potential Benefits, Risks, Harms, and Cost',
);
const sci = source(
  'sci',
  'Martin Ginis et al. Evidence-based scientific exercise guidelines for adults with spinal cord injury',
  'https://pubmed.ncbi.nlm.nih.gov/29070812/',
  'Spinal Cord 56, 2018',
  'Abstract Results、体力向上を目的とする有酸素運動と主要な機能筋群ごとの抵抗運動',
);
const oncology = source(
  'oncology',
  'ACSM International Multidisciplinary Roundtable: Exercise Guidelines for Cancer Survivors',
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC8576825/',
  'Med Sci Sports Exerc 51(11), 2019',
  '2.3.5 Lymphedema、Table 4 運動前評価、Table 5 Peripheral Neuropathy',
);
const ckd = source(
  'ckd',
  'KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
  'https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf',
  'Kidney Int 105(Suppl 4S), 2024',
  '印刷p.S207、Recommendation 3.2.2.1、Practice Points 3.2.2.1–3.2.2.3',
);

export const advancedPlanningSources = [
  foster,
  density,
  relative,
  hrr,
  cdcAdult,
  cdcEquivalence,
  sprint,
  taper,
  youth,
  older,
  stroke,
  parkinson,
  sci,
  oncology,
  ckd,
];

const ref = (s: Source) => ({ sourceId: s.id, locator: s.locator });

export const advancedPlanningQuestions = [
  advancedItem('planning', 1, {
    unitId: 'ex-plan-load',
    objectiveIds: ['ex-plan-load-o2'],
    level: 'analysis',
    prompt:
      '出張週に、練習時間を週75分以上確保しながら、週の内的負荷を335 AU以下に抑える仮の計画を作る。月曜の25分はすでに実施し、セッションRPEは4だった。以後のRPEは計画上の見積もりとし、負荷は各回の「時間×セッションRPE」を合計する。条件を両方満たす案はどれか。',
    correct: [
      '水曜30分・RPE 5、土曜20分・RPE 4',
      '週75分で、負荷は100＋150＋80＝330 AUとなり、両方の条件を満たす。',
    ],
    distractors: [
      [
        '水曜25分・RPE 5、土曜25分・RPE 5',
        '週75分を確保できるが、負荷は100＋125＋125＝350 AUで上限を超える。',
      ],
      [
        '水曜35分・RPE 3、土曜10分・RPE 4',
        '負荷は100＋105＋40＝245 AUだが、週70分で時間条件に届かない。',
      ],
    ],
    explanation:
      'RPEの週平均だけでは各回の長さを反映できない。セッションごとに時間を掛けてから足し、時間の合計とは別に判定する。計画のAUは見積もりなので、実施後の記録で更新する。',
    sourceRefs: [ref(foster)],
  }),
  advancedItem('planning', 2, {
    unitId: 'ex-plan-load',
    objectiveIds: ['ex-plan-load-o3', 'ex-plan-load-o2'],
    level: 'analysis',
    prompt:
      '施設の交代時刻まで、ある抵抗運動に使える時間は6分。1セットは40秒と見積もる。前回の記録では、セット間の休息が85秒を下回ると同じ負荷でフォームを保てなかった。今回は同じ負荷で質を保てるセットを3回以上行う。最後のセット後の時間は含めないとき、どの案を採用できるか。',
    correct: [
      '3セット、間の休息は各100秒',
      '40×3＋100×2＝320秒で、時間内に3セットを行いながら休息条件を満たす。',
    ],
    distractors: [
      ['4セット、間の休息は各60秒', '合計340秒だが、本人がフォームを保てた休息条件を下回る。'],
      ['4セット、間の休息は各85秒', '休息の長さは条件に合うが、合計415秒となり交代時刻を越える。'],
    ],
    explanation:
      '休息の回数はセット数より一つ少ない。収まるセット数だけで決めず、本人の記録から設定した休息と、施設の時間枠の両方を検算する。',
    sourceRefs: [ref(density)],
  }),
  advancedItem('planning', 3, {
    unitId: 'ex-plan-load',
    objectiveIds: ['ex-plan-load-o1'],
    level: 'analysis',
    prompt:
      '既知の1RMはスクワット100 kg、プレス80 kg。ある計画ではスクワット70～77%1RM、プレス70～80%1RMを満たし、二つの器具に準備する総重量の合計は135 kg以下とする。次の重量の組み合わせで、この三つの条件をすべて満たすのはどれか。',
    correct: [
      'スクワット75 kg、プレス60 kg',
      '両方75%1RMで各範囲に入り、重量の合計も135 kgに収まる。',
    ],
    distractors: [
      [
        'スクワット77.5 kg、プレス57.5 kg',
        '合計135 kgでプレスも範囲内だが、スクワットが77.5%となり上限77%を超える。',
      ],
      [
        'スクワット75 kg、プレス62.5 kg',
        'スクワット75%、プレス約78.1%で各範囲に入るが、合計137.5 kgとなる。',
      ],
    ],
    explanation:
      '重量をそれぞれの種目の1RMで割って相対強度を求める。器具の制約には相対強度の合計ではなく、実際の重量を足した値を使う。範囲と重量上限はこのケースの条件である。',
    sourceRefs: [ref(relative)],
  }),
  advancedItem('planning', 4, {
    unitId: 'ex-plan-cardio',
    objectiveIds: ['ex-plan-cardio-o1'],
    level: 'analysis',
    prompt:
      '評価時の安静時心拍数は60拍/分。最大心拍数はトレッドミルで180拍/分、自転車で160拍/分と測定されている。この計画では、各機器で測った値を使って50～60%HRRの目標範囲を設定した。練習記録の組み合わせのうち、どちらの機器でもこの範囲に入っているのはどれか。',
    correct: [
      'トレッドミル122拍/分、自転車117拍/分',
      'トレッドミルの目標120～132拍/分、自転車の目標110～120拍/分の両方に入る。',
    ],
    distractors: [
      [
        'トレッドミル114拍/分、自転車117拍/分',
        '自転車は範囲内だが、トレッドミルは下限120拍/分に届かない。',
      ],
      [
        'トレッドミル126拍/分、自転車123拍/分',
        'トレッドミルは範囲内だが、自転車は上限120拍/分を超える。',
      ],
    ],
    explanation:
      'HRRは最大心拍数から安静時心拍数を引いた値。各機器で得たHRRの50～60%に安静時心拍数60を足して判定する。この範囲は計算上の目標である。',
    sourceRefs: [ref(hrr)],
  }),
  advancedItem('planning', 5, {
    unitId: 'ex-plan-cardio',
    objectiveIds: ['ex-plan-cardio-o3'],
    level: 'analysis',
    prompt:
      '米国CDCの一般成人向け指針で、週の活動記録を点検する。入力済みの有酸素活動は中強度98分、高強度24分。主要筋群を使う筋力活動は火曜に1回記録されている。追加分の筋力活動も主要筋群を対象とする。週150分の中強度相当と、筋力活動週2日以上の両方を満たす追加記録はどれか。',
    correct: [
      '日曜に高強度2分を加え、土曜に筋力活動を1回行った',
      '98＋24×2＋2×2＝150分相当で、筋力活動は火曜と土曜の2日になる。',
    ],
    distractors: [
      [
        '日曜の中強度4分と、未入力だった火曜2回目の筋力活動',
        '150分相当だが、筋力活動を2回行っていても実施日は火曜の1日だけである。',
      ],
      [
        '日曜に中強度3分を加え、土曜に筋力活動を1回行った',
        '筋力活動は2日になるが、有酸素活動は149分相当となる。',
      ],
    ],
    explanation:
      'この米国指針では高強度1分を中強度2分相当として有酸素活動を換算する。筋力活動は回数ではなく日数を別に数える。',
    sourceRefs: [ref(cdcAdult), ref(cdcEquivalence)],
  }),
  advancedItem('planning', 6, {
    unitId: 'ex-plan-power',
    objectiveIds: ['ex-plan-power-o3'],
    level: 'analysis',
    prompt:
      'スプリントの質を記録するため、同条件で計測した10 m区間の基準タイムを1.20秒とする。本人用の練習ルールでは、区間平均速度が基準の92%未満なら休息を延長し、基準の92%以上に戻った試行を量の集計に入れる。通常休息後の2本は1.30秒と1.32秒で、休息を延長した次の試行は1.28秒だった。質の記録はどれか。',
    correct: [
      '1.30秒と1.28秒を集計し、1.32秒は基準未達とする',
      '同じ距離での速度比は基準タイム÷試行タイム。順に約92.3%、90.9%、93.8%となる。',
    ],
    distractors: [
      [
        '1.28秒だけを集計し、1.30秒と1.32秒は基準未達とする',
        '基準タイムの8%増を許容上限とすると1.296秒だが、速度の8%低下とは同じではない。',
      ],
      [
        '通常休息後の2本を集計し、延長後の1.28秒は別枠とする',
        '休息を延長したことは集計除外の条件ではない。通常休息後の1.32秒は約90.9%である。',
      ],
    ],
    explanation:
      '区間平均速度は距離÷時間で求めるため、同距離の速度比と時間比は逆になる。92%という基準は仮の個別ルールであり、NSCA資料は疾走速度と回復を使って練習の質を管理する考え方の根拠になる。',
    sourceRefs: [ref(sprint)],
  }),
  advancedItem('planning', 7, {
    unitId: 'ex-plan-progression',
    objectiveIds: ['ex-plan-progression-o2'],
    level: 'analysis',
    prompt:
      '自転車競技者は、前回の同距離レース前に練習量を減らし、短いレース強度の練習を残すと当日の感覚がよかった。今回は大会直前に勤務が増え、連続した長い練習枠は取れないが短い枠は普段どおり取れる。過去の経験と今回の制約を踏まえた調整はどれか。',
    correct: [
      '短い枠にレース強度の区間を一部残し、反復数と長い練習の量を減らす',
      '前回維持できた強度の刺激を残しながら、時間と疲労の両方を抑えられる。',
    ],
    distractors: [
      [
        '短い枠に分割して前週の総量を保ち、各区間の強度を下げる',
        '勤務の時間枠には合うが、前回うまくいった量と強度の調整を逆にしている。',
      ],
      [
        '競技に近い長い練習を1回だけ確保し、他の日はすべて休む',
        '量を減らして競技強度を残せる案だが、長い枠を確保できないという条件に合わない。',
      ],
    ],
    explanation:
      'テーパーでは練習量と強度を別に調整する。このケースでは実績のある強度刺激を短く残し、練習量を減らす方法が、勤務による時間制約にも合う。',
    sourceRefs: [ref(taper)],
  }),
  advancedItem('planning', 8, {
    unitId: 'ex-plan-age',
    objectiveIds: ['ex-plan-age-o1'],
    level: 'analysis',
    prompt:
      '中学生の抵抗運動教室で、ある班は軽いゴブレットスクワットを習得した。別の班は同じ負荷でも動作が安定せず、個別の声かけが必要である。今日の担当者1名は、一度に1班を直接監督できる。両班に技能練習の時間を設ける運営案はどれか。',
    correct: [
      '抵抗運動を交代制にし、習得状況ごとに課題を決め、運動する班を直接監督する',
      '監督できる人数を守ったうえで、両班を同じ習得段階として扱わずに練習できる。',
    ],
    distractors: [
      [
        '不慣れな班を直接監督し、習得した班は同じ抵抗運動を別区画で自主練習する',
        '難しい班を優先できるが、別区画の抵抗運動を直接監督できない。',
      ],
      [
        '交代制で両班を監督し、班間比較のため両班とも同じ負荷を次段階へ増やす',
        '直接監督は確保できるが、不慣れな班は現段階の動作が安定しておらず、漸進の条件がそろわない。',
      ],
    ],
    explanation:
      '若年者の抵抗運動では適格な監督下で技能を習得し、習得状況に合わせて負荷を進める。監督配置と負荷設定の両方を調整する。',
    sourceRefs: [ref(youth)],
  }),
  advancedItem('planning', 9, {
    unitId: 'ex-plan-age',
    objectiveIds: ['ex-plan-age-o2'],
    level: 'analysis',
    prompt:
      '医療上の運動条件を共有済みの高齢者が、自宅の玄関の一段を安定して下りたい。支持物を使い低い台なら下りる動作を制御できるが、玄関と同じ高さでは、上る動作は安定しても下りるときだけ勢いがつく。初期練習の選択としてどれが最も適切か。',
    correct: [
      '支持物を使う低い台から下降を練習し、制御を確認して段の高さを調整する',
      '目標の下降動作を、本人が制御できる高さで練習できる。',
    ],
    distractors: [
      [
        '玄関と同じ高さで上る練習を増やし、上りの回数が増えた段階で下降を評価する',
        '下肢の練習にはなるが、確認された課題は下降時の制御であり、上りの改善だけでは評価できない。',
      ],
      [
        '低い台を使う条件は維持し、次回から支持物を外して下降を練習する',
        '高さは合うが、確認できた下降能力は支持がある条件でのもの。支持を外した条件は未確認である。',
      ],
    ],
    explanation:
      '生活課題のうち難しい局面を特定し、支持や可動範囲を本人の能力に合わせる。下降の質を評価してから次の段階を決める。',
    sourceRefs: [ref(older)],
  }),
  advancedItem('planning', 10, {
    unitId: 'program',
    objectiveIds: ['program-o2', 'program-o3'],
    level: 'analysis',
    prompt:
      '脳卒中後の利用者について、理学療法士は、個別監督下での座位ステッパーを許可した。連続すると4分でペダルを制御しにくくなるが、短く休むと再び安定する。施設は通常、集団で20分続けるメニューを行っている。共有された条件での初期計画はどれか。',
    correct: [
      '個別監督下で、制御を保てる短い区間と休息を交互に行い、反応を記録する',
      '監督条件と継続可能な時間を満たしながら、許可された有酸素活動を実施できる。',
    ],
    distractors: [
      [
        '個別監督下で、抵抗を下げて集団メニューと同じ20分の連続運動から始める',
        '監督は確保するが、抵抗を下げれば20分連続で制御できるという根拠がない。',
      ],
      [
        '集団の座位ステッパーに参加し、本人が4分ごとに自主的に休憩を取る',
        '短い区間を使う点は合うが、許可の前提となる個別監督が失われる。',
      ],
    ],
    explanation:
      '脳卒中後の有酸素運動では、機能やリスクに応じて監督と運動様式を選ぶ。連続実施が難しい場合は短い区間と休息を使い、本人の反応から次の時間を判断する。',
    sourceRefs: [
      {
        sourceId: stroke.id,
        locator: 'Format、Mode、How Long Should Each Aerobic Training Session Last?',
      },
    ],
  }),
  advancedItem('planning', 11, {
    unitId: 'program',
    objectiveIds: ['program-o2'],
    level: 'analysis',
    prompt:
      '脳卒中後の利用者の有酸素活動で、薬の変更後、同じ負荷でも心拍の上昇が小さくなった。担当の医療職から、変更前の目標心拍数は保留し、共有したBorg尺度と血圧・症状の確認条件を使うよう伝えられた。今日は主観的強度が指定範囲にあり、血圧と症状にも問題はない。どの記録と調整が適切か。',
    correct: [
      '共有された主観的強度と確認項目で判断し、心拍も併記して次の確認時に報告する',
      '現行の強度と監視条件を守りながら、薬の変更後に観察された反応も残せる。',
    ],
    distractors: [
      [
        '主観的強度を記録しながら、変更前の目標心拍数に届くまで出力を上げる',
        '変更前の心拍数を基準にすると、薬の影響で想定より強い運動になり得る。',
      ],
      [
        '主観的強度だけで進め、心拍・血圧・症状の確認を次回の医療評価まで省く',
        '主観的強度は判断に役立つが、共有された確認項目の代わりにはならない。',
      ],
    ],
    explanation:
      '心拍応答が薬で変化した場合にはRPEなどを強度指標に利用できる。強度指標を切り替えることと、血圧や症状の監視を省くことは別の判断である。',
    sourceRefs: [
      {
        sourceId: stroke.id,
        locator:
          'What Intensity of Aerobic Exercise Should Be Used?、What Should Be Monitored During Aerobic Exercise Training?',
      },
    ],
  }),
  advancedItem('planning', 12, {
    unitId: 'program',
    objectiveIds: ['program-o1', 'program-o3'],
    level: 'analysis',
    prompt:
      'パーキンソン病の利用者が狭い出入口で歩行を止めることがある。理学療法士と練習を共有し、広い通路では床の目印を使うと歩き出しやすいが、狭い出入口で同じ方法を試したことはない。次回の計画として適切なのはどれか。',
    correct: [
      '共有済みの条件で目印を使い、出入口に近い環境への移行と確認方法を理学療法士と調整する',
      '効果が観察された手がかりを維持し、環境が変わった場合の効果と安全性を別に確かめられる。',
    ],
    distractors: [
      [
        '広い通路での結果を根拠に、同じ目印で狭い出入口を単独練習する課題へ進める',
        '広い通路の結果だけでは、狭い環境での歩き出しや安全な単独実施を判断できない。',
      ],
      [
        '目印を使わずに広い通路での歩行時間を延ばし、出入口での変化は総歩行時間で評価する',
        '歩行時間は活動量の指標だが、狭い出入口での歩き出しという課題の達成を直接示さない。',
      ],
    ],
    explanation:
      '外的な視覚・聴覚の手がかりは、理学療法の中で歩行やすくみへの支援に用いられる。ある環境での反応をそのまま別環境に当てはめず、担当職と課題と評価条件を共有する。',
    sourceRefs: [ref(parkinson)],
  }),
  advancedItem('planning', 13, {
    unitId: 'ed3-plan-neuro',
    objectiveIds: ['ed3-plan-neuro-o1'],
    level: 'analysis',
    prompt:
      '脊髄損傷のある成人の体力向上計画を、医療職と合意済みの種目・強度で点検する。適切な強度の有酸素運動は週2回各20分。主要な機能筋群に対する抵抗運動は、月曜に各3セット、木曜に押す筋群と引く筋群が各3セットだが体幹の筋群は未実施だった。実施できる条件で、体力向上ガイドラインとの照合結果はどれか。',
    correct: [
      '有酸素運動の条件は満たす。抵抗運動は、体幹を対象とする2日目の計画を調整する',
      '抵抗運動の頻度は、全種目の合計日数ではなく主要な機能筋群ごとに確認する。',
    ],
    distractors: [
      [
        '有酸素運動の条件は満たす。抵抗運動も、全体で週2日実施しているので条件を満たす',
        '体幹を対象とした抵抗運動は月曜だけなので、筋群ごとにみると週2日に届いていない。',
      ],
      [
        '抵抗運動を全体で週2日行っているので、追加すべきなのは有酸素運動の3日目である',
        'このケースの目的は心肺体力と筋力の向上。有酸素運動は週2回各20分で照合条件を満たす。',
      ],
    ],
    explanation:
      '体力向上を目的とする指針では、有酸素運動の時間と頻度に加え、抵抗運動を主要な機能筋群ごとに週2回行う条件を確認する。個別の実施条件は医療職との合意を優先する。',
    sourceRefs: [ref(sci)],
  }),
  advancedItem('planning', 14, {
    unitId: 'program',
    objectiveIds: ['program-o2', 'program-o3'],
    level: 'analysis',
    prompt:
      'がん治療後の利用者は末梢神経障害があり、医療評価では安定した座位の有酸素活動と、手の不快感を確認しながらの軽い抵抗運動を始められるとされた。歩行では足元が不安定で、握るときには硬い細いグリップで不快感が増す。両方の活動を計画に残す案はどれか。',
    correct: [
      '固定式自転車を使い、抵抗運動では本人が扱いやすい握りや器具を選んで手の反応を確認する',
      '足元の安定と手の不快感を別々に考慮し、共有された両方の活動条件を守れる。',
    ],
    distractors: [
      [
        '固定式自転車を使い、抵抗運動はフォームが安定するよう細い硬い握りで統一する',
        '有酸素活動の条件は合うが、抵抗運動で確認されている手の不快感に対応していない。',
      ],
      [
        '握りやすい抵抗器具に変更し、有酸素活動は速度を落とした屋外歩行にする',
        '手の条件には対応するが、安定した座位での活動という評価条件から外れる。',
      ],
    ],
    explanation:
      '末梢神経障害の影響は、歩行時の安定性と抵抗器具を握るときの反応で分けて評価する。許可された範囲で運動様式と器具を調整する。',
    sourceRefs: [
      { sourceId: oncology.id, locator: 'Table 4 運動前評価、Table 5 Peripheral Neuropathy' },
    ],
  }),
  advancedItem('planning', 15, {
    unitId: 'program',
    objectiveIds: ['program-o1', 'program-o2'],
    level: 'analysis',
    prompt:
      '乳がん治療後で上肢リンパ浮腫のある利用者が、医療職から、条件を守れば抵抗運動を開始できると伝えられた。治療前には経験があるが、治療後の抵抗運動は未経験。週末は監督を受けられ、平日は自宅で一人になる。初期計画として適切なのはどれか。',
    correct: [
      '監督を受けられる日に軽い抵抗から始め、反応と医療職の条件を確認しながら段階的に進める',
      '治療後の負荷への反応を監督下で確かめ、治療前の実績だけで現在の負荷を決めない。',
    ],
    distractors: [
      [
        '軽い抵抗を選び、時間を確保しやすい平日に自宅で初回を行い、週末に記録を確認する',
        '低い負荷は妥当だが、開始時から監督なしで行う方法の安全性を、この資料の根拠からは判断できない。',
      ],
      [
        '週末に監督を受け、治療前に無理なく扱えた抵抗を初回から再現する',
        '監督はあるが、治療後の反応を確かめる前に以前の負荷を再現しており、段階的な導入にならない。',
      ],
    ],
    explanation:
      '乳がん治療後の上肢リンパ浮腫に対する合意文書では、監督下で低い負荷から漸進する抵抗運動の安全性が支持されている。別のがんや浮腫の部位に、そのまま広げて適用しない。',
    sourceRefs: [{ sourceId: oncology.id, locator: '2.3.5 Lymphedema、Table 4 運動前評価' }],
  }),
  advancedItem('planning', 16, {
    unitId: 'program',
    objectiveIds: ['program-o2', 'program-o3'],
    level: 'analysis',
    prompt:
      '慢性腎臓病があり転倒リスクの高い利用者に、医療職は歩行補助具と同伴者を伴う短い歩行、および一人でもできる軽い座位活動を許可した。来週は同伴者が週の前半に不在となる。本人は身体を動かさない時間が長く続くのを減らしたい。来週の活動と記録をどう組み立てるか。',
    correct: [
      '前半は許可された座位活動で不活動の時間を区切り、後半の同伴歩行とは種類を分けて記録する',
      '利用できる支援に合わせて実施でき、運動様式や強度を混同せず座位中の活動を記録できる。',
    ],
    distractors: [
      [
        '前半は歩行補助具を使って短い歩行を一人で行い、後半は同伴歩行に戻す',
        '歩行時間と補助具の条件は守れるが、転倒リスクに対して設定された同伴の条件を満たさない。',
      ],
      [
        '前半は座位活動、後半は同伴歩行を行い、時間はすべて中強度の歩行としてまとめる',
        '運動の選び方は条件に合うが、軽い座位活動を中強度の歩行と同じ記録にする根拠がない。',
      ],
    ],
    explanation:
      'KDIGOは耐容性と利用できる資源を考慮し、転倒リスクが高い人では医療職が運動の強度や種類を助言するよう求めている。支援が変わる日は許可済みの活動を選び、低強度の活動と中強度相当の量を区別する。',
    sourceRefs: [ref(ckd)],
  }),
];
