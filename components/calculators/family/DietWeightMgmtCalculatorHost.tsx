"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import { parseSex } from "@/lib/calculators/dietHelpers";
import {
  DIET_WEIGHT_URL,
  dietBmiBasedDiet,
  dietBodyFatBasedDiet,
  dietIdealWeight,
  dietTargetWeight,
  dietWeeklyWeightLoss,
  dietWeightGainPlanner,
  dietWeightLossTimeline,
} from "@/lib/calculators/dietWeightMgmt";

type WeightSlug =
  | "diet-ideal-weight-calculator"
  | "diet-target-weight-calculator"
  | "diet-weight-loss-timeline-calculator"
  | "diet-bmi-based-diet-calculator"
  | "diet-body-fat-based-diet-calculator"
  | "diet-weekly-weight-loss-calculator"
  | "diet-weight-gain-planner-calculator";

type Mode = "ideal" | "target" | "timeline" | "bmi" | "bodyFat" | "weekly" | "gain";

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
};

const DISCLAIMER =
  "Wellness education only — not a medical device, weight-loss program, or clinical advice. Safe pacing and targets need professional guidance.";

const CONFIG: Record<WeightSlug, Config> = {
  "diet-ideal-weight-calculator": {
    title: "Ideal weight (Devine)",
    description: `Devine IBW from height ≥152 cm and sex. ${DISCLAIMER}`,
    mode: "ideal",
    wDefault: "",
    hDefault: "175",
    tDefault: "",
    sDefault: "male",
    aDefault: "",
    bDefault: "",
  },
  "diet-target-weight-calculator": {
    title: "Target weight delta",
    description: `Delta between current and target weight with direction. ${DISCLAIMER}`,
    mode: "target",
    wDefault: "80",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "72",
    bDefault: "",
  },
  "diet-weight-loss-timeline-calculator": {
    title: "Weight-loss timeline",
    description: `Weeks ≈ (current − target) ÷ kg/week pace. ${DISCLAIMER}`,
    mode: "timeline",
    wDefault: "85",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "75",
    bDefault: "0.5",
  },
  "diet-bmi-based-diet-calculator": {
    title: "BMI-based calorie target",
    description: `BMI plus TDEE with a simple surplus/deficit heuristic. ${DISCLAIMER}`,
    mode: "bmi",
    wDefault: "80",
    hDefault: "175",
    tDefault: "32",
    sDefault: "male",
    aDefault: "moderate",
    bDefault: "",
  },
  "diet-body-fat-based-diet-calculator": {
    title: "Body-fat-based calorie target",
    description: `FFM and a teaching calorie cut from body-fat % and TDEE. ${DISCLAIMER}`,
    mode: "bodyFat",
    wDefault: "80",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "22",
    bDefault: "2500",
  },
  "diet-weekly-weight-loss-calculator": {
    title: "Weekly weight loss",
    description: `kg/week ≈ (daily deficit × 7) / 7700. ${DISCLAIMER}`,
    mode: "weekly",
    wDefault: "",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "500",
    bDefault: "",
  },
  "diet-weight-gain-planner-calculator": {
    title: "Weight-gain planner",
    description: `Target calories = TDEE + surplus (default 300) with weekly kg estimate. ${DISCLAIMER}`,
    mode: "gain",
    wDefault: "",
    hDefault: "",
    tDefault: "",
    sDefault: "",
    aDefault: "2500",
    bDefault: "300",
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

export function DietWeightMgmtCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as WeightSlug] ?? CONFIG["diet-ideal-weight-calculator"];
  const [w, setW] = useState(useLoanInitialInput(DIET_WEIGHT_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(DIET_WEIGHT_URL.H, config.hDefault));
  const [t, setT] = useState(useLoanInitialInput(DIET_WEIGHT_URL.T, config.tDefault));
  const [s, setS] = useState(useLoanInitialInput(DIET_WEIGHT_URL.S, config.sDefault));
  const [a, setA] = useState(useLoanInitialInput(DIET_WEIGHT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_WEIGHT_URL.B, config.bDefault));

  const num = (nVal: number, d = 2) => {
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
      case "ideal":
        put(DIET_WEIGHT_URL.H, h);
        put(DIET_WEIGHT_URL.S, s);
        break;
      case "target":
        put(DIET_WEIGHT_URL.W, w);
        put(DIET_WEIGHT_URL.A, a);
        break;
      case "timeline":
        put(DIET_WEIGHT_URL.W, w);
        put(DIET_WEIGHT_URL.A, a);
        put(DIET_WEIGHT_URL.B, b);
        break;
      case "bmi":
        put(DIET_WEIGHT_URL.W, w);
        put(DIET_WEIGHT_URL.H, h);
        put(DIET_WEIGHT_URL.T, t);
        put(DIET_WEIGHT_URL.S, s);
        put(DIET_WEIGHT_URL.A, a);
        break;
      case "bodyFat":
        put(DIET_WEIGHT_URL.W, w);
        put(DIET_WEIGHT_URL.A, a);
        put(DIET_WEIGHT_URL.B, b);
        break;
      case "weekly":
        put(DIET_WEIGHT_URL.A, a);
        break;
      case "gain":
        put(DIET_WEIGHT_URL.A, a);
        put(DIET_WEIGHT_URL.B, b);
        break;
    }
    return out;
  }, [a, b, h, s, t, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, h, s, t, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "ideal": {
        const ht = parsePositive(h, "Height (cm)");
        if (!ht.ok) return { error: ht.error };
        const sex = parseSex(s);
        if (typeof sex === "object") return { error: sex.error };
        const computed = dietIdealWeight({ heightCm: ht.value, sex: s });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ibwKg, 1),
          primaryLabel: "Ideal body weight (kg)",
          rows: [{ label: "Sex", value: sex }],
        };
      }
      case "target": {
        const cur = parsePositive(w, "Current weight");
        const tgt = parsePositive(a, "Target weight");
        if (!cur.ok) return { error: cur.error };
        if (!tgt.ok) return { error: tgt.error };
        const computed = dietTargetWeight({ currentKg: cur.value, targetKg: tgt.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.deltaKg, 1),
          primaryLabel: "Delta (kg)",
          rows: [{ label: "Direction", value: computed.direction }],
        };
      }
      case "timeline": {
        const cur = parsePositive(w, "Current weight");
        const tgt = parsePositive(a, "Target weight");
        const pace = parsePositive(b, "kg per week");
        if (!cur.ok) return { error: cur.error };
        if (!tgt.ok) return { error: tgt.error };
        if (!pace.ok) return { error: pace.error };
        const computed = dietWeightLossTimeline({
          currentKg: cur.value,
          targetKg: tgt.value,
          kgPerWeek: pace.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.weeks, 1),
          primaryLabel: "Estimated weeks",
          rows: [{ label: "Days", value: num(computed.days, 0) }],
        };
      }
      case "bmi": {
        const wt = parsePositive(w, "Weight (kg)");
        const ht = parsePositive(h, "Height (cm)");
        const age = parsePositive(t, "Age");
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (!age.ok) return { error: age.error };
        const sex = parseSex(s);
        if (typeof sex === "object") return { error: sex.error };
        const computed = dietBmiBasedDiet({
          weightKg: wt.value,
          heightCm: ht.value,
          age: age.value,
          sex: s,
          activity: a,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.targetCalories, 0),
          primaryLabel: "Target calories",
          rows: [
            { label: "BMI", value: num(computed.bmi, 1) },
            { label: "TDEE", value: num(computed.tdee, 0) },
            { label: "Sex", value: sex },
          ],
        };
      }
      case "bodyFat": {
        const wt = parsePositive(w, "Weight (kg)");
        const bf = parseNonNegative(a, "Body fat %");
        const tdee = parsePositive(b, "TDEE");
        if (!wt.ok) return { error: wt.error };
        if (!bf.ok) return { error: bf.error };
        if (!tdee.ok) return { error: tdee.error };
        const computed = dietBodyFatBasedDiet({
          weightKg: wt.value,
          bodyFatPct: bf.value,
          tdee: tdee.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.targetCalories, 0),
          primaryLabel: "Target calories",
          rows: [{ label: "FFM (kg)", value: num(computed.ffmKg, 1) }],
        };
      }
      case "weekly": {
        const def = parseNonNegative(a, "Daily deficit");
        if (!def.ok) return { error: def.error };
        const computed = dietWeeklyWeightLoss({ dailyDeficit: def.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.kgPerWeek, 2),
          primaryLabel: "kg per week (estimate)",
          rows: [{ label: "Daily deficit", value: num(def.value, 0) }],
        };
      }
      case "gain": {
        const tdee = parsePositive(a, "TDEE");
        if (!tdee.ok) return { error: tdee.error };
        let surplus: number | undefined;
        if (b.trim() !== "") {
          const sP = parseNonNegative(b, "Surplus");
          if (!sP.ok) return { error: sP.error };
          surplus = sP.value;
        }
        const computed = dietWeightGainPlanner({ tdee: tdee.value, surplus });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.targetCalories, 0),
          primaryLabel: "Target calories",
          rows: [{ label: "Est. kg/week", value: num(computed.kgPerWeekEst, 2) }],
        };
      }
    }
  }, [a, b, config.mode, h, s, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "ideal" ? (
            <>
              <div>
                <FieldLabel htmlFor="dw-h">Height (cm)</FieldLabel>
                <FieldInput id="dw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-s">Sex (male or female)</FieldLabel>
                <FieldInput id="dw-s" value={s} onChange={(ev) => setS(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "target" ? (
            <>
              <div>
                <FieldLabel htmlFor="dw-w">Current weight (kg)</FieldLabel>
                <FieldInput id="dw-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-a">Target weight (kg)</FieldLabel>
                <FieldInput id="dw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "timeline" ? (
            <>
              <div>
                <FieldLabel htmlFor="dw-w">Current weight (kg)</FieldLabel>
                <FieldInput id="dw-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-a">Target weight (kg)</FieldLabel>
                <FieldInput id="dw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-b">kg per week</FieldLabel>
                <FieldInput id="dw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "bmi" ? (
            <>
              <div>
                <FieldLabel htmlFor="dw-w">Weight (kg)</FieldLabel>
                <FieldInput id="dw-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-h">Height (cm)</FieldLabel>
                <FieldInput id="dw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-t">Age (years)</FieldLabel>
                <FieldInput id="dw-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-s">Sex (male or female)</FieldLabel>
                <FieldInput id="dw-s" value={s} onChange={(ev) => setS(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="dw-a">Activity (sedentary, light, moderate, active, very)</FieldLabel>
                <FieldInput id="dw-a" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "bodyFat" ? (
            <>
              <div>
                <FieldLabel htmlFor="dw-w">Weight (kg)</FieldLabel>
                <FieldInput id="dw-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-a">Body fat %</FieldLabel>
                <FieldInput id="dw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-b">TDEE (kcal/day)</FieldLabel>
                <FieldInput id="dw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "weekly" ? (
            <div>
              <FieldLabel htmlFor="dw-a">Daily deficit (kcal)</FieldLabel>
              <FieldInput id="dw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "gain" ? (
            <>
              <div>
                <FieldLabel htmlFor="dw-a">TDEE (kcal/day)</FieldLabel>
                <FieldInput id="dw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dw-b">Surplus (kcal, optional)</FieldLabel>
                <FieldInput id="dw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
