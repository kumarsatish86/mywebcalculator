"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_AGE_URL,
  dietAdultNutrition,
  dietBreastfeedingNutrition,
  dietChildNutrition,
  dietPregnancyNutrition,
  dietSeniorNutrition,
  dietTeenNutrition,
} from "@/lib/calculators/dietAgeGender";

type AgeSlug =
  | "diet-child-nutrition-calculator"
  | "diet-teen-nutrition-calculator"
  | "diet-adult-nutrition-calculator"
  | "diet-senior-citizen-diet-calculator"
  | "diet-pregnancy-nutrition-calculator"
  | "diet-breastfeeding-nutrition-calculator";

type Mode = "child" | "teen" | "adult" | "senior" | "pregnancy" | "breastfeeding";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  wDefault: string;
  hDefault: string;
  sDefault: string;
  tDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice, pediatric/obstetric care, or a personalized meal prescription. Life-stage needs require clinician or dietitian guidance.";

const CONFIG: Record<AgeSlug, Config> = {
  "diet-child-nutrition-calculator": {
    title: "Child nutrition",
    description: `Rough pediatric energy teaching estimate from age and weight. ${DISCLAIMER}`,
    mode: "child",
    aDefault: "8",
    bDefault: "",
    wDefault: "25",
    hDefault: "",
    sDefault: "",
    tDefault: "",
  },
  "diet-teen-nutrition-calculator": {
    title: "Teen nutrition",
    description: `Mifflin-style TDEE teaching estimate for ages 13–19. ${DISCLAIMER}`,
    mode: "teen",
    aDefault: "16",
    bDefault: "moderate",
    wDefault: "60",
    hDefault: "170",
    sDefault: "female",
    tDefault: "",
  },
  "diet-adult-nutrition-calculator": {
    title: "Adult nutrition",
    description: `Mifflin-style TDEE teaching estimate for adults. ${DISCLAIMER}`,
    mode: "adult",
    aDefault: "35",
    bDefault: "moderate",
    wDefault: "70",
    hDefault: "170",
    sDefault: "male",
    tDefault: "",
  },
  "diet-senior-citizen-diet-calculator": {
    title: "Senior nutrition",
    description: `TDEE teaching estimate (age ≥60) with slightly higher protein %. ${DISCLAIMER}`,
    mode: "senior",
    aDefault: "68",
    bDefault: "light",
    wDefault: "70",
    hDefault: "165",
    sDefault: "female",
    tDefault: "",
  },
  "diet-pregnancy-nutrition-calculator": {
    title: "Pregnancy nutrition",
    description: `TDEE + trimester teaching bonus (2nd ≈340, 3rd ≈450 kcal). ${DISCLAIMER}`,
    mode: "pregnancy",
    aDefault: "30",
    bDefault: "moderate",
    wDefault: "65",
    hDefault: "165",
    sDefault: "",
    tDefault: "2",
  },
  "diet-breastfeeding-nutrition-calculator": {
    title: "Breastfeeding nutrition",
    description: `TDEE + ~450 kcal lactation teaching bonus. ${DISCLAIMER}`,
    mode: "breastfeeding",
    aDefault: "30",
    bDefault: "moderate",
    wDefault: "65",
    hDefault: "165",
    sDefault: "",
    tDefault: "",
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

export function DietAgeGenderCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AgeSlug] ?? CONFIG["diet-child-nutrition-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_AGE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_AGE_URL.B, config.bDefault));
  const [w, setW] = useState(useLoanInitialInput(DIET_AGE_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(DIET_AGE_URL.H, config.hDefault));
  const [s, setS] = useState(useLoanInitialInput(DIET_AGE_URL.S, config.sDefault));
  const [t, setT] = useState(useLoanInitialInput(DIET_AGE_URL.T, config.tDefault));

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
    switch (config.mode) {
      case "child":
        put(DIET_AGE_URL.W, w);
        put(DIET_AGE_URL.A, a);
        break;
      case "teen":
      case "adult":
      case "senior":
        put(DIET_AGE_URL.W, w);
        put(DIET_AGE_URL.H, h);
        put(DIET_AGE_URL.A, a);
        put(DIET_AGE_URL.S, s);
        put(DIET_AGE_URL.B, b);
        break;
      case "pregnancy":
        put(DIET_AGE_URL.W, w);
        put(DIET_AGE_URL.H, h);
        put(DIET_AGE_URL.A, a);
        put(DIET_AGE_URL.B, b);
        put(DIET_AGE_URL.T, t);
        break;
      case "breastfeeding":
        put(DIET_AGE_URL.W, w);
        put(DIET_AGE_URL.H, h);
        put(DIET_AGE_URL.A, a);
        put(DIET_AGE_URL.B, b);
        break;
    }
    return out;
  }, [a, b, w, h, s, t, config.mode]);

  useLoanUrlSync(shareParams, [a, b, w, h, s, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "child": {
        const wtP = parsePositive(w, "Weight");
        const ageP = parsePositive(a, "Age");
        if (!wtP.ok) return { error: wtP.error };
        if (!ageP.ok) return { error: ageP.error };
        const computed = dietChildNutrition({ weightKg: wtP.value, ageYears: ageP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories)} kcal`,
          primaryLabel: "Teaching calorie estimate",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "teen":
      case "adult": {
        const wtP = parsePositive(w, "Weight");
        const htP = parsePositive(h, "Height");
        const ageP = parsePositive(a, "Age");
        if (!wtP.ok) return { error: wtP.error };
        if (!htP.ok) return { error: htP.error };
        if (!ageP.ok) return { error: ageP.error };
        const args = {
          weightKg: wtP.value,
          heightCm: htP.value,
          age: ageP.value,
          sex: s,
          activity: b,
        };
        const computed = config.mode === "teen" ? dietTeenNutrition(args) : dietAdultNutrition(args);
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories)} kcal`,
          primaryLabel: "Target calories",
          rows: [{ label: "TDEE", value: num(computed.tdee) }],
        };
      }
      case "senior": {
        const wtP = parsePositive(w, "Weight");
        const htP = parsePositive(h, "Height");
        const ageP = parsePositive(a, "Age");
        if (!wtP.ok) return { error: wtP.error };
        if (!htP.ok) return { error: htP.error };
        if (!ageP.ok) return { error: ageP.error };
        const computed = dietSeniorNutrition({
          weightKg: wtP.value,
          heightCm: htP.value,
          age: ageP.value,
          sex: s,
          activity: b,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories)} kcal`,
          primaryLabel: "Target calories",
          rows: [
            { label: "TDEE", value: num(computed.tdee) },
            { label: "Protein (g)", value: num(computed.proteinG, 1) },
            { label: "Carbs (g)", value: num(computed.carbG, 1) },
            { label: "Fat (g)", value: num(computed.fatG, 1) },
            { label: "Note", value: computed.proteinNote },
          ],
        };
      }
      case "pregnancy": {
        const wtP = parsePositive(w, "Weight");
        const htP = parsePositive(h, "Height");
        const ageP = parsePositive(a, "Age");
        const triP = parsePositive(t, "Trimester");
        if (!wtP.ok) return { error: wtP.error };
        if (!htP.ok) return { error: htP.error };
        if (!ageP.ok) return { error: ageP.error };
        if (!triP.ok) return { error: triP.error };
        const computed = dietPregnancyNutrition({
          weightKg: wtP.value,
          heightCm: htP.value,
          age: ageP.value,
          activity: b,
          trimester: triP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories)} kcal`,
          primaryLabel: "Pregnancy calorie estimate",
          rows: [{ label: "Base TDEE", value: num(computed.tdee) }],
        };
      }
      case "breastfeeding": {
        const wtP = parsePositive(w, "Weight");
        const htP = parsePositive(h, "Height");
        const ageP = parsePositive(a, "Age");
        if (!wtP.ok) return { error: wtP.error };
        if (!htP.ok) return { error: htP.error };
        if (!ageP.ok) return { error: ageP.error };
        const computed = dietBreastfeedingNutrition({
          weightKg: wtP.value,
          heightCm: htP.value,
          age: ageP.value,
          activity: b,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories)} kcal`,
          primaryLabel: "Lactation calorie estimate",
          rows: [{ label: "Base TDEE", value: num(computed.tdee) }],
        };
      }
    }
  }, [config.mode, a, b, w, h, s, t]);

  const showAnthropometry =
    config.mode === "teen" ||
    config.mode === "adult" ||
    config.mode === "senior" ||
    config.mode === "pregnancy" ||
    config.mode === "breastfeeding";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "child" ? (
            <>
              <div>
                <FieldLabel htmlFor="da-child-wt">Weight (kg)</FieldLabel>
                <FieldInput id="da-child-wt" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="da-child-age">Age (years, 1–12)</FieldLabel>
                <FieldInput id="da-child-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {showAnthropometry ? (
            <>
              <div>
                <FieldLabel htmlFor="da-wt">Weight (kg)</FieldLabel>
                <FieldInput id="da-wt" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="da-ht">Height (cm)</FieldLabel>
                <FieldInput id="da-ht" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="da-age">Age (years)</FieldLabel>
                <FieldInput id="da-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              {(config.mode === "teen" || config.mode === "adult" || config.mode === "senior") && (
                <div>
                  <FieldLabel htmlFor="da-sex">Sex (male or female)</FieldLabel>
                  <FieldInput id="da-sex" value={s} onChange={(ev) => setS(ev.target.value)} />
                </div>
              )}
              <div>
                <FieldLabel htmlFor="da-act">Activity (sedentary, light, moderate, active, very)</FieldLabel>
                <FieldInput id="da-act" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
              {config.mode === "pregnancy" ? (
                <div>
                  <FieldLabel htmlFor="da-tri">Trimester (1–3)</FieldLabel>
                  <FieldInput id="da-tri" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
                </div>
              ) : null}
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
