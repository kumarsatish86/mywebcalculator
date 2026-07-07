import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/ai-powered-salary-tools";
const HUB_LABEL = "Finance · AI-Powered Salary Tools";
const SHELL =
  "Runs in your browser. Multi-factor salary scoring and projections—not a live LLM or substitute for professional career advice.";

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
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Salary planning benchmarks",
        columnHeaders: ["Factor", "Typical range"],
        rows: [
          ["Annual raise (stay)", "6–12%"],
          ["Job switch bump", "20–40%"],
          ["Benefits load", "10–20% of base"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Experience × location → estimate",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.35, 0.5, 0.65, 0.82, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_POWERED_SALARY_ARTICLES: Record<string, RichArticle> = {
  "ai-salary-estimator": article(
    "ai-salary-estimator",
    "AI salary estimation model",
    [
      "Estimated salary = base market data × experience factor × location tier × skills premium.",
      "Enter a market median for your role from surveys or job boards, then adjust for years, city tier, and skills.",
    ],
    {
      question: "Is this connected to a live AI model?",
      answer: "No—it uses a transparent browser-side scoring model. Use it for planning; verify with real offer data.",
    },
    "AI Salary Estimator — Role, Skills, Location",
    "Estimate annual salary from market base, experience, location tier, and skills score.",
    ["AI salary estimator", "salary estimate by role", "salary calculator AI"],
  ),
  "ai-offer-analyzer": article(
    "ai-offer-analyzer",
    "Offer competitiveness score",
    [
      "Total compensation = base + bonus + benefits value. Score compares total comp to market median.",
      "Strong offers typically land 10%+ above median on total comp, including variable and benefits.",
    ],
    {
      question: "What counts as benefits value?",
      answer: "Health insurance, PF/gratuity employer share, stock, and perks—express as % of base for quick comparison.",
    },
    "AI Offer Analyzer — Good Offer or Not?",
    "Score whether a job offer is competitive vs market median including bonus and benefits.",
    ["AI offer analyzer", "job offer calculator", "is my offer good"],
  ),
  "ai-salary-negotiation-tool": article(
    "ai-salary-negotiation-tool",
    "Negotiation counter range",
    [
      "Recommended ask blends market median, current offer, and your walk-away floor.",
      "Use the counter range to plan your opening ask and acceptable settlement band.",
    ],
    {
      question: "Should I always ask for the recommended amount?",
      answer: "Use it as an anchor—adjust for role level, competing offers, and company pay bands.",
    },
    "AI Salary Negotiation Tool — Counter Offer Range",
    "Get a recommended counter-offer and negotiation insights based on market data.",
    ["salary negotiation tool", "counter offer calculator", "AI salary negotiation"],
  ),
  "ai-career-growth-predictor": article(
    "ai-career-growth-predictor",
    "Salary growth projection",
    [
      "Projects salary with compound annual raises and optional promotion bumps every few years.",
      "Job switches often outperform stay-put raises—use scenarios to compare paths.",
    ],
    {
      question: "What raise % should I assume?",
      answer: "8–12% is common in high-growth roles; 5–7% for stable tenures. Model promotions separately.",
    },
    "AI Career Growth Predictor — Salary Projection",
    "Project future salary with annual raises and promotion bumps over your chosen horizon.",
    ["career growth predictor", "salary projection calculator", "future salary estimate"],
  ),
  "ai-income-planner": article(
    "ai-income-planner",
    "Path to income target",
    [
      "Combines current income, target, expected raises, and side income to estimate years to goal.",
      "If the gap is large, increase skills, side revenue, or consider role changes—not just savings.",
    ],
    {
      question: "Does this include investment income?",
      answer: "Enter side income as a monthly figure—include freelance, rental, or portfolio withdrawals if relevant.",
    },
    "AI Income Planner — Reach Your Target",
    "Plan how long to reach a target income using raises and side income assumptions.",
    ["income planner", "salary goal calculator", "AI income planning"],
  ),
};
