import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';
const unitId = 'ex-plan-metabolic';
export const planningBatch07Sources: Source[] = [
  {
    id: 'ex-plan-metabolic-ada2026',
    title:
      'ADA: Facilitating Positive Health Behaviors and Well-being—Standards of Care in Diabetes 2026',
    url: 'https://diabetesjournals.org/care/article-pdf/49/Supplement_1/S89/848861/dc26s005.pdf',
    edition: 'Diabetes Care 49(Suppl1)、2026年1月号、§5',
    checkedAt: planningCheckedAt,
    locator: '印刷S106–S107：Hypoglycemia、Figure5.2、Exercise in the Presence of Complications',
    note: '2026年最終公開版の該当本文を実読。トレーナーが投薬・補食量や血糖値の医学的許可を処方する目的ではない。',
  },
  {
    id: 'ex-plan-metabolic-chronic',
    title: '厚生労働省：慢性疾患を有する人の身体活動のポイント',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-007',
    edition: '身体活動・運動ガイド2023情報シート／2024-03-19更新',
    checkedAt: planningCheckedAt,
    locator: '1–3：安定した疾患、現状からの開始、医療者への相談、座位行動の中断',
    note: '状態が落ち着いた高血圧・2型糖尿病等を対象とする範囲を確認。急性状態へ一般推奨を転用しない。',
  },
  {
    id: 'ex-plan-metabolic-safety',
    title: '厚生労働省：身体活動・運動を安全に行うためのポイント',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-008',
    edition: '身体活動・運動ガイド2023情報シート／2024-03-19更新',
    checkedAt: planningCheckedAt,
    locator: '3.具体的な注意事項：3.毎回の運動前、4.運動中、5.運動後',
    note: '血圧・体調の確認とクールダウンの原則を実読。設問では診断用の血圧閾値や投薬変更を扱わない。',
  },
];
export const planningBatch07Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '糖尿病・高血圧と運動計画',
    subtitle: '合併症と治療条件を運動方法へ反映する',
    minutes: 28,
    level: '応用',
    objectives: [
      { id: `${unitId}-o1`, text: '糖尿病の治療と運動後の反応を、医療チームの管理計画へつなぐ' },
      { id: `${unitId}-o2`, text: '眼・足の合併症に応じて強度や荷重の条件を確認する' },
      {
        id: `${unitId}-o3`,
        text: '高血圧等の安定状態と当日の条件、整理運動、座位中断を計画へ反映する',
      },
    ],
    sections: [
      {
        title: '治療と一緒に活動を考える',
        body: '安定した慢性疾患でも活動の利益があるが、合併症や治療内容により条件が異なる。インスリンなどによる治療中は、運動中だけでなく終了後も低血糖が起こり得る。医療チームが作る確認・対応計画を本人と共有する。トレーナーが薬を減らす量や一律の補食量を決めない。',
      },
      {
        title: '運動すれば必ず血糖が下がるわけではない',
        body: '血糖反応は強度・時間・食事・治療などで変わり、強い活動で上昇する場合もある。運動を血糖値の自己処置として追加させず、共有された管理計画に沿って反応を記録する。終了直後に問題がなかったことだけで、後の影響まで否定しない。',
      },
      {
        title: '眼と足の条件を運動へ反映する',
        body: '増殖性または重い網膜症がある場合、強い有酸素・抵抗運動の前に眼科を含む医療評価が重要になる。末梢神経障害では適した靴と足の観察が必要で、痛みがないことだけで傷を否定できない。神経障害だけで全ての歩行を禁止するのではなく、開放創や足のけががあれば荷重活動を保留し医療者と非荷重の選択肢を確認する。',
      },
      {
        title: '当日と一日全体の計画',
        body: '高血圧の人では共有された実施条件、当日の体調と測定記録を確認する。運動を急に止めて終えるのではなく、負荷を下げた整理運動を計画する。週の運動だけでなく座り続ける時間も扱い、仕事中に短く立つ・歩く機会を設ける。休薬や降圧治療の調整は医療者の役割である。',
      },
    ],
    example: {
      situation:
        '糖尿病の人が足の感覚が鈍く、痛くないので新しい靴ずれがあっても歩行練習を続けたいと話す。',
      judgment:
        '痛みの有無だけで決めず、足の傷について医療者へつなぐ。荷重のある練習を保留し、可能な方法と条件を確認する。',
    },
    terms: [
      {
        term: '低血糖',
        meaning: '血糖が低下した状態。運動後にも起こり得るため個別の管理計画が必要。',
      },
      {
        term: '末梢神経障害',
        meaning: '末梢の感覚などに障害がある状態。痛みを感じにくい場合の足の保護が重要。',
      },
      {
        term: '非荷重活動',
        meaning: '問題のある足などへ体重を載せない方法の活動。可否や条件は医療者と確認する。',
      },
      {
        term: 'クールダウン',
        meaning: '終了時に強度を下げて循環などの変化を緩やかにする整理運動。',
      },
    ],
    sourceRefs: planningBatch07Sources.map((s) => ref(s.id, s.locator)),
  },
];
export const planningBatch07Questions = reviewedPlanningItems(
  unitId,
  planningBatch07Sources,
  '2026-11-04T12:28:23Z',
  [
    {
      number: 1,
      group: 'metabolic-delayed-hypoglycemia-plan',
      objective: 1,
      prompt:
        'インスリン治療中の利用者は夕方に運動した。運動直後の血糖は本人の管理計画の範囲内だが、前回は運動の数時間後に低血糖があった。運動条件や治療内容を変えず、今日の終了後の確認について相談された。トレーナーの対応はどれか。',
      options: [
        [
          '直後と前回の経過を区別して共有し、帰宅後の確認と対応を本人・医療チームの計画に沿って確かめる',
          '終了後に血糖への影響が続く場合があるため、直後の値と前回の遅い反応の両方を考慮する。',
        ],
        [
          '直後の値を記録し、前回より正常に近いので帰宅後は症状が出てから測定する計画に切り替える',
          '直後の値だけで後の変化を除外できず、症状が出るまで確認を待つよう個別計画を変える根拠がない。',
        ],
        [
          '帰宅後にも測定するが、前回の低血糖が出た時刻だけを測定時刻として設定する',
          '終了後にも確認する視点は妥当だが、一度の発生時刻を今後の確認時刻に固定する根拠はない。',
        ],
      ],
      explanation:
        'インスリン使用中は、運動後のインスリン感受性の変化に伴い、低血糖が数時間後にも起こり得る。発生時刻や対処をトレーナーが独自に決めず、個人の血糖確認と対応計画を使う。',
      refs: [
        ref(
          'ex-plan-metabolic-ada2026',
          '印刷S105–S107 Hypoglycemia：insulin/secretagogues、postbout effect、数時間後の影響',
        ),
      ],
      verification:
        'ADA 2026のHypoglycemia本文で運動後数時間の影響と個人差を再確認。症状待ちと、前回の時刻だけに固定する案を区別した。',
    },
    {
      number: 2,
      group: 'metabolic-retinopathy-intense-clearance',
      objective: 2,
      prompt:
        '医療者から増殖糖尿病網膜症があると共有された人が、強い抵抗運動を始めたいと言う。適切な計画手順はどれか。',
      options: [
        [
          '強い運動を始める前に、眼科を含む医療者へ強度や種目の条件を確認する',
          '強い運動で眼の合併症のリスクを考慮する必要がある。',
        ],
        [
          '軽い重量へ変更して限界までの高反復を行い、眼科条件の確認は後にする',
          '重量を下げても限界までの強い努力を伴うため、眼科を含む医学的条件の確認を代替しない。',
        ],
        [
          '最近の血糖記録が良ければ、眼の合併症に関する確認は省いて始める',
          '現在の血糖記録だけでは既に共有された網膜症の運動条件を判断できない。',
        ],
      ],
      explanation:
        'すべての活動を永久に禁止する判断ではなく、強い活動に関する医学的条件を明確にする。',
      refs: [
        ref(
          'ex-plan-metabolic-ada2026',
          '印刷S107 Retinopathy：proliferative/severe nonproliferative、vigorous activity、ophthalmologist',
        ),
      ],
      verification:
        '網膜症と強い努力の条件を実読し、軽量高反復の限界努力/血糖記録による眼の確認省略を再照合。',
    },
    {
      number: 3,
      group: 'metabolic-neuropathy-foot-protection',
      objective: 2,
      prompt:
        '足に開放創はなく、条件付きで歩行可能とされた末梢神経障害のある人の計画で、追加すべき配慮はどれか。',
      options: [
        [
          '適した履物と日々の足の観察を確認し、傷の早期発見につなげる',
          '感覚低下がある場合の足の保護に合う。',
        ],
        [
          '歩行中の痛みを毎回聞き、足の皮膚は痛みを訴えた時点で確認する',
          '痛覚低下があるため、痛みを皮膚の観察を始める条件にしない。',
        ],
        [
          'クッションのある靴を使い、足の状態確認を週末の一回にまとめる',
          '履物は重要だが、傷の早期発見に必要な日々の観察を週一回へ置き換えている。',
        ],
      ],
      explanation:
        '足の感覚と皮膚を守りながら、許可された活動を考える。傷があれば同じ計画のまま進めない。',
      refs: [
        ref(
          'ex-plan-metabolic-ada2026',
          '印刷S107 Peripheral Neuropathy：proper footwear、daily examination、moderate walking',
        ),
      ],
      verification:
        '履物・毎日の観察を実読し、痛みを待つ確認/週一回だけの確認という不十分な運用を再照合。',
    },
    {
      number: 4,
      group: 'metabolic-open-foot-wound-loading',
      objective: 2,
      prompt:
        '糖尿病と末梢神経障害のある人に、新しい足の開放創が見つかった。予定していた歩行運動の扱いはどれか。',
      options: [
        [
          '荷重する練習を保留して医療者へつなぎ、非荷重方法の可否と条件を確認する',
          '足のけがや開放創では荷重を避ける条件が重要になる。',
        ],
        [
          '歩行を短い時間へ分けて、同じ荷重活動を続ける',
          '時間を分けても開放創のある足へ荷重する条件は残る。',
        ],
        [
          '着地衝撃を減らすため、確認前に歩行を立位のクロストレーナーへ変える',
          '衝撃を減らしても足への荷重は残るため、開放創の非荷重条件の代替にならない。',
        ],
      ],
      explanation:
        '新しい傷は、傷がない人の歩行可能条件から外れる。トレーナーが処置や治癒判定を担わない。',
      refs: [
        ref(
          'ex-plan-metabolic-ada2026',
          '印刷S107 Peripheral Neuropathy末：foot injury/open sore、non-weight-bearing',
        ),
      ],
      verification:
        '開放創の非荷重条件を実読し、短時間への分割/低衝撃だが荷重する様式では条件を満たさない点を再照合。',
    },
    {
      number: 5,
      group: 'metabolic-glucose-response-not-uniform',
      objective: 1,
      prompt:
        '糖尿病のある参加者が「強く運動するほど血糖は必ず下がる」と考え、医療者の管理計画にない高強度インターバルを自己処置として加えようとした。適切な説明はどれか。',
      options: [
        [
          '強い運動で血糖が上がる場合もあり、反応を一律に決めず共有計画を守る',
          '強度や治療・開始時の状態で血糖の反応は異なる。',
        ],
        [
          '高強度を避ければ処置として使えると考え、共有計画外の長時間運動へ変える',
          '強度を下げるだけで、治療や食事、長時間の影響を含む個別管理を代替できない。',
        ],
        [
          '同じ診断名の参加者の血糖変化を目安にして、本人の反応の記録を省く',
          '同じ診断名でも治療や開始時の状態等で反応は異なり、本人の記録が必要である。',
        ],
      ],
      explanation:
        '運動をその場の血糖処置として一律に処方しない。医療チームの確認方法に沿って反応を共有する。',
      refs: [
        ref(
          'ex-plan-metabolic-ada2026',
          '印刷S107 Hypoglycemia：HIITで血糖が上がる場合、反応の変動とmonitoring',
        ),
      ],
      verification:
        '強度で反応が変わることと個別管理を実読し、長時間への自己処置変更/他人の反応の転用を再照合。',
    },
    {
      number: 6,
      group: 'metabolic-written-bp-hold-condition',
      objective: 3,
      prompt:
        '高血圧治療中の人について、医療者から当日の測定値が指定条件に当たる場合は運動を見合わせて連絡する計画が共有されている。本日の値がその条件に当たった。予定メニューの扱いはどれか。',
      options: [
        [
          '共有された条件に従って見合わせ、医療者への連絡手順を使う',
          '当日の状態を既存の実施条件へ反映する。',
        ],
        [
          '先週より負荷を下げて実施し、終了時の測定で医療者への連絡を判断する',
          '開始前の見合わせ・連絡という共有条件を、負荷減少や終了後確認へ変更している。',
        ],
        [
          'ウォームアップを長めに行ってから再測定し、連絡前に実施を始める',
          '運動前に見合わせて連絡する条件があるため、運動を先に始めて条件を回避しない。',
        ],
      ],
      explanation:
        'ここでは診断の閾値を暗記するのではなく、既に共有された実施条件を適用する。本人の症状と必要な緊急対応も確認する。',
      refs: [
        ref('ex-plan-metabolic-safety', '3.3 毎回の運動前：体調・血圧・脈拍の確認と高血圧時の注意'),
      ],
      verification:
        '当日の確認と過度の高血圧時の運動見合わせを実読。数値は処方せず、独自の共有計画への適用と誤答を照合。',
    },
    {
      number: 7,
      group: 'metabolic-cooldown-transition',
      objective: 3,
      prompt:
        '高血圧治療中で運動可能な条件が共有された成人の有酸素セッションを作る。終了直前まで同じ負荷を続け、急に止めて終える案への修正はどれか。',
      options: [
        [
          '低い強度の動的運動へ段階的に移る整理運動を組み込む',
          '急停止に伴う循環の変化を緩やかにする目的がある。',
        ],
        [
          '最後の負荷のまま終え、座って静的ストレッチする時間を代わりに入れる',
          '急停止後の静的な姿勢は、低強度の動的運動へ徐々に移る方法と同じではない。',
        ],
        [
          '運動中の休憩を多くしておき、終了部分の負荷は変えずに止める',
          '途中の休憩を増やしても、最後に急停止する際の循環の変化への配慮を代替しない。',
        ],
      ],
      explanation:
        '終了部分もセッション計画の一部にする。整理運動だけですべての循環器リスクがなくなるとは説明しない。',
      refs: [
        ref(
          'ex-plan-metabolic-safety',
          '3.5 運動後：急停止による血圧低下等、低・中強度の動的クールダウン',
        ),
      ],
      verification:
        '急停止と動的整理運動を実読し、停止後の静的ストレッチ/途中の休憩だけへの置換を再照合。',
    },
    {
      number: 8,
      group: 'metabolic-sedentary-breaks-workday',
      objective: 3,
      prompt:
        '安定した2型糖尿病の人は週の運動を実施しているが、仕事中は何時間も座り続ける。日常の計画へ追加する案はどれか。',
      options: [
        [
          '可能な範囲で短い立位や歩行の機会を設け、長い座位を中断する',
          '運動習慣と座り続ける行動を別に扱う。',
        ],
        [
          '仕事中は変えずに、夜の運動時間を追加して座位中断の代わりとする',
          '夜の運動追加は仕事中の座り続けるパターンそのものを中断しない。',
        ],
        [
          '週末だけ長時間立つ計画にし、平日の連続座位をまとめて相殺する',
          '別の日の立位時間を増やしても、平日の長い連続座位を中断する計画にはならない。',
        ],
      ],
      explanation:
        '活動を増やす時間と座位を中断する時間の両方を実行可能な形へ落とす。合併症や職場条件へ合わせる。',
      refs: [
        ref('ex-plan-metabolic-chronic', '要点と具体例：座位が長くなりすぎない、中断する'),
        ref('ex-plan-metabolic-ada2026', '印刷S106 Figure5.2：breaking up prolonged sitting'),
      ],
      verification:
        '座位中断と24時間行動を実読し、夜の運動追加/週末立位では仕事中の連続座位を変えない点を再照合。',
    },
  ],
);
