"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinProfit,
  type BizfinProfitInput,
  type BizfinProfitResult,
  type BizfinProfitSlug,
} from "@/lib/calculators/bizfinProfit";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "revExp" | "revCogs" | "net" | "ebit" | "marginProfit" | "contrib" | "ebitda";

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

const CONFIG: Record<BizfinProfitSlug, Config> = {
  "bizfin-profit-calculator": {
    title: "Profit Calculator",
    description: `Profit Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "revExp",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "70000",
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
    bLabel: "Expenses",
  },
  "bizfin-gross-profit-calculator": {
    title: "Gross Profit Calculator",
    description: `Gross Profit Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "revCogs",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "55000",
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
    bLabel: "COGS",
  },
  "bizfin-net-profit-calculator": {
    title: "Net Profit Calculator",
    description: `Net Profit Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "net",
    fields: ["a","b","c","r","t"] as const,
    aDefault: "100000",
    bDefault: "40000",
    cDefault: "25000",
    dDefault: "",
    rDefault: "3000",
    tDefault: "5000",
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
    bLabel: "COGS",
    cLabel: "Operating expenses",
    rLabel: "Interest",
    tLabel: "Tax",
  },
  "bizfin-operating-profit-calculator": {
    title: "Operating Profit Calculator",
    description: `Operating Profit Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ebit",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "40000",
    cDefault: "25000",
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
    bLabel: "COGS",
    cLabel: "Operating expenses",
  },
  "bizfin-profit-margin-calculator": {
    title: "Profit Margin Calculator",
    description: `Profit Margin Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "marginProfit",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "18000",
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
    bLabel: "Profit",
  },
  "bizfin-gross-margin-calculator": {
    title: "Gross Margin Calculator",
    description: `Gross Margin Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "revCogs",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "55000",
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
    bLabel: "COGS",
  },
  "bizfin-net-margin-calculator": {
    title: "Net Margin Calculator",
    description: `Net Margin Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "net",
    fields: ["a","b","c","r","t"] as const,
    aDefault: "100000",
    bDefault: "40000",
    cDefault: "25000",
    dDefault: "",
    rDefault: "3000",
    tDefault: "5000",
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
    bLabel: "COGS",
    cLabel: "Operating expenses",
    rLabel: "Interest",
    tLabel: "Tax",
  },
  "bizfin-contribution-margin-calculator": {
    title: "Contribution Margin Calculator",
    description: `Contribution Margin Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "contrib",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "45000",
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
    bLabel: "Variable costs",
  },
  "bizfin-ebitda-calculator": {
    title: "EBITDA Calculator",
    description: `EBITDA Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ebitda",
    fields: ["a","b","c","d"] as const,
    aDefault: "100000",
    bDefault: "40000",
    cDefault: "25000",
    dDefault: "8000",
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
    bLabel: "COGS",
    cLabel: "Operating expenses",
    dLabel: "D&A",
  },
  "bizfin-ebit-calculator": {
    title: "EBIT Calculator",
    description: `EBIT Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ebit",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "40000",
    cDefault: "25000",
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
    bLabel: "COGS",
    cLabel: "Operating expenses",
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

function reqPos(raw: string, label: string) {
  return parsePositive(raw, label);
}
function reqNonNeg(raw: string, label: string) {
  if (raw.trim() === "") return parseNonNegative("0", label);
  return parseNonNegative(raw, label);
}
function reqFinite(raw: string, label: string) {
  return parseFiniteNumber(raw, label);
}

function formatResult(res: BizfinProfitResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.value !== undefined && Number.isFinite(res.value)) rows.push({ label: "Result", value: num(res.value) });
  else if (res.value === Infinity) rows.push({ label: "Result", value: "∞" });
  if (res.pct !== undefined) rows.push({ label: "Percent", value: num(res.pct, 2) + "%" });
  if (res.secondary !== undefined) rows.push({ label: "Secondary", value: num(res.secondary) });
  if (res.tertiary !== undefined) rows.push({ label: "Tertiary", value: num(res.tertiary) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.pct !== undefined && res.value === undefined ? num(res.pct, 2) + "%"
    : res.value === Infinity ? "∞"
    : res.value !== undefined ? num(res.value)
    : res.pct !== undefined ? num(res.pct, 2) + "%"
    : "—";
  const primaryLabel = res.pct !== undefined && res.value === undefined ? "Percent" : "Result";
  return { primary, primaryLabel, rows };
}

export function BizfinProfitCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinProfitSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-profit-calculator"];
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
  }, [config.fields, a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  useLoanUrlSync(shareParams, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  const result = useMemo(() => {
    const input: BizfinProfitInput = {};
    switch (config.mode) {

      case "revExp": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const expenses = reqNonNeg(b, "Expenses"); if (!expenses.ok) return { error: expenses.error };
        input.revenue = revenue.value; input.expenses = expenses.value; break;
      }
      case "revCogs": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        input.revenue = revenue.value; input.cogs = cogs.value; break;
      }
      case "net": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const opex = reqNonNeg(c, "Operating expenses"); if (!opex.ok) return { error: opex.error };
        const interest = reqNonNeg(r, "Interest"); if (!interest.ok) return { error: interest.error };
        const tax = reqNonNeg(t, "Tax"); if (!tax.ok) return { error: tax.error };
        input.revenue = revenue.value; input.cogs = cogs.value; input.opex = opex.value; input.interest = interest.value; input.tax = tax.value; break;
      }
      case "ebit": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const opex = reqNonNeg(c, "Operating expenses"); if (!opex.ok) return { error: opex.error };
        input.revenue = revenue.value; input.cogs = cogs.value; input.opex = opex.value; break;
      }
      case "marginProfit": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const profit = reqFinite(b, "Profit"); if (!profit.ok) return { error: profit.error };
        input.revenue = revenue.value; input.profit = profit.value; break;
      }
      case "contrib": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const variableCosts = reqNonNeg(b, "Variable costs"); if (!variableCosts.ok) return { error: variableCosts.error };
        input.revenue = revenue.value; input.variableCosts = variableCosts.value; break;
      }
      case "ebitda": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const opex = reqNonNeg(c, "Operating expenses"); if (!opex.ok) return { error: opex.error };
        const depreciation = reqNonNeg(d, "D&A"); if (!depreciation.ok) return { error: depreciation.error };
        input.revenue = revenue.value; input.cogs = cogs.value; input.opex = opex.value; input.depreciation = depreciation.value; break;
      }
    }
    return formatResult(
      computeBizfinProfit(key in CONFIG ? key : "bizfin-profit-calculator", input),
      num,
    );
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-profit-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput
                id={`bf-profit-${k}`}
                value={values[k]}
                onChange={(ev) => setters[k](ev.target.value)}
                inputMode="decimal"
              />
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
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
