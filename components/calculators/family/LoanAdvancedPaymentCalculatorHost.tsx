"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { parseAprPercent, parseNonNegative, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { amortizationSchedule, amortizationTotals, monthlyLoanPayment, type AmortizationRow, type LoanTermInput } from "@/lib/calculators/loanPayment";
import { roundCurrency } from "@/lib/calculators/roundMoney";

type AdvancedLoanSlug =
  | "emi-with-prepayment-calculator"
  | "emi-with-extra-payment-calculator"
  | "step-up-emi-calculator"
  | "step-down-emi-calculator"
  | "balloon-payment-calculator"
  | "bullet-repayment-calculator"
  | "loan-part-payment-calculator"
  | "loan-restructuring-calculator";

type ScenarioConfig = {
  title: string;
  description: string;
  amountLabel?: string;
  amountDefault?: string;
  amountHint?: string;
  rateLabel?: string;
  rateDefault?: string;
  rateHint?: string;
  monthLabel?: string;
  monthDefault?: string;
  monthHint?: string;
};

const CONFIG: Record<AdvancedLoanSlug, ScenarioConfig> = {
  "emi-with-prepayment-calculator": {
    title: "EMI with prepayment calculator",
    description: "Add a one-time prepayment to a regular EMI loan and estimate interest saved plus the new payoff month.",
    amountLabel: "One-time prepayment",
    amountDefault: "2500",
    amountHint: "Applied after the regular EMI in the selected month.",
    monthLabel: "Prepayment month",
    monthDefault: "12",
    monthHint: "Month 1 means after the first EMI.",
  },
  "emi-with-extra-payment-calculator": {
    title: "EMI with extra payment calculator",
    description: "Model a fixed extra principal payment every month on top of the regular EMI.",
    amountLabel: "Extra principal / month",
    amountDefault: "150",
    amountHint: "Added every month until the balance closes.",
  },
  "step-up-emi-calculator": {
    title: "Step-up EMI calculator",
    description: "Increase EMI once per year and see how much faster the loan can close.",
    rateLabel: "EMI step-up % / year",
    rateDefault: "5",
    rateHint: "The EMI increases after every 12 payments.",
  },
  "step-down-emi-calculator": {
    title: "Step-down EMI calculator",
    description: "Reduce EMI once per year and estimate whether the loan can still amortize within the allowed horizon.",
    rateLabel: "EMI step-down % / year",
    rateDefault: "3",
    rateHint: "The EMI decreases after every 12 payments.",
  },
  "balloon-payment-calculator": {
    title: "Balloon payment calculator",
    description: "Calculate the monthly payment when a chosen balloon amount is paid at the end of the term.",
    amountLabel: "Final balloon payment",
    amountDefault: "5000",
    amountHint: "This principal amount remains for the last payment.",
  },
  "bullet-repayment-calculator": {
    title: "Bullet repayment calculator",
    description: "Interest-only monthly payments with principal repaid as a final bullet payment.",
  },
  "loan-part-payment-calculator": {
    title: "Loan part payment calculator",
    description: "Apply a one-time part payment and compare tenure reduction with EMI recast.",
    amountLabel: "Part payment amount",
    amountDefault: "3000",
    amountHint: "Applied after the regular EMI in the selected month.",
    monthLabel: "Part payment month",
    monthDefault: "18",
  },
  "loan-restructuring-calculator": {
    title: "Loan restructuring calculator",
    description: "Compare the remaining loan against a new APR and new remaining term after restructuring.",
    rateLabel: "New APR %",
    rateDefault: "8",
    rateHint: "APR after restructure.",
    monthLabel: "Payments already made",
    monthDefault: "24",
    monthHint: "Used to estimate current outstanding balance.",
    amountLabel: "New remaining term",
    amountDefault: "4",
    amountHint: "Uses the navbar years/months term mode.",
  },
};

