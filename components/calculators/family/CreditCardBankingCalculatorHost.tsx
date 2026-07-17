"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { CreditCardBankingCurrencyCode } from "@/lib/calculators/creditCardBanking";
import {
  CREDIT_CARD_BANKING_URL,
  annualFeeValue,
  balanceTransferSavings,
  cashbackCalc,
  creditCardDebtReduction,
  creditCardPayoff,
  creditCardRewards,
  formatCreditCardBankingMoney,
  interestFreePeriod,
  latePaymentFee,
  minimumPayment,
  revolvingCreditCost,
} from "@/lib/calculators/creditCardBanking";

type CcSlug =
  | "minimum-payment-calculator"
  | "credit-card-payoff-calculator"
  | "credit-card-debt-reduction-planner"
  | "balance-transfer-savings-calculator"
  | "credit-card-late-payment-fee-calculator"
  | "interest-free-period-calculator"
  | "credit-card-rewards-calculator"
  | "cashback-calculator"
  | "credit-card-annual-fee-value-calculator"
  | "revolving-credit-cost-calculator";

type Mode =
  | "minPay"
  | "payoff"
  | "debtReduction"
  | "balanceTransfer"
  | "lateFee"
  | "interestFree"
  | "rewards"
  | "cashback"
  | "annualFee"
  | "revolving";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
  fDefault: string;
};

const CONFIG: Record<CcSlug, Config> = {
  "minimum-payment-calculator": {
    title: "Minimum payment calculator",
    description: "Estimate minimum amount due from balance, minimum % rule, and optional floor amount.",
    mode: "minPay",
    aDefault: "50000",
    bDefault: "0",
    rDefault: "5",
    tDefault: "0",
    mDefault: "0",
    fDefault: "500",
  },
  "credit-card-payoff-calculator": {
    title: "Credit card payoff calculator",
    description: "See how long it takes to clear a card balance at a fixed monthly payment and APR.",
    mode: "payoff",
    aDefault: "75000",
    bDefault: "0",
    rDefault: "42",
    tDefault: "0",
    mDefault: "5000",
    fDefault: "0",
  },
  "credit-card-debt-reduction-planner": {
    title: "Credit card debt reduction planner",
    description: "Compare payoff time at minimum due vs minimum plus extra monthly payment.",
    mode: "debtReduction",
    aDefault: "100000",
    bDefault: "0",
    rDefault: "36",
    tDefault: "5",
    mDefault: "3000",
    fDefault: "0",
  },
  "balance-transfer-savings-calculator": {
    title: "Balance transfer savings calculator",
    description: "Compare interest staying on current APR vs a promotional transfer rate minus transfer fee.",
    mode: "balanceTransfer",
    aDefault: "150000",
    bDefault: "0",
    rDefault: "42",
    tDefault: "0",
    mDefault: "6",
    fDefault: "2",
  },
  "credit-card-late-payment-fee-calculator": {
    title: "Credit card late payment fee calculator",
    description: "Estimate late fee as the greater of a flat charge or percentage of balance.",
    mode: "lateFee",
    aDefault: "25000",
    bDefault: "0",
    rDefault: "0",
    tDefault: "0",
    mDefault: "0",
    fDefault: "1300",
  },
  "interest-free-period-calculator": {
    title: "Interest-free period calculator",
    description: "Educational estimate of grace days from purchase to payment due date.",
    mode: "interestFree",
    aDefault: "1",
    bDefault: "15",
    rDefault: "0",
    tDefault: "0",
    mDefault: "10",
    fDefault: "0",
  },
  "credit-card-rewards-calculator": {
    title: "Credit card rewards calculator",
    description: "Project reward points and rupee value from monthly spend and earn rate.",
    mode: "rewards",
    aDefault: "40000",
    bDefault: "0",
    rDefault: "2",
    tDefault: "0.25",
    mDefault: "12",
    fDefault: "0",
  },
  "cashback-calculator": {
    title: "Cashback calculator",
    description: "Compute cashback earned with optional monthly or statement cap.",
    mode: "cashback",
    aDefault: "50000",
    bDefault: "0",
    rDefault: "5",
    tDefault: "0",
    mDefault: "0",
    fDefault: "500",
  },
  "credit-card-annual-fee-value-calculator": {
    title: "Credit card annual fee value calculator",
    description: "See if rewards and benefits outweigh the annual fee.",
    mode: "annualFee",
    aDefault: "12000",
    bDefault: "5000",
    rDefault: "0",
    tDefault: "0",
    mDefault: "0",
    fDefault: "2500",
  },
  "revolving-credit-cost-calculator": {
    title: "Revolving credit cost calculator",
    description: "Estimate interest cost if you revolve a balance without paying down principal.",
    mode: "revolving",
    aDefault: "80000",
    bDefault: "0",
    rDefault: "42",
    tDefault: "0",
    mDefault: "12",
    fDefault: "0",
  },
};

