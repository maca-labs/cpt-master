import type { Source, SourceRef, Video } from '../domain/types';

// Dates are JST review dates; instants are actual UTC sign-off observations.
// Metadata, content, watch playback and embedded playback are independent.
const checkedAt = '2026-11-05';
const reviewedAt = '2026-11-05T02:25:58Z';
const mcMasterPage =
  'https://www.mcmasteroptimalaging.org/watch/detail/videos/2025/09/02/move-better-with-arthritis--simple-exercises-for-your-hips-and-knees';
const mcMasterTranscript =
  'https://www.mcmasteroptimalaging.org/docs/default-source/video-post-handouts/therapeutic-exercises-for-knee-and-hip-oa_transcript_august_2025.pdf?sfvrsn=3111cd6_2';
const hospitalPage = 'https://hosp.ncgm.go.jp/s007/video/index.html';
const ppcPage = 'https://www.ppc.go.jp/movie/';
const sportsPage = 'https://www.mext.go.jp/sports/b_menu/sports/mcatetop05/list/1372002.htm';
const heatPage = 'https://www.erca.go.jp/heatstroke/about/checksheet/input.html';

export const videoSafetyV051Sources: Source[] = [
  {
    id: 'v051-mcmaster-arthritis-transcript',
    title: 'McMaster Optimal Aging Portal: Move better with arthritis — official transcript',
    url: mcMasterTranscript,
    edition: '公式動画2025-09-02掲載、字幕資料の正確性確認日2025-08-28',
    checkedAt,
    locator:
      'PDF pp.1–3の全文を実読。同一公式掲載ページのYouTube ID VS4cEt6wWpkと照合。2:15節の支持物・量の漸増、p.3末尾の専門職への相談。',
    note: '英語。公開字幕の一時読取りのみで本文・映像は保存しない。すべての関節症・術後へ回数、角度、効果量を適用しない。',
  },
  {
    id: 'v051-aaos-arthritis',
    title: 'AAOS OrthoInfo Basics: Arthritis',
    url: 'https://orthoinfo.aaos.org/globalassets/pdfs/arthritis.pdf',
    edition: 'PDF著作権表示2019、確認日の公開版',
    checkedAt,
    locator:
      '印刷p.2 Exercise / Physical therapy、p.3 When should I see my doctor?。運動様式・補助と医療者との計画を実読。',
    note: '運動の一般原則の照合。薬物・手術・角度制限の処方資料として使用しない。',
  },
  {
    id: 'v051-niddk-foot',
    title: 'NIDDK: Diabetes & Foot Problems',
    url: 'https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/foot-problems',
    edition: '本文 Last Reviewed January 2017、確認日の公開版',
    checkedAt,
    locator:
      'How can diabetes affect my feet? / Check your feet every day / Wear shoes and socks at all times / When should I see my health care provider?。本文を実読。',
    note: '痛みの有無だけで傷の有無を判断せず、足を観察・保護し医療チームの管理へつなぐ基本原則に限定。最新の治療・個別荷重の許可を決める資料としない。',
  },
  {
    id: 'v051-ppc-tsusoku',
    title: '個人情報保護委員会：個人情報の保護に関する法律についてのガイドライン（通則編）',
    url: 'https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/',
    edition: '平成28年11月／令和8年6月一部改正、確認日の公開版',
    checkedAt,
    locator: '3-5-2（1）：責任ある立場の者への直ちの報告と被害拡大防止。同節（2）〜（5）も実読。',
    note: '動画の被害拡大防止という基本原則を現行本文と照合。報告対象・期限・例外を動画の確認範囲から推定しない。',
  },
  {
    id: 'v051-ppc-notice',
    title: '個人情報保護委員会：大規模な漏えい等事案を踏まえた対応について（注意喚起）',
    url: 'https://www.ppc.go.jp/files/pdf/261007_houdou.pdf',
    edition: '令和8年10月7日公表',
    checkedAt,
    locator:
      'PDF pp.2–3：手法の例示と見直し予定の位置づけ、p.9（別紙）10-6（5）：早期検知・組織内ネットワークでの被害拡大防止。',
    note: '2027年4月の確定を予定する見直し内容を含む注意喚起。すべての例示を現行法の一律の義務として扱わない。',
  },
  {
    id: 'v051-erca-heat-flow',
    title: '環境再生保全機構：熱中症の応急処置のフローチャート',
    url: heatPage,
    edition: '環境省2025年7月版総論・2022年版を基にした公開Web版',
    checkedAt,
    locator:
      '呼びかけへの反応、自力摂取、救急要請、冷却、対応記録、医療機関への引継ぎの公開本文。実読。',
    note: 'このWeb本文の確認は、リンク先の動画内容を確認したことを意味しない。関連動画は初動の内容確認が未完了のため候補のまま。',
  },
];

