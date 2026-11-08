import { expect, test, type Page } from '@playwright/test';
import { questions } from '../src/content';
import type { Attempt, Exposure, Session } from '../src/domain/types';

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
async function rows<T>(page: Page, name: string): Promise<T[]> {
  return page.evaluate(
    (storeName) =>
      new Promise<unknown[]>((resolve, reject) => {
        const request = indexedDB.open('cpt-master');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const query = database.transaction(storeName).objectStore(storeName).getAll();
          query.onerror = () => {
            database.close();
            reject(query.error);
          };
          query.onsuccess = () => {
            database.close();
            resolve(query.result);
          };
        };
      }),
    name,
  ) as Promise<T[]>;
}
async function startThrough(page: Page) {
  await page.goto(appBase + '#/exam');
  const panel = page.locator('#through-practice');
  await expect(panel.getByRole('heading', { name: '155問・180分の学習用通し演習' })).toBeVisible();
  await expect(panel).toContainText('全155問を採点し、未回答も分母に含めます。');
  await expect(panel).toContainText('初回診断50問は保留');
  await panel.getByRole('button', { name: '出題構成を確認する', exact: true }).click();
  await expect(panel.getByTestId('through-composition')).toContainText(
    '厳密な未見 155問 ／ 既出 0問',
  );
  await expect(panel.getByTestId('through-composition')).toContainText(
    '実写写真 0問・実写映像 0問',
  );
  await expect(panel.getByTestId('through-composition')).toContainText('人間の専門家レビュー 0問');
  // The preview exposes composition only, never any selected prompt or explanation.
  expect(await rows<Exposure>(page, 'exposures')).toHaveLength(0);
  await expect(page.locator('.quiz-card')).toHaveCount(0);
  await panel.getByRole('button', { name: '155問の学習用通し演習を始める', exact: true }).click();
  await expect(page).toHaveURL(/#\/exam\/[a-f0-9-]+$/);
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  await expect(page.locator('.quiz-top .pill')).toHaveText('学習用通し演習 · 1 / 155');
  await expect(page.getByRole('timer', { name: '学習用通し演習の残り時間' })).toBeVisible();
  await expect(page.getByRole('button', { name: '一時停止', exact: true })).toBeEnabled();
  const id = page.url().split('/exam/')[1];
  const session = (await rows<Session>(page, 'sessions')).find((s) => s.id === id)!;
  expect(session.mock).toMatchObject({
    format: 'through',
    questionCount: 155,
    timeMode: 'continuous',
    limitSeconds: 10800,
    paused: false,
  });
  expect(
    new Set(session.questionIds.map((qid) => questions.find((q) => q.id === qid)!.groupId)).size,
  ).toBe(155);
  expect(
    session.questionIds.every((qid) => questions.find((q) => q.id === qid)!.pool === 'practice'),
  ).toBe(true);
  return id;
}

test('155-question learning practice preserves drafts, flags and paused time across reload', async ({
  page,
}, testInfo) => {
  await page.clock.install({ time: new Date('2026-11-05T00:00:00.000Z') });
  const id = await startThrough(page);
  const prompt = await page.locator('.quiz-card h1').innerText();
  const question = questions.find((q) => q.prompt === prompt)!;
  const choice = question.choices.find((c) => c.id === question.correctChoiceId)!;
  await page
    .locator('button.choice')
    .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escape(choice.text)}\\s*$`) })
    .click();
  await expect(page.getByRole('status').filter({ hasText: '下書きを保存しました' })).toBeVisible();
  await page.getByRole('button', { name: 'フラグを付ける', exact: true }).click();
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  await expect(page.locator('.quiz-top .pill')).toHaveText('学習用通し演習 · 2 / 155');
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  await page.getByRole('button', { name: '保存して中断', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '中断中の短縮模試・通し演習', exact: true }),
  ).toBeVisible();
  const saved = (await rows<Session>(page, 'sessions')).find((session) => session.id === id)!.mock!;
  expect(saved).toMatchObject({ paused: true, deadlineAt: null });
  await page.locator(`a[href="#/exam/${id}"]`).click();
  const timer = page.getByRole('timer');
  await expect(timer).toContainText('停止中');
  const frozen = await timer.innerText();
  await page.clock.fastForward(60000);
  await page.reload();
  await expect(timer).toHaveText(frozen);
  await page.getByRole('button', { name: '模試を再開する', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  const resumed = (await rows<Session>(page, 'sessions')).find(
    (session) => session.id === id,
  )!.mock!;
  expect(resumed.clockAnchor?.remainingMs).toBe(saved.clockAnchor?.remainingMs);
  await expect(timer).not.toContainText('停止中');
  const running = await timer.innerText();
  await page.clock.fastForward(10000);
  await expect(timer).not.toHaveText(running);
  await page.getByRole('button', { name: '解答を見直す', exact: true }).click();
  await page.getByRole('button', { name: '1問目 回答済み フラグ付き', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toHaveText(question.prompt);
  await expect(
    page
      .locator('button.choice')
      .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escape(choice.text)}\\s*$`) }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(await rows<Attempt>(page, 'attempts')).toHaveLength(0);
  await page.getByRole('button', { name: '採点して終了', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '学習用通し演習の提出確認' })).toContainText(
    '未回答 154問',
  );
  await page.getByRole('button', { name: 'この内容で採点する', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '学習用通し演習の結果', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.result-stats')).toContainText('1 / 155問 正解');
  await expect(page.locator('.result-stats')).toContainText('1 / 154問');
  await expect(page.getByTestId('through-composition')).toContainText(
    '厳密な未見 155問 ／ 既出 0問',
  );
  await expect(page.locator('.result-question')).toHaveCount(155);
  await expect(
    page
      .locator('.result-question')
      .filter({ hasText: question.prompt })
      .getByRole('link', { name: /・関連動画へ$/ }),
  ).toBeVisible();
  expect(await rows<Attempt>(page, 'attempts')).toHaveLength(1);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: '学習用通し演習の結果', exact: true }),
  ).toBeVisible();
  expect(await rows<Attempt>(page, 'attempts')).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('through-results.png') });
});

test('180-minute deadline still applies when leaving without pausing', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-05T00:00:00.000Z') });
  const id = await startThrough(page);
  await page.goto(appBase + '#/exam');
  await expect(
    page.getByRole('heading', { name: '中断中の短縮模試・通し演習', exact: true }),
  ).toBeVisible();
  await page.clock.fastForward(10801000);
  await page.locator(`a[href="#/exam/${id}"]`).click();
  await expect(
    page.getByRole('heading', { name: '学習用通し演習の結果', exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/制限時間に達したため自動採点しました/)).toBeVisible();
  await expect(page.locator('.result-stats')).toContainText('0 / 155問 正解');
  expect(await rows<Attempt>(page, 'attempts')).toHaveLength(0);
  const session = (await rows<Session>(page, 'sessions')).find((s) => s.id === id)!;
  expect(session).toMatchObject({
    status: 'completed',
    mock: { format: 'through', finishedReason: 'timeout', remainingSeconds: 0 },
  });
  await expect(page.getByRole('link', { name: /・関連動画へ$/ }).first()).toBeVisible();
});
