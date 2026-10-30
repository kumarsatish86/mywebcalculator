import type { RichArticle } from "./types";

const ENERGY_HREF = "/conversion/unit-converters/unit-energy";
const ENERGY_LABEL = "Conversion · Energy";
const POWER_HREF = "/conversion/unit-converters/unit-power";
const POWER_LABEL = "Conversion · Power";
const FREQ_HREF = "/conversion/unit-converters/unit-frequency";
const FREQ_LABEL = "Conversion · Frequency";
const SHELL =
  "Browser unit conversion teaching aids. Energy, power, and frequency factors are standard SI references for learning — utility tariffs and trade definitions may differ.";
const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption:
    "Share URL preserves your inputs. Conversion factors are standard references; trade conventions may differ.",
};

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  hubHref: string,
  hubLabel: string,
  tableRows: [string, string][],
  tableTitle: string,
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: tableTitle,
        columnHeaders: ["Pair", "Factor idea"],
        rows: tableRows,
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref,
    hubLabel,
  };
}

const ENERGY_ROWS: [string, string][] = [
  ["J ↔ kJ", "1 kJ = 1000 J"],
  ["cal ↔ kcal", "1 kcal = 1000 cal"],
  ["kWh ↔ J", "1 kWh = 3.6×10⁶ J"],
  ["BTU ↔ J", "1 BTU ≈ 1055 J"],
];

const POWER_ROWS: [string, string][] = [
  ["W ↔ kW", "1 kW = 1000 W"],
  ["hp ↔ W", "1 mech hp ≈ 745.7 W"],
];

const FREQ_ROWS: [string, string][] = [
  ["Hz ↔ kHz…", "SI ×1000 prefixes"],
  ["rpm ↔ Hz", "Hz = rpm ÷ 60"],
];

