/** HR attrition & retention — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrAttritionSlug =
  | "hr-attrition-rate-calculator"
  | "hr-employee-retention-rate-calculator"
  | "hr-churn-rate-hr-calculator"
  | "hr-employee-stability-index-calculator";

export const HR_ATTRITION_SLUGS: HrAttritionSlug[] = [
  "hr-attrition-rate-calculator",
  "hr-employee-retention-rate-calculator",
  "hr-churn-rate-hr-calculator",
  "hr-employee-stability-index-calculator",
];

export type HrAttritionInput = {
  separations?: number;
  avgHeadcount?: number;
  beginningHeadcount?: number;
  endingHeadcount?: number;
  retained?: number;
  employeesOneYearPlus?: number;
  headcountYearAgo?: number;
};

export function computeHrAttrition(slug: HrAttritionSlug, input: HrAttritionInput): HrResult {
  switch (slug) {
    case "hr-attrition-rate-calculator":
    case "hr-churn-rate-hr-calculator": {
      const sep = nonNeg(input.separations, "Separations");
      if (typeof sep !== "number") return { ok: false, error: sep.error };
      let avg = input.avgHeadcount;
      if (!(avg && avg > 0)) {
        const b = input.beginningHeadcount;
        const e = input.endingHeadcount;
        if (b !== undefined && e !== undefined && b + e > 0) avg = (b + e) / 2;
      }
      const denom = pos(avg, "Average headcount");
      if (typeof denom !== "number") return { ok: false, error: denom.error };
      return { ok: true, pct: (sep / denom) * 100, count: sep, note: "Attrition/churn % = separations ÷ average headcount × 100." };
    }
    case "hr-employee-retention-rate-calculator": {
      const begin = pos(input.beginningHeadcount ?? input.avgHeadcount, "Beginning headcount");
      if (typeof begin !== "number") return { ok: false, error: begin.error };
      const retained = nonNeg(input.retained ?? input.employeesOneYearPlus, "Retained");
      if (typeof retained !== "number") return { ok: false, error: retained.error };
      return { ok: true, pct: (retained / begin) * 100, count: retained, note: "Retention % = retained ÷ beginning headcount × 100." };
    }
    case "hr-employee-stability-index-calculator": {
      const oneYearPlus = nonNeg(input.employeesOneYearPlus ?? input.retained, "Employees with ≥1 year");
      if (typeof oneYearPlus !== "number") return { ok: false, error: oneYearPlus.error };
      const yearAgo = pos(input.headcountYearAgo ?? input.beginningHeadcount, "Headcount 1 year ago");
      if (typeof yearAgo !== "number") return { ok: false, error: yearAgo.error };
      return { ok: true, pct: (oneYearPlus / yearAgo) * 100, note: "Stability index = (≥1 year tenure) ÷ headcount a year ago × 100." };
    }
    default:
      return { ok: false, error: "Unknown attrition calculator." };
  }
}
