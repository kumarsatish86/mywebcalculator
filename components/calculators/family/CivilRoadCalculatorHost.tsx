"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilRoad,
  type CivilRoadInput,
  type CivilRoadResult,
  type CivilRoadSlug,
} from "@/lib/calculators/civilRoad";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "material" | "bitumen" | "pavement" | "cost";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  tDefault: string;
  aDefault: string;
  pDefault: string;
  nDefault: string;
  rDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilRoadSlug, Config> = {
  "civil-road-construction-calculator": {
    title: "Road construction", description: `Course volume and mass. ${DISCLAIMER}`,
    mode: "material", lDefault: "100", wDefault: "7", tDefault: "0.15", aDefault: "2300", pDefault: "", nDefault: "", rDefault: "",
  },
  "civil-asphalt-calculator": {
    title: "Asphalt calculator", description: `Asphalt mix volume and mass. ${DISCLAIMER}`,
    mode: "material", lDefault: "50", wDefault: "7", tDefault: "0.05", aDefault: "2300", pDefault: "", nDefault: "", rDefault: "",
  },
  "civil-bitumen-quantity-calculator": {
    title: "Bitumen quantity", description: `Bitumen mass from mix percentage. ${DISCLAIMER}`,
    mode: "bitumen", lDefault: "50", wDefault: "7", tDefault: "0.05", aDefault: "2300", pDefault: "5", nDefault: "", rDefault: "",
  },
  "civil-road-base-material-calculator": {
    title: "Road base material", description: `Base/sub-base volume estimate. ${DISCLAIMER}`,
    mode: "material", lDefault: "100", wDefault: "7", tDefault: "0.2", aDefault: "2100", pDefault: "", nDefault: "", rDefault: "",
  },
  "civil-pavement-thickness-calculator": {
    title: "Pavement thickness", description: `Total thickness from layers. ${DISCLAIMER}`,
    mode: "pavement", lDefault: "", wDefault: "", tDefault: "0.05", aDefault: "", pDefault: "", nDefault: "3", rDefault: "",
  },
  "civil-road-cost-calculator": {
    title: "Road cost", description: `Cost from area or volume rate. ${DISCLAIMER}`,
    mode: "cost", lDefault: "100", wDefault: "7", tDefault: "0.15", aDefault: "", pDefault: "3500", nDefault: "", rDefault: "450",
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

function formatResult(res: CivilRoadResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 1) });
  if (res.volumeM3 !== undefined) rows.push({ label: "Volume (m³)", value: num(res.volumeM3, 2) });
  if (res.massKg !== undefined) rows.push({ label: "Mass (kg)", value: num(res.massKg, 0) });
  if (res.bitumenKg !== undefined) rows.push({ label: "Bitumen (kg)", value: num(res.bitumenKg, 0) });
  if (res.thicknessM !== undefined) rows.push({ label: "Total thickness (m)", value: num(res.thicknessM, 3) });
  if (res.totalCost !== undefined) rows.push({ label: "Total cost", value: num(res.totalCost, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.totalCost !== undefined ? num(res.totalCost, 0)
    : res.bitumenKg !== undefined ? num(res.bitumenKg, 0)
    : res.thicknessM !== undefined ? num(res.thicknessM, 3)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 2)
    : res.massKg !== undefined ? num(res.massKg, 0)
    : "—";
  const primaryLabel =
    res.totalCost !== undefined ? "Estimated cost"
    : res.bitumenKg !== undefined ? "Bitumen (kg)"
    : res.thicknessM !== undefined ? "Total thickness (m)"
    : res.volumeM3 !== undefined ? "Volume (m³)"
    : "Mass (kg)";
  return { primary, primaryLabel, rows };
}

export function CivilRoadCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilRoadSlug;
  const config = CONFIG[key] ?? CONFIG["civil-road-construction-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(CIVIL_URL.W, config.wDefault));
  const [t, setT] = useState(useLoanInitialInput(CIVIL_URL.T, config.tDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "material":
      case "bitumen":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.T, t); put(CIVIL_URL.A, a);
        if (config.mode === "bitumen") put(CIVIL_URL.P, p);
        break;
      case "pavement":
        put(CIVIL_URL.T, t); put(CIVIL_URL.N, n);
        break;
      case "cost":
        put(CIVIL_URL.L, l); put(CIVIL_URL.W, w); put(CIVIL_URL.T, t); put(CIVIL_URL.P, p); put(CIVIL_URL.R, r);
        break;
    }
    return out;
  }, [a, config.mode, l, n, p, r, t, w]);

  useLoanUrlSync(shareParams, [a, l, n, p, r, t, w]);

  const result = useMemo(() => {
    const input: CivilRoadInput = {};
    if (config.mode === "pavement") {
      const thick = parsePositive(t, "Layer thickness (m)");
      if (!thick.ok) return { error: thick.error };
      input.thicknessM = thick.value;
      if (n.trim() !== "") {
        const layers = parsePositive(n, "Layers");
        if (!layers.ok) return { error: layers.error };
        input.layers = layers.value;
      }
    } else {
      const L = parsePositive(l, "Length (m)");
      const W = parsePositive(w, "Width (m)");
      if (!L.ok) return { error: L.error };
      if (!W.ok) return { error: W.error };
      input.lengthM = L.value; input.widthM = W.value;
      if (config.mode === "cost") {
        if (r.trim() !== "") {
          const rate2 = parsePositive(r, "Cost per m²");
          if (!rate2.ok) return { error: rate2.error };
          input.costPerM2 = rate2.value;
        } else {
          const T = parsePositive(t, "Thickness (m)");
          if (!T.ok) return { error: T.error };
          input.thicknessM = T.value;
        }
        if (p.trim() !== "") {
          const rate = parsePositive(p, "Cost per m³");
          if (!rate.ok) return { error: rate.error };
          input.costPerM3 = rate.value;
        }
      } else {
        const T = parsePositive(t, "Thickness (m)");
        if (!T.ok) return { error: T.error };
        input.thicknessM = T.value;
      }
      if (a.trim() !== "" && config.mode !== "cost") {
        const dens = parsePositive(a, "Density (kg/m³)");
        if (!dens.ok) return { error: dens.error };
        input.densityKgM3 = dens.value;
      }
      if (config.mode === "bitumen" && p.trim() !== "") {
        const pct = parsePositive(p, "Bitumen %");
        if (!pct.ok) return { error: pct.error };
        input.bitumenPct = pct.value;
      }
    }
    return formatResult(computeCivilRoad(key in CONFIG ? key : "civil-road-construction-calculator", input), num);
  }, [a, config.mode, key, l, n, p, r, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "material" || config.mode === "bitumen" || config.mode === "cost") ? (
            <>
              <div><FieldLabel htmlFor="cr-l">Length (m)</FieldLabel><FieldInput id="cr-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cr-w">Width (m)</FieldLabel><FieldInput id="cr-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cr-t">Thickness (m)</FieldLabel><FieldInput id="cr-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "material" || config.mode === "bitumen") ? (
            <div><FieldLabel htmlFor="cr-a">Density (kg/m³)</FieldLabel><FieldInput id="cr-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "bitumen" ? (
            <div><FieldLabel htmlFor="cr-p">Bitumen (% of mix)</FieldLabel><FieldInput id="cr-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "pavement" ? (
            <>
              <div><FieldLabel htmlFor="cr-t">Layer thickness (m)</FieldLabel><FieldInput id="cr-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cr-n">Number of layers</FieldLabel><FieldInput id="cr-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "cost" ? (
            <>
              <div><FieldLabel htmlFor="cr-p">Cost per m³ (optional)</FieldLabel><FieldInput id="cr-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cr-r">Cost per m² (optional)</FieldLabel><FieldInput id="cr-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
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
