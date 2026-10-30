/** Business finance — financial ratios teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinRatiosSlug =
  | "bizfin-profitability-ratios-calculator"
  | "bizfin-roa-calculator"
  | "bizfin-roe-calculator"
  | "bizfin-roce-calculator"
  | "bizfin-inventory-turnover-ratio-calculator"
  | "bizfin-asset-turnover-calculator"
  | "bizfin-accounts-receivable-turnover-calculator"
  | "bizfin-accounts-payable-turnover-calculator"
  | "bizfin-debt-to-equity-calculator"
  | "bizfin-debt-ratio-calculator"
  | "bizfin-interest-coverage-ratio-calculator";
export const BIZFIN_RATIOS_SLUGS: BizfinRatiosSlug[] = [
  "bizfin-profitability-ratios-calculator",
  "bizfin-roa-calculator",
  "bizfin-roe-calculator",
  "bizfin-roce-calculator",
  "bizfin-inventory-turnover-ratio-calculator",
  "bizfin-asset-turnover-calculator",
  "bizfin-accounts-receivable-turnover-calculator",
  "bizfin-accounts-payable-turnover-calculator",
  "bizfin-debt-to-equity-calculator",
  "bizfin-debt-ratio-calculator",
  "bizfin-interest-coverage-ratio-calculator",
];


export type BizfinRatiosInput = {
  revenue?: number;
  grossProfit?: number;
  netIncome?: number;
  assets?: number;
  equity?: number;
  ebit?: number;
  capitalEmployed?: number;
  cogs?: number;
  inventory?: number;
  receivables?: number;
  payables?: number;
  debt?: number;
  interest?: number;
};

export type BizfinRatiosResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinRatios(slug: BizfinRatiosSlug, input: BizfinRatiosInput): BizfinRatiosResult {
  switch (slug) {
    case "bizfin-profitability-ratios-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const gp = finite(input.grossProfit ?? 0, "Gross profit");
      if (typeof gp !== "number") return { ok: false, error: gp.error };
      const ni = finite(input.netIncome ?? 0, "Net income");
      if (typeof ni !== "number") return { ok: false, error: ni.error };
      return {
        ok: true,
        value: (ni / rev) * 100,
        secondary: (gp / rev) * 100,
        tertiary: ni,
        note: "Shows net margin % (primary) and gross margin % (secondary).",
      };
    }
    case "bizfin-roa-calculator": {
      const ni = finite(input.netIncome, "Net income");
      if (typeof ni !== "number") return { ok: false, error: ni.error };
      const assets = pos(input.assets, "Assets");
      if (typeof assets !== "number") return { ok: false, error: assets.error };
      return { ok: true, pct: (ni / assets) * 100, value: ni / assets, note: "ROA = net income ÷ assets." };
    }
    case "bizfin-roe-calculator": {
      const ni = finite(input.netIncome, "Net income");
      if (typeof ni !== "number") return { ok: false, error: ni.error };
      const equity = pos(input.equity, "Equity");
      if (typeof equity !== "number") return { ok: false, error: equity.error };
      return { ok: true, pct: (ni / equity) * 100, value: ni / equity, note: "ROE = net income ÷ equity." };
    }
    case "bizfin-roce-calculator": {
      const ebit = finite(input.ebit ?? input.netIncome, "EBIT");
      if (typeof ebit !== "number") return { ok: false, error: ebit.error };
      const ce = pos(input.capitalEmployed ?? input.assets, "Capital employed");
      if (typeof ce !== "number") return { ok: false, error: ce.error };
      return { ok: true, pct: (ebit / ce) * 100, value: ebit / ce, note: "ROCE = EBIT ÷ capital employed." };
    }
    case "bizfin-inventory-turnover-ratio-calculator": {
      const cogs = pos(input.cogs, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const inv = pos(input.inventory, "Average inventory");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      return { ok: true, value: cogs / inv, note: "Inventory turnover = COGS ÷ average inventory." };
    }
    case "bizfin-asset-turnover-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const assets = pos(input.assets, "Assets");
      if (typeof assets !== "number") return { ok: false, error: assets.error };
      return { ok: true, value: rev / assets, note: "Asset turnover = revenue ÷ assets." };
    }
    case "bizfin-accounts-receivable-turnover-calculator": {
      const rev = pos(input.revenue, "Credit sales / revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const ar = pos(input.receivables, "Accounts receivable");
      if (typeof ar !== "number") return { ok: false, error: ar.error };
      return { ok: true, value: rev / ar, note: "AR turnover = sales ÷ receivables." };
    }
    case "bizfin-accounts-payable-turnover-calculator": {
      const cogs = pos(input.cogs ?? input.revenue, "COGS / purchases");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const ap = pos(input.payables, "Accounts payable");
      if (typeof ap !== "number") return { ok: false, error: ap.error };
      return { ok: true, value: cogs / ap, note: "AP turnover = COGS ÷ payables." };
    }
    case "bizfin-debt-to-equity-calculator": {
      const debt = nonNeg(input.debt, "Debt");
      if (typeof debt !== "number") return { ok: false, error: debt.error };
      const equity = pos(input.equity, "Equity");
      if (typeof equity !== "number") return { ok: false, error: equity.error };
      return { ok: true, value: debt / equity, note: "D/E = debt ÷ equity." };
    }
    case "bizfin-debt-ratio-calculator": {
      const debt = nonNeg(input.debt, "Total debt");
      if (typeof debt !== "number") return { ok: false, error: debt.error };
      const assets = pos(input.assets, "Total assets");
      if (typeof assets !== "number") return { ok: false, error: assets.error };
      return { ok: true, value: debt / assets, pct: (debt / assets) * 100, note: "Debt ratio = debt ÷ assets." };
    }
    case "bizfin-interest-coverage-ratio-calculator": {
      const ebit = finite(input.ebit, "EBIT");
      if (typeof ebit !== "number") return { ok: false, error: ebit.error };
      const interest = pos(input.interest, "Interest expense");
      if (typeof interest !== "number") return { ok: false, error: interest.error };
      return { ok: true, value: ebit / interest, note: "Interest coverage = EBIT ÷ interest." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
