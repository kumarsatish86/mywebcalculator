/** Lifestyle / habit estimators — wellness literacy only, not clinical advice. */

export const MEDICAL_LIFESTYLE_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
} as const;

export function parseMedicalLifestyleSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_LIFESTYLE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Pack-years and rough cost: packYears = (cig/day / 20) × years. */
export function smokingImpact(params: {
  cigPerDay: number;
  years: number;
  costPerPack?: number;
}): { packYears: number; packsPerYear: number; annualCost?: number } | { error: string } {
  if (params.cigPerDay < 0 || params.years < 0) return { error: "Inputs cannot be negative." };
  const packYears = (params.cigPerDay / 20) * params.years;
  const packsPerYear = (params.cigPerDay / 20) * 365;
  const out: { packYears: number; packsPerYear: number; annualCost?: number } = {
    packYears,
    packsPerYear,
  };
  if (params.costPerPack != null) {
    if (params.costPerPack < 0) return { error: "Cost cannot be negative." };
    out.annualCost = packsPerYear * params.costPerPack;
  }
  return out;
}

/** Weekly alcohol units (UK-style): units = volume_ml × ABV% / 1000. */
export function alcoholConsumption(params: {
  volumeMl: number;
  abvPct: number;
  drinksPerWeek: number;
}): { unitsPerDrink: number; unitsPerWeek: number; band: string } | { error: string } {
  if (params.volumeMl <= 0 || params.abvPct <= 0 || params.drinksPerWeek < 0) {
    return { error: "Volume and ABV must be positive; drinks/week ≥ 0." };
  }
  const unitsPerDrink = (params.volumeMl * params.abvPct) / 1000;
  const unitsPerWeek = unitsPerDrink * params.drinksPerWeek;
  let band: string;
  if (unitsPerWeek <= 14) band = "Within common low-risk weekly guidance (UK teaching ~14 units)";
  else if (unitsPerWeek <= 21) band = "Above low-risk guidance — discuss with a clinician";
  else band = "Well above low-risk guidance — seek professional advice";
  return { unitsPerDrink, unitsPerWeek, band };
}

/** 90-min sleep cycles from bedtime HH:MM. */
export function medicalSleepCycle(params: {
  bedtime: string;
  cycles?: number;
}): { wakeTimes: string[]; note: string } | { error: string } {
  const m = /^(\d{1,2}):(\d{2})$/.exec(params.bedtime.trim());
  if (!m) return { error: "Bedtime as HH:MM (24-hour)." };
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return { error: "Invalid bedtime." };
  const cycles = params.cycles ?? 5;
  if (cycles < 1 || cycles > 8) return { error: "Cycles must be 1–8." };
  let totalMin = h * 60 + min + 15;
  const wakeTimes: string[] = [];
  for (let i = 1; i <= cycles; i++) {
    totalMin += 90;
    const wh = Math.floor(totalMin / 60) % 24;
    const wm = totalMin % 60;
    wakeTimes.push(`${String(wh).padStart(2, "0")}:${String(wm).padStart(2, "0")}`);
  }
  return {
    wakeTimes,
    note: "Assumes ~15 min to fall asleep and 90 min cycles — not medical advice.",
  };
}

/** Stress index from 1–5 Likert items (CSV). */
export function stressLevel(params: {
  scoresCsv: string;
}): { mean: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length < 3) return { error: "Enter at least 3 scores from 1–5." };
  if (scores.some((s) => s < 1 || s > 5)) return { error: "Each score must be 1–5." };
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  let band: string;
  if (mean < 2.5) band = "Lower perceived stress band (self-report only)";
  else if (mean < 3.5) band = "Moderate perceived stress band";
  else band = "Higher perceived stress band — consider professional support";
  return { mean, band };
}
