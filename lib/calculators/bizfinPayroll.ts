/** Business finance — payroll & HR cost teaching estimates. */
import { pos, nonNeg } from "./bizfinHelpers";

export type BizfinPayrollSlug =
  | "bizfin-payroll-calculator"
  | "bizfin-employee-cost-calculator"
  | "bizfin-ctc-calculator"
  | "bizfin-overtime-pay-calculator"
  | "bizfin-salary-breakup-calculator"
  | "bizfin-attrition-cost-calculator";
export const BIZFIN_PAYROLL_SLUGS: BizfinPayrollSlug[] = [
  "bizfin-payroll-calculator",
  "bizfin-employee-cost-calculator",
  "bizfin-ctc-calculator",
  "bizfin-overtime-pay-calculator",
  "bizfin-salary-breakup-calculator",
  "bizfin-attrition-cost-calculator",
];


export type BizfinPayrollInput = {
  employees?: number;
  salary?: number;
  employerTaxPct?: number;
  benefits?: number;
  basic?: number;
  allowances?: number;
  employerContrib?: number;
  hours?: number;
  hourlyRate?: number;
  otMultiplier?: number;
  ctc?: number;
  basicPct?: number;
  hraPct?: number;
  replacements?: number;
  costPerHire?: number;
  lostProductivity?: number;
};

export type BizfinPayrollResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinPayroll(slug: BizfinPayrollSlug, input: BizfinPayrollInput): BizfinPayrollResult {
  switch (slug) {
    case "bizfin-payroll-calculator": {
      const n = pos(input.employees ?? 1, "Employees");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const salary = pos(input.salary ?? input.basic, "Salary per employee");
      if (typeof salary !== "number") return { ok: false, error: salary.error };
      const taxPct = nonNeg(input.employerTaxPct ?? 0, "Employer tax/burden %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      const base = n * salary;
      const burden = base * (taxPct / 100);
      return { ok: true, value: base + burden, secondary: base, note: "Payroll ≈ headcount × salary × (1 + burden%)." };
    }
    case "bizfin-employee-cost-calculator": {
      const salary = pos(input.salary ?? input.basic, "Salary");
      if (typeof salary !== "number") return { ok: false, error: salary.error };
      const benefits = nonNeg(input.benefits ?? 0, "Benefits");
      if (typeof benefits !== "number") return { ok: false, error: benefits.error };
      const taxPct = nonNeg(input.employerTaxPct ?? 0, "Employer tax %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      const tax = salary * (taxPct / 100);
      return { ok: true, value: salary + benefits + tax, note: "Employee cost = salary + benefits + employer tax." };
    }
    case "bizfin-ctc-calculator": {
      const basic = pos(input.basic ?? input.salary, "Basic");
      if (typeof basic !== "number") return { ok: false, error: basic.error };
      const allowances = nonNeg(input.allowances ?? 0, "Allowances");
      if (typeof allowances !== "number") return { ok: false, error: allowances.error };
      const contrib = nonNeg(input.employerContrib ?? input.benefits ?? 0, "Employer contributions");
      if (typeof contrib !== "number") return { ok: false, error: contrib.error };
      return { ok: true, value: basic + allowances + contrib, note: "CTC = basic + allowances + employer contrib." };
    }
    case "bizfin-overtime-pay-calculator": {
      const hours = pos(input.hours, "Overtime hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const rate = pos(input.hourlyRate, "Hourly rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const mult = pos(input.otMultiplier ?? 1.5, "OT multiplier");
      if (typeof mult !== "number") return { ok: false, error: mult.error };
      return { ok: true, value: hours * rate * mult, note: "OT pay = hours × rate × multiplier." };
    }
    case "bizfin-salary-breakup-calculator": {
      const ctc = pos(input.ctc ?? input.salary, "CTC / gross");
      if (typeof ctc !== "number") return { ok: false, error: ctc.error };
      const basicPct = nonNeg(input.basicPct ?? 40, "Basic % of CTC");
      if (typeof basicPct !== "number") return { ok: false, error: basicPct.error };
      const hraPct = nonNeg(input.hraPct ?? 20, "HRA % of CTC");
      if (typeof hraPct !== "number") return { ok: false, error: hraPct.error };
      const basic = ctc * (basicPct / 100);
      const hra = ctc * (hraPct / 100);
      const other = ctc - basic - hra;
      return { ok: true, value: basic, secondary: hra, tertiary: other, note: "Breakup: basic, HRA, remainder of CTC." };
    }
    case "bizfin-attrition-cost-calculator": {
      const replacements = pos(input.replacements ?? input.employees ?? 1, "Replacements");
      if (typeof replacements !== "number") return { ok: false, error: replacements.error };
      const hire = pos(input.costPerHire, "Cost per hire");
      if (typeof hire !== "number") return { ok: false, error: hire.error };
      const lost = nonNeg(input.lostProductivity ?? 0, "Lost productivity");
      if (typeof lost !== "number") return { ok: false, error: lost.error };
      return { ok: true, value: replacements * hire + lost, note: "Attrition cost ≈ replacements × cost/hire + lost productivity." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
