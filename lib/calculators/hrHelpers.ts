/** Shared HR & productivity helpers — India-friendly teaching estimates. */

export const HR_URL = {
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

export function parseHrSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(HR_URL)) {
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

/** Illustrative EPFO ceiling used in teaching estimates (₹). */
export const HR_PF_WAGE_CEILING = 15000;
export const HR_PF_RATE = 0.12;
/** Illustrative ESIC wage ceiling (₹/month). */
export const HR_ESI_WAGE_CEILING = 21000;
export const HR_ESI_EMPLOYEE_RATE = 0.0075;
export const HR_ESI_EMPLOYER_RATE = 0.0325;
/** Illustrative gratuity statutory cap (₹). */
export const HR_GRATUITY_CAP = 2000000;

export type HrOkResult = {
  ok: true;
  amount?: number;
  amount2?: number;
  amount3?: number;
  pct?: number;
  rate?: number;
  hours?: number;
  days?: number;
  count?: number;
  score?: number;
  note: string;
};

export type HrResult = { ok: false; error: string } | HrOkResult;
