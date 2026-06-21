import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  GYM_SPLITS,
  HABIT_SUGGESTIONS,
  HOME_EXERCISES,
  MEAL_TEMPLATES,
  STRESS_COPING_TIPS,
  WORKOUT_POOLS,
} from "./aiHealthKnowledge";
import type {
  ActivityLevel,
  DietType,
  ExperienceLevel,
  FitnessGoal,
  GymSplit,
  HomeEquipment,
  HomeSpace,
  Sex,
  WorkoutFocus,
} from "./aiHealthSmart";
import { bmrMifflin, tdeeFromBmr } from "./aiHealthSmart";

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
  exercises?: { name: string; sets: string; rest: string; note?: string }[];
  meals?: { meal: string; items: string[]; kcal: number }[];
  phases?: { phase: string; days: number; focus: string }[];
  milestones?: { week: number; target: number }[];
  usageTips?: string[];
  rankedItems?: { name: string; score: number; status: string }[];
};

const FILLS = ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"];

function goalCalories(tdee: number, goal: FitnessGoal): number {
  if (goal === "lose") return Math.round(tdee - 500);
  if (goal === "gain") return Math.round(tdee + 300);
  return tdee;
}

export function fitnessPlannerRich(params: {
  age: number;
  weightKg: number;
  heightCm: number;
  sex: Sex;
  activity: ActivityLevel;
  goal: FitnessGoal;
  daysPerWeek: number;
}): RichResult & { tdee: number; targetCal: number; weeklyMinutes: number; macroSplit: { p: number; c: number; f: number } } | { error: string } {
  if (params.age < 13 || params.age > 90) return { error: "Enter age between 13 and 90." };
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };
  if (params.daysPerWeek < 1 || params.daysPerWeek > 7) return { error: "Training days must be 1–7." };

  const bmr = bmrMifflin(params);
  const tdee = tdeeFromBmr(bmr, params.activity);
  const targetCal = goalCalories(tdee, params.goal);
  const weeklyMinutes = params.daysPerWeek * 45;
  const proteinG = Math.round(params.weightKg * 1.8);
  const fatG = Math.round((targetCal * 0.25) / 9);
  const carbG = Math.round((targetCal - proteinG * 4 - fatG * 9) / 4);

  let healthScore = 72;
  if (params.daysPerWeek >= 3 && params.daysPerWeek <= 5) healthScore += 12;
  if (params.goal === "maintain") healthScore += 5;
  if (params.activity !== "sedentary") healthScore += 8;
  healthScore = Math.min(100, healthScore);

  const split =
    params.goal === "gain"
      ? ["Push", "Pull", "Legs", "Rest", "Upper", "Lower", "Rest"].slice(0, 7)
      : ["Cardio + core", "Full body", "Active recovery", "Full body", "Cardio", "Rest", "Mobility"].slice(0, 7);

  return {
    tdee,
    targetCal,
    weeklyMinutes,
    macroSplit: { p: proteinG, c: carbG, f: fatG },
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: [
      {
        priority: "high",
        title: "Weekly structure",
        detail: `${params.daysPerWeek} training days · ~${weeklyMinutes} min/week. Alternate hard and easy sessions.`,
      },
      {
        priority: "medium",
        title: "Calorie target",
        detail: `TDEE ~${tdee} kcal → target ${targetCal} kcal for ${params.goal}. Protein ~${proteinG}g/day.`,
      },
      {
        priority: "low",
        title: "Recovery",
        detail: "Sleep 7–9h and walk on rest days — NEAT supports every fitness goal.",
      },
    ],
    chartSlices: [
      { name: "Protein", value: proteinG * 4, fill: FILLS[0] },
      { name: "Carbs", value: carbG * 4, fill: FILLS[1] },
      { name: "Fat", value: fatG * 9, fill: FILLS[2] },
    ],
    compareRows: split.slice(0, params.daysPerWeek).map((d, i) => ({
      label: `Day ${i + 1}`,
      target: 45,
      actual: d.includes("Rest") || d.includes("recovery") ? 20 : 45,
    })),
    schedule: split.slice(0, 7).map((d, i) => ({
      time: `Day ${i + 1}`,
      activity: d,
    })),
  };
}

