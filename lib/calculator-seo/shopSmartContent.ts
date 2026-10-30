import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-smart-advanced";
const HUB_LABEL = "Daily life · Shopping · Smart and advanced retail calculators";
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
        title: "Smart and advanced retail tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Price elasticity estimator", "% Δ qty ÷ % Δ price"],
          ["Dynamic pricing scenario", "Demand shift at new tag"],
          ["Segmented discount", "Cohort-specific promo depth"],
          ["Cart abandonment recovery", "Win-back discount ROI"],
          ["Lifetime value discount", "Promo vs long-term CLV tradeoff"],
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

export const SHOP_SMART_ARTICLES: Record<string, RichArticle> = {
  "shop-price-elasticity-estimator": article(
    "shop-price-elasticity-estimator",
    "Price elasticity estimator",
    [
      "Estimates price elasticity of demand from observed percent price change and resulting percent quantity change — a teaching view for promo planning.",
      "Elasticity varies by segment, season, and competitive set — one historical window rarely predicts the next campaign.",
    ],
    {
      question: "What does elasticity below −1 mean?",
      answer:
        "Demand is elastic — a 1% price cut drives more than 1% volume gain. Inelastic goods (necessities) show elasticity closer to zero.",
    },
    "Price Elasticity Estimator — Demand Response to Price",
    "Estimate price elasticity from price and quantity changes. Retail analytics literacy — not a forecast guarantee.",
    ["price elasticity estimator", "demand elasticity retail", "price change volume impact"],
  ),
  "shop-dynamic-pricing-scenario-calculator": article(
    "shop-dynamic-pricing-scenario-calculator",
    "Dynamic pricing scenario",
    [
      "Models revenue outcome when price moves and expected unit volume shifts by an elasticity assumption you provide.",
      "Competitor price matching and stock clearance urgency override pure elasticity math in real merchandising.",
    ],
    {
      question: "Should I always raise price when stock is low?",
      answer:
        "Scarcity can support higher price, but customer trust erodes if prices surge on essentials. Balance margin with brand perception.",
    },
    "Dynamic Pricing Scenario Calculator — Revenue at New Price",
    "Simulate revenue when price and expected demand shift. Seller planning aid — competitive response not modeled.",
    ["dynamic pricing scenario calculator", "price change revenue model", "retail price simulation"],
  ),
  "shop-segmented-discount-calculator": article(
    "shop-segmented-discount-calculator",
    "Segmented discount",
    [
      "Compares blended margin when different customer segments receive different discount depths on the same SKU base cost.",
      "Personalized pricing must comply with fairness and discrimination laws in your market — segment math is not legal advice.",
    ],
    {
      question: "Why offer different discounts to different segments?",
      answer:
        "Price-sensitive segments may need deeper cuts to convert while loyal high-LTV segments buy with modest incentives — if policy allows.",
    },
    "Segmented Discount Calculator — Cohort Promo Depth",
    "Model margin impact of segment-specific discount rates. Merchandising aid — comply with local pricing laws.",
    ["segmented discount calculator", "cohort pricing promo", "customer segment discount"],
  ),
  "shop-cart-abandonment-recovery-discount-calculator": article(
    "shop-cart-abandonment-recovery-discount-calculator",
    "Cart abandonment recovery",
    [
      "Estimates ROI of a win-back discount email — recovered orders times margin minus discount cost and send cost.",
      "Over-aggressive recovery codes train customers to abandon carts intentionally — cap frequency and depth.",
    ],
    {
      question: "What discount depth recovers most carts?",
      answer:
        "Often 5–10% converts without eroding margin on would-have-bought-full-price shoppers. Test holdout groups to measure true lift.",
    },
    "Cart Abandonment Recovery Discount Calculator — Win-back ROI",
    "Calculate ROI of cart recovery promo discount. E-commerce ops aid — test against holdout group.",
    ["cart abandonment recovery discount", "win back email promo ROI", "abandoned cart discount"],
  ),
  "shop-lifetime-value-discount-calculator": article(
    "shop-lifetime-value-discount-calculator",
    "Lifetime value discount",
    [
      "Weighs upfront discount cost against expected customer lifetime value to see if acquisition promo pays back over repeat purchases.",
      "CLV models need repeat rate, average order value, and margin — speculative for new brands without history.",
    ],
    {
      question: "How deep a first-order discount can CLV support?",
      answer:
        "If expected margin over N repeat orders exceeds first-order discount plus CAC, the promo is rational. Model N conservatively.",
    },
    "Lifetime Value Discount Calculator — Promo vs CLV Payback",
    "Compare first-order discount to customer lifetime value payback. Growth planning aid — CLV is an estimate.",
    ["lifetime value discount calculator", "CLV vs acquisition promo", "first order discount payback"],
  ),
};
