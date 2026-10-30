import type { RichArticle } from "./types";

const TEMP_HREF = "/conversion/unit-converters/unit-temperature";
const TEMP_LABEL = "Conversion · Temperature";
const TIME_HREF = "/conversion/unit-converters/unit-time-duration";
const TIME_LABEL = "Conversion · Time and duration";
const SPEED_HREF = "/conversion/unit-converters/unit-speed";
const SPEED_LABEL = "Conversion · Speed";
const SHELL =
  "Browser unit conversion teaching aids. Temperature, time, and speed factors are standard references for learning — lab, calendar, and regulatory conventions may differ.";
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

const TEMP_ROWS: [string, string][] = [
  ["°C ↔ °F", "°F = °C × 9/5 + 32"],
  ["°C ↔ K", "K = °C + 273.15"],
  ["°F ↔ K", "Via Celsius first"],
];

const TIME_ROWS: [string, string][] = [
  ["s ↔ min ↔ h", "60 s = 1 min; 3600 s = 1 h"],
  ["days ↔ weeks…", "Mean month/year lengths"],
  ["ms ↔ s", "1 s = 1000 ms"],
];

const SPEED_ROWS: [string, string][] = [
  ["km/h ↔ m/s", "1 m/s = 3.6 km/h"],
  ["mph ↔ km/h", "1 mph = 1.609344 km/h"],
  ["kn ↔ km/h", "1 knot = 1.852 km/h"],
];