export function weightLossStrategyRich(params: {
  currentKg: number;
  targetKg: number;
  weeks: number;
  activity: ActivityLevel;
  heightCm: number;
  age: number;
  sex: Sex;
}): RichResult & { weeklyLossKg: number; dailyDeficit: number; totalLossKg: number } | { error: string } {
  if (params.targetKg >= params.currentKg) return { error: "Target weight must be less than current weight." };
  if (params.weeks <= 0) return { error: "Timeline must be at least 1 week." };
  if (params.currentKg <= 0) return { error: "Enter a valid current weight." };

  const totalLossKg = params.currentKg - params.targetKg;
  const weeklyLossKg = totalLossKg / params.weeks;
  if (weeklyLossKg > 1) return { error: "Aim for ≤1 kg/week loss for sustainable results." };

  const bmr = bmrMifflin({ weightKg: params.currentKg, heightCm: params.heightCm, age: params.age, sex: params.sex });
  const tdee = tdeeFromBmr(bmr, params.activity);
  const dailyDeficit = Math.round((weeklyLossKg * 7700) / 7);
  const targetCal = Math.max(1200, tdee - dailyDeficit);

  const healthScore = weeklyLossKg <= 0.5 ? 88 : weeklyLossKg <= 0.75 ? 78 : 65;

  return {
    weeklyLossKg,
    dailyDeficit,
    totalLossKg,
    healthScore,
    grade: weeklyLossKg <= 0.5 ? "Sustainable" : weeklyLossKg <= 0.75 ? "Moderate" : "Aggressive",
    insights: [
      {
        priority: "high",
        title: "Deficit plan",
        detail: `~${dailyDeficit} kcal/day deficit → eat ~${targetCal} kcal (from TDEE ${tdee}).`,
      },
      {
        priority: "medium",
        title: "Weekly pace",
        detail: `Lose ~${weeklyLossKg.toFixed(2)} kg/week for ${params.weeks} weeks (${totalLossKg.toFixed(1)} kg total).`,
      },
      {
        priority: "low",
        title: "Plateau protocol",
        detail: "If weight stalls 2+ weeks, recheck portions or add 2k steps/day before cutting more calories.",
      },
    ],
    projection: Array.from({ length: Math.min(params.weeks + 1, 13) }, (_, i) => ({
      month: i,
      balance: Math.round((params.currentKg - weeklyLossKg * i) * 10) / 10,
    })),
    milestones: Array.from({ length: Math.min(params.weeks, 8) }, (_, i) => ({
      week: i + 1,
      target: Math.round((params.currentKg - weeklyLossKg * (i + 1)) * 10) / 10,
    })),
    compareRows: [
      { label: "Current", target: params.targetKg, actual: params.currentKg },
      { label: "Mid-point", target: params.targetKg, actual: Math.round((params.currentKg + params.targetKg) / 2) },
      { label: "Target", target: params.targetKg, actual: params.targetKg },
    ],
    scenarios: [
      { label: "Conservative", months: params.weeks, monthly: params.currentKg - weeklyLossKg * params.weeks * 0.8 },
      { label: "On plan", months: params.weeks, monthly: params.targetKg },
      { label: "With slip", months: params.weeks, monthly: params.currentKg - weeklyLossKg * params.weeks * 0.9 },
    ],
  };
}

