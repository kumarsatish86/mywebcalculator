import type { RichArticle } from "./types";

const AREA_HREF = "/conversion/unit-converters/unit-area";
const AREA_LABEL = "Conversion · Area";
const VOLUME_HREF = "/conversion/unit-converters/unit-volume";
const VOLUME_LABEL = "Conversion · Volume";
const SHELL =
  "Browser unit conversion teaching aids. Factors are standard area and volume references for learning and everyday swaps — survey, cooking, and trade conventions may differ.";
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

const AREA_ROWS: [string, string][] = [
  ["m² ↔ ft²", "1 m² ≈ 10.764 ft²"],
  ["acre ↔ ha", "1 acre ≈ 0.4047 ha"],
  ["km² ↔ mi²", "1 km² ≈ 0.3861 mi²"],
  ["yd² ↔ ft²", "1 yd² = 9 ft²"],
];

const VOLUME_ROWS: [string, string][] = [
  ["L ↔ mL", "1 L = 1000 mL"],
  ["L ↔ gal", "US and UK gallons differ"],
  ["m³ ↔ L", "1 m³ = 1000 L"],
  ["cup ↔ mL", "1 US cup ≈ 236.59 mL"],
  ["tbsp ↔ tsp", "1 tbsp = 3 tsp"],
];

