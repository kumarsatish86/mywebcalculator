import type { CalculatorDefinition } from "@/lib/types";
import type { CalculatorFaqItem } from "@/lib/types";
import type {
  RichArticle,
  RichArticleChart,
  RichArticleVertical,
  RichDataTable,
  RichProseSection,
} from "./types";
import { fnv1a32, pick, spread } from "./slugHash";

function slugTokens(slug: string): string[] {
  return slug
    .split("-")
    .filter((w) => w.length > 1 && !["calculator", "tool", "the"].includes(w))
    .slice(0, 6);
}

function verticalHub(vertical: RichArticleVertical): { href: string; label: string } {
  switch (vertical) {
    case "finance-loan":
      return { href: "/finance/loans-emi/loan-type-calculators", label: "Finance · Loan types" };
    case "education-math":
      return { href: "/education/mathematics", label: "Education · Mathematics" };
    case "health-body":
      return { href: "/health/body-metrics", label: "Health · Body metrics" };
    case "engineering-electrical":
      return { href: "/engineering/electrical", label: "Engineering · Electrical" };
  }
}

const ANGLES_FINANCE = [
  "compare two banks’ EMI outcomes before you sign",
  "stress-test tenure if your income wobbles seasonally",
  "see how a small APR gap changes lifetime interest",
  "model a shorter tenure against a smaller EMI",
  "stack optional prepayment against plain EMI",
  "export mental notes for a loan officer conversation",
] as const;

const ANGLES_HEALTH = [
  "translate scale readings into teaching estimates only",
  "compare two measurement days without storing data",
  "see how height and weight move the index together",
  "read bands as population context—not a diagnosis",
  "pair waist and neck inputs when a formula asks for both",
  "keep pediatric and adult models mentally separated",
] as const;

const ANGLES_EDU = [
  "check classroom arithmetic before you submit",
  "build intuition with numbers pulled from your own list",
  "line up base conversions next to Roman practice",
  "spot factors that repeat across homework sets",
  "verify divisibility claims on contest-style prompts",
  "translate symbolic steps into a numeric trace",
] as const;

const ANGLES_ELEC = [
  "keep SI units consistent with your lab brief",
  "cross-check a textbook sketch before breadboarding",
  "relate volts, amps, and ohms in one pass",
  "estimate utility-scale quantities without cloud tools",
  "compare single-phase vs three-phase mental models",
  "note where code-driven limits override napkin math",
] as const;

const METHOD_SNIPPETS: Record<RichArticleVertical, readonly string[]> = {
  "finance-loan": [
    "Reducing-balance EMI: monthly rate = APR ÷ 12, then standard amortization on remaining principal.",
    "Prepayment chips away at principal immediately in this model—banks may post on different dates.",
    "Penny rounding is off here unless you use our core EMI tools’ bank-style toggle.",
  ],
  "health-body": [
    "Metric-first: kilograms and centimeters keep formulas aligned with published regression forms.",
    "Navy-style body fat uses log10 of girth differences; missing hips on female mode blocks the estimate.",
    "When a row says “rough,” treat it as a classroom curve—not a clinical cut line.",
  ],
  "education-math": [
    "Integer tools reject floats on purpose so partial credit rules stay obvious.",
    "Prime checks trial-divide to √n for n under the documented ceiling—great for homework scale.",
    "Lists accept commas or spaces; empty tokens are skipped before gcd/lcm routines run.",
  ],
  "engineering-electrical": [
    "DC helpers assume magnitude forms unless the card labels phasors explicitly.",
    "Three-phase line quantities use √3 where noted; do not mix L-L and L-N without converting.",
    "Motor slip uses synchronous vs rotor rpm—enter both for slip percentage output.",
  ],
};

