/** Physics rotational motion: torque, α, I, KE_rot (SI). */

export const PHYSICS_ROTATIONAL_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  I: "i",
  W: "w",
} as const;

export function parsePhysicsRotationalSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_ROTATIONAL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function torque(params: {
  r: number;
  force: number;
  angleDeg: number;
}): { torqueNm: number } | { error: string } {
  if (params.r < 0) return { error: "Lever arm cannot be negative." };
  const th = (params.angleDeg * Math.PI) / 180;
  return { torqueNm: params.r * params.force * Math.sin(th) };
}

export function angularAcceleration(params: {
  mode: "fromTorque" | "fromOmega";
  torque?: number;
  inertia?: number;
  omega0?: number;
  omega?: number;
  t?: number;
}): { alpha: number } | { error: string } {
  if (params.mode === "fromTorque") {
    const tau = params.torque ?? 0;
    const i = params.inertia ?? 0;
    if (i <= 0) return { error: "Moment of inertia must be positive." };
    return { alpha: tau / i };
  }
  const t = params.t ?? 0;
  if (t <= 0) return { error: "Time must be positive." };
  return { alpha: ((params.omega ?? 0) - (params.omega0 ?? 0)) / t };
}

/** Point mass I = m r², or I = τ/α */
export function momentOfInertia(params: {
  mode: "mr2" | "torque";
  mass?: number;
  radius?: number;
  torque?: number;
  alpha?: number;
}): { inertia: number } | { error: string } {
  if (params.mode === "mr2") {
    const m = params.mass ?? 0;
    const r = params.radius ?? 0;
    if (m < 0 || r < 0) return { error: "Mass and radius cannot be negative." };
    return { inertia: m * r ** 2 };
  }
  const a = params.alpha ?? 0;
  if (a === 0) return { error: "Angular acceleration cannot be zero." };
  return { inertia: (params.torque ?? 0) / a };
}

export function rotationalKe(params: {
  inertia: number;
  omega: number;
}): { keJ: number } | { error: string } {
  if (params.inertia < 0) return { error: "Inertia cannot be negative." };
  return { keJ: 0.5 * params.inertia * params.omega ** 2 };
}
