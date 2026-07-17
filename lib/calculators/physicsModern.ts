/** Physics modern: photons, de Broglie, decay, half-life (SI). */

export const PHYSICS_MODERN_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  L: "l",
  F: "f",
} as const;

export function parsePhysicsModernSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_MODERN_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const H = 6.62607015e-34;
const C = 2.99792458e8;
const EV = 1.602176634e-19;

export function photonEnergy(params: {
  mode: "fromFreq" | "fromWavelength";
  frequencyHz?: number;
  wavelengthM?: number;
}): { energyJ: number; energyEv: number } | { error: string } {
  let eJ: number;
  if (params.mode === "fromFreq") {
    const f = params.frequencyHz ?? 0;
    if (f <= 0) return { error: "Frequency must be positive." };
    eJ = H * f;
  } else {
    const l = params.wavelengthM ?? 0;
    if (l <= 0) return { error: "Wavelength must be positive." };
    eJ = (H * C) / l;
  }
  return { energyJ: eJ, energyEv: eJ / EV };
}

export function deBroglieWavelength(params: {
  massKg: number;
  velocityMs: number;
}): { wavelengthM: number } | { error: string } {
  if (params.massKg <= 0) return { error: "Mass must be positive." };
  if (params.velocityMs <= 0) return { error: "Speed must be positive." };
  return { wavelengthM: H / (params.massKg * params.velocityMs) };
}

export function radioactiveDecay(params: {
  n0: number;
  halfLife: number;
  t: number;
}): { n: number; lambda: number; fractionLeft: number } | { error: string } {
  if (params.n0 < 0) return { error: "N₀ cannot be negative." };
  if (params.halfLife <= 0) return { error: "Half-life must be positive." };
  if (params.t < 0) return { error: "Time cannot be negative." };
  const lambda = Math.LN2 / params.halfLife;
  const fractionLeft = Math.exp(-lambda * params.t);
  return { n: params.n0 * fractionLeft, lambda, fractionLeft };
}

export function halfLife(params: {
  mode: "fromLambda" | "fromRemaining";
  lambda?: number;
  n0?: number;
  n?: number;
  t?: number;
}): { halfLife: number } | { error: string } {
  if (params.mode === "fromLambda") {
    const lam = params.lambda ?? 0;
    if (lam <= 0) return { error: "Decay constant must be positive." };
    return { halfLife: Math.LN2 / lam };
  }
  const n0 = params.n0 ?? 0;
  const n = params.n ?? 0;
  const t = params.t ?? 0;
  if (n0 <= 0 || n <= 0 || n >= n0 || t <= 0) {
    return { error: "Need 0 < N < N₀ and t > 0." };
  }
  const lambda = -Math.log(n / n0) / t;
  return { halfLife: Math.LN2 / lambda };
}
