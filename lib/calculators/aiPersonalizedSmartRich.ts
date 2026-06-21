import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  BUSINESS_IDEAS,
  CAREER_PATHS,
  CAREER_TIPS,
  INCOME_GROWTH_LEVERS,
  SIDE_HUSTLES,
  SKILL_TARGETS,
  VALIDATION_STEPS,
} from "./aiPersonalizedKnowledge";
import type { CareerField, EducationLevel, RiskLevel } from "./aiPersonalizedSmart";

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
  steps?: { step: number; text: string }[];
  rankedItems?: { name: string; score: number; status: string }[];
  milestones?: { week: number; target: number }[];
  usageTips?: string[];
  phases?: { phase: string; days: number; focus: string }[];
  rankedLevers?: { name: string; save: number; effort: string }[];
  skillGaps?: { skill: string; gap: number; priority: string }[];
  ideaScores?: { idea: string; score: number; fit: string }[];
};

const FILLS = ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"];

const EDU_SCORE: Record<EducationLevel, number> = { highschool: 40, bachelor: 65, master: 85, phd: 95 };

export function careerPathAdvisorRich(params: {
  yearsExp: number;
  currentField: CareerField;
  targetField: CareerField;
  skillCount: number;
  education: EducationLevel;
}): RichResult & { fitScore: number; yearsToTarget: number; nextRole: string } | { error: string } {
  if (params.yearsExp < 0) return { error: "Experience cannot be negative." };

  const path = CAREER_PATHS[params.targetField];
  const sameField = params.currentField === params.targetField;
  const fieldSwitchPenalty = sameField ? 0 : 20;
  const expBonus = Math.min(25, params.yearsExp * 3);
  const skillBonus = Math.min(20, params.skillCount * 4);
  const eduBonus = EDU_SCORE[params.education] * 0.15;

  let fitScore = 50 + expBonus + skillBonus + eduBonus - fieldSwitchPenalty;
  fitScore = Math.max(0, Math.min(100, fitScore));

  const roleIndex = Math.min(path.roles.length - 1, Math.floor(params.yearsExp / 2));
  const nextRole = path.roles[roleIndex + 1] ?? path.roles[path.roles.length - 1];
  const yearsToTarget = sameField ? Math.max(1, path.timeline - params.yearsExp) : path.timeline + 2;

  const phases = [
    { phase: "Foundation (mo 1–6)", days: 180, focus: path.skills.slice(0, 2).join(" · ") },
    { phase: "Build proof (mo 7–12)", days: 180, focus: "Portfolio / certifications in " + params.targetField },
    { phase: "Transition (mo 13–18)", days: 180, focus: `Target role: ${nextRole}` },
  ];

  return {
    fitScore,
    yearsToTarget,
    nextRole,
    healthScore: fitScore,
    grade: gradeFromScore(fitScore),
    insights: [
      { priority: fitScore < 60 ? "high" : "medium", title: "Career fit", detail: `${fitScore.toFixed(0)}/100 toward ${params.targetField} · ${sameField ? "same-field progression" : `switch from ${params.currentField}`}.` },
      { priority: "high", title: "Next role", detail: `${nextRole} in ~${yearsToTarget} yrs with consistent upskilling.` },
      { priority: sameField ? "low" : "high", title: "Switch cost", detail: sameField ? "Lower friction — focus on depth and visibility." : "Plan 12–18 mo bridge: projects + network in target field." },
      { priority: "medium", title: "Skills", detail: `Top gaps: ${path.skills.slice(0, 2).join(", ")} — you listed ${params.skillCount} relevant skills.` },
    ],
    chartSlices: path.skills.map((s, i) => ({ name: s, value: 20 + i * 15, fill: FILLS[i % FILLS.length] })),
    compareRows: path.skills.map((s, i) => ({ label: s.slice(0, 10), target: 80, actual: Math.min(100, params.skillCount * 20 + i * 10) })),
    phases,
    milestones: [6, 12, 18, 24].map((m) => ({ week: m, target: Math.min(100, fitScore + m * 2) })),
    projection: [0, 6, 12, 18, 24].map((m) => ({ month: m, balance: Math.min(100, fitScore + m * 1.5) })),
    steps: [
      { step: 1, text: `Map ${nextRole} job descriptions — extract top 5 recurring skills.` },
      { step: 2, text: `Ship 1 portfolio piece per quarter demonstrating ${path.skills[0]}.` },
      { step: 3, text: sameField ? "Request stretch assignment aligned with next role." : "Informational interviews: 2/month in target field." },
    ],
    usageTips: CAREER_TIPS,
  };
}

