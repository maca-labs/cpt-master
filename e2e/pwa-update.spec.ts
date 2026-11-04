import { expect, test as base, type Page } from '@playwright/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import type { Session } from '../src/domain/types';

const ORIGIN = 'http://127.0.0.1:5174';
const helper = fileURLToPath(new URL('../scripts/pwa-test-server.mjs', import.meta.url));
const test = base.extend<{}, { pwaServer: string }>({
  pwaServer: [
    async ({}, use, workerInfo) => {
      if (workerInfo.config.workers !== 1)
        throw new Error('PWA update tests require --workers=1 for their dedicated 5174 server.');
      const child = spawn(process.execPath, [helper], {
        cwd: fileURLToPath(new URL('..', import.meta.url)),
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let output = '';
      const stopOwnedChild = () => {
        if (child.exitCode === null && child.signalCode === null) child.kill();
      };
      process.once('exit', stopOwnedChild);
      try {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error(`PWA helper startup timed out: ${output}`)),
            15000,
          );
          child.stdout?.on('data', (data) => {
            output += String(data);
            if (output.includes('PWA_TEST_SERVER_READY')) {
              clearTimeout(timer);
              resolve();
            }
          });
          child.stderr?.on('data', (data) => {
            output += String(data);
          });
          child.once('error', (error) => {
            clearTimeout(timer);
            reject(error);
          });
          child.once('exit', (code) => {
            clearTimeout(timer);
            reject(new Error(`PWA helper exited (${code}): ${output}`));
          });
        });
        await use(ORIGIN);
      } finally {
        process.removeListener('exit', stopOwnedChild);
        const exited =
          child.exitCode !== null || child.signalCode !== null
            ? Promise.resolve()
            : once(child, 'exit');
        stopOwnedChild();
        await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 3000))]);
        // Only this spawned child's PID is ever targeted; existing preview
        // servers, including the user's 5173 server, are never reused or stopped.
        if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
      }
    },
    { scope: 'worker' },
  ],
});

async function warmControlledApp(page: Page, origin: string) {
  await page.goto(`${origin}/#/exam`);
  await expect(
    page.getByRole('heading', { name: '10・20・50問の短縮模試', exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('pwa-status')).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), {
      timeout: 20000,
    })
    .toBe(true);
  await expect(
    page.getByRole('heading', { name: '10・20・50問の短縮模試', exact: true }),
  ).toBeVisible();
}

async function savedSession(page: Page, id: string): Promise<Session> {
  return page.evaluate(
    (sessionId) =>
      new Promise<Session>((resolve, reject) => {
        const opening = indexedDB.open('cpt-master');
        opening.onerror = () => reject(opening.error);
        opening.onsuccess = () => {
          const database = opening.result;
          const request = database
            .transaction('sessions', 'readonly')
            .objectStore('sessions')
            .get(sessionId);
          request.onerror = () => {
            database.close();
            reject(request.error);
          };
          request.onsuccess = () => {
            database.close();
            resolve(request.result as Session);
          };
        };
      }),
    id,
  );
}

