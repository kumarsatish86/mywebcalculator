"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { GoalInvestmentCurrencyCode } from "@/lib/calculators/goalBasedInvestment";
import {
  DEFAULT_GOAL_INFLATION,
  DEFAULT_GOAL_RETURN,
  DEFAULT_WITHDRAWAL_RATE,
  GOAL_INVESTMENT_URL,
  carPurchasePlan,
  childEducationPlan,
  childMarriagePlan,
  dreamHomePlan,
  financialFreedomPlan,
  formatGoalMoney,
  goalSipCalc,
  vacationPlan,
  wealthGoalPlan,
} from "@/lib/calculators/goalBasedInvestment";

type GoalSlug =
  | "child-education-planning-calculator"
  | "child-marriage-planning-calculator"
  | "wealth-goal-calculator"
  | "dream-home-investment-planner"
  | "car-purchase-planning-calculator"
  | "vacation-planning-calculator"
  | "financial-freedom-calculator"
  | "goal-sip-calculator";

type Mode =
  | "education"
  | "marriage"
  | "wealth"
  | "home"
  | "car"
  | "vacation"
  | "freedom"
  | "goalSip";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  costLabel: string;
  costDefault: string;
  yearsDefault: string;
  showInflation?: boolean;
  showDownPayment?: boolean;
  showWithdrawal?: boolean;
  inflationDefault?: string;
  returnDefault?: string;
};

const CONFIG: Record<GoalSlug, Config> = {
  "child-education-planning-calculator": {
    title: "Child education planning calculator",
    description: "Estimate future education cost with inflation and the monthly SIP needed to fund it.",
    mode: "education",
    costLabel: "Education cost today",
    costDefault: "2000000",
    yearsDefault: "12",
    showInflation: true,
    inflationDefault: "8",
    returnDefault: String(DEFAULT_GOAL_RETURN),
  },
  "child-marriage-planning-calculator": {
    title: "Child marriage planning calculator",
    description: "Plan the corpus and SIP for a future wedding milestone with cost inflation.",
    mode: "marriage",
    costLabel: "Estimated wedding cost today",
    costDefault: "1500000",
    yearsDefault: "15",
    showInflation: true,
    inflationDefault: String(DEFAULT_GOAL_INFLATION),
    returnDefault: String(DEFAULT_GOAL_RETURN),
  },
  "wealth-goal-calculator": {
    title: "Wealth goal calculator",
    description: "Find the monthly SIP required to reach a target net worth in a set number of years.",
    mode: "wealth",
    costLabel: "Target wealth",
    costDefault: "10000000",
    yearsDefault: "15",
    returnDefault: String(DEFAULT_GOAL_RETURN),
  },
  "dream-home-investment-planner": {
    title: "Dream home investment planner",
    description: "Inflate home price, size the down payment, and compute the SIP to accumulate it.",
    mode: "home",
    costLabel: "Home cost today",
    costDefault: "10000000",
    yearsDefault: "8",
    showInflation: true,
    showDownPayment: true,
    inflationDefault: "5",
    returnDefault: String(DEFAULT_GOAL_RETURN),
  },
  "car-purchase-planning-calculator": {
    title: "Car purchase planning calculator",
    description: "Plan a car purchase with price inflation and the monthly savings/SIP required.",
    mode: "car",
    costLabel: "Car cost today",
    costDefault: "800000",
    yearsDefault: "3",
    showInflation: true,
    inflationDefault: "4",
    returnDefault: "8",
  },
  "vacation-planning-calculator": {
    title: "Vacation planning calculator",
    description: "Save for a dream trip—future cost with inflation and required monthly SIP.",
    mode: "vacation",
    costLabel: "Vacation budget today",
    costDefault: "200000",
    yearsDefault: "2",
    showInflation: true,
    inflationDefault: "5",
    returnDefault: "8",
  },
  "financial-freedom-calculator": {
    title: "Financial freedom calculator",
    description: "Compute your freedom number (expenses ÷ withdrawal rate) and SIP path to reach it.",
    mode: "freedom",
    costLabel: "Annual expenses",
    costDefault: "600000",
    yearsDefault: "20",
    showWithdrawal: true,
    returnDefault: String(DEFAULT_GOAL_RETURN),
  },
  "goal-sip-calculator": {
    title: "Goal SIP calculator",
    description: "Enter any future goal amount and tenure to get the exact monthly SIP required.",
    mode: "goalSip",
    costLabel: "Goal amount (future value)",
    costDefault: "5000000",
    yearsDefault: "10",
    returnDefault: String(DEFAULT_GOAL_RETURN),
  },
};

