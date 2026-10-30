"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinForecast,
  type BizfinForecastInput,
  type BizfinForecastResult,
  type BizfinForecastSlug,
} from "@/lib/calculators/bizfinForecast";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "rev" | "profit" | "budget" | "scenario" | "be" | "proj";

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

const CONFIG: Record<BizfinForecastSlug, Config> = {
  "bizfin-revenue-forecast-calculator": {
    title: "Revenue Forecast Calculator",
    description: `Revenue Forecast Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "rev",
    fields: ["a","b","c"] as const,
    aDefault: "1000000",
    bDefault: "12",
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
    aLabel: "Base revenue",
    bLabel: "Growth %",
    cLabel: "Years",
  },
  "bizfin-profit-forecast-calculator": {
    title: "Profit Forecast Calculator",
    description: `Profit Forecast Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "profit",
    fields: ["a","b","c","d","n"] as const,
    aDefault: "1000000",
    bDefault: "12",
    cDefault: "700000",
    dDefault: "8",
    rDefault: "",
    tDefault: "",
    nDefault: "3",
    pDefault: "",
    mDefault: "",
    vDefault: "",
    sDefault: "",
    lDefault: "",
    wDefault: "",
    hDefault: "",
    qDefault: "",
    aLabel: "Base revenue",
    bLabel: "Rev growth %",
    cLabel: "Base costs",
    dLabel: "Cost growth %",
    nLabel: "Years",
  },
  "bizfin-budget-calculator": {
    title: "Budget Calculator",
    description: `Budget Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "budget",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "108000",
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
    aLabel: "Planned / budget",
    bLabel: "Actual",
  },
  "bizfin-scenario-analysis-calculator": {
    title: "Scenario Analysis Calculator",
    description: `Scenario Analysis Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "scenario",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "150000",
    cDefault: "60000",
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
    aLabel: "Base case",
    bLabel: "Best case",
    cLabel: "Worst case",
  },
  "bizfin-break-even-analysis-tool": {
    title: "Break-even Analysis Tool",
    description: `Break-even Analysis Tool: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "be",
    fields: ["a","b","c"] as const,
    aDefault: "50000",
    bDefault: "40",
    cDefault: "15",
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
    bLabel: "Price / unit",
    cLabel: "Variable / unit",
  },
  "bizfin-financial-projection-calculator": {
    title: "Financial Projection Calculator",
    description: `Financial Projection Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "proj",
    fields: ["a","b","c","d"] as const,
    aDefault: "1000000",
    bDefault: "10",
    cDefault: "3",
    dDefault: "700000",
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
    aLabel: "Base revenue",
    bLabel: "Growth %",
    cLabel: "Years",
    dLabel: "Base costs",
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

function formatResult(res: BizfinForecastResult, num: (n: number, d?: number) => string) {
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

export function BizfinForecastCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinForecastSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-revenue-forecast-calculator"];
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
    const input: BizfinForecastInput = {};
    switch (config.mode) {
      case "rev": {
        const base = reqPos(a, "Base"); if (!base.ok) return { error: base.error };
        const growthPct = reqFinite(b, "Growth %"); if (!growthPct.ok) return { error: growthPct.error };
        const years = reqPos(c, "Years"); if (!years.ok) return { error: years.error };
        input.base = base.value; input.growthPct = growthPct.value; input.years = years.value; break;
      }
      case "profit": {
        const base = reqPos(a, "Base rev"); if (!base.ok) return { error: base.error };
        const growthPct = reqFinite(b, "Rev growth"); if (!growthPct.ok) return { error: growthPct.error };
        const costs = reqNonNeg(c, "Base costs"); if (!costs.ok) return { error: costs.error };
        const costGrowthPct = reqFinite(d, "Cost growth"); if (!costGrowthPct.ok) return { error: costGrowthPct.error };
        const years = reqPos(n, "Years"); if (!years.ok) return { error: years.error };
        input.base = base.value; input.growthPct = growthPct.value; input.costs = costs.value; input.costGrowthPct = costGrowthPct.value; input.years = years.value; break;
      }
      case "budget": {
        const planned = reqFinite(a, "Planned"); if (!planned.ok) return { error: planned.error };
        const actual = reqFinite(b, "Actual"); if (!actual.ok) return { error: actual.error };
        input.planned = planned.value; input.actual = actual.value; break;
      }
      case "scenario": {
        const baseCase = reqFinite(a, "Base"); if (!baseCase.ok) return { error: baseCase.error };
        const bestCase = reqFinite(b, "Best"); if (!bestCase.ok) return { error: bestCase.error };
        const worstCase = reqFinite(c, "Worst"); if (!worstCase.ok) return { error: worstCase.error };
        input.baseCase = baseCase.value; input.bestCase = bestCase.value; input.worstCase = worstCase.value; break;
      }
      case "be": {
        const fixedCosts = reqPos(a, "Fixed"); if (!fixedCosts.ok) return { error: fixedCosts.error };
        const pricePerUnit = reqPos(b, "Price"); if (!pricePerUnit.ok) return { error: pricePerUnit.error };
        const variablePerUnit = reqNonNeg(c, "Variable"); if (!variablePerUnit.ok) return { error: variablePerUnit.error };
        input.fixedCosts = fixedCosts.value; input.pricePerUnit = pricePerUnit.value; input.variablePerUnit = variablePerUnit.value; break;
      }
      case "proj": {
        const base = reqPos(a, "Base"); if (!base.ok) return { error: base.error };
        const growthPct = reqFinite(b, "Growth"); if (!growthPct.ok) return { error: growthPct.error };
        const years = reqPos(c, "Years"); if (!years.ok) return { error: years.error };
        const costs = reqNonNeg(d, "Costs"); if (!costs.ok) return { error: costs.error };
        input.base = base.value; input.growthPct = growthPct.value; input.years = years.value; input.costs = costs.value; break;
      }
    }
    return formatResult(computeBizfinForecast(key in CONFIG ? key : "bizfin-revenue-forecast-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-fc-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-fc-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
