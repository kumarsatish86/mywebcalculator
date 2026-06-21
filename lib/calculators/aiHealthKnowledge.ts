import type { DietType, HomeEquipment, WorkoutFocus } from "./aiHealthSmart";

export type MealSlot = { meal: string; items: string[]; kcal: number };

export const MEAL_TEMPLATES: Record<DietType, MealSlot[]> = {
  veg: [
    { meal: "Breakfast", items: ["Oats + banana + nuts", "Green tea"], kcal: 420 },
    { meal: "Lunch", items: ["Dal + brown rice", "Mixed vegetable sabzi", "Salad"], kcal: 580 },
    { meal: "Snack", items: ["Greek yogurt / curd", "Seasonal fruit"], kcal: 220 },
    { meal: "Dinner", items: ["Paneer / tofu stir-fry", "Quinoa or roti (2)", "Steamed greens"], kcal: 520 },
  ],
  nonveg: [
    { meal: "Breakfast", items: ["Eggs (2–3) + toast", "Black coffee"], kcal: 450 },
    { meal: "Lunch", items: ["Grilled chicken / fish", "Rice or roti", "Vegetables"], kcal: 620 },
    { meal: "Snack", items: ["Protein shake", "Handful of almonds"], kcal: 280 },
    { meal: "Dinner", items: ["Lean meat curry", "Salad bowl", "Small carb portion"], kcal: 540 },
  ],
  custom: [
    { meal: "Breakfast", items: ["Protein + complex carb", "Healthy fat source"], kcal: 400 },
    { meal: "Lunch", items: ["Palm-size protein", "Fist-size carbs", "Two handfuls veg"], kcal: 550 },
    { meal: "Snack", items: ["High-protein snack", "Hydration"], kcal: 200 },
    { meal: "Dinner", items: ["Light protein focus", "Fibrous vegetables", "Minimal late carbs"], kcal: 480 },
  ],
};

export type ExerciseBlock = { name: string; sets: string; rest: string; note?: string };

export const WORKOUT_POOLS: Record<WorkoutFocus, ExerciseBlock[]> = {
  full: [
    { name: "Squats", sets: "3×10–12", rest: "90s", note: "Depth to parallel" },
    { name: "Push-ups / bench", sets: "3×8–12", rest: "60s" },
    { name: "Rows / pull-downs", sets: "3×10", rest: "60s" },
    { name: "Plank", sets: "3×45s", rest: "45s" },
    { name: "Walking lunges", sets: "3×12/leg", rest: "60s" },
  ],
  upper: [
    { name: "Bench press / push-ups", sets: "4×8–10", rest: "90s" },
    { name: "Overhead press", sets: "3×10", rest: "75s" },
    { name: "Rows", sets: "4×10", rest: "75s" },
    { name: "Lateral raises", sets: "3×12", rest: "45s" },
    { name: "Tricep dips", sets: "3×12", rest: "45s" },
  ],
  lower: [
    { name: "Back squat / goblet squat", sets: "4×8", rest: "120s" },
    { name: "Romanian deadlift", sets: "3×10", rest: "90s" },
    { name: "Leg press / step-ups", sets: "3×12", rest: "75s" },
    { name: "Calf raises", sets: "4×15", rest: "45s" },
    { name: "Glute bridge", sets: "3×15", rest: "45s" },
  ],
  cardio: [
    { name: "Warm-up walk", sets: "5 min", rest: "—" },
    { name: "Intervals (run/bike)", sets: "6×2 min hard / 1 min easy", rest: "built-in" },
    { name: "Steady-state cardio", sets: "15–20 min", rest: "—" },
    { name: "Cool-down stretch", sets: "5 min", rest: "—" },
  ],
  core: [
    { name: "Dead bug", sets: "3×10/side", rest: "45s" },
    { name: "Pallof press", sets: "3×12/side", rest: "45s" },
    { name: "Hanging / lying leg raise", sets: "3×12", rest: "60s" },
    { name: "Side plank", sets: "3×30s/side", rest: "30s" },
    { name: "Bird dog", sets: "3×10/side", rest: "30s" },
  ],
};

