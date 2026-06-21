import { describe, expect, it } from "vitest";
import {
  apiCostEstimatorRich,
  cloudCostCalculatorRich,
  codeComplexityRich,
  complianceGapAnalyzerRich,
  riskScoreCalculatorRich,
  securityBudgetPlannerRich,
  serverCapacityPlannerRich,
  vulnerabilityImpactRich,
} from "./aiDeveloperSmartRich";

describe("aiDeveloperSmartRich", () => {
  it("scores code complexity with hotspots", () => {
    const r = codeComplexityRich({ loc: 12000, cyclomaticAvg: 14, nestingDepth: 6, functionCount: 80, testCoverage: 25 });
    expect(r.complexityScore).toBeLessThan(75);
    expect(r.hotspots?.length).toBe(4);
    expect(r.debtHours).toBeGreaterThan(0);
  });

  it("estimates API costs with levers", () => {
    const r = apiCostEstimatorRich({ requestsPerMonth: 500000, inputTokens: 800, outputTokens: 400, pricePer1M: 2500 });
    expect(r.monthlyCost).toBeGreaterThan(0);
    expect(r.rankedLevers?.length).toBeGreaterThan(0);
    expect(r.scenarios?.length).toBe(3);
  });

  it("breaks down cloud costs", () => {
    const r = cloudCostCalculatorRich({ computeHours: 720, storageGb: 500, egressGb: 200, instances: 4 });
    expect(r.monthlyTotal).toBeGreaterThan(0);
    expect(r.rankedLevers?.length).toBeGreaterThan(0);
  });

  it("plans server capacity", () => {
    const r = serverCapacityPlannerRich({ rps: 850, latencyMs: 120, cpuCores: 8, memoryGb: 32, headroomPct: 25 });
    expect(r.utilizationPct).toBeGreaterThan(0);
    expect(r.recommendedCores).toBeGreaterThanOrEqual(8);
  });

  it("calculates security risk score", () => {
    const r = riskScoreCalculatorRich({ assetCount: 450, criticalVulns: 3, patchLagDays: 18, mfaCoverage: 78, backupScore: 6 });
    expect(r.riskScore).toBeLessThan(100);
    expect(r.rankedItems?.length).toBe(4);
  });

  it("prioritizes vulnerability impact", () => {
    const r = vulnerabilityImpactRich({ cvss: 7.8, exploitability: 6, assetsAffected: 12, exposure: "internet" });
    expect(r.impactScore).toBeGreaterThan(40);
    expect(r.priority).toContain("P");
  });

  it("analyzes compliance gaps", () => {
    const r = complianceGapAnalyzerRich({ framework: "soc2", controlsImplemented: 68, totalControls: 92, auditDays: 120 });
    expect(r.readinessScore).toBeCloseTo(73.9, 0);
    expect(r.controlGaps?.length).toBeGreaterThan(0);
  });

  it("plans security budget", () => {
    const r = securityBudgetPlannerRich({ annualRevenue: 50000000, currentSpend: 1800000, incidentScore: 4, complianceBurden: 6, employees: 85 });
    expect(r.recommendedSpend).toBeGreaterThan(r.currentSpend ? 0 : 0);
    expect(r.budgetAlloc?.length).toBe(6);
  });
});
