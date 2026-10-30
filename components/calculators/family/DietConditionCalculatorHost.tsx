"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_CONDITION_URL,
  dietBloodPressure,
  dietCholesterol,
  dietDiabetes,
  dietLowSugar,
  dietPcos,
  dietThyroid,
} from "@/lib/calculators/dietCondition";

type ConditionSlug =
  | "diet-diabetes-diet-calculator"
  | "diet-low-sugar-intake-calculator"
  | "diet-cholesterol-diet-calculator"
  | "diet-blood-pressure-diet-calculator"
  | "diet-thyroid-diet-calculator"
  | "diet-pcos-diet-calculator";

type Mode = "diabetes" | "lowSugar" | "cholesterol" | "bp" | "thyroid" | "pcos";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice, disease treatment, meal prescriptions, or a substitute for clinician or dietitian care for any condition.";

const CONFIG: Record<ConditionSlug, Config> = {
  "diet-diabetes-diet-calculator": {
    title: "Diabetes diet macros",
    description: `Teaching macro split with even-carb framing from calories. ${DISCLAIMER}`,
    mode: "diabetes",
    aDefault: "1800",
    bDefault: "",
  },
  "diet-low-sugar-intake-calculator": {
    title: "Low sugar intake",
    description: `Compare daily sugar (g) to a teaching limit (default 25 g). ${DISCLAIMER}`,
    mode: "lowSugar",
    aDefault: "20",
    bDefault: "25",
  },
  "diet-cholesterol-diet-calculator": {
    title: "Cholesterol diet macros",
    description: `Heart-healthy teaching macros with a saturated-fat % awareness cap. ${DISCLAIMER}`,
    mode: "cholesterol",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-blood-pressure-diet-calculator": {
    title: "Blood pressure diet macros",
    description: `DASH-leaning teaching macros plus a lower sodium awareness cap. ${DISCLAIMER}`,
    mode: "bp",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-thyroid-diet-calculator": {
    title: "Thyroid diet macros",
    description: `Balanced teaching macros; micronutrient dosing is clinical — not provided here. ${DISCLAIMER}`,
    mode: "thyroid",
    aDefault: "2000",
    bDefault: "",
  },
  "diet-pcos-diet-calculator": {
    title: "PCOS diet macros",
    description: `Lower-GI carb emphasis teaching split from calories. ${DISCLAIMER}`,
    mode: "pcos",
    aDefault: "1800",
    bDefault: "",
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

export function DietConditionCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ConditionSlug] ?? CONFIG["diet-diabetes-diet-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_CONDITION_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_CONDITION_URL.B, config.bDefault));

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
    put(DIET_CONDITION_URL.A, a);
    if (config.mode === "lowSugar") put(DIET_CONDITION_URL.B, b);
    return out;
  }, [a, b, config.mode]);

  useLoanUrlSync(shareParams, [a, b]);

  const result = useMemo(() => {
    if (config.mode === "lowSugar") {
      const sugarP = parseFiniteNumber(a, "Daily sugar");
      if (!sugarP.ok) return { error: sugarP.error };
      let limitG: number | undefined;
      if (b.trim() !== "") {
        const limP = parsePositive(b, "Limit");
        if (!limP.ok) return { error: limP.error };
        limitG = limP.value;
      }
      const computed = dietLowSugar({ dailySugarG: sugarP.value, limitG });
      if ("error" in computed) return { error: computed.error };
      return {
        primary: computed.withinLimit ? "Within limit" : "Above limit",
        primaryLabel: "Sugar check",
        rows: [
          { label: "Intake (g)", value: num(computed.intakeG) },
          { label: "Limit (g)", value: num(computed.limitG, 0) },
        ],
      };
    }

    const calP = parsePositive(a, "Calories");
    if (!calP.ok) return { error: calP.error };
    const fn =
      config.mode === "diabetes"
        ? dietDiabetes
        : config.mode === "cholesterol"
          ? dietCholesterol
          : config.mode === "bp"
            ? dietBloodPressure
            : config.mode === "thyroid"
              ? dietThyroid
              : dietPcos;
    const computed = fn({ calories: calP.value });
    if ("error" in computed) return { error: computed.error };
    const extra: { label: string; value: string }[] = [];
    if ("carbNote" in computed && computed.carbNote) extra.push({ label: "Note", value: String(computed.carbNote) });
    if ("note" in computed && computed.note) extra.push({ label: "Note", value: String(computed.note) });
    if ("pattern" in computed && computed.pattern) extra.push({ label: "Pattern", value: String(computed.pattern) });
    if ("satFatCapPct" in computed && computed.satFatCapPct != null) {
      extra.push({ label: "Sat fat cap %", value: num(Number(computed.satFatCapPct), 0) });
    }
    if ("sodiumCapMg" in computed && computed.sodiumCapMg != null) {
      extra.push({ label: "Sodium cap (mg)", value: num(Number(computed.sodiumCapMg), 0) });
    }
    return {
      primary: `${num(computed.proteinG)} / ${num(computed.carbG)} / ${num(computed.fatG)} g`,
      primaryLabel: "Protein / carbs / fat",
      rows: [
        { label: "Protein (g)", value: num(computed.proteinG) },
        { label: "Carbs (g)", value: num(computed.carbG) },
        { label: "Fat (g)", value: num(computed.fatG) },
        ...extra,
      ],
    };
  }, [config.mode, a, b]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "lowSugar" ? (
            <>
              <div>
                <FieldLabel htmlFor="dc-sugar">Daily sugar (g)</FieldLabel>
                <FieldInput id="dc-sugar" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dc-limit">Limit (g, optional)</FieldLabel>
                <FieldInput id="dc-limit" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : (
            <div>
              <FieldLabel htmlFor="dc-cal">Daily calories</FieldLabel>
              <FieldInput id="dc-cal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          )}
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
