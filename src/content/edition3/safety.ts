import { safetyFacilityQuestions } from './safety-facility';
import { safetyProfessionalQuestions } from './safety-professional';
import { firstAidUnit, safetyRescueQuestions } from './safety-rescue';
import {
  ads,
  ethics,
  heat,
  heatPolicy,
  privacy,
  resuscitation,
  standards,
  suspension,
} from './safety-sources';

export const editionSafetyUnits = [firstAidUnit];
export const editionSafetyQuestions = [
  ...safetyRescueQuestions,
  ...safetyFacilityQuestions,
  ...safetyProfessionalQuestions,
];
export const editionSafetySources = [
  ads,
  ethics,
  heat,
  heatPolicy,
  privacy,
  resuscitation,
  standards,
  suspension,
];
