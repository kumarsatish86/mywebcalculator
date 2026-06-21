import { AGE_TIPS, PERSONAL_TIPS } from "./timeDateKnowledge";
import {
  addCalendarDays,
  ageParts,
  dayName,
  diffDays,
  elapsedParts,
  formatElapsed,
  nextBirthday,
  parseDateTimeLocal,
  parseLocalDate,
} from "./timeDateCore";
import type { TimeRichResult } from "./timeDateRich";

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

const ZODIAC = [
  { sign: "Capricorn", element: "Earth", from: [12, 22], to: [1, 19] },
  { sign: "Aquarius", element: "Air", from: [1, 20], to: [2, 18] },
  { sign: "Pisces", element: "Water", from: [2, 19], to: [3, 20] },
  { sign: "Aries", element: "Fire", from: [3, 21], to: [4, 19] },
  { sign: "Taurus", element: "Earth", from: [4, 20], to: [5, 20] },
  { sign: "Gemini", element: "Air", from: [5, 21], to: [6, 20] },
  { sign: "Cancer", element: "Water", from: [6, 21], to: [7, 22] },
  { sign: "Leo", element: "Fire", from: [7, 23], to: [8, 22] },
  { sign: "Virgo", element: "Earth", from: [8, 23], to: [9, 22] },
  { sign: "Libra", element: "Air", from: [9, 23], to: [10, 22] },
  { sign: "Scorpio", element: "Water", from: [10, 23], to: [11, 21] },
  { sign: "Sagittarius", element: "Fire", from: [11, 22], to: [12, 21] },
] as const;

function zodiacForDate(d: Date): { sign: string; element: string } {
  const md = (d.getMonth() + 1) * 100 + d.getDate();
  for (const z of ZODIAC) {
    const [fm, fd] = z.from;
    const [tm, td] = z.to;
    const fromKey = fm * 100 + fd;
    const toKey = tm * 100 + td;
    if (fromKey > toKey) {
      if (md >= fromKey || md <= toKey) return { sign: z.sign, element: z.element };
    } else if (md >= fromKey && md <= toKey) {
      return { sign: z.sign, element: z.element };
    }
  }
  return { sign: "Capricorn", element: "Earth" };
}

