import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-advanced-niche";
const HUB_LABEL = "Engineering · Civil · Advanced & niche";
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
        title: "Advanced & niche tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Earthwork", "Cut/fill and haul literacy"],
          ["Retaining wall", "Stem + base volume"],
          ["Staircase", "Riser × tread × flights"],
          ["Formwork", "Contact area × reuse"],
          ["Shuttering", "Plywood sheets & props"],
          ["Scaffolding", "Bay count × height"],
          ["Wind load", "Pressure × area teaching"],
          ["Seismic load", "Base shear literacy"],
          ["Bearing capacity", "Terzaghi-style hint"],
          ["Soil compaction", "Dry density vs OMC"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your advanced civil inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_ADVANCED_ARTICLES: Record<string, RichArticle> = {
  "civil-earthwork-calculator": article(
    "civil-earthwork-calculator",
    "Earthwork calculator",
    [
      "Rolls up cut, fill, and net haul quantities from section areas or average depth over a site footprint.",
      "Shrinkage on fill and bulking on cut change truck counts — apply soil-specific factors from geotechnical reports.",
    ],
    {
      question: "How is net haul calculated?",
      answer:
        "Net haul = cut volume − fill volume (adjusted for shrink/swell). Positive net cut may require borrow or export.",
    },
    "Earthwork Calculator — Cut, Fill & Haul Estimate",
    "Estimate earthwork cut, fill, and net haul volumes. Civil site-work aid — verify with surveyed sections.",
    ["earthwork calculator", "cut fill haul", "earthwork volume civil"],
  ),
  "civil-retaining-wall-calculator": article(
    "civil-retaining-wall-calculator",
    "Retaining wall",
    [
      "Estimates stem and base concrete volume from wall height, thickness, and footing dimensions — quantity literacy.",
      "Stability against overturning, sliding, and bearing requires geotechnical and structural design beyond volume.",
    ],
    {
      question: "Can this design a retaining wall?",
      answer:
        "No. Wall proportions, drainage, and reinforcement must be engineered for soil pressure and seismic loads.",
    },
    "Retaining Wall Calculator — Concrete Volume Estimate",
    "Estimate retaining wall concrete from geometry. Quantity aid only — not geotechnical or structural design.",
    ["retaining wall calculator", "retaining wall concrete", "RCC wall volume"],
  ),
  "civil-staircase-calculator": article(
    "civil-staircase-calculator",
    "Staircase calculator",
    [
      "Checks riser-tread relationships (2R + T ≈ 630 mm teaching rule) and estimates concrete for waist slab or steps.",
      "Headroom, landing width, and fire egress rules vary by building code — follow architectural and structural drawings.",
    ],
    {
      question: "What is the 2R + T rule?",
      answer:
        "A comfort formula linking riser (R) and tread (T) in mm. Local codes set maximum riser and minimum tread separately.",
    },
    "Staircase Calculator — Riser, Tread & Concrete",
    "Estimate staircase geometry and concrete quantity. Civil literacy — verify with building code and drawings.",
    ["staircase calculator civil", "riser tread calculator", "RCC stair estimate"],
  ),
  "civil-formwork-calculator": article(
    "civil-formwork-calculator",
    "Formwork calculator",
    [
      "Computes contact area of formwork for beams, columns, slabs, and walls for material and labor BOQ.",
      "Reuse cycles and film-faced plywood coverage reduce effective area per purchase — enter reuse factor if supported.",
    ],
    {
      question: "Contact area vs project area?",
      answer:
        "Formwork bills contact area (m² of concrete face). Beams have bottom + two sides; columns have four faces unless shared.",
    },
    "Formwork Calculator — Contact Area Estimate",
    "Estimate formwork contact area for RCC members. Civil BOQ helper — verify with formwork layout.",
    ["formwork calculator", "shuttering area", "formwork contact area"],
  ),
  "civil-shuttering-calculator": article(
    "civil-shuttering-calculator",
    "Shuttering calculator",
    [
      "Converts formwork contact area to plywood sheet count, props, and ties using standard sheet sizes and spacing.",
      "Site practice and rental vs purchase models change cost — use local norms for prop spacing and beam spacing.",
    ],
    {
      question: "What plywood size is assumed?",
      answer:
        "Often 8 × 4 ft (2440 × 1220 mm) sheets. Enter actual sheet dimensions and waste factor for your supplier.",
    },
    "Shuttering Calculator — Plywood Sheets & Props",
    "Estimate shuttering materials from contact area and sheet size. Civil temporary works aid only.",
    ["shuttering calculator", "plywood sheets formwork", "shuttering material estimate"],
  ),
  "civil-scaffolding-calculator": article(
    "civil-scaffolding-calculator",
    "Scaffolding calculator",
    [
      "Estimates scaffold bay count and material from building height, bay width, and lift spacing — planning literacy.",
      "Load class, tie patterns, and base plates must meet safety standards — follow scaffold engineer or manufacturer erection guide.",
    ],
    {
      question: "Who approves scaffold design?",
      answer:
        "Competent persons and sometimes scaffold engineers per local OHS rules. This tool does not replace safety design.",
    },
    "Scaffolding Calculator — Bay Count & Material Hint",
    "Estimate scaffolding bays and material for height access. Planning aid — follow OHS and manufacturer specs.",
    ["scaffolding calculator civil", "scaffold bay estimate", "scaffolding material quantity"],
  ),
  "civil-wind-load-calculator": article(
    "civil-wind-load-calculator",
    "Wind load",
    [
      "Teaching estimate of wind pressure on a vertical surface from basic velocity and exposure factors.",
      "ASCE 7, IS 875, and Eurocode wind chapters require full building geometry, gust factors, and pressure coefficients.",
    ],
    {
      question: "Can I use this for structural design?",
      answer:
        "No. Design wind loads need code-compliant analysis by a licensed structural engineer with proper exposure and coefficients.",
    },
    "Wind Load Calculator — Pressure × Area Teaching",
    "Educational wind pressure estimate on vertical area. Not code-compliant structural wind design.",
    ["wind load calculator civil", "wind pressure estimate", "basic wind load"],
  ),
  "civil-seismic-load-calculator": article(
    "civil-seismic-load-calculator",
    "Seismic load",
    [
      "Introductory base-shear literacy from building weight and a simplified seismic coefficient — not response spectrum analysis.",
      "Seismic design category, soil type, and ductility class drive real base shear per IS 1893, IBC, or Eurocode 8.",
    ],
    {
      question: "What is base shear?",
      answer:
        "Horizontal inertia force at building base from earthquake motion. Magnitude depends on mass, period, and site seismic parameters.",
    },
    "Seismic Load Calculator — Base Shear Literacy",
    "Educational seismic base-shear estimate. Not a substitute for code seismic design by a licensed engineer.",
    ["seismic load calculator", "base shear estimate", "earthquake load civil"],
  ),
  "civil-bearing-capacity-calculator": article(
    "civil-bearing-capacity-calculator",
    "Bearing capacity",
    [
      "Teaching helper using simplified Terzaghi-style terms for shallow footing bearing — literacy only.",
      "Site investigation (SPT, CPT, lab tests) and code factors of safety govern allowable bearing pressure in design.",
    ],
    {
      question: "Is Terzaghi's equation always used?",
      answer:
        "Modern practice also uses Meyerhof, Hansen, or code-specific methods. Match method to your geotechnical report and code.",
    },
    "Bearing Capacity Calculator — Shallow Footing Literacy",
    "Educational soil bearing capacity estimate. Verify with geotechnical investigation and licensed design.",
    ["bearing capacity calculator", "Terzaghi bearing capacity", "soil bearing estimate"],
  ),
  "civil-soil-compaction-calculator": article(
    "civil-soil-compaction-calculator",
    "Soil compaction",
    [
      "Relates dry density, moisture content, and bulk density for compaction control literacy (Proctor context).",
      "Field acceptance uses nuclear gauge or sand-cone tests against lab OMC and MDD — not spreadsheet defaults alone.",
    ],
    {
      question: "What is OMC and MDD?",
      answer:
        "Optimum moisture content and maximum dry density from Standard or Modified Proctor test — targets for field compaction.",
    },
    "Soil Compaction Calculator — Dry Density & Moisture",
    "Educational soil compaction density relationships. Field verification requires lab Proctor and site tests.",
    ["soil compaction calculator", "dry density moisture", "Proctor compaction civil"],
  ),
};
