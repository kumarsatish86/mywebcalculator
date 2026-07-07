"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { TaxCurrencyCode } from "@/lib/calculators/taxDeduction";
import {
  TAX_DEDUCTION_URL,
  afterTaxSalary,
  effectiveTaxRate,
  formatTaxMoney,
  globalIncomeTax,
  salaryAfterTax,
  taxRefund,
  taxableIncome,
  tdsFromAnnualTax,
  tdsFromRate,
} from "@/lib/calculators/taxDeduction";

type TaxDeductionSlug =
  | "income-tax-calculator-global"
  | "after-tax-salary-calculator"
  | "tax-refund-calculator"
  | "tds-calculator"
  | "taxable-income-calculator"
  | "salary-after-tax-calculator"
  | "effective-tax-rate-calculator";

type TaxMode =
  | "globalIncomeTax"
  | "afterTaxSalary"
  | "taxRefund"
  | "tdsAnnual"
  | "tdsRate"
  | "taxableIncome"
  | "salaryAfterTax"
  | "effectiveRate";

type Config = {
  title: string;
  description: string;
  mode: TaxMode;
  amountLabel: string;
  amountDefault: string;
  showTax?: boolean;
  showDeduction?: boolean;
  showExemptions?: boolean;
  showDeductionAmount?: boolean;
  showTaxPaid?: boolean;
  showTdsMode?: boolean;
  showSecondary?: boolean;
  secondaryLabel?: string;
  secondaryDefault?: string;
};

const CONFIG: Record<TaxDeductionSlug, Config> = {
  "income-tax-calculator-global": {
    title: "Income tax calculator (global)",
    description:
      "Estimate annual income tax from gross income after standard and other deductions using a flat effective rate.",
    mode: "globalIncomeTax",
    amountLabel: "Gross annual income",
    amountDefault: "1200000",
    showExemptions: true,
    showDeductionAmount: true,
    showTax: true,
  },
  "after-tax-salary-calculator": {
    title: "After tax salary calculator",
    description: "Estimate monthly take-home pay from gross salary after tax and other deductions.",
    mode: "afterTaxSalary",
    amountLabel: "Gross salary (monthly)",
    amountDefault: "100000",
    showTax: true,
    showDeduction: true,
  },
  "tax-refund-calculator": {
    title: "Tax refund calculator",
    description: "Compare tax owed with tax already paid to estimate a refund or balance due.",
    mode: "taxRefund",
    amountLabel: "Taxable annual income",
    amountDefault: "800000",
    showTax: true,
    showTaxPaid: true,
  },
  "tds-calculator": {
    title: "TDS calculator",
    description: "Estimate monthly tax deducted at source (TDS) from annual tax or a TDS percentage on gross pay.",
    mode: "tdsAnnual",
    amountLabel: "Annual income",
    amountDefault: "1200000",
    showTdsMode: true,
    showTax: true,
    showSecondary: true,
    secondaryLabel: "Estimated annual tax",
    secondaryDefault: "180000",
  },
  "taxable-income-calculator": {
    title: "Taxable income calculator",
    description: "Subtract exemptions and deductions from gross income to find taxable income.",
    mode: "taxableIncome",
    amountLabel: "Gross income",
    amountDefault: "1200000",
    showExemptions: true,
    showDeductionAmount: true,
  },
  "salary-after-tax-calculator": {
    title: "Salary after tax calculator",
    description: "Convert annual gross salary into net annual and monthly pay after tax and deductions.",
    mode: "salaryAfterTax",
    amountLabel: "Gross annual salary",
    amountDefault: "1200000",
    showTax: true,
    showDeduction: true,
  },
  "effective-tax-rate-calculator": {
    title: "Effective tax rate calculator",
    description: "Find your effective tax rate from gross income and total tax paid.",
    mode: "effectiveRate",
    amountLabel: "Gross income",
    amountDefault: "1000000",
    showTaxPaid: true,
  },
};

