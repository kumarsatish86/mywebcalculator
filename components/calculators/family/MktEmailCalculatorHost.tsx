"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { MKT_URL } from "@/lib/calculators/mktHelpers";
import {
  computeMktEmail,
  type MktCommonInput,
  type MktResult,
  type MktEmailSlug,
} from "@/lib/calculators/mktEmail";
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

const CONFIG: Record<MktEmailSlug, Config> = {
  "mkt-email-open-rate-calculator": {
    title: "Email open rate",
    description: `Email open rate calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Opens", prop: "opens" as const },
      { key: "b", label: "Delivered", prop: "sent" as const },
    ],
    aDefault: "4200",
    bDefault: "20000",
  },
  "mkt-email-ctr-calculator": {
    title: "Email CTR",
    description: `Email CTR calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Clicks", prop: "clicks" as const },
      { key: "b", label: "Delivered", prop: "sent" as const },
    ],
    aDefault: "800",
    bDefault: "20000",
  },
  "mkt-email-conversion-rate-calculator": {
    title: "Email conversion rate",
    description: `Email conversion rate calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Conversions", prop: "conversions" as const },
      { key: "b", label: "Clicks", prop: "clicks" as const },
    ],
    aDefault: "60",
    bDefault: "800",
  },
  "mkt-email-roi-calculator": {
    title: "Email ROI",
    description: `Email ROI calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Revenue", prop: "revenue" as const },
      { key: "b", label: "Email cost", prop: "spend" as const },
    ],
    aDefault: "5000",
    bDefault: "400",
  },
  "mkt-list-growth-rate-calculator": {
    title: "List growth rate",
    description: `List growth rate calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Starting size", prop: "startFollowers" as const },
      { key: "b", label: "Ending size", prop: "endFollowers" as const },
      { key: "c", label: "Period days", prop: "periodDays" as const },
    ],
    aDefault: "10000",
    bDefault: "11200",
    cDefault: "30",
  },
  "mkt-email-bounce-rate-calculator": {
    title: "Email bounce rate",
    description: `Email bounce rate calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Bounces", prop: "bounces" as const },
      { key: "b", label: "Sent", prop: "sent" as const },
    ],
    aDefault: "150",
    bDefault: "10000",
  },
  "mkt-unsubscribe-rate-calculator": {
    title: "Unsubscribe rate",
    description: `Unsubscribe rate calculator. Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.`,
    fields: [
      { key: "a", label: "Unsubscribes", prop: "unsubs" as const },
      { key: "b", label: "Delivered", prop: "sent" as const },
    ],
    aDefault: "40",
    bDefault: "10000",
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

export function MktEmailCalculatorHost({ slug }: { slug: string }) {
  const key = slug as MktEmailSlug;
  const config = CONFIG[key] ?? CONFIG["mkt-email-open-rate-calculator"];
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
      computeMktEmail(key in CONFIG ? key : "mkt-email-open-rate-calculator", input),
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
