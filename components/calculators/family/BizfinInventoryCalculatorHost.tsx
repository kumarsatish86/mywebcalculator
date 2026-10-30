"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinInventory,
  type BizfinInventoryInput,
  type BizfinInventoryResult,
  type BizfinInventorySlug,
} from "@/lib/calculators/bizfinInventory";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "invCost" | "eoq" | "safety" | "rop" | "turns" | "hold" | "oq";

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

const CONFIG: Record<BizfinInventorySlug, Config> = {
  "bizfin-inventory-cost-calculator": {
    title: "Inventory Cost Calculator",
    description: `Inventory Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "invCost",
    fields: ["a","b","c"] as const,
    aDefault: "1000",
    bDefault: "50",
    cDefault: "20",
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
    aLabel: "Units",
    bLabel: "Unit cost",
    cLabel: "Holding %",
  },
  "bizfin-eoq-calculator": {
    title: "EOQ Calculator",
    description: `EOQ Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "eoq",
    fields: ["a","b","c"] as const,
    aDefault: "12000",
    bDefault: "100",
    cDefault: "2",
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
    aLabel: "Annual demand",
    bLabel: "Order cost S",
    cLabel: "Holding cost H",
  },
  "bizfin-safety-stock-calculator": {
    title: "Safety Stock Calculator",
    description: `Safety Stock Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "safety",
    fields: ["a","b","c"] as const,
    aDefault: "1.65",
    bDefault: "40",
    cDefault: "2",
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
    aLabel: "Z-score",
    bLabel: "Demand std. dev.",
    cLabel: "Lead time",
  },
  "bizfin-reorder-point-calculator": {
    title: "Reorder Point Calculator",
    description: `Reorder Point Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "rop",
    fields: ["a","b","c"] as const,
    aDefault: "100",
    bDefault: "5",
    cDefault: "50",
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
    aLabel: "Demand / period",
    bLabel: "Lead time",
    cLabel: "Safety stock",
  },
  "bizfin-inventory-turnover-operations-calculator": {
    title: "Inventory Turnover Calculator",
    description: `Inventory Turnover Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "turns",
    fields: ["a","b"] as const,
    aDefault: "500000",
    bDefault: "100000",
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
    aLabel: "COGS",
    bLabel: "Average inventory",
  },
  "bizfin-holding-cost-calculator": {
    title: "Holding Cost Calculator",
    description: `Holding Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "hold",
    fields: ["a","b"] as const,
    aDefault: "200000",
    bDefault: "25",
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
    aLabel: "Avg inventory value",
    bLabel: "Holding %",
  },
  "bizfin-order-quantity-calculator": {
    title: "Order Quantity Calculator",
    description: `Order Quantity Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "oq",
    fields: ["a","b","c"] as const,
    aDefault: "12000",
    bDefault: "365",
    cDefault: "12",
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
    aLabel: "Demand",
    bLabel: "Days in horizon",
    cLabel: "# of orders",
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

function formatResult(res: BizfinInventoryResult, num: (n: number, d?: number) => string) {
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

export function BizfinInventoryCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinInventorySlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-inventory-cost-calculator"];
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
    const input: BizfinInventoryInput = {};
    switch (config.mode) {
      case "invCost": {
        const units = reqPos(a, "Units"); if (!units.ok) return { error: units.error };
        const unitCost = reqPos(b, "Unit cost"); if (!unitCost.ok) return { error: unitCost.error };
        const holdingPct = reqNonNeg(c, "Holding %"); if (!holdingPct.ok) return { error: holdingPct.error };
        input.units = units.value; input.unitCost = unitCost.value; input.holdingPct = holdingPct.value; break;
      }
      case "eoq": {
        const demand = reqPos(a, "Demand"); if (!demand.ok) return { error: demand.error };
        const orderCost = reqPos(b, "Order cost"); if (!orderCost.ok) return { error: orderCost.error };
        const holdingCost = reqPos(c, "Holding cost"); if (!holdingCost.ok) return { error: holdingCost.error };
        input.demand = demand.value; input.orderCost = orderCost.value; input.holdingCost = holdingCost.value; break;
      }
      case "safety": {
        const zScore = reqPos(a, "Z-score"); if (!zScore.ok) return { error: zScore.error };
        const demandStd = reqPos(b, "Demand std"); if (!demandStd.ok) return { error: demandStd.error };
        const leadTime = reqPos(c, "Lead time"); if (!leadTime.ok) return { error: leadTime.error };
        input.zScore = zScore.value; input.demandStd = demandStd.value; input.leadTime = leadTime.value; break;
      }
      case "rop": {
        const avgDemand = reqPos(a, "Demand"); if (!avgDemand.ok) return { error: avgDemand.error };
        const leadTime = reqPos(b, "Lead time"); if (!leadTime.ok) return { error: leadTime.error };
        const safetyStock = reqNonNeg(c, "Safety stock"); if (!safetyStock.ok) return { error: safetyStock.error };
        input.avgDemand = avgDemand.value; input.leadTime = leadTime.value; input.safetyStock = safetyStock.value; break;
      }
      case "turns": {
        const cogs = reqPos(a, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const avgInventory = reqPos(b, "Avg inventory"); if (!avgInventory.ok) return { error: avgInventory.error };
        input.cogs = cogs.value; input.avgInventory = avgInventory.value; break;
      }
      case "hold": {
        const avgInventory = reqPos(a, "Avg inventory value"); if (!avgInventory.ok) return { error: avgInventory.error };
        const holdingPct = reqPos(b, "Holding %"); if (!holdingPct.ok) return { error: holdingPct.error };
        input.avgInventory = avgInventory.value; input.holdingPct = holdingPct.value; break;
      }
      case "oq": {
        const demand = reqPos(a, "Demand"); if (!demand.ok) return { error: demand.error };
        const days = reqPos(b, "Days"); if (!days.ok) return { error: days.error };
        const units = reqPos(c, "# orders"); if (!units.ok) return { error: units.error };
        input.demand = demand.value; input.days = days.value; input.units = units.value; break;
      }
    }
    return formatResult(computeBizfinInventory(key in CONFIG ? key : "bizfin-inventory-cost-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-inv-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-inv-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
