import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  API_BENCHMARKS,
  API_OPTIMIZE_STEPS,
  CAPACITY_BENCHMARKS,
  CLOUD_BENCHMARKS,
  CLOUD_OPTIMIZE_PHASES,
  COMPLIANCE_DOMAINS,
  COMPLEXITY_BENCHMARKS,
  REFACTOR_STEPS,
  RISK_WEIGHTS,
  SECURITY_BUDGET_ALLOC,
  VULN_FIX_STEPS,
} from "./aiDeveloperKnowledge";
import type { ComplianceFramework, ExposureLevel } from "./aiDeveloperSmart";

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

type RichResult = {
  healthScore: number;
  grade: string;
  insights: AiInsight[];
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
  quadrants?: { quadrant: string; tasks: string[] }[];
  budgetAlloc?: { category: string; amount: number; pct: number }[];
  controlGaps?: { domain: string; gapPct: number; priority: string }[];
};

const FILLS = ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"];

export function codeComplexityRich(params: {
  loc: number;
  cyclomaticAvg: number;
  nestingDepth: number;
  functionCount: number;
  testCoverage: number;
}): RichResult & { complexityScore: number; maintainability: number; debtHours: number } | { error: string } {
  if (params.loc <= 0) return { error: "Lines of code must be positive." };
  if (params.functionCount <= 0) return { error: "Function count must be positive." };

  const locPerFn = params.loc / params.functionCount;
  const ccPenalty = Math.max(0, params.cyclomaticAvg - COMPLEXITY_BENCHMARKS.ccMax) * 4;
  const nestPenalty = Math.max(0, params.nestingDepth - COMPLEXITY_BENCHMARKS.nestMax) * 6;
  const locPenalty = Math.max(0, locPerFn - COMPLEXITY_BENCHMARKS.locPerFn) * 0.3;
  const covBonus = Math.min(15, params.testCoverage * 0.15);

  let complexityScore = 100 - ccPenalty - nestPenalty - locPenalty + covBonus;
  complexityScore = Math.max(0, Math.min(100, complexityScore));
  const maintainability = Math.round(complexityScore * 0.85 + params.testCoverage * 0.15);
  const debtHours = Math.round((100 - complexityScore) * params.loc * 0.002);

  const hotspots = [
    { name: "Cyclomatic complexity", severity: params.cyclomaticAvg > 15 ? "High" : params.cyclomaticAvg > 10 ? "Medium" : "Low", metric: `Avg ${params.cyclomaticAvg.toFixed(1)} (target ≤${COMPLEXITY_BENCHMARKS.ccMax})` },
    { name: "Nesting depth", severity: params.nestingDepth > 5 ? "High" : params.nestingDepth > 4 ? "Medium" : "Low", metric: `Max ${params.nestingDepth} levels (target ≤${COMPLEXITY_BENCHMARKS.nestMax})` },
    { name: "Function size", severity: locPerFn > 80 ? "High" : locPerFn > 50 ? "Medium" : "Low", metric: `${locPerFn.toFixed(0)} LOC/fn (target ≤${COMPLEXITY_BENCHMARKS.locPerFn})` },
    { name: "Test coverage", severity: params.testCoverage < 50 ? "High" : params.testCoverage < 70 ? "Medium" : "Low", metric: `${params.testCoverage}% (target ≥${COMPLEXITY_BENCHMARKS.coverageMin}%)` },
  ].sort((a, b) => (a.severity === "High" ? 0 : a.severity === "Medium" ? 1 : 2) - (b.severity === "High" ? 0 : b.severity === "Medium" ? 1 : 2));

  return {
    complexityScore,
    maintainability,
    debtHours,
    healthScore: complexityScore,
    grade: gradeFromScore(complexityScore),
    hotspots,
    insights: [
      { priority: complexityScore < 55 ? "high" : "medium", title: "Maintainability", detail: `Score ${complexityScore.toFixed(0)}/100 across ${params.loc.toLocaleString()} LOC in ${params.functionCount} functions.` },
      { priority: params.testCoverage < 70 ? "high" : "low", title: "Coverage gap", detail: `${params.testCoverage}% tested — ${Math.max(0, COMPLEXITY_BENCHMARKS.coverageMin - params.testCoverage).toFixed(0)} pts below target.` },
      { priority: "medium", title: "Tech debt", detail: `Est. ${debtHours}h refactor effort to reach healthy complexity band.` },
      { priority: "low", title: "Hotspot", detail: `${hotspots[0]?.name} is your top risk — address before adding features.` },
    ],
    chartSlices: [
      { name: "Complexity debt", value: Math.max(0, 100 - complexityScore), fill: FILLS[4] },
      { name: "Maintainable", value: complexityScore, fill: FILLS[2] },
    ],
    compareRows: [
      { label: "CC avg", target: COMPLEXITY_BENCHMARKS.ccMax, actual: params.cyclomaticAvg },
      { label: "Nesting", target: COMPLEXITY_BENCHMARKS.nestMax, actual: params.nestingDepth },
      { label: "Coverage %", target: COMPLEXITY_BENCHMARKS.coverageMin, actual: params.testCoverage },
    ],
    projection: [0, 1, 2, 3, 4, 5, 6].map((w) => ({
      month: w,
      balance: Math.round(complexityScore + w * 3 + (params.testCoverage < 70 ? 2 : 0)),
    })),
    milestones: [2, 4, 8, 12].map((w) => ({ week: w, target: Math.min(100, complexityScore + w * 4) })),
    steps: REFACTOR_STEPS.map((text, i) => ({ step: i + 1, text })),
    rankedItems: hotspots.map((h) => ({ name: h.name, score: h.severity === "High" ? 9 : h.severity === "Medium" ? 6 : 3, status: h.severity })),
  };
}

