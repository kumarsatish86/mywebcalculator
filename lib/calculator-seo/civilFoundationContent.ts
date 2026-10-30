import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-foundation-structural";
const HUB_LABEL = "Engineering · Civil · Foundation & structural";
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
        title: "Foundation & structural tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Footing", "Pad/strip volume + steel"],
          ["Foundation volume", "Excavation + concrete fill"],
          ["Column", "Prism volume + rebar"],
          ["Beam", "L × b × d + steel"],
          ["Slab", "Area × thickness"],
          ["Load (basic)", "DL + LL teaching sum"],
          ["Structural weight", "Member volumes × density"],
          ["Pile foundation", "Pile count × length"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your structural inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_FOUNDATION_ARTICLES: Record<string, RichArticle> = {
  "civil-footing-calculator": article(
    "civil-footing-calculator",
    "Footing calculator",
    [
      "Estimates isolated or combined footing concrete volume from plan dimensions and depth.",
      "Bearing capacity, reinforcement, and pedestal details require structural design — not inferred from volume alone.",
    ],
    {
      question: "Can I size a footing with this tool?",
      answer:
        "No. Footing dimensions must satisfy bearing pressure, sliding, overturning, and reinforcement per a licensed structural engineer.",
    },
    "Footing Calculator — Concrete Volume Estimate",
    "Estimate footing concrete volume from plan size and depth. Quantity aid only — not structural design.",
    ["footing calculator", "isolated footing volume", "foundation footing estimate"],
  ),
  "civil-foundation-volume-calculator": article(
    "civil-foundation-volume-calculator",
    "Foundation volume",
    [
      "Computes total foundation concrete including footings, tie beams, and raft elements from entered dimensions.",
      "Excavation overbreak and lean concrete blinding are often separate BOQ lines from structural concrete.",
    ],
    {
      question: "Is excavation included?",
      answer:
        "Enter excavation separately unless your workflow combines cut and fill with pour volume. Overbreak factors vary by soil.",
    },
    "Foundation Volume Calculator — Concrete m³ Rollup",
    "Sum foundation concrete volumes for rough BOQ. Civil estimation — follow approved structural drawings.",
    ["foundation volume calculator", "foundation concrete m3", "raft footing volume"],
  ),
  "civil-column-calculator": article(
    "civil-column-calculator",
    "Column calculator",
    [
      "Estimates column concrete volume from cross-section and height with optional steel weight literacy.",
      "Slenderness, confinement, and seismic detailing govern reinforcement — volume alone does not define capacity.",
    ],
    {
      question: "Square or circular column?",
      answer:
        "Enter the actual cross-section dimensions from drawings. Circular columns use π × r² × height for volume.",
    },
    "Column Calculator — Concrete Volume & Steel Hint",
    "Estimate column concrete from section size and height. Civil BOQ aid — not structural capacity design.",
    ["column calculator civil", "column concrete volume", "RCC column estimate"],
  ),
  "civil-beam-calculator": article(
    "civil-beam-calculator",
    "Beam calculator",
    [
      "Computes beam concrete volume from span length, width, and depth (overall or effective as labeled).",
      "Drop beams, haunches, and openings reduce or increase volume — match input dimensions to the as-built profile.",
    ],
    {
      question: "Is depth overall or effective?",
      answer:
        "Use the dimension consistent with your BOQ — usually overall depth for concrete quantity, effective depth for design checks elsewhere.",
    },
    "Beam Calculator — RCC Beam Volume Estimate",
    "Calculate beam concrete volume from length, width, and depth. Civil quantity tool — verify with drawings.",
    ["beam calculator civil", "RCC beam volume", "beam concrete estimate"],
  ),
  "civil-slab-calculator": article(
    "civil-slab-calculator",
    "Slab calculator",
    [
      "Estimates slab concrete from plan area and thickness — one-way, two-way, or flat slab as a prismatic volume.",
      "Ribbed and waffle slabs need void deductions; post-tensioning ducts do not reduce billed concrete unless specified.",
    ],
    {
      question: "Should I deduct block fillers in ribbed slabs?",
      answer:
        "Yes for net concrete. Enter net volume or deduct known void area × thickness for hollow-block rib systems.",
    },
    "Slab Calculator — Floor Slab Concrete m³",
    "Estimate slab concrete from area and thickness. Civil BOQ helper — not slab design or deflection check.",
    ["slab calculator civil", "RCC slab volume", "floor slab concrete"],
  ),
  "civil-load-calculation-basic": article(
    "civil-load-calculation-basic",
    "Load calculation (basic)",
    [
      "Teaching rollup of dead load (self-weight + finishes) and live load from area and unit intensities.",
      "Wind, seismic, and load combinations require code analysis by a structural engineer — not this simplified sum.",
    ],
    {
      question: "What live load should I use?",
      answer:
        "Pick the occupancy category from your building code (residential, office, etc.). Values differ by jurisdiction and use.",
    },
    "Basic Load Calculator — DL + LL Teaching Sum",
    "Estimate basic dead and live loads from area and unit rates. Educational only — not code-compliant design.",
    ["load calculation basic", "dead load live load", "floor load estimate civil"],
  ),
  "civil-structural-weight-calculator": article(
    "civil-structural-weight-calculator",
    "Structural weight",
    [
      "Converts member concrete and steel volumes to weight using material densities for crane and foundation planning.",
      "Composite decks, precast units, and cladding add weight beyond RCC members modeled here.",
    ],
    {
      question: "What concrete density is assumed?",
      answer:
        "Often 2400–2500 kg/m³ for normal-weight concrete. Lightweight or steel-only members need different inputs.",
    },
    "Structural Weight Calculator — Member Weight Rollup",
    "Estimate structural weight from concrete and steel volumes. Planning aid — verify with detailed takeoff.",
    ["structural weight calculator", "building weight estimate", "RCC steel weight sum"],
  ),
  "civil-pile-foundation-calculator": article(
    "civil-pile-foundation-calculator",
    "Pile foundation",
    [
      "Estimates pile count, length, and concrete volume from cap layout and pile diameter — rough BOQ literacy.",
      "Pile capacity, spacing, and load tests are geotechnical and structural decisions — not from volume math alone.",
    ],
    {
      question: "How is pile length determined?",
      answer:
        "From geotechnical investigation and design capacity. Enter the design length from drawings — do not guess from this tool.",
    },
    "Pile Foundation Calculator — Count & Volume Estimate",
    "Estimate pile concrete quantity from diameter, length, and count. Civil BOQ aid — follow geotechnical design.",
    ["pile foundation calculator", "pile concrete volume", "pile count estimate"],
  ),
};
