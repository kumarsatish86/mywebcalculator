import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-advertising-paid";
const HUB_LABEL = "Business · Marketing · Advertising and paid marketing calculators";
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
        title: "Advertising & paid tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["CPM", "Teaching metric from inputs"],
          ["CPC", "Teaching metric from inputs"],
          ["CPA", "Teaching metric from inputs"],
          ["CPL", "Teaching metric from inputs"],
          ["CPI", "Teaching metric from inputs"],
          ["ROAS", "Teaching metric from inputs"],
          ["Ad spend efficiency", "Teaching metric from inputs"],
          ["Cost per conversion", "Teaching metric from inputs"],
          ["Conversion value", "Teaching metric from inputs"],
          ["Break-even CPC", "Teaching metric from inputs"],
          ["Ad budget", "Teaching metric from inputs"],
          ["Campaign budget planner", "Teaching metric from inputs"],
          ["Daily ad budget", "Teaching metric from inputs"],
          ["Spend allocation", "Teaching metric from inputs"],
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

export const MKT_ADS_ARTICLES: Record<string, RichArticle> = {
  "mkt-cpm-calculator": article(
    "mkt-cpm-calculator",
    "CPM",
    [
      "CPM teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CPM calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CPM Calculator — Marketing Teaching Estimate",
    "Estimate cpm from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cpm calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cpc-calculator": article(
    "mkt-cpc-calculator",
    "CPC",
    [
      "CPC teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CPC calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CPC Calculator — Marketing Teaching Estimate",
    "Estimate cpc from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cpc calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cpa-calculator": article(
    "mkt-cpa-calculator",
    "CPA",
    [
      "CPA teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CPA calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CPA Calculator — Marketing Teaching Estimate",
    "Estimate cpa from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cpa calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cpl-calculator": article(
    "mkt-cpl-calculator",
    "CPL",
    [
      "CPL teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CPL calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CPL Calculator — Marketing Teaching Estimate",
    "Estimate cpl from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cpl calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cpi-calculator": article(
    "mkt-cpi-calculator",
    "CPI",
    [
      "CPI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CPI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CPI Calculator — Marketing Teaching Estimate",
    "Estimate cpi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cpi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-roas-calculator": article(
    "mkt-roas-calculator",
    "ROAS",
    [
      "ROAS teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the ROAS calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "ROAS Calculator — Marketing Teaching Estimate",
    "Estimate roas from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["roas calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-ad-spend-efficiency-calculator": article(
    "mkt-ad-spend-efficiency-calculator",
    "Ad spend efficiency",
    [
      "Ad spend efficiency teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Ad spend efficiency calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Ad spend efficiency Calculator — Marketing Teaching Estimate",
    "Estimate ad spend efficiency from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["ad spend efficiency calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cost-per-conversion-calculator": article(
    "mkt-cost-per-conversion-calculator",
    "Cost per conversion",
    [
      "Cost per conversion teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cost per conversion calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cost per conversion Calculator — Marketing Teaching Estimate",
    "Estimate cost per conversion from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cost per conversion calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-conversion-value-calculator": article(
    "mkt-conversion-value-calculator",
    "Conversion value",
    [
      "Conversion value teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Conversion value calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Conversion value Calculator — Marketing Teaching Estimate",
    "Estimate conversion value from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["conversion value calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-break-even-cpc-calculator": article(
    "mkt-break-even-cpc-calculator",
    "Break-even CPC",
    [
      "Break-even CPC teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Break-even CPC calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Break-even CPC Calculator — Marketing Teaching Estimate",
    "Estimate break-even cpc from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["break-even cpc calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-ad-budget-calculator": article(
    "mkt-ad-budget-calculator",
    "Ad budget",
    [
      "Ad budget teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Ad budget calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Ad budget Calculator — Marketing Teaching Estimate",
    "Estimate ad budget from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["ad budget calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-campaign-budget-planner": article(
    "mkt-campaign-budget-planner",
    "Campaign budget planner",
    [
      "Campaign budget planner teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Campaign budget planner calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Campaign budget planner Calculator — Marketing Teaching Estimate",
    "Estimate campaign budget planner from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["campaign budget planner calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-daily-ad-budget-calculator": article(
    "mkt-daily-ad-budget-calculator",
    "Daily ad budget",
    [
      "Daily ad budget teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Daily ad budget calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Daily ad budget Calculator — Marketing Teaching Estimate",
    "Estimate daily ad budget from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["daily ad budget calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-marketing-spend-allocation-calculator": article(
    "mkt-marketing-spend-allocation-calculator",
    "Spend allocation",
    [
      "Spend allocation teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Spend allocation calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Spend allocation Calculator — Marketing Teaching Estimate",
    "Estimate spend allocation from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["spend allocation calculator", "marketing metric", "campaign calculator"],
  ),
};
