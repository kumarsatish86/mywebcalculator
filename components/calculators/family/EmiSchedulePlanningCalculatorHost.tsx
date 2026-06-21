"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { mwcTrack } from "@/lib/analytics/mwcTrack";
import { amortizationRowsToCsv, buildLoanCsvMetadata, downloadTextFile } from "@/lib/calculators/loanCsv";
import { formatLoanMoney, type LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import { parseAprPercent, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import type { LoanTermInput } from "@/lib/calculators/loanPayment";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import type { AmortizationRow } from "@/lib/calculators/loanPayment";
import {
  buildEmiSchedule,
  buildLoanTimeline,
  buildMonthlyBreakdown,
  buildPaymentCalendar,
  parseIsoDate,
  parsePaymentDay,
  type PaymentCalendarEntry,
} from "@/lib/calculators/loanSchedulePlanning";

type SchedulePlanningSlug =
  | "emi-schedule-generator"
  | "monthly-payment-breakdown-calculator"
  | "loan-timeline-calculator"
  | "payment-calendar-generator";

type ScenarioConfig = {
  title: string;
  description: string;
  monthLabel?: string;
  monthDefault?: string;
  monthHint?: string;
  dateLabel?: string;
  dateDefault?: string;
  dateHint?: string;
  dayLabel?: string;
  dayDefault?: string;
  dayHint?: string;
};

const AMORT_PREVIEW = 24;

function defaultStartDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const CONFIG: Record<SchedulePlanningSlug, ScenarioConfig> = {
  "emi-schedule-generator": {
    title: "EMI schedule generator",
    description: "Generate a full month-by-month EMI schedule with principal, interest, and remaining balance.",
  },
  "monthly-payment-breakdown-calculator": {
    title: "Monthly payment breakdown calculator",
    description: "See how one EMI splits between interest and principal, with opening and closing balances.",
    monthLabel: "Payment month",
    monthDefault: "1",
    monthHint: "Which EMI month to inspect (1 = first payment).",
  },
  "loan-timeline-calculator": {
    title: "Loan timeline calculator",
    description: "Map key repayment milestones from first EMI through principal milestones to the final payment.",
    dateLabel: "First EMI date",
    dateDefault: defaultStartDate(),
    dateHint: "Optional — adds calendar dates to each milestone.",
  },
  "payment-calendar-generator": {
    title: "Payment calendar generator",
    description: "Build a dated payment calendar from your first EMI through loan closure.",
    dateLabel: "First EMI date",
    dateDefault: defaultStartDate(),
    dateHint: "Starting date for the first scheduled payment.",
    dayLabel: "Payment day of month",
    dayDefault: "1",
    dayHint: "Use 1–28 so every month has a valid due date.",
  },
};

type ScheduleRow = AmortizationRow | PaymentCalendarEntry;

function ScheduleTable({
  slug,
  rows,
  currency,
  showAll,
  onToggleShowAll,
  onDownloadCsv,
  gapNote,
}: {
  slug: string;
  rows: ScheduleRow[];
  currency: LoanCurrencyCode;
  showAll: boolean;
  onToggleShowAll: () => void;
  onDownloadCsv?: () => void;
  gapNote?: boolean;
}) {
  const isCalendar = rows.length > 0 && "dateLabel" in rows[0]!;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-[var(--muted)]">
          {rows.length} payments
          {gapNote ? " · preview: first & last 24 rows" : ""}
        </p>
        {rows.length > AMORT_PREVIEW * 2 ? (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40"
          >
            {showAll ? "Show preview only" : "Show all rows"}
          </button>
        ) : null}
        {onDownloadCsv ? (
          <button
            type="button"
            onClick={onDownloadCsv}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)]/40"
          >
            Download CSV
          </button>
        ) : null}
      </div>
      <div className="max-h-[28rem] overflow-auto rounded-xl border border-[var(--border)]">
        {gapNote ? (
          <p className="border-b border-[var(--border)] bg-[var(--input-bg)]/50 px-3 py-2 text-center text-xs text-[var(--muted)]">
            … middle months omitted in preview …
          </p>
        ) : null}
        <table className="w-full min-w-[520px] text-left text-xs sm:text-sm">
          <thead className="sticky top-0 z-[1] border-b border-[var(--border)] bg-[var(--input-bg)]/90 backdrop-blur-sm">
            <tr>
              <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">#</th>
              {isCalendar ? (
                <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Due date</th>
              ) : null}
              <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Payment</th>
              <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Principal</th>
              <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Interest</th>
              <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className="border-b border-[var(--border)]/80 last:border-0">
                <td className="px-2 py-1.5 font-mono text-[var(--text)] sm:px-3">{row.month}</td>
                {isCalendar ? (
                  <td className="px-2 py-1.5 text-[var(--muted)] sm:px-3">{(row as PaymentCalendarEntry).dateLabel}</td>
                ) : null}
                <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">
                  {formatLoanMoney("payment" in row ? row.payment : row.emi, currency)}
                </td>
                <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">{formatLoanMoney(row.principal, currency)}</td>
                <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">{formatLoanMoney(row.interest, currency)}</td>
                <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">{formatLoanMoney(row.balance, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EmiSchedulePlanningCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as SchedulePlanningSlug] ?? CONFIG["emi-schedule-generator"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [month, setMonth] = useState(useLoanInitialInput(LOAN_URL.U, config.monthDefault ?? "1"));
  const [startDate, setStartDate] = useState(useLoanInitialInput(LOAN_URL.R, config.dateDefault ?? defaultStartDate()));
  const [paymentDay, setPaymentDay] = useState(useLoanInitialInput(LOAN_URL.X, config.dayDefault ?? "1"));
  const [showAll, setShowAll] = useState(false);

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.U]: month,
      [LOAN_URL.R]: startDate,
      [LOAN_URL.X]: paymentDay,
    }),
    [principal, apr, termRaw, month, startDate, paymentDay],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, month, startDate, paymentDay, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    const term: LoanTermInput = { termMonths: t0.value };
    const slugKey = slug as SchedulePlanningSlug;
    const baseArgs = {
      principal: p0.value,
      apr: a0.value,
      termMonths: t0.value,
      bankPennyRounding,
    };

    if (slugKey === "emi-schedule-generator") {
      const schedule = buildEmiSchedule(baseArgs);
      if ("error" in schedule) return { err: schedule.error };
      return {
        err: null,
        term,
        schedule,
        result: {
          headline: formatLoanMoney(schedule.emi, currency),
          headlineLabel: "Monthly EMI",
          rows: [
            ["Payments", `${schedule.rows.length}`],
            ["Total paid", formatLoanMoney(schedule.totalPaid, currency)],
            ["Total interest", formatLoanMoney(schedule.totalInterest, currency)],
          ],
          tableRows: schedule.rows,
        },
      };
    }

    if (slugKey === "monthly-payment-breakdown-calculator") {
      const when = parseTermToMonths(month, "months", "Payment month");
      if (!when.ok) return { err: when.error };
      const breakdown = buildMonthlyBreakdown({ ...baseArgs, month: when.value });
      if ("error" in breakdown) return { err: breakdown.error };
      const schedule = buildEmiSchedule(baseArgs);
      if ("error" in schedule) return { err: schedule.error };
      return {
        err: null,
        term,
        schedule,
        result: {
          headline: formatLoanMoney(breakdown.emi, currency),
          headlineLabel: `Month ${breakdown.month} EMI`,
          rows: [
            ["Opening balance", formatLoanMoney(breakdown.openingBalance, currency)],
            ["Interest portion", `${formatLoanMoney(breakdown.interest, currency)} (${breakdown.interestSharePercent.toFixed(1)}%)`],
            ["Principal portion", `${formatLoanMoney(breakdown.principal, currency)} (${breakdown.principalSharePercent.toFixed(1)}%)`],
            ["Closing balance", formatLoanMoney(breakdown.closingBalance, currency)],
          ],
        },
      };
    }

    if (slugKey === "loan-timeline-calculator") {
      const dateParsed = startDate.trim() ? parseIsoDate(startDate) : { date: undefined as Date | undefined };
      if ("error" in dateParsed) return { err: dateParsed.error };
      const dayParsed = dateParsed.date ? parsePaymentDay(String(dateParsed.date.getDate())) : { day: 1 };
      if ("error" in dayParsed) return { err: dayParsed.error };
      const timeline = buildLoanTimeline({
        ...baseArgs,
        startDate: dateParsed.date,
        paymentDay: dayParsed.day,
      });
      if ("error" in timeline) return { err: timeline.error };
      return {
        err: null,
        term,
        schedule: timeline.schedule,
        result: {
          headline: `${timeline.milestones.length} milestones`,
          headlineLabel: "Repayment timeline",
          rows: timeline.milestones.map((m) => [
            m.label,
            m.dateLabel ? `Month ${m.month} · ${m.dateLabel}` : `Month ${m.month}`,
          ]),
          milestones: timeline.milestones,
        },
      };
    }

    const dateParsed = parseIsoDate(startDate);
    const dayParsed = parsePaymentDay(paymentDay);
    if ("error" in dateParsed) return { err: dateParsed.error };
    if ("error" in dayParsed) return { err: dayParsed.error };
    const calendar = buildPaymentCalendar({
      ...baseArgs,
      startDate: dateParsed.date,
      paymentDay: dayParsed.day,
    });
    if ("error" in calendar) return { err: calendar.error };
    return {
      err: null,
      term,
      schedule: calendar.schedule,
      result: {
        headline: `${calendar.entries.length} due dates`,
        headlineLabel: "Payment calendar",
        rows: [
          ["First due date", calendar.entries[0]?.dateLabel ?? "—"],
          ["Final due date", calendar.entries.at(-1)?.dateLabel ?? "—"],
          ["Monthly EMI", formatLoanMoney(calendar.schedule.emi, currency)],
          ["Total interest", formatLoanMoney(calendar.schedule.totalInterest, currency)],
        ],
        tableRows: calendar.entries,
      },
    };
  }, [principal, apr, termRaw, termMode, month, startDate, paymentDay, slug, currency, bankPennyRounding]);

  const { visibleRows, gapNote } = useMemo(() => {
    const tableRows = parsed.err ? null : parsed.result?.tableRows;
    if (!tableRows?.length) return { visibleRows: [] as ScheduleRow[], gapNote: false };
    if (showAll || tableRows.length <= AMORT_PREVIEW * 2) return { visibleRows: tableRows, gapNote: false };
    const head = tableRows.slice(0, AMORT_PREVIEW);
    const tail = tableRows.slice(-AMORT_PREVIEW);
    if (tail.length && head[head.length - 1]!.month >= tail[0]!.month) {
      return { visibleRows: tableRows, gapNote: false };
    }
    return { visibleRows: [...head, ...tail], gapNote: true };
  }, [parsed, showAll]);

  const showMonth = Boolean(config.monthLabel);
  const showDate = Boolean(config.dateLabel);
  const showDay = Boolean(config.dayLabel);
  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${slug}-form-error`;
  const result = parsed.err ? null : parsed.result;
  const scheduleRows = parsed.err ? null : parsed.schedule?.rows;

  const downloadCsv = () => {
    if (!scheduleRows?.length || parsed.err) return;
    mwcTrack("loan_csv_download", { tool: slug });
    downloadTextFile(
      `${slug}.csv`,
      `${buildLoanCsvMetadata({
        principal: Number(principal),
        aprPercent: Number(apr),
        termMonths: parsed.term?.termMonths ?? scheduleRows.length,
        currency,
        bankPennyRounding,
      })}${amortizationRowsToCsv(scheduleRows)}`,
    );
  };

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${principal}-${apr}-${termRaw}-${month}-${startDate}-${paymentDay}-${showAll}-${currency}-${bankPennyRounding}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onPrintSchedule={result?.tableRows ? () => window.print() : undefined}
            onReset={() => {
              setPrincipal("25000");
              setApr("6.5");
              setTermRaw("5");
              setMonth(config.monthDefault ?? "1");
              setStartDate(config.dateDefault ?? defaultStartDate());
              setPaymentDay(config.dayDefault ?? "1");
              setShowAll(false);
            }}
            getSummary={() =>
              parsed.err || !result
                ? `${config.title}: ${parsed.err}`
                : `${config.title}: ${result.headlineLabel} ${result.headline}. Principal ${principal}, APR ${apr}%, term ${termRaw}.`
            }
          />
        }
        result={
          parsed.err || !result ? (
            <p id={`${slug}-result-error`} className="text-sm font-medium text-rose-700" role="alert">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">{result.headlineLabel}</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {result.headline}
                </p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                {result.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="text-right font-mono text-[var(--text)]">{value}</span>
                  </div>
                ))}
              </div>
              {result.tableRows && visibleRows.length ? (
                <ScheduleTable
                  slug={slug}
                  rows={visibleRows}
                  currency={currency}
                  showAll={showAll}
                  gapNote={gapNote}
                  onToggleShowAll={() => {
                    setShowAll((s) => {
                      mwcTrack("loan_amort_preview_toggle", { tool: slug, expanded: !s });
                      return !s;
                    });
                  }}
                  onDownloadCsv={slug === "emi-schedule-generator" || slug === "payment-calendar-generator" ? downloadCsv : undefined}
                />
              ) : null}
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${slug}-p`}>Principal</FieldLabel>
            <FieldInput id={`${slug}-p`} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-apr`}>APR %</FieldLabel>
            <FieldInput id={`${slug}-apr`} inputMode="decimal" value={apr} onChange={(e) => setApr(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-term`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput id={`${slug}-term`} inputMode="decimal" value={termRaw} onChange={(e) => setTermRaw(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>

        {(showMonth || showDate || showDay) ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-3">
            {showMonth ? (
              <div>
                <FieldLabel htmlFor={`${slug}-month`}>{config.monthLabel}</FieldLabel>
                <FieldInput id={`${slug}-month`} inputMode="numeric" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.monthHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.monthHint}</p> : null}
              </div>
            ) : null}
            {showDate ? (
              <div>
                <FieldLabel htmlFor={`${slug}-date`}>{config.dateLabel}</FieldLabel>
                <FieldInput id={`${slug}-date`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.dateHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.dateHint}</p> : null}
              </div>
            ) : null}
            {showDay ? (
              <div>
                <FieldLabel htmlFor={`${slug}-day`}>{config.dayLabel}</FieldLabel>
                <FieldInput id={`${slug}-day`} inputMode="numeric" value={paymentDay} onChange={(e) => setPaymentDay(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.dayHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.dayHint}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
        {!parsed.err && parsed.term && scheduleRows ? (
          <UserLoanBalanceMini
            principal={Number(principal)}
            apr={Number(apr)}
            term={parsed.term}
            currency={currency}
            balanceSeries={scheduleRows.map((row) => ({ month: row.month, balance: row.balance }))}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </>
  );
}
