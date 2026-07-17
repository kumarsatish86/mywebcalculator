/** Physics: magnetic force, field (wire), Lorentz, induced EMF (SI). */

export const PHYSICS_MAGNETISM_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  L: "l",
  I: "i",
  V: "v",
} as const;

export function parsePhysicsMagnetismSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_MAGNETISM_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const MU0 = 1.25663706212e-6;

/** F = I L B sinθ for a straight wire. */
export function magneticForceWire(params: {
  currentA: number;
  lengthM: number;
  bTesla: number;
  thetaDeg: number;
}): { forceN: number } | { error: string } {
  if (params.lengthM < 0) return { error: "Length cannot be negative." };
  if (params.bTesla < 0) return { error: "B cannot be negative." };
  const th = (params.thetaDeg * Math.PI) / 180;
  return {
    forceN: Math.abs(params.currentA) * params.lengthM * params.bTesla * Math.sin(th),
  };
}

/** B = μ₀ I / (2π r) for a long straight wire. */
export function magneticFieldWire(params: {
  currentA: number;
  distanceM: number;
}): { bTesla: number } | { error: string } {
  if (params.distanceM <= 0) return { error: "Distance must be positive." };
  return { bTesla: (MU0 * Math.abs(params.currentA)) / (2 * Math.PI * params.distanceM) };
}

/** F = q v B sinθ */
export function lorentzForce(params: {
  chargeC: number;
  velocityMs: number;
  bTesla: number;
  thetaDeg: number;
}): { forceN: number } | { error: string } {
  if (params.velocityMs < 0) return { error: "Speed cannot be negative." };
  if (params.bTesla < 0) return { error: "B cannot be negative." };
  const th = (params.thetaDeg * Math.PI) / 180;
  return {
    forceN: Math.abs(params.chargeC) * params.velocityMs * params.bTesla * Math.sin(th),
  };
}

/** ε = B ℓ v (motional) or N ΔΦ/Δt */
export function inducedEmf(params: {
  mode: "motional" | "flux";
  bTesla?: number;
  lengthM?: number;
  velocityMs?: number;
  turns?: number;
  deltaFlux?: number;
  deltaT?: number;
}): { emfV: number; formula: string } | { error: string } {
  if (params.mode === "motional") {
    const b = params.bTesla ?? 0;
    const l = params.lengthM ?? 0;
    const v = params.velocityMs ?? 0;
    if (b < 0 || l < 0 || v < 0) return { error: "B, ℓ, v cannot be negative." };
    return { emfV: b * l * v, formula: "ε = B ℓ v" };
  }
  const n = params.turns ?? 0;
  const dPhi = params.deltaFlux ?? 0;
  const dt = params.deltaT ?? 0;
  if (n < 0) return { error: "Turns cannot be negative." };
  if (dt <= 0) return { error: "Δt must be positive." };
  return { emfV: (n * Math.abs(dPhi)) / dt, formula: "ε = N |ΔΦ| / Δt" };
}
