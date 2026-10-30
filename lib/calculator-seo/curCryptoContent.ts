import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-cryptocurrency";
const HUB_LABEL = "Conversion · Currency · Cryptocurrency calculators";
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
        title: "Cryptocurrency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Pair converts", "Units × illustrative price"],
          ["Profit / ROI", "Buy vs sell with fees"],
          ["Staking / mining", "Yield and net reward estimates"],
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

export const CUR_CRYPTO_ARTICLES: Record<string, RichArticle> = {
  "cur-bitcoin-to-inr-calculator": article(
    "cur-bitcoin-to-inr-calculator",
    "Bitcoin to INR Calculator",
    ["BTC × illustrative INR price.", "Example default near teaching BTC/INR — not a live ticker."],
    { question: "Is this the live BTC price in India?", answer: "No. Enter your exchange quote. Defaults are illustrative." },
    "Bitcoin to INR Calculator — Example Price",
    "Convert BTC to INR with an editable example rate. Not live market data.",
    ["bitcoin to inr calculator", "btc inr converter"],
  ),
  "cur-ethereum-to-usd-calculator": article(
    "cur-ethereum-to-usd-calculator",
    "Ethereum to USD Calculator",
    ["ETH × illustrative USD price.", "Useful for gas-fee and portfolio teaching sketches."],
    { question: "Why USD for ETH?", answer: "Many feeds quote ETH/USD. Convert further with a separate FX tool if needed." },
    "Ethereum to USD Calculator — Example Price",
    "Convert ETH to USD with an example rate. Illustrative teaching estimate.",
    ["ethereum to usd calculator", "eth usd converter"],
  ),
  "cur-crypto-profit-calculator": article(
    "cur-crypto-profit-calculator",
    "Crypto Profit Calculator",
    ["Profit ≈ (sell − buy) × units − round-trip fees.", "Models simple spot P/L before tax."],
    { question: "Are fees always symmetric?", answer: "Exchanges differ. Enter your maker/taker or flat fee % if known." },
    "Crypto Profit Calculator — After Fees",
    "Estimate crypto profit from buy, sell, units, and fees. Not tax advice.",
    ["crypto profit calculator", "bitcoin profit calculator"],
  ),
  "cur-crypto-mining-calculator": article(
    "cur-crypto-mining-calculator",
    "Crypto Mining Calculator",
    ["Net ≈ (daily reward × scale − power) × days.", "Teaching mining economics — not pool payout guarantee."],
    { question: "Does hashrate scale rewards linearly?", answer: "Only in this simplified model. Real pools use shares and luck." },
    "Crypto Mining Calculator — Net Estimate",
    "Estimate net mining over days with reward and power cost. Teaching only.",
    ["crypto mining calculator", "mining profit calculator"],
  ),
  "cur-crypto-staking-calculator": article(
    "cur-crypto-staking-calculator",
    "Crypto Staking Calculator",
    ["Yield ≈ stake × APY × days/365 (simple).", "Does not compound unless you model compounding separately."],
    { question: "Is APY guaranteed?", answer: "No — protocol rewards change. Use current APY as an example input." },
    "Crypto Staking Calculator — Simple Yield",
    "Estimate staking yield from APY and days. Illustrative — not investment advice.",
    ["crypto staking calculator", "staking yield calculator"],
  ),
  "cur-crypto-tax-calculator": article(
    "cur-crypto-tax-calculator",
    "Crypto Tax Calculator",
    ["Tax ≈ taxable gain × tax%.", "Rough teaching form — not jurisdiction-specific tax advice."],
    { question: "Does this handle cost basis?", answer: "Enter taxable gain directly. Cost-basis rules vary by country." },
    "Crypto Tax Calculator — Teaching Estimate",
    "Estimate tax on crypto gain with a tax % input. Not professional tax advice.",
    ["crypto tax calculator", "bitcoin tax estimate"],
  ),
  "cur-crypto-portfolio-calculator": article(
    "cur-crypto-portfolio-calculator",
    "Crypto Portfolio Calculator",
    ["Portfolio = Σ(holding × illustrative price).", "Two-asset teaching snapshot — extend mentally for more coins."],
    { question: "Should I use exchange or index price?", answer: "Use consistent source prices. This tool uses whatever you enter." },
    "Crypto Portfolio Calculator — Two Holdings",
    "Sum portfolio value from holdings and example prices. Illustrative only.",
    ["crypto portfolio calculator", "bitcoin portfolio value"],
  ),
  "cur-crypto-roi-calculator": article(
    "cur-crypto-roi-calculator",
    "Crypto ROI Calculator",
    ["ROI% = (current − cost) ÷ cost × 100.", "Classic return on cost basis for a single position sketch."],
    { question: "Is ROI the same as CAGR?", answer: "No — ROI here ignores time. CAGR needs holding period." },
    "Crypto ROI Calculator — Return on Cost",
    "Compute crypto ROI% from cost and current value. Teaching estimate.",
    ["crypto roi calculator", "bitcoin roi calculator"],
  ),
  "cur-ethereum-gas-fee-calculator": article(
    "cur-ethereum-gas-fee-calculator",
    "Gas Fee Calculator (Ethereum)",
    ["Fee = gas × gwei / 1e9 ETH × illustrative ETH/USD.", "Translates gwei quote into fiat for a transaction sketch."],
    { question: "Why gwei?", answer: "Ethereum gas prices are commonly quoted in gwei (1e-9 ETH per unit)." },
    "Ethereum Gas Fee Calculator — USD Estimate",
    "Estimate ETH gas cost in USD from gas units and gwei. Example ETH price only.",
    ["ethereum gas fee calculator", "eth gas calculator"],
  ),
};
