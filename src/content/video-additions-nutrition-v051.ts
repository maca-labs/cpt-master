import type { Source, Video } from '../domain/types';

const checkedAt = '2026-11-05';
const reviewedAt = '2026-11-05T02:11:47Z';
const sapporoPage = 'https://www.city.sapporo.jp/kankyo/ondanka/hyperthermia/seminar.html';
const caaPage =
  'https://www.caa.go.jp/policies/policy/food_labeling/nutrient_declearation/consumers/movie/movie_04.html';
const caaLeaflet =
  'https://www.caa.go.jp/policies/policy/food_labeling/health_promotion/assets/food_labeling_cms206_20240520_03.pdf';
const caaProgram =
  'https://www.caa.go.jp/policies/policy/local_cooperation/local_consumer_administration/advancedmodel/assets/cms_local201_220427_3-2-3.pdf';
const khanPage =
  'https://www.khanacademy.org/science/health-and-medicine/gastro-intestinal-system/x6e556f83%3Abmi-and-diet/v/calculate-your-own-body-mass-index';
const yokohamaPage =
  'https://www.city.yokohama.lg.jp/nishi/kenko-iryo-fukushi/kenko_iryo/kenkozukuri/sonota/kenkou-check.html';
const clinicPage = 'https://www.kamata-yamada-cl.com/news/1089/';

export const nutritionV051Sources: Source[] = [
  {
    id: 'v051-nutrition-caa-program',
    title:
      '消費者庁：講演資料（動画プログラム解説資料）基本編「これでわかる栄養成分表示！基本のキ」',
    url: caaProgram,
    edition: '公式公開資料、印刷pp.52–67（URLは220427、本文の版日付は未確認）',
    checkedAt,
    locator: '印刷p.53（PDFの2ページ目）：表示の単位が100g・100mL・1包装・1食で異なる点。',
    note: '資料だけを実動画の確認とはせず、同一YouTube IDの3:55実画面を別途CUAで確認して、この表示単位の部分のみ照合。旧版の摂取目標や例外を省いた説明は採用しない。',
  },
  {
    id: 'v051-nutrition-sapporo-transcript',
    title: '札幌市：さっぽろ市民の熱中症対策セミナー動画・公式音声文字起こし',
    url: sapporoPage,
    edition: '最終更新2025-07-29の公開Web版',
    checkedAt,
    locator:
      '同一ページのセミナー2動画リンク（3pRqBcn5NPs）と「動画の音声を文字で掲載」、セミナー2オープニング・本編第1段落。',
    note: '公式に同じ動画の音声と明記された文字起こしを実読。水の供給源の区別に限定し、一般例の数値を個別飲水処方に転用しない。',
  },
  {
    id: 'v051-nutrition-caa-leaflet',
    title:
      '消費者庁：食品のパッケージにある栄養成分の表示を活用しよう！～知っていますか？栄養強調表示～',
    url: caaLeaflet,
    edition: '公式公開2ページ資料（URLは20240520、本文の版日付は確認できず）',
    checkedAt,
    locator: 'p.1 栄養強調表示の対象、p.2 1食40gの表示、100mLから500mL・1袋10枚から1枚への換算。',
    note: '公式本文からリンクされたリーフレット2ページを実読し、同名YouTube動画の実画面と照合。全ての強調表示の法的基準を検証したものではない。',
  },
  {
    id: 'v051-nutrition-caa-short-video',
    title: '消費者庁：栄養強調表示の解説動画掲載ページ',
    url: caaPage,
    edition: '公式公開Web版（ページに更新日記載なし）',
    checkedAt,
    locator: '栄養強調表示を紹介する動画の正式タイトルと掲載情報。',
    note: '公式ページの独自プレーヤーとYouTubeの再生・埋め込み状態は別に扱う。',
  },
  {
    id: 'v051-nutrition-clinic-bp',
    title: '蒲田駅前やまだ内科糖尿病・甲状腺クリニック：家庭血圧の正しいはかり方',
    url: clinicPage,
    edition: '2023-03-23公開のお知らせ',
    checkedAt,
    locator: '同一YouTube Shorts QTtmlNR9Kn4へのリンクと、上腕式・安静・測定回数に関する本文。',
    note: '投稿者による動画紹介本文の実読を、映像や全文字幕の確認と混同しない。',
  },
  {
    id: 'v051-nutrition-khan-bmi',
    title: 'Khan Academy: Calculate your own body mass index',
    url: khanPage,
    edition: '公式動画ページ・公開検索索引のVideo transcript（ページ更新日未確認）',
    checkedAt,
    locator:
      '公式ページの検索索引にあるVideo transcriptのBMI計算式。直接ページ本文の取得はできず、索引は現在の同一IDの内容確認の根拠に用いない。',
    note: '当初は候補として保留。別途同一YouTube IDの実画面でW/H²の図を確認した部分のみ、厚生労働省本文へ照合して限定推薦。索引字幕全体や米国の区分は推薦対象外。',
  },
  {
    id: 'v051-nutrition-yokohama-equipment',
    title: '横浜市西区：保健活動推進員向け動画「健康チェック機器の使い方」',
    url: yokohamaPage,
    edition: '最終更新2025-01-07の公開Web版',
    checkedAt,
    locator: '「身長計・体重計（体組成付き）編」の同一YouTube ID ZRF9SjXkqUIへのリンク。',
    note: '公式掲載・正式メタデータのみ確認。機器固有の手順を未視聴のまま一般的測定原理の教材根拠にしない。',
  },
];

