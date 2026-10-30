import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-comparison";
const HUB_LABEL = "Daily life · Shopping · Price comparison calculators";
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
        title: "Price comparison tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Unit price comparison", "Price ÷ qty or weight per offer"],
          ["Pack size comparison", "Small vs jumbo pack unit cost"],
          ["Bulk vs retail", "Warehouse club vs supermarket tag"],
          ["Subscription vs one-time", "Recurring total vs single buy"],
          ["Cheapest option", "Rank offers by all-in cost"],
          ["Value for money", "Score price vs quality or size"],
          ["Inflation-adjusted comparison", "Past price in today's money"],
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

export const SHOP_COMPARE_ARTICLES: Record<string, RichArticle> = {
  "shop-unit-price-comparison-calculator": article(
    "shop-unit-price-comparison-calculator",
    "Unit price comparison",
    [
      "Normalizes two or more offers to price per unit (each, kg, L) so different pack sizes compare fairly.",
      "Include shipping, tax, and membership fees in the all-in column when deciding which retailer wins.",
    ],
    {
      question: "Why do stores show unit price on shelf tags?",
      answer:
        "Regulators often require unit pricing so shoppers can compare unlike pack sizes. Online carts rarely show it unless you calculate.",
    },
    "Unit Price Comparison Calculator — Per kg, L, or Each",
    "Compare offers on equal unit price basis. Grocery shopping aid — add shipping for online orders.",
    ["unit price comparison calculator", "compare price per kg", "normalize pack sizes"],
  ),
  "shop-pack-size-comparison-calculator": article(
    "shop-pack-size-comparison-calculator",
    "Pack size comparison",
    [
      "Pits small frequent-buy packs against larger jumbo packs on total cost and unit cost for your expected consumption window.",
      "Spoilage and storage space matter for perishables — cheapest per unit is not cheapest if you waste half the jumbo pack.",
    ],
    {
      question: "Is the family size always cheaper?",
      answer:
        "Often, but not always — especially during promos on smaller packs. Always compute unit price at current promo prices.",
    },
    "Pack Size Comparison Calculator — Small vs Jumbo Value",
    "Compare small and large pack total and unit cost. Smart shopping aid — factor spoilage for food.",
    ["pack size comparison calculator", "family size vs regular price", "jumbo pack unit cost"],
  ),
  "shop-bulk-vs-retail-comparison-calculator": article(
    "shop-bulk-vs-retail-comparison-calculator",
    "Bulk vs retail",
    [
      "Compares warehouse club or wholesale bulk pricing against conventional retail shelf tags for the same SKU class.",
      "Membership fees, minimum purchase quantities, and fuel to reach the warehouse belong in the true cost side.",
    ],
    {
      question: "When does bulk shopping not save money?",
      answer:
        "When annual membership fee plus waste exceeds unit savings, or when supermarkets match with loss-leader promos.",
    },
    "Bulk vs Retail Comparison Calculator — Club vs Supermarket",
    "Compare bulk warehouse price to retail shelf tag. Budget shopping aid — include membership cost.",
    ["bulk vs retail comparison", "warehouse club savings", "costco vs supermarket unit price"],
  ),
  "shop-subscription-vs-one-time-calculator": article(
    "shop-subscription-vs-one-time-calculator",
    "Subscription vs one-time",
    [
      "Totals subscription cost over a chosen horizon against repeat one-time purchases at current shelf or promo prices.",
      "Subscribe-and-save discounts can rise if you skip deliveries or if the list price hikes between shipments.",
    ],
    {
      question: "Are subscribe-and-save plans always cheaper?",
      answer:
        "Usually they offer 5–15% off, but one-time promos or store brands may beat subscription price on any given month.",
    },
    "Subscription vs One-time Calculator — Recurring vs Single Buy",
    "Compare subscription total cost to buying one-time over the same period. Pantry planning aid — prices change.",
    ["subscription vs one time calculator", "subscribe and save comparison", "recurring purchase cost"],
  ),
  "shop-cheapest-option-calculator": article(
    "shop-cheapest-option-calculator",
    "Cheapest option",
    [
      "Ranks multiple offers by all-in cost including tax, shipping, and coupons to highlight the lowest total.",
      "Warranty, return policy, and delivery speed are ignored — cheapest is not always best value for your needs.",
    ],
    {
      question: "Should I always pick the cheapest total?",
      answer:
        "Only if quality and seller trust are equal. A slightly higher price from a reputable seller may beat a gray-market bargain.",
    },
    "Cheapest Option Calculator — Lowest All-in Price",
    "Find cheapest offer after tax, shipping, and discounts. Deal hunting aid — verify seller reputation.",
    ["cheapest option calculator", "lowest total price compare", "best deal all in cost"],
  ),
  "shop-value-for-money-calculator": article(
    "shop-value-for-money-calculator",
    "Value for money",
    [
      "Combines price with a simple quality or size score you enter to rank options beyond raw cheapness.",
      "Subjective weights — durability, brand trust, features — belong in your score; the tool structures the tradeoff.",
    ],
    {
      question: "How do I score quality objectively?",
      answer:
        "Use review averages, warranty length, or specs that matter to you. Consistent scoring beats gut feel across options.",
    },
    "Value for Money Calculator — Price vs Quality Score",
    "Rank purchase options by value score combining price and quality. Smart shopping aid — scores are yours to set.",
    ["value for money calculator", "price quality score shopping", "best value purchase compare"],
  ),
  "shop-inflation-adjusted-comparison-calculator": article(
    "shop-inflation-adjusted-comparison-calculator",
    "Inflation-adjusted comparison",
    [
      "Restates a historical price in today's money using an inflation rate so past receipts compare fairly to current tags.",
      "Category inflation differs from CPI — food and electronics diverge from headline inflation indexes.",
    ],
    {
      question: "Why adjust old prices for inflation?",
      answer:
        "A ₹100 item ten years ago is not comparable to ₹100 today. Inflation adjustment reveals real price change versus nominal sticker shock.",
    },
    "Inflation-adjusted Comparison Calculator — Past Price Today",
    "Compare historical purchase price to current tags in today's money. Budget literacy aid — use relevant inflation rate.",
    ["inflation adjusted price calculator", "past price in today's money", "real price change shopping"],
  ),
};
