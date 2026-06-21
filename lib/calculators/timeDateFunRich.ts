import { AGE_TIPS, FUN_TIPS } from "./timeDateKnowledge";
import {
  ageParts,
  dayName,
  diffDays,
  elapsedParts,
  formatElapsed,
  parseLocalDate,
  parseLocalTime,
} from "./timeDateCore";
import type { TimeRichResult } from "./timeDateRich";

const CYCLE_MIN = 90;
const FALL_ASLEEP_MIN = 15;

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

function nextSaturday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay();
  const add = day === 6 ? 7 : day === 0 ? 6 : 6 - day;
  d.setDate(d.getDate() + add);
  return d;
}

function nextNewYear(from: Date): Date {
  const ny = new Date(from.getFullYear(), 0, 1, 12);
  if (from.getTime() >= ny.getTime()) return new Date(from.getFullYear() + 1, 0, 1, 12);
  return ny;
}

function formatTime(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function addMinutesToTime(timeStr: string, deltaMin: number): string | { error: string } {
  const t = parseLocalTime(timeStr);
  if (!t) return { error: "Enter a valid time." };
  let total = t.h * 60 + t.m + deltaMin;
  total = ((total % 1440) + 1440) % 1440;
  return formatTime(Math.floor(total / 60), total % 60);
}

export function computeDaysUntilWeekend(refDate: string): TimeRichResult | { error: string } {
  const ref = parseLocalDate(refDate);
  if (!ref) return { error: "Enter a valid date." };
  const dow = ref.getDay();
  if (dow === 6) {
    return ok({
      primary: "It's Saturday!",
      primaryLabel: "Weekend is here",
      rows: [
        { label: "Sunday next", value: "1 day" },
        { label: "Next Saturday", value: "7 days" },
      ],
      insights: [{ title: "Enjoy", detail: "Full weekend ahead if it's Saturday morning." }],
      tips: FUN_TIPS,
    });
  }
  if (dow === 0) {
    return ok({
      primary: "0 days",
      primaryLabel: "It's Sunday — weekend now",
      rows: [{ label: "Next Saturday", value: "6 days" }],
      tips: FUN_TIPS,
    });
  }
  const sat = nextSaturday(ref);
  const days = diffDays(ref, sat);
  return ok({
    primary: `${days} day${days === 1 ? "" : "s"}`,
    primaryLabel: `Until Saturday · ${sat.toLocaleDateString("en-IN", { dateStyle: "medium" })}`,
    rows: [
      { label: "Today", value: dayName(ref) },
      { label: "Friday eve mood", value: days === 1 ? "Almost there!" : `${days - 1} workday${days > 2 ? "s" : ""} left` },
    ],
    breakdown: [{ label: "Reference", value: ref.toLocaleDateString("en-IN", { dateStyle: "full" }) }],
    tips: FUN_TIPS,
  });
}

export function computeDaysUntilNewYear(refDate: string): TimeRichResult | { error: string } {
  const ref = parseLocalDate(refDate);
  if (!ref) return { error: "Enter a valid date." };
  const ny = nextNewYear(ref);
  const days = diffDays(ref, ny);
  const hours = days * 24;
  return ok({
    primary: `${days} days`,
    primaryLabel: `Until ${ny.getFullYear()} · ${ny.toLocaleDateString("en-IN", { dateStyle: "medium" })}`,
    rows: [
      { label: "Weeks (≈)", value: (days / 7).toFixed(1) },
      { label: "Hours", value: hours.toLocaleString() },
      { label: "Year you're in", value: String(ref.getFullYear()) },
    ],
    breakdown: [
      { label: "New Year's Day", value: dayName(ny) },
      { label: "Reference", value: ref.toLocaleDateString("en-IN", { dateStyle: "full" }) },
    ],
    insights: [{ title: "Countdown", detail: days <= 7 ? "Final week of the year!" : days <= 31 ? "Less than a month to go." : "Plenty of year left." }],
    tips: FUN_TIPS,
  });
}

export function computeDaysAlive(dob: string, refDate: string): TimeRichResult | { error: string } {
  const birth = parseLocalDate(dob);
  const ref = parseLocalDate(refDate);
  if (!birth || !ref) return { error: "Enter valid dates." };
  if (birth > ref) return { error: "Birth date must be on or before reference date." };
  const days = diffDays(birth, ref);
  const cal = ageParts(birth, ref);
  const weeks = (days / 7).toFixed(1);
  return ok({
    primary: days.toLocaleString(),
    primaryLabel: `${cal.years} years · ${weeks} weeks alive`,
    rows: [
      { label: "Hours (×24)", value: (days * 24).toLocaleString() },
      { label: "Heartbeats (≈72/min)", value: Math.round(days * 24 * 60 * 72).toLocaleString() },
      { label: "Born on", value: dayName(birth) },
    ],
    breakdown: [
      { label: "Birth", value: birth.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "Calendar age", value: `${cal.years}y ${cal.months}m ${cal.days}d` },
      { label: "% of 100 years", value: `${((days / 36525) * 100).toFixed(2)}%` },
    ],
    insights: [{ title: "Milestone", detail: days >= 10000 ? "Over 10,000 days — legendary!" : `${(10000 - days).toLocaleString()} days until 10k.` }],
    tips: AGE_TIPS,
  });
}

export function computeSleepBestTime(
  anchorTime: string,
  wakeBased: boolean,
  cycles: number,
): TimeRichResult | { error: string } {
  const t = parseLocalTime(anchorTime);
  if (!t) return { error: "Enter a valid time (HH:MM)." };
  if (cycles < 1 || cycles > 8) return { error: "Show between 1 and 8 sleep cycles." };
  const options: string[] = [];
  for (let i = 1; i <= cycles; i++) {
    const sleepMin = i * CYCLE_MIN + FALL_ASLEEP_MIN;
    const r = wakeBased
      ? addMinutesToTime(anchorTime, -sleepMin)
      : addMinutesToTime(anchorTime, sleepMin);
    if (typeof r === "object") return r;
    options.push(`${r} · ${i} cycle${i > 1 ? "s" : ""} (${(sleepMin / 60).toFixed(1)}h)`);
  }
  const best = options[0]?.split(" · ")[0] ?? anchorTime;
  return ok({
    primary: best,
    primaryLabel: wakeBased ? `Bedtimes before ${anchorTime} wake-up` : `Wake times after ${anchorTime} bedtime`,
    rows: options.map((o, i) => ({ label: `#${i + 1}`, value: o })),
    breakdown: [
      { label: "Cycle length", value: `${CYCLE_MIN} min` },
      { label: "Fall-asleep buffer", value: `${FALL_ASLEEP_MIN} min` },
      { label: "Mode", value: wakeBased ? "Wake time known" : "Bedtime known" },
    ],
    insights: [{ title: "Sleep science", detail: "90-minute cycles plus ~15 min to fall asleep — adjust for your rhythm." }],
    tips: FUN_TIPS,
  });
}

export function computeLoveDuration(startDate: string, refDate: string): TimeRichResult | { error: string } {
  const start = parseLocalDate(startDate);
  const ref = parseLocalDate(refDate);
  if (!start || !ref) return { error: "Enter valid dates." };
  if (start > ref) return { error: "Start date must be on or before reference date." };
  const days = diffDays(start, ref);
  const cal = ageParts(start, ref);
  const p = elapsedParts(start, ref);
  return ok({
    primary: `${cal.years}y ${cal.months}m ${cal.days}d`,
    primaryLabel: `${days.toLocaleString()} days together`,
    rows: [
      { label: "Weeks", value: (days / 7).toFixed(1) },
      { label: "Months (calendar)", value: String(cal.years * 12 + cal.months) },
      { label: "Started on", value: dayName(start) },
    ],
    breakdown: [
      { label: "First date / anniversary", value: start.toLocaleDateString("en-IN", { dateStyle: "long" }) },
      { label: "Hours together (×24)", value: (days * 24).toLocaleString() },
      { label: "Approx. span", value: formatElapsed({ ...p, days: p.days }) },
    ],
    insights: [{ title: "Milestone", detail: days >= 365 ? `${Math.floor(days / 365)} full year${days >= 730 ? "s" : ""} and counting.` : `${365 - days} days until one year.` }],
    tips: FUN_TIPS,
  });
}
