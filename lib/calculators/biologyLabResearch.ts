/** Lab / research bench calculators (educational). */

export const BIOLOGY_LAB_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  V: "v",
  M: "m",
} as const;

export function parseBiologyLabSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_LAB_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** C_final = C_initial / DF^steps */
export function serialDilution(params: {
  cInitial: number;
  dilutionFactor: number;
  steps: number;
}): { cFinal: number } | { error: string } {
  if (params.cInitial <= 0 || params.dilutionFactor <= 1 || params.steps < 1) {
    return { error: "Need Cᵢ > 0, DF > 1, and steps ≥ 1." };
  }
  return { cFinal: params.cInitial / params.dilutionFactor ** params.steps };
}

/** RCF = 1.118e-5 × r_mm × RPM²  (r in mm). Leave rcf or rpm blank to solve. */
export function centrifugeRcfRpm(params: {
  radiusMm: number;
  rpm: number | null;
  rcf: number | null;
}): { rpm: number; rcf: number } | { error: string } {
  if (params.radiusMm <= 0) return { error: "Radius must be positive (mm)." };
  const k = 1.118e-5 * params.radiusMm;
  if (params.rpm != null && Number.isFinite(params.rpm)) {
    if (params.rpm <= 0) return { error: "RPM must be positive." };
    return { rpm: params.rpm, rcf: k * params.rpm ** 2 };
  }
  if (params.rcf != null && Number.isFinite(params.rcf)) {
    if (params.rcf <= 0) return { error: "RCF must be positive." };
    return { rpm: Math.sqrt(params.rcf / k), rcf: params.rcf };
  }
  return { error: "Enter RPM or RCF (leave one blank)." };
}

/** dsDNA ng/µL ≈ A260 × 50 × dilution factor. */
export function dnaConcentration(params: {
  a260: number;
  dilution: number;
}): { ngPerUl: number } | { error: string } {
  if (params.a260 < 0 || params.dilution <= 0) {
    return { error: "A260 ≥ 0 and dilution factor > 0." };
  }
  return { ngPerUl: params.a260 * 50 * params.dilution };
}

/** Theoretical amplicon copies = N₀ × 2^cycles (ideal). */
export function pcrCalculator(params: {
  n0: number;
  cycles: number;
}): { copies: number } | { error: string } {
  if (params.n0 <= 0 || params.cycles < 0 || params.cycles > 60) {
    return { error: "N₀ > 0 and cycles between 0 and 60." };
  }
  return { copies: params.n0 * 2 ** params.cycles };
}

/** Rf = migration / dye-front distance. */
export function gelElectrophoresis(params: {
  migrationMm: number;
  dyeFrontMm: number;
}): { rf: number } | { error: string } {
  if (params.migrationMm < 0 || params.dyeFrontMm <= 0) {
    return { error: "Migration ≥ 0 and dye-front distance > 0." };
  }
  if (params.migrationMm > params.dyeFrontMm) {
    return { error: "Migration cannot exceed dye-front distance." };
  }
  return { rf: params.migrationMm / params.dyeFrontMm };
}

/** C1V1 = C2V2 or mass = M × V_L × MW. */
export function labSolutionBiology(params: {
  mode: "c1v1" | "mass";
  c1?: number;
  v1?: number;
  c2?: number;
  v2?: number;
  molarity?: number;
  volumeL?: number;
  molarMass?: number;
}): { v1?: number; massG?: number } | { error: string } {
  if (params.mode === "c1v1") {
    const { c1, c2, v2 } = params;
    if (c1 == null || c2 == null || v2 == null) return { error: "Enter C1, C2, and V2." };
    if (c1 <= 0 || c2 <= 0 || v2 <= 0) return { error: "C1, C2, V2 must be positive." };
    if (c2 > c1) return { error: "C2 cannot exceed C1 for a dilution." };
    return { v1: (c2 * v2) / c1 };
  }
  const m = params.molarity ?? 0;
  const v = params.volumeL ?? 0;
  const mw = params.molarMass ?? 0;
  if (m < 0 || v <= 0 || mw <= 0) return { error: "M ≥ 0, V > 0, MW > 0." };
  return { massG: m * v * mw };
}
