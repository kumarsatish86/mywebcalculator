"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_NUTRITION_MED_URL,
  medicalCarbIntake,
  medicalDailyCalories,
  medicalFatIntake,
  medicalFiberIntake,
  medicalMacros,
  medicalProteinIntake,
  medicalSodiumIntake,
  medicalTdee,
  medicalWaterIntake,
} from "@/lib/calculators/medicalNutritionMed";

type NutritionSlug =
  | "medical-daily-calorie-needs-calculator"
  | "medical-macronutrient-calculator"
  | "medical-water-intake-calculator"
  | "medical-tdee-calculator"
  | "medical-protein-intake-calculator"
  | "medical-carb-intake-calculator"
  | "medical-fat-intake-calculator"
  | "medical-fiber-intake-calculator"
  | "medical-sodium-intake-calculator";

type Mode =
  | "calories"
  | "macros"
  | "water"
  | "tdee"
  | "protein"
  | "carb"
  | "fat"
  | "fiber"
  | "sodium";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  wDefault: string;
  pDefault: string;
  fDefault: string;
};

const DISCLAIMER =
  "Educational nutrition arithmetic only — not medical advice, diet prescriptions, clinical nutrition therapy, or eating-disorder care. Individual needs vary; consult a clinician or registered dietitian.";

