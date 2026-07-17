"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { LoanCreditBankingCurrencyCode } from "@/lib/calculators/loanCreditBanking";
import {
  LOAN_CREDIT_BANKING_URL,
  floatingVsFixed,
  formatLoanCreditBankingMoney,
  interestRateSensitivity,
  loanAffordability,
  loanAmortizationFull,
  loanComparisonMultiBank,
  loanInterestTotal,
  partPaymentImpact,
  prepaymentForeclosure,
  reducingBalanceSummary,
  totalLoanCost,
} from "@/lib/calculators/loanCreditBanking";

type LoanSlug =
  | "loan-interest-calculator"
  | "loan-affordability-calculator"
  | "loan-amortization-calculator-with-full-schedule"
  | "prepayment-foreclosure-calculator"
  | "part-payment-impact-calculator"
  | "reducing-balance-calculator"
  | "loan-comparison-calculator-multi-bank"
  | "floating-vs-fixed-interest-calculator"
  | "interest-rate-sensitivity-calculator"
  | "total-loan-cost-calculator";

type Mode =
  | "interest"
  | "affordability"
  | "amortization"
  | "foreclosure"
  | "partPayment"
  | "reducing"
  | "compare"
  | "floatFixed"
  | "sensitivity"
  | "totalCost";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
  yDefault: string;
  cDefault: string;
  fDefault: string;
};

