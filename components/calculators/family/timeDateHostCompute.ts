import {
  computeAddDaysToDate,
  computeAgeInDaysHours,
  computeBusinessDays,
  computeCountdownEvent,
  computeMeetingPlanner,
  computeSubtractDaysFromDate,
  computeTimeSince,
  computeTimeUntil,
  computeTimeZoneConverter,
  computeTimeZoneDifference,
  computeWeekNumber,
  computeWorkingDays,
  computeWorldClock,
} from "@/lib/calculators/timeDateAdvancedRich";
import {
  computeDeadline,
  computeOvertime,
  computePayrollHours,
  computeProjectDuration,
  computeShiftDuration,
  computeSlaTime,
  computeTimesheet,
  computeTurnaroundTime,
  computeWorkHoursBusiness,
} from "@/lib/calculators/timeDateBusinessRich";
import {
  computeAnniversary,
  computeBabyAge,
  computeBirthdayCountdown,
  computeExactAge,
  computeLifePathNumber,
  computeOvulation,
  computePregnancyDueDate,
  computeZodiacSign,
} from "@/lib/calculators/timeDatePersonalRich";
import {
  computeCronGenerator,
  computeCronSchedule,
  computeEpochTime,
  computeIndianPanchang,
  computeIslamicDate,
  computeIsoDate,
  computeJulianDate,
  computeLogTimestamp,
  computeLunarCalendar,
  computeTimeFormat12h24h,
  computeUnixTimestamp,
} from "@/lib/calculators/timeDateSpecializedRich";
import {
  computeDaysAlive,
  computeDaysUntilNewYear,
  computeDaysUntilWeekend,
  computeLoveDuration,
  computeSleepBestTime,
} from "@/lib/calculators/timeDateFunRich";
import {
  computeAiMeetingScheduler,
  computeDailyTimeUsage,
  computeHabitTimeAnalyzer,
  computeProductivityAnalyzer,
  computeSmartTimePlanner,
  computeTimeTrackingDashboard,
} from "@/lib/calculators/timeDateSmartRich";
import { parseTimeOp } from "@/lib/calculators/timeDateParams";
import type { TimeRichResult } from "@/lib/calculators/timeDateRich";
import {
  computeAddSubtractTime,
  computeAge,
  computeDateDifference,
  computeDayOfWeek,
  computeDaysBetween,
  computeLeapYear,
  computeMinutesToHours,
  computeMonthsBetween,
  computeNextBirthday,
  computeSecondsToMinutes,
  computeTimeDifference,
  computeTimeDuration,
  computeWeeksBetween,
  computeWhatDayBorn,
  computeWorkHours,
  computeYearsBetween,
} from "@/lib/calculators/timeDateRich";
import type { TimeDateMode } from "./timeDateHostTypes";

export type HostResult = TimeRichResult | { error: string };

export type HostInputs = Record<string, string>;

