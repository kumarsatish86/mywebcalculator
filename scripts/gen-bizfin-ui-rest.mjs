/**
 * Generate remaining Bizfin hosts + SEO (Cost through Advanced) + router + smoke test.
 * Run: node scripts/gen-bizfin-ui-rest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DISCLAIMER =
  "Teaching estimate only — not financial, tax, or investment advice. Verify with your accountant or advisor.";
const ALL_KEYS = ["a", "b", "c", "d", "r", "t", "n", "p", "m", "v", "s", "l", "w", "h", "q"];

function write(rel, contents) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents.replace(/\r\n/g, "\n"), "utf8");
  console.log("wrote", rel);
}

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

function reqPos(raw: string, label: string) { return parsePositive(raw, label); }
function reqNonNeg(raw: string, label: string) {
  if (raw.trim() === "") return parseNonNegative("0", label);
  return parseNonNegative(raw, label);
}
function reqFinite(raw: string, label: string) { return parseFiniteNumber(raw, label); }

function formatResult(res: ${sec.resultType}, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.value !== undefined && Number.isFinite(res.value)) rows.push({ label: "Result", value: num(res.value) });
  else if (res.value === Infinity) rows.push({ label: "Result", value: "∞" });
  if (res.pct !== undefined) rows.push({ label: "Percent", value: num(res.pct, 2) + "%" });
  if (res.secondary !== undefined) rows.push({ label: "Secondary", value: Number.isFinite(res.secondary) ? num(res.secondary) : String(res.secondary) });
  if (res.tertiary !== undefined) rows.push({ label: "Tertiary", value: num(res.tertiary) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.pct !== undefined && res.value === undefined ? num(res.pct, 2) + "%"
    : res.value === Infinity ? "∞"
    : res.value !== undefined ? num(res.value)
    : res.pct !== undefined ? num(res.pct, 2) + "%"
    : "—";
  return { primary, primaryLabel: res.pct !== undefined && res.value === undefined ? "Percent" : "Result", rows };
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.fields, a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  useLoanUrlSync(shareParams, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q]);

  const result = useMemo(() => {
    const input: ${sec.inputType} = {};
    switch (config.mode) {
${sec.buildInput}
    }
    return formatResult(${sec.compute}(key in CONFIG ? key : "${fallback}", input), num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, r, t, n, p, m, v, s, l, w, h, q, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((k) => (
            <div key={k}>
              <FieldLabel htmlFor={\`bf-${sec.key.toLowerCase()}-\${k}\`}>{labelOf(k)}</FieldLabel>
              <FieldInput id={\`bf-${sec.key.toLowerCase()}-\${k}\`} value={values[k]} onChange={(ev) => setters[k](ev.target.value)} inputMode="decimal" />
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
                {result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}
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
    tables: [{ title: ${JSON.stringify(sec.tableTitle)}, columnHeaders: ["Tool", "Core idea"], rows: ${JSON.stringify(sec.rows)} }],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves your inputs. Teaching estimate only — not financial advice." },
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

function f(k, l, d) { return { k, l, d }; }

const SECTIONS = [
  {
    key: "Cost", engine: "bizfinCost", compute: "computeBizfinCost", slugType: "BizfinCostSlug",
    inputType: "BizfinCostInput", resultType: "BizfinCostResult",
    sectionSlug: "bizfin-cost-expense", hubLabel: "Business · Business finance · Cost and expense calculators",
    tableTitle: "Cost and expense tools", rows: [["Break-even", "Fixed ÷ contribution"], ["COGS", "Beg + purchases − end"], ["Unit cost", "Total ÷ units"]],
    hostFile: "BizfinCostCalculatorHost.tsx", seoFile: "bizfinCostContent.ts", seoExport: "BIZFIN_COST_ARTICLES",
    calcs: [
      { slug: "bizfin-cost-price-calculator", title: "Cost Price Calculator", mode: "costPrice", fields: [f("a","Selling price","100"), f("b","Margin %","40")] },
      { slug: "bizfin-selling-price-calculator", title: "Selling Price Calculator", mode: "sellPrice", fields: [f("a","Cost","60"), f("b","Markup %","50")] },
      { slug: "bizfin-break-even-calculator", title: "Break-even Calculator", mode: "be", fields: [f("a","Fixed costs","50000"), f("b","Price per unit","25"), f("c","Variable cost / unit","10")] },
      { slug: "bizfin-fixed-cost-calculator", title: "Fixed Cost Calculator", mode: "fixed", fields: [f("a","Fixed cost A","20000"), f("b","Fixed cost B","15000"), f("c","Fixed cost C","5000")] },
      { slug: "bizfin-variable-cost-calculator", title: "Variable Cost Calculator", mode: "var", fields: [f("a","Variable / unit","8"), f("b","Units","1000")] },
      { slug: "bizfin-total-cost-calculator", title: "Total Cost Calculator", mode: "total", fields: [f("a","Fixed costs","40000"), f("b","Variable total","25000")] },
      { slug: "bizfin-unit-cost-calculator", title: "Unit Cost Calculator", mode: "unit", fields: [f("a","Total cost","65000"), f("b","Units","5000")] },
      { slug: "bizfin-overhead-cost-calculator", title: "Overhead Cost Calculator", mode: "oh", fields: [f("a","Total overhead","12000"), f("b","Units","3000")] },
      { slug: "bizfin-cogs-calculator", title: "COGS Calculator", mode: "cogs", fields: [f("a","Beginning inventory","20000"), f("b","Purchases","80000"), f("c","Ending inventory","15000")] },
      { slug: "bizfin-production-cost-calculator", title: "Production Cost Calculator", mode: "prod", fields: [f("a","Materials","30000"), f("b","Labor","20000"), f("c","Overhead","10000")] },
    ],
    buildInput: `
      case "costPrice": { const sellingPrice = reqPos(a,"Selling price"); if (!sellingPrice.ok) return { error: sellingPrice.error }; const marginPct = reqPos(b,"Margin %"); if (!marginPct.ok) return { error: marginPct.error }; input.sellingPrice = sellingPrice.value; input.marginPct = marginPct.value; break; }
      case "sellPrice": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; input.cost = cost.value; input.markupPct = markupPct.value; break; }
      case "be": { const fixedCosts = reqPos(a,"Fixed costs"); if (!fixedCosts.ok) return { error: fixedCosts.error }; const pricePerUnit = reqPos(b,"Price per unit"); if (!pricePerUnit.ok) return { error: pricePerUnit.error }; const variablePerUnit = reqNonNeg(c,"Variable / unit"); if (!variablePerUnit.ok) return { error: variablePerUnit.error }; input.fixedCosts = fixedCosts.value; input.pricePerUnit = pricePerUnit.value; input.variablePerUnit = variablePerUnit.value; break; }
      case "fixed": { const fixedA = reqNonNeg(a,"Fixed A"); if (!fixedA.ok) return { error: fixedA.error }; const fixedB = reqNonNeg(b,"Fixed B"); if (!fixedB.ok) return { error: fixedB.error }; const fixedC = reqNonNeg(c,"Fixed C"); if (!fixedC.ok) return { error: fixedC.error }; input.fixedA = fixedA.value; input.fixedB = fixedB.value; input.fixedC = fixedC.value; break; }
      case "var": { const variablePerUnit = reqNonNeg(a,"Variable / unit"); if (!variablePerUnit.ok) return { error: variablePerUnit.error }; const units = reqPos(b,"Units"); if (!units.ok) return { error: units.error }; input.variablePerUnit = variablePerUnit.value; input.units = units.value; break; }
      case "total": { const fixedCosts = reqNonNeg(a,"Fixed"); if (!fixedCosts.ok) return { error: fixedCosts.error }; const variableTotal = reqNonNeg(b,"Variable"); if (!variableTotal.ok) return { error: variableTotal.error }; input.fixedCosts = fixedCosts.value; input.variableTotal = variableTotal.value; break; }
      case "unit": { const cost = reqPos(a,"Total cost"); if (!cost.ok) return { error: cost.error }; const units = reqPos(b,"Units"); if (!units.ok) return { error: units.error }; input.cost = cost.value; input.units = units.value; break; }
      case "oh": { const overhead = reqPos(a,"Overhead"); if (!overhead.ok) return { error: overhead.error }; const units = reqPos(b,"Units"); if (!units.ok) return { error: units.error }; input.overhead = overhead.value; input.units = units.value; break; }
      case "cogs": { const beginningInventory = reqNonNeg(a,"Beginning"); if (!beginningInventory.ok) return { error: beginningInventory.error }; const purchases = reqNonNeg(b,"Purchases"); if (!purchases.ok) return { error: purchases.error }; const endingInventory = reqNonNeg(c,"Ending"); if (!endingInventory.ok) return { error: endingInventory.error }; input.beginningInventory = beginningInventory.value; input.purchases = purchases.value; input.endingInventory = endingInventory.value; break; }
      case "prod": { const materials = reqNonNeg(a,"Materials"); if (!materials.ok) return { error: materials.error }; const labor = reqNonNeg(b,"Labor"); if (!labor.ok) return { error: labor.error }; const overhead = reqNonNeg(c,"Overhead"); if (!overhead.ok) return { error: overhead.error }; input.materials = materials.value; input.labor = labor.value; input.overhead = overhead.value; break; }`,
  },
  {
    key: "Pricing", engine: "bizfinPricing", compute: "computeBizfinPricing", slugType: "BizfinPricingSlug",
    inputType: "BizfinPricingInput", resultType: "BizfinPricingResult",
    sectionSlug: "bizfin-pricing", hubLabel: "Business · Business finance · Pricing strategy calculators",
    tableTitle: "Pricing tools", rows: [["Markup/markdown", "% vs cost or list"], ["Elasticity", "%ΔQ÷%ΔP"], ["Value-based", "Value × capture %"]],
    hostFile: "BizfinPricingCalculatorHost.tsx", seoFile: "bizfinPricingContent.ts", seoExport: "BIZFIN_PRICING_ARTICLES",
    calcs: [
      { slug: "bizfin-markup-calculator", title: "Markup Calculator", mode: "markup", fields: [f("a","Cost","40"), f("b","Price","70")] },
      { slug: "bizfin-markdown-calculator", title: "Markdown Calculator", mode: "markdown", fields: [f("a","Original price","100"), f("b","Sale price","75")] },
      { slug: "bizfin-pricing-strategy-calculator", title: "Pricing Strategy Calculator", mode: "strategy", fields: [f("a","Cost","50"), f("b","Cost-plus markup %","40"), f("c","Target margin %","35")] },
      { slug: "bizfin-dynamic-pricing-calculator", title: "Dynamic Pricing Calculator", mode: "dyn", fields: [f("a","Base price","100"), f("b","Demand factor","1.2")] },
      { slug: "bizfin-wholesale-price-calculator", title: "Wholesale Price Calculator", mode: "wholesale", fields: [f("a","Cost","30"), f("b","Wholesale markup %","25")] },
      { slug: "bizfin-retail-price-calculator", title: "Retail Price Calculator", mode: "retail", fields: [f("a","Wholesale","40"), f("b","Retail markup %","50")] },
      { slug: "bizfin-discount-pricing-calculator", title: "Discount Pricing Calculator", mode: "disc", fields: [f("a","List price","120"), f("b","Discount %","15")] },
      { slug: "bizfin-price-elasticity-calculator", title: "Price Elasticity Calculator", mode: "elast", fields: [f("a","% quantity change","20"), f("b","% price change","-10")] },
      { slug: "bizfin-value-based-pricing-calculator", title: "Value-based Pricing Calculator", mode: "value", fields: [f("a","Perceived value","200"), f("b","Value capture %","60")] },
    ],
    buildInput: `
      case "markup": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const price = reqPos(b,"Price"); if (!price.ok) return { error: price.error }; input.cost = cost.value; input.price = price.value; break; }
      case "markdown": { const originalPrice = reqPos(a,"Original"); if (!originalPrice.ok) return { error: originalPrice.error }; const salePrice = reqPos(b,"Sale"); if (!salePrice.ok) return { error: salePrice.error }; input.originalPrice = originalPrice.value; input.salePrice = salePrice.value; break; }
      case "strategy": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; const marginPct = reqPos(c,"Margin %"); if (!marginPct.ok) return { error: marginPct.error }; input.cost = cost.value; input.markupPct = markupPct.value; input.marginPct = marginPct.value; break; }
      case "dyn": { const price = reqPos(a,"Base price"); if (!price.ok) return { error: price.error }; const demandFactor = reqPos(b,"Demand factor"); if (!demandFactor.ok) return { error: demandFactor.error }; input.price = price.value; input.demandFactor = demandFactor.value; break; }
      case "wholesale": { const cost = reqPos(a,"Cost"); if (!cost.ok) return { error: cost.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; input.cost = cost.value; input.markupPct = markupPct.value; break; }
      case "retail": { const wholesale = reqPos(a,"Wholesale"); if (!wholesale.ok) return { error: wholesale.error }; const markupPct = reqNonNeg(b,"Markup %"); if (!markupPct.ok) return { error: markupPct.error }; input.wholesale = wholesale.value; input.markupPct = markupPct.value; break; }
      case "disc": { const price = reqPos(a,"List"); if (!price.ok) return { error: price.error }; const discountPct = reqNonNeg(b,"Discount %"); if (!discountPct.ok) return { error: discountPct.error }; input.price = price.value; input.discountPct = discountPct.value; break; }
      case "elast": { const pctQtyChange = reqFinite(a,"% qty"); if (!pctQtyChange.ok) return { error: pctQtyChange.error }; const pctPriceChange = reqFinite(b,"% price"); if (!pctPriceChange.ok) return { error: pctPriceChange.error }; input.pctQtyChange = pctQtyChange.value; input.pctPriceChange = pctPriceChange.value; break; }
      case "value": { const perceivedValue = reqPos(a,"Value"); if (!perceivedValue.ok) return { error: perceivedValue.error }; const valueCapturePct = reqNonNeg(b,"Capture %"); if (!valueCapturePct.ok) return { error: valueCapturePct.error }; input.perceivedValue = perceivedValue.value; input.valueCapturePct = valueCapturePct.value; break; }`,
  },
];

// Continue adding remaining sections in this array via push to keep file manageable - write to disk in chunks

for (const sec of SECTIONS) {
  write(`components/calculators/family/${sec.hostFile}`, genHost(sec));
  write(`lib/calculator-seo/${sec.seoFile}`, genSeo(sec));
}

// Export helpers for chained scripts
fs.writeFileSync(path.join(root, "scripts/.bizfin-gen-lib.json"), JSON.stringify({ ok: true }));
console.log("Cost + Pricing done. Writing rest via inline continue...");

// Dynamically import continuation by evaluating the rest of sections here
const MORE = [];

function add(sec) { MORE.push(sec); }

add({
  key: "Cash", engine: "bizfinCash", compute: "computeBizfinCash", slugType: "BizfinCashSlug",
  inputType: "BizfinCashInput", resultType: "BizfinCashResult",
  sectionSlug: "bizfin-cash-flow-liquidity", hubLabel: "Business · Business finance · Cash flow and liquidity calculators",
  tableTitle: "Cash and liquidity tools", rows: [["Cash flow", "In − out"], ["FCF", "OCF − CapEx"], ["Ratios", "CA÷CL"]],
  hostFile: "BizfinCashCalculatorHost.tsx", seoFile: "bizfinCashContent.ts", seoExport: "BIZFIN_CASH_ARTICLES",
  calcs: [
    { slug: "bizfin-cash-flow-calculator", title: "Cash Flow Calculator", mode: "cf", fields: [f("a","Inflows","120000"), f("b","Outflows","95000")] },
    { slug: "bizfin-free-cash-flow-calculator", title: "Free Cash Flow Calculator", mode: "fcf", fields: [f("a","Operating cash flow","80000"), f("b","CapEx","25000")] },
    { slug: "bizfin-operating-cash-flow-calculator", title: "Operating Cash Flow Calculator", mode: "ocf", fields: [f("a","Net income","50000"), f("b","D&A","10000"), f("c","Δ Working capital","5000")] },
    { slug: "bizfin-working-capital-calculator", title: "Working Capital Calculator", mode: "wc", fields: [f("a","Current assets","200000"), f("b","Current liabilities","120000")] },
    { slug: "bizfin-cash-conversion-cycle-calculator", title: "Cash Conversion Cycle Calculator", mode: "ccc", fields: [f("a","DIO","45"), f("b","DSO","30"), f("c","DPO","25")] },
    { slug: "bizfin-liquidity-ratio-calculator", title: "Liquidity Ratio Calculator", mode: "current", fields: [f("a","Current assets","200000"), f("b","Current liabilities","100000")] },
    { slug: "bizfin-current-ratio-calculator", title: "Current Ratio Calculator", mode: "current", fields: [f("a","Current assets","180000"), f("b","Current liabilities","90000")] },
    { slug: "bizfin-quick-ratio-calculator", title: "Quick Ratio Calculator", mode: "quick", fields: [f("a","Current assets","180000"), f("b","Inventory","40000"), f("c","Current liabilities","90000")] },
  ],
  buildInput: `
      case "cf": { const inflows = reqFinite(a,"Inflows"); if (!inflows.ok) return { error: inflows.error }; const outflows = reqNonNeg(b,"Outflows"); if (!outflows.ok) return { error: outflows.error }; input.inflows = inflows.value; input.outflows = outflows.value; break; }
      case "fcf": { const ocf = reqFinite(a,"OCF"); if (!ocf.ok) return { error: ocf.error }; const capex = reqNonNeg(b,"CapEx"); if (!capex.ok) return { error: capex.error }; input.ocf = ocf.value; input.capex = capex.value; break; }
      case "ocf": { const netIncome = reqFinite(a,"NI"); if (!netIncome.ok) return { error: netIncome.error }; const depreciation = reqNonNeg(b,"D&A"); if (!depreciation.ok) return { error: depreciation.error }; const wcChange = reqFinite(c,"ΔWC"); if (!wcChange.ok) return { error: wcChange.error }; input.netIncome = netIncome.value; input.depreciation = depreciation.value; input.wcChange = wcChange.value; break; }
      case "wc": { const currentAssets = reqNonNeg(a,"CA"); if (!currentAssets.ok) return { error: currentAssets.error }; const currentLiabilities = reqNonNeg(b,"CL"); if (!currentLiabilities.ok) return { error: currentLiabilities.error }; input.currentAssets = currentAssets.value; input.currentLiabilities = currentLiabilities.value; break; }
      case "ccc": { const dio = reqNonNeg(a,"DIO"); if (!dio.ok) return { error: dio.error }; const dso = reqNonNeg(b,"DSO"); if (!dso.ok) return { error: dso.error }; const dpo = reqNonNeg(c,"DPO"); if (!dpo.ok) return { error: dpo.error }; input.dio = dio.value; input.dso = dso.value; input.dpo = dpo.value; break; }
      case "current": { const currentAssets = reqPos(a,"CA"); if (!currentAssets.ok) return { error: currentAssets.error }; const currentLiabilities = reqPos(b,"CL"); if (!currentLiabilities.ok) return { error: currentLiabilities.error }; input.currentAssets = currentAssets.value; input.currentLiabilities = currentLiabilities.value; break; }
      case "quick": { const currentAssets = reqPos(a,"CA"); if (!currentAssets.ok) return { error: currentAssets.error }; const inventory = reqNonNeg(b,"Inventory"); if (!inventory.ok) return { error: inventory.error }; const currentLiabilities = reqPos(c,"CL"); if (!currentLiabilities.ok) return { error: currentLiabilities.error }; input.currentAssets = currentAssets.value; input.inventory = inventory.value; input.currentLiabilities = currentLiabilities.value; break; }`,
});

add({
  key: "Ratios", engine: "bizfinRatios", compute: "computeBizfinRatios", slugType: "BizfinRatiosSlug",
  inputType: "BizfinRatiosInput", resultType: "BizfinRatiosResult",
  sectionSlug: "bizfin-financial-ratios", hubLabel: "Business · Business finance · Financial ratio calculators",
  tableTitle: "Financial ratio tools", rows: [["ROA/ROE/ROCE", "Return ratios"], ["Turnovers", "Activity ratios"], ["Leverage", "D/E, coverage"]],
  hostFile: "BizfinRatiosCalculatorHost.tsx", seoFile: "bizfinRatiosContent.ts", seoExport: "BIZFIN_RATIOS_ARTICLES",
  calcs: [
    { slug: "bizfin-profitability-ratios-calculator", title: "Profitability Ratios", mode: "prof", fields: [f("a","Revenue","1000000"), f("b","Gross profit","400000"), f("c","Net income","120000")] },
    { slug: "bizfin-roa-calculator", title: "ROA Calculator", mode: "roa", fields: [f("a","Net income","120000"), f("b","Assets","800000")] },
    { slug: "bizfin-roe-calculator", title: "ROE Calculator", mode: "roe", fields: [f("a","Net income","120000"), f("b","Equity","500000")] },
    { slug: "bizfin-roce-calculator", title: "ROCE Calculator", mode: "roce", fields: [f("a","EBIT","150000"), f("b","Capital employed","600000")] },
    { slug: "bizfin-inventory-turnover-ratio-calculator", title: "Inventory Turnover Calculator", mode: "invt", fields: [f("a","COGS","500000"), f("b","Average inventory","100000")] },
    { slug: "bizfin-asset-turnover-calculator", title: "Asset Turnover Calculator", mode: "at", fields: [f("a","Revenue","1000000"), f("b","Assets","800000")] },
    { slug: "bizfin-accounts-receivable-turnover-calculator", title: "AR Turnover Calculator", mode: "art", fields: [f("a","Revenue","1000000"), f("b","Receivables","125000")] },
    { slug: "bizfin-accounts-payable-turnover-calculator", title: "AP Turnover Calculator", mode: "apt", fields: [f("a","COGS","500000"), f("b","Payables","80000")] },
    { slug: "bizfin-debt-to-equity-calculator", title: "Debt-to-Equity Calculator", mode: "de", fields: [f("a","Debt","300000"), f("b","Equity","500000")] },
    { slug: "bizfin-debt-ratio-calculator", title: "Debt Ratio Calculator", mode: "dr", fields: [f("a","Debt","300000"), f("b","Assets","800000")] },
    { slug: "bizfin-interest-coverage-ratio-calculator", title: "Interest Coverage Calculator", mode: "ic", fields: [f("a","EBIT","150000"), f("b","Interest","30000")] },
  ],
  buildInput: `
      case "prof": { const revenue = reqPos(a,"Revenue"); if (!revenue.ok) return { error: revenue.error }; const grossProfit = reqFinite(b,"GP"); if (!grossProfit.ok) return { error: grossProfit.error }; const netIncome = reqFinite(c,"NI"); if (!netIncome.ok) return { error: netIncome.error }; input.revenue = revenue.value; input.grossProfit = grossProfit.value; input.netIncome = netIncome.value; break; }
      case "roa": { const netIncome = reqFinite(a,"NI"); if (!netIncome.ok) return { error: netIncome.error }; const assets = reqPos(b,"Assets"); if (!assets.ok) return { error: assets.error }; input.netIncome = netIncome.value; input.assets = assets.value; break; }
      case "roe": { const netIncome = reqFinite(a,"NI"); if (!netIncome.ok) return { error: netIncome.error }; const equity = reqPos(b,"Equity"); if (!equity.ok) return { error: equity.error }; input.netIncome = netIncome.value; input.equity = equity.value; break; }
      case "roce": { const ebit = reqFinite(a,"EBIT"); if (!ebit.ok) return { error: ebit.error }; const capitalEmployed = reqPos(b,"CE"); if (!capitalEmployed.ok) return { error: capitalEmployed.error }; input.ebit = ebit.value; input.capitalEmployed = capitalEmployed.value; break; }
      case "invt": { const cogs = reqPos(a,"COGS"); if (!cogs.ok) return { error: cogs.error }; const inventory = reqPos(b,"Inventory"); if (!inventory.ok) return { error: inventory.error }; input.cogs = cogs.value; input.inventory = inventory.value; break; }
      case "at": { const revenue = reqPos(a,"Revenue"); if (!revenue.ok) return { error: revenue.error }; const assets = reqPos(b,"Assets"); if (!assets.ok) return { error: assets.error }; input.revenue = revenue.value; input.assets = assets.value; break; }
      case "art": { const revenue = reqPos(a,"Revenue"); if (!revenue.ok) return { error: revenue.error }; const receivables = reqPos(b,"AR"); if (!receivables.ok) return { error: receivables.error }; input.revenue = revenue.value; input.receivables = receivables.value; break; }
      case "apt": { const cogs = reqPos(a,"COGS"); if (!cogs.ok) return { error: cogs.error }; const payables = reqPos(b,"AP"); if (!payables.ok) return { error: payables.error }; input.cogs = cogs.value; input.payables = payables.value; break; }
      case "de": { const debt = reqNonNeg(a,"Debt"); if (!debt.ok) return { error: debt.error }; const equity = reqPos(b,"Equity"); if (!equity.ok) return { error: equity.error }; input.debt = debt.value; input.equity = equity.value; break; }
      case "dr": { const debt = reqNonNeg(a,"Debt"); if (!debt.ok) return { error: debt.error }; const assets = reqPos(b,"Assets"); if (!assets.ok) return { error: assets.error }; input.debt = debt.value; input.assets = assets.value; break; }
      case "ic": { const ebit = reqFinite(a,"EBIT"); if (!ebit.ok) return { error: ebit.error }; const interest = reqPos(b,"Interest"); if (!interest.ok) return { error: interest.error }; input.ebit = ebit.value; input.interest = interest.value; break; }`,
});

for (const sec of MORE) {
  write(`components/calculators/family/${sec.hostFile}`, genHost(sec));
  write(`lib/calculator-seo/${sec.seoFile}`, genSeo(sec));
}

console.log("Cash + Ratios done");
