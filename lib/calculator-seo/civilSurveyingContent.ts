import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-surveying-leveling";
const HUB_LABEL = "Engineering · Civil · Surveying & leveling";
const SHELL =
  "Civil engineering estimation tools that run in your browser. Not a substitute for licensed structural design, code compliance, or site-specific engineering. Mix ratios, codes, and material specs differ by region — verify with a qualified professional.";

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
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Surveying & leveling tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Leveling", "Height of collimation / RL"],
          ["Elevation", "Benchmark + backsight − foresight"],
          ["Slope", "Rise ÷ run or grade %"],
          ["Land survey", "Area from coordinates literacy"],
          ["Cut & fill", "Volume between surfaces"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your surveying inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_SURVEYING_ARTICLES: Record<string, RichArticle> = {
  "civil-leveling-calculator": article(
    "civil-leveling-calculator",
    "Leveling calculator",
    [
      "Applies height-of-collimation or rise-and-fall methods to compute reduced levels from staff readings.",
      "Closed loops need misclosure checks and adjustments — field books should follow your survey procedure.",
    ],
    {
      question: "What is reduced level (RL)?",
      answer:
        "RL is elevation relative to a chosen datum or benchmark. All design grades and drainage inverts reference consistent RLs.",
    },
    "Leveling Calculator — Reduced Levels from Staff Readings",
    "Compute reduced levels using leveling survey arithmetic. Educational survey aid — verify in field book.",
    ["leveling calculator", "reduced level calculator", "height of collimation"],
  ),
  "civil-elevation-calculator": article(
    "civil-elevation-calculator",
    "Elevation calculator",
    [
      "Derives point elevation from benchmark RL plus backsight minus foresight (or similar leveling identity).",
      "Digital levels and total stations may export elevations directly — use this for manual check and teaching.",
    ],
    {
      question: "How do I pick a benchmark?",
      answer:
        "Use a stable reference with known RL from official survey or transferred from GPS/total station control.",
    },
    "Elevation Calculator — RL from Benchmark & Readings",
    "Calculate point elevation from benchmark and staff readings. Survey literacy — not certified survey.",
    ["elevation calculator civil", "RL calculator", "benchmark elevation"],
  ),
  "civil-slope-calculator-civil": article(
    "civil-slope-calculator-civil",
    "Slope calculator",
    [
      "Converts rise and run to slope ratio, grade percentage, or angle for roads, drains, and ramps.",
      "Maximum slopes for accessibility and erosion control are code-limited — check local standards.",
    ],
    {
      question: "Percent grade vs ratio?",
      answer:
        "Grade % = (rise ÷ run) × 100. A 1:100 slope is 1% grade. Enter rise and horizontal run consistently.",
    },
    "Slope Calculator — Grade % from Rise & Run",
    "Calculate slope percentage, ratio, and angle from rise and run. Civil grading literacy tool.",
    ["slope calculator civil", "grade percentage calculator", "road slope gradient"],
  ),
  "civil-land-survey-calculator": article(
    "civil-land-survey-calculator",
    "Land survey",
    [
      "Teaching helper for parcel area from coordinates or simplified traverse dimensions — not a cadastral survey.",
      "Legal boundaries require licensed survey, monumentation, and recorded plats.",
    ],
    {
      question: "Can I use this for property deeds?",
      answer:
        "No. Deeded area and boundaries come from official land records and licensed survey. This supports study and rough checks only.",
    },
    "Land Survey Calculator — Parcel Area Literacy",
    "Estimate land parcel area from coordinates or traverse dimensions. Educational — not legal survey.",
    ["land survey calculator", "parcel area coordinates", "traverse area civil"],
  ),
  "civil-cut-fill-calculator": article(
    "civil-cut-fill-calculator",
    "Cut & fill",
    [
      "Estimates earthwork volume between existing and finished ground levels over a grid or average depth.",
      "Mass haul, shrink-swell, and balance lines need detailed cross-sections — use average-end-area for long cuts.",
    ],
    {
      question: "What is cut vs fill?",
      answer:
        "Cut removes material where design level is below existing; fill adds material where design is higher. Net balance affects haul cost.",
    },
    "Cut & Fill Calculator — Earthwork Volume Estimate",
    "Estimate cut and fill volumes from level differences and area. Civil earthwork aid — verify with cross-sections.",
    ["cut fill calculator", "earthwork volume", "cut and fill estimate civil"],
  ),
};
