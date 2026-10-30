import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-attrition-retention";
const HUB_LABEL = "Business · HR & productivity · Attrition and retention";
const SHELL =
  "Attrition and retention teaching metrics in your browser. Definitions vary by HRIS — align with your reporting standard.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Attrition tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Attrition / churn", "Separations ÷ avg HC"],
          ["Retention", "Retained ÷ beginning HC"],
          ["Stability index", "≥1y tenure ÷ HC year ago"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves attrition inputs." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-attrition-rate-calculator", "Attrition rate", ["Separations ÷ average headcount × 100 for a period.", "Annualize carefully if measuring a partial year."], "Include involuntary exits?", "Usually yes for overall attrition; split voluntary if needed.", "Attrition Rate Calculator", "Calculate employee attrition rate.", ["attrition rate"]],
  ["hr-employee-retention-rate-calculator", "Retention rate", ["Retained employees ÷ beginning headcount × 100.", "Complement of attrition depending on definition."], "Same period as attrition?", "Use matching start/end dates for comparability.", "Employee Retention Rate Calculator", "Measure employee retention percentage.", ["retention rate"]],
  ["hr-churn-rate-hr-calculator", "Churn rate (HR)", ["HR churn from separations over average headcount (begin/end average supported).", "Product churn metaphors do not apply directly."], "Avg HC from begin and end?", "Yes — enter both if average is unknown.", "Churn Rate Calculator (HR)", "Calculate HR workforce churn rate.", ["HR churn rate"]],
  ["hr-employee-stability-index-calculator", "Stability index", ["Share of employees with ≥1 year tenure vs headcount a year ago.", "Highlights long-tenure stability, not just exits."], "Why not current HC?", "Classic stability index uses the year-ago base.", "Employee Stability Index Calculator", "Compute workforce stability index.", ["stability index"]],
];

export const HR_ATTRITION_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
