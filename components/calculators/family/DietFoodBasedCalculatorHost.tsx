"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_FOOD_URL,
  dietCaloriesInFood,
  dietFastFoodCalories,
  dietIngredientNutrition,
  dietRecipeNutrition,
  dietRestaurantMeal,
} from "@/lib/calculators/dietFoodBased";

type FoodSlug =
  | "diet-calories-in-food-calculator"
  | "diet-fast-food-calorie-calculator"
  | "diet-restaurant-meal-calorie-calculator"
  | "diet-recipe-nutrition-calculator"
  | "diet-ingredient-nutrition-calculator";

type Mode = "food" | "fastFood" | "restaurant" | "recipe" | "ingredient";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  pDefault: string;
  fDefault: string;
  nDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice or a substitute for labeled nutrition facts. Estimates depend on the numbers you enter.";

const CONFIG: Record<FoodSlug, Config> = {
  "diet-calories-in-food-calculator": {
    title: "Calories in food",
    description: `kcal = (grams ÷ 100) × kcal per 100 g. ${DISCLAIMER}`,
    mode: "food",
    aDefault: "150",
    bDefault: "250",
    cDefault: "",
    pDefault: "",
    fDefault: "",
    nDefault: "",
  },
  "diet-fast-food-calorie-calculator": {
    title: "Fast food calories",
    description: `Sum item calories entered as CSV numbers. ${DISCLAIMER}`,
    mode: "fastFood",
    aDefault: "540,220,150",
    bDefault: "",
    cDefault: "",
    pDefault: "",
    fDefault: "",
    nDefault: "",
  },
  "diet-restaurant-meal-calorie-calculator": {
    title: "Restaurant meal calories",
    description: `Sum entrée + side + drink kcal. ${DISCLAIMER}`,
    mode: "restaurant",
    aDefault: "650",
    bDefault: "200",
    cDefault: "150",
    pDefault: "",
    fDefault: "",
    nDefault: "",
  },
  "diet-recipe-nutrition-calculator": {
    title: "Recipe nutrition",
    description: `Divide total kcal and macros by servings. ${DISCLAIMER}`,
    mode: "recipe",
    aDefault: "2400",
    bDefault: "",
    cDefault: "220",
    pDefault: "120",
    fDefault: "80",
    nDefault: "4",
  },
  "diet-ingredient-nutrition-calculator": {
    title: "Ingredient nutrition",
    description: `Scale kcal and protein from per-100 g values by grams used. ${DISCLAIMER}`,
    mode: "ingredient",
    aDefault: "100",
    bDefault: "165",
    cDefault: "",
    pDefault: "31",
    fDefault: "",
    nDefault: "",
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

export function DietFoodBasedCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as FoodSlug] ?? CONFIG["diet-calories-in-food-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_FOOD_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_FOOD_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(DIET_FOOD_URL.C, config.cDefault));
  const [p, setP] = useState(useLoanInitialInput(DIET_FOOD_URL.P, config.pDefault));
  const [f, setF] = useState(useLoanInitialInput(DIET_FOOD_URL.F, config.fDefault));
  const [n, setN] = useState(useLoanInitialInput(DIET_FOOD_URL.N, config.nDefault));

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
      case "food":
        put(DIET_FOOD_URL.A, a);
        put(DIET_FOOD_URL.B, b);
        break;
      case "fastFood":
        put(DIET_FOOD_URL.A, a);
        break;
      case "restaurant":
        put(DIET_FOOD_URL.A, a);
        put(DIET_FOOD_URL.B, b);
        put(DIET_FOOD_URL.C, c);
        break;
      case "recipe":
        put(DIET_FOOD_URL.A, a);
        put(DIET_FOOD_URL.P, p);
        put(DIET_FOOD_URL.C, c);
        put(DIET_FOOD_URL.F, f);
        put(DIET_FOOD_URL.N, n);
        break;
      case "ingredient":
        put(DIET_FOOD_URL.A, a);
        put(DIET_FOOD_URL.B, b);
        put(DIET_FOOD_URL.P, p);
        break;
    }
    return out;
  }, [a, b, c, p, f, n, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, p, f, n]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "food": {
        const gP = parseFiniteNumber(a, "Grams");
        const densP = parseFiniteNumber(b, "kcal per 100 g");
        if (!gP.ok) return { error: gP.error };
        if (!densP.ok) return { error: densP.error };
        const computed = dietCaloriesInFood({ grams: gP.value, kcalPer100g: densP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.kcal, 0)} kcal`,
          primaryLabel: "Calories",
          rows: [
            { label: "Grams", value: num(gP.value) },
            { label: "kcal/100 g", value: num(densP.value) },
          ],
        };
      }
      case "fastFood": {
        const computed = dietFastFoodCalories({ itemsCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.totalKcal, 0)} kcal`,
          primaryLabel: "Total calories",
          rows: [{ label: "Items", value: String(computed.items) }],
        };
      }
      case "restaurant": {
        const eP = parseFiniteNumber(a, "Entrée kcal");
        const sP = parseFiniteNumber(b, "Side kcal");
        const dP = parseFiniteNumber(c, "Drink kcal");
        if (!eP.ok) return { error: eP.error };
        if (!sP.ok) return { error: sP.error };
        if (!dP.ok) return { error: dP.error };
        const computed = dietRestaurantMeal({
          entreeKcal: eP.value,
          sideKcal: sP.value,
          drinkKcal: dP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.totalKcal, 0)} kcal`,
          primaryLabel: "Meal total",
          rows: [
            { label: "Entrée", value: num(eP.value, 0) },
            { label: "Side", value: num(sP.value, 0) },
            { label: "Drink", value: num(dP.value, 0) },
          ],
        };
      }
      case "recipe": {
        const kcalP = parseFiniteNumber(a, "Total kcal");
        const protP = parseFiniteNumber(p, "Protein");
        const carbP = parseFiniteNumber(c, "Carbs");
        const fatP = parseFiniteNumber(f, "Fat");
        const servP = parsePositive(n, "Servings");
        if (!kcalP.ok) return { error: kcalP.error };
        if (!protP.ok) return { error: protP.error };
        if (!carbP.ok) return { error: carbP.error };
        if (!fatP.ok) return { error: fatP.error };
        if (!servP.ok) return { error: servP.error };
        const computed = dietRecipeNutrition({
          totalKcal: kcalP.value,
          proteinG: protP.value,
          carbG: carbP.value,
          fatG: fatP.value,
          servings: servP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.perServingKcal, 0)} kcal`,
          primaryLabel: "Per serving",
          rows: [
            { label: "Protein (g)", value: num(computed.perServingProteinG) },
            { label: "Carbs (g)", value: num(computed.perServingCarbG) },
            { label: "Fat (g)", value: num(computed.perServingFatG) },
          ],
        };
      }
      case "ingredient": {
        const gP = parseFiniteNumber(a, "Grams");
        const densP = parseFiniteNumber(b, "kcal per 100 g");
        const protP = parseFiniteNumber(p, "Protein per 100 g");
        if (!gP.ok) return { error: gP.error };
        if (!densP.ok) return { error: densP.error };
        if (!protP.ok) return { error: protP.error };
        const computed = dietIngredientNutrition({
          grams: gP.value,
          kcalPer100g: densP.value,
          proteinPer100g: protP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.kcal, 0)} kcal`,
          primaryLabel: "Ingredient calories",
          rows: [{ label: "Protein (g)", value: num(computed.proteinG) }],
        };
      }
    }
  }, [config.mode, a, b, c, p, f, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "food" ? (
            <>
              <div>
                <FieldLabel htmlFor="dfb-g">Grams</FieldLabel>
                <FieldInput id="dfb-g" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-dens">kcal per 100 g</FieldLabel>
                <FieldInput id="dfb-dens" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fastFood" ? (
            <div>
              <FieldLabel htmlFor="dfb-csv">Item calories (CSV)</FieldLabel>
              <FieldInput id="dfb-csv" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "restaurant" ? (
            <>
              <div>
                <FieldLabel htmlFor="dfb-entree">Entrée (kcal)</FieldLabel>
                <FieldInput id="dfb-entree" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-side">Side (kcal)</FieldLabel>
                <FieldInput id="dfb-side" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-drink">Drink (kcal)</FieldLabel>
                <FieldInput id="dfb-drink" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "recipe" ? (
            <>
              <div>
                <FieldLabel htmlFor="dfb-rkcal">Total recipe kcal</FieldLabel>
                <FieldInput id="dfb-rkcal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-rp">Total protein (g)</FieldLabel>
                <FieldInput id="dfb-rp" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-rc">Total carbs (g)</FieldLabel>
                <FieldInput id="dfb-rc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-rf">Total fat (g)</FieldLabel>
                <FieldInput id="dfb-rf" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-serv">Servings</FieldLabel>
                <FieldInput id="dfb-serv" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ingredient" ? (
            <>
              <div>
                <FieldLabel htmlFor="dfb-ig">Grams</FieldLabel>
                <FieldInput id="dfb-ig" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-ik">kcal per 100 g</FieldLabel>
                <FieldInput id="dfb-ik" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dfb-ip">Protein per 100 g</FieldLabel>
                <FieldInput id="dfb-ip" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
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
