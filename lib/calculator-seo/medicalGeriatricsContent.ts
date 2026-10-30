import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/geriatrics-aging";
const HUB_LABEL = "Health · Medical · Geriatrics & Aging";
const SHELL =
  "Educational geriatrics awareness arithmetic for learning only — not actuarial tables, comprehensive geriatric assessment, dementia diagnosis, or care planning. Consult qualified clinicians for personal decisions.";

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
        title: "Geriatrics teaching tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Life expectancy", "Toy remaining-years model"],
          ["Fall risk", "Sum of item score CSV"],
          ["Cognitive score", "Screening item total"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your geriatrics inputs. Educational only — not medical or actuarial advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Aging metrics idea",
            caption:
              "Share URL preserves your geriatrics inputs. Educational only — not medical or actuarial advice.",
            sparkValues: [0.35, 0.5, 0.6, 0.7, 0.8, 0.85],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_GERIATRICS_ARTICLES: Record<string, RichArticle> = {
  "medical-life-expectancy-calculator": article(
    "medical-life-expectancy-calculator",
    "Life expectancy (toy model)",
    [
      "A classroom remaining-years estimate from age, sex (male|female text field), and simple lifestyle flags.",
      "Not actuarial, clinical, or insurance life expectancy — educational awareness math only.",
    ],
    {
      question: "How do I enter sex?",
      answer: 'Type "male" or "female" in the sex text field (m/f also accepted).',
    },
    "Life Expectancy Calculator — Educational Toy Model",
    "Explore a simplified remaining-years teaching estimate by age and sex — not actuarial or medical advice.",
    ["life expectancy calculator", "remaining years estimate", "geriatrics teaching"],
    "sparkTrendDemo",
  ),
  "medical-fall-risk-calculator": article(
    "medical-fall-risk-calculator",
    "Fall risk score",
    [
      "Sums Morse-like fall-risk item points from a comma-separated list for teaching bands.",
      "Not a full fall-risk assessment or care plan — clinicians should evaluate real fall risk.",
    ],
    {
      question: "How many scores do I need?",
      answer: "Enter at least three numeric item points separated by commas, spaces, or semicolons.",
    },
    "Fall Risk Calculator — Teaching Score Sum",
    "Sum fall-risk item points from a CSV for educational bands — not a clinical fall assessment.",
    ["fall risk calculator", "Morse fall score teaching", "geriatric fall risk"],
    "none",
  ),
  "medical-cognitive-score-calculator": article(
    "medical-cognitive-score-calculator",
    "Cognitive screening total",
    [
      "Sums cognitive screening item scores (or a single total) against an optional maximum (default 30).",
      "Not a MoCA/MMSE diagnosis or dementia assessment — educational scoring arithmetic only.",
    ],
    {
      question: "Is a low total a diagnosis?",
      answer:
        "No. Screening and diagnosis require trained clinicians and validated instruments in proper context.",
    },
    "Cognitive Score Calculator — Teaching Total",
    "Sum cognitive screening item scores for educational bands — not a dementia diagnosis tool.",
    ["cognitive score calculator", "MoCA style total teaching", "geriatrics cognition"],
    "sparkTrendDemo",
  ),
};
