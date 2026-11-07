import { assessmentV052Sources, assessmentV052Videos } from './video-assessment-v052';
import { populationsV052Sources, populationsV052Videos } from './video-populations-v052';
import { powerV052Sources, powerV052Videos } from './video-power-v052';
import { safetyV052Sources, safetyV052Videos } from './video-safety-v052';

export const videoV052Sources = [
  ...assessmentV052Sources,
  ...populationsV052Sources,
  ...powerV052Sources,
  ...safetyV052Sources,
];
export const videoV052Updates = [
  ...assessmentV052Videos,
  ...populationsV052Videos,
  ...powerV052Videos,
  ...safetyV052Videos,
];
