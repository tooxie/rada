interface IHasOrdinal {
  ordinal?: number | null;
}

export default <T extends IHasOrdinal>(a: T, b: T): -1 | 0 | 1 => {
  if (!a.ordinal) return b.ordinal ? -1 : 0;
  if (!b.ordinal) return a.ordinal ? 1 : 0;

  if (a.ordinal < b.ordinal) return -1;
  if (a.ordinal > b.ordinal) return 1;

  return 0;
};
