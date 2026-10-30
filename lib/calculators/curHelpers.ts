/** Shared currency calculator helpers — teaching FX estimates only. */

export const CUR_URL = {
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

export function parseCurSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CUR_URL)) {
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

/** Illustrative teaching defaults — not live market data. */
export const ILLUSTRATIVE = {
  USD_INR: 83,
  EUR_USD: 1.08,
  GBP_INR: 105,
  AED_INR: 22.6,
  SGD_INR: 62,
  CAD_INR: 61,
  AUD_INR: 54,
  BTC_INR: 5_500_000,
  ETH_USD: 3200,
} as const;
