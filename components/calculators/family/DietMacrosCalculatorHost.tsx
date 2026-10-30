"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_MACRO_URL,
  dietBodybuildingMacros,
  dietCarbIntake,
  dietCuttingMacros,
  dietFatIntake,
  dietHighProtein,
  dietKetoMacros,
  dietLeanBulkMacros,
  dietLowCarb,
  dietMacroSplit,
  dietProteinIntake,
} from "@/lib/calculators/dietMacros";

type MacroSlug =
  | "diet-macronutrient-split-calculator"
  | "diet-protein-intake-calculator"
  | "diet-carbohydrate-intake-calculator"
  | "diet-fat-intake-calculator"
  | "diet-keto-macro-calculator"
  | "diet-low-carb-calculator"
  | "diet-high-protein-calculator"
  | "diet-bodybuilding-macro-calculator"
  | "diet-lean-bulk-macro-calculator"
  | "diet-cutting-diet-calculator";

type Mode =
  | "split"
  | "protein"
  | "carb"
  | "fat"
  | "keto"
  | "lowCarb"
  | "highProtein"
  | "bodybuilding"
  | "leanBulk"
  | "cutting";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  wDefault: string;
  pDefault: string;
  cDefault: string;
  fDefault: string;
};

const DISCLAIMER =
  "Wellness education only — not a medical device, meal prescription, or clinical nutrition advice. Macro targets are teaching heuristics; verify with a qualified professional.";

