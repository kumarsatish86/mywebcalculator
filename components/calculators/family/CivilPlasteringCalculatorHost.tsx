"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilPlastering,
  type CivilPlasteringInput,
  type CivilPlasteringResult,
  type CivilPlasteringSlug,
} from "@/lib/calculators/civilPlastering";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "wallPlaster" | "ceiling" | "paint" | "tile" | "putty";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  tDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  pDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilPlasteringSlug, Config> = {
  "civil-plastering-calculator": {
    title: "Plastering calculator", description: `Wall plaster volume with dry factor. ${DISCLAIMER}`,
    mode: "wallPlaster", lDefault: "10", wDefault: "", hDefault: "3", tDefault: "12", aDefault: "0", bDefault: "", cDefault: "", pDefault: "5",
  },
  "civil-wall-plaster-calculator": {
    title: "Wall plaster", description: `Plaster wet volume from wall area. ${DISCLAIMER}`,
    mode: "wallPlaster", lDefault: "10", wDefault: "", hDefault: "3", tDefault: "12", aDefault: "0", bDefault: "", cDefault: "", pDefault: "5",
  },
  "civil-ceiling-plaster-calculator": {
    title: "Ceiling plaster", description: `Ceiling plaster from plan area. ${DISCLAIMER}`,
    mode: "ceiling", lDefault: "5", wDefault: "4", hDefault: "", tDefault: "10", aDefault: "", bDefault: "", cDefault: "", pDefault: "5",
  },
  "civil-paint-quantity-calculator": {
    title: "Paint quantity", description: `Paint liters from coverage and coats. ${DISCLAIMER}`,
    mode: "paint", lDefault: "10", wDefault: "", hDefault: "3", tDefault: "", aDefault: "0", bDefault: "2", cDefault: "10", pDefault: "5",
  },
  "civil-tile-calculator": {
    title: "Tile calculator", description: `Tile count from floor area. ${DISCLAIMER}`,
    mode: "tile", lDefault: "5", wDefault: "4", hDefault: "", tDefault: "", aDefault: "", bDefault: "600", cDefault: "600", pDefault: "5",
  },
  "civil-flooring-material-calculator": {
    title: "Flooring material", description: `Flooring pieces from area and tile size. ${DISCLAIMER}`,
    mode: "tile", lDefault: "6", wDefault: "5", hDefault: "", tDefault: "", aDefault: "", bDefault: "800", cDefault: "800", pDefault: "5",
  },
  "civil-putty-calculator": {
    title: "Putty calculator", description: `Putty mass from wall area × rate. ${DISCLAIMER}`,
    mode: "putty", lDefault: "10", wDefault: "", hDefault: "3", tDefault: "", aDefault: "0", bDefault: "1.5", cDefault: "", pDefault: "5",
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

function formatResult(res: CivilPlasteringResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.flooringM2 !== undefined) rows.push({ label: "Floor area (m²)", value: num(res.flooringM2, 2) });
  if (res.plasterM3 !== undefined) rows.push({ label: "Plaster (m³)", value: num(res.plasterM3, 3) });
  if (res.paintL !== undefined) rows.push({ label: "Paint (L)", value: num(res.paintL, 1) });
  if (res.tiles !== undefined) rows.push({ label: "Tiles", value: num(res.tiles, 0) });
  if (res.puttyKg !== undefined) rows.push({ label: "Putty (kg)", value: num(res.puttyKg, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.tiles !== undefined ? num(res.tiles, 0)
    : res.paintL !== undefined ? num(res.paintL, 1)
    : res.puttyKg !== undefined ? num(res.puttyKg, 1)
    : res.plasterM3 !== undefined ? num(res.plasterM3, 3)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel =
    res.tiles !== undefined ? "Tile count"
    : res.paintL !== undefined ? "Paint (L)"
    : res.puttyKg !== undefined ? "Putty (kg)"
    : res.plasterM3 !== undefined ? "Plaster volume (m³)"
    : "Area (m²)";
  return { primary, primaryLabel, rows };
}

export function CivilPlasteringCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilPlasteringSlug;
  const config = CONFIG[key] ?? CONFIG["civil-plastering-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(CIVIL_URL.H, config.hDefault));
  const [t, setT] = useState(useLoanInitialInput(CIVIL_URL.T, config.tDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CIVIL_URL.C, config.cDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    put(CIVIL_URL.L, l);
    if (config.mode === "ceiling" || config.mode === "tile") put(CIVIL_URL.W, w);
    if (config.mode !== "ceiling" && config.mode !== "tile") put(CIVIL_URL.H, h);
    if (config.mode === "wallPlaster" || config.mode === "ceiling") put(CIVIL_URL.T, t);
    if (config.mode === "wallPlaster" || config.mode === "paint" || config.mode === "putty") put(CIVIL_URL.A, a);
    if (config.mode === "paint") { put(CIVIL_URL.B, b); put(CIVIL_URL.C, c); }
    if (config.mode === "tile") { put(CIVIL_URL.B, b); put(CIVIL_URL.C, c); }
    if (config.mode === "putty") put(CIVIL_URL.B, b);
    put(CIVIL_URL.P, p);
    return out;
  }, [a, b, c, config.mode, h, l, p, t, w]);

  useLoanUrlSync(shareParams, [a, b, c, h, l, p, t, w]);

  const result = useMemo(() => {
    const input: CivilPlasteringInput = {};
    if (config.mode === "ceiling" || config.mode === "tile") {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      input.lengthM = L.value; input.widthM = W.value;
    } else {
      const L = parsePositive(l, "Length (m)");
      const H = parsePositive(h, "Height (m)");
      if (!L.ok) return { error: L.error };
      if (!H.ok) return { error: H.error };
      input.lengthM = L.value; input.heightM = H.value;
      if (a.trim() !== "") {
        const open = parseNonNegative(a, "Openings (m²)");
        if (!open.ok) return { error: open.error };
        input.openingsM2 = open.value;
      }
    }
    if (config.mode === "wallPlaster" || config.mode === "ceiling") {
      if (t.trim() !== "") {
        const thick = parsePositive(t, "Thickness (mm)");
        if (!thick.ok) return { error: thick.error };
        input.thicknessMm = thick.value;
      }
    }
    if (config.mode === "paint") {
      if (b.trim() !== "") {
        const coats = parsePositive(b, "Coats");
        if (!coats.ok) return { error: coats.error };
        input.coats = coats.value;
      }
      if (c.trim() !== "") {
        const cov = parsePositive(c, "Coverage (m²/L)");
        if (!cov.ok) return { error: cov.error };
        input.coverageM2PerL = cov.value;
      }
    }
    if (config.mode === "tile") {
      if (b.trim() !== "") {
        const tl = parsePositive(b, "Tile length (mm)");
        if (!tl.ok) return { error: tl.error };
        input.tileLMm = tl.value;
      }
      if (c.trim() !== "") {
        const tw = parsePositive(c, "Tile width (mm)");
        if (!tw.ok) return { error: tw.error };
        input.tileWMm = tw.value;
      }
    }
    if (config.mode === "putty" && b.trim() !== "") {
      const rate = parsePositive(b, "Putty (kg/m²)");
      if (!rate.ok) return { error: rate.error };
      input.puttyKgPerM2 = rate.value;
    }
    if (p.trim() !== "") {
      const waste = parseNonNegative(p, "Waste %");
      if (!waste.ok) return { error: waste.error };
      input.wastePct = waste.value;
    }
    return formatResult(computeCivilPlastering(key in CONFIG ? key : "civil-plastering-calculator", input), num);
  }, [a, b, c, config.mode, h, key, l, p, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div><FieldLabel htmlFor="cp-l">Length (m)</FieldLabel><FieldInput id="cp-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
          {(config.mode === "ceiling" || config.mode === "tile") ? (
            <div><FieldLabel htmlFor="cp-w">Width (m)</FieldLabel><FieldInput id="cp-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode !== "ceiling" && config.mode !== "tile" ? (
            <div><FieldLabel htmlFor="cp-h">Height (m)</FieldLabel><FieldInput id="cp-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {(config.mode === "wallPlaster" || config.mode === "paint" || config.mode === "putty") ? (
            <div><FieldLabel htmlFor="cp-a">Openings area (m²)</FieldLabel><FieldInput id="cp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {(config.mode === "wallPlaster" || config.mode === "ceiling") ? (
            <div><FieldLabel htmlFor="cp-t">Thickness (mm)</FieldLabel><FieldInput id="cp-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "paint" ? (
            <>
              <div><FieldLabel htmlFor="cp-b">Coats</FieldLabel><FieldInput id="cp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="cp-c">Coverage (m²/L)</FieldLabel><FieldInput id="cp-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tile" ? (
            <>
              <div><FieldLabel htmlFor="cp-b">Tile length (mm)</FieldLabel><FieldInput id="cp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cp-c">Tile width (mm)</FieldLabel><FieldInput id="cp-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "putty" ? (
            <div><FieldLabel htmlFor="cp-b">Putty rate (kg/m²)</FieldLabel><FieldInput id="cp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          <div><FieldLabel htmlFor="cp-p">Waste (%)</FieldLabel><FieldInput id="cp-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
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
