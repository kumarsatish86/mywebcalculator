/** Microbiology / cell culture math (educational). */

export const BIOLOGY_MICRO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseBiologyMicroSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_MICRO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** N = N0 × e^(μ t) */
export function cellGrowth(params: {
  n0: number;
  mu: number;
  t: number;
}): { n: number } | { error: string } {
  if (params.n0 < 0) return { error: "N₀ cannot be negative." };
  if (params.t < 0) return { error: "Time cannot be negative." };
  return { n: params.n0 * Math.exp(params.mu * params.t) };
}

/** μ = (ln N − ln N0) / t */
export function bacterialGrowthRate(params: {
  n0: number;
  n: number;
  t: number;
}): { mu: number } | { error: string } {
  if (params.n0 <= 0 || params.n <= 0) return { error: "Counts must be positive." };
  if (params.t <= 0) return { error: "Time must be positive." };
  return { mu: (Math.log(params.n) - Math.log(params.n0)) / params.t };
}

/** td = ln(2) / μ */
export function doublingTime(params: { mu: number }): { td: number } | { error: string } {
  if (params.mu <= 0) return { error: "Growth rate μ must be positive." };
  return { td: Math.LN2 / params.mu };
}

/** OD = −log10(I/I0) = log10(I0/I) */
export function opticalDensity(params: {
  i0: number;
  i: number;
}): { od: number } | { error: string } {
  if (params.i0 <= 0 || params.i <= 0) return { error: "Intensities must be positive." };
  if (params.i > params.i0) return { error: "Transmitted I cannot exceed I₀." };
  return { od: Math.log10(params.i0 / params.i) };
}

/** CFU/mL = colonies × dilutionFactor / volumePlated_mL */
export function cfu(params: {
  colonies: number;
  dilutionFactor: number;
  volumeMl: number;
}): { cfuPerMl: number } | { error: string } {
  if (params.colonies < 0) return { error: "Colony count cannot be negative." };
  if (params.dilutionFactor <= 0 || params.volumeMl <= 0) {
    return { error: "Dilution factor and volume must be positive." };
  }
  return { cfuPerMl: (params.colonies * params.dilutionFactor) / params.volumeMl };
}