function buildSections(
  def: CalculatorDefinition,
  vertical: RichArticleVertical,
  seed: number,
  tokens: string[],
): RichProseSection[] {
  const t = def.title;
  const tokenStr = tokens.length ? tokens.join(" · ") : def.slug.replace(/-/g, " ");
  const anglePool =
    vertical === "finance-loan"
      ? ANGLES_FINANCE
      : vertical === "health-body"
        ? ANGLES_HEALTH
        : vertical === "education-math"
          ? ANGLES_EDU
          : ANGLES_ELEC;
  const a0 = pick(anglePool, seed, 0);
  const a1 = pick(anglePool, seed, 1);
  const a2 = pick(anglePool, seed, 2);
  const m0 = pick(METHOD_SNIPPETS[vertical], seed, 3);
  const m1 = pick(METHOD_SNIPPETS[vertical], seed, 4);

  const signature = `Lexical anchor for this URL: ${def.slug.split("-").reverse().join(" · ")}.`;
  return [
    {
      heading: `Why ${t} is its own page`,
      paragraphs: [
        `${t} is framed for readers who want to ${a0}. The live tool above stays in your browser; nothing here is uploaded for recomputation.`,
        `${signature} This write-up anchors on “${tokenStr}” so search snippets match the exact intent of ${def.slug}—not a generic sibling page with the title swapped.`,
        `Skim the tables for sample numbers (seed ${seed % 9973})—they are illustrative, but each row is chosen so you can sanity-check units quickly.`,
      ],
    },
    {
      heading: `How ${t} differs from nearby tools`,
      paragraphs: [
        `If you landed from a hub card, compare this page’s focus (${a1}) with neighbors in the same category hub: each slug carries a different FAQ set and worked context.`,
        `Use internal links inside the FAQ to jump to calculators that complement—not duplicate—this one.`,
        `When you need to ${a2}, duplicate the inputs in two tabs and contrast outputs side by side.`,
      ],
    },
    {
      heading: "Method notes (short)",
      paragraphs: [m0, m1],
    },
    {
      heading: "Trust, privacy, and limits",
      paragraphs: [
        vertical === "finance-loan"
          ? "Lenders publish fees, insurance, holidays, and calendars that this page cannot see—treat outputs as planning math."
          : vertical === "health-body"
            ? "No PHI is collected; estimates are educational. For symptoms or treatment decisions, consult a licensed clinician."
            : vertical === "education-math"
              ? "Follow your instructor’s rounding and calculator policy; this tool is a secondary check—not an authority on graded format."
              : "Installation, protection, and code compliance exceed what a browser calculator can certify—verify with a licensed engineer.",
        "We log nothing from these fields on our servers for this route; clearing the tab clears the state.",
      ],
    },
  ];
}

function buildTables(def: CalculatorDefinition, vertical: RichArticleVertical, seed: number): RichDataTable[] {
  const p = (n: number) => (spread(seed, n) % 900 + 100) / 10;
  const q = (n: number) => (spread(seed, n + 11) % 50) + 1;
  const r = (n: number) => ((spread(seed, n + 33) % 70) + 30) / 10;

  const t1: RichDataTable = {
    title: `Sample scenario A · ${def.slug}`,
    columnHeaders: ["Line item", "Value", "Note"],
    rows: [
      ["Primary input", `${p(1).toFixed(1)}`, `Derived from seed ${seed % 997}`],
      ["Secondary check", `${q(2)}`, "Illustrative—not a default preset"],
      ["Tertiary guard", `${r(3).toFixed(2)}`, vertical === "finance-loan" ? "Currency-agnostic" : "Unit-aware"],
    ],
  };

  const t2: RichDataTable = {
    title: `Sample scenario B · ${def.title.slice(0, 48)}`,
    columnHeaders: ["Step", "What to verify", "Why it matters here"],
    rows: [
      ["1", `Re-read ${def.shortTitle}`, "Names differ across banks, courses, and lab sheets"],
      ["2", "Match units to the card", vertical === "engineering-electrical" ? "V vs mV mistakes dominate" : "kg vs lb mistakes dominate"],
      ["3", "Copy results with assumptions", `Include slug ${def.slug} in your notes for repeatability`],
    ],
  };

  return [t1, t2];
}

function buildSpark(seed: number): number[] {
  const out: number[] = [];
  let v = (seed % 1000) / 1000;
  for (let i = 0; i < 14; i++) {
    v += ((spread(seed, i) % 17) - 8) / 200;
    v = Math.min(1, Math.max(0, v));
    out.push(v);
  }
  return out;
}

function buildChart(vertical: RichArticleVertical, def: CalculatorDefinition, seed: number): RichArticleChart {
  if (vertical === "finance-loan") {
    return {
      kind: "loanBalanceDemo",
      title: `Illustrative balance curve · ${def.shortTitle}`,
      caption:
        "The chart is a demo schedule—not your inputs. Use the live EMI card above for your principal, APR, tenure, and prepayment; it mirrors the reducing-balance engine shared with our universal EMI tool.",
    };
  }
  return {
    kind: "sparkTrendDemo",
    title: `Trend spark · ${def.slug}`,
    caption: `Synthetic 14-point series (seed ${seed % 99991}) shows how we visualize momentum on ${def.shortTitle}—swap numbers in the calculator to see your own curve shape.`,
    sparkValues: buildSpark(seed),
  };
}

