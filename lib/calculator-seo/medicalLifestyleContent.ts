import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/lifestyle-habits";
const HUB_LABEL = "Health · Medical · Lifestyle Habits";
const SHELL =
  "Wellness literacy tools that run in your browser. Not medical advice, addiction treatment, sleep medicine, or mental-health care. Consult qualified clinicians for personal decisions.";

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
    vertical: "health-body",
    category: "health",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Lifestyle habit tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Smoking impact", "Pack-years and optional cost"],
          ["Alcohol units", "volume_ml × ABV% / 1000"],
          ["Sleep cycles", "Bedtime + ~90 min cycles"],
          ["Stress level", "Mean of 1–5 Likert CSV"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your lifestyle inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Habit awareness",
            caption:
              "Share URL preserves your lifestyle inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.25, 0.4, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_LIFESTYLE_ARTICLES: Record<string, RichArticle> = {
  "medical-smoking-impact-calculator": article(
    "medical-smoking-impact-calculator",
    "Pack-years and cost",
    [
      "Pack-years = (cigarettes per day ÷ 20) × years smoked. Optionally estimate annual cost from cost per pack.",
      "Educational exposure arithmetic only — not cessation counseling or clinical risk staging. Seek professional support to quit.",
    ],
    {
      question: "Does pack-years equal cancer risk?",
      answer:
        "No single number captures individual risk. This tool only computes pack-years and optional cost for literacy — see a clinician for personal assessment.",
    },
    "Smoking Impact Calculator — Pack-Years & Cost",
    "Estimate pack-years and optional annual smoking cost for wellness literacy. Not medical advice.",
    ["pack years calculator", "smoking impact calculator", "cigarettes pack years"],
    "sparkTrendDemo",
  ),
  "medical-alcohol-consumption-calculator": article(
    "medical-alcohol-consumption-calculator",
    "Weekly alcohol units",
    [
      "UK-style units per drink = volume_ml × ABV% / 1000, then multiply by drinks per week.",
      "Teaching bands reference common low-risk weekly guidance — not a diagnosis or safe-drinking prescription.",
    ],
    {
      question: "Is 14 units a universal limit?",
      answer:
        "Guidance varies by country and person. This educational band is illustrative; discuss alcohol use with a clinician if concerned.",
    },
    "Alcohol Consumption Calculator — Weekly Units",
    "Estimate UK-style alcohol units per drink and per week. Wellness literacy only — not medical advice.",
    ["alcohol units calculator", "ABV units calculator", "weekly alcohol intake"],
    "none",
  ),
  "medical-sleep-cycle-calculator": article(
    "medical-sleep-cycle-calculator",
    "Sleep cycle wake times",
    [
      "Enter bedtime as HH:MM (24-hour). Assumes ~15 minutes to fall asleep and ~90-minute cycles.",
      "Suggested wake times are heuristic scheduling aids — not sleep medicine or insomnia treatment.",
    ],
    {
      question: "How many cycles should I use?",
      answer:
        "Many people target about 4–6 cycles (~6–9 hours plus fall-asleep time). Adjust 1–8 cycles to explore options.",
    },
    "Sleep Cycle Calculator — Wake Times from Bedtime",
    "Suggest wake times from bedtime using 90-minute sleep cycles. Not medical advice.",
    ["sleep cycle calculator", "wake time calculator", "90 minute sleep cycles"],
    "sparkTrendDemo",
  ),
  "medical-stress-level-calculator": article(
    "medical-stress-level-calculator",
    "Perceived stress mean",
    [
      "Enter at least three Likert scores from 1–5 as CSV. The tool reports the mean and a self-report band.",
      "Not a clinical stress or anxiety diagnosis — seek professional support for concerning symptoms.",
    ],
    {
      question: "Is this a validated stress scale?",
      answer:
        "No. It is a simple mean of your 1–5 items for self-reflection. Validated instruments and clinical interviews are different.",
    },
    "Stress Level Calculator — Self-Report Mean Score",
    "Average 1–5 stress Likert items from CSV for wellness literacy. Not medical advice.",
    ["stress level calculator", "perceived stress score", "stress Likert calculator"],
    "none",
  ),
};
