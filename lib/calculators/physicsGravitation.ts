/** Physics gravitation: Newton gravity, escape/orbit, GPE (SI). */

export const PHYSICS_GRAVITATION_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  M: "m",
  T: "t",
} as const;

export function parsePhysicsGravitationSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_GRAVITATION_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const G = 6.6743e-11;
const G_SURF = 9.80665;

export function gravitationalForce(params: {
  m1: number;
  m2: number;
  r: number;
}): { forceN: number } | { error: string } {
  if (params.m1 < 0 || params.m2 < 0) return { error: "Masses cannot be negative." };
  if (params.r <= 0) return { error: "Separation must be positive." };
  return { forceN: (G * params.m1 * params.m2) / params.r ** 2 };
}

export function escapeVelocity(params: {
  massCentral: number;
  radius: number;
}): { vEsc: number } | { error: string } {
  if (params.massCentral <= 0) return { error: "Central mass must be positive." };
  if (params.radius <= 0) return { error: "Radius must be positive." };
  return { vEsc: Math.sqrt((2 * G * params.massCentral) / params.radius) };
}

export function orbitalVelocity(params: {
  massCentral: number;
  radius: number;
}): { vOrb: number } | { error: string } {
  if (params.massCentral <= 0) return { error: "Central mass must be positive." };
  if (params.radius <= 0) return { error: "Orbit radius must be positive." };
  return { vOrb: Math.sqrt((G * params.massCentral) / params.radius) };
}

/** Near-surface mgh, or orbital U = −GMm/r when mode orbital */
export function gravitationalPe(params: {
  mode: "surface" | "orbital";
  mass: number;
  height?: number;
  massCentral?: number;
  radius?: number;
  g?: number;
}): { peJ: number; formula: string } | { error: string } {
  if (params.mass < 0) return { error: "Mass cannot be negative." };
  if (params.mode === "surface") {
    const h = params.height ?? 0;
    if (h < 0) return { error: "Height cannot be negative." };
    const g = params.g ?? G_SURF;
    return { peJ: params.mass * g * h, formula: "U ≈ m g h" };
  }
  const M = params.massCentral ?? 0;
  const r = params.radius ?? 0;
  if (M <= 0 || r <= 0) return { error: "Central mass and radius must be positive." };
  return { peJ: (-G * M * params.mass) / r, formula: "U = −G M m / r" };
}
