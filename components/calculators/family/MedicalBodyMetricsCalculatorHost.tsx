"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_BODY_URL,
  medicalAdjustedBodyWeight,
  medicalBmi,
  medicalBmr,
  medicalBodyFat,
  medicalBsa,
  medicalFfmi,
  medicalIdealBodyWeight,
  medicalLeanBodyMass,
  medicalWaistHip,
} from "@/lib/calculators/medicalBodyMetrics";

type BodySlug =
  | "medical-bmi-calculator"
  | "medical-bmr-calculator"
  | "medical-body-fat-percentage-calculator"
  | "medical-ideal-body-weight-calculator"
  | "medical-lean-body-mass-calculator"
  | "medical-waist-to-hip-ratio-calculator"
  | "medical-bsa-calculator"
  | "medical-adjusted-body-weight-calculator"
  | "medical-ffmi-calculator";

type Mode = "bmi" | "bmr" | "bodyFat" | "ibw" | "lbm" | "whr" | "bsa" | "ajbw" | "ffmi";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  wDefault: string;
  hDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  sDefault: string;
};

const DISCLAIMER =
  "Educational anthropometric math only — not medical advice, diagnosis, dosing, nutrition prescriptions, or fitness programming. Body composition estimates can misclassify individuals; verify with qualified clinicians.";

