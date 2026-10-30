"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurTime,
  type CurTimeInput,
  type CurTimeResult,
  type CurTimeSlug,
} from "@/lib/calculators/curTime";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "history" | "trend" | "bestTime" | "volatility";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  rDefault: string;
  bDefault: string;
  hDefault: string;
  lDefault: string;
};

const EMPTY = { aDefault: "", rDefault: "", bDefault: "", hDefault: "", lDefault: "" };

const DISCLAIMER =
  "Time-based FX teaching estimate only — illustrative rate snapshots, not live data.";

const CONFIG: Record<CurTimeSlug, Config> = {
  "cur-currency-rate-history-chart": {
    title: "Currency rate history chart",
    description: `Snapshot from start/end/high/low rates. ${DISCLAIMER}`,
    mode: "history",
    ...EMPTY, rDefault: "80", bDefault: "83", hDefault: "84", lDefault: "79",
  },
  "cur-currency-trend-analyzer": {
    title: "Currency trend analyzer",
    description: `Change% = (end − start) ÷ start × 100. ${DISCLAIMER}`,
    mode: "trend",
    ...EMPTY, rDefault: "80", bDefault: "83",
  },
  "cur-best-time-to-exchange-calculator": {
    title: "Best time to exchange",
    description: `Compare two illustrative rate options. ${DISCLAIMER}`,
    mode: "bestTime",
    ...EMPTY, aDefault: "1000", rDefault: "82", bDefault: "83",
  },
  "cur-currency-volatility-calculator": {
    title: "Currency volatility",
    description: `Range vol% ≈ (high − low) ÷ mid × 100. ${DISCLAIMER}`,
    mode: "volatility",
    ...EMPTY, hDefault: "84", lDefault: "79",
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

function formatResult(res: CurTimeResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.average !== undefined) rows.push({ label: "Average", value: num(res.average, 4) });
  if (res.high !== undefined) rows.push({ label: "High", value: num(res.high, 4) });
  if (res.low !== undefined) rows.push({ label: "Low", value: num(res.low, 4) });
  if (res.changePct !== undefined) rows.push({ label: "Change %", value: num(res.changePct, 2) });
  if (res.betterLabel !== undefined) rows.push({ label: "Better", value: res.betterLabel });
  if (res.savings !== undefined) rows.push({ label: "Difference", value: num(res.savings, 2) });
  if (res.volatilityPct !== undefined) rows.push({ label: "Volatility %", value: num(res.volatilityPct, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.volatilityPct !== undefined ? num(res.volatilityPct, 2)
    : res.changePct !== undefined ? num(res.changePct, 2)
    : res.savings !== undefined ? num(res.savings, 2)
    : res.average !== undefined ? num(res.average, 4)
    : "—";
  const primaryLabel =
    res.volatilityPct !== undefined ? "Volatility %"
    : res.changePct !== undefined ? "Change %"
    : res.savings !== undefined ? "Difference"
    : "Average";
  return { primary, primaryLabel, rows };
}

export function CurTimeCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurTimeSlug;
  const config = CONFIG[key] ?? CONFIG["cur-currency-rate-history-chart"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [h, setH] = useState(useLoanInitialInput(CUR_URL.H, config.hDefault));
  const [l, setL] = useState(useLoanInitialInput(CUR_URL.L, config.lDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "history":
        put(CUR_URL.R, r); put(CUR_URL.B, b); put(CUR_URL.H, h); put(CUR_URL.L, l);
        break;
      case "trend":
        put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
      case "bestTime":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
      case "volatility":
        put(CUR_URL.H, h); put(CUR_URL.L, l);
        break;
    }
    return out;
  }, [a, b, config.mode, h, l, r]);

  useLoanUrlSync(shareParams, [a, b, h, l, r]);

  const result = useMemo(() => {
    const input: CurTimeInput = {};
    switch (config.mode) {
      case "history": {
        const start = parsePositive(r, "Start rate");
        if (!start.ok) return { error: start.error };
        input.startRate = start.value;
        const end = parsePositive(b, "End rate");
        if (!end.ok) return { error: end.error };
        input.endRate = end.value;
        const high = parsePositive(h, "High");
        if (!high.ok) return { error: high.error };
        input.highRate = high.value;
        const low = parsePositive(l, "Low");
        if (!low.ok) return { error: low.error };
        input.lowRate = low.value;
        break;
      }
      case "trend": {
        const start = parsePositive(r, "Start rate");
        if (!start.ok) return { error: start.error };
        input.startRate = start.value;
        const end = parsePositive(b, "End rate");
        if (!end.ok) return { error: end.error };
        input.endRate = end.value;
        break;
      }
      case "bestTime": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rateA = parsePositive(r, "Rate A");
        if (!rateA.ok) return { error: rateA.error };
        input.rateA = rateA.value;
        const rateB = parsePositive(b, "Rate B");
        if (!rateB.ok) return { error: rateB.error };
        input.rateB = rateB.value;
        break;
      }
      case "volatility": {
        const high = parsePositive(h, "High");
        if (!high.ok) return { error: high.error };
        input.highRate = high.value;
        const low = parsePositive(l, "Low");
        if (!low.ok) return { error: low.error };
        input.lowRate = low.value;
        break;
      }
    }
    return formatResult(
      computeCurTime(key in CONFIG ? key : "cur-currency-rate-history-chart", input),
      num,
    );
  }, [a, b, config.mode, h, key, l, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "history" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Start rate</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">End rate</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-h">High</FieldLabel><FieldInput id="cur-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-l">Low</FieldLabel><FieldInput id="cur-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "trend" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Start rate</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">End rate</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bestTime" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Amount</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Rate A (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Rate B (example)</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "volatility" ? (
            <>
              <div><FieldLabel htmlFor="cur-h">High</FieldLabel><FieldInput id="cur-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-l">Low</FieldLabel><FieldInput id="cur-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
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
