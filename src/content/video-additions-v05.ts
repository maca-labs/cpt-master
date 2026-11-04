import type { Source, SourceRef, Video } from '../domain/types';

// Review sign-off date is JST; the ISO instant is UTC. Metadata, content,
// playback and embedding are independent observations, not inferred states.
const checkedAt = '2026-11-05';
const reviewedAt = '2026-11-04T15:24:44Z';

export const videoV05Sources: Source[] = [
  {
    id: 'v05-nsca-deadlift',
    title: 'NSCAジャパン：動画でトレーニング紹介「デッドリフト」',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1331/',
    edition: '2024-07-16公開記事',
    checkedAt,
    locator: '注意ポイント1–8、対象筋、初心者への指導上の注記。本文を実読。',
  },
  {
    id: 'v05-nsca-pulldown',
    title: 'NSCAジャパン：動画でトレーニング紹介「ラットプルダウン」',
    url: 'https://park.nsca-japan.or.jp/category-13/post-2435/',
    edition: '2024-11-29公開記事',
    checkedAt,
    locator: '注意ポイント1–4。本文を実読し、同じ記事内の動画IDと照合。',
  },
  {
    id: 'v05-nsca-bench',
    title: 'NSCAジャパン：ベンチプレスの正しいやり方',
    url: 'https://park.nsca-japan.or.jp/category-13/post-725/',
    edition: '2024-05-27公開記事',
    checkedAt,
    locator: '注意ポイント1–8、セーフティーバー・補助者の注記。本文を実読。',
  },
  {
    id: 'v05-nsca-lunge',
    title: 'NSCAジャパン：かんたん、おうちエクササイズ「ランジ」',
    url: 'https://park.nsca-japan.or.jp/category-14/post-2117/',
    edition: '2024-10-21公開記事',
    checkedAt,
    locator: 'フォワードランジ：踏み出し、受け止め、復帰、上体の制御。',
    note: '膝がつま先を越えるかだけで可否を決めない。動画の基本形と個別の支持・可動域調整を区別する。',
  },
  {
    id: 'v05-nsca-shoulder',
    title: 'NSCAジャパン：かんたん、おうちエクササイズ「ショルダープレス」',
    url: 'https://park.nsca-japan.or.jp/category-14/post-1431/',
    edition: '2024-07-26公開記事',
    checkedAt,
    locator: 'ダンベルショルダープレス：肘の上の手首、体幹の過伸展・左右傾斜の注意。',
    note: '本文全文をブラウザーで実読。立位の動画を座位の5ポイントコンタクトの実演とは扱わない。',
  },
  {
    id: 'v05-nsca-pushup',
    title: 'NSCAジャパン：かんたん、おうちエクササイズ「プッシュアップ」',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1211/',
    edition: '2024-07-08公開記事',
    checkedAt,
    locator: 'ポイント1–3：身体の配列、制御した下降、机等に手をつく斜めの支持姿勢。',
    note: '壁プッシュアップの同一実演の転載ではなく、配列・支持条件を照合する公開本文。',
  },
  {
    id: 'v05-concept2-row',
    title: 'Concept2: Indoor Rowing Technique',
    url: 'https://www.concept2.com/training/rowing-technique',
    edition: 'メーカー公開Web版（更新日記載なし）',
    checkedAt,
    locator: 'The Catch / The Drive / The Finish / The Recovery。各箇条書きを実読。',
    note: '機器固有の実技例。ダンパー設定の内容確認をこの動画から推定しない。',
  },
  {
    id: 'v05-nsca-power',
    title: 'NSCAジャパン：パワーについて考えてみましょう！',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1921/',
    edition: '2024-09-27公開記事',
    checkedAt,
    locator: 'パワーの定義：P=W/t。仕事と経過時間の関係。',
    note: '動画前半の平均パワーの比較を照合。競技別の比較値や代謝量を根拠に用いない。',
  },
  {
    id: 'v05-openstax-power',
    title: 'OpenStax: College Physics 2e — 7.7 Power',
    url: 'https://openstax.org/books/college-physics-2e/pages/7-7-power',
    edition: '第2版、2022-07-13公開',
    checkedAt,
    locator: 'What is Power? 式7.69、単位W=J/s、Example 7.11の仕事から時間で割る手順。',
    note: '数式・単位の事実のみ照合。運動生理学への説明や原図・例題の転載には用いない。',
  },
];

interface VisualReviewInput {
  youtubeId: string;
  title: string;
  channel?: string;
  unitId: string;
  objective: string;
  order: number;
  reason: string;
  discoveryUrl: string;
  coverage: string;
  findings: string[];
  limitations: string[];
  refs: SourceRef[];
  embedded: boolean;
}

