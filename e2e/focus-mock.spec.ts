import { expect, test } from '@playwright/test';
import { focusMock, focusMockQuestions } from '../src/content/focus-mock';

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';

test('the focus mock preserves a flagged draft across tabs and scores the 20-question set', async ({
  page,
  context,
}) => {
  await page.goto(`${appBase}#/exam`);
  await expect(page.getByRole('heading', { name: focusMock.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: '集中模試20問を始める', exact: true }).click();
  await expect(page.locator('.quiz-top .pill')).toHaveText('集中模試 · 1 / 20');
  const prompt = await page.locator('.quiz-card h1').innerText();
  const question = focusMockQuestions.find((q) => q.prompt === prompt)!;
  expect(question).toBeDefined();
  const correct = question.choices.find((c) => c.id === question.correctChoiceId)!;
  const choice = page.locator('button.choice').filter({ hasText: correct.text });
  await page
    .locator('button.choice')
    .filter({
      hasText: question.choices.find((c) => c.id !== question.correctChoiceId)!.text,
    })
    .click();
  await expect(page.getByRole('status').filter({ hasText: '下書きを保存しました' })).toBeVisible();
  await page.getByRole('button', { name: 'フラグを付ける', exact: true }).click();
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  await expect(page.locator('.explanation')).toHaveCount(0);
  const otherTab = await context.newPage();
  await otherTab.goto(page.url());
  await otherTab.locator('button.choice').filter({ hasText: correct.text }).click();
  await expect(
    otherTab.getByRole('status').filter({ hasText: '下書きを保存しました' }),
  ).toBeVisible();
  await expect(choice).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '保存して中断', exact: true }).click();
  await expect(
    otherTab.getByRole('heading', { name: '集中模試を一時停止しています', exact: true }),
  ).toBeVisible();
  await otherTab.close();
  await page.getByRole('link', { name: '集中模試を再開', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '集中模試を一時停止しています', exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: '模試を再開する', exact: true }).click();
  await expect(choice).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '採点して終了', exact: true }).click();
  await page
    .getByRole('dialog', { name: '集中模試の提出確認', exact: true })
    .getByRole('button', { name: 'この内容で採点する', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: '集中模試の結果', exact: true })).toBeVisible();
  await expect(page.locator('.result-stats')).toContainText('1 / 20問 正解');
  await expect(page.locator('.result-question-button')).toHaveCount(20);
  await page.locator('.result-question-button').filter({ hasText: prompt }).click();
  await expect(page.locator('.explanation')).toContainText(question.explanation);
  await expect(page.getByRole('link', { name: /・関連動画へ$/ }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