export function dietPlannerRich(params: {
  dietType: DietType;
  targetCal: number;
  mealsPerDay: number;
  weightKg: number;
}): RichResult & { totalKcal: number; proteinG: number } | { error: string } {
  if (params.targetCal < 1200 || params.targetCal > 5000) return { error: "Enter calories between 1200 and 5000." };
  if (params.mealsPerDay < 3 || params.mealsPerDay > 6) return { error: "Meals per day must be 3–6." };

  const base = MEAL_TEMPLATES[params.dietType];
  const scale = params.targetCal / base.reduce((s, m) => s + m.kcal, 0);
  const meals = base.slice(0, params.mealsPerDay).map((m) => ({
    ...m,
    kcal: Math.round(m.kcal * scale),
    items: [...m.items, scale > 1.1 ? "Add portion if still hungry" : scale < 0.9 ? "Reduce oil / portions slightly" : ""].filter(Boolean),
  }));
  const totalKcal = meals.reduce((s, m) => s + m.kcal, 0);
  const proteinG = Math.round(params.weightKg * (params.dietType === "veg" ? 1.6 : 1.8));

  return {
    totalKcal,
    proteinG,
    meals,
    healthScore: Math.min(92, 70 + meals.length * 4),
    grade: "Balanced",
    insights: [
      {
        priority: "high",
        title: `${params.dietType} template`,
        detail: `${meals.length} meals · ~${totalKcal} kcal · aim ${proteinG}g protein via dal, paneer, eggs, or lean meat.`,
      },
      {
        priority: "medium",
        title: "Meal timing",
        detail: "Front-load carbs around training; keep dinner lighter if sedentary in the evening.",
      },
      {
        priority: "low",
        title: "Hydration",
        detail: "Target 30–35 ml/kg body weight daily — more in heat or high activity.",
      },
    ],
    chartSlices: meals.map((m, i) => ({ name: m.meal, value: m.kcal, fill: FILLS[i % FILLS.length] })),
    compareRows: meals.map((m) => ({ label: m.meal.slice(0, 8), target: params.targetCal / meals.length, actual: m.kcal })),
    usageTips: meals.flatMap((m) => m.items.slice(0, 1)),
  };
}

export function calorieOptimizationRich(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activity: ActivityLevel;
  goal: FitnessGoal;
}): RichResult & { bmr: number; tdee: number; targetCal: number; macros: { protein: number; carbs: number; fat: number } } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };

  const bmr = Math.round(bmrMifflin(params));
  const tdee = tdeeFromBmr(bmr, params.activity);
  const targetCal = goalCalories(tdee, params.goal);
  const protein = Math.round(params.weightKg * (params.goal === "gain" ? 2.0 : 1.8));
  const fat = Math.round((targetCal * 0.28) / 9);
  const carbs = Math.round((targetCal - protein * 4 - fat * 9) / 4);
  const proteinPct = (protein * 4) / targetCal;
  const healthScore = Math.round(60 + proteinPct * 40);

  return {
    bmr,
    tdee,
    targetCal,
    macros: { protein, carbs, fat },
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: [
      { priority: "high", title: "Optimized intake", detail: `Eat ~${targetCal} kcal (${params.goal}): ${protein}g P · ${carbs}g C · ${fat}g F.` },
      { priority: "medium", title: "BMR vs TDEE", detail: `Resting burn ${bmr} kcal; with activity → ${tdee} kcal maintenance.` },
      { priority: "low", title: "Adjust weekly", detail: "Track weight 2 weeks; if no change, shift ±150 kcal." },
    ],
    chartSlices: [
      { name: "Protein", value: protein * 4, fill: FILLS[0] },
      { name: "Carbs", value: carbs * 4, fill: FILLS[1] },
      { name: "Fat", value: fat * 9, fill: FILLS[2] },
    ],
    compareRows: [
      { label: "BMR", target: tdee, actual: bmr },
      { label: "TDEE", target: tdee, actual: tdee },
      { label: "Target", target: tdee, actual: targetCal },
    ],
  };
}

export function workoutGeneratorRich(params: {
  focus: WorkoutFocus;
  durationMin: number;
  level: ExperienceLevel;
}): RichResult & { exerciseCount: number } | { error: string } {
  if (params.durationMin < 15 || params.durationMin > 120) return { error: "Duration must be 15–120 minutes." };

  const pool = WORKOUT_POOLS[params.focus];
  const count = params.level === "beginner" ? 4 : params.level === "intermediate" ? 5 : pool.length;
  const exercises = pool.slice(0, count).map((e) => ({
    ...e,
    sets: params.level === "beginner" ? e.sets.replace(/4/g, "3") : e.sets,
  }));

  return {
    exerciseCount: exercises.length,
    exercises,
    healthScore: 82,
    grade: "Ready",
    insights: [
      { priority: "high", title: "Session plan", detail: `${params.durationMin} min ${params.focus} · ${params.level} — warm up 5 min first.` },
      { priority: "medium", title: "Progression", detail: "Add 1 rep or 2.5 kg when all sets feel ≤2 reps in reserve." },
      { priority: "low", title: "Cool-down", detail: "5 min walk + stretch hip flexors and chest after session." },
    ],
    chartSlices: exercises.map((e, i) => ({ name: e.name.slice(0, 10), value: params.durationMin / exercises.length, fill: FILLS[i % FILLS.length] })),
    steps: exercises.map((e, i) => ({ step: i + 1, text: `${e.name} — ${e.sets} (rest ${e.rest})` })),
  };
}

