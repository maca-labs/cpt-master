import { foundationUnits, foundationQuestions, foundationSources } from './foundations';
import { appliedUnits, appliedQuestions, appliedSources } from './applied';
import { blueprintSources } from './blueprints';
import { videoReviewSources } from './video-reviews';
export { seedVideos } from './videos';
export const units = [...foundationUnits, ...appliedUnits];
export const questions = [...foundationQuestions, ...appliedQuestions];
export const sources = [
  ...blueprintSources,
  ...foundationSources,
  ...appliedSources,
  ...videoReviewSources,
];
export const contentVersion = '2026-11-04.1';
