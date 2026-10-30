"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinCost,
  type BizfinCostInput,
  type BizfinCostResult,
  type BizfinCostSlug,
} from "@/lib/calculators/bizfinCost";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "costPrice" | "sellPrice" | "be" | "fixed" | "var" | "total" | "unit" | "oh" | "cogs" | "prod";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  fields: readonly string[];
  aDefault: string; bDefault: string; cDefault: string; dDefault: string;
  rDefault: string; tDefault: string; nDefault: string; pDefault: string;
  mDefault: string; vDefault: string; sDefault: string; lDefault: string;
  wDefault: string; hDefault: string; qDefault: string;
  aLabel?: string; bLabel?: string; cLabel?: string; dLabel?: string;
  rLabel?: string; tLabel?: string; nLabel?: string; pLabel?: string;
  mLabel?: string; vLabel?: string; sLabel?: string; lLabel?: string;
  wLabel?: string; hLabel?: string; qLabel?: string;
};

const CONFIG: Record<BizfinCostSlug, Config> = {
  "bizfin-cost-price-calculator": {
    title: "Cost Price Calculator",
    description: `Cost Price Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "costPrice",
    fields: ["a","b"] as const,
    aDefault: "100",
    bDefault: "40",
    cDefault: "",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Selling price",
    bLabel: "Margin %",
  },
  "bizfin-selling-price-calculator": {
    title: "Selling Price Calculator",
    description: `Selling Price Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "sellPrice",
    fields: ["a","b"] as const,
    aDefault: "60",
    bDefault: "50",
    cDefault: "",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Cost",
    bLabel: "Markup %",
  },
  "bizfin-break-even-calculator": {
    title: "Break-even Calculator",
    description: `Break-even Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "be",
    fields: ["a","b","c"] as const,
    aDefault: "50000",
    bDefault: "25",
    cDefault: "10",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Fixed costs",
    bLabel: "Price per unit",
    cLabel: "Variable cost / unit",
  },
  "bizfin-fixed-cost-calculator": {
    title: "Fixed Cost Calculator",
    description: `Fixed Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "fixed",
    fields: ["a","b","c"] as const,
    aDefault: "20000",
    bDefault: "15000",
    cDefault: "5000",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Fixed cost A",
    bLabel: "Fixed cost B",
    cLabel: "Fixed cost C",
  },
  "bizfin-variable-cost-calculator": {
    title: "Variable Cost Calculator",
    description: `Variable Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "var",
    fields: ["a","b"] as const,
    aDefault: "8",
    bDefault: "1000",
    cDefault: "",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Variable / unit",
    bLabel: "Units",
  },
  "bizfin-total-cost-calculator": {
    title: "Total Cost Calculator",
    description: `Total Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "total",
    fields: ["a","b"] as const,
    aDefault: "40000",
    bDefault: "25000",
    cDefault: "",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Fixed costs",
    bLabel: "Variable total",
  },
  "bizfin-unit-cost-calculator": {
    title: "Unit Cost Calculator",
    description: `Unit Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "unit",
    fields: ["a","b"] as const,
    aDefault: "65000",
    bDefault: "5000",
    cDefault: "",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Total cost",
    bLabel: "Units",
  },
  "bizfin-overhead-cost-calculator": {
    title: "Overhead Cost Calculator",
    description: `Overhead Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "oh",
    fields: ["a","b"] as const,
    aDefault: "12000",
    bDefault: "3000",
    cDefault: "",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Total overhead",
    bLabel: "Units",
  },
  "bizfin-cogs-calculator": {
    title: "COGS Calculator",
    description: `COGS Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cogs",
    fields: ["a","b","c"] as const,
    aDefault: "20000",
    bDefault: "80000",
    cDefault: "15000",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Beginning inventory",
    bLabel: "Purchases",
    cLabel: "Ending inventory",
  },
  "bizfin-production-cost-calculator": {
    title: "Production Cost Calculator",
    description: `Production Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "prod",
    fields: ["a","b","c"] as const,
    aDefault: "30000",
    bDefault: "20000",
    cDefault: "10000",
    dDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Materials",
    bLabel: "Labor",
    cLabel: "Overhead",
  }
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function reqPos(raw: string, label: string) { return parsePositive(raw, label); }
function reqNonNeg(raw: string, label: string) {
  if (raw.trim() === "") return parseNonNegative("0", label);
  return parseNonNegative(raw, label);
}
function reqFinite(raw: string, label: string) { return parseFiniteNumber(raw, label); }

function formatResult(res: BizfinCostResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.value !== undefined && Number.isFinite(res.value)) rows.push({ label: "Result", value: num(res.value) });
  else if (res.value === Infinity) rows.push({ label: "Result", value: "∞" });
  if (res.pct !== undefined) rows.push({ label: "Percent", value: num(res.pct, 2) + "%" });
  if (res.secondary !== undefined) rows.push({ label: "Secondary", value: Number.isFinite(res.secondary) ? num(res.secondary) : String(res.secondary) });
  if (res.tertiary !== undefined) rows.push({ label: "Tertiary", value: num(res.tertiary) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.pct !== undefined && res.value === undefined ? num(res.pct, 2) + "%"
    : res.value === Infinity ? "∞"
    : res.value !== undefined ? num(res.value)
    : res.pct !== undefined ? num(res.pct, 2) + "%"
    : "—";
  return { primary, primaryLabel: res.pct !== undefined && res.value === undefined ? "Percent" : "Result", rows };
}

export function BizfinCostCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinCostSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-cost-price-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIZFIN_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIZFIN_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIZFIN_URL.C, config.cDefault));
  const [d, setD] = useState(useLoanInitialInput(BIZFIN_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(BIZFIN_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(BIZFIN_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(BIZFIN_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(BIZFIN_URL.P, config.pDefault));
  const [m, setM] = useState(useLoanInitialInput(BIZFIN_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(BIZFIN_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(BIZFIN_URL.S, config.sDefault));
  const [l, setL] = useState(useLoanInitialInput(BIZFIN_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(BIZFIN_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(BIZFIN_URL.H, config.hDefault));
  const [q, setQ] = useState(useLoanInitialInput(BIZFIN_URL.Q, config.qDefault));

  const setters: Record<string, (v: string) => void> = {
    a: setA, b: setB, c: setC, d: setD, r: setR, t: setT, n: setN, p: setP,
    m: setM, v: setV, s: setS, l: setL, w: setW, h: setH, q: setQ,
  };
  const values: Record<string, string> = { a, b, c, d, r, t, n, p, m, v, s, l, w, h, q };
  const labelOf = (k: string) => (config as unknown as Record<string, string | undefined>)[`${k}Label`] ?? k.toUpperCase();

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    for (const k of config.fields) {
      const val = values[k];
      if (val && val.trim() !== "") out[k] = val;
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.fields, a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  useLoanUrlSync(shareParams, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  const result = useMemo(() => {
    const input: BizfinCostInput = {};
    switch (config.mode) {

      case "costPrice": { const sellingPrice = reqPos(a,"Selling price"); if (!sellingPrice.ok) return { error: sellingPrice.error }; const marginPct = reqPos(b,"Margin %"); if (!marginPct.ok) return { error: marginPct.error }; input.sellingPrice = sellingPrice.value; input.marginPct = marginPct.value; break; }
      case "sellPrice": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; input.cost = cost.value; input.markupPct = markupPct.value; break; }
      case "be": { const fixedCosts = reqPos(a,"Fixed costs"); if (!fixedCosts.ok) return { error: fixedCosts.error }; const pricePerUnit = reqPos(b,"Price per unit"); if (!pricePerUnit.ok) return { error: pricePerUnit.error }; const variablePerUnit = reqNonNeg(c,"Variable / unit"); if (!variablePerUnit.ok) return { error: variablePerUnit.error }; input.fixedCosts = fixedCosts.value; input.pricePerUnit = pricePerUnit.value; input.variablePerUnit = variablePerUnit.value; break; }
      case "fixed": { const fixedA = reqNonNeg(a,"Fixed A"); if (!fixedA.ok) return { error: fixedA.error }; const fixedB = reqNonNeg(b,"Fixed B"); if (!fixedB.ok) return { error: fixedB.error }; const fixedC = reqNonNeg(c,"Fixed C"); if (!fixedC.ok) return { error: fixedC.error }; input.fixedA = fixedA.value; input.fixedB = fixedB.value; input.fixedC = fixedC.value; break; }
      case "var": { const variablePerUnit = reqNonNeg(a,"Variable / unit"); if (!variablePerUnit.ok) return { error: variablePerUnit.error }; const units = reqPos(b,"Units"); if (!units.ok) return { error: units.error }; input.variablePerUnit = variablePerUnit.value; input.units = units.value; break; }
      case "total": { const fixedCosts = reqNonNeg(a,"Fixed"); if (!fixedCosts.ok) return { error: fixedCosts.error }; const variableTotal = reqNonNeg(b,"Variable"); if (!variableTotal.ok) return { error: variableTotal.error }; input.fixedCosts = fixedCosts.value; input.variableTotal = variableTotal.value; break; }
      case "unit": { const cost = reqPos(a,"Total cost"); if (!cost.ok) return { error: cost.error }; const units = reqPos(b,"Units"); if (!units.ok) return { error: units.error }; input.cost = cost.value; input.units = units.value; break; }
      case "oh": { const overhead = reqPos(a,"Overhead"); if (!overhead.ok) return { error: overhead.error }; const units = reqPos(b,"Units"); if (!units.ok) return { error: units.error }; input.overhead = overhead.value; input.units = units.value; break; }
      case "cogs": { const beginningInventory = reqNonNeg(a,"Beginning"); if (!beginningInventory.ok) return { error: beginningInventory.error }; const purchases = reqNonNeg(b,"Purchases"); if (!purchases.ok) return { error: purchases.error }; const endingInventory = reqNonNeg(c,"Ending"); if (!endingInventory.ok) return { error: endingInventory.error }; input.beginningInventory = beginningInventory.value; input.purchases = purchases.value; input.endingInventory = endingInventory.value; break; }
      case "prod": { const materials = reqNonNeg(a,"Materials"); if (!materials.ok) return { error: materials.error }; const labor = reqNonNeg(b,"Labor"); if (!labor.ok) return { error: labor.error }; const overhead = reqNonNeg(c,"Overhead"); if (!overhead.ok) return { error: overhead.error }; input.materials = materials.value; input.labor = labor.value; input.overhead = overhead.value; break; }
    }
    return formatResult(computeBizfinCost(key in CONFIG ? key : "bizfin-cost-price-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-cost-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-cost-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
            </div>
          ))}
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