export function apiCostEstimatorRich(params: {
  requestsPerMonth: number;
  inputTokens: number;
  outputTokens: number;
  pricePer1M: number;
}): RichResult & { monthlyCost: number; costPer1k: number; annualCost: number } | { error: string } {
  if (params.requestsPerMonth <= 0) return { error: "Requests per month must be positive." };
  if (params.pricePer1M <= 0) return { error: "Price per 1M tokens must be positive." };

  const tokensPerReq = params.inputTokens + params.outputTokens;
  const totalTokens = params.requestsPerMonth * tokensPerReq;
  const monthlyCost = (totalTokens / 1_000_000) * params.pricePer1M;
  const costPer1k = (monthlyCost / params.requestsPerMonth) * 1000;
  const annualCost = monthlyCost * 12;

  const cacheSave = monthlyCost * (API_BENCHMARKS.cacheHitTarget / 100) * API_BENCHMARKS.batchSave;
  const batchSave = monthlyCost * 0.12;
  const modelDowngradeSave = monthlyCost * 0.18;

  let healthScore = 80;
  if (costPer1k > API_BENCHMARKS.costPer1kGood * 2) healthScore -= 25;
  else if (costPer1k > API_BENCHMARKS.costPer1kGood) healthScore -= 10;

  const rankedLevers = [
    { name: "Response caching", save: Math.round(cacheSave), effort: "Medium" },
    { name: "Request batching", save: Math.round(batchSave), effort: "Low" },
    { name: "Model tier optimization", save: Math.round(modelDowngradeSave), effort: "Medium" },
    { name: "Prompt compression", save: Math.round(monthlyCost * 0.08), effort: "Low" },
  ].sort((a, b) => b.save - a.save);

  return {
    monthlyCost,
    costPer1k,
    annualCost,
    rankedLevers,
    healthScore,
    grade: costPer1k <= API_BENCHMARKS.costPer1kGood ? "Efficient" : costPer1k <= API_BENCHMARKS.costPer1kGood * 2 ? "Moderate" : "High spend",
    insights: [
      { priority: costPer1k > API_BENCHMARKS.costPer1kGood ? "high" : "medium", title: "Monthly burn", detail: `₹${Math.round(monthlyCost).toLocaleString("en-IN")}/mo · ${(totalTokens / 1_000_000).toFixed(1)}M tokens · ₹${costPer1k.toFixed(2)}/1K req.` },
      { priority: "medium", title: "Top lever", detail: `${rankedLevers[0]?.name}: save ~₹${rankedLevers[0]?.save.toLocaleString("en-IN")}/mo (${rankedLevers[0]?.effort} effort).` },
      { priority: "low", title: "Scale note", detail: `At 2× traffic, cost ~₹${Math.round(monthlyCost * 2 * 0.85).toLocaleString("en-IN")}/mo with caching (15% efficiency gain).` },
      { priority: "low", title: "Annual", detail: `₹${Math.round(annualCost).toLocaleString("en-IN")}/yr at current volume.` },
    ],
    chartSlices: [
      { name: "Input tokens", value: params.requestsPerMonth * params.inputTokens * params.pricePer1M / 1_000_000, fill: FILLS[0] },
      { name: "Output tokens", value: params.requestsPerMonth * params.outputTokens * params.pricePer1M / 1_000_000, fill: FILLS[1] },
    ],
    compareRows: [
      { label: "Cost/1K req", target: API_BENCHMARKS.costPer1kGood, actual: costPer1k },
      { label: "Tokens/req", target: 2000, actual: tokensPerReq },
      { label: "Cache target %", target: API_BENCHMARKS.cacheHitTarget, actual: 0 },
    ],
    projection: [0, 1, 2, 3, 4, 5, 6].map((m) => ({ month: m, balance: Math.round(monthlyCost * Math.pow(1.08, m)) })),
    scenarios: [
      { label: "Current", months: 12, monthly: monthlyCost },
      { label: "With caching", months: 12, monthly: monthlyCost - cacheSave },
      { label: "Full optimize", months: 12, monthly: monthlyCost - cacheSave - batchSave - modelDowngradeSave },
    ],
    milestones: [1, 3, 6, 12].map((m) => ({ week: m, target: Math.round(monthlyCost * m) })),
    steps: API_OPTIMIZE_STEPS.map((text, i) => ({ step: i + 1, text })),
  };
}

