"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  DIET_MICRO_URL,
  dietCalciumIntake,
  dietElectrolyteBalance,
  dietIronIntake,
  dietMineralIntake,
  dietVitaminD,
  dietVitaminIntake,
} from "@/lib/calculators/dietMicros";

type MicroSlug =
  | "diet-vitamin-intake-calculator"
  | "diet-mineral-intake-calculator"
  | "diet-iron-intake-calculator"
  | "diet-calcium-intake-calculator"
  | "diet-vitamin-d-requirement-calculator"
  | "diet-electrolyte-balance-calculator";

type Mode = "vitamin" | "mineral" | "iron" | "calcium" | "vitaminD" | "electrolyte";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Wellness literacy only — not medical advice, lab interpretation, deficiency diagnosis, or supplementation dosing. Discuss personal micronutrient needs with a clinician.";

const CONFIG: Record<MicroSlug, Config> = {
  "diet-vitamin-intake-calculator": {
    title: "Vitamin intake vs RDA",
    description: `% of RDA from intake and reference amount (same units). ${DISCLAIMER}`,
    mode: "vitamin",
    aDefault: "60",
    bDefault: "90",
    cDefault: "vitamin C",
  },
  "diet-mineral-intake-calculator": {
    title: "Mineral intake vs RDA",
    description: `% of RDA from intake and reference amount (mg). ${DISCLAIMER}`,
    mode: "mineral",
    aDefault: "300",
    bDefault: "400",
    cDefault: "",
  },
  "diet-iron-intake-calculator": {
    title: "Iron intake",
    description: `Compares iron intake (mg) to a common sex-based teaching RDA. ${DISCLAIMER}`,
    mode: "iron",
    aDefault: "12",
    bDefault: "female",
    cDefault: "",
  },
  "diet-calcium-intake-calculator": {
    title: "Calcium intake",
    description: `Compares calcium intake (mg) to age-banded teaching RDA. ${DISCLAIMER}`,
    mode: "calcium",
    aDefault: "900",
    bDefault: "40",
    cDefault: "",
  },
  "diet-vitamin-d-requirement-calculator": {
    title: "Vitamin D requirement",
    description: `Age-based IU teaching target; optional daily IU intake for % RDA. ${DISCLAIMER}`,
    mode: "vitaminD",
    aDefault: "45",
    bDefault: "600",
    cDefault: "",
  },
  "diet-electrolyte-balance-calculator": {
    title: "Electrolyte balance (Na:K)",
    description: `Teaching sodium-to-potassium ratio from daily mg intakes. ${DISCLAIMER}`,
    mode: "electrolyte",
    aDefault: "2300",
    bDefault: "3400",
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

export function DietMicrosCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MicroSlug] ?? CONFIG["diet-vitamin-intake-calculator"];
  const [a, setA] = useState(useLoanInitialInput(DIET_MICRO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(DIET_MICRO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(DIET_MICRO_URL.C, config.cDefault));

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
    put(DIET_MICRO_URL.A, a);
    put(DIET_MICRO_URL.B, b);
    if (config.mode === "vitamin") put(DIET_MICRO_URL.C, c);
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "vitamin": {
        const intakeP = parseFiniteNumber(a, "Intake");
        const rdaP = parsePositive(b, "RDA");
        if (!intakeP.ok) return { error: intakeP.error };
        if (!rdaP.ok) return { error: rdaP.error };
        const computed = dietVitaminIntake({
          intakeMg: intakeP.value,
          rdaMg: rdaP.value,
          name: c.trim() || undefined,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percentRda)}%`,
          primaryLabel: `% of RDA (${computed.name})`,
          rows: [{ label: "Name", value: computed.name }],
        };
      }
      case "mineral": {
        const intakeP = parseFiniteNumber(a, "Intake");
        const rdaP = parsePositive(b, "RDA");
        if (!intakeP.ok) return { error: intakeP.error };
        if (!rdaP.ok) return { error: rdaP.error };
        const computed = dietMineralIntake({ intakeMg: intakeP.value, rdaMg: rdaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percentRda)}%`,
          primaryLabel: "% of RDA",
          rows: [{ label: "Name", value: computed.name }],
        };
      }
      case "iron": {
        const intakeP = parseFiniteNumber(a, "Iron intake");
        if (!intakeP.ok) return { error: intakeP.error };
        const computed = dietIronIntake({ intakeMg: intakeP.value, sex: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percentRda)}%`,
          primaryLabel: "% of teaching RDA",
          rows: [
            { label: "Intake (mg)", value: num(computed.intakeMg) },
            { label: "RDA (mg)", value: num(computed.rdaMg, 0) },
          ],
        };
      }
      case "calcium": {
        const intakeP = parseFiniteNumber(a, "Calcium intake");
        const ageP = parsePositive(b, "Age");
        if (!intakeP.ok) return { error: intakeP.error };
        if (!ageP.ok) return { error: ageP.error };
        const computed = dietCalciumIntake({ intakeMg: intakeP.value, age: ageP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percentRda)}%`,
          primaryLabel: "% of teaching RDA",
          rows: [
            { label: "Intake (mg)", value: num(computed.intakeMg) },
            { label: "RDA (mg)", value: num(computed.rdaMg, 0) },
          ],
        };
      }
      case "vitaminD": {
        const ageP = parsePositive(a, "Age");
        if (!ageP.ok) return { error: ageP.error };
        let iuPerDay: number | undefined;
        if (b.trim() !== "") {
          const iuP = parseFiniteNumber(b, "IU per day");
          if (!iuP.ok) return { error: iuP.error };
          iuPerDay = iuP.value;
        }
        const computed = dietVitaminD({ age: ageP.value, iuPerDay });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.recommendedIu, 0)} IU`,
          primaryLabel: "Recommended IU (teaching)",
          rows: [
            { label: "Intake IU", value: num(computed.intakeIu, 0) },
            { label: "% of RDA", value: num(computed.percentRda) },
          ],
        };
      }
      case "electrolyte": {
        const naP = parseFiniteNumber(a, "Sodium");
        const kP = parseFiniteNumber(b, "Potassium");
        if (!naP.ok) return { error: naP.error };
        if (!kP.ok) return { error: kP.error };
        const computed = dietElectrolyteBalance({ sodiumMg: naP.value, potassiumMg: kP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: Number.isFinite(computed.naKRatio) ? num(computed.naKRatio, 2) : "∞",
          primaryLabel: "Na:K ratio",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "vitamin" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-intake">Intake (same units as RDA)</FieldLabel>
                <FieldInput id="dm-intake" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-rda">RDA amount</FieldLabel>
                <FieldInput id="dm-rda" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-name">Vitamin name (optional)</FieldLabel>
                <FieldInput id="dm-name" value={c} onChange={(ev) => setC(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "mineral" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-min-intake">Intake (mg)</FieldLabel>
                <FieldInput id="dm-min-intake" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-min-rda">RDA (mg)</FieldLabel>
                <FieldInput id="dm-min-rda" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "iron" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-iron">Iron intake (mg)</FieldLabel>
                <FieldInput id="dm-iron" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-sex">Sex (male or female)</FieldLabel>
                <FieldInput id="dm-sex" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "calcium" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-ca">Calcium intake (mg)</FieldLabel>
                <FieldInput id="dm-ca" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-age">Age (years)</FieldLabel>
                <FieldInput id="dm-age" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "vitaminD" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-vd-age">Age (years)</FieldLabel>
                <FieldInput id="dm-vd-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-vd-iu">IU per day (optional)</FieldLabel>
                <FieldInput id="dm-vd-iu" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "electrolyte" ? (
            <>
              <div>
                <FieldLabel htmlFor="dm-na">Sodium (mg/day)</FieldLabel>
                <FieldInput id="dm-na" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="dm-k">Potassium (mg/day)</FieldLabel>
                <FieldInput id="dm-k" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
