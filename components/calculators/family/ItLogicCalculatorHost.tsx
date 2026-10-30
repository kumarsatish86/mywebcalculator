"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItLogic,
  type ItLogicInput,
  type ItLogicResult,
  type ItLogicSlug,
} from "@/lib/calculators/itLogic";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "bigO" | "loops" | "recursion" | "execTime" | "gate" | "bool" | "truth";

type Config = {
  title: string; description: string; mode: Mode;
  nDefault: string; aDefault: string; bDefault: string; cDefault: string; rDefault: string; sDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItLogicSlug, Config> = {
  "it-time-complexity-calculator": { title: "Time complexity", description: `Operation count proxy. ${DISCLAIMER}`, mode: "bigO", nDefault: "1000", aDefault: "nlogn", bDefault: "", cDefault: "", rDefault: "", sDefault: "" },
  "it-algorithm-complexity-estimator": { title: "Algorithm complexity", description: `Growth at n. ${DISCLAIMER}`, mode: "bigO", nDefault: "100", aDefault: "n2", bDefault: "", cDefault: "", rDefault: "", sDefault: "" },
  "it-big-o-calculator": { title: "Big-O calculator", description: `O(…) operation estimate. ${DISCLAIMER}`, mode: "bigO", nDefault: "100", aDefault: "nlogn", bDefault: "", cDefault: "", rDefault: "", sDefault: "" },
  "it-loop-iteration-calculator": { title: "Loop iterations", description: `Single/nested loop counts. ${DISCLAIMER}`, mode: "loops", nDefault: "100", aDefault: "nested", bDefault: "", cDefault: "", rDefault: "", sDefault: "" },
  "it-recursion-depth-calculator": { title: "Recursion depth", description: `Stack depth teaching value. ${DISCLAIMER}`, mode: "recursion", nDefault: "50", aDefault: "", bDefault: "", cDefault: "", rDefault: "", sDefault: "" },
  "it-code-execution-time-estimator": { title: "Execution time", description: `Time ≈ ops ÷ ops/s. ${DISCLAIMER}`, mode: "execTime", nDefault: "1000000", aDefault: "", bDefault: "", cDefault: "", rDefault: "100000000", sDefault: "" },
  "it-logic-gate-calculator": { title: "Logic gate", description: `AND/OR/XOR/NAND/NOR/NOT. ${DISCLAIMER}`, mode: "gate", nDefault: "", aDefault: "1", bDefault: "0", cDefault: "and", rDefault: "", sDefault: "" },
  "it-boolean-algebra-calculator": { title: "Boolean algebra", description: `Simplified expression eval. ${DISCLAIMER}`, mode: "bool", nDefault: "", aDefault: "1", bDefault: "0", cDefault: "", rDefault: "", sDefault: "A AND B" },
  "it-truth-table-generator": { title: "Truth table", description: `2×2 truth table for gate. ${DISCLAIMER}`, mode: "truth", nDefault: "", aDefault: "", bDefault: "", cDefault: "and", rDefault: "", sDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono whitespace-pre-wrap text-right">{value}</span>
    </div>
  );
}

function formatResult(res: ItLogicResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.bigO) rows.push({ label: "Big-O", value: res.bigO });
  if (res.ops !== undefined) rows.push({ label: "Ops", value: num(res.ops, 0) });
  if (res.seconds !== undefined) rows.push({ label: "Seconds", value: num(res.seconds, 6) });
  if (res.resultBit !== undefined) rows.push({ label: "Output bit", value: String(res.resultBit) });
  if (res.table) rows.push({ label: "Table", value: res.table });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.bigO ?? (res.resultBit !== undefined ? String(res.resultBit)
    : res.ops !== undefined ? num(res.ops, 0)
    : res.seconds !== undefined ? num(res.seconds, 6)
    : res.table?.split("\n")[1] ?? "—");
  const primaryLabel =
    res.bigO ? "Complexity" : res.resultBit !== undefined ? "Result" : res.table ? "Truth table" : "Operations";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItLogicCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItLogicSlug;
  const config = CONFIG[key] ?? CONFIG["it-big-o-calculator"];
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [s, setS] = useState(useLoanInitialInput(IT_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    if (Math.abs(nVal) >= 1e9) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "bigO": case "loops": case "recursion": case "execTime":
        put(IT_URL.N, n);
        if (config.mode === "bigO" || config.mode === "loops") put(IT_URL.A, a);
        if (config.mode === "execTime") put(IT_URL.R, r);
        break;
      case "gate":
        put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.C, c);
        break;
      case "bool":
        put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.S, s);
        break;
      case "truth":
        put(IT_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode, n, r, s]);

  useLoanUrlSync(shareParams, [a, b, c, n, r, s]);

  const result = useMemo(() => {
    const input: ItLogicInput = {};
    switch (config.mode) {
      case "bigO": case "loops": case "recursion": case "execTime": {
        const nVal = parsePositive(n, "n");
        if (!nVal.ok) return { error: nVal.error };
        input.n = nVal.value;
        if (config.mode === "bigO" || config.mode === "loops") input.kind = a.trim() || "nlogn";
        if (config.mode === "execTime" && r.trim() !== "") {
          const ops = parsePositive(r, "Ops/s");
          if (!ops.ok) return { error: ops.error };
          input.opsPerSec = ops.value;
        }
        break;
      }
      case "gate": {
        const aBit = parseFiniteNumber(a, "A");
        const bBit = parseFiniteNumber(b, "B");
        if (!aBit.ok) return { error: aBit.error };
        if (!bBit.ok) return { error: bBit.error };
        input.a = aBit.value ? 1 : 0;
        input.b = bBit.value ? 1 : 0;
        input.gate = c.trim() || "and";
        break;
      }
      case "bool": {
        const aBit = parseFiniteNumber(a, "A");
        const bBit = parseFiniteNumber(b, "B");
        if (!aBit.ok) return { error: aBit.error };
        if (!bBit.ok) return { error: bBit.error };
        input.a = aBit.value ? 1 : 0;
        input.b = bBit.value ? 1 : 0;
        input.expr = s.trim() || "A AND B";
        break;
      }
      case "truth":
        input.gate = c.trim() || "and";
        break;
    }
    return formatResult(computeItLogic(key in CONFIG ? key : "it-big-o-calculator", input), num);
  }, [a, b, c, config.mode, key, n, r, s]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "bigO" || config.mode === "loops" || config.mode === "recursion" || config.mode === "execTime" ? (
            <div><FieldLabel htmlFor="itl-n">n / operations</FieldLabel><FieldInput id="itl-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "bigO" ? (
            <div><FieldLabel htmlFor="itl-a">Kind (1, logn, n, nlogn, n2, n3, 2n)</FieldLabel><FieldInput id="itl-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
          ) : null}
          {config.mode === "loops" ? (
            <div><FieldLabel htmlFor="itl-a">Kind (single, nested, triple)</FieldLabel><FieldInput id="itl-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
          ) : null}
          {config.mode === "execTime" ? (
            <div><FieldLabel htmlFor="itl-r">Ops per second</FieldLabel><FieldInput id="itl-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "gate" ? (
            <>
              <div><FieldLabel htmlFor="itl-a">A (0/1)</FieldLabel><FieldInput id="itl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itl-b">B (0/1)</FieldLabel><FieldInput id="itl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itl-c">Gate (and, or, xor, nand, nor, not)</FieldLabel><FieldInput id="itl-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "bool" ? (
            <>
              <div><FieldLabel htmlFor="itl-s">Expression</FieldLabel><FieldInput id="itl-s" value={s} onChange={(ev) => setS(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itl-a">A (0/1)</FieldLabel><FieldInput id="itl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itl-b">B (0/1)</FieldLabel><FieldInput id="itl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "truth" ? (
            <div><FieldLabel htmlFor="itl-c">Gate (and, or, xor, nand, nor)</FieldLabel><FieldInput id="itl-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div><p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p></div>
              <div className="space-y-2 text-sm">{result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