export function cloudCostCalculatorRich(params: {
  computeHours: number;
  storageGb: number;
  egressGb: number;
  instances: number;
}): RichResult & { monthlyTotal: number; computeCost: number; storageCost: number; egressCost: number } | { error: string } {
  if (params.computeHours <= 0 && params.storageGb <= 0) return { error: "Enter compute hours or storage." };

  const computeCost = params.computeHours * CLOUD_BENCHMARKS.computeRate * Math.max(1, params.instances * 0.3);
  const storageCost = params.storageGb * CLOUD_BENCHMARKS.storageRate;
  const egressCost = params.egressGb * CLOUD_BENCHMARKS.egressRate;
  const monthlyTotal = computeCost + storageCost + egressCost;
  const reservedTotal = monthlyTotal * (1 - CLOUD_BENCHMARKS.reservedSave);

  let healthScore = 75;
  if (egressCost / monthlyTotal > 0.3) healthScore -= 15;
  if (params.instances > 10 && params.computeHours / params.instances < 100) healthScore -= 10;

  const rankedLevers = [
    { name: "Reserved instances", save: Math.round(monthlyTotal * CLOUD_BENCHMARKS.reservedSave), effort: "Low" },
    { name: "Storage tiering", save: Math.round(storageCost * 0.4), effort: "Medium" },
    { name: "Egress via CDN", save: Math.round(egressCost * 0.5), effort: "Medium" },
    { name: "Spot/preemptible", save: Math.round(computeCost * 0.6), effort: "High" },
  ].sort((a, b) => b.save - a.save);

  return {
    monthlyTotal,
    computeCost,
    storageCost,
    egressCost,
    rankedLevers,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: [
      { priority: egressCost > monthlyTotal * 0.25 ? "high" : "medium", title: "Monthly total", detail: `₹${Math.round(monthlyTotal).toLocaleString("en-IN")} — compute ${((computeCost / monthlyTotal) * 100).toFixed(0)}%, storage ${((storageCost / monthlyTotal) * 100).toFixed(0)}%, egress ${((egressCost / monthlyTotal) * 100).toFixed(0)}%.` },
      { priority: "medium", title: "Reserved savings", detail: `1-yr reserved → ₹${Math.round(reservedTotal).toLocaleString("en-IN")}/mo (−${(CLOUD_BENCHMARKS.reservedSave * 100).toFixed(0)}%).` },
      { priority: "high", title: "Top lever", detail: `${rankedLevers[0]?.name}: ~₹${rankedLevers[0]?.save.toLocaleString("en-IN")}/mo.` },
      { priority: "low", title: "Instances", detail: `${params.instances} instances · ${params.computeHours} compute-hrs/mo.` },
    ],
    chartSlices: [
      { name: "Compute", value: computeCost, fill: FILLS[0] },
      { name: "Storage", value: storageCost, fill: FILLS[1] },
      { name: "Egress", value: egressCost, fill: FILLS[2] },
    ],
    compareRows: [
      { label: "Compute %", target: 50, actual: (computeCost / monthlyTotal) * 100 },
      { label: "Egress %", target: 15, actual: (egressCost / monthlyTotal) * 100 },
      { label: "Instances", target: 5, actual: params.instances },
    ],
    phases: CLOUD_OPTIMIZE_PHASES.map((p) => ({ phase: p.phase, days: 14, focus: p.focus })),
    projection: [0, 1, 2, 3].map((m) => ({ month: m, balance: Math.round(monthlyTotal - (rankedLevers[0]?.save ?? 0) * (m / 3)) })),
    scenarios: [
      { label: "On-demand", months: 12, monthly: monthlyTotal },
      { label: "Reserved", months: 12, monthly: reservedTotal },
      { label: "Optimized", months: 12, monthly: monthlyTotal - rankedLevers.slice(0, 2).reduce((s, l) => s + l.save, 0) },
    ],
  };
}

