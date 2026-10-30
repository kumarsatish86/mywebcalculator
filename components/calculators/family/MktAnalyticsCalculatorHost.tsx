"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { MKT_URL } from "@/lib/calculators/mktHelpers";
import {
  computeMktAnalytics,
  type MktCommonInput,
  type MktResult,
  type MktAnalyticsSlug,
} from "@/lib/calculators/mktAnalytics";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type FieldDef = { key: string; label: string; prop: keyof MktCommonInput };

type Config = {
  title: string;
  description: string;
  fields: FieldDef[];
  aDefault?: string;
  bDefault?: string;
  cDefault?: string;
  dDefault?: string;
  nDefault?: string;
  pDefault?: string;
  qDefault?: string;
  mDefault?: string;
  vDefault?: string;
  sDefault?: string;
  rDefault?: string;
  tDefault?: string;
  lDefault?: string;
  wDefault?: string;
  hDefault?: string;
};

const CONFIG: Record<MktAnalyticsSlug, Config> = {
  "mkt-virality-coefficient-calculator": {
    title: "Virality coefficient",
    description: `Virality coefficient calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Invites per user", prop: "invites" as const },
      { key: "b", label: "Invite conversion %", prop: "cvrPct" as const },
    ],
    aDefault: "3",
    bDefault: "20",
  },
  "mkt-customer-growth-rate-calculator": {
    title: "Customer growth",
    description: `Customer growth calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Start customers", prop: "startCustomers" as const },
      { key: "b", label: "End customers", prop: "endCustomers" as const },
    ],
    aDefault: "1000",
    bDefault: "1180",
  },
  "mkt-mer-calculator": {
    title: "MER",
    description: `MER calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Total revenue", prop: "revenue" as const },
      { key: "b", label: "Total marketing spend", prop: "spend" as const },
    ],
    aDefault: "250000",
    bDefault: "50000",
  },
  "mkt-attribution-model-calculator": {
    title: "Attribution model",
    description: `Attribution model calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Weight A", prop: "weightA" as const },
      { key: "b", label: "Weight B", prop: "weightB" as const },
      { key: "c", label: "Weight C", prop: "weightC" as const },
      { key: "d", label: "Conversion revenue", prop: "revenue" as const },
    ],
    aDefault: "40",
    bDefault: "35",
    cDefault: "25",
    dDefault: "1000",
  },
  "mkt-cohort-retention-calculator": {
    title: "Cohort retention",
    description: `Cohort retention calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Cohort size", prop: "cohortSize" as const },
      { key: "b", label: "Retained", prop: "retainedCohort" as const },
    ],
    aDefault: "500",
    bDefault: "310",
  },
  "mkt-traffic-source-roi-calculator": {
    title: "Traffic source ROI",
    description: `Traffic source ROI calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Channel revenue", prop: "channelRevenue" as const },
      { key: "b", label: "Channel spend", prop: "channelSpend" as const },
    ],
    aDefault: "18000",
    bDefault: "4500",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: MktResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.value !== undefined) rows.push({ label: "Primary", value: num(res.value, 4) });
  if (res.rate !== undefined) rows.push({ label: "Rate %", value: num(res.rate, 2) });
  if (res.ratio !== undefined) rows.push({ label: "Ratio", value: num(res.ratio, 4) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 4) });
  if (res.revenue !== undefined) rows.push({ label: "Revenue", value: num(res.revenue, 2) });
  if (res.spend !== undefined) rows.push({ label: "Spend", value: num(res.spend, 2) });
  if (res.count !== undefined) rows.push({ label: "Count", value: num(res.count, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.value !== undefined ? num(res.value, 4)
    : res.rate !== undefined ? num(res.rate, 2)
    : "—";
  return { primary, primaryLabel: "Result", rows };
}

export function MktAnalyticsCalculatorHost({ slug }: { slug: string }) {
  const key = slug as MktAnalyticsSlug;
  const config = CONFIG[key] ?? CONFIG["mkt-virality-coefficient-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MKT_URL.A, config.aDefault ?? ""));
  const [b, setB] = useState(useLoanInitialInput(MKT_URL.B, config.bDefault ?? ""));
  const [c, setC] = useState(useLoanInitialInput(MKT_URL.C, config.cDefault ?? ""));
  const [d, setD] = useState(useLoanInitialInput(MKT_URL.D, config.dDefault ?? ""));
  const [n, setN] = useState(useLoanInitialInput(MKT_URL.N, config.nDefault ?? ""));
  const [p, setP] = useState(useLoanInitialInput(MKT_URL.P, config.pDefault ?? ""));
  const [q, setQ] = useState(useLoanInitialInput(MKT_URL.Q, config.qDefault ?? ""));
  const [m, setM] = useState(useLoanInitialInput(MKT_URL.M, config.mDefault ?? ""));
  const [v, setV] = useState(useLoanInitialInput(MKT_URL.V, config.vDefault ?? ""));
  const [s, setS] = useState(useLoanInitialInput(MKT_URL.S, config.sDefault ?? ""));
  const [r, setR] = useState(useLoanInitialInput(MKT_URL.R, config.rDefault ?? ""));
  const [t, setT] = useState(useLoanInitialInput(MKT_URL.T, config.tDefault ?? ""));
  const [l, setL] = useState(useLoanInitialInput(MKT_URL.L, config.lDefault ?? ""));
  const [w, setW] = useState(useLoanInitialInput(MKT_URL.W, config.wDefault ?? ""));
  const [h, setH] = useState(useLoanInitialInput(MKT_URL.H, config.hDefault ?? ""));

  const getters: Record<string, string> = { a, b, c, d, n, p, q, m, v, s, r, t, l, w, h };
  const setters: Record<string, (v: string) => void> = {
    a: setA, b: setB, c: setC, d: setD, n: setN, p: setP, q: setQ, m: setM,
    v: setV, s: setS, r: setR, t: setT, l: setL, w: setW, h: setH,
  };

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    for (const f of config.fields) {
      const val = getters[f.key] ?? "";
      if (val.trim() !== "") out[MKT_URL[f.key.toUpperCase() as keyof typeof MKT_URL]] = val;
    }
    return out;
  }, [config.fields, a, b, c, d, n, p, q, m, v, s, r, t, l, w, h]);

  useLoanUrlSync(shareParams, [a, b, c, d, n, p, q, m, v, s, r, t, l, w, h]);

  const result = useMemo(() => {
    const input: MktCommonInput = {};
    for (const f of config.fields) {
      const raw = getters[f.key] ?? "";
      if (raw.trim() === "") continue;
      const parsed = parseNonNegative(raw, f.label);
      if (!parsed.ok) return { error: parsed.error };
      (input as Record<string, number>)[f.prop] = parsed.value;
    }
    // Require first field positive when present
    if (config.fields[0]) {
      const raw = getters[config.fields[0].key] ?? "";
      const parsed = parsePositive(raw, config.fields[0].label);
      if (!parsed.ok) return { error: parsed.error };
      (input as Record<string, number>)[config.fields[0].prop] = parsed.value;
    }
    return formatResult(
      computeMktAnalytics(key in CONFIG ? key : "mkt-virality-coefficient-calculator", input),
      num,
    );
  }, [a, b, c, d, n, p, q, m, v, s, r, t, l, w, h, config, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((f) => (
            <div key={f.key}>
              <FieldLabel htmlFor={`mkt-${f.key}`}>{f.label}</FieldLabel>
              <FieldInput
                id={`mkt-${f.key}`}
                value={getters[f.key] ?? ""}
                onChange={(ev) => setters[f.key]?.(ev.target.value)}
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
