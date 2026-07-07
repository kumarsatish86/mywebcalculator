import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualFromMonthly, monthlyFromAnnual, netFromGross } from "./salaryCore";

export type TaxCurrencyCode = LoanCurrencyCode;

export const TAX_DEDUCTION_URL = {
  A: "a",
  T: "t",
  D: "d",
  E: "e",
  P: "p",
  M: "m",
  X: "x",
  MD: "md",
} as const;

export function formatTaxMoney(amount: number, currency: TaxCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseTaxDeductionSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(TAX_DEDUCTION_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function taxableIncome(params: {
  gross: number;
  exemptions: number;
  deductions: number;
}): { gross: number; exemptions: number; deductions: number; taxable: number } | { error: string } {
  const totalReduction = params.exemptions + params.deductions;
  if (totalReduction > params.gross) return { error: "Exemptions and deductions cannot exceed gross income." };
  return {
    gross: params.gross,
    exemptions: params.exemptions,
    deductions: params.deductions,
    taxable: params.gross - totalReduction,
  };
}

export function incomeTaxFromTaxable(params: {
  taxable: number;
  taxPercent: number;
}): { taxable: number; taxAmount: number; net: number; effectiveRate: number } {
  const taxAmount = params.taxable * (params.taxPercent / 100);
  const net = params.taxable - taxAmount;
  const effectiveRate = params.taxable > 0 ? (taxAmount / params.taxable) * 100 : 0;
  return { taxable: params.taxable, taxAmount, net, effectiveRate };
}

export function globalIncomeTax(params: {
  grossAnnual: number;
  standardDeduction: number;
  otherDeductions: number;
  taxPercent: number;
}): ReturnType<typeof incomeTaxFromTaxable> & {
  grossAnnual: number;
  standardDeduction: number;
  otherDeductions: number;
} | { error: string } {
  const taxableResult = taxableIncome({
    gross: params.grossAnnual,
    exemptions: params.standardDeduction,
    deductions: params.otherDeductions,
  });
  if ("error" in taxableResult) return taxableResult;
  const tax = incomeTaxFromTaxable({ taxable: taxableResult.taxable, taxPercent: params.taxPercent });
  return {
    grossAnnual: params.grossAnnual,
    standardDeduction: params.standardDeduction,
    otherDeductions: params.otherDeductions,
    ...tax,
  };
}

export function afterTaxSalary(params: {
  grossMonthly: number;
  taxPercent: number;
  deductionPercent: number;
}): ReturnType<typeof netFromGross> {
  return netFromGross({
    gross: params.grossMonthly,
    taxPercent: params.taxPercent,
    deductionPercent: params.deductionPercent,
  });
}

export function salaryAfterTax(params: {
  grossAnnual: number;
  taxPercent: number;
  deductionPercent: number;
}): {
  grossAnnual: number;
  taxAmount: number;
  deductionAmount: number;
  netAnnual: number;
  netMonthly: number;
} {
  const grossMonthly = monthlyFromAnnual(params.grossAnnual);
  const breakdown = netFromGross({
    gross: grossMonthly,
    taxPercent: params.taxPercent,
    deductionPercent: params.deductionPercent,
  });
  return {
    grossAnnual: params.grossAnnual,
    taxAmount: breakdown.taxAmount * 12,
    deductionAmount: breakdown.deductionAmount * 12,
    netAnnual: breakdown.annualNet,
    netMonthly: breakdown.net,
  };
}

export function taxRefund(params: {
  taxableIncome: number;
  taxPercent: number;
  taxPaid: number;
}): {
  taxOwed: number;
  taxPaid: number;
  refund: number;
  balanceDue: number;
} {
  const taxOwed = params.taxableIncome * (params.taxPercent / 100);
  const diff = params.taxPaid - taxOwed;
  return {
    taxOwed,
    taxPaid: params.taxPaid,
    refund: diff > 0 ? diff : 0,
    balanceDue: diff < 0 ? -diff : 0,
  };
}

export function tdsFromAnnualTax(params: {
  annualIncome: number;
  estimatedAnnualTax: number;
}): { annualIncome: number; estimatedAnnualTax: number; monthlyTds: number; effectiveTdsRate: number } {
  const monthlyTds = params.estimatedAnnualTax / 12;
  const effectiveTdsRate = params.annualIncome > 0 ? (params.estimatedAnnualTax / params.annualIncome) * 100 : 0;
  return {
    annualIncome: params.annualIncome,
    estimatedAnnualTax: params.estimatedAnnualTax,
    monthlyTds,
    effectiveTdsRate,
  };
}

export function tdsFromRate(params: {
  monthlyGross: number;
  tdsPercent: number;
}): { monthlyGross: number; monthlyTds: number; annualTds: number; tdsPercent: number } {
  const monthlyTds = params.monthlyGross * (params.tdsPercent / 100);
  return {
    monthlyGross: params.monthlyGross,
    monthlyTds,
    annualTds: monthlyTds * 12,
    tdsPercent: params.tdsPercent,
  };
}

export function effectiveTaxRate(params: {
  grossIncome: number;
  totalTax: number;
}): { grossIncome: number; totalTax: number; effectiveRate: number; netIncome: number } | { error: string } {
  if (params.grossIncome <= 0) return { error: "Gross income must be positive." };
  const effectiveRate = (params.totalTax / params.grossIncome) * 100;
  return {
    grossIncome: params.grossIncome,
    totalTax: params.totalTax,
    effectiveRate,
    netIncome: params.grossIncome - params.totalTax,
  };
}

export { annualFromMonthly, monthlyFromAnnual };