export function serverCapacityPlannerRich(params: {
  rps: number;
  latencyMs: number;
  cpuCores: number;
  memoryGb: number;
  headroomPct: number;
}): RichResult & { utilizationPct: number; recommendedCores: number; recommendedMem: number; maxRps: number } | { error: string } {
  if (params.rps <= 0) return { error: "RPS must be positive." };
  if (params.cpuCores <= 0) return { error: "CPU cores must be positive." };

  const headroom = params.headroomPct || CAPACITY_BENCHMARKS.headroomMin;
  const cpuPerReq = params.latencyMs / 1000 / params.cpuCores;
  const utilizationPct = Math.min(100, (params.rps * cpuPerReq) * 100);
  const targetUtil = 100 - headroom;
  const recommendedCores = Math.ceil(params.cpuCores * (utilizationPct / targetUtil));
  const recommendedMem = Math.ceil(params.memoryGb * (utilizationPct / targetUtil));
  const maxRps = Math.floor((targetUtil / 100) * params.cpuCores / cpuPerReq);

  let healthScore = 80;
  if (utilizationPct > 85) healthScore -= 25;
  else if (utilizationPct > 70) healthScore -= 10;
  if (params.latencyMs > CAPACITY_BENCHMARKS.latencyP95) healthScore -= 10;

  return {
    utilizationPct,
    recommendedCores,
    recommendedMem,
    maxRps,
    healthScore,
    grade: utilizationPct > 85 ? "Overloaded" : utilizationPct > 70 ? "Near limit" : "Healthy headroom",
    insights: [
      { priority: utilizationPct > 80 ? "high" : "medium", title: "CPU utilization", detail: `${utilizationPct.toFixed(0)}% at ${params.rps} RPS · ${params.latencyMs}ms avg latency.` },
      { priority: recommendedCores > params.cpuCores ? "high" : "low", title: "Scale recommendation", detail: `${recommendedCores} cores + ${recommendedMem} GB RAM for ${headroom}% headroom.` },
      { priority: "medium", title: "Capacity ceiling", detail: `Max ~${maxRps} RPS before saturation at current latency.` },
      { priority: "low", title: "Latency", detail: params.latencyMs > CAPACITY_BENCHMARKS.latencyP95 ? `Above ${CAPACITY_BENCHMARKS.latencyP95}ms P95 target — optimize hot paths first.` : "Latency within healthy band." },
    ],
    chartSlices: [
      { name: "Used capacity", value: utilizationPct, fill: FILLS[4] },
      { name: "Headroom", value: Math.max(0, 100 - utilizationPct), fill: FILLS[2] },
    ],
    compareRows: [
      { label: "CPU util %", target: CAPACITY_BENCHMARKS.cpuTarget, actual: utilizationPct },
      { label: "Latency ms", target: CAPACITY_BENCHMARKS.latencyP95, actual: params.latencyMs },
      { label: "Headroom %", target: headroom, actual: Math.max(0, 100 - utilizationPct) },
    ],
    projection: [0, 1, 2, 3, 4, 5, 6].map((m) => ({
      month: m,
      balance: Math.round(params.rps * Math.pow(1.15, m)),
    })),
    milestones: [1, 2, 3, 6].map((m) => ({ week: m, target: Math.round(maxRps * (m / 6)) })),
    schedule: [
      { time: "Peak", activity: `${params.rps} RPS · ${utilizationPct.toFixed(0)}% util` },
      { time: "Scale trigger", activity: `Add capacity at ${targetUtil}% util (~${Math.round(maxRps * 0.85)} RPS)` },
      { time: "Target", activity: `${recommendedCores} cores · ${recommendedMem} GB · ${headroom}% buffer` },
    ],
    scenarios: [
      { label: "Current", months: 1, monthly: params.rps },
      { label: "+50% traffic", months: 1, monthly: params.rps * 1.5 },
      { label: "Optimized latency", months: 1, monthly: params.rps * 1.3 },
    ],
  };
}

