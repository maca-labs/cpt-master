import { editionPractice, type EditionItem } from './shared';
import { planningSource } from './planning-sources';

export const velocity = planningSource(
  'velocity',
  'NSCA Coach: Practical Application of Velocity-Based Training in College Football',
  'https://www.nsca.com/education/articles/nsca-coach/practical-application-of-velocity-based-training-in-college-football/',
  '公開実践記事',
  'Using Barbell Velocity, Velocity Loss Thresholds, Individualizing Training Intensities',
);
export const agility = planningSource(
  'agility',
  'NSCA: Transfer of Training for Agility',
  'https://www.nsca.com/education/articles/kinetic-select/transfer-of-training-for-agility/',
  'NSCA Guide to Program Design・公開抜粋 2018',
  'Traditional resistance, jump training, straight sprint and change-of-direction',
);
export const preparation = planningSource(
  'preparation',
  'NSCA: Preparatory Period',
  'https://www.nsca.com/education/articles/kinetic-select/preparatory-period/',
  'NSCA Essentials of Strength Training and Conditioning・公開抜粋',
  'Preparatory Period and its phases',
);
export const monitoringSources = [velocity, agility, preparation];

const monitor: EditionItem[] = [
  [
    3,
    'セットの平均速度を目標帯と比較して次の負荷を下げる',
    '動作が安定した選手の挙上で、セット平均の目標帯は0.55〜0.65 m/s。二つのセットで平均0.48、0.50 m/sだった。次のセットをどう調整するか。',
    [
      '設定重量を下げ、次のセット平均を再確認する',
      '平均が目標帯より低いので、負荷を下げる候補になる。',
    ],
    [
      '速度が低いのでさらに重くする',
      '重量を増やすと目標帯を上回る方向に調整できるとは考えにくい。',
    ],
    ['最大速度の一回が帯に入れば同じ負荷にする', 'この条件で比較する指標はセット平均である。'],
    '運用前に決めた速度指標で次の負荷を調整する。',
    '1. Estimating Training Intensity：Tables 1–2。',
  ],
  [
    3,
    '速度低下率を最速反復と比較する',
    'セット中の最速が0.80 m/s、直近が0.60 m/sだった。最速反復を基準にした速度低下率はどれか。',
    ['25%', '差0.20を最速の0.80で割る。'],
    ['20%', '0.20 m/sという絶対差をそのまま百分率にしている。'],
    ['33%', '分母に直近の0.60 m/sを使っている。'],
    '最速からの低下率は、絶対差を最速で割る。',
    '2. Using Velocity to Identify When to Terminate a Set：percentage velocity loss。',
    3,
  ],
  [
    3,
    '絶対速度の打切りルールを割合へ読み替えない',
    'ある種目で「0.45 m/s以下で終了」と決め、直近の反復が0.45 m/sだった。実施者に伝えるのはどれか。',
    ['ラックに戻し、セットを終える', '等号を含む設定なので打切り条件を満たす。'],
    ['次が0.45 m/sを下回るまで続ける', '条件の「以下」を「未満」に変えている。'],
    ['セット内の低下が45%になるまで続ける', 'm/sの絶対基準と百分率を混同している。'],
    '打切りには絶対速度を使う方式もあり、事前ルールに従う。',
    '2. Using Velocity to Identify When to Terminate a Set：absolute threshold。',
  ],
  [
    3,
    'フォームをそろえた反復同士だけで速度を比べる',
    '先週より挙上速度が高いが、今週の映像では可動範囲を明らかに狭くしていた。速度をどう使うか。',
    ['可動範囲と測定方法をそろえ直して比較する', '速度差の解釈には実施条件の一貫性が必要。'],
    ['速度が上がったので筋力向上として負荷を増やす', '種目条件が変わり、同じ能力を比較できない。'],
    ['違う種目の速度を追加して平均する', '比較条件の不一致を解決しない。'],
    '速度は実行条件を保ったときに進捗の判断材料になる。',
    'Introduction／1. Estimating Training Intensity：種目別の速度と負荷。',
  ],
  [
    3,
    '速度の即時フィードバックを最適化に使う',
    '選手が各反復でどの程度速く挙げたか気づけず、コーチは速度を計測できる。即時フィードバックの設計はどれか。',
    ['反復直後に測定値か簡潔な合図を伝え、次の反復で調整する', '測定結果を次の反復で使える。'],
    ['全練習終了後にグループ平均だけを知らせる', '本人がセット中に調整するための情報にならない。'],
    [
      '反復が遅いときだけ追加の反復で埋め合わせる',
      '速度の低下に対し疲労を増やしかねず、情報提供とも異なる。',
    ],
    '即時の情報提供と、後から傾向を振り返る記録は用途が異なる。',
    'Visual Feedback；2.の合図の例。',
  ],
  [
    3,
    '計測値がない反復を打切り判定の材料にしない',
    '速度センサーの表示が突然止まった。打切り条件は速度だけで決めていた。どの運用が適切か。',
    [
      'セットを安全に終え、計測を確認して再開を決める',
      '測定がなければ速度基準で続行できると判定できない。',
    ],
    ['最後の正常値を残りの反復にも使う', '疲労などで速度が変わる可能性がある。'],
    [
      '本人が以前できた回数まで続ければ速度基準も満たすとみなす',
      '回数から当日の速度を決められない。',
    ],
    '測定不能は、指標による安全な進行を見直す条件である。',
    '2. Using Velocity to Identify When to Terminate a Set：個々の反復の判定。',
  ],
  [
    3,
    '同じ競技でも役割の力速度要求を計画へ反映する',
    '同じ競技チームで、近距離での接触に備える役割と、速く空間を移動する役割がある。全員同じ挙上速度の一案をどう見直すか。',
    [
      '役割と個々の不足を調べ、重視する力と速度の帯を調整する',
      '同じ競技でも役割による要求が異なる。',
    ],
    ['チーム平均の速度帯だけで全員を進める', '各役割で必要とする能力の違いを落とす。'],
    [
      '接触役と移動役を分けるが、両者の個別評価は不要とする',
      '役割内の選手ごとの差も計画の材料である。',
    ],
    '役割と本人の状況の両方から目標速度を考える。',
    '3. Individualizing Training Intensities：positional demands and individual needs。',
  ],
  [
    3,
    '種目を替えると対応する速度帯を見直す',
    'ベンチプレスの速度帯を用いてきた選手が、別日にスクワットを同じ%1RMで行う。同じ速度帯をそのまま使えるか。',
    [
      '種目ごとの負荷・速度関係を確認して帯を設定する',
      '同じ%1RMでも種目間で同じ速度とは限らない。',
    ],
    ['相対重量が同じなので速度帯も必ず同じになる', '速度は種目と実施条件にも依存する。'],
    ['両種目の全反復速度を混ぜた中央値を共通の目標にする', '種目別の違いを混ぜてしまう。'],
    '相対重量と速度を対応づける際は種目を明示する。',
    'Table 1：squat and bench press velocities。',
  ],
];

