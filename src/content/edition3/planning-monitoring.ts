import { editionPractice, type EditionItem } from './shared';
import { planningSource } from './planning-sources';

export const velocity = planningSource(
  'velocity',
  'NSCA Coach: Practical Application of Velocity-Based Training in College Football',
  'https://www.nsca.com/education/articles/nsca-coach/practical-application-of-velocity-based-training-in-college-football/',
  '公開実践記事',
  'Using Barbell Velocity, Velocity Loss Thresholds, Individualizing Training Intensities',
);
const benchVelocity = {
  ...planningSource(
    'bench-rom-velocity',
    'Martínez-Cava et al. Range of Motion and Sticking Region Effects on the Bench Press Load-Velocity Relationship',
    'https://jssm.org/volume18/iss4/cap/jssm-18-645.pdf',
    'J Sports Sci Med 18(4):645–652、2019',
    'Methods：可動範囲とMV/MPVの測定。Discussion：可動範囲別の負荷と速度の関係。',
  ),
  checkedAt: '2026-11-10',
};
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
export const monitoringSources = [velocity, benchVelocity, agility, preparation];

const monitor: EditionItem[] = [
  [
    3,
    'セットの平均速度を目標帯と比較して次の負荷を下げる',
    'ある選手の挙上で、4反復の平均速度の目標帯を0.55〜0.65 m/sとした。休息は予定どおりで、動作範囲、計測方法、速く挙げる指示は同じだった。同じ重量の2セットは平均0.48、0.50 m/s。次も4反復とすると、目標帯に近づける調整はどれか。',
    [
      '設定重量を下げ、次のセット平均を再確認する',
      '条件をそろえた2セットの平均がともに下限を下回った。重量を下げ、次も同じ方法で効果を確かめる。',
    ],
    [
      '2セット目の平均が上がったので、目標帯に達したとみなして重量を維持する',
      '0.02 m/s上がっても0.50 m/sであり、下限の0.55 m/sには達していない。',
    ],
    ['最大速度の一回が帯に入れば同じ負荷にする', 'この条件で比較する指標はセット平均である。'],
    '同じ反復数、休息、動作条件でセット全体の平均を比べる。目標帯を下回ったときは重量を下げて再測定する。この目標帯は設問の条件である。',
    '1. Estimating Training Intensity：セット平均が目標帯を下回る場合の重量調整例。',
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
    '可動範囲と速度指標の両方をそろえて進捗を比べる',
    '同じ選手のベンチプレス60 kgを比較する。先週は通常の可動範囲で上昇全体の平均速度0.55 m/s、今週はボードで下降を浅くし、上昇の推進局面の平均速度0.65 m/sだった。通常の可動範囲での進捗を評価するにはどうするか。',
    [
      '今週も通常の可動範囲で測り直し、先週と同じ上昇全体の平均速度を比べる',
      '負荷に加え、可動範囲と速度の集計範囲をそろえて比較できる。',
    ],
    [
      '両週とも上昇全体の平均速度で再集計し、今週の浅い反復はそのまま比較に使う',
      '速度の集計範囲はそろうが、可動範囲による負荷と速度の関係の違いが残る。',
    ],
    [
      '今週も通常の可動範囲で測るが、今週は推進局面の平均速度を使って先週と比較する',
      '可動範囲はそろうが、上昇全体と推進局面のみの平均は同じ速度指標ではない。',
    ],
    '可動範囲の違いは負荷と速度の関係に影響し、測定の局面が異なれば平均値の意味も変わる。進捗を評価するには両方をそろえる。',
    'Methodsの測定方法、Discussionの可動範囲別の負荷・速度関係。',
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
    '方向転換の変化の観察と、練習法の効果の判定を区別する',
    '練習記録で、甲はジャンプスクワット、乙は直線走を主に追加した。同じ方向転換テストで前後を比べると、甲のタイムは短縮し、乙はほぼ変わらなかった。ほかの練習内容や開始時の能力はそろっていない。次の計画に使う解釈はどれか。',
    [
      '記録された変化は別々に扱い、練習法の優劣は保留する。次の計画でも方向転換を直接測る',
      '開始時の能力や併用した練習の影響を分離できない。目標の変化は方向転換テストで確認できる。',
    ],
    [
      '測定手順が共通なので、甲のタイム短縮をジャンプスクワット単独の効果と判断する',
      '測定手順をそろえても、開始時の能力やほかの練習の違いは残る。',
    ],
    [
      '乙のタイムがほぼ同じだったので、直線走は方向転換の補助として効果がないと判断する',
      '一人の記録から、直線走が他の条件でも役立たないと結論づけることはできない。',
    ],
    'この設問の記録は仮想例である。NSCAの資料は跳躍練習と直線走の別々の研究を紹介し、直線走から方向転換への転用について研究結果が一貫しないと述べている。',
    'Transfer of Training for Agility：jump training、straight-sprint training、change-of-direction drillsの各段落。',
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
  ...editionPractice('planning', 81, 'ex-plan-load', velocity, monitor.slice(0, 3)),
  ...editionPractice('planning', 84, 'ex-plan-load', benchVelocity, monitor.slice(3, 4)),
  ...editionPractice('planning', 85, 'ex-plan-load', velocity, monitor.slice(4)),
  ...editionPractice('planning', 89, 'ex-plan-power', agility, transfer),
  ...editionPractice('planning', 93, 'ex-plan-progression', preparation, weeks),
];
