"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeSpace,
  type HomeSpaceInput,
  type HomeSpaceResult,
  type HomeSpaceSlug,
} from "@/lib/calculators/homeSpace";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "area" | "carpet" | "builtUp" | "superBuilt" | "tiles" | "flooring" | "paint" | "wallpaper";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  rDefault: string;
  tDefault: string;
  pDefault: string;
  qDefault: string;
  cDefault: string;
  aDefault: string;
  bDefault: string;
  nDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeSpaceSlug, Config> = {
  "home-room-area-calculator": {
    title: "Room area",
    description: `Area from length × width. ${DISCLAIMER}`,
    mode: "area", lDefault: "5", wDefault: "4", hDefault: "", rDefault: "", tDefault: "",
    pDefault: "", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-carpet-area-calculator": {
    title: "Carpet area",
    description: `Carpet area with optional factor. ${DISCLAIMER}`,
    mode: "carpet", lDefault: "5", wDefault: "4", hDefault: "", rDefault: "0.85", tDefault: "",
    pDefault: "", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-built-up-area-calculator": {
    title: "Built-up area",
    description: `Outer L×W built-up estimate. ${DISCLAIMER}`,
    mode: "builtUp", lDefault: "12", wDefault: "10", hDefault: "", rDefault: "", tDefault: "",
    pDefault: "", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-super-built-up-area-calculator": {
    title: "Super built-up area",
    description: `Super built-up with loading %. ${DISCLAIMER}`,
    mode: "superBuilt", lDefault: "10", wDefault: "8", hDefault: "", rDefault: "25", tDefault: "",
    pDefault: "", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-tile-calculator": {
    title: "Tile quantity",
    description: `Tiles needed with waste allowance. ${DISCLAIMER}`,
    mode: "tiles", lDefault: "4", wDefault: "3", hDefault: "", rDefault: "10", tDefault: "",
    pDefault: "600", qDefault: "600", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-flooring-cost-calculator": {
    title: "Flooring cost",
    description: `Flooring cost from area × rate. ${DISCLAIMER}`,
    mode: "flooring", lDefault: "5", wDefault: "4", hDefault: "", rDefault: "45", tDefault: "",
    pDefault: "", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-paint-quantity-calculator": {
    title: "Paint quantity",
    description: `Paint liters from wall area. ${DISCLAIMER}`,
    mode: "paint", lDefault: "5", wDefault: "4", hDefault: "2.7", rDefault: "", tDefault: "2",
    pDefault: "10", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
  },
  "home-wallpaper-calculator": {
    title: "Wallpaper rolls",
    description: `Rolls from wall area and coverage. ${DISCLAIMER}`,
    mode: "wallpaper", lDefault: "4", wDefault: "3", hDefault: "2.7", rDefault: "10", tDefault: "",
    pDefault: "5", qDefault: "", cDefault: "", aDefault: "", bDefault: "", nDefault: "",
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

function optPos(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parsePositive(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: HomeSpaceResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.tiles !== undefined) rows.push({ label: "Tiles", value: num(res.tiles, 0) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 0) });
  if (res.liters !== undefined) rows.push({ label: "Paint (L)", value: num(res.liters, 1) });
  if (res.rolls !== undefined) rows.push({ label: "Rolls", value: num(res.rolls, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.tiles !== undefined ? num(res.tiles, 0)
    : res.rolls !== undefined ? num(res.rolls, 0)
    : res.liters !== undefined ? num(res.liters, 1)
    : res.cost !== undefined ? num(res.cost, 0)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel =
    res.tiles !== undefined ? "Tiles"
    : res.rolls !== undefined ? "Rolls"
    : res.liters !== undefined ? "Paint (L)"
    : res.cost !== undefined ? "Cost"
    : "Area (m²)";
  return { primary, primaryLabel, rows };
}

export function HomeSpaceCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeSpaceSlug;
  const config = CONFIG[key] ?? CONFIG["home-room-area-calculator"];
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(HOME_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(HOME_URL.H, config.hDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(HOME_URL.Q, config.qDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "area":
      case "builtUp":
        put(HOME_URL.L, l); put(HOME_URL.W, w);
        break;
      case "carpet":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.R, r);
        break;
      case "superBuilt":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.R, r);
        break;
      case "tiles":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.P, p); put(HOME_URL.Q, q); put(HOME_URL.R, r);
        break;
      case "flooring":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.R, r);
        break;
      case "paint":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.H, h); put(HOME_URL.T, t); put(HOME_URL.P, p);
        break;
      case "wallpaper":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.H, h); put(HOME_URL.P, p); put(HOME_URL.R, r);
        break;
    }
    return out;
  }, [config.mode, h, l, p, q, r, t, w]);

  useLoanUrlSync(shareParams, [a, b, c, h, l, n, p, q, r, t, w]);

  const result = useMemo(() => {
    const input: HomeSpaceInput = {};
    const setRect = () => {
      const L = parsePositive(l, "Length (m)");
      if (!L.ok) return { error: L.error };
      input.lengthM = L.value;
      const W = parsePositive(w, "Width (m)");
      if (!W.ok) return { error: W.error };
      input.widthM = W.value;
      return null;
    };

    switch (config.mode) {
      case "area":
      case "builtUp": {
        const err = setRect();
        if (err) return err;
        break;
      }
      case "carpet": {
        const err = setRect();
        if (err) return err;
        const f = optPos(r, "Carpet factor");
        if (f && typeof f === "object") return { error: f.error };
        if (typeof f === "number") input.carpetFactor = f;
        break;
      }
      case "superBuilt": {
        const err = setRect();
        if (err) return err;
        const load = optNonNeg(r, "Loading %");
        if (load && typeof load === "object") return { error: load.error };
        if (typeof load === "number") input.loadingPct = load;
        break;
      }
      case "tiles": {
        const err = setRect();
        if (err) return err;
        const tl = optPos(p, "Tile length (mm)");
        if (tl && typeof tl === "object") return { error: tl.error };
        if (typeof tl === "number") input.tileLMm = tl;
        const tw = optPos(q, "Tile width (mm)");
        if (tw && typeof tw === "object") return { error: tw.error };
        if (typeof tw === "number") input.tileWMm = tw;
        const waste = optNonNeg(r, "Waste %");
        if (waste && typeof waste === "object") return { error: waste.error };
        if (typeof waste === "number") input.wastePct = waste;
        break;
      }
      case "flooring": {
        const err = setRect();
        if (err) return err;
        const rate = parsePositive(r, "Rate/m²");
        if (!rate.ok) return { error: rate.error };
        input.ratePerM2 = rate.value;
        break;
      }
      case "paint": {
        const err = setRect();
        if (err) return err;
        const ht = optPos(h, "Height (m)");
        if (ht && typeof ht === "object") return { error: ht.error };
        if (typeof ht === "number") input.heightM = ht;
        const coats = optPos(t, "Coats");
        if (coats && typeof coats === "object") return { error: coats.error };
        if (typeof coats === "number") input.coats = coats;
        const cov = optPos(p, "Coverage m²/L");
        if (cov && typeof cov === "object") return { error: cov.error };
        if (typeof cov === "number") input.coverageM2PerL = cov;
        break;
      }
      case "wallpaper": {
        const L = parsePositive(l, "Length (m)");
        if (!L.ok) return { error: L.error };
        input.lengthM = L.value;
        const W = optPos(w, "Width (m)");
        if (W && typeof W === "object") return { error: W.error };
        if (typeof W === "number") input.widthM = W;
        const ht = optPos(h, "Height (m)");
        if (ht && typeof ht === "object") return { error: ht.error };
        if (typeof ht === "number") input.heightM = ht;
        const roll = optPos(p, "Roll coverage m²");
        if (roll && typeof roll === "object") return { error: roll.error };
        if (typeof roll === "number") input.rollCoverageM2 = roll;
        const waste = optNonNeg(r, "Waste %");
        if (waste && typeof waste === "object") return { error: waste.error };
        if (typeof waste === "number") input.wastePct = waste;
        break;
      }
    }
    return formatResult(
      computeHomeSpace(key in CONFIG ? key : "home-room-area-calculator", input),
      num,
    );
  }, [config.mode, h, key, l, p, q, r, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "area" || config.mode === "carpet" || config.mode === "builtUp" || config.mode === "superBuilt" || config.mode === "tiles" || config.mode === "flooring") ? (
            <>
              <div><FieldLabel htmlFor="hs-l">Length (m)</FieldLabel><FieldInput id="hs-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-w">Width (m)</FieldLabel><FieldInput id="hs-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "carpet" ? (
            <div><FieldLabel htmlFor="hs-r">Carpet factor</FieldLabel><FieldInput id="hs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "superBuilt" ? (
            <div><FieldLabel htmlFor="hs-r">Loading %</FieldLabel><FieldInput id="hs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "tiles" ? (
            <>
              <div><FieldLabel htmlFor="hs-p">Tile length (mm)</FieldLabel><FieldInput id="hs-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-q">Tile width (mm)</FieldLabel><FieldInput id="hs-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-r">Waste %</FieldLabel><FieldInput id="hs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "flooring" ? (
            <div><FieldLabel htmlFor="hs-r">Rate per m²</FieldLabel><FieldInput id="hs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "paint" ? (
            <>
              <div><FieldLabel htmlFor="hs-l">Length (m)</FieldLabel><FieldInput id="hs-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-w">Width (m)</FieldLabel><FieldInput id="hs-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-h">Height (m)</FieldLabel><FieldInput id="hs-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-t">Coats</FieldLabel><FieldInput id="hs-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-p">Coverage (m²/L)</FieldLabel><FieldInput id="hs-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "wallpaper" ? (
            <>
              <div><FieldLabel htmlFor="hs-l">Length (m)</FieldLabel><FieldInput id="hs-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-w">Width (m)</FieldLabel><FieldInput id="hs-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-h">Height (m)</FieldLabel><FieldInput id="hs-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-p">Roll coverage (m²)</FieldLabel><FieldInput id="hs-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hs-r">Waste %</FieldLabel><FieldInput id="hs-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
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
