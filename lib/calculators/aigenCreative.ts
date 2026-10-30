/** Creative & design template generators — in-browser drafts. */
import { draftOk, hashSeed, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenCreativeSlug =
  | "aigen-color-palette-generator"
  | "aigen-gradient-generator"
  | "aigen-logo-idea-generator"
  | "aigen-brand-name-generator"
  | "aigen-slogan-generator"
  | "aigen-font-pairing-generator";

export const AIGEN_CREATIVE_SLUGS: AigenCreativeSlug[] = [
  "aigen-color-palette-generator",
  "aigen-gradient-generator",
  "aigen-logo-idea-generator",
  "aigen-brand-name-generator",
  "aigen-slogan-generator",
  "aigen-font-pairing-generator",
];

function hexFromSeed(seed: string, salt: number): string {
  const h = hashSeed(seed + ":" + salt);
  return "#" + (h & 0xffffff).toString(16).padStart(6, "0");
}

export function computeAigenCreative(slug: AigenCreativeSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "brand");
  const tone = str(input.tone, "modern");
  const audience = str(input.audience, "customers");
  const seed = str(input.seed, topic);

  switch (slug) {
    case "aigen-color-palette-generator":
      return draftOk([
        `Palette — ${topic} (${tone})`,
        `Primary: ${hexFromSeed(seed, 1)}`,
        `Secondary: ${hexFromSeed(seed, 2)}`,
        `Accent: ${hexFromSeed(seed, 3)}`,
        `Neutral: ${hexFromSeed(seed, 4)}`,
        `Surface: ${hexFromSeed(seed, 5)}`,
        "Check contrast for text accessibility before shipping.",
      ]);
    case "aigen-gradient-generator":
      return draftOk([
        `Gradient ideas — ${topic}`,
        `linear-gradient(135deg, ${hexFromSeed(seed, 1)}, ${hexFromSeed(seed, 2)})`,
        `linear-gradient(90deg, ${hexFromSeed(seed, 3)}, ${hexFromSeed(seed, 4)})`,
        `radial-gradient(circle at 30% 30%, ${hexFromSeed(seed, 5)}, ${hexFromSeed(seed, 6)})`,
        `Mood: ${tone} for ${audience}`,
      ]);
    case "aigen-logo-idea-generator":
      return draftOk([
        `Logo concepts — ${topic}`,
        `Wordmark: clean ${tone} lettering of the brand name`,
        "Monogram: 2–3 letter mark in a simple geometric frame",
        `Symbol: abstract shape hinting at ${topic}`,
        "Badge: circular seal for packaging / favicon",
        `Audience cue: appeal to ${audience} without clutter`,
      ]);
    case "aigen-brand-name-generator": {
      const base = topic.replace(/\s+/g, "");
      return draftOk([
        `Brand name sparks — ${topic}`,
        `${base}ly`,
        `${base}Hub`,
        `Get${base}`,
        `${base.slice(0, 4)}ora`,
        `Nova${base.slice(0, 3)}`,
        "Check domain + trademark before committing.",
      ]);
    }
    case "aigen-slogan-generator":
      return draftOk([
        `Slogan options — ${topic}`,
        `${topic}: made simple.`,
        `Built for ${audience}.`,
        `Less noise. More ${topic}.`,
        `Start smarter with ${topic}.`,
        `Tone: ${tone}`,
      ]);
    case "aigen-font-pairing-generator":
      return draftOk([
        `Font pairings — ${topic} (${tone})`,
        "Display + Body: Playfair Display + Source Sans 3",
        "Modern: Space Grotesk + Inter tight alternative → IBM Plex Sans",
        "Friendly: Fraunces + Nunito Sans",
        "Tech: JetBrains Mono (UI accents) + IBM Plex Sans",
        "Rule: one display, one text; limit weights.",
      ]);
    default:
      return { ok: false, error: "Unknown creative generator." };
  }
}
