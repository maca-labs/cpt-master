import type { Question, Source, SourceRef, Unit } from '../../domain/types';

const checkedAt = '2026-11-04';
const batch1ReviewedAt = '2026-11-04T12:04:00Z';
const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });

export const assessmentExpansionSources: Source[] = [
  {
    id: 'ex-assess-src-profiling',
    title:
      'Weakley et al.: Testing and Profiling Athletes: Recommendations for Test Selection, Implementation, and Maximizing Information',
    url: 'https://www.nsca.com/contentassets/d34fb088b444495da825298cb03526a8/testing-and-profile--weakley-et-al.pdf',
    edition: 'Strength and Conditioning Journal、公開PDFの2023年先行版表記（巻号未確定）',
    checkedAt,
    locator: 'PDF pp.6–9: Validity, Reliability, and Sensitivity; p.4 Table 1のExternal',
    note: 'NSCAが公開する著者論文の該当本文を実読。競技者の測定原則として参照し、研究の誤差値を一般成人へそのまま適用しない。図表・設問の転載なし。',
  },
  {
    id: 'ex-assess-src-test-module',
    title:
      'NSCA: Testing and Evaluation — Essentials of Tactical Strength and Conditioning Exam Prep Online',
    url: 'https://www.nsca.com/contentassets/4bc4e495944c470d81c429294a2b4c05/tsac-module-5.0--5.1.pdf',
    edition: 'Copyright 2013、Module 5.1の公式公開PDF',
    checkedAt,
    locator: 'Module 5.1-3, 5.1-4, 5.1-7（PDF pp.12–13,16）',
    note: '測定の準備・検者間一致・疲労に配慮する順序の一般原則を参照。米国の職業選抜基準・施設規定を日本の法制度として扱わない。',
  },
  {
    id: 'ex-assess-src-test-validity',
    title: 'NSCA: Tests Based on Work Demands and Training Status',
    url: 'https://www.nsca.com/education/articles/kinetic-select/tests-based-on-work-demands-and-training-status/',
    edition:
      'Kinetic Select、2017年6月／NSCA’s Essentials of Tactical Strength and Conditioning公式抜粋',
    checkedAt,
    locator: 'Validity and Reliability',
    note: '測りたい構成概念と再現性の区別に参照。具体的な職業テストや米国の選抜制度は採用しない。',
  },
  {
    id: 'ex-assess-src-agility',
    title: 'NSCA: Assessing Speed and Agility Related to Sport Performance',
    url: 'https://www.nsca.com/education/articles/kinetic-select/assessing-speed-and-agility-related-to-sport-performance/',
    edition: 'Kinetic Select、2017年5月／NSCA’s Guide to Tests and Assessments公式抜粋',
    checkedAt,
    locator: 'Test Selection / Methods of Measurement',
    note: '方向転換回数・距離などの手順を統一する考え方と、対象者の技能・体力に合う選択を実読。',
  },
];

export const assessmentExpansionUnits: Unit[] = [
  {
    id: 'ex-assess-quality',
    domainId: 'assessment',
    title: '測定の品質を見分ける',
    subtitle: '信頼性・妥当性・誤差を、比較できる記録へつなぐ',
    minutes: 22,
    level: '応用',
    objectives: [
      {
        id: 'ex-assess-quality-o1',
        text: '妥当性と信頼性を区別し、結果を一般化できる範囲を説明する',
      },
      {
        id: 'ex-assess-quality-o2',
        text: '検者・器具・手順・実施順序による測定のばらつきを減らす',
      },
      {
        id: 'ex-assess-quality-o3',
        text: '通常のばらつきを踏まえ、小さな記録差の解釈を保留できる',
      },
    ],
    sections: [
      {
        title: '繰り返せることと、目的に合うこと',
        body: '信頼性は結果の再現しやすさ、妥当性は意図した能力や量を捉えられるかという問題です。毎回ほぼ同じ値でも、別の能力を測っていたり、基準から一定方向にずれていたりすれば、目的に合う測定とは限りません。採用する指標と、判断したい内容を対応させます。',
        bullets: [
          '同じ器具でも、平均値と最大値は別の指標。',
          '競技者で得られた妥当性・誤差を、条件の異なる初心者へ自動適用しない。',
        ],
      },
      {
        title: '本人にも検者にも準備が必要',
        body: '測定前に手順・無効となる動作・採点方法を説明し、必要な実演と練習を行います。検者が交代する場合は、位置の決め方や声かけもそろえます。初回だけ不慣れだった結果と、十分に慣れた結果との差には、体力以外の影響が含まれ得ます。',
      },
      {
        title: '条件と疲労を記録する',
        body: '距離・方向転換回数・開始位置・器具・環境が変わると、数値を同列に比較できなくなります。複数のテストでは、先の測定による疲労が次の結果を変えないよう順序と回復を計画します。低疲労の測定を先にし、疲労の大きい持久性テストを後に置くことが一般的な考え方です。',
      },
      {
        title: '変化を、誤差と切り分ける',
        body: '記録には器具の誤差だけでなく、本人の日ごとの状態や動作の違いも含まれます。器具の再現性を調べるなら、同じ人が繰り返した成績差をすべて器具のせいにしません。通常のばらつきより小さい差から、確実な改善や悪化を結論づけないことが大切です。',
      },
      {
        title: '関連動画',
        body: 'この小単元の目標に直接対応し、内容を確認できた動画は未収録です。本文と確認問題から学習できます。',
      },
    ],
    example: {
      situation: '体力テストの記録が少し改善したが、今回は担当者も計時方法も変わっていた。',
      judgment:
        '改善と断定する前に条件差を確認する。担当者の訓練と手順の統一を行い、同じ方法による比較記録を集める。',
    },
    terms: [
      { term: '妥当性', meaning: '測定やその解釈が、意図する対象を適切に捉えている程度。' },
      { term: '信頼性', meaning: '同じ条件で結果を繰り返し得られる程度。' },
      { term: '検者間信頼性', meaning: '異なる検者による測定の一致・再現性。' },
      { term: '測定誤差', meaning: '観察された値に含まれる、器具・手順・状態などによる変動。' },
    ],
    sourceRefs: [
      ref(
        'ex-assess-src-profiling',
        'PDF pp.7–9: Validity / Reliability / Sensitivity; p.4 Table 1: External',
      ),
      ref(
        'ex-assess-src-test-module',
        'Module 5.1-3, 5.1-4, 5.1-7：妥当性・検者差・順序・事前説明',
      ),
      ref('ex-assess-src-test-validity', 'Validity and Reliability'),
      ref('ex-assess-src-agility', 'Test Selection / Methods of Measurement'),
    ],
  },
  {
    id: 'ex-assess-adult-tests',
    domainId: 'assessment',
    title: '成人テストの手順と記録',
    subtitle: 'スポーツ庁20〜64歳要項を、標準化の具体例として読む',
    minutes: 24,
    level: '応用',
    objectives: [
      {
        id: 'ex-assess-adult-tests-o1',
        text: '握力の調整と左右の記録の集計を、成人要項に従って行う',
      },
      {
        id: 'ex-assess-adult-tests-o2',
        text: '上体起こし・長座体前屈・反復横とびの有効な実施と記録を区別する',
      },
      {
        id: 'ex-assess-adult-tests-o3',
        text: '急歩・シャトルラン・立ち幅とびで固有の終了・測定条件を適用する',
      },
    ],
    sections: [
      {
        title: '対象者と採用する要項を先に決める',
        body: 'ここではスポーツ庁の20〜64歳を対象とする要項を例に学びます。学校向けや高齢者向けの方法を混ぜません。この要項は日本の体力調査のためのものであり、NSCAが全クライアントへ必須とするテストでも、実施への医学的許可でもありません。健康状態と実施可能性の確認が前提です。特に急歩と20mシャトルランの要項は、医師の治療を受けている者や実施が困難な者には実施しないと定めています。運動可能な人でも、このテストへ参加可能とは限りません。',
      },
      {
        title: '握力は、四つの記録をそのまま平均しない',
        body: '握る幅は人差し指の第2関節がおおむね直角になるよう調整します。右左交互に2回ずつ行い、各測定のキログラム未満を切り捨てます。左右それぞれのよい記録を選んで平均し、その平均のキログラム未満を四捨五入する規則です。測定値と最終記録の段階を分けて扱います。',
      },
      {
        title: '有効な動作だけを数える',
        body: '上体起こしでは、起こしたときの肘と大腿の接触に加え、戻したときに背中がマットに着く必要があります。長座体前屈は膝を曲げずに箱を押し、2回のよい記録を採用します。反復横とびは20秒間の有効なライン通過ごとに加点し、2回のよい方を記録します。',
      },
      {
        title: '時間・終了・距離にも固有の規則がある',
        body: '急歩は歩行として行い、走って記録を短くするテストではありません。ゴールは手足でなく胴が到達した時点で計時します。20mシャトルランでは、1回の遅れを次で解消できる場合と、2回連続して線に届かない場合を区別します。立ち幅とびは、踏切前の両足の中央位置と、身体が触れたうち最も踏切線に近い位置を結ぶ距離です。要項ごとの規則を事前に確認します。',
      },
      {
        title: '関連動画',
        body: 'この成人向け手順の目標に直接対応し、内容を確認できた動画は未収録です。学校向けの握力動画を、成人要項の全手順を確認した動画として扱いません。',
      },
    ],
    example: {
      situation:
        '左右2回ずつの握力値を受け取り、スタッフが四つの平均を最終記録にしようとしている。',
      judgment:
        '採用する要項を確認し、左右それぞれのよい記録を平均する。計算方法の違う値を、同じ経過記録として混在させない。',
    },
    terms: [
      { term: '有効試行', meaning: '対象の要項に定められた動作・条件を満たした試行。' },
      { term: '最良値', meaning: '指定された複数試行から選ぶ、最もよい記録。' },
      { term: '折り返し回数', meaning: 'シャトルランの記録として数える20m区間の完了数。' },
    ],
    sourceRefs: [
      ref('f-sports-test-adult', '印刷pp.1–7,9：対象・各テストの方法、記録、実施上の注意'),
    ],
  },
];

type Option = [text: string, reason: string];
// Only seeds whose answers and distractors have been read against the cited sections belong here.
function q(
  unitId: string,
  serial: number,
  objective: number,
  group: string,
  prompt: string,
  correct: Option,
  wrong1: Option,
  wrong2: Option,
  explanation: string,
  sourceRefs: SourceRef[],
  difficulty: 2 | 3 = 2,
): Question {
  const id = `${unitId}-${String(serial).padStart(2, '0')}`;
  const choices = [correct, wrong1, wrong2].map(([text, reason], index) => ({
    id: `${id}-c${index + 1}`,
    text,
    explanation: reason,
  }));
  const offset = serial % choices.length;
  return {
    id,
    revision: 1,
    groupId: `ex-assess-${group}`,
    domainId: 'assessment',
    unitId,
    objectiveIds: [`${unitId}-o${objective}`],
    format: 'single_choice',
    context: 'case',
    difficulty,
    pool: 'practice',
    prompt,
    choices: [...choices.slice(offset), ...choices.slice(0, offset)],
    correctChoiceId: choices[0].id,
    explanation,
    sourceRefs,
    review: {
      status: 'source_checked',
      reviewerType: 'ai',
      method:
        'AIが記載した一次資料の該当節を実読し、正答・全誤答理由・本文との対応を照合。計算は前提と単位を再確認。',
      checkedAt: batch1ReviewedAt,
      revision: 1,
      notes:
        '本担当AIによる出典照合。本アプリ独自の問題であり、別担当による独立レビュー・人間専門家監修はこの記録に含まない。公式試験問題の再現ではない。',
    },
  };
}

