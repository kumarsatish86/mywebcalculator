/** Health & fitness template generators — in-browser drafts, not medical advice. */
import { draftOk, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenHealthSlug =
  | "aigen-workout-plan-generator"
  | "aigen-home-workout-generator"
  | "aigen-gym-routine-generator"
  | "aigen-weight-loss-plan-generator"
  | "aigen-diet-plan-generator"
  | "aigen-meal-plan-generator"
  | "aigen-calorie-intake-plan-generator"
  | "aigen-keto-vegetarian-diet-generator"
  | "aigen-sleep-schedule-generator"
  | "aigen-meditation-plan-generator"
  | "aigen-daily-routine-generator";

export const AIGEN_HEALTH_SLUGS: AigenHealthSlug[] = [
  "aigen-workout-plan-generator",
  "aigen-home-workout-generator",
  "aigen-gym-routine-generator",
  "aigen-weight-loss-plan-generator",
  "aigen-diet-plan-generator",
  "aigen-meal-plan-generator",
  "aigen-calorie-intake-plan-generator",
  "aigen-keto-vegetarian-diet-generator",
  "aigen-sleep-schedule-generator",
  "aigen-meditation-plan-generator",
  "aigen-daily-routine-generator",
];

export function computeAigenHealth(slug: AigenHealthSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "general fitness");
  const days = Math.max(1, Math.round(numOr(input.days, 7)));
  const calories = Math.round(numOr(input.amount, 2000));
  const weight = numOr(input.weight, 70);
  const style = str(input.style, "balanced");
  const hours = numOr(input.hours, 7.5);

  switch (slug) {
    case "aigen-workout-plan-generator":
      return draftOk([
        `Workout plan — ${topic}`,
        `Horizon: ${days} days · Style: ${style}`,
        "Warm-up 5–8 min every session",
        "Day pattern: Push / Pull / Legs / Active recovery rotate",
        "Strength: 3–4 compound moves, 3 sets",
        "Conditioning: 10–15 min finishers 2×/week",
        "Cool-down: mobility + breathing",
        "Not medical advice — clear new programs with a clinician if needed",
      ]);
    case "aigen-home-workout-generator":
      return draftOk([
        `Home workout — ${topic}`,
        "Equipment-light circuit (repeat 3 rounds)",
        "1) Squats or sit-to-stand × 12",
        "2) Push-ups (knee ok) × 8–12",
        "3) Glute bridge × 12",
        "4) Plank 20–40s",
        "5) March or jog in place 60s",
        `Do ${Math.min(days, 5)} sessions this week; rest as needed`,
      ]);
    case "aigen-gym-routine-generator":
      return draftOk([
        `Gym routine — ${topic}`,
        "A: Squat pattern + accessory + core",
        "B: Hinge / deadlift pattern + rows",
        "C: Press pattern + carries + conditioning",
        "Progression: add small load when sets feel solid",
        "Rest 90–150s on compounds",
        `Schedule across ${days}-day microcycle`,
      ]);
    case "aigen-weight-loss-plan-generator": {
      const deficit = Math.round(calories * 0.85);
      return draftOk(
        [
          `Weight-loss draft — ${topic}`,
          `Body-weight context: ~${weight} kg (teaching input)`,
          `Calorie sketch: ~${calories} maintain → ~${deficit} trial deficit`,
          "Protein-forward plates; veggies at most meals",
          "Steps: walk daily; 2–3 strength sessions",
          "Sleep & stress: protect both or progress stalls",
          "Weigh weekly average, not daily panic",
          "Not medical advice — individual needs vary",
        ],
        { primary: deficit },
      );
    }
    case "aigen-diet-plan-generator":
      return draftOk([
        `Diet plan draft — ${topic}`,
        `Style: ${style} · Calories sketch: ~${calories}`,
        "Breakfast: protein + fiber carb",
        "Lunch: protein + veg + complex carb",
        "Snack: yogurt / nuts / fruit",
        "Dinner: protein + veg + smaller carb if evening sedentary",
        "Hydration: water across the day",
        "Swap foods to match culture and allergies",
      ]);
    case "aigen-meal-plan-generator":
      return draftOk([
        `Meal plan — ${topic} (${days} days sample)`,
        "Day template breakfast / lunch / dinner / snack",
        "Batch-cook proteins + grains twice weekly",
        "Color rule: 2+ vegetable colors daily",
        "Eating out: pick protein + salad; watch sauces",
        `Calorie ballpark: ~${calories}/day`,
        "Adjust portions to hunger and activity",
      ]);
    case "aigen-calorie-intake-plan-generator": {
      const proteinG = Math.round(weight * 1.6);
      const fatG = Math.round((calories * 0.25) / 9);
      const carbG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
      return draftOk(
        [
          `Calorie intake plan — ${topic}`,
          `Daily energy sketch: ~${calories} kcal`,
          `Protein ~${proteinG} g · Fat ~${fatG} g · Carbs ~${carbG} g`,
          "Split across 3–4 meals for adherence",
          "Training days: bias carbs around workouts",
          "Rest days: keep protein steady",
          "Teaching macros only — not personalized medical nutrition",
        ],
        { primary: calories },
      );
    }
    case "aigen-keto-vegetarian-diet-generator":
      return draftOk([
        `Keto / vegetarian idea board — ${topic}`,
        `Style preference: ${style}`,
        "Vegetarian focus: dal, paneer, tofu, eggs if used, nuts, seeds",
        "Lower-carb lean: non-starchy veg, cheese, Greek yogurt, avocado",
        "Keto-leaning days: track net carbs carefully if you choose that path",
        "Electrolytes & fiber matter on low-carb patterns",
        "Not medical advice — restrictive diets need professional guidance",
      ]);
    case "aigen-sleep-schedule-generator": {
      const wake = str(input.notes, "07:00");
      return draftOk(
        [
          `Sleep schedule — ${topic}`,
          `Target sleep: ~${hours} hours · Wake anchor: ${wake}`,
          "Fixed wake time daily (including weekends ±30m)",
          "Wind-down: screens dim 45–60m before bed",
          "Caffeine cutoff: ~8h before sleep",
          "Bedroom: cool, dark, quiet",
          "If you can't sleep 20m: leave bed, return sleepy",
        ],
        { primary: hours },
      );
    }
    case "aigen-meditation-plan-generator":
      return draftOk([
        `Meditation plan — ${topic}`,
        `Start: 5 minutes × ${Math.min(days, 7)} days`,
        "Minute 1–2: settle posture + breath awareness",
        "Minute 3–4: label thoughts gently, return to breath",
        "Close: one intention for the day",
        "Optional: body scan on weekends",
        "Consistency > duration",
      ]);
    case "aigen-daily-routine-generator":
      return draftOk([
        `Daily routine — ${topic}`,
        "Morning: hydrate, light mobility, priority task #1",
        "Midday: protein-forward lunch + short walk",
        "Afternoon: deep work block; protect focus",
        "Evening: workout or walk + prep tomorrow",
        `Night: wind-down aiming ~${hours}h sleep`,
        "One flexible slot for life chaos",
      ]);
    default:
      return { ok: false, error: "Unknown health generator." };
  }
}
