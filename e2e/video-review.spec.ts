import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { seedVideos, units } from '../src/content';
import { validateBackup } from '../src/storage/db';

const jspo = seedVideos.find((video) => video.youtubeId === 'XBkaAAwyS4s')!;
const squat = seedVideos.find((video) => video.youtubeId === 'fIvDJoyVgRQ')!;
const program = seedVideos.find((video) => video.youtubeId === 'hdtWEM3Oqwc')!;
const cpr = seedVideos.find((video) => video.youtubeId === 'NGNaD_UY-A4')!;

async function open(page: Page, route: string) {
  await page.goto(`/#${route}`);
  await expect(page.locator('main')).toBeVisible();
}

function videoCard(page: Page, title: string) {
  return page
    .locator('article.video-card')
    .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
}

async function checkedExport(page: Page, testInfo: TestInfo, name: string) {
  await open(page, '/settings');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSONを書き出す', exact: true }).click();
  const download = await pending;
  const path = testInfo.outputPath(name);
  await download.saveAs(path);
  return validateBackup(await readFile(path, 'utf8'));
}

test('recommendation filter separates JSPO transcript and squat visual reviews from held candidates', async ({
  page,
}, testInfo) => {
  await open(page, '/videos');
  await expect(page.getByRole('button', { name: 'おすすめ 2本', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '候補・確認保留 8本', exact: true })).toBeVisible();
  await expect(page.locator('article.video-card')).toHaveCount(10);
  await page.getByRole('button', { name: 'おすすめ 2本', exact: true }).click();
  await expect(page.locator('article.video-card')).toHaveCount(2);
  const card = videoCard(page, jspo.title);
  await expect(card.getByText('おすすめ · AIによる字幕照合', { exact: true })).toBeVisible();
  await card.locator('summary').click();
  const details = card.locator('details');
  await expect(details).toContainText('AIによる確認');
  await expect(details).toContainText('0:05–4:31');
  await expect(details).toContainText('音声の実聴');
  await expect(details).toContainText('統計グラフ・図表');
  await expect(details).toContainText('未実施');
  await expect(details).toContainText('人間の専門家');
  await expect(
    details.getByRole('link', {
      name: '日本スポーツ協会：スポーツ指導者のための倫理ガイドライン',
      exact: true,
    }),
  ).toHaveAttribute('href', 'https://www.japan-sports.or.jp/Portals/0/rinri_gidelines.pdf');
  await expect(
    details.getByRole('link', {
      name: '日本スポーツ協会：女性スポーツ促進に向けたスポーツ指導者ハンドブック1',
      exact: true,
    }),
  ).toHaveAttribute(
    'href',
    'https://www.japan-sports.or.jp/Portals/0/data/supotsu/doc/womensport/womensportsbook01.pdf',
  );
  await expect(card).toContainText('再生：未確認');
  const visual = videoCard(page, squat.title);
  await expect(visual.getByText('おすすめ · AIによる映像照合', { exact: true })).toBeVisible();
  await visual.locator('summary').click();
  const visualDetails = visual.locator('details');
  await expect(visualDetails).toContainText('AIによる確認');
  await expect(visualDetails).toContainText('0:05');
  await expect(visualDetails).toContainText('1:05');
  await expect(visualDetails).toContainText('全フレーム');
  await expect(visualDetails).toContainText(/音声/);
  await expect(visualDetails).toContainText(/未聴取|聴いていない|未確認/);
  await expect(visualDetails).toContainText(/埋め込|埋込/);
  await expect(visualDetails).toContainText('人間の専門家');
  await expect(
    visualDetails.locator('a[href="https://park.nsca-japan.or.jp/category-13/post-1106/"]').first(),
  ).toBeVisible();
  await expect(
    visualDetails
      .locator(
        'a[href="https://nsca-japan.or.jp/pdf/education/wl-test/wl_test_basic_backsquat.pdf"]',
      )
      .first(),
  ).toBeVisible();
  await card.locator('summary').click();
  await visual.locator('summary').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({
    path: `artifacts/video-review-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  await page.getByRole('button', { name: '候補・確認保留 8本', exact: true }).click();
  await expect(page.locator('article.video-card')).toHaveCount(8);
  await expect(videoCard(page, jspo.title)).toHaveCount(0);
  await expect(videoCard(page, squat.title)).toHaveCount(0);
  const held = videoCard(page, program.title);
  await expect(held.getByText('確認保留の候補', { exact: true })).toBeVisible();
  await held.locator('summary').click();
  await expect(held.locator('details')).toContainText('4:45–4:53');
  await expect(held.locator('details')).toContainText('16:49–16:56');
  await expect(held.locator('details')).toContainText('原因を確定できない');
  const oldGuideline = videoCard(page, cpr.title);
  await expect(oldGuideline.getByText('確認保留の候補', { exact: true })).toBeVisible();
  await oldGuideline.locator('summary').click();
  await expect(oldGuideline.locator('details')).toContainText('2020');
  await expect(oldGuideline.locator('details')).toContainText('2025');
  await expect(oldGuideline.locator('details')).toContainText('pp.20–38・42–44');
  await expect(oldGuideline.locator('details')).toContainText('16:19–16:31');
  await expect(oldGuideline.locator('details')).toContainText('乳児');
  await expect(oldGuideline.locator('details')).toContainText('音声・実演を未確認');
  await expect(oldGuideline.locator('details')).toContainText(
    '全改訂差分を確認したという意味ではない',
  );
  await expect(oldGuideline.getByText(/おすすめ · /)).toHaveCount(0);
  await page.getByRole('button', { name: 'すべて 10本', exact: true }).click();
  await expect(page.locator('article.video-card')).toHaveCount(10);
});

test('professional and technique lessons scope each recommendation to its objective while safety stays on hold', async ({
  page,
}) => {
  await open(page, '/learn/professional');
  const objective = units
    .find((unit) => unit.id === 'professional')!
    .objectives.find((item) => item.id === 'professional-o4')!;
  await expect(page.getByText(objective.text, { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '拒否の言葉がないことを、同意と決めつけない', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '内容を照合したおすすめ', exact: true }),
  ).toBeVisible();
  const recommended = videoCard(page, jspo.title);
  await expect(recommended.getByText('おすすめ · AIによる字幕照合', { exact: true })).toBeVisible();
  await recommended.locator('summary').click();
  await expect(recommended.locator('details')).toContainText(objective.text);
  await expect(videoCard(page, squat.title)).toHaveCount(0);
  await open(page, '/learn/technique');
  const squatObjective = units
    .find((unit) => unit.id === 'technique')!
    .objectives.find((item) => item.id === 'technique-o4')!;
  await expect(page.getByText(squatObjective.text, { exact: true })).toBeVisible();
  const techniqueVideo = videoCard(page, squat.title);
  await expect(
    techniqueVideo.getByText('おすすめ · AIによる映像照合', { exact: true }),
  ).toBeVisible();
  await techniqueVideo.locator('summary').click();
  await expect(techniqueVideo.locator('details')).toContainText(squatObjective.text);
  await expect(videoCard(page, jspo.title)).toHaveCount(0);
  const explanation = page.locator('#lesson-text');
  await expect(explanation).toContainText(/柔軟性|可動域/);
  await expect(explanation).toContainText(/かかと|踵/);
  await expect(explanation).toContainText('セーフティ');
  await expect(explanation).toContainText('補助');
  await open(page, '/learn/safety');
  await expect(
    page.getByText('この単元のおすすめは確認待ちです。以下は未確認・確認保留の候補です。', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '内容を照合したおすすめ', exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('article.video-card')).toHaveCount(2);
  await expect(page.getByText('おすすめ · AIによる字幕照合', { exact: true })).toHaveCount(0);
});

test('reordering and hiding recommendations keep backups valid and personally added videos stay candidates', async ({
  page,
}, testInfo) => {
  await open(page, '/videos');
  const priorIndex = (await page.locator('article.video-card h3').allTextContents()).indexOf(
    jspo.title,
  );
  expect(priorIndex).toBeGreaterThan(0);
  await page.getByRole('button', { name: `${jspo.title}を上へ`, exact: true }).click();
  await expect
    .poll(async () =>
      (await page.locator('article.video-card h3').allTextContents()).indexOf(jspo.title),
    )
    .toBe(priorIndex - 1);
  await expect(page.getByRole('button', { name: 'おすすめ 2本', exact: true })).toBeVisible();
  const reordered = await checkedExport(page, testInfo, 'reordered-video-settings.json');
  expect(reordered.data.videoOverrides).toHaveLength(seedVideos.length);
  expect(
    reordered.data.videoOverrides.every(
      (item) => item.video?.content.status === 'unreviewed' && !item.video.content.review,
    ),
  ).toBe(true);

  await open(page, '/videos');
  await page.getByRole('button', { name: 'おすすめ 2本', exact: true }).click();
  await expect(videoCard(page, jspo.title)).toHaveCount(1);
  await page.getByRole('button', { name: `${jspo.title}をこの端末で非表示`, exact: true }).click();
  await expect(page.getByRole('button', { name: 'おすすめ 1本', exact: true })).toBeVisible();
  await expect(page.locator('article.video-card')).toHaveCount(1);
  await expect(videoCard(page, squat.title)).toHaveCount(1);
  const hidden = await checkedExport(page, testInfo, 'hidden-video-settings.json');
  expect(hidden.data.videoOverrides.find((item) => item.id === jspo.id)?.deleted).toBe(true);

  await open(page, '/videos');
  await page.getByRole('button', { name: '動画を追加', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '個人用の動画を追加', exact: true });
  const personalTitle = '【NO！スポハラ活動】セクシュアル・ハラスメントについて【弁護士が解説】';
  await dialog
    .getByLabel('YouTube URL', { exact: true })
    .fill('https://www.youtube.com/watch?v=qL7C2MzikiU');
  await dialog.getByLabel('正式タイトル', { exact: true }).fill(personalTitle);
  await dialog.getByLabel('チャンネル名', { exact: true }).fill('JSPO -日本スポーツ協会-');
  await dialog
    .getByLabel('何を学ぶために見るか', { exact: true })
    .fill('指導者の倫理を考える個人用候補。動画本編の内容照合はしていない。');
  await dialog
    .getByRole('checkbox', {
      name: units.find((unit) => unit.id === 'professional')!.title,
      exact: true,
    })
    .check();
  await dialog
    .getByRole('checkbox', { name: '元動画で正式タイトル・チャンネルを確認した', exact: true })
    .check();
  await dialog.getByRole('button', { name: '個人設定として保存', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'おすすめ 1本', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '候補・確認保留 9本', exact: true }).click();
  const candidate = videoCard(page, personalTitle);
  await expect(candidate.getByText('内容未確認の候補', { exact: true })).toBeVisible();
  await expect(candidate).toContainText('メタデータ：確認済み');
  const watched = candidate.getByRole('checkbox', {
    name: '視聴済みとして記録（習熟度とは別）',
    exact: true,
  });
  await watched.click();
  await expect(watched).toBeChecked();
  await expect(page.getByRole('button', { name: 'おすすめ 1本', exact: true })).toBeVisible();
  const added = await checkedExport(page, testInfo, 'personal-candidate-settings.json');
  const savedPersonal = added.data.videoOverrides.find(
    (item) => item.video?.youtubeId === 'qL7C2MzikiU',
  )!.video!;
  expect(savedPersonal.metadata.status).toBe('confirmed');
  expect(savedPersonal.content.status).toBe('unreviewed');
  expect(savedPersonal.content.review).toBeUndefined();
});
