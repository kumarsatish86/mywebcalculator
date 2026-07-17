"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { MortgagePropertyCurrencyCode } from "@/lib/calculators/mortgageProperty";
import {
  MORTGAGE_PROPERTY_URL,
  downPaymentCalc,
  formatMortgagePropertyMoney,
  homeAffordability,
  mortgageAmortization,
  mortgageCalc,
  refinanceCalc,
} from "@/lib/calculators/mortgageProperty";

type MortgageSlug =
  | "mortgage-calculator"
  | "down-payment-calculator"
  | "mortgage-amortization-calculator"
  | "refinance-calculator"
  | "home-affordability-calculator";

type Mode = "mortgage" | "downPayment" | "amortization" | "refinance" | "affordability";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  yDefault: string;
  mDefault: string;
  pDefault: string;
};

const CONFIG: Record<MortgageSlug, Config> = {
  "mortgage-calculator": {
    title: "Mortgage calculator",
    description: "Home loan EMI, total interest, and repayment from price and down payment.",
    mode: "mortgage",
    aDefault: "8000000",
    bDefault: "1600000",
    cDefault: "0",
    rDefault: "8.5",
    tDefault: "0",
    yDefault: "20",
    mDefault: "0",
    pDefault: "0",
  },
  "down-payment-calculator": {
    title: "Down payment calculator",
    description: "Down payment amount and loan amount from home price and percentage.",
    mode: "downPayment",
    aDefault: "6000000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "20",
    tDefault: "0",
    yDefault: "1",
    mDefault: "0",
    pDefault: "0",
  },
  "mortgage-amortization-calculator": {
    title: "Mortgage amortization calculator",
    description: "Month-by-month principal, interest, and balance with schedule preview.",
    mode: "amortization",
    aDefault: "6400000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "8.5",
    tDefault: "0",
    yDefault: "20",
    mDefault: "0",
    pDefault: "0",
  },
  "refinance-calculator": {
    title: "Refinance calculator",
    description: "Compare current vs new EMI, savings, and break-even on closing costs.",
    mode: "refinance",
    aDefault: "4500000",
    bDefault: "7.5",
    cDefault: "50000",
    rDefault: "9",
    tDefault: "0",
    yDefault: "1",
    mDefault: "180",
    pDefault: "0",
  },
  "home-affordability-calculator": {
    title: "Home affordability calculator",
    description: "Maximum home price from income, EMIs, housing ratio, and down payment.",
    mode: "affordability",
    aDefault: "150000",
    bDefault: "20000",
    cDefault: "8.5",
    rDefault: "40",
    tDefault: "1500000",
    yDefault: "20",
    mDefault: "0",
    pDefault: "0",
  },
};

