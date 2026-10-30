import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-electricity-energy";
const HUB_LABEL = "Daily life · Home utility · Electricity and energy calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify amounts on your actual bill or with a qualified installer.";

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
        title: "Electricity and energy tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Electricity bill", "Units × tariff + fixed charges"],
          ["Unit consumption", "Meter reading delta over a period"],
          ["Cost per unit", "Bill ÷ kWh for blended rate"],
          ["Appliance energy", "Watts × hours ÷ 1000 = kWh"],
          ["Monthly cost", "Load profile × rate slab estimate"],
          ["Annual energy cost", "Monthly × 12 with seasonal tweak"],
          ["Power usage (kWh)", "kW rating × run hours"],
          ["Standby power", "Phantom load × 24 h × days"],
          ["Solar panel cost", "System kW × price per kW"],
          ["Solar savings", "Generation × avoided grid rate"],
          ["Solar panel size", "Daily kWh ÷ peak sun hours"],
          ["Solar ROI", "Payback from savings vs upfront"],
          ["Battery backup", "Ah × voltage for Wh capacity"],
          ["Inverter load", "Sum appliance watts vs rating"],
          ["Backup time", "Battery Wh ÷ load watts"],
          ["UPS sizing", "VA rating vs connected load"],
          ["Generator fuel", "Run hours × fuel burn rate"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your electricity inputs. Planning estimate only — tariffs, taxes, and net-metering rules vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_ELECTRICITY_ARTICLES: Record<string, RichArticle> = {
  "home-electricity-bill-calculator": article(
    "home-electricity-bill-calculator",
    "Electricity bill",
    [
      "Estimates your monthly electricity bill from units consumed, tariff per kWh, and optional fixed or demand charges.",
      "Slab rates, time-of-use windows, and taxes differ by utility — enter your effective blended rate from a recent bill for closer results.",
    ],
    {
      question: "Should I use slab rates or a flat rate?",
      answer:
        "If your utility uses tiered slabs, sum each tier separately or use your last bill's average cost per unit. A single flat rate is a rough shortcut.",
    },
    "Electricity Bill Calculator — Monthly kWh Cost Estimate",
    "Estimate electricity bill from units, tariff, and fixed charges. Daily home planning aid — verify with your utility statement.",
    ["electricity bill calculator", "monthly power bill estimate", "kWh bill calculator"],
  ),
  "home-unit-consumption-calculator": article(
    "home-unit-consumption-calculator",
    "Unit consumption",
    [
      "Calculates kWh consumed between two meter readings over a chosen billing period.",
      "Meter rollover, shared meters, and estimated reads are utility-specific — confirm the interval matches your statement dates.",
    ],
    {
      question: "What counts as one unit?",
      answer:
        "In most regions one unit equals one kilowatt-hour (kWh). Some bills label it as 'units' while others show kWh directly.",
    },
    "Unit Consumption Calculator — kWh from Meter Readings",
    "Find electricity units used between meter readings. Home utility estimate — check against your provider's bill.",
    ["unit consumption calculator", "kWh from meter reading", "electricity units used"],
  ),
  "home-cost-per-unit-calculator": article(
    "home-cost-per-unit-calculator",
    "Cost per unit",
    [
      "Divides total bill amount by units consumed to show your effective cost per kWh including fixed fees spread over usage.",
      "Low-usage months inflate per-unit cost when fixed charges dominate — compare several bills for a stable average.",
    ],
    {
      question: "Why is my cost per unit higher in summer?",
      answer:
        "Higher consumption may push you into upper tariff slabs, and fixed charges spread over fewer units in low-use months also raise the blended rate.",
    },
    "Cost per Unit Calculator — Effective ₹/kWh or $/kWh",
    "Calculate effective electricity cost per unit from bill total and kWh. Budgeting aid — tariffs vary by region.",
    ["cost per unit electricity", "effective kWh rate", "blended electricity tariff"],
  ),
  "home-appliance-energy-consumption-calculator": article(
    "home-appliance-energy-consumption-calculator",
    "Appliance energy consumption",
    [
      "Estimates kWh from appliance wattage, daily run hours, and days per month — useful for ranking heavy users.",
      "Rated wattage differs from real draw (compressors, heaters, inverter motors) — use a plug meter when precision matters.",
    ],
    {
      question: "Where do I find appliance wattage?",
      answer:
        "Check the nameplate, manual, or energy label. For variable-load devices, measured average watts beat nameplate peaks.",
    },
    "Appliance Energy Consumption Calculator — kWh per Month",
    "Estimate monthly kWh for any appliance from watts and usage hours. Home energy literacy — verify with a meter.",
    ["appliance energy calculator", "kWh per appliance", "wattage usage estimate"],
  ),
  "home-monthly-electricity-cost-estimator": article(
    "home-monthly-electricity-cost-estimator",
    "Monthly electricity cost",
    [
      "Projects monthly spend from a list of loads or total kWh and your tariff — a quick household budget snapshot.",
      "Seasonal AC and heating swings are not automatic — adjust run hours or add a seasonal multiplier yourself.",
    ],
    {
      question: "Can I model slab tariffs here?",
      answer:
        "Use a blended rate from past bills for simplicity. For tiered tariffs, calculate each slab band separately and sum.",
    },
    "Monthly Electricity Cost Estimator — Household Power Budget",
    "Estimate monthly electricity spend from usage and tariff. Daily budgeting aid — not a utility quote.",
    ["monthly electricity cost", "power bill estimator", "household energy budget"],
  ),
  "home-annual-energy-cost-calculator": article(
    "home-annual-energy-cost-calculator",
    "Annual energy cost",
    [
      "Scales monthly or seasonal usage into a yearly electricity spend for budgeting and solar payback comparisons.",
      "Year-over-year rate hikes and weather-driven AC load are not forecast — update tariff and hours annually.",
    ],
    {
      question: "Should I multiply monthly by twelve?",
      answer:
        "Only if usage is steady year-round. Weight summer and winter months separately when HVAC drives most of your kWh.",
    },
    "Annual Energy Cost Calculator — Yearly Electricity Spend",
    "Project annual electricity cost from monthly usage patterns. Home planning estimate — rates change by region.",
    ["annual energy cost calculator", "yearly electricity bill", "annual power spend"],
  ),
  "home-power-usage-kwh-calculator": article(
    "home-power-usage-kwh-calculator",
    "Power usage (kWh)",
    [
      "Converts power in kilowatts and run time into energy in kWh — the same math your meter accumulates.",
      "Duty cycles and thermostat cycling reduce average draw versus nameplate kW — measured data improves accuracy.",
    ],
    {
      question: "How do kW and kWh differ?",
      answer:
        "kW is instantaneous power; kWh is energy over time. Multiply kW by hours of operation to get kWh.",
    },
    "Power Usage Calculator — kWh from kW and Hours",
    "Calculate kWh from kilowatt rating and run hours. Educational home utility tool — verify on your bill.",
    ["power usage kWh calculator", "kW to kWh", "energy consumption formula"],
  ),
  "home-standby-power-consumption-calculator": article(
    "home-standby-power-consumption-calculator",
    "Standby power consumption",
    [
      "Estimates phantom load from devices left plugged in — watts × always-on hours adds up across a household.",
      "Modern efficient standby is often 0.5–2 W per device, but older adapters and cable boxes can draw much more.",
    ],
    {
      question: "Is standby power worth switching off?",
      answer:
        "Individually small, but ten always-on devices at 2 W each can cost noticeable kWh over a year. Smart strips help.",
    },
    "Standby Power Calculator — Phantom Load kWh & Cost",
    "Estimate standby electricity waste from watt draw and always-on hours. Home savings literacy — rates vary locally.",
    ["standby power calculator", "phantom load kWh", "vampire power cost"],
  ),
  "home-solar-panel-cost-calculator": article(
    "home-solar-panel-cost-calculator",
    "Solar panel cost",
    [
      "Rough upfront cost from system size (kW) and price per kW including a simple install allowance if you enter it.",
      "Incentives, permits, roof complexity, and battery add-ons change quotes — treat output as a conversation starter with installers.",
    ],
    {
      question: "Does price per kW include installation?",
      answer:
        "Market quotes vary. Some bundle inverter and labor; others line-item them. Align your inputs with the quote format you receive.",
    },
    "Solar Panel Cost Calculator — Home System Price Estimate",
    "Estimate rooftop solar cost from system kW and price per kW. Budgeting aid — subsidies and taxes vary by region.",
    ["solar panel cost calculator", "home solar price estimate", "rooftop solar cost kW"],
  ),
  "home-solar-savings-calculator": article(
    "home-solar-savings-calculator",
    "Solar savings",
    [
      "Compares estimated generation against grid tariff to show monthly or annual bill offset from solar production.",
      "Net metering, export credits, and time-of-use alignment affect real savings — local policy may limit export value.",
    ],
    {
      question: "Do savings equal generation times tariff?",
      answer:
        "Roughly for self-consumed kWh under net metering. Exported surplus may earn a lower feed-in rate than retail tariff.",
    },
    "Solar Savings Calculator — Bill Offset from Generation",
    "Estimate electricity bill savings from solar kWh and grid rate. Planning tool — net-metering rules vary.",
    ["solar savings calculator", "solar bill offset", "home solar savings estimate"],
  ),
  "home-solar-panel-size-calculator": article(
    "home-solar-panel-size-calculator",
    "Solar panel size",
    [
      "Suggests system kW from daily energy need and peak sun hours — a first-pass sizing before shade and roof layout studies.",
      "Panel derating, inverter clipping, and seasonal sun angle reduce real output — installers run production models on site.",
    ],
    {
      question: "What are peak sun hours?",
      answer:
        "Equivalent hours per day at 1000 W/m² irradiance for your location. Use regional solar maps or installer data, not a generic default.",
    },
    "Solar Panel Size Calculator — kW from Daily kWh Need",
    "Size a home solar array from daily consumption and sun hours. Educational estimate — site survey required.",
    ["solar panel size calculator", "home solar kW sizing", "rooftop solar system size"],
  ),
  "home-solar-roi-calculator": article(
    "home-solar-roi-calculator",
    "Solar ROI",
    [
      "Estimates simple payback years from upfront cost divided by annual savings — a teaching view of return on investment.",
      "Panel degradation, inverter replacement, financing interest, and tariff changes extend or shorten real payback.",
    ],
    {
      question: "Is payback the same as ROI?",
      answer:
        "Payback is years to recover cost. Full ROI includes lifetime savings minus maintenance — this tool focuses on simple payback.",
    },
    "Solar ROI Calculator — Payback & Return Estimate",
    "Estimate solar payback from system cost and annual savings. Financial planning aid — not investment advice.",
    ["solar ROI calculator", "solar payback period", "home solar return estimate"],
  ),
  "home-battery-backup-calculator": article(
    "home-battery-backup-calculator",
    "Battery backup",
    [
      "Relates battery amp-hours, voltage, and usable depth-of-discharge to stored watt-hours for outage planning.",
      "Lead-acid versus lithium usable capacity and cycle life differ — follow manufacturer DoD limits, not 100% nameplate.",
    ],
    {
      question: "How much battery do I need for essentials?",
      answer:
        "List critical loads in watts, multiply by desired backup hours, then divide by usable Wh capacity with efficiency loss (~10–15%).",
    },
    "Battery Backup Calculator — Ah, Voltage & Wh Capacity",
    "Size home battery storage from Ah, voltage, and depth of discharge. Planning aid — verify with installer specs.",
    ["battery backup calculator", "home battery Ah sizing", "inverter battery capacity"],
  ),
  "home-inverter-load-calculator": article(
    "home-inverter-load-calculator",
    "Inverter load",
    [
      "Sums selected appliance watts against inverter VA or kW rating to check headroom for startup surges.",
      "Motors and compressors can draw 3–7× surge current — size inverter above steady-state sum or use soft-start planning.",
    ],
    {
      question: "Is VA the same as watts?",
      answer:
        "Not always. Power factor reduces usable watts below VA rating. Conservative sizing uses 80% of inverter VA for resistive-heavy loads.",
    },
    "Inverter Load Calculator — Appliance Watts vs Rating",
    "Check home inverter sizing against total appliance load. Safety planning — surge margins vary by equipment.",
    ["inverter load calculator", "home inverter sizing", "appliance watt sum"],
  ),
  "home-battery-backup-time-calculator": article(
    "home-battery-backup-time-calculator",
    "Battery backup time",
    [
      "Divides usable battery energy by connected load watts to estimate runtime during a power cut.",
      "As battery voltage sags, some inverters cut off early — actual runtime may be shorter than ideal Wh ÷ W arithmetic.",
    ],
    {
      question: "Why did backup end sooner than calculated?",
      answer:
        "Higher loads than planned, low battery state of charge, inverter efficiency loss, and cutoff voltage all shorten runtime.",
    },
    "Battery Backup Time Calculator — Runtime During Outage",
    "Estimate how long battery backup lasts for a given load. Outage planning aid — verify with your inverter manual.",
    ["battery backup time calculator", "inverter runtime estimate", "UPS backup hours"],
  ),
  "home-ups-calculator": article(
    "home-ups-calculator",
    "UPS sizing",
    [
      "Matches UPS VA/kVA rating and battery pack to PC, router, or home-office load for graceful shutdown time.",
      "Online versus standby UPS efficiency and battery age affect runtime — replace batteries on manufacturer schedule.",
    ],
    {
      question: "How much UPS headroom should I leave?",
      answer:
        "Many guides use 25–50% margin above steady watts for safety and future gear. Motor loads need much larger surge margin.",
    },
    "UPS Calculator — Home Office Backup Sizing",
    "Size a UPS for computers and routers from load watts and desired backup. Planning estimate — not a fire-safety cert.",
    ["UPS calculator", "home UPS sizing", "computer backup VA"],
  ),
  "home-generator-fuel-consumption-calculator": article(
    "home-generator-fuel-consumption-calculator",
    "Generator fuel consumption",
    [
      "Estimates fuel use from generator load percentage, run hours, and manufacturer fuel burn rate per hour.",
      "Elevation, fuel quality, and maintenance tune affect consumption — carry extra fuel margin for emergencies.",
    ],
    {
      question: "Should I run a generator at full load?",
      answer:
        "No. Most portable units are most efficient around 50–75% rated load. Light load can waste fuel and glaze engines.",
    },
    "Generator Fuel Consumption Calculator — Litres or Gallons per Hour",
    "Estimate generator fuel use from load and run time. Emergency planning aid — follow local safety codes.",
    ["generator fuel consumption calculator", "diesel generator fuel estimate", "backup generator litres per hour"],
  ),
};
