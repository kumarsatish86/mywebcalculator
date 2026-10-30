import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-delivery-logistics";
const HUB_LABEL = "Daily life · Shopping · Delivery and logistics calculators";
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
        title: "Delivery and logistics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Shipping cost estimator", "Weight, zone, and rate table"],
          ["Dimensional weight", "L×W×H ÷ divisor vs actual kg"],
          ["COD extra fee", "Cash on delivery surcharge"],
          ["Free shipping cart threshold", "Add-to-cart for free freight"],
          ["Split shipment cost", "Multiple packages freight total"],
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

export const SHOP_DELIVERY_ARTICLES: Record<string, RichArticle> = {
  "shop-shipping-cost-estimator": article(
    "shop-shipping-cost-estimator",
    "Shipping cost estimator",
    [
      "Estimates carrier freight from package weight, zone or distance band, and a base-plus-per-kg rate you enter.",
      "Fuel surcharges, remote area fees, and peak season peaks are carrier-specific — add buffers for quotes.",
    ],
    {
      question: "Why did actual shipping cost more than estimated?",
      answer:
        "Dimensional weight billing, residential delivery fee, or incorrect weight class commonly push final labels above quick estimates.",
    },
    "Shipping Cost Estimator — Freight by Weight and Zone",
    "Estimate parcel shipping cost from weight and zone rate. Online shopping aid — carrier surcharges extra.",
    ["shipping cost estimator", "parcel freight calculator", "delivery charge estimate"],
  ),
  "shop-dimensional-weight-calculator": article(
    "shop-dimensional-weight-calculator",
    "Dimensional weight",
    [
      "Computes billable weight from length, width, height, and carrier divisor — carriers charge the higher of actual vs dimensional weight.",
      "Light bulky packages (pillows, empty boxes) trigger dimensional weight — compact packaging saves freight.",
    ],
    {
      question: "What divisor do carriers use?",
      answer:
        "Common air divisors are 5000 (cm/kg) or 139–166 (in/lb) depending on carrier and service. Enter the divisor from your rate card.",
    },
    "Dimensional Weight Calculator — Billable Parcel Weight",
    "Calculate dimensional weight vs actual weight for shipping. E-commerce aid — carriers bill the higher.",
    ["dimensional weight calculator", "volumetric weight shipping", "LWH divisor freight"],
  ),
  "shop-cod-extra-fee-calculator": article(
    "shop-cod-extra-fee-calculator",
    "COD extra fee",
    [
      "Adds cash-on-delivery handling fee — flat or percent — to order total for true out-of-pocket on delivery.",
      "Some merchants waive COD below a cart value; others discourage COD entirely with high surcharges.",
    ],
    {
      question: "Is COD cheaper than prepaid?",
      answer:
        "Prepaid often avoids COD fees and may unlock extra discounts. COD trades convenience for surcharge and failed delivery risk.",
    },
    "COD Extra Fee Calculator — Cash on Delivery Surcharge",
    "Calculate total with COD handling fee on order. Checkout estimate — prepaid may save more.",
    ["COD fee calculator", "cash on delivery surcharge", "COD extra charge total"],
  ),
  "shop-free-shipping-cart-threshold-calculator": article(
    "shop-free-shipping-cart-threshold-calculator",
    "Free shipping cart threshold",
    [
      "Shows remaining cart value to reach free shipping minimum — shopper view of the same threshold sellers configure.",
      "Excluded categories (bulky goods, marketplace third-party) may not count toward threshold — read promo exclusions.",
    ],
    {
      question: "Should I always add items to get free shipping?",
      answer:
        "Only if filler cost is less than shipping fee you would pay. A ₹40 shipping fee does not justify ₹200 of unneeded goods.",
    },
    "Free Shipping Cart Threshold Calculator — Amount to Add",
    "Find how much more to spend for free delivery. Cart planning aid — category exclusions apply.",
    ["free shipping cart threshold", "amount for free delivery", "minimum cart free shipping"],
  ),
  "shop-split-shipment-cost-calculator": article(
    "shop-split-shipment-cost-calculator",
    "Split shipment cost",
    [
      "Totals freight when an order ships in multiple packages from different warehouses or staggered fulfillment.",
      "Partial free-shipping promos may apply only to the first package — sum each leg's rate for honest comparison.",
    ],
    {
      question: "Why did one order generate two shipping charges?",
      answer:
        "Split inventory across FCs, pre-order splits, or oversized items forcing separate labels each trigger independent freight.",
    },
    "Split Shipment Cost Calculator — Multi-package Freight",
    "Calculate total shipping when order splits into multiple parcels. Online shopping aid — each leg may bill separately.",
    ["split shipment cost calculator", "multiple package shipping total", "split order delivery fee"],
  ),
};
