import type { RichArticle } from "./types";

const PRESSURE_HREF = "/conversion/unit-converters/unit-pressure";
const PRESSURE_LABEL = "Conversion · Pressure";
const ANGLE_HREF = "/conversion/unit-converters/unit-angle";
const ANGLE_LABEL = "Conversion · Angle";
const SHELL =
  "Browser unit conversion teaching aids. Pressure and angle factors are standard references for learning — gauge standards and surveying conventions may differ.";
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

const PRESSURE_ROWS: [string, string][] = [
  ["Pa ↔ bar", "1 bar = 10⁵ Pa"],
  ["psi ↔ bar", "1 psi ≈ 0.06895 bar"],
  ["atm ↔ Pa", "1 atm = 101325 Pa"],
  ["mmHg ↔ Torr", "≈ 1:1 teaching use"],
];

const ANGLE_ROWS: [string, string][] = [
  ["° ↔ rad", "π rad = 180°"],
  ["° ↔ gon", "1° = 10/9 gon"],
  ["′ ↔ °", "1° = 60′"],
];

export const UNIT_PRESSURE_ANGLE_ARTICLES: Record<string, RichArticle> = {
  "unit-pascal-bar-converter": article(
    "unit-pascal-bar-converter",
    "Pascal ↔ bar",
    [
      "Converts pascals to bars with 1 bar = 10⁵ Pa for meteorology and process gauges.",
      "The pascal is the SI unit (N/m²); bar is a convenient larger metric scale.",
    ],
    {
      question: "Is 1 bar exactly 1 atmosphere?",
      answer: "No — 1 atm = 101325 Pa ≈ 1.01325 bar. They are close but not identical.",
    },
    "Pascal to Bar Converter — Pa ↔ bar",
    "Convert pascals to bars with 1 bar = 100,000 Pa. Pressure teaching aid.",
    ["pascal to bar", "pa to bar converter", "bar to pascal"],
    PRESSURE_HREF,
    PRESSURE_LABEL,
    PRESSURE_ROWS,
    "Pressure pairs",
  ),
  "unit-psi-bar-converter": article(
    "unit-psi-bar-converter",
    "PSI ↔ bar",
    [
      "Converts pounds per square inch to bars (≈ 0.06895 bar per psi) for tires and hydraulics.",
      "US tire and compressor gauges often show psi; many metric specs list bar.",
    ],
    {
      question: "What is atmospheric pressure in psi?",
      answer: "About 14.696 psi (1 atm). Roughly 1 bar ≈ 14.5 psi.",
    },
    "PSI to Bar Converter — pounds per square inch",
    "Convert PSI to bars for tires and hydraulics. Pressure teaching aid.",
    ["psi to bar", "psi converter", "bar to psi"],
    PRESSURE_HREF,
    PRESSURE_LABEL,
    PRESSURE_ROWS,
    "Pressure pairs",
  ),
  "unit-atm-pascal-converter": article(
    "unit-atm-pascal-converter",
    "atm ↔ pascal",
    [
      "Converts standard atmospheres to pascals with 1 atm = 101325 Pa exactly.",
      "Useful for chemistry problems that state pressure in atm but equations expect Pa.",
    ],
    {
      question: "Is atm the same as bar?",
      answer: "Almost — 1 atm = 1.01325 bar. Prefer the atm↔Pa factor when precision matters.",
    },
    "Atmosphere to Pascal Converter — atm ↔ Pa",
    "Convert atmospheres to pascals (1 atm = 101325 Pa). Chemistry pressure teaching aid.",
    ["atm to pascal", "atmosphere to pa", "pascal to atm"],
    PRESSURE_HREF,
    PRESSURE_LABEL,
    PRESSURE_ROWS,
    "Pressure pairs",
  ),
  "unit-mmhg-torr-converter": article(
    "unit-mmhg-torr-converter",
    "mmHg ↔ Torr",
    [
      "Treats mmHg and Torr as 1:1 for teaching blood-pressure and vacuum contexts.",
      "Historically Torr and mmHg are extremely close; many classrooms treat them as equal.",
    ],
    {
      question: "Are mmHg and Torr exactly equal?",
      answer:
        "By modern definitions they differ by a tiny amount; teaching tools often use 1:1.",
    },
    "mmHg to Torr Converter — blood pressure units",
    "Convert mmHg to Torr for teaching (≈ 1:1). Medical and vacuum pressure aid.",
    ["mmhg to torr", "torr to mmhg", "mmhg converter"],
    PRESSURE_HREF,
    PRESSURE_LABEL,
    PRESSURE_ROWS,
    "Pressure pairs",
  ),
  "unit-degree-radian-converter": article(
    "unit-degree-radian-converter",
    "Degree ↔ radian",
    [
      "Converts degrees to radians with rad = ° × π/180 for trigonometry and calculus.",
      "A half-turn is 180° or π radians; a full turn is 360° or 2π rad.",
    ],
    {
      question: "How many degrees in one radian?",
      answer: "About 57.2958° (180/π).",
    },
    "Degree to Radian Converter — ° ↔ rad",
    "Convert degrees to radians with π/180. Trigonometry teaching aid.",
    ["degrees to radians", "degree to radian converter", "radians to degrees"],
    ANGLE_HREF,
    ANGLE_LABEL,
    ANGLE_ROWS,
    "Angle pairs",
  ),
  "unit-degree-gradian-converter": article(
    "unit-degree-gradian-converter",
    "Degree ↔ gradian",
    [
      "Converts degrees to gradians (gons) with 1° = 10/9 gon — a right angle is 100 gon.",
      "Used in some surveying and European engineering contexts.",
    ],
    {
      question: "How many gradians in a full circle?",
      answer: "400 gon (gradians). A right angle is 100 gon.",
    },
    "Degree to Gradian Converter — ° ↔ gon",
    "Convert degrees to gradians (gons) with 10/9. Survey angle teaching aid.",
    ["degrees to gradians", "degree to gon", "gradian converter"],
    ANGLE_HREF,
    ANGLE_LABEL,
    ANGLE_ROWS,
    "Angle pairs",
  ),
  "unit-arcminute-degree-converter": article(
    "unit-arcminute-degree-converter",
    "Arcminute ↔ degree",
    [
      "Converts arcminutes to degrees with 1° = 60′ for maps, astronomy, and navigation.",
      "Sixty arcseconds make one arcminute; sixty arcminutes make one degree.",
    ],
    {
      question: "What is an arcsecond?",
      answer: "1/60 of an arcminute, or 1/3600 of a degree. This tool focuses on ′ ↔ °.",
    },
    "Arcminute to Degree Converter — ′ ↔ °",
    "Convert arcminutes to degrees with ÷60. Astronomy and map angle teaching aid.",
    ["arcminutes to degrees", "arcminute converter", "minutes of arc to degrees"],
    ANGLE_HREF,
    ANGLE_LABEL,
    ANGLE_ROWS,
    "Angle pairs",
  ),
};
