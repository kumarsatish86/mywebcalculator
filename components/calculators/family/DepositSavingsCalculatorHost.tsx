"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { DepositSavingsCurrencyCode, PayoutFrequency } from "@/lib/calculators/depositSavings";
import {
  DEPOSIT_SAVINGS_URL,
  fdInterestPayout,
  fdMaturityAmount,
  formatDepositSavingsMoney,
  goalBasedSavings,
  rdMaturityWithBreakdown,
  savingsAccountInterest,
  savingsGrowthRegular,
} from "@/lib/calculators/depositSavings";

type DepositSlug =
  | "savings-account-interest-calculator"
  | "fd-interest-payout-calculator"
  | "fd-maturity-amount-calculator"
  | "rd-maturity-calculator-with-monthly-breakdown"
  | "savings-growth-calculator-with-regular-deposits"
  | "goal-based-savings-calculator";

type Mode = "savingsInterest" | "fdPayout" | "fdMaturity" | "rdBreakdown" | "savingsGrowth" | "goalSavings";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  tDefault: string;
  yDefault: string;
  mDefault: string;
};

const CONFIG: Record<DepositSlug, Config> = {
  "savings-account-interest-calculator": {
    title: "Savings account interest calculator",
    description: "Estimate interest earned on average daily balance over a period (365-day year).",
    mode: "savingsInterest",
    aDefault: "100000",
    bDefault: "0",
    rDefault: "3.5",
    tDefault: "90",
    yDefault: "1",
    mDefault: "quarterly",
  },
  "fd-interest-payout-calculator": {
    title: "FD interest payout calculator",
    description: "Non-cumulative fixed deposit: periodic interest payouts with principal returned at maturity.",
    mode: "fdPayout",
    aDefault: "500000",
    bDefault: "0",
    rDefault: "7",
    tDefault: "0",
    yDefault: "1",
    mDefault: "quarterly",
  },
  "fd-maturity-amount-calculator": {
    title: "FD maturity amount calculator",
    description: "Cumulative fixed deposit maturity with compounding (default quarterly).",
    mode: "fdMaturity",
    aDefault: "100000",
    bDefault: "0",
    rDefault: "7",
    tDefault: "0",
    yDefault: "5",
    mDefault: "4",
  },
  "rd-maturity-calculator-with-monthly-breakdown": {
    title: "RD maturity calculator with monthly breakdown",
    description: "Recurring deposit maturity value with month-by-month balance progression.",
    mode: "rdBreakdown",
    aDefault: "5000",
    bDefault: "0",
    rDefault: "6.5",
    tDefault: "0",
    yDefault: "1",
    mDefault: "36",
  },
  "savings-growth-calculator-with-regular-deposits": {
    title: "Savings growth calculator with regular deposits",
    description: "Project ending balance from starting savings plus monthly deposits at a given rate.",
    mode: "savingsGrowth",
    aDefault: "10000",
    bDefault: "5000",
    rDefault: "6",
    tDefault: "0",
    yDefault: "5",
    mDefault: "4",
  },
  "goal-based-savings-calculator": {
    title: "Goal-based savings calculator",
    description: "Find the monthly deposit needed to reach a savings goal by a target date.",
    mode: "goalSavings",
    aDefault: "1200000",
    bDefault: "100000",
    rDefault: "6",
    tDefault: "0",
    yDefault: "5",
    mDefault: "4",
  },
};

