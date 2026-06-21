"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TDATE_URL, parseTimeOp } from "@/lib/calculators/timeDateParams";
import { COMMON_TIMEZONES } from "@/lib/calculators/timeDateKnowledge";
import { computeTimeDateHostResult } from "./timeDateHostCompute";
import { TIME_DATE_SLUG_TO_MODE, type TimeDateMode, type TimeDateSlug } from "./timeDateHostTypes";

type Config = { title: string; description: string; mode: TimeDateMode };

const NOTE = "Calendar math runs in your browser with a noon date anchor. For legal or medical deadlines, use an official source.";

const CONFIG: Record<TimeDateSlug, Config> = {
  "tdate-age-calculator": { title: "Age calculator", description: "Exact age in years, months, and days plus total days lived and next birthday countdown.", mode: "age" },
  "tdate-date-difference-calculator": { title: "Date difference calculator", description: "Full calendar span with days, weeks, months, and year-month-day breakdown.", mode: "dateDifference" },
  "tdate-days-between-dates-calculator": { title: "Days between dates", description: "Count calendar days between two dates with extended breakdown.", mode: "daysBetween" },
  "tdate-weeks-between-dates-calculator": { title: "Weeks between dates", description: "Whole weeks plus remainder days between two dates.", mode: "weeksBetween" },
  "tdate-months-between-dates-calculator": { title: "Months between dates", description: "Calendar months between dates (not fixed 30-day blocks).", mode: "monthsBetween" },
  "tdate-years-between-dates-calculator": { title: "Years between dates", description: "Years, months, and days between two dates.", mode: "yearsBetween" },
  "tdate-time-difference-calculator": { title: "Time difference calculator", description: "Hours, minutes, and seconds between two clock times.", mode: "timeDifference" },
  "tdate-time-duration-calculator": { title: "Time duration calculator", description: "Combine hours, minutes, and seconds into a total duration.", mode: "timeDuration" },
  "tdate-add-subtract-time-calculator": { title: "Add/subtract time calculator", description: "Add or subtract hours, minutes, and seconds from a date and time.", mode: "addSubtractTime" },
  "tdate-work-hours-calculator": { title: "Work hours calculator", description: "Paid hours from clock-in, clock-out, and break minutes.", mode: "workHours" },
  "tdate-minutes-to-hours-calculator": { title: "Minutes to hours", description: "Convert minutes to hours and minutes with decimal hours.", mode: "minutesToHours" },
  "tdate-seconds-to-minutes-calculator": { title: "Seconds to minutes", description: "Convert seconds to minutes and seconds with total duration.", mode: "secondsToMinutes" },
  "tdate-day-of-week-calculator": { title: "Day of the week calculator", description: "Weekday name, ISO week number, and day-of-year for any date.", mode: "dayOfWeek" },
  "tdate-what-day-was-i-born-calculator": { title: "What day was I born?", description: "Discover the weekday of your birth date and next birthday countdown.", mode: "whatDayBorn" },
  "tdate-next-birthday-calculator": { title: "Next birthday calculator", description: "Days until your next birthday and the age you'll turn.", mode: "nextBirthday" },
  "tdate-leap-year-calculator": { title: "Leap year calculator", description: "Check if a year is a leap year, days in year, and next leap year.", mode: "leapYear" },
  "tdate-add-days-to-date-calculator": { title: "Add days to date", description: "Shift a start date forward by N calendar days with weekday and ISO week.", mode: "addDaysToDate" },
  "tdate-subtract-days-from-date-calculator": { title: "Subtract days from date", description: "Move backward N calendar days from any start date.", mode: "subtractDaysFromDate" },
  "tdate-business-days-calculator": { title: "Business days calculator", description: "Count Mon–Fri days between dates; weekends excluded, holidays not.", mode: "businessDays" },
  "tdate-working-days-calculator": { title: "Working days calculator", description: "Working-day share of a date range with productivity context.", mode: "workingDays" },
  "tdate-week-number-calculator": { title: "Week number calculator", description: "ISO-8601 week number, day-of-year, and quarter for any date.", mode: "weekNumber" },
  "tdate-time-zone-converter": { title: "Time zone converter", description: "Convert a date and time between IANA time zones with DST-aware offsets.", mode: "timeZoneConverter" },
  "tdate-world-clock": { title: "World clock", description: "Compare current time across three cities with UTC offsets.", mode: "worldClock" },
  "tdate-meeting-time-planner": { title: "Meeting time planner", description: "See a proposed meeting in three zones and check work-hour overlap.", mode: "meetingPlanner" },
  "tdate-time-zone-difference-calculator": { title: "Time zone difference", description: "Hour offset between two zones on a reference date.", mode: "timeZoneDifference" },
  "tdate-countdown-timer-event": { title: "Event countdown", description: "Days, hours, and minutes until (or since) an event datetime.", mode: "countdownEvent" },
  "tdate-time-until-calculator": { title: "Time until calculator", description: "Calendar days until a future date from a reference day.", mode: "timeUntil" },
  "tdate-age-in-days-hours-calculator": { title: "Age in days and hours", description: "Total days, hours, and seconds lived with birth-time precision.", mode: "ageInDaysHours" },
  "tdate-time-since-calculator": { title: "Time since calculator", description: "Elapsed time from a past event to a reference datetime.", mode: "timeSince" },
  "tdate-timesheet-calculator": { title: "Timesheet calculator", description: "Weekly hours from daily shift pattern, days worked, and break deduction.", mode: "timesheet" },
  "tdate-work-hours-calculator-business": { title: "Work hours calculator", description: "Period totals from shift length, days worked, and optional hourly rate.", mode: "workHoursBusiness" },
  "tdate-overtime-calculator": { title: "Overtime calculator", description: "Split regular vs overtime hours with threshold, multiplier, and pay estimate.", mode: "overtime" },
  "tdate-shift-duration-calculator": { title: "Shift duration calculator", description: "Paid shift length including overnight shifts that cross midnight.", mode: "shiftDuration" },
  "tdate-payroll-hours-calculator": { title: "Payroll hours calculator", description: "Gross pay from regular and OT hours, rate, and OT multiplier.", mode: "payrollHours" },
  "tdate-project-duration-calculator": { title: "Project duration calculator", description: "Person-hours and FTE weeks from project dates and hours per day.", mode: "projectDuration" },
  "tdate-deadline-calculator": { title: "Deadline calculator", description: "Due date after N business days from a start date.", mode: "deadline" },
  "tdate-sla-time-calculator": { title: "SLA time calculator", description: "SLA deadline, remaining time, and breach status for tickets or requests.", mode: "slaTime" },
  "tdate-turnaround-time-calculator": { title: "Turnaround time calculator", description: "Calendar and business hours between start and completion timestamps.", mode: "turnaroundTime" },
  "tdate-exact-age-calculator": { title: "Exact age calculator", description: "Precise age in years, months, days, and total seconds with birth time.", mode: "exactAge" },
  "tdate-birthday-countdown": { title: "Birthday countdown", description: "Time remaining until your next birthday with hour-level precision.", mode: "birthdayCountdown" },
  "tdate-zodiac-sign-calculator": { title: "Zodiac sign calculator", description: "Western tropical sun sign from your birth date with element.", mode: "zodiacSign" },
  "tdate-life-path-number-calculator": { title: "Life path number", description: "Numerology life path from your full birth date with meaning.", mode: "lifePathNumber" },
  "tdate-pregnancy-due-date-calculator": { title: "Pregnancy due date", description: "Estimated due date from LMP with cycle-length adjustment and gestational age.", mode: "pregnancyDueDate" },
  "tdate-ovulation-calculator": { title: "Ovulation calculator", description: "Estimated ovulation and fertile window from last period and cycle length.", mode: "ovulation" },
  "tdate-baby-age-calculator": { title: "Baby age calculator", description: "Infant age in weeks and days plus calendar months for pediatric tracking.", mode: "babyAge" },
  "tdate-anniversary-calculator": { title: "Anniversary calculator", description: "Years together, days until next anniversary, and total days.", mode: "anniversary" },
  "tdate-indian-panchang-calculator": { title: "Indian panchang calculator", description: "Approximate tithi, paksha, nakshatra, and moon phase for any date.", mode: "indianPanchang" },
  "tdate-islamic-date-converter": { title: "Islamic date converter", description: "Gregorian to Hijri calendar conversion using ICU Islamic calendar.", mode: "islamicDate" },
  "tdate-julian-date-converter": { title: "Julian date converter", description: "Convert between Gregorian dates and Julian day numbers.", mode: "julianDate" },
  "tdate-lunar-calendar-calculator": { title: "Lunar calendar calculator", description: "Moon phase, lunar day, and illumination from astronomical approximation.", mode: "lunarCalendar" },
  "tdate-unix-timestamp-converter": { title: "Unix timestamp converter", description: "Convert Unix seconds or milliseconds to local time and back.", mode: "unixTimestamp" },
  "tdate-epoch-time-converter": { title: "Epoch time converter", description: "Epoch milliseconds with hex seconds and ISO output.", mode: "epochTime" },
  "tdate-iso-date-converter": { title: "ISO date converter", description: "Parse or generate ISO-8601 UTC strings from date and time.", mode: "isoDate" },
  "tdate-time-format-12h-24h-converter": { title: "12h ↔ 24h time format", description: "Convert between 12-hour AM/PM and 24-hour clock formats.", mode: "timeFormat12h24h" },
  "tdate-cron-expression-generator": { title: "Cron expression generator", description: "Build a 5-field cron string and preview the next runs.", mode: "cronGenerator" },
  "tdate-cron-schedule-calculator": { title: "Cron schedule calculator", description: "Parse a cron expression and list the next scheduled run times.", mode: "cronSchedule" },
  "tdate-log-timestamp-converter": { title: "Log timestamp converter", description: "Parse ISO, Unix, or Apache log timestamps to human-readable time.", mode: "logTimestamp" },
  "tdate-days-until-weekend-calculator": { title: "Days until weekend", description: "Countdown to Saturday with weekday context and workday mood.", mode: "daysUntilWeekend" },
  "tdate-days-until-new-year-calculator": { title: "Days until new year", description: "Countdown to January 1 with weeks and hours breakdown.", mode: "daysUntilNewYear" },
  "tdate-how-many-days-alive-calculator": { title: "How many days alive", description: "Total days lived with fun stats like weeks and heartbeat estimate.", mode: "daysAlive" },
  "tdate-sleep-calculator-best-time": { title: "Sleep calculator", description: "Best bedtimes or wake times from 90-minute sleep cycles.", mode: "sleepBestTime" },
  "tdate-love-duration-calculator": { title: "Love duration calculator", description: "Time together in years, days, and milestone insights.", mode: "loveDuration" },
  "tdate-ai-meeting-scheduler": { title: "AI meeting scheduler", description: "Score a proposed slot across three zones with fairness and overlap insights.", mode: "aiMeetingScheduler" },
  "tdate-smart-time-planner": { title: "Smart time planner", description: "Block a workday into tasks with breaks and capacity check.", mode: "smartTimePlanner" },
  "tdate-productivity-time-analyzer": { title: "Productivity time analyzer", description: "Heuristic productivity score from focus, meetings, and breaks.", mode: "productivityAnalyzer" },
  "tdate-time-tracking-dashboard": { title: "Time tracking dashboard", description: "Category breakdown of deep work, meetings, admin, and breaks.", mode: "timeTrackingDashboard" },
  "tdate-daily-time-usage-calculator": { title: "Daily time usage calculator", description: "24-hour budget across sleep, work, commute, leisure, and chores.", mode: "dailyTimeUsage" },
  "tdate-habit-time-analyzer": { title: "Habit time analyzer", description: "Consistency score from daily habit minutes, streak, and weekly target.", mode: "habitTimeAnalyzer" },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="max-w-[60%] break-words text-right font-mono">{value}</span>
    </div>
  );
}

