import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-finance-money";
const HUB_LABEL = "AI · Generators · Finance and money";
const SHELL =
  "In-browser finance plan drafts with light math. Not financial, tax, or investment advice. Verify with statements and qualified advisors.";

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
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Finance generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Budget / expenses / savings", "Plan text + light splits"],
          ["Loan / EMI / debt", "Repayment teaching drafts"],
          ["Invest / retirement / passive", "Allocation sketches"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves money inputs. Planning draft only — rates and products vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-budget-planner-generator", "Budget Planner Generator"],
  ["aigen-expense-breakdown-generator", "Expense Breakdown Generator"],
  ["aigen-savings-plan-generator", "Savings Plan Generator"],
  ["aigen-loan-repayment-plan-generator", "Loan Repayment Plan Generator"],
  ["aigen-debt-payoff-strategy-generator", "Debt Payoff Strategy Generator"],
  ["aigen-investment-portfolio-generator", "Investment Portfolio Generator"],
  ["aigen-retirement-plan-generator", "Retirement Plan Generator"],
  ["aigen-emi-breakdown-generator", "EMI Breakdown Generator"],
  ["aigen-passive-income-plan-generator", "Passive Income Plan Generator"],
];

export const AIGEN_FINANCE_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} turns your amounts and rates into a short finance plan draft in the browser.`,
        "Figures are teaching estimates. Products, taxes, and personal circumstances differ — verify before acting.",
      ],
      {
        question: `Is the ${title} financial advice?`,
        answer:
          "No. It produces an illustrative plan draft from your inputs. Consult a qualified advisor for decisions.",
      },
      `${title} — AI Finance Plan Draft`,
      `Draft a ${title.toLowerCase()} plan from your inputs. Browser teaching aid — not financial advice.`,
      [title.toLowerCase(), "budget plan generator", "finance draft"],
    ),
  ]),
);
