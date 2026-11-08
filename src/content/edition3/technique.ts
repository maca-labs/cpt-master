import type { Question } from '../../domain/types';
import { editionTechniqueAppliedUnit } from './technique-applied-unit';
import { suspensionQuestions } from './technique-suspension';
import { manualQuestions } from './technique-manual';
import { equipmentQuestions } from './technique-equipment';
import { variedQuestions, toolSources } from './technique-varied';
import { furtherQuestions, anatomySource } from './technique-further';
import { techSources } from './technique-sources';

function withToolsObjective(questions: Question[], objective: 1 | 2 | 3): Question[] {
  return questions.map((question) => ({
    ...question,
    unitId: editionTechniqueAppliedUnit.id,
    objectiveIds: [editionTechniqueAppliedUnit.objectives[objective - 1].id],
  }));
}

export const editionTechniqueQuestions = [
  ...withToolsObjective(suspensionQuestions, 1),
  ...withToolsObjective(manualQuestions, 2),
  ...withToolsObjective(equipmentQuestions, 3),
  ...variedQuestions,
  ...furtherQuestions,
];
export const editionTechniqueSources = [
  ...Object.values(techSources),
  ...toolSources,
  anatomySource,
];
