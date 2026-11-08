import { validateDedicatedExamPack, type DedicatedExamPack } from '../engines/dedicated-exam';

// Only reviewed release packs belong in this registry. The authoring bank is not imported.
const registeredPacks: readonly DedicatedExamPack[] = [];

export function releasedDedicatedExams(): readonly DedicatedExamPack[] {
  return registeredPacks.filter((pack) => validateDedicatedExamPack(pack, 'released').length === 0);
}
