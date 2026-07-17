"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { MutualFundCurrencyCode } from "@/lib/calculators/mutualFund";
import {
  MUTUAL_FUND_URL,
  cagrCalc,
  expenseRatioImpact,
  formatMutualFundMoney,
  mutualFundReturns,
  sipStepUp,
  sipVsLumpsum,
  stpCalc,
  swpCalc,
  xirrMutualFund,
} from "@/lib/calculators/mutualFund";

type MfSlug =
  | "mutual-fund-returns-calculator"
  | "sip-vs-lumpsum-calculator"
  | "sip-step-up-calculator"
  | "swp-calculator"
  | "stp-calculator"
  | "mutual-fund-expense-ratio-impact-calculator"
  | "cagr-calculator"
  | "xirr-calculator";

type Mode = "returns" | "sipVsLump" | "stepUp" | "swp" | "stp" | "expense" | "cagr" | "xirr";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  amountLabel: string;
  amountDefault: string;
  showRate?: boolean;
  showYears?: boolean;
  showSecondary?: boolean;
  showStepUp?: boolean;
  showExpense?: boolean;
  showStpRates?: boolean;
  showSipOptional?: boolean;
  rateLabel?: string;
  secondaryLabel?: string;
  secondaryDefault?: string;
};

const CONFIG: Record<MfSlug, Config> = {
  "mutual-fund-returns-calculator": {
    title: "Mutual fund returns calculator",
    description: "Measure absolute gain and CAGR from invested amount to current portfolio value.",
    mode: "returns",
    amountLabel: "Amount invested",
    amountDefault: "500000",
    showSecondary: true,
    showYears: true,
    secondaryLabel: "Current value",
    secondaryDefault: "780000",
  },
  "sip-vs-lumpsum-calculator": {
    title: "SIP vs lumpsum calculator",
    description: "Compare maturity values of a monthly SIP and a one-time lumpsum at the same expected return.",
    mode: "sipVsLump",
    amountLabel: "Monthly SIP",
    amountDefault: "10000",
    showSecondary: true,
    showRate: true,
    showYears: true,
    rateLabel: "Expected annual return %",
    secondaryLabel: "Lumpsum amount",
    secondaryDefault: "1200000",
  },
  "sip-step-up-calculator": {
    title: "SIP step-up calculator",
    description: "Project SIP maturity when you increase the monthly amount by a fixed % each year.",
    mode: "stepUp",
    amountLabel: "Starting monthly SIP",
    amountDefault: "10000",
    showRate: true,
    showYears: true,
    showStepUp: true,
    rateLabel: "Expected annual return %",
  },
  "swp-calculator": {
    title: "SWP calculator",
    description: "Simulate a Systematic Withdrawal Plan—monthly withdrawals from a corpus earning returns.",
    mode: "swp",
    amountLabel: "Initial corpus",
    amountDefault: "5000000",
    showSecondary: true,
    showRate: true,
    showYears: true,
    rateLabel: "Expected annual return %",
    secondaryLabel: "Monthly withdrawal",
    secondaryDefault: "25000",
  },
  "stp-calculator": {
    title: "STP calculator",
    description: "Model monthly transfers from a source fund into a destination fund with different expected returns.",
    mode: "stp",
    amountLabel: "Source corpus",
    amountDefault: "1200000",
    showSecondary: true,
    showYears: true,
    showStpRates: true,
    secondaryLabel: "Monthly transfer",
    secondaryDefault: "10000",
  },
  "mutual-fund-expense-ratio-impact-calculator": {
    title: "Expense ratio impact calculator",
    description: "See how annual expense ratio reduces SIP maturity versus a gross (pre-expense) return.",
    mode: "expense",
    amountLabel: "Monthly SIP",
    amountDefault: "10000",
    showRate: true,
    showYears: true,
    showExpense: true,
    rateLabel: "Gross annual return %",
  },
  "cagr-calculator": {
    title: "CAGR calculator",
    description: "Calculate compound annual growth rate between an initial and final mutual fund value.",
    mode: "cagr",
    amountLabel: "Initial value",
    amountDefault: "100000",
    showSecondary: true,
    showYears: true,
    secondaryLabel: "Final value",
    secondaryDefault: "180000",
  },
  "xirr-calculator": {
    title: "XIRR calculator",
    description: "Estimate extended internal rate of return for a lumpsum and/or monthly SIP redeemed at a final value.",
    mode: "xirr",
    amountLabel: "Initial investment",
    amountDefault: "100000",
    showSecondary: true,
    showYears: true,
    showSipOptional: true,
    secondaryLabel: "Final / current value",
    secondaryDefault: "250000",
  },
};

