"use client";

import { computeAigenSmart, type AigenSmartSlug } from "@/lib/calculators/aigenSmart";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenSmartSlug, AigenHostConfig<AigenSmartSlug>> = {
  "aigen-ai-career-path-generator": {
    title: "AI Career Path Generator",
    description: `Heuristic career path with readiness score. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Field / role", def: "data analyst" },
      { key: "B", label: "Level", def: "intermediate" },
      { key: "R", label: "Confidence 0–100", def: "70" },
      { key: "D", label: "Horizon (days)", def: "90" },
      { key: "T", label: "Goal", def: "land interviews" },
    ],
    build: (v) => ({
      topic: v.a,
      level: v.b,
      rate: Number(v.r) || 70,
      days: Number(v.d) || 90,
      goal: v.t,
    }),
  },
  "aigen-ai-skill-gap-analyzer": {
    title: "AI Skill Gap Analyzer",
    description: `Gap sketch from self-rated mastery. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Skill area", def: "TypeScript" },
      { key: "R", label: "Mastery 0–100", def: "55" },
      { key: "T", label: "Goal", def: "job-ready" },
    ],
    build: (v) => ({ topic: v.a, rate: Number(v.r) || 55, goal: v.t }),
  },
  "aigen-ai-resume-score-calculator": {
    title: "AI Resume Score Calculator",
    description: `Heuristic resume score from impact + clarity. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Target role", def: "product manager" },
      { key: "R", label: "Impact signals 0–100", def: "65" },
      { key: "M", label: "Clarity 0–100", def: "70" },
      { key: "T", label: "Goal", def: "pass screens" },
    ],
    build: (v) => ({
      topic: v.a,
      rate: Number(v.r) || 65,
      amount: Number(v.m) || 70,
      goal: v.t,
    }),
  },
  "aigen-ai-investment-advisor": {
    title: "AI Investment Advisor",
    description: `Risk-biased portfolio sketch — not advisory. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Investor label", def: "long-term" },
      { key: "R", label: "Risk comfort 0–100", def: "60" },
      { key: "M", label: "Monthly invest (₹)", def: "10000" },
      { key: "T", label: "Goal", def: "grow corpus" },
    ],
    build: (v) => ({
      topic: v.a,
      rate: Number(v.r) || 60,
      amount: Number(v.m) || 0,
      goal: v.t,
    }),
  },
  "aigen-ai-budget-optimizer": {
    title: "AI Budget Optimizer",
    description: `Surplus and save-rate optimizer draft. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "monthly" },
      { key: "M", label: "Income (₹)", def: "80000" },
      { key: "P", label: "Spend (₹)", def: "55000" },
      { key: "T", label: "Goal", def: "raise savings rate" },
    ],
    build: (v) => ({
      topic: v.a,
      amount: Number(v.m) || 0,
      amount2: Number(v.p) || 0,
      goal: v.t,
    }),
  },
  "aigen-ai-learning-path-generator": {
    title: "AI Learning Path Generator",
    description: `Learn–build–review path with plan score. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Subject", def: "machine learning" },
      { key: "B", label: "Level", def: "beginner" },
      { key: "H", label: "Hours / week", def: "8" },
      { key: "D", label: "Days", def: "90" },
      { key: "T", label: "Goal", def: "finish first project" },
    ],
    build: (v) => ({
      topic: v.a,
      level: v.b,
      hours: Number(v.h) || 8,
      days: Number(v.d) || 90,
      goal: v.t,
    }),
  },
  "aigen-ai-productivity-analyzer": {
    title: "AI Productivity Analyzer",
    description: `Focus vs load productivity score. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Context", def: "workweek" },
      { key: "R", label: "Focus 0–100", def: "70" },
      { key: "H", label: "Hours load", def: "45" },
      { key: "T", label: "Goal", def: "more deep work" },
    ],
    build: (v) => ({
      topic: v.a,
      rate: Number(v.r) || 70,
      hours: Number(v.h) || 40,
      goal: v.t,
    }),
  },
};

export const AigenSmartCalculatorHost = createAigenSectionHost({
  name: "AigenSmartCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-ai-career-path-generator",
  compute: computeAigenSmart,
  idPrefix: "aigen-smart",
});
