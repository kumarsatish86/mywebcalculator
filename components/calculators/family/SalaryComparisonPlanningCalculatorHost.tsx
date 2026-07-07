"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { PlanningCurrencyCode } from "@/lib/calculators/salaryComparisonPlanning";
import {
  SALARY_PLANNING_URL,
  annualFromMonthly,
  costOfLivingComparison,
  formatPlanningMoney,
  incrementSalary,
  monthlyFromAnnual,
  offerComparison,
  promotionSalary,
  salaryComparison,
  salaryGrowth,
} from "@/lib/calculators/salaryComparisonPlanning";

type PlanningSlug =
  | "salary-comparison-calculator"
  | "offer-comparison-calculator"
  | "cost-of-living-comparison-calculator"
  | "salary-growth-calculator"
  | "promotion-salary-calculator"
  | "increment-calculator";

type PlanningMode =
  | "salaryComparison"
  | "offerComparison"
  | "colComparison"
  | "salaryGrowth"
  | "promotion"
  | "increment";

type Config = {
  title: string;
  description: string;
  mode: PlanningMode;
  amountLabel: string;
  amountDefault: string;
  showSalaryB?: boolean;
  showBonus?: boolean;
  showCol?: boolean;
  showGrowth?: boolean;
  showPeriod?: boolean;
};

const CONFIG: Record<PlanningSlug, Config> = {
  "salary-comparison-calculator": {
    title: "Salary comparison calculator",
    description: "Compare two salary figures side by side and see the difference in amount and percentage.",
    mode: "salaryComparison",
    amountLabel: "Salary A",
    amountDefault: "1000000",
    showSalaryB: true,
    showPeriod: true,
  },
  "offer-comparison-calculator": {
    title: "Offer comparison calculator",
    description: "Compare two job offers including base pay, bonus %, and optional cost-of-living adjustment.",
    mode: "offerComparison",
    amountLabel: "Offer A (annual base)",
    amountDefault: "1200000",
    showSalaryB: true,
    showBonus: true,
    showCol: true,
  },
  "cost-of-living-comparison-calculator": {
    title: "Cost of living comparison calculator",
    description: "Compare purchasing power of two salaries in different cities using COL indices.",
    mode: "colComparison",
    amountLabel: "Salary in city A",
    amountDefault: "100000",
    showSalaryB: true,
    showCol: true,
  },
  "salary-growth-calculator": {
    title: "Salary growth calculator",
    description: "Project future salary with a fixed annual growth rate over several years.",
    mode: "salaryGrowth",
    amountLabel: "Current annual salary",
    amountDefault: "1000000",
    showGrowth: true,
  },
  "promotion-salary-calculator": {
    title: "Promotion salary calculator",
    description: "Calculate new salary after a promotion raise as a percentage of current pay.",
    mode: "promotion",
    amountLabel: "Current annual salary",
    amountDefault: "1000000",
    showGrowth: true,
  },
  "increment-calculator": {
    title: "Increment calculator",
    description: "Find new salary and monthly increment from an annual increment percentage.",
    mode: "increment",
    amountLabel: "Current annual salary",
    amountDefault: "600000",
    showGrowth: true,
  },
};

