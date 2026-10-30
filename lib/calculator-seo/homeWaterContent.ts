import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-water-utility";
const HUB_LABEL = "Daily life · Home utility · Water and utility calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify amounts on your actual bill or with a qualified plumber.";

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
        title: "Water and utility tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Household consumption", "Litres per person × household × days"],
          ["Daily water usage", "Fixture flow × minutes × uses per day"],
          ["Monthly water bill", "Volume × tariff + sewer if applicable"],
          ["Rainwater harvesting", "Roof area × rainfall × capture efficiency"],
          ["Tank capacity", "Length × width × height or cylinder volume"],
          ["Borewell depth", "Yield vs static level teaching estimate"],
          ["Pipe flow rate", "Velocity × cross-section area"],
          ["Water pressure", "Head height × density approximation"],
          ["Leak loss", "Drip rate × time → wasted volume"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your water inputs. Planning estimate only — tariffs, taxes, and municipal rules vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_WATER_ARTICLES: Record<string, RichArticle> = {
  "home-water-consumption-household-calculator": article(
    "home-water-consumption-household-calculator",
    "Water consumption (household)",
    [
      "Estimates total household water use from per-person daily litres and household size over a billing period.",
      "Outdoor irrigation, pool top-up, and shared supply meters are not automatic — add those volumes separately.",
    ],
    {
      question: "How many litres per person per day is typical?",
      answer:
        "Guidelines vary widely (roughly 100–150 L/day per person in many urban estimates). Use your utility's conservation targets or past bills when available.",
    },
    "Water Consumption Calculator — Household Litres per Month",
    "Estimate household water use from people count and daily litres. Daily planning aid — verify on your water bill.",
    ["water consumption calculator", "household water usage litres", "monthly water estimate"],
  ),
  "home-daily-water-usage-calculator": article(
    "home-daily-water-usage-calculator",
    "Daily water usage",
    [
      "Breaks down daily litres by showers, taps, toilets, and laundry using flow rates and usage counts.",
      "Low-flow fixtures and dual-flush toilets cut volume sharply — update defaults to match your fittings.",
    ],
    {
      question: "How do I measure tap flow rate?",
      answer:
        "Time filling a known container (e.g. 1 L bottle) and convert to litres per minute. Repeat for hot and cold if they differ.",
    },
    "Daily Water Usage Calculator — Litres by Fixture",
    "Calculate daily home water use from shower, tap, and toilet habits. Conservation literacy — rates vary locally.",
    ["daily water usage calculator", "litres per day home", "water footprint household"],
  ),
  "home-monthly-water-bill-calculator": article(
    "home-monthly-water-bill-calculator",
    "Monthly water bill",
    [
      "Multiplies estimated consumption volume by water tariff and optional sewer or fixed charges for a bill snapshot.",
      "Tiered block tariffs and wastewater surcharges differ by municipality — use your statement's effective rate when possible.",
    ],
    {
      question: "Is sewer charged on the same volume as water?",
      answer:
        "Often yes in flat-fee or same-volume models; some cities use winter averaging or fixed sewer fees. Check local billing rules.",
    },
    "Monthly Water Bill Calculator — Volume × Tariff Estimate",
    "Estimate monthly water bill from litres or cubic metres and tariff. Budgeting aid — taxes vary by region.",
    ["monthly water bill calculator", "water tariff estimate", "household water cost"],
  ),
  "home-rainwater-harvesting-calculator": article(
    "home-rainwater-harvesting-calculator",
    "Rainwater harvesting",
    [
      "Estimates catchment volume from roof footprint, rainfall depth, and collection efficiency for tank sizing.",
      "First-flush diverters, filter maintenance, and legal use restrictions (potable vs irrigation) affect real yield.",
    ],
    {
      question: "What collection efficiency should I use?",
      answer:
        "Teaching values are 0.75–0.90 after losses from evaporation, overflow, and dirty roof wash-off. Conservative planning uses the lower end.",
    },
    "Rainwater Harvesting Calculator — Roof Catchment Volume",
    "Estimate rainwater yield from roof area and rainfall. Sustainability planning — local codes may restrict use.",
    ["rainwater harvesting calculator", "roof catchment litres", "rain barrel sizing"],
  ),
  "home-water-tank-capacity-calculator": article(
    "home-water-tank-capacity-calculator",
    "Water tank capacity",
    [
      "Computes storage volume for rectangular, cylindrical, or custom dimensions — useful for overhead and underground tanks.",
      "Usable volume is below the overflow outlet; sediment and air gaps reduce practical capacity versus full geometry.",
    ],
    {
      question: "Litres or cubic metres?",
      answer:
        "1 cubic metre equals 1000 litres. Bills may show either — convert consistently before comparing to consumption.",
    },
    "Water Tank Capacity Calculator — Litres from Dimensions",
    "Calculate water tank volume from length, width, and height. Home utility estimate — verify on-site measurements.",
    ["water tank capacity calculator", "tank volume litres", "overhead tank size"],
  ),
  "home-borewell-depth-estimator": article(
    "home-borewell-depth-estimator",
    "Borewell depth",
    [
      "Teaching estimate relating desired yield, aquifer type, and static water level to indicative drilling depth — not a hydrogeology report.",
      "Local water tables, seasonal drawdown, and pump submergence requirements need a licensed driller or survey.",
    ],
    {
      question: "Can this replace a site survey?",
      answer:
        "No. Bore depth depends on geophysical logs and regulatory permits. Use this only for rough budgeting conversations.",
    },
    "Borewell Depth Estimator — Rough Drilling Depth Guide",
    "Educational borewell depth estimate from yield and water level inputs. Not a substitute for hydrogeological survey.",
    ["borewell depth estimator", "bore drilling depth estimate", "groundwater depth calculator"],
  ),
  "home-pipe-flow-rate-calculator": article(
    "home-pipe-flow-rate-calculator",
    "Pipe flow rate",
    [
      "Relates pipe diameter and flow velocity to litres per minute — a plumbing literacy check for fixture supply.",
      "Friction, elbows, and pressure loss over long runs reduce real flow — this is ideal-flow arithmetic, not a full hydraulic model.",
    ],
    {
      question: "What velocity is reasonable for home pipes?",
      answer:
        "Design guides often target 0.6–2 m/s for domestic supply. Too high causes noise and erosion; too low may allow sediment settling.",
    },
    "Pipe Flow Rate Calculator — L/min from Diameter & Velocity",
    "Estimate water flow rate through a pipe from size and velocity. Educational plumbing aid — verify with a flow meter.",
    ["pipe flow rate calculator", "water flow litres per minute", "pipe diameter flow"],
  ),
  "home-water-pressure-calculator": article(
    "home-water-pressure-calculator",
    "Water pressure",
    [
      "Approximates pressure from vertical head (metres of water column) using the teaching relation ~0.1 bar per metre of head.",
      "Municipal supply pressure, PRVs, and pump boosters dominate real systems — head-only math is a baseline concept.",
    ],
    {
      question: "Why is pressure low upstairs?",
      answer:
        "Elevation loss (~0.1 bar per m) plus pipe friction reduces pressure at upper floors. Boost pumps or larger mains may be needed.",
    },
    "Water Pressure Calculator — Head to Bar Estimate",
    "Convert water column height to approximate pressure. Home plumbing literacy — municipal supply varies.",
    ["water pressure calculator", "head to bar water", "home water pressure estimate"],
  ),
  "home-leak-loss-calculator": article(
    "home-leak-loss-calculator",
    "Leak loss",
    [
      "Quantifies wasted water from drip rate or small continuous leak over days and months — often surprising on the bill.",
      "A 1 drop/sec leak can waste thousands of litres per month; fix leaks before tuning tariff math.",
    ],
    {
      question: "How do I measure a drip rate?",
      answer:
        "Count drops in one minute or capture volume in a measuring cup over 10 minutes, then scale to litres per day.",
    },
    "Leak Loss Calculator — Wasted Litres from Drips",
    "Estimate water lost from leaks by drip rate and duration. Conservation aid — repair saves more than tariff shopping.",
    ["leak loss calculator", "dripping tap water waste", "hidden leak litres"],
  ),
};
