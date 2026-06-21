import { BUSINESS_TIPS, EVENT_TIPS, TZ_TIPS } from "./timeDateKnowledge";
import {
  addBusinessDaysFrom,
  addCalendarDays,
  ageParts,
  convertZonedDateTime,
  countWeekdaysInclusive,
  dayName,
  elapsedParts,
  formatElapsed,
  formatInTimezone,
  formatTimeOnlyInTimezone,
  getHourInTimezone,
  getTimezoneOffsetMinutes,
  isoWeekNumber,
  offsetLabel,
  parseDateTimeLocal,
  parseLocalDate,
  subtractBusinessDaysFrom,
  isValidTimezone,
} from "./timeDateCore";
import type { TimeInsight, TimeRichResult } from "./timeDateRich";

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

function needDates(d1: string, d2: string): { a: Date; b: Date } | { error: string } {
  const a = parseLocalDate(d1);
  const b = parseLocalDate(d2);
  if (!a || !b) return { error: "Pick two valid dates." };
  return { a, b };
}

export function computeAddDaysToDate(dateStr: string, days: number): TimeRichResult | { error: string } {
  if (days < 0) return { error: "Use the subtract-days tool for negative counts." };
  const out = addCalendarDays(dateStr, days);
  if (typeof out === "object" && "error" in out) return out;
  return ok({
    primary: out.toLocaleDateString("en-IN", { dateStyle: "full" }),
    primaryLabel: `After adding ${days} calendar day${days === 1 ? "" : "s"}`,
    rows: [
      { label: "Weekday", value: dayName(out) },
      { label: "ISO week", value: String(isoWeekNumber(out)) },
    ],
    breakdown: [
      { label: "Start", value: parseLocalDate(dateStr)?.toLocaleDateString("en-IN") ?? "—" },
      { label: "Days added", value: String(days) },
    ],
    tips: BUSINESS_TIPS,
  });
}

export function computeSubtractDaysFromDate(dateStr: string, days: number): TimeRichResult | { error: string } {
  if (days < 0) return { error: "Enter a positive day count." };
  const out = addCalendarDays(dateStr, -days);
  if (typeof out === "object" && "error" in out) return out;
  return ok({
    primary: out.toLocaleDateString("en-IN", { dateStyle: "full" }),
    primaryLabel: `After subtracting ${days} calendar day${days === 1 ? "" : "s"}`,
    rows: [
      { label: "Weekday", value: dayName(out) },
      { label: "ISO week", value: String(isoWeekNumber(out)) },
    ],
    breakdown: [
      { label: "Start", value: parseLocalDate(dateStr)?.toLocaleDateString("en-IN") ?? "—" },
      { label: "Days removed", value: String(days) },
    ],
    tips: BUSINESS_TIPS,
  });
}

export function computeBusinessDays(d1: string, d2: string): TimeRichResult | { error: string } {
  const dates = needDates(d1, d2);
  if ("error" in dates) return dates;
  const { weekdays, weekendDays, totalDays } = countWeekdaysInclusive(dates.a, dates.b);
  const forward = addBusinessDaysFrom(dates.a, weekdays > 0 ? Math.min(5, weekdays) : 0);
  return ok({
    primary: `${weekdays} business days`,
    primaryLabel: `${weekendDays} weekend day${weekendDays === 1 ? "" : "s"} in range`,
    rows: [
      { label: "Calendar days", value: String(totalDays) },
      { label: "+5 biz days from start", value: forward.toLocaleDateString("en-IN", { dateStyle: "medium" }) },
    ],
    breakdown: [
      { label: "Mon–Fri count", value: String(weekdays) },
      { label: "Sat–Sun count", value: String(weekendDays) },
      { label: "Span", value: `${dates.a.toLocaleDateString("en-IN")} → ${dates.b.toLocaleDateString("en-IN")}` },
    ],
    insights: [{ title: "Holidays", detail: "Public holidays are not excluded — only weekends." }],
    tips: BUSINESS_TIPS,
  });
}

export function computeWorkingDays(d1: string, d2: string): TimeRichResult | { error: string } {
  const dates = needDates(d1, d2);
  if ("error" in dates) return dates;
  const { weekdays, weekendDays, totalDays } = countWeekdaysInclusive(dates.a, dates.b);
  const pct = totalDays ? Math.round((weekdays / totalDays) * 100) : 0;
  return ok({
    primary: `${weekdays} working days`,
    primaryLabel: `${pct}% of ${totalDays} calendar days`,
    rows: [
      { label: "Non-working days", value: String(weekendDays) },
      { label: "Avg per week", value: (weekdays / Math.max(1, totalDays / 7)).toFixed(1) },
    ],
    breakdown: [
      { label: "Standard work week", value: "Mon–Fri" },
      { label: "Weekends skipped", value: String(weekendDays) },
    ],
    insights: [{ title: "Productivity", detail: weekdays >= 20 ? "Roughly a full work month in this span." : `${20 - weekdays} days short of 20 working days.` }],
    tips: BUSINESS_TIPS,
  });
}

