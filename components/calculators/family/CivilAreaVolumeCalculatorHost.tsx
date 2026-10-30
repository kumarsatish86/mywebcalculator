"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilAreaVolume,
  type CivilAreaVolumeInput,
  type CivilAreaVolumeResult,
  type CivilAreaVolumeSlug,
} from "@/lib/calculators/civilAreaVolume";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "areaShape" | "volume" | "perimeter" | "rectArea" | "carpet" | "excavation";

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
  nDefault: string;
  qDefault: string;
  pDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilAreaVolumeSlug, Config> = {
  "civil-area-calculator-shapes": {
    title: "Area (shapes)", description: `Rectangle, triangle, or circle plan area. ${DISCLAIMER}`,
    mode: "areaShape", lDefault: "10", wDefault: "5", hDefault: "", dDefault: "", rDefault: "3", aDefault: "rectangle", nDefault: "", qDefault: "", pDefault: "",
  },
  "civil-volume-calculator": {
    title: "Volume calculator", description: `Rectangular prism volume L×W×H. ${DISCLAIMER}`,
    mode: "volume", lDefault: "5", wDefault: "4", hDefault: "0.2", dDefault: "", rDefault: "", aDefault: "", nDefault: "", qDefault: "", pDefault: "",
  },
  "civil-perimeter-calculator": {
    title: "Perimeter calculator", description: `Rectangle or regular polygon perimeter. ${DISCLAIMER}`,
    mode: "perimeter", lDefault: "10", wDefault: "5", hDefault: "", dDefault: "", rDefault: "4", aDefault: "", nDefault: "6", qDefault: "", pDefault: "",
  },
  "civil-floor-area-calculator": {
    title: "Floor area", description: `Floor plate area (rectangle). ${DISCLAIMER}`,
    mode: "rectArea", lDefault: "12", wDefault: "8", hDefault: "", dDefault: "", rDefault: "", aDefault: "", nDefault: "", qDefault: "", pDefault: "",
  },
  "civil-built-up-area-calculator": {
    title: "Built-up area", description: `Outer dimensions product (simplified). ${DISCLAIMER}`,
    mode: "rectArea", lDefault: "12", wDefault: "8", hDefault: "", dDefault: "", rDefault: "", aDefault: "", nDefault: "", qDefault: "", pDefault: "",
  },
  "civil-carpet-area-calculator": {
    title: "Carpet area", description: `Carpet ≈ built-up × factor (default 0.7). ${DISCLAIMER}`,
    mode: "carpet", lDefault: "12", wDefault: "8", hDefault: "", dDefault: "", rDefault: "", aDefault: "", nDefault: "", qDefault: "96", pDefault: "0.7",
  },
  "civil-plot-area-calculator": {
    title: "Plot area", description: `Site/plot rectangle area. ${DISCLAIMER}`,
    mode: "rectArea", lDefault: "20", wDefault: "15", hDefault: "", dDefault: "", rDefault: "", aDefault: "", nDefault: "", qDefault: "", pDefault: "",
  },
  "civil-excavation-volume-calculator": {
    title: "Excavation volume", description: `Bank excavation L×W×depth. ${DISCLAIMER}`,
    mode: "excavation", lDefault: "10", wDefault: "5", hDefault: "", dDefault: "1.5", rDefault: "", aDefault: "", nDefault: "", qDefault: "", pDefault: "",
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

function formatResult(res: CivilAreaVolumeResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.volumeM3 !== undefined) rows.push({ label: "Volume (m³)", value: num(res.volumeM3, 3) });
  if (res.perimeterM !== undefined) rows.push({ label: "Perimeter (m)", value: num(res.perimeterM, 2) });
  if (res.builtUpM2 !== undefined) rows.push({ label: "Built-up (m²)", value: num(res.builtUpM2, 2) });
  if (res.carpetM2 !== undefined) rows.push({ label: "Carpet (m²)", value: num(res.carpetM2, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.carpetM2 !== undefined ? num(res.carpetM2, 2)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 3)
    : res.perimeterM !== undefined ? num(res.perimeterM, 2)
    : res.builtUpM2 !== undefined ? num(res.builtUpM2, 2)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel =
    res.carpetM2 !== undefined ? "Carpet area (m²)"
    : res.volumeM3 !== undefined ? "Volume (m³)"
    : res.perimeterM !== undefined ? "Perimeter (m)"
    : "Area (m²)";
  return { primary, primaryLabel, rows };
}

export function CivilAreaVolumeCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilAreaVolumeSlug;
  const config = CONFIG[key] ?? CONFIG["civil-area-calculator-shapes"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(CIVIL_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));
  const [q, setQ] = useState(useLoanInitialInput(CIVIL_URL.Q, config.qDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "areaShape":
        put(CIVIL_URL.A, a); put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.R, r);
        break;
      case "volume":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.H, h);
        break;
      case "perimeter":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.N, n); put(CIVIL_URL.R, r);
        break;
      case "rectArea":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w);
        break;
      case "carpet":
        put(CIVIL_URL.Q, q); put(CIVIL_URL.P, p); put(CIVIL_URL.L, l); put(CIVIL_URL.W, w);
        break;
      case "excavation":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d);
        break;
    }
    return out;
  }, [a, config.mode, d, h, l, n, p, q, r, w]);

  useLoanUrlSync(shareParams, [a, d, h, l, n, p, q, r, w]);

  const result = useMemo(() => {
    const input: CivilAreaVolumeInput = {};
    if (config.mode === "areaShape") {
      input.shape = a.trim() || "rectangle";
      if (input.shape.toLowerCase() === "circle") {
        const rad = parsePositive(r, "Radius (m)");
        if (!rad.ok) return { error: rad.error };
        input.radiusM = rad.value;
      } else {
        const L = parsePositive(l, "Length/base (m)");
        if (!L.ok) return { error: L.error };
        input.lengthM = L.value;
        if (input.shape.toLowerCase() === "triangle") {
          const H = parsePositive(w, "Height (m)");
          if (!H.ok) return { error: H.error };
          input.widthM = H.value;
        } else {
          const W = parsePositive(w, "Width (m)");
          if (!W.ok) return { error: W.error };
          input.widthM = W.value;
        }
      }
    } else if (config.mode === "volume") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      const H = parsePositive(h, "Height (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      if (!H.ok) return { error: H.error };
      input.lengthM = L.value; input.widthM = W.value; input.heightM = H.value;
    } else if (config.mode === "perimeter") {
      if (n.trim() !== "" && r.trim() !== "") {
        const sides = parsePositive(n, "Sides");
        const side = parsePositive(r, "Side length (m)");
        if (!sides.ok) return { error: sides.error };
        if (!side.ok) return { error: side.error };
        input.sides = sides.value; input.sideM = side.value;
      } else {
        const L = parsePositive(l, "Length (m)");
        const W = parsePositive(w, "Width (m)");
        if (!L.ok) return { error: L.error };
        if (!W.ok) return { error: W.error };
        input.lengthM = L.value; input.widthM = W.value;
      }
    } else if (config.mode === "carpet") {
      if (q.trim() !== "") {
        const built = parsePositive(q, "Built-up area (m²)");
        if (!built.ok) return { error: built.error };
        input.builtUpM2 = built.value;
      } else {
        const L = parsePositive(l, "Length (m)");
        const W = parsePositive(w, "Width (m)");
        if (!L.ok) return { error: L.error };
        if (!W.ok) return { error: W.error };
        input.lengthM = L.value; input.widthM = W.value;
      }
      if (p.trim() !== "") {
        const f = parsePositive(p, "Carpet factor");
        if (!f.ok) return { error: f.error };
        input.carpetFactor = f.value;
      }
    } else if (config.mode === "excavation") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      const D = parsePositive(d, "Depth (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      if (!D.ok) return { error: D.error };
      input.lengthM = L.value; input.widthM = W.value; input.depthM = D.value;
    } else {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      input.lengthM = L.value; input.widthM = W.value;
    }
    return formatResult(computeCivilAreaVolume(key in CONFIG ? key : "civil-area-calculator-shapes", input), num);
  }, [a, config.mode, d, h, key, l, n, p, q, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "areaShape" ? (
            <>
              <div><FieldLabel htmlFor="cav-a">Shape (rectangle, triangle, circle)</FieldLabel><FieldInput id="cav-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="cav-l">Length / base (m)</FieldLabel><FieldInput id="cav-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-w">Width / height (m)</FieldLabel><FieldInput id="cav-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-r">Radius (m, circle)</FieldLabel><FieldInput id="cav-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "volume" ? (
            <>
              <div><FieldLabel htmlFor="cav-l">Length (m)</FieldLabel><FieldInput id="cav-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-w">Width (m)</FieldLabel><FieldInput id="cav-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-h">Height (m)</FieldLabel><FieldInput id="cav-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "perimeter" ? (
            <>
              <div><FieldLabel htmlFor="cav-l">Length (m, rectangle)</FieldLabel><FieldInput id="cav-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-w">Width (m, rectangle)</FieldLabel><FieldInput id="cav-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-n">Sides (polygon)</FieldLabel><FieldInput id="cav-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="cav-r">Side length (m, polygon)</FieldLabel><FieldInput id="cav-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "rectArea" ? (
            <>
              <div><FieldLabel htmlFor="cav-l">Length (m)</FieldLabel><FieldInput id="cav-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-w">Width (m)</FieldLabel><FieldInput id="cav-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "carpet" ? (
            <>
              <div><FieldLabel htmlFor="cav-q">Built-up area (m², optional)</FieldLabel><FieldInput id="cav-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-l">Length (m, if no built-up)</FieldLabel><FieldInput id="cav-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-w">Width (m)</FieldLabel><FieldInput id="cav-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-p">Carpet factor (0–1)</FieldLabel><FieldInput id="cav-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "excavation" ? (
            <>
              <div><FieldLabel htmlFor="cav-l">Length (m)</FieldLabel><FieldInput id="cav-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-w">Width (m)</FieldLabel><FieldInput id="cav-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cav-d">Depth (m)</FieldLabel><FieldInput id="cav-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
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
