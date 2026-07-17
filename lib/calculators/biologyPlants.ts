/** Plant biology: photosynthesis, transpiration, LAI, yield, growth (educational). */

export const BIOLOGY_PLANTS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseBiologyPlantsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_PLANTS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Net photosynthesis rate ≈ (CO₂ assimilated) / (leaf area × time) */
export function photosynthesisRate(params: {
  co2Umol: number;
  leafAreaM2: number;
  timeS: number;
}): { rate: number } | { error: string } {
  if (params.leafAreaM2 <= 0 || params.timeS <= 0) {
    return { error: "Leaf area and time must be positive." };
  }
  if (params.co2Umol < 0) return { error: "CO₂ amount cannot be negative." };
  return { rate: params.co2Umol / (params.leafAreaM2 * params.timeS) };
}

/** Transpiration rate = water mass lost / (area × time) */
export function transpirationRate(params: {
  waterKg: number;
  leafAreaM2: number;
  timeS: number;
}): { rate: number } | { error: string } {
  if (params.leafAreaM2 <= 0 || params.timeS <= 0) {
    return { error: "Leaf area and time must be positive." };
  }
  if (params.waterKg < 0) return { error: "Water mass cannot be negative." };
  return { rate: params.waterKg / (params.leafAreaM2 * params.timeS) };
}

/** LAI = total leaf area / ground area */
export function leafAreaIndex(params: {
  leafAreaM2: number;
  groundAreaM2: number;
}): { lai: number } | { error: string } {
  if (params.groundAreaM2 <= 0) return { error: "Ground area must be positive." };
  if (params.leafAreaM2 < 0) return { error: "Leaf area cannot be negative." };
  return { lai: params.leafAreaM2 / params.groundAreaM2 };
}

/** Yield = mass harvested / area */
export function cropYield(params: {
  harvestKg: number;
  areaHa: number;
}): { yieldKgHa: number } | { error: string } {
  if (params.areaHa <= 0) return { error: "Area (ha) must be positive." };
  if (params.harvestKg < 0) return { error: "Harvest mass cannot be negative." };
  return { yieldKgHa: params.harvestKg / params.areaHa };
}

/** Relative growth rate ≈ (ln W2 − ln W1) / Δt */
export function plantGrowthRate(params: {
  mass1: number;
  mass2: number;
  timeDays: number;
}): { rgr: number } | { error: string } {
  if (params.mass1 <= 0 || params.mass2 <= 0) return { error: "Masses must be positive." };
  if (params.timeDays <= 0) return { error: "Time must be positive." };
  return { rgr: (Math.log(params.mass2) - Math.log(params.mass1)) / params.timeDays };
}
