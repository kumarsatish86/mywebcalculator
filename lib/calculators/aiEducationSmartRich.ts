import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  CONCEPT_STEPS,
  FORMULA_PACKS,
  NOTES_OUTLINES,
  fallbackConcept,
  topicKey,
  type EduSubject,
} from "./aiEducationKnowledge";
import type { EnergyPeak, ExamType, NoteDepth, ProblemType } from "./aiEducationSmart";
import { gradeFromPercent } from "./aiEducationSmart";

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
  formulas?: { name: string; expression: string; note?: string }[];
  outline?: { title: string; bullets: string[] }[];
  rankedSubjects?: { name: string; score: number; status: string }[];
};

export function studyPlannerRich(params: {
  daysToExam: number;
  hoursPerDay: number;
  subjects: { name: string; weight: number }[];
}): RichResult & { weeklyHours: number; plan: { name: string; hours: number }[] } | { error: string } {
  if (params.daysToExam <= 0) return { error: "Days to exam must be positive." };
  if (params.hoursPerDay <= 0 || params.hoursPerDay > 16) return { error: "Enter study hours between 1 and 16." };
  const subs = params.subjects.filter((s) => s.name.trim());
  if (!subs.length) return { error: "Add at least one subject." };

  const totalWeight = subs.reduce((s, x) => s + Math.max(1, x.weight), 0);
  const totalHours = params.daysToExam * params.hoursPerDay;
  const weeklyHours = params.hoursPerDay * 7;
  const plan = subs.map((s) => ({
    name: s.name,
    hours: Math.round((totalHours * Math.max(1, s.weight)) / totalWeight),
  }));

  const minHoursPerSub = Math.min(...plan.map((p) => p.hours));
  let healthScore = 75;
  if (params.hoursPerDay >= 2 && params.hoursPerDay <= 6) healthScore += 10;
  if (minHoursPerSub >= params.daysToExam * 0.5) healthScore += 8;
  if (params.daysToExam < 7) healthScore -= 15;
  healthScore = Math.max(0, Math.min(100, healthScore));

  const insights: AiInsight[] = [
    {
      priority: params.daysToExam < 14 ? "high" : "medium",
      title: "Timeline",
      detail: `${totalHours} total study hours over ${params.daysToExam} days — front-load weak subjects in week 1.`,
    },
  ];
  const heaviest = [...plan].sort((a, b) => b.hours - a.hours)[0];
  if (heaviest) {
    insights.push({
      priority: "medium",
      title: "Priority subject",
      detail: `${heaviest.name} gets ${heaviest.hours}h (${((heaviest.hours / totalHours) * 100).toFixed(0)}%) based on difficulty weight.`,
    });
  }

  return {
    weeklyHours,
    plan,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    chartSlices: plan.map((p, i) => ({
      name: p.name,
      value: p.hours,
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"][i % 6],
    })),
    compareRows: plan.map((p) => ({ label: p.name, target: totalHours / subs.length, actual: p.hours })),
  };
}

