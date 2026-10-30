"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_HYDRATION_URL,
  dietDailyWater,
  dietDehydrationRisk,
  dietExerciseHydration,
  dietHydrationClimate,
  dietWaterByWeight,
} from "@/lib/calculators/dietHydration";

type HydrationSlug =
  | "diet-daily-water-intake-calculator"
  | "diet-water-intake-by-weight-calculator"
  | "diet-hydration-climate-calculator"
  | "diet-exercise-hydration-calculator"
  | "diet-dehydration-risk-calculator";

type Mode = "daily" | "byWeight" | "climate" | "exercise" | "risk";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  wDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Wellness education only — not a medical device, dehydration diagnosis, or clinical fluid prescription. Illness and extreme conditions need professional care.";

const CONFIG: Record<HydrationSlug, Config> = {
  "diet-daily-water-intake-calculator": {
    title: "Daily water intake",
    description: `ml/day ≈ weight(kg) × ml/kg (default 35). ${DISCLAIMER}`,
    mode: "daily",
    wDefault: "70",
    aDefault: "35",
    bDefault: "",
    cDefault: "",
  },
  "diet-water-intake-by-weight-calculator": {
    title: "Water by weight",
    description: `Teaching heuristic at 33 ml/kg. ${DISCLAIMER}`,
    mode: "byWeight",
    wDefault: "70",
    aDefault: "",
    bDefault: "",
    cDefault: "",
  },
  "diet-hydration-climate-calculator": {
    title: "Climate hydration",
    description: `Base 35 ml/kg with temperate / hot / humid / cold adjustments. ${DISCLAIMER}`,
    mode: "climate",
    wDefault: "70",
    aDefault: "temperate",
    bDefault: "",
    cDefault: "",
  },
  "diet-exercise-hydration-calculator": {
    title: "Exercise hydration",
    description: `Base fluid + exercise minutes × ml/min (default 7). ${DISCLAIMER}`,
    mode: "exercise",
    wDefault: "",
    aDefault: "2450",
    bDefault: "45",
    cDefault: "7",
  },
  "diet-dehydration-risk-calculator": {
    title: "Dehydration risk band",
    description: `Compares intake to need as a teaching % band. ${DISCLAIMER}`,
    mode: "risk",
    wDefault: "",
    aDefault: "2000",
    bDefault: "2500",
    cDefault: "",
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

export function DietHydrationCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as HydrationSlug] ?? CONFIG["diet-daily-water-intake-calculator"];
  const [w, setW] = useState(useLoanInitialInput(DIET_HYDRATION_URL.W, config.wDefault));
  const [a, setA] = useState(useLoanInitialInput(DIET_HYDRATION_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_HYDRATION_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(DIET_HYDRATION_URL.C, config.cDefault));

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
      case "daily":
        put(DIET_HYDRATION_URL.W, w);
        put(DIET_HYDRATION_URL.A, a);
        break;
      case "byWeight":
        put(DIET_HYDRATION_URL.W, w);
        break;
      case "climate":
        put(DIET_HYDRATION_URL.W, w);
        put(DIET_HYDRATION_URL.A, a);
        break;
      case "exercise":
        put(DIET_HYDRATION_URL.A, a);
        put(DIET_HYDRATION_URL.B, b);
        put(DIET_HYDRATION_URL.C, c);
        break;
      case "risk":
        put(DIET_HYDRATION_URL.A, a);
        put(DIET_HYDRATION_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "daily": {
        const wt = parsePositive(w, "Weight (kg)");
        if (!wt.ok) return { error: wt.error };
        let mlPerKg: number | undefined;
        if (a.trim() !== "") {
          const mP = parsePositive(a, "ml per kg");
          if (!mP.ok) return { error: mP.error };
          mlPerKg = mP.value;
        }
        const computed = dietDailyWater({ weightKg: wt.value, mlPerKg });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mlPerDay, 0),
          primaryLabel: "ml per day",
          rows: [{ label: "Liters", value: num(computed.liters, 2) }],
        };
      }
      case "byWeight": {
        const wt = parsePositive(w, "Weight (kg)");
        if (!wt.ok) return { error: wt.error };
        const computed = dietWaterByWeight({ weightKg: wt.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mlPerDay, 0),
          primaryLabel: "ml per day",
          rows: [{ label: "Liters", value: num(computed.liters, 2) }],
        };
      }
      case "climate": {
        const wt = parsePositive(w, "Weight (kg)");
        if (!wt.ok) return { error: wt.error };
        const computed = dietHydrationClimate({ weightKg: wt.value, climate: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mlPerDay, 0),
          primaryLabel: "ml per day",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "exercise": {
        const base = parseNonNegative(a, "Base ml");
        const mins = parseNonNegative(b, "Exercise minutes");
        if (!base.ok) return { error: base.error };
        if (!mins.ok) return { error: mins.error };
        let mlPerMin: number | undefined;
        if (c.trim() !== "") {
          const rP = parsePositive(c, "ml per minute");
          if (!rP.ok) return { error: rP.error };
          mlPerMin = rP.value;
        }
        const computed = dietExerciseHydration({
          baseMl: base.value,
          exerciseMin: mins.value,
          mlPerMin,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mlPerDay, 0),
          primaryLabel: "Total ml",
          rows: [{ label: "Exercise add (ml)", value: num(computed.exerciseMl, 0) }],
        };
      }
      case "risk": {
        const intake = parseNonNegative(a, "Intake ml");
        const need = parsePositive(b, "Need ml");
        if (!intake.ok) return { error: intake.error };
        if (!need.ok) return { error: need.error };
        const computed = dietDehydrationRisk({ intakeMl: intake.value, needMl: need.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.band,
          primaryLabel: "Teaching risk band",
          rows: [{ label: "% of need", value: num(computed.percentOfNeed, 1) }],
        };
      }
    }
  }, [a, b, c, config.mode, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "daily" ? (
            <>
              <div>
                <FieldLabel htmlFor="dh-w">Weight (kg)</FieldLabel>
                <FieldInput id="dh-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dh-a">ml per kg (optional)</FieldLabel>
                <FieldInput id="dh-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "byWeight" ? (
            <div>
              <FieldLabel htmlFor="dh-w">Weight (kg)</FieldLabel>
              <FieldInput id="dh-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "climate" ? (
            <>
              <div>
                <FieldLabel htmlFor="dh-w">Weight (kg)</FieldLabel>
                <FieldInput id="dh-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dh-a">Climate (temperate, hot, humid, cold)</FieldLabel>
                <FieldInput id="dh-a" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "exercise" ? (
            <>
              <div>
                <FieldLabel htmlFor="dh-a">Base fluid (ml)</FieldLabel>
                <FieldInput id="dh-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dh-b">Exercise minutes</FieldLabel>
                <FieldInput id="dh-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dh-c">ml per minute (optional)</FieldLabel>
                <FieldInput id="dh-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "risk" ? (
            <>
              <div>
                <FieldLabel htmlFor="dh-a">Intake (ml)</FieldLabel>
                <FieldInput id="dh-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dh-b">Need (ml)</FieldLabel>
                <FieldInput id="dh-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
