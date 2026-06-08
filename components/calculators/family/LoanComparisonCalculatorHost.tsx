"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { parseAprPercent, parseNonNegative, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { amortizationSchedule, amortizationTotals, monthlyLoanPayment, type LoanTermInput } from "@/lib/calculators/loanPayment";

type ComparisonSlug =
  | "loan-comparison-calculator"
  | "emi-comparison-calculator"
  | "interest-rate-comparison-tool"
  | "fixed-vs-floating-interest-calculator"
  | "bank-loan-comparison-tool";

type Offer = {
  name: string;
  apr: number;
  fee: number;
  payment: number;
  totalInterest: number;
  totalPaid: number;
  totalCost: number;
};

const CONFIG: Record<ComparisonSlug, { title: string; description: string; showFees: boolean; floating?: boolean }> = {
  "loan-comparison-calculator": {
    title: "Loan comparison calculator",
    description: "Compare two loan offers by EMI, interest, fees, and total estimated cost.",
    showFees: true,
  },
  "emi-comparison-calculator": {
    title: "EMI comparison calculator",
    description: "Compare monthly EMI and total interest for two APR choices on the same principal and term.",
    showFees: false,
  },
  "interest-rate-comparison-tool": {
    title: "Interest rate comparison tool",
    description: "See how different APRs change EMI, total interest, and lifetime loan cost.",
    showFees: true,
  },
  "fixed-vs-floating-interest-calculator": {
    title: "Fixed vs floating interest calculator",
    description: "Compare a fixed-rate loan against a floating-rate path that resets after a chosen month.",
    showFees: false,
    floating: true,
  },
  "bank-loan-comparison-tool": {
    title: "Bank loan comparison tool",
    description: "Compare two bank offers with processing fees included in the total cost.",
    showFees: true,
  },
};

function parseOffer(args: {
  name: string;
  aprRaw: string;
  feeRaw: string;
  principal: number;
  termMonths: number;
  includeFee: boolean;
}): Offer | { error: string } {
  const apr = parseAprPercent(args.aprRaw, `${args.name} APR`);
  if (!apr.ok) return { error: apr.error };
  const fee = args.includeFee ? parseNonNegative(args.feeRaw, `${args.name} fee`) : { ok: true as const, value: 0 };
  if (!fee.ok) return { error: fee.error };
  const calc = monthlyLoanPayment({
    principal: args.principal,
    annualRatePercent: apr.value,
    termMonths: args.termMonths,
  });
  if ("error" in calc) return { error: calc.error };
  return {
    name: args.name,
    apr: apr.value,
    fee: fee.value,
    payment: calc.payment,
    totalInterest: calc.totalInterest,
    totalPaid: calc.totalPaid,
    totalCost: calc.totalPaid + fee.value,
  };
}

function floatingOffer(args: {
  principal: number;
  termMonths: number;
  fixedApr: number;
  initialApr: number;
  resetApr: number;
  resetMonth: number;
}) {
  const fixed = monthlyLoanPayment({
    principal: args.principal,
    annualRatePercent: args.fixedApr,
    termMonths: args.termMonths,
  });
  if ("error" in fixed) return { error: fixed.error };

  const firstPhaseMonths = Math.max(1, Math.min(args.resetMonth, args.termMonths - 1));
  const firstPhase = amortizationSchedule(
    args.principal,
    args.initialApr,
    { termMonths: args.termMonths },
    firstPhaseMonths,
  );
  if ("error" in firstPhase) return { error: firstPhase.error };
  const firstTotals = amortizationTotals(firstPhase);
  const balanceAtReset = firstPhase.at(-1)?.balance ?? args.principal;
  const remainingMonths = Math.max(1, args.termMonths - firstPhaseMonths);
  const second = monthlyLoanPayment({
    principal: balanceAtReset,
    annualRatePercent: args.resetApr,
    termMonths: remainingMonths,
  });
  if ("error" in second) return { error: second.error };
  return {
    fixed,
    floating: {
      firstPayment: firstTotals.firstPayment,
      resetPayment: second.payment,
      totalInterest: firstTotals.totalInterest + second.totalInterest,
      totalPaid: firstTotals.totalPaid + second.totalPaid,
      resetMonth: firstPhaseMonths,
      resetBalance: balanceAtReset,
    },
  };
}

