import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-plastering-finishing";
const HUB_LABEL = "Engineering · Civil · Plastering & finishing";
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
        title: "Plastering & finishing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Plastering", "Area × thickness → mortar"],
          ["Wall plaster", "Net wall area × coats"],
          ["Ceiling plaster", "Soffit area × thickness"],
          ["Paint quantity", "Area ÷ coverage L/m²"],
          ["Tile calculator", "Area ÷ tile + waste"],
          ["Flooring material", "Area × material factor"],
          ["Putty", "Wall area × coats ÷ yield"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your finishing inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_PLASTERING_ARTICLES: Record<string, RichArticle> = {
  "civil-plastering-calculator": article(
    "civil-plastering-calculator",
    "Plastering calculator",
    [
      "Estimates cement-sand plaster volume from surface area and total plaster thickness.",
      "Surface roughness, corners, and scaffolding access change labor productivity — material math is only one BOQ line.",
    ],
    {
      question: "What plaster ratio is typical?",
      answer:
        "Internal cement plaster is often 1:4 to 1:6; gypsum systems differ. Match mix to exposure, substrate, and manufacturer guidance.",
    },
    "Plastering Calculator — Mortar Volume from Area",
    "Estimate plaster material from area and thickness. Civil finishing BOQ aid — verify on site.",
    ["plastering calculator", "plaster quantity calculator", "cement plaster estimate"],
  ),
  "civil-wall-plaster-calculator": article(
    "civil-wall-plaster-calculator",
    "Wall plaster",
    [
      "Computes net wall plaster area and mortar from room dimensions with optional opening deductions.",
      "Deduct windows and doors for net area; reveal plaster and sills may need separate add-backs.",
    ],
    {
      question: "Should I deduct openings?",
      answer:
        "For material BOQ, net area after openings is standard. Small openings under 0.5 m² are sometimes ignored per local practice.",
    },
    "Wall Plaster Calculator — Net Area & Material",
    "Calculate wall plaster area and mortar from room size with opening deductions. Civil estimate only.",
    ["wall plaster calculator", "wall plaster quantity", "plaster area deduction"],
  ),
  "civil-ceiling-plaster-calculator": article(
    "civil-ceiling-plaster-calculator",
    "Ceiling plaster",
    [
      "Estimates soffit plaster area from plan dimensions and thickness — often lighter mixes or gypsum for ceilings.",
      "Overhead work increases labor rates; false ceilings may replace wet plaster entirely in modern builds.",
    ],
    {
      question: "Is ceiling plaster thicker than walls?",
      answer:
        "Often similar or slightly thinner (10–12 mm). Leveling coats on uneven slabs may need extra thickness locally.",
    },
    "Ceiling Plaster Calculator — Soffit Area & Material",
    "Estimate ceiling plaster quantity from plan area and thickness. Civil finishing aid — verify specification.",
    ["ceiling plaster calculator", "soffit plaster quantity", "ceiling mortar estimate"],
  ),
  "civil-paint-quantity-calculator": article(
    "civil-paint-quantity-calculator",
    "Paint quantity",
    [
      "Divides net paintable area by manufacturer coverage (m²/L) and coats for litre or gallon estimates.",
      "Porosity, color change, and texture paints reduce effective coverage — add 10–15% for touch-ups.",
    ],
    {
      question: "How many coats should I plan?",
      answer:
        "Primer plus two finish coats is common on new plaster. Enter total coats matching your specification sheet.",
    },
    "Paint Quantity Calculator — Litres from Coverage",
    "Estimate paint quantity from area, coverage, and number of coats. Civil BOQ helper — check datasheet coverage.",
    ["paint quantity calculator", "paint litres estimate", "wall paint calculator"],
  ),
  "civil-tile-calculator": article(
    "civil-tile-calculator",
    "Tile calculator",
    [
      "Computes tile count from floor or wall area, tile size, and grout joint with optional waste percentage.",
      "Diagonal layouts and border strips increase cuts and waste — raise waste factor for complex patterns.",
    ],
    {
      question: "How much tile waste is normal?",
      answer:
        "Straight lay: 5–10%; diagonal or mixed sizes: 10–15%. Always keep spare boxes for future repairs.",
    },
    "Tile Calculator — Count from Area & Tile Size",
    "Estimate tile quantity from area, tile dimensions, and waste factor. Civil finishing estimate only.",
    ["tile calculator", "floor tile quantity", "tiles per square meter"],
  ),
  "civil-flooring-material-calculator": article(
    "civil-flooring-material-calculator",
    "Flooring material",
    [
      "Estimates flooring area and material quantity for tiles, vinyl, laminate, or stone from room dimensions.",
      "Underlayment, adhesive, and skirting are separate items — extend BOQ beyond surface area alone.",
    ],
    {
      question: "Does flooring include skirting?",
      answer:
        "Usually skirting is a separate linear measure. Enter floor area only unless your tool combines base trim.",
    },
    "Flooring Material Calculator — Area & Quantity",
    "Estimate flooring material from room dimensions and material type. Civil BOQ aid — verify supplier specs.",
    ["flooring material calculator", "floor area material", "flooring quantity estimate"],
  ),
  "civil-putty-calculator": article(
    "civil-putty-calculator",
    "Putty calculator",
    [
      "Estimates wall putty from paintable area, coats, and kg or bag yield per manufacturer datasheet.",
      "New plaster may need more coats than repainting — surface smoothness drives consumption heavily.",
    ],
    {
      question: "Putty before or after primer?",
      answer:
        "Typically putty on cured plaster, then primer, then paint. Follow the paint system's application sequence.",
    },
    "Putty Calculator — Quantity from Wall Area",
    "Estimate wall putty from area, coats, and coverage yield. Civil finishing estimate — verify product datasheet.",
    ["putty calculator", "wall putty quantity", "putty kg estimate"],
  ),
};
