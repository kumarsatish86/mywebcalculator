/** Business finance — profitability teaching estimates. */
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
export const BIZFIN_PROFIT_SLUGS: BizfinProfitSlug[] = [
  "bizfin-profit-calculator",
  "bizfin-gross-profit-calculator",
  "bizfin-net-profit-calculator",
  "bizfin-operating-profit-calculator",
  "bizfin-profit-margin-calculator",
  "bizfin-gross-margin-calculator",
  "bizfin-net-margin-calculator",
  "bizfin-contribution-margin-calculator",
  "bizfin-ebitda-calculator",
  "bizfin-ebit-calculator",
];


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
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

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
