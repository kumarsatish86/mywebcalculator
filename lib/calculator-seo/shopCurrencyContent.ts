import type { RichArticle } from "./types";

const HUB_HREF = "/daily/shopping-discount/shop-currency-global";
const HUB_LABEL = "Daily life · Shopping · Currency and global shopping calculators";
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
        title: "Currency and global shopping tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Currency converter (purchase)", "Foreign tag × FX rate"],
          ["Import duty estimator", "CIF value × duty rate"],
          ["Landed cost", "Item + freight + duty + fees"],
          ["Tax refund (tourist)", "VAT reclaim on eligible spend"],
          ["International shipping total", "Cross-border freight all-in"],
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

export const SHOP_CURRENCY_ARTICLES: Record<string, RichArticle> = {
  "shop-currency-converter-purchase-calculator": article(
    "shop-currency-converter-purchase-calculator",
    "Currency converter (purchase)",
    [
      "Converts a foreign shelf or checkout price to your home currency using an exchange rate you enter.",
      "Card FX markup and dynamic conversion (DCC) at POS often beat Google mid-market rates — use your bank's effective rate when known.",
    ],
    {
      question: "Should I pay in local currency or home currency abroad?",
      answer:
        "Usually local currency avoids DCC markup from the merchant's bank. Let your card issuer convert at their rate.",
    },
    "Currency Converter for Purchase — Foreign Price to Home",
    "Convert overseas shopping price to home currency at your FX rate. Cross-border aid — card fees extra.",
    ["currency converter purchase", "foreign price to USD INR", "FX shopping calculator"],
  ),
  "shop-import-duty-estimator": article(
    "shop-import-duty-estimator",
    "Import duty",
    [
      "Estimates customs duty on declared CIF value (cost, insurance, freight) at your entered duty rate for the HS category.",
      "De minimis thresholds, personal exemption allowances, and courier clearance fees vary by country — check customs before ordering.",
    ],
    {
      question: "When do I pay import duty on online orders?",
      answer:
        "When shipment value exceeds your country's de minimis or when restricted categories always attract duty. Courier often collects at delivery.",
    },
    "Import Duty Estimator — Customs on Cross-border Buy",
    "Estimate import duty on overseas purchase CIF value. Global shopping aid — exemptions vary by country.",
    ["import duty estimator", "customs duty online shopping", "cross border duty calculator"],
  ),
  "shop-landed-cost-calculator": article(
    "shop-landed-cost-calculator",
    "Landed cost",
    [
      "Sums item price, international shipping, insurance, import duty, and brokerage into one landed cost in home currency.",
      "True comparison against local retail requires the full landed stack — item price alone misleads on cross-border deals.",
    ],
    {
      question: "What is landed cost?",
      answer:
        "Total cost to get goods to your door including product, freight, duties, taxes, and clearance fees — your real acquisition cost.",
    },
    "Landed Cost Calculator — All-in Cross-border Price",
    "Calculate total landed cost including shipping, duty, and fees. Import shopping aid — verify with customs.",
    ["landed cost calculator", "total import cost shopping", "cross border all in price"],
  ),
  "shop-tax-refund-tourist-calculator": article(
    "shop-tax-refund-tourist-calculator",
    "Tax refund (tourist)",
    [
      "Estimates VAT or GST tourist refund on eligible retail spend after minimum purchase and admin fee deductions.",
      "Refund counters at airports require original receipts and unused goods — processing fee and FX on refund reduce net benefit.",
    ],
    {
      question: "Is tax-free shopping worth the paperwork?",
      answer:
        "On large purchases (electronics, luxury) yes. On small souvenirs the minimum spend and admin fee may erase the refund.",
    },
    "Tax Refund Tourist Calculator — VAT Reclaim Estimate",
    "Estimate tourist VAT refund on eligible overseas purchases. Travel shopping aid — rules vary by country.",
    ["tax refund tourist calculator", "VAT reclaim shopping abroad", "tourist tax free estimate"],
  ),
  "shop-international-shipping-total-calculator": article(
    "shop-international-shipping-total-calculator",
    "International shipping total",
    [
      "Combines base international freight, fuel surcharge, and optional insurance into total delivery cost for an overseas order.",
      "Express couriers vs postal economy differ in tracking and customs clearance speed — price is not the only variable.",
    ],
    {
      question: "Why is international shipping so expensive on small items?",
      answer:
        "Fixed customs handling and last-mile cost dominate light parcels. Bundling orders or picking local warehouses reduces per-item freight.",
    },
    "International Shipping Total Calculator — Cross-border Freight",
    "Calculate total international shipping with surcharges and insurance. Global ecommerce aid — customs fees separate.",
    ["international shipping total calculator", "overseas delivery cost", "cross border freight estimate"],
  ),
};
