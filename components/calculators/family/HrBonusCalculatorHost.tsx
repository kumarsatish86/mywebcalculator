"use client";

import { computeHrBonus, type HrBonusInput, type HrBonusSlug } from "@/lib/calculators/hrBonus";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrBonusSlug, HrHostConfig<HrBonusSlug, HrBonusInput>> = {
  "hr-bonus-calculator": {
    title: "Bonus",
    description: `Base × bonus % (teaching default 8.33%). ${HR_DISCLAIMER}`,
    fields: [
      { key: "B", label: "Basic + DA / base", def: "40000" },
      { key: "P", label: "Bonus %", def: "8.33" },
    ],
    build: (v) => {
      const b = parsePositive(v.b, "Base");
      if (!b.ok) return { error: b.error };
      const p = parsePositive(v.p, "Bonus %");
      if (!p.ok) return { error: p.error };
      return { basicPlusDa: b.value, bonusPct: p.value };
    },
  },
  "hr-incentive-calculator": {
    title: "Incentive",
    description: `Target × achievement% × multiplier. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Target incentive", def: "50000" },
      { key: "B", label: "Achievement %", def: "110" },
      { key: "M", label: "Multiplier", def: "1" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Target");
      if (!a.ok) return { error: a.error };
      return { targetBonus: a.value, achievementPct: Number(v.b) || 100, multiplier: Number(v.m) || 1 };
    },
  },
  "hr-commission-calculator": {
    title: "Commission",
    description: `Sales × commission %. ${HR_DISCLAIMER}`,
    fields: [
      { key: "S", label: "Sales", def: "1000000" },
      { key: "P", label: "Commission %", def: "5" },
    ],
    build: (v) => {
      const s = parsePositive(v.s, "Sales");
      if (!s.ok) return { error: s.error };
      const p = parsePositive(v.p, "%");
      if (!p.ok) return { error: p.error };
      return { sales: s.value, commissionPct: p.value };
    },
  },
  "hr-sales-incentive-calculator": {
    title: "Sales incentive",
    description: `Tiered sales incentive sum. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Tier 1 sales", def: "1000000" },
      { key: "B", label: "Tier 1 %", def: "3" },
      { key: "C", label: "Tier 2 sales", def: "200000" },
      { key: "D", label: "Tier 2 %", def: "7" },
    ],
    build: (v) => {
      const a = parsePositive(v.a, "Sales");
      if (!a.ok) return { error: a.error };
      return {
        sales: a.value,
        commissionPct: Number(v.b) || 0,
        tier2Sales: Number(v.c) || 0,
        tier2Pct: Number(v.d) || 0,
      };
    },
  },
};

export const HrBonusCalculatorHost = createHrSectionHost({
  name: "HrBonusCalculatorHost",
  configs: CONFIG,
  fallback: "hr-bonus-calculator",
  compute: computeHrBonus,
  idPrefix: "hr-bonus",
});
