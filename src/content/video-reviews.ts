import type { Source, SourceRef, Video, VideoContentReview } from '../domain/types';
import {
  scienceVideoSources,
  scienceVideoReviews,
  scienceVideoSourceRefs,
  scienceVideoReasons,
} from './video-review-science';
import {
  careVideoSources,
  careVideoReviews,
  careVideoSourceRefs,
  careVideoReasons,
} from './video-review-care';

export const videoCatalogVersion = '2026-11-04.3';
export const videoReviewSources: Source[] = [
  ...scienceVideoSources,
  ...careVideoSources,
  {
    id: 'video-nsca-backsquat-article',
    title: 'NSCAジャパン：動画でトレーニング紹介「バックスクワット」',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1106/',
    edition: '2024-06-21公開記事',
    checkedAt: '2026-11-04',
    locator: '注意ポイント1–3（開始姿勢）、4–6（下降）、7–8（上昇）、直後の安全に関する注記2項',
    note: '同じ動画IDを掲載する本文を全文実読。映像のテロップと照合し、有資格指導者・セーフティーバー・補助者についての本文の補足も確認。',
  },
  {
    id: 'video-nsca-backsquat-wl',
    title: 'NSCAジャパン：バックスクワット（パラレル）種目説明・WL実技検定',
    url: 'https://nsca-japan.or.jp/pdf/education/wl-test/wl_test_basic_backsquat.pdf',
    edition: '公式公開PDF（版・改訂日の記載なし）',
    checkedAt: '2026-11-04',
    locator: 'PDF・印刷pp.1–4、特にp.2開始姿勢の注、p.3下ろす動作の注、p.4上げる動作',
    note: '全4頁のテキストを実読。検定のパラレル条件と実指導時の個別可動域を区別する根拠。個人へ同じ深さを一律に処方しない。',
  },
  {
    id: 'video-hk-workout',
    title: 'Human Kinetics: How to design a complete training program',
    url: 'https://us.humankinetics.com/blogs/strength-conditioning-fitness/how-to-design-a-complete-training-program',
    edition: '2023年2月公開の動画掲載記事',
    checkedAt: '2026-11-04',
    locator: '同ID動画の埋め込みと、その直下の概要本文',
    note: '概要本文は実読したが、正式な台本ではない。動画のパワー定義・休息数値の発言を確定する根拠には使わない。',
  },
  {
    id: 'video-jspo-ethics',
    title: '日本スポーツ協会：スポーツ指導者のための倫理ガイドライン',
    url: 'https://www.japan-sports.or.jp/Portals/0/rinri_gidelines.pdf',
    edition: '公開PDF（平成30年7月18日会長メッセージ。発行版未確認）',
    checkedAt: '2026-11-04',
    locator:
      'PDF pp.15–16：Ⅳ1 倫理的問題が生じやすい構造的要因／Ⅳ2 表面化しにくい倫理的問題への対応',
  },
  {
    id: 'video-jspo-handbook1',
    title: '日本スポーツ協会：女性スポーツ促進に向けたスポーツ指導者ハンドブック1',
    url: 'https://www.japan-sports.or.jp/Portals/0/data/supotsu/doc/womensport/womensportsbook01.pdf',
    edition: '平成30年度スポーツ庁委託事業（表紙記載。詳細版未確認）',
    checkedAt: '2026-11-04',
    locator: '本文p.17 / PDFp.18：3 女性スポーツにおけるハラスメント、1 ハラスメントの考え方',
  },
  {
    id: 'video-nsca-power',
    title: 'NSCAジャパン：パワーについて考えてみましょう！',
    url: 'https://park.nsca-japan.or.jp/category-13/post-1921/',
    edition: '2024-09-27公開記事',
    checkedAt: '2026-11-04',
    locator: 'パワーの定義（仕事量を時間で割ったもの）',
  },
  {
    id: 'video-jrc-2025',
    title: '日本蘇生協議会：JRC蘇生ガイドライン2025 書籍版発刊告知',
    url: 'https://www.jrc-cpr.org/2026/07/11/jrc2025-3/',
    edition: '2026-07-11告知（2026-07-13発刊）',
    checkedAt: '2026-11-04',
    locator: '2025書籍版の発刊告知。手順本文は含まないため、この告知を改訂差分の比較には使わない。',
  },
];

