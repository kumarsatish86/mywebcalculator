/** Physics advanced: E-field, potential, Gauss, C, L (SI educational). */

export const PHYSICS_ADVANCED_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Q: "q",
  V: "v",
} as const;

export function parsePhysicsAdvancedSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_ADVANCED_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const K = 8.9875517923e9;
const EPS0 = 8.8541878128e-12;

export function electricField(params: {
  mode: "point" | "force";
  qC?: number;
  rM?: number;
  forceN?: number;
  testChargeC?: number;
}): { eNic: number } | { error: string } {
  if (params.mode === "force") {
    const q = params.testChargeC ?? 0;
    if (q === 0) return { error: "Test charge cannot be zero." };
    return { eNic: (params.forceN ?? 0) / q };
  }
  const q = params.qC ?? 0;
  const r = params.rM ?? 0;
  if (r <= 0) return { error: "Distance must be positive." };
  return { eNic: (K * Math.abs(q)) / r ** 2 };
}

export function electricPotential(params: {
  qC: number;
  rM: number;
}): { vVolt: number } | { error: string } {
  if (params.rM <= 0) return { error: "Distance must be positive." };
  return { vVolt: (K * params.qC) / params.rM };
}

/** Φ_E = Q_enc / ε₀, or E = Φ/A for uniform field through area. */
export function gaussLaw(params: {
  mode: "flux" | "field";
  qEncC?: number;
  flux?: number;
  areaM2?: number;
}): { flux: number; eField?: number } | { error: string } {
  if (params.mode === "flux") {
    const q = params.qEncC ?? 0;
    return { flux: q / EPS0 };
  }
  const flux = params.flux ?? 0;
  const a = params.areaM2 ?? 0;
  if (a <= 0) return { error: "Area must be positive." };
  return { flux, eField: flux / a };
}

export function capacitanceAdvanced(params: {
  mode: "qv" | "parallelPlate";
  qC?: number;
  vVolt?: number;
  areaM2?: number;
  separationM?: number;
}): { cFarad: number } | { error: string } {
  if (params.mode === "qv") {
    const v = params.vVolt ?? 0;
    if (v === 0) return { error: "Voltage cannot be zero." };
    return { cFarad: (params.qC ?? 0) / v };
  }
  const a = params.areaM2 ?? 0;
  const d = params.separationM ?? 0;
  if (a <= 0 || d <= 0) return { error: "Area and separation must be positive." };
  return { cFarad: (EPS0 * a) / d };
}

/** L = Φ_B / I (definition) or solenoid L ≈ μ₀ n² A ℓ with n = N/ℓ */
export function inductance(params: {
  mode: "flux" | "solenoid";
  fluxWb?: number;
  currentA?: number;
  turns?: number;
  lengthM?: number;
  areaM2?: number;
}): { lHenry: number } | { error: string } {
  if (params.mode === "flux") {
    const i = params.currentA ?? 0;
    if (i === 0) return { error: "Current cannot be zero." };
    return { lHenry: (params.fluxWb ?? 0) / i };
  }
  const n = params.turns ?? 0;
  const l = params.lengthM ?? 0;
  const a = params.areaM2 ?? 0;
  if (n <= 0 || l <= 0 || a <= 0) return { error: "Turns, length, and area must be positive." };
  const MU0 = 1.25663706212e-6;
  const nPerL = n / l;
  return { lHenry: MU0 * nPerL ** 2 * a * l };
}
