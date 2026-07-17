"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import type { AdvancedViralBankingCurrencyCode } from "@/lib/calculators/advancedViralBanking";
import {
  ADVANCED_VIRAL_BANKING_URL,
  emergencyFund,
  financialHealthScore,
  formatAdvancedViralBankingMoney,
  interestSavedByPrepayment,
  loanBurden,
} from "@/lib/calculators/advancedViralBanking";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type ViralSlug =
  | "loan-burden-calculator"
  | "interest-saved-by-prepayment-calculator"
  | "emergency-fund-calculator"
  | "financial-health-score-calculator";

type Mode = "burden" | "prepay" | "emergency" | "health";

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
  pDefault: string;
  sDefault: string;
};

const CONFIG: Record<ViralSlug, Config> = {
  "loan-burden-calculator": {
    title: "Loan burden calculator",
    description: "EMI burden as a percentage of monthly income with risk bands.",
    mode: "burden",
    aDefault: "45000",
    bDefault: "120000",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    mDefault: "0",
    pDefault: "0",
    sDefault: "0",
  },
  "interest-saved-by-prepayment-calculator": {
    title: "Interest saved by prepayment calculator",
    description: "Interest saved and closure cost when foreclosing after N EMIs.",
    mode: "prepay",
    aDefault: "2500000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "9",
    tDefault: "36",
    mDefault: "180",
    pDefault: "2",
    sDefault: "0",
  },
  "emergency-fund-calculator": {
    title: "Emergency fund calculator",
    description: "Target fund, shortfall, and months of expenses currently covered.",
    mode: "emergency",
    aDefault: "60000",
    bDefault: "150000",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    mDefault: "6",
    pDefault: "0",
    sDefault: "0",
  },
  "financial-health-score-calculator": {
    title: "Financial health score calculator",
    description: "Composite score from emergency fund, DTI, savings, and investment rates.",
    mode: "health",
    aDefault: "4",
    bDefault: "15",
    cDefault: "10",
    rDefault: "35",
    tDefault: "0",
    mDefault: "0",
    pDefault: "0",
    sDefault: "0",
  },
};

