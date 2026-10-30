"use client";

import { ExplainAccordion } from "@/components/results/ExplainAccordion";
import type { RichArticle } from "@/lib/calculator-seo/types";

/** Client wrapper so server pages can pass serializable article JSON. */
export function ExplainAccordionClient({ article }: { article: RichArticle | null }) {
  return <ExplainAccordion article={article} />;
}
