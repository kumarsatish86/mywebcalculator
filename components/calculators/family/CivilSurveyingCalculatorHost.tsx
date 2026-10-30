"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilSurveying,
  type CivilSurveyingInput,
  type CivilSurveyingResult,
  type CivilSurveyingSlug,
} from "@/lib/calculators/civilSurveying";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "leveling" | "slope" | "land" | "cutFill";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  lDefault: string;
  wDefault: string;
  dDefault: string;
  tDefault: string;
  qDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilSurveyingSlug, Config> = {
  "civil-leveling-calculator": {
    title: "Leveling (HI / RL)", description: `RL = HI − sight; HI = RL + BS. ${DISCLAIMER}`,
    mode: "leveling", aDefault: "1.25", bDefault: "100", cDefault: "1.5", lDefault: "", wDefault: "", dDefault: "", tDefault: "", qDefault: "",
  },
  "civil-elevation-calculator": {
    title: "Elevation calculator", description: `Reduced level from backsight and foresight. ${DISCLAIMER}`,
    mode: "leveling", aDefault: "1.1", bDefault: "98.5", cDefault: "1.35", lDefault: "", wDefault: "", dDefault: "", tDefault: "", qDefault: "",
  },
  "civil-slope-calculator-civil": {
    title: "Slope calculator", description: `Slope % and 1:n from rise and run. ${DISCLAIMER}`,
    mode: "slope", aDefault: "2", bDefault: "20", cDefault: "", lDefault: "", wDefault: "", dDefault: "", tDefault: "", qDefault: "",
  },
  "civil-land-survey-calculator": {
    title: "Land survey area", description: `Rectangular parcel area. ${DISCLAIMER}`,
    mode: "land", aDefault: "", bDefault: "", cDefault: "", lDefault: "25", wDefault: "15", dDefault: "", tDefault: "", qDefault: "",
  },
  "civil-cut-fill-calculator": {
    title: "Cut & fill", description: `Prismoidal volume from area × depth. ${DISCLAIMER}`,
    mode: "cutFill", aDefault: "", bDefault: "", cDefault: "", lDefault: "50", wDefault: "30", dDefault: "1.2", tDefault: "0.8", qDefault: "",
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

function formatResult(res: CivilSurveyingResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.hi !== undefined) rows.push({ label: "Height of instrument", value: num(res.hi, 3) });
  if (res.rl !== undefined) rows.push({ label: "Reduced level", value: num(res.rl, 3) });
  if (res.slopePct !== undefined) rows.push({ label: "Slope (%)", value: num(res.slopePct, 2) });
  if (res.slopeRatio !== undefined) rows.push({ label: "Ratio", value: res.slopeRatio });
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.cutM3 !== undefined) rows.push({ label: "Cut (m³)", value: num(res.cutM3, 2) });
  if (res.fillM3 !== undefined) rows.push({ label: "Fill (m³)", value: num(res.fillM3, 2) });
  if (res.netM3 !== undefined) rows.push({ label: "Net (m³)", value: num(res.netM3, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.rl !== undefined ? num(res.rl, 3)
    : res.slopePct !== undefined ? num(res.slopePct, 2)
    : res.netM3 !== undefined ? num(res.netM3, 2)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel =
    res.rl !== undefined ? "Reduced level"
    : res.slopePct !== undefined ? "Slope (%)"
    : res.netM3 !== undefined ? "Net earthwork (m³)"
    : "Area (m²)";
  return { primary, primaryLabel, rows };
}

export function CivilSurveyingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilSurveyingSlug;
  const config = CONFIG[key] ?? CONFIG["civil-leveling-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CIVIL_URL.C, config.cDefault));
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [t, setT] = useState(useLoanInitialInput(CIVIL_URL.T, config.tDefault));
  const [q, setQ] = useState(useLoanInitialInput(CIVIL_URL.Q, config.qDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "leveling":
        put(CIVIL_URL.A, a); put(CIVIL_URL.B, b); put(CIVIL_URL.C, c);
        break;
      case "slope":
        put(CIVIL_URL.A, a); put(CIVIL_URL.B, b);
        break;
      case "land":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w);
        break;
      case "cutFill":
        put(CIVIL_URL.Q, q); put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d); put(CIVIL_URL.T, t);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, l, q, t, w]);

  useLoanUrlSync(shareParams, [a, b, c, d, l, q, t, w]);

  const result = useMemo(() => {
    const input: CivilSurveyingInput = {};
    if (config.mode === "leveling") {
      const bs = parseFiniteNumber(a, "Backsight");
      const rl = parseFiniteNumber(b, "Known RL");
      if (!bs.ok) return { error: bs.error };
      if (!rl.ok) return { error: rl.error };
      input.bs = bs.value; input.knownRL = rl.value;
      if (c.trim() !== "") {
        const fs = parseFiniteNumber(c, "Foresight / IS");
        if (!fs.ok) return { error: fs.error };
        input.fs = fs.value;
      }
    } else if (config.mode === "slope") {
      const rise = parseFiniteNumber(a, "Rise");
      const run = parsePositive(b, "Run");
      if (!rise.ok) return { error: rise.error };
      if (!run.ok) return { error: run.error };
      input.rise = rise.value; input.run = run.value;
    } else if (config.mode === "land") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      input.lengthM = L.value; input.widthM = W.value;
    } else {
      if (q.trim() !== "") {
        const area = parsePositive(q, "Area (m²)");
        if (!area.ok) return { error: area.error };
        input.areaM2 = area.value;
      } else {
        const L = parsePositive(l, "Length (m)");
        const W = parsePositive(w, "Width (m)");
        if (!L.ok) return { error: L.error };
        if (!W.ok) return { error: W.error };
        input.lengthM = L.value; input.widthM = W.value;
      }
      if (d.trim() !== "") {
        const cut = parsePositive(d, "Cut depth (m)");
        if (!cut.ok) return { error: cut.error };
        input.cutDepthM = cut.value;
      }
      if (t.trim() !== "") {
        const fill = parsePositive(t, "Fill depth (m)");
        if (!fill.ok) return { error: fill.error };
        input.fillDepthM = fill.value;
      }
    }
    return formatResult(computeCivilSurveying(key in CONFIG ? key : "civil-leveling-calculator", input), num);
  }, [a, b, c, config.mode, d, key, l, q, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "leveling" ? (
            <>
              <div><FieldLabel htmlFor="csu-a">Backsight (m)</FieldLabel><FieldInput id="csu-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-b">Known RL (m)</FieldLabel><FieldInput id="csu-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-c">Foresight / IS (m, optional)</FieldLabel><FieldInput id="csu-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "slope" ? (
            <>
              <div><FieldLabel htmlFor="csu-a">Rise (m)</FieldLabel><FieldInput id="csu-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-b">Run (m)</FieldLabel><FieldInput id="csu-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "land" ? (
            <>
              <div><FieldLabel htmlFor="csu-l">Length (m)</FieldLabel><FieldInput id="csu-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-w">Width (m)</FieldLabel><FieldInput id="csu-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cutFill" ? (
            <>
              <div><FieldLabel htmlFor="csu-q">Area (m², optional)</FieldLabel><FieldInput id="csu-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-l">Length (m)</FieldLabel><FieldInput id="csu-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-w">Width (m)</FieldLabel><FieldInput id="csu-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-d">Cut depth (m)</FieldLabel><FieldInput id="csu-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="csu-t">Fill depth (m)</FieldLabel><FieldInput id="csu-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
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