export const UNIT_AREA_VOLUME_ARTICLES: Record<string, RichArticle> = {
  "unit-square-meter-square-feet-converter": article(
    "unit-square-meter-square-feet-converter",
    "Square meter ↔ square feet",
    [
      "Converts floor and plot area between m² and ft² (≈ 10.764 ft² per m²).",
      "Common when blueprints use feet but carpet or paint quotes use metric.",
    ],
    {
      question: "Is this the same as square yards?",
      answer: "No — use the square yard ↔ square feet tool for yd². This pair is m² and ft² only.",
    },
    "Square Meter to Square Feet Converter — m² ↔ ft²",
    "Convert square meters to square feet for floors and plots. Area teaching aid.",
    ["m2 to sq ft", "square meters to square feet", "sq ft to m2"],
    AREA_HREF,
    AREA_LABEL,
    AREA_ROWS,
    "Area pairs",
  ),
  "unit-acre-hectare-converter": article(
    "unit-acre-hectare-converter",
    "Acre ↔ hectare",
    [
      "Converts land area between acres and hectares (1 acre ≈ 0.4047 ha).",
      "Useful for farms, listings, and comparing US acre parcels with metric ha.",
    ],
    {
      question: "How many acres in a hectare?",
      answer: "About 2.471 acres (1 ÷ 0.40468564224).",
    },
    "Acre to Hectare Converter — acre ↔ ha",
    "Convert acres to hectares for land and farm area. Survey teaching aid.",
    ["acre to hectare", "acres to ha", "hectare to acre converter"],
    AREA_HREF,
    AREA_LABEL,
    AREA_ROWS,
    "Area pairs",
  ),
  "unit-square-kilometer-square-mile-converter": article(
    "unit-square-kilometer-square-mile-converter",
    "Square kilometer ↔ square mile",
    [
      "Converts large regions between km² and mi² (1 km² ≈ 0.3861 mi²).",
      "Use for maps, city size, and watershed or park area comparisons.",
    ],
    {
      question: "Is this nautical miles squared?",
      answer: "No — this uses statute square miles paired with square kilometers.",
    },
    "Square Kilometer to Square Mile Converter — km² ↔ mi²",
    "Convert square kilometers to square miles for regions and maps. Area teaching aid.",
    ["km2 to sq mi", "square km to square miles", "sq miles to km2"],
    AREA_HREF,
    AREA_LABEL,
    AREA_ROWS,
    "Area pairs",
  ),
  "unit-square-yard-square-feet-converter": article(
    "unit-square-yard-square-feet-converter",
    "Square yard ↔ square feet",
    [
      "Converts carpet and fabric area with 1 yd² = 9 ft² — an exact imperial relationship.",
      "Enter either unit when a quote mixes yards and feet of coverage.",
    ],
    {
      question: "How many square feet in a square yard?",
      answer: "Exactly 9 — a yard is 3 feet on each side, so 3 × 3 = 9 ft².",
    },
    "Square Yard to Square Feet Converter — yd² ↔ ft²",
    "Convert square yards to square feet with the exact 9× factor. Carpet and fabric aid.",
    ["square yards to square feet", "yd2 to sq ft", "sq ft to square yards"],
    AREA_HREF,
    AREA_LABEL,
    AREA_ROWS,
    "Area pairs",
  ),
  "unit-liter-milliliter-converter": article(
    "unit-liter-milliliter-converter",
    "Liter ↔ milliliter",
    [
      "Converts liters to milliliters with 1 L = 1000 mL for drinks, meds, and lab solutions.",
      "Same SI scale as grams to kilograms — exact decimal, no rounding needed for the factor.",
    ],
    {
      question: "Is 1 mL the same as 1 cm³?",
      answer: "For practical teaching use yes — 1 mL equals 1 cubic centimeter.",
    },
    "Liter to Milliliter Converter — L ↔ mL",
    "Convert liters to milliliters with the exact 1000 factor. Kitchen and lab volume aid.",
    ["liter to ml", "l to ml converter", "milliliters to liters"],
    VOLUME_HREF,
    VOLUME_LABEL,
    VOLUME_ROWS,
    "Volume pairs",
  ),
  "unit-liter-gallon-us-uk-converter": article(
    "unit-liter-gallon-us-uk-converter",
    "Liter ↔ gallon (US / UK)",
    [
      "Shows liters as both US gallons (≈ 3.785 L) and UK gallons (≈ 4.546 L) side by side.",
      "Always check which gallon a fuel or recipe label means — they are not interchangeable.",
    ],
    {
      question: "Which gallon should I use?",
      answer:
        "US labels and US pumps use the US gallon. UK imperial gallons are larger (~4.546 L).",
    },
    "Liter to Gallon Converter — US and UK",
    "Convert liters to US and UK gallons in one view. Fuel and recipe volume teaching aid.",
    ["liters to gallons", "L to gal US UK", "imperial gallon converter"],
    VOLUME_HREF,
    VOLUME_LABEL,
    VOLUME_ROWS,
    "Volume pairs",
  ),
  "unit-cubic-meter-liter-converter": article(
    "unit-cubic-meter-liter-converter",
    "Cubic meter ↔ liter",
    [
      "Converts cubic meters to liters with 1 m³ = 1000 L for tanks, pools, and bulk liquids.",
      "Useful when a supplier quotes m³ but you think in liters of capacity.",
    ],
    {
      question: "How many liters in a cubic meter?",
      answer: "Exactly 1000 liters.",
    },
    "Cubic Meter to Liter Converter — m³ ↔ L",
    "Convert cubic meters to liters with the exact 1000 factor. Tank and pool volume aid.",
    ["m3 to liters", "cubic meter to liter", "liters to cubic meters"],
    VOLUME_HREF,
    VOLUME_LABEL,
    VOLUME_ROWS,
    "Volume pairs",
  ),
  "unit-cup-milliliter-converter": article(
    "unit-cup-milliliter-converter",
    "Cup ↔ milliliter",
    [
      "Converts US cups to milliliters (≈ 236.59 mL per cup) for baking and kitchen scales.",
      "Metric cup standards differ by country — this tool uses the US customary cup.",
    ],
    {
      question: "Is a US cup the same as a metric cup?",
      answer: "No — a metric cup is often 250 mL. This converter uses the US cup ≈ 236.59 mL.",
    },
    "Cup to Milliliter Converter — US cup ↔ mL",
    "Convert US cups to milliliters for recipes. Kitchen volume teaching aid.",
    ["cups to ml", "cup to milliliter", "ml to cups converter"],
    VOLUME_HREF,
    VOLUME_LABEL,
    VOLUME_ROWS,
    "Volume pairs",
  ),
  "unit-tablespoon-teaspoon-converter": article(
    "unit-tablespoon-teaspoon-converter",
    "Tablespoon ↔ teaspoon",
    [
      "Converts tablespoons to teaspoons with 1 tbsp = 3 tsp for recipes and dosing spoons.",
      "Keep level measures consistent; heaping spoons break the simple 3× rule.",
    ],
    {
      question: "Is a tablespoon always 15 mL?",
      answer:
        "Many metric teaching tables use 15 mL tbsp and 5 mL tsp; US customary volumes are close but not identical.",
    },
    "Tablespoon to Teaspoon Converter — tbsp ↔ tsp",
    "Convert tablespoons to teaspoons with 3 tsp per tbsp. Cooking measure teaching aid.",
    ["tablespoon to teaspoon", "tbsp to tsp", "teaspoons to tablespoons"],
    VOLUME_HREF,
    VOLUME_LABEL,
    VOLUME_ROWS,
    "Volume pairs",
  ),
};
