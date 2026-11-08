import { validateDedicatedExamPack, type DedicatedExamPack } from '../engines/dedicated-exam';

export const dedicatedExamSets = [
  { id: 'jp-dedicated-01', load: () => import('./dedicated-packs/set-01.json') },
  { id: 'jp-dedicated-02', load: () => import('./dedicated-packs/set-02.json') },
  { id: 'jp-dedicated-03', load: () => import('./dedicated-packs/set-03.json') },
] as const;

export async function loadDedicatedExamSet(
  set: (typeof dedicatedExamSets)[number],
): Promise<DedicatedExamPack> {
  const { default: data } = await set.load();
  const pack = data as DedicatedExamPack;
  if (pack.id !== set.id || validateDedicatedExamPack(pack, 'released').length)
    throw new Error('公開用の専用模試データを確認できませんでした。');
  return {
    ...pack,
    items: pack.items.map((item) =>
      item.media
        ? { ...item, media: { ...item.media, src: import.meta.env.BASE_URL + item.media.src } }
        : item,
    ),
  };
}
