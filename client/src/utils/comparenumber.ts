interface IHasNumber {
  number?: number | null;
}

export default <T extends IHasNumber>(a: T, b: T): number => {
  if (!a.number) return b.number ? -1 : 0;
  if (!b.number) return a.number ? 1 : 0;

  if (a.number < b.number) return -1;
  if (a.number > b.number) return 1;

  return 0;
};
