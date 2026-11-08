import { expect, test } from '@playwright/test';
import { seedVideos, units } from '../src/content';
import { videoV062Additions } from '../src/content/video-additions-v062';
import { isRecommendedVideo } from '../src/engines/video-review';

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const unitIds = [
  'ed3-assess-test-methods',
  'ed3-plan-neuro',
  'ed3-safe-first-aid',
  'ed3-tech-resistance-tools',
];

test('new lesson videos show checked evidence and separate candidates', async ({ page }) => {
  for (const unitId of unitIds) {
    const unit = units.find((item) => item.id === unitId)!;
    const additions = videoV062Additions.filter((video) => video.unitIds.includes(unitId));
    const recommended = additions.filter((video) => isRecommendedVideo(video, unitId));
    expect(recommended.length, unit.title).toBeGreaterThan(0);

    await page.goto(appBase + '#/learn/' + unitId);
    await expect(page.getByRole('heading', { name: unit.title, exact: true })).toBeVisible();
    const section = page.locator('#lesson-videos');
    await expect(section.locator('article.video-card')).toHaveCount(additions.length);
    await expect(section.getByRole('heading', { name: '内容を照合したおすすめ' })).toBeVisible();

    for (const video of additions) {
      const card = section.locator('article.video-card').filter({
        has: page.getByRole('heading', { name: video.title, exact: true }),
      });
      await expect(card.getByRole('link', { name: 'YouTubeで開く', exact: true })).toHaveAttribute(
        'href',
        video.url,
      );
      if (isRecommendedVideo(video, unitId)) {
        await expect(card).toContainText('おすすめ · AIによる');
        await card.locator('summary').click();
        await expect(card.locator('details')).toContainText(video.content.review!.coverage);
      } else {
        await expect(card).not.toContainText('おすすめ ·');
        await expect(
          section.getByRole('heading', { name: '未確認・確認保留の候補' }),
        ).toBeVisible();
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }

  await page.goto(appBase + '#/videos');
  const heldCount = seedVideos.filter((video) => !isRecommendedVideo(video)).length;
  await page
    .getByRole('button', { name: '候補・確認保留 ' + heldCount + '本', exact: true })
    .click();
  const held = videoV062Additions.find((video) => !isRecommendedVideo(video))!;
  const checked = videoV062Additions.find((video) => isRecommendedVideo(video))!;
  await expect(page.getByRole('heading', { name: held.title, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: checked.title, exact: true })).toHaveCount(0);
});
