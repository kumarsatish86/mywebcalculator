import type { AmortizationRow } from "./loanPayment";
import { roundCurrency } from "./roundMoney";

/**
 * Month-by-month loan with fixed contractual EMI (from standard amortization),
 * optional fixed extra principal each month, and optional EMI step-up once per year.
 */
export function simulateLoanWithOptions(params: {
  principal: number;
  annualRatePercent: number;
  contractualEmi: number;
  extraPrincipalMonthly?: number;
  stepUpPercentPerYear?: number;
  maxMonths?: number;
  /** Round interest, principal, payment, and balance to currency cents each month. */
  bankPennyRounding?: boolean;
}):
  | { rows: AmortizationRow[]; totalPaid: number; totalInterest: number; monthCount: number }
  | { error: string } {
  const {
    principal,
    annualRatePercent,
    contractualEmi,
    extraPrincipalMonthly = 0,
    stepUpPercentPerYear = 0,
    maxMonths = 1200,
    bankPennyRounding = false,
  } = params;

  if (!Number.isFinite(principal) || principal <= 0) return { error: "Principal must be positive." };
  if (!Number.isFinite(contractualEmi) || contractualEmi <= 0) return { error: "EMI must be positive." };
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return { error: "APR must be zero or positive." };
  if (extraPrincipalMonthly < 0 || !Number.isFinite(extraPrincipalMonthly)) {
    return { error: "Extra principal must be zero or positive." };
  }
  if (!Number.isFinite(stepUpPercentPerYear)) return { error: "Step-up rate invalid." };

  const r = annualRatePercent / 100 / 12;
  let balance = bankPennyRounding ? roundCurrency(principal) : principal;
  let emi = contractualEmi;
  const rows: AmortizationRow[] = [];
  let totalPaid = 0;
  let totalInterest = 0;

  for (let m = 1; m <= maxMonths && balance > 1e-6; m++) {
    if (m > 1 && stepUpPercentPerYear !== 0 && (m - 1) % 12 === 0) {
      emi *= 1 + stepUpPercentPerYear / 100;
      if (bankPennyRounding) emi = roundCurrency(emi);
    }

    const interestAccrued =
      r === 0 ? 0 : bankPennyRounding ? roundCurrency(balance * r) : balance * r;
    const scheduled = bankPennyRounding
      ? roundCurrency(emi + extraPrincipalMonthly)
      : emi + extraPrincipalMonthly;

    if (scheduled < interestAccrued - 1e-9) {
      return {
        error:
          "Scheduled payment cannot cover interest—increase EMI or extra payment, or lower the rate.",
      };
    }

    let principalPart = scheduled - interestAccrued;
    if (bankPennyRounding) principalPart = roundCurrency(principalPart);

    if (principalPart > balance) {
      principalPart = bankPennyRounding ? roundCurrency(balance) : balance;
    }

    let payment = interestAccrued + principalPart;
    if (bankPennyRounding) payment = roundCurrency(payment);

    balance = bankPennyRounding
      ? roundCurrency(balance - principalPart)
      : Math.max(0, balance - principalPart);
    totalInterest += interestAccrued;
    totalPaid += payment;

    rows.push({
      month: m,
      payment,
      interest: interestAccrued,
      principal: principalPart,
      balance,
    });
  }

  const residualTol = bankPennyRounding ? 0.06 : 0.02;
  if (balance > residualTol) {
    return {
      error: `Loan would not fully amortize within ${maxMonths} months with these settings.`,
    };
  }

  return { rows, totalPaid, totalInterest, monthCount: rows.length };
}
