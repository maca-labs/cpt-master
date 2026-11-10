// Development targets, not official examination requirements.
export const releaseTargets = {
  questions: 600,
  units: 40,
  domains: { assessment: 138, planning: 192, technique: 186, safety: 84 },
} as const;
export const finalDevelopmentTargets = {
  units: [40, 60],
  regularQuestions: 600,
  diagnosticIncluded: 50,
  exclusiveMockSets: 3,

  questionsPerMock: 155,
} as const;
export const advancedTargets = { assessment: 12, planning: 16, technique: 15, safety: 7 } as const;
export const currentContentVersion = '2026-11-10.2';
export const qualityReviewContentVersion = '2026-11-10.1';
export const advancedContentVersion = '2026-11-09.1';
export const v062ContentVersion = '2026-11-08.3';
export const v060ContentVersion = '2026-11-08.2';
export const v052ContentVersion = '2026-11-08.1';
export const previousContentVersion = '2026-11-04.2';
export const legacyContentVersion = '2026-11-04.1';
