/** HR leave & vacation — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrLeaveSlug =
  | "hr-leave-accrual-calculator"
  | "hr-annual-leave-calculator"
  | "hr-sick-leave-calculator"
  | "hr-pto-calculator"
  | "hr-vacation-balance-calculator"
  | "hr-leave-encashment-calculator";

export const HR_LEAVE_SLUGS: HrLeaveSlug[] = [
  "hr-leave-accrual-calculator",
  "hr-annual-leave-calculator",
  "hr-sick-leave-calculator",
  "hr-pto-calculator",
  "hr-vacation-balance-calculator",
  "hr-leave-encashment-calculator",
];

export type HrLeaveInput = {
  monthsWorked?: number;
  accrualPerMonth?: number;
  annualEntitlement?: number;
  used?: number;
  carried?: number;
  sickEntitlement?: number;
  sickUsed?: number;
  ptoAccrualRate?: number;
  hoursWorked?: number;
  basicPlusDa?: number;
  leaveDays?: number;
  workingDaysPerYear?: number;
};

export function computeHrLeave(slug: HrLeaveSlug, input: HrLeaveInput): HrResult {
  switch (slug) {
    case "hr-leave-accrual-calculator": {
      const months = pos(input.monthsWorked ?? 12, "Months worked");
      if (typeof months !== "number") return { ok: false, error: months.error };
      const rate = pos(input.accrualPerMonth ?? 1.5, "Accrual/month");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, days: months * rate, amount: months * rate, note: "Accrued leave = months × accrual per month." };
    }
    case "hr-annual-leave-calculator": {
      const entitled = pos(input.annualEntitlement ?? 18, "Annual entitlement");
      if (typeof entitled !== "number") return { ok: false, error: entitled.error };
      const used = nonNeg(input.used ?? 0, "Used");
      if (typeof used !== "number") return { ok: false, error: used.error };
      const carried = nonNeg(input.carried ?? 0, "Carried forward");
      if (typeof carried !== "number") return { ok: false, error: carried.error };
      return { ok: true, days: entitled + carried - used, amount: entitled, amount2: used, note: "Available = entitlement + carry − used." };
    }
    case "hr-sick-leave-calculator": {
      const entitled = pos(input.sickEntitlement ?? input.annualEntitlement ?? 12, "Sick entitlement");
      if (typeof entitled !== "number") return { ok: false, error: entitled.error };
      const used = nonNeg(input.sickUsed ?? input.used ?? 0, "Sick used");
      if (typeof used !== "number") return { ok: false, error: used.error };
      return { ok: true, days: Math.max(0, entitled - used), amount: entitled, amount2: used, note: "Sick balance = entitlement − used." };
    }
    case "hr-pto-calculator": {
      const hours = pos(input.hoursWorked ?? 160, "Hours worked");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const rate = pos(input.ptoAccrualRate ?? 0.05, "PTO accrual rate (days per hour)");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const accrued = hours * rate;
      const used = nonNeg(input.used ?? 0, "PTO used (days)");
      if (typeof used !== "number") return { ok: false, error: used.error };
      return { ok: true, days: Math.max(0, accrued - used), amount: accrued, note: "PTO days ≈ hours worked × accrual rate − used." };
    }
    case "hr-vacation-balance-calculator": {
      const entitled = pos(input.annualEntitlement ?? 20, "Vacation days");
      if (typeof entitled !== "number") return { ok: false, error: entitled.error };
      const used = nonNeg(input.used ?? 0, "Used");
      if (typeof used !== "number") return { ok: false, error: used.error };
      const carried = nonNeg(input.carried ?? 0, "Carried");
      if (typeof carried !== "number") return { ok: false, error: carried.error };
      return { ok: true, days: entitled + carried - used, note: "Vacation balance = bank + carry − taken." };
    }
    case "hr-leave-encashment-calculator": {
      const basic = pos(input.basicPlusDa, "Basic + DA monthly");
      if (typeof basic !== "number") return { ok: false, error: basic.error };
      const days = pos(input.leaveDays, "Leave days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const daily = basic / 30;
      return { ok: true, amount: daily * days, rate: daily, days, note: "Encashment ≈ (basic+DA)/30 × leave days (illustrative)." };
    }
    default:
      return { ok: false, error: "Unknown leave calculator." };
  }
}
