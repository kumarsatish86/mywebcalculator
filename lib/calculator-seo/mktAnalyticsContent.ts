import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-advanced-growth-analytics";
const HUB_LABEL = "Business · Marketing · Advanced growth and analytics calculators";
const SHELL =
  "Business marketing estimation tools that run in your browser. Not financial, legal, or tax advice. Ad platforms, attribution models, and fees vary — verify figures in your analytics and billing consoles.";

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
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Growth & analytics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Virality coefficient", "Teaching metric from inputs"],
          ["Customer growth", "Teaching metric from inputs"],
          ["MER", "Teaching metric from inputs"],
          ["Attribution model", "Teaching metric from inputs"],
          ["Cohort retention", "Teaching metric from inputs"],
          ["Traffic source ROI", "Teaching metric from inputs"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your marketing inputs. Planning estimate only — platforms, attribution, and costs vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MKT_ANALYTICS_ARTICLES: Record<string, RichArticle> = {
  "mkt-virality-coefficient-calculator": article(
    "mkt-virality-coefficient-calculator",
    "Virality coefficient",
    [
      "Virality coefficient teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Virality coefficient calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Virality coefficient Calculator — Marketing Teaching Estimate",
    "Estimate virality coefficient from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["virality coefficient calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-customer-growth-rate-calculator": article(
    "mkt-customer-growth-rate-calculator",
    "Customer growth",
    [
      "Customer growth teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Customer growth calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Customer growth Calculator — Marketing Teaching Estimate",
    "Estimate customer growth from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["customer growth calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-mer-calculator": article(
    "mkt-mer-calculator",
    "MER",
    [
      "MER teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the MER calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "MER Calculator — Marketing Teaching Estimate",
    "Estimate mer from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["mer calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-attribution-model-calculator": article(
    "mkt-attribution-model-calculator",
    "Attribution model",
    [
      "Attribution model teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Attribution model calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Attribution model Calculator — Marketing Teaching Estimate",
    "Estimate attribution model from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["attribution model calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cohort-retention-calculator": article(
    "mkt-cohort-retention-calculator",
    "Cohort retention",
    [
      "Cohort retention teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cohort retention calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cohort retention Calculator — Marketing Teaching Estimate",
    "Estimate cohort retention from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cohort retention calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-traffic-source-roi-calculator": article(
    "mkt-traffic-source-roi-calculator",
    "Traffic source ROI",
    [
      "Traffic source ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Traffic source ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Traffic source ROI Calculator — Marketing Teaching Estimate",
    "Estimate traffic source roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["traffic source roi calculator", "marketing metric", "campaign calculator"],
  ),
};