export function TimeDateCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as TimeDateSlug] ?? CONFIG["tdate-age-calculator"];
  const mode = config.mode;
  const today = new Date().toISOString().slice(0, 10);

  const [d1, setD1] = useState(useLoanInitialInput(TDATE_URL.D1, mode === "age" ? "1990-06-15" : "2024-01-01"));
  const [d2, setD2] = useState(useLoanInitialInput(TDATE_URL.D2, today));
  const [t1, setT1] = useState(useLoanInitialInput(TDATE_URL.T1, "09:00"));
  const [t2, setT2] = useState(useLoanInitialInput(TDATE_URL.T2, "17:30"));
  const [y, setY] = useState(useLoanInitialInput(TDATE_URL.Y, String(new Date().getFullYear())));
  const [h, setH] = useState(useLoanInitialInput(TDATE_URL.H, mode === "timeDuration" ? "2" : "1"));
  const [m, setM] = useState(useLoanInitialInput(TDATE_URL.M, mode === "minutesToHours" ? "150" : "30"));
  const [s, setS] = useState(useLoanInitialInput(TDATE_URL.S, mode === "secondsToMinutes" ? "3665" : "0"));
  const [brk, setBrk] = useState(useLoanInitialInput(TDATE_URL.BRK, "30"));
  const [op, setOp] = useState(parseTimeOp(useLoanInitialInput(TDATE_URL.OP, "add")));
  const [n, setN] = useState(useLoanInitialInput(TDATE_URL.N, "10"));
  const [tz, setTz] = useState(useLoanInitialInput(TDATE_URL.TZ, "America/New_York"));
  const [tz2, setTz2] = useState(useLoanInitialInput(TDATE_URL.TZ2, "Europe/London"));
  const [tz3, setTz3] = useState(useLoanInitialInput(TDATE_URL.TZ3, "Asia/Tokyo"));
  const [ws, setWs] = useState(useLoanInitialInput(TDATE_URL.WS, "9"));
  const [we, setWe] = useState(useLoanInitialInput(TDATE_URL.WE, "17"));
  const [mdur, setMdur] = useState(useLoanInitialInput(TDATE_URL.MDUR, "60"));
  const [ot, setOt] = useState(useLoanInitialInput(TDATE_URL.OT, "8"));
  const [mult, setMult] = useState(useLoanInitialInput(TDATE_URL.MULT, "1.5"));
  const [rate, setRate] = useState(useLoanInitialInput(TDATE_URL.RATE, "25"));
  const [pday, setPday] = useState(useLoanInitialInput(TDATE_URL.PDAY, "8"));
  const [ts, setTs] = useState(useLoanInitialInput(TDATE_URL.TS, ""));
  const [cron, setCron] = useState(useLoanInitialInput(TDATE_URL.CRON, "0 9 * * 1-5"));
  const [logfmt, setLogfmt] = useState(useLoanInitialInput(TDATE_URL.LOGFMT, "iso"));
  const [dowField, setDowField] = useState(useLoanInitialInput(TDATE_URL.DOW, "*"));
  const [jd, setJd] = useState(useLoanInitialInput(TDATE_URL.JD, ""));

  const inputs = useMemo(
    () => ({ d1, d2, t1, t2, y, h, m, s, brk, op, n, tz, tz2, tz3, ws, we, mdur, ot, mult, rate, pday, ts, cron, logfmt, dow: dowField, jd }),
    [d1, d2, t1, t2, y, h, m, s, brk, op, n, tz, tz2, tz3, ws, we, mdur, ot, mult, rate, pday, ts, cron, logfmt, dowField, jd],
  );

  const shareParams = useCallback(
    () => ({
      [TDATE_URL.D1]: d1, [TDATE_URL.D2]: d2, [TDATE_URL.T1]: t1, [TDATE_URL.T2]: t2,
      [TDATE_URL.Y]: y, [TDATE_URL.H]: h, [TDATE_URL.M]: m, [TDATE_URL.S]: s, [TDATE_URL.BRK]: brk, [TDATE_URL.OP]: op,
      [TDATE_URL.N]: n, [TDATE_URL.TZ]: tz, [TDATE_URL.TZ2]: tz2, [TDATE_URL.TZ3]: tz3,
      [TDATE_URL.WS]: ws, [TDATE_URL.WE]: we, [TDATE_URL.MDUR]: mdur,
      [TDATE_URL.OT]: ot, [TDATE_URL.MULT]: mult, [TDATE_URL.RATE]: rate, [TDATE_URL.PDAY]: pday,
      [TDATE_URL.TS]: ts, [TDATE_URL.CRON]: cron, [TDATE_URL.LOGFMT]: logfmt, [TDATE_URL.DOW]: dowField, [TDATE_URL.JD]: jd,
    }),
    [d1, d2, t1, t2, y, h, m, s, brk, op, n, tz, tz2, tz3, ws, we, mdur, ot, mult, rate, pday, ts, cron, logfmt, dowField, jd],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeTimeDateHostResult(mode, inputs), [mode, inputs]);

  const dateField = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} type="date" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

  const timeField = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} type="time" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

  const numField = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

  const tzField = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} value={value} onChange={(e) => set(e.target.value)} className={selectCls}>
        {COMMON_TIMEZONES.map((z) => (
          <option key={z.id} value={z.id}>{z.label}</option>
        ))}
      </select>
    </div>
  );

  const shiftModes = ["workHours", "timesheet", "workHoursBusiness", "overtime", "shiftDuration"];
  const needsD1 = [
    "age", "dateDifference", "daysBetween", "weeksBetween", "monthsBetween", "yearsBetween",
    "dayOfWeek", "whatDayBorn", "nextBirthday", "addSubtractTime",
    "addDaysToDate", "subtractDaysFromDate", "businessDays", "workingDays", "weekNumber",
    "timeZoneConverter", "meetingPlanner", "timeZoneDifference", "countdownEvent", "timeUntil",
    "ageInDaysHours", "timeSince",
    "timesheet", "projectDuration", "deadline", "slaTime", "turnaroundTime",
    "exactAge", "birthdayCountdown", "zodiacSign", "lifePathNumber", "pregnancyDueDate", "ovulation", "babyAge", "anniversary",
    "indianPanchang", "islamicDate", "julianDate", "lunarCalendar", "unixTimestamp", "epochTime", "isoDate",
    "daysUntilWeekend", "daysUntilNewYear", "daysAlive", "loveDuration",
    "aiMeetingScheduler",
  ].includes(mode);
  const needsD2 = [
    "age", "dateDifference", "daysBetween", "weeksBetween", "monthsBetween", "yearsBetween",
    "businessDays", "workingDays", "countdownEvent", "timeUntil", "ageInDaysHours", "timeSince",
    "projectDuration", "slaTime", "turnaroundTime",
    "exactAge", "birthdayCountdown", "pregnancyDueDate", "babyAge", "anniversary",
    "daysAlive", "loveDuration",
  ].includes(mode);

  return (
    <CalculatorShell
      title={config.title}
      description={`${config.description} ${NOTE}`}
      resultKey={"error" in result ? "err" : result.primary}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="min-w-0">
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="break-words font-mono text-2xl font-semibold text-[var(--accent-bright)] sm:text-3xl">{result.primary}</p>
            </div>
            {result.rows?.map((row, i) => <Row key={`${row.label}-${i}`} label={row.label} value={row.value} />)}
            {result.insights?.length ? (
              <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Insights</p>
                {result.insights.map((ins) => (
                  <div key={ins.title} className="rounded-lg border border-[var(--border)] px-3 py-2">
                    <p className="font-medium">{ins.title}</p>
                    <p className="mt-0.5 text-[var(--muted)]">{ins.detail}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {needsD1 && dateField("d1",
          mode === "age" || mode === "ageInDaysHours" ? "Birth date"
            : mode === "addSubtractTime" ? "Start date"
              : mode === "addDaysToDate" || mode === "subtractDaysFromDate" ? "Start date"
                : mode === "countdownEvent" || mode === "timeUntil" ? "Target date"
                  : mode === "timeSince" ? "Event date"
                    : mode === "timeZoneConverter" || mode === "meetingPlanner" ? "Meeting date"
                      : mode === "timeZoneDifference" ? "Reference date"
                      : mode === "timesheet" ? "Week start"
                        : mode === "projectDuration" ? "Project start"
                          : mode === "deadline" ? "Start date"
                            : mode === "slaTime" || mode === "turnaroundTime" ? "Start / received date"
                              : mode === "exactAge" || mode === "birthdayCountdown" || mode === "babyAge" || mode === "zodiacSign" || mode === "lifePathNumber" ? "Birth date"
                                : mode === "pregnancyDueDate" || mode === "ovulation" ? "Last period (LMP)"
                                  : mode === "anniversary" ? "Anniversary / start date"
                                    : mode === "daysUntilWeekend" || mode === "daysUntilNewYear" ? "Reference date"
                                      : mode === "daysAlive" || mode === "loveDuration" ? "Start / birth date"
                                        : "Date",
          d1, setD1)}
        {needsD2 && dateField("d2",
          mode === "age" || mode === "ageInDaysHours" ? "As of date"
            : mode === "countdownEvent" || mode === "timeSince" ? "Reference date"
              : mode === "timeUntil" ? "From date"
                : mode === "projectDuration" ? "Project end"
                  : mode === "slaTime" ? "Check as of date"
                    : mode === "turnaroundTime" ? "Completion date"
                      : mode === "exactAge" || mode === "babyAge" || mode === "anniversary" ? "As of date"
                        : mode === "birthdayCountdown" || mode === "pregnancyDueDate" ? "Reference date"
                          : mode === "daysAlive" || mode === "loveDuration" ? "As of date"
                            : "End date",
          d2, setD2)}
        {(mode === "timeDifference" || shiftModes.includes(mode) || mode === "addSubtractTime" || mode === "timeZoneConverter" || mode === "meetingPlanner" || mode === "countdownEvent" || mode === "timeSince" || mode === "ageInDaysHours" || mode === "slaTime" || mode === "turnaroundTime" || mode === "exactAge" || mode === "birthdayCountdown") &&
          timeField("t1",
            mode === "workHours" || mode === "shiftDuration" ? "Clock in"
              : mode === "overtime" || mode === "workHoursBusiness" || mode === "timesheet" ? "Shift start"
                : mode === "exactAge" ? "Birth time"
                  : mode === "ageInDaysHours" ? "Birth time"
                    : mode === "timeSince" ? "Event time"
                      : mode === "turnaroundTime" ? "Start time"
                        : mode === "slaTime" ? "Received time"
                          : mode === "countdownEvent" ? "Event time"
                            : mode === "timeZoneConverter" || mode === "meetingPlanner" ? "Meeting time"
                              : mode === "addSubtractTime" ? "Start time"
                                : "Start time",
            t1, setT1)}
        {(mode === "timeDifference" || shiftModes.includes(mode) || mode === "countdownEvent" || mode === "timeSince" || mode === "slaTime" || mode === "turnaroundTime" || mode === "exactAge" || mode === "birthdayCountdown") &&
          timeField("t2",
            mode === "workHours" || mode === "shiftDuration" ? "Clock out"
              : mode === "overtime" || mode === "workHoursBusiness" || mode === "timesheet" ? "Shift end"
                : mode === "exactAge" ? "As of time"
                  : mode === "birthdayCountdown" ? "Reference time"
                    : mode === "turnaroundTime" ? "Completion time"
                      : mode === "slaTime" ? "Check as of time"
                        : "Reference time",
            t2, setT2)}
        {(mode === "addDaysToDate" || mode === "subtractDaysFromDate" || mode === "deadline" || mode === "timesheet" || mode === "workHoursBusiness" || mode === "pregnancyDueDate" || mode === "ovulation") &&
          numField("n", mode === "deadline" ? "Business days" : mode === "pregnancyDueDate" || mode === "ovulation" ? "Cycle length (days)" : "Days worked", n, setN)}
        {mode === "timeZoneConverter" && (
          <>{tzField("tz", "From time zone", tz, setTz)}{tzField("tz2", "To time zone", tz2, setTz2)}</>
        )}
        {mode === "worldClock" && (
          <>{tzField("tz", "City 1", tz, setTz)}{tzField("tz2", "City 2", tz2, setTz2)}{tzField("tz3", "City 3", tz3, setTz3)}</>
        )}
        {mode === "meetingPlanner" && (
          <>
            {tzField("tz", "Host zone", tz, setTz)}
            {tzField("tz2", "Participant 2", tz2, setTz2)}
            {tzField("tz3", "Participant 3", tz3, setTz3)}
            {numField("ws", "Work start (hour)", ws, setWs)}
            {numField("we", "Work end (hour)", we, setWe)}
            {numField("mdur", "Meeting (minutes)", mdur, setMdur)}
          </>
        )}
        {mode === "aiMeetingScheduler" && (
          <>
            {dateField("d1", "Meeting date", d1, setD1)}
            {timeField("t1", "Proposed time", t1, setT1)}
            {tzField("tz", "Host zone", tz, setTz)}
            {tzField("tz2", "Participant 2", tz2, setTz2)}
            {tzField("tz3", "Participant 3", tz3, setTz3)}
            {numField("ws", "Work start (hour)", ws, setWs)}
            {numField("we", "Work end (hour)", we, setWe)}
            {numField("mdur", "Meeting (minutes)", mdur, setMdur)}
          </>
        )}
        {(mode === "smartTimePlanner" || mode === "productivityAnalyzer") && (
          <>
            {numField("ws", "Work start (hour)", ws, setWs)}
            {numField("we", "Work end (hour)", we, setWe)}
            {mode === "smartTimePlanner" && (
              <>
                {numField("n", "Task count", n, setN)}
                {numField("pday", "Hours per task", pday, setPday)}
                {numField("brk", "Break between tasks (min)", brk, setBrk)}
              </>
            )}
            {mode === "productivityAnalyzer" && (
              <>
                {numField("h", "Deep work (hours)", h, setH)}
                {numField("m", "Meetings (hours)", m, setM)}
                {numField("brk", "Break (minutes)", brk, setBrk)}
              </>
            )}
          </>
        )}
        {mode === "timeTrackingDashboard" && (
          <>
            {numField("h", "Deep work (hours)", h, setH)}
            {numField("m", "Meetings (hours)", m, setM)}
            {numField("s", "Admin (hours)", s, setS)}
            {numField("brk", "Break (minutes)", brk, setBrk)}
          </>
        )}
        {mode === "dailyTimeUsage" && (
          <>
            {numField("h", "Sleep (hours)", h, setH)}
            {numField("m", "Work (hours)", m, setM)}
            {numField("s", "Commute (hours)", s, setS)}
            {numField("n", "Leisure (hours)", n, setN)}
            {numField("pday", "Meals/chores (hours)", pday, setPday)}
          </>
        )}
        {mode === "habitTimeAnalyzer" && (
          <>
            {numField("m", "Habit (minutes/day)", m, setM)}
            {numField("n", "Streak (days)", n, setN)}
            {numField("h", "Weekly target (hours)", h, setH)}
          </>
        )}
        {mode === "timeZoneDifference" && (
          <>{tzField("tz", "Time zone A", tz, setTz)}{tzField("tz2", "Time zone B", tz2, setTz2)}</>
        )}
        {mode === "timeDuration" && (
          <>{numField("h", "Hours", h, setH)}{numField("m", "Minutes", m, setM)}{numField("s", "Seconds", s, setS)}</>
        )}
        {mode === "addSubtractTime" && (
          <>
            {numField("h", "Hours", h, setH)}{numField("m", "Minutes", m, setM)}{numField("s", "Seconds", s, setS)}
            <div>
              <FieldLabel htmlFor="op">Operation</FieldLabel>
              <select id="op" value={op} onChange={(e) => setOp(parseTimeOp(e.target.value))} className={selectCls}>
                <option value="add">Add</option>
                <option value="sub">Subtract</option>
              </select>
            </div>
          </>
        )}
        {mode === "workHours" && numField("brk", "Break (minutes)", brk, setBrk)}
        {shiftModes.includes(mode) && numField("brk", "Break (minutes)", brk, setBrk)}
        {(mode === "overtime" || mode === "workHoursBusiness" || mode === "payrollHours") && (
          <>
            {mode === "overtime" && numField("ot", "OT threshold (hours)", ot, setOt)}
            {(mode === "overtime" || mode === "workHoursBusiness" || mode === "payrollHours") && numField("rate", "Hourly rate", rate, setRate)}
            {(mode === "overtime" || mode === "payrollHours") && numField("mult", "OT multiplier", mult, setMult)}
          </>
        )}
        {mode === "payrollHours" && (
          <>{numField("h", "Regular hours", h, setH)}{numField("s", "Overtime hours", s, setS)}</>
        )}
        {mode === "projectDuration" && numField("pday", "Hours per day", pday, setPday)}
        {mode === "slaTime" && (
          <>{numField("h", "SLA hours", h, setH)}{numField("m", "SLA minutes", m, setM)}</>
        )}
        {(mode === "unixTimestamp" || mode === "epochTime" || mode === "isoDate" || mode === "logTimestamp") && (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="ts">{mode === "logTimestamp" ? "Log timestamp" : mode === "isoDate" ? "ISO string (optional)" : "Unix timestamp (optional)"}</FieldLabel>
            <FieldInput id="ts" value={ts} onChange={(e) => setTs(e.target.value)} className="mt-2 font-mono" placeholder={mode === "logTimestamp" ? "2024-06-15T10:30:00Z" : mode === "isoDate" ? "2024-06-15T10:30:00.000Z" : "1718448600"} />
          </div>
        )}
        {(mode === "unixTimestamp" || mode === "epochTime" || mode === "isoDate") && (
          <>{dateField("d1", "Date (if no timestamp)", d1, setD1)}{timeField("t1", "Time", t1, setT1)}</>
        )}
        {mode === "julianDate" && numField("jd", "Julian day (optional)", jd, setJd)}
        {mode === "timeFormat12h24h" && (
          <>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="t1">Time string</FieldLabel>
              <FieldInput id="t1" value={t1} onChange={(e) => setT1(e.target.value)} className="mt-2" placeholder="2:30 PM or 14:30" />
            </div>
            <div>
              <FieldLabel htmlFor="op">Convert to</FieldLabel>
              <select id="op" value={op} onChange={(e) => setOp(parseTimeOp(e.target.value))} className={selectCls}>
                <option value="add">24-hour</option>
                <option value="sub">12-hour AM/PM</option>
              </select>
            </div>
          </>
        )}
        {mode === "cronGenerator" && (
          <>
            {numField("m", "Minute", m, setM)}{numField("h", "Hour", h, setH)}
            {numField("n", "Day of month", n, setN)}{numField("y", "Month", y, setY)}
            {numField("dow", "Day of week (0–6)", dowField, setDowField)}
          </>
        )}
        {mode === "cronSchedule" && (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="cron">Cron expression</FieldLabel>
            <FieldInput id="cron" value={cron} onChange={(e) => setCron(e.target.value)} className="mt-2 font-mono" placeholder="0 9 * * 1-5" />
          </div>
        )}
        {mode === "logTimestamp" && (
          <div>
            <FieldLabel htmlFor="logfmt">Format</FieldLabel>
            <select id="logfmt" value={logfmt} onChange={(e) => setLogfmt(e.target.value)} className={selectCls}>
              <option value="iso">ISO-8601</option>
              <option value="unix">Unix seconds</option>
              <option value="unixms">Unix milliseconds</option>
              <option value="apache">Apache/Nginx</option>
            </select>
          </div>
        )}
        {mode === "sleepBestTime" && (
          <>
            {timeField("t1", "Wake or bedtime", t1, setT1)}
            {numField("n", "Cycles to show", n, setN)}
            <div>
              <FieldLabel htmlFor="op">Mode</FieldLabel>
              <select id="op" value={op} onChange={(e) => setOp(parseTimeOp(e.target.value))} className={selectCls}>
                <option value="add">I know wake time → bedtimes</option>
                <option value="sub">I know bedtime → wake times</option>
              </select>
            </div>
          </>
        )}
        {mode === "minutesToHours" && numField("m", "Minutes", m, setM)}
        {mode === "secondsToMinutes" && numField("s", "Seconds", s, setS)}
        {mode === "leapYear" && numField("y", "Year", y, setY)}
      </div>

      {"error" in result ? null : (
        <>
          {result.breakdown?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Breakdown</p>
              {result.breakdown.map((b) => (
                <div key={b.label} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{b.label}</span><span className="font-mono">{b.value}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.tips?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Tips</p>
              {result.tips.map((t) => (
                <div key={t} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)]">{t}</div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </CalculatorShell>
  );
}

export function timeDateModeForSlug(slug: string): TimeDateMode | undefined {
  return TIME_DATE_SLUG_TO_MODE[slug as TimeDateSlug];
}