const CURRENCIES: PlanningCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function SalaryComparisonPlanningCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PlanningSlug] ?? CONFIG["salary-comparison-calculator"];
  const [currency, setCurrency] = useState<PlanningCurrencyCode>("INR");
  const [amountA, setAmountA] = useState(useLoanInitialInput(SALARY_PLANNING_URL.A, config.amountDefault));
  const [amountB, setAmountB] = useState(useLoanInitialInput(SALARY_PLANNING_URL.B, "1200000"));
  const [bonusA, setBonusA] = useState(useLoanInitialInput(SALARY_PLANNING_URL.T, "10"));
  const [bonusB, setBonusB] = useState(useLoanInitialInput(SALARY_PLANNING_URL.P, "8"));
  const [colA, setColA] = useState(useLoanInitialInput(SALARY_PLANNING_URL.C, "100"));
  const [colB, setColB] = useState(useLoanInitialInput(SALARY_PLANNING_URL.X, "85"));
  const [growthPct, setGrowthPct] = useState(useLoanInitialInput(SALARY_PLANNING_URL.P, "10"));
  const [years, setYears] = useState(useLoanInitialInput(SALARY_PLANNING_URL.Y, "5"));
  const [period, setPeriod] = useState<"monthly" | "annual">(
    useLoanInitialInput(SALARY_PLANNING_URL.M, "annual") === "monthly" ? "monthly" : "annual",
  );

  const fmt = useCallback((n: number) => formatPlanningMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [SALARY_PLANNING_URL.A]: amountA,
      [SALARY_PLANNING_URL.B]: amountB,
      [SALARY_PLANNING_URL.T]: bonusA,
      [SALARY_PLANNING_URL.P]: config.mode === "salaryGrowth" || config.mode === "promotion" || config.mode === "increment" ? growthPct : bonusB,
      [SALARY_PLANNING_URL.C]: colA,
      [SALARY_PLANNING_URL.X]: colB,
      [SALARY_PLANNING_URL.Y]: years,
      [SALARY_PLANNING_URL.M]: period,
    }),
    [amountA, amountB, bonusA, bonusB, colA, colB, growthPct, years, period, config.mode],
  );

  useLoanUrlSync(shareParams, [amountA, amountB, bonusA, bonusB, colA, colB, growthPct, years, period]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "salaryComparison": {
        const a = parsePositive(amountA, "Salary A");
        const b = parsePositive(amountB, "Salary B");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        const salaryA = period === "monthly" ? annualFromMonthly(a.value) : a.value;
        const salaryB = period === "monthly" ? annualFromMonthly(b.value) : b.value;
        const computed = salaryComparison({ salaryA, salaryB });
        const label = computed.higher === "B" ? "B is higher" : computed.higher === "A" ? "A is higher" : "Equal";
        return {
          primary: fmt(Math.abs(computed.difference)),
          primaryLabel: `${label} by`,
          rows: [
            { label: "Salary A (annual)", value: fmt(computed.salaryA) },
            { label: "Salary B (annual)", value: fmt(computed.salaryB) },
            { label: "Difference (B − A)", value: fmt(computed.difference) },
            { label: "Percent change", value: `${computed.percentDifference.toFixed(1)}%` },
          ],
        };
      }
      case "offerComparison": {
        const a = parsePositive(amountA, "Offer A");
        const b = parsePositive(amountB, "Offer B");
        const ba = parseAprPercent(bonusA, "Bonus A %");
        const bb = parseAprPercent(bonusB, "Bonus B %");
        const ca = parseNonNegative(colA, "COL index A");
        const cb = parseNonNegative(colB, "COL index B");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        if (!ba.ok) return { error: ba.error };
        if (!bb.ok) return { error: bb.error };
        if (!ca.ok) return { error: ca.error };
        if (!cb.ok) return { error: cb.error };
        const computed = offerComparison({
          offerA: a.value,
          offerB: b.value,
          bonusAPercent: ba.value,
          bonusBPercent: bb.value,
          colA: ca.value > 0 ? ca.value : undefined,
          colB: cb.value > 0 ? cb.value : undefined,
        });
        const better =
          computed.betterOffer === "B" ? "Offer B" : computed.betterOffer === "A" ? "Offer A" : "Tie";
        return {
          primary: better,
          primaryLabel: "Better offer (COL-adjusted if indices set)",
          rows: [
            { label: "Offer A total (base + bonus)", value: fmt(computed.totalA) },
            { label: "Offer B total (base + bonus)", value: fmt(computed.totalB) },
            { label: "Raw difference (B − A)", value: fmt(computed.difference) },
            ...(computed.adjustedB != null
              ? [
                  { label: "Offer B adjusted to A's COL", value: fmt(computed.adjustedB) },
                  { label: "COL-adjusted difference", value: fmt(computed.adjustedDifference ?? 0) },
                ]
              : []),
          ],
        };
      }
      case "colComparison": {
        const a = parsePositive(amountA, "Salary A");
        const b = parsePositive(amountB, "Salary B");
        const ca = parsePositive(colA, "COL index A");
        const cb = parsePositive(colB, "COL index B");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        if (!ca.ok) return { error: ca.error };
        if (!cb.ok) return { error: cb.error };
        const computed = costOfLivingComparison({
          salaryA: a.value,
          colA: ca.value,
          salaryB: b.value,
          colB: cb.value,
        });
        if ("error" in computed) return { error: computed.error };
        const better =
          computed.betterInPP === "B" ? "City B" : computed.betterInPP === "A" ? "City A" : "Equal";
        return {
          primary: better,
          primaryLabel: "Better purchasing power",
          rows: [
            { label: "Salary A", value: fmt(computed.salaryA) },
            { label: "COL index A", value: String(computed.colA) },
            { label: "Salary B", value: fmt(computed.salaryB) },
            { label: "COL index B", value: String(computed.colB) },
            { label: "B equivalent in A's COL", value: fmt(computed.equivalentBInA) },
            { label: "A equivalent in B's COL", value: fmt(computed.equivalentAInB) },
            { label: "PP difference (B vs A)", value: fmt(computed.purchasingPowerDiff) },
          ],
        };
      }
      case "salaryGrowth": {
        const current = parsePositive(amountA, config.amountLabel);
        const rate = parseAprPercent(growthPct, "Annual growth %");
        const y = parsePositive(years, "Years");
        if (!current.ok) return { error: current.error };
        if (!rate.ok) return { error: rate.error };
        if (!y.ok) return { error: y.error };
        const computed = salaryGrowth({
          currentSalary: current.value,
          annualGrowthPercent: rate.value,
          years: y.value,
        });
        return {
          primary: fmt(computed.finalSalary),
          primaryLabel: `Salary after ${y.value} years`,
          rows: [
            { label: "Starting salary", value: fmt(computed.currentSalary) },
            { label: "Annual growth", value: `${computed.annualGrowthPercent}%` },
            { label: "Final salary", value: fmt(computed.finalSalary) },
            { label: "Total growth", value: fmt(computed.totalGrowth) },
            { label: "Growth %", value: `${computed.growthPercent.toFixed(1)}%` },
            ...computed.yearlyProjection.slice(1, 4).map((p) => ({
              label: `Year ${p.year}`,
              value: fmt(p.salary),
            })),
          ],
        };
      }
      case "promotion": {
        const current = parsePositive(amountA, config.amountLabel);
        const inc = parseAprPercent(growthPct, "Increase %");
        if (!current.ok) return { error: current.error };
        if (!inc.ok) return { error: inc.error };
        const computed = promotionSalary({ currentSalary: current.value, increasePercent: inc.value });
        return {
          primary: fmt(computed.newSalary),
          primaryLabel: "Salary after promotion",
          rows: [
            { label: "Current salary", value: fmt(computed.currentSalary) },
            { label: "Increase %", value: `${computed.increasePercent}%` },
            { label: "Increase amount", value: fmt(computed.increaseAmount) },
            { label: "New salary", value: fmt(computed.newSalary) },
            { label: "New monthly", value: fmt(monthlyFromAnnual(computed.newSalary)) },
          ],
        };
      }
      case "increment": {
        const current = parsePositive(amountA, config.amountLabel);
        const inc = parseAprPercent(growthPct, "Increment %");
        if (!current.ok) return { error: current.error };
        if (!inc.ok) return { error: inc.error };
        const computed = incrementSalary({ currentSalary: current.value, incrementPercent: inc.value });
        return {
          primary: fmt(computed.newSalary),
          primaryLabel: "Salary after increment",
          rows: [
            { label: "Current salary", value: fmt(computed.currentSalary) },
            { label: "Increment %", value: `${computed.incrementPercent}%` },
            { label: "Annual increment", value: fmt(computed.incrementAmount) },
            { label: "Monthly increment", value: fmt(computed.monthlyIncrement) },
            { label: "New salary", value: fmt(computed.newSalary) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amountA, amountB, bonusA, bonusB, colA, colB, config, fmt, growthPct, period, years]);

  const growthLabel =
    config.mode === "promotion"
      ? "Promotion increase %"
      : config.mode === "increment"
        ? "Increment %"
        : "Annual growth %";

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
      <div className="mb-4">
        <FieldLabel htmlFor="currency">Currency</FieldLabel>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as PlanningCurrencyCode)}
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="amountA">{config.amountLabel}</FieldLabel>
          <FieldInput
            id="amountA"
            inputMode="decimal"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            className="mt-2"
          />
        </div>

        {config.showSalaryB ? (
          <div>
            <FieldLabel htmlFor="amountB">
              {config.mode === "colComparison"
                ? "Salary in city B"
                : config.mode === "offerComparison"
                  ? "Offer B (annual base)"
                  : "Salary B"}
            </FieldLabel>
            <FieldInput
              id="amountB"
              inputMode="decimal"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showPeriod ? (
          <div>
            <FieldLabel htmlFor="period">Amounts are</FieldLabel>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as "monthly" | "annual")}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        ) : null}

        {config.showBonus ? (
          <>
            <div>
              <FieldLabel htmlFor="bonusA">Bonus A %</FieldLabel>
              <FieldInput
                id="bonusA"
                inputMode="decimal"
                value={bonusA}
                onChange={(e) => setBonusA(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <FieldLabel htmlFor="bonusB">Bonus B %</FieldLabel>
              <FieldInput
                id="bonusB"
                inputMode="decimal"
                value={bonusB}
                onChange={(e) => setBonusB(e.target.value)}
                className="mt-2"
              />
            </div>
          </>
        ) : null}

        {config.showCol ? (
          <>
            <div>
              <FieldLabel htmlFor="colA">COL index {config.mode === "colComparison" ? "city A" : "A"}</FieldLabel>
              <FieldInput
                id="colA"
                inputMode="decimal"
                value={colA}
                onChange={(e) => setColA(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <FieldLabel htmlFor="colB">COL index {config.mode === "colComparison" ? "city B" : "B"}</FieldLabel>
              <FieldInput
                id="colB"
                inputMode="decimal"
                value={colB}
                onChange={(e) => setColB(e.target.value)}
                className="mt-2"
              />
            </div>
          </>
        ) : null}

        {config.showGrowth ? (
          <>
            <div>
              <FieldLabel htmlFor="growthPct">{growthLabel}</FieldLabel>
              <FieldInput
                id="growthPct"
                inputMode="decimal"
                value={growthPct}
                onChange={(e) => setGrowthPct(e.target.value)}
                className="mt-2"
              />
            </div>
            {config.mode === "salaryGrowth" ? (
              <div>
                <FieldLabel htmlFor="years">Years</FieldLabel>
                <FieldInput
                  id="years"
                  inputMode="decimal"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="mt-2"
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
