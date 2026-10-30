import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-road-infrastructure";
const HUB_LABEL = "Engineering · Civil · Road & infrastructure";
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
        title: "Road & infrastructure tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Road construction", "Length × width × layers"],
          ["Asphalt", "Area × thickness × density"],
          ["Bitumen quantity", "Mix design % × mass"],
          ["Road base material", "Sub-base/gravel volume"],
          ["Pavement thickness", "Layer build-up literacy"],
          ["Road cost", "Materials + rates rollup"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your road inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_ROAD_ARTICLES: Record<string, RichArticle> = {
  "civil-road-construction-calculator": article(
    "civil-road-construction-calculator",
    "Road construction",
    [
      "Rolls up pavement layer volumes from road length, width, and thicknesses for sub-base, base, and surface courses.",
      "Cross-fall, superelevation, and widening at curves change average quantities — use representative sections for long links.",
    ],
    {
      question: "How are layer thicknesses chosen?",
      answer:
        "From pavement design (CBR, traffic loading, climate). This tool accepts your design thicknesses — it does not design pavement.",
    },
    "Road Construction Calculator — Layer Volume Rollup",
    "Estimate road construction material volumes from length, width, and layer thicknesses. Civil BOQ aid only.",
    ["road construction calculator", "pavement layer volume", "road material estimate"],
  ),
  "civil-asphalt-calculator": article(
    "civil-asphalt-calculator",
    "Asphalt calculator",
    [
      "Computes hot-mix asphalt tonnage from area, compacted thickness, and mix density.",
      "Compaction target (often 92–96% of Marshall density) and temperature windows affect placed quantity on site.",
    ],
    {
      question: "What density should I use for asphalt?",
      answer:
        "Use design compacted density from your mix design (often 2.3–2.4 t/m³). Supplier certificates provide job-specific values.",
    },
    "Asphalt Calculator — HMA Tonnage from Area",
    "Estimate asphalt quantity from area, thickness, and density. Civil paving BOQ — verify mix design.",
    ["asphalt calculator", "HMA tonnage calculator", "asphalt quantity road"],
  ),
  "civil-bitumen-quantity-calculator": article(
    "civil-bitumen-quantity-calculator",
    "Bitumen quantity",
    [
      "Estimates binder mass from aggregate quantity and design bitumen content (% by weight of mix).",
      "Polymer-modified and emulsion systems use different application rates — match product and specification.",
    ],
    {
      question: "Is bitumen the same as asphalt?",
      answer:
        "Asphalt (HMA) is aggregate plus bitumen binder. This tool focuses on binder quantity from mix percentage, not total mix tonnage.",
    },
    "Bitumen Quantity Calculator — Binder from Mix %",
    "Estimate bitumen binder quantity from aggregate mass and design percentage. Civil estimate only.",
    ["bitumen quantity calculator", "binder content asphalt", "bitumen kg estimate"],
  ),
  "civil-road-base-material-calculator": article(
    "civil-road-base-material-calculator",
    "Road base material",
    [
      "Calculates sub-base or granular base volume from road area and layer thickness with optional compaction factor.",
      "CBR requirements and gradation come from pavement design — material type is a user input, not auto-selected.",
    ],
    {
      question: "Loose or compacted volume?",
      answer:
        "Road rates are usually compacted in place. Convert truck loose volume using compaction factors from lab or field tests.",
    },
    "Road Base Material Calculator — Sub-base Volume",
    "Estimate granular base or sub-base volume for road works. Civil earthwork aid — verify pavement design.",
    ["road base material calculator", "sub base volume", "granular base quantity"],
  ),
  "civil-pavement-thickness-calculator": article(
    "civil-pavement-thickness-calculator",
    "Pavement thickness",
    [
      "Teaching helper to document layer build-up (surface, binder, base, sub-base) and total pavement depth.",
      "Structural thickness design uses traffic ESALs and subgrade strength — enter thicknesses from your pavement design report.",
    ],
    {
      question: "Does this design pavement thickness?",
      answer:
        "No. It sums and displays layer thicknesses you provide. Full design requires IRC, AASHTO, or equivalent methods.",
    },
    "Pavement Thickness Calculator — Layer Build-up",
    "Document and sum pavement layer thicknesses for estimates. Educational — not pavement structural design.",
    ["pavement thickness calculator", "road layer thickness", "pavement build up"],
  ),
  "civil-road-cost-calculator": article(
    "civil-road-cost-calculator",
    "Road cost",
    [
      "Multiplies layer quantities by unit rates for a rough road construction cost snapshot.",
      "Earthwork, drainage, signage, and traffic control are major cost drivers beyond pavement material alone.",
    ],
    {
      question: "Are rates per m² or per m³?",
      answer:
        "Enter rates consistent with your BOQ convention. Convert carefully when vendors quote per tonne vs per cubic metre.",
    },
    "Road Cost Calculator — Pavement Cost Estimate",
    "Estimate road construction cost from layer quantities and unit rates. Budgeting aid — confirm with tender quotes.",
    ["road cost calculator", "pavement cost estimate", "road construction cost"],
  ),
};
