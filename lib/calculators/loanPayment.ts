import { roundCurrency } from "./roundMoney";

export type LoanTermInput = {
  /** Whole months; preferred when set (rounded). */
  termMonths?: number;
  /** Used when `termMonths` is omitted; converted with round(years × 12). */
  termYears?: number;
};

export function resolveLoanTermMonths(input: LoanTermInput): number | { error: string } {
  if (input.termMonths != null && Number.isFinite(input.termMonths)) {
    const n = Math.round(input.termMonths);
    if (n < 1) return { error: "Term must be at least one month." };
    if (n > 1200) return { error: "Term too long for this calculator." };
    return n;
  }
  if (input.termYears == null || !Number.isFinite(input.termYears)) {
    return { error: "Enter a loan term." };
  }
  if (input.termYears <= 0) return { error: "Term must be positive." };
  const n = Math.round(input.termYears * 12);
  if (n < 1) return { error: "Term too short." };
  if (n > 1200) return { error: "Term too long for this calculator." };
  return n;
}

export function monthlyLoanPayment(
  input: {
    principal: number;
    annualRatePercent: number;
  } & LoanTermInput,
): { payment: number; totalPaid: number; totalInterest: number; termMonths: number } | { error: string } {
  const { principal, annualRatePercent } = input;
  if (!Number.isFinite(principal) || principal <= 0) return { error: "Principal must be a positive number." };
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    return { error: "APR must be zero or a positive number." };
  }
  const nRes = resolveLoanTermMonths(input);
  if (typeof nRes !== "number") return nRes;
  const n = nRes;

  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const payment = principal / n;
    return { payment, totalPaid: principal, totalInterest: 0, termMonths: n };
  }
  const pow = (1 + r) ** n;
  const payment = (principal * r * pow) / (pow - 1);
  const totalPaid = payment * n;
  return { payment, totalPaid, totalInterest: totalPaid - principal, termMonths: n };
}

export type AmortizationRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export function amortizationTotals(rows: AmortizationRow[]): {
  totalPaid: number;
  totalInterest: number;
  firstPayment: number;
} {
  if (!rows.length) return { totalPaid: 0, totalInterest: 0, firstPayment: 0 };
  let totalPaid = 0;
  let totalInterest = 0;
  for (const row of rows) {
    totalPaid += row.payment;
    totalInterest += row.interest;
  }
  return { totalPaid, totalInterest, firstPayment: rows[0]!.payment };
}

export function amortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termInput: LoanTermInput,
  maxMonths?: number,
  bankPennyRounding?: boolean,
): AmortizationRow[] | { error: string } {
  const pay = monthlyLoanPayment({ principal, annualRatePercent, ...termInput });
  if ("error" in pay) return pay;
  const n = pay.termMonths;
  const r = annualRatePercent / 100 / 12;
  const limit = Math.min(n, maxMonths ?? n);
  const monthly = pay.payment;

  if (!bankPennyRounding) {
    const rows: AmortizationRow[] = [];
    let balance = principal;
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

  const rows: AmortizationRow[] = [];
  let balance = roundCurrency(principal);

  if (r === 0) {
    const even = roundCurrency(principal / n);
    for (let m = 1; m <= limit; m++) {
      const isLast = m === limit;
      const p = isLast ? roundCurrency(balance) : Math.min(even, roundCurrency(balance));
      const payment = p;
      balance = roundCurrency(balance - p);
      if (balance < 0) balance = 0;
      rows.push({ month: m, payment, interest: 0, principal: p, balance });
    }
    return rows;
  }

  for (let m = 1; m <= limit; m++) {
    const isLast = m === limit;
    const interest = roundCurrency(balance * r);
    let principalPmt: number;
    if (isLast) {
      principalPmt = roundCurrency(balance);
    } else {
      principalPmt = roundCurrency(monthly - interest);
      if (principalPmt < 0) principalPmt = 0;
      if (principalPmt > balance) principalPmt = roundCurrency(balance);
    }
    const payment = roundCurrency(interest + principalPmt);
    balance = roundCurrency(balance - principalPmt);
    if (balance < 0) balance = 0;
    rows.push({ month: m, payment, interest, principal: principalPmt, balance });
  }

  return rows;
}

/** Balance at end of each month for charting (full term, can be large). */
export function loanBalanceOverTime(
  principal: number,
  annualRatePercent: number,
  termInput: LoanTermInput,
  bankPennyRounding?: boolean,
): { month: number; balance: number }[] | { error: string } {
  const full = amortizationSchedule(principal, annualRatePercent, termInput, undefined, bankPennyRounding);
  if ("error" in full) return full;
  return full.map((row) => ({ month: row.month, balance: row.balance }));
}
