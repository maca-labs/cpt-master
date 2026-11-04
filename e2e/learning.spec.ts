import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { questions, seedVideos, units } from '../src/content';
import type { Attempt, Session, VideoOverride, VideoProgress } from '../src/domain/types';

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function ready(page: Page, route = '/') {
  await page.goto(`/#${route}`);
  await expect(page.locator('main')).toBeVisible();
}

async function store<T>(page: Page, name: string): Promise<T[]> {
  return page.evaluate(
    (storeName) =>
      new Promise<unknown[]>((resolve, reject) => {
        const request = indexedDB.open('cpt-master');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const rows = database.transaction(storeName, 'readonly').objectStore(storeName).getAll();
          rows.onerror = () => {
            database.close();
            reject(rows.error);
          };
          rows.onsuccess = () => {
            database.close();
            resolve(rows.result);
          };
        };
      }),
    name,
  ) as Promise<T[]>;
}

async function currentQuestion(page: Page) {
  const prompt = await page.locator('.quiz-card h1').innerText();
  const q = questions.find((candidate) => candidate.prompt === prompt);
  expect(q, `Displayed question must be a known curriculum question: ${prompt}`).toBeTruthy();
  return q!;
}

async function choose(page: Page, text: string) {
  // The visible A/B/C prefix changes with shuffled ordering. Match the complete
  // answer text after that prefix, preserving the question's stable choice ID.
  const button = page
    .locator('button.choice')
    .filter({ hasText: new RegExp(`^\\s*[A-D]\\s*${escapePattern(text)}\\s*$`) });
  await expect(button).toHaveCount(1);
  await button.click();
}

async function saveAnswer(page: Page, correct = true, explain = true) {
  const q = await currentQuestion(page);
  const choice = q.choices.find((candidate) =>
    correct ? candidate.id === q.correctChoiceId : candidate.id !== q.correctChoiceId,
  )!;
  await choose(page, choice.text);
  if (explain)
    await page
      .getByRole('checkbox', { name: 'この答えを選ぶ根拠を、自分の言葉で説明できる', exact: true })
      .check();
  await page.getByRole('button', { name: '回答を保存', exact: true }).click();
  await expect(page.locator('.answer-notice')).toBeVisible();
  return q;
}

