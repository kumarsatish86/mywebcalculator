/** Rule-based “smart” chemistry helpers — not a live AI model. */

export const CHEMISTRY_AI_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  M: "m",
  V: "v",
} as const;

export function parseChemistryAiSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_AI_URL)) {
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

/** Reduce coefficient CSV (classroom balancer helper). */
export function equationBalancerAi(params: {
  coeffsCsv: string;
}): { coeffs: number[]; note: string } | { error: string } {
  const raw = params.coeffsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (raw.length < 2) return { error: "Enter at least two coefficients." };
  if (raw.some((n) => n <= 0)) return { error: "Coefficients must be positive." };
  const scaled = raw.map((n) => Math.round(n * 1000));
  const g = scaled.reduce((acc, n) => gcd(acc, n), scaled[0]!);
  return {
    coeffs: scaled.map((n) => n / g),
    note: "Rule-based coefficient reducer — not a live AI model. Verify atom balance yourself.",
  };
}

const PRESETS: Record<string, string> = {
  "h2+o2": "Forms water (2 H₂ + O₂ → 2 H₂O) under typical combustion teaching examples.",
  "na+cl2": "Forms NaCl (2 Na + Cl₂ → 2 NaCl) in common classroom demos.",
  "c+o2": "Forms CO₂ when carbon burns in excess oxygen (C + O₂ → CO₂).",
  acidbase: "Acid + base → salt + water is a standard neutralization pattern.",
};

export function reactionPredictor(params: {
  query: string;
}): { prediction: string } | { error: string } {
  const key = params.query.trim().toLowerCase().replace(/\s+/g, "");
  if (!key) return { error: "Enter a short reaction hint (e.g. H2+O2)." };
  const hit = Object.entries(PRESETS).find(([k]) => key.includes(k));
  if (!hit) {
    return {
      prediction:
        "No preset match. This tool only covers a few teaching patterns — not a live AI predictor.",
    };
  }
  return { prediction: hit[1] };
}

/** mass = M × V × molarMass for solution prep */
export function labSolutionPrep(params: {
  molarity: number;
  volumeL: number;
  molarMass: number;
}): { massG: number } | { error: string } {
  if (params.molarity < 0 || params.volumeL <= 0 || params.molarMass <= 0) {
    return { error: "M, V, and molar mass must be valid positives (M ≥ 0)." };
  }
  return { massG: params.molarity * params.volumeL * params.molarMass };
}

const HAZARDS: Record<string, string> = {
  acid: "Corrosive — use eye protection, gloves; neutralize spills carefully. Not a substitute for SDS.",
  base: "Caustic — avoid skin/eye contact; rinse with water. Check SDS for your exact reagent.",
  solvent: "Flammable/volatile risk possible — ventilate; no open flames. Confirm SDS.",
  oxidizer: "Keep away from organics/fuels. Store per SDS guidance.",
};

export function chemicalSafetyAdvisor(params: {
  keyword: string;
}): { advice: string } | { error: string } {
  const k = params.keyword.trim().toLowerCase();
  if (!k) return { error: "Enter a hazard class keyword (acid, base, solvent, oxidizer)." };
  for (const [key, advice] of Object.entries(HAZARDS)) {
    if (k.includes(key)) return { advice };
  }
  return {
    advice:
      "No preset keyword matched. Always read the Safety Data Sheet for your specific chemical — this is not a live AI advisor.",
  };
}

/** Very small formula → atom count summary */
export function compoundStructure(params: {
  formula: string;
}): { atoms: Record<string, number>; summary: string } | { error: string } {
  const f = params.formula.trim();
  if (!f) return { error: "Enter a simple formula like H2O or C6H12O6." };
  const atoms: Record<string, number> = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  let matched = false;
  while ((m = re.exec(f))) {
    matched = true;
    const el = m[1]!;
    const n = m[2] ? Number(m[2]) : 1;
    if (!Number.isFinite(n) || n <= 0) return { error: "Invalid subscript." };
    atoms[el] = (atoms[el] ?? 0) + n;
  }
  if (!matched) return { error: "Could not parse formula." };
  const summary = Object.entries(atoms)
    .map(([el, n]) => `${el}:${n}`)
    .join(" · ");
  return { atoms, summary };
}
