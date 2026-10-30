import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-parking-garage-ev";
const HUB_LABEL = "Daily life · Home utility · Parking, garage, and home EV calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify with building codes and your electricity tariff.";

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
        title: "Parking, garage, and EV tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Parking space", "Length × width per bay + clearance"],
          ["Garage size", "Vehicle envelope + door swing + storage"],
          ["EV charging cost", "kWh per charge × home tariff"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your parking and EV inputs. Planning estimate only — building codes and EV tariffs vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_PARKING_ARTICLES: Record<string, RichArticle> = {
  "home-parking-space-calculator": article(
    "home-parking-space-calculator",
    "Parking space",
    [
      "Computes minimum bay dimensions from vehicle length and width plus clearance for opening doors and circulation.",
      "Local codes specify aisle width, handicap bays, and column offsets — use this for layout literacy before architectural drawings.",
    ],
    {
      question: "What clearance do I need beside the car?",
      answer:
        "Many residential layouts allow 600–900 mm side clearance; tight urban lots may use less with care. Match local parking standards.",
    },
    "Parking Space Calculator — Bay Size from Vehicle",
    "Calculate parking bay area from car dimensions and clearance. Home planning aid — verify building codes locally.",
    ["parking space calculator", "car parking size metres", "parking bay dimensions home"],
  ),
  "home-garage-size-calculator": article(
    "home-garage-size-calculator",
    "Garage size",
    [
      "Sizes a single or double garage from vehicle footprints, door swing, workbench depth, and storage aisles.",
      "Standard single-car garages are often 3 × 6 m minimum; SUVs and pickup beds need length and height checks.",
    ],
    {
      question: "Is a single garage enough for one SUV?",
      answer:
        "Check overall length with rear spare, door depth when open, and overhead opener rail. Many SUVs need 6.5 m+ depth.",
    },
    "Garage Size Calculator — Single or Double Car Footprint",
    "Estimate garage dimensions for one or two vehicles plus storage. Planning estimate — codes vary by region.",
    ["garage size calculator", "double car garage dimensions", "home garage area estimate"],
  ),
  "home-ev-charging-cost-calculator": article(
    "home-ev-charging-cost-calculator",
    "EV charging cost",
    [
      "Estimates home charging cost from battery kWh added, charging efficiency loss, and your residential electricity tariff.",
      "Time-of-use rates, EV-specific plans, and public DC fast charging are priced differently — enter home overnight rate for wallbox math.",
    ],
    {
      question: "Should I include charging efficiency?",
      answer:
        "Yes. Home AC charging often delivers 85–92% of meter kWh into the pack. Add 8–12% loss unless you measure at the wall.",
    },
    "EV Charging Cost Calculator — Home kWh & Bill per Charge",
    "Calculate home EV charging cost from kWh added and electricity rate. Budgeting aid — tariffs and EV plans vary.",
    ["EV charging cost calculator", "home electric car charging cost", "EV kWh cost home"],
  ),
};
