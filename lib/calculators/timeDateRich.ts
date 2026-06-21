import { AGE_TIPS, DATE_TIPS, LEAP_FACTS } from "./timeDateKnowledge";
import {
  addSubtractSeconds,
  ageParts,
  calendarMonthsBetween,
  dayName,
  diffDays,
  durationFromParts,
  formatHm,
  formatHms,
  isLeapYear,
  isoWeekNumber,
  nextBirthday,
  nextLeapYear,
  parseLocalDate,
  timeDiffSeconds,
  workHoursMinutes,
  daysInYear,
} from "./timeDateCore";

export type TimeInsight = { title: string; detail: string };

export type TimeRichResult = {
  primary: string;
  primaryLabel: string;
  rows?: { label: string; value: string }[];
  insights?: TimeInsight[];
  breakdown?: { label: string; value: string }[];
  tips?: string[];
};

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

function needDates(d1: string, d2: string): { a: Date; b: Date } | { error: string } {
  const a = parseLocalDate(d1);
  const b = parseLocalDate(d2);
  if (!a || !b) return { error: "Pick two valid dates." };
  return { a, b };
}

export function computeAge(dob: string, asOf: string): TimeRichResult | { error: string } {
  const birth = parseLocalDate(dob);
  const ref = parseLocalDate(asOf);
  if (!birth || !ref) return { error: "Enter valid birth and reference dates." };
  if (birth > ref) return { error: "Birth date must be on or before the reference date." };
  const p = ageParts(birth, ref);
  const nb = nextBirthday(birth, ref);
  return ok({
    primary: `${p.years}y ${p.months}m ${p.days}d`,
    primaryLabel: `Exact age · ${p.totalDays.toLocaleString()} days lived`,
    rows: [
      { label: "Total hours", value: p.totalHours.toLocaleString() },
      { label: "Next birthday", value: `${nb.daysUntil} days (turning ${nb.turningAge})` },
    ],
    breakdown: [
      { label: "Years", value: String(p.years) },
      { label: "Months", value: String(p.months) },
      { label: "Days", value: String(p.days) },
      { label: "Weeks (≈)", value: (p.totalDays / 7).toFixed(1) },
    ],
    insights: [
      { title: "Born on", detail: `${dayName(birth)}, ${birth.toLocaleDateString("en-IN", { dateStyle: "long" })}` },
      { title: "Milestone", detail: p.totalDays >= 10000 ? `Over ${Math.floor(p.totalDays / 1000)}k days — that's ${Math.round(p.totalDays / 365.25)} years.` : `${10000 - p.totalDays} days until 10,000-day milestone.` },
    ],
    tips: AGE_TIPS,
  });
}

export function computeDateDifference(d1: string, d2: string): TimeRichResult | { error: string } {
  const dates = needDates(d1, d2);
  if ("error" in dates) return dates;
  const days = diffDays(dates.a, dates.b);
  const months = calendarMonthsBetween(dates.a, dates.b);
  const p = ageParts(dates.a, dates.b);
  return ok({
    primary: `${days} days`,
    primaryLabel: "Calendar difference",
    rows: [
      { label: "Weeks", value: (days / 7).toFixed(2) },
      { label: "Months", value: String(months) },
      { label: "Years", value: `${p.years}y ${p.months}m ${p.days}d` },
    ],
    breakdown: [
      { label: "Hours (×24)", value: (days * 24).toLocaleString() },
      { label: "Business weeks", value: (days / 5).toFixed(1) },
    ],
    insights: [{ title: "Span", detail: `${dates.a.toLocaleDateString("en-IN")} → ${dates.b.toLocaleDateString("en-IN")}` }],
    tips: DATE_TIPS,
  });
}

export function computeDaysBetween(d1: string, d2: string): TimeRichResult | { error: string } {
  const r = computeDateDifference(d1, d2);
  if ("error" in r) return r;
  const days = Number(r.primary.split(" ")[0]);
  return ok({ ...r, primary: String(days), primaryLabel: "Days between dates" });
}

export function computeWeeksBetween(d1: string, d2: string): TimeRichResult | { error: string } {
  const dates = needDates(d1, d2);
  if ("error" in dates) return dates;
  const days = diffDays(dates.a, dates.b);
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  return ok({
    primary: `${weeks} weeks`,
    primaryLabel: rem ? `${rem} extra days` : "Exact week count",
    rows: [{ label: "Total days", value: String(days) }],
    breakdown: [{ label: "Remainder days", value: String(rem) }],
    tips: DATE_TIPS,
  });
}

export function computeMonthsBetween(d1: string, d2: string): TimeRichResult | { error: string } {
  const dates = needDates(d1, d2);
  if ("error" in dates) return dates;
  const months = calendarMonthsBetween(dates.a, dates.b);
  const days = diffDays(dates.a, dates.b);
  return ok({
    primary: `${months} months`,
    primaryLabel: `${days} total days in span`,
    rows: [{ label: "Years (÷12)", value: (months / 12).toFixed(1) }],
    tips: DATE_TIPS,
  });
}

export function computeYearsBetween(d1: string, d2: string): TimeRichResult | { error: string } {
  const dates = needDates(d1, d2);
  if ("error" in dates) return dates;
  const p = ageParts(dates.a, dates.b);
  return ok({
    primary: `${p.years} years`,
    primaryLabel: `${p.months} months · ${p.days} days`,
    rows: [{ label: "Total days", value: String(p.totalDays) }],
    tips: DATE_TIPS,
  });
}

