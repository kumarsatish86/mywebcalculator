import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-estimation-cost";
const HUB_LABEL = "Engineering · Civil · Estimation & cost";
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
        title: "Estimation & cost tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Construction cost", "Area × rate rollup"],
          ["House construction cost", "Built-up × ₹/ft² style"],
          ["Material cost", "Qty × unit rates"],
          ["Labor cost", "Man-days × wage"],
          ["Project cost", "Multi-trade sum"],
          ["BOQ", "Bill of quantities lines"],
          ["Rate analysis", "Material + labor + OH"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your cost inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_ESTIMATION_ARTICLES: Record<string, RichArticle> = {
  "civil-construction-cost-calculator": article(
    "civil-construction-cost-calculator",
    "Construction cost",
    [
      "Rough project cost from built-up area and all-in rate per unit area — common for early feasibility studies.",
      "Specification level, location, and market timing swing totals by 20–40% — treat as an order-of-magnitude check.",
    ],
    {
      question: "What rate per ft² should I use?",
      answer:
        "Use recent local tender benchmarks for similar spec and finish. Update quarterly; luxury and MEP-heavy builds exceed standard rates.",
    },
    "Construction Cost Calculator — Area × Rate Estimate",
    "Estimate total construction cost from area and unit rate. Feasibility aid — not a tender or contract price.",
    ["construction cost calculator", "building cost estimate", "construction cost per sqft"],
  ),
  "civil-house-construction-cost-calculator": article(
    "civil-house-construction-cost-calculator",
    "House construction cost",
    [
      "Residential-focused rollup from carpet or built-up area, floors, and finish tier for budgeting conversations.",
      "Land, approvals, interiors, and landscaping are usually excluded unless you add explicit line items.",
    ],
    {
      question: "Built-up or carpet area for costing?",
      answer:
        "Local practice varies. Many residential quick estimates use built-up area × rate; confirm the basis before comparing quotes.",
    },
    "House Construction Cost Calculator — Residential Budget",
    "Estimate house construction cost from area and finish tier. Home budgeting aid — verify with detailed BOQ.",
    ["house construction cost calculator", "home building cost", "house cost estimate"],
  ),
  "civil-material-cost-estimator": article(
    "civil-material-cost-estimator",
    "Material cost estimator",
    [
      "Multiplies material quantities (cement, steel, sand, etc.) by unit rates for a materials subtotal.",
      "Taxes, delivery, wastage, and stock handling are often layered on top of basic material arithmetic.",
    ],
    {
      question: "Should wastage be included in quantities?",
      answer:
        "Either inflate quantities or add a wastage line. Be consistent when comparing vendor quotes and your BOQ.",
    },
    "Material Cost Estimator — Qty × Unit Rate Rollup",
    "Estimate civil material cost from quantities and unit rates. BOQ helper — update rates from local market.",
    ["material cost estimator civil", "construction material cost", "BOQ material estimate"],
  ),
  "civil-labor-cost-calculator": article(
    "civil-labor-cost-calculator",
    "Labor cost",
    [
      "Estimates labor spend from man-days (or man-hours) and wage rate for trades such as masonry, bar bending, or finishing.",
      "Productivity norms vary by skill, season, and site access — use historical job data when available.",
    ],
    {
      question: "Man-day or lump sum?",
      answer:
        "This tool supports unit-rate labor (man-day × count). Many subcontracts are lump sum — convert carefully for comparison.",
    },
    "Labor Cost Calculator — Man-days × Wage Rate",
    "Estimate construction labor cost from man-days and wage rates. Civil budgeting aid — not payroll compliance.",
    ["labor cost calculator construction", "man day cost civil", "masonry labor estimate"],
  ),
  "civil-project-cost-calculator": article(
    "civil-project-cost-calculator",
    "Project cost",
    [
      "Combines material, labor, and optional overhead percentages into a single project cost snapshot.",
      "Contingency, profit, and escalation for multi-year jobs should be added per company estimating policy.",
    ],
    {
      question: "What overhead percentage is typical?",
      answer:
        "Site overhead often ranges 8–15% of direct cost depending on project scale and duration. Use your organization's norms.",
    },
    "Project Cost Calculator — Material + Labor + OH",
    "Roll up civil project cost from direct costs and overhead. Early estimate only — confirm with detailed BOQ.",
    ["project cost calculator civil", "construction project estimate", "total project cost"],
  ),
  "civil-boq-bill-of-quantity-calculator": article(
    "civil-boq-bill-of-quantity-calculator",
    "BOQ (bill of quantity)",
    [
      "Organizes line items with description, unit, quantity, rate, and amount for a teaching-style bill of quantities.",
      "Contract BOQ must align with drawings, specs, and measurement standards (IS 1200, CESMM, etc.).",
    ],
    {
      question: "Is this a legal tender document?",
      answer:
        "No. Formal BOQ for bidding requires measured quantities from approved drawings and standardized measurement rules.",
    },
    "BOQ Calculator — Bill of Quantity Teaching Table",
    "Build a teaching bill of quantities with qty × rate lines. Civil literacy — not a contract BOQ.",
    ["BOQ calculator", "bill of quantity civil", "quantity survey estimate"],
  ),
  "civil-rate-analysis-calculator": article(
    "civil-rate-analysis-calculator",
    "Rate analysis",
    [
      "Breaks down a unit rate into material, labor, equipment, and overhead components for one BOQ item.",
      "Approved schedule of rates (SOR) from public works departments may supersede private rate builds.",
    ],
    {
      question: "Why analyze rates item by item?",
      answer:
        "Rate analysis justifies unit prices in tenders and helps compare subcontract quotes against in-house build-up.",
    },
    "Rate Analysis Calculator — Unit Rate Build-up",
    "Build up a civil unit rate from material, labor, and overhead. Estimating aid — verify against local SOR.",
    ["rate analysis calculator", "unit rate civil", "construction rate build up"],
  ),
};
