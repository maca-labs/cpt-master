import type { Source } from '../../domain/types';
import { advancedItem } from './shared';

function source(
  id: string,
  title: string,
  url: string,
  edition: string | null,
  locator: string,
): Source {
  return { id: 'adv-tech-' + id, title, url, edition, checkedAt: '2026-11-09', locator };
}

const sources = {
  squat: source(
    'squat-model',
    'Graberほか：スクワットの体幹・下腿と股関節対膝モーメント比',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC10518215/',
    '2023年原著',
    'Results, Table 3・Discussion',
  ),
  step: source(
    'step-direction',
    'Wangほか：高齢者の前方・側方ステップアップの下肢力学',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC3460801/',
    '2003年原著',
    'Abstract, Methods・Results・Conclusions',
  ),
  row: source(
    'row-sequence',
    'Concept2: Improve Your Rowing Technique',
    'https://www.concept2.com/training/improve-your-rowing-technique',
    null,
    'Lifting with the Back・Bending Arms Too Early・Shooting the Slide',
  ),
  nordic: source(
    'nordic-slope',
    'Šarabonほか：ノルディック・ハムストリングの下腿台傾斜と動作',
    'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0223437',
    '2019年原著',
    'Nordic hamstring exercise variations・Fig 1・Discussion・Fig 5',
  ),
  turn: source(
    'braking-contacts',
    'Dos’Santosほか：180度方向転換の接地ごとのブレーキ',
    'https://pubmed.ncbi.nlm.nih.gov/33377421/',
    '2021年原著',
    'Abstract, methods・results・practical implication',
  ),
  retention: source(
    'landing-retention',
    'Wellingほか：着地技術の練習と保持テスト',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC5675367/',
    '2017年原著',
    'Methods, posttest／retention test・Discussion',
  ),
  treadmill: source(
    'handrail-support',
    'Berlingほか：トレッドミル定常歩行での手すり支持',
    'https://pubmed.ncbi.nlm.nih.gov/17135860/',
    '2006年原著',
    'Abstract, Methods・Results・Conclusion',
  ),
  hex: source(
    'hex-bar',
    'Swintonほか：ストレートバーとヘックスバーのデッドリフト',
    'https://rgu-repository.worktribe.com/file/248377/1/SWINTON%202011%20A%20biomechanical%20analysis',
    '2011年原著',
    'Methods, Submaximal Testing・Discussion, Table 2の関節モーメント',
  ),
  pull: source(
    'pullup-grip',
    'Prinold・Bull：懸垂の握りと肩甲帯の運動学',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC4916995/',
    '2016年原著',
    'Abstract, Methods・Results／Discussion, hand position and scapular motion',
  ),
  push: source(
    'pushup-support',
    'Suprakほか：腕立て伏せの支持力と可動域内の位置',
    'https://pubmed.ncbi.nlm.nih.gov/20179649/',
    '2011年原著',
    'Abstract, four static positions・vertical GRF and range of motion',
  ),
  work: source(
    'signed-work',
    'OpenStax: University Physics Volume 1, 7.1 Work',
    'https://openstax.org/books/university-physics-volume-1/pages/7-1-work',
    '2016年',
    'Eq. 7.1・Work Done by a Force',
  ),
  rotationalWork: source(
    'rotational-work',
    'OpenStax: University Physics Volume 1, 10.8 Work and Power for Rotational Motion',
    'https://openstax.org/books/university-physics-volume-1/pages/10-8-work-and-power-for-rotational-motion',
    '2016年',
    'Work-Energy Theorem for Rotation, Eq. 10.30・Example 10.17',
  ),
  power: source(
    'mean-power',
    'OpenStax: University Physics Volume 1, 7.4 Power',
    'https://openstax.org/books/university-physics-volume-1/pages/7-4-power',
    '2016年',
    'Eq. 7.10, average power',
  ),
  torque: source(
    'torque-angle',
    'OpenStax: University Physics Volume 1, 10.6 Torque',
    'https://openstax.org/books/university-physics-volume-1/pages/10-6-torque',
    '2016年',
    'Torque, cross product・perpendicular component',
  ),
  clean: source(
    'clean-receive',
    'NSCA: Power Clean From Hang',
    'https://www.nsca.com/education/articles/kinetic-select/power-clean-from-hang/',
    '2022年公開抜粋',
    '手順7–11・Figure 7.12b–d',
  ),
  video: source(
    'video-sampling',
    'NSCA: Biomechanical Analysis in Practice',
    'https://www.nsca.com/education/articles/kinetic-select/biomechanical-analysis-in-practice/',
    '2017年公開抜粋',
    '映像分析の手順5・7（運動面・フレーム間の時間）',
  ),
  split: source(
    'rear-leg-moment',
    'Arakawaほか：ブルガリアンスクワットの後脚由来股関節モーメント',
    'https://pubmed.ncbi.nlm.nih.gov/40909869/',
    '2025年原著',
    'Abstract・Figure 1の二つの外部モーメント',
  ),
};

