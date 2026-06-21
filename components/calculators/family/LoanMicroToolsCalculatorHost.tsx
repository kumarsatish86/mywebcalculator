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
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import {
  computeCompoundLoanInterest,
  computeDailyInterest,
  computeInterestPerEmi,
  computeMonthlyInterest,
  computeOutstandingBalance,
  computeSimpleInterest,
} from "@/lib/calculators/loanMicroInterest";
import { parseAprPercent, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import type { LoanTermInput } from "@/lib/calculators/loanPayment";

type LoanMicroSlug =
  | "daily-interest-calculator"
  | "monthly-interest-calculator"
  | "simple-interest-calculator"
  | "compound-interest-for-loan-calculator"
  | "interest-per-emi-calculator"
  | "outstanding-balance-calculator";

type MicroConfig = {
  title: string;
  description: string;
  showTerm?: boolean;
  showDays?: boolean;
  showMonth?: boolean;
  principalDefault?: string;
  aprDefault?: string;
  termDefault?: string;
  daysDefault?: string;
  monthDefault?: string;
  paymentLabel?: string;
};

const CONFIG: Record<LoanMicroSlug, MicroConfig> = {
  "daily-interest-calculator": {
    title: "Daily interest calculator",
    description: "Estimate daily interest accrual on a loan balance using APR ÷ 365.",
    showDays: true,
    principalDefault: "25000",
    aprDefault: "6.5",
    daysDefault: "30",
  },
  "monthly-interest-calculator": {
    title: "Monthly interest calculator",
    description: "Calculate one month's interest on an outstanding balance at a given APR.",
    principalDefault: "25000",
    aprDefault: "6.5",
    paymentLabel: "Monthly interest",
  },
  "simple-interest-calculator": {
    title: "Simple interest calculator",
    description: "Flat simple interest: I = P × R × T ÷ 100. Useful for short-term or quoted flat-rate comparisons.",
    showTerm: true,
    principalDefault: "25000",
    aprDefault: "8",
    termDefault: "3",
    paymentLabel: "Simple interest",
  },
  "compound-interest-for-loan-calculator": {
    title: "Compound interest for loan",
    description: "Total interest on a reducing-balance (monthly compounded) loan vs flat simple interest on the same principal and rate.",
    showTerm: true,
    principalDefault: "25000",
    aprDefault: "6.5",
    termDefault: "5",
    paymentLabel: "Total compound interest",
  },
  "interest-per-emi-calculator": {
    title: "Interest per EMI calculator",
    description: "See the interest and principal split inside a specific EMI payment month.",
    showTerm: true,
    showMonth: true,
    principalDefault: "25000",
    aprDefault: "6.5",
    termDefault: "5",
    monthDefault: "1",
    paymentLabel: "Interest in this EMI",
  },
  "outstanding-balance-calculator": {
    title: "Outstanding balance calculator",
    description: "Find remaining loan balance after a chosen number of EMI payments.",
    showTerm: true,
    showMonth: true,
    principalDefault: "25000",
    aprDefault: "6.5",
    termDefault: "5",
    monthDefault: "24",
    paymentLabel: "Outstanding balance",
  },
};

export function LoanMicroToolsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as LoanMicroSlug] ?? CONFIG["daily-interest-calculator"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, config.principalDefault ?? "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, config.aprDefault ?? "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, config.termDefault ?? "5"));
  const [days, setDays] = useState(useLoanInitialInput(LOAN_URL.U, config.daysDefault ?? "30"));
  const [month, setMonth] = useState(useLoanInitialInput(LOAN_URL.X, config.monthDefault ?? "1"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.U]: days,
      [LOAN_URL.X]: month,
    }),
    [principal, apr, termRaw, days, month],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, days, month, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal / balance");
    const a0 = parseAprPercent(apr, "APR");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };

    const slugKey = slug as LoanMicroSlug;
    let term: LoanTermInput | undefined;

    if (slugKey === "daily-interest-calculator") {
      const d0 = parsePositive(days, "Days");
      if (!d0.ok) return { err: d0.error };
      const result = computeDailyInterest({ principal: p0.value, apr: a0.value, days: Math.round(d0.value) });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        result: {
          headline: formatLoanMoney(result.dailyInterest, currency),
          headlineLabel: "Daily interest",
          rows: [
            [`Interest for ${result.days} days`, formatLoanMoney(result.totalForDays, currency)],
            ["APR used", `${a0.value}%`],
            ["Balance", formatLoanMoney(p0.value, currency)],
          ],
        },
      };
    }

    if (slugKey === "monthly-interest-calculator") {
      const result = computeMonthlyInterest({ principal: p0.value, apr: a0.value });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        result: {
          headline: formatLoanMoney(result.monthlyInterest, currency),
          headlineLabel: config.paymentLabel ?? "Monthly interest",
          rows: [
            ["Annual interest (12 × monthly)", formatLoanMoney(result.annualInterest, currency)],
            ["Balance", formatLoanMoney(p0.value, currency)],
          ],
        },
      };
    }

    if (slugKey === "simple-interest-calculator") {
      const t0 = parseTermToMonths(termRaw, termMode, "Time");
      if (!t0.ok) return { err: t0.error };
      const timeYears = t0.value / 12;
      const result = computeSimpleInterest({ principal: p0.value, ratePercent: a0.value, timeYears });
      if ("error" in result) return { err: result.error };
      term = { termMonths: t0.value };
      return {
        err: null,
        term,
        result: {
          headline: formatLoanMoney(result.interest, currency),
          headlineLabel: config.paymentLabel ?? "Simple interest",
          rows: [
            ["Total amount", formatLoanMoney(result.totalAmount, currency)],
            ["Time", `${timeYears.toFixed(2)} years`],
            ["Formula", "P × R × T ÷ 100"],
          ],
        },
      };
    }

    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!t0.ok) return { err: t0.error };
    term = { termMonths: t0.value };

    if (slugKey === "compound-interest-for-loan-calculator") {
      const result = computeCompoundLoanInterest({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        bankPennyRounding,
      });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        term,
        loanPrincipal: p0.value,
        result: {
          headline: formatLoanMoney(result.totalInterest, currency),
          headlineLabel: config.paymentLabel ?? "Total interest",
          rows: [
            ["Monthly EMI", formatLoanMoney(result.emi, currency)],
            ["Total paid", formatLoanMoney(result.totalPaid, currency)],
            ["Flat simple interest (same P, R, T)", formatLoanMoney(result.simpleInterestFlat, currency)],
            ["Extra vs simple flat", formatLoanMoney(result.interestDifference, currency)],
          ],
        },
      };
    }

    const when = parseTermToMonths(month, "months", "Payment month");
    if (!when.ok) return { err: when.error };

    if (slugKey === "interest-per-emi-calculator") {
      const result = computeInterestPerEmi({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        month: when.value,
        bankPennyRounding,
      });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        term,
        loanPrincipal: p0.value,
        result: {
          headline: formatLoanMoney(result.interest, currency),
          headlineLabel: config.paymentLabel ?? "Interest portion",
          rows: [
            ["EMI amount", formatLoanMoney(result.emi, currency)],
            ["Principal portion", `${formatLoanMoney(result.principal, currency)} (${result.principalSharePercent.toFixed(1)}%)`],
            ["Opening balance", formatLoanMoney(result.openingBalance, currency)],
            ["Closing balance", formatLoanMoney(result.closingBalance, currency)],
          ],
        },
      };
    }

    const result = computeOutstandingBalance({
      principal: p0.value,
      apr: a0.value,
      termMonths: t0.value,
      month: when.value,
      bankPennyRounding,
    });
    if ("error" in result) return { err: result.error };
    return {
      err: null,
      term,
      loanPrincipal: p0.value,
      result: {
        headline: formatLoanMoney(result.outstanding, currency),
        headlineLabel: config.paymentLabel ?? "Outstanding balance",
        rows: [
          ["After payment month", `${result.month}`],
          ["Contract EMI", formatLoanMoney(result.emi, currency)],
          ["Original principal", formatLoanMoney(p0.value, currency)],
          ["Principal repaid so far", formatLoanMoney(p0.value - result.outstanding, currency)],
        ],
      },
    };
  }, [principal, apr, termRaw, termMode, days, month, slug, config.paymentLabel, currency, bankPennyRounding]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${slug}-form-error`;
  const result = parsed.err ? null : parsed.result;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${principal}-${apr}-${termRaw}-${days}-${month}-${currency}-${bankPennyRounding}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onReset={() => {
              setPrincipal(config.principalDefault ?? "25000");
              setApr(config.aprDefault ?? "6.5");
              setTermRaw(config.termDefault ?? "5");
              setDays(config.daysDefault ?? "30");
              setMonth(config.monthDefault ?? "1");
            }}
            getSummary={() =>
              parsed.err || !result
                ? `${config.title}: ${parsed.err}`
                : `${config.title}: ${result.headlineLabel} ${result.headline}.`
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
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.headline}</p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                {result.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="text-right font-mono text-[var(--text)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${slug}-p`}>{slug === "outstanding-balance-calculator" ? "Original principal" : "Principal / balance"}</FieldLabel>
            <FieldInput id={`${slug}-p`} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-apr`}>APR / rate %</FieldLabel>
            <FieldInput id={`${slug}-apr`} inputMode="decimal" value={apr} onChange={(e) => setApr(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          {config.showTerm ? (
            <div>
              <FieldLabel htmlFor={`${slug}-term`}>{slug === "simple-interest-calculator" ? "Time" : termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
              <FieldInput id={`${slug}-term`} inputMode="decimal" value={termRaw} onChange={(e) => setTermRaw(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
              {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
            </div>
          ) : null}
        </div>

        {(config.showDays || config.showMonth) ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-2">
            {config.showDays ? (
              <div>
                <FieldLabel htmlFor={`${slug}-days`}>Number of days</FieldLabel>
                <FieldInput id={`${slug}-days`} inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
              </div>
            ) : null}
            {config.showMonth ? (
              <div>
                <FieldLabel htmlFor={`${slug}-month`}>Payment month</FieldLabel>
                <FieldInput id={`${slug}-month`} inputMode="numeric" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
                <p className="mt-1 text-xs text-[var(--muted)]">Month 1 = after the first EMI.</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
        {!parsed.err && parsed.term && parsed.loanPrincipal ? (
          <UserLoanBalanceMini
            principal={parsed.loanPrincipal}
            apr={Number(apr)}
            term={parsed.term}
            currency={currency}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </>
  );
}