// Batch 1: eight distinct measurement judgments and two adult grip protocol applications.
export const assessmentExpansionQuestions: Question[] = [
  q(
    'ex-assess-quality',
    1,
    1,
    'reliability-not-validity',
    '同じ基準のおもりを何度測っても、体重計Aは基準より同じだけ高い値を示す。この観察から最も適切に言えることは？',
    [
      '繰り返しのばらつきが小さくても、基準と一致するとは限らない',
      '再現性と基準に対する妥当性は分けて検討する。',
    ],
    [
      '測定回数を増やして平均すれば、一定方向のずれも小さくなる',
      '反復平均はランダムな変動には役立つが、同じ方向の系統的なずれを消さない。',
    ],
    [
      '基準のおもりで安定していれば、人の測定時も別の器具とそのまま比較できる',
      '基準との差が残っており、別器具との一致や人での条件は確認されていない。',
    ],
    '信頼性が高そうな結果でも、目的に合う正確な測定とは限らない。安定性だけで測定器を正しいと結論づけない。',
    [
      ref(
        'ex-assess-src-profiling',
        'PDF pp.7–8: Reliability冒頭（信頼性があっても妥当とは限らない）',
      ),
    ],
  ),
  q(
    'ex-assess-quality',
    2,
    2,
    'interrater-agreement',
    '皮下脂肪厚の再評価で担当がAからBに替わる。予備測定では参加者の値の大小関係は両担当でほぼ同じだが、Bの値がやや低い傾向がある。担当交代の影響を調べる方法は？',
    [
      '測定位置・手技をそろえ、同じ参加者に対するAとBの値の差を確かめる',
      '身体が同じ条件で検者だけを変え、交代に伴う差を検討できる。',
    ],
    [
      '両担当の値の相関を確かめ、相関が高ければ交代前後を同じ条件として扱う',
      '大小関係がよく似ていても、Bの値が一貫して低ければ値は一致しない。',
    ],
    [
      '各担当が別の参加者を2回測り、担当内の反復差を比べる',
      '同じ担当者による反復の安定性は分かるが、同じ参加者での担当間の差は確かめられない。',
    ],
    '検者間の一致と検者内の再現性は別の評価である。前後で同じ検者を使えないときは、手順の統一と同一対象者での確認により、担当交代による差を把握する。',
    [
      ref(
        'ex-assess-src-profiling',
        'PDF p.8: Reliability—skinfold measurements、intrarater/interrater、assessor training',
      ),
    ],
  ),
  q(
    'ex-assess-quality',
    3,
    2,
    'test-familiarization',
    '方向転換テストの口頭説明後、参加者は折り返し位置を正しく答えたが、動き出すと別の線で折り返した。初回の基準記録を他の参加者と同じ手順で取るには、計時前にどうするか。',
    [
      '折り返し位置と無効条件を実演し、規定の練習で動きを確認する',
      '説明で答えられた内容を実動作でも再現できるよう、実演と計時前の練習で確認する。',
    ],
    [
      '折り返しの線を指さして説明し、計時した最初の試行で動きを確認する',
      '今回の誤りは口頭で位置を理解した後も起きている。最初の計時を理解確認に兼用すると、基準記録の条件が変わり得る。',
    ],
    [
      '参加者にコースを一周歩いてもらい、試験者による実演は計時後に行う',
      'コースの下見は役立つが、折り返し方と無効条件を試験者が示す時期が遅い。',
    ],
    'テストの目的・手順・無効条件を事前に共有する。練習による理解を促してから、規定の条件で記録する。',
    [
      ref(
        'ex-assess-src-test-module',
        'Module 5.1-7 / PDF p.16: Test Protocols and Procedures—explain、demonstrate、allow practice',
      ),
    ],
  ),
  q(
    'ex-assess-quality',
    4,
    2,
    'agility-protocol-standardization',
    '施設の都合で、敏捷性テストを先月の20m・方向転換2回から、今回は18m・方向転換1回に変更した。どちらも同日の3試行は安定したが、残っているのは各試行の全体タイムだけである。今回の短縮をどう扱うか。',
    [
      '短縮は記録するが、同じコースでの能力向上の量としては扱わない',
      '距離と方向転換回数は結果を左右する条件である。',
    ],
    [
      '全体タイムを各コースの距離で割り、1m当たりの時間の改善を比べる',
      '距離の補正では、方向転換の回数や減速・加速の要求までそろえられない。',
    ],
    [
      '各月の3試行平均を使えば日内誤差が減るので、その平均差を能力向上の量とする',
      '反復平均で日内の変動を抑えても、月ごとに変えた測定手順の影響は残る。',
    ],
    '方向転換回数と距離を統一して記録を比較する。条件変更が必要なら、その内容を記録し、以前との比較に留保を付ける。',
    [
      ref(
        'ex-assess-src-agility',
        'Methods of Measurement：direction changesとdistanceのstandardization',
      ),
    ],
  ),
  q(
    'ex-assess-quality',
    5,
    2,
    'device-versus-biological-error',
    'スクワットの速度計の誤差を調べるため、同じ人が毎回異なる疲労状態で挙上した速度差を集めた。検証の問題点は？',
    [
      '本人の動作・状態の変動と、器具の誤差を切り分けていない',
      '人の出力の違いまで器具の誤差へ含めると、器具の再現性を誤って評価する。',
    ],
    [
      '同じ人・同じ重量を使ったので、速度差は器具の誤差として集計できる',
      '同じ重量でも疲労などで速度は変わり、生物学的変動を切り分けられていない。',
    ],
    [
      '疲労状態をさらに広く集めれば、その範囲を器具の誤差幅として使える',
      '人の出力変動を増やしても、器具に由来する誤差の評価にはならない。',
    ],
    '測定器の性能と、測られる運動そのものの変動は別の問題。器具の検証では、その誤差を適切に反映する条件が必要になる。',
    [
      ref(
        'ex-assess-src-profiling',
        'PDF p.9: Reliability—technology errorとbiological error、linear position transducerの例',
      ),
    ],
    3,
  ),
  q(
    'ex-assess-quality',
    6,
    3,
    'change-versus-typical-error',
    '同じ条件で行ったテストの通常のばらつきは約0.5単位と把握している。今回だけ0.1単位よくなったとき、最も慎重な説明は？',
    [
      '観察された差は通常のばらつきより小さく、確実な改善とはまだ言い切れない',
      '小さい差だけでは実変化と誤差を十分に区別できない。',
    ],
    [
      '測定値は0.1単位刻みで表示できるので、0.1の差は実変化として扱う',
      '表示の細かさは、通常変動より小さな差を実変化とする根拠ではない。',
    ],
    [
      '通常変動より小さいので、本人の体力は変わっていないと確定する',
      '改善を確定できないことと、変化がないと確定できることは異なる。',
    ],
    'ここで示す誤差は設問の仮定であり、個別テストの判定基準ではない。通常のばらつきと変化量を並べ、反復測定や他の情報も含めて解釈する。',
    [
      ref(
        'ex-assess-src-profiling',
        'PDF p.9: ReliabilityのSEM説明 / Sensitivity—noise、real change、test error',
      ),
    ],
    3,
  ),
  q(
    'ex-assess-quality',
    7,
    2,
    'test-battery-fatigue-order',
    '同じ来館枠で、挙上による最大筋力の評価と、疲労の大きい自転車持久性テストを行う。参加者によって回復時間が異なる。両方を測るとき、先行テストの影響を抑える運用はどれか。',
    [
      '最大筋力を先に測り、参加者の十分な回復を確認してから自転車を行う',
      '最大筋力を先行する持久性疲労の影響から守り、二つ目の測定にも回復を確保する。',
    ],
    [
      '自転車を先に行い、呼吸の落ち着きを確認したら最大筋力を測る',
      '呼吸が落ち着いても持久性テストの影響が残り得る。ここでは最大筋力を先に測る。',
    ],
    [
      '最大筋力を先に測り、全員で同じ固定時間を空けてから自転車を行う',
      '順序は適切だが、固定時間だけでは回復の個人差に対応できない。',
    ],
    'テストバッテリーでは低疲労の測定から始め、回復を確保し、疲労の大きいテストを後に配置するのが基本。個別の目的と要項も確認する。',
    [
      ref(
        'ex-assess-src-test-module',
        'Module 5.1-4 / PDF p.13: Sequence of Tests、complete recovery、strength→aerobic capacity',
      ),
    ],
  ),
  q(
    'ex-assess-quality',
    8,
    1,
    'population-generalization',
    '熟練した若年競技者だけで検証された高技能テストを、運動経験のない中年者へ採用したい。妥当性の検討として適切なのは？',
    [
      '対象者と実施条件の違いを確認し、同じ解釈が成り立つ根拠を検討する',
      '他集団への一般化は、元の研究でよい結果だっただけでは保証されない。',
    ],
    [
      '同じ機器を使えば、競技者で得られた妥当性を初心者にも採用できる',
      '機器が同じでも対象の技能・経験が違い、解釈を一般化する根拠は別に必要。',
    ],
    [
      '初心者で繰り返し同じ値が出れば、目的の能力を測れていると判断する',
      '再現性があっても、技能が制限する別の能力を測っている可能性は残る。',
    ],
    '対象集団・環境への一般化と、テストを実行する技能の適合を確認する。難しい課題ほど目的の能力だけを捉えられるとは限らない。',
    [
      ref('ex-assess-src-profiling', 'PDF p.4, Table 1: External validity'),
      ref('ex-assess-src-agility', 'Test Selection：training level、novice subjects'),
    ],
    3,
  ),
  q(
    'ex-assess-adult-tests',
    1,
    1,
    'adult-grip-span-adjustment',
    'スポーツ庁20〜64歳要項で握力を測る。手の大きさが違う利用者へ同じ握り幅を固定している。要項に合う修正は？',
    [
      '人差し指の第2関節がおおむね直角になるよう、握り幅を調整する',
      '成人要項では握り幅をこの指の角度を目安に調整する。',
    ],
    [
      '中指の第2関節を角度の目安にして握り幅を調整する',
      '成人要項で角度の目安にするのは中指ではなく人差し指である。',
    ],
    [
      '人差し指の第1関節がおおむね直角になる幅へ調整する',
      '要項は人差し指の第2関節を目安にし、指が合っていても関節が違う。',
    ],
    '測定器を統一しても、必要な個人別の調整は行う。ここでは成人要項の具体的な握り幅の規則を適用する。',
    [ref('f-sports-test-adult', '印刷p.2 握力 2方法(1)：人差し指の第2関節と握りの幅')],
  ),
  q(
    'ex-assess-adult-tests',
    2,
    1,
    'adult-grip-best-side-average',
    'スポーツ庁20〜64歳要項による握力の記録が、右42kg・45kg、左39kg・41kgだった。最終記録は？',
    ['43kg', '右の最良45kgと左の最良41kgを平均すると43kgになる。'],
    ['約42kg：四つ全部の平均', '要項は全4試行の平均ではなく、左右各最良値の平均を採用する。'],
    ['45kg：左右を合わせた最大値', '片側だけの最大値を最終記録とする規則ではない。'],
    '右左交互に2回ずつ測り、左右各最良値を平均する。この例では(45＋41)÷2＝43kg。各測定と最終平均の丸め方も区別する。',
    [
      ref(
        'f-sports-test-adult',
        '印刷p.2 握力 3記録(1)〜(3)：左右2回、各値切捨て、各最良値の平均と四捨五入',
      ),
    ],
    3,
  ),
];

