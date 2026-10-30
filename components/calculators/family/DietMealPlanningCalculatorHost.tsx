"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_MEAL_URL,
  dietCheatMealImpact,
  dietDailyMealPlanner,
  dietEatingWindow,
  dietIntermittentFasting,
  dietMealFrequency,
  dietMealPlanCalories,
  dietPortionSize,
} from "@/lib/calculators/dietMealPlanning";

type MealSlug =
  | "diet-meal-plan-calorie-calculator"
  | "diet-daily-meal-planner-calculator"
  | "diet-portion-size-calculator"
  | "diet-meal-frequency-calculator"
  | "diet-intermittent-fasting-calculator"
  | "diet-eating-window-calculator"
  | "diet-cheat-meal-impact-calculator";

type Mode = "plan" | "daily" | "portion" | "frequency" | "if" | "window" | "cheat";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
};

const DISCLAIMER =
  "Wellness education only — not a medical device, fasting prescription, or clinical meal plan. Timing and portions are teaching math; seek professional guidance for personal protocols.";

const CONFIG: Record<MealSlug, Config> = {
  "diet-meal-plan-calorie-calculator": {
    title: "Meal-plan calories",
    description: `Calories per meal = daily calories ÷ meals. ${DISCLAIMER}`,
    mode: "plan",
    aDefault: "2100",
    bDefault: "3",
  },
  "diet-daily-meal-planner-calculator": {
    title: "Daily meal planner",
    description: `Even split plus a simple breakfast/lunch/dinner teaching mix. ${DISCLAIMER}`,
    mode: "daily",
    aDefault: "2100",
    bDefault: "3",
  },
  "diet-portion-size-calculator": {
    title: "Portion size",
    description: `Grams per serving = food grams ÷ servings. ${DISCLAIMER}`,
    mode: "portion",
    aDefault: "400",
    bDefault: "4",
  },
  "diet-meal-frequency-calculator": {
    title: "Meal frequency",
    description: `Per-meal calories from preferred meal count. ${DISCLAIMER}`,
    mode: "frequency",
    aDefault: "2100",
    bDefault: "5",
  },
  "diet-intermittent-fasting-calculator": {
    title: "Intermittent fasting window",
    description: `Eating window = 24 − fasting hours. ${DISCLAIMER}`,
    mode: "if",
    aDefault: "16",
    bDefault: "",
  },
  "diet-eating-window-calculator": {
    title: "Eating window",
    description: `Window hours from start/end hour (0–23, wraps midnight). ${DISCLAIMER}`,
    mode: "window",
    aDefault: "12",
    bDefault: "20",
  },
  "diet-cheat-meal-impact-calculator": {
    title: "Cheat-meal impact",
    description: `Overage vs daily target and weekly average if once. ${DISCLAIMER}`,
    mode: "cheat",
    aDefault: "2000",
    bDefault: "2800",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function DietMealPlanningCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MealSlug] ?? CONFIG["diet-meal-plan-calorie-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_MEAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_MEAL_URL.B, config.bDefault));

  const num = (nVal: number, d = 0) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    put(DIET_MEAL_URL.A, a);
    if (config.mode !== "if") put(DIET_MEAL_URL.B, b);
    return out;
  }, [a, b, config.mode]);

  useLoanUrlSync(shareParams, [a, b]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "plan": {
        const cal = parsePositive(a, "Daily calories");
        const meals = parsePositive(b, "Meals");
        if (!cal.ok) return { error: cal.error };
        if (!meals.ok) return { error: meals.error };
        const computed = dietMealPlanCalories({ dailyCalories: cal.value, meals: meals.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.perMeal, 0),
          primaryLabel: "kcal per meal",
          rows: [
            { label: "Daily calories", value: num(cal.value, 0) },
            { label: "Meals", value: num(meals.value, 0) },
          ],
        };
      }
      case "daily": {
        const cal = parsePositive(a, "Daily calories");
        const meals = parsePositive(b, "Meals");
        if (!cal.ok) return { error: cal.error };
        if (!meals.ok) return { error: meals.error };
        const computed = dietDailyMealPlanner({ dailyCalories: cal.value, meals: meals.value });
        if ("error" in computed) return { error: computed.error };
        const breakfast = computed.perMeal * 0.3;
        const lunch = computed.perMeal * 0.35;
        const dinner = computed.perMeal * 0.35;
        return {
          primary: num(computed.perMeal, 0),
          primaryLabel: "kcal per meal (even)",
          rows: [
            { label: "Breakfast mix", value: num(breakfast, 0) },
            { label: "Lunch mix", value: num(lunch, 0) },
            { label: "Dinner mix", value: num(dinner, 0) },
          ],
        };
      }
      case "portion": {
        const grams = parsePositive(a, "Food grams");
        const servings = parsePositive(b, "Servings");
        if (!grams.ok) return { error: grams.error };
        if (!servings.ok) return { error: servings.error };
        const computed = dietPortionSize({ foodGrams: grams.value, servings: servings.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gramsPerServing, 1),
          primaryLabel: "g per serving",
          rows: [
            { label: "Food grams", value: num(grams.value, 0) },
            { label: "Servings", value: num(servings.value, 0) },
          ],
        };
      }
      case "frequency": {
        const cal = parsePositive(a, "Daily calories");
        const meals = parsePositive(b, "Preferred meals");
        if (!cal.ok) return { error: cal.error };
        if (!meals.ok) return { error: meals.error };
        const computed = dietMealFrequency({ dailyCalories: cal.value, preferredMeals: meals.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.perMeal, 0),
          primaryLabel: "kcal per meal",
          rows: [{ label: "Meals", value: num(meals.value, 0) }],
        };
      }
      case "if": {
        const hours = parseNonNegative(a, "Fasting hours");
        if (!hours.ok) return { error: hours.error };
        const computed = dietIntermittentFasting({ fastingHours: hours.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.eatingWindowHours, 0),
          primaryLabel: "Eating window (hours)",
          rows: [{ label: "Fasting hours", value: num(computed.fastingHours, 0) }],
        };
      }
      case "window": {
        const start = parseFiniteNumber(a, "Start hour");
        const end = parseFiniteNumber(b, "End hour");
        if (!start.ok) return { error: start.error };
        if (!end.ok) return { error: end.error };
        const computed = dietEatingWindow({ startHour: start.value, endHour: end.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.windowHours, 0),
          primaryLabel: "Eating window (hours)",
          rows: [{ label: "Fasting hours", value: num(computed.fastingHours, 0) }],
        };
      }
      case "cheat": {
        const target = parsePositive(a, "Daily target");
        const cheat = parseNonNegative(b, "Cheat meal kcal");
        if (!target.ok) return { error: target.error };
        if (!cheat.ok) return { error: cheat.error };
        const computed = dietCheatMealImpact({ dailyTarget: target.value, cheatKcal: cheat.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.overBy, 0),
          primaryLabel: "Over by (kcal)",
          rows: [{ label: "Weekly avg if once", value: num(computed.weeklyAvgIfOnce, 0) }],
        };
      }
    }
  }, [a, b, config.mode]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "plan" || config.mode === "daily" || config.mode === "frequency" ? (
            <>
              <div>
                <FieldLabel htmlFor="dmp-a">Daily calories</FieldLabel>
                <FieldInput id="dmp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dmp-b">
                  {config.mode === "frequency" ? "Preferred meals" : "Number of meals"}
                </FieldLabel>
                <FieldInput id="dmp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "portion" ? (
            <>
              <div>
                <FieldLabel htmlFor="dmp-a">Food grams</FieldLabel>
                <FieldInput id="dmp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dmp-b">Servings</FieldLabel>
                <FieldInput id="dmp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "if" ? (
            <div>
              <FieldLabel htmlFor="dmp-a">Fasting hours (0–23)</FieldLabel>
              <FieldInput id="dmp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "window" ? (
            <>
              <div>
                <FieldLabel htmlFor="dmp-a">Start hour (0–23)</FieldLabel>
                <FieldInput id="dmp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="dmp-b">End hour (0–23)</FieldLabel>
                <FieldInput id="dmp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "cheat" ? (
            <>
              <div>
                <FieldLabel htmlFor="dmp-a">Daily target (kcal)</FieldLabel>
                <FieldInput id="dmp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dmp-b">Cheat meal (kcal)</FieldLabel>
                <FieldInput id="dmp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
