/** Chemistry basics: moles, particles, empirical/molecular formulas (educational). */

export const CHEMISTRY_BASIC_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  M: "m",
} as const;

export function parseChemistryBasicSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_BASIC_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const NA = 6.02214076e23;

function parseCsv(csv: string): number[] {
  return csv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function gcdAll(nums: number[]): number {
  return nums.reduce((g, n) => gcd(g, n), nums[0] ?? 1);
}

/** Sum atomicMass×count pairs: masses CSV + counts CSV. */
export function molarMass(params: {
  atomicMassesCsv: string;
  countsCsv: string;
}): { molarMass: number; atoms: number } | { error: string } {
  const masses = parseCsv(params.atomicMassesCsv);
  const counts = parseCsv(params.countsCsv);
  if (masses.length < 1) return { error: "Enter atomic masses (comma-separated)." };
  if (masses.length !== counts.length) {
    return { error: "Masses and atom-counts must match in length." };
  }
  if (masses.some((m) => m <= 0) || counts.some((c) => c <= 0)) {
    return { error: "Masses and counts must be positive." };
  }
  const molarMass = masses.reduce((s, m, i) => s + m * counts[i]!, 0);
  return { molarMass, atoms: counts.reduce((a, b) => a + b, 0) };
}

/** Weighted average atomic mass from isotope masses + % abundances. */
export function atomicMass(params: {
  massesCsv: string;
  abundancesCsv: string;
}): { atomicMass: number } | { error: string } {
  const masses = parseCsv(params.massesCsv);
  const ab = parseCsv(params.abundancesCsv);
  if (masses.length < 1 || masses.length !== ab.length) {
    return { error: "Enter matching isotope masses and abundance % values." };
  }
  if (masses.some((m) => m <= 0) || ab.some((a) => a < 0)) {
    return { error: "Masses must be positive; abundances cannot be negative." };
  }
  const total = ab.reduce((s, a) => s + a, 0);
  if (total <= 0) return { error: "Abundances must sum positive." };
  const atomicMass = masses.reduce((s, m, i) => s + m * (ab[i]! / total), 0);
  return { atomicMass };
}

export function numberOfMoles(params: {
  massG: number;
  molarMass: number;
}): { moles: number } | { error: string } {
  if (params.massG < 0) return { error: "Mass cannot be negative." };
  if (params.molarMass <= 0) return { error: "Molar mass must be positive." };
  return { moles: params.massG / params.molarMass };
}

export function moleToMass(params: {
  moles: number;
  molarMass: number;
}): { massG: number } | { error: string } {
  if (params.moles < 0) return { error: "Moles cannot be negative." };
  if (params.molarMass <= 0) return { error: "Molar mass must be positive." };
  return { massG: params.moles * params.molarMass };
}

export function massToMole(params: {
  massG: number;
  molarMass: number;
}): ReturnType<typeof numberOfMoles> {
  return numberOfMoles(params);
}

export function moleToParticle(params: {
  moles: number;
}): { particles: number } | { error: string } {
  if (params.moles < 0) return { error: "Moles cannot be negative." };
  return { particles: params.moles * NA };
}

export function particleToMole(params: {
  particles: number;
}): { moles: number } | { error: string } {
  if (params.particles < 0) return { error: "Particle count cannot be negative." };
  return { moles: params.particles / NA };
}

/** From element mole amounts CSV → smallest integer ratio. */
export function empiricalFormula(params: {
  molesCsv: string;
}): { ratios: number[]; label: string } | { error: string } {
  const moles = parseCsv(params.molesCsv);
  if (moles.length < 1) return { error: "Enter mole amounts per element (CSV)." };
  if (moles.some((m) => m <= 0)) return { error: "Mole amounts must be positive." };
  const min = Math.min(...moles);
  const raw = moles.map((m) => m / min);
  const scaled = raw.map((x) => Math.round(x * 1000));
  const g = gcdAll(scaled);
  const ratios = scaled.map((x) => x / g);
  return { ratios, label: ratios.join(" : ") };
}

/** Molecular formula multiplier = M_molecular / M_empirical */
export function molecularFormula(params: {
  empiricalMolarMass: number;
  molecularMolarMass: number;
}): { multiplier: number; note: string } | { error: string } {
  if (params.empiricalMolarMass <= 0 || params.molecularMolarMass <= 0) {
    return { error: "Molar masses must be positive." };
  }
  const multiplier = params.molecularMolarMass / params.empiricalMolarMass;
  const rounded = Math.round(multiplier);
  return {
    multiplier,
    note:
      Math.abs(multiplier - rounded) < 0.08
        ? `Nearest integer multiplier ≈ ${rounded}`
        : "Multiplier is non-integer — check inputs.",
  };
}

/** % of one element = (atoms × atomicMass / molarMass) × 100 */
export function percentageComposition(params: {
  elementAtomicMass: number;
  atomCount: number;
  compoundMolarMass: number;
}): { percent: number } | { error: string } {
  if (params.elementAtomicMass <= 0 || params.atomCount <= 0 || params.compoundMolarMass <= 0) {
    return { error: "All inputs must be positive." };
  }
  return {
    percent: ((params.elementAtomicMass * params.atomCount) / params.compoundMolarMass) * 100,
  };
}
