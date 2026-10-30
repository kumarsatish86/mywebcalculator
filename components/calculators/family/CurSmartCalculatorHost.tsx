"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurSmart,
  type CurSmartInput,
  type CurSmartResult,
  type CurSmartSlug,
} from "@/lib/calculators/curSmart";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "prediction" | "advisor" | "budget" | "optimizer";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  rDefault: string;
  pDefault: string;
  dDefault: string;
  tDefault: string;
  vDefault: string;
  wDefault: string;
  bDefault: string;
};

const EMPTY = {
  aDefault: "", rDefault: "", pDefault: "", dDefault: "",
  tDefault: "", vDefault: "", wDefault: "", bDefault: "",
};

const DISCLAIMER =
  "Scenario planner only — illustrative rates and heuristics, not predictions or investment advice.";

const CONFIG: Record<CurSmartSlug, Config> = {
  "cur-ai-currency-prediction-tool": {
    title: "AI currency prediction (scenario)",
    description: `Scenario rate = current × (1 + move%). ${DISCLAIMER}`,
    mode: "prediction",
    ...EMPTY, rDefault: "83", pDefault: "2",
  },
  "cur-ai-forex-advisor": {
    title: "AI forex advisor (heuristic)",
    description: `Score = trend − vol/10. ${DISCLAIMER}`,
    mode: "advisor",
    ...EMPTY, tDefault: "2", vDefault: "5",
  },
  "cur-ai-travel-budget-planner": {
    title: "AI travel budget planner",
    description: `Budget = daily × days × FX × (1 + buffer%). ${DISCLAIMER}`,
    mode: "budget",
    ...EMPTY, aDefault: "100", dDefault: "7", rDefault: "0.92", pDefault: "10",
  },
  "cur-ai-investment-currency-optimizer": {
    title: "AI investment currency optimizer",
    description: `Split capital by weights; blended return = Σ(w×r). ${DISCLAIMER}`,
    mode: "optimizer",
    ...EMPTY, aDefault: "10000", rDefault: "5", bDefault: "3", wDefault: "60",
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

function formatResult(res: CurSmartResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.projectedRate !== undefined) rows.push({ label: "Projected rate", value: num(res.projectedRate, 4) });
  if (res.adviceScore !== undefined) rows.push({ label: "Advice score", value: num(res.adviceScore, 2) });
  if (res.advice !== undefined) rows.push({ label: "Advice", value: res.advice });
  if (res.budget !== undefined) rows.push({ label: "Budget", value: num(res.budget, 2) });
  if (res.allocA !== undefined) rows.push({ label: "Allocation A", value: num(res.allocA, 2) });
  if (res.allocB !== undefined) rows.push({ label: "Allocation B", value: num(res.allocB, 2) });
  if (res.blendedReturn !== undefined) rows.push({ label: "Blended return %", value: num(res.blendedReturn, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.projectedRate !== undefined ? num(res.projectedRate, 4)
    : res.budget !== undefined ? num(res.budget, 2)
    : res.adviceScore !== undefined ? num(res.adviceScore, 2)
    : res.blendedReturn !== undefined ? num(res.blendedReturn, 2)
    : "—";
  const primaryLabel =
    res.projectedRate !== undefined ? "Projected rate"
    : res.budget !== undefined ? "Budget"
    : res.adviceScore !== undefined ? "Advice score"
    : "Blended return %";
  return { primary, primaryLabel, rows };
}

export function CurSmartCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurSmartSlug;
  const config = CONFIG[key] ?? CONFIG["cur-ai-currency-prediction-tool"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [d, setD] = useState(useLoanInitialInput(CUR_URL.D, config.dDefault));
  const [t, setT] = useState(useLoanInitialInput(CUR_URL.T, config.tDefault));
  const [v, setV] = useState(useLoanInitialInput(CUR_URL.V, config.vDefault));
  const [w, setW] = useState(useLoanInitialInput(CUR_URL.W, config.wDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "prediction":
        put(CUR_URL.R, r); put(CUR_URL.P, p);
        break;
      case "advisor":
        put(CUR_URL.T, t); put(CUR_URL.V, v);
        break;
      case "budget":
        put(CUR_URL.A, a); put(CUR_URL.D, d); put(CUR_URL.R, r); put(CUR_URL.P, p);
        break;
      case "optimizer":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b); put(CUR_URL.W, w);
        break;
    }
    return out;
  }, [a, b, config.mode, d, p, r, t, v, w]);

  useLoanUrlSync(shareParams, [a, b, d, p, r, t, v, w]);

  const result = useMemo(() => {
    const input: CurSmartInput = {};
    switch (config.mode) {
      case "prediction": {
        const rate = parsePositive(r, "Current rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const move = parseFloat(p);
        if (!Number.isFinite(move)) return { error: "Expected move % must be a number." };
        input.expectedMovePct = move;
        break;
      }
      case "advisor": {
        const trend = parseFloat(t);
        if (!Number.isFinite(trend)) return { error: "Trend score must be a number." };
        input.trendScore = trend;
        const vol = optNonNeg(v, "Volatility");
        if (vol && typeof vol === "object") return { error: vol.error };
        if (typeof vol === "number") input.volatility = vol;
        break;
      }
      case "budget": {
        const daily = parsePositive(a, "Daily spend");
        if (!daily.ok) return { error: daily.error };
        input.daily = daily.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const buffer = optNonNeg(p, "Buffer %");
        if (buffer && typeof buffer === "object") return { error: buffer.error };
        if (typeof buffer === "number") input.bufferPct = buffer;
        break;
      }
      case "optimizer": {
        const amt = parsePositive(a, "Capital");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const ra = parseFloat(r);
        const rb = parseFloat(b);
        if (!Number.isFinite(ra) || !Number.isFinite(rb)) {
          return { error: "Expected returns must be numbers." };
        }
        input.returnA = ra;
        input.returnB = rb;
        const wa = optNonNeg(w, "Weight A %");
        if (wa && typeof wa === "object") return { error: wa.error };
        if (typeof wa === "number") input.weightA = wa;
        break;
      }
    }
    return formatResult(
      computeCurSmart(key in CONFIG ? key : "cur-ai-currency-prediction-tool", input),
      num,
    );
  }, [a, b, config.mode, d, key, p, r, t, v, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "prediction" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Current rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Expected move %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "advisor" ? (
            <>
              <div><FieldLabel htmlFor="cur-t">Trend score</FieldLabel><FieldInput id="cur-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-v">Volatility</FieldLabel><FieldInput id="cur-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "budget" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Daily spend</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Days</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">FX rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Buffer %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "optimizer" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Capital</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Return A %</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Return B %</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-w">Weight A %</FieldLabel><FieldInput id="cur-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
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
