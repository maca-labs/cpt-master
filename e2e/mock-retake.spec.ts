import { expect, test, type Locator, type Page } from '@playwright/test';
import { questions } from '../src/content';
import type { Attempt, Session } from '../src/domain/types';
import type { DedicatedExamPack, DedicatedExamSession } from '../src/engines/dedicated-exam';
import set01 from '../src/content/dedicated-packs/set-01.json' with { type: 'json' };

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const pack = set01 as DedicatedExamPack;
const retakeLabel = '不正解・未回答を解き直す';
const retakeResult = '模試の解き直し結果';
const originalLabel = '元の模試結果へ';

type Item = Pick<(typeof questions)[number], 'id' | 'prompt' | 'choices' | 'correctChoiceId'>;

async function readRows<T>(page: Page, databaseName: string, storeName: string): Promise<T[]> {
  return page.evaluate(
    ({ databaseName, storeName }) =>
      new Promise<unknown[]>((resolve, reject) => {
        const open = indexedDB.open(databaseName);
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result;
          const transaction = database.transaction(storeName, 'readonly');
          transaction.oncomplete = () => database.close();
          transaction.onabort = () => {
            database.close();
            reject(transaction.error);
          };
          const rows = transaction.objectStore(storeName).getAll();
          rows.onsuccess = () => resolve(rows.result);
        };
      }),
    { databaseName, storeName },
  ) as Promise<T[]>;
}

async function currentItem(quiz: Locator, items: readonly Item[]) {
  const title = quiz.getByRole('heading', { level: 1 });
  await expect(title).toBeVisible();
  const prompt = await title.innerText();
  const item = items.find((question) => question.prompt === prompt);
  expect(item, `Question should come from the selected pack: ${prompt}`).toBeDefined();
  return item!;
}

async function chooseAnswer(quiz: Locator, item: Item, correct: boolean) {
  const choice = item.choices.find((option) => (option.id === item.correctChoiceId) === correct)!;
  const escaped = choice.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const button = quiz
    .locator('button.choice')
    .filter({ hasText: new RegExp(`^\\s*[A-D]\\s*${escaped}\\s*$`) });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  return choice;
}

function exactButton(page: Page, name: string) {
  return page.getByRole('button', { name, exact: true });
}

function resultHeading(page: Page, name: string) {
  return page.getByRole('heading', { name, exact: true });
}

async function returnToOriginal(page: Page) {
  await page
    .getByRole('link', { name: originalLabel, exact: true })
    .or(exactButton(page, originalLabel))
    .click();
}

async function secondsDisplayed(timer: Locator) {
  const time = (await timer.innerText()).match(/\d+(?::\d{2}){1,2}/)![0];
  return time.split(':').reduce((total, part) => total * 60 + Number(part), 0);
}

