"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { RetirementCurrencyCode } from "@/lib/calculators/retirementPlanning";
import {
  DEFAULT_INFLATION,
  DEFAULT_RETURN,
  DEFAULT_WITHDRAWAL_RATE,
  RETIREMENT_URL,
  fireCalc,
  formatRetirementMoney,
  inflationImpactRetirement,
  lifeExpectancyFinancial,
  pensionCalc,
  retirementCalc,
  retirementCorpusNeeded,
  retirementWithdrawal,
} from "@/lib/calculators/retirementPlanning";

type RetSlug =
  | "retirement-calculator"
  | "early-retirement-fire-calculator"
  | "pension-calculator"
  | "retirement-corpus-calculator"
  | "retirement-withdrawal-calculator"
  | "inflation-impact-on-retirement-calculator"
  | "life-expectancy-calculator-financial-context";

type Mode = "retire" | "fire" | "pension" | "corpus" | "withdraw" | "inflation" | "longevity";

type Config = { title: string; description: string; mode: Mode };

const CONFIG: Record<RetSlug, Config> = {
  "retirement-calculator": {
    title: "Retirement calculator",
    description: "Project your retirement corpus from current savings, monthly contributions, ages, and expected return.",
    mode: "retire",
  },
  "early-retirement-fire-calculator": {
    title: "Early retirement (FIRE) calculator",
    description: "Find your FIRE number and years to financial independence at a chosen safe withdrawal rate.",
    mode: "fire",
  },
  "pension-calculator": {
    title: "Pension calculator",
    description: "Estimate annual and monthly pension-style income from a retirement corpus and payout rate.",
    mode: "pension",
  },
  "retirement-corpus-calculator": {
    title: "Retirement corpus calculator",
    description: "Calculate the corpus needed to support target monthly expenses at retirement using a withdrawal rate.",
    mode: "corpus",
  },
  "retirement-withdrawal-calculator": {
    title: "Retirement withdrawal calculator",
    description: "Simulate monthly withdrawals from a corpus earning returns—see ending balance or depletion.",
    mode: "withdraw",
  },
  "inflation-impact-on-retirement-calculator": {
    title: "Inflation impact on retirement calculator",
    description: "See how inflation raises future expense needs and whether a planned corpus still covers them.",
    mode: "inflation",
  },
  "life-expectancy-calculator-financial-context": {
    title: "Life expectancy calculator (financial context)",
    description: "Estimate years in retirement and the corpus needed to fund expenses through your expected lifespan.",
    mode: "longevity",
  },
};