const CONFIG: Record<BodySlug, Config> = {
  "medical-bmi-calculator": {
    title: "BMI (body mass index)",
    description: `BMI = weight(kg) / height(m)² with WHO-style teaching bands. ${DISCLAIMER}`,
    mode: "bmi",
    wDefault: "70",
    hDefault: "175",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    sDefault: "",
  },
  "medical-bmr-calculator": {
    title: "BMR (Mifflin–St Jeor)",
    description: `Mifflin–St Jeor resting energy estimate from weight, height, age, and sex. ${DISCLAIMER}`,
    mode: "bmr",
    wDefault: "70",
    hDefault: "175",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "30",
    sDefault: "male",
  },
  "medical-body-fat-percentage-calculator": {
    title: "Body fat % (US Navy)",
    description: `US Navy circumference estimate (cm). Female formula needs hip. ${DISCLAIMER}`,
    mode: "bodyFat",
    wDefault: "",
    hDefault: "175",
    aDefault: "85",
    bDefault: "",
    cDefault: "38",
    rDefault: "95",
    tDefault: "",
    sDefault: "male",
  },
  "medical-ideal-body-weight-calculator": {
    title: "Ideal body weight (Devine)",
    description: `Devine IBW (kg) from height ≥152 cm and sex. ${DISCLAIMER}`,
    mode: "ibw",
    wDefault: "",
    hDefault: "175",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    sDefault: "male",
  },
  "medical-lean-body-mass-calculator": {
    title: "Lean body mass (Boer)",
    description: `Boer lean body mass from weight, height, and sex. ${DISCLAIMER}`,
    mode: "lbm",
    wDefault: "70",
    hDefault: "175",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    sDefault: "male",
  },
  "medical-waist-to-hip-ratio-calculator": {
    title: "Waist-to-hip ratio",
    description: `WHR = waist ÷ hip with simple teaching bands. ${DISCLAIMER}`,
    mode: "whr",
    wDefault: "",
    hDefault: "",
    aDefault: "85",
    bDefault: "95",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    sDefault: "",
  },
  "medical-bsa-calculator": {
    title: "Body surface area (Mosteller)",
    description: `Mosteller BSA (m²) = √(height_cm × weight_kg / 3600). ${DISCLAIMER}`,
    mode: "bsa",
    wDefault: "70",
    hDefault: "170",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    sDefault: "",
  },
  "medical-adjusted-body-weight-calculator": {
    title: "Adjusted body weight",
    description: `AjBW = IBW + 0.4 × (TBW − IBW) using Devine IBW. ${DISCLAIMER}`,
    mode: "ajbw",
    wDefault: "95",
    hDefault: "175",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    sDefault: "male",
  },
  "medical-ffmi-calculator": {
    title: "FFMI (fat-free mass index)",
    description: `FFMI from weight, height, and body-fat %. ${DISCLAIMER}`,
    mode: "ffmi",
    wDefault: "80",
    hDefault: "180",
    aDefault: "15",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
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

function parseSex(raw: string) {
  const s = raw.trim().toLowerCase();
  if (s === "male" || s === "m") return { ok: true as const, value: "male" as const };
  if (s === "female" || s === "f") return { ok: true as const, value: "female" as const };
  return { ok: false as const, error: "Sex must be male or female." };
}

export function MedicalBodyMetricsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BodySlug] ?? CONFIG["medical-bmi-calculator"];
  const urlW = useLoanInitialInput(MEDICAL_BODY_URL.W, "");
  const urlH = useLoanInitialInput(MEDICAL_BODY_URL.H, "");
  const urlA = useLoanInitialInput(MEDICAL_BODY_URL.A, config.aDefault);
  const urlB = useLoanInitialInput(MEDICAL_BODY_URL.B, config.bDefault);
  const weightAliasOk =
    config.mode === "bmi" ||
    config.mode === "bmr" ||
    config.mode === "lbm" ||
    config.mode === "bsa" ||
    config.mode === "ajbw";
  const [w, setW] = useState(urlW || (weightAliasOk ? urlA || config.wDefault : config.wDefault));
  const [h, setH] = useState(urlH || (config.mode === "whr" ? "" : urlB) || config.hDefault);
  const [a, setA] = useState(urlA);
  const [b, setB] = useState(urlB);
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_BODY_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_BODY_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_BODY_URL.T, config.tDefault));
  const [s, setS] = useState(useLoanInitialInput(MEDICAL_BODY_URL.S, config.sDefault));

  const num = (nVal: number, d = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(d);
  };

  const weightAllowsA =
    config.mode === "bmi" ||
    config.mode === "bmr" ||
    config.mode === "lbm" ||
    config.mode === "bsa" ||
    config.mode === "ajbw";
  const weightRaw = () => (w.trim() !== "" ? w : weightAllowsA ? a : w);
  const heightRaw = () => (h.trim() !== "" ? h : b);

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "bmi":
      case "bsa":
        put(MEDICAL_BODY_URL.W, w);
        put(MEDICAL_BODY_URL.H, h);
        put(MEDICAL_BODY_URL.A, a);
        put(MEDICAL_BODY_URL.B, b);
        break;
      case "bmr":
        put(MEDICAL_BODY_URL.W, w);
        put(MEDICAL_BODY_URL.H, h);
        put(MEDICAL_BODY_URL.A, a);
        put(MEDICAL_BODY_URL.B, b);
        put(MEDICAL_BODY_URL.T, t);
        put(MEDICAL_BODY_URL.S, s);
        break;
      case "bodyFat":
        put(MEDICAL_BODY_URL.S, s);
        put(MEDICAL_BODY_URL.H, h);
        put(MEDICAL_BODY_URL.B, b);
        put(MEDICAL_BODY_URL.A, a);
        put(MEDICAL_BODY_URL.C, c);
        put(MEDICAL_BODY_URL.R, r);
        break;
      case "ibw":
        put(MEDICAL_BODY_URL.H, h);
        put(MEDICAL_BODY_URL.B, b);
        put(MEDICAL_BODY_URL.S, s);
        break;
      case "lbm":
      case "ajbw":
        put(MEDICAL_BODY_URL.W, w);
        put(MEDICAL_BODY_URL.H, h);
        put(MEDICAL_BODY_URL.A, a);
        put(MEDICAL_BODY_URL.B, b);
        put(MEDICAL_BODY_URL.S, s);
        break;
      case "whr":
        put(MEDICAL_BODY_URL.A, a);
        put(MEDICAL_BODY_URL.B, b);
        break;
      case "ffmi":
        put(MEDICAL_BODY_URL.W, w);
        put(MEDICAL_BODY_URL.H, h);
        put(MEDICAL_BODY_URL.A, a);
        put(MEDICAL_BODY_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, r, t, s, w, h, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, s, w, h]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "bmi": {
        const wt = parsePositive(weightRaw(), "Weight (kg)");
        const ht = parsePositive(heightRaw(), "Height (cm)");
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        const computed = medicalBmi({ weightKg: wt.value, heightCm: ht.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.bmi),
          primaryLabel: "BMI",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "bmr": {
        const wt = parsePositive(weightRaw(), "Weight (kg)");
        const ht = parsePositive(heightRaw(), "Height (cm)");
        const ageP = parsePositive(t, "Age");
        const sexP = parseSex(s);
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (!ageP.ok) return { error: ageP.error };
        if (!sexP.ok) return { error: sexP.error };
        const computed = medicalBmr({
          weightKg: wt.value,
          heightCm: ht.value,
          age: ageP.value,
          sex: sexP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.bmr, 0),
          primaryLabel: "BMR (kcal/day)",
          rows: [
            { label: "Formula", value: "Mifflin–St Jeor" },
            { label: "Sex", value: sexP.value },
          ],
        };
      }
      case "bodyFat": {
        const sexP = parseSex(s);
        const ht = parsePositive(heightRaw(), "Height (cm)");
        const waistP = parsePositive(a, "Waist (cm)");
        const neckP = parsePositive(c, "Neck (cm)");
        if (!sexP.ok) return { error: sexP.error };
        if (!ht.ok) return { error: ht.error };
        if (!waistP.ok) return { error: waistP.error };
        if (!neckP.ok) return { error: neckP.error };
        let hipCm: number | undefined;
        if (sexP.value === "female" || r.trim() !== "") {
          const hipP = parsePositive(r, "Hip (cm)");
          if (!hipP.ok) return { error: hipP.error };
          hipCm = hipP.value;
        }
        const computed = medicalBodyFat({
          sex: sexP.value,
          heightCm: ht.value,
          waistCm: waistP.value,
          neckCm: neckP.value,
          hipCm,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.bodyFatPct)}%`,
          primaryLabel: "Body fat % (Navy)",
          rows: [{ label: "Sex", value: sexP.value }],
        };
      }
      case "ibw": {
        const ht = parsePositive(heightRaw(), "Height (cm)");
        const sexP = parseSex(s);
        if (!ht.ok) return { error: ht.error };
        if (!sexP.ok) return { error: sexP.error };
        const computed = medicalIdealBodyWeight({ heightCm: ht.value, sex: sexP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.ibwKg)} kg`,
          primaryLabel: "Ideal body weight",
          rows: [
            { label: "Formula", value: "Devine" },
            { label: "Sex", value: sexP.value },
          ],
        };
      }
      case "lbm": {
        const wt = parsePositive(weightRaw(), "Weight (kg)");
        const ht = parsePositive(heightRaw(), "Height (cm)");
        const sexP = parseSex(s);
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (!sexP.ok) return { error: sexP.error };
        const computed = medicalLeanBodyMass({
          weightKg: wt.value,
          heightCm: ht.value,
          sex: sexP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.lbmKg)} kg`,
          primaryLabel: "Lean body mass",
          rows: [
            { label: "Formula", value: "Boer" },
            { label: "Sex", value: sexP.value },
          ],
        };
      }
      case "whr": {
        const waistP = parsePositive(a, "Waist (cm)");
        const hipP = parsePositive(b, "Hip (cm)");
        if (!waistP.ok) return { error: waistP.error };
        if (!hipP.ok) return { error: hipP.error };
        const computed = medicalWaistHip({ waistCm: waistP.value, hipCm: hipP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ratio, 3),
          primaryLabel: "Waist-to-hip ratio",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "bsa": {
        const wt = parsePositive(weightRaw(), "Weight (kg)");
        const ht = parsePositive(heightRaw(), "Height (cm)");
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        const computed = medicalBsa({ weightKg: wt.value, heightCm: ht.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.bsaM2, 3)} m²`,
          primaryLabel: "BSA (Mosteller)",
          rows: [{ label: "Formula", value: "√(ht×wt/3600)" }],
        };
      }
      case "ajbw": {
        const wt = parsePositive(weightRaw(), "Weight (kg)");
        const ht = parsePositive(heightRaw(), "Height (cm)");
        const sexP = parseSex(s);
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (!sexP.ok) return { error: sexP.error };
        const computed = medicalAdjustedBodyWeight({
          weightKg: wt.value,
          heightCm: ht.value,
          sex: sexP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.ajbwKg)} kg`,
          primaryLabel: "Adjusted body weight",
          rows: [
            { label: "IBW (Devine)", value: `${num(computed.ibwKg)} kg` },
            { label: "Sex", value: sexP.value },
          ],
        };
      }
      case "ffmi": {
        const wt = parsePositive(weightRaw(), "Weight (kg)");
        const ht = parsePositive(heightRaw(), "Height (cm)");
        const bfP = parsePositive(a, "Body fat %");
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (!bfP.ok) return { error: bfP.error };
        const computed = medicalFfmi({
          weightKg: wt.value,
          heightCm: ht.value,
          bodyFatPct: bfP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ffmi),
          primaryLabel: "FFMI",
          rows: [{ label: "Fat-free mass", value: `${num(computed.ffmKg)} kg` }],
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- weightRaw/heightRaw read live state
  }, [config.mode, a, b, c, r, t, s, w, h]);

  const needsWeight =
    config.mode === "bmi" ||
    config.mode === "bmr" ||
    config.mode === "lbm" ||
    config.mode === "bsa" ||
    config.mode === "ajbw" ||
    config.mode === "ffmi";
  const needsHeight =
    config.mode === "bmi" ||
    config.mode === "bmr" ||
    config.mode === "bodyFat" ||
    config.mode === "ibw" ||
    config.mode === "lbm" ||
    config.mode === "bsa" ||
    config.mode === "ajbw" ||
    config.mode === "ffmi";
  const needsSex =
    config.mode === "bmr" ||
    config.mode === "bodyFat" ||
    config.mode === "ibw" ||
    config.mode === "lbm" ||
    config.mode === "ajbw";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {needsWeight ? (
            <div>
              <FieldLabel htmlFor="mbm-w">Weight (kg)</FieldLabel>
              <FieldInput id="mbm-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {needsHeight ? (
            <div>
              <FieldLabel htmlFor="mbm-h">Height (cm)</FieldLabel>
              <FieldInput id="mbm-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {needsSex ? (
            <div>
              <FieldLabel htmlFor="mbm-s">Sex (male or female)</FieldLabel>
              <FieldInput id="mbm-s" value={s} onChange={(ev) => setS(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "bmr" ? (
            <div>
              <FieldLabel htmlFor="mbm-age">Age (years)</FieldLabel>
              <FieldInput id="mbm-age" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
            </div>
          ) : null}

          {config.mode === "bodyFat" ? (
            <>
              <div>
                <FieldLabel htmlFor="mbm-waist">Waist (cm)</FieldLabel>
                <FieldInput id="mbm-waist" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mbm-neck">Neck (cm)</FieldLabel>
                <FieldInput id="mbm-neck" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mbm-hip">Hip (cm) — required for female</FieldLabel>
                <FieldInput id="mbm-hip" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "whr" ? (
            <>
              <div>
                <FieldLabel htmlFor="mbm-whr-w">Waist (cm)</FieldLabel>
                <FieldInput id="mbm-whr-w" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mbm-whr-h">Hip (cm)</FieldLabel>
                <FieldInput id="mbm-whr-h" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ffmi" ? (
            <div>
              <FieldLabel htmlFor="mbm-bf">Body fat %</FieldLabel>
              <FieldInput id="mbm-bf" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
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
