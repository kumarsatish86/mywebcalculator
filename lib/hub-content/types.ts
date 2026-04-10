import type { CalculatorFaqItem } from "@/lib/types";

export type HubRelatedLink = {
  href: string;
  label: string;
};

/** Resolved content for category, subcategory, or section hub pages. */
export type HubPageRichContent = {
  introParagraphs: string[];
  secondaryHeading?: string;
  bulletPoints?: string[];
  faqs: CalculatorFaqItem[];
  /** Internal links shown after main content (e.g. sibling hubs, other categories). */
  relatedLinks: HubRelatedLink[];
  metaDescriptionOverride?: string;
};

/** Partial override keyed by path: `finance`, `finance/loans-emi`, or `finance/loans-emi/core-loan-calculators`. */
export type HubContentOverride = Partial<
  Pick<
    HubPageRichContent,
    | "introParagraphs"
    | "secondaryHeading"
    | "bulletPoints"
    | "faqs"
    | "relatedLinks"
    | "metaDescriptionOverride"
  >
>;