const ref = (sourceId: string, locator: string): SourceRef => ({ sourceId, locator });

interface VideoInput {
  id: string;
  title: string;
  channel: string;
  unitId: string;
  objectives: string[];
  discoveryUrl: string;
  reason: string;
  order?: number;
}

function base(input: VideoInput): Video {
  const url = `https://www.youtube.com/watch?v=${input.id}`;
  return {
    id: `yt-${input.id}`,
    youtubeId: input.id,
    title: input.title,
    channel: input.channel,
    url,
    unitIds: [input.unitId],
    objectiveIds: input.objectives,
    difficulty: '基礎',
    order: input.order ?? 1,
    reason: input.reason,
    metadata: {
      status: 'confirmed',
      checkedAt,
      method: `公式掲載元 ${input.discoveryUrl} の実リンク・iframeでIDを同定し、同一IDのYouTube公式oEmbedのtitle・author_nameを取得して照合。内容確認とは別の記録。`,
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    },
    playback: { status: 'unconfirmed', checkedAt: null, method: null },
    embed: { status: 'unconfirmed', checkedAt: null, method: null },
    content: { status: 'unreviewed', checkedAt: null, method: null, sourceRefs: [] },
  };
}

function candidate(input: VideoInput, limitation: string, observed?: string): Video {
  const video = base(input);
  if (observed)
    video.playback = {
      status: 'playable',
      checkedAt: reviewedAt,
      method: observed,
    };
  video.content.review = {
    decision: 'hold',
    reviewerType: 'ai',
    method: 'unavailable',
    coverage: 'メタデータ確認済み。学習目標に沿った内容確認・出典照合は未完了。',
    objectiveIds: input.objectives,
    checkedAt: reviewedAt,
    findings: [
      '実在・正式タイトル・チャンネル・動画IDと公式掲載元の対応を確認。内容未確認の候補として登録。',
    ],
    limitations: [
      limitation,
      '未確認の内容から要約・正答根拠は作成していません。候補の目標IDは確認予定の対応先であり、内容確認済みの範囲ではありません。',
    ],
    evidence: [{ url: input.discoveryUrl, locator: '同一動画IDの公式掲載リンクまたはiframe。' }],
  };
  return video;
}

const arthritis = base({
  id: 'VS4cEt6wWpk',
  title: 'Move better with arthritis: Simple exercises for your hips and knees',
  channel: 'McMaster Optimal Aging Portal',
  unitId: 'ex-plan-orthopedic',
  objectives: ['ex-plan-orthopedic-o1', 'ex-plan-orthopedic-o3'],
  discoveryUrl: mcMasterPage,
  reason:
    '英語・限定確認。安定した関節症で支持物や運動量を調整する考え方、初めての運動や不明点を医療者へ相談する部分を学びます。個別の角度・回数の処方は本文へ。',
});
arthritis.content = {
  status: 'source_checked',
  checkedAt: reviewedAt,
  method:
    'AIが同一IDに公式ページで結び付けられた公式全文字幕PDFを実読し、AAOSの一次資料と照合。映像・音声・再生・埋め込みの確認は未実施。人間の専門家レビューではありません。',
  sourceRefs: [
    ref(
      'v051-mcmaster-arthritis-transcript',
      '2:15節：カウンター等の支持と初心者・増悪時の量調整／PDF p.3末尾：医師・理学療法士への相談。',
    ),
    ref('v051-aaos-arthritis', '印刷p.2 Exercise / Physical therapy、p.3医師との相談。'),
  ],
  review: {
    decision: 'recommended',
    reviewerType: 'ai',
    method: 'transcript',
    checkedAt: reviewedAt,
    objectiveIds: arthritis.objectiveIds,
    coverage:
      '公式字幕PDF全3頁を実読。同一ID VS4cEt6wWpkを公式掲載ページのiframe・字幕リンクで確認。推薦するのは2:15節の支持と量の調整、およびp.3末尾の相談という部分目標のみ。末尾の正確な動画時刻は資料に記載がなく推測しない。',
    findings: [
      '立位練習で支持物を使うこと、初めて・状態変動時には量を減らして段階的に増やす説明を確認。AAOSの運動様式・専門職による調整の原則と整合する。',
      '初めて運動する場合や運動量が不明な場合に医療者・理学療法士へ相談する説明を確認。o3の医療連携部分だけを対象とし、慢性腰痛の多面的支援まで確認したとはしない。',
    ],
    limitations: [
      '英語の公式字幕による限定レビュー。実映像・音声、再生・埋め込み、人間の専門家レビューは未実施。',
      '動画にある股関節角度、回数・頻度、GLADプログラムの結果を、すべての関節症・術後・骨折・骨粗鬆症へ一般化しない。これらは推薦・問題の根拠に採用しない。',
      '個別の運動処方や治療の代替ではありません。術後荷重、骨折、骨粗鬆症、腰痛の全目標は未対応。',
    ],
    evidence: [
      {
        url: mcMasterPage,
        locator: '同一YouTube IDの公式掲載iframeとDownload the transcriptリンク。',
      },
      {
        url: mcMasterTranscript,
        locator: '2:15節／PDF p.3末尾。公開字幕を一時的に読取り、本文を保存・転載していない。',
      },
    ],
  },
};

