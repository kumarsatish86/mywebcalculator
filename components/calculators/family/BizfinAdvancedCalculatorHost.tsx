"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinAdvanced,
  type BizfinAdvancedInput,
  type BizfinAdvancedResult,
  type BizfinAdvancedSlug,
} from "@/lib/calculators/bizfinAdvanced";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "pred" | "price" | "health" | "dil" | "inv";

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

const CONFIG: Record<BizfinAdvancedSlug, Config> = {
  "bizfin-ai-business-profit-predictor": {
    title: "AI Business Profit Predictor",
    description: `AI Business Profit Predictor: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "pred",
    fields: ["a","b","c"] as const,
    aDefault: "200000",
    bDefault: "10",
    cDefault: "3",
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
    aLabel: "Recent profit",
    bLabel: "Assumed growth %",
    cLabel: "Years ahead",
  },
  "bizfin-ai-pricing-optimizer": {
    title: "AI Pricing Optimizer",
    description: `AI Pricing Optimizer: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "price",
    fields: ["a","b","c","d"] as const,
    aDefault: "40",
    bDefault: "35",
    cDefault: "1.2",
    dDefault: "55",
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
    aLabel: "Unit cost",
    bLabel: "Target margin %",
    cLabel: "Elasticity (opt)",
    dLabel: "Current price (opt)",
  },
  "bizfin-business-health-score-calculator": {
    title: "Business Health Score Calculator",
    description: `Business Health Score Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "health",
    fields: ["a","b","c","d"] as const,
    aDefault: "15",
    bDefault: "1.8",
    cDefault: "0.6",
    dDefault: "12",
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
    aLabel: "Profit margin %",
    bLabel: "Current ratio",
    cLabel: "Debt-to-equity",
    dLabel: "Revenue growth %",
  },
  "bizfin-startup-funding-dilution-calculator": {
    title: "Startup Funding Dilution Calculator",
    description: `Startup Funding Dilution Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "dil",
    fields: ["a","b","c"] as const,
    aDefault: "4000000",
    bDefault: "1000000",
    cDefault: "80",
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
    aLabel: "Pre-money",
    bLabel: "Raise amount",
    cLabel: "Founder % pre",
  },
  "bizfin-investor-return-calculator": {
    title: "Investor Return Calculator",
    description: `Investor Return Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "inv",
    fields: ["a","b","c","d"] as const,
    aDefault: "500000",
    bDefault: "20000000",
    cDefault: "10",
    dDefault: "5",
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
    aLabel: "Investment",
    bLabel: "Exit equity value",
    cLabel: "Ownership %",
    dLabel: "Years held",
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

function formatResult(res: BizfinAdvancedResult, num: (n: number, d?: number) => string) {
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

export function BizfinAdvancedCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinAdvancedSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-ai-business-profit-predictor"];
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
    const input: BizfinAdvancedInput = {};
    switch (config.mode) {
      case "pred": {
        const recentProfit = reqFinite(a, "Profit"); if (!recentProfit.ok) return { error: recentProfit.error };
        const growthPct = reqFinite(b, "Growth"); if (!growthPct.ok) return { error: growthPct.error };
        const years = reqPos(c, "Years"); if (!years.ok) return { error: years.error };
        input.recentProfit = recentProfit.value; input.growthPct = growthPct.value; input.years = years.value; break;
      }
      case "price": {
        const cost = reqPos(a, "Cost"); if (!cost.ok) return { error: cost.error };
        const targetMarginPct = reqPos(b, "Margin"); if (!targetMarginPct.ok) return { error: targetMarginPct.error };
        input.cost = cost.value; input.targetMarginPct = targetMarginPct.value;
        if (c.trim() !== "") { const elasticity = reqFinite(c, "Elasticity"); if (!elasticity.ok) return { error: elasticity.error }; input.elasticity = elasticity.value; }
        if (d.trim() !== "") { const currentPrice = reqPos(d, "Current price"); if (!currentPrice.ok) return { error: currentPrice.error }; input.currentPrice = currentPrice.value; }
        break;
      }
      case "health": {
        const marginPct = reqFinite(a, "Margin"); if (!marginPct.ok) return { error: marginPct.error };
        const currentRatio = reqPos(b, "Current ratio"); if (!currentRatio.ok) return { error: currentRatio.error };
        const debtToEquity = reqNonNeg(c, "D/E"); if (!debtToEquity.ok) return { error: debtToEquity.error };
        const revenueGrowthPct = reqFinite(d, "Growth"); if (!revenueGrowthPct.ok) return { error: revenueGrowthPct.error };
        input.marginPct = marginPct.value; input.currentRatio = currentRatio.value; input.debtToEquity = debtToEquity.value; input.revenueGrowthPct = revenueGrowthPct.value; break;
      }
      case "dil": {
        const preMoney = reqPos(a, "Pre-money"); if (!preMoney.ok) return { error: preMoney.error };
        const raise = reqPos(b, "Raise"); if (!raise.ok) return { error: raise.error };
        const founderPct = reqNonNeg(c, "Founder %"); if (!founderPct.ok) return { error: founderPct.error };
        input.preMoney = preMoney.value; input.raise = raise.value; input.founderPct = founderPct.value; break;
      }
      case "inv": {
        const invest = reqPos(a, "Investment"); if (!invest.ok) return { error: invest.error };
        const exitValue = reqPos(b, "Exit"); if (!exitValue.ok) return { error: exitValue.error };
        const ownershipPct = reqPos(c, "Ownership"); if (!ownershipPct.ok) return { error: ownershipPct.error };
        const years = reqPos(d, "Years"); if (!years.ok) return { error: years.error };
        input.invest = invest.value; input.exitValue = exitValue.value; input.ownershipPct = ownershipPct.value; input.years = years.value; break;
      }
    }
    return formatResult(computeBizfinAdvanced(key in CONFIG ? key : "bizfin-ai-business-profit-predictor", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-adv-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-adv-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
