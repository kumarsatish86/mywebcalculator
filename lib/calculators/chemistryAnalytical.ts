/** Analytical chemistry: titration, Beer–Lambert, absorbance (educational). */

export const CHEMISTRY_ANALYTICAL_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  V: "v",
  M: "m",
} as const;

export function parseChemistryAnalyticalSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_ANALYTICAL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** M1 V1 = M2 V2 for acid–base titration equivalence (1:1 stoich). */
export function titration(params: {
  m1: number | null;
  v1: number | null;
  m2: number | null;
  v2: number | null;
}): { m1: number; v1: number; m2: number; v2: number } | { error: string } {
  const known = [params.m1, params.v1, params.m2, params.v2].filter(
    (x) => x != null && Number.isFinite(x),
  ).length;
  if (known < 3) return { error: "Enter any three of M1, V1, M2, V2." };
  let { m1, v1, m2, v2 } = params;
  if (m1 == null && v1 != null && m2 != null && v2 != null) {
    if (v1 <= 0) return { error: "V1 must be positive." };
    m1 = (m2 * v2) / v1;
  } else if (v1 == null && m1 != null && m2 != null && v2 != null) {
    if (m1 <= 0) return { error: "M1 must be positive." };
    v1 = (m2 * v2) / m1;
  } else if (m2 == null && m1 != null && v1 != null && v2 != null) {
    if (v2 <= 0) return { error: "V2 must be positive." };
    m2 = (m1 * v1) / v2;
  } else if (v2 == null && m1 != null && v1 != null && m2 != null) {
    if (m2 <= 0) return { error: "M2 must be positive." };
    v2 = (m1 * v1) / m2;
  } else {
    return { error: "Could not solve." };
  }
  return { m1: m1!, v1: v1!, m2: m2!, v2: v2! };
}

/** A = ε c l — leave one of A, ε, c, l blank. */
export function beerLambert(params: {
  a: number | null;
  epsilon: number | null;
  c: number | null;
  path: number | null;
}): { a: number; epsilon: number; c: number; path: number } | { error: string } {
  const known = [params.a, params.epsilon, params.c, params.path].filter(
    (x) => x != null && Number.isFinite(x),
  ).length;
  if (known < 3) return { error: "Enter any three of A, ε, c, path length." };
  let { a, epsilon, c, path } = params;
  if (a == null && epsilon != null && c != null && path != null) {
    a = epsilon * c * path;
  } else if (epsilon == null && a != null && c != null && path != null) {
    if (c * path === 0) return { error: "c × path cannot be zero." };
    epsilon = a / (c * path);
  } else if (c == null && a != null && epsilon != null && path != null) {
    if (epsilon * path === 0) return { error: "ε × path cannot be zero." };
    c = a / (epsilon * path);
  } else if (path == null && a != null && epsilon != null && c != null) {
    if (epsilon * c === 0) return { error: "ε × c cannot be zero." };
    path = a / (epsilon * c);
  } else {
    return { error: "Could not solve." };
  }
  return { a: a!, epsilon: epsilon!, c: c!, path: path! };
}

/** A = −log10(T) with T = I/I0 */
export function absorbance(params: {
  i0: number;
  i: number;
}): { a: number; transmittance: number } | { error: string } {
  if (params.i0 <= 0 || params.i <= 0) return { error: "Intensities must be positive." };
  if (params.i > params.i0) return { error: "I cannot exceed I₀." };
  const transmittance = params.i / params.i0;
  return { a: -Math.log10(transmittance), transmittance };
}

export function concentrationFromAbsorbance(params: {
  a: number;
  epsilon: number;
  path: number;
}): { c: number } | { error: string } {
  if (params.a < 0) return { error: "Absorbance cannot be negative." };
  if (params.epsilon <= 0 || params.path <= 0) return { error: "ε and path must be positive." };
  return { c: params.a / (params.epsilon * params.path) };
}
