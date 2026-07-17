import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/stock-market-calculators";
const HUB_LABEL = "Finance · Stock Market Calculators";
const SHELL =
  "Runs in your browser. Educational stock-market math—not trading advice. Markets can lose money; tax and brokerage rules change.";

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
        title: "Equity planning basics",
        columnHeaders: ["Metric", "Idea"],
        rows: [
          ["Return %", "(P&L + dividends) ÷ invested"],
          ["CAGR", "Smoothed annualized growth"],
          ["Dividend yield", "Annual DPS ÷ price"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Buy → hold → exit",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.4, 0.35, 0.55, 0.7, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const STOCK_MARKET_ARTICLES: Record<string, RichArticle> = {
  "stock-return-calculator": article(
    "stock-return-calculator",
    "Stock absolute return",
    [
      "Absolute P&L = sale proceeds + dividends − purchase cost. Return % = P&L ÷ invested × 100.",
      "Use average buy price if you accumulated over time.",
    ],
    {
      question: "Should I include fees?",
      answer: "For a precise net return, subtract brokerage and taxes—or use the brokerage and capital-gain calculators after.",
    },
    "Stock Return Calculator",
    "Calculate absolute profit/loss and return percentage including dividends.",
    ["stock return calculator", "share profit loss calculator", "equity return %"],
  ),
  "cagr-for-stocks-calculator": article(
    "cagr-for-stocks-calculator",
    "Stock CAGR",
    [
      "CAGR = (final / initial)^(1/years) − 1.",
      "Compare multi-year stock holdings on an annualized basis.",
    ],
    {
      question: "CAGR vs absolute return?",
      answer: "Absolute shows total gain; CAGR tells you the constant yearly rate that compounds to the same final value.",
    },
    "CAGR for Stocks Calculator",
    "Calculate compound annual growth rate for a stock investment over time.",
    ["stock CAGR calculator", "equity CAGR", "share annualized return"],
  ),
  "dividend-yield-calculator": article(
    "dividend-yield-calculator",
    "Dividend yield",
    [
      "Yield = annual dividend per share ÷ current share price × 100.",
      "Trailing yield uses last 12 months; forward yield uses expected dividends.",
    ],
    {
      question: "Is high yield always better?",
      answer: "Not always—very high yields can signal dividend cuts ahead or a falling price. Check payout sustainability.",
    },
    "Dividend Yield Calculator",
    "Compute dividend yield from annual DPS and share price.",
    ["dividend yield calculator", "stock dividend yield", "DPS yield"],
  ),
  "dividend-reinvestment-calculator": article(
    "dividend-reinvestment-calculator",
    "Dividend reinvestment (DRIP)",
    [
      "Each year, dividends buy more shares at the then-current price; price may also grow.",
      "Illustrates compounding when cash dividends are reinvested instead of withdrawn.",
    ],
    {
      question: "Do Indian brokers support DRIP automatically?",
      answer: "Many require manual reinvestment or a dividend reinvestment plan when offered by the company. Model this for planning.",
    },
    "Dividend Reinvestment Calculator",
    "Project portfolio value when stock dividends are reinvested with price growth.",
    ["dividend reinvestment calculator", "DRIP calculator", "reinvest dividends"],
  ),
  "stock-average-calculator": article(
    "stock-average-calculator",
    "Average buy price",
    [
      "Average price = (qty1×price1 + qty2×price2) ÷ (qty1 + qty2).",
      "Use when averaging down or up after a second purchase.",
    ],
    {
      question: "What about more than two lots?",
      answer: "Combine earlier lots into one effective quantity and cost, then average with the newest lot—or repeat pairwise.",
    },
    "Stock Average Calculator — Buy Average Price",
    "Find your average purchase price after two stock buy lots.",
    ["stock average calculator", "average buy price", "share averaging calculator"],
  ),
  "intraday-profit-loss-calculator": article(
    "intraday-profit-loss-calculator",
    "Intraday P&L",
    [
      "Gross P&L = (sell − buy) × quantity. Net P&L subtracts brokerage on turnover and other charges.",
      "Intraday still carries overnight and market risk until closed—treat as education only.",
    ],
    {
      question: "Is leverage included?",
      answer: "No—enter traded quantity and prices only. Margin/leverage costs vary by broker.",
    },
    "Intraday Profit/Loss Calculator",
    "Estimate same-day stock P&L after brokerage charges.",
    ["intraday calculator", "intraday profit loss", "day trading P&L"],
  ),
  "brokerage-calculator": article(
    "brokerage-calculator",
    "Equity brokerage breakdown",
    [
      "Estimates brokerage, STT (on sell), exchange charges, and GST on a round-trip equity trade.",
      "Defaults are planning placeholders—replace with your broker’s tariff card.",
    ],
    {
      question: "Delivery vs intradate fees?",
      answer: "Structures differ. Adjust brokerage % and note STT is typically charged on the sell side for delivery equity.",
    },
    "Brokerage Calculator — Equity Charges",
    "Break down brokerage, STT, exchange fees, and GST on buy and sell.",
    ["brokerage calculator", "share trading charges", "equity brokerage India"],
  ),
  "capital-gain-calculator-equity": article(
    "capital-gain-calculator-equity",
    "Equity capital gains tax (planning)",
    [
      "Holding ≤ 1 year → STCG; > 1 year → LTCG. Planning defaults: STCG 20%, LTCG 12.5% on gains above ₹1.25 lakh exemption.",
      "Rules and rates change—confirm with current Income Tax law or a tax professional.",
    ],
    {
      question: "Does this include surcharge and cess?",
      answer: "No—this is a simplified slab estimate. Actual liability may include surcharge, cess, and different exemptions.",
    },
    "Capital Gain Calculator (Equity)",
    "Estimate STCG vs LTCG tax on listed equity with planning rate defaults.",
    ["capital gain calculator equity", "LTCG calculator shares", "STCG equity tax"],
  ),
  "portfolio-return-calculator": article(
    "portfolio-return-calculator",
    "Weighted portfolio return",
    [
      "Portfolio return = Σ (weight_i × return_i) where weights are market-value shares.",
      "Supports two required holdings and an optional third.",
    ],
    {
      question: "Can I use expected returns?",
      answer: "Yes—enter forecast returns for scenario planning, or historical returns for look-back analysis.",
    },
    "Portfolio Return Calculator",
    "Calculate value-weighted return across 2–3 stock holdings.",
    ["portfolio return calculator", "weighted average return", "stock portfolio return"],
  ),
  "risk-vs-return-calculator": article(
    "risk-vs-return-calculator",
    "Risk-adjusted return",
    [
      "Sharpe-like score = (expected return − risk-free rate) ÷ volatility.",
      "Higher scores mean more excess return per unit of assumed risk.",
    ],
    {
      question: "Is this a true Sharpe ratio?",
      answer: "It is a simplified educational form. True Sharpe uses portfolio excess return standard deviation over a sample period.",
    },
    "Risk vs Return Calculator",
    "Compare expected return to volatility with a Sharpe-like risk-adjusted score.",
    ["risk vs return calculator", "Sharpe ratio calculator", "risk adjusted return"],
  ),
};
