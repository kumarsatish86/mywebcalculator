/** Chemistry stoichiometry: mole ratios, limiting reagent, yields (educational). */

export const CHEMISTRY_STOICH_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  M: "m",
} as const;

export function parseChemistryStoichSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_STOICH_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
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

/** Product moles from reactant moles via stoich ratio. */
export function stoichiometry(params: {
  molesReactant: number;
  coeffReactant: number;
  coeffProduct: number;
}): { molesProduct: number } | { error: string } {
  if (params.molesReactant < 0) return { error: "Moles cannot be negative." };
  if (params.coeffReactant <= 0 || params.coeffProduct <= 0) {
    return { error: "Coefficients must be positive." };
  }
  return {
    molesProduct: (params.molesReactant * params.coeffProduct) / params.coeffReactant,
  };
}

export function limitingReagent(params: {
  molesA: number;
  coeffA: number;
  molesB: number;
  coeffB: number;
}): { limiting: "A" | "B" | "equal"; extent: number } | { error: string } {
  if (params.molesA < 0 || params.molesB < 0) return { error: "Moles cannot be negative." };
  if (params.coeffA <= 0 || params.coeffB <= 0) return { error: "Coefficients must be positive." };
  const ea = params.molesA / params.coeffA;
  const eb = params.molesB / params.coeffB;
  if (Math.abs(ea - eb) < 1e-12) return { limiting: "equal", extent: ea };
  return ea < eb
    ? { limiting: "A", extent: ea }
    : { limiting: "B", extent: eb };
}

export function theoreticalYield(params: {
  molesLimiting: number;
  coeffLimiting: number;
  coeffProduct: number;
  molarMassProduct: number;
}): { molesProduct: number; massG: number } | { error: string } {
  if (params.molesLimiting < 0) return { error: "Moles cannot be negative." };
  if (params.coeffLimiting <= 0 || params.coeffProduct <= 0) {
    return { error: "Coefficients must be positive." };
  }
  if (params.molarMassProduct <= 0) return { error: "Molar mass must be positive." };
  const molesProduct =
    (params.molesLimiting * params.coeffProduct) / params.coeffLimiting;
  return { molesProduct, massG: molesProduct * params.molarMassProduct };
}

export function percentYield(params: {
  actual: number;
  theoretical: number;
}): { percent: number } | { error: string } {
  if (params.actual < 0) return { error: "Actual yield cannot be negative." };
  if (params.theoretical <= 0) return { error: "Theoretical yield must be positive." };
  return { percent: (params.actual / params.theoretical) * 100 };
}

export function actualYield(params: {
  percent: number;
  theoretical: number;
}): { actual: number } | { error: string } {
  if (params.percent < 0) return { error: "Percent cannot be negative." };
  if (params.theoretical < 0) return { error: "Theoretical yield cannot be negative." };
  return { actual: (params.percent / 100) * params.theoretical };
}

export function reactionRatio(params: {
  molesA: number;
  molesB: number;
}): { ratioAB: number; simplified: string } | { error: string } {
  if (params.molesA <= 0 || params.molesB <= 0) {
    return { error: "Both mole amounts must be positive." };
  }
  const ratioAB = params.molesA / params.molesB;
  const scale = 1000;
  const a = Math.round(params.molesA * scale);
  const b = Math.round(params.molesB * scale);
  const g = gcd(a, b);
  return { ratioAB, simplified: `${a / g} : ${b / g}` };
}

/** Reduce positive coefficient CSV to smallest integers (auto-balancer helper). */
export function balanceCoefficients(params: {
  coeffsCsv: string;
}): { coeffs: number[]; gcd: number } | { error: string } {
  const raw = params.coeffsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (raw.length < 2) return { error: "Enter at least two coefficients." };
  if (raw.some((n) => n <= 0)) return { error: "Coefficients must be positive." };
  const scaled = raw.map((n) => Math.round(n * 1000));
  const g = gcdAll(scaled);
  return { coeffs: scaled.map((n) => n / g), gcd: g };
}
