import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';
const unitId = 'ex-plan-orthopedic';
export const planningBatch08Sources: Source[] = [
  {
    id: 'ex-plan-ortho-arthritis',
    title: 'AAOS OrthoInfo Basics: Arthritis',
    url: 'https://orthoinfo.aaos.org/globalassets/pdfs/arthritis.pdf',
    edition: 'PDF著作権表示2019、閲覧時公開版',
    checkedAt: planningCheckedAt,
    locator: '印刷p.2：Exercise／p.3：症状悪化時のdoctorとの相談',
    note: '運動様式と医療連携の説明だけを参照。薬・手術の項目をトレーナーの処方に使わない。',
  },
  {
    id: 'ex-plan-ortho-knee',
    title: 'AAOS: The Management of Osteoarthritis of the Knee—Plain Language Summary',
    url: 'https://orthoinfo.aaos.org/globalassets/pdfs/the-management-of-osteoarthritis-of-the-knee-pls_final.pdf',
    edition: '閲覧時の2ページ公開最終ファイル、本文に発行年の表示なし',
    checkedAt: planningCheckedAt,
    locator: 'p.1：What are treatment options?—supervised/unsupervised/water exercises',
    note: '表紙や本文で版年月を確認できず推測しない。運動提供形態の選択肢だけを参照。',
  },
  {
    id: 'ex-plan-ortho-hip',
    title: 'AAOS: Activities After Total Hip Replacement',
    url: 'https://www.orthoinfo.org/recovery/activities-after-hip-replacement',
    edition: '閲覧時英語公開版、更新年月表示なし',
    checkedAt: planningCheckedAt,
    locator: 'Dos and Don’ts to Protect Your New Hip：術式・術者による個別の注意事項',
    note: '一律の角度・期間を適用せず、外科医と理学療法士の個別条件を参照する。',
  },
  {
    id: 'ex-plan-ortho-bone',
    title:
      'Strong, steady and straight: UK consensus statement on physical activity and exercise for osteoporosis',
    url: 'https://bjsm.bmj.com/content/bjsports/56/15/837.full.pdf?with-ds=yes',
    edition: 'Br J Sports Med 56:837–846、2022-05-16オンライン先行公開',
    checkedAt: planningCheckedAt,
    locator: '印刷p.837 Abstract：高い脊柱屈曲、椎体骨折等の衝撃、専門的助言',
    note: '原著者による合意声明の公式検索取得本文を実読。直接取得403と区別。抄録で確認した一般原則の範囲で使用。',
  },
  {
    id: 'ex-plan-ortho-ankle',
    title: 'AAOS: Ankle Fractures (Broken Ankle)',
    url: 'https://www.orthoinfo.org/diseases--conditions/ankle-fractures-broken-ankle/',
    edition: '閲覧時英語公開版、更新年月表示なし',
    checkedAt: planningCheckedAt,
    locator: 'Recovery From Ankle Fractures—Rehabilitation：荷重開始の医師指示',
    note: '経過週数だけで治癒・全荷重可否を判断しない。個別の指示を守る原則を実読。',
  },
  {
    id: 'ex-plan-ortho-shoulder',
    title: 'AAOS: Rotator Cuff and Shoulder Conditioning Program',
    url: 'https://orthoinfo.aaos.org/globalassets/pdfs/rotator-cuff-and-shoulder-conditioning-program-2025.pdf',
    edition: '2025を含む公式ファイル名、本文に改訂月表示なし',
    checkedAt: planningCheckedAt,
    locator: 'Introduction1：監督、種目選択の相談、Do not ignore pain',
    note: '一般プログラムの数値や種目を術後全員へ転用せず、許可条件の確認と痛みへの対応のみ参照。',
  },
  {
    id: 'ex-plan-ortho-back',
    title: 'WHO releases guidelines on chronic low back pain',
    url: 'https://www.who.int/news/item/07-12-2023-who-releases-guidelines-on-chronic-low-back-pain',
    edition: 'WHOガイドライン2023の公式解説、2023-12-07',
    checkedAt: planningCheckedAt,
    locator: '推奨介入とperson-centred / physical, psychological, social factorsの段落',
    note: '医療者が慢性一次性腰痛と評価した成人の支援原則。トレーナーによる原因診断や心理療法の実施を認める資料ではない。',
  },
  {
    id: 'ex-plan-ortho-mhlw',
    title: '厚生労働省：慢性疾患を有する人の身体活動のポイント',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-007',
    edition: '身体活動・運動ガイド2023情報シート／2024-03-19更新',
    checkedAt: planningCheckedAt,
    locator: '要点：状態が落ち着いている対象、合併症・運動器の痛みや変形の相談',
    note: '安定状態への推奨と、痛み・変形などの追加評価を区別する。',
  },
];
export const planningBatch08Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '整形外科的制約と医療連携',
    subtitle: '運動を続ける方法と、条件を確認し直す場面を選ぶ',
    minutes: 27,
    level: '応用',
    objectives: [
      { id: `${unitId}-o1`, text: '安定した関節症で、衝撃や提供環境を調整して活動を計画する' },
      { id: `${unitId}-o2`, text: '術後・骨折・骨粗鬆症の個別条件を運動の姿勢・荷重へ反映する' },
      { id: `${unitId}-o3`, text: '痛みや状態の変化、慢性腰痛の多面的支援で専門職と連携する' },
    ],
    sections: [
      {
        title: '疾患名だけで休止か高負荷かを決めない',
        body: '安定した関節症では、運動を行う利益と実行方法を検討する。医療上の条件に応じて、ランニングなどの衝撃のある活動から自転車や水中活動へ変える方法がある。膝関節症の運動には監督下、本人が行う方法、水中などの選択肢があり、条件と習得状況を確認して続けやすくする。',
      },
      {
        title: '術後と骨折では個別条件が先',
        body: '人工股関節後の注意事項は術式や術者の方針で異なる。他人の角度や期間をコピーせず、本人の外科医・理学療法士の条件を共有する。足関節骨折後も荷重開始は個別の指示による。痛みが減った、装具を外した、一定の週数が過ぎたことだけで全荷重へ進めない。',
      },
      {
        title: '骨の脆弱性に合わせて動作を調整する',
        body: '骨粗鬆症では骨と筋のための活動を支えつつ、脊柱を大きく曲げる姿勢や負荷の条件に注意する。特に椎体骨折の既往や複数の脆弱性骨折があれば専門的助言と個別化が重要になる。日常の小さな前屈をすべて危険と説明するのではなく、高い屈曲や不適切な負荷を避ける方法を確認する。',
      },
      {
        title: '変化を評価へ戻す',
        body: 'リハビリテーション用の一般資料を、本人への治療計画と同一視しない。医療者が定めた痛みのない実行条件などを守り、新しい痛みがあれば確認する。慢性一次性腰痛の支援は身体面だけでなく心理・社会面も含む個別の組合せが重要とWHOは説明する。トレーナーは担当範囲を守り、必要な専門職へつなぐ。',
      },
    ],
    example: {
      situation:
        '人工股関節後の人が、別の患者向けの運動表を持参し、同じ可動域制限を使いたいと言う。',
      judgment:
        '本人の術式・経過とリハビリの条件を確認する。運動表は一般的な参考として扱い、制限の追加や解除を独断でしない。',
    },
    terms: [
      {
        term: '低衝撃活動',
        meaning: '着地などの衝撃が比較的小さい方法の活動。個別の実行条件の確認は必要。',
      },
      { term: '荷重条件', meaning: '患部に体重や外部負荷をどの程度載せてよいかという個別の条件。' },
      {
        term: '椎体骨折',
        meaning: '脊椎の椎体に起こる骨折。既往がある場合は運動の個別条件を確認する。',
      },
      {
        term: '慢性一次性腰痛',
        meaning:
          '医療者が基礎疾患などを評価したうえで扱う慢性腰痛の区分。トレーナーが自己診断する分類ではない。',
      },
    ],
    sourceRefs: planningBatch08Sources.map((s) => ref(s.id, s.locator)),
  },
];
export const planningBatch08Questions = reviewedPlanningItems(
  unitId,
  planningBatch08Sources,
  '2026-11-04T12:23:10Z',
  [
    {
      number: 1,
      group: 'ortho-oa-impact-modality',
      objective: 1,
      prompt:
        '安定した膝関節症の成人は、医療者から衝撃を減らして有酸素運動を続ける条件を共有された。現在のランニングに代わる第一候補はどれか。',
      options: [
        [
          '症状と条件に合う自転車運動や水中活動を検討する',
          '衝撃を下げつつ有酸素運動という目的を保ちやすい。',
        ],
        [
          '走る時間を半分にして、その分だけ速度を上げる',
          '時間は減るが、衝撃を減らすという共有条件への適応になりにくい。',
        ],
        [
          'ジャンプを短いセットへ分け、同じ有酸素時間を確保する',
          '分割だけでは衝撃の条件を下げていない。',
        ],
      ],
      explanation:
        'ここでは体力向上の有無より、共有された衝撃の条件に合う様式を選ぶ。実施後の反応も確認する。',
      refs: [
        ref(
          'ex-plan-ortho-arthritis',
          '印刷p.2 Exercise：高衝撃からwalking/cycling/swimmingへの変更',
        ),
      ],
      verification: '衝撃を下げる運動変更を実読し、時間だけ短くして速度/着地を残す案を条件と照合。',
    },
    {
      number: 2,
      group: 'ortho-oa-delivery-continuity',
      objective: 1,
      prompt:
        '安定した膝関節症の人は、医療者が示した自宅用メニューを正しく実行でき、自己管理の条件も共有されている。通所が一時的に難しくなった場合の計画はどれか。',
      options: [
        [
          '確認済みの自宅メニューを条件に沿って続け、実施と症状を共有する',
          '適切な本人実施の運動も選択肢である。',
        ],
        [
          '監督付き施設が再開するまで、実行できるメニューも保留する',
          'この例では本人実施の条件が整っており、通所だけを必須にする理由はない。',
        ],
        [
          '自宅では監督がないので、習得済み種目を難しい新種目へ置き換える',
          '実行確認のない新しい要求を追加する必要はない。',
        ],
      ],
      explanation:
        '監督の要否は条件と技能から考える。本人実施を無条件に安全とするのではなく、この例で共有された範囲を守る。',
      refs: [ref('ex-plan-ortho-knee', 'p.1：supervised/unsupervised/water exercisesの推奨')],
      verification:
        '運動提供形態の選択肢を実読し、本人実施可能という条件を追加した独自ケースで通所必須/新種目追加を照合。',
    },
    {
      number: 3,
      group: 'ortho-hip-individual-precautions',
      objective: 2,
      prompt:
        '人工股関節後の人が、別の術式を受けた友人の運動表を持参した。本人の注意事項がまだ不明なとき、計画を具体化する手順はどれか。',
      options: [
        [
          '本人の外科医・理学療法士へ姿勢、荷重、期間の条件を確認する',
          '術式等で注意事項が異なるため本人の条件が必要である。',
        ],
        [
          '友人と同じ術後週数なので同じ角度制限を使う',
          '週数が同じでも術式や個別条件が同じとは限らない。',
        ],
        [
          '友人より筋力が高いので、友人の制限を少し緩めて使う',
          '筋力の比較では本人の術後制限を設定できない。',
        ],
      ],
      explanation: '一般的な注意一覧をそのまま処方へ変えない。本人の条件を確認してから運動を選ぶ。',
      refs: [
        ref(
          'ex-plan-ortho-hip',
          'Dos and Don’ts：customized list、surgical technique、not all surgeons same precautions',
        ),
      ],
      verification: '術式と個別条件を実読し、週数一致/筋力比較による制限の転用を確認。',
    },
    {
      number: 4,
      group: 'ortho-osteoporosis-loaded-flexion',
      objective: 2,
      prompt:
        '骨粗鬆症と椎体骨折の既往がある人の運動を、医療者の条件と合わせて検討する。追加する案で、まず修正・専門的確認が必要なのはどれか。',
      options: [
        [
          '重りを持ち、背骨を深く丸めて反復する体幹運動',
          '大きな脊柱屈曲と負荷の組合せは特に確認が必要である。',
        ],
        [
          '共有された条件内で行う、安定した支持のあるバランス練習',
          '支持と条件を確保したバランス活動は検討できる。',
        ],
        [
          '医療者が示す範囲で、姿勢を保ちながら行う筋力運動',
          '適切に個別化された抵抗運動まで避ける必要はない。',
        ],
      ],
      explanation:
        '骨粗鬆症の活動を一括して禁止せず、深い屈曲や骨折既往などの条件を扱う。日常の小さい動きまで危険と一般化しない。',
      refs: [
        ref(
          'ex-plan-ortho-bone',
          '印刷p.837 Abstract：high degree of spinal flexion、vertebral fracture、resistance/balance',
        ),
      ],
      verification:
        '合意声明の抄録で活動利益と高い屈曲への注意を実読。負荷付き深い屈曲と、条件内の筋力/バランスを区別して照合。',
    },
    {
      number: 5,
      group: 'ortho-fracture-loading-permission',
      objective: 2,
      prompt:
        '足関節骨折後、痛みが減り装具を外した人が、まだ荷重開始の指示を確認できていない。立位の筋力練習へ進む判断はどれか。',
      options: [
        [
          '荷重の開始と量を治療チームへ確認してから計画する',
          '装具や痛みだけでは骨の荷重条件は決められない。',
        ],
        [
          '片脚ではなく両脚立位なら体重を載せて試す',
          '両脚でも患側へ荷重がかかり、指示未確認を解決しない。',
        ],
        [
          '痛みが出ない範囲を探すため、軽いジャンプから試す',
          '痛みを荷重許可の代替にして衝撃まで加えている。',
        ],
      ],
      explanation:
        '足関節骨折は型や治療で条件が異なる。治癒や荷重許可をトレーナーが症状だけで決めない。',
      refs: [
        ref(
          'ex-plan-ortho-ankle',
          'Rehabilitation：doctor lets you know when weightbearing、早すぎる荷重の影響',
        ),
      ],
      verification:
        '荷重開始の指示と早すぎる荷重の影響を実読し、両脚/無痛ジャンプという代案を照合。',
    },
    {
      number: 6,
      group: 'ortho-shoulder-pain-program-boundary',
      objective: 3,
      prompt:
        '肩の医療評価後に共有された条件は「指定種目を痛みなく行う」だった。現在、指定種目で新しい肩痛が出る。次の判断はどれか。',
      options: [
        [
          'その種目を止め、症状と実施条件を医師・理学療法士へ確認する',
          '痛みのない実行という共有条件から外れている。',
        ],
        [
          '負荷を半分にして、同じ痛みが残っていても予定回数を完了する',
          '減量しても痛みなく実行する条件を満たしていない。',
        ],
        [
          '別の肩種目なら確認なしで深い可動域まで試す',
          '新たな痛みの評価をせず、未確認の課題へ移っている。',
        ],
      ],
      explanation:
        '一般的な運動表を自己判断の治療へ変えない。痛みの原因診断やリハビリ条件の変更は専門職と連携する。',
      refs: [
        ref(
          'ex-plan-ortho-shoulder',
          'Introduction1：Do not ignore pain、doctor/PTへの相談と種目選択',
        ),
      ],
      verification:
        '痛みの扱いと監督条件を実読し、痛みを残して回数優先/未確認の別種目という対案を照合。',
    },
    {
      number: 7,
      group: 'ortho-back-person-centred-coordination',
      objective: 3,
      prompt:
        '医療者が慢性一次性腰痛と評価した成人の支援で、運動だけでは本人の生活上の課題が残る。WHOの考え方に合う計画はどれか。',
      options: [
        [
          '運動を個別化し、本人の目標と心理・社会面も含む支援を担当専門職と調整する',
          '身体面以外も含む、本人中心の複数の支援が重要になる。',
        ],
        [
          '痛みの程度だけで一種類の運動表を選び、仕事や不安の情報は使わない',
          '同じ痛みの値でも影響する要因と必要な支援は異なる。',
        ],
        [
          '筋力値が改善した時点で、残る生活上の困難は支援対象から外す',
          '一つの身体指標だけでは本人の生活目標の達成を判断できない。',
        ],
      ],
      explanation:
        'トレーナーが心理療法や原因診断を担うのではなく、担当範囲で運動を支え、必要な専門職とつなぐ。',
      refs: [
        ref(
          'ex-plan-ortho-back',
          '推奨介入、person-centred、physical/psychological/social、suite of interventions',
        ),
      ],
      verification:
        'WHO2023の本人中心・複数要因・組合せ支援を実読し、痛み値だけ/筋力値だけの判断を照合。',
    },
    {
      number: 8,
      group: 'ortho-new-deformity-reevaluation',
      objective: 3,
      prompt:
        '以前は安定した膝関節症として計画していた人が、新しい強い痛みと形の変化を訴える。次回の負荷を増やす予定だった場合、適切な計画変更はどれか。',
      options: [
        [
          '予定の増量を保留し、新しい状態を医療者へ確認する',
          '安定状態への推奨を、新しい痛み・変形がある状況へ自動適用しない。',
        ],
        [
          '週予定を守るため、動作速度だけ落として負荷は増やす',
          '速度変更だけでは新しい状態の評価を代替しない。',
        ],
        [
          '関節症の既往があるので今回も同じ原因とみなし、種目だけ変える',
          '既往から今回の原因を診断せず、状態の変化を確認する必要がある。',
        ],
      ],
      explanation:
        '慢性疾患名が既にあっても、新しい症状を既往だけで説明しない。急性のけがや緊急性があれば安全手順も用いる。',
      refs: [
        ref(
          'ex-plan-ortho-mhlw',
          '要点：対象は状態が落ち着いた人、痛み・変形・合併症は専門家へ相談',
        ),
      ],
      verification:
        '厚労省の対象条件と運動器の痛み・変形への相談を実読。速度だけの変更と既往からの原因固定を照合。',
    },
  ],
);
