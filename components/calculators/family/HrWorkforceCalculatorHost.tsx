"use client";

import { computeHrWorkforce, type HrWorkforceInput, type HrWorkforceSlug } from "@/lib/calculators/hrWorkforce";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrWorkforceSlug, HrHostConfig<HrWorkforceSlug, HrWorkforceInput>> = {
  "hr-headcount-calculator": {
    title: "Headcount",
    description: `Current + hires − exits. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Current headcount", def: "50" },
      { key: "B", label: "Hires", def: "5" },
      { key: "C", label: "Exits", def: "3" },
    ],
    build: (v) => ({
      currentHeadcount: Number(v.a),
      hires: Number(v.b) || 0,
      exits: Number(v.c) || 0,
    }),
  },
  "hr-workforce-planning-calculator": {
    title: "Workforce planning",
    description: `Growth and attrition net hire plan. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Current headcount", def: "50" },
      { key: "B", label: "Growth %", def: "5" },
      { key: "R", label: "Attrition %", def: "10" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Headcount");
      if (!a.ok) return { error: a.error };
      return { currentHeadcount: a.value, growthPct: Number(v.b) || 0, attritionPct: Number(v.r) || 0 };
    },
  },
  "hr-staffing-needs-calculator": {
    title: "Staffing needs",
    description: `Demand ÷ productivity per FTE. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Demand / workload", def: "1000" },
      { key: "B", label: "Output per FTE", def: "50" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Demand");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Productivity");
      if (!b.ok) return { error: b.error };
      return { demandUnits: a.value, productivityPerFte: b.value };
    },
  },
  "hr-workload-distribution-calculator": {
    title: "Workload distribution",
    description: `Per-person load and utilization. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Total workload", def: "1000" },
      { key: "N", label: "Team size", def: "25" },
      { key: "C", label: "Capacity per person", def: "40" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Workload");
      if (!a.ok) return { error: a.error };
      const n = parsePositive(v.n, "Team size");
      if (!n.ok) return { error: n.error };
      return { totalWorkload: a.value, teamSize: n.value, capacityPerPerson: Number(v.c) || undefined };
    },
  },
};

export const HrWorkforceCalculatorHost = createHrSectionHost({
  name: "HrWorkforceCalculatorHost",
  configs: CONFIG,
  fallback: "hr-headcount-calculator",
  compute: computeHrWorkforce,
  idPrefix: "hr-wf",
});
