import { SPECIALIZED_TIPS, TZ_TIPS } from "./timeDateKnowledge";
import {
  convertZonedDateTime,
  formatHm,
  formatInTimezone,
  getHourInTimezone,
  isValidTimezone,
  parseLocalDate,
} from "./timeDateCore";
import type { TimeRichResult } from "./timeDateRich";

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

function productivityScore(focusPct: number, meetingPct: number): number {
  const raw = focusPct * 0.6 + Math.max(0, 40 - meetingPct) * 0.4;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function computeAiMeetingScheduler(
  dateStr: string,
  timeStr: string,
  tz1: string,
  tz2: string,
  tz3: string,
  workStart: number,
  workEnd: number,
  meetingMin: number,
): TimeRichResult | { error: string } {
  const d = parseLocalDate(dateStr);
  if (!d) return { error: "Enter a valid date." };
  if (!isValidTimezone(tz1) || !isValidTimezone(tz2) || !isValidTimezone(tz3)) return { error: "Pick valid time zones." };
  const r = convertZonedDateTime(dateStr, timeStr, tz1, tz1);
  if ("error" in r) return r;
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
  const score = inWindow && endOk ? 92 : inWindow ? 68 : 42;
  return ok({
    primary: `${score}/100`,
    primaryLabel: inWindow && endOk ? "Strong slot for all zones" : "Consider shifting time",
    rows: localTimes.map((z) => ({ label: z.tz, value: `${z.label} (h${z.hour})` })),
    breakdown: [
      { label: "Meeting length", value: `${meetingMin} min` },
      { label: "Work window", value: `${workStart}:00–${workEnd}:00 local` },
      { label: "Fairness tip", value: inWindow ? "Rotate host timezone weekly" : "Try ±1h nudge" },
    ],
    insights: [
      { title: "AI score", detail: score >= 80 ? "High overlap — book it." : score >= 60 ? "Acceptable with one zone stretched." : "Low overlap — async or split meeting." },
      { title: "End time", detail: formatInTimezone(endUtc, tz1) },
    ],
    tips: TZ_TIPS,
  });
}

export function computeSmartTimePlanner(
  workStart: number,
  workEnd: number,
  taskCount: number,
  hoursPerTask: number,
  breakMin: number,
): TimeRichResult | { error: string } {
  if (workEnd <= workStart) return { error: "Work end must be after work start." };
  if (taskCount < 1 || taskCount > 12) return { error: "Plan 1–12 tasks." };
  const windowH = workEnd - workStart;
  const taskH = taskCount * hoursPerTask;
  const breakH = (breakMin * Math.max(0, taskCount - 1)) / 60;
  const total = taskH + breakH;
  const fits = total <= windowH;
  const blockMin = Math.floor(((windowH - breakH) / taskCount) * 60);
  return ok({
    primary: fits ? `${blockMin}m blocks` : "Over capacity",
    primaryLabel: `${taskCount} tasks · ${hoursPerTask}h each target`,
    rows: [
      { label: "Window", value: `${windowH}h (${workStart}:00–${workEnd}:00)` },
      { label: "Breaks", value: `${breakMin}m × ${Math.max(0, taskCount - 1)}` },
      { label: "Planned total", value: `${total.toFixed(1)}h` },
    ],
    breakdown: Array.from({ length: Math.min(taskCount, 6) }, (_, i) => ({
      label: `Block ${i + 1}`,
      value: `${workStart + Math.floor((i * blockMin) / 60)}:${String((i * blockMin) % 60).padStart(2, "0")} · ${blockMin}m`,
    })),
    insights: [{ title: "Planner", detail: fits ? "Schedule deep work in the longest uninterrupted block first." : `Drop ${Math.ceil(total - windowH)}h or shorten tasks.` }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeProductivityAnalyzer(
  focusHours: number,
  meetingHours: number,
  breakMin: number,
  workStart: number,
  workEnd: number,
): TimeRichResult | { error: string } {
  if (workEnd <= workStart) return { error: "Invalid work window." };
  const windowH = workEnd - workStart;
  const breakH = breakMin / 60;
  const adminH = Math.max(0, windowH - focusHours - meetingHours - breakH);
  const focusPct = Math.round((focusHours / windowH) * 100);
  const meetPct = Math.round((meetingHours / windowH) * 100);
  const score = productivityScore(focusPct, meetPct);
  return ok({
    primary: `${score}/100`,
    primaryLabel: "Productivity score (heuristic)",
    rows: [
      { label: "Deep work", value: `${focusHours}h (${focusPct}%)` },
      { label: "Meetings", value: `${meetingHours}h (${meetPct}%)` },
      { label: "Admin / slack", value: `${adminH.toFixed(1)}h` },
    ],
    breakdown: [
      { label: "Breaks", value: formatHm(breakMin) },
      { label: "Window", value: `${windowH}h` },
      { label: "Meeting load", value: meetPct > 40 ? "Heavy" : meetPct > 25 ? "Moderate" : "Light" },
    ],
    insights: [{ title: "Tip", detail: score >= 70 ? "Protect focus blocks on calendar." : "Batch meetings to free 90-minute focus windows." }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeTimeTrackingDashboard(
  deepHours: number,
  meetingHours: number,
  adminHours: number,
  breakMin: number,
): TimeRichResult | { error: string } {
  const breakH = breakMin / 60;
  const total = deepHours + meetingHours + adminHours + breakH;
  if (total <= 0) return { error: "Enter tracked time." };
  const pct = (h: number) => `${Math.round((h / total) * 100)}%`;
  return ok({
    primary: `${total.toFixed(1)}h`,
    primaryLabel: "Tracked today",
    rows: [
      { label: "Deep work", value: `${deepHours}h · ${pct(deepHours)}` },
      { label: "Meetings", value: `${meetingHours}h · ${pct(meetingHours)}` },
      { label: "Admin", value: `${adminHours}h · ${pct(adminHours)}` },
      { label: "Breaks", value: `${breakH.toFixed(1)}h · ${pct(breakH)}` },
    ],
    breakdown: [
      { label: "Deep : Meeting ratio", value: meetingHours ? (deepHours / meetingHours).toFixed(2) : "∞" },
      { label: "Untracked (8h day)", value: `${Math.max(0, 8 - total).toFixed(1)}h` },
    ],
    insights: [{ title: "Balance", detail: deepHours >= meetingHours ? "Deep-work heavy day." : "Meeting-heavy — defer shallow tasks." }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeDailyTimeUsage(
  sleepHours: number,
  workHours: number,
  commuteHours: number,
  leisureHours: number,
  mealsHours: number,
): TimeRichResult | { error: string } {
  const parts = [
    { label: "Sleep", h: sleepHours },
    { label: "Work", h: workHours },
    { label: "Commute", h: commuteHours },
    { label: "Leisure", h: leisureHours },
    { label: "Meals/chores", h: mealsHours },
  ];
  const total = parts.reduce((a, p) => a + p.h, 0);
  if (total > 24) return { error: "Categories cannot exceed 24 hours total." };
  const free = 24 - total;
  return ok({
    primary: `${free.toFixed(1)}h free`,
    primaryLabel: `${total.toFixed(1)}h allocated of 24h`,
    rows: parts.map((p) => ({ label: p.label, value: `${p.h}h (${Math.round((p.h / 24) * 100)}%)` })),
    breakdown: [
      { label: "Sleep share", value: sleepHours >= 7 && sleepHours <= 9 ? "Healthy range" : sleepHours < 7 ? "Short" : "Long" },
      { label: "Work share", value: `${Math.round((workHours / 24) * 100)}% of day` },
    ],
    insights: [{ title: "Balance", detail: free >= 2 ? `${free.toFixed(1)}h unallocated — buffer or hobbies.` : "Fully booked — watch burnout." }],
    tips: SPECIALIZED_TIPS,
  });
}

export function computeHabitTimeAnalyzer(
  habitMinPerDay: number,
  streakDays: number,
  targetHoursPerWeek: number,
): TimeRichResult | { error: string } {
  if (habitMinPerDay < 0 || streakDays < 0) return { error: "Values cannot be negative." };
  const weeklyH = (habitMinPerDay * 7) / 60;
  const targetPct = targetHoursPerWeek > 0 ? Math.round((weeklyH / targetHoursPerWeek) * 100) : 0;
  const consistency = Math.min(100, Math.round(streakDays * 7 + targetPct * 0.3));
  return ok({
    primary: `${consistency}/100`,
    primaryLabel: "Habit consistency score",
    rows: [
      { label: "Daily habit", value: formatHm(habitMinPerDay) },
      { label: "Weekly total", value: `${weeklyH.toFixed(1)}h` },
      { label: "Streak", value: `${streakDays} days` },
    ],
    breakdown: [
      { label: "Weekly target", value: `${targetHoursPerWeek}h` },
      { label: "Target progress", value: `${targetPct}%` },
      { label: "Annualized", value: `${(weeklyH * 52).toFixed(0)}h/year` },
    ],
    insights: [{ title: "Momentum", detail: streakDays >= 21 ? "Past the 21-day habit curve — keep going." : `${21 - streakDays} days to classic 21-day milestone.` }],
    tips: SPECIALIZED_TIPS,
  });
}
