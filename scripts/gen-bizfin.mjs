/**
 * Generate Business Finance engines, hosts, SEO, router, and smoke test.
 * Run: node scripts/gen-bizfin.mjs
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

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════
write(
  "lib/calculators/bizfinHelpers.ts",
  `/** Shared business-finance calculator helpers — teaching estimates. */

export const BIZFIN_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  L: "l",
  W: "w",
  H: "h",
  D: "d",
  N: "n",
  P: "p",
  Q: "q",
  M: "m",
  V: "v",
  S: "s",
} as const;

export function parseBizfinSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIZFIN_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function pos(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: \`\${label} must be positive.\` };
  return n;
}

export function nonNeg(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n < 0) return { error: \`\${label} must be ≥ 0.\` };
  return n;
}

export function finite(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n)) return { error: \`\${label} must be a finite number.\` };
  return n;
}
`,
);

const RESULT = `| { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    }`;

// Section metadata for hosts/SEO/router
/** @type {Array<{key:string, engine:string, compute:string, slugType:string, sectionSlug:string, hubLabel:string, title:string, rows:string[][], calcs:Array<{slug:string,title:string,mode:string,defaults:Record<string,string>,labels:Record<string,string>,fields:string[]}>}>} */
const SECTIONS = [];

function addSection(meta) {
  SECTIONS.push(meta);
}

// ── PROFIT ────────────────────────────────────────────────────────────
addSection({
  key: "Profit",
  engine: "bizfinProfit",
  compute: "computeBizfinProfit",
  slugType: "BizfinProfitSlug",
  sectionSlug: "bizfin-profitability-core",
  hubLabel: "Business · Business finance · Profitability calculators",
  title: "Profitability tools",
  rows: [
    ["Profit", "Revenue − expenses"],
    ["Gross profit", "Revenue − COGS"],
    ["Net profit", "Revenue − all costs & tax"],
    ["Margins", "Profit ÷ revenue"],
    ["EBITDA / EBIT", "Operating earnings views"],
  ],
  calcs: [
    { slug: "bizfin-profit-calculator", title: "Profit", mode: "revExp", defaults: { a: "100000", b: "70000" }, labels: { a: "Revenue", b: "Expenses" }, fields: ["a", "b"] },
    { slug: "bizfin-gross-profit-calculator", title: "Gross profit", mode: "revCogs", defaults: { a: "100000", b: "55000" }, labels: { a: "Revenue", b: "COGS" }, fields: ["a", "b"] },
    { slug: "bizfin-net-profit-calculator", title: "Net profit", mode: "net", defaults: { a: "100000", b: "40000", c: "25000", r: "3000", t: "5000" }, labels: { a: "Revenue", b: "COGS", c: "Operating expenses", r: "Interest", t: "Tax" }, fields: ["a", "b", "c", "r", "t"] },
    { slug: "bizfin-operating-profit-calculator", title: "Operating profit", mode: "ebit", defaults: { a: "100000", b: "40000", c: "25000" }, labels: { a: "Revenue", b: "COGS", c: "Operating expenses" }, fields: ["a", "b", "c"] },
    { slug: "bizfin-profit-margin-calculator", title: "Profit margin", mode: "marginProfit", defaults: { a: "100000", b: "18000" }, labels: { a: "Revenue", b: "Profit" }, fields: ["a", "b"] },
    { slug: "bizfin-gross-margin-calculator", title: "Gross margin", mode: "revCogs", defaults: { a: "100000", b: "55000" }, labels: { a: "Revenue", b: "COGS" }, fields: ["a", "b"] },
    { slug: "bizfin-net-margin-calculator", title: "Net margin", mode: "net", defaults: { a: "100000", b: "40000", c: "25000", r: "3000", t: "5000" }, labels: { a: "Revenue", b: "COGS", c: "Operating expenses", r: "Interest", t: "Tax" }, fields: ["a", "b", "c", "r", "t"] },
    { slug: "bizfin-contribution-margin-calculator", title: "Contribution margin", mode: "contrib", defaults: { a: "100000", b: "45000" }, labels: { a: "Revenue", b: "Variable costs" }, fields: ["a", "b"] },
    { slug: "bizfin-ebitda-calculator", title: "EBITDA", mode: "ebitda", defaults: { a: "100000", b: "40000", c: "25000", d: "8000" }, labels: { a: "Revenue", b: "COGS", c: "Operating expenses", d: "D&A" }, fields: ["a", "b", "c", "d"] },
    { slug: "bizfin-ebit-calculator", title: "EBIT", mode: "ebit", defaults: { a: "100000", b: "40000", c: "25000" }, labels: { a: "Revenue", b: "COGS", c: "Operating expenses" }, fields: ["a", "b", "c"] },
  ],
});

