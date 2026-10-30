"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_CLINICAL_URL,
  cha2ds2Vasc,
  childPughScore,
  curb65Score,
  meldScore,
  sofaScore,
  wellsScore,
} from "@/lib/calculators/medicalClinicalRisk";

type ClinicalSlug =
  | "medical-cha2ds2-vasc-score-calculator"
  | "medical-wells-score-dvt-pe-calculator"
  | "medical-meld-score-calculator"
  | "medical-sofa-score-calculator"
  | "medical-child-pugh-score-calculator"
  | "medical-curb-65-score-calculator";

type Mode = "cha2ds2" | "wells" | "meld" | "sofa" | "childPugh" | "curb65";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  nDefault: string;
  mDefault: string;
  vDefault: string;
};

const DISCLAIMER =
  "Educational clinical-score arithmetic only — not medical advice, diagnosis, triage, anticoagulation decisions, or emergency care. Verify current guidelines with qualified clinicians; never use this tool for patient management.";

const CONFIG: Record<ClinicalSlug, Config> = {
  "medical-cha2ds2-vasc-score-calculator": {
    title: "CHA₂DS₂-VASc score",
    description: `Teaching tally of CHA₂DS₂-VASc binary risk flags (age≥75 and prior stroke/TIA count as 2). ${DISCLAIMER}`,
    mode: "cha2ds2",
    aDefault: "0",
    bDefault: "1",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    nDefault: "0",
    mDefault: "1",
    vDefault: "0",
  },
  "medical-wells-score-dvt-pe-calculator": {
    title: "Wells score (DVT/PE)",
    description: `Simplified Wells PE (7 weighted flags) or DVT (binary items). Mode pe|dvt in a; flags CSV in b. ${DISCLAIMER}`,
    mode: "wells",
    aDefault: "pe",
    bDefault: "0,0,0,0,0,0,0",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "medical-meld-score-calculator": {
    title: "MELD score",
    description: `Original MELD teaching form from bilirubin, INR, and creatinine. ${DISCLAIMER}`,
    mode: "meld",
    aDefault: "1.2",
    bDefault: "1.1",
    cDefault: "1.0",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "medical-sofa-score-calculator": {
    title: "SOFA score",
    description: `Sum of six organ scores 0–4 each (CSV). ${DISCLAIMER}`,
    mode: "sofa",
    aDefault: "0,0,0,0,0,0",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "medical-child-pugh-score-calculator": {
    title: "Child–Pugh score",
    description: `Five Child–Pugh components scored 1–3 each (CSV). ${DISCLAIMER}`,
    mode: "childPugh",
    aDefault: "1,1,1,1,1",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "medical-curb-65-score-calculator": {
    title: "CURB-65 score",
    description: `Five binary CURB-65 criteria (confusion, urea, respiratory rate, BP, age≥65). ${DISCLAIMER}`,
    mode: "curb65",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    nDefault: "",
    mDefault: "",
    vDefault: "",
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

export function MedicalClinicalRiskCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ClinicalSlug] ?? CONFIG["medical-cha2ds2-vasc-score-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.N, config.nDefault));
  const [m, setM] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(MEDICAL_CLINICAL_URL.V, config.vDefault));

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
      case "cha2ds2":
        put(MEDICAL_CLINICAL_URL.A, a);
        put(MEDICAL_CLINICAL_URL.B, b);
        put(MEDICAL_CLINICAL_URL.C, c);
        put(MEDICAL_CLINICAL_URL.R, r);
        put(MEDICAL_CLINICAL_URL.T, t);
        put(MEDICAL_CLINICAL_URL.N, n);
        put(MEDICAL_CLINICAL_URL.M, m);
        put(MEDICAL_CLINICAL_URL.V, v);
        break;
      case "wells":
        put(MEDICAL_CLINICAL_URL.A, a);
        put(MEDICAL_CLINICAL_URL.B, b);
        break;
      case "meld":
        put(MEDICAL_CLINICAL_URL.A, a);
        put(MEDICAL_CLINICAL_URL.B, b);
        put(MEDICAL_CLINICAL_URL.C, c);
        break;
      case "sofa":
      case "childPugh":
        put(MEDICAL_CLINICAL_URL.A, a);
        break;
      case "curb65":
        put(MEDICAL_CLINICAL_URL.A, a);
        put(MEDICAL_CLINICAL_URL.B, b);
        put(MEDICAL_CLINICAL_URL.C, c);
        put(MEDICAL_CLINICAL_URL.R, r);
        put(MEDICAL_CLINICAL_URL.T, t);
        break;
    }
    return out;
  }, [a, b, c, r, t, n, m, v, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, n, m, v]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "cha2ds2": {
        const chf = parseBit(a, "CHF");
        const htn = parseBit(b, "Hypertension");
        const age75 = parseBit(c, "Age≥75");
        const diabetes = parseBit(r, "Diabetes");
        const stroke = parseBit(t, "Prior stroke/TIA");
        const vascular = parseBit(n, "Vascular disease");
        const age65 = parseBit(m, "Age 65–74");
        const female = parseBit(v, "Female sex");
        if (!chf.ok) return { error: chf.error };
        if (!htn.ok) return { error: htn.error };
        if (!age75.ok) return { error: age75.error };
        if (!diabetes.ok) return { error: diabetes.error };
        if (!stroke.ok) return { error: stroke.error };
        if (!vascular.ok) return { error: vascular.error };
        if (!age65.ok) return { error: age65.error };
        if (!female.ok) return { error: female.error };
        const computed = cha2ds2Vasc({
          chf: chf.value,
          htn: htn.value,
          age75: age75.value,
          diabetes: diabetes.value,
          stroke: stroke.value,
          vascular: vascular.value,
          age65_74: age65.value,
          female: female.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "CHA₂DS₂-VASc score",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "wells": {
        const modeRaw = a.trim().toLowerCase();
        if (modeRaw !== "pe" && modeRaw !== "dvt") {
          return { error: "Mode must be pe or dvt." };
        }
        const computed = wellsScore({ mode: modeRaw, flagsCsv: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.score, 1),
          primaryLabel: `Wells ${modeRaw.toUpperCase()} score`,
          rows: [
            { label: "Mode", value: modeRaw.toUpperCase() },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "meld": {
        const biliP = parsePositive(a, "Bilirubin");
        const inrP = parsePositive(b, "INR");
        const crP = parsePositive(c, "Creatinine");
        if (!biliP.ok) return { error: biliP.error };
        if (!inrP.ok) return { error: inrP.error };
        if (!crP.ok) return { error: crP.error };
        const computed = meldScore({
          bilirubin: biliP.value,
          inr: inrP.value,
          creatinine: crP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.meld),
          primaryLabel: "MELD score",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "sofa": {
        const computed = sofaScore({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "SOFA score",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "childPugh": {
        const computed = childPughScore({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "Child–Pugh score",
          rows: [{ label: "Class", value: computed.classLetter }],
        };
      }
      case "curb65": {
        const confusion = parseBit(a, "Confusion");
        const urea = parseBit(b, "Urea");
        const resp = parseBit(c, "Respiratory rate");
        const bp = parseBit(r, "Blood pressure");
        const age65 = parseBit(t, "Age≥65");
        if (!confusion.ok) return { error: confusion.error };
        if (!urea.ok) return { error: urea.error };
        if (!resp.ok) return { error: resp.error };
        if (!bp.ok) return { error: bp.error };
        if (!age65.ok) return { error: age65.error };
        const computed = curb65Score({
          confusion: confusion.value,
          urea: urea.value,
          resp: resp.value,
          bp: bp.value,
          age65: age65.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "CURB-65 score",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, n, m, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "cha2ds2" ? (
            <>
              <div>
                <FieldLabel htmlFor="mcr-chf">CHF (0/1)</FieldLabel>
                <FieldInput id="mcr-chf" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-htn">Hypertension (0/1)</FieldLabel>
                <FieldInput id="mcr-htn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-age75">Age ≥75 (0/1)</FieldLabel>
                <FieldInput id="mcr-age75" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-dm">Diabetes (0/1)</FieldLabel>
                <FieldInput id="mcr-dm" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-stroke">Prior stroke/TIA (0/1)</FieldLabel>
                <FieldInput id="mcr-stroke" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-vasc">Vascular disease (0/1)</FieldLabel>
                <FieldInput id="mcr-vasc" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-age65">Age 65–74 (0/1)</FieldLabel>
                <FieldInput id="mcr-age65" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-female">Female sex (0/1)</FieldLabel>
                <FieldInput id="mcr-female" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "wells" ? (
            <>
              <div>
                <FieldLabel htmlFor="mcr-wells-mode">Mode (pe or dvt)</FieldLabel>
                <FieldInput id="mcr-wells-mode" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-wells-flags">
                  Flags CSV (PE: 7×0/1; DVT: 3–12×0/1)
                </FieldLabel>
                <FieldInput id="mcr-wells-flags" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "meld" ? (
            <>
              <div>
                <FieldLabel htmlFor="mcr-bili">Bilirubin (mg/dL)</FieldLabel>
                <FieldInput id="mcr-bili" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-inr">INR</FieldLabel>
                <FieldInput id="mcr-inr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-cr">Creatinine (mg/dL)</FieldLabel>
                <FieldInput id="mcr-cr" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "sofa" ? (
            <div>
              <FieldLabel htmlFor="mcr-sofa">SOFA organ scores CSV (6 ints 0–4)</FieldLabel>
              <FieldInput id="mcr-sofa" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "childPugh" ? (
            <div>
              <FieldLabel htmlFor="mcr-cp">Child–Pugh components CSV (5 ints 1–3)</FieldLabel>
              <FieldInput id="mcr-cp" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "curb65" ? (
            <>
              <div>
                <FieldLabel htmlFor="mcr-conf">Confusion (0/1)</FieldLabel>
                <FieldInput id="mcr-conf" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-urea">Urea criterion (0/1)</FieldLabel>
                <FieldInput id="mcr-urea" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-resp">Respiratory rate criterion (0/1)</FieldLabel>
                <FieldInput id="mcr-resp" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-bp">Blood pressure criterion (0/1)</FieldLabel>
                <FieldInput id="mcr-bp" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mcr-age">Age ≥65 (0/1)</FieldLabel>
                <FieldInput id="mcr-age" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
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
