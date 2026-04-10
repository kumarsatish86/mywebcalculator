import type { CalculatorCategory } from "@/lib/types";
import { HUB_CONTENT_OVERRIDES } from "./overrides";
import {
  buildCategoryDefaults,
  buildSectionDefaults,
  buildSubcategoryDefaults,
} from "./defaults";
import type { HubContentOverride, HubPageRichContent } from "./types";

function merge(base: HubPageRichContent, override: HubContentOverride | undefined): HubPageRichContent {
  if (!override) return base;
  return {
    introParagraphs: override.introParagraphs ?? base.introParagraphs,
    secondaryHeading: override.secondaryHeading ?? base.secondaryHeading,
    bulletPoints: override.bulletPoints ?? base.bulletPoints,
    faqs: override.faqs ?? base.faqs,
    relatedLinks: override.relatedLinks ?? base.relatedLinks,
    metaDescriptionOverride: override.metaDescriptionOverride ?? base.metaDescriptionOverride,
  };
}

export function getCategoryHubContent(category: CalculatorCategory): HubPageRichContent {
  return merge(buildCategoryDefaults(category), HUB_CONTENT_OVERRIDES[category]);
}

export function getSubcategoryHubContent(
  category: CalculatorCategory,
  subSlug: string,
): HubPageRichContent {
  const key = `${category}/${subSlug}`;
  return merge(buildSubcategoryDefaults(category, subSlug), HUB_CONTENT_OVERRIDES[key]);
}

export function getSectionHubContent(
  category: CalculatorCategory,
  subSlug: string,
  sectionSlug: string,
): HubPageRichContent {
  const key = `${category}/${subSlug}/${sectionSlug}`;
  return merge(buildSectionDefaults(category, subSlug, sectionSlug), HUB_CONTENT_OVERRIDES[key]);
}