async function startMockWithDraftAndFlag(page: Page) {
  await page.getByRole('combobox', { name: '短縮模試の問題数', exact: true }).selectOption('10');
  await page
    .getByRole('combobox', { name: '短縮模試の時間モード', exact: true })
    .selectOption('study');
  await page.getByRole('button', { name: '10問の短縮模試を始める', exact: true }).click();
  await expect(page).toHaveURL(/#\/exam\/[^/]+$/);
  await expect(page.locator('.quiz-card h1')).toBeVisible();
  const id = new URL(page.url()).hash.replace('#/exam/', '');
  const choice = page.locator('button.choice').first();
  const choiceText = (await choice.textContent()) ?? '';
  await choice.click();
  await expect(
    page.getByText('下書きを保存しました。採点は終了時に行います。', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'フラグを付ける', exact: true }).click();
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
  const stored = await savedSession(page, id);
  const qid = stored.questionIds[stored.index];
  expect(stored.mock!.draftAnswers[qid]).toBeTruthy();
  expect(stored.mock!.flags).toContain(qid);
  return { id, qid, choiceText };
}

async function markDocument(page: Page) {
  return page.evaluate(() => {
    const target = window as Window & {
      __pwaDocumentToken?: string;
      __pwaInitialController?: ServiceWorker | null;
    };
    target.__pwaDocumentToken = crypto.randomUUID();
    target.__pwaInitialController = navigator.serviceWorker.controller;
    return target.__pwaDocumentToken;
  });
}
async function documentToken(page: Page) {
  return page.evaluate(
    () => (window as Window & { __pwaDocumentToken?: string }).__pwaDocumentToken ?? null,
  );
}
async function requestUpdateThroughUi(page: Page, origin: string) {
  const response = await page.request.post(`${origin}/__test_revision`);
  expect(response.status()).toBe(200);
  const summary = page
    .getByTestId('pwa-status')
    .locator('summary')
    .filter({ hasText: 'オフライン学習・ホーム画面への追加' });
  await summary.click();
  await page.getByRole('button', { name: '更新を確認する', exact: true }).click();
  await expect
    .poll(
      () =>
        page.evaluate(async () =>
          Boolean((await navigator.serviceWorker.getRegistration())?.waiting),
        ),
      { timeout: 25000 },
    )
    .toBe(true);
  await expect(page.getByTestId('pwa-update-notice')).toBeVisible({ timeout: 25000 });
}
async function applyThroughUi(page: Page) {
  await page
    .getByRole('checkbox', {
      name: '必要な回答・メモを保存し、再読み込みしてよいことを確認しました',
      exact: true,
    })
    .check();
  const reload = page.waitForEvent('load', { timeout: 25000 });
  await page.getByRole('button', { name: '更新して再読み込み', exact: true }).click();
  await reload;
  await expect(page.getByTestId('pwa-status')).toBeVisible();
}

test('a real PWA update waits for mock interruption and preserves saved answers and flags', async ({
  page,
  pwaServer,
}) => {
  await warmControlledApp(page, pwaServer);
  const { id, qid, choiceText } = await startMockWithDraftAndFlag(page);
  const token = await markDocument(page);
  await requestUpdateThroughUi(page, pwaServer);
  await expect(page.getByTestId('pwa-update-blocked')).toBeVisible();
  await expect(
    page.getByRole('button', { name: '更新して再読み込み', exact: true }),
  ).toBeDisabled();
  expect(await documentToken(page)).toBe(token);
  await page.getByRole('button', { name: '保存して中断', exact: true }).click();
  await expect(page).toHaveURL(`${pwaServer}/#/exam`);
  const paused = await savedSession(page, id);
  expect(paused.mock!.paused).toBe(true);
  await applyThroughUi(page);
  expect(await documentToken(page)).toBeNull();
  const restored = await savedSession(page, id);
  expect(restored.mock!.draftAnswers).toEqual(paused.mock!.draftAnswers);
  expect(restored.mock!.flags).toEqual(paused.mock!.flags);
  expect(restored.mock!.flags).toContain(qid);
  await page.locator(`a[href="#/exam/${id}"]`).click();
  await page.getByRole('button', { name: '模試を再開する', exact: true }).click();
  await expect(page.locator('button.choice[aria-pressed="true"]')).toHaveText(choiceText);
  await expect(page.getByRole('button', { name: 'フラグを解除', exact: true })).toBeVisible();
});

test('activation from another tab never reloads a tab that is answering a mock', async ({
  page,
  context,
  pwaServer,
}) => {
  await warmControlledApp(page, pwaServer);
  const { id, qid } = await startMockWithDraftAndFlag(page);
  const token = await markDocument(page);
  const before = await savedSession(page, id);
  const updater = await context.newPage();
  try {
    await updater.goto(`${pwaServer}/#/settings`);
    await expect(updater.getByTestId('pwa-status')).toBeVisible();
    await expect
      .poll(() => updater.evaluate(() => Boolean(navigator.serviceWorker.controller)))
      .toBe(true);
    await requestUpdateThroughUi(updater, pwaServer);
    await expect(page.getByTestId('pwa-update-notice')).toBeVisible({ timeout: 20000 });
    await applyThroughUi(updater);
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              navigator.serviceWorker.controller !==
              (window as Window & { __pwaInitialController?: ServiceWorker | null })
                .__pwaInitialController,
          ),
        { timeout: 20000 },
      )
      .toBe(true);
    expect(await documentToken(page)).toBe(token);
    await expect(page).toHaveURL(`${pwaServer}/#/exam/${id}`);
    await expect(
      page.getByRole('button', { name: '更新して再読み込み', exact: true }),
    ).toBeDisabled();
    await expect(page.getByTestId('pwa-update-blocked')).toBeVisible();
    const after = await savedSession(page, id);
    expect(after.mock!.draftAnswers[qid]).toEqual(before.mock!.draftAnswers[qid]);
    expect(after.mock!.flags).toEqual(before.mock!.flags);
  } finally {
    await updater.close();
  }
});
