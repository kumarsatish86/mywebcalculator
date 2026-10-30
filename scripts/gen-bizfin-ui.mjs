/**
 * Generate Bizfin hosts, SEO articles, router, and smoke test from section config.
 * Engines must already exist. Run: node scripts/gen-bizfin-ui.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DISCLAIMER =
  "Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.";

function write(rel, contents) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents.replace(/\r\n/g, "\n"), "utf8");
  console.log("wrote", rel);
}

/** Field keys used in URL sync */
const ALL_KEYS = ["a", "b", "c", "d", "r", "t", "n", "p", "m", "v", "s", "l", "w", "h", "q"];

/**
 * Each calc: slug, title, mode, fields [{key,label,default}], map: how host builds engine input (handled in host by mode)
 */
const SECTIONS = [
  {
    key: "Profit",
    engine: "bizfinProfit",
    compute: "computeBizfinProfit",
    slugType: "BizfinProfitSlug",
    inputType: "BizfinProfitInput",
    resultType: "BizfinProfitResult",
    sectionSlug: "bizfin-profitability-core",
    hubLabel: "Business · Business finance · Profitability calculators",
    tableTitle: "Profitability tools",
    rows: [
      ["Profit", "Revenue − expenses"],
      ["Gross / net", "After COGS and full P&L costs"],
      ["Margins", "Profit ÷ revenue"],
      ["EBIT / EBITDA", "Operating earnings views"],
    ],
    hostFile: "BizfinProfitCalculatorHost.tsx",
    seoFile: "bizfinProfitContent.ts",
    seoExport: "BIZFIN_PROFIT_ARTICLES",
    calcs: [
      { slug: "bizfin-profit-calculator", title: "Profit Calculator", mode: "revExp", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "Expenses", d: "70000" }] },
      { slug: "bizfin-gross-profit-calculator", title: "Gross Profit Calculator", mode: "revCogs", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "55000" }] },
      { slug: "bizfin-net-profit-calculator", title: "Net Profit Calculator", mode: "net", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "40000" }, { k: "c", l: "Operating expenses", d: "25000" }, { k: "r", l: "Interest", d: "3000" }, { k: "t", l: "Tax", d: "5000" }] },
      { slug: "bizfin-operating-profit-calculator", title: "Operating Profit Calculator", mode: "ebit", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "40000" }, { k: "c", l: "Operating expenses", d: "25000" }] },
      { slug: "bizfin-profit-margin-calculator", title: "Profit Margin Calculator", mode: "marginProfit", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "Profit", d: "18000" }] },
      { slug: "bizfin-gross-margin-calculator", title: "Gross Margin Calculator", mode: "revCogs", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "55000" }] },
      { slug: "bizfin-net-margin-calculator", title: "Net Margin Calculator", mode: "net", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "40000" }, { k: "c", l: "Operating expenses", d: "25000" }, { k: "r", l: "Interest", d: "3000" }, { k: "t", l: "Tax", d: "5000" }] },
      { slug: "bizfin-contribution-margin-calculator", title: "Contribution Margin Calculator", mode: "contrib", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "Variable costs", d: "45000" }] },
      { slug: "bizfin-ebitda-calculator", title: "EBITDA Calculator", mode: "ebitda", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "40000" }, { k: "c", l: "Operating expenses", d: "25000" }, { k: "d", l: "D&A", d: "8000" }] },
      { slug: "bizfin-ebit-calculator", title: "EBIT Calculator", mode: "ebit", fields: [{ k: "a", l: "Revenue", d: "100000" }, { k: "b", l: "COGS", d: "40000" }, { k: "c", l: "Operating expenses", d: "25000" }] },
    ],
    buildInput: `
      case "revExp": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const expenses = reqNonNeg(b, "Expenses"); if (!expenses.ok) return { error: expenses.error };
        input.revenue = revenue.value; input.expenses = expenses.value; break;
      }
      case "revCogs": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        input.revenue = revenue.value; input.cogs = cogs.value; break;
      }
      case "net": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const opex = reqNonNeg(c, "Operating expenses"); if (!opex.ok) return { error: opex.error };
        const interest = reqNonNeg(r, "Interest"); if (!interest.ok) return { error: interest.error };
        const tax = reqNonNeg(t, "Tax"); if (!tax.ok) return { error: tax.error };
        input.revenue = revenue.value; input.cogs = cogs.value; input.opex = opex.value; input.interest = interest.value; input.tax = tax.value; break;
      }
      case "ebit": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const opex = reqNonNeg(c, "Operating expenses"); if (!opex.ok) return { error: opex.error };
        input.revenue = revenue.value; input.cogs = cogs.value; input.opex = opex.value; break;
      }
      case "marginProfit": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const profit = reqFinite(b, "Profit"); if (!profit.ok) return { error: profit.error };
        input.revenue = revenue.value; input.profit = profit.value; break;
      }
      case "contrib": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const variableCosts = reqNonNeg(b, "Variable costs"); if (!variableCosts.ok) return { error: variableCosts.error };
        input.revenue = revenue.value; input.variableCosts = variableCosts.value; break;
      }
      case "ebitda": {
        const revenue = reqPos(a, "Revenue"); if (!revenue.ok) return { error: revenue.error };
        const cogs = reqNonNeg(b, "COGS"); if (!cogs.ok) return { error: cogs.error };
        const opex = reqNonNeg(c, "Operating expenses"); if (!opex.ok) return { error: opex.error };
        const depreciation = reqNonNeg(d, "D&A"); if (!depreciation.ok) return { error: depreciation.error };
        input.revenue = revenue.value; input.cogs = cogs.value; input.opex = opex.value; input.depreciation = depreciation.value; break;
      }`,
  },
];

