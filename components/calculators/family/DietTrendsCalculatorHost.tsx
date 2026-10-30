"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_TRENDS_URL,
  dietDash,
  dietIf168,
  dietKetoDiet,
  dietLowFat,
  dietMediterranean,
  dietOmad,
  dietPaleoDiet,
  dietVeganPlanner,
} from "@/lib/calculators/dietTrends";

type TrendsSlug =
  | "diet-keto-diet-calculator"
  | "diet-paleo-diet-calculator"
  | "diet-vegan-diet-planner-calculator"
  | "diet-mediterranean-diet-calculator"
  | "diet-low-fat-diet-calculator"
  | "diet-dash-diet-calculator"
  | "diet-intermittent-fasting-16-8-calculator"
  | "diet-omad-calculator";

type Mode = "keto" | "paleo" | "vegan" | "mediterranean" | "lowFat" | "dash" | "if168" | "omad";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice, a therapeutic diet, or treatment for any condition. Individual needs vary; consult a clinician or registered dietitian.";

const CONFIG: Record<TrendsSlug, Config> = {
  "diet-keto-diet-calculator": {
    title: "Keto diet macros",
    description: `Teaching macro split (~75% fat) from daily calories. ${DISCLAIMER}`,
    mode: "keto",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-paleo-diet-calculator": {
    title: "Paleo diet macros",
    description: `Paleo-style teaching protein/carb/fat split from calories. ${DISCLAIMER}`,
    mode: "paleo",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-vegan-diet-planner-calculator": {
    title: "Vegan diet planner",
    description: `Plant-forward teaching macros with a protein-foods note. ${DISCLAIMER}`,
    mode: "vegan",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-mediterranean-diet-calculator": {
    title: "Mediterranean diet macros",
    description: `Mediterranean-style teaching macro split from calories. ${DISCLAIMER}`,
    mode: "mediterranean",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-low-fat-diet-calculator": {
    title: "Low-fat diet macros",
    description: `Lower-fat teaching split (~15% fat) from calories. ${DISCLAIMER}`,
    mode: "lowFat",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-dash-diet-calculator": {
    title: "DASH diet macros",
    description: `DASH-style teaching macros plus a sodium-awareness cap. ${DISCLAIMER}`,
    mode: "dash",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-intermittent-fasting-16-8-calculator": {
    title: "Intermittent fasting 16:8",
    description: `Suggests an 8-hour eating window from wake hour (0–23). ${DISCLAIMER}`,
    mode: "if168",
    aDefault: "8",
    bDefault: "",
  },
  "diet-omad-calculator": {
    title: "OMAD (one meal a day)",
    description: `Places daily calories in one meal hour with ~23 h fasting. ${DISCLAIMER}`,
    mode: "omad",
    aDefault: "18",
    bDefault: "2000",
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

export function DietTrendsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as TrendsSlug] ?? CONFIG["diet-keto-diet-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_TRENDS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_TRENDS_URL.B, config.bDefault));

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
    put(DIET_TRENDS_URL.A, a);
    if (config.mode === "omad") put(DIET_TRENDS_URL.B, b);
    return out;
  }, [a, b, config.mode]);

  useLoanUrlSync(shareParams, [a, b]);

  const result = useMemo(() => {
    const macroRows = (m: { proteinG: number; carbG: number; fatG: number }, extra: { label: string; value: string }[] = []) => ({
      primary: `${num(m.proteinG)} / ${num(m.carbG)} / ${num(m.fatG)} g`,
      primaryLabel: "Protein / carbs / fat",
      rows: [
        { label: "Protein (g)", value: num(m.proteinG) },
        { label: "Carbs (g)", value: num(m.carbG) },
        { label: "Fat (g)", value: num(m.fatG) },
        ...extra,
      ],
    });

    switch (config.mode) {
      case "keto":
      case "paleo":
      case "vegan":
      case "mediterranean":
      case "lowFat":
      case "dash": {
        const calP = parsePositive(a, "Calories");
        if (!calP.ok) return { error: calP.error };
        const fn =
          config.mode === "keto"
            ? dietKetoDiet
            : config.mode === "paleo"
              ? dietPaleoDiet
              : config.mode === "vegan"
                ? dietVeganPlanner
                : config.mode === "mediterranean"
                  ? dietMediterranean
                  : config.mode === "lowFat"
                    ? dietLowFat
                    : dietDash;
        const computed = fn({ calories: calP.value });
        if ("error" in computed) return { error: computed.error };
        const extra: { label: string; value: string }[] = [];
        if ("pattern" in computed && computed.pattern) extra.push({ label: "Pattern", value: String(computed.pattern) });
        if ("proteinNote" in computed && computed.proteinNote) {
          extra.push({ label: "Note", value: String(computed.proteinNote) });
        }
        if ("sodiumCapMg" in computed && computed.sodiumCapMg != null) {
          extra.push({ label: "Sodium cap (mg)", value: num(Number(computed.sodiumCapMg), 0) });
        }
        return macroRows(computed, extra);
      }
      case "if168": {
        let wakeHour: number | undefined;
        if (a.trim() !== "") {
          const wakeP = parseFiniteNumber(a, "Wake hour");
          if (!wakeP.ok) return { error: wakeP.error };
          wakeHour = wakeP.value;
        }
        const computed = dietIf168({ wakeHour });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.suggestedEatStart}:00–${computed.suggestedEatEnd}:00`,
          primaryLabel: "Suggested eating window",
          rows: [
            { label: "Fasting hours", value: String(computed.fastingHours) },
            { label: "Eating hours", value: String(computed.eatingHours) },
          ],
        };
      }
      case "omad": {
        const calP = parsePositive(b, "Calories");
        if (!calP.ok) return { error: calP.error };
        let mealHour: number | undefined;
        if (a.trim() !== "") {
          const hourP = parseFiniteNumber(a, "Meal hour");
          if (!hourP.ok) return { error: hourP.error };
          mealHour = hourP.value;
        }
        const computed = dietOmad({ mealHour, calories: calP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.caloriesInOneMeal, 0)} kcal`,
          primaryLabel: "Calories in one meal",
          rows: [
            { label: "Meal hour", value: String(computed.mealHour) },
            { label: "Fasting hours", value: String(computed.fastingHours) },
          ],
        };
      }
    }
  }, [config.mode, a, b]);

  const calorieModes: Mode[] = ["keto", "paleo", "vegan", "mediterranean", "lowFat", "dash"];

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {calorieModes.includes(config.mode) ? (
            <div>
              <FieldLabel htmlFor="dt-cal">Daily calories</FieldLabel>
              <FieldInput id="dt-cal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "if168" ? (
            <div>
              <FieldLabel htmlFor="dt-wake">Wake hour (0–23, optional)</FieldLabel>
              <FieldInput id="dt-wake" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
            </div>
          ) : null}

          {config.mode === "omad" ? (
            <>
              <div>
                <FieldLabel htmlFor="dt-meal">Meal hour (0–23, optional)</FieldLabel>
                <FieldInput id="dt-meal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="dt-omad-cal">Daily calories</FieldLabel>
                <FieldInput id="dt-omad-cal" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
