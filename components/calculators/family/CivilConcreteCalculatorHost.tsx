"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilConcrete,
  type CivilConcreteInput,
  type CivilConcreteResult,
  type CivilConcreteSlug,
} from "@/lib/calculators/civilConcrete";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "volume" | "mix" | "dryWet" | "rmc" | "cost" | "strength";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  dDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  tDefault: string;
  pDefault: string;
  qDefault: string;
  rDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilConcreteSlug, Config> = {
  "civil-concrete-volume-calculator": {
    title: "Concrete volume",
    description: `Rectangular pour volume with optional waste allowance. ${DISCLAIMER}`,
    mode: "volume",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "", bDefault: "", cDefault: "",
    tDefault: "", pDefault: "2", qDefault: "", rDefault: "",
  },
  "civil-concrete-mix-ratio-calculator": {
    title: "Concrete mix ratio",
    description: `Nominal cement:sand:aggregate split from wet volume. ${DISCLAIMER}`,
    mode: "mix",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "1", bDefault: "1.5", cDefault: "3",
    tDefault: "1.54", pDefault: "2", qDefault: "", rDefault: "",
  },
  "civil-cement-calculator": {
    title: "Cement quantity",
    description: `Cement volume and mass from mix proportions. ${DISCLAIMER}`,
    mode: "mix",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "1", bDefault: "1.5", cDefault: "3",
    tDefault: "1.54", pDefault: "2", qDefault: "", rDefault: "",
  },
  "civil-sand-calculator": {
    title: "Sand quantity",
    description: `Sand volume from nominal mix proportions. ${DISCLAIMER}`,
    mode: "mix",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "1", bDefault: "1.5", cDefault: "3",
    tDefault: "1.54", pDefault: "2", qDefault: "", rDefault: "",
  },
  "civil-aggregate-calculator": {
    title: "Aggregate quantity",
    description: `Coarse aggregate volume from nominal mix. ${DISCLAIMER}`,
    mode: "mix",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "1", bDefault: "1.5", cDefault: "3",
    tDefault: "1.54", pDefault: "2", qDefault: "", rDefault: "",
  },
  "civil-cement-bags-calculator": {
    title: "Cement bags",
    description: `Bag count from cement mass (default 50 kg bags). ${DISCLAIMER}`,
    mode: "mix",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "1", bDefault: "1.5", cDefault: "3",
    tDefault: "1.54", pDefault: "2", qDefault: "", rDefault: "",
  },
  "civil-dry-to-wet-volume-calculator": {
    title: "Dry to wet volume",
    description: `Dry volume from wet volume using bulking factor. ${DISCLAIMER}`,
    mode: "dryWet",
    lDefault: "", wDefault: "", dDefault: "", aDefault: "", bDefault: "", cDefault: "",
    tDefault: "1.54", pDefault: "", qDefault: "10", rDefault: "",
  },
  "civil-ready-mix-concrete-rmc-calculator": {
    title: "Ready-mix concrete (RMC)",
    description: `RMC order volume and cost estimate. ${DISCLAIMER}`,
    mode: "rmc",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "", bDefault: "", cDefault: "",
    tDefault: "", pDefault: "4500", qDefault: "", rDefault: "",
  },
  "civil-concrete-cost-calculator": {
    title: "Concrete material cost",
    description: `Material cost from mix quantities and unit rates. ${DISCLAIMER}`,
    mode: "cost",
    lDefault: "5", wDefault: "4", dDefault: "0.15", aDefault: "1", bDefault: "1.5", cDefault: "3",
    tDefault: "1.54", pDefault: "350", qDefault: "", rDefault: "1200",
  },
  "civil-concrete-strength-estimator": {
    title: "Concrete strength (nominal)",
    description: `Nominal grade target for educational reference. ${DISCLAIMER}`,
    mode: "strength",
    lDefault: "", wDefault: "", dDefault: "", aDefault: "20", bDefault: "", cDefault: "",
    tDefault: "", pDefault: "", qDefault: "", rDefault: "",
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

function formatResult(res: CivilConcreteResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.volumeM3 !== undefined) rows.push({ label: "Wet volume (m³)", value: num(res.volumeM3, 3) });
  if (res.dryVolumeM3 !== undefined) rows.push({ label: "Dry volume (m³)", value: num(res.dryVolumeM3, 3) });
  if (res.cementM3 !== undefined) rows.push({ label: "Cement (m³)", value: num(res.cementM3, 3) });
  if (res.sandM3 !== undefined) rows.push({ label: "Sand (m³)", value: num(res.sandM3, 3) });
  if (res.aggM3 !== undefined) rows.push({ label: "Aggregate (m³)", value: num(res.aggM3, 3) });
  if (res.cementKg !== undefined) rows.push({ label: "Cement (kg)", value: num(res.cementKg, 1) });
  if (res.bags !== undefined) rows.push({ label: "Bags (50 kg)", value: num(res.bags, 1) });
  if (res.totalCost !== undefined) rows.push({ label: "Total cost", value: num(res.totalCost, 0) });
  if (res.estimatedMpa !== undefined) rows.push({ label: "Nominal grade (MPa)", value: num(res.estimatedMpa, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.bags !== undefined ? num(res.bags, 1)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 3)
    : res.dryVolumeM3 !== undefined ? num(res.dryVolumeM3, 3)
    : res.totalCost !== undefined ? num(res.totalCost, 0)
    : res.estimatedMpa !== undefined ? num(res.estimatedMpa, 0)
    : "—";
  const primaryLabel =
    res.bags !== undefined ? "Cement bags"
    : res.totalCost !== undefined ? "Estimated cost"
    : res.estimatedMpa !== undefined ? "Nominal strength"
    : "Volume (m³)";
  return { primary, primaryLabel, rows };
}

export function CivilConcreteCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilConcreteSlug;
  const config = CONFIG[key] ?? CONFIG["civil-concrete-volume-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [d, setD] = useState(useLoanInitialInput(CIVIL_URL.D, config.dDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CIVIL_URL.C, config.cDefault));
  const [t, setT] = useState(useLoanInitialInput(CIVIL_URL.T, config.tDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(CIVIL_URL.Q, config.qDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "volume":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d); put(CIVIL_URL.P, p);
        break;
      case "rmc":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d); put(CIVIL_URL.P, p);
        break;
      case "mix":
      case "cost":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.D, d);
        put(CIVIL_URL.A, a); put(CIVIL_URL.B, b); put(CIVIL_URL.C, c);
        put(CIVIL_URL.T, t); put(CIVIL_URL.P, p);
        if (config.mode === "cost") put(CIVIL_URL.R, r);
        break;
      case "dryWet":
        put(CIVIL_URL.Q, q); put(CIVIL_URL.T, t);
        break;
      case "strength":
        put(CIVIL_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, l, p, q, r, t, w]);

  useLoanUrlSync(shareParams, [a, b, c, d, l, p, q, r, t, w]);

  const result = useMemo(() => {
    const input: CivilConcreteInput = {};
    const waste = optNonNeg(p, "Waste %");
    if (waste && typeof waste === "object") return { error: waste.error };
    if (typeof waste === "number") input.wastePct = waste;

    if (config.mode === "dryWet") {
      const vol = parsePositive(q, "Wet volume (m³)");
      if (!vol.ok) return { error: vol.error };
      input.volumeM3 = vol.value;
      const dryF = optPos(t, "Dry factor");
      if (dryF && typeof dryF === "object") return { error: dryF.error };
      if (typeof dryF === "number") input.dryFactor = dryF;
    } else if (config.mode === "strength") {
      const grade = parsePositive(a, "Target grade (MPa)");
      if (!grade.ok) return { error: grade.error };
      input.targetGradeMpa = grade.value;
    } else {
      if (q.trim() !== "") {
        const vol = parsePositive(q, "Volume (m³)");
        if (!vol.ok) return { error: vol.error };
        input.volumeM3 = vol.value;
      } else {
        const L = parsePositive(l, "Length (m)");
        const W = parsePositive(w, "Width (m)");
        const D = parsePositive(d, "Depth (m)");
        if (!L.ok) return { error: L.error };
        if (!W.ok) return { error: W.error };
        if (!D.ok) return { error: D.error };
        input.lengthM = L.value;
        input.widthM = W.value;
        input.depthM = D.value;
      }
      if (config.mode === "mix" || config.mode === "cost") {
        const cp = optPos(a, "Cement parts"); if (cp && typeof cp === "object") return { error: cp.error };
        const sp = optPos(b, "Sand parts"); if (sp && typeof sp === "object") return { error: sp.error };
        const ap = optPos(c, "Aggregate parts"); if (ap && typeof ap === "object") return { error: ap.error };
        if (typeof cp === "number") input.mixPartsCement = cp;
        if (typeof sp === "number") input.mixPartsSand = sp;
        if (typeof ap === "number") input.mixPartsAgg = ap;
        const dryF = optPos(t, "Dry factor");
        if (dryF && typeof dryF === "object") return { error: dryF.error };
        if (typeof dryF === "number") input.dryFactor = dryF;
      }
      if (config.mode === "rmc") {
        const price = optPos(p, "RMC price/m³");
        if (price && typeof price === "object") return { error: price.error };
        if (typeof price === "number") input.rmcPricePerM3 = price;
      }
      if (config.mode === "cost") {
        const cp = optPos(p, "Cement price/bag");
        const sp = optPos(r, "Sand price/m³");
        if (cp && typeof cp === "object") return { error: cp.error };
        if (sp && typeof sp === "object") return { error: sp.error };
        if (typeof cp === "number") input.cementPricePerBag = cp;
        if (typeof sp === "number") input.sandPricePerM3 = sp;
      }
    }
    return formatResult(computeCivilConcrete(key in CONFIG ? key : "civil-concrete-volume-calculator", input), num);
  }, [a, b, c, config.mode, d, key, l, p, q, r, t, w]);

  const showDims = config.mode !== "dryWet" && config.mode !== "strength";
  const showMix = config.mode === "mix" || config.mode === "cost";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showDims ? (
            <>
              <div><FieldLabel htmlFor="cc-l">Length (m)</FieldLabel><FieldInput id="cc-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-w">Width (m)</FieldLabel><FieldInput id="cc-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-d">Depth (m)</FieldLabel><FieldInput id="cc-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-q">Volume (m³, optional override)</FieldLabel><FieldInput id="cc-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "dryWet" ? (
            <>
              <div><FieldLabel htmlFor="cc-q">Wet volume (m³)</FieldLabel><FieldInput id="cc-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-t">Dry factor</FieldLabel><FieldInput id="cc-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {showMix ? (
            <>
              <div><FieldLabel htmlFor="cc-a">Cement parts</FieldLabel><FieldInput id="cc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-b">Sand parts</FieldLabel><FieldInput id="cc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-c">Aggregate parts</FieldLabel><FieldInput id="cc-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-t">Dry factor</FieldLabel><FieldInput id="cc-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "volume" || config.mode === "mix" ? (
            <div><FieldLabel htmlFor="cc-p">Waste (%)</FieldLabel><FieldInput id="cc-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "rmc" ? (
            <div><FieldLabel htmlFor="cc-p">RMC price per m³</FieldLabel><FieldInput id="cc-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "cost" ? (
            <>
              <div><FieldLabel htmlFor="cc-p">Cement price per bag</FieldLabel><FieldInput id="cc-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cc-r">Sand price per m³</FieldLabel><FieldInput id="cc-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "strength" ? (
            <div><FieldLabel htmlFor="cc-a">Target grade (MPa, e.g. 20)</FieldLabel><FieldInput id="cc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
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
