"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { compareFlatVsReducing } from "@/lib/calculators/emiInverse";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { InterestRateConversionCurrencyCode } from "@/lib/calculators/interestRateConversion";
import {
  INTEREST_RATE_CONVERSION_URL,
  aprFromFees,
  apyFromNominal,
  formatInterestRateConversionMoney,
  monthlyAnnualInterestConverter,
  nominalVsEffective,
} from "@/lib/calculators/interestRateConversion";

type RateSlug =
  | "apr-calculator"
  | "apy-calculator"
  | "nominal-vs-effective-interest-calculator"
  | "monthly-annual-interest-converter"
  | "reducing-vs-flat-rate-converter";

type Mode = "apr" | "apy" | "nominalEffective" | "monthlyAnnual" | "flatReducing";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  yDefault: string;
  mDefault: string;
  nDefault: string;
};

const CONFIG: Record<RateSlug, Config> = {
  "apr-calculator": {
    title: "APR calculator",
    description: "Estimate APR from principal, interest rate, fees, and term.",
    mode: "apr",
    aDefault: "500000",
    bDefault: "15000",
    rDefault: "10",
    yDefault: "3",
    mDefault: "4",
    nDefault: "0",
  },
  "apy-calculator": {
    title: "APY calculator",
    description: "Convert nominal rate to APY given compounding frequency.",
    mode: "apy",
    aDefault: "0",
    bDefault: "0",
    rDefault: "7",
    yDefault: "1",
    mDefault: "4",
    nDefault: "0",
  },
  "nominal-vs-effective-interest-calculator": {
    title: "Nominal vs effective interest calculator",
    description: "Compare nominal and effective (APY) rates.",
    mode: "nominalEffective",
    aDefault: "0",
    bDefault: "0",
    rDefault: "8",
    yDefault: "1",
    mDefault: "12",
    nDefault: "0",
  },
  "monthly-annual-interest-converter": {
    title: "Monthly ↔ annual interest converter",
    description: "Simple conversion between monthly and annual interest rates.",
    mode: "monthlyAnnual",
    aDefault: "0",
    bDefault: "0",
    rDefault: "1.5",
    yDefault: "1",
    mDefault: "monthly-to-annual",
    nDefault: "0",
  },
  "reducing-vs-flat-rate-converter": {
    title: "Reducing vs flat rate converter",
    description: "Compare flat vs reducing balance EMI and total interest.",
    mode: "flatReducing",
    aDefault: "1000000",
    bDefault: "12",
    rDefault: "10",
    yDefault: "1",
    mDefault: "60",
    nDefault: "0",
  },
};

