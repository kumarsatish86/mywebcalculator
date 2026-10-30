import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-rent-housing";
const HUB_LABEL = "Daily life · Home utility · Rent, housing, and living cost calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify amounts with your lease, lender, or tax advisor.";

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
    vertical: "finance-loan",
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Rent and housing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Rent affordability", "Income × safe rent ratio cap"],
          ["Rent split (roommates)", "Share rent + utilities by room or weight"],
          ["Rent vs buy", "Compare rent cost to ownership carry"],
          ["Lease cost", "Rent × term + deposits and fees"],
          ["Property maintenance", "Annual upkeep as % of value or rent"],
          ["Home ownership cost", "Mortgage + tax + insurance + maintenance"],
          ["Society charges", "Maintenance + sinking fund per flat"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your housing inputs. Planning estimate only — taxes, stamp duty, and HOA rules vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_RENT_ARTICLES: Record<string, RichArticle> = {
  "home-rent-affordability-calculator": article(
    "home-rent-affordability-calculator",
    "Rent affordability",
    [
      "Checks whether proposed rent fits a common income ratio (often 30% of gross or net — adjust to your rule).",
      "Lenders and landlords may use different thresholds; include utilities and commute costs in your personal budget.",
    ],
    {
      question: "Is 30% of gross or net income standard?",
      answer:
        "Both appear in the wild. Net-based ratios are stricter. Pick one rule and stay consistent when comparing listings.",
    },
    "Rent Affordability Calculator — Income vs Rent Ratio",
    "See if rent fits your income using a configurable ratio cap. Budgeting aid — not mortgage or legal advice.",
    ["rent affordability calculator", "30 percent rent rule", "how much rent can I afford"],
  ),
  "home-rent-split-roommates-calculator": article(
    "home-rent-split-roommates-calculator",
    "Rent split (roommates)",
    [
      "Divides monthly rent and shared bills equally or by room size, ensuite, or custom weights among roommates.",
      "Deposits, move-in fees, and who holds the lease are legal matters — this tool only splits arithmetic.",
    ],
    {
      question: "Should master bedroom pay more?",
      answer:
        "Many households weight by square metres or assign a premium for ensuite and parking. Agree in writing before signing.",
    },
    "Rent Split Calculator — Roommates Fair Share",
    "Split rent and shared bills among roommates by equal or weighted shares. Household budgeting — not legal advice.",
    ["rent split calculator", "roommate rent split", "shared apartment cost split"],
  ),
  "home-rent-vs-buy-calculator": article(
    "home-rent-vs-buy-calculator",
    "Rent vs buy",
    [
      "Compares monthly rent to an ownership carry snapshot (mortgage, tax, insurance, maintenance) over a chosen horizon.",
      "Price appreciation, transaction costs, and opportunity cost of down payment are simplified — full buy/rent models need local data.",
    ],
    {
      question: "Does buying always build wealth?",
      answer:
        "Not necessarily. High carrying costs, flat markets, or mobility needs can favor renting. Run scenarios with realistic appreciation and fees.",
    },
    "Rent vs Buy Calculator — Monthly Cost Comparison",
    "Compare renting versus buying carry costs side by side. Financial literacy — taxes and rates vary by region.",
    ["rent vs buy calculator", "rent or buy home", "housing cost comparison"],
  ),
  "home-lease-cost-calculator": article(
    "home-lease-cost-calculator",
    "Lease cost",
    [
      "Totals rent over lease term plus security deposit, broker fees, and move-in charges for true occupancy cost.",
      "Rent escalation clauses and renewal premiums are contract-specific — extend the term math if your lease indexes annually.",
    ],
    {
      question: "Should deposit count as a cost?",
      answer:
        "Deposit is refundable if terms are met — treat it as tied-up cash, not spent cost, unless you expect forfeiture.",
    },
    "Lease Cost Calculator — Total Rent Over Term",
    "Calculate full lease cost including deposit and fees over the contract period. Planning aid — read your lease carefully.",
    ["lease cost calculator", "total rent over lease", "apartment lease fees"],
  ),
  "home-property-maintenance-cost-calculator": article(
    "home-property-maintenance-cost-calculator",
    "Property maintenance cost",
    [
      "Estimates annual upkeep as a percentage of property value or fixed budget lines — roofs, HVAC, and paint cycles vary.",
      "Older buildings and coastal climates often need higher reserves than new suburban stock.",
    ],
    {
      question: "What maintenance percentage is typical?",
      answer:
        "Rules of thumb range 1–4% of property value per year depending on age and climate. Track actual spend for your building.",
    },
    "Property Maintenance Cost Calculator — Annual Upkeep Estimate",
    "Estimate yearly home maintenance budget from value or line items. Homeownership planning — not a contractor quote.",
    ["property maintenance cost calculator", "home upkeep budget", "annual maintenance percent"],
  ),
  "home-ownership-cost-calculator": article(
    "home-ownership-cost-calculator",
    "Home ownership cost",
    [
      "Rolls mortgage payment, property tax, insurance, HOA or society fees, and maintenance into monthly owner carry.",
      "ARM rate changes, special assessments, and tax reassessments are not forecast — update inputs when bills change.",
    ],
    {
      question: "Is PITI the full picture?",
      answer:
        "PITI covers principal, interest, tax, and insurance. Add maintenance, utilities, and capital reserves for realistic ownership cost.",
    },
    "Home Ownership Cost Calculator — Monthly Carry Estimate",
    "Estimate total monthly cost of owning a home beyond mortgage alone. Budgeting aid — taxes vary by jurisdiction.",
    ["home ownership cost calculator", "monthly homeowner cost", "PITI plus maintenance"],
  ),
  "home-society-charges-calculator": article(
    "home-society-charges-calculator",
    "Society charges",
    [
      "Estimates apartment society or HOA maintenance from rate per square foot, flat size, and optional parking or sinking fund.",
      "By-laws, arrears penalties, and one-off assessments differ by society — confirm with your management committee.",
    ],
    {
      question: "What is a sinking fund?",
      answer:
        "A reserve collected for major repairs (lift, facade, plumbing). It may be a separate line from routine maintenance.",
    },
    "Society Charges Calculator — Maintenance per Flat",
    "Estimate apartment society maintenance from rate and carpet area. Planning aid — bylaws vary by building.",
    ["society charges calculator", "apartment maintenance fee", "HOA monthly cost estimate"],
  ),
};
