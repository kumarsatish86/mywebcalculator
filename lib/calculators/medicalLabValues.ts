/** Lab-value correction / derived chemistry — study aids only. */

export const MEDICAL_LAB_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseMedicalLabSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_LAB_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Altitude Hb correction teaching: Hb_corr ≈ Hb × (1 + 0.03 × altitude_km) — illustrative. */
export function hemoglobinCorrection(params: {
  hb: number;
  altitudeKm: number;
}): { corrected: number; note: string } | { error: string } {
  if (params.hb <= 0) return { error: "Hemoglobin must be positive." };
  if (params.altitudeKm < 0) return { error: "Altitude cannot be negative." };
  return {
    corrected: params.hb * (1 + 0.03 * params.altitudeKm),
    note: "Illustrative altitude scaling — not a WHO anemia cut-off table.",
  };
}

/** Calculated osm = 2×Na + glucose/18 + BUN/2.8 (mg/dL units). */
export function serumOsmolality(params: {
  na: number;
  glucoseMgDl: number;
  bunMgDl: number;
}): { osm: number } | { error: string } {
  if (params.na <= 0 || params.glucoseMgDl < 0 || params.bunMgDl < 0) {
    return { error: "Na must be positive; glucose/BUN ≥ 0." };
  }
  return { osm: 2 * params.na + params.glucoseMgDl / 18 + params.bunMgDl / 2.8 };
}

/** Corrected anion gap for low albumin: AG + 2.5 × (4 − albumin). */
export function albuminCorrectionAg(params: {
  anionGap: number;
  albuminGDl: number;
}): { correctedGap: number } | { error: string } {
  if (params.albuminGDl <= 0) return { error: "Albumin must be positive." };
  return { correctedGap: params.anionGap + 2.5 * (4 - params.albuminGDl) };
}

/** Corrected Na for hyperglycemia: Na + 1.6 × ((glu−100)/100) */
export function sodiumCorrection(params: {
  na: number;
  glucoseMgDl: number;
}): { correctedNa: number } | { error: string } {
  if (params.na <= 0 || params.glucoseMgDl <= 0) return { error: "Na and glucose must be positive." };
  return { correctedNa: params.na + 1.6 * ((params.glucoseMgDl - 100) / 100) };
}

/** K deficit ≈ (target − current) × 0.4 × weightKg (mmol teaching). */
export function potassiumDeficit(params: {
  currentK: number;
  targetK: number;
  weightKg: number;
}): { deficitMmol: number; note: string } | { error: string } {
  if (params.weightKg <= 0) return { error: "Weight must be positive." };
  if (params.targetK <= params.currentK) return { error: "Target K should exceed current K for deficit." };
  return {
    deficitMmol: (params.targetK - params.currentK) * 0.4 * params.weightKg,
    note: "Rough ECF deficit teaching formula — not a repletion protocol.",
  };
}

/** Same Payne corrected calcium as drug module. */
export function calciumCorrectionLab(params: {
  calciumMgDl: number;
  albuminGDl: number;
}): { corrected: number } | { error: string } {
  if (params.calciumMgDl <= 0 || params.albuminGDl <= 0) {
    return { error: "Calcium and albumin must be positive." };
  }
  return { corrected: params.calciumMgDl + 0.8 * (4 - params.albuminGDl) };
}
