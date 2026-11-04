import { safetyBatch01Units, safetyBatch01Questions } from './safety-batch-01';
import { safetyBatch02Units, safetyBatch02Questions } from './safety-batch-02';
import { safetyBatch03Units, safetyBatch03Questions } from './safety-batch-03';
import { safetyBatch04Units, safetyBatch04Questions } from './safety-batch-04';
export { safetySources as safetyExpansionSources } from './safety-shared';
export const safetyExpansionUnits = [
  ...safetyBatch01Units,
  ...safetyBatch02Units,
  ...safetyBatch03Units,
  ...safetyBatch04Units,
];
export const safetyExpansionQuestions = [
  ...safetyBatch01Questions,
  ...safetyBatch02Questions,
  ...safetyBatch03Questions,
  ...safetyBatch04Questions,
];
