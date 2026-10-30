"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HR_URL, type HrResult } from "@/lib/calculators/hrHelpers";
import {
  computeHrPayroll,
  type HrPayrollInput,
  type HrPayrollSlug,
} from "@/lib/calculators/hrPayroll";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Config = {
  title: string;
  description: string;
  fields: { key: keyof typeof HR_URL; label: string; def: string }[];
  build: (v: Record<string, string>) => HrPayrollInput | { error: string };
};

const D =
  "HR planning estimate only — policies and statutes vary. Not legal or tax advice; verify with HR/payroll counsel.";

const CONFIG: Record<HrPayrollSlug, Config> = {
  "hr-salary-annual-monthly-hourly-calculator": {
    title: "Salary (annual ↔ monthly ↔ hourly)",
    description: `Convert salary across annual, monthly, and hourly. ${D}`,
    fields: [
      { key: "A", label: "Annual (optional)", def: "1200000" },
      { key: "M", label: "Monthly (optional)", def: "" },
      { key: "H", label: "Hourly (optional)", def: "" },
      { key: "W", label: "Hours / week", def: "40" },
      { key: "N", label: "Weeks / year", def: "52" },
    ],
    build: (v) => ({
      annual: v.a ? Number(v.a) : undefined,
      monthly: v.m ? Number(v.m) : undefined,
      hourly: v.h ? Number(v.h) : undefined,
      hoursPerWeek: Number(v.w) || 40,
      weeksPerYear: Number(v.n) || 52,
    }),
  },
  "hr-in-hand-salary-calculator": {
    title: "In-hand salary",
    description: `Estimate take-home from gross and deduction rates. ${D}`,
    fields: [
      { key: "M", label: "Gross monthly", def: "100000" },
      { key: "P", label: "PF %", def: "12" },
      { key: "T", label: "Tax % of gross", def: "5" },
      { key: "D", label: "Other deduction ₹", def: "200" },
    ],
    build: (v) => {
      const g = parsePositive(v.m, "Gross");
      if (!g.ok) return { error: g.error };
      return { gross: g.value, pfPct: Number(v.p) || 0, taxPct: Number(v.t) || 0, otherDeduction: Number(v.d) || 0 };
    },
  },
  "hr-net-salary-calculator": {
    title: "Net salary",
    description: `Net pay after PF, tax, and other deductions. ${D}`,
    fields: [
      { key: "M", label: "Gross monthly", def: "100000" },
      { key: "P", label: "PF %", def: "12" },
      { key: "T", label: "Tax %", def: "5" },
      { key: "D", label: "Other ₹", def: "200" },
    ],
    build: (v) => {
      const g = parsePositive(v.m, "Gross");
      if (!g.ok) return { error: g.error };
      return { gross: g.value, pfPct: Number(v.p) || 0, taxPct: Number(v.t) || 0, otherDeduction: Number(v.d) || 0 };
    },
  },
  "hr-gross-salary-calculator": {
    title: "Gross salary",
    description: `Sum basic, HRA, and allowances. ${D}`,
    fields: [
      { key: "B", label: "Basic", def: "40000" },
      { key: "H", label: "HRA", def: "20000" },
      { key: "A", label: "Allowances", def: "40000" },
    ],
    build: (v) => {
      const b = parsePositive(v.b, "Basic");
      if (!b.ok) return { error: b.error };
      return { basic: b.value, hra: Number(v.h) || 0, allowance: Number(v.a) || 0 };
    },
  },
  "hr-salary-breakdown-calculator": {
    title: "Salary breakdown",
    description: `Illustrative CTC split into basic, HRA, special. ${D}`,
    fields: [
      { key: "M", label: "Monthly CTC", def: "100000" },
      { key: "P", label: "Basic % of CTC", def: "40" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "CTC");
      if (!m.ok) return { error: m.error };
      return { monthly: m.value, pfPct: Number(v.p) || 40 };
    },
  },
  "hr-payroll-calculator": {
    title: "Payroll",
    description: `Payslip-style net pay and employer cost estimate. ${D}`,
    fields: [
      { key: "M", label: "Gross monthly", def: "100000" },
      { key: "B", label: "Basic (optional)", def: "40000" },
      { key: "T", label: "Tax %", def: "5" },
      { key: "P", label: "Professional tax ₹", def: "200" },
      { key: "L", label: "Employer load %", def: "12" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Gross");
      if (!m.ok) return { error: m.error };
      return {
        gross: m.value,
        basic: v.b ? Number(v.b) : undefined,
        taxPct: Number(v.t) || 0,
        ptAmount: Number(v.p) || 0,
        employerLoadPct: Number(v.l) || 0,
      };
    },
  },
  "hr-payslip-generator-tool": {
    title: "Payslip generator",
    description: `Teaching payslip breakdown for download-style review. ${D}`,
    fields: [
      { key: "M", label: "Gross monthly", def: "100000" },
      { key: "B", label: "Basic", def: "40000" },
      { key: "T", label: "Tax %", def: "5" },
      { key: "P", label: "Professional tax ₹", def: "200" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Gross");
      if (!m.ok) return { error: m.error };
      return { gross: m.value, basic: Number(v.b) || undefined, taxPct: Number(v.t) || 0, ptAmount: Number(v.p) || 0 };
    },
  },
  "hr-payroll-tax-calculator": {
    title: "Payroll tax",
    description: `Monthly tax from simplified annual slabs. ${D}`,
    fields: [{ key: "M", label: "Gross monthly", def: "100000" }],
    build: (v) => {
      const m = parsePositive(v.m, "Gross");
      if (!m.ok) return { error: m.error };
      return { monthly: m.value, gross: m.value };
    },
  },
  "hr-overtime-pay-calculator": {
    title: "Overtime pay",
    description: `OT pay from hourly rate, hours, and multiplier. ${D}`,
    fields: [
      { key: "H", label: "Hourly rate", def: "500" },
      { key: "N", label: "OT hours", def: "10" },
      { key: "M", label: "Multiplier", def: "1.5" },
    ],
    build: (v) => {
      const h = parsePositive(v.h, "Hourly");
      if (!h.ok) return { error: h.error };
      const n = parsePositive(v.n, "OT hours");
      if (!n.ok) return { error: n.error };
      return { hourly: h.value, otHours: n.value, otMultiplier: Number(v.m) || 1.5 };
    },
  },
  "hr-holiday-pay-calculator": {
    title: "Holiday pay",
    description: `Holiday pay from daily rate and days. ${D}`,
    fields: [
      { key: "D", label: "Daily rate", def: "3000" },
      { key: "N", label: "Holiday days", def: "2" },
      { key: "M", label: "Premium multiplier", def: "1" },
    ],
    build: (v) => {
      const d = parsePositive(v.d, "Daily rate");
      if (!d.ok) return { error: d.error };
      const n = parsePositive(v.n, "Days");
      if (!n.ok) return { error: n.error };
      return { dailyRate: d.value, holidayDays: n.value, otMultiplier: Number(v.m) || 1 };
    },
  },
  "hr-income-tax-calculator": {
    title: "Income tax (illustrative)",
    description: `Simplified new-regime style annual tax estimate. ${D}`,
    fields: [{ key: "A", label: "Annual income", def: "1200000" }],
    build: (v) => {
      const a = parsePositive(v.a, "Annual income");
      if (!a.ok) return { error: a.error };
      return { annual: a.value };
    },
  },
  "hr-pf-provident-fund-calculator": {
    title: "PF (Provident Fund)",
    description: `EPF estimate @ 12% with illustrative ₹15,000 ceiling. ${D}`,
    fields: [
      { key: "B", label: "Basic / PF wages", def: "40000" },
      { key: "P", label: "PF %", def: "12" },
      { key: "C", label: "Use ceiling (1=yes)", def: "1" },
    ],
    build: (v) => {
      const b = parsePositive(v.b, "Basic");
      if (!b.ok) return { error: b.error };
      return { basic: b.value, pfWages: b.value, pfPct: Number(v.p) || 12, usePfCeiling: Number(v.c) };
    },
  },
  "hr-esi-calculator": {
    title: "ESI",
    description: `ESI employee 0.75% + employer 3.25% under wage ceiling. ${D}`,
    fields: [{ key: "M", label: "Monthly ESI wages", def: "20000" }],
    build: (v) => {
      const m = parsePositive(v.m, "Wages");
      if (!m.ok) return { error: m.error };
      return { esiWages: m.value };
    },
  },
  "hr-professional-tax-calculator": {
    title: "Professional tax",
    description: `Illustrative PT slab (e.g. MH-style). ${D}`,
    fields: [
      { key: "M", label: "Monthly salary", def: "100000" },
      { key: "P", label: "Override PT ₹ (optional)", def: "" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Salary");
      if (!m.ok) return { error: m.error };
      return { monthly: m.value, ptAmount: v.p.trim() !== "" ? Number(v.p) : undefined };
    },
  },
  "hr-tds-calculator": {
    title: "TDS",
    description: `Monthly TDS from rate or estimated annual tax. ${D}`,
    fields: [
      { key: "M", label: "Monthly gross", def: "100000" },
      { key: "T", label: "TDS % (optional)", def: "" },
      { key: "A", label: "Annual tax estimate (optional)", def: "" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Gross");
      if (!m.ok) return { error: m.error };
      return {
        monthly: m.value,
        tdsPct: v.t.trim() !== "" ? Number(v.t) : undefined,
        annualTax: v.a.trim() !== "" ? Number(v.a) : undefined,
      };
    },
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

function formatResult(res: HrResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.amount !== undefined) rows.push({ label: "Amount", value: num(res.amount, 2) });
  if (res.amount2 !== undefined) rows.push({ label: "Amount 2", value: num(res.amount2, 2) });
  if (res.amount3 !== undefined) rows.push({ label: "Amount 3", value: num(res.amount3, 2) });
  if (res.pct !== undefined) rows.push({ label: "%", value: num(res.pct, 2) });
  if (res.rate !== undefined) rows.push({ label: "Rate", value: num(res.rate, 4) });
  if (res.hours !== undefined) rows.push({ label: "Hours", value: num(res.hours, 2) });
  if (res.days !== undefined) rows.push({ label: "Days", value: num(res.days, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.amount !== undefined ? num(res.amount, 2)
    : res.pct !== undefined ? `${num(res.pct, 2)}%`
    : "—";
  return { primary, primaryLabel: "Result", rows };
}

export function HrPayrollCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HrPayrollSlug;
  const config = CONFIG[key] ?? CONFIG["hr-in-hand-salary-calculator"];
  const def = (k: keyof typeof HR_URL) => config.fields.find((f) => f.key === k)?.def ?? "";

  const [a, setA] = useState(useLoanInitialInput(HR_URL.A, def("A")));
  const [b, setB] = useState(useLoanInitialInput(HR_URL.B, def("B")));
  const [c, setC] = useState(useLoanInitialInput(HR_URL.C, def("C")));
  const [d, setD] = useState(useLoanInitialInput(HR_URL.D, def("D")));
  const [n, setN] = useState(useLoanInitialInput(HR_URL.N, def("N")));
  const [m, setM] = useState(useLoanInitialInput(HR_URL.M, def("M")));
  const [p, setP] = useState(useLoanInitialInput(HR_URL.P, def("P")));
  const [h, setH] = useState(useLoanInitialInput(HR_URL.H, def("H")));
  const [r, setR] = useState(useLoanInitialInput(HR_URL.R, def("R")));
  const [t, setT] = useState(useLoanInitialInput(HR_URL.T, def("T")));
  const [l, setL] = useState(useLoanInitialInput(HR_URL.L, def("L")));
  const [w, setW] = useState(useLoanInitialInput(HR_URL.W, def("W")));
  const [v, setV] = useState(useLoanInitialInput(HR_URL.V, def("V")));
  const [s, setS] = useState(useLoanInitialInput(HR_URL.S, def("S")));
  const [q, setQ] = useState(useLoanInitialInput(HR_URL.Q, def("Q")));

  const values: Record<string, string> = { a, b, c, d, n, m, p, h, r, t, l, w, v, s, q };
  const setters: Record<string, (x: string) => void> = {
    a: setA, b: setB, c: setC, d: setD, n: setN, m: setM, p: setP, h: setH,
    r: setR, t: setT, l: setL, w: setW, v: setV, s: setS, q: setQ,
  };

  const numFn = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    for (const f of config.fields) {
      const val = values[HR_URL[f.key]];
      if (val?.trim()) out[HR_URL[f.key]] = val;
    }
    return out;
  }, [config.fields, a, b, c, d, n, m, p, h, r, t, l, w, v, s, q]);

  useLoanUrlSync(shareParams, [a, b, c, d, n, m, p, h, r, t, l, w, v, s, q]);

  const result = useMemo(() => {
    const built = config.build(values);
    if ("error" in built) return { error: built.error };
    return formatResult(computeHrPayroll(key in CONFIG ? key : "hr-in-hand-salary-calculator", built), numFn);
  }, [config, key, a, b, c, d, n, m, p, h, r, t, l, w, v, s, q]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((f) => (
            <div key={f.key}>
              <FieldLabel htmlFor={`hr-pay-${f.key}`}>{f.label}</FieldLabel>
              <FieldInput
                id={`hr-pay-${f.key}`}
                value={values[HR_URL[f.key]]}
                onChange={(ev) => setters[HR_URL[f.key]](ev.target.value)}
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
