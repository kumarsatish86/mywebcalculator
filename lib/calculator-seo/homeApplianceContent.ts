import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-appliance-hvac";
const HUB_LABEL = "Daily life · Home utility · Appliance and cooling or heating calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify with energy labels and your electricity bill.";

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
        title: "Appliance and HVAC tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["AC power consumption", "Tonnage × EER → kWh per hour"],
          ["AC tonnage", "Room volume × heat load factor"],
          ["Heater electricity cost", "kW × hours × tariff"],
          ["Refrigerator energy", "Annual kWh label × tariff"],
          ["Washing machine cost", "Cycles × kWh per cycle × rate"],
          ["TV power consumption", "Watts × viewing hours × days"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your appliance inputs. Planning estimate only — tariffs, star ratings, and climate vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_APPLIANCE_ARTICLES: Record<string, RichArticle> = {
  "home-ac-power-consumption-calculator": article(
    "home-ac-power-consumption-calculator",
    "AC power consumption",
    [
      "Estimates air conditioner kWh from tonnage, energy efficiency ratio (or star rating proxy), and daily run hours.",
      "Inverter ACs modulate load — steady-state averages beat peak compressor watts for monthly billing math.",
    ],
    {
      question: "Does higher star rating always save money?",
      answer:
        "Higher ISEER or EER lowers kWh per hour, but purchase price and run hours matter. Compare lifecycle cost, not stars alone.",
    },
    "AC Power Consumption Calculator — Monthly kWh & Bill",
    "Estimate air conditioner electricity use from tonnage and run hours. Home energy budgeting — tariffs vary.",
    ["AC power consumption calculator", "air conditioner kWh monthly", "AC electricity bill estimate"],
  ),
  "home-ac-tonnage-calculator": article(
    "home-ac-tonnage-calculator",
    "AC tonnage",
    [
      "Suggests cooling capacity in tons from room area, ceiling height, sun exposure, and occupancy teaching factors.",
      "Undersized AC runs continuously; oversized units short-cycle — professional heat-load surveys beat rule-of-thumb tables.",
    ],
    {
      question: "How many tons per square metre?",
      answer:
        "Rough guides use 0.09–0.12 tons per m² for moderate climates. Increase for top-floor sun, glass, and kitchen heat.",
    },
    "AC Tonnage Calculator — Room Cooling Capacity",
    "Size air conditioner tonnage from room dimensions and heat load hints. Planning aid — confirm with HVAC installer.",
    ["AC tonnage calculator", "air conditioner size room", "cooling capacity tons estimate"],
  ),
  "home-heater-electricity-cost-calculator": article(
    "home-heater-electricity-cost-calculator",
    "Heater electricity cost",
    [
      "Calculates monthly cost for electric room heaters, radiators, or heat guns from kW rating, run hours, and tariff.",
      "Thermostat cycling reduces average draw versus full kW × 24 h — enter realistic heated hours per day.",
    ],
    {
      question: "Are oil-filled radiators cheaper to run?",
      answer:
        "All resistive heaters convert 1 kW to ~1 kWh per hour at full load. Oil retains heat longer, reducing cycle frequency slightly.",
    },
    "Heater Electricity Cost Calculator — Room Heating Bill",
    "Estimate electric heater running cost from watts and hours. Winter budgeting — rates vary by region.",
    ["heater electricity cost calculator", "room heater bill estimate", "electric heating kWh cost"],
  ),
  "home-refrigerator-energy-calculator": article(
    "home-refrigerator-energy-calculator",
    "Refrigerator energy",
    [
      "Converts rated annual kWh (energy label) or measured draw into monthly electricity cost for fridge or freezer.",
      "Door openings, ambient temperature, and coil dust raise consumption above lab test figures.",
    ],
    {
      question: "Where is annual kWh on the label?",
      answer:
        "BEE, Energy Star, and EU labels show estimated kWh per year. Divide by 12 for a monthly planning number.",
    },
    "Refrigerator Energy Calculator — Fridge kWh & Cost",
    "Estimate refrigerator electricity cost from annual kWh label and tariff. Appliance budgeting aid.",
    ["refrigerator energy calculator", "fridge electricity cost monthly", "fridge kWh estimate"],
  ),
  "home-washing-machine-cost-calculator": article(
    "home-washing-machine-cost-calculator",
    "Washing machine cost",
    [
      "Projects monthly laundry electricity and optional water cost from cycles per week and kWh per wash program.",
      "Hot wash, dryer combo, and long eco cycles vary widely — use your machine's program sheet when available.",
    ],
    {
      question: "Front load vs top load energy?",
      answer:
        "Front loaders often use less water and slightly less energy per kg. Compare nameplate kWh per cycle for your models.",
    },
    "Washing Machine Cost Calculator — Laundry Electricity Bill",
    "Estimate washing machine running cost from cycles and kWh per wash. Home utility planning — tariffs vary.",
    ["washing machine cost calculator", "laundry electricity estimate", "washer kWh per cycle"],
  ),
  "home-tv-power-consumption-calculator": article(
    "home-tv-power-consumption-calculator",
    "TV power consumption",
    [
      "Estimates TV electricity from screen wattage (or size/type proxy), daily viewing hours, and days per month.",
      "Modern LED/LCD TVs draw far less than plasma-era sets — check standby when the screen is off but quick-start is on.",
    ],
    {
      question: "Does bigger screen always use more power?",
      answer:
        "Generally yes, but efficiency improved. OLED vs LED and brightness settings matter as much as diagonal inches.",
    },
    "TV Power Consumption Calculator — Monthly kWh & Cost",
    "Calculate TV electricity use from watts and viewing hours. Entertainment budgeting — verify with a plug meter.",
    ["TV power consumption calculator", "television electricity cost", "TV kWh monthly estimate"],
  ),
};
