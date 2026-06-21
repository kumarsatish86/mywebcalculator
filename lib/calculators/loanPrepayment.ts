import {
  amortizationSchedule,
  amortizationTotals,
  monthlyLoanPayment,
  type AmortizationRow,
} from "./loanPayment";
import { roundCurrency } from "./roundMoney";

export type PrepaymentScenarioResult = {
  rows: AmortizationRow[];
  totalPaid: number;
  totalInterest: number;
  months: number;
};

export type TenureVsEmiComparison = {
  tenurePath: PrepaymentScenarioResult;
  emiPath: {
    newEmi: number;
    totalPaid: number;
    totalInterest: number;
    months: number;
  };
  interestSavedTenure: number;
  interestSavedEmi: number;
  monthsSaved: number;
  emiReduction: number;
};

export type ForeclosureResult = {
  outstanding: number;
  foreclosureFee: number;
  totalClosureAmount: number;
  remainingInterestIfContinued: number;
  interestSaved: number;
  baseTotalInterest: number;
};

export type EarlyClosureResult = {
  outstanding: number;
  optionalFee: number;
  totalPayoff: number;
  remainingInterestIfContinued: number;
  interestSaved: number;
  monthsRemaining: number;
};

function simulateOneTimePrepayment(params: {
  principal: number;
  apr: number;
  baseEmi: number;
  oneTimeMonth: number;
  oneTimeAmount: number;
  bankPennyRounding?: boolean;
}): PrepaymentScenarioResult | { error: string } {
  const { principal, apr, baseEmi, oneTimeMonth, oneTimeAmount, bankPennyRounding = false } = params;
  const r = apr / 100 / 12;
  let balance = bankPennyRounding ? roundCurrency(principal) : principal;
  let emi = bankPennyRounding ? roundCurrency(baseEmi) : baseEmi;
  let totalPaid = 0;
  let totalInterest = 0;
  const rows: AmortizationRow[] = [];

  for (let month = 1; month <= 1200 && balance > 0.01; month++) {
    const interest = bankPennyRounding ? roundCurrency(balance * r) : balance * r;
    if (emi < interest) {
      return { error: "EMI no longer covers monthly interest after prepayment." };
    }
    let principalPaid = emi - interest;
    if (oneTimeMonth === month) principalPaid += oneTimeAmount;
    if (principalPaid > balance) principalPaid = balance;
    const payment = interest + principalPaid;
    balance = bankPennyRounding ? roundCurrency(balance - principalPaid) : Math.max(0, balance - principalPaid);
    totalPaid += payment;
    totalInterest += interest;
    rows.push({ month, payment, interest, principal: principalPaid, balance });
  }

  if (balance > 0.05) {
    return { error: "Loan did not close within 1200 months with these settings." };
  }
  return { rows, totalPaid, totalInterest, months: rows.length };
}

function simulateEmiRecast(params: {
  principal: number;
  apr: number;
  baseEmi: number;
  oneTimeMonth: number;
  oneTimeAmount: number;
  originalTermMonths: number;
  bankPennyRounding?: boolean;
}): { newEmi: number; totalPaid: number; totalInterest: number; months: number } | { error: string } {
  const {
    principal,
    apr,
    baseEmi,
    oneTimeMonth,
    oneTimeAmount,
    originalTermMonths,
    bankPennyRounding = false,
  } = params;
  const r = apr / 100 / 12;
  let balance = bankPennyRounding ? roundCurrency(principal) : principal;
  let totalPaid = 0;
  let totalInterest = 0;
  let newEmi = baseEmi;
  const partMonth = Math.min(Math.max(1, oneTimeMonth), originalTermMonths);

  for (let month = 1; month <= partMonth; month++) {
    const interest = bankPennyRounding ? roundCurrency(balance * r) : balance * r;
    let principalPaid = baseEmi - interest;
    if (month === partMonth) principalPaid += oneTimeAmount;
    if (principalPaid > balance) principalPaid = balance;
    const payment = interest + principalPaid;
    balance = bankPennyRounding ? roundCurrency(balance - principalPaid) : Math.max(0, balance - principalPaid);
    totalPaid += payment;
    totalInterest += interest;
  }

  const remainingMonths = Math.max(1, originalTermMonths - partMonth);
  const recast = monthlyLoanPayment({
    principal: balance,
    annualRatePercent: apr,
    termMonths: remainingMonths,
  });
  if ("error" in recast) return recast;
  newEmi = bankPennyRounding ? roundCurrency(recast.payment) : recast.payment;

  for (let month = partMonth + 1; month <= originalTermMonths && balance > 0.01; month++) {
    const interest = bankPennyRounding ? roundCurrency(balance * r) : balance * r;
    let principalPaid = newEmi - interest;
    if (principalPaid > balance) principalPaid = balance;
    const payment = interest + principalPaid;
    balance = bankPennyRounding ? roundCurrency(balance - principalPaid) : Math.max(0, balance - principalPaid);
    totalPaid += payment;
    totalInterest += interest;
  }

  return { newEmi, totalPaid, totalInterest, months: originalTermMonths };
}

