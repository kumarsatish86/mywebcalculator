"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import type { IntlCountry } from "@/lib/calculators/internationalSalary";
import {
  COUNTRY_PROFILES,
  INTL_COUNTRY_OPTIONS,
  INTL_SALARY_URL,
  costOfLivingAdjustedSalary,
  countryFromSlug,
  countrySalary,
  formatIntlMoney,
  monthlyFromAnnual,
  salaryAfterTaxCountry,
} from "@/lib/calculators/internationalSalary";

type IntlSlug =
  | "salary-calculator-usa"
  | "salary-calculator-uk"
  | "salary-calculator-canada"
  | "salary-calculator-australia"
  | "salary-calculator-uae"
  | "salary-after-tax-country-wise"
  | "cost-of-living-adjusted-salary-calculator";

type IntlMode = "countrySalary" | "afterTaxCountry" | "colAdjusted";

type Config = {
  title: string;
  description: string;
  mode: IntlMode;
  country?: IntlCountry;
  amountLabel: string;
  amountDefault: string;
  showCountrySelect?: boolean;
  showTax?: boolean;
  showDeduction?: boolean;
  showPeriod?: boolean;
  showColFrom?: boolean;
  showColTo?: boolean;
};

function configForSlug(slug: IntlSlug): Config {
  const country = countryFromSlug(slug);
  if (country) {
    const profile = COUNTRY_PROFILES[country];
    return {
      title: `Salary calculator (${profile.label})`,
      description: `Estimate gross-to-net salary in ${profile.label} using planning tax and deduction rates. Adjust inputs to match your situation.`,
      mode: "countrySalary",
      country,
      amountLabel: "Gross salary (monthly)",
      amountDefault: country === "uae" ? "25000" : country === "usa" ? "8000" : "5000",
      showTax: true,
      showDeduction: true,
      showPeriod: true,
    };
  }
  if (slug === "salary-after-tax-country-wise") {
    return {
      title: "Salary after tax (country-wise)",
      description: "Compare take-home pay across countries using default planning tax and deduction rates.",
      mode: "afterTaxCountry",
      amountLabel: "Gross salary (monthly)",
      amountDefault: "6000",
      showCountrySelect: true,
      showTax: true,
      showDeduction: true,
      showPeriod: true,
    };
  }
  return {
    title: "Cost of living adjusted salary calculator",
    description: "Convert a salary to an equivalent amount in another location using cost-of-living indices.",
    mode: "colAdjusted",
    amountLabel: "Current salary",
    amountDefault: "100000",
    showColFrom: true,
    showColTo: true,
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function InternationalSalaryCalculatorHost({ slug }: { slug: string }) {
  const config = configForSlug(slug as IntlSlug);
  const defaultCountry = config.country ?? "usa";
  const defaultProfile = COUNTRY_PROFILES[defaultCountry];

  const [country, setCountry] = useState<IntlCountry>(
    (useLoanInitialInput(INTL_SALARY_URL.MD, defaultCountry) as IntlCountry) || defaultCountry,
  );
  const [amount, setAmount] = useState(useLoanInitialInput(INTL_SALARY_URL.A, config.amountDefault));
  const [period, setPeriod] = useState<"monthly" | "annual">(
    useLoanInitialInput(INTL_SALARY_URL.M, "monthly") === "annual" ? "annual" : "monthly",
  );
  const [taxPct, setTaxPct] = useState(
    useLoanInitialInput(INTL_SALARY_URL.T, String(defaultProfile.defaultTaxPercent)),
  );
  const [deductionPct, setDeductionPct] = useState(
    useLoanInitialInput(INTL_SALARY_URL.D, String(defaultProfile.defaultDeductionPercent)),
  );
  const [colFrom, setColFrom] = useState(useLoanInitialInput(INTL_SALARY_URL.P, "100"));
  const [colTo, setColTo] = useState(useLoanInitialInput(INTL_SALARY_URL.C, "80"));

  const activeCountry = config.country ?? country;
  const activeProfile = COUNTRY_PROFILES[activeCountry];
  const fmt = useCallback((n: number) => formatIntlMoney(n, activeProfile.currency), [activeProfile.currency]);

  const shareParams = useCallback(
    () => ({
      [INTL_SALARY_URL.A]: amount,
      [INTL_SALARY_URL.M]: period,
      [INTL_SALARY_URL.T]: taxPct,
      [INTL_SALARY_URL.D]: deductionPct,
      [INTL_SALARY_URL.MD]: activeCountry,
      [INTL_SALARY_URL.P]: colFrom,
      [INTL_SALARY_URL.C]: colTo,
    }),
    [amount, period, taxPct, deductionPct, activeCountry, colFrom, colTo],
  );

  useLoanUrlSync(shareParams, [amount, period, taxPct, deductionPct, country, colFrom, colTo]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "countrySalary":
      case "afterTaxCountry": {
        const tax = parseAprPercent(taxPct, "Tax");
        const ded = parseAprPercent(deductionPct, "Deductions");
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        const grossMonthly =
          period === "monthly" ? amountParsed.value : monthlyFromAnnual(amountParsed.value);
        const computed =
          config.mode === "afterTaxCountry"
            ? salaryAfterTaxCountry({
                grossMonthly,
                country: activeCountry,
                taxPercent: tax.value,
                deductionPercent: ded.value,
              })
            : countrySalary({
                grossMonthly,
                country: activeCountry,
                taxPercent: tax.value,
                deductionPercent: ded.value,
              });
        return {
          primary: fmt(computed.netMonthly),
          primaryLabel: `Net monthly (${activeProfile.label})`,
          rows: [
            { label: "Country", value: activeProfile.label },
            { label: "Gross monthly", value: fmt(computed.grossMonthly) },
            { label: "Gross annual", value: fmt(computed.grossAnnual) },
            { label: "Tax", value: fmt(computed.taxAmount) },
            { label: "Deductions", value: fmt(computed.deductionAmount) },
            { label: "Net monthly", value: fmt(computed.netMonthly) },
            { label: "Net annual", value: fmt(computed.netAnnual) },
          ],
        };
      }
      case "colAdjusted": {
        const from = parsePositive(colFrom, "From COL index");
        const to = parsePositive(colTo, "To COL index");
        if (!from.ok) return { error: from.error };
        if (!to.ok) return { error: to.error };
        const computed = costOfLivingAdjustedSalary({
          salary: amountParsed.value,
          fromColIndex: from.value,
          toColIndex: to.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.adjustedSalary),
          primaryLabel: "Equivalent salary",
          rows: [
            { label: "Current salary", value: fmt(computed.salary) },
            { label: "From COL index", value: String(computed.fromColIndex) },
            { label: "To COL index", value: String(computed.toColIndex) },
            { label: "Equivalent salary", value: fmt(computed.adjustedSalary) },
            { label: "Difference", value: fmt(computed.difference) },
            { label: "Change", value: `${computed.percentChange.toFixed(1)}%` },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [activeCountry, activeProfile.label, amount, config, deductionPct, fmt, colFrom, colTo, period, taxPct]);

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
      <div className="grid gap-4 sm:grid-cols-2">
        {config.showCountrySelect ? (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                const next = e.target.value as IntlCountry;
                setCountry(next);
                const profile = COUNTRY_PROFILES[next];
                setTaxPct(String(profile.defaultTaxPercent));
                setDeductionPct(String(profile.defaultDeductionPercent));
              }}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
            >
              {INTL_COUNTRY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className={config.showPeriod || config.showTax ? "sm:col-span-1" : "sm:col-span-2"}>
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
            <FieldLabel htmlFor="tax">Tax % (planning)</FieldLabel>
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

        {config.showColFrom ? (
          <div>
            <FieldLabel htmlFor="colFrom">From COL index</FieldLabel>
            <FieldInput
              id="colFrom"
              inputMode="decimal"
              value={colFrom}
              onChange={(e) => setColFrom(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showColTo ? (
          <div>
            <FieldLabel htmlFor="colTo">To COL index</FieldLabel>
            <FieldInput
              id="colTo"
              inputMode="decimal"
              value={colTo}
              onChange={(e) => setColTo(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>

      {config.mode === "colAdjusted" ? (
        <p className="mt-4 text-xs text-[var(--muted)]">
          Example indices: NYC 100, London 95, Toronto 90, Sydney 88, Dubai 75. Use comparable indices from
          your preferred COL source.
        </p>
      ) : (
        <p className="mt-4 text-xs text-[var(--muted)]">
          Planning rates only—not a full payroll or tax filing estimate. Adjust tax and deduction % to match
          your payslip or advisor.
        </p>
      )}
    </CalculatorShell>
  );
}