function metadata(youtubeId: string, officialPage: string): Video['metadata'] {
  return {
    status: 'confirmed',
    checkedAt,
    method: `YouTube oEmbedの実応答で動画ID・正式タイトル・チャンネルを確認し、公式掲載ページ ${officialPage} と照合（2026-11-05 JST）。再生時間・字幕・内容はこの操作では確認しない。`,
    evidenceUrl: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`,
  };
}
const unconfirmedPlayback: Video['playback'] = {
  status: 'unconfirmed',
  checkedAt: null,
  method: null,
};
const unconfirmedEmbed: NonNullable<Video['embed']> = {
  status: 'unconfirmed',
  checkedAt: null,
  method: null,
};

export const nutritionV051Videos: Video[] = [
  {
    id: 'yt-TfNwhTGV-j0',
    youtubeId: 'TfNwhTGV-j0',
    title: 'これでわかる栄養成分表示! 基本のキ : 消費者庁',
    channel: '消費者庁 / CAA',
    url: 'https://www.youtube.com/watch?v=TfNwhTGV-j0',
    unitIds: ['ex-assess-food-label'],
    objectiveIds: ['ex-assess-food-label-o1'],
    difficulty: '基礎',
    order: 2,
    reason:
      '食品を比べる前に、数値が100g・100mL・1包装・1食のどれを基準にするか確かめる練習に。確認済みのおすすめ範囲は3:55の基準量の図です。',
    metadata: metadata(
      'TfNwhTGV-j0',
      'https://www.caa.go.jp/policies/policy/food_labeling/nutrient_declearation/consumers/movie/movie_01.html',
    ),
    playback: {
      status: 'playable',
      checkedAt,
      method:
        '2026-11-05 JST、CUAで同一YouTube watchの0:00から0:25の時間進行と実映像を確認。表示全長9:48。全編通し再生は未実施。',
    },
    embed: { ...unconfirmedEmbed },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIによるCUA同一動画の実画面の目視と、消費者庁の公式動画プログラム解説資料の実読・照合。本文照合の記録時刻2026-11-05T02:18:03Z（JST11:18:03）。',
      sourceRefs: [
        {
          sourceId: 'v051-nutrition-caa-program',
          locator:
            '印刷p.53（PDF p.2）：100g・100mL・1包装・1食の表示単位と、必ず単位を確認する点。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage:
          '同一YouTube watchの3:55の基準量の図を目視。4:54・5:29・5:53・6:21も担当者が表示したが、この推薦は3:55の表示単位の部分に限定する。音声は未聴取。',
        objectiveIds: ['ex-assess-food-label-o1'],
        findings: [
          '3:55に100g・100mL・1包装・1食という基準量の違いと、飲料Aの100mL・飲料Bの200mLが表示されている。公式資料の印刷p.53の、商品の数値を比較する前に表示単位を確認する説明と照合した。',
        ],
        limitations: [
          'o1全体のうち基準量の確認のみ。ナトリウム換算式、o2の炭水化物内訳と任意表示欠落、o3の強調表示の基準は未確認。',
          '旧版の一般的摂取目標を個人に適用しない。全編・全フレーム・音声・全文字幕・YouTube埋め込みは未確認。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=TfNwhTGV-j0',
            locator: 'CUA実画面3:55、2026-11-05 JST。',
          },
          {
            url: caaProgram,
            locator: '印刷p.53：基準量の単位の違い。実読2026-11-05T02:18:03Zまでに実施。',
          },
        ],
      },
    },
  },
  {
    id: 'yt-3pRqBcn5NPs',
    youtubeId: '3pRqBcn5NPs',
    title: 'さっぽろ市民の熱中症対策セミナー②水分補給の大切さについて学ぶ',
    channel: '札幌市公式チャンネル',
    url: 'https://www.youtube.com/watch?v=3pRqBcn5NPs',
    unitIds: ['ex-assess-hydration'],
    objectiveIds: ['ex-assess-hydration-o1'],
    difficulty: '基礎',
    order: 1,
    reason:
      '飲み水だけの量と、ほかの飲料・食品も含めた水分量を区別するために。おすすめ範囲は公式文字起こしの冒頭部分です。記録の方法と発汗量計算は本文で確認します。',
    metadata: metadata('3pRqBcn5NPs', sapporoPage),
    playback: { ...unconfirmedPlayback },
    embed: { ...unconfirmedEmbed },
    content: {
      status: 'source_checked',
      checkedAt,
      method: `AIによる公式の同一動画音声文字起こしの実読・一次資料照合。確認日時 ${reviewedAt}（JST 2026-11-05）。再生・画面・音声の実見ではない。`,
      sourceRefs: [
        {
          sourceId: 'v051-nutrition-sapporo-transcript',
          locator:
            'セミナー2の公式動画リンクと音声文字起こし：オープニング、本編第1段落の水分供給源。',
        },
        {
          sourceId: 'ex-assess-src-water',
          locator:
            'Meeting your water intake every day：水、他の飲料、水分の多い食品。2026-11-05再読。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript',
        checkedAt,
        coverage:
          '公式ページが同一IDに結び付けたセミナー2の音声全文のうち、オープニング・本編第1段落の供給源の区別のみ。文字起こしに時刻はなく推測でタイムスタンプを付けない。',
        objectiveIds: ['ex-assess-hydration-o1'],
        findings: [
          '飲料から入る水分と食べ物に含まれる水分を分ける説明を、CDCの水・他飲料・水分の多い食品の区別と照合した。飲み水だけを総水分量と見なさないための導入になる。',
        ],
        limitations: [
          '学習目標o1全体のうち供給源の区別のみ。食事記録の品名・調理法・容量の残し方、曜日差、発汗量の計算は確認範囲外。',
          '動画中の日量・損失量・脱水率・飲料比較・身体徴候等はおすすめの確認範囲外。一律の飲水量や疾患の診断へ転用しない。',
          '映像・図の細部・音声・再生・YouTube埋め込みは未確認。全文が専門家レビュー済みという意味ではない。',
        ],
        evidence: [
          {
            url: sapporoPage,
            locator: '「動画の音声を文字で掲載」、同一IDのセミナー2リンク、セミナー2本編第1段落。',
          },
          {
            url: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html',
            locator: 'Meeting your water intake every day（更新2026-03-05）。',
          },
        ],
      },
    },
  },
  {
    id: 'yt-PRH6RXr3Rcc',
    youtubeId: 'PRH6RXr3Rcc',
    title:
      '食品のパッケージにある栄養成分の表示を活用しよう!～知っていますか?栄養強調表示～：消費者庁',
    channel: '消費者庁 / CAA',
    url: 'https://www.youtube.com/watch?v=PRH6RXr3Rcc',
    unitIds: ['ex-assess-food-label'],
    objectiveIds: ['ex-assess-food-label-o1', 'ex-assess-food-label-o3'],
    difficulty: '基礎',
    order: 1,
    reason:
      '強調表示がどの成分について述べるかを限定し、表示の基準量を食べる量へ換算する練習に。ナトリウム換算や表示基準の詳細は本文で確認します。',
    metadata: metadata('PRH6RXr3Rcc', caaPage),
    playback: {
      status: 'playable',
      checkedAt,
      method:
        'CUAで同一YouTube watchを再生し少なくとも6秒までの進行と実映像を確認。全編連続再生は未実施。観察2026-11-05 02:11–02:16 UTC、記録確定2026-11-05T02:16:07Z（JST11:16:07）。',
    },
    embed: { ...unconfirmedEmbed },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIによるCUA主要画面の目視確認と、消費者庁の公式2ページリーフレット・表示解説本文との照合。観察2026-11-05 02:11–02:16 UTC、記録確定2026-11-05T02:16:07Z（JST11:16:07）。',
      sourceRefs: [
        {
          sourceId: 'v051-nutrition-caa-leaflet',
          locator: 'p.1 強調表示の対象、p.2 表示基準量と実際の量への換算図。',
        },
        {
          sourceId: 'ex-assess-src-label-web',
          locator: '栄養強調表示とは：対象栄養成分の含有量を強調する表示。2026-11-05再読。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage:
          '同一YouTube watchで0:20・0:55・1:10の実画面の文字と計算図を目視。ほかの指定位置は推薦の根拠に用いず、全編音声・全フレーム・全文字幕は未確認。',
        objectiveIds: ['ex-assess-food-label-o1', 'ex-assess-food-label-o3'],
        findings: [
          'o3の導入：0:20の成分量について高い・低い等を述べる表示を、公式リーフレットp.1と照合。表示された対象成分に限定して読む。',
          'o1の基準量換算：0:55の1食40gの表示、1:10の100mLから500mL・1袋10枚から1枚への換算を、リーフレットp.2の同じ図と照合した。',
        ],
        limitations: [
          'o1のナトリウムから食塩相当量への換算、o2の炭水化物の内訳・任意表示欠落は未確認で対象外。',
          'o3全体の無添加・ゼロ・低減の個別基準、味覚表示との区別は未確認。栄養強調表示全体の検証済み動画とは扱わない。',
          'YouTube埋め込みは未確認。公式サイトの独自プレーヤーでの再生失敗は、YouTube埋め込み不可という判定には用いない。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=PRH6RXr3Rcc',
            locator:
              'CUA実画面0:20・0:55・1:10。観察2026-11-05 02:11–02:16 UTC、記録確定2026-11-05T02:16:07Z。個別フレームの壁時計は未計測。',
          },
          { url: caaLeaflet, locator: 'p.1 強調表示の対象、p.2 基準量・量換算の図を実読。' },
          { url: caaPage, locator: '公式掲載情報。独自プレーヤーとYouTubeの状態は分離。' },
        ],
      },
    },
  },
  {
    id: 'yt-QTtmlNR9Kn4',
    youtubeId: 'QTtmlNR9Kn4',
    title: '35秒でわかる👀家庭血圧の正しいはかり方',
    channel: '蒲田駅前やまだ内科糖尿病・甲状腺クリニック',
    url: 'https://www.youtube.com/watch?v=QTtmlNR9Kn4',
    unitIds: ['ex-assess-health'],
    objectiveIds: ['ex-assess-health-o3'],
    difficulty: '基礎',
    order: 1,
    reason:
      '家庭血圧の測定前に座って安静にすることと、2回の測定の平均を記録することを短い日本語の実演で確認します。診断や薬の調整は目的に含めません。',
    metadata: metadata('QTtmlNR9Kn4', clinicPage),
    playback: {
      status: 'playable',
      checkedAt,
      method:
        'CUAで同一YouTube watchの30秒から35秒・終了までの時間進行と実映像を確認。全編通し再生は未実施。観察は2026-11-05 02:11–02:16 UTC、レビュー記録確定時刻2026-11-05T02:16:07Z（JST11:16:07）。',
    },
    embed: { ...unconfirmedEmbed },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIによるCUA同一動画の主要画面の目視確認と、日本高血圧学会の一般向け公式測定資料の実読・照合。観察2026-11-05 02:11–02:16 UTC、レビュー記録確定時刻2026-11-05T02:16:07Z（JST11:16:07）。',
      sourceRefs: [
        {
          sourceId: 'ex-assess-src-home-bp',
          locator:
            'p.1 測定前に1〜2分椅子に座ること、1機会原則2回を測定して平均すること。2026-11-05再読。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage:
          'CUAで同一YouTube watchの0:15と0:25の画面文字と座位・機器の実演を目視。0:30の記録場面の詳細と全編の音声は根拠に用いない。',
        objectiveIds: ['ex-assess-health-o3'],
        findings: [
          '0:15の1〜2分椅子に座って安静にする画面文字と座位実演が、日本高血圧学会p.1の測定前の条件と一致する。',
          '0:25の2回目の測定後に平均を求める画面文字が、同資料の1機会原則2回の平均と一致する。都合のよい値だけを選ぶという意味ではない。',
        ],
        limitations: [
          'o3の安静・反復測定の平均の部分のみ。腕やカフの細かな設置、全記録項目、診断閾値、服薬変更、運動可否は確認対象外。診察室測定へ一般化しない。',
          'YouTube埋め込みは未確認。紹介本文の閲読と実映像確認を分けて記録している。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=QTtmlNR9Kn4',
            locator:
              'CUA実画面0:15・0:25。観察は2026-11-05 02:11–02:16 UTC、記録確定2026-11-05T02:16:07Z。個別フレームの壁時計は未計測。',
          },
          {
            url: 'https://www.jpnsh.jp/data/selfmonitoring.pdf',
            locator: 'p.1 家庭血圧の正しいはかり方の座位1〜2分・1機会原則2回と平均。',
          },
          { url: clinicPage, locator: '同一IDへのYouTubeリンクと投稿者の紹介本文。' },
        ],
      },
    },
  },
  {
    id: 'yt-5RXRr8PKunk',
    youtubeId: '5RXRr8PKunk',
    title: 'Calculate your own body mass index | Miscellaneous | Heatlh & Medicine | Khan Academy',
    channel: 'khanacademymedicine',
    url: 'https://www.youtube.com/watch?v=5RXRr8PKunk',
    unitIds: ['ex-assess-bodycomp'],
    objectiveIds: ['ex-assess-bodycomp-o1'],
    difficulty: '基礎',
    order: 1,
    reason:
      '0:44・0:54で体重Wを身長Hの2乗で割る関係を図で確認します。kg・mの単位と計算は教材本文で確認し、米国の単位例・判定区分はこのおすすめ範囲に含めません。',
    metadata: metadata('5RXRr8PKunk', khanPage),
    playback: {
      status: 'playable',
      checkedAt,
      method:
        'CUAで同一YouTube watchの0:00から0:06までの時間進行と実映像を確認。全長表示7:20、全編通し再生は未実施。レビュー記録のUTC時計2026-11-05T02:20:12Z（JST11:20:12）までに観察。',
    },
    embed: { ...unconfirmedEmbed },
    content: {
      status: 'source_checked',
      checkedAt,
      method:
        'AIによるCUA同一動画0:44・0:54の体重W・身長HとW/H²の図の目視確認、厚生労働省本文の式との照合。レビュー記録時計2026-11-05T02:20:12Z（JST11:20:12）。検索索引の字幕は昇格の根拠に用いない。',
      sourceRefs: [
        {
          sourceId: 'ex-assess-src-bmi',
          locator: 'BMI＝体重kg÷身長mの2乗。国による判定区分の違い。2026-11-05再読。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        checkedAt,
        coverage:
          'CUAで同一YouTube watchの0:44・0:54にある体重W・身長HとBMI=W/H²の図を目視。kg・mの文字は画面では確認できず、音声未聴取。1:18の米単位例と後半は推薦対象外。',
        objectiveIds: ['ex-assess-bodycomp-o1'],
        findings: [
          '体重を身長の2乗で割る関係の図解が、厚生労働省のBMIの計算式の関係と整合する。単元o1のうち分子・分母の関係を視覚的に確認する部分のみの推薦である。',
        ],
        limitations: [
          'kg・mを用いる計算手順全体を動画で確認済みとはしない。単位は教材本文で確認する。米単位例、米国のBMI区分、脂肪量・除脂肪量計算は推薦対象外。',
          '全編・全フレーム・音声・現在の字幕全文・YouTube埋め込みは未確認。検索索引の字幕を現在の同一動画の全文確認とは扱わない。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=5RXRr8PKunk',
            locator:
              'CUA実画面0:44・0:54の体重・身長とW/H²の図、2026-11-05 JST。レビュー記録時計2026-11-05T02:20:12Z。',
          },
          {
            url: 'https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-002.html',
            locator: '冒頭のBMI＝体重kg÷身長mの2乗という式と、国による区分の違い。2026-11-05実読。',
          },
        ],
      },
    },
  },
  {
    id: 'yt-ZRF9SjXkqUI',
    youtubeId: 'ZRF9SjXkqUI',
    title: '健康チェック機器の使い方～身長計・体重計（体組成付き）編～',
    channel: 'CityOfYokohama',
    url: 'https://www.youtube.com/watch?v=ZRF9SjXkqUI',
    unitIds: ['ex-assess-bodycomp'],
    objectiveIds: ['ex-assess-bodycomp-o2'],
    difficulty: '基礎',
    order: 2,
    reason:
      '体組成付き機器の使い方を確認するための日本語候補。機器の手順と測定原理・測定の限界の対応は内容未確認です。',
    metadata: metadata('ZRF9SjXkqUI', yokohamaPage),
    playback: { ...unconfirmedPlayback },
    embed: { ...unconfirmedEmbed },
    content: {
      status: 'unreviewed',
      checkedAt: null,
      method: null,
      sourceRefs: [],
      review: {
        decision: 'hold',
        reviewerType: 'ai',
        method: 'unavailable',
        checkedAt,
        coverage: '横浜市公式掲載リンクとYouTube oEmbedの実在メタデータのみ。',
        objectiveIds: ['ex-assess-bodycomp-o2'],
        findings: [
          '公式ページに同一IDが掲載され、正式タイトルとチャンネルを確認した。内容の対応を推測して推薦しない。',
        ],
        limitations: ['映像・字幕・音声・測定原理・機器固有の注意事項・再生・埋め込みは未確認。'],
        evidence: [{ url: yokohamaPage, locator: '身長計・体重計（体組成付き）編の動画リンク。' }],
      },
    },
  },
];
