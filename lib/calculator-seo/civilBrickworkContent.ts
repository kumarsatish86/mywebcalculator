import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-brickwork-masonry";
const HUB_LABEL = "Engineering · Civil · Brickwork & masonry";
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
        title: "Brickwork & masonry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Brick calculator", "Wall area ÷ brick + joint size"],
          ["Number of bricks", "Count from dimensions and bond"],
          ["Mortar for brickwork", "Volume from wall area × thickness"],
          ["Brick wall volume", "L × H × t masonry volume"],
          ["Brick bond", "Stretcher/header pattern literacy"],
          ["AAC/concrete blocks", "Block count from wall area"],
          ["Plaster for brick wall", "Plaster area × thickness"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your brickwork inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_BRICKWORK_ARTICLES: Record<string, RichArticle> = {
  "civil-brick-calculator": article(
    "civil-brick-calculator",
    "Brick calculator",
    [
      "Estimates brick count from wall length, height, brick size, and mortar joint thickness.",
      "Openings, corners, and bond type change net count — deduct windows and doors on site or in a detailed BOQ.",
    ],
    {
      question: "Which brick size is assumed?",
      answer:
        "Enter nominal brick dimensions and joint width for your locale (e.g. 230 × 110 × 75 mm with 10 mm joints). Standard sizes vary by country.",
    },
    "Brick Calculator — Wall Brick Count Estimate",
    "Estimate bricks needed for a wall from dimensions and brick size. Civil masonry aid — verify on site.",
    ["brick calculator", "brick quantity wall", "how many bricks"],
  ),
  "civil-number-of-bricks-calculator": article(
    "civil-number-of-bricks-calculator",
    "Number of bricks",
    [
      "Computes total bricks from wall area and effective coverage per brick including mortar joints.",
      "Waste and breakage allowances (often 3–5%) are not always included — add margin for site practice.",
    ],
    {
      question: "How is bricks per m² calculated?",
      answer:
        "Effective brick face area plus joint is inverted to get count per square metre. Bond patterns (English, Flemish) alter corner and closure counts.",
    },
    "Number of Bricks Calculator — Count from Wall Area",
    "Calculate brick count from wall area and brick-plus-joint dimensions. Civil estimation only.",
    ["number of bricks calculator", "bricks per m2", "brick count estimate"],
  ),
  "civil-mortar-brickwork-calculator": article(
    "civil-mortar-brickwork-calculator",
    "Mortar for brickwork",
    [
      "Estimates mortar volume from masonry wall dimensions and selected mortar thickness.",
      "Cement : sand ratios for mortar differ from concrete — use the mix ratio appropriate to your code and exposure class.",
    ],
    {
      question: "What mortar ratio is typical?",
      answer:
        "Common teaching ratios are 1:4 to 1:6 (cement : sand) for general brickwork. Structural or damp-proof courses may require engineered mixes.",
    },
    "Mortar Calculator for Brickwork — Volume & Mix",
    "Estimate mortar volume for brick walls from area and thickness. Civil BOQ helper — not structural design.",
    ["mortar calculator brickwork", "brick mortar quantity", "mortar volume wall"],
  ),
  "civil-brick-wall-volume-calculator": article(
    "civil-brick-wall-volume-calculator",
    "Brick wall volume",
    [
      "Computes masonry volume as length × height × wall thickness for material and weight estimates.",
      "Single-leaf vs cavity walls and plaster finishes are separate line items — thickness must match the actual wythe.",
    ],
    {
      question: "Is this gross or net volume?",
      answer:
        "Typically gross wall volume before openings. Deduct opening volumes separately for net masonry quantity.",
    },
    "Brick Wall Volume Calculator — Masonry m³",
    "Calculate brick wall volume from length, height, and thickness. Civil quantity estimate only.",
    ["brick wall volume calculator", "masonry volume", "wall volume m3"],
  ),
  "civil-brick-bond-calculator": article(
    "civil-brick-bond-calculator",
    "Brick bond",
    [
      "Teaching helper for stretcher, header, and common bond layouts — brick count and lap spacing literacy.",
      "Structural bonding and seismic requirements may mandate specific patterns per local masonry codes.",
    ],
    {
      question: "Does bond type affect strength?",
      answer:
        "Yes. Header bonds and proper interlocking improve lateral resistance. Follow code and engineer details for load-bearing walls.",
    },
    "Brick Bond Calculator — Pattern & Count Literacy",
    "Explore brick bond patterns and related count estimates. Educational masonry tool — verify with code.",
    ["brick bond calculator", "stretcher bond", "english bond brick"],
  ),
  "civil-block-calculator-aac-concrete": article(
    "civil-block-calculator-aac-concrete",
    "Block calculator (AAC/concrete)",
    [
      "Estimates AAC or concrete block count from wall area and block face dimensions plus joint.",
      "Block densities and mortar bed thickness differ by manufacturer — use supplier catalog sizes.",
    ],
    {
      question: "Are AAC blocks the same size as concrete blocks?",
      answer:
        "No. Enter the actual block length, height, and width from your supplier. Nominal 600 × 200 mm blocks are common but not universal.",
    },
    "Block Calculator — AAC & Concrete Block Count",
    "Estimate AAC or concrete block quantity from wall dimensions. Civil masonry estimate only.",
    ["block calculator AAC", "concrete block calculator", "AAC block quantity"],
  ),
  "civil-plaster-brick-wall-calculator": article(
    "civil-plaster-brick-wall-calculator",
    "Plaster for brick wall",
    [
      "Computes plaster material from net wall area and plaster thickness (single or double coat).",
      "Surface absorption, scaffolding, and finish type (gypsum, cement) change real consumption — adjust mix factors on site.",
    ],
    {
      question: "One coat or two coats?",
      answer:
        "Enter total design thickness or sum base and finish coats. Rough masonry may need thicker base plaster before finish.",
    },
    "Plaster for Brick Wall Calculator — Area & Thickness",
    "Estimate plaster quantity for brick walls from area and thickness. Civil finishing aid — verify on site.",
    ["plaster brick wall calculator", "wall plaster quantity", "brick wall plaster estimate"],
  ),
};