test('50-question diagnosis leads through a weak unit, external video link, practice and persisted review', async ({
  page,
  context,
}, testInfo) => {
  await ready(page, '/diagnostic');
  await page.getByRole('button', { name: '50問の診断を始める', exact: true }).click();
  for (let index = 0; index < 50; index++) {
    await expect(page.locator('.quiz-top .pill')).toHaveText(`実力診断 · ${index + 1} / 50`);
    const q = await currentQuestion(page);
    await saveAnswer(page, q.domainId !== 'assessment');
    await expect(
      page.getByRole('button', { name: '先に解説を見る（初見評価から除外）', exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole('button', { name: index === 49 ? '結果を見る' : '次の問題へ', exact: true })
      .click();
  }
  await expect(
    page.getByRole('heading', { name: '学ぶ場所が、見えてきました。', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.result-stats')).toContainText('初見 50問');
  const attempts = await store<Attempt>(page, 'attempts');
  expect(attempts).toHaveLength(50);
  expect(attempts.every((answer) => answer.firstSeen)).toBe(true);
  expect(
    attempts
      .filter((answer) => !answer.correct)
      .every((answer) => answer.domainId === 'assessment'),
  ).toBe(true);
  const weak = page.locator('.weak-row').first();
  await expect(weak).toContainText('面談・評価');
  await expect(weak).toContainText('0%');
  const weakUnit = weak.locator('a').first();
  const weakHref = await weakUnit.getAttribute('href');
  await weakUnit.click();
  await expect(page).toHaveURL(new RegExp(`${escapePattern(weakHref!)}$`));
  await expect(
    page.getByRole('heading', { name: 'この単元でできるようになること', exact: true }),
  ).toBeVisible();

  // Verify an actual new-tab navigation request to the saved URL. Deliberately
  // abort external traffic: this does not test video availability or playback.
  const requestedUrls: string[] = [];
  await context.route('https://www.youtube.com/**', (route) => {
    requestedUrls.push(route.request().url());
    return route.abort('failed');
  });
  const external = page.getByRole('link', { name: 'YouTubeで開く', exact: true }).first();
  const videoUrl = await external.getAttribute('href');
  expect(videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/);
  const popupPromise = page.waitForEvent('popup');
  await external.click();
  const popup = await popupPromise;
  await expect.poll(() => requestedUrls).toContain(videoUrl!);
  await popup.close();
  testInfo.annotations.push({
    type: 'scope',
    description:
      'YouTube別タブのURLへの遷移要求のみ検証。外部通信は中止し、再生・動画内容は検証していません。',
  });

  await page.getByRole('button', { name: /^確認問題を解く（\d+問）$/ }).click();
  const practiceQuestion = await saveAnswer(page, true, false);
  await page.getByRole('button', { name: '復習に登録', exact: true }).click();
  await expect(page.getByRole('button', { name: '復習登録済み', exact: true })).toBeVisible();
  await ready(page, '/review');
  const row = page
    .locator('.review-row')
    .filter({ has: page.getByRole('heading', { name: practiceQuestion.prompt, exact: true }) });
  await expect(row).toContainText('手動登録');
  await page.reload();
  await expect(row).toContainText('手動登録');
  const saved = await store<Attempt>(page, 'attempts');
  expect(saved).toHaveLength(51);
  expect(
    saved.find((answer) => answer.questionId === practiceQuestion.id && !answer.canExplain),
  ).toBeTruthy();
});

test('diagnostic reservations stay hidden until skip and previewing an explanation removes first-seen status', async ({
  page,
}) => {
  await ready(page, '/practice');
  await expect(
    page.getByText('診断前の50問は保留しています。先に診断するか、スキップすると利用できます。', {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel(/^学習する単元/).selectOption('safety');
  await page.getByRole('button', { name: '問題演習を始める', exact: true }).click();
  await expect(page).toHaveURL(/#\/session\//);
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  const sessions = await store<Session>(page, 'sessions');
  const reserved = sessions[0];
  expect(reserved.questionIds.length).toBeGreaterThan(0);
  expect(
    reserved.questionIds.every((id) => questions.find((q) => q.id === id)?.pool === 'practice'),
  ).toBe(true);
  const question = await currentQuestion(page);
  await page
    .getByRole('button', { name: '先に解説を見る（初見評価から除外）', exact: true })
    .click();
  await expect(page.locator('.explanation')).toBeVisible();
  await saveAnswer(page);
  await expect(page.locator('.answer-notice')).toContainText('解き直し');
  expect(
    (await store<Attempt>(page, 'attempts')).find((a) => a.questionId === question.id)?.firstSeen,
  ).toBe(false);
  await ready(page, '/diagnostic');
  await page.getByRole('button', { name: '診断をスキップして学ぶ', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '学びを、ひとつずつ。', exact: true }),
  ).toBeVisible();
  await ready(page, '/practice');
  await expect(page.getByText('診断用問題も演習に利用できます。', { exact: true })).toBeVisible();
  await page.getByLabel(/^学習する単元/).selectOption('safety');
  await page.getByRole('button', { name: '問題演習を始める', exact: true }).click();
  await expect(page).toHaveURL(/#\/session\//);
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  const sessionId = page.url().split('/session/')[1];
  const unlocked = (await store<Session>(page, 'sessions')).find((s) => s.id === sessionId)!;
  expect(
    unlocked.questionIds.some((id) => questions.find((q) => q.id === id)?.pool === 'diagnostic'),
  ).toBe(true);
  expect(
    new Set(unlocked.questionIds.map((id) => questions.find((q) => q.id === id)!.groupId)).size,
  ).toBe(unlocked.questionIds.length);
});

test('personal video settings and notes survive reload and JSON restores only after successful validation', async ({
  page,
  browser,
}, testInfo) => {
  await ready(page, '/videos');
  await expect(page.getByText(/編集はこの端末の個人設定です。/)).toBeVisible();
  await page.getByRole('button', { name: '動画を追加', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '個人用の動画を追加', exact: true });
  const videoTitle = '【NO！スポハラ活動】セクシュアル・ハラスメントについて【弁護士が解説】';
  await dialog
    .getByLabel('YouTube URL', { exact: true })
    .fill('https://www.youtube.com/watch?v=qL7C2MzikiU');
  await dialog.getByLabel('正式タイトル', { exact: true }).fill(videoTitle);
  await dialog.getByLabel('チャンネル名', { exact: true }).fill('JSPO -日本スポーツ協会-');
  await dialog
    .getByLabel('何を学ぶために見るか', { exact: true })
    .fill('指導者の倫理に関する補助候補。内容は未審査。');
  const professional = units.find((unit) => unit.id === 'professional')!;
  await dialog.getByRole('checkbox', { name: professional.title, exact: true }).check();
  await dialog.getByRole('button', { name: '個人設定として保存', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const card = page
    .locator('article.video-card')
    .filter({ has: page.getByRole('heading', { name: videoTitle, exact: true }) });
  await expect(card).toContainText('内容未確認の候補');
  await expect(card).toContainText('メタデータ：未確認');
  await card
    .getByRole('textbox', { name: '学習メモ', exact: true })
    .fill('指導前の同意と専門職の境界について確認する。');
  const watched = card.getByRole('checkbox', {
    name: '視聴済みとして記録（習熟度とは別）',
    exact: true,
  });
  await watched.click();
  await expect(watched).toBeChecked();
  await card.getByRole('button', { name: 'メモを保存', exact: true }).click();
  await expect
    .poll(
      async () =>
        (await store<VideoProgress>(page, 'videoProgress')).find(
          (v) => v.note === '指導前の同意と専門職の境界について確認する。',
        )?.watched,
    )
    .toBe(true);
  await page.reload();
  await expect(card.getByRole('textbox', { name: '学習メモ', exact: true })).toHaveValue(
    '指導前の同意と専門職の境界について確認する。',
  );
  await expect(card.getByRole('checkbox')).toBeChecked();
  expect(await store<VideoOverride>(page, 'videoOverrides')).toHaveLength(1);
  expect(seedVideos.some((v) => v.youtubeId === 'qL7C2MzikiU')).toBe(false);
  await ready(page, '/settings');
  await page.getByLabel(/^テーマ/).selectOption('dark');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSONを書き出す', exact: true }).click();
  const download = await downloadPromise;
  const backupPath = testInfo.outputPath('backup.json');
  await download.saveAs(backupPath);
  const backupText = await readFile(backupPath, 'utf8');
  const exported = JSON.parse(backupText);
  expect(exported.data.videoOverrides).toHaveLength(1);
  expect(exported.data.videoProgress).toHaveLength(1);
  const beforeInvalid = await store<VideoProgress>(page, 'videoProgress');
  await page.getByLabel('バックアップJSONを選択', { exact: true }).setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{broken-json'),
  });
  await expect(page.getByRole('alert')).toContainText('JSON');
  await expect(page.getByLabel(/^テーマ/)).toHaveValue('dark');
  expect(await store<VideoProgress>(page, 'videoProgress')).toEqual(beforeInvalid);
  await page.getByRole('button', { name: 'エラーを閉じる', exact: true }).click();
  exported.data.videoProgress[0].videoId = 'missing-video';
  await page.getByLabel('バックアップJSONを選択', { exact: true }).setInputFiles({
    name: 'invalid-reference.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await expect(page.getByRole('alert')).toBeVisible();
  expect(await store<VideoProgress>(page, 'videoProgress')).toEqual(beforeInvalid);
  await expect(
    page.getByRole('heading', { name: '事前検査が完了しました', exact: true }),
  ).toHaveCount(0);

  const cleanContext = await browser.newContext({
    baseURL: 'http://127.0.0.1:5173',
    viewport: testInfo.project.use.viewport,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  });
  try {
    const restored = await cleanContext.newPage();
    await ready(restored, '/settings');
    await restored.getByLabel('バックアップJSONを選択', { exact: true }).setInputFiles(backupPath);
    await expect(
      restored.getByRole('heading', { name: '事前検査が完了しました', exact: true }),
    ).toBeVisible();
    await restored
      .getByRole('checkbox', { name: '内容とマージ方法を確認しました', exact: true })
      .check();
    const preRestoreDownload = restored.waitForEvent('download');
    await restored
      .getByRole('button', { name: '復元前バックアップを保存してマージ', exact: true })
      .click();
    await preRestoreDownload;
    await expect(restored.getByRole('status')).toContainText('復元しました。');
    await ready(restored, '/videos');
    const restoredCard = restored
      .locator('article.video-card')
      .filter({ has: restored.getByRole('heading', { name: videoTitle, exact: true }) });
    await expect(restoredCard.getByRole('textbox', { name: '学習メモ', exact: true })).toHaveValue(
      '指導前の同意と専門職の境界について確認する。',
    );
    await expect(restoredCard.getByRole('checkbox')).toBeChecked();
    expect(await store<VideoOverride>(restored, 'videoOverrides')).toHaveLength(1);
  } finally {
    await cleanContext.close();
  }
});

test('dashboard fits the viewport and captures a reviewable screenshot', async ({
  page,
}, testInfo) => {
  await ready(page);
  await expect(
    page.getByRole('heading', { name: '理解から、指導できる知識へ。', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.stat-card')).toHaveCount(4);
  const size = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(size.content).toBeLessThanOrEqual(size.viewport);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
});