// Batch 2: complete adult protocols and introduce body-composition calculations.
assessmentExpansionSources.push(
  {
    id: 'ex-assess-src-bmi',
    title: '厚生労働省 e-ヘルスネット：BMI',
    url: 'https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-002.html',
    edition: '最終更新2024-02-15の公開Web版',
    checkedAt,
    locator: '冒頭の定義・計算式と、国による判定基準の違い',
    note: '体格指数の式を参照。設問の数値は独自の計算例で、疾患の診断・治療判定には使用しない。',
  },
  {
    id: 'ex-assess-src-obesity',
    title: '厚生労働省 e-ヘルスネット：肥満と健康',
    url: 'https://kennet.mhlw.go.jp/information/information/food/e-02-001',
    edition: '最終更新2019-12-17の公開Web版',
    checkedAt,
    locator: '肥満の定義（成人）：BMIのみでは筋肉質と脂肪過多を区別できない段落',
    note: 'BMIの解釈の限界に参照。診断基準表や小児の基準を、成人向け運動指導の診断として使わない。',
  },
  {
    id: 'ex-assess-src-body-fat',
    title: '厚生労働省 e-ヘルスネット：体脂肪率',
    url: 'https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-041',
    edition: '最終更新2024-05-28の公開Web版',
    checkedAt,
    locator: '体重に占める体脂肪の比率／生体電気インピーダンス法の水分・機種の影響',
    note: '脂肪量の計算は比率の定義から導く独自例。除脂肪量は設問に示す二成分の区分であり、筋肉量だけを意味しない。',
  },
  {
    id: 'ex-assess-src-fat-meter',
    title: '厚生労働省 e-ヘルスネット：体脂肪計',
    url: 'https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-091.html',
    edition: null,
    checkedAt,
    locator: '体脂肪の測定法一覧：キャリパーによる皮下脂肪厚など',
    note: '測定原理の区別に限って参照。ページにある体脂肪率の数値を統一診断基準として採用しない。',
  },
);

assessmentExpansionUnits.push({
  id: 'ex-assess-bodycomp',
  domainId: 'assessment',
  title: '体格と体組成を区別する',
  subtitle: 'BMI・脂肪量・測定条件を、過大な結論に結びつけない',
  minutes: 22,
  level: '応用',
  objectives: [
    { id: 'ex-assess-bodycomp-o1', text: '単位をそろえてBMI・脂肪量・除脂肪量を計算する' },
    {
      id: 'ex-assess-bodycomp-o2',
      text: 'BMIと体組成の違い、BIAや皮下脂肪厚の測定原理の限界を説明する',
    },
    { id: 'ex-assess-bodycomp-o3', text: '指定した腹囲測定法の位置・姿勢をそろえて比較する' },
  ],
  sections: [
    {
      title: 'BMIは身長と体重から求める',
      body: 'BMIは体重kgを身長mの2乗で割った体格指数です。身長をcmのまま代入すると桁が変わります。この指数だけでは筋肉と脂肪を分けられません。同じBMIでも身体の組成や脂肪の分布が異なり得るため、見た目や一つの値だけで本人の状態を決めつけないようにします。',
    },
    {
      title: '割合を量へ戻す',
      body: '体脂肪率は体重に占める脂肪の割合です。計算例として体重80kg・体脂肪率25%なら脂肪量は80×0.25＝20kg。体重を脂肪とそれ以外に分ける二成分の区分では、除脂肪量は80−20＝60kgです。残りには水分・骨・臓器なども含まれるため、60kgをすべて筋肉量とは呼びません。推定された割合に誤差があれば、計算した量にも影響します。',
    },
    {
      title: '測定原理と、その日の条件',
      body: '家庭用などのBIAは電流の流れやすさから体脂肪率を推定します。身体の水分状態や機種が違うと値に影響するため、短期の表示変化を脂肪の増減と直結させません。キャリパーで測るのは局所の皮下脂肪厚であり、その値や換算値を内臓脂肪の直接撮影のようには扱いません。',
    },
    {
      title: '位置の違う周径を混ぜない',
      body: '腹囲の推移を記録する場合は、採用した要項の位置・姿勢・呼吸条件を記録し、同じ方法で比較します。日本の健診で使うへその高さと、海外の別のウエスト測定法を混在させると、変化の解釈が難しくなります。測定の説明と同意、プライバシーへの配慮も前提です。周径だけで病名を決めるものではありません。',
    },
    {
      title: '関連動画',
      body: 'この小単元の目標に直接対応し、内容を確認できた動画は未収録です。計算と測定の限界は本文・確認問題で学びます。',
    },
  ],
  example: {
    situation:
      '筋トレ直後のBIA表示が朝より低く、利用者が「その場で脂肪が大きく減った」と喜んでいる。',
    judgment:
      '水分状態などの影響を説明し、同条件の経過を確認する。表示の短期変化を、そのまま脂肪減少の量とは認定しない。',
  },
  terms: [
    { term: 'BMI', meaning: '体重kg÷身長mの2乗で求める体格指数。' },
    { term: '脂肪量', meaning: '体重に占める脂肪の量。割合と体重から計算する場合もある。' },
    {
      term: '除脂肪量',
      meaning: '二成分に分けたときの、体重から脂肪量を除いた量。筋肉だけではない。',
    },
    { term: 'BIA', meaning: '生体電気インピーダンスを利用して身体組成を推定する方法。' },
  ],
  sourceRefs: [
    ref('ex-assess-src-bmi', '冒頭のBMI計算式'),
    ref('ex-assess-src-obesity', '成人の定義：BMIで筋肉質と脂肪過多を区別できない段落'),
    ref('ex-assess-src-body-fat', '体脂肪率の定義とBIAの水分・機種による影響'),
    ref('ex-assess-src-fat-meter', '体脂肪の測定法一覧：キャリパー'),
  ],
});

const batch2 = (...args: Parameters<typeof q>): Question => {
  const question = q(...args);
  return { ...question, review: { ...question.review, checkedAt: '2026-11-04T12:07:36Z' } };
};

assessmentExpansionQuestions.push(
  batch2(
    'ex-assess-adult-tests',
    3,
    2,
    'adult-sit-up-return-contact',
    '成人向け上体起こしで肘は大腿に着くが、戻すたびに背中がマットに着かない。この反復の記録は？',
    [
      '背中が着いて戻らない反復は、回数に含めない',
      '要項では仰臥姿勢に戻したときの背中の接触も条件である。',
    ],
    [
      '肘が大腿に着けば、戻し方に関係なくすべて数える',
      '起こす局面だけでなく戻す局面にも規則がある。',
    ],
    ['背中を着けない反復だけを数える', '要項の条件と逆である。'],
    '上体起こしは30秒間の有効反復数を記録する。背中がマットに着かずに戻した反復は数えない。',
    [ref('f-sports-test-adult', '印刷p.3 上体起こし 3記録(1)、4注意(1)')],
  ),
  batch2(
    'ex-assess-adult-tests',
    4,
    2,
    'adult-sit-reach-knee-control',
    '成人向け長座体前屈で、箱を遠くへ押すために膝を曲げ始めた。採用する要項に合う修正は？',
    [
      '膝を曲げず、両手を離さずにゆっくり箱を押す方法を確認する',
      '膝を伸ばした前屈動作として実施する規則である。',
    ],
    [
      '遠い記録になるなら、膝の曲げ方は毎回変えてよい',
      '課題の条件が変わり、要項に沿った測定にならない。',
    ],
    ['箱が進めば、片手で押して体を回しても同じ測定である', '指定の両手と前方への動作とは異なる。'],
    'この問題は初期姿勢の零点ではなく、前屈中の動作条件を扱う。膝を曲げず、両手を厚紙から離さずに箱を押す。',
    [ref('f-sports-test-adult', '印刷p.4 長座体前屈 2方法(3)、4注意(1)')],
  ),
  batch2(
    'ex-assess-adult-tests',
    5,
    2,
    'adult-side-step-scoring-unit',
    '成人向け反復横とびで、右外側の線を踏み、中央線をまたいでから、左外側の線を踏んで再び中央線をまたいだ。この一巡の加点は？',
    ['4点', '左右の外側の線で各1点、中央線をまたいだ2回で計2点。'],
    ['1点：一巡全部を1点とする', '要項の単位は一巡ではなく、各ラインの通過である。'],
    ['2点：外側ラインだけを数える', '中央ラインの有効な通過も加点対象である。'],
    '線は左右と中央の3本。20秒間、外側の線に足が届いた動作と中央線をまたいだ動作をそれぞれ数える。',
    [ref('f-sports-test-adult', '印刷p.5 反復横とび 1準備、2方法、3記録(1)、4注意(3)')],
  ),
  batch2(
    'ex-assess-adult-tests',
    6,
    3,
    'adult-fast-walk-finish-timing',
    '成人向け急歩のゴールで、利用者が手を前へ伸ばし、手だけ先にゴールラインへ到達した。計時を止める基準は？',
    ['胴がゴールラインに到達したとき', '要項は頭・肩・手・足ではなく胴の到達を基準にする。'],
    ['伸ばした手の先が到達したとき', '手の到達は要項のゴール判定ではない。'],
    ['最後の足全体がラインを通過したとき', '最後の足の通過を待つ規則ではない。'],
    '計時を始める条件と止める条件を事前にそろえる。急歩の終了時刻は、胴の到達を基準にする。',
    [ref('f-sports-test-adult', '印刷p.6 急歩 3記録(1)：胴（頭、肩、手、足ではない）')],
  ),
  batch2(
    'ex-assess-adult-tests',
    7,
    3,
    'adult-shuttle-consecutive-miss',
    '成人向け20mシャトルランで電子音に1回遅れたが、次の電子音には線に間に合い、遅れを解消した。終了条件の理解は？',
    [
      'この1回の遅れだけでは終了せず、規定のペースを保てる間は続けられる',
      '要項は1回の遅れを次で解消できた場合を、2回連続の未到達と区別する。',
    ],
    ['遅れが解消しても、1回でも遅れたら必ず終了する', '要項の連続回数の条件と異なる。'],
    ['2回連続で届かなくても、本人が望めば必ず続けさせる', '要項の終了条件を無視している。'],
    '1回の遅れを次で解消できる場合は継続できる。ペースを維持できずやめる場合、または2回連続で線へ届かない場合は終了する。健康上の異変への対応は別途優先する。',
    [ref('f-sports-test-adult', '印刷p.7 20mシャトルラン 2方法(5)、3記録(1)')],
    3,
  ),
  batch2(
    'ex-assess-adult-tests',
    8,
    3,
    'adult-standing-jump-nearest-contact',
    '成人向け立ち幅とびで、着地したかかとより踏切線に近い位置へ手を着いた。要項に従う測定終点は？',
    [
      '身体が触れたうち、最も踏切線に近い位置',
      '足だけに限定せず、最も近い身体接触位置から距離を測る。',
    ],
    ['かかとだけ。手の接触は距離に関係しない', '要項は身体の接触位置を基準にしている。'],
    ['最も遠くへ着いたつま先の位置', '最も近い接触位置という基準と逆になる。'],
    '踏切前の両足の中央位置と、身体が触れた最も近い位置を結ぶ距離を測る。歩幅や最遠の足先の距離とは区別する。',
    [ref('f-sports-test-adult', '印刷p.9 立ち幅とび 3記録(1)、4注意(5)')],
  ),
  batch2(
    'ex-assess-bodycomp',
    1,
    1,
    'bmi-unit-calculation',
    '身長170cm、体重72.25kgの成人のBMIを、身長をmに直して計算すると？',
    ['25.0', '72.25÷(1.70×1.70)＝25.0。'],
    ['42.5：体重を身長mで1回だけ割る', 'BMIでは身長を2乗する。'],
    ['0.0025：身長cmの2乗で割る', '身長はcmではなくmを用いる。'],
    'BMI＝体重kg÷身長mの2乗。この問題は指数の計算であり、この値だけで疾患や治療の必要性を診断するものではない。',
    [ref('ex-assess-src-bmi', '冒頭の定義・計算式：身長はcmではなくm')],
    3,
  ),
  batch2(
    'ex-assess-bodycomp',
    2,
    2,
    'bmi-cannot-separate-components',
    '身長と体重が同じ2人について、片方は筋量が多く、もう片方は脂肪量が多い可能性がある。BMIから言えることは？',
    [
      'BMIは同じになるが、脂肪と筋肉の内訳が同じとは限らない',
      'BMIは身長と体重から求めるため、内訳を直接区別しない。',
    ],
    [
      'BMIをそろえて比較すれば、脂肪の割合もそろえた比較になる',
      '身長と体重の指数をそろえても、身体組成は統一されない。',
    ],
    [
      '筋量の影響を避けるため、BMIに体脂肪率の代わりをさせる',
      'BMI自体が筋肉と脂肪を区別せず、筋量の影響を除いた脂肪率にはならない。',
    ],
    '体格と身体組成を区別する。BMIだけで筋肉質か脂肪過多かを判定せず、目的に合う別の情報も確認する。',
    [ref('ex-assess-src-obesity', '肥満の定義（成人）：BMIだけでは筋肉質と脂肪過多を区別できない')],
  ),
  batch2(
    'ex-assess-bodycomp',
    3,
    1,
    'fat-and-fat-free-mass-calculation',
    '体重80kg、体脂肪率25%という推定値を使い、体重を脂肪とそれ以外の2成分に分ける。計算上の脂肪量と除脂肪量は？',
    ['脂肪量20kg、除脂肪量60kg', '80×0.25＝20、80−20＝60。除脂肪量を全て筋肉量とはしない。'],
    ['脂肪量25kg、除脂肪量55kg', '25%という割合を、そのまま25kgという量に置き換えている。'],
    ['脂肪量60kg、除脂肪量20kg', '脂肪の割合と、それ以外の割合を逆に適用している。'],
    '割合を小数へ変換して体重に掛ける。除脂肪量は脂肪以外の全体で、水分・骨・臓器なども含む。元の体脂肪率が推定なら、この計算も推定値に基づく。',
    [
      ref(
        'ex-assess-src-body-fat',
        '冒頭：体脂肪率は体重に占める脂肪の比率。二成分への区分と数値は設問の仮定',
      ),
    ],
    3,
  ),
  batch2(
    'ex-assess-bodycomp',
    4,
    2,
    'bia-hydration-influence',
    '朝のBIAと、飲水・運動・入浴後のBIAで体脂肪率の表示が変わった。表示差の解釈として最も適切なのは？',
    [
      '水分状態などによる推定値の変動を考慮し、短時間の差を脂肪変化と断定しない',
      'BIAの推定は体内の水分量の影響を受ける。',
    ],
    [
      '朝と運動後の値を平均すれば、水分の条件差を補正できる',
      '異なる状態の平均は、水分の差を補正して脂肪の実変化を示す方法ではない。',
    ],
    [
      '同じ機種の記録なので、変化量は条件をそろえた長期推移と同様に使う',
      '機種が同じでも体内水分などの条件が違い、同条件の推移と同等の比較にはならない。',
    ],
    '同じ機種でも、その日の状態が推定値へ影響する。測定条件を記録して推移を確認し、1回の表示差だけで結論づけない。',
    [
      ref(
        'ex-assess-src-body-fat',
        '第3段落：生体電気インピーダンス法は水分量や機種の違いに影響される',
      ),
    ],
  ),
);

