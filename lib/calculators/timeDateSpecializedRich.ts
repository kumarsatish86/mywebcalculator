import { SPECIALIZED_TIPS } from "./timeDateKnowledge";
import { dayName, parseLocalDate } from "./timeDateCore";
import {
  buildCronExpr,
  convert12hTo24h,
  convert24hTo12h,
  dateTimeToIso,
  gregorianToJulianDay,
  hijriParts,
  julianDayToGregorian,
  moonAgeDays,
  moonIllumination,
  moonPhaseName,
  nextCronRuns,
  panchangForDate,
  parseIsoInstant,
  parseLogTimestamp,
  parseUnixTimestamp,
} from "./timeDateSpecializedCore";
import type { TimeRichResult } from "./timeDateRich";

const SYNODIC = 29.530588853;

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

export function computeIndianPanchang(dateStr: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid date." };
  const p = panchangForDate(d);
  return ok({
    primary: `Tithi ${p.tithi}`,
    primaryLabel: `${p.paksha} · ${p.nakshatra}`,
    rows: [
      { label: "Vaara (weekday)", value: p.vaara },
      { label: "Moon phase", value: p.moonPhase },
      { label: "Illumination", value: `${p.illumination}%` },
    ],
    breakdown: [
      { label: "Gregorian", value: d.toLocaleDateString("en-IN", { dateStyle: "full" }) },
      { label: "Paksha", value: p.paksha },
      { label: "Nakshatra", value: p.nakshatra },
    ],
    insights: [{ title: "Note", detail: "Approximate panchang from lunar age — not a replacement for regional almanacs." }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeIslamicDate(dateStr: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid date." };
  const h = hijriParts(d);
  if ("error" in h) return h;
  return ok({
    primary: `${h.day} ${h.monthName} ${h.year} AH`,
    primaryLabel: "Hijri (Islamic) calendar",
    rows: [
      { label: "Gregorian", value: d.toLocaleDateString("en-IN", { dateStyle: "full" }) },
      { label: "Weekday", value: dayName(d) },
      { label: "Hijri month #", value: String(h.month) },
    ],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeJulianDate(dateStr: string, jdInput: string): TimeRichResult | { error: string } {
  if (jdInput.trim()) {
    const jd = Number(jdInput);
    if (!Number.isFinite(jd)) return { error: "Enter a valid Julian day number." };
    const g = julianDayToGregorian(jd);
    const iso = `${g.y}-${String(g.m).padStart(2, "0")}-${String(g.d).padStart(2, "0")}`;
    return ok({
      primary: iso,
      primaryLabel: `From JD ${jd}`,
      rows: [
        { label: "Julian day", value: jd.toFixed(5) },
        { label: "Year", value: String(g.y) },
      ],
      breakdown: [{ label: "Gregorian", value: new Date(g.y, g.m - 1, g.d).toLocaleDateString("en-IN", { dateStyle: "full" }) }],
      tips: SPECIALIZED_TIPS,
    });
  }
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a date or Julian day number." };
  const jd = gregorianToJulianDay(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return ok({
    primary: jd.toFixed(5),
    primaryLabel: "Julian day number (JD)",
    rows: [
      { label: "Gregorian", value: d.toLocaleDateString("en-IN", { dateStyle: "full" }) },
      { label: "Weekday", value: dayName(d) },
    ],
    breakdown: [{ label: "JD at noon", value: jd.toFixed(5) }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeLunarCalendar(dateStr: string): TimeRichResult | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid date." };
  const age = moonAgeDays(d);
  const lunarDay = Math.min(30, Math.floor(age) + 1);
  const nextNew = SYNODIC - age;
  return ok({
    primary: moonPhaseName(age),
    primaryLabel: `Lunar day ${lunarDay} · ${moonIllumination(age)}% lit`,
    rows: [
      { label: "Moon age", value: `${age.toFixed(1)} days` },
      { label: "Days to new moon (≈)", value: nextNew.toFixed(1) },
      { label: "Synodic month", value: "29.53 days" },
    ],
    breakdown: [
      { label: "Gregorian", value: d.toLocaleDateString("en-IN", { dateStyle: "full" }) },
      { label: "Illumination", value: `${moonIllumination(age)}%` },
    ],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeUnixTimestamp(ts: string, dateStr: string, timeStr: string): TimeRichResult | { error: string } {
  if (ts.trim()) {
    const d = parseUnixTimestamp(ts);
    if (typeof d === "object" && "error" in d) return d;
    return ok({
      primary: d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
      primaryLabel: `Unix ${Math.floor(d.getTime() / 1000)} · ms ${d.getTime()}`,
      rows: [
        { label: "UTC ISO", value: d.toISOString() },
        { label: "Weekday", value: dayName(d) },
      ],
      breakdown: [
        { label: "Seconds", value: String(Math.floor(d.getTime() / 1000)) },
        { label: "Milliseconds", value: String(d.getTime()) },
      ],
      tips: SPECIALIZED_TIPS,
    });
  }
  const iso = dateTimeToIso(dateStr, timeStr);
  if (typeof iso === "object") return iso;
  const d = new Date(iso);
  return ok({
    primary: String(Math.floor(d.getTime() / 1000)),
    primaryLabel: `Milliseconds: ${d.getTime()}`,
    rows: [{ label: "ISO", value: iso }, { label: "Local", value: d.toLocaleString("en-IN") }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeEpochTime(ts: string, dateStr: string, timeStr: string): TimeRichResult | { error: string } {
  const base = computeUnixTimestamp(ts, dateStr, timeStr);
  if ("error" in base) return base;
  const sec = base.breakdown?.find((b) => b.label === "Seconds")?.value ?? base.primary;
  const ms = base.breakdown?.find((b) => b.label === "Milliseconds")?.value ?? base.primaryLabel?.replace("Milliseconds: ", "");
  return ok({
    ...base,
    primary: String(ms ?? ""),
    primaryLabel: "Epoch milliseconds (Unix × 1000)",
    rows: [
      ...(base.rows ?? []),
      { label: "Seconds since epoch", value: String(sec) },
      { label: "Hex (seconds)", value: `0x${Number(sec).toString(16).toUpperCase()}` },
    ],
  });
}

export function computeIsoDate(isoInput: string, dateStr: string, timeStr: string): TimeRichResult | { error: string } {
  if (isoInput.trim()) {
    const d = parseIsoInstant(isoInput);
    if (typeof d === "object" && "error" in d) return d;
    return ok({
      primary: d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
      primaryLabel: "Parsed ISO-8601 instant",
      rows: [
        { label: "UTC", value: d.toISOString() },
        { label: "Unix", value: String(Math.floor(d.getTime() / 1000)) },
      ],
      tips: SPECIALIZED_TIPS,
    });
  }
  const iso = dateTimeToIso(dateStr, timeStr);
  if (typeof iso === "object") return iso;
  return ok({
    primary: iso,
    primaryLabel: "ISO-8601 UTC string",
    rows: [{ label: "Local display", value: new Date(iso).toLocaleString("en-IN") }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeTimeFormat12h24h(raw: string, to24: boolean): TimeRichResult | { error: string } {
  const r = to24 ? convert12hTo24h(raw) : convert24hTo12h(raw);
  if (typeof r === "object") return r;
  return ok({
    primary: r,
    primaryLabel: to24 ? "24-hour format" : "12-hour format",
    rows: [{ label: "Input", value: raw }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeCronGenerator(minute: string, hour: string, dom: string, month: string, dow: string): TimeRichResult | { error: string } {
  const expr = buildCronExpr(minute || "*", hour || "*", dom || "*", month || "*", dow || "*");
  const runs = nextCronRuns(expr, new Date(), 3);
  if (typeof runs === "object" && "error" in runs) {
    return ok({
      primary: expr,
      primaryLabel: "5-field cron expression",
      rows: [
        { label: "Minute", value: minute || "*" },
        { label: "Hour", value: hour || "*" },
      ],
      breakdown: [
        { label: "Day of month", value: dom || "*" },
        { label: "Month", value: month || "*" },
        { label: "Day of week", value: dow || "*" },
      ],
      tips: SPECIALIZED_TIPS,
    });
  }
  return ok({
    primary: expr,
    primaryLabel: "5-field cron expression",
    rows: runs.map((d, i) => ({ label: `Next run ${i + 1}`, value: d.toLocaleString("en-IN") })),
    breakdown: [
      { label: "Fields", value: "min hour dom month dow" },
      { label: "Example", value: "0 9 * * 1-5 = weekdays 9am" },
    ],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeCronSchedule(cron: string): TimeRichResult | { error: string } {
  if (!cron.trim()) return { error: "Enter a cron expression." };
  const runs = nextCronRuns(cron.trim(), new Date(), 5);
  if (typeof runs === "object" && "error" in runs) return runs;
  return ok({
    primary: runs[0]?.toLocaleString("en-IN") ?? "—",
    primaryLabel: `Next ${runs.length} upcoming runs`,
    rows: runs.map((d, i) => ({ label: `#${i + 1}`, value: d.toLocaleString("en-IN") })),
    breakdown: [{ label: "Expression", value: cron.trim() }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeLogTimestamp(raw: string, format: string): TimeRichResult | { error: string } {
  const d = parseLogTimestamp(raw, format);
  if (typeof d === "object" && "error" in d) return d;
  return ok({
    primary: d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
    primaryLabel: `Parsed as ${format || "auto"}`,
    rows: [
      { label: "ISO UTC", value: d.toISOString() },
      { label: "Unix seconds", value: String(Math.floor(d.getTime() / 1000)) },
      { label: "Unix ms", value: String(d.getTime()) },
    ],
    breakdown: [
      { label: "Weekday", value: dayName(d) },
      { label: "Raw input", value: raw.slice(0, 60) },
    ],
    tips: SPECIALIZED_TIPS,
  });
}
