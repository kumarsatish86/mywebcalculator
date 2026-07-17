"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { BankingChargesCurrencyCode } from "@/lib/calculators/bankingChargesFees";
import {
  BANKING_CHARGES_URL,
  accountMaintenanceFee,
  atmWithdrawalFee,
  bankChargesTotal,
  formatBankingChargesMoney,
  loanProcessingFee,
  overdraftInterest,
  penaltyMinBalanceLate,
} from "@/lib/calculators/bankingChargesFees";

type BankingSlug =
  | "bank-charges-calculator"
  | "atm-withdrawal-fee-calculator"
  | "overdraft-interest-calculator"
  | "penalty-calculator-minimum-balance-late-fee"
  | "account-maintenance-fee-calculator"
  | "loan-processing-fee-calculator";

type Mode =
  | "bankCharges"
  | "atmFee"
  | "overdraft"
  | "penalty"
  | "maintenance"
  | "processing";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  yDefault: string;
  mDefault: string;
  fDefault: string;
};

const CONFIG: Record<BankingSlug, Config> = {
  "bank-charges-calculator": {
    title: "Bank charges calculator",
    description: "Total annual banking fees from monthly, annual, and other yearly charges.",
    mode: "bankCharges",
    aDefault: "500",
    bDefault: "1000",
    cDefault: "2000",
    rDefault: "0",
    tDefault: "0",
    yDefault: "1",
    mDefault: "12",
    fDefault: "0",
  },
  "atm-withdrawal-fee-calculator": {
    title: "ATM withdrawal fee calculator",
    description: "Fees when ATM withdrawals exceed your free monthly limit.",
    mode: "atmFee",
    aDefault: "12",
    bDefault: "5",
    cDefault: "0",
    rDefault: "21",
    tDefault: "0",
    yDefault: "1",
    mDefault: "0",
    fDefault: "0",
  },
  "overdraft-interest-calculator": {
    title: "Overdraft interest calculator",
    description: "Simple interest on overdraft balance for a number of days.",
    mode: "overdraft",
    aDefault: "25000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "18",
    tDefault: "15",
    yDefault: "1",
    mDefault: "0",
    fDefault: "0",
  },
  "penalty-calculator-minimum-balance-late-fee": {
    title: "Penalty calculator — minimum balance & late fee",
    description: "Toggle between minimum-balance shortfall penalty and late-payment fees.",
    mode: "penalty",
    aDefault: "5000",
    bDefault: "500",
    cDefault: "0",
    rDefault: "2",
    tDefault: "10",
    yDefault: "1",
    mDefault: "min-balance",
    fDefault: "0",
  },
  "account-maintenance-fee-calculator": {
    title: "Account maintenance fee calculator",
    description: "Total maintenance fees over a period with optional waiver months.",
    mode: "maintenance",
    aDefault: "500",
    bDefault: "2",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    yDefault: "1",
    mDefault: "12",
    fDefault: "0",
  },
  "loan-processing-fee-calculator": {
    title: "Loan processing fee calculator",
    description: "Processing fee, GST, and net disbursal after deductions.",
    mode: "processing",
    aDefault: "1500000",
    bDefault: "18",
    cDefault: "5000",
    rDefault: "1",
    tDefault: "0",
    yDefault: "1",
    mDefault: "0",
    fDefault: "0",
  },
};

