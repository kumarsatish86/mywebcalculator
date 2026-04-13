"use client";

import { FieldLabel, FieldSelect } from "@/components/fields";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";

export function LoanCalculatorChrome() {
  const { currency, setCurrency, termMode, setTermMode } = useLoanCalcPrefs();

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-3 print:hidden">
      <div className="min-w-[140px]">
        <FieldLabel htmlFor="mwc-loan-currency">Currency</FieldLabel>
        <FieldSelect
          id="mwc-loan-currency"
          className="mt-2"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as typeof currency)}
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </FieldSelect>
      </div>
      <div className="min-w-[160px]">
        <FieldLabel htmlFor="mwc-loan-term-mode">Term input</FieldLabel>
        <FieldSelect
          id="mwc-loan-term-mode"
          className="mt-2"
          value={termMode}
          onChange={(e) => setTermMode(e.target.value as "years" | "months")}
        >
          <option value="years">Years (×12 → months, rounded)</option>
          <option value="months">Months (exact count)</option>
        </FieldSelect>
      </div>
      <p className="max-w-md text-xs leading-relaxed text-[var(--muted)]">
        Years are converted with <span className="font-mono">round(years × 12)</span> whole payments. Switch
        to months when you need an exact tenor (e.g. 63 months).
      </p>
    </div>
  );
}
