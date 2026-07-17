"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import type { CoreInvestmentCurrencyCode } from "@/lib/calculators/coreInvestment";
import {
  CORE_INVESTMENT_URL,
  annualReturn,
  compoundInterestCalc,
  formatCoreInvestmentMoney,
  futureValueCalc,
  inflationAdjustedReturn,
  investmentGrowth,
  lumpsumInvestment,
  presentValueCalc,
  rateOfReturn,
  simpleInterestCalc,
  sipFutureValue,
} from "@/lib/calculators/coreInvestment";

type CoreInvSlug =
  | "sip-calculator"
  | "lumpsum-investment-calculator"
  | "compound-interest-calculator"
  | "simple-interest-calculator"
  | "investment-growth-calculator"
  | "future-value-calculator"
  | "present-value-calculator"
  | "rate-of-return-calculator"
  | "annual-return-calculator"
  | "inflation-adjusted-return-calculator";

type Mode =
  | "sip"
  | "lumpsum"
  | "compound"
  | "simple"
  | "growth"
  | "fv"
  | "pv"
  | "ror"
  | "annual"
  | "inflation";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  amountLabel: string;
  amountDefault: string;
  showRate?: boolean;
  showYears?: boolean;
  showMonthly?: boolean;
  showCompounds?: boolean;
  showFinal?: boolean;
  showInflation?: boolean;
  rateLabel?: string;
  secondaryLabel?: string;
  secondaryDefault?: string;
};

const CONFIG: Record<CoreInvSlug, Config> = {
  "sip-calculator": {
    title: "SIP calculator",
    description: "Estimate the future value of a monthly Systematic Investment Plan at a fixed expected return.",
    mode: "sip",
    amountLabel: "Monthly investment",
    amountDefault: "10000",
    showRate: true,
    showYears: true,
    rateLabel: "Expected annual return %",
  },
  "lumpsum-investment-calculator": {
    title: "Lumpsum investment calculator",
    description: "Project growth of a one-time investment with annual compounding.",
    mode: "lumpsum",
    amountLabel: "Investment amount",
    amountDefault: "100000",
    showRate: true,
    showYears: true,
    rateLabel: "Expected annual return %",
  },
  "compound-interest-calculator": {
    title: "Compound interest calculator",
    description: "Calculate future value and interest earned with flexible compounding frequency.",
    mode: "compound",
    amountLabel: "Principal",
    amountDefault: "100000",
    showRate: true,
    showYears: true,
    showCompounds: true,
    rateLabel: "Annual interest rate %",
  },
  "simple-interest-calculator": {
    title: "Simple interest calculator",
    description: "Compute simple interest using P × R × T ÷ 100.",
    mode: "simple",
    amountLabel: "Principal",
    amountDefault: "100000",
    showRate: true,
    showYears: true,
    rateLabel: "Annual interest rate %",
  },
  "investment-growth-calculator": {
    title: "Investment growth calculator",
    description: "Combine an initial lumpsum with monthly contributions to see total portfolio growth.",
    mode: "growth",
    amountLabel: "Initial amount",
    amountDefault: "100000",
    showMonthly: true,
    showRate: true,
    showYears: true,
    rateLabel: "Expected annual return %",
    secondaryLabel: "Monthly contribution",
    secondaryDefault: "5000",
  },
  "future-value-calculator": {
    title: "Future value calculator",
    description: "Find what a present amount is worth after compounding for a period of time.",
    mode: "fv",
    amountLabel: "Present value",
    amountDefault: "100000",
    showRate: true,
    showYears: true,
    showCompounds: true,
    rateLabel: "Annual rate %",
  },
  "present-value-calculator": {
    title: "Present value calculator",
    description: "Discount a future amount back to today's value at a given rate.",
    mode: "pv",
    amountLabel: "Future value",
    amountDefault: "200000",
    showRate: true,
    showYears: true,
    showCompounds: true,
    rateLabel: "Discount rate %",
  },
  "rate-of-return-calculator": {
    title: "Rate of return calculator",
    description: "Measure absolute and annualized return between an initial and final portfolio value.",
    mode: "ror",
    amountLabel: "Initial value",
    amountDefault: "100000",
    showFinal: true,
    showYears: true,
    secondaryLabel: "Final value",
    secondaryDefault: "180000",
  },
  "annual-return-calculator": {
    title: "Annual return calculator",
    description: "Calculate CAGR (compound annual growth rate) over a holding period.",
    mode: "annual",
    amountLabel: "Initial value",
    amountDefault: "100000",
    showFinal: true,
    showYears: true,
    secondaryLabel: "Final value",
    secondaryDefault: "180000",
  },
  "inflation-adjusted-return-calculator": {
    title: "Inflation adjusted return calculator",
    description: "Convert a nominal return into real (inflation-adjusted) purchasing-power return.",
    mode: "inflation",
    amountLabel: "Nominal return %",
    amountDefault: "12",
    showInflation: true,
    secondaryLabel: "Inflation rate %",
    secondaryDefault: "5",
  },
};

