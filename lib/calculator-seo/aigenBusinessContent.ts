import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-business-productivity";
const HUB_LABEL = "AI · Generators · Business and productivity";
const SHELL =
  "In-browser business plan and planner drafts. Not legal, accounting, or investment advice. Verify before acting.";

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
        title: "Business generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Business / startup / pitch", "Venture shells"],
          ["SWOT / goals / habits", "Strategy scaffolds"],
          ["Daily / weekly / to-do", "Planner drafts"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves venture inputs. Planning draft only — markets and ops vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-business-plan-generator", "Business Plan Generator"],
  ["aigen-startup-idea-generator", "Startup Idea Generator"],
  ["aigen-pitch-deck-content-generator", "Pitch Deck Content Generator"],
  ["aigen-swot-analysis-generator", "SWOT Analysis Generator"],
  ["aigen-daily-planner-generator", "Daily Planner Generator"],
  ["aigen-weekly-planner-generator", "Weekly Planner Generator"],
  ["aigen-goal-breakdown-generator", "Goal Breakdown Generator"],
  ["aigen-habit-tracker-generator", "Habit Tracker Generator"],
  ["aigen-to-do-list-generator", "To-Do List Generator"],
];

export const AIGEN_BUSINESS_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} builds a structured productivity or venture draft from your topic and goals.`,
        "Use it as a starting checklist. Validate assumptions with customers and real numbers.",
      ],
      {
        question: `What is the ${title} for?`,
        answer:
          "It outputs a short plan outline for inspiration and teaching. It is not professional business advice.",
      },
      `${title} — AI Business Draft Template`,
      `Draft a ${title.toLowerCase()} outline in your browser. Teaching aid — verify before use.`,
      [title.toLowerCase(), "business plan generator", "productivity draft"],
    ),
  ]),
);