export function muscleGainPlannerRich(params: {
  weightKg: number;
  experience: ExperienceLevel;
  proteinPerKg: number;
  surplusPct: number;
  daysPerWeek: number;
}): RichResult & { bulkCal: number; proteinG: number; weeklyVolume: number } | { error: string } {
  if (params.weightKg <= 0) return { error: "Enter a valid weight." };
  if (params.surplusPct < 5 || params.surplusPct > 25) return { error: "Surplus should be 5–25%." };

  const maintenance = Math.round(params.weightKg * 33);
  const bulkCal = Math.round(maintenance * (1 + params.surplusPct / 100));
  const proteinG = Math.round(params.weightKg * params.proteinPerKg);
  const setsPerWeek = params.experience === "beginner" ? 10 : params.experience === "intermediate" ? 14 : 18;
  const weeklyVolume = setsPerWeek * params.daysPerWeek;

  return {
    bulkCal,
    proteinG,
    weeklyVolume,
    healthScore: params.surplusPct <= 15 ? 85 : 70,
    grade: params.surplusPct <= 12 ? "Lean bulk" : "Aggressive bulk",
    insights: [
      { priority: "high", title: "Calorie surplus", detail: `~${bulkCal} kcal/day (+${params.surplusPct}%) with ${proteinG}g protein for hypertrophy.` },
      { priority: "medium", title: "Volume", detail: `${weeklyVolume} hard sets/week across ${params.daysPerWeek} days — track progressive overload.` },
      { priority: "low", title: "Sleep", detail: "7–9h sleep drives most natural testosterone and recovery for muscle gain." },
    ],
    phases: [
      { phase: "Accumulation", days: 4, focus: "Higher volume · 6–12 rep range" },
      { phase: "Intensification", days: 3, focus: "Heavier loads · 4–8 reps" },
      { phase: "Deload", days: 1, focus: "50% volume week every 4–6 weeks" },
    ],
    compareRows: [
      { label: "Protein", target: proteinG, actual: proteinG },
      { label: "Sets/wk", target: 16, actual: weeklyVolume },
      { label: "Surplus %", target: 12, actual: params.surplusPct },
    ],
    projection: [0, 4, 8, 12].map((w) => ({ month: w, balance: Math.round(params.weightKg + w * 0.15) })),
  };
}

export function homeWorkoutPlannerRich(params: {
  space: HomeSpace;
  equipment: HomeEquipment;
  durationMin: number;
  daysPerWeek: number;
}): RichResult | { error: string } {
  if (params.durationMin < 15 || params.durationMin > 90) return { error: "Duration must be 15–90 minutes." };

  const exercises = HOME_EXERCISES[params.equipment];
  const circuits = params.space === "small" ? 3 : params.space === "medium" ? 4 : 5;

  const schedule = Array.from({ length: params.daysPerWeek }, (_, i) => ({
    time: `Day ${i + 1}`,
    activity: `${params.durationMin} min circuit · ${circuits} rounds · ${params.equipment} kit`,
  }));

  return {
    healthScore: params.equipment === "none" ? 75 : 88,
    grade: "Home-ready",
    exercises: exercises.slice(0, circuits + 2),
    schedule,
    insights: [
      { priority: "high", title: "Space setup", detail: `${params.space} space: clear ${params.space === "small" ? "2×2 m" : "3×3 m"} for safe movement.` },
      { priority: "medium", title: "Circuit format", detail: `Run ${circuits} rounds, 45s work / 15s transition, 2 min rest between rounds.` },
      { priority: "low", title: "Progression", detail: "Add reps, tempo, or band tension before buying more equipment." },
    ],
    chartSlices: exercises.slice(0, 4).map((e, i) => ({ name: e.name.slice(0, 10), value: params.durationMin / 4, fill: FILLS[i] })),
    steps: exercises.map((e, i) => ({ step: i + 1, text: `${e.name} — ${e.sets}` })),
  };
}

