import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-health-fitness";
const HUB_LABEL = "AI · Generators · Health and fitness";
const SHELL =
  "In-browser workout and meal plan drafts. Not personalized medical or nutrition advice. Consult a clinician when needed.";

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
        title: "Health generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Workout / gym / home", "Session outlines"],
          ["Diet / meals / calories", "Plate templates"],
          ["Sleep / meditation / routine", "Day structure drafts"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves fitness inputs. Inspiration only — not medical advice.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-workout-plan-generator", "Workout Plan Generator"],
  ["aigen-home-workout-generator", "Home Workout Generator"],
  ["aigen-gym-routine-generator", "Gym Routine Generator"],
  ["aigen-weight-loss-plan-generator", "Weight Loss Plan Generator"],
  ["aigen-diet-plan-generator", "Diet Plan Generator"],
  ["aigen-meal-plan-generator", "Meal Plan Generator"],
  ["aigen-calorie-intake-plan-generator", "Calorie Intake Plan Generator"],
  ["aigen-keto-vegetarian-diet-generator", "Keto/Vegetarian Diet Generator"],
  ["aigen-sleep-schedule-generator", "Sleep Schedule Generator"],
  ["aigen-meditation-plan-generator", "Meditation Plan Generator"],
  ["aigen-daily-routine-generator", "Daily Routine Generator"],
];

export const AIGEN_HEALTH_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} produces a short health or fitness draft from your focus and numeric inputs.`,
        "Individual needs vary widely. This is not medical, dietary, or coaching advice.",
      ],
      {
        question: `Is the ${title} medical advice?`,
        answer:
          "No. It is an inspirational template. Seek professional guidance for health conditions or restrictive diets.",
      },
      `${title} — AI Fitness Draft Template`,
      `Create a ${title.toLowerCase()} outline in your browser. Not medical advice — verify before use.`,
      [title.toLowerCase(), "workout plan generator", "fitness draft"],
    ),
  ]),
);