const CURRENCIES: MortgagePropertyCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function MortgagePropertyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MortgageSlug] ?? CONFIG["mortgage-calculator"];
  const [currency, setCurrency] = useState<MortgagePropertyCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.T, config.tDefault));
  const [y, setY] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.Y, config.yDefault));
  const [m, setM] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.M, config.mDefault));
  const [p, setP] = useState(useLoanInitialInput(MORTGAGE_PROPERTY_URL.P, config.pDefault));

  const fmt = useCallback((n: number) => formatMortgagePropertyMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [MORTGAGE_PROPERTY_URL.A]: a,
      [MORTGAGE_PROPERTY_URL.B]: b,
      [MORTGAGE_PROPERTY_URL.C]: c,
      [MORTGAGE_PROPERTY_URL.R]: r,
      [MORTGAGE_PROPERTY_URL.T]: t,
      [MORTGAGE_PROPERTY_URL.Y]: y,
      [MORTGAGE_PROPERTY_URL.M]: m,
      [MORTGAGE_PROPERTY_URL.P]: p,
    }),
    [a, b, c, r, t, y, m, p],
  );

  useLoanUrlSync(shareParams, [a, b, c, r, t, y, m, p]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "mortgage": {
        const priceP = parsePositive(a, "Home price");
        const downP = parseNonNegative(b, "Down payment");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Term (years)");
        if (!priceP.ok) return { error: priceP.error };
        if (!downP.ok) return { error: downP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = mortgageCalc({
          homePrice: priceP.value,
          downPayment: downP.value,
          annualRatePercent: rateP.value,
          termYears: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.emi),
          primaryLabel: "Monthly EMI",
          rows: [
            { label: "Loan amount", value: fmt(computed.loanAmount) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Total paid", value: fmt(computed.totalPaid) },
          ],
        };
      }
      case "downPayment": {
        const priceP = parsePositive(a, "Home price");
        const pctP = parseAprPercent(r, "Down payment %");
        if (!priceP.ok) return { error: priceP.error };
        if (!pctP.ok) return { error: pctP.error };
        const computed = downPaymentCalc({
          homePrice: priceP.value,
          downPaymentPercent: pctP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.downPayment),
          primaryLabel: "Down payment",
          rows: [
            { label: "Home price", value: fmt(priceP.value) },
            { label: "Down payment %", value: pct(pctP.value) },
            { label: "Loan amount", value: fmt(computed.loanAmount) },
          ],
        };
      }
      case "amortization": {
        const prinP = parsePositive(a, "Loan principal");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Term (years)");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = mortgageAmortization({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termYears: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        const { rows: schedRows, hasGap } = previewSchedule(computed.rows);
        return {
          primary: fmt(computed.emi),
          primaryLabel: "Monthly EMI",
          rows: [
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Schedule rows", value: String(computed.rows.length) },
          ],
          schedule: schedRows.map((row) => ({
            label: `Month ${row.month}`,
            value: `P ${fmt(row.principal)} · I ${fmt(row.interest)} · bal ${fmt(row.balance)}`,
          })),
          scheduleGap: hasGap,
        };
      }
      case "refinance": {
        const remP = parsePositive(a, "Remaining principal");
        const curRateP = parseAprPercent(r, "Current rate %");
        const newRateP = parseAprPercent(b, "New rate %");
        const monthsP = parsePositive(m, "Remaining months");
        const costsP = parseNonNegative(c, "Closing costs");
        if (!remP.ok) return { error: remP.error };
        if (!curRateP.ok) return { error: curRateP.error };
        if (!newRateP.ok) return { error: newRateP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        if (!costsP.ok) return { error: costsP.error };
        const computed = refinanceCalc({
          remainingPrincipal: remP.value,
          currentRatePercent: curRateP.value,
          remainingMonths: monthsP.value,
          newRatePercent: newRateP.value,
          closingCosts: costsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.monthlySavings),
          primaryLabel: "Monthly savings",
          rows: [
            { label: "Current EMI", value: fmt(computed.currentEmi) },
            { label: "New EMI", value: fmt(computed.newEmi) },
            {
              label: "Break-even months",
              value: computed.breakEvenMonths !== null ? String(computed.breakEvenMonths) : "—",
            },
            { label: "Interest savings (net of costs)", value: fmt(computed.interestSavings) },
          ],
        };
      }
      case "affordability": {
        const incomeP = parsePositive(a, "Monthly income");
        const existP = parseNonNegative(b, "Existing EMIs");
        const ratioP = parseAprPercent(r, "Max housing %");
        const rateP = parseAprPercent(c, "Loan rate %");
        const yearsP = parsePositive(y, "Term (years)");
        const downP = parseNonNegative(t, "Down payment available");
        if (!incomeP.ok) return { error: incomeP.error };
        if (!existP.ok) return { error: existP.error };
        if (!ratioP.ok) return { error: ratioP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        if (!downP.ok) return { error: downP.error };
        const computed = homeAffordability({
          monthlyIncome: incomeP.value,
          existingEmi: existP.value,
          maxHousingPercent: ratioP.value,
          annualRatePercent: rateP.value,
          termYears: yearsP.value,
          downPaymentAvailable: downP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maxHomePrice),
          primaryLabel: "Max home price",
          rows: [
            { label: "Max EMI", value: fmt(computed.maxEmi) },
            { label: "Max loan", value: fmt(computed.maxLoan) },
            { label: "Down payment added", value: fmt(downP.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, y, m, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="mp-currency">Currency</FieldLabel>
            <select
              id="mp-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as MortgagePropertyCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "mortgage" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-price">Home price</FieldLabel>
                <FieldInput id="mp-price" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-down">Down payment</FieldLabel>
                <FieldInput id="mp-down" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-rate">Annual rate %</FieldLabel>
                <FieldInput id="mp-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-yrs">Term (years)</FieldLabel>
                <FieldInput id="mp-yrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "downPayment" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-dprice">Home price</FieldLabel>
                <FieldInput id="mp-dprice" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-dpct">Down payment %</FieldLabel>
                <FieldInput id="mp-dpct" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "amortization" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-aprin">Loan principal</FieldLabel>
                <FieldInput id="mp-aprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-arate">Annual rate %</FieldLabel>
                <FieldInput id="mp-arate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-ayrs">Term (years)</FieldLabel>
                <FieldInput id="mp-ayrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "refinance" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-rem">Remaining principal</FieldLabel>
                <FieldInput id="mp-rem" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-cur">Current rate %</FieldLabel>
                <FieldInput id="mp-cur" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-new">New rate %</FieldLabel>
                <FieldInput id="mp-new" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-rm">Remaining months</FieldLabel>
                <FieldInput id="mp-rm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-cost">Closing costs</FieldLabel>
                <FieldInput id="mp-cost" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "affordability" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-inc">Monthly income</FieldLabel>
                <FieldInput id="mp-inc" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-exist">Existing EMIs</FieldLabel>
                <FieldInput id="mp-exist" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-ratio">Max housing EMI % of income</FieldLabel>
                <FieldInput id="mp-ratio" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-lrate">Loan rate %</FieldLabel>
                <FieldInput id="mp-lrate" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-aterm">Term (years)</FieldLabel>
                <FieldInput id="mp-aterm" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-adown">Down payment available</FieldLabel>
                <FieldInput id="mp-adown" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
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
