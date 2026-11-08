import { firstAidV062Sources, firstAidV062Videos } from './video-v062-first-aid';
import { fitnessV062Sources, fitnessV062Videos } from './video-v062-fitness';
import { neuroV062Sources, neuroV062Videos } from './video-v062-neuro';
import { resistanceV062Sources, resistanceV062Videos } from './video-v062-resistance';

export const videoV062Sources = [
  ...fitnessV062Sources,
  ...neuroV062Sources,
  ...firstAidV062Sources,
  ...resistanceV062Sources,
];
export const videoV062Additions = [
  ...fitnessV062Videos,
  ...neuroV062Videos,
  ...firstAidV062Videos,
  ...resistanceV062Videos,
];
