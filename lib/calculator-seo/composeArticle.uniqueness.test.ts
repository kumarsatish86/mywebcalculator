import { describe, expect, it } from "vitest";
import { composeRichArticle, flattenRichArticleText, verticalForDefinition } from "./composeArticle";
import { allBulkFamilySlugs } from "./getRichArticle";
import { getCalculator } from "@/lib/registry";

describe("bulk family rich articles uniqueness", () => {
  it("every bulk slug resolves to a calculator definition", () => {
    for (const slug of allBulkFamilySlugs()) {
      expect(getCalculator(slug), slug).toBeDefined();
    }
  });

  it("composes an article for every bulk slug", () => {
    for (const slug of allBulkFamilySlugs()) {
      const def = getCalculator(slug)!;
      const v = verticalForDefinition(def);
      expect(v, slug).toBeTruthy();
      const art = composeRichArticle(def, v!);
      expect(art.slug).toBe(slug);
      expect(art.sections.length).toBeGreaterThan(0);
      expect(art.faq.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("assigns a unique full-text fingerprint to every bulk slug", () => {
    const seen = new Set<string>();
    for (const slug of allBulkFamilySlugs()) {
      const def = getCalculator(slug)!;
      const v = verticalForDefinition(def)!;
      const flat = flattenRichArticleText(composeRichArticle(def, v));
      expect(seen.has(flat), slug).toBe(false);
      seen.add(flat);
    }
  });

  it("uses distinct flattened bodies for consecutive hub slugs (hash-sensitive)", () => {
    const slugs = allBulkFamilySlugs().slice(0, 200);
    for (let i = 0; i < slugs.length - 1; i++) {
      const a = getCalculator(slugs[i]!)!;
      const b = getCalculator(slugs[i + 1]!)!;
      const va = verticalForDefinition(a)!;
      const vb = verticalForDefinition(b)!;
      const ta = flattenRichArticleText(composeRichArticle(a, va));
      const tb = flattenRichArticleText(composeRichArticle(b, vb));
      expect(ta === tb, `${slugs[i]} vs ${slugs[i + 1]}`).toBe(false);
    }
  });
});
