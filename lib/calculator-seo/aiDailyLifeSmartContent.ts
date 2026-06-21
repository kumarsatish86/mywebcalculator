import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-daily-life";
const HUB_LABEL = "AI · Daily Life Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Shopping and budget aids only; not financial or legal advice.";

function article(
  slug: string,
  heading: string,
  paragraph: string,
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Prices", "Verify deals at checkout before paying"]] }],
    chart: { kind: "sparkTrendDemo", title: "Compare → decide → save", caption: "Adjust inputs as prices change.", sparkValues: [0.35, 0.55, 0.8, 1] },
    faq: [{ question: "Is this a live AI chatbot?", answer: "No—fixed formulas and comparison logic only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_DAILY_LIFE_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-expense-splitter-groups": article("aist-ai-expense-splitter-groups", "Expense Splitter", "Group bill split with tip, weighted shares, and settlement amounts.", "AI Expense Splitter for Groups", "Split restaurant and trip bills fairly with tip.", ["expense splitter", "bill split calculator"]),
  "aist-ai-bill-planner": article("aist-ai-bill-planner", "Bill Planner", "Monthly bill load vs income with leftover buffer.", "AI Bill Planner — Monthly Bills", "Plan fixed bills against monthly income.", ["bill planner", "monthly bills"]),
  "aist-ai-lifestyle-cost-calculator": article("aist-ai-lifestyle-cost-calculator", "Lifestyle Cost", "Needs, wants, savings with 50/30/20 benchmark.", "AI Lifestyle Cost Calculator", "Break down monthly lifestyle spending.", ["lifestyle cost", "budget breakdown"]),
  "aist-ai-best-deal-finder": article("aist-ai-best-deal-finder", "Best Deal Finder", "Unit-price comparison across stores.", "AI Best Deal Finder", "Find the cheapest offer by unit price.", ["best deal finder", "unit price compare"]),
  "aist-ai-discount-optimizer": article("aist-ai-discount-optimizer", "Discount Optimizer", "Stack discounts, coupons, and cashback.", "AI Discount Optimizer", "Calculate effective price after stacked offers.", ["discount optimizer", "coupon stack"]),
  "aist-ai-price-comparison-advisor": article("aist-ai-price-comparison-advisor", "Price Comparison", "Score offers by price, shipping, warranty.", "AI Price Comparison Advisor", "Compare retailers with a value score.", ["price comparison", "shopping advisor"]),
  "aist-ai-trip-cost-planner": article("aist-ai-trip-cost-planner", "Trip Cost Planner", "Flights, stay, food, activities total.", "AI Trip Cost Planner", "Estimate full trip cost per person.", ["trip cost planner", "travel budget"]),
  "aist-ai-travel-budget-optimizer": article("aist-ai-travel-budget-optimizer", "Travel Budget Optimizer", "Allocate trip budget by category and style.", "AI Travel Budget Optimizer", "Optimize travel budget across categories.", ["travel budget optimizer", "trip allocation"]),
  "aist-ai-fuel-cost-predictor": article("aist-ai-fuel-cost-predictor", "Fuel Cost Predictor", "Trip fuel litres and cost from mileage.", "AI Fuel Cost Predictor", "Predict fuel cost for a drive or commute.", ["fuel cost calculator", "petrol trip cost"]),
};
