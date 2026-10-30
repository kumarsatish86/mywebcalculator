/** HR work time & attendance — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrAttendanceSlug =
  | "hr-work-hours-calculator"
  | "hr-timesheet-calculator"
  | "hr-weekly-hours-calculator"
  | "hr-monthly-work-hours-calculator"
  | "hr-attendance-percentage-calculator"
  | "hr-leave-balance-calculator"
  | "hr-absence-impact-calculator"
  | "hr-overtime-hours-calculator"
  | "hr-shift-calculator-day-night"
  | "hr-break-time-calculator"
  | "hr-productivity-time-loss-calculator";

export const HR_ATTENDANCE_SLUGS: HrAttendanceSlug[] = [
  "hr-work-hours-calculator",
  "hr-timesheet-calculator",
  "hr-weekly-hours-calculator",
  "hr-monthly-work-hours-calculator",
  "hr-attendance-percentage-calculator",
  "hr-leave-balance-calculator",
  "hr-absence-impact-calculator",
  "hr-overtime-hours-calculator",
  "hr-shift-calculator-day-night",
  "hr-break-time-calculator",
  "hr-productivity-time-loss-calculator",
];

export type HrAttendanceInput = {
  startHour?: number;
  endHour?: number;
  breakMinutes?: number;
  days?: number;
  hoursPerDay?: number;
  hoursMon?: number;
  hoursTue?: number;
  hoursWed?: number;
  hoursThu?: number;
  hoursFri?: number;
  hoursSat?: number;
  hoursSun?: number;
  presentDays?: number;
  workingDays?: number;
  leaveEntitled?: number;
  leaveUsed?: number;
  dailyCost?: number;
  absentDays?: number;
  scheduledHours?: number;
  actualHours?: number;
  shiftHours?: number;
  nightPremiumPct?: number;
  idleMinutes?: number;
  productiveHours?: number;
};

function daySpanHours(start: number, end: number): number {
  let h = end - start;
  if (h < 0) h += 24;
  return h;
}

export function computeHrAttendance(slug: HrAttendanceSlug, input: HrAttendanceInput): HrResult {
  switch (slug) {
    case "hr-work-hours-calculator": {
      const start = nonNeg(input.startHour ?? 9, "Start hour");
      if (typeof start !== "number") return { ok: false, error: start.error };
      const end = nonNeg(input.endHour ?? 18, "End hour");
      if (typeof end !== "number") return { ok: false, error: end.error };
      const brk = nonNeg(input.breakMinutes ?? 60, "Break minutes");
      if (typeof brk !== "number") return { ok: false, error: brk.error };
      const hours = Math.max(0, daySpanHours(start, end) - brk / 60);
      return { ok: true, hours, amount: hours, note: "Net work hours = shift span − break." };
    }
    case "hr-timesheet-calculator": {
      const mon = nonNeg(input.hoursMon ?? 0, "Mon");
      if (typeof mon !== "number") return { ok: false, error: mon.error };
      const tue = nonNeg(input.hoursTue ?? 0, "Tue");
      if (typeof tue !== "number") return { ok: false, error: tue.error };
      const wed = nonNeg(input.hoursWed ?? 0, "Wed");
      if (typeof wed !== "number") return { ok: false, error: wed.error };
      const thu = nonNeg(input.hoursThu ?? 0, "Thu");
      if (typeof thu !== "number") return { ok: false, error: thu.error };
      const fri = nonNeg(input.hoursFri ?? 0, "Fri");
      if (typeof fri !== "number") return { ok: false, error: fri.error };
      const sat = nonNeg(input.hoursSat ?? 0, "Sat");
      if (typeof sat !== "number") return { ok: false, error: sat.error };
      const sun = nonNeg(input.hoursSun ?? 0, "Sun");
      if (typeof sun !== "number") return { ok: false, error: sun.error };
      const total = mon + tue + wed + thu + fri + sat + sun;
      return { ok: true, hours: total, amount: total, note: "Timesheet total = sum of daily hours." };
    }
    case "hr-weekly-hours-calculator": {
      const hpd = pos(input.hoursPerDay ?? 8, "Hours/day");
      if (typeof hpd !== "number") return { ok: false, error: hpd.error };
      const days = pos(input.days ?? 5, "Days/week");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, hours: hpd * days, amount: hpd * days, note: "Weekly hours = hours/day × days." };
    }
    case "hr-monthly-work-hours-calculator": {
      const hpd = pos(input.hoursPerDay ?? 8, "Hours/day");
      if (typeof hpd !== "number") return { ok: false, error: hpd.error };
      const days = pos(input.workingDays ?? input.days ?? 22, "Working days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, hours: hpd * days, days, amount: hpd * days, note: "Monthly hours = hours/day × working days." };
    }
    case "hr-attendance-percentage-calculator": {
      const present = nonNeg(input.presentDays, "Present days");
      if (typeof present !== "number") return { ok: false, error: present.error };
      const working = pos(input.workingDays ?? input.days, "Working days");
      if (typeof working !== "number") return { ok: false, error: working.error };
      return { ok: true, pct: (present / working) * 100, amount: present, days: working, note: "Attendance % = present ÷ working days × 100." };
    }
    case "hr-leave-balance-calculator": {
      const entitled = nonNeg(input.leaveEntitled, "Leave entitled");
      if (typeof entitled !== "number") return { ok: false, error: entitled.error };
      const used = nonNeg(input.leaveUsed ?? 0, "Leave used");
      if (typeof used !== "number") return { ok: false, error: used.error };
      return { ok: true, days: Math.max(0, entitled - used), amount: entitled, amount2: used, note: "Balance = entitled − used." };
    }
    case "hr-absence-impact-calculator": {
      const cost = pos(input.dailyCost, "Daily cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const absent = pos(input.absentDays ?? input.days, "Absent days");
      if (typeof absent !== "number") return { ok: false, error: absent.error };
      return { ok: true, amount: cost * absent, days: absent, note: "Absence impact ≈ daily cost × absent days." };
    }
    case "hr-overtime-hours-calculator": {
      const actual = pos(input.actualHours, "Actual hours");
      if (typeof actual !== "number") return { ok: false, error: actual.error };
      const scheduled = pos(input.scheduledHours, "Scheduled hours");
      if (typeof scheduled !== "number") return { ok: false, error: scheduled.error };
      const ot = Math.max(0, actual - scheduled);
      return { ok: true, hours: ot, amount: ot, note: "OT hours = max(0, actual − scheduled)." };
    }
    case "hr-shift-calculator-day-night": {
      const hours = pos(input.shiftHours ?? input.hoursPerDay ?? 8, "Shift hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const premium = nonNeg(input.nightPremiumPct ?? 10, "Night premium %");
      if (typeof premium !== "number") return { ok: false, error: premium.error };
      const rate = pos(input.dailyCost ?? 100, "Base hourly / day rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const nightPay = rate * hours * (1 + premium / 100);
      const dayPay = rate * hours;
      return { ok: true, amount: dayPay, amount2: nightPay, hours, note: "Day vs night pay with differential premium %." };
    }
    case "hr-break-time-calculator": {
      const start = nonNeg(input.startHour ?? 9, "Start");
      if (typeof start !== "number") return { ok: false, error: start.error };
      const end = nonNeg(input.endHour ?? 18, "End");
      if (typeof end !== "number") return { ok: false, error: end.error };
      const brk = nonNeg(input.breakMinutes ?? 60, "Break minutes");
      if (typeof brk !== "number") return { ok: false, error: brk.error };
      const span = daySpanHours(start, end);
      return { ok: true, hours: brk / 60, amount: span - brk / 60, amount2: span, note: "Break hours and remaining productive span." };
    }
    case "hr-productivity-time-loss-calculator": {
      const productive = pos(input.productiveHours ?? input.hoursPerDay ?? 8, "Scheduled productive hours");
      if (typeof productive !== "number") return { ok: false, error: productive.error };
      const idle = nonNeg(input.idleMinutes ?? 0, "Idle minutes");
      if (typeof idle !== "number") return { ok: false, error: idle.error };
      const lost = idle / 60;
      const pct = productive > 0 ? (lost / productive) * 100 : 0;
      return { ok: true, hours: lost, pct, amount: Math.max(0, productive - lost), note: "Time loss = idle minutes; % of scheduled productive hours." };
    }
    default:
      return { ok: false, error: "Unknown attendance calculator." };
  }
}
