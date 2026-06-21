import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  businessIdeaGeneratorRich,
  careerPathAdvisorRich,
  incomeGrowthPlannerRich,
  sideHustleFinderRich,
  skillGapAnalyzerRich,
} from "@/lib/calculators/aiPersonalizedSmartRich";
import { parseCareerField, parseEducation, parseRisk, type CareerField, type EducationLevel, type RiskLevel } from "@/lib/calculators/aiPersonalizedSmart";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiPersonalizedHostTypes";

export type HostResult =
  | { error: string }
  | {
      primary: string;
      primaryLabel: string;
      rows?: { label: string; value: string }[];
      healthScore?: number;
      grade?: string;
      insights?: AiInsight[];
      chartSlices?: ChartSlice[];
      compareRows?: { label: string; target: number; actual: number }[];
      projection?: { month: number; balance: number }[];
      scenarios?: { label: string; months: number; monthly: number }[];
      steps?: { step: number; text: string }[];
      rankedItems?: { name: string; score: number; status: string }[];
      milestones?: { week: number; target: number }[];
      usageTips?: string[];
      phases?: { phase: string; days: number; focus: string }[];
      rankedLevers?: { name: string; save: number; effort: string }[];
      skillGaps?: { skill: string; gap: number; priority: string }[];
      ideaScores?: { idea: string; score: number; fit: string }[];
    };

export type HostInputs = Record<string, string | CareerField | EducationLevel | RiskLevel>;

export function computePersonalizedHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "careerPath": {
      const exp = parseNonNegative(String(raw.exp || "3"), "Years of experience");
      const skills = parseNonNegative(String(raw.skills || "4"), "Relevant skills");
      if (!exp.ok) return { error: exp.error };
      if (!skills.ok) return { error: skills.error };
      const r = careerPathAdvisorRich({
        yearsExp: exp.value,
        currentField: parseCareerField(String(raw.curr || "tech")),
        targetField: parseCareerField(String(raw.target || "tech")),
        skillCount: skills.value,
        education: parseEducation(String(raw.edu || "bachelor")),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.fitScore.toFixed(0)}/100`,
        primaryLabel: `Career fit · next role: ${r.nextRole}`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        phases: r.phases,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        usageTips: r.usageTips,
        rows: [{ label: "Years to target", value: `${r.yearsToTarget} yrs` }],
      };
    }
    case "skillGap": {
      const r = skillGapAnalyzerRich({
        targetRole: String(raw.role || "software-engineer"),
        currentLevels: [Number(raw.s1) || 6, Number(raw.s2) || 5, Number(raw.s3) || 4, Number(raw.s4) || 5],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.readinessScore.toFixed(0)}%`,
        primaryLabel: `Role readiness · ${r.totalGap} gap points`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        phases: r.phases,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        skillGaps: r.skillGaps,
        rows: [{ label: "Top gap", value: r.skillGaps?.[0]?.skill ?? "—" }],
      };
    }
    case "sideHustle": {
      const hrs = parsePositive(String(raw.hrs || "10"), "Hours per week");
      const cap = parseNonNegative(String(raw.cap || "15000"), "Capital");
      const skill = parseNonNegative(String(raw.skills || "6"), "Skill score");
      if (!hrs.ok) return { error: hrs.error };
      if (!cap.ok) return { error: cap.error };
      if (!skill.ok) return { error: skill.error };
      const r = sideHustleFinderRich({ hoursPerWeek: hrs.value, capital: cap.value, skillScore: skill.value, risk: parseRisk(String(raw.risk || "low")) });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.topHustle,
        primaryLabel: `Est. ₹${r.monthlyPotential.toLocaleString("en-IN")}/mo potential`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
        scenarios: r.scenarios,
        milestones: r.milestones,
        steps: r.steps,
        rows: [{ label: "Hours/week", value: `${hrs.value}h` }],
      };
    }
    case "businessIdea": {
      const bud = parseNonNegative(String(raw.bud || "80000"), "Budget");
      const mkt = parseNonNegative(String(raw.mkt || "7"), "Market score");
      const comp = parseNonNegative(String(raw.comp || "6"), "Competition");
      if (!bud.ok) return { error: bud.error };
      if (!mkt.ok) return { error: mkt.error };
      if (!comp.ok) return { error: comp.error };
      const r = businessIdeaGeneratorRich({
        interest1: String(raw.int1 || "education"),
        interest2: String(raw.int2 || "tech"),
        budget: bud.value,
        marketScore: Math.min(10, mkt.value),
        competitionScore: Math.min(10, comp.value),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.topIdea,
        primaryLabel: `Idea fit ${r.topScore}/100`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
        ideaScores: r.ideaScores,
        scenarios: r.scenarios,
        phases: r.phases,
        steps: r.steps,
        rows: [{ label: "Budget", value: `₹${bud.value.toLocaleString("en-IN")}` }],
      };
    }
    case "incomeGrowth": {
      const inc = parsePositive(String(raw.inc || "65000"), "Current income");
      const goal = parsePositive(String(raw.goal || "100000"), "Goal income");
      const save = parseAprPercent(String(raw.save || "15"), "Savings rate");
      const inv = parseNonNegative(String(raw.inv || "30000"), "Skill investment");
      const mo = parsePositive(String(raw.mo || "18"), "Timeline months");
      if (!inc.ok) return { error: inc.error };
      if (!goal.ok) return { error: goal.error };
      if (!save.ok) return { error: save.error };
      if (!inv.ok) return { error: inv.error };
      if (!mo.ok) return { error: mo.error };
      const r = incomeGrowthPlannerRich({
        currentIncome: inc.value,
        goalIncome: goal.value,
        savingsRate: save.value,
        skillInvestment: inv.value,
        months: mo.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.growthNeeded.toFixed(1)}%/yr`,
        primaryLabel: `Growth needed · projected ₹${Math.round(r.projectedIncome).toLocaleString("en-IN")}/mo`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        scenarios: r.scenarios,
        milestones: r.milestones,
        steps: r.steps,
        rankedLevers: r.rankedLevers,
        rows: [
          { label: "Gap", value: `₹${Math.round(r.gapAmount).toLocaleString("en-IN")}/mo` },
          { label: "Savings rate", value: `${save.value}%` },
        ],
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