const footCare = base({
  id: 'l-TmtVx-MR4',
  title: '足、見てますか？～糖尿病のフットケア～',
  channel: 'JIHS_国立健康危機管理研究機構',
  unitId: 'ex-plan-metabolic',
  objectives: ['ex-plan-metabolic-o2'],
  discoveryUrl: hospitalPage,
  reason:
    '日本語・限定確認。神経障害で傷に気づきにくいこと、足の観察と保護を、運動前の足の条件確認へつなげます。眼の合併症や具体的な荷重許可は本文と医療者の指示へ。',
});
footCare.playback = {
  status: 'unconfirmed',
  checkedAt: null,
  method: null,
};
footCare.content = {
  status: 'source_checked',
  checkedAt: reviewedAt,
  method:
    'AIが同一動画の実プレーヤー主要画面と日本語説明を目視し、NIDDKの一次資料の該当部分と照合。人間の専門家レビューではありません。',
  sourceRefs: [
    ref(
      'v051-niddk-foot',
      'How can diabetes affect my feet?／Check your feet every day／Wear shoes and socks at all times。',
    ),
  ],
  review: {
    decision: 'recommended',
    reviewerType: 'ai',
    method: 'visual',
    checkedAt: reviewedAt,
    objectiveIds: footCare.objectiveIds,
    coverage:
      'YouTube視聴ページの0:40、2:00、2:41、5:22、6:02の画面を実観察。推薦するのは0:40の神経障害による傷の発見遅延と、2:00の足の観察・正しい靴による保護の原則のみ。',
    findings: [
      '0:40画面の「痛みを感じにくく傷に気づきにくい」という説明は、NIDDKの感覚低下により傷を自覚しない可能性の説明と整合する。痛みがないだけで安全としない根拠の補助になる。',
      '2:00画面に足の観察と靴を選び正しく履くという保護の説明を確認。NIDDKの足の日々の確認・保護と整合する。足の合併症に応じた運動前確認という部分目標へ限定する。',
    ],
    limitations: [
      '主要画面の限定レビュー。全編連続の映像、音声、人間の専門家レビューは未実施。埋め込み再生は未確認。',
      '再生中表示0:04と抽出画面を実観察（表示全長6:43）。時間の連続増加を別記録できなかったため再生確認は未確認のまま。観察後の実取得時計は2026-11-05T02:23:33Z。',
      '眼の合併症、糖尿病薬・インスリン調整、低血糖対策、潰瘍のある足への個別荷重許可は確認対象外。足の写真からトレーナーが病変を診断しない。',
      '洗浄・爪処置・温熱機器等の具体手順は推薦範囲に採用せず、治療や医療的フットケアを代替しない。',
    ],
    evidence: [
      {
        url: footCare.url,
        locator: '0:40・2:00の実プレーヤー画面。その他の抽出画面を全編確認と扱わない。',
      },
      {
        url: hospitalPage,
        locator: '糖尿病内分泌代謝科の動画「足、見てますか？～糖尿病のフットケア～」同一ID。',
      },
    ],
  },
};

