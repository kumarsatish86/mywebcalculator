import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-water-plumbing";
const HUB_LABEL = "Engineering · Civil · Water & plumbing";
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
        title: "Water & plumbing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Water tank volume", "L × W × H or πr²h"],
          ["Pipe volume", "πr² × length"],
          ["Flow rate", "Q = A × v literacy"],
          ["Drainage", "Runoff / pipe sizing hint"],
          ["Rainwater harvesting", "Roof area × rainfall"],
          ["Plumbing material", "Pipe & fitting rollup"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your water and plumbing inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_WATER_ARTICLES: Record<string, RichArticle> = {
  "civil-water-tank-volume-calculator": article(
    "civil-water-tank-volume-calculator",
    "Water tank volume",
    [
      "Computes storage capacity for rectangular or cylindrical tanks from internal dimensions.",
      "Freeboard, dead storage, and structural wall thickness reduce usable volume — use net internal dimensions.",
    ],
    {
      question: "Litres or cubic metres?",
      answer:
        "1 m³ = 1000 L. Enter dimensions in metres for m³; convert for pump and plumbing sizing in litres per minute.",
    },
    "Water Tank Volume Calculator — Storage Capacity",
    "Calculate water tank volume from rectangular or cylindrical dimensions. Civil plumbing estimate only.",
    ["water tank volume calculator", "tank capacity litres", "storage tank m3"],
  ),
  "civil-pipe-volume-calculator": article(
    "civil-pipe-volume-calculator",
    "Pipe volume",
    [
      "Estimates internal water volume in a pipe run from nominal diameter and length (πr² × L).",
      "Nominal vs internal diameter matters for plastic and metal pipes — use ID when known for accuracy.",
    ],
    {
      question: "Nominal or internal diameter?",
      answer:
        "Volume calculations should use internal diameter. Nominal DN sizes approximate ID — check manufacturer tables for precise ID.",
    },
    "Pipe Volume Calculator — Water Volume in Pipe",
    "Estimate water volume held in a pipe from diameter and length. Civil plumbing literacy — verify pipe schedule.",
    ["pipe volume calculator", "water volume in pipe", "pipe capacity litres"],
  ),
  "civil-flow-rate-calculator-civil": article(
    "civil-flow-rate-calculator-civil",
    "Flow rate",
    [
      "Teaching estimate Q ≈ cross-sectional area × velocity for pipe or channel flow literacy.",
      "Real networks need friction losses, fittings, and pump curves — not steady uniform flow alone.",
    ],
    {
      question: "What velocity is typical in water pipes?",
      answer:
        "Design velocities often stay 0.6–2.5 m/s for water supply to limit noise and head loss. Follow plumbing code limits locally.",
    },
    "Flow Rate Calculator — Q = Area × Velocity",
    "Estimate pipe flow rate from area and velocity. Educational hydraulic aid — not full network design.",
    ["flow rate calculator civil", "pipe flow Q", "water flow rate estimate"],
  ),
  "civil-drainage-calculator": article(
    "civil-drainage-calculator",
    "Drainage",
    [
      "Rough sizing helper for storm or sanitary drainage from catchment area, intensity, or fixture units — teaching level.",
      "Hydraulic grade line, manholes, and code minimum slopes require full drainage design by a qualified engineer.",
    ],
    {
      question: "Can this replace drainage design?",
      answer:
        "No. Pipe sizing, invert levels, and overflow paths must comply with local plumbing and stormwater codes.",
    },
    "Drainage Calculator — Rough Pipe Sizing Hint",
    "Educational drainage quantity and sizing helper. Verify with licensed plumbing and stormwater design.",
    ["drainage calculator civil", "storm drain estimate", "sanitary drainage sizing"],
  ),
  "civil-rainwater-harvesting-calculator": article(
    "civil-rainwater-harvesting-calculator",
    "Rainwater harvesting",
    [
      "Estimates harvest volume from roof catchment area, rainfall depth, and runoff coefficient.",
      "First-flush diversion, storage sizing, and recharge pit design need site-specific engineering and regulations.",
    ],
    {
      question: "What runoff coefficient should I use?",
      answer:
        "Smooth roofs: 0.8–0.95; rough tiles lower. Local green-building guides may specify values for compliance calculations.",
    },
    "Rainwater Harvesting Calculator — Yield from Roof",
    "Estimate rainwater harvest from roof area and rainfall. Planning aid — verify local RWH regulations.",
    ["rainwater harvesting calculator", "roof rainwater yield", "RWH storage estimate"],
  ),
  "civil-plumbing-material-calculator": article(
    "civil-plumbing-material-calculator",
    "Plumbing material",
    [
      "Rolls up pipe lengths, fittings, and fixture counts for a rough plumbing BOQ from layout inputs.",
      "Isometric drawings, valve schedules, and pressure testing specs come from detailed plumbing design.",
    ],
    {
      question: "Does this include fittings?",
      answer:
        "Enter fitting allowances per your estimate method (e.g. 10–15% extra length or counted elbows). Vendor takeoffs differ.",
    },
    "Plumbing Material Calculator — Pipe & Fitting Rollup",
    "Estimate plumbing material quantities from layout inputs. Civil BOQ helper — verify with plumbing drawings.",
    ["plumbing material calculator", "pipe quantity estimate", "plumbing BOQ civil"],
  ),
};
