"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import {
  adviseSmartLoan,
  assessLoanRisk,
  generateEmiPlans,
  optimizeLoanScenarios,
  pickBestEmiPlan,
  shouldTakeLoan,
} from "@/lib/calculators/loanAdvisory";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { parseAprPercent, parseNonNegative, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { monthlyLoanPayment } from "@/lib/calculators/loanPayment";

type SmartAiLoanSlug =
  | "smart-loan-advisor-ai-based"
  | "best-emi-plan-generator"
  | "loan-optimization-calculator"
  | "should-i-take-loan-calculator"
  | "loan-risk-calculator";

type FieldConfig = {
  income?: boolean;
  existingDebt?: boolean;
  principal?: boolean;
  apr?: boolean;
  term?: boolean;
  maxEmi?: boolean;
  prepayAmount?: boolean;
  prepayMonth?: boolean;
  altTerm?: boolean;
  altRate?: boolean;
  altReturn?: boolean;
  emergencyMonths?: boolean;
};

type ScenarioConfig = {
  title: string;
  description: string;
  fields: FieldConfig;
  incomeDefault?: string;
  debtDefault?: string;
  principalDefault?: string;
  aprDefault?: string;
  termDefault?: string;
  maxEmiDefault?: string;
  prepayDefault?: string;
  prepayMonthDefault?: string;
  altTermDefault?: string;
  altRateDefault?: string;
  altReturnDefault?: string;
  emergencyDefault?: string;
};

const CONFIG: Record<SmartAiLoanSlug, ScenarioConfig> = {
  "smart-loan-advisor-ai-based": {
    title: "Smart loan advisor",
    description:
      "Rule-based affordability check using income, existing debt, and proposed loan terms. Not a live AI service — runs entirely in your browser.",
    fields: { income: true, existingDebt: true, principal: true, apr: true, term: true },
    incomeDefault: "100000",
    debtDefault: "15000",
    principalDefault: "2500000",
    aprDefault: "8.5",
    termDefault: "20",
  },
  "best-emi-plan-generator": {
    title: "Best EMI plan generator",
    description: "Compare standard tenures and highlight the plan with lowest total interest that fits your EMI budget.",
    fields: { principal: true, apr: true, maxEmi: true },
    principalDefault: "2500000",
    aprDefault: "8.5",
    maxEmiDefault: "25000",
  },
  "loan-optimization-calculator": {
    title: "Loan optimization calculator",
    description: "Compare base repayment against prepayment, shorter tenure, or a lower rate to see which saves the most interest.",
    fields: { principal: true, apr: true, term: true, existingDebt: true, prepayMonth: true, altTerm: true, altRate: true },
    principalDefault: "25000",
    aprDefault: "6.5",
    termDefault: "5",
    prepayDefault: "2500",
    prepayMonthDefault: "12",
    altTermDefault: "4",
    altRateDefault: "5.5",
  },
  "should-i-take-loan-calculator": {
    title: "Should I take loan? calculator",
    description: "Weigh affordability (DTI) against the loan's interest cost and an optional alternative return on the borrowed amount.",
    fields: { income: true, existingDebt: true, principal: true, apr: true, term: true, altReturn: true },
    incomeDefault: "80000",
    debtDefault: "10000",
    principalDefault: "500000",
    aprDefault: "12",
    termDefault: "5",
    altReturnDefault: "7",
  },
  "loan-risk-calculator": {
    title: "Loan risk calculator",
    description: "Estimate repayment risk from DTI, EMI load, rate, tenure, and emergency-fund buffer.",
    fields: { income: true, existingDebt: true, principal: true, apr: true, term: true, emergencyMonths: true },
    incomeDefault: "80000",
    debtDefault: "10000",
    principalDefault: "500000",
    aprDefault: "12",
    termDefault: "5",
    emergencyDefault: "3",
  },
};

export function SmartAiLoanCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as SmartAiLoanSlug] ?? CONFIG["smart-loan-advisor-ai-based"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [income, setIncome] = useState(useLoanInitialInput(LOAN_URL.E, config.incomeDefault ?? "0"));
  const [existingDebt, setExistingDebt] = useState(useLoanInitialInput(LOAN_URL.X, config.debtDefault ?? config.prepayDefault ?? "0"));
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, config.principalDefault ?? "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, config.aprDefault ?? "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, config.termDefault ?? "5"));
  const [maxEmi, setMaxEmi] = useState(useLoanInitialInput(LOAN_URL.U, config.maxEmiDefault ?? config.prepayMonthDefault ?? config.emergencyDefault ?? "0"));
  const [altTerm, setAltTerm] = useState(useLoanInitialInput(LOAN_URL.R, config.altTermDefault ?? config.altReturnDefault ?? "4"));
  const [altRate, setAltRate] = useState(useLoanInitialInput(LOAN_URL.F, config.altRateDefault ?? "5.5"));

  const shareParams = useCallback(() => {
    const slugKey = slug as SmartAiLoanSlug;
    if (slugKey === "best-emi-plan-generator") {
      return { [LOAN_URL.P]: principal, [LOAN_URL.A]: apr, [LOAN_URL.U]: maxEmi };
    }
    if (slugKey === "loan-optimization-calculator") {
      return {
        [LOAN_URL.P]: principal,
        [LOAN_URL.A]: apr,
        [LOAN_URL.T]: termRaw,
        [LOAN_URL.X]: existingDebt,
        [LOAN_URL.U]: maxEmi,
        [LOAN_URL.R]: altTerm,
        [LOAN_URL.F]: altRate,
      };
    }
    if (slugKey === "should-i-take-loan-calculator") {
      return {
        [LOAN_URL.E]: income,
        [LOAN_URL.X]: existingDebt,
        [LOAN_URL.P]: principal,
        [LOAN_URL.A]: apr,
        [LOAN_URL.T]: termRaw,
        [LOAN_URL.R]: altTerm,
      };
    }
    if (slugKey === "loan-risk-calculator") {
      return {
        [LOAN_URL.E]: income,
        [LOAN_URL.X]: existingDebt,
        [LOAN_URL.P]: principal,
        [LOAN_URL.A]: apr,
        [LOAN_URL.T]: termRaw,
        [LOAN_URL.U]: maxEmi,
      };
    }
    return {
      [LOAN_URL.E]: income,
      [LOAN_URL.X]: existingDebt,
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
    };
  }, [slug, income, existingDebt, principal, apr, termRaw, maxEmi, altTerm, altRate]);
  useLoanUrlSync(shareParams, [income, existingDebt, principal, apr, termRaw, maxEmi, altTerm, altRate, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const slugKey = slug as SmartAiLoanSlug;

    if (slugKey === "best-emi-plan-generator") {
      const p0 = parsePositive(principal, "Loan amount");
      const a0 = parseAprPercent(apr, "APR");
      const max = maxEmi.trim() === "" ? undefined : parsePositive(maxEmi, "Max affordable EMI");
      if (!p0.ok) return { err: p0.error };
      if (!a0.ok) return { err: a0.error };
      if (max && !max.ok) return { err: max.error };
      const plans = generateEmiPlans({
        principal: p0.value,
        apr: a0.value,
        maxAffordableEmi: max?.value,
      });
      if ("error" in plans) return { err: plans.error };
      const best = pickBestEmiPlan(plans, max?.value);
      if (!best) return { err: "No EMI plan could be selected." };
      const rows: [string, string][] = plans.map((p) => [
        `${p.termYears} years`,
        `${formatLoanMoney(p.emi, currency)} EMI · ${formatLoanMoney(p.totalInterest, currency)} interest${p.fitsBudget ? "" : " · over budget"}`,
      ]);
      return {
        err: null,
        result: {
          headline: `${best.termYears} years`,
          headlineLabel: "Recommended tenure",
          rows: [
            ["Recommended EMI", formatLoanMoney(best.emi, currency)],
            ["Total interest", formatLoanMoney(best.totalInterest, currency)],
            ...rows.slice(0, 6),
          ],
        },
      };
    }

    const p0 = parsePositive(principal, "Loan amount");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    if (slugKey === "smart-loan-advisor-ai-based") {
      const inc = parsePositive(income, "Gross monthly income");
      const debt = parseNonNegative(existingDebt, "Existing monthly debt");
      if (!inc.ok) return { err: inc.error };
      if (!debt.ok) return { err: debt.error };
      const advice = adviseSmartLoan({
        grossIncome: inc.value,
        existingDebt: debt.value,
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
      });
      if ("error" in advice) return { err: advice.error };
      return {
        err: null,
        result: {
          headline: advice.verdict,
          headlineLabel: "Affordability verdict",
          rows: [
            ["Proposed EMI", formatLoanMoney(advice.emi, currency)],
            ["New DTI", `${advice.newDti.toFixed(1)}%`],
            ["Total interest", formatLoanMoney(advice.totalInterest, currency)],
            ...advice.tips.map((t) => ["Tip", t] as [string, string]),
          ],
        },
      };
    }

    if (slugKey === "loan-optimization-calculator") {
      const prepay = parseNonNegative(existingDebt, "Prepayment amount");
      const when = parseTermToMonths(maxEmi, "months", "Prepayment month");
      const altT = parseTermToMonths(altTerm, termMode, "Alternate term");
      const altA = parseAprPercent(altRate, "Alternate APR");
      if (!prepay.ok) return { err: prepay.error };
      if (!when.ok) return { err: when.error };
      if (!altT.ok) return { err: altT.error };
      if (!altA.ok) return { err: altA.error };
      const opt = optimizeLoanScenarios({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        prepaymentAmount: prepay.value,
        prepaymentMonth: when.value,
        alternateTermMonths: altT.value,
        alternateApr: altA.value,
        bankPennyRounding,
      });
      if ("error" in opt) return { err: opt.error };
      const best = opt.options.reduce((a, b) => (a.totalInterest < b.totalInterest ? a : b));
      return {
        err: null,
        result: {
          headline: best.label,
          headlineLabel: "Lowest-interest option",
          rows: opt.options.map((o) => [
            o.label,
            `${formatLoanMoney(o.totalInterest, currency)} interest · saved ${formatLoanMoney(o.interestSaved, currency)}`,
          ]),
        },
      };
    }

    if (slugKey === "should-i-take-loan-calculator") {
      const inc = parsePositive(income, "Gross monthly income");
      const debt = parseNonNegative(existingDebt, "Existing monthly debt");
      const ret = altTerm.trim() === "" ? undefined : parseAprPercent(altTerm, "Alternative return");
      if (!inc.ok) return { err: inc.error };
      if (!debt.ok) return { err: debt.error };
      if (ret && !ret.ok) return { err: ret.error };
      const decision = shouldTakeLoan({
        principal: p0.value,
        apr: a0.value,
        termMonths: t0.value,
        grossIncome: inc.value,
        existingDebt: debt.value,
        alternativeReturnPercent: ret?.value,
      });
      if ("error" in decision) return { err: decision.error };
      return {
        err: null,
        result: {
          headline: decision.verdict,
          headlineLabel: "Decision guide",
          rows: [
            ["EMI", formatLoanMoney(decision.emi, currency)],
            ["New DTI", `${decision.newDti.toFixed(1)}%`],
            ["Total interest", formatLoanMoney(decision.totalInterest, currency)],
            ...decision.rationale.map((r) => ["Note", r] as [string, string]),
          ],
        },
      };
    }

    const inc = parsePositive(income, "Gross monthly income");
    const debt = parseNonNegative(existingDebt, "Existing monthly debt");
    const emerg = parseNonNegative(maxEmi, "Emergency fund months");
    if (!inc.ok) return { err: inc.error };
    if (!debt.ok) return { err: debt.error };
    if (!emerg.ok) return { err: emerg.error };
    const loan = monthlyLoanPayment({
      principal: p0.value,
      annualRatePercent: a0.value,
      termMonths: t0.value,
    });
    if ("error" in loan) return { err: loan.error };
    const risk = assessLoanRisk({
      grossIncome: inc.value,
      existingDebt: debt.value,
      emi: loan.payment,
      apr: a0.value,
      termMonths: t0.value,
      emergencyFundMonths: emerg.value,
    });
    return {
      err: null,
      result: {
        headline: risk.band,
        headlineLabel: `Risk score ${risk.score}/100`,
        rows: [
          ["EMI", formatLoanMoney(loan.payment, currency)],
          ["DTI after loan", `${((debt.value + loan.payment) / inc.value * 100).toFixed(1)}%`],
          ...risk.factors.map((f) => ["Factor", f] as [string, string]),
        ],
      },
    };
  }, [
    slug,
    config,
    income,
    existingDebt,
    principal,
    apr,
    termRaw,
    termMode,
    maxEmi,
    altTerm,
    altRate,
    currency,
    bankPennyRounding,
  ]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${slug}-form-error`;
  const result = parsed.err ? null : parsed.result;
  const f = config.fields;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${income}-${existingDebt}-${principal}-${apr}-${termRaw}-${maxEmi}-${altTerm}-${altRate}-${currency}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onReset={() => {
              setIncome(config.incomeDefault ?? "0");
              setExistingDebt(config.debtDefault ?? "0");
              setPrincipal(config.principalDefault ?? "25000");
              setApr(config.aprDefault ?? "6.5");
              setTermRaw(config.termDefault ?? "5");
              setMaxEmi(config.maxEmiDefault ?? config.prepayMonthDefault ?? config.emergencyDefault ?? "0");
              setAltTerm(config.altTermDefault ?? config.altReturnDefault ?? "4");
              setAltRate(config.altRateDefault ?? "5.5");
            }}
            getSummary={() =>
              parsed.err || !result
                ? `${config.title}: ${parsed.err}`
                : `${config.title}: ${result.headlineLabel} ${result.headline}.`
            }
          />
        }
        result={
          parsed.err || !result ? (
            <p id={`${slug}-result-error`} className="text-sm font-medium text-rose-700" role="alert">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">{result.headlineLabel}</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.headline}</p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                {result.rows.map(([label, value], i) => (
                  <div key={`${label}-${i}`} className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="max-w-[65%] text-right font-mono text-[var(--text)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {f.income ? (
            <div>
              <FieldLabel htmlFor={`${slug}-income`}>Gross monthly income</FieldLabel>
              <FieldInput id={`${slug}-income`} inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
          {f.existingDebt ? (
            <div>
              <FieldLabel htmlFor={`${slug}-debt`}>
                {slug === "loan-optimization-calculator" ? "Prepayment amount" : "Existing monthly debt"}
              </FieldLabel>
              <FieldInput id={`${slug}-debt`} inputMode="decimal" value={existingDebt} onChange={(e) => setExistingDebt(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
          {f.principal ? (
            <div>
              <FieldLabel htmlFor={`${slug}-p`}>Loan amount</FieldLabel>
              <FieldInput id={`${slug}-p`} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
          {f.apr ? (
            <div>
              <FieldLabel htmlFor={`${slug}-apr`}>APR %</FieldLabel>
              <FieldInput id={`${slug}-apr`} inputMode="decimal" value={apr} onChange={(e) => setApr(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
          {f.term ? (
            <div>
              <FieldLabel htmlFor={`${slug}-term`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
              <FieldInput id={`${slug}-term`} inputMode="decimal" value={termRaw} onChange={(e) => setTermRaw(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
              {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
            </div>
          ) : null}
          {f.maxEmi ? (
            <div>
              <FieldLabel htmlFor={`${slug}-max-emi`}>Max affordable EMI</FieldLabel>
              <FieldInput id={`${slug}-max-emi`} inputMode="decimal" value={maxEmi} onChange={(e) => setMaxEmi(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
          {f.emergencyMonths ? (
            <div>
              <FieldLabel htmlFor={`${slug}-emergency`}>Emergency fund (months)</FieldLabel>
              <FieldInput id={`${slug}-emergency`} inputMode="decimal" value={maxEmi} onChange={(e) => setMaxEmi(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
          {f.altReturn ? (
            <div>
              <FieldLabel htmlFor={`${slug}-alt-return`}>Alternative return % p.a.</FieldLabel>
              <FieldInput id={`${slug}-alt-return`} inputMode="decimal" value={altTerm} onChange={(e) => setAltTerm(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} />
            </div>
          ) : null}
        </div>

        {(f.prepayAmount || f.prepayMonth || f.altTerm || f.altRate) ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {f.prepayMonth ? (
              <div>
                <FieldLabel htmlFor={`${slug}-prepay-m`}>Prepayment month</FieldLabel>
                <FieldInput id={`${slug}-prepay-m`} inputMode="numeric" value={maxEmi} onChange={(e) => setMaxEmi(e.target.value)} className="mt-2" />
              </div>
            ) : null}
            {f.altTerm ? (
              <div>
                <FieldLabel htmlFor={`${slug}-alt-term`}>Alternate term ({termMode === "years" ? "years" : "months"})</FieldLabel>
                <FieldInput id={`${slug}-alt-term`} inputMode="decimal" value={altTerm} onChange={(e) => setAltTerm(e.target.value)} className="mt-2" />
              </div>
            ) : null}
            {f.altRate ? (
              <div>
                <FieldLabel htmlFor={`${slug}-alt-rate`}>Alternate APR %</FieldLabel>
                <FieldInput id={`${slug}-alt-rate`} inputMode="decimal" value={altRate} onChange={(e) => setAltRate(e.target.value)} className="mt-2" />
              </div>
            ) : null}
          </div>
        ) : null}

        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
      </CalculatorShell>
    </>
  );
}
