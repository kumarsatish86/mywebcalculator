"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_NEURO_URL,
  gad7Score,
  glasgowComaScale,
  phq9Score,
  strokeRisk,
} from "@/lib/calculators/medicalNeurology";

type NeuroSlug =
  | "medical-glasgow-coma-scale-calculator"
  | "medical-phq-9-depression-score-calculator"
  | "medical-gad-7-anxiety-score-calculator"
  | "medical-stroke-risk-calculator";

type Mode = "gcs" | "phq9" | "gad7" | "stroke";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  eDefault: string;
  vDefault: string;
  mDefault: string;
};

const DISCLAIMER =
  "Educational screening/neurology math only — not medical advice, diagnosis, mental-health treatment, or stroke care. High or concerning scores require a qualified clinician; seek emergency care for acute stroke symptoms.";

const CONFIG: Record<NeuroSlug, Config> = {
  "medical-glasgow-coma-scale-calculator": {
    title: "Glasgow Coma Scale",
    description: `GCS = Eye (1–4) + Verbal (1–5) + Motor (1–6). ${DISCLAIMER}`,
    mode: "gcs",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    eDefault: "4",
    vDefault: "5",
    mDefault: "6",
  },
  "medical-phq-9-depression-score-calculator": {
    title: "PHQ-9 depression score",
    description: `Sum of 9 items 0–3, or one total 0–27 (CSV). Screening teaching bands only. ${DISCLAIMER}`,
    mode: "phq9",
    aDefault: "0,0,0,0,0,0,0,0,0",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    eDefault: "",
    vDefault: "",
    mDefault: "",
  },
  "medical-gad-7-anxiety-score-calculator": {
    title: "GAD-7 anxiety score",
    description: `Sum of 7 items 0–3, or one total 0–21 (CSV). Screening teaching bands only. ${DISCLAIMER}`,
    mode: "gad7",
    aDefault: "0,0,0,0,0,0,0",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    eDefault: "",
    vDefault: "",
    mDefault: "",
  },
  "medical-stroke-risk-calculator": {
    title: "Stroke risk points (teaching)",
    description: `Simplified relative points from age and binary risks — not CHA₂DS₂-VASc or a validated model. ${DISCLAIMER}`,
    mode: "stroke",
    aDefault: "60",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    eDefault: "0",
    vDefault: "",
    mDefault: "",
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

function parseBit(raw: string, label: string) {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: Math.round(p.value) };
}

function parseIntField(raw: string, label: string) {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: Math.round(p.value) };
}

export function MedicalNeurologyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as NeuroSlug] ?? CONFIG["medical-glasgow-coma-scale-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.T, config.tDefault));
  const [e, setE] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.E, config.eDefault));
  const [v, setV] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.V, config.vDefault));
  const [m, setM] = useState(useLoanInitialInput(MEDICAL_NEURO_URL.M, config.mDefault));

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "gcs":
        put(MEDICAL_NEURO_URL.E, e);
        put(MEDICAL_NEURO_URL.V, v);
        put(MEDICAL_NEURO_URL.M, m);
        break;
      case "phq9":
      case "gad7":
        put(MEDICAL_NEURO_URL.A, a);
        break;
      case "stroke":
        put(MEDICAL_NEURO_URL.A, a);
        put(MEDICAL_NEURO_URL.B, b);
        put(MEDICAL_NEURO_URL.C, c);
        put(MEDICAL_NEURO_URL.R, r);
        put(MEDICAL_NEURO_URL.T, t);
        put(MEDICAL_NEURO_URL.E, e);
        break;
    }
    return out;
  }, [a, b, c, r, t, e, v, m, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, e, v, m]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "gcs": {
        const eye = parseIntField(e, "Eye opening");
        const verbal = parseIntField(v, "Verbal");
        const motor = parseIntField(m, "Motor");
        if (!eye.ok) return { error: eye.error };
        if (!verbal.ok) return { error: verbal.error };
        if (!motor.ok) return { error: motor.error };
        const computed = glasgowComaScale({
          eye: eye.value,
          verbal: verbal.value,
          motor: motor.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.gcs),
          primaryLabel: "GCS",
          rows: [
            { label: "E + V + M", value: `${eye.value} + ${verbal.value} + ${motor.value}` },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "phq9": {
        const computed = phq9Score({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.total),
          primaryLabel: "PHQ-9 total",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "gad7": {
        const computed = gad7Score({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.total),
          primaryLabel: "GAD-7 total",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "stroke": {
        const ageP = parsePositive(a, "Age");
        const htn = parseBit(b, "Hypertension");
        const diabetes = parseBit(c, "Diabetes");
        const smoke = parseBit(r, "Smoking");
        const afib = parseBit(t, "AFib");
        const prior = parseBit(e, "Prior stroke");
        if (!ageP.ok) return { error: ageP.error };
        if (!htn.ok) return { error: htn.error };
        if (!diabetes.ok) return { error: diabetes.error };
        if (!smoke.ok) return { error: smoke.error };
        if (!afib.ok) return { error: afib.error };
        if (!prior.ok) return { error: prior.error };
        const computed = strokeRisk({
          age: Math.round(ageP.value),
          htn: htn.value,
          diabetes: diabetes.value,
          smoke: smoke.value,
          afib: afib.value,
          priorStroke: prior.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.points),
          primaryLabel: "Relative points",
          rows: [
            { label: "Band", value: computed.band },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, e, v, m]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "gcs" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-e">Eye opening (1–4)</FieldLabel>
                <FieldInput id="mn-e" value={e} onChange={(ev) => setE(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-v">Verbal (1–5)</FieldLabel>
                <FieldInput id="mn-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-m">Motor (1–6)</FieldLabel>
                <FieldInput id="mn-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "phq9" ? (
            <div>
              <FieldLabel htmlFor="mn-phq">PHQ-9 items CSV (9×0–3) or total 0–27</FieldLabel>
              <FieldInput id="mn-phq" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "gad7" ? (
            <div>
              <FieldLabel htmlFor="mn-gad">GAD-7 items CSV (7×0–3) or total 0–21</FieldLabel>
              <FieldInput id="mn-gad" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "stroke" ? (
            <>
              <div>
                <FieldLabel htmlFor="mn-age">Age (years)</FieldLabel>
                <FieldInput id="mn-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-htn">Hypertension (0/1)</FieldLabel>
                <FieldInput id="mn-htn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-dm">Diabetes (0/1)</FieldLabel>
                <FieldInput id="mn-dm" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-smoke">Smoking (0/1)</FieldLabel>
                <FieldInput id="mn-smoke" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-afib">AFib (0/1)</FieldLabel>
                <FieldInput id="mn-afib" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mn-prior">Prior stroke (0/1)</FieldLabel>
                <FieldInput id="mn-prior" value={e} onChange={(ev) => setE(ev.target.value)} inputMode="numeric" />
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
