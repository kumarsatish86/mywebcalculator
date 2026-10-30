/** HR payroll & salary — India-friendly teaching estimates (not legal payroll advice). */
import {
  HR_ESI_EMPLOYEE_RATE,
  HR_ESI_EMPLOYER_RATE,
  HR_ESI_WAGE_CEILING,
  HR_PF_RATE,
  HR_PF_WAGE_CEILING,
  nonNeg,
  pos,
  type HrResult,
} from "./hrHelpers";

export type HrPayrollSlug =
  | "hr-salary-annual-monthly-hourly-calculator"
  | "hr-in-hand-salary-calculator"
  | "hr-net-salary-calculator"
  | "hr-gross-salary-calculator"
  | "hr-salary-breakdown-calculator"
  | "hr-payroll-calculator"
  | "hr-payslip-generator-tool"
  | "hr-payroll-tax-calculator"
  | "hr-overtime-pay-calculator"
  | "hr-holiday-pay-calculator"
  | "hr-income-tax-calculator"
  | "hr-pf-provident-fund-calculator"
  | "hr-esi-calculator"
  | "hr-professional-tax-calculator"
  | "hr-tds-calculator";

export const HR_PAYROLL_SLUGS: HrPayrollSlug[] = [
  "hr-salary-annual-monthly-hourly-calculator",
  "hr-in-hand-salary-calculator",
  "hr-net-salary-calculator",
  "hr-gross-salary-calculator",
  "hr-salary-breakdown-calculator",
  "hr-payroll-calculator",
  "hr-payslip-generator-tool",
  "hr-payroll-tax-calculator",
  "hr-overtime-pay-calculator",
  "hr-holiday-pay-calculator",
  "hr-income-tax-calculator",
  "hr-pf-provident-fund-calculator",
  "hr-esi-calculator",
  "hr-professional-tax-calculator",
  "hr-tds-calculator",
];

export type HrPayrollInput = {
  annual?: number;
  monthly?: number;
  hourly?: number;
  hoursPerWeek?: number;
  weeksPerYear?: number;
  gross?: number;
  basic?: number;
  hra?: number;
  allowance?: number;
  pfPct?: number;
  taxPct?: number;
  otherDeduction?: number;
  employerLoadPct?: number;
  otHours?: number;
  otMultiplier?: number;
  holidayDays?: number;
  days?: number;
  dailyRate?: number;
  pfWages?: number;
  usePfCeiling?: number;
  esiWages?: number;
  ptAmount?: number;
  tdsPct?: number;
  annualTax?: number;
};

/** Simplified new-regime style teaching slabs (FY illustrative). */
function approxAnnualTax(annualIncome: number): number {
  const taxable = Math.max(0, annualIncome - 75000);
  let tax = 0;
  let rem = taxable;
  const bands: [number, number][] = [
    [300000, 0],
    [400000, 0.05],
    [300000, 0.1],
    [300000, 0.15],
    [300000, 0.2],
    [Infinity, 0.3],
  ];
  for (const [width, rate] of bands) {
    const slice = Math.min(rem, width);
    tax += slice * rate;
    rem -= slice;
    if (rem <= 0) break;
  }
  return tax;
}