// Batch 3: complete body composition, behavior support, and current-history appraisal.
assessmentExpansionSources.push(
  {
    id: 'ex-assess-src-waist',
    title: '厚生労働省 e-ヘルスネット：ウエスト周囲径',
    url: 'https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-089.html',
    edition: '最終更新2024-05-28の公開Web版',
    checkedAt,
    locator: '冒頭の定義と、日本の健診と海外の測定位置の違い',
    note: '測定位置の違いを区別する例。腹囲だけで疾患を診断せず、採用した要項と本人の状態を確認する。',
  },
  {
    id: 'ex-assess-src-behavior',
    title: 'NIH NIDDK: Changing Your Habits for Better Health',
    url: 'https://www.niddk.nih.gov/health-information/diet-nutrition/changing-habits-better-health',
    edition: 'Last Reviewed November 2020の公開Web版',
    checkedAt,
    locator:
      'Preparation / Action—Track your progress, Overcome roadblocks / Maintenance—Deal with unexpected setbacks',
    note: '一般的な行動支援の例。本文の四段階整理を全ての行動変容モデルの唯一の分類とは扱わない。治療の代替には使用しない。',
  },
  {
    id: 'ex-assess-src-adult-activity',
    title: '厚生労働省：身体活動・運動ガイド2023 推奨シート 成人版',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-002.html',
    edition: 'ガイド2023／公開解説の最終更新2024-02-22',
    checkedAt,
    locator: '2 身体活動・座位行動とは',
    note: '生活活動・運動・座位行動を聴取で区別するために参照。推奨量を本人の安全確認なしに一律処方しない。',
  },
  {
    id: 'ex-assess-src-preexercise',
    title: '厚生労働省：身体活動・運動ガイド2023 身体活動・運動を安全に行うためのポイント',
    url: 'https://kennet.mhlw.go.jp/information/information/exercise/s-00-008',
    edition: 'ガイド2023／公開解説の最終更新2024-03-19',
    checkedAt,
    locator: '2 確認するべき事項とタイミング／3-2 新たに運動を開始する時／3-3 毎回の運動前',
    note: '現在の健康情報と活動量、目的・内容に応じた環境の確認に参照。本文の中止血圧や疾患の診断基準を本単元の問題には採用しない。',
  },
);

assessmentExpansionUnits
  .find((u) => u.id === 'ex-assess-bodycomp')!
  .sourceRefs.push(ref('ex-assess-src-waist', '冒頭の測定位置と、日本・海外の方法の違い'));

assessmentExpansionUnits.push(
  {
    id: 'ex-assess-behavior',
    domainId: 'assessment',
    title: '継続を支える行動の面談',
    subtitle: '意欲を具体的な行動・記録・障壁への備えへ変える',
    minutes: 20,
    level: '応用',
    objectives: [
      { id: 'ex-assess-behavior-o1', text: '実行前の準備状態に合わせ、具体的な行動目標を作る' },
      { id: 'ex-assess-behavior-o2', text: '活動と気持ちの記録から、継続を妨げる条件を見つける' },
      {
        id: 'ex-assess-behavior-o3',
        text: '中断・障壁・周囲の支援に対し、再開できる計画を本人と作る',
      },
    ],
    sections: [
      {
        title: '決心と実行を分けて聞く',
        body: '始めると決めたことと、実際に始めていることは異なります。決心したがまだ実行前なら、取り組む行動を具体化する支援が役立ちます。ここではNIDDKの一般向け整理を参考にしており、段階名だけで本人を固定的に分類するものではありません。',
      },
      {
        title: '結果だけでなく、行うことを決める',
        body: '体重などの結果目標に加え、いつ・どこで・何をするかという行動を決めます。最初は本人が取り組める小さな変化から考えます。実行後の面談では、達成の有無だけでなく、そのときの気持ちや実施できた条件も確認します。',
      },
      {
        title: '記録を、採点ではなく調整に使う',
        body: '活動の記録と気持ちは、うまくいく条件や続けにくい条件を見つける材料です。できなかった日を隠さず、雨天・勤務時間・疲れなどの具体的な障壁を話せるようにします。記録が本人を責める道具になると、必要な情報を集めにくくなります。',
      },
      {
        title: '中断への代案と、望む支援',
        body: '屋外で行えない日の屋内の代案などを前もって考えます。中断があっても全て失敗と決めつけず、再開できる一歩へ戻ります。本人が望む場合は友人や家族の協力も選択肢ですが、誰に何を頼みたいかは本人と決めます。',
      },
      {
        title: '関連動画',
        body: 'この小単元の目標に直接対応し、内容を確認できた動画は未収録です。面談ケースと確認問題で練習します。',
      },
    ],
    example: {
      situation:
        '屋外ウォーキングを始めたが、雨の日が続いてやめてしまい、「自分は続かない人だ」と話す。',
      judgment:
        '中断の条件を確認し、雨の日の代案と再開の小さな行動を一緒に決める。中断だけで本人の能力や意欲全体を決めつけない。',
    },
    terms: [
      { term: '行動目標', meaning: 'いつ何を行うかなど、本人が実行する行動を具体化した目標。' },
      { term: 'セルフモニタリング', meaning: '自分の行動や状態を記録し、振り返ること。' },
      { term: '障壁', meaning: '時間・費用・環境など、実行を妨げる具体的な条件。' },
    ],
    sourceRefs: [
      ref(
        'ex-assess-src-behavior',
        'Preparation / Track your progress / Overcome roadblocks / Deal with unexpected setbacks',
      ),
    ],
  },
  {
    id: 'ex-assess-health',
    domainId: 'assessment',
    title: '健康情報を評価の条件に変える',
    subtitle: '不足・更新・活動量・測定条件を整理する',
    minutes: 22,
    level: '応用',
    objectives: [
      { id: 'ex-assess-health-o1', text: '生活活動を含む現状を聞き、健康情報の不足と更新を扱う' },
      { id: 'ex-assess-health-o2', text: '健康状態と目的・強度から、評価に必要な環境条件を選ぶ' },
      {
        id: 'ex-assess-health-o3',
        text: '血圧などの評価記録で測定条件と集計法を区別し、診断へ飛躍しない',
      },
    ],
    sections: [
      {
        title: '運動していない、だけで活動量を決めない',
        body: 'ジムや競技の経験がなくても、通勤・家事・仕事で身体を動かしている場合があります。計画的・定期的な運動と、日常の生活活動を分けて聞きます。活動の種類・時間・頻度・継続期間などを具体化し、本人の現在地を把握します。',
      },
      {
        title: '空欄と、以前の回答をそのまま使わない',
        body: '未記入の健康情報は「問題なし」という回答ではありません。判断に必要な情報を本人へ確認します。また、初回だけで終わらず、通院・服薬・傷害・普段の活動などの変化を必要に応じて更新します。古い記録が現在の状態を保証するわけではありません。',
      },
      {
        title: '目的と内容に合う環境で評価する',
        body: '健康状態に加え、どのような目的で、どの程度の強度の評価・運動を行うかで必要な環境は変わります。高い強度を求めるほどよい評価になるとは限りません。本人の状態と実施内容を照合し、必要な支援や対応を準備できる場所・体制を選びます。',
      },
      {
        title: '測定値と判断の役割を分ける',
        body: '記録には測定方法、姿勢、測った機会、集計方法も残します。血圧などの数値を得ることと、病名の診断や薬の変更を決めることは別です。採用した測定法と医療職からの条件を尊重し、トレーナーが治療上の結論へ置き換えないようにします。',
      },
      {
        title: '関連動画',
        body: 'この小単元の目標に直接対応し、内容を確認できた動画は未収録です。問診と測定記録のケースから学びます。',
      },
    ],
    example: {
      situation: '初回面談から半年後、前回の問診票をそのまま使って体力測定を始めようとしている。',
      judgment:
        '前回以降の変化を確認し、現在の健康情報と活動状況へ更新する。初回記録だけを現在の評価条件として扱わない。',
    },
    terms: [
      { term: '生活活動', meaning: '家事・労働・通勤など、日常生活に伴う身体活動。' },
      {
        term: '運動',
        meaning: '健康・体力の維持増進などを目的に、計画的・定期的に実施する身体活動。',
      },
      { term: '情報更新', meaning: '前回以降の変化を確認し、記録を現在の状態に対応させること。' },
    ],
    sourceRefs: [
      ref('ex-assess-src-adult-activity', '2 身体活動・座位行動とは'),
      ref(
        'ex-assess-src-preexercise',
        '2 確認事項とタイミング / 3-2 新たに開始する時 / 3-3 毎回の運動前',
      ),
      ref(
        'f-nsca-handbook',
        'Appendix H, 印刷p.49: 1.B.1–2 医療歴・健康評価の情報収集と解釈（米国DCOの参考、国内正式細目ではない）',
      ),
    ],
  },
);