export const HOME_EXERCISES: Record<HomeEquipment, ExerciseBlock[]> = {
  none: [
    { name: "Bodyweight squats", sets: "4×15", rest: "45s" },
    { name: "Incline push-ups", sets: "4×12", rest: "45s" },
    { name: "Reverse lunges", sets: "3×12/leg", rest: "45s" },
    { name: "Plank hold", sets: "3×40s", rest: "30s" },
    { name: "Mountain climbers", sets: "3×30s", rest: "30s" },
  ],
  basic: [
    { name: "Dumbbell goblet squat", sets: "4×10", rest: "60s" },
    { name: "DB floor press", sets: "4×10", rest: "60s" },
    { name: "DB row", sets: "4×10/arm", rest: "60s" },
    { name: "Resistance-band pull-apart", sets: "3×15", rest: "30s" },
    { name: "Jump rope finisher", sets: "3×1 min", rest: "45s" },
  ],
  full: [
    { name: "Barbell / DB squat", sets: "4×8", rest: "90s" },
    { name: "Bench / DB press", sets: "4×8", rest: "90s" },
    { name: "Romanian deadlift", sets: "3×10", rest: "90s" },
    { name: "Pull-ups / lat pulldown", sets: "4×8", rest: "75s" },
    { name: "Kettlebell swing", sets: "4×15", rest: "60s" },
  ],
};

export const GYM_SPLITS: Record<string, { day: string; focus: string; exercises: string[] }[]> = {
  full: [
    { day: "Mon", focus: "Full body A", exercises: ["Squat", "Bench", "Row", "Core"] },
    { day: "Wed", focus: "Full body B", exercises: ["Deadlift", "OHP", "Pull-down", "Plank"] },
    { day: "Fri", focus: "Full body C", exercises: ["Lunge", "Incline press", "Cable row", "Carries"] },
  ],
  "upper-lower": [
    { day: "Mon", focus: "Upper", exercises: ["Bench", "Row", "OHP", "Pull-down", "Arms"] },
    { day: "Tue", focus: "Lower", exercises: ["Squat", "RDL", "Leg press", "Calves"] },
    { day: "Thu", focus: "Upper", exercises: ["Incline press", "Cable row", "Lateral raise", "Triceps"] },
    { day: "Fri", focus: "Lower", exercises: ["Front squat", "Hip thrust", "Lunges", "Core"] },
  ],
  "push-pull-legs": [
    { day: "Mon", focus: "Push", exercises: ["Bench", "OHP", "Incline DB", "Triceps", "Lateral raise"] },
    { day: "Tue", focus: "Pull", exercises: ["Deadlift", "Pull-up", "Row", "Face pull", "Biceps"] },
    { day: "Wed", focus: "Legs", exercises: ["Squat", "Leg press", "RDL", "Calves", "Core"] },
    { day: "Fri", focus: "Push", exercises: ["OHP", "Dips", "Cable fly", "Triceps"] },
    { day: "Sat", focus: "Pull + Legs", exercises: ["Row", "Lat pulldown", "Lunges", "Ham curl"] },
  ],
  bro: [
    { day: "Mon", focus: "Chest", exercises: ["Bench", "Incline", "Fly", "Push-ups"] },
    { day: "Tue", focus: "Back", exercises: ["Deadlift", "Pull-up", "Row", "Pulldown"] },
    { day: "Wed", focus: "Shoulders", exercises: ["OHP", "Lateral raise", "Rear delt", "Shrugs"] },
    { day: "Thu", focus: "Legs", exercises: ["Squat", "Leg press", "RDL", "Calves"] },
    { day: "Fri", focus: "Arms", exercises: ["Barbell curl", "Hammer curl", "Tricep pushdown", "Dips"] },
  ],
};

export const HABIT_SUGGESTIONS = [
  "Morning hydration (500 ml)",
  "10-min mobility / stretch",
  "Focused work block",
  "Walk break (15 min)",
  "Meal prep / mindful lunch",
  "Evening wind-down",
  "Sleep hygiene routine",
];

export const STRESS_COPING_TIPS: Record<string, string> = {
  work: "Time-box deep work; take a 5-min breathing break every 90 min.",
  health: "Prioritise sleep and movement — even a 10-min walk lowers cortisol.",
  social: "Schedule one meaningful connection weekly; set boundaries on draining chats.",
  finance: "Review one number weekly (spend or savings) instead of constant checking.",
};
