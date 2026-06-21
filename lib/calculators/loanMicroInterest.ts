import { buildMonthlyBreakdown } from "./loanSchedulePlanning";
import { amortizationSchedule, monthlyLoanPayment } from "./loanPayment";

export function computeDailyInterest(params: {
  principal: number;
  apr: number;
  days?: number;
}): { dailyInterest: number; totalForDays: number; days: number } | { error: string } {
  const { principal, apr, days = 1 } = params;
  if (principal <= 0) return { error: "Principal must be positive." };
  if (days < 1) return { error: "Days must be at least 1." };
  const dailyInterest = (principal * (apr / 100)) / 365;
  return { dailyInterest, totalForDays: dailyInterest * days, days };
}

export function computeMonthlyInterest(params: {
  principal: number;
  apr: number;
}): { monthlyInterest: number; annualInterest: number } | { error: string } {
  const { principal, apr } = params;
  if (principal <= 0) return { error: "Principal must be positive." };
  const monthlyInterest = (principal * (apr / 100)) / 12;
  return { monthlyInterest, annualInterest: monthlyInterest * 12 };
}

export function computeSimpleInterest(params: {
  principal: number;
  ratePercent: number;
  timeYears: number;
}): { interest: number; totalAmount: number } | { error: string } {
  const { principal, ratePercent, timeYears } = params;
  if (principal <= 0) return { error: "Principal must be positive." };
  if (timeYears <= 0) return { error: "Time must be positive." };
  const interest = (principal * ratePercent * timeYears) / 100;
  return { interest, totalAmount: principal + interest };
}

export function computeCompoundLoanInterest(params: {
  principal: number;
  apr: number;
  termMonths: number;
  bankPennyRounding?: boolean;
}):
  | {
      emi: number;
      totalInterest: number;
      totalPaid: number;
      simpleInterestFlat: number;
      interestDifference: number;
    }
  | { error: string } {
  const loan = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: params.termMonths,
  });
  if ("error" in loan) return loan;
  const timeYears = params.termMonths / 12;
  const simple = computeSimpleInterest({
    principal: params.principal,
    ratePercent: params.apr,
    timeYears,
  });
  if ("error" in simple) return simple;
  return {
    emi: loan.payment,
    totalInterest: loan.totalInterest,
    totalPaid: loan.totalPaid,
    simpleInterestFlat: simple.interest,
    interestDifference: loan.totalInterest - simple.interest,
  };
}

export function computeInterestPerEmi(params: {
  principal: number;
  apr: number;
  termMonths: number;
  month: number;
  bankPennyRounding?: boolean;
}) {
  return buildMonthlyBreakdown({
    principal: params.principal,
    apr: params.apr,
    termMonths: params.termMonths,
    month: params.month,
    bankPennyRounding: params.bankPennyRounding,
  });
}

export function computeOutstandingBalance(params: {
  principal: number;
  apr: number;
  termMonths: number;
  month: number;
  bankPennyRounding?: boolean;
}): { outstanding: number; emi: number; month: number } | { error: string } {
  const schedule = amortizationSchedule(
    params.principal,
    params.apr,
    { termMonths: params.termMonths },
    undefined,
    params.bankPennyRounding,
  );
  if ("error" in schedule) return schedule;
  const month = Math.min(Math.max(1, params.month), schedule.length);
  const loan = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: params.termMonths,
  });
  if ("error" in loan) return loan;
  return {
    outstanding: schedule[month - 1]!.balance,
    emi: loan.payment,
    month,
  };
}
