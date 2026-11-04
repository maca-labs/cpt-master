import type { Source, Unit } from '../../domain/types';
import { planningCheckedAt, ref, reviewedPlanningItems } from './planning-batch-shared';

const unitId = 'ex-plan-cardio';
export const planningBatch02Sources: Source[] = [
  {
    id: 'ex-plan-cardio-hrr',
    title: 'NSCA: Essentials of Tactical Strength and Conditioning—Program Design',
    url: 'https://www.nsca.com/contentassets/53f36e5db26a4729b251fb794c166af1/tsac-module-4.0--4.5.pdf',
    edition: 'Exam Prep Online, 2013',
    checkedAt: planningCheckedAt,
    locator: 'Module 4.0 p.8 / PDF8枚目：HRRと目標心拍の式、p.9 / PDF9枚目：%MHRと%HRRの違い',
    note: '式と方法の区別だけを参照。古い一律進行表・10%ルール・年齢推定心拍を現在の安全基準として採用しない。',
  },
  {
    id: 'ex-plan-cardio-intensity',
    title: 'CDC: How to Measure Physical Activity Intensity',
    url: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
    edition: '2025-12-04更新',
    checkedAt: planningCheckedAt,
    locator: 'Relative intensity / Talk Test / Absolute intensity',
    note: '0–10尺度、会話による目安、METの絶対強度と個人の相対強度の区別を実読。個別の医学的限界を決める資料ではない。',
  },
  {
    id: 'ex-plan-cardio-counts',
    title: 'CDC: What Counts as Physical Activity for Adults',
    url: 'https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html',
    edition: '2023-12-06更新、閲覧時の公開版',
    checkedAt: planningCheckedAt,
    locator: 'Aerobic activity—what counts? / 中強度と高強度の組合せ・1対2の換算目安',
    note: '米国の一般成人向け公衆衛生推奨を、問題で出典・対象を明示して参照。NSCA試験の公式数値とは扱わない。',
  },
  {
    id: 'ex-plan-cardio-safety',
    title: '厚生労働省：身体活動・運動を安全に行うためのポイント',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-008',
    edition: '身体活動・運動ガイド2023情報シート／2024-03-19更新',
    checkedAt: planningCheckedAt,
    locator: '3. 具体的な注意事項・確認事項：2. 新たに運動を開始する時の確認事項',
    note: '心拍数へ影響する服薬と主観的運動強度、毎回の状態確認を参照。服薬変更を指導者が行わない。',
  },
  {
    id: 'ex-plan-cardio-mets',
    title: '厚生労働省：メッツ / METs',
    url: 'https://kennet.mhlw.go.jp/information/information/dictionary/exercise/ys-004.html',
    edition: '2025-02-17更新',
    checkedAt: planningCheckedAt,
    locator: '冒頭の強度の定義と、身体活動・運動ガイド2023への説明',
    note: 'METは活動強度を表す指標。設問で定義するMET・時を個人の実測酸素摂取量や安全上限と同一視しない。',
  },
];

export const planningBatch02Units: Unit[] = [
  {
    id: unitId,
    domainId: 'planning',
    title: '有酸素運動の強度と活動量',
    subtitle: '心拍・主観・会話・時間を使い分ける',
    minutes: 24,
    level: '応用',
    objectives: [
      {
        id: `${unitId}-o1`,
        text: '与えられた最大・安静心拍からHRR法を計算し、最大心拍割合と区別する',
      },
      {
        id: `${unitId}-o2`,
        text: '相対強度・絶対強度・服薬の影響を区別し、RPEや会話も強度調整に使う',
      },
      { id: `${unitId}-o3`, text: '対象を明示した有酸素活動の時間配分・換算とMET・時を計算する' },
    ],
    sections: [
      {
        title: 'HRRの割合は最大心拍の割合ではない',
        body: 'HRR＝最大心拍数−安静心拍数。HRR法の目標心拍数＝HRR×指定割合＋安静心拍数である。最大心拍数へ割合だけを掛ける方法とは結果が異なる。最大心拍は問題で条件値として与える。年齢推定値を実測の最大値や個人の安全上限とみなさない。',
      },
      {
        title: '同じ歩行でも、きつさは人により違う',
        body: 'METは活動の絶対強度、RPEや会話は本人の相対的なきつさを捉える手がかりである。CDCの0〜10尺度では中強度の目安は5〜6で、会話できるが歌えない程度とされる。これは6〜20尺度やRIRとは別の尺度である。運動能力が低い人にとっては、絶対強度が中程度でも相対的には強いことがある。',
      },
      {
        title: '服薬があるときの指標',
        body: '一部の降圧薬などは運動中の心拍反応に影響する。心拍が目標へ上がらないことだけを理由に負荷を上げず、医療者からの条件、本人の症状、RPEなどを合わせて確認する。トレーナーが服薬を中止・変更して目標心拍へ合わせることはしない。',
      },
      {
        title: '活動の強度と時間を合計する',
        body: '一般成人の公衆衛生上の目安と個別の運動処方は区別する。CDCは中強度150分または高強度75分程度の週量とその組合せを示し、換算の目安は高強度1分を中強度2分とする。短い活動も積み重ねられる。MET・時を求める場合はMET×時間で、分を時間へ直す。どちらの集計も消費kcalや本人の安全性そのものではない。',
      },
    ],
    example: {
      situation: '心拍反応へ影響する薬を使う人が、設定心拍へ届くまで負荷を上げようとしている。',
      judgment:
        '事前に共有された医療上の条件と本人のきつさを確認し、心拍値だけで進めない。必要な強度指標は医療者と共有し、薬の変更は求めない。',
    },
    terms: [
      { term: 'HRR', meaning: '最大心拍数から安静心拍数を引いた心拍予備量。' },
      { term: '相対強度', meaning: '本人の体力や反応に対して、どれほどきつい活動かという見方。' },
      { term: 'トークテスト', meaning: '活動中の会話や歌唱の可否を用いる、相対強度の簡便な目安。' },
      { term: 'MET・時', meaning: '活動のMET値と時間の積で表す活動量。分のまま掛けない。' },
    ],
    sourceRefs: planningBatch02Sources.map((source) => ref(source.id, source.locator)),
  },
];