export const advancedTechniqueSources: Source[] = Object.values(sources);

function ref(item: Source) {
  return { sourceId: item.id, locator: item.locator };
}

export const advancedTechniqueQuestions = [
  advancedItem('technique', 1, {
    unitId: 'ex-tech-squat',
    objectiveIds: ['ex-tech-squat-o3'],
    level: 'analysis',
    prompt:
      '同じ人の自重スクワットの下降を、同じ膝屈曲角の側面フレームで比較した。試行BではAより体幹も下腿も鉛直から前へ6°傾いた。研究の推定式では、股関節対膝伸展モーメント比は体幹の前傾1°あたり＋0.020、下腿の前傾1°あたり−0.030で、他の変数は同じとする。どの報告が妥当か。',
    correct: ['比は約0.06低くなると推定する。', '＋0.020×6と−0.030×6を足すと−0.06になる。'],
    distractors: [
      [
        '比は約0.12高くなると推定する。',
        '体幹の項は＋0.12だが、同時に変わった下腿の項−0.18を省いている。',
      ],
      [
        '比は約0.18低くなると推定する。',
        '下腿の項は−0.18だが、反対方向へ作用する体幹の項＋0.12を省いている。',
      ],
    ],
    explanation:
      '同じ深さでも、体幹と下腿の姿勢は別々の予測変数になる。二つの効果を合計し、推定された比の差として記録する。映像だけで各関節の絶対モーメントを測定した値ではない。',
    sourceRefs: [ref(sources.squat)],
  }),
  advancedItem('technique', 2, {
    unitId: 'ex-tech-squat',
    objectiveIds: ['ex-tech-squat-o3'],
    level: 'analysis',
    prompt:
      '同じ台の前方・側方ステップアップを安定して行う高齢利用者を評価した。上昇中の股関節伸展角度と、その角度範囲での平均伸展モーメントは前方40°・50 N·m、側方25°・60 N·mだった。股関節のピークモーメントは同程度。股関節の正の仕事を重視するときの判断はどれか。',
    correct: [
      '前方の股関節の仕事が大きい。側方より角度範囲が広い。',
      '平均モーメントに角度変化を掛ける。前方は約35 J、側方は約26 J。',
    ],
    distractors: [
      [
        '側方の股関節の仕事が大きい。前方より平均モーメントが大きい。',
        '平均モーメントは側方が大きいが、伸展した角度が小さいため積は前方が大きい。',
      ],
      [
        '両者の股関節の仕事は同じ。ピークモーメントが近い。',
        '一点での最大値が近くても、可動域全体で積み上がる仕事は一致しない。',
      ],
    ],
    explanation:
      '角度をラジアンに換算し、前方は50×40×π÷180、側方は60×25×π÷180。原著でも前方と側方で股関節の仕事に差が見られた。この仮想データでは股関節だけを比較している。',
    sourceRefs: [ref(sources.step), ref(sources.rotationalWork)],
  }),
  advancedItem('technique', 3, {
    unitId: 'ex-tech-cardio',
    objectiveIds: ['ex-tech-cardio-o1'],
    level: 'analysis',
    prompt:
      'RowErgでキャッチから駆動に移る側面映像を見た。最初の数コマで膝が伸びて座席が後ろへ動くが、肩とハンドルはほぼ静止する。肘は伸びたままで、胴体が後ろに開くのは遅い。軽い試行で優先する確認はどれか。',
    correct: [
      '脚で押し始める区間で、座席とハンドルが一緒に動くかを見る。',
      '座席だけが先行するため、駆動初期に脚の押しをハンドルへ伝える連動を見直す。',
    ],
    distractors: [
      [
        '膝が動き出す前に、肘でハンドルを引き始める。',
        '早い腕引きでハンドルは動くが、脚から始める駆動順序を変えてしまう。',
      ],
      [
        '座席を固定し、上体の後傾でハンドルを先行させる。',
        '上体から先に開く別のエラーを加える。今回は脚で押す時点の肩・ハンドルとの連動が焦点。',
      ],
    ],
    explanation:
      'キャッチ後に座席だけが先へ動くことが観察上の手掛かりになる。肘や上体を早く動かすのではなく、負荷を抑えて、脚で押す動きがハンドルへ伝わるかを確かめる。',
    sourceRefs: [ref(sources.row)],
  }),
  advancedItem('technique', 4, {
    unitId: 'ex-tech-hinge',
    objectiveIds: ['ex-tech-hinge-o3'],
    level: 'analysis',
    prompt:
      '十分に習熟した利用者がノルディック・ハムストリングを練習する。水平な下腿台では膝が伸びる手前で下降速度を保てなくなる。狙いは反復数や最大筋電図を増やすことではなく、股関節の姿勢をそろえ、膝がより伸びた位置まで制御して下ろせる条件を探すこと。次の試行はどれか。',
    correct: [
      '固定できる傾斜台で下腿台の傾斜を増やし、制御できる膝角度を再測定する。',
      '原著では下腿台の傾斜を増すと、より膝伸展に近い範囲まで制御して動かせた。',
    ],
    distractors: [
      [
        '水平台を保ち、制御を失う区間で股関節を深く曲げる。',
        '股関節角度が変わり、そろえたい条件が失われる。膝の制御範囲が広がったかを同じ姿勢で比較できない。',
      ],
      [
        '水平台を保ち、最初の下降を速くして大きい範囲まで移動する。',
        '到達位置が深くても、最後まで速度を制御できたとは判断できない。',
      ],
    ],
    explanation:
      'このケースで調整するのは下腿台の傾斜で、測るのは制御できる膝伸展の範囲。原著の効果は調べた条件に限られるため、利用者自身の反復で変化を確認する。',
    sourceRefs: [ref(sources.nordic)],
  }),
  advancedItem('technique', 5, {
    unitId: 'ex-tech-power',
    objectiveIds: ['ex-tech-power-o2'],
    level: 'analysis',
    prompt:
      '同じ進入速度の180°折り返しを比べると、試行Bでは最後の足だけで大きく減速し、出口で一歩遅れた。試行Aでは最後の接地の二つ前から減速し、折り返し後すぐ進めた。急停止からの再加速を改善する観察と練習の組合せはどれか。',
    correct: [
      '最後の接地より前にも制動を配分し、最後の接地から押し出せるかを見る。',
      '505テストの研究では最後より前の接地でも大きな制動を生み、折り返し全体で力を発揮する戦略が示される。',
    ],
    distractors: [
      [
        '最後の足の後方への制動を増し、手前二歩の接地は同じにする。',
        'すでに最後の接地に減速が集中している。制動を増やす箇所を変えないため、観察された遅れを検討しにくい。',
      ],
      [
        '折り返し直後の一歩だけを強め、手前の制動時点は同じにする。',
        '出口の推進は関連するが、進入から最後の接地までに残った減速要求を見落とす。',
      ],
    ],
    explanation:
      '方向転換は最後の一歩だけで成立しない。進入速度をそろえ、最後より前の接地から制動し、出口の推進へ切り替えられるかを一続きで評価する。',
    sourceRefs: [ref(sources.turn)],
  }),
  advancedItem('technique', 6, {
    unitId: 'ex-tech-power',
    objectiveIds: ['ex-tech-power-o1'],
    level: 'analysis',
    prompt:
      '着地練習で、見本動画を毎回見られる条件では膝と股関節の曲がり方が改善した。同じ日の最後も動画の直後なら再現できた。翌週に動画なしで行う競技場面へ移す前に、指導者は技術が保持されたかを知りたい。どの評価を追加するか。',
    correct: [
      '翌週、同じ課題を見本や声掛けなしで再試行し、基準時の着地と比べる。',
      '時間をおき、補助を外した保持テストなら、練習中の一時的な改善と区別できる。',
    ],
    distractors: [
      [
        '翌週も試行直前に見本を見せ、練習日の最終反復と比べる。',
        '日をまたいでも、同じ見本の支援があるため、見本を外しても再現できるかは分からない。',
      ],
      [
        '練習日の動画直後に反復を増やし、安定した回数を基準時と比べる。',
        '同日かつ補助ありの成績を詳しく測る方法で、翌週に補助なしで保持できるかは検証できない。',
      ],
    ],
    explanation:
      'その場の練習成績と、時間をおいた保持は別に測る。まず同じ課題を同じ基準で再評価し、競技固有の別課題への転移は別の評価として扱う。',
    sourceRefs: [ref(sources.retention)],
  }),
  advancedItem('technique', 7, {
    unitId: 'ex-tech-cardio',
    objectiveIds: ['ex-tech-cardio-o3'],
    level: 'analysis',
    prompt:
      'トレッドミルで同じ速度・傾斜・測定時点をそろえたが、2回目は両手で手すりを握り続け、1回目は支持なしで歩いた。2回目は心拍と主観的なきつさがともに下がった。体力向上の記録として使う前に何をするか。',
    correct: [
      '支持の有無を記録し、安全に取れる同じ支持条件で再比較する。',
      '同じ速度・傾斜でも、手すりを握ること自体が心拍や酸素摂取量などの反応を下げ得る。',
    ],
    distractors: [
      [
        '機器設定が同じなので、心拍と主観強度の低下を体力向上として記録する。',
        '支持条件を変えているため、数値が同じ方向に動いても体力変化とは分離できない。',
      ],
      [
        '次は手すりを握ったまま傾斜を上げ、心拍が一致すれば前回と同じ体力とみなす。',
        '心拍を合わせても、支持と傾斜の両方が異なるため、体力変化の比較条件はそろわない。',
      ],
    ],
    explanation:
      '速度と傾斜は機器設定で、同じ設定での生理反応は身体の支持にも左右される。必要な安全支持を維持したまま、測定条件をそろえて比較する。',
    sourceRefs: [ref(sources.treadmill)],
  }),
  advancedItem('technique', 8, {
    unitId: 'ex-tech-hinge',
    objectiveIds: ['ex-tech-hinge-o3'],
    level: 'analysis',
    prompt:
      'デッドリフトに習熟した利用者の1RMはストレートバー120 kg、ヘックスバー150 kg。ストレートバーの60%と同じ絶対重量で両方を比較する。側面映像では、負荷の鉛直な作用線がストレートバーで膝の前、ヘックスバーで膝の後ろを通った。この区間の重量設定と、ヘックスバーでの負荷由来の膝モーメントの組合せはどれか。',
    correct: [
      '両方72 kg。膝を屈曲させる方向に働く。',
      '両方を120×0.60とする。原著の説明では、膝の後ろに位置する負荷は屈曲方向のモーメントを作った。',
    ],
    distractors: [
      [
        'ストレート72 kg・ヘックス90 kg。膝を屈曲させる方向に働く。',
        '作用方向は合うが、各バーの60%を採用している。設問では同じ絶対重量を使う。',
      ],
      [
        '両方72 kg。膝を伸展させる方向に働く。',
        '重量設定は合うが、膝の前に作用線がある場合の向きを当てはめている。回転中心の反対側では向きが変わる。',
      ],
    ],
    explanation:
      '同じ絶対重量でも、膝に対する負荷の作用線の位置で回転の向きが変わる。ここで扱うのは負荷由来の外部モーメントで、膝にかかる全ての力を求めた値ではない。',
    sourceRefs: [ref(sources.hex)],
  }),
  advancedItem('technique', 9, {
    unitId: 'ex-tech-upper',
    objectiveIds: ['ex-tech-upper-o3'],
    level: 'analysis',
    prompt:
      '懸垂に慣れた利用者が、順手と逆手で同じ高さまで上がれたため、肩の動きも同じだと記録した。指導者は、腕を上げた開始付近の上腕の回旋と肩甲骨の動きを比較したい。研究の測定範囲に沿う見直しはどれか。',
    correct: [
      '握りを別条件として記録し、上昇開始付近も比較する。',
      '握りで上腕と肩甲骨の運動は変わり、逆手は開始付近の肩関節外旋の違いが報告されている。',
    ],
    distractors: [
      [
        'バーへの到達位置が同じなら、肩の運動は共通条件として扱う。',
        '到達位置は一つの結果であり、そこまでに用いた肩関節・肩甲骨の運動を決めない。',
      ],
      [
        '握りを別条件にするが、相違は上端での肘屈曲だけとして記録する。',
        '肘屈曲の差だけでは、開始付近の肩関節回旋や肩甲骨の違いを評価できない。',
      ],
    ],
    explanation:
      '同じ到達高でも関節の運動は同じとは限らない。観察研究が比較したのは握り別の上昇時の運動学で、映像から個人の肩の傷害を診断することとは異なる。',
    sourceRefs: [ref(sources.pull)],
  }),
  advancedItem('technique', 10, {
    unitId: 'ex-tech-core',
    objectiveIds: ['ex-tech-core-o3'],
    level: 'analysis',
    prompt:
      '腕立て伏せで膝支持へ変更したら、利用者は上端の静止姿勢を保てたが、下端の手前で制御が崩れた。指導者は「膝支持なら手にかかる重さは反復中一定」と考えている。静止姿勢での鉛直支持力の研究を踏まえ、どの比較が役立つか。',
    correct: [
      '膝支持でも上端と下端を分け、制御できる下降範囲を確かめる。',
      '膝支持と通常の両方で、静止下端の手側支持力が上端より大きかった。',
    ],
    distractors: [
      [
        '膝支持では差が小さいとみなし、上端の保持が長くなれば下端も同じ扱いにする。',
        '膝支持でも上下の差はあり、研究では体重比の変化率はむしろ膝支持で大きかった。',
      ],
      [
        '両種目の上端だけを測り、種目間の差をそのまま下端の支持力へ適用する。',
        '上端の測定値だけでは、位置を変えたときの各種目の支持力を特定できない。',
      ],
    ],
    explanation:
      '支持を膝へ変えても、動作中の位置という条件は残る。研究は静止時の手側鉛直力を測ったため、個人の動的な反復の難度は実際の制御と合わせて判断する。',
    sourceRefs: [ref(sources.push)],
  }),
  advancedItem('technique', 11, {
    unitId: 'ex-tech-mechanics',
    objectiveIds: ['ex-tech-mechanics-o2', 'ex-tech-mechanics-o3'],
    level: 'analysis',
    prompt:
      'ウェイトを上げ下げする練習を単純化し、利用者が物体に加える力は上下とも上向き240 Nとする。物体は0.35 mを0.70秒で上昇し、同距離を1.40秒で下降した。この力が物体にした1往復の仕事と、下降局面の平均パワーはどれか。',
    correct: [
      '1往復で0 J、下降の平均は−60 W。',
      '上昇は＋84 J、下降は−84 J。下降の平均は−84÷1.40＝−60 W。',
    ],
    distractors: [
      [
        '1往復で0 J、下降の平均は＋60 W。',
        '仕事を相殺できているが、下降では上向きの力と下向き変位なのでパワーの符号も負。',
      ],
      [
        '1往復で168 J、下降の平均は−60 W。',
        '168 Jは二つの仕事の絶対値の和。指定の力による一往復の符号付きの仕事とは異なる。',
      ],
    ],
    explanation:
      '外部の力が物体にした仕事は力と変位の向きで符号を付ける。下降を制御する努力があっても、定義した物体への仕事は負になる。平均パワーでは下降にかかった時間だけを分母にする。',
    sourceRefs: [ref(sources.work), ref(sources.power)],
  }),
  advancedItem('technique', 12, {
    unitId: 'ex-tech-mechanics',
    objectiveIds: ['ex-tech-mechanics-o1'],
    level: 'application',
    prompt:
      '肘を支えたケーブル種目の同じ局面で、二つの設定の肘まわりの外部モーメントを比較する。肘から取手への線はAが0.30 m、Bが0.25 m。ケーブルの力はAが140 Nでその線と30°、Bが84 Nでその線と90°をなす。向きはどちらも同じ回転方向で、他の力は除く。どの比較が正しいか。',
    correct: ['AとBは同じ21 N·m。', 'Aは0.30×140×sin30°、Bは0.25×84×sin90°で、どちらも21 N·m。'],
    distractors: [
      [
        'Aは42 N·m、Bは21 N·m。',
        'Aでも肘から取手への線をそのまま力の腕にしている。角度30°の補正が必要。',
      ],
      [
        'Aは約36 N·m、Bは21 N·m。',
        'Aで余弦を使った値。肘から取手への線に垂直な力成分は正弦で求める。',
      ],
    ],
    explanation:
      '張力の大きさだけでは抵抗モーメントは分からない。肘から力の作用線への垂直距離、または肘から取手への距離とそれに垂直な力成分の組合せで比較する。',
    sourceRefs: [ref(sources.torque)],
  }),
  advancedItem('technique', 13, {
    unitId: 'ex-tech-hinge',
    objectiveIds: ['ex-tech-hinge-o1', 'ex-tech-hinge-o3'],
    level: 'analysis',
    prompt:
      '軽負荷のハング・パワークリーンを横から観察した。伸展後のバーは身体の近くを上がり、足は受け位置に入っている。しかし、身体がバーの下へ移る間も肘は下を向き、バーを肩で受けずに両手で止めた。引き上げ方を変える前に何を練習するか。',
    correct: [
      '身体がバーの下へ入る間に肘を前へ送り、肩の前で受けるタイミング。',
      '受け姿勢への移行と肘の回転を合わせるのがNSCAの手順で、観察された遅れに対応する。',
    ],
    distractors: [
      [
        '肩の引き上げを長く続け、受け位置で立ち上がってから肘を前へ送るタイミング。',
        '立ち上がりは肩で受けた後に行う。観察された肘の遅れをさらに遅らせる。',
      ],
      [
        '脚を伸ばし切る前に肘を大きく曲げ、バーを高くしてから肩を入れるタイミング。',
        '観察では引き上げは成立している。先に肘を曲げる変更は、受けへの移行を直さず引き上げの順序を変える。',
      ],
    ],
    explanation:
      '問題が現れたのは引き始めでなく、下へ潜ってバーを受ける区間。軽い条件で足と身体が受け位置に入る動きと肘の前方移動を同期させ、肩の前で支えられるかを見る。',
    sourceRefs: [ref(sources.clean)],
  }),
  advancedItem('technique', 14, {
    unitId: 'ex-tech-power',
    objectiveIds: ['ex-tech-power-o2'],
    level: 'application',
    prompt:
      '落下着地を同じ側面から撮り、初接地から膝の屈曲が最大になるまでを比較する。元動画Aは60 fpsで10フレーム間隔、Bは120 fpsで16フレーム間隔だった。どちらも膝角度の変化量は24°。平均の膝屈曲角速度の大きさをどう整理するか。',
    correct: [
      'Bの方が大きい。Aは約144°/秒、Bは約180°/秒。',
      '時間はAが10÷60秒、Bが16÷120秒。24°をそれぞれの時間で割る。',
    ],
    distractors: [
      [
        'Aの方が大きい。Aは約144°/秒、Bは約90°/秒。',
        'Bにも60 fpsを適用した値。元動画のフレーム間隔はAとBで異なる。',
      ],
      [
        'AとBは同じ。両方とも24°を同じ区間として扱う。',
        '開始・終了の動作イベントをそろえても、経過時間は同じとは限らない。',
      ],
    ],
    explanation:
      '動画の枚数を比較する前に、各動画の元の撮影レートで実時間へ直す。求めたのは接地から最大屈曲までの平均で、ピークの角速度や着地全体の良否はこの値だけで決まらない。',
    sourceRefs: [ref(sources.video)],
  }),
  advancedItem('technique', 15, {
    unitId: 'ex-tech-squat',
    objectiveIds: ['ex-tech-squat-o3'],
    level: 'analysis',
    prompt:
      '後足を台に置くスプリットスクワットを、同じ利用者の下降下端で比較した。試行BではAより後足の鉛直反力が小さかったが、後脚から前脚の股関節へ伝わる力の作用線が変わった。前脚の股関節伸展への要求も小さくなったと結論づける前に何を見るか。',
    correct: [
      '後脚由来の股関節まわりのモーメントと、上体の重力由来のモーメントを確認する。',
      'この運動のモデルでは両方が前脚の股関節伸展に対する抵抗に寄与し、後足の鉛直反力だけでは比べられない。',
    ],
    distractors: [
      [
        '後足の鉛直反力を全体重で割り、その低下を股関節の要求低下として使う。',
        '体重で正規化しても力の作用線や腕、上体の重力モーメントは計算に入らない。',
      ],
      [
        '前足の鉛直反力が増えたかだけを確認し、前脚の股関節の要求を決める。',
        '前足の反力は荷重配分の情報だが、股関節まわりの回転作用を単独では決めない。',
      ],
    ],
    explanation:
      '足が受ける力の割合と、股関節に作用する回転モーメントは別の量になる。姿勢や作用線が違う比較では、後脚と上体に由来する外部モーメントをそれぞれ考える。',
    sourceRefs: [ref(sources.split), ref(sources.torque)],
  }),
];
