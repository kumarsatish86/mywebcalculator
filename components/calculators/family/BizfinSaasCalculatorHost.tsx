"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinSaas,
  type BizfinSaasInput,
  type BizfinSaasResult,
  type BizfinSaasSlug,
} from "@/lib/calculators/bizfinSaas";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "burn" | "runway" | "cac" | "ltv" | "ratio" | "mrr" | "arr" | "churn" | "growth";

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

const CONFIG: Record<BizfinSaasSlug, Config> = {
  "bizfin-burn-rate-calculator": {
    title: "Burn Rate Calculator",
    description: `Burn Rate Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "burn",
    fields: ["a","b"] as const,
    aDefault: "120000",
    bDefault: "40000",
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
    aLabel: "Monthly expenses",
    bLabel: "Monthly revenue",
  },
  "bizfin-runway-calculator": {
    title: "Runway Calculator",
    description: `Runway Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "runway",
    fields: ["a","b"] as const,
    aDefault: "1200000",
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
    aLabel: "Cash on hand",
    bLabel: "Monthly burn",
  },
  "bizfin-cac-calculator": {
    title: "CAC Calculator",
    description: `CAC Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cac",
    fields: ["a","b"] as const,
    aDefault: "50000",
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
    aLabel: "S&M spend",
    bLabel: "New customers",
  },
  "bizfin-ltv-calculator": {
    title: "LTV Calculator",
    description: `LTV Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ltv",
    fields: ["a","b","c"] as const,
    aDefault: "100",
    bDefault: "80",
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
    aLabel: "ARPU",
    bLabel: "Gross margin %",
    cLabel: "Monthly churn %",
  },
  "bizfin-ltv-cac-ratio-calculator": {
    title: "LTV:CAC Ratio Calculator",
    description: `LTV:CAC Ratio Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ratio",
    fields: ["a","b"] as const,
    aDefault: "2667",
    bDefault: "500",
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
    aLabel: "LTV",
    bLabel: "CAC",
  },
  "bizfin-mrr-calculator": {
    title: "MRR Calculator",
    description: `MRR Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "mrr",
    fields: ["a","b"] as const,
    aDefault: "500",
    bDefault: "49",
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
    aLabel: "Customers",
    bLabel: "ARPU",
  },
  "bizfin-arr-calculator": {
    title: "ARR Calculator",
    description: `ARR Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "arr",
    fields: ["a"] as const,
    aDefault: "24500",
    bDefault: "",
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
    aLabel: "MRR",
  },
  "bizfin-churn-rate-calculator": {
    title: "Churn Rate Calculator",
    description: `Churn Rate Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "churn",
    fields: ["a","b"] as const,
    aDefault: "15",
    bDefault: "500",
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
    aLabel: "Lost customers",
    bLabel: "Starting customers",
  },
  "bizfin-saas-growth-rate-calculator": {
    title: "SaaS Growth Rate Calculator",
    description: `SaaS Growth Rate Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "growth",
    fields: ["a","b"] as const,
    aDefault: "20000",
    bDefault: "24500",
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
    aLabel: "Starting value",
    bLabel: "Ending value",
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

function formatResult(res: BizfinSaasResult, num: (n: number, d?: number) => string) {
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

export function BizfinSaasCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinSaasSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-burn-rate-calculator"];
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
    const input: BizfinSaasInput = {};
    switch (config.mode) {
      case "burn": {
        const expenses = reqPos(a, "Expenses"); if (!expenses.ok) return { error: expenses.error };
        const revenue = reqNonNeg(b, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        input.expenses = expenses.value; input.revenue = revenue.value; break;
      }
      case "runway": {
        const cash = reqPos(a, "Cash"); if (!cash.ok) return { error: cash.error };
        const burn = reqFinite(b, "Burn"); if (!burn.ok) return { error: burn.error };
        input.cash = cash.value; input.burn = burn.value; break;
      }
      case "cac": {
        const salesMarketing = reqPos(a, "S&M"); if (!salesMarketing.ok) return { error: salesMarketing.error };
        const newCustomers = reqPos(b, "New customers"); if (!newCustomers.ok) return { error: newCustomers.error };
        input.salesMarketing = salesMarketing.value; input.newCustomers = newCustomers.value; break;
      }
      case "ltv": {
        const arpu = reqPos(a, "ARPU"); if (!arpu.ok) return { error: arpu.error };
        const grossMarginPct = reqNonNeg(b, "GM %"); if (!grossMarginPct.ok) return { error: grossMarginPct.error };
        const churnPct = reqPos(c, "Churn %"); if (!churnPct.ok) return { error: churnPct.error };
        input.arpu = arpu.value; input.grossMarginPct = grossMarginPct.value; input.churnPct = churnPct.value; break;
      }
      case "ratio": {
        const ltv = reqPos(a, "LTV"); if (!ltv.ok) return { error: ltv.error };
        const cac = reqPos(b, "CAC"); if (!cac.ok) return { error: cac.error };
        input.ltv = ltv.value; input.cac = cac.value; break;
      }
      case "mrr": {
        const customers = reqPos(a, "Customers"); if (!customers.ok) return { error: customers.error };
        const arpu = reqPos(b, "ARPU"); if (!arpu.ok) return { error: arpu.error };
        input.customers = customers.value; input.arpu = arpu.value; break;
      }
      case "arr": {
        const mrr = reqPos(a, "MRR"); if (!mrr.ok) return { error: mrr.error };
        input.mrr = mrr.value; break;
      }
      case "churn": {
        const lostCustomers = reqNonNeg(a, "Lost"); if (!lostCustomers.ok) return { error: lostCustomers.error };
        const startCustomers = reqPos(b, "Start"); if (!startCustomers.ok) return { error: startCustomers.error };
        input.lostCustomers = lostCustomers.value; input.startCustomers = startCustomers.value; break;
      }
      case "growth": {
        const startValue = reqFinite(a, "Start"); if (!startValue.ok) return { error: startValue.error };
        const endValue = reqFinite(b, "End"); if (!endValue.ok) return { error: endValue.error };
        input.startValue = startValue.value; input.endValue = endValue.value; break;
      }
    }
    return formatResult(computeBizfinSaas(key in CONFIG ? key : "bizfin-burn-rate-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-saas-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-saas-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
