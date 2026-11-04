import { foundationUnits, foundationQuestions, foundationSources } from './foundations';
import { appliedUnits, appliedQuestions, appliedSources } from './applied';
import { blueprintSources } from './blueprints';
import { videoReviewSources } from './video-reviews';
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
];
export const sources = [
  ...blueprintSources,
  ...foundationSources,
  ...appliedSources,
  ...videoReviewSources,
  ...assessmentExpansionSources,
  ...planningExpansionSources,
  ...techniqueExpansionSources,
  ...safetyExpansionSources,
];
export const contentVersion = currentContentVersion;
