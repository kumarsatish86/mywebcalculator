import type { RichArticle } from "./types";

const FUEL_HREF = "/conversion/unit-converters/unit-fuel-economy";
const FUEL_LABEL = "Conversion · Fuel economy";
const DENSITY_HREF = "/conversion/unit-converters/unit-density";
const DENSITY_LABEL = "Conversion · Density";
const FORCE_HREF = "/conversion/unit-converters/unit-force";
const FORCE_LABEL = "Conversion · Force";
const CONC_HREF = "/conversion/unit-converters/unit-concentration";
const CONC_LABEL = "Conversion · Concentration";
const CONST_HREF = "/conversion/unit-converters/unit-construction";
const CONST_LABEL = "Conversion · Construction units";
const TEXTILE_HREF = "/conversion/unit-converters/unit-textile-fabric";
const TEXTILE_LABEL = "Conversion · Textile and fabric";
const SHELL =
  "Browser unit conversion teaching aids. Applied factors are standard references for learning — fuel labels, lab methods, and site practices may differ.";
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

const FUEL_ROWS: [string, string][] = [
  ["km/L ↔ mpg US", "mpg US ≈ km/L × 2.352"],
  ["mpg US ↔ mpg UK", "UK gallon is larger"],
];

const DENSITY_ROWS: [string, string][] = [["kg/m³ ↔ g/cm³", "1 g/cm³ = 1000 kg/m³"]];

const FORCE_ROWS: [string, string][] = [
  ["N ↔ kgf", "1 kgf = 9.80665 N"],
  ["N ↔ lbf", "1 lbf ≈ 4.448 N"],
];

const CONC_ROWS: [string, string][] = [
  ["Molarity", "mol ÷ liters"],
  ["mg/L ↔ ppm", "≈ 1:1 in dilute water"],
];

const CONST_ROWS: [string, string][] = [
  ["Cement bags", "bags × kg/bag"],
  ["Sand volume", "m³ × density → tons"],
  ["Bricks", "area ÷ face × waste"],
];

const TEXTILE_ROWS: [string, string][] = [
  ["GSM ↔ oz/yd²", "fabric areal density"],
  ["Nm ↔ Ne", "yarn count approx"],
];

