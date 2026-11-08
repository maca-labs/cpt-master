import { monitoringSources, planningMonitoringQuestions } from './planning-monitoring';
import { populationSources, planningPopulationQuestions } from './planning-populations';
import { planningEquipmentQuestions } from './planning-equipment';
import { planningNeuroQuestions, planningNeuroSources } from './planning-neuro';
import { planningCardioSources, planningPerformanceQuestions } from './planning-performance';
import { planningResistanceQuestions } from './planning-resistance';
import { acsm, equipment } from './planning-sources';

export { editionPlanningUnits } from './planning-neuro';

export const editionPlanningQuestions = [
  ...planningEquipmentQuestions,
  ...planningResistanceQuestions,
  ...planningNeuroQuestions,
  ...planningPerformanceQuestions,
  ...planningPopulationQuestions,
  ...planningMonitoringQuestions,
];

export const editionPlanningSources = [
  equipment,
  acsm,
  ...planningNeuroSources,
  ...planningCardioSources,
  ...populationSources,
  ...monitoringSources,
];
