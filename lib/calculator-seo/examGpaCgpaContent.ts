import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-gpa-cgpa";
const HUB_LABEL = "Education · GPA & CGPA";
const SHELL =
  "Runs in your browser. GPA maths for planning — not official transcripts. Confirm scales and conversion rules with your university.";

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
        title: "GPA & CGPA tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["GPA / SGPA", "Course grade points + credits"],
          ["CGPA", "Semester GPAs + credit loads"],
          ["Cumulative", "Prior CGPA + new semester"],
          ["GPA ↔ %", "Approximate scale conversion"],
          ["Weighted / unweighted", "With or without credits"],
          ["Grade point", "% → letter / grade points"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "GPA trajectory",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.35, 0.42, 0.55, 0.68, 0.8, 0.88],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_GPA_CGPA_ARTICLES: Record<string, RichArticle> = {
  "gpa-calculator": article(
    "gpa-calculator",
    "GPA calculator",
    [
      "Computes credit-weighted GPA from grade-point CSV and optional credits CSV.",
      "If credits are blank, each course is treated as equal weight.",
    ],
    {
      question: "What are grade points?",
      answer: "Numeric points for each course (e.g. 9, 8, 7.5) — not raw percentage unless your scale says so.",
    },
    "GPA Calculator",
    "Calculate credit-weighted GPA from grade points and credits.",
    ["gpa calculator", "credit weighted gpa", "grade points gpa"],
    "sparkTrendDemo",
  ),
  "cgpa-calculator": article(
    "cgpa-calculator",
    "CGPA calculator",
    [
      "Treats each semester GPA as a grade-point entry with that semester’s credit total as weight.",
      "Produces an overall CGPA across the semesters you enter.",
    ],
    {
      question: "Do I need every semester?",
      answer: "Enter the semesters you want blended — partial lists still compute for those terms only.",
    },
    "CGPA Calculator",
    "Blend semester GPAs and credits into an overall CGPA.",
    ["cgpa calculator", "semester gpa to cgpa", "cumulative grade point"],
    "sparkTrendDemo",
  ),
  "sgpa-calculator": article(
    "sgpa-calculator",
    "SGPA calculator",
    [
      "Semester GPA from course grade points and credits for a single term.",
      "Same credit-weighted math as the GPA tool with semester-focused wording.",
    ],
    {
      question: "Is SGPA the same as GPA?",
      answer: "Math is the same; SGPA usually means one semester’s result.",
    },
    "SGPA Calculator",
    "Compute semester GPA (SGPA) from course grade points and credits.",
    ["sgpa calculator", "semester gpa calculator", "sgpa from credits"],
    "none",
  ),
  "semester-gpa-calculator": article(
    "semester-gpa-calculator",
    "Semester GPA calculator",
    [
      "Credit-weighted GPA for one semester’s courses.",
      "Enter grade points and matching credits (or leave credits blank for equal weight).",
    ],
    {
      question: "Must credits match the number of courses?",
      answer: "Yes — if you provide credits, the count must match the grade-points list.",
    },
    "Semester GPA Calculator",
    "Calculate one semester’s GPA from grade points and credits.",
    ["semester gpa calculator", "term gpa", "course credits gpa"],
    "sparkTrendDemo",
  ),
  "cumulative-gpa-calculator": article(
    "cumulative-gpa-calculator",
    "Cumulative GPA calculator",
    [
      "Updates prior GPA/credits with a new semester GPA and credit load.",
      "Formula: (prior×priorCredits + new×newCredits) ÷ total credits.",
    ],
    {
      question: "Can prior credits be zero?",
      answer: "Yes for a first semester — then CGPA equals the new semester GPA.",
    },
    "Cumulative GPA Calculator",
    "Combine prior CGPA with a new semester to get updated cumulative GPA.",
    ["cumulative gpa calculator", "update cgpa", "prior gpa new semester"],
    "none",
  ),
  "gpa-to-percentage-converter": article(
    "gpa-to-percentage-converter",
    "GPA to percentage converter",
    [
      "Approximate conversion: 4.0 scale uses GPA × 25; 10.0 scale uses GPA × 9.5.",
      "University formulas vary — treat this as planning guidance only.",
    ],
    {
      question: "Why × 9.5 on a 10 scale?",
      answer: "It is a common India-style approximation; your university may publish a different table.",
    },
    "GPA to Percentage Converter",
    "Convert GPA to approximate percentage on 4.0 or 10.0 scales.",
    ["gpa to percentage", "cgpa to percentage", "gpa percent converter"],
    "sparkTrendDemo",
  ),
  "percentage-to-gpa-converter": article(
    "percentage-to-gpa-converter",
    "Percentage to GPA converter",
    [
      "Inverse of the common linear maps: % ÷ 25 on 4.0, % ÷ 9.5 on 10.0.",
      "Use only when your institution accepts this approximation.",
    ],
    {
      question: "Can percentage exceed 100?",
      answer: "No — percentage must be between 0 and 100.",
    },
    "Percentage to GPA Converter",
    "Convert percentage to approximate GPA on 4.0 or 10.0 scales.",
    ["percentage to gpa", "percent to cgpa", "marks to gpa"],
    "sparkTrendDemo",
  ),
  "weighted-gpa-calculator-exam": article(
    "weighted-gpa-calculator-exam",
    "Weighted GPA calculator",
    [
      "Requires grade points and credits of equal length for a true credit-weighted GPA.",
      "Ideal when course credit hours differ.",
    ],
    {
      question: "What if credits are missing?",
      answer: "This mode expects credits — use the plain GPA tool if every course is equal weight.",
    },
    "Weighted GPA Calculator — Exam",
    "Credit-weighted GPA from matching grade-point and credit lists.",
    ["weighted gpa calculator", "credit weighted gpa exam", "gpa with credits"],
    "none",
  ),
  "unweighted-gpa-calculator": article(
    "unweighted-gpa-calculator",
    "Unweighted GPA calculator",
    [
      "Simple average of grade points — each course counts equally.",
      "Use when credits are unavailable or all courses share the same weight.",
    ],
    {
      question: "How is this different from weighted GPA?",
      answer: "Unweighted ignores credits; weighted multiplies each grade point by its credit hours.",
    },
    "Unweighted GPA Calculator",
    "Average grade points equally without credit weighting.",
    ["unweighted gpa calculator", "simple gpa average", "equal weight gpa"],
    "sparkTrendDemo",
  ),
  "grade-point-calculator": article(
    "grade-point-calculator",
    "Grade point calculator",
    [
      "Maps a course percentage to letter grade and grade points on 4.0 or 10.0 band tables.",
      "Bands are illustrative — confirm with your grading scheme.",
    ],
    {
      question: "Which scale should I pick?",
      answer: "Use 10 for many Indian university schemes and 4 for common US-style GPA letters.",
    },
    "Grade Point Calculator",
    "Convert percentage to letter grade and grade points on 4.0 or 10.0 scales.",
    ["grade point calculator", "percentage to grade point", "letter grade from percent"],
    "none",
  ),
};
