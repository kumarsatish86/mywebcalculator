/** HR compliance & legal — India-friendly teaching estimates (not legal advice). */
import { HR_GRATUITY_CAP, nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrComplianceSlug =
  | "hr-gratuity-calculator"
  | "hr-notice-period-calculator"
  | "hr-severance-pay-calculator"
  | "hr-final-settlement-calculator";

export const HR_COMPLIANCE_SLUGS: HrComplianceSlug[] = [
  "hr-gratuity-calculator",
  "hr-notice-period-calculator",
  "hr-severance-pay-calculator",
  "hr-final-settlement-calculator",
];

export type HrComplianceInput = {
  lastDrawnMonthly?: number;
  yearsOfService?: number;
  noticeDaysRequired?: number;
  noticeDaysServed?: number;
  dailyGross?: number;
  monthlyGross?: number;
  severanceMonths?: number;
  leaveEncashment?: number;
  bonusDue?: number;
  otherDues?: number;
  recoveries?: number;
};

export function computeHrCompliance(slug: HrComplianceSlug, input: HrComplianceInput): HrResult {
  switch (slug) {
    case "hr-gratuity-calculator": {
      const last = pos(input.lastDrawnMonthly ?? input.monthlyGross, "Last drawn monthly (basic+DA)");
      if (typeof last !== "number") return { ok: false, error: last.error };
      const years = pos(input.yearsOfService, "Years of service");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const raw = ((last * 15) / 26) * years;
      const capped = Math.min(raw, HR_GRATUITY_CAP);
      return {
        ok: true,
        amount: capped,
        amount2: raw,
        note: `Gratuity ≈ (last drawn × 15/26) × years; illustrative cap ₹${HR_GRATUITY_CAP.toLocaleString("en-IN")} — not legal advice.`,
      };
    }
    case "hr-notice-period-calculator": {
      const required = pos(input.noticeDaysRequired ?? 30, "Notice days required");
      if (typeof required !== "number") return { ok: false, error: required.error };
      const served = nonNeg(input.noticeDaysServed ?? 0, "Days served");
      if (typeof served !== "number") return { ok: false, error: served.error };
      const shortfall = Math.max(0, required - served);
      const daily = pos(input.dailyGross ?? (input.monthlyGross ? input.monthlyGross / 30 : undefined) ?? 1000, "Daily gross");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      return { ok: true, days: shortfall, amount: shortfall * daily, note: "Notice buyout ≈ shortfall days × daily gross (policy-dependent)." };
    }
    case "hr-severance-pay-calculator": {
      const monthly = pos(input.monthlyGross ?? input.lastDrawnMonthly, "Monthly gross / wage");
      if (typeof monthly !== "number") return { ok: false, error: monthly.error };
      const months = pos(input.severanceMonths ?? input.yearsOfService ?? 1, "Severance months");
      if (typeof months !== "number") return { ok: false, error: months.error };
      return { ok: true, amount: monthly * months, note: "Severance estimate = monthly wage × months (contract/policy; not legal advice)." };
    }
    case "hr-final-settlement-calculator": {
      const monthly = pos(input.monthlyGross ?? input.lastDrawnMonthly, "Monthly gross");
      if (typeof monthly !== "number") return { ok: false, error: monthly.error };
      const leave = nonNeg(input.leaveEncashment ?? 0, "Leave encashment");
      if (typeof leave !== "number") return { ok: false, error: leave.error };
      const bonus = nonNeg(input.bonusDue ?? 0, "Bonus due");
      if (typeof bonus !== "number") return { ok: false, error: bonus.error };
      const other = nonNeg(input.otherDues ?? 0, "Other dues");
      if (typeof other !== "number") return { ok: false, error: other.error };
      const recoveries = nonNeg(input.recoveries ?? 0, "Recoveries");
      if (typeof recoveries !== "number") return { ok: false, error: recoveries.error };
      const years = input.yearsOfService && input.yearsOfService > 0 ? input.yearsOfService : 0;
      const gratuity = years >= 5 ? Math.min(((monthly * 15) / 26) * years, HR_GRATUITY_CAP) : 0;
      const total = leave + bonus + other + gratuity - recoveries;
      return {
        ok: true,
        amount: total,
        amount2: gratuity,
        amount3: leave + bonus + other,
        note: "F&F ≈ leave encash + bonus + other + gratuity (≥5y estimate) − recoveries. Not legal payroll advice.",
      };
    }
    default:
      return { ok: false, error: "Unknown compliance calculator." };
  }
}
