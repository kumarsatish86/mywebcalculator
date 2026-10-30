"use client";

import { computeAigenBusiness, type AigenBusinessSlug } from "@/lib/calculators/aigenBusiness";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenBusinessSlug, AigenHostConfig<AigenBusinessSlug>> = {
  "aigen-business-plan-generator": {
    title: "Business Plan Generator",
    description: `Business plan shell with 90-day milestones. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Venture / idea", def: "local meal prep" },
      { key: "C", label: "Customer", def: "busy professionals" },
      { key: "M", label: "Starter budget (₹)", def: "100000" },
      { key: "T", label: "Near-term goal", def: "ship MVP" },
    ],
    build: (v) => ({
      topic: v.a,
      audience: v.c,
      budget: Number(v.m) || 0,
      goal: v.t,
    }),
  },
  "aigen-startup-idea-generator": {
    title: "Startup Idea Generator",
    description: `Idea sparks plus validation steps. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Domain", def: "edtech" },
      { key: "C", label: "Audience", def: "students" },
      { key: "M", label: "Experiment budget (₹)", def: "50000" },
    ],
    build: (v) => ({ topic: v.a, audience: v.c, budget: Number(v.m) || 0 }),
  },
  "aigen-pitch-deck-content-generator": {
    title: "Pitch Deck Content Generator",
    description: `Eight-slide pitch outline. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Company / idea", def: "SaaS for freelancers" }],
    build: (v) => ({ topic: v.a }),
  },
  "aigen-swot-analysis-generator": {
    title: "SWOT Analysis Generator",
    description: `SWOT draft for a venture or project. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Subject", def: "online tutoring" },
      { key: "C", label: "Audience", def: "parents" },
      { key: "T", label: "Goal", def: "grow enrollments" },
    ],
    build: (v) => ({ topic: v.a, audience: v.c, goal: v.t }),
  },
  "aigen-daily-planner-generator": {
    title: "Daily Planner Generator",
    description: `MIT-focused daily planner. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Day theme", def: "deep work Wednesday" }],
    build: (v) => ({ topic: v.a }),
  },
  "aigen-weekly-planner-generator": {
    title: "Weekly Planner Generator",
    description: `Week theme and day roles. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Week theme", def: "launch prep" },
      { key: "D", label: "Days lens", def: "7" },
      { key: "T", label: "Goal", def: "ship beta" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 7, goal: v.t }),
  },
  "aigen-goal-breakdown-generator": {
    title: "Goal Breakdown Generator",
    description: `30/60/90 milestone breakdown. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "T", label: "Goal", def: "grow MRR" },
      { key: "A", label: "Context", def: "SaaS side project" },
    ],
    build: (v) => ({ goal: v.t, topic: v.a }),
  },
  "aigen-habit-tracker-generator": {
    title: "Habit Tracker Generator",
    description: `Three-habit tracker template. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Focus area", def: "founder habits" },
      { key: "T", label: "Tied goal", def: "consistent shipping" },
    ],
    build: (v) => ({ topic: v.a, goal: v.t }),
  },
  "aigen-to-do-list-generator": {
    title: "To-Do List Generator",
    description: `High-leverage to-do checklist. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Context", def: "product sprint" },
      { key: "C", label: "Audience / stakeholder", def: "users" },
      { key: "T", label: "Goal", def: "close sprint goals" },
    ],
    build: (v) => ({ topic: v.a, audience: v.c, goal: v.t }),
  },
};

export const AigenBusinessCalculatorHost = createAigenSectionHost({
  name: "AigenBusinessCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-business-plan-generator",
  compute: computeAigenBusiness,
  idPrefix: "aigen-biz",
});
