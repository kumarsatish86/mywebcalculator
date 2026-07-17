/** Physics dynamics: Newton, friction, centripetal (SI). */

export const PHYSICS_DYNAMICS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  M: "m",
  F: "f",
} as const;

export function parsePhysicsDynamicsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_DYNAMICS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function parseCsv(csv: string): number[] {
  return csv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function forceFma(params: { m: number; a: number }): { f: number } | { error: string } {
  if (params.m < 0) return { error: "Mass cannot be negative." };
  return { f: params.m * params.a };
}

export function massFromForce(params: { f: number; a: number }): { m: number } | { error: string } {
  if (params.a === 0) return { error: "Acceleration cannot be zero." };
  return { m: params.f / params.a };
}

export function accelerationFromForce(params: {
  f: number;
  m: number;
}): { a: number } | { error: string } {
  if (params.m <= 0) return { error: "Mass must be positive." };
  return { a: params.f / params.m };
}

export function netForce(params: { forcesCsv: string }): { net: number; count: number } | { error: string } {
  const fs = parseCsv(params.forcesCsv);
  if (fs.length < 1) return { error: "Enter at least one force (signed, comma-separated)." };
  return { net: fs.reduce((s, x) => s + x, 0), count: fs.length };
}

export function frictionForce(params: {
  mu: number;
  normal: number;
}): { friction: number } | { error: string } {
  if (params.mu < 0) return { error: "μ cannot be negative." };
  if (params.normal < 0) return { error: "Normal force cannot be negative." };
  return { friction: params.mu * params.normal };
}

export function coefficientOfFriction(params: {
  friction: number;
  normal: number;
}): { mu: number } | { error: string } {
  if (params.normal <= 0) return { error: "Normal force must be positive." };
  if (params.friction < 0) return { error: "Friction cannot be negative." };
  return { mu: params.friction / params.normal };
}

export function centripetalForce(params: {
  m: number;
  v: number;
  r: number;
}): { f: number } | { error: string } {
  if (params.m < 0) return { error: "Mass cannot be negative." };
  if (params.r <= 0) return { error: "Radius must be positive." };
  return { f: (params.m * params.v ** 2) / params.r };
}

export function centripetalAcceleration(params: {
  v: number;
  r: number;
}): { a: number } | { error: string } {
  if (params.r <= 0) return { error: "Radius must be positive." };
  return { a: params.v ** 2 / params.r };
}

export function angularVelocity(params: {
  mode: "fromV" | "fromFreq";
  v?: number;
  r?: number;
  fHz?: number;
}): { omega: number } | { error: string } {
  if (params.mode === "fromFreq") {
    const f = params.fHz ?? 0;
    if (f < 0) return { error: "Frequency cannot be negative." };
    return { omega: 2 * Math.PI * f };
  }
  const v = params.v ?? 0;
  const r = params.r ?? 0;
  if (r <= 0) return { error: "Radius must be positive." };
  return { omega: v / r };
}
