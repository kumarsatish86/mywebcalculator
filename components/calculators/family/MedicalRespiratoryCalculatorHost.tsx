"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_RESP_URL,
  alveolarGasEquation,
  lungCapacity,
  oxygenRequirement,
  peakFlow,
} from "@/lib/calculators/medicalRespiratory";

type RespSlug =
  | "medical-oxygen-requirement-calculator"
  | "medical-lung-capacity-calculator"
  | "medical-peak-flow-calculator"
  | "medical-alveolar-gas-equation-calculator";

type Mode = "oxygen" | "lung" | "peak" | "alveolar";

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
  "Educational physiology math only — not medical advice, diagnosis, titration guidance, or emergency care. Seek qualified clinicians for respiratory decisions.";

const CONFIG: Record<RespSlug, Config> = {
  "medical-oxygen-requirement-calculator": {
    title: "Oxygen requirement (teaching)",
    description: `Rough classroom SpO₂-deficit → L/min heuristic. ${DISCLAIMER}`,
    mode: "oxygen",
    aDefault: "92",
    bDefault: "94",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "medical-lung-capacity-calculator": {
    title: "Lung capacity (vital capacity)",
    description: `VC ≈ IRV + TV + ERV (mL). ${DISCLAIMER}`,
    mode: "lung",
    aDefault: "3000",
    bDefault: "500",
    cDefault: "1000",
    rDefault: "",
    tDefault: "",
  },
  "medical-peak-flow-calculator": {
    title: "Peak flow % predicted",
    description: `% predicted PEF = (measured / predicted) × 100 with teaching zone bands. ${DISCLAIMER}`,
    mode: "peak",
    aDefault: "400",
    bDefault: "500",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "medical-alveolar-gas-equation-calculator": {
    title: "Alveolar gas equation",
    description: `PAO₂ = FIO₂(Patm − PH₂O) − PaCO₂/R. FIO₂ as fraction (a), PaCO₂ mmHg (b). ${DISCLAIMER}`,
    mode: "alveolar",
    aDefault: "0.21",
    bDefault: "40",
    cDefault: "760",
    rDefault: "0.8",
    tDefault: "47",
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

export function MedicalRespiratoryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as RespSlug] ?? CONFIG["medical-oxygen-requirement-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_RESP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_RESP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_RESP_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_RESP_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_RESP_URL.T, config.tDefault));

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
      case "oxygen":
      case "peak":
        put(MEDICAL_RESP_URL.A, a);
        put(MEDICAL_RESP_URL.B, b);
        break;
      case "lung":
        put(MEDICAL_RESP_URL.A, a);
        put(MEDICAL_RESP_URL.B, b);
        put(MEDICAL_RESP_URL.C, c);
        break;
      case "alveolar":
        put(MEDICAL_RESP_URL.A, a);
        put(MEDICAL_RESP_URL.B, b);
        put(MEDICAL_RESP_URL.C, c);
        put(MEDICAL_RESP_URL.R, r);
        put(MEDICAL_RESP_URL.T, t);
        break;
    }
    return out;
  }, [a, b, c, r, t, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "oxygen": {
        const spo2P = parsePositive(a, "SpO₂");
        const targetP = parsePositive(b, "Target SpO₂");
        if (!spo2P.ok) return { error: spo2P.error };
        if (!targetP.ok) return { error: targetP.error };
        const computed = oxygenRequirement({ spo2: spo2P.value, targetSpo2: targetP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.estimateLpm)} L/min`,
          primaryLabel: "Teaching O₂ estimate",
          rows: [
            { label: "SpO₂", value: num(spo2P.value) },
            { label: "Target SpO₂", value: num(targetP.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "lung": {
        const irvP = parseNonNegative(a, "IRV");
        const tvP = parsePositive(b, "TV");
        const ervP = parseNonNegative(c, "ERV");
        if (!irvP.ok) return { error: irvP.error };
        if (!tvP.ok) return { error: tvP.error };
        if (!ervP.ok) return { error: ervP.error };
        const computed = lungCapacity({ irvMl: irvP.value, tvMl: tvP.value, ervMl: ervP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.vcMl, 0)} mL`,
          primaryLabel: "Vital capacity (VC)",
          rows: [
            { label: "IRV", value: `${num(irvP.value, 0)} mL` },
            { label: "TV", value: `${num(tvP.value, 0)} mL` },
            { label: "ERV", value: `${num(ervP.value, 0)} mL` },
          ],
        };
      }
      case "peak": {
        const measP = parsePositive(a, "Measured PEF");
        const predP = parsePositive(b, "Predicted PEF");
        if (!measP.ok) return { error: measP.error };
        if (!predP.ok) return { error: predP.error };
        const computed = peakFlow({ measured: measP.value, predicted: predP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percentPredicted)}%`,
          primaryLabel: "% predicted PEF",
          rows: [
            { label: "Measured", value: num(measP.value, 0) },
            { label: "Predicted", value: num(predP.value, 0) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "alveolar": {
        const fio2P = parsePositive(a, "FIO₂");
        const paco2P = parsePositive(b, "PaCO₂");
        if (!fio2P.ok) return { error: fio2P.error };
        if (!paco2P.ok) return { error: paco2P.error };
        const patmRaw = c.trim();
        const ph2oRaw = t.trim();
        const rRaw = r.trim();
        let patm: number | undefined;
        let ph2o: number | undefined;
        let rq: number | undefined;
        if (patmRaw !== "") {
          const p = parsePositive(patmRaw, "Patm");
          if (!p.ok) return { error: p.error };
          patm = p.value;
        }
        if (ph2oRaw !== "") {
          const p = parseNonNegative(ph2oRaw, "PH₂O");
          if (!p.ok) return { error: p.error };
          ph2o = p.value;
        }
        if (rRaw !== "") {
          const p = parsePositive(rRaw, "R");
          if (!p.ok) return { error: p.error };
          rq = p.value;
        }
        const computed = alveolarGasEquation({
          fio2: fio2P.value,
          paco2: paco2P.value,
          patm,
          ph2o,
          r: rq,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pao2)} mmHg`,
          primaryLabel: "PAO₂",
          rows: [
            { label: "FIO₂", value: num(fio2P.value, 3) },
            { label: "PaCO₂", value: num(paco2P.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "oxygen" ? (
            <>
              <div>
                <FieldLabel htmlFor="mr-spo2">Current SpO₂ (%)</FieldLabel>
                <FieldInput id="mr-spo2" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-target">Target SpO₂ (%)</FieldLabel>
                <FieldInput id="mr-target" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "lung" ? (
            <>
              <div>
                <FieldLabel htmlFor="mr-irv">IRV (mL)</FieldLabel>
                <FieldInput id="mr-irv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-tv">TV (mL)</FieldLabel>
                <FieldInput id="mr-tv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-erv">ERV (mL)</FieldLabel>
                <FieldInput id="mr-erv" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "peak" ? (
            <>
              <div>
                <FieldLabel htmlFor="mr-meas">Measured PEF</FieldLabel>
                <FieldInput id="mr-meas" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-pred">Predicted PEF</FieldLabel>
                <FieldInput id="mr-pred" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "alveolar" ? (
            <>
              <div>
                <FieldLabel htmlFor="mr-fio2">FIO₂ (fraction 0–1)</FieldLabel>
                <FieldInput id="mr-fio2" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-paco2">PaCO₂ (mmHg)</FieldLabel>
                <FieldInput id="mr-paco2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-patm">Patm (mmHg, optional)</FieldLabel>
                <FieldInput id="mr-patm" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-ph2o">PH₂O (mmHg, optional)</FieldLabel>
                <FieldInput id="mr-ph2o" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mr-rq">R (RQ, optional)</FieldLabel>
                <FieldInput id="mr-rq" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
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
