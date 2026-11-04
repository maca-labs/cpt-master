import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { questions, units } from '../src/content';
import { createSession } from '../src/engines/learning';
import type { Session } from '../src/domain/types';
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ready = async (page: Page, path: string) => {
  await page.goto(`${process.env.E2E_PUBLISHED_URL ?? '/'}#${path}`);
  await expect(page.locator('main')).toBeVisible();
};
async function allRows(page: Page, name: string) {
  return page.evaluate(
    (name) =>
      new Promise<unknown[]>((resolve, reject) => {
        const request = indexedDB.open('cpt-master');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result,
            read = db.transaction(name).objectStore(name).getAll();
          read.onsuccess = () => {
            db.close();
            resolve(read.result);
          };
          read.onerror = () => {
            db.close();
            reject(read.error);
          };
        };
      }),
    name,
  );
}
async function putSession(page: Page, session: Session) {
  await page.evaluate(
    (session) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('cpt-master');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result,
            tx = db.transaction('sessions', 'readwrite');
          tx.objectStore('sessions').put(session);
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
        };
      }),
    session,
  );
}
test('old backup preflight, new lesson learning, persistence and invalid restore protection', async ({
  page,
}, info) => {
  await ready(page, '/settings');
  await expect(page.locator('.version')).toHaveText('PERSONAL EDITION · v0.4.0');
  const text = await readFile(
      new URL('../tests/fixtures/legacy-v1-backup.json', import.meta.url),
      'utf8',
    ),
    old = JSON.parse(text);
  await page.getByLabel('バックアップJSONを選択', { exact: true }).setInputFiles({
    name: 'legacy.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text),
  });
  await expect(
    page.getByRole('heading', { name: '事前検査が完了しました', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '復元前バックアップを保存してマージ', exact: true }),
  ).toBeDisabled();
  await page.getByRole('checkbox', { name: '内容とマージ方法を確認しました', exact: true }).check();
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: '復元前バックアップを保存してマージ', exact: true })
    .click();
  await download;
  await expect(page.getByRole('status').filter({ hasText: '復元しました。' })).toBeVisible();
  expect(await allRows(page, 'attempts')).toEqual(old.data.attempts);
  expect(await allRows(page, 'unitProgress')).toEqual(old.data.unitProgress);
  expect(await allRows(page, 'videoProgress')).toEqual(old.data.videoProgress);
  await ready(page, '/learn/ex-plan-load');
  await expect(
    page.getByRole('heading', {
      name: units.find((u) => u.id === 'ex-plan-load')!.title,
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: '単元メモ', exact: true })
    .fill('旧版の記録を残して、新しい負荷計算を学ぶ。');
  await page.getByRole('button', { name: 'メモを保存', exact: true }).click();
  await page.getByRole('button', { name: '確認問題を解く（8問）', exact: true }).click();
  const prompt = await page.locator('.quiz-card h1').innerText(),
    q = questions.find((q) => q.prompt === prompt)!;
  const correct = q.choices.find((c) => c.id === q.correctChoiceId)!;
  await page
    .locator('button.choice')
    .filter({ hasText: new RegExp(`^\\s*[A-C]\\s*${escape(correct.text)}\\s*$`) })
    .click();
  await page.getByRole('button', { name: '回答を保存', exact: true }).click();
  await expect(page.locator('.answer-notice')).toContainText('正解です');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '復習に登録', exact: true }).click();
  await page.reload();
  await expect(page.locator('.answer-notice')).toBeVisible();
  const attempts = await allRows(page, 'attempts');
  expect(attempts).toHaveLength(old.data.attempts.length + 1);
  expect(attempts).toContainEqual(old.data.attempts[0]);
  expect((await allRows(page, 'reviews')).some((r: any) => r.questionId === q.id && r.manual)).toBe(
    true,
  );
  await ready(page, '/learn/ex-plan-load');
  await expect(page.getByRole('textbox', { name: '単元メモ', exact: true })).toHaveValue(
    '旧版の記録を残して、新しい負荷計算を学ぶ。',
  );
  const width = await page.evaluate(() => ({
    actual: document.documentElement.scrollWidth,
    available: innerWidth,
  }));
  expect(width.actual).toBeLessThanOrEqual(width.available);
  await page.screenshot({
    path: `artifacts/expansion-lesson-${info.project.name}.png`,
    fullPage: true,
  });
  await ready(page, '/settings');
  const bad = structuredClone(old);
  bad.data.favorites.push({ questionId: 'ex-tech-001' });
  await page.getByLabel('バックアップJSONを選択', { exact: true }).setInputFiles({
    name: 'invalid-legacy.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(bad)),
  });
  await expect(page.getByRole('alert')).toBeVisible();
  expect(await allRows(page, 'attempts')).toEqual(attempts);
});
test('all original diagrams and animations render and preserve answers offline', async ({
  page,
  context,
}, info) => {
  await ready(page, '/settings');
  const media = questions.filter((q) => q.media);
  expect(media).toHaveLength(12);
  for (const q of media) {
    const session = createSession('practice', [q], [], [], () => 0.25);
    await putSession(page, session);
    await ready(page, `/session/${session.id}`);
    await page.reload();
    await expect(page.locator('.quiz-card h1')).toHaveText(q.prompt);
    const figure = page.getByTestId('question-media');
    await expect(figure).toBeVisible();
    await expect(figure.locator('svg')).toHaveAccessibleName(q.media!.alt);
    await expect(figure).toContainText('実写動画ではない');
    if (q.media!.kind === 'sequence') {
      const frames = await figure.getByRole('button', { name: /^コマ / }).all();
      for (let i = 0; i < frames.length; i++) {
        await frames[i].click();
        if (q.id === 'ex-tech-049') {
          const aboveFloor = await figure.evaluate((element) => {
            const body = element.querySelector('polyline') as SVGPolylineElement;
            const floor = element.querySelector('[data-testid="media-floor"]') as SVGPathElement;
            return (
              body.points.getItem(body.points.numberOfItems - 1).y < floor.getPointAtLength(0).y
            );
          });
          expect(aboveFloor, '空中のコマだけ足部が地面より上にある').toBe(i === 0);
        }
        await page.screenshot({
          path: `artifacts/media-${q.id}-frame-${i}-${info.project.name}.png`,
          fullPage: true,
        });
      }
      await figure.getByRole('button', { name: 'コマ B', exact: true }).click();
      await expect(figure).toContainText('表示 B');
      await figure.getByRole('button', { name: 'アニメーションを再生', exact: true }).click();
      await expect(figure.getByText('表示 A', { exact: true })).toBeVisible({ timeout: 5000 });
      await figure.getByRole('button', { name: '一時停止', exact: true }).click();
    }
    const width = await page.evaluate(() => ({
      actual: document.documentElement.scrollWidth,
      available: innerWidth,
    }));
    expect(width.actual).toBeLessThanOrEqual(width.available);
    await page.screenshot({
      path: `artifacts/media-${q.id}-${info.project.name}.png`,
      fullPage: true,
    });
  }
  // Use a controlled offline tab only after the real generated worker is ready.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))))
    await page.reload();
  await context.setOffline(true);
  try {
    await page.reload();
    await expect(page.getByTestId('question-media')).toBeVisible();
    const q = media.at(-1)!;
    await page
      .locator('button.choice')
      .filter({
        hasText: new RegExp(
          `^\\s*[A-C]\\s*${escape(q.choices.find((c) => c.id === q.correctChoiceId)!.text)}\\s*$`,
        ),
      })
      .click();
    await page.getByRole('button', { name: '回答を保存', exact: true }).click();
    await expect(page.locator('.answer-notice')).toContainText('正解です');
    await page.reload();
    await expect(page.locator('.answer-notice')).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
