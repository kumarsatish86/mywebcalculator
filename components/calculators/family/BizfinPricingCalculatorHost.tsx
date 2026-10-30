"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinPricing,
  type BizfinPricingInput,
  type BizfinPricingResult,
  type BizfinPricingSlug,
} from "@/lib/calculators/bizfinPricing";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "markup" | "markdown" | "strategy" | "dyn" | "wholesale" | "retail" | "disc" | "elast" | "value";

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

const CONFIG: Record<BizfinPricingSlug, Config> = {
  "bizfin-markup-calculator": {
    title: "Markup Calculator",
    description: `Markup Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "markup",
    fields: ["a","b"] as const,
    aDefault: "40",
    bDefault: "70",
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
    bLabel: "Price",
  },
  "bizfin-markdown-calculator": {
    title: "Markdown Calculator",
    description: `Markdown Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "markdown",
    fields: ["a","b"] as const,
    aDefault: "100",
    bDefault: "75",
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
    aLabel: "Original price",
    bLabel: "Sale price",
  },
  "bizfin-pricing-strategy-calculator": {
    title: "Pricing Strategy Calculator",
    description: `Pricing Strategy Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "strategy",
    fields: ["a","b","c"] as const,
    aDefault: "50",
    bDefault: "40",
    cDefault: "35",
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
    bLabel: "Cost-plus markup %",
    cLabel: "Target margin %",
  },
  "bizfin-dynamic-pricing-calculator": {
    title: "Dynamic Pricing Calculator",
    description: `Dynamic Pricing Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "dyn",
    fields: ["a","b"] as const,
    aDefault: "100",
    bDefault: "1.2",
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
    aLabel: "Base price",
    bLabel: "Demand factor",
  },
  "bizfin-wholesale-price-calculator": {
    title: "Wholesale Price Calculator",
    description: `Wholesale Price Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "wholesale",
    fields: ["a","b"] as const,
    aDefault: "30",
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
    aLabel: "Cost",
    bLabel: "Wholesale markup %",
  },
  "bizfin-retail-price-calculator": {
    title: "Retail Price Calculator",
    description: `Retail Price Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "retail",
    fields: ["a","b"] as const,
    aDefault: "40",
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
    aLabel: "Wholesale",
    bLabel: "Retail markup %",
  },
  "bizfin-discount-pricing-calculator": {
    title: "Discount Pricing Calculator",
    description: `Discount Pricing Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "disc",
    fields: ["a","b"] as const,
    aDefault: "120",
    bDefault: "15",
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
    aLabel: "List price",
    bLabel: "Discount %",
  },
  "bizfin-price-elasticity-calculator": {
    title: "Price Elasticity Calculator",
    description: `Price Elasticity Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "elast",
    fields: ["a","b"] as const,
    aDefault: "20",
    bDefault: "-10",
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
    aLabel: "% quantity change",
    bLabel: "% price change",
  },
  "bizfin-value-based-pricing-calculator": {
    title: "Value-based Pricing Calculator",
    description: `Value-based Pricing Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "value",
    fields: ["a","b"] as const,
    aDefault: "200",
    bDefault: "60",
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
    aLabel: "Perceived value",
    bLabel: "Value capture %",
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

function formatResult(res: BizfinPricingResult, num: (n: number, d?: number) => string) {
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

export function BizfinPricingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinPricingSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-markup-calculator"];
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
    const input: BizfinPricingInput = {};
    switch (config.mode) {

      case "markup": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const price = reqPos(b,"Price"); if (!price.ok) return { error: price.error }; input.cost = cost.value; input.price = price.value; break; }
      case "markdown": { const originalPrice = reqPos(a,"Original"); if (!originalPrice.ok) return { error: originalPrice.error }; const salePrice = reqPos(b,"Sale"); if (!salePrice.ok) return { error: salePrice.error }; input.originalPrice = originalPrice.value; input.salePrice = salePrice.value; break; }
      case "strategy": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; const marginPct = reqPos(c,"Margin %"); if (!marginPct.ok) return { error: marginPct.error }; input.cost = cost.value; input.markupPct = markupPct.value; input.marginPct = marginPct.value; break; }
      case "dyn": { const price = reqPos(a,"Base price"); if (!price.ok) return { error: price.error }; const demandFactor = reqPos(b,"Demand factor"); if (!demandFactor.ok) return { error: demandFactor.error }; input.price = price.value; input.demandFactor = demandFactor.value; break; }
      case "wholesale": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; input.cost = cost.value; input.markupPct = markupPct.value; break; }
      case "retail": { const wholesale = reqPos(a,"Wholesale"); if (!wholesale.ok) return { error: wholesale.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; input.wholesale = wholesale.value; input.markupPct = markupPct.value; break; }
      case "disc": { const price = reqPos(a,"List"); if (!price.ok) return { error: price.error }; const discountPct = reqNonNeg(b,"Discount %"); if (!discountPct.ok) return { error: discountPct.error }; input.price = price.value; input.discountPct = discountPct.value; break; }
      case "elast": { const pctQtyChange = reqFinite(a,"% qty"); if (!pctQtyChange.ok) return { error: pctQtyChange.error }; const pctPriceChange = reqFinite(b,"% price"); if (!pctPriceChange.ok) return { error: pctPriceChange.error }; input.pctQtyChange = pctQtyChange.value; input.pctPriceChange = pctPriceChange.value; break; }
      case "value": { const perceivedValue = reqPos(a,"Value"); if (!perceivedValue.ok) return { error: perceivedValue.error }; const valueCapturePct = reqNonNeg(b,"Capture %"); if (!valueCapturePct.ok) return { error: valueCapturePct.error }; input.perceivedValue = perceivedValue.value; input.valueCapturePct = valueCapturePct.value; break; }
    }
    return formatResult(computeBizfinPricing(key in CONFIG ? key : "bizfin-markup-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-pricing-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-pricing-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
