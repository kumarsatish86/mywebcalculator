"use client";

import { computeAigenAdvanced, type AigenAdvancedSlug } from "@/lib/calculators/aigenAdvanced";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenAdvancedSlug, AigenHostConfig<AigenAdvancedSlug>> = {
  "aigen-salary-to-financial-plan-generator": {
    title: "Input Salary to Full Financial Plan Generator",
    description: `Salary → needs/wants/invest roadmap draft. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Plan label", def: "take-home plan" },
      { key: "M", label: "Monthly salary (₹)", def: "75000" },
      { key: "T", label: "90-day goal", def: "fund emergency buffer" },
    ],
    build: (v) => ({ topic: v.a, amount: Number(v.m) || 0, goal: v.t }),
  },
  "aigen-goal-to-roadmap-generator": {
    title: "Input Goal to Step-by-Step Roadmap Generator",
    description: `Goal → phased roadmap draft. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "T", label: "Goal", def: "launch side product" },
      { key: "A", label: "Context", def: "solo founder nights" },
      { key: "B", label: "Level", def: "intermediate" },
      { key: "D", label: "Horizon (days)", def: "90" },
    ],
    build: (v) => ({
      goal: v.t,
      topic: v.a,
      level: v.b,
      days: Number(v.d) || 90,
    }),
  },
  "aigen-resume-to-improvement-plan-generator": {
    title: "Input Resume to Improvement Plan Generator",
    description: `Resume score → improvement passes. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Target role", def: "software engineer" },
      { key: "R", label: "Current score 0–100", def: "62" },
      { key: "D", label: "Days to revise", def: "14" },
      { key: "T", label: "Goal", def: "clear ATS + screens" },
    ],
    build: (v) => ({
      topic: v.a,
      rate: Number(v.r) || 62,
      days: Number(v.d) || 14,
      goal: v.t,
    }),
  },
  "aigen-expenses-to-savings-strategy-generator": {
    title: "Input Expenses to Savings Strategy Generator",
    description: `Expenses + income → savings strategy. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "household" },
      { key: "M", label: "Monthly expenses (₹)", def: "45000" },
      { key: "P", label: "Monthly income (₹)", def: "70000" },
      { key: "D", label: "Review days", def: "30" },
      { key: "T", label: "Goal", def: "save for house downpayment" },
    ],
    build: (v) => ({
      topic: v.a,
      amount: Number(v.m) || 0,
      amount2: Number(v.p) || 0,
      days: Number(v.d) || 30,
      goal: v.t,
    }),
  },
  "aigen-marks-to-study-strategy-generator": {
    title: "Input Marks to Study Strategy Generator",
    description: `Marks → targeted study strategy. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Subject", def: "physics" },
      { key: "R", label: "Current marks %", def: "62" },
      { key: "M", label: "Target marks %", def: "80" },
      { key: "B", label: "Level", def: "board exams" },
      { key: "D", label: "Days left", def: "45" },
      { key: "T", label: "Goal", def: "clear cutoff comfortably" },
    ],
    build: (v) => ({
      topic: v.a,
      rate: Number(v.r) || 62,
      amount: Number(v.m) || 80,
      level: v.b,
      days: Number(v.d) || 45,
      goal: v.t,
    }),
  },
};

export const AigenAdvancedCalculatorHost = createAigenSectionHost({
  name: "AigenAdvancedCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-salary-to-financial-plan-generator",
  compute: computeAigenAdvanced,
  idPrefix: "aigen-advanced",
});