export const planningBatch02Questions = reviewedPlanningItems(
  unitId,
  planningBatch02Sources,
  '2026-11-04T12:04:32Z',
  [
    {
      number: 1,
      group: 'cardio-hrr-forward',
      objective: 1,
      prompt:
        '医療上の運動制限がない成人について、計算条件として最大心拍188拍/分、安静心拍68拍/分を与える。目標を60%HRRとした場合の計算上の心拍数はどれか。小数は不要。安全上限を求める問題ではない。',
      options: [
        ['140拍/分', '（188−68）×0.60＋68＝140拍/分。'],
        ['113拍/分', '188×0.60＝112.8は最大心拍割合の計算であり、HRR法ではない。'],
        ['72拍/分', 'HRRの60%だけを計算し、安静心拍68を加えていない。'],
      ],
      explanation:
        'HRR法は安静から最大までの差へ割合を掛け、安静心拍を戻す。処方へ使う際は個人の状態や服薬等の前提も必要である。',
      refs: [ref('ex-plan-cardio-hrr', 'Module 4.0 p.8：HRR法の式')],
      verification:
        'HRR120、120×0.60＋68＝140を再計算し、最大心拍割合と加算漏れを別の誤答理由として確認。',
    },
    {
      number: 2,
      group: 'cardio-methods-not-interchangeable',
      objective: 1,
      prompt:
        '最大心拍180拍/分、安静心拍60拍/分を条件値とする。記録Aの「70%最大心拍」と記録Bの「70%HRR」を同じ強度指定として集計しようとしている。修正として正しいのはどれか。',
      options: [
        [
          'Aは126拍/分、Bは144拍/分で、方法を別に記録する',
          '180×0.70と（180−60）×0.70＋60は異なる計算。',
        ],
        ['どちらも70%なので126拍/分に統一する', '安静心拍を含めるHRR法の定義を消している。'],
        [
          'Bだけ安静心拍を引いた84拍/分を最終目標とする',
          '84は予備量の70%で、最終の目標心拍ではない。',
        ],
      ],
      explanation: '同じ百分率でも分母となる基準が違う。方法名を落とすと負荷指定を取り違える。',
      refs: [ref('ex-plan-cardio-hrr', 'Module 4.0 pp.8–9：%MHRと%HRRは同じではないとの注')],
      verification: 'A126、B144、途中値84を再計算し、方法の違いを明示する結論を原典と照合。',
    },
    {
      number: 3,
      group: 'cardio-relative-versus-absolute',
      objective: 2,
      prompt:
        '活動表では3 METの歩行だが、体力の低い成人本人は0〜10尺度のRPEを8と報告し、会話も途切れる。症状がないことを確認したうえで、計画時の強度の読み方として適切なのはどれか。',
      options: [
        [
          '絶対強度の表だけで軽いと決めず、本人には強い負荷になっている可能性を考える',
          'METの分類と、本人の相対的なきつさは異なる情報。',
        ],
        ['3 METなので本人のRPEも必ず3である', 'MET値と0〜10尺度は同じ尺度ではない。'],
        [
          '表のMET値があれば会話や本人の反応は不要である',
          '個人の体力差を反映する情報を捨てている。',
        ],
      ],
      explanation:
        '活動表の数値と本人の反応を合わせて調整する。表で中程度に分類されても、個人の相対強度まで一定にはならない。',
      refs: [ref('ex-plan-cardio-intensity', 'Relative intensity / Absolute intensity')],
      verification:
        '活動のMETと個人の相対強度が異なるという本文に照らして、同一尺度と扱う誤答を確認。',
    },
    {
      number: 4,
      group: 'cardio-talk-test-interpretation',
      objective: 2,
      prompt:
        '健康な成人の有酸素活動中、歌を歌うのは難しいが普通の会話は続けられる。CDCのトークテストを目安として使う場合、最も適切な解釈はどれか。',
      options: [
        [
          '中強度の目安に合うが、症状や個別条件も確認する',
          'CDCでは会話はできるが歌えない程度を中強度の目安とする。',
        ],
        [
          '会話できるなら身体活動の強度は必ずゼロである',
          '会話できる範囲でも中強度の活動は成立する。',
        ],
        [
          'この状態だけで個人の最大心拍数が確定する',
          '会話の可否は最大心拍を測定する検査ではない。',
        ],
      ],
      explanation:
        'トークテストは強度を推測する簡便な方法であり、疾患の診断や安全上限の確定ではない。',
      refs: [ref('ex-plan-cardio-intensity', 'Tip—Talk Test')],
      verification:
        '会話可能・歌唱困難という目安を本文と照合し、ゼロ強度や最大心拍測定へ飛躍する誤答を確認。',
    },
    {
      number: 5,
      group: 'cardio-mixed-week-equivalence',
      objective: 3,
      prompt:
        '運動制限のない一般成人の週量を、CDCの目安「高強度1分≒中強度2分」で中強度相当に換算する。中強度90分と高強度30分の合計はどれか。個人への運動強度の処方ではない。',
      options: [
        ['中強度相当150分', '90＋30×2＝150分。'],
        ['中強度相当120分', '異なる強度を換算せずに足している。'],
        ['中強度相当105分', '高強度時間を2で割っており、換算方向が逆である。'],
      ],
      explanation:
        '換算の基準と対象を明示してから集計する。週量の目安を満たすことだけで、個々の活動の安全性や筋力トレーニングの実施まで保証されない。',
      refs: [
        ref(
          'ex-plan-cardio-counts',
          'Aerobic activity：1 minute vigorous ≈ 2 minutes moderateの段落',
        ),
      ],
      verification: '90＋2×30＝150を再計算し、単純合計と逆換算の誤答を確認。',
    },
    {
      number: 6,
      group: 'cardio-short-bouts-count',
      objective: 3,
      prompt:
        '一般成人が長い連続時間を確保できず、週内に5分程度の中強度活動を何度も行っている。活動記録の扱いとして適切なのはどれか。',
      options: [
        [
          '短い活動も記録し、積み重ねと継続しやすい計画につなげる',
          'CDCは小さな時間のまとまりに分けて週内へ配分できるとする。',
        ],
        [
          '10分未満はすべてゼロ分として捨てる',
          '参照した現在の成人向け説明は、そのような最小時間を条件としていない。',
        ],
        [
          '5分活動を1回した時点で週の推奨量をすべて満たす',
          '短時間も有益ということと、週量全体を満たしたということは別。',
        ],
      ],
      explanation:
        '小さな活動を無効にせず、総量と実施状況を追う。達成できる量から始めることと、目標量への段階的な計画を両立させる。',
      refs: [
        ref('ex-plan-cardio-counts', 'Aerobic activity：週内への配分とsmaller chunks of time'),
      ],
      verification:
        '短い時間へ分割できる本文を実読し、旧来の10分必須という条件の混入と、短時間で週量達成とする誤答を確認。',
    },
    {
      number: 7,
      group: 'cardio-medication-heart-response',
      objective: 2,
      prompt:
        '医療者から運動可能な条件が共有された成人は、心拍反応に影響するβ遮断薬を服用している。以前の心拍目標へ届かないが、本人はかなりきついと報告する。計画調整として適切なのはどれか。',
      options: [
        [
          '心拍値だけで負荷を上げず、共有条件・RPE・症状を使って調整する',
          '服薬で心拍反応が変わる場合、主観的運動強度も参考にする。',
        ],
        ['目標心拍に届くまで速度を上げ続ける', '服薬の影響と本人の反応を無視している。'],
        ['トレーナーの判断で薬を休ませて心拍を戻す', '処方薬の変更はトレーナーの業務ではない。'],
      ],
      explanation:
        '医療者の条件を守り、心拍以外の手がかりを併用する。新しい症状があれば中止・医療連携を優先する。',
      refs: [ref('ex-plan-cardio-safety', '3.2：β遮断薬等の心拍への影響、主観的運動強度の活用')],
      verification:
        '厚労省の服薬・強度指標の本文と照合し、負荷追加の強制と処方変更という誤答を個別に確認。',
    },
    {
      number: 8,
      group: 'cardio-met-hours-conversion',
      objective: 3,
      prompt:
        '計算条件として、ある活動を4 MET、1回30分、週3回とする。活動量＝MET×時間（時）で集計した週の活動量はどれか。MET値は条件値で、個人の酸素摂取量を実測したものではない。',
      options: [
        ['6 MET・時', '4×（30÷60）×3＝6 MET・時。'],
        ['360 MET・時', '分を時へ直さず4×30×3を掛けている。'],
        ['12 MET・時', '1回30分を1時間として数えている。'],
      ],
      explanation:
        '強度と時間の積を扱うときは時間の単位を統一する。この数値自体を消費kcalや運動の安全上限に置き換えない。',
      refs: [ref('ex-plan-cardio-mets', '冒頭：活動強度としてのMETの定義')],
      verification:
        'METの意味を本文で確認し、設問で明示した積の定義により4×0.5×3＝6を再計算。360と12の単位換算誤りを確認。',
    },
  ],
);
