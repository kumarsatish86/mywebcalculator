"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilBrickwork,
  type CivilBrickworkInput,
  type CivilBrickworkResult,
  type CivilBrickworkSlug,
} from "@/lib/calculators/civilBrickwork";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "wallVol" | "bricks" | "mortar" | "bond" | "block" | "plaster";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  hDefault: string;
  tDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  pDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilBrickworkSlug, Config> = {
  "civil-brick-calculator": {
    title: "Brick calculator",
    description: `Brick count from wall area and modular size. ${DISCLAIMER}`,
    mode: "bricks", lDefault: "10", hDefault: "3", tDefault: "10", aDefault: "0", bDefault: "190", cDefault: "90", pDefault: "5",
  },
  "civil-number-of-bricks-calculator": {
    title: "Number of bricks",
    description: `Brick quantity with mortar joint and waste. ${DISCLAIMER}`,
    mode: "bricks", lDefault: "10", hDefault: "3", tDefault: "10", aDefault: "0", bDefault: "190", cDefault: "90", pDefault: "5",
  },
  "civil-mortar-brickwork-calculator": {
    title: "Mortar for brickwork",
    description: `Mortar volume estimate (~25% of wall volume). ${DISCLAIMER}`,
    mode: "mortar", lDefault: "10", hDefault: "3", tDefault: "0.23", aDefault: "0", bDefault: "", cDefault: "", pDefault: "5",
  },
  "civil-brick-wall-volume-calculator": {
    title: "Brick wall volume",
    description: `Gross masonry volume with openings deducted. ${DISCLAIMER}`,
    mode: "wallVol", lDefault: "10", hDefault: "3", tDefault: "0.23", aDefault: "0", bDefault: "", cDefault: "", pDefault: "",
  },
  "civil-brick-bond-calculator": {
    title: "Brick bond calculator",
    description: `Brick count adjusted for bond pattern. ${DISCLAIMER}`,
    mode: "bond", lDefault: "10", hDefault: "3", tDefault: "10", aDefault: "english", bDefault: "190", cDefault: "90", pDefault: "5",
  },
  "civil-block-calculator-aac-concrete": {
    title: "AAC / concrete block calculator",
    description: `Block count from face module and thin joint. ${DISCLAIMER}`,
    mode: "block", lDefault: "10", hDefault: "3", tDefault: "3", aDefault: "0", bDefault: "600", cDefault: "200", pDefault: "5",
  },
  "civil-plaster-brick-wall-calculator": {
    title: "Plaster for brick wall",
    description: `Plaster wet volume from wall area × thickness. ${DISCLAIMER}`,
    mode: "plaster", lDefault: "10", hDefault: "3", tDefault: "12", aDefault: "0", bDefault: "", cDefault: "", pDefault: "5",
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

function formatResult(res: CivilBrickworkResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.wallAreaM2 !== undefined) rows.push({ label: "Wall area (m²)", value: num(res.wallAreaM2, 2) });
  if (res.wallVolumeM3 !== undefined) rows.push({ label: "Wall volume (m³)", value: num(res.wallVolumeM3, 3) });
  if (res.bricks !== undefined) rows.push({ label: "Bricks", value: num(res.bricks, 0) });
  if (res.blocks !== undefined) rows.push({ label: "Blocks", value: num(res.blocks, 0) });
  if (res.mortarM3 !== undefined) rows.push({ label: "Mortar (m³)", value: num(res.mortarM3, 3) });
  if (res.plasterM3 !== undefined) rows.push({ label: "Plaster (m³)", value: num(res.plasterM3, 3) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.bricks !== undefined ? num(res.bricks, 0)
    : res.blocks !== undefined ? num(res.blocks, 0)
    : res.wallVolumeM3 !== undefined ? num(res.wallVolumeM3, 3)
    : res.mortarM3 !== undefined ? num(res.mortarM3, 3)
    : res.plasterM3 !== undefined ? num(res.plasterM3, 3)
    : res.wallAreaM2 !== undefined ? num(res.wallAreaM2, 2)
    : "—";
  const primaryLabel =
    res.bricks !== undefined ? "Brick count"
    : res.blocks !== undefined ? "Block count"
    : res.mortarM3 !== undefined ? "Mortar volume (m³)"
    : res.plasterM3 !== undefined ? "Plaster volume (m³)"
    : "Wall volume (m³)";
  return { primary, primaryLabel, rows };
}

export function CivilBrickworkCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilBrickworkSlug;
  const config = CONFIG[key] ?? CONFIG["civil-brick-calculator"];
  const [l, setL] = useState(useLoanInitialInput(CIVIL_URL.L, config.lDefault));
  const [h, setH] = useState(useLoanInitialInput(CIVIL_URL.H, config.hDefault));
  const [t, setT] = useState(useLoanInitialInput(CIVIL_URL.T, config.tDefault));
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CIVIL_URL.C, config.cDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    put(CIVIL_URL.L, l); put(CIVIL_URL.H, h); put(CIVIL_URL.A, a);
    if (config.mode === "wallVol" || config.mode === "mortar") put(CIVIL_URL.T, t);
    if (config.mode === "bricks" || config.mode === "bond" || config.mode === "block") {
      put(CIVIL_URL.T, t); put(CIVIL_URL.B, b); put(CIVIL_URL.C, c);
    }
    if (config.mode === "plaster") put(CIVIL_URL.T, t);
    if (config.mode !== "wallVol") put(CIVIL_URL.P, p);
    return out;
  }, [a, b, c, config.mode, h, l, p, t]);

  useLoanUrlSync(shareParams, [a, b, c, h, l, p, t]);

  const result = useMemo(() => {
    const L = parsePositive(l, "Length (m)");
    const H = parsePositive(h, "Height (m)");
    if (!L.ok) return { error: L.error };
    if (!H.ok) return { error: H.error };
    const input: CivilBrickworkInput = { lengthM: L.value, heightM: H.value };
    if (a.trim() !== "" && config.mode !== "bond") {
      const open = parseNonNegative(a, "Openings (m²)");
      if (!open.ok) return { error: open.error };
      input.openingsM2 = open.value;
    }
    if (config.mode === "bond") input.bondName = a;
    if (config.mode === "wallVol" || config.mode === "mortar") {
      const thick = parsePositive(t, "Thickness (m)");
      if (!thick.ok) return { error: thick.error };
      input.thicknessM = thick.value;
    }
    if (config.mode === "plaster") {
      const pt = parsePositive(t, "Plaster thickness (mm)");
      if (!pt.ok) return { error: pt.error };
      input.plasterThickMm = pt.value;
    }
    if (config.mode === "bricks" || config.mode === "bond" || config.mode === "block") {
      if (b.trim() !== "") {
        const bl = parsePositive(b, "Unit length (mm)");
        if (!bl.ok) return { error: bl.error };
        input.brickLMm = bl.value;
      }
      if (c.trim() !== "") {
        const bh = parsePositive(c, "Unit height (mm)");
        if (!bh.ok) return { error: bh.error };
        input.brickHMm = bh.value;
      }
      if (t.trim() !== "") {
        const mt = parsePositive(t, "Mortar thickness (mm)");
        if (!mt.ok) return { error: mt.error };
        input.mortarThickMm = mt.value;
      }
    }
    if (p.trim() !== "" && config.mode !== "wallVol") {
      const waste = parseNonNegative(p, "Waste %");
      if (!waste.ok) return { error: waste.error };
      input.wastePct = waste.value;
    }
    return formatResult(computeCivilBrickwork(key in CONFIG ? key : "civil-brick-calculator", input), num);
  }, [a, b, c, config.mode, h, key, l, p, t]);

  const showOpenings = config.mode !== "bond";
  const showBond = config.mode === "bond";
  const showThicknessM = config.mode === "wallVol" || config.mode === "mortar";
  const showModule = config.mode === "bricks" || config.mode === "bond" || config.mode === "block";
  const showPlasterT = config.mode === "plaster";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div><FieldLabel htmlFor="cb-l">Wall length (m)</FieldLabel><FieldInput id="cb-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
          <div><FieldLabel htmlFor="cb-h">Wall height (m)</FieldLabel><FieldInput id="cb-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
          {showOpenings ? (
            <div><FieldLabel htmlFor="cb-a">Openings area (m²)</FieldLabel><FieldInput id="cb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {showBond ? (
            <div><FieldLabel htmlFor="cb-a">Bond (english, flemish, …)</FieldLabel><FieldInput id="cb-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
          ) : null}
          {showThicknessM ? (
            <div><FieldLabel htmlFor="cb-t">Wall thickness (m)</FieldLabel><FieldInput id="cb-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {showPlasterT ? (
            <div><FieldLabel htmlFor="cb-t">Plaster thickness (mm)</FieldLabel><FieldInput id="cb-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {showModule ? (
            <>
              <div><FieldLabel htmlFor="cb-b">Unit length (mm)</FieldLabel><FieldInput id="cb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cb-c">Unit height (mm)</FieldLabel><FieldInput id="cb-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cb-t">Mortar joint (mm)</FieldLabel><FieldInput id="cb-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode !== "wallVol" ? (
            <div><FieldLabel htmlFor="cb-p">Waste (%)</FieldLabel><FieldInput id="cb-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
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
