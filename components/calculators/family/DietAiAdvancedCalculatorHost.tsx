"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_AI_URL,
  dietAiDietPlan,
  dietAiMacroAdjuster,
  dietGoalBasedNutrition,
  dietPersonalizedMealPlan,
  dietSmartCalorieTracker,
} from "@/lib/calculators/dietAiAdvanced";

type AiSlug =
  | "diet-ai-diet-plan-generator"
  | "diet-smart-calorie-tracker"
  | "diet-personalized-meal-plan-generator"
  | "diet-goal-based-nutrition-calculator"
  | "diet-ai-macro-adjuster";

type Mode = "plan" | "tracker" | "meals" | "goal" | "adjuster";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  nDefault: string;
  pDefault: string;
  cDefault: string;
  fDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — rule-based helpers, not a live AI model. Not medical advice or a personalized clinical diet.";

const CONFIG: Record<AiSlug, Config> = {
  "diet-ai-diet-plan-generator": {
    title: "AI diet plan generator",
    description: `Rule-based daily meal template from calories and style — not a live AI model. ${DISCLAIMER}`,
    mode: "plan",
    aDefault: "2000",
    bDefault: "veg",
    nDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-smart-calorie-tracker": {
    title: "Smart calorie tracker",
    description: `Sum logged meal kcal vs a daily target — not a live AI model. ${DISCLAIMER}`,
    mode: "tracker",
    aDefault: "2000",
    bDefault: "450,600,700",
    nDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-personalized-meal-plan-generator": {
    title: "Personalized meal plan",
    description: `Split daily calories across meals with a style label — not a live AI model. ${DISCLAIMER}`,
    mode: "meals",
    aDefault: "2100",
    bDefault: "balanced",
    nDefault: "3",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-goal-based-nutrition-calculator": {
    title: "Goal-based nutrition",
    description: `Adjust TDEE for loss/gain/maintain keywords — not a live AI model. ${DISCLAIMER}`,
    mode: "goal",
    aDefault: "2400",
    bDefault: "loss",
    nDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-ai-macro-adjuster": {
    title: "AI macro adjuster",
    description: `Nudge macro % by protein/carb/fat bias — not a live AI model. ${DISCLAIMER}`,
    mode: "adjuster",
    aDefault: "2000",
    bDefault: "protein",
    nDefault: "",
    pDefault: "30",
    cDefault: "40",
    fDefault: "30",
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

export function DietAiAdvancedCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiSlug] ?? CONFIG["diet-ai-diet-plan-generator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_AI_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_AI_URL.B, config.bDefault));
  const [n, setN] = useState(useLoanInitialInput(DIET_AI_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(DIET_AI_URL.P, config.pDefault));
  const [c, setC] = useState(useLoanInitialInput(DIET_AI_URL.C, config.cDefault));
  const [f, setF] = useState(useLoanInitialInput(DIET_AI_URL.F, config.fDefault));

  const num = (nVal: number, d = 1) => {
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
    switch (config.mode) {
      case "plan":
      case "tracker":
      case "goal":
        put(DIET_AI_URL.A, a);
        put(DIET_AI_URL.B, b);
        break;
      case "meals":
        put(DIET_AI_URL.A, a);
        put(DIET_AI_URL.N, n);
        put(DIET_AI_URL.B, b);
        break;
      case "adjuster":
        put(DIET_AI_URL.A, a);
        put(DIET_AI_URL.P, p);
        put(DIET_AI_URL.C, c);
        put(DIET_AI_URL.F, f);
        put(DIET_AI_URL.B, b);
        break;
    }
    return out;
  }, [a, b, n, p, c, f, config.mode]);

  useLoanUrlSync(shareParams, [a, b, n, p, c, f]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "plan": {
        const calP = parsePositive(a, "Calories");
        if (!calP.ok) return { error: calP.error };
        const computed = dietAiDietPlan({ calories: calP.value, style: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.plan,
          primaryLabel: "Day template",
          rows: [
            { label: "Protein (g)", value: num(computed.proteinG) },
            { label: "Carbs (g)", value: num(computed.carbG) },
            { label: "Fat (g)", value: num(computed.fatG) },
          ],
        };
      }
      case "tracker": {
        const tgtP = parsePositive(a, "Target");
        if (!tgtP.ok) return { error: tgtP.error };
        const computed = dietSmartCalorieTracker({ target: tgtP.value, loggedCsv: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.remaining, 0)} kcal`,
          primaryLabel: "Remaining",
          rows: [
            { label: "Logged", value: num(computed.logged, 0) },
            { label: "Meals logged", value: String(computed.mealsLogged) },
          ],
        };
      }
      case "meals": {
        const calP = parsePositive(a, "Calories");
        const mealsP = parsePositive(n, "Meals");
        if (!calP.ok) return { error: calP.error };
        if (!mealsP.ok) return { error: mealsP.error };
        const computed = dietPersonalizedMealPlan({
          calories: calP.value,
          meals: mealsP.value,
          style: b,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.perMealKcal, 0)} kcal`,
          primaryLabel: "Per meal",
          rows: [{ label: "Outline", value: computed.outline }],
        };
      }
      case "goal": {
        const tdeeP = parsePositive(a, "TDEE");
        if (!tdeeP.ok) return { error: tdeeP.error };
        const computed = dietGoalBasedNutrition({ tdee: tdeeP.value, goal: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories, 0)} kcal`,
          primaryLabel: "Goal calories",
          rows: [
            { label: "Goal", value: computed.goal },
            { label: "Protein (g)", value: num(computed.proteinG) },
            { label: "Carbs (g)", value: num(computed.carbG) },
            { label: "Fat (g)", value: num(computed.fatG) },
          ],
        };
      }
      case "adjuster": {
        const calP = parsePositive(a, "Calories");
        const pP = parseFiniteNumber(p, "Protein %");
        const cP = parseFiniteNumber(c, "Carb %");
        const fP = parseFiniteNumber(f, "Fat %");
        if (!calP.ok) return { error: calP.error };
        if (!pP.ok) return { error: pP.error };
        if (!cP.ok) return { error: cP.error };
        if (!fP.ok) return { error: fP.error };
        const computed = dietAiMacroAdjuster({
          calories: calP.value,
          proteinPct: pP.value,
          carbPct: cP.value,
          fatPct: fP.value,
          bias: b,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.proteinG)} / ${num(computed.carbG)} / ${num(computed.fatG)} g`,
          primaryLabel: "Adjusted macros",
          rows: [
            { label: "Protein %", value: num(computed.proteinPct, 0) },
            { label: "Carb %", value: num(computed.carbPct, 0) },
            { label: "Fat %", value: num(computed.fatPct, 0) },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, n, p, c, f]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "plan" ? (
            <>
              <div>
                <FieldLabel htmlFor="dai-cal">Daily calories</FieldLabel>
                <FieldInput id="dai-cal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-style">Style (e.g. veg, mixed)</FieldLabel>
                <FieldInput id="dai-style" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "tracker" ? (
            <>
              <div>
                <FieldLabel htmlFor="dai-tgt">Daily target (kcal)</FieldLabel>
                <FieldInput id="dai-tgt" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-log">Logged meal kcal (CSV)</FieldLabel>
                <FieldInput id="dai-log" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "meals" ? (
            <>
              <div>
                <FieldLabel htmlFor="dai-mcal">Daily calories</FieldLabel>
                <FieldInput id="dai-mcal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-meals">Meals per day</FieldLabel>
                <FieldInput id="dai-meals" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-mstyle">Style label</FieldLabel>
                <FieldInput id="dai-mstyle" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "goal" ? (
            <>
              <div>
                <FieldLabel htmlFor="dai-tdee">TDEE (kcal)</FieldLabel>
                <FieldInput id="dai-tdee" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-goal">Goal (loss, gain, maintain…)</FieldLabel>
                <FieldInput id="dai-goal" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "adjuster" ? (
            <>
              <div>
                <FieldLabel htmlFor="dai-acal">Calories</FieldLabel>
                <FieldInput id="dai-acal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-ap">Protein %</FieldLabel>
                <FieldInput id="dai-ap" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-ac">Carb %</FieldLabel>
                <FieldInput id="dai-ac" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-af">Fat %</FieldLabel>
                <FieldInput id="dai-af" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dai-bias">Bias (protein, carb, or fat)</FieldLabel>
                <FieldInput id="dai-bias" value={b} onChange={(ev) => setB(ev.target.value)} />
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