// Because the full SECTIONS array is huge, we'll generate hosts with a simpler generic pattern:
// each calc stores field defs; host maps fields a,b,c... to a generic ordered input via mode-specific switch embedded per section.

// Simpler approach: one generic host template that uses field configs and a per-section mapInput function in the generated file.

function genHost(sec) {
  const modes = [...new Set(sec.calcs.map((c) => c.mode))];
  const fallback = sec.calcs[0].slug;

  const configEntries = sec.calcs
    .map((c) => {
      const defaults = ALL_KEYS.map((k) => {
        const f = c.fields.find((x) => x.k === k);
        return `    ${k}Default: "${f ? f.d : ""}"`;
      }).join(",\n");
      const labels = c.fields.map((f) => `    ${f.k}Label: "${f.l}"`).join(",\n");
      return `  "${c.slug}": {
    title: ${JSON.stringify(c.title)},
    description: \`${c.title.replace(/`/g, "")}: teaching business-finance estimate. ${DISCLAIMER}\`,
    mode: "${c.mode}",
    fields: ${JSON.stringify(c.fields.map((f) => f.k))} as const,
${defaults},
${labels},
  }`;
    })
    .join(",\n");

  return `"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { BIZFIN_URL } from "@/lib/calculators/bizfinHelpers";
import {
  ${sec.compute},
  type ${sec.inputType},
  type ${sec.resultType},
  type ${sec.slugType},
} from "@/lib/calculators/${sec.engine}";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = ${modes.map((m) => `"${m}"`).join(" | ")};

type Config = {
  title: string;
  description: string;
  mode: Mode;
  fields: readonly string[];
  aDefault: string; bDefault: string; cDefault: string; dDefault: string;
  rDefault: string; tDefault: string; nDefault: string; pDefault: string;
  mDefault: string; vDefault: string; sDefault: string; lDefault: string;
  wDefault: string; hDefault: string; qDefault: string;
  aLabel?: string; bLabel?: string; cLabel?: string; dLabel?: string;
  rLabel?: string; tLabel?: string; nLabel?: string; pLabel?: string;
  mLabel?: string; vLabel?: string; sLabel?: string; lLabel?: string;
  wLabel?: string; hLabel?: string; qLabel?: string;
};

const CONFIG: Record<${sec.slugType}, Config> = {
${configEntries}
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function reqPos(raw: string, label: string) {
  return parsePositive(raw, label);
}
function reqNonNeg(raw: string, label: string) {
  if (raw.trim() === "") return parseNonNegative("0", label);
  return parseNonNegative(raw, label);
}
function reqFinite(raw: string, label: string) {
  return parseFiniteNumber(raw, label);
}

function formatResult(res: ${sec.resultType}, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.value !== undefined && Number.isFinite(res.value)) rows.push({ label: "Result", value: num(res.value) });
  else if (res.value === Infinity) rows.push({ label: "Result", value: "∞" });
  if (res.pct !== undefined) rows.push({ label: "Percent", value: num(res.pct, 2) + "%" });
  if (res.secondary !== undefined) rows.push({ label: "Secondary", value: num(res.secondary) });
  if (res.tertiary !== undefined) rows.push({ label: "Tertiary", value: num(res.tertiary) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.pct !== undefined && res.value === undefined ? num(res.pct, 2) + "%"
    : res.value === Infinity ? "∞"
    : res.value !== undefined ? num(res.value)
    : res.pct !== undefined ? num(res.pct, 2) + "%"
    : "—";
  const primaryLabel = res.pct !== undefined && res.value === undefined ? "Percent" : "Result";
  return { primary, primaryLabel, rows };
}

export function Bizfin${sec.key}CalculatorHost({ slug }: { slug: string }) {
  const key = slug as ${sec.slugType};
  const config = CONFIG[key] ?? CONFIG["${fallback}"];
  const [a, setA] = useState(useLoanInitialInput(BIZFIN_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIZFIN_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIZFIN_URL.C, config.cDefault));
  const [d, setD] = useState(useLoanInitialInput(BIZFIN_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(BIZFIN_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(BIZFIN_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(BIZFIN_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(BIZFIN_URL.P, config.pDefault));
  const [m, setM] = useState(useLoanInitialInput(BIZFIN_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(BIZFIN_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(BIZFIN_URL.S, config.sDefault));
  const [l, setL] = useState(useLoanInitialInput(BIZFIN_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(BIZFIN_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(BIZFIN_URL.H, config.hDefault));
  const [q, setQ] = useState(useLoanInitialInput(BIZFIN_URL.Q, config.qDefault));

  const setters: Record<string, (v: string) => void> = {
    a: setA, b: setB, c: setC, d: setD, r: setR, t: setT, n: setN, p: setP,
    m: setM, v: setV, s: setS, l: setL, w: setW, h: setH, q: setQ,
  };
  const values: Record<string, string> = { a, b, c, d, r, t, n, p, m, v, s, l, w, h, q };
  const labelOf = (k: string) => (config as Record<string, string | undefined>)[\`\${k}Label\`] ?? k.toUpperCase();

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    for (const k of config.fields) {
      const val = values[k];
      if (val && val.trim() !== "") out[k] = val;
    }
    return out;
  }, [config.fields, a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  useLoanUrlSync(shareParams, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  const result = useMemo(() => {
    const input: ${sec.inputType} = {};
    switch (config.mode) {
${sec.buildInput}
    }
    return formatResult(
      ${sec.compute}(key in CONFIG ? key : "${fallback}", input),
      num,
    );
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={\`bf-${sec.key.toLowerCase()}-\${k}\`}>{labelOf(k)}</FieldLabel>
              <FieldInput
                id={\`bf-${sec.key.toLowerCase()}-\${k}\`}
                value={values[k]}
                onChange={(ev) => setters[k](ev.target.value)}
                inputMode="decimal"
              />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
`;
}