export const UNIT_APPLIED_ARTICLES: Record<string, RichArticle> = {
  "unit-km-per-liter-mpg-converter": article(
    "unit-km-per-liter-mpg-converter",
    "km/L ↔ mpg (US)",
    [
      "Converts metric fuel economy (km per liter) to US miles per gallon (≈ × 2.352).",
      "Higher km/L or mpg both mean better efficiency — confirm which gallon the mpg uses.",
    ],
    {
      question: "Is this US or UK mpg?",
      answer: "US mpg. Use the US↔UK mpg converter when comparing imperial gallon economy.",
    },
    "km/L to MPG Converter — fuel economy",
    "Convert km per liter to US miles per gallon. Vehicle efficiency teaching aid.",
    ["km/l to mpg", "km per liter to mpg", "mpg to km/l"],
    FUEL_HREF,
    FUEL_LABEL,
    FUEL_ROWS,
    "Fuel economy pairs",
  ),
  "unit-mpg-us-mpg-uk-converter": article(
    "unit-mpg-us-mpg-uk-converter",
    "mpg (US) ↔ mpg (UK)",
    [
      "Converts US mpg to UK mpg — UK gallons are larger, so UK mpg numbers read higher for the same car.",
      "Factor ≈ 1.201 UK mpg per US mpg for the same distance and fuel mass/volume basis.",
    ],
    {
      question: "Which mpg is on my car sticker?",
      answer: "US vehicles use US mpg; older UK materials may use imperial mpg. Check the market.",
    },
    "US MPG to UK MPG Converter",
    "Convert US miles per gallon to UK (imperial) mpg. Fuel economy teaching aid.",
    ["mpg us to uk", "imperial mpg converter", "us mpg vs uk mpg"],
    FUEL_HREF,
    FUEL_LABEL,
    FUEL_ROWS,
    "Fuel economy pairs",
  ),
  "unit-kg-per-m3-g-per-cm3-converter": article(
    "unit-kg-per-m3-g-per-cm3-converter",
    "kg/m³ ↔ g/cm³",
    [
      "Converts density between kg/m³ and g/cm³ with 1 g/cm³ = 1000 kg/m³ (water ≈ 1 g/cm³).",
      "Materials science and lab sheets often mix the two scales.",
    ],
    {
      question: "What is water’s density here?",
      answer: "About 1000 kg/m³ or 1 g/cm³ at teaching reference conditions.",
    },
    "kg/m³ to g/cm³ Converter — density",
    "Convert kg per cubic meter to grams per cubic centimeter. Density teaching aid.",
    ["kg/m3 to g/cm3", "density converter", "g/cm3 to kg/m3"],
    DENSITY_HREF,
    DENSITY_LABEL,
    DENSITY_ROWS,
    "Density pairs",
  ),
  "unit-newton-kgf-converter": article(
    "unit-newton-kgf-converter",
    "Newton ↔ kgf",
    [
      "Converts newtons to kilogram-force with 1 kgf = 9.80665 N (standard gravity).",
      "kgf appears on older machine plates; SI prefers newtons.",
    ],
    {
      question: "Is kgf the same as kg?",
      answer: "No — kg is mass. kgf is the force of that mass under standard gravity ≈ 9.80665 N.",
    },
    "Newton to kgf Converter — force",
    "Convert newtons to kilogram-force (1 kgf = 9.80665 N). Force teaching aid.",
    ["newton to kgf", "n to kgf converter", "kgf to newton"],
    FORCE_HREF,
    FORCE_LABEL,
    FORCE_ROWS,
    "Force pairs",
  ),
  "unit-newton-pound-force-converter": article(
    "unit-newton-pound-force-converter",
    "Newton ↔ pound-force",
    [
      "Converts newtons to pound-force (≈ 0.2248 lbf per N) for US specs and SI lab data.",
      "1 lbf ≈ 4.448 N — the force of one pound-mass under standard gravity.",
    ],
    {
      question: "Is lbf the same as lb?",
      answer: "lb is mass (or weight colloquially). lbf is force. This tool converts N ↔ lbf.",
    },
    "Newton to Pound-Force Converter — N ↔ lbf",
    "Convert newtons to pound-force for SI and US force specs. Teaching aid.",
    ["newton to lbf", "n to pound force", "lbf to newton"],
    FORCE_HREF,
    FORCE_LABEL,
    FORCE_ROWS,
    "Force pairs",
  ),
  "unit-molarity-converter": article(
    "unit-molarity-converter",
    "Molarity",
    [
      "Computes molarity as moles of solute ÷ liters of solution (mol/L or M).",
      "Enter moles and solution volume; teaching estimate only — not a lab SOP.",
    ],
    {
      question: "Is molarity the same as molality?",
      answer: "No — molality is moles per kilogram of solvent. This tool is moles per liter of solution.",
    },
    "Molarity Calculator — mol/L concentration",
    "Calculate molarity from moles and solution liters. Chemistry concentration teaching aid.",
    ["molarity calculator", "mol per liter", "concentration mol/L"],
    CONC_HREF,
    CONC_LABEL,
    CONC_ROWS,
    "Concentration tools",
  ),
  "unit-mg-per-liter-ppm-converter": article(
    "unit-mg-per-liter-ppm-converter",
    "mg/L ↔ ppm",
    [
      "Treats mg/L and ppm as 1:1 for dilute aqueous solutions in water-quality teaching.",
      "For dense or non-water solvents the mass/mass ppm relationship can differ.",
    ],
    {
      question: "When is mg/L not equal to ppm?",
      answer:
        "When solution density is not ~1 g/mL or ppm is defined on a mass/mass basis for other media.",
    },
    "mg/L to PPM Converter — water quality",
    "Convert mg per liter to ppm for dilute water solutions. Concentration teaching aid.",
    ["mg/l to ppm", "ppm converter water", "ppm to mg/l"],
    CONC_HREF,
    CONC_LABEL,
    CONC_ROWS,
    "Concentration tools",
  ),
  "unit-cement-bag-kilogram-converter": article(
    "unit-cement-bag-kilogram-converter",
    "Cement bag ↔ kilogram",
    [
      "Multiplies bag count by kg per bag (default 50 kg) for site cement mass estimates.",
      "Confirm local bag weight — 40 kg and 50 kg bags are both common.",
    ],
    {
      question: "Is 50 kg the only bag size?",
      answer: "No — enter your bag kg. Many regions use 50 kg; others use 40 kg or different packs.",
    },
    "Cement Bag to Kilogram Converter",
    "Convert cement bags to kilograms with configurable kg/bag. Site teaching estimate.",
    ["cement bag to kg", "cement bags calculator", "50 kg cement bag"],
    CONST_HREF,
    CONST_LABEL,
    CONST_ROWS,
    "Construction tools",
  ),
  "unit-sand-volume-converter": article(
    "unit-sand-volume-converter",
    "Sand volume ↔ tons",
    [
      "Estimates sand mass from volume × density (default ~1600 kg/m³) as metric tons.",
      "Bulk density varies with moisture and packing — adjust density for closer site estimates.",
    ],
    {
      question: "Why change density?",
      answer: "Wet or compacted sand is denser than dry loose sand; the default is a teaching mid value.",
    },
    "Sand Volume Converter — m³ to tons",
    "Convert sand cubic meters to metric tons using density. Construction teaching estimate.",
    ["sand volume to tons", "sand m3 to tonnes", "sand density converter"],
    CONST_HREF,
    CONST_LABEL,
    CONST_ROWS,
    "Construction tools",
  ),
  "unit-brick-calculator-units": article(
    "unit-brick-calculator-units",
    "Brick count estimate",
    [
      "Estimates bricks from wall area ÷ brick face area, plus a waste percentage for teaching takeoffs.",
      "Not a structural design tool — verify bond, openings, and local brick sizes on site.",
    ],
    {
      question: "What face area should I use?",
      answer:
        "Use the exposed brick face including mortar joint allowance your schedule specifies (default is a teaching size).",
    },
    "Brick Calculator Units — wall brick estimate",
    "Estimate brick count from wall area, face size, and waste %. Construction teaching aid.",
    ["brick calculator", "bricks for wall", "brick quantity estimator"],
    CONST_HREF,
    CONST_LABEL,
    CONST_ROWS,
    "Construction tools",
  ),
  "unit-gsm-oz-per-yd2-converter": article(
    "unit-gsm-oz-per-yd2-converter",
    "GSM ↔ oz/yd²",
    [
      "Converts fabric areal density between g/m² (GSM) and ounces per square yard.",
      "Apparel and technical textiles often quote GSM; some US specs use oz/yd².",
    ],
    {
      question: "What does GSM mean?",
      answer: "Grams per square meter — fabric weight per unit area, not yarn count.",
    },
    "GSM to oz/yd² Converter — fabric weight",
    "Convert fabric GSM to ounces per square yard. Textile teaching aid.",
    ["gsm to oz/yd2", "fabric gsm converter", "oz per yard to gsm"],
    TEXTILE_HREF,
    TEXTILE_LABEL,
    TEXTILE_ROWS,
    "Textile pairs",
  ),
  "unit-yarn-count-converter": article(
    "unit-yarn-count-converter",
    "Yarn count Nm ↔ Ne",
    [
      "Approximates metric yarn count (Nm) to English cotton count (Ne) with Ne ≈ Nm × 0.5905.",
      "Yarn systems vary by fiber — treat this as a cotton teaching factor, not a mill guarantee.",
    ],
    {
      question: "Is Nm to Ne exact for all fibers?",
      answer: "No — this uses a common cotton teaching factor. Specialty yarns may need mill tables.",
    },
    "Yarn Count Converter — Nm to Ne",
    "Convert metric yarn count Nm to approximate Ne (cotton). Textile teaching aid.",
    ["yarn count converter", "nm to ne", "metric yarn count"],
    TEXTILE_HREF,
    TEXTILE_LABEL,
    TEXTILE_ROWS,
    "Textile pairs",
  ),
};
