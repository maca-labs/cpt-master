import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('v0.4 backup keeps added-unit notes and resumes the old short-exercise draft', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-11-04T12:00:30Z') });
  const text = await readFile(
    new URL('../tests/fixtures/v04-backup.json', import.meta.url),
    'utf8',
  );
  const old = JSON.parse(text);
  await page.goto(`${process.env.E2E_PUBLISHED_URL ?? '/'}#/settings`);
  await expect(page.locator('.version')).toHaveText('PERSONAL EDITION · v0.6.5');
  await page
    .getByLabel('バックアップJSONを選択', { exact: true })
    .setInputFiles({ name: 'v04.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  await expect(
    page.getByRole('heading', { name: '事前検査が完了しました', exact: true }),
  ).toBeVisible();
  await page.getByRole('checkbox', { name: '内容とマージ方法を確認しました', exact: true }).check();
  const backupDownload = page.waitForEvent('download');
  await page
    .getByRole('button', { name: '復元前バックアップを保存してマージ', exact: true })
    .click();
  await backupDownload;
  await expect(page.getByRole('status').filter({ hasText: '復元しました。' })).toBeVisible();
  await page.goto(`${process.env.E2E_PUBLISHED_URL ?? '/'}#/learn/ex-plan-load`);
  await expect(page.getByRole('textbox', { name: '単元メモ', exact: true })).toHaveValue(
    'v0.4の追加単元メモ',
  );
  await page.goto(`${process.env.E2E_PUBLISHED_URL ?? '/'}#/exam/v04-active-short`);
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  await expect(page.locator('button.choice[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('button.choice[aria-pressed="true"]')).toHaveCount(1);
  await page.goto(`${process.env.E2E_PUBLISHED_URL ?? '/'}#/settings`);
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSONを書き出す', exact: true }).click();
  const file = await downloaded;
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const current = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  for (const name of [
    'attempts',
    'reviews',
    'favorites',
    'unitProgress',
    'videoProgress',
    'videoOverrides',
  ])
    expect(current.data[name]).toEqual(old.data[name]);
  const oldDraft = old.data.sessions.find((s: { id: string }) => s.id === 'v04-active-short');
  const currentDraft = current.data.sessions.find(
    (s: { id: string }) => s.id === 'v04-active-short',
  );
  expect(currentDraft).toEqual(oldDraft);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
