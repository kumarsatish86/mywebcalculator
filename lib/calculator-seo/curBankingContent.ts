import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-banking-transfer";
const HUB_LABEL = "Conversion · Currency · Banking and international transfer calculators";
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
        title: "Banking and transfer tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Remittance", "(send − fees) × rate"],
          ["Wire / PayPal / Stripe", "Fee schedules as teaching defaults"],
          ["Bank FX", "Mid × (1 − markup%)"],
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

export const CUR_BANKING_ARTICLES: Record<string, RichArticle> = {
  "cur-international-money-transfer-calculator": article(
    "cur-international-money-transfer-calculator",
    "International Money Transfer Calculator",
    ["Received = (send − fees) × illustrative FX rate.", "Models common remittance fee structure for teaching."],
    { question: "Do all transfers deduct fees before FX?", answer: "Most do, but confirm your provider’s order of operations." },
    "International Money Transfer Calculator",
    "Estimate received amount after fees and example FX. Not live quotes.",
    ["international money transfer calculator", "remittance calculator"],
  ),
  "cur-remittance-calculator-india": article(
    "cur-remittance-calculator-india",
    "Remittance Calculator (India-focused)",
    ["India-focused teaching: net send × illustrative rate.", "Popular for NRI and inbound transfer planning sketches."],
    { question: "Is this RBI rate?", answer: "No. Enter your bank or fintech quote — defaults are illustrative." },
    "Remittance Calculator India — Teaching Estimate",
    "Estimate India remittance received with example rate and fees.",
    ["remittance calculator india", "send money to india calculator"],
  ),
  "cur-wire-transfer-fee-calculator": article(
    "cur-wire-transfer-fee-calculator",
    "Wire Transfer Fee Calculator",
    ["Wire fee = % + fixed; total charged = amount + fee.", "Separates sender-side wire costs from FX."],
    { question: "Who pays wire fees?", answer: "Depends on SHA/OUR/BEN instructions. This tool models sender-side total charged." },
    "Wire Transfer Fee Calculator",
    "Estimate wire fees and total charged. Verify with your bank.",
    ["wire transfer fee calculator", "bank wire cost"],
  ),
  "cur-paypal-fee-calculator": article(
    "cur-paypal-fee-calculator",
    "PayPal Fee Calculator",
    ["PayPal-style defaults (e.g. 2.9% + fixed).", "Teaching schedule — live PayPal fees vary by country and product."],
    { question: "Are PayPal fees the same globally?", answer: "No. Edit fee % and fixed to match your account’s fee page." },
    "PayPal Fee Calculator — Teaching Defaults",
    "Estimate PayPal-style fees with editable %. Illustrative only.",
    ["paypal fee calculator", "paypal transaction fee"],
  ),
  "cur-stripe-fee-calculator": article(
    "cur-stripe-fee-calculator",
    "Stripe Fee Calculator",
    ["Net ≈ amount − (% + fixed).", "Merchant-side teaching estimate for card payments."],
    { question: "Does Stripe charge FX on top?", answer: "Cross-border cards may add FX. This model is fee-only on amount." },
    "Stripe Fee Calculator — Net Received",
    "Estimate Stripe-style net after fees. Verify live pricing.",
    ["stripe fee calculator", "payment processing fee"],
  ),
  "cur-currency-conversion-fee-calculator": article(
    "cur-currency-conversion-fee-calculator",
    "Currency Conversion Fee Calculator",
    ["Spread cost ≈ amount × spread%.", "Shows markup taken as percent of principal."],
    { question: "Is spread the same as fee?", answer: "Spread is embedded in the rate; this tool models it as % of amount for teaching." },
    "Currency Conversion Fee Calculator",
    "Estimate conversion spread cost as % of amount. Teaching aid.",
    ["currency conversion fee", "fx spread calculator"],
  ),
  "cur-bank-exchange-rate-calculator": article(
    "cur-bank-exchange-rate-calculator",
    "Bank Exchange Rate Calculator",
    ["Bank rate ≈ mid × (1 − markup%).", "Shows how retail bank rates lag mid-market."],
    { question: "Why is bank rate worse than mid?", answer: "Banks embed markup/spread for profit and operational cost." },
    "Bank Exchange Rate Calculator — Markup on Mid",
    "Compute bank rate from mid-market and markup %. Illustrative example.",
    ["bank exchange rate calculator", "retail fx rate"],
  ),
};