export function computeWeekNumber(dateStr: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid date." };
  const week = isoWeekNumber(d);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((d.getTime() - yearStart.getTime()) / 86400000) + 1;
  return ok({
    primary: `Week ${week}`,
    primaryLabel: `ISO-8601 week of ${d.getFullYear()}`,
    rows: [
      { label: "Day of year", value: String(dayOfYear) },
      { label: "Weekday", value: dayName(d) },
    ],
    breakdown: [
      { label: "Year", value: String(d.getFullYear()) },
      { label: "Quarter", value: `Q${Math.ceil((d.getMonth() + 1) / 3)}` },
    ],
    insights: [{ title: "ISO rule", detail: "Week 1 is the first week with a Thursday in the new year." }],
  });
}

export function computeTimeZoneConverter(
  dateStr: string,
  timeStr: string,
  fromTz: string,
  toTz: string,
): TimeRichResult | { error: string } {
  const r = convertZonedDateTime(dateStr, timeStr, fromTz, toTz);
  if ("error" in r) return r;
  return ok({
    primary: r.toLabel,
    primaryLabel: `${fromTz} → ${toTz}`,
    rows: [
      { label: "Source time", value: r.fromLabel },
      { label: "Offset difference", value: `${r.offsetDiffHours >= 0 ? "+" : ""}${r.offsetDiffHours.toFixed(1)}h` },
    ],
    breakdown: [
      { label: fromTz, value: offsetLabel(getTimezoneOffsetMinutes(fromTz, r.utc)) },
      { label: toTz, value: offsetLabel(getTimezoneOffsetMinutes(toTz, r.utc)) },
    ],
    tips: TZ_TIPS,
  });
}

export function computeWorldClock(tz1: string, tz2: string, tz3: string): TimeRichResult | { error: string } {
  for (const tz of [tz1, tz2, tz3]) {
    if (!isValidTimezone(tz)) return { error: "Pick valid time zones." };
  }
  const now = new Date();
  const rows = [
    { label: tz1, value: formatInTimezone(now, tz1) },
    { label: tz2, value: formatInTimezone(now, tz2) },
    { label: tz3, value: formatInTimezone(now, tz3) },
  ];
  return ok({
    primary: formatTimeOnlyInTimezone(now, tz1),
    primaryLabel: `Now in ${tz1}`,
    rows,
    breakdown: rows.map((r) => ({ label: r.label, value: offsetLabel(getTimezoneOffsetMinutes(r.label, now)) })),
    insights: [{ title: "Snapshot", detail: "Recalculate or refresh the page for updated times." }],
    tips: TZ_TIPS,
  });
}

export function computeMeetingPlanner(
  dateStr: string,
  timeStr: string,
  tz1: string,
  tz2: string,
  tz3: string,
  workStart: number,
  workEnd: number,
  meetingMin: number,
): TimeRichResult | { error: string } {
  const r = convertZonedDateTime(dateStr, timeStr, tz1, tz1);
  if ("error" in r) return r;
  if (!isValidTimezone(tz2) || !isValidTimezone(tz3)) return { error: "Pick valid time zones." };
  if (workEnd <= workStart) return { error: "Work end must be after work start." };

  const zones = [tz1, tz2, tz3];
  const localTimes = zones.map((tz) => ({
    tz,
    label: formatInTimezone(r.utc, tz),
    hour: getHourInTimezone(r.utc, tz),
  }));

  const inWindow = localTimes.every((z) => z.hour >= workStart && z.hour < workEnd);
  const endUtc = new Date(r.utc.getTime() + meetingMin * 60000);
  const endOk = zones.every((tz) => {
    const h = getHourInTimezone(endUtc, tz);
    return h >= workStart && h <= workEnd;
  });

  const insights: TimeInsight[] = localTimes.map((z) => ({
    title: z.tz,
    detail: `${z.label} · local hour ${z.hour}`,
  }));

  return ok({
    primary: inWindow && endOk ? "All zones in work hours" : "Outside some work windows",
    primaryLabel: `${meetingMin}-minute meeting from ${timeStr} (${tz1})`,
    rows: localTimes.map((z) => ({ label: z.tz, value: z.label })),
    breakdown: [
      { label: "Work window", value: `${workStart}:00 – ${workEnd}:00 local` },
      { label: "Meeting length", value: `${meetingMin} min` },
      { label: "End time (" + tz1 + ")", value: formatInTimezone(endUtc, tz1) },
    ],
    insights: [
      ...insights,
      {
        title: "Fair rotation",
        detail: inWindow ? "This slot works for all three zones today." : "Try shifting ±1–2 hours or rotate weekly.",
      },
    ],
    tips: TZ_TIPS,
  });
}

