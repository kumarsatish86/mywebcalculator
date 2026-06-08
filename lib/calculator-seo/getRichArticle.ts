import { FAMILY_SLUG_SETS, getCalculator } from "@/lib/registry";
import { composeRichArticle, verticalForDefinition } from "./composeArticle";
import { ADVANCED_EMI_ARTICLES } from "./advancedEmiContent";
import { LOAN_COMPARISON_ARTICLES } from "./loanComparisonContent";
import { CREDIT_DEBT_ARTICLES } from "./creditDebtContent";
import type { RichArticle } from "./types";

const HAND_CRAFTED_ARTICLES: Record<string, RichArticle> = {
  ...ADVANCED_EMI_ARTICLES,
  ...LOAN_COMPARISON_ARTICLES,
  ...CREDIT_DEBT_ARTICLES,
};

export function isBulkFamilySlug(slug: string): boolean {
  return (
    FAMILY_SLUG_SETS.electrical.has(slug) ||
    FAMILY_SLUG_SETS.healthBody.has(slug) ||
    FAMILY_SLUG_SETS.educationMathPlanned.has(slug) ||
    FAMILY_SLUG_SETS.financeLoanType.has(slug) ||
    FAMILY_SLUG_SETS.financeAdvancedPayment.has(slug) ||
    FAMILY_SLUG_SETS.financeLoanComparison.has(slug) ||
    FAMILY_SLUG_SETS.financeCreditDebt.has(slug)
  );
}

/** All calculator slugs that receive the rich article layer (union of bulk families). */
export function allBulkFamilySlugs(): string[] {
  const out = new Set<string>();
  for (const s of FAMILY_SLUG_SETS.electrical) out.add(s);
  for (const s of FAMILY_SLUG_SETS.healthBody) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationMathPlanned) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeLoanType) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeAdvancedPayment) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeLoanComparison) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeCreditDebt) out.add(s);
  return [...out].sort();
}

export function getRichArticle(slug: string): RichArticle | null {
  // Hand-crafted override content takes precedence over generic composition
  if (slug in HAND_CRAFTED_ARTICLES) return HAND_CRAFTED_ARTICLES[slug];
  if (!isBulkFamilySlug(slug)) return null;
  const def = getCalculator(slug);
  if (!def) return null;
  const vertical = verticalForDefinition(def);
  if (!vertical) return null;
  return composeRichArticle(def, vertical);
}