export function gymRoutineBuilderRich(params: {
  split: GymSplit;
  daysPerWeek: number;
  focus: WorkoutFocus;
}): RichResult & { programDays: { day: string; focus: string; exercises: string[] }[] } | { error: string } {
  if (params.daysPerWeek < 2 || params.daysPerWeek > 6) return { error: "Training days must be 2–6." };

  const program = GYM_SPLITS[params.split].slice(0, params.daysPerWeek);

  return {
    programDays: program,
    healthScore: params.split === "push-pull-legs" && params.daysPerWeek >= 4 ? 90 : 78,
    grade: "Structured",
    schedule: program.map((p) => ({ time: p.day, activity: `${p.focus}: ${p.exercises.join(", ")}` })),
    insights: [
      { priority: "high", title: `${params.split} split`, detail: `${params.daysPerWeek} days/week — ${program.map((p) => p.focus).join(" · ")}.` },
      { priority: "medium", title: "Accessory focus", detail: `Emphasise ${params.focus} accessories on the last exercise of each day.` },
      { priority: "low", title: "Deload", detail: "Every 5th week, cut sets by 40% if joints or sleep suffer." },
    ],
    chartSlices: program.map((p, i) => ({ name: p.focus, value: p.exercises.length, fill: FILLS[i % FILLS.length] })),
    compareRows: program.map((p) => ({ label: p.day, target: 5, actual: p.exercises.length })),
  };
}

export function sleepOptimizerRich(params: {
  bedHour: number;
  wakeHour: number;
  quality: number;
  screenMin: number;
}): RichResult & { sleepHours: number; sleepScore: number } | { error: string } {
  let sleepHours = params.wakeHour - params.bedHour;
  if (sleepHours <= 0) sleepHours += 24;
  if (sleepHours > 12) return { error: "Check bed and wake times — sleep window seems too long." };

  let sleepScore = params.quality;
  if (sleepHours >= 7 && sleepHours <= 9) sleepScore += 15;
  else if (sleepHours < 6) sleepScore -= 20;
  if (params.screenMin > 60) sleepScore -= 15;
  else if (params.screenMin <= 30) sleepScore += 5;
  sleepScore = Math.max(0, Math.min(100, Math.round(sleepScore)));

  const idealBed = params.wakeHour - 8;
  const bedShift = idealBed - params.bedHour;

  return {
    sleepHours,
    sleepScore,
    healthScore: sleepScore,
    grade: gradeFromScore(sleepScore),
    insights: [
      {
        priority: sleepHours < 7 ? "high" : "medium",
        title: "Duration",
        detail: `${sleepHours.toFixed(1)}h in bed — aim 7–9h for most adults.`,
      },
      {
        priority: params.screenMin > 45 ? "high" : "low",
        title: "Screen curfew",
        detail:
          params.screenMin > 45
            ? `Cut ${params.screenMin} min pre-bed screens — try ${Math.max(15, params.screenMin - 30)} min tonight.`
            : "Good screen hygiene — keep devices out of the bedroom.",
      },
      {
        priority: "medium",
        title: "Schedule tweak",
        detail:
          bedShift > 0.5
            ? `Try bed ~${bedShift.toFixed(1)}h earlier for an 8h window before wake.`
            : "Bedtime aligns well with wake time — focus on consistency.",
      },
    ],
    compareRows: [
      { label: "Duration", target: 8, actual: sleepHours },
      { label: "Quality", target: 85, actual: params.quality },
      { label: "Screen", target: 30, actual: params.screenMin },
    ],
    steps: [
      { step: 1, text: "Fixed wake time — even weekends (+/− 30 min)." },
      { step: 2, text: `Wind-down starts ${Math.min(60, params.screenMin + 15)} min before bed.` },
      { step: 3, text: "Cool, dark room; no caffeine 8h before sleep." },
      { step: 4, text: "Morning light within 30 min of waking." },
    ],
  };
}