export function timetableGeneratorRich(params: {
  wakeHour: number;
  sleepHour: number;
  schoolStart: number;
  schoolEnd: number;
  studyHours: number;
  breakMinutes: number;
  subjects: string[];
}): RichResult | { error: string } {
  if (params.sleepHour <= params.wakeHour) return { error: "Sleep hour must be after wake hour." };
  if (params.schoolEnd <= params.schoolStart) return { error: "School end must be after start." };

  const schedule: { time: string; activity: string }[] = [];
  const fmt = (h: number) => {
    const hr = Math.floor(h);
    const min = Math.round((h - hr) * 60);
    return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  schedule.push({ time: fmt(params.wakeHour), activity: "Wake up · morning routine" });
  schedule.push({ time: fmt(params.wakeHour + 0.5), activity: "Light revision / breakfast" });
  schedule.push({ time: fmt(params.schoolStart), activity: "School / classes" });
  schedule.push({ time: fmt(params.schoolEnd), activity: "Break · snack" });

  let t = params.schoolEnd + params.breakMinutes / 60;
  const block = params.studyHours / Math.max(1, params.subjects.length);
  for (const sub of params.subjects.filter(Boolean)) {
    schedule.push({ time: fmt(t), activity: `Study · ${sub}` });
    t += block;
    schedule.push({ time: fmt(t), activity: "Short break (10 min)" });
    t += 10 / 60;
  }
  schedule.push({ time: fmt(Math.min(t, params.sleepHour - 1)), activity: "Dinner · free time" });
  schedule.push({ time: fmt(params.sleepHour), activity: "Sleep" });

  const healthScore = params.studyHours >= 2 && params.studyHours <= 5 ? 85 : 68;

  return {
    healthScore,
    grade: gradeFromScore(healthScore),
    schedule,
    insights: [
      { priority: "medium", title: "Block sizing", detail: `${block.toFixed(1)}h per subject block — use Pomodoro (25+5) inside each block.` },
      { priority: "low", title: "Recovery", detail: "Protect sleep window; cut social blocks before cutting sleep." },
    ],
    chartSlices: params.subjects.filter(Boolean).map((s, i) => ({
      name: s,
      value: block,
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8"][i % 4],
    })),
  };
}

export function examPrepStrategyRich(params: {
  daysLeft: number;
  examType: ExamType;
  subjects: { name: string; preparedness: number }[];
}): RichResult & { phases: { phase: string; days: number; focus: string }[] } | { error: string } {
  if (params.daysLeft <= 0) return { error: "Days left must be positive." };
  const subs = params.subjects.filter((s) => s.name.trim());
  if (!subs.length) return { error: "Add at least one subject." };

  const avgPrep = subs.reduce((s, x) => s + x.preparedness, 0) / subs.length;
  const weak = [...subs].sort((a, b) => a.preparedness - b.preparedness);

  let foundationPct = 0.5;
  let revisionPct = 0.35;
  let mockPct = 0.15;
  if (params.examType === "competitive") {
    foundationPct = 0.4;
    revisionPct = 0.35;
    mockPct = 0.25;
  } else if (params.examType === "unit") {
    foundationPct = 0.35;
    revisionPct = 0.45;
    mockPct = 0.2;
  }
  if (avgPrep > 70) {
    foundationPct -= 0.1;
    mockPct += 0.1;
  }

  const phases = [
    { phase: "Foundation", days: Math.round(params.daysLeft * foundationPct), focus: weak.slice(0, 2).map((w) => w.name).join(", ") || "Core gaps" },
    { phase: "Revision", days: Math.round(params.daysLeft * revisionPct), focus: "Formulas + past papers" },
    { phase: "Mock tests", days: Math.max(1, Math.round(params.daysLeft * mockPct)), focus: "Timed full tests + error log" },
  ];

  const healthScore = Math.round(Math.min(100, avgPrep + (params.daysLeft > 30 ? 10 : 0)));

  return {
    phases,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: [
      {
        priority: "high",
        title: "Weakest first",
        detail: `Start with ${weak[0]?.name ?? "weakest subject"} at ${weak[0]?.preparedness ?? 0}% preparedness.`,
      },
      {
        priority: "medium",
        title: `${params.examType} exam pattern`,
        detail:
          params.examType === "competitive"
            ? "Add weekly full-length mocks in the final phase."
            : params.examType === "unit"
              ? "Focus revision on this unit's weightage in the syllabus."
              : "Board exams: balance all subjects — avoid ignoring language papers.",
      },
    ],
    compareRows: subs.map((s) => ({ label: s.name, target: 75, actual: s.preparedness })),
    chartSlices: phases.map((p, i) => ({
      name: p.phase,
      value: p.days,
      fill: ["#6548f5", "#0d9488", "#f59e0b"][i],
    })),
  };
}

export function dailyLearningScheduleRich(params: {
  hoursAvailable: number;
  subjects: { name: string; priority: number }[];
  energyPeak: EnergyPeak;
}): RichResult | { error: string } {
  if (params.hoursAvailable <= 0 || params.hoursAvailable > 12) return { error: "Enter available hours between 1 and 12." };
  const subs = params.subjects.filter((s) => s.name.trim());
  if (!subs.length) return { error: "Add at least one subject." };

  const sorted = [...subs].sort((a, b) => b.priority - a.priority);
  const hardSlot = params.energyPeak === "morning" ? "09:00" : params.energyPeak === "afternoon" ? "15:00" : "19:00";
  const block = params.hoursAvailable / subs.length;

  const schedule: { time: string; activity: string }[] = [];
  let hour = params.energyPeak === "morning" ? 9 : params.energyPeak === "afternoon" ? 14 : 18;
  for (const s of sorted) {
    schedule.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      activity: `${s.priority >= 4 ? "Deep focus" : "Review"} · ${s.name}`,
    });
    hour += block;
  }

  return {
    healthScore: 80,
    grade: "Good",
    schedule,
    insights: [
      {
        priority: "high",
        title: "Peak energy slot",
        detail: `Hardest subject (${sorted[0]?.name}) scheduled near ${hardSlot} when focus is highest.`,
      },
      { priority: "low", title: "Break rule", detail: "Take 5–10 min break every 45–50 min to maintain retention." },
    ],
    chartSlices: subs.map((s, i) => ({
      name: s.name,
      value: block * s.priority,
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8"][i % 4],
    })),
  };
}

