interface INamed {
  name?: string | null;
}

const getName = <T extends INamed>(o: T) => {
  const n = (o.name || "").trim().toLowerCase();

  return n.startsWith("the ") ? n.substring(4) : n;
};

export default <T extends INamed>(a: T, b: T): -1 | 0 | 1 => {
  const an = getName(a);
  const bn = getName(b);

  if (!an) return bn ? -1 : 0;
  if (!bn) return an ? 1 : 0;

  if (an < bn) return -1;
  if (an > bn) return 1;

  return 0;
};
