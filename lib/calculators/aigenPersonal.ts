/** Personal life template generators — in-browser drafts. */
import { draftOk, hashSeed, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenPersonalSlug =
  | "aigen-name-generator-baby-business-domain"
  | "aigen-username-generator"
  | "aigen-nickname-generator"
  | "aigen-love-compatibility-generator"
  | "aigen-wedding-plan-generator"
  | "aigen-gift-idea-generator";

export const AIGEN_PERSONAL_SLUGS: AigenPersonalSlug[] = [
  "aigen-name-generator-baby-business-domain",
  "aigen-username-generator",
  "aigen-nickname-generator",
  "aigen-love-compatibility-generator",
  "aigen-wedding-plan-generator",
  "aigen-gift-idea-generator",
];

export function computeAigenPersonal(slug: AigenPersonalSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "Alex");
  const tone = str(input.tone, "friendly");
  const audience = str(input.audience, "friends");
  const budget = numOr(input.budget, 2000);
  const days = Math.max(1, Math.round(numOr(input.days, 180)));
  const other = str(input.notes, "Sam");

  switch (slug) {
    case "aigen-name-generator-baby-business-domain": {
      const base = topic.replace(/\s+/g, "");
      return draftOk([
        `Name ideas — seed "${topic}"`,
        `Baby-style: ${base}a, ${base}en, Mira${base.slice(0, 2)}`,
        `Business-style: ${base} Labs, ${base} Co, North${base}`,
        `Domain-ish: get${base.toLowerCase()}.com, ${base.toLowerCase()}hq.app`,
        "Always check availability + cultural fit before using.",
      ]);
    }
    case "aigen-username-generator": {
      const n = (hashSeed(topic) % 9000) + 1000;
      const base = topic.replace(/\s+/g, "").toLowerCase();
      return draftOk([
        `Username ideas — ${topic}`,
        `${base}${n}`,
        `${base}_hq`,
        `the${base}`,
        `${base}.daily`,
        `${tone.slice(0, 3)}${base}`,
        "Avoid personal data (DOB, address) in public handles.",
      ]);
    }
    case "aigen-nickname-generator":
      return draftOk([
        `Nickname ideas — ${topic}`,
        `${topic.slice(0, 3)}y`,
        `Lil ${topic}`,
        `${topic}ster`,
        tone === "formal" ? `${topic}` : `${topic}oo`,
        "Use only with consent — nicknames can feel personal.",
      ]);
    case "aigen-love-compatibility-generator": {
      const score = ((hashSeed(topic + "|" + other) % 41) + 55);
      return draftOk(
        [
          `Compatibility sketch — ${topic} & ${other}`,
          `Playful score: ${score}/100 (entertainment only)`,
          "Shared strengths: communication prompts + curiosity",
          "Watch-outs: assumptions; schedule weekly check-ins",
          "Idea date: cook together / walk-and-talk",
          "Not psychology or relationship advice",
        ],
        { score, primary: score },
      );
    }
    case "aigen-wedding-plan-generator":
      return draftOk([
        `Wedding planning outline — ${topic}`,
        `Horizon: ~${days} days · Budget sketch: ₹${budget.toLocaleString("en-IN")}`,
        "Lock date + guest count estimate",
        "Venue → catering → outfits → invites",
        "Vendors: photo, decor, music",
        `Guest experience focus for ${audience}`,
        "Buffers: weather plan + payment schedule",
      ]);
    case "aigen-gift-idea-generator":
      return draftOk([
        `Gift ideas — for ${topic}`,
        `Budget ~₹${budget.toLocaleString("en-IN")} · Tone: ${tone}`,
        "Experience: class, tickets, or picnic kit",
        "Useful: something they mentioned twice",
        "Personal: custom note + small keepsake",
        `Shared with ${audience}: group gift option`,
        "When unsure: consumable + handwritten card",
      ]);
    default:
      return { ok: false, error: "Unknown personal generator." };
  }
}
