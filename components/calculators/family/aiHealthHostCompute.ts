import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  calorieOptimizationRich,
  dailyHabitPlannerRich,
  dietPlannerRich,
  fitnessPlannerRich,
  gymRoutineBuilderRich,
  homeWorkoutPlannerRich,
  muscleGainPlannerRich,
  sleepOptimizerRich,
  stressAnalyzerRich,
  weightLossStrategyRich,
  workoutGeneratorRich,
} from "@/lib/calculators/aiHealthSmartRich";
import {
  parseActivityLevel,
  parseDietType,
  parseExperienceLevel,
  parseFitnessGoal,
  parseGymSplit,
  parseHomeEquipment,
  parseHomeSpace,
  parseSex,
  parseWorkoutFocus,
  type ActivityLevel,
  type DietType,
  type ExperienceLevel,
  type FitnessGoal,
  type GymSplit,
  type HomeEquipment,
  type HomeSpace,
  type Sex,
  type WorkoutFocus,
} from "@/lib/calculators/aiHealthSmart";
import { parseAprPercent, parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiHealthHostTypes";

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
      exercises?: { name: string; sets: string; rest: string; note?: string }[];
      meals?: { meal: string; items: string[]; kcal: number }[];
      phases?: { phase: string; days: number; focus: string }[];
      milestones?: { week: number; target: number }[];
      usageTips?: string[];
      rankedItems?: { name: string; score: number; status: string }[];
      programDays?: { day: string; focus: string; exercises: string[] }[];
    };

export type HostInputs = Record<string, string | FitnessGoal | ActivityLevel | DietType | WorkoutFocus | ExperienceLevel | HomeSpace | HomeEquipment | GymSplit | Sex>;

