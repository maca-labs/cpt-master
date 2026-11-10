import { foundationUnits, foundationQuestions, foundationSources } from './foundations';
import { appliedUnits, appliedQuestions, appliedSources } from './applied';
import { blueprintSources } from './blueprints';
import { videoReviewSources } from './video-reviews';
import { videoV05Sources } from './video-additions-v05';
import { videoV051Sources } from './video-additions-v051';
import { videoV052Sources } from './video-additions-v052';
import { videoV062Sources } from './video-additions-v062';
import {
  assessmentExpansionUnits,
  assessmentExpansionQuestions,
  assessmentExpansionSources,
} from './expansion/assessment';
import {
  planningExpansionUnits,
  planningExpansionQuestions,
  planningExpansionSources,
} from './expansion/planning';
import {
  techniqueExpansionUnits,
  techniqueExpansionQuestions,
  techniqueExpansionSources,
  techniqueMediaAssignments,
} from './expansion/technique';
import {
  safetyExpansionUnits,
  safetyExpansionQuestions,
  safetyExpansionSources,
} from './expansion/safety';
import { currentContentVersion } from './release';
import { focusMockQuestions, focusMockSources } from './focus-mock';
import { edition3Questions, edition3Sources, edition3Units } from './edition3';
import { advancedQuestions, advancedSources } from './advanced';
import { applyQuestionQualityReview } from './question-quality-review';
export { seedVideos } from './videos';
export const legacyQuestionIds = new Set(
  [...foundationQuestions, ...appliedQuestions].map((q) => q.id),
);
export const legacyUnitIds = new Set([...foundationUnits, ...appliedUnits].map((u) => u.id));
export const units = [
  ...foundationUnits,
  ...appliedUnits,
  ...assessmentExpansionUnits,
  ...planningExpansionUnits,
  ...techniqueExpansionUnits,
  ...safetyExpansionUnits,
  ...edition3Units,
];
export const questions = [
  ...foundationQuestions,
  ...appliedQuestions,
  ...assessmentExpansionQuestions,
  ...planningExpansionQuestions,
  ...techniqueExpansionQuestions.map((q) => ({
    ...q,
    ...(techniqueMediaAssignments[q.id] ? { media: techniqueMediaAssignments[q.id] } : {}),
  })),
  ...safetyExpansionQuestions,
  ...edition3Questions,
].map(applyQuestionQualityReview);
export const practiceQuestions = [...questions, ...advancedQuestions];
export const allQuestions = [...practiceQuestions, ...focusMockQuestions];
export const sources = [
  ...blueprintSources,
  ...foundationSources,
  ...appliedSources,
  ...videoReviewSources,
  ...videoV05Sources,
  ...videoV051Sources,
  ...videoV052Sources,
  ...videoV062Sources,
  ...focusMockSources,
  ...assessmentExpansionSources,
  ...planningExpansionSources,
  ...techniqueExpansionSources,
  ...safetyExpansionSources,
  ...edition3Sources,
  ...advancedSources,
];
export const contentVersion = currentContentVersion;