const CURRENCIES: TaxCurrencyCode[] = ["INR", "USD", "EUR", "GBP"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function TaxDeductionCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as TaxDeductionSlug] ?? CONFIG["income-tax-calculator-global"];
  const [currency, setCurrency] = useState<TaxCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(TAX_DEDUCTION_URL.A, config.amountDefault));
  const [taxPct, setTaxPct] = useState(useLoanInitialInput(TAX_DEDUCTION_URL.T, "20"));
  const [deductionPct, setDeductionPct] = useState(useLoanInitialInput(TAX_DEDUCTION_URL.D, "5"));
  const [exemptions, setExemptions] = useState(useLoanInitialInput(TAX_DEDUCTION_URL.E, "75000"));
  const [deductionAmount, setDeductionAmount] = useState(useLoanInitialInput(TAX_DEDUCTION_URL.X, "150000"));
  const [taxPaid, setTaxPaid] = useState(useLoanInitialInput(TAX_DEDUCTION_URL.P, "200000"));
  const [secondary, setSecondary] = useState(
    useLoanInitialInput(TAX_DEDUCTION_URL.M, config.secondaryDefault ?? "180000"),
  );
  const [tdsMode, setTdsMode] = useState<"annual" | "rate">(
    useLoanInitialInput(TAX_DEDUCTION_URL.MD, "annual") === "rate" ? "rate" : "annual",
  );

  const fmt = useCallback((n: number) => formatTaxMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [TAX_DEDUCTION_URL.A]: amount,
      [TAX_DEDUCTION_URL.T]: taxPct,
      [TAX_DEDUCTION_URL.D]: deductionPct,
      [TAX_DEDUCTION_URL.MD]: tdsMode,
      [TAX_DEDUCTION_URL.E]: exemptions,
      [TAX_DEDUCTION_URL.X]: deductionAmount,
      [TAX_DEDUCTION_URL.P]: taxPaid,
      [TAX_DEDUCTION_URL.M]: secondary,
    }),
    [amount, taxPct, deductionPct, exemptions, deductionAmount, taxPaid, secondary, tdsMode, config.showTdsMode],
  );

  useLoanUrlSync(shareParams, [amount, taxPct, deductionPct, exemptions, deductionAmount, taxPaid, secondary, tdsMode]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "globalIncomeTax": {
        const tax = parseAprPercent(taxPct, "Tax rate");
        const stdDed = parseNonNegative(exemptions, "Standard deduction");
        const otherDed = parseNonNegative(deductionAmount, "Other deductions");
        if (!tax.ok) return { error: tax.error };
        if (!stdDed.ok) return { error: stdDed.error };
        if (!otherDed.ok) return { error: otherDed.error };
        const computed = globalIncomeTax({
          grossAnnual: amountParsed.value,
          standardDeduction: stdDed.value,
          otherDeductions: otherDed.value,
          taxPercent: tax.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.taxAmount),
          primaryLabel: "Income tax",
          rows: [
            { label: "Gross annual income", value: fmt(computed.grossAnnual) },
            { label: "Standard deduction", value: fmt(computed.standardDeduction) },
            { label: "Other deductions", value: fmt(computed.otherDeductions) },
            { label: "Taxable income", value: fmt(computed.taxable) },
            { label: "Income tax", value: fmt(computed.taxAmount) },
            { label: "Net after tax", value: fmt(computed.net) },
            { label: "Effective rate on taxable", value: `${computed.effectiveRate.toFixed(1)}%` },
          ],
        };
      }
      case "afterTaxSalary": {
        const tax = parseAprPercent(taxPct, "Tax");
        const ded = parseAprPercent(deductionPct, "Deductions");
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        const breakdown = afterTaxSalary({
          grossMonthly: amountParsed.value,
          taxPercent: tax.value,
          deductionPercent: ded.value,
        });
        return {
          primary: fmt(breakdown.net),
          primaryLabel: "After-tax salary (monthly)",
          rows: [
            { label: "Gross monthly", value: fmt(breakdown.gross) },
            { label: "Tax", value: fmt(breakdown.taxAmount) },
            { label: "Other deductions", value: fmt(breakdown.deductionAmount) },
            { label: "After-tax monthly", value: fmt(breakdown.net) },
            { label: "After-tax annual", value: fmt(breakdown.annualNet) },
          ],
        };
      }
      case "taxRefund": {
        const tax = parseAprPercent(taxPct, "Tax rate");
        const paid = parseNonNegative(taxPaid, "Tax already paid");
        if (!tax.ok) return { error: tax.error };
        if (!paid.ok) return { error: paid.error };
        const computed = taxRefund({
          taxableIncome: amountParsed.value,
          taxPercent: tax.value,
          taxPaid: paid.value,
        });
        const primaryLabel = computed.refund > 0 ? "Estimated refund" : "Balance due";
        const primaryValue = computed.refund > 0 ? fmt(computed.refund) : fmt(computed.balanceDue);
        return {
          primary: primaryValue,
          primaryLabel,
          rows: [
            { label: "Taxable income", value: fmt(amountParsed.value) },
            { label: "Tax owed", value: fmt(computed.taxOwed) },
            { label: "Tax already paid", value: fmt(computed.taxPaid) },
            { label: "Refund", value: fmt(computed.refund) },
            { label: "Balance due", value: fmt(computed.balanceDue) },
          ],
        };
      }
      case "tdsAnnual":
      case "tdsRate": {
        if (tdsMode === "annual") {
          const annualTax = parseNonNegative(secondary, "Estimated annual tax");
          if (!annualTax.ok) return { error: annualTax.error };
          const computed = tdsFromAnnualTax({
            annualIncome: amountParsed.value,
            estimatedAnnualTax: annualTax.value,
          });
          return {
            primary: fmt(computed.monthlyTds),
            primaryLabel: "Monthly TDS",
            rows: [
              { label: "Annual income", value: fmt(computed.annualIncome) },
              { label: "Estimated annual tax", value: fmt(computed.estimatedAnnualTax) },
              { label: "Monthly TDS", value: fmt(computed.monthlyTds) },
              { label: "Effective TDS rate", value: `${computed.effectiveTdsRate.toFixed(2)}%` },
            ],
          };
        }
        const rate = parseAprPercent(taxPct, "TDS rate");
        if (!rate.ok) return { error: rate.error };
        const computed = tdsFromRate({ monthlyGross: amountParsed.value, tdsPercent: rate.value });
        return {
          primary: fmt(computed.monthlyTds),
          primaryLabel: "Monthly TDS",
          rows: [
            { label: "Monthly gross", value: fmt(computed.monthlyGross) },
            { label: "TDS rate", value: `${computed.tdsPercent.toFixed(2)}%` },
            { label: "Monthly TDS", value: fmt(computed.monthlyTds) },
            { label: "Annual TDS", value: fmt(computed.annualTds) },
          ],
        };
      }
      case "taxableIncome": {
        const exempt = parseNonNegative(exemptions, "Exemptions");
        const ded = parseNonNegative(deductionAmount, "Deductions");
        if (!exempt.ok) return { error: exempt.error };
        if (!ded.ok) return { error: ded.error };
        const computed = taxableIncome({
          gross: amountParsed.value,
          exemptions: exempt.value,
          deductions: ded.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.taxable),
          primaryLabel: "Taxable income",
          rows: [
            { label: "Gross income", value: fmt(computed.gross) },
            { label: "Exemptions", value: fmt(computed.exemptions) },
            { label: "Deductions", value: fmt(computed.deductions) },
            { label: "Taxable income", value: fmt(computed.taxable) },
          ],
        };
      }
      case "salaryAfterTax": {
        const tax = parseAprPercent(taxPct, "Tax");
        const ded = parseAprPercent(deductionPct, "Deductions");
        if (!tax.ok) return { error: tax.error };
        if (!ded.ok) return { error: ded.error };
        const computed = salaryAfterTax({
          grossAnnual: amountParsed.value,
          taxPercent: tax.value,
          deductionPercent: ded.value,
        });
        return {
          primary: fmt(computed.netAnnual),
          primaryLabel: "Salary after tax (annual)",
          rows: [
            { label: "Gross annual", value: fmt(computed.grossAnnual) },
            { label: "Tax (annual)", value: fmt(computed.taxAmount) },
            { label: "Other deductions (annual)", value: fmt(computed.deductionAmount) },
            { label: "Net annual", value: fmt(computed.netAnnual) },
            { label: "Net monthly", value: fmt(computed.netMonthly) },
          ],
        };
      }
      case "effectiveRate": {
        const paid = parseNonNegative(taxPaid, "Total tax paid");
        if (!paid.ok) return { error: paid.error };
        const computed = effectiveTaxRate({ grossIncome: amountParsed.value, totalTax: paid.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.effectiveRate.toFixed(2)}%`,
          primaryLabel: "Effective tax rate",
          rows: [
            { label: "Gross income", value: fmt(computed.grossIncome) },
            { label: "Total tax", value: fmt(computed.totalTax) },
            { label: "Net income", value: fmt(computed.netIncome) },
            { label: "Effective tax rate", value: `${computed.effectiveRate.toFixed(2)}%` },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    amount,
    config,
    deductionAmount,
    deductionPct,
    exemptions,
    fmt,
    secondary,
    taxPaid,
    taxPct,
    tdsMode,
  ]);

  const tdsAmountLabel = tdsMode === "annual" ? "Annual income" : "Monthly gross salary";

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
          onChange={(e) => setCurrency(e.target.value as TaxCurrencyCode)}
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
        {config.showTdsMode ? (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="tdsMode">TDS method</FieldLabel>
            <select
              id="tdsMode"
              value={tdsMode}
              onChange={(e) => setTdsMode(e.target.value as "annual" | "rate")}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
            >
              <option value="annual">From estimated annual tax</option>
              <option value="rate">From TDS percentage on monthly gross</option>
            </select>
          </div>
        ) : null}

        <div className={config.showSecondary && tdsMode === "annual" ? "sm:col-span-1" : "sm:col-span-2"}>
          <FieldLabel htmlFor="amount">
            {config.showTdsMode && tdsMode === "rate" ? tdsAmountLabel : config.amountLabel}
          </FieldLabel>
          <FieldInput
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
          />
        </div>

        {config.showSecondary && tdsMode === "annual" ? (
          <div>
            <FieldLabel htmlFor="secondary">{config.secondaryLabel}</FieldLabel>
            <FieldInput
              id="secondary"
              inputMode="decimal"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showExemptions ? (
          <div>
            <FieldLabel htmlFor="exemptions">Exemptions / standard deduction</FieldLabel>
            <FieldInput
              id="exemptions"
              inputMode="decimal"
              value={exemptions}
              onChange={(e) => setExemptions(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showDeductionAmount ? (
          <div>
            <FieldLabel htmlFor="deductionAmount">Other deductions</FieldLabel>
            <FieldInput
              id="deductionAmount"
              inputMode="decimal"
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showTax && !(config.showTdsMode && tdsMode === "rate") ? (
          <div>
            <FieldLabel htmlFor="tax">
              {config.mode === "globalIncomeTax" || config.mode === "taxRefund" ? "Tax rate %" : "Tax %"}
            </FieldLabel>
            <FieldInput
              id="tax"
              inputMode="decimal"
              value={taxPct}
              onChange={(e) => setTaxPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showTdsMode && tdsMode === "rate" ? (
          <div>
            <FieldLabel htmlFor="tax">TDS rate %</FieldLabel>
            <FieldInput
              id="tax"
              inputMode="decimal"
              value={taxPct}
              onChange={(e) => setTaxPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showDeduction ? (
          <div>
            <FieldLabel htmlFor="deduction">Other deductions %</FieldLabel>
            <FieldInput
              id="deduction"
              inputMode="decimal"
              value={deductionPct}
              onChange={(e) => setDeductionPct(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showTaxPaid ? (
          <div>
            <FieldLabel htmlFor="taxPaid">
              {config.mode === "effectiveRate" ? "Total tax paid" : "Tax already paid / withheld"}
            </FieldLabel>
            <FieldInput
              id="taxPaid"
              inputMode="decimal"
              value={taxPaid}
              onChange={(e) => setTaxPaid(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
