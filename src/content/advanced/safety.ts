import type { Source } from '../../domain/types';
import { advancedItem } from './shared';

export const advancedSafetySources: Source[] = [
  {
    id: 'adv-src-jspo-wbgt',
    title: '日本スポーツ協会「熱中症予防のための運動指針」',
    url: 'https://www.japan-sports.or.jp/medicine/heatstroke/tabid922.html',
    edition: null,
    checkedAt: '2026-11-09',
    locator: '熱中症予防運動指針、温度環境の評価「WBGTの測定」',
  },
  {
    id: 'adv-src-nata-eap',
    title: 'NATA Position Statement: Emergency Action Plan Development and Implementation in Sport',
    url: 'https://www.natafoundation.org/wp-content/uploads/EAP_2024.pdf',
    edition: '2024, Journal of Athletic Training 59(6):570–583',
    checkedAt: '2026-11-09',
    locator: 'Response recommendations 19–22、pp.576–577',
  },
  {
    id: 'adv-src-aha-first-aid',
    title: '2024 American Heart Association and American Red Cross Guidelines for First Aid',
    url: 'https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines',
    edition: '2024',
    checkedAt: '2026-11-09',
    locator: '6.8 Presyncope、6.6 Seizures、9.1 External Bleeding Control',
    note: '発行団体の市民向け指針。設問では行動を選ぶ根拠として使い、通報先は日本の119番とする。',
  },
  {
    id: 'adv-src-ppc-joint',
    title: '個人情報保護委員会「個人情報の保護に関する法律についてのガイドライン（通則編）」',
    url: 'https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/',
    edition: null,
    checkedAt: '2026-11-09',
    locator: '3-6-3 第三者に該当しない場合、法第27条第5項第3号・第6項',
  },
  {
    id: 'adv-src-caa-no1',
    title: '消費者庁「No.1表示に関する実態調査報告書」',
    url: 'https://www.caa.go.jp/policies/policy/representation/fair_labeling/survey/assets/representation_cms216_240926_02.pdf',
    edition: '2024年9月',
    checkedAt: '2026-11-09',
    locator: '第三者の主観的評価を指標とするNo.1表示における合理的根拠の4条件',
  },
];

const firstAid = 'ed3-safe-first-aid';
const eap = 'ex-safe-eap';
const privacy = 'ex-safe-privacy';

