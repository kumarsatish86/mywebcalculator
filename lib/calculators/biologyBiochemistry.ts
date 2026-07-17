/** Biology biochemistry lab math (educational, not clinical). */

export const BIOLOGY_BIOCHEM_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  M: "m",
  V: "v",
} as const;

export function parseBiologyBiochemSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_BIOCHEM_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function phFromH(params: { hMolar: number }): { ph: number } | { error: string } {
  if (params.hMolar <= 0) return { error: "[H⁺] must be positive." };
  return { ph: -Math.log10(params.hMolar) };
}

/** Henderson–Hasselbalch: pH = pKa + log([A⁻]/[HA]) */
export function bufferSolution(params: {
  pKa: number;
  saltConc: number;
  acidConc: number;
}): { ph: number } | { error: string } {
  if (params.saltConc <= 0 || params.acidConc <= 0) {
    return { error: "Salt and acid concentrations must be positive." };
  }
  return { ph: params.pKa + Math.log10(params.saltConc / params.acidConc) };
}

/** v = Vmax [S] / (Km + [S]) */
export function michaelisMenten(params: {
  vmax: number;
  km: number;
  s: number;
}): { v: number } | { error: string } {
  if (params.vmax < 0 || params.km < 0 || params.s < 0) {
    return { error: "Vmax, Km, and [S] cannot be negative." };
  }
  const denom = params.km + params.s;
  if (denom === 0) return { error: "Km + [S] cannot be zero." };
  return { v: (params.vmax * params.s) / denom };
}

export function gibbsBiology(params: {
  deltaH: number;
  tK: number;
  deltaS: number;
}): { deltaG: number } | { error: string } {
  if (params.tK <= 0) return { error: "Temperature (K) must be positive." };
  return { deltaG: params.deltaH - params.tK * params.deltaS };
}

export function molarityBiology(params: {
  moles: number;
  liters: number;
}): { M: number } | { error: string } {
  if (params.moles < 0) return { error: "Moles cannot be negative." };
  if (params.liters <= 0) return { error: "Volume must be positive." };
  return { M: params.moles / params.liters };
}

export function dilutionBiology(params: {
  m1: number | null;
  v1: number | null;
  m2: number | null;
  v2: number | null;
}): { m1: number; v1: number; m2: number; v2: number } | { error: string } {
  const known = [params.m1, params.v1, params.m2, params.v2].filter(
    (x) => x != null && Number.isFinite(x),
  ).length;
  if (known < 3) return { error: "Enter any three of M1, V1, M2, V2." };
  let { m1, v1, m2, v2 } = params;
  if (m1 == null && v1 != null && m2 != null && v2 != null) m1 = (m2 * v2) / v1;
  else if (v1 == null && m1 != null && m2 != null && v2 != null) v1 = (m2 * v2) / m1;
  else if (m2 == null && m1 != null && v1 != null && v2 != null) m2 = (m1 * v1) / v2;
  else if (v2 == null && m1 != null && v1 != null && m2 != null) v2 = (m1 * v1) / m2;
  else return { error: "Could not solve." };
  return { m1: m1!, v1: v1!, m2: m2!, v2: v2! };
}

/** Beer–Lambert: c = A / (ε × path) */
export function proteinConcentration(params: {
  absorbance: number;
  epsilon: number;
  pathCm: number;
}): { concentration: number } | { error: string } {
  if (params.epsilon <= 0 || params.pathCm <= 0) {
    return { error: "ε and path length must be positive." };
  }
  if (params.absorbance < 0) return { error: "Absorbance cannot be negative." };
  return { concentration: params.absorbance / (params.epsilon * params.pathCm) };
}
