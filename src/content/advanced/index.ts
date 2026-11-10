import { advancedAssessmentQuestions, advancedAssessmentSources } from './assessment';
import { advancedPlanningQuestions, advancedPlanningSources } from './planning';
import { advancedSafetyQuestions, advancedSafetySources } from './safety';
import { advancedTechniqueQuestions, advancedTechniqueSources } from './technique';

export const advancedQuestions = [
  ...advancedAssessmentQuestions,
  ...advancedPlanningQuestions,
  ...advancedTechniqueQuestions,
  ...advancedSafetyQuestions,
];

export const advancedSources = [
  ...advancedAssessmentSources,
  ...advancedPlanningSources,
  ...advancedTechniqueSources,
  ...advancedSafetySources,
];
