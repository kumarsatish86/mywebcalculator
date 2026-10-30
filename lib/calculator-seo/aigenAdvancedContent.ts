import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-advanced-hybrid";
const HUB_LABEL = "AI · Generators · Advanced hybrid roadmaps";
const SHELL =
  "Input-driven roadmap drafts in your browser. Verify every output before acting. Not financial, career, medical, or legal advice.";

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
        title: "Advanced hybrid generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Salary → financial plan", "Budget roadmap"],
          ["Goal / resume / expenses / marks", "Step plans"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves roadmap inputs. Full-plan draft — verify before acting.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-salary-to-financial-plan-generator", "Input Salary to Full Financial Plan Generator"],
  ["aigen-goal-to-roadmap-generator", "Input Goal to Step-by-Step Roadmap Generator"],
  ["aigen-resume-to-improvement-plan-generator", "Input Resume to Improvement Plan Generator"],
  ["aigen-expenses-to-savings-strategy-generator", "Input Expenses to Savings Strategy Generator"],
  ["aigen-marks-to-study-strategy-generator", "Input Marks to Study Strategy Generator"],
];

export const AIGEN_ADVANCED_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} turns a primary input into a multi-step roadmap draft you can edit.`,
        "These plans are templates for thinking — not guarantees or professional prescriptions.",
      ],
      {
        question: `Should I follow the ${title} exactly?`,
        answer:
          "Use it as a starting checklist. Adjust for your constraints and confirm with qualified humans when stakes are high.",
      },
      `${title} — AI Advanced Roadmap Draft`,
      `Build a roadmap with the ${title.toLowerCase()}. Browser draft — verify before acting.`,
      [title.toLowerCase(), "roadmap generator", "advanced plan draft"],
    ),
  ]),
);
