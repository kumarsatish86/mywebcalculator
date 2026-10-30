import type { RichArticle } from "./types";

const HUB_HREF = "/daily/travel/travel-flights";
const HUB_LABEL = "Daily life · Travel · Flight and airfare calculators";
const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or insurance advice. Airfares, baggage fees, seat upgrades, and award charts change — verify with the airline or booking platform before purchase.";

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
        title: "Flight and airfare tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Airfare per mile", "Fare ÷ distance miles"],
          ["Baggage fee total", "Fee × bags"],
          ["Seat upgrade value", "Comfort hours × $/hour vs upgrade cost"],
          ["Miles to dollars", "Points × ¢/point ÷ 100"],
          ["Layover time cost", "Layover hours × opportunity $/hour"],
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

export const TRAVEL_FLIGHT_ARTICLES: Record<string, RichArticle> = {
  "travel-airfare-per-mile-calculator": article(
    "travel-airfare-per-mile-calculator",
    "Airfare per mile",
    [
      "Divides ticket fare by flight distance to compare cost intensity across routes of different lengths.",
      "Taxes and carrier-imposed fees in the fare change the ratio — use the all-in ticket price for fairness.",
    ],
    {
      question: "What is a good cents-per-mile?",
      answer:
        "It depends on cabin and market. Use it relatively: compare similar routes and cabins, not absolute benchmarks.",
    },
    "Airfare per Mile Calculator — Fare ÷ Distance",
    "Compare flight value as fare per mile. Airfare planning aid — taxes and fees vary by carrier.",
    ["airfare per mile calculator", "cost per flight mile", "cents per mile airfare"],
  ),
  "travel-baggage-fee-total-calculator": article(
    "travel-baggage-fee-total-calculator",
    "Baggage fee total",
    [
      "Multiplies per-bag fee by number of checked bags for outbound (and return if you enter round-trip bags).",
      "Overweight and oversized fees stack on top — this tool covers standard bag counts at a flat fee each.",
    ],
    {
      question: "Do return flights charge bags again?",
      answer:
        "Usually yes for each direction unless your fare includes free bags both ways. Enter total bag-fee events.",
    },
    "Baggage Fee Total Calculator — Checked Bag Cost",
    "Estimate airline baggage fees from fee per bag and bag count. Flight budget aid — airline rules vary.",
    ["baggage fee calculator", "checked bag cost", "airline luggage fee total"],
  ),
  "travel-seat-upgrade-value-calculator": article(
    "travel-seat-upgrade-value-calculator",
    "Seat upgrade value",
    [
      "Compares upgrade cost to the comfort value you assign (hours of better seating × your $/hour value).",
      "Long-haul overnight flights often justify upgrades more than short hops — adjust hours and hourly value accordingly.",
    ],
    {
      question: "How do I pick an hourly comfort value?",
      answer:
        "Use what you would pay for comparable comfort (hotel night, lounge, or lost sleep). It is personal, not objective.",
    },
    "Seat Upgrade Value Calculator — Is Extra Legroom Worth It?",
    "Weigh seat upgrade cost against comfort hours and hourly value. Flight planning — preferences differ.",
    ["seat upgrade value calculator", "extra legroom worth it", "airline upgrade calculator"],
  ),
  "travel-miles-to-dollar-value-calculator": article(
    "travel-miles-to-dollar-value-calculator",
    "Miles to dollar value",
    [
      "Converts loyalty miles or points to cash value using cents per point (CPP) you enter from a redemption.",
      "Award charts, fuel surcharges, and dynamic pricing change CPP — recalculate per redemption, not once forever.",
    ],
    {
      question: "What CPP should I assume?",
      answer:
        "Start around 1.0–1.5¢ for many programs, then compute actual CPP from cash fare ÷ miles for each booking.",
    },
    "Miles to Dollar Value Calculator — Points × CPP",
    "Estimate cash value of airline miles from cents per point. Award planning — redemptions and surcharges vary.",
    ["miles to dollar value", "points cpp calculator", "airline miles worth"],
  ),
  "travel-layover-time-cost-calculator": article(
    "travel-layover-time-cost-calculator",
    "Layover time cost",
    [
      "Puts a dollar opportunity cost on layover hours so cheap connecting fares can be compared to nonstops.",
      "Overnight connections may need a hotel — add that separately if the layover is not just airport time.",
    ],
    {
      question: "Should I value layover at my salary rate?",
      answer:
        "Only if that reflects how you value free time. Many travelers use a lower leisure rate than full hourly wage.",
    },
    "Layover Time Cost Calculator — Connection Opportunity Cost",
    "Estimate the time cost of long layovers vs cheaper connecting fares. Flight compare aid — schedules change.",
    ["layover time cost calculator", "connection opportunity cost", "long layover worth it"],
  ),
};
