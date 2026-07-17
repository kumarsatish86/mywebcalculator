import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-pregnancy-reproductive";
const HUB_LABEL = "Education · Science · Biology Pregnancy & Reproductive";
const SHELL =
  "Educational estimates only for classroom reproductive-day math — not medical advice, diagnosis, or prenatal care. Always consult a qualified clinician for health decisions.";

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
        title: "Pregnancy & cycle tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Ovulation", "LMP + (cycle − 14)"],
          ["Due date", "LMP + 280 days"],
          ["Fertility window", "Ovulation − 5 … + 1"],
          ["Menstrual cycle", "Next period & ovulation"],
          ["Conception estimate", "Near ovulation day"],
          ["Weight-gain band", "IOM-style BMI ranges"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational estimates only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Cycle timing idea",
            caption: "Share URL preserves your inputs. Educational estimates only — not medical advice.",
            sparkValues: [0.2, 0.35, 0.55, 0.7, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_PREGNANCY_ARTICLES: Record<string, RichArticle> = {
  "ovulation-calculator": article(
    "ovulation-calculator",
    "Ovulation estimate",
    [
      "Educational estimate: ovulation ≈ LMP + (cycle length − 14). Not medical advice.",
      "Enter LMP as YYYY-MM-DD and a typical cycle length (about 20–45 days for this estimator).",
    ],
    {
      question: "Is this medical advice?",
      answer: "No — these are classroom-style educational estimates only and are not a substitute for clinical care.",
    },
    "Ovulation Calculator — Educational LMP Estimate",
    "Estimate ovulation day from LMP and cycle length for educational use — not medical advice.",
    ["ovulation calculator", "LMP ovulation estimate", "cycle day ovulation"],
    "sparkTrendDemo",
  ),
  "pregnancy-due-date-calculator": article(
    "pregnancy-due-date-calculator",
    "Pregnancy due date",
    [
      "Educational Naegele-style estimate: due date ≈ LMP + 280 days. Not medical advice.",
      "Enter the first day of the last menstrual period as YYYY-MM-DD.",
    ],
    {
      question: "Should I rely on this for prenatal planning?",
      answer: "No — use clinician-confirmed dating. This tool is for educational estimates only.",
    },
    "Pregnancy Due Date Calculator — Educational Naegele Estimate",
    "Estimate a due date from LMP for educational use — not medical advice.",
    ["pregnancy due date calculator", "Naegele rule", "LMP due date"],
    "none",
  ),
  "fertility-window-calculator": article(
    "fertility-window-calculator",
    "Fertility window",
    [
      "Educational window ≈ ovulation − 5 days through ovulation + 1 day. Not medical advice.",
      "Built from the same LMP and cycle-length ovulation estimate.",
    ],
    {
      question: "Does this guarantee conception timing?",
      answer: "No — fertility varies; this is a simplified educational model only.",
    },
    "Fertility Window Calculator — Educational Estimate",
    "Estimate a fertility window from LMP and cycle length — educational only, not medical advice.",
    ["fertility window calculator", "fertile days estimate", "ovulation window"],
    "sparkTrendDemo",
  ),
  "menstrual-cycle-calculator": article(
    "menstrual-cycle-calculator",
    "Menstrual cycle",
    [
      "Educational projection of next period (LMP + cycle length) and ovulation day. Not medical advice.",
      "Useful for classroom cycle-timing problems with YYYY-MM-DD inputs.",
    ],
    {
      question: "What cycle lengths are accepted?",
      answer: "This estimator expects about 20–45 days; irregular cycles need clinical guidance.",
    },
    "Menstrual Cycle Calculator — Next Period Estimate",
    "Estimate next period and ovulation from LMP — educational only, not medical advice.",
    ["menstrual cycle calculator", "next period estimate", "cycle length calculator"],
    "none",
  ),
  "conception-calculator": article(
    "conception-calculator",
    "Conception estimate",
    [
      "Educational conception estimate aligned to the calculated ovulation day. Not medical advice.",
      "Enter LMP (YYYY-MM-DD) and cycle length for a classroom-style date.",
    ],
    {
      question: "Is conception always on ovulation day?",
      answer: "Not necessarily — this tool uses a simplified educational approximation only.",
    },
    "Conception Calculator — Educational Ovulation-Aligned Estimate",
    "Estimate a conception date from LMP and cycle length — not medical advice.",
    ["conception calculator", "conception date estimate", "ovulation conception"],
    "sparkTrendDemo",
  ),
  "pregnancy-weight-gain-calculator": article(
    "pregnancy-weight-gain-calculator",
    "Pregnancy weight gain band",
    [
      "Compares current gain (kg) to IOM-style total recommended ranges by pre-pregnancy BMI category.",
      "Educational ranges only — not personalized medical guidance or advice.",
    ],
    {
      question: "Are these personalized medical targets?",
      answer: "No — they are simplified educational bands. Discuss weight goals with a qualified clinician.",
    },
    "Pregnancy Weight Gain Calculator — Educational BMI Bands",
    "Compare pregnancy weight gain to educational BMI-based ranges — not medical advice.",
    ["pregnancy weight gain calculator", "IOM weight gain", "BMI pregnancy gain"],
    "none",
  ),
};
