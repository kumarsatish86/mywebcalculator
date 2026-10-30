import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-smart-hybrid";
const HUB_LABEL = "AI · Generators · AI smart hybrid";
const SHELL =
  "Heuristic scores and hybrid plan drafts in your browser. Not live AI advice for careers, investing, or productivity. Verify before acting.";

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
        title: "Smart hybrid generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Career / skills / resume", "Scored path drafts"],
          ["Invest / budget", "Allocation sketches"],
          ["Learning / productivity", "Heuristic analyzers"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves scores and goals. Heuristic draft — not professional advice.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-ai-career-path-generator", "AI Career Path Generator"],
  ["aigen-ai-skill-gap-analyzer", "AI Skill Gap Analyzer"],
  ["aigen-ai-resume-score-calculator", "AI Resume Score Calculator"],
  ["aigen-ai-investment-advisor", "AI Investment Advisor"],
  ["aigen-ai-budget-optimizer", "AI Budget Optimizer"],
  ["aigen-ai-learning-path-generator", "AI Learning Path Generator"],
  ["aigen-ai-productivity-analyzer", "AI Productivity Analyzer"],
];

export const AIGEN_SMART_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} blends a simple numeric score with a short action outline from your inputs.`,
        "Scores are teaching heuristics, not predictions or certified advice.",
      ],
      {
        question: `How accurate is the ${title}?`,
        answer:
          "It applies simple rules to your inputs for planning inspiration. Real outcomes depend on many factors outside this tool.",
      },
      `${title} — AI Smart Hybrid Draft`,
      `Run the ${title.toLowerCase()} in your browser. Heuristic draft — not professional advice.`,
      [title.toLowerCase(), "ai score calculator", "hybrid plan draft"],
    ),
  ]),
);
