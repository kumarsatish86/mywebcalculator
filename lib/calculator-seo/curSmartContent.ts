import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-smart-ai";
const HUB_LABEL = "Conversion · Currency · Smart and AI currency tools";
const SHELL =
  "Teaching currency conversion estimates that run in your browser. Illustrative FX rates and fees — not live market data. Verify amounts with your bank, exchange, or a live quote before transacting.";
const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption: "Share URL preserves your inputs. Illustrative rates only — not live data.",
};

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
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Smart currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Scenario rate", "Current × (1 + move%)"],
          ["Budget planner", "Daily × days × FX × buffer"],
          ["Optimizer", "Weighted return split"],
        ],
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CUR_SMART_ARTICLES: Record<string, RichArticle> = {
  "cur-ai-currency-prediction-tool": article(
    "cur-ai-currency-prediction-tool",
    "AI Currency Prediction Tool",
    ["Scenario rate = current × (1 + expected move%).", "Not a forecast — editable scenario for what-if study."],
    { question: "Does AI predict FX here?", answer: "No live AI model. You enter the expected move%; the tool applies the math." },
    "AI Currency Prediction — Scenario Rate",
    "Model a what-if FX move from an example current rate. Not a forecast.",
    ["ai currency prediction", "fx scenario calculator"],
  ),
  "cur-ai-forex-advisor": article(
    "cur-ai-forex-advisor",
    "AI Forex Advisor",
    ["Heuristic score = trend − volatility/10.", "Teaching bias label — not investment advice."],
    { question: "Should I trade on this score?", answer: "No. This is a simplified classroom heuristic, not a trading signal." },
    "AI Forex Advisor — Heuristic Score",
    "Explore trend vs volatility heuristic score. Not investment advice.",
    ["ai forex advisor", "fx trend heuristic"],
  ),
  "cur-ai-travel-budget-planner": article(
    "cur-ai-travel-budget-planner",
    "AI Travel Budget Planner",
    ["Budget = daily × days × FX × (1 + buffer%).", "Adds contingency buffer to converted trip spend."],
    { question: "How much buffer?", answer: "Many planners use 10–20% for FX drift and surprises — adjust to your trip." },
    "AI Travel Budget Planner — With Buffer",
    "Plan travel budget with example FX and buffer %. Illustrative rates.",
    ["ai travel budget planner", "travel fx budget buffer"],
  ),
  "cur-ai-investment-currency-optimizer": article(
    "cur-ai-investment-currency-optimizer",
    "AI Investment Currency Optimizer",
    ["Split capital by weights; blended return = Σ(w×r).", "Two-asset scenario allocator — not portfolio optimization."],
    { question: "Is this mean-variance optimization?", answer: "No. Simple weighted average of returns you enter." },
    "AI Investment Currency Optimizer — Weight Split",
    "Allocate capital by weights and blended return scenario. Not investment advice.",
    ["investment currency optimizer", "fx allocation calculator"],
  ),
};