export function riskScoreCalculatorRich(params: {
  assetCount: number;
  criticalVulns: number;
  patchLagDays: number;
  mfaCoverage: number;
  backupScore: number;
}): RichResult & { riskScore: number; residualRisk: number } | { error: string } {
  if (params.assetCount <= 0) return { error: "Asset count must be positive." };

  const vulnPenalty = params.criticalVulns * RISK_WEIGHTS.criticalVuln;
  const patchPenalty = Math.min(25, params.patchLagDays * RISK_WEIGHTS.patchLag);
  const mfaPenalty = Math.max(0, (100 - params.mfaCoverage) * RISK_WEIGHTS.mfaGap * 0.1);
  const backupPenalty = Math.max(0, (10 - params.backupScore) * RISK_WEIGHTS.backupGap);

  let riskScore = Math.max(0, Math.min(100, 100 - vulnPenalty - patchPenalty - mfaPenalty - backupPenalty));
  const residualRisk = 100 - riskScore;

  const rankedItems = [
    { name: "Critical vulns", score: params.criticalVulns * 10, status: params.criticalVulns > 5 ? "Critical" : params.criticalVulns > 0 ? "High" : "OK" },
    { name: "Patch lag", score: patchPenalty, status: params.patchLagDays > 30 ? "High" : params.patchLagDays > 14 ? "Medium" : "OK" },
    { name: "MFA coverage", score: 100 - params.mfaCoverage, status: params.mfaCoverage < 80 ? "High" : "OK" },
    { name: "Backup readiness", score: (10 - params.backupScore) * 10, status: params.backupScore < 6 ? "High" : "OK" },
  ].sort((a, b) => b.score - a.score);

  return {
    riskScore,
    residualRisk,
    healthScore: riskScore,
    grade: riskScore >= 80 ? "Low risk" : riskScore >= 60 ? "Moderate" : riskScore >= 40 ? "Elevated" : "Critical",
    insights: [
      { priority: riskScore < 60 ? "high" : "medium", title: "Security posture", detail: `Score ${riskScore.toFixed(0)}/100 across ${params.assetCount} assets · ${params.criticalVulns} critical vulns open.` },
      { priority: params.criticalVulns > 0 ? "high" : "low", title: "Top threat", detail: `${rankedItems[0]?.name}: ${rankedItems[0]?.status} priority.` },
      { priority: "medium", title: "Patch cadence", detail: `${params.patchLagDays}-day avg patch lag — target ≤14 days for critical.` },
      { priority: "low", title: "MFA", detail: `${params.mfaCoverage}% coverage — aim for 95%+ on admin and remote access.` },
    ],
    chartSlices: rankedItems.map((r, i) => ({ name: r.name, value: r.score, fill: FILLS[i % FILLS.length] })),
    rankedItems,
    compareRows: [
      { label: "Risk score", target: 80, actual: riskScore },
      { label: "MFA %", target: 95, actual: params.mfaCoverage },
      { label: "Backup /10", target: 8, actual: params.backupScore },
    ],
    steps: [
      { step: 1, text: params.criticalVulns > 0 ? `Remediate ${params.criticalVulns} critical vulns within 72h SLA.` : "Maintain zero critical vuln policy." },
      { step: 2, text: params.mfaCoverage < 90 ? "Enforce MFA on all admin and VPN accounts this sprint." : "Extend MFA to service accounts and CI/CD." },
      { step: 3, text: params.patchLagDays > 14 ? "Automate patch deployment for OS and middleware." : "Quarterly tabletop incident response drill." },
    ],
    projection: [0, 1, 2, 3, 4, 5, 6].map((w) => ({ month: w, balance: Math.min(100, riskScore + w * 4) })),
    milestones: [2, 4, 8, 12].map((w) => ({ week: w, target: Math.min(100, riskScore + w * 5) })),
  };
}