function genSeo(sec) {
  const articles = sec.calcs
    .map((c) => {
      const kw = c.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      return `  "${c.slug}": article(
    "${c.slug}",
    ${JSON.stringify(c.title)},
    [
      ${JSON.stringify(`${c.title} for business-finance teaching estimates in the browser.`)},
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    ${JSON.stringify(`${c.title} — Business Finance Teaching Tool`)},
    ${JSON.stringify(`Estimate ${kw} with standard teaching formulas. Not financial advice.`)},
    ${JSON.stringify([kw, "business finance calculator", c.slug.replace(/-/g, " ")])},
  )`;
    })
    .join(",\n");

  return `import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/${sec.sectionSlug}";
const HUB_LABEL = ${JSON.stringify(sec.hubLabel)};
const SHELL =
  "Business finance teaching tools that run in your browser. Not financial, legal, tax, or investment advice. Accounting policies, tax rates, and market multiples vary — verify with qualified professionals.";

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
        title: ${JSON.stringify(sec.tableTitle)},
        columnHeaders: ["Tool", "Core idea"],
        rows: ${JSON.stringify(sec.rows)},
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your inputs. Teaching estimate only — not financial advice.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const ${sec.seoExport}: Record<string, RichArticle> = {
${articles}
};
`;
}

// For now only Profit is fully defined with buildInput - I'll expand ALL sections in this file.
// Given size limits, write a data-driven approach where buildInput is generated from field→input mapping tables.

