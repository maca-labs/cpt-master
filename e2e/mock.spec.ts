import { expect, test, type Page } from '@playwright/test';
import { questions } from '../src/content';
import type { Attempt, Session } from '../src/domain/types';

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
async function open(page: Page, path = '/exam') {
  await page.goto(`/#${path}`);
  await expect(page.locator('main')).toBeVisible();
}
async function store<T>(page: Page, name: string): Promise<T[]> {
  return page.evaluate(
    (storeName) =>
      new Promise<unknown[]>((resolve, reject) => {
        const request = indexedDB.open('cpt-master');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const rows = db.transaction(storeName).objectStore(storeName).getAll();
          rows.onerror = () => {
            db.close();
            reject(rows.error);
          };
          rows.onsuccess = () => {
            db.close();
            resolve(rows.result);
          };
        };
      }),
    name,
  ) as Promise<T[]>;
}
async function start(page: Page, count = 20, mode = 'study') {
  await open(page);
  await page
    .getByRole('combobox', { name: '短縮模試の問題数', exact: true })
    .selectOption(String(count));
  await page
    .getByRole('combobox', { name: '短縮模試の時間モード', exact: true })
    .selectOption(mode);
  await page.getByRole('button', { name: `${count}問の短縮模試を始める`, exact: true }).click();
  await expect(page).toHaveURL(/#\/exam\/[a-f0-9-]+$/);
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  return page.url().split('/exam/')[1];
}
async function answer(page: Page, correct = true) {
  const prompt = await page.locator('.quiz-card h1').innerText();
  const q = questions.find((q) => q.prompt === prompt)!;
  const choice = q.choices.find((c) =>
    correct ? c.id === q.correctChoiceId : c.id !== q.correctChoiceId,
  )!;
  await page
    .locator('button.choice')
    .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escape(choice.text)}\\s*$`) })
    .click();
  await expect(page.getByRole('status').filter({ hasText: '下書きを保存しました' })).toContainText(
    '下書きを保存しました',
  );
  await expect(page.getByRole('button', { name: '採点して終了', exact: true })).toBeEnabled();
  return q;
}
async function submit(page: Page) {
  await page.getByRole('button', { name: '採点して終了', exact: true }).click();
  await page.getByRole('button', { name: 'この内容で採点する', exact: true }).click();
  await expect(page.getByRole('heading', { name: '短縮模試の結果', exact: true })).toBeVisible();
}

test('20-question mock keeps answers private until submission and includes unanswered questions in results', async ({
  page,
}) => {
  await open(page);
  await page.getByRole('combobox', { name: '短縮模試の問題数', exact: true }).selectOption('50');
  await expect(page.getByRole('status').filter({ hasText: '不足' })).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: '50問の短縮模試を始める', exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole('link', { name: '155問模試の準備状況', exact: true }),
  ).toHaveAttribute('href', '#/exam/full');
  const id = await start(page);
  for (let index = 0; index < 19; index++) {
    await expect(page.locator('.quiz-top .pill')).toHaveText(`短縮模試 · ${index + 1} / 20`);
    await answer(page, index !== 0);
    await expect(page.locator('.explanation')).toHaveCount(0);
    expect(await store<Attempt>(page, 'attempts')).toHaveLength(0);
    await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  }
  await expect(page.locator('.quiz-top .pill')).toHaveText('短縮模試 · 20 / 20');
  await submit(page);
  await expect(page.locator('.result-stats')).toContainText('18 / 20問 正解');
  await expect(page.locator('.result-stats')).toContainText('90');
  const attempts = await store<Attempt>(page, 'attempts');
  expect(attempts).toHaveLength(19);
  const session = (await store<Session>(page, 'sessions')).find((s) => s.id === id)!;
  expect(session).toMatchObject({
    mode: 'mock',
    status: 'completed',
    mock: { finishedReason: 'submitted' },
  });
  expect(
    new Set(session.questionIds.map((qid) => questions.find((q) => q.id === qid)!.groupId)).size,
  ).toBe(20);
  await expect(page.getByRole('link', { name: /・関連動画へ$/ }).first()).toBeVisible();
  await page.locator('.result-question-button').first().click();
  await expect(page.locator('.explanation')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '短縮模試の結果', exact: true })).toBeVisible();
  expect(await store<Attempt>(page, 'attempts')).toHaveLength(19);
});

test('flags, draft choices and paused time survive interruption and reload', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-04T09:00:00.000Z') });
  const id = await start(page);
  const q = await answer(page);
  await page.getByRole('button', { name: 'フラグを付ける', exact: true }).click();
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  await open(page, `/session/${id}`);
  await expect(page).toHaveURL(new RegExp(`#/exam/${id}$`));
  await expect(page.locator('.explanation')).toHaveCount(0);
  await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  await expect(page.locator('.quiz-top .pill')).toHaveText('短縮模試 · 2 / 20');
  await page.getByRole('button', { name: '保存して中断', exact: true }).click();
  await expect(page.getByRole('heading', { name: '中断中の短縮模試', exact: true })).toBeVisible();
  await page.locator(`a[href="#/exam/${id}"]`).click();
  await expect(
    page.getByRole('heading', { name: '短縮模試を一時停止しています', exact: true }),
  ).toBeVisible();
  const frozen = await page.getByRole('timer').innerText();
  await page.clock.fastForward(60000);
  await page.reload();
  await expect(page.getByRole('timer')).toHaveText(frozen);
  await page.getByRole('button', { name: '模試を再開する', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  await page.getByRole('button', { name: '解答を見直す', exact: true }).click();
  await page.getByRole('button', { name: '1問目 回答済み フラグ付き', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toHaveText(q.prompt);
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  const choice = q.choices.find((c) => c.id === q.correctChoiceId)!;
  await expect(
    page
      .locator('button.choice')
      .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escape(choice.text)}\\s*$`) }),
  ).toHaveAttribute('aria-pressed', 'true');
  await submit(page);
  await expect(page.locator('.result-stats')).toContainText('1 / 20問 正解');
});

test('continuous mode times out on reopening and records unanswered questions without empty attempts', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-11-04T09:00:00.000Z') });
  const id = await start(page, 10, 'continuous');
  await expect(page.getByRole('button', { name: '一時停止', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '保存して中断', exact: true }).click();
  await expect(page.getByRole('heading', { name: '中断中の短縮模試', exact: true })).toBeVisible();
  await page.clock.fastForward(701000);
  await page.locator(`a[href="#/exam/${id}"]`).click();
  await expect(page.getByRole('heading', { name: '短縮模試の結果', exact: true })).toBeVisible();
  await expect(page.getByText(/制限時間に達したため自動採点しました/)).toBeVisible();
  await expect(page.locator('.result-stats')).toContainText('0 / 10問 正解');
  expect(await store<Attempt>(page, 'attempts')).toHaveLength(0);
  const session = (await store<Session>(page, 'sessions')).find((s) => s.id === id)!;
  expect(session.mock).toMatchObject({ finishedReason: 'timeout', remainingSeconds: 0 });
});
