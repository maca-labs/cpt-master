import { expect, test, type Page } from '@playwright/test';
import { blueprint, domains } from '../src/content/blueprints';
import type {
  DedicatedExamItem,
  DedicatedExamPack,
  DedicatedExamSession,
} from '../src/engines/dedicated-exam';
import set01 from '../src/content/dedicated-packs/set-01.json' with { type: 'json' };
import set02 from '../src/content/dedicated-packs/set-02.json' with { type: 'json' };
import set03 from '../src/content/dedicated-packs/set-03.json' with { type: 'json' };

const published = process.env.E2E_PUBLISHED_URL;
const packs = [set01, set02, set03] as DedicatedExamPack[];
const mediaCounts = [29, 28, 26];

function savedSession(page: Page, pack: DedicatedExamPack) {
  return page.evaluate(
    (packKey) =>
      new Promise<DedicatedExamSession>((resolve, reject) => {
        const request = indexedDB.open('cpt-master-dedicated');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const transaction = database.transaction(['sessions', 'current']);
          transaction.oncomplete = () => database.close();
          transaction.onerror = () => reject(transaction.error);
          const pointer = transaction.objectStore('current').get(packKey);
          pointer.onsuccess = () => {
            if (!pointer.result) {
              reject(new Error('The dedicated exam session pointer was not saved.'));
              return;
            }
            const session = transaction.objectStore('sessions').get(pointer.result.sessionId);
            session.onsuccess = () =>
              session.result
                ? resolve(session.result as DedicatedExamSession)
                : reject(new Error('The dedicated exam session was not saved.'));
          };
        };
      }),
    pack.id + ':' + pack.revision,
  );
}

async function openNavigator(page: Page) {
  const navigator = page.locator('.dedicated-navigator');
  if ((await navigator.getAttribute('open')) === null)
    await navigator.getByText('解答状況・見直し', { exact: true }).click();
}

async function goToQuestion(page: Page, index: number, item: DedicatedExamItem) {
  await openNavigator(page);
  const entry = page.getByRole('button', { name: new RegExp(`^問題 ${index + 1}、`) });
  await entry.click();
  await expect(page.getByRole('heading', { name: item.prompt, exact: true })).toBeVisible();
  await expect(entry).toHaveAttribute('aria-current', 'step');
}

function correctOption(page: Page, item: DedicatedExamItem) {
  const answer = item.choices.find((choice) => choice.id === item.correctChoiceId)!;
  return page.getByRole('button', { name: answer.text, exact: true });
}

