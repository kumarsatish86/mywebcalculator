"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import { parseSex } from "@/lib/calculators/dietHelpers";
import {
  DIET_CALORIE_URL,
  dietActivityBurn,
  dietCalorieDeficit,
  dietCalorieSurplus,
  dietDailyCalorieNeeds,
  dietExerciseCalories,
  dietMaintenanceCalories,
  dietStepsToCalories,
  dietTdee,
  dietWeightGainCalories,
  dietWeightLossCalories,
} from "@/lib/calculators/dietCalorieEnergy";

type CalorieSlug =
  | "diet-daily-calorie-needs-calculator"
  | "diet-maintenance-calories-calculator"
  | "diet-weight-loss-calorie-calculator"
  | "diet-weight-gain-calorie-calculator"
  | "diet-tdee-calculator"
  | "diet-activity-calorie-burn-calculator"
  | "diet-steps-to-calories-calculator"
  | "diet-exercise-calorie-calculator"
  | "diet-calorie-deficit-calculator"
  | "diet-calorie-surplus-calculator";

type Mode =
  | "daily"
  | "maintenance"
  | "loss"
  | "gain"
  | "tdee"
  | "activityBurn"
  | "steps"
  | "exercise"
  | "deficit"
  | "surplus";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  wDefault: string;
  hDefault: string;
  tDefault: string;
  sDefault: string;
  aDefault: string;
  bDefault: string;
  rDefault: string;
};

const DISCLAIMER =
  "Wellness education only — not a medical device, nutrition prescription, or clinical advice. Individual needs vary; consult a qualified professional before changing diet or exercise.";

