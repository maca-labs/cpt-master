import type { Source } from '../../domain/types';

export function planningSource(
  id: string,
  title: string,
  url: string,
  edition: string,
  locator: string,
): Source {
  return { id: 'ed3-p-' + id, title, url, edition, locator, checkedAt: '2026-11-08' };
}

export const equipment = planningSource(
  'equipment',
  'Human Kinetics: Types of resistance training equipment',
  'https://us.humankinetics.com/blogs/excerpt/types-of-resistance-training-equipment',
  'Essentials of Personal Training 第3版・公開抜粋',
  'Common Types of Resistance Training Equipment',
);

export const acsm = planningSource(
  'acsm-rt',
  'ACSM Position Stand: Resistance Training Prescription',
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/',
  '2026',
  'Tables 2, 4, 6; Discussion',
);

export const frequency = planningSource(
  'frequency',
  'NSCA: Determination of Resistance Training Frequency',
  'https://www.nsca.com/education/articles/kinetic-select/determination-of-resistance-training-frequency',
  '2017・第2版公開抜粋',
  'Influential Factors and Resistance Training Status',
);

export const bio = planningSource(
  'biomech-sport',
  'NSCA: Biomechanical Analysis in Practice',
  'https://www.nsca.com/education/articles/kinetic-select/biomechanical-analysis-in-practice/',
  '2017・公開抜粋',
  'Four questions and example of exercise selection',
);
