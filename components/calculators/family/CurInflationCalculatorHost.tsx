"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurInflation,
  type CurInflationInput,
  type CurInflationResult,
  type CurInflationSlug,
} from "@/lib/calculators/curInflation";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "inflation" | "purchasing" | "historical" | "col";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  pDefault: string;
  dDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", rDefault: "", pDefault: "", dDefault: "" };

const DISCLAIMER =
  "Inflation teaching estimate only — illustrative rates, not economic forecasts.";

const CONFIG: Record<CurInflationSlug, Config> = {
  "cur-inflation-calculator-currency-value": {
    title: "Inflation (currency value)",
    description: `Future nominal ≈ amount × (1+i)^years. ${DISCLAIMER}`,
    mode: "inflation",
    ...EMPTY, aDefault: "1000", pDefault: "5", dDefault: "10",
  },
  "cur-purchasing-power-calculator": {
    title: "Purchasing power",
    description: `Real value ≈ amount ÷ (1+i)^years. ${DISCLAIMER}`,
    mode: "purchasing",
    ...EMPTY, aDefault: "1000", pDefault: "5", dDefault: "10",
  },
  "cur-historical-currency-value-calculator": {
    title: "Historical currency value",
    description: `Scaled value ≈ amount × (past rate ÷ current rate). ${DISCLAIMER}`,
    mode: "historical",
    ...EMPTY, aDefault: "1000", rDefault: "75", bDefault: "83",
  },
  "cur-cost-of-living-comparison-tool": {
    title: "Cost of living comparison",
    description: `Equivalent income ≈ incomeA × (basketB ÷ basketA). ${DISCLAIMER}`,
    mode: "col",
    ...EMPTY, aDefault: "50000", rDefault: "100", bDefault: "120",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: CurInflationResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.futureValue !== undefined) rows.push({ label: "Future value", value: num(res.futureValue, 2) });
  if (res.realValue !== undefined) rows.push({ label: "Real value", value: num(res.realValue, 2) });
  if (res.historicalValue !== undefined) rows.push({ label: "Historical value", value: num(res.historicalValue, 2) });
  if (res.equivalentIncome !== undefined) rows.push({ label: "Equivalent income", value: num(res.equivalentIncome, 2) });
  if (res.colIndex !== undefined) rows.push({ label: "COL index", value: num(res.colIndex, 3) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.futureValue !== undefined ? num(res.futureValue, 2)
    : res.realValue !== undefined ? num(res.realValue, 2)
    : res.historicalValue !== undefined ? num(res.historicalValue, 2)
    : res.equivalentIncome !== undefined ? num(res.equivalentIncome, 2)
    : "—";
  const primaryLabel =
    res.futureValue !== undefined ? "Future value"
    : res.realValue !== undefined ? "Real value"
    : res.historicalValue !== undefined ? "Historical value"
    : "Equivalent income";
  return { primary, primaryLabel, rows };
}

export function CurInflationCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurInflationSlug;
  const config = CONFIG[key] ?? CONFIG["cur-inflation-calculator-currency-value"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [d, setD] = useState(useLoanInitialInput(CUR_URL.D, config.dDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "inflation":
      case "purchasing":
        put(CUR_URL.A, a); put(CUR_URL.P, p); put(CUR_URL.D, d);
        break;
      case "historical":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
      case "col":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
    }
    return out;
  }, [a, b, config.mode, d, p, r]);

  useLoanUrlSync(shareParams, [a, b, d, p, r]);

  const result = useMemo(() => {
    const input: CurInflationInput = {};
    switch (config.mode) {
      case "inflation":
      case "purchasing": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const infl = optNonNeg(p, "Inflation %");
        if (infl && typeof infl === "object") return { error: infl.error };
        if (typeof infl === "number") input.inflationPct = infl;
        const years = parsePositive(d, "Years");
        if (!years.ok) return { error: years.error };
        input.years = years.value;
        break;
      }
      case "historical": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const oldR = parsePositive(r, "Past rate");
        if (!oldR.ok) return { error: oldR.error };
        input.oldRate = oldR.value;
        const newR = parsePositive(b, "Current rate");
        if (!newR.ok) return { error: newR.error };
        input.newRate = newR.value;
        break;
      }
      case "col": {
        const basketA = parsePositive(r, "Basket A");
        if (!basketA.ok) return { error: basketA.error };
        input.basketA = basketA.value;
        const basketB = parsePositive(b, "Basket B");
        if (!basketB.ok) return { error: basketB.error };
        input.basketB = basketB.value;
        const income = parsePositive(a, "Income in A");
        if (!income.ok) return { error: income.error };
        input.income = income.value;
        break;
      }
    }
    return formatResult(
      computeCurInflation(key in CONFIG ? key : "cur-inflation-calculator-currency-value", input),
      num,
    );
  }, [a, b, config.mode, d, key, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "inflation" || config.mode === "purchasing" || config.mode === "historical") ? (
            <div><FieldLabel htmlFor="cur-a">Amount</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {(config.mode === "inflation" || config.mode === "purchasing") ? (
            <>
              <div><FieldLabel htmlFor="cur-p">Inflation %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Years</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "historical" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Past rate</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Current rate</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "col" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Income in A</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Basket A</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Basket B</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
                {result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
