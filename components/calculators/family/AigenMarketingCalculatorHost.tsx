"use client";

import { computeAigenMarketing, type AigenMarketingSlug } from "@/lib/calculators/aigenMarketing";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

function mktFields(topic: string, tone = "clear", audience = "buyers", goal = "get clicks") {
  return {
    fields: [
      { key: "A" as const, label: "Topic / product", def: topic },
      { key: "B" as const, label: "Tone", def: tone },
      { key: "C" as const, label: "Audience", def: audience },
      { key: "T" as const, label: "Goal", def: goal },
    ],
    build: (v: Record<string, string>) => ({
      topic: v.a,
      tone: v.b,
      audience: v.c,
      goal: v.t,
    }),
  };
}

const CONFIG: Record<AigenMarketingSlug, AigenHostConfig<AigenMarketingSlug>> = {
  "aigen-seo-title-generator": {
    title: "SEO Title Generator",
    description: `SEO title options from a topic. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("email marketing", "practical", "marketers", "rank and click"),
  },
  "aigen-meta-description-generator": {
    title: "Meta Description Generator",
    description: `Meta description drafts under ~155 chars guidance. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("project management software"),
  },
  "aigen-keyword-idea-generator": {
    title: "Keyword Idea Generator",
    description: `Primary and long-tail keyword ideas. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("home workout"),
  },
  "aigen-blog-topic-generator": {
    title: "Blog Topic Generator",
    description: `Blog topic list for a niche. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("personal finance", "helpful", "beginners", "build trust"),
  },
  "aigen-ad-copy-generator": {
    title: "Ad Copy Generator",
    description: `Headline and primary text variants. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("online course", "confident", "career switchers", "enrollments"),
  },
  "aigen-landing-page-copy-generator": {
    title: "Landing Page Copy Generator",
    description: `Landing page section copy plan. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("CRM tool", "clear", "sales teams", "start trial"),
  },
  "aigen-product-description-generator": {
    title: "Product Description Generator",
    description: `Feature-to-benefit product description. ${AIGEN_UI_DISCLAIMER}`,
    ...mktFields("noise-cancelling headphones", "premium", "commuters", "buy now"),
  },
};

export const AigenMarketingCalculatorHost = createAigenSectionHost({
  name: "AigenMarketingCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-seo-title-generator",
  compute: computeAigenMarketing,
  idPrefix: "aigen-mkt",
});
