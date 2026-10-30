import { getCalculator, CALCULATOR_REGISTRY } from "@/lib/registry";
import { INTENT_CATALOG, type IntentId } from "./intentCatalog";

export type SearchSuggestion = {
  slug: string;
  title: string;
  reason: string;
  intentId?: IntentId;
  journeyId?: string;
  score: number;
};

function normalize(q: string): string {
  return q
    .toLowerCase()
    .replace(/[₹$,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(q: string): string[] {
  return normalize(q)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}

/** Score registry entry against query tokens. */
function registryScore(tokens: string[], title: string, slug: string, keywords: string[]): number {
  const hay = `${title} ${slug.replace(/-/g, " ")} ${keywords.join(" ")}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (hay.includes(t)) score += t.length >= 4 ? 3 : 2;
    if (slug.includes(t)) score += 2;
  }
  return score;
}

/**
 * Natural-language matcher: intents + registry keyword overlap.
 * Pure in-memory — no LLM / external search.
 */
export function matchIntent(query: string, limit = 12): SearchSuggestion[] {
  const q = normalize(query);
  if (!q) return [];

  const tokens = tokenize(q);
  const bySlug = new Map<string, SearchSuggestion>();

  const bump = (s: SearchSuggestion) => {
    const prev = bySlug.get(s.slug);
    if (!prev || s.score > prev.score) bySlug.set(s.slug, s);
  };

  for (const intent of INTENT_CATALOG) {
    let intentHit = 0;
    for (const phrase of intent.phrases) {
      if (q.includes(phrase)) intentHit += phrase.split(/\s+/).length >= 2 ? 14 : 8;
    }
    for (const t of tokens) {
      for (const phrase of intent.phrases) {
        if (phrase.includes(t) || t.includes(phrase.split(" ")[0]!)) intentHit += 2;
      }
    }
    if (intentHit <= 0) continue;

    intent.slugs.forEach((slug, i) => {
      const def = getCalculator(slug);
      if (!def) return;
      bump({
        slug,
        title: def.shortTitle || def.title,
        reason: intent.reason,
        intentId: intent.id,
        journeyId: intent.journeyId,
        score: intentHit + (intent.slugs.length - i) * 0.5,
      });
    });
  }

  for (const def of CALCULATOR_REGISTRY) {
    const score = registryScore(tokens, def.title, def.slug, def.keywords);
    if (score < 4) continue;
    bump({
      slug: def.slug,
      title: def.shortTitle || def.title,
      reason: `Matches “${def.title}”.`,
      score,
    });
  }

  return [...bySlug.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}
