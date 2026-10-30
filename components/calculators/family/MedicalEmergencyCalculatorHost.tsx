"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_EMERGENCY_URL,
  apgarScore,
  newsScore,
  oxygenationIndex,
  shockIndex,
  traumaScore,
} from "@/lib/calculators/medicalEmergency";

type EmergencySlug =
  | "medical-apgar-score-calculator"
  | "medical-shock-index-calculator"
  | "medical-oxygenation-index-calculator"
  | "medical-trauma-score-calculator"
  | "medical-news-score-calculator";

type Mode = "apgar" | "shock" | "oi" | "trauma" | "news";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Educational emergency/critical-care math only — not medical advice, triage, resuscitation protocols, or bedside decision support. Call emergency services for acute illness; clinicians must validate any score.";

const CONFIG: Record<EmergencySlug, Config> = {
  "medical-apgar-score-calculator": {
    title: "APGAR score",
    description: `Five components 0–2 each (CSV). ${DISCLAIMER}`,
    mode: "apgar",
    aDefault: "2,2,2,2,2",
    bDefault: "",
    cDefault: "",
  },
  "medical-shock-index-calculator": {
    title: "Shock index",
    description: `SI = heart rate ÷ systolic BP. Teaching bands only. ${DISCLAIMER}`,
    mode: "shock",
    aDefault: "90",
    bDefault: "120",
    cDefault: "",
  },
  "medical-oxygenation-index-calculator": {
    title: "Oxygenation index",
    description: `OI = (FIO₂ × MAP × 100) / PaO₂. FIO₂ as fraction 0–1. ${DISCLAIMER}`,
    mode: "oi",
    aDefault: "0.4",
    bDefault: "12",
    cDefault: "80",
  },
  "medical-trauma-score-calculator": {
    title: "Trauma score (coded)",
    description: `Sum of three coded GCS/SBP/RR categories 0–4 (CSV). ${DISCLAIMER}`,
    mode: "trauma",
    aDefault: "4,4,4",
    bDefault: "",
    cDefault: "",
  },
  "medical-news-score-calculator": {
    title: "NEWS score",
    description: `NEWS2-style sum of seven vital-sign component scores 0–3 (CSV). ${DISCLAIMER}`,
    mode: "news",
    aDefault: "0,0,0,0,0,0,0",
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

export function MedicalEmergencyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as EmergencySlug] ?? CONFIG["medical-apgar-score-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_EMERGENCY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_EMERGENCY_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_EMERGENCY_URL.C, config.cDefault));

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
      case "apgar":
      case "trauma":
      case "news":
        put(MEDICAL_EMERGENCY_URL.A, a);
        break;
      case "shock":
        put(MEDICAL_EMERGENCY_URL.A, a);
        put(MEDICAL_EMERGENCY_URL.B, b);
        break;
      case "oi":
        put(MEDICAL_EMERGENCY_URL.A, a);
        put(MEDICAL_EMERGENCY_URL.B, b);
        put(MEDICAL_EMERGENCY_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "apgar": {
        const computed = apgarScore({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "APGAR score",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "shock": {
        const hrP = parsePositive(a, "Heart rate");
        const sbpP = parsePositive(b, "Systolic BP");
        if (!hrP.ok) return { error: hrP.error };
        if (!sbpP.ok) return { error: sbpP.error };
        const computed = shockIndex({ hr: hrP.value, sbp: sbpP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.index),
          primaryLabel: "Shock index",
          rows: [
            { label: "HR", value: num(hrP.value, 0) },
            { label: "SBP", value: num(sbpP.value, 0) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "oi": {
        const fio2P = parsePositive(a, "FIO₂");
        const mapP = parsePositive(b, "MAP");
        const pao2P = parsePositive(c, "PaO₂");
        if (!fio2P.ok) return { error: fio2P.error };
        if (!mapP.ok) return { error: mapP.error };
        if (!pao2P.ok) return { error: pao2P.error };
        const computed = oxygenationIndex({
          fio2: fio2P.value,
          map: mapP.value,
          pao2: pao2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.oi),
          primaryLabel: "Oxygenation index",
          rows: [
            { label: "FIO₂", value: num(fio2P.value, 3) },
            { label: "MAP", value: num(mapP.value) },
            { label: "PaO₂", value: num(pao2P.value) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "trauma": {
        const computed = traumaScore({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "Trauma score",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "news": {
        const computed = newsScore({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "NEWS aggregate",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "apgar" ? (
            <div>
              <FieldLabel htmlFor="me-apgar">APGAR components CSV (5 ints 0–2)</FieldLabel>
              <FieldInput id="me-apgar" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "shock" ? (
            <>
              <div>
                <FieldLabel htmlFor="me-hr">Heart rate (bpm)</FieldLabel>
                <FieldInput id="me-hr" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="me-sbp">Systolic BP (mmHg)</FieldLabel>
                <FieldInput id="me-sbp" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "oi" ? (
            <>
              <div>
                <FieldLabel htmlFor="me-fio2">FIO₂ (fraction 0–1)</FieldLabel>
                <FieldInput id="me-fio2" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="me-map">MAP (cmH₂O)</FieldLabel>
                <FieldInput id="me-map" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="me-pao2">PaO₂ (mmHg)</FieldLabel>
                <FieldInput id="me-pao2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "trauma" ? (
            <div>
              <FieldLabel htmlFor="me-trauma">Coded GCS/SBP/RR CSV (3 ints 0–4)</FieldLabel>
              <FieldInput id="me-trauma" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "news" ? (
            <div>
              <FieldLabel htmlFor="me-news">NEWS components CSV (7 ints 0–3)</FieldLabel>
              <FieldInput id="me-news" value={a} onChange={(ev) => setA(ev.target.value)} />
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
