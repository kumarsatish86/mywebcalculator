"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_PEDS_URL,
  babyWeightGain,
  childBmi,
  growthPercentile,
  headCircumference,
  pediatricDosage,
} from "@/lib/calculators/medicalPediatrics";

type PedsSlug =
  | "medical-child-bmi-calculator"
  | "medical-growth-percentile-calculator"
  | "medical-pediatric-dosage-calculator"
  | "medical-baby-weight-gain-calculator"
  | "medical-head-circumference-calculator";

type Mode = "bmi" | "percentile" | "dosage" | "weightGain" | "hc";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Educational pediatrics arithmetic only — not medical advice, growth diagnosis, dosing orders, or emergency care. Verify charts, labels, and protocols with qualified clinicians; never use this tool for patient management.";

const CONFIG: Record<PedsSlug, Config> = {
  "medical-child-bmi-calculator": {
    title: "Child BMI",
    description: `BMI from weight (kg) and height (cm) — number only, not a percentile chart. ${DISCLAIMER}`,
    mode: "bmi",
    aDefault: "20",
    bDefault: "120",
    cDefault: "",
  },
  "medical-growth-percentile-calculator": {
    title: "Growth percentile (from z)",
    description: `Approximate percentile from a z-score via normal CDF — not CDC/WHO lookup. ${DISCLAIMER}`,
    mode: "percentile",
    aDefault: "0",
    bDefault: "",
    cDefault: "",
  },
  "medical-pediatric-dosage-calculator": {
    title: "Pediatric dosage",
    description: `mg/dose = weight × mg/kg; optional doses/day for daily total. ${DISCLAIMER}`,
    mode: "dosage",
    aDefault: "15",
    bDefault: "10",
    cDefault: "3",
  },
  "medical-baby-weight-gain-calculator": {
    title: "Baby weight gain",
    description: `Gain and g/day from birth weight, current weight, and age in days. ${DISCLAIMER}`,
    mode: "weightGain",
    aDefault: "3.2",
    bDefault: "4.5",
    cDefault: "60",
  },
  "medical-head-circumference-calculator": {
    title: "Head circumference z-score",
    description: `Z-score vs your reference mean and SD (cm). ${DISCLAIMER}`,
    mode: "hc",
    aDefault: "45",
    bDefault: "44",
    cDefault: "1.5",
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

export function MedicalPediatricsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PedsSlug] ?? CONFIG["medical-child-bmi-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_PEDS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_PEDS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_PEDS_URL.C, config.cDefault));

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
      case "percentile":
        put(MEDICAL_PEDS_URL.A, a);
        break;
      case "bmi":
        put(MEDICAL_PEDS_URL.A, a);
        put(MEDICAL_PEDS_URL.B, b);
        break;
      case "dosage":
      case "weightGain":
      case "hc":
        put(MEDICAL_PEDS_URL.A, a);
        put(MEDICAL_PEDS_URL.B, b);
        put(MEDICAL_PEDS_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "bmi": {
        const wP = parsePositive(a, "Weight (kg)");
        const hP = parsePositive(b, "Height (cm)");
        if (!wP.ok) return { error: wP.error };
        if (!hP.ok) return { error: hP.error };
        const computed = childBmi({ weightKg: wP.value, heightCm: hP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.bmi),
          primaryLabel: "BMI",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "percentile": {
        const zP = parseFiniteNumber(a, "Z-score");
        if (!zP.ok) return { error: zP.error };
        const computed = growthPercentile({ zScore: zP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.percentile, 1),
          primaryLabel: "Approximate percentile",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "dosage": {
        const wP = parsePositive(a, "Weight (kg)");
        const mgP = parsePositive(b, "mg/kg");
        if (!wP.ok) return { error: wP.error };
        if (!mgP.ok) return { error: mgP.error };
        let dosesPerDay: number | undefined;
        if (c.trim() !== "") {
          const dP = parsePositive(c, "Doses/day");
          if (!dP.ok) return { error: dP.error };
          dosesPerDay = dP.value;
        }
        const computed = pediatricDosage({
          weightKg: wP.value,
          mgPerKg: mgP.value,
          dosesPerDay,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.doseMg)} mg`,
          primaryLabel: "Dose per administration",
          rows: [{ label: "Daily total (mg)", value: num(computed.dailyMg) }],
        };
      }
      case "weightGain": {
        const birthP = parsePositive(a, "Birth weight (kg)");
        const currP = parsePositive(b, "Current weight (kg)");
        const ageP = parsePositive(c, "Age (days)");
        if (!birthP.ok) return { error: birthP.error };
        if (!currP.ok) return { error: currP.error };
        if (!ageP.ok) return { error: ageP.error };
        const computed = babyWeightGain({
          birthKg: birthP.value,
          currentKg: currP.value,
          ageDays: ageP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.gainKg)} kg`,
          primaryLabel: "Weight gain",
          rows: [{ label: "g/day", value: num(computed.gPerDay) }],
        };
      }
      case "hc": {
        const hcP = parsePositive(a, "HC (cm)");
        const meanP = parsePositive(b, "Reference mean (cm)");
        const sdP = parsePositive(c, "Reference SD (cm)");
        if (!hcP.ok) return { error: hcP.error };
        if (!meanP.ok) return { error: meanP.error };
        if (!sdP.ok) return { error: sdP.error };
        const computed = headCircumference({
          hcCm: hcP.value,
          meanCm: meanP.value,
          sdCm: sdP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.zScore),
          primaryLabel: "Z-score",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "bmi" ? (
            <>
              <div>
                <FieldLabel htmlFor="mped-wt">Weight (kg)</FieldLabel>
                <FieldInput
                  id="mped-wt"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-ht">Height (cm)</FieldLabel>
                <FieldInput
                  id="mped-ht"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "percentile" ? (
            <div>
              <FieldLabel htmlFor="mped-z">Z-score</FieldLabel>
              <FieldInput
                id="mped-z"
                value={a}
                onChange={(ev) => setA(ev.target.value)}
                inputMode="decimal"
              />
            </div>
          ) : null}

          {config.mode === "dosage" ? (
            <>
              <div>
                <FieldLabel htmlFor="mped-dose-wt">Weight (kg)</FieldLabel>
                <FieldInput
                  id="mped-dose-wt"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-mgkg">mg/kg per dose</FieldLabel>
                <FieldInput
                  id="mped-mgkg"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-doses">Doses/day (optional)</FieldLabel>
                <FieldInput
                  id="mped-doses"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
            </>
          ) : null}

          {config.mode === "weightGain" ? (
            <>
              <div>
                <FieldLabel htmlFor="mped-birth">Birth weight (kg)</FieldLabel>
                <FieldInput
                  id="mped-birth"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-curr">Current weight (kg)</FieldLabel>
                <FieldInput
                  id="mped-curr"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-age">Age (days)</FieldLabel>
                <FieldInput
                  id="mped-age"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
            </>
          ) : null}

          {config.mode === "hc" ? (
            <>
              <div>
                <FieldLabel htmlFor="mped-hc">Head circumference (cm)</FieldLabel>
                <FieldInput
                  id="mped-hc"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-mean">Reference mean (cm)</FieldLabel>
                <FieldInput
                  id="mped-mean"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mped-sd">Reference SD (cm)</FieldLabel>
                <FieldInput
                  id="mped-sd"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
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
