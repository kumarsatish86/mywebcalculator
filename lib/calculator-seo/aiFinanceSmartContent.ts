import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-finance";
const HUB_LABEL = "AI · Finance Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Educational brainstorming only; not financial advice.";

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
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Accuracy", "Verify with a professional before acting"]] }],
    chart: { kind: "sparkTrendDemo", title: "Plan → adjust → recheck", caption: "Iterate inputs as your situation changes.", sparkValues: [0.3, 0.5, 0.75, 1] },
    faq: [{ question: "Is this a live AI chatbot?", answer: "No—fixed formulas and heuristics only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_FINANCE_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-budget-planner": article(
    "aist-ai-budget-planner",
    "AI Budget Planner",
    "Maps monthly income to 50/30/20 needs, wants, and savings targets and flags surplus or shortfall.",
    "AI Budget Planner — 50/30/20 Split Calculator",
    "Plan monthly budget with needs/wants/savings targets. Browser-only rule-based planner.",
    ["ai budget planner", "50 30 20 budget calculator"],
  ),
  "aist-ai-expense-analyzer": article(
    "aist-ai-expense-analyzer",
    "AI Expense Analyzer",
    "Break down housing, food, transport, and other spend to find the dominant category.",
    "AI Expense Analyzer — Spending Category Breakdown",
    "Analyze expense categories and see which line item dominates monthly spend.",
    ["ai expense analyzer", "spending breakdown calculator"],
  ),
  "aist-ai-monthly-savings-planner": article(
    "aist-ai-monthly-savings-planner",
    "AI Monthly Savings Planner",
    "Compute required monthly savings to reach a goal by your deadline.",
    "AI Monthly Savings Planner — Goal Timeline",
    "Calculate monthly savings needed for a target amount and deadline.",
    ["monthly savings planner", "savings goal calculator"],
  ),
  "aist-ai-expense-optimization-tool": article(
    "aist-ai-expense-optimization-tool",
    "AI Expense Optimization",
    "Set a target cut percentage and get prioritized trim suggestions.",
    "AI Expense Optimization Tool — Cut Spending Targets",
    "Optimize expenses with a target cut percent and actionable trim ideas.",
    ["expense optimization", "reduce spending calculator"],
  ),
  "aist-ai-subscription-cost-analyzer": article(
    "aist-ai-subscription-cost-analyzer",
    "Subscription Cost Analyzer",
    "Annualize subscription spend and average cost per service.",
    "AI Subscription Cost Analyzer — Annual Burn",
    "Analyze total subscription costs and per-service averages.",
    ["subscription cost analyzer", "subscription spending calculator"],
  ),
  "aist-ai-investment-planner": article(
    "aist-ai-investment-planner",
    "AI Investment Planner",
    "Estimate SIP for a goal, horizon, and risk profile with sample allocation.",
    "AI Investment Planner — SIP for Goals",
    "Plan monthly SIP for an investment goal with risk-aware allocation hints.",
    ["ai investment planner", "sip goal calculator"],
  ),
  "aist-ai-portfolio-analyzer": article(
    "aist-ai-portfolio-analyzer",
    "AI Portfolio Analyzer",
    "Score equity/debt/other mix against your stated risk profile.",
    "AI Portfolio Analyzer — Allocation Score",
    "Analyze portfolio allocation drift vs low/medium/high risk targets.",
    ["portfolio analyzer", "asset mix calculator"],
  ),
  "aist-ai-sip-strategy-optimizer": article(
    "aist-ai-sip-strategy-optimizer",
    "SIP Strategy Optimizer",
    "Base SIP for a corpus target plus step-up suggestion.",
    "AI SIP Strategy Optimizer — Step-Up SIP",
    "Optimize SIP amount and step-up strategy for a target corpus.",
    ["sip strategy optimizer", "step up sip calculator"],
  ),
  "aist-ai-risk-analyzer-investor": article(
    "aist-ai-risk-analyzer-investor",
    "Investor Risk Analyzer",
    "Infer low/medium/high risk capacity from age, horizon, and income stability.",
    "AI Risk Analyzer — Investor Profile",
    "Analyze investor risk profile from age, horizon, and stability inputs.",
    ["risk analyzer investor", "investment risk profile"],
  ),
  "aist-ai-asset-allocation-calculator": article(
    "aist-ai-asset-allocation-calculator",
    "Asset Allocation Calculator",
    "Age- and risk-aware equity, debt, gold, and cash split.",
    "AI Asset Allocation Calculator — Equity Debt Mix",
    "Calculate suggested asset allocation by age and risk tolerance.",
    ["asset allocation calculator", "equity debt allocation"],
  ),
  "aist-ai-loan-advisor": article(
    "aist-ai-loan-advisor",
    "AI Loan Advisor",
    "Affordability verdict from income, existing EMIs, and proposed loan terms.",
    "AI Loan Advisor — Affordability Check",
    "Get a rule-based loan affordability verdict from income and DTI math.",
    ["ai loan advisor", "loan affordability calculator"],
  ),
  "aist-ai-emi-strategy-optimizer": article(
    "aist-ai-emi-strategy-optimizer",
    "EMI Strategy Optimizer",
    "Compare tenures and pick lowest-interest plan within EMI budget.",
    "AI EMI Strategy Optimizer — Tenure Comparison",
    "Compare EMI tenures and find lowest interest within your EMI cap.",
    ["emi strategy optimizer", "best emi tenure calculator"],
  ),
  "aist-ai-debt-repayment-planner": article(
    "aist-ai-debt-repayment-planner",
    "Debt Repayment Planner",
    "Snowball vs avalanche payoff time and interest on multiple debts.",
    "AI Debt Repayment Planner — Snowball vs Avalanche",
    "Compare snowball and avalanche debt payoff strategies.",
    ["debt repayment planner", "snowball avalanche calculator"],
  ),
  "aist-ai-credit-score-improver": article(
    "aist-ai-credit-score-improver",
    "Credit Score Improver",
    "Heuristic score estimate and action list from utilization and payment habits.",
    "AI Credit Score Improver — Action Plan",
    "Estimate credit score range and get improvement actions from utilization inputs.",
    ["credit score improver", "credit score calculator india"],
  ),
};