function lifePathFromDate(d: Date): number {
  const digits = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`.split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split("").reduce((a, c) => a + Number(c), 0);
  }
  return sum;
}

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: "Independence, leadership, and new beginnings.",
  2: "Cooperation, balance, and diplomacy.",
  3: "Creativity, expression, and optimism.",
  4: "Structure, discipline, and practical building.",
  5: "Freedom, change, and adventure.",
  6: "Responsibility, family, and nurturing.",
  7: "Analysis, spirituality, and introspection.",
  8: "Ambition, power, and material mastery.",
  9: "Compassion, completion, and humanitarian focus.",
  11: "Intuition and inspirational leadership (master number).",
  22: "Visionary builder and large-scale impact (master number).",
  33: "Healing, teaching, and selfless service (master number).",
};

export function computeExactAge(
  dob: string,
  birthTime: string,
  asOfDate: string,
  asOfTime: string,
): TimeRichResult | { error: string } {
  const birth = parseDateTimeLocal(dob, birthTime);
  const ref = parseDateTimeLocal(asOfDate, asOfTime);
  if (typeof birth === "object" && "error" in birth) return birth;
  if (typeof ref === "object" && "error" in ref) return ref;
  if (birth > ref) return { error: "Birth must be before the reference time." };
  const cal = ageParts(birth, ref);
  const elapsed = elapsedParts(birth, ref);
  return ok({
    primary: `${cal.years}y ${cal.months}m ${cal.days}d`,
    primaryLabel: `${elapsed.totalSeconds.toLocaleString()} seconds · ${elapsed.totalSeconds.toLocaleString()} sec precision`,
    rows: [
      { label: "Total days", value: elapsed.days.toLocaleString() },
      { label: "Total hours", value: Math.floor(elapsed.totalSeconds / 3600).toLocaleString() },
      { label: "Seconds (remainder)", value: String(elapsed.seconds) },
    ],
    breakdown: [
      { label: "Years", value: String(cal.years) },
      { label: "Months", value: String(cal.months) },
      { label: "Days", value: String(cal.days) },
      { label: "Minutes", value: String(elapsed.minutes) },
    ],
    insights: [{ title: "Born on", detail: `${dayName(birth)}, ${birth.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}` }],
    tips: AGE_TIPS,
  });
}

export function computeBirthdayCountdown(dob: string, refDate: string, refTime: string): TimeRichResult | { error: string } {
  const birth = parseLocalDate(dob);
  const ref = parseDateTimeLocal(refDate, refTime);
  if (!birth || (typeof ref === "object" && "error" in ref)) return { error: "Enter valid dates." };
  const nb = nextBirthday(birth, ref);
  const next = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate(), ref.getHours(), ref.getMinutes(), 0);
  if (next <= ref) next.setFullYear(next.getFullYear() + 1);
  const p = elapsedParts(ref, next);
  return ok({
    primary: formatElapsed(p),
    primaryLabel: `Until turning ${nb.turningAge} · ${next.toLocaleDateString("en-IN", { dateStyle: "medium" })}`,
    rows: [
      { label: "Calendar days", value: String(nb.daysUntil || p.days) },
      { label: "Birthday weekday", value: dayName(next) },
      { label: "Age you'll turn", value: String(next.getFullYear() - birth.getFullYear()) },
    ],
    breakdown: [
      { label: "Birth date", value: birth.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "Reference", value: ref.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
    ],
    tips: AGE_TIPS,
  });
}

export function computeZodiacSign(dob: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dob);
  if (!d) return { error: "Enter a valid birth date." };
  const { sign, element } = zodiacForDate(d);
  return ok({
    primary: sign,
    primaryLabel: `${element} sign · Western tropical zodiac`,
    rows: [
      { label: "Element", value: element },
      { label: "Birth weekday", value: dayName(d) },
      { label: "Birth date", value: d.toLocaleDateString("en-IN", { dateStyle: "long" }) },
    ],
    insights: [{ title: "Note", detail: "Uses the common tropical zodiac tied to calendar dates, not constellations." }],
    tips: PERSONAL_TIPS,
  });
}

export function computeLifePathNumber(dob: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dob);
  if (!d) return { error: "Enter a valid birth date." };
  const n = lifePathFromDate(d);
  return ok({
    primary: String(n),
    primaryLabel: "Life path number (numerology)",
    rows: [
      { label: "Birth date", value: d.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "Meaning", value: LIFE_PATH_MEANINGS[n] ?? "Personal growth path." },
    ],
    breakdown: [
      { label: "Digit sum method", value: "Full birth date reduced" },
      { label: "Master numbers", value: "11, 22, 33 preserved when reached" },
    ],
    tips: PERSONAL_TIPS,
  });
}

export function computePregnancyDueDate(lmp: string, cycleLength: number, refDate: string): TimeRichResult | { error: string } {
  const start = parseLocalDate(lmp);
  const ref = parseLocalDate(refDate);
  if (!start || !ref) return { error: "Enter valid dates." };
  if (cycleLength < 21 || cycleLength > 45) return { error: "Cycle length should be between 21 and 45 days." };
  if (ref < start) return { error: "Reference date must be on or after LMP." };
  const adjustment = cycleLength - 28;
  const due = addCalendarDays(lmp, 280 + adjustment);
  if (typeof due === "object" && "error" in due) return due;
  const gestDays = diffDays(start, ref);
  const gestWeeks = Math.floor(gestDays / 7);
  const remDays = gestDays % 7;
  return ok({
    primary: due.toLocaleDateString("en-IN", { dateStyle: "full" }),
    primaryLabel: "Estimated due date (Naegele's rule + cycle adjust)",
    rows: [
      { label: "Gestational age", value: `${gestWeeks}w ${remDays}d` },
      { label: "Days until due", value: String(Math.max(0, diffDays(ref, due))) },
      { label: "Trimester", value: gestWeeks < 13 ? "1st" : gestWeeks < 27 ? "2nd" : "3rd" },
    ],
    breakdown: [
      { label: "LMP", value: start.toLocaleDateString("en-IN") },
      { label: "Cycle length", value: `${cycleLength} days` },
      { label: "Due weekday", value: dayName(due) },
    ],
    insights: [{ title: "Medical note", detail: "Ultrasound dating may differ — confirm with your clinician." }],
    tips: PERSONAL_TIPS,
  });
}

export function computeOvulation(lmp: string, cycleLength: number): TimeRichResult | { error: string } {
  const start = parseLocalDate(lmp);
  if (!start) return { error: "Enter a valid last period date." };
  if (cycleLength < 21 || cycleLength > 45) return { error: "Cycle length should be between 21 and 45 days." };
  const ovulationOffset = cycleLength - 14;
  const ovulationRaw = addCalendarDays(lmp, ovulationOffset);
  const fertileStartRaw = addCalendarDays(lmp, ovulationOffset - 5);
  const fertileEndRaw = addCalendarDays(lmp, ovulationOffset + 1);
  const nextPeriodRaw = addCalendarDays(lmp, cycleLength);
  if (
    (typeof ovulationRaw === "object" && ovulationRaw !== null && "error" in ovulationRaw) ||
    (typeof fertileStartRaw === "object" && fertileStartRaw !== null && "error" in fertileStartRaw) ||
    (typeof fertileEndRaw === "object" && fertileEndRaw !== null && "error" in fertileEndRaw)
  ) {
    return { error: "Could not compute ovulation dates." };
  }
  const ovulation = ovulationRaw;
  const fertileStart = fertileStartRaw;
  const fertileEnd = fertileEndRaw;
  const nextPeriodLabel =
    typeof nextPeriodRaw === "object" && "error" in nextPeriodRaw
      ? "—"
      : nextPeriodRaw.toLocaleDateString("en-IN", { dateStyle: "medium" });
  return ok({
    primary: ovulation.toLocaleDateString("en-IN", { dateStyle: "full" }),
    primaryLabel: `Estimated ovulation · ${cycleLength}-day cycle`,
    rows: [
      { label: "Fertile window start", value: fertileStart.toLocaleDateString("en-IN", { dateStyle: "medium" }) },
      { label: "Fertile window end", value: fertileEnd.toLocaleDateString("en-IN", { dateStyle: "medium" }) },
      { label: "Next period (≈)", value: nextPeriodLabel },
    ],
    breakdown: [
      { label: "LMP", value: start.toLocaleDateString("en-IN") },
      { label: "Ovulation day", value: dayName(ovulation) },
      { label: "Window length", value: "6 days (5 before + ovulation day)" },
    ],
    insights: [{ title: "Planning only", detail: "Fertility varies — not a substitute for ovulation tests or medical guidance." }],
    tips: PERSONAL_TIPS,
  });
}

export function computeBabyAge(dob: string, asOf: string): TimeRichResult | { error: string } {
  const birth = parseLocalDate(dob);
  const ref = parseLocalDate(asOf);
  if (!birth || !ref) return { error: "Enter valid dates." };
  if (birth > ref) return { error: "Birth date must be on or before reference date." };
  const days = diffDays(birth, ref);
  const weeks = Math.floor(days / 7);
  const remDays = days % 7;
  const cal = ageParts(birth, ref);
  return ok({
    primary: weeks < 104 ? `${weeks}w ${remDays}d` : `${cal.years}y ${cal.months}m`,
    primaryLabel: `${days} days old · ${cal.months + cal.years * 12} months (calendar)`,
    rows: [
      { label: "Total days", value: String(days) },
      { label: "Calendar age", value: `${cal.years}y ${cal.months}m ${cal.days}d` },
      { label: "Born on", value: dayName(birth) },
    ],
    breakdown: [
      { label: "Birth date", value: birth.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "As of", value: ref.toLocaleDateString("en-IN", { dateStyle: "long" }) },
    ],
    insights: [
      {
        title: "Milestone hint",
        detail: weeks < 4 ? "Newborn phase — counted in weeks." : weeks < 52 ? "Infant — weeks + days is common in pediatrics." : "Over one year — calendar age shown.",
      },
    ],
    tips: AGE_TIPS,
  });
}

export function computeAnniversary(startDate: string, asOf: string): TimeRichResult | { error: string } {
  const start = parseLocalDate(startDate);
  const ref = parseLocalDate(asOf);
  if (!start || !ref) return { error: "Enter valid dates." };
  if (start > ref) return { error: "Anniversary date must be on or before reference date." };
  let years = ref.getFullYear() - start.getFullYear();
  const thisYearAnn = new Date(ref.getFullYear(), start.getMonth(), start.getDate(), 12);
  if (thisYearAnn > ref) years--;
  const nextAnn = new Date(ref.getFullYear(), start.getMonth(), start.getDate(), 12);
  if (nextAnn <= ref) nextAnn.setFullYear(nextAnn.getFullYear() + 1);
  const daysUntil = diffDays(ref, nextAnn);
  const totalDays = diffDays(start, ref);
  return ok({
    primary: `${years} years`,
    primaryLabel: `${daysUntil} days until next anniversary`,
    rows: [
      { label: "Next anniversary", value: nextAnn.toLocaleDateString("en-IN", { dateStyle: "full" }) },
      { label: "Anniversary #", value: String(years + 1) },
      { label: "Days together", value: totalDays.toLocaleString() },
    ],
    breakdown: [
      { label: "Started", value: start.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "Weekday", value: dayName(start) },
      { label: "Months (≈)", value: String(Math.floor(totalDays / 30.44)) },
    ],
    tips: PERSONAL_TIPS,
  });
}
