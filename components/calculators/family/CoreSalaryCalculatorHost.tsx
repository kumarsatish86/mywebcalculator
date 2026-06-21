"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import type { SalaryCurrencyCode } from "@/lib/calculators/salaryCore";
import {
  SALARY_URL,
  annualFromMonthly,
  ctcFromGross,
  formatSalaryMoney,
  grossFromNet,
  hourlyToSalary,
  monthlyFromAnnual,
  netFromGross,
  salaryToHourly,
} from "@/lib/calculators/salaryCore";

type CoreSalarySlug =
  | "salary-calculator-monthly-annual"
  | "in-hand-salary-calculator"
  | "gross-salary-calculator"
  | "net-salary-calculator"
  | "ctc-calculator"
  | "annual-salary-calculator"
  | "monthly-salary-calculator"
  | "hourly-to-salary-calculator"
  | "salary-to-hourly-calculator";

type SalaryMode =
  | "monthlyAnnual"
  | "inHand"
  | "grossBreakdown"
  | "netReverse"
  | "ctcFromGross"
  | "annualToMonthly"
  | "monthlyToAnnual"
  | "hourlyToSalary"
  | "salaryToHourly";

type Config = {
  title: string;
  description: string;
  mode: SalaryMode;
  amountLabel: string;
  amountDefault: string;
  showTax?: boolean;
  showDeduction?: boolean;
  showEmployer?: boolean;
  showHours?: boolean;
  showPeriod?: boolean;
};

const CONFIG: Record<CoreSalarySlug, Config> = {
  "salary-calculator-monthly-annual": {
    title: "Salary calculator (monthly / annual)",
    description: "Convert between monthly and annual salary using a simple ×12 relationship.",
    mode: "monthlyAnnual",
    amountLabel: "Salary amount",
    amountDefault: "75000",
    showPeriod: true,
  },
  "in-hand-salary-calculator": {
    title: "In-hand salary calculator",
    description: "Estimate take-home pay from gross salary after tax and other deductions.",
    mode: "inHand",
    amountLabel: "Gross salary (monthly)",
    amountDefault: "100000",
    showTax: true,
    showDeduction: true,
  },
  "gross-salary-calculator": {
    title: "Gross salary calculator",
    description: "Break down gross pay into tax, deductions, and net salary.",
    mode: "grossBreakdown",
    amountLabel: "Gross salary (monthly)",
    amountDefault: "100000",
    showTax: true,
    showDeduction: true,
  },
  "net-salary-calculator": {
    title: "Net salary calculator",
    description: "Reverse-calculate gross salary from your target net (take-home) pay.",
    mode: "netReverse",
    amountLabel: "Net salary (monthly)",
    amountDefault: "75000",
    showTax: true,
    showDeduction: true,
  },
  "ctc-calculator": {
    title: "CTC calculator (cost to company)",
    description: "Add employer contributions on top of gross to estimate monthly and annual CTC.",
    mode: "ctcFromGross",
    amountLabel: "Gross salary (monthly)",
    amountDefault: "100000",
    showEmployer: true,
  },
  "annual-salary-calculator": {
    title: "Annual salary calculator",
    description: "Convert an annual package into an equivalent monthly salary.",
    mode: "annualToMonthly",
    amountLabel: "Annual salary",
    amountDefault: "1200000",
  },
  "monthly-salary-calculator": {
    title: "Monthly salary calculator",
    description: "Convert a monthly salary into an annual package.",
    mode: "monthlyToAnnual",
    amountLabel: "Monthly salary",
    amountDefault: "100000",
  },
  "hourly-to-salary-calculator": {
    title: "Hourly to salary calculator",
    description: "Turn an hourly wage into weekly, monthly, and annual pay.",
    mode: "hourlyToSalary",
    amountLabel: "Hourly wage",
    amountDefault: "500",
    showHours: true,
  },
  "salary-to-hourly-calculator": {
    title: "Salary to hourly calculator",
    description: "Convert an annual salary into an equivalent hourly rate.",
    mode: "salaryToHourly",
    amountLabel: "Annual salary",
    amountDefault: "1200000",
    showHours: true,
  },
};