const batch3 = (...args: Parameters<typeof q>): Question => {
  const question = q(...args);
  return { ...question, review: { ...question.review, checkedAt: '2026-11-04T12:13:35Z' } };
};

assessmentExpansionQuestions.push(
  batch3(
    'ex-assess-bodycomp',
    5,
    2,
    'skinfold-not-visceral-imaging',
    '腹部のキャリパー測定値が小さくなったので、「腹腔内の内臓脂肪面積が何cm²減った」と報告しようとしている。適切な評価は？',
    [
      'キャリパーは局所の皮下脂肪厚を測るため、内臓脂肪面積の直接測定とは区別する',
      '測った部位・量と、報告しようとする別の量を混同しない。',
    ],
    [
      '局所の厚みの減少率を、内臓脂肪面積の減少率へ換算して報告する',
      '局所の皮下脂肪厚から内臓脂肪面積への比例換算は示されていない。',
    ],
    [
      '腹囲も減っていれば、二つの値から内臓脂肪面積の実測値として報告する',
      '別の目安を併用しても、内臓脂肪面積を直接測定した結果にはならない。',
    ],
    '測定原理から報告できる範囲を決める。皮下脂肪厚やそこからの推定値を、内臓脂肪の直接画像評価に置き換えない。',
    [ref('ex-assess-src-fat-meter', '測定法一覧：キャリパーで皮下脂肪をつまみ厚みを測る方法')],
  ),
  batch3(
    'ex-assess-bodycomp',
    6,
    3,
    'waist-protocol-location',
    '日本の健診と同じ方法で測った成人の腹囲を、次回も同じ系列で記録したい。臍の位置に特別な変位はない。施設には、最も細いくびれや下肋骨と骨盤の中間を測る様式もある。次回はどう測るか。',
    [
      '臍の高さで測り、別の位置で測る場合は経過記録と別の項目にする',
      '採用した日本の健診方式の位置をそろえれば、同じ手順で比較できる。',
    ],
    [
      '最も細い位置に切り替え、今回両方を測った差で前回の値を補正する',
      '一度の部位差を使って、過去の別部位の値まで換算できるという根拠はない。',
    ],
    [
      '下肋骨と骨盤の中間に切り替え、その解剖学的位置を固定して前回の値へつなぐ',
      '今後の位置を統一できても、臍の高さで測った前回値との手順差は残る。',
    ],
    '日本の健診での腹囲と、海外で用いられる別のウエスト測定位置には違いがある。実施する要項を決め、同じ位置・条件で比較する。',
    [ref('ex-assess-src-waist', '冒頭：へその高さと、海外のウエスト周囲径の測定部位との違い')],
  ),
  batch3(
    'ex-assess-behavior',
    1,
    1,
    'preparation-before-action',
    '利用者は「来週から始めると決めた。まだ始めていないので、日程を決めたい」と話す。面談で優先する支援は？',
    [
      '実行前の準備として、本人に合う開始日と具体的な行動を一緒に決める',
      '決心した状態と、実際に継続している状態を区別して支える。',
    ],
    [
      '行動の効果を詳しく説明する時間を中心にし、開始日を決める相談は次回にする',
      'すでに始める決心をして日程の相談を求めており、今は行動へ移す具体化が優先される。',
    ],
    [
      '数か月後も続く場面を主に話し合い、直近の実行手順は本人に任せる',
      '維持を考える前に、未設定の開始日と行動を具体化する支援が必要である。',
    ],
    '実行の決心ができても、計画を行動へ移す準備が残る。段階名の暗記より、今必要な支援を本人の状況から選ぶ。',
    [
      ref(
        'ex-assess-src-behavior',
        'What stage of change—Preparation / Preparation: Have you made up your mind?',
      ),
    ],
  ),
  batch3(
    'ex-assess-behavior',
    2,
    1,
    'specific-action-goal',
    '体力をつけたい利用者が、まず2週間だけ歩く計画を試す。退勤時刻は読めないが、週の初めに昼休みを確保できる日が2日分かる。会社近くに安全な屋内通路がある。実施の振り返りにも使える行動目標はどれか。',
    [
      '週の初めに可能な2日を選び、昼休みに通路を10分歩いて実施を記録する',
      '事前に見通せる時間帯を選び、行動と確認方法も具体的にしている。',
    ],
    [
      '週2回、退勤後に通路を10分歩く予定を固定し、実施を記録する',
      '内容と記録は具体的だが、退勤時刻が読めないという本人の制約に対応していない。',
    ],
    [
      '週に合計20分歩く目標を決め、週末に歩いた総時間を振り返る',
      '週量は測れるが、今の障壁に合わせていつどこで始めるかが決まらない。',
    ],
    '本人にとって実行可能な小さな行動から計画する。結果目標に加え、実際に行うことと記録方法を決める。',
    [ref('ex-assess-src-behavior', 'Preparation：small changes、具体的な歩行時間・頻度の例')],
  ),
  batch3(
    'ex-assess-behavior',
    3,
    2,
    'self-monitoring-feelings',
    '昼休みの歩行を始めた利用者は、予定変更がある日や気分が乗らない日に中断しやすいと感じている。記録の負担を抑えつつ、実施と中断を分けた条件を翌週の面談で比べるには何を記録するか。',
    [
      '予定日ごとに実施の有無、予定の変更、歩こうとした時の気持ちを短く残す',
      '実施した日と中断した日の条件を、日付をそろえて比べられる。',
    ],
    [
      '歩いた日に限り、距離と気分、予定の変更を記録する',
      '実施日の情報はそろうが、中断日の条件を同じ形式で記録していない。',
    ],
    [
      '一週間の合計歩行時間と、週全体で気になった予定や気分をまとめて残す',
      '集計は簡潔だが、どの日の条件が実施や中断に重なったかを比較できない。',
    ],
    '行動の記録に気持ちや条件を添えると、強みと改善点を見つけやすい。記録は調整に使う。',
    [
      ref(
        'ex-assess-src-behavior',
        'Action—Track your progress：what you didとhow you felt、setbacks',
      ),
    ],
  ),
  batch3(
    'ex-assess-behavior',
    4,
    3,
    'barrier-contingency-plan',
    '利用者は仕事帰りの屋外歩行を気に入っているが、帰宅時に雨が降ると中断しやすい。駅には仕事帰りに使える屋内通路があり、休日には別の屋内施設も使える。晴れた日の楽しみと仕事帰りの習慣を両方残す計画はどれか。',
    [
      'いつもの屋外歩行を続け、帰宅時に雨が降れば駅の屋内通路へ切り替える',
      '雨のときの代替先を先に決めると、屋外で歩ける日の選択と普段の時間帯を保てる。',
    ],
    [
      '天候の影響を抑えるため、季節を通じて仕事帰りの歩行を駅の屋内通路に移す',
      '仕事帰りの習慣は保てるが、雨のない日に本人が好む屋外歩行まで置き換える。',
    ],
    [
      '雨で歩けなかった分は休日の屋内施設で補い、週の合計時間を保つ',
      '週量を維持できることはあるが、雨の日の仕事帰りに歩く行動の代わりにはならない。',
    ],
    '障壁を具体化し、起きたときに選ぶ代案を前もって決める。本人の条件と安全性を確認した代替行動にする。',
    [ref('ex-assess-src-behavior', 'Action—Overcome roadblocks：bad weatherでの屋内の代案')],
  ),
  batch3(
    'ex-assess-behavior',
    5,
    3,
    'setback-restart',
    '生活上の予定で数日実施できず、「全部失敗だから、もうやめる」と本人が話す。中断への支援として適切なのは？',
    [
      '中断を全体の失敗と決めず、事情を振り返って再開できる小さな行動へ戻す',
      '一時的な後退から立て直すことを支える。',
    ],
    [
      '生活条件が落ち着く日まで再開の検討を延期し、その間の小さな代案は作らない',
      '現在の条件でも再開できる行動を探す機会を先延ばしにしている。',
    ],
    [
      '中断した分を次週へ上乗せし、原因を振り返る前に達成量を増やす',
      '中断の障壁を確認せずに必要量を増やしており、再開可能な一歩へ調整していない。',
    ],
    '中断への対処と再開も、継続の一部。記録と本人の状況を使って計画を調整する。',
    [
      ref(
        'ex-assess-src-behavior',
        'Track your progress / Maintenance—Deal with unexpected setbacks',
      ),
    ],
  ),
  batch3(
    'ex-assess-behavior',
    6,
    3,
    'chosen-social-support',
    '一人では予定を忘れやすく、本人が「友人と一緒なら続けられそう」と提案した。利用できる支援は？',
    [
      '本人が望む範囲で友人と予定を共有し、一緒に実施する方法を相談する',
      '本人が必要とする周囲の協力を、具体的な継続支援にできる。',
    ],
    [
      '一人での実行を優先し、友人との計画は習慣化した後の段階へ回す',
      '本人が現在求める協力を習慣化まで使わない理由はなく、障壁への対応が遅れる。',
    ],
    [
      '友人と何ができるかを聞く前に、一般的な通知アプリの利用へ置き換える',
      '通知も選択肢だが、本人が提案した協力の内容や役立つ理由を確認していない。',
    ],
    '家族や友人への協力依頼も障壁への対応になる。誰のどのような支援が役立つかを本人と決める。',
    [
      ref(
        'ex-assess-src-behavior',
        'Preparationのroadblock表：I can’t make this change alone / Action—ask a friend or family member',
      ),
    ],
  ),
  batch3(
    'ex-assess-health',
    1,
    1,
    'daily-activity-versus-exercise',
    '利用者は「運動習慣はない」と答えた。平日は通勤のため片道20分歩き、仕事で荷物を運ぶ。加えて、体力維持のため毎週土曜に20分の速歩を計画して続けている。現状の記録方法はどれか。',
    [
      '通勤・運搬を生活活動、土曜の速歩を運動に分け、種類や時間を確認する',
      '活動の分類では、同じ歩行でも移動のためか、体力のために計画・継続しているかを見る。',
    ],
    [
      '通勤と土曜の歩行を運動、仕事の運搬を生活活動として記録する',
      '通勤の歩行はこの事例では移動のための生活活動であり、歩行という種目だけで分類しない。',
    ],
    [
      '本人が運動習慣はないと答えたので、土曜の速歩も生活活動に含める',
      '本人の回答に加えて活動の目的と計画性を確認する。土曜の速歩は体力維持を目的とした定期的な運動である。',
    ],
    '構造化された運動の有無だけでは、日常の活動全体は分からない。生活活動と運動を区別して現状を整理する。',
    [ref('ex-assess-src-adult-activity', '2-1 身体活動とは：生活活動と運動の二種類')],
  ),
  batch3(
    'ex-assess-health',
    2,
    1,
    'update-history-over-time',
    '初回から半年後の再評価で、安静時の測定値は前回とほぼ同じだった。本人は勤務が変わり、先月は足首を痛めて通院したという。運動を伴う再評価の条件を決める前に、記録をどう扱うか。',
    [
      '通院・傷害の経過や服薬、活動状況の変化を確認し、今の情報で記録を更新する',
      '再評価を実施する前に、前回の記録との差が運動の条件へ影響するか判断できる。',
    ],
    [
      '足首の痛みの有無だけ追記し、安静時の値が同じなら他の健康情報は前回値を用いる',
      '安静時の値が同じでも、通院や服薬の変更、活動量の低下は別に確認する必要がある。',
    ],
    [
      '活動量が変わったことだけを先に追記し、医療歴の更新は運動評価の結果を見て行う',
      '医療歴の変化は運動評価の条件にも影響し得るため、評価後まで確認を待たない。',
    ],
    '開始時だけでなく、毎回の運動前や日常の健康管理も含めた継続的な確認が必要。情報の時点を区別して記録する。',
    [
      ref(
        'ex-assess-src-preexercise',
        '2 確認するべき事項とタイミング / 3-3 毎回の運動前の体調確認',
      ),
    ],
  ),
);

