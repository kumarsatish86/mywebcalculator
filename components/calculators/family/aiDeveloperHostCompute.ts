import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  apiCostEstimatorRich,
  cloudCostCalculatorRich,
  codeComplexityRich,
  complianceGapAnalyzerRich,
  riskScoreCalculatorRich,
  securityBudgetPlannerRich,
  serverCapacityPlannerRich,
  vulnerabilityImpactRich,
} from "@/lib/calculators/aiDeveloperSmartRich";
import { parseExposure, parseFramework, type ComplianceFramework, type ExposureLevel } from "@/lib/calculators/aiDeveloperSmart";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiDeveloperHostTypes";

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
      rankedLevers?: { name: string; save: number; effort: string }[];
      hotspots?: { name: string; severity: string; metric: string }[];
      budgetAlloc?: { category: string; amount: number; pct: number }[];
      controlGaps?: { domain: string; gapPct: number; priority: string }[];
    };

export type HostInputs = Record<string, string | ComplianceFramework | ExposureLevel>;

export function computeDeveloperHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "codeComplexity": {
      const loc = parsePositive(String(raw.loc || "12000"), "Lines of code");
      const cc = parsePositive(String(raw.cc || "8"), "Cyclomatic complexity");
      const nest = parsePositive(String(raw.nest || "3"), "Nesting depth");
      const fn = parsePositive(String(raw.fn || "240"), "Function count");
      const cov = parseAprPercent(String(raw.cov || "62"), "Test coverage");
      if (!loc.ok) return { error: loc.error };
      if (!cc.ok) return { error: cc.error };
      if (!nest.ok) return { error: nest.error };
      if (!fn.ok) return { error: fn.error };
      if (!cov.ok) return { error: cov.error };
      const r = codeComplexityRich({ loc: loc.value, cyclomaticAvg: cc.value, nestingDepth: nest.value, functionCount: fn.value, testCoverage: cov.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.complexityScore.toFixed(0)}/100`,
        primaryLabel: `Maintainability · ~${r.debtHours}h refactor debt`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        rankedItems: r.rankedItems,
        hotspots: r.hotspots,
        rows: [
          { label: "Maintainability", value: `${r.maintainability}/100` },
          { label: "LOC / function", value: `${(loc.value / fn.value).toFixed(0)}` },
        ],
      };
    }
    case "apiCost": {
      const req = parsePositive(String(raw.req || "500000"), "Requests/month");
      const tin = parseNonNegative(String(raw.tin || "800"), "Input tokens");
      const tout = parseNonNegative(String(raw.tout || "400"), "Output tokens");
      const price = parsePositive(String(raw.price || "2500"), "Price per 1M tokens");
      if (!req.ok) return { error: req.error };
      if (!tin.ok) return { error: tin.error };
      if (!tout.ok) return { error: tout.error };
      if (!price.ok) return { error: price.error };
      const r = apiCostEstimatorRich({ requestsPerMonth: req.value, inputTokens: tin.value, outputTokens: tout.value, pricePer1M: price.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${Math.round(r.monthlyCost).toLocaleString("en-IN")}`,
        primaryLabel: `Monthly API cost · ₹${r.costPer1k.toFixed(2)}/1K requests`,
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
          { label: "Annual cost", value: `₹${Math.round(r.annualCost).toLocaleString("en-IN")}` },
          { label: "Tokens/request", value: `${Math.round(tin.value + tout.value)}` },
        ],
      };
    }
    case "cloudCost": {
      const compute = parseNonNegative(String(raw.compute || "720"), "Compute hours");
      const storage = parseNonNegative(String(raw.storage || "500"), "Storage GB");
      const egress = parseNonNegative(String(raw.egress || "200"), "Egress GB");
      const inst = parsePositive(String(raw.inst || "4"), "Instances");
      if (!compute.ok) return { error: compute.error };
      if (!storage.ok) return { error: storage.error };
      if (!egress.ok) return { error: egress.error };
      if (!inst.ok) return { error: inst.error };
      const r = cloudCostCalculatorRich({ computeHours: compute.value, storageGb: storage.value, egressGb: egress.value, instances: inst.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${Math.round(r.monthlyTotal).toLocaleString("en-IN")}`,
        primaryLabel: "Monthly cloud spend",
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
          { label: "Compute", value: `₹${Math.round(r.computeCost).toLocaleString("en-IN")}` },
          { label: "Storage + egress", value: `₹${Math.round(r.storageCost + r.egressCost).toLocaleString("en-IN")}` },
        ],
      };
    }
    case "serverCapacity": {
      const rps = parsePositive(String(raw.rps || "850"), "RPS");
      const lat = parsePositive(String(raw.lat || "120"), "Latency ms");
      const cpu = parsePositive(String(raw.cpu || "8"), "CPU cores");
      const mem = parsePositive(String(raw.mem || "32"), "Memory GB");
      const head = parseAprPercent(String(raw.head || "25"), "Headroom %");
      if (!rps.ok) return { error: rps.error };
      if (!lat.ok) return { error: lat.error };
      if (!cpu.ok) return { error: cpu.error };
      if (!mem.ok) return { error: mem.error };
      if (!head.ok) return { error: head.error };
      const r = serverCapacityPlannerRich({ rps: rps.value, latencyMs: lat.value, cpuCores: cpu.value, memoryGb: mem.value, headroomPct: head.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.utilizationPct.toFixed(0)}%`,
        primaryLabel: `CPU utilization · max ~${r.maxRps} RPS capacity`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
        schedule: r.schedule,
        scenarios: r.scenarios,
        rows: [
          { label: "Recommended cores", value: String(r.recommendedCores) },
          { label: "Recommended RAM", value: `${r.recommendedMem} GB` },
        ],
      };
    }
    case "riskScore": {
      const assets = parsePositive(String(raw.assets || "450"), "Assets");
      const crit = parseNonNegative(String(raw.crit || "3"), "Critical vulns");
      const patch = parseNonNegative(String(raw.patch || "18"), "Patch lag days");
      const mfa = parseAprPercent(String(raw.mfa || "78"), "MFA coverage");
      const backup = parseNonNegative(String(raw.backup || "6"), "Backup score");
      if (!assets.ok) return { error: assets.error };
      if (!crit.ok) return { error: crit.error };
      if (!patch.ok) return { error: patch.error };
      if (!mfa.ok) return { error: mfa.error };
      if (!backup.ok) return { error: backup.error };
      const r = riskScoreCalculatorRich({ assetCount: assets.value, criticalVulns: crit.value, patchLagDays: patch.value, mfaCoverage: mfa.value, backupScore: backup.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.riskScore.toFixed(0)}/100`,
        primaryLabel: `Security posture · ${r.residualRisk.toFixed(0)}% residual risk`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        rankedItems: r.rankedItems,
        rows: [{ label: "Critical vulns", value: String(crit.value) }],
      };
    }
    case "vulnImpact": {
      const cvss = parsePositive(String(raw.cvss || "7.8"), "CVSS");
      const exploit = parseNonNegative(String(raw.exploit || "6"), "Exploitability");
      const aff = parsePositive(String(raw.aff || "12"), "Assets affected");
      const exposure = parseExposure(String(raw.exp || "internet"));
      if (!cvss.ok) return { error: cvss.error };
      if (!exploit.ok) return { error: exploit.error };
      if (!aff.ok) return { error: aff.error };
      const r = vulnerabilityImpactRich({ cvss: cvss.value, exploitability: exploit.value, assetsAffected: aff.value, exposure });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.priority,
        primaryLabel: `Impact ${r.impactScore.toFixed(0)}/100 · ~${r.fixHours}h fix`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        steps: r.steps,
        schedule: r.schedule,
        scenarios: r.scenarios,
        rows: [{ label: "Blast radius", value: r.blastRadius.toFixed(0) }],
      };
    }
    case "complianceGap": {
      const impl = parseNonNegative(String(raw.impl || "68"), "Controls implemented");
      const total = parsePositive(String(raw.total || "92"), "Total controls");
      const audit = parsePositive(String(raw.audit || "120"), "Days to audit");
      const framework = parseFramework(String(raw.fw || "soc2"));
      if (!impl.ok) return { error: impl.error };
      if (!total.ok) return { error: total.error };
      if (!audit.ok) return { error: audit.error };
      const r = complianceGapAnalyzerRich({ framework, controlsImplemented: impl.value, totalControls: total.value, auditDays: audit.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.readinessScore.toFixed(0)}%`,
        primaryLabel: `Audit readiness · ${r.controlsNeeded} controls to close`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        phases: r.phases,
        milestones: r.milestones,
        projection: r.projection,
        steps: r.steps,
        controlGaps: r.controlGaps,
        rows: [{ label: "Gap", value: `${r.gapPct.toFixed(0)}%` }],
      };
    }
    case "securityBudget": {
      const rev = parsePositive(String(raw.rev || "50000000"), "Annual revenue");
      const spend = parseNonNegative(String(raw.spend || "1800000"), "Current spend");
      const inc = parseNonNegative(String(raw.inc || "4"), "Incident score");
      const cmp = parseNonNegative(String(raw.cmp || "6"), "Compliance burden");
      const emp = parsePositive(String(raw.emp || "85"), "Employees");
      if (!rev.ok) return { error: rev.error };
      if (!spend.ok) return { error: spend.error };
      if (!inc.ok) return { error: inc.error };
      if (!cmp.ok) return { error: cmp.error };
      if (!emp.ok) return { error: emp.error };
      const r = securityBudgetPlannerRich({ annualRevenue: rev.value, currentSpend: spend.value, incidentScore: inc.value, complianceBurden: cmp.value, employees: emp.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.spendPct.toFixed(1)}%`,
        primaryLabel: `Recommended spend · ₹${Math.round(r.recommendedSpend).toLocaleString("en-IN")}/yr`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        milestones: r.milestones,
        phases: r.phases,
        budgetAlloc: r.budgetAlloc,
        rows: [
          { label: "Gap", value: r.gapAmount > 0 ? `₹${Math.round(r.gapAmount).toLocaleString("en-IN")}` : "Funded" },
          { label: "Per employee", value: `₹${Math.round(r.recommendedSpend / emp.value).toLocaleString("en-IN")}` },
        ],
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
