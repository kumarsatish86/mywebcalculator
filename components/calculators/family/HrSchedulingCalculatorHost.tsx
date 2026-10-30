"use client";

import { computeHrScheduling, type HrSchedulingInput, type HrSchedulingSlug } from "@/lib/calculators/hrScheduling";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrSchedulingSlug, HrHostConfig<HrSchedulingSlug, HrSchedulingInput>> = {
  "hr-shift-planning-calculator": {
    title: "Shift planning",
    description: `Coverage hours ÷ shift length × people. ${HR_DISCLAIMER}`,
    fields: [
      { key: "H", label: "Coverage hours", def: "24" },
      { key: "L", label: "Shift length hours", def: "8" },
      { key: "N", label: "People per shift", def: "2" },
    ],
    build: (v) => {
      const h = parsePositive(v.h, "Coverage");
      if (!h.ok) return { error: h.error };
      const l = parsePositive(v.l, "Length");
      if (!l.ok) return { error: l.error };
      return { hoursCoverageNeeded: h.value, shiftLengthHours: l.value, peoplePerShift: Number(v.n) || 1 };
    },
  },
  "hr-rotational-shift-calculator": {
    title: "Rotational shift",
    description: `Days on ≈ cycle ÷ teams. ${HR_DISCLAIMER}`,
    fields: [
      { key: "D", label: "Days in cycle", def: "21" },
      { key: "N", label: "Teams", def: "3" },
      { key: "S", label: "Shifts per day", def: "3" },
    ],
    build: (v) => {
      const d = parsePositive(v.d, "Days");
      if (!d.ok) return { error: d.error };
      const n = parsePositive(v.n, "Teams");
      if (!n.ok) return { error: n.error };
      return { daysInCycle: d.value, rotationTeams: n.value, shiftsPerDay: Number(v.s) || 3 };
    },
  },
  "hr-staffing-coverage-calculator": {
    title: "Staffing coverage",
    description: `Available ÷ needed seats. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Seats needed", def: "10" },
      { key: "B", label: "Staff available", def: "9" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Needed");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Available");
      if (!b.ok) return { error: b.error };
      return { seatsNeeded: a.value, staffAvailable: b.value };
    },
  },
  "hr-shift-differential-pay-calculator": {
    title: "Shift differential pay",
    description: `Base × (1 + differential%) × hours. ${HR_DISCLAIMER}`,
    fields: [
      { key: "R", label: "Base hourly", def: "200" },
      { key: "P", label: "Differential %", def: "15" },
      { key: "H", label: "Shift hours", def: "8" },
    ],
    build: (v) => {
      const r = parsePositive(v.r, "Base");
      if (!r.ok) return { error: r.error };
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { baseHourly: r.value, differentialPct: Number(v.p) || 0, shiftHours: h.value };
    },
  },
};

export const HrSchedulingCalculatorHost = createHrSectionHost({
  name: "HrSchedulingCalculatorHost",
  configs: CONFIG,
  fallback: "hr-shift-planning-calculator",
  compute: computeHrScheduling,
  idPrefix: "hr-sched",
});