export function computeHealthHostResult(mode: Mode, raw: HostInputs): HostResult {
  const age = Number(raw.age) || 28;
  const weight = Number(raw.wt) || 70;
  const height = Number(raw.ht) || 170;
  const sex = parseSex(String(raw.sx || "male"));
  const activity = parseActivityLevel(String(raw.act || "moderate"));

  switch (mode) {
    case "fitnessPlanner": {
      const days = parsePositive(String(raw.dys || "4"), "Training days");
      if (!days.ok) return { error: days.error };
      const r = fitnessPlannerRich({
        age,
        weightKg: weight,
        heightCm: height,
        sex,
        activity,
        goal: parseFitnessGoal(String(raw.gl || "maintain")),
        daysPerWeek: days.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.targetCal} kcal`,
        primaryLabel: `TDEE ${r.tdee} · ${r.weeklyMinutes} min/week`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        rows: [
          { label: "Protein", value: `${r.macroSplit.p}g` },
          { label: "Carbs", value: `${r.macroSplit.c}g` },
          { label: "Fat", value: `${r.macroSplit.f}g` },
        ],
      };
    }
    case "weightLoss": {
      const tgt = parsePositive(String(raw.tgt || "65"), "Target weight");
      const wl = parsePositive(String(raw.wl || "12"), "Weeks");
      if (!tgt.ok) return { error: tgt.error };
      if (!wl.ok) return { error: wl.error };
      const r = weightLossStrategyRich({
        currentKg: weight,
        targetKg: tgt.value,
        weeks: wl.value,
        activity,
        heightCm: height,
        age,
        sex,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.weeklyLossKg.toFixed(2)} kg/wk`,
        primaryLabel: "Sustainable loss pace",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        projection: r.projection,
        milestones: r.milestones,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: [
          { label: "Daily deficit", value: `${r.dailyDeficit} kcal` },
          { label: "Total loss", value: `${r.totalLossKg.toFixed(1)} kg` },
        ],
      };
    }
    case "dietPlanner": {
      const cal = parsePositive(String(raw.cal || "2000"), "Target calories");
      const mls = parsePositive(String(raw.mls || "4"), "Meals per day");
      if (!cal.ok) return { error: cal.error };
      if (!mls.ok) return { error: mls.error };
      const r = dietPlannerRich({
        dietType: parseDietType(String(raw.diet || "veg")),
        targetCal: cal.value,
        mealsPerDay: mls.value,
        weightKg: weight,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.totalKcal} kcal`,
        primaryLabel: "Daily meal plan",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        meals: r.meals,
        usageTips: r.usageTips,
        rows: [{ label: "Protein target", value: `${r.proteinG}g` }],
      };
    }
    case "calorieOptimization": {
      const r = calorieOptimizationRich({
        weightKg: weight,
        heightCm: height,
        age,
        sex,
        activity,
        goal: parseFitnessGoal(String(raw.gl || "maintain")),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.targetCal} kcal`,
        primaryLabel: "Optimized daily intake",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rows: [
          { label: "BMR", value: `${r.bmr} kcal` },
          { label: "TDEE", value: `${r.tdee} kcal` },
          { label: "Macros", value: `${r.macros.protein}P / ${r.macros.carbs}C / ${r.macros.fat}F` },
        ],
      };
    }
    case "workoutGenerator": {
      const dur = parsePositive(String(raw.dur || "45"), "Duration");
      if (!dur.ok) return { error: dur.error };
      const r = workoutGeneratorRich({
        focus: parseWorkoutFocus(String(raw.fcs || "full")),
        durationMin: dur.value,
        level: parseExperienceLevel(String(raw.lvl || "intermediate")),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.exerciseCount} exercises`,
        primaryLabel: "Generated session",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        steps: r.steps,
        exercises: r.exercises,
      };
    }
    case "muscleGain": {
      const sur = parseAprPercent(String(raw.sur || "12"), "Surplus");
      const prt = parsePositive(String(raw.prt || "2"), "Protein g/kg");
      const dys = parsePositive(String(raw.dys || "4"), "Training days");
      if (!sur.ok) return { error: sur.error };
      if (!prt.ok) return { error: prt.error };
      if (!dys.ok) return { error: dys.error };
      const r = muscleGainPlannerRich({
        weightKg: weight,
        experience: parseExperienceLevel(String(raw.exp || "intermediate")),
        proteinPerKg: prt.value,
        surplusPct: sur.value,
        daysPerWeek: dys.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.bulkCal} kcal`,
        primaryLabel: "Lean bulk target",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        phases: r.phases,
        compareRows: r.compareRows,
        projection: r.projection,
        rows: [
          { label: "Protein", value: `${r.proteinG}g/day` },
          { label: "Weekly volume", value: `${r.weeklyVolume} hard sets` },
        ],
      };
    }
    case "homeWorkout": {
      const dur = parsePositive(String(raw.dur || "30"), "Duration");
      const dys = parsePositive(String(raw.dys || "4"), "Days per week");
      if (!dur.ok) return { error: dur.error };
      if (!dys.ok) return { error: dys.error };
      const r = homeWorkoutPlannerRich({
        space: parseHomeSpace(String(raw.spc || "medium")),
        equipment: parseHomeEquipment(String(raw.eqp || "basic")),
        durationMin: dur.value,
        daysPerWeek: dys.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${dur.value} min`,
        primaryLabel: "Home session length",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        schedule: r.schedule,
        steps: r.steps,
        exercises: r.exercises,
      };
    }
    case "gymRoutine": {
      const dys = parsePositive(String(raw.dys || "4"), "Training days");
      if (!dys.ok) return { error: dys.error };
      const r = gymRoutineBuilderRich({
        split: parseGymSplit(String(raw.spl || "push-pull-legs")),
        daysPerWeek: dys.value,
        focus: parseWorkoutFocus(String(raw.fcs || "full")),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${dys.value} days`,
        primaryLabel: `${String(raw.spl || "push-pull-legs").replace(/-/g, " ")} program`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        programDays: r.programDays,
      };
    }
    case "sleepOptimizer": {
      const qlt = parseAprPercent(String(raw.qlt || "65"), "Sleep quality");
      const scr = parseNonNegative(String(raw.scr || "45"), "Screen minutes");
      if (!qlt.ok) return { error: qlt.error };
      if (!scr.ok) return { error: scr.error };
      const r = sleepOptimizerRich({
        bedHour: Number(raw.bed) || 23,
        wakeHour: Number(raw.wake) || 7,
        quality: qlt.value,
        screenMin: scr.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.sleepHours.toFixed(1)}h`,
        primaryLabel: `Sleep score ${r.sleepScore}`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        steps: r.steps,
      };
    }
    case "stressAnalyzer": {
      const s1 = parseFiniteNumber(String(raw.s1 || "6"), "Work stress");
      const s2 = parseFiniteNumber(String(raw.s2 || "4"), "Health stress");
      const s3 = parseFiniteNumber(String(raw.s3 || "5"), "Social stress");
      const s4 = parseFiniteNumber(String(raw.s4 || "5"), "Finance stress");
      if (!s1.ok) return { error: s1.error };
      if (!s2.ok) return { error: s2.error };
      if (!s3.ok) return { error: s3.error };
      if (!s4.ok) return { error: s4.error };
      if ([s1.value, s2.value, s3.value, s4.value].some((v) => v < 0 || v > 10)) {
        return { error: "Each stress factor must be 0–10." };
      }
      const r = stressAnalyzerRich({
        work: s1.value,
        health: s2.value,
        social: s3.value,
        finance: s4.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.stressIndex}/100`,
        primaryLabel: `Top stressor: ${r.topStressor}`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
      };
    }
    case "dailyHabit": {
      const wake = Number(raw.wake) || 6;
      const habits = [
        { name: String(raw.h1 || "Morning stretch"), minutes: Number(raw.h1m) || 15 },
        { name: String(raw.h2 || "Deep work block"), minutes: Number(raw.h2m) || 60 },
        { name: String(raw.h3 || "Walk / movement"), minutes: Number(raw.h3m) || 20 },
        { name: String(raw.h4 || "Evening journal"), minutes: Number(raw.h4m) || 10 },
      ];
      const r = dailyHabitPlannerRich({ wakeHour: wake, habits });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.habitCount} habits`,
        primaryLabel: `${r.totalMinutes} min intentional time`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        usageTips: r.usageTips,
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
