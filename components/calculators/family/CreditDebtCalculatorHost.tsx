"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { monthlyLoanPayment } from "@/lib/calculators/loanPayment";

type CreditDebtSlug =
  | "debt-to-income-ratio-calculator"
  | "loan-repayment-capacity-calculator"
  | "credit-card-emi-calculator"
  | "credit-card-interest-calculator"
  | "debt-payoff-calculator"
  | "debt-snowball-calculator"
  | "debt-avalanche-calculator";

type Debt = {
  name: string;
  balance: number;
  apr: number;
  minimum: number;
};

const CONFIG: Record<CreditDebtSlug, { title: string; description: string }> = {
  "debt-to-income-ratio-calculator": {
    title: "Debt-to-income ratio calculator",
    description: "Compare monthly debt payments with gross monthly income and estimate a simple DTI ratio.",
  },
  "loan-repayment-capacity-calculator": {
    title: "Loan repayment capacity calculator",
    description: "Estimate how much EMI capacity remains after current debts and a target debt-to-income limit.",
  },
  "credit-card-emi-calculator": {
    title: "Credit card EMI calculator",
    description: "Convert a card balance into a fixed monthly EMI and estimate total interest.",
  },
  "credit-card-interest-calculator": {
    title: "Credit card interest calculator",
    description: "Estimate monthly card interest and payoff time from balance, APR, and monthly payment.",
  },
  "debt-payoff-calculator": {
    title: "Debt payoff calculator",
    description: "Estimate payoff time and interest for one debt with a fixed monthly payment.",
  },
  "debt-snowball-calculator": {
    title: "Debt snowball calculator",
    description: "Order debts from smallest balance to largest and estimate a payoff plan.",
  },
  "debt-avalanche-calculator": {
    title: "Debt avalanche calculator",
    description: "Order debts from highest APR to lowest and estimate a payoff plan.",
  },
};

function payoff(balance: number, apr: number, payment: number) {
  if (balance <= 0) return { error: "Balance must be positive." };
  if (payment <= 0) return { error: "Monthly payment must be positive." };
  const monthlyRate = apr / 100 / 12;
  let remaining = balance;
  let totalInterest = 0;
  let months = 0;
  while (remaining > 0.01 && months < 1200) {
    const interest = remaining * monthlyRate;
    if (payment <= interest) {
      return { error: "Payment does not cover monthly interest. Increase payment or lower APR." };
    }
    totalInterest += interest;
    remaining = Math.max(0, remaining + interest - payment);
    months += 1;
  }
  if (months >= 1200) return { error: "Debt did not close within 1200 months." };
  return { months, totalInterest, totalPaid: balance + totalInterest };
}

function parseDebt(name: string, balanceRaw: string, aprRaw: string, minRaw: string): Debt | { error: string } {
  const balance = parsePositive(balanceRaw, `${name} balance`);
  const apr = parseAprPercent(aprRaw, `${name} APR`);
  const minimum = parseNonNegative(minRaw, `${name} minimum`);
  if (!balance.ok) return { error: balance.error };
  if (!apr.ok) return { error: apr.error };
  if (!minimum.ok) return { error: minimum.error };
  return { name, balance: balance.value, apr: apr.value, minimum: minimum.value };
}

function strategyPlan(debts: Debt[], extraPayment: number, strategy: "snowball" | "avalanche") {
  const ordered = [...debts].sort((a, b) =>
    strategy === "snowball" ? a.balance - b.balance : b.apr - a.apr,
  );
  const minimums = ordered.reduce((sum, d) => sum + d.minimum, 0);
  const totalMonthly = minimums + extraPayment;
  const totalBalance = ordered.reduce((sum, d) => sum + d.balance, 0);
  const weightedApr =
    totalBalance > 0 ? ordered.reduce((sum, d) => sum + d.apr * d.balance, 0) / totalBalance : 0;
  const rough = payoff(totalBalance, weightedApr, totalMonthly);
  if ("error" in rough) return { error: rough.error };
  return {
    ordered,
    totalMonthly,
    weightedApr,
    months: rough.months,
    totalInterest: rough.totalInterest,
    firstTarget: ordered[0],
  };
}

