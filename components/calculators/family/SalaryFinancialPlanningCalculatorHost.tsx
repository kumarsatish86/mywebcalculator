"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { FinPlanningCurrencyCode } from "@/lib/calculators/salaryFinancialPlanning";
import {
  DEFAULT_RETURN,
  DEFAULT_WITHDRAWAL_RATE,
  SALARY_FIN_PLAN_URL,
  expenseVsSalary,
  fireCalculator,
  formatFinPlanningMoney,
  retirementPlanning,
  salaryBudgetPlanner,
  salaryInvestment,
  savingsFromSalary,
} from "@/lib/calculators/salaryFinancialPlanning";

type FinPlanSlug =
  | "savings-from-salary-calculator"
  | "expense-vs-salary-calculator"
  | "salary-budget-planner"
  | "salary-investment-calculator"
  | "fire-calculator-financial-independence"
  | "retirement-planning-calculator-salary-based";

type FinPlanMode = "savings" | "expenseVsSalary" | "budget" | "investment" | "fire" | "retirement";

type Config = {
  title: string;
  description: string;
  mode: FinPlanMode;
  amountLabel: string;
  amountDefault: string;
  showSavingsPct?: boolean;
  showExpenses?: boolean;
  showBudgetSplit?: boolean;
  showInvestment?: boolean;
  showFire?: boolean;
  showRetirement?: boolean;
};

const CONFIG: Record<FinPlanSlug, Config> = {
  "savings-from-salary-calculator": {
    title: "Savings from salary calculator",
    description: "Estimate monthly and annual savings from take-home pay and a savings rate.",
    mode: "savings",
    amountLabel: "Net monthly salary",
    amountDefault: "80000",
    showSavingsPct: true,
  },
  "expense-vs-salary-calculator": {
    title: "Expense vs salary calculator",
    description: "Compare monthly salary with expenses to find surplus or deficit.",
    mode: "expenseVsSalary",
    amountLabel: "Monthly salary (net)",
    amountDefault: "75000",
    showExpenses: true,
  },
  "salary-budget-planner": {
    title: "Salary budget planner",
    description: "Split take-home pay into needs, wants, and savings using the 50/30/20 rule or custom percentages.",
    mode: "budget",
    amountLabel: "Net monthly salary",
    amountDefault: "100000",
    showBudgetSplit: true,
  },
  "salary-investment-calculator": {
    title: "Salary investment calculator",
    description: "Project investment corpus from monthly contributions out of salary at an expected return.",
    mode: "investment",
    amountLabel: "Monthly investment from salary",
    amountDefault: "15000",
    showInvestment: true,
  },
  "fire-calculator-financial-independence": {
    title: "FIRE calculator (financial independence)",
    description: "Estimate your FIRE number and years to reach financial independence using the withdrawal rule.",
    mode: "fire",
    amountLabel: "Annual living expenses",
    amountDefault: "600000",
    showFire: true,
  },
  "retirement-planning-calculator-salary-based": {
    title: "Retirement planning calculator (salary-based)",
    description: "Project retirement corpus from gross salary, savings rate, and years until retirement.",
    mode: "retirement",
    amountLabel: "Gross monthly salary",
    amountDefault: "100000",
    showRetirement: true,
  },
};