function paymentForBalloon(principal: number, apr: number, months: number, balloon: number) {
  if (balloon >= principal) return { error: "Balloon must be less than principal." };
  const r = apr / 100 / 12;
  if (r === 0) return { payment: (principal - balloon) / months };
  const discountBalloon = balloon / (1 + r) ** months;
  return { payment: ((principal - discountBalloon) * r) / (1 - (1 + r) ** -months) };
}

function simulateScenario(params: {
  principal: number;
  apr: number;
  baseEmi: number;
  monthlyExtra?: number;
  annualStepPercent?: number;
  oneTimeMonth?: number;
  oneTimeAmount?: number;
  bankPennyRounding?: boolean;
}) {
  const {
    principal,
    apr,
    baseEmi,
    monthlyExtra = 0,
    annualStepPercent = 0,
    oneTimeMonth,
    oneTimeAmount = 0,
    bankPennyRounding = false,
  } = params;
  const r = apr / 100 / 12;
  let balance = bankPennyRounding ? roundCurrency(principal) : principal;
  let emi = bankPennyRounding ? roundCurrency(baseEmi) : baseEmi;
  let totalPaid = 0;
  let totalInterest = 0;
  const rows: AmortizationRow[] = [];

  for (let month = 1; month <= 1200 && balance > 0.01; month++) {
    if (month > 1 && annualStepPercent !== 0 && (month - 1) % 12 === 0) {
      emi *= 1 + annualStepPercent / 100;
      if (bankPennyRounding) emi = roundCurrency(emi);
    }
    const interest = bankPennyRounding ? roundCurrency(balance * r) : balance * r;
    if (emi + monthlyExtra < interest) {
      return { error: "Payment no longer covers monthly interest. Use a smaller step-down or a higher EMI." };
    }
    let principalPaid = emi + monthlyExtra - interest;
    if (oneTimeMonth === month) principalPaid += oneTimeAmount;
    if (principalPaid > balance) principalPaid = balance;
    const payment = interest + principalPaid;
    balance = bankPennyRounding ? roundCurrency(balance - principalPaid) : Math.max(0, balance - principalPaid);
    totalPaid += payment;
    totalInterest += interest;
    rows.push({ month, payment, interest, principal: principalPaid, balance });
  }

  if (balance > 0.05) return { error: "Loan did not close within 1200 months with these settings." };
  return { rows, totalPaid, totalInterest, months: rows.length };
}

export function LoanAdvancedPaymentCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AdvancedLoanSlug] ?? CONFIG["emi-with-extra-payment-calculator"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [amount, setAmount] = useState(useLoanInitialInput(LOAN_URL.X, config.amountDefault ?? "0"));
  const [rate, setRate] = useState(useLoanInitialInput(LOAN_URL.R, config.rateDefault ?? "0"));
  const [month, setMonth] = useState(useLoanInitialInput(LOAN_URL.U, config.monthDefault ?? "12"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.X]: amount,
      [LOAN_URL.R]: rate,
      [LOAN_URL.U]: month,
    }),
    [principal, apr, termRaw, amount, rate, month],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, amount, rate, month, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    const term: LoanTermInput = { termMonths: t0.value };
    const base = monthlyLoanPayment({ principal: p0.value, annualRatePercent: a0.value, termMonths: t0.value });
    if ("error" in base) return { err: base.error };
    const baseEmi = bankPennyRounding ? roundCurrency(base.payment) : base.payment;
    const baseSchedule = amortizationSchedule(p0.value, a0.value, term, undefined, bankPennyRounding);
    if ("error" in baseSchedule) return { err: baseSchedule.error };
    const baseTotals = amortizationTotals(baseSchedule);

    const slugKey = slug as AdvancedLoanSlug;
    if (slugKey === "balloon-payment-calculator") {
      const b = parseNonNegative(amount, "Balloon payment");
      if (!b.ok) return { err: b.error };
      const pay = paymentForBalloon(p0.value, a0.value, t0.value, b.value);
      if ("error" in pay) return { err: pay.error };
      const totalInterest = pay.payment * t0.value + b.value - p0.value;
      return {
        err: null,
        term,
        result: {
          headline: formatLoanMoney(pay.payment, currency),
          headlineLabel: "Monthly payment before balloon",
          rows: [
            ["Final balloon", formatLoanMoney(b.value, currency)],
            ["Total paid", formatLoanMoney(pay.payment * t0.value + b.value, currency)],
            ["Total interest", formatLoanMoney(totalInterest, currency)],
          ],
        },
      };
    }

    if (slugKey === "bullet-repayment-calculator") {
      const monthlyInterest = p0.value * (a0.value / 100 / 12);
      const totalInterest = monthlyInterest * t0.value;
      return {
        err: null,
        term,
        result: {
          headline: formatLoanMoney(monthlyInterest, currency),
          headlineLabel: "Interest-only monthly payment",
          rows: [
            ["Final bullet principal", formatLoanMoney(p0.value, currency)],
            ["Total interest", formatLoanMoney(totalInterest, currency)],
            ["Total paid", formatLoanMoney(p0.value + totalInterest, currency)],
          ],
        },
      };
    }

    if (slugKey === "loan-restructuring-calculator") {
      const paid = parseTermToMonths(month, "months", "Payments already made");
      const newApr = parseAprPercent(rate, "New APR");
      const newTerm = parseTermToMonths(amount, termMode, "New remaining term");
      if (!paid.ok) return { err: paid.error };
      if (!newApr.ok) return { err: newApr.error };
      if (!newTerm.ok) return { err: newTerm.error };
      const elapsed = Math.min(paid.value, baseSchedule.length - 1);
      const outstanding = elapsed <= 0 ? p0.value : baseSchedule[elapsed - 1]?.balance ?? p0.value;
      const restructured = monthlyLoanPayment({
        principal: outstanding,
        annualRatePercent: newApr.value,
        termMonths: newTerm.value,
      });
      if ("error" in restructured) return { err: restructured.error };
      const oldRemaining = baseSchedule.slice(elapsed);
      const oldRemainingTotals = amortizationTotals(oldRemaining);
      return {
        err: null,
        term: { termMonths: newTerm.value },
        result: {
          headline: formatLoanMoney(restructured.payment, currency),
          headlineLabel: "New monthly EMI",
          rows: [
            ["Estimated outstanding", formatLoanMoney(outstanding, currency)],
            ["Old remaining interest", formatLoanMoney(oldRemainingTotals.totalInterest, currency)],
            ["New total interest", formatLoanMoney(restructured.totalInterest, currency)],
            ["Interest difference", formatLoanMoney(restructured.totalInterest - oldRemainingTotals.totalInterest, currency)],
          ],
        },
      };
    }

    const amt = parseNonNegative(amount, config.amountLabel ?? "Amount");
    const pct = parseNonNegative(rate, config.rateLabel ?? "Rate");
    const when = parseTermToMonths(month, "months", config.monthLabel ?? "Payment month");
    if ((slugKey === "emi-with-prepayment-calculator" || slugKey === "loan-part-payment-calculator") && !amt.ok) return { err: amt.error };
    if ((slugKey === "emi-with-prepayment-calculator" || slugKey === "loan-part-payment-calculator") && !when.ok) return { err: when.error };
    if (slugKey === "emi-with-extra-payment-calculator" && !amt.ok) return { err: amt.error };
    if ((slugKey === "step-up-emi-calculator" || slugKey === "step-down-emi-calculator") && !pct.ok) return { err: pct.error };

    const scenario = simulateScenario({
      principal: p0.value,
      apr: a0.value,
      baseEmi,
      monthlyExtra: slugKey === "emi-with-extra-payment-calculator" ? amt.ok ? amt.value : 0 : 0,
      annualStepPercent:
        slugKey === "step-up-emi-calculator" ? (pct.ok ? pct.value : 0) :
        slugKey === "step-down-emi-calculator" ? -(pct.ok ? pct.value : 0) : 0,
      oneTimeMonth:
        slugKey === "emi-with-prepayment-calculator" || slugKey === "loan-part-payment-calculator"
          ? when.ok ? when.value : undefined
          : undefined,
      oneTimeAmount:
        slugKey === "emi-with-prepayment-calculator" || slugKey === "loan-part-payment-calculator"
          ? amt.ok ? amt.value : 0
          : 0,
      bankPennyRounding,
    });
    if ("error" in scenario) return { err: scenario.error };

    const rows: [string, string][] = [
      ["Base EMI", formatLoanMoney(baseEmi, currency)],
      ["New payoff", `${scenario.months} months`],
      ["Interest saved", formatLoanMoney(baseTotals.totalInterest - scenario.totalInterest, currency)],
      ["Total paid", formatLoanMoney(scenario.totalPaid, currency)],
    ];

    if (slugKey === "loan-part-payment-calculator") {
      const partMonth = when.ok ? Math.min(when.value, baseSchedule.length - 1) : 1;
      const afterPart = scenario.rows[partMonth - 1]?.balance ?? p0.value;
      const remainingMonths = Math.max(1, t0.value - partMonth);
      const recast = monthlyLoanPayment({
        principal: afterPart,
        annualRatePercent: a0.value,
        termMonths: remainingMonths,
      });
      if (!("error" in recast)) {
        rows.push(["Recast EMI after part payment", formatLoanMoney(recast.payment, currency)]);
      }
    }

    return {
      err: null,
      term,
      result: {
        headline: `${scenario.months} months`,
        headlineLabel: "Estimated payoff",
        rows,
        series: scenario.rows.map((row) => ({ month: row.month, balance: row.balance })),
      },
    };
  }, [principal, apr, termRaw, termMode, amount, rate, month, slug, config.amountLabel, config.rateLabel, config.monthLabel, currency, bankPennyRounding]);

  const showAmount = Boolean(config.amountLabel);
  const showRate = Boolean(config.rateLabel);
  const showMonth = Boolean(config.monthLabel);
  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${slug}-form-error`;
  const result = parsed.err ? null : parsed.result;

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${principal}-${apr}-${termRaw}-${amount}-${rate}-${month}-${currency}-${bankPennyRounding}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onReset={() => {
              setPrincipal("25000");
              setApr("6.5");
              setTermRaw("5");
              setAmount(config.amountDefault ?? "0");
              setRate(config.rateDefault ?? "0");
              setMonth(config.monthDefault ?? "12");
            }}
            getSummary={() =>
              parsed.err || !result
                ? `${config.title}: ${parsed.err}`
                : `${config.title}: ${result.headlineLabel} ${result.headline}. Principal ${principal}, APR ${apr}%, term ${termRaw}.`
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
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {result.headline}
                </p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                {result.rows.map(([label, value]) => (
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
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${slug}-p`}>Principal</FieldLabel>
            <FieldInput id={`${slug}-p`} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-apr`}>APR %</FieldLabel>
            <FieldInput id={`${slug}-apr`} inputMode="decimal" value={apr} onChange={(e) => setApr(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-term`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput id={`${slug}-term`} inputMode="decimal" value={termRaw} onChange={(e) => setTermRaw(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>

        {(showAmount || showRate || showMonth) ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-3">
            {showAmount ? (
              <div>
                <FieldLabel htmlFor={`${slug}-amount`}>{config.amountLabel}</FieldLabel>
                <FieldInput id={`${slug}-amount`} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.amountHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.amountHint}</p> : null}
              </div>
            ) : null}
            {showRate ? (
              <div>
                <FieldLabel htmlFor={`${slug}-rate`}>{config.rateLabel}</FieldLabel>
                <FieldInput id={`${slug}-rate`} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.rateHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.rateHint}</p> : null}
              </div>
            ) : null}
            {showMonth ? (
              <div>
                <FieldLabel htmlFor={`${slug}-month`}>{config.monthLabel}</FieldLabel>
                <FieldInput id={`${slug}-month`} inputMode="numeric" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
                {config.monthHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.monthHint}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
        {!parsed.err && parsed.term && result ? (
          <UserLoanBalanceMini
            principal={Number(principal)}
            apr={Number(apr)}
            term={parsed.term}
            currency={currency}
            balanceSeries={result.series}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </>
  );
}
