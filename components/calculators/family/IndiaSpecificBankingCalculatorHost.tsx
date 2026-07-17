"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import type { IndiaSpecificBankingCurrencyCode } from "@/lib/calculators/indiaSpecificBanking";
import {
  INDIA_FD_BANK_RATES,
  INDIA_SPECIFIC_BANKING_URL,
  bankInterestComparison,
  creditCardInterestIndia,
  fdIndiaBankWise,
  formatIndiaSpecificBankingMoney,
  loanEmiIndia,
  rdIndia,
} from "@/lib/calculators/indiaSpecificBanking";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type IndiaSlug =
  | "fd-calculator-india-bank-wise"
  | "rd-calculator-india"
  | "credit-card-interest-india"
  | "loan-emi-calculator-india"
  | "bank-interest-comparison-tool";

type Mode = "fdBank" | "rd" | "ccInterest" | "loanEmi" | "compare";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  yDefault: string;
  mDefault: string;
  fDefault: string;
};

const CONFIG: Record<IndiaSlug, Config> = {
  "fd-calculator-india-bank-wise": {
    title: "FD calculator (India, bank-wise)",
    description: "Fixed deposit maturity by indicative bank rate with quarterly compounding.",
    mode: "fdBank",
    aDefault: "500000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "7",
    yDefault: "3",
    mDefault: "0",
    fDefault: "0",
  },
  "rd-calculator-india": {
    title: "RD calculator (India)",
    description: "Recurring deposit maturity for Indian bank RD products.",
    mode: "rd",
    aDefault: "5000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "6.5",
    yDefault: "1",
    mDefault: "12",
    fDefault: "0",
  },
  "credit-card-interest-india": {
    title: "Credit card interest (India)",
    description: "Payoff time and total interest at your monthly payment.",
    mode: "ccInterest",
    aDefault: "80000",
    bDefault: "8000",
    cDefault: "0",
    rDefault: "42",
    yDefault: "1",
    mDefault: "0",
    fDefault: "0",
  },
  "loan-emi-calculator-india": {
    title: "Loan EMI calculator (India)",
    description: "Reducing-balance EMI for personal, home, or auto loans.",
    mode: "loanEmi",
    aDefault: "1500000",
    bDefault: "0",
    cDefault: "0",
    rDefault: "10.5",
    yDefault: "1",
    mDefault: "60",
    fDefault: "0",
  },
  "bank-interest-comparison-tool": {
    title: "Bank interest comparison tool",
    description: "Compare FD maturity across up to three bank rate quotes.",
    mode: "compare",
    aDefault: "1000000",
    bDefault: "6.8",
    cDefault: "7.0",
    rDefault: "7.2",
    yDefault: "3",
    mDefault: "0",
    fDefault: "0",
  },
};

