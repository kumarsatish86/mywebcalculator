"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinCash,
  type BizfinCashInput,
  type BizfinCashResult,
  type BizfinCashSlug,
} from "@/lib/calculators/bizfinCash";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "cf" | "fcf" | "ocf" | "wc" | "ccc" | "current" | "quick";

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

const CONFIG: Record<BizfinCashSlug, Config> = {
  "bizfin-cash-flow-calculator": {
    title: "Cash Flow Calculator",
    description: `Cash Flow Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cf",
    fields: ["a","b"] as const,
    aDefault: "120000",
    bDefault: "95000",
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
    aLabel: "Inflows",
    bLabel: "Outflows",
  },
  "bizfin-free-cash-flow-calculator": {
    title: "Free Cash Flow Calculator",
    description: `Free Cash Flow Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "fcf",
    fields: ["a","b"] as const,
    aDefault: "80000",
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
    aLabel: "Operating cash flow",
    bLabel: "CapEx",
  },
  "bizfin-operating-cash-flow-calculator": {
    title: "Operating Cash Flow Calculator",
    description: `Operating Cash Flow Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ocf",
    fields: ["a","b","c"] as const,
    aDefault: "50000",
    bDefault: "10000",
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
    aLabel: "Net income",
    bLabel: "D&A",
    cLabel: "Δ Working capital",
  },
  "bizfin-working-capital-calculator": {
    title: "Working Capital Calculator",
    description: `Working Capital Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "wc",
    fields: ["a","b"] as const,
    aDefault: "200000",
    bDefault: "120000",
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
    aLabel: "Current assets",
    bLabel: "Current liabilities",
  },
  "bizfin-cash-conversion-cycle-calculator": {
    title: "Cash Conversion Cycle Calculator",
    description: `Cash Conversion Cycle Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ccc",
    fields: ["a","b","c"] as const,
    aDefault: "45",
    bDefault: "30",
    cDefault: "25",
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
    aLabel: "DIO",
    bLabel: "DSO",
    cLabel: "DPO",
  },
  "bizfin-liquidity-ratio-calculator": {
    title: "Liquidity Ratio Calculator",
    description: `Liquidity Ratio Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "current",
    fields: ["a","b"] as const,
    aDefault: "200000",
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
    aLabel: "Current assets",
    bLabel: "Current liabilities",
  },
  "bizfin-current-ratio-calculator": {
    title: "Current Ratio Calculator",
    description: `Current Ratio Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "current",
    fields: ["a","b"] as const,
    aDefault: "180000",
    bDefault: "90000",
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
    aLabel: "Current assets",
    bLabel: "Current liabilities",
  },
  "bizfin-quick-ratio-calculator": {
    title: "Quick Ratio Calculator",
    description: `Quick Ratio Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "quick",
    fields: ["a","b","c"] as const,
    aDefault: "180000",
    bDefault: "40000",
    cDefault: "90000",
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
    aLabel: "Current assets",
    bLabel: "Inventory",
    cLabel: "Current liabilities",
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

function formatResult(res: BizfinCashResult, num: (n: number, d?: number) => string) {
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

export function BizfinCashCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinCashSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-cash-flow-calculator"];
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
    const input: BizfinCashInput = {};
    switch (config.mode) {

      case "cf": { const inflows = reqFinite(a,"Inflows"); if (!inflows.ok) return { error: inflows.error }; const outflows = reqNonNeg(b,"Outflows"); if (!outflows.ok) return { error: outflows.error }; input.inflows = inflows.value; input.outflows = outflows.value; break; }
      case "fcf": { const ocf = reqFinite(a,"OCF"); if (!ocf.ok) return { error: ocf.error }; const capex = reqNonNeg(b,"CapEx"); if (!capex.ok) return { error: capex.error }; input.ocf = ocf.value; input.capex = capex.value; break; }
      case "ocf": { const netIncome = reqFinite(a,"NI"); if (!netIncome.ok) return { error: netIncome.error }; const depreciation = reqNonNeg(b,"D&A"); if (!depreciation.ok) return { error: depreciation.error }; const wcChange = reqFinite(c,"ΔWC"); if (!wcChange.ok) return { error: wcChange.error }; input.netIncome = netIncome.value; input.depreciation = depreciation.value; input.wcChange = wcChange.value; break; }
      case "wc": { const currentAssets = reqNonNeg(a,"CA"); if (!currentAssets.ok) return { error: currentAssets.error }; const currentLiabilities = reqNonNeg(b,"CL"); if (!currentLiabilities.ok) return { error: currentLiabilities.error }; input.currentAssets = currentAssets.value; input.currentLiabilities = currentLiabilities.value; break; }
      case "ccc": { const dio = reqNonNeg(a,"DIO"); if (!dio.ok) return { error: dio.error }; const dso = reqNonNeg(b,"DSO"); if (!dso.ok) return { error: dso.error }; const dpo = reqNonNeg(c,"DPO"); if (!dpo.ok) return { error: dpo.error }; input.dio = dio.value; input.dso = dso.value; input.dpo = dpo.value; break; }
      case "current": { const currentAssets = reqPos(a,"CA"); if (!currentAssets.ok) return { error: currentAssets.error }; const currentLiabilities = reqPos(b,"CL"); if (!currentLiabilities.ok) return { error: currentLiabilities.error }; input.currentAssets = currentAssets.value; input.currentLiabilities = currentLiabilities.value; break; }
      case "quick": { const currentAssets = reqPos(a,"CA"); if (!currentAssets.ok) return { error: currentAssets.error }; const inventory = reqNonNeg(b,"Inventory"); if (!inventory.ok) return { error: inventory.error }; const currentLiabilities = reqPos(c,"CL"); if (!currentLiabilities.ok) return { error: currentLiabilities.error }; input.currentAssets = currentAssets.value; input.inventory = inventory.value; input.currentLiabilities = currentLiabilities.value; break; }
    }
    return formatResult(computeBizfinCash(key in CONFIG ? key : "bizfin-cash-flow-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-cash-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-cash-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
