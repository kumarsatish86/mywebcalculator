import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-ecommerce-seller";
const HUB_LABEL = "Daily life · Shopping · E-commerce and seller calculators";
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
        title: "E-commerce and seller tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Marketplace commission", "Sale × platform take rate"],
          ["Platform fee", "Fixed + percent per order"],
          ["Payment gateway fee", "MDR on captured amount"],
          ["Seller payout", "Gross − fees − refunds reserve"],
          ["Net revenue", "Sales − COGS − variable fees"],
          ["Free shipping threshold", "Cart gap to free delivery"],
          ["Shipping-included price", "Item tag absorbs freight cost"],
          ["Return rate impact", "Margin erosion from returns %"],
          ["COGS", "Unit cost × qty sold"],
          ["Inventory turnover", "COGS ÷ average inventory"],
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

export const SHOP_SELLER_ARTICLES: Record<string, RichArticle> = {
  "shop-marketplace-commission-calculator": article(
    "shop-marketplace-commission-calculator",
    "Marketplace commission",
    [
      "Estimates the platform referral or commission fee as a percent of item sale price before other deductions.",
      "Category-specific commission tiers, promotional fee holidays, and FBA-style fulfillment fees stack on top — model those separately.",
    ],
    {
      question: "Is commission calculated on pre-tax or post-discount price?",
      answer:
        "Most marketplaces charge on the customer-paid item price after seller-funded discounts. Tax pass-through treatment varies by platform.",
    },
    "Marketplace Commission Calculator — Platform Take Rate",
    "Estimate marketplace referral fee from sale price and rate. Seller planning aid — category rates differ.",
    ["marketplace commission calculator", "Amazon referral fee estimate", "platform take rate"],
  ),
  "shop-platform-fee-calculator": article(
    "shop-platform-fee-calculator",
    "Platform fee",
    [
      "Combines fixed per-order fees and variable percent charges into one platform cost for a sample transaction.",
      "Subscription plans, volume tiers, and cross-border listing fees change effective rates — recheck quarterly.",
    ],
    {
      question: "What is the difference between commission and platform fee?",
      answer:
        "Commission is usually the percent of sale. Platform fees may include listing, closing, or payment processing as separate lines.",
    },
    "Platform Fee Calculator — Fixed + Percent Charges",
    "Calculate total platform fees on an online order. E-commerce estimate — fee schedules change.",
    ["platform fee calculator", "ecommerce fixed and variable fees", "online selling charges"],
  ),
  "shop-payment-gateway-fee-calculator": article(
    "shop-payment-gateway-fee-calculator",
    "Payment gateway fee",
    [
      "Estimates merchant discount rate (MDR) and fixed authorization fees on the captured payment amount.",
      "International cards, AMEX, and BNPL wallets often carry higher MDR than domestic debit — enter the rate you actually pay.",
    ],
    {
      question: "Who pays payment gateway fees?",
      answer:
        "Typically the seller absorbs MDR unless surcharging is legal and disclosed in your market. Some platforms deduct fees before payout.",
    },
    "Payment Gateway Fee Calculator — MDR on Sale",
    "Estimate payment processing fee from transaction amount and MDR. Seller aid — card type affects rate.",
    ["payment gateway fee calculator", "MDR processing fee", "merchant discount rate"],
  ),
  "shop-seller-payout-calculator": article(
    "shop-seller-payout-calculator",
    "Seller payout",
    [
      "Subtracts marketplace, payment, and shipping label fees from gross sales to show expected seller payout.",
      "Reserve holds, chargebacks, and return refunds reduce later payouts — maintain a buffer beyond this snapshot.",
    ],
    {
      question: "When does payout arrive?",
      answer:
        "Settlement cycles vary — daily, weekly, or T+7 after delivery. This tool shows amount, not timing.",
    },
    "Seller Payout Calculator — Net After Marketplace Fees",
    "Calculate seller payout from gross sale minus platform and payment fees. Planning estimate — reserves may apply.",
    ["seller payout calculator", "net after marketplace fees", "ecommerce seller settlement"],
  ),
  "shop-net-revenue-calculator": article(
    "shop-net-revenue-calculator",
    "Net revenue",
    [
      "Shows contribution after cost of goods and variable selling fees — a quick unit-economics view per order or SKU.",
      "Fixed overhead, ads, and staff are not deducted — pair with break-even tools for full picture.",
    ],
    {
      question: "Is net revenue the same as profit?",
      answer:
        "Not quite. Net revenue here means sales minus direct COGS and variable fees. Operating profit also subtracts fixed costs.",
    },
    "Net Revenue Calculator — Sales Minus COGS and Fees",
    "Estimate net revenue after product cost and selling fees. Seller literacy aid — not GAAP accounting.",
    ["net revenue calculator", "contribution after COGS", "unit economics ecommerce"],
  ),
  "shop-free-shipping-threshold-calculator": article(
    "shop-free-shipping-threshold-calculator",
    "Free shipping threshold",
    [
      "Shows how much more a shopper must add to cart to qualify for free shipping at a stated minimum order value.",
      "Near-threshold filler items should still be useful — shipping savings lost to unwanted SKUs is a false economy.",
    ],
    {
      question: "Should sellers always offer free shipping thresholds?",
      answer:
        "Thresholds lift AOV but absorb freight cost. Model margin impact before matching competitor free-shipping bars.",
    },
    "Free Shipping Threshold Calculator — Cart Gap to Qualify",
    "Find remaining cart amount needed for free shipping. Shopper and seller planning aid — exclusions apply.",
    ["free shipping threshold calculator", "minimum order free delivery", "cart gap free shipping"],
  ),
  "shop-shipping-included-price-calculator": article(
    "shop-shipping-included-price-calculator",
    "Shipping-included price",
    [
      "Builds a single customer-facing price that embeds average shipping cost while preserving target item margin.",
      "Actual freight varies by zone — use blended shipping cost from recent labels, not a single hypothetical rate.",
    ],
    {
      question: "Why include shipping in the price instead of charging separately?",
      answer:
        "All-in pricing reduces cart abandonment on marketplaces where buyers filter for free delivery. You still pay carrier bills from margin.",
    },
    "Shipping-included Price Calculator — All-in Shelf Tag",
    "Set item price that absorbs shipping while keeping margin. Seller pricing aid — zones vary.",
    ["shipping included price calculator", "free shipping built into price", "all in product price"],
  ),
  "shop-return-rate-impact-calculator": article(
    "shop-return-rate-impact-calculator",
    "Return rate impact",
    [
      "Quantifies margin erosion when a fraction of orders are returned — factoring refund, restocking, and reverse logistics.",
      "Category return norms differ wildly — apparel runs higher than consumables. Use your trailing twelve-month rate when known.",
    ],
    {
      question: "How do returns affect net margin?",
      answer:
        "You lose sale revenue, may pay return shipping, and often cannot resell at full price. Even a 10% return rate can halve thin margins.",
    },
    "Return Rate Impact Calculator — Margin After Refunds",
    "Estimate profit impact from ecommerce return rate. Seller planning aid — restocking fees vary.",
    ["return rate impact calculator", "refund margin erosion", "ecommerce returns cost"],
  ),
  "shop-cogs-calculator": article(
    "shop-cogs-calculator",
    "COGS",
    [
      "Multiplies unit landed cost (product, freight-in, duties) by quantity sold for a period's cost of goods sold.",
      "Inventory shrink, spoilage, and write-downs belong in COGS adjustments — add them manually if material.",
    ],
    {
      question: "Does COGS include packaging?",
      answer:
        "Direct packaging tied to each unit shipped is usually included. Generic warehouse supplies often sit in overhead instead.",
    },
    "COGS Calculator — Cost of Goods Sold",
    "Calculate COGS from unit cost and quantity sold. Seller accounting literacy — not a tax filing tool.",
    ["COGS calculator", "cost of goods sold ecommerce", "landed unit cost total"],
  ),
  "shop-inventory-turnover-calculator": article(
    "shop-inventory-turnover-calculator",
    "Inventory turnover",
    [
      "Divides COGS by average inventory value to show how many times stock cycles per period — a cash-efficiency signal.",
      "Slow turnover ties up capital and increases obsolescence risk; very fast turnover may mean stockouts.",
    ],
    {
      question: "What is a healthy inventory turnover?",
      answer:
        "Depends on category. Grocery turns many times a year; luxury may turn slowly by design. Compare to your own history and peers.",
    },
    "Inventory Turnover Calculator — Stock Cycles per Period",
    "Calculate inventory turnover from COGS and average stock value. Retail ops aid — seasonal swings matter.",
    ["inventory turnover calculator", "stock turn ratio retail", "COGS divided by inventory"],
  ),
};
