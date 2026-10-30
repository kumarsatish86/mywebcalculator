"use client";

import { computeHrLeave, type HrLeaveInput, type HrLeaveSlug } from "@/lib/calculators/hrLeave";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrLeaveSlug, HrHostConfig<HrLeaveSlug, HrLeaveInput>> = {
  "hr-leave-accrual-calculator": {
    title: "Leave accrual",
    description: `Months × accrual rate. ${HR_DISCLAIMER}`,
    fields: [
      { key: "M", label: "Months worked", def: "12" },
      { key: "R", label: "Accrual days / month", def: "1.5" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Months");
      if (!m.ok) return { error: m.error };
      const r = parsePositive(v.r, "Rate");
      if (!r.ok) return { error: r.error };
      return { monthsWorked: m.value, accrualPerMonth: r.value };
    },
  },
  "hr-annual-leave-calculator": {
    title: "Annual leave",
    description: `Entitlement + carry − used. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Annual entitlement", def: "18" },
      { key: "B", label: "Used", def: "3" },
      { key: "C", label: "Carried forward", def: "2" },
    ],
    build: (v) => ({
      annualEntitlement: Number(v.a),
      used: Number(v.b) || 0,
      carried: Number(v.c) || 0,
    }),
  },
  "hr-sick-leave-calculator": {
    title: "Sick leave",
    description: `Sick entitlement − used. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Sick entitlement", def: "12" },
      { key: "B", label: "Used", def: "1" },
    ],
    build: (v) => ({ sickEntitlement: Number(v.a), sickUsed: Number(v.b) || 0 }),
  },
  "hr-pto-calculator": {
    title: "PTO",
    description: `Hours worked × accrual rate − used. ${HR_DISCLAIMER}`,
    fields: [
      { key: "H", label: "Hours worked", def: "160" },
      { key: "R", label: "Accrual (days per hour)", def: "0.05" },
      { key: "B", label: "Used days", def: "2" },
    ],
    build: (v) => {
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      const r = parsePositive(v.r, "Rate");
      if (!r.ok) return { error: r.error };
      return { hoursWorked: h.value, ptoAccrualRate: r.value, used: Number(v.b) || 0 };
    },
  },
  "hr-vacation-balance-calculator": {
    title: "Vacation balance",
    description: `Bank + carry − taken. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Vacation days", def: "20" },
      { key: "B", label: "Used", def: "5" },
      { key: "C", label: "Carried", def: "2" },
    ],
    build: (v) => ({
      annualEntitlement: Number(v.a),
      used: Number(v.b) || 0,
      carried: Number(v.c) || 0,
    }),
  },
  "hr-leave-encashment-calculator": {
    title: "Leave encashment",
    description: `(Basic+DA)/30 × leave days. ${HR_DISCLAIMER}`,
    fields: [
      { key: "B", label: "Basic + DA monthly", def: "50000" },
      { key: "D", label: "Leave days", def: "5" },
    ],
    build: (v) => {
      const b = parsePositive(v.b, "Basic+DA");
      if (!b.ok) return { error: b.error };
      const d = parsePositive(v.d, "Days");
      if (!d.ok) return { error: d.error };
      return { basicPlusDa: b.value, leaveDays: d.value };
    },
  },
};

export const HrLeaveCalculatorHost = createHrSectionHost({
  name: "HrLeaveCalculatorHost",
  configs: CONFIG,
  fallback: "hr-leave-accrual-calculator",
  compute: computeHrLeave,
  idPrefix: "hr-leave",
});
