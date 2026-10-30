"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HR_URL } from "@/lib/calculators/hrHelpers";
import {
  computeHrAttendance,
  type HrAttendanceInput,
  type HrAttendanceSlug,
} from "@/lib/calculators/hrAttendance";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { formatHrResult, HR_DISCLAIMER, HrResultRow } from "./hrHostShared";

type Config = {
  title: string;
  description: string;
  fields: { key: keyof typeof HR_URL; label: string; def: string }[];
  build: (v: Record<string, string>) => HrAttendanceInput | { error: string };
};

const CONFIG: Record<HrAttendanceSlug, Config> = {
  "hr-work-hours-calculator": {
    title: "Work hours",
    description: `Net hours from shift start/end and break. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Start hour (0–24)", def: "9" },
      { key: "B", label: "End hour (0–24)", def: "18" },
      { key: "C", label: "Break minutes", def: "60" },
    ],
    build: (v) => ({ startHour: Number(v.a), endHour: Number(v.b), breakMinutes: Number(v.c) || 0 }),
  },
  "hr-timesheet-calculator": {
    title: "Timesheet",
    description: `Sum daily hours Mon–Sun. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Mon", def: "8" },
      { key: "B", label: "Tue", def: "8" },
      { key: "C", label: "Wed", def: "8" },
      { key: "D", label: "Thu", def: "8" },
      { key: "N", label: "Fri", def: "8" },
      { key: "M", label: "Sat", def: "0" },
      { key: "P", label: "Sun", def: "0" },
    ],
    build: (v) => ({
      hoursMon: Number(v.a) || 0, hoursTue: Number(v.b) || 0, hoursWed: Number(v.c) || 0,
      hoursThu: Number(v.d) || 0, hoursFri: Number(v.n) || 0, hoursSat: Number(v.m) || 0, hoursSun: Number(v.p) || 0,
    }),
  },
  "hr-weekly-hours-calculator": {
    title: "Weekly hours",
    description: `Hours/day × days/week. ${HR_DISCLAIMER}`,
    fields: [
      { key: "H", label: "Hours / day", def: "8" },
      { key: "D", label: "Days / week", def: "5" },
    ],
    build: (v) => {
      const h = parsePositive(v.h, "Hours/day");
      if (!h.ok) return { error: h.error };
      const d = parsePositive(v.d, "Days");
      if (!d.ok) return { error: d.error };
      return { hoursPerDay: h.value, days: d.value };
    },
  },
  "hr-monthly-work-hours-calculator": {
    title: "Monthly work hours",
    description: `Hours/day × working days. ${HR_DISCLAIMER}`,
    fields: [
      { key: "H", label: "Hours / day", def: "8" },
      { key: "D", label: "Working days", def: "22" },
    ],
    build: (v) => {
      const h = parsePositive(v.h, "Hours/day");
      if (!h.ok) return { error: h.error };
      const d = parsePositive(v.d, "Days");
      if (!d.ok) return { error: d.error };
      return { hoursPerDay: h.value, workingDays: d.value };
    },
  },
  "hr-attendance-percentage-calculator": {
    title: "Attendance percentage",
    description: `Present ÷ working days. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Present days", def: "20" },
      { key: "D", label: "Working days", def: "22" },
    ],
    build: (v) => ({ presentDays: Number(v.a), workingDays: Number(v.d) }),
  },
  "hr-leave-balance-calculator": {
    title: "Leave balance",
    description: `Entitled − used. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Entitled days", def: "18" },
      { key: "B", label: "Used days", def: "4" },
    ],
    build: (v) => ({ leaveEntitled: Number(v.a), leaveUsed: Number(v.b) || 0 }),
  },
  "hr-absence-impact-calculator": {
    title: "Absence impact",
    description: `Daily cost × absent days. ${HR_DISCLAIMER}`,
    fields: [
      { key: "C", label: "Daily cost ₹", def: "2000" },
      { key: "D", label: "Absent days", def: "2" },
    ],
    build: (v) => {
      const c = parsePositive(v.c, "Daily cost");
      if (!c.ok) return { error: c.error };
      const d = parsePositive(v.d, "Absent days");
      if (!d.ok) return { error: d.error };
      return { dailyCost: c.value, absentDays: d.value };
    },
  },
  "hr-overtime-hours-calculator": {
    title: "Overtime hours",
    description: `Actual − scheduled hours. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Actual hours", def: "45" },
      { key: "B", label: "Scheduled hours", def: "40" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Actual");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Scheduled");
      if (!b.ok) return { error: b.error };
      return { actualHours: a.value, scheduledHours: b.value };
    },
  },
  "hr-shift-calculator-day-night": {
    title: "Shift (day/night)",
    description: `Day vs night pay with premium %. ${HR_DISCLAIMER}`,
    fields: [
      { key: "H", label: "Shift hours", def: "8" },
      { key: "R", label: "Base rate", def: "200" },
      { key: "P", label: "Night premium %", def: "10" },
    ],
    build: (v) => ({
      shiftHours: Number(v.h) || 8,
      dailyCost: Number(v.r) || 100,
      nightPremiumPct: Number(v.p) || 0,
    }),
  },
  "hr-break-time-calculator": {
    title: "Break time",
    description: `Break hours and remaining span. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Start hour", def: "9" },
      { key: "B", label: "End hour", def: "18" },
      { key: "C", label: "Break minutes", def: "60" },
    ],
    build: (v) => ({ startHour: Number(v.a), endHour: Number(v.b), breakMinutes: Number(v.c) || 0 }),
  },
  "hr-productivity-time-loss-calculator": {
    title: "Productivity time loss",
    description: `Idle minutes vs scheduled productive hours. ${HR_DISCLAIMER}`,
    fields: [
      { key: "H", label: "Productive hours", def: "8" },
      { key: "M", label: "Idle minutes", def: "30" },
    ],
    build: (v) => {
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { productiveHours: h.value, idleMinutes: Number(v.m) || 0 };
    },
  },
};

export function HrAttendanceCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HrAttendanceSlug;
  const config = CONFIG[key] ?? CONFIG["hr-work-hours-calculator"];
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
  const values: Record<string, string> = { a, b, c, d, n, m, p, h, r };
  const setters: Record<string, (x: string) => void> = {
    a: setA, b: setB, c: setC, d: setD, n: setN, m: setM, p: setP, h: setH, r: setR,
  };
  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");
  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    for (const f of config.fields) {
      const val = values[HR_URL[f.key]];
      if (val?.trim()) out[HR_URL[f.key]] = val;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.fields, a, b, c, d, n, m, p, h, r]);
  useLoanUrlSync(shareParams, [a, b, c, d, n, m, p, h, r]);
  const result = useMemo(() => {
    const built = config.build(values);
    if ("error" in built) return { error: built.error };
    return formatHrResult(computeHrAttendance(key in CONFIG ? key : "hr-work-hours-calculator", built), num);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, key, a, b, c, d, n, m, p, h, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((f) => (
            <div key={f.key}>
              <FieldLabel htmlFor={`hr-att-${f.key}`}>{f.label}</FieldLabel>
              <FieldInput id={`hr-att-${f.key}`} value={values[HR_URL[f.key]]} onChange={(ev) => setters[HR_URL[f.key]](ev.target.value)} inputMode="decimal" />
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
                  <HrResultRow key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
