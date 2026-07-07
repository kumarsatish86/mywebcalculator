import { describe, expect, it } from "vitest";
import {
  aiCareerGrowthPredict,
  aiIncomePlan,
  aiOfferAnalyze,
  aiSalaryEstimate,
  aiSalaryNegotiation,
} from "./aiPoweredSalary";

describe("aiPoweredSalary", () => {
  it("estimates salary from role and experience", () => {
    const result = aiSalaryEstimate({
      baseMarketAnnual: 1000000,
      yearsExperience: 5,
      locationTier: "metro",
      skillsScore: 8,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.estimatedAnnual).toBeGreaterThan(1000000);
    expect(result.rangeHigh).toBeGreaterThan(result.estimatedAnnual);
  });

  it("analyzes offer vs market", () => {
    const result = aiOfferAnalyze({
      offerAnnual: 1200000,
      marketMedianAnnual: 1000000,
      bonusPercent: 10,
      benefitsPercent: 12,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.offerScore).toBeGreaterThan(55);
    expect(result.verdict).toBe("strong");
  });

  it("suggests negotiation ask", () => {
    const result = aiSalaryNegotiation({
      currentOfferAnnual: 900000,
      marketMedianAnnual: 1100000,
      walkAwayAnnual: 950000,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.recommendedAskAnnual).toBeGreaterThan(900000);
  });

  it("projects career growth", () => {
    const result = aiCareerGrowthPredict({
      currentAnnual: 800000,
      annualRaisePercent: 10,
      yearsToProject: 5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.projections).toHaveLength(5);
    expect(result.endingSalary).toBeGreaterThan(800000);
  });

  it("plans income to target", () => {
    const result = aiIncomePlan({
      currentAnnual: 600000,
      targetAnnual: 1200000,
      yearsHorizon: 10,
      annualRaisePercent: 12,
      sideIncomeMonthly: 10000,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.projectedAnnualAtHorizon).toBeGreaterThan(600000);
  });
});