const CURRENCIES: IndiaSpecificBankingCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function IndiaSpecificBankingCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as IndiaSlug] ?? CONFIG["fd-calculator-india-bank-wise"];
  const [currency, setCurrency] = useState<IndiaSpecificBankingCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.R, config.rDefault));
  const [y, setY] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.Y, config.yDefault));
  const [m, setM] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.M, config.mDefault));
  const [f, setF] = useState(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.F, config.fDefault));
  const initialBankIdx = parseInt(useLoanInitialInput(INDIA_SPECIFIC_BANKING_URL.F, config.fDefault), 10);
  const [bankIdx, setBankIdx] = useState(
    Number.isFinite(initialBankIdx) && initialBankIdx >= 0 && initialBankIdx < INDIA_FD_BANK_RATES.length
      ? initialBankIdx
      : 0,
  );

  const fmt = useCallback((n: number) => formatIndiaSpecificBankingMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [INDIA_SPECIFIC_BANKING_URL.A]: a,
      [INDIA_SPECIFIC_BANKING_URL.B]: b,
      [INDIA_SPECIFIC_BANKING_URL.C]: c,
      [INDIA_SPECIFIC_BANKING_URL.R]: r,
      [INDIA_SPECIFIC_BANKING_URL.Y]: y,
      [INDIA_SPECIFIC_BANKING_URL.M]: m,
    };
    if (config.mode === "fdBank") {
      return { ...base, [INDIA_SPECIFIC_BANKING_URL.F]: String(bankIdx) };
    }
    return { ...base, [INDIA_SPECIFIC_BANKING_URL.F]: f };
  }, [a, b, c, r, y, m, f, bankIdx, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, y, m, f, bankIdx]);

  const selectedBank = INDIA_FD_BANK_RATES[bankIdx] ?? INDIA_FD_BANK_RATES[0]!;

  const result = useMemo(() => {
    switch (config.mode) {
      case "fdBank": {
        const prinP = parsePositive(a, "Principal");
        const yearsP = parsePositive(y, "Years");
        const customRateP = parseAprPercent(r, "Rate %");
        const rate =
          selectedBank.bank === "Custom" && customRateP.ok
            ? customRateP.value
            : selectedBank.ratePercent;
        if (!prinP.ok) return { error: prinP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = fdIndiaBankWise({
          principal: prinP.value,
          years: yearsP.value,
          ratePercent: rate,
          bankLabel: selectedBank.bank,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Maturity value",
          rows: [
            { label: "Bank", value: computed.bankLabel },
            { label: "Rate", value: pct(rate) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
          ],
        };
      }
      case "rd": {
        const depP = parsePositive(a, "Monthly deposit");
        const rateP = parseAprPercent(r, "Annual rate %");
        const monthsP = parsePositive(m, "Months");
        if (!depP.ok) return { error: depP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        const computed = rdIndia({
          monthlyDeposit: depP.value,
          annualRatePercent: rateP.value,
          months: monthsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "RD maturity",
          rows: [
            { label: "Total deposited", value: fmt(computed.totalDeposited) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
          ],
        };
      }
      case "ccInterest": {
        const balP = parsePositive(a, "Balance");
        const payP = parsePositive(b, "Monthly payment");
        const rateP = parseAprPercent(r, "Annual rate %");
        if (!balP.ok) return { error: balP.error };
        if (!payP.ok) return { error: payP.error };
        if (!rateP.ok) return { error: rateP.error };
        const computed = creditCardInterestIndia({
          balance: balP.value,
          annualRatePercent: rateP.value,
          monthlyPayment: payP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.months} mo`,
          primaryLabel: "Months to payoff",
          rows: [
            { label: "Total paid", value: fmt(computed.totalPaid) },
            { label: "Total interest", value: fmt(computed.totalInterest) },
          ],
        };
      }
      case "loanEmi": {
        const prinP = parsePositive(a, "Principal");
        const rateP = parseAprPercent(r, "Annual rate %");
        const termP = parsePositive(m, "Term (months)");
        if (!prinP.ok) return { error: prinP.error };
        if (!rateP.ok) return { error: rateP.error };
        if (!termP.ok) return { error: termP.error };
        const computed = loanEmiIndia({
          principal: prinP.value,
          annualRatePercent: rateP.value,
          termMonths: termP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.payment),
          primaryLabel: "Monthly EMI",
          rows: [
            { label: "Total interest", value: fmt(computed.totalInterest) },
            { label: "Total paid", value: fmt(computed.totalPaid) },
            { label: "Term (months)", value: String(computed.termMonths) },
          ],
        };
      }
      case "compare": {
        const prinP = parsePositive(a, "Principal");
        const yearsP = parsePositive(y, "Years");
        const rateAP = parseAprPercent(r, "Rate A %");
        const rateBP = parseAprPercent(b, "Rate B %");
        const rateCP = parseAprPercent(c, "Rate C %");
        if (!prinP.ok) return { error: prinP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        if (!rateAP.ok) return { error: rateAP.error };
        if (!rateBP.ok) return { error: rateBP.error };
        if (!rateCP.ok) return { error: rateCP.error };
        const computed = bankInterestComparison({
          principal: prinP.value,
          years: yearsP.value,
          rateA: rateAP.value,
          rateB: rateBP.value,
          rateC: rateCP.value,
          labelA: "Bank A",
          labelB: "Bank B",
          labelC: "Bank C",
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.bestLabel,
          primaryLabel: "Best option",
          rows: computed.options.map((opt) => ({
            label: `${opt.label} (${pct(opt.rate)})`,
            value: fmt(opt.maturity),
          })),
        };
      }
    }
  }, [config.mode, a, b, c, r, y, m, selectedBank, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="isb-currency">Currency</FieldLabel>
            <select
              id="isb-currency"
              className={selectCls}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value as IndiaSpecificBankingCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "fdBank" ? (
            <>
              <div>
                <FieldLabel htmlFor="isb-bank">Bank</FieldLabel>
                <select
                  id="isb-bank"
                  className={selectCls}
                  value={bankIdx}
                  onChange={(ev) => setBankIdx(parseInt(ev.target.value, 10))}
                >
                  {INDIA_FD_BANK_RATES.map((row, idx) => (
                    <option key={row.bank} value={idx}>
                      {row.bank} ({row.ratePercent}%)
                    </option>
                  ))}
                </select>
              </div>
              {selectedBank.bank === "Custom" ? (
                <div>
                  <FieldLabel htmlFor="isb-crate">Custom rate %</FieldLabel>
                  <FieldInput id="isb-crate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
                </div>
              ) : null}
              <div>
                <FieldLabel htmlFor="isb-fdprin">Principal</FieldLabel>
                <FieldInput id="isb-fdprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-fdyrs">Years</FieldLabel>
                <FieldInput id="isb-fdyrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rd" ? (
            <>
              <div>
                <FieldLabel htmlFor="isb-rdd">Monthly deposit</FieldLabel>
                <FieldInput id="isb-rdd" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-rdr">Annual rate %</FieldLabel>
                <FieldInput id="isb-rdr" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-rdm">Months</FieldLabel>
                <FieldInput id="isb-rdm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ccInterest" ? (
            <>
              <div>
                <FieldLabel htmlFor="isb-bal">Outstanding balance</FieldLabel>
                <FieldInput id="isb-bal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-ccrate">Annual rate %</FieldLabel>
                <FieldInput id="isb-ccrate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-pay">Monthly payment</FieldLabel>
                <FieldInput id="isb-pay" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "loanEmi" ? (
            <>
              <div>
                <FieldLabel htmlFor="isb-lprin">Loan principal</FieldLabel>
                <FieldInput id="isb-lprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-lrate">Annual rate %</FieldLabel>
                <FieldInput id="isb-lrate" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-lterm">Term (months)</FieldLabel>
                <FieldInput id="isb-lterm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "compare" ? (
            <>
              <div>
                <FieldLabel htmlFor="isb-cprin">Principal</FieldLabel>
                <FieldInput id="isb-cprin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-cyrs">Years</FieldLabel>
                <FieldInput id="isb-cyrs" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-ra">Bank A rate %</FieldLabel>
                <FieldInput id="isb-ra" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-rb">Bank B rate %</FieldLabel>
                <FieldInput id="isb-rb" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="isb-rc">Bank C rate %</FieldLabel>
                <FieldInput id="isb-rc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
