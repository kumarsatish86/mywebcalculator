/** Content & writing template generators — in-browser drafts, not live LLMs. */
import { draftOk, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenContentSlug =
  | "aigen-paragraph-generator"
  | "aigen-essay-generator"
  | "aigen-story-generator"
  | "aigen-article-generator"
  | "aigen-blog-post-generator"
  | "aigen-sentence-rewriter"
  | "aigen-resume-bullet-generator"
  | "aigen-cover-letter-generator"
  | "aigen-sop-generator"
  | "aigen-linkedin-summary-generator"
  | "aigen-bio-generator"
  | "aigen-personal-statement-generator"
  | "aigen-linkedin-post-generator"
  | "aigen-twitter-thread-generator"
  | "aigen-instagram-caption-generator"
  | "aigen-youtube-description-generator"
  | "aigen-hashtag-generator"
  | "aigen-viral-hook-generator"
  | "aigen-email-reply-generator"
  | "aigen-cold-email-generator"
  | "aigen-follow-up-email-generator"
  | "aigen-apology-email-generator"
  | "aigen-professional-email-generator";

export const AIGEN_CONTENT_SLUGS: AigenContentSlug[] = [
  "aigen-paragraph-generator",
  "aigen-essay-generator",
  "aigen-story-generator",
  "aigen-article-generator",
  "aigen-blog-post-generator",
  "aigen-sentence-rewriter",
  "aigen-resume-bullet-generator",
  "aigen-cover-letter-generator",
  "aigen-sop-generator",
  "aigen-linkedin-summary-generator",
  "aigen-bio-generator",
  "aigen-personal-statement-generator",
  "aigen-linkedin-post-generator",
  "aigen-twitter-thread-generator",
  "aigen-instagram-caption-generator",
  "aigen-youtube-description-generator",
  "aigen-hashtag-generator",
  "aigen-viral-hook-generator",
  "aigen-email-reply-generator",
  "aigen-cold-email-generator",
  "aigen-follow-up-email-generator",
  "aigen-apology-email-generator",
  "aigen-professional-email-generator",
];

export function computeAigenContent(slug: AigenContentSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your topic");
  const tone = str(input.tone, "professional");
  const audience = str(input.audience, "general readers");
  const notes = str(input.notes, "");

  switch (slug) {
    case "aigen-paragraph-generator":
      return draftOk([
        `Topic: ${topic}`,
        `Tone: ${tone} · Audience: ${audience}`,
        "",
        `Opening: Introduce ${topic} with a clear claim that matters to ${audience}.`,
        `Context: Add 1–2 supporting facts or examples in a ${tone} voice.`,
        `Close: End with a takeaway or gentle call to reflect on ${topic}.`,
        notes ? `Note to weave in: ${notes}` : "",
      ]);
    case "aigen-essay-generator":
      return draftOk([
        `Essay outline — ${topic}`,
        `Tone: ${tone} · Audience: ${audience}`,
        `1. Thesis: State your central argument about ${topic}.`,
        "2. Background: Define key terms and why the question matters.",
        "3. Body A: First supporting point with evidence.",
        "4. Body B: Counterpoint or second pillar.",
        "5. Body C: Application or case study.",
        "6. Conclusion: Restate thesis and leave a forward-looking thought.",
      ]);
    case "aigen-story-generator":
      return draftOk([
        `Story skeleton — ${topic}`,
        `Tone: ${tone}`,
        `Hook: Open in the middle of a moment tied to ${topic}.`,
        `Protagonist: Someone your audience (${audience}) can root for.`,
        `Conflict: An obstacle that tests a belief about ${topic}.`,
        "Turning point: A choice that changes the stakes.",
        "Resolution: Show growth without over-explaining.",
        "Theme line: One sentence that captures the story's meaning.",
      ]);
    case "aigen-article-generator":
      return draftOk([
        `Article draft plan — ${topic}`,
        `Voice: ${tone} · Reader: ${audience}`,
        `H1: Working title about ${topic}.`,
        "Lead: 2–3 sentences answering why this matters now.",
        "Section 1: Problem / opportunity.",
        "Section 2: How-to or framework.",
        "Section 3: Mistakes to avoid.",
        "Section 4: Checklist or next steps.",
        "CTA: Invite readers to try one action today.",
      ]);
    case "aigen-blog-post-generator":
      return draftOk([
        `Blog post outline — ${topic}`,
        `Tone: ${tone}`,
        `Title options: How to approach ${topic} / A practical guide to ${topic}`,
        `Intro hook for ${audience}.`,
        "Key takeaways (3 bullets).",
        "Deep dive section with examples.",
        "FAQ block (2–3 questions).",
        "Soft CTA + related reading.",
      ]);
    case "aigen-sentence-rewriter":
      return draftOk([
        `Rewrite variants — ${topic}`,
        `Target tone: ${tone}`,
        "Clear: Restate the idea in plain language.",
        "Concise: Cut filler; keep one strong verb.",
        `Formal: Elevate diction for ${audience}.`,
        "Friendly: Soften edges while keeping meaning.",
        "Punchy: Lead with the payoff, then the context.",
      ]);
    case "aigen-resume-bullet-generator":
      return draftOk([
        `Resume bullets — ${topic}`,
        `Tone: ${tone}`,
        `• Led initiatives related to ${topic} that improved a measurable outcome.`,
        `• Collaborated with cross-functional partners to deliver ${topic} on time.`,
        `• Built a repeatable process for ${topic}, reducing rework.`,
        "• Quantified impact: replace X% / N units with your real metrics.",
        `• Mentored peers on best practices around ${topic}.`,
      ]);
    case "aigen-cover-letter-generator":
      return draftOk([
        `Cover letter scaffold — ${topic}`,
        `Tone: ${tone} · Reader: ${audience}`,
        "Greeting: Address the hiring manager / team.",
        `Hook: Why this role + ${topic} excite you.`,
        "Proof 1: Relevant win with a metric.",
        "Proof 2: Skill that maps to the job description.",
        "Close: Availability + polite call to connect.",
      ]);
    case "aigen-sop-generator":
      return draftOk([
        `Statement of purpose outline — ${topic}`,
        `Tone: ${tone}`,
        `1. Origin story: When interest in ${topic} began.`,
        "2. Academic / work prep that built readiness.",
        "3. Why this program / organization.",
        `4. Goals for ${audience} impact after the program.`,
        "5. Closing: Fit + contribution you hope to make.",
      ]);
    case "aigen-linkedin-summary-generator":
      return draftOk([
        `LinkedIn About draft — ${topic}`,
        `Tone: ${tone}`,
        `Line 1: Who you help and with what (${topic}).`,
        "Line 2: Signature approach or niche.",
        "Line 3: Proof points (roles, domains, outcomes).",
        "Line 4: What you are exploring next.",
        `Line 5: Soft CTA for ${audience}.`,
      ]);
    case "aigen-bio-generator":
      return draftOk([
        `Bio drafts — ${topic}`,
        `Tone: ${tone} · Audience: ${audience}`,
        `Short (1 line): Specialist in ${topic}.`,
        "Medium: Add background + one notable win.",
        "Long: Add values, current focus, and how to reach you.",
        `Speaker bio: Emphasize talks / community related to ${topic}.`,
      ]);
    case "aigen-personal-statement-generator":
      return draftOk([
        `Personal statement plan — ${topic}`,
        `Tone: ${tone}`,
        "Scene: A concrete moment that reveals your motivation.",
        `Insight: What you learned about ${topic}.`,
        "Growth: Skills and character built since.",
        `Fit: How the next step serves ${audience}.`,
        "Promise: What you will contribute.",
      ]);
    case "aigen-linkedin-post-generator":
      return draftOk([
        `LinkedIn post draft — ${topic}`,
        `Tone: ${tone}`,
        `Hook line about ${topic}.`,
        "Story or observation (3–5 short lines).",
        `Lesson for ${audience}.`,
        "Bullet takeaways (3).",
        "Question CTA to spark comments.",
      ]);
    case "aigen-twitter-thread-generator":
      return draftOk([
        `Thread outline — ${topic}`,
        `Tone: ${tone}`,
        `1/ Hook: Bold claim about ${topic}.`,
        "2/ Context: Why it matters now.",
        "3–5/ Steps, myths, or examples.",
        "6/ Common mistake.",
        `7/ Summary + CTA for ${audience}.`,
      ]);
    case "aigen-instagram-caption-generator":
      return draftOk([
        `Instagram caption — ${topic}`,
        `Tone: ${tone}`,
        `Hook first line on ${topic}.`,
        `2–3 lines of story or tip for ${audience}.`,
        "Value line: one clear takeaway.",
        "CTA: Save / share / comment prompt.",
        "Hashtag cluster placeholder (5–8).",
      ]);
    case "aigen-youtube-description-generator":
      return draftOk([
        `YouTube description — ${topic}`,
        `Tone: ${tone}`,
        `First 2 lines: what viewers learn about ${topic}.`,
        "Timestamps: 0:00 Intro · 1:00 Core · Mid: Examples · End: Recap",
        "Resources / links block.",
        `Who this is for: ${audience}.`,
        `Keywords: ${topic} related phrases.`,
      ]);
    case "aigen-hashtag-generator":
      return draftOk([
        `Hashtag ideas — ${topic}`,
        `Core: #${topic.replace(/\s+/g, "")}`,
        `Audience: tags that ${audience} already follow.`,
        `Niche: 3 long-tail tags around ${topic}.`,
        "Broad: 2 category tags for discovery.",
        "Brand: 1 campaign or series tag.",
        "Mix tip: 5–10 total; avoid stuffing.",
      ]);
    case "aigen-viral-hook-generator":
      return draftOk([
        `Hook options — ${topic}`,
        `Tone: ${tone}`,
        `Curiosity: Most people get ${topic} wrong — here's the fix.`,
        `Contrast: Stop doing X; try this for ${topic}.`,
        `Number: 3 moves that change how ${audience} see ${topic}.`,
        `Story: I almost quit ${topic} until this happened.`,
        `Challenge: Can you explain ${topic} in one sentence?`,
      ]);
    case "aigen-email-reply-generator":
      return draftOk([
        `Email reply draft — ${topic}`,
        `Tone: ${tone}`,
        `Thanks for reaching out about ${topic}.`,
        "Acknowledge their point in one sentence.",
        "Answer / next step clearly.",
        "Offer help or a deadline.",
        `Polite close for ${audience}.`,
      ]);
    case "aigen-cold-email-generator":
      return draftOk([
        `Cold email draft — ${topic}`,
        `Tone: ${tone}`,
        `Subject: Short benefit about ${topic}.`,
        "Line 1: Personalized observation.",
        "Line 2: Relevant credibility.",
        "Line 3: Specific ask (15-min call / resource).",
        `PS: Soft value for ${audience}.`,
      ]);
    case "aigen-follow-up-email-generator":
      return draftOk([
        `Follow-up email — ${topic}`,
        `Tone: ${tone}`,
        `Bump: Circling back on ${topic}.`,
        "Add one new data point or resource.",
        "Restate the ask in one line.",
        "Offer an easy out if timing is off.",
      ]);
    case "aigen-apology-email-generator":
      return draftOk([
        `Apology email — ${topic}`,
        `Tone: ${tone}`,
        `Own the issue related to ${topic} without excuses.`,
        `State impact on ${audience}.`,
        "Fix: what you are doing now.",
        "Prevention: what changes going forward.",
        "Close with respect and an open door.",
      ]);
    case "aigen-professional-email-generator":
      return draftOk([
        `Professional email — ${topic}`,
        `Tone: ${tone}`,
        `Subject: Clear purpose about ${topic}.`,
        "Context in 1–2 sentences.",
        "Request / decision needed.",
        "Attachments / links checklist.",
        `Thanks + sign-off for ${audience}.`,
      ]);
    default:
      return { ok: false, error: "Unknown content generator." };
  }
}
