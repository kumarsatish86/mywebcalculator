"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import type { FreelanceCurrencyCode } from "@/lib/calculators/freelanceGigIncome";
import {
  DEFAULT_BILLABLE_DAYS,
  DEFAULT_BILLABLE_HOURS,
  FREELANCE_URL,
  contractorPay,
  dailyRateIncome,
  formatFreelanceMoney,
  freelanceIncome,
  freelancerTax,
  hourlyRateFromTarget,
  projectRate,
} from "@/lib/calculators/freelanceGigIncome";

type FreelanceSlug =
  | "freelance-income-calculator"
  | "hourly-rate-calculator"
  | "project-rate-calculator"
  | "freelancer-tax-calculator"
  | "contractor-pay-calculator"
  | "daily-rate-calculator";

type FreelanceMode = "freelanceIncome" | "hourlyRate" | "projectRate" | "freelancerTax" | "contractorPay" | "dailyRate";

type Config = {
  title: string;
  description: string;
  mode: FreelanceMode;
  amountLabel: string;
  amountDefault: string;
  showHours?: boolean;
  showWeeks?: boolean;
  showProject?: boolean;
  showTax?: boolean;
  showContract?: boolean;
  showDays?: boolean;
  secondaryLabel?: string;
  secondaryDefault?: string;
};

const CONFIG: Record<FreelanceSlug, Config> = {
  "freelance-income-calculator": {
    title: "Freelance income calculator",
    description: "Estimate weekly, monthly, and annual freelance income from your hourly rate and billable hours.",
    mode: "freelanceIncome",
    amountLabel: "Hourly rate",
    amountDefault: "50",
    showHours: true,
    showWeeks: true,
  },
  "hourly-rate-calculator": {
    title: "Hourly rate calculator",
    description: "Find the hourly rate needed to hit a target annual income at your billable hours per week.",
    mode: "hourlyRate",
    amountLabel: "Target annual income",
    amountDefault: "78000",
    showHours: true,
    showWeeks: true,
  },
  "project-rate-calculator": {
    title: "Project rate calculator",
    description: "Calculate effective hourly and daily rate from a fixed project fee and estimated hours.",
    mode: "projectRate",
    amountLabel: "Project fee",
    amountDefault: "5000",
    showProject: true,
    secondaryLabel: "Project hours",
    secondaryDefault: "40",
  },
  "freelancer-tax-calculator": {
    title: "Freelancer tax calculator",
    description: "Estimate net freelance income after income tax and business expense deductions.",
    mode: "freelancerTax",
    amountLabel: "Gross annual income",
    amountDefault: "1200000",
    showTax: true,
  },
  "contractor-pay-calculator": {
    title: "Contractor pay calculator",
    description: "Break down contract value into monthly pay, weekly pay, and effective hourly rate.",
    mode: "contractorPay",
    amountLabel: "Total contract value",
    amountDefault: "600000",
    showContract: true,
    showHours: true,
  },
  "daily-rate-calculator": {
    title: "Daily rate calculator",
    description: "Convert a day rate into weekly, monthly, and annual freelance income.",
    mode: "dailyRate",
    amountLabel: "Daily rate",
    amountDefault: "500",
    showDays: true,
    showWeeks: true,
  },
};

