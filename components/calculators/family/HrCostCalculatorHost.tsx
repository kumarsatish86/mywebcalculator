"use client";

import { computeHrCost, type HrCostInput, type HrCostSlug } from "@/lib/calculators/hrCost";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrCostSlug, HrHostConfig<HrCostSlug, HrCostInput>> = {
  "hr-ctc-calculator": {
    title: "Cost to company (CTC)",
    description: `Gross + employer PF + benefits %. ${HR_DISCLAIMER}`,
    fields: [
      { key: "M", label: "Gross monthly", def: "100000" },
      { key: "P", label: "Employer PF ₹", def: "1800" },
      { key: "B", label: "Benefits %", def: "12" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Gross");
      if (!m.ok) return { error: m.error };
      return { grossMonthly: m.value, employerPf: Number(v.p) || 0, employerBenefitsPct: Number(v.b) || 0 };
    },
  },
  "hr-employee-cost-calculator": {
    title: "Employee cost",
    description: `Gross × (1 + benefits% + overhead%). ${HR_DISCLAIMER}`,
    fields: [
      { key: "M", label: "Gross monthly", def: "100000" },
      { key: "B", label: "Benefits %", def: "15" },
      { key: "H", label: "Overhead %", def: "10" },
    ],
    build: (v) => {
      const m = parsePositive(v.m, "Gross");
      if (!m.ok) return { error: m.error };
      return { grossMonthly: m.value, employerBenefitsPct: Number(v.b) || 0, overheadPct: Number(v.h) || 0 };
    },
  },
  "hr-hiring-cost-calculator": {
    title: "Hiring cost",
    description: `Agency + ads + recruiter. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Agency fees", def: "50000" },
      { key: "B", label: "Ads cost", def: "20000" },
      { key: "C", label: "Recruiter cost", def: "30000" },
      { key: "N", label: "Hires", def: "2" },
    ],
    build: (v) => ({
      agencyFees: Number(v.a) || 0, adsCost: Number(v.b) || 0, recruiterCost: Number(v.c) || 0, hires: Number(v.n) || 1,
    }),
  },
  "hr-cost-per-hire-calculator": {
    title: "Cost per hire",
    description: `Total recruiting spend ÷ hires. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Agency fees", def: "50000" },
      { key: "B", label: "Ads cost", def: "20000" },
      { key: "C", label: "Recruiter cost", def: "30000" },
      { key: "N", label: "Hires", def: "2" },
    ],
    build: (v) => ({
      agencyFees: Number(v.a) || 0, adsCost: Number(v.b) || 0, recruiterCost: Number(v.c) || 0, hires: Number(v.n) || 1,
    }),
  },
  "hr-employee-turnover-cost-calculator": {
    title: "Employee turnover cost",
    description: `Annual salary × replacement multiplier. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Annual salary", def: "1200000" },
      { key: "M", label: "Replacement multiplier", def: "0.5" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Salary");
      if (!a.ok) return { error: a.error };
      const m = parsePositive(v.m, "Multiplier");
      if (!m.ok) return { error: m.error };
      return { salaryAnnual: a.value, replacementMultiplier: m.value };
    },
  },
  "hr-time-to-hire-calculator": {
    title: "Time to hire",
    description: `Avg days-to-fill. ${HR_DISCLAIMER}`,
    fields: [
      { key: "D", label: "Sum of days open", def: "90" },
      { key: "N", label: "Openings", def: "3" },
    ],
    build: (v) => {
      const d = parsePositive(v.d, "Days");
      if (!d.ok) return { error: d.error };
      const n = parsePositive(v.n, "Openings");
      if (!n.ok) return { error: n.error };
      return { daysOpen: d.value, openings: n.value };
    },
  },
  "hr-offer-acceptance-rate-calculator": {
    title: "Offer acceptance rate",
    description: `Accepted ÷ made. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Offers accepted", def: "7" },
      { key: "B", label: "Offers made", def: "10" },
    ],
    build: (v) => ({ offersAccepted: Number(v.a), offersMade: Number(v.b) }),
  },
  "hr-recruitment-roi-calculator": {
    title: "Recruitment ROI",
    description: `(Value − spend) ÷ spend. ${HR_DISCLAIMER}`,
    fields: [
      { key: "S", label: "Recruitment spend", def: "100000" },
      { key: "V", label: "Value from hires", def: "500000" },
    ],
    build: (v) => {
      const s = parsePositive(v.s, "Spend");
      if (!s.ok) return { error: s.error };
      const val = parsePositive(v.v, "Value");
      if (!val.ok) return { error: val.error };
      return { recruitSpend: s.value, valueHired: val.value };
    },
  },
};

export const HrCostCalculatorHost = createHrSectionHost({
  name: "HrCostCalculatorHost",
  configs: CONFIG,
  fallback: "hr-ctc-calculator",
  compute: computeHrCost,
  idPrefix: "hr-cost",
});