const transfer: EditionItem[] = [
  [
    1,
    '直線加速の改善と方向転換の改善を別に測る',
    '直線20 mのタイムは短縮したが、方向を切り替える競技での動きを評価したい。次に取る記録はどれか。',
    ['切り返しを含む課題も別に測る', '直線走の改善だけで方向転換能力の改善は確かめられない。'],
    ['直線20 mを再測定し、改善分を方向転換の値にも転記する', '別の動作要求を測っていない。'],
    [
      '直線の開始反応だけを追加し、切り返しの課題は省く',
      '走行開始と方向を変える制動・加速は異なる。',
    ],
    '評価は伸ばしたい課題と対応させる。',
    'Transfer of Training for Agility：straight sprinting。',
  ],
  [
    1,
    '横向き跳躍と直線跳躍の転用を同じと仮定しない',
    'トレーナーが側方への移動を要する競技の補助練習を選ぶ。参加者は着地と基礎動作を習得済みである。何を比べるか。',
    [
      '横方向の跳躍なども試し、対象の方向転換を別に評価する',
      '方向に着目した跳躍は候補だが、転用は課題の評価で確かめる。',
    ],
    [
      '垂直跳びの高さだけで、横移動に最も有効な練習を決める',
      '垂直の結果だけでは横方向への転用を特定できない。',
    ],
    ['横移動の改善は直線ダッシュの記録だけで決める', '方向が変わる課題を測っていない。'],
    '運動方向と評価課題を区別し、改善の転用を確かめる。',
    'Transfer of Training for Agility：horizontal and lateral jumps。',
  ],
  [
    1,
    '実験条件ごとの方向転換の変化を分けて読む',
    '同じ方向転換テストを使った比較で、甲の計画はジャンプスクワット、乙は直線走だけだった。甲はテストが改善し、乙は変わらなかった。計画を決める際に妥当な説明はどれか。',
    [
      'この比較では変化が異なる。自分の対象にも方向転換の評価を置き、方法を選ぶ',
      '選んだ対象で練習の転用を確認できる。',
    ],
    [
      '直線走はあらゆる参加者の方向転換を悪化させるとする',
      '変化なしは悪化と異なり、一般化もできない。',
    ],
    [
      'ジャンプスクワットの負荷と方法は、対象が異なっても同じにすれば必ず改善するとする',
      '参加者の違いや計画の内容を越えて結論づけている。',
    ],
    '競技に必要な能力への転用は、比較した方法と測定課題の範囲で読む。',
    'Transfer of Training for Agility：jump training、straight sprinting、change-of-direction outcomes。',
  ],
  [
    1,
    '一般筋力を持つ人の課題へ減速と切り返しを足す',
    '下肢の筋力は向上したが、横に切り返すと減速しきれない競技者がいる。基礎筋力を維持する前提で優先する追加案はどれか。',
    [
      '低い速度から計画的な減速と切り返しを練習する',
      '一般筋力で不足する動作を安全な難度から扱う。',
    ],
    [
      'スクワットの重量だけを上げ、切り返しは競技中に任せる',
      '不足している動作の計画的な練習がない。',
    ],
    ['直線の加速だけを全量に置き換える', '減速と横への切り返しを直接扱わない。'],
    '一般筋力と競技に近い動作は別の練習で補い合える。',
    'Transfer of Training for Agility：traditional resistance exercises and specific drills。',
  ],
];

