interface INamed {
  name?: string | null;
}

export default <T extends INamed>(a: T, b: T): number => {
  const an = (a.name || "").toLowerCase();
  const bn = (b.name || "").toLowerCase();

  if (!an) return bn ? -1 : 0;
  if (!bn) return an ? 1 : 0;

  if (an < bn) return -1;
  if (an > bn) return 1;

  return 0;
};
