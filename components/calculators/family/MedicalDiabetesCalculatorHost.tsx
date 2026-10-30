"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_DIABETES_URL,
  bloodSugarConvert,
  carbohydrateCoverage,
  eagFromHba1c,
  hba1cFromEag,
  insulinDose,
  insulinSensitivityFactor,
} from "@/lib/calculators/medicalDiabetes";

type DiabetesSlug =
  | "medical-blood-sugar-converter-mgdl-mmol"
  | "medical-hba1c-calculator"
  | "medical-eag-calculator"
  | "medical-insulin-dose-calculator"
  | "medical-insulin-sensitivity-factor-calculator"
  | "medical-carbohydrate-coverage-calculator";

type Mode = "convert" | "hba1c" | "eag" | "insulin" | "isf" | "carb";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
};

const DISCLAIMER =
  "Educational glucose/insulin arithmetic only — not medical advice, diagnosis, or a substitute for prescribed insulin protocols. Never change insulin without your clinician; seek emergency care for severe hypo/hyperglycemia.";

const CONFIG: Record<DiabetesSlug, Config> = {
  "medical-blood-sugar-converter-mgdl-mmol": {
    title: "Blood sugar converter",
    description: `Convert glucose mg/dL ↔ mmol/L (factor 18). From unit: mgdl or mmol. ${DISCLAIMER}`,
    mode: "convert",
    aDefault: "100",
    bDefault: "mgdl",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "medical-hba1c-calculator": {
    title: "HbA1c from eAG",
    description: `NGSP HbA1c % from eAG mg/dL: A1c = (eAG + 46.7) / 28.7. ${DISCLAIMER}`,
    mode: "hba1c",
    aDefault: "154",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "medical-eag-calculator": {
    title: "eAG from HbA1c",
    description: `eAG mg/dL = 28.7 × A1c − 46.7 (also shows mmol/L). ${DISCLAIMER}`,
    mode: "eag",
    aDefault: "7",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "medical-insulin-dose-calculator": {
    title: "Insulin dose (teaching)",
    description: `Correction + carb bolus units from BG, target, ISF, carbs, and I:C. ${DISCLAIMER}`,
    mode: "insulin",
    aDefault: "180",
    bDefault: "120",
    cDefault: "50",
    rDefault: "45",
    tDefault: "10",
  },
  "medical-insulin-sensitivity-factor-calculator": {
    title: "Insulin sensitivity factor",
    description: `Rule-of-1800 teaching ISF = rule / TDD (default rule 1800). ${DISCLAIMER}`,
    mode: "isf",
    aDefault: "40",
    bDefault: "1800",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "medical-carbohydrate-coverage-calculator": {
    title: "Carbohydrate coverage",
    description: `Carb bolus units = carbs ÷ I:C ratio. ${DISCLAIMER}`,
    mode: "carb",
    aDefault: "60",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
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

export function MedicalDiabetesCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as DiabetesSlug] ?? CONFIG["medical-blood-sugar-converter-mgdl-mmol"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_DIABETES_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_DIABETES_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_DIABETES_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_DIABETES_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_DIABETES_URL.T, config.tDefault));

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
      case "convert":
        put(MEDICAL_DIABETES_URL.A, a);
        put(MEDICAL_DIABETES_URL.B, b);
        break;
      case "hba1c":
      case "eag":
        put(MEDICAL_DIABETES_URL.A, a);
        break;
      case "insulin":
        put(MEDICAL_DIABETES_URL.A, a);
        put(MEDICAL_DIABETES_URL.B, b);
        put(MEDICAL_DIABETES_URL.C, c);
        put(MEDICAL_DIABETES_URL.R, r);
        put(MEDICAL_DIABETES_URL.T, t);
        break;
      case "isf":
        put(MEDICAL_DIABETES_URL.A, a);
        put(MEDICAL_DIABETES_URL.B, b);
        break;
      case "carb":
        put(MEDICAL_DIABETES_URL.A, a);
        put(MEDICAL_DIABETES_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, r, t, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "convert": {
        const valP = parsePositive(a, "Glucose value");
        if (!valP.ok) return { error: valP.error };
        const fromRaw = b.trim().toLowerCase().replace(/[^a-z]/g, "");
        const from =
          fromRaw === "mgdl" || fromRaw === "mg"
            ? ("mgdl" as const)
            : fromRaw === "mmol" || fromRaw === "mmoll"
              ? ("mmol" as const)
              : null;
        if (!from) return { error: "From unit must be mgdl or mmol." };
        const computed = bloodSugarConvert({ value: valP.value, from });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.mgdl, 1)} mg/dL · ${num(computed.mmol, 2)} mmol/L`,
          primaryLabel: "Converted glucose",
          rows: [
            { label: "mg/dL", value: num(computed.mgdl, 1) },
            { label: "mmol/L", value: num(computed.mmol, 2) },
          ],
        };
      }
      case "hba1c": {
        const eagP = parsePositive(a, "eAG (mg/dL)");
        if (!eagP.ok) return { error: eagP.error };
        const computed = hba1cFromEag({ eagMgdl: eagP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.hba1cPct)}%`,
          primaryLabel: "Estimated HbA1c",
          rows: [{ label: "Input eAG", value: `${num(eagP.value, 0)} mg/dL` }],
        };
      }
      case "eag": {
        const a1cP = parsePositive(a, "HbA1c %");
        if (!a1cP.ok) return { error: a1cP.error };
        const computed = eagFromHba1c({ hba1cPct: a1cP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.eagMgdl, 0)} mg/dL`,
          primaryLabel: "Estimated average glucose",
          rows: [
            { label: "eAG mmol/L", value: num(computed.eagMmol, 2) },
            { label: "Input A1c", value: `${num(a1cP.value)}%` },
          ],
        };
      }
      case "insulin": {
        const curP = parsePositive(a, "Current BG");
        const tgtP = parsePositive(b, "Target BG");
        const isfP = parsePositive(c, "ISF");
        const carbP = parseNonNegative(r, "Carbs (g)");
        const icrP = parsePositive(t, "I:C ratio");
        if (!curP.ok) return { error: curP.error };
        if (!tgtP.ok) return { error: tgtP.error };
        if (!isfP.ok) return { error: isfP.error };
        if (!carbP.ok) return { error: carbP.error };
        if (!icrP.ok) return { error: icrP.error };
        const computed = insulinDose({
          currentBg: curP.value,
          targetBg: tgtP.value,
          isf: isfP.value,
          carbsG: carbP.value,
          icr: icrP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.totalU, 2)} U`,
          primaryLabel: "Total teaching bolus",
          rows: [
            { label: "Correction", value: `${num(computed.correctionU, 2)} U` },
            { label: "Carb bolus", value: `${num(computed.carbU, 2)} U` },
          ],
        };
      }
      case "isf": {
        const tddP = parsePositive(a, "TDD");
        if (!tddP.ok) return { error: tddP.error };
        let rule: number | undefined;
        if (b.trim() !== "") {
          const ruleP = parsePositive(b, "Rule");
          if (!ruleP.ok) return { error: ruleP.error };
          rule = ruleP.value;
        }
        const computed = insulinSensitivityFactor({ tdd: tddP.value, rule });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.isf, 1),
          primaryLabel: "ISF (mg/dL per unit)",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "carb": {
        const carbP = parseNonNegative(a, "Carbs (g)");
        const icrP = parsePositive(b, "I:C ratio");
        if (!carbP.ok) return { error: carbP.error };
        if (!icrP.ok) return { error: icrP.error };
        const computed = carbohydrateCoverage({ carbsG: carbP.value, icr: icrP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.units, 2)} U`,
          primaryLabel: "Carb coverage units",
          rows: [{ label: "I:C", value: `1:${num(icrP.value, 1)}` }],
        };
      }
    }
  }, [config.mode, a, b, c, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "convert" ? (
            <>
              <div>
                <FieldLabel htmlFor="md-val">Glucose value</FieldLabel>
                <FieldInput id="md-val" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-from">From unit (mgdl or mmol)</FieldLabel>
                <FieldInput id="md-from" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "hba1c" ? (
            <div>
              <FieldLabel htmlFor="md-eag">eAG (mg/dL)</FieldLabel>
              <FieldInput id="md-eag" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "eag" ? (
            <div>
              <FieldLabel htmlFor="md-a1c">HbA1c (%)</FieldLabel>
              <FieldInput id="md-a1c" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "insulin" ? (
            <>
              <div>
                <FieldLabel htmlFor="md-cur">Current BG (mg/dL)</FieldLabel>
                <FieldInput id="md-cur" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-tgt">Target BG (mg/dL)</FieldLabel>
                <FieldInput id="md-tgt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-isf">ISF (mg/dL per unit)</FieldLabel>
                <FieldInput id="md-isf" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-carbs">Carbs (g)</FieldLabel>
                <FieldInput id="md-carbs" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-icr">I:C ratio (g carb per unit)</FieldLabel>
                <FieldInput id="md-icr" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "isf" ? (
            <>
              <div>
                <FieldLabel htmlFor="md-tdd">Total daily dose (units)</FieldLabel>
                <FieldInput id="md-tdd" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-rule">Rule (optional, default 1800)</FieldLabel>
                <FieldInput id="md-rule" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "carb" ? (
            <>
              <div>
                <FieldLabel htmlFor="md-cg">Carbs (g)</FieldLabel>
                <FieldInput id="md-cg" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="md-cicr">I:C ratio (g carb per unit)</FieldLabel>
                <FieldInput id="md-cicr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
