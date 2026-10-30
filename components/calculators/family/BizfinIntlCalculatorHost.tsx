"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinIntl,
  type BizfinIntlInput,
  type BizfinIntlResult,
  type BizfinIntlSlug,
} from "@/lib/calculators/bizfinIntl";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "fx" | "duty" | "export" | "inf" | "pp";

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

const CONFIG: Record<BizfinIntlSlug, Config> = {
  "bizfin-currency-exchange-calculator": {
    title: "Currency Exchange Calculator",
    description: `Currency Exchange Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "fx",
    fields: ["a","b"] as const,
    aDefault: "1000",
    bDefault: "83.5",
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
    aLabel: "Amount",
    bLabel: "FX rate",
  },
  "bizfin-import-duty-calculator": {
    title: "Import Duty Calculator",
    description: `Import Duty Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "duty",
    fields: ["a","b","c"] as const,
    aDefault: "50000",
    bDefault: "10",
    cDefault: "1500",
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
    aLabel: "CIF value",
    bLabel: "Duty %",
    cLabel: "Other fees",
  },
  "bizfin-export-profit-calculator": {
    title: "Export Profit Calculator",
    description: `Export Profit Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "export",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "70000",
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
    aLabel: "Export revenue",
    bLabel: "Export cost",
    cLabel: "Duties / fees",
  },
  "bizfin-inflation-calculator": {
    title: "Inflation Calculator",
    description: `Inflation Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "inf",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "5",
    cDefault: "10",
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
    aLabel: "Present amount",
    bLabel: "Inflation %",
    cLabel: "Years",
  },
  "bizfin-purchasing-power-calculator": {
    title: "Purchasing Power Calculator",
    description: `Purchasing Power Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "pp",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "5",
    cDefault: "10",
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
    aLabel: "Present amount",
    bLabel: "Inflation %",
    cLabel: "Years",
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

function formatResult(res: BizfinIntlResult, num: (n: number, d?: number) => string) {
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

export function BizfinIntlCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinIntlSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-currency-exchange-calculator"];
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
    const input: BizfinIntlInput = {};
    switch (config.mode) {
      case "fx": {
        const amount = reqPos(a, "Amount"); if (!amount.ok) return { error: amount.error };
        const rate = reqPos(b, "FX rate"); if (!rate.ok) return { error: rate.error };
        input.amount = amount.value; input.rate = rate.value; break;
      }
      case "duty": {
        const cifValue = reqPos(a, "CIF"); if (!cifValue.ok) return { error: cifValue.error };
        const dutyPct = reqNonNeg(b, "Duty %"); if (!dutyPct.ok) return { error: dutyPct.error };
        const otherFees = reqNonNeg(c, "Fees"); if (!otherFees.ok) return { error: otherFees.error };
        input.cifValue = cifValue.value; input.dutyPct = dutyPct.value; input.otherFees = otherFees.value; break;
      }
      case "export": {
        const exportRevenue = reqPos(a, "Revenue"); if (!exportRevenue.ok) return { error: exportRevenue.error };
        const exportCost = reqNonNeg(b, "Cost"); if (!exportCost.ok) return { error: exportCost.error };
        const duties = reqNonNeg(c, "Duties"); if (!duties.ok) return { error: duties.error };
        input.exportRevenue = exportRevenue.value; input.exportCost = exportCost.value; input.duties = duties.value; break;
      }
      case "inf": {
        const present = reqPos(a, "Present"); if (!present.ok) return { error: present.error };
        const inflationPct = reqFinite(b, "Inflation"); if (!inflationPct.ok) return { error: inflationPct.error };
        const years = reqPos(c, "Years"); if (!years.ok) return { error: years.error };
        input.present = present.value; input.inflationPct = inflationPct.value; input.years = years.value; break;
      }
      case "pp": {
        const present = reqPos(a, "Present"); if (!present.ok) return { error: present.error };
        const inflationPct = reqFinite(b, "Inflation"); if (!inflationPct.ok) return { error: inflationPct.error };
        const years = reqPos(c, "Years"); if (!years.ok) return { error: years.error };
        input.present = present.value; input.inflationPct = inflationPct.value; input.years = years.value; break;
      }
    }
    return formatResult(computeBizfinIntl(key in CONFIG ? key : "bizfin-currency-exchange-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-intl-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-intl-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
