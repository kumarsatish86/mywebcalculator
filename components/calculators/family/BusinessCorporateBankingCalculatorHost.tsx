"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import type { BusinessCorporateBankingCurrencyCode } from "@/lib/calculators/businessCorporateBanking";
import {
  BUSINESS_CORPORATE_BANKING_URL,
  businessCreditLine,
  cashFlowCalc,
  formatBusinessCorporateBankingMoney,
  invoiceFinancing,
  workingCapitalLoan,
} from "@/lib/calculators/businessCorporateBanking";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type BusinessSlug =
  | "working-capital-loan-calculator"
  | "cash-flow-calculator"
  | "business-credit-line-calculator"
  | "invoice-financing-calculator";

type Mode = "wcLoan" | "cashFlow" | "creditLine" | "invoice";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
};

const CONFIG: Record<BusinessSlug, Config> = {
  "working-capital-loan-calculator": {
    title: "Working capital loan calculator",
    description: "EMI and total interest for a working capital term loan.",
    mode: "wcLoan",
    aDefault: "2000000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "12",
    tDefault: "0",
    mDefault: "36",
  },
  "cash-flow-calculator": {
    title: "Cash flow calculator",
    description: "Net cash flow and closing balance from inflows and outflows.",
    mode: "cashFlow",
    aDefault: "500000",
    bDefault: "420000",
    cDefault: "100000",
    rDefault: "0",
    tDefault: "0",
    mDefault: "0",
  },
  "business-credit-line-calculator": {
    title: "Business credit line calculator",
    description: "Utilization, available limit, and interest on drawn amount.",
    mode: "creditLine",
    aDefault: "1000000",
    bDefault: "600000",
    cDefault: "0",
    rDefault: "14",
    tDefault: "30",
    mDefault: "0",
  },
  "invoice-financing-calculator": {
    title: "Invoice financing calculator",
    description: "Advance amount, fees, net received, and effective annualized cost.",
    mode: "invoice",
    aDefault: "800000",
    bDefault: "1.5",
    cDefault: "0",
    rDefault: "80",
    tDefault: "45",
    mDefault: "0",
  },
};