const CURRENCIES: CoreInvestmentCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function CoreInvestmentCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CoreInvSlug] ?? CONFIG["sip-calculator"];
  const [currency, setCurrency] = useState<CoreInvestmentCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(CORE_INVESTMENT_URL.A, config.amountDefault));
  const [secondary, setSecondary] = useState(
    useLoanInitialInput(
      CORE_INVESTMENT_URL.B,
      config.secondaryDefault ?? (config.mode === "inflation" ? "5" : "5000"),
    ),
  );
  const [rate, setRate] = useState(useLoanInitialInput(CORE_INVESTMENT_URL.R, "12"));
  const [years, setYears] = useState(useLoanInitialInput(CORE_INVESTMENT_URL.Y, "10"));
  const [compounds, setCompounds] = useState(useLoanInitialInput(CORE_INVESTMENT_URL.N, "1"));

  const fmt = useCallback((n: number) => formatCoreInvestmentMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [CORE_INVESTMENT_URL.A]: amount,
      [CORE_INVESTMENT_URL.B]: secondary,
      [CORE_INVESTMENT_URL.R]: rate,
      [CORE_INVESTMENT_URL.Y]: years,
      [CORE_INVESTMENT_URL.N]: compounds,
    }),
    [amount, secondary, rate, years, compounds],
  );

  useLoanUrlSync(shareParams, [amount, secondary, rate, years, compounds]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "sip": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = sipFutureValue({
          monthlyInvestment: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.futureValue),
          primaryLabel: "Estimated maturity value",
          rows: [
            { label: "Monthly SIP", value: fmt(computed.monthlyInvestment) },
            { label: "Duration", value: `${computed.years} years (${computed.months} months)` },
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Estimated gains", value: fmt(computed.gains) },
            { label: "Maturity value", value: fmt(computed.futureValue) },
          ],
        };
      }
      case "lumpsum": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = lumpsumInvestment({
          principal: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.futureValue),
          primaryLabel: "Future value",
          rows: [
            { label: "Invested", value: fmt(computed.principal) },
            { label: "Gains", value: fmt(computed.gains) },
            { label: "Future value", value: fmt(computed.futureValue) },
            { label: "Years", value: String(computed.years) },
          ],
        };
      }
      case "compound": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Interest rate %");
        const y = parsePositive(years, "Years");
        const n = parsePositive(compounds, "Compounds per year");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        if (!n.ok) return { error: n.error };
        const computed = compoundInterestCalc({
          principal: a.value,
          annualRatePercent: r.value,
          years: y.value,
          compoundsPerYear: n.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.futureValue),
          primaryLabel: "Future value",
          rows: [
            { label: "Principal", value: fmt(a.value) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Future value", value: fmt(computed.futureValue) },
            { label: "Compounds/year", value: String(n.value) },
          ],
        };
      }
      case "simple": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Interest rate %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = simpleInterestCalc({
          principal: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.interest),
          primaryLabel: "Simple interest",
          rows: [
            { label: "Principal", value: fmt(computed.principal) },
            { label: "Interest", value: fmt(computed.interest) },
            { label: "Total amount", value: fmt(computed.totalAmount) },
            { label: "Formula", value: "P × R × T ÷ 100" },
          ],
        };
      }
      case "growth": {
        const a = parsePositive(amount, config.amountLabel);
        const m = parsePositive(secondary, config.secondaryLabel ?? "Monthly contribution");
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!m.ok) return { error: m.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = investmentGrowth({
          initialAmount: a.value,
          monthlyContribution: m.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.futureValue),
          primaryLabel: "Projected portfolio value",
          rows: [
            { label: "Initial amount", value: fmt(computed.initialAmount) },
            { label: "Monthly contribution", value: fmt(computed.monthlyContribution) },
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Gains", value: fmt(computed.gains) },
            { label: "Future value", value: fmt(computed.futureValue) },
          ],
        };
      }
      case "fv": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Rate %");
        const y = parsePositive(years, "Years");
        const n = parsePositive(compounds, "Compounds per year");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        if (!n.ok) return { error: n.error };
        const computed = futureValueCalc({
          presentValue: a.value,
          annualRatePercent: r.value,
          years: y.value,
          compoundsPerYear: n.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.futureValue),
          primaryLabel: "Future value",
          rows: [
            { label: "Present value", value: fmt(computed.presentValue) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Future value", value: fmt(computed.futureValue) },
          ],
        };
      }
      case "pv": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Discount rate %");
        const y = parsePositive(years, "Years");
        const n = parsePositive(compounds, "Compounds per year");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        if (!n.ok) return { error: n.error };
        const computed = presentValueCalc({
          futureValue: a.value,
          annualRatePercent: r.value,
          years: y.value,
          compoundsPerYear: n.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.presentValue),
          primaryLabel: "Present value",
          rows: [
            { label: "Future value", value: fmt(computed.futureValue) },
            { label: "Present value", value: fmt(computed.presentValue) },
            { label: "Discount (time value)", value: fmt(computed.discount) },
          ],
        };
      }
      case "ror": {
        const a = parsePositive(amount, config.amountLabel);
        const f = parsePositive(secondary, config.secondaryLabel ?? "Final value");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!f.ok) return { error: f.error };
        if (!y.ok) return { error: y.error };
        const computed = rateOfReturn({
          initialValue: a.value,
          finalValue: f.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.absoluteReturnPercent),
          primaryLabel: "Absolute return",
          rows: [
            { label: "Initial value", value: fmt(computed.initialValue) },
            { label: "Final value", value: fmt(computed.finalValue) },
            { label: "Absolute gain", value: fmt(computed.absoluteReturn) },
            { label: "Absolute return", value: pct(computed.absoluteReturnPercent) },
            {
              label: "Annualized return",
              value:
                computed.annualizedReturnPercent !== null
                  ? pct(computed.annualizedReturnPercent)
                  : "—",
            },
          ],
        };
      }
      case "annual": {
        const a = parsePositive(amount, config.amountLabel);
        const f = parsePositive(secondary, config.secondaryLabel ?? "Final value");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!f.ok) return { error: f.error };
        if (!y.ok) return { error: y.error };
        const computed = annualReturn({
          initialValue: a.value,
          finalValue: f.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.cagrPercent),
          primaryLabel: "CAGR (annualized)",
          rows: [
            { label: "Initial value", value: fmt(computed.initialValue) },
            { label: "Final value", value: fmt(computed.finalValue) },
            { label: "Holding period", value: `${computed.years} years` },
            { label: "Absolute return", value: pct(computed.absoluteReturnPercent) },
            { label: "CAGR", value: pct(computed.cagrPercent) },
          ],
        };
      }
      case "inflation": {
        const nom = parseAprPercent(amount, "Nominal return %");
        const inf = parseAprPercent(secondary, "Inflation rate %");
        if (!nom.ok) return { error: nom.error };
        if (!inf.ok) return { error: inf.error };
        const computed = inflationAdjustedReturn({
          nominalReturnPercent: nom.value,
          inflationPercent: inf.value,
        });
        return {
          primary: pct(computed.realReturnPercent),
          primaryLabel: "Real (inflation-adjusted) return",
          rows: [
            { label: "Nominal return", value: pct(computed.nominalReturnPercent) },
            { label: "Inflation", value: pct(computed.inflationPercent) },
            { label: "Real return", value: pct(computed.realReturnPercent) },
            { label: "Formula", value: "((1+n)/(1+i))−1" },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amount, compounds, config, fmt, rate, secondary, years]);

  const showCurrency = config.mode !== "inflation";

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
            onChange={(e) => setCurrency(e.target.value as CoreInvestmentCurrencyCode)}
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

        {config.showMonthly || config.showFinal || config.showInflation ? (
          <div>
            <FieldLabel htmlFor="secondary">{config.secondaryLabel}</FieldLabel>
            <FieldInput
              id="secondary"
              inputMode="decimal"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showRate ? (
          <div>
            <FieldLabel htmlFor="rate">{config.rateLabel ?? "Annual rate %"}</FieldLabel>
            <FieldInput id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showYears ? (
          <div>
            <FieldLabel htmlFor="years">Years</FieldLabel>
            <FieldInput id="years" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showCompounds ? (
          <div>
            <FieldLabel htmlFor="compounds">Compounds per year</FieldLabel>
            <FieldInput
              id="compounds"
              inputMode="decimal"
              value={compounds}
              onChange={(e) => setCompounds(e.target.value)}
              className="mt-2"
            />
            <p className="mt-1 text-xs text-[var(--muted)]">1 = annual · 4 = quarterly · 12 = monthly</p>
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
