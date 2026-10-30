import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/civil/civil-steel-reinforcement";
const HUB_LABEL = "Engineering · Civil · Steel & reinforcement";
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
        title: "Steel & reinforcement tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Steel weight", "πr² × L × density"],
          ["Rebar calculator", "Bars from spacing & length"],
          ["Steel quantity", "Multi-member rollup"],
          ["Reinforcement bar", "Dia × length × count"],
          ["BBS", "Bar bending schedule rows"],
          ["Steel cost", "Weight × rate"],
          ["Lap length", "Overlap per code factor"],
          ["Development length", "Bond length estimate"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your steel inputs. Estimation aid only — verify with licensed engineering and local codes.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CIVIL_STEEL_ARTICLES: Record<string, RichArticle> = {
  "civil-steel-weight-calculator": article(
    "civil-steel-weight-calculator",
    "Steel weight",
    [
      "Computes rebar or structural steel weight from diameter, length, and bar count using standard unit-weight formulas.",
      "Manufacturing tolerances and couplers add marginal weight — procurement often orders by theoretical weight plus waste.",
    ],
    {
      question: "What density is used for steel?",
      answer:
        "Typically 7850 kg/m³ or standard kg/m tables per bar diameter. Confirm with your supplier's certified weights for billing.",
    },
    "Steel Weight Calculator — Rebar kg from Diameter",
    "Calculate steel weight from bar diameter, length, and quantity. Civil BOQ aid — not structural design.",
    ["steel weight calculator", "rebar weight calculator", "steel kg estimate"],
  ),
  "civil-rebar-calculator": article(
    "civil-rebar-calculator",
    "Rebar calculator",
    [
      "Estimates number and length of bars from member dimensions, cover, and spacing.",
      "Actual detailing follows structural drawings — stirrup hooks, cranks, and laps are engineer-specified.",
    ],
    {
      question: "Does spacing include end zones?",
      answer:
        "Enter spacing per your detail or code zone (e.g. tighter at supports). This tool applies uniform spacing unless you segment inputs.",
    },
    "Rebar Calculator — Bars from Spacing & Length",
    "Estimate rebar count and length from dimensions and spacing. Reinforcement literacy — follow structural drawings.",
    ["rebar calculator", "reinforcement bar count", "rebar spacing calculator"],
  ),
  "civil-steel-quantity-estimator": article(
    "civil-steel-quantity-estimator",
    "Steel quantity estimator",
    [
      "Rolls up steel weight across multiple members (beams, columns, slabs) for a project-level BOQ snapshot.",
      "Category-wise wastage, cutting lengths, and stock lengths affect order quantities — add site margins.",
    ],
    {
      question: "How much wastage should I add?",
      answer:
        "Common planning allowances are 3–5% for straight bars and higher for complex BBS. Fabricators may optimize from 12 m stock lengths.",
    },
    "Steel Quantity Estimator — Project Reinforcement Rollup",
    "Sum steel quantities across members for rough project estimates. Civil BOQ helper — verify with detailed BBS.",
    ["steel quantity estimator", "reinforcement quantity", "project steel estimate"],
  ),
  "civil-reinforcement-bar-calculator": article(
    "civil-reinforcement-bar-calculator",
    "Reinforcement bar",
    [
      "Calculates total bar length and weight for a given diameter, count, and cut length.",
      "Standard bar lengths (6 m, 12 m) and lap splices determine number of pieces to order from stock.",
    ],
    {
      question: "How do I account for laps?",
      answer:
        "Add lap length (often 40–50 × bar diameter per code) to required development length, or use the dedicated lap-length tool.",
    },
    "Reinforcement Bar Calculator — Length & Weight",
    "Compute reinforcement bar length and weight from diameter and count. Civil estimation only.",
    ["reinforcement bar calculator", "rebar length weight", "bar bending estimate"],
  ),
  "civil-bbs-bar-bending-schedule-calculator": article(
    "civil-bbs-bar-bending-schedule-calculator",
    "BBS (bar bending schedule)",
    [
      "Organizes bar marks, shapes, diameters, and cut lengths in a BBS-style table for quantity and fabrication literacy.",
      "Production BBS must match approved structural drawings and bending codes — this supports learning and rough checks.",
    ],
    {
      question: "Is this a certified BBS?",
      answer:
        "No. Fabrication shops require engineer-approved schedules with shape codes. Use this for estimation and study only.",
    },
    "BBS Calculator — Bar Bending Schedule Estimate",
    "Build a teaching bar bending schedule from bar marks and cut lengths. Not a substitute for approved shop drawings.",
    ["BBS calculator", "bar bending schedule", "rebar schedule civil"],
  ),
  "civil-steel-cost-calculator": article(
    "civil-steel-cost-calculator",
    "Steel cost",
    [
      "Multiplies total steel weight by rate per kg (or per tonne) for a rough material cost line item.",
      "Market rates, GST, transport, and fabrication charges fluctuate — update from local suppliers before tendering.",
    ],
    {
      question: "Per kg or per tonne?",
      answer:
        "Enter the unit your quote uses. Convert consistently (1 tonne = 1000 kg) when comparing vendor bids.",
    },
    "Steel Cost Calculator — Weight × Rate Estimate",
    "Estimate reinforcement steel cost from weight and unit rate. Civil budgeting aid — not a contract price.",
    ["steel cost calculator", "rebar cost estimate", "steel price per kg"],
  ),
  "civil-lap-length-calculator": article(
    "civil-lap-length-calculator",
    "Lap length",
    [
      "Estimates splice overlap length from bar diameter and a code-style multiplier (e.g. 40d or 50d teaching default).",
      "Tension vs compression laps, epoxy-coated bars, and seismic detailing may require different factors per your code.",
    ],
    {
      question: "Is 50d always correct?",
      answer:
        "No. IS 456, ACI 318, and Eurocode specify lap length by bar grade, position, and concrete strength. Follow your project's structural code.",
    },
    "Lap Length Calculator — Splice Overlap Estimate",
    "Estimate rebar lap length from diameter and code multiplier. Educational — follow project structural code.",
    ["lap length calculator", "rebar lap splice", "50d lap length"],
  ),
  "civil-development-length-calculator": article(
    "civil-development-length-calculator",
    "Development length",
    [
      "Computes bond development length from bar diameter, concrete grade, and teaching bond-stress assumptions.",
      "Hooks and mechanical anchors reduce required straight embedment — detail per structural engineer.",
    ],
    {
      question: "When is development length required?",
      answer:
        "Where bars must transfer stress into concrete at supports, splices, or termination points. Exact length is code- and grade-specific.",
    },
    "Development Length Calculator — Bond Length Estimate",
    "Estimate rebar development length from diameter and concrete grade. Civil literacy — verify with structural design.",
    ["development length calculator", "bond length rebar", "Ld calculator civil"],
  ),
};
