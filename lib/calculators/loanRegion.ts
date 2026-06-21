import { monthlyLoanPayment } from "./loanPayment";
import { roundCurrency } from "./roundMoney";

export type GstLoanResult = {
  baseAmount: number;
  gstAmount: number;
  totalCost: number;
  downPayment: number;
  loanPrincipal: number;
  emi: number;
  totalPaid: number;
  totalInterest: number;
  termMonths: number;
};

export function computeGstPlusLoan(params: {
  baseAmount: number;
  gstPercent: number;
  downPayment: number;
  apr: number;
  termMonths: number;
  bankPennyRounding?: boolean;
}): GstLoanResult | { error: string } {
  const { baseAmount, gstPercent, downPayment, apr, termMonths, bankPennyRounding } = params;
  const gstAmount = bankPennyRounding
    ? roundCurrency(baseAmount * (gstPercent / 100))
    : baseAmount * (gstPercent / 100);
  const totalCost = bankPennyRounding ? roundCurrency(baseAmount + gstAmount) : baseAmount + gstAmount;
  const loanPrincipal = bankPennyRounding
    ? roundCurrency(Math.max(0, totalCost - downPayment))
    : Math.max(0, totalCost - downPayment);

  if (loanPrincipal <= 0) {
    return { error: "Down payment covers the full cost including GST — no loan amount remains." };
  }

  const loan = monthlyLoanPayment({
    principal: loanPrincipal,
    annualRatePercent: apr,
    termMonths,
  });
  if ("error" in loan) return loan;

  return {
    baseAmount,
    gstAmount,
    totalCost,
    downPayment,
    loanPrincipal,
    emi: bankPennyRounding ? roundCurrency(loan.payment) : loan.payment,
    totalPaid: loan.totalPaid,
    totalInterest: loan.totalInterest,
    termMonths: loan.termMonths,
  };
}
