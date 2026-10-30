"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_HEART_URL,
  medicalAscvdRisk,
  medicalBpCategory,
  medicalCardiacOutput,
  medicalFramingham,
  medicalHeartRate,
  medicalMap,
  medicalPulsePressure,
  medicalTargetHeartRate,
} from "@/lib/calculators/medicalHeart";

type HeartSlug =
  | "medical-heart-rate-calculator"
  | "medical-target-heart-rate-calculator"
  | "medical-blood-pressure-category-calculator"
  | "medical-map-calculator"
  | "medical-pulse-pressure-calculator"
  | "medical-cardiac-output-calculator"
  | "medical-ascvd-risk-calculator"
  | "medical-framingham-risk-score-calculator";

type Mode = "maxHr" | "targetHr" | "bpCat" | "map" | "pp" | "co" | "ascvd" | "framingham";

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
  sDefault: string;
};

const DISCLAIMER =
  "Educational cardiovascular math only — not medical advice, diagnosis, emergency care, or treatment decisions. Seek urgent care for chest pain, stroke signs, or hypertensive emergencies; verify risk tools with clinicians.";

const CONFIG: Record<HeartSlug, Config> = {
  "medical-heart-rate-calculator": {
    title: "Maximum heart rate",
    description: `Teaching max HR ≈ 220 − age. ${DISCLAIMER}`,
    mode: "maxHr",
    aDefault: "40",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    sDefault: "",
  },
  "medical-target-heart-rate-calculator": {
    title: "Target heart rate (Karvonen)",
    description: `Karvonen zones from age and resting HR (default 50–85% reserve). ${DISCLAIMER}`,
    mode: "targetHr",
    aDefault: "40",
    bDefault: "70",
    cDefault: "0.5",
    rDefault: "0.85",
    tDefault: "",
    nDefault: "",
    sDefault: "",
  },
  "medical-blood-pressure-category-calculator": {
    title: "Blood pressure category",
    description: `ACC/AHA-style teaching bands from systolic and diastolic. ${DISCLAIMER}`,
    mode: "bpCat",
    aDefault: "120",
    bDefault: "80",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    sDefault: "",
  },
  "medical-map-calculator": {
    title: "Mean arterial pressure",
    description: `MAP ≈ diastolic + (systolic − diastolic) / 3. ${DISCLAIMER}`,
    mode: "map",
    aDefault: "120",
    bDefault: "80",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    sDefault: "",
  },
  "medical-pulse-pressure-calculator": {
    title: "Pulse pressure",
    description: `Pulse pressure = systolic − diastolic. ${DISCLAIMER}`,
    mode: "pp",
    aDefault: "120",
    bDefault: "80",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    sDefault: "",
  },
  "medical-cardiac-output-calculator": {
    title: "Cardiac output",
    description: `CO (L/min) = HR × stroke volume (mL) / 1000. ${DISCLAIMER}`,
    mode: "co",
    aDefault: "70",
    bDefault: "70",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    sDefault: "",
  },
  "medical-ascvd-risk-calculator": {
    title: "ASCVD-style points (teaching)",
    description: `Simplified classroom risk-factor tally — not the ACC/AHA PCE equation. ${DISCLAIMER}`,
    mode: "ascvd",
    aDefault: "55",
    bDefault: "200",
    cDefault: "45",
    rDefault: "130",
    tDefault: "0",
    nDefault: "0",
    sDefault: "0",
  },
  "medical-framingham-risk-score-calculator": {
    title: "Framingham-style points (teaching)",
    description: `Simplified Framingham-like point sum — not a validated equation. ${DISCLAIMER}`,
    mode: "framingham",
    aDefault: "55",
    bDefault: "200",
    cDefault: "45",
    rDefault: "130",
    tDefault: "0",
    nDefault: "",
    sDefault: "",
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
  const v = Math.round(p.value);
  if (v !== 0 && v !== 1) return { ok: false as const, error: `${label} must be 0 or 1.` };
  return { ok: true as const, value: v };
}

export function MedicalHeartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as HeartSlug] ?? CONFIG["medical-heart-rate-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_HEART_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_HEART_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_HEART_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_HEART_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_HEART_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(MEDICAL_HEART_URL.N, config.nDefault));
  const [s, setS] = useState(useLoanInitialInput(MEDICAL_HEART_URL.S, config.sDefault));

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
      case "maxHr":
        put(MEDICAL_HEART_URL.A, a);
        put(MEDICAL_HEART_URL.T, t);
        break;
      case "targetHr":
        put(MEDICAL_HEART_URL.A, a);
        put(MEDICAL_HEART_URL.B, b);
        put(MEDICAL_HEART_URL.C, c);
        put(MEDICAL_HEART_URL.R, r);
        break;
      case "bpCat":
      case "map":
      case "pp":
      case "co":
        put(MEDICAL_HEART_URL.A, a);
        put(MEDICAL_HEART_URL.B, b);
        break;
      case "ascvd":
        put(MEDICAL_HEART_URL.A, a);
        put(MEDICAL_HEART_URL.B, b);
        put(MEDICAL_HEART_URL.C, c);
        put(MEDICAL_HEART_URL.R, r);
        put(MEDICAL_HEART_URL.T, t);
        put(MEDICAL_HEART_URL.N, n);
        put(MEDICAL_HEART_URL.S, s);
        break;
      case "framingham":
        put(MEDICAL_HEART_URL.A, a);
        put(MEDICAL_HEART_URL.B, b);
        put(MEDICAL_HEART_URL.C, c);
        put(MEDICAL_HEART_URL.R, r);
        put(MEDICAL_HEART_URL.T, t);
        break;
    }
    return out;
  }, [a, b, c, r, t, n, s, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, n, s]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "maxHr": {
        const ageRaw = a.trim() !== "" ? a : t;
        const ageP = parsePositive(ageRaw, "Age");
        if (!ageP.ok) return { error: ageP.error };
        const computed = medicalHeartRate({ age: ageP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.maxHr, 0)} bpm`,
          primaryLabel: "Estimated max HR",
          rows: [{ label: "Rule", value: "220 − age" }],
        };
      }
      case "targetHr": {
        const ageP = parsePositive(a, "Age");
        const restP = parsePositive(b, "Resting HR");
        if (!ageP.ok) return { error: ageP.error };
        if (!restP.ok) return { error: restP.error };
        let lowPct: number | undefined;
        let highPct: number | undefined;
        if (c.trim() !== "") {
          const lowP = parsePositive(c, "Low %");
          if (!lowP.ok) return { error: lowP.error };
          lowPct = lowP.value;
        }
        if (r.trim() !== "") {
          const highP = parsePositive(r, "High %");
          if (!highP.ok) return { error: highP.error };
          highPct = highP.value;
        }
        const computed = medicalTargetHeartRate({
          age: ageP.value,
          restingHr: restP.value,
          lowPct,
          highPct,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.low, 0)}–${num(computed.high, 0)} bpm`,
          primaryLabel: "Target HR zone",
          rows: [
            { label: "Max HR", value: `${num(computed.maxHr, 0)} bpm` },
            { label: "Low", value: `${num(computed.low, 0)} bpm` },
            { label: "High", value: `${num(computed.high, 0)} bpm` },
          ],
        };
      }
      case "bpCat": {
        const sysP = parsePositive(a, "Systolic");
        const diaP = parsePositive(b, "Diastolic");
        if (!sysP.ok) return { error: sysP.error };
        if (!diaP.ok) return { error: diaP.error };
        const computed = medicalBpCategory({ systolic: sysP.value, diastolic: diaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.category,
          primaryLabel: "BP category",
          rows: [
            { label: "Systolic", value: `${num(sysP.value, 0)} mmHg` },
            { label: "Diastolic", value: `${num(diaP.value, 0)} mmHg` },
          ],
        };
      }
      case "map": {
        const sysP = parsePositive(a, "Systolic");
        const diaP = parsePositive(b, "Diastolic");
        if (!sysP.ok) return { error: sysP.error };
        if (!diaP.ok) return { error: diaP.error };
        const computed = medicalMap({ systolic: sysP.value, diastolic: diaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.map)} mmHg`,
          primaryLabel: "MAP",
          rows: [{ label: "Formula", value: "DBP + (SBP−DBP)/3" }],
        };
      }
      case "pp": {
        const sysP = parsePositive(a, "Systolic");
        const diaP = parsePositive(b, "Diastolic");
        if (!sysP.ok) return { error: sysP.error };
        if (!diaP.ok) return { error: diaP.error };
        const computed = medicalPulsePressure({ systolic: sysP.value, diastolic: diaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pulsePressure, 0)} mmHg`,
          primaryLabel: "Pulse pressure",
          rows: [{ label: "Formula", value: "SBP − DBP" }],
        };
      }
      case "co": {
        const hrP = parsePositive(a, "Heart rate");
        const svP = parsePositive(b, "Stroke volume");
        if (!hrP.ok) return { error: hrP.error };
        if (!svP.ok) return { error: svP.error };
        const computed = medicalCardiacOutput({ hr: hrP.value, strokeVolumeMl: svP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.coLMin, 2)} L/min`,
          primaryLabel: "Cardiac output",
          rows: [{ label: "Formula", value: "HR × SV / 1000" }],
        };
      }
      case "ascvd": {
        const ageP = parsePositive(a, "Age");
        const cholP = parsePositive(b, "Total cholesterol");
        const hdlP = parsePositive(c, "HDL");
        const sbpP = parsePositive(r, "SBP");
        const smokeP = parseBit(t, "Smoke");
        const dmP = parseBit(n, "Diabetes");
        const treatedP = parseBit(s, "Treated BP");
        if (!ageP.ok) return { error: ageP.error };
        if (!cholP.ok) return { error: cholP.error };
        if (!hdlP.ok) return { error: hdlP.error };
        if (!sbpP.ok) return { error: sbpP.error };
        if (!smokeP.ok) return { error: smokeP.error };
        if (!dmP.ok) return { error: dmP.error };
        if (!treatedP.ok) return { error: treatedP.error };
        const computed = medicalAscvdRisk({
          age: ageP.value,
          totalChol: cholP.value,
          hdl: hdlP.value,
          sbp: sbpP.value,
          smoke: smokeP.value,
          diabetes: dmP.value,
          treatedBp: treatedP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.points),
          primaryLabel: "Teaching points",
          rows: [
            { label: "Band", value: computed.band },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "framingham": {
        const ageP = parsePositive(a, "Age");
        const cholP = parsePositive(b, "Total cholesterol");
        const hdlP = parsePositive(c, "HDL");
        const sbpP = parsePositive(r, "SBP");
        const smokeP = parseBit(t, "Smoke");
        if (!ageP.ok) return { error: ageP.error };
        if (!cholP.ok) return { error: cholP.error };
        if (!hdlP.ok) return { error: hdlP.error };
        if (!sbpP.ok) return { error: sbpP.error };
        if (!smokeP.ok) return { error: smokeP.error };
        const computed = medicalFramingham({
          age: ageP.value,
          totalChol: cholP.value,
          hdl: hdlP.value,
          sbp: sbpP.value,
          smoke: smokeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.points),
          primaryLabel: "Teaching points",
          rows: [
            { label: "Band", value: computed.band },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, n, s]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "maxHr" ? (
            <div>
              <FieldLabel htmlFor="mh-age">Age (years)</FieldLabel>
              <FieldInput id="mh-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
            </div>
          ) : null}

          {config.mode === "targetHr" ? (
            <>
              <div>
                <FieldLabel htmlFor="mh-tage">Age (years)</FieldLabel>
                <FieldInput id="mh-tage" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-rest">Resting heart rate (bpm)</FieldLabel>
                <FieldInput id="mh-rest" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-low">Low intensity fraction (optional, default 0.5)</FieldLabel>
                <FieldInput id="mh-low" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-high">High intensity fraction (optional, default 0.85)</FieldLabel>
                <FieldInput id="mh-high" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "bpCat" || config.mode === "map" || config.mode === "pp" ? (
            <>
              <div>
                <FieldLabel htmlFor="mh-sys">Systolic (mmHg)</FieldLabel>
                <FieldInput id="mh-sys" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-dia">Diastolic (mmHg)</FieldLabel>
                <FieldInput id="mh-dia" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "co" ? (
            <>
              <div>
                <FieldLabel htmlFor="mh-hr">Heart rate (bpm)</FieldLabel>
                <FieldInput id="mh-hr" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-sv">Stroke volume (mL)</FieldLabel>
                <FieldInput id="mh-sv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ascvd" ? (
            <>
              <div>
                <FieldLabel htmlFor="mh-aage">Age</FieldLabel>
                <FieldInput id="mh-aage" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-chol">Total cholesterol (mg/dL)</FieldLabel>
                <FieldInput id="mh-chol" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-hdl">HDL (mg/dL)</FieldLabel>
                <FieldInput id="mh-hdl" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-sbp">Systolic BP (mmHg)</FieldLabel>
                <FieldInput id="mh-sbp" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-smoke">Smoke (0/1)</FieldLabel>
                <FieldInput id="mh-smoke" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-dm">Diabetes (0/1)</FieldLabel>
                <FieldInput id="mh-dm" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-tx">Treated BP (0/1)</FieldLabel>
                <FieldInput id="mh-tx" value={s} onChange={(ev) => setS(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "framingham" ? (
            <>
              <div>
                <FieldLabel htmlFor="mh-fage">Age</FieldLabel>
                <FieldInput id="mh-fage" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-fchol">Total cholesterol (mg/dL)</FieldLabel>
                <FieldInput id="mh-fchol" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-fhdl">HDL (mg/dL)</FieldLabel>
                <FieldInput id="mh-fhdl" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-fsbp">Systolic BP (mmHg)</FieldLabel>
                <FieldInput id="mh-fsbp" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mh-fsmoke">Smoke (0/1)</FieldLabel>
                <FieldInput id="mh-fsmoke" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
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