const checkedAt = '2026-11-04';
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const videoReviews: Record<string, VideoContentReview> = {
  ...scienceVideoReviews,
  ...careVideoReviews,
  hdtWEM3Oqwc: {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '前回取得した英語自動字幕0:00–22:26を全行再読し、公式掲載記事の概要本文とNSCA資料も照合。今回の字幕再取得は不可。4:45の実画面も確認したが、発言を確定する数式・板書は確認できなかった。音声の実聴・映像全編の確認ではない。',
    objectiveIds: ['program-o3'],
    checkedAt,
    findings: [
      '週日程・目標に合わせた分割やプログラム構成の説明は学習目標に関連する。',
      '4:45–4:53の字幕におけるパワーの定義は、仕事との混同または自動字幕の誤認の疑いがある。NSCA資料との照合だけでは原因を確定できない。',
      '16:49–16:56の休息値は字幕が不明瞭で確定できない。',
      '同じ動画を掲載するHuman Kineticsの2記事は概要で、疑義を解消する正式台本ではない。比較資料から発言を逆算して補完しない。',
    ],
    limitations: [
      '字幕の不明点を音声で解消できていないため、おすすめにはしない。動画の発言自体が誤りであるとは断定しない。',
      '日本語字幕、全編の再生・音声・図表・実演、人間の専門家レビューは未確認。疑義箇所の画面を開いたことを全編の確認とは扱わない。',
    ],
    evidence: [
      {
        url: watch('hdtWEM3Oqwc'),
        locator: '取得した英語自動字幕0:00–22:26。照合保留箇所4:45–4:53、16:49–16:56。',
      },
      {
        url: 'https://park.nsca-japan.or.jp/category-13/post-1921/',
        locator: 'パワーの定義。字幕の発言内容を確定する根拠には使わない。',
      },
      {
        url: 'https://us.humankinetics.com/blogs/strength-conditioning-fitness/how-to-design-a-complete-training-program',
        locator: '同IDの動画と概要本文。正式台本や数値表ではない。',
      },
      {
        url: 'https://us.humankinetics.com/blogs/learning-with-hk/how-to-design-a-complete-training-program',
        locator: '同ID動画の別の公式掲載記事の概要本文。発言の疑義は解消しなかった。',
      },
    ],
  },
  fIvDJoyVgRQ: {
    decision: 'recommended',
    reviewerType: 'ai',
    method: 'visual',
    coverage:
      '1:09の公開動画をブラウザーで一部実再生し、0:05・0:15・0:25・0:28・0:35・0:45・0:55・1:05の主要画面を視覚確認。開始姿勢・下降・上昇の焼き付けテロップと実演を、同IDの公式掲載記事および公式実技検定資料とAIが照合した。全フレームの通覧・音声の実聴ではない。',
    objectiveIds: ['technique-o4'],
    checkedAt,
    findings: [
      '開始姿勢のハイバーポジション、握り・足幅・つま先方向、下降時の姿勢と膝の方向、上昇時の足裏接地・股関節と膝の伸展という表示を確認。同IDを掲載する公式記事の注意ポイント1–8と対応する。',
      '側面・正面の実演で開始姿勢、下降・上昇の主要な姿勢を確認。個人の実施動作を評価した結果でも、全フレームのフォームを保証する確認でもない。',
      'パラレルまで下ろす表示は実施例として扱う。公式検定資料p.3の注は実指導では柔軟性・筋力に応じて調整し、不適切な姿勢になる前に切り替えると補足している。単元本文へ同じ条件を追加した。',
      '映像に安全条件がすべて明示されるとは扱わず、公式記事の有資格指導者・セーフティーバー・補助者の注記を教材に併記する。',
    ],
    limitations: [
      'technique-o4の開始姿勢と動作制御を観察する限定的なおすすめ。音声・全フレーム・実施者個人の負荷設定・全種目の安全性は確認していない。人間の専門家レビューは未実施。',
      '動画の深さ・重量・足幅を全員に一律に再現させない。可動域を個別に決め、実施前にセーフティー設定と補助の条件を確認する。初めての実施は有資格指導者に教わる。',
      'YouTubeの通常ページで一部実再生とシーク表示を確認した。アプリ内の埋め込み再生は未確認。',
    ],
    evidence: [
      {
        url: watch('fIvDJoyVgRQ'),
        locator:
          '通常プレーヤーの実再生と主要画面。0:05/0:15開始姿勢、0:25/0:28/0:35下降、0:45/0:55上昇、1:05終盤。字幕本文は取得不可。',
      },
      {
        url: 'https://park.nsca-japan.or.jp/category-13/post-1106/',
        locator: '同IDの動画埋め込み、本文全文の注意ポイント1–8と直後の安全に関する注記2項。',
      },
      {
        url: 'https://nsca-japan.or.jp/pdf/education/wl-test/wl_test_basic_backsquat.pdf',
        locator: '全4頁のテキスト。p.2開始姿勢と個別調整、p.3下降・個別可動域の注、p.4上昇。',
      },
    ],
  },
  XBkaAAwyS4s: {
    decision: 'recommended',
    reviewerType: 'ai',
    method: 'transcript',
    coverage:
      '取得した日本語自動字幕0:05–4:31を全行読み、ハラスメントの構造・力関係・拒否しにくさという説明を一次資料と照合。字幕による言語内容の確認に限定する。',
    objectiveIds: ['professional-o4'],
    checkedAt,
    findings: [
      '勝利・成果の優先、指導者と競技者の力関係、問題の隠蔽や負の連鎖の説明は、JSPO倫理ガイドラインの構造的要因・問題の表面化しにくさと整合。',
      'ハラスメントの捉え方と相手が拒否しにくい状況の説明は、JSPOハンドブックの該当節と照合できた。',
      '明白な自動字幕の表記誤りは公式資料の対応する語句・文脈から確認し、字幕をそのまま教材本文として転載していない。',
    ],
    limitations: [
      'AIによる字幕と一次資料の照合であり、人間の専門家による監修ではない。',
      '音声の実聴、映像に含まれる統計グラフ・図表、埋め込み可否の通し確認は未実施。',
      '個別行為の法的結論、守秘義務全般、資格試験の全範囲を説明する動画としては推薦しない。',
    ],
    evidence: [
      {
        url: watch('XBkaAAwyS4s'),
        locator: '取得した日本語自動字幕0:05–4:31。主な照合箇所2:21–3:32、4:01–4:28。',
      },
      {
        url: 'https://www.japan-sports.or.jp/Portals/0/rinri_gidelines.pdf',
        locator: 'PDF pp.15–16：構造的要因、表面化しにくい問題。',
      },
      {
        url: 'https://www.japan-sports.or.jp/Portals/0/data/supotsu/doc/womensport/womensportsbook01.pdf',
        locator: '本文p.17 / PDFp.18：ハラスメントの考え方。',
      },
    ],
  },
};