export function skillGapAnalyzerRich(params: {
  targetRole: string;
  currentLevels: number[];
}): RichResult & { readinessScore: number; totalGap: number } | { error: string } {
  const targets = SKILL_TARGETS[params.targetRole] ?? SKILL_TARGETS["software-engineer"];
  const levels = params.currentLevels.slice(0, targets.length);
  while (levels.length < targets.length) levels.push(5);

  const skillGaps = targets.map((skill, i) => {
    const current = Math.min(10, Math.max(0, levels[i] ?? 5));
    const target = 8;
    const gap = Math.max(0, target - current);
    return { skill, gap, priority: gap >= 4 ? "High" : gap >= 2 ? "Medium" : "Low" };
  }).sort((a, b) => b.gap - a.gap);

  const totalGap = skillGaps.reduce((s, g) => s + g.gap, 0);
  const readinessScore = Math.max(0, 100 - totalGap * 5);

  return {
    readinessScore,
    totalGap,
    skillGaps,
    healthScore: readinessScore,
    grade: readinessScore >= 80 ? "Role-ready" : readinessScore >= 60 ? "Close" : "Significant gaps",
    insights: [
      { priority: totalGap > 10 ? "high" : "medium", title: "Readiness", detail: `${readinessScore.toFixed(0)}/100 for ${params.targetRole.replace(/-/g, " ")} · ${totalGap} total gap points.` },
      { priority: "high", title: "Top gap", detail: `${skillGaps[0]?.skill}: ${skillGaps[0]?.gap} pts below target (${skillGaps[0]?.priority}).` },
      { priority: "medium", title: "Learning order", detail: skillGaps.slice(0, 3).map((g) => g.skill).join(" → ") },
      { priority: "low", title: "Timeline", detail: `Est. ${Math.ceil(totalGap / 2)} months at 5 hrs/week focused practice.` },
    ],
    chartSlices: skillGaps.map((g, i) => ({ name: g.skill.slice(0, 8), value: g.gap, fill: FILLS[i % FILLS.length] })),
    compareRows: skillGaps.map((g) => ({ label: g.skill.slice(0, 8), target: 8, actual: 8 - g.gap })),
    phases: [
      { phase: "Month 1–2", days: 60, focus: skillGaps.slice(0, 2).map((g) => g.skill).join(" · ") },
      { phase: "Month 3–4", days: 60, focus: skillGaps.slice(2, 4).map((g) => g.skill).join(" · ") || "Practice projects" },
      { phase: "Month 5–6", days: 60, focus: "Mock interviews · portfolio polish" },
    ],
    milestones: [1, 2, 3, 6].map((m) => ({ week: m, target: Math.min(100, readinessScore + m * 8) })),
    projection: [0, 1, 2, 3, 4, 5, 6].map((m) => ({ month: m, balance: Math.min(100, readinessScore + m * (totalGap > 0 ? 15 / totalGap : 5)) })),
    steps: skillGaps.slice(0, 3).map((g, i) => ({
      step: i + 1,
      text: `Close ${g.skill} gap: 2 courses + 1 project (${g.priority} priority).`,
    })),
  };
}

