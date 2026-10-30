"use client";

import { computeHrAi, type HrAiInput, type HrAiSlug } from "@/lib/calculators/hrAi";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrAiSlug, HrHostConfig<HrAiSlug, HrAiInput>> = {
  "hr-ai-salary-benchmark-calculator": {
    title: "AI salary benchmark",
    description: `Heuristic offer vs market median / P25–P75. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Offer (annual)", def: "1500000" },
      { key: "B", label: "Market median", def: "1400000" },
      { key: "C", label: "Market P25 (optional)", def: "1200000" },
      { key: "D", label: "Market P75 (optional)", def: "1700000" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Offer");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Median");
      if (!b.ok) return { error: b.error };
      return {
        offerAnnual: a.value,
        marketMedian: b.value,
        marketP25: v.c ? Number(v.c) : undefined,
        marketP75: v.d ? Number(v.d) : undefined,
      };
    },
  },
  "hr-ai-workforce-optimization-tool": {
    title: "AI workforce optimization",
    description: `Heuristic FTE tweak from demand, idle, OT. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Current FTE", def: "40" },
      { key: "B", label: "Demand FTE", def: "45" },
      { key: "C", label: "OT hours (period)", def: "200" },
      { key: "D", label: "Idle %", def: "5" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Current FTE");
      if (!a.ok) return { error: a.error };
      const b = parsePositive(v.b, "Demand FTE");
      if (!b.ok) return { error: b.error };
      return {
        currentFte: a.value,
        demandFte: b.value,
        overtimeHours: Number(v.c) || 0,
        idlePct: Number(v.d) || 0,
      };
    },
  },
  "hr-ai-productivity-analyzer": {
    title: "AI productivity analyzer",
    description: `Output/hour vs peer benchmark. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Output", def: "1000" },
      { key: "H", label: "Hours", def: "160" },
      { key: "P", label: "Peer output / hour", def: "6" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Output");
      if (!a.ok) return { error: a.error };
      const h = parsePositive(v.h, "Hours");
      if (!h.ok) return { error: h.error };
      return { output: a.value, hours: h.value, peerOutputPerHour: Number(v.p) || undefined };
    },
  },
  "hr-ai-hiring-decision-score-tool": {
    title: "AI hiring decision score",
    description: `Weighted skill/culture/experience/comp fit. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Skill score (0–100)", def: "80" },
      { key: "B", label: "Culture score", def: "75" },
      { key: "C", label: "Experience score", def: "70" },
      { key: "D", label: "Compensation fit", def: "85" },
    ],
    build: (v) => ({
      skillScore: Number(v.a) || 0,
      cultureScore: Number(v.b) || 0,
      experienceScore: Number(v.c) || 0,
      compensationFit: Number(v.d) || 0,
    }),
  },
};

export const HrAiCalculatorHost = createHrSectionHost({
  name: "HrAiCalculatorHost",
  configs: CONFIG,
  fallback: "hr-ai-salary-benchmark-calculator",
  compute: computeHrAi,
  idPrefix: "hr-ai",
});