export function computePrepaymentSavings(params: {
  principal: number;
  apr: number;
  termMonths: number;
  prepaymentAmount: number;
  prepaymentMonth: number;
  bankPennyRounding?: boolean;
}):
  | {
      baseEmi: number;
      baseTotalInterest: number;
      scenario: PrepaymentScenarioResult;
      interestSaved: number;
      monthsSaved: number;
    }
  | { error: string } {
  const { principal, apr, termMonths, prepaymentAmount, prepaymentMonth, bankPennyRounding } = params;
  const base = monthlyLoanPayment({ principal, annualRatePercent: apr, termMonths });
  if ("error" in base) return base;
  const baseEmi = bankPennyRounding ? roundCurrency(base.payment) : base.payment;
  const baseSchedule = amortizationSchedule(principal, apr, { termMonths }, undefined, bankPennyRounding);
  if ("error" in baseSchedule) return baseSchedule;
  const baseTotals = amortizationTotals(baseSchedule);

  const scenario = simulateOneTimePrepayment({
    principal,
    apr,
    baseEmi,
    oneTimeMonth: prepaymentMonth,
    oneTimeAmount: prepaymentAmount,
    bankPennyRounding,
  });
  if ("error" in scenario) return scenario;

  return {
    baseEmi,
    baseTotalInterest: baseTotals.totalInterest,
    scenario,
    interestSaved: baseTotals.totalInterest - scenario.totalInterest,
    monthsSaved: termMonths - scenario.months,
  };
}

export function compareTenureVsEmiReduction(params: {
  principal: number;
  apr: number;
  termMonths: number;
  partPaymentAmount: number;
  partPaymentMonth: number;
  bankPennyRounding?: boolean;
}): TenureVsEmiComparison | { error: string } {
  const { principal, apr, termMonths, partPaymentAmount, partPaymentMonth, bankPennyRounding } = params;
  const base = monthlyLoanPayment({ principal, annualRatePercent: apr, termMonths });
  if ("error" in base) return base;
  const baseEmi = bankPennyRounding ? roundCurrency(base.payment) : base.payment;
  const baseSchedule = amortizationSchedule(principal, apr, { termMonths }, undefined, bankPennyRounding);
  if ("error" in baseSchedule) return baseSchedule;
  const baseTotals = amortizationTotals(baseSchedule);

  const tenurePath = simulateOneTimePrepayment({
    principal,
    apr,
    baseEmi,
    oneTimeMonth: partPaymentMonth,
    oneTimeAmount: partPaymentAmount,
    bankPennyRounding,
  });
  if ("error" in tenurePath) return tenurePath;

  const emiPath = simulateEmiRecast({
    principal,
    apr,
    baseEmi,
    oneTimeMonth: partPaymentMonth,
    oneTimeAmount: partPaymentAmount,
    originalTermMonths: termMonths,
    bankPennyRounding,
  });
  if ("error" in emiPath) return emiPath;

  return {
    tenurePath,
    emiPath,
    interestSavedTenure: baseTotals.totalInterest - tenurePath.totalInterest,
    interestSavedEmi: baseTotals.totalInterest - emiPath.totalInterest,
    monthsSaved: termMonths - tenurePath.months,
    emiReduction: baseEmi - emiPath.newEmi,
  };
}

export function computeForeclosure(params: {
  principal: number;
  apr: number;
  termMonths: number;
  closureMonth: number;
  feePercent: number;
  bankPennyRounding?: boolean;
}): ForeclosureResult | { error: string } {
  const { principal, apr, termMonths, closureMonth, feePercent, bankPennyRounding } = params;
  const schedule = amortizationSchedule(principal, apr, { termMonths }, undefined, bankPennyRounding);
  if ("error" in schedule) return schedule;
  const baseTotals = amortizationTotals(schedule);
  const month = Math.min(Math.max(1, closureMonth), schedule.length);
  const outstanding = schedule[month - 1]?.balance ?? 0;
  const foreclosureFee = bankPennyRounding
    ? roundCurrency(outstanding * (feePercent / 100))
    : outstanding * (feePercent / 100);
  const totalClosureAmount = bankPennyRounding
    ? roundCurrency(outstanding + foreclosureFee)
    : outstanding + foreclosureFee;
  const remainingInterestIfContinued = amortizationTotals(schedule.slice(month)).totalInterest;

  return {
    outstanding,
    foreclosureFee,
    totalClosureAmount,
    remainingInterestIfContinued,
    interestSaved: remainingInterestIfContinued,
    baseTotalInterest: baseTotals.totalInterest,
  };
}

export function computeEarlyClosure(params: {
  principal: number;
  apr: number;
  termMonths: number;
  closureMonth: number;
  feePercent?: number;
  bankPennyRounding?: boolean;
}): EarlyClosureResult | { error: string } {
  const { principal, apr, termMonths, closureMonth, feePercent = 0, bankPennyRounding } = params;
  const schedule = amortizationSchedule(principal, apr, { termMonths }, undefined, bankPennyRounding);
  if ("error" in schedule) return schedule;
  const month = Math.min(Math.max(1, closureMonth), schedule.length);
  const outstanding = schedule[month - 1]?.balance ?? 0;
  const optionalFee = bankPennyRounding
    ? roundCurrency(outstanding * (feePercent / 100))
    : outstanding * (feePercent / 100);
  const totalPayoff = bankPennyRounding
    ? roundCurrency(outstanding + optionalFee)
    : outstanding + optionalFee;
  const remainingInterestIfContinued = amortizationTotals(schedule.slice(month)).totalInterest;

  return {
    outstanding,
    optionalFee,
    totalPayoff,
    remainingInterestIfContinued,
    interestSaved: remainingInterestIfContinued,
    monthsRemaining: termMonths - month,
  };
}
