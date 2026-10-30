"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilFoundation,
  type CivilFoundationInput,
  type CivilFoundationResult,
  type CivilFoundationSlug,
} from "@/lib/calculators/civilFoundation";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "footing" | "column" | "beam" | "slab" | "load" | "weight" | "pile";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  dDefault: string;
  hDefault: string;
  nDefault: string;
  aDefault: string;
  bDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilFoundationSlug, Config> = {
  "civil-footing-calculator": {
    title: "Footing calculator", description: `Rectangular footing concrete volume. ${DISCLAIMER}`,
    mode: "footing", lDefault: "2", wDefault: "2", dDefault: "0.5", hDefault: "", nDefault: "1", aDefault: "", bDefault: "",
  },
  "civil-foundation-volume-calculator": {
    title: "Foundation volume", description: `Foundation concrete quantity × count. ${DISCLAIMER}`,
    mode: "footing", lDefault: "2.5", wDefault: "2.5", dDefault: "0.6", hDefault: "", nDefault: "4", aDefault: "", bDefault: "",
  },
  "civil-column-calculator": {
    title: "Column calculator", description: `Column concrete volume × count. ${DISCLAIMER}`,
    mode: "column", lDefault: "0.4", wDefault: "0.4", dDefault: "", hDefault: "3", nDefault: "8", aDefault: "", bDefault: "",
  },
  "civil-beam-calculator": {
    title: "Beam calculator", description: `Beam concrete volume × count. ${DISCLAIMER}`,
    mode: "beam", lDefault: "5", wDefault: "0.3", dDefault: "0.5", hDefault: "", nDefault: "12", aDefault: "", bDefault: "",
  },
  "civil-slab-calculator": {
    title: "Slab calculator", description: `Slab area and concrete volume. ${DISCLAIMER}`,
    mode: "slab", lDefault: "10", wDefault: "8", dDefault: "0.15", hDefault: "", nDefault: "", aDefault: "", bDefault: "",
  },
  "civil-load-calculation-basic": {
    title: "Basic load calculation", description: `Area × (LL+DL) in kN. ${DISCLAIMER}`,
    mode: "load", lDefault: "10", wDefault: "8", dDefault: "", hDefault: "", nDefault: "", aDefault: "2", bDefault: "1",
  },
  "civil-structural-weight-calculator": {
    title: "Structural self-weight", description: `Volume × density. ${DISCLAIMER}`,
    mode: "weight", lDefault: "10", wDefault: "8", dDefault: "0.2", hDefault: "", nDefault: "1", aDefault: "2500", bDefault: "",
  },
  "civil-pile-foundation-calculator": {
    title: "Pile foundation", description: `Cylindrical pile concrete volume. ${DISCLAIMER}`,
    mode: "pile", lDefault: "", wDefault: "", dDefault: "0.45", hDefault: "12", nDefault: "6", aDefault: "", bDefault: "",
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

function formatResult(res: CivilFoundationResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.volumeM3 !== undefined) rows.push({ label: "Volume (m³)", value: num(res.volumeM3, 3) });
  if (res.loadKN !== undefined) rows.push({ label: "Load (kN)", value: num(res.loadKN, 1) });
  if (res.weightKg !== undefined) rows.push({ label: "Weight (kg)", value: num(res.weightKg, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.loadKN !== undefined ? num(res.loadKN, 1)
    : res.weightKg !== undefined ? num(res.weightKg, 0)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 3)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel =
    res.loadKN !== undefined ? "Total load (kN)"
    : res.weightKg !== undefined ? "Self-weight (kg)"
    : "Concrete volume (m³)";
  return { primary, primaryLabel, rows };
}

export function CivilFoundationCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilFoundationSlug;
  const config = CONFIG[key] ?? CONFIG["civil-footing-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [h, setH] = useState(useLoanInitialInput(CIVIL_URL.H, config.hDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "footing":
      case "beam":
      case "slab":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d);
        if (config.mode === "footing") put(CIVIL_URL.N, n);
        if (config.mode === "beam") put(CIVIL_URL.N, n);
        break;
      case "column":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.H, h); put(CIVIL_URL.N, n);
        break;
      case "load":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.A, a); put(CIVIL_URL.B, b);
        break;
      case "weight":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d); put(CIVIL_URL.N, n); put(CIVIL_URL.A, a);
        break;
      case "pile":
        put(CIVIL_URL.D, d); put(CIVIL_URL.H, h); put(CIVIL_URL.N, n);
        break;
    }
    return out;
  }, [a, b, config.mode, d, h, l, n, w]);

  useLoanUrlSync(shareParams, [a, b, d, h, l, n, w]);

  const result = useMemo(() => {
    const input: CivilFoundationInput = {};
    if (config.mode === "pile") {
      const dia = parsePositive(d, "Diameter (m)");
      const depth = parsePositive(h, "Pile length (m)");
      if (!dia.ok) return { error: dia.error };
      if (!depth.ok) return { error: depth.error };
      input.diameterM = dia.value;
      input.heightM = depth.value;
      if (n.trim() !== "") {
        const piles = parsePositive(n, "Pile count");
        if (!piles.ok) return { error: piles.error };
        input.piles = piles.value;
      }
    } else if (config.mode === "load") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      input.lengthM = L.value; input.widthM = W.value;
      if (a.trim() !== "") {
        const ll = parsePositive(a, "Live load (kPa)");
        if (!ll.ok) return { error: ll.error };
        input.liveLoadKPa = ll.value;
      }
      if (b.trim() !== "") {
        const dl = parsePositive(b, "Dead load (kPa)");
        if (!dl.ok) return { error: dl.error };
        input.deadLoadKPa = dl.value;
      }
    } else if (config.mode === "column") {
      const L = parsePositive(l, "Breadth (m)");
      const W = parsePositive(w, "Width (m)");
      const H = parsePositive(h, "Height (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      if (!H.ok) return { error: H.error };
      input.lengthM = L.value; input.widthM = W.value; input.heightM = H.value;
      if (n.trim() !== "") {
        const cnt = parsePositive(n, "Count");
        if (!cnt.ok) return { error: cnt.error };
        input.count = cnt.value;
      }
    } else if (config.mode === "weight") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      const D = parsePositive(d, "Thickness (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      if (!D.ok) return { error: D.error };
      input.lengthM = L.value; input.widthM = W.value; input.depthM = D.value;
      if (n.trim() !== "") {
        const cnt = parsePositive(n, "Count");
        if (!cnt.ok) return { error: cnt.error };
        input.count = cnt.value;
      }
      if (a.trim() !== "") {
        const dens = parsePositive(a, "Density (kg/m³)");
        if (!dens.ok) return { error: dens.error };
        input.densityKgM3 = dens.value;
      }
    } else {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      input.lengthM = L.value; input.widthM = W.value;
      if (config.mode !== "slab" || d.trim() !== "") {
        const D = parsePositive(d, config.mode === "beam" ? "Depth (m)" : "Thickness/depth (m)");
        if (!D.ok) return { error: D.error };
        input.depthM = D.value;
      }
      if ((config.mode === "footing" || config.mode === "beam") && n.trim() !== "") {
        const cnt = parsePositive(n, "Count");
        if (!cnt.ok) return { error: cnt.error };
        input.count = cnt.value;
      }
    }
    return formatResult(computeCivilFoundation(key in CONFIG ? key : "civil-footing-calculator", input), num);
  }, [a, b, config.mode, d, h, key, l, n, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode !== "pile" ? (
            <>
              <div><FieldLabel htmlFor="cf-l">Length (m)</FieldLabel><FieldInput id="cf-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cf-w">Width (m)</FieldLabel><FieldInput id="cf-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "footing" || config.mode === "beam" || config.mode === "slab" || config.mode === "weight") ? (
            <div><FieldLabel htmlFor="cf-d">Depth / thickness (m)</FieldLabel><FieldInput id="cf-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "column" ? (
            <div><FieldLabel htmlFor="cf-h">Height (m)</FieldLabel><FieldInput id="cf-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "pile" ? (
            <>
              <div><FieldLabel htmlFor="cf-d">Pile diameter (m)</FieldLabel><FieldInput id="cf-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cf-h">Pile length (m)</FieldLabel><FieldInput id="cf-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "footing" || config.mode === "column" || config.mode === "beam" || config.mode === "weight" || config.mode === "pile") ? (
            <div><FieldLabel htmlFor="cf-n">Count</FieldLabel><FieldInput id="cf-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
          ) : null}
          {config.mode === "load" ? (
            <>
              <div><FieldLabel htmlFor="cf-a">Live load (kPa)</FieldLabel><FieldInput id="cf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cf-b">Dead load (kPa)</FieldLabel><FieldInput id="cf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "weight" ? (
            <div><FieldLabel htmlFor="cf-a">Density (kg/m³)</FieldLabel><FieldInput id="cf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
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
