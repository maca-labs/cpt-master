import { expect, test, type Locator } from '@playwright/test';
import { questions } from '../src/content';

const appBase = process.env.E2E_PUBLISHED_URL ?? '/';
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function selectAnswer(card: Locator, isCorrect: boolean) {
  const heading = card.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  const prompt = await heading.innerText();
  const question = questions.find((item) => item.prompt === prompt)!;
  const correct = question.choices.find((choice) => choice.id === question.correctChoiceId)!;
  const selected = isCorrect
    ? correct
    : question.choices.find((choice) => choice.id !== correct.id)!;
  const choiceButton = (text: string) =>
    card
      .locator('button.choice')
      .filter({ hasText: new RegExp(`^\\s*[A-D]\\s*${escapePattern(text)}\\s*$`) });
  const selectedButton = choiceButton(selected.text);
  const selectedLetter = await selectedButton.locator('span').first().innerText();
  const correctLetter = await choiceButton(correct.text).locator('span').first().innerText();
  await selectedButton.click();
  return {
    question,
    selectedLabel: `${selectedLetter}．${selected.text}`,
    correctLabel: `${correctLetter}．${correct.text}`,
  };
}

test('ordinary practice shows the verdict, answers and explanation in view immediately after saving', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'mobile' && process.env.E2E_NARROW_MOBILE === '1') {
    await page.setViewportSize({ width: 320, height: 568 });
  }
  await page.goto(appBase + '#/practice', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '問題演習を始める', exact: true }).click();
  const card = page.locator('.quiz-card');
  const feedback = card.locator('.practice-feedback');
  const explanation = card.locator('.explanation');
  const next = page.getByRole('button', { name: '次の問題へ', exact: true });

  for (const isCorrect of [false, true]) {
    const { question, correctLabel, selectedLabel } = await selectAnswer(card, isCorrect);
    await expect(explanation).toHaveCount(0);
    await expect(card.locator('.exam-verdict')).toHaveCount(0);
    await page.getByRole('button', { name: '回答を保存', exact: true }).click();

    // Only read the viewport after saving. Playwright clicks can otherwise scroll to the target.
    await expect(feedback.getByRole('heading', { name: '解答・解説', exact: true })).toBeFocused();
    const verdict = feedback.locator('.exam-verdict');
    await expect(verdict).toHaveText(isCorrect ? /^○\s*正解$/ : /^×\s*不正解$/);
    await expect(verdict).toBeInViewport({ ratio: 1 });
    const ownAnswer = feedback.getByText('あなたの回答', { exact: true }).locator('..');
    const correctAnswer = feedback.getByText('正答', { exact: true }).locator('..');
    await expect(ownAnswer.locator('dd')).toHaveText(selectedLabel);
    await expect(ownAnswer).toBeInViewport({ ratio: 1 });
    await expect(correctAnswer.locator('dd')).toHaveText(correctLabel);
    await expect(correctAnswer).toBeInViewport({ ratio: 1 });
    await expect(
      explanation.getByRole('heading', { name: '正答解説', exact: true }),
    ).toBeInViewport({ ratio: 1 });
    const rationale = explanation.locator(':scope > p').first();
    await expect(rationale).toHaveText(question.explanation);
    await expect(rationale).toBeInViewport({ ratio: 1 });
    await expect(next).toBeInViewport({ ratio: 1 });

    if (!isCorrect) {
      await next.click();
      const nextQuestion = card.getByRole('heading', { level: 1 });
      await expect(nextQuestion).not.toHaveText(question.prompt);
      await expect(nextQuestion).toBeFocused();
      await expect(explanation).toHaveCount(0);
    }
  }
});

test('the 50-question diagnosis still conceals scoring and explanation while in progress', async ({
  page,
}) => {
  await page.goto(appBase + '#/diagnostic', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '50問の診断を始める', exact: true }).click();
  const card = page.locator('.quiz-card');
  await selectAnswer(card, false);
  await page.getByRole('button', { name: '回答を保存', exact: true }).click();
  await expect(card.getByRole('status')).toContainText('解説は診断終了後に確認できます。');
  await expect(card.locator('.explanation, .exam-verdict')).toHaveCount(0);
  await expect(card.getByText('正答', { exact: true })).toHaveCount(0);
  await expect(card.getByText('あなたの回答', { exact: true })).toHaveCount(0);
});
