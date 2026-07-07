"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import type { HrEmployerCurrencyCode } from "@/lib/calculators/hrEmployerTools";
import {
  DEFAULT_BASIC_PERCENT,
  DEFAULT_EMPLOYER_CONTRIB_PERCENT,
  DEFAULT_HRA_PERCENT_OF_BASIC,
  HR_EMPLOYER_URL,
  compensationPlanning,
  costToHire,
  employeeCost,
  formatHrEmployerMoney,
  payrollCalc,
  salaryBenchmark,
  salaryStructure,
} from "@/lib/calculators/hrEmployerTools";

type HrSlug =
  | "payroll-calculator"
  | "employee-cost-calculator"
  | "salary-structure-builder"
  | "compensation-planning-calculator"
  | "salary-benchmark-calculator"
  | "cost-to-hire-calculator";

type HrMode =
  | "payroll"
  | "employeeCost"
  | "salaryStructure"
  | "compensationPlanning"
  | "salaryBenchmark"
  | "costToHire";

type Config = {
  title: string;
  description: string;
  mode: HrMode;
  amountLabel: string;
  amountDefault: string;
  showTax?: boolean;
  showBenefits?: boolean;
  showOverhead?: boolean;
  showStructure?: boolean;
  showHeadcount?: boolean;
  showBenchmark?: boolean;
  showHiring?: boolean;
  secondaryLabel?: string;
  secondaryDefault?: string;
};

const CONFIG: Record<HrSlug, Config> = {
  "payroll-calculator": {
    title: "Payroll calculator",
    description: "Estimate employee net pay and total employer payroll cost from gross salary and deduction rates.",
    mode: "payroll",
    amountLabel: "Gross monthly salary",
    amountDefault: "100000",
    showTax: true,
    showBenefits: true,
  },
  "employee-cost-calculator": {
    title: "Employee cost calculator",
    description: "Calculate the true monthly and annual cost of an employee including benefits and overhead.",
    mode: "employeeCost",
    amountLabel: "Gross monthly salary",
    amountDefault: "100000",
    showBenefits: true,
    showOverhead: true,
  },
  "salary-structure-builder": {
    title: "Salary structure builder",
    description: "Split monthly CTC into basic, HRA, special allowance, and employer contribution components.",
    mode: "salaryStructure",
    amountLabel: "Monthly CTC",
    amountDefault: "100000",
    showStructure: true,
  },
  "compensation-planning-calculator": {
    title: "Compensation planning calculator",
    description: "Plan total team compensation budget from headcount, average salary, and employer benefit load.",
    mode: "compensationPlanning",
    amountLabel: "Average gross monthly salary",
    amountDefault: "80000",
    showHeadcount: true,
    showBenefits: true,
  },
  "salary-benchmark-calculator": {
    title: "Salary benchmark calculator",
    description: "Compare a job offer to market median salary and see the percentage difference.",
    mode: "salaryBenchmark",
    amountLabel: "Offer (annual)",
    amountDefault: "1200000",
    showBenchmark: true,
    secondaryLabel: "Market median (annual)",
    secondaryDefault: "1000000",
  },
  "cost-to-hire-calculator": {
    title: "Cost to hire calculator",
    description: "Estimate total hiring cost including recruiter fees, signing bonus, onboarding, and vacancy time.",
    mode: "costToHire",
    amountLabel: "Annual salary offered",
    amountDefault: "1200000",
    showHiring: true,
  },
};

