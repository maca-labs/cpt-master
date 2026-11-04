import { expect, test } from '@playwright/test';

test('production cache supports lesson and quiz after an offline reload', async ({
  page,
  context,
}) => {
  test.skip(
    process.env.TEST_PRODUCTION !== '1',
    '本番ビルドのプレビューサーバーで実行するテストです。',
  );
  await page.goto('/#/learn/anatomy');
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
  await expect(
    page.getByText(
      'オフラインです。保存済み教材で学習できます。YouTubeの視聴には通信が必要です。',
      { exact: true },
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '確認問題を解く（8問）', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  await page.locator('button.choice').first().click();
  await page.getByRole('button', { name: '回答を保存', exact: true }).click();
  await expect(page.locator('.answer-notice')).toBeVisible();
  await page.reload();
  await expect(page.locator('.answer-notice')).toBeVisible();
  await context.setOffline(false);
});