const CONFIG: Record<NutritionSlug, Config> = {
  "medical-daily-calorie-needs-calculator": {
    title: "Daily calorie needs",
    description: `TDEE-style calories = BMR × activity factor (sedentary…very). ${DISCLAIMER}`,
    mode: "calories",
    aDefault: "1600",
    bDefault: "moderate",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "medical-tdee-calculator": {
    title: "TDEE",
    description: `Total daily energy expenditure = BMR × activity factor. ${DISCLAIMER}`,
    mode: "tdee",
    aDefault: "1600",
    bDefault: "moderate",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "medical-macronutrient-calculator": {
    title: "Macronutrient split",
    description: `Split calories into protein/carb/fat grams from percentage mix. ${DISCLAIMER}`,
    mode: "macros",
    aDefault: "2000",
    bDefault: "",
    cDefault: "50",
    rDefault: "",
    tDefault: "",
    wDefault: "",
    pDefault: "25",
    fDefault: "25",
  },
  "medical-water-intake-calculator": {
    title: "Water intake",
    description: `ml/day ≈ weight_kg × ml/kg (default 35). ${DISCLAIMER}`,
    mode: "water",
    aDefault: "35",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "70",
    pDefault: "",
    fDefault: "",
  },
  "medical-protein-intake-calculator": {
    title: "Protein intake",
    description: `Protein grams = weight_kg × g/kg. ${DISCLAIMER}`,
    mode: "protein",
    aDefault: "1.6",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "70",
    pDefault: "",
    fDefault: "",
  },
  "medical-carb-intake-calculator": {
    title: "Carb intake",
    description: `Carb grams from calories and carb %. ${DISCLAIMER}`,
    mode: "carb",
    aDefault: "2000",
    bDefault: "",
    cDefault: "50",
    rDefault: "",
    tDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "medical-fat-intake-calculator": {
    title: "Fat intake",
    description: `Fat grams from calories and fat %. ${DISCLAIMER}`,
    mode: "fat",
    aDefault: "2000",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "30",
  },
  "medical-fiber-intake-calculator": {
    title: "Fiber intake",
    description: `Fiber grams ≈ (calories/1000) × g per 1000 kcal (default 14). ${DISCLAIMER}`,
    mode: "fiber",
    aDefault: "2000",
    bDefault: "14",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
    pDefault: "",
    fDefault: "",
  },
  "medical-sodium-intake-calculator": {
    title: "Sodium intake band",
    description: `Compare daily sodium (mg) to a common ~2300 mg teaching upper limit. ${DISCLAIMER}`,
    mode: "sodium",
    aDefault: "2300",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
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

export function MedicalNutritionMedCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as NutritionSlug] ?? CONFIG["medical-daily-calorie-needs-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.T, config.tDefault));
  const [w, setW] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.W, config.wDefault));
  const [p, setP] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.P, config.pDefault));
  const [f, setF] = useState(useLoanInitialInput(MEDICAL_NUTRITION_MED_URL.F, config.fDefault));

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
      case "calories":
      case "tdee":
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        put(MEDICAL_NUTRITION_MED_URL.B, b);
        break;
      case "macros":
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        put(MEDICAL_NUTRITION_MED_URL.P, p);
        put(MEDICAL_NUTRITION_MED_URL.C, c);
        put(MEDICAL_NUTRITION_MED_URL.F, f);
        break;
      case "water":
        put(MEDICAL_NUTRITION_MED_URL.W, w);
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        break;
      case "protein":
        put(MEDICAL_NUTRITION_MED_URL.W, w);
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        break;
      case "carb":
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        put(MEDICAL_NUTRITION_MED_URL.C, c);
        break;
      case "fat":
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        put(MEDICAL_NUTRITION_MED_URL.F, f);
        break;
      case "fiber":
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        put(MEDICAL_NUTRITION_MED_URL.B, b);
        break;
      case "sodium":
        put(MEDICAL_NUTRITION_MED_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, r, t, w, p, f, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, w, p, f]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "calories": {
        const bmrP = parsePositive(a, "BMR");
        if (!bmrP.ok) return { error: bmrP.error };
        const computed = medicalDailyCalories({ bmr: bmrP.value, activity: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.calories, 0)} kcal`,
          primaryLabel: "Daily calories",
          rows: [{ label: "Activity factor", value: num(computed.factor, 3) }],
        };
      }
      case "tdee": {
        const bmrP = parsePositive(a, "BMR");
        if (!bmrP.ok) return { error: bmrP.error };
        const computed = medicalTdee({ bmr: bmrP.value, activity: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.tdee, 0)} kcal`,
          primaryLabel: "TDEE",
          rows: [{ label: "Activity factor", value: num(computed.factor, 3) }],
        };
      }
      case "macros": {
        const calP = parsePositive(a, "Calories");
        const proP = parsePositive(p, "Protein %");
        const carbP = parsePositive(c, "Carb %");
        const fatP = parsePositive(f, "Fat %");
        if (!calP.ok) return { error: calP.error };
        if (!proP.ok) return { error: proP.error };
        if (!carbP.ok) return { error: carbP.error };
        if (!fatP.ok) return { error: fatP.error };
        const computed = medicalMacros({
          calories: calP.value,
          proteinPct: proP.value,
          carbPct: carbP.value,
          fatPct: fatP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.proteinG, 0)} / ${num(computed.carbG, 0)} / ${num(computed.fatG, 0)} g`,
          primaryLabel: "Protein / carbs / fat",
          rows: [
            { label: "Protein", value: `${num(computed.proteinG, 0)} g` },
            { label: "Carbs", value: `${num(computed.carbG, 0)} g` },
            { label: "Fat", value: `${num(computed.fatG, 0)} g` },
          ],
        };
      }
      case "water": {
        const wtP = parsePositive(w, "Weight (kg)");
        if (!wtP.ok) return { error: wtP.error };
        let mlPerKg: number | undefined;
        if (a.trim() !== "") {
          const mlP = parsePositive(a, "ml/kg");
          if (!mlP.ok) return { error: mlP.error };
          mlPerKg = mlP.value;
        }
        const computed = medicalWaterIntake({ weightKg: wtP.value, mlPerKg });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.mlPerDay, 0)} ml`,
          primaryLabel: "Water per day",
          rows: [{ label: "Liters", value: num(computed.mlPerDay / 1000, 2) }],
        };
      }
      case "protein": {
        const wtP = parsePositive(w, "Weight (kg)");
        const gP = parsePositive(a, "g/kg");
        if (!wtP.ok) return { error: wtP.error };
        if (!gP.ok) return { error: gP.error };
        const computed = medicalProteinIntake({ weightKg: wtP.value, gPerKg: gP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.proteinG, 0)} g`,
          primaryLabel: "Protein per day",
          rows: [{ label: "g/kg", value: num(gP.value, 2) }],
        };
      }
      case "carb": {
        const calP = parsePositive(a, "Calories");
        const pctP = parsePositive(c, "Carb %");
        if (!calP.ok) return { error: calP.error };
        if (!pctP.ok) return { error: pctP.error };
        const computed = medicalCarbIntake({ calories: calP.value, carbPct: pctP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.carbG, 0)} g`,
          primaryLabel: "Carbs per day",
          rows: [{ label: "Carb %", value: num(pctP.value, 0) }],
        };
      }
      case "fat": {
        const calP = parsePositive(a, "Calories");
        const pctP = parsePositive(f, "Fat %");
        if (!calP.ok) return { error: calP.error };
        if (!pctP.ok) return { error: pctP.error };
        const computed = medicalFatIntake({ calories: calP.value, fatPct: pctP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.fatG, 0)} g`,
          primaryLabel: "Fat per day",
          rows: [{ label: "Fat %", value: num(pctP.value, 0) }],
        };
      }
      case "fiber": {
        const calP = parsePositive(a, "Calories");
        if (!calP.ok) return { error: calP.error };
        let gPer1000kcal: number | undefined;
        if (b.trim() !== "") {
          const gP = parsePositive(b, "g per 1000 kcal");
          if (!gP.ok) return { error: gP.error };
          gPer1000kcal = gP.value;
        }
        const computed = medicalFiberIntake({ calories: calP.value, gPer1000kcal });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.fiberG, 0)} g`,
          primaryLabel: "Fiber per day",
          rows: [{ label: "Rule", value: "g per 1000 kcal" }],
        };
      }
      case "sodium": {
        const mgP = parseNonNegative(a, "Sodium (mg)");
        if (!mgP.ok) return { error: mgP.error };
        const computed = medicalSodiumIntake({ dailyMg: mgP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.dailyMg, 0)} mg`,
          primaryLabel: "Daily sodium",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, w, p, f]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "calories" || config.mode === "tdee" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-bmr">BMR (kcal/day)</FieldLabel>
                <FieldInput id="mn-bmr" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-act">Activity (sedentary, light, moderate, active, very)</FieldLabel>
                <FieldInput id="mn-act" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "macros" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-cal">Calories</FieldLabel>
                <FieldInput id="mn-cal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-pro">Protein %</FieldLabel>
                <FieldInput id="mn-pro" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-carb">Carb %</FieldLabel>
                <FieldInput id="mn-carb" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-fat">Fat %</FieldLabel>
                <FieldInput id="mn-fat" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "water" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-wt">Weight (kg)</FieldLabel>
                <FieldInput id="mn-wt" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-mlkg">ml per kg (optional, default 35)</FieldLabel>
                <FieldInput id="mn-mlkg" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "protein" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-pwt">Weight (kg)</FieldLabel>
                <FieldInput id="mn-pwt" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-gpg">Protein g/kg</FieldLabel>
                <FieldInput id="mn-gpg" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "carb" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-ccal">Calories</FieldLabel>
                <FieldInput id="mn-ccal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-cpct">Carb %</FieldLabel>
                <FieldInput id="mn-cpct" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fat" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-fcal">Calories</FieldLabel>
                <FieldInput id="mn-fcal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-fpct">Fat %</FieldLabel>
                <FieldInput id="mn-fpct" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fiber" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-fibcal">Calories</FieldLabel>
                <FieldInput id="mn-fibcal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-fibg">g per 1000 kcal (optional, default 14)</FieldLabel>
                <FieldInput id="mn-fibg" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "sodium" ? (
            <div>
              <FieldLabel htmlFor="mn-na">Daily sodium (mg)</FieldLabel>
              <FieldInput id="mn-na" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
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
