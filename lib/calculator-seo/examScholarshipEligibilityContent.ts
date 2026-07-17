import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-scholarship-eligibility";
const HUB_LABEL = "Education · Scholarship & Eligibility";
const SHELL =
  "Runs in your browser. Illustrative eligibility maths—not official scheme rules. Confirm income caps, merit lists, and subject requirements with the issuing body.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Eligibility tools",
        columnHeaders: ["Calculator", "Checks"],
        rows: [
          ["Scholarship", "Score % + income cap"],
          ["Merit", "Weighted exam + board"],
          ["Admission", "Cut-off + min %"],
          ["Cut-off", "Rank or score vs limit"],
          ["Course", "Required subjects CSV"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Eligibility readiness",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.2, 0.38, 0.52, 0.68, 0.82, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_SCHOLARSHIP_ELIGIBILITY_ARTICLES: Record<string, RichArticle> = {
  "scholarship-eligibility-calculator": article(
    "scholarship-eligibility-calculator",
    "Scholarship eligibility",
    [
      "Checks both score percentage and family income against gates you enter.",
      "Many schemes add category, domicile, or course filters beyond this model.",
    ],
    {
      question: "What if I meet only one gate?",
      answer: "Both score and income must pass in this calculator — partial eligibility is flagged as not eligible.",
    },
    "Scholarship Eligibility Calculator",
    "Check illustrative scholarship eligibility from score % and family income cap.",
    ["scholarship eligibility calculator", "scholarship income limit", "merit scholarship check"],
    "sparkTrendDemo",
  ),
  "merit-score-calculator": article(
    "merit-score-calculator",
    "Merit score",
    [
      "Blends exam and board percentages using the exam weight you specify.",
      "Board weight is the complement to 100% minus exam weight.",
    ],
    {
      question: "Can weights exceed 100%?",
      answer: "Exam weight must be 0–100; board weight is computed as the remainder.",
    },
    "Merit Score Calculator",
    "Calculate weighted merit score from exam %, board %, and exam weight.",
    ["merit score calculator", "exam board weight", "admission merit"],
    "sparkTrendDemo",
  ),
  "admission-eligibility-calculator": article(
    "admission-eligibility-calculator",
    "Admission eligibility",
    [
      "Compares your score to a cut-off and optionally checks a minimum eligibility percent.",
      "Margin shows how many marks above or below the cut-off you are.",
    ],
    {
      question: "Are optional fields required?",
      answer: "Min eligibility % and your % are optional — leave blank to check cut-off only.",
    },
    "Admission Eligibility Calculator",
    "Check admission eligibility against cut-off score and optional minimum percent.",
    ["admission eligibility calculator", "cutoff checker", "college admission score"],
    "none",
  ),
  "college-cutoff-checker": article(
    "college-cutoff-checker",
    "College cut-off checker",
    [
      "Toggle rank mode (lower is better) or score mode (higher is better) before comparing.",
      "Difference explains how far you are from the published cut-off.",
    ],
    {
      question: "Which mode for JEE Advanced?",
      answer: "Use rank mode when the brochure publishes closing ranks; use score mode for mark-based cut-offs.",
    },
    "College Cut-off Checker",
    "Compare your rank or score against a college cut-off with mode toggle.",
    ["college cutoff checker", "rank cutoff calculator", "admission cutoff"],
    "sparkTrendDemo",
  ),
  "course-eligibility-calculator": article(
    "course-eligibility-calculator",
    "Course eligibility",
    [
      "Lists subjects you have studied and checks them against a comma-separated required list.",
      "Matching is case-insensitive; missing subjects are listed explicitly.",
    ],
    {
      question: "Do subject names need to match exactly?",
      answer: "Use consistent names — matching is case-insensitive but not fuzzy (e.g. Maths ≠ Math unless spelled the same).",
    },
    "Course Eligibility Calculator",
    "Verify course eligibility by comparing your subjects CSV to required subjects.",
    ["course eligibility calculator", "subject requirement check", "college course eligibility"],
    "none",
  ),
};
