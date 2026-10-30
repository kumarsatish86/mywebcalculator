"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_FITNESS_URL,
  dietBulkingCalories,
  dietCuttingCalories,
  dietFatLoss,
  dietMuscleGain,
  dietPostWorkout,
  dietPreWorkout,
} from "@/lib/calculators/dietFitness";

type FitnessSlug =
  | "diet-pre-workout-nutrition-calculator"
  | "diet-post-workout-nutrition-calculator"
  | "diet-muscle-gain-diet-calculator"
  | "diet-fat-loss-diet-calculator"
  | "diet-bulking-calories-calculator"
  | "diet-cutting-calories-calculator";

type Mode = "pre" | "post" | "muscle" | "fatLoss" | "bulk" | "cut";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  wDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice, sports nutrition prescriptions, or coaching. Fueling needs vary; seek a qualified professional for personal plans.";

const CONFIG: Record<FitnessSlug, Config> = {
  "diet-pre-workout-nutrition-calculator": {
    title: "Pre-workout nutrition",
    description: `Suggests carbs ≈ 15% of session burn (teaching). ${DISCLAIMER}`,
    mode: "pre",
    aDefault: "400",
    bDefault: "",
    wDefault: "",
  },
  "diet-post-workout-nutrition-calculator": {
    title: "Post-workout nutrition",
    description: `0.3 g/kg protein + 0.5 g/kg carbs teaching targets. ${DISCLAIMER}`,
    mode: "post",
    aDefault: "",
    bDefault: "",
    wDefault: "70",
  },
  "diet-muscle-gain-diet-calculator": {
    title: "Muscle gain diet",
    description: `TDEE + ~300 kcal with a muscle-gain teaching macro split. ${DISCLAIMER}`,
    mode: "muscle",
    aDefault: "2500",
    bDefault: "",
    wDefault: "",
  },
  "diet-fat-loss-diet-calculator": {
    title: "Fat loss diet",
    description: `TDEE − ~500 kcal (floor 1200) with higher-protein teaching macros. ${DISCLAIMER}`,
    mode: "fatLoss",
    aDefault: "2500",
    bDefault: "",
    wDefault: "",
  },
  "diet-bulking-calories-calculator": {
    title: "Bulking calories",
    description: `TDEE + surplus (default 400 kcal). ${DISCLAIMER}`,
    mode: "bulk",
    aDefault: "2500",
    bDefault: "400",
    wDefault: "",
  },
  "diet-cutting-calories-calculator": {
    title: "Cutting calories",
    description: `TDEE − deficit (default 500; floor 1200). ${DISCLAIMER}`,
    mode: "cut",
    aDefault: "2500",
    bDefault: "500",
    wDefault: "",
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

export function DietFitnessCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as FitnessSlug] ?? CONFIG["diet-pre-workout-nutrition-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_FITNESS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_FITNESS_URL.B, config.bDefault));
  const [w, setW] = useState(useLoanInitialInput(DIET_FITNESS_URL.W, config.wDefault));

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
      case "pre":
        put(DIET_FITNESS_URL.A, a);
        break;
      case "post":
        put(DIET_FITNESS_URL.W, w);
        break;
      case "muscle":
      case "fatLoss":
        put(DIET_FITNESS_URL.A, a);
        break;
      case "bulk":
      case "cut":
        put(DIET_FITNESS_URL.A, a);
        put(DIET_FITNESS_URL.B, b);
        break;
    }
    return out;
  }, [a, b, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "pre": {
        const kcalP = parseFiniteNumber(a, "Workout kcal");
        if (!kcalP.ok) return { error: kcalP.error };
        const computed = dietPreWorkout({ workoutKcal: kcalP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.suggestedCarbsG)} g`,
          primaryLabel: "Suggested carbs",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "post": {
        const wtP = parsePositive(w, "Weight");
        if (!wtP.ok) return { error: wtP.error };
        const computed = dietPostWorkout({ weightKg: wtP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.proteinG)} g protein`,
          primaryLabel: "Post-workout protein",
          rows: [
            { label: "Carbs (g)", value: num(computed.carbsG) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "muscle":
      case "fatLoss": {
        const tdeeP = parsePositive(a, "TDEE");
        if (!tdeeP.ok) return { error: tdeeP.error };
        const computed = config.mode === "muscle" ? dietMuscleGain({ tdee: tdeeP.value }) : dietFatLoss({ tdee: tdeeP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories, 0)} kcal`,
          primaryLabel: "Target calories",
          rows: [
            { label: "Protein (g)", value: num(computed.proteinG) },
            { label: "Carbs (g)", value: num(computed.carbG) },
            { label: "Fat (g)", value: num(computed.fatG) },
          ],
        };
      }
      case "bulk": {
        const tdeeP = parsePositive(a, "TDEE");
        if (!tdeeP.ok) return { error: tdeeP.error };
        let surplus: number | undefined;
        if (b.trim() !== "") {
          const surP = parseFiniteNumber(b, "Surplus");
          if (!surP.ok) return { error: surP.error };
          surplus = surP.value;
        }
        const computed = dietBulkingCalories({ tdee: tdeeP.value, surplus });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories, 0)} kcal`,
          primaryLabel: "Bulking calories",
          rows: [{ label: "Surplus", value: num(computed.surplus, 0) }],
        };
      }
      case "cut": {
        const tdeeP = parsePositive(a, "TDEE");
        if (!tdeeP.ok) return { error: tdeeP.error };
        let deficit: number | undefined;
        if (b.trim() !== "") {
          const defP = parseFiniteNumber(b, "Deficit");
          if (!defP.ok) return { error: defP.error };
          deficit = defP.value;
        }
        const computed = dietCuttingCalories({ tdee: tdeeP.value, deficit });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories, 0)} kcal`,
          primaryLabel: "Cutting calories",
          rows: [{ label: "Deficit", value: num(computed.deficit, 0) }],
        };
      }
    }
  }, [config.mode, a, b, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "pre" ? (
            <div>
              <FieldLabel htmlFor="df-wk">Workout burn (kcal)</FieldLabel>
              <FieldInput id="df-wk" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "post" ? (
            <div>
              <FieldLabel htmlFor="df-wt">Body weight (kg)</FieldLabel>
              <FieldInput id="df-wt" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "muscle" || config.mode === "fatLoss" ? (
            <div>
              <FieldLabel htmlFor="df-tdee">TDEE (kcal)</FieldLabel>
              <FieldInput id="df-tdee" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "bulk" ? (
            <>
              <div>
                <FieldLabel htmlFor="df-bulk-tdee">TDEE (kcal)</FieldLabel>
                <FieldInput id="df-bulk-tdee" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="df-surplus">Surplus (kcal, optional)</FieldLabel>
                <FieldInput id="df-surplus" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cut" ? (
            <>
              <div>
                <FieldLabel htmlFor="df-cut-tdee">TDEE (kcal)</FieldLabel>
                <FieldInput id="df-cut-tdee" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="df-deficit">Deficit (kcal, optional)</FieldLabel>
                <FieldInput id="df-deficit" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
