"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BENEFITS_URL,
  DEFAULT_EPF_INTEREST,
  DEFAULT_NPS_RETURN,
  DEFAULT_SUPERANNUATION_RETURN,
  employerPfContribution,
  epfContribution,
  epsPension,
  esicContribution,
  formatBenefitsInr,
  npsProjection,
  providentFund,
  superannuationProjection,
} from "@/lib/calculators/benefitsContributions";

type BenefitsSlug =
  | "pf-provident-fund-calculator"
  | "epf-contribution-calculator"
  | "employer-pf-contribution-calculator"
  | "pension-calculator-eps"
  | "nps-calculator-india"
  | "superannuation-calculator"
  | "esic-calculator";

type BenefitsMode =
  | "providentFund"
  | "epfContribution"
  | "employerPf"
  | "epsPension"
  | "nps"
  | "superannuation"
  | "esic";

type Config = {
  title: string;
  description: string;
  mode: BenefitsMode;
  amountLabel: string;
  amountDefault: string;
  showDa?: boolean;
  showYears?: boolean;
  showInterest?: boolean;
  showEmployeePct?: boolean;
  showEmployerPct?: boolean;
  showReturn?: boolean;
};

const CONFIG: Record<BenefitsSlug, Config> = {
  "pf-provident-fund-calculator": {
    title: "PF (Provident Fund) calculator",
    description:
      "Estimate employee and employer PF contributions and project EPF corpus using statutory wage ceiling rules.",
    mode: "providentFund",
    amountLabel: "Basic salary (monthly)",
    amountDefault: "40000",
    showDa: true,
    showYears: true,
    showInterest: true,
  },
  "epf-contribution-calculator": {
    title: "EPF contribution calculator",
    description: "Calculate monthly employee and employer EPF account contributions (excluding EPS pension allocation).",
    mode: "epfContribution",
    amountLabel: "Basic salary (monthly)",
    amountDefault: "40000",
    showDa: true,
  },
  "employer-pf-contribution-calculator": {
    title: "Employer PF contribution calculator",
    description: "Break down employer PF into EPF and EPS components under EPFO rules.",
    mode: "employerPf",
    amountLabel: "Basic salary (monthly)",
    amountDefault: "40000",
    showDa: true,
  },
  "pension-calculator-eps": {
    title: "Pension calculator (EPS)",
    description: "Estimate monthly EPS pension from pensionable salary and years of eligible service.",
    mode: "epsPension",
    amountLabel: "Pensionable salary (monthly)",
    amountDefault: "15000",
    showYears: true,
  },
  "nps-calculator-india": {
    title: "NPS calculator (India)",
    description: "Project National Pension System corpus from employee and employer contributions on basic salary.",
    mode: "nps",
    amountLabel: "Basic salary (monthly)",
    amountDefault: "50000",
    showEmployeePct: true,
    showEmployerPct: true,
    showYears: true,
    showReturn: true,
  },
  "superannuation-calculator": {
    title: "Superannuation calculator",
    description: "Estimate employer superannuation fund contributions and projected corpus.",
    mode: "superannuation",
    amountLabel: "Basic salary (monthly)",
    amountDefault: "100000",
    showEmployerPct: true,
    showYears: true,
    showReturn: true,
  },
  "esic-calculator": {
    title: "ESIC calculator",
    description: "Calculate employee and employer ESIC contributions when gross salary is within the wage ceiling.",
    mode: "esic",
    amountLabel: "Gross salary (monthly)",
    amountDefault: "18000",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function BenefitsContributionsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BenefitsSlug] ?? CONFIG["pf-provident-fund-calculator"];
  const [basic, setBasic] = useState(useLoanInitialInput(BENEFITS_URL.A, config.amountDefault));
  const [da, setDa] = useState(useLoanInitialInput(BENEFITS_URL.D, "0"));
  const [years, setYears] = useState(useLoanInitialInput(BENEFITS_URL.Y, "20"));
  const [interest, setInterest] = useState(useLoanInitialInput(BENEFITS_URL.R, String(DEFAULT_EPF_INTEREST)));
  const [employeePct, setEmployeePct] = useState(useLoanInitialInput(BENEFITS_URL.E, "10"));
  const [employerPct, setEmployerPct] = useState(useLoanInitialInput(BENEFITS_URL.P, "10"));
  const [returnPct, setReturnPct] = useState(
    useLoanInitialInput(
      BENEFITS_URL.X,
      config.mode === "superannuation" ? String(DEFAULT_SUPERANNUATION_RETURN) : String(DEFAULT_NPS_RETURN),
    ),
  );

  const fmt = useCallback((n: number) => formatBenefitsInr(n), []);

  const shareParams = useCallback(
    () => ({
      [BENEFITS_URL.A]: basic,
      [BENEFITS_URL.D]: da,
      [BENEFITS_URL.Y]: years,
      [BENEFITS_URL.R]: interest,
      [BENEFITS_URL.E]: employeePct,
      [BENEFITS_URL.P]: employerPct,
      [BENEFITS_URL.X]: returnPct,
    }),
    [basic, da, years, interest, employeePct, employerPct, returnPct],
  );

  useLoanUrlSync(shareParams, [basic, da, years, interest, employeePct, employerPct, returnPct]);

  const result = useMemo(() => {
    const basicParsed = parsePositive(basic, config.amountLabel);
    if (!basicParsed.ok) return { error: basicParsed.error };

    switch (config.mode) {
      case "providentFund": {
        const daParsed = parseNonNegative(da, "Dearness allowance");
        const yearsParsed = parsePositive(years, "Years");
        const rateParsed = parseAprPercent(interest, "EPF interest rate");
        if (!daParsed.ok) return { error: daParsed.error };
        if (!yearsParsed.ok) return { error: yearsParsed.error };
        if (!rateParsed.ok) return { error: rateParsed.error };
        const computed = providentFund({
          basic: basicParsed.value,
          da: daParsed.value,
          years: yearsParsed.value,
          interestRate: rateParsed.value,
        });
        return {
          primary: fmt(computed.corpus),
          primaryLabel: `Projected PF corpus (${yearsParsed.value} years)`,
          rows: [
            { label: "PF wages (monthly)", value: fmt(computed.pfWages) },
            { label: "Employee PF (monthly)", value: fmt(computed.employeePf) },
            { label: "Employer PF (monthly)", value: fmt(computed.employerPf) },
            { label: "Total PF (monthly)", value: fmt(computed.totalMonthly) },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Projected corpus", value: fmt(computed.corpus) },
          ],
        };
      }
      case "epfContribution": {
        const daParsed = parseNonNegative(da, "Dearness allowance");
        if (!daParsed.ok) return { error: daParsed.error };
        const computed = epfContribution({ basic: basicParsed.value, da: daParsed.value });
        return {
          primary: fmt(computed.totalEpfMonthly),
          primaryLabel: "Total EPF (monthly)",
          rows: [
            { label: "PF wages (monthly)", value: fmt(computed.pfWages) },
            { label: "Employee EPF", value: fmt(computed.employeeEpf) },
            { label: "Employer EPF", value: fmt(computed.employerEpf) },
            { label: "Total EPF (monthly)", value: fmt(computed.totalEpfMonthly) },
            { label: "Total EPF (annual)", value: fmt(computed.totalEpfAnnual) },
          ],
        };
      }
      case "employerPf": {
        const daParsed = parseNonNegative(da, "Dearness allowance");
        if (!daParsed.ok) return { error: daParsed.error };
        const computed = employerPfContribution({ basic: basicParsed.value, da: daParsed.value });
        return {
          primary: fmt(computed.employerPf),
          primaryLabel: "Employer PF (monthly)",
          rows: [
            { label: "PF wages (monthly)", value: fmt(computed.pfWages) },
            { label: "Employer EPF", value: fmt(computed.employerEpf) },
            { label: "Employer EPS", value: fmt(computed.employerEps) },
            { label: "Employer PF (monthly)", value: fmt(computed.employerPf) },
            { label: "Employer PF (annual)", value: fmt(computed.employerPfAnnual) },
            { label: "EPS share of employer PF", value: `${(computed.epsShareOfEmployer * 100).toFixed(1)}%` },
          ],
        };
      }
      case "epsPension": {
        const yearsParsed = parsePositive(years, "Years of service");
        if (!yearsParsed.ok) return { error: yearsParsed.error };
        const computed = epsPension({
          pensionableSalary: basicParsed.value,
          yearsOfService: yearsParsed.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.monthlyPension),
          primaryLabel: "Monthly EPS pension",
          rows: [
            { label: "Pensionable salary", value: fmt(computed.pensionableSalary) },
            { label: "Years of service", value: String(computed.yearsOfService) },
            { label: "Monthly pension", value: fmt(computed.monthlyPension) },
            { label: "Annual pension", value: fmt(computed.annualPension) },
          ],
        };
      }
      case "nps": {
        const emp = parseAprPercent(employeePct, "Employee NPS %");
        const empr = parseAprPercent(employerPct, "Employer NPS %");
        const yearsParsed = parsePositive(years, "Years");
        const ret = parseAprPercent(returnPct, "Expected return");
        if (!emp.ok) return { error: emp.error };
        if (!empr.ok) return { error: empr.error };
        if (!yearsParsed.ok) return { error: yearsParsed.error };
        if (!ret.ok) return { error: ret.error };
        const computed = npsProjection({
          basic: basicParsed.value,
          employeePercent: emp.value,
          employerPercent: empr.value,
          years: yearsParsed.value,
          expectedReturn: ret.value,
        });
        return {
          primary: fmt(computed.projectedCorpus),
          primaryLabel: `Projected NPS corpus (${yearsParsed.value} years)`,
          rows: [
            { label: "Employee contribution", value: fmt(computed.employeeMonthly) },
            { label: "Employer contribution", value: fmt(computed.employerMonthly) },
            { label: "Total monthly", value: fmt(computed.totalMonthly) },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Projected corpus", value: fmt(computed.projectedCorpus) },
          ],
        };
      }
      case "superannuation": {
        const emp = parseAprPercent(employerPct, "Employer superannuation %");
        const yearsParsed = parsePositive(years, "Years");
        const ret = parseAprPercent(returnPct, "Expected return");
        if (!emp.ok) return { error: emp.error };
        if (!yearsParsed.ok) return { error: yearsParsed.error };
        if (!ret.ok) return { error: ret.error };
        const computed = superannuationProjection({
          basic: basicParsed.value,
          employerPercent: emp.value,
          years: yearsParsed.value,
          expectedReturn: ret.value,
        });
        return {
          primary: fmt(computed.projectedCorpus),
          primaryLabel: `Projected superannuation corpus (${yearsParsed.value} years)`,
          rows: [
            { label: "Employer contribution (monthly)", value: fmt(computed.employerMonthly) },
            { label: "Employer contribution (annual)", value: fmt(computed.employerAnnual) },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Projected corpus", value: fmt(computed.projectedCorpus) },
          ],
        };
      }
      case "esic": {
        const computed = esicContribution({ grossMonthly: basicParsed.value });
        if (!computed.applicable) {
          return {
            primary: "Not applicable",
            primaryLabel: "ESIC status",
            rows: [
              { label: "Gross salary (monthly)", value: fmt(computed.grossMonthly) },
              { label: "ESIC wage ceiling", value: fmt(21000) },
              { label: "Note", value: "ESIC applies when gross ≤ ₹21,000/month" },
            ],
          };
        }
        return {
          primary: fmt(computed.totalEsic),
          primaryLabel: "Total ESIC (monthly)",
          rows: [
            { label: "Gross salary (monthly)", value: fmt(computed.grossMonthly) },
            { label: "Employee ESIC (0.75%)", value: fmt(computed.employeeEsic) },
            { label: "Employer ESIC (3.25%)", value: fmt(computed.employerEsic) },
            { label: "Total ESIC (monthly)", value: fmt(computed.totalEsic) },
            { label: "Total ESIC (annual)", value: fmt(computed.annualTotal) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [basic, config, da, employeePct, employerPct, fmt, interest, returnPct, years]);

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
        <div className={config.showDa || config.showYears ? "sm:col-span-1" : "sm:col-span-2"}>
          <FieldLabel htmlFor="basic">{config.amountLabel}</FieldLabel>
          <FieldInput
            id="basic"
            inputMode="decimal"
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            className="mt-2"
          />
        </div>

        {config.showDa ? (
          <div>
            <FieldLabel htmlFor="da">Dearness allowance (monthly)</FieldLabel>
            <FieldInput
              id="da"
              inputMode="decimal"
              value={da}
              onChange={(e) => setDa(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showYears ? (
          <div>
            <FieldLabel htmlFor="years">{config.mode === "epsPension" ? "Years of eligible service" : "Years"}</FieldLabel>
            <FieldInput
              id="years"
              inputMode="decimal"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showInterest ? (
          <div>
            <FieldLabel htmlFor="interest">EPF interest rate % (annual)</FieldLabel>
            <FieldInput
              id="interest"
              inputMode="decimal"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showEmployeePct ? (
          <div>
            <FieldLabel htmlFor="employeePct">Employee NPS % of basic</FieldLabel>
            <FieldInput
              id="employeePct"
              inputMode="decimal"
              value={employeePct}
              onChange={(e) => setEmployeePct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showEmployerPct ? (
          <div>
            <FieldLabel htmlFor="employerPct">
              {config.mode === "superannuation" ? "Employer superannuation % of basic" : "Employer NPS % of basic"}
            </FieldLabel>
            <FieldInput
              id="employerPct"
              inputMode="decimal"
              value={employerPct}
              onChange={(e) => setEmployerPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showReturn ? (
          <div>
            <FieldLabel htmlFor="returnPct">Expected annual return %</FieldLabel>
            <FieldInput
              id="returnPct"
              inputMode="decimal"
              value={returnPct}
              onChange={(e) => setReturnPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
