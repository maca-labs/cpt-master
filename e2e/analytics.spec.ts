import { expect, test, type Page } from '@playwright/test';
import { questions } from '../src/content';
import type { Attempt, Session } from '../src/domain/types';

async function ready(page: Page, route: string) {
  await page.goto(`/#${route}`);
  await expect(page.locator('main')).toBeVisible();
}
async function records<T>(page: Page, name: string): Promise<T[]> {
  return page.evaluate(
    (storeName) =>
      new Promise<unknown[]>((resolve, reject) => {
        const request = indexedDB.open('cpt-master');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const requestRows = database
            .transaction(storeName, 'readonly')
            .objectStore(storeName)
            .getAll();
          requestRows.onerror = () => {
            database.close();
            reject(requestRows.error);
          };
          requestRows.onsuccess = () => {
            database.close();
            resolve(requestRows.result);
          };
        };
      }),
    name,
  ) as Promise<T[]>;
}
async function completeSafetyPractice(page: Page, correctPattern: boolean[]) {
  await ready(page, '/practice');
  await page.getByLabel(/^学習する単元/).selectOption('safety');
  await expect(page.getByRole('button', { name: '問題演習を始める', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '利用可能な3問で始める', exact: true }).click();
  for (let index = 0; index < correctPattern.length; index++) {
    await expect(page.locator('.quiz-top .pill')).toHaveText(
      `確認問題 · ${index + 1} / ${correctPattern.length}`,
    );
    const prompt = await page.locator('.quiz-card h1').innerText();
    const question = questions.find((candidate) => candidate.prompt === prompt)!;
    expect(question).toBeTruthy();
    const choice = question.choices.find((candidate) =>
      correctPattern[index]
        ? candidate.id === question.correctChoiceId
        : candidate.id !== question.correctChoiceId,
    )!;
    await page.locator('button.choice').filter({ hasText: choice.text }).click();
    if (index === 0)
      await page
        .getByRole('checkbox', {
          name: 'この答えを選ぶ根拠を、自分の言葉で説明できる',
          exact: true,
        })
        .check();
    await page.getByRole('button', { name: '回答を保存', exact: true }).click();
    await expect(page.locator('.answer-notice')).toBeVisible();
    await page
      .getByRole('button', {
        name: index === correctPattern.length - 1 ? '結果を見る' : '次の問題へ',
        exact: true,
      })
      .click();
  }
  await expect(page).toHaveURL(/#\/results\//);
}

test('empty analytics becomes measured first-seen, repeat and past-session statistics after real practice', async ({
  page,
}) => {
  await ready(page, '/analytics');
  await expect(
    page.getByRole('heading', { name: '積み重ねを、次の学びへ。', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('分析する回答は、まだありません。', { exact: true })).toBeVisible();
  await expect(page.getByTestId('analytics-first-rate')).toHaveText('—');
  await expect(page.getByTestId('analytics-repeat-rate')).toHaveText('—');
  await expect(
    page.getByRole('region', { name: '学習日別の回答数グラフ', exact: true }),
  ).toHaveCount(0);

  // Before diagnosis, this unit has three practice questions. Answer via UI in an isolated test context.
  await completeSafetyPractice(page, [true, false, true]);
  await ready(page, '/analytics');
  await expect(page.getByTestId('analytics-first-rate')).toHaveText('66.7%');
  await expect(page.getByTestId('analytics-repeat-rate')).toHaveText('—');
  await expect(page.getByTestId('analytics-answer-count')).toHaveText('3回答');
  await expect(page.getByTestId('analytics-domain-safety')).toContainText('3グループ');
  await expect(page.getByTestId('analytics-domain-assessment')).toContainText('0回答');
  await expect(
    page.getByRole('link', { name: '教材・関連動画へ', exact: true }).first(),
  ).toHaveAttribute('href', '#/learn/safety');
  expect(
    (await records<Attempt>(page, 'attempts')).filter((attempt) => attempt.firstSeen),
  ).toHaveLength(3);

  await completeSafetyPractice(page, [true, false, false]);
  await ready(page, '/analytics');
  await expect(page.getByTestId('analytics-first-rate')).toHaveText('66.7%');
  await expect(page.getByTestId('analytics-repeat-rate')).toHaveText('33.3%');
  await expect(page.getByTestId('analytics-answer-count')).toHaveText('6回答');
  await expect(page.getByTestId('analytics-domain-safety')).toContainText('3グループ');
  await page.getByLabel('比較する学習形式', { exact: true }).selectOption('practice');
  await expect(page.getByTestId('analytics-session-difference')).toHaveText('-33.3');
  const saved = await records<Attempt>(page, 'attempts');
  const sessions = (await records<Session>(page, 'sessions')).filter(
    (session) => session.status === 'completed',
  );
  expect(saved).toHaveLength(6);
  expect(sessions).toHaveLength(2);
  expect(
    sessions.every((session) => session.mode === 'practice' && session.questionIds.length === 3),
  ).toBe(true);
  await page.reload();
  await expect(page.getByTestId('analytics-repeat-rate')).toHaveText('33.3%');
  const viewport = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(viewport.content).toBeLessThanOrEqual(viewport.viewport);
});
