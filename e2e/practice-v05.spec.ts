import { expect, test, type Page } from '@playwright/test';
import { questions } from '../src/content';
import { expansionQuestionIds } from '../src/content/batches';
import type { Exposure, Session } from '../src/domain/types';
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function ready(page: Page) {
  await page.goto('/#/practice');
  await expect(page.getByRole('combobox', { name: '教材の範囲', exact: true })).toBeVisible();
}
async function rows<T>(page: Page, name: string): Promise<T[]> {
  return page.evaluate(
    (store) =>
      new Promise<unknown[]>((resolve, reject) => {
        const open = indexedDB.open('cpt-master');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result,
            request = database.transaction(store).objectStore(store).getAll();
          request.onerror = () => {
            database.close();
            reject(request.error);
          };
          request.onsuccess = () => {
            database.close();
            resolve(request.result);
          };
        };
      }),
    name,
  ) as Promise<T[]>;
}
async function addedStrict(page: Page, count: '10' | '20' | '50' = '10') {
  await page
    .getByRole('combobox', { name: '教材の範囲', exact: true })
    .selectOption('expansion-2026-11-04');
  await page
    .getByRole('combobox', { name: '出題と評価の方法', exact: true })
    .selectOption('strict_unseen');
  await page.getByRole('combobox', { name: '演習の問題数', exact: true }).selectOption(count);
}