export function vulnerabilityImpactRich(params: {
  cvss: number;
  exploitability: number;
  assetsAffected: number;
  exposure: ExposureLevel;
}): RichResult & { impactScore: number; priority: string; fixHours: number; blastRadius: number } | { error: string } {
  if (params.cvss < 0 || params.cvss > 10) return { error: "CVSS must be 0–10." };

  const exposureMult = params.exposure === "internet" ? 1.5 : params.exposure === "internal" ? 1.0 : 0.5;
  const blastRadius = params.assetsAffected * exposureMult;
  const impactScore = Math.min(100, params.cvss * 8 + params.exploitability * 3 + Math.log10(blastRadius + 1) * 15);
  const priority = impactScore >= 80 ? "P0 — Immediate" : impactScore >= 60 ? "P1 — This week" : impactScore >= 40 ? "P2 — This sprint" : "P3 — Backlog";
  const fixHours = Math.round(2 + params.cvss * 1.5 + params.assetsAffected * 0.5);

  return {
    impactScore,
    priority,
    fixHours,
    blastRadius,
    healthScore: 100 - impactScore,
    grade: priority.split(" — ")[0] ?? "P3",
    insights: [
      { priority: impactScore >= 70 ? "high" : "medium", title: "Impact score", detail: `${impactScore.toFixed(0)}/100 · CVSS ${params.cvss} · ${params.exposure} exposure · ${params.assetsAffected} assets.` },
      { priority: "high", title: "Priority", detail: `${priority} — est. ${fixHours}h remediation.` },
      { priority: "medium", title: "Blast radius", detail: `${blastRadius.toFixed(0)} weighted asset exposure — isolate if exploit active.` },
      { priority: "low", title: "Exploitability", detail: `Score ${params.exploitability}/10 — ${params.exploitability >= 7 ? "active exploits likely in wild." : "monitor threat intel feeds."}` },
    ],
    chartSlices: [
      { name: "CVSS weight", value: params.cvss * 8, fill: FILLS[4] },
      { name: "Exploitability", value: params.exploitability * 3, fill: FILLS[0] },
      { name: "Blast radius", value: Math.log10(blastRadius + 1) * 15, fill: FILLS[1] },
    ],
    compareRows: [
      { label: "Impact", target: 40, actual: impactScore },
      { label: "CVSS", target: 7, actual: params.cvss },
      { label: "Assets", target: 5, actual: params.assetsAffected },
    ],
    steps: VULN_FIX_STEPS.map((text, i) => ({ step: i + 1, text })),
    schedule: [
      { time: "0–24h", activity: "Assess scope · contain if internet-facing" },
      { time: "24–72h", activity: "Patch or mitigate · verify in staging" },
      { time: "72h+", activity: "Deploy fix · update detection rules" },
    ],
    scenarios: [
      { label: "Contained", months: 1, monthly: impactScore * 0.3 },
      { label: "Partial fix", months: 1, monthly: impactScore * 0.6 },
      { label: "Unpatched", months: 1, monthly: impactScore },
    ],
  };
}

