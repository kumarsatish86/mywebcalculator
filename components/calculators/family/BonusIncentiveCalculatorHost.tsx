"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { BonusCurrencyCode } from "@/lib/calculators/bonusIncentive";
import {
  BONUS_URL,
  annualBonus,
  formatBonusMoney,
  incentivePayout,
  performanceBonus,
  profitSharing,
  salesCommission,
  variablePay,
} from "@/lib/calculators/bonusIncentive";

type BonusSlug =
  | "annual-bonus-calculator"
  | "performance-bonus-calculator"
  | "sales-commission-calculator"
  | "incentive-calculator"
  | "profit-sharing-calculator"
  | "variable-pay-calculator";

type BonusMode =
  | "annualBonus"
  | "performanceBonus"
  | "salesCommission"
  | "incentive"
  | "profitSharing"
  | "variablePay";

type Config = {
  title: string;
  description: string;
  mode: BonusMode;
  amountLabel: string;
  amountDefault: string;
  showPercent?: boolean;
  percentLabel?: string;
  percentDefault?: string;
  showSecondary?: boolean;
  secondaryLabel?: string;
  secondaryDefault?: string;
  showTertiary?: boolean;
  tertiaryLabel?: string;
  tertiaryDefault?: string;
};

const CONFIG: Record<BonusSlug, Config> = {
  "annual-bonus-calculator": {
    title: "Annual bonus calculator",
    description: "Estimate annual and monthly bonus from base salary and bonus percentage.",
    mode: "annualBonus",
    amountLabel: "Annual base salary",
    amountDefault: "1200000",
    showPercent: true,
    percentLabel: "Bonus % of salary",
    percentDefault: "15",
  },
  "performance-bonus-calculator": {
    title: "Performance bonus calculator",
    description: "Calculate earned bonus from target bonus percentage and performance score (0–100%).",
    mode: "performanceBonus",
    amountLabel: "Annual base salary",
    amountDefault: "1200000",
    showPercent: true,
    percentLabel: "Target bonus % of salary",
    percentDefault: "20",
    showSecondary: true,
    secondaryLabel: "Performance score (%)",
    secondaryDefault: "85",
  },
  "sales-commission-calculator": {
    title: "Sales commission calculator",
    description: "Compute commission from sales volume and rate, optionally adding a base salary.",
    mode: "salesCommission",
    amountLabel: "Sales amount",
    amountDefault: "5000000",
    showPercent: true,
    percentLabel: "Commission rate %",
    percentDefault: "5",
    showSecondary: true,
    secondaryLabel: "Base salary (optional)",
    secondaryDefault: "500000",
  },
  "incentive-calculator": {
    title: "Incentive calculator",
    description: "Estimate incentive payout from target vs achieved performance and incentive at 100%.",
    mode: "incentive",
    amountLabel: "Target amount",
    amountDefault: "1000000",
    showSecondary: true,
    secondaryLabel: "Achieved amount",
    secondaryDefault: "850000",
    showTertiary: true,
    tertiaryLabel: "Incentive at 100% achievement",
    tertiaryDefault: "100000",
  },
  "profit-sharing-calculator": {
    title: "Profit sharing calculator",
    description: "Estimate employee profit share from company profit and allocation percentage.",
    mode: "profitSharing",
    amountLabel: "Company profit (annual)",
    amountDefault: "10000000",
    showPercent: true,
    percentLabel: "Your share %",
    percentDefault: "2",
  },
  "variable-pay-calculator": {
    title: "Variable pay calculator",
    description: "Combine fixed annual pay with variable component based on achievement percentage.",
    mode: "variablePay",
    amountLabel: "Fixed annual salary",
    amountDefault: "1000000",
    showPercent: true,
    percentLabel: "Variable % of fixed",
    percentDefault: "30",
    showSecondary: true,
    secondaryLabel: "Achievement %",
    secondaryDefault: "90",
  },
};