const CURRENCIES: SalaryCurrencyCode[] = ["INR", "USD", "EUR", "GBP"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function CoreSalaryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CoreSalarySlug] ?? CONFIG["salary-calculator-monthly-annual"];
  const [currency, setCurrency] = useState<SalaryCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(SALARY_URL.A, config.amountDefault));
  const [period, setPeriod] = useState<"monthly" | "annual">(
    useLoanInitialInput(SALARY_URL.M, "monthly") === "annual" ? "annual" : "monthly",
  );
  const [taxPct, setTaxPct] = useState(useLoanInitialInput(SALARY_URL.T, "20"));
  const [deductionPct, setDeductionPct] = useState(useLoanInitialInput(SALARY_URL.D, "5"));
  const [employerPct, setEmployerPct] = useState(useLoanInitialInput(SALARY_URL.E, "12"));
  const [hoursPerWeek, setHoursPerWeek] = useState(useLoanInitialInput(SALARY_URL.H, "40"));
  const [weeksPerYear, setWeeksPerYear] = useState(useLoanInitialInput(SALARY_URL.W, "52"));

  const fmt = useCallback((n: number) => formatSalaryMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [SALARY_URL.A]: amount,
      [SALARY_URL.M]: period,
      [SALARY_URL.T]: taxPct,
      [SALARY_URL.D]: deductionPct,
      [SALARY_URL.E]: employerPct,
      [SALARY_URL.H]: hoursPerWeek,
      [SALARY_URL.W]: weeksPerYear,
    }),
    [amount, period, taxPct, deductionPct, employerPct, hoursPerWeek, weeksPerYear],
  );

  useLoanUrlSync(shareParams, [amount, period, taxPct, deductionPct, employerPct, hoursPerWeek, weeksPerYear]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "monthlyAnnual": {
        const monthly = period === "monthly" ? amountParsed.value : monthlyFromAnnual(amountParsed.value);
        const annual = period === "annual" ? amountParsed.value : annualFromMonthly(amountParsed.value);
        return {
          primary: period === "monthly" ? fmt(annual) : fmt(monthly),
          primaryLabel: period === "monthly" ? "Annual salary" : "Monthly salary",
          rows: [
            { label: "Monthly", value: fmt(monthly) },
            { label: "Annual", value: fmt(annual) },
          ],
        };
      }
      case "inHand":
      case "grossBreakdown": {
        const tax = parseAprPercent(taxPct, "Tax");
        const ded = parseAprPercent(deductionPct, "Deductions");
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        const breakdown = netFromGross({
          gross: amountParsed.value,
          taxPercent: tax.value,
          deductionPercent: ded.value,
        });
        return {
          primary: fmt(breakdown.net),
          primaryLabel: config.mode === "inHand" ? "In-hand (net) monthly" : "Net monthly",
          rows: [
            { label: "Gross monthly", value: fmt(breakdown.gross) },
            { label: "Tax", value: fmt(breakdown.taxAmount) },
            { label: "Deductions", value: fmt(breakdown.deductionAmount) },
            { label: "Net monthly", value: fmt(breakdown.net) },
            { label: "Net annual", value: fmt(breakdown.annualNet) },
          ],
        };
      }
      case "netReverse": {
        const tax = parseAprPercent(taxPct, "Tax");
        const ded = parseAprPercent(deductionPct, "Deductions");
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        const grossResult = grossFromNet({
          net: amountParsed.value,
          taxPercent: tax.value,
          deductionPercent: ded.value,
        });
        if ("error" in grossResult) return { error: grossResult.error };
        return {
          primary: fmt(grossResult.gross),
          primaryLabel: "Gross monthly",
          rows: [
            { label: "Net monthly", value: fmt(grossResult.net) },
            { label: "Tax", value: fmt(grossResult.taxAmount) },
            { label: "Deductions", value: fmt(grossResult.deductionAmount) },
            { label: "Gross monthly", value: fmt(grossResult.gross) },
            { label: "Gross annual", value: fmt(annualFromMonthly(grossResult.gross)) },
          ],
        };
      }
      case "ctcFromGross": {
        const emp = parseAprPercent(employerPct, "Employer contribution");
        if (!emp.ok) return { error: emp.error };
        const ctc = ctcFromGross({ gross: amountParsed.value, employerPercent: emp.value });
        return {
          primary: fmt(ctc.ctc),
          primaryLabel: "Monthly CTC",
          rows: [
            { label: "Gross monthly", value: fmt(ctc.gross) },
            { label: "Employer contribution", value: fmt(ctc.employerContribution) },
            { label: "Monthly CTC", value: fmt(ctc.monthlyCtc) },
            { label: "Annual CTC", value: fmt(ctc.annualCtc) },
          ],
        };
      }
      case "annualToMonthly": {
        const monthly = monthlyFromAnnual(amountParsed.value);
        return {
          primary: fmt(monthly),
          primaryLabel: "Monthly salary",
          rows: [
            { label: "Annual", value: fmt(amountParsed.value) },
            { label: "Monthly", value: fmt(monthly) },
          ],
        };
      }
      case "monthlyToAnnual": {
        const annual = annualFromMonthly(amountParsed.value);
        return {
          primary: fmt(annual),
          primaryLabel: "Annual salary",
          rows: [
            { label: "Monthly", value: fmt(amountParsed.value) },
            { label: "Annual", value: fmt(annual) },
          ],
        };
      }
      case "hourlyToSalary": {
        const hours = parsePositive(hoursPerWeek, "Hours per week");
        const weeks = parsePositive(weeksPerYear, "Weeks per year");
        if (!hours.ok) return { error: hours.error };
        if (!weeks.ok) return { error: weeks.error };
        const pay = hourlyToSalary({
          hourly: amountParsed.value,
          hoursPerWeek: hours.value,
          weeksPerYear: weeks.value,
        });
        return {
          primary: fmt(pay.annual),
          primaryLabel: "Annual salary",
          rows: [
            { label: "Hourly", value: fmt(pay.hourly) },
            { label: "Weekly", value: fmt(pay.weekly) },
            { label: "Monthly", value: fmt(pay.monthly) },
            { label: "Annual", value: fmt(pay.annual) },
          ],
        };
      }
      case "salaryToHourly": {
        const hours = parsePositive(hoursPerWeek, "Hours per week");
        const weeks = parsePositive(weeksPerYear, "Weeks per year");
        if (!hours.ok) return { error: hours.error };
        if (!weeks.ok) return { error: weeks.error };
        const rate = salaryToHourly({
          annual: amountParsed.value,
          hoursPerWeek: hours.value,
          weeksPerYear: weeks.value,
        });
        return {
          primary: fmt(rate.hourly),
          primaryLabel: "Hourly rate",
          rows: [
            { label: "Annual salary", value: fmt(amountParsed.value) },
            { label: "Hours per year", value: String(Math.round(rate.hoursPerYear)) },
            { label: "Weekly (at this rate)", value: fmt(rate.weekly) },
            { label: "Hourly rate", value: fmt(rate.hourly) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amount, config, deductionPct, employerPct, fmt, hoursPerWeek, period, taxPct, weeksPerYear]);

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
          onChange={(e) => setCurrency(e.target.value as SalaryCurrencyCode)}
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
        <div className={config.showPeriod ? "sm:col-span-1" : "sm:col-span-2"}>
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
          />
        </div>

        {config.showPeriod ? (
          <div>
            <FieldLabel htmlFor="period">Input is</FieldLabel>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as "monthly" | "annual")}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        ) : null}

        {config.showTax ? (
          <div>
            <FieldLabel htmlFor="tax">Tax %</FieldLabel>
            <FieldInput
              id="tax"
              inputMode="decimal"
              value={taxPct}
              onChange={(e) => setTaxPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showDeduction ? (
          <div>
            <FieldLabel htmlFor="deduction">Other deductions %</FieldLabel>
            <FieldInput
              id="deduction"
              inputMode="decimal"
              value={deductionPct}
              onChange={(e) => setDeductionPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showEmployer ? (
          <div>
            <FieldLabel htmlFor="employer">Employer contribution %</FieldLabel>
            <FieldInput
              id="employer"
              inputMode="decimal"
              value={employerPct}
              onChange={(e) => setEmployerPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showHours ? (
          <>
            <div>
              <FieldLabel htmlFor="hours">Hours per week</FieldLabel>
              <FieldInput
                id="hours"
                inputMode="decimal"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <FieldLabel htmlFor="weeks">Weeks per year</FieldLabel>
              <FieldInput
                id="weeks"
                inputMode="decimal"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                className="mt-2"
              />
            </div>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
