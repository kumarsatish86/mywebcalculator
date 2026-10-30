import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-discounts-pricing";
const HUB_LABEL = "Daily life · Shopping · Discount and pricing calculators";
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
        title: "Discount and pricing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Discount", "Original × (1 − percent off)"],
          ["Percentage off", "Savings ÷ list price × 100"],
          ["Multiple discount", "Stack sequential percent reductions"],
          ["Buy one get one", "Effective per-unit from BOGO terms"],
          ["Price after discount", "List − discount amount"],
          ["Original price", "Reverse from sale price and percent off"],
          ["Markup", "Cost × (1 + markup %)"],
          ["Markdown", "List × (1 − markdown %)"],
          ["Sale price", "Cost or list with promo applied"],
          ["Clearance price", "Deep markdown from remaining stock"],
          ["Bundle discount", "Combined items vs separate totals"],
          ["Tiered discount", "Rate steps by quantity or spend"],
          ["Volume discount", "Unit price falls at higher qty"],
          ["Wholesale price", "Bulk cost below retail shelf"],
          ["Retail price", "Shelf tag from cost and margin"],
          ["Cost plus pricing", "Cost + overhead + profit layer"],
          ["Price per unit", "Pack price ÷ count or weight"],
          ["MSRP vs selling", "Manufacturer list vs store tag"],
          ["Trade-in value", "Credit applied against new purchase"],
          ["Membership discount", "Member rate vs public price"],
          ["Loyalty points value", "Points ÷ earn rate = rupee value"],
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

