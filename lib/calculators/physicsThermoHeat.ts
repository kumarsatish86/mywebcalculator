/** Physics: heat, specific/latent heat, gas laws, thermo work, Carnot (SI). */

export const PHYSICS_THERMO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  N: "n",
  P: "p",
} as const;

export function parsePhysicsThermoSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_THERMO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const R_GAS = 8.314462618; // J/(mol·K)

export function heatEnergy(params: {
  massKg: number;
  c: number;
  deltaT: number;
}): { qJ: number } | { error: string } {
  if (params.massKg <= 0) return { error: "Mass must be positive." };
  if (params.c <= 0) return { error: "Specific heat must be positive." };
  return { qJ: params.massKg * params.c * params.deltaT };
}

export function specificHeat(params: {
  qJ: number;
  massKg: number;
  deltaT: number;
}): { c: number } | { error: string } {
  if (params.massKg <= 0) return { error: "Mass must be positive." };
  if (params.deltaT === 0) return { error: "ΔT cannot be zero." };
  return { c: params.qJ / (params.massKg * params.deltaT) };
}

export function latentHeat(params: {
  massKg: number;
  lJkg: number;
}): { qJ: number } | { error: string } {
  if (params.massKg <= 0) return { error: "Mass must be positive." };
  if (params.lJkg <= 0) return { error: "Latent heat must be positive." };
  return { qJ: params.massKg * params.lJkg };
}

/** Solve one of P, V, n, T from PV = nRT (leave unknown null). */
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
    pPa = (nMol * R_GAS * tK) / vM3;
  } else if (vM3 == null && pPa != null && nMol != null && tK != null) {
    if (pPa <= 0 || nMol <= 0 || tK <= 0) return { error: "P, n, T must be positive." };
    vM3 = (nMol * R_GAS * tK) / pPa;
  } else if (nMol == null && pPa != null && vM3 != null && tK != null) {
    if (pPa <= 0 || vM3 <= 0 || tK <= 0) return { error: "P, V, T must be positive." };
    nMol = (pPa * vM3) / (R_GAS * tK);
  } else if (tK == null && pPa != null && vM3 != null && nMol != null) {
    if (pPa <= 0 || vM3 <= 0 || nMol <= 0) return { error: "P, V, n must be positive." };
    tK = (pPa * vM3) / (nMol * R_GAS);
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
  if (params.p2 == null && params.v2 == null) {
    return { error: "Enter either P2 or V2 (leave the other blank)." };
  }
  if (params.p2 != null && params.v2 != null) {
    return { error: "Leave exactly one of P2 or V2 blank to solve." };
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
  if (params.v1 <= 0 || params.t1K <= 0) return { error: "V1 and T1 (K) must be positive." };
  if (params.v2 == null && params.t2K == null) {
    return { error: "Enter either V2 or T2 (leave the other blank)." };
  }
  if (params.v2 != null && params.t2K != null) {
    return { error: "Leave exactly one of V2 or T2 blank to solve." };
  }
  if (params.v2 == null) {
    if (params.t2K! <= 0) return { error: "T2 must be positive." };
    return { v2: params.v1 * (params.t2K! / params.t1K), t2K: params.t2K! };
  }
  if (params.v2 <= 0) return { error: "V2 must be positive." };
  return { v2: params.v2, t2K: params.t1K * (params.v2 / params.v1) };
}

export function pressureVolumeWork(params: {
  pPa: number;
  v1: number;
  v2: number;
}): { workJ: number } | { error: string } {
  if (params.pPa < 0) return { error: "Pressure cannot be negative." };
  if (params.v1 < 0 || params.v2 < 0) return { error: "Volumes cannot be negative." };
  return { workJ: params.pPa * (params.v2 - params.v1) };
}

export function thermoWorkIsobaric(params: {
  pPa: number;
  deltaV: number;
}): { workJ: number } | { error: string } {
  if (params.pPa < 0) return { error: "Pressure cannot be negative." };
  return { workJ: params.pPa * params.deltaV };
}

export function carnotEfficiency(params: {
  thK: number;
  tcK: number;
}): { efficiency: number; percent: number } | { error: string } {
  if (params.thK <= 0 || params.tcK <= 0) return { error: "Temperatures (K) must be positive." };
  if (params.tcK >= params.thK) return { error: "Tc must be less than Th." };
  const efficiency = 1 - params.tcK / params.thK;
  return { efficiency, percent: efficiency * 100 };
}