function reviewedVisual(input: VisualReviewInput): Video {
  const url = `https://www.youtube.com/watch?v=${input.youtubeId}`;
  return {
    id: `yt-${input.youtubeId}`,
    youtubeId: input.youtubeId,
    title: input.title,
    channel: input.channel ?? 'NSCA Japan',
    url,
    unitIds: [input.unitId],
    objectiveIds: [input.objective],
    difficulty: '基礎',
    order: input.order,
    reason: input.reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method: `Web検索・公式掲載元 ${input.discoveryUrl} から同定。YouTube公式oEmbedのtitle・author_nameと、同一IDのプレーヤー表示を確認。内容確認とは別の記録。`,
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    },
    playback: {
      status: 'playable',
      checkedAt: reviewedAt,
      method: `${input.embedded ? '公式掲載元の埋め込み' : 'YouTube視聴ページ'}で再生操作後の経過時間の増加と実映像を確認。全編連続再生・音声の聴取は未実施。`,
    },
    embed: input.embedded
      ? {
          status: 'embeddable',
          checkedAt: reviewedAt,
          method: `公式掲載元 ${input.discoveryUrl} 内の同一IDのYouTube埋め込みで実映像と時間の進行を確認。当アプリ内・全端末での再生保証ではない。`,
        }
      : { status: 'unconfirmed', checkedAt: null, method: null },
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが実プレーヤーの主要画面・画面内の説明を目視し、公開一次資料と照合。対象とした学習目標・確認範囲に限る。人間の専門家による審査ではありません。',
      sourceRefs: input.refs,
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        coverage: input.coverage,
        objectiveIds: [input.objective],
        checkedAt: reviewedAt,
        findings: input.findings,
        limitations: [
          '主要画面を抽出して確認した限定レビュー。音声聴取、全編連続の映像確認、人間の専門家レビューは未実施。動画の全主張や全学習目標を確認した意味ではありません。',
          ...input.limitations,
        ],
        evidence: [
          { url, locator: input.coverage },
          {
            url: input.discoveryUrl,
            locator:
              '掲載プレーヤーまたは同一動画IDの視聴ページ。タイトル・チャンネル・IDの対応を確認。',
          },
        ],
      },
    },
  };
}

const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });

