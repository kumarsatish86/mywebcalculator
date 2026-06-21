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
import { parseAprPercent, parseNonNegative, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import {
  compareTenureVsEmiReduction,
  computeEarlyClosure,
  computeForeclosure,
  computePrepaymentSavings,
} from "@/lib/calculators/loanPrepayment";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import type { LoanTermInput } from "@/lib/calculators/loanPayment";

type PrepaymentForeclosureSlug =
  | "loan-foreclosure-calculator"
  | "loan-prepayment-savings-calculator"
  | "emi-reduction-vs-tenure-reduction-calculator"
  | "early-loan-closure-calculator";

type ScenarioConfig = {
  title: string;
  description: string;
  amountLabel?: string;
  amountDefault?: string;
  amountHint?: string;
  rateLabel?: string;
  rateDefault?: string;
  rateHint?: string;
  monthLabel?: string;
  monthDefault?: string;
  monthHint?: string;
};

const CONFIG: Record<PrepaymentForeclosureSlug, ScenarioConfig> = {
  "loan-foreclosure-calculator": {
    title: "Loan foreclosure calculator",
    description: "Estimate the total amount to close your loan early, including outstanding balance and foreclosure charges.",
    rateLabel: "Foreclosure fee %",
    rateDefault: "2",
    rateHint: "Applied on the outstanding balance at closure month.",
    monthLabel: "Closure month",
    monthDefault: "24",
    monthHint: "Month when you plan to foreclose (after that month's EMI).",
  },
  "loan-prepayment-savings-calculator": {
    title: "Loan prepayment savings calculator",
    description: "See how a one-time prepayment reduces tenure and total interest while keeping your EMI unchanged.",
    amountLabel: "Prepayment amount",
    amountDefault: "2500",
    amountHint: "Lump sum applied after the EMI in the selected month.",
    monthLabel: "Prepayment month",
    monthDefault: "12",
    monthHint: "Month 1 means after the first EMI.",
  },
  "emi-reduction-vs-tenure-reduction-calculator": {
    title: "EMI reduction vs tenure reduction calculator",
    description: "Compare interest saved when you reduce remaining tenure versus recasting to a lower EMI after a part payment.",
    amountLabel: "Part payment amount",
    amountDefault: "3000",
    amountHint: "Lump sum applied after the EMI in the selected month.",
    monthLabel: "Part payment month",
    monthDefault: "18",
    monthHint: "Month when the part payment is applied.",
  },
  "early-loan-closure-calculator": {
    title: "Early loan closure calculator",
    description: "Calculate payoff amount today and how much interest you avoid by closing the loan early.",
    rateLabel: "Optional closure fee %",
    rateDefault: "0",
    rateHint: "Leave at 0 if your lender charges no fee.",
    monthLabel: "Closure month",
    monthDefault: "30",
    monthHint: "Month when you plan to close (after that month's EMI).",
  },
};

type ResultShape = {
  headline: string;
  headlineLabel: string;
  rows: [string, string][];
  series?: { month: number; balance: number }[];
};

export function PrepaymentForeclosureCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PrepaymentForeclosureSlug] ?? CONFIG["loan-prepayment-savings-calculator"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [amount, setAmount] = useState(useLoanInitialInput(LOAN_URL.X, config.amountDefault ?? "0"));
  const [rate, setRate] = useState(useLoanInitialInput(LOAN_URL.R, config.rateDefault ?? "0"));
  const [month, setMonth] = useState(useLoanInitialInput(LOAN_URL.U, config.monthDefault ?? "12"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.X]: amount,
      [LOAN_URL.R]: rate,
      [LOAN_URL.U]: month,
    }),
    [principal, apr, termRaw, amount, rate, month],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, amount, rate, month, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    const term: LoanTermInput = { termMonths: t0.value };
    const slugKey = slug as PrepaymentForeclosureSlug;
    const when = parseTermToMonths(month, "months", config.monthLabel ?? "Month");
    if (!when.ok) return { err: when.error };

    if (slugKey === "loan-foreclosure-calculator") {
      const fee = parseNonNegative(rate, "Foreclosure fee");
      if (!fee.ok) return { err: fee.error };
      const result = computeForeclosure({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        closureMonth: when.value,
        feePercent: fee.value,
        bankPennyRounding,
      });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        term,
        result: {
          headline: formatLoanMoney(result.totalClosureAmount, currency),
          headlineLabel: "Total foreclosure amount",
          rows: [
            ["Outstanding balance", formatLoanMoney(result.outstanding, currency)],
            ["Foreclosure fee", formatLoanMoney(result.foreclosureFee, currency)],
            ["Interest saved vs full term", formatLoanMoney(result.interestSaved, currency)],
            ["Original total interest", formatLoanMoney(result.baseTotalInterest, currency)],
          ],
        } satisfies ResultShape,
      };
    }

    if (slugKey === "early-loan-closure-calculator") {
      const fee = parseNonNegative(rate, "Closure fee");
      if (!fee.ok) return { err: fee.error };
      const result = computeEarlyClosure({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        closureMonth: when.value,
        feePercent: fee.value,
        bankPennyRounding,
      });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        term,
        result: {
          headline: formatLoanMoney(result.totalPayoff, currency),
          headlineLabel: "Total payoff amount",
          rows: [
            ["Outstanding balance", formatLoanMoney(result.outstanding, currency)],
            ["Closure fee", formatLoanMoney(result.optionalFee, currency)],
            ["Months remaining if continued", `${result.monthsRemaining} months`],
            ["Interest saved by closing early", formatLoanMoney(result.interestSaved, currency)],
          ],
        } satisfies ResultShape,
      };
    }

    const amt = parseNonNegative(amount, config.amountLabel ?? "Amount");
    if (!amt.ok) return { err: amt.error };

    if (slugKey === "loan-prepayment-savings-calculator") {
      const result = computePrepaymentSavings({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        prepaymentAmount: amt.value,
        prepaymentMonth: when.value,
        bankPennyRounding,
      });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        term,
        result: {
          headline: formatLoanMoney(result.interestSaved, currency),
          headlineLabel: "Interest saved",
          rows: [
            ["Base EMI", formatLoanMoney(result.baseEmi, currency)],
            ["New payoff", `${result.scenario.months} months`],
            ["Months saved", `${result.monthsSaved} months`],
            ["Total paid after prepayment", formatLoanMoney(result.scenario.totalPaid, currency)],
          ],
          series: result.scenario.rows.map((row) => ({ month: row.month, balance: row.balance })),
        } satisfies ResultShape,
      };
    }

    const result = compareTenureVsEmiReduction({
      principal: p0.value,
      apr: a0.value,
      termMonths: t0.value,
      partPaymentAmount: amt.value,
      partPaymentMonth: when.value,
      bankPennyRounding,
    });
    if ("error" in result) return { err: result.error };
    return {
      err: null,
      term,
      result: {
        headline: formatLoanMoney(result.interestSavedTenure, currency),
        headlineLabel: "Interest saved (tenure reduction)",
        rows: [
          ["Tenure path — new payoff", `${result.tenurePath.months} months`],
          ["Tenure path — interest saved", formatLoanMoney(result.interestSavedTenure, currency)],
          ["EMI path — new EMI", formatLoanMoney(result.emiPath.newEmi, currency)],
          ["EMI path — interest saved", formatLoanMoney(result.interestSavedEmi, currency)],
          ["EMI reduction", formatLoanMoney(result.emiReduction, currency)],
          ["Months saved (tenure path)", `${result.monthsSaved} months`],
        ],
        series: result.tenurePath.rows.map((row) => ({ month: row.month, balance: row.balance })),
      } satisfies ResultShape,
    };
  }, [
    principal,
    apr,
    termRaw,
    termMode,
    amount,
    rate,
    month,
    slug,
    config.amountLabel,
    config.monthLabel,
    currency,
    bankPennyRounding,
  ]);

  const showAmount = Boolean(config.amountLabel);
  const showRate = Boolean(config.rateLabel);
  const showMonth = Boolean(config.monthLabel);
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
        resultKey={`${principal}-${apr}-${termRaw}-${amount}-${rate}-${month}-${currency}-${bankPennyRounding}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onReset={() => {
              setPrincipal("25000");
              setApr("6.5");
              setTermRaw("5");
              setAmount(config.amountDefault ?? "0");
              setRate(config.rateDefault ?? "0");
              setMonth(config.monthDefault ?? "12");
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

        {(showAmount || showRate || showMonth) ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-3">
            {showAmount ? (
              <div>
                <FieldLabel htmlFor={`${slug}-amount`}>{config.amountLabel}</FieldLabel>
                <FieldInput id={`${slug}-amount`} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.amountHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.amountHint}</p> : null}
              </div>
            ) : null}
            {showRate ? (
              <div>
                <FieldLabel htmlFor={`${slug}-rate`}>{config.rateLabel}</FieldLabel>
                <FieldInput id={`${slug}-rate`} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.rateHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.rateHint}</p> : null}
              </div>
            ) : null}
            {showMonth ? (
              <div>
                <FieldLabel htmlFor={`${slug}-month`}>{config.monthLabel}</FieldLabel>
                <FieldInput id={`${slug}-month`} inputMode="numeric" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.monthHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.monthHint}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
        {!parsed.err && parsed.term && result?.series ? (
          <UserLoanBalanceMini
            principal={Number(principal)}
            apr={Number(apr)}
            term={parsed.term}
            currency={currency}
            balanceSeries={result.series}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </>
  );
}
