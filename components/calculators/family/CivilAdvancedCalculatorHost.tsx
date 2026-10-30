"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilAdvanced,
  type CivilAdvancedInput,
  type CivilAdvancedResult,
  type CivilAdvancedSlug,
} from "@/lib/calculators/civilAdvanced";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "earthwork"
  | "retaining"
  | "stair"
  | "formwork"
  | "scaffold"
  | "wind"
  | "seismic"
  | "bearing"
  | "compaction";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  dDefault: string;
  tDefault: string;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  nDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilAdvancedSlug, Config> = {
  "civil-earthwork-calculator": {
    title: "Earthwork volume", description: `Bank volume L×W×D. ${DISCLAIMER}`,
    mode: "earthwork", lDefault: "20", wDefault: "10", hDefault: "", dDefault: "2", tDefault: "", aDefault: "", bDefault: "", rDefault: "", nDefault: "",
  },
  "civil-retaining-wall-calculator": {
    title: "Retaining wall volume", description: `Stem concrete volume only. ${DISCLAIMER}`,
    mode: "retaining", lDefault: "15", wDefault: "", hDefault: "3", dDefault: "", tDefault: "0.25", aDefault: "", bDefault: "", rDefault: "", nDefault: "",
  },
  "civil-staircase-calculator": {
    title: "Staircase geometry", description: `Riser count and going length. ${DISCLAIMER}`,
    mode: "stair", lDefault: "", wDefault: "", hDefault: "3", dDefault: "", tDefault: "", aDefault: "175", bDefault: "250", rDefault: "", nDefault: "",
  },
  "civil-formwork-calculator": {
    title: "Formwork area", description: `Contact area ≈ sides + soffit. ${DISCLAIMER}`,
    mode: "formwork", lDefault: "5", wDefault: "0.4", hDefault: "0.5", dDefault: "", tDefault: "", aDefault: "", bDefault: "", rDefault: "", nDefault: "",
  },
  "civil-shuttering-calculator": {
    title: "Shuttering area", description: `Shuttering contact area estimate. ${DISCLAIMER}`,
    mode: "formwork", lDefault: "6", wDefault: "0.3", hDefault: "0.45", dDefault: "", tDefault: "", aDefault: "", bDefault: "", rDefault: "", nDefault: "",
  },
  "civil-scaffolding-calculator": {
    title: "Scaffolding area", description: `Face area L×H for hire estimate. ${DISCLAIMER}`,
    mode: "scaffold", lDefault: "12", wDefault: "", hDefault: "8", dDefault: "", tDefault: "", aDefault: "", bDefault: "", rDefault: "", nDefault: "",
  },
  "civil-wind-load-calculator": {
    title: "Wind load (educational)", description: `F = ½ρv²·Cd·A proxy. ${DISCLAIMER}`,
    mode: "wind", lDefault: "", wDefault: "", hDefault: "", dDefault: "", tDefault: "", aDefault: "20", bDefault: "1.2", rDefault: "30", nDefault: "",
  },
  "civil-seismic-load-calculator": {
    title: "Seismic base shear proxy", description: `V ≈ Ah×W. ${DISCLAIMER}`,
    mode: "seismic", lDefault: "", wDefault: "", hDefault: "", dDefault: "", tDefault: "", aDefault: "5000", bDefault: "", rDefault: "0.1", nDefault: "",
  },
  "civil-bearing-capacity-calculator": {
    title: "Bearing capacity (φ=0 proxy)", description: `Undrained ultimate 5.14c+γD. ${DISCLAIMER}`,
    mode: "bearing", lDefault: "", wDefault: "2", hDefault: "", dDefault: "1", tDefault: "", aDefault: "25", bDefault: "18", rDefault: "", nDefault: "",
  },
  "civil-soil-compaction-calculator": {
    title: "Soil compaction", description: `Relative compaction = γd/MDD × 100%. ${DISCLAIMER}`,
    mode: "compaction", lDefault: "", wDefault: "", hDefault: "", dDefault: "", tDefault: "", aDefault: "1.85", bDefault: "2.0", rDefault: "", nDefault: "",
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

function formatResult(res: CivilAdvancedResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.volumeM3 !== undefined) rows.push({ label: "Volume (m³)", value: num(res.volumeM3, 2) });
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.risers !== undefined) rows.push({ label: "Risers", value: num(res.risers, 0) });
  if (res.goingM !== undefined) rows.push({ label: "Going (m)", value: num(res.goingM, 2) });
  if (res.loadKN !== undefined) rows.push({ label: "Load (kN)", value: num(res.loadKN, 1) });
  if (res.bearingKPa !== undefined) rows.push({ label: "Bearing (kPa)", value: num(res.bearingKPa, 1) });
  if (res.compactionPct !== undefined) rows.push({ label: "Compaction (%)", value: num(res.compactionPct, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.compactionPct !== undefined ? num(res.compactionPct, 1)
    : res.bearingKPa !== undefined ? num(res.bearingKPa, 1)
    : res.loadKN !== undefined ? num(res.loadKN, 1)
    : res.risers !== undefined ? num(res.risers, 0)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 2)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel =
    res.compactionPct !== undefined ? "Compaction (%)"
    : res.bearingKPa !== undefined ? "Ultimate bearing (kPa)"
    : res.loadKN !== undefined ? "Load (kN)"
    : res.risers !== undefined ? "Riser count"
    : res.volumeM3 !== undefined ? "Volume (m³)"
    : "Area (m²)";
  return { primary, primaryLabel, rows };
}

export function CivilAdvancedCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilAdvancedSlug;
  const config = CONFIG[key] ?? CONFIG["civil-earthwork-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(CIVIL_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [t, setT] = useState(useLoanInitialInput(CIVIL_URL.T, config.tDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "earthwork":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d);
        break;
      case "retaining":
        put(CIVIL_URL.L, l); put(CIVIL_URL.H, h); put(CIVIL_URL.T, t);
        break;
      case "stair":
        put(CIVIL_URL.H, h); put(CIVIL_URL.A, a); put(CIVIL_URL.B, b); put(CIVIL_URL.N, n);
        break;
      case "formwork":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.H, h);
        break;
      case "scaffold":
        put(CIVIL_URL.L, l); put(CIVIL_URL.H, h);
        break;
      case "wind":
        put(CIVIL_URL.A, a); put(CIVIL_URL.B, b); put(CIVIL_URL.R, r);
        break;
      case "seismic":
        put(CIVIL_URL.A, a); put(CIVIL_URL.R, r);
        break;
      case "bearing":
        put(CIVIL_URL.W, w); put(CIVIL_URL.D, d); put(CIVIL_URL.A, a); put(CIVIL_URL.B, b);
        break;
      case "compaction":
        put(CIVIL_URL.A, a); put(CIVIL_URL.B, b);
        break;
    }
    return out;
  }, [a, b, config.mode, d, h, l, n, r, t, w]);

  useLoanUrlSync(shareParams, [a, b, d, h, l, n, r, t, w]);

  const result = useMemo(() => {
    const input: CivilAdvancedInput = {};
    if (config.mode === "earthwork") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      const D = parsePositive(d, "Depth (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      if (!D.ok) return { error: D.error };
      input.lengthM = L.value; input.widthM = W.value; input.depthM = D.value;
    } else if (config.mode === "retaining") {
      const L = parsePositive(l, "Length (m)");
      const H = parsePositive(h, "Height (m)");
      const T = parsePositive(t, "Thickness (m)");
      if (!L.ok) return { error: L.error };
      if (!H.ok) return { error: H.error };
      if (!T.ok) return { error: T.error };
      input.lengthM = L.value; input.heightM = H.value; input.thicknessM = T.value;
    } else if (config.mode === "stair") {
      const H = parsePositive(h, "Total rise (m)");
      if (!H.ok) return { error: H.error };
      input.heightM = H.value;
      if (a.trim() !== "") {
        const riser = parsePositive(a, "Riser (mm)");
        if (!riser.ok) return { error: riser.error };
        input.riserMm = riser.value;
      }
      if (b.trim() !== "") {
        const tread = parsePositive(b, "Tread (mm)");
        if (!tread.ok) return { error: tread.error };
        input.treadMm = tread.value;
      }
      if (n.trim() !== "") {
        const risers = parsePositive(n, "Risers");
        if (!risers.ok) return { error: risers.error };
        input.risers = risers.value;
      }
    } else if (config.mode === "formwork") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      const H = parsePositive(h, "Height/depth (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      if (!H.ok) return { error: H.error };
      input.lengthM = L.value; input.widthM = W.value; input.heightM = H.value;
    } else if (config.mode === "scaffold") {
      const L = parsePositive(l, "Length (m)");
      const H = parsePositive(h, "Height (m)");
      if (!L.ok) return { error: L.error };
      if (!H.ok) return { error: H.error };
      input.lengthM = L.value; input.heightM = H.value;
    } else if (config.mode === "wind") {
      const area = parsePositive(a, "Area (m²)");
      const speed = parsePositive(r, "Wind speed (m/s)");
      if (!area.ok) return { error: area.error };
      if (!speed.ok) return { error: speed.error };
      input.areaM2 = area.value; input.windSpeedMs = speed.value;
      if (b.trim() !== "") {
        const cd = parsePositive(b, "Cd");
        if (!cd.ok) return { error: cd.error };
        input.Cd = cd.value;
      }
    } else if (config.mode === "seismic") {
      const weight = parsePositive(a, "Seismic weight (kN)");
      if (!weight.ok) return { error: weight.error };
      input.weightKN = weight.value;
      if (r.trim() !== "") {
        const ah = parsePositive(r, "Seismic coefficient");
        if (!ah.ok) return { error: ah.error };
        input.seismicCoeff = ah.value;
      }
    } else if (config.mode === "bearing") {
      const B = parsePositive(w, "Footing width (m)");
      if (!B.ok) return { error: B.error };
      input.footingWidthM = B.value;
      if (d.trim() !== "") {
        const depth = parsePositive(d, "Depth (m)");
        if (!depth.ok) return { error: depth.error };
        input.depthM = depth.value;
      }
      if (a.trim() !== "") {
        const coh = parseNonNegative(a, "Cohesion (kPa)");
        if (!coh.ok) return { error: coh.error };
        input.cohesionKPa = coh.value;
      }
      if (b.trim() !== "") {
        const gamma = parsePositive(b, "Unit weight (kN/m³)");
        if (!gamma.ok) return { error: gamma.error };
        input.gammaKN = gamma.value;
      }
    } else {
      const dd = parsePositive(a, "Dry density");
      const mdd = parsePositive(b, "Max dry density");
      if (!dd.ok) return { error: dd.error };
      if (!mdd.ok) return { error: mdd.error };
      input.dryDensity = dd.value; input.maxDryDensity = mdd.value;
    }
    return formatResult(computeCivilAdvanced(key in CONFIG ? key : "civil-earthwork-calculator", input), num);
  }, [a, b, config.mode, d, h, key, l, n, r, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "earthwork" ? (
            <>
              <div><FieldLabel htmlFor="ca-l">Length (m)</FieldLabel><FieldInput id="ca-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-w">Width (m)</FieldLabel><FieldInput id="ca-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-d">Depth (m)</FieldLabel><FieldInput id="ca-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "retaining" ? (
            <>
              <div><FieldLabel htmlFor="ca-l">Wall length (m)</FieldLabel><FieldInput id="ca-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-h">Height (m)</FieldLabel><FieldInput id="ca-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-t">Thickness (m)</FieldLabel><FieldInput id="ca-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "stair" ? (
            <>
              <div><FieldLabel htmlFor="ca-h">Total rise (m)</FieldLabel><FieldInput id="ca-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-a">Riser (mm)</FieldLabel><FieldInput id="ca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-b">Tread (mm)</FieldLabel><FieldInput id="ca-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-n">Risers (optional override)</FieldLabel><FieldInput id="ca-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "formwork" ? (
            <>
              <div><FieldLabel htmlFor="ca-l">Length (m)</FieldLabel><FieldInput id="ca-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-w">Width (m)</FieldLabel><FieldInput id="ca-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-h">Height / depth (m)</FieldLabel><FieldInput id="ca-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "scaffold" ? (
            <>
              <div><FieldLabel htmlFor="ca-l">Scaffold length (m)</FieldLabel><FieldInput id="ca-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-h">Height (m)</FieldLabel><FieldInput id="ca-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "wind" ? (
            <>
              <div><FieldLabel htmlFor="ca-a">Reference area (m²)</FieldLabel><FieldInput id="ca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-r">Wind speed (m/s)</FieldLabel><FieldInput id="ca-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-b">Drag coefficient Cd</FieldLabel><FieldInput id="ca-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "seismic" ? (
            <>
              <div><FieldLabel htmlFor="ca-a">Seismic weight W (kN)</FieldLabel><FieldInput id="ca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-r">Coefficient Ah</FieldLabel><FieldInput id="ca-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bearing" ? (
            <>
              <div><FieldLabel htmlFor="ca-w">Footing width B (m)</FieldLabel><FieldInput id="ca-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-d">Embedment depth D (m)</FieldLabel><FieldInput id="ca-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-a">Cohesion c (kPa)</FieldLabel><FieldInput id="ca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-b">Unit weight γ (kN/m³)</FieldLabel><FieldInput id="ca-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "compaction" ? (
            <>
              <div><FieldLabel htmlFor="ca-a">Dry density (g/cm³ or t/m³)</FieldLabel><FieldInput id="ca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ca-b">Max dry density (MDD)</FieldLabel><FieldInput id="ca-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
