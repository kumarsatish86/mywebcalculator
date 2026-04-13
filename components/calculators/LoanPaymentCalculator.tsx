"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { parseAprPercent, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import {
  amortizationSchedule,
  amortizationTotals,
  monthlyLoanPayment,
  type LoanTermInput,
} from "@/lib/calculators/loanPayment";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";

const LP_TOOL = "loan-payment";

export function LoanPaymentCalculator() {
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
    }),
    [principal, apr, termRaw],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };
    const term: LoanTermInput = { termMonths: t0.value };
    if (bankPennyRounding) {
      const sched = amortizationSchedule(p0.value, a0.value, term, undefined, true);
      if ("error" in sched) return { err: sched.error };
      const ttot = amortizationTotals(sched);
      return {
        err: null as string | null,
        result: {
          payment: ttot.firstPayment,
          totalPaid: ttot.totalPaid,
          totalInterest: ttot.totalInterest,
          termMonths: sched.length,
        },
        term,
        p: p0.value,
        aprNum: a0.value,
      };
    }
    const result = monthlyLoanPayment({
      principal: p0.value,
      annualRatePercent: a0.value,
      termMonths: t0.value,
    });
    if ("error" in result) return { err: result.error };
    return {
      err: null as string | null,
      result,
      term,
      p: p0.value,
      aprNum: a0.value,
    };
  }, [principal, apr, termRaw, termMode, bankPennyRounding]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${LP_TOOL}-form-error`;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title="Loan payment"
        description="Fixed-rate amortizing loan: monthly payment, total paid, and total interest. Matches the core EMI tools’ math."
        resultKey={`${principal}-${apr}-${termRaw}-${currency}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={LP_TOOL}
            showBankRounding
            getShareSearchParams={shareParams}
            onPrintSchedule={() => window.print()}
            onReset={() => {
              setPrincipal("25000");
              setApr("6.5");
              setTermRaw("5");
            }}
            getSummary={() =>
              parsed.err
                ? `Loan payment — ${parsed.err}`
                : `Loan payment — ${formatLoanMoney(parsed.result!.payment, currency)}/mo, total paid ${formatLoanMoney(parsed.result!.totalPaid, currency)}, interest ${formatLoanMoney(parsed.result!.totalInterest, currency)}. Principal ${principal}, APR ${apr}%, term ${termRaw}${termMode === "years" ? " yr" : " mo"}.`
            }
          />
        }
        result={
          parsed.err ? (
            <p id={`${LP_TOOL}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">Monthly payment</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {formatLoanMoney(parsed.result!.payment, currency)}
                </p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Total paid</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(parsed.result!.totalPaid, currency)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Total interest</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(parsed.result!.totalInterest, currency)}
                  </span>
                </div>
              </div>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${LP_TOOL}-p`}>Principal</FieldLabel>
            <FieldInput
              id={`${LP_TOOL}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${LP_TOOL}-apr`}>APR %</FieldLabel>
            <FieldInput
              id={`${LP_TOOL}-apr`}
              inputMode="decimal"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${LP_TOOL}-y`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${LP_TOOL}-y`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
        {!parsed.err && parsed.term ? (
          <UserLoanBalanceMini
            principal={parsed.p!}
            apr={parsed.aprNum!}
            term={parsed.term}
            currency={currency}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </>
  );
}
