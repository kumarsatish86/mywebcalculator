import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-neuroscience-psychology";
const HUB_LABEL = "Education · Science · Biology Neuroscience & Psychology";
const SHELL =
  "Educational neuroscience and psychology helpers for classroom use only — not clinical diagnosis, sleep medicine, or mental-health advice.";

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
        title: "Neuroscience & psychology tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Reaction time", "Mean/min/max from ms samples"],
          ["Cognitive load", "(tasks × difficulty) / capacity"],
          ["Sleep cycle", "90 min cycles from bedtime"],
          ["Circadian rhythm", "Bedtime from wake − sleep hours"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational only — not clinical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Alertness / pacing idea",
            caption: "Share URL preserves your inputs. Educational only — not clinical advice.",
            sparkValues: [0.4, 0.55, 0.7, 0.6, 0.75, 0.85],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_NEUROSCIENCE_ARTICLES: Record<string, RichArticle> = {
  "reaction-time-calculator": article(
    "reaction-time-calculator",
    "Reaction time",
    [
      "Computes mean, minimum, and maximum reaction time from comma-separated millisecond samples.",
      "Lab demo statistics — not a clinical or neurological assessment.",
    ],
    {
      question: "What units should I use?",
      answer: "Enter reaction times in milliseconds (ms), separated by commas, spaces, or semicolons.",
    },
    "Reaction Time Calculator — Mean Min Max from Samples",
    "Calculate mean reaction time from millisecond samples — educational psychology math.",
    ["reaction time calculator", "mean reaction time ms", "psychology education"],
    "sparkTrendDemo",
  ),
  "cognitive-load-calculator": article(
    "cognitive-load-calculator",
    "Cognitive load",
    [
      "Index = (tasks × difficulty) / capacity with low / moderate / high educational bands.",
      "Simplified classroom heuristic — not a validated cognitive-load instrument.",
    ],
    {
      question: "What scale should difficulty use?",
      answer: "Any positive teaching scale works; keep difficulty and capacity in the same units of effort.",
    },
    "Cognitive Load Calculator — Tasks × Difficulty / Capacity",
    "Estimate a simple cognitive-load index for educational discussion — not clinical advice.",
    ["cognitive load calculator", "mental workload education", "tasks difficulty capacity"],
    "none",
  ),
  "sleep-cycle-calculator": article(
    "sleep-cycle-calculator",
    "Sleep cycle",
    [
      "Suggests wake times from bedtime (HH:MM) using a 15-minute fall-asleep buffer and 90-minute cycles.",
      "Educational sleep-hygiene helper — not medical advice for insomnia or disorders.",
    ],
    {
      question: "Is cycles required?",
      answer: "No — leave cycles blank to use the default of 5 (allowed range 1–8).",
    },
    "Sleep Cycle Calculator — 90-Minute Wake Suggestions",
    "Suggest wake times from bedtime using 90-minute sleep cycles — educational only.",
    ["sleep cycle calculator", "90 minute sleep cycles", "wake time suggestion"],
    "sparkTrendDemo",
  ),
  "circadian-rhythm-calculator": article(
    "circadian-rhythm-calculator",
    "Circadian rhythm helper",
    [
      "Suggests bedtime from wake time minus target sleep hours, plus a 15-minute wind-down buffer.",
      "Educational chronotype helper — not medical circadian or shift-work advice.",
    ],
    {
      question: "What sleep-hour range is allowed?",
      answer: "This helper accepts about 4–12 hours of target sleep for classroom examples.",
    },
    "Circadian Rhythm Calculator — Bedtime from Wake Time",
    "Estimate bedtime from wake time and sleep hours — educational chronotype helper.",
    ["circadian rhythm calculator", "bedtime from wake time", "sleep hours education"],
    "none",
  ),
};