export function computeTimeDateHostResult(mode: TimeDateMode, raw: HostInputs): HostResult {
  const d1 = String(raw.d1 ?? "");
  const d2 = String(raw.d2 ?? new Date().toISOString().slice(0, 10));
  const t1 = String(raw.t1 ?? "09:00");
  const t2 = String(raw.t2 ?? "17:30");
  const h = Number(raw.h) || 0;
  const m = Number(raw.m) || 0;
  const s = Number(raw.s) || 0;
  const y = Number(raw.y) || new Date().getFullYear();
  const brk = Number(raw.brk) || 30;
  const n = Number(raw.n) || 10;
  const tz = String(raw.tz ?? "America/New_York");
  const tz2 = String(raw.tz2 ?? "Europe/London");
  const tz3 = String(raw.tz3 ?? "Asia/Tokyo");
  const ws = Number(raw.ws) || 9;
  const we = Number(raw.we) || 17;
  const mdur = Number(raw.mdur) || 60;
  const ot = Number(raw.ot) || 8;
  const mult = Number(raw.mult) || 1.5;
  const rate = Number(raw.rate) || 0;
  const pday = Number(raw.pday) || 8;
  const ts = String(raw.ts ?? "");
  const cron = String(raw.cron ?? "0 9 * * 1-5");
  const logfmt = String(raw.logfmt ?? "iso");
  const dow = String(raw.dow ?? "*");
  const jd = String(raw.jd ?? "");
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const nowTime = now.toTimeString().slice(0, 5);

  switch (mode) {
    case "age":
      return computeAge(d1 || "1990-06-15", d2);
    case "dateDifference":
      return computeDateDifference(d1 || "2024-01-01", d2 || "2026-06-20");
    case "daysBetween":
      return computeDaysBetween(d1 || "2024-01-01", d2 || "2026-06-20");
    case "weeksBetween":
      return computeWeeksBetween(d1 || "2024-01-01", d2 || "2026-06-20");
    case "monthsBetween":
      return computeMonthsBetween(d1 || "2024-01-01", d2 || "2026-06-20");
    case "yearsBetween":
      return computeYearsBetween(d1 || "1990-01-01", d2 || "2026-06-20");
    case "timeDifference":
      return computeTimeDifference(t1, t2);
    case "timeDuration":
      return computeTimeDuration(h || 2, m || 30, s);
    case "addSubtractTime":
      return computeAddSubtractTime(d1 || today, t1, h, m, s, parseTimeOp(String(raw.op ?? "add")));
    case "workHours":
      return computeWorkHours(t1, t2, brk);
    case "minutesToHours":
      return computeMinutesToHours(Number(raw.m) || 150);
    case "secondsToMinutes":
      return computeSecondsToMinutes(Number(raw.s) || 3665);
    case "dayOfWeek":
      return computeDayOfWeek(d1 || today);
    case "whatDayBorn":
      return computeWhatDayBorn(d1 || "1995-08-21");
    case "nextBirthday":
      return computeNextBirthday(d1 || "1995-08-21");
    case "leapYear":
      return computeLeapYear(y);
    case "addDaysToDate":
      return computeAddDaysToDate(d1 || today, n);
    case "subtractDaysFromDate":
      return computeSubtractDaysFromDate(d1 || today, n);
    case "businessDays":
      return computeBusinessDays(d1 || "2024-01-01", d2 || "2024-01-31");
    case "workingDays":
      return computeWorkingDays(d1 || "2024-01-01", d2 || "2024-01-31");
    case "weekNumber":
      return computeWeekNumber(d1 || today);
    case "timeZoneConverter":
      return computeTimeZoneConverter(d1 || today, t1, tz, tz2);
    case "worldClock":
      return computeWorldClock(tz, tz2, tz3);
    case "meetingPlanner":
      return computeMeetingPlanner(d1 || today, t1, tz, tz2, tz3, ws, we, mdur);
    case "timeZoneDifference":
      return computeTimeZoneDifference(tz, tz2, d1 || today);
    case "countdownEvent":
      return computeCountdownEvent(d1 || "2026-12-31", t1 || "00:00", d2 || today, t2 || nowTime);
    case "timeUntil":
      return computeTimeUntil(d1 || "2026-12-31", d2 || today);
    case "ageInDaysHours":
      return computeAgeInDaysHours(d1 || "1990-06-15", d2 || today, t1 || "08:30");
    case "timeSince":
      return computeTimeSince(d1 || "2020-01-01", t1 || "09:00", d2 || today, t2 || nowTime);
    case "timesheet":
      return computeTimesheet(d1 || today, n || 5, t1, t2, brk);
    case "workHoursBusiness":
      return computeWorkHoursBusiness(t1, t2, brk, n || 5, rate || 25);
    case "overtime":
      return computeOvertime(t1, t2, brk, ot, mult, rate || 25);
    case "shiftDuration":
      return computeShiftDuration(t1, t2, brk);
    case "payrollHours":
      return computePayrollHours(h || 40, s || 5, rate || 25, mult);
    case "projectDuration":
      return computeProjectDuration(d1 || "2024-01-01", d2 || "2024-03-31", pday);
    case "deadline":
      return computeDeadline(d1 || today, n || 10);
    case "slaTime":
      return computeSlaTime(d1 || today, t1, h || 4, m || 0, d2 || today, t2 || nowTime);
    case "turnaroundTime":
      return computeTurnaroundTime(d1 || today, t1, d2 || today, t2);
    case "exactAge":
      return computeExactAge(d1 || "1990-06-15", t1 || "08:00", d2 || today, t2 || nowTime);
    case "birthdayCountdown":
      return computeBirthdayCountdown(d1 || "1995-08-21", d2 || today, t2 || nowTime);
    case "zodiacSign":
      return computeZodiacSign(d1 || "1995-08-21");
    case "lifePathNumber":
      return computeLifePathNumber(d1 || "1995-08-21");
    case "pregnancyDueDate":
      return computePregnancyDueDate(d1 || today, n || 28, d2 || today);
    case "ovulation":
      return computeOvulation(d1 || today, n || 28);
    case "babyAge":
      return computeBabyAge(d1 || today, d2 || today);
    case "anniversary":
      return computeAnniversary(d1 || "2020-06-15", d2 || today);
    case "indianPanchang":
      return computeIndianPanchang(d1 || today);
    case "islamicDate":
      return computeIslamicDate(d1 || today);
    case "julianDate":
      return computeJulianDate(d1 || today, jd);
    case "lunarCalendar":
      return computeLunarCalendar(d1 || today);
    case "unixTimestamp":
      return computeUnixTimestamp(ts, d1 || today, t1);
    case "epochTime":
      return computeEpochTime(ts, d1 || today, t1);
    case "isoDate":
      return computeIsoDate(ts, d1 || today, t1);
    case "timeFormat12h24h":
      return computeTimeFormat12h24h(t1 || "2:30 PM", parseTimeOp(String(raw.op ?? "add")) === "add");
    case "cronGenerator":
      return computeCronGenerator(String(raw.m || "0"), String(raw.h || "9"), String(raw.n || "*"), String(raw.y || "*"), dow);
    case "cronSchedule":
      return computeCronSchedule(cron);
    case "logTimestamp":
      return computeLogTimestamp(ts || new Date().toISOString(), logfmt);
    case "daysUntilWeekend":
      return computeDaysUntilWeekend(d1 || today);
    case "daysUntilNewYear":
      return computeDaysUntilNewYear(d1 || today);
    case "daysAlive":
      return computeDaysAlive(d1 || "1990-06-15", d2 || today);
    case "sleepBestTime":
      return computeSleepBestTime(t1 || "07:00", parseTimeOp(String(raw.op ?? "add")) === "add", n || 6);
    case "loveDuration":
      return computeLoveDuration(d1 || "2020-02-14", d2 || today);
    case "aiMeetingScheduler":
      return computeAiMeetingScheduler(d1 || today, t1, tz, tz2, tz3, ws, we, mdur);
    case "smartTimePlanner":
      return computeSmartTimePlanner(ws, we, n || 4, pday || 1, brk);
    case "productivityAnalyzer":
      return computeProductivityAnalyzer(h || 3, Number(raw.m) || 2, brk, ws, we);
    case "timeTrackingDashboard":
      return computeTimeTrackingDashboard(h || 3, Number(raw.m) || 2, Number(raw.s) || 1.5, brk);
    case "dailyTimeUsage":
      return computeDailyTimeUsage(h || 7, Number(raw.m) || 8, Number(raw.s) || 1, n || 3, pday || 2);
    case "habitTimeAnalyzer":
      return computeHabitTimeAnalyzer(Number(raw.m) || 30, n || 14, h || 5);
    default:
      return { error: "Unknown calculator." };
  }
}
