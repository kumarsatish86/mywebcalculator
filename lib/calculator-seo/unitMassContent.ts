import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/unit-converters/unit-weight-mass";
const HUB_LABEL = "Conversion · Weight and mass";
const SHELL =
  "Browser unit conversion teaching aids. Factors are standard SI/imperial mass references for learning and everyday swaps — trade and legal-for-trade conventions may differ.";
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
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Mass pairs",
        columnHeaders: ["Pair", "Factor idea"],
        rows: [
          ["g ↔ kg", "1 kg = 1000 g"],
          ["kg ↔ lb", "1 kg ≈ 2.20462 lb"],
          ["lb ↔ oz", "1 lb = 16 oz"],
          ["t ↔ kg", "1 metric ton = 1000 kg"],
          ["st ↔ lb", "1 stone = 14 lb"],
        ],
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const UNIT_MASS_ARTICLES: Record<string, RichArticle> = {
  "unit-gram-kilogram-converter": article(
    "unit-gram-kilogram-converter",
    "Gram ↔ kilogram",
    [
      "Converts grams to kilograms (÷ 1000) for recipes, lab samples, and shipping labels.",
      "SI mass scales cleanly: 1000 g = 1 kg with no approximation.",
    ],
    {
      question: "Is this weight or mass?",
      answer:
        "In everyday language people say weight; the unit pair here is mass (grams and kilograms).",
    },
    "Gram to Kilogram Converter — g ↔ kg",
    "Convert grams to kilograms with the exact SI 1000 factor. Kitchen and lab mass aid.",
    ["gram to kilogram", "g to kg converter", "kg to grams"],
  ),
  "unit-kilogram-pound-converter": article(
    "unit-kilogram-pound-converter",
    "Kilogram ↔ pound",
    [
      "Converts kilograms to avoirdupois pounds (≈ 2.20462 lb/kg) for body weight and packages.",
      "Use when a scale shows kg but a label or gym chart lists pounds.",
    ],
    {
      question: "Which pound is this?",
      answer: "Avoirdupois pound (international). Not troy pounds used for precious metals.",
    },
    "Kilogram to Pound Converter — kg ↔ lb",
    "Convert kilograms to pounds with the international avoirdupois factor. Body and parcel aid.",
    ["kg to lbs", "kilogram to pound converter", "pounds to kg"],
  ),
  "unit-pound-ounce-converter": article(
    "unit-pound-ounce-converter",
    "Pound ↔ ounce",
    [
      "Splits or combines pounds and ounces with 1 lb = 16 oz for cooking and shipping.",
      "Enter pounds to see total ounces, or ounces to see fractional pounds.",
    ],
    {
      question: "Are these fluid ounces?",
      answer: "No — these are avoirdupois mass ounces (weight), not US fluid ounces (volume).",
    },
    "Pound to Ounce Converter — lb ↔ oz",
    "Convert pounds to ounces with 16 oz per pound. Cooking and shipping mass aid.",
    ["pounds to ounces", "lb to oz converter", "ounces to pounds"],
  ),
  "unit-ton-kilogram-converter": article(
    "unit-ton-kilogram-converter",
    "Metric ton ↔ kilogram",
    [
      "Converts metric tons (tonnes) to kilograms with 1 t = 1000 kg for freight and bulk materials.",
      "This is the metric tonne — not the US short ton (2000 lb) or UK long ton.",
    ],
    {
      question: "Is a ton the same as a tonne?",
      answer:
        "Here ton means metric tonne (1000 kg). US short tons and UK long tons use different factors.",
    },
    "Ton to Kilogram Converter — metric tonne ↔ kg",
    "Convert metric tons to kilograms (1 t = 1000 kg). Freight and bulk mass teaching aid.",
    ["ton to kg", "tonne to kilogram", "metric ton converter"],
  ),
  "unit-stone-pound-converter": article(
    "unit-stone-pound-converter",
    "Stone ↔ pound",
    [
      "Converts UK stones to pounds with 1 stone = 14 lb — common for body weight in Britain and Ireland.",
      "Enter stones to get pounds, or pounds to express weight in stones.",
    ],
    {
      question: "How many kg is one stone?",
      answer: "About 6.35029 kg (14 × 0.45359237). Convert stone→lb first, then lb→kg if needed.",
    },
    "Stone to Pound Converter — st ↔ lb",
    "Convert stones to pounds with 14 lb per stone. UK body-weight teaching aid.",
    ["stone to pounds", "st to lb converter", "pounds to stone"],
  ),
};
