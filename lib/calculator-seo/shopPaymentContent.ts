import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-payment-emi";
const HUB_LABEL = "Daily life · Shopping · Payment, EMI, and financing calculators";
const SHELL =
  "Daily shopping and retail estimation tools that run in your browser. Not financial, legal, or tax advice. Store policies, tax rates, marketplace fees, and promo terms vary by retailer and region — verify amounts on your receipt or checkout screen.";

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
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Payment, EMI, and financing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["EMI", "Principal amortized over tenure"],
          ["No-cost EMI comparison", "Subvention vs upfront pay"],
          ["BNPL total cost", "Split pay fees and late charges"],
          ["Installment plan comparison", "Side-by-side tenure options"],
          ["Down payment", "Upfront slice of purchase price"],
          ["Interest on deferred payment", "Simple interest on delay"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your shopping inputs. Planning estimate only — store policies, tax rates, and promo terms vary by retailer and region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const SHOP_PAYMENT_ARTICLES: Record<string, RichArticle> = {
  "shop-emi-calculator": article(
    "shop-emi-calculator",
    "EMI",
    [
      "Calculates equated monthly installment from purchase principal, annual interest rate, and tenure in months.",
      "Processing fees, GST on interest, and insurance add-ons increase effective cost — add them for full comparison.",
    ],
    {
      question: "Is EMI interest calculated on reducing balance?",
      answer:
        "Most retail EMIs use reducing balance amortization. Flat-rate quotes are misleading — confirm method with the lender.",
    },
    "EMI Calculator — Monthly Installment on Purchase",
    "Calculate EMI amount for shopping finance from principal, rate, and tenure. Planning aid — not a loan offer.",
    ["EMI calculator shopping", "monthly installment purchase", "retail finance EMI"],
  ),
  "shop-no-cost-emi-comparison-calculator": article(
    "shop-no-cost-emi-comparison-calculator",
    "No-cost EMI comparison",
    [
      "Compares no-cost EMI (merchant or brand subvention) against paying upfront, highlighting hidden interest absorbed in price.",
      "No-cost EMI may forfeit instant discounts available on full swipe — compare all-in price, not just installment count.",
    ],
    {
      question: "Is no-cost EMI really free?",
      answer:
        "Interest is subsidized by merchant or brand — you pay zero explicit interest but may pay a higher item price or skip other discounts.",
    },
    "No-cost EMI Comparison Calculator — Subvention vs Upfront",
    "Compare no-cost EMI total to upfront payment with discounts. Checkout decision aid — read lender terms.",
    ["no cost EMI comparison", "zero interest EMI shopping", "subvention vs upfront pay"],
  ),
  "shop-bnpl-total-cost-calculator": article(
    "shop-bnpl-total-cost-calculator",
    "BNPL total cost",
    [
      "Totals buy-now-pay-later splits including service fees, late penalties, and optional express funding charges.",
      "Missed autopay dates trigger late fees fast — BNPL is convenient only with reliable account balances.",
    ],
    {
      question: "Does BNPL affect credit score?",
      answer:
        "Policies vary by provider and country. Some report missed payments to bureaus; others do not until collections.",
    },
    "BNPL Total Cost Calculator — Buy Now Pay Later Fees",
    "Calculate total cost of BNPL purchase including fees. Payment planning aid — late fees hurt most.",
    ["BNPL total cost calculator", "buy now pay later fees", "split pay total cost"],
  ),
  "shop-installment-plan-comparison-calculator": article(
    "shop-installment-plan-comparison-calculator",
    "Installment plan comparison",
    [
      "Places two or more installment tenures side by side on the same principal and rate to compare monthly outflow and total interest.",
      "Shorter tenure saves interest but raises EMI — pick the plan that fits cash flow without stretching budget.",
    ],
    {
      question: "Should I choose longest tenure for lowest EMI?",
      answer:
        "Lowest EMI costs most interest overall. Choose the shortest tenure you can comfortably afford.",
    },
    "Installment Plan Comparison Calculator — Tenure Options",
    "Compare EMI plans by tenure, monthly payment, and total interest. Shopping finance aid — verify with lender.",
    ["installment plan comparison", "compare EMI tenures", "3 vs 6 vs 12 month EMI"],
  ),
  "shop-down-payment-calculator": article(
    "shop-down-payment-calculator",
    "Down payment",
    [
      "Computes down payment amount from purchase price and percent or flat upfront contribution, leaving financed balance.",
      "Higher down payment cuts EMI and interest but ties up cash — balance liquidity needs against borrowing cost.",
    ],
    {
      question: "Is a larger down payment always better?",
      answer:
        "It lowers debt cost, but if cash earns more elsewhere or you need an emergency buffer, moderate down payment may be wiser.",
    },
    "Down Payment Calculator — Upfront Amount on Purchase",
    "Calculate down payment and financed balance from price and percent upfront. Budget planning aid — not lending advice.",
    ["down payment calculator shopping", "upfront percent purchase", "finance balance after down payment"],
  ),
  "shop-interest-on-deferred-payment-calculator": article(
    "shop-interest-on-deferred-payment-calculator",
    "Interest on deferred payment",
    [
      "Estimates simple interest when payment is deferred for a promotional period or vendor credit terms.",
      "Compound interest, penalty APR after promo expiry, and partial payments are not modeled — read credit agreement for those.",
    ],
    {
      question: "What happens if I miss deferred payment deadline?",
      answer:
        "Many promos accrue retroactive interest from purchase date if not paid in full by deadline — a costly surprise.",
    },
    "Interest on Deferred Payment Calculator — Pay Later Cost",
    "Estimate interest on deferred shopping payment over delay period. Credit literacy aid — promo expiry matters.",
    ["deferred payment interest calculator", "pay later interest cost", "vendor credit interest"],
  ),
};
