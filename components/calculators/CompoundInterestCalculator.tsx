"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel, FieldSelect } from "@/components/fields";
import { UserCompoundGrowthMini } from "@/components/calculator-content/charts/UserCompoundGrowthMini";
import { compoundFutureValue } from "@/lib/calculators/compoundInterest";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("5000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState("12");

  const result = useMemo(() => {
    return compoundFutureValue({
      principal: Number(principal),
      annualRatePercent: Number(rate),
      years: Number(years),
      compoundsPerYear: Number(freq),
    });
  }, [principal, rate, years, freq]);

  const pv = Number(principal);
  const rt = Number(rate);
  const yr = Number(years);
  const n = Number(freq);
  const showChart = !("error" in result) && pv >= 0 && !Number.isNaN(yr) && yr > 0 && n >= 1;

  return (
    <CalculatorShell
      title="Compound interest"
      description="Future value assumes a fixed nominal annual rate and regular compounding."
      resultKey={`${principal}-${rate}-${years}-${freq}`}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">Future value</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                {fmtMoney(result.futureValue)}
              </p>
            </div>
            <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-4">
              <span className="text-[var(--muted)]">Interest earned</span>
              <span className="font-mono text-[var(--text)]">{fmtMoney(result.interestEarned)}</span>
            </div>
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="pv">Principal</FieldLabel>
          <FieldInput
            id="pv"
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="r">Annual rate %</FieldLabel>
          <FieldInput
            id="r"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="t">Years</FieldLabel>
          <FieldInput
            id="t"
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="f">Compound</FieldLabel>
          <FieldSelect
            id="f"
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            className="mt-2"
          >
            <option value="1">Annually</option>
            <option value="2">Semi-annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </FieldSelect>
        </div>
      </div>
      {showChart ? (
        <UserCompoundGrowthMini
          principal={pv}
          annualRatePercent={rt}
          years={yr}
          compoundsPerYear={n}
        />
      ) : null}
    </CalculatorShell>
  );
}
