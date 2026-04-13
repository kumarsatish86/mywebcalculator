"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBasicMathInitialFields } from "@/components/calculators/BasicMathInitialContext";
import { MathActionBar } from "@/components/calculators/MathActionBar";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel, FieldSelect } from "@/components/fields";
import { useDebouncedSearchParamsReplace } from "@/hooks/useDebouncedSearchParamsReplace";
import {
  evalMathExpression,
  medianSorted,
  modesOf,
  parseNumberList,
  roundTo,
  simplifyRatioPart,
  suggestScaledIntegersForRatio,
  type AngleMode,
  type RoundingMode,
} from "@/lib/calculators/basicMath";
import { formatNumForDisplay, formatPercentForDisplay } from "@/lib/calculators/basicMathDisplay";
import {
  BASIC_MATH_SHARE_MAX_LEN,
  encodeBasicMathShareState,
} from "@/lib/calculators/basicMathShareState";
import { evalExpressionWithTraceFromString } from "@/lib/calculators/mathExpressionAst";
import { mwcTrack } from "@/lib/analytics/mwcTrack";

function numErr(v: string, label: string): string | null {
  const t = v.trim();
  if (t === "") return `${label} is required.`;
  const n = Number(t);
  if (!Number.isFinite(n)) return `${label} must be a valid number.`;
  return null;
}

function useMathUrlSync(slug: string, fields: Record<string, string>, deps: unknown[]) {
  useDebouncedSearchParamsReplace(
    () => {
      const ms = encodeBasicMathShareState(slug, fields);
      return ms ? { ms } : {};
    },
    deps,
  );
}

function buildMathShareParams(slug: string, fields: Record<string, string>) {
  const ms = encodeBasicMathShareState(slug, fields);
  if (ms) return { params: { ms }, sharePayloadOmitted: false as const };
  return { params: {}, sharePayloadOmitted: true as const };
}

