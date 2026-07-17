/** Physics kinematics: speed, eom, graphs, relative motion, projectiles (SI). */

export const PHYSICS_KINEMATICS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  U: "u",
  V: "v",
  W: "w",
} as const;

export function parsePhysicsKinematicsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_KINEMATICS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const G = 9.80665;

export function speed(params: { distance: number; time: number }): { speed: number } | { error: string } {
  if (params.distance < 0) return { error: "Distance cannot be negative." };
  if (params.time <= 0) return { error: "Time must be positive." };
  return { speed: params.distance / params.time };
}

export function velocity(params: {
  displacement: number;
  time: number;
}): { velocity: number } | { error: string } {
  if (params.time <= 0) return { error: "Time must be positive." };
  return { velocity: params.displacement / params.time };
}

export function averageSpeed(params: {
  totalDistance: number;
  totalTime: number;
}): { averageSpeed: number } | { error: string } {
  if (params.totalDistance < 0) return { error: "Distance cannot be negative." };
  if (params.totalTime <= 0) return { error: "Time must be positive." };
  return { averageSpeed: params.totalDistance / params.totalTime };
}

export function distanceFromSpeed(params: {
  speed: number;
  time: number;
}): { distance: number } | { error: string } {
  if (params.speed < 0 || params.time < 0) return { error: "Speed and time cannot be negative." };
  return { distance: params.speed * params.time };
}

export function timeFromDistance(params: {
  distance: number;
  speed: number;
}): { time: number } | { error: string } {
  if (params.distance < 0) return { error: "Distance cannot be negative." };
  if (params.speed <= 0) return { error: "Speed must be positive." };
  return { time: params.distance / params.speed };
}

export function acceleration(params: {
  u: number;
  v: number;
  t: number;
}): { a: number } | { error: string } {
  if (params.t <= 0) return { error: "Time must be positive." };
  return { a: (params.v - params.u) / params.t };
}

export function finalVelocity(params: {
  u: number;
  a: number;
  t: number;
}): { v: number } | { error: string } {
  if (params.t < 0) return { error: "Time cannot be negative." };
  return { v: params.u + params.a * params.t };
}

export function initialVelocity(params: {
  v: number;
  a: number;
  t: number;
}): { u: number } | { error: string } {
  if (params.t < 0) return { error: "Time cannot be negative." };
  return { u: params.v - params.a * params.t };
}

export function displacementEom(params: {
  u: number;
  a: number;
  t: number;
}): { s: number } | { error: string } {
  if (params.t < 0) return { error: "Time cannot be negative." };
  return { s: params.u * params.t + 0.5 * params.a * params.t ** 2 };
}

export function freeFall(params: {
  t: number;
  g?: number;
}): { distance: number; velocity: number } | { error: string } {
  if (params.t < 0) return { error: "Time cannot be negative." };
  const g = params.g ?? G;
  return { distance: 0.5 * g * params.t ** 2, velocity: g * params.t };
}

/** Two points on s–t: average speed ≈ Δs/Δt */
export function distanceTimeGraph(params: {
  s1: number;
  t1: number;
  s2: number;
  t2: number;
}): { avgSpeed: number; deltaS: number; deltaT: number } | { error: string } {
  const deltaT = params.t2 - params.t1;
  if (deltaT === 0) return { error: "Times must differ." };
  const deltaS = params.s2 - params.s1;
  return { avgSpeed: deltaS / deltaT, deltaS, deltaT };
}

/** v–t segment: displacement = area of trapezoid, a = slope */
export function velocityTimeGraph(params: {
  v1: number;
  v2: number;
  t: number;
}): { displacement: number; acceleration: number } | { error: string } {
  if (params.t <= 0) return { error: "Duration must be positive." };
  return {
    displacement: 0.5 * (params.v1 + params.v2) * params.t,
    acceleration: (params.v2 - params.v1) / params.t,
  };
}

export function accelerationTimeGraph(params: {
  a: number;
  t: number;
  u?: number;
}): { deltaV: number; v: number } | { error: string } {
  if (params.t < 0) return { error: "Time cannot be negative." };
  const deltaV = params.a * params.t;
  const u = params.u ?? 0;
  return { deltaV, v: u + deltaV };
}

export function relativeVelocity(params: {
  vA: number;
  vB: number;
}): { vRel: number } {
  return { vRel: params.vA - params.vB };
}

/** Boat speed across river: resultant = sqrt(vb²+vr²), drift angle */
export function boatRiver(params: {
  boatSpeed: number;
  riverSpeed: number;
}): { resultant: number; driftAngleDeg: number } | { error: string } {
  if (params.boatSpeed <= 0) return { error: "Boat speed must be positive." };
  if (params.riverSpeed < 0) return { error: "River speed cannot be negative." };
  const resultant = Math.hypot(params.boatSpeed, params.riverSpeed);
  const driftAngleDeg = (Math.atan2(params.riverSpeed, params.boatSpeed) * 180) / Math.PI;
  return { resultant, driftAngleDeg };
}

export function trainSpeed(params: {
  trainLength: number;
  platformLength: number;
  time: number;
}): { speed: number } | { error: string } {
  if (params.trainLength < 0 || params.platformLength < 0) {
    return { error: "Lengths cannot be negative." };
  }
  if (params.time <= 0) return { error: "Time must be positive." };
  return { speed: (params.trainLength + params.platformLength) / params.time };
}

export function projectileRange(params: {
  u: number;
  angleDeg: number;
  g?: number;
}): { range: number } | { error: string } {
  if (params.u < 0) return { error: "Launch speed cannot be negative." };
  const g = params.g ?? G;
  const th = (params.angleDeg * Math.PI) / 180;
  return { range: (params.u ** 2 * Math.sin(2 * th)) / g };
}

export function timeOfFlight(params: {
  u: number;
  angleDeg: number;
  g?: number;
}): { t: number } | { error: string } {
  if (params.u < 0) return { error: "Launch speed cannot be negative." };
  const g = params.g ?? G;
  const th = (params.angleDeg * Math.PI) / 180;
  return { t: (2 * params.u * Math.sin(th)) / g };
}

export function maxHeightProjectile(params: {
  u: number;
  angleDeg: number;
  g?: number;
}): { height: number } | { error: string } {
  if (params.u < 0) return { error: "Launch speed cannot be negative." };
  const g = params.g ?? G;
  const th = (params.angleDeg * Math.PI) / 180;
  return { height: (params.u ** 2 * Math.sin(th) ** 2) / (2 * g) };
}

/** Angle for given range (acute solution): θ = ½ arcsin(R g / u²) */
export function projectileAngle(params: {
  u: number;
  range: number;
  g?: number;
}): { angleDeg: number; complementDeg: number } | { error: string } {
  if (params.u <= 0) return { error: "Launch speed must be positive." };
  if (params.range < 0) return { error: "Range cannot be negative." };
  const g = params.g ?? G;
  const arg = (params.range * g) / params.u ** 2;
  if (arg > 1) return { error: "Range exceeds maximum possible for this speed." };
  const twoTheta = Math.asin(arg);
  const angleDeg = (twoTheta * 180) / Math.PI / 2;
  return { angleDeg, complementDeg: 90 - angleDeg };
}
