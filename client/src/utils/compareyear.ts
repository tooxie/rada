interface IHasYear {
  year?: number | null;
}

export default <T extends IHasYear>(a: T, b: T): number => {
  if (!a.year) return b.year ? -1 : 0;
  if (!b.year) return a.year ? 1 : 0;

  if (a.year < b.year) return -1;
  if (a.year > b.year) return 1;

  return 0;
};
