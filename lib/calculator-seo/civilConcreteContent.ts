import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-concrete-materials";
const HUB_LABEL = "Engineering · Civil · Concrete & materials";
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
        title: "Concrete & material tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Concrete volume", "L × W × H with waste factor"],
          ["Mix ratio (M10–M25)", "Cement : sand : aggregate by grade"],
          ["Cement / sand / aggregate", "Volume × ratio per m³"],
          ["Cement bags", "Cement kg ÷ bag weight"],
          ["Dry to wet volume", "Dry × bulking factor"],
          ["RMC order", "Volume × supplier rate"],
          ["Concrete cost", "Materials + labor rollup"],
          ["Strength estimator", "Grade vs age teaching curve"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your concrete inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_CONCRETE_ARTICLES: Record<string, RichArticle> = {
  "civil-concrete-volume-calculator": article(
    "civil-concrete-volume-calculator",
    "Concrete volume",
    [
      "Computes wet concrete volume from length, width, and depth (or height) with an optional waste allowance.",
      "Use for slab, footing, or column pours — site conditions, formwork gaps, and compaction differ from textbook volumes.",
    ],
    {
      question: "Should I add a waste factor?",
      answer:
        "Most estimators add 5–10% for spillage and uneven subgrade. Adjust for your pour type and verify with your site engineer.",
    },
    "Concrete Volume Calculator — m³ from Dimensions",
    "Estimate concrete volume from length, width, and depth with optional waste. Civil estimation aid — not licensed design.",
    ["concrete volume calculator", "concrete quantity m3", "civil concrete estimate"],
  ),
  "civil-concrete-mix-ratio-calculator": article(
    "civil-concrete-mix-ratio-calculator",
    "Concrete mix ratio (M10, M20, M25)",
    [
      "Maps common grade labels (M10, M15, M20, M25, etc.) to cement : sand : aggregate proportions for teaching estimates.",
      "Actual site mixes depend on aggregate grading, admixtures, and local codes — not a batching plant specification.",
    ],
    {
      question: "Are M-grade ratios the same everywhere?",
      answer:
        "Nominal ratios vary by region and code (IS, BS, ACI). Use this for literacy and rough BOQ — confirm with your mix design engineer.",
    },
    "Concrete Mix Ratio Calculator — M10, M20, M25 Grades",
    "Look up cement-sand-aggregate ratios for common M grades. Educational civil estimate — verify with local codes.",
    ["concrete mix ratio calculator", "M20 mix ratio", "M25 cement sand aggregate"],
  ),
  "civil-cement-calculator": article(
    "civil-cement-calculator",
    "Cement quantity",
    [
      "Estimates cement mass or volume from total concrete volume and the selected mix ratio.",
      "Bag counts and bulk density assumptions are teaching defaults — check supplier datasheets on site.",
    ],
    {
      question: "How is cement volume converted to bags?",
      answer:
        "Typically cement kg is divided by bag weight (often 50 kg). Density and loose vs packed volume affect real orders.",
    },
    "Cement Calculator — Quantity from Concrete Volume",
    "Estimate cement needed from concrete volume and mix ratio. Civil BOQ aid — not a licensed mix design.",
    ["cement calculator", "cement quantity concrete", "cement bags estimate"],
  ),
  "civil-sand-calculator": article(
    "civil-sand-calculator",
    "Sand quantity",
    [
      "Derives fine-aggregate volume from total concrete volume and mix proportion.",
      "Moisture content and bulking change loose sand volume — dry-volume tools may apply a bulking factor separately.",
    ],
    {
      question: "Is this loose or compacted sand?",
      answer:
        "Ratios are usually by absolute volume of dry materials. Wet sand and bulking require site-specific correction factors.",
    },
    "Sand Calculator — Fine Aggregate for Concrete",
    "Estimate sand volume from concrete quantity and mix ratio. Civil estimation only — verify on site.",
    ["sand calculator concrete", "fine aggregate quantity", "sand m3 estimate"],
  ),
  "civil-aggregate-calculator": article(
    "civil-aggregate-calculator",
    "Aggregate quantity",
    [
      "Estimates coarse aggregate volume from concrete volume and the cement : sand : aggregate ratio.",
      "Gradation, maximum size, and crusher source change optimal proportions — this is a nominal-ratio helper.",
    ],
    {
      question: "Does aggregate size change the ratio?",
      answer:
        "Yes. Nominal M-grade tables assume typical 20 mm aggregate. Larger or crushed aggregates need a proper mix design.",
    },
    "Aggregate Calculator — Coarse Aggregate Quantity",
    "Estimate coarse aggregate from concrete volume and mix grade. Educational civil tool — not structural design.",
    ["aggregate calculator", "coarse aggregate quantity", "concrete aggregate m3"],
  ),
  "civil-cement-bags-calculator": article(
    "civil-cement-bags-calculator",
    "Cement bags",
    [
      "Converts cement mass to number of bags using a configurable bag weight (default 50 kg).",
      "Order rounding, partial bags, and delivery minimums are supplier decisions — round up for site contingency.",
    ],
    {
      question: "Why round up bag counts?",
      answer:
        "Partial bags are not delivered; spillage and secondary pours consume margin. Procurement teams often add 2–5% extra.",
    },
    "Cement Bags Calculator — Bags from Cement kg",
    "Convert cement kilograms to bag count with adjustable bag size. Civil procurement estimate only.",
    ["cement bags calculator", "50kg cement bags", "how many cement bags"],
  ),
  "civil-dry-to-wet-volume-calculator": article(
    "civil-dry-to-wet-volume-calculator",
    "Dry to wet volume",
    [
      "Applies a bulking factor to convert dry material volume to loose/wet volume for sand and similar aggregates.",
      "Bulking varies with moisture — field tests or supplier data beat generic multipliers.",
    ],
    {
      question: "What bulking factor should I use?",
      answer:
        "Common teaching values are 1.25–1.35 for sand. Measure loose vs compacted volume on site when accuracy matters.",
    },
    "Dry to Wet Volume Calculator — Bulking Factor",
    "Convert dry aggregate volume to wet/loose volume with bulking factor. Civil literacy tool — verify on site.",
    ["dry to wet volume calculator", "bulking factor sand", "wet volume concrete materials"],
  ),
  "civil-ready-mix-concrete-rmc-calculator": article(
    "civil-ready-mix-concrete-rmc-calculator",
    "Ready-mix concrete (RMC)",
    [
      "Estimates RMC order quantity and rough cost from pour dimensions and supplier rate per m³.",
      "Pump charges, minimum load, and grade premiums are plant-specific — confirm with your RMC vendor.",
    ],
    {
      question: "Does RMC include delivery and pump?",
      answer:
        "Usually not in a simple rate × volume estimate. Add line items for pumping, waiting time, and night pours separately.",
    },
    "Ready Mix Concrete Calculator — RMC Volume & Cost",
    "Estimate RMC volume and cost from dimensions and rate per m³. Budgeting aid — confirm with supplier quotes.",
    ["ready mix concrete calculator", "RMC calculator", "ready mix cost estimate"],
  ),
  "civil-concrete-cost-calculator": article(
    "civil-concrete-cost-calculator",
    "Concrete cost",
    [
      "Rolls up material quantities (cement, sand, aggregate) with unit rates for a rough concrete cost view.",
      "Labor, formwork, curing, and overhead are project-specific — extend the BOQ beyond material arithmetic.",
    ],
    {
      question: "Are unit rates fixed?",
      answer:
        "No. Cement and aggregate prices fluctuate by region and season. Update rates from local suppliers before bidding.",
    },
    "Concrete Cost Calculator — Material Cost Estimate",
    "Estimate concrete material cost from volume, mix ratio, and unit rates. Civil BOQ helper — not a contract price.",
    ["concrete cost calculator", "concrete material cost", "concrete estimate cost"],
  ),
  "civil-concrete-strength-estimator": article(
    "civil-concrete-strength-estimator",
    "Concrete strength estimator",
    [
      "Teaching view of compressive strength development vs age for common grades — not a lab cube test result.",
      "Actual strength depends on curing, water-cement ratio, aggregate, and temperature — require test certificates for acceptance.",
    ],
    {
      question: "Can I accept concrete based on this curve?",
      answer:
        "No. Structural acceptance requires standardized cube/cylinder tests and code-compliant criteria from a qualified engineer.",
    },
    "Concrete Strength Estimator — Grade vs Age Teaching Curve",
    "Educational strength-vs-age estimate for common concrete grades. Not a substitute for lab testing or design.",
    ["concrete strength estimator", "compressive strength age", "M25 strength curve"],
  ),
};