export function computeHrPayroll(slug: HrPayrollSlug, input: HrPayrollInput): HrResult {
  switch (slug) {
    case "hr-salary-annual-monthly-hourly-calculator": {
      const weeks = input.weeksPerYear && input.weeksPerYear > 0 ? input.weeksPerYear : 52;
      const hpw = input.hoursPerWeek && input.hoursPerWeek > 0 ? input.hoursPerWeek : 40;
      if (input.annual && input.annual > 0) {
        const annual = input.annual;
        const monthly = annual / 12;
        const hourly = annual / (weeks * hpw);
        return { ok: true, amount: annual, amount2: monthly, amount3: hourly, note: "Annual ↔ monthly ÷12; hourly ÷ (weeks×hours/week)." };
      }
      if (input.monthly && input.monthly > 0) {
        const monthly = input.monthly;
        const annual = monthly * 12;
        const hourly = annual / (weeks * hpw);
        return { ok: true, amount: annual, amount2: monthly, amount3: hourly, note: "Monthly ×12 = annual; hourly from annual." };
      }
      const hourly = pos(input.hourly, "Hourly rate");
      if (typeof hourly !== "number") return { ok: false, error: hourly.error };
      const annual = hourly * weeks * hpw;
      return { ok: true, amount: annual, amount2: annual / 12, amount3: hourly, note: "Hourly × weeks × hours/week = annual." };
    }
    case "hr-in-hand-salary-calculator":
    case "hr-net-salary-calculator": {
      const gross = pos(input.gross ?? input.monthly, "Gross monthly");
      if (typeof gross !== "number") return { ok: false, error: gross.error };
      const pfPct = nonNeg(input.pfPct ?? 12, "PF %");
      if (typeof pfPct !== "number") return { ok: false, error: pfPct.error };
      const taxPct = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      const other = nonNeg(input.otherDeduction ?? 0, "Other deduction");
      if (typeof other !== "number") return { ok: false, error: other.error };
      const pf = gross * (pfPct / 100);
      const tax = gross * (taxPct / 100);
      const net = gross - pf - tax - other;
      return { ok: true, amount: net, amount2: pf + tax + other, amount3: gross, note: "In-hand ≈ gross − PF − tax − other (estimate)." };
    }
    case "hr-gross-salary-calculator": {
      const basic = pos(input.basic, "Basic");
      if (typeof basic !== "number") return { ok: false, error: basic.error };
      const hra = nonNeg(input.hra ?? 0, "HRA");
      if (typeof hra !== "number") return { ok: false, error: hra.error };
      const allow = nonNeg(input.allowance ?? 0, "Allowance");
      if (typeof allow !== "number") return { ok: false, error: allow.error };
      const gross = basic + hra + allow;
      return { ok: true, amount: gross, amount2: basic, amount3: hra, note: "Gross = basic + HRA + allowances." };
    }
    case "hr-salary-breakdown-calculator": {
      const ctc = pos(input.monthly ?? input.gross, "Monthly CTC / gross");
      if (typeof ctc !== "number") return { ok: false, error: ctc.error };
      const basicPct = input.pfPct && input.pfPct > 0 ? input.pfPct : 40;
      const basic = ctc * (basicPct / 100);
      const hra = basic * 0.5;
      const employerPf = Math.min(basic, HR_PF_WAGE_CEILING) * HR_PF_RATE;
      const special = Math.max(0, ctc - basic - hra - employerPf);
      return {
        ok: true,
        amount: basic,
        amount2: hra,
        amount3: special,
        note: `Illustrative split: basic ${basicPct}%, HRA 50% of basic, remainder special (− employer PF estimate).`,
      };
    }
    case "hr-payroll-calculator":
    case "hr-payslip-generator-tool": {
      const gross = pos(input.gross ?? input.monthly, "Gross");
      if (typeof gross !== "number") return { ok: false, error: gross.error };
      const basic = input.basic && input.basic > 0 ? input.basic : gross * 0.4;
      const pfWages = Math.min(basic, HR_PF_WAGE_CEILING);
      const empPf = pfWages * HR_PF_RATE;
      const taxPct = nonNeg(input.taxPct ?? 5, "Tax %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      const tax = gross * (taxPct / 100);
      const pt = nonNeg(input.ptAmount ?? 200, "Professional tax");
      if (typeof pt !== "number") return { ok: false, error: pt.error };
      const net = gross - empPf - tax - pt;
      const employerLoad = nonNeg(input.employerLoadPct ?? 12, "Employer load %");
      if (typeof employerLoad !== "number") return { ok: false, error: employerLoad.error };
      const employerCost = gross + pfWages * HR_PF_RATE + gross * (employerLoad / 100);
      return {
        ok: true,
        amount: net,
        amount2: empPf + tax + pt,
        amount3: employerCost,
        note: "Payslip-style estimate: net, deductions, employer cost (illustrative PF/tax/PT).",
      };
    }
    case "hr-payroll-tax-calculator": {
      const gross = pos(input.gross ?? input.monthly, "Gross monthly");
      if (typeof gross !== "number") return { ok: false, error: gross.error };
      const annual = gross * 12;
      const tax = approxAnnualTax(annual);
      return { ok: true, amount: tax / 12, amount2: tax, amount3: annual, note: "Monthly payroll tax ≈ simplified annual tax ÷ 12 (teaching slabs)." };
    }
    case "hr-overtime-pay-calculator": {
      const hourly = pos(input.hourly ?? input.dailyRate, "Hourly rate");
      if (typeof hourly !== "number") return { ok: false, error: hourly.error };
      const hours = pos(input.otHours ?? input.hoursPerWeek, "OT hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const mult = pos(input.otMultiplier ?? 1.5, "OT multiplier");
      if (typeof mult !== "number") return { ok: false, error: mult.error };
      return { ok: true, amount: hourly * hours * mult, hours, rate: hourly * mult, note: "OT pay = hourly × hours × multiplier (e.g. 1.5×)." };
    }
    case "hr-holiday-pay-calculator": {
      const daily = pos(input.dailyRate ?? input.hourly, "Daily rate");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.holidayDays ?? input.days, "Holiday days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const mult = input.otMultiplier && input.otMultiplier > 0 ? input.otMultiplier : 1;
      return { ok: true, amount: daily * days * mult, days, note: "Holiday pay ≈ daily rate × days × premium." };
    }
    case "hr-income-tax-calculator": {
      const annual = pos(input.annual ?? (input.monthly ? input.monthly * 12 : undefined) ?? input.gross, "Annual income");
      if (typeof annual !== "number") return { ok: false, error: annual.error };
      const tax = approxAnnualTax(annual);
      return { ok: true, amount: tax, amount2: tax / 12, pct: annual > 0 ? (tax / annual) * 100 : 0, note: "Illustrative new-regime style slabs — not legal tax advice." };
    }
    case "hr-pf-provident-fund-calculator": {
      const wagesIn = pos(input.pfWages ?? input.basic ?? input.gross, "PF wages / basic");
      if (typeof wagesIn !== "number") return { ok: false, error: wagesIn.error };
      const useCeiling = input.usePfCeiling === undefined || input.usePfCeiling > 0;
      const wages = useCeiling ? Math.min(wagesIn, HR_PF_WAGE_CEILING) : wagesIn;
      const rate = input.pfPct && input.pfPct > 0 ? input.pfPct / 100 : HR_PF_RATE;
      const employee = wages * rate;
      const employer = wages * rate;
      return {
        ok: true,
        amount: employee,
        amount2: employer,
        amount3: employee + employer,
        note: `EPF estimate @ ${(rate * 100).toFixed(0)}% on ₹${wages.toFixed(0)} wages${useCeiling ? ` (ceiling ₹${HR_PF_WAGE_CEILING})` : ""} — teaching only.`,
      };
    }
    case "hr-esi-calculator": {
      const wages = pos(input.esiWages ?? input.gross ?? input.monthly, "ESI wages");
      if (typeof wages !== "number") return { ok: false, error: wages.error };
      if (wages > HR_ESI_WAGE_CEILING) {
        return {
          ok: true,
          amount: 0,
          amount2: 0,
          amount3: wages,
          note: `Wages above illustrative ESI ceiling ₹${HR_ESI_WAGE_CEILING}/mo — typically not covered (estimate).`,
        };
      }
      const emp = wages * HR_ESI_EMPLOYEE_RATE;
      const er = wages * HR_ESI_EMPLOYER_RATE;
      return {
        ok: true,
        amount: emp,
        amount2: er,
        amount3: emp + er,
        note: "ESI estimate: employee 0.75% + employer 3.25% under wage ceiling — not legal advice.",
      };
    }
    case "hr-professional-tax-calculator": {
      const monthly = pos(input.monthly ?? input.gross, "Monthly salary");
      if (typeof monthly !== "number") return { ok: false, error: monthly.error };
      const override = input.ptAmount;
      let pt: number;
      if (override !== undefined && override >= 0) pt = override;
      else if (monthly <= 10000) pt = 0;
      else if (monthly <= 15000) pt = 150;
      else pt = 200;
      return { ok: true, amount: pt, amount2: pt * 12, note: "Illustrative PT slab (e.g. MH-style) — state rules differ; verify locally." };
    }
    case "hr-tds-calculator": {
      const monthly = pos(input.monthly ?? input.gross, "Monthly gross");
      if (typeof monthly !== "number") return { ok: false, error: monthly.error };
      if (input.tdsPct !== undefined && input.tdsPct >= 0) {
        const tds = monthly * (input.tdsPct / 100);
        return { ok: true, amount: tds, amount2: tds * 12, pct: input.tdsPct, note: "TDS = monthly × rate % (illustrative)." };
      }
      const annualTax = input.annualTax && input.annualTax > 0 ? input.annualTax : approxAnnualTax(monthly * 12);
      const tds = annualTax / 12;
      return { ok: true, amount: tds, amount2: annualTax, note: "Monthly TDS ≈ estimated annual tax ÷ 12 — teaching estimate only." };
    }
    default:
      return { ok: false, error: "Unknown payroll calculator." };
  }
}