const CURRENCIES: BusinessCorporateBankingCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function BusinessCorporateBankingCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BusinessSlug] ?? CONFIG["working-capital-loan-calculator"];
  const [currency, setCurrency] = useState<BusinessCorporateBankingCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(BUSINESS_CORPORATE_BANKING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BUSINESS_CORPORATE_BANKING_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BUSINESS_CORPORATE_BANKING_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(BUSINESS_CORPORATE_BANKING_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(BUSINESS_CORPORATE_BANKING_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(BUSINESS_CORPORATE_BANKING_URL.M, config.mDefault));

  const fmt = useCallback((n: number) => formatBusinessCorporateBankingMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [BUSINESS_CORPORATE_BANKING_URL.A]: a,
      [BUSINESS_CORPORATE_BANKING_URL.B]: b,
      [BUSINESS_CORPORATE_BANKING_URL.C]: c,
      [BUSINESS_CORPORATE_BANKING_URL.R]: r,
      [BUSINESS_CORPORATE_BANKING_URL.T]: t,
      [BUSINESS_CORPORATE_BANKING_URL.M]: m,
    }),
    [a, b, c, r, t, m],
  );

  useLoanUrlSync(shareParams, [a, b, c, r, t, m]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "wcLoan": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Annual rate %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = workingCapitalLoan({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.payment),
          primaryLabel: "Monthly EMI",
          rows: [
            { label: "Principal", value: fmt(prinP.value) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Total paid", value: fmt(computed.totalPaid) },
            { label: "Term (months)", value: String(computed.termMonths) },
          ],
        };
      }
      case "cashFlow": {
        const inP = parseNonNegative(a, "Inflows");
        const outP = parseNonNegative(b, "Outflows");
        const openP = parseNonNegative(c, "Opening cash");
        if (!inP.ok) return { error: inP.error };
        if (!outP.ok) return { error: outP.error };
        if (!openP.ok) return { error: openP.error };
        const computed = cashFlowCalc({
          inflows: inP.value,
          outflows: outP.value,
          openingCash: openP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.closingCash),
          primaryLabel: "Closing cash",
          rows: [
            { label: "Opening cash", value: fmt(openP.value) },
            { label: "Net cash flow", value: fmt(computed.netCashFlow) },
            { label: "Closing cash", value: fmt(computed.closingCash) },
            { label: "Status", value: computed.status },
          ],
        };
      }
      case "creditLine": {
        const limitP = parsePositive(a, "Credit limit");
        const drawnP = parseNonNegative(b, "Drawn amount");
        const rateP = parseAprPercent(r, "Annual rate %");
        const daysP = parseNonNegative(t, "Days drawn");
        if (!limitP.ok) return { error: limitP.error };
        if (!drawnP.ok) return { error: drawnP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!daysP.ok) return { error: daysP.error };
        const computed = businessCreditLine({
          creditLimit: limitP.value,
          drawnAmount: drawnP.value,
          annualRatePercent: rateP.value,
          daysDrawn: daysP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.available),
          primaryLabel: "Available limit",
          rows: [
            { label: "Utilization", value: pct(computed.utilizationPercent) },
            { label: "Interest estimate", value: fmt(computed.interestEstimate) },
            { label: "Available", value: fmt(computed.available) },
          ],
        };
      }
      case "invoice": {
        const invP = parsePositive(a, "Invoice amount");
        const advP = parseAprPercent(r, "Advance %");
        const feeP = parseAprPercent(b, "Fee % on advance");
        const daysP = parsePositive(t, "Days until payment");
        if (!invP.ok) return { error: invP.error };
        if (!advP.ok) return { error: advP.error };
        if (!feeP.ok) return { error: feeP.error };
        if (!daysP.ok) return { error: daysP.error };
        const computed = invoiceFinancing({
          invoiceAmount: invP.value,
          advancePercent: advP.value,
          feePercent: feeP.value,
          daysUntilPayment: daysP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.netReceived),
          primaryLabel: "Net received",
          rows: [
            { label: "Advance amount", value: fmt(computed.advanceAmount) },
            { label: "Fee", value: fmt(computed.fee) },
            { label: "Net received", value: fmt(computed.netReceived) },
            { label: "Effective annual cost", value: pct(computed.effectiveCostPercent) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, m, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="bcb-currency">Currency</FieldLabel>
            <select
              id="bcb-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as BusinessCorporateBankingCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "wcLoan" ? (
            <>
              <div>
                <FieldLabel htmlFor="bcb-prin">Loan principal</FieldLabel>
                <FieldInput id="bcb-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-rate">Annual rate %</FieldLabel>
                <FieldInput id="bcb-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-term">Term (months)</FieldLabel>
                <FieldInput id="bcb-term" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cashFlow" ? (
            <>
              <div>
                <FieldLabel htmlFor="bcb-in">Cash inflows</FieldLabel>
                <FieldInput id="bcb-in" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-out">Cash outflows</FieldLabel>
                <FieldInput id="bcb-out" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-open">Opening cash</FieldLabel>
                <FieldInput id="bcb-open" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "creditLine" ? (
            <>
              <div>
                <FieldLabel htmlFor="bcb-limit">Credit limit</FieldLabel>
                <FieldInput id="bcb-limit" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-drawn">Drawn amount</FieldLabel>
                <FieldInput id="bcb-drawn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-clrate">Annual rate %</FieldLabel>
                <FieldInput id="bcb-clrate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-days">Days drawn</FieldLabel>
                <FieldInput id="bcb-days" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "invoice" ? (
            <>
              <div>
                <FieldLabel htmlFor="bcb-inv">Invoice amount</FieldLabel>
                <FieldInput id="bcb-inv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-adv">Advance %</FieldLabel>
                <FieldInput id="bcb-adv" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-fee">Fee % on advance</FieldLabel>
                <FieldInput id="bcb-fee" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bcb-idays">Days until customer pays</FieldLabel>
                <FieldInput id="bcb-idays" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
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
