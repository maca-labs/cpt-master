import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';
const unitId = 'ex-plan-pregnancy';
export const planningBatch06Sources: Source[] = [
  {
    id: 'ex-plan-pregnancy-faq',
    title: 'ACOG: Exercise During Pregnancy (FAQ119)',
    url: 'https://www.acog.org/womens-health/faqs/exercise-during-pregnancy',
    edition: '2024年9月更新、2025年11月最終レビュー',
    checkedAt: planningCheckedAt,
    locator: 'Safety and Benefits / Guidelines / Precautions / Exercising Safely / Warning signs',
    note: '公式ページの検索取得本文を実読。直接取得は402だったため閲覧経路を区別。医療者への相談を前提とする一般説明。',
  },
  {
    id: 'ex-plan-pregnancy-clinical',
    title:
      'ACOG Committee Opinion No.804: Physical Activity and Exercise During Pregnancy and the Postpartum Period',
    url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period',
    edition: 'Committee Opinion 804、2020年4月の公開本文',
    checkedAt: planningCheckedAt,
    locator: 'Anatomic and Physiologic Aspects / Fetal Response / Box3 Warning Signs',
    note: '公式検索本文の仰臥位と静脈還流、環境、段階的進行、中止徴候を実読。再承認年月は確認できず推測しない。FAQ119の確認版と併用。',
  },
  {
    id: 'ex-plan-pregnancy-postpartum',
    title: 'ACOG: Exercise After Pregnancy (FAQ131)',
    url: 'https://www.acog.org/womens-health/faqs/exercise-after-pregnancy',
    edition: '2022年9月更新、2024年10月最終レビュー',
    checkedAt: planningCheckedAt,
    locator: 'Starting to Exercise：再開時期、帝王切開・合併症、段階的な追加',
    note: '公式検索取得本文を実読。一般的再開の説明を個々の分娩後の許可や固定日程へ置き換えない。',
  },
];
export const planningBatch06Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '妊娠期・産後の運動計画',
    subtitle: '産科の条件と身体の変化に合わせて継続を支える',
    minutes: 25,
    level: '応用',
    objectives: [
      {
        id: `${unitId}-o1`,
        text: '正常な妊娠での活動継続・開始を、既往の活動と医療者の条件から考える',
      },
      { id: `${unitId}-o2`, text: '転倒、暑熱、長い仰臥位のリスクに合わせて種目と環境を調整する' },
      { id: `${unitId}-o3`, text: '中止徴候と産後再開の個別条件を区別し、必要な医療連携を選ぶ' },
    ],
    sections: [
      {
        title: '一般推奨と個別の許可を分ける',
        body: '健康で正常な妊娠では、定期的な活動を開始・継続する利益がある。妊娠初期の受診などで活動を相談し、産科の条件を共有する。合併症や禁忌の評価は医療者の役割であり、トレーナーが正常妊娠と診断したり、診療上の制限を解除したりしない。',
      },
      {
        title: '経験から出発点を決める',
        body: 'ACOGは妊娠期の中強度有酸素活動について週150分以上を一般的な目安として示すが、未経験者へ最初から全量を課す意味ではない。少量から段階的に増やす。妊娠前から活動的な人は、医療者の承認と状況に応じた変更のもとで継続できる場合がある。既往の経験だけで上限がなくなるわけではない。',
      },
      {
        title: '種目と姿勢、環境を変える',
        body: '体の前側の重量増加や重心の変化で転倒しやすくなる。固定式自転車など、目的を保ちつつ転倒リスクを下げる方法を検討する。高温多湿やホットヨガを避け、水分と冷却環境を整える。長い仰臥位や静止立位は循環への影響に注意し、産科条件に合う姿勢へ変更する。',
      },
      {
        title: '症状と産後の再開',
        body: '性器出血、液体の漏出、胸痛、失神感などの警告徴候があれば中止し、医療者へ連絡する。症状を診断するために運動を続けない。産後は分娩様式、合併症、回復状況によって再開が異なる。帝王切開や合併症があれば再開時期を産科へ確認し、許可された範囲で段階的に進める。',
      },
    ],
    example: {
      situation: '妊娠前から屋外自転車を行う人が、腹部の変化でバランスを取りにくいと話す。',
      judgment:
        '以前できたことを強制せず、産科の条件を確認して固定式などへ変更する。症状があれば練習より評価を優先する。',
    },
    terms: [
      {
        term: '産科の運動条件',
        meaning: '妊娠・分娩と合併症を評価する医療者から共有される活動の条件。',
      },
      { term: '仰臥位', meaning: 'あおむけの姿勢。妊娠期は長く保つ場合の循環への影響に注意する。' },
      { term: '静脈還流', meaning: '体から心臓へ静脈血が戻ること。姿勢の影響を受け得る。' },
      { term: '産後の段階的再開', meaning: '回復状態と医療条件へ合わせ、活動を少しずつ戻すこと。' },
    ],
    sourceRefs: planningBatch06Sources.map((s) => ref(s.id, s.locator)),
  },
];
export const planningBatch06Questions = reviewedPlanningItems(
  unitId,
  planningBatch06Sources,
  '2026-11-04T12:28:23Z',
  [
    {
      number: 1,
      group: 'pregnancy-uncomplicated-activity',
      objective: 1,
      prompt:
        '産科で正常な妊娠と評価され、運動条件を共有された人が、妊娠したら日常の定期的な運動はすべて避けるべきか尋ねた。適切な説明はどれか。',
      options: [
        [
          '健康で正常な妊娠では活動に利益があり、共有条件に沿って計画できる',
          'ACOGは正常な妊娠での定期的な身体活動の開始・継続を支持する。',
        ],
        [
          '運動条件が共有されていても、安定期と呼ばれる時期まで定期的な活動を待つ',
          '正常な妊娠で活動可能な条件がある人を、時期の呼び名だけで待機させる説明にはならない。',
        ],
        [
          '妊娠中の計画は柔軟性練習へ置き換え、有酸素や筋力の活動は産後へ回す',
          '共有条件の範囲で有酸素等も検討でき、妊娠だけを理由にその要素を外す必要はない。',
        ],
      ],
      explanation:
        '一般的な利益と個別の条件は両立する。本人の妊娠の状態をトレーナーが診断する問題ではない。',
      refs: [
        ref(
          'ex-plan-pregnancy-faq',
          'Is it safe to exercise during pregnancy?：healthy/normal pregnancyとob-gynへの相談',
        ),
      ],
      verification: '正常妊娠での活動と相談を実読し、時期名のみの待機/柔軟性だけへの置換を再照合。',
    },
    {
      number: 2,
      group: 'pregnancy-new-exerciser-progression',
      objective: 1,
      prompt:
        '妊娠前はほとんど運動しておらず、産科から少量での活動開始条件が共有された。ACOGの週150分という目安を計画へ使う方法はどれか。',
      options: [
        [
          '少量から始め、状態を確認して段階的に活動を増やす',
          '未経験者はゆっくり始めるという条件に対応する。',
        ],
        [
          '初週から30分を週5日へ分けて設定し、少量での開始条件より週目標を優先する',
          '分割しても未経験者の少量開始という共有条件を置き換えられない。',
        ],
        [
          '平日は休み、週末の一回に週目標の150分をまとめる',
          '時間確保の工夫であっても少量から段階的に始める条件に合わない。',
        ],
      ],
      explanation:
        '週の目安と初回の量は同じではない。症状や医療上の条件があればその条件を優先する。',
      refs: [
        ref(
          'ex-plan-pregnancy-faq',
          'How much should I exercise?：週150分、new to exerciseはslowly/gradually',
        ),
      ],
      verification:
        '目標量と初心者の進行を併読し、初週から全週量/週末への集中という配分違いの誤答を再照合。',
    },
    {
      number: 3,
      group: 'pregnancy-experienced-continuation',
      objective: 1,
      prompt:
        '妊娠前から走っていた人が、正常な妊娠と評価され、担当産科医へ活動を相談する。継続の考え方はどれか。',
      options: [
        [
          '産科の承認と必要な修正のもとで継続できる場合がある',
          '経験者が承認のもとで継続する可能性が示される。',
        ],
        [
          '妊娠前の週間量の半分に固定し、承認後の体調に応じた見直しをしない',
          '割合を機械的に固定するだけでは、経験と妊娠の変化に応じた個別の調整にならない。',
        ],
        [
          '正常妊娠でも走る活動の再開は産後へ延ばし、経験を計画へ使わない',
          '経験者は承認のもとで継続できる場合があり、妊娠だけで走行を外す判断ではない。',
        ],
      ],
      explanation:
        '経験は出発点を考える情報で、無制限な実施の許可ではない。以前の記録への固執より現在の状態を扱う。',
      refs: [
        ref(
          'ex-plan-pregnancy-faq',
          'How much? / safe exercises：very active、experienced runnerとob-gynの承認',
        ),
      ],
      verification:
        '経験者の継続条件を実読し、固定割合だけで再評価しない案/妊娠のみで走行を産後へ延ばす案を再照合。',
    },
    {
      number: 4,
      group: 'pregnancy-fall-risk-modality',
      objective: 2,
      prompt:
        '産科条件の範囲で有酸素運動を続ける人が、妊娠の進行で屋外自転車のバランスに不安を感じている。目的を保ちやすい変更案はどれか。',
      options: [
        [
          '固定式自転車など転倒リスクを下げる方法を検討する',
          '重心・バランスの変化に合わせた選択になる。',
        ],
        [
          '屋外自転車の速度を少し落とし、乗車中のバランスは従来どおり求める',
          '速度調整だけより、転倒の不安がある支持条件そのものを変える固定式を検討する。',
        ],
        [
          '乗車の前後にバランス練習を加え、現在の屋外走行を続ける',
          '前後の練習だけでは走行中のバランス変化を解決できず、現在のリスクを残す。',
        ],
      ],
      explanation:
        '種目名を守ることより、目的と条件へ合う方法を選ぶ。固定式でも設定、症状、医療条件の確認は必要である。',
      refs: [ref('ex-plan-pregnancy-faq', 'Balance / safe exercises：stationary bicycling')],
      verification:
        '重心と固定式自転車を実読し、速度だけ/前後の練習だけでは走行中の支持条件が残る点を再照合。',
    },
    {
      number: 5,
      group: 'pregnancy-heat-environment',
      objective: 2,
      prompt:
        '妊娠中の参加者が、同じ動作なら高温のホットヨガでも通常室温と同じ条件だと考えている。計画の判断はどれか。',
      options: [
        [
          '過熱を避け、温度調整と水分に配慮した環境・内容へ変更する',
          '暑熱・湿度と過熱は種目の動作とは別の条件になる。',
        ],
        [
          '高温室はそのままで、動作の可動域だけを小さくする',
          '機械的な動作要求を下げても、過熱を避ける環境の条件は未解決である。',
        ],
        [
          '水を多めに準備し、同じ高温クラスへ参加する',
          '水分確保は重要だが、ホットヨガの過熱リスクを避ける条件の代替にはならない。',
        ],
      ],
      explanation:
        '外見上の運動強度だけで環境リスクを判断しない。水分と環境を整え、症状があれば中止する。',
      refs: [
        ref('ex-plan-pregnancy-faq', 'Precautions：overheatingと水分／avoid：hot yoga'),
        ref(
          'ex-plan-pregnancy-clinical',
          'Anatomic and Physiologic Aspects：high heat/humidity、hydration',
        ),
      ],
      verification:
        '公式の暑熱・水分を実読し、可動域だけ/水分だけの変更で高温環境を残す案を再照合。',
    },
    {
      number: 6,
      group: 'pregnancy-prolonged-supine',
      objective: 2,
      prompt:
        '妊娠後半の人へ、長時間あおむけを保つ種目を計画している。産科条件の確認とともに必要な考え方はどれか。',
      options: [
        [
          '子宮による静脈還流への影響を考え、長い仰臥位を避ける修正を検討する',
          '長い仰臥位では循環への影響を考慮する。',
        ],
        [
          '足を動かす種目なら、長い仰臥位も静脈還流の配慮を外して計画する',
          '下肢を動かすことだけで、子宮による大血管圧迫への配慮を除外できない。',
        ],
        [
          '体幹の筋活動を弱くすれば、あおむけを保つ時間は変えずに済むとする',
          '筋活動の強度を下げても、長い仰臥位という姿勢条件は残る。',
        ],
      ],
      explanation:
        '姿勢の変更は見た目の難しさだけでなく循環面からも検討する。めまい等があれば姿勢の工夫だけで続行せず、中止・医療連携を優先する。',
      refs: [
        ref(
          'ex-plan-pregnancy-clinical',
          'Anatomic and Physiologic Aspects：supineとaortocaval compression',
        ),
        ref('ex-plan-pregnancy-faq', 'Precautions：長い仰臥位・静止立位と血液の戻り'),
      ],
      verification:
        '仰臥位の圧迫と還流の説明を実読し、下肢運動/筋活動の低下だけで姿勢条件を外す推論を再照合。',
    },
    {
      number: 7,
      group: 'pregnancy-warning-bleeding',
      objective: 3,
      prompt: '妊娠中の運動参加者が、新しい性器出血と液体の漏れを訴えた。指導者の対応はどれか。',
      options: [
        [
          '運動を中止し、速やかに産科へ連絡・受診につなげる',
          'ACOGが挙げる中止・医療連絡の徴候である。',
        ],
        [
          '運動強度を半分にすれば評価なしで継続できるとする',
          '警告徴候を負荷調整だけで処理している。',
        ],
        [
          'その日は休ませ、次の定期健診で相談するまで連絡を待つ',
          '出血や液体漏出はその時点で産科へ連絡すべき警告徴候で、定期健診まで待たせない。',
        ],
      ],
      explanation:
        '症状の重さに応じて救急手順も用い、安全確保を優先する。経験者でも警告徴候の扱いは変わらない。',
      refs: [
        ref(
          'ex-plan-pregnancy-faq',
          'What are warning signs?：bleeding、fluid leakage、stop and call',
        ),
        ref('ex-plan-pregnancy-clinical', 'Box3：vaginal bleeding / amniotic fluid leakage'),
      ],
      verification:
        '警告徴候とstop/callを実読し、減量で続行/休養だけで定期健診まで待つ案を再照合。',
    },
    {
      number: 8,
      group: 'pregnancy-postpartum-delivery-context',
      objective: 3,
      prompt:
        '帝王切開で出産した人が、友人が出産直後に始めた練習と同じ日程で再開したいと言う。適切な計画はどれか。',
      options: [
        [
          '産科へ再開時期と条件を確認し、自分の回復に合わせて段階的に戻す',
          '分娩様式や合併症で再開条件が異なる。',
        ],
        [
          '友人のメニューを短時間へ減らして、同じ日から再開する',
          '量を減らしても、本人の帝王切開後の再開条件が未確認である。',
        ],
        [
          '妊娠前の週間量の半分なら術後条件の確認前でも開始できると考える',
          '過去の量から計算した割合だけでは、創の回復等を含む本人の再開条件を決められない。',
        ],
      ],
      explanation:
        '産後という一つの分類だけで日程を固定しない。痛みなどがあれば中止し、必要な評価へつなげる。',
      refs: [
        ref(
          'ex-plan-pregnancy-postpartum',
          'When can I start?：cesarean/complications、guidelines：gradually add',
        ),
      ],
      verification:
        '帝王切開後の相談を実読し、友人の短縮メニュー/妊娠前量の固定割合では再開条件を代替しない点を再照合。',
    },
  ],
);
