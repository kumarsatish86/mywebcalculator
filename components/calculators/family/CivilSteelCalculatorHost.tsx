"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilSteel,
  type CivilSteelInput,
  type CivilSteelResult,
  type CivilSteelSlug,
} from "@/lib/calculators/civilSteel";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "weight" | "cost" | "lap" | "development";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  dDefault: string;
  lDefault: string;
  nDefault: string;
  pDefault: string;
  aDefault: string;
  bDefault: string;
  rDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilSteelSlug, Config> = {
  "civil-steel-weight-calculator": {
    title: "Steel weight", description: `Rebar weight from d²/162 rule. ${DISCLAIMER}`,
    mode: "weight", dDefault: "12", lDefault: "12", nDefault: "10", pDefault: "", aDefault: "", bDefault: "", rDefault: "",
  },
  "civil-rebar-calculator": {
    title: "Rebar calculator", description: `Bar weight and total length. ${DISCLAIMER}`,
    mode: "weight", dDefault: "16", lDefault: "6", nDefault: "8", pDefault: "", aDefault: "", bDefault: "", rDefault: "",
  },
  "civil-steel-quantity-estimator": {
    title: "Steel quantity", description: `Total steel weight estimate. ${DISCLAIMER}`,
    mode: "weight", dDefault: "10", lDefault: "12", nDefault: "20", pDefault: "", aDefault: "", bDefault: "", rDefault: "",
  },
  "civil-reinforcement-bar-calculator": {
    title: "Reinforcement bar", description: `Unit weight and bar mass. ${DISCLAIMER}`,
    mode: "weight", dDefault: "20", lDefault: "5", nDefault: "4", pDefault: "", aDefault: "", bDefault: "", rDefault: "",
  },
  "civil-bbs-bar-bending-schedule-calculator": {
    title: "BBS (bar bending schedule)", description: `Weight from cutting length × bar count. ${DISCLAIMER}`,
    mode: "weight", dDefault: "12", lDefault: "8", nDefault: "15", pDefault: "", aDefault: "", bDefault: "", rDefault: "",
  },
  "civil-steel-cost-calculator": {
    title: "Steel cost", description: `Cost = weight × unit rate. ${DISCLAIMER}`,
    mode: "cost", dDefault: "12", lDefault: "12", nDefault: "10", pDefault: "65", aDefault: "", bDefault: "", rDefault: "",
  },
  "civil-lap-length-calculator": {
    title: "Lap length", description: `Lap ≈ factor × bar diameter. ${DISCLAIMER}`,
    mode: "lap", dDefault: "16", lDefault: "", nDefault: "", pDefault: "", aDefault: "", bDefault: "", rDefault: "40",
  },
  "civil-development-length-calculator": {
    title: "Development length", description: `Educational Ld estimate. ${DISCLAIMER}`,
    mode: "development", dDefault: "16", lDefault: "", nDefault: "", pDefault: "", aDefault: "25", bDefault: "500", rDefault: "1",
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

function formatResult(res: CivilSteelResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.unitWeightKgPerM !== undefined) rows.push({ label: "Unit weight (kg/m)", value: num(res.unitWeightKgPerM, 3) });
  if (res.totalLengthM !== undefined) rows.push({ label: "Total length (m)", value: num(res.totalLengthM, 2) });
  if (res.weightKg !== undefined) rows.push({ label: "Weight (kg)", value: num(res.weightKg, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 0) });
  if (res.lapLengthMm !== undefined) rows.push({ label: "Lap length (mm)", value: num(res.lapLengthMm, 0) });
  if (res.developmentLengthMm !== undefined) rows.push({ label: "Ld (mm)", value: num(res.developmentLengthMm, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.weightKg !== undefined ? num(res.weightKg, 2)
    : res.lapLengthMm !== undefined ? num(res.lapLengthMm, 0)
    : res.developmentLengthMm !== undefined ? num(res.developmentLengthMm, 0)
    : res.cost !== undefined ? num(res.cost, 0)
    : "—";
  const primaryLabel =
    res.lapLengthMm !== undefined ? "Lap length (mm)"
    : res.developmentLengthMm !== undefined ? "Development length (mm)"
    : res.cost !== undefined ? "Steel cost"
    : "Steel weight (kg)";
  return { primary, primaryLabel, rows };
}

export function CivilSteelCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilSteelSlug;
  const config = CONFIG[key] ?? CONFIG["civil-steel-weight-calculator"];
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "weight":
      case "cost":
        put(CIVIL_URL.D, d); put(CIVIL_URL.L, l); put(CIVIL_URL.N, n);
        if (config.mode === "cost") put(CIVIL_URL.P, p);
        break;
      case "lap":
        put(CIVIL_URL.D, d); put(CIVIL_URL.R, r);
        break;
      case "development":
        put(CIVIL_URL.D, d); put(CIVIL_URL.A, a); put(CIVIL_URL.B, b); put(CIVIL_URL.R, r);
        break;
    }
    return out;
  }, [a, b, config.mode, d, l, n, p, r]);

  useLoanUrlSync(shareParams, [a, b, d, l, n, p, r]);

  const result = useMemo(() => {
    const input: CivilSteelInput = {};
    if (config.mode === "lap") {
      const dia = parsePositive(d, "Diameter (mm)");
      if (!dia.ok) return { error: dia.error };
      input.diaMm = dia.value;
      if (r.trim() !== "") {
        const f = parsePositive(r, "Lap factor");
        if (!f.ok) return { error: f.error };
        input.lapFactor = f.value;
      }
    } else if (config.mode === "development") {
      const dia = parsePositive(d, "Diameter (mm)");
      if (!dia.ok) return { error: dia.error };
      input.diaMm = dia.value;
      if (a.trim() !== "") {
        const fck = parsePositive(a, "Concrete grade (MPa)");
        if (!fck.ok) return { error: fck.error };
        input.concreteGradeMpa = fck.value;
      }
      if (b.trim() !== "") {
        const fy = parsePositive(b, "Steel fy (MPa)");
        if (!fy.ok) return { error: fy.error };
        input.steelFyMpa = fy.value;
      }
      if (r.trim() !== "") {
        const f = parsePositive(r, "Ld factor");
        if (!f.ok) return { error: f.error };
        input.ldFactor = f.value;
      }
    } else {
      const dia = parsePositive(d, "Diameter (mm)");
      const len = parsePositive(l, "Length (m)");
      const bars = parsePositive(n, "Number of bars");
      if (!dia.ok) return { error: dia.error };
      if (!len.ok) return { error: len.error };
      if (!bars.ok) return { error: bars.error };
      input.diaMm = dia.value;
      input.lengthM = len.value;
      input.bars = bars.value;
      if (config.mode === "cost" && p.trim() !== "") {
        const price = parsePositive(p, "Price per kg");
        if (!price.ok) return { error: price.error };
        input.pricePerKg = price.value;
      }
    }
    return formatResult(computeCivilSteel(key in CONFIG ? key : "civil-steel-weight-calculator", input), num);
  }, [a, b, config.mode, d, key, l, n, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "weight" || config.mode === "cost") ? (
            <>
              <div><FieldLabel htmlFor="cs-d">Bar diameter (mm)</FieldLabel><FieldInput id="cs-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cs-l">Length per bar (m)</FieldLabel><FieldInput id="cs-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cs-n">Number of bars</FieldLabel><FieldInput id="cs-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
              {config.mode === "cost" ? (
                <div><FieldLabel htmlFor="cs-p">Price per kg</FieldLabel><FieldInput id="cs-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              ) : null}
            </>
          ) : null}
          {config.mode === "lap" ? (
            <>
              <div><FieldLabel htmlFor="cs-d">Bar diameter (mm)</FieldLabel><FieldInput id="cs-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cs-r">Lap factor (×d, default 40)</FieldLabel><FieldInput id="cs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "development" ? (
            <>
              <div><FieldLabel htmlFor="cs-d">Bar diameter (mm)</FieldLabel><FieldInput id="cs-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cs-a">Concrete grade fck (MPa)</FieldLabel><FieldInput id="cs-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cs-b">Steel fy (MPa)</FieldLabel><FieldInput id="cs-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cs-r">Ld factor (optional)</FieldLabel><FieldInput id="cs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
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