const CURRENCIES: AdvancedViralBankingCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function AdvancedViralBankingCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ViralSlug] ?? CONFIG["loan-burden-calculator"];
  const [currency, setCurrency] = useState<AdvancedViralBankingCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.M, config.mDefault));
  const [p, setP] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.P, config.pDefault));
  const [s, setS] = useState(useLoanInitialInput(ADVANCED_VIRAL_BANKING_URL.S, config.sDefault));

  const fmt = useCallback((n: number) => formatAdvancedViralBankingMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [ADVANCED_VIRAL_BANKING_URL.A]: a,
      [ADVANCED_VIRAL_BANKING_URL.B]: b,
      [ADVANCED_VIRAL_BANKING_URL.C]: c,
      [ADVANCED_VIRAL_BANKING_URL.R]: r,
      [ADVANCED_VIRAL_BANKING_URL.T]: t,
      [ADVANCED_VIRAL_BANKING_URL.M]: m,
      [ADVANCED_VIRAL_BANKING_URL.P]: p,
      [ADVANCED_VIRAL_BANKING_URL.S]: s,
    }),
    [a, b, c, r, t, m, p, s],
  );

  useLoanUrlSync(shareParams, [a, b, c, r, t, m, p, s]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "burden": {
        const emiP = parseNonNegative(a, "Monthly EMI");
        const incomeP = parsePositive(b, "Monthly income");
        if (!emiP.ok) return { error: emiP.error };
        if (!incomeP.ok) return { error: incomeP.error };
        const computed = loanBurden({
          monthlyEmi: emiP.value,
          monthlyIncome: incomeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.burdenPercent),
          primaryLabel: "EMI burden",
          rows: [
            { label: "Total EMI", value: fmt(emiP.value) },
            { label: "Monthly income", value: fmt(incomeP.value) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "prepay": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Annual rate %");
        const termP = parsePositive(m, "Term (months)");
        const closeP = parsePositive(t, "Closure after month");
        const feeP = parseNonNegative(p, "Foreclosure fee %");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        if (!closeP.ok) return { error: closeP.error };
        if (!feeP.ok) return { error: feeP.error };
        const computed = interestSavedByPrepayment({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
          closureMonth: closeP.value,
          feePercent: feeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.interestSavedVsFullTerm),
          primaryLabel: "Interest saved vs full term",
          rows: [
            { label: "Outstanding at closure", value: fmt(computed.outstanding) },
            { label: "Foreclosure fee", value: fmt(computed.fee) },
            { label: "Total to close", value: fmt(computed.totalToClose) },
            { label: "Interest paid to date", value: fmt(computed.interestPaidToDate) },
          ],
        };
      }
      case "emergency": {
        const expP = parsePositive(a, "Monthly expenses");
        const monthsP = parsePositive(m, "Months desired");
        const savP = parseNonNegative(b, "Current savings");
        if (!expP.ok) return { error: expP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        if (!savP.ok) return { error: savP.error };
        const computed = emergencyFund({
          monthlyExpenses: expP.value,
          monthsDesired: monthsP.value,
          currentSavings: savP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.target),
          primaryLabel: "Emergency fund target",
          rows: [
            { label: "Shortfall", value: fmt(computed.shortfall) },
            { label: "Months covered now", value: computed.monthsCoveredNow.toFixed(1) },
          ],
        };
      }
      case "health": {
        const emergP = parseNonNegative(a, "Emergency months");
        const dtiP = parseAprPercent(r, "DTI %");
        const savRateP = parseAprPercent(b, "Savings rate %");
        const invRateP = parseAprPercent(c, "Investment rate %");
        if (!emergP.ok) return { error: emergP.error };
        if (!dtiP.ok) return { error: dtiP.error };
        if (!savRateP.ok) return { error: savRateP.error };
        if (!invRateP.ok) return { error: invRateP.error };
        const computed = financialHealthScore({
          emergencyMonths: emergP.value,
          dtiPercent: dtiP.value,
          savingsRatePercent: savRateP.value,
          investmentRatePercent: invRateP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: `Health score (${computed.band})`,
          rows: computed.tips.map((tip, i) => ({ label: `Tip ${i + 1}`, value: tip })),
        };
      }
    }
  }, [config.mode, a, b, c, r, t, m, p, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="avb-currency">Currency</FieldLabel>
            <select
              id="avb-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as AdvancedViralBankingCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "burden" ? (
            <>
              <div>
                <FieldLabel htmlFor="avb-emi">Total monthly EMI</FieldLabel>
                <FieldInput id="avb-emi" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-inc">Monthly income</FieldLabel>
                <FieldInput id="avb-inc" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "prepay" ? (
            <>
              <div>
                <FieldLabel htmlFor="avb-prin">Loan principal</FieldLabel>
                <FieldInput id="avb-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-rate">Annual rate %</FieldLabel>
                <FieldInput id="avb-rate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-term">Term (months)</FieldLabel>
                <FieldInput id="avb-term" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-close">Close after month #</FieldLabel>
                <FieldInput id="avb-close" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-fee">Foreclosure fee %</FieldLabel>
                <FieldInput id="avb-fee" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "emergency" ? (
            <>
              <div>
                <FieldLabel htmlFor="avb-exp">Monthly expenses</FieldLabel>
                <FieldInput id="avb-exp" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-months">Months to cover</FieldLabel>
                <FieldInput id="avb-months" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-sav">Current savings</FieldLabel>
                <FieldInput id="avb-sav" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "health" ? (
            <>
              <div>
                <FieldLabel htmlFor="avb-em">Emergency fund (months)</FieldLabel>
                <FieldInput id="avb-em" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-dti">Debt-to-income %</FieldLabel>
                <FieldInput id="avb-dti" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-srate">Savings rate % of income</FieldLabel>
                <FieldInput id="avb-srate" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="avb-irate">Investment rate % of income</FieldLabel>
                <FieldInput id="avb-irate" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