const weeks: EditionItem[] = [
  [
    1,
    '競技予定のない準備初期に反復可能な基礎を置く',
    '競技まで数か月あり、数週間の休止から戻る選手に、直近の公式戦はない。最初の計画案はどれか。',
    [
      '技術と一般的な運動能力を戻す量・強度から始める',
      '準備期の前半では後の高強度練習の基盤を整える。',
    ],
    [
      '試合直前と同様に総量を最小にし、高強度の種目だけにする',
      '現段階で必要な練習量や基礎づくりを省く。',
    ],
    ['主要大会を毎週模した高負荷を続ける', '準備初期の目的と回復の条件に合わない。'],
    '予定までの時間を使い、後の課題に必要な土台をつくる。',
    'Preparatory Period：General Preparatory Phase。',
  ],
  [
    1,
    '一般準備を進めた後に種目要求との距離を縮める',
    '筋力・持久力の基盤が整い、競技準備期の後半に入る。練習計画の変更はどれか。',
    [
      '競技で必要な動作・能力への比重を上げる',
      '準備後半では一般基盤から競技により近い要求へ移行する。',
    ],
    ['競技固有の課題を全て初戦後へ延期する', '準備中に必要な移行を失う。'],
    ['初期の一般的な課題を同じ内容と比重で固定する', '段階に応じた特異性の調整がない。'],
    '準備期の中でも、前半と後半で狙いが変わる。',
    'Preparatory Period：Specific Preparatory Phase。',
  ],
  [
    1,
    '高負荷の連続に回復期間を置く意図を説明する',
    '準備期に負荷を上げる週が続いた後、計画上は量を抑える週が入る。利用者は練習を無駄にしたと考えた。説明はどれか。',
    [
      '回復と次の適応に備えるため、量を一時的に抑える週を設ける',
      '準備期の練習を持続するため、負荷の上昇だけを続けない。',
    ],
    ['前週の記録を消す週として置く', '記録を消しても回復の目的は達成しない。'],
    [
      '計画を中止する合図なので、その後は新規計画が必要になる',
      '負荷の変化を織り込むことは計画の中断と異なる。',
    ],
    '回復週を前後の負荷と合わせて見る。',
    'Preparatory Period：variation in training stress and recovery。',
  ],
  [
    1,
    '練習量と強度の同時最大化を計画条件にしない',
    '準備期の後半で競技向けの強い刺激を増やす。利用者は初期の多い総練習量もそのまま続けたいと希望する。判断はどれか。',
    ['強度を上げるときは量と回復の関係も調整する', '準備が進むにつれて量と強度の配分を調整する。'],
    ['各週に量と強度の両方の過去最高を求める', '回復を考えず両変数を同時に最大化している。'],
    ['強度を上げる週も負荷の大きさは記録せず量だけを見る', '変更した変数が管理できない。'],
    '段階ごとに刺激と回復が成立する量・強度を選ぶ。',
    'Preparatory Period：training volume and intensity across phases。',
  ],
];

export const planningMonitoringQuestions = [
  ...editionPractice('planning', 81, 'ex-plan-load', velocity, monitor),
  ...editionPractice('planning', 89, 'ex-plan-power', agility, transfer),
  ...editionPractice('planning', 93, 'ex-plan-progression', preparation, weeks),
];
