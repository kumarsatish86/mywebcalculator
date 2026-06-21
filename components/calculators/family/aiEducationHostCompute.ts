import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import type { EduSubject } from "@/lib/calculators/aiEducationKnowledge";
import {
  conceptExplainerRich,
  dailyLearningScheduleRich,
  examPrepStrategyRich,
  formulaGeneratorRich,
  marksAnalyzerRich,
  notesGeneratorRich,
  performanceImprovementRich,
  questionSolverRich,
  rankPredictorRich,
  studyPlannerRich,
  timetableGeneratorRich,
  weakAreaDetectorRich,
} from "@/lib/calculators/aiEducationSmartRich";
import {
  parseEnergyPeak,
  parseExamType,
  parseNoteDepth,
  parseProblemType,
  type EnergyPeak,
  type ExamType,
  type NoteDepth,
  type ProblemType,
} from "@/lib/calculators/aiEducationSmart";
import { parseAprPercent, parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiEducationHostTypes";

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
      formulas?: { name: string; expression: string; note?: string }[];
      outline?: { title: string; bullets: string[] }[];
      rankedSubjects?: { name: string; score: number; status: string }[];
      phases?: { phase: string; days: number; focus: string }[];
      milestones?: { week: number; target: number }[];
      usageTips?: string[];
      equation?: string;
    };

export type HostInputs = Record<string, string | EduSubject | ExamType | EnergyPeak | ProblemType | NoteDepth>;

function subjectRows(raw: HostInputs, maxMark: number) {
  return [
    { name: String(raw.s1n || "Subject 1"), marks: Number(raw.m1) || 0, max: maxMark },
    { name: String(raw.s2n || "Subject 2"), marks: Number(raw.m2) || 0, max: maxMark },
    { name: String(raw.s3n || "Subject 3"), marks: Number(raw.m3) || 0, max: maxMark },
    { name: String(raw.s4n || "Subject 4"), marks: Number(raw.m4) || 0, max: maxMark },
    { name: String(raw.s5n || "Subject 5"), marks: Number(raw.m5) || 0, max: maxMark },
    { name: String(raw.s6n || "Subject 6"), marks: Number(raw.m6) || 0, max: maxMark },
  ].filter((s) => s.marks > 0);
}