export function computeTimeDifference(t1: string, t2: string): TimeRichResult | { error: string } {
  const diff = timeDiffSeconds(t1, t2);
  if (typeof diff === "object") return diff;
  const abs = Math.abs(diff);
  return ok({
    primary: formatHms(abs),
    primaryLabel: diff >= 0 ? "End after start" : "End before start (absolute)",
    rows: [
      { label: "Minutes", value: (abs / 60).toFixed(1) },
      { label: "Seconds", value: String(abs) },
    ],
    tips: DATE_TIPS,
  });
}

export function computeTimeDuration(h: number, m: number, s: number): TimeRichResult | { error: string } {
  if (h < 0 || m < 0 || s < 0) return { error: "Duration parts cannot be negative." };
  const total = durationFromParts(h, m, s);
  if (total <= 0) return { error: "Enter a positive duration." };
  return ok({
    primary: formatHms(total),
    primaryLabel: "Total duration",
    rows: [
      { label: "Minutes", value: (total / 60).toFixed(1) },
      { label: "Hours", value: (total / 3600).toFixed(2) },
    ],
    breakdown: [
      { label: "Hours", value: String(h) },
      { label: "Minutes", value: String(m) },
      { label: "Seconds", value: String(s) },
    ],
  });
}

export function computeAddSubtractTime(date: string, time: string, h: number, m: number, s: number, op: "add" | "sub"): TimeRichResult | { error: string } {
  const out = addSubtractSeconds(date, time, h, m, s, op);
  if (typeof out === "object" && "error" in out) return out;
  return ok({
    primary: out.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    primaryLabel: op === "add" ? "After adding time" : "After subtracting time",
    rows: [{ label: "Day", value: dayName(out) }],
  });
}

export function computeWorkHours(clockIn: string, clockOut: string, breakMin: number): TimeRichResult | { error: string } {
  const mins = workHoursMinutes(clockIn, clockOut, breakMin);
  if (typeof mins === "object") return mins;
  const hours = mins / 60;
  return ok({
    primary: hours.toFixed(2),
    primaryLabel: `Work hours · ${formatHm(mins)}`,
    rows: [
      { label: "Break", value: `${breakMin} min` },
      { label: "Decimal hours", value: hours.toFixed(2) },
    ],
    breakdown: [
      { label: "Minutes worked", value: String(Math.round(mins)) },
      { label: "OT threshold (8h)", value: hours > 8 ? `${(hours - 8).toFixed(2)}h over` : "Within 8h" },
    ],
  });
}

export function computeMinutesToHours(minutes: number): TimeRichResult | { error: string } {
  if (minutes < 0) return { error: "Minutes cannot be negative." };
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return ok({
    primary: formatHm(minutes),
    primaryLabel: `${minutes} minutes`,
    rows: [{ label: "Decimal hours", value: (minutes / 60).toFixed(2) }],
    breakdown: [{ label: "Hours", value: String(h) }, { label: "Minutes", value: String(m) }],
  });
}

export function computeSecondsToMinutes(seconds: number): TimeRichResult | { error: string } {
  if (seconds < 0) return { error: "Seconds cannot be negative." };
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return ok({
    primary: formatHms(seconds),
    primaryLabel: `${seconds} seconds`,
    rows: [{ label: "Minutes", value: (seconds / 60).toFixed(2) }],
    breakdown: [{ label: "Minutes", value: String(m) }, { label: "Seconds", value: String(s) }],
  });
}

export function computeDayOfWeek(date: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(date);
  if (!d) return { error: "Enter a valid date." };
  return ok({
    primary: dayName(d),
    primaryLabel: d.toLocaleDateString("en-IN", { dateStyle: "full" }),
    rows: [
      { label: "ISO week", value: String(isoWeekNumber(d)) },
      { label: "Day of year", value: String(Math.ceil((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000) + 1) },
    ],
    insights: [{ title: "Weekend?", detail: d.getDay() === 0 || d.getDay() === 6 ? "Yes — weekend day." : "Weekday." }],
  });
}

export function computeWhatDayBorn(dob: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dob);
  if (!d) return { error: "Enter a valid birth date." };
  const nb = nextBirthday(d);
  return ok({
    primary: dayName(d),
    primaryLabel: `You were born on a ${dayName(d)}`,
    rows: [
      { label: "Date", value: d.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "Next birthday", value: `${nb.daysUntil} days` },
    ],
    insights: [{ title: "Leap year birth", detail: isLeapYear(d.getFullYear()) && d.getMonth() === 1 && d.getDate() === 29 ? "Feb 29 leap baby!" : "Standard calendar date." }],
    tips: AGE_TIPS,
  });
}

export function computeNextBirthday(dob: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dob);
  if (!d) return { error: "Enter a valid birth date." };
  const nb = nextBirthday(d);
  return ok({
    primary: `${nb.daysUntil} days`,
    primaryLabel: `Until turning ${nb.turningAge} · ${nb.date.toLocaleDateString("en-IN", { dateStyle: "medium" })}`,
    rows: [{ label: "Birthday weekday", value: dayName(nb.date) }],
    tips: AGE_TIPS,
  });
}

export function computeLeapYear(year: number): TimeRichResult | { error: string } {
  if (year < 1 || year > 9999) return { error: "Enter a year between 1 and 9999." };
  const leap = isLeapYear(year);
  const next = nextLeapYear(year + (leap ? 1 : 0));
  return ok({
    primary: leap ? "Leap year" : "Common year",
    primaryLabel: `${daysInYear(year)} days in ${year}`,
    rows: [
      { label: "Feb days", value: leap ? "29" : "28" },
      { label: "Next leap year", value: String(next) },
    ],
    insights: [{ title: "Rule", detail: leap ? "Divisible by 4 (century exception applies)." : `Not a leap year — next is ${next}.` }],
    tips: LEAP_FACTS,
  });
}
