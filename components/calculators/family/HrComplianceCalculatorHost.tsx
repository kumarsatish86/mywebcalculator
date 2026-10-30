"use client";

import { computeHrCompliance, type HrComplianceInput, type HrComplianceSlug } from "@/lib/calculators/hrCompliance";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrComplianceSlug, HrHostConfig<HrComplianceSlug, HrComplianceInput>> = {
  "hr-gratuity-calculator": {
    title: "Gratuity",
    description: `(Last drawn × 15/26) × years — illustrative cap. ${HR_DISCLAIMER}`,
    fields: [
      { key: "M", label: "Last drawn monthly (basic+DA)", def: "50000" },
      { key: "N", label: "Years of service", def: "10" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Last drawn");
      if (!m.ok) return { error: m.error };
      const y = parsePositive(v.n, "Years");
      if (!y.ok) return { error: y.error };
      return { lastDrawnMonthly: m.value, yearsOfService: y.value };
    },
  },
  "hr-notice-period-calculator": {
    title: "Notice period",
    description: `Shortfall days × daily gross buyout estimate. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Notice days required", def: "30" },
      { key: "B", label: "Days served", def: "10" },
      { key: "D", label: "Daily gross ₹", def: "2000" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Required");
      if (!a.ok) return { error: a.error };
      const d = parsePositive(v.d, "Daily");
      if (!d.ok) return { error: d.error };
      return { noticeDaysRequired: a.value, noticeDaysServed: Number(v.b) || 0, dailyGross: d.value };
    },
  },
  "hr-severance-pay-calculator": {
    title: "Severance pay",
    description: `Monthly wage × severance months. ${HR_DISCLAIMER}`,
    fields: [
      { key: "M", label: "Monthly gross", def: "60000" },
      { key: "N", label: "Severance months", def: "2" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Monthly");
      if (!m.ok) return { error: m.error };
      const n = parsePositive(v.n, "Months");
      if (!n.ok) return { error: n.error };
      return { monthlyGross: m.value, severanceMonths: n.value };
    },
  },
  "hr-final-settlement-calculator": {
    title: "Final settlement (F&F)",
    description: `Leave + bonus + other + gratuity − recoveries. ${HR_DISCLAIMER}`,
    fields: [
      { key: "M", label: "Monthly gross", def: "60000" },
      { key: "N", label: "Years of service", def: "10" },
      { key: "L", label: "Leave encashment ₹", def: "10000" },
      { key: "B", label: "Bonus due ₹", def: "5000" },
      { key: "A", label: "Other dues ₹", def: "2000" },
      { key: "R", label: "Recoveries ₹", def: "1000" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Monthly");
      if (!m.ok) return { error: m.error };
      return {
        monthlyGross: m.value,
        yearsOfService: Number(v.n) || 0,
        leaveEncashment: Number(v.l) || 0,
        bonusDue: Number(v.b) || 0,
        otherDues: Number(v.a) || 0,
        recoveries: Number(v.r) || 0,
      };
    },
  },
};

export const HrComplianceCalculatorHost = createHrSectionHost({
  name: "HrComplianceCalculatorHost",
  configs: CONFIG,
  fallback: "hr-gratuity-calculator",
  compute: computeHrCompliance,
  idPrefix: "hr-comp",
});