export function sideHustleFinderRich(params: {
  hoursPerWeek: number;
  capital: number;
  skillScore: number;
  risk: RiskLevel;
}): RichResult & { topHustle: string; monthlyPotential: number } | { error: string } {
  if (params.hoursPerWeek <= 0) return { error: "Hours per week must be positive." };

  const riskOrder = { low: 0, medium: 1, high: 2 };
  const ranked = SIDE_HUSTLES.map((h) => {
    let score = 50;
    if (params.hoursPerWeek >= h.minHrs) score += 20;
    if (params.capital >= h.minCap) score += 15;
    score += Math.min(15, params.skillScore * 1.5);
    if (riskOrder[h.risk as RiskLevel] <= riskOrder[params.risk]) score += 10;
    else score -= 15;
    score += h.income / 5000;
    return { name: h.label, score: Math.round(score), status: h.risk, income: h.income };
  }).sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const monthlyPotential = top?.income ?? 15000;

  return {
    topHustle: top?.name ?? "Freelance services",
    monthlyPotential,
    healthScore: top?.score ?? 60,
    grade: monthlyPotential >= 40000 ? "High potential" : monthlyPotential >= 20000 ? "Solid side income" : "Starter income",
    insights: [
      { priority: "high", title: "Best fit", detail: `${top?.name} — est. ₹${monthlyPotential.toLocaleString("en-IN")}/mo at ${params.hoursPerWeek}h/wk.` },
      { priority: "medium", title: "Runners-up", detail: ranked.slice(1, 3).map((r) => r.name).join(" · ") },
      { priority: params.capital < 10000 ? "low" : "medium", title: "Capital", detail: `₹${params.capital.toLocaleString("en-IN")} available — ${params.capital >= 50000 ? "enables product plays" : "bootstrap service hustles first"}.` },
      { priority: "low", title: "Risk", detail: `${params.risk} tolerance — ${params.risk === "high" ? "SaaS/e-commerce viable" : "stick to services/tutoring initially"}.` },
    ],
    chartSlices: ranked.slice(0, 4).map((r, i) => ({ name: r.name.split(" ")[0] ?? r.name, value: r.income, fill: FILLS[i % FILLS.length] })),
    compareRows: ranked.slice(0, 3).map((r) => ({ label: r.name.slice(0, 10), target: monthlyPotential, actual: r.income })),
    rankedItems: ranked.slice(0, 5),
    scenarios: [
      { label: "Conservative", months: 6, monthly: Math.round(monthlyPotential * 0.5) },
      { label: "Expected", months: 6, monthly: monthlyPotential },
      { label: "Optimistic", months: 6, monthly: Math.round(monthlyPotential * 1.5) },
    ],
    milestones: [1, 3, 6, 12].map((m) => ({ week: m, target: Math.round(monthlyPotential * (m / 12)) })),
    steps: [
      { step: 1, text: `Launch ${top?.name} MVP in 2 weeks — first paying customer in 30 days.` },
      { step: 2, text: "Track hours vs revenue weekly — aim ₹500+/hr effective rate." },
      { step: 3, text: "Reinvest 20% of side income into tools/marketing." },
    ],
  };
}

export function businessIdeaGeneratorRich(params: {
  interest1: string;
  interest2: string;
  budget: number;
  marketScore: number;
  competitionScore: number;
}): RichResult & { topIdea: string; topScore: number } | { error: string } {
  if (params.budget < 0) return { error: "Budget cannot be negative." };

  const interests = [params.interest1, params.interest2].filter((i) => i.trim()).join(" ").toLowerCase();

  const ideaScores = BUSINESS_IDEAS.map((idea) => {
    let score = 50;
    if (params.budget >= idea.capital) score += 20;
    else score -= (idea.capital - params.budget) / 10000;
    score += params.marketScore * 3;
    score -= params.competitionScore * 2;
    score += idea.market * 2;
    score -= idea.comp * 1.5;
    if (interests.includes(idea.theme.split("-")[0] ?? "") || interests.includes(idea.theme)) score += 10;
    const fit = score >= 75 ? "Strong" : score >= 55 ? "Moderate" : "Weak";
    return { idea: idea.label, score: Math.round(Math.max(0, Math.min(100, score))), fit };
  }).sort((a, b) => b.score - a.score);

  const top = ideaScores[0];

  return {
    topIdea: top?.idea ?? "Skill micro-courses",
    topScore: top?.score ?? 60,
    ideaScores,
    healthScore: top?.score ?? 60,
    grade: top?.fit ?? "Moderate",
    insights: [
      { priority: "high", title: "Top idea", detail: `${top?.idea} — ${top?.score}/100 fit · ${top?.fit} validation potential.` },
      { priority: "medium", title: "Market", detail: `Your market appetite ${params.marketScore}/10 · competition pressure ${params.competitionScore}/10.` },
      { priority: params.budget < 50000 ? "high" : "low", title: "Budget fit", detail: `₹${params.budget.toLocaleString("en-IN")} — ${params.budget >= 100000 ? "supports product build" : "start lean with services/content"}.` },
      { priority: "low", title: "Interests", detail: interests ? `Aligned themes: ${interests}` : "Add interests to improve match scoring." },
    ],
    chartSlices: ideaScores.slice(0, 4).map((i, idx) => ({ name: i.idea.split(" ")[0] ?? i.idea, value: i.score, fill: FILLS[idx % FILLS.length] })),
    compareRows: ideaScores.slice(0, 3).map((i) => ({ label: i.idea.slice(0, 10), target: 75, actual: i.score })),
    rankedItems: ideaScores.map((i) => ({ name: i.idea, score: i.score, status: i.fit })),
    scenarios: ideaScores.slice(0, 3).map((i, idx) => ({
      label: i.idea.slice(0, 20),
      months: 12,
      monthly: Math.round(params.budget * 0.1 * (1 + idx * 0.3)),
    })),
    steps: VALIDATION_STEPS.map((text, i) => ({ step: i + 1, text })),
    phases: [
      { phase: "Validate (wk 1–4)", days: 28, focus: "Customer interviews · landing page test" },
      { phase: "Build MVP (wk 5–8)", days: 28, focus: top?.idea ?? "Core offer" },
      { phase: "Launch (wk 9–12)", days: 28, focus: "First 10 paying customers" },
    ],
  };
}

