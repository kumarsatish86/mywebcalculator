"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurAdvanced,
  type CurAdvancedInput,
  type CurAdvancedResult,
  type CurAdvancedSlug,
} from "@/lib/calculators/curAdvanced";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "multi" | "bulk" | "reverse" | "compare" | "fees" | "historical";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  nDefault: string;
  pDefault: string;
};

const EMPTY = {
  aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "", pDefault: "",
};

const DISCLAIMER =
  "Teaching FX estimate only — illustrative rates and fees, not live market data.";

const CONFIG: Record<CurAdvancedSlug, Config> = {
  "cur-multi-currency-converter": {
    title: "Multi-currency converter",
    description: `One amount × three illustrative rates. ${DISCLAIMER}`,
    mode: "multi",
    ...EMPTY, aDefault: "100", rDefault: "83", bDefault: "0.92", cDefault: "1.08",
  },
  "cur-bulk-currency-converter-csv": {
    title: "Bulk currency converter",
    description: `Rows × amount × rate (CSV teaching proxy). ${DISCLAIMER}`,
    mode: "bulk",
    ...EMPTY, aDefault: "50", rDefault: "83", nDefault: "10",
  },
  "cur-reverse-currency-calculator": {
    title: "Reverse currency calculator",
    description: `Source needed = target ÷ rate. ${DISCLAIMER}`,
    mode: "reverse",
    ...EMPTY, aDefault: "8300", rDefault: "83",
  },
  "cur-currency-rate-comparison-tool": {
    title: "Currency rate comparison",
    description: `Compare two illustrative quotes for the same amount. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "1000", rDefault: "82.5", bDefault: "83.2",
  },
  "cur-currency-conversion-with-fees": {
    title: "Conversion with fees",
    description: `Net after % and fixed fee, then × rate. ${DISCLAIMER}`,
    mode: "fees",
    ...EMPTY, aDefault: "1000", rDefault: "83", pDefault: "1.5", cDefault: "5",
  },
  "cur-currency-converter-historical-rates": {
    title: "Historical rates converter",
    description: `Amount × entered past illustrative rate. ${DISCLAIMER}`,
    mode: "historical",
    ...EMPTY, aDefault: "100", rDefault: "75",
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

function formatResult(res: CurAdvancedResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.converted !== undefined) rows.push({ label: "Converted A", value: num(res.converted, 4) });
  if (res.convertedB !== undefined) rows.push({ label: "Converted B", value: num(res.convertedB, 4) });
  if (res.convertedC !== undefined) rows.push({ label: "Converted C", value: num(res.convertedC, 4) });
  if (res.sourceNeeded !== undefined) rows.push({ label: "Source needed", value: num(res.sourceNeeded, 4) });
  if (res.betterLabel !== undefined) rows.push({ label: "Better quote", value: res.betterLabel });
  if (res.savings !== undefined) rows.push({ label: "Difference", value: num(res.savings, 4) });
  if (res.effectiveRate !== undefined) rows.push({ label: "Effective rate", value: num(res.effectiveRate, 6) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.sourceNeeded !== undefined ? num(res.sourceNeeded, 4)
    : res.converted !== undefined ? num(res.converted, 4)
    : "—";
  return { primary, primaryLabel: res.sourceNeeded !== undefined ? "Source needed" : "Result", rows };
}

export function CurAdvancedCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurAdvancedSlug;
  const config = CONFIG[key] ?? CONFIG["cur-multi-currency-converter"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CUR_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(CUR_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    put(CUR_URL.A, a); put(CUR_URL.B, b); put(CUR_URL.C, c); put(CUR_URL.R, r); put(CUR_URL.N, n); put(CUR_URL.P, p);
    return out;
  }, [a, b, c, n, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, n, p, r]);

  const result = useMemo(() => {
    const input: CurAdvancedInput = {};
    switch (config.mode) {
      case "multi": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const r1 = parsePositive(r, "Rate A");
        if (!r1.ok) return { error: r1.error };
        input.rate = r1.value;
        const r2 = parsePositive(b, "Rate B");
        if (!r2.ok) return { error: r2.error };
        input.rateB = r2.value;
        const r3 = parsePositive(c, "Rate C");
        if (!r3.ok) return { error: r3.error };
        input.rateC = r3.value;
        break;
      }
      case "bulk": {
        const amt = parsePositive(a, "Per-row amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "Rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const rows = parsePositive(n, "Rows");
        if (!rows.ok) return { error: rows.error };
        input.rows = rows.value;
        break;
      }
      case "reverse":
      case "historical": {
        const amt = parsePositive(a, config.mode === "reverse" ? "Target" : "Amount");
        if (!amt.ok) return { error: amt.error };
        if (config.mode === "reverse") input.target = amt.value;
        else input.amount = amt.value;
        const rate = parsePositive(r, "Rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
      case "compare": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const r1 = parsePositive(r, "Rate A");
        if (!r1.ok) return { error: r1.error };
        input.rate = r1.value;
        const r2 = parsePositive(b, "Rate B");
        if (!r2.ok) return { error: r2.error };
        input.rateB = r2.value;
        break;
      }
      case "fees": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "Rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const feePct = optNonNeg(p, "Fee %");
        if (feePct && typeof feePct === "object") return { error: feePct.error };
        if (typeof feePct === "number") input.feePct = feePct;
        const fixed = optNonNeg(c, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedFee = fixed;
        break;
      }
    }
    return formatResult(
      computeCurAdvanced(key in CONFIG ? key : "cur-multi-currency-converter", input),
      num,
    );
  }, [a, b, c, config.mode, key, n, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "multi" || config.mode === "compare" || config.mode === "fees" || config.mode === "bulk" || config.mode === "historical") ? (
            <div>
              <FieldLabel htmlFor="cur-a">{config.mode === "bulk" ? "Per-row amount" : "Amount"}</FieldLabel>
              <FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "reverse" ? (
            <div>
              <FieldLabel htmlFor="cur-a">Target amount</FieldLabel>
              <FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {(config.mode === "multi" || config.mode === "bulk" || config.mode === "reverse" || config.mode === "compare" || config.mode === "fees" || config.mode === "historical") ? (
            <div>
              <FieldLabel htmlFor="cur-r">{config.mode === "multi" || config.mode === "compare" ? "Rate A" : config.mode === "historical" ? "Historical rate" : "Rate"}</FieldLabel>
              <FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "multi" || config.mode === "compare" ? (
            <div>
              <FieldLabel htmlFor="cur-b">Rate B</FieldLabel>
              <FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "multi" ? (
            <div>
              <FieldLabel htmlFor="cur-c">Rate C</FieldLabel>
              <FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "bulk" ? (
            <div>
              <FieldLabel htmlFor="cur-n">Rows</FieldLabel>
              <FieldInput id="cur-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "fees" ? (
            <>
              <div>
                <FieldLabel htmlFor="cur-p">Fee %</FieldLabel>
                <FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cur-c">Fixed fee</FieldLabel>
                <FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