export const SHOP_PRICING_ARTICLES: Record<string, RichArticle> = {
  "shop-discount-calculator": article(
    "shop-discount-calculator",
    "Discount",
    [
      "Calculates the discount amount and final price from an original price and percent-off rate.",
      "Tax, shipping, and member-only tiers are applied at checkout separately — enter pre-tax list price for a clean comparison.",
    ],
    {
      question: "Is discount applied before or after tax?",
      answer:
        "Most retailers discount the pre-tax subtotal. Tax is then calculated on the reduced price — confirm on your receipt.",
    },
    "Discount Calculator — Amount Off and Final Price",
    "Calculate discount amount and sale price from percent off. Daily shopping aid — verify at checkout.",
    ["discount calculator", "percent off price", "sale price from discount"],
  ),
  "shop-percentage-off-calculator": article(
    "shop-percentage-off-calculator",
    "Percentage off",
    [
      "Finds what percent you saved when list price and final price are known — useful for comparing tag claims.",
      "Bundled free items or cashback are not pure percent-off — treat those promos with dedicated offer tools.",
    ],
    {
      question: "How is percentage off calculated?",
      answer:
        "Percentage off = (original − sale) ÷ original × 100. Rounding on shelf tags may differ by a fraction of a percent.",
    },
    "Percentage Off Calculator — Savings Rate from Prices",
    "Find percent discount from original and sale price. Retail comparison aid — policies vary by store.",
    ["percentage off calculator", "discount percent from price", "how much off"],
  ),
  "shop-multiple-discount-calculator": article(
    "shop-multiple-discount-calculator",
    "Multiple discount",
    [
      "Applies two or more sequential percent-off steps — e.g. 20% then an extra 10% — the way many clearance stacks work.",
      "Some stores add percents (20% + 10% = 30%) while others multiply remaining price — match the retailer's stacking rule.",
    ],
    {
      question: "Do stacked discounts add or multiply?",
      answer:
        "True stacking multiplies: 20% then 10% off leaves 72% of original, not 70%. Read promo fine print for the store's method.",
    },
    "Multiple Discount Calculator — Stacked Percent Off",
    "Calculate final price after sequential discounts. Shopping estimate — stacking rules vary by retailer.",
    ["multiple discount calculator", "stacked percent off", "sequential discount price"],
  ),
  "shop-buy-one-get-one-calculator": article(
    "shop-buy-one-get-one-calculator",
    "Buy one get one",
    [
      "Converts BOGO and BOGO-half offers into an effective price per unit for apples-to-apples comparison.",
      "BOGO on different SKUs or mix-and-match caps change the math — enter quantities that match the promo terms.",
    ],
    {
      question: "Is BOGO the same as 50% off?",
      answer:
        "BOGO free on identical items equals 50% off per pair. BOGO half-off on the second item is closer to 25% off overall.",
    },
    "Buy One Get One Calculator — Effective Unit Price",
    "Find per-item cost under BOGO offers. Daily shopping aid — read promo exclusions.",
    ["BOGO calculator", "buy one get one price", "effective unit price BOGO"],
  ),
  "shop-price-after-discount-calculator": article(
    "shop-price-after-discount-calculator",
    "Price after discount",
    [
      "Shows the post-discount shelf price from list price and either a percent or flat discount amount.",
      "Minimum purchase thresholds and category exclusions may block the discount at checkout even if math here looks correct.",
    ],
    {
      question: "Can I enter a flat rupee or dollar discount?",
      answer:
        "Yes — flat amount off subtracts directly from list price. Percent and flat should not be double-entered for the same promo.",
    },
    "Price After Discount Calculator — Final Sale Tag",
    "Get final price after percent or flat discount. Retail estimate — verify in cart.",
    ["price after discount", "final sale price calculator", "discounted price"],
  ),
  "shop-original-price-calculator": article(
    "shop-original-price-calculator",
    "Original price",
    [
      "Reverses from a sale price and stated percent off to estimate the pre-discount list or MSRP.",
      "Inflated reference prices on some tags make reverse math misleading — compare against known market prices when possible.",
    ],
    {
      question: "Why doesn't reverse math match the tag?",
      answer:
        "Rounding, prior markdowns, or a inflated 'was' price can differ. Use recent receipt data for trustworthy baselines.",
    },
    "Original Price Calculator — Reverse from Sale Price",
    "Estimate list price from sale price and discount percent. Comparison aid — not all 'was' prices are genuine.",
    ["original price calculator", "reverse discount price", "was price estimate"],
  ),
  "shop-markup-calculator": article(
    "shop-markup-calculator",
    "Markup",
    [
      "Adds a markup percentage to cost to reach a selling price — common in retail and small-shop pricing.",
      "Markup percent is not the same as margin percent — high markup can still yield modest margin if costs are high.",
    ],
    {
      question: "How is markup different from margin?",
      answer:
        "Markup is profit ÷ cost. Margin is profit ÷ selling price. A 50% markup equals roughly a 33% margin.",
    },
    "Markup Calculator — Selling Price from Cost",
    "Calculate retail price from cost and markup percent. Seller planning aid — taxes and fees extra.",
    ["markup calculator", "cost plus markup price", "retail markup percent"],
  ),
  "shop-markdown-calculator": article(
    "shop-markdown-calculator",
    "Markdown",
    [
      "Reduces list price by a markdown percent — typical for seasonal clearance and end-of-line sales.",
      "Further coupons after markdown may stack or not — check whether the markdown price is the new baseline.",
    ],
    {
      question: "Is markdown the same as a coupon discount?",
      answer:
        "Markdown is a permanent shelf reduction until stock clears. Coupons are often temporary codes applied at checkout.",
    },
    "Markdown Calculator — Clearance Price from List",
    "Find clearance price from list and markdown percent. Retail estimate — final cart may differ.",
    ["markdown calculator", "clearance percent off", "reduced shelf price"],
  ),
  "shop-sale-price-calculator": article(
    "shop-sale-price-calculator",
    "Sale price",
    [
      "Builds a promotional sale price from cost, desired margin, or a straight percent off list — flexible for quick what-if.",
      "Competitive market prices may force sale tags below your target margin — treat output as a planning starting point.",
    ],
    {
      question: "Should I price from cost or from competitor tags?",
      answer:
        "Use cost-plus for floor pricing and competitor checks for ceiling. Sustainable sales need both views.",
    },
    "Sale Price Calculator — Promo Tag from Cost or List",
    "Estimate promotional sale price from cost, margin, or discount. Seller aid — not accounting advice.",
    ["sale price calculator", "promo price from cost", "retail sale tag"],
  ),
  "shop-clearance-price-calculator": article(
    "shop-clearance-price-calculator",
    "Clearance price",
    [
      "Models deep clearance markdowns from remaining inventory value and target sell-through — useful for end-of-season planning.",
      "Brand MAP policies and minimum advertised price rules may limit how low you can publicly mark down.",
    ],
    {
      question: "How deep should clearance go?",
      answer:
        "Balance recovery against holding cost. Many retailers step down 30%, 50%, then 70% until units move or are donated.",
    },
    "Clearance Price Calculator — Deep Markdown Estimate",
    "Estimate clearance shelf price from list and target reduction. Inventory planning aid — policies vary.",
    ["clearance price calculator", "deep discount shelf price", "end of season markdown"],
  ),
  "shop-bundle-discount-calculator": article(
    "shop-bundle-discount-calculator",
    "Bundle discount",
    [
      "Compares the bundled set price against the sum of individual item prices to show bundle savings percent.",
      "Forced bundles with unwanted items reduce real value — weigh only the SKUs you would buy separately anyway.",
    ],
    {
      question: "When is a bundle not a deal?",
      answer:
        "When it includes low-value extras or items you would not purchase alone. Compare against your actual basket, not the bundle MSRP.",
    },
    "Bundle Discount Calculator — Set Savings vs Separate",
    "Compare bundle price to buying items separately. Smart shopping aid — read bundle contents.",
    ["bundle discount calculator", "bundle savings percent", "combo deal price"],
  ),
  "shop-tiered-discount-calculator": article(
    "shop-tiered-discount-calculator",
    "Tiered discount",
    [
      "Applies different discount rates at quantity or spend breakpoints — e.g. 10% at 3 items, 20% at 5.",
      "Just above a tier boundary, buying one more unit can pay for itself — scan tier edges before checkout.",
    ],
    {
      question: "Do tier discounts apply to the whole cart or only qualifying units?",
      answer:
        "Policies differ. Some apply the tier rate to all qualifying lines; others only to units above the threshold.",
    },
    "Tiered Discount Calculator — Breakpoint Savings",
    "Calculate price under quantity or spend tier discounts. Shopping estimate — store rules vary.",
    ["tiered discount calculator", "quantity breakpoint discount", "spend tier savings"],
  ),
  "shop-volume-discount-calculator": article(
    "shop-volume-discount-calculator",
    "Volume discount",
    [
      "Shows per-unit price at higher order quantities when a volume rate table or single bulk percent is entered.",
      "Storage, spoilage, and cash tied up in bulk can erase unit savings — include those costs in your decision.",
    ],
    {
      question: "Is bulk always cheaper per unit?",
      answer:
        "Usually, but not always. Compare unit price, shelf life, and return policies before stocking up.",
    },
    "Volume Discount Calculator — Bulk Unit Price",
    "Find per-unit cost at higher purchase quantities. Bulk shopping aid — verify warehouse terms.",
    ["volume discount calculator", "bulk unit price", "quantity discount per item"],
  ),
  "shop-wholesale-price-calculator": article(
    "shop-wholesale-price-calculator",
    "Wholesale price",
    [
      "Estimates wholesale cost from retail reference and typical wholesale-to-retail multiplier or known trade margin.",
      "MOQ, freight, and distributor tiers change landed wholesale — this is a teaching estimate, not a supplier quote.",
    ],
    {
      question: "What is a typical wholesale markup to retail?",
      answer:
        "Varies by category — groceries may be 15–25%, apparel often 50–100% keystone. Use industry norms as a sanity check only.",
    },
    "Wholesale Price Calculator — Trade Cost Estimate",
    "Estimate wholesale cost from retail reference price. Business planning aid — get real quotes from suppliers.",
    ["wholesale price calculator", "trade price estimate", "wholesale vs retail"],
  ),
  "shop-retail-price-calculator": article(
    "shop-retail-price-calculator",
    "Retail price",
    [
      "Sets a shelf price from wholesale or landed cost plus target margin and optional rounding to charm prices.",
      "Psychological pricing (.99 endings) and local tax display rules affect tags — rounding is cosmetic here.",
    ],
    {
      question: "Should retail price include tax?",
      answer:
        "Depends on market. US shelf prices are often pre-tax; many countries show tax-inclusive tags. Match local convention.",
    },
    "Retail Price Calculator — Shelf Tag from Cost",
    "Calculate retail shelf price from cost and margin. Seller planning aid — taxes vary by region.",
    ["retail price calculator", "shelf price from cost", "markup to retail"],
  ),
  "shop-cost-plus-pricing-calculator": article(
    "shop-cost-plus-pricing-calculator",
    "Cost plus pricing",
    [
      "Adds material cost, overhead allocation, and profit layer to reach a cost-plus selling price.",
      "Overhead percent should reflect real rent, labor, and shrink — understating overhead underprices your catalog.",
    ],
    {
      question: "What belongs in overhead for cost-plus?",
      answer:
        "Fixed costs you must cover per unit at expected volume — rent share, utilities, packaging, payment fees, and staff time.",
    },
    "Cost Plus Pricing Calculator — Layered Sell Price",
    "Build selling price from cost, overhead, and profit layers. Small business aid — not tax advice.",
    ["cost plus pricing calculator", "overhead and profit price", "layered retail pricing"],
  ),
  "shop-price-per-unit-calculator": article(
    "shop-price-per-unit-calculator",
    "Price per unit",
    [
      "Divides pack price by count, weight, or volume so different package sizes compare on equal units (per kg, per ml, per each).",
      "Promotional multipacks and loyalty pricing change effective unit cost — recalculate when coupons apply.",
    ],
    {
      question: "Why compare unit price instead of pack price?",
      answer:
        "Larger packs are not always cheaper per unit. Unit math reveals the true value when sizes differ.",
    },
    "Price per Unit Calculator — Per kg, L, or Each",
    "Compare pack prices on a common unit basis. Grocery shopping aid — check promo-adjusted totals.",
    ["price per unit calculator", "unit price comparison", "cost per kg or each"],
  ),
  "shop-msrp-vs-selling-price-calculator": article(
    "shop-msrp-vs-selling-price-calculator",
    "MSRP vs selling",
    [
      "Compares manufacturer suggested retail price to the actual selling price to quantify discount depth and MAP compliance hints.",
      "MAP violations and unauthorized gray-market stock can explain large gaps — verify warranty and seller reputation.",
    ],
    {
      question: "Can stores sell below MSRP?",
      answer:
        "Often yes, unless a MAP policy restricts advertised price. In-store tags may still dip below MAP in some markets.",
    },
    "MSRP vs Selling Price Calculator — Discount Depth",
    "Compare MSRP to store selling price and savings percent. Shopping research aid — warranties may differ.",
    ["MSRP vs selling price", "manufacturer list vs store", "MSRP discount calculator"],
  ),
  "shop-trade-in-value-calculator": article(
    "shop-trade-in-value-calculator",
    "Trade-in value",
    [
      "Estimates net out-of-pocket when a trade-in credit is applied against the price of a new purchase.",
      "Condition grades, bonus top-ups, and carrier lock status shift quoted trade values — quotes are non-binding until inspection.",
    ],
    {
      question: "Is trade-in credit the same as cash?",
      answer:
        "Usually it applies only toward a new purchase at that retailer. Separate resale may yield more but takes more effort.",
    },
    "Trade-in Value Calculator — Net Price After Credit",
    "Calculate net cost after trade-in credit on a new purchase. Upgrade planning aid — quotes vary by condition.",
    ["trade in value calculator", "trade in credit net price", "upgrade net cost"],
  ),
  "shop-membership-discount-calculator": article(
    "shop-membership-discount-calculator",
    "Membership discount",
    [
      "Compares member price to regular price and factors annual membership fee to see if the subscription pays for itself.",
      "Break-even depends on spend frequency — occasional shoppers may lose money on paid club memberships.",
    ],
    {
      question: "When does a paid membership pay off?",
      answer:
        "When total member savings across expected purchases exceed the annual fee before renewal. Model a realistic year of spend.",
    },
    "Membership Discount Calculator — Member vs Regular Price",
    "Compare member savings to regular price and annual fee break-even. Smart shopping aid — read renewal terms.",
    ["membership discount calculator", "club member savings", "membership fee break even"],
  ),
  "shop-loyalty-points-value-calculator": article(
    "shop-loyalty-points-value-calculator",
    "Loyalty points value",
    [
      "Converts loyalty points to currency value using earn and burn rates — e.g. 100 points = ₹1 or bonus redemption windows.",
      "Points expire, cap per transaction, or exclude sale items — read program rules before treating points as cash.",
    ],
    {
      question: "How do I value one loyalty point?",
      answer:
        "Divide the rupee or dollar value you can redeem by points required. Promotional burn rates can temporarily double value.",
    },
    "Loyalty Points Value Calculator — Points to Cash Equivalent",
    "Convert reward points to money value at earn and burn rates. Program comparison aid — rules vary by retailer.",
    ["loyalty points value calculator", "reward points cash value", "points redemption worth"],
  ),
};
