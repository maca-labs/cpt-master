import { expect, test, type Locator, type Page } from '@playwright/test';
import { questions } from '../src/content';
import type { DedicatedExamPack } from '../src/engines/dedicated-exam';
import set01 from '../src/content/dedicated-packs/set-01.json' with { type: 'json' };

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const pack = set01 as DedicatedExamPack;

function findChoice(
  question: { choices: { id: string; text: string }[]; correctChoiceId: string },
  correct: boolean,
) {
  return question.choices.find((choice) => (choice.id === question.correctChoiceId) === correct)!;
}

async function chooseDedicated(page: Page, correct: boolean) {
  const heading = page.locator('.dedicated-run h1');
  await expect(heading).toBeVisible();
  const headingText = await heading.innerText();
  const question = pack.items.find((item) => item.prompt === headingText)!;
  const selected = findChoice(question, correct);
  const button = page.getByRole('button', { name: selected.text, exact: true });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  return { question, selected };
}

async function chooseShort(page: Page, correct: boolean) {
  const heading = page.locator('.quiz-card h1');
  await expect(heading).toBeVisible();
  const headingText = await heading.innerText();
  const question = questions.find((item) => item.prompt === headingText)!;
  const selected = findChoice(question, correct);
  const escaped = selected.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page
    .locator('button.choice')
    .filter({ hasText: new RegExp('^\\s*[A-C]\\s*' + escaped + '\\s*$') })
    .click();
  await expect(page.getByRole('status').filter({ hasText: '下書きを保存しました' })).toBeVisible();
  return { question, selected };
}

async function checkReview(
  panel: Locator,
  number: number,
  verdict: '正解' | '不正解' | '未回答',
  correctText?: string,
  selectedText?: string,
) {
  const title = panel.getByRole('heading', {
    name: new RegExp('^(?:問題\\s*' + number + '(?:\\s|$)|第' + number + '問の解答・解説$)'),
  });
  await expect(title).toBeFocused();
  const marker = panel.locator('.exam-verdict');
  await expect(marker).toHaveText(new RegExp('^[○×—]\\s*' + verdict + '$'));
  await expect(marker).toBeInViewport();
  const summary = panel.locator('dl').first();
  const selected = summary.getByText(/^あなたの(回答|解答)$/).locator('..');
  const correct = summary.getByText('正答', { exact: true }).locator('..');
  await expect(selected).toBeInViewport();
  await expect(correct).toBeInViewport();
  await expect(panel.getByRole('heading', { name: '正答解説', exact: true })).toBeInViewport();
  await expect(panel.locator('.explanation > p').first()).toBeInViewport();
  if (correctText) await expect(correct.locator('dd')).toContainText(correctText);
  if (selectedText) await expect(selected.locator('dd')).toContainText(selectedText);
  if (verdict === '未回答') await expect(selected.locator('dd')).toHaveText('未回答');
}

test('dedicated exam review jumps to the wrong answer and reveals distant explanations', async ({
  page,
}) => {
  await page.goto(appBase + '#/exam/full?set=' + pack.id, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '155問の模試を始める', exact: true }).click();
  const first = await chooseDedicated(page, true);
  await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  await expect(page.locator('.dedicated-run .quiz-top .pill')).toContainText('2 / 155');
  const second = await chooseDedicated(page, false);
  await expect(page.getByRole('heading', { name: '正答解説', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: '受験を終了する', exact: true }).click();
  await page.getByRole('button', { name: '提出して採点する', exact: true }).click();
  await expect(page.getByRole('heading', { name: '専用模試の結果', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '解答・解説を見る', exact: true }).click();

  const panel = page.locator('.dedicated-review');
  await checkReview(
    panel,
    2,
    '不正解',
    findChoice(second.question, true).text,
    second.selected.text,
  );
  await page.getByRole('button', { name: '前の解説', exact: true }).click();
  await checkReview(panel, 1, '正解', first.selected.text);
  await expect(page.getByRole('button', { name: '前の解説', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '次の解説', exact: true }).click();
  await checkReview(panel, 2, '不正解');
  await page.getByRole('button', { name: '次の解説', exact: true }).click();
  await checkReview(panel, 3, '未回答');

  const navigator = page.locator('.dedicated-navigator');
  if ((await navigator.getAttribute('open')) === null)
    await navigator.getByText('解答状況・見直し', { exact: true }).click();
  await expect(navigator.getByRole('button', { name: /^問題 1、正解/ })).toBeVisible();
  await expect(navigator.getByRole('button', { name: /^問題 2、不正解/ })).toBeVisible();
  await navigator.getByRole('button', { name: /^問題 155、未回答/ }).click();
  await checkReview(panel, 155, '未回答');
  await expect(page.getByRole('button', { name: '次の解説', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  );
});

test('short mock review jumps to the wrong answer and distinguishes an unanswered item', async ({
  page,
}) => {
  await page.goto(appBase + '#/exam', { waitUntil: 'domcontentloaded' });
  await page.getByRole('combobox', { name: '短縮模試の問題数', exact: true }).selectOption('10');
  await page.getByRole('button', { name: '10問の短縮模試を始める', exact: true }).click();
  const first = await chooseShort(page, true);
  await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  await expect(page.locator('.quiz-top .pill')).toContainText('2 / 10');
  const second = await chooseShort(page, false);
  await expect(page.getByRole('heading', { name: '正答解説', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: '採点して終了', exact: true }).click();
  await page.getByRole('button', { name: 'この内容で採点する', exact: true }).click();
  await expect(page.getByRole('heading', { name: '短縮模試の結果', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '解答・解説を見る', exact: true }).click();
  const panel = page.locator('#mock-answer-review');
  await checkReview(
    panel,
    2,
    '不正解',
    findChoice(second.question, true).text,
    second.selected.text,
  );
  await page.getByRole('button', { name: '前の解説', exact: true }).click();
  await checkReview(panel, 1, '正解', first.selected.text);
  await page.getByRole('button', { name: '次の解説', exact: true }).click();
  await checkReview(panel, 2, '不正解');
  await page.getByRole('button', { name: '次の解説', exact: true }).click();
  await checkReview(panel, 3, '未回答');
});
