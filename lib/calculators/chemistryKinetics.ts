/** Chemical kinetics: rate, k, half-life, Arrhenius (educational). */

export const CHEMISTRY_KINETICS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  K: "k",
  E: "e",
} as const;

export function parseChemistryKineticsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_KINETICS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const R = 8.314462618;

/** Average rate = −Δ[A]/Δt (magnitude) */
export function reactionRate(params: {
  conc1: number;
  conc2: number;
  t1: number;
  t2: number;
}): { rate: number } | { error: string } {
  const dt = params.t2 - params.t1;
  if (dt === 0) return { error: "Times must differ." };
  return { rate: Math.abs((params.conc2 - params.conc1) / dt) };
}

/** First-order: k = ln([A]0/[A])/t ; second-order: k = (1/[A] − 1/[A]0)/t */
export function rateConstant(params: {
  order: 1 | 2;
  a0: number;
  a: number;
  t: number;
}): { k: number } | { error: string } {
  if (params.a0 <= 0 || params.a <= 0 || params.t <= 0) {
    return { error: "Concentrations and time must be positive." };
  }
  if (params.order === 1) {
    if (params.a > params.a0) return { error: "For decay, [A] should be ≤ [A]₀." };
    return { k: Math.log(params.a0 / params.a) / params.t };
  }
  return { k: (1 / params.a - 1 / params.a0) / params.t };
}

/** t½ = ln2/k (1st) or 1/(k[A]0) (2nd) */
export function halfLifeKinetics(params: {
  order: 1 | 2;
  k: number;
  a0?: number;
}): { halfLife: number } | { error: string } {
  if (params.k <= 0) return { error: "Rate constant must be positive." };
  if (params.order === 1) return { halfLife: Math.LN2 / params.k };
  const a0 = params.a0 ?? 0;
  if (a0 <= 0) return { error: "Second-order half-life needs [A]₀ > 0." };
  return { halfLife: 1 / (params.k * a0) };
}

/** k = A e^(−Ea/RT) or solve Ea from two (T,k) points */
export function arrhenius(params: {
  mode: "forward" | "ea";
  aFactor?: number;
  eaJ?: number;
  tK?: number;
  k1?: number;
  t1K?: number;
  k2?: number;
  t2K?: number;
}): { k?: number; eaJ?: number } | { error: string } {
  if (params.mode === "forward") {
    const a = params.aFactor ?? 0;
    const ea = params.eaJ ?? 0;
    const t = params.tK ?? 0;
    if (a <= 0 || t <= 0) return { error: "A and T must be positive." };
    return { k: a * Math.exp(-ea / (R * t)) };
  }
  const k1 = params.k1 ?? 0;
  const k2 = params.k2 ?? 0;
  const t1 = params.t1K ?? 0;
  const t2 = params.t2K ?? 0;
  if (k1 <= 0 || k2 <= 0 || t1 <= 0 || t2 <= 0) {
    return { error: "k1, k2, T1, T2 must be positive." };
  }
  if (t1 === t2) return { error: "Temperatures must differ." };
  const eaJ = (R * Math.log(k2 / k1)) / (1 / t1 - 1 / t2);
  return { eaJ };
}
