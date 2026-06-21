import { PRODUCTIVITY_TIPS } from "./timeDateKnowledge";
import {
  addBusinessDaysFrom,
  businessHoursBetween,
  countWeekdaysInclusive,
  dayName,
  diffDays,
  formatHm,
  parseDateTimeLocal,
  parseLocalDate,
  shiftDurationMinutes,
  splitOvertime,
  workHoursMinutes,
} from "./timeDateCore";
import type { TimeRichResult } from "./timeDateRich";

function ok(r: Omit<TimeRichResult, never>): TimeRichResult {
  return r;
}

function dailyHours(clockIn: string, clockOut: string, breakMin: number): number | { error: string } {
  return workHoursMinutes(clockIn, clockOut, breakMin);
}

export function computeTimesheet(
  weekStart: string,
  daysWorked: number,
  clockIn: string,
  clockOut: string,
  breakMin: number,
): TimeRichResult | { error: string } {
  const daily = dailyHours(clockIn, clockOut, breakMin);
  if (typeof daily === "object") return daily;
  if (daysWorked < 1 || daysWorked > 7) return { error: "Days worked must be between 1 and 7." };
  const total = (daily / 60) * daysWorked;
  const start = parseLocalDate(weekStart);
  return ok({
    primary: `${total.toFixed(2)} hours`,
    primaryLabel: `${daysWorked} days × ${(daily / 60).toFixed(2)}h per day`,
    rows: [
      { label: "Daily paid time", value: formatHm(daily) },
      { label: "Break (daily)", value: `${breakMin} min` },
    ],
    breakdown: [
      { label: "Week start", value: start?.toLocaleDateString("en-IN") ?? weekStart },
      { label: "Days worked", value: String(daysWorked) },
      { label: "Decimal days", value: (total / 8).toFixed(2) },
    ],
    insights: [{ title: "Full-time check", detail: total >= 40 ? "At or above 40h weekly benchmark." : `${(40 - total).toFixed(1)}h below 40h.` }],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeWorkHoursBusiness(
  clockIn: string,
  clockOut: string,
  breakMin: number,
  daysInPeriod: number,
  hourlyRate: number,
): TimeRichResult | { error: string } {
  const daily = dailyHours(clockIn, clockOut, breakMin);
  if (typeof daily === "object") return daily;
  if (daysInPeriod < 1) return { error: "Enter at least 1 day in the period." };
  const dailyH = daily / 60;
  const periodH = dailyH * daysInPeriod;
  const pay = hourlyRate > 0 ? periodH * hourlyRate : 0;
  return ok({
    primary: `${periodH.toFixed(2)} hours`,
    primaryLabel: `${daysInPeriod} days · ${dailyH.toFixed(2)}h per shift`,
    rows: [
      { label: "Shift length", value: formatHm(daily) },
      { label: "Estimated pay", value: hourlyRate > 0 ? pay.toFixed(2) : "Set rate to estimate" },
    ],
    breakdown: [
      { label: "Break per shift", value: `${breakMin} min` },
      { label: "8h-day equivalent", value: (periodH / 8).toFixed(2) },
    ],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeOvertime(
  clockIn: string,
  clockOut: string,
  breakMin: number,
  threshold: number,
  multiplier: number,
  hourlyRate: number,
): TimeRichResult | { error: string } {
  const mins = dailyHours(clockIn, clockOut, breakMin);
  if (typeof mins === "object") return mins;
  const total = mins / 60;
  const { regular, overtime } = splitOvertime(total, threshold);
  const otPay = hourlyRate > 0 ? regular * hourlyRate + overtime * hourlyRate * multiplier : 0;
  return ok({
    primary: `${overtime.toFixed(2)} OT hours`,
    primaryLabel: `${regular.toFixed(2)}h regular · ${threshold}h threshold`,
    rows: [
      { label: "Total shift", value: total.toFixed(2) },
      { label: "Multiplier", value: `${multiplier}×` },
      { label: "Est. gross pay", value: hourlyRate > 0 ? otPay.toFixed(2) : "Set rate" },
    ],
    breakdown: [
      { label: "Regular pay block", value: `${regular.toFixed(2)}h` },
      { label: "Overtime block", value: `${overtime.toFixed(2)}h` },
      { label: "OT as % of shift", value: total ? `${Math.round((overtime / total) * 100)}%` : "0%" },
    ],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeShiftDuration(clockIn: string, clockOut: string, breakMin: number): TimeRichResult | { error: string } {
  const mins = shiftDurationMinutes(clockIn, clockOut, breakMin);
  if (typeof mins === "object") return mins;
  const hours = mins / 60;
  const overnight = (() => {
    const a = clockIn.split(":").map(Number);
    const b = clockOut.split(":").map(Number);
    return b[0] * 60 + b[1] <= a[0] * 60 + a[1];
  })();
  return ok({
    primary: formatHm(mins),
    primaryLabel: `${hours.toFixed(2)} paid hours · break ${breakMin}m`,
    rows: [
      { label: "Shift type", value: overnight ? "Overnight (crosses midnight)" : "Same-day shift" },
      { label: "Decimal hours", value: hours.toFixed(2) },
    ],
    breakdown: [
      { label: "Clock in", value: clockIn },
      { label: "Clock out", value: clockOut },
      { label: "Gross span", value: formatHm(mins + breakMin) },
    ],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computePayrollHours(
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,
  multiplier: number,
): TimeRichResult | { error: string } {
  if (regularHours < 0 || overtimeHours < 0) return { error: "Hours cannot be negative." };
  if (hourlyRate <= 0) return { error: "Enter a positive hourly rate." };
  const regularPay = regularHours * hourlyRate;
  const otPay = overtimeHours * hourlyRate * multiplier;
  const gross = regularPay + otPay;
  return ok({
    primary: gross.toFixed(2),
    primaryLabel: `Gross pay · ${(regularHours + overtimeHours).toFixed(2)} total hours`,
    rows: [
      { label: "Regular pay", value: regularPay.toFixed(2) },
      { label: "Overtime pay", value: otPay.toFixed(2) },
      { label: "Effective rate", value: `${(gross / (regularHours + overtimeHours || 1)).toFixed(2)}/h` },
    ],
    breakdown: [
      { label: "Regular hours", value: regularHours.toFixed(2) },
      { label: "OT hours", value: overtimeHours.toFixed(2) },
      { label: "OT multiplier", value: `${multiplier}×` },
    ],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeProjectDuration(
  startDate: string,
  endDate: string,
  hoursPerDay: number,
): TimeRichResult | { error: string } {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  if (!start || !end) return { error: "Enter valid project dates." };
  if (end < start) return { error: "End date must be on or after start." };
  if (hoursPerDay <= 0 || hoursPerDay > 24) return { error: "Hours per day must be between 0 and 24." };
  const { weekdays, weekendDays, totalDays } = countWeekdaysInclusive(start, end);
  const personHours = weekdays * hoursPerDay;
  const calendarDays = diffDays(start, end) + 1;
  return ok({
    primary: `${personHours.toFixed(0)} person-hours`,
    primaryLabel: `${weekdays} working days · ${hoursPerDay}h/day`,
    rows: [
      { label: "Calendar span", value: `${calendarDays} days` },
      { label: "Weekends in range", value: String(weekendDays) },
      { label: "FTE weeks (40h)", value: (personHours / 40).toFixed(2) },
    ],
    breakdown: [
      { label: "Start", value: start.toLocaleDateString("en-IN") },
      { label: "End", value: end.toLocaleDateString("en-IN") },
      { label: "Total calendar days", value: String(totalDays) },
    ],
    insights: [{ title: "Timeline", detail: `${Math.ceil(personHours / 40)} nominal 40h weeks of effort.` }],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeDeadline(startDate: string, businessDays: number): TimeRichResult | { error: string } {
  const start = parseLocalDate(startDate);
  if (!start) return { error: "Enter a valid start date." };
  if (businessDays < 0) return { error: "Business days cannot be negative." };
  const deadline = businessDays === 0 ? new Date(start) : addBusinessDaysFrom(start, businessDays);
  return ok({
    primary: deadline.toLocaleDateString("en-IN", { dateStyle: "full" }),
    primaryLabel: `${businessDays} business day${businessDays === 1 ? "" : "s"} from start`,
    rows: [
      { label: "Weekday", value: dayName(deadline) },
      { label: "Calendar days (≈)", value: String(diffDays(start, deadline)) },
    ],
    breakdown: [
      { label: "Start", value: start.toLocaleDateString("en-IN") },
      { label: "Business days added", value: String(businessDays) },
    ],
    insights: [{ title: "Weekend skip", detail: "Sat–Sun are skipped; public holidays are not." }],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeSlaTime(
  receivedDate: string,
  receivedTime: string,
  slaHours: number,
  slaMinutes: number,
  refDate: string,
  refTime: string,
): TimeRichResult | { error: string } {
  const received = parseDateTimeLocal(receivedDate, receivedTime);
  const ref = parseDateTimeLocal(refDate, refTime);
  if (typeof received === "object" && "error" in received) return received;
  if (typeof ref === "object" && "error" in ref) return ref;
  const slaMs = (slaHours * 3600 + slaMinutes * 60) * 1000;
  const deadline = new Date(received.getTime() + slaMs);
  const remainingMs = deadline.getTime() - ref.getTime();
  const breached = remainingMs < 0;
  const absMs = Math.abs(remainingMs);
  const remH = Math.floor(absMs / 3600000);
  const remM = Math.floor((absMs % 3600000) / 60000);
  return ok({
    primary: breached ? "SLA breached" : `${remH}h ${remM}m left`,
    primaryLabel: breached ? `${remH}h ${remM}m overdue` : "Within SLA window",
    rows: [
      { label: "SLA deadline", value: deadline.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "SLA window", value: `${slaHours}h ${slaMinutes}m` },
      { label: "Reference time", value: ref.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
    ],
    breakdown: [
      { label: "Received", value: received.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Status", value: breached ? "Breached" : "On track" },
      { label: "Buffer used", value: `${Math.min(100, Math.round(((ref.getTime() - received.getTime()) / slaMs) * 100))}%` },
    ],
    tips: PRODUCTIVITY_TIPS,
  });
}

export function computeTurnaroundTime(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
): TimeRichResult | { error: string } {
  const start = parseDateTimeLocal(startDate, startTime);
  const end = parseDateTimeLocal(endDate, endTime);
  if (typeof start === "object" && "error" in start) return start;
  if (typeof end === "object" && "error" in end) return end;
  if (end <= start) return { error: "End must be after start." };
  const calendarMs = end.getTime() - start.getTime();
  const calendarH = calendarMs / 3600000;
  const bizMin = businessHoursBetween(start, end);
  const bizH = bizMin / 60;
  return ok({
    primary: `${bizH.toFixed(1)} business hours`,
    primaryLabel: `${calendarH.toFixed(1)} calendar hours total`,
    rows: [
      { label: "Calendar days", value: (calendarMs / 86400000).toFixed(2) },
      { label: "Business minutes", value: Math.round(bizMin).toLocaleString() },
    ],
    breakdown: [
      { label: "Started", value: start.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Completed", value: end.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
      { label: "Biz-hrs window", value: "Mon–Fri 9:00–17:00" },
    ],
    insights: [{ title: "Speed", detail: bizH <= 8 ? "Same business-day turnaround." : `Spans ${Math.ceil(bizH / 8)} nominal work days.` }],
    tips: PRODUCTIVITY_TIPS,
  });
}