write(
  "lib/calculators/bizfinProfit.ts",
  `/** Business finance — profitability teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinProfitSlug =
  | "bizfin-profit-calculator"
  | "bizfin-gross-profit-calculator"
  | "bizfin-net-profit-calculator"
  | "bizfin-operating-profit-calculator"
  | "bizfin-profit-margin-calculator"
  | "bizfin-gross-margin-calculator"
  | "bizfin-net-margin-calculator"
  | "bizfin-contribution-margin-calculator"
  | "bizfin-ebitda-calculator"
  | "bizfin-ebit-calculator";

export type BizfinProfitInput = {
  revenue?: number;
  cogs?: number;
  expenses?: number;
  opex?: number;
  interest?: number;
  tax?: number;
  depreciation?: number;
  amortization?: number;
  variableCosts?: number;
  profit?: number;
};

export type BizfinProfitResult =
  ${RESULT};

export function computeBizfinProfit(slug: BizfinProfitSlug, input: BizfinProfitInput): BizfinProfitResult {
  switch (slug) {
    case "bizfin-profit-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const exp = nonNeg(input.expenses ?? 0, "Expenses");
      if (typeof exp !== "number") return { ok: false, error: exp.error };
      return { ok: true, value: rev - exp, note: "Profit = revenue − expenses." };
    }
    case "bizfin-gross-profit-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      return { ok: true, value: rev - cogs, note: "Gross profit = revenue − COGS." };
    }
    case "bizfin-net-profit-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const opex = nonNeg(input.opex ?? input.expenses ?? 0, "Operating expenses");
      if (typeof opex !== "number") return { ok: false, error: opex.error };
      const interest = nonNeg(input.interest ?? 0, "Interest");
      if (typeof interest !== "number") return { ok: false, error: interest.error };
      const tax = nonNeg(input.tax ?? 0, "Tax");
      if (typeof tax !== "number") return { ok: false, error: tax.error };
      return { ok: true, value: rev - cogs - opex - interest - tax, note: "Net = revenue − COGS − opex − interest − tax." };
    }
    case "bizfin-operating-profit-calculator":
    case "bizfin-ebit-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const opex = nonNeg(input.opex ?? input.expenses ?? 0, "Operating expenses");
      if (typeof opex !== "number") return { ok: false, error: opex.error };
      return { ok: true, value: rev - cogs - opex, note: "EBIT / operating profit = revenue − COGS − opex." };
    }
    case "bizfin-profit-margin-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const profit = finite(input.profit, "Profit");
      if (typeof profit !== "number") return { ok: false, error: profit.error };
      return { ok: true, value: profit, pct: (profit / rev) * 100, note: "Profit margin % = profit ÷ revenue." };
    }
    case "bizfin-gross-margin-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const gp = rev - cogs;
      return { ok: true, value: gp, pct: (gp / rev) * 100, note: "Gross margin % = (revenue − COGS) ÷ revenue." };
    }
    case "bizfin-net-margin-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const opex = nonNeg(input.opex ?? input.expenses ?? 0, "Expenses");
      if (typeof opex !== "number") return { ok: false, error: opex.error };
      const interest = nonNeg(input.interest ?? 0, "Interest");
      if (typeof interest !== "number") return { ok: false, error: interest.error };
      const tax = nonNeg(input.tax ?? 0, "Tax");
      if (typeof tax !== "number") return { ok: false, error: tax.error };
      const net = rev - cogs - opex - interest - tax;
      return { ok: true, value: net, pct: (net / rev) * 100, note: "Net margin % = net profit ÷ revenue." };
    }
    case "bizfin-contribution-margin-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const vc = nonNeg(input.variableCosts ?? input.cogs ?? 0, "Variable costs");
      if (typeof vc !== "number") return { ok: false, error: vc.error };
      const cm = rev - vc;
      return { ok: true, value: cm, pct: (cm / rev) * 100, note: "Contribution margin = revenue − variable costs." };
    }
    case "bizfin-ebitda-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const opex = nonNeg(input.opex ?? input.expenses ?? 0, "Operating expenses");
      if (typeof opex !== "number") return { ok: false, error: opex.error };
      const da = nonNeg((input.depreciation ?? 0) + (input.amortization ?? 0), "D&A");
      if (typeof da !== "number") return { ok: false, error: da.error };
      const ebit = rev - cogs - opex;
      return { ok: true, value: ebit + da, secondary: ebit, note: "EBITDA = EBIT + depreciation + amortization." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// Continue writing remaining engines + then generate hosts from SECTIONS metadata
// I'll append the rest of engines in this same script...

const remaining = `
// PLACEHOLDER - engines written below in same run
`;
void remaining;

// Write invest engine
write(
  "lib/calculators/bizfinInvest.ts",
  `/** Business finance — investment & return teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinInvestSlug =
  | "bizfin-roi-calculator"
  | "bizfin-annualized-roi-calculator"
  | "bizfin-irr-calculator"
  | "bizfin-npv-calculator"
  | "bizfin-payback-period-calculator"
  | "bizfin-discounted-payback-period-calculator"
  | "bizfin-capital-gain-calculator"
  | "bizfin-business-valuation-calculator"
  | "bizfin-equity-value-calculator"
  | "bizfin-enterprise-value-calculator";

export type BizfinInvestInput = {
  cost?: number;
  gain?: number;
  years?: number;
  ratePct?: number;
  cf0?: number;
  cf1?: number;
  cf2?: number;
  cf3?: number;
  investment?: number;
  annualCf?: number;
  buy?: number;
  sell?: number;
  ebitda?: number;
  multiple?: number;
  equityValue?: number;
  netDebt?: number;
  cash?: number;
  debt?: number;
  marketCap?: number;
};

export type BizfinInvestResult =
  ${RESULT};

function npvOf(rate: number, cfs: number[]): number {
  return cfs.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

function irrSimple(cfs: number[]): number | null {
  let r = 0.1;
  for (let i = 0; i < 40; i++) {
    let f = 0;
    let df = 0;
    for (let t = 0; t < cfs.length; t++) {
      const den = Math.pow(1 + r, t);
      f += cfs[t] / den;
      if (t > 0) df -= (t * cfs[t]) / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(df) < 1e-12) break;
    const next = r - f / df;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - r) < 1e-8) return next;
    r = next;
  }
  return Number.isFinite(r) ? r : null;
}

export function computeBizfinInvest(slug: BizfinInvestSlug, input: BizfinInvestInput): BizfinInvestResult {
  switch (slug) {
    case "bizfin-roi-calculator": {
      const cost = pos(input.cost ?? input.investment, "Cost / investment");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const gain = finite(input.gain ?? input.sell, "Gain / final value");
      if (typeof gain !== "number") return { ok: false, error: gain.error };
      const roi = (gain - cost) / cost;
      return { ok: true, value: gain - cost, pct: roi * 100, note: "ROI = (gain − cost) ÷ cost." };
    }
    case "bizfin-annualized-roi-calculator": {
      const cost = pos(input.cost ?? input.investment, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const gain = pos(input.gain ?? input.sell, "Final value");
      if (typeof gain !== "number") return { ok: false, error: gain.error };
      const years = pos(input.years, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const ann = Math.pow(gain / cost, 1 / years) - 1;
      return { ok: true, pct: ann * 100, note: "Annualized ROI = (final÷cost)^(1/years) − 1." };
    }
    case "bizfin-irr-calculator": {
      const cf0 = finite(input.cf0 ?? (input.investment !== undefined ? -Math.abs(input.investment) : undefined), "CF0");
      if (typeof cf0 !== "number") return { ok: false, error: cf0.error };
      const cf1 = finite(input.cf1 ?? input.annualCf, "CF1");
      if (typeof cf1 !== "number") return { ok: false, error: cf1.error };
      const cfs = [cf0, cf1];
      if (input.cf2 !== undefined && Number.isFinite(input.cf2)) cfs.push(input.cf2);
      if (input.cf3 !== undefined && Number.isFinite(input.cf3)) cfs.push(input.cf3);
      const irr = irrSimple(cfs);
      if (irr === null) return { ok: false, error: "Could not converge on IRR." };
      return { ok: true, pct: irr * 100, note: "IRR via Newton on discrete annual cash flows." };
    }
    case "bizfin-npv-calculator": {
      const ratePct = nonNeg(input.ratePct ?? 0, "Discount rate %");
      if (typeof ratePct !== "number") return { ok: false, error: ratePct.error };
      const cf0 = finite(input.cf0 ?? (input.investment !== undefined ? -Math.abs(input.investment) : undefined), "CF0");
      if (typeof cf0 !== "number") return { ok: false, error: cf0.error };
      const cf1 = finite(input.cf1 ?? input.annualCf, "CF1");
      if (typeof cf1 !== "number") return { ok: false, error: cf1.error };
      const cfs = [cf0, cf1];
      if (input.cf2 !== undefined && Number.isFinite(input.cf2)) cfs.push(input.cf2);
      if (input.cf3 !== undefined && Number.isFinite(input.cf3)) cfs.push(input.cf3);
      return { ok: true, value: npvOf(ratePct / 100, cfs), note: "NPV = Σ CF_t / (1+r)^t." };
    }
    case "bizfin-payback-period-calculator": {
      const inv = pos(input.investment ?? input.cost, "Investment");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      const annual = pos(input.annualCf ?? input.cf1, "Annual cash flow");
      if (typeof annual !== "number") return { ok: false, error: annual.error };
      return { ok: true, value: inv / annual, note: "Simple payback (years) = investment ÷ annual CF." };
    }
    case "bizfin-discounted-payback-period-calculator": {
      const inv = pos(input.investment ?? input.cost, "Investment");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      const annual = pos(input.annualCf ?? input.cf1, "Annual cash flow");
      if (typeof annual !== "number") return { ok: false, error: annual.error };
      const ratePct = nonNeg(input.ratePct ?? 0, "Discount rate %");
      if (typeof ratePct !== "number") return { ok: false, error: ratePct.error };
      const r = ratePct / 100;
      let cum = 0;
      for (let t = 1; t <= 100; t++) {
        const pv = annual / Math.pow(1 + r, t);
        const prev = cum;
        cum += pv;
        if (cum >= inv) {
          const frac = (inv - prev) / pv;
          return { ok: true, value: t - 1 + frac, note: "Discounted payback interpolates PV recovery." };
        }
      }
      return { ok: false, error: "Payback exceeds 100 years at this rate." };
    }
    case "bizfin-capital-gain-calculator": {
      const buy = pos(input.buy ?? input.cost, "Buy / cost basis");
      if (typeof buy !== "number") return { ok: false, error: buy.error };
      const sell = finite(input.sell ?? input.gain, "Sell price");
      if (typeof sell !== "number") return { ok: false, error: sell.error };
      const gain = sell - buy;
      return { ok: true, value: gain, pct: (gain / buy) * 100, note: "Capital gain = sell − buy." };
    }
    case "bizfin-business-valuation-calculator": {
      const ebitda = pos(input.ebitda, "EBITDA");
      if (typeof ebitda !== "number") return { ok: false, error: ebitda.error };
      const multiple = pos(input.multiple, "Valuation multiple");
      if (typeof multiple !== "number") return { ok: false, error: multiple.error };
      return { ok: true, value: ebitda * multiple, note: "Teaching EV ≈ EBITDA × multiple." };
    }
    case "bizfin-equity-value-calculator": {
      const ev = pos(input.equityValue ?? input.marketCap, "Enterprise value");
      if (typeof ev !== "number") return { ok: false, error: ev.error };
      const netDebt = finite(input.netDebt ?? (input.debt ?? 0) - (input.cash ?? 0), "Net debt");
      if (typeof netDebt !== "number") return { ok: false, error: netDebt.error };
      return { ok: true, value: ev - netDebt, secondary: ev, note: "Equity value ≈ EV − net debt." };
    }
    case "bizfin-enterprise-value-calculator": {
      const equity = pos(input.equityValue ?? input.marketCap, "Equity / market cap");
      if (typeof equity !== "number") return { ok: false, error: equity.error };
      const debt = nonNeg(input.debt ?? 0, "Debt");
      if (typeof debt !== "number") return { ok: false, error: debt.error };
      const cash = nonNeg(input.cash ?? 0, "Cash");
      if (typeof cash !== "number") return { ok: false, error: cash.error };
      return { ok: true, value: equity + debt - cash, note: "EV = equity + debt − cash." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

addSection({
  key: "Invest",
  engine: "bizfinInvest",
  compute: "computeBizfinInvest",
  slugType: "BizfinInvestSlug",
  sectionSlug: "bizfin-investment-return",
  hubLabel: "Business · Business finance · Investment and return calculators",
  title: "Investment and return tools",
  rows: [
    ["ROI / annualized ROI", "(Gain − cost) ÷ cost"],
    ["IRR / NPV", "Discrete cash-flow teaching models"],
    ["Payback", "Investment ÷ cash flow"],
    ["Valuation", "EBITDA × multiple; EV / equity"],
  ],
  calcs: [
    { slug: "bizfin-roi-calculator", title: "ROI", mode: "roi", defaults: { a: "50000", b: "65000" }, labels: { a: "Investment cost", b: "Final / gain value" }, fields: ["a", "b"] },
    { slug: "bizfin-annualized-roi-calculator", title: "Annualized ROI", mode: "annRoi", defaults: { a: "50000", b: "80000", n: "3" }, labels: { a: "Initial cost", b: "Final value", n: "Years" }, fields: ["a", "b", "n"] },
    { slug: "bizfin-irr-calculator", title: "IRR", mode: "irr", defaults: { a: "-100000", b: "40000", c: "40000", d: "50000" }, labels: { a: "CF0 (usually negative)", b: "CF1", c: "CF2", d: "CF3" }, fields: ["a", "b", "c", "d"] },
    { slug: "bizfin-npv-calculator", title: "NPV", mode: "npv", defaults: { a: "-100000", b: "40000", c: "40000", d: "50000", r: "10" }, labels: { a: "CF0", b: "CF1", c: "CF2", d: "CF3", r: "Discount rate %" }, fields: ["a", "b", "c", "d", "r"] },
    { slug: "bizfin-payback-period-calculator", title: "Payback period", mode: "payback", defaults: { a: "120000", b: "30000" }, labels: { a: "Investment", b: "Annual cash flow" }, fields: ["a", "b"] },
    { slug: "bizfin-discounted-payback-period-calculator", title: "Discounted payback", mode: "dpayback", defaults: { a: "120000", b: "30000", r: "8" }, labels: { a: "Investment", b: "Annual cash flow", r: "Discount rate %" }, fields: ["a", "b", "r"] },
    { slug: "bizfin-capital-gain-calculator", title: "Capital gain", mode: "capgain", defaults: { a: "100000", b: "140000" }, labels: { a: "Buy / cost basis", b: "Sell price" }, fields: ["a", "b"] },
    { slug: "bizfin-business-valuation-calculator", title: "Business valuation", mode: "val", defaults: { a: "500000", b: "6" }, labels: { a: "EBITDA", b: "Multiple" }, fields: ["a", "b"] },
    { slug: "bizfin-equity-value-calculator", title: "Equity value", mode: "equity", defaults: { a: "3000000", b: "400000" }, labels: { a: "Enterprise value", b: "Net debt" }, fields: ["a", "b"] },
    { slug: "bizfin-enterprise-value-calculator", title: "Enterprise value", mode: "ev", defaults: { a: "2500000", b: "800000", c: "200000" }, labels: { a: "Equity / market cap", b: "Debt", c: "Cash" }, fields: ["a", "b", "c"] },
  ],
});

console.log("Wrote helpers + profit + invest. Continuing with remaining engines via part 2...");
fs.writeFileSync(path.join(root, "scripts/.bizfin-sections.json"), JSON.stringify(SECTIONS, null, 2));
console.log("Saved section meta so far; run part2.");
