import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-maintenance-cleaning";
const HUB_LABEL = "Daily life · Home utility · Home maintenance and cleaning calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify quotes with licensed contractors.";

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
        title: "Maintenance and cleaning tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Cleaning cost", "Area or rooms × rate per visit"],
          ["Maid salary", "Days × hours × hourly or monthly wage"],
          ["Deep cleaning", "Base clean + appliances + extras"],
          ["Home repair", "Labour + materials by job type"],
          ["Painting cost", "Wall area × coats × paint rate"],
          ["Renovation cost", "Room scope × finish tier rollup"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your maintenance inputs. Planning estimate only — labour rates and taxes vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_MAINTENANCE_ARTICLES: Record<string, RichArticle> = {
  "home-cleaning-cost-calculator": article(
    "home-cleaning-cost-calculator",
    "Cleaning cost",
    [
      "Estimates routine home cleaning charges from floor area or room count and local rate per visit or per square metre.",
      "Frequency (weekly vs biweekly), supplies included, and pet surcharges change vendor quotes — confirm scope in writing.",
    ],
    {
      question: "Per hour or flat per visit?",
      answer:
        "Both models exist. Flat visits suit standard flats; hourly works for deep clutter or move-in cleans. Compare total time on site.",
    },
    "Cleaning Cost Calculator — Home Size Based Estimate",
    "Estimate house cleaning cost from size and visit rate. Budgeting aid — not a binding service quote.",
    ["cleaning cost calculator", "house cleaning price estimate", "maid service cost home size"],
  ),
  "home-maid-salary-calculator": article(
    "home-maid-salary-calculator",
    "Maid salary",
    [
      "Calculates monthly domestic help pay from days worked, hours per day, and agreed hourly or flat monthly wage.",
      "Statutory benefits, overtime, and live-in arrangements follow local labour law — this is gross cash planning only.",
    ],
    {
      question: "Should I include festival bonus?",
      answer:
        "Many households budget one extra month or festival bonus annually. Amortize that into monthly budget if you accrue for it.",
    },
    "Maid Salary Calculator — Monthly Domestic Help Pay",
    "Calculate monthly maid or house help salary from days and hours. Household budgeting — labour rules vary by region.",
    ["maid salary calculator", "domestic help monthly pay", "housekeeper wage estimate"],
  ),
  "home-deep-cleaning-cost-estimator": article(
    "home-deep-cleaning-cost-estimator",
    "Deep cleaning cost",
    [
      "Adds premiums for kitchen degrease, bathroom scale, upholstery, and inside appliances to a base clean estimate.",
      "Move-in/move-out cleans and post-construction dust removal command higher rates than maintenance deep cleans.",
    ],
    {
      question: "How often is deep cleaning needed?",
      answer:
        "Many homes schedule quarterly or before festivals. Allergies, pets, and cooking style may justify more frequent deep passes.",
    },
    "Deep Cleaning Cost Estimator — Full Home Scrub Budget",
    "Estimate deep cleaning cost with add-ons for kitchen and bathrooms. Planning aid — get itemized quotes locally.",
    ["deep cleaning cost estimator", "full house cleaning price", "move in cleaning cost"],
  ),
  "home-repair-cost-calculator": article(
    "home-repair-cost-calculator",
    "Home repair cost",
    [
      "Rough labour and materials budget for common fixes — plumbing leaks, tile crack, door alignment — by job type.",
      "Hidden damage (mold behind tiles, rewiring scope) only appears after opening walls — keep contingency reserve.",
    ],
    {
      question: "What contingency should I add?",
      answer:
        "10–20% on small jobs; 25%+ when scope is uncertain or involves wet areas and structural elements.",
    },
    "Home Repair Cost Calculator — Common Fix Estimate",
    "Budget typical home repairs from job type and size. Not a contractor bid — verify on site.",
    ["home repair cost calculator", "house repair estimate", "maintenance repair budget"],
  ),
  "home-painting-cost-calculator": article(
    "home-painting-cost-calculator",
    "Painting cost",
    [
      "Estimates paint job cost from wall area, number of coats, paint quality tier, and labour rate per square metre.",
      "Prep work (putty, primer, wallpaper removal) and ceiling height/access scaffolding add cost beyond litre coverage math.",
    ],
    {
      question: "How many coats are typical?",
      answer:
        "Two coats over primer is standard for colour changes. Dark-to-light may need extra coats or tinted primer.",
    },
    "Painting Cost Calculator — Interior or Exterior Estimate",
    "Estimate home painting cost from area, coats, and rates. Renovation budgeting — prices vary by city.",
    ["painting cost calculator", "house painting estimate", "interior paint job cost"],
  ),
  "home-renovation-cost-calculator": article(
    "home-renovation-cost-calculator",
    "Renovation cost",
    [
      "Rolls up room-wise scope — demolition, flooring, kitchen, bath — with finish tier multipliers for a rough budget.",
      "Permits, structural changes, and MEP upgrades can dominate cost — use this for early envelope sizing only.",
    ],
    {
      question: "Economy vs premium finish — how much difference?",
      answer:
        "Finish tier multipliers often span 1.0× to 2.5× on the same footprint. Fixtures and custom cabinetry drive the spread.",
    },
    "Renovation Cost Calculator — Whole Home Remodel Budget",
    "Rough home renovation budget from scope and finish level. Planning aid — require detailed BOQ from contractors.",
    ["renovation cost calculator", "home remodel budget estimate", "flat renovation cost"],
  ),
};
