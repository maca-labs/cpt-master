import { aha, assessmentBp, jsh } from './assessment-bp';
import {
  assessmentFitness,
  balanceTest,
  seniorTest,
  sppb,
  testMethodsUnit,
} from './assessment-fitness';
import { agility, alpha, assessmentField } from './assessment-field';
import { assessmentNutrition, caa, ffq, hpsc, ods, scope } from './assessment-nutrition';

export const editionAssessmentQuestions = [
  ...assessmentBp,
  ...assessmentFitness,
  ...assessmentField,
  ...assessmentNutrition,
];
export const editionAssessmentSources = [
  aha,
  jsh,
  balanceTest,
  seniorTest,
  sppb,
  agility,
  alpha,
  caa,
  ffq,
  hpsc,
  ods,
  scope,
];
export const editionAssessmentUnits = [testMethodsUnit];
