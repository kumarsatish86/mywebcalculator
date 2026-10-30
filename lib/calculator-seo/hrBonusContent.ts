import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-performance-bonus";
const HUB_LABEL = "Business · HR & productivity · Performance and bonus";
const SHELL =
  "Bonus and incentive teaching estimates in your browser. Not compensation legal advice. Plans and statutory bonus rules vary.";

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
        title: "Bonus tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Bonus", "Base × %"],
          ["Incentive", "Target × achievement"],
          ["Commission", "Sales × rate"],
          ["Sales incentive", "Tiered rates"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves bonus inputs." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-bonus-calculator", "Bonus", ["Bonus ≈ base × percentage (teaching default often 8.33%).", "Payment of Bonus Act ceilings are not fully modeled."], "Is 8.33% statutory?", "It is a common teaching annualized monthly figure — verify applicability.", "Bonus Calculator", "Estimate bonus from base and percentage.", ["bonus calculator"]],
  ["hr-incentive-calculator", "Incentive", ["Target incentive × achievement% × multiplier.", "Caps and thresholds belong in plan documents."], "What is the multiplier?", "Accelerators/decays in the plan (e.g. 1.1× above goal).", "Incentive Calculator", "Calculate incentive payout from achievement.", ["incentive calculator"]],
  ["hr-commission-calculator", "Commission", ["Flat commission = sales × rate %.", "Draws against commission are not subtracted here."], "Gross or net sales?", "Use the sales base your plan defines.", "Commission Calculator", "Calculate sales commission.", ["commission calculator"]],
  ["hr-sales-incentive-calculator", "Sales incentive", ["Sums two commission tiers for simple accelerators.", "More complex cliffs need spreadsheet modeling."], "How to model a cliff?", "Put amounts above threshold into tier 2 sales.", "Sales Incentive Calculator — Tiered", "Estimate tiered sales incentive pay.", ["sales incentive"]],
];

export const HR_BONUS_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
