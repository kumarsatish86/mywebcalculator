import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-tax-billing";
const HUB_LABEL = "Daily life · Shopping · Tax, GST, and billing calculators";
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
        title: "Tax, GST, and billing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Sales tax", "Subtotal × local tax rate"],
          ["GST", "CGST + SGST or IGST on taxable value"],
          ["VAT", "Value-added tax on supply price"],
          ["Tax inclusive price", "Gross ÷ (1 + rate) = net"],
          ["Tax exclusive price", "Net × (1 + rate) = gross"],
          ["Reverse tax", "Extract tax from tax-included total"],
          ["Multi-rate tax", "Split lines at different rates"],
          ["Invoice total", "Lines + tax + fees − discounts"],
          ["Line item discount", "Promo applied per SKU row"],
          ["Service charge", "Gratuity or cover fee on subtotal"],
          ["Tip (bill split)", "Tip pool ÷ diners or shares"],
          ["Rounding adjustment", "Cash rounding to smallest coin"],
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

export const SHOP_TAX_ARTICLES: Record<string, RichArticle> = {
  "shop-sales-tax-calculator": article(
    "shop-sales-tax-calculator",
    "Sales tax",
    [
      "Adds local sales tax to a pre-tax subtotal using your entered rate — common for US-style state and county combinations.",
      "Exempt categories (groceries, medicine) and destination-based rules are not automatic — enter the rate that matches your jurisdiction.",
    ],
    {
      question: "Is sales tax the same everywhere in a country?",
      answer:
        "No. US sales tax varies by state, county, and city. Always use the rate for the delivery or pickup address, not the store HQ.",
    },
    "Sales Tax Calculator — Add Local Tax to Subtotal",
    "Calculate sales tax and total from pre-tax price and rate. Shopping estimate — verify on receipt.",
    ["sales tax calculator", "add sales tax to price", "local tax total"],
  ),
  "shop-gst-calculator": article(
    "shop-gst-calculator",
    "GST",
    [
      "Splits goods and services tax into CGST/SGST for intra-state or IGST for inter-state supply at your chosen rate slab.",
      "HSN codes, composition scheme, and reverse charge have special rules — this tool covers standard forward-charge retail math.",
    ],
    {
      question: "When is IGST used instead of CGST plus SGST?",
      answer:
        "Inter-state sales and imports typically use IGST. Intra-state B2C retail usually shows CGST and SGST as equal halves of the GST rate.",
    },
    "GST Calculator — CGST, SGST, and IGST Split",
    "Calculate GST amount and tax splits on taxable value. India shopping aid — slabs and exemptions vary.",
    ["GST calculator", "CGST SGST split", "IGST on purchase"],
  ),
  "shop-vat-calculator": article(
    "shop-vat-calculator",
    "VAT",
    [
      "Computes value-added tax on a supply price at standard or reduced VAT rates used in many EU and global markets.",
      "Zero-rated and exempt supplies, margin schemes, and B2B reverse charge are out of scope — enter the consumer-facing rate.",
    ],
    {
      question: "Does VAT work like sales tax?",
      answer:
        "Similar for shoppers — you pay tax on the purchase. Structurally VAT is charged at each supply stage with input credits for businesses.",
    },
    "VAT Calculator — Tax on Supply Price",
    "Calculate VAT amount and gross price from net supply. Cross-border shopping aid — rates vary by country.",
    ["VAT calculator", "value added tax amount", "VAT inclusive price"],
  ),
  "shop-tax-inclusive-price-calculator": article(
    "shop-tax-inclusive-price-calculator",
    "Tax inclusive price",
    [
      "Extracts pre-tax net price and tax component from a tax-inclusive shelf or menu tag.",
      "Useful when comparing tax-inclusive markets against pre-tax quotes or building an invoice net column.",
    ],
    {
      question: "Why extract net from gross instead of adding tax?",
      answer:
        "Many countries display final consumer prices with tax included. Reverse math reveals the taxable base for records or B2B claims.",
    },
    "Tax Inclusive Price Calculator — Net from Gross",
    "Split tax-inclusive price into net amount and tax. Receipt literacy aid — rounding may differ slightly.",
    ["tax inclusive price calculator", "extract tax from gross", "net from VAT inclusive"],
  ),
  "shop-tax-exclusive-price-calculator": article(
    "shop-tax-exclusive-price-calculator",
    "Tax exclusive price",
    [
      "Adds tax to a net or pre-tax price to reach the gross amount the customer pays at checkout.",
      "Shipping taxability and mixed-rate carts need line-level handling — single-rate mode is a quick estimate.",
    ],
    {
      question: "Should shipping be taxed?",
      answer:
        "Depends on jurisdiction. Some states tax delivery fees; others exempt them. Include shipping in the taxable base only if local rules require it.",
    },
    "Tax Exclusive Price Calculator — Gross from Net",
    "Add tax to pre-tax price for checkout total. Shopping estimate — mixed carts need per-line rates.",
    ["tax exclusive price calculator", "add VAT to net price", "pre tax to gross"],
  ),
  "shop-reverse-tax-calculator": article(
    "shop-reverse-tax-calculator",
    "Reverse tax",
    [
      "Backs out the tax embedded in a tax-included total when only the gross figure and rate are known.",
      "Formula: tax = gross × rate ÷ (1 + rate). Small rounding differences versus receipt line items are normal.",
    ],
    {
      question: "Can I use reverse tax on a discounted total?",
      answer:
        "Yes if the discount was applied before tax on the same tax-inclusive base. Stacked promos may need line-by-line reconstruction.",
    },
    "Reverse Tax Calculator — Tax from Included Total",
    "Extract embedded tax from a tax-included purchase total. Budgeting aid — verify on invoice.",
    ["reverse tax calculator", "tax from inclusive total", "back out VAT amount"],
  ),
  "shop-multi-rate-tax-calculator": article(
    "shop-multi-rate-tax-calculator",
    "Multi-rate tax",
    [
      "Sums tax across cart lines taxed at different rates — e.g. standard GST on goods plus reduced rate on essentials.",
      "Each line needs its own taxable base after line discounts — enter net amounts per category for accurate totals.",
    ],
    {
      question: "Why not use one blended rate?",
      answer:
        "A blended rate is a shortcut for budgeting. Invoices and compliance need each line at its statutory rate.",
    },
    "Multi-rate Tax Calculator — Mixed Slab Cart Total",
    "Calculate total tax when cart lines use different tax rates. Shopping estimate — exemptions not auto-detected.",
    ["multi rate tax calculator", "mixed GST cart", "different VAT rates total"],
  ),
  "shop-invoice-total-calculator": article(
    "shop-invoice-total-calculator",
    "Invoice total",
    [
      "Rolls up line subtotals, discounts, tax, shipping, and fees into one invoice or receipt grand total.",
      "Partial payments, store credit, and gift card splits happen at POS — model the full gross before payment instruments.",
    ],
    {
      question: "What order are discounts and tax applied?",
      answer:
        "Typically line discounts, then subtotal, then tax on discounted taxable amount, then shipping and fees. Jurisdictions vary.",
    },
    "Invoice Total Calculator — Receipt Grand Total",
    "Build invoice total from lines, tax, discounts, and fees. Business shopping aid — not accounting software.",
    ["invoice total calculator", "receipt grand total", "bill subtotal tax fees"],
  ),
  "shop-line-item-discount-calculator": article(
    "shop-line-item-discount-calculator",
    "Line item discount",
    [
      "Applies a percent or flat discount to an individual SKU row before tax — matching how many POS systems allocate promos.",
      "Cart-level coupons spread differently than line promos — enter the discount on the line it actually attaches to.",
    ],
    {
      question: "Does line discount reduce taxable value?",
      answer:
        "Usually yes — tax is computed on the discounted line net. Confirm for your region when discounts are manufacturer-funded.",
    },
    "Line Item Discount Calculator — Per-SKU Promo",
    "Apply discount to a single invoice line before tax. Retail math aid — POS allocation may differ.",
    ["line item discount calculator", "SKU level discount", "per line promo tax"],
  ),
  "shop-service-charge-calculator": article(
    "shop-service-charge-calculator",
    "Service charge",
    [
      "Calculates mandatory service charge or cover fee as a percent of subtotal — common in hospitality and some dine-in venues.",
      "Service charge may or may not go to staff and may be taxed separately — read the menu footnote and local law.",
    ],
    {
      question: "Is service charge the same as tip?",
      answer:
        "No. Service charge is often mandatory and set by the venue. Tip is voluntary on top unless policy says otherwise.",
    },
    "Service Charge Calculator — Fee on Bill Subtotal",
    "Calculate service charge amount and new bill total. Dining estimate — policies vary by venue.",
    ["service charge calculator", "mandatory gratuity percent", "cover fee on bill"],
  ),
  "shop-tip-calculator-bill-split": article(
    "shop-tip-calculator-bill-split",
    "Tip (bill split)",
    [
      "Adds tip to the bill and splits the total evenly across diners or by custom shares — handy after group meals.",
      "Tax and service charge treatment for tipping varies — some tip on pre-tax subtotal, others on full inclusive bill.",
    ],
    {
      question: "Should tip be calculated before or after tax?",
      answer:
        "Etiquette differs by country. In the US many tip on pre-tax subtotal; elsewhere tipping on inclusive total is common.",
    },
    "Tip Calculator — Bill Split Among Diners",
    "Add tip and split restaurant bill per person. Daily dining aid — local custom varies.",
    ["tip calculator bill split", "split bill with tip", "per person restaurant total"],
  ),
  "shop-rounding-adjustment-calculator": article(
    "shop-rounding-adjustment-calculator",
    "Rounding adjustment",
    [
      "Adjusts a cash total to the nearest legal coin when small denominations are retired or cash rounding rules apply.",
      "Rounding applies to cash payment only in many markets — card totals stay at exact cents.",
    ],
    {
      question: "Who keeps the rounding difference?",
      answer:
        "Neutral rounding to the nearest step means small gains and losses even out over transactions — not a hidden fee.",
    },
    "Rounding Adjustment Calculator — Cash Total to Coin Step",
    "Round purchase total to nearest legal cash coin step. Checkout estimate — card payments usually exact.",
    ["rounding adjustment calculator", "cash rounding total", "nearest coin bill total"],
  ),
};
