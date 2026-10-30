"use client";

import { computeAigenHealth, type AigenHealthSlug } from "@/lib/calculators/aigenHealth";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenHealthSlug, AigenHostConfig<AigenHealthSlug>> = {
  "aigen-workout-plan-generator": {
    title: "Workout Plan Generator",
    description: `Weekly workout outline. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Focus", def: "strength" },
      { key: "D", label: "Days in cycle", def: "7" },
      { key: "S", label: "Style", def: "balanced" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 7, style: v.s }),
  },
  "aigen-home-workout-generator": {
    title: "Home Workout Generator",
    description: `Equipment-light home circuit. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Focus", def: "full body" },
      { key: "D", label: "Sessions / week", def: "4" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 4 }),
  },
  "aigen-gym-routine-generator": {
    title: "Gym Routine Generator",
    description: `A/B/C gym microcycle draft. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Focus", def: "hypertrophy" },
      { key: "D", label: "Days in cycle", def: "6" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 6 }),
  },
  "aigen-weight-loss-plan-generator": {
    title: "Weight Loss Plan Generator",
    description: `Teaching calorie deficit sketch — not medical advice. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "fat loss" },
      { key: "W", label: "Weight (kg)", def: "70" },
      { key: "M", label: "Maintain calories", def: "2200" },
    ],
    build: (v) => ({ topic: v.a, weight: Number(v.w) || 70, amount: Number(v.m) || 2200 }),
  },
  "aigen-diet-plan-generator": {
    title: "Diet Plan Generator",
    description: `Simple daily diet template. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "balanced diet" },
      { key: "S", label: "Style", def: "vegetarian" },
      { key: "M", label: "Calories sketch", def: "2000" },
    ],
    build: (v) => ({ topic: v.a, style: v.s, amount: Number(v.m) || 2000 }),
  },
  "aigen-meal-plan-generator": {
    title: "Meal Plan Generator",
    description: `Multi-day meal plan scaffold. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "weeknight meals" },
      { key: "D", label: "Days", def: "7" },
      { key: "M", label: "Calories sketch", def: "2000" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 7, amount: Number(v.m) || 2000 }),
  },
  "aigen-calorie-intake-plan-generator": {
    title: "Calorie Intake Plan Generator",
    description: `Macro sketch from calories and weight. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "macros" },
      { key: "M", label: "Calories", def: "2000" },
      { key: "W", label: "Weight (kg)", def: "70" },
    ],
    build: (v) => ({ topic: v.a, amount: Number(v.m) || 2000, weight: Number(v.w) || 70 }),
  },
  "aigen-keto-vegetarian-diet-generator": {
    title: "Keto/Vegetarian Diet Generator",
    description: `Idea board for keto-leaning or vegetarian patterns. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "plant-forward" },
      { key: "S", label: "Style preference", def: "vegetarian" },
    ],
    build: (v) => ({ topic: v.a, style: v.s }),
  },
  "aigen-sleep-schedule-generator": {
    title: "Sleep Schedule Generator",
    description: `Sleep schedule anchors and wind-down tips. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "weekday sleep" },
      { key: "H", label: "Target hours", def: "7.5" },
      { key: "Q", label: "Wake time", def: "07:00" },
    ],
    build: (v) => ({ topic: v.a, hours: Number(v.h) || 7.5, notes: v.q }),
  },
  "aigen-meditation-plan-generator": {
    title: "Meditation Plan Generator",
    description: `Beginner meditation minute plan. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Focus", def: "breath awareness" },
      { key: "D", label: "Days to start", def: "7" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 7 }),
  },
  "aigen-daily-routine-generator": {
    title: "Daily Routine Generator",
    description: `Day structure from morning to wind-down. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Theme", def: "focused workday" },
      { key: "H", label: "Sleep hours target", def: "7.5" },
    ],
    build: (v) => ({ topic: v.a, hours: Number(v.h) || 7.5 }),
  },
};

export const AigenHealthCalculatorHost = createAigenSectionHost({
  name: "AigenHealthCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-workout-plan-generator",
  compute: computeAigenHealth,
  idPrefix: "aigen-health",
});