export function marksAnalyzerRich(params: {
  subjects: { name: string; marks: number; max: number }[];
}): RichResult & { overall: number; overallGrade: string } | { error: string } {
  const subs = params.subjects.filter((s) => s.name.trim() && s.max > 0);
  if (!subs.length) return { error: "Add at least one subject with marks." };

  let totalMarks = 0;
  let totalMax = 0;
  const ranked = subs.map((s) => {
    const pct = (s.marks / s.max) * 100;
    totalMarks += s.marks;
    totalMax += s.max;
    return { name: s.name, score: Math.round(pct), status: pct >= 75 ? "Strong" : pct >= 60 ? "OK" : "Weak" };
  });
  const overall = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0;

  return {
    overall,
    overallGrade: gradeFromPercent(overall),
    healthScore: Math.round(overall),
    grade: gradeFromScore(overall),
    rankedSubjects: ranked.sort((a, b) => a.score - b.score),
    insights: [
      {
        priority: ranked[0]?.score < 60 ? "high" : "medium",
        title: "Weakest subject",
        detail: `${ranked[0]?.name} at ${ranked[0]?.score}% — allocate extra 30% study time this week.`,
      },
      {
        priority: "low",
        title: "Overall band",
        detail: `Aggregate ${overall.toFixed(1)}% (${gradeFromPercent(overall)}) across ${subs.length} subjects.`,
      },
    ],
    chartSlices: subs.map((s, i) => ({
      name: s.name,
      value: Math.round((s.marks / s.max) * 100),
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"][i % 6],
    })),
    compareRows: subs.map((s) => ({ label: s.name, target: 75, actual: (s.marks / s.max) * 100 })),
  };
}