export function complianceGapAnalyzerRich(params: {
  framework: ComplianceFramework;
  controlsImplemented: number;
  totalControls: number;
  auditDays: number;
}): RichResult & { readinessScore: number; gapPct: number; controlsNeeded: number } | { error: string } {
  if (params.totalControls <= 0) return { error: "Total controls must be positive." };
  if (params.controlsImplemented > params.totalControls) return { error: "Implemented cannot exceed total." };

  const gapPct = ((params.totalControls - params.controlsImplemented) / params.totalControls) * 100;
  const readinessScore = (params.controlsImplemented / params.totalControls) * 100;
  const controlsNeeded = params.totalControls - params.controlsImplemented;
  const urgency = params.auditDays < 90 ? 1.2 : params.auditDays < 180 ? 1.0 : 0.8;

  let healthScore = readinessScore;
  if (params.auditDays < 60 && gapPct > 20) healthScore -= 15;

  const controlGaps = COMPLIANCE_DOMAINS.map((d) => {
    const domainGap = gapPct * d.weight * urgency;
    return {
      domain: d.label,
      gapPct: Math.round(domainGap),
      priority: domainGap > 8 ? "High" : domainGap > 4 ? "Medium" : "Low",
    };
  }).sort((a, b) => b.gapPct - a.gapPct);

  const fwLabel = params.framework === "soc2" ? "SOC 2 Type II" : params.framework === "gdpr" ? "GDPR" : "ISO 27001";

  return {
    readinessScore,
    gapPct,
    controlsNeeded,
    controlGaps,
    healthScore,
    grade: readinessScore >= 90 ? "Audit-ready" : readinessScore >= 75 ? "On track" : readinessScore >= 50 ? "Gaps remain" : "Not ready",
    insights: [
      { priority: gapPct > 25 ? "high" : "medium", title: `${fwLabel} readiness`, detail: `${readinessScore.toFixed(0)}% complete · ${controlsNeeded} controls remaining · audit in ${params.auditDays} days.` },
      { priority: params.auditDays < 90 ? "high" : "low", title: "Timeline", detail: params.auditDays < 90 ? "Critical path — prioritize high-gap domains below." : "Sufficient runway if you close 2–3 controls/week." },
      { priority: "medium", title: "Top gap", detail: `${controlGaps[0]?.domain}: ~${controlGaps[0]?.gapPct}% gap (${controlGaps[0]?.priority}).` },
      { priority: "low", title: "Velocity", detail: `Need ~${Math.ceil(controlsNeeded / Math.max(1, params.auditDays / 7))} controls/week to finish on time.` },
    ],
    chartSlices: [
      { name: "Implemented", value: params.controlsImplemented, fill: FILLS[2] },
      { name: "Gap", value: controlsNeeded, fill: FILLS[4] },
    ],
    compareRows: controlGaps.slice(0, 3).map((g) => ({ label: g.domain.split(" ")[0] ?? g.domain, target: 5, actual: g.gapPct })),
    phases: [
      { phase: "Foundation (wk 1–4)", days: 28, focus: controlGaps.slice(0, 2).map((g) => g.domain).join(" · ") },
      { phase: "Evidence (wk 5–8)", days: 28, focus: "Collect audit artifacts · policy docs" },
      { phase: "Validation (wk 9–12)", days: 28, focus: "Internal audit dry-run · remediate findings" },
    ],
    milestones: [4, 8, 12, 16].map((w) => ({
      week: w,
      target: Math.min(params.totalControls, params.controlsImplemented + Math.round(controlsNeeded * (w / 16))),
    })),
    projection: [0, 4, 8, 12, 16].map((w) => ({
      month: w,
      balance: Math.min(100, readinessScore + (w / 16) * gapPct),
    })),
    steps: controlGaps.slice(0, 3).map((g, i) => ({
      step: i + 1,
      text: `Close ${g.domain} gap — ${g.priority} priority for ${fwLabel}.`,
    })),
  };
}