const privacy = base({
  id: 'olFQYhqS9Cw',
  title: '大規模な漏えい等事案を踏まえた対応について（注意喚起） の解説動画',
  channel: '個人情報保護委員会チャンネル',
  unitId: 'ex-safe-privacy',
  objectives: ['ex-safe-privacy-o3'],
  discoveryUrl: ppcPage,
  reason:
    '日本語・限定確認。16:44付近の早期検知・被害拡大防止の画面を、漏えいのおそれへの初動の補助として見ます。2027年の見直し予定案を現行義務と混同しないでください。',
});
privacy.playback = {
  status: 'playable',
  checkedAt: '2026-11-05T02:21:42Z',
  method:
    '同一IDのYouTube視聴ページで冒頭0:01から0:08への経過時間の増加と実スライドを確認し、一時停止して後半画面を目視。全編連続・音声の聴取は未実施。',
};
privacy.content = {
  status: 'source_checked',
  checkedAt: reviewedAt,
  method:
    'AIが実プレーヤー主要画面を目視し、動画の公式注意喚起PDFと現行通則編3-5-2（1）を実読して照合。将来の見直し案の法的位置づけを区別。人間の専門家レビューではありません。',
  sourceRefs: [
    ref(
      'v051-ppc-tsusoku',
      '3-5-2（1）：被害拡大防止の原則。内部報告は本文で学び、動画確認済みの範囲に含めない。',
    ),
    ref(
      'v051-ppc-notice',
      'PDF p.9（別紙）10-6（5）：検知と被害拡大防止の手法例／pp.2–3：見直し予定・例示の位置づけ。',
    ),
  ],
  review: {
    decision: 'recommended',
    reviewerType: 'ai',
    method: 'visual',
    checkedAt: reviewedAt,
    objectiveIds: privacy.objectiveIds,
    coverage:
      '実プレーヤー10:00、14:30、16:44、17:14のスライドを目視。推薦するのは16:44・17:14に示された早期検知と、疑われる情報システムの停止・隔離等による被害拡大防止という部分だけ。',
    findings: [
      '実画面の（別紙）10-6（5）に早期検知と組織内ネットワークでの被害拡大防止を確認。公式PDFの同箇所と一致。',
      '被害拡大防止の基本原則は現行通則編3-5-2（1）とも整合する。適切な隔離等は責任者・専門担当と連携して行い、証拠の削除や独断での一律の停止を勧める内容へ変換しない。',
    ],
    limitations: [
      '主要画面の限定レビュー。音声、全編連続、人間の専門家レビューは未実施。埋め込みは未確認。文字起こしの表示は読み込みが完了せず使用していない。',
      '注意喚起は2027年4月に確定を予定する技術的安全管理措置の見直し案を含む。手法の例示すべてが、確認日現在の一律の法的義務という意味ではない。',
      'o3のうち被害拡大防止部分のみ。内部報告、PPC報告の対象・期限、本人通知、影響範囲調査、委託・第三者提供の全条件を動画で確認したとは扱わない。',
    ],
    evidence: [
      {
        url: privacy.url,
        locator: '実画面16:44・17:14：（別紙）10-6（5）不正アクセス等の検知等。',
      },
      {
        url: 'https://www.ppc.go.jp/files/pdf/261007_houdou.pdf',
        locator: '動画の展開済み説明欄にある同一注意喚起PDFのリンク。',
      },
    ],
  },
};

