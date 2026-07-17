/** Physics optics: Snell, refractive index, mirror/lens, magnification (SI). */

export const PHYSICS_OPTICS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  U: "u",
  V: "v",
  F: "f",
} as const;

export function parsePhysicsOpticsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_OPTICS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const C_LIGHT = 2.99792458e8;

/** n1 sinθ1 = n2 sinθ2 — solve for missing angle (degrees) or n. */
export function snellsLaw(params: {
  n1: number;
  theta1Deg: number | null;
  n2: number;
  theta2Deg: number | null;
}): { theta1Deg: number; theta2Deg: number; critical?: number } | { error: string } {
  if (params.n1 <= 0 || params.n2 <= 0) return { error: "Indices must be positive." };
  if (params.theta1Deg == null && params.theta2Deg == null) {
    return { error: "Enter one angle; leave the other blank to solve." };
  }
  if (params.theta1Deg != null && params.theta2Deg != null) {
    return { error: "Leave exactly one angle blank." };
  }
  if (params.theta1Deg == null) {
    const s2 = Math.sin((params.theta2Deg! * Math.PI) / 180);
    const s1 = (params.n2 * s2) / params.n1;
    if (Math.abs(s1) > 1) return { error: "No real θ1 (total internal reflection regime)." };
    return {
      theta1Deg: (Math.asin(s1) * 180) / Math.PI,
      theta2Deg: params.theta2Deg!,
    };
  }
  const s1 = Math.sin((params.theta1Deg * Math.PI) / 180);
  const s2 = (params.n1 * s1) / params.n2;
  if (Math.abs(s2) > 1) {
    const critical = (Math.asin(params.n2 / params.n1) * 180) / Math.PI;
    return { error: `TIR — critical angle ≈ ${critical.toFixed(2)}° from denser side.` };
  }
  return {
    theta1Deg: params.theta1Deg,
    theta2Deg: (Math.asin(s2) * 180) / Math.PI,
  };
}

export function refractiveIndex(params: {
  mode: "fromSpeed" | "fromAngles";
  speedMs?: number;
  thetaIDeg?: number;
  thetaRDeg?: number;
}): { n: number } | { error: string } {
  if (params.mode === "fromSpeed") {
    const v = params.speedMs ?? 0;
    if (v <= 0) return { error: "Speed in medium must be positive." };
    if (v > C_LIGHT) return { error: "Speed cannot exceed c." };
    return { n: C_LIGHT / v };
  }
  const i = params.thetaIDeg ?? 0;
  const r = params.thetaRDeg ?? 0;
  if (r === 0) return { error: "Refraction angle cannot be zero." };
  const n = Math.sin((i * Math.PI) / 180) / Math.sin((r * Math.PI) / 180);
  if (n <= 0) return { error: "Invalid angles for refractive index." };
  return { n };
}

/** 1/f = 1/v + 1/u (Cartesian sign convention educational). Leave one blank. */
export function mirrorOrLensFormula(params: {
  f: number | null;
  u: number | null;
  v: number | null;
}): { f: number; u: number; v: number } | { error: string } {
  const known = [params.f, params.u, params.v].filter((x) => x != null && Number.isFinite(x)).length;
  if (known < 2) return { error: "Enter any two of f, u, v to solve the third." };
  let { f, u, v } = params;
  if (f == null && u != null && v != null) {
    if (u === 0 || v === 0) return { error: "u and v cannot be zero." };
    f = 1 / (1 / v + 1 / u);
  } else if (u == null && f != null && v != null) {
    if (f === 0 || v === 0) return { error: "f and v cannot be zero." };
    const invU = 1 / f - 1 / v;
    if (invU === 0) return { error: "No finite object distance." };
    u = 1 / invU;
  } else if (v == null && f != null && u != null) {
    if (f === 0 || u === 0) return { error: "f and u cannot be zero." };
    const invV = 1 / f - 1 / u;
    if (invV === 0) return { error: "No finite image distance." };
    v = 1 / invV;
  } else {
    return { error: "Could not determine which value to solve." };
  }
  return { f: f!, u: u!, v: v! };
}

export function magnificationOptics(params: {
  mode: "fromUV" | "fromHeights";
  u?: number;
  v?: number;
  hi?: number;
  ho?: number;
}): { m: number } | { error: string } {
  if (params.mode === "fromHeights") {
    const ho = params.ho ?? 0;
    if (ho === 0) return { error: "Object height cannot be zero." };
    return { m: (params.hi ?? 0) / ho };
  }
  const u = params.u ?? 0;
  if (u === 0) return { error: "Object distance cannot be zero." };
  return { m: -(params.v ?? 0) / u };
}
