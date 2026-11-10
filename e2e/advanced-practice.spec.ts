import { expect, test, type Page } from '@playwright/test';
import { advancedQuestions } from '../src/content/advanced';
import {
  advancedPracticeBatch,
  type Attempt,
  type Exposure,
  type Session,
} from '../src/domain/types';

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const advancedIds = new Set(advancedQuestions.map(({ id }) => id));

async function readRows<T>(page: Page, table: string): Promise<T[]> {
  return page.evaluate(
    (name) =>
      new Promise<unknown[]>((resolve, reject) => {
        const open = indexedDB.open('cpt-master');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result;
          const transaction = database.transaction(name, 'readonly');
          transaction.oncomplete = () => database.close();
          transaction.onabort = () => {
            database.close();
            reject(transaction.error);
          };
          const request = transaction.objectStore(name).getAll();
          request.onsuccess = () => resolve(request.result);
        };
      }),
    table,
  ) as Promise<T[]>;
}

test('advanced practice isolates and reserves 50 unseen questions and resumes the saved first answer', async ({
  page,
}) => {
  await page.goto(`${appBase}#/practice`, { waitUntil: 'domcontentloaded' });
  const advanced = page.getByRole('region', { name: '応用・分析50問', exact: true });
  const start = advanced.getByRole('button', { name: '未見の50問を始める', exact: true });
  const quiz = page.locator('.quiz-card');
  const prompt = quiz.getByRole('heading', { level: 1 });
  const pause = page.getByRole('link', { name: '保存して中断', exact: true });
  const scope = page.getByRole('combobox', { name: '教材の範囲', exact: true });

  await expect(start).toBeEnabled();
  await expect(scope.locator(`option[value="${advancedPracticeBatch}"]`)).toHaveCount(0);
  await page.getByRole('button', { name: '問題演習を始める', exact: true }).click();
  await expect(prompt).toBeVisible();
  const [ordinary] = await readRows<Session>(page, 'sessions');
  expect(ordinary.questionIds.length).toBeGreaterThan(0);
  expect(ordinary.questionIds.some((id) => advancedIds.has(id))).toBe(false);
  expect(
    (await readRows<Exposure>(page, 'exposures')).some(({ questionId }) =>
      advancedIds.has(questionId),
    ),
  ).toBe(false);
  await pause.click();
  await expect(advanced).toContainText('未見で利用可能な問題は50問です。');

  await start.click();
  await expect(prompt).toBeVisible();
  const session = (await readRows<Session>(page, 'sessions')).find(
    (item) => item.practice?.batch === advancedPracticeBatch,
  )!;
  expect(session.practice).toEqual({
    batch: advancedPracticeBatch,
    selection: 'strict_unseen',
    requestedCount: 50,
  });
  expect(session.questionIds).toHaveLength(50);
  expect(new Set(session.questionIds)).toEqual(advancedIds);
  expect(Object.values(session.firstSeenByQuestion).every(Boolean)).toBe(true);
  const first = advancedQuestions.find(({ id }) => id === session.questionIds[0])!;
  await expect(prompt).toHaveText(first.prompt);
  await expect(quiz.getByRole('button', { name: /先に解説を見る/ })).toHaveCount(0);
  await expect(quiz.locator('.explanation')).toHaveCount(0);
  const choice = first.choices.find(({ id }) => id === first.correctChoiceId)!;
  const escaped = choice.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await quiz
    .locator('button.choice')
    .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escaped}\\s*$`) })
    .click();
  await quiz.getByRole('button', { name: '回答を保存', exact: true }).click();
  await expect(quiz.getByRole('heading', { name: '正答解説', exact: true })).toBeVisible();
  const [attempt] = (await readRows<Attempt>(page, 'attempts')).filter(
    ({ sessionId }) => sessionId === session.id,
  );
  expect(attempt).toMatchObject({
    questionId: first.id,
    selectedChoiceId: first.correctChoiceId,
    correct: true,
    firstSeen: true,
  });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(prompt).toHaveText(first.prompt);
  await expect(quiz.locator('.answer-notice')).toContainText('正解');
  expect(
    (await readRows<Attempt>(page, 'attempts')).filter(({ sessionId }) => sessionId === session.id),
  ).toEqual([attempt]);

  await pause.click();
  await expect(advanced).toContainText('未見で利用可能な問題は0問です。');
  await expect(advanced.getByRole('button', { name: /未見の.*問を始める/ })).toHaveCount(0);
  await expect(advanced).toContainText('中断中の学習');
  await page.locator(`a[href="#/session/${session.id}"]`).click();
  await expect(prompt).toHaveText(first.prompt);
  await expect(quiz.getByRole('heading', { name: '正答解説', exact: true })).toBeVisible();
  await quiz.getByRole('button', { name: '次の問題へ', exact: true }).click();
  const second = advancedQuestions.find(({ id }) => id === session.questionIds[1])!;
  await expect(prompt).toHaveText(second.prompt);
  await expect(quiz.locator('.explanation')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
