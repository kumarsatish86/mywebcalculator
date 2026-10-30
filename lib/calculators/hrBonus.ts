/** HR performance & bonus — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrBonusSlug =
  | "hr-bonus-calculator"
  | "hr-incentive-calculator"
  | "hr-commission-calculator"
  | "hr-sales-incentive-calculator";

export const HR_BONUS_SLUGS: HrBonusSlug[] = [
  "hr-bonus-calculator",
  "hr-incentive-calculator",
  "hr-commission-calculator",
  "hr-sales-incentive-calculator",
];

export type HrBonusInput = {
  basicPlusDa?: number;
  bonusPct?: number;
  targetBonus?: number;
  achievementPct?: number;
  sales?: number;
  commissionPct?: number;
  tier2Sales?: number;
  tier2Pct?: number;
  baseIncentive?: number;
  multiplier?: number;
};

export function computeHrBonus(slug: HrBonusSlug, input: HrBonusInput): HrResult {
  switch (slug) {
    case "hr-bonus-calculator": {
      const base = pos(input.basicPlusDa ?? input.targetBonus, "Bonus base / basic+DA");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const pct = pos(input.bonusPct ?? 8.33, "Bonus %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const amount = base * (pct / 100);
      return { ok: true, amount, amount2: amount * 12, pct, note: "Bonus ≈ base × % (statutory teaching default often 8.33%)." };
    }
    case "hr-incentive-calculator": {
      const target = pos(input.targetBonus ?? input.baseIncentive, "Target incentive");
      if (typeof target !== "number") return { ok: false, error: target.error };
      const ach = nonNeg(input.achievementPct ?? 100, "Achievement %");
      if (typeof ach !== "number") return { ok: false, error: ach.error };
      const mult = input.multiplier && input.multiplier > 0 ? input.multiplier : 1;
      const amount = target * (ach / 100) * mult;
      return { ok: true, amount, pct: ach, note: "Incentive = target × achievement% × multiplier." };
    }
    case "hr-commission-calculator": {
      const sales = pos(input.sales, "Sales");
      if (typeof sales !== "number") return { ok: false, error: sales.error };
      const pct = pos(input.commissionPct ?? 5, "Commission %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, amount: sales * (pct / 100), pct, note: "Commission = sales × rate %." };
    }
    case "hr-sales-incentive-calculator": {
      const sales = pos(input.sales, "Sales (tier 1)");
      if (typeof sales !== "number") return { ok: false, error: sales.error };
      const p1 = pos(input.commissionPct ?? 3, "Tier 1 %");
      if (typeof p1 !== "number") return { ok: false, error: p1.error };
      const s2 = nonNeg(input.tier2Sales ?? 0, "Tier 2 sales");
      if (typeof s2 !== "number") return { ok: false, error: s2.error };
      const p2 = nonNeg(input.tier2Pct ?? 5, "Tier 2 %");
      if (typeof p2 !== "number") return { ok: false, error: p2.error };
      const amount = sales * (p1 / 100) + s2 * (p2 / 100);
      return { ok: true, amount, amount2: sales * (p1 / 100), amount3: s2 * (p2 / 100), note: "Tiered sales incentive sum." };
    }
    default:
      return { ok: false, error: "Unknown bonus calculator." };
  }
}
