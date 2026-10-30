/** Pregnancy / cycle dating helpers — not obstetric diagnosis. */

export const MEDICAL_PREGNANCY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
} as const;

export function parseMedicalPregnancySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_PREGNANCY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function parseDate(iso: string): Date | { error: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return { error: "Date as YYYY-MM-DD." };
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime())) return { error: "Invalid date." };
  return d;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

/** Naegele: LMP + 280 days. */
export function pregnancyDueDate(params: {
  lmp: string;
}): { edd: string; note: string } | { error: string } {
  const lmp = parseDate(params.lmp);
  if ("error" in lmp) return lmp;
  return { edd: fmt(addDays(lmp, 280)), note: "Naegele’s rule (+280 days) — planning estimate only." };
}

export function ovulationCalculator(params: {
  lmp: string;
  cycleLength?: number;
}): { ovulation: string; note: string } | { error: string } {
  const lmp = parseDate(params.lmp);
  if ("error" in lmp) return lmp;
  const cycle = params.cycleLength ?? 28;
  if (cycle < 21 || cycle > 45) return { error: "Cycle length usually 21–45 days for this helper." };
  const ovulationDay = cycle - 14;
  return {
    ovulation: fmt(addDays(lmp, ovulationDay)),
    note: "Assumes ovulation ~14 days before next period — not a fertility diagnosis.",
  };
}

export function fertilityWindow(params: {
  lmp: string;
  cycleLength?: number;
}): { start: string; end: string; ovulation: string } | { error: string } {
  const ov = ovulationCalculator(params);
  if ("error" in ov) return ov;
  const ovulation = parseDate(ov.ovulation);
  if ("error" in ovulation) return ovulation;
  return {
    start: fmt(addDays(ovulation, -5)),
    end: fmt(addDays(ovulation, 1)),
    ovulation: ov.ovulation,
  };
}

export function gestationalAge(params: {
  lmp: string;
  today?: string;
}): { weeks: number; days: number; totalDays: number } | { error: string } {
  const lmp = parseDate(params.lmp);
  if ("error" in lmp) return lmp;
  const today = params.today ? parseDate(params.today) : new Date();
  if ("error" in today) return today;
  const totalDays = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
  if (totalDays < 0) return { error: "Today cannot be before LMP." };
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7, totalDays };
}

/** IOM-style gain ranges by pre-pregnancy BMI band (total kg teaching). */
export function pregnancyWeightGain(params: {
  preBmi: number;
  currentGainKg: number;
}): { recommendedKg: string; status: string } | { error: string } {
  if (params.preBmi <= 0) return { error: "Pre-pregnancy BMI must be positive." };
  let recommendedKg: string;
  if (params.preBmi < 18.5) recommendedKg = "12.5–18";
  else if (params.preBmi < 25) recommendedKg = "11.5–16";
  else if (params.preBmi < 30) recommendedKg = "7–11.5";
  else recommendedKg = "5–9";
  return {
    recommendedKg,
    status: `Current gain ${params.currentGainKg} kg vs teaching total range ${recommendedKg} kg (IOM-style bands).`,
  };
}

export function conceptionCalculator(params: {
  lmp: string;
  cycleLength?: number;
}): { conceptionEstimate: string } | { error: string } {
  const ov = ovulationCalculator(params);
  if ("error" in ov) return ov;
  return { conceptionEstimate: ov.ovulation };
}

/** Toy IVF success % by age band. */
export function ivfSuccess(params: {
  age: number;
}): { successPct: number; note: string } | { error: string } {
  if (params.age < 18 || params.age > 50) return { error: "Age 18–50 for this helper." };
  let successPct: number;
  if (params.age < 35) successPct = 40;
  else if (params.age < 38) successPct = 30;
  else if (params.age < 40) successPct = 20;
  else if (params.age < 43) successPct = 10;
  else successPct = 5;
  return { successPct, note: "Illustrative age-band rates only — clinic outcomes vary widely." };
}

export function menstrualCycle(params: {
  lmp: string;
  cycleLength?: number;
}): { nextPeriod: string; cycleLength: number } | { error: string } {
  const lmp = parseDate(params.lmp);
  if ("error" in lmp) return lmp;
  const cycleLength = params.cycleLength ?? 28;
  if (cycleLength < 21 || cycleLength > 45) return { error: "Cycle length usually 21–45 days." };
  return { nextPeriod: fmt(addDays(lmp, cycleLength)), cycleLength };
}
