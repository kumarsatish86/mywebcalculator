"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_NUTRITION_URL,
  calorieDeficitSurplus,
  glycemicIndexLoad,
  macronutrientSplit,
  mealPlanner,
  proteinIntake,
  tdeeFromBmr,
  waterIntake,
} from "@/lib/calculators/biologyNutrition";

type NutritionSlug =
  | "macronutrient-calculator"
  | "protein-intake-calculator"
  | "water-intake-calculator"
  | "calorie-deficit-surplus-calculator"
  | "tdee-calculator"
  | "meal-planner-calculator"
  | "glycemic-index-calculator";

type Mode = "macro" | "protein" | "water" | "deficit" | "tdee" | "meal" | "gi";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  wDefault: string;
  pDefault: string;
  fDefault: string;
};

const CONFIG: Record<NutritionSlug, Config> = {
  "macronutrient-calculator": {
    title: "Macronutrient split",
    description: "Split daily calories into protein/carb/fat grams. Educational diet math — not medical advice.",
    mode: "macro",
    aDefault: "2000",
    bDefault: "",
    cDefault: "40",
    wDefault: "",
    pDefault: "30",
    fDefault: "30",
  },
  "protein-intake-calculator": {
    title: "Protein intake",
    description: "Protein (g) = weight (kg) × g/kg. Classroom heuristic — not medical advice.",
    mode: "protein",
    aDefault: "1.6",
    bDefault: "",
    cDefault: "",
    wDefault: "70",
    pDefault: "",
    fDefault: "",
  },
  "water-intake-calculator": {
    title: "Water intake",
    description: "Educational ~35 mL/kg heuristic (override with custom mL/kg). Not medical advice.",
    mode: "water",
    aDefault: "35",
    bDefault: "",
    cDefault: "",
    wDefault: "70",
    pDefault: "",
    fDefault: "",
  },
  "calorie-deficit-surplus-calculator": {
    title: "Calorie deficit / surplus",
    description: "Compare intake to TDEE. Educational energy-balance math — not medical advice.",
    mode: "deficit",
    aDefault: "2500",
    bDefault: "2000",
    cDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "tdee-calculator": {
    title: "TDEE from BMR",
    description: "TDEE ≈ BMR × activity factor. Educational only — not medical advice.",
    mode: "tdee",
    aDefault: "1600",
    bDefault: "1.55",
    cDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "meal-planner-calculator": {
    title: "Meal planner",
    description: "Split daily calories evenly across N meals. Educational planning aid — not medical advice.",
    mode: "meal",
    aDefault: "2000",
    bDefault: "3",
    cDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "glycemic-index-calculator": {
    title: "Glycemic load",
    description: "GL ≈ (GI × carbs g) / 100. Educational food-math — not medical advice.",
    mode: "gi",
    aDefault: "55",
    bDefault: "30",
    cDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
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

export function BiologyNutritionCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as NutritionSlug] ?? CONFIG["macronutrient-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_NUTRITION_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_NUTRITION_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_NUTRITION_URL.C, config.cDefault));
  const [w, setW] = useState(useLoanInitialInput(BIOLOGY_NUTRITION_URL.W, config.wDefault));
  const [p, setP] = useState(useLoanInitialInput(BIOLOGY_NUTRITION_URL.P, config.pDefault));
  const [f, setF] = useState(useLoanInitialInput(BIOLOGY_NUTRITION_URL.F, config.fDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "macro":
        put(BIOLOGY_NUTRITION_URL.A, a);
        put(BIOLOGY_NUTRITION_URL.P, p);
        put(BIOLOGY_NUTRITION_URL.C, c);
        put(BIOLOGY_NUTRITION_URL.F, f);
        break;
      case "protein":
      case "water":
        put(BIOLOGY_NUTRITION_URL.W, w);
        put(BIOLOGY_NUTRITION_URL.A, a);
        break;
      case "deficit":
      case "tdee":
      case "meal":
      case "gi":
        put(BIOLOGY_NUTRITION_URL.A, a);
        put(BIOLOGY_NUTRITION_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, w, p, f, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, w, p, f]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "macro": {
        const cal = parsePositive(a, "Calories");
        const prot = parseNonNegative(p, "Protein %");
        const carb = parseNonNegative(c, "Carb %");
        const fat = parseNonNegative(f, "Fat %");
        if (!cal.ok) return { error: cal.error };
        if (!prot.ok) return { error: prot.error };
        if (!carb.ok) return { error: carb.error };
        if (!fat.ok) return { error: fat.error };
        const computed = macronutrientSplit({
          calories: cal.value,
          proteinPct: prot.value,
          carbPct: carb.value,
          fatPct: fat.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.proteinG, 1)} g protein`,
          primaryLabel: "Protein grams",
          rows: [
            { label: "Carbs", value: `${num(computed.carbG, 1)} g` },
            { label: "Fat", value: `${num(computed.fatG, 1)} g` },
            { label: "Calories", value: `${num(cal.value, 0)} kcal` },
          ],
        };
      }
      case "protein": {
        const wt = parsePositive(w, "Weight (kg)");
        const gPerKg = parsePositive(a, "g per kg");
        if (!wt.ok) return { error: wt.error };
        if (!gPerKg.ok) return { error: gPerKg.error };
        const computed = proteinIntake({ weightKg: wt.value, gPerKg: gPerKg.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.proteinG, 1)} g`,
          primaryLabel: "Daily protein target",
          rows: [
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "g/kg", value: num(gPerKg.value, 2) },
          ],
        };
      }
      case "water": {
        const wt = parsePositive(w, "Weight (kg)");
        const mlPerKg = parsePositive(a, "mL per kg");
        if (!wt.ok) return { error: wt.error };
        if (!mlPerKg.ok) return { error: mlPerKg.error };
        const computed = waterIntake({ weightKg: wt.value, mlPerKg: mlPerKg.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.liters, 2)} L`,
          primaryLabel: "Estimated water",
          rows: [
            { label: "Volume", value: `${num(computed.ml, 0)} mL` },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "mL/kg", value: num(mlPerKg.value, 1) },
          ],
        };
      }
      case "deficit": {
        const tdee = parsePositive(a, "TDEE");
        const intake = parseNonNegative(b, "Intake");
        if (!tdee.ok) return { error: tdee.error };
        if (!intake.ok) return { error: intake.error };
        const computed = calorieDeficitSurplus({ tdee: tdee.value, intake: intake.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.kind} (${num(computed.delta, 0)} kcal)`,
          primaryLabel: "Energy balance",
          rows: [
            { label: "TDEE", value: `${num(tdee.value, 0)} kcal` },
            { label: "Intake", value: `${num(intake.value, 0)} kcal` },
            { label: "Delta", value: `${num(computed.delta, 0)} kcal` },
          ],
        };
      }
      case "tdee": {
        const bmr = parsePositive(a, "BMR");
        const act = parsePositive(b, "Activity factor");
        if (!bmr.ok) return { error: bmr.error };
        if (!act.ok) return { error: act.error };
        const computed = tdeeFromBmr({ bmr: bmr.value, activityFactor: act.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.tdee, 0)} kcal/day`,
          primaryLabel: "Estimated TDEE",
          rows: [
            { label: "BMR", value: `${num(bmr.value, 0)} kcal` },
            { label: "Activity factor", value: num(act.value, 2) },
          ],
        };
      }
      case "meal": {
        const cal = parsePositive(a, "Daily calories");
        const meals = parsePositive(b, "Meals");
        if (!cal.ok) return { error: cal.error };
        if (!meals.ok) return { error: meals.error };
        const computed = mealPlanner({ dailyCalories: cal.value, meals: meals.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.perMeal, 0)} kcal`,
          primaryLabel: "Per meal",
          rows: [
            { label: "Daily calories", value: `${num(cal.value, 0)} kcal` },
            { label: "Meals", value: num(meals.value, 0) },
          ],
        };
      }
      case "gi": {
        const gi = parseNonNegative(a, "GI");
        const carbs = parseNonNegative(b, "Carbs (g)");
        if (!gi.ok) return { error: gi.error };
        if (!carbs.ok) return { error: carbs.error };
        const computed = glycemicIndexLoad({ gi: gi.value, carbsG: carbs.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.load, 1)} (${computed.band})`,
          primaryLabel: "Glycemic load",
          rows: [
            { label: "GI", value: num(gi.value, 1) },
            { label: "Carbs", value: `${num(carbs.value, 1)} g` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, w, p, f]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "macro" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-a">Daily calories</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-p">Protein %</FieldLabel>
                <FieldInput id="bn-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-c">Carb %</FieldLabel>
                <FieldInput id="bn-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-f">Fat %</FieldLabel>
                <FieldInput id="bn-f" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "protein" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-w">Weight (kg)</FieldLabel>
                <FieldInput id="bn-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-a">Protein (g per kg)</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "water" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-w">Weight (kg)</FieldLabel>
                <FieldInput id="bn-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-a">mL per kg</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "deficit" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-a">TDEE (kcal)</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-b">Intake (kcal)</FieldLabel>
                <FieldInput id="bn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "tdee" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-a">BMR (kcal/day)</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-b">Activity factor</FieldLabel>
                <FieldInput id="bn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "meal" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-a">Daily calories</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-b">Number of meals</FieldLabel>
                <FieldInput id="bn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gi" ? (
            <>
              <div>
                <FieldLabel htmlFor="bn-a">Glycemic index (0–100)</FieldLabel>
                <FieldInput id="bn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bn-b">Carbs (g)</FieldLabel>
                <FieldInput id="bn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
