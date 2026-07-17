/** Chemistry gas laws (SI / R = 8.314 J·mol⁻¹·K⁻¹). */

export const CHEMISTRY_GAS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  P: "p",
  V: "v",
  N: "n",
  W: "w",
} as const;

export function parseChemistryGasSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_GAS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const R = 8.314462618;

export function idealGasLaw(params: {
  pPa: number | null;
  vM3: number | null;
  nMol: number | null;
  tK: number | null;
}): { pPa: number; vM3: number; nMol: number; tK: number } | { error: string } {
  const known = [params.pPa, params.vM3, params.nMol, params.tK].filter(
    (v) => v != null && Number.isFinite(v),
  ).length;
  if (known < 3) return { error: "Enter any three of P, V, n, T to solve the fourth." };
  let { pPa, vM3, nMol, tK } = params;
  if (pPa == null && vM3 != null && nMol != null && tK != null) {
    if (vM3 <= 0 || nMol <= 0 || tK <= 0) return { error: "V, n, T must be positive." };
    pPa = (nMol * R * tK) / vM3;
  } else if (vM3 == null && pPa != null && nMol != null && tK != null) {
    if (pPa <= 0 || nMol <= 0 || tK <= 0) return { error: "P, n, T must be positive." };
    vM3 = (nMol * R * tK) / pPa;
  } else if (nMol == null && pPa != null && vM3 != null && tK != null) {
    if (pPa <= 0 || vM3 <= 0 || tK <= 0) return { error: "P, V, T must be positive." };
    nMol = (pPa * vM3) / (R * tK);
  } else if (tK == null && pPa != null && vM3 != null && nMol != null) {
    if (pPa <= 0 || vM3 <= 0 || nMol <= 0) return { error: "P, V, n must be positive." };
    tK = (pPa * vM3) / (nMol * R);
  } else {
    return { error: "Could not determine which variable to solve." };
  }
  return { pPa: pPa!, vM3: vM3!, nMol: nMol!, tK: tK! };
}

export function boylesLaw(params: {
  p1: number;
  v1: number;
  p2: number | null;
  v2: number | null;
}): { p2: number; v2: number } | { error: string } {
  if (params.p1 <= 0 || params.v1 <= 0) return { error: "P1 and V1 must be positive." };
  if ((params.p2 == null) === (params.v2 == null)) {
    return { error: "Leave exactly one of P2 or V2 blank." };
  }
  if (params.p2 == null) {
    if (params.v2! <= 0) return { error: "V2 must be positive." };
    return { p2: (params.p1 * params.v1) / params.v2!, v2: params.v2! };
  }
  if (params.p2 <= 0) return { error: "P2 must be positive." };
  return { p2: params.p2, v2: (params.p1 * params.v1) / params.p2 };
}

export function charlesLaw(params: {
  v1: number;
  t1K: number;
  v2: number | null;
  t2K: number | null;
}): { v2: number; t2K: number } | { error: string } {
  if (params.v1 <= 0 || params.t1K <= 0) return { error: "V1 and T1 must be positive." };
  if ((params.v2 == null) === (params.t2K == null)) {
    return { error: "Leave exactly one of V2 or T2 blank." };
  }
  if (params.v2 == null) {
    if (params.t2K! <= 0) return { error: "T2 must be positive." };
    return { v2: params.v1 * (params.t2K! / params.t1K), t2K: params.t2K! };
  }
  if (params.v2 <= 0) return { error: "V2 must be positive." };
  return { v2: params.v2, t2K: params.t1K * (params.v2 / params.v1) };
}

export function gayLussacsLaw(params: {
  p1: number;
  t1K: number;
  p2: number | null;
  t2K: number | null;
}): { p2: number; t2K: number } | { error: string } {
  if (params.p1 <= 0 || params.t1K <= 0) return { error: "P1 and T1 must be positive." };
  if ((params.p2 == null) === (params.t2K == null)) {
    return { error: "Leave exactly one of P2 or T2 blank." };
  }
  if (params.p2 == null) {
    if (params.t2K! <= 0) return { error: "T2 must be positive." };
    return { p2: params.p1 * (params.t2K! / params.t1K), t2K: params.t2K! };
  }
  if (params.p2 <= 0) return { error: "P2 must be positive." };
  return { p2: params.p2, t2K: params.t1K * (params.p2 / params.p1) };
}

/** P1V1/T1 = P2V2/T2 — leave exactly one of p2,v2,t2 blank. */
export function combinedGasLaw(params: {
  p1: number;
  v1: number;
  t1K: number;
  p2: number | null;
  v2: number | null;
  t2K: number | null;
}): { p2: number; v2: number; t2K: number } | { error: string } {
  if (params.p1 <= 0 || params.v1 <= 0 || params.t1K <= 0) {
    return { error: "P1, V1, T1 must be positive." };
  }
  const blanks = [params.p2, params.v2, params.t2K].filter((x) => x == null).length;
  if (blanks !== 1) return { error: "Leave exactly one of P2, V2, T2 blank." };
  const k = (params.p1 * params.v1) / params.t1K;
  if (params.p2 == null) {
    if (params.v2! <= 0 || params.t2K! <= 0) return { error: "V2 and T2 must be positive." };
    return { p2: (k * params.t2K!) / params.v2!, v2: params.v2!, t2K: params.t2K! };
  }
  if (params.v2 == null) {
    if (params.p2 <= 0 || params.t2K! <= 0) return { error: "P2 and T2 must be positive." };
    return { p2: params.p2, v2: (k * params.t2K!) / params.p2, t2K: params.t2K! };
  }
  if (params.p2 <= 0 || params.v2 <= 0) return { error: "P2 and V2 must be positive." };
  return { p2: params.p2, v2: params.v2, t2K: (params.p2 * params.v2) / k };
}

export function daltonsLaw(params: {
  partialsCsv: string;
}): { totalP: number; count: number } | { error: string } {
  const ps = params.partialsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (ps.length < 1) return { error: "Enter at least one partial pressure." };
  if (ps.some((p) => p < 0)) return { error: "Pressures cannot be negative." };
  return { totalP: ps.reduce((a, b) => a + b, 0), count: ps.length };
}

/** ρ = PM / RT */
export function gasDensity(params: {
  pPa: number;
  molarMass: number;
  tK: number;
}): { density: number } | { error: string } {
  if (params.pPa <= 0 || params.molarMass <= 0 || params.tK <= 0) {
    return { error: "P, molar mass, and T must be positive." };
  }
  return { density: (params.pPa * params.molarMass) / (R * params.tK) };
}

/** v_rms = sqrt(3RT/M) with M in kg/mol */
export function rmsSpeed(params: {
  tK: number;
  molarMassKg: number;
}): { vRms: number } | { error: string } {
  if (params.tK <= 0 || params.molarMassKg <= 0) {
    return { error: "T and molar mass must be positive." };
  }
  return { vRms: Math.sqrt((3 * R * params.tK) / params.molarMassKg) };
}
