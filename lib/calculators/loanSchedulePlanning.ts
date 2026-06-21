import {
  amortizationSchedule,
  amortizationTotals,
  monthlyLoanPayment,
  type AmortizationRow,
} from "./loanPayment";

export type MonthlyBreakdown = {
  month: number;
  openingBalance: number;
  emi: number;
  interest: number;
  principal: number;
  closingBalance: number;
  interestSharePercent: number;
  principalSharePercent: number;
};

export type LoanTimelineMilestone = {
  label: string;
  month: number;
  dateLabel: string | null;
  balance: number;
  cumulativePrincipal: number;
};

export type PaymentCalendarEntry = {
  month: number;
  dateLabel: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

export type EmiScheduleSummary = {
  emi: number;
  termMonths: number;
  totalPaid: number;
  totalInterest: number;
  rows: AmortizationRow[];
};

export function parseIsoDate(input: string): { date: Date } | { error: string } {
  const trimmed = input.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return { error: "Enter a valid start date (YYYY-MM-DD)." };
  }
  const [y, m, d] = trimmed.split("-").map(Number);
  const date = new Date(y!, m! - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m! - 1 || date.getDate() !== d) {
    return { error: "Enter a valid calendar date." };
  }
  return { date };
}

export function parsePaymentDay(input: string): { day: number } | { error: string } {
  const n = Number(input);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 28) {
    return { error: "Payment day must be an integer from 1 to 28." };
  }
  return { day: n };
}

export function formatScheduleDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function paymentDateForMonth(startDate: Date, month: number, paymentDay: number): Date {
  const base = new Date(startDate);
  base.setDate(1);
  base.setMonth(base.getMonth() + month - 1);
  const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  base.setDate(Math.min(paymentDay, lastDay));
  return base;
}

export function buildEmiSchedule(params: {
  principal: number;
  apr: number;
  termMonths: number;
  bankPennyRounding?: boolean;
}): EmiScheduleSummary | { error: string } {
  const { principal, apr, termMonths, bankPennyRounding } = params;
  const base = monthlyLoanPayment({ principal, annualRatePercent: apr, termMonths });
  if ("error" in base) return base;
  const rows = amortizationSchedule(principal, apr, { termMonths }, undefined, bankPennyRounding);
  if ("error" in rows) return rows;
  const totals = amortizationTotals(rows);
  return {
    emi: base.payment,
    termMonths,
    totalPaid: totals.totalPaid,
    totalInterest: totals.totalInterest,
    rows,
  };
}

export function buildMonthlyBreakdown(params: {
  principal: number;
  apr: number;
  termMonths: number;
  month: number;
  bankPennyRounding?: boolean;
}): MonthlyBreakdown | { error: string } {
  const schedule = buildEmiSchedule(params);
  if ("error" in schedule) return schedule;
  const month = Math.min(Math.max(1, params.month), schedule.rows.length);
  const row = schedule.rows[month - 1]!;
  const openingBalance = month === 1 ? params.principal : schedule.rows[month - 2]!.balance;
  const interestSharePercent = row.payment > 0 ? (row.interest / row.payment) * 100 : 0;
  const principalSharePercent = row.payment > 0 ? (row.principal / row.payment) * 100 : 0;
  return {
    month,
    openingBalance,
    emi: row.payment,
    interest: row.interest,
    principal: row.principal,
    closingBalance: row.balance,
    interestSharePercent,
    principalSharePercent,
  };
}

export function buildLoanTimeline(params: {
  principal: number;
  apr: number;
  termMonths: number;
  startDate?: Date;
  paymentDay?: number;
  bankPennyRounding?: boolean;
}): { milestones: LoanTimelineMilestone[]; schedule: EmiScheduleSummary } | { error: string } {
  const schedule = buildEmiSchedule(params);
  if ("error" in schedule) return schedule;
  const { rows } = schedule;
  const paymentDay = params.paymentDay ?? params.startDate?.getDate() ?? 1;
  const targets = [
    { label: "First EMI", fraction: 0 },
    { label: "25% principal repaid", fraction: 0.25 },
    { label: "50% principal repaid", fraction: 0.5 },
    { label: "75% principal repaid", fraction: 0.75 },
    { label: "Final EMI", fraction: 1 },
  ];

  let cumulativePrincipal = 0;
  const milestones: LoanTimelineMilestone[] = [];
  let targetIdx = 0;

  for (const row of rows) {
    cumulativePrincipal += row.principal;
    while (targetIdx < targets.length) {
      const target = targets[targetIdx]!;
      const reached =
        target.fraction === 0
          ? row.month === 1
          : target.fraction === 1
            ? row.month === rows.length
            : cumulativePrincipal >= params.principal * target.fraction;
      if (!reached) break;
      milestones.push({
        label: target.label,
        month: row.month,
        dateLabel: params.startDate ? formatScheduleDate(paymentDateForMonth(params.startDate, row.month, paymentDay)) : null,
        balance: row.balance,
        cumulativePrincipal,
      });
      targetIdx++;
    }
  }

  return { milestones, schedule };
}

export function buildPaymentCalendar(params: {
  principal: number;
  apr: number;
  termMonths: number;
  startDate: Date;
  paymentDay: number;
  bankPennyRounding?: boolean;
}): { entries: PaymentCalendarEntry[]; schedule: EmiScheduleSummary } | { error: string } {
  const schedule = buildEmiSchedule(params);
  if ("error" in schedule) return schedule;
  const entries = schedule.rows.map((row) => ({
    month: row.month,
    dateLabel: formatScheduleDate(paymentDateForMonth(params.startDate, row.month, params.paymentDay)),
    emi: row.payment,
    principal: row.principal,
    interest: row.interest,
    balance: row.balance,
  }));
  return { entries, schedule };
}
