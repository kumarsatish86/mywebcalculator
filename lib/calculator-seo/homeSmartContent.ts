import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-smart-sustainability";
const HUB_LABEL = "Daily life · Home utility · Smart home and sustainability calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify rebates and carbon factors with official sources.";

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
        title: "Smart home and sustainability tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Smart home cost", "Hub + devices + install rollup"],
          ["IoT device cost", "Per-device price × count × subscription"],
          ["Energy efficiency savings", "Baseline kWh − upgrade kWh × tariff"],
          ["Carbon footprint (home)", "kWh × grid factor + gas kg CO₂"],
          ["Energy saving", "Behavior or retrofit kWh delta"],
          ["Green home cost", "Efficiency upgrades + payback view"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your sustainability inputs. Planning estimate only — grid carbon intensity and rebates vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_SMART_ARTICLES: Record<string, RichArticle> = {
  "home-smart-home-cost-calculator": article(
    "home-smart-home-cost-calculator",
    "Smart home cost",
    [
      "Rolls up hub, smart switches, thermostats, locks, and cameras into a starter or whole-home budget.",
      "Professional install, subscription cloud storage, and Matter/Thread compatibility choices change total cost of ownership.",
    ],
    {
      question: "Starter kit or room-by-room?",
      answer:
        "Starter kits bundle hub and a few devices cheaply. Room-by-room lets you prioritize lighting or climate first — spread spend over time.",
    },
    "Smart Home Cost Calculator — Devices & Hub Budget",
    "Estimate smart home setup cost from device list and install allowance. Planning aid — prices vary by brand and region.",
    ["smart home cost calculator", "home automation budget", "smart devices total cost"],
  ),
  "home-iot-device-cost-calculator": article(
    "home-iot-device-cost-calculator",
    "IoT device cost",
    [
      "Totals purchase price and optional monthly cloud fees for sensors, plugs, and cameras over a chosen ownership period.",
      "Vendor lock-in and firmware support lifetimes matter — budget replacement cycles, not just first-year hardware.",
    ],
    {
      question: "Are cloud subscriptions mandatory?",
      answer:
        "Many cameras and some hubs require paid plans for history. Local-storage devices avoid monthly fees but may cost more upfront.",
    },
    "IoT Device Cost Calculator — Hardware + Subscription TCO",
    "Calculate IoT device total cost including monthly fees. Budgeting aid — vendor pricing varies.",
    ["IoT device cost calculator", "smart device subscription cost", "home IoT budget"],
  ),
  "home-energy-efficiency-savings-calculator": article(
    "home-energy-efficiency-savings-calculator",
    "Energy efficiency savings",
    [
      "Compares baseline kWh to post-upgrade usage (LED, star-rated AC, insulation) and values savings at your tariff.",
      "Real savings depend on behavior — setback thermostats only save when schedules are actually programmed.",
    ],
    {
      question: "Which upgrade pays back fastest?",
      answer:
        "Often LED lighting and sealing air leaks for low cost. HVAC and window replacements have longer payback but bigger kWh cuts.",
    },
    "Energy Efficiency Savings Calculator — kWh & Bill Reduction",
    "Estimate bill savings from efficiency upgrades versus baseline usage. Home planning — tariffs vary by region.",
    ["energy efficiency savings calculator", "home energy upgrade savings", "kWh reduction estimate"],
  ),
  "home-carbon-footprint-calculator": article(
    "home-carbon-footprint-calculator",
    "Carbon footprint (home)",
    [
      "Approximates household CO₂ from electricity kWh × grid emission factor plus gas or LPG combustion estimates.",
      "Grid factors change yearly and by region; use your utility's published kg CO₂/kWh when available.",
    ],
    {
      question: "Does solar zero out electricity emissions?",
      answer:
        "Self-consumed solar offsets grid factor on those kWh. Grid-tied export accounting depends on how your utility attributes green power.",
    },
    "Carbon Footprint Calculator — Home CO₂ Estimate",
    "Estimate household carbon footprint from energy use and emission factors. Educational aid — factors vary by region.",
    ["carbon footprint calculator home", "household CO2 emissions", "home energy carbon estimate"],
  ),
  "home-energy-saving-calculator": article(
    "home-energy-saving-calculator",
    "Energy saving",
    [
      "Quantifies kWh and cost saved from habit changes — lower AC setpoint, shorter showers, unplugging standby loads.",
      "Combine several small deltas; single-action savings look modest but stack across a household.",
    ],
    {
      question: "How much can thermostat setbacks save?",
      answer:
        "Rule-of-thumb guides cite ~1–3% per degree for heating/cooling seasons. Actual savings depend on climate and insulation.",
    },
    "Energy Saving Calculator — Habit & Retrofit kWh Saved",
    "Calculate energy and cost saved from usage reductions at home. Conservation planning — tariffs vary locally.",
    ["energy saving calculator", "home energy savings estimate", "reduce electricity bill calculator"],
  ),
  "home-green-home-cost-calculator": article(
    "home-green-home-cost-calculator",
    "Green home cost",
    [
      "Bundles efficiency and renewable line items — solar, heat pump, insulation — with rough payback from avoided utility spend.",
      "Green loans, tax credits, and carbon pricing differ by jurisdiction — add incentives manually if they apply to you.",
    ],
    {
      question: "Green premium vs standard build?",
      answer:
        "Efficient envelopes and heat pumps may add 5–15% upfront but lower lifetime utility OPEX. Compare net present cost, not sticker alone.",
    },
    "Green Home Cost Calculator — Upgrade Budget & Payback",
    "Estimate cost and payback for green home upgrades. Planning aid — rebates and taxes vary by region.",
    ["green home cost calculator", "sustainable home upgrade budget", "energy retrofit payback"],
  ),
};
