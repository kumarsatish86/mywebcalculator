import { dayName, parseLocalDate, parseLocalTime } from "./timeDateCore";

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
  "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export const MOON_PHASES = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];

const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

export function gregorianToJulianDay(y: number, mo: number, d: number): number {
  let yr = y;
  let month = mo;
  if (month <= 2) {
    yr--;
    month += 12;
  }
  const A = Math.floor(yr / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (yr + 4716)) + Math.floor(30.6001 * (month + 1)) + d + B - 1524.5;
}

export function julianDayToGregorian(jd: number): { y: number; m: number; d: number } {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const dd = Math.floor(365.25 * c);
  const e = Math.floor((b - dd) / 30.6001);
  const day = b - dd - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { y: year, m: month, d: Math.floor(day) };
}

export function moonAgeDays(at: Date): number {
  const utc = Date.UTC(at.getFullYear(), at.getMonth(), at.getDate(), at.getHours(), at.getMinutes(), at.getSeconds());
  const age = ((utc - KNOWN_NEW_MOON) / 86400000) % SYNODIC;
  return age < 0 ? age + SYNODIC : age;
}

export function moonIllumination(age: number): number {
  return Math.round((1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2 * 100);
}

export function moonPhaseName(age: number): string {
  const idx = Math.min(7, Math.floor((age / SYNODIC) * 8));
  return MOON_PHASES[idx] ?? "—";
}

export function tithiNumber(age: number): number {
  return Math.min(30, Math.max(1, Math.floor(age / (SYNODIC / 30)) + 1));
}

export function nakshatraIndex(age: number): number {
  return Math.floor((age / SYNODIC) * 27) % 27;
}

export function hijriParts(d: Date): { day: number; month: number; year: number; monthName: string } | { error: string } {
  try {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", { day: "numeric", month: "long", year: "numeric", calendar: "islamic" });
    const parts = fmt.formatToParts(d);
    const day = Number(parts.find((p) => p.type === "day")?.value);
    const year = Number(parts.find((p) => p.type === "year")?.value);
    const monthName = parts.find((p) => p.type === "month")?.value ?? "";
    const monthFmt = new Intl.DateTimeFormat("en-u-ca-islamic", { month: "numeric", calendar: "islamic" });
    const month = Number(monthFmt.formatToParts(d).find((p) => p.type === "month")?.value);
    if (!day || !year) return { error: "Could not convert to Hijri calendar." };
    return { day, month, year, monthName };
  } catch {
    return { error: "Islamic calendar not supported in this browser." };
  }
}

export function parseUnixTimestamp(raw: string): Date | { error: string } {
  const s = raw.trim();
  if (!s) return { error: "Enter a Unix timestamp." };
  const n = Number(s);
  if (!Number.isFinite(n)) return { error: "Timestamp must be numeric." };
  const ms = s.length >= 13 ? n : n * 1000;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? { error: "Invalid timestamp." } : d;
}

export function parseIsoInstant(raw: string): Date | { error: string } {
  const s = raw.trim();
  if (!s) return { error: "Enter an ISO-8601 string." };
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? { error: "Invalid ISO date string." } : d;
}

export function dateTimeToIso(dateStr: string, timeStr: string): string | { error: string } {
  const d = parseLocalDate(dateStr);
  const t = parseLocalTime(timeStr);
  if (!d || !t) return { error: "Enter valid date and time." };
  const out = new Date(d);
  out.setHours(t.h, t.m, t.sec, 0);
  return out.toISOString();
}

export function convert12hTo24h(raw: string): string | { error: string } {
  const s = raw.trim().toUpperCase();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!m) return { error: "Use format like 2:30 PM or 11:45:00 AM." };
  let h = Number(m[1]);
  const min = Number(m[2]);
  const sec = Number(m[3] ?? 0);
  const ap = m[4];
  if (h < 1 || h > 12 || min > 59 || sec > 59) return { error: "Invalid 12-hour time." };
  if (ap === "AM" && h === 12) h = 0;
  if (ap === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}${m[3] ? `:${String(sec).padStart(2, "0")}` : ""}`;
}

export function convert24hTo12h(raw: string): string | { error: string } {
  const t = parseLocalTime(raw);
  if (!t) return { error: "Use format like 14:30 or 09:05:00." };
  const ap = t.h >= 12 ? "PM" : "AM";
  let h = t.h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(t.m).padStart(2, "0")}${t.sec ? `:${String(t.sec).padStart(2, "0")}` : ""} ${ap}`;
}

