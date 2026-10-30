"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL, ILLUSTRATIVE } from "@/lib/calculators/curHelpers";
import {
  computeCurMicro,
  type CurMicroInput,
  type CurMicroResult,
  type CurMicroSlug,
} from "@/lib/calculators/curMicro";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "convert" | "compare" | "sendAbroad" | "depreciation";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  rDefault: string;
  bDefault: string;
  pDefault: string;
  cDefault: string;
};

const EMPTY = { aDefault: "", rDefault: "", bDefault: "", pDefault: "", cDefault: "" };

const DISCLAIMER =
  "India-focused teaching estimate only — illustrative USD/INR rates, not live quotes.";

const CONFIG: Record<CurMicroSlug, Config> = {
  "cur-usd-to-inr-today-calculator": {
    title: "USD to INR today",
    description: `Illustrative “today” USD→INR (example ${ILLUSTRATIVE.USD_INR}). ${DISCLAIMER}`,
    mode: "convert",
    ...EMPTY, aDefault: "100", rDefault: String(ILLUSTRATIVE.USD_INR),
  },
  "cur-best-exchange-rate-india-calculator": {
    title: "Best exchange rate India",
    description: `Compare two illustrative provider rates. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "1000", rDefault: "82.5", bDefault: "83.2",
  },
  "cur-send-money-abroad-india-calculator": {
    title: "Send money abroad (India)",
    description: `Received = (INR send − fees) × illustrative rate. ${DISCLAIMER}`,
    mode: "sendAbroad",
    ...EMPTY, aDefault: "100000", rDefault: "0.012", pDefault: "1", cDefault: "500",
  },
  "cur-dollar-rate-india-calculator": {
    title: "Dollar rate in India",
    description: `Amount × illustrative USD/INR. ${DISCLAIMER}`,
    mode: "convert",
    ...EMPTY, aDefault: "100", rDefault: String(ILLUSTRATIVE.USD_INR),
  },
  "cur-rupee-depreciation-calculator": {
    title: "Rupee depreciation",
    description: `Depreciation% ≈ (new − old) ÷ old × 100 (USD/INR). ${DISCLAIMER}`,
    mode: "depreciation",
    ...EMPTY, rDefault: "80", bDefault: "83",
  },
  "cur-currency-converter-offline-logic-tool": {
    title: "Offline currency converter",
    description: `Stored illustrative rate — no network needed. ${DISCLAIMER}`,
    mode: "convert",
    ...EMPTY, aDefault: "250", rDefault: String(ILLUSTRATIVE.USD_INR),
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

function formatResult(res: CurMicroResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 2) });
  if (res.rateUsed !== undefined) rows.push({ label: "Rate used", value: num(res.rateUsed, 4) });
  if (res.betterLabel !== undefined) rows.push({ label: "Better", value: res.betterLabel });
  if (res.savings !== undefined) rows.push({ label: "Difference", value: num(res.savings, 2) });
  if (res.received !== undefined) rows.push({ label: "Received", value: num(res.received, 2) });
  if (res.fee !== undefined) rows.push({ label: "Fee", value: num(res.fee, 2) });
  if (res.depreciationPct !== undefined) rows.push({ label: "Depreciation %", value: num(res.depreciationPct, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.converted !== undefined ? num(res.converted, 2)
    : res.received !== undefined ? num(res.received, 2)
    : res.depreciationPct !== undefined ? num(res.depreciationPct, 2)
    : res.savings !== undefined ? num(res.savings, 2)
    : "—";
  const primaryLabel =
    res.converted !== undefined ? "Converted"
    : res.received !== undefined ? "Received"
    : res.depreciationPct !== undefined ? "Depreciation %"
    : "Difference";
  return { primary, primaryLabel, rows };
}

export function CurMicroCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurMicroSlug;
  const config = CONFIG[key] ?? CONFIG["cur-usd-to-inr-today-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [c, setC] = useState(useLoanInitialInput(CUR_URL.C, config.cDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "convert":
        put(CUR_URL.A, a); put(CUR_URL.R, r);
        break;
      case "compare":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
      case "sendAbroad":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.P, p); put(CUR_URL.C, c);
        break;
      case "depreciation":
        put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, p, r]);

  const result = useMemo(() => {
    const input: CurMicroInput = {};
    switch (config.mode) {
      case "convert": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "USD/INR (example)");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
      case "compare": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rateA = parsePositive(r, "Provider A rate");
        if (!rateA.ok) return { error: rateA.error };
        input.rate = rateA.value;
        const rateB = parsePositive(b, "Provider B rate");
        if (!rateB.ok) return { error: rateB.error };
        input.rateB = rateB.value;
        break;
      }
      case "sendAbroad": {
        const amt = parsePositive(a, "Send amount (INR)");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "INR→foreign rate");
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
      case "depreciation": {
        const oldR = parsePositive(r, "Earlier USD/INR");
        if (!oldR.ok) return { error: oldR.error };
        input.oldRate = oldR.value;
        const newR = parsePositive(b, "Later USD/INR");
        if (!newR.ok) return { error: newR.error };
        input.newRate = newR.value;
        break;
      }
    }
    return formatResult(
      computeCurMicro(key in CONFIG ? key : "cur-usd-to-inr-today-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, key, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "convert" || config.mode === "compare" || config.mode === "sendAbroad") ? (
            <div><FieldLabel htmlFor="cur-a">Amount</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {(config.mode === "convert") ? (
            <div><FieldLabel htmlFor="cur-r">USD/INR (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "compare" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Provider A rate</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Provider B rate</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "sendAbroad" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">INR→foreign rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Fee %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-c">Fixed fee</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "depreciation" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Earlier USD/INR</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Later USD/INR</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
