/** Business finance — inventory & supply chain teaching estimates. */
import { pos, nonNeg } from "./bizfinHelpers";

export type BizfinInventorySlug =
  | "bizfin-inventory-cost-calculator"
  | "bizfin-eoq-calculator"
  | "bizfin-safety-stock-calculator"
  | "bizfin-reorder-point-calculator"
  | "bizfin-inventory-turnover-operations-calculator"
  | "bizfin-holding-cost-calculator"
  | "bizfin-order-quantity-calculator";
export const BIZFIN_INVENTORY_SLUGS: BizfinInventorySlug[] = [
  "bizfin-inventory-cost-calculator",
  "bizfin-eoq-calculator",
  "bizfin-safety-stock-calculator",
  "bizfin-reorder-point-calculator",
  "bizfin-inventory-turnover-operations-calculator",
  "bizfin-holding-cost-calculator",
  "bizfin-order-quantity-calculator",
];


export type BizfinInventoryInput = {
  units?: number;
  unitCost?: number;
  holdingPct?: number;
  demand?: number;
  orderCost?: number;
  holdingCost?: number;
  zScore?: number;
  demandStd?: number;
  leadTime?: number;
  avgDemand?: number;
  safetyStock?: number;
  cogs?: number;
  avgInventory?: number;
  days?: number;
};

export type BizfinInventoryResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinInventory(slug: BizfinInventorySlug, input: BizfinInventoryInput): BizfinInventoryResult {
  switch (slug) {
    case "bizfin-inventory-cost-calculator": {
      const units = pos(input.units ?? input.avgInventory, "Units");
      if (typeof units !== "number") return { ok: false, error: units.error };
      const unitCost = pos(input.unitCost, "Unit cost");
      if (typeof unitCost !== "number") return { ok: false, error: unitCost.error };
      const holdingPct = nonNeg(input.holdingPct ?? 0, "Holding %");
      if (typeof holdingPct !== "number") return { ok: false, error: holdingPct.error };
      const inventoryValue = units * unitCost;
      const holding = inventoryValue * (holdingPct / 100);
      return { ok: true, value: inventoryValue + holding, secondary: inventoryValue, note: "Inventory cost ≈ value + holding." };
    }
    case "bizfin-eoq-calculator": {
      const D = pos(input.demand, "Annual demand");
      if (typeof D !== "number") return { ok: false, error: D.error };
      const S = pos(input.orderCost, "Order cost S");
      if (typeof S !== "number") return { ok: false, error: S.error };
      const H = pos(input.holdingCost, "Holding cost H / unit / year");
      if (typeof H !== "number") return { ok: false, error: H.error };
      return { ok: true, value: Math.sqrt((2 * D * S) / H), note: "EOQ = √(2DS/H)." };
    }
    case "bizfin-safety-stock-calculator": {
      const z = pos(input.zScore ?? 1.65, "Z-score");
      if (typeof z !== "number") return { ok: false, error: z.error };
      const sigma = pos(input.demandStd, "Demand std. deviation");
      if (typeof sigma !== "number") return { ok: false, error: sigma.error };
      const lead = pos(input.leadTime ?? 1, "Lead time");
      if (typeof lead !== "number") return { ok: false, error: lead.error };
      return { ok: true, value: z * sigma * Math.sqrt(lead), note: "Safety stock ≈ z × σ × √lead." };
    }
    case "bizfin-reorder-point-calculator": {
      const demand = pos(input.avgDemand ?? input.demand, "Demand during period");
      if (typeof demand !== "number") return { ok: false, error: demand.error };
      const lead = pos(input.leadTime, "Lead time");
      if (typeof lead !== "number") return { ok: false, error: lead.error };
      const safety = nonNeg(input.safetyStock ?? 0, "Safety stock");
      if (typeof safety !== "number") return { ok: false, error: safety.error };
      return { ok: true, value: demand * lead + safety, note: "ROP = demand × lead time + safety stock." };
    }
    case "bizfin-inventory-turnover-operations-calculator": {
      const cogs = pos(input.cogs, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const avg = pos(input.avgInventory ?? input.units, "Average inventory");
      if (typeof avg !== "number") return { ok: false, error: avg.error };
      return { ok: true, value: cogs / avg, secondary: 365 / (cogs / avg), note: "Turnover = COGS ÷ avg inventory; days ≈ 365 ÷ turns." };
    }
    case "bizfin-holding-cost-calculator": {
      const avg = pos(input.avgInventory ?? input.units, "Average inventory value");
      if (typeof avg !== "number") return { ok: false, error: avg.error };
      if (input.holdingCost !== undefined) {
        const h = pos(input.holdingCost, "Holding cost / unit");
        if (typeof h !== "number") return { ok: false, error: h.error };
        const units = pos(input.units ?? 1, "Units");
        if (typeof units !== "number") return { ok: false, error: units.error };
        return { ok: true, value: h * units, note: "Holding cost = H × units." };
      }
      const pct = pos(input.holdingPct, "Holding %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, value: avg * (pct / 100), note: "Holding cost = inventory value × holding %." };
    }
    case "bizfin-order-quantity-calculator": {
      const demand = pos(input.demand, "Demand over horizon");
      if (typeof demand !== "number") return { ok: false, error: demand.error };
      const days = pos(input.days ?? input.leadTime ?? 1, "Days / periods in horizon");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const orders = pos(input.units ?? 1, "Number of orders");
      if (typeof orders !== "number") return { ok: false, error: orders.error };
      return { ok: true, value: demand / orders, secondary: demand / days, note: "Order qty ≈ demand ÷ # orders." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
