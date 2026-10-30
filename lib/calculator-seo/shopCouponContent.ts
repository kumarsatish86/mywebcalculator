import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-coupons-offers";
const HUB_LABEL = "Daily life · Shopping · Coupons, cashback, and offers calculators";
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
        title: "Coupons, cashback, and offers tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Coupon stack", "Sequential codes on one cart"],
          ["Cashback equivalent", "Post-pay rebate as % off"],
          ["Bank offer effective discount", "Card promo as true savings"],
          ["Wallet cashback", "UPI or wallet credit value"],
          ["Buy X get Y", "Free or discounted extra units"],
          ["Minimum purchase offer", "Spend threshold for promo"],
          ["First order bonus", "New customer signup credit"],
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

export const SHOP_COUPON_ARTICLES: Record<string, RichArticle> = {
  "shop-coupon-stack-calculator": article(
    "shop-coupon-stack-calculator",
    "Coupon stack",
    [
      "Applies multiple coupon or promo codes in sequence to estimate final cart total when stacking is allowed.",
      "Many retailers block stacking identical code types — manufacturer coupon plus store coupon may work; two store codes may not.",
    ],
    {
      question: "Do all coupons stack?",
      answer:
        "No. Read each promo's terms. Payment offers and item coupons often stack; duplicate percent-off cart codes usually do not.",
    },
    "Coupon Stack Calculator — Multiple Promo Codes",
    "Calculate final price when stacking allowed coupons. Checkout estimate — read stacking rules.",
    ["coupon stack calculator", "multiple promo codes cart", "stack discounts checkout"],
  ),
  "shop-cashback-equivalent-discount-calculator": article(
    "shop-cashback-equivalent-discount-calculator",
    "Cashback equivalent",
    [
      "Converts post-purchase cashback (wallet credit, points, or bank rebate) into an upfront discount equivalent percent.",
      "Delayed cashback has time value — a 10% credit in 90 days is worth less than 10% off today if you do not reuse it.",
    ],
    {
      question: "Is 10% cashback the same as 10% off?",
      answer:
        "On the same spend, the nominal percent matches, but cashback may cap, expire, or restrict categories — read fine print.",
    },
    "Cashback Equivalent Discount Calculator — Rebate as % Off",
    "Convert cashback offer to equivalent upfront discount percent. Deal comparison aid — caps and expiry apply.",
    ["cashback equivalent discount", "rebate as percent off", "post purchase cashback value"],
  ),
  "shop-bank-offer-effective-discount-calculator": article(
    "shop-bank-offer-effective-discount-calculator",
    "Bank offer effective discount",
    [
      "Models card-linked instant discount or cashback from bank promos as true savings on your net payable amount.",
      "Minimum spend, eligible BINs, and once-per-user caps can block the offer even when cart math looks qualifying.",
    ],
    {
      question: "Why did my bank offer not apply at checkout?",
      answer:
        "Wrong card network, expired campaign quota, or excluded categories are common. Offers apply on pre-booked eligible cards only.",
    },
    "Bank Offer Effective Discount Calculator — Card Promo Savings",
    "Calculate effective discount from bank card offer on purchase. Payment promo aid — verify eligibility.",
    ["bank offer discount calculator", "credit card instant discount", "card linked offer savings"],
  ),
  "shop-wallet-cashback-calculator": article(
    "shop-wallet-cashback-calculator",
    "Wallet cashback",
    [
      "Estimates wallet or UPI cashback credited after payment and optional subsequent redemption value on future spends.",
      "Wallet money often cannot be withdrawn as cash — value equals what you will spend through that wallet anyway.",
    ],
    {
      question: "Can wallet cashback be withdrawn?",
      answer:
        "Most shopping wallets restrict withdrawal — value is real only if you regularly pay through that wallet.",
    },
    "Wallet Cashback Calculator — UPI or Wallet Credit",
    "Estimate wallet cashback from purchase and redemption rules. Digital payment aid — withdrawal limits apply.",
    ["wallet cashback calculator", "UPI cashback value", "paytm phonepe cashback"],
  ),
  "shop-buy-x-get-y-calculator": article(
    "shop-buy-x-get-y-calculator",
    "Buy X get Y",
    [
      "Translates buy-X-get-Y-free or discounted promos into effective per-unit price and total cart cost.",
      "Category mix limits (buy 2 shirts get 1 sock) change value — enter SKUs and quantities that match the promo structure.",
    ],
    {
      question: "Is buy 2 get 1 free better than 33% off?",
      answer:
        "On three identical items, they are equivalent. On two items only, B2G1 may not trigger while 33% off still applies.",
    },
    "Buy X Get Y Calculator — Promo Unit Economics",
    "Calculate effective price under buy X get Y offers. Grocery and fashion aid — read category rules.",
    ["buy X get Y calculator", "buy 2 get 1 free price", "promo unit cost"],
  ),
  "shop-minimum-purchase-offer-calculator": article(
    "shop-minimum-purchase-offer-calculator",
    "Minimum purchase offer",
    [
      "Checks whether your cart meets a minimum spend for a coupon and shows gap or effective discount if you top up.",
      "Padding cart with filler to hit minimum can cost more than the coupon saves — compare gap cost to discount value.",
    ],
    {
      question: "Should I add items to reach minimum spend?",
      answer:
        "Only if the extra items are worth at least their price minus incremental discount. Avoid junk filler that negates savings.",
    },
    "Minimum Purchase Offer Calculator — Spend Threshold Promo",
    "Find cart gap to qualify for minimum spend coupon. Smart shopping aid — filler can erase savings.",
    ["minimum purchase offer calculator", "spend threshold coupon", "cart gap for promo"],
  ),
  "shop-first-order-bonus-calculator": article(
    "shop-first-order-bonus-calculator",
    "First order bonus",
    [
      "Models new-customer signup credit or percent-off first order as effective discount on your inaugural cart.",
      "One-account-per-household rules and phone verification block repeat abuse — bonuses are genuinely first-time only.",
    ],
    {
      question: "Do first-order codes work on sale items?",
      answer:
        "Often excluded. Read exclusions for clearance, marketplace items, and gift cards before counting the bonus.",
    },
    "First Order Bonus Calculator — New Customer Promo Value",
    "Calculate savings from first-order signup bonus or discount. App onboarding aid — exclusions apply.",
    ["first order bonus calculator", "new customer discount app", "signup promo value"],
  ),
};