const CURRENCIES: BonusCurrencyCode[] = ["INR", "USD", "EUR", "GBP"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function BonusIncentiveCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BonusSlug] ?? CONFIG["annual-bonus-calculator"];
  const [currency, setCurrency] = useState<BonusCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(BONUS_URL.A, config.amountDefault));
  const [percent, setPercent] = useState(useLoanInitialInput(BONUS_URL.P, config.percentDefault ?? "10"));
  const [secondary, setSecondary] = useState(useLoanInitialInput(BONUS_URL.B, config.secondaryDefault ?? "0"));
  const [tertiary, setTertiary] = useState(useLoanInitialInput(BONUS_URL.C, config.tertiaryDefault ?? "0"));

  const fmt = useCallback((n: number) => formatBonusMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [BONUS_URL.A]: amount,
      [BONUS_URL.P]: percent,
      [BONUS_URL.B]: secondary,
      [BONUS_URL.C]: tertiary,
    }),
    [amount, percent, secondary, tertiary],
  );

  useLoanUrlSync(shareParams, [amount, percent, secondary, tertiary]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "annualBonus": {
        const pct = parseAprPercent(percent, config.percentLabel ?? "Bonus %");
        if (!pct.ok) return { error: pct.error };
        const computed = annualBonus({ annualSalary: amountParsed.value, bonusPercent: pct.value });
        return {
          primary: fmt(computed.annualBonus),
          primaryLabel: "Annual bonus",
          rows: [
            { label: "Annual base salary", value: fmt(computed.annualSalary) },
            { label: "Bonus %", value: `${computed.bonusPercent}%` },
            { label: "Annual bonus", value: fmt(computed.annualBonus) },
            { label: "Monthly bonus", value: fmt(computed.monthlyBonus) },
            { label: "Total compensation", value: fmt(computed.totalCompensation) },
          ],
        };
      }
      case "performanceBonus": {
        const pct = parseAprPercent(percent, config.percentLabel ?? "Target bonus %");
        const score = parseNonNegative(secondary, config.secondaryLabel ?? "Performance score");
        if (!pct.ok) return { error: pct.error };
        if (!score.ok) return { error: score.error };
        if (score.value > 100) return { error: "Performance score cannot exceed 100%." };
        const computed = performanceBonus({
          annualSalary: amountParsed.value,
          targetBonusPercent: pct.value,
          performanceScore: score.value,
        });
        return {
          primary: fmt(computed.earnedBonus),
          primaryLabel: "Earned performance bonus",
          rows: [
            { label: "Annual base salary", value: fmt(computed.annualSalary) },
            { label: "Target bonus %", value: `${computed.targetBonusPercent}%` },
            { label: "Target bonus (at 100%)", value: fmt(computed.targetBonus) },
            { label: "Performance score", value: `${computed.performanceScore}%` },
            { label: "Earned bonus", value: fmt(computed.earnedBonus) },
            { label: "Monthly earned", value: fmt(computed.monthlyEarned) },
          ],
        };
      }
      case "salesCommission": {
        const pct = parseAprPercent(percent, config.percentLabel ?? "Commission rate");
        const base = parseNonNegative(secondary, config.secondaryLabel ?? "Base salary");
        if (!pct.ok) return { error: pct.error };
        if (!base.ok) return { error: base.error };
        const computed = salesCommission({
          salesAmount: amountParsed.value,
          commissionPercent: pct.value,
          baseSalary: base.value,
        });
        return {
          primary: fmt(computed.commission),
          primaryLabel: "Commission earned",
          rows: [
            { label: "Sales amount", value: fmt(computed.salesAmount) },
            { label: "Commission rate", value: `${computed.commissionPercent}%` },
            { label: "Commission", value: fmt(computed.commission) },
            { label: "Base salary", value: fmt(computed.baseSalary) },
            { label: "Total payout", value: fmt(computed.totalPayout) },
          ],
        };
      }
      case "incentive": {
        const achieved = parseNonNegative(secondary, config.secondaryLabel ?? "Achieved amount");
        const at100 = parseNonNegative(tertiary, config.tertiaryLabel ?? "Incentive at 100%");
        if (!achieved.ok) return { error: achieved.error };
        if (!at100.ok) return { error: at100.error };
        const computed = incentivePayout({
          targetAmount: amountParsed.value,
          achievedAmount: achieved.value,
          incentiveAt100: at100.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.payout),
          primaryLabel: "Incentive payout",
          rows: [
            { label: "Target", value: fmt(computed.targetAmount) },
            { label: "Achieved", value: fmt(computed.achievedAmount) },
            { label: "Achievement", value: `${computed.achievementPercent.toFixed(1)}%` },
            { label: "Incentive at 100%", value: fmt(computed.incentiveAt100) },
            { label: "Payout", value: fmt(computed.payout) },
          ],
        };
      }
      case "profitSharing": {
        const pct = parseAprPercent(percent, config.percentLabel ?? "Share %");
        if (!pct.ok) return { error: pct.error };
        const computed = profitSharing({ companyProfit: amountParsed.value, sharePercent: pct.value });
        return {
          primary: fmt(computed.profitShare),
          primaryLabel: "Profit share",
          rows: [
            { label: "Company profit", value: fmt(computed.companyProfit) },
            { label: "Your share %", value: `${computed.sharePercent}%` },
            { label: "Profit share (annual)", value: fmt(computed.profitShare) },
            { label: "Monthly equivalent", value: fmt(computed.monthlyEquivalent) },
          ],
        };
      }
      case "variablePay": {
        const pct = parseAprPercent(percent, config.percentLabel ?? "Variable %");
        const achievement = parseNonNegative(secondary, config.secondaryLabel ?? "Achievement %");
        if (!pct.ok) return { error: pct.error };
        if (!achievement.ok) return { error: achievement.error };
        const computed = variablePay({
          fixedAnnual: amountParsed.value,
          variablePercent: pct.value,
          achievementPercent: achievement.value,
        });
        return {
          primary: fmt(computed.totalAnnual),
          primaryLabel: "Total annual pay",
          rows: [
            { label: "Fixed annual", value: fmt(computed.fixedAnnual) },
            { label: "Variable % of fixed", value: `${computed.variablePercent}%` },
            { label: "Variable at 100%", value: fmt(computed.variableAt100) },
            { label: "Achievement", value: `${computed.achievementPercent}%` },
            { label: "Variable earned", value: fmt(computed.variableEarned) },
            { label: "Total annual", value: fmt(computed.totalAnnual) },
            { label: "Total monthly", value: fmt(computed.totalMonthly) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amount, config, fmt, percent, secondary, tertiary]);

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
          onChange={(e) => setCurrency(e.target.value as BonusCurrencyCode)}
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
        <div className={config.showPercent || config.showSecondary ? "sm:col-span-1" : "sm:col-span-2"}>
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
          />
        </div>

        {config.showPercent ? (
          <div>
            <FieldLabel htmlFor="percent">{config.percentLabel}</FieldLabel>
            <FieldInput
              id="percent"
              inputMode="decimal"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showSecondary ? (
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

        {config.showTertiary ? (
          <div>
            <FieldLabel htmlFor="tertiary">{config.tertiaryLabel}</FieldLabel>
            <FieldInput
              id="tertiary"
              inputMode="decimal"
              value={tertiary}
              onChange={(e) => setTertiary(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
