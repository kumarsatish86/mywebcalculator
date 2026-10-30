"use client";

import { computeHrAttrition, type HrAttritionInput, type HrAttritionSlug } from "@/lib/calculators/hrAttrition";
import { createHrSectionHost, type HrHostConfig } from "./createHrSectionHost";
import { HR_DISCLAIMER } from "./hrHostShared";

const CONFIG: Record<HrAttritionSlug, HrHostConfig<HrAttritionSlug, HrAttritionInput>> = {
  "hr-attrition-rate-calculator": {
    title: "Attrition rate",
    description: `Separations ÷ average headcount. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Separations", def: "10" },
      { key: "B", label: "Average headcount", def: "100" },
    ],
    build: (v) => ({ separations: Number(v.a), avgHeadcount: Number(v.b) }),
  },
  "hr-employee-retention-rate-calculator": {
    title: "Employee retention rate",
    description: `Retained ÷ beginning headcount. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Retained", def: "90" },
      { key: "B", label: "Beginning headcount", def: "100" },
    ],
    build: (v) => ({ retained: Number(v.a), beginningHeadcount: Number(v.b) }),
  },
  "hr-churn-rate-hr-calculator": {
    title: "Churn rate (HR)",
    description: `Separations ÷ average headcount. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Separations", def: "10" },
      { key: "B", label: "Beginning HC", def: "100" },
      { key: "C", label: "Ending HC", def: "95" },
    ],
    build: (v) => ({
      separations: Number(v.a),
      beginningHeadcount: Number(v.b),
      endingHeadcount: Number(v.c),
    }),
  },
  "hr-employee-stability-index-calculator": {
    title: "Employee stability index",
    description: `(≥1 year tenure) ÷ HC a year ago. ${HR_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Employees with ≥1 year", def: "80" },
      { key: "B", label: "Headcount 1 year ago", def: "100" },
    ],
    build: (v) => ({ employeesOneYearPlus: Number(v.a), headcountYearAgo: Number(v.b) }),
  },
};

export const HrAttritionCalculatorHost = createHrSectionHost({
  name: "HrAttritionCalculatorHost",
  configs: CONFIG,
  fallback: "hr-attrition-rate-calculator",
  compute: computeHrAttrition,
  idPrefix: "hr-attr",
});
