/** Respiratory educational calculators. */

export const MEDICAL_RESP_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  F: "f",
} as const;

export function parseMedicalRespSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_RESP_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Rough O₂ flow from SpO₂ deficit heuristic (L/min teaching). */
export function oxygenRequirement(params: {
  spo2: number;
  targetSpo2: number;
}): { estimateLpm: number; note: string } | { error: string } {
  if (params.spo2 <= 0 || params.spo2 > 100 || params.targetSpo2 <= 0 || params.targetSpo2 > 100) {
    return { error: "SpO₂ values must be between 0 and 100." };
  }
  const deficit = Math.max(0, params.targetSpo2 - params.spo2);
  const estimateLpm = Math.min(15, deficit * 0.5);
  return {
    estimateLpm,
    note: "Crude classroom heuristic — not a titration protocol.",
  };
}

/** VC ≈ IRV + TV + ERV (mL). */
export function lungCapacity(params: {
  irvMl: number;
  tvMl: number;
  ervMl: number;
}): { vcMl: number } | { error: string } {
  if (params.irvMl < 0 || params.tvMl <= 0 || params.ervMl < 0) {
    return { error: "Enter non-negative IRV/ERV and positive TV." };
  }
  return { vcMl: params.irvMl + params.tvMl + params.ervMl };
}

/** % predicted peak flow = (measured / predicted) × 100. */
export function peakFlow(params: {
  measured: number;
  predicted: number;
}): { percentPredicted: number; band: string } | { error: string } {
  if (params.measured <= 0 || params.predicted <= 0) {
    return { error: "Measured and predicted PEF must be positive." };
  }
  const percentPredicted = (params.measured / params.predicted) * 100;
  let band: string;
  if (percentPredicted >= 80) band = "Green zone band (teaching asthma action plans)";
  else if (percentPredicted >= 50) band = "Yellow zone band (teaching)";
  else band = "Red zone band (teaching) — seek care guidance";
  return { percentPredicted, band };
}

/** PAO₂ = FIO₂ (Patm − PH₂O) − PaCO₂ / R. */
export function alveolarGasEquation(params: {
  fio2: number;
  paco2: number;
  patm?: number;
  ph2o?: number;
  r?: number;
}): { pao2: number; note: string } | { error: string } {
  if (params.fio2 <= 0 || params.fio2 > 1) return { error: "FIO₂ as fraction 0–1 (e.g. 0.21)." };
  if (params.paco2 <= 0) return { error: "PaCO₂ must be positive (mmHg)." };
  const patm = params.patm ?? 760;
  const ph2o = params.ph2o ?? 47;
  const r = params.r ?? 0.8;
  if (patm <= ph2o || r <= 0) return { error: "Check Patm, PH₂O, and R." };
  const pao2 = params.fio2 * (patm - ph2o) - params.paco2 / r;
  return {
    pao2,
    note: "Ideal alveolar gas equation (mmHg) — educational physiology.",
  };
}