export function securityBudgetPlannerRich(params: {
  annualRevenue: number;
  currentSpend: number;
  incidentScore: number;
  complianceBurden: number;
  employees: number;
}): RichResult & { recommendedSpend: number; spendPct: number; gapAmount: number } | { error: string } {
  if (params.annualRevenue <= 0) return { error: "Annual revenue must be positive." };
  if (params.employees <= 0) return { error: "Employee count must be positive." };

  const basePct = params.employees < 50 ? 8 : params.employees < 200 ? 6 : 4;
  const incidentAdj = params.incidentScore * 0.3;
  const complianceAdj = params.complianceBurden * 0.2;
  const spendPct = basePct + incidentAdj + complianceAdj;
  const recommendedSpend = (params.annualRevenue * spendPct) / 100;
  const gapAmount = Math.max(0, recommendedSpend - params.currentSpend);
  const currentPct = (params.currentSpend / params.annualRevenue) * 100;

  let healthScore = 75;
  if (currentPct >= spendPct * 0.9) healthScore += 15;
  if (gapAmount > params.annualRevenue * 0.02) healthScore -= 20;

  const budgetAlloc = SECURITY_BUDGET_ALLOC.map((a) => ({
    category: a.category,
    pct: a.pct,
    amount: Math.round((recommendedSpend * a.pct) / 100),
  }));

  return {
    recommendedSpend,
    spendPct,
    gapAmount,
    budgetAlloc,
    healthScore,
    grade: gapAmount <= 0 ? "Well funded" : gapAmount < recommendedSpend * 0.2 ? "Minor gap" : "Under-invested",
    insights: [
      { priority: gapAmount > 0 ? "high" : "medium", title: "Recommended budget", detail: `₹${Math.round(recommendedSpend).toLocaleString("en-IN")}/yr (${spendPct.toFixed(1)}% of revenue) · currently ₹${Math.round(params.currentSpend).toLocaleString("en-IN")} (${currentPct.toFixed(1)}%).` },
      { priority: gapAmount > 0 ? "high" : "low", title: "Investment gap", detail: gapAmount > 0 ? `Under by ₹${Math.round(gapAmount).toLocaleString("en-IN")}/yr — prioritize detection & IAM first.` : "Spend meets recommended band." },
      { priority: "medium", title: "Per employee", detail: `₹${Math.round(recommendedSpend / params.employees).toLocaleString("en-IN")}/employee/yr benchmark.` },
      { priority: "low", title: "Drivers", detail: `Incident history +${incidentAdj.toFixed(1)}pts · compliance +${complianceAdj.toFixed(1)}pts to base ${basePct}%.` },
    ],
    chartSlices: budgetAlloc.map((b, i) => ({ name: b.category.split(" ")[0] ?? b.category, value: b.amount, fill: FILLS[i % FILLS.length] })),
    compareRows: [
      { label: "Spend %", target: spendPct, actual: currentPct },
      { label: "Per employee", target: recommendedSpend / params.employees, actual: params.currentSpend / params.employees },
      { label: "Incident /10", target: 3, actual: params.incidentScore },
    ],
    scenarios: [
      { label: "Current", months: 12, monthly: params.currentSpend / 12 },
      { label: "Recommended", months: 12, monthly: recommendedSpend / 12 },
      { label: "Incident response+", months: 12, monthly: (recommendedSpend * 1.15) / 12 },
    ],
    milestones: [1, 3, 6, 12].map((m) => ({ week: m, target: Math.round((recommendedSpend / 12) * m) })),
    phases: [
      { phase: "Q1 — Foundation", days: 90, focus: "IAM · MFA · endpoint protection" },
      { phase: "Q2 — Detection", days: 90, focus: "SIEM · logging · vulnerability scanning" },
      { phase: "Q3 — Response", days: 90, focus: "IR playbooks · backup testing · training" },
      { phase: "Q4 — Compliance", days: 90, focus: "Audit prep · policy refresh · tabletop" },
    ],
  };
}
