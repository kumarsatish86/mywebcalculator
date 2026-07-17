/** Reproductive / pregnancy day math — educational estimates only, not medical advice. */

export const BIOLOGY_PREGNANCY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseBiologyPregnancySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_PREGNANCY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function parseYmd(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Ovulation ≈ LMP + (cycleLength − 14) */
export function ovulation(params: {
  lmpYmd: string;
  cycleLength: number;
}): { ovulationYmd: string; dayInCycle: number } | { error: string } {
  const lmp = parseYmd(params.lmpYmd);
  if (!lmp) return { error: "LMP must be YYYY-MM-DD." };
  if (params.cycleLength < 20 || params.cycleLength > 45) {
    return { error: "Cycle length should be about 20–45 days for this estimator." };
  }
  const dayInCycle = params.cycleLength - 14;
  return { ovulationYmd: fmt(addDays(lmp, dayInCycle)), dayInCycle };
}

/** Naegele: LMP + 280 days */
export function pregnancyDueDate(params: {
  lmpYmd: string;
}): { dueYmd: string } | { error: string } {
  const lmp = parseYmd(params.lmpYmd);
  if (!lmp) return { error: "LMP must be YYYY-MM-DD." };
  return { dueYmd: fmt(addDays(lmp, 280)) };
}

/** Fertility window ≈ ovulation − 5 … ovulation + 1 */
export function fertilityWindow(params: {
  lmpYmd: string;
  cycleLength: number;
}): { startYmd: string; endYmd: string; ovulationYmd: string } | { error: string } {
  const ov = ovulation(params);
  if ("error" in ov) return ov;
  const ovDate = parseYmd(ov.ovulationYmd)!;
  return {
    ovulationYmd: ov.ovulationYmd,
    startYmd: fmt(addDays(ovDate, -5)),
    endYmd: fmt(addDays(ovDate, 1)),
  };
}

export function menstrualCycle(params: {
  lmpYmd: string;
  cycleLength: number;
}): { nextPeriodYmd: string; ovulationYmd: string } | { error: string } {
  const lmp = parseYmd(params.lmpYmd);
  if (!lmp) return { error: "LMP must be YYYY-MM-DD." };
  if (params.cycleLength < 20 || params.cycleLength > 45) {
    return { error: "Cycle length should be about 20–45 days." };
  }
  const ov = ovulation(params);
  if ("error" in ov) return ov;
  return {
    nextPeriodYmd: fmt(addDays(lmp, params.cycleLength)),
    ovulationYmd: ov.ovulationYmd,
  };
}

/** Conception estimate ≈ ovulation day (educational). */
export function conception(params: {
  lmpYmd: string;
  cycleLength: number;
}): { conceptionYmd: string } | { error: string } {
  const ov = ovulation(params);
  if ("error" in ov) return ov;
  return { conceptionYmd: ov.ovulationYmd };
}

/**
 * IOM-style total recommended gain ranges by pre-pregnancy BMI category (kg).
 * Educational ranges only — not personalized medical guidance.
 */
export function pregnancyWeightGain(params: {
  preBmi: number;
  currentGainKg: number;
}): { recommendedMinKg: number; recommendedMaxKg: number; status: string } | { error: string } {
  if (params.preBmi <= 0) return { error: "BMI must be positive." };
  let min = 11.5;
  let max = 16;
  if (params.preBmi < 18.5) {
    min = 12.5;
    max = 18;
  } else if (params.preBmi < 25) {
    min = 11.5;
    max = 16;
  } else if (params.preBmi < 30) {
    min = 7;
    max = 11.5;
  } else {
    min = 5;
    max = 9;
  }
  const g = params.currentGainKg;
  const status =
    g < min ? "Below typical total-gain band (so far / overall)." : g > max ? "Above typical total-gain band." : "Within typical total-gain band.";
  return { recommendedMinKg: min, recommendedMaxKg: max, status };
}
