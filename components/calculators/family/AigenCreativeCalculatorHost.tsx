"use client";

import { computeAigenCreative, type AigenCreativeSlug } from "@/lib/calculators/aigenCreative";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenCreativeSlug, AigenHostConfig<AigenCreativeSlug>> = {
  "aigen-color-palette-generator": {
    title: "Color Palette Generator",
    description: `Seeded hex palette for brand experiments. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Brand / topic", def: "fintech" },
      { key: "B", label: "Tone", def: "modern" },
      { key: "S", label: "Seed (optional)", def: "fintech" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b, seed: v.s || v.a }),
  },
  "aigen-gradient-generator": {
    title: "Gradient Generator",
    description: `CSS gradient snippets from a seed. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Brand / topic", def: "wellness app" },
      { key: "B", label: "Mood", def: "calm" },
      { key: "C", label: "Audience", def: "busy adults" },
      { key: "S", label: "Seed", def: "wellness" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b, audience: v.c, seed: v.s }),
  },
  "aigen-logo-idea-generator": {
    title: "Logo Idea Generator",
    description: `Wordmark, monogram, and symbol concepts. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Brand", def: "Northleaf" },
      { key: "B", label: "Tone", def: "minimal" },
      { key: "C", label: "Audience", def: "professionals" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b, audience: v.c }),
  },
  "aigen-brand-name-generator": {
    title: "Brand Name Generator",
    description: `Name sparks from a seed word. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Seed word", def: "pulse" }],
    build: (v) => ({ topic: v.a }),
  },
  "aigen-slogan-generator": {
    title: "Slogan Generator",
    description: `Short slogan options. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Brand / topic", def: "FocusFlow" },
      { key: "B", label: "Tone", def: "confident" },
      { key: "C", label: "Audience", def: "makers" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b, audience: v.c }),
  },
  "aigen-font-pairing-generator": {
    title: "Font Pairing Generator",
    description: `Display + body font pairing ideas. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Project", def: "blog" },
      { key: "B", label: "Tone", def: "editorial" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b }),
  },
};

export const AigenCreativeCalculatorHost = createAigenSectionHost({
  name: "AigenCreativeCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-color-palette-generator",
  compute: computeAigenCreative,
  idPrefix: "aigen-creative",
});