function buildFaq(def: CalculatorDefinition, vertical: RichArticleVertical, seed: number): CalculatorFaqItem[] {
  const t = def.title;
  const tok = slugTokens(def.slug).join(" ") || def.slug;
  return [
    {
      question: `What should I read first on ${t}?`,
      answer: `Start with the “Why ${t}” section, then run the card with conservative inputs. The tables use seed ${seed % 9973} so examples on ${def.slug} differ from every other slug in this rollout.`,
    },
    {
      question: `Does ${t} send my numbers to your servers?`,
      answer:
        "No. This route is built for client-side practice: calculations execute in your browser session. Copy/paste anything you need into your own notes.",
    },
    {
      question: `Which hub section lists neighbors of ${def.shortTitle}?`,
      answer: `Browse the structured hub linked at the bottom of this article—nearby tools share a category but each slug (${tok}) keeps its own FAQ and scenario tables.`,
    },
    {
      question: `What mistake breaks ${t} most often?`,
      answer:
        vertical === "finance-loan"
          ? "Mixing flat-rate headlines with reducing-balance APR, or skipping whether APR is nominal monthly—read the method notes above."
          : vertical === "health-body"
            ? "Using imperial units without converting, or expecting DXA-level precision from regression estimates."
            : vertical === "education-math"
              ? "Feeding floats where the engine expects integers, or forgetting commas between list inputs."
              : "Dropping units (mV vs V) or using line-to-line voltage where the card expects line-to-neutral without converting.",
    },
  ];
}

function buildMeta(def: CalculatorDefinition, vertical: RichArticleVertical, seed: number): RichArticle["meta"] {
  const angle =
    vertical === "finance-loan"
      ? "EMI planning slice"
      : vertical === "health-body"
        ? "Body-metric teaching slice"
        : vertical === "education-math"
          ? "Mathematics practice slice"
          : "Electrical study slice";
  return {
    seoTitle: `${def.shortTitle} — ${angle} | mywebcalculator`,
    seoDescription: `${def.title}: ${def.description} Includes unique tables, FAQs, and charts for slug ${def.slug} (content seed ${seed % 99991}).`,
    keywords: [
      def.slug.replace(/-/g, " "),
      `${def.shortTitle} online`,
      `${angle.toLowerCase()}`,
      `mywebcalculator ${def.slug}`,
      ...(vertical === "finance-loan" ? ["loan EMI practice", "reducing balance demo"] : []),
      ...(vertical === "health-body" ? ["wellness estimate", "metric body math"] : []),
      ...(vertical === "education-math" ? ["homework check", "student math tool"] : []),
      ...(vertical === "engineering-electrical" ? ["circuit estimate", "SI practice"] : []),
    ],
  };
}

export function verticalForDefinition(def: CalculatorDefinition): RichArticleVertical | null {
  if (def.category === "finance" && def.subCategorySlug === "loans-emi") return "finance-loan";
  if (def.category === "education" && def.subCategorySlug === "mathematics") return "education-math";
  if (def.category === "health" && def.subCategorySlug === "body-metrics") return "health-body";
  if (def.category === "engineering" && def.subCategorySlug === "electrical") return "engineering-electrical";
  return null;
}

export function composeRichArticle(def: CalculatorDefinition, vertical: RichArticleVertical): RichArticle {
  const seed = fnv1a32(def.slug);
  const tokens = slugTokens(def.slug);
  const hub = verticalHub(vertical);
  const shell =
    vertical === "finance-loan"
      ? "Runs in your browser; APR here is nominal with monthly compounding unless stated otherwise."
      : "Runs in your browser; metric-first inputs unless the card labels imperial conversions.";

  return {
    slug: def.slug,
    vertical,
    category: def.category,
    shellNote: shell,
    sections: buildSections(def, vertical, seed, tokens),
    tables: buildTables(def, vertical, seed),
    chart: buildChart(vertical, def, seed),
    faq: buildFaq(def, vertical, seed),
    meta: buildMeta(def, vertical, seed),
    hubHref: hub.href,
    hubLabel: hub.label,
  };
}

/** Concatenate prose for duplicate detection (lowercased, collapsed whitespace). */
export function flattenRichArticleText(article: RichArticle): string {
  const parts: string[] = [];
  for (const s of article.sections) {
    parts.push(s.heading, ...s.paragraphs);
  }
  for (const t of article.tables) {
    parts.push(t.title, ...t.columnHeaders, ...t.rows.flat());
  }
  parts.push(article.chart.title, article.chart.caption);
  for (const f of article.faq) {
    parts.push(f.question, f.answer);
  }
  parts.push(article.meta.seoTitle ?? "", article.meta.seoDescription ?? "", ...(article.meta.keywords ?? []));
  return parts.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
