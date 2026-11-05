import { nutritionV051Sources, nutritionV051Videos } from './video-additions-nutrition-v051';
import { videoLoadV051Sources, videoLoadV051Additions } from './video-additions-load-v051';
import {
  videoAssessmentV051Sources,
  videoAssessmentV051Additions,
} from './video-additions-assessment-v051';
import { videoSafetyV051Sources, videoSafetyV051Additions } from './video-additions-safety-v051';

// Additive catalog release: question/content versions and historical video records stay intact.
export const videoV051Sources = [
  ...nutritionV051Sources,
  ...videoLoadV051Sources,
  ...videoAssessmentV051Sources,
  ...videoSafetyV051Sources,
];
export const videoV051Additions = [
  ...nutritionV051Videos,
  ...videoLoadV051Additions,
  ...videoAssessmentV051Additions,
  ...videoSafetyV051Additions,
];
