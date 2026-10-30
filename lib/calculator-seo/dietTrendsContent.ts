import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/diet-specific-trends";
const HUB_LABEL = "Health · Diet & Nutrition · Diet-Specific Trends";
const SHELL =
  "Wellness literacy tools that run in your browser. Educational pattern macros and fasting windows only — not medical advice, therapeutic diets, or treatment for any condition. Consult a clinician or registered dietitian for personal decisions.";

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
        title: "Diet trend tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Keto", "~75% fat teaching macros"],
          ["Paleo", "30/30/40 teaching split"],
          ["Vegan planner", "Plant-forward macros + protein note"],
          ["Mediterranean", "20/50/30 teaching split"],
          ["Low-fat", "~15% fat teaching split"],
          ["DASH", "Macros + sodium awareness"],
          ["IF 16:8", "Wake hour → 8 h eating window"],
          ["OMAD", "One meal hour + daily calories"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your trend inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Pattern awareness",
            caption:
              "Share URL preserves your trend inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_TRENDS_ARTICLES: Record<string, RichArticle> = {
  "diet-keto-diet-calculator": article(
    "diet-keto-diet-calculator",
    "Keto-style teaching macros",
    [
      "Enter daily calories to split protein, carbs, and fat with a high-fat (~75%) teaching pattern.",
      "Educational arithmetic only — not a therapeutic ketogenic prescription or medical advice.",
    ],
    {
      question: "Will this put me in ketosis?",
      answer:
        "No. This only estimates grams from a fixed percentage mix. Metabolic ketosis depends on many factors and clinical context.",
    },
    "Keto Diet Calculator — Teaching Macro Split",
    "Estimate keto-style protein, carb, and fat grams from daily calories. Wellness literacy only.",
    ["keto diet calculator", "keto macros", "ketogenic macro split educational"],
    "sparkTrendDemo",
  ),
  "diet-paleo-diet-calculator": article(
    "diet-paleo-diet-calculator",
    "Paleo-style teaching macros",
    [
      "Maps daily calories to a paleo-inspired 30/30/40 protein/carb/fat teaching split.",
      "Not a food list, elimination plan, or medical diet — educational macros only.",
    ],
    {
      question: "Does this include paleo food rules?",
      answer:
        "No. It only computes gram targets from calories and a fixed percentage mix for literacy.",
    },
    "Paleo Diet Calculator — Educational Macro Split",
    "Estimate paleo-style macros from daily calories. Not medical advice.",
    ["paleo diet calculator", "paleo macros", "paleolithic diet educational"],
    "none",
  ),
  "diet-vegan-diet-planner-calculator": article(
    "diet-vegan-diet-planner-calculator",
    "Vegan planner macros",
    [
      "Splits calories into a plant-forward teaching mix and notes common protein-dense plant foods.",
      "Not a complete vegan meal plan, B12 protocol, or medical advice.",
    ],
    {
      question: "Does this guarantee adequate protein?",
      answer:
        "No. It only shows teaching grams and a short protein-foods note. Individual needs vary.",
    },
    "Vegan Diet Planner Calculator — Plant-Forward Macros",
    "Estimate vegan-style macros from calories with a protein-foods note. Wellness literacy only.",
    ["vegan diet planner", "vegan macros calculator", "plant based macros"],
    "sparkTrendDemo",
  ),
  "diet-mediterranean-diet-calculator": article(
    "diet-mediterranean-diet-calculator",
    "Mediterranean teaching macros",
    [
      "Applies a moderate-fat Mediterranean-style teaching split to your daily calories.",
      "Does not score olive oil servings or food patterns clinically — educational grams only.",
    ],
    {
      question: "Is this the Mediterranean diet score?",
      answer:
        "No. It is a simple calorie-to-macro teaching split, not a validated diet-quality index.",
    },
    "Mediterranean Diet Calculator — Teaching Macros",
    "Estimate Mediterranean-style protein, carb, and fat grams from calories. Not medical advice.",
    ["mediterranean diet calculator", "mediterranean macros", "med diet educational"],
    "none",
  ),
  "diet-low-fat-diet-calculator": article(
    "diet-low-fat-diet-calculator",
    "Low-fat teaching macros",
    [
      "Splits calories with a lower-fat (~15%) teaching pattern and higher carbohydrate share.",
      "Not a therapeutic low-fat diet or lipid treatment plan.",
    ],
    {
      question: "Is 15% fat right for everyone?",
      answer:
        "No. This is a fixed educational mix. Personal fat targets should come from a clinician or dietitian.",
    },
    "Low-Fat Diet Calculator — Educational Macro Split",
    "Estimate low-fat teaching macros from daily calories. Wellness literacy only.",
    ["low fat diet calculator", "low fat macros", "low fat calories educational"],
    "sparkTrendDemo",
  ),
  "diet-dash-diet-calculator": article(
    "diet-dash-diet-calculator",
    "DASH-style macros + sodium note",
    [
      "Produces DASH-leaning teaching macros and a common sodium-awareness cap (2300 mg).",
      "Not blood-pressure treatment or a clinical DASH meal prescription.",
    ],
    {
      question: "Does this replace DASH food lists?",
      answer:
        "No. It only estimates macros and shows a sodium awareness figure for literacy.",
    },
    "DASH Diet Calculator — Macros & Sodium Awareness",
    "Estimate DASH-style teaching macros and a sodium awareness cap. Not medical advice.",
    ["DASH diet calculator", "DASH macros", "DASH sodium educational"],
    "none",
  ),
  "diet-intermittent-fasting-16-8-calculator": article(
    "diet-intermittent-fasting-16-8-calculator",
    "16:8 eating window",
    [
      "Enter a wake hour (0–23) to suggest an 8-hour eating window and 16-hour fast.",
      "Timing math only — not medical advice about fasting safety or metabolic effects.",
    ],
    {
      question: "Can I fast if I have a medical condition?",
      answer:
        "Ask a clinician first. This tool only suggests clock times from a wake hour for education.",
    },
    "Intermittent Fasting 16:8 Calculator — Eating Window",
    "Suggest a 16:8 eating window from wake hour. Wellness literacy only — not medical advice.",
    ["16:8 fasting calculator", "intermittent fasting 16 8", "eating window calculator"],
    "sparkTrendDemo",
  ),
  "diet-omad-calculator": article(
    "diet-omad-calculator",
    "OMAD meal placement",
    [
      "Places your daily calories into one meal hour and reports ~23 fasting hours as a teaching frame.",
      "Not a recommendation to practice OMAD — educational scheduling math only.",
    ],
    {
      question: "Is OMAD safe?",
      answer:
        "Safety depends on health status. This tool only places calories at a meal hour for literacy — see a clinician before trying extreme fasting.",
    },
    "OMAD Calculator — One Meal a Day Timing",
    "Place daily calories at one meal hour with fasting-hour context. Not medical advice.",
    ["OMAD calculator", "one meal a day calculator", "OMAD fasting educational"],
    "none",
  ),
};