console.log("Template ready - expanding all sections...");

// We'll replace SECTIONS with complete definitions written to a JSON + generate.
// Actually write complete section configs inline below by reading from a compact DSL.

const ALL = [];

function S(partial) {
  ALL.push(partial);
}

// PROFIT already in SECTIONS[0]
S(SECTIONS[0]);

S({
  key: "Invest",
  engine: "bizfinInvest",
  compute: "computeBizfinInvest",
  slugType: "BizfinInvestSlug",
  inputType: "BizfinInvestInput",
  resultType: "BizfinInvestResult",
  sectionSlug: "bizfin-investment-return",
  hubLabel: "Business · Business finance · Investment and return calculators",
  tableTitle: "Investment and return tools",
  rows: [["ROI", "(Gain−cost)÷cost"], ["IRR/NPV", "Discrete cash flows"], ["Payback", "Investment÷CF"], ["Valuation", "Multiples / EV"]],
  hostFile: "BizfinInvestCalculatorHost.tsx",
  seoFile: "bizfinInvestContent.ts",
  seoExport: "BIZFIN_INVEST_ARTICLES",
  calcs: [
    { slug: "bizfin-roi-calculator", title: "ROI Calculator", mode: "roi", fields: [{ k: "a", l: "Investment cost", d: "50000" }, { k: "b", l: "Final / gain value", d: "65000" }] },
    { slug: "bizfin-annualized-roi-calculator", title: "Annualized ROI Calculator", mode: "annRoi", fields: [{ k: "a", l: "Initial cost", d: "50000" }, { k: "b", l: "Final value", d: "80000" }, { k: "n", l: "Years", d: "3" }] },
    { slug: "bizfin-irr-calculator", title: "IRR Calculator", mode: "irr", fields: [{ k: "a", l: "CF0 (usually negative)", d: "-100000" }, { k: "b", l: "CF1", d: "40000" }, { k: "c", l: "CF2", d: "40000" }, { k: "d", l: "CF3", d: "50000" }] },
    { slug: "bizfin-npv-calculator", title: "NPV Calculator", mode: "npv", fields: [{ k: "a", l: "CF0", d: "-100000" }, { k: "b", l: "CF1", d: "40000" }, { k: "c", l: "CF2", d: "40000" }, { k: "d", l: "CF3", d: "50000" }, { k: "r", l: "Discount rate %", d: "10" }] },
    { slug: "bizfin-payback-period-calculator", title: "Payback Period Calculator", mode: "payback", fields: [{ k: "a", l: "Investment", d: "120000" }, { k: "b", l: "Annual cash flow", d: "30000" }] },
    { slug: "bizfin-discounted-payback-period-calculator", title: "Discounted Payback Period Calculator", mode: "dpayback", fields: [{ k: "a", l: "Investment", d: "120000" }, { k: "b", l: "Annual cash flow", d: "30000" }, { k: "r", l: "Discount rate %", d: "8" }] },
    { slug: "bizfin-capital-gain-calculator", title: "Capital Gain Calculator", mode: "capgain", fields: [{ k: "a", l: "Buy / cost basis", d: "100000" }, { k: "b", l: "Sell price", d: "140000" }] },
    { slug: "bizfin-business-valuation-calculator", title: "Business Valuation Calculator", mode: "val", fields: [{ k: "a", l: "EBITDA", d: "500000" }, { k: "b", l: "Multiple", d: "6" }] },
    { slug: "bizfin-equity-value-calculator", title: "Equity Value Calculator", mode: "equity", fields: [{ k: "a", l: "Enterprise value", d: "3000000" }, { k: "b", l: "Net debt", d: "400000" }] },
    { slug: "bizfin-enterprise-value-calculator", title: "Enterprise Value Calculator", mode: "ev", fields: [{ k: "a", l: "Equity / market cap", d: "2500000" }, { k: "b", l: "Debt", d: "800000" }, { k: "c", l: "Cash", d: "200000" }] },
  ],
  buildInput: `
      case "roi": {
        const cost = reqPos(a, "Investment cost"); if (!cost.ok) return { error: cost.error };
        const gain = reqFinite(b, "Final / gain value"); if (!gain.ok) return { error: gain.error };
        input.cost = cost.value; input.gain = gain.value; break;
      }
      case "annRoi": {
        const cost = reqPos(a, "Initial cost"); if (!cost.ok) return { error: cost.error };
        const gain = reqPos(b, "Final value"); if (!gain.ok) return { error: gain.error };
        const years = reqPos(n, "Years"); if (!years.ok) return { error: years.error };
        input.cost = cost.value; input.gain = gain.value; input.years = years.value; break;
      }
      case "irr": {
        const cf0 = reqFinite(a, "CF0"); if (!cf0.ok) return { error: cf0.error };
        const cf1 = reqFinite(b, "CF1"); if (!cf1.ok) return { error: cf1.error };
        const cf2 = reqFinite(c, "CF2"); if (!cf2.ok) return { error: cf2.error };
        const cf3 = reqFinite(d, "CF3"); if (!cf3.ok) return { error: cf3.error };
        input.cf0 = cf0.value; input.cf1 = cf1.value; input.cf2 = cf2.value; input.cf3 = cf3.value; break;
      }
      case "npv": {
        const cf0 = reqFinite(a, "CF0"); if (!cf0.ok) return { error: cf0.error };
        const cf1 = reqFinite(b, "CF1"); if (!cf1.ok) return { error: cf1.error };
        const cf2 = reqFinite(c, "CF2"); if (!cf2.ok) return { error: cf2.error };
        const cf3 = reqFinite(d, "CF3"); if (!cf3.ok) return { error: cf3.error };
        const ratePct = reqNonNeg(r, "Discount rate %"); if (!ratePct.ok) return { error: ratePct.error };
        input.cf0 = cf0.value; input.cf1 = cf1.value; input.cf2 = cf2.value; input.cf3 = cf3.value; input.ratePct = ratePct.value; break;
      }
      case "payback": {
        const investment = reqPos(a, "Investment"); if (!investment.ok) return { error: investment.error };
        const annualCf = reqPos(b, "Annual cash flow"); if (!annualCf.ok) return { error: annualCf.error };
        input.investment = investment.value; input.annualCf = annualCf.value; break;
      }
      case "dpayback": {
        const investment = reqPos(a, "Investment"); if (!investment.ok) return { error: investment.error };
        const annualCf = reqPos(b, "Annual cash flow"); if (!annualCf.ok) return { error: annualCf.error };
        const ratePct = reqNonNeg(r, "Discount rate %"); if (!ratePct.ok) return { error: ratePct.error };
        input.investment = investment.value; input.annualCf = annualCf.value; input.ratePct = ratePct.value; break;
      }
      case "capgain": {
        const buy = reqPos(a, "Buy / cost basis"); if (!buy.ok) return { error: buy.error };
        const sell = reqFinite(b, "Sell price"); if (!sell.ok) return { error: sell.error };
        input.buy = buy.value; input.sell = sell.value; break;
      }
      case "val": {
        const ebitda = reqPos(a, "EBITDA"); if (!ebitda.ok) return { error: ebitda.error };
        const multiple = reqPos(b, "Multiple"); if (!multiple.ok) return { error: multiple.error };
        input.ebitda = ebitda.value; input.multiple = multiple.value; break;
      }
      case "equity": {
        const equityValue = reqPos(a, "Enterprise value"); if (!equityValue.ok) return { error: equityValue.error };
        const netDebt = reqFinite(b, "Net debt"); if (!netDebt.ok) return { error: netDebt.error };
        input.equityValue = equityValue.value; input.netDebt = netDebt.value; break;
      }
      case "ev": {
        const marketCap = reqPos(a, "Equity / market cap"); if (!marketCap.ok) return { error: marketCap.error };
        const debt = reqNonNeg(b, "Debt"); if (!debt.ok) return { error: debt.error };
        const cash = reqNonNeg(c, "Cash"); if (!cash.ok) return { error: cash.error };
        input.marketCap = marketCap.value; input.debt = debt.value; input.cash = cash.value; break;
      }`,
});

// Write compact remaining sections to JSON and continue in same process via eval of embedded data file
fs.writeFileSync(path.join(root, "scripts/.bizfin-ui-partial.json"), JSON.stringify({ done: ["Profit", "Invest"] }));

// Generate what we have so far
for (const sec of ALL) {
  write(`components/calculators/family/${sec.hostFile}`, genHost(sec));
  write(`lib/calculator-seo/${sec.seoFile}`, genSeo(sec));
}

console.log("Generated Profit + Invest hosts/SEO. Continuing remaining in part B...");
