/** Diabetes / glucose educational math — never replace insulin protocols. */

export const MEDICAL_DIABETES_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
} as const;

export function parseMedicalDiabetesSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_DIABETES_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Convert glucose: mg/dL ↔ mmol/L (÷ or × 18). */
export function bloodSugarConvert(params: {
  value: number;
  from: "mgdl" | "mmol";
}): { mgdl: number; mmol: number } | { error: string } {
  if (params.value <= 0) return { error: "Glucose value must be positive." };
  if (params.from === "mgdl") {
    return { mgdl: params.value, mmol: params.value / 18 };
  }
  return { mmol: params.value, mgdl: params.value * 18 };
}

/** NGSP HbA1c % from eAG mg/dL: A1c = (eAG + 46.7) / 28.7 */
export function hba1cFromEag(params: {
  eagMgdl: number;
}): { hba1cPct: number } | { error: string } {
  if (params.eagMgdl <= 0) return { error: "eAG must be positive." };
  return { hba1cPct: (params.eagMgdl + 46.7) / 28.7 };
}

/** eAG mg/dL = 28.7 × A1c − 46.7 */
export function eagFromHba1c(params: {
  hba1cPct: number;
}): { eagMgdl: number; eagMmol: number } | { error: string } {
  if (params.hba1cPct <= 0) return { error: "HbA1c must be positive." };
  const eagMgdl = 28.7 * params.hba1cPct - 46.7;
  return { eagMgdl, eagMmol: eagMgdl / 18 };
}

/** Correction + carb bolus (units). */
export function insulinDose(params: {
  currentBg: number;
  targetBg: number;
  isf: number;
  carbsG: number;
  icr: number;
}): { correctionU: number; carbU: number; totalU: number } | { error: string } {
  if (params.isf <= 0 || params.icr <= 0) return { error: "ISF and I:C ratio must be positive." };
  if (params.carbsG < 0) return { error: "Carbs cannot be negative." };
  const correctionU = Math.max(0, (params.currentBg - params.targetBg) / params.isf);
  const carbU = params.carbsG / params.icr;
  return { correctionU, carbU, totalU: correctionU + carbU };
}

/** ISF (rule of 1800): 1800 / TDD */
export function insulinSensitivityFactor(params: {
  tdd: number;
  rule?: number;
}): { isf: number; note: string } | { error: string } {
  if (params.tdd <= 0) return { error: "Total daily dose must be positive." };
  const rule = params.rule ?? 1800;
  return {
    isf: rule / params.tdd,
    note: "Rule-of-1800 teaching estimate (mg/dL drop per unit) — not a prescription.",
  };
}

/** Carb coverage units = carbs / ICR */
export function carbohydrateCoverage(params: {
  carbsG: number;
  icr: number;
}): { units: number } | { error: string } {
  if (params.carbsG < 0 || params.icr <= 0) return { error: "Carbs ≥ 0 and I:C > 0." };
  return { units: params.carbsG / params.icr };
}