const CURRENCIES: BankingChargesCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function BankingChargesCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BankingSlug] ?? CONFIG["bank-charges-calculator"];
  const [currency, setCurrency] = useState<BankingChargesCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(BANKING_CHARGES_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BANKING_CHARGES_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BANKING_CHARGES_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(BANKING_CHARGES_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(BANKING_CHARGES_URL.T, config.tDefault));
  const [y, setY] = useState(useLoanInitialInput(BANKING_CHARGES_URL.Y, config.yDefault));
  const [m, setM] = useState(useLoanInitialInput(BANKING_CHARGES_URL.M, config.mDefault));
  const [f, setF] = useState(useLoanInitialInput(BANKING_CHARGES_URL.F, config.fDefault));
  const [penaltyMode, setPenaltyMode] = useState<"min-balance" | "late-fee">(
    (useLoanInitialInput(BANKING_CHARGES_URL.M, config.mDefault) as "min-balance" | "late-fee") || "min-balance",
  );

  const fmt = useCallback((n: number) => formatBankingChargesMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [BANKING_CHARGES_URL.A]: a,
      [BANKING_CHARGES_URL.B]: b,
      [BANKING_CHARGES_URL.C]: c,
      [BANKING_CHARGES_URL.R]: r,
      [BANKING_CHARGES_URL.T]: t,
      [BANKING_CHARGES_URL.Y]: y,
      [BANKING_CHARGES_URL.F]: f,
    };
    if (config.mode === "penalty") {
      return { ...base, [BANKING_CHARGES_URL.M]: penaltyMode };
    }
    return { ...base, [BANKING_CHARGES_URL.M]: m };
  }, [a, b, c, r, t, y, m, f, penaltyMode, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, y, m, f, penaltyMode]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "bankCharges": {
        const monthlyP = parseNonNegative(a, "Monthly fee");
        const annualP = parseNonNegative(b, "Annual fee");
        const otherP = parseNonNegative(c, "Other fees / year");
        if (!monthlyP.ok) return { error: monthlyP.error };
        if (!annualP.ok) return { error: annualP.error };
        if (!otherP.ok) return { error: otherP.error };
        const computed = bankChargesTotal({
          monthlyFee: monthlyP.value,
          annualFee: annualP.value,
          otherFeesPerYear: otherP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.annualTotal),
          primaryLabel: "Annual total charges",
          rows: [
            { label: "Monthly fees × 12", value: fmt(monthlyP.value * 12) },
            { label: "Annual fees", value: fmt(annualP.value) },
            { label: "Other yearly fees", value: fmt(otherP.value) },
            { label: "Monthly equivalent", value: fmt(computed.monthlyEquivalent) },
          ],
        };
      }
      case "atmFee": {
        const wdP = parseNonNegative(a, "Withdrawals");
        const freeP = parseNonNegative(b, "Free limit");
        const feeP = parseNonNegative(r, "Fee per extra");
        if (!wdP.ok) return { error: wdP.error };
        if (!freeP.ok) return { error: freeP.error };
        if (!feeP.ok) return { error: feeP.error };
        const computed = atmWithdrawalFee({
          withdrawals: wdP.value,
          freeLimit: freeP.value,
          feePerExtra: feeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalFee),
          primaryLabel: "Total ATM fees",
          rows: [
            { label: "Withdrawals", value: String(wdP.value) },
            { label: "Charged withdrawals", value: String(computed.chargedWithdrawals) },
            { label: "Fee per extra", value: fmt(feeP.value) },
            { label: "Total fee", value: fmt(computed.totalFee) },
          ],
        };
      }
      case "overdraft": {
        const amtP = parseNonNegative(a, "Overdraft amount");
        const rateP = parseAprPercent(r, "Annual rate %");
        const daysP = parsePositive(t, "Days");
        if (!amtP.ok) return { error: amtP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!daysP.ok) return { error: daysP.error };
        const computed = overdraftInterest({
          overdraftAmount: amtP.value,
          annualRatePercent: rateP.value,
          days: daysP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.interest),
          primaryLabel: "Overdraft interest",
          rows: [
            { label: "Overdraft amount", value: fmt(amtP.value) },
            { label: "Annual rate", value: pct(rateP.value) },
            { label: "Days", value: String(daysP.value) },
            { label: "Interest", value: fmt(computed.interest) },
          ],
        };
      }
      case "penalty": {
        if (penaltyMode === "min-balance") {
          const shortP = parseNonNegative(a, "Shortfall");
          const flatP = parseNonNegative(b, "Flat penalty");
          const pctP = parseNonNegative(r, "Penalty % of shortfall");
          if (!shortP.ok) return { error: shortP.error };
          if (!flatP.ok) return { error: flatP.error };
          if (!pctP.ok) return { error: pctP.error };
          const computed = penaltyMinBalanceLate({
            mode: "min-balance",
            shortfall: shortP.value,
            penaltyFlat: flatP.value,
            penaltyPercentOfShortfall: pctP.value,
          });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: fmt(computed.penalty),
            primaryLabel: computed.modeLabel,
            rows: [
              { label: "Shortfall", value: fmt(shortP.value) },
              { label: "Flat penalty", value: fmt(flatP.value) },
              { label: "Penalty %", value: pct(pctP.value) },
              { label: "Applied penalty", value: fmt(computed.penalty) },
            ],
          };
        }
        const lateFlatP = parseNonNegative(b, "Late flat fee");
        const daysP = parseNonNegative(t, "Days late");
        const dailyP = parseNonNegative(r, "Daily late %");
        const balP = parseNonNegative(a, "Balance");
        if (!lateFlatP.ok) return { error: lateFlatP.error };
        if (!daysP.ok) return { error: daysP.error };
        if (!dailyP.ok) return { error: dailyP.error };
        if (!balP.ok) return { error: balP.error };
        const computed = penaltyMinBalanceLate({
          mode: "late-fee",
          lateFlatFee: lateFlatP.value,
          daysLate: daysP.value,
          dailyLatePercent: dailyP.value,
          balance: balP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.penalty),
          primaryLabel: computed.modeLabel,
          rows: [
            { label: "Balance", value: fmt(balP.value) },
            { label: "Late flat fee", value: fmt(lateFlatP.value) },
            { label: "Days late", value: String(daysP.value) },
            { label: "Daily late %", value: pct(dailyP.value) },
            { label: "Total penalty", value: fmt(computed.penalty) },
          ],
        };
      }
      case "maintenance": {
        const feeP = parseNonNegative(a, "Monthly fee");
        const monthsP = parsePositive(m, "Months");
        const waiveP = parseNonNegative(b, "Waiver months");
        if (!feeP.ok) return { error: feeP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        if (!waiveP.ok) return { error: waiveP.error };
        const computed = accountMaintenanceFee({
          monthlyFee: feeP.value,
          months: monthsP.value,
          waivers: waiveP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalFees),
          primaryLabel: "Total maintenance fees",
          rows: [
            { label: "Monthly fee", value: fmt(feeP.value) },
            { label: "Months charged", value: String(computed.monthsCharged) },
            { label: "Waiver months", value: String(waiveP.value) },
            { label: "Total fees", value: fmt(computed.totalFees) },
          ],
        };
      }
      case "processing": {
        const loanP = parsePositive(a, "Loan amount");
        const feePctP = parseAprPercent(r, "Fee %");
        const gstP = parseNonNegative(b, "GST %");
        const flatP = parseNonNegative(c, "Flat fee");
        if (!loanP.ok) return { error: loanP.error };
        if (!feePctP.ok) return { error: feePctP.error };
        if (!gstP.ok) return { error: gstP.error };
        if (!flatP.ok) return { error: flatP.error };
        const computed = loanProcessingFee({
          loanAmount: loanP.value,
          feePercent: feePctP.value,
          gstPercent: gstP.value,
          flatFee: flatP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalFee),
          primaryLabel: "Total processing fee",
          rows: [
            { label: "Base fee", value: fmt(computed.baseFee) },
            { label: "GST", value: fmt(computed.gst) },
            { label: "Total fee", value: fmt(computed.totalFee) },
            { label: "Net disbursal", value: fmt(computed.netDisbursal) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, m, penaltyMode, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="bc-currency">Currency</FieldLabel>
            <select
              id="bc-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as BankingChargesCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "bankCharges" ? (
            <>
              <div>
                <FieldLabel htmlFor="bc-monthly">Monthly fee</FieldLabel>
                <FieldInput id="bc-monthly" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-annual">Annual fee</FieldLabel>
                <FieldInput id="bc-annual" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-other">Other fees per year</FieldLabel>
                <FieldInput id="bc-other" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "atmFee" ? (
            <>
              <div>
                <FieldLabel htmlFor="bc-wd">Withdrawals this period</FieldLabel>
                <FieldInput id="bc-wd" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-free">Free withdrawal limit</FieldLabel>
                <FieldInput id="bc-free" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-atmfee">Fee per extra withdrawal</FieldLabel>
                <FieldInput id="bc-atmfee" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "overdraft" ? (
            <>
              <div>
                <FieldLabel htmlFor="bc-odamt">Overdraft amount</FieldLabel>
                <FieldInput id="bc-odamt" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-odrate">Annual interest rate %</FieldLabel>
                <FieldInput id="bc-odrate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-oddays">Days overdrawn</FieldLabel>
                <FieldInput id="bc-oddays" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "penalty" ? (
            <>
              <div>
                <FieldLabel htmlFor="bc-pmode">Penalty type</FieldLabel>
                <select
                  id="bc-pmode"
                  className={selectCls}
                  value={penaltyMode}
                  onChange={(ev) => setPenaltyMode(ev.target.value as "min-balance" | "late-fee")}
                >
                  <option value="min-balance">Minimum balance</option>
                  <option value="late-fee">Late payment</option>
                </select>
              </div>
              {penaltyMode === "min-balance" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="bc-short">Balance shortfall</FieldLabel>
                    <FieldInput id="bc-short" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bc-pflat">Flat penalty</FieldLabel>
                    <FieldInput id="bc-pflat" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bc-ppct">Penalty % of shortfall</FieldLabel>
                    <FieldInput id="bc-ppct" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FieldLabel htmlFor="bc-lbal">Outstanding balance</FieldLabel>
                    <FieldInput id="bc-lbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bc-lflat">Late flat fee</FieldLabel>
                    <FieldInput id="bc-lflat" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bc-ldays">Days late</FieldLabel>
                    <FieldInput id="bc-ldays" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bc-ldaily">Daily late charge %</FieldLabel>
                    <FieldInput id="bc-ldaily" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              )}
            </>
          ) : null}

          {config.mode === "maintenance" ? (
            <>
              <div>
                <FieldLabel htmlFor="bc-mfee">Monthly maintenance fee</FieldLabel>
                <FieldInput id="bc-mfee" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-mmonths">Months</FieldLabel>
                <FieldInput id="bc-mmonths" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-mwaive">Waiver months</FieldLabel>
                <FieldInput id="bc-mwaive" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "processing" ? (
            <>
              <div>
                <FieldLabel htmlFor="bc-loan">Loan amount</FieldLabel>
                <FieldInput id="bc-loan" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-pfee">Processing fee %</FieldLabel>
                <FieldInput id="bc-pfee" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-gst">GST % on fee</FieldLabel>
                <FieldInput id="bc-gst" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bc-flat">Flat fee (optional)</FieldLabel>
                <FieldInput id="bc-flat" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