export function CreditDebtCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CreditDebtSlug] ?? CONFIG["debt-payoff-calculator"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [primary, setPrimary] = useState(useLoanInitialInput(LOAN_URL.P, "5000"));
  const [secondary, setSecondary] = useState(useLoanInitialInput(LOAN_URL.E, "1200"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "18"));
  const [payment, setPayment] = useState(useLoanInitialInput(LOAN_URL.T, "250"));
  const [extra, setExtra] = useState(useLoanInitialInput(LOAN_URL.X, "100"));
  const [debt2, setDebt2] = useState(useLoanInitialInput(LOAN_URL.R, "3000"));
  const [debt3, setDebt3] = useState(useLoanInitialInput(LOAN_URL.F, "9000"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: primary,
      [LOAN_URL.E]: secondary,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: payment,
      [LOAN_URL.X]: extra,
      [LOAN_URL.R]: debt2,
      [LOAN_URL.F]: debt3,
    }),
    [primary, secondary, apr, payment, extra, debt2, debt3],
  );
  useLoanUrlSync(shareParams, [primary, secondary, apr, payment, extra, debt2, debt3, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const slugKey = slug as CreditDebtSlug;

    if (slugKey === "debt-to-income-ratio-calculator") {
      const income = parsePositive(primary, "Gross monthly income");
      const housing = parseNonNegative(secondary, "Housing payment");
      const otherDebt = parseNonNegative(payment, "Other monthly debt");
      if (!income.ok) return { error: income.error };
      if (!housing.ok) return { error: housing.error };
      if (!otherDebt.ok) return { error: otherDebt.error };
      const monthlyDebt = housing.value + otherDebt.value;
      const ratio = (monthlyDebt / income.value) * 100;
      return {
        headline: `${ratio.toFixed(1)}%`,
        label: "Debt-to-income ratio",
        rows: [
          ["Monthly debt", formatLoanMoney(monthlyDebt, currency)],
          ["Gross monthly income", formatLoanMoney(income.value, currency)],
          ["Rule-of-thumb band", ratio <= 36 ? "Generally manageable" : ratio <= 43 ? "Stretched" : "High risk"],
        ],
      };
    }

    if (slugKey === "loan-repayment-capacity-calculator") {
      const income = parsePositive(primary, "Gross monthly income");
      const currentDebt = parseNonNegative(secondary, "Current monthly debt");
      const targetDti = parsePositive(payment, "Target DTI %");
      if (!income.ok) return { error: income.error };
      if (!currentDebt.ok) return { error: currentDebt.error };
      if (!targetDti.ok) return { error: targetDti.error };
      const maxDebt = income.value * (targetDti.value / 100);
      const capacity = Math.max(0, maxDebt - currentDebt.value);
      return {
        headline: formatLoanMoney(capacity, currency),
        label: "Estimated EMI capacity",
        rows: [
          ["Target monthly debt cap", formatLoanMoney(maxDebt, currency)],
          ["Current monthly debt", formatLoanMoney(currentDebt.value, currency)],
          ["Remaining capacity", formatLoanMoney(capacity, currency)],
        ],
      };
    }

    if (slugKey === "credit-card-emi-calculator") {
      const balance = parsePositive(primary, "Card balance");
      const rate = parseAprPercent(apr, "APR");
      const months = parsePositive(payment, "Tenure months");
      if (!balance.ok) return { error: balance.error };
      if (!rate.ok) return { error: rate.error };
      if (!months.ok) return { error: months.error };
      const emi = monthlyLoanPayment({
        principal: balance.value,
        annualRatePercent: rate.value,
        termMonths: Math.round(months.value),
      });
      if ("error" in emi) return { error: emi.error };
      return {
        headline: formatLoanMoney(emi.payment, currency),
        label: "Monthly card EMI",
        rows: [
          ["Total interest", formatLoanMoney(emi.totalInterest, currency)],
          ["Total paid", formatLoanMoney(emi.totalPaid, currency)],
          ["Tenure", `${emi.termMonths} months`],
        ],
      };
    }

    if (slugKey === "debt-snowball-calculator" || slugKey === "debt-avalanche-calculator") {
      const d1 = parseDebt("Debt 1", primary, apr, "50");
      const d2 = parseDebt("Debt 2", debt2, "22", "75");
      const d3 = parseDebt("Debt 3", debt3, "9", "150");
      const extraPay = parseNonNegative(extra, "Extra monthly payment");
      if ("error" in d1) return { error: d1.error };
      if ("error" in d2) return { error: d2.error };
      if ("error" in d3) return { error: d3.error };
      if (!extraPay.ok) return { error: extraPay.error };
      const strategy = slugKey === "debt-snowball-calculator" ? "snowball" : "avalanche";
      const plan = strategyPlan([d1, d2, d3], extraPay.value, strategy);
      if ("error" in plan) return { error: plan.error };
      return {
        headline: plan.firstTarget.name,
        label: "First payoff target",
        rows: [
          ["Payoff order", plan.ordered.map((d) => d.name).join(" > ")],
          ["Monthly payoff budget", formatLoanMoney(plan.totalMonthly, currency)],
          ["Estimated payoff", `${plan.months} months`],
          ["Estimated interest", formatLoanMoney(plan.totalInterest, currency)],
        ],
      };
    }

    const balance = parsePositive(primary, slugKey === "credit-card-interest-calculator" ? "Card balance" : "Debt balance");
    const rate = parseAprPercent(apr, "APR");
    const monthly = parsePositive(payment, "Monthly payment");
    if (!balance.ok) return { error: balance.error };
    if (!rate.ok) return { error: rate.error };
    if (!monthly.ok) return { error: monthly.error };
    const result = payoff(balance.value, rate.value, monthly.value);
    if ("error" in result) return { error: result.error };
    const monthlyInterest = balance.value * (rate.value / 100 / 12);
    return {
      headline: `${result.months} months`,
      label: slugKey === "credit-card-interest-calculator" ? "Estimated payoff time" : "Debt-free estimate",
      rows: [
        ["First month interest", formatLoanMoney(monthlyInterest, currency)],
        ["Total interest", formatLoanMoney(result.totalInterest, currency)],
        ["Total paid", formatLoanMoney(result.totalPaid, currency)],
      ],
    };
  }, [slug, primary, secondary, apr, payment, extra, debt2, debt3, currency]);

  const fieldInvalid = "error" in parsed;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${slug}-${primary}-${secondary}-${apr}-${payment}-${extra}-${debt2}-${debt3}-${currency}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            getShareSearchParams={shareParams}
            onReset={() => {
              setPrimary("5000");
              setSecondary("1200");
              setApr("18");
              setPayment("250");
              setExtra("100");
              setDebt2("3000");
              setDebt3("9000");
            }}
            getSummary={() =>
              "error" in parsed
                ? `${config.title}: ${parsed.error}`
                : `${config.title}: ${parsed.label} ${parsed.headline}.`
            }
          />
        }
        result={
          "error" in parsed ? (
            <p id={`${slug}-result-error`} className="text-sm font-medium text-rose-700" role="alert">
              {parsed.error}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">{parsed.label}</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{parsed.headline}</p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                {parsed.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="text-right font-mono text-[var(--text)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      >
        <CreditDebtFields
          slug={slug as CreditDebtSlug}
          values={{ primary, secondary, apr, payment, extra, debt2, debt3 }}
          setters={{ setPrimary, setSecondary, setApr, setPayment, setExtra, setDebt2, setDebt3 }}
          invalid={fieldInvalid}
        />
      </CalculatorShell>
    </>
  );
}

function CreditDebtFields({
  slug,
  values,
  setters,
  invalid,
}: {
  slug: CreditDebtSlug;
  values: Record<"primary" | "secondary" | "apr" | "payment" | "extra" | "debt2" | "debt3", string>;
  setters: {
    setPrimary: (value: string) => void;
    setSecondary: (value: string) => void;
    setApr: (value: string) => void;
    setPayment: (value: string) => void;
    setExtra: (value: string) => void;
    setDebt2: (value: string) => void;
    setDebt3: (value: string) => void;
  };
  invalid: boolean;
}) {
  if (slug === "debt-to-income-ratio-calculator") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField id={`${slug}-income`} label="Gross monthly income" value={values.primary} onChange={setters.setPrimary} invalid={invalid} />
        <TextField id={`${slug}-housing`} label="Housing payment" value={values.secondary} onChange={setters.setSecondary} invalid={invalid} />
        <TextField id={`${slug}-other`} label="Other monthly debt" value={values.payment} onChange={setters.setPayment} invalid={invalid} />
      </div>
    );
  }

  if (slug === "loan-repayment-capacity-calculator") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField id={`${slug}-income`} label="Gross monthly income" value={values.primary} onChange={setters.setPrimary} invalid={invalid} />
        <TextField id={`${slug}-debt`} label="Current monthly debt" value={values.secondary} onChange={setters.setSecondary} invalid={invalid} />
        <TextField id={`${slug}-target`} label="Target DTI %" value={values.payment} onChange={setters.setPayment} invalid={invalid} />
      </div>
    );
  }

  if (slug === "debt-snowball-calculator" || slug === "debt-avalanche-calculator") {
    return (
      <div className="grid gap-4 sm:grid-cols-4">
        <TextField id={`${slug}-d1`} label="Debt 1 balance" value={values.primary} onChange={setters.setPrimary} invalid={invalid} />
        <TextField id={`${slug}-d1-apr`} label="Debt 1 APR %" value={values.apr} onChange={setters.setApr} invalid={invalid} />
        <TextField id={`${slug}-d2`} label="Debt 2 balance" value={values.debt2} onChange={setters.setDebt2} invalid={invalid} />
        <TextField id={`${slug}-d3`} label="Debt 3 balance" value={values.debt3} onChange={setters.setDebt3} invalid={invalid} />
        <TextField id={`${slug}-extra`} label="Extra monthly payoff" value={values.extra} onChange={setters.setExtra} invalid={invalid} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TextField
        id={`${slug}-balance`}
        label={slug === "credit-card-emi-calculator" || slug === "credit-card-interest-calculator" ? "Card balance" : "Debt balance"}
        value={values.primary}
        onChange={setters.setPrimary}
        invalid={invalid}
      />
      <TextField id={`${slug}-apr`} label="APR %" value={values.apr} onChange={setters.setApr} invalid={invalid} />
      <TextField
        id={`${slug}-payment`}
        label={slug === "credit-card-emi-calculator" ? "Tenure months" : "Monthly payment"}
        value={values.payment}
        onChange={setters.setPayment}
        invalid={invalid}
      />
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2"
        aria-invalid={invalid}
      />
    </div>
  );
}
