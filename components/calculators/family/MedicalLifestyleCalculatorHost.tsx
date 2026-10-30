"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_LIFESTYLE_URL,
  alcoholConsumption,
  medicalSleepCycle,
  smokingImpact,
  stressLevel,
} from "@/lib/calculators/medicalLifestyle";

type LifestyleSlug =
  | "medical-smoking-impact-calculator"
  | "medical-alcohol-consumption-calculator"
  | "medical-sleep-cycle-calculator"
  | "medical-stress-level-calculator";

type Mode = "smoking" | "alcohol" | "sleep" | "stress";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice, addiction treatment, sleep medicine, or mental-health care. Seek qualified clinicians for personal health decisions.";

const CONFIG: Record<LifestyleSlug, Config> = {
  "medical-smoking-impact-calculator": {
    title: "Smoking impact",
    description: `Pack-years ≈ (cigarettes/day ÷ 20) × years; optional annual cost. ${DISCLAIMER}`,
    mode: "smoking",
    aDefault: "10",
    bDefault: "5",
    cDefault: "",
  },
  "medical-alcohol-consumption-calculator": {
    title: "Alcohol consumption",
    description: `UK-style units = volume_ml × ABV% / 1000, then weekly totals. ${DISCLAIMER}`,
    mode: "alcohol",
    aDefault: "175",
    bDefault: "12",
    cDefault: "7",
  },
  "medical-sleep-cycle-calculator": {
    title: "Sleep cycle wake times",
    description: `Suggests wake times from bedtime (HH:MM) using ~90 min cycles. ${DISCLAIMER}`,
    mode: "sleep",
    aDefault: "23:00",
    bDefault: "5",
    cDefault: "",
  },
  "medical-stress-level-calculator": {
    title: "Stress level (self-report)",
    description: `Mean of Likert items 1–5 from CSV — self-report awareness only. ${DISCLAIMER}`,
    mode: "stress",
    aDefault: "2,3,3,2,4",
    bDefault: "",
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

export function MedicalLifestyleCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as LifestyleSlug] ?? CONFIG["medical-smoking-impact-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_LIFESTYLE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_LIFESTYLE_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_LIFESTYLE_URL.C, config.cDefault));

  const num = (n: number, d = 2) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "smoking":
        put(MEDICAL_LIFESTYLE_URL.A, a);
        put(MEDICAL_LIFESTYLE_URL.B, b);
        put(MEDICAL_LIFESTYLE_URL.C, c);
        break;
      case "alcohol":
        put(MEDICAL_LIFESTYLE_URL.A, a);
        put(MEDICAL_LIFESTYLE_URL.B, b);
        put(MEDICAL_LIFESTYLE_URL.C, c);
        break;
      case "sleep":
        put(MEDICAL_LIFESTYLE_URL.A, a);
        put(MEDICAL_LIFESTYLE_URL.B, b);
        break;
      case "stress":
        put(MEDICAL_LIFESTYLE_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "smoking": {
        const cigP = parseNonNegative(a, "Cigarettes/day");
        const yearsP = parseNonNegative(b, "Years");
        if (!cigP.ok) return { error: cigP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        let costPerPack: number | undefined;
        if (c.trim() !== "") {
          const costP = parseNonNegative(c, "Cost per pack");
          if (!costP.ok) return { error: costP.error };
          costPerPack = costP.value;
        }
        const computed = smokingImpact({
          cigPerDay: cigP.value,
          years: yearsP.value,
          costPerPack,
        });
        if ("error" in computed) return { error: computed.error };
        const rows = [
          { label: "Pack-years", value: num(computed.packYears) },
          { label: "Packs/year", value: num(computed.packsPerYear) },
        ];
        if (computed.annualCost != null) {
          rows.push({ label: "Annual cost", value: num(computed.annualCost) });
        }
        return {
          primary: num(computed.packYears),
          primaryLabel: "Pack-years",
          rows,
        };
      }
      case "alcohol": {
        const volP = parsePositive(a, "Volume (mL)");
        const abvP = parsePositive(b, "ABV %");
        const drinksP = parseNonNegative(c, "Drinks/week");
        if (!volP.ok) return { error: volP.error };
        if (!abvP.ok) return { error: abvP.error };
        if (!drinksP.ok) return { error: drinksP.error };
        const computed = alcoholConsumption({
          volumeMl: volP.value,
          abvPct: abvP.value,
          drinksPerWeek: drinksP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.unitsPerWeek),
          primaryLabel: "Units per week",
          rows: [
            { label: "Units/drink", value: num(computed.unitsPerDrink) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "sleep": {
        let cycles: number | undefined;
        if (b.trim() !== "") {
          const cycP = parseFiniteNumber(b, "Cycles");
          if (!cycP.ok) return { error: cycP.error };
          cycles = Math.round(cycP.value);
        }
        const computed = medicalSleepCycle({ bedtime: a, cycles });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.wakeTimes.join(", "),
          primaryLabel: "Suggested wake times",
          rows: [
            { label: "Bedtime", value: a.trim() },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "stress": {
        const computed = stressLevel({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mean),
          primaryLabel: "Mean stress score",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "smoking" ? (
            <>
              <div>
                <FieldLabel htmlFor="ml-cig">Cigarettes per day</FieldLabel>
                <FieldInput id="ml-cig" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ml-years">Years smoked</FieldLabel>
                <FieldInput id="ml-years" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ml-cost">Cost per pack (optional)</FieldLabel>
                <FieldInput id="ml-cost" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "alcohol" ? (
            <>
              <div>
                <FieldLabel htmlFor="ml-vol">Drink volume (mL)</FieldLabel>
                <FieldInput id="ml-vol" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ml-abv">ABV (%)</FieldLabel>
                <FieldInput id="ml-abv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ml-drinks">Drinks per week</FieldLabel>
                <FieldInput id="ml-drinks" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "sleep" ? (
            <>
              <div>
                <FieldLabel htmlFor="ml-bed">Bedtime (HH:MM, 24-hour)</FieldLabel>
                <FieldInput id="ml-bed" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ml-cycles">Cycles (1–8, optional)</FieldLabel>
                <FieldInput id="ml-cycles" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "stress" ? (
            <div>
              <FieldLabel htmlFor="ml-stress">Scores CSV (each 1–5, ≥3 items)</FieldLabel>
              <FieldInput id="ml-stress" value={a} onChange={(ev) => setA(ev.target.value)} />
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
