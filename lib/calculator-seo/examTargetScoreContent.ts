import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-target-score";
const HUB_LABEL = "Education · Target Score";
const SHELL =
  "Runs in your browser. Target maths for planning — not official cut-offs or counseling. Confirm thresholds with your exam authority.";

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
        title: "Target score tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Pass on remaining", "Hit overall pass %"],
          ["Target %", "Aim above pass (e.g. 75%)"],
          ["Final exam", "Coursework + final weights"],
          ["Distinction", "High-band overall target"],
          ["Rank / scholarship gap", "Points to a score target"],
          ["Clear cut-off", "Remaining marks vs cut-off %"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Target progress",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.2, 0.35, 0.48, 0.6, 0.75, 0.92],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_TARGET_SCORE_ARTICLES: Record<string, RichArticle> = {
  "required-marks-to-pass-calculator-exam": article(
    "required-marks-to-pass-calculator-exam",
    "Required marks to pass (exam)",
    [
      "Back-solves marks still needed on remaining papers for a default 40% overall pass target.",
      "Enter marks so far, max so far, remaining max, and adjust pass % if your scheme differs.",
    ],
    {
      question: "What if I already cleared pass %?",
      answer: "The result shows Already met with required marks of zero.",
    },
    "Required Marks to Pass Calculator — Exam",
    "Calculate marks still needed on remaining papers to pass overall.",
    ["required marks to pass exam", "pass remaining marks", "exam pass target"],
    "sparkTrendDemo",
  ),
  "required-marks-target-percentage-calculator": article(
    "required-marks-target-percentage-calculator",
    "Required marks for target percentage",
    [
      "Same remaining-paper math with a higher default target (75%) for merit or personal goals.",
      "Change the target % to any band you are aiming for.",
    ],
    {
      question: "Can the target be above 100%?",
      answer: "No — target percentage must be between 0 and 100.",
    },
    "Required Marks Target Percentage Calculator",
    "Find marks needed on remaining papers to hit a target overall percentage.",
    ["required marks target percentage", "marks for 75 percent", "exam target score"],
    "sparkTrendDemo",
  ),
  "required-marks-final-exam-calculator": article(
    "required-marks-final-exam-calculator",
    "Required marks on final exam",
    [
      "Given coursework percentage and weight split with the final, computes marks needed on the final paper.",
      "Also reports the required final percentage against the final’s maximum marks.",
    ],
    {
      question: "What if coursework already exceeds the target?",
      answer: "Required final marks can be zero — you may already be above the overall target.",
    },
    "Required Marks Final Exam Calculator",
    "Back-solve final-exam marks from coursework %, weights, and target overall %.",
    ["required marks final exam", "coursework final weight", "final exam target"],
    "none",
  ),
  "required-marks-distinction-calculator": article(
    "required-marks-distinction-calculator",
    "Required marks for distinction",
    [
      "Uses the remaining-paper solver with a distinction-oriented default target of 75%.",
      "Adjust the distinction % to match your university or board definition.",
    ],
    {
      question: "Is distinction always 75%?",
      answer: "No — many schemes differ; set the percentage your institution publishes.",
    },
    "Required Marks Distinction Calculator",
    "See marks still needed to reach a distinction-level overall percentage.",
    ["required marks distinction", "distinction percentage calculator", "first class marks"],
    "sparkTrendDemo",
  ),
  "required-score-rank-improvement-calculator": article(
    "required-score-rank-improvement-calculator",
    "Required score for rank improvement",
    [
      "Shows the gap between your current score and a target score for a better rank band.",
      "Illustrative only — rank depends on the full cohort, not score alone.",
    ],
    {
      question: "Does this predict official rank?",
      answer: "No — it only reports how many points you still need to reach a target score.",
    },
    "Required Score Rank Improvement Calculator",
    "Find the score gap to a target for rank-improvement planning.",
    ["rank improvement score", "score gap rank", "target score for rank"],
    "none",
  ),
  "required-score-scholarship-eligibility-calculator": article(
    "required-score-scholarship-eligibility-calculator",
    "Required score for scholarship eligibility",
    [
      "Compares current score to a scholarship threshold and reports the remaining gap.",
      "Use the same units as the scheme (raw marks, percentage, or GPA points).",
    ],
    {
      question: "What if I already meet the threshold?",
      answer: "Status shows Already met with a gap of zero.",
    },
    "Required Score Scholarship Eligibility Calculator",
    "Calculate points still needed to reach a scholarship score threshold.",
    ["scholarship eligibility score", "scholarship cut off marks", "score gap scholarship"],
    "sparkTrendDemo",
  ),
  "required-marks-clear-cutoff-calculator": article(
    "required-marks-clear-cutoff-calculator",
    "Required marks to clear cut-off",
    [
      "Treats cut-off as a target overall percentage and solves marks needed on remaining papers.",
      "Helpful for sectional or aggregate cut-offs expressed as percentages.",
    ],
    {
      question: "Should I use percentage or raw cut-off?",
      answer: "Enter cut-off as overall % with marks so far / max so far / remaining max; for raw score gaps use the rank or scholarship gap tools.",
    },
    "Required Marks Clear Cut-Off Calculator",
    "Find remaining marks needed to clear a cut-off overall percentage.",
    ["clear cutoff marks", "cutoff percentage calculator", "required marks cutoff"],
    "none",
  ),
};
