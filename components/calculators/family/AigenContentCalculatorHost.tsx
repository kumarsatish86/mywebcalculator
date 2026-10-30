"use client";

import { computeAigenContent, type AigenContentSlug } from "@/lib/calculators/aigenContent";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

function topicToneAudience(defs?: { topic?: string; tone?: string; audience?: string }) {
  return {
    fields: [
      { key: "A" as const, label: "Topic / subject", def: defs?.topic ?? "remote work" },
      { key: "B" as const, label: "Tone", def: defs?.tone ?? "professional" },
      { key: "C" as const, label: "Audience", def: defs?.audience ?? "general readers" },
    ],
    build: (v: Record<string, string>) => ({
      topic: v.a || "your topic",
      tone: v.b || "professional",
      audience: v.c || "general readers",
    }),
  };
}

const base = topicToneAudience();

const CONFIG: Record<AigenContentSlug, AigenHostConfig<AigenContentSlug>> = {
  "aigen-paragraph-generator": {
    title: "Paragraph Generator",
    description: `Draft a short paragraph outline from topic and tone. ${AIGEN_UI_DISCLAIMER}`,
    ...base,
  },
  "aigen-essay-generator": {
    title: "Essay Generator",
    description: `Structured essay outline for teaching drafts. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "climate change", tone: "academic" }),
  },
  "aigen-story-generator": {
    title: "Story Generator",
    description: `Story skeleton with conflict and turning point. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "second chance", tone: "warm" }),
  },
  "aigen-article-generator": {
    title: "Article Generator",
    description: `Article section plan with CTA. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "personal finance basics" }),
  },
  "aigen-blog-post-generator": {
    title: "Blog Post Generator",
    description: `Blog outline with title options and FAQ. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "productivity systems", tone: "friendly" }),
  },
  "aigen-sentence-rewriter": {
    title: "Sentence Rewriter",
    description: `Rewrite variants in multiple tones. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Sentence / idea", def: "We need to improve onboarding this quarter." },
      { key: "B", label: "Target tone", def: "concise" },
      { key: "C", label: "Audience", def: "teammates" },
    ],
    build: (v) => ({ topic: v.a, tone: v.b, audience: v.c }),
  },
  "aigen-resume-bullet-generator": {
    title: "Resume Bullet Generator",
    description: `Action-led resume bullet templates. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "project management", tone: "confident", audience: "recruiters" }),
  },
  "aigen-cover-letter-generator": {
    title: "Cover Letter Generator",
    description: `Cover letter scaffold with proof points. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "product analyst role", audience: "hiring manager" }),
  },
  "aigen-sop-generator": {
    title: "SOP Generator",
    description: `Statement of purpose outline. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "data science masters", tone: "reflective", audience: "admissions" }),
  },
  "aigen-linkedin-summary-generator": {
    title: "LinkedIn Summary Generator",
    description: `LinkedIn About section draft lines. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "B2B SaaS marketing", audience: "professionals" }),
  },
  "aigen-bio-generator": {
    title: "Bio Generator",
    description: `Short, medium, and long bio drafts. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "UX design", tone: "approachable" }),
  },
  "aigen-personal-statement-generator": {
    title: "Personal Statement Generator",
    description: `Personal statement scene-to-promise plan. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "community health", tone: "sincere" }),
  },
  "aigen-linkedin-post-generator": {
    title: "LinkedIn Post Generator",
    description: `LinkedIn post structure with CTA. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "career lessons", tone: "conversational" }),
  },
  "aigen-twitter-thread-generator": {
    title: "Twitter Thread Generator",
    description: `Thread outline from hook to CTA. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "startup mistakes", tone: "direct" }),
  },
  "aigen-instagram-caption-generator": {
    title: "Instagram Caption Generator",
    description: `Caption + hashtag placeholder draft. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "morning routine", tone: "upbeat" }),
  },
  "aigen-youtube-description-generator": {
    title: "YouTube Description Generator",
    description: `Description, timestamps, and keywords plan. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "excel tips", audience: "beginners" }),
  },
  "aigen-hashtag-generator": {
    title: "Hashtag Generator",
    description: `Core, niche, and broad hashtag mix. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "home cooking", audience: "food creators" }),
  },
  "aigen-viral-hook-generator": {
    title: "Viral Hook Generator",
    description: `Curiosity and contrast hook options. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "study hacks", tone: "bold" }),
  },
  "aigen-email-reply-generator": {
    title: "Email Reply Generator",
    description: `Polite reply structure. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "project timeline", audience: "client" }),
  },
  "aigen-cold-email-generator": {
    title: "Cold Email Generator",
    description: `Cold outreach draft with soft CTA. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "design partnership", tone: "respectful", audience: "founders" }),
  },
  "aigen-follow-up-email-generator": {
    title: "Follow-up Email Generator",
    description: `Short follow-up bump template. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "proposal review", audience: "prospect" }),
  },
  "aigen-apology-email-generator": {
    title: "Apology Email Generator",
    description: `Apology email with fix and prevention. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "delayed delivery", tone: "sincere", audience: "customer" }),
  },
  "aigen-professional-email-generator": {
    title: "Professional Email Generator",
    description: `Clear professional email scaffold. ${AIGEN_UI_DISCLAIMER}`,
    ...topicToneAudience({ topic: "status update", audience: "stakeholders" }),
  },
};

export const AigenContentCalculatorHost = createAigenSectionHost({
  name: "AigenContentCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-paragraph-generator",
  compute: computeAigenContent,
  idPrefix: "aigen-content",
});
