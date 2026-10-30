"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinTax,
  type BizfinTaxInput,
  type BizfinTaxResult,
  type BizfinTaxSlug,
} from "@/lib/calculators/bizfinTax";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "corp" | "gst" | "taxable" | "sl" | "db";

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

const CONFIG: Record<BizfinTaxSlug, Config> = {
  "bizfin-corporate-tax-calculator": {
    title: "Corporate Tax Calculator",
    description: `Corporate Tax Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "corp",
    fields: ["a","b"] as const,
    aDefault: "1000000",
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
    aLabel: "Taxable income",
    bLabel: "Tax rate %",
  },
  "bizfin-gst-calculator-india": {
    title: "GST Calculator (India)",
    description: `GST Calculator (India): teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "gst",
    fields: ["a","b","c"] as const,
    aDefault: "11800",
    bDefault: "18",
    cDefault: "1",
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
    aLabel: "Amount",
    bLabel: "GST %",
    cLabel: "Inclusive (1=yes)",
  },
  "bizfin-vat-calculator": {
    title: "VAT Calculator",
    description: `VAT Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "gst",
    fields: ["a","b","c"] as const,
    aDefault: "10000",
    bDefault: "20",
    cDefault: "0",
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
    aLabel: "Amount",
    bLabel: "VAT %",
    cLabel: "Inclusive (1=yes)",
  },
  "bizfin-sales-tax-calculator": {
    title: "Sales Tax Calculator",
    description: `Sales Tax Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "gst",
    fields: ["a","b","c"] as const,
    aDefault: "10000",
    bDefault: "8",
    cDefault: "0",
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
    aLabel: "Amount",
    bLabel: "Sales tax %",
    cLabel: "Inclusive (1=yes)",
  },
  "bizfin-taxable-income-calculator": {
    title: "Taxable Income Calculator",
    description: `Taxable Income Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "taxable",
    fields: ["a","b"] as const,
    aDefault: "1200000",
    bDefault: "150000",
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
    aLabel: "Gross income",
    bLabel: "Deductions",
  },
  "bizfin-depreciation-calculator": {
    title: "Depreciation Calculator",
    description: `Depreciation Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "sl",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "10000",
    cDefault: "5",
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
    aLabel: "Asset cost",
    bLabel: "Salvage",
    cLabel: "Useful life (years)",
  },
  "bizfin-straight-line-depreciation-calculator": {
    title: "Straight Line Depreciation Calculator",
    description: `Straight Line Depreciation Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "sl",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "10000",
    cDefault: "5",
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
    aLabel: "Asset cost",
    bLabel: "Salvage",
    cLabel: "Useful life (years)",
  },
  "bizfin-declining-balance-depreciation-calculator": {
    title: "Declining Balance Depreciation Calculator",
    description: `Declining Balance Depreciation Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "db",
    fields: ["a","b"] as const,
    aDefault: "80000",
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
    aLabel: "Book value",
    bLabel: "DB rate %",
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

function formatResult(res: BizfinTaxResult, num: (n: number, d?: number) => string) {
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

export function BizfinTaxCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinTaxSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-corporate-tax-calculator"];
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
    const input: BizfinTaxInput = {};
    switch (config.mode) {
      case "corp": {
        const income = reqPos(a, "Taxable income"); if (!income.ok) return { error: income.error };
        const taxRatePct = reqNonNeg(b, "Tax rate %"); if (!taxRatePct.ok) return { error: taxRatePct.error };
        input.income = income.value; input.taxRatePct = taxRatePct.value; break;
      }
      case "gst": {
        const amount = reqPos(a, "Amount"); if (!amount.ok) return { error: amount.error };
        const gstPct = reqNonNeg(b, "Tax %"); if (!gstPct.ok) return { error: gstPct.error };
        const inclusive = reqNonNeg(c, "Inclusive"); if (!inclusive.ok) return { error: inclusive.error };
        input.amount = amount.value; input.gstPct = gstPct.value; input.inclusive = inclusive.value; break;
      }
      case "taxable": {
        const income = reqPos(a, "Gross income"); if (!income.ok) return { error: income.error };
        const deductions = reqNonNeg(b, "Deductions"); if (!deductions.ok) return { error: deductions.error };
        input.income = income.value; input.deductions = deductions.value; break;
      }
      case "sl": {
        const cost = reqPos(a, "Asset cost"); if (!cost.ok) return { error: cost.error };
        const salvage = reqNonNeg(b, "Salvage"); if (!salvage.ok) return { error: salvage.error };
        const lifeYears = reqPos(c, "Useful life"); if (!lifeYears.ok) return { error: lifeYears.error };
        input.cost = cost.value; input.salvage = salvage.value; input.lifeYears = lifeYears.value; break;
      }
      case "db": {
        const bookValue = reqPos(a, "Book value"); if (!bookValue.ok) return { error: bookValue.error };
        const dbRatePct = reqPos(b, "DB rate %"); if (!dbRatePct.ok) return { error: dbRatePct.error };
        input.bookValue = bookValue.value; input.dbRatePct = dbRatePct.value; break;
      }
    }
    return formatResult(computeBizfinTax(key in CONFIG ? key : "bizfin-corporate-tax-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-tax-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-tax-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
