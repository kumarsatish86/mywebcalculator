"use client";

import {
  computeHrProductivity,
  type HrProductivityInput,
  type HrProductivitySlug,
} from "@/lib/calculators/hrProductivity";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrProductivitySlug, HrHostConfig<HrProductivitySlug, HrProductivityInput>> = {
  "hr-employee-productivity-calculator": {
    title: "Employee productivity",
    description: `Output ÷ hours. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Output", def: "100" },
      { key: "H", label: "Hours", def: "40" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Output");
      if (!a.ok) return { error: a.error };
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { output: a.value, hours: h.value };
    },
  },
  "hr-task-completion-rate-calculator": {
    title: "Task completion rate",
    description: `Completed ÷ total tasks. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Completed", def: "8" },
      { key: "B", label: "Total tasks", def: "10" },
    ],
    build: (v) => ({ completed: Number(v.a), totalTasks: Number(v.b) }),
  },
  "hr-efficiency-calculator": {
    title: "Efficiency",
    description: `Actual ÷ standard output. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Actual output", def: "90" },
      { key: "B", label: "Standard output", def: "80" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Actual");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Standard");
      if (!b.ok) return { error: b.error };
      return { actualOutput: a.value, standardOutput: b.value };
    },
  },
  "hr-output-per-hour-calculator": {
    title: "Output per hour",
    description: `Output ÷ hours. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Output", def: "100" },
      { key: "H", label: "Hours", def: "40" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Output");
      if (!a.ok) return { error: a.error };
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { output: a.value, hours: h.value };
    },
  },
  "hr-team-efficiency-calculator": {
    title: "Team efficiency",
    description: `Team output ÷ hours and per head. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Team output", def: "400" },
      { key: "H", label: "Team hours", def: "160" },
      { key: "N", label: "Headcount", def: "4" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Output");
      if (!a.ok) return { error: a.error };
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { teamOutput: a.value, teamHours: h.value, headcount: Number(v.n) || 1 };
    },
  },
  "hr-workforce-productivity-calculator": {
    title: "Workforce productivity",
    description: `Workforce output per hour / head. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Output", def: "400" },
      { key: "H", label: "Hours", def: "160" },
      { key: "N", label: "Headcount", def: "4" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Output");
      if (!a.ok) return { error: a.error };
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { teamOutput: a.value, teamHours: h.value, headcount: Number(v.n) || 1 };
    },
  },
  "hr-utilization-rate-calculator": {
    title: "Utilization rate",
    description: `Billable ÷ available hours. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Billable hours", def: "140" },
      { key: "B", label: "Available hours", def: "160" },
    ],
    build: (v) => ({ billableHours: Number(v.a), availableHours: Number(v.b) }),
  },
  "hr-kpi-calculator": {
    title: "KPI",
    description: `Actual ÷ target. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Actual", def: "90" },
      { key: "B", label: "Target", def: "100" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Actual");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Target");
      if (!b.ok) return { error: b.error };
      return { actual: a.value, target: b.value };
    },
  },
  "hr-performance-score-calculator": {
    title: "Performance score",
    description: `Weighted score across up to 3 factors. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Weight 1", def: "1" },
      { key: "B", label: "Score 1", def: "80" },
      { key: "C", label: "Weight 2", def: "1" },
      { key: "D", label: "Score 2", def: "70" },
      { key: "N", label: "Weight 3", def: "1" },
      { key: "M", label: "Score 3", def: "90" },
    ],
    build: (v) => ({
      weight1: Number(v.a) || 0, score1: Number(v.b) || 0,
      weight2: Number(v.c) || 0, score2: Number(v.d) || 0,
      weight3: Number(v.n) || 0, score3: Number(v.m) || 0,
    }),
  },
  "hr-target-achievement-calculator": {
    title: "Target achievement",
    description: `Achievement % and gap. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Actual", def: "90" },
      { key: "B", label: "Target", def: "100" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Actual");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Target");
      if (!b.ok) return { error: b.error };
      return { actual: a.value, target: b.value };
    },
  },
};

export const HrProductivityCalculatorHost = createHrSectionHost({
  name: "HrProductivityCalculatorHost",
  configs: CONFIG,
  fallback: "hr-employee-productivity-calculator",
  compute: computeHrProductivity,
  idPrefix: "hr-prod",
});