const CURRENCIES: FinPlanningCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function SalaryFinancialPlanningCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as FinPlanSlug] ?? CONFIG["savings-from-salary-calculator"];
  const [currency, setCurrency] = useState<FinPlanningCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.A, config.amountDefault));
  const [secondary, setSecondary] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.B, "60000"));
  const [savingsPct, setSavingsPct] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.S, "20"));
  const [needsPct, setNeedsPct] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.P, "50"));
  const [wantsPct, setWantsPct] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.W, "30"));
  const [returnPct, setReturnPct] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.R, String(DEFAULT_RETURN)));
  const [years, setYears] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.Y, "20"));
  const [withdrawalPct, setWithdrawalPct] = useState(
    useLoanInitialInput(SALARY_FIN_PLAN_URL.T, String(DEFAULT_WITHDRAWAL_RATE)),
  );
  const [currentCorpus, setCurrentCorpus] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.C, "0"));
  const [monthlySavings, setMonthlySavings] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.M, "50000"));
  const [taxPct, setTaxPct] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.T, "20"));
  const [deductionPct, setDeductionPct] = useState(useLoanInitialInput(SALARY_FIN_PLAN_URL.D, "5"));

  const fmt = useCallback((n: number) => formatFinPlanningMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [SALARY_FIN_PLAN_URL.A]: amount,
      [SALARY_FIN_PLAN_URL.B]: secondary,
      [SALARY_FIN_PLAN_URL.S]: savingsPct,
      [SALARY_FIN_PLAN_URL.P]: needsPct,
      [SALARY_FIN_PLAN_URL.W]: wantsPct,
      [SALARY_FIN_PLAN_URL.R]: returnPct,
      [SALARY_FIN_PLAN_URL.Y]: years,
      [SALARY_FIN_PLAN_URL.T]: config.mode === "fire" ? withdrawalPct : taxPct,
      [SALARY_FIN_PLAN_URL.C]: currentCorpus,
      [SALARY_FIN_PLAN_URL.M]: monthlySavings,
      [SALARY_FIN_PLAN_URL.D]: deductionPct,
    }),
    [amount, secondary, savingsPct, needsPct, wantsPct, returnPct, years, withdrawalPct, taxPct, currentCorpus, monthlySavings, deductionPct, config.mode],
  );

  useLoanUrlSync(shareParams, [
    amount,
    secondary,
    savingsPct,
    needsPct,
    wantsPct,
    returnPct,
    years,
    withdrawalPct,
    taxPct,
    currentCorpus,
    monthlySavings,
    deductionPct,
  ]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "savings": {
        const pct = parseAprPercent(savingsPct, "Savings %");
        if (!pct.ok) return { error: pct.error };
        const computed = savingsFromSalary({ netMonthly: amountParsed.value, savingsPercent: pct.value });
        return {
          primary: fmt(computed.monthlySavings),
          primaryLabel: "Monthly savings",
          rows: [
            { label: "Net monthly", value: fmt(computed.netMonthly) },
            { label: "Savings rate", value: `${computed.savingsPercent}%` },
            { label: "Monthly savings", value: fmt(computed.monthlySavings) },
            { label: "Annual savings", value: fmt(computed.annualSavings) },
            { label: "Monthly spending", value: fmt(computed.monthlySpending) },
          ],
        };
      }
      case "expenseVsSalary": {
        const exp = parseNonNegative(secondary, "Monthly expenses");
        if (!exp.ok) return { error: exp.error };
        const computed = expenseVsSalary({ salaryMonthly: amountParsed.value, expensesMonthly: exp.value });
        return {
          primary: fmt(Math.abs(computed.surplus)),
          primaryLabel: computed.status === "surplus" ? "Monthly surplus" : computed.status === "deficit" ? "Monthly deficit" : "Balanced",
          rows: [
            { label: "Salary (net)", value: fmt(computed.salaryMonthly) },
            { label: "Expenses", value: fmt(computed.expensesMonthly) },
            { label: "Surplus / deficit", value: fmt(computed.surplus) },
            { label: "Savings rate", value: `${computed.savingsRate.toFixed(1)}%` },
          ],
        };
      }
      case "budget": {
        const needs = parseAprPercent(needsPct, "Needs %");
        const wants = parseAprPercent(wantsPct, "Wants %");
        const save = parseAprPercent(savingsPct, "Savings %");
        if (!needs.ok) return { error: needs.error };
        if (!wants.ok) return { error: wants.error };
        if (!save.ok) return { error: save.error };
        const computed = salaryBudgetPlanner({
          netMonthly: amountParsed.value,
          needsPercent: needs.value,
          wantsPercent: wants.value,
          savingsPercent: save.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.savings),
          primaryLabel: "Monthly savings bucket",
          rows: [
            { label: "Net monthly", value: fmt(computed.netMonthly) },
            { label: "Needs", value: fmt(computed.needs) },
            { label: "Wants", value: fmt(computed.wants) },
            { label: "Savings", value: fmt(computed.savings) },
            { label: "Total allocated", value: `${computed.totalPercent}%` },
          ],
        };
      }
      case "investment": {
        const ret = parseAprPercent(returnPct, "Expected return");
        const y = parsePositive(years, "Years");
        const start = parseNonNegative(currentCorpus, "Starting balance");
        if (!ret.ok) return { error: ret.error };
        if (!y.ok) return { error: y.error };
        if (!start.ok) return { error: start.error };
        const computed = salaryInvestment({
          monthlyInvestment: amountParsed.value,
          annualReturnPercent: ret.value,
          years: y.value,
          startingBalance: start.value,
        });
        return {
          primary: fmt(computed.projectedCorpus),
          primaryLabel: `Projected corpus (${y.value} years)`,
          rows: [
            { label: "Monthly investment", value: fmt(computed.monthlyInvestment) },
            { label: "Expected return", value: `${computed.annualReturnPercent}%` },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Projected corpus", value: fmt(computed.projectedCorpus) },
          ],
        };
      }
      case "fire": {
        const wr = parseAprPercent(withdrawalPct, "Withdrawal rate");
        const ret = parseAprPercent(returnPct, "Expected return");
        const savings = parseNonNegative(monthlySavings, "Monthly savings");
        const corpus = parseNonNegative(currentCorpus, "Current savings");
        if (!wr.ok) return { error: wr.error };
        if (!ret.ok) return { error: ret.error };
        if (!savings.ok) return { error: savings.error };
        if (!corpus.ok) return { error: corpus.error };
        const computed = fireCalculator({
          annualExpenses: amountParsed.value,
          withdrawalRatePercent: wr.value,
          currentSavings: corpus.value,
          monthlySavings: savings.value,
          expectedReturnPercent: ret.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.fireNumber),
          primaryLabel: "FIRE number",
          rows: [
            { label: "Annual expenses", value: fmt(amountParsed.value) },
            { label: "Withdrawal rate", value: `${wr.value}%` },
            { label: "FIRE number", value: fmt(computed.fireNumber) },
            { label: "Current savings", value: fmt(computed.currentSavings) },
            { label: "Monthly savings", value: fmt(computed.monthlySavings) },
            { label: "Years to FIRE", value: computed.yearsToFire < 1 ? "< 1 year" : `${computed.yearsToFire.toFixed(1)} years` },
            { label: "Projected at FIRE", value: fmt(computed.projectedAtFire) },
          ],
        };
      }
      case "retirement": {
        const save = parseAprPercent(savingsPct, "Savings %");
        const ret = parseAprPercent(returnPct, "Expected return");
        const y = parsePositive(years, "Years to retirement");
        const tax = parseAprPercent(taxPct, "Tax %");
        const ded = parseAprPercent(deductionPct, "Deductions %");
        const corpus = parseNonNegative(currentCorpus, "Current corpus");
        if (!save.ok) return { error: save.error };
        if (!ret.ok) return { error: ret.error };
        if (!y.ok) return { error: y.error };
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        if (!corpus.ok) return { error: corpus.error };
        const computed = retirementPlanning({
          monthlySalary: amountParsed.value,
          savingsPercent: save.value,
          yearsToRetirement: y.value,
          expectedReturnPercent: ret.value,
          currentCorpus: corpus.value,
          taxPercent: tax.value,
          deductionPercent: ded.value,
        });
        return {
          primary: fmt(computed.retirementCorpus),
          primaryLabel: `Retirement corpus (${y.value} years)`,
          rows: [
            { label: "Gross monthly", value: fmt(computed.grossMonthly) },
            { label: "Net monthly", value: fmt(computed.netMonthly) },
            { label: "Monthly savings", value: fmt(computed.monthlySavings) },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Retirement corpus", value: fmt(computed.retirementCorpus) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    amount,
    config,
    currentCorpus,
    deductionPct,
    fmt,
    monthlySavings,
    needsPct,
    returnPct,
    savingsPct,
    secondary,
    taxPct,
    wantsPct,
    withdrawalPct,
    years,
  ]);

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
          onChange={(e) => setCurrency(e.target.value as FinPlanningCurrencyCode)}
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
        <div className="sm:col-span-2 sm:max-w-md">
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
          />
        </div>

        {config.showExpenses ? (
          <div>
            <FieldLabel htmlFor="expenses">Monthly expenses</FieldLabel>
            <FieldInput
              id="expenses"
              inputMode="decimal"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showSavingsPct || config.mode === "retirement" ? (
          <div>
            <FieldLabel htmlFor="savingsPct">Savings % of {config.mode === "retirement" ? "net" : "salary"}</FieldLabel>
            <FieldInput
              id="savingsPct"
              inputMode="decimal"
              value={savingsPct}
              onChange={(e) => setSavingsPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showBudgetSplit ? (
          <>
            <div>
              <FieldLabel htmlFor="needsPct">Needs %</FieldLabel>
              <FieldInput id="needsPct" inputMode="decimal" value={needsPct} onChange={(e) => setNeedsPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="wantsPct">Wants %</FieldLabel>
              <FieldInput id="wantsPct" inputMode="decimal" value={wantsPct} onChange={(e) => setWantsPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="budgetSavingsPct">Savings %</FieldLabel>
              <FieldInput id="budgetSavingsPct" inputMode="decimal" value={savingsPct} onChange={(e) => setSavingsPct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showInvestment || config.showFire || config.showRetirement ? (
          <div>
            <FieldLabel htmlFor="returnPct">Expected annual return %</FieldLabel>
            <FieldInput id="returnPct" inputMode="decimal" value={returnPct} onChange={(e) => setReturnPct(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showInvestment || config.showRetirement ? (
          <div>
            <FieldLabel htmlFor="years">{config.mode === "retirement" ? "Years to retirement" : "Investment years"}</FieldLabel>
            <FieldInput id="years" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showInvestment || config.showFire || config.showRetirement ? (
          <div>
            <FieldLabel htmlFor="currentCorpus">{config.mode === "fire" ? "Current savings" : "Current corpus / balance"}</FieldLabel>
            <FieldInput id="currentCorpus" inputMode="decimal" value={currentCorpus} onChange={(e) => setCurrentCorpus(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showFire ? (
          <>
            <div>
              <FieldLabel htmlFor="monthlySavings">Monthly savings</FieldLabel>
              <FieldInput id="monthlySavings" inputMode="decimal" value={monthlySavings} onChange={(e) => setMonthlySavings(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="withdrawalPct">Safe withdrawal rate %</FieldLabel>
              <FieldInput id="withdrawalPct" inputMode="decimal" value={withdrawalPct} onChange={(e) => setWithdrawalPct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showRetirement ? (
          <>
            <div>
              <FieldLabel htmlFor="taxPct">Tax %</FieldLabel>
              <FieldInput id="taxPct" inputMode="decimal" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="deductionPct">Other deductions %</FieldLabel>
              <FieldInput id="deductionPct" inputMode="decimal" value={deductionPct} onChange={(e) => setDeductionPct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
