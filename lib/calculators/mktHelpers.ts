/** Shared marketing calculator helpers — teaching estimates. */

export const MKT_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  L: "l",
  W: "w",
  H: "h",
  D: "d",
  N: "n",
  P: "p",
  Q: "q",
  M: "m",
  V: "v",
  S: "s",
} as const;

export function parseMktSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MKT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function pos(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function nonNeg(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n < 0) return { error: `${label} must be ≥ 0.` };
  return n;
}