export function computeTimeZoneDifference(tz1: string, tz2: string, dateStr: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid reference date." };
  if (!isValidTimezone(tz1) || !isValidTimezone(tz2)) return { error: "Pick valid time zones." };
  const off1 = getTimezoneOffsetMinutes(tz1, d);
  const off2 = getTimezoneOffsetMinutes(tz2, d);
  const diffHours = (off2 - off1) / 60;
  return ok({
    primary: `${diffHours >= 0 ? "+" : ""}${diffHours.toFixed(1)} hours`,
    primaryLabel: `${tz1} vs ${tz2} on ${d.toLocaleDateString("en-IN")}`,
    rows: [
      { label: tz1, value: offsetLabel(off1) },
      { label: tz2, value: offsetLabel(off2) },
    ],
    breakdown: [
      { label: "Difference (minutes)", value: String(off2 - off1) },
      { label: "Same instant in " + tz1, value: formatInTimezone(d, tz1) },
      { label: "Same instant in " + tz2, value: formatInTimezone(d, tz2) },
    ],
    tips: TZ_TIPS,
  });
}

export function computeCountdownEvent(targetDate: string, targetTime: string, refDate: string, refTime: string): TimeRichResult | { error: string } {
  const target = parseDateTimeLocal(targetDate, targetTime);
  const ref = parseDateTimeLocal(refDate, refTime);
  if (typeof target === "object" && "error" in target) return target;
  if (typeof ref === "object" && "error" in ref) return ref;

  const future = target >= ref;
  const p = elapsedParts(ref, target);
  const label = future ? "Time until event" : "Event was";
  return ok({
    primary: formatElapsed(p),
    primaryLabel: label,
    rows: [
      { label: "Total hours", value: (p.totalSeconds / 3600).toFixed(1) },
      { label: "Total days", value: (p.totalSeconds / 86400).toFixed(2) },
    ],
    breakdown: [
      { label: "Event", value: target.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Reference", value: ref.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Status", value: future ? "Upcoming" : "Past" },
    ],
    tips: EVENT_TIPS,
  });
}

export function computeTimeUntil(targetDate: string, refDate: string): TimeRichResult | { error: string } {
  const target = parseLocalDate(targetDate);
  const ref = parseLocalDate(refDate);
  if (!target || !ref) return { error: "Enter valid dates." };
  const targetNoon = new Date(target);
  targetNoon.setHours(23, 59, 59, 0);
  const refNoon = new Date(ref);
  refNoon.setHours(12, 0, 0, 0);
  if (targetNoon < refNoon) return { error: "Target date must be on or after the reference date." };
  const p = elapsedParts(refNoon, targetNoon);
  return ok({
    primary: `${p.days} days`,
    primaryLabel: `Until ${target.toLocaleDateString("en-IN", { dateStyle: "full" })}`,
    rows: [
      { label: "Weeks (≈)", value: (p.days / 7).toFixed(1) },
      { label: "Hours", value: String(p.days * 24) },
    ],
    breakdown: [
      { label: "From", value: ref.toLocaleDateString("en-IN") },
      { label: "Weekday", value: dayName(target) },
    ],
    tips: EVENT_TIPS,
  });
}

export function computeAgeInDaysHours(dob: string, asOf: string, birthTime: string): TimeRichResult | { error: string } {
  const birth = parseDateTimeLocal(dob, birthTime);
  const ref = parseDateTimeLocal(asOf, "12:00");
  if (typeof birth === "object" && "error" in birth) return birth;
  if (typeof ref === "object" && "error" in ref) return ref;
  if (birth > ref) return { error: "Birth must be before the reference date." };

  const p = elapsedParts(birth, ref);
  const cal = ageParts(birth, ref);
  return ok({
    primary: `${p.days.toLocaleString()} days`,
    primaryLabel: `${p.totalSeconds.toLocaleString()} seconds lived`,
    rows: [
      { label: "Calendar age", value: `${cal.years}y ${cal.months}m ${cal.days}d` },
      { label: "Hours", value: Math.floor(p.totalSeconds / 3600).toLocaleString() },
    ],
    breakdown: [
      { label: "Days", value: p.days.toLocaleString() },
      { label: "Hours (remainder)", value: String(p.hours) },
      { label: "Minutes", value: String(p.minutes) },
    ],
    insights: [{ title: "Precision", detail: `Birth time ${birthTime} anchors hour-level totals.` }],
    tips: EVENT_TIPS,
  });
}

export function computeTimeSince(eventDate: string, eventTime: string, refDate: string, refTime: string): TimeRichResult | { error: string } {
  const event = parseDateTimeLocal(eventDate, eventTime);
  const ref = parseDateTimeLocal(refDate, refTime);
  if (typeof event === "object" && "error" in event) return event;
  if (typeof ref === "object" && "error" in ref) return ref;
  if (event > ref) return { error: "Event must be on or before the reference time." };

  const p = elapsedParts(event, ref);
  return ok({
    primary: formatElapsed(p),
    primaryLabel: "Elapsed since event",
    rows: [
      { label: "Total days", value: (p.totalSeconds / 86400).toFixed(2) },
      { label: "Total weeks", value: (p.totalSeconds / 604800).toFixed(2) },
    ],
    breakdown: [
      { label: "Event", value: event.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Reference", value: ref.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Seconds", value: p.totalSeconds.toLocaleString() },
    ],
    tips: EVENT_TIPS,
  });
}
