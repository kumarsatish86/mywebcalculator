/** Ecology / environment estimators (educational). */

export const BIOLOGY_ECOLOGY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  K: "k",
} as const;

export function parseBiologyEcologySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_ECOLOGY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Exponential: N = N₀ e^(rt). */
export function populationGrowth(params: {
  n0: number;
  r: number;
  t: number;
}): { n: number } | { error: string } {
  if (params.n0 <= 0) return { error: "N₀ must be positive." };
  if (params.t < 0) return { error: "Time cannot be negative." };
  return { n: params.n0 * Math.exp(params.r * params.t) };
}

/** Logistic: N = K / (1 + ((K−N₀)/N₀) e^(−rt)). */
export function carryingCapacity(params: {
  n0: number;
  k: number;
  r: number;
  t: number;
}): { n: number; remaining: number } | { error: string } {
  if (params.n0 <= 0 || params.k <= 0) return { error: "N₀ and K must be positive." };
  if (params.t < 0) return { error: "Time cannot be negative." };
  const n =
    params.k / (1 + ((params.k - params.n0) / params.n0) * Math.exp(-params.r * params.t));
  return { n, remaining: params.k - n };
}

/** Shannon H′ from comma-separated abundances. */
export function biodiversityIndex(params: {
  abundancesCsv: string;
}): { h: number; richness: number; evenness: number } | { error: string } {
  const vals = params.abundancesCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
  if (vals.length < 2) return { error: "Enter at least two positive abundances." };
  const total = vals.reduce((s, v) => s + v, 0);
  let h = 0;
  for (const v of vals) {
    const p = v / total;
    h -= p * Math.log(p);
  }
  const richness = vals.length;
  const evenness = h / Math.log(richness);
  return { h, richness, evenness };
}

/** Rough CO₂e from km driven + kWh electricity (teaching factors). */
export function carbonFootprintBiology(params: {
  km: number;
  kwh: number;
}): { kgCo2e: number; note: string } | { error: string } {
  if (params.km < 0 || params.kwh < 0) return { error: "km and kWh cannot be negative." };
  const kgCo2e = params.km * 0.21 + params.kwh * 0.4;
  return {
    kgCo2e,
    note: "Uses ~0.21 kg/km and ~0.4 kg/kWh teaching factors — not a certified inventory.",
  };
}

/** Simplified ecological footprint hectares from diet + travel scores (1–5). */
export function ecologicalFootprint(params: {
  dietScore: number;
  travelScore: number;
}): { hectares: number; note: string } | { error: string } {
  if (params.dietScore < 1 || params.dietScore > 5 || params.travelScore < 1 || params.travelScore > 5) {
    return { error: "Enter diet and travel scores from 1 (low) to 5 (high)." };
  }
  const hectares = 0.8 * params.dietScore + 0.6 * params.travelScore;
  return {
    hectares,
    note: "Toy linear model for classroom discussion — not GFN methodology.",
  };
}
