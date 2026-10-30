/** Clinical risk scores — educational reference only, not for care decisions. */

export const MEDICAL_CLINICAL_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  M: "m",
  V: "v",
  W: "w",
} as const;

export function parseMedicalClinicalSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_CLINICAL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function bit(x: number, label: string): number | { error: string } {
  if (x !== 0 && x !== 1) return { error: `${label} must be 0 or 1.` };
  return x;
}

/** CHA₂DS₂-VASc from binary flags (age≥75 and prior stroke worth 2). */
export function cha2ds2Vasc(params: {
  chf: number;
  htn: number;
  age75: number;
  diabetes: number;
  stroke: number;
  vascular: number;
  age65_74: number;
  female: number;
}): { score: number; band: string } | { error: string } {
  for (const [v, l] of [
    [params.chf, "CHF"],
    [params.htn, "Hypertension"],
    [params.age75, "Age≥75"],
    [params.diabetes, "Diabetes"],
    [params.stroke, "Prior stroke/TIA"],
    [params.vascular, "Vascular disease"],
    [params.age65_74, "Age 65–74"],
    [params.female, "Female sex"],
  ] as const) {
    const b = bit(v, l);
    if (typeof b === "object") return b;
  }
  if (params.age75 && params.age65_74) {
    return { error: "Use either Age≥75 or Age 65–74, not both." };
  }
  const score =
    params.chf +
    params.htn +
    params.age75 * 2 +
    params.diabetes +
    params.stroke * 2 +
    params.vascular +
    params.age65_74 +
    params.female;
  let band: string;
  if (score === 0) band = "Low annual stroke risk category (teaching bands)";
  else if (score === 1) band = "Low–moderate category (teaching bands)";
  else band = "Moderate–high category (teaching bands)";
  return { score, band };
}

/** Wells PE (simplified 7-item) or DVT (simplified) — mode pe|dvt. */
export function wellsScore(params: {
  mode: "pe" | "dvt";
  flagsCsv: string;
}): { score: number; band: string } | { error: string } {
  const flags = params.flagsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n): n is number => n === 0 || n === 1);
  if (params.mode === "pe") {
    // weights: 3,3,1.5,1.5,1.5,1,1 (classic simplified PE)
    const w = [3, 3, 1.5, 1.5, 1.5, 1, 1];
    if (flags.length !== w.length) {
      return { error: "PE mode: enter 7 flags (0/1) for classic Wells PE items." };
    }
    const score = flags.reduce((s, f, i) => s + Number(f) * w[i]!, 0 as number);
    const band =
      score <= 1.5 ? "Low PE probability (teaching)" : score <= 6 ? "Moderate" : "High";
    return { score, band };
  }
  // DVT: ten 1-point items common teaching form
  if (flags.length < 3 || flags.length > 12) {
    return { error: "DVT mode: enter 3–12 binary (0/1) Wells-style items." };
  }
  const score = flags.reduce((s, f) => s + f, 0);
  const band = score < 2 ? "Unlikely DVT (teaching)" : "Likely DVT (teaching)";
  return { score, band };
}

/** Original MELD (pre-2016 Na). */
export function meldScore(params: {
  bilirubin: number;
  inr: number;
  creatinine: number;
}): { meld: number; note: string } | { error: string } {
  if (params.bilirubin <= 0 || params.inr <= 0 || params.creatinine <= 0) {
    return { error: "Bilirubin, INR, and creatinine must be positive." };
  }
  const bili = Math.max(params.bilirubin, 1);
  const inr = Math.max(params.inr, 1);
  const cr = Math.min(Math.max(params.creatinine, 1), 4);
  const meld = Math.round(
    3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43,
  );
  return {
    meld: Math.max(meld, 6),
    note: "Original MELD teaching form (creatinine capped at 4; mins at 1). Not for listing decisions.",
  };
}

/** SOFA: sum of six organ scores 0–4 each (CSV). */
export function sofaScore(params: {
  scoresCsv: string;
}): { score: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length !== 6) return { error: "Enter 6 SOFA organ scores (0–4 each)." };
  if (scores.some((s) => s < 0 || s > 4 || !Number.isInteger(s))) {
    return { error: "Each SOFA component must be an integer 0–4." };
  }
  const score = scores.reduce((a, b) => a + b, 0);
  const band =
    score <= 6 ? "Lower acuity band (teaching)" : score <= 12 ? "Intermediate" : "Higher acuity band (teaching)";
  return { score, band };
}

/** Child–Pugh: five components scored 1–3 each via CSV. */
export function childPughScore(params: {
  scoresCsv: string;
}): { score: number; classLetter: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length !== 5) return { error: "Enter 5 Child–Pugh component scores (1–3 each)." };
  if (scores.some((s) => s < 1 || s > 3 || !Number.isInteger(s))) {
    return { error: "Each component must be an integer 1–3." };
  }
  const score = scores.reduce((a, b) => a + b, 0);
  const classLetter = score <= 6 ? "A" : score <= 9 ? "B" : "C";
  return { score, classLetter };
}

/** CURB-65: five binary criteria. */
export function curb65Score(params: {
  confusion: number;
  urea: number;
  resp: number;
  bp: number;
  age65: number;
}): { score: number; band: string } | { error: string } {
  for (const [v, l] of [
    [params.confusion, "Confusion"],
    [params.urea, "Urea"],
    [params.resp, "Respiratory rate"],
    [params.bp, "Blood pressure"],
    [params.age65, "Age≥65"],
  ] as const) {
    const b = bit(v, l);
    if (typeof b === "object") return b;
  }
  const score =
    params.confusion + params.urea + params.resp + params.bp + params.age65;
  const band =
    score <= 1 ? "Low severity band (teaching)" : score === 2 ? "Moderate" : "Higher severity band (teaching)";
  return { score, band };
}
