"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel } from "@/components/fields";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import { monthlyLoanPayment } from "@/lib/calculators/loanPayment";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function LoanPaymentCalculator() {
  const [principal, setPrincipal] = useState("25000");
  const [apr, setApr] = useState("6.5");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    return monthlyLoanPayment({
      principal: Number(principal),
      annualRatePercent: Number(apr),
      termYears: Number(years),
    });
  }, [principal, apr, years]);

  const p = Number(principal);
  const r = Number(apr);
  const y = Number(years);
  const showChart = !("error" in result) && p > 0 && r >= 0 && y > 0;

  return (
    <CalculatorShell
      title="Loan payment"
      description="Fixed-rate amortizing loan: estimated monthly payment, total paid, and total interest."
      resultKey={`${principal}-${apr}-${years}`}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">Monthly payment</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                {fmtMoney(result.payment)}
              </p>
            </div>
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Total paid</span>
                <span className="font-mono text-[var(--text)]">{fmtMoney(result.totalPaid)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Total interest</span>
                <span className="font-mono text-[var(--text)]">{fmtMoney(result.totalInterest)}</span>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="p">Principal</FieldLabel>
          <FieldInput
            id="p"
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="apr">APR %</FieldLabel>
          <FieldInput
            id="apr"
            inputMode="decimal"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="y">Term (years)</FieldLabel>
          <FieldInput
            id="y"
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
      {showChart ? <UserLoanBalanceMini principal={p} apr={r} years={y} /> : null}
    </CalculatorShell>
  );
}
