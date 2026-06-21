import { computePrepaymentSavings } from "./loanPrepayment";
import { monthlyLoanPayment } from "./loanPayment";

export type AdvisoryVerdict = "Strong" | "Manageable" | "Stretched" | "High risk";

export type EmiPlanOption = {
  termYears: number;
  termMonths: number;
  emi: number;
  totalInterest: number;
  totalPaid: number;
  fitsBudget: boolean;
};

export type LoanOptimizationOption = {
  label: string;
  totalPaid: number;
  totalInterest: number;
  months: number;
  interestSaved: number;
};

export type TakeLoanVerdict = "Likely sensible" | "Proceed with caution" | "Consider avoiding";

export type LoanRiskBand = "Low" | "Moderate" | "Elevated" | "High";

export function dtiPercent(monthlyDebt: number, grossIncome: number): number {
  if (grossIncome <= 0) return NaN;
  return (monthlyDebt / grossIncome) * 100;
}

export function advisoryVerdictFromDti(dti: number): AdvisoryVerdict {
  if (dti <= 30) return "Strong";
  if (dti <= 36) return "Manageable";
  if (dti <= 43) return "Stretched";
  return "High risk";
}

export function adviseSmartLoan(params: {
  grossIncome: number;
  existingDebt: number;
  principal: number;
  apr: number;
  termMonths: number;
}):
  | {
      emi: number;
      totalInterest: number;
      newDti: number;
      verdict: AdvisoryVerdict;
      tips: string[];
    }
  | { error: string } {
  const loan = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: params.termMonths,
  });
  if ("error" in loan) return loan;

  const newDti = dtiPercent(params.existingDebt + loan.payment, params.grossIncome);
  if (!Number.isFinite(newDti)) return { error: "Gross income must be positive." };

  const verdict = advisoryVerdictFromDti(newDti);
  const tips: string[] = [];
  if (verdict === "Strong" || verdict === "Manageable") {
    tips.push("EMI looks affordable against typical lender DTI bands.");
  }
  if (verdict === "Stretched") {
    tips.push("Consider a longer tenure, smaller loan amount, or paying down existing debt first.");
  }
  if (verdict === "High risk") {
    tips.push("Many lenders may decline or cap the loan at this debt load.");
  }
  if (loan.totalInterest > params.principal * 0.5) {
    tips.push("Total interest is high relative to principal — compare shorter tenures or prepayment options.");
  }

  return {
    emi: loan.payment,
    totalInterest: loan.totalInterest,
    newDti,
    verdict,
    tips,
  };
}

export function generateEmiPlans(params: {
  principal: number;
  apr: number;
  maxAffordableEmi?: number;
  termYearsCandidates?: number[];
}): EmiPlanOption[] | { error: string } {
  const { principal, apr, maxAffordableEmi } = params;
  const candidates = params.termYearsCandidates ?? [5, 10, 15, 20, 25, 30];
  const options: EmiPlanOption[] = [];

  for (const years of candidates) {
    const termMonths = years * 12;
    const loan = monthlyLoanPayment({ principal, annualRatePercent: apr, termMonths });
    if ("error" in loan) continue;
    options.push({
      termYears: years,
      termMonths,
      emi: loan.payment,
      totalInterest: loan.totalInterest,
      totalPaid: loan.totalPaid,
      fitsBudget: maxAffordableEmi == null || loan.payment <= maxAffordableEmi,
    });
  }

  if (!options.length) return { error: "Could not build EMI plans for these inputs." };
  return options;
}

export function pickBestEmiPlan(
  options: EmiPlanOption[],
  maxAffordableEmi?: number,
): EmiPlanOption | null {
  const affordable = maxAffordableEmi != null ? options.filter((o) => o.fitsBudget) : options;
  const pool = affordable.length ? affordable : options;
  return pool.reduce((best, cur) => (cur.totalInterest < best.totalInterest ? cur : best));
}

export function optimizeLoanScenarios(params: {
  principal: number;
  apr: number;
  termMonths: number;
  prepaymentAmount?: number;
  prepaymentMonth?: number;
  alternateTermMonths?: number;
  alternateApr?: number;
  bankPennyRounding?: boolean;
}): { baseInterest: number; options: LoanOptimizationOption[] } | { error: string } {
  const base = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: params.termMonths,
  });
  if ("error" in base) return base;

  const options: LoanOptimizationOption[] = [
    {
      label: "Base loan",
      totalPaid: base.totalPaid,
      totalInterest: base.totalInterest,
      months: params.termMonths,
      interestSaved: 0,
    },
  ];

  if (params.prepaymentAmount != null && params.prepaymentMonth != null && params.prepaymentAmount > 0) {
    const prepay = computePrepaymentSavings({
      principal: params.principal,
      apr: params.apr,
      termMonths: params.termMonths,
      prepaymentAmount: params.prepaymentAmount,
      prepaymentMonth: params.prepaymentMonth,
      bankPennyRounding: params.bankPennyRounding,
    });
    if (!("error" in prepay)) {
      options.push({
        label: "One-time prepayment",
        totalPaid: prepay.scenario.totalPaid,
        totalInterest: prepay.scenario.totalInterest,
        months: prepay.scenario.months,
        interestSaved: prepay.interestSaved,
      });
    }
  }

  if (params.alternateTermMonths != null && params.alternateTermMonths >= 1) {
    const shorter = monthlyLoanPayment({
      principal: params.principal,
      annualRatePercent: params.apr,
      termMonths: params.alternateTermMonths,
    });
    if (!("error" in shorter)) {
      options.push({
        label: "Shorter tenure",
        totalPaid: shorter.totalPaid,
        totalInterest: shorter.totalInterest,
        months: shorter.termMonths,
        interestSaved: base.totalInterest - shorter.totalInterest,
      });
    }
  }

  if (params.alternateApr != null && params.alternateApr >= 0) {
    const lowerRate = monthlyLoanPayment({
      principal: params.principal,
      annualRatePercent: params.alternateApr,
      termMonths: params.termMonths,
    });
    if (!("error" in lowerRate)) {
      options.push({
        label: "Lower rate",
        totalPaid: lowerRate.totalPaid,
        totalInterest: lowerRate.totalInterest,
        months: params.termMonths,
        interestSaved: base.totalInterest - lowerRate.totalInterest,
      });
    }
  }

  return { baseInterest: base.totalInterest, options };
}

