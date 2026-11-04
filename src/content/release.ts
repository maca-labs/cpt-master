// Development targets, not official examination requirements.
export const releaseTargets = {
  questions: 300,
  units: 36,
  domains: { assessment: 69, planning: 96, technique: 93, safety: 42 },
} as const;
export const finalDevelopmentTargets = {
  units: [40, 60],
  regularQuestions: 600,
  diagnosticIncluded: 50,
  exclusiveMockSets: 3,
  questionsPerMock: 155,
} as const;
export const currentContentVersion = '2026-11-04.2';
export const legacyContentVersion = '2026-11-04.1';