// Batch 4: remaining appraisal conditions and Japanese nutrition-label applications.
assessmentExpansionSources.push(
  {
    id: 'ex-assess-src-home-bp',
    title: '日本高血圧学会：家庭で血圧を測定しましょう',
    url: 'https://www.jpnsh.jp/data/selfmonitoring.pdf',
    edition: '公式公開1ページパンフレット（発行年・版の記載を確認できず）',
    checkedAt,
    locator: 'p.1「家庭血圧の正しいはかり方」：上腕式、座位安静、1機会原則2回の平均',
    note: '測定・記録方法に限って参照。掲載ページhttps://www.jpnsh.jp/pub_katei.htmlから到達確認。診断区分・降圧目標・治療変更の図は本教材へ採用しない。',
  },
  {
    id: 'ex-assess-src-label-sheet',
    title: '消費者庁：栄養成分表示及び栄養強調表示とは',
    url: 'https://www.caa.go.jp/policies/policy/food_labeling/nutrient_declearation/assets/food_labeling_cms206_250403_11.pdf',
    edition: '公式公開2ページ資料（URLは250403、資料内の版日付は未確認）',
    checkedAt,
    locator: 'p.1 義務表示・任意表示・表示例／p.2 栄養強調表示、糖類を添加していない旨',
    note: '2ページを実画像で読み、単位・注記・糖類/糖質/食物繊維の内訳も確認。消費者の表示の読み取りに用い、表示事業者への法的判断には使用しない。',
  },
  {
    id: 'ex-assess-src-label-web',
    title: '消費者庁：栄養成分表示について',
    url: 'https://www.caa.go.jp/policies/policy/food_labeling/nutrient_declearation',
    edition: '公開Web版（版・更新日未記載、確認日時点の掲載内容）',
    checkedAt,
    locator: '栄養成分表示とは／栄養強調表示とは：含まない旨・低減された旨・無添加',
    note: '日本の表示制度の一般説明として参照。例外のある義務表示を「全ての食品で必ず表示」と一般化しない。',
  },
  {
    id: 'ex-assess-src-salt',
    title: '文部科学省 食品成分データベース：食塩相当量',
    url: 'https://fooddb.mext.go.jp/nutman/nutman_09.html',
    edition: null,
    checkedAt,
    locator: '冒頭の換算係数2.54と、食塩以外に由来するナトリウムの説明',
    note: 'mgからgへの換算は消費者庁資料p.1の式とも照合。個人の食塩摂取目標や治療食は設定しない。',
  },
);

assessmentExpansionUnits
  .find((u) => u.id === 'ex-assess-health')!
  .sections.splice(4, 0, {
    title: '家庭血圧は、測る前と集計をそろえる',
    body: 'ここでは日本高血圧学会の一般向け資料を例に、上腕式で、トイレを済ませて1〜2分椅子に座った後に測る方法を学びます。1機会に原則2回を測り、平均を記録します。都合のよい方だけを選ばず、測定値も残します。測定の記録からトレーナーが診断や薬の調整をするものではありません。',
  });
assessmentExpansionUnits
  .find((u) => u.id === 'ex-assess-health')!
  .sourceRefs.push(
    ref('ex-assess-src-home-bp', 'p.1 家庭血圧の正しいはかり方：座位安静、1機会原則2回と平均'),
  );

assessmentExpansionUnits.push({
  id: 'ex-assess-food-label',
  domainId: 'assessment',
  title: '日本の食品表示を計算して読む',
  subtitle: '食べた量・食塩相当量・内訳・強調表示を区別する',
  minutes: 24,
  level: '応用',
  foundation: '栄養学',
  objectives: [
    {
      id: 'ex-assess-food-label-o1',
      text: '表示の基準量から摂取量へ換算し、ナトリウムから食塩相当量を計算する',
    },
    { id: 'ex-assess-food-label-o2', text: '炭水化物の内訳と、任意表示がない場合の解釈を区別する' },
    {
      id: 'ex-assess-food-label-o3',
      text: '無添加・ゼロ・低減の表示が、何を述べているかを限定して読む',
    },
  ],
  sections: [
    {
      title: '基準量から、食べた量へ',
      body: '100g、100mL、1食、1包装など、数値が何に対して書かれたかを確認します。100g当たりの値を150g食べたなら1.5倍する、というように実際の量へ換算します。数値だけが小さい商品でも、基準量が違う場合は同じ土俵での比較になりません。',
    },
    {
      title: 'ナトリウムと食塩相当量',
      body: '日本の栄養成分表示ではナトリウムを食塩相当量として表示します。換算例はナトリウムmg×2.54÷1000＝食塩相当量g。gとmgの違いを先にそろえます。食塩相当量は、添加した食塩だけでなく、ほかのナトリウム化合物などに由来するナトリウムも換算した量です。',
    },
    {
      title: '炭水化物の内訳と、表示の有無',
      body: '炭水化物の内訳には糖質と食物繊維があり、糖類は糖質のさらに一部です。一般用加工食品で食物繊維は表示が推奨される項目で、未記載でも含有ゼロという意味ではありません。何が義務・推奨・任意の表示かを区別し、書かれていない量を想像で補わないようにします。',
    },
    {
      title: '強調されている成分と条件だけを読む',
      body: '糖類無添加は、糖類を含まないことと同じではありません。またゼロなどの「含まない旨」には定められた基準があり、化学的な完全ゼロを保証する表現と同一視しません。脂質の低減率が、食品全体のエネルギー低減率をそのまま表すわけでもありません。比較対象・基準量・対象成分を確認します。',
    },
    {
      title: '関連動画',
      body: 'この小単元の目標に直接対応し、内容を確認できた動画は未収録です。日本の表示資料と独自の計算例を使って学びます。',
    },
  ],
  example: {
    situation: '100g当たりと1袋当たりのエネルギー表示を、数値だけ見て比較していた。',
    judgment:
      '同じ基準量または実際に食べる量へ換算して比べる。強調表示だけで栄養全体や個人の適否を決めない。',
  },
  terms: [
    { term: '食塩相当量', meaning: 'ナトリウム量を、同量のナトリウムを含む食塩の量に換算した値。' },
    {
      term: '糖質',
      meaning: '栄養成分表示で、炭水化物から食物繊維を除いた内訳。糖類とは同義ではない。',
    },
    {
      term: '栄養強調表示',
      meaning: '特定成分の多い・少ない・低減などを、定めた条件で述べる表示。',
    },
  ],
  sourceRefs: [
    ref('ex-assess-src-label-sheet', 'pp.1–2：食品単位、内訳、無添加と強調表示の条件'),
    ref('ex-assess-src-label-web', '栄養成分表示とは／栄養強調表示とは'),
    ref('ex-assess-src-salt', 'ナトリウム量と2.54の換算'),
  ],
});

const batch4 = (...args: Parameters<typeof q>): Question => {
  const question = q(...args);
  return { ...question, review: { ...question.review, checkedAt: '2026-11-04T12:17:09Z' } };
};

