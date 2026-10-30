import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-ecommerce";
const HUB_LABEL = "Business · Marketing · E-commerce marketing calculators";
const SHELL =
  "Business marketing estimation tools that run in your browser. Not financial, legal, or tax advice. Ad platforms, attribution models, and fees vary — verify figures in your analytics and billing consoles.";

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
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "E-commerce marketing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Cart abandonment", "Teaching metric from inputs"],
          ["Checkout conversion", "Teaching metric from inputs"],
          ["Revenue loss", "Teaching metric from inputs"],
          ["Discount impact", "Teaching metric from inputs"],
          ["Ecommerce margin", "Teaching metric from inputs"],
          ["Upsell revenue", "Teaching metric from inputs"],
          ["Customer retention", "Teaching metric from inputs"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your marketing inputs. Planning estimate only — platforms, attribution, and costs vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MKT_ECOM_ARTICLES: Record<string, RichArticle> = {
  "mkt-cart-abandonment-rate-calculator": article(
    "mkt-cart-abandonment-rate-calculator",
    "Cart abandonment",
    [
      "Cart abandonment teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cart abandonment calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cart abandonment Calculator — Marketing Teaching Estimate",
    "Estimate cart abandonment from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cart abandonment calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-checkout-conversion-rate-calculator": article(
    "mkt-checkout-conversion-rate-calculator",
    "Checkout conversion",
    [
      "Checkout conversion teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Checkout conversion calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Checkout conversion Calculator — Marketing Teaching Estimate",
    "Estimate checkout conversion from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["checkout conversion calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-revenue-loss-calculator": article(
    "mkt-revenue-loss-calculator",
    "Revenue loss",
    [
      "Revenue loss teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Revenue loss calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Revenue loss Calculator — Marketing Teaching Estimate",
    "Estimate revenue loss from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["revenue loss calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-discount-impact-calculator": article(
    "mkt-discount-impact-calculator",
    "Discount impact",
    [
      "Discount impact teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Discount impact calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Discount impact Calculator — Marketing Teaching Estimate",
    "Estimate discount impact from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["discount impact calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-profit-margin-ecommerce-calculator": article(
    "mkt-profit-margin-ecommerce-calculator",
    "Ecommerce margin",
    [
      "Ecommerce margin teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Ecommerce margin calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Ecommerce margin Calculator — Marketing Teaching Estimate",
    "Estimate ecommerce margin from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["ecommerce margin calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-upsell-revenue-calculator": article(
    "mkt-upsell-revenue-calculator",
    "Upsell revenue",
    [
      "Upsell revenue teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Upsell revenue calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Upsell revenue Calculator — Marketing Teaching Estimate",
    "Estimate upsell revenue from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["upsell revenue calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-customer-retention-rate-calculator": article(
    "mkt-customer-retention-rate-calculator",
    "Customer retention",
    [
      "Customer retention teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Customer retention calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Customer retention Calculator — Marketing Teaching Estimate",
    "Estimate customer retention from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["customer retention calculator", "marketing metric", "campaign calculator"],
  ),
};