export function incomeGrowthPlannerRich(params: {
  currentIncome: number;
  goalIncome: number;
  savingsRate: number;
  skillInvestment: number;
  months: number;
}): RichResult & { growthNeeded: number; projectedIncome: number; gapAmount: number } | { error: string } {
  if (params.currentIncome <= 0) return { error: "Current income must be positive." };
  if (params.goalIncome <= params.currentIncome) return { error: "Goal income must exceed current income." };
  if (params.months <= 0) return { error: "Timeline must be at least 1 month." };

  const growthNeeded = ((params.goalIncome / params.currentIncome) ** (12 / params.months) - 1) * 100;
  const gapAmount = params.goalIncome - params.currentIncome;

  const leverBoost = INCOME_GROWTH_LEVERS.reduce((s, l) => s + (params.skillInvestment >= 50000 ? l.boost : l.boost * 0.6), 0) / INCOME_GROWTH_LEVERS.length;
  const monthlyGrowth = (growthNeeded / 100) / 12;
  const projectedIncome = params.currentIncome * Math.pow(1 + monthlyGrowth + leverBoost / 1200, params.months);

  let healthScore = 70;
  if (growthNeeded > 30) healthScore -= 20;
  else if (growthNeeded <= 15) healthScore += 10;
  if (params.savingsRate >= 20) healthScore += 10;

  const rankedLevers = INCOME_GROWTH_LEVERS.map((l) => ({
    name: l.label,
    save: l.boost,
    effort: l.months <= 3 ? "Low" : l.months <= 6 ? "Medium" : "High",
  })).sort((a, b) => b.save - a.save);

  return {
    growthNeeded,
    projectedIncome,
    gapAmount,
    rankedLevers,
    healthScore,
    grade: growthNeeded <= 15 ? "Achievable" : growthNeeded <= 30 ? "Ambitious" : "Stretch goal",
    insights: [
      { priority: growthNeeded > 25 ? "high" : "medium", title: "Growth required", detail: `${growthNeeded.toFixed(1)}% annualized over ${params.months} mo to reach ₹${params.goalIncome.toLocaleString("en-IN")}/mo.` },
      { priority: "high", title: "Gap", detail: `₹${gapAmount.toLocaleString("en-IN")}/mo · projected ₹${Math.round(projectedIncome).toLocaleString("en-IN")} with skill investment.` },
      { priority: "medium", title: "Savings", detail: `${params.savingsRate}% savings rate — ${params.savingsRate >= 20 ? "supports runway for upskilling" : "raise savings to fund growth levers"}.` },
      { priority: "low", title: "Top lever", detail: `${rankedLevers[0]?.name}: +${rankedLevers[0]?.save}% potential (${rankedLevers[0]?.effort} effort).` },
    ],
    chartSlices: [
      { name: "Current", value: params.currentIncome, fill: FILLS[0] },
      { name: "Goal", value: params.goalIncome, fill: FILLS[2] },
      { name: "Projected", value: projectedIncome, fill: FILLS[1] },
    ],
    compareRows: rankedLevers.slice(0, 3).map((l) => ({ label: l.name.slice(0, 10), target: 15, actual: l.save })),
    projection: Array.from({ length: Math.min(13, params.months + 1) }, (_, m) => ({
      month: m,
      balance: Math.round(params.currentIncome * Math.pow(1 + monthlyGrowth / 12 + leverBoost / 14400, m)),
    })),
    scenarios: [
      { label: "Base path", months: params.months, monthly: projectedIncome },
      { label: "Raise only", months: params.months, monthly: params.currentIncome * 1.12 },
      { label: "Side + skill", months: params.months, monthly: projectedIncome * 1.15 },
    ],
    milestones: [3, 6, 12, params.months].filter((m, i, a) => a.indexOf(m) === i && m <= params.months).map((m) => ({
      week: m,
      target: Math.round(params.currentIncome + (gapAmount * m) / params.months),
    })),
    steps: rankedLevers.slice(0, 3).map((l, i) => ({
      step: i + 1,
      text: `${l.name} — target +${l.save}% (${l.effort} effort).`,
    })),
  };
}
