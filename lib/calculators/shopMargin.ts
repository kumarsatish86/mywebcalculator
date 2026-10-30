/** Shop profit & margin — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopMarginSlug =
  | "shop-gross-margin-calculator"
  | "shop-net-profit-calculator"
  | "shop-profit-margin-percent-calculator"
  | "shop-break-even-units-calculator"
  | "shop-break-even-revenue-calculator"
  | "shop-markup-from-cost-calculator"
  | "shop-target-margin-price-calculator"
  | "shop-discounted-margin-calculator";

export type ShopMarginInput = {
  revenue?: number;
  cogs?: number;
  expenses?: number;
  price?: number;
  cost?: number;
  fixedCosts?: number;
  contribPerUnit?: number;
  marginPct?: number;
  discountPct?: number;
};

export type ShopMarginResult =
  | { ok: false; error: string }
  | {
      ok: true;
      margin?: number;
      pct?: number;
      units?: number;
      revenue?: number;
      price?: number;
      note: string;
    };

export function computeShopMargin(slug: ShopMarginSlug, input: ShopMarginInput): ShopMarginResult {
  switch (slug) {
    case "shop-gross-margin-calculator": {
      const rev = pos(input.revenue ?? input.price, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? input.cost ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const margin = rev - cogs;
      return { ok: true, margin, pct: (margin / rev) * 100, note: "Gross margin = revenue − COGS." };
    }
    case "shop-net-profit-calculator": {
      const rev = pos(input.revenue, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = nonNeg(input.cogs ?? 0, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const exp = nonNeg(input.expenses ?? 0, "Expenses");
      if (typeof exp !== "number") return { ok: false, error: exp.error };
      return { ok: true, margin: rev - cogs - exp, note: "Net = revenue − COGS − expenses." };
    }
    case "shop-profit-margin-percent-calculator": {
      const rev = pos(input.revenue ?? input.price, "Revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const profit = input.marginPct !== undefined
        ? rev * (input.marginPct / 100)
        : rev - (input.cogs ?? input.cost ?? 0);
      return { ok: true, margin: profit, pct: (profit / rev) * 100, note: "Profit margin % = profit ÷ revenue." };
    }
    case "shop-break-even-units-calculator": {
      const fixed = pos(input.fixedCosts, "Fixed costs");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const contrib = pos(input.contribPerUnit ?? (input.price && input.cost ? input.price - input.cost : undefined), "Contribution/unit");
      if (typeof contrib !== "number") return { ok: false, error: contrib.error };
      return { ok: true, units: fixed / contrib, note: "Break-even units = fixed ÷ contribution/unit." };
    }
    case "shop-break-even-revenue-calculator": {
      const fixed = pos(input.fixedCosts, "Fixed costs");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const marginPct = pos(input.marginPct, "Contribution margin %");
      if (typeof marginPct !== "number") return { ok: false, error: marginPct.error };
      return { ok: true, revenue: fixed / (marginPct / 100), note: "Break-even revenue = fixed ÷ CM%." };
    }
    case "shop-markup-from-cost-calculator": {
      const cost = pos(input.cost, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      return { ok: true, pct: ((price - cost) / cost) * 100, price, note: "Markup % = (price−cost)÷cost." };
    }
    case "shop-target-margin-price-calculator": {
      const cost = pos(input.cost, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const m = pos(input.marginPct, "Target margin %");
      if (typeof m !== "number") return { ok: false, error: m.error };
      if (m >= 100) return { ok: false, error: "Margin % must be < 100." };
      return { ok: true, price: cost / (1 - m / 100), note: "Price = cost ÷ (1 − margin%)." };
    }
    case "shop-discounted-margin-calculator": {
      const price = pos(input.price, "List price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const cost = pos(input.cost, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const disc = nonNeg(input.discountPct ?? 0, "Discount %");
      if (typeof disc !== "number") return { ok: false, error: disc.error };
      const sell = price * (1 - disc / 100);
      const margin = sell - cost;
      return { ok: true, price: sell, margin, pct: (margin / sell) * 100, note: "Margin after discount." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
