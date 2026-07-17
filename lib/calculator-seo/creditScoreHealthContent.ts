import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/credit-score-health-calculators";
const HUB_LABEL = "Finance · Credit Score and Health";
const SHELL =
  "Runs in your browser. Educational credit-health models—not a credit bureau score. CIBIL/Experian/Equifax scores and lender decisions use proprietary data.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "loanBalanceDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Credit health basics",
        columnHeaders: ["Factor", "Typical impact"],
        rows: [
          ["Payment history", "Largest driver of score"],
          ["Utilization", "Keep under ~30% across cards"],
          ["Inquiries", "Multiple recent hard pulls can hurt"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Utilization vs healthy band",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Score improvement trajectory",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.55, 0.62, 0.68, 0.74, 0.8, 0.88, 0.95],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CREDIT_SCORE_HEALTH_ARTICLES: Record<string, RichArticle> = {
  "credit-score-simulator": article(
    "credit-score-simulator",
    "Credit score simulator",
    [
      "Weighted educational model—not CIBIL's actual algorithm. Combines payment history, utilization, credit age, inquiries, and mix.",
      "Use to see which levers matter most before applying for new credit.",
    ],
    {
      question: "Will this match my CIBIL score?",
      answer: "No. Bureaus use proprietary models and full tradeline data. Treat output as directional planning only.",
    },
    "Credit Score Simulator",
    "Estimate an educational credit score from payment history, utilization, age, inquiries, and mix.",
    ["credit score simulator", "estimate credit score", "CIBIL score calculator"],
    "sparkTrendDemo",
  ),
  "credit-utilization-ratio-calculator": article(
    "credit-utilization-ratio-calculator",
    "Credit utilization ratio",
    [
      "Overall utilization = sum of balances ÷ sum of limits across entered cards.",
      "Under ~30% is commonly cited as healthy; under ~10% is excellent for score optimization.",
    ],
    {
      question: "Per-card or overall utilization?",
      answer: "Both matter—high utilization on one card can hurt even if overall is low. This tool shows aggregate utilization.",
    },
    "Credit Utilization Ratio Calculator",
    "Calculate overall credit utilization from comma-separated card balances and limits.",
    ["credit utilization calculator", "utilization ratio", "credit card usage percent"],
    "loanBalanceDemo",
  ),
  "credit-score-improvement-calculator": article(
    "credit-score-improvement-calculator",
    "Score improvement projection",
    [
      "Models score gain from lowering utilization and adding months of on-time payments.",
      "Real bureau updates lag reporting cycles—improvements appear over 1–3 statement cycles.",
    ],
    {
      question: "How fast will my score update?",
      answer: "Issuers typically report monthly. A single on-time month may not move the score much; sustained behavior does.",
    },
    "Credit Score Improvement Calculator",
    "Project credit score gain from lowering utilization and on-time payment history.",
    ["credit score improvement", "raise credit score", "fix credit score"],
    "sparkTrendDemo",
  ),
  "loan-eligibility-based-on-credit-score": article(
    "loan-eligibility-based-on-credit-score",
    "Loan eligibility by score",
    [
      "Maps score bands to indicative income multipliers for max suggested loan amount.",
      "Eligibility also depends on employment, existing EMIs, collateral, and lender policy.",
    ],
    {
      question: "Why was I declined despite a good score?",
      answer: "Thin file, high FOIR, recent delinquencies, or policy caps can decline strong scores. This is not underwriting.",
    },
    "Loan Eligibility Based on Credit Score",
    "Indicative loan eligibility and max amount from credit score and monthly income.",
    ["loan eligibility credit score", "credit score loan amount", "CIBIL loan eligibility"],
    "none",
  ),
  "credit-limit-recommendation-calculator": article(
    "credit-limit-recommendation-calculator",
    "Credit limit recommendation",
    [
      "Suggests total revolving limit from income and score tier—higher scores support higher limits relative to income.",
      "Headroom = suggested total minus limits you already hold.",
    ],
    {
      question: "Should I ask for a limit increase?",
      answer: "If utilization is high but payment history is strong, a limit increase can lower utilization without paying down debt.",
    },
    "Credit Limit Recommendation Calculator",
    "Estimate suggested total credit card limit from income, score, and existing limits.",
    ["credit limit calculator", "how much credit limit", "increase credit limit"],
    "sparkTrendDemo",
  ),
  "how-long-to-improve-credit-score-calculator": article(
    "how-long-to-improve-credit-score-calculator",
    "Time to reach target score",
    [
      "Rough months = score gap ÷ estimated monthly gain from utilization improvement and on-time history.",
      "Large jumps (100+ points) usually take many months of consistent behavior.",
    ],
    {
      question: "Can disputes speed this up?",
      answer: "Correcting reporting errors can help quickly. Legitimate negative marks generally age off over years.",
    },
    "How Long to Improve Credit Score Calculator",
    "Estimate months to reach a target credit score from monthly utilization improvement.",
    ["how long improve credit score", "credit score timeline", "months to fix credit"],
    "sparkTrendDemo",
  ),
  "credit-risk-assessment-tool": article(
    "credit-risk-assessment-tool",
    "Credit risk assessment",
    [
      "Combines score, utilization, DTI, and recent lates into a simple 0–100 risk score and band.",
      "Useful for self-check before applying or co-signing—not for institutional credit decisions.",
    ],
    {
      question: "What is a safe DTI?",
      answer: "Many lenders prefer total obligations under ~40–50% of gross income. Lower is safer for new credit.",
    },
    "Credit Risk Assessment Tool",
    "Simple credit risk score from credit score, utilization, DTI, and late payments.",
    ["credit risk assessment", "credit health check", "borrower risk calculator"],
    "none",
  ),
};