assessmentExpansionQuestions.push(
  batch4(
    'ex-assess-health',
    3,
    1,
    'missing-history-not-negative',
    '運動開始前の問診票で、服薬と傷害歴の欄が未記入だった。記録の扱いとして適切なのは？',
    [
      '未確認と分かるようにし、本人へ確認してから判断に用いる',
      '空欄は「ない」という回答ではなく、必要情報の不足である。',
    ],
    [
      '前回の回答が「なし」なら、今回の空欄も同じ回答として転記する',
      '以前の回答だけでは今回の空欄の意味や現在の状態を確認できない。',
    ],
    [
      '歩行など軽い評価を先に行い、服薬や傷害歴は運動強度を上げる前に聞く',
      '開始前の条件を判断する情報であり、軽い評価だから未確認のまま始める手順にしない。',
    ],
    '健康状態や内服薬は開始前に確認する必要がある。情報が欠けている状態と、確認して該当がなかった状態を区別する。',
    [ref('ex-assess-src-preexercise', '3-2 新たに運動を開始する時：基礎疾患、内服薬等の状況把握')],
  ),
  batch4(
    'ex-assess-health',
    4,
    2,
    'appraisal-environment-fit',
    '同じテスト名でも、利用者の健康状態や予定する強度が異なる。測定場所・体制を選ぶ前に確認する組み合わせは？',
    [
      '現在の健康状態、普段の活動量、目的・内容・許容される強度と必要な対応体制',
      '本人と実施内容に合う環境を判断する情報である。',
    ],
    [
      '必要な測定器具が揃う会場を優先し、対応体制は実施開始後に調整する',
      '器具だけでは本人の状態と実施内容に応じた対応を確保できず、事前に体制も確認する。',
    ],
    [
      '同じテスト名なら同じ場所でよいと考え、強度と健康状態の差は担当者だけで補う',
      '同名のテストでも必要な環境や支援は異なり、担当者だけで体制の不足を補えるとは限らない。',
    ],
    '目的と内容、健康状態から許容される強度を踏まえて、必要な支援を用意できる環境を選ぶ。高強度や大規模な会場が常に最適とは限らない。',
    [
      ref(
        'ex-assess-src-preexercise',
        '3-2末尾：健康状態・許容運動強度・目的と内容に応じた運動環境',
      ),
    ],
    3,
  ),
  batch4(
    'ex-assess-health',
    5,
    3,
    'home-bp-seated-preparation',
    '日本高血圧学会の一般向け資料に従う家庭血圧の記録方法を学んでいる。直前まで歩いていた人への準備の説明は？',
    [
      'トイレを済ませ、椅子に1〜2分座ってから上腕式で測る',
      '資料が示す測定前の条件をそろえる説明である。',
    ],
    [
      '歩行直後に立ったまま上腕式で測り、安静時の記録とする',
      '上腕式でも、座位安静という準備条件を満たしていない。',
    ],
    [
      '椅子へ座ってすぐ測り、1〜2分の安静は測定後に行う',
      '安静を測定後に置いても、測定前に座って休む条件を満たさない。',
    ],
    'ここでは一般向け資料の測定準備を学ぶ。測定値だけで診断や治療の変更を行う問題ではない。',
    [
      ref(
        'ex-assess-src-home-bp',
        'p.1 家庭血圧の正しいはかり方：上腕血圧計、トイレ後、座位1〜2分',
      ),
    ],
  ),
  batch4(
    'ex-assess-health',
    6,
    3,
    'home-bp-occasion-average',
    '家庭血圧を、朝は128/78と124/76mmHg、同日の夜は130/80と126/78mmHgと測った。日本高血圧学会の測定方法に沿い、朝の1機会の平均として記録する値は？',
    ['126/77mmHg', '収縮期は(128＋124)÷2、拡張期は(78＋76)÷2で求める。'],
    ['127/78mmHg', '朝と夜の4回を一緒に平均した値。朝の1機会の平均には夜の値を含めない。'],
    ['128/79mmHg', '夜の2回を平均した値で、朝の記録ではない。'],
    '朝と夜は別の機会として扱う。朝の2回から収縮期と拡張期をそれぞれ平均する。この平均の計算だけで診断や服薬変更を決めない。',
    [ref('ex-assess-src-home-bp', 'p.1 家庭血圧の正しいはかり方：1機会原則2回測定して平均')],
    3,
  ),
  batch4(
    'ex-assess-food-label',
    1,
    1,
    'label-portion-conversion',
    'エネルギーが100g当たり240kcalの食品を、内容量150gの1袋すべて食べた。表示値から計算するエネルギーは？',
    ['360kcal', '240×150÷100＝360。表示基準量から実際の量へ換算する。'],
    ['240kcal', '100g当たりの値を、150gの1袋へ換算していない。'],
    ['160kcal', '実際の量が多いのに、比率を逆にして小さくしている。'],
    '表示値×食べた量÷表示の基準量で換算する。これは表示値に基づく計算であり、個人の必要エネルギーの処方ではない。',
    [ref('ex-assess-src-label-sheet', 'p.1 (1)：食品単位当たりの表示と表示例100g・1包装')],
    3,
  ),
  batch4(
    'ex-assess-food-label',
    2,
    1,
    'sodium-salt-unit-conversion',
    'ナトリウム500mgを食塩相当量へ換算する。500×2.54÷1000を用いた結果は？',
    ['1.27g', '500mgを2.54倍し、mgからgへ直すと1.27g。'],
    ['1270g', 'mgからgへの換算をしていない。'],
    ['0.50g', 'ナトリウムの質量と、食塩相当量を同一にしている。'],
    'ナトリウムmg×2.54÷1000＝食塩相当量g。食塩以外のナトリウム化合物に由来する分も換算に含まれる。',
    [
      ref('ex-assess-src-label-sheet', 'p.1 注1：ナトリウムmg×2.54÷1000'),
      ref('ex-assess-src-salt', '冒頭の係数と食塩以外由来のナトリウム'),
    ],
    3,
  ),
  batch4(
    'ex-assess-food-label',
    3,
    2,
    'carbohydrate-fiber-breakdown',
    '同じ基準量の栄養表示に炭水化物30g、食物繊維6gとある。表示の内訳として計算する糖質は？',
    [
      '24g。糖質の全量を糖類と同じとはしない',
      '炭水化物から食物繊維を引く。糖類は糖質のさらに一部である。',
    ],
    ['36g。食物繊維を炭水化物へ加える', '食物繊維は既に炭水化物の内訳に含まれる。'],
    ['30g。食物繊維の値は内訳の計算に関係しない', '炭水化物と糖質を同じ量として扱っている。'],
    '同じ基準量で炭水化物＝糖質＋食物繊維という内訳を読む。糖質と糖類は同義ではない。',
    [
      ref(
        'ex-assess-src-label-sheet',
        'p.1 別記様式3の表示例：炭水化物の内訳に糖質・糖類・食物繊維',
      ),
    ],
    3,
  ),
  batch4(
    'ex-assess-food-label',
    4,
    3,
    'no-added-not-sugar-free',
    '「糖類無添加」と表示された食品を見て、「原材料にもともと含まれる糖類も全くない」と説明しようとしている。適切な読み方は？',
    [
      '添加していないという条件と、もともと含む糖類の量を分け、糖類の表示も確認する',
      '無添加の表示は含有量ゼロと同義ではない。',
    ],
    [
      '原材料由来の糖類を除いて表示するため、糖類欄を添加分だけと読む',
      '糖類の含有量の表示は、原材料由来を除いた添加分だけの表示ではない。',
    ],
    [
      '糖類無添加という語を、糖類ゼロと同じ分類の強調表示として読む',
      '添加していない旨と、含まない旨は異なる条件の表示である。',
    ],
    '無添加は製造や添加に関する条件を述べる。糖類量やエネルギー量は、対象の栄養成分表示で別に読む。',
    [
      ref('ex-assess-src-label-sheet', 'p.2 糖類を添加していない旨：条件と糖類含有量の表示'),
      ref('ex-assess-src-label-web', '栄養強調表示とは：糖類を添加していない旨'),
    ],
  ),
  batch4(
    'ex-assess-food-label',
    5,
    3,
    'zero-claim-not-absolute-zero',
    '栄養成分の「ゼロ」という強調表示を、化学分析で1分子も含まない保証だと受け取っている。制度の一般的な読み方は？',
    [
      '成分ごとに定めた「含まない旨」の基準を満たす表示であり、完全な不含有と同一視しない',
      '制度は一定の基準値未満という条件を設けている。',
    ],
    [
      'ゼロという語は、製造時にその栄養成分を添加していないという意味で読む',
      '含有量の基準を満たす表示と、添加していない旨の条件は異なる。',
    ],
    [
      '通常の成分表示で端数を丸めて0になれば、成分別の強調表示条件を確認せず使えると読む',
      '通常の数値の丸め方だけでなく、対象成分の強調表示の条件を満たす必要がある。',
    ],
    '「含まない旨」と「添加していない旨」も分けて読む。具体的な閾値を用いる場合は、その成分と対象食品の基準を確認する。',
    [
      ref(
        'ex-assess-src-label-web',
        '栄養強調表示とは：含まない旨＝基準値未満、例「無」「ゼロ」「ノン」',
      ),
    ],
  ),
  batch4(
    'ex-assess-food-label',
    6,
    3,
    'component-reduction-not-total-energy',
    '比較対象より「脂質30%カット」とある食品について、食べた量を変えなければ総エネルギーも必ず30%減ると考えてよいか？',
    [
      'そうとは限らない。低減の対象は脂質なので、エネルギーはその表示値で確認する',
      '成分の低減率を、そのまま食品全体のエネルギー低減率へ置き換えない。',
    ],
    [
      '脂質の低減率30%を、表示された総エネルギーにそのまま掛けて推定する',
      '脂質以外の配合も総エネルギーへ関わり、成分の低減率を総量へ比例適用できない。',
    ],
    [
      '元の商品と同じ量を食べるなら、元の商品の総エネルギー値をそのまま記録する',
      '同じ摂取量でも配合が変わっているため、現在の商品のエネルギー表示を使う。',
    ],
    '何が、何と比べて、どれだけ低減されたかを読む。目立つ一つの成分表示から栄養全体を推測しない。',
    [
      ref(
        'ex-assess-src-label-web',
        '栄養強調表示とは：低減された旨の対象成分、比較対象と低減量・割合',
      ),
      ref('f-metabolism', '24.1 Catabolic Reactions：複数のエネルギー産生栄養素'),
    ],
    3,
  ),
);

// Batch 5: distinguish missing labels, recorded diet, and estimated exercise fluid losses.
assessmentExpansionSources.push(
  {
    id: 'ex-assess-src-water',
    title: 'CDC: About Water and Healthier Drinks',
    url: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html',
    edition: '最終更新2026-03-05の公開Web版',
    checkedAt,
    locator: 'Meeting your water intake every day：水・他の飲料・水分の多い食品',
    note: '水分の記録に含まれる供給源の区別に参照。米国の摂取推奨量を日本の個別飲水処方として扱わない。',
  },
  {
    id: 'ex-assess-src-food-record',
    title: 'NIH NCI Dietary Assessment Primer: Food Record at a Glance',
    url: 'https://epi.grants.cancer.gov/dietary-assessment-primer/profiles/record/',
    edition: 'Last Updated 2025-12-29の公開Web版',
    checkedAt,
    locator: 'Description / Utility of Data / Limitations of Data / Salient Features',
    note: '食事・飲料を摂取時点で記録し、食品名・調理法・量などを残す方法を参照。研究集団の摂取分布の推定法を、個人の確定的な診断へ転用しない。',
  },
  {
    id: 'ex-assess-src-day-effect',
    title: 'NIH NCI Dietary Assessment Primer: Learn More about Day-of-Week Effect',
    url: 'https://epi.grants.cancer.gov/dietary-assessment-primer/learn/day.html',
    edition: 'Last Updated 2025-12-29の公開Web版',
    checkedAt,
    locator: '本文：曜日による食事の違い、複数日記録で平日と週末を含める利点',
    note: '研究方法の曜日効果を、個人の記録の代表性を確認する考え方として参照。全員に同じ曜日差があるとは断定しない。',
  },
  {
    id: 'ex-assess-src-reactivity',
    title: 'NIH NCI Dietary Assessment Primer: Learn More about Reactivity',
    url: 'https://epi.grants.cancer.gov/dietary-assessment-primer/learn/reactivity.html',
    edition: 'Last Updated 2025-12-29の公開Web版',
    checkedAt,
    locator: '本文：記録される意識による行動変化、食事記録の偏りと行動支援での利用',
    note: '普段の食事の推定と、行動変化の支援という目的を区別するために参照。本人の故意の虚偽と決めつけない。',
  },
  {
    id: 'ex-assess-src-fluid-equation',
    title: 'NATA Position Statement: Fluid Replacement for the Physically Active',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5634236/',
    edition: 'Journal of Athletic Training 2017;52(9):877–895、DOI: 10.4085/1062-6050-52.9.02',
    checkedAt,
    locator:
      'Literature Review—Fluid Replacement, Table 2 Sweat-Rate Equation / Sweat-Rate Variability',
    note: '公式声明の公開本文・表2の計算式を照合。前後体重・飲水・尿量からの概算のみを扱う。2017年資料を全ての現行治療指針と扱わず、摂取量の一律処方・脱水診断には使用しない。',
  },
);