export const UNIT_ENERGY_POWER_ARTICLES: Record<string, RichArticle> = {
  "unit-joule-kilojoule-converter": article(
    "unit-joule-kilojoule-converter",
    "Joule ↔ kilojoule",
    [
      "Converts joules to kilojoules (÷ 1000) for physics homework and nutrition labels in kJ.",
      "SI kilo prefix is exact: 1000 J = 1 kJ.",
    ],
    {
      question: "Is a food calorie a kilojoule?",
      answer:
        "Food “Calories” are usually kilocalories. Roughly 1 kcal ≈ 4.184 kJ — use a cal/kcal tool first.",
    },
    "Joule to Kilojoule Converter — J ↔ kJ",
    "Convert joules to kilojoules with the exact SI 1000 factor. Energy teaching aid.",
    ["joule to kilojoule", "j to kj converter", "kj to joules"],
    ENERGY_HREF,
    ENERGY_LABEL,
    ENERGY_ROWS,
    "Energy pairs",
  ),
  "unit-calorie-kilocalorie-converter": article(
    "unit-calorie-kilocalorie-converter",
    "Calorie ↔ kilocalorie",
    [
      "Converts small calories to kilocalories with 1 kcal = 1000 cal for food-energy teaching.",
      "Nutrition labels that say “Calories” usually mean kilocalories (kcal).",
    ],
    {
      question: "Is this a thermochemical calorie?",
      answer:
        "This tool scales cal ↔ kcal by 1000. Chemistry may also use ≈ 4.184 J per calorie separately.",
    },
    "Calorie to Kilocalorie Converter — cal ↔ kcal",
    "Convert calories to kilocalories with the 1000 factor. Food energy teaching aid.",
    ["calorie to kcal", "cal to kilocalorie", "kcal to calories"],
    ENERGY_HREF,
    ENERGY_LABEL,
    ENERGY_ROWS,
    "Energy pairs",
  ),
  "unit-kwh-joule-converter": article(
    "unit-kwh-joule-converter",
    "kWh ↔ joule",
    [
      "Converts kilowatt-hours to joules with 1 kWh = 3.6×10⁶ J for bills and physics energy totals.",
      "A kWh is energy (power × time); watts alone are power, not energy.",
    ],
    {
      question: "How many joules in 1 kWh?",
      answer: "Exactly 3,600,000 joules (1000 W × 3600 s).",
    },
    "kWh to Joule Converter — kilowatt-hour energy",
    "Convert kilowatt-hours to joules (1 kWh = 3.6 MJ). Utility energy teaching aid.",
    ["kwh to joules", "kilowatt hour to joule", "joules to kwh"],
    ENERGY_HREF,
    ENERGY_LABEL,
    ENERGY_ROWS,
    "Energy pairs",
  ),
  "unit-btu-joule-converter": article(
    "unit-btu-joule-converter",
    "BTU ↔ joule",
    [
      "Converts British thermal units to joules (≈ 1055.06 J per BTU) for HVAC and heat load teaching.",
      "BTU definitions vary slightly by context; this uses a common international teaching factor.",
    ],
    {
      question: "Is BTU power or energy?",
      answer:
        "BTU alone is energy. BTU/h is a power rate often used for heating and cooling capacity.",
    },
    "BTU to Joule Converter — heat energy",
    "Convert BTU to joules with a standard international factor. HVAC energy teaching aid.",
    ["btu to joules", "btu converter", "joules to btu"],
    ENERGY_HREF,
    ENERGY_LABEL,
    ENERGY_ROWS,
    "Energy pairs",
  ),
  "unit-watt-kilowatt-converter": article(
    "unit-watt-kilowatt-converter",
    "Watt ↔ kilowatt",
    [
      "Converts watts to kilowatts (÷ 1000) for appliance ratings and generator labels.",
      "Power is energy per time — do not confuse W/kW with Wh/kWh energy units.",
    ],
    {
      question: "Is 1 kW the same as 1 kWh?",
      answer: "No — 1 kW is power. 1 kWh is that power sustained for one hour (energy).",
    },
    "Watt to Kilowatt Converter — W ↔ kW",
    "Convert watts to kilowatts with the exact SI 1000 factor. Power teaching aid.",
    ["watts to kilowatts", "w to kw converter", "kw to watts"],
    POWER_HREF,
    POWER_LABEL,
    POWER_ROWS,
    "Power pairs",
  ),
  "unit-horsepower-watt-converter": article(
    "unit-horsepower-watt-converter",
    "Horsepower ↔ watt",
    [
      "Converts mechanical horsepower to watts (≈ 745.7 W per hp) for engines and motors.",
      "Metric and electrical horsepower definitions differ slightly — this uses mechanical hp.",
    ],
    {
      question: "Is metric hp the same?",
      answer:
        "Metric Pferdestärke (PS) is about 735.5 W. This converter uses mechanical hp ≈ 745.7 W.",
    },
    "Horsepower to Watt Converter — hp ↔ W",
    "Convert mechanical horsepower to watts (~745.7 W/hp). Engine power teaching aid.",
    ["hp to watts", "horsepower to watt converter", "watts to horsepower"],
    POWER_HREF,
    POWER_LABEL,
    POWER_ROWS,
    "Power pairs",
  ),
  "unit-hz-khz-mhz-ghz-converter": article(
    "unit-hz-khz-mhz-ghz-converter",
    "Hz ↔ kHz ↔ MHz ↔ GHz",
    [
      "Scales hertz through kilo-, mega-, and gigahertz with SI ×1000 prefixes for radio and CPU clocks.",
      "Enter Hz once to see the same frequency in each larger unit.",
    ],
    {
      question: "Is 1 MHz exactly 1000 kHz?",
      answer: "Yes under SI decimal prefixes used here (×1000 each step).",
    },
    "Hz kHz MHz GHz Converter — frequency prefixes",
    "Convert hertz to kHz, MHz, and GHz with SI prefixes. Frequency teaching aid.",
    ["hz to mhz", "khz to mhz converter", "ghz to hz"],
    FREQ_HREF,
    FREQ_LABEL,
    FREQ_ROWS,
    "Frequency pairs",
  ),
  "unit-rpm-hz-converter": article(
    "unit-rpm-hz-converter",
    "RPM ↔ Hz",
    [
      "Converts revolutions per minute to hertz with Hz = rpm ÷ 60 for motors and rotating shafts.",
      "One revolution per second equals 60 rpm and 1 Hz of rotation frequency.",
    ],
    {
      question: "Is this angular frequency ω?",
      answer: "No — this is cyclic frequency in Hz (rev/s). Angular ω = 2πf in rad/s.",
    },
    "RPM to Hz Converter — rotation frequency",
    "Convert RPM to hertz with ÷60. Motor and shaft frequency teaching aid.",
    ["rpm to hz", "rpm to frequency", "hz to rpm converter"],
    FREQ_HREF,
    FREQ_LABEL,
    FREQ_ROWS,
    "Frequency pairs",
  ),
};
