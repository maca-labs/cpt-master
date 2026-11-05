import { expect, test } from '@playwright/test';
import { seedVideos, units } from '../src/content';
import { isRecommendedVideo } from '../src/engines/video-review';
const appBase = process.env.E2E_PUBLISHED_URL ?? '/';

test('new nutrition, load and consent reviews show their limited scope and independent states', async ({
  page,
}, testInfo) => {
  for (const youtubeId of ['TfNwhTGV-j0', 'FEl4xyx_usc', '0LyBXhgXzBE', 'y7BCOolGVcM']) {
    const video = seedVideos.find((v) => v.youtubeId === youtubeId)!;
    expect(isRecommendedVideo(video)).toBe(true);
    await page.goto(`${appBase}#/learn/${video.unitIds[0]}`);
    await expect(
      page.getByRole('heading', {
        name: units.find((u) => u.id === video.unitIds[0])!.title,
        exact: true,
      }),
    ).toBeVisible();
    const card = page
      .locator('article.video-card')
      .filter({ has: page.getByRole('heading', { name: video.title, exact: true }) });
    await expect(card).toContainText('おすすめ · AIによる');
    await expect(card.getByRole('link', { name: 'YouTubeで開く', exact: true })).toHaveAttribute(
      'href',
      video.url,
    );
    await card.locator('summary').click();
    await expect(card.locator('details')).toContainText(video.content.review!.coverage);
    await expect(card.locator('details')).toContainText(video.content.review!.limitations[0]);
    await expect(card.locator('details')).toContainText('人間の専門家');
    await expect(page.locator('#lesson-text')).not.toContainText('内容確認済み動画は未収録');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (youtubeId === 'TfNwhTGV-j0') {
      await expect(card).toContainText('埋め込み：未確認');
      await page.screenshot({
        path: `artifacts/video-v051-${testInfo.project.name}.png`,
        fullPage: false,
      });
    }
  }
});

test('new candidate stays a candidate after watched state and notes survive reload', async ({
  page,
}) => {
  const video = seedVideos.find((v) => v.youtubeId === 'ZRF9SjXkqUI')!;
  await page.goto(`${appBase}#/videos`);
  await page
    .getByRole('combobox', { name: '動画の対応単元', exact: true })
    .selectOption('ex-assess-bodycomp');
  const candidates = seedVideos.filter((v) => !isRecommendedVideo(v)).length;
  await page.getByRole('button', { name: `候補・確認保留 ${candidates}本`, exact: true }).click();
  const card = page
    .locator('article.video-card')
    .filter({ has: page.getByRole('heading', { name: video.title, exact: true }) });
  await expect(card).not.toContainText('おすすめ ·');
  const watched = card.getByRole('checkbox', {
    name: '視聴済みとして記録（習熟度とは別）',
    exact: true,
  });
  await watched.click();
  await expect(watched).toBeChecked();
  await card
    .getByRole('textbox', { name: '学習メモ', exact: true })
    .fill('体組成の測定条件は単元本文で確認する。動画内容は未確認。');
  await card.getByRole('button', { name: 'メモを保存', exact: true }).click();
  await page.reload();
  await page
    .getByRole('combobox', { name: '動画の対応単元', exact: true })
    .selectOption('ex-assess-bodycomp');
  await expect(card.getByRole('checkbox')).toBeChecked();
  await expect(card.getByRole('textbox', { name: '学習メモ', exact: true })).toHaveValue(
    '体組成の測定条件は単元本文で確認する。動画内容は未確認。',
  );
  await expect(card).not.toContainText('おすすめ ·');
});
