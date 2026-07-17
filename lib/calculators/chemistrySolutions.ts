/** Chemistry solutions: molarity, dilution, mixing, ppm (educational). */

export const CHEMISTRY_SOLUTIONS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  M: "m",
  V: "v",
} as const;

export function parseChemistrySolutionsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_SOLUTIONS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function molarity(params: {
  moles: number;
  liters: number;
}): { M: number } | { error: string } {
  if (params.moles < 0) return { error: "Moles cannot be negative." };
  if (params.liters <= 0) return { error: "Volume (L) must be positive." };
  return { M: params.moles / params.liters };
}

export function molality(params: {
  moles: number;
  kgSolvent: number;
}): { m: number } | { error: string } {
  if (params.moles < 0) return { error: "Moles cannot be negative." };
  if (params.kgSolvent <= 0) return { error: "Solvent mass (kg) must be positive." };
  return { m: params.moles / params.kgSolvent };
}

export function normality(params: {
  equivalents: number;
  liters: number;
}): { N: number } | { error: string } {
  if (params.equivalents < 0) return { error: "Equivalents cannot be negative." };
  if (params.liters <= 0) return { error: "Volume (L) must be positive." };
  return { N: params.equivalents / params.liters };
}

export function massPercent(params: {
  massSolute: number;
  massSolution: number;
}): { percent: number } | { error: string } {
  if (params.massSolute < 0 || params.massSolution <= 0) {
    return { error: "Masses invalid (solution mass must be positive)." };
  }
  if (params.massSolute > params.massSolution) {
    return { error: "Solute mass cannot exceed solution mass." };
  }
  return { percent: (params.massSolute / params.massSolution) * 100 };
}

export function volumePercent(params: {
  volSolute: number;
  volSolution: number;
}): { percent: number } | { error: string } {
  if (params.volSolute < 0 || params.volSolution <= 0) {
    return { error: "Volumes invalid (solution volume must be positive)." };
  }
  return { percent: (params.volSolute / params.volSolution) * 100 };
}

export function ppm(params: {
  massSoluteMg: number;
  massSolutionKg: number;
}): { ppm: number } | { error: string } {
  if (params.massSoluteMg < 0) return { error: "Solute mass cannot be negative." };
  if (params.massSolutionKg <= 0) return { error: "Solution mass must be positive." };
  // mg / kg ≈ ppm for dilute aqueous
  return { ppm: params.massSoluteMg / params.massSolutionKg };
}

/** M1 V1 = M2 V2 — leave one blank (null). */
export function dilution(params: {
  m1: number | null;
  v1: number | null;
  m2: number | null;
  v2: number | null;
}): { m1: number; v1: number; m2: number; v2: number } | { error: string } {
  const known = [params.m1, params.v1, params.m2, params.v2].filter(
    (x) => x != null && Number.isFinite(x),
  ).length;
  if (known < 3) return { error: "Enter any three of M1, V1, M2, V2 to solve the fourth." };
  let { m1, v1, m2, v2 } = params;
  if (m1 == null && v1 != null && m2 != null && v2 != null) {
    if (v1 <= 0) return { error: "V1 must be positive." };
    m1 = (m2 * v2) / v1;
  } else if (v1 == null && m1 != null && m2 != null && v2 != null) {
    if (m1 <= 0) return { error: "M1 must be positive." };
    v1 = (m2 * v2) / m1;
  } else if (m2 == null && m1 != null && v1 != null && v2 != null) {
    if (v2 <= 0) return { error: "V2 must be positive." };
    m2 = (m1 * v1) / v2;
  } else if (v2 == null && m1 != null && v1 != null && m2 != null) {
    if (m2 <= 0) return { error: "M2 must be positive." };
    v2 = (m1 * v1) / m2;
  } else {
    return { error: "Could not determine which value to solve." };
  }
  return { m1: m1!, v1: v1!, m2: m2!, v2: v2! };
}

/** Mix two solutions of same solute: C_f = (C1V1 + C2V2)/(V1+V2) */
export function solutionMixing(params: {
  c1: number;
  v1: number;
  c2: number;
  v2: number;
}): { cFinal: number; vFinal: number } | { error: string } {
  if (params.v1 < 0 || params.v2 < 0) return { error: "Volumes cannot be negative." };
  if (params.c1 < 0 || params.c2 < 0) return { error: "Concentrations cannot be negative." };
  const vFinal = params.v1 + params.v2;
  if (vFinal <= 0) return { error: "Total volume must be positive." };
  return {
    vFinal,
    cFinal: (params.c1 * params.v1 + params.c2 * params.v2) / vFinal,
  };
}

/** Approximate M ↔ mass% using density and molar mass. */
export function concentrationConversion(params: {
  molarity: number;
  molarMass: number;
  densityGml: number;
}): { massPercent: number; molalityApprox: number } | { error: string } {
  if (params.molarity < 0 || params.molarMass <= 0 || params.densityGml <= 0) {
    return { error: "Inputs invalid (molar mass and density must be positive)." };
  }
  // g solute / L = M * MM; mass% ≈ (g/L) / (density*1000) * 100
  const gPerL = params.molarity * params.molarMass;
  const massPercent = (gPerL / (params.densityGml * 1000)) * 100;
  const kgSolventPerL = params.densityGml - gPerL / 1000;
  if (kgSolventPerL <= 0) return { error: "Density too low for this molarity." };
  const molalityApprox = params.molarity / kgSolventPerL;
  return { massPercent, molalityApprox };
}
