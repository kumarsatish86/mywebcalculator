/** Chemistry thermodynamics: q, ΔH, ΔG, ΔS, calorimetry, Hess (educational). */

export const CHEMISTRY_THERMO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  H: "h",
  S: "s",
} as const;

export function parseChemistryThermoSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_THERMO_URL)) {
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

function sumDiff(productsCsv: string, reactantsCsv: string): number | { error: string } {
  const products = parseCsv(productsCsv);
  const reactants = parseCsv(reactantsCsv);
  if (products.length < 1 || reactants.length < 1) {
    return { error: "Enter product and reactant contributions (CSV)." };
  }
  return products.reduce((a, b) => a + b, 0) - reactants.reduce((a, b) => a + b, 0);
}

export function heatEnergyChem(params: {
  mass: number;
  c: number;
  deltaT: number;
}): { q: number } | { error: string } {
  if (params.mass <= 0) return { error: "Mass must be positive." };
  if (params.c <= 0) return { error: "Specific heat must be positive." };
  return { q: params.mass * params.c * params.deltaT };
}

/** ΔH = Σ (products) − Σ (reactants); enter coeff×ΔHf values as CSV. */
export function enthalpyChange(params: {
  productsCsv: string;
  reactantsCsv: string;
}): { deltaH: number } | { error: string } {
  const d = sumDiff(params.productsCsv, params.reactantsCsv);
  if (typeof d === "object") return d;
  return { deltaH: d };
}

/** ΔG = ΔH − TΔS (keep units consistent, e.g. kJ and kJ/K). */
export function gibbsFreeEnergy(params: {
  deltaH: number;
  tK: number;
  deltaS: number;
}): { deltaG: number } | { error: string } {
  if (params.tK <= 0) return { error: "Temperature (K) must be positive." };
  return { deltaG: params.deltaH - params.tK * params.deltaS };
}

/** ΔS = Σ (products) − Σ (reactants). */
export function entropyChange(params: {
  productsCsv: string;
  reactantsCsv: string;
}): { deltaS: number } | { error: string } {
  const d = sumDiff(params.productsCsv, params.reactantsCsv);
  if (typeof d === "object") return d;
  return { deltaS: d };
}

export function calorimetry(params: {
  mass: number;
  c: number;
  deltaT: number;
}): { q: number } | { error: string } {
  return heatEnergyChem(params);
}

/** C = q / ΔT (heat capacity of a sample). */
export function heatCapacity(params: {
  q: number;
  deltaT: number;
}): { C: number } | { error: string } {
  if (params.deltaT === 0) return { error: "ΔT cannot be zero." };
  return { C: params.q / params.deltaT };
}

/** Hess: ΔH_rxn = Σ ΔH_steps (CSV of step enthalpies). */
export function hessLaw(params: {
  stepsCsv: string;
}): { deltaH: number; steps: number } | { error: string } {
  const steps = parseCsv(params.stepsCsv);
  if (steps.length < 1) return { error: "Enter at least one step ΔH (comma-separated)." };
  return { deltaH: steps.reduce((a, b) => a + b, 0), steps: steps.length };
}