export const UNIT_THERMO_MOTION_ARTICLES: Record<string, RichArticle> = {
  "unit-celsius-fahrenheit-converter": article(
    "unit-celsius-fahrenheit-converter",
    "Celsius ↔ Fahrenheit",
    [
      "Converts °C to °F with °F = °C × 9/5 + 32 for weather, cooking, and science class.",
      "Zero Celsius is freezing water; 32 °F is the same point on the Fahrenheit scale.",
    ],
    {
      question: "What is 100 °C in Fahrenheit?",
      answer: "212 °F — boiling water at standard pressure.",
    },
    "Celsius to Fahrenheit Converter — °C ↔ °F",
    "Convert Celsius to Fahrenheit with the standard 9/5 formula. Weather and cooking aid.",
    ["celsius to fahrenheit", "c to f converter", "fahrenheit to celsius"],
    TEMP_HREF,
    TEMP_LABEL,
    TEMP_ROWS,
    "Temperature pairs",
  ),
  "unit-celsius-kelvin-converter": article(
    "unit-celsius-kelvin-converter",
    "Celsius ↔ Kelvin",
    [
      "Converts °C to kelvin with K = °C + 273.15 for thermodynamics and lab reports.",
      "Kelvin starts at absolute zero; a 1 K step equals a 1 °C step.",
    ],
    {
      question: "Do I write °K?",
      answer: "No — the unit is kelvin (K) without a degree symbol in modern SI style.",
    },
    "Celsius to Kelvin Converter — °C ↔ K",
    "Convert Celsius to kelvin with the +273.15 offset. Science temperature teaching aid.",
    ["celsius to kelvin", "c to k converter", "kelvin to celsius"],
    TEMP_HREF,
    TEMP_LABEL,
    TEMP_ROWS,
    "Temperature pairs",
  ),
  "unit-fahrenheit-kelvin-converter": article(
    "unit-fahrenheit-kelvin-converter",
    "Fahrenheit ↔ Kelvin",
    [
      "Converts °F to kelvin via Celsius: first (°F − 32) × 5/9, then + 273.15.",
      "Handy when US weather or process data must feed SI absolute-temperature equations.",
    ],
    {
      question: "Can I convert °F to K in one formula?",
      answer: "Yes: K = (°F + 459.67) × 5/9. This tool uses the Celsius bridge for clarity.",
    },
    "Fahrenheit to Kelvin Converter — °F ↔ K",
    "Convert Fahrenheit to kelvin via the Celsius bridge. Absolute temperature teaching aid.",
    ["fahrenheit to kelvin", "f to k converter", "kelvin to fahrenheit"],
    TEMP_HREF,
    TEMP_LABEL,
    TEMP_ROWS,
    "Temperature pairs",
  ),
  "unit-seconds-minutes-hours-converter": article(
    "unit-seconds-minutes-hours-converter",
    "Seconds ↔ minutes ↔ hours",
    [
      "Shows seconds as minutes (÷ 60) and hours (÷ 3600) for timers and duration math.",
      "Pure unit scaling — not calendar dates or time-zone clock math.",
    ],
    {
      question: "Does this handle leap seconds?",
      answer: "No — teaching conversion uses 60 s/min and 3600 s/h without leap seconds.",
    },
    "Seconds Minutes Hours Converter — s ↔ min ↔ h",
    "Convert seconds to minutes and hours with 60 and 3600 factors. Duration teaching aid.",
    ["seconds to minutes", "seconds to hours", "minutes to hours converter"],
    TIME_HREF,
    TIME_LABEL,
    TIME_ROWS,
    "Time pairs",
  ),
  "unit-days-weeks-months-years-converter": article(
    "unit-days-weeks-months-years-converter",
    "Days ↔ weeks ↔ months ↔ years",
    [
      "Scales a day count into weeks and mean Gregorian months/years — not calendar date math.",
      "Use date-difference tools when you need exact calendar months between two dates.",
    ],
    {
      question: "Why isn’t a month exactly 30 days?",
      answer:
        "This uses mean month (~30.44 days) and mean year (~365.24 days) lengths for unit teaching.",
    },
    "Days Weeks Months Years Converter",
    "Convert days to weeks, average months, and years. Duration unit teaching aid — not calendar dates.",
    ["days to weeks", "days to months converter", "days to years"],
    TIME_HREF,
    TIME_LABEL,
    TIME_ROWS,
    "Time pairs",
  ),
  "unit-milliseconds-seconds-converter": article(
    "unit-milliseconds-seconds-converter",
    "Milliseconds ↔ seconds",
    [
      "Converts milliseconds to seconds (÷ 1000) for latency, audio, and stopwatch displays.",
      "1 second = 1000 ms — exact SI milli prefix.",
    ],
    {
      question: "How many ms in a minute?",
      answer: "60,000 ms (60 × 1000).",
    },
    "Milliseconds to Seconds Converter — ms ↔ s",
    "Convert milliseconds to seconds with the exact 1000 factor. Timing teaching aid.",
    ["ms to seconds", "milliseconds to seconds", "seconds to milliseconds"],
    TIME_HREF,
    TIME_LABEL,
    TIME_ROWS,
    "Time pairs",
  ),
  "unit-kmh-ms-converter": article(
    "unit-kmh-ms-converter",
    "km/h ↔ m/s",
    [
      "Converts kilometers per hour to meters per second (÷ 3.6) for physics and vehicle data.",
      "Remember: 1 m/s = 3.6 km/h — multiply m/s by 3.6 to get km/h.",
    ],
    {
      question: "What is 100 km/h in m/s?",
      answer: "About 27.78 m/s (100 ÷ 3.6).",
    },
    "km/h to m/s Converter — kilometers per hour",
    "Convert km/h to meters per second with the 3.6 factor. Speed teaching aid.",
    ["kmh to ms", "km/h to m/s", "meters per second to kmh"],
    SPEED_HREF,
    SPEED_LABEL,
    SPEED_ROWS,
    "Speed pairs",
  ),
  "unit-mph-kmh-converter": article(
    "unit-mph-kmh-converter",
    "mph ↔ km/h",
    [
      "Converts miles per hour to kilometers per hour with 1 mph = 1.609344 km/h.",
      "Use for US speed limits versus metric road signs.",
    ],
    {
      question: "Is mph the same as knots?",
      answer: "No — knots are nautical miles per hour. Use the knot converter for marine/air speeds.",
    },
    "mph to km/h Converter — miles per hour",
    "Convert miles per hour to kilometers per hour. Road speed teaching aid.",
    ["mph to kmh", "miles per hour to km/h", "kmh to mph converter"],
    SPEED_HREF,
    SPEED_LABEL,
    SPEED_ROWS,
    "Speed pairs",
  ),
  "unit-knot-kmh-converter": article(
    "unit-knot-kmh-converter",
    "Knot ↔ km/h",
    [
      "Converts knots to kilometers per hour with 1 knot = 1.852 km/h (nautical mile per hour).",
      "Standard for ships, aircraft, and marine weather reports.",
    ],
    {
      question: "How fast is 1 knot in mph?",
      answer: "About 1.151 mph (1.852 ÷ 1.609344). This tool focuses on knot ↔ km/h.",
    },
    "Knot to km/h Converter — nautical speed",
    "Convert knots to kilometers per hour (1 kn = 1.852 km/h). Marine and aviation aid.",
    ["knots to kmh", "knot to km/h converter", "kmh to knots"],
    SPEED_HREF,
    SPEED_LABEL,
    SPEED_ROWS,
    "Speed pairs",
  ),
};