const CURRENCIES: MutualFundCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function MutualFundCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MfSlug] ?? CONFIG["mutual-fund-returns-calculator"];
  const [currency, setCurrency] = useState<MutualFundCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(MUTUAL_FUND_URL.A, config.amountDefault));
  const [secondary, setSecondary] = useState(
    useLoanInitialInput(MUTUAL_FUND_URL.B, config.secondaryDefault ?? "10000"),
  );
  const [rate, setRate] = useState(useLoanInitialInput(MUTUAL_FUND_URL.R, "12"));
  const [years, setYears] = useState(useLoanInitialInput(MUTUAL_FUND_URL.Y, "10"));
  const [stepUp, setStepUp] = useState(useLoanInitialInput(MUTUAL_FUND_URL.S, "10"));
  const [expense, setExpense] = useState(useLoanInitialInput(MUTUAL_FUND_URL.E, "1.5"));
  const [sourceRate, setSourceRate] = useState(useLoanInitialInput(MUTUAL_FUND_URL.C, "6"));
  const [destRate, setDestRate] = useState(useLoanInitialInput(MUTUAL_FUND_URL.D, "12"));
  const [monthlySip, setMonthlySip] = useState(useLoanInitialInput(MUTUAL_FUND_URL.W, "0"));

  const fmt = useCallback((n: number) => formatMutualFundMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [MUTUAL_FUND_URL.A]: amount,
      [MUTUAL_FUND_URL.B]: secondary,
      [MUTUAL_FUND_URL.R]: rate,
      [MUTUAL_FUND_URL.Y]: years,
      [MUTUAL_FUND_URL.S]: stepUp,
      [MUTUAL_FUND_URL.E]: expense,
      [MUTUAL_FUND_URL.C]: sourceRate,
      [MUTUAL_FUND_URL.D]: destRate,
      [MUTUAL_FUND_URL.W]: monthlySip,
    }),
    [amount, secondary, rate, years, stepUp, expense, sourceRate, destRate, monthlySip],
  );

  useLoanUrlSync(shareParams, [amount, secondary, rate, years, stepUp, expense, sourceRate, destRate, monthlySip]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "returns": {
        const a = parsePositive(amount, config.amountLabel);
        const b = parsePositive(secondary, config.secondaryLabel ?? "Current value");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        if (!y.ok) return { error: y.error };
        const computed = mutualFundReturns({ invested: a.value, currentValue: b.value, years: y.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.cagrPercent),
          primaryLabel: "CAGR",
          rows: [
            { label: "Invested", value: fmt(computed.invested) },
            { label: "Current value", value: fmt(computed.currentValue) },
            { label: "Absolute gain", value: fmt(computed.absoluteGain) },
            { label: "Absolute return", value: pct(computed.absoluteReturnPercent) },
            { label: "CAGR", value: pct(computed.cagrPercent) },
          ],
        };
      }
      case "sipVsLump": {
        const sip = parsePositive(amount, config.amountLabel);
        const lump = parsePositive(secondary, config.secondaryLabel ?? "Lumpsum");
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        if (!sip.ok) return { error: sip.error };
        if (!lump.ok) return { error: lump.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = sipVsLumpsum({
          monthlySip: sip.value,
          lumpsumAmount: lump.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        const winner =
          computed.better === "sip" ? "SIP leads" : computed.better === "lumpsum" ? "Lumpsum leads" : "About equal";
        return {
          primary: winner,
          primaryLabel: "Result at same return assumption",
          rows: [
            { label: "SIP invested", value: fmt(computed.sipInvested) },
            { label: "SIP maturity", value: fmt(computed.sipFutureValue) },
            { label: "SIP gains", value: fmt(computed.sipGains) },
            { label: "Lumpsum invested", value: fmt(computed.lumpsumInvested) },
            { label: "Lumpsum maturity", value: fmt(computed.lumpsumFutureValue) },
            { label: "Lumpsum gains", value: fmt(computed.lumpsumGains) },
            { label: "Difference (SIP − lumpsum)", value: fmt(computed.difference) },
          ],
        };
      }
      case "stepUp": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        const s = parseAprPercent(stepUp, "Step-up %");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        if (!s.ok) return { error: s.error };
        const computed = sipStepUp({
          startingMonthly: a.value,
          annualRatePercent: r.value,
          years: y.value,
          stepUpPercent: s.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.futureValue),
          primaryLabel: "Estimated maturity value",
          rows: [
            { label: "Starting SIP", value: fmt(computed.startingMonthly) },
            { label: "Ending monthly SIP", value: fmt(computed.endingMonthly) },
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Gains", value: fmt(computed.gains) },
            { label: "Maturity value", value: fmt(computed.futureValue) },
          ],
        };
      }
      case "swp": {
        const a = parsePositive(amount, config.amountLabel);
        const w = parsePositive(secondary, config.secondaryLabel ?? "Monthly withdrawal");
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!w.ok) return { error: w.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = swpCalc({
          initialCorpus: a.value,
          monthlyWithdrawal: w.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.depleted ? "Corpus depleted" : fmt(computed.endingCorpus),
          primaryLabel: computed.depleted ? `Ran out after ~${computed.monthsSurvived} months` : "Ending corpus",
          rows: [
            { label: "Initial corpus", value: fmt(computed.initialCorpus) },
            { label: "Monthly withdrawal", value: fmt(computed.monthlyWithdrawal) },
            { label: "Total withdrawn", value: fmt(computed.totalWithdrawn) },
            { label: "Ending corpus", value: fmt(computed.endingCorpus) },
            { label: "Months simulated", value: String(computed.monthsSurvived) },
          ],
        };
      }
      case "stp": {
        const a = parsePositive(amount, config.amountLabel);
        const t = parsePositive(secondary, config.secondaryLabel ?? "Monthly transfer");
        const y = parsePositive(years, "Years");
        const sr = parseAprPercent(sourceRate, "Source return %");
        const dr = parseAprPercent(destRate, "Destination return %");
        if (!a.ok) return { error: a.error };
        if (!t.ok) return { error: t.error };
        if (!y.ok) return { error: y.error };
        if (!sr.ok) return { error: sr.error };
        if (!dr.ok) return { error: dr.error };
        const computed = stpCalc({
          sourceCorpus: a.value,
          monthlyTransfer: t.value,
          sourceRatePercent: sr.value,
          destinationRatePercent: dr.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalEnding),
          primaryLabel: "Combined ending value",
          rows: [
            { label: "Source ending", value: fmt(computed.sourceEnding) },
            { label: "Destination ending", value: fmt(computed.destinationEnding) },
            { label: "Total transferred", value: fmt(computed.totalTransferred) },
            { label: "Combined total", value: fmt(computed.totalEnding) },
          ],
        };
      }
      case "expense": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Gross return %");
        const e = parseAprPercent(expense, "Expense ratio %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!e.ok) return { error: e.error };
        if (!y.ok) return { error: y.error };
        const computed = expenseRatioImpact({
          monthlySip: a.value,
          grossReturnPercent: r.value,
          expenseRatioPercent: e.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.costOfExpenses),
          primaryLabel: "Estimated cost of expense ratio",
          rows: [
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Gross maturity", value: fmt(computed.grossFutureValue) },
            { label: "Net maturity (after ER)", value: fmt(computed.netFutureValue) },
            { label: "Cost of expenses", value: fmt(computed.costOfExpenses) },
            { label: "Net return used", value: pct(computed.netReturnPercent) },
          ],
        };
      }
      case "cagr": {
        const a = parsePositive(amount, config.amountLabel);
        const b = parsePositive(secondary, config.secondaryLabel ?? "Final value");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        if (!y.ok) return { error: y.error };
        const computed = cagrCalc({ initialValue: a.value, finalValue: b.value, years: y.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.cagrPercent),
          primaryLabel: "CAGR",
          rows: [
            { label: "Initial value", value: fmt(computed.initialValue) },
            { label: "Final value", value: fmt(computed.finalValue) },
            { label: "Years", value: String(computed.years) },
            { label: "Absolute return", value: pct(computed.absoluteReturnPercent) },
            { label: "CAGR", value: pct(computed.cagrPercent) },
          ],
        };
      }
      case "xirr": {
        const a = parseNonNegative(amount, config.amountLabel);
        const b = parsePositive(secondary, config.secondaryLabel ?? "Final value");
        const y = parsePositive(years, "Years");
        const sip = parseNonNegative(monthlySip, "Monthly SIP");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        if (!y.ok) return { error: y.error };
        if (!sip.ok) return { error: sip.error };
        const computed = xirrMutualFund({
          initialInvestment: a.value,
          monthlySip: sip.value,
          finalValue: b.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        const invested = a.value + sip.value * Math.round(y.value * 12);
        return {
          primary: pct(computed.xirrPercent),
          primaryLabel: "XIRR (approx.)",
          rows: [
            { label: "Initial investment", value: fmt(a.value) },
            { label: "Monthly SIP", value: fmt(sip.value) },
            { label: "Total invested (approx.)", value: fmt(invested) },
            { label: "Final value", value: fmt(b.value) },
            { label: "XIRR", value: pct(computed.xirrPercent) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amount, config, destRate, expense, fmt, monthlySip, rate, secondary, sourceRate, stepUp, years]);

  const showCurrency = true;

  return (
    <CalculatorShell
      title={config.title}
      description={config.description}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.primary}</p>
            </div>
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              {result.rows.map((row) => (
                <Row key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </div>
        )
      }
    >
      {showCurrency ? (
        <div className="mb-4">
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as MutualFundCurrencyCode)}
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" />
        </div>

        {config.showSecondary ? (
          <div>
            <FieldLabel htmlFor="secondary">{config.secondaryLabel}</FieldLabel>
            <FieldInput id="secondary" inputMode="decimal" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showSipOptional ? (
          <div>
            <FieldLabel htmlFor="monthlySip">Monthly SIP (0 if none)</FieldLabel>
            <FieldInput id="monthlySip" inputMode="decimal" value={monthlySip} onChange={(e) => setMonthlySip(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showRate ? (
          <div>
            <FieldLabel htmlFor="rate">{config.rateLabel ?? "Annual return %"}</FieldLabel>
            <FieldInput id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showStpRates ? (
          <>
            <div>
              <FieldLabel htmlFor="sourceRate">Source fund return %</FieldLabel>
              <FieldInput id="sourceRate" inputMode="decimal" value={sourceRate} onChange={(e) => setSourceRate(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="destRate">Destination fund return %</FieldLabel>
              <FieldInput id="destRate" inputMode="decimal" value={destRate} onChange={(e) => setDestRate(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showStepUp ? (
          <div>
            <FieldLabel htmlFor="stepUp">Annual step-up %</FieldLabel>
            <FieldInput id="stepUp" inputMode="decimal" value={stepUp} onChange={(e) => setStepUp(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showExpense ? (
          <div>
            <FieldLabel htmlFor="expense">Expense ratio % (annual)</FieldLabel>
            <FieldInput id="expense" inputMode="decimal" value={expense} onChange={(e) => setExpense(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showYears ? (
          <div>
            <FieldLabel htmlFor="years">Years</FieldLabel>
            <FieldInput id="years" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className="mt-2" />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