export const videoSafetyV051Additions: Video[] = [
  arthritis,
  footCare,
  privacy,
  candidate(
    {
      id: 'naxwLgfB644',
      title: 'ロコモ対策　千葉大学山口先生',
      channel: 'ロコモチャンネル',
      unitId: 'ex-plan-age',
      objectives: ['ex-plan-age-o2', 'ex-plan-age-o3'],
      discoveryUrl: 'https://locomo-joa.jp/project/locomochannel',
      reason:
        '未確認候補。高齢者の筋力・バランスと支持のある動作を学べるか、千葉大学整形外科の掲載動画を確認する予定です。',
    },
    '日本整形外科学会公式掲載とメタデータのみ確認。実演、支持条件、対象者、回数・負荷、体調不良時の扱いの確認と出典照合が未完了。',
  ),
  candidate(
    {
      id: 'qXy9g8p0ueY',
      title: 'Pregnancy fitness and exercises | Sitting',
      channel: 'University College London Hospitals NHS Foundation Trust',
      unitId: 'ex-plan-pregnancy',
      objectives: ['ex-plan-pregnancy-o2'],
      discoveryUrl:
        'https://www.uclh.nhs.uk/our-services/find-service/womens-health-1/maternity-services/your-pregnancy/pregnancy-fit-tips',
      reason:
        '英語・未確認候補。妊娠中の座位と姿勢の調整を学べるか、NHS病院の掲載動画を確認する予定です。',
    },
    '実在と公式掲載のみ確認。妊娠週数、禁忌・中止徴候、医療者の個別条件と実演内容の照合が未完了。座位だから一律に安全とは判断しない。',
  ),
  candidate(
    {
      id: 'gnb28x9tnqo',
      title: '【原晋監督インタビュー】スポーツの安全を守るために必要なこと',
      channel: '政府広報オンライン',
      unitId: 'ex-safe-eap',
      objectives: ['ex-safe-eap-o1'],
      discoveryUrl: sportsPage,
      reason:
        '日本語・未確認候補。スポーツの安全対策と役割分担を、EAPの点検に結び付けられるか確認する予定です。',
    },
    '視聴ページと冒頭の実プレーヤーは開けたが主要説明の確認前にブラウザーの専用タブ操作が終了。ガイドライン本文の紹介だけで動画内容確認済みにしない。',
  ),
  candidate(
    {
      id: 'oeaGnNrgzIw',
      title: '心肺停止',
      channel: '救急蘇生・災害医療学研究室-広報用',
      unitId: 'ex-safe-cpr',
      objectives: ['ex-safe-cpr-o1', 'ex-safe-cpr-o2', 'ex-safe-cpr-o3'],
      discoveryUrl: heatPage,
      reason:
        '日本語・未確認候補。環境再生保全機構の応急処置ページに掲載された心肺停止時の動画。実技手順の照合を終えるまで候補です。',
    },
    '実在・公式掲載のみ確認。成人の圧迫、AED手順、最新版指針との整合は未確認。視聴をCPR/AED実技講習・技能評価・認定条件の代替にしない。',
  ),
  candidate(
    {
      id: 'C0wj1SmIBr0',
      title: '意識なし、医療機関へ',
      channel: '救急蘇生・災害医療学研究室-広報用',
      unitId: 'ex-safe-conditions',
      objectives: ['ex-safe-conditions-o1'],
      discoveryUrl: heatPage,
      reason:
        '日本語・未確認候補。高齢者の屋内熱中症の発見から救急隊到着までを扱う公式掲載動画。救急要請と冷却の説明は確認待ちです。',
    },
    '360度動画の冒頭場面のみ確認。救急要請、呼吸の評価、飲水可否、冷却の実演を照合できていない。掲載フロー本文を読んだことと動画内容の確認を区別。',
    '同一IDのYouTube視聴ページで0:00から0:17への進行と実映像を確認（表示全長7:30）。全編・音声・主要処置は未確認。',
  ),
  candidate(
    {
      id: 'c8IVgIjC22k',
      title: 'スポーツにおける熱中症　対策＆対処法編',
      channel: 'スポーツ庁',
      unitId: 'ex-safe-conditions',
      objectives: ['ex-safe-conditions-o1', 'ex-safe-conditions-o3'],
      discoveryUrl: 'https://anzenkyouiku.mext.go.jp/heatillness/data/r06/240822kyuugyoubiake.pdf',
      reason:
        '日本語・確認保留。スポーツ中の熱中症の冷却と復帰判断を扱うか確認した候補。重要な初動全体の照合を終えるまでおすすめにしません。',
      order: 2,
    },
    '4:00の深部体温を含む重症説明、6:30の冷却、7:30の当日参加しない説明を抽出目視したが、119番通報の優先順位と40℃を待たない判断の文脈を確認できていない。部分画面の確認のみで安全な初動を承認しない。',
    '同一IDのYouTube視聴ページで0:00から0:04への進行と実映像を確認（表示全長8:28）。全編・音声は未確認。',
  ),
];
