/** Marketing & SEO template generators — in-browser drafts. */
import { draftOk, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenMarketingSlug =
  | "aigen-seo-title-generator"
  | "aigen-meta-description-generator"
  | "aigen-keyword-idea-generator"
  | "aigen-blog-topic-generator"
  | "aigen-ad-copy-generator"
  | "aigen-landing-page-copy-generator"
  | "aigen-product-description-generator";

export const AIGEN_MARKETING_SLUGS: AigenMarketingSlug[] = [
  "aigen-seo-title-generator",
  "aigen-meta-description-generator",
  "aigen-keyword-idea-generator",
  "aigen-blog-topic-generator",
  "aigen-ad-copy-generator",
  "aigen-landing-page-copy-generator",
  "aigen-product-description-generator",
];

export function computeAigenMarketing(slug: AigenMarketingSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your product");
  const tone = str(input.tone, "clear and confident");
  const audience = str(input.audience, "buyers");
  const goal = str(input.goal, "get more qualified clicks");

  switch (slug) {
    case "aigen-seo-title-generator":
      return draftOk([
        `SEO title ideas — ${topic}`,
        `${topic}: A Practical Guide for ${audience}`,
        `How to ${topic} Without the Usual Mistakes`,
        `${topic} Checklist (Updated)`,
        `Best Ways to Approach ${topic} in 2026`,
        `${topic} vs Alternatives: What ${audience} Should Know`,
        `Tone target: ${tone}`,
      ]);
    case "aigen-meta-description-generator":
      return draftOk([
        `Meta description drafts — ${topic}`,
        `Learn ${topic} with a clear, ${tone} overview for ${audience}. Includes steps, tips, and common pitfalls.`,
        `Discover how ${topic} works — practical guidance to help ${audience} ${goal}.`,
        `Keep under ~155 characters when you finalize; include primary keyword once.`,
      ]);
    case "aigen-keyword-idea-generator":
      return draftOk([
        `Keyword ideas — ${topic}`,
        `Primary: ${topic}`,
        `Intent: how to ${topic}`,
        `Intent: best ${topic} for ${audience}`,
        `Intent: ${topic} examples`,
        `Intent: ${topic} vs [competitor idea]`,
        `Long-tail: ${topic} checklist / template / mistakes`,
        `Map each to a page or section.`,
      ]);
    case "aigen-blog-topic-generator":
      return draftOk([
        `Blog topics — ${topic}`,
        `1. Beginner mistakes with ${topic}`,
        `2. Step-by-step ${topic} workflow`,
        `3. Case study: ${audience} results`,
        `4. Tools & templates for ${topic}`,
        `5. Myths about ${topic} worth dropping`,
        `6. FAQ roundup answering ${goal}`,
      ]);
    case "aigen-ad-copy-generator":
      return draftOk([
        `Ad copy variants — ${topic}`,
        `Tone: ${tone}`,
        `Headline: Get better at ${topic} — starting today`,
        `Headline: Built for ${audience} who want ${goal}`,
        `Primary text: Short problem → proof → CTA`,
        "CTA ideas: Try free · See how · Get the guide",
        "Test 2 headlines × 2 bodies",
      ]);
    case "aigen-landing-page-copy-generator":
      return draftOk([
        `Landing page copy — ${topic}`,
        `Hero: ${topic} for ${audience} who need ${goal}`,
        "Subhead: One clear benefit sentence",
        "Bullets: 3 outcomes",
        "Social proof placeholder",
        "How it works (3 steps)",
        `CTA: ${tone} invite to start`,
        "Objection FAQ (2–3)",
      ]);
    case "aigen-product-description-generator":
      return draftOk([
        `Product description — ${topic}`,
        `For: ${audience}`,
        `Hook: What ${topic} helps them achieve`,
        "Features → benefits (3 pairs)",
        "Who it's for / not for",
        "Specs / what's included",
        `Close: CTA aligned to ${goal}`,
      ]);
    default:
      return { ok: false, error: "Unknown marketing generator." };
  }
}
