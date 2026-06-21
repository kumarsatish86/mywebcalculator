import { describe, expect, it } from "vitest";
import {
  adBudgetOptimizerRich,
  businessCostOptimizerRich,
  campaignPerformanceRich,
  meetingTimeOptimizerRich,
  pricingStrategyRich,
  profitAnalyzerRich,
  taskPrioritizerRich,
} from "./aiBusinessSmartRich";

describe("aiBusinessSmartRich", () => {
  it("analyzes profit margins with breakeven and projection", () => {
    const r = profitAnalyzerRich({ revenue: 500000, cogs: 180000, opex: 200000, growthPct: 5 });
    expect(r.netProfit).toBe(120000);
    expect(r.netMargin).toBeCloseTo(24, 0);
    expect(r.breakevenRevenue).toBeGreaterThan(200000);
    expect(r.projection?.length).toBe(13);
    expect(r.milestones?.length).toBe(4);
  });

  it("recommends pricing with tiers", () => {
    const r = pricingStrategyRich({ unitCost: 500, targetMargin: 35, competitorPrice: 899, model: "cost-plus", monthlyUnits: 120 });
    expect(r.recommendedPrice).toBeGreaterThan(500);
    expect(r.pricingTiers?.length).toBe(3);
    expect(r.projectedRevenue).toBeGreaterThan(0);
  });

  it("optimizes ad budget with attribution", () => {
    const r = adBudgetOptimizerRich({ revenue: 500000, adSpend: 80000, targetRoas: 4, adAttributionPct: 50 });
    expect(r.optimalSpend).toBeGreaterThan(0);
    expect(r.mer).toBeGreaterThan(0);
    expect(r.scenarios?.length).toBeGreaterThan(0);
  });

  it("analyzes campaign funnel with LTV", () => {
    const r = campaignPerformanceRich({ impressions: 100000, clicks: 2500, conversions: 85, spend: 45000, ltv: 2500 });
    expect(r.funnelSteps?.length).toBeGreaterThan(0);
    expect(r.cpa).toBeGreaterThan(0);
    expect(r.roasProxy).toBeGreaterThan(0);
  });

  it("ranks cost levers", () => {
    const r = businessCostOptimizerRich({ revenue: 800000, fixed: 150000, variable: 320000 });
    expect(r.rankedLevers?.length).toBeGreaterThan(0);
    expect(r.marginAfterSave).toBeGreaterThan(100 - r.costRatio);
  });

  it("prioritizes tasks with quadrants", () => {
    const r = taskPrioritizerRich({
      tasks: [
        { name: "Launch", urgency: 9, importance: 9 },
        { name: "Email", urgency: 4, importance: 2 },
      ],
    });
    expect(r.topTask).toBe("Launch");
    expect(r.quadrants?.length).toBe(4);
  });

  it("estimates meeting cost with hourly rate", () => {
    const r = meetingTimeOptimizerRich({ meetingsPerWeek: 12, avgDurationMin: 45, focusHoursPerDay: 6, teamSize: 5, hourlyRate: 1000 });
    expect(r.annualCost).toBeGreaterThan(r.costEstimate);
    expect(r.milestones?.length).toBeGreaterThan(0);
  });
});
