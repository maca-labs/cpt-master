import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { seedVideos } from '../src/content';
import { isRecommendedVideo } from '../src/engines/video-review';
const recommendedCount = seedVideos.filter((video) => isRecommendedVideo(video)).length;
const published = process.env.E2E_PUBLISHED_URL;
test('published Pages site loads nested routes and reviewed videos on this viewport', async ({
  page,
}, testInfo) => {
  test.skip(!published, 'GitHub Pages公開後にURLを指定して実行します。');
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(published! + '#/');
  await expect(
    page.getByRole('heading', { name: '理解から、指導できる知識へ。', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.version')).toHaveText('PERSONAL EDITION · v0.5.0');
  await page.goto(published! + '#/learn');
  await expect(page.locator('.unit-card')).toHaveCount(36);
  await page.goto(published! + '#/learn/ex-plan-load');
  await expect(
    page.getByRole('heading', { name: '抵抗運動の負荷・量を計算して読む', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '確認問題を解く（8問）', exact: true }),
  ).toBeEnabled();
  await page.goto(published! + '#/videos');
  await expect(
    page.getByRole('button', { name: `おすすめ ${recommendedCount}本`, exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: `おすすめ ${recommendedCount}本`, exact: true }).click();
  await expect(page.locator('article.video-card')).toHaveCount(recommendedCount);
  await expect(page.getByText('おすすめ · AIによる字幕照合', { exact: true })).toBeVisible();
  await expect(
    page.getByText('おすすめ · AIによる映像照合', { exact: true }).first(),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await mkdir('artifacts', { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `artifacts/published-videos-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto(published! + '#/learn/professional');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: '専門職としての境界と信頼', exact: true }),
  ).toBeVisible();
  await page.goto(published! + '#/learn/technique');
  await page.reload();
  await expect(page.getByText('おすすめ · AIによる映像照合', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto(published! + '#/exam');
  await expect(page.locator('main')).toContainText('短縮');
  await expect(page.locator('#through-practice')).toContainText('155問・180分の学習用通し演習');
  await page
    .locator('#through-practice')
    .getByRole('button', { name: '出題構成を確認する', exact: true })
    .click();
  await expect(page.getByTestId('through-composition')).toContainText(
    '厳密な未見 155問 ／ 既出 0問',
  );
  await page.goto(published! + '#/practice');
  await page
    .getByRole('combobox', { name: '教材の範囲', exact: true })
    .selectOption('expansion-2026-11-04');
  await page
    .getByRole('combobox', { name: '出題と評価の方法', exact: true })
    .selectOption('strict_unseen');
  await page.getByRole('combobox', { name: '演習の問題数', exact: true }).selectOption('50');
  await expect(page.locator('[aria-label="演習の在庫"]')).toContainText('200問');
  await page.goto(published! + '#/learn/ex-tech-hinge');
  const deadlift = page
    .locator('article.video-card')
    .filter({ has: page.getByRole('heading', { name: 'デッドリフト', exact: true }) });
  await expect(deadlift.getByText('おすすめ · AIによる映像照合', { exact: true })).toBeVisible();
  await expect(deadlift.getByRole('link', { name: 'YouTubeで開く', exact: true })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=K0aNKaCKBsE',
  );
  await page.goto(published! + '#/analytics');
  await expect(page.locator('main')).toBeVisible();
  await page.screenshot({
    path: `artifacts/published-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(failures).toEqual([]);
});
test('published Pages cache supports offline study and persistence under the project path', async ({
  page,
  context,
}) => {
  test.skip(!published, 'GitHub Pages公開後にURLを指定して実行します。');
  await page.goto(published! + '#/learn/anatomy');
  await expect(
    page.getByRole('heading', { name: '動きを読むための機能解剖学', exact: true }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: '動きを読むための機能解剖学', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '確認問題を解く（8問）', exact: true }).click();
  await page.locator('button.choice').first().click();
  await page.getByRole('button', { name: '回答を保存', exact: true }).click();
  await expect(page.locator('.answer-notice')).toBeVisible();
  await page.reload();
  await expect(page.locator('.answer-notice')).toBeVisible();
  await context.setOffline(false);
});