const CURRENCIES: HrEmployerCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function HrEmployerToolsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as HrSlug] ?? CONFIG["payroll-calculator"];
  const [currency, setCurrency] = useState<HrEmployerCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(HR_EMPLOYER_URL.A, config.amountDefault));
  const [secondary, setSecondary] = useState(
    useLoanInitialInput(HR_EMPLOYER_URL.B, config.secondaryDefault ?? "1000000"),
  );
  const [taxPct, setTaxPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.T, "20"));
  const [deductionPct, setDeductionPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.D, "5"));
  const [benefitPct, setBenefitPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.E, "12"));
  const [overheadPct, setOverheadPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.X, "10"));
  const [basicPct, setBasicPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.P, String(DEFAULT_BASIC_PERCENT)));
  const [hraPct, setHraPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.H, String(DEFAULT_HRA_PERCENT_OF_BASIC)));
  const [employerContribPct, setEmployerContribPct] = useState(
    useLoanInitialInput(HR_EMPLOYER_URL.C, String(DEFAULT_EMPLOYER_CONTRIB_PERCENT)),
  );
  const [headcount, setHeadcount] = useState(useLoanInitialInput(HR_EMPLOYER_URL.N, "10"));
  const [recruiterPct, setRecruiterPct] = useState(useLoanInitialInput(HR_EMPLOYER_URL.R, "15"));
  const [signingBonus, setSigningBonus] = useState(useLoanInitialInput(HR_EMPLOYER_URL.Y, "50000"));
  const [onboardingCost, setOnboardingCost] = useState(useLoanInitialInput(HR_EMPLOYER_URL.O, "25000"));
  const [vacancyDays, setVacancyDays] = useState(useLoanInitialInput(HR_EMPLOYER_URL.V, "30"));

  const fmt = useCallback((n: number) => formatHrEmployerMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [HR_EMPLOYER_URL.A]: amount,
      [HR_EMPLOYER_URL.B]: secondary,
      [HR_EMPLOYER_URL.T]: taxPct,
      [HR_EMPLOYER_URL.D]: deductionPct,
      [HR_EMPLOYER_URL.E]: benefitPct,
      [HR_EMPLOYER_URL.X]: overheadPct,
      [HR_EMPLOYER_URL.P]: basicPct,
      [HR_EMPLOYER_URL.H]: hraPct,
      [HR_EMPLOYER_URL.C]: employerContribPct,
      [HR_EMPLOYER_URL.N]: headcount,
      [HR_EMPLOYER_URL.R]: recruiterPct,
      [HR_EMPLOYER_URL.Y]: signingBonus,
      [HR_EMPLOYER_URL.O]: onboardingCost,
      [HR_EMPLOYER_URL.V]: vacancyDays,
    }),
    [amount, secondary, taxPct, deductionPct, benefitPct, overheadPct, basicPct, hraPct, employerContribPct, headcount, recruiterPct, signingBonus, onboardingCost, vacancyDays],
  );

  useLoanUrlSync(shareParams, [
    amount,
    secondary,
    taxPct,
    deductionPct,
    benefitPct,
    overheadPct,
    basicPct,
    hraPct,
    employerContribPct,
    headcount,
    recruiterPct,
    signingBonus,
    onboardingCost,
    vacancyDays,
  ]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "payroll": {
        const tax = parseAprPercent(taxPct, "Tax %");
        const ded = parseAprPercent(deductionPct, "Other deductions %");
        const ben = parseAprPercent(benefitPct, "Employer benefits %");
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        if (!ben.ok) return { error: ben.error };
        const computed = payrollCalc({
          grossMonthly: amountParsed.value,
          taxPercent: tax.value,
          deductionPercent: ded.value,
          employerBenefitPercent: ben.value,
        });
        return {
          primary: fmt(computed.netMonthly),
          primaryLabel: "Net monthly pay",
          rows: [
            { label: "Gross monthly", value: fmt(computed.grossMonthly) },
            { label: "Income tax", value: fmt(computed.taxAmount) },
            { label: "Other deductions", value: fmt(computed.deductionAmount) },
            { label: "Net monthly", value: fmt(computed.netMonthly) },
            { label: "Net annual", value: fmt(computed.netAnnual) },
            { label: "Employer contribution", value: fmt(computed.employerContribution) },
            { label: "Total employer cost/month", value: fmt(computed.totalEmployerCostMonthly) },
            { label: "Total employer cost/year", value: fmt(computed.totalEmployerCostAnnual) },
          ],
        };
      }
      case "employeeCost": {
        const ben = parseAprPercent(benefitPct, "Employer benefits %");
        const oh = parseAprPercent(overheadPct, "Overhead %");
        if (!ben.ok) return { error: ben.error };
        if (!oh.ok) return { error: oh.error };
        const computed = employeeCost({
          grossMonthly: amountParsed.value,
          employerBenefitPercent: ben.value,
          overheadPercent: oh.value,
        });
        return {
          primary: fmt(computed.totalMonthly),
          primaryLabel: "Total monthly employee cost",
          rows: [
            { label: "Gross salary", value: fmt(computed.grossMonthly) },
            { label: "Employer benefits", value: fmt(computed.employerBenefits) },
            { label: "Overhead", value: fmt(computed.overhead) },
            { label: "Total monthly cost", value: fmt(computed.totalMonthly) },
            { label: "Total annual cost", value: fmt(computed.totalAnnual) },
          ],
        };
      }
      case "salaryStructure": {
        const basic = parseAprPercent(basicPct, "Basic % of CTC");
        const hra = parseAprPercent(hraPct, "HRA % of basic");
        const emp = parseAprPercent(employerContribPct, "Employer contribution % of basic");
        if (!basic.ok) return { error: basic.error };
        if (!hra.ok) return { error: hra.error };
        if (!emp.ok) return { error: emp.error };
        const computed = salaryStructure({
          monthlyCtc: amountParsed.value,
          basicPercent: basic.value,
          hraPercentOfBasic: hra.value,
          employerContribPercent: emp.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.grossMonthly),
          primaryLabel: "Gross monthly (cash)",
          rows: [
            { label: "Monthly CTC", value: fmt(computed.monthlyCtc) },
            { label: "Basic", value: fmt(computed.basic) },
            { label: "HRA", value: fmt(computed.hra) },
            { label: "Special allowance", value: fmt(computed.specialAllowance) },
            { label: "Employer contribution", value: fmt(computed.employerContribution) },
            { label: "Gross monthly", value: fmt(computed.grossMonthly) },
            { label: "Annual CTC", value: fmt(computed.annualCtc) },
          ],
        };
      }
      case "compensationPlanning": {
        const hc = parsePositive(headcount, "Headcount");
        const ben = parseAprPercent(benefitPct, "Employer benefits %");
        if (!hc.ok) return { error: hc.error };
        if (!ben.ok) return { error: ben.error };
        const computed = compensationPlanning({
          headcount: hc.value,
          avgGrossMonthly: amountParsed.value,
          employerBenefitPercent: ben.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalAnnualWithBenefits),
          primaryLabel: "Total annual compensation budget",
          rows: [
            { label: "Headcount", value: String(computed.headcount) },
            { label: "Avg gross monthly", value: fmt(computed.avgGrossMonthly) },
            { label: "Monthly payroll (gross)", value: fmt(computed.totalMonthlyPayroll) },
            { label: "Annual payroll (gross)", value: fmt(computed.totalAnnualPayroll) },
            { label: "Per employee annual (incl. benefits)", value: fmt(computed.perEmployeeAnnual) },
            { label: "Total annual budget", value: fmt(computed.totalAnnualWithBenefits) },
          ],
        };
      }
      case "salaryBenchmark": {
        const market = parsePositive(secondary, config.secondaryLabel ?? "Market median");
        if (!market.ok) return { error: market.error };
        const computed = salaryBenchmark({
          offerAnnual: amountParsed.value,
          marketMedianAnnual: market.value,
        });
        if ("error" in computed) return { error: computed.error };
        const positionLabel =
          computed.position === "above"
            ? "Above market"
            : computed.position === "below"
              ? "Below market"
              : "At market";
        return {
          primary: `${computed.differencePercent >= 0 ? "+" : ""}${computed.differencePercent.toFixed(1)}%`,
          primaryLabel: positionLabel,
          rows: [
            { label: "Offer (annual)", value: fmt(computed.offerAnnual) },
            { label: "Market median", value: fmt(computed.marketMedianAnnual) },
            { label: "Difference", value: fmt(computed.difference) },
            { label: "Difference %", value: `${computed.differencePercent >= 0 ? "+" : ""}${computed.differencePercent.toFixed(1)}%` },
          ],
        };
      }
      case "costToHire": {
        const rec = parseAprPercent(recruiterPct, "Recruiter fee %");
        const bonus = parsePositive(signingBonus, "Signing bonus");
        const onboard = parsePositive(onboardingCost, "Onboarding cost");
        const vacant = parsePositive(vacancyDays, "Vacancy days");
        if (!rec.ok) return { error: rec.error };
        if (!bonus.ok) return { error: bonus.error };
        if (!onboard.ok) return { error: onboard.error };
        if (!vacant.ok) return { error: vacant.error };
        const computed = costToHire({
          annualSalary: amountParsed.value,
          recruiterFeePercent: rec.value,
          signingBonus: bonus.value,
          onboardingCost: onboard.value,
          vacancyDays: vacant.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalCost),
          primaryLabel: "Total cost to hire",
          rows: [
            { label: "Annual salary", value: fmt(computed.annualSalary) },
            { label: "Recruiter fee", value: fmt(computed.recruiterFee) },
            { label: "Signing bonus", value: fmt(computed.signingBonus) },
            { label: "Onboarding", value: fmt(computed.onboardingCost) },
            { label: "Vacancy cost", value: fmt(computed.vacancyCost) },
            { label: "Total cost", value: fmt(computed.totalCost) },
            { label: "As % of salary", value: `${computed.costAsPercentOfSalary.toFixed(1)}%` },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    amount,
    basicPct,
    benefitPct,
    config,
    deductionPct,
    employerContribPct,
    fmt,
    headcount,
    hraPct,
    onboardingCost,
    overheadPct,
    recruiterPct,
    secondary,
    signingBonus,
    taxPct,
    vacancyDays,
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
          onChange={(e) => setCurrency(e.target.value as HrEmployerCurrencyCode)}
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

        {config.showBenchmark ? (
          <div>
            <FieldLabel htmlFor="secondary">{config.secondaryLabel}</FieldLabel>
            <FieldInput id="secondary" inputMode="decimal" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showHeadcount ? (
          <div>
            <FieldLabel htmlFor="headcount">Headcount</FieldLabel>
            <FieldInput id="headcount" inputMode="decimal" value={headcount} onChange={(e) => setHeadcount(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showTax ? (
          <>
            <div>
              <FieldLabel htmlFor="tax">Income tax %</FieldLabel>
              <FieldInput id="tax" inputMode="decimal" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="deduction">Other deductions %</FieldLabel>
              <FieldInput id="deduction" inputMode="decimal" value={deductionPct} onChange={(e) => setDeductionPct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showBenefits ? (
          <div>
            <FieldLabel htmlFor="benefits">Employer benefits %</FieldLabel>
            <FieldInput id="benefits" inputMode="decimal" value={benefitPct} onChange={(e) => setBenefitPct(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showOverhead ? (
          <div>
            <FieldLabel htmlFor="overhead">Overhead % (office, equipment)</FieldLabel>
            <FieldInput id="overhead" inputMode="decimal" value={overheadPct} onChange={(e) => setOverheadPct(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showStructure ? (
          <>
            <div>
              <FieldLabel htmlFor="basic">Basic % of CTC</FieldLabel>
              <FieldInput id="basic" inputMode="decimal" value={basicPct} onChange={(e) => setBasicPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="hra">HRA % of basic</FieldLabel>
              <FieldInput id="hra" inputMode="decimal" value={hraPct} onChange={(e) => setHraPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="employerContrib">Employer contribution % of basic</FieldLabel>
              <FieldInput id="employerContrib" inputMode="decimal" value={employerContribPct} onChange={(e) => setEmployerContribPct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showHiring ? (
          <>
            <div>
              <FieldLabel htmlFor="recruiter">Recruiter fee % of salary</FieldLabel>
              <FieldInput id="recruiter" inputMode="decimal" value={recruiterPct} onChange={(e) => setRecruiterPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="bonus">Signing bonus</FieldLabel>
              <FieldInput id="bonus" inputMode="decimal" value={signingBonus} onChange={(e) => setSigningBonus(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="onboard">Onboarding cost</FieldLabel>
              <FieldInput id="onboard" inputMode="decimal" value={onboardingCost} onChange={(e) => setOnboardingCost(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="vacancy">Vacancy days</FieldLabel>
              <FieldInput id="vacancy" inputMode="decimal" value={vacancyDays} onChange={(e) => setVacancyDays(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
