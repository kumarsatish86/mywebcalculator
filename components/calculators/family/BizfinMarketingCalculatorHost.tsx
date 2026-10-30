"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinMarketing,
  type BizfinMarketingInput,
  type BizfinMarketingResult,
  type BizfinMarketingSlug,
} from "@/lib/calculators/bizfinMarketing";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "cvr" | "cpl" | "cpa" | "cpm" | "cpc" | "growth";

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

const CONFIG: Record<BizfinMarketingSlug, Config> = {
  "bizfin-conversion-rate-calculator": {
    title: "Conversion Rate Calculator",
    description: `Conversion Rate Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cvr",
    fields: ["a","b"] as const,
    aDefault: "40",
    bDefault: "2000",
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
    aLabel: "Conversions",
    bLabel: "Visitors",
  },
  "bizfin-cpl-calculator": {
    title: "CPL Calculator",
    description: `CPL Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cpl",
    fields: ["a","b"] as const,
    aDefault: "5000",
    bDefault: "100",
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
    aLabel: "Spend",
    bLabel: "Leads",
  },
  "bizfin-cpa-calculator": {
    title: "CPA Calculator",
    description: `CPA Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cpa",
    fields: ["a","b"] as const,
    aDefault: "8000",
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
    aLabel: "Spend",
    bLabel: "Acquisitions",
  },
  "bizfin-cpm-calculator": {
    title: "CPM Calculator",
    description: `CPM Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cpm",
    fields: ["a","b"] as const,
    aDefault: "1000",
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
    aLabel: "Spend",
    bLabel: "Impressions",
  },
  "bizfin-cpc-calculator": {
    title: "CPC Calculator",
    description: `CPC Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cpc",
    fields: ["a","b"] as const,
    aDefault: "500",
    bDefault: "250",
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
    aLabel: "Spend",
    bLabel: "Clicks",
  },
  "bizfin-sales-growth-calculator": {
    title: "Sales Growth Calculator",
    description: `Sales Growth Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "growth",
    fields: ["a","b"] as const,
    aDefault: "100000",
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
    aLabel: "Starting sales",
    bLabel: "Ending sales",
  },
  "bizfin-revenue-growth-calculator": {
    title: "Revenue Growth Calculator",
    description: `Revenue Growth Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "growth",
    fields: ["a","b"] as const,
    aDefault: "500000",
    bDefault: "575000",
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
    aLabel: "Starting revenue",
    bLabel: "Ending revenue",
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

function formatResult(res: BizfinMarketingResult, num: (n: number, d?: number) => string) {
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

export function BizfinMarketingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinMarketingSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-conversion-rate-calculator"];
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
    const input: BizfinMarketingInput = {};
    switch (config.mode) {
      case "cvr": {
        const conversions = reqNonNeg(a, "Conversions"); if (!conversions.ok) return { error: conversions.error };
        const visitors = reqPos(b, "Visitors"); if (!visitors.ok) return { error: visitors.error };
        input.conversions = conversions.value; input.visitors = visitors.value; break;
      }
      case "cpl": {
        const spend = reqPos(a, "Spend"); if (!spend.ok) return { error: spend.error };
        const leads = reqPos(b, "Leads"); if (!leads.ok) return { error: leads.error };
        input.spend = spend.value; input.leads = leads.value; break;
      }
      case "cpa": {
        const spend = reqPos(a, "Spend"); if (!spend.ok) return { error: spend.error };
        const acquisitions = reqPos(b, "Acquisitions"); if (!acquisitions.ok) return { error: acquisitions.error };
        input.spend = spend.value; input.acquisitions = acquisitions.value; break;
      }
      case "cpm": {
        const spend = reqPos(a, "Spend"); if (!spend.ok) return { error: spend.error };
        const impressions = reqPos(b, "Impressions"); if (!impressions.ok) return { error: impressions.error };
        input.spend = spend.value; input.impressions = impressions.value; break;
      }
      case "cpc": {
        const spend = reqPos(a, "Spend"); if (!spend.ok) return { error: spend.error };
        const clicks = reqPos(b, "Clicks"); if (!clicks.ok) return { error: clicks.error };
        input.spend = spend.value; input.clicks = clicks.value; break;
      }
      case "growth": {
        const startValue = reqFinite(a, "Start"); if (!startValue.ok) return { error: startValue.error };
        const endValue = reqFinite(b, "End"); if (!endValue.ok) return { error: endValue.error };
        input.startValue = startValue.value; input.endValue = endValue.value; break;
      }
    }
    return formatResult(computeBizfinMarketing(key in CONFIG ? key : "bizfin-conversion-rate-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-mkt-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-mkt-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
