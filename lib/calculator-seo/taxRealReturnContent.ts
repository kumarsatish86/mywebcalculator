import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/tax-real-return-calculators";
const HUB_LABEL = "Finance · Tax and Real Return";
const SHELL =
  "Runs in your browser. Educational tax and inflation maths—not tax advice. Rates and exemptions change; verify with current law or a professional.";

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
        title: "Tax vs real return cheat sheet",
        columnHeaders: ["Concept", "Idea"],
        rows: [
          ["After-tax return", "Nominal × (1 − tax rate)"],
          ["Real return", "(1 + nominal) ÷ (1 + inflation) − 1"],
          ["ELSS", "Equity mutual fund with ~3-year lock-in; often used for 80C"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Nominal vs eroded purchasing power",
      caption: "Share URL preserves your inputs.",
      sparkValues: [1, 1.08, 1.12, 1.05, 1.18, 1.1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TAX_REAL_RETURN_ARTICLES: Record<string, RichArticle> = {
  "capital-gains-tax-calculator-india-global": article(
    "capital-gains-tax-calculator-india-global",
    "Capital gains tax (India equity + global flat)",
    [
      "India equity mode uses editable STCG/LTCG rates and an annual LTCG exemption for planning—defaults mirror common headline rates.",
      "Global flat mode applies a single percentage to the entire gain. Holding years classify short vs long term when relevant.",
    ],
    {
      question: "Are the India rates guaranteed correct?",
      answer:
        "No. Tax law changes. Treat defaults as planning placeholders and confirm STCG/LTCG rates, exemptions, and asset class rules for your FY.",
    },
    "Capital Gains Tax Calculator (India + Global)",
    "Estimate India equity or global flat capital gains tax from buy price, sell price, and holding period.",
    ["capital gains tax calculator", "STCG LTCG India", "capital gains estimator"],
  ),
  "tax-saving-investment-calculator": article(
    "tax-saving-investment-calculator",
    "Tax-saving investment (80C-style)",
    [
      "Eligible amount is capped at your annual deduction limit. Tax saved ≈ eligible × marginal rate.",
      "Net cost of investment = amount invested − tax saved (approximate cash outlay after the tax benefit).",
    ],
    {
      question: "Does this cover all of 80C?",
      answer:
        "It models a single capped pool. Other eligible investments and regime choice (old vs new) can change how much benefit you actually get.",
    },
    "Tax Saving Investment Calculator",
    "Estimate tax saved and net cost when investing under an annual deduction limit.",
    ["tax saving investment calculator", "80C tax benefit", "tax deductible investment"],
  ),
  "elss-calculator": article(
    "elss-calculator",
    "ELSS growth and lock-in",
    [
      "Projects SIP corpus with compound monthly growth, then estimates first-year 80C-style tax saving on annual invest (capped).",
      "Each ELSS purchase typically locks for three years—keep liquidity needs separate from the projection.",
    ],
    {
      question: "Does ELSS tax saving apply every year?",
      answer:
        "You can claim on amounts invested each year (subject to the overall 80C limit and your tax regime). Growth itself is taxed under capital gains rules on redemption.",
    },
    "ELSS Calculator",
    "Project ELSS SIP maturity value and approximate first-year tax benefit under a capped deduction.",
    ["ELSS calculator", "ELSS SIP", "equity linked savings scheme"],
  ),
  "after-tax-return-calculator": article(
    "after-tax-return-calculator",
    "After-tax return",
    [
      "After-tax return ≈ pre-tax return × (1 − tax rate). Simple model for interest or fully taxable gains.",
      "Tax drag is the percentage points lost to tax. Prefer tax-efficient wrappers when rules allow.",
    ],
    {
      question: "Does this work for equity LTCG?",
      answer:
        "Equity LTCG often has exemptions and preferential rates. Use the capital gains calculator for buy/sell tax estimates; this tool is for a flat effective tax on return.",
    },
    "After-Tax Return Calculator",
    "Convert pre-tax investment return into after-tax return at your marginal tax rate.",
    ["after tax return calculator", "tax adjusted return", "tax drag"],
  ),
  "real-rate-of-return-calculator": article(
    "real-rate-of-return-calculator",
    "Real rate of return",
    [
      "Real return removes inflation from nominal return: (1 + n) / (1 + i) − 1.",
      "A 12% nominal return with 5% inflation is closer to ~6.7% real—what purchasing power actually grew.",
    ],
    {
      question: "Should I use CPI or expense inflation?",
      answer:
        "Use the inflation that matches your goal (CPI, education, medical). Personal expense inflation often differs from headline CPI.",
    },
    "Real Rate of Return Calculator",
    "Calculate inflation-adjusted real return from nominal return and inflation.",
    ["real rate of return calculator", "inflation adjusted return", "real vs nominal"],
  ),
  "inflation-vs-return-calculator": article(
    "inflation-vs-return-calculator",
    "Inflation vs return over time",
    [
      "Compounds principal at the nominal rate, then shows real future value using the Fisher-style real rate.",
      "Purchasing-power gap highlights how much of the nominal future value is eroded when expressed in today's money.",
    ],
    {
      question: "Why isn't real FV just nominal FV minus inflation × years?",
      answer:
        "Inflation compounds. Dividing by (1 + inflation)^years (or compounding at the real rate) is the consistent approach.",
    },
    "Inflation vs Return Calculator",
    "Compare nominal wealth growth with real purchasing power over your investment horizon.",
    ["inflation vs return calculator", "purchasing power investment", "real wealth growth"],
  ),
};
