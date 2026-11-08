import type { Source } from '../../domain/types';

function source(id: string, title: string, url: string, edition: string, locator: string): Source {
  return { id: 'e3-t-' + id, title, url, edition, checkedAt: '2026-11-08', locator };
}
export const techSources = {
  suspension: source(
    'suspension',
    'NSCA: Suspension Training',
    'https://www.nsca.com/education/articles/kinetic-select/suspension-training/',
    '2022',
    '本文の支持点・安定化・アンカーに関する各段落',
  ),
  setup: source(
    'setup',
    'TRX: Product Safety',
    'https://www.trxtraining.com/pages/product-safety',
    '公開時点',
    'Suspension Trainer、Suspension Anchor、Xtender各安全説明',
  ),
  principles: source(
    'principles',
    'TRX: The Three Principles of Progression',
    'https://www.trxtraining.com/blogs/news/the-three-principles-of-progression-ask-the-trainer',
    '公開時点',
    'Vector Resistance、Stability、Pendulum',
  ),
  tuck: source(
    'tuck',
    'ACE: Suspended Knee Tucks',
    'https://www.acefitness.org/resources/everyone/exercise-library/87/trx-reg-suspended-knee-tucks/',
    '公開時点',
    'Steps 1–4',
  ),
  lunge: source(
    'lunge',
    'ACE: Suspended Lunge',
    'https://www.acefitness.org/resources/everyone/exercise-library/93/trx-reg-suspended-lunge/',
    '公開時点',
    'Steps 1–6',
  ),
  trxWorkouts: source(
    'workouts',
    'ACE: Train Like an Olympian: Two TRX Muscular Training Workouts',
    'https://www.acefitness.org/continuing-education/certified/september-2024/8708/train-like-an-olympian-two-trx-muscular-training-workouts/',
    '2024',
    'Add More Challenge／Olympics-inspired Workouts',
  ),
  equipment: source(
    'equipment',
    'NSCA / Human Kinetics: Types of Resistance Training Equipment',
    'https://us.humankinetics.com/blogs/excerpt/types-of-resistance-training-equipment',
    'Essentials of Personal Training 第3版公開抜粋',
    'Common Types of Resistance Training Equipment／Machines／Free Weights',
  ),
  mrtAdults: source(
    'mrt-adults',
    'Teixeiraほか: Manual Resistance versus Conventional Resistance Training',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC5592285/',
    '2017',
    'Introduction／Training protocol／Results／Discussion',
  ),
  mrtYouth: source(
    'mrt-youth',
    'Dorgoほか: The Effects of Manual Resistance Training on Fitness in Adolescents',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC2907740/',
    '2009',
    'Training program／各運動例とFig. 1以降',
  ),
  partner: source(
    'partner',
    'ACE: Partner Standing Row with Resistance Tubing',
    'https://www.acefitness.org/resources/everyone/exercise-library/267/partner-standing-row-with-resistance-tubing/',
    '公開時点',
    'Steps 1–5',
  ),
  spotting: source(
    'spotting',
    'NSCA: Basics of Strength and Conditioning Manual',
    'https://www.nsca.com/contentassets/de9aebfe7a7340b69217b99bb13862a7/basics_of_strength_and_conditioning_manual.pdf',
    '公開マニュアル',
    'p.29 Spotting／Communication Between Athlete and Spotter',
  ),
  getup: source(
    'getup',
    'NSCA: Turkish Get-Up',
    'https://www.nsca.com/education/articles/kinetic-select/turkish-get-up/',
    '2023',
    'Beginning Position／Movement Phases／Fig. 5.3',
  ),
  swing: source(
    'swing',
    'NSCA: Two-Arm Kettlebell Swing',
    'https://www.nsca.com/education/articles/kinetic-select/two-arm-kettlebell-swing/',
    '公開抜粋',
    'Starting Position／Downward and Upward Movement',
  ),
};
