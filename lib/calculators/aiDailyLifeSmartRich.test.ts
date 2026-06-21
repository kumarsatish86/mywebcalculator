import { describe, expect, it } from "vitest";
import { discountOptimizerRich, expenseSplitterRich, fuelCostPredictorRich, lifestyleCostRich } from "./aiDailyLifeSmartRich";

describe("aiDailyLifeSmartRich", () => {
  it("splits group bill with tip", () => {
    const r = expenseSplitterRich({ total: 2000, people: 4, tipPct: 10, method: "equal" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.grandTotal).toBe(2200);
    expect(r.settlements.length).toBe(4);
  });

  it("computes lifestyle 50/30/20", () => {
    const r = lifestyleCostRich({ rent: 15000, food: 8000, transport: 3000, subscriptions: 1500, entertainment: 2000, savingsGoal: 5000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.total).toBeGreaterThan(0);
    expect(r.chartSlices?.length).toBe(3);
  });

  it("stacks discounts", () => {
    const r = discountOptimizerRich({ original: 5000, discountPct: 20, coupon: 200, cashbackPct: 5 });
    expect(r.finalPrice).toBeLessThan(5000);
    expect(r.effectiveDiscount).toBeGreaterThan(20);
  });

  it("predicts fuel for round trip", () => {
    const r = fuelCostPredictorRich({ distanceKm: 100, mileageKmPerL: 15, fuelPricePerL: 100, roundTrip: true });
    expect(r.liters).toBeCloseTo(200 / 15, 1);
    expect(r.totalCost).toBeGreaterThan(0);
  });
});
