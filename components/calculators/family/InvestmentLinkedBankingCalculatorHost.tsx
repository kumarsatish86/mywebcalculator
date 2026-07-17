"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { InvestmentLinkedBankingCurrencyCode } from "@/lib/calculators/investmentLinkedBanking";
import {
  INVESTMENT_LINKED_BANKING_URL,
  fdVsMutualFund,
  fdVsRd,
  formatInvestmentLinkedBankingMoney,
  inflationImpactOnSavings,
  realInterestRate,
  savingsVsInvestment,
  taxOnInterest,
} from "@/lib/calculators/investmentLinkedBanking";

type InvestSlug =
  | "fd-vs-rd-calculator"
  | "fd-vs-mutual-fund-calculator"
  | "savings-vs-investment-calculator"
  | "inflation-impact-on-savings-calculator"
  | "real-interest-rate-calculator"
  | "tax-on-interest-calculator";

type Mode = "fdVsRd" | "fdVsMf" | "savingsVsInv" | "inflation" | "realRate" | "taxInterest";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  yDefault: string;
};

const CONFIG: Record<InvestSlug, Config> = {
  "fd-vs-rd-calculator": {
    title: "FD vs RD calculator",
    description: "Compare fixed deposit vs recurring deposit maturity for the same amount and rate.",
    mode: "fdVsRd",
    aDefault: "5000",
    bDefault: "0",
    rDefault: "7",
    yDefault: "3",
  },
  "fd-vs-mutual-fund-calculator": {
    title: "FD vs mutual fund calculator",
    description: "Compare FD maturity against a mutual fund return assumption.",
    mode: "fdVsMf",
    aDefault: "500000",
    bDefault: "12",
    rDefault: "7",
    yDefault: "5",
  },
  "savings-vs-investment-calculator": {
    title: "Savings vs investment calculator",
    description: "Future value of monthly savings at bank rate vs investment return.",
    mode: "savingsVsInv",
    aDefault: "10000",
    bDefault: "12",
    rDefault: "4",
    yDefault: "10",
  },
  "inflation-impact-on-savings-calculator": {
    title: "Inflation impact on savings calculator",
    description: "Nominal growth vs inflation-adjusted purchasing power.",
    mode: "inflation",
    aDefault: "500000",
    bDefault: "6",
    rDefault: "7",
    yDefault: "5",
  },
  "real-interest-rate-calculator": {
    title: "Real interest rate calculator",
    description: "Inflation-adjusted real rate from nominal return and inflation.",
    mode: "realRate",
    aDefault: "0",
    bDefault: "6",
    rDefault: "7",
    yDefault: "1",
  },
  "tax-on-interest-calculator": {
    title: "Tax on interest calculator",
    description: "Tax on interest income and after-tax amount at a flat rate.",
    mode: "taxInterest",
    aDefault: "50000",
    bDefault: "0",
    rDefault: "30",
    yDefault: "1",
  },
};

