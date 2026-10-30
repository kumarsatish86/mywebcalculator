"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_ONCOLOGY_URL,
  cancerRiskBasic,
  chemotherapyDosage,
  tumorGrowth,
} from "@/lib/calculators/medicalOncology";

type OncoSlug =
  | "medical-cancer-risk-calculator-basic"
  | "medical-tumor-growth-calculator"
  | "medical-chemotherapy-dosage-calculator";

type Mode = "risk" | "tumor" | "chemo";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const DISCLAIMER =
  "Educational oncology-adjacent arithmetic only — not a cancer diagnosis, screening tool, or treatment plan. Always defer dosing and care decisions to oncology teams and pharmacists.";

const CONFIG: Record<OncoSlug, Config> = {
  "medical-cancer-risk-calculator-basic": {
    title: "Cancer risk index (basic)",
    description: `Relative teaching index from age and 0/1 lifestyle flags. ${DISCLAIMER}`,
    mode: "risk",
    aDefault: "50",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
  },
  "medical-tumor-growth-calculator": {
    title: "Tumor growth (doubling)",
    description: `Idealized V = V₀ × 2^(t/Td). ${DISCLAIMER}`,
    mode: "tumor",
    aDefault: "1",
    bDefault: "10",
    cDefault: "10",
    rDefault: "",
  },
  "medical-chemotherapy-dosage-calculator": {
    title: "Chemotherapy dosage (BSA)",
    description: `Dose = mg/m² × Mosteller BSA. ${DISCLAIMER}`,
    mode: "chemo",
    aDefault: "100",
    bDefault: "70",
    cDefault: "170",
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

function parseFlag01(raw: string, label: string) {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  if (p.value !== 0 && p.value !== 1) return { ok: false as const, error: `${label} must be 0 or 1.` };
  return { ok: true as const, value: p.value };
}

export function MedicalOncologyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as OncoSlug] ?? CONFIG["medical-cancer-risk-calculator-basic"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_ONCOLOGY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_ONCOLOGY_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_ONCOLOGY_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_ONCOLOGY_URL.R, config.rDefault));

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
      case "risk":
        put(MEDICAL_ONCOLOGY_URL.A, a);
        put(MEDICAL_ONCOLOGY_URL.B, b);
        put(MEDICAL_ONCOLOGY_URL.C, c);
        put(MEDICAL_ONCOLOGY_URL.R, r);
        break;
      case "tumor":
      case "chemo":
        put(MEDICAL_ONCOLOGY_URL.A, a);
        put(MEDICAL_ONCOLOGY_URL.B, b);
        put(MEDICAL_ONCOLOGY_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "risk": {
        const ageP = parsePositive(a, "Age");
        const smokeP = parseFlag01(b, "Smoke");
        const famP = parseFlag01(c, "Family history");
        const obP = parseFlag01(r, "Obesity flag");
        if (!ageP.ok) return { error: ageP.error };
        if (!smokeP.ok) return { error: smokeP.error };
        if (!famP.ok) return { error: famP.error };
        if (!obP.ok) return { error: obP.error };
        const computed = cancerRiskBasic({
          age: ageP.value,
          smoke: smokeP.value,
          familyHistory: famP.value,
          obesity: obP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.index),
          primaryLabel: "Relative index",
          rows: [
            { label: "Band", value: computed.band },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "tumor": {
        const v0P = parsePositive(a, "V₀");
        const tdP = parsePositive(b, "Doubling time");
        const tP = parseNonNegative(c, "Time t");
        if (!v0P.ok) return { error: v0P.error };
        if (!tdP.ok) return { error: tdP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = tumorGrowth({
          v0: v0P.value,
          doublingDays: tdP.value,
          tDays: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.volume, 4),
          primaryLabel: "Estimated volume",
          rows: [
            { label: "V₀", value: num(v0P.value, 4) },
            { label: "Doubling days", value: num(tdP.value) },
            { label: "t (days)", value: num(tP.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "chemo": {
        const doseP = parsePositive(a, "mg/m²");
        const wtP = parsePositive(b, "Weight");
        const htP = parsePositive(c, "Height");
        if (!doseP.ok) return { error: doseP.error };
        if (!wtP.ok) return { error: wtP.error };
        if (!htP.ok) return { error: htP.error };
        const computed = chemotherapyDosage({
          mgPerM2: doseP.value,
          weightKg: wtP.value,
          heightCm: htP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.doseMg)} mg`,
          primaryLabel: "Teaching dose",
          rows: [
            { label: "BSA (Mosteller)", value: `${num(computed.bsa, 3)} m²` },
            { label: "mg/m²", value: num(doseP.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "risk" ? (
            <>
              <div>
                <FieldLabel htmlFor="mo-age">Age (years)</FieldLabel>
                <FieldInput id="mo-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-smoke">Smoke (0 or 1)</FieldLabel>
                <FieldInput id="mo-smoke" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-fam">Family history (0 or 1)</FieldLabel>
                <FieldInput id="mo-fam" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-ob">Obesity flag (0 or 1)</FieldLabel>
                <FieldInput id="mo-ob" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "tumor" ? (
            <>
              <div>
                <FieldLabel htmlFor="mo-v0">Initial volume V₀</FieldLabel>
                <FieldInput id="mo-v0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-td">Doubling time (days)</FieldLabel>
                <FieldInput id="mo-td" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-t">Elapsed time t (days)</FieldLabel>
                <FieldInput id="mo-t" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "chemo" ? (
            <>
              <div>
                <FieldLabel htmlFor="mo-mg">Dose intensity (mg/m²)</FieldLabel>
                <FieldInput id="mo-mg" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-wt">Weight (kg)</FieldLabel>
                <FieldInput id="mo-wt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mo-ht">Height (cm)</FieldLabel>
                <FieldInput id="mo-ht" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