// References document both completed reviews and investigations that remain on hold.
// Presence of a reference does not promote a candidate to source_checked.
export const videoContentSourceRefs: Record<string, SourceRef[]> = {
  ...scienceVideoSourceRefs,
  ...careVideoSourceRefs,
  fIvDJoyVgRQ: [
    {
      sourceId: 'video-nsca-backsquat-article',
      locator: '注意ポイント1–8と、安全設定・有資格指導者・補助者についての注記。',
    },
    {
      sourceId: 'video-nsca-backsquat-wl',
      locator: 'pp.2–4。特にp.3の検定の深さと実指導の個別可動域を区別する注。',
    },
  ],
  hdtWEM3Oqwc: [
    {
      sourceId: 'video-nsca-power',
      locator: 'パワーの定義。字幕の疑義を検討した比較資料で、発言の確定には使わない。',
    },
    {
      sourceId: 'video-hk-workout',
      locator: '同IDの掲載動画と概要本文。正式台本は得られず、定義と休息値は保留。',
    },
    {
      sourceId: 'applied-rest',
      locator: 'PTQ 10.1 (2023) p.20、休息時間の比較資料。動画の発言を確定する資料ではない。',
    },
  ],
  XBkaAAwyS4s: [
    { sourceId: 'video-jspo-ethics', locator: 'PDF pp.15–16：構造的要因、表面化しにくい問題。' },
    { sourceId: 'video-jspo-handbook1', locator: '本文p.17 / PDFp.18：ハラスメントの考え方。' },
  ],
};

export const videoReviewReasons: Record<string, string> = {
  ...scienceVideoReasons,
  ...careVideoReasons,
  fIvDJoyVgRQ:
    '開始姿勢・下降・上昇を観察する限定的なおすすめ。主要画面とテロップをNSCA公式資料とAIが照合しました。音声・全フレームは未確認です。深さは個人に合わせ、安全設定と補助の条件を確認してください。',
  hdtWEM3Oqwc:
    '週日程・目標に応じた計画の補助候補。英語自動字幕と公式概要を再確認しましたが、定義や休息値の疑義を解消できず、推薦は保留しています。',
  XBkaAAwyS4s:
    'ハラスメントが生じやすい力関係と、相手が拒否しにくい状況への配慮を学ぶためのおすすめ。日本語の自動字幕をJSPOの一次資料とAIが照合しました。音声・図表は未確認です。',
};

export const videoPlaybackChecks: Record<string, Video['playback']> = {
  fIvDJoyVgRQ: {
    status: 'playable',
    checkedAt,
    method:
      '通常のYouTubeプレーヤーで一部実再生し、0:05–1:05の主要時点へシークした画面を確認。全編の連続再生・音声の実聴・アプリ内の埋め込み可否は未確認。',
  },
};