const CURRENCIES: FreelanceCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function FreelanceGigIncomeCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as FreelanceSlug] ?? CONFIG["freelance-income-calculator"];
  const [currency, setCurrency] = useState<FreelanceCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(FREELANCE_URL.A, config.amountDefault));
  const [secondary, setSecondary] = useState(
    useLoanInitialInput(FREELANCE_URL.B, config.secondaryDefault ?? String(DEFAULT_BILLABLE_HOURS)),
  );
  const [hoursPerWeek, setHoursPerWeek] = useState(
    useLoanInitialInput(FREELANCE_URL.H, String(DEFAULT_BILLABLE_HOURS)),
  );
  const [weeksPerYear, setWeeksPerYear] = useState(useLoanInitialInput(FREELANCE_URL.W, "52"));
  const [daysPerWeek, setDaysPerWeek] = useState(useLoanInitialInput(FREELANCE_URL.D, String(DEFAULT_BILLABLE_DAYS)));
  const [taxPct, setTaxPct] = useState(useLoanInitialInput(FREELANCE_URL.T, "20"));
  const [expensePct, setExpensePct] = useState(useLoanInitialInput(FREELANCE_URL.X, "10"));
  const [contractMonths, setContractMonths] = useState(useLoanInitialInput(FREELANCE_URL.M, "6"));

  const fmt = useCallback((n: number) => formatFreelanceMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [FREELANCE_URL.A]: amount,
      [FREELANCE_URL.B]: secondary,
      [FREELANCE_URL.H]: hoursPerWeek,
      [FREELANCE_URL.W]: weeksPerYear,
      [FREELANCE_URL.D]: daysPerWeek,
      [FREELANCE_URL.T]: taxPct,
      [FREELANCE_URL.X]: expensePct,
      [FREELANCE_URL.M]: contractMonths,
    }),
    [amount, secondary, hoursPerWeek, weeksPerYear, daysPerWeek, taxPct, expensePct, contractMonths],
  );

  useLoanUrlSync(shareParams, [amount, secondary, hoursPerWeek, weeksPerYear, daysPerWeek, taxPct, expensePct, contractMonths]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "freelanceIncome": {
        const hours = parsePositive(hoursPerWeek, "Billable hours per week");
        const weeks = parsePositive(weeksPerYear, "Weeks per year");
        if (!hours.ok) return { error: hours.error };
        if (!weeks.ok) return { error: weeks.error };
        const computed = freelanceIncome({
          hourlyRate: amountParsed.value,
          billableHoursPerWeek: hours.value,
          weeksPerYear: weeks.value,
        });
        return {
          primary: fmt(computed.annualIncome),
          primaryLabel: "Annual freelance income",
          rows: [
            { label: "Hourly rate", value: fmt(computed.hourlyRate) },
            { label: "Billable hours/week", value: String(computed.billableHoursPerWeek) },
            { label: "Weekly income", value: fmt(computed.weeklyIncome) },
            { label: "Monthly income", value: fmt(computed.monthlyIncome) },
            { label: "Annual income", value: fmt(computed.annualIncome) },
            { label: "Billable hours/year", value: String(Math.round(computed.billableHoursPerYear)) },
          ],
        };
      }
      case "hourlyRate": {
        const hours = parsePositive(hoursPerWeek, "Billable hours per week");
        const weeks = parsePositive(weeksPerYear, "Weeks per year");
        if (!hours.ok) return { error: hours.error };
        if (!weeks.ok) return { error: weeks.error };
        const computed = hourlyRateFromTarget({
          targetAnnualIncome: amountParsed.value,
          billableHoursPerWeek: hours.value,
          weeksPerYear: weeks.value,
        });
        return {
          primary: fmt(computed.requiredHourlyRate),
          primaryLabel: "Required hourly rate",
          rows: [
            { label: "Target annual income", value: fmt(computed.targetAnnualIncome) },
            { label: "Billable hours/week", value: String(computed.billableHoursPerWeek) },
            { label: "Billable hours/year", value: String(Math.round(computed.billableHoursPerYear)) },
            { label: "Required hourly rate", value: fmt(computed.requiredHourlyRate) },
            { label: "Weekly income at rate", value: fmt(computed.weeklyIncome) },
          ],
        };
      }
      case "projectRate": {
        const hours = parsePositive(secondary, "Project hours");
        if (!hours.ok) return { error: hours.error };
        const computed = projectRate({ projectFee: amountParsed.value, projectHours: hours.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.effectiveHourlyRate),
          primaryLabel: "Effective hourly rate",
          rows: [
            { label: "Project fee", value: fmt(computed.projectFee) },
            { label: "Project hours", value: String(computed.projectHours) },
            { label: "Effective hourly rate", value: fmt(computed.effectiveHourlyRate) },
            { label: "Implied daily rate (8h)", value: fmt(computed.dailyRateAt8h) },
          ],
        };
      }
      case "freelancerTax": {
        const tax = parseAprPercent(taxPct, "Tax %");
        const exp = parseAprPercent(expensePct, "Business expenses %");
        if (!tax.ok) return { error: tax.error };
        if (!exp.ok) return { error: exp.error };
        const computed = freelancerTax({
          grossAnnualIncome: amountParsed.value,
          taxPercent: tax.value,
          expensePercent: exp.value,
        });
        return {
          primary: fmt(computed.netAnnualIncome),
          primaryLabel: "Net annual income",
          rows: [
            { label: "Gross annual", value: fmt(computed.grossAnnualIncome) },
            { label: "Income tax", value: fmt(computed.taxAmount) },
            { label: "Business expenses", value: fmt(computed.expenseAmount) },
            { label: "Net annual", value: fmt(computed.netAnnualIncome) },
            { label: "Net monthly", value: fmt(computed.netMonthlyIncome) },
            { label: "Effective deduction rate", value: `${computed.effectiveTaxRate.toFixed(1)}%` },
          ],
        };
      }
      case "contractorPay": {
        const months = parsePositive(contractMonths, "Contract months");
        const hours = parsePositive(hoursPerWeek, "Hours per week");
        if (!months.ok) return { error: months.error };
        if (!hours.ok) return { error: hours.error };
        const computed = contractorPay({
          contractValue: amountParsed.value,
          contractMonths: months.value,
          hoursPerWeek: hours.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.monthlyPay),
          primaryLabel: "Monthly contractor pay",
          rows: [
            { label: "Contract value", value: fmt(computed.contractValue) },
            { label: "Contract duration", value: `${computed.contractMonths} months` },
            { label: "Monthly pay", value: fmt(computed.monthlyPay) },
            { label: "Weekly pay", value: fmt(computed.weeklyPay) },
            { label: "Effective hourly rate", value: fmt(computed.effectiveHourlyRate) },
          ],
        };
      }
      case "dailyRate": {
        const days = parsePositive(daysPerWeek, "Billable days per week");
        const weeks = parsePositive(weeksPerYear, "Weeks per year");
        if (!days.ok) return { error: days.error };
        if (!weeks.ok) return { error: weeks.error };
        const computed = dailyRateIncome({
          dailyRate: amountParsed.value,
          billableDaysPerWeek: days.value,
          weeksPerYear: weeks.value,
        });
        return {
          primary: fmt(computed.annualIncome),
          primaryLabel: "Annual income",
          rows: [
            { label: "Daily rate", value: fmt(computed.dailyRate) },
            { label: "Billable days/week", value: String(computed.billableDaysPerWeek) },
            { label: "Weekly income", value: fmt(computed.weeklyIncome) },
            { label: "Monthly income", value: fmt(computed.monthlyIncome) },
            { label: "Annual income", value: fmt(computed.annualIncome) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amount, config, contractMonths, daysPerWeek, expensePct, fmt, hoursPerWeek, secondary, taxPct, weeksPerYear]);

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
          onChange={(e) => setCurrency(e.target.value as FreelanceCurrencyCode)}
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
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" />
        </div>

        {config.showProject ? (
          <div>
            <FieldLabel htmlFor="secondary">{config.secondaryLabel}</FieldLabel>
            <FieldInput id="secondary" inputMode="decimal" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showHours && config.mode !== "contractorPay" ? (
          <div>
            <FieldLabel htmlFor="hours">Billable hours per week</FieldLabel>
            <FieldInput id="hours" inputMode="decimal" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showContract ? (
          <>
            <div>
              <FieldLabel htmlFor="months">Contract duration (months)</FieldLabel>
              <FieldInput id="months" inputMode="decimal" value={contractMonths} onChange={(e) => setContractMonths(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="contractHours">Hours per week</FieldLabel>
              <FieldInput id="contractHours" inputMode="decimal" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showWeeks ? (
          <div>
            <FieldLabel htmlFor="weeks">Weeks per year</FieldLabel>
            <FieldInput id="weeks" inputMode="decimal" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showDays ? (
          <div>
            <FieldLabel htmlFor="days">Billable days per week</FieldLabel>
            <FieldInput id="days" inputMode="decimal" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showTax ? (
          <>
            <div>
              <FieldLabel htmlFor="tax">Income tax %</FieldLabel>
              <FieldInput id="tax" inputMode="decimal" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="expense">Business expenses %</FieldLabel>
              <FieldInput id="expense" inputMode="decimal" value={expensePct} onChange={(e) => setExpensePct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
