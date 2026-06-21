import { DAY_NAMES } from "./timeDateKnowledge";

export function parseLocalDate(s: string): Date | null {
  if (!s?.trim()) return null;
  const d = new Date(`${s.trim()}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseLocalTime(s: string): { h: number; m: number; sec: number } | null {
  if (!s?.trim()) return null;
  const m = s.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  const sec = Number(m[3] ?? 0);
  if (h > 23 || min > 59 || sec > 59) return null;
  return { h, m: min, sec };
}

export function startOfUtcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function diffDays(a: Date, b: Date): number {
  return Math.round(Math.abs(startOfUtcDay(b) - startOfUtcDay(a)) / 86400000);
}

export function calendarMonthsBetween(a: Date, b: Date): number {
  const [start, end] = a <= b ? [a, b] : [b, a];
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months--;
  return Math.max(0, months);
}

export function ageParts(from: Date, to: Date): { years: number; months: number; days: number; totalDays: number; totalHours: number } {
  const [birth, asOf] = from <= to ? [from, to] : [to, from];
  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();
  if (days < 0) {
    months--;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const totalDays = diffDays(birth, asOf);
  return { years, months, days, totalDays, totalHours: totalDays * 24 };
}

export function dayName(d: Date): string {
  return DAY_NAMES[d.getDay()] ?? "—";
}

export function isoWeekNumber(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInYear(y: number): number {
  return isLeapYear(y) ? 366 : 365;
}

export function nextBirthday(birth: Date, from: Date = new Date()): { daysUntil: number; turningAge: number; date: Date } {
  let next = new Date(from.getFullYear(), birth.getMonth(), birth.getDate(), 12);
  if (next < from) next = new Date(from.getFullYear() + 1, birth.getMonth(), birth.getDate(), 12);
  const daysUntil = diffDays(from, next);
  const turningAge = next.getFullYear() - birth.getFullYear();
  return { daysUntil, turningAge, date: next };
}

export function nextLeapYear(fromYear: number): number {
  let y = fromYear;
  while (!isLeapYear(y)) y++;
  return y;
}

export function formatHm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatHms(totalSeconds: number): string {
  const s = Math.abs(Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function timeDiffSeconds(t1: string, t2: string): number | { error: string } {
  const a = parseLocalTime(t1);
  const b = parseLocalTime(t2);
  if (!a || !b) return { error: "Enter valid times as HH:MM or HH:MM:SS." };
  return (b.h * 3600 + b.m * 60 + b.sec) - (a.h * 3600 + a.m * 60 + a.sec);
}

export function durationFromParts(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

export function addSubtractSeconds(baseDate: string, baseTime: string, h: number, m: number, s: number, op: "add" | "sub"): Date | { error: string } {
  const d = parseLocalDate(baseDate);
  const t = parseLocalTime(baseTime);
  if (!d || !t) return { error: "Enter a valid date and time." };
  const sign = op === "sub" ? -1 : 1;
  const total = sign * (h * 3600 + m * 60 + s);
  const out = new Date(d);
  out.setHours(t.h, t.m, t.sec, 0);
  out.setSeconds(out.getSeconds() + total);
  return out;
}

export function workHoursMinutes(clockIn: string, clockOut: string, breakMin: number): number | { error: string } {
  const diff = timeDiffSeconds(clockIn, clockOut);
  if (typeof diff === "object") return diff;
  if (diff <= 0) return { error: "Clock-out must be after clock-in." };
  return Math.max(0, diff / 60 - breakMin);
}

export function shiftDurationMinutes(clockIn: string, clockOut: string, breakMin: number): number | { error: string } {
  const a = parseLocalTime(clockIn);
  const b = parseLocalTime(clockOut);
  if (!a || !b) return { error: "Enter valid times as HH:MM or HH:MM:SS." };
  let diffSec = (b.h * 3600 + b.m * 60 + b.sec) - (a.h * 3600 + a.m * 60 + a.sec);
  if (diffSec <= 0) diffSec += 86400;
  return Math.max(0, diffSec / 60 - breakMin);
}

export function splitOvertime(totalHours: number, threshold: number): { regular: number; overtime: number } {
  const regular = Math.min(totalHours, threshold);
  return { regular, overtime: Math.max(0, totalHours - threshold) };
}

export function businessHoursBetween(start: Date, end: Date, dayStart = 9, dayEnd = 17): number {
  if (end <= start) return 0;
  let minutes = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) {
      const windowStart = new Date(cur);
      windowStart.setHours(dayStart, 0, 0, 0);
      const windowEnd = new Date(cur);
      windowEnd.setHours(dayEnd, 0, 0, 0);
      const from = start > windowStart ? start : windowStart;
      const to = end < windowEnd ? end : windowEnd;
      if (to > from) minutes += (to.getTime() - from.getTime()) / 60000;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return minutes;
}

export function addCalendarDays(dateStr: string, days: number): Date | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid date." };
  if (!Number.isFinite(days)) return { error: "Enter a valid day count." };
  const out = new Date(d);
  out.setDate(out.getDate() + Math.round(days));
  return out;
}

export function countWeekdaysInclusive(a: Date, b: Date): { weekdays: number; weekendDays: number; totalDays: number } {
  const [start, end] = a <= b ? [a, b] : [b, a];
  let weekdays = 0;
  let weekendDays = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow === 0 || dow === 6) weekendDays++;
    else weekdays++;
    cur.setDate(cur.getDate() + 1);
  }
  return { weekdays, weekendDays, totalDays: weekdays + weekendDays };
}

export function addBusinessDaysFrom(start: Date, n: number): Date {
  if (n <= 0) return new Date(start);
  let added = 0;
  const cur = new Date(start);
  while (added < n) {
    cur.setDate(cur.getDate() + 1);
    if (cur.getDay() !== 0 && cur.getDay() !== 6) added++;
  }
  return cur;
}

export function subtractBusinessDaysFrom(start: Date, n: number): Date {
  if (n <= 0) return new Date(start);
  let removed = 0;
  const cur = new Date(start);
  while (removed < n) {
    cur.setDate(cur.getDate() - 1);
    if (cur.getDay() !== 0 && cur.getDay() !== 6) removed++;
  }
  return cur;
}

export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function getTimezoneOffsetMinutes(tz: string, at: Date): number {
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" });
  const parts = formatter.formatToParts(at);
  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "+" ? 1 : -1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

export function formatInTimezone(at: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-IN", { timeZone: tz, dateStyle: "medium", timeStyle: "short" }).format(at);
}

export function formatTimeOnlyInTimezone(at: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-IN", { timeZone: tz, timeStyle: "short" }).format(at);
}

export function getHourInTimezone(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    hour12: false,
  }).formatToParts(at);
  return Number(parts.find((p) => p.type === "hour")?.value ?? 0);
}

export function convertZonedDateTime(
  dateStr: string,
  timeStr: string,
  fromTz: string,
  toTz: string,
): { utc: Date; fromLabel: string; toLabel: string; offsetDiffHours: number } | { error: string } {
  const d = parseLocalDate(dateStr);
  const t = parseLocalTime(timeStr);
  if (!d || !t) return { error: "Enter valid date and time." };
  if (!isValidTimezone(fromTz) || !isValidTimezone(toTz)) return { error: "Pick valid time zones." };
  const y = d.getFullYear();
  const mo = d.getMonth();
  const day = d.getDate();
  const naiveUtc = Date.UTC(y, mo, day, t.h, t.m, t.sec);
  const fromOff = getTimezoneOffsetMinutes(fromTz, new Date(naiveUtc));
  const utcMs = naiveUtc - fromOff * 60000;
  const utc = new Date(utcMs);
  const toOff = getTimezoneOffsetMinutes(toTz, utc);
  return {
    utc,
    fromLabel: formatInTimezone(utc, fromTz),
    toLabel: formatInTimezone(utc, toTz),
    offsetDiffHours: (toOff - fromOff) / 60,
  };
}

export function parseDateTimeLocal(dateStr: string, timeStr: string): Date | { error: string } {
  const d = parseLocalDate(dateStr);
  const t = parseLocalTime(timeStr);
  if (!d || !t) return { error: "Enter valid date and time." };
  const out = new Date(d);
  out.setHours(t.h, t.m, t.sec, 0);
  return out;
}

export function elapsedParts(from: Date, to: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const [a, b] = from <= to ? [from, to] : [to, from];
  const totalSeconds = Math.floor(Math.abs(b.getTime() - a.getTime()) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const rem = totalSeconds % 86400;
  const hours = Math.floor(rem / 3600);
  const minutes = Math.floor((rem % 3600) / 60);
  const seconds = rem % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export function formatElapsed(p: ReturnType<typeof elapsedParts>): string {
  const parts: string[] = [];
  if (p.days) parts.push(`${p.days}d`);
  if (p.hours || p.days) parts.push(`${p.hours}h`);
  parts.push(`${p.minutes}m`);
  if (!p.days) parts.push(`${p.seconds}s`);
  return parts.join(" ");
}

export function offsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m ? `UTC${sign}${h}:${String(m).padStart(2, "0")}` : `UTC${sign}${h}`;
}
