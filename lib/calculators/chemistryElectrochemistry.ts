/** Electrochemistry: Nernst, cell potential, electrolysis / Faraday, redox e⁻ count. */

export const CHEMISTRY_ELECTRO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  Q: "q",
  I: "i",
  M: "m",
} as const;

export function parseChemistryElectroSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_ELECTRO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const F = 96485; // C/mol
const R_GAS = 8.314; // J/(mol·K)

/** E = E° − (RT/nF) ln(Q). At 25 °C you may pass tK=298.15. */
export function nernstEquation(params: {
  e0: number;
  n: number;
  q: number;
  tK?: number;
}): { e: number; note: string } | { error: string } {
  if (params.n <= 0) return { error: "n (electrons) must be positive." };
  if (params.q <= 0) return { error: "Q must be positive." };
  const tK = params.tK ?? 298.15;
  if (tK <= 0) return { error: "Temperature must be positive Kelvin." };
  const e = params.e0 - ((R_GAS * tK) / (params.n * F)) * Math.log(params.q);
  return {
    e,
    note: "Uses E = E° − (RT/nF) ln(Q). Educational Nernst form.",
  };
}

/** E_cell = E_cathode − E_anode (reduction potentials). */
export function cellPotential(params: {
  eCathode: number;
  eAnode: number;
}): { eCell: number } | { error: string } {
  return { eCell: params.eCathode - params.eAnode };
}

/** Faraday / electrolysis: m = (I t M) / (n F); moles = I t / (n F). */
export function faradaysLaw(params: {
  currentA: number;
  timeS: number;
  n: number;
  molarMass?: number;
}): { moles: number; massG?: number } | { error: string } {
  if (params.currentA < 0 || params.timeS <= 0 || params.n <= 0) {
    return { error: "I ≥ 0, t > 0, and n > 0 required." };
  }
  const moles = (params.currentA * params.timeS) / (params.n * F);
  if (params.molarMass != null) {
    if (params.molarMass <= 0) return { error: "Molar mass must be positive." };
    return { moles, massG: moles * params.molarMass };
  }
  return { moles };
}

export function electrolysis(params: {
  currentA: number;
  timeS: number;
  n: number;
  molarMass: number;
}): { moles: number; massG: number } | { error: string } {
  const r = faradaysLaw({
    currentA: params.currentA,
    timeS: params.timeS,
    n: params.n,
    molarMass: params.molarMass,
  });
  if ("error" in r) return r;
  return { moles: r.moles, massG: r.massG! };
}

/** Electrons transferred from oxidation-number change: |ΔON| × atoms. */
export function redoxElectrons(params: {
  onInitial: number;
  onFinal: number;
  atoms?: number;
}): { electrons: number; direction: string } | { error: string } {
  const atoms = params.atoms ?? 1;
  if (atoms <= 0) return { error: "Atom count must be positive." };
  const delta = params.onFinal - params.onInitial;
  const electrons = Math.abs(delta) * atoms;
  const direction =
    delta > 0 ? "Oxidation (ON increases)" : delta < 0 ? "Reduction (ON decreases)" : "No change";
  return { electrons, direction };
}
