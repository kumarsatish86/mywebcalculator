/** Drug dosage / pharmacology teaching math — never overrides pharmacy. */

export const MEDICAL_DRUG_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  H: "h",
  S: "s",
} as const;

export function parseMedicalDrugSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_DRUG_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function dosageMgKg(params: {
  weightKg: number;
  mgPerKg: number;
}): { doseMg: number } | { error: string } {
  if (params.weightKg <= 0 || params.mgPerKg <= 0) return { error: "Weight and mg/kg must be positive." };
  return { doseMg: params.weightKg * params.mgPerKg };
}

/** gtt/min = (volume_mL × dropFactor) / time_min */
export function ivDripRate(params: {
  volumeMl: number;
  timeMin: number;
  dropFactor: number;
}): { gttPerMin: number } | { error: string } {
  if (params.volumeMl <= 0 || params.timeMin <= 0 || params.dropFactor <= 0) {
    return { error: "Volume, time, and drop factor must be positive." };
  }
  return { gttPerMin: (params.volumeMl * params.dropFactor) / params.timeMin };
}

/** mL/hr = volume_mL / hours */
export function infusionRate(params: {
  volumeMl: number;
  hours: number;
}): { mlPerHr: number } | { error: string } {
  if (params.volumeMl <= 0 || params.hours <= 0) return { error: "Volume and hours must be positive." };
  return { mlPerHr: params.volumeMl / params.hours };
}

/** Cockcroft–Gault CrCl (mL/min). */
export function creatinineClearance(params: {
  age: number;
  weightKg: number;
  creatinineMgDl: number;
  sex: "male" | "female";
}): { crcl: number } | { error: string } {
  if (params.age <= 0 || params.weightKg <= 0 || params.creatinineMgDl <= 0) {
    return { error: "Age, weight, and creatinine must be positive." };
  }
  const sexFactor = params.sex === "female" ? 0.85 : 1;
  return {
    crcl: ((140 - params.age) * params.weightKg * sexFactor) / (72 * params.creatinineMgDl),
  };
}

/** CKD-EPI 2021 (race-free) simplified for teaching — creatinine mg/dL. */
export function egfrCkdepi(params: {
  age: number;
  creatinineMgDl: number;
  sex: "male" | "female";
}): { egfr: number; note: string } | { error: string } {
  if (params.age <= 0 || params.creatinineMgDl <= 0) return { error: "Age and creatinine must be positive." };
  const scr = params.creatinineMgDl;
  const kappa = params.sex === "female" ? 0.7 : 0.9;
  const alpha = params.sex === "female" ? -0.241 : -0.302;
  const minRatio = Math.min(scr / kappa, 1);
  const maxRatio = Math.max(scr / kappa, 1);
  const sexCoeff = params.sex === "female" ? 1.012 : 1;
  const egfr = 142 * minRatio ** alpha * maxRatio ** -1.2 * 0.9938 ** params.age * sexCoeff;
  return { egfr, note: "CKD-EPI 2021 race-free teaching form — verify with lab/clinical tools." };
}

/** Corrected Ca = measured + 0.8 × (4 − albumin) */
export function correctedCalcium(params: {
  calciumMgDl: number;
  albuminGDl: number;
}): { corrected: number } | { error: string } {
  if (params.calciumMgDl <= 0 || params.albuminGDl <= 0) {
    return { error: "Calcium and albumin must be positive." };
  }
  return { corrected: params.calciumMgDl + 0.8 * (4 - params.albuminGDl) };
}

/** AG = Na − (Cl + HCO3) */
export function anionGap(params: {
  na: number;
  cl: number;
  hco3: number;
}): { gap: number; band: string } | { error: string } {
  if (params.na <= 0 || params.cl <= 0 || params.hco3 <= 0) {
    return { error: "Na, Cl, and HCO₃ must be positive." };
  }
  const gap = params.na - (params.cl + params.hco3);
  const band = gap < 8 ? "Low/normal-low band (teaching)" : gap <= 12 ? "Typical teaching normal" : "Elevated band (teaching)";
  return { gap, band };
}
