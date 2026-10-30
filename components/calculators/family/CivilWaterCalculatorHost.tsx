"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilWater,
  type CivilWaterInput,
  type CivilWaterResult,
  type CivilWaterSlug,
} from "@/lib/calculators/civilWater";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "tank" | "pipeVol" | "flow" | "drainage" | "harvest" | "plumbing";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  dDefault: string;
  rDefault: string;
  aDefault: string;
  bDefault: string;
  nDefault: string;
  pDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilWaterSlug, Config> = {
  "civil-water-tank-volume-calculator": {
    title: "Water tank volume", description: `Tank capacity (rect or cylinder). ${DISCLAIMER}`,
    mode: "tank", lDefault: "3", wDefault: "2", hDefault: "2", dDefault: "", rDefault: "1", aDefault: "rect", bDefault: "", nDefault: "", pDefault: "",
  },
  "civil-pipe-volume-calculator": {
    title: "Pipe volume", description: `Internal pipe volume (full bore). ${DISCLAIMER}`,
    mode: "pipeVol", lDefault: "50", wDefault: "", hDefault: "", dDefault: "0.1", rDefault: "", aDefault: "", bDefault: "", nDefault: "", pDefault: "",
  },
  "civil-flow-rate-calculator-civil": {
    title: "Flow rate", description: `Q = A × velocity. ${DISCLAIMER}`,
    mode: "flow", lDefault: "", wDefault: "", hDefault: "", dDefault: "0.2", rDefault: "1.5", aDefault: "", bDefault: "", nDefault: "", pDefault: "",
  },
  "civil-drainage-calculator": {
    title: "Drainage runoff", description: `Educational C·i·A runoff. ${DISCLAIMER}`,
    mode: "drainage", lDefault: "", wDefault: "", hDefault: "", dDefault: "", rDefault: "", aDefault: "500", bDefault: "0.7", nDefault: "", pDefault: "50",
  },
  "civil-rainwater-harvesting-calculator": {
    title: "Rainwater harvesting", description: `Harvest from roof area × rainfall. ${DISCLAIMER}`,
    mode: "harvest", lDefault: "", wDefault: "", hDefault: "", dDefault: "", rDefault: "", aDefault: "120", bDefault: "0.8", nDefault: "", pDefault: "100",
  },
  "civil-plumbing-material-calculator": {
    title: "Plumbing material", description: `Pipe run and fittings allowance. ${DISCLAIMER}`,
    mode: "plumbing", lDefault: "30", wDefault: "", hDefault: "", dDefault: "", rDefault: "", aDefault: "", bDefault: "", nDefault: "10", pDefault: "",
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

function formatResult(res: CivilWaterResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.volumeM3 !== undefined) rows.push({ label: "Volume (m³)", value: num(res.volumeM3, 3) });
  if (res.volumeL !== undefined) rows.push({ label: "Volume (L)", value: num(res.volumeL, 0) });
  if (res.flowM3s !== undefined) rows.push({ label: "Flow (m³/s)", value: num(res.flowM3s, 4) });
  if (res.flowLps !== undefined) rows.push({ label: "Flow (L/s)", value: num(res.flowLps, 2) });
  if (res.harvestM3 !== undefined) rows.push({ label: "Harvest (m³)", value: num(res.harvestM3, 2) });
  if (res.pipeLengthM !== undefined) rows.push({ label: "Pipe length (m)", value: num(res.pipeLengthM, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.harvestM3 !== undefined ? num(res.harvestM3, 2)
    : res.flowLps !== undefined ? num(res.flowLps, 2)
    : res.volumeL !== undefined ? num(res.volumeL, 0)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 3)
    : res.pipeLengthM !== undefined ? num(res.pipeLengthM, 1)
    : "—";
  const primaryLabel =
    res.harvestM3 !== undefined ? "Harvest (m³)"
    : res.flowLps !== undefined ? "Flow (L/s)"
    : res.volumeL !== undefined ? "Volume (L)"
    : res.pipeLengthM !== undefined ? "Pipe length (m)"
    : "Volume (m³)";
  return { primary, primaryLabel, rows };
}

export function CivilWaterCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilWaterSlug;
  const config = CONFIG[key] ?? CONFIG["civil-water-tank-volume-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(CIVIL_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "tank":
        put(CIVIL_URL.A, a); put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.H, h); put(CIVIL_URL.R, r);
        break;
      case "pipeVol":
        put(CIVIL_URL.D, d); put(CIVIL_URL.L, l);
        break;
      case "flow":
        put(CIVIL_URL.D, d); put(CIVIL_URL.R, r); put(CIVIL_URL.A, a);
        break;
      case "drainage":
      case "harvest":
        put(CIVIL_URL.A, a); put(CIVIL_URL.P, p); put(CIVIL_URL.B, b);
        break;
      case "plumbing":
        put(CIVIL_URL.L, l); put(CIVIL_URL.N, n);
        break;
    }
    return out;
  }, [a, b, config.mode, d, h, l, n, p, r, w]);

  useLoanUrlSync(shareParams, [a, b, d, h, l, n, p, r, w]);

  const result = useMemo(() => {
    const input: CivilWaterInput = {};
    if (config.mode === "tank") {
      input.shape = a.trim() || "rect";
      const shape = input.shape.toLowerCase();
      if (shape === "cylinder" || shape === "circular") {
        if (r.trim() !== "") {
          const rad = parsePositive(r, "Radius (m)");
          if (!rad.ok) return { error: rad.error };
          input.radiusM = rad.value;
        } else if (d.trim() !== "") {
          const dia = parsePositive(d, "Diameter (m)");
          if (!dia.ok) return { error: dia.error };
          input.diameterM = dia.value;
        }
        const H = parsePositive(h, "Height (m)");
        if (!H.ok) return { error: H.error };
        input.heightM = H.value;
      } else {
        const L = parsePositive(l, "Length (m)");
        const W = parsePositive(w, "Width (m)");
        const H = parsePositive(h, "Height (m)");
        if (!L.ok) return { error: L.error };
        if (!W.ok) return { error: W.error };
        if (!H.ok) return { error: H.error };
        input.lengthM = L.value; input.widthM = W.value; input.heightM = H.value;
      }
    } else if (config.mode === "pipeVol") {
      const dia = parsePositive(d, "Diameter (m)");
      const len = parsePositive(l, "Length (m)");
      if (!dia.ok) return { error: dia.error };
      if (!len.ok) return { error: len.error };
      input.diameterM = dia.value; input.lengthM = len.value;
    } else if (config.mode === "flow") {
      const vel = parsePositive(r, "Velocity (m/s)");
      if (!vel.ok) return { error: vel.error };
      input.velocityMs = vel.value;
      if (a.trim() !== "") {
        const area = parsePositive(a, "Area (m²)");
        if (!area.ok) return { error: area.error };
        input.areaM2 = area.value;
      } else {
        const dia = parsePositive(d, "Diameter (m)");
        if (!dia.ok) return { error: dia.error };
        input.diameterM = dia.value;
      }
    } else if (config.mode === "drainage") {
      const area = parsePositive(a, "Catchment area (m²)");
      const rain = parsePositive(p, "Rainfall intensity (mm/h)");
      if (!area.ok) return { error: area.error };
      if (!rain.ok) return { error: rain.error };
      input.areaM2 = area.value; input.rainfallMm = rain.value;
      if (b.trim() !== "") {
        const coeff = parsePositive(b, "Runoff coefficient");
        if (!coeff.ok) return { error: coeff.error };
        input.runoffCoeff = coeff.value;
      }
    } else if (config.mode === "harvest") {
      const area = parsePositive(a, "Roof area (m²)");
      const rain = parsePositive(p, "Rainfall (mm)");
      if (!area.ok) return { error: area.error };
      if (!rain.ok) return { error: rain.error };
      input.areaM2 = area.value; input.rainfallMm = rain.value;
      if (b.trim() !== "") {
        const coeff = parsePositive(b, "Runoff coefficient");
        if (!coeff.ok) return { error: coeff.error };
        input.runoffCoeff = coeff.value;
      }
    } else {
      const len = parsePositive(l, "Pipe length (m)");
      if (!len.ok) return { error: len.error };
      input.pipeLengthM = len.value;
      if (n.trim() !== "") {
        const fit = parseNonNegative(n, "Fittings");
        if (!fit.ok) return { error: fit.error };
        input.fittings = fit.value;
      }
    }
    return formatResult(computeCivilWater(key in CONFIG ? key : "civil-water-tank-volume-calculator", input), num);
  }, [a, b, config.mode, d, h, key, l, n, p, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "tank" ? (
            <>
              <div><FieldLabel htmlFor="cw-a">Shape (rect, cylinder)</FieldLabel><FieldInput id="cw-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="cw-l">Length (m, rect)</FieldLabel><FieldInput id="cw-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-w">Width (m, rect)</FieldLabel><FieldInput id="cw-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-h">Height (m)</FieldLabel><FieldInput id="cw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-r">Radius (m, cylinder)</FieldLabel><FieldInput id="cw-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "pipeVol" ? (
            <>
              <div><FieldLabel htmlFor="cw-d">Diameter (m)</FieldLabel><FieldInput id="cw-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-l">Length (m)</FieldLabel><FieldInput id="cw-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "flow" ? (
            <>
              <div><FieldLabel htmlFor="cw-d">Pipe diameter (m)</FieldLabel><FieldInput id="cw-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-a">Area (m², optional override)</FieldLabel><FieldInput id="cw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-r">Velocity (m/s)</FieldLabel><FieldInput id="cw-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "drainage" ? (
            <>
              <div><FieldLabel htmlFor="cw-a">Catchment area (m²)</FieldLabel><FieldInput id="cw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-p">Rainfall intensity (mm/h)</FieldLabel><FieldInput id="cw-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-b">Runoff coefficient (optional)</FieldLabel><FieldInput id="cw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "harvest" ? (
            <>
              <div><FieldLabel htmlFor="cw-a">Roof / catchment area (m²)</FieldLabel><FieldInput id="cw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-p">Rainfall (mm)</FieldLabel><FieldInput id="cw-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-b">Runoff coefficient (optional)</FieldLabel><FieldInput id="cw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "plumbing" ? (
            <>
              <div><FieldLabel htmlFor="cw-l">Pipe length (m)</FieldLabel><FieldInput id="cw-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cw-n">Fittings count (optional)</FieldLabel><FieldInput id="cw-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
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
