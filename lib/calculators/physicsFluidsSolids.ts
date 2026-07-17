/** Physics: density, pressure, buoyancy, Pascal, Bernoulli, flow rate (SI). */

export const PHYSICS_FLUIDS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parsePhysicsFluidsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_FLUIDS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const G = 9.80665;

export function density(params: {
  massKg: number;
  volumeM3: number;
}): { density: number } | { error: string } {
  if (params.massKg < 0) return { error: "Mass cannot be negative." };
  if (params.volumeM3 <= 0) return { error: "Volume must be positive." };
  return { density: params.massKg / params.volumeM3 };
}

export function pressure(params: {
  forceN: number;
  areaM2: number;
}): { pressurePa: number } | { error: string } {
  if (params.forceN < 0) return { error: "Force cannot be negative." };
  if (params.areaM2 <= 0) return { error: "Area must be positive." };
  return { pressurePa: params.forceN / params.areaM2 };
}

export function hydrostaticPressure(params: {
  densityKgM3: number;
  depthM: number;
  g?: number;
}): { pressurePa: number } | { error: string } {
  if (params.densityKgM3 <= 0) return { error: "Density must be positive." };
  if (params.depthM < 0) return { error: "Depth cannot be negative." };
  const g = params.g ?? G;
  return { pressurePa: params.densityKgM3 * g * params.depthM };
}

export function buoyantForce(params: {
  fluidDensityKgM3: number;
  displacedVolumeM3: number;
  g?: number;
}): { forceN: number } | { error: string } {
  if (params.fluidDensityKgM3 <= 0) return { error: "Fluid density must be positive." };
  if (params.displacedVolumeM3 <= 0) return { error: "Displaced volume must be positive." };
  const g = params.g ?? G;
  return { forceN: params.fluidDensityKgM3 * params.displacedVolumeM3 * g };
}

/** F1/A1 = F2/A2 — leave one unknown as NaN via host (pass null for unknown). */
export function pascalsLaw(params: {
  f1: number | null;
  a1: number | null;
  f2: number | null;
  a2: number | null;
}): { f1: number; a1: number; f2: number; a2: number; pressurePa: number } | { error: string } {
  const vals = [params.f1, params.a1, params.f2, params.a2];
  const known = vals.filter((v) => v != null && Number.isFinite(v)).length;
  if (known < 3) return { error: "Enter any three of F1, A1, F2, A2 to solve the fourth." };
  let { f1, a1, f2, a2 } = params;
  if (f1 != null && a1 != null && a1 <= 0) return { error: "A1 must be positive." };
  if (f2 != null && a2 != null && a2 <= 0) return { error: "A2 must be positive." };
  if (f1 == null && a1 != null && f2 != null && a2 != null) {
    if (a2 <= 0) return { error: "A2 must be positive." };
    f1 = (f2 / a2) * a1;
  } else if (a1 == null && f1 != null && f2 != null && a2 != null) {
    if (f1 <= 0) return { error: "F1 must be positive when solving for A1." };
    a1 = (f1 * a2) / f2;
  } else if (f2 == null && f1 != null && a1 != null && a2 != null) {
    if (a1 <= 0) return { error: "A1 must be positive." };
    f2 = (f1 / a1) * a2;
  } else if (a2 == null && f1 != null && a1 != null && f2 != null) {
    if (f2 <= 0) return { error: "F2 must be positive when solving for A2." };
    a2 = (f2 * a1) / f1;
  } else {
    return { error: "Could not determine which value to solve." };
  }
  if (a1! <= 0 || a2! <= 0) return { error: "Areas must be positive." };
  const pressurePa = f1! / a1!;
  return { f1: f1!, a1: a1!, f2: f2!, a2: a2!, pressurePa };
}

/** Simplified ΔP from Bernoulli between two points (same height optional). */
export function bernoulliDeltaP(params: {
  densityKgM3: number;
  v1: number;
  v2: number;
  h1: number;
  h2: number;
  g?: number;
}): { deltaP: number; note: string } | { error: string } {
  if (params.densityKgM3 <= 0) return { error: "Density must be positive." };
  if (params.v1 < 0 || params.v2 < 0) return { error: "Speeds cannot be negative." };
  const g = params.g ?? G;
  const deltaP =
    0.5 * params.densityKgM3 * (params.v1 ** 2 - params.v2 ** 2) +
    params.densityKgM3 * g * (params.h1 - params.h2);
  return {
    deltaP,
    note: "ΔP = P1−P2 from Bernoulli (incompressible, steady). Positive means P1 > P2.",
  };
}

export function flowRate(params: {
  areaM2: number;
  velocityMs: number;
}): { qM3s: number } | { error: string } {
  if (params.areaM2 <= 0) return { error: "Area must be positive." };
  if (params.velocityMs < 0) return { error: "Velocity cannot be negative." };
  return { qM3s: params.areaM2 * params.velocityMs };
}
