import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-profit-margin";
const HUB_LABEL = "Daily life · Shopping · Profit and margin calculators";
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
        title: "Profit and margin tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Gross margin", "(Revenue − COGS) ÷ revenue"],
          ["Net profit", "Revenue − all expenses"],
          ["Profit margin percent", "Profit ÷ revenue × 100"],
          ["Break-even units", "Fixed costs ÷ unit contribution"],
          ["Break-even revenue", "Fixed costs ÷ margin rate"],
          ["Markup from cost", "Sell price from cost + markup"],
          ["Target margin price", "Cost ÷ (1 − margin target)"],
          ["Discounted margin", "Margin after promo price cut"],
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

export const SHOP_MARGIN_ARTICLES: Record<string, RichArticle> = {
  "shop-gross-margin-calculator": article(
    "shop-gross-margin-calculator",
    "Gross margin",
    [
      "Calculates gross margin percent from revenue and cost of goods — profit before operating expenses.",
      "Use consistent revenue basis (pre-tax, net of returns) when comparing SKUs or months.",
    ],
    {
      question: "What is a good gross margin for retail?",
      answer:
        "Varies by category — grocery may be 20–30%, specialty retail 50%+. Benchmark against your category, not a universal target.",
    },
    "Gross Margin Calculator — Revenue Minus COGS",
    "Calculate gross margin percent from sales and product cost. Seller planning aid — not tax advice.",
    ["gross margin calculator", "retail gross margin percent", "COGS margin"],
  ),
  "shop-net-profit-calculator": article(
    "shop-net-profit-calculator",
    "Net profit",
    [
      "Subtracts COGS, fees, and operating expenses from revenue to estimate net profit for a period or order.",
      "One-off capex and owner draws are not operating expenses — exclude them for recurring profitability view.",
    ],
    {
      question: "Why is net profit lower than gross margin suggests?",
      answer:
        "Rent, payroll, marketing, and payment fees sit below gross margin. Thin gross margins leave little room for these fixed costs.",
    },
    "Net Profit Calculator — Bottom Line After Expenses",
    "Estimate net profit from revenue minus costs and fees. Small business aid — verify with accountant.",
    ["net profit calculator", "retail bottom line", "profit after expenses"],
  ),
  "shop-profit-margin-percent-calculator": article(
    "shop-profit-margin-percent-calculator",
    "Profit margin percent",
    [
      "Expresses profit as a percentage of revenue — the standard way to compare profitability across price points.",
      "Margin on discounted promos should use the promo selling price, not list MSRP, or you will overstate margin.",
    ],
    {
      question: "Is profit margin the same as markup?",
      answer:
        "No. Margin is profit ÷ selling price. Markup is profit ÷ cost. They use different denominators.",
    },
    "Profit Margin Percent Calculator — Profit ÷ Revenue",
    "Calculate profit margin percentage from revenue and profit. Retail literacy aid — use net selling price.",
    ["profit margin percent calculator", "margin on sales", "retail profit rate"],
  ),
  "shop-break-even-units-calculator": article(
    "shop-break-even-units-calculator",
    "Break-even units",
    [
      "Divides fixed costs by per-unit contribution margin to find how many units must sell to cover overhead.",
      "Seasonal fixed costs and partial capacity utilization mean break-even shifts month to month — update inputs regularly.",
    ],
    {
      question: "What counts as contribution margin per unit?",
      answer:
        "Selling price minus variable costs per unit (COGS, shipping, marketplace fees). Fixed rent is not in contribution.",
    },
    "Break-even Units Calculator — Fixed Costs ÷ Contribution",
    "Find units needed to cover fixed costs at your margin. Seller planning aid — variable costs must be accurate.",
    ["break even units calculator", "units to cover overhead", "contribution margin break even"],
  ),
  "shop-break-even-revenue-calculator": article(
    "shop-break-even-revenue-calculator",
    "Break-even revenue",
    [
      "Divides fixed costs by gross margin rate to show revenue dollars needed to reach zero operating profit.",
      "Useful when planning sales targets before a launch or promo season with known overhead.",
    ],
    {
      question: "Break-even revenue or units — which first?",
      answer:
        "They answer the same break-even point in different units. Use revenue view for top-line targets; units for inventory planning.",
    },
    "Break-even Revenue Calculator — Sales to Cover Fixed Costs",
    "Calculate revenue needed to break even at your margin rate. Business planning estimate — not investment advice.",
    ["break even revenue calculator", "sales target cover costs", "zero profit revenue"],
  ),
  "shop-markup-from-cost-calculator": article(
    "shop-markup-from-cost-calculator",
    "Markup from cost",
    [
      "Sets selling price by applying a markup percentage to unit cost — the inverse view of margin-from-price tools.",
      "After choosing markup, check implied margin — high markups on low-cost goods can still look like modest margin percent.",
    ],
    {
      question: "How do I convert markup to margin?",
      answer:
        "Margin = markup ÷ (1 + markup). Example: 100% markup on cost equals 50% margin on selling price.",
    },
    "Markup from Cost Calculator — Price from Markup %",
    "Calculate selling price from cost and markup percent. Pricing aid — verify competitive shelf tags.",
    ["markup from cost calculator", "price from cost markup", "keystone pricing"],
  ),
  "shop-target-margin-price-calculator": article(
    "shop-target-margin-price-calculator",
    "Target margin price",
    [
      "Back-solves selling price from cost and a target margin percent using price = cost ÷ (1 − margin).",
      "MAP, psychological price points, and competitor undercutting may force you below target — treat as floor, not mandate.",
    ],
    {
      question: "Why divide by (1 − margin) instead of multiplying cost?",
      answer:
        "Margin is on selling price, not cost. To keep 40% margin, cost must be 60% of price, so price = cost ÷ 0.6.",
    },
    "Target Margin Price Calculator — Price for Desired Margin",
    "Find selling price needed to hit target margin from cost. Seller pricing aid — market may not allow it.",
    ["target margin price calculator", "price for 40 percent margin", "margin based pricing"],
  ),
  "shop-discounted-margin-calculator": article(
    "shop-discounted-margin-calculator",
    "Discounted margin",
    [
      "Shows remaining gross margin when a promo discount cuts selling price but unit COGS stays fixed.",
      "Deep discounts can sell below variable cost — know your floor before running loss-leader promos.",
    ],
    {
      question: "When is a sale price below cost acceptable?",
      answer:
        "Strategic loss leaders drive traffic if lifetime value or basket attach makes up the loss. Model total basket margin, not one SKU.",
    },
    "Discounted Margin Calculator — Margin After Promo Price",
    "Calculate gross margin after applying a sale discount. Promo planning aid — watch variable cost floor.",
    ["discounted margin calculator", "margin after sale price", "promo profit impact"],
  ),
};