export const videoV05Additions: Video[] = [
  reviewedVisual({
    youtubeId: 'K0aNKaCKBsE',
    title: 'デッドリフト',
    unitId: 'ex-tech-hinge',
    objective: 'ex-tech-hinge-o1',
    order: 1,
    reason:
      '床からの開始位置と、バーが膝を通る前後の上体の動きを日本語の実演で観察します。RDLとの違いは本文と確認問題へ。',
    discoveryUrl: 'https://park.nsca-japan.or.jp/category-13/post-1331/',
    coverage:
      '公式埋め込みK0aNKaCKBsEを再生。プレーヤーで0:07・0:17・0:27・0:37・0:47・0:57を指定して主要画面と日本語テロップを目視（表示全長1:04）。',
    findings: [
      'ex-tech-hinge-o1：0:07の開始時の肩・股関節・バー、0:17の足幅と膝外側の握りを、記事注意1–5と照合。',
      'ex-tech-hinge-o1：0:27・0:37の膝を通る前後の上体、0:47・0:57の身体に近い下降を、注意6–8と照合。',
    ],
    limitations: ['RDL、個人の関節可動域、痛みの有無や適正負荷の判定は確認範囲外。'],
    refs: [ref('v05-nsca-deadlift', '注意ポイント1–8')],
    embedded: true,
  }),
  reviewedVisual({
    youtubeId: 'QB-r-j_lciA',
    title: 'ラットプルダウン',
    unitId: 'ex-tech-upper',
    objective: 'ex-tech-upper-o2',
    order: 2,
    reason:
      '日本語の実演で、開始時の腕の位置と上胸部へ向かうバーの軌道、反動を抑える観察点を確認します。',
    discoveryUrl: 'https://park.nsca-japan.or.jp/category-13/post-2435/',
    coverage:
      '公式埋め込みQB-r-j_lciAを再生し0:08・0:15・0:25を目視。0:35も表示したが転換画面で詳細判定には使わない（表示全長0:41）。',
    findings: [
      'ex-tech-upper-o2：0:08の握りと腕の伸展、0:15の側面・背面、0:25の上胸部へ引く実演と日本語テロップを、記事注意1–4と照合。',
      '反復中の大きな反動と、記事が例示する胸を張った軌道を分けて観察する補助となる。',
    ],
    limitations: [
      '肩甲帯の全可動域、個々の肩の安全性、全機種の大腿パッド調整は未確認。目標全体のうちバーの軌道・基本姿勢の部分を扱う。',
    ],
    refs: [ref('v05-nsca-pulldown', '注意ポイント1–4')],
    embedded: true,
  }),
  reviewedVisual({
    youtubeId: 'hSTnDmUm3MY',
    title: 'ベンチプレス',
    unitId: 'ex-tech-upper',
    objective: 'ex-tech-upper-o1',
    order: 1,
    reason:
      '5ポイントコンタクトと前腕・バーの位置、上昇と下降を観察します。ラックへ戻す手順と補助者の準備は本文・実技資料で補完します。',
    discoveryUrl: 'https://park.nsca-japan.or.jp/category-13/post-725/',
    coverage:
      '公式埋め込みhSTnDmUm3MYを再生し0:09・0:19・0:29・0:39・0:49の主要画面と日本語テロップを目視（表示全長0:56）。',
    findings: [
      'ex-tech-upper-o1：0:09の支持点、0:19の保持位置、0:29の下降時の前腕、0:39・0:49の上昇と支持維持を、公式記事注意1–8とWL実技検定pp.2–3へ照合。',
      '画面だけで器具の安全を保証せず、記事のセーフティーバー・補助者の注記を学習時の補足とする。',
    ],
    limitations: [
      'ラック復帰の一連の実演、補助者の技術、個人に適した握り幅は未確認。検定資料の個別調整の注記を優先する。',
    ],
    refs: [
      ref('v05-nsca-bench', '注意1–8と安全の注記'),
      ref('ex-tech-bench', 'pp.2–3：支持・前腕・上昇、ラック復帰の本文'),
    ],
    embedded: true,
  }),
  reviewedVisual({
    youtubeId: 'IZEN9zAMjqA',
    title: 'フォワードランジ',
    unitId: 'ex-tech-squat',
    objective: 'ex-tech-squat-o2',
    order: 2,
    reason:
      '負荷付きの基本形で、踏み出す足の位置と体幹、戻る局面を観察します。支持あり・固定足・浅い範囲への調整は教材本文で学びます。',
    discoveryUrl: 'https://nsca-japan.or.jp/database/videos-photos',
    coverage:
      '公式一般公開一覧のフォワードランジからIZEN9zAMjqAを再生。0:09・0:19・0:39・0:49の正面・側面と日本語テロップを目視（表示全長0:59）。',
    findings: [
      'ex-tech-squat-o2：0:09の開始足位置、0:19の前方への踏み出しと体幹、0:39・0:49の復帰を、公開ランジ記事とPTQ4.4 pp.44–46の足位置・体幹・段階的調整と照合。',
      '動画は負荷付き基本形の観察例。調整前の見本として扱い、全利用者へ同じ深さや重量を要求しない。',
    ],
    limitations: [
      '支持あり・可動域縮小・固定足の修正例は本動画では確認できていない。膝とつま先の前後関係だけでフォームの可否を断定しない。',
    ],
    refs: [
      ref('v05-nsca-lunge', 'フォワードランジ：踏み出し・受け止め・復帰'),
      ref('ex-tech-lunge', 'pp.44–46、Teaching CuesとTable2の支持・ROM調整'),
    ],
    embedded: true,
  }),
  reviewedVisual({
    youtubeId: 'tRk3t97VBLs',
    title: 'ダンベルショルダープレス',
    unitId: 'ex-tech-upper',
    objective: 'ex-tech-upper-o1',
    order: 3,
    reason:
      '立位のプレスで、手首・肘・負荷の位置と、上昇・下降の制御を日本語の画面内ポイントに沿って観察します。',
    discoveryUrl: 'https://nsca-japan.or.jp/database/videos-photos/?paged=2',
    coverage:
      '公式一般公開一覧のtRk3t97VBLsを再生。0:11・0:21・0:31・0:41の正面・側面と日本語テロップを目視（表示全長0:50）。',
    findings: [
      'ex-tech-upper-o1：0:11の保持、0:21の挙上、0:31・0:41の手首・前腕の位置と下降を、公式ショルダープレス記事の「肘の上に手首」と体幹の制御へ照合。',
    ],
    limitations: [
      '立位の動画。座位の5ポイントコンタクト、ベンチプレスのラック復帰やダンベルの安全な持ち込み・降ろし方は未確認。',
    ],
    refs: [ref('v05-nsca-shoulder', 'ダンベルショルダープレス：手首・肘、体幹の過伸展と左右傾斜')],
    embedded: true,
  }),
  reviewedVisual({
    youtubeId: 'UlUjS6_A0Qc',
    title: '【NSCAジャパン】12ウォールプッシュアップ',
    unitId: 'ex-tech-core',
    objective: 'ex-tech-core-o3',
    order: 1,
    reason:
      '床でのプッシュアップが難しいときの支持条件の例を、安定した壁・無理のない距離・制御した反復として観察します。',
    discoveryUrl: 'https://www.youtube.com/watch?v=UlUjS6_A0Qc',
    coverage:
      'NSCA Japanの視聴ページUlUjS6_A0Qcで再生。0:09・0:12付近・0:29の動作と固定表示の日本語注意点を目視（表示全長0:33）。0:19の確認時は上半身が一部画面外のため細部の根拠にしない。',
    findings: [
      'ex-tech-core-o3：安定した壁で両手を支持し、無理のない距離を選び、肘の曲げ伸ばしで身体を移す実演と画面内注意を、公式プッシュアップ記事の配列・制御・斜め支持の原則へ照合。',
    ],
    limitations: [
      '支持角度を変えた負荷の数値比較、サスペンションの固定方法は確認範囲外。YouTube視聴ページのみで、埋め込み再生は未確認。',
    ],
    refs: [ref('v05-nsca-pushup', 'ポイント1–3、斜めの支持姿勢')],
    embedded: false,
  }),
  reviewedVisual({
    youtubeId: '4zWu1yuJ0_g',
    title: 'Correct Rowing Machine Technique, Improve Your Rowing  | Concept2',
    channel: 'concept2usa',
    unitId: 'ex-tech-cardio',
    objective: 'ex-tech-cardio-o1',
    order: 1,
    reason:
      'メーカー公式実演でキャッチと反復の姿勢を観察し、駆動・復帰の順序を本文と結び付けます。英語動画です。ダンパー設定は教材本文を参照してください。',
    discoveryUrl: 'https://www.concept2.com/training/rowing-technique',
    coverage:
      'メーカー記事内の同一IDを再生。0:24・0:44・0:54・1:14・1:24を指定した側面・手元の画面と、1:24に表示されたドイツ語字幕の順序説明を目視（表示全長1:54）。字幕全文・音声は未確認。',
    findings: [
      'ex-tech-cardio-o1：キャッチの腕・下腿と、ハンドル・身体の位置をメーカー本文The Catch / The Drive / The Finish / The Recoveryへ照合。',
      '1:24に実表示された字幕の脚→体幹→腕、腕→体幹→脚の順序は、メーカー本文の駆動・復帰の説明と対応。字幕全文を読んだという記録ではない。',
    ],
    limitations: [
      '動作の連続全編と全字幕は未確認。ダンパー値・ドラッグファクター、故障時の判断は本動画から確認していない。機種を越えた設定へ一般化しない。',
    ],
    refs: [ref('v05-concept2-row', 'The Catch / The Drive / The Finish / The Recovery')],
    embedded: true,
  }),
  reviewedVisual({
    youtubeId: 'RpbxIG5HTf4',
    title: 'Power | Work and energy | Physics | Khan Academy',
    channel: 'khanacademymedicine',
    unitId: 'ex-tech-mechanics',
    objective: 'ex-tech-mechanics-o2',
    order: 1,
    reason:
      '最初の重りの例で、同じ仕事を異なる時間で行う平均パワーの計算を図と式で確認します。英語動画の確認済み範囲は前半のこの例です。',
    discoveryUrl: 'https://www.youtube.com/watch?v=RpbxIG5HTf4',
    coverage:
      '同一IDを再生し0:19・0:34・1:09・1:43の図・式を目視（全長5:45）。3:27も表示したが、車・瞬間パワーの章は審査対象外。字幕取得・音声聴取は未実施。',
    findings: [
      'ex-tech-mechanics-o2：0:34の同じ質量・高さと仕事、1:09の仕事/時間、1:43の同じ1960Jを異なる時間で割る図を実読し、P=W/tとW=J/sの単位関係を一次資料へ照合。',
      '1:43の平均パワーの数値を再計算し、表示の丸めを含めて式と矛盾しないことを確認。単元の独自問題へ動画例題を転載しない。',
    ],
    limitations: [
      '推奨範囲は前半の仕事と平均パワーの例。車・瞬間パワーの説明、後半の全主張、人体の代謝・生理学への拡張は未確認。埋め込み再生は未確認。',
    ],
    refs: [
      ref('v05-nsca-power', 'パワーの定義：P=W/t'),
      ref('v05-openstax-power', '§7.7 What is Power? 式7.69、W=J/s、Example7.11の手順'),
    ],
    embedded: false,
  }),
];
