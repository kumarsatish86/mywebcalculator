/** HR cost & budget — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrCostSlug =
  | "hr-ctc-calculator"
  | "hr-employee-cost-calculator"
  | "hr-hiring-cost-calculator"
  | "hr-cost-per-hire-calculator"
  | "hr-employee-turnover-cost-calculator"
  | "hr-time-to-hire-calculator"
  | "hr-offer-acceptance-rate-calculator"
  | "hr-recruitment-roi-calculator";

export const HR_COST_SLUGS: HrCostSlug[] = [
  "hr-ctc-calculator",
  "hr-employee-cost-calculator",
  "hr-hiring-cost-calculator",
  "hr-cost-per-hire-calculator",
  "hr-employee-turnover-cost-calculator",
  "hr-time-to-hire-calculator",
  "hr-offer-acceptance-rate-calculator",
  "hr-recruitment-roi-calculator",
];

export type HrCostInput = {
  grossMonthly?: number;
  employerBenefitsPct?: number;
  overheadPct?: number;
  agencyFees?: number;
  adsCost?: number;
  recruiterCost?: number;
  hires?: number;
  salaryAnnual?: number;
  replacementMultiplier?: number;
  openings?: number;
  daysOpen?: number;
  offersMade?: number;
  offersAccepted?: number;
  recruitSpend?: number;
  valueHired?: number;
  employerPf?: number;
};

export function computeHrCost(slug: HrCostSlug, input: HrCostInput): HrResult {
  switch (slug) {
    case "hr-ctc-calculator": {
      const gross = pos(input.grossMonthly, "Gross monthly");
      if (typeof gross !== "number") return { ok: false, error: gross.error };
      const benefits = nonNeg(input.employerBenefitsPct ?? 12, "Employer benefits %");
      if (typeof benefits !== "number") return { ok: false, error: benefits.error };
      const pf = nonNeg(input.employerPf ?? 0, "Employer PF ₹");
      if (typeof pf !== "number") return { ok: false, error: pf.error };
      const monthlyCtc = gross + pf + gross * (benefits / 100);
      return { ok: true, amount: monthlyCtc, amount2: monthlyCtc * 12, note: "CTC ≈ gross + employer PF + benefits % (estimate)." };
    }
    case "hr-employee-cost-calculator": {
      const gross = pos(input.grossMonthly, "Gross monthly");
      if (typeof gross !== "number") return { ok: false, error: gross.error };
      const benefits = nonNeg(input.employerBenefitsPct ?? 15, "Benefits %");
      if (typeof benefits !== "number") return { ok: false, error: benefits.error };
      const overhead = nonNeg(input.overheadPct ?? 10, "Overhead %");
      if (typeof overhead !== "number") return { ok: false, error: overhead.error };
      const monthly = gross * (1 + benefits / 100 + overhead / 100);
      return { ok: true, amount: monthly, amount2: monthly * 12, note: "True employee cost = gross × (1 + benefits% + overhead%)." };
    }
    case "hr-hiring-cost-calculator":
    case "hr-cost-per-hire-calculator": {
      const agency = nonNeg(input.agencyFees ?? 0, "Agency fees");
      if (typeof agency !== "number") return { ok: false, error: agency.error };
      const ads = nonNeg(input.adsCost ?? 0, "Ads cost");
      if (typeof ads !== "number") return { ok: false, error: ads.error };
      const recruiter = nonNeg(input.recruiterCost ?? 0, "Recruiter cost");
      if (typeof recruiter !== "number") return { ok: false, error: recruiter.error };
      const total = agency + ads + recruiter;
      const hires = pos(input.hires ?? 1, "Hires");
      if (typeof hires !== "number") return { ok: false, error: hires.error };
      return { ok: true, amount: total / hires, amount2: total, count: hires, note: "Cost per hire = total recruiting spend ÷ hires." };
    }
    case "hr-employee-turnover-cost-calculator": {
      const salary = pos(input.salaryAnnual ?? (input.grossMonthly ? input.grossMonthly * 12 : undefined), "Annual salary");
      if (typeof salary !== "number") return { ok: false, error: salary.error };
      const mult = pos(input.replacementMultiplier ?? 0.5, "Replacement multiplier");
      if (typeof mult !== "number") return { ok: false, error: mult.error };
      return { ok: true, amount: salary * mult, note: "Turnover cost ≈ annual salary × replacement multiplier (e.g. 0.5–2×)." };
    }
    case "hr-time-to-hire-calculator": {
      const openings = pos(input.openings ?? 1, "Openings");
      if (typeof openings !== "number") return { ok: false, error: openings.error };
      const days = pos(input.daysOpen, "Total opening-days (sum)");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, days: days / openings, amount: days / openings, note: "Avg time to hire = sum of days-to-fill ÷ openings." };
    }
    case "hr-offer-acceptance-rate-calculator": {
      const accepted = nonNeg(input.offersAccepted, "Offers accepted");
      if (typeof accepted !== "number") return { ok: false, error: accepted.error };
      const made = pos(input.offersMade, "Offers made");
      if (typeof made !== "number") return { ok: false, error: made.error };
      return { ok: true, pct: (accepted / made) * 100, count: made, note: "Offer acceptance % = accepted ÷ made × 100." };
    }
    case "hr-recruitment-roi-calculator": {
      const spend = pos(input.recruitSpend ?? input.agencyFees, "Recruitment spend");
      if (typeof spend !== "number") return { ok: false, error: spend.error };
      const value = pos(input.valueHired ?? input.salaryAnnual, "Value from hires");
      if (typeof value !== "number") return { ok: false, error: value.error };
      const roi = ((value - spend) / spend) * 100;
      return { ok: true, pct: roi, amount: value - spend, note: "Recruitment ROI % = (value − spend) ÷ spend × 100." };
    }
    default:
      return { ok: false, error: "Unknown cost calculator." };
  }
}
