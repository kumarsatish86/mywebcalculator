"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinOps,
  type BizfinOpsInput,
  type BizfinOpsResult,
  type BizfinOpsSlug,
} from "@/lib/calculators/bizfinOps";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "cap" | "eff" | "labor" | "util" | "down" | "thru";

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

const CONFIG: Record<BizfinOpsSlug, Config> = {
  "bizfin-production-capacity-calculator": {
    title: "Production Capacity Calculator",
    description: `Production Capacity Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "cap",
    fields: ["a","b","c"] as const,
    aDefault: "4",
    bDefault: "160",
    cDefault: "50",
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
    aLabel: "Machines",
    bLabel: "Hours",
    cLabel: "Units / hour",
  },
  "bizfin-machine-efficiency-calculator": {
    title: "Machine Efficiency Calculator",
    description: `Machine Efficiency Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "eff",
    fields: ["a","b"] as const,
    aDefault: "9000",
    bDefault: "10000",
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
    aLabel: "Actual output",
    bLabel: "Capacity",
  },
  "bizfin-labor-cost-calculator": {
    title: "Labor Cost Calculator",
    description: `Labor Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "labor",
    fields: ["a","b","c"] as const,
    aDefault: "10",
    bDefault: "160",
    cDefault: "25",
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
    aLabel: "Workers",
    bLabel: "Hours",
    cLabel: "Wage / hour",
  },
  "bizfin-utilization-rate-calculator": {
    title: "Utilization Rate Calculator",
    description: `Utilization Rate Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "util",
    fields: ["a","b"] as const,
    aDefault: "140",
    bDefault: "160",
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
    aLabel: "Used hours",
    bLabel: "Available hours",
  },
  "bizfin-downtime-cost-calculator": {
    title: "Downtime Cost Calculator",
    description: `Downtime Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "down",
    fields: ["a","b"] as const,
    aDefault: "8",
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
    aLabel: "Downtime hours",
    bLabel: "Cost / hour",
  },
  "bizfin-throughput-calculator": {
    title: "Throughput Calculator",
    description: `Throughput Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "thru",
    fields: ["a","b"] as const,
    aDefault: "1200",
    bDefault: "8",
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
    aLabel: "Units",
    bLabel: "Time (hours)",
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

function formatResult(res: BizfinOpsResult, num: (n: number, d?: number) => string) {
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

export function BizfinOpsCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinOpsSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-production-capacity-calculator"];
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
    const input: BizfinOpsInput = {};
    switch (config.mode) {
      case "cap": {
        const machines = reqPos(a, "Machines"); if (!machines.ok) return { error: machines.error };
        const hours = reqPos(b, "Hours"); if (!hours.ok) return { error: hours.error };
        const ratePerHour = reqPos(c, "Rate"); if (!ratePerHour.ok) return { error: ratePerHour.error };
        input.machines = machines.value; input.hours = hours.value; input.ratePerHour = ratePerHour.value; break;
      }
      case "eff": {
        const output = reqPos(a, "Output"); if (!output.ok) return { error: output.error };
        const capacity = reqPos(b, "Capacity"); if (!capacity.ok) return { error: capacity.error };
        input.output = output.value; input.capacity = capacity.value; break;
      }
      case "labor": {
        const workers = reqPos(a, "Workers"); if (!workers.ok) return { error: workers.error };
        const hours = reqPos(b, "Hours"); if (!hours.ok) return { error: hours.error };
        const wage = reqPos(c, "Wage"); if (!wage.ok) return { error: wage.error };
        input.workers = workers.value; input.hours = hours.value; input.wage = wage.value; break;
      }
      case "util": {
        const usedHours = reqNonNeg(a, "Used hours"); if (!usedHours.ok) return { error: usedHours.error };
        const availableHours = reqPos(b, "Available"); if (!availableHours.ok) return { error: availableHours.error };
        input.usedHours = usedHours.value; input.availableHours = availableHours.value; break;
      }
      case "down": {
        const downtimeHours = reqPos(a, "Downtime"); if (!downtimeHours.ok) return { error: downtimeHours.error };
        const costPerHour = reqPos(b, "Cost/hour"); if (!costPerHour.ok) return { error: costPerHour.error };
        input.downtimeHours = downtimeHours.value; input.costPerHour = costPerHour.value; break;
      }
      case "thru": {
        const units = reqPos(a, "Units"); if (!units.ok) return { error: units.error };
        const timeHours = reqPos(b, "Time"); if (!timeHours.ok) return { error: timeHours.error };
        input.units = units.value; input.timeHours = timeHours.value; break;
      }
    }
    return formatResult(computeBizfinOps(key in CONFIG ? key : "bizfin-production-capacity-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-ops-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-ops-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
