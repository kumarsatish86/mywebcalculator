/** Nuclear chemistry: half-life, decay, binding energy, mass defect (educational). */

export const CHEMISTRY_NUCLEAR_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  M: "m",
  Z: "z",
  N: "n",
} as const;

export function parseChemistryNuclearSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_NUCLEAR_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const U_TO_KG = 1.6605390666e-27;
const C = 2.99792458e8;
const MEV_PER_U = 931.494;

export function halfLifeNuclear(params: {
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
  return { halfLife: Math.LN2 / (-Math.log(n / n0) / t) };
}

export function radioactiveDecayChem(params: {
  n0: number;
  halfLife: number;
  t: number;
}): { n: number; lambda: number; fractionLeft: number } | { error: string } {
  if (params.n0 < 0) return { error: "N₀ cannot be negative." };
  if (params.halfLife <= 0 || params.t < 0) return { error: "Half-life must be positive; t ≥ 0." };
  const lambda = Math.LN2 / params.halfLife;
  const fractionLeft = Math.exp(-lambda * params.t);
  return { n: params.n0 * fractionLeft, lambda, fractionLeft };
}

/** Mass defect (u) → BE (MeV) = Δm × 931.494 */
export function massDefect(params: {
  massNumber: number;
  atomicNumber: number;
  atomicMassU: number;
  protonMassU?: number;
  neutronMassU?: number;
}): { defectU: number; bindingMev: number } | { error: string } {
  if (params.massNumber < 1 || params.atomicNumber < 1) {
    return { error: "A and Z must be positive integers-like." };
  }
  if (params.atomicNumber > params.massNumber) return { error: "Z cannot exceed A." };
  if (params.atomicMassU <= 0) return { error: "Atomic mass must be positive." };
  const mp = params.protonMassU ?? 1.007825;
  const mn = params.neutronMassU ?? 1.008665;
  const neutrons = params.massNumber - params.atomicNumber;
  const defectU = params.atomicNumber * mp + neutrons * mn - params.atomicMassU;
  return { defectU, bindingMev: defectU * MEV_PER_U };
}

export function nuclearBindingEnergy(params: {
  defectU: number;
}): { bindingMev: number; bindingJ: number } | { error: string } {
  if (!Number.isFinite(params.defectU)) return { error: "Mass defect invalid." };
  const bindingMev = params.defectU * MEV_PER_U;
  const kg = params.defectU * U_TO_KG;
  return { bindingMev, bindingJ: kg * C * C };
}
