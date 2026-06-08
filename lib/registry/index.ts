import type { CalculatorCategory, CalculatorDefinition } from "../types";
import { buildBulkRegistryEntries, bulkSlugSets } from "./bulkFromHubs";
import { existingRegistryEntries } from "./existingEntries";

const existingSlugs = new Set(existingRegistryEntries.map((c) => c.slug));

/** Slugs handled by family routers / SEO hosts (bulk rollout). */
export const FAMILY_SLUG_SETS = bulkSlugSets(existingSlugs);

export const CALCULATOR_REGISTRY: CalculatorDefinition[] = [
  ...existingRegistryEntries,
  ...buildBulkRegistryEntries(existingSlugs),
];

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return CALCULATOR_REGISTRY.find((c) => c.slug === slug);
}

export function getByCategory(category: CalculatorCategory): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter((c) => c.category === category);
}

export function getBySubcategory(
  category: CalculatorCategory,
  subCategorySlug: string,
): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter(
    (c) => c.category === category && c.subCategorySlug === subCategorySlug,
  );
}

export function getFeaturedSlugs(): string[] {
  return ["weighted-gpa", "loan-payment", "compound-interest", "days-between"];
}