export function buildCronExpr(minute: string, hour: string, dom: string, month: string, dow: string): string {
  const f = (v: string, fallback: string) => (v.trim() === "" || v.trim() === "0" && fallback === "*" ? fallback : v.trim() || fallback);
  return `${f(minute, "*")} ${f(hour, "*")} ${f(dom, "*")} ${f(month, "*")} ${f(dow, "*")}`;
}

function expandField(field: string, min: number, max: number): number[] {
  if (field === "*") return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const out = new Set<number>();
  for (const part of field.split(",")) {
    const stepSplit = part.split("/");
    const base = stepSplit[0];
    const step = stepSplit[1] ? Number(stepSplit[1]) : 1;
    if (base.includes("-")) {
      const [a, b] = base.split("-").map(Number);
      for (let i = a; i <= b; i += step) out.add(i);
    } else {
      const n = Number(base);
      if (Number.isFinite(n)) out.add(n);
      else if (base === "*") for (let i = min; i <= max; i += step) out.add(i);
    }
  }
  return [...out].filter((n) => n >= min && n <= max).sort((a, b) => a - b);
}

export function nextCronRuns(cron: string, from: Date, count: number): Date[] | { error: string } {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return { error: "Cron needs 5 fields: minute hour dom month dow." };
  const [minF, hourF, domF, monF, dowF] = parts;
  const minutes = expandField(minF, 0, 59);
  const hours = expandField(hourF, 0, 23);
  const doms = expandField(domF, 1, 31);
  const months = expandField(monF, 1, 12);
  const dows = expandField(dowF, 0, 6);
  if (!minutes.length || !hours.length || !doms.length || !months.length || !dows.length) {
    return { error: "Could not parse cron fields." };
  }
  const runs: Date[] = [];
  const cur = new Date(from);
  cur.setSeconds(0, 0);
  cur.setMinutes(cur.getMinutes() + 1);
  for (let i = 0; i < 525600 && runs.length < count; i++) {
    if (
      minutes.includes(cur.getMinutes()) &&
      hours.includes(cur.getHours()) &&
      doms.includes(cur.getDate()) &&
      months.includes(cur.getMonth() + 1) &&
      dows.includes(cur.getDay())
    ) {
      runs.push(new Date(cur));
    }
    cur.setMinutes(cur.getMinutes() + 1);
  }
  return runs.length ? runs : { error: "No upcoming runs found in the next year." };
}

export function parseLogTimestamp(raw: string, format: string): Date | { error: string } {
  const s = raw.trim();
  if (!s) return { error: "Enter a log timestamp." };
  if (format === "unix" || format === "unixms") return parseUnixTimestamp(s);
  if (format === "iso") return parseIsoInstant(s);
  if (format === "apache") {
    const m = s.match(/\[(\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2} [+-]\d{4})\]/);
    if (m) {
      const d = new Date(m[1].replace(":", " "));
      if (!Number.isNaN(d.getTime())) return d;
    }
    return { error: "Expected Apache format like [10/Oct/2024:13:55:36 +0000]." };
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? { error: "Could not parse timestamp." } : d;
}

export function panchangForDate(d: Date): {
  vaara: string;
  tithi: number;
  paksha: string;
  nakshatra: string;
  moonPhase: string;
  illumination: number;
} {
  const age = moonAgeDays(d);
  const tithi = tithiNumber(age);
  return {
    vaara: dayName(d),
    tithi,
    paksha: tithi <= 15 ? "Shukla (bright)" : "Krishna (dark)",
    nakshatra: NAKSHATRAS[nakshatraIndex(age)] ?? "—",
    moonPhase: moonPhaseName(age),
    illumination: moonIllumination(age),
  };
}