export const advancedSafetyQuestions = [
  advancedItem('safety', 1, {
    unitId: 'ex-safe-conditions',
    objectiveIds: ['ex-safe-conditions-o1'],
    level: 'analysis',
    prompt:
      '成人向けサーキットの会場を選ぶ。施設はWBGT 25以上なら高強度区間を低強度に置き換える。候補Aは日射ありで湿球22℃、黒球29℃、乾球30℃。候補Bは日射のない室内で湿球26℃、黒球36℃。各会場の区分はどれか。',
    correct: [
      'Aは約24.2で区分未満、Bは29.0で高強度区間を置き換える',
      'Aは0.7×22＋0.2×29＋0.1×30＝24.2。Bは0.7×26＋0.3×36＝29.0。',
    ],
    distractors: [
      [
        'Aは約24.2で区分未満、Bも約18.2で区分未満',
        '日射のない室内でも湿球の項だけでは計算が完結せず、黒球温度の0.3倍を加える。',
      ],
      [
        'Aは約27.7で高強度区間を置き換え、Bは29.0で同様に置き換える',
        'Aの27.7は湿球温度と黒球温度の係数を取り違えた値。湿球に0.7、黒球に0.2を掛ける。',
      ],
    ],
    explanation:
      '日射の有無で使う式を選び、それぞれ計算した後で施設の運用基準を当てる。基準未満でも参加者の体調や環境の変化は別に観察する。',
    sourceRefs: [
      {
        sourceId: 'adv-src-jspo-wbgt',
        locator: 'WBGTの測定：日射のある屋外の3項式、日射のない室内の2項式',
      },
    ],
  }),
  advancedItem('safety', 2, {
    unitId: eap,
    objectiveIds: ['ex-safe-eap-o1'],
    level: 'analysis',
    prompt:
      '隣接する二会場で同時に大会を開く。救命訓練では共有AEDを会場Aへ2分10秒、会場Bへ2分40秒で搬送できた。ただし各測定は別々で、当日はAED1台と別室の予備機がある。双方で機器を3分以内に使えるか、開催前に最もよく確かめられるのはどれか。',
    correct: [
      '当日の配置で機器と担当を割り当て、同時に倒れた想定で装着・解析・必要な模擬ショックまで計る',
      '単独測定では共有機器の競合が出ない。搬送だけでなく、両会場で装置を使うまでを確かめる。',
    ],
    distractors: [
      [
        '予備機を待機させ、共有AEDの各会場への単独最短時間をもう一度測る',
        '機器が二台あることと、要請が重なったときに各会場で取り出して使えることは別である。',
      ],
      [
        '両会場の単独搬送時間を平均し、予備機の場所はスタッフ会議で確認する',
        '平均が3分以内でも片方の搬送が遅れる可能性は残り、同時発生時の条件が検証できない。',
      ],
    ],
    explanation:
      '会場ごとの利用可能性を、担当者と機器の競合を含めて検証する。3分はこの設問で採用したNATAの競技会場における指針で、搬送時間だけで達成を判断しない。',
    sourceRefs: [
      {
        sourceId: 'adv-src-nata-eap',
        locator: 'Response 19–22、pp.576–577：事前確認と、倒れてからAEDで処置するまでの時間',
      },
    ],
  }),
  advancedItem('safety', 3, {
    unitId: firstAid,
    objectiveIds: ['ed3-safe-first-aid-o2'],
    level: 'analysis',
    prompt:
      '立ち上がった直後に気が遠くなることがあると話す成人を、今回も安全に座らせた。視界の暗さを訴えた直後、新たに胸の圧迫感が出た。以前は教わった筋緊張法で症状が軽くなったという。今回の優先対応はどれか。',
    correct: [
      '安全な姿勢を保ち、筋緊張法を試さずに119番して症状の経過を伝える',
      '胸部症状を伴う場合は過去の立ちくらみと同じ対応にせず、救急要請を優先する。',
    ],
    distractors: [
      [
        '座位のまま下肢の筋緊張法を行い、1〜2分で改善しなければ119番する',
        '改善まで待つ条件は心筋梗塞などを示唆する症状を伴わない前失神の扱いであり、今回は胸部症状が加わった。',
      ],
      [
        '下肢より負荷の小さい手の握り込みに変え、胸の圧迫感が続くか観察する',
        '筋緊張の部位を変えても、胸部症状を伴う場合にその方法を試して待つ根拠にはならない。',
      ],
    ],
    explanation:
      '安全な姿勢を確保した後の判断は、その場の症状で更新する。前回うまくいった対処より、今回新たに出た胸部症状を重く見る。',
    sourceRefs: [
      {
        sourceId: 'adv-src-aha-first-aid',
        locator: '6.8 Presyncope 推奨1・4・5、6.4 Chest Pain in Adults 推奨1',
      },
    ],
  }),
  advancedItem('safety', 4, {
    unitId: firstAid,
    objectiveIds: ['ed3-safe-first-aid-o1'],
    level: 'analysis',
    prompt:
      '水中歩行教室で、発作の既往がある成人が水中でけいれんした。監視員が安全にプールサイドへ引き上げ、けいれんは約40秒で止まった。普段どおりの呼吸があり、呼びかけに応じ始めた。監視員と行う対応はどれか。',
    correct: [
      '水中で起きたことを伝えて119番し、救急隊に引き継ぐまで呼吸と反応を観察する',
      '水中での発作自体が救急要請の条件であり、短時間で止まって呼吸が正常でも要請する。',
    ],
    distractors: [
      [
        '呼吸と反応を観察し、発作が再発して合計5分を超えた場合に119番する',
        '水中で起きた条件は発作時間とは独立しており、再発や時間の延長を待たない。',
      ],
      [
        '本人の普段の発作と同じ経過かを家族に確認し、違っていれば119番する',
        '発作の既往や見かけの回復で、水中で起きたという救急要請の条件は取り消されない。',
      ],
    ],
    explanation:
      '時間、呼吸の状態、起きた場所は別の判断材料。水中で起きた発作では、呼吸が正常なら観察を続けながら、場所の条件を救急に伝える。',
    sourceRefs: [
      {
        sourceId: 'adv-src-aha-first-aid',
        locator: 'Top 10 Take-Home Messages 9、First Aid for Seizures：水中発作の救急要請',
      },
    ],
  }),
  advancedItem('safety', 5, {
    unitId: firstAid,
    objectiveIds: ['ed3-safe-first-aid-o3'],
    level: 'analysis',
    prompt:
      '器具の金具で前腕を切り、救急を要請した。訓練を受けたスタッフがガーゼで直接圧迫し、出血は制御できている。別スタッフが処置を引き継ぐ際、止血を維持するための方法として適切なのはどれか。',
    correct: [
      '制御できている状態を保ったまま圧迫包帯で固定し、再出血がないか観察する',
      '圧迫包帯は直接圧迫で得た止血を維持するために使う選択肢になる。',
    ],
    distractors: [
      [
        '圧迫部位を一度解放して創の深さを確かめ、その後に圧迫包帯で固定する',
        '確認のために先に圧を解除すると維持できていた止血を崩す可能性がある。',
      ],
      [
        '圧迫を外して市販止血帯に切り替え、手で押さえなくても済むようにする',
        '止血帯の推奨は直接圧迫で制御できない生命を脅かす四肢出血を対象とする。',
      ],
    ],
    explanation:
      '初期の止血と止血の維持では目的が異なる。出血が抑えられているケースでは、交代を理由に不要な圧迫解除や処置の強化を行わない。',
    sourceRefs: [
      {
        sourceId: 'adv-src-aha-first-aid',
        locator:
          '9.1 External Bleeding Control：直接圧迫、止血後の圧迫包帯、制御不能な四肢出血の止血帯',
      },
    ],
  }),
  advancedItem('safety', 6, {
    unitId: privacy,
    objectiveIds: ['ex-safe-privacy-o2'],
    level: 'analysis',
    prompt:
      '二つの事業者が予約情報を共同利用し、法に沿ってデータ項目・参加事業者などを公表している。既存の一社は商号だけを変えた。同時に、事業承継に当たらない新会社を加え、測定データも共有したい。本人の同意はまだなく、別の例外はない。扱いはどれか。',
    correct: [
      '商号の変更と共有範囲の拡大を分け、拡大分は本人の事前同意を得てから進める',
      '同じ事業者の名称変更と、データ項目および共同利用者の追加では条件が異なる。',
    ],
    distractors: [
      [
        '利用目的が予約管理のままなら、新会社と測定データを事前に公表すれば拡大できる',
        '目的の範囲を変えないことだけでは、項目や共同利用者を拡大する条件を満たさない。',
      ],
      [
        '新会社の追加のみ本人の事前同意を得て、データ項目の追加は事前公表で扱う',
        'データ項目の変更も、共同利用者の範囲の変更と同様に制限される。',
      ],
    ],
    explanation:
      '事業者の名称だけの変更と、本人から見たデータの受け手・内容の変更を区別する。このケースでは後者を公表の更新だけで進めず、事前同意を確かめる。',
    sourceRefs: [
      {
        sourceId: 'adv-src-ppc-joint',
        locator: '3-6-3 共同利用：共同利用データ項目・利用者範囲の変更と事例1・2',
      },
    ],
  }),
  advancedItem('safety', 7, {
    unitId: 'professional',
    objectiveIds: ['professional-o3'],
    level: 'analysis',
    prompt:
      '認定トレーナーのスタジオが「地域で顧客満足度1位」と広告したい。調査は地域の主要施設を同じ質問で比較したが、回答者は各施設のWeb広告を見た一般モニターで、利用経験を確認していない。根拠の評価はどれか。',
    correct: [
      '比較施設と質問が適切でも、利用者の満足度を裏づけるには回答者の選定を見直す',
      '広告が示す実際の利用者による評価に、広告閲覧者の印象をそのまま当てられない。',
    ],
    distractors: [
      [
        '主要施設を同じ質問で比べているため、回答数が十分なら顧客満足度として表示できる',
        'サンプル数や質問の統一では、対象者が顧客であるかというずれは解消しない。',
      ],
      [
        '回答者が広告を閲覧したことを小さく注記すれば、主表示を顧客満足度のままにできる',
        '表示の中心で示す指標と実際の調査対象・結果が対応している必要がある。',
      ],
    ],
    explanation:
      '比較する施設の範囲、調査手続、回答者の条件、表示と結果の対応をそれぞれ点検する。広告の印象を尋ねた結果は実際の利用者の満足度を測ったものではない。',
    sourceRefs: [
      {
        sourceId: 'adv-src-caa-no1',
        locator: '主観的評価によるNo.1表示の合理的根拠の要件②・④、顧客満足度と利用経験の例',
      },
    ],
  }),
];