export function weakAreaDetectorRich(params: {
  subjects: { name: string; marks: number; max: number; benchmark?: number }[];
}): RichResult & { weakAreas: { name: string; gap: number }[] } | { error: string } {
  const base = marksAnalyzerRich({ subjects: params.subjects });
  if ("error" in base) return base;

  const subs = params.subjects.filter((s) => s.max > 0);
  const weakAreas = subs
    .map((s) => {
      const pct = (s.marks / s.max) * 100;
      const bench = s.benchmark ?? 75;
      return { name: s.name, gap: bench - pct };
    })
    .filter((w) => w.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  return {
    ...base,
    weakAreas,
    insights: [
      {
        priority: "high",
        title: "Top gap",
        detail: weakAreas[0]
          ? `${weakAreas[0].name} is ${weakAreas[0].gap.toFixed(0)} pts below benchmark — drill fundamentals first.`
          : "All subjects meet benchmark — maintain with spaced revision.",
      },
      ...(weakAreas.length > 1
        ? [{ priority: "medium" as const, title: "Second priority", detail: `${weakAreas[1].name}: ${weakAreas[1].gap.toFixed(0)} pt gap.` }]
        : []),
    ],
  };
}

export function rankPredictorRich(params: {
  myScore: number;
  maxScore: number;
  totalStudents: number;
  difficulty: number;
}): RichResult & { percentile: number; rankLow: number; rankHigh: number; scorePct: number; pointsToTop10: number } | { error: string } {
  if (params.maxScore <= 0) return { error: "Max score must be positive." };
  if (params.totalStudents <= 0) return { error: "Total students must be positive." };
  if (params.myScore > params.maxScore) return { error: "Your score cannot exceed the max score." };
  if (params.myScore < 0) return { error: "Score cannot be negative." };

  const scorePct = (params.myScore / params.maxScore) * 100;
  const diffMod = (params.difficulty - 50) / 100;
  const percentile = Math.max(1, Math.min(99, scorePct * (1 - diffMod * 0.12)));
  const rankMid = Math.max(1, Math.round(params.totalStudents * (1 - percentile / 100)));
  const spread = Math.max(5, Math.round(params.totalStudents * 0.04));
  const top10Score = params.maxScore * 0.9;
  const pointsToTop10 = Math.max(0, top10Score - params.myScore);

  const insights: AiInsight[] = [
    {
      priority: "medium",
      title: "Estimate band",
      detail: `Score ${params.myScore}/${params.maxScore} (${scorePct.toFixed(1)}%) → ~${Math.round(percentile)}th percentile, rank ${Math.max(1, rankMid - spread)}–${Math.min(params.totalStudents, rankMid + spread)} of ${params.totalStudents.toLocaleString("en-IN")}.`,
    },
  ];
  if (pointsToTop10 > 0) {
    insights.unshift({
      priority: "high",
      title: "Path to top 10%",
      detail: `Need ~${Math.ceil(pointsToTop10)} more marks (≈90%+) — focus mocks and error-log revision.`,
    });
  }
  insights.push({
    priority: "low",
    title: "Disclaimer",
    detail: "Heuristic model only — actual rank depends on paper difficulty and cohort performance.",
  });

  return {
    percentile: Math.round(percentile),
    rankLow: Math.max(1, rankMid - spread),
    rankHigh: Math.min(params.totalStudents, rankMid + spread),
    scorePct,
    pointsToTop10,
    healthScore: Math.round(percentile),
    grade: gradeFromScore(percentile),
    insights,
    compareRows: [
      { label: "Your %", target: 75, actual: scorePct },
      { label: "Percentile", target: 90, actual: percentile },
      { label: "Top-10 bar", target: 90, actual: scorePct },
    ],
    projection: [
      { month: 0, balance: scorePct },
      { month: 4, balance: Math.min(100, scorePct + 3) },
      { month: 8, balance: Math.min(100, scorePct + 6) },
      { month: 12, balance: Math.min(100, scorePct + 10) },
    ],
  };
}

export function performanceImprovementRich(params: {
  currentAvg: number;
  targetAvg: number;
  weeksLeft: number;
}): RichResult & { weeklyDelta: number; dailyMinutes: number; milestones: { week: number; target: number }[] } | { error: string } {
  if (params.weeksLeft <= 0) return { error: "Weeks left must be positive." };
  if (params.targetAvg <= params.currentAvg) return { error: "Target must exceed current average." };
  if (params.targetAvg > 100 || params.currentAvg < 0) return { error: "Enter averages between 0 and 100." };

  const gap = params.targetAvg - params.currentAvg;
  const weeklyDelta = gap / params.weeksLeft;
  const dailyMinutes = Math.round(weeklyDelta * 12);
  const milestones = Array.from({ length: Math.min(params.weeksLeft, 8) }, (_, i) => {
    const week = i + 1;
    return { week, target: Math.round(params.currentAvg + weeklyDelta * week) };
  });

  return {
    weeklyDelta,
    dailyMinutes,
    milestones,
    healthScore: Math.max(40, Math.min(95, 100 - gap * 1.2)),
    grade: gap <= 10 ? "Achievable" : gap <= 20 ? "Challenging" : "Ambitious",
    insights: [
      {
        priority: "high",
        title: "Weekly target",
        detail: `Improve ~${weeklyDelta.toFixed(1)}% per week for ${params.weeksLeft} weeks to reach ${params.targetAvg}%.`,
      },
      {
        priority: "medium",
        title: "Daily effort",
        detail: `Add ~${dailyMinutes} extra focused minutes/day: 60% practice, 30% revision, 10% mock review.`,
      },
      {
        priority: "low",
        title: "Checkpoint",
        detail: `Week ${Math.ceil(params.weeksLeft / 2)} target: ${Math.round(params.currentAvg + gap / 2)}% — adjust if behind.`,
      },
    ],
    scenarios: [
      { label: "Conservative", months: params.weeksLeft, monthly: params.currentAvg + gap * 0.7 },
      { label: "Target path", months: params.weeksLeft, monthly: params.targetAvg },
      { label: "Stretch", months: params.weeksLeft, monthly: Math.min(100, params.targetAvg + 3) },
    ],
    projection: Array.from({ length: params.weeksLeft + 1 }, (_, i) => ({
      month: i,
      balance: Math.round((params.currentAvg + weeklyDelta * i) * 10) / 10,
    })),
  };
}

export function conceptExplainerRich(params: {
  subject: EduSubject;
  topic: string;
  priorKnowledge: number;
}): RichResult & { estimatedHours: number; practiceCount: number } | { error: string } {
  const key = topicKey(params.subject, params.topic);
  const concept = CONCEPT_STEPS[key] ?? fallbackConcept(params.subject, params.topic);
  const steps = concept.steps.map((text, i) => ({ step: i + 1, text }));

  if (params.priorKnowledge < 30) steps.unshift({ step: 0, text: "Prerequisite: review basic definitions before the steps below." });

  const estimatedHours = Math.max(2, Math.round((100 - params.priorKnowledge) / 15));
  const practiceCount = params.priorKnowledge >= 70 ? 8 : params.priorKnowledge >= 40 ? 15 : 25;

  return {
    estimatedHours,
    practiceCount,
    healthScore: Math.min(90, Math.round(40 + params.priorKnowledge * 0.5)),
    grade: gradeFromScore(params.priorKnowledge),
    steps,
    insights: [
      { priority: "medium", title: concept.title, detail: `${steps.length} steps · ~${estimatedHours}h study · ${practiceCount} practice problems suggested.` },
      { priority: "high", title: "Active recall", detail: "After each step, close notes and explain aloud without looking." },
      { priority: "low", title: "Spaced review", detail: "Revisit this topic at day 1, day 3, and day 7 for retention." },
    ],
    compareRows: [
      { label: "Prior knowledge", target: 80, actual: params.priorKnowledge },
      { label: "Target mastery", target: 90, actual: Math.min(100, params.priorKnowledge + 25) },
    ],
  };
}

export function formulaGeneratorRich(params: { subject: EduSubject; topic: string }): RichResult & { usageTips: string[] } | { error: string } {
  const key = topicKey(params.subject, params.topic);
  const formulas = FORMULA_PACKS[key] ?? [
    { name: "Define variables", expression: "List knowns / unknowns", note: "First step for any formula" },
    { name: "Unit check", expression: "LHS units = RHS units", note: "Always verify dimensions" },
  ];

  const usageTips = formulas.map((f) => `${f.name}: ${f.note || "Apply when variables match the setup."}`);

  return {
    usageTips,
    healthScore: formulas.length >= 3 ? 88 : 72,
    grade: "Good",
    formulas,
    insights: [
      { priority: "medium", title: "Memorise vs derive", detail: "Derive once, then daily 5-min flash recall for speed." },
      { priority: "high", title: "Exam strategy", detail: "Write formula before substituting numbers — catches unit errors early." },
      { priority: "low", title: "Error log", detail: "Track which formula you pick wrongly in mocks; revisit weekly." },
    ],
    chartSlices: formulas.map((f, i) => ({
      name: f.name.slice(0, 14),
      value: formulas.length - i,
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8"][i % 4],
    })),
    compareRows: formulas.slice(0, 3).map((f, i) => ({ label: f.name.slice(0, 10), target: 3, actual: formulas.length - i })),
  };
}

export function questionSolverRich(params: {
  problemType: ProblemType;
  a: number;
  b: number;
  c?: number;
}): RichResult & { answer: string; equation: string } | { error: string } {
  const steps: { step: number; text: string }[] = [];
  let answer = "";
  let equation = "";

  switch (params.problemType) {
    case "linear": {
      if (params.a === 0) return { error: "Coefficient a cannot be zero." };
      equation = `${params.a}x + ${params.b} = 0`;
      steps.push({ step: 1, text: `Start with: ${equation}` });
      steps.push({ step: 2, text: `Move constant: ${params.a}x = ${-params.b}` });
      const x = -params.b / params.a;
      steps.push({ step: 3, text: `Divide by ${params.a}: x = ${Number.isInteger(x) ? x : x.toFixed(4)}` });
      steps.push({ step: 4, text: `Check: ${params.a}×(${Number.isInteger(x) ? x : x.toFixed(4)}) + ${params.b} = 0 ✓` });
      answer = `x = ${Number.isInteger(x) ? x : x.toFixed(4)}`;
      break;
    }
    case "quadratic": {
      const c = params.c ?? 0;
      const disc = params.b * params.b - 4 * params.a * c;
      steps.push({ step: 1, text: `Equation: ${params.a}x² + ${params.b}x + ${c} = 0` });
      steps.push({ step: 2, text: `Discriminant D = b² − 4ac = ${disc}` });
      if (disc < 0) {
        answer = "No real roots";
        steps.push({ step: 3, text: "D < 0 → no real roots." });
      } else {
        const x1 = (-params.b + Math.sqrt(disc)) / (2 * params.a);
        const x2 = (-params.b - Math.sqrt(disc)) / (2 * params.a);
        answer = disc === 0 ? `x = ${x1}` : `x = ${x1} or ${x2}`;
        steps.push({ step: 3, text: `Apply formula: x = (−b ± √D) / 2a → ${answer}` });
      }
      break;
    }
    case "percentage": {
      const result = (params.a * params.b) / 100;
      steps.push({ step: 1, text: `${params.b}% of ${params.a}` });
      steps.push({ step: 2, text: `= (${params.b}/100) × ${params.a}` });
      steps.push({ step: 3, text: `= ${result}` });
      answer = String(result);
      break;
    }
    case "pythagoras": {
      const hyp = Math.sqrt(params.a * params.a + params.b * params.b);
      steps.push({ step: 1, text: `c² = a² + b² = ${params.a}² + ${params.b}²` });
      steps.push({ step: 2, text: `c² = ${params.a * params.a + params.b * params.b}` });
      steps.push({ step: 3, text: `c = ${hyp.toFixed(4)}` });
      answer = hyp.toFixed(4);
      break;
    }
    case "area-circle": {
      const area = Math.PI * params.a * params.a;
      steps.push({ step: 1, text: `A = πr², r = ${params.a}` });
      steps.push({ step: 2, text: `A = π × ${params.a}²` });
      steps.push({ step: 3, text: `A = ${area.toFixed(4)}` });
      answer = area.toFixed(4);
      break;
    }
  }

  return {
    answer,
    equation,
    steps,
    healthScore: 85,
    grade: "Good",
    insights: [
      { priority: "medium", title: "Method", detail: "Inverse operations — isolate the variable, then verify by substitution." },
      { priority: "low", title: "Verify", detail: "Always substitute the answer back into the original equation." },
    ],
  };
}

export function notesGeneratorRich(params: {
  subject: EduSubject;
  topic: string;
  depth: NoteDepth;
}): RichResult & { flashcardCount: number; revisionDays: number[] } | { error: string } {
  const key = topicKey(params.subject, params.topic);
  const pack = NOTES_OUTLINES[key] ?? {
    sections: [
      { title: "Overview", bullets: [`Introduction to ${params.topic}`, "Key terms", "Why it matters"] },
      { title: "Practice", bullets: ["5 basic problems", "3 application problems", "1 challenge problem"] },
    ],
  };

  let sections = pack.sections;
  if (params.depth === "brief") sections = sections.slice(0, 1);
  if (params.depth === "detailed") {
    sections = [
      ...sections,
      { title: "Advanced extensions", bullets: ["Common exam traps", "Cross-topic links", "Quick mnemonic list"] },
      { title: "Self-test", bullets: ["10 flashcards", "5 one-minute recalls", "2 past-paper questions"] },
    ];
  }

  const outline = sections.flatMap((s) => [{ title: s.title, bullets: s.bullets }]);
  const flashcardCount = outline.reduce((n, s) => n + s.bullets.length, 0) * 2;
  const revisionDays = [1, 3, 7, 14];

  return {
    flashcardCount,
    revisionDays,
    healthScore: params.depth === "standard" ? 82 : params.depth === "detailed" ? 88 : 75,
    grade: "Good",
    outline,
    insights: [
      { priority: "medium", title: `${params.depth} notes`, detail: `${outline.length} sections · ~${flashcardCount} flashcards · revise on days ${revisionDays.join(", ")}.` },
      { priority: "high", title: "Cornell method", detail: "Main notes left, cues in margin, 2-line summary at bottom of each page." },
      { priority: "low", title: "Active recall", detail: "Cover notes and recite bullets aloud before checking." },
    ],
    chartSlices: sections.map((s, i) => ({
      name: s.title.slice(0, 12),
      value: s.bullets.length,
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#22c55e"][i % 5],
    })),
    compareRows: sections.map((s) => ({ label: s.title.slice(0, 10), target: 4, actual: s.bullets.length })),
  };
}
