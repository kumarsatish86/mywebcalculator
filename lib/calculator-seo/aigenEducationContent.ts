import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-education-study";
const HUB_LABEL = "AI · Generators · Education and study";
const SHELL =
  "In-browser study outlines, quizzes, and explainers. Not a live tutor. Verify against your syllabus and teachers.";

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
        title: "Education generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Plans / timetable / revision", "Schedule scaffolds"],
          ["Notes / flashcards", "Study artifact outlines"],
          ["Quiz / MCQ / practice", "Question templates"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves subject and days. Draft for study inspiration — align to your syllabus.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-study-plan-generator", "Study Plan Generator"],
  ["aigen-timetable-generator", "Timetable Generator"],
  ["aigen-revision-plan-generator", "Revision Plan Generator"],
  ["aigen-exam-strategy-generator", "Exam Strategy Generator"],
  ["aigen-notes-generator", "Notes Generator"],
  ["aigen-flashcards-generator", "Flashcards Generator"],
  ["aigen-quiz-generator", "Quiz Generator"],
  ["aigen-mcq-generator", "MCQ Generator"],
  ["aigen-practice-question-generator", "Practice Question Generator"],
  ["aigen-concept-explanation-generator", "Concept Explanation Generator"],
];

export const AIGEN_EDUCATION_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} creates a short study draft from subject, level, and time inputs.`,
        "Use it to organize effort. Confirm content accuracy with textbooks and instructors.",
      ],
      {
        question: `Can I rely on ${title} for exams?`,
        answer:
          "It provides structural drafts only. Always cross-check facts and coverage against your official syllabus.",
      },
      `${title} — AI Study Draft Template`,
      `Build a ${title.toLowerCase()} outline in your browser. Teaching draft — verify with your syllabus.`,
      [title.toLowerCase(), "study plan generator", "education draft"],
    ),
  ]),
);