export function LoanComparisonCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ComparisonSlug] ?? CONFIG["loan-comparison-calculator"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [aprA, setAprA] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [aprB, setAprB] = useState(useLoanInitialInput(LOAN_URL.R, config.floating ? "7.25" : "7.1"));
  const [feeA, setFeeA] = useState(useLoanInitialInput(LOAN_URL.F, "250"));
  const [feeB, setFeeB] = useState(useLoanInitialInput(LOAN_URL.X, "100"));
  const [resetMonth, setResetMonth] = useState(useLoanInitialInput(LOAN_URL.U, "24"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.A]: aprA,
      [LOAN_URL.R]: aprB,
      [LOAN_URL.F]: feeA,
      [LOAN_URL.X]: feeB,
      [LOAN_URL.U]: resetMonth,
    }),
    [principal, termRaw, aprA, aprB, feeA, feeB, resetMonth],
  );
  useLoanUrlSync(shareParams, [principal, termRaw, aprA, aprB, feeA, feeB, resetMonth, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { error: p0.error };
    if (!t0.ok) return { error: t0.error };
    const term: LoanTermInput = { termMonths: t0.value };

    if (config.floating) {
      const fixedApr = parseAprPercent(aprA, "Fixed APR");
      const floatApr = parseAprPercent(aprB, "Floating reset APR");
      const startApr = parseAprPercent(feeA, "Floating starting APR");
      const reset = parseTermToMonths(resetMonth, "months", "Reset month");
      if (!fixedApr.ok) return { error: fixedApr.error };
      if (!floatApr.ok) return { error: floatApr.error };
      if (!startApr.ok) return { error: startApr.error };
      if (!reset.ok) return { error: reset.error };
      const comparison = floatingOffer({
        principal: p0.value,
        termMonths: t0.value,
        fixedApr: fixedApr.value,
        initialApr: startApr.value,
        resetApr: floatApr.value,
        resetMonth: reset.value,
      });
      if ("error" in comparison) return { error: comparison.error };
      return { term, floating: comparison };
    }

    const a = parseOffer({
      name: config.showFees ? "Offer A" : "Option A",
      aprRaw: aprA,
      feeRaw: feeA,
      principal: p0.value,
      termMonths: t0.value,
      includeFee: config.showFees,
    });
    if ("error" in a) return { error: a.error };
    const b = parseOffer({
      name: config.showFees ? "Offer B" : "Option B",
      aprRaw: aprB,
      feeRaw: feeB,
      principal: p0.value,
      termMonths: t0.value,
      includeFee: config.showFees,
    });
    if ("error" in b) return { error: b.error };
    const best = a.totalCost <= b.totalCost ? a : b;
    return { term, offers: [a, b], best };
  }, [principal, termRaw, termMode, config.floating, config.showFees, aprA, aprB, feeA, feeB, resetMonth]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = "error" in parsed;
  const formErrorId = `${slug}-form-error`;
  const floating = !("error" in parsed) && "floating" in parsed ? parsed.floating : null;
  const offers = !("error" in parsed) && "offers" in parsed ? parsed.offers : null;
  const best = !("error" in parsed) && "best" in parsed ? parsed.best : null;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${principal}-${termRaw}-${aprA}-${aprB}-${feeA}-${feeB}-${resetMonth}-${currency}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onReset={() => {
              setPrincipal("25000");
              setTermRaw("5");
              setAprA("6.5");
              setAprB(config.floating ? "7.25" : "7.1");
              setFeeA(config.floating ? "6.25" : "250");
              setFeeB("100");
              setResetMonth("24");
            }}
            getSummary={() => {
              if ("error" in parsed) return `${config.title}: ${parsed.error}`;
              if (floating) {
                return `${config.title}: fixed EMI ${formatLoanMoney(floating.fixed.payment, currency)}, floating reset EMI ${formatLoanMoney(floating.floating.resetPayment, currency)}.`;
              }
              return best
                ? `${config.title}: best is ${best.name} at total cost ${formatLoanMoney(best.totalCost, currency)}.`
                : `${config.title}: enter loan offers to compare.`;
            }}
          />
        }
        result={
          "error" in parsed ? (
            <p id={`${slug}-result-error`} className="text-sm font-medium text-rose-700" role="alert">
              {parsed.error}
            </p>
          ) : floating ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">Lower estimated total paid</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {floating.fixed.totalPaid <= floating.floating.totalPaid ? "Fixed" : "Floating"}
                </p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Fixed EMI</span>
                  <span className="font-mono text-[var(--text)]">{formatLoanMoney(floating.fixed.payment, currency)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Floating EMI after reset</span>
                  <span className="font-mono text-[var(--text)]">{formatLoanMoney(floating.floating.resetPayment, currency)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Cost difference</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(floating.floating.totalPaid - floating.fixed.totalPaid, currency)}
                  </span>
                </div>
              </div>
            </div>
          ) : offers && best ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">Best estimated offer</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{best.name}</p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Total cost difference</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(Math.abs(offers[0]!.totalCost - offers[1]!.totalCost), currency)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">EMI difference</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(Math.abs(offers[0]!.payment - offers[1]!.payment), currency)}
                  </span>
                </div>
              </div>
            </div>
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${slug}-p`}>Principal</FieldLabel>
            <FieldInput id={`${slug}-p`} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-term`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput id={`${slug}-term`} inputMode="decimal" value={termRaw} onChange={(e) => setTermRaw(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>

        {config.floating ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-4">
            <div>
              <FieldLabel htmlFor={`${slug}-fixed`}>Fixed APR %</FieldLabel>
              <FieldInput id={`${slug}-fixed`} inputMode="decimal" value={aprA} onChange={(e) => setAprA(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            </div>
            <div>
              <FieldLabel htmlFor={`${slug}-float-start`}>Floating start APR %</FieldLabel>
              <FieldInput id={`${slug}-float-start`} inputMode="decimal" value={feeA} onChange={(e) => setFeeA(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            </div>
            <div>
              <FieldLabel htmlFor={`${slug}-float-reset`}>Floating reset APR %</FieldLabel>
              <FieldInput id={`${slug}-float-reset`} inputMode="decimal" value={aprB} onChange={(e) => setAprB(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            </div>
            <div>
              <FieldLabel htmlFor={`${slug}-reset-month`}>Reset month</FieldLabel>
              <FieldInput id={`${slug}-reset-month`} inputMode="numeric" value={resetMonth} onChange={(e) => setResetMonth(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-4">
            <div>
              <FieldLabel htmlFor={`${slug}-a-apr`}>Offer A APR %</FieldLabel>
              <FieldInput id={`${slug}-a-apr`} inputMode="decimal" value={aprA} onChange={(e) => setAprA(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            </div>
            {config.showFees ? (
              <div>
                <FieldLabel htmlFor={`${slug}-a-fee`}>Offer A fees</FieldLabel>
                <FieldInput id={`${slug}-a-fee`} inputMode="decimal" value={feeA} onChange={(e) => setFeeA(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
              </div>
            ) : null}
            <div>
              <FieldLabel htmlFor={`${slug}-b-apr`}>Offer B APR %</FieldLabel>
              <FieldInput id={`${slug}-b-apr`} inputMode="decimal" value={aprB} onChange={(e) => setAprB(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            </div>
            {config.showFees ? (
              <div>
                <FieldLabel htmlFor={`${slug}-b-fee`}>Offer B fees</FieldLabel>
                <FieldInput id={`${slug}-b-fee`} inputMode="decimal" value={feeB} onChange={(e) => setFeeB(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
              </div>
            ) : null}
          </div>
        )}

        {"error" in parsed ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.error}
          </p>
        ) : null}

        {offers ? (
          <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--input-bg)]/70">
                <tr>
                  <th className="px-3 py-2 font-semibold text-[var(--text)]">Offer</th>
                  <th className="px-3 py-2 font-semibold text-[var(--text)]">APR</th>
                  <th className="px-3 py-2 font-semibold text-[var(--text)]">EMI</th>
                  <th className="px-3 py-2 font-semibold text-[var(--text)]">Interest</th>
                  <th className="px-3 py-2 font-semibold text-[var(--text)]">Fees</th>
                  <th className="px-3 py-2 font-semibold text-[var(--text)]">Total cost</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.name} className="border-b border-[var(--border)]/80 last:border-0">
                    <td className="px-3 py-2 font-medium text-[var(--text)]">{offer.name}</td>
                    <td className="px-3 py-2 font-mono text-[var(--muted)]">{offer.apr.toFixed(3)}%</td>
                    <td className="px-3 py-2 font-mono text-[var(--muted)]">{formatLoanMoney(offer.payment, currency)}</td>
                    <td className="px-3 py-2 font-mono text-[var(--muted)]">{formatLoanMoney(offer.totalInterest, currency)}</td>
                    <td className="px-3 py-2 font-mono text-[var(--muted)]">{formatLoanMoney(offer.fee, currency)}</td>
                    <td className="px-3 py-2 font-mono text-[var(--text)]">{formatLoanMoney(offer.totalCost, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </CalculatorShell>
    </>
  );
}
