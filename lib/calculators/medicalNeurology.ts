/** Neurology / mental-health screening math — not for diagnosis. */

export const MEDICAL_NEURO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  E: "e",
  V: "v",
  M: "m",
} as const;

export function parseMedicalNeuroSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_NEURO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** GCS = E + V + M. */
export function glasgowComaScale(params: {
  eye: number;
  verbal: number;
  motor: number;
}): { gcs: number; band: string } | { error: string } {
  if (params.eye < 1 || params.eye > 4 || !Number.isInteger(params.eye)) {
    return { error: "Eye opening must be integer 1–4." };
  }
  if (params.verbal < 1 || params.verbal > 5 || !Number.isInteger(params.verbal)) {
    return { error: "Verbal must be integer 1–5." };
  }
  if (params.motor < 1 || params.motor > 6 || !Number.isInteger(params.motor)) {
    return { error: "Motor must be integer 1–6." };
  }
  const gcs = params.eye + params.verbal + params.motor;
  const band =
    gcs >= 13 ? "Mild band (teaching)" : gcs >= 9 ? "Moderate" : "Severe band (teaching)";
  return { gcs, band };
}

/** PHQ-9: sum of 9 items 0–3, or single total. */
export function phq9Score(params: {
  scoresCsv: string;
}): { total: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length === 1) {
    const total = scores[0]!;
    if (total < 0 || total > 27 || !Number.isInteger(total)) {
      return { error: "PHQ-9 total must be an integer 0–27." };
    }
    return { total, band: phqBand(total) };
  }
  if (scores.length !== 9) return { error: "Enter 9 item scores (0–3) or one total 0–27." };
  if (scores.some((s) => s < 0 || s > 3 || !Number.isInteger(s))) {
    return { error: "Each PHQ-9 item must be an integer 0–3." };
  }
  const total = scores.reduce((a, b) => a + b, 0);
  return { total, band: phqBand(total) };
}

function phqBand(total: number): string {
  if (total <= 4) return "Minimal symptoms band (screening teaching)";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  if (total <= 19) return "Moderately severe";
  return "Severe band (screening teaching)";
}

/** GAD-7: sum of 7 items 0–3, or single total. */
export function gad7Score(params: {
  scoresCsv: string;
}): { total: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length === 1) {
    const total = scores[0]!;
    if (total < 0 || total > 21 || !Number.isInteger(total)) {
      return { error: "GAD-7 total must be an integer 0–21." };
    }
    return { total, band: gadBand(total) };
  }
  if (scores.length !== 7) return { error: "Enter 7 item scores (0–3) or one total 0–21." };
  if (scores.some((s) => s < 0 || s > 3 || !Number.isInteger(s))) {
    return { error: "Each GAD-7 item must be an integer 0–3." };
  }
  const total = scores.reduce((a, b) => a + b, 0);
  return { total, band: gadBand(total) };
}

function gadBand(total: number): string {
  if (total <= 4) return "Minimal anxiety band (screening teaching)";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  return "Severe band (screening teaching)";
}

/** Simplified stroke risk points from age + binary risks. */
export function strokeRisk(params: {
  age: number;
  htn: number;
  diabetes: number;
  smoke: number;
  afib: number;
  priorStroke: number;
}): { points: number; band: string; note: string } | { error: string } {
  if (params.age < 18 || params.age > 100) return { error: "Enter age 18–100." };
  for (const [v, l] of [
    [params.htn, "Hypertension"],
    [params.diabetes, "Diabetes"],
    [params.smoke, "Smoking"],
    [params.afib, "AFib"],
    [params.priorStroke, "Prior stroke"],
  ] as const) {
    if (v !== 0 && v !== 1) return { error: `${l} must be 0 or 1.` };
  }
  const points =
    (params.age >= 65 ? 2 : params.age >= 55 ? 1 : 0) +
    params.htn +
    params.diabetes +
    params.smoke +
    params.afib * 2 +
    params.priorStroke * 2;
  const band =
    points <= 2 ? "Lower relative points (teaching)" : points <= 5 ? "Moderate" : "Higher relative points";
  return {
    points,
    band,
    note: "Not CHA₂DS₂-VASc or a validated stroke model — awareness tally only.",
  };
}
