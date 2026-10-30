import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-area-volume-measurement";
const HUB_LABEL = "Engineering · Civil · Area & volume measurement";
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
        title: "Area & volume tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Area (shapes)", "Square, rectangle, circle, irregular"],
          ["Volume", "Area × depth or L × W × H"],
          ["Perimeter", "Sum of boundary lengths"],
          ["Floor area", "Plan dimensions rollup"],
          ["Built-up area", "External wall envelope"],
          ["Carpet area", "Net usable floor area"],
          ["Plot area", "Land parcel dimensions"],
          ["Excavation volume", "Cut dimensions × depth"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your measurement inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_AREA_VOLUME_ARTICLES: Record<string, RichArticle> = {
  "civil-area-calculator-shapes": article(
    "civil-area-calculator-shapes",
    "Area calculator (shapes)",
    [
      "Computes plan area for square, rectangle, circle, and simple irregular polygons from entered dimensions.",
      "Survey-grade area may require coordinates or GIS — this is a field sketch and BOQ literacy helper.",
    ],
    {
      question: "How is irregular area handled?",
      answer:
        "Break the plan into triangles or trapezoids and sum partial areas, or enter a surveyed total. Complex curves need finer subdivision.",
    },
    "Area Calculator — Square, Rectangle, Circle, Irregular",
    "Calculate plan area for common shapes and simple irregular plots. Civil measurement aid only.",
    ["area calculator shapes", "irregular area calculator", "plan area civil"],
  ),
  "civil-volume-calculator": article(
    "civil-volume-calculator",
    "Volume calculator",
    [
      "Estimates volume from length, width, and height (or depth) for prismatic solids common in earthwork and concrete.",
      "Tapered or sloped volumes need prismoidal or average-end-area methods — not a single L × W × H block.",
    ],
    {
      question: "When is simple L × W × H wrong?",
      answer:
        "Sloping excavations, frustum footings, and curved tanks need geometry beyond a rectangular prism. Use specialized tools or manual formulas.",
    },
    "Volume Calculator — L × W × H Civil Estimate",
    "Compute prismatic volume from length, width, and height. Civil quantity helper — verify complex shapes separately.",
    ["volume calculator civil", "cubic volume calculator", "earthwork volume estimate"],
  ),
  "civil-perimeter-calculator": article(
    "civil-perimeter-calculator",
    "Perimeter calculator",
    [
      "Sums boundary lengths for rectangular, circular, or multi-segment plans — useful for fencing and edging BOQ.",
      "Curved boundaries need arc length inputs; irregular sites may come from surveyed chainage totals.",
    ],
    {
      question: "Is perimeter the same as fence length?",
      answer:
        "Fence runs follow the boundary but may step at gates and corners. Add post bays and overlap separately in procurement.",
    },
    "Perimeter Calculator — Boundary Length Estimate",
    "Calculate plan perimeter for rectangles, circles, and segmented boundaries. Civil measurement tool only.",
    ["perimeter calculator", "boundary length calculator", "fence perimeter estimate"],
  ),
  "civil-floor-area-calculator": article(
    "civil-floor-area-calculator",
    "Floor area",
    [
      "Rolls up room or bay dimensions into total floor area for finishing and services estimates.",
      "Openings, columns, and shared walls affect net finish area — match your BOQ definition (gross vs net).",
    ],
    {
      question: "Gross or net floor area?",
      answer:
        "Enter dimensions consistent with your BOQ. Carpet and tile estimates often use net area excluding fixed built-ins.",
    },
    "Floor Area Calculator — Room & Plan Rollup",
    "Sum floor areas from room dimensions for civil finishing estimates. Measurement aid — not legal area certification.",
    ["floor area calculator", "total floor area", "room area sum"],
  ),
  "civil-built-up-area-calculator": article(
    "civil-built-up-area-calculator",
    "Built-up area",
    [
      "Estimates built-up area from external plan dimensions and number of floors — common in residential marketing and FAR checks.",
      "Local definitions of built-up, super built-up, and FAR vary by municipality — confirm with your authority's rules.",
    ],
    {
      question: "Does built-up include walls?",
      answer:
        "Usually yes — external envelope to outer face of walls times floors. Carpet area excludes wall thickness and common areas per local custom.",
    },
    "Built-up Area Calculator — External Envelope × Floors",
    "Estimate built-up area from plan size and floor count. Civil planning literacy — verify with local bylaws.",
    ["built up area calculator", "BUA calculator", "built up area floors"],
  ),
  "civil-carpet-area-calculator": article(
    "civil-carpet-area-calculator",
    "Carpet area",
    [
      "Computes net usable internal floor area by deducting wall thickness and optional common-area share.",
      "Saleable area definitions differ by developer and jurisdiction — this is an estimator, not a legal disclosure.",
    ],
    {
      question: "What should I deduct from carpet area?",
      answer:
        "Typically internal wall thickness and non-usable shafts. Balconies and terraces may be counted separately per local RERA or municipal rules.",
    },
    "Carpet Area Calculator — Net Usable Floor Area",
    "Estimate carpet area from plan dimensions with wall deductions. Educational tool — confirm legal definitions locally.",
    ["carpet area calculator", "net floor area", "usable area estimate"],
  ),
  "civil-plot-area-calculator": article(
    "civil-plot-area-calculator",
    "Plot area",
    [
      "Calculates land parcel area from length and width or from entered side dimensions of a plot.",
      "Registered plot area comes from survey records — use this for quick checks and layout sketches only.",
    ],
    {
      question: "Can I use this for property registration?",
      answer:
        "No. Legal area requires a licensed survey and documented plot map. This tool supports estimation and teaching only.",
    },
    "Plot Area Calculator — Land Parcel Size",
    "Estimate plot area from dimensions for layout and planning. Not a substitute for registered survey.",
    ["plot area calculator", "land area calculator", "parcel area estimate"],
  ),
  "civil-excavation-volume-calculator": article(
    "civil-excavation-volume-calculator",
    "Excavation volume",
    [
      "Estimates cut volume from trench or pit length, width, and depth with optional swell factor teaching note.",
      "Sloped sides, stepped benches, and groundwater affect real haul quantities — use average-end-area for large cuts.",
    ],
    {
      question: "What is swell factor?",
      answer:
        "Excavated soil expands in loose state (often 20–30% for clay). Haul and backfill calculations may use bank vs loose volume conversions.",
    },
    "Excavation Volume Calculator — Cut Quantity Estimate",
    "Estimate excavation volume from trench or pit dimensions. Civil earthwork aid — verify with site survey.",
    ["excavation volume calculator", "cut volume estimate", "trench excavation m3"],
  ),
};