assessmentExpansionUnits.push({
  id: 'ex-assess-hydration',
  domainId: 'assessment',
  title: '水分と食事の記録を読み取る',
  subtitle: '記録の範囲・代表性・水分出納の概算を区別する',
  minutes: 23,
  level: '応用',
  foundation: '栄養学',
  objectives: [
    { id: 'ex-assess-hydration-o1', text: '飲み水・飲料・食品を区別し、食事と水分の量を記録する' },
    {
      id: 'ex-assess-hydration-o2',
      text: '曜日差と記録による行動変化から、普段の食事と同じとは限らない理由を説明する',
    },
    {
      id: 'ex-assess-hydration-o3',
      text: '前後の体重・飲水・尿量と時間を用い、設問の前提内で発汗量を概算する',
    },
  ],
  sections: [
    {
      title: '何を、どれだけ記録したか',
      body: '飲み水だけの量と、他の飲料や食品に含まれる水分まで含めた量は異なります。食事記録では、食品と飲料を摂取した時点で、品名・調理法・量をできる範囲で残します。単なる「1杯」だけではサイズや中身が分からないため、写真や容量なども整理すると比較しやすくなります。',
    },
    {
      title: '一つの日を、普段全体の代表にしない',
      body: '仕事の日と休日で食事が違う人もいます。日数だけでなく、どのような日を記録したかを確認します。特別な日や平日だけの記録を、そのまま毎日の習慣と決めつけません。記録の抜けや、量の見積もりの不確かさも確認します。',
    },
    {
      title: '記録すること自体も、行動を変え得る',
      body: '見られる意識や記録の手間から、記録した日だけ食事を変えることがあります。これは記録反応性と呼ばれます。普段の状態を知りたい場合は偏りの原因になり得ますが、行動変化を支える目的では記録が役立つ面もあります。目的を分けて結果を解釈します。',
    },
    {
      title: '発汗量の概算には、飲水と尿も入れる',
      body: '運動中の他の質量変化を無視し、1kgの変化を約1Lとする簡易計算では、発汗量L＝運動前体重kg−運動後体重kg＋飲んだ量L−尿量Lと概算します。さらに運動時間hで割るとL/hの発汗速度です。体重減少だけでは途中の飲水を見落とします。この推定をそのまま全員の飲水指示量や脱水の診断にしません。',
    },
    {
      title: '関連動画',
      body: 'この小単元の目標に直接対応し、内容を確認できた動画は未収録です。記録のケースと前提を明示した計算問題で学びます。',
    },
  ],
  example: {
    situation: '記録した日は普段食べる間食を控えたため、1日の食事記録と普段の食事が違っている。',
    judgment:
      '記録日の様子を確認し、普段の評価か行動支援かという目的を分ける。記録値をいつもの摂取量と断定しない。',
  },
  terms: [
    {
      term: '記録反応性',
      meaning: '記録・観察されると知ったことによって、実際の行動が変わること。',
    },
    { term: '代表性', meaning: '得られた記録が、知りたい普段の状態をどの程度表すかという性質。' },
    { term: '発汗速度', meaning: '単位時間当たりの発汗量。ここではL/hで概算する。' },
    { term: '水分出納', meaning: '身体へ入る水分と、出る水分の関係。' },
  ],
  sourceRefs: [
    ref('ex-assess-src-water', 'Meeting your water intake every day'),
    ref('ex-assess-src-food-record', 'Description / Limitations / Salient Features'),
    ref('ex-assess-src-day-effect', '本文：平日・週末の記録と曜日効果'),
    ref('ex-assess-src-reactivity', '本文：普段の食事の推定と、行動支援の目的の違い'),
    ref('ex-assess-src-fluid-equation', 'Literature Review—Fluid Replacement, Table 2'),
  ],
});

const batch5 = (...args: Parameters<typeof q>): Question => {
  const question = q(...args);
  return { ...question, review: { ...question.review, checkedAt: '2026-11-04T12:19:52Z' } };
};

assessmentExpansionQuestions.push(
  batch5(
    'ex-assess-food-label',
    7,
    2,
    'optional-label-missing-not-zero',
    '一般用加工食品の栄養成分表示に食物繊維の項目が見当たらない。読み取りとして適切なのは？',
    [
      '項目がないことだけでは、食物繊維の含有量ゼロと断定できない',
      '食物繊維は推奨される表示であり、未記載と含有ゼロは別である。',
    ],
    [
      '未記載の食物繊維を0gとして、炭水化物の全量を糖質へ分類する',
      '未記載は含有ゼロではなく、糖質の内訳をそのように計算する情報が足りない。',
    ],
    [
      '似た原材料を使う別商品に表示された食物繊維量を、この商品の量として補う',
      '別商品で原材料が似ていても配合・加工が同じとは限らず、含有量の確認にはならない。',
    ],
    '表示される成分には義務・推奨・任意の区分がある。書かれていない数値をゼロや推測値で埋めず、必要なら情報を確認する。',
    [ref('ex-assess-src-label-web', '栄養成分表示とは：表示が推奨される食物繊維と任意表示')],
  ),
  batch5(
    'ex-assess-hydration',
    1,
    1,
    'total-water-versus-plain-water',
    '記録には「飲んだ水1L」だけがある。本人は他に飲料や汁物、果物も摂っていた。この1Lをその日の全水分摂取量と呼んでよいか？',
    [
      '全量とは限らない。他の飲料や食品からの水分もあるため、記録範囲を確認する',
      '飲み水だけの量と、全ての供給源の水分は区別する。',
    ],
    [
      '無糖の飲料を加えれば全量とし、汁物や果物の水分は食品として除く',
      '全水分摂取量には、飲料だけでなく水分を含む食品からの供給も関係する。',
    ],
    [
      'カロリーのある飲料は水分補給の記録へ含めず、食事記録だけに載せる',
      'エネルギーを含むかどうかと、水分の供給源として数えるかは別の区分である。',
    ],
    'まず記録した対象を明確にする。全水分の量を求めたいなら、飲み水以外の供給源と量も必要になる。',
    [
      ref(
        'ex-assess-src-water',
        'Meeting your water intake every day：water, other beverages, foods',
      ),
    ],
  ),
  batch5(
    'ex-assess-hydration',
    2,
    1,
    'food-record-real-time-detail',
    '食事記録に毎回「昼食1回、飲料1杯」とだけ書かれている。摂取量を振り返る記録の改善として適切なのは？',
    [
      '摂取時点に近いところで品名・調理法・量や杯の容量を記録する',
      '何をどれだけ摂ったかの具体性を高め、記憶頼みの曖昧さを減らす。',
    ],
    [
      '標準的な一食と一杯の量を当てはめ、本人の食品や容器サイズは追加確認しない',
      '一般的な量を仮定するだけでは、本人が実際に摂った内容とサイズの情報が不足する。',
    ],
    [
      '週末に一週間の代表的な昼食一つを思い出し、各日の記録へ同じ内容を入れる',
      '日々の内容の違いを代表的な一食へ置き換えており、摂取時点の記録を代替できない。',
    ],
    '食事記録は食品・飲料と量の情報を残す方法。測った量か見積もりかも区別して確認する。',
    [
      ref(
        'ex-assess-src-food-record',
        'Description：real-time recording、brand name、preparation method、portion size／Salient Features',
      ),
    ],
  ),
  batch5(
    'ex-assess-hydration',
    3,
    2,
    'weekday-weekend-representativeness',
    '平日は社食、休日は外食が多い人の「普段の食事」を知りたいが、火曜1日だけの記録しかない。解釈として適切なのは？',
    [
      '曜日による違いがあり得るため、休日を含む追加情報を確認して解釈する',
      '記録した1日が、異なる生活日の食事を代表するとは限らない。',
    ],
    [
      '火曜に典型的な社食を選んでいたため、7倍した値を普段の週量として使う',
      '平日の典型例でも、外食が多い休日という別の生活条件を代表するとは限らない。',
    ],
    [
      '社食を食べる平日の記録を追加し、平日だけの平均を普段の全体へ使う',
      '日数が増えても、休日という異なる生活パターンの情報が欠落したままである。',
    ],
    '日数だけでなく生活パターンの違いも考慮する。追加記録を集めても完全な真値を保証するわけではなく、欠落や量の見積もりも確認する。',
    [ref('ex-assess-src-day-effect', '本文：day-of-week effect、平日・週末を含む複数日記録の利点')],
    3,
  ),
  batch5(
    'ex-assess-hydration',
    4,
    2,
    'diet-record-reactivity',
    '本人が「記録を見られるので、その日だけ普段より間食を減らした」と話した。普段の摂取状況を推定する際に考慮することは？',
    [
      '記録される意識が実際の食行動を変えた可能性を考慮する',
      '記録反応性により、記録日の食事が通常と異なることがある。',
    ],
    [
      '記録当日の摂取量を正確に書けていれば、そのまま普段の摂取量の代表とする',
      '記録当日を正確に表すことと、その日が普段の食事を代表することは別である。',
    ],
    [
      '普段との違いがあるので、実際に食べた内容ではなく普段食べるはずの間食へ書き換える',
      '記録日の事実を推測の内容へ書き換えず、日常との違いを別情報として残して解釈する。',
    ],
    '普段の食事を測る目的と、行動変化を支える目的を区別する。記録反応性を本人の故意の虚偽と決めつけない。',
    [
      ref(
        'ex-assess-src-reactivity',
        '本文：behavior change due to awareness、recording bias、behavior modification tool',
      ),
    ],
    3,
  ),
  batch5(
    'ex-assess-hydration',
    5,
    3,
    'sweat-loss-rate-balance',
    '90分の運動で体重70.0→69.0kg、飲水0.6L、尿0.1Lだった。他の質量変化を無視し1kg≒1Lとする簡易式では、概算発汗量と1時間当たりの発汗速度は？',
    ['発汗量1.5L、発汗速度1.0L/h', '70−69＋0.6−0.1＝1.5L。90分＝1.5hなので1.5÷1.5＝1.0L/h。'],
    ['発汗量1.0L、発汗速度約0.67L/h', '体重差だけを用い、途中の飲水と尿を式へ反映していない。'],
    ['発汗量1.7L、発汗速度約1.13L/h', '尿量を加えており、汗として失った量を過大に計算している。'],
    '概算発汗量＝運動前後の体重差＋飲水−尿量。時間をhにそろえて割る。この一例から、その量を全員の飲水指示や医療上の診断へ置き換えない。',
    [
      ref(
        'ex-assess-src-fluid-equation',
        'Literature Review—Fluid Replacement, Table 2 Sweat-Rate Equationと単位の脚注',
      ),
    ],
    3,
  ),
);

// These exact items were reread by a different AI after the author review.
// This records that completed content work; it is not a validation-time promotion.
const independentlyRevisedIds = new Set([
  'ex-assess-quality-01',
  'ex-assess-quality-02',
  'ex-assess-quality-03',
  'ex-assess-quality-04',
  'ex-assess-quality-05',
  'ex-assess-quality-06',
  'ex-assess-quality-07',
  'ex-assess-quality-08',
  'ex-assess-adult-tests-01',
  'ex-assess-bodycomp-02',
  'ex-assess-bodycomp-04',
  'ex-assess-bodycomp-05',
  'ex-assess-bodycomp-06',
  'ex-assess-behavior-01',
  'ex-assess-behavior-02',
  'ex-assess-behavior-03',
  'ex-assess-behavior-04',
  'ex-assess-behavior-05',
  'ex-assess-behavior-06',
  'ex-assess-health-01',
  'ex-assess-health-02',
  'ex-assess-health-03',
  'ex-assess-health-04',
  'ex-assess-health-05',
  'ex-assess-food-label-04',
  'ex-assess-food-label-05',
  'ex-assess-food-label-06',
  'ex-assess-food-label-07',
  'ex-assess-hydration-01',
  'ex-assess-hydration-02',
  'ex-assess-hydration-03',
  'ex-assess-hydration-04',
]);
for (const question of assessmentExpansionQuestions) {
  if (!independentlyRevisedIds.has(question.id)) continue;
  question.revision = 2;
  question.review = {
    status: 'source_checked',
    reviewerType: 'ai',
    method:
      '著者とは別のAIがsourceRefsの原典該当節を実読し、設問条件・正答・改稿した誤答2つの理由・対応する本文を個別に再照合。具体的な手順・比較方法・記録範囲の取り違えへ誤答を改稿。全文や公式設問は転載せず、構造検査を内容審査の代わりにはしていない。',
    checkedAt: '2026-11-04T12:39:06Z',
    revision: 2,
    notes:
      '独立AIレビューの対象・参照版・所見はdocs/ASSESSMENT_AI_REVIEW.md。著者のrevision1照合と区別する。人間の専門家レビューは0件で、expert_reviewedではない。',
  };
}
