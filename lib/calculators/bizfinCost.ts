/** Business finance — cost & expense teaching estimates. */
import { pos, nonNeg } from "./bizfinHelpers";

export type BizfinCostSlug =
  | "bizfin-cost-price-calculator"
  | "bizfin-selling-price-calculator"
  | "bizfin-break-even-calculator"
  | "bizfin-fixed-cost-calculator"
  | "bizfin-variable-cost-calculator"
  | "bizfin-total-cost-calculator"
  | "bizfin-unit-cost-calculator"
  | "bizfin-overhead-cost-calculator"
  | "bizfin-cogs-calculator"
  | "bizfin-production-cost-calculator";
export const BIZFIN_COST_SLUGS: BizfinCostSlug[] = [
  "bizfin-cost-price-calculator",
  "bizfin-selling-price-calculator",
  "bizfin-break-even-calculator",
  "bizfin-fixed-cost-calculator",
  "bizfin-variable-cost-calculator",
  "bizfin-total-cost-calculator",
  "bizfin-unit-cost-calculator",
  "bizfin-overhead-cost-calculator",
  "bizfin-cogs-calculator",
  "bizfin-production-cost-calculator",
];


export type BizfinCostInput = {
  cost?: number;
  markupPct?: number;
  marginPct?: number;
  sellingPrice?: number;
  fixedCosts?: number;
  variablePerUnit?: number;
  pricePerUnit?: number;
  fixedA?: number;
  fixedB?: number;
  fixedC?: number;
  units?: number;
  variableTotal?: number;
  overhead?: number;
  beginningInventory?: number;
  purchases?: number;
  endingInventory?: number;
  materials?: number;
  labor?: number;
};

export type BizfinCostResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinCost(slug: BizfinCostSlug, input: BizfinCostInput): BizfinCostResult {
  switch (slug) {
    case "bizfin-cost-price-calculator": {
      const sell = pos(input.sellingPrice, "Selling price");
      if (typeof sell !== "number") return { ok: false, error: sell.error };
      if (input.marginPct !== undefined) {
        const m = pos(input.marginPct, "Margin %");
        if (typeof m !== "number") return { ok: false, error: m.error };
        if (m >= 100) return { ok: false, error: "Margin % must be < 100." };
        return { ok: true, value: sell * (1 - m / 100), note: "Cost = sell × (1 − margin%)." };
      }
      const markup = nonNeg(input.markupPct ?? 0, "Markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      return { ok: true, value: sell / (1 + markup / 100), note: "Cost = sell ÷ (1 + markup%)." };
    }
    case "bizfin-selling-price-calculator": {
      const cost = pos(input.cost, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      if (input.marginPct !== undefined) {
        const m = pos(input.marginPct, "Target margin %");
        if (typeof m !== "number") return { ok: false, error: m.error };
        if (m >= 100) return { ok: false, error: "Margin % must be < 100." };
        return { ok: true, value: cost / (1 - m / 100), note: "Sell = cost ÷ (1 − margin%)." };
      }
      const markup = nonNeg(input.markupPct ?? 0, "Markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      return { ok: true, value: cost * (1 + markup / 100), note: "Sell = cost × (1 + markup%)." };
    }
    case "bizfin-break-even-calculator": {
      const fixed = pos(input.fixedCosts, "Fixed costs");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const price = pos(input.pricePerUnit, "Price per unit");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const vc = nonNeg(input.variablePerUnit ?? 0, "Variable cost / unit");
      if (typeof vc !== "number") return { ok: false, error: vc.error };
      const contrib = price - vc;
      if (contrib <= 0) return { ok: false, error: "Contribution per unit must be positive." };
      return { ok: true, value: fixed / contrib, secondary: fixed / (contrib / price), note: "Break-even units = fixed ÷ (price − variable/unit)." };
    }
    case "bizfin-fixed-cost-calculator": {
      const a = nonNeg(input.fixedA ?? input.fixedCosts ?? 0, "Fixed cost A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = nonNeg(input.fixedB ?? 0, "Fixed cost B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const c = nonNeg(input.fixedC ?? 0, "Fixed cost C");
      if (typeof c !== "number") return { ok: false, error: c.error };
      return { ok: true, value: a + b + c, note: "Total fixed = sum of fixed cost lines." };
    }
    case "bizfin-variable-cost-calculator": {
      const per = nonNeg(input.variablePerUnit, "Variable cost / unit");
      if (typeof per !== "number") return { ok: false, error: per.error };
      const units = pos(input.units, "Units");
      if (typeof units !== "number") return { ok: false, error: units.error };
      return { ok: true, value: per * units, note: "Variable cost = unit variable × units." };
    }
    case "bizfin-total-cost-calculator": {
      const fixed = nonNeg(input.fixedCosts ?? 0, "Fixed costs");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const variable = nonNeg(input.variableTotal ?? ((input.variablePerUnit ?? 0) * (input.units ?? 0)), "Variable costs");
      if (typeof variable !== "number") return { ok: false, error: variable.error };
      return { ok: true, value: fixed + variable, note: "Total cost = fixed + variable." };
    }
    case "bizfin-unit-cost-calculator": {
      const total = pos(input.cost ?? ((input.fixedCosts ?? 0) + (input.variableTotal ?? 0)), "Total cost");
      if (typeof total !== "number") return { ok: false, error: total.error };
      const units = pos(input.units, "Units");
      if (typeof units !== "number") return { ok: false, error: units.error };
      return { ok: true, value: total / units, note: "Unit cost = total cost ÷ units." };
    }
    case "bizfin-overhead-cost-calculator": {
      const overhead = pos(input.overhead, "Total overhead");
      if (typeof overhead !== "number") return { ok: false, error: overhead.error };
      if (input.units !== undefined && input.units > 0) {
        return { ok: true, value: overhead / input.units, secondary: overhead, note: "Overhead per unit = total overhead ÷ units." };
      }
      return { ok: true, value: overhead, note: "Total overhead as entered." };
    }
    case "bizfin-cogs-calculator": {
      const begin = nonNeg(input.beginningInventory ?? 0, "Beginning inventory");
      if (typeof begin !== "number") return { ok: false, error: begin.error };
      const purchases = nonNeg(input.purchases ?? 0, "Purchases");
      if (typeof purchases !== "number") return { ok: false, error: purchases.error };
      const ending = nonNeg(input.endingInventory ?? 0, "Ending inventory");
      if (typeof ending !== "number") return { ok: false, error: ending.error };
      return { ok: true, value: begin + purchases - ending, note: "COGS = beginning + purchases − ending." };
    }
    case "bizfin-production-cost-calculator": {
      const materials = nonNeg(input.materials ?? 0, "Materials");
      if (typeof materials !== "number") return { ok: false, error: materials.error };
      const labor = nonNeg(input.labor ?? 0, "Labor");
      if (typeof labor !== "number") return { ok: false, error: labor.error };
      const overhead = nonNeg(input.overhead ?? 0, "Overhead");
      if (typeof overhead !== "number") return { ok: false, error: overhead.error };
      return { ok: true, value: materials + labor + overhead, note: "Production cost = materials + labor + overhead." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
