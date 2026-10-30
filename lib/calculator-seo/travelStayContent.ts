import type { RichArticle } from "./types";

const HUB_HREF = "/daily/travel/travel-accommodation";
const HUB_LABEL = "Daily life · Travel · Accommodation calculators";
const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or insurance advice. Nightly rates, resort fees, taxes, and cancellation policies vary — verify with the property or booking platform before you pay.";

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
        title: "Accommodation tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Hotel stay cost", "(nightly + resort) × nights + tax + cleaning"],
          ["Nightly with fees", "Effective nightly after fees and tax"],
          ["Resort fee total", "Fee/night × nights"],
          ["Extended stay discount", "Nightly × nights × (1 − discount %)"],
          ["Cleaning fee amortize", "Cleaning ÷ nights"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your travel inputs. Planning estimate only — fares, fees, FX, and policies vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TRAVEL_STAY_ARTICLES: Record<string, RichArticle> = {
  "travel-hotel-stay-cost-calculator": article(
    "travel-hotel-stay-cost-calculator",
    "Hotel stay cost",
    [
      "Estimates full stay total from nightly rate, nights, tax percent, optional resort fee, and cleaning fee.",
      "City occupancy taxes and tourism levies differ by destination — use the rate shown at checkout when known.",
    ],
    {
      question: "Is resort fee taxed?",
      answer:
        "Often yes — many properties tax room + resort fee together. This tool applies tax to the nightly-plus-resort subtotal.",
    },
    "Hotel Stay Cost Calculator — Nights, Tax, and Fees",
    "Estimate hotel stay total with tax, resort, and cleaning fees. Accommodation planning — verify at checkout.",
    ["hotel stay cost calculator", "hotel total with tax", "nightly hotel cost estimate"],
  ),
  "travel-nightly-rate-with-fees-calculator": article(
    "travel-nightly-rate-with-fees-calculator",
    "Nightly rate with fees",
    [
      "Converts a stay into an effective nightly price after tax, resort fees, and cleaning are included.",
      "Use effective nightly when comparing a cheap base rate with high fees against an all-in quote.",
    ],
    {
      question: "Why is effective nightly higher than the ad rate?",
      answer:
        "Ads often show base room only. Resort fees, cleaning, and tax push the true cost per night up.",
    },
    "Nightly Rate with Fees Calculator — True Cost per Night",
    "Find effective nightly hotel cost after fees and tax. Compare stays fairly — policies vary by property.",
    ["nightly rate with fees", "effective hotel nightly cost", "hotel fees per night"],
  ),
  "travel-resort-fee-total-calculator": article(
    "travel-resort-fee-total-calculator",
    "Resort fee total",
    [
      "Multiplies the mandatory resort (or facility) fee per night by length of stay.",
      "Some resorts charge per room, others per adult — match the fee basis on the property's rate rules.",
    ],
    {
      question: "Can I refuse a resort fee?",
      answer:
        "Usually no when it is mandatory. Confirm whether Wi-Fi, gym, or pool are already covered before booking elsewhere.",
    },
    "Resort Fee Total Calculator — Mandatory Fee × Nights",
    "Calculate total resort fees for your hotel stay. Accommodation estimate — fee rules vary by property.",
    ["resort fee total calculator", "hotel resort fee", "facility fee nights"],
  ),
  "travel-extended-stay-discount-calculator": article(
    "travel-extended-stay-discount-calculator",
    "Extended stay discount",
    [
      "Applies a weekly or long-stay percent discount to nightly × nights for extended bookings.",
      "Confirm the discount starts after a night threshold (e.g. 7+) and whether tax is on the discounted subtotal.",
    ],
    {
      question: "Do weekly rates include fees?",
      answer:
        "Not always. Ask whether resort and cleaning fees are discounted or charged at full amount on long stays.",
    },
    "Extended Stay Discount Calculator — Weekly Rate Savings",
    "Estimate hotel total after an extended-stay percent discount. Long-stay planning — confirm with the property.",
    ["extended stay discount calculator", "weekly hotel rate", "long stay hotel discount"],
  ),
  "travel-cleaning-fee-amortization-calculator": article(
    "travel-cleaning-fee-amortization-calculator",
    "Cleaning fee amortization",
    [
      "Spreads a one-time cleaning fee across nights so you can compare short vs longer vacation rentals fairly.",
      "One-night stays feel expensive once cleaning is amortized; longer stays dilute the fee per night.",
    ],
    {
      question: "Is cleaning fee refundable on cancel?",
      answer:
        "Platform and host rules differ. Many charge cleaning only if the stay occurs — read the listing policy.",
    },
    "Cleaning Fee Amortization Calculator — Fee per Night",
    "Spread vacation rental cleaning fee across nights for true nightly cost. Stay compare aid — host policies vary.",
    ["cleaning fee amortization", "airbnb cleaning per night", "vacation rental fee spread"],
  ),
};