export function stressAnalyzerRich(params: {
  work: number;
  health: number;
  social: number;
  finance: number;
}): RichResult & { stressIndex: number; topStressor: string } | { error: string } {
  const factors = [
    { name: "Work", score: params.work, key: "work" },
    { name: "Health", score: params.health, key: "health" },
    { name: "Social", score: params.social, key: "social" },
    { name: "Finance", score: params.finance, key: "finance" },
  ];
  if (factors.some((f) => f.score < 0 || f.score > 10)) return { error: "Each stress factor must be 0–10." };

  const avg = factors.reduce((s, f) => s + f.score, 0) / factors.length;
  const stressIndex = Math.round(avg * 10);
  const top = [...factors].sort((a, b) => b.score - a.score)[0];

  return {
    stressIndex,
    topStressor: top.name,
    healthScore: 100 - stressIndex,
    grade: stressIndex <= 30 ? "Low stress" : stressIndex <= 55 ? "Moderate" : "High load",
    rankedItems: factors.map((f) => ({
      name: f.name,
      score: f.score * 10,
      status: f.score >= 7 ? "High" : f.score >= 4 ? "Moderate" : "Low",
    })).sort((a, b) => b.score - a.score),
    insights: [
      { priority: top.score >= 7 ? "high" : "medium", title: `Top stressor: ${top.name}`, detail: STRESS_COPING_TIPS[top.key] },
      { priority: "medium", title: "Composite index", detail: `Stress index ${stressIndex}/100 — ${avg.toFixed(1)}/10 average across four life areas.` },
      { priority: "low", title: "Recovery habit", detail: "10 min daily walk or box breathing (4-4-4-4) lowers perceived stress within a week." },
    ],
    chartSlices: factors.map((f, i) => ({ name: f.name, value: f.score, fill: FILLS[i] })),
    compareRows: factors.map((f) => ({ label: f.name, target: 4, actual: f.score })),
  };
}

export function dailyHabitPlannerRich(params: {
  wakeHour: number;
  habits: { name: string; minutes: number }[];
}): RichResult & { totalMinutes: number; habitCount: number } | { error: string } {
  const habits = params.habits.filter((h) => h.name.trim() && h.minutes > 0);
  if (!habits.length) return { error: "Add at least one habit with duration." };

  const totalMinutes = habits.reduce((s, h) => s + h.minutes, 0);
  if (totalMinutes > 480) return { error: "Total habit time exceeds 8 hours — prioritise top 4." };

  let t = params.wakeHour;
  const fmt = (h: number) => {
    const hr = Math.floor(h);
    const min = Math.round((h - hr) * 60);
    return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  const schedule: { time: string; activity: string }[] = [];
  schedule.push({ time: fmt(t), activity: "Wake · hydration" });
  t += 0.25;

  for (const h of habits) {
    schedule.push({ time: fmt(t), activity: `${h.name} (${h.minutes} min)` });
    t += h.minutes / 60;
    schedule.push({ time: fmt(t), activity: "Micro-break (5 min)" });
    t += 5 / 60;
  }

  const healthScore = Math.min(92, 60 + habits.length * 8);

  return {
    totalMinutes,
    habitCount: habits.length,
    healthScore,
    grade: gradeFromScore(healthScore),
    schedule,
    insights: [
      { priority: "high", title: "Stack order", detail: "Anchor hardest habit right after wake or existing routine (habit stacking)." },
      { priority: "medium", title: "Time budget", detail: `${totalMinutes} min of intentional habits — leave buffer for life variance.` },
      { priority: "low", title: "Suggestions", detail: HABIT_SUGGESTIONS.slice(0, 3).join(" · ") },
    ],
    chartSlices: habits.map((h, i) => ({ name: h.name.slice(0, 10), value: h.minutes, fill: FILLS[i % FILLS.length] })),
    compareRows: habits.map((h) => ({ label: h.name.slice(0, 8), target: 30, actual: h.minutes })),
    usageTips: HABIT_SUGGESTIONS.slice(0, 4),
  };
}
