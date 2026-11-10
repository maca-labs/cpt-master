import type { Source } from '../../domain/types';
import { advancedItem } from './shared';

const checkedAt = '2026-11-09';

export const advancedAssessmentSources: Source[] = [
  {
    id: 'adv-assess-mdc',
    title:
      'Cubillos et al. Reliability and minimal detectable change of stiffness and other mechanical properties of the ankle joint in standing and walking',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10854263/pdf/nihms-1962859.pdf',
    edition: 'Gait & Posture、2024、著者最終稿',
    checkedAt,
    locator: 'Statistical Analyses、式(3)–(4)',
    note: '最小可検変化量を個人と集団で区別する計算法を参照。設問の種目と数値は架空。',
  },
  {
    id: 'adv-assess-cuff-size',
    title: 'Ishigami et al. Effects of Cuff Size on the Accuracy of Blood Pressure Readings',
    url: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2807853',
    edition: 'JAMA Internal Medicine、2023、Cuff(SZ)無作為化クロスオーバー試験',
    checkedAt,
    locator: 'Results・Table 2、Discussion',
  },
  {
    id: 'adv-assess-ers-walk',
    title: 'ERS/ATS Technical Standard: Field Walking Tests in Chronic Respiratory Disease',
    url: 'https://www.thoracic.org/statements/resources/copd/FWT-Tech-Std.pdf',
    edition: 'European Respiratory Journal、2014',
    checkedAt,
    locator: 'Reliability and learning effect for 6MWD、Test repetition',
    note: '慢性呼吸器疾患の医療チームによる測定例。',
  },
  {
    id: 'adv-assess-step-counter',
    title:
      'Maganja et al. Formative Evaluation of Consumer-Grade Activity Monitors Worn by Older Adults',
    url: 'https://formative.jmir.org/2020/8/e16537/',
    edition: 'JMIR Formative Research、2020、4(8):e16537',
    checkedAt,
    locator: 'Walking Trials、Measurements、Discussion: Criterion Validity',
  },
  {
    id: 'adv-assess-dxa-protocol',
    title:
      'Nana et al. Effects of daily activities on dual-energy X-ray absorptiometry measurements of body composition in active people',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22179140/',
    edition: 'Medicine & Science in Sports & Exercise、2012、44(1):180–189',
    checkedAt,
    locator: '著者抄録 Methods、Results、Conclusions',
  },
  {
    id: 'adv-assess-hydration-balance',
    title: 'NATA Position Statement: Fluid Replacement for the Physically Active',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5634236/',
    edition: 'Journal of Athletic Training、2017、52(9):877–895',
    checkedAt,
    locator: 'Table 2: Sweat-Rate Equation、Recommendations: Fluid Replacement During Exercise',
  },
  {
    id: 'adv-assess-caa-portion',
    title: '消費者庁「食品表示基準について」本体',
    url: 'https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/assets/food_labeling_cms201_261001_06.pdf',
    edition: '令和8年10月1日第41次改正',
    checkedAt,
    locator: 'p.8（5）栄養成分の量及び熱量①・②',
  },
  {
    id: 'adv-assess-usual-diet',
    title:
      'National Cancer Institute Dietary Assessment Primer: Learn More about Usual Dietary Intake',
    url: 'https://epi.grants.cancer.gov/dietary-assessment-primer/learn/usual.html',
    edition: '2025年12月29日更新',
    checkedAt,
    locator: '本文の集団平均・分布の区別、Effect of Measurement Error on Regression Analyses直後',
  },
  {
    id: 'adv-assess-teach-back',
    title: 'AHRQ Health Literacy Universal Precautions Toolkit',
    url: 'https://www.ahrq.gov/sites/default/files/wysiwyg/health-literacy/3rd-edition-toolkit/health-literacy-toolkit-third-edition.pdf',
    edition: '第3版、2024',
    checkedAt,
    locator: '印刷pp.15–16、Tool #5: Use the Teach-Back Method',
    note: '医療者向け資料の理解確認手法を、運動の初回面談例に適用。',
  },
  {
    id: 'adv-assess-parq-expiry',
    title: 'PAR-Q+ Collaboration: Physical Activity Readiness Questionnaire for Everyone',
    url: 'https://eparmedx.com/wp-content/uploads/2025/01/PARQPlus2025ImageFile.pdf',
    edition: '2025年版',
    checkedAt,
    locator: 'p.1 Participant Declaration / Delay becoming more active、pp.2–4 Follow-up',
  },
  {
    id: 'adv-assess-steadi-chair',
    title: 'CDC STEADI Assessment: 30-Second Chair Stand',
    url: 'https://www.cdc.gov/steadi/media/pdfs/steadi-assessment-30sec-508.pdf',
    edition: '2017',
    checkedAt,
    locator: 'p.1 手順①–④、とくに腕の支持が必要な場合の②',
  },
  {
    id: 'adv-assess-wearable-hr',
    title:
      'Gillinov et al. Variable Accuracy of Wearable Heart Rate Monitors during Aerobic Exercise',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28709155/',
    edition: 'Medicine & Science in Sports & Exercise、2017、49(8):1697–1703',
    checkedAt,
    locator: '著者抄録 Methods、Results、Conclusion',
  },
];

