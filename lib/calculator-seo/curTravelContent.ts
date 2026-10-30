import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-travel-expense";
const HUB_LABEL = "Conversion · Currency · Travel and expense currency tools";
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
        title: "Travel currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Trip FX", "Amount × illustrative rate"],
          ["Budget", "Daily × days × people"],
          ["Compare / split", "Airport vs bank; equal split"],
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

export const CUR_TRAVEL_ARTICLES: Record<string, RichArticle> = {
  "cur-travel-currency-calculator": article(
    "cur-travel-currency-calculator",
    "Travel Currency Calculator",
    ["Local cash ≈ home amount × illustrative FX.", "Quick trip cash planning with editable example rate."],
    { question: "Cash or card?", answer: "Rates differ. Model each channel separately — this is a single-rate teaching form." },
    "Travel Currency Calculator — Trip Cash",
    "Convert travel spending money with an example FX rate. Not live data.",
    ["travel currency calculator", "trip fx calculator"],
  ),
  "cur-foreign-trip-budget-calculator": article(
    "cur-foreign-trip-budget-calculator",
    "Foreign Trip Budget Calculator",
    ["Trip = daily × days × people; local = × FX.", "Builds total home spend then converts."],
    { question: "Should daily include hotels?", answer: "Include whatever you mean by daily — stay consistent across days." },
    "Foreign Trip Budget Calculator",
    "Estimate trip budget in home and local currency. Illustrative FX.",
    ["foreign trip budget calculator", "travel budget fx"],
  ),
  "cur-airport-vs-bank-exchange-calculator": article(
    "cur-airport-vs-bank-exchange-calculator",
    "Currency Exchange at Airport vs Bank Calculator",
    ["Compares two illustrative rates for the same amount.", "Airport kiosks often quote weaker rates — model both."],
    { question: "Are airport rates always worse?", answer: "Often, but not always. Enter quotes you are offered." },
    "Airport vs Bank Exchange Calculator",
    "Compare airport and bank illustrative FX quotes. Teaching comparison.",
    ["airport exchange calculator", "airport vs bank fx"],
  ),
  "cur-travel-expense-split-calculator": article(
    "cur-travel-expense-split-calculator",
    "Travel Expense Split Calculator",
    ["Equal split = total ÷ people.", "Simple shared trip cost divider."],
    { question: "What about uneven shares?", answer: "This tool assumes equal split. Adjust manually for weighted shares." },
    "Travel Expense Split Calculator",
    "Split travel expenses equally among people. Simple teaching tool.",
    ["travel expense split", "trip bill split calculator"],
  ),
  "cur-daily-travel-budget-calculator": article(
    "cur-daily-travel-budget-calculator",
    "Daily Travel Budget Calculator",
    ["Trip total = daily budget × days.", "No FX in this form — home currency daily cap."],
    { question: "Should I add a buffer?", answer: "Many planners add 10–20% contingency separately or use the smart budget planner." },
    "Daily Travel Budget Calculator",
    "Multiply daily travel budget by trip days. Planning estimate.",
    ["daily travel budget calculator", "per diem travel calculator"],
  ),
};
