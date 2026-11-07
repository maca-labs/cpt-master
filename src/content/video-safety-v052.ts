import type { Source, Video } from '../domain/types';
import { videoSafetyV051Additions } from './video-additions-safety-v051';

const checkedAt = '2026-11-08';
const reviewedAt = '2026-11-07T22:26:13Z';
const initialPlaybackCheckedAt = '2026-11-07T22:21:50Z';
const sportsChecklist =
  'https://www.mext.go.jp/sports/content/20260122-spt_kensport01-300000789_18.pdf';
const cprPublication = 'https://www.city.hachioji.tokyo.jp/kurashi/hoken/a7495519/003/p028786.html';
const cprUrl = 'https://www.youtube.com/watch?v=FGYZ8jAsd8c';

export const safetyV052Sources: Source[] = [
  {
    id: 'v052-sports-accident-checklist',
    title: 'スポーツ庁 運動・スポーツ中に チェックリスト（事故発生時の対応）',
    url: sportsChecklist,
    edition: '2026年1月、ガイドライン試行版の付属資料',
    checkedAt,
    locator: 'PDF p.1「事故発生に備えた体制構築と医療との連携」、p.2「熱中症（熱射病）」を実読。',
    note: '日本の運動・スポーツ現場の実務参考資料。責任者・役割・連絡体制、重症熱中症時の救急要請と身体冷却の範囲を照合した。',
  },
];

function priorCandidate(youtubeId: string): Video {
  const candidate = videoSafetyV051Additions.find((video) => video.youtubeId === youtubeId);
  if (!candidate) throw new Error(`v0.5.1の動画候補が見つかりません: ${youtubeId}`);
  return candidate;
}

