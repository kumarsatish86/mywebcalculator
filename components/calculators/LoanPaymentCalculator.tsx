"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import { SmartResultPanel } from "@/components/results/SmartResultPanel";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { computeAffordability } from "@/lib/calculators/loanAffordability";
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
  const [income, setIncome] = useState(useLoanInitialInput(LOAN_URL.INC, ""));

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
    };
    if (income.trim()) out[LOAN_URL.INC] = income;
    return out;
  }, [principal, apr, termRaw, income]);
  useLoanUrlSync(shareParams, [principal, apr, termRaw, income, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };
    const term: LoanTermInput = { termMonths: t0.value };
    let monthlyIncome: number | undefined;
    if (income.trim()) {
      const i0 = parsePositive(income, "Monthly income");
      if (!i0.ok) return { err: i0.error };
      monthlyIncome = i0.value;
    }
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
        monthlyIncome,
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
      monthlyIncome,
    };
  }, [principal, apr, termRaw, termMode, bankPennyRounding, income]);

  const afford = useMemo(() => {
    if (parsed.err || !parsed.result) return null;
    return computeAffordability(
      {
        payment: parsed.result.payment,
        totalPaid: parsed.result.totalPaid,
        totalInterest: parsed.result.totalInterest,
        principal: parsed.p!,
        termMonths: parsed.result.termMonths,
        monthlyIncome: parsed.monthlyIncome,
      },
      currency,
    );
  }, [parsed, currency]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${LP_TOOL}-form-error`;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title="Loan payment"
        description="Fixed-rate amortizing loan with smart affordability KPIs when you add monthly income. Teaching estimate—not lending advice."
        resultKey={`${principal}-${apr}-${termRaw}-${income}-${currency}`}
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
              setIncome("");
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
          ) : afford ? (
            <SmartResultPanel
              primaryLabel="Monthly EMI"
              primaryValue={formatLoanMoney(parsed.result!.payment, currency)}
              statusLabel={afford.statusLabel}
              statusTone={afford.statusTone}
              risk={afford.risk}
              kpis={afford.kpis}
              suggestions={afford.suggestions.map((text) => ({ text }))}
              chart={
                parsed.term ? (
                  <UserLoanBalanceMini
                    principal={parsed.p!}
                    apr={parsed.aprNum!}
                    term={parsed.term}
                    currency={currency}
                    bankPennyRounding={bankPennyRounding}
                  />
                ) : null
              }
            />
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div>
            <FieldLabel htmlFor={`${LP_TOOL}-inc`}>Monthly income (optional)</FieldLabel>
            <FieldInput
              id={`${LP_TOOL}-inc`}
              inputMode="decimal"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="mt-2"
              placeholder="For affordability"
            />
          </div>
        </div>
        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
      </CalculatorShell>
    </>
  );
}