const CURRENCIES: DepositSavingsCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function DepositSavingsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as DepositSlug] ?? CONFIG["savings-account-interest-calculator"];
  const [currency, setCurrency] = useState<DepositSavingsCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(DEPOSIT_SAVINGS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DEPOSIT_SAVINGS_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(DEPOSIT_SAVINGS_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(DEPOSIT_SAVINGS_URL.T, config.tDefault));
  const [y, setY] = useState(useLoanInitialInput(DEPOSIT_SAVINGS_URL.Y, config.yDefault));
  const [m, setM] = useState(useLoanInitialInput(DEPOSIT_SAVINGS_URL.M, config.mDefault));
  const [freq, setFreq] = useState<PayoutFrequency>(
    (useLoanInitialInput(DEPOSIT_SAVINGS_URL.P, "quarterly") as PayoutFrequency) || "quarterly",
  );

  const fmt = useCallback((n: number) => formatDepositSavingsMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [DEPOSIT_SAVINGS_URL.A]: a,
      [DEPOSIT_SAVINGS_URL.B]: b,
      [DEPOSIT_SAVINGS_URL.R]: r,
      [DEPOSIT_SAVINGS_URL.T]: t,
      [DEPOSIT_SAVINGS_URL.Y]: y,
      [DEPOSIT_SAVINGS_URL.M]: m,
      [DEPOSIT_SAVINGS_URL.P]: freq,
    }),
    [a, b, r, t, y, m, freq],
  );

  useLoanUrlSync(shareParams, [a, b, r, t, y, m, freq]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "savingsInterest": {
        const balP = parseNonNegative(a, "Average balance");
        const rateP = parseAprPercent(r, "Annual rate %");
        const daysP = parsePositive(t, "Days");
        if (!balP.ok) return { error: balP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!daysP.ok) return { error: daysP.error };
        const computed = savingsAccountInterest({
          averageBalance: balP.value,
          annualRatePercent: rateP.value,
          days: daysP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.interest),
          primaryLabel: "Interest earned",
          rows: [
            { label: "Average balance", value: fmt(balP.value) },
            { label: "Annual rate", value: pct(rateP.value) },
            { label: "Days", value: String(daysP.value) },
            { label: "Interest earned", value: fmt(computed.interest) },
            { label: "Daily rate (approx)", value: pct(computed.dailyRatePercent) },
          ],
        };
      }
      case "fdPayout": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Years");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = fdInterestPayout({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          years: yearsP.value,
          frequency: freq,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.payoutPerPeriod),
          primaryLabel: "Interest payout per period",
          rows: [
            { label: "Principal", value: fmt(prinP.value) },
            { label: "Payout frequency", value: freq },
            { label: "Payout per period", value: fmt(computed.payoutPerPeriod) },
            { label: "Total interest paid", value: fmt(computed.totalInterestPaid) },
            { label: "Principal returned", value: fmt(computed.principalReturned) },
          ],
        };
      }
      case "fdMaturity": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Years");
        const compP = parsePositive(m, "Compounds per year");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        if (!compP.ok) return { error: compP.error };
        const computed = fdMaturityAmount({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          years: yearsP.value,
          compoundsPerYear: compP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Maturity value",
          rows: [
            { label: "Principal", value: fmt(prinP.value) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
            { label: "Effective annual yield", value: pct(computed.effectiveAnnualYield) },
          ],
        };
      }
      case "rdBreakdown": {
        const depP = parsePositive(a, "Monthly deposit");
        const rateP = parseAprPercent(r, "Annual rate %");
        const monthsP = parsePositive(m, "Months");
        if (!depP.ok) return { error: depP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        const computed = rdMaturityWithBreakdown({
          monthlyDeposit: depP.value,
          annualRatePercent: rateP.value,
          months: monthsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        const { rows: schedRows, hasGap } = previewSchedule(computed.schedule);
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "RD maturity value",
          rows: [
            { label: "Total deposited", value: fmt(computed.totalDeposited) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
          ],
          schedule: schedRows.map((row) => ({
            label: `Month ${row.month}`,
            value: `${fmt(row.approximateBalance)} · deposited ${fmt(row.depositedToDate)}`,
          })),
          scheduleGap: hasGap,
        };
      }
      case "savingsGrowth": {
        const startP = parseNonNegative(a, "Starting balance");
        const depP = parseNonNegative(b, "Monthly deposit");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Years");
        if (!startP.ok) return { error: startP.error };
        if (!depP.ok) return { error: depP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = savingsGrowthRegular({
          startingBalance: startP.value,
          monthlyDeposit: depP.value,
          annualRatePercent: rateP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.endingBalance),
          primaryLabel: "Ending balance",
          rows: [
            { label: "Total deposited", value: fmt(computed.totalDeposited) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Ending balance", value: fmt(computed.endingBalance) },
          ],
        };
      }
      case "goalSavings": {
        const goalP = parsePositive(a, "Goal amount");
        const existP = parseNonNegative(b, "Existing savings");
        const rateP = parseAprPercent(r, "Annual rate %");
        const yearsP = parsePositive(y, "Years");
        if (!goalP.ok) return { error: goalP.error };
        if (!existP.ok) return { error: existP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = goalBasedSavings({
          goalAmount: goalP.value,
          years: yearsP.value,
          annualRatePercent: rateP.value,
          existingSavings: existP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlyDeposit),
          primaryLabel: "Required monthly deposit",
          rows: [
            { label: "Goal amount", value: fmt(goalP.value) },
            { label: "Existing savings", value: fmt(existP.value) },
            { label: "Required monthly deposit", value: fmt(computed.requiredMonthlyDeposit) },
            { label: "Total future deposits", value: fmt(computed.totalDeposits) },
            { label: "Growth from interest", value: fmt(computed.growthFromInterest) },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, t, y, m, freq, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="ds-currency">Currency</FieldLabel>
            <select
              id="ds-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as DepositSavingsCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "savingsInterest" ? (
            <>
              <div>
                <FieldLabel htmlFor="ds-bal">Average balance</FieldLabel>
                <FieldInput id="ds-bal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-rate">Annual interest rate %</FieldLabel>
                <FieldInput id="ds-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-days">Days in period</FieldLabel>
                <FieldInput id="ds-days" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fdPayout" ? (
            <>
              <div>
                <FieldLabel htmlFor="ds-prin">Principal</FieldLabel>
                <FieldInput id="ds-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-fdr">Annual interest rate %</FieldLabel>
                <FieldInput id="ds-fdr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-yrs">Tenure (years)</FieldLabel>
                <FieldInput id="ds-yrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-freq">Payout frequency</FieldLabel>
                <select
                  id="ds-freq"
                  className={selectCls}
                  value={freq}
                  onChange={(ev) => setFreq(ev.target.value as PayoutFrequency)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </>
          ) : null}

          {config.mode === "fdMaturity" ? (
            <>
              <div>
                <FieldLabel htmlFor="ds-fdp">Deposit amount</FieldLabel>
                <FieldInput id="ds-fdp" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-fdmr">Annual interest rate %</FieldLabel>
                <FieldInput id="ds-fdmr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-fdmy">Tenure (years)</FieldLabel>
                <FieldInput id="ds-fdmy" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-comp">Compounds per year</FieldLabel>
                <FieldInput id="ds-comp" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rdBreakdown" ? (
            <>
              <div>
                <FieldLabel htmlFor="ds-rdd">Monthly deposit</FieldLabel>
                <FieldInput id="ds-rdd" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-rdr">Annual interest rate %</FieldLabel>
                <FieldInput id="ds-rdr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-rdm">Tenure (months)</FieldLabel>
                <FieldInput id="ds-rdm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "savingsGrowth" ? (
            <>
              <div>
                <FieldLabel htmlFor="ds-start">Starting balance</FieldLabel>
                <FieldInput id="ds-start" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-dep">Monthly deposit</FieldLabel>
                <FieldInput id="ds-dep" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-sgr">Annual interest rate %</FieldLabel>
                <FieldInput id="ds-sgr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-sgy">Years</FieldLabel>
                <FieldInput id="ds-sgy" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "goalSavings" ? (
            <>
              <div>
                <FieldLabel htmlFor="ds-goal">Goal amount</FieldLabel>
                <FieldInput id="ds-goal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-exist">Existing savings</FieldLabel>
                <FieldInput id="ds-exist" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-gsr">Expected return % / year</FieldLabel>
                <FieldInput id="ds-gsr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ds-gsy">Years to goal</FieldLabel>
                <FieldInput id="ds-gsy" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
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
                    Monthly schedule{result.scheduleGap ? " · first 6 + last month" : ""}
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