test('dedicated exam retake uses a separate untimed subset and keeps the original result', async ({
  page,
}) => {
  const database = 'cpt-master-dedicated';
  const storedSessions = () => readRows<DedicatedExamSession>(page, database, 'sessions');
  await page.clock.install();
  await page.goto(appBase + '#/exam/full?set=' + pack.id, { waitUntil: 'domcontentloaded' });
  await exactButton(page, '155問の模試を始める').click();
  const quiz = page.locator('.dedicated-run');
  const first = await currentItem(quiz, pack.items);
  await chooseAnswer(quiz, first, true);
  await exactButton(page, '次の問題へ').click();
  await expect(quiz.locator('.quiz-top .pill')).toContainText('2 / 155');
  const second = await currentItem(quiz, pack.items);
  const wrong = await chooseAnswer(quiz, second, false);

  await exactButton(page, '中断する').click();
  const resume = exactButton(page, '保存した模試を再開する');
  await expect(resume).toBeVisible();
  const [paused] = await storedSessions();
  expect(paused.pausedRemainingMs).toBeGreaterThan(0);
  await page.clock.fastForward(60_000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(resume).toBeVisible();
  const [afterPause] = await storedSessions();
  expect(afterPause.pausedRemainingMs).toBe(paused.pausedRemainingMs);
  await resume.click();
  await expect(quiz.getByRole('heading', { name: second.prompt, exact: true })).toBeVisible();
  const timer = page.getByRole('timer', { name: '残り時間' });
  const resumedSeconds = await secondsDisplayed(timer);
  expect(resumedSeconds).toBeGreaterThanOrEqual(Math.ceil(paused.pausedRemainingMs! / 1000) - 5);
  await page.clock.fastForward(15_000);
  await expect.poll(() => secondsDisplayed(timer)).toBeLessThanOrEqual(resumedSeconds - 14);

  await exactButton(page, '受験を終了する').click();
  await exactButton(page, '提出して採点する').click();
  await expect(resultHeading(page, '専用模試の結果')).toBeVisible();
  const [original] = await storedSessions();
  expect(original.status).toBe('completed');
  expect(original.answers).toEqual({ [first.id]: first.correctChoiceId, [second.id]: wrong.id });
  expect(original.result?.total).toBe(140);
  const expectedIds = original.questionIds.filter((id) => id !== first.id);

  await exactButton(page, retakeLabel).click();
  await expect(quiz.locator('.quiz-top')).toContainText('解き直し');
  await expect(page.getByRole('timer')).toHaveCount(0);
  const active = (await storedSessions()).find((session) => session.id !== original.id)!;
  expect(active.status).toBe('active');
  expect(active.deadlineAt).toBeNull();
  expect(active.retakeOf).toBe(original.id);
  expect([...active.questionIds].sort()).toEqual(expectedIds.sort());
  expect(active.answers).toEqual({});
  const question = await currentItem(quiz, pack.items);
  expect(question.id).toBe(active.questionIds[0]);
  await chooseAnswer(quiz, question, true);
  await exactButton(page, '解き直しを終了する').click();
  await exactButton(page, '提出して採点する').click();
  await expect(resultHeading(page, retakeResult)).toBeVisible();

  const saved = await storedSessions();
  expect(saved).toHaveLength(2);
  expect(saved.find((session) => session.id === original.id)).toEqual(original);
  expect(saved.find((session) => session.id === active.id)).toMatchObject({
    status: 'completed',
    answers: { [question.id]: question.correctChoiceId },
    result: { correct: 1, total: expectedIds.length, unanswered: expectedIds.length - 1 },
  });
  await returnToOriginal(page);
  await expect(resultHeading(page, '専用模試の結果')).toBeVisible();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(resultHeading(page, '専用模試の結果')).toBeVisible();
  const history = page
    .getByRole('link', { name: '解き直し結果を見る', exact: true })
    .or(exactButton(page, '解き直し結果を見る'));
  await history.click();
  await expect(resultHeading(page, retakeResult)).toBeVisible();
});

test('short mock retake includes only wrong and unanswered items and records a separate result', async ({
  page,
}) => {
  const database = 'cpt-master';
  await page.clock.install();
  await page.goto(appBase + '#/exam', { waitUntil: 'domcontentloaded' });
  await page.getByRole('combobox', { name: '短縮模試の問題数', exact: true }).selectOption('10');
  await page
    .getByRole('combobox', { name: '短縮模試の時間モード', exact: true })
    .selectOption('continuous');
  await exactButton(page, '10問の短縮模試を始める').click();
  const quiz = page.locator('.quiz-card');
  await expect(quiz.getByRole('heading', { level: 1 })).toBeVisible();

  await exactButton(page, '保存して中断').click();
  const pausedMock = page.getByRole('link', { name: /一時停止中.*再開する/ });
  await expect(pausedMock).toBeVisible();
  const [paused] = await readRows<Session>(page, database, 'sessions');
  expect(paused.mock?.paused).toBe(true);
  const frozenSeconds = paused.mock!.remainingSeconds;
  await page.clock.fastForward(60_000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await pausedMock.click();
  const timer = page.getByRole('timer', { name: '短縮模試の残り時間' });
  await expect(timer).toContainText('停止中');
  expect(await secondsDisplayed(timer)).toBe(frozenSeconds);
  await exactButton(page, '模試を再開する').click();
  await expect(timer).not.toContainText('停止中');
  const resumedSeconds = await secondsDisplayed(timer);
  expect(resumedSeconds).toBeGreaterThanOrEqual(frozenSeconds - 5);
  await page.clock.fastForward(15_000);
  await expect.poll(() => secondsDisplayed(timer)).toBeLessThanOrEqual(resumedSeconds - 14);

  const missed: Item[] = [];
  for (let index = 1; index <= 10; index++) {
    await expect(page.locator('.quiz-top .pill')).toContainText(`${index} / 10`);
    const item = await currentItem(quiz, questions);
    if (index === 2 || index === 3) missed.push(item);
    if (index !== 3) await chooseAnswer(quiz, item, index !== 2);
    if (index < 10) await exactButton(page, '次の問題へ').click();
  }

  await exactButton(page, '採点して終了').click();
  await exactButton(page, 'この内容で採点する').click();
  await expect(resultHeading(page, '短縮模試の結果')).toBeVisible();
  const originalUrl = page.url();
  const [original] = await readRows<Session>(page, database, 'sessions');
  const originalAttempts = await readRows<Attempt>(page, database, 'attempts');
  expect(originalAttempts.filter((attempt) => attempt.correct)).toHaveLength(8);
  expect(originalAttempts.find((attempt) => attempt.questionId === missed[0].id)?.correct).toBe(
    false,
  );
  expect(originalAttempts.some((attempt) => attempt.questionId === missed[1].id)).toBe(false);

  await exactButton(page, retakeLabel).click();
  await expect(page.locator('.quiz-top .pill')).toContainText('模試の解き直し');
  await expect(page.getByRole('timer')).toHaveCount(0);
  const active = (await readRows<Session>(page, database, 'sessions')).find(
    (session) => session.id !== original.id,
  )!;
  expect(active.mockRetakeOf).toBe(original.id);
  expect([...active.questionIds].sort()).toEqual(missed.map((item) => item.id).sort());
  for (let index = 0; index < active.questionIds.length; index++) {
    await expect(page.locator('.quiz-top .pill')).toContainText(`${index + 1} / 2`);
    const item = await currentItem(quiz, questions);
    expect(item.id).toBe(active.questionIds[index]);
    await chooseAnswer(quiz, item, true);
    await exactButton(page, '回答を保存').click();
    await expect(quiz.locator('.exam-verdict')).toHaveText(/^○\s*正解$/);
    await exactButton(page, index === 0 ? '次の問題へ' : '結果を見る').click();
  }

  await expect(resultHeading(page, retakeResult)).toBeVisible();
  await expect(page.locator('.result-stats').first()).toContainText(/2\s*\/\s*2\s*問\s*正解/);
  const sessions = await readRows<Session>(page, database, 'sessions');
  expect(sessions).toHaveLength(2);
  expect(sessions.find((session) => session.id === original.id)).toEqual(original);
  expect(sessions.find((session) => session.id === active.id)?.status).toBe('completed');
  const attempts = await readRows<Attempt>(page, database, 'attempts');
  expect(attempts.filter((attempt) => attempt.sessionId === original.id)).toEqual(originalAttempts);
  expect(attempts.filter((attempt) => attempt.sessionId === active.id)).toHaveLength(2);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(resultHeading(page, retakeResult)).toBeVisible();
  await returnToOriginal(page);
  await expect(page).toHaveURL(originalUrl);
  await expect(resultHeading(page, '短縮模試の結果')).toBeVisible();
  await expect(
    page.locator('.mock-review-row').filter({ has: page.getByText('第2問', { exact: true }) }),
  ).toContainText('不正解');
  await expect(
    page.locator('.mock-review-row').filter({ has: page.getByText('第3問', { exact: true }) }),
  ).toContainText('未回答');
  await page.getByRole('link', { name: '解き直し結果を見る', exact: true }).click();
  await expect(resultHeading(page, retakeResult)).toBeVisible();
});
