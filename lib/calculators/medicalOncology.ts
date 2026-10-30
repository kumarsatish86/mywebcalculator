/** Oncology-adjacent educational math — defer all care to oncology teams. */

export const MEDICAL_ONCOLOGY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  M: "m",
} as const;

export function parseMedicalOncologySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_ONCOLOGY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Basic relative risk index from age + binary lifestyle flags. */
export function cancerRiskBasic(params: {
  age: number;
  smoke: number;
  familyHistory: number;
  obesity: number;
}): { index: number; band: string; note: string } | { error: string } {
  if (params.age < 18 || params.age > 100) return { error: "Enter age 18–100." };
  for (const [v, l] of [
    [params.smoke, "Smoke"],
    [params.familyHistory, "Family history"],
    [params.obesity, "Obesity flag"],
  ] as const) {
    if (v !== 0 && v !== 1) return { error: `${l} must be 0 or 1.` };
  }
  const index =
    Math.max(0, (params.age - 40) / 10) +
    params.smoke * 2 +
    params.familyHistory * 1.5 +
    params.obesity;
  const band =
    index < 2 ? "Lower relative index (teaching)" : index < 4 ? "Moderate index" : "Higher relative index";
  return {
    index,
    band,
    note: "Not a validated cancer risk model — awareness arithmetic only.",
  };
}

/** Exponential tumor volume doubling: V = V0 × 2^(t/Td). */
export function tumorGrowth(params: {
  v0: number;
  doublingDays: number;
  tDays: number;
}): { volume: number; note: string } | { error: string } {
  if (params.v0 <= 0 || params.doublingDays <= 0 || params.tDays < 0) {
    return { error: "V₀ and doubling time must be positive; t ≥ 0." };
  }
  return {
    volume: params.v0 * 2 ** (params.tDays / params.doublingDays),
    note: "Idealized doubling model — real tumors are heterogeneous.",
  };
}

/** Chemo dose = mg/m² × BSA (Mosteller). Educational only. */
export function chemotherapyDosage(params: {
  mgPerM2: number;
  weightKg: number;
  heightCm: number;
}): { bsa: number; doseMg: number; note: string } | { error: string } {
  if (params.mgPerM2 <= 0 || params.weightKg <= 0 || params.heightCm <= 0) {
    return { error: "Dose intensity, weight, and height must be positive." };
  }
  const bsa = Math.sqrt((params.heightCm * params.weightKg) / 3600);
  return {
    bsa,
    doseMg: params.mgPerM2 * bsa,
    note: "Mosteller BSA × mg/m² teaching arithmetic — never overrides protocol/pharmacy.",
  };
}
