import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/crypto-alternative-investment";
const HUB_LABEL = "Finance · Crypto and Alternative Investment";
const SHELL =
  "Runs in your browser. Educational planning maths for crypto and alternatives—not financial, tax, or investment advice. Markets are volatile.";

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
        title: "Alternatives cheat sheet",
        columnHeaders: ["Asset idea", "Key metric"],
        rows: [
          ["Crypto trade", "Net profit after fees"],
          ["Staking", "APY → compounded rewards"],
          ["Rental property", "Gross vs net yield"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Illustrative alt-asset path",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.45, 0.7, 0.55, 0.9, 0.75, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CRYPTO_ALTERNATIVE_INVESTMENT_ARTICLES: Record<string, RichArticle> = {
  "crypto-profit-calculator": article(
    "crypto-profit-calculator",
    "Crypto trade profit",
    [
      "Cost basis includes buy-side fees; proceeds are reduced by sell-side fees. Profit = net proceeds − cost basis.",
      "Quantity can be coins, tokens, or any unit—keep buy and sell prices on the same unit basis.",
    ],
    {
      question: "Does this include taxes?",
      answer:
        "No. Tax treatment (crypto as property, VDA rules, etc.) varies by jurisdiction. Use dedicated capital-gains tools for tax estimates.",
    },
    "Crypto Profit Calculator",
    "Estimate crypto trading profit or loss including exchange fee percentages.",
    ["crypto profit calculator", "bitcoin profit calculator", "crypto trade P&L"],
  ),
  "crypto-cagr-calculator": article(
    "crypto-cagr-calculator",
    "Crypto CAGR",
    [
      "CAGR = (final ÷ initial)^(1/years) − 1. Smooths a volatile path into one annualized rate.",
      "Useful for comparing multi-year holds; short periods can look extreme due to crypto volatility.",
    ],
    {
      question: "Is CAGR the same as average yearly return?",
      answer:
        "No. CAGR compounds a single rate; average of yearly returns can differ. CAGR is better for multi-year growth comparison.",
    },
    "Crypto CAGR Calculator",
    "Calculate annualized crypto portfolio CAGR from start value, end value, and years.",
    ["crypto CAGR calculator", "bitcoin CAGR", "crypto annualized return"],
  ),
  "staking-reward-calculator": article(
    "staking-reward-calculator",
    "Staking rewards",
    [
      "Models compound interest at the stated APY with a chosen compounds-per-year (often daily).",
      "Real staking rates, lockups, and slashing risk differ by network—treat APY as an input, not a promise.",
    ],
    {
      question: "Is APY the same as APR?",
      answer:
        "APR usually ignores compounding; APY includes it. This calculator compounds at your chosen frequency toward the APY-like ending balance.",
    },
    "Staking Reward Calculator",
    "Project compound crypto staking rewards from stake size, APY, and duration.",
    ["staking reward calculator", "crypto staking APY", "staking yield calculator"],
  ),
  "nft-roi-calculator": article(
    "nft-roi-calculator",
    "NFT ROI",
    [
      "Total cost = mint/buy + gas. Net proceeds = sale × (1 − marketplace fee %). ROI = profit ÷ total cost.",
      "Does not model royalties paid to creators separately—fold them into fee % if needed.",
    ],
    {
      question: "Should gas be in the same currency?",
      answer:
        "Convert gas to your quote currency first. Volatile gas prices can flip a trade from profit to loss.",
    },
    "NFT ROI Calculator",
    "Calculate NFT return on investment after mint/buy cost, gas, and marketplace fees.",
    ["NFT ROI calculator", "NFT profit calculator", "NFT marketplace fees"],
  ),
  "gold-investment-calculator": article(
    "gold-investment-calculator",
    "Gold investment P&L",
    [
      "Spot buy cost plus making charges forms your all-in investable amount; sell value uses grams × sell price per gram.",
      "Optional years held produce a CAGR versus all-in cost—handy for jewellery vs digital gold comparisons.",
    ],
    {
      question: "Do making charges apply on sale?",
      answer:
        "Usually you do not recover making charges when selling jewellery. This tool adds them only on the buy side by default.",
    },
    "Gold Investment Calculator",
    "Estimate gold profit including making charges and optional CAGR over your hold period.",
    ["gold investment calculator", "gold ROI", "jewellery making charges"],
  ),
  "real-estate-roi-calculator": article(
    "real-estate-roi-calculator",
    "Real estate total ROI",
    [
      "Total profit stacks price appreciation, cumulative net rent, and subtracts closing costs embedded in invested capital.",
      "Annualized ROI compounds ending wealth (invested + profit) back to an equivalent yearly rate.",
    ],
    {
      question: "What about leverage / mortgage?",
      answer:
        "This is an all-cash style ROI. With a loan, cash-on-cash return uses equity invested—model that separately with loan tools.",
    },
    "Real Estate ROI Calculator",
    "Combine property appreciation and net rental income into total and annualized ROI.",
    ["real estate ROI calculator", "property investment return", "rental property ROI"],
  ),
  "rental-yield-calculator": article(
    "rental-yield-calculator",
    "Gross vs net rental yield",
    [
      "Gross yield = annual rent ÷ property value. Net yield subtracts expenses (tax, maintenance, vacancy, management).",
      "Monthly rent is annual rent ÷ 12 for quick reading of cash-flow scale.",
    ],
    {
      question: "What yield is good?",
      answer:
        "It depends on city, risk, and interest rates. Compare net yield to local mortgage rates and risk-free alternatives, not a universal number.",
    },
    "Rental Yield Calculator",
    "Calculate gross and net rental yield from property value, rent, and annual expenses.",
    ["rental yield calculator", "gross rental yield", "net rental yield"],
  ),
};
