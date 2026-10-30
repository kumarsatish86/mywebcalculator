"use client";

import { computeAigenPersonal, type AigenPersonalSlug } from "@/lib/calculators/aigenPersonal";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenPersonalSlug, AigenHostConfig<AigenPersonalSlug>> = {
  "aigen-name-generator-baby-business-domain": {
    title: "Name Generator (Baby, Business, Domain)",
    description: `Name sparks across baby, business, and domain styles. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Seed word", def: "Aria" }],
    build: (v) => ({ topic: v.a }),
  },
  "aigen-username-generator": {
    title: "Username Generator",
    description: `Handle ideas from a name seed. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Base name", def: "aurora" },
      { key: "B", label: "Tone", def: "playful" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b }),
  },
  "aigen-nickname-generator": {
    title: "Nickname Generator",
    description: `Friendly nickname ideas (use with consent). ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Name", def: "Priya" },
      { key: "B", label: "Tone", def: "friendly" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b }),
  },
  "aigen-love-compatibility-generator": {
    title: "Love Compatibility Generator",
    description: `Playful compatibility sketch — entertainment only. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Name A", def: "Alex" },
      { key: "Q", label: "Name B", def: "Sam" },
    ],
    build: (v) => ({ topic: v.a, notes: v.q }),
  },
  "aigen-wedding-plan-generator": {
    title: "Wedding Plan Generator",
    description: `High-level wedding planning outline. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Couple / theme", def: "garden wedding" },
      { key: "D", label: "Days until event", def: "180" },
      { key: "M", label: "Budget sketch (₹)", def: "800000" },
      { key: "C", label: "Guest focus", def: "family & friends" },
    ],
    build: (v) => ({
      topic: v.a,
      days: Number(v.d) || 180,
      budget: Number(v.m) || 0,
      audience: v.c,
    }),
  },
  "aigen-gift-idea-generator": {
    title: "Gift Idea Generator",
    description: `Gift ideas by budget and tone. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Recipient", def: "best friend" },
      { key: "M", label: "Budget (₹)", def: "2000" },
      { key: "B", label: "Tone", def: "thoughtful" },
      { key: "C", label: "Occasion circle", def: "friends" },
    ],
    build: (v) => ({
      topic: v.a,
      budget: Number(v.m) || 0,
      tone: v.b,
      audience: v.c,
    }),
  },
};

export const AigenPersonalCalculatorHost = createAigenSectionHost({
  name: "AigenPersonalCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-name-generator-baby-business-domain",
  compute: computeAigenPersonal,
  idPrefix: "aigen-personal",
});
