export function monthlyLoanPayment(input: {
  principal: number;
  annualRatePercent: number;
  termYears: number;
}): { payment: number; totalPaid: number; totalInterest: number } | { error: string } {
  const { principal, annualRatePercent, termYears } = input;
  if (principal <= 0) return { error: "Principal must be positive." };
  if (termYears <= 0) return { error: "Term must be positive." };
  const n = Math.round(termYears * 12);
  if (n < 1) return { error: "Term too short." };
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const payment = principal / n;
    return { payment, totalPaid: principal, totalInterest: 0 };
  }
  const pow = (1 + r) ** n;
  const payment = (principal * r * pow) / (pow - 1);
  const totalPaid = payment * n;
  return { payment, totalPaid, totalInterest: totalPaid - principal };
}

export type AmortizationRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export function amortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termYears: number,
  maxMonths?: number,
): AmortizationRow[] | { error: string } {
  const cap = maxMonths ?? Math.round(termYears * 12);
  const pay = monthlyLoanPayment({ principal, annualRatePercent, termYears });
  if ("error" in pay) return pay;
  const n = Math.round(termYears * 12);
  if (n < 1) return { error: "Term too short." };
  const r = annualRatePercent / 100 / 12;
  const rows: AmortizationRow[] = [];
  let balance = principal;
  const monthly = pay.payment;
  const limit = Math.min(n, cap);

  for (let m = 1; m <= limit; m++) {
    if (r === 0) {
      const p = principal / n;
      balance = Math.max(0, balance - p);
      rows.push({ month: m, payment: monthly, interest: 0, principal: p, balance });
      continue;
    }
    const interest = balance * r;
    const principalPmt = monthly - interest;
    balance = Math.max(0, balance - principalPmt);
    rows.push({
      month: m,
      payment: monthly,
      interest,
      principal: principalPmt,
      balance,
    });
  }

  return rows;
}

/** Balance at end of each month for charting (full term, can be large). */
export function loanBalanceOverTime(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): { month: number; balance: number }[] | { error: string } {
  const full = amortizationSchedule(principal, annualRatePercent, termYears, undefined);
  if ("error" in full) return full;
  return full.map((row) => ({ month: row.month, balance: row.balance }));
}