for (const [setIndex, pack] of packs.entries()) {
  test(`published dedicated exam set ${setIndex + 1} shows review status, resumes, and scores only 140 questions`, async ({
    page,
  }) => {
    test.skip(!published, 'GitHub Pages公開後にURLを指定して実行します。');
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.clock.install({ time: new Date('2026-11-08T03:00:00Z') });

    await page.goto(new URL('#/exam', published).href);
    const entry = page.locator('main a[href="#/exam/full"]');
    await expect(entry).toBeVisible();
    await entry.click();
    const selector = page.getByRole('combobox', { name: '専用模試セット' });
    await expect(selector.getByRole('option')).toHaveCount(3);
    await selector.selectOption(pack.id);
    const workspace = page.locator('.dedicated-workspace');
    await expect(workspace.getByRole('heading', { name: pack.title, exact: true })).toBeVisible();
    await expect(workspace).toContainText('AIによる出典照合済み');
    await expect(workspace).toContainText('人間の専門家レビューは未実施');
    await expect(workspace).toContainText('155問・180分・3択');
    expect(pack.items.filter((item) => item.media)).toHaveLength(mediaCounts[setIndex]);

    await page.getByRole('button', { name: '155問の模試を始める' }).click();
    await expect(page.getByRole('timer', { name: '残り時間' })).toBeVisible();
    const session = await savedSession(page, pack);
    if (session.deadlineAt === null) throw new Error('専用模試の締切がありません。');
    expect(session.deadlineAt - session.startedAt).toBe(blueprint.durationMinutes * 60_000);
    expect(new Set(session.questionIds).size).toBe(155);
    expect(session.questionIds).not.toEqual(pack.items.map((item) => item.id));
    expect(Object.values(session.choiceOrders).some((order) => order.join('') !== 'abc')).toBe(
      true,
    );
    const byId = new Map(pack.items.map((item) => [item.id, item]));
    const questions = session.questionIds.map((id, index) => ({ index, item: byId.get(id)! }));
    const { index: stillIndex, item: still } = questions.find(
      ({ item }) => item.media?.kind === 'diagram',
    )!;
    await goToQuestion(page, stillIndex, still);
    const diagram = page.getByRole('img', { name: still.media!.alt, exact: true });
    await expect(diagram).toBeVisible();
    await expect
      .poll(() => diagram.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
    expect(await diagram.evaluate((image: HTMLImageElement) => image.currentSrc)).toBe(
      new URL(still.media!.src, published).href,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );

    const animation = questions.find(({ item }) => item.media?.kind === 'animation');
    if (animation) {
      await goToQuestion(page, animation.index, animation.item);
      await page.getByRole('button', { name: 'アニメーションを再生' }).click();
      const animated = page.getByRole('img', { name: animation.item.media!.alt, exact: true });
      await expect
        .poll(() => animated.evaluate((image: HTMLImageElement) => image.naturalWidth))
        .toBeGreaterThan(0);
      await page.getByRole('button', { name: 'アニメーションを停止' }).click();
      await expect(animated).toHaveCount(0);
    }

    const unscored = questions.filter(({ item }) => !item.scored);
    const scored = questions.filter(({ item }) => item.scored);
    expect(unscored).toHaveLength(15);
    expect(scored).toHaveLength(140);
    const revised = scored.find(({ item }) => item.review.checkedAt === '2026-11-10')!;
    const [draft, ...remainingUnscored] = unscored;
    await goToQuestion(page, draft.index, draft.item);
    const draftOption = correctOption(page, draft.item);
    await draftOption.click();
    await expect(draftOption).toHaveAttribute('aria-pressed', 'true');
    const flag = page.getByRole('button', { name: '見直しフラグ' });
    await flag.click();
    await expect(flag).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: '中断する' }).click();
    await expect
      .poll(async () => (await savedSession(page, pack)).pausedRemainingMs ?? 0)
      .toBeGreaterThan(0);
    const paused = await savedSession(page, pack);
    expect(paused.deadlineAt).toBe(session.deadlineAt);
    await page.clock.fastForward(45_000);
    await page.reload();
    await expect(selector).toHaveValue(pack.id);
    expect((await savedSession(page, pack)).pausedRemainingMs).toBe(paused.pausedRemainingMs);
    await page.getByRole('button', { name: '保存した模試を再開する' }).click();
    await expect(draftOption).toHaveAttribute('aria-pressed', 'true');
    await expect(flag).toHaveAttribute('aria-pressed', 'true');
    const resumed = await savedSession(page, pack);
    if (resumed.deadlineAt === null) throw new Error('再開後の締切がありません。');
    expect(resumed.questionIds).toEqual(session.questionIds);
    expect(resumed.pausedRemainingMs).toBeUndefined();
    expect(resumed.deadlineAt - session.deadlineAt).toBeGreaterThanOrEqual(45_000);
    expect(resumed.index).toBe(draft.index);
    expect(await page.evaluate(() => Date.now())).toBeGreaterThanOrEqual(
      session.startedAt + 45_000,
    );

    for (const { index, item } of [...remainingUnscored, revised]) {
      await goToQuestion(page, index, item);
      const option = correctOption(page, item);
      await option.click();
      await expect(option).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(page.getByText('回答済み 16 / 155 問')).toBeVisible();
    await page.getByRole('button', { name: '受験を終了する' }).click();
    await page.getByRole('button', { name: '提出して採点する' }).click();
    await expect(page.getByRole('heading', { name: '専用模試の結果' })).toBeVisible();
    await expect(page.getByText('1 / 140 問', { exact: true })).toBeVisible();
    await expect(page.getByText(/全155問の回答数は 16 問/)).toBeVisible();
    await expect(page.getByText('139 問', { exact: true })).toBeVisible();
    const graded = await savedSession(page, pack);
    expect(graded.result?.answered).toBe(1);
    expect(graded.result?.domains.map(({ id, total }) => total === domains[id].scored)).toEqual([
      true,
      true,
      true,
      true,
    ]);

    await openNavigator(page);
    await page.getByRole('button', { name: new RegExp(`^問題 ${draft.index + 1}、`) }).click();
    await expect(
      page.getByRole('heading', { name: `問題 ${draft.index + 1} · 採点対象外`, exact: true }),
    ).toBeVisible();
    const source = draft.item.sourceRefs![0];
    await expect(
      page.getByRole('link', { name: source.title, exact: true }).first(),
    ).toHaveAttribute('href', source.url);
    await page.getByRole('button', { name: '問題一覧', exact: true }).click();
    await page
      .getByRole('button', { name: new RegExp(`^問題 ${revised.index + 1}、正解`) })
      .click();
    const review = page.locator('.dedicated-review');
    await expect(review.locator('.dedicated-review-prompt')).toHaveText(revised.item.prompt);
    await expect(review.locator('.explanation p')).toHaveText(revised.item.explanation);
    await expect(review.locator('.exam-verdict')).toHaveText(/^○\s*正解$/);
    await page.reload();
    await expect(page.getByText('1 / 140 問', { exact: true })).toBeVisible();
    expect(failures).toEqual([]);
  });
}
