import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  adBudgetOptimizerRich,
  businessCostOptimizerRich,
  campaignPerformanceRich,
  meetingTimeOptimizerRich,
  pricingStrategyRich,
  profitAnalyzerRich,
  roiAdvisorRich,
  roiPredictorAdsRich,
  taskPrioritizerRich,
  workloadPlannerRich,
} from "@/lib/calculators/aiBusinessSmartRich";
import { parsePricingModel, type PricingModel } from "@/lib/calculators/aiBusinessSmart";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiBusinessHostTypes";

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
      schedule?: { time: string; activity: string }[];
      steps?: { step: number; text: string }[];
      rankedItems?: { name: string; score: number; status: string }[];
      milestones?: { week: number; target: number }[];
      usageTips?: string[];
      phases?: { phase: string; days: number; focus: string }[];
      pricingTiers?: { tier: string; price: number; marginPct: number }[];
      funnelSteps?: { stage: string; count: number; rate: string }[];
      rankedLevers?: { name: string; save: number; effort: string }[];
      quadrants?: { quadrant: string; tasks: string[] }[];
    };

export type HostInputs = Record<string, string | PricingModel>;

export function computeBusinessHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "profitAnalyzer": {
      const rev = parsePositive(String(raw.rev || "500000"), "Revenue");
      const cogs = parseNonNegative(String(raw.cogs || "180000"), "COGS");
      const opex = parseNonNegative(String(raw.opex || "200000"), "Opex");
      if (!rev.ok) return { error: rev.error };
      if (!cogs.ok) return { error: cogs.error };
      if (!opex.ok) return { error: opex.error };
      const r = profitAnalyzerRich({
        revenue: rev.value,
        cogs: cogs.value,
        opex: opex.value,
        growthPct: Number(raw.gr) || 3,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.netMargin.toFixed(1)}%`,
        primaryLabel: `Net margin · ₹${Math.round(r.netProfit).toLocaleString("en-IN")} profit`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        usageTips: r.usageTips,
        rows: [
          { label: "Gross margin", value: `${r.grossMargin.toFixed(1)}%` },
          { label: "Breakeven rev", value: `₹${Math.round(r.breakevenRevenue).toLocaleString("en-IN")}` },
        ],
      };
    }
    case "roiAdvisor": {
      const inv = parsePositive(String(raw.inv || "100000"), "Investment");
      const ret = parseNonNegative(String(raw.ret || "140000"), "Returns");
      const mo = parsePositive(String(raw.mo || "12"), "Months");
      if (!inv.ok) return { error: inv.error };
      if (!ret.ok) return { error: ret.error };
      if (!mo.ok) return { error: mo.error };
      const r = roiAdvisorRich({ investment: inv.value, returns: ret.value, months: mo.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.roiPct.toFixed(1)}%`,
        primaryLabel: "ROI over period",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        projection: r.projection,
        chartSlices: r.chartSlices,
        steps: r.steps,
        milestones: r.milestones,
        rows: [
          { label: "Payback", value: `${Math.ceil(r.paybackMonths)} mo` },
          { label: "Annualized", value: `${r.annualized.toFixed(1)}%` },
        ],
      };
    }
    case "costOptimizer": {
      const rev = parsePositive(String(raw.rev || "800000"), "Revenue");
      const fix = parseNonNegative(String(raw.fix || "150000"), "Fixed costs");
      const v = parseNonNegative(String(raw.var || "320000"), "Variable costs");
      if (!rev.ok) return { error: rev.error };
      if (!fix.ok) return { error: fix.error };
      if (!v.ok) return { error: v.error };
      const r = businessCostOptimizerRich({ revenue: rev.value, fixed: fix.value, variable: v.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.costRatio.toFixed(0)}%`,
        primaryLabel: "Cost-to-revenue ratio",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        phases: r.phases,
        projection: r.projection,
        scenarios: r.scenarios,
        rankedLevers: r.rankedLevers,
        rows: [
          { label: "Savings potential", value: `₹${r.savingsPotential.toLocaleString("en-IN")}` },
          { label: "Margin after save", value: `${r.marginAfterSave.toFixed(1)}%` },
        ],
      };
    }
    case "pricingStrategy": {
      const cost = parsePositive(String(raw.cost || "500"), "Unit cost");
      const mar = parseAprPercent(String(raw.mar || "35"), "Target margin");
      const cmp = parseNonNegative(String(raw.cmp || "899"), "Competitor price");
      if (!cost.ok) return { error: cost.error };
      if (!mar.ok) return { error: mar.error };
      if (!cmp.ok) return { error: cmp.error };
      const r = pricingStrategyRich({
        unitCost: cost.value,
        targetMargin: mar.value,
        competitorPrice: cmp.value,
        model: parsePricingModel(String(raw.model || "cost-plus")),
        monthlyUnits: Number(raw.units) || 100,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${r.recommendedPrice.toLocaleString("en-IN")}`,
        primaryLabel: `Recommended price · ₹${r.projectedRevenue.toLocaleString("en-IN")}/mo`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        pricingTiers: r.pricingTiers,
        steps: r.steps,
        usageTips: r.usageTips,
        rows: [
          { label: "Floor", value: `₹${r.floorPrice.toLocaleString("en-IN")}` },
          { label: "Ceiling", value: `₹${r.ceilingPrice.toLocaleString("en-IN")}` },
        ],
      };
    }
    case "adBudget": {
      const rev = parsePositive(String(raw.rev || "500000"), "Revenue");
      const ads = parseNonNegative(String(raw.ads || "80000"), "Ad spend");
      const roas = parsePositive(String(raw.roas || "4"), "Target ROAS");
      if (!rev.ok) return { error: rev.error };
      if (!ads.ok) return { error: ads.error };
      if (!roas.ok) return { error: roas.error };
      const r = adBudgetOptimizerRich({
        revenue: rev.value,
        adSpend: ads.value,
        targetRoas: roas.value,
        adAttributionPct: Number(raw.attr) || 40,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${Math.round(r.optimalSpend).toLocaleString("en-IN")}`,
        primaryLabel: `Optimal spend · ${r.currentRoas.toFixed(1)}x ROAS · ${r.mer.toFixed(1)}x MER`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        scenarios: r.scenarios,
        rows: [{ label: "Incremental rev", value: `₹${Math.round(r.incrementalRevenue).toLocaleString("en-IN")}` }],
      };
    }
    case "roiPredictorAds": {
      const ads = parsePositive(String(raw.ads || "50000"), "Ad spend");
      const adr = parseNonNegative(String(raw.adr || "180000"), "Ad revenue");
      const mo = parsePositive(String(raw.mo || "3"), "Months");
      if (!ads.ok) return { error: ads.error };
      if (!adr.ok) return { error: adr.error };
      if (!mo.ok) return { error: mo.error };
      const r = roiPredictorAdsRich({ adSpend: ads.value, adRevenue: adr.value, months: mo.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.roas.toFixed(2)}x`,
        primaryLabel: `ROAS · ${r.roiPct.toFixed(0)}% ROI`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        milestones: r.milestones,
        projection: r.projection,
        scenarios: r.scenarios,
        steps: r.steps,
        rows: [
          { label: "Profit", value: `₹${Math.round(r.profit).toLocaleString("en-IN")}` },
          { label: "Monthly profit", value: `₹${Math.round(r.monthlyProfit).toLocaleString("en-IN")}` },
        ],
      };
    }
    case "campaignPerformance": {
      const imp = parsePositive(String(raw.imp || "100000"), "Impressions");
      const clk = parseNonNegative(String(raw.clk || "2500"), "Clicks");
      const cnv = parseNonNegative(String(raw.cnv || "85"), "Conversions");
      const spend = parseNonNegative(String(raw.ads || "45000"), "Spend");
      if (!imp.ok) return { error: imp.error };
      if (!clk.ok) return { error: clk.error };
      if (!cnv.ok) return { error: cnv.error };
      if (!spend.ok) return { error: spend.error };
      const r = campaignPerformanceRich({
        impressions: imp.value,
        clicks: clk.value,
        conversions: cnv.value,
        spend: spend.value,
        ltv: Number(raw.ltv) || 2000,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.ctr.toFixed(2)}%`,
        primaryLabel: `CTR · ${r.roasProxy.toFixed(1)}x ROAS proxy · LTV/CPA ${r.cpa > 0 ? (Number(raw.ltv || 2000) / r.cpa).toFixed(1) : "—"}x`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
        funnelSteps: r.funnelSteps,
        steps: r.steps,
        projection: r.projection,
        rows: [{ label: "CPA", value: r.cpa > 0 && r.cpa < 900 ? `₹${Math.round(r.cpa).toLocaleString("en-IN")}` : "—" }],
      };
    }
    case "workloadPlanner": {
      const hrs = parsePositive(String(raw.hrs || "8"), "Hours available");
      if (!hrs.ok) return { error: hrs.error };
      const r = workloadPlannerRich({
        hoursAvailable: hrs.value,
        tasks: [
          { name: String(raw.t1 || "Deep work"), hours: Number(raw.h1) || 3 },
          { name: String(raw.t2 || "Meetings"), hours: Number(raw.h2) || 2 },
          { name: String(raw.t3 || "Admin"), hours: Number(raw.h3) || 1.5 },
          { name: String(raw.t4 || "Email"), hours: Number(raw.h4) || 1 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.utilization.toFixed(0)}%`,
        primaryLabel: `${r.totalHours}h scheduled of ${hrs.value}h`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        phases: r.phases,
        milestones: r.milestones,
        usageTips: r.usageTips,
        rows: [{ label: "Buffer", value: `${r.bufferHours.toFixed(1)}h` }],
      };
    }
    case "taskPrioritizer": {
      const r = taskPrioritizerRich({
        tasks: [
          { name: String(raw.t1 || "Launch feature"), urgency: Number(raw.u1) || 8, importance: Number(raw.i1) || 9 },
          { name: String(raw.t2 || "Client report"), urgency: Number(raw.u2) || 7, importance: Number(raw.i2) || 6 },
          { name: String(raw.t3 || "Inbox zero"), urgency: Number(raw.u3) || 5, importance: Number(raw.i3) || 3 },
          { name: String(raw.t4 || "Team sync prep"), urgency: Number(raw.u4) || 6, importance: Number(raw.i4) || 7 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.topTask,
        primaryLabel: "Top priority task",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
        quadrants: r.quadrants,
        schedule: r.schedule,
        steps: r.steps,
        rows: [{ label: "Do-first count", value: String(r.doFirstCount) }],
      };
    }
    case "meetingOptimizer": {
      const mtg = parseNonNegative(String(raw.mtg || "12"), "Meetings per week");
      const mdur = parsePositive(String(raw.mdur || "45"), "Avg duration (min)");
      const fcs = parsePositive(String(raw.fcs || "6"), "Focus hours/day");
      const team = parsePositive(String(raw.team || "5"), "Team size");
      if (!mtg.ok) return { error: mtg.error };
      if (!mdur.ok) return { error: mdur.error };
      if (!fcs.ok) return { error: fcs.error };
      if (!team.ok) return { error: team.error };
      const r = meetingTimeOptimizerRich({
        meetingsPerWeek: mtg.value,
        avgDurationMin: mdur.value,
        focusHoursPerDay: fcs.value,
        teamSize: team.value,
        hourlyRate: Number(raw.rate) || 800,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.focusPct.toFixed(0)}%`,
        primaryLabel: `Focus time · cut to ${r.targetMeetings} meetings/wk target`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        steps: r.steps,
        usageTips: r.usageTips,
        projection: r.projection,
        scenarios: r.scenarios,
        milestones: r.milestones,
        rows: [
          { label: "Weekly cost", value: `₹${Math.round(r.costEstimate).toLocaleString("en-IN")}` },
          { label: "Annual cost", value: `₹${Math.round(r.annualCost).toLocaleString("en-IN")}` },
        ],
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