const CURRENCIES: CreditCardBankingCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function CreditCardBankingCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CcSlug] ?? CONFIG["credit-card-payoff-calculator"];
  const [currency, setCurrency] = useState<CreditCardBankingCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(CREDIT_CARD_BANKING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CREDIT_CARD_BANKING_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CREDIT_CARD_BANKING_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CREDIT_CARD_BANKING_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(CREDIT_CARD_BANKING_URL.M, config.mDefault));
  const [f, setF] = useState(useLoanInitialInput(CREDIT_CARD_BANKING_URL.F, config.fDefault));

  const fmt = useCallback((n: number) => formatCreditCardBankingMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [CREDIT_CARD_BANKING_URL.A]: a,
      [CREDIT_CARD_BANKING_URL.B]: b,
      [CREDIT_CARD_BANKING_URL.R]: r,
      [CREDIT_CARD_BANKING_URL.T]: t,
      [CREDIT_CARD_BANKING_URL.M]: m,
      [CREDIT_CARD_BANKING_URL.F]: f,
    }),
    [a, b, r, t, m, f],
  );

  useLoanUrlSync(shareParams, [a, b, r, t, m, f]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "minPay": {
        const balP = parseNonNegative(a, "Balance");
        const pctP = parseAprPercent(r, "Minimum %");
        const floorP = parseNonNegative(f, "Minimum floor");
        if (!balP.ok) return { error: balP.error };
        if (!pctP.ok) return { error: pctP.error };
        if (!floorP.ok) return { error: floorP.error };
        const computed = minimumPayment({
          balance: balP.value,
          minPercent: pctP.value,
          minFloor: floorP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.minimumDue),
          primaryLabel: "Minimum amount due",
          rows: [
            { label: "Balance", value: fmt(balP.value) },
            { label: "Minimum rule", value: `${pctP.value}% (floor ${fmt(floorP.value)})` },
            { label: "Minimum due", value: fmt(computed.minimumDue) },
            { label: "% of balance", value: pct(computed.percentOfBalance) },
          ],
        };
      }
      case "payoff": {
        const balP = parsePositive(a, "Balance");
        const aprP = parseAprPercent(r, "APR %");
        const payP = parsePositive(m, "Monthly payment");
        if (!balP.ok) return { error: balP.error };
        if (!aprP.ok) return { error: aprP.error };
        if (!payP.ok) return { error: payP.error };
        const computed = creditCardPayoff({
          balance: balP.value,
          annualRatePercent: aprP.value,
          monthlyPayment: payP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.months} months`,
          primaryLabel: "Payoff time",
          rows: [
            { label: "Balance", value: fmt(balP.value) },
            { label: "Monthly payment", value: fmt(payP.value) },
            { label: "Months to payoff", value: String(computed.months) },
            { label: "Total paid", value: fmt(computed.totalPaid) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
          ],
        };
      }
      case "debtReduction": {
        const balP = parsePositive(a, "Balance");
        const aprP = parseAprPercent(r, "APR %");
        const minPctP = parseAprPercent(t, "Minimum %");
        const extraP = parseNonNegative(m, "Extra monthly");
        if (!balP.ok) return { error: balP.error };
        if (!aprP.ok) return { error: aprP.error };
        if (!minPctP.ok) return { error: minPctP.error };
        if (!extraP.ok) return { error: extraP.error };
        const computed = creditCardDebtReduction({
          balance: balP.value,
          annualRatePercent: aprP.value,
          minPercent: minPctP.value,
          extraMonthly: extraP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.monthsSaved} months saved`,
          primaryLabel: "Time saved with extra payment",
          rows: [
            { label: "Months at minimum", value: String(computed.monthsAtMinimum) },
            { label: "Months with extra", value: String(computed.monthsWithExtra) },
            { label: "Months saved", value: String(computed.monthsSaved) },
            { label: "Interest saved", value: fmt(computed.interestSaved) },
          ],
        };
      }
      case "balanceTransfer": {
        const balP = parsePositive(a, "Balance");
        const curP = parseAprPercent(r, "Current APR %");
        const xferP = parseAprPercent(t, "Transfer APR %");
        const feePctP = parseAprPercent(f, "Transfer fee %");
        const monthsP = parsePositive(m, "Promo months");
        if (!balP.ok) return { error: balP.error };
        if (!curP.ok) return { error: curP.error };
        if (!xferP.ok) return { error: xferP.error };
        if (!feePctP.ok) return { error: feePctP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        const computed = balanceTransferSavings({
          balance: balP.value,
          currentAprPercent: curP.value,
          transferAprPercent: xferP.value,
          transferFeePercent: feePctP.value,
          months: monthsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.netSavings),
          primaryLabel: "Net savings vs staying",
          rows: [
            { label: "Interest if you stay", value: fmt(computed.interestStay) },
            { label: "Interest after transfer", value: fmt(computed.interestTransfer) },
            { label: "Transfer fee", value: fmt(computed.transferFee) },
            { label: "Net savings", value: fmt(computed.netSavings) },
          ],
        };
      }
      case "lateFee": {
        const balP = parseNonNegative(a, "Balance");
        const flatP = parseNonNegative(f, "Flat fee");
        const feePctP = parseAprPercent(t, "Fee % of balance");
        if (!balP.ok) return { error: balP.error };
        if (!flatP.ok) return { error: flatP.error };
        if (!feePctP.ok) return { error: feePctP.error };
        const computed = latePaymentFee({
          balance: balP.value,
          flatFee: flatP.value,
          feePercent: feePctP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.fee),
          primaryLabel: "Estimated late fee",
          rows: [
            { label: "Balance", value: fmt(balP.value) },
            { label: "Flat fee", value: fmt(flatP.value) },
            { label: "Fee % rule", value: pct(feePctP.value) },
            { label: "Fee charged", value: fmt(computed.fee) },
          ],
        };
      }
      case "interestFree": {
        const stmtP = parsePositive(a, "Statement day");
        const dueP = parsePositive(b, "Due day");
        const purchaseP = parsePositive(m, "Purchase day");
        if (!stmtP.ok) return { error: stmtP.error };
        if (!dueP.ok) return { error: dueP.error };
        if (!purchaseP.ok) return { error: purchaseP.error };
        const computed = interestFreePeriod({
          statementDateDay: stmtP.value,
          dueDateDay: dueP.value,
          purchaseDay: purchaseP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.interestFreeDays} days`,
          primaryLabel: "Estimated interest-free days",
          rows: [
            { label: "Statement day", value: String(stmtP.value) },
            { label: "Due day", value: String(dueP.value) },
            { label: "Purchase day", value: String(purchaseP.value) },
            { label: "Interest-free days", value: String(computed.interestFreeDays) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "rewards": {
        const spendP = parseNonNegative(a, "Monthly spend");
        const ptsP = parseNonNegative(r, "Points per currency unit");
        const valP = parseNonNegative(t, "Point value");
        const monthsP = parsePositive(m, "Months");
        if (!spendP.ok) return { error: spendP.error };
        if (!ptsP.ok) return { error: ptsP.error };
        if (!valP.ok) return { error: valP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        const computed = creditCardRewards({
          monthlySpend: spendP.value,
          pointsPerCurrency: ptsP.value,
          pointValue: valP.value,
          months: monthsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.rewardsValue),
          primaryLabel: "Rewards value",
          rows: [
            { label: "Total points", value: computed.totalPoints.toLocaleString() },
            { label: "Rewards value", value: fmt(computed.rewardsValue) },
            { label: "Period", value: `${monthsP.value} months` },
          ],
        };
      }
      case "cashback": {
        const spendP = parseNonNegative(a, "Spend");
        const cbP = parseAprPercent(r, "Cashback %");
        const capRaw = f.trim();
        const capP = capRaw === "" ? { ok: true as const, value: undefined } : parseNonNegative(f, "Cap");
        if (!spendP.ok) return { error: spendP.error };
        if (!cbP.ok) return { error: cbP.error };
        if (!capP.ok) return { error: capP.error };
        const computed = cashbackCalc({
          spend: spendP.value,
          cashbackPercent: cbP.value,
          cap: capP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.cashback),
          primaryLabel: "Cashback earned",
          rows: [
            { label: "Spend", value: fmt(spendP.value) },
            { label: "Cashback rate", value: pct(cbP.value) },
            { label: "Cashback", value: fmt(computed.cashback) },
            { label: "Effective rate", value: pct(computed.effectivePercent) },
          ],
        };
      }
      case "annualFee": {
        const rewardsP = parseNonNegative(a, "Annual rewards value");
        const otherP = parseNonNegative(b, "Other benefits value");
        const feeP = parseNonNegative(f, "Annual fee");
        if (!rewardsP.ok) return { error: rewardsP.error };
        if (!otherP.ok) return { error: otherP.error };
        if (!feeP.ok) return { error: feeP.error };
        const computed = annualFeeValue({
          annualFee: feeP.value,
          annualRewardsValue: rewardsP.value,
          otherBenefitsValue: otherP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.breakEven ? "Worth it" : fmt(computed.netCost),
          primaryLabel: computed.breakEven ? "Verdict" : "Net cost after benefits",
          rows: [
            { label: "Annual fee", value: fmt(feeP.value) },
            { label: "Rewards + benefits", value: fmt(rewardsP.value + otherP.value) },
            { label: "Net cost", value: fmt(computed.netCost) },
            { label: "Value multiple", value: `${computed.valueMultiple.toFixed(2)}×` },
            { label: "Break even?", value: computed.breakEven ? "Yes" : "No" },
          ],
        };
      }
      case "revolving": {
        const balP = parsePositive(a, "Balance");
        const aprP = parseAprPercent(r, "APR %");
        const monthsP = parsePositive(m, "Months revolving");
        if (!balP.ok) return { error: balP.error };
        if (!aprP.ok) return { error: aprP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        const computed = revolvingCreditCost({
          balance: balP.value,
          annualRatePercent: aprP.value,
          months: monthsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.interestCost),
          primaryLabel: "Interest cost",
          rows: [
            { label: "Balance", value: fmt(balP.value) },
            { label: "Interest cost", value: fmt(computed.interestCost) },
            { label: "Balance if interest-only", value: fmt(computed.endingBalanceIfInterestOnly) },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, t, m, f, fmt]);

  const showCurrency = config.mode !== "interestFree";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showCurrency ? (
            <div>
              <FieldLabel htmlFor="ccb-currency">Currency</FieldLabel>
              <select
                id="ccb-currency"
                className={selectCls}
                value={currency}
                onChange={(ev) => setCurrency(ev.target.value as CreditCardBankingCurrencyCode)}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {config.mode === "minPay" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-bal">Outstanding balance</FieldLabel>
                <FieldInput id="ccb-bal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-minpct">Minimum due %</FieldLabel>
                <FieldInput id="ccb-minpct" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-floor">Minimum floor amount</FieldLabel>
                <FieldInput id="ccb-floor" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "payoff" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-pbal">Balance</FieldLabel>
                <FieldInput id="ccb-pbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-apr">APR %</FieldLabel>
                <FieldInput id="ccb-apr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-pay">Monthly payment</FieldLabel>
                <FieldInput id="ccb-pay" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "debtReduction" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-dbal">Balance</FieldLabel>
                <FieldInput id="ccb-dbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-dapr">APR %</FieldLabel>
                <FieldInput id="ccb-dapr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-dmin">Minimum due %</FieldLabel>
                <FieldInput id="ccb-dmin" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-extra">Extra monthly payment</FieldLabel>
                <FieldInput id="ccb-extra" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "balanceTransfer" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-btbal">Balance to transfer</FieldLabel>
                <FieldInput id="ccb-btbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-curapr">Current APR %</FieldLabel>
                <FieldInput id="ccb-curapr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-xapr">Transfer APR %</FieldLabel>
                <FieldInput id="ccb-xapr" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-fee">Transfer fee %</FieldLabel>
                <FieldInput id="ccb-fee" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-promo">Promotional months</FieldLabel>
                <FieldInput id="ccb-promo" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "lateFee" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-lbal">Balance</FieldLabel>
                <FieldInput id="ccb-lbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-flat">Flat late fee</FieldLabel>
                <FieldInput id="ccb-flat" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-fpct">Late fee % of balance</FieldLabel>
                <FieldInput id="ccb-fpct" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "interestFree" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-stmt">Statement date (day of month)</FieldLabel>
                <FieldInput id="ccb-stmt" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-due">Payment due date (day of month)</FieldLabel>
                <FieldInput id="ccb-due" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-purch">Purchase date (day of month)</FieldLabel>
                <FieldInput id="ccb-purch" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rewards" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-spend">Monthly spend</FieldLabel>
                <FieldInput id="ccb-spend" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-pts">Points per ₹1 spent</FieldLabel>
                <FieldInput id="ccb-pts" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-pval">Value per point</FieldLabel>
                <FieldInput id="ccb-pval" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-mon">Months</FieldLabel>
                <FieldInput id="ccb-mon" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cashback" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-cspend">Spend amount</FieldLabel>
                <FieldInput id="ccb-cspend" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-cb">Cashback %</FieldLabel>
                <FieldInput id="ccb-cb" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-cap">Cashback cap (optional)</FieldLabel>
                <FieldInput id="ccb-cap" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "annualFee" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-rew">Annual rewards value</FieldLabel>
                <FieldInput id="ccb-rew" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-oth">Other benefits value</FieldLabel>
                <FieldInput id="ccb-oth" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-fee">Annual fee</FieldLabel>
                <FieldInput id="ccb-fee" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "revolving" ? (
            <>
              <div>
                <FieldLabel htmlFor="ccb-rbal">Revolving balance</FieldLabel>
                <FieldInput id="ccb-rbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-rapr">APR %</FieldLabel>
                <FieldInput id="ccb-rapr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ccb-rmon">Months revolving</FieldLabel>
                <FieldInput id="ccb-rmon" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