const CONFIG: Record<CalorieSlug, Config> = {
  "diet-daily-calorie-needs-calculator": {
    title: "Daily calorie needs",
    description: `Mifflin–St Jeor TDEE from weight, height, age, sex, and activity. ${DISCLAIMER}`,
    mode: "daily",
    wDefault: "70",
    hDefault: "175",
    tDefault: "30",
    sDefault: "male",
    aDefault: "moderate",
    bDefault: "",
    rDefault: "",
  },
  "diet-maintenance-calories-calculator": {
    title: "Maintenance calories",
    description: `Estimated maintenance intake ≈ TDEE (BMR × activity factor). ${DISCLAIMER}`,
    mode: "maintenance",
    wDefault: "70",
    hDefault: "175",
    tDefault: "30",
    sDefault: "male",
    aDefault: "moderate",
    bDefault: "",
    rDefault: "",
  },
  "diet-weight-loss-calorie-calculator": {
    title: "Weight-loss calories",
    description: `TDEE minus a daily deficit (default 500 kcal), floored at 1200. ${DISCLAIMER}`,
    mode: "loss",
    wDefault: "70",
    hDefault: "175",
    tDefault: "30",
    sDefault: "female",
    aDefault: "light",
    bDefault: "",
    rDefault: "500",
  },
  "diet-weight-gain-calorie-calculator": {
    title: "Weight-gain calories",
    description: `TDEE plus a daily surplus (default 300 kcal). ${DISCLAIMER}`,
    mode: "gain",
    wDefault: "70",
    hDefault: "175",
    tDefault: "28",
    sDefault: "male",
    aDefault: "active",
    bDefault: "",
    rDefault: "300",
  },
  "diet-tdee-calculator": {
    title: "TDEE (total daily energy expenditure)",
    description: `BMR × activity factor (sedentary → very). ${DISCLAIMER}`,
    mode: "tdee",
    wDefault: "70",
    hDefault: "175",
    tDefault: "30",
    sDefault: "male",
    aDefault: "moderate",
    bDefault: "",
    rDefault: "",
  },
  "diet-activity-calorie-burn-calculator": {
    title: "Activity calorie burn",
    description: `kcal ≈ MET × weight(kg) × hours. ${DISCLAIMER}`,
    mode: "activityBurn",
    wDefault: "70",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "6",
    bDefault: "1",
    rDefault: "",
  },
  "diet-steps-to-calories-calculator": {
    title: "Steps to calories",
    description: `kcal ≈ steps × kcal/step (default 0.04). ${DISCLAIMER}`,
    mode: "steps",
    wDefault: "",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "8000",
    bDefault: "0.04",
    rDefault: "",
  },
  "diet-exercise-calorie-calculator": {
    title: "Exercise calories",
    description: `kcal ≈ MET × weight(kg) × (minutes / 60). ${DISCLAIMER}`,
    mode: "exercise",
    wDefault: "70",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "7",
    bDefault: "45",
    rDefault: "",
  },
  "diet-calorie-deficit-calculator": {
    title: "Calorie deficit",
    description: `Deficit = TDEE − intake; weekly kg estimate uses ~7700 kcal/kg. ${DISCLAIMER}`,
    mode: "deficit",
    wDefault: "",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "2500",
    bDefault: "2000",
    rDefault: "",
  },
  "diet-calorie-surplus-calculator": {
    title: "Calorie surplus",
    description: `Surplus = intake − TDEE; weekly kg estimate uses ~7700 kcal/kg. ${DISCLAIMER}`,
    mode: "surplus",
    wDefault: "",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "2500",
    bDefault: "2800",
    rDefault: "",
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

function isTdeeMode(mode: Mode) {
  return mode === "daily" || mode === "maintenance" || mode === "loss" || mode === "gain" || mode === "tdee";
}

export function DietCalorieEnergyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CalorieSlug] ?? CONFIG["diet-daily-calorie-needs-calculator"];
  const [w, setW] = useState(useLoanInitialInput(DIET_CALORIE_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(DIET_CALORIE_URL.H, config.hDefault));
  const [t, setT] = useState(useLoanInitialInput(DIET_CALORIE_URL.T, config.tDefault));
  const [s, setS] = useState(useLoanInitialInput(DIET_CALORIE_URL.S, config.sDefault));
  const [a, setA] = useState(useLoanInitialInput(DIET_CALORIE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_CALORIE_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(DIET_CALORIE_URL.R, config.rDefault));

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
      case "daily":
      case "maintenance":
      case "tdee":
        put(DIET_CALORIE_URL.W, w);
        put(DIET_CALORIE_URL.H, h);
        put(DIET_CALORIE_URL.T, t);
        put(DIET_CALORIE_URL.S, s);
        put(DIET_CALORIE_URL.A, a);
        break;
      case "loss":
      case "gain":
        put(DIET_CALORIE_URL.W, w);
        put(DIET_CALORIE_URL.H, h);
        put(DIET_CALORIE_URL.T, t);
        put(DIET_CALORIE_URL.S, s);
        put(DIET_CALORIE_URL.A, a);
        put(DIET_CALORIE_URL.R, r);
        break;
      case "activityBurn":
      case "exercise":
        put(DIET_CALORIE_URL.W, w);
        put(DIET_CALORIE_URL.A, a);
        put(DIET_CALORIE_URL.B, b);
        break;
      case "steps":
      case "deficit":
      case "surplus":
        put(DIET_CALORIE_URL.A, a);
        put(DIET_CALORIE_URL.B, b);
        break;
    }
    return out;
  }, [a, b, h, r, s, t, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, h, r, s, t, w]);

  const result = useMemo(() => {
    if (isTdeeMode(config.mode)) {
      const wt = parsePositive(w, "Weight (kg)");
      const ht = parsePositive(h, "Height (cm)");
      const age = parsePositive(t, "Age");
      if (!wt.ok) return { error: wt.error };
      if (!ht.ok) return { error: ht.error };
      if (!age.ok) return { error: age.error };
      const sex = parseSex(s);
      if (typeof sex === "object") return { error: sex.error };
      const base = {
        weightKg: wt.value,
        heightCm: ht.value,
        age: age.value,
        sex: s,
        activity: a,
      };
      if (config.mode === "maintenance") {
        const computed = dietMaintenanceCalories(base);
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.maintenance, 0),
          primaryLabel: "Maintenance (kcal/day)",
          rows: [
            { label: "Activity factor", value: num(computed.factor, 3) },
            { label: "Sex", value: sex },
          ],
        };
      }
      if (config.mode === "loss") {
        let deficit: number | undefined;
        if (r.trim() !== "") {
          const dP = parseNonNegative(r, "Deficit");
          if (!dP.ok) return { error: dP.error };
          deficit = dP.value;
        }
        const computed = dietWeightLossCalories({ ...base, deficit });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.target, 0),
          primaryLabel: "Target (kcal/day)",
          rows: [
            { label: "TDEE", value: num(computed.tdee, 0) },
            { label: "Deficit", value: num(computed.deficit, 0) },
          ],
        };
      }
      if (config.mode === "gain") {
        let surplus: number | undefined;
        if (r.trim() !== "") {
          const sP = parseNonNegative(r, "Surplus");
          if (!sP.ok) return { error: sP.error };
          surplus = sP.value;
        }
        const computed = dietWeightGainCalories({ ...base, surplus });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.target, 0),
          primaryLabel: "Target (kcal/day)",
          rows: [
            { label: "TDEE", value: num(computed.tdee, 0) },
            { label: "Surplus", value: num(computed.surplus, 0) },
          ],
        };
      }
      const computed = config.mode === "tdee" ? dietTdee(base) : dietDailyCalorieNeeds(base);
      if ("error" in computed) return { error: computed.error };
      return {
        primary: num(computed.tdee, 0),
        primaryLabel: "TDEE (kcal/day)",
        rows: [
          { label: "Activity factor", value: num(computed.factor, 3) },
          { label: "Sex", value: sex },
        ],
      };
    }

    switch (config.mode) {
      case "activityBurn": {
        const wt = parsePositive(w, "Weight (kg)");
        const met = parsePositive(a, "MET");
        const hours = parseNonNegative(b, "Hours");
        if (!wt.ok) return { error: wt.error };
        if (!met.ok) return { error: met.error };
        if (!hours.ok) return { error: hours.error };
        const computed = dietActivityBurn({ weightKg: wt.value, met: met.value, hours: hours.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.kcal, 0),
          primaryLabel: "Burn (kcal)",
          rows: [
            { label: "MET", value: num(met.value, 2) },
            { label: "Hours", value: num(hours.value, 2) },
          ],
        };
      }
      case "steps": {
        const stepsP = parseNonNegative(a, "Steps");
        if (!stepsP.ok) return { error: stepsP.error };
        let kcalPerStep: number | undefined;
        if (b.trim() !== "") {
          const kP = parsePositive(b, "kcal per step");
          if (!kP.ok) return { error: kP.error };
          kcalPerStep = kP.value;
        }
        const computed = dietStepsToCalories({ steps: stepsP.value, kcalPerStep });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.kcal, 0),
          primaryLabel: "Calories (kcal)",
          rows: [{ label: "Steps", value: num(stepsP.value, 0) }],
        };
      }
      case "exercise": {
        const wt = parsePositive(w, "Weight (kg)");
        const met = parsePositive(a, "MET");
        const mins = parseNonNegative(b, "Minutes");
        if (!wt.ok) return { error: wt.error };
        if (!met.ok) return { error: met.error };
        if (!mins.ok) return { error: mins.error };
        const computed = dietExerciseCalories({
          weightKg: wt.value,
          met: met.value,
          minutes: mins.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.kcal, 0),
          primaryLabel: "Burn (kcal)",
          rows: [
            { label: "MET", value: num(met.value, 2) },
            { label: "Minutes", value: num(mins.value, 0) },
          ],
        };
      }
      case "deficit": {
        const tdeeP = parsePositive(a, "TDEE");
        const intakeP = parseNonNegative(b, "Intake");
        if (!tdeeP.ok) return { error: tdeeP.error };
        if (!intakeP.ok) return { error: intakeP.error };
        const computed = dietCalorieDeficit({ tdee: tdeeP.value, intake: intakeP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.deficit, 0),
          primaryLabel: "Deficit (kcal/day)",
          rows: [{ label: "Est. weekly loss (kg)", value: num(computed.weeklyLossKgEst, 2) }],
        };
      }
      case "surplus": {
        const tdeeP = parsePositive(a, "TDEE");
        const intakeP = parseNonNegative(b, "Intake");
        if (!tdeeP.ok) return { error: tdeeP.error };
        if (!intakeP.ok) return { error: intakeP.error };
        const computed = dietCalorieSurplus({ tdee: tdeeP.value, intake: intakeP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.surplus, 0),
          primaryLabel: "Surplus (kcal/day)",
          rows: [{ label: "Est. weekly gain (kg)", value: num(computed.weeklyGainKgEst, 2) }],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [a, b, config.mode, h, r, s, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {isTdeeMode(config.mode) ? (
            <>
              <div>
                <FieldLabel htmlFor="dce-w">Weight (kg)</FieldLabel>
                <FieldInput id="dce-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-h">Height (cm)</FieldLabel>
                <FieldInput id="dce-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-t">Age (years)</FieldLabel>
                <FieldInput id="dce-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-s">Sex (male or female)</FieldLabel>
                <FieldInput id="dce-s" value={s} onChange={(ev) => setS(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="dce-a">Activity (sedentary, light, moderate, active, very)</FieldLabel>
                <FieldInput id="dce-a" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              {config.mode === "loss" ? (
                <div>
                  <FieldLabel htmlFor="dce-r">Daily deficit (kcal, optional)</FieldLabel>
                  <FieldInput id="dce-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
                </div>
              ) : null}
              {config.mode === "gain" ? (
                <div>
                  <FieldLabel htmlFor="dce-r">Daily surplus (kcal, optional)</FieldLabel>
                  <FieldInput id="dce-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
                </div>
              ) : null}
            </>
          ) : null}

          {config.mode === "activityBurn" ? (
            <>
              <div>
                <FieldLabel htmlFor="dce-w">Weight (kg)</FieldLabel>
                <FieldInput id="dce-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-a">MET</FieldLabel>
                <FieldInput id="dce-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-b">Hours</FieldLabel>
                <FieldInput id="dce-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "steps" ? (
            <>
              <div>
                <FieldLabel htmlFor="dce-a">Steps</FieldLabel>
                <FieldInput id="dce-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-b">kcal per step (optional)</FieldLabel>
                <FieldInput id="dce-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "exercise" ? (
            <>
              <div>
                <FieldLabel htmlFor="dce-w">Weight (kg)</FieldLabel>
                <FieldInput id="dce-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-a">MET</FieldLabel>
                <FieldInput id="dce-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-b">Minutes</FieldLabel>
                <FieldInput id="dce-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "deficit" || config.mode === "surplus" ? (
            <>
              <div>
                <FieldLabel htmlFor="dce-a">TDEE (kcal/day)</FieldLabel>
                <FieldInput id="dce-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dce-b">Intake (kcal/day)</FieldLabel>
                <FieldInput id="dce-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
