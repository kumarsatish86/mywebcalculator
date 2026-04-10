"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel } from "@/components/fields";
import { tipSplit } from "@/lib/calculators/tipSplitter";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function TipSplitterCalculator() {
  const [bill, setBill] = useState("86.40");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("4");

  const result = useMemo(() => {
    return tipSplit({
      bill: Number(bill),
      tipPercent: Number(tipPct),
      people: Math.round(Number(people)),
    });
  }, [bill, tipPct, people]);

  return (
    <CalculatorShell
      title="Tip & split"
      description="Tip is calculated on the pre-tax subtotal you enter. People should be a whole number."
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">Per person</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                {fmtMoney(result.perPerson)}
              </p>
            </div>
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Tip</span>
                <span className="font-mono">{fmtMoney(result.tipAmount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Total with tip</span>
                <span className="font-mono">{fmtMoney(result.total)}</span>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="bill">Bill amount</FieldLabel>
          <FieldInput
            id="bill"
            inputMode="decimal"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="tip">Tip %</FieldLabel>
          <FieldInput
            id="tip"
            inputMode="decimal"
            value={tipPct}
            onChange={(e) => setTipPct(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="ppl">People</FieldLabel>
          <FieldInput
            id="ppl"
            inputMode="numeric"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
