import { expect, test } from '@playwright/test';
import { seedVideos, units } from '../src/content';
import { videoV052Updates } from '../src/content/video-additions-v052';
import { isRecommendedVideo } from '../src/engines/video-review';

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const pendingUnits = [
  'ex-plan-age',
  'ex-plan-pregnancy',
  'ex-safe-eap',
  'ex-safe-cpr',
  'ex-safe-conditions',
  'ex-plan-power',
  'ex-tech-power',
  'ex-assess-quality',
  'ex-assess-adult-tests',
];

test('all nine newly reviewed units show scoped recommendations and keep held candidates separate', async ({
  page,
}) => {
  for (const id of pendingUnits) {
    const unit = units.find((item) => item.id === id)!;
    const reviewed = videoV052Updates.find((video) => isRecommendedVideo(video, id))!;
    expect(reviewed, id).toBeDefined();
    await page.goto(`${appBase}#/learn/${id}`);
    await expect(page.getByRole('heading', { name: unit.title, exact: true })).toBeVisible();
    const card = page.locator('article.video-card').filter({
      has: page.getByRole('heading', { name: reviewed.title, exact: true }),
    });
    await expect(card).toContainText('おすすめ · AIによる');
    await card.locator('summary').click();
    await expect(card.locator('details')).toContainText(reviewed.content.review!.coverage);
    await expect(card.locator('details')).toContainText(reviewed.content.review!.limitations[0]);
    await expect(card.getByRole('link', { name: 'YouTubeで開く', exact: true })).toHaveAttribute(
      'href',
      reviewed.url,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.goto(`${appBase}#/videos`);
  const heldCount = seedVideos.filter((video) => !isRecommendedVideo(video)).length;
  await page.getByRole('button', { name: `候補・確認保留 ${heldCount}本`, exact: true }).click();
  const held = seedVideos.find((video) => video.youtubeId === 'naxwLgfB644')!;
  const heldCard = page.locator('article.video-card').filter({
    has: page.getByRole('heading', { name: held.title, exact: true }),
  });
  await expect(heldCard).toBeVisible();
  await expect(heldCard).not.toContainText('おすすめ ·');
  const checked = seedVideos.find((video) => video.youtubeId === 'c8IVgIjC22k')!;
  await expect(page.getByRole('heading', { name: checked.title, exact: true })).toHaveCount(0);
});