export function computeEducationHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "studyPlanner": {
      const dte = parsePositive(String(raw.dte), "Days to exam");
      const hpd = parsePositive(String(raw.hpd), "Hours per day");
      if (!dte.ok) return { error: dte.error };
      if (!hpd.ok) return { error: hpd.error };
      const r = studyPlannerRich({
        daysToExam: dte.value,
        hoursPerDay: hpd.value,
        subjects: [
          { name: String(raw.s1n || "Math"), weight: Number(raw.w1) || 3 },
          { name: String(raw.s2n || "Physics"), weight: Number(raw.w2) || 2 },
          { name: String(raw.s3n || "Chemistry"), weight: Number(raw.w3) || 2 },
          { name: String(raw.s4n || "English"), weight: Number(raw.w4) || 1 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.weeklyHours}h`,
        primaryLabel: "Weekly study load",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rows: r.plan.map((p) => ({ label: p.name, value: `${p.hours}h total` })),
      };
    }
    case "timetable": {
      const r = timetableGeneratorRich({
        wakeHour: Number(raw.wh) || 6,
        sleepHour: Number(raw.sh) || 22,
        schoolStart: Number(raw.ss) || 8,
        schoolEnd: Number(raw.se) || 15,
        studyHours: Number(raw.hpd) || 3,
        breakMinutes: Number(raw.brk) || 30,
        subjects: [String(raw.s1n || "Math"), String(raw.s2n || "Science"), String(raw.s3n || "Language")],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.schedule?.length ?? 0} blocks`,
        primaryLabel: "Daily schedule",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        schedule: r.schedule,
      };
    }
    case "examPrep": {
      const dte = parsePositive(String(raw.dte), "Days left");
      if (!dte.ok) return { error: dte.error };
      const r = examPrepStrategyRich({
        daysLeft: dte.value,
        examType: parseExamType(String(raw.et)),
        subjects: [
          { name: String(raw.s1n || "Math"), preparedness: Number(raw.p1) || 50 },
          { name: String(raw.s2n || "Physics"), preparedness: Number(raw.p2) || 45 },
          { name: String(raw.s3n || "Chemistry"), preparedness: Number(raw.p3) || 55 },
          { name: String(raw.s4n || "English"), preparedness: Number(raw.p4) || 60 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.phases[0]?.phase ?? "Foundation",
        primaryLabel: "Start phase",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        phases: r.phases,
        rows: r.phases.map((p) => ({ label: p.phase, value: `${p.days} days · ${p.focus}` })),
      };
    }
    case "dailySchedule": {
      const hpd = parsePositive(String(raw.hpd), "Hours available");
      if (!hpd.ok) return { error: hpd.error };
      const r = dailyLearningScheduleRich({
        hoursAvailable: hpd.value,
        energyPeak: parseEnergyPeak(String(raw.ep)),
        subjects: [
          { name: String(raw.s1n || "Math"), priority: Number(raw.w1) || 5 },
          { name: String(raw.s2n || "Physics"), priority: Number(raw.w2) || 4 },
          { name: String(raw.s3n || "Chemistry"), priority: Number(raw.w3) || 3 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${hpd.value}h`,
        primaryLabel: "Today's study plan",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        schedule: r.schedule,
      };
    }
    case "marksAnalyzer": {
      const mx = parsePositive(String(raw.mx), "Max marks");
      if (!mx.ok) return { error: mx.error };
      const r = marksAnalyzerRich({ subjects: subjectRows(raw, mx.value) });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.overall.toFixed(1)}%`,
        primaryLabel: `Overall · ${r.overallGrade}`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedSubjects: r.rankedSubjects,
      };
    }
    case "weakArea": {
      const mx = parsePositive(String(raw.mx), "Max marks");
      if (!mx.ok) return { error: mx.error };
      const r = weakAreaDetectorRich({
        subjects: subjectRows(raw, mx.value).map((s) => ({ ...s, benchmark: 75 })),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.weakAreas[0]?.name ?? "None",
        primaryLabel: "Top weak area",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedSubjects: r.rankedSubjects,
        rows: r.weakAreas.slice(0, 3).map((w) => ({ label: w.name, value: `${w.gap.toFixed(0)} pt gap` })),
      };
    }
    case "rankPredictor": {
      const ms = parseNonNegative(String(raw.ms), "Your score");
      const mx = parsePositive(String(raw.mx), "Max score");
      const tst = parsePositive(String(raw.tst), "Total students");
      const diff = parseAprPercent(String(raw.diff || "50"), "Difficulty");
      if (!ms.ok) return { error: ms.error };
      if (!mx.ok) return { error: mx.error };
      if (!tst.ok) return { error: tst.error };
      if (!diff.ok) return { error: diff.error };
      const r = rankPredictorRich({
        myScore: ms.value,
        maxScore: mx.value,
        totalStudents: tst.value,
        difficulty: diff.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.rankLow}–${r.rankHigh}`,
        primaryLabel: `${r.percentile}th percentile · ${r.scorePct.toFixed(1)}% score`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        projection: r.projection,
        rows: [
          { label: "Score", value: `${raw.ms}/${raw.mx}` },
          ...(r.pointsToTop10 > 0 ? [{ label: "Marks to top 10%", value: String(Math.ceil(r.pointsToTop10)) }] : []),
        ],
      };
    }
    case "improvementPlan": {
      const ca = parseAprPercent(String(raw.ca), "Current average");
      const ta = parseAprPercent(String(raw.ta), "Target average");
      const wl = parsePositive(String(raw.wl), "Weeks left");
      if (!ca.ok) return { error: ca.error };
      if (!ta.ok) return { error: ta.error };
      if (!wl.ok) return { error: wl.error };
      const r = performanceImprovementRich({
        currentAvg: ca.value,
        targetAvg: ta.value,
        weeksLeft: wl.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `+${r.weeklyDelta.toFixed(1)}%/wk`,
        primaryLabel: "Required weekly gain",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        projection: r.projection,
        scenarios: r.scenarios,
        milestones: r.milestones,
        rows: [
          { label: "Extra daily focus", value: `${r.dailyMinutes} min` },
          { label: "Mid-point target", value: `${r.milestones[Math.floor(r.milestones.length / 2)]?.target ?? "—"}%` },
        ],
      };
    }
    case "conceptExplainer": {
      const pk = parseAprPercent(String(raw.prior || "50"), "Prior knowledge");
      if (!pk.ok) return { error: pk.error };
      const r = conceptExplainerRich({
        subject: (raw.sbj as EduSubject) || "math",
        topic: String(raw.tp || "algebra"),
        priorKnowledge: pk.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.steps?.length ?? 0} steps`,
        primaryLabel: "Study path",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        steps: r.steps,
        compareRows: r.compareRows,
        rows: [
          { label: "Study time", value: `~${r.estimatedHours}h` },
          { label: "Practice problems", value: String(r.practiceCount) },
        ],
      };
    }
    case "formulaGenerator": {
      const r = formulaGeneratorRich({
        subject: (raw.sbj as EduSubject) || "math",
        topic: String(raw.tp || "algebra"),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.formulas?.length ?? 0} formulas`,
        primaryLabel: "Formula pack",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        formulas: r.formulas,
        usageTips: r.usageTips,
        compareRows: r.compareRows,
      };
    }
    case "questionSolver": {
      const a = parseFiniteNumber(String(raw.va), "Coefficient a");
      const b = parseFiniteNumber(String(raw.vb), "Constant b");
      if (!a.ok) return { error: a.error };
      if (!b.ok) return { error: b.error };
      const cRaw = String(raw.vc ?? "0").trim();
      const cParsed = cRaw === "" ? { ok: true as const, value: 0 } : parseFiniteNumber(cRaw, "Constant c");
      if (!cParsed.ok) return { error: cParsed.error };
      const r = questionSolverRich({
        problemType: parseProblemType(String(raw.pt)),
        a: a.value,
        b: b.value,
        c: cParsed.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.answer,
        primaryLabel: "Solution",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        steps: r.steps,
        equation: r.equation,
        rows: r.equation ? [{ label: "Equation", value: r.equation }] : undefined,
      };
    }
    case "notesGenerator": {
      const r = notesGeneratorRich({
        subject: (raw.sbj as EduSubject) || "math",
        topic: String(raw.tp || "algebra"),
        depth: parseNoteDepth(String(raw.dp)),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.outline?.length ?? 0} sections`,
        primaryLabel: "Notes outline",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        outline: r.outline,
        compareRows: r.compareRows,
        rows: [
          { label: "Flashcards", value: String(r.flashcardCount) },
          { label: "Revision days", value: r.revisionDays.join(", ") },
        ],
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