const CURRENCIES: RetirementCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function RetirementPlanningCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as RetSlug] ?? CONFIG["retirement-calculator"];
  const [currency, setCurrency] = useState<RetirementCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(RETIREMENT_URL.A, "30"));
  const [b, setB] = useState(useLoanInitialInput(RETIREMENT_URL.B, "60"));
  const [c, setC] = useState(useLoanInitialInput(RETIREMENT_URL.C, "500000"));
  const [m, setM] = useState(useLoanInitialInput(RETIREMENT_URL.M, "20000"));
  const [r, setR] = useState(useLoanInitialInput(RETIREMENT_URL.R, String(DEFAULT_RETURN)));
  const [w, setW] = useState(useLoanInitialInput(RETIREMENT_URL.W, String(DEFAULT_WITHDRAWAL_RATE)));
  const [i, setI] = useState(useLoanInitialInput(RETIREMENT_URL.I, String(DEFAULT_INFLATION)));
  const [e, setE] = useState(useLoanInitialInput(RETIREMENT_URL.E, "50000"));
  const [p, setP] = useState(useLoanInitialInput(RETIREMENT_URL.P, "85"));
  const [y, setY] = useState(useLoanInitialInput(RETIREMENT_URL.Y, "25"));

  const fmt = useCallback((n: number) => formatRetirementMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [RETIREMENT_URL.A]: a,
      [RETIREMENT_URL.B]: b,
      [RETIREMENT_URL.C]: c,
      [RETIREMENT_URL.M]: m,
      [RETIREMENT_URL.R]: r,
      [RETIREMENT_URL.W]: w,
      [RETIREMENT_URL.I]: i,
      [RETIREMENT_URL.E]: e,
      [RETIREMENT_URL.P]: p,
      [RETIREMENT_URL.Y]: y,
    }),
    [a, b, c, m, r, w, i, e, p, y],
  );

  useLoanUrlSync(shareParams, [a, b, c, m, r, w, i, e, p, y]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "retire": {
        const age = parsePositive(a, "Current age");
        const retAge = parsePositive(b, "Retirement age");
        const savings = parseNonNegative(c, "Current savings");
        const monthly = parseNonNegative(m, "Monthly savings");
        const ret = parseAprPercent(r, "Expected return %");
        if (!age.ok) return { error: age.error };
        if (!retAge.ok) return { error: retAge.error };
        if (!savings.ok) return { error: savings.error };
        if (!monthly.ok) return { error: monthly.error };
        if (!ret.ok) return { error: ret.error };
        const computed = retirementCalc({
          currentAge: age.value,
          retirementAge: retAge.value,
          currentSavings: savings.value,
          monthlySavings: monthly.value,
          expectedReturnPercent: ret.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.retirementCorpus),
          primaryLabel: "Projected retirement corpus",
          rows: [
            { label: "Years to retirement", value: String(computed.yearsToRetirement) },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Interest / gains", value: fmt(computed.interestEarned) },
            { label: "Corpus at retirement", value: fmt(computed.retirementCorpus) },
          ],
        };
      }
      case "fire": {
        const exp = parsePositive(e, "Annual expenses");
        const wd = parseAprPercent(w, "Withdrawal rate %");
        const savings = parseNonNegative(c, "Current savings");
        const monthly = parseNonNegative(m, "Monthly savings");
        const ret = parseAprPercent(r, "Expected return %");
        if (!exp.ok) return { error: exp.error };
        if (!wd.ok) return { error: wd.error };
        if (!savings.ok) return { error: savings.error };
        if (!monthly.ok) return { error: monthly.error };
        if (!ret.ok) return { error: ret.error };
        const computed = fireCalc({
          annualExpenses: exp.value,
          withdrawalRatePercent: wd.value,
          currentSavings: savings.value,
          monthlySavings: monthly.value,
          expectedReturnPercent: ret.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.fireNumber),
          primaryLabel: "FIRE number",
          rows: [
            { label: "FIRE number", value: fmt(computed.fireNumber) },
            { label: "Years to FIRE", value: computed.yearsToFire.toFixed(1) },
            { label: "Projected at FIRE", value: fmt(computed.projectedAtFire) },
            { label: "Safe monthly withdrawal", value: fmt(computed.monthlySafeWithdrawal) },
          ],
        };
      }
      case "pension": {
        const corpus = parsePositive(c, "Corpus");
        const rate = parseAprPercent(w, "Payout rate %");
        if (!corpus.ok) return { error: corpus.error };
        if (!rate.ok) return { error: rate.error };
        const computed = pensionCalc({ corpus: corpus.value, annualPayoutRatePercent: rate.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.monthlyPension),
          primaryLabel: "Estimated monthly pension",
          rows: [
            { label: "Corpus", value: fmt(computed.corpus) },
            { label: "Annual pension", value: fmt(computed.annualPension) },
            { label: "Monthly pension", value: fmt(computed.monthlyPension) },
            { label: "Payout rate", value: pct(rate.value) },
          ],
        };
      }
      case "corpus": {
        const exp = parsePositive(e, "Monthly expenses at retirement");
        const wd = parseAprPercent(w, "Withdrawal rate %");
        if (!exp.ok) return { error: exp.error };
        if (!wd.ok) return { error: wd.error };
        const computed = retirementCorpusNeeded({
          monthlyExpensesAtRetirement: exp.value,
          withdrawalRatePercent: wd.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredCorpus),
          primaryLabel: "Required retirement corpus",
          rows: [
            { label: "Annual expenses", value: fmt(computed.annualExpenses) },
            { label: "Monthly withdrawal", value: fmt(computed.monthlyWithdrawal) },
            { label: "Required corpus", value: fmt(computed.requiredCorpus) },
          ],
        };
      }
      case "withdraw": {
        const corpus = parsePositive(c, "Corpus");
        const monthly = parsePositive(m, "Monthly withdrawal");
        const ret = parseAprPercent(r, "Portfolio return %");
        const years = parsePositive(y, "Years");
        if (!corpus.ok) return { error: corpus.error };
        if (!monthly.ok) return { error: monthly.error };
        if (!ret.ok) return { error: ret.error };
        if (!years.ok) return { error: years.error };
        const computed = retirementWithdrawal({
          corpus: corpus.value,
          monthlyWithdrawal: monthly.value,
          annualReturnPercent: ret.value,
          years: years.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.depleted ? "Corpus depleted" : fmt(computed.endingCorpus),
          primaryLabel: computed.depleted
            ? `Ran out after ~${computed.monthsSurvived} months`
            : "Ending corpus",
          rows: [
            { label: "Total withdrawn", value: fmt(computed.totalWithdrawn) },
            { label: "Months simulated", value: String(computed.monthsSurvived) },
            { label: "Ending corpus", value: fmt(computed.endingCorpus) },
          ],
        };
      }
      case "inflation": {
        const exp = parsePositive(e, "Monthly expenses today");
        const years = parseNonNegative(y, "Years to retirement");
        const inf = parseAprPercent(i, "Inflation %");
        const corpus = parseNonNegative(c, "Planned corpus");
        const wd = parseAprPercent(w, "Withdrawal rate %");
        if (!exp.ok) return { error: exp.error };
        if (!years.ok) return { error: years.error };
        if (!inf.ok) return { error: inf.error };
        if (!corpus.ok) return { error: corpus.error };
        if (!wd.ok) return { error: wd.error };
        const computed = inflationImpactRetirement({
          monthlyExpensesToday: exp.value,
          yearsToRetirement: years.value,
          inflationPercent: inf.value,
          plannedCorpus: corpus.value,
          withdrawalRatePercent: wd.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredCorpus),
          primaryLabel: "Inflation-adjusted corpus needed",
          rows: [
            { label: "Monthly expenses at retirement", value: fmt(computed.monthlyExpensesAtRetirement) },
            { label: "Annual expenses at retirement", value: fmt(computed.annualExpensesAtRetirement) },
            { label: "Required corpus", value: fmt(computed.requiredCorpus) },
            {
              label: "Surplus / (shortfall)",
              value: fmt(computed.corpusShortfallOrSurplus),
            },
            {
              label: "Monthly from planned corpus",
              value: fmt(computed.monthlyWithdrawalFromCorpus),
            },
          ],
        };
      }
      case "longevity": {
        const age = parsePositive(a, "Current age");
        const retAge = parsePositive(b, "Retirement age");
        const life = parsePositive(p, "Expected lifespan");
        const exp = parsePositive(e, "Monthly expenses (today's ₹)");
        const inf = parseAprPercent(i, "Inflation %");
        const wd = parseAprPercent(w, "Withdrawal rate %");
        if (!age.ok) return { error: age.error };
        if (!retAge.ok) return { error: retAge.error };
        if (!life.ok) return { error: life.error };
        if (!exp.ok) return { error: exp.error };
        if (!inf.ok) return { error: inf.error };
        if (!wd.ok) return { error: wd.error };
        const computed = lifeExpectancyFinancial({
          currentAge: age.value,
          retirementAge: retAge.value,
          expectedLifespan: life.value,
          monthlyExpensesAtRetirement: exp.value,
          inflationPercent: inf.value,
          withdrawalRatePercent: wd.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.yearsInRetirement),
          primaryLabel: "Years in retirement to fund",
          rows: [
            { label: "Years to retirement", value: String(computed.yearsToRetirement) },
            { label: "Years in retirement", value: String(computed.yearsInRetirement) },
            { label: "Future monthly expenses", value: fmt(computed.futureMonthlyExpenses) },
            { label: "Required corpus", value: fmt(computed.requiredCorpus) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [a, b, c, config, e, fmt, i, m, p, r, w, y]);

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
            <p className="text-xs text-[var(--muted)]">
              Planning estimates only—not personalized financial advice. Longevity and markets are uncertain.
            </p>
          </div>
        )
      }
    >
      <div className="mb-4">
        <FieldLabel htmlFor="currency">Currency</FieldLabel>
        <select
          id="currency"
          value={currency}
          onChange={(ev) => setCurrency(ev.target.value as RetirementCurrencyCode)}
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {config.mode === "retire" || config.mode === "longevity" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Current age</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Retirement age</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "retire" ? (
          <>
            <div>
              <FieldLabel htmlFor="c">Current savings / corpus</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="m">Monthly savings</FieldLabel>
              <FieldInput id="m" inputMode="decimal" value={m} onChange={(ev) => setM(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="r">Expected annual return %</FieldLabel>
              <FieldInput id="r" inputMode="decimal" value={r} onChange={(ev) => setR(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "fire" ? (
          <>
            <div>
              <FieldLabel htmlFor="e">Annual expenses</FieldLabel>
              <FieldInput id="e" inputMode="decimal" value={e} onChange={(ev) => setE(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w">Safe withdrawal rate %</FieldLabel>
              <FieldInput id="w" inputMode="decimal" value={w} onChange={(ev) => setW(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Current savings</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="m">Monthly savings</FieldLabel>
              <FieldInput id="m" inputMode="decimal" value={m} onChange={(ev) => setM(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="r">Expected annual return %</FieldLabel>
              <FieldInput id="r" inputMode="decimal" value={r} onChange={(ev) => setR(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "pension" ? (
          <>
            <div>
              <FieldLabel htmlFor="c">Retirement corpus</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w">Annual payout rate %</FieldLabel>
              <FieldInput id="w" inputMode="decimal" value={w} onChange={(ev) => setW(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "corpus" ? (
          <>
            <div>
              <FieldLabel htmlFor="e">Monthly expenses at retirement</FieldLabel>
              <FieldInput id="e" inputMode="decimal" value={e} onChange={(ev) => setE(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w">Withdrawal rate %</FieldLabel>
              <FieldInput id="w" inputMode="decimal" value={w} onChange={(ev) => setW(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "withdraw" ? (
          <>
            <div>
              <FieldLabel htmlFor="c">Starting corpus</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="m">Monthly withdrawal</FieldLabel>
              <FieldInput id="m" inputMode="decimal" value={m} onChange={(ev) => setM(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="r">Portfolio return %</FieldLabel>
              <FieldInput id="r" inputMode="decimal" value={r} onChange={(ev) => setR(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="y">Years to simulate</FieldLabel>
              <FieldInput id="y" inputMode="decimal" value={y} onChange={(ev) => setY(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "inflation" ? (
          <>
            <div>
              <FieldLabel htmlFor="e">Monthly expenses today</FieldLabel>
              <FieldInput id="e" inputMode="decimal" value={e} onChange={(ev) => setE(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="y">Years to retirement</FieldLabel>
              <FieldInput id="y" inputMode="decimal" value={y} onChange={(ev) => setY(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="i">Inflation %</FieldLabel>
              <FieldInput id="i" inputMode="decimal" value={i} onChange={(ev) => setI(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Planned retirement corpus</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w">Withdrawal rate %</FieldLabel>
              <FieldInput id="w" inputMode="decimal" value={w} onChange={(ev) => setW(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "longevity" ? (
          <>
            <div>
              <FieldLabel htmlFor="p">Expected lifespan (age)</FieldLabel>
              <FieldInput id="p" inputMode="decimal" value={p} onChange={(ev) => setP(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="e">Monthly expenses (today)</FieldLabel>
              <FieldInput id="e" inputMode="decimal" value={e} onChange={(ev) => setE(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="i">Inflation %</FieldLabel>
              <FieldInput id="i" inputMode="decimal" value={i} onChange={(ev) => setI(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w">Withdrawal rate %</FieldLabel>
              <FieldInput id="w" inputMode="decimal" value={w} onChange={(ev) => setW(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
