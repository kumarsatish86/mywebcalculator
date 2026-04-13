import { monthlyLoanPayment } from "./loanPayment";

/** Monthly payment at given monthly interest rate r (decimal per month), n months. */
function paymentFromRate(principal: number, r: number, n: number): number {
  if (principal <= 0 || n < 1) return NaN;
  if (r <= 1e-15) return principal / n;
  const pow = (1 + r) ** n;
  return (principal * r * pow) / (pow - 1);
}

export function principalFromEmi(
  emi: number,
  annualRatePercent: number,
  termMonths: number,
): { principal: number } | { error: string } {
  const n = Math.round(termMonths);
  if (!Number.isFinite(n) || n < 1) return { error: "Term must be at least one month." };
  if (!Number.isFinite(emi) || emi <= 0) return { error: "EMI must be positive." };
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const p = emi * n;
    if (p <= 0) return { error: "Invalid inputs." };
    return { principal: p };
  }
  const pow = (1 + r) ** n;
  const principal = (emi * (pow - 1)) / (r * pow);
  if (!Number.isFinite(principal) || principal <= 0) return { error: "Could not compute loan amount." };
  return { principal };
}

export function termYearsFromEmi(
  principal: number,
  emi: number,
  annualRatePercent: number,
): { years: number; months: number } | { error: string } {
  if (!Number.isFinite(principal) || principal <= 0) return { error: "Principal must be positive." };
  if (!Number.isFinite(emi) || emi <= 0) return { error: "EMI must be positive." };
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const months = principal / emi;
    if (months < 1 || !Number.isFinite(months)) return { error: "EMI too large for this principal." };
    return { years: months / 12, months };
  }
  const minPay = principal * r;
  if (emi <= minPay) {
    return { error: "EMI must be greater than first-month interest for this rate." };
  }
  const ratio = emi / (emi - principal * r);
  if (ratio <= 1) return { error: "Could not solve tenure." };
  const n = Math.log(ratio) / Math.log(1 + r);
  if (!Number.isFinite(n) || n < 1) return { error: "Could not solve tenure." };
  return { years: n / 12, months: n };
}

export function annualRatePercentFromEmi(
  principal: number,
  emi: number,
  termMonths: number,
): { annualRatePercent: number } | { error: string } {
  const n = Math.round(termMonths);
  if (!Number.isFinite(principal) || principal <= 0) return { error: "Principal must be positive." };
  if (!Number.isFinite(emi) || emi <= 0) return { error: "EMI must be positive." };
  if (!Number.isFinite(n) || n < 1) return { error: "Term must be at least one month." };

  const payZero = principal / n;
  if (emi < payZero - 1e-9) {
    return { error: "EMI is below the payment for a 0% loan—check your numbers." };
  }
  if (emi <= payZero + 1e-9) {
    return { annualRatePercent: 0 };
  }

  let hi = 0.01;
  for (let k = 0; k < 30 && paymentFromRate(principal, hi, n) < emi; k++) {
    hi *= 2;
    if (hi > 5) return { error: "Could not find an interest rate in a plausible range." };
  }

  if (paymentFromRate(principal, hi, n) < emi) {
    return {
      error:
        "EMI is too high for this principal and term—no nominal rate found up to our search limit. Check inputs.",
    };
  }

  let lo = 0;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const p = paymentFromRate(principal, mid, n);
    if (p > emi) hi = mid;
    else lo = mid;
  }
  const monthlyR = (lo + hi) / 2;
  return { annualRatePercent: monthlyR * 12 * 100 };
}

export type FlatVsReducingResult = {
  reducing: { emi: number; totalPaid: number; totalInterest: number };
  flat: { emi: number; totalPaid: number; totalInterest: number };
  interestDifference: number;
  totalPaidDifference: number;
  /** Nominal reducing APR that would produce the same EMI as the flat quote (for comparison). */
  flatEquivalentReducingApr: number | null;
};

export function compareFlatVsReducing(input: {
  principal: number;
  flatAnnualPercent: number;
  reducingAprPercent: number;
  termMonths: number;
}): FlatVsReducingResult | { error: string } {
  const { principal, flatAnnualPercent, reducingAprPercent, termMonths } = input;
  const n = Math.round(termMonths);
  if (!Number.isFinite(principal) || principal <= 0) return { error: "Principal must be positive." };
  if (!Number.isFinite(n) || n < 1) return { error: "Term must be at least one month." };

  const reducing = monthlyLoanPayment({
    principal,
    annualRatePercent: reducingAprPercent,
    termMonths: n,
  });
  if ("error" in reducing) return reducing;

  const termYearsExact = n / 12;
  const totalInterestFlat = principal * (flatAnnualPercent / 100) * termYearsExact;
  const totalPaidFlat = principal + totalInterestFlat;
  const flatEmi = totalPaidFlat / n;

  const implied = annualRatePercentFromEmi(principal, flatEmi, n);
  const flatEquivalentReducingApr = "error" in implied ? null : implied.annualRatePercent;

  const interestDifference = totalInterestFlat - reducing.totalInterest;
  const totalPaidDifference = totalPaidFlat - reducing.totalPaid;

  return {
    reducing: {
      emi: reducing.payment,
      totalPaid: reducing.totalPaid,
      totalInterest: reducing.totalInterest,
    },
    flat: {
      emi: flatEmi,
      totalPaid: totalPaidFlat,
      totalInterest: totalInterestFlat,
    },
    interestDifference,
    totalPaidDifference,
    flatEquivalentReducingApr,
  };
}

export function totalInterestOnly(input: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): { totalInterest: number; totalPaid: number; emi: number; termMonths: number } | { error: string } {
  const r = monthlyLoanPayment(input);
  if ("error" in r) return r;
  return {
    emi: r.payment,
    totalPaid: r.totalPaid,
    totalInterest: r.totalInterest,
    termMonths: r.termMonths,
  };
}
