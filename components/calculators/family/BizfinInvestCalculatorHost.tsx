"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinInvest,
  type BizfinInvestInput,
  type BizfinInvestResult,
  type BizfinInvestSlug,
} from "@/lib/calculators/bizfinInvest";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "roi" | "annRoi" | "irr" | "npv" | "payback" | "dpayback" | "capgain" | "val" | "equity" | "ev";

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

const CONFIG: Record<BizfinInvestSlug, Config> = {
  "bizfin-roi-calculator": {
    title: "ROI Calculator",
    description: `ROI Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "roi",
    fields: ["a","b"] as const,
    aDefault: "50000",
    bDefault: "65000",
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
    aLabel: "Investment cost",
    bLabel: "Final / gain value",
  },
  "bizfin-annualized-roi-calculator": {
    title: "Annualized ROI Calculator",
    description: `Annualized ROI Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "annRoi",
    fields: ["a","b","n"] as const,
    aDefault: "50000",
    bDefault: "80000",
    cDefault: "",
    dDefault: "",
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
    aLabel: "Initial cost",
    bLabel: "Final value",
    nLabel: "Years",
  },
  "bizfin-irr-calculator": {
    title: "IRR Calculator",
    description: `IRR Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "irr",
    fields: ["a","b","c","d"] as const,
    aDefault: "-100000",
    bDefault: "40000",
    cDefault: "40000",
    dDefault: "50000",
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
    aLabel: "CF0 (usually negative)",
    bLabel: "CF1",
    cLabel: "CF2",
    dLabel: "CF3",
  },
  "bizfin-npv-calculator": {
    title: "NPV Calculator",
    description: `NPV Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "npv",
    fields: ["a","b","c","d","r"] as const,
    aDefault: "-100000",
    bDefault: "40000",
    cDefault: "40000",
    dDefault: "50000",
    rDefault: "10",
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
    aLabel: "CF0",
    bLabel: "CF1",
    cLabel: "CF2",
    dLabel: "CF3",
    rLabel: "Discount rate %",
  },
  "bizfin-payback-period-calculator": {
    title: "Payback Period Calculator",
    description: `Payback Period Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "payback",
    fields: ["a","b"] as const,
    aDefault: "120000",
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
    aLabel: "Investment",
    bLabel: "Annual cash flow",
  },
  "bizfin-discounted-payback-period-calculator": {
    title: "Discounted Payback Period Calculator",
    description: `Discounted Payback Period Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "dpayback",
    fields: ["a","b","r"] as const,
    aDefault: "120000",
    bDefault: "30000",
    cDefault: "",
    dDefault: "",
    rDefault: "8",
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
    bLabel: "Annual cash flow",
    rLabel: "Discount rate %",
  },
  "bizfin-capital-gain-calculator": {
    title: "Capital Gain Calculator",
    description: `Capital Gain Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "capgain",
    fields: ["a","b"] as const,
    aDefault: "100000",
    bDefault: "140000",
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
    aLabel: "Buy / cost basis",
    bLabel: "Sell price",
  },
  "bizfin-business-valuation-calculator": {
    title: "Business Valuation Calculator",
    description: `Business Valuation Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "val",
    fields: ["a","b"] as const,
    aDefault: "500000",
    bDefault: "6",
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
    aLabel: "EBITDA",
    bLabel: "Multiple",
  },
  "bizfin-equity-value-calculator": {
    title: "Equity Value Calculator",
    description: `Equity Value Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "equity",
    fields: ["a","b"] as const,
    aDefault: "3000000",
    bDefault: "400000",
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
    aLabel: "Enterprise value",
    bLabel: "Net debt",
  },
  "bizfin-enterprise-value-calculator": {
    title: "Enterprise Value Calculator",
    description: `Enterprise Value Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ev",
    fields: ["a","b","c"] as const,
    aDefault: "2500000",
    bDefault: "800000",
    cDefault: "200000",
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
    aLabel: "Equity / market cap",
    bLabel: "Debt",
    cLabel: "Cash",
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

function formatResult(res: BizfinInvestResult, num: (n: number, d?: number) => string) {
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

export function BizfinInvestCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinInvestSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-roi-calculator"];
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
    const input: BizfinInvestInput = {};
    switch (config.mode) {

      case "roi": {
        const cost = reqPos(a, "Investment cost"); if (!cost.ok) return { error: cost.error };
        const gain = reqFinite(b, "Final / gain value"); if (!gain.ok) return { error: gain.error };
        input.cost = cost.value; input.gain = gain.value; break;
      }
      case "annRoi": {
        const cost = reqPos(a, "Initial cost"); if (!cost.ok) return { error: cost.error };
        const gain = reqPos(b, "Final value"); if (!gain.ok) return { error: gain.error };
        const years = reqPos(n, "Years"); if (!years.ok) return { error: years.error };
        input.cost = cost.value; input.gain = gain.value; input.years = years.value; break;
      }
      case "irr": {
        const cf0 = reqFinite(a, "CF0"); if (!cf0.ok) return { error: cf0.error };
        const cf1 = reqFinite(b, "CF1"); if (!cf1.ok) return { error: cf1.error };
        const cf2 = reqFinite(c, "CF2"); if (!cf2.ok) return { error: cf2.error };
        const cf3 = reqFinite(d, "CF3"); if (!cf3.ok) return { error: cf3.error };
        input.cf0 = cf0.value; input.cf1 = cf1.value; input.cf2 = cf2.value; input.cf3 = cf3.value; break;
      }
      case "npv": {
        const cf0 = reqFinite(a, "CF0"); if (!cf0.ok) return { error: cf0.error };
        const cf1 = reqFinite(b, "CF1"); if (!cf1.ok) return { error: cf1.error };
        const cf2 = reqFinite(c, "CF2"); if (!cf2.ok) return { error: cf2.error };
        const cf3 = reqFinite(d, "CF3"); if (!cf3.ok) return { error: cf3.error };
        const ratePct = reqNonNeg(r, "Discount rate %"); if (!ratePct.ok) return { error: ratePct.error };
        input.cf0 = cf0.value; input.cf1 = cf1.value; input.cf2 = cf2.value; input.cf3 = cf3.value; input.ratePct = ratePct.value; break;
      }
      case "payback": {
        const investment = reqPos(a, "Investment"); if (!investment.ok) return { error: investment.error };
        const annualCf = reqPos(b, "Annual cash flow"); if (!annualCf.ok) return { error: annualCf.error };
        input.investment = investment.value; input.annualCf = annualCf.value; break;
      }
      case "dpayback": {
        const investment = reqPos(a, "Investment"); if (!investment.ok) return { error: investment.error };
        const annualCf = reqPos(b, "Annual cash flow"); if (!annualCf.ok) return { error: annualCf.error };
        const ratePct = reqNonNeg(r, "Discount rate %"); if (!ratePct.ok) return { error: ratePct.error };
        input.investment = investment.value; input.annualCf = annualCf.value; input.ratePct = ratePct.value; break;
      }
      case "capgain": {
        const buy = reqPos(a, "Buy / cost basis"); if (!buy.ok) return { error: buy.error };
        const sell = reqFinite(b, "Sell price"); if (!sell.ok) return { error: sell.error };
        input.buy = buy.value; input.sell = sell.value; break;
      }
      case "val": {
        const ebitda = reqPos(a, "EBITDA"); if (!ebitda.ok) return { error: ebitda.error };
        const multiple = reqPos(b, "Multiple"); if (!multiple.ok) return { error: multiple.error };
        input.ebitda = ebitda.value; input.multiple = multiple.value; break;
      }
      case "equity": {
        const equityValue = reqPos(a, "Enterprise value"); if (!equityValue.ok) return { error: equityValue.error };
        const netDebt = reqFinite(b, "Net debt"); if (!netDebt.ok) return { error: netDebt.error };
        input.equityValue = equityValue.value; input.netDebt = netDebt.value; break;
      }
      case "ev": {
        const marketCap = reqPos(a, "Equity / market cap"); if (!marketCap.ok) return { error: marketCap.error };
        const debt = reqNonNeg(b, "Debt"); if (!debt.ok) return { error: debt.error };
        const cash = reqNonNeg(c, "Cash"); if (!cash.ok) return { error: cash.error };
        input.marketCap = marketCap.value; input.debt = debt.value; input.cash = cash.value; break;
      }
    }
    return formatResult(
      computeBizfinInvest(key in CONFIG ? key : "bizfin-roi-calculator", input),
      num,
    );
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-invest-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput
                id={`bf-invest-${k}`}
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