test('additional-only strict practice records displays before render, excludes peeked answers, resumes and links back to goals', async ({
  page,
}) => {
  await ready(page);
  await addedStrict(page, '50');
  await expect(page.getByText('次回の配分：', { exact: false })).toContainText('面談・評価 12問');
  await addedStrict(page);
  await page.getByRole('button', { name: '問題演習を始める', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  const session = (await rows<Session>(page, 'sessions'))[0];
  expect(session.practice).toEqual({
    batch: 'expansion-2026-11-04',
    selection: 'strict_unseen',
    requestedCount: 10,
  });
  expect(session.questionIds.every((id) => expansionQuestionIds.has(id))).toBe(true);
  const prompt = await page.locator('.quiz-card h1').innerText();
  const question = questions.find((question) => question.prompt === prompt)!;
  expect(
    (await rows<Exposure>(page, 'exposures')).some(
      (exposure) => exposure.questionId === question.id && exposure.kind === 'question',
    ),
  ).toBe(true);
  await page
    .getByRole('button', { name: '先に解説を見る（初見評価から除外）', exact: true })
    .click();
  await expect(page.locator('.explanation')).toBeVisible();
  expect(
    (await rows<Exposure>(page, 'exposures')).some(
      (exposure) => exposure.questionId === question.id && exposure.kind === 'explanation',
    ),
  ).toBe(true);
  await page.reload();
  await expect(page.locator('.quiz-card h1')).toHaveText(prompt);
  await expect(
    page.getByRole('status').filter({ hasText: '厳密な未見評価の正答率からは除外' }),
  ).toBeVisible();
  for (let index = 0; index < 10; index++) {
    const prompt = await page.locator('.quiz-card h1').innerText(),
      current = questions.find((question) => question.prompt === prompt)!;
    const correct = current.choices.find((choice) => choice.id === current.correctChoiceId)!;
    await page
      .locator('button.choice')
      .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escape(correct.text)}\\s*$`) })
      .click();
    if (index > 0)
      await page
        .getByRole('checkbox', {
          name: 'この答えを選ぶ根拠を、自分の言葉で説明できる',
          exact: true,
        })
        .check();
    await page.getByRole('button', { name: '回答を保存', exact: true }).click();
    await expect(page.locator('.answer-notice')).toBeVisible();
    await page
      .getByRole('button', { name: index === 9 ? '結果を見る' : '次の問題へ', exact: true })
      .click();
    if (index < 9) await expect(page.locator('.quiz-top .pill')).toContainText(`${index + 2} / 10`);
  }
  await expect(page.getByText('厳密な未見評価は9問が対象です。', { exact: false })).toBeVisible();
  await expect(page.locator('.result-stats').first()).toContainText('9 / 9問 正解');
  await expect(
    page.getByRole('heading', { name: '誤答・根拠が曖昧だった学習目標へ', exact: true }),
  ).toBeVisible();
  const body = page.getByRole('link', { name: '本文・確認問題へ', exact: false }).first();
  await expect(body).toHaveAttribute('href', `#/learn/${question.unitId}`);
  await page.goto('/#/analytics');
  const history = page.getByRole('region', { name: '完了した学習の成績表', exact: true });
  const evaluated = history.getByRole('row').filter({ hasText: '追加200問・厳密未見' });
  await expect(evaluated).toContainText('9/9問');
  await expect(evaluated).toContainText('出題10・除外1');
  await ready(page);
  await addedStrict(page);
  await expect(page.getByLabel('演習の在庫')).toContainText('190問');
  await expect(page.locator('.list-row').filter({ hasText: '未見 100%' })).toContainText(
    '評価対象 9問 / 除外 1問',
  );
  await page.getByRole('button', { name: '問題演習を始める', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  const next = (await rows<Session>(page, 'sessions')).find(
    (candidate) => candidate.id !== session.id,
  )!;
  expect(next.questionIds.some((id) => session.questionIds.includes(id))).toBe(false);
  await page.getByRole('link', { name: '保存して中断', exact: true }).click();
  await addedStrict(page);
  await expect(page.getByLabel('演習の在庫')).toContainText('180問');
  await expect(page.getByLabel('演習の在庫')).toContainText('中断中の厳密評価で予約10問');
});

test('strict practice reports scarce stock and only starts fewer questions after an explicit choice', async ({
  page,
}) => {
  await ready(page);
  const selected = questions.filter((question) => expansionQuestionIds.has(question.id)).slice(3);
  const session: Session = {
    id: 'inventory-fixture',
    mode: 'practice',
    status: 'completed',
    questionIds: selected.map((question) => question.id),
    choiceOrders: Object.fromEntries(
      selected.map((question) => [question.id, question.choices.map((choice) => choice.id)]),
    ),
    firstSeenByQuestion: Object.fromEntries(selected.map((question) => [question.id, true])),
    index: 0,
    startedAt: '2026-11-04T00:00:00.000Z',
    completedAt: '2026-11-04T01:00:00.000Z',
  };
  const exposures = selected.map((question) => ({
    id: `inventory:${question.id}`,
    questionId: question.id,
    groupId: question.groupId,
    kind: 'explanation' as const,
    sessionId: session.id,
    at: '2026-11-04T00:00:00.000Z',
  }));
  await page.evaluate(
    ({ session, exposures }) =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('cpt-master');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result,
            tx = database.transaction(['sessions', 'exposures'], 'readwrite');
          tx.objectStore('sessions').put(session);
          exposures.forEach((exposure) => tx.objectStore('exposures').put(exposure));
          tx.oncomplete = () => {
            database.close();
            resolve();
          };
          tx.onerror = () => {
            database.close();
            reject(tx.error);
          };
        };
      }),
    { session, exposures },
  );
  await page.reload();
  await addedStrict(page);
  await expect(page.getByRole('button', { name: '問題演習を始める', exact: true })).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('7問不足');
  await page.getByRole('button', { name: '利用可能な3問で始める', exact: true }).click();
  await expect(page.locator('.quiz-top .pill')).toContainText('1 / 3');
  const started = (await rows<Session>(page, 'sessions')).find(
    (candidate) => candidate.id !== session.id,
  )!;
  expect(started.questionIds).toHaveLength(3);
  expect(started.practice?.requestedCount).toBe(10);
  expect(started.questionIds.some((id) => session.questionIds.includes(id))).toBe(false);
});

test('an older unshown practice cannot consume a group later reserved by strict evaluation', async ({
  page,
}) => {
  await ready(page);
  const selected = questions
    .filter((question) => expansionQuestionIds.has(question.id))
    .slice(0, 10);
  const fixture = (id: string, ids: typeof selected): Session => ({
    id,
    mode: 'practice',
    status: 'active',
    questionIds: ids.map((question) => question.id),
    choiceOrders: Object.fromEntries(
      ids.map((question) => [question.id, question.choices.map((choice) => choice.id)]),
    ),
    firstSeenByQuestion: Object.fromEntries(ids.map((question) => [question.id, true])),
    index: 0,
    startedAt: '2026-11-04T00:00:00.000Z',
  });
  const older = fixture('old-unshown', [selected[0]]),
    strict = fixture('new-strict', selected);
  strict.practice = {
    batch: 'expansion-2026-11-04',
    selection: 'strict_unseen',
    requestedCount: 10,
  };
  await page.evaluate(
    (sessions) =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('cpt-master');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result,
            tx = database.transaction('sessions', 'readwrite');
          sessions.forEach((session) => tx.objectStore('sessions').put(session));
          tx.oncomplete = () => {
            database.close();
            resolve();
          };
          tx.onerror = () => {
            database.close();
            reject(tx.error);
          };
        };
      }),
    [older, strict],
  );
  await page.goto(`/#/session/${older.id}`);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: '別の厳密な未見評価で予約中です', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.quiz-card h1')).toHaveCount(0);
  expect(await rows<Exposure>(page, 'exposures')).toHaveLength(0);
  await page.getByRole('link', { name: '予約中の評価を再開する', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toHaveText(selected[0].prompt);
  expect((await rows<Exposure>(page, 'exposures')).map((exposure) => exposure.sessionId)).toEqual([
    strict.id,
  ]);
});