export function shouldTakeLoan(params: {
  principal: number;
  apr: number;
  termMonths: number;
  grossIncome: number;
  existingDebt: number;
  alternativeReturnPercent?: number;
}):
  | {
      emi: number;
      totalInterest: number;
      newDti: number;
      verdict: TakeLoanVerdict;
      rationale: string[];
    }
  | { error: string } {
  const loan = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: params.termMonths,
  });
  if ("error" in loan) return loan;

  const newDti = dtiPercent(params.existingDebt + loan.payment, params.grossIncome);
  if (!Number.isFinite(newDti)) return { error: "Gross income must be positive." };

  const rationale: string[] = [];
  let verdict: TakeLoanVerdict = "Likely sensible";

  if (newDti > 43) {
    verdict = "Consider avoiding";
    rationale.push(`Projected DTI ${newDti.toFixed(1)}% exceeds a common 43% lender ceiling.`);
  } else if (newDti > 36) {
    verdict = "Proceed with caution";
    rationale.push(`Projected DTI ${newDti.toFixed(1)}% is in a stretched band for many lenders.`);
  } else {
    rationale.push(`Projected DTI ${newDti.toFixed(1)}% is within typical affordability ranges.`);
  }

  const alt = params.alternativeReturnPercent;
  if (alt != null && Number.isFinite(alt)) {
    if (params.apr > alt + 1) {
      if (verdict === "Likely sensible") verdict = "Proceed with caution";
      rationale.push(
        `Loan rate (${params.apr}%) exceeds your alternative return (${alt}%) — borrowing costs more than the opportunity you described.`,
      );
    } else if (params.apr <= alt) {
      rationale.push(
        `If the alternative return (${alt}%) is reliable after tax and risk, the loan rate (${params.apr}%) may be acceptable relative to that use.`,
      );
    }
  }

  rationale.push(`Total interest over the term: ${loan.totalInterest.toFixed(0)} (currency units).`);

  return {
    emi: loan.payment,
    totalInterest: loan.totalInterest,
    newDti,
    verdict,
    rationale,
  };
}

export function assessLoanRisk(params: {
  grossIncome: number;
  existingDebt: number;
  emi: number;
  apr: number;
  termMonths: number;
  emergencyFundMonths?: number;
}): { score: number; band: LoanRiskBand; factors: string[] } {
  const { grossIncome, existingDebt, emi, apr, termMonths, emergencyFundMonths = 3 } = params;
  const newDti = dtiPercent(existingDebt + emi, grossIncome);
  const emiShare = grossIncome > 0 ? (emi / grossIncome) * 100 : 100;

  let score = 0;
  const factors: string[] = [];

  if (newDti > 50) {
    score += 35;
    factors.push("Very high debt-to-income load.");
  } else if (newDti > 43) {
    score += 25;
    factors.push("DTI above many lender limits.");
  } else if (newDti > 36) {
    score += 15;
    factors.push("DTI in a caution zone.");
  }

  if (emiShare > 40) {
    score += 25;
    factors.push("New EMI alone exceeds 40% of gross income.");
  } else if (emiShare > 30) {
    score += 15;
  }

  if (termMonths > 240) {
    score += 15;
    factors.push("Long tenure increases rate-reset and income-shock exposure.");
  } else if (termMonths > 180) {
    score += 8;
  }

  if (apr > 15) {
    score += 20;
    factors.push("High interest rate amplifies repayment stress.");
  } else if (apr > 10) {
    score += 10;
  }

  if (emergencyFundMonths < 3) {
    score += 15;
    factors.push("Emergency buffer under 3 months of expenses.");
  } else if (emergencyFundMonths < 6) {
    score += 8;
  }

  score = Math.min(100, Math.max(0, score));
  const band: LoanRiskBand =
    score < 25 ? "Low" : score < 50 ? "Moderate" : score < 75 ? "Elevated" : "High";

  return { score, band, factors };
}