const CURRENCIES: InvestmentLinkedBankingCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function InvestmentLinkedBankingCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as InvestSlug] ?? CONFIG["fd-vs-rd-calculator"];
  const [currency, setCurrency] = useState<InvestmentLinkedBankingCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(INVESTMENT_LINKED_BANKING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(INVESTMENT_LINKED_BANKING_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(INVESTMENT_LINKED_BANKING_URL.R, config.rDefault));
  const [y, setY] = useState(useLoanInitialInput(INVESTMENT_LINKED_BANKING_URL.Y, config.yDefault));

  const fmt = useCallback((n: number) => formatInvestmentLinkedBankingMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [INVESTMENT_LINKED_BANKING_URL.A]: a,
      [INVESTMENT_LINKED_BANKING_URL.B]: b,
      [INVESTMENT_LINKED_BANKING_URL.R]: r,
      [INVESTMENT_LINKED_BANKING_URL.Y]: y,
    }),
    [a, b, r, y],
  );

  useLoanUrlSync(shareParams, [a, b, r, y]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "fdVsRd": {
        const amtP = parsePositive(a, "Amount");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Years");
        if (!amtP.ok) return { error: amtP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = fdVsRd({
          principalOrMonthly: amtP.value,
          annualRatePercent: rateP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.winner,
          primaryLabel: "Better option",
          rows: [
            { label: "FD maturity", value: fmt(computed.fdMaturity) },
            { label: "RD maturity", value: fmt(computed.rdMaturity) },
            { label: "FD interest", value: fmt(computed.fdInterest) },
            { label: "RD interest", value: fmt(computed.rdInterest) },
            { label: "RD total deposited", value: fmt(computed.rdTotalDeposited) },
          ],
        };
      }
      case "fdVsMf": {
        const prinP = parsePositive(a, "Principal");
        const fdRateP = parseAprPercent(r, "FD rate %");
        const mfRateP = parseAprPercent(b, "MF return %");
        const yearsP = parsePositive(y, "Years");
        if (!prinP.ok) return { error: prinP.error };
        if (!fdRateP.ok) return { error: fdRateP.error };
        if (!mfRateP.ok) return { error: mfRateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = fdVsMutualFund({
          principal: prinP.value,
          fdRatePercent: fdRateP.value,
          mfReturnPercent: mfRateP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.winner,
          primaryLabel: "Better option",
          rows: [
            { label: "FD maturity", value: fmt(computed.fdMaturity) },
            { label: "MF maturity (assumed)", value: fmt(computed.mfMaturity) },
            { label: "Difference (MF − FD)", value: fmt(computed.difference) },
          ],
        };
      }
      case "savingsVsInv": {
        const monthlyP = parsePositive(a, "Monthly amount");
        const savRateP = parseAprPercent(r, "Savings rate %");
        const invRateP = parseAprPercent(b, "Investment return %");
        const yearsP = parsePositive(y, "Years");
        if (!monthlyP.ok) return { error: monthlyP.error };
        if (!savRateP.ok) return { error: savRateP.error };
        if (!invRateP.ok) return { error: invRateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = savingsVsInvestment({
          monthlyAmount: monthlyP.value,
          savingsRatePercent: savRateP.value,
          investmentReturnPercent: invRateP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.difference),
          primaryLabel: "Extra from investing",
          rows: [
            { label: "Savings future value", value: fmt(computed.savingsFuture) },
            { label: "Investment future value", value: fmt(computed.investmentFuture) },
            { label: "Difference", value: fmt(computed.difference) },
          ],
        };
      }
      case "inflation": {
        const prinP = parsePositive(a, "Principal");
        const nomP = parseAprPercent(r, "Nominal rate %");
        const inflP = parseAprPercent(b, "Inflation %");
        const yearsP = parsePositive(y, "Years");
        if (!prinP.ok) return { error: prinP.error };
        if (!nomP.ok) return { error: nomP.error };
        if (!inflP.ok) return { error: inflP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = inflationImpactOnSavings({
          principal: prinP.value,
          nominalRatePercent: nomP.value,
          inflationPercent: inflP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.realPurchasingPower),
          primaryLabel: "Real purchasing power",
          rows: [
            { label: "Nominal future value", value: fmt(computed.nominalFuture) },
            { label: "Real purchasing power", value: fmt(computed.realPurchasingPower) },
            { label: "Eroded by inflation", value: fmt(computed.erodedByInflation) },
            { label: "Real rate", value: pct(computed.realRatePercent) },
          ],
        };
      }
      case "realRate": {
        const nomP = parseAprPercent(r, "Nominal rate %");
        const inflP = parseAprPercent(b, "Inflation %");
        if (!nomP.ok) return { error: nomP.error };
        if (!inflP.ok) return { error: inflP.error };
        const computed = realInterestRate({
          nominalRatePercent: nomP.value,
          inflationPercent: inflP.value,
        });
        return {
          primary: pct(computed.realRatePercent),
          primaryLabel: "Real interest rate",
          rows: [
            { label: "Nominal rate", value: pct(nomP.value) },
            { label: "Inflation", value: pct(inflP.value) },
            { label: "Real rate", value: pct(computed.realRatePercent) },
          ],
        };
      }
      case "taxInterest": {
        const interestP = parseNonNegative(a, "Interest income");
        const taxP = parseAprPercent(r, "Tax rate %");
        if (!interestP.ok) return { error: interestP.error };
        if (!taxP.ok) return { error: taxP.error };
        const computed = taxOnInterest({
          interestIncome: interestP.value,
          taxRatePercent: taxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.afterTaxInterest),
          primaryLabel: "After-tax interest",
          rows: [
            { label: "Gross interest", value: fmt(interestP.value) },
            { label: "Tax", value: fmt(computed.tax) },
            { label: "After-tax interest", value: fmt(computed.afterTaxInterest) },
            { label: "After-tax yield factor", value: computed.afterTaxYieldFactor.toFixed(4) },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, y, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="ilb-currency">Currency</FieldLabel>
            <select
              id="ilb-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as InvestmentLinkedBankingCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "fdVsRd" ? (
            <>
              <div>
                <FieldLabel htmlFor="ilb-amt">Lump sum / monthly deposit</FieldLabel>
                <FieldInput id="ilb-amt" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-rate">Annual rate %</FieldLabel>
                <FieldInput id="ilb-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-yrs">Years</FieldLabel>
                <FieldInput id="ilb-yrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fdVsMf" ? (
            <>
              <div>
                <FieldLabel htmlFor="ilb-prin">Principal</FieldLabel>
                <FieldInput id="ilb-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-fdr">FD rate %</FieldLabel>
                <FieldInput id="ilb-fdr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-mfr">MF return % / year</FieldLabel>
                <FieldInput id="ilb-mfr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-mfy">Years</FieldLabel>
                <FieldInput id="ilb-mfy" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "savingsVsInv" ? (
            <>
              <div>
                <FieldLabel htmlFor="ilb-mon">Monthly amount</FieldLabel>
                <FieldInput id="ilb-mon" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-sav">Savings rate %</FieldLabel>
                <FieldInput id="ilb-sav" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-inv">Investment return %</FieldLabel>
                <FieldInput id="ilb-inv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-svy">Years</FieldLabel>
                <FieldInput id="ilb-svy" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "inflation" ? (
            <>
              <div>
                <FieldLabel htmlFor="ilb-iprin">Principal</FieldLabel>
                <FieldInput id="ilb-iprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-nom">Nominal rate %</FieldLabel>
                <FieldInput id="ilb-nom" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-infl">Inflation %</FieldLabel>
                <FieldInput id="ilb-infl" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-iyrs">Years</FieldLabel>
                <FieldInput id="ilb-iyrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "realRate" ? (
            <>
              <div>
                <FieldLabel htmlFor="ilb-rrnom">Nominal rate %</FieldLabel>
                <FieldInput id="ilb-rrnom" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-rrinfl">Inflation %</FieldLabel>
                <FieldInput id="ilb-rrinfl" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "taxInterest" ? (
            <>
              <div>
                <FieldLabel htmlFor="ilb-int">Interest income</FieldLabel>
                <FieldInput id="ilb-int" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ilb-tax">Tax rate %</FieldLabel>
                <FieldInput id="ilb-tax" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
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