export const advancedAssessmentQuestions = [
  advancedItem('assessment', 1, {
    unitId: 'ex-assess-quality',
    objectiveIds: ['ex-assess-quality-o3'],
    level: 'analysis',
    prompt:
      '同じ方法で立ち幅跳びを測る教室が、予備測定で標準測定誤差を1.5 cmと推定した。個人の95%最小可検変化量は「誤差×1.96×√2」、16人の平均に対する値はこれを√16で割るとする。ある参加者も教室の平均も前回より2.4 cm伸びた。測定誤差の観点からどの報告が妥当か。',
    correct: [
      '集団平均の差は基準を超える。個人の差は基準内として扱う。',
      '個人の基準は約4.16 cm、集団平均の基準は約1.04 cm。2.4 cmは両者の間にある。',
    ],
    distractors: [
      [
        '集団平均も個人も、約4.16 cmの基準内として扱う。',
        '約4.16 cmは個人の基準。設問で示した集団平均の基準には人数を反映する。',
      ],
      [
        '集団平均も個人も、約1.04 cmの基準を超えたと扱う。',
        '平均に対する小さい基準を、個人1人の変化には適用できない。',
      ],
    ],
    explanation:
      '個人の2時点の差に対する基準と、複数人の平均の差に対する基準を分ける。基準超えは測定誤差との比較であり、変化の実用上の大きさや原因は別に判断する。',
    sourceRefs: [{ sourceId: 'adv-assess-mdc', locator: 'Statistical Analyses、式(3)–(4)' }],
  }),
  advancedItem('assessment', 2, {
    unitId: 'ex-assess-health',
    objectiveIds: ['ex-assess-health-o3'],
    level: 'analysis',
    prompt:
      '施設の初回測定で、上腕周囲に合うカフはAさんがS、BさんがLだったが、二人ともMで測った。翌月は適合するカフを使う。同僚は「Mで測った初回の方が、AさんもBさんもやや高めだったと見て比較できる」と話す。確認すべき誤差の方向はどれか。',
    correct: [
      'Aさんの初回は低め、Bさんの初回は高めになり得る。',
      'MはAさんには大きすぎ、Bさんには小さすぎる。試験では誤差の方向が反対だった。',
    ],
    distractors: [
      [
        'Aさんの初回は高め、Bさんの初回は低めになり得る。',
        '大きすぎるカフと小さすぎるカフについて、報告された傾向を逆に読んでいる。',
      ],
      [
        'AさんもBさんも、適合カフより初回は高めになり得る。',
        '小さすぎるカフの傾向はBさんに当てはまるが、大きすぎるAさんの条件とは異なる。',
      ],
    ],
    explanation:
      '自動上腕式でもカフの不適合は測定値に影響する。初回のカフを記録し、同じ適合条件で取り直してから推移を解釈する。試験の平均差を各人の値に足し引きする方法ではない。',
    sourceRefs: [{ sourceId: 'adv-assess-cuff-size', locator: 'Results、Table 2、Discussion' }],
  }),
  advancedItem('assessment', 3, {
    unitId: 'ed3-assess-test-methods',
    objectiveIds: ['ed3-assess-test-methods-o2', 'ed3-assess-test-methods-o3'],
    level: 'analysis',
    prompt:
      '医療チームが、慢性呼吸器疾患の成人の6分間歩行距離を経時比較する。各来院でERS/ATSの条件をそろえ、十分な休息を挟んで2試行した。初回は368 mと398 m、8週後は410 mと405 m。試行への慣れを考慮した同手順での変化量はどれか。',
    correct: [
      '12 mの増加。来院ごとに長い方の距離を採用する。',
      '初回の最良は398 m、8週後の最良は410 m。最良試技の差は12 m。',
    ],
    distractors: [
      [
        '24.5 mの増加。来院ごとの2試行の平均を採用する。',
        '383 mと407.5 mの差として計算は合うが、資料が推奨する最良試技の比較とは異なる。',
      ],
      [
        '7 mの増加。来院ごとに2試行目の距離を採用する。',
        '398 mと405 mの差。慣れを考慮する手順でも、必ず2試行目を採るわけではない。',
      ],
    ],
    explanation:
      '経時比較のために複数試行する際は、測定への慣れによって生じる差を考慮し、最良試技を記録する。距離の計算と、その変化を臨床でどう解釈するかは別の判断。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-ers-walk',
        locator: 'Reliability and learning effect for 6MWD、Test repetition',
      },
    ],
  }),
  advancedItem('assessment', 4, {
    unitId: 'ex-assess-quality',
    objectiveIds: ['ex-assess-quality-o1', 'ex-assess-quality-o2'],
    level: 'analysis',
    prompt:
      '高齢者向け歩行教室で、同じ装着位置の歩数計を検証する。目視で800歩を数えた連続歩行では機器が780歩、同じく目視800歩で途中に停止と再出発を含む歩行では690歩だった。教室は各条件で目視の±5%を許容する。次の記録方法としてどれが妥当か。',
    correct: [
      '連続歩行の記録だけを採用し、停止を含む歩行では別の測定法を検討する。',
      '目視を分母にした誤差は連続時−2.5%、停止ありで−13.75%。許容内なのは前者だけ。',
    ],
    distractors: [
      [
        '連続歩行で不足した20歩を、両方の条件の機器記録に足す。',
        '補正後の停止ありは710歩で、目視800歩に対して−11.25%。条件による誤差を解消できない。',
      ],
      [
        '測定が安定するまで同じ設定で両条件を記録し、平均値にまとめる。',
        '反復や集計で偶然のばらつきは減り得るが、現時点で停止ありの測定が許容内とはいえない。',
      ],
    ],
    explanation:
      '歩数計の一致度は、連続した歩行で確かめた結果を停止の多い場面にそのまま当てはめられない。利用する場面に合わせて目視などの基準と比較する。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-step-counter',
        locator: 'Walking Trials、Measurementsの誤差式、Discussion: Criterion Validity',
      },
    ],
  }),
  advancedItem('assessment', 5, {
    unitId: 'ex-assess-quality',
    objectiveIds: ['ex-assess-quality-o2', 'ex-assess-quality-o3'],
    level: 'analysis',
    prompt:
      '定期的に運動する成人が、同じDXA装置で測った除脂肪軟組織量が4週間で0.8 kg増えたと報告した。初回は朝食前、2回目は昼食後で、来院までの活動量も異なる。脚の数値の増加が特に大きい。次回の比較にどうつなげるか。',
    correct: [
      '測定条件の違いを記録し、測定施設と時刻・食事・活動の条件をそろえて比較し直す。',
      '通常の活動や食事により、全身・部位別の除脂肪量の平均や誤差が変わり得る。',
    ],
    distractors: [
      [
        '同じ装置なら全身の増加は採用し、脚の増加だけを測定条件の影響として保留する。',
        '部位別だけでなく、食事や活動で全身の測定値にも変動が報告されている。',
      ],
      [
        '2回目と同じ昼食後の条件で再測定し、近い値が出れば初回との差を採用する。',
        '2回目の条件下の再現性が示されても、初回と測定条件が違う問題は解消しない。',
      ],
    ],
    explanation:
      '装置が同じでも、測定前の活動や食事の条件が異なると、見かけの経時差に測定条件の影響が混じる。測定施設の手順で条件を合わせてから推移を報告する。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-dxa-protocol',
        locator: '著者抄録 Methods、Results、Conclusions',
      },
    ],
  }),
  advancedItem('assessment', 6, {
    unitId: 'ex-assess-hydration',
    objectiveIds: ['ex-assess-hydration-o3'],
    level: 'analysis',
    prompt:
      '同じ人が暑い日Aと涼しい日Bに、各1時間運動し、両日とも水を0.7 L飲んだ。乾いた同じ衣服で測った体重はAが68.0→67.6 kg、Bが68.0→68.2 kg。運動中の尿量はAで0.1 L、Bは0 L。体重差1 kgを水分1 Lとみなす。発汗量とBの水分収支の読み方はどれか。',
    correct: [
      'Aは約1.0 L、Bは約0.5 Lの発汗。Bでは体重が増える方向の収支だった。',
      'Aは0.4＋0.7−0.1、Bは−0.2＋0.7−0。Bは発汗していても、飲水量が推定損失を上回る。',
    ],
    distractors: [
      [
        'Aは約1.1 L、Bは約0.5 Lの発汗。Bでは体重が増える方向の収支だった。',
        'Aの体重減少には排尿分も含まれるため、発汗量の計算では0.1 Lを引く。',
      ],
      [
        'Aは約1.0 L、Bは約0.9 Lの発汗。Bでは体重が増える方向の収支だった。',
        'Bは運動後の方が重いため、運動前の体重から運動後を引くと−0.2 kg。',
      ],
    ],
    explanation:
      '発汗量は体重変化と同じではない。Bのように発汗量が正でも、水分収支は増加側になり得る。この概算は条件を変えた飲水計画の見直しに用い、体重だけから病態を判断しない。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-hydration-balance',
        locator: 'Table 2: Sweat-Rate Equation、運動中の体重増加と過剰飲水に関する勧告',
      },
    ],
  }),
  advancedItem('assessment', 7, {
    unitId: 'ex-assess-food-label',
    objectiveIds: ['ex-assess-food-label-o1'],
    level: 'analysis',
    prompt:
      '食事記録で同じ300 mLを飲んだ二つの製品を比べる。Aは粉末18 gの1袋当たり食塩相当量1.8 g。全量を水で450 mLにして均一に混ぜた後、300 mLを飲んだ。Bは飲用状態の100 mL当たり0.35 gで、容器から300 mLを飲んだ。表示値から見積もる差はどれか。',
    correct: [
      'Aが約0.15 g多い。Aは1.2 g、Bは1.05 gと見積もる。',
      'Aは袋の表示値に飲んだ割合300÷450を掛ける。Bは100 mLの表示値を3倍する。',
    ],
    distractors: [
      [
        'Aが約0.75 g多い。Aは1.8 g、Bは1.05 gと見積もる。',
        'Aは袋全量を調製したが、調製液の一部しか飲んでいない。',
      ],
      [
        'Aが約0.85 g多い。Aは1.2 g、Bは0.35 gと見積もる。',
        'Bの0.35 gは100 mL当たりの表示値。300 mL分に換算していない。',
      ],
    ],
    explanation:
      '水で薄めると濃さと体積が変わるが、混ぜた全量に含まれる食塩相当量は粉末1袋分。販売時の表示単位と実際に飲んだ割合を対応させて比較する。',
    sourceRefs: [{ sourceId: 'adv-assess-caa-portion', locator: 'p.8（5）栄養成分の量及び熱量①' }],
  }),
  advancedItem('assessment', 8, {
    unitId: 'ex-assess-hydration',
    objectiveIds: ['ex-assess-hydration-o2'],
    level: 'analysis',
    prompt:
      '地域教室が、曜日を分散させて参加者120人から各1日の食事を聞き取った。報告書には「集団で平均して魚を何g食べたか」と「習慣的に魚をほとんど食べない人の割合」を載せたい。魚を食べる日は人によって異なる。どの判断が妥当か。',
    correct: [
      '平均値は集計し、習慣的な低摂取の割合には一部の人への追加聞き取りを使う。',
      '1日分の個人内変動は集団平均と割合に同じようには影響しない。割合には反復データを使った日間変動の調整が必要。',
    ],
    distractors: [
      [
        '平均値と低摂取の割合をどちらも集計する。曜日を分散したので1人1日でよい。',
        '曜日の偏りを減らしても、同じ人の食べる日と食べない日の違いは推定できない。',
      ],
      [
        '平均値には追加の聞き取りが必要だが、割合は1日の記録から直接求められる。',
        '特に割合は単日の分布の広がりに影響される。単日のゼロを習慣的なゼロとはみなせない。',
      ],
    ],
    explanation:
      '短期間の調査で集団の平均を把握することと、各人の習慣を踏まえた割合を推定することは別の目的。割合を推定する設計では、一部の参加者に連続しない日の聞き取りを追加し、日間変動を調整する。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-usual-diet',
        locator: '本文の集団平均と分布の比較、統計モデルに必要な反復聞き取り',
      },
    ],
  }),
  advancedItem('assessment', 9, {
    unitId: 'assessment',
    objectiveIds: ['assessment-o1'],
    level: 'application',
    prompt:
      '初回面談で、担当者は「運動の日だけ、終了後に種目ときつさを記録する」と伝えた。本人は説明を聞いてうなずいたが、次の予定を尋ねると「休みの日の朝だけ記録する」と答えた。担当者は面談中に、記録手順が伝わったか確かめたい。次の対応はどれか。',
    correct: [
      '次の運動日を例に説明し直し、いつ何を書くかを本人の言葉で確かめる。',
      '誤解が分かったら別の伝え方を試し、本人の言葉や実演で理解を再確認する。',
    ],
    distractors: [
      [
        '手順の書面を渡して読み合わせ、本人に記録欄の位置を指してもらう。',
        '欄の場所は確かめられるが、食い違っていた記録の日と時点を理解したかは確かめていない。',
      ],
      [
        '正しい手順をもう一度伝え、次回に記録があれば理解したと判定する。',
        '記録の有無には実施機会や忘れも影響するため、今この場での理解確認にはならない。',
      ],
    ],
    explanation:
      'ティーチバックでは、説明する側の伝え方を点検する。面談の目標に直結する行動を短い例に置き換え、本人が実際に何をするか自分の言葉で確認する。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-teach-back',
        locator: '印刷pp.15–16 Tool #5、Try the teach-back method / Clarify and check again',
      },
    ],
  }),
  advancedItem('assessment', 10, {
    unitId: 'ex-assess-health',
    objectiveIds: ['ex-assess-health-o1', 'ex-assess-health-o2'],
    level: 'analysis',
    prompt:
      '受付はPAR-Q+ 2025年版の記録を確認している。Aさんは全項目「いいえ」で署名してから13か月経ち、健康状態に変化はない。Bさんは署名から7か月だが、以前の肩の問題が再燃し、活動のしやすさが変わったと申告した。運動量を増やす前に、旧記録をどう扱うか。',
    correct: [
      'AもBも旧記録だけでは手続きを進めず、現在の状態で確認を更新する。',
      'Aは記録の上限12か月を超え、Bは12か月未満でも健康状態の変化で前の確認が無効になる。',
    ],
    distractors: [
      [
        'Aの確認を更新し、Bは署名から12か月になるまで旧記録で進める。',
        'Bのように健康状態が変化した場合は、期限内でも旧記録がそのまま有効とはいえない。',
      ],
      [
        'Bの確認を更新し、Aは健康状態に変更がないので旧記録で進める。',
        'Aは状態が変わっていなくても、資料が定める12か月の上限を超えている。',
      ],
    ],
    explanation:
      'この質問票では経過期間と健康状態の変化を別々に確認する。該当するフォローアップや専門職への相談は現在の回答に沿って行う。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-parq-expiry',
        locator: 'p.1 Participant Declaration と Delay becoming more active、pp.2–4 Follow-up',
      },
    ],
  }),
  advancedItem('assessment', 11, {
    unitId: 'ed3-assess-test-methods',
    objectiveIds: ['ed3-assess-test-methods-o2', 'ed3-assess-test-methods-o3'],
    level: 'application',
    prompt:
      '地域の保健チームがCDC STEADIの30秒椅子立ち上がりを行う。参加者は腕を胸の前に保ったままでは初回の立ち上がりができず、手で座面を押せば立てた。前回の施設記録には「手で支持して14回」とある。今回の標準テストと前回の記録をどう扱うか。',
    correct: [
      '標準テストを中止して回数・得点を0と記録し、前回の支持あり14回とは分ける。',
      '手による支持が必要なら中止して0とする。支持ありの前回値は同じ条件の得点ではない。',
    ],
    distractors: [
      [
        '今回は欠測として得点を空欄にし、前回の支持あり14回とは分ける。',
        '異なる条件を分ける点は妥当だが、実施した標準テストの扱いは欠測ではなく0。',
      ],
      [
        '今回も支持ありで30秒続け、前回と比較できる標準テスト得点にする。',
        '支持ありを別に観察しても、両者を腕の支持を認めない標準テストの得点にはできない。',
      ],
    ],
    explanation:
      '標準テストの0は手順が定めた得点であり、支持を用いても立てないという意味ではない。動作条件を添えて、異なる形式の記録同士を比較しない。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-steadi-chair',
        locator: 'p.1 手順①・②、腕を使わなければ立てない場合の中止と記録',
      },
    ],
  }),
  advancedItem('assessment', 12, {
    unitId: 'ex-assess-quality',
    objectiveIds: ['ex-assess-quality-o1', 'ex-assess-quality-o2'],
    level: 'analysis',
    prompt:
      '健康な成人の有酸素運動を評価する。トレッドミルでは同時刻の手首の光学式計測131 bpm、電極付き胸部ベルト133 bpm。腕レバーを使うエリプティカルではそれぞれ109 bpm、136 bpmだった。担当者は手首の低い表示を根拠に負荷を上げようとしている。何を先に行うか。',
    correct: [
      '胸部ベルトの装着を確認して同じ条件で測り直し、機器の差を確かめる。',
      '手首の光学式の一致度は運動様式で変わり得る。元の種目での一致だけで新しい表示を採用しない。',
    ],
    distractors: [
      [
        'トレッドミルでの2 bpmの差を手首の値に足し、新しい種目の値として使う。',
        '一方の種目での差が、腕の動きを伴う別の種目でも一定だとする根拠がない。',
      ],
      [
        '二つの機器の値を平均し、その値が目標未満なら負荷を上げる。',
        '大きく食い違う原因を確認せずに平均しても、真の心拍数に近づくとはいえない。',
      ],
    ],
    explanation:
      '比較試験では光学式機器と心電図との一致度は運動様式により異なった。心拍数を評価するなら、計測器の装着や測定条件を点検してから解釈し、特定の機器や条件での結果を他へ一般化しない。',
    sourceRefs: [
      {
        sourceId: 'adv-assess-wearable-hr',
        locator: '著者抄録 Methods（様式・腕レバー）、Results、Conclusion',
      },
    ],
  }),
];
