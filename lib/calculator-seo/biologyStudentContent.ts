import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-student-educational";
const HUB_LABEL = "Education · Science · Biology Student Educational";
const SHELL =
  "Educational biology study helpers for classroom planning and simple formula practice only — not official grading, counseling, or exam policy. Confirm requirements with your teachers.";

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
        title: "Student biology tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Biology formula", "magnification / rate / density / efficiency"],
          ["Quiz score", "correct ÷ total → % + grade"],
          ["Study time planner", "hours ÷ topics"],
          ["Revision planner", "chapters ÷ days"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational study helpers only — not official grading.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Study progress idea",
            caption: "Share URL preserves your inputs. Educational study helpers only — not official grading.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_STUDENT_ARTICLES: Record<string, RichArticle> = {
  "biology-formula-calculator": article(
    "biology-formula-calculator",
    "Biology formula",
    [
      "Applies one of four classroom formulas: magnification, rate, density, or efficiency from two numeric inputs.",
      "Kind is matched by keyword (e.g. magnification, rate, density, efficiency).",
    ],
    {
      question: "Which kinds are supported?",
      answer: "magnification (image/actual), rate (change/time), density (N/area), and efficiency % (useful/total × 100).",
    },
    "Biology Formula Calculator — Magnification Rate Density Efficiency",
    "Practice common biology classroom formulas with two values — educational only.",
    ["biology formula calculator", "magnification calculator", "biology efficiency education"],
    "sparkTrendDemo",
  ),
  "quiz-score-calculator-biology": article(
    "quiz-score-calculator-biology",
    "Quiz score (biology)",
    [
      "Percent = correct / total × 100 with a simple A–F letter band for teaching examples.",
      "Not an official gradebook — your school’s scale may differ.",
    ],
    {
      question: "What letter cut-offs are used?",
      answer: "A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, otherwise F — a common classroom demo scale only.",
    },
    "Quiz Score Calculator Biology — Percent and Letter Grade",
    "Convert correct answers to percent and a demo letter grade for biology quizzes.",
    ["quiz score calculator biology", "biology test percent", "letter grade education"],
    "none",
  ),
  "study-time-planner-biology": article(
    "study-time-planner-biology",
    "Study time planner",
    [
      "Splits available study hours evenly across a number of topics.",
      "Simple planning arithmetic — adjust for harder topics yourself.",
    ],
    {
      question: "Can topics get unequal time?",
      answer: "This tool uses an even split only. Weight difficult chapters manually after you see the baseline.",
    },
    "Study Time Planner Biology — Hours per Topic",
    "Divide available hours evenly across biology topics for educational planning.",
    ["study time planner biology", "hours per topic", "biology study plan education"],
    "sparkTrendDemo",
  ),
  "revision-planner-biology": article(
    "revision-planner-biology",
    "Revision planner",
    [
      "Chapters per day = chapters ÷ days until exam (even split).",
      "Educational revision pacing — not a personalized tutoring plan.",
    ],
    {
      question: "Should every chapter take the same time?",
      answer: "No — use the even split as a baseline, then spend more days on harder chapters.",
    },
    "Revision Planner Biology — Chapters per Day",
    "Plan an even chapter revision pace until exam day — educational study helper.",
    ["revision planner biology", "chapters per day", "exam revision education"],
    "none",
  ),
};
