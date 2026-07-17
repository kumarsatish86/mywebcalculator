import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-international";
const HUB_LABEL = "Education · International Exam Scores";
const SHELL =
  "Educational scaling in your browser—not official ETS, GMAC, or British Council scoring. Use practice-test raws only; confirm with official score reports.";

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
        title: "Exams covered",
        columnHeaders: ["Exam", "Inputs"],
        rows: [
          ["SAT", "R&W + Math raw → scaled total"],
          ["GRE", "Verbal + Quant + AWA"],
          ["GMAT", "Quant + Verbal correct counts"],
          ["IELTS", "Four skills → overall band"],
          ["TOEFL", "Four sections 0–30"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Score trajectory",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.3, 0.45, 0.58, 0.72, 0.86, 0.94],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_INTERNATIONAL_ARTICLES: Record<string, RichArticle> = {
  "sat-score-calculator": article(
    "sat-score-calculator",
    "SAT score calculator",
    [
      "Maps Reading & Writing and Math raw scores to illustrative 200–800 section scales and a 400–1600 total.",
      "Optional section max values let you match a specific practice test form.",
    ],
    {
      question: "Is this the real SAT curve?",
      answer: "No — linear educational scaling only. Official College Board equating differs every test date.",
    },
    "SAT Score Calculator",
    "Estimate illustrative SAT total from Reading & Writing and Math raw scores.",
    ["sat score calculator", "sat raw to scaled", "sat total score"],
    "sparkTrendDemo",
  ),
  "gre-score-calculator": article(
    "gre-score-calculator",
    "GRE score calculator",
    [
      "Scales verbal and quant raw counts toward 130–170 and shows AWA on a 0–6 scale.",
      "Combined V+Q helps compare against typical program ranges.",
    ],
    {
      question: "Does AWA affect the V+Q sum?",
      answer: "No — AWA is reported separately; combined V+Q is verbal scaled plus quant scaled.",
    },
    "GRE Score Calculator",
    "Estimate GRE Verbal, Quant, AWA, and combined V+Q from practice raw scores.",
    ["gre score calculator", "gre verbal quant", "gre practice score"],
    "sparkTrendDemo",
  ),
  "gmat-score-calculator": article(
    "gmat-score-calculator",
    "GMAT score calculator",
    [
      "Combines quant and verbal accuracy into an illustrative 200–800 style total.",
      "Section index percentages show relative strength on each side.",
    ],
    {
      question: "Does this match GMAT Focus Edition?",
      answer: "This uses a simplified classic-style map — always verify with official GMAC materials.",
    },
    "GMAT Score Calculator",
    "Estimate GMAT total from quant and verbal correct counts on practice tests.",
    ["gmat score calculator", "gmat practice score", "gmat quant verbal"],
    "none",
  ),
  "ielts-band-calculator": article(
    "ielts-band-calculator",
    "IELTS band calculator",
    [
      "Averages listening, reading, writing, and speaking then rounds to the nearest 0.5 band.",
      "CEFR hint is illustrative — check university requirements for exact bands.",
    ],
    {
      question: "How is 6.75 rounded?",
      answer: "Official IELTS rounds to nearest 0.5 — 6.75 becomes 7.0 in this model.",
    },
    "IELTS Band Calculator",
    "Calculate overall IELTS band from four skill scores with 0.5-step rounding.",
    ["ielts band calculator", "ielts overall score", "ielts average band"],
    "sparkTrendDemo",
  ),
  "toefl-score-calculator": article(
    "toefl-score-calculator",
    "TOEFL score calculator",
    [
      "Sums reading, listening, speaking, and writing section scores (0–30 each) for a 0–120 total.",
      "Band label gives a quick competitiveness read for admissions planning.",
    ],
    {
      question: "Are all sections weighted equally?",
      answer: "Yes — each of the four sections contributes up to 30 points to the total.",
    },
    "TOEFL Score Calculator",
    "Calculate TOEFL total from four section scores and see a competitiveness band.",
    ["toefl score calculator", "toefl total score", "toefl section scores"],
    "none",
  ),
};
