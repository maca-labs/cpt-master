import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
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
  await expect(page.locator('.version')).toHaveText('PERSONAL EDITION · v0.4.0');
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
  await expect(page.getByRole('button', { name: 'おすすめ 2本', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'おすすめ 2本', exact: true }).click();
  await expect(page.locator('article.video-card')).toHaveCount(2);
  await expect(page.getByText('おすすめ · AIによる字幕照合', { exact: true })).toBeVisible();
  await expect(page.getByText('おすすめ · AIによる映像照合', { exact: true })).toBeVisible();
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