test('an old completed practice result preserves groups reserved by a later strict evaluation', async ({
  page,
}) => {
  await ready(page);
  const selected = questions
    .filter((question) => expansionQuestionIds.has(question.id))
    .slice(0, 10);
  const base: Session = {
    id: 'old-completed-unshown',
    mode: 'practice',
    status: 'completed',
    questionIds: selected.map((question) => question.id),
    choiceOrders: Object.fromEntries(
      selected.map((question) => [question.id, question.choices.map((choice) => choice.id)]),
    ),
    firstSeenByQuestion: Object.fromEntries(selected.map((question) => [question.id, true])),
    index: 0,
    startedAt: '2026-11-04T00:00:00.000Z',
    completedAt: '2026-11-04T01:00:00.000Z',
  };
  const strict: Session = {
    ...base,
    id: 'strict-after-completed',
    status: 'active',
    completedAt: undefined,
    practice: { batch: 'expansion-2026-11-04', selection: 'strict_unseen', requestedCount: 10 },
  };
  await page.evaluate(
    (sessions) =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('cpt-master');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result,
            tx = database.transaction('sessions', 'readwrite');
          sessions.forEach((session) => tx.objectStore('sessions').put(session));
          tx.oncomplete = () => {
            database.close();
            resolve();
          };
          tx.onerror = () => {
            database.close();
            reject(tx.error);
          };
        };
      }),
    [base, strict],
  );
  await page.goto(`/#/results/${base.id}`);
  await page.reload();
  await expect(
    page.getByRole('heading', {
      name: '未見評価の予約を守るため、結果の問題一覧を保留しています',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('.result-question')).toHaveCount(0);
  expect(await rows<Exposure>(page, 'exposures')).toHaveLength(0);
  await page.getByRole('link', { name: '予約中の未見評価を再開する', exact: true }).click();
  await expect(page.locator('.quiz-card h1')).toHaveText(selected[0].prompt);
  expect((await rows<Exposure>(page, 'exposures')).map((exposure) => exposure.sessionId)).toEqual([
    strict.id,
  ]);
});
