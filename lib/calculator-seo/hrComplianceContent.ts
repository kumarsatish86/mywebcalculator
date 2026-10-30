import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-compliance-legal";
const HUB_LABEL = "Business · HR & productivity · HR compliance and legal";
const SHELL =
  "Compliance teaching estimates (gratuity, notice, severance, F&F) in your browser. Not legal advice. Statutory rules and contracts govern actual payouts.";

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
        title: "Compliance tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Gratuity", "(Last × 15/26) × years"],
          ["Notice", "Shortfall × daily"],
          ["Severance", "Months × wage"],
          ["F&F", "Dues − recoveries"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves compliance inputs. Not legal advice." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-gratuity-calculator", "Gratuity", ["Illustrative Payment of Gratuity formula with teaching cap.", "Eligibility (typically ≥5 years) and wage definition are legal questions."], "What is last drawn salary?", "Usually basic + DA for gratuity teaching models — confirm with counsel.", "Gratuity Calculator — India Teaching Estimate", "Estimate gratuity with illustrative formula and cap. Not legal advice.", ["gratuity calculator"]],
  ["hr-notice-period-calculator", "Notice period", ["Estimates buyout as shortfall days × daily gross.", "Employment contract overrides this teaching model."], "Is buyout always allowed?", "No — check appointment letter and applicable law.", "Notice Period Calculator", "Estimate notice shortfall buyout.", ["notice period calculator"]],
  ["hr-severance-pay-calculator", "Severance pay", ["Monthly wage × severance months as a planning estimate.", "Retrenchment/severance statutes differ from contractual severance."], "Is this VRS?", "No — enter the month count your policy or settlement uses.", "Severance Pay Calculator", "Estimate severance from months of wage.", ["severance pay"]],
  ["hr-final-settlement-calculator", "Final settlement", ["F&F ≈ leave encash + bonus + other + illustrative gratuity − recoveries.", "Taxes and holdbacks are not fully modeled."], "When is gratuity included?", "This teaching model adds gratuity when years ≥ 5.", "Final Settlement Calculator — Full & Final", "Estimate full-and-final settlement components. Not legal advice.", ["final settlement", "full and final"]],
];

export const HR_COMPLIANCE_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
