import {
  editionAssessmentQuestions,
  editionAssessmentSources,
  editionAssessmentUnits,
} from './assessment';
import { editionPlanningQuestions, editionPlanningSources, editionPlanningUnits } from './planning';
import { editionSafetyQuestions, editionSafetySources, editionSafetyUnits } from './safety';
import { editionTechniqueQuestions, editionTechniqueSources } from './technique';
import { editionTechniqueAppliedUnit } from './technique-applied-unit';
import { editionSources } from './shared';

export const edition3Units = [
  ...editionAssessmentUnits,
  ...editionPlanningUnits,
  ...editionSafetyUnits,
  editionTechniqueAppliedUnit,
];
export const edition3Questions = [
  ...editionAssessmentQuestions,
  ...editionPlanningQuestions,
  ...editionTechniqueQuestions,
  ...editionSafetyQuestions,
];
export const edition3Sources = editionSources([
  ...editionAssessmentSources,
  ...editionPlanningSources,
  ...editionTechniqueSources,
  ...editionSafetySources,
]);