const CONFIG: Record<LoanSlug, Config> = {
  "loan-interest-calculator": {
    title: "Loan interest calculator",
    description: "Monthly EMI, total interest, and total repayment for a reducing-balance loan.",
    mode: "interest",
    aDefault: "1000000",
    bDefault: "0",
    rDefault: "10",
    tDefault: "0",
    mDefault: "120",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "loan-affordability-calculator": {
    title: "Loan affordability calculator",
    description: "Maximum EMI and loan amount from income, existing EMIs, and DTI cap.",
    mode: "affordability",
    aDefault: "100000",
    bDefault: "15000",
    rDefault: "40",
    tDefault: "10",
    mDefault: "240",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "loan-amortization-calculator-with-full-schedule": {
    title: "Loan amortization calculator with full schedule",
    description: "EMI breakdown with month-by-month principal, interest, and balance.",
    mode: "amortization",
    aDefault: "2500000",
    bDefault: "0",
    rDefault: "8.5",
    tDefault: "0",
    mDefault: "240",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "prepayment-foreclosure-calculator": {
    title: "Prepayment / foreclosure calculator",
    description: "Outstanding balance and interest saved when closing the loan after N EMIs.",
    mode: "foreclosure",
    aDefault: "1500000",
    bDefault: "0",
    rDefault: "9",
    tDefault: "60",
    mDefault: "180",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "2",
  },
  "part-payment-impact-calculator": {
    title: "Part payment impact calculator",
    description: "See EMI reduction and interest saved from a lump-sum part payment after a given month.",
    mode: "partPayment",
    aDefault: "2000000",
    bDefault: "200000",
    rDefault: "9.5",
    tDefault: "24",
    mDefault: "180",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "reducing-balance-calculator": {
    title: "Reducing balance calculator",
    description: "Standard reducing-balance EMI and total interest for personal or home loans.",
    mode: "reducing",
    aDefault: "800000",
    bDefault: "0",
    rDefault: "11",
    tDefault: "0",
    mDefault: "60",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "loan-comparison-calculator-multi-bank": {
    title: "Loan comparison calculator (multi-bank)",
    description: "Compare EMI and total interest across up to three bank rate quotes.",
    mode: "compare",
    aDefault: "3000000",
    bDefault: "0",
    rDefault: "8.75",
    tDefault: "9.25",
    mDefault: "240",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "floating-vs-fixed-interest-calculator": {
    title: "Floating vs fixed interest calculator",
    description: "Compare total interest under fixed rate vs floating rate that resets after a period.",
    mode: "floatFixed",
    aDefault: "5000000",
    bDefault: "0",
    rDefault: "9",
    tDefault: "8.5",
    mDefault: "240",
    yDefault: "3",
    cDefault: "10.5",
    fDefault: "0",
  },
  "interest-rate-sensitivity-calculator": {
    title: "Interest rate sensitivity calculator",
    description: "See how EMI and total interest change if rates move up or down.",
    mode: "sensitivity",
    aDefault: "2000000",
    bDefault: "0",
    rDefault: "9",
    tDefault: "1",
    mDefault: "180",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "0",
  },
  "total-loan-cost-calculator": {
    title: "Total loan cost calculator",
    description: "All-in cost including EMI repayments, processing fees, and other charges.",
    mode: "totalCost",
    aDefault: "1500000",
    bDefault: "5000",
    rDefault: "10.5",
    tDefault: "0",
    mDefault: "120",
    yDefault: "3",
    cDefault: "9.5",
    fDefault: "1",
  },
};

const CURRENCIES: LoanCreditBankingCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function previewSchedule<T>(rows: T[]): { rows: T[]; hasGap: boolean } {
  if (rows.length <= 7) return { rows, hasGap: false };
  return { rows: [...rows.slice(0, 6), rows[rows.length - 1]!], hasGap: true };
}

export function LoanCreditBankingCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as LoanSlug] ?? CONFIG["loan-interest-calculator"];
  const [currency, setCurrency] = useState<LoanCreditBankingCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.M, config.mDefault));
  const [y, setY] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.Y, config.yDefault));
  const [c, setC] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.C, config.cDefault));
  const [f, setF] = useState(useLoanInitialInput(LOAN_CREDIT_BANKING_URL.F, config.fDefault));

  const fmt = useCallback((n: number) => formatLoanCreditBankingMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [LOAN_CREDIT_BANKING_URL.A]: a,
      [LOAN_CREDIT_BANKING_URL.B]: b,
      [LOAN_CREDIT_BANKING_URL.R]: r,
      [LOAN_CREDIT_BANKING_URL.T]: t,
      [LOAN_CREDIT_BANKING_URL.M]: m,
      [LOAN_CREDIT_BANKING_URL.Y]: y,
      [LOAN_CREDIT_BANKING_URL.C]: c,
      [LOAN_CREDIT_BANKING_URL.F]: f,
    }),
    [a, b, r, t, m, y, c, f],
  );

  useLoanUrlSync(shareParams, [a, b, r, t, m, y, c, f]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "interest":
      case "reducing": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Interest rate %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        const fn = config.mode === "interest" ? loanInterestTotal : reducingBalanceSummary;
        const computed = fn({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.payment),
          primaryLabel: "Monthly EMI",
          rows: [
            { label: "Principal", value: fmt(prinP.value) },
            { label: "Monthly EMI", value: fmt(computed.payment) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Total repayment", value: fmt(computed.totalPaid) },
          ],
        };
      }
      case "affordability": {
        const incP = parsePositive(a, "Monthly income");
        const existP = parseNonNegative(b, "Existing EMI");
        const dtiP = parseAprPercent(r, "Max DTI %");
        const rateP = parseAprPercent(t, "Interest rate %");
        const termP = parsePositive(m, "Term (months)");
        if (!incP.ok) return { error: incP.error };
        if (!existP.ok) return { error: existP.error };
        if (!dtiP.ok) return { error: dtiP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = loanAffordability({
          monthlyIncome: incP.value,
          existingEmi: existP.value,
          maxDtiPercent: dtiP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.affordablePrincipal),
          primaryLabel: "Affordable loan amount",
          rows: [
            { label: "Max EMI capacity", value: fmt(computed.maxEmi) },
            { label: "Affordable principal", value: fmt(computed.affordablePrincipal) },
            { label: "DTI headroom used", value: pct(computed.dtiHeadroomPercent) },
          ],
        };
      }
      case "amortization": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Interest rate %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = loanAmortizationFull({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
        });
        if ("error" in computed) return { error: computed.error };
        const { rows: schedRows, hasGap } = previewSchedule(computed.rows);
        return {
          primary: fmt(computed.emi),
          primaryLabel: "Monthly EMI",
          rows: [
            { label: "Total paid", value: fmt(computed.totalPaid) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Payments", value: String(computed.rows.length) },
          ],
          schedule: schedRows.map((row) => ({
            label: `Month ${row.month}`,
            value: `${fmt(row.payment)} · P ${fmt(row.principal)} · I ${fmt(row.interest)} · Bal ${fmt(row.balance)}`,
          })),
          scheduleGap: hasGap,
        };
      }
      case "foreclosure": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Interest rate %");
        const termP = parsePositive(m, "Term (months)");
        const closeP = parsePositive(t, "Closure after month");
        const feeP = parseNonNegative(f, "Foreclosure fee %");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        if (!closeP.ok) return { error: closeP.error };
        if (!feeP.ok) return { error: feeP.error };
        const computed = prepaymentForeclosure({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
          closureMonth: closeP.value,
          feePercent: feeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalToClose),
          primaryLabel: "Total to close loan",
          rows: [
            { label: "Outstanding principal", value: fmt(computed.outstanding) },
            { label: "Foreclosure fee", value: fmt(computed.fee) },
            { label: "Total to close", value: fmt(computed.totalToClose) },
            { label: "Interest paid to date", value: fmt(computed.interestPaidToDate) },
            { label: "Interest saved vs full term", value: fmt(computed.interestSavedVsFullTerm) },
          ],
        };
      }
      case "partPayment": {
        const prinP = parsePositive(a, "Principal");
        const partP = parsePositive(b, "Part payment");
        const rateP = parseAprPercent(r, "Interest rate %");
        const afterP = parsePositive(t, "After month");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!partP.ok) return { error: partP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!afterP.ok) return { error: afterP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = partPaymentImpact({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
          partPayment: partP.value,
          afterMonth: afterP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.emiReduction),
          primaryLabel: "EMI reduction",
          rows: [
            { label: "Original EMI", value: fmt(computed.originalEmi) },
            { label: "New EMI (same tenure)", value: fmt(computed.newEmiSameTenure) },
            { label: "EMI reduction", value: fmt(computed.emiReduction) },
            { label: "Interest saved", value: fmt(computed.interestSaved) },
          ],
        };
      }
      case "compare": {
        const prinP = parsePositive(a, "Principal");
        const rateAP = parseAprPercent(r, "Bank A rate %");
        const rateBP = parseAprPercent(t, "Bank B rate %");
        const rateCP = parseAprPercent(c, "Bank C rate %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateAP.ok) return { error: rateAP.error };
        if (!rateBP.ok) return { error: rateBP.error };
        if (!rateCP.ok) return { error: rateCP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = loanComparisonMultiBank({
          principal: prinP.value,
          termMonths: termP.value,
          rateA: rateAP.value,
          rateB: rateBP.value,
          rateC: rateCP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.cheapestLabel,
          primaryLabel: "Lowest total interest",
          rows: computed.options.map((opt) => ({
            label: `${opt.label} (${pct(opt.rate)})`,
            value: `${fmt(opt.emi)} EMI · ${fmt(opt.totalInterest)} interest`,
          })),
        };
      }
      case "floatFixed": {
        const prinP = parsePositive(a, "Principal");
        const fixedP = parseAprPercent(r, "Fixed rate %");
        const floatStartP = parseAprPercent(t, "Floating start %");
        const floatLaterP = parseAprPercent(c, "Floating later %");
        const afterP = parsePositive(y, "Rate reset after (years)");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!fixedP.ok) return { error: fixedP.error };
        if (!floatStartP.ok) return { error: floatStartP.error };
        if (!floatLaterP.ok) return { error: floatLaterP.error };
        if (!afterP.ok) return { error: afterP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = floatingVsFixed({
          principal: prinP.value,
          termMonths: termP.value,
          fixedRatePercent: fixedP.value,
          floatingStartPercent: floatStartP.value,
          floatingAfterYears: afterP.value,
          floatingLaterPercent: floatLaterP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.cheaper === "similar" ? "Similar cost" : computed.cheaper,
          primaryLabel: "Cheaper option",
          rows: [
            { label: "Fixed total interest", value: fmt(computed.fixedTotalInterest) },
            { label: "Floating total interest", value: fmt(computed.floatingTotalInterest) },
            { label: "Difference (fixed − floating)", value: fmt(computed.difference) },
          ],
        };
      }
      case "sensitivity": {
        const prinP = parsePositive(a, "Principal");
        const baseP = parseAprPercent(r, "Base rate %");
        const shockP = parseAprPercent(t, "Rate shock ± %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!baseP.ok) return { error: baseP.error };
        if (!shockP.ok) return { error: shockP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = interestRateSensitivity({
          principal: prinP.value,
          termMonths: termP.value,
          baseRatePercent: baseP.value,
          shockPercentPoints: shockP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.emiIncrease),
          primaryLabel: "EMI increase if rates rise",
          rows: [
            { label: "Base EMI", value: fmt(computed.baseEmi) },
            { label: "EMI if rates up", value: fmt(computed.upEmi) },
            { label: "EMI if rates down", value: fmt(computed.downEmi) },
            { label: "Extra interest if rates up", value: fmt(computed.interestIncrease) },
          ],
        };
      }
      case "totalCost": {
        const prinP = parsePositive(a, "Principal");
        const otherP = parseNonNegative(b, "Other fees");
        const rateP = parseAprPercent(r, "Interest rate %");
        const termP = parsePositive(m, "Term (months)");
        const procP = parseNonNegative(f, "Processing fee %");
        if (!prinP.ok) return { error: prinP.error };
        if (!otherP.ok) return { error: otherP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        if (!procP.ok) return { error: procP.error };
        const computed = totalLoanCost({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
          processingFeePercent: procP.value,
          otherFees: otherP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalCost),
          primaryLabel: "All-in loan cost",
          rows: [
            { label: "Monthly EMI", value: fmt(computed.emi) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Fees", value: fmt(computed.fees) },
            { label: "Total cost", value: fmt(computed.totalCost) },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, t, m, y, c, f, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="lcb-currency">Currency</FieldLabel>
            <select
              id="lcb-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as LoanCreditBankingCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {(config.mode === "interest" || config.mode === "reducing" || config.mode === "amortization") && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-prin">Loan amount</FieldLabel>
                <FieldInput id="lcb-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-rate">Interest rate % / year</FieldLabel>
                <FieldInput id="lcb-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-term">Term (months)</FieldLabel>
                <FieldInput id="lcb-term" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "affordability" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-inc">Monthly income</FieldLabel>
                <FieldInput id="lcb-inc" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-exist">Existing monthly EMI</FieldLabel>
                <FieldInput id="lcb-exist" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-dti">Max DTI %</FieldLabel>
                <FieldInput id="lcb-dti" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-aff-rate">Interest rate %</FieldLabel>
                <FieldInput id="lcb-aff-rate" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-aff-term">Term (months)</FieldLabel>
                <FieldInput id="lcb-aff-term" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "foreclosure" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-fprin">Loan amount</FieldLabel>
                <FieldInput id="lcb-fprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-frate">Interest rate %</FieldLabel>
                <FieldInput id="lcb-frate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-fterm">Original term (months)</FieldLabel>
                <FieldInput id="lcb-fterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-fclose">Close after month</FieldLabel>
                <FieldInput id="lcb-fclose" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-ffee">Foreclosure fee %</FieldLabel>
                <FieldInput id="lcb-ffee" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "partPayment" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-pprin">Loan amount</FieldLabel>
                <FieldInput id="lcb-pprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-part">Part payment amount</FieldLabel>
                <FieldInput id="lcb-part" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-prate">Interest rate %</FieldLabel>
                <FieldInput id="lcb-prate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-pafter">After month</FieldLabel>
                <FieldInput id="lcb-pafter" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-pterm">Original term (months)</FieldLabel>
                <FieldInput id="lcb-pterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "compare" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-cprin">Loan amount</FieldLabel>
                <FieldInput id="lcb-cprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-ra">Bank A rate %</FieldLabel>
                <FieldInput id="lcb-ra" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-rb">Bank B rate %</FieldLabel>
                <FieldInput id="lcb-rb" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-rc">Bank C rate %</FieldLabel>
                <FieldInput id="lcb-rc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-cterm">Term (months)</FieldLabel>
                <FieldInput id="lcb-cterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "floatFixed" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-ffprin">Loan amount</FieldLabel>
                <FieldInput id="lcb-ffprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-fixed">Fixed rate %</FieldLabel>
                <FieldInput id="lcb-fixed" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-fstart">Floating start %</FieldLabel>
                <FieldInput id="lcb-fstart" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-flater">Floating later %</FieldLabel>
                <FieldInput id="lcb-flater" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-fafter">Reset after (years)</FieldLabel>
                <FieldInput id="lcb-fafter" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-ffterm">Term (months)</FieldLabel>
                <FieldInput id="lcb-ffterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "sensitivity" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-sprin">Loan amount</FieldLabel>
                <FieldInput id="lcb-sprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-base">Base rate %</FieldLabel>
                <FieldInput id="lcb-base" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-shock">Rate shock ± %</FieldLabel>
                <FieldInput id="lcb-shock" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-sterm">Term (months)</FieldLabel>
                <FieldInput id="lcb-sterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "totalCost" && (
            <>
              <div>
                <FieldLabel htmlFor="lcb-tprin">Loan amount</FieldLabel>
                <FieldInput id="lcb-tprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-trate">Interest rate %</FieldLabel>
                <FieldInput id="lcb-trate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-tterm">Term (months)</FieldLabel>
                <FieldInput id="lcb-tterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-proc">Processing fee %</FieldLabel>
                <FieldInput id="lcb-proc" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="lcb-other">Other fees</FieldLabel>
                <FieldInput id="lcb-other" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
              {result.schedule?.length ? (
                <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
                  <p className="text-xs text-[var(--muted)]">
                    Amortization schedule{result.scheduleGap ? " · first 6 + last month" : ""}
                  </p>
                  {result.schedule.map((row) => (
                    <Row key={row.label} label={row.label} value={row.value} />
                  ))}
                  {result.scheduleGap ? (
                    <p className="text-xs text-[var(--muted)]">… middle months omitted …</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