const CONFIG: Record<MacroSlug, Config> = {
  "diet-macronutrient-split-calculator": {
    title: "Macronutrient split",
    description: `Split daily calories into protein, carb, and fat grams from %. ${DISCLAIMER}`,
    mode: "split",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "30",
    cDefault: "40",
    fDefault: "30",
  },
  "diet-protein-intake-calculator": {
    title: "Protein intake",
    description: `Protein (g) = weight(kg) × g/kg. ${DISCLAIMER}`,
    mode: "protein",
    aDefault: "",
    bDefault: "1.6",
    wDefault: "70",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-carbohydrate-intake-calculator": {
    title: "Carbohydrate intake",
    description: `Carb grams from calorie budget × carb %. ${DISCLAIMER}`,
    mode: "carb",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "45",
    fDefault: "",
  },
  "diet-fat-intake-calculator": {
    title: "Fat intake",
    description: `Fat grams from calorie budget × fat %. ${DISCLAIMER}`,
    mode: "fat",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "30",
  },
  "diet-keto-macro-calculator": {
    title: "Keto macros",
    description: `Teaching keto split ≈ 25% protein / 5% carb / 70% fat. ${DISCLAIMER}`,
    mode: "keto",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-low-carb-calculator": {
    title: "Low-carb macros",
    description: `Teaching low-carb split ≈ 30% protein / 20% carb / 50% fat. ${DISCLAIMER}`,
    mode: "lowCarb",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-high-protein-calculator": {
    title: "High-protein macros",
    description: `Teaching high-protein split ≈ 40% / 30% / 30%. ${DISCLAIMER}`,
    mode: "highProtein",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-bodybuilding-macro-calculator": {
    title: "Bodybuilding macros",
    description: `Teaching bodybuilding split ≈ 35% protein / 40% carb / 25% fat. ${DISCLAIMER}`,
    mode: "bodybuilding",
    aDefault: "2800",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-lean-bulk-macro-calculator": {
    title: "Lean bulk macros",
    description: `Teaching lean-bulk split ≈ 30% protein / 45% carb / 25% fat. ${DISCLAIMER}`,
    mode: "leanBulk",
    aDefault: "2600",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
    fDefault: "",
  },
  "diet-cutting-diet-calculator": {
    title: "Cutting macros",
    description: `Teaching cutting split ≈ 40% protein / 30% carb / 30% fat. ${DISCLAIMER}`,
    mode: "cutting",
    aDefault: "2000",
    bDefault: "",
    wDefault: "",
    pDefault: "",
    cDefault: "",
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

function macroRows(computed: { proteinG: number; carbG: number; fatG: number }, num: (n: number, d?: number) => string) {
  return [
    { label: "Protein (g)", value: num(computed.proteinG, 0) },
    { label: "Carbs (g)", value: num(computed.carbG, 0) },
    { label: "Fat (g)", value: num(computed.fatG, 0) },
  ];
}

function isPresetMode(mode: Mode) {
  return (
    mode === "keto" ||
    mode === "lowCarb" ||
    mode === "highProtein" ||
    mode === "bodybuilding" ||
    mode === "leanBulk" ||
    mode === "cutting"
  );
}

export function DietMacrosCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MacroSlug] ?? CONFIG["diet-macronutrient-split-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_MACRO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_MACRO_URL.B, config.bDefault));
  const [w, setW] = useState(useLoanInitialInput(DIET_MACRO_URL.W, config.wDefault));
  const [p, setP] = useState(useLoanInitialInput(DIET_MACRO_URL.P, config.pDefault));
  const [c, setC] = useState(useLoanInitialInput(DIET_MACRO_URL.C, config.cDefault));
  const [f, setF] = useState(useLoanInitialInput(DIET_MACRO_URL.F, config.fDefault));

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
      case "split":
        put(DIET_MACRO_URL.A, a);
        put(DIET_MACRO_URL.P, p);
        put(DIET_MACRO_URL.C, c);
        put(DIET_MACRO_URL.F, f);
        break;
      case "protein":
        put(DIET_MACRO_URL.W, w);
        put(DIET_MACRO_URL.B, b);
        break;
      case "carb":
        put(DIET_MACRO_URL.A, a);
        put(DIET_MACRO_URL.C, c);
        break;
      case "fat":
        put(DIET_MACRO_URL.A, a);
        put(DIET_MACRO_URL.F, f);
        break;
      default:
        put(DIET_MACRO_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, f, p, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, f, p, w]);

  const result = useMemo(() => {
    if (config.mode === "split") {
      const cal = parsePositive(a, "Calories");
      const prot = parsePositive(p, "Protein %");
      const carb = parsePositive(c, "Carb %");
      const fat = parsePositive(f, "Fat %");
      if (!cal.ok) return { error: cal.error };
      if (!prot.ok) return { error: prot.error };
      if (!carb.ok) return { error: carb.error };
      if (!fat.ok) return { error: fat.error };
      const computed = dietMacroSplit({
        calories: cal.value,
        proteinPct: prot.value,
        carbPct: carb.value,
        fatPct: fat.value,
      });
      if ("error" in computed) return { error: computed.error };
      return {
        primary: `${num(computed.proteinG, 0)} / ${num(computed.carbG, 0)} / ${num(computed.fatG, 0)} g`,
        primaryLabel: "Protein / carbs / fat",
        rows: macroRows(computed, num),
      };
    }
    if (config.mode === "protein") {
      const wt = parsePositive(w, "Weight (kg)");
      const gkg = parsePositive(b, "g per kg");
      if (!wt.ok) return { error: wt.error };
      if (!gkg.ok) return { error: gkg.error };
      const computed = dietProteinIntake({ weightKg: wt.value, gPerKg: gkg.value });
      if ("error" in computed) return { error: computed.error };
      return {
        primary: num(computed.proteinG, 0),
        primaryLabel: "Protein (g/day)",
        rows: [
          { label: "Weight (kg)", value: num(wt.value, 1) },
          { label: "g/kg", value: num(gkg.value, 2) },
        ],
      };
    }
    if (config.mode === "carb") {
      const cal = parsePositive(a, "Calories");
      const carb = parsePositive(c, "Carb %");
      if (!cal.ok) return { error: cal.error };
      if (!carb.ok) return { error: carb.error };
      const computed = dietCarbIntake({ calories: cal.value, carbPct: carb.value });
      if ("error" in computed) return { error: computed.error };
      return {
        primary: num(computed.carbG, 0),
        primaryLabel: "Carbs (g/day)",
        rows: [{ label: "Carb %", value: num(carb.value, 1) }],
      };
    }
    if (config.mode === "fat") {
      const cal = parsePositive(a, "Calories");
      const fat = parsePositive(f, "Fat %");
      if (!cal.ok) return { error: cal.error };
      if (!fat.ok) return { error: fat.error };
      const computed = dietFatIntake({ calories: cal.value, fatPct: fat.value });
      if ("error" in computed) return { error: computed.error };
      return {
        primary: num(computed.fatG, 0),
        primaryLabel: "Fat (g/day)",
        rows: [{ label: "Fat %", value: num(fat.value, 1) }],
      };
    }

    const cal = parsePositive(a, "Calories");
    if (!cal.ok) return { error: cal.error };
    const preset =
      config.mode === "keto"
        ? dietKetoMacros({ calories: cal.value })
        : config.mode === "lowCarb"
          ? dietLowCarb({ calories: cal.value })
          : config.mode === "highProtein"
            ? dietHighProtein({ calories: cal.value })
            : config.mode === "bodybuilding"
              ? dietBodybuildingMacros({ calories: cal.value })
              : config.mode === "leanBulk"
                ? dietLeanBulkMacros({ calories: cal.value })
                : dietCuttingMacros({ calories: cal.value });
    if ("error" in preset) return { error: preset.error };
    return {
      primary: `${num(preset.proteinG, 0)} / ${num(preset.carbG, 0)} / ${num(preset.fatG, 0)} g`,
      primaryLabel: "Protein / carbs / fat",
      rows: macroRows(preset, num),
    };
  }, [a, b, c, config.mode, f, p, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "split" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-a">Daily calories</FieldLabel>
                <FieldInput id="dm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-p">Protein %</FieldLabel>
                <FieldInput id="dm-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-c">Carb %</FieldLabel>
                <FieldInput id="dm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-f">Fat %</FieldLabel>
                <FieldInput id="dm-f" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "protein" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-w">Weight (kg)</FieldLabel>
                <FieldInput id="dm-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-b">Grams per kg</FieldLabel>
                <FieldInput id="dm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "carb" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-a">Daily calories</FieldLabel>
                <FieldInput id="dm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-c">Carb %</FieldLabel>
                <FieldInput id="dm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fat" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-a">Daily calories</FieldLabel>
                <FieldInput id="dm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-f">Fat %</FieldLabel>
                <FieldInput id="dm-f" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {isPresetMode(config.mode) ? (
            <div>
              <FieldLabel htmlFor="dm-a">Daily calories</FieldLabel>
              <FieldInput id="dm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
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
