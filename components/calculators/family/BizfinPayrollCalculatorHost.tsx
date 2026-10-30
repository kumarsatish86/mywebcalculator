"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  computeBizfinPayroll,
  type BizfinPayrollInput,
  type BizfinPayrollResult,
  type BizfinPayrollSlug,
} from "@/lib/calculators/bizfinPayroll";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "payroll" | "emp" | "ctc" | "ot" | "breakup" | "attr";

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

const CONFIG: Record<BizfinPayrollSlug, Config> = {
  "bizfin-payroll-calculator": {
    title: "Payroll Calculator",
    description: `Payroll Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "payroll",
    fields: ["a","b","c"] as const,
    aDefault: "25",
    bDefault: "50000",
    cDefault: "20",
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
    aLabel: "Employees",
    bLabel: "Salary / employee",
    cLabel: "Employer burden %",
  },
  "bizfin-employee-cost-calculator": {
    title: "Employee Cost Calculator",
    description: `Employee Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "emp",
    fields: ["a","b","c"] as const,
    aDefault: "80000",
    bDefault: "10000",
    cDefault: "12",
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
    aLabel: "Salary",
    bLabel: "Benefits",
    cLabel: "Employer tax %",
  },
  "bizfin-ctc-calculator": {
    title: "CTC Calculator",
    description: `CTC Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ctc",
    fields: ["a","b","c"] as const,
    aDefault: "40000",
    bDefault: "35000",
    cDefault: "10000",
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
    aLabel: "Basic",
    bLabel: "Allowances",
    cLabel: "Employer contrib",
  },
  "bizfin-overtime-pay-calculator": {
    title: "Overtime Pay Calculator",
    description: `Overtime Pay Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "ot",
    fields: ["a","b","c"] as const,
    aDefault: "10",
    bDefault: "500",
    cDefault: "1.5",
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
    aLabel: "OT hours",
    bLabel: "Hourly rate",
    cLabel: "Multiplier",
  },
  "bizfin-salary-breakup-calculator": {
    title: "Salary Breakup Calculator",
    description: `Salary Breakup Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "breakup",
    fields: ["a","b","c"] as const,
    aDefault: "100000",
    bDefault: "40",
    cDefault: "20",
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
    aLabel: "CTC / gross",
    bLabel: "Basic %",
    cLabel: "HRA %",
  },
  "bizfin-attrition-cost-calculator": {
    title: "Attrition Cost Calculator",
    description: `Attrition Cost Calculator: teaching business-finance estimate. Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.`,
    mode: "attr",
    fields: ["a","b","c"] as const,
    aDefault: "5",
    bDefault: "150000",
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
    aLabel: "Replacements",
    bLabel: "Cost per hire",
    cLabel: "Lost productivity",
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

function formatResult(res: BizfinPayrollResult, num: (n: number, d?: number) => string) {
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

export function BizfinPayrollCalculatorHost({ slug }: { slug: string }) {
  const key = slug as BizfinPayrollSlug;
  const config = CONFIG[key] ?? CONFIG["bizfin-payroll-calculator"];
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
    const input: BizfinPayrollInput = {};
    switch (config.mode) {
      case "payroll": {
        const employees = reqPos(a, "Employees"); if (!employees.ok) return { error: employees.error };
        const salary = reqPos(b, "Salary"); if (!salary.ok) return { error: salary.error };
        const employerTaxPct = reqNonNeg(c, "Burden %"); if (!employerTaxPct.ok) return { error: employerTaxPct.error };
        input.employees = employees.value; input.salary = salary.value; input.employerTaxPct = employerTaxPct.value; break;
      }
      case "emp": {
        const salary = reqPos(a, "Salary"); if (!salary.ok) return { error: salary.error };
        const benefits = reqNonNeg(b, "Benefits"); if (!benefits.ok) return { error: benefits.error };
        const employerTaxPct = reqNonNeg(c, "Tax %"); if (!employerTaxPct.ok) return { error: employerTaxPct.error };
        input.salary = salary.value; input.benefits = benefits.value; input.employerTaxPct = employerTaxPct.value; break;
      }
      case "ctc": {
        const basic = reqPos(a, "Basic"); if (!basic.ok) return { error: basic.error };
        const allowances = reqNonNeg(b, "Allowances"); if (!allowances.ok) return { error: allowances.error };
        const employerContrib = reqNonNeg(c, "Employer contrib"); if (!employerContrib.ok) return { error: employerContrib.error };
        input.basic = basic.value; input.allowances = allowances.value; input.employerContrib = employerContrib.value; break;
      }
      case "ot": {
        const hours = reqPos(a, "OT hours"); if (!hours.ok) return { error: hours.error };
        const hourlyRate = reqPos(b, "Hourly rate"); if (!hourlyRate.ok) return { error: hourlyRate.error };
        const otMultiplier = reqPos(c, "Multiplier"); if (!otMultiplier.ok) return { error: otMultiplier.error };
        input.hours = hours.value; input.hourlyRate = hourlyRate.value; input.otMultiplier = otMultiplier.value; break;
      }
      case "breakup": {
        const ctc = reqPos(a, "CTC"); if (!ctc.ok) return { error: ctc.error };
        const basicPct = reqNonNeg(b, "Basic %"); if (!basicPct.ok) return { error: basicPct.error };
        const hraPct = reqNonNeg(c, "HRA %"); if (!hraPct.ok) return { error: hraPct.error };
        input.ctc = ctc.value; input.basicPct = basicPct.value; input.hraPct = hraPct.value; break;
      }
      case "attr": {
        const replacements = reqPos(a, "Replacements"); if (!replacements.ok) return { error: replacements.error };
        const costPerHire = reqPos(b, "Cost/hire"); if (!costPerHire.ok) return { error: costPerHire.error };
        const lostProductivity = reqNonNeg(c, "Lost productivity"); if (!lostProductivity.ok) return { error: lostProductivity.error };
        input.replacements = replacements.value; input.costPerHire = costPerHire.value; input.lostProductivity = lostProductivity.value; break;
      }
    }
    return formatResult(computeBizfinPayroll(key in CONFIG ? key : "bizfin-payroll-calculator", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={`bf-pay-${k}`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={`bf-pay-${k}`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
