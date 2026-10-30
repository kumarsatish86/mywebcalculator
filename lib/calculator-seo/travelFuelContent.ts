import type { RichArticle } from "./types";

const HUB_HREF = "/daily/travel/travel-fuel-vehicle";
const HUB_LABEL = "Daily life · Travel · Fuel and vehicle travel calculators";
const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or insurance advice. Fuel prices, tolls, EV rates, and carrier policies vary — verify amounts with stations, chargers, and operators before you go.";

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
        title: "Fuel and vehicle travel tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Fuel cost", "(distance ÷ km/L) × price/L"],
          ["Mileage", "Distance ÷ fuel used"],
          ["MPG", "Miles ÷ gallons"],
          ["km per liter", "Distance ÷ liters"],
          ["Gas price trip", "Same as fuel cost with trip focus"],
          ["EV charging cost", "(km/100) × kWh/100km × rate"],
          ["Range", "Tank liters × km/L"],
          ["Toll cost", "Per-toll × count or lump sum"],
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

export const TRAVEL_FUEL_ARTICLES: Record<string, RichArticle> = {
  "travel-fuel-cost-calculator": article(
    "travel-fuel-cost-calculator",
    "Fuel cost",
    [
      "Estimates trip fuel spend from distance, vehicle efficiency (km/L), and price per liter.",
      "Real consumption varies with traffic, load, and terrain — use recent fill-up averages for a closer plan.",
    ],
    {
      question: "Should I use tank average or brochure efficiency?",
      answer:
        "Use your own fill-up average when possible. Brochure figures are often optimistic highway numbers.",
    },
    "Fuel Cost Calculator — Trip Fuel Spend from Distance",
    "Estimate road-trip fuel cost from km, km/L, and price per liter. Travel planning aid — pump prices vary.",
    ["fuel cost calculator", "trip fuel cost", "road trip petrol cost"],
  ),
  "travel-mileage-calculator": article(
    "travel-mileage-calculator",
    "Mileage",
    [
      "Divides distance driven by fuel used to show real-world efficiency for a segment or full tank.",
      "Reset the trip meter at a full tank and fill again to the same level for the cleanest reading.",
    ],
    {
      question: "Why does mileage drop in city traffic?",
      answer:
        "Idling, stop-start, and short trips lower efficiency versus steady highway cruising at moderate speed.",
    },
    "Mileage Calculator — Distance Divided by Fuel Used",
    "Calculate vehicle mileage from distance and fuel used. Driving efficiency aid — conditions vary.",
    ["mileage calculator", "fuel efficiency calculator", "km per liter from fill up"],
  ),
  "travel-mpg-calculator": article(
    "travel-mpg-calculator",
    "MPG",
    [
      "Computes miles per gallon from miles driven and gallons consumed — the US customary efficiency metric.",
      "Convert liters to gallons (÷ 3.785) if your pump receipts are metric before entering gallons.",
    ],
    {
      question: "How do I convert MPG to km/L?",
      answer:
        "Roughly: km/L ≈ MPG × 0.425. Or convert miles→km and gallons→liters first, then divide.",
    },
    "MPG Calculator — Miles per Gallon Efficiency",
    "Find miles per gallon from miles and gallons used. US travel efficiency aid — verify with fill-ups.",
    ["mpg calculator", "miles per gallon calculator", "fuel economy mpg"],
  ),
  "travel-km-per-liter-calculator": article(
    "travel-km-per-liter-calculator",
    "km per liter",
    [
      "Shows km/L efficiency from distance and liters used — common for India and other metric markets.",
      "Compare city vs highway segments separately; blended averages hide where fuel is wasted.",
    ],
    {
      question: "Is km/L the same as mileage?",
      answer:
        "In many regions yes — mileage colloquially means km per liter. Always check the unit your tank math uses.",
    },
    "km per Liter Calculator — Metric Fuel Efficiency",
    "Calculate km/L from distance and liters. Metric travel efficiency — conditions change results.",
    ["km per liter calculator", "km/l calculator", "metric fuel efficiency"],
  ),
  "travel-gas-price-trip-calculator": article(
    "travel-gas-price-trip-calculator",
    "Gas price trip",
    [
      "Applies current fuel price to your trip distance and efficiency so you can budget pump spend before departure.",
      "Highway corridor prices differ from city pumps — update price if you refuel in another state or country.",
    ],
    {
      question: "Do I include return fuel?",
      answer:
        "Enter round-trip distance if you will drive back on the same tank plan, or run outbound and return separately.",
    },
    "Gas Price Trip Calculator — Fuel Budget at Current Price",
    "Estimate trip fuel spend at today's gas price. Road-trip budget aid — pump rates change daily.",
    ["gas price trip calculator", "trip fuel budget", "petrol cost for trip"],
  ),
  "travel-ev-charging-cost-trip-calculator": article(
    "travel-ev-charging-cost-trip-calculator",
    "EV charging cost trip",
    [
      "Estimates EV energy cost from distance, kWh per 100 km, and electricity price per kWh.",
      "Public DC fast charge often costs more than home overnight rates — enter the rate you will actually pay.",
    ],
    {
      question: "Does cold weather change EV trip cost?",
      answer:
        "Yes — cabin heat and battery conditioning raise kWh/100 km. Use winter efficiency if available.",
    },
    "EV Charging Cost Trip Calculator — kWh Budget on the Road",
    "Estimate electric vehicle trip charging cost from distance and kWh rate. EV planning — rates vary by charger.",
    ["ev charging cost trip", "electric car trip cost", "kwh trip calculator"],
  ),
  "travel-range-estimator": article(
    "travel-range-estimator",
    "Range estimator",
    [
      "Multiplies usable tank (or pack) capacity by efficiency to estimate how far you can go before refueling.",
      "Keep a reserve for detours and headwinds — planning to empty is risky on sparse routes.",
    ],
    {
      question: "Should I use full tank capacity?",
      answer:
        "Prefer usable capacity after reserve. Many drivers plan on 80–90% of rated tank for peace of mind.",
    },
    "Range Estimator — How Far One Tank or Charge Goes",
    "Estimate driving range from tank liters and efficiency. Trip planning aid — leave a fuel reserve.",
    ["vehicle range estimator", "tank range calculator", "how far on one tank"],
  ),
  "travel-toll-cost-estimator": article(
    "travel-toll-cost-estimator",
    "Toll cost estimator",
    [
      "Adds expected tolls from a per-plaza amount and plaza count, or a single trip toll total you already know.",
      "Tag/pass discounts, time-of-day rates, and axle classes change published cash tolls — confirm on the operator site.",
    ],
    {
      question: "Are return tolls counted twice?",
      answer:
        "Yes if the route charges both ways. Enter round-trip plaza count or the full round-trip toll total.",
    },
    "Toll Cost Estimator — Highway and Bridge Fees",
    "Estimate road-trip toll spend from plaza fees or a lump sum. Travel budget aid — rates vary by operator.",
    ["toll cost estimator", "highway toll calculator", "bridge toll trip cost"],
  ),
};