const CURRENCIES: GoalInvestmentCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function GoalBasedInvestmentCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as GoalSlug] ?? CONFIG["goal-sip-calculator"];
  const [currency, setCurrency] = useState<GoalInvestmentCurrencyCode>("INR");
  const [cost, setCost] = useState(useLoanInitialInput(GOAL_INVESTMENT_URL.A, config.costDefault));
  const [years, setYears] = useState(useLoanInitialInput(GOAL_INVESTMENT_URL.Y, config.yearsDefault));
  const [corpus, setCorpus] = useState(useLoanInitialInput(GOAL_INVESTMENT_URL.C, "100000"));
  const [rate, setRate] = useState(useLoanInitialInput(GOAL_INVESTMENT_URL.R, config.returnDefault ?? "12"));
  const [inflation, setInflation] = useState(
    useLoanInitialInput(GOAL_INVESTMENT_URL.I, config.inflationDefault ?? "6"),
  );
  const [downPct, setDownPct] = useState(useLoanInitialInput(GOAL_INVESTMENT_URL.B, "20"));
  const [withdraw, setWithdraw] = useState(
    useLoanInitialInput(GOAL_INVESTMENT_URL.W, String(DEFAULT_WITHDRAWAL_RATE)),
  );

  const fmt = useCallback((n: number) => formatGoalMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [GOAL_INVESTMENT_URL.A]: cost,
      [GOAL_INVESTMENT_URL.Y]: years,
      [GOAL_INVESTMENT_URL.C]: corpus,
      [GOAL_INVESTMENT_URL.R]: rate,
      [GOAL_INVESTMENT_URL.I]: inflation,
      [GOAL_INVESTMENT_URL.B]: downPct,
      [GOAL_INVESTMENT_URL.W]: withdraw,
    }),
    [cost, years, corpus, rate, inflation, downPct, withdraw],
  );

  useLoanUrlSync(shareParams, [cost, years, corpus, rate, inflation, downPct, withdraw]);

  const result = useMemo(() => {
    const costP = parsePositive(cost, config.costLabel);
    const yearsP = parsePositive(years, "Years");
    const corpusP = parseNonNegative(corpus, "Existing corpus");
    const rateP = parseAprPercent(rate, "Expected return %");
    if (!costP.ok) return { error: costP.error };
    if (!yearsP.ok) return { error: yearsP.error };
    if (!corpusP.ok) return { error: corpusP.error };
    if (!rateP.ok) return { error: rateP.error };

    switch (config.mode) {
      case "education": {
        const inf = parseAprPercent(inflation, "Education inflation %");
        if (!inf.ok) return { error: inf.error };
        const computed = childEducationPlan({
          educationCostToday: costP.value,
          yearsUntilCollege: yearsP.value,
          educationInflationPercent: inf.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP",
          rows: [
            { label: "Cost today", value: fmt(computed.costToday) },
            { label: "Future education cost", value: fmt(computed.futureCost) },
            { label: "Existing corpus (grown)", value: fmt(computed.futureOfExisting) },
            { label: "Shortfall", value: fmt(computed.shortfall) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total SIP invested", value: fmt(computed.totalSipInvested) },
          ],
        };
      }
      case "marriage": {
        const inf = parseAprPercent(inflation, "Inflation %");
        if (!inf.ok) return { error: inf.error };
        const computed = childMarriagePlan({
          marriageCostToday: costP.value,
          yearsUntilEvent: yearsP.value,
          inflationPercent: inf.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP",
          rows: [
            { label: "Cost today", value: fmt(computed.costToday) },
            { label: "Future wedding cost", value: fmt(computed.futureCost) },
            { label: "Existing corpus (grown)", value: fmt(computed.futureOfExisting) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total SIP invested", value: fmt(computed.totalSipInvested) },
          ],
        };
      }
      case "wealth": {
        const computed = wealthGoalPlan({
          targetWealth: costP.value,
          years: yearsP.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP",
          rows: [
            { label: "Target wealth", value: fmt(computed.costToday) },
            { label: "Existing corpus (grown)", value: fmt(computed.futureOfExisting) },
            { label: "Shortfall", value: fmt(computed.shortfall) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total SIP invested", value: fmt(computed.totalSipInvested) },
          ],
        };
      }
      case "home": {
        const inf = parseAprPercent(inflation, "Property inflation %");
        const dp = parsePositive(downPct, "Down payment %");
        if (!inf.ok) return { error: inf.error };
        if (!dp.ok) return { error: dp.error };
        const computed = dreamHomePlan({
          homeCostToday: costP.value,
          years: yearsP.value,
          propertyInflationPercent: inf.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
          downPaymentPercent: dp.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP (for down payment)",
          rows: [
            { label: "Home cost today", value: fmt(costP.value) },
            { label: "Down payment today", value: fmt(computed.downPaymentToday) },
            { label: "Down payment needed (future)", value: fmt(computed.downPaymentFuture) },
            { label: "Existing corpus (grown)", value: fmt(computed.futureOfExisting) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
          ],
        };
      }
      case "car": {
        const inf = parseAprPercent(inflation, "Inflation %");
        if (!inf.ok) return { error: inf.error };
        const computed = carPurchasePlan({
          carCostToday: costP.value,
          years: yearsP.value,
          inflationPercent: inf.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP",
          rows: [
            { label: "Car cost today", value: fmt(computed.costToday) },
            { label: "Future car cost", value: fmt(computed.futureCost) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total invested", value: fmt(computed.totalSipInvested) },
          ],
        };
      }
      case "vacation": {
        const inf = parseAprPercent(inflation, "Inflation %");
        if (!inf.ok) return { error: inf.error };
        const computed = vacationPlan({
          vacationCostToday: costP.value,
          years: yearsP.value,
          inflationPercent: inf.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP",
          rows: [
            { label: "Budget today", value: fmt(computed.costToday) },
            { label: "Future trip cost", value: fmt(computed.futureCost) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total invested", value: fmt(computed.totalSipInvested) },
          ],
        };
      }
      case "freedom": {
        const wd = parseAprPercent(withdraw, "Withdrawal rate %");
        if (!wd.ok) return { error: wd.error };
        const computed = financialFreedomPlan({
          annualExpenses: costP.value,
          withdrawalRatePercent: wd.value,
          years: yearsP.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.freedomNumber),
          primaryLabel: "Financial freedom number",
          rows: [
            { label: "Freedom number", value: fmt(computed.freedomNumber) },
            { label: "Existing corpus (grown)", value: fmt(computed.futureOfExisting) },
            { label: "Shortfall", value: fmt(computed.shortfall) },
            { label: "Required monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total SIP invested", value: fmt(computed.totalSipInvested) },
          ],
        };
      }
      case "goalSip": {
        const computed = goalSipCalc({
          goalAmount: costP.value,
          years: yearsP.value,
          expectedReturnPercent: rateP.value,
          existingCorpus: corpusP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.requiredMonthlySip),
          primaryLabel: "Required monthly SIP",
          rows: [
            { label: "Goal amount", value: fmt(computed.goalAmount) },
            { label: "Years", value: String(computed.years) },
            { label: "Existing corpus (grown)", value: fmt(computed.futureOfExisting) },
            { label: "Monthly SIP", value: fmt(computed.requiredMonthlySip) },
            { label: "Total SIP invested", value: fmt(computed.totalInvested) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [config, corpus, cost, downPct, fmt, inflation, rate, withdraw, years]);

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
              Illustrative planning math—actual returns vary; goals and costs can change.
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
          onChange={(ev) => setCurrency(ev.target.value as GoalInvestmentCurrencyCode)}
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
        <div>
          <FieldLabel htmlFor="cost">{config.costLabel}</FieldLabel>
          <FieldInput id="cost" inputMode="decimal" value={cost} onChange={(ev) => setCost(ev.target.value)} className="mt-2" />
        </div>
        <div>
          <FieldLabel htmlFor="years">Years to goal</FieldLabel>
          <FieldInput id="years" inputMode="decimal" value={years} onChange={(ev) => setYears(ev.target.value)} className="mt-2" />
        </div>
        <div>
          <FieldLabel htmlFor="corpus">Existing savings for this goal</FieldLabel>
          <FieldInput id="corpus" inputMode="decimal" value={corpus} onChange={(ev) => setCorpus(ev.target.value)} className="mt-2" />
        </div>
        <div>
          <FieldLabel htmlFor="rate">Expected annual return %</FieldLabel>
          <FieldInput id="rate" inputMode="decimal" value={rate} onChange={(ev) => setRate(ev.target.value)} className="mt-2" />
        </div>
        {config.showInflation ? (
          <div>
            <FieldLabel htmlFor="inflation">
              {config.mode === "education"
                ? "Education inflation %"
                : config.mode === "home"
                  ? "Property inflation %"
                  : "Inflation %"}
            </FieldLabel>
            <FieldInput
              id="inflation"
              inputMode="decimal"
              value={inflation}
              onChange={(ev) => setInflation(ev.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
        {config.showDownPayment ? (
          <div>
            <FieldLabel htmlFor="down">Down payment % of home cost</FieldLabel>
            <FieldInput id="down" inputMode="decimal" value={downPct} onChange={(ev) => setDownPct(ev.target.value)} className="mt-2" />
          </div>
        ) : null}
        {config.showWithdrawal ? (
          <div>
            <FieldLabel htmlFor="withdraw">Safe withdrawal rate %</FieldLabel>
            <FieldInput
              id="withdraw"
              inputMode="decimal"
              value={withdraw}
              onChange={(ev) => setWithdraw(ev.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
