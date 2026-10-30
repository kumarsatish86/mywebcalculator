"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinRatios,
  type BizfinRatiosInput,
  type BizfinRatiosResult,
  type BizfinRatiosSlug,
} from "@/lib/calculators/bizfinRatios";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "prof" | "roa" | "roe" | "roce" | "invt" | "at" | "art" | "apt" | "de" | "dr" | "ic";

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

const CONFIG: Record<BizfinRatiosSlug, Config> = {
  "bizfin-profitability-ratios-calculator": {
    title: "Profitability Ratios",
    description: `Profitability Ratios: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "prof",
    fields: ["a","b","c"] as const,
    aDefault: "1000000",
    bDefault: "400000",
    cDefault: "120000",
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
    aLabel: "Revenue",
    bLabel: "Gross profit",
    cLabel: "Net income",
  },
  "bizfin-roa-calculator": {
    title: "ROA Calculator",
    description: `ROA Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "roa",
    fields: ["a","b"] as const,
    aDefault: "120000",
    bDefault: "800000",
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
    aLabel: "Net income",
    bLabel: "Assets",
  },
  "bizfin-roe-calculator": {
    title: "ROE Calculator",
    description: `ROE Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "roe",
    fields: ["a","b"] as const,
    aDefault: "120000",
    bDefault: "500000",
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
    aLabel: "Net income",
    bLabel: "Equity",
  },
  "bizfin-roce-calculator": {
    title: "ROCE Calculator",
    description: `ROCE Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "roce",
    fields: ["a","b"] as const,
    aDefault: "150000",
    bDefault: "600000",
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
    aLabel: "EBIT",
    bLabel: "Capital employed",
  },
  "bizfin-inventory-turnover-ratio-calculator": {
    title: "Inventory Turnover Calculator",
    description: `Inventory Turnover Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "invt",
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
  "bizfin-asset-turnover-calculator": {
    title: "Asset Turnover Calculator",
    description: `Asset Turnover Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "at",
    fields: ["a","b"] as const,
    aDefault: "1000000",
    bDefault: "800000",
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
    aLabel: "Revenue",
    bLabel: "Assets",
  },
  "bizfin-accounts-receivable-turnover-calculator": {
    title: "AR Turnover Calculator",
    description: `AR Turnover Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "art",
    fields: ["a","b"] as const,
    aDefault: "1000000",
    bDefault: "125000",
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
    aLabel: "Revenue",
    bLabel: "Receivables",
  },
  "bizfin-accounts-payable-turnover-calculator": {
    title: "AP Turnover Calculator",
    description: `AP Turnover Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "apt",
    fields: ["a","b"] as const,
    aDefault: "500000",
    bDefault: "80000",
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
    bLabel: "Payables",
  },
  "bizfin-debt-to-equity-calculator": {
    title: "Debt-to-Equity Calculator",
    description: `Debt-to-Equity Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "de",
    fields: ["a","b"] as const,
    aDefault: "300000",
    bDefault: "500000",
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
    aLabel: "Debt",
    bLabel: "Equity",
  },
  "bizfin-debt-ratio-calculator": {
    title: "Debt Ratio Calculator",
    description: `Debt Ratio Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "dr",
    fields: ["a","b"] as const,
    aDefault: "300000",
    bDefault: "800000",
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
    aLabel: "Debt",
    bLabel: "Assets",
  },
  "bizfin-interest-coverage-ratio-calculator": {
    title: "Interest Coverage Calculator",
    description: `Interest Coverage Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ic",
    fields: ["a","b"] as const,
    aDefault: "150000",
    bDefault: "30000",
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
    aLabel: "EBIT",
    bLabel: "Interest",
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

function formatResult(res: BizfinRatiosResult, num: (n: number, d?: number) => string) {
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

export function BizfinRatiosCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinRatiosSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-profitability-ratios-calculator"];
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
    const input: BizfinRatiosInput = {};
    switch (config.mode) {

      case "prof": { const revenue = reqPos(a,"Revenue"); if (!revenue.ok) return { error: revenue.error }; const grossProfit = reqFinite(b,"GP"); if (!grossProfit.ok) return { error: grossProfit.error }; const netIncome = reqFinite(c,"NI"); if (!netIncome.ok) return { error: netIncome.error }; input.revenue = revenue.value; input.grossProfit = grossProfit.value; input.netIncome = netIncome.value; break; }
      case "roa": { const netIncome = reqFinite(a,"NI"); if (!netIncome.ok) return { error: netIncome.error }; const assets = reqPos(b,"Assets"); if (!assets.ok) return { error: assets.error }; input.netIncome = netIncome.value; input.assets = assets.value; break; }
      case "roe": { const netIncome = reqFinite(a,"NI"); if (!netIncome.ok) return { error: netIncome.error }; const equity = reqPos(b,"Equity"); if (!equity.ok) return { error: equity.error }; input.netIncome = netIncome.value; input.equity = equity.value; break; }
      case "roce": { const ebit = reqFinite(a,"EBIT"); if (!ebit.ok) return { error: ebit.error }; const capitalEmployed = reqPos(b,"CE"); if (!capitalEmployed.ok) return { error: capitalEmployed.error }; input.ebit = ebit.value; input.capitalEmployed = capitalEmployed.value; break; }
      case "invt": { const cogs = reqPos(a,"COGS"); if (!cogs.ok) return { error: cogs.error }; const inventory = reqPos(b,"Inventory"); if (!inventory.ok) return { error: inventory.error }; input.cogs = cogs.value; input.inventory = inventory.value; break; }
      case "at": { const revenue = reqPos(a,"Revenue"); if (!revenue.ok) return { error: revenue.error }; const assets = reqPos(b,"Assets"); if (!assets.ok) return { error: assets.error }; input.revenue = revenue.value; input.assets = assets.value; break; }
      case "art": { const revenue = reqPos(a,"Revenue"); if (!revenue.ok) return { error: revenue.error }; const receivables = reqPos(b,"AR"); if (!receivables.ok) return { error: receivables.error }; input.revenue = revenue.value; input.receivables = receivables.value; break; }
      case "apt": { const cogs = reqPos(a,"COGS"); if (!cogs.ok) return { error: cogs.error }; const payables = reqPos(b,"AP"); if (!payables.ok) return { error: payables.error }; input.cogs = cogs.value; input.payables = payables.value; break; }
      case "de": { const debt = reqNonNeg(a,"Debt"); if (!debt.ok) return { error: debt.error }; const equity = reqPos(b,"Equity"); if (!equity.ok) return { error: equity.error }; input.debt = debt.value; input.equity = equity.value; break; }
      case "dr": { const debt = reqNonNeg(a,"Debt"); if (!debt.ok) return { error: debt.error }; const assets = reqPos(b,"Assets"); if (!assets.ok) return { error: assets.error }; input.debt = debt.value; input.assets = assets.value; break; }
      case "ic": { const ebit = reqFinite(a,"EBIT"); if (!ebit.ok) return { error: ebit.error }; const interest = reqPos(b,"Interest"); if (!interest.ok) return { error: interest.error }; input.ebit = ebit.value; input.interest = interest.value; break; }
    }
    return formatResult(computeBizfinRatios(key in CONFIG ? key : "bizfin-profitability-ratios-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-ratios-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-ratios-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