const CURRENCIES: InterestRateConversionCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function InterestRateConversionCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as RateSlug] ?? CONFIG["apr-calculator"];
  const [currency, setCurrency] = useState<InterestRateConversionCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(INTEREST_RATE_CONVERSION_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(INTEREST_RATE_CONVERSION_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(INTEREST_RATE_CONVERSION_URL.R, config.rDefault));
  const [y, setY] = useState(useLoanInitialInput(INTEREST_RATE_CONVERSION_URL.Y, config.yDefault));
  const [m, setM] = useState(useLoanInitialInput(INTEREST_RATE_CONVERSION_URL.M, config.mDefault));
  const [convMode, setConvMode] = useState<"monthly-to-annual" | "annual-to-monthly">(
    (useLoanInitialInput(INTEREST_RATE_CONVERSION_URL.M, config.mDefault) as
      | "monthly-to-annual"
      | "annual-to-monthly") || "monthly-to-annual",
  );

  const fmt = useCallback((n: number) => formatInterestRateConversionMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(4)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [INTEREST_RATE_CONVERSION_URL.A]: a,
      [INTEREST_RATE_CONVERSION_URL.B]: b,
      [INTEREST_RATE_CONVERSION_URL.R]: r,
      [INTEREST_RATE_CONVERSION_URL.Y]: y,
    };
    if (config.mode === "monthlyAnnual") {
      return { ...base, [INTEREST_RATE_CONVERSION_URL.M]: convMode };
    }
    return { ...base, [INTEREST_RATE_CONVERSION_URL.M]: m };
  }, [a, b, r, y, m, convMode, config.mode]);

  useLoanUrlSync(shareParams, [a, b, r, y, m, convMode]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "apr": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Interest rate %");
        const feesP = parseNonNegative(b, "Fees");
        const yearsP = parsePositive(y, "Years");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!feesP.ok) return { error: feesP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = aprFromFees({
          principal: prinP.value,
          annualInterestPercent: rateP.value,
          fees: feesP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.aprPercent),
          primaryLabel: "APR (simplified)",
          rows: [
            { label: "Principal", value: fmt(prinP.value) },
            { label: "Total cost (interest + fees)", value: fmt(computed.totalCost) },
            { label: "APR", value: pct(computed.aprPercent) },
          ],
        };
      }
      case "apy": {
        const nomP = parseAprPercent(r, "Nominal rate %");
        const compP = parsePositive(m, "Compounds per year");
        if (!nomP.ok) return { error: nomP.error };
        if (!compP.ok) return { error: compP.error };
        const computed = apyFromNominal({
          nominalRatePercent: nomP.value,
          compoundsPerYear: compP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.apyPercent),
          primaryLabel: "APY",
          rows: [
            { label: "Nominal rate", value: pct(nomP.value) },
            { label: "Compounds / year", value: String(compP.value) },
            { label: "APY", value: pct(computed.apyPercent) },
          ],
        };
      }
      case "nominalEffective": {
        const nomP = parseAprPercent(r, "Nominal rate %");
        const compP = parsePositive(m, "Compounds per year");
        if (!nomP.ok) return { error: nomP.error };
        if (!compP.ok) return { error: compP.error };
        const computed = nominalVsEffective({
          nominalRatePercent: nomP.value,
          compoundsPerYear: compP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.effectiveRatePercent),
          primaryLabel: "Effective rate",
          rows: [
            { label: "Nominal rate", value: pct(computed.nominalRatePercent) },
            { label: "Effective rate", value: pct(computed.effectiveRatePercent) },
            { label: "Difference", value: `${computed.differencePoints.toFixed(4)} pts` },
          ],
        };
      }
      case "monthlyAnnual": {
        const rateP = parseAprPercent(r, "Rate %");
        if (!rateP.ok) return { error: rateP.error };
        const computed = monthlyAnnualInterestConverter({
          mode: convMode,
          ratePercent: rateP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.resultPercent),
          primaryLabel: "Converted rate",
          rows: [
            { label: "Input rate", value: pct(rateP.value) },
            { label: "Mode", value: convMode },
            { label: "Result", value: pct(computed.resultPercent) },
            { label: "Formula", value: computed.formula },
          ],
        };
      }
      case "flatReducing": {
        const prinP = parsePositive(a, "Principal");
        const flatP = parseAprPercent(b, "Flat rate %");
        const redP = parseAprPercent(r, "Reducing APR %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!flatP.ok) return { error: flatP.error };
        if (!redP.ok) return { error: redP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = compareFlatVsReducing({
          principal: prinP.value,
          flatAnnualPercent: flatP.value,
          reducingAprPercent: redP.value,
          termMonths: termP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalPaidDifference),
          primaryLabel: "Extra paid (flat − reducing)",
          rows: [
            { label: "Flat EMI", value: fmt(computed.flat.emi) },
            { label: "Reducing EMI", value: fmt(computed.reducing.emi) },
            { label: "Flat total interest", value: fmt(computed.flat.totalInterest) },
            { label: "Reducing total interest", value: fmt(computed.reducing.totalInterest) },
            { label: "Interest difference", value: fmt(computed.interestDifference) },
            {
              label: "Flat-equiv. reducing APR",
              value:
                computed.flatEquivalentReducingApr !== null
                  ? pct(computed.flatEquivalentReducingApr)
                  : "—",
            },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, y, m, convMode, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="irc-currency">Currency</FieldLabel>
            <select
              id="irc-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as InterestRateConversionCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "apr" ? (
            <>
              <div>
                <FieldLabel htmlFor="irc-prin">Principal</FieldLabel>
                <FieldInput id="irc-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-rate">Annual interest rate %</FieldLabel>
                <FieldInput id="irc-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-fees">Total fees</FieldLabel>
                <FieldInput id="irc-fees" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-yrs">Years</FieldLabel>
                <FieldInput id="irc-yrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "apy" || config.mode === "nominalEffective" ? (
            <>
              <div>
                <FieldLabel htmlFor="irc-nom">Nominal rate %</FieldLabel>
                <FieldInput id="irc-nom" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-comp">Compounds per year</FieldLabel>
                <FieldInput id="irc-comp" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "monthlyAnnual" ? (
            <>
              <div>
                <FieldLabel htmlFor="irc-cmode">Conversion</FieldLabel>
                <select
                  id="irc-cmode"
                  className={selectCls}
                  value={convMode}
                  onChange={(ev) => setConvMode(ev.target.value as "monthly-to-annual" | "annual-to-monthly")}
                >
                  <option value="monthly-to-annual">Monthly → annual</option>
                  <option value="annual-to-monthly">Annual → monthly</option>
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="irc-crate">Input rate %</FieldLabel>
                <FieldInput id="irc-crate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "flatReducing" ? (
            <>
              <div>
                <FieldLabel htmlFor="irc-fprin">Principal</FieldLabel>
                <FieldInput id="irc-fprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-flat">Flat annual rate %</FieldLabel>
                <FieldInput id="irc-flat" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-red">Reducing APR %</FieldLabel>
                <FieldInput id="irc-red" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="irc-term">Term (months)</FieldLabel>
                <FieldInput id="irc-term" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
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
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
