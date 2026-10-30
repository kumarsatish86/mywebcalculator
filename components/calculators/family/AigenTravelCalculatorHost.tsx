"use client";

import { computeAigenTravel, type AigenTravelSlug } from "@/lib/calculators/aigenTravel";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenTravelSlug, AigenHostConfig<AigenTravelSlug>> = {
  "aigen-travel-itinerary-generator": {
    title: "Travel Itinerary Generator",
    description: `Multi-day itinerary skeleton. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Destination", def: "Jaipur" },
      { key: "D", label: "Days", def: "5" },
      { key: "S", label: "Style", def: "balanced" },
      { key: "C", label: "Travelers", def: "couple" },
    ],
    build: (v) => ({
      topic: v.a,
      days: Number(v.d) || 5,
      style: v.s,
      audience: v.c,
    }),
  },
  "aigen-packing-list-generator": {
    title: "Packing List Generator",
    description: `Packing checklist by trip length. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Destination", def: "Goa" },
      { key: "D", label: "Days", def: "4" },
      { key: "S", label: "Style", def: "beach casual" },
    ],
    build: (v) => ({ topic: v.a, days: Number(v.d) || 4, style: v.s }),
  },
  "aigen-trip-budget-generator": {
    title: "Trip Budget Generator",
    description: `Budget split for stay, food, transit, fun. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Destination", def: "Manali" },
      { key: "M", label: "Total budget (₹)", def: "50000" },
      { key: "D", label: "Days", def: "5" },
    ],
    build: (v) => ({ topic: v.a, budget: Number(v.m) || 0, days: Number(v.d) || 5 }),
  },
  "aigen-daily-travel-plan-generator": {
    title: "Daily Travel Plan Generator",
    description: `Single-day travel pacing plan. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Destination", def: "Udaipur" },
      { key: "S", label: "Pace / style", def: "relaxed" },
      { key: "C", label: "Travelers", def: "friends" },
    ],
    build: (v) => ({ topic: v.a, style: v.s, audience: v.c }),
  },
};

export const AigenTravelCalculatorHost = createAigenSectionHost({
  name: "AigenTravelCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-travel-itinerary-generator",
  compute: computeAigenTravel,
  idPrefix: "aigen-travel",
});
