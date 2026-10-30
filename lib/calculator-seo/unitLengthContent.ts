import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/unit-converters/unit-length-distance";
const HUB_LABEL = "Conversion · Length and distance";
const SHELL =
  "Browser unit conversion teaching aids. Factors are standard SI/imperial references for learning and everyday swaps — survey, trade, and engineering conventions may differ.";
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
        title: "Length pairs",
        columnHeaders: ["Pair", "Factor idea"],
        rows: [
          ["m ↔ km", "1 km = 1000 m"],
          ["cm ↔ m", "1 m = 100 cm"],
          ["in ↔ cm", "1 in = 2.54 cm"],
          ["ft ↔ m", "1 ft = 0.3048 m"],
          ["mi ↔ km", "1 mi = 1.609344 km"],
          ["nmi ↔ km", "1 nmi = 1.852 km"],
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

export const UNIT_LENGTH_ARTICLES: Record<string, RichArticle> = {
  "unit-meter-kilometer-converter": article(
    "unit-meter-kilometer-converter",
    "Meter ↔ kilometer",
    [
      "Converts meters to kilometers (÷ 1000) and back for maps, tracks, and lab distances.",
      "Use meters for short spans and kilometers for road or trail distances.",
    ],
    {
      question: "Is 1 km exactly 1000 m?",
      answer: "Yes — the SI definition is exact: 1 kilometer = 1000 meters.",
    },
    "Meter to Kilometer Converter — m ↔ km",
    "Convert meters to kilometers and back with the exact SI 1000 factor. Teaching unit aid.",
    ["meter to kilometer", "m to km converter", "kilometer to meter"],
  ),
  "unit-centimeter-meter-converter": article(
    "unit-centimeter-meter-converter",
    "Centimeter ↔ meter",
    [
      "Swaps centimeters and meters using 1 m = 100 cm — common for height, fabric, and crafts.",
      "Enter either side; the other updates with the fixed SI relationship.",
    ],
    {
      question: "How many cm in a meter?",
      answer: "Exactly 100 centimeters equal one meter.",
    },
    "Centimeter to Meter Converter — cm ↔ m",
    "Convert centimeters to meters and meters to centimeters. Exact SI length teaching tool.",
    ["cm to meter", "centimeter to meter converter", "m to cm"],
  ),
  "unit-millimeter-meter-converter": article(
    "unit-millimeter-meter-converter",
    "Millimeter ↔ meter",
    [
      "Converts millimeters to meters (÷ 1000) for machining, drawings, and fine measurements.",
      "Keep drawings consistent: specs in mm convert cleanly to meters for totals.",
    ],
    {
      question: "How many mm in a meter?",
      answer: "Exactly 1000 millimeters equal one meter.",
    },
    "Millimeter to Meter Converter — mm ↔ m",
    "Convert millimeters to meters with the SI 1000 factor. Precision length teaching aid.",
    ["mm to meter", "millimeter to meter converter", "m to mm"],
  ),
  "unit-inch-centimeter-converter": article(
    "unit-inch-centimeter-converter",
    "Inch ↔ centimeter",
    [
      "Uses the exact international inch: 1 in = 2.54 cm for DIY, screens, and body measures.",
      "Convert either direction when a tape mixes imperial and metric markings.",
    ],
    {
      question: "Is 2.54 cm per inch exact?",
      answer: "Yes — the international inch is defined as exactly 2.54 centimeters.",
    },
    "Inch to Centimeter Converter — in ↔ cm",
    "Convert inches to centimeters with the exact 2.54 cm definition. Everyday length aid.",
    ["inch to cm", "inches to centimeters", "cm to inches converter"],
  ),
  "unit-feet-meter-converter": article(
    "unit-feet-meter-converter",
    "Feet ↔ meter",
    [
      "Converts feet to meters with 1 ft = 0.3048 m — standard for height and room dimensions.",
      "Useful when plans list feet but materials or codes use meters.",
    ],
    {
      question: "How many feet in a meter?",
      answer: "About 3.28084 feet (1 ÷ 0.3048). One foot is exactly 0.3048 meters.",
    },
    "Feet to Meter Converter — ft ↔ m",
    "Convert feet to meters using the international foot definition. Height and room length aid.",
    ["feet to meters", "ft to m converter", "meters to feet"],
  ),
  "unit-yard-meter-converter": article(
    "unit-yard-meter-converter",
    "Yard ↔ meter",
    [
      "Converts yards to meters with 1 yd = 0.9144 m for fabric, sports fields, and landscaping.",
      "Three feet make one yard; meters give SI-compatible totals.",
    ],
    {
      question: "How many yards in a meter?",
      answer: "About 1.09361 yards (1 ÷ 0.9144). One yard is exactly 0.9144 meters.",
    },
    "Yard to Meter Converter — yd ↔ m",
    "Convert yards to meters with the exact international yard. Fabric and field length aid.",
    ["yard to meter", "yd to m converter", "meters to yards"],
  ),
  "unit-mile-kilometer-converter": article(
    "unit-mile-kilometer-converter",
    "Mile ↔ kilometer",
    [
      "Converts statute miles to kilometers with 1 mi = 1.609344 km for road trips and maps.",
      "Use when US mile markers need metric distance or the reverse.",
    ],
    {
      question: "Is this a nautical mile?",
      answer: "No — this is the statute (land) mile. Use the nautical mile converter for sea/air nmi.",
    },
    "Mile to Kilometer Converter — mi ↔ km",
    "Convert statute miles to kilometers with the international mile factor. Road distance aid.",
    ["miles to km", "mile to kilometer converter", "km to miles"],
  ),
  "unit-nautical-mile-converter": article(
    "unit-nautical-mile-converter",
    "Nautical mile ↔ kilometer",
    [
      "Converts nautical miles to kilometers with 1 nmi = 1.852 km for marine and aviation charts.",
      "Do not mix with statute miles — nmi are longer and tied to latitude arcs.",
    ],
    {
      question: "Why is a nautical mile different?",
      answer:
        "One nmi is defined as 1852 m, historically linked to one minute of latitude — not the statute mile.",
    },
    "Nautical Mile Converter — nmi ↔ km",
    "Convert nautical miles to kilometers (1 nmi = 1.852 km). Marine and aviation teaching aid.",
    ["nautical mile converter", "nmi to km", "nautical miles to kilometers"],
  ),
};