function downloadListStatsCsv(
  slug: string,
  kind: "mean" | "median" | "mode" | "sum",
  values: number[],
  summaryText: string,
) {
  const label = kind === "mean" ? "mean" : kind === "sum" ? "sum" : kind === "median" ? "median" : "mode";
  const lines = ["value", ...values.map((n) => String(n)), "", label, summaryText];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}-list.csv`;
  a.click();
  URL.revokeObjectURL(url);
  mwcTrack("math_list_csv_export", { tool: slug, kind });
}

const SL_BASIC = "basic-calculator-add-subtract-multiply-divide";
const SL_PCT = "percentage-calculator";
const SL_PID = "percentage-increase-decrease-calculator";
const SL_RATIO = "ratio-calculator";
const SL_PROP = "proportion-calculator";
const SL_AVG = "average-calculator";
const SL_MEAN = "mean-calculator";
const SL_MED = "median-calculator";
const SL_MODE = "mode-calculator";
const SL_SUM = "sum-calculator";
const SL_DIFF = "difference-calculator";
const SL_RND = "rounding-calculator";
const SL_SCI = "scientific-calculator";
const SL_PEMDAS = "order-of-operations-pemdas-calculator";

function pickOp(v: string | undefined): "add" | "sub" | "mul" | "div" {
  if (v === "sub" || v === "mul" || v === "div" || v === "add") return v;
  return "add";
}

export function BasicCalculatorAddSubtractMultiplyDivide() {
  const mi = useBasicMathInitialFields();
  const [a, setA] = useState(() => mi.a ?? "12");
  const [b, setB] = useState(() => mi.b ?? "3");
  const [op, setOp] = useState<"add" | "sub" | "mul" | "div">(() => pickOp(mi.op));

  const fields = useMemo(() => ({ a, b, op }), [a, b, op]);
  useMathUrlSync(SL_BASIC, fields, [a, b, op]);

  const result = useMemo(() => {
    const ea = numErr(a, "First number");
    const eb = numErr(b, "Second number");
    if (ea || eb) return { err: ea ?? eb! };
    const x = Number(a);
    const y = Number(b);
    let v: number;
    switch (op) {
      case "add":
        v = x + y;
        break;
      case "sub":
        v = x - y;
        break;
      case "mul":
        v = x * y;
        break;
      default:
        if (y === 0) return { err: "Cannot divide by zero." };
        v = x / y;
    }
    return { err: null as string | null, v };
  }, [a, b, op]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_BASIC}-form-error`;
  const reset = () => {
    setA("12");
    setB("3");
    setOp("add");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_BASIC}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_BASIC, fields)}
      getSummary={() =>
        result.err
          ? `Basic calculator — ${result.err}`
          : `Basic calculator — ${formatNumForDisplay(result.v!)} (${op}: ${a}, ${b})`
      }
    />
  );

  return (
    <CalculatorShell
      title="Basic calculator (add, subtract, multiply, divide)"
      description="Two-number arithmetic with a clear operator—handy for quick homework checks."
      resultKey={`${a}-${b}-${op}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_BASIC}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{formatNumForDisplay(result.v!)}</p>
        )
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="basic-a">First number</FieldLabel>
            <FieldInput
              id="basic-a"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor="basic-op">Operation</FieldLabel>
            <FieldSelect
              id="basic-op"
              className="mt-2"
              value={op}
              onChange={(e) => {
                const v = e.target.value as typeof op;
                setOp(v);
                mwcTrack("math_mode_change", { tool: SL_BASIC, mode: v });
              }}
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            >
              <option value="add">Add (+)</option>
              <option value="sub">Subtract (−)</option>
              <option value="mul">Multiply (×)</option>
              <option value="div">Divide (÷)</option>
            </FieldSelect>
          </div>
          <div>
            <FieldLabel htmlFor="basic-b">Second number</FieldLabel>
            <FieldInput
              id="basic-b"
              inputMode="decimal"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
        </div>
        {result.err ? (
          <p id={formErrorId} role="alert" className="text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

function pickPctMode(v: string | undefined): "of" | "isWhat" | "change" {
  if (v === "isWhat" || v === "change" || v === "of") return v;
  return "of";
}

export function PercentageCalculator() {
  const mi = useBasicMathInitialFields();
  const [mode, setMode] = useState<"of" | "isWhat" | "change">(() => pickPctMode(mi.mode));
  const [p, setP] = useState(() => mi.p ?? "15");
  const [w, setW] = useState(() => mi.w ?? "80");
  const [part, setPart] = useState(() => mi.part ?? "12");
  const [whole, setWhole] = useState(() => mi.whole ?? "48");
  const [oldV, setOldV] = useState(() => mi.oldV ?? "100");
  const [newV, setNewV] = useState(() => mi.newV ?? "115");

  const fields = useMemo(() => ({ mode, p, w, part, whole, oldV, newV }), [mode, p, w, part, whole, oldV, newV]);
  useMathUrlSync(SL_PCT, fields, [mode, p, w, part, whole, oldV, newV]);

  const result = useMemo(() => {
    if (mode === "of") {
      const e1 = numErr(p, "Percent");
      const e2 = numErr(w, "Whole");
      if (e1 || e2) return { err: e1 ?? e2! };
      const val = (Number(p) / 100) * Number(w);
      return { err: null as string | null, text: formatNumForDisplay(val) };
    }
    if (mode === "isWhat") {
      const e1 = numErr(part, "Part");
      const e2 = numErr(whole, "Whole");
      if (e1 || e2) return { err: e1 ?? e2! };
      const wh = Number(whole);
      if (wh === 0) return { err: "Whole cannot be zero." };
      return { err: null as string | null, text: formatPercentForDisplay((Number(part) / wh) * 100) };
    }
    const e1 = numErr(oldV, "Old value");
    const e2 = numErr(newV, "New value");
    if (e1 || e2) return { err: e1 ?? e2! };
    const o = Number(oldV);
    if (o === 0) return { err: "Old value cannot be zero for percent change." };
    const pct = ((Number(newV) - o) / o) * 100;
    return { err: null as string | null, text: formatPercentForDisplay(pct) };
  }, [mode, p, w, part, whole, oldV, newV]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_PCT}-form-error`;
  const reset = () => {
    setMode("of");
    setP("15");
    setW("80");
    setPart("12");
    setWhole("48");
    setOldV("100");
    setNewV("115");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_PCT}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_PCT, fields)}
      getSummary={() =>
        result.err ? `Percentage — ${result.err}` : `Percentage (${mode}) — ${result.text}`
      }
    />
  );

  return (
    <CalculatorShell
      title="Percentage calculator"
      description="What is P% of W, what percent one number is of another, or percent change between two values."
      resultKey={`${mode}-${p}-${w}-${part}-${whole}-${oldV}-${newV}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_PCT}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <div className="space-y-1 text-sm">
            <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.text}</p>
            <p className="text-[var(--muted)]">
              {mode === "of"
                ? "Result of (percent ÷ 100) × whole."
                : mode === "isWhat"
                  ? "Part ÷ whole × 100."
                  : "((new − old) ÷ old) × 100."}
            </p>
          </div>
        )
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel htmlFor="pct-mode">Mode</FieldLabel>
          <FieldSelect
            id="pct-mode"
            className="mt-2"
            value={mode}
            onChange={(e) => {
              const v = e.target.value as typeof mode;
              setMode(v);
              mwcTrack("math_mode_change", { tool: SL_PCT, mode: v });
            }}
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          >
            <option value="of">What is P% of W?</option>
            <option value="isWhat">A is what % of B?</option>
            <option value="change">% change from old to new</option>
          </FieldSelect>
        </div>
        {mode === "of" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pct-p">Percent (%)</FieldLabel>
              <FieldInput
                id="pct-p"
                inputMode="decimal"
                value={p}
                onChange={(e) => setP(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pct-w">Whole</FieldLabel>
              <FieldInput
                id="pct-w"
                inputMode="decimal"
                value={w}
                onChange={(e) => setW(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          </div>
        ) : null}
        {mode === "isWhat" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pct-part">Part (A)</FieldLabel>
              <FieldInput
                id="pct-part"
                inputMode="decimal"
                value={part}
                onChange={(e) => setPart(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pct-whole">Whole (B)</FieldLabel>
              <FieldInput
                id="pct-whole"
                inputMode="decimal"
                value={whole}
                onChange={(e) => setWhole(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          </div>
        ) : null}
        {mode === "change" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pct-old">Old value</FieldLabel>
              <FieldInput
                id="pct-old"
                inputMode="decimal"
                value={oldV}
                onChange={(e) => setOldV(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pct-new">New value</FieldLabel>
              <FieldInput
                id="pct-new"
                inputMode="decimal"
                value={newV}
                onChange={(e) => setNewV(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          </div>
        ) : null}
        {result.err ? (
          <p id={formErrorId} role="alert" className="text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

export function PercentageIncreaseDecreaseCalculator() {
  const mi = useBasicMathInitialFields();
  const [base, setBase] = useState(() => mi.base ?? "200");
  const [pct, setPct] = useState(() => mi.pct ?? "15");
  const [dir, setDir] = useState<"inc" | "dec">(() => (mi.dir === "dec" ? "dec" : "inc"));

  const fields = useMemo(() => ({ base, pct, dir }), [base, pct, dir]);
  useMathUrlSync(SL_PID, fields, [base, pct, dir]);

  const result = useMemo(() => {
    const e1 = numErr(base, "Starting value");
    const e2 = numErr(pct, "Percent");
    if (e1 || e2) return { err: e1 ?? e2! };
    const b = Number(base);
    const p = Number(pct);
    const f = dir === "inc" ? 1 + p / 100 : 1 - p / 100;
    const v = b * f;
    return { err: null as string | null, v };
  }, [base, pct, dir]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_PID}-form-error`;
  const reset = () => {
    setBase("200");
    setPct("15");
    setDir("inc");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_PID}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_PID, fields)}
      getSummary={() =>
        result.err ? `Percent inc/dec — ${result.err}` : `Percent ${dir} — ${formatNumForDisplay(result.v!)}`
      }
    />
  );

  return (
    <CalculatorShell
      title="Percentage increase / decrease calculator"
      description="Apply a percent increase or decrease to a starting value (e.g. markup, discount)."
      resultKey={`${base}-${pct}-${dir}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_PID}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{formatNumForDisplay(result.v!)}</p>
        )
      }
    >
      <form className="grid gap-4 sm:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel htmlFor="pid-base">Starting value</FieldLabel>
          <FieldInput
            id="pid-base"
            inputMode="decimal"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="pid-pct">Percent (%)</FieldLabel>
          <FieldInput
            id="pid-pct"
            inputMode="decimal"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="pid-dir">Direction</FieldLabel>
          <FieldSelect
            id="pid-dir"
            className="mt-2"
            value={dir}
            onChange={(e) => {
              const v = e.target.value as typeof dir;
              setDir(v);
              mwcTrack("math_mode_change", { tool: SL_PID, mode: v });
            }}
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          >
            <option value="inc">Increase</option>
            <option value="dec">Decrease</option>
          </FieldSelect>
        </div>
        {result.err ? (
          <p id={formErrorId} role="alert" className="sm:col-span-3 text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

export function RatioCalculator() {
  const tExtras = useTranslations("basicMathExtras");
  const mi = useBasicMathInitialFields();
  const [a, setA] = useState(() => mi.a ?? "4");
  const [b, setB] = useState(() => mi.b ?? "6");

  const fields = useMemo(() => ({ a, b }), [a, b]);
  useMathUrlSync(SL_RATIO, fields, [a, b]);

  const result = useMemo(() => {
    const e1 = numErr(a, "First term");
    const e2 = numErr(b, "Second term");
    if (e1 || e2) return { err: e1 ?? e2! };
    const na = Number(a);
    const nb = Number(b);
    const s = simplifyRatioPart(na, nb);
    if ("error" in s) {
      return { err: s.error, ratioHint: suggestScaledIntegersForRatio(na, nb) };
    }
    return { err: null as string | null, ra: s.a, rb: s.b };
  }, [a, b]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_RATIO}-form-error`;
  const reset = () => {
    setA("4");
    setB("6");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_RATIO}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_RATIO, fields)}
      getSummary={() =>
        result.err
          ? `Ratio — ${result.err}`
          : `Ratio — ${result.ra}:${result.rb} (from ${a}:${b})`
      }
    />
  );

  return (
    <CalculatorShell
      title="Ratio calculator"
      description="Reduce a ratio of two whole numbers to smallest terms (e.g. 4:6 → 2:3). Non-integers are not accepted—round to whole numbers first."
      resultKey={`${a}-${b}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_RATIO}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
            {result.ra}:{result.rb}
          </p>
        )
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel htmlFor="ratio-a">First term</FieldLabel>
          <FieldInput
            id="ratio-a"
            inputMode="numeric"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="ratio-b">Second term</FieldLabel>
          <FieldInput
            id="ratio-b"
            inputMode="numeric"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        {result.err ? (
          <div id={formErrorId} role="alert" className="sm:col-span-2 space-y-2 text-sm text-rose-700">
            <p>{result.err}</p>
            {"ratioHint" in result && result.ratioHint != null ? (
              <p className="text-[var(--muted)]">
                {tExtras.rich("ratioScaleTip", {
                  factor: String(result.ratioHint.factor),
                  pair: () => (
                    <span className="font-mono text-[var(--text)]">
                      {result.ratioHint!.ai} : {result.ratioHint!.bi}
                    </span>
                  ),
                })}
              </p>
            ) : null}
          </div>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

function ProportionDiagram() {
  const t = useTranslations("basicMathExtras");
  return (
    <figure className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/40 p-3" aria-hidden>
      <svg viewBox="0 0 320 72" className="h-auto w-full max-w-md text-[var(--muted)]" xmlns="http://www.w3.org/2000/svg">
        <text x="24" y="28" className="fill-[var(--text)] text-[13px] font-mono">
          A
        </text>
        <text x="24" y="52" className="fill-[var(--text)] text-[13px] font-mono">
          B
        </text>
        <text x="140" y="28" className="fill-[var(--text)] text-[13px] font-mono">
          C
        </text>
        <text x="140" y="52" className="fill-[var(--text)] text-[13px] font-mono">
          X
        </text>
        <line x1="44" y1="22" x2="120" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <line x1="44" y1="46" x2="120" y2="46" stroke="currentColor" strokeWidth="1.5" />
        <text x="108" y="42" className="fill-[var(--muted)] text-lg font-medium">
          =
        </text>
        <line x1="160" y1="22" x2="236" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <line x1="160" y1="46" x2="236" y2="46" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <figcaption className="mt-1 text-center text-xs text-[var(--muted)]">{t("proportionDiagramCaption")}</figcaption>
    </figure>
  );
}

type PropUnknown = "A" | "B" | "C" | "X";

function pickUnknown(v: string | undefined): PropUnknown {
  if (v === "A" || v === "B" || v === "C" || v === "X") return v;
  return "X";
}

export function ProportionCalculator() {
  const tExtras = useTranslations("basicMathExtras");
  const mi = useBasicMathInitialFields();
  const [unknown, setUnknown] = useState<PropUnknown>(() => pickUnknown(mi.unknown));
  const [va, setVa] = useState(() => mi.va ?? "2");
  const [vb, setVb] = useState(() => mi.vb ?? "5");
  const [vc, setVc] = useState(() => mi.vc ?? "8");
  const [vx, setVx] = useState(() => mi.vx ?? "");

  const fields = useMemo(() => ({ unknown, va, vb, vc, vx }), [unknown, va, vb, vc, vx]);
  useMathUrlSync(SL_PROP, fields, [unknown, va, vb, vc, vx]);

  const result = useMemo(() => {
    const read = (u: PropUnknown) => {
      switch (u) {
        case "A":
          return va;
        case "B":
          return vb;
        case "C":
          return vc;
        default:
          return vx;
      }
    };
    const parseKnown = (label: string, raw: string) => {
      const t = raw.trim();
      if (t === "") return { ok: false as const, err: `${label} is required.` };
      const n = Number(t);
      if (!Number.isFinite(n)) return { ok: false as const, err: `${label} must be a valid number.` };
      return { ok: true as const, n };
    };

    const need: PropUnknown[] = (["A", "B", "C", "X"] as const).filter((k) => k !== unknown);
    const vals: Record<PropUnknown, number | null> = { A: null, B: null, C: null, X: null };
    for (const k of need) {
      const r = parseKnown(k, read(k));
      if (!r.ok) return { err: r.err };
      vals[k] = r.n;
    }

    const A = vals.A;
    const B = vals.B;
    const C = vals.C;
    const X = vals.X;

    let solved: number;
    let label: string;
    switch (unknown) {
      case "X":
        if (A === null || B === null || C === null) return { err: "Missing values." };
        if (A === 0) return { err: "A cannot be zero (X = B×C÷A)." };
        solved = (B * C) / A;
        label = "X";
        break;
      case "A":
        if (X === null || B === null || C === null) return { err: "Missing values." };
        if (X === 0) return { err: "X cannot be zero (A = B×C÷X)." };
        solved = (B * C) / X;
        label = "A";
        break;
      case "B":
        if (A === null || X === null || C === null) return { err: "Missing values." };
        if (C === 0) return { err: "C cannot be zero (B = A×X÷C)." };
        solved = (A * X) / C;
        label = "B";
        break;
      default:
        if (A === null || B === null || X === null) return { err: "Missing values." };
        if (B === 0) return { err: "B cannot be zero (C = A×X÷B)." };
        solved = (A * X) / B;
        label = "C";
    }

    return { err: null as string | null, solved, label };
  }, [unknown, va, vb, vc, vx]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_PROP}-form-error`;
  const reset = () => {
    setUnknown("X");
    setVa("2");
    setVb("5");
    setVc("8");
    setVx("");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_PROP}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_PROP, fields)}
      getSummary={() =>
        result.err
          ? `Proportion — ${result.err}`
          : `Proportion — ${result.label} = ${formatNumForDisplay(result.solved!)}`
      }
    />
  );

  const showA = unknown !== "A";
  const showB = unknown !== "B";
  const showC = unknown !== "C";
  const showX = unknown !== "X";

  return (
    <CalculatorShell
      title="Proportion calculator"
      description="A : B = C : X (cross-multiply). Choose which value is unknown and enter the other three."
      resultKey={`${unknown}-${va}-${vb}-${vc}-${vx}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_PROP}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <div className="space-y-1 text-sm">
            <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
              {result.label} = {formatNumForDisplay(result.solved!)}
            </p>
            <p className="text-[var(--muted)]">
              {unknown === "X" && `So ${va} : ${vb} = ${vc} : ${formatNumForDisplay(result.solved!)}`}
              {unknown === "A" && `So ${formatNumForDisplay(result.solved!)} : ${vb} = ${vc} : ${vx || "—"}`}
              {unknown === "B" && `So ${va} : ${formatNumForDisplay(result.solved!)} = ${vc} : ${vx || "—"}`}
              {unknown === "C" && `So ${va} : ${vb} = ${formatNumForDisplay(result.solved!)} : ${vx || "—"}`}
            </p>
          </div>
        )
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-4 border-0 p-0">
          <legend className="mb-2 text-sm font-semibold text-[var(--text)]">{tExtras("proportionLegend")}</legend>
          <ProportionDiagram />
          <div>
            <FieldLabel htmlFor="prop-unknown">Solve for</FieldLabel>
            <FieldSelect
              id="prop-unknown"
              className="mt-2"
              value={unknown}
              onChange={(e) => {
                const v = e.target.value as PropUnknown;
                setUnknown(v);
                mwcTrack("math_mode_change", { tool: SL_PROP, mode: v });
              }}
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            >
              <option value="X">X (fourth term)</option>
              <option value="A">A (first term)</option>
              <option value="B">B (second term)</option>
              <option value="C">C (third term)</option>
            </FieldSelect>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
          {showA ? (
            <div>
              <FieldLabel htmlFor="prop-a">A</FieldLabel>
              <FieldInput
                id="prop-a"
                inputMode="decimal"
                value={va}
                onChange={(e) => setVa(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          ) : null}
          {showB ? (
            <div>
              <FieldLabel htmlFor="prop-b">B</FieldLabel>
              <FieldInput
                id="prop-b"
                inputMode="decimal"
                value={vb}
                onChange={(e) => setVb(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          ) : null}
          {showC ? (
            <div>
              <FieldLabel htmlFor="prop-c">C</FieldLabel>
              <FieldInput
                id="prop-c"
                inputMode="decimal"
                value={vc}
                onChange={(e) => setVc(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          ) : null}
          {showX ? (
            <div>
              <FieldLabel htmlFor="prop-x">X</FieldLabel>
              <FieldInput
                id="prop-x"
                inputMode="decimal"
                value={vx}
                onChange={(e) => setVx(e.target.value)}
                className="mt-2"
                aria-invalid={fieldInvalid}
                aria-describedby={fieldInvalid ? formErrorId : undefined}
              />
            </div>
          ) : null}
          </div>
        </fieldset>
        {result.err ? (
          <p id={formErrorId} role="alert" className="text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

const LIST_SHARE_HINT_CHARS = Math.min(960, Math.floor(BASIC_MATH_SHARE_MAX_LEN * 0.5));

function ListStatsCalculator({
  title,
  description,
  kind,
  slug,
  defaultRaw,
  placeholder,
}: {
  title: string;
  description: string;
  kind: "mean" | "median" | "mode" | "sum";
  slug: string;
  defaultRaw: string;
  placeholder: string;
}) {
  const tExtras = useTranslations("basicMathExtras");
  const mi = useBasicMathInitialFields();
  const [raw, setRaw] = useState(() => mi.raw ?? defaultRaw);

  const fields = useMemo(() => ({ raw }), [raw]);
  useMathUrlSync(slug, fields, [raw]);

  const result = useMemo(() => {
    const p = parseNumberList(raw);
    if (!p.ok) return { err: p.error };
    const v = p.values;
    if (kind === "sum") {
      const s = v.reduce((acc, x) => acc + x, 0);
      return { err: null as string | null, text: formatNumForDisplay(s), values: v };
    }
    if (kind === "mean") {
      const s = v.reduce((acc, x) => acc + x, 0) / v.length;
      return { err: null as string | null, text: formatNumForDisplay(s), values: v };
    }
    const sorted = [...v].sort((x, y) => x - y);
    if (kind === "median") return { err: null as string | null, text: formatNumForDisplay(medianSorted(sorted)), values: v };
    const m = modesOf(v);
    if (m.length === 0) return { err: null as string | null, text: "No mode (all values appear once).", values: v };
    return { err: null as string | null, text: m.map((x) => formatNumForDisplay(x)).join(", "), values: v };
  }, [raw, kind]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${slug}-form-error`;
  const reset = () => setRaw(defaultRaw);

  const toolbar = (
    <MathActionBar
      analyticsId={slug}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(slug, fields)}
      getSummary={() => (result.err ? `${title} — ${result.err}` : `${title} — ${result.text}`)}
    />
  );

  return (
    <CalculatorShell
      title={title}
      description={description}
      resultKey={`${kind}-${raw}`}
      compact
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${slug}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <div
            id={`${slug}-result-focus`}
            tabIndex={-1}
            className="space-y-2 outline-none"
          >
            <p className="break-words font-mono text-2xl font-semibold text-[var(--accent-bright)]">{result.text}</p>
            {kind === "mean" || kind === "sum" ? (
              <p className="text-xs leading-relaxed text-[var(--muted)]">{tExtras("fpListMeanSum")}</p>
            ) : null}
          </div>
        )
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
        <FieldLabel htmlFor={`list-${slug}`}>Numbers (comma or space separated)</FieldLabel>
        <FieldInput
          id={`list-${slug}`}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="mt-2 font-mono text-sm"
          placeholder={placeholder}
          aria-invalid={fieldInvalid}
          aria-describedby={fieldInvalid ? formErrorId : undefined}
        />
        {raw.length >= LIST_SHARE_HINT_CHARS ? (
          <p className="text-xs leading-relaxed text-[var(--muted)]">{tExtras("listShareHint")}</p>
        ) : null}
        {!result.err && "values" in result && result.values ? (
          <button
            type="button"
            onClick={() => downloadListStatsCsv(slug, kind, result.values!, result.text)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {tExtras("exportCsv")}
          </button>
        ) : null}
        {result.err ? (
          <p id={formErrorId} role="alert" className="text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

export function AverageCalculator() {
  return (
    <ListStatsCalculator
      slug={SL_AVG}
      title="Average calculator"
      description="Arithmetic mean: sum of values divided by how many values you enter."
      kind="mean"
      defaultRaw="10, 20, 30"
      placeholder="e.g. 10, 20, 30"
    />
  );
}

export function MeanCalculator() {
  return (
    <ListStatsCalculator
      slug={SL_MEAN}
      title="Mean calculator"
      description="Same idea as “average” here: arithmetic mean. Use when your course or textbook says “mean” explicitly."
      kind="mean"
      defaultRaw="1.5, 2.5, 3.5, 4.5"
      placeholder="e.g. 1.5, 2.5, 3.5"
    />
  );
}

export function MedianCalculator() {
  return (
    <ListStatsCalculator
      slug={SL_MED}
      title="Median calculator"
      description="Middle value after sorting (for two middle numbers, we average them)."
      kind="median"
      defaultRaw="2, 4, 4, 6"
      placeholder="e.g. 1, 2, 9"
    />
  );
}

export function ModeCalculator() {
  return (
    <ListStatsCalculator
      slug={SL_MODE}
      title="Mode calculator"
      description="Most frequent value(s). If every value appears once, there is no mode."
      kind="mode"
      defaultRaw="2, 4, 4, 6"
      placeholder="e.g. 2, 4, 4, 6"
    />
  );
}

export function SumCalculator() {
  return (
    <ListStatsCalculator
      slug={SL_SUM}
      title="Sum calculator"
      description="Add every number in your list."
      kind="sum"
      defaultRaw="5, 10, 15"
      placeholder="e.g. 5, 10, 15"
    />
  );
}

export function DifferenceCalculator() {
  const mi = useBasicMathInitialFields();
  const [a, setA] = useState(() => mi.a ?? "100");
  const [b, setB] = useState(() => mi.b ?? "37");

  const fields = useMemo(() => ({ a, b }), [a, b]);
  useMathUrlSync(SL_DIFF, fields, [a, b]);

  const result = useMemo(() => {
    const e1 = numErr(a, "First number");
    const e2 = numErr(b, "Second number");
    if (e1 || e2) return { err: e1 ?? e2! };
    return { err: null as string | null, v: Number(a) - Number(b) };
  }, [a, b]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_DIFF}-form-error`;
  const reset = () => {
    setA("100");
    setB("37");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_DIFF}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_DIFF, fields)}
      getSummary={() =>
        result.err ? `Difference — ${result.err}` : `Difference — ${formatNumForDisplay(result.v!)} (${a} − ${b})`
      }
    />
  );

  return (
    <CalculatorShell
      title="Difference calculator"
      description="Subtract the second number from the first (A − B)."
      resultKey={`${a}-${b}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_DIFF}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{formatNumForDisplay(result.v!)}</p>
        )
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel htmlFor="diff-a">A</FieldLabel>
          <FieldInput
            id="diff-a"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="diff-b">B</FieldLabel>
          <FieldInput
            id="diff-b"
            inputMode="decimal"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        {result.err ? (
          <p id={formErrorId} role="alert" className="sm:col-span-2 text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

function pickRoundingMode(v: string | undefined): RoundingMode {
  if (v === "up" || v === "down" || v === "toward_zero" || v === "banker" || v === "nearest") return v;
  return "nearest";
}

export function RoundingCalculator() {
  const mi = useBasicMathInitialFields();
  const [val, setVal] = useState(() => mi.val ?? "3.14159");
  const [places, setPlaces] = useState(() => mi.places ?? "2");
  const [mode, setMode] = useState<RoundingMode>(() => pickRoundingMode(mi.mode));

  const fields = useMemo(() => ({ val, places, mode }), [val, places, mode]);
  useMathUrlSync(SL_RND, fields, [val, places, mode]);

  const result = useMemo(() => {
    const e1 = numErr(val, "Value");
    const e2 = numErr(places, "Decimal places");
    if (e1 || e2) return { err: e1 ?? e2! };
    const d = Number(places);
    if (!Number.isInteger(d) || d < 0 || d > 20) return { err: "Decimal places must be an integer from 0 to 20." };
    const r = roundTo(Number(val), d, mode);
    return { err: null as string | null, v: r };
  }, [val, places, mode]);

  const fieldInvalid = Boolean(result.err);
  const formErrorId = `${SL_RND}-form-error`;
  const reset = () => {
    setVal("3.14159");
    setPlaces("2");
    setMode("nearest");
  };

  const toolbar = (
    <MathActionBar
      analyticsId={SL_RND}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(SL_RND, fields)}
      getSummary={() =>
        result.err ? `Rounding — ${result.err}` : `Rounding — ${formatNumForDisplay(result.v!)}`
      }
    />
  );

  return (
    <CalculatorShell
      title="Rounding calculator"
      description="Round to a chosen number of decimal places: nearest, up, down, toward zero, or half-even (banker)."
      resultKey={`${val}-${places}-${mode}`}
      toolbar={toolbar}
      result={
        result.err ? (
          <p id={`${SL_RND}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {result.err}
          </p>
        ) : (
          <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{formatNumForDisplay(result.v!)}</p>
        )
      }
    >
      <form className="grid gap-4 sm:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel htmlFor="rnd-v">Value</FieldLabel>
          <FieldInput
            id="rnd-v"
            inputMode="decimal"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="rnd-p">Decimal places</FieldLabel>
          <FieldInput
            id="rnd-p"
            inputMode="numeric"
            value={places}
            onChange={(e) => setPlaces(e.target.value)}
            className="mt-2"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="rnd-m">Mode</FieldLabel>
          <FieldSelect
            id="rnd-m"
            className="mt-2"
            value={mode}
            onChange={(e) => {
              const v = e.target.value as RoundingMode;
              setMode(v);
              mwcTrack("math_mode_change", { tool: SL_RND, mode: v });
            }}
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          >
            <option value="nearest">Half away from zero (school “round”)</option>
            <option value="up">Always up (ceil)</option>
            <option value="down">Always down (floor)</option>
            <option value="toward_zero">Toward zero (truncate)</option>
            <option value="banker">Half to even (banker / IEEE)</option>
          </FieldSelect>
        </div>
        {result.err ? (
          <p id={formErrorId} role="alert" className="sm:col-span-3 text-sm text-rose-700">
            {result.err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

const EXPR_HISTORY_MAX = 10;

function ExpressionShell({
  title,
  description,
  slug,
  showTrace,
}: {
  title: string;
  description: string;
  slug: string;
  showTrace: boolean;
}) {
  const tExtras = useTranslations("basicMathExtras");
  const mi = useBasicMathInitialFields();
  const [expr, setExpr] = useState(() => mi.expr ?? "2 + 3 * 4");
  const [angleMode, setAngleMode] = useState<AngleMode>(() => (mi.angle === "deg" ? "deg" : "rad"));
  const [showSteps, setShowSteps] = useState(false);
  const [exprHistory, setExprHistory] = useState<string[]>([]);
  const historyKey = `mwc-math-expr-${slug}`;

  const fields = useMemo(() => ({ expr, angle: angleMode }), [expr, angleMode]);
  useMathUrlSync(slug, fields, [expr, angleMode]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyKey);
      setExprHistory(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setExprHistory([]);
    }
  }, [historyKey]);

  const useTraceEval = showTrace || (!showTrace && showSteps);

  const result = useMemo(() => {
    if (useTraceEval) {
      return evalExpressionWithTraceFromString(expr, { angleMode });
    }
    const r = evalMathExpression(expr, { angleMode });
    if (!r.ok) return r;
    return { ok: true as const, value: r.value, steps: [] as string[] };
  }, [expr, angleMode, useTraceEval]);

  const err = !result.ok ? result.error : null;
  const fieldInvalid = Boolean(err);
  const formErrorId = `${slug}-form-error`;

  const pushExprHistory = (ex: string) => {
    const t = ex.trim();
    if (!t) return;
    try {
      const raw = localStorage.getItem(historyKey);
      const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      const next = [t, ...list.filter((x) => x !== t)].slice(0, EXPR_HISTORY_MAX);
      localStorage.setItem(historyKey, JSON.stringify(next));
      setExprHistory(next);
    } catch {
      /* ignore */
    }
  };

  const clearExprHistory = () => {
    try {
      localStorage.removeItem(historyKey);
      setExprHistory([]);
      mwcTrack("math_expr_history_clear", { tool: slug });
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setExpr("2 + 3 * 4");
    setAngleMode("rad");
    setShowSteps(false);
  };

  const toolbar = (
    <MathActionBar
      analyticsId={slug}
      onReset={reset}
      onPrintSchedule={() => window.print()}
      getShareSearchParams={() => buildMathShareParams(slug, fields)}
      getSummary={() =>
        err || !result.ok ? `${title} — ${err ?? "Error"}` : `${title} — ${formatNumForDisplay(result.value)}`
      }
    />
  );

  const showStepDetails = (showTrace || showSteps) && result.ok && result.steps.length > 0;

  return (
    <CalculatorShell
      title={title}
      description={description}
      compact
      resultKey={`${expr}-${angleMode}-${showSteps}`}
      toolbar={toolbar}
      result={
        err ? (
          <p id={`${slug}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
            {err}
          </p>
        ) : result.ok ? (
          <div
            id={`${slug}-result-focus`}
            tabIndex={-1}
            className="space-y-3 text-sm outline-none"
          >
            <p className="break-all font-mono text-2xl font-semibold text-[var(--accent-bright)]">
              {formatNumForDisplay(result.value)}
            </p>
            <p className="text-xs leading-relaxed text-[var(--muted)]">{tExtras("fpExpression")}</p>
            {showStepDetails ? (
              <details className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/40 p-3">
                <summary className="cursor-pointer text-xs font-medium text-[var(--text)]">Step-by-step (PEMDAS)</summary>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-[var(--muted)]">
                  {result.steps.map((s, i) => (
                    <li key={i} className="font-mono">
                      {s}
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}
          </div>
        ) : null
      }
    >
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <datalist id={`${slug}-expr-dl`}>
          {exprHistory.map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>
        <div>
          <FieldLabel htmlFor={`${slug}-expr`}>Expression</FieldLabel>
          <FieldInput
            id={`${slug}-expr`}
            value={expr}
            list={`${slug}-expr-dl`}
            onChange={(e) => setExpr(e.target.value)}
            onBlur={() => pushExprHistory(expr)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                document.getElementById(`${slug}-result-focus`)?.focus();
              }
            }}
            className="mt-2 font-mono text-sm"
            spellCheck={false}
            autoComplete="off"
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          />
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={clearExprHistory}
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              {tExtras("clearExprHistory")}
            </button>
            <span className="text-xs text-[var(--muted)]">{tExtras("ctrlEnterHint")}</span>
          </div>
        </div>
        {!showTrace ? (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--text)]">
            <input
              type="checkbox"
              checked={showSteps}
              onChange={(e) => {
                const v = e.target.checked;
                setShowSteps(v);
                mwcTrack("math_show_steps_toggle", { tool: slug, on: v });
              }}
              className="rounded border-[var(--border)]"
            />
            {tExtras("showStepsCheckbox")}
          </label>
        ) : null}
        <div>
          <FieldLabel htmlFor={`${slug}-angle`}>Angle unit (for sin, cos, tan)</FieldLabel>
          <FieldSelect
            id={`${slug}-angle`}
            className="mt-2"
            value={angleMode}
            onChange={(e) => {
              const v = e.target.value as AngleMode;
              setAngleMode(v);
              mwcTrack("math_mode_change", { tool: slug, mode: v });
            }}
            aria-invalid={fieldInvalid}
            aria-describedby={fieldInvalid ? formErrorId : undefined}
          >
            <option value="rad">Radians</option>
            <option value="deg">Degrees</option>
          </FieldSelect>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Operators: + − * / ^ (power, right-associative). Parentheses. Constants: <span className="font-mono">pi</span>,{" "}
          <span className="font-mono">e</span>. Functions: <span className="font-mono">sqrt(x)</span>,{" "}
          <span className="font-mono">sin cos tan</span>, <span className="font-mono">log</span> (base 10),{" "}
          <span className="font-mono">ln</span>, <span className="font-mono">abs</span>. Use <span className="font-mono">*</span>{" "}
          explicitly (no implied multiplication). Unary minus after powers: <span className="font-mono">-2^2</span> ={" "}
          <span className="font-mono">-4</span>.
        </p>
        {err ? (
          <p id={formErrorId} role="alert" className="text-sm text-rose-700">
            {err}
          </p>
        ) : null}
      </form>
    </CalculatorShell>
  );
}

export function ScientificCalculator() {
  return (
    <ExpressionShell
      slug={SL_SCI}
      title="Scientific calculator"
      description="Evaluate expressions with trig, log, powers, and constants—useful for homework and quick checks."
      showTrace={false}
    />
  );
}

export function OrderOfOperationsPemdasCalculator() {
  return (
    <ExpressionShell
      slug={SL_PEMDAS}
      title="Order of operations (PEMDAS / BODMAS) calculator"
      description="Type an expression to see the numeric result and optional step-by-step evaluation using standard precedence."
      showTrace={true}
    />
  );
}