export const safetyV052Videos: Video[] = [
  {
    ...priorCandidate('gnb28x9tnqo'),
    reason:
      '日本語・限定確認。5:50付近で、主催者・運営者・指導者など立場の異なる関係者が安全対策をつなぐ考え方を学びます。施設ごとの役割と動線の点検は単元本文へ。',
    playback: {
      status: 'playable',
      checkedAt: initialPlaybackCheckedAt,
      method: 'YouTube公式視聴ページで0:02→0:11→0:16の時間進行と実映像を確認。',
    },
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが同一YouTube IDの日本語自動文字起こしと実プレーヤーのテロップを確認し、スポーツ庁の国内資料とNSCAのEAP指針に照合。確認範囲は関係者の連携。',
      sourceRefs: [
        {
          sourceId: 'v052-sports-accident-checklist',
          locator: 'PDF p.1冒頭：安全対策の責任者、役割分担、必要な人員、緊急時の連絡体制。',
        },
        {
          sourceId: 'ex-safe-standards',
          locator: 'PDF p.5 Guideline 5.1：緊急計画の人員と手順を関係者全員が理解する。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript_and_visual',
        coverage:
          '同一IDの4:12〜4:41、4:44〜5:46、5:49〜6:06開始の字幕を確認。5:50・6:07の実テロップで、各立場の安全対策を横につなぐ要点を照合。',
        objectiveIds: ['ex-safe-eap-o1'],
        checkedAt: reviewedAt,
        findings: [
          '大会の安全には、指導者や競技者のほか、主催者・運営者・施設管理者がそれぞれの役割を理解し、相互に連携することが必要だと述べる。国内チェックリストの担当者・役割・連絡体制を整える考え方と一致する。',
          'o1の人員連携の導入に使う。単元本文で夜間の人員、AEDを取り出す方法、救急隊の動線を具体的に点検する。',
        ],
        limitations: [
          '自動文字起こしの誤認識を考慮し、確認したテロップと意味が一致する部分に限定。公式サイトの7:24版の代替テキストと、8:00のYouTube版は別に扱った。',
          '設備保守、救急車の進入経路、事故記録、訓練頻度、法的義務は単元本文と出典を参照。YouTube埋め込み、全編連続の確認、人間の専門家レビューは未実施。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=gnb28x9tnqo&t=350s',
            locator: '5:50の章。YouTube日本語自動文字起こしと5:50・6:07の実テロップ。',
          },
          { url: sportsChecklist, locator: 'PDF p.1冒頭、事故発生に備えた責任者・役割・連絡。' },
        ],
      },
    },
  },
  {
    id: 'yt-FGYZ8jAsd8c',
    youtubeId: 'FGYZ8jAsd8c',
    title: '成人の心肺蘇生(AED使用を含む）',
    channel: '東京消防庁公式チャンネル',
    url: cprUrl,
    unitIds: ['ex-safe-cpr'],
    objectiveIds: ['ex-safe-cpr-o1', 'ex-safe-cpr-o2'],
    difficulty: '基礎',
    order: 1,
    reason:
      '日本語・限定確認。1:00〜1:05の成人胸骨圧迫の深さと速さ、2:45の素肌へのパッド装着を観察します。実技は講習で練習し、最新の手順は市民用指針で確認します。',
    metadata: {
      status: 'confirmed',
      checkedAt,
      method: `八王子市公式の掲載ページ ${cprPublication} のiframeと同一IDのYouTube公式oEmbed、視聴ページの正式タイトル・チャンネル名を照合。`,
      evidenceUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(cprUrl)}&format=json`,
    },
    playback: {
      status: 'playable',
      checkedAt: initialPlaybackCheckedAt,
      method:
        '八王子市掲載のYouTubeプレーヤーで再生操作から0:16までの時間進行と実映像を確認。YouTube視聴ページでも0:00→0:06の進行を確認。',
    },
    embed: {
      status: 'embeddable',
      checkedAt: initialPlaybackCheckedAt,
      method: `八王子市公式ページ ${cprPublication} の同一ID埋め込みで、再生操作後の映像と0:16の経過表示を確認。`,
    },
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが同一IDの実映像と日本語テロップを目視し、日本救急医療財団の改訂7版「救急蘇生法の指針2025 市民用」の該当箇所に照合。',
      sourceRefs: [
        {
          sourceId: 'ex-safe-resuscitation',
          locator: '本文p.26（3）成人の胸骨圧迫の深さとテンポ、pp.33–34 電極パッドの貼り付け。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'visual',
        coverage:
          'YouTube実画面1:00・1:05・2:45の成人訓練人形への胸骨圧迫とAEDパッド装着。確認した実画面だけを現行の国内市民用指針に照合。',
        objectiveIds: ['ex-safe-cpr-o1', 'ex-safe-cpr-o2'],
        checkedAt: reviewedAt,
        findings: [
          '1:00の約5cmの深さ、1:05の毎分100〜120回という成人胸骨圧迫のテロップが、現行市民用指針本文p.26の深さとテンポに一致する。',
          '2:45の人形では電極パッドが胸部の所定位置の素肌へ直接貼られており、現行市民用指針本文pp.33–34の原則に一致する。',
        ],
        limitations: [
          '2021年公開動画の部分確認。圧迫解除・交代、感染症流行時、人工呼吸、濡れや下着への配慮、AEDの機種ごとの音声案内は本文と現行資料を参照。全編の手順の照合、音声の聴取、人間の専門家レビューは未実施。',
          '実技の練習と技能評価は救命講習で行う。ここでは知識の復習と手順の観察に使用する。',
        ],
        evidence: [
          { url: `${cprUrl}&t=60s`, locator: '1:00・1:05の実画面の日本語テロップ。' },
          { url: `${cprUrl}&t=165s`, locator: '2:45の人形の胸部の素肌に貼られた電極パッド。' },
          {
            url: cprPublication,
            locator: '八王子市公式サイトの「成人の心肺蘇生法」同一ID埋め込み。',
          },
        ],
      },
    },
  },
  {
    ...priorCandidate('c8IVgIjC22k'),
    objectiveIds: ['ex-safe-conditions-o1'],
    reason:
      '日本語・限定確認。5:08〜6:37で、重い熱中症が疑われるときに119番通報と全身冷却を並行する判断を学びます。応答異常があれば体温測定を待たず、現行資料と119番の案内に従います。',
    playback: {
      status: 'playable',
      checkedAt: reviewedAt,
      method: 'YouTube公式視聴ページで0:00→0:02への進行と実映像、抽出画面を確認。',
    },
    content: {
      status: 'source_checked',
      checkedAt: reviewedAt,
      method:
        'AIが同一YouTube IDの日本語自動文字起こしと5:15の実画面を確認し、現行の厚生労働省・スポーツ庁の応急処置資料と照合。対象は労作性の重症熱中症が疑われるときの初動。',
      sourceRefs: [
        {
          sourceId: 'v052-sports-accident-checklist',
          locator:
            'PDF p.2「熱中症（熱射病）」：救急要請、速やかな身体冷却、事前に準備する冷却方法の例。',
        },
        {
          sourceId: 'ex-safe-heat',
          locator: '厚生労働省の応急処置：冷却と、自力で飲めない・意識がない場合の即時救急要請。',
        },
        {
          sourceId: 'v051-erca-heat-flow',
          locator:
            '呼びかけへの反応が悪い場合の救急要請、救急車の到着までの冷却、無理な飲水を避ける分岐。',
        },
        {
          sourceId: 'ex-safe-resuscitation',
          locator: '本文pp.21・24：普段どおりの呼吸がない、判断に迷う場合の救命処置。',
        },
      ],
      review: {
        decision: 'recommended',
        reviewerType: 'ai',
        method: 'transcript_and_visual',
        coverage:
          '同一IDの日本語自動文字起こし2:44〜3:02、4:12〜4:29、5:08〜6:37を確認。5:15の実画面で疑いを含む応答異常、119番通報、冷却を並行する説明を再確認。推薦する視聴区間は5:08〜6:37。',
        objectiveIds: ['ex-safe-conditions-o1'],
        checkedAt: reviewedAt,
        findings: [
          '5:15の実画面で応答の鈍さ・異常な言動などがある場合、直ちに119番通報し、同時に冷却を進める指示を確認。4:12〜4:29の疑いで行動する説明とも一致し、40℃の測定結果を待つ手順として扱わない。',
          '6:09〜6:37の字幕では冷水浸漬に事前準備と手順の練習が必要とし、安全に実施できない場合の冷却方法も示す。スポーツ庁の応急処置資料p.2と合わせ、現場で安全にできる冷却を考える。',
        ],
        limitations: [
          '2022年公開動画の部分確認。6:45以降の軽症側の分岐は条件が明瞭でないため推薦範囲外。自力で飲めない場合は厚生労働省の現行資料どおり救急要請を行い、反応が悪いときは無理に飲ませない。',
          '普段どおりの呼吸がない、または判断に迷う場合の心肺蘇生は現行の市民用指針と119番の案内に従う。',
          '回復後の運動復帰、脳振盪、窒息は他の単元資料を参照。埋め込み、音声、全編連続、人間の専門家レビューは未実施。',
        ],
        evidence: [
          {
            url: 'https://www.youtube.com/watch?v=c8IVgIjC22k&t=308s',
            locator: '5:08〜6:37の同一IDの字幕。5:15の実プレーヤー画面とあわせて確認。',
          },
          { url: sportsChecklist, locator: 'PDF p.2、熱中症（熱射病）の初動と冷却。' },
        ],
      },
    },
  },
];
