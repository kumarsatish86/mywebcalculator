import { describe, expect, it } from "vitest";
import {
  businessIdeaGeneratorRich,
  careerPathAdvisorRich,
  incomeGrowthPlannerRich,
  sideHustleFinderRich,
  skillGapAnalyzerRich,
} from "./aiPersonalizedSmartRich";

describe("aiPersonalizedSmartRich", () => {
  it("advises career path with phases", () => {
    const r = careerPathAdvisorRich({ yearsExp: 3, currentField: "tech", targetField: "tech", skillCount: 4, education: "bachelor" });
    expect(r.fitScore).toBeGreaterThan(50);
    expect(r.phases?.length).toBe(3);
    expect(r.nextRole).toBeTruthy();
  });

  it("analyzes skill gaps", () => {
    const r = skillGapAnalyzerRich({ targetRole: "software-engineer", currentLevels: [6, 5, 4, 5] });
    expect(r.readinessScore).toBeLessThan(100);
    expect(r.skillGaps?.length).toBe(4);
  });

  it("ranks side hustles", () => {
    const r = sideHustleFinderRich({ hoursPerWeek: 10, capital: 15000, skillScore: 6, risk: "low" });
    expect(r.topHustle).toBeTruthy();
    expect(r.rankedItems?.length).toBeGreaterThan(0);
    expect(r.scenarios?.length).toBe(3);
  });

  it("scores business ideas", () => {
    const r = businessIdeaGeneratorRich({ interest1: "education", interest2: "tech", budget: 80000, marketScore: 7, competitionScore: 6 });
    expect(r.topScore).toBeGreaterThan(0);
    expect(r.ideaScores?.length).toBeGreaterThan(0);
  });

  it("plans income growth", () => {
    const r = incomeGrowthPlannerRich({ currentIncome: 65000, goalIncome: 100000, savingsRate: 15, skillInvestment: 30000, months: 18 });
    expect(r.growthNeeded).toBeGreaterThan(0);
    expect(r.projection?.length).toBeGreaterThan(0);
    expect(r.rankedLevers?.length).toBeGreaterThan(0);
  });
});
