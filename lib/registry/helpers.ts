import type { CalculatorCategory, CalculatorDefinition, CalculatorFaqItem } from "../types";

function baseFaq(vertical: string): CalculatorFaqItem[] {
  return [
    {
      question: "Does this tool store my inputs?",
      answer: "No. Calculations run in your browser on mywebcalculator; nothing is sent to our servers for this page.",
    },
    {
      question: "Can I rely on this for legal, medical, or financial decisions?",
      answer:
        vertical === "health-body"
          ? "No. These are educational estimates only—not a medical device and not a substitute for a licensed clinician."
          : vertical === "finance-loan"
            ? "No. Lenders use their own rules, fees, and calendars. Treat results as planning math only."
            : vertical === "engineering-electrical"
              ? "No. Codes, safety factors, and installation rules vary by region. Verify with a qualified engineer before designing or modifying systems."
              : "No. Use classroom or professional resources when stakes are high (exams, certifications, or safety).",
    },
    {
      question: "How should I cite or share results?",
      answer:
        "Copy the numbers you need and note the assumptions shown on this page (units, models, rounding). Screenshots decay—bookmark the calculator URL for repeatability.",
    },
    {
      question: "What if I see a surprising value?",
      answer:
        "Double-check units (V vs mV, kW vs W, hours vs minutes) and input signs. Many engineering and finance mistakes are unit or sign errors.",
    },
  ];
}

export function buildHubSeoDefinition(args: {
  slug: string;
  title: string;
  shortTitle?: string;
  category: CalculatorCategory;
  subCategorySlug: string;
  vertical: "engineering-electrical" | "health-body" | "education-math" | "finance-loan";
}): CalculatorDefinition {
  const shortTitle =
    args.shortTitle ??
    args.title.replace(/\s+calculator$/i, "").replace(/\s+\([^)]+\)\s*$/i, "").slice(0, 56);
  const stem = args.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const slugWords = args.slug.replace(/-/g, " ");
  const keywords = Array.from(
    new Set([
      stem,
      `${stem} online`,
      slugWords,
      `${slugWords} calculator`,
      "mywebcalculator",
      args.vertical === "engineering-electrical"
        ? "electrical calculator"
        : args.vertical === "health-body"
          ? "body calculator"
          : args.vertical === "finance-loan"
            ? "EMI calculator"
            : "math calculator",
    ]),
  ).slice(0, 12);

  const longIntro =
    args.vertical === "engineering-electrical"
      ? `Interactive ${args.title.toLowerCase()} for study and estimation. Review the formula notes and assumptions below, then adjust inputs to match your scenario.`
      : args.vertical === "health-body"
        ? `${args.title}: educational estimator with clear limitations. Read the wellness disclaimer and compare trends only with professional context when decisions matter.`
        : args.vertical === "finance-loan"
          ? `${args.title} using the same reducing-balance amortization engine as our core EMI tools—framed for this loan type with product-specific guidance in the article below.`
          : `${args.title} with step-by-step numeric results, reference tables, and links to related math tools in the mathematics hub.`;

  return {
    slug: args.slug,
    title: args.title.endsWith("Calculator") || args.title.includes("Calculator")
      ? args.title
      : `${args.title}`,
    shortTitle,
    category: args.category,
    subCategorySlug: args.subCategorySlug,
    description: `Free online ${stem} with transparent formulas and client-side computation.`,
    longDescription: longIntro,
    keywords,
    faq: baseFaq(args.vertical),
  };
}
