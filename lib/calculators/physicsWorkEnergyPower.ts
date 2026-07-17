/** Physics work, energy, power, efficiency (SI). */

export const PHYSICS_WEP_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  M: "m",
  H: "h",
} as const;

export function parsePhysicsWepSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_WEP_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const G = 9.80665;

export function work(params: {
  force: number;
  distance: number;
  angleDeg: number;
}): { workJ: number } | { error: string } {
  if (params.distance < 0) return { error: "Distance cannot be negative." };
  const th = (params.angleDeg * Math.PI) / 180;
  return { workJ: params.force * params.distance * Math.cos(th) };
}

export function kineticEnergy(params: {
  mass: number;
  velocity: number;
}): { keJ: number } | { error: string } {
  if (params.mass < 0) return { error: "Mass cannot be negative." };
  return { keJ: 0.5 * params.mass * params.velocity ** 2 };
}

export function potentialEnergy(params: {
  mass: number;
  height: number;
  g?: number;
}): { peJ: number } | { error: string } {
  if (params.mass < 0) return { error: "Mass cannot be negative." };
  if (params.height < 0) return { error: "Height cannot be negative." };
  const g = params.g ?? G;
  return { peJ: params.mass * g * params.height };
}

export function mechanicalEnergy(params: {
  ke: number;
  pe: number;
}): { meJ: number } | { error: string } {
  if (params.ke < 0 || params.pe < 0) return { error: "KE and PE cannot be negative here." };
  return { meJ: params.ke + params.pe };
}

export function power(params: { workJ: number; time: number }): { powerW: number } | { error: string } {
  if (params.time <= 0) return { error: "Time must be positive." };
  return { powerW: params.workJ / params.time };
}

export function efficiency(params: {
  useful: number;
  total: number;
}): { ratio: number; percent: number } | { error: string } {
  if (params.total <= 0) return { error: "Total (input) energy must be positive." };
  if (params.useful < 0) return { error: "Useful energy cannot be negative." };
  const ratio = params.useful / params.total;
  return { ratio, percent: ratio * 100 };
}
