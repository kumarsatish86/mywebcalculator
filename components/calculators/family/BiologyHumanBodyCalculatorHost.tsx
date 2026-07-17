"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_HUMAN_URL,
  bloodPressureAnalysis,
  bloodVolume,
  bmiBiology,
  bmrBiology,
  bodySurfaceArea,
  calorieBurn,
  dailyCalorieNeeds,
  glucoseConverter,
  hba1c,
  hemoglobinCorrection,
  idealBodyWeight,
  leanBodyMass,
  maxHeartRate,
  metsFromActivity,
  pulsePressure,
  targetHeartRate,
  vo2Max,
} from "@/lib/calculators/biologyHumanBody";

type HumanSlug =
  | "bmi-calculator-biology"
  | "bmr-calculator"
  | "ideal-body-weight-calculator"
  | "lean-body-mass-calculator"
  | "body-surface-area-calculator"
  | "heart-rate-calculator"
  | "target-heart-rate-calculator"
  | "blood-pressure-analysis-tool"
  | "pulse-pressure-calculator"
  | "calorie-burn-calculator"
  | "daily-calorie-needs-calculator"
  | "vo2-max-calculator"
  | "mets-calculator"
  | "blood-volume-calculator"
  | "hemoglobin-correction-calculator"
  | "glucose-level-converter"
  | "hba1c-calculator";

type Mode =
  | "bmi"
  | "bmr"
  | "ibw"
  | "lbm"
  | "bsa"
  | "maxHr"
  | "targetHr"
  | "bp"
  | "pulse"
  | "burn"
  | "dailyCal"
  | "vo2"
  | "mets"
  | "bloodVol"
  | "hb"
  | "glucose"
  | "hba1c";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  wDefault: string;
  hDefault: string;
  sDefault: string;
  rDefault: string;
  tDefault: string;
};

const CONFIG: Record<HumanSlug, Config> = {
  "bmi-calculator-biology": {
    title: "BMI (biology)",
    description: "BMI = weight (kg) / height (m)². Educational bands only — not medical advice.",
    mode: "bmi",
    aDefault: "",
    bDefault: "",
    wDefault: "70",
    hDefault: "1.75",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "bmr-calculator": {
    title: "BMR (Mifflin–St Jeor)",
    description: "Educational resting energy estimate. Sex: male or female. Not medical advice.",
    mode: "bmr",
    aDefault: "30",
    bDefault: "",
    wDefault: "70",
    hDefault: "175",
    sDefault: "male",
    rDefault: "",
    tDefault: "",
  },
  "ideal-body-weight-calculator": {
    title: "Ideal body weight (Devine)",
    description: "Devine IBW from height (≥ 152 cm) and sex. Educational only — not medical advice.",
    mode: "ibw",
    aDefault: "",
    bDefault: "",
    wDefault: "",
    hDefault: "175",
    sDefault: "male",
    rDefault: "",
    tDefault: "",
  },
  "lean-body-mass-calculator": {
    title: "Lean body mass (Boer)",
    description: "Boer LBM estimate from weight, height, and sex. Not medical advice.",
    mode: "lbm",
    aDefault: "",
    bDefault: "",
    wDefault: "70",
    hDefault: "175",
    sDefault: "male",
    rDefault: "",
    tDefault: "",
  },
  "body-surface-area-calculator": {
    title: "Body surface area (Mosteller)",
    description: "BSA ≈ √((height_cm × weight_kg) / 3600). Educational only — not medical advice.",
    mode: "bsa",
    aDefault: "",
    bDefault: "",
    wDefault: "70",
    hDefault: "175",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "heart-rate-calculator": {
    title: "Max heart rate",
    description: "Educational 220 − age estimate. Not medical advice or exercise prescription.",
    mode: "maxHr",
    aDefault: "30",
    bDefault: "",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "target-heart-rate-calculator": {
    title: "Target heart rate zones",
    description: "Karvonen-style zones from age and resting HR. Educational only — not medical advice.",
    mode: "targetHr",
    aDefault: "30",
    bDefault: "",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "60",
    tDefault: "",
  },
  "blood-pressure-analysis-tool": {
    title: "Blood pressure analysis",
    description: "Educational category bands from systolic/diastolic. Not a diagnosis or medical advice.",
    mode: "bp",
    aDefault: "120",
    bDefault: "80",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "pulse-pressure-calculator": {
    title: "Pulse pressure",
    description: "Pulse pressure = systolic − diastolic. Educational only — not medical advice.",
    mode: "pulse",
    aDefault: "120",
    bDefault: "80",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "calorie-burn-calculator": {
    title: "Calorie burn (MET)",
    description: "kcal ≈ MET × weight (kg) × hours. Educational estimate — not medical advice.",
    mode: "burn",
    aDefault: "5",
    bDefault: "",
    wDefault: "70",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "1",
  },
  "daily-calorie-needs-calculator": {
    title: "Daily calorie needs (TDEE)",
    description: "TDEE ≈ BMR × activity factor. Educational only — not medical advice.",
    mode: "dailyCal",
    aDefault: "1600",
    bDefault: "1.55",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "vo2-max-calculator": {
    title: "VO₂ max estimate",
    description: "Educational VO₂max ≈ 15.3 × (max HR / rest HR). Not medical advice.",
    mode: "vo2",
    aDefault: "190",
    bDefault: "",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "60",
    tDefault: "",
  },
  "mets-calculator": {
    title: "METs from activity",
    description: "MET ≈ (kcal/hour) / weight (kg). Educational intensity estimate — not medical advice.",
    mode: "mets",
    aDefault: "350",
    bDefault: "",
    wDefault: "70",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "blood-volume-calculator": {
    title: "Blood volume (Nadler)",
    description: "Nadler-style blood volume estimate. Sex: male or female. Not medical advice.",
    mode: "bloodVol",
    aDefault: "",
    bDefault: "",
    wDefault: "70",
    hDefault: "175",
    sDefault: "male",
    rDefault: "",
    tDefault: "",
  },
  "hemoglobin-correction-calculator": {
    title: "Hemoglobin altitude factor",
    description: "Educational placeholder: corrected ≈ measured × (1 + 0.03 × km). Not medical advice.",
    mode: "hb",
    aDefault: "14",
    bDefault: "1.5",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "glucose-level-converter": {
    title: "Glucose unit converter",
    description: "Convert mg/dL ↔ mmol/L. Set from flag b=0 (mg/dL) or b=1 (mmol/L). Not medical advice.",
    mode: "glucose",
    aDefault: "90",
    bDefault: "0",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "hba1c-calculator": {
    title: "HbA1c → eAG",
    description: "Educational eAG ≈ 28.7 × A1c − 46.7 (mg/dL). Not medical advice or diagnosis.",
    mode: "hba1c",
    aDefault: "7",
    bDefault: "",
    wDefault: "",
    hDefault: "",
    sDefault: "",
    rDefault: "",
    tDefault: "",
  },
};

function parseSex(raw: string): "male" | "female" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "male" || t === "female") return t;
  return { error: "Sex: enter male or female." };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function BiologyHumanBodyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as HumanSlug] ?? CONFIG["bmi-calculator-biology"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.B, config.bDefault));
  const [w, setW] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.H, config.hDefault));
  const [s, setS] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.S, config.sDefault));
  const [r, setR] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(BIOLOGY_HUMAN_URL.T, config.tDefault));

  const num = (n: number, d = 4) => {
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
      case "bmi":
        put(BIOLOGY_HUMAN_URL.W, w);
        put(BIOLOGY_HUMAN_URL.H, h);
        break;
      case "bmr":
        put(BIOLOGY_HUMAN_URL.A, a);
        put(BIOLOGY_HUMAN_URL.W, w);
        put(BIOLOGY_HUMAN_URL.H, h);
        put(BIOLOGY_HUMAN_URL.S, s);
        break;
      case "ibw":
        put(BIOLOGY_HUMAN_URL.H, h);
        put(BIOLOGY_HUMAN_URL.S, s);
        break;
      case "lbm":
      case "bloodVol":
        put(BIOLOGY_HUMAN_URL.W, w);
        put(BIOLOGY_HUMAN_URL.H, h);
        put(BIOLOGY_HUMAN_URL.S, s);
        break;
      case "bsa":
        put(BIOLOGY_HUMAN_URL.W, w);
        put(BIOLOGY_HUMAN_URL.H, h);
        break;
      case "maxHr":
      case "hba1c":
        put(BIOLOGY_HUMAN_URL.A, a);
        break;
      case "targetHr":
      case "vo2":
        put(BIOLOGY_HUMAN_URL.A, a);
        put(BIOLOGY_HUMAN_URL.R, r);
        break;
      case "bp":
      case "pulse":
      case "dailyCal":
      case "hb":
      case "glucose":
        put(BIOLOGY_HUMAN_URL.A, a);
        put(BIOLOGY_HUMAN_URL.B, b);
        break;
      case "burn":
        put(BIOLOGY_HUMAN_URL.A, a);
        put(BIOLOGY_HUMAN_URL.W, w);
        put(BIOLOGY_HUMAN_URL.T, t);
        break;
      case "mets":
        put(BIOLOGY_HUMAN_URL.A, a);
        put(BIOLOGY_HUMAN_URL.W, w);
        break;
    }
    return out;
  }, [a, b, w, h, s, r, t, config.mode]);

  useLoanUrlSync(shareParams, [a, b, w, h, s, r, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "bmi": {
        const wt = parsePositive(w, "Weight (kg)");
        const ht = parsePositive(h, "Height (m)");
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        const computed = bmiBiology({ weightKg: wt.value, heightM: ht.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.bmi, 2),
          primaryLabel: "BMI",
          rows: [
            { label: "Category", value: computed.category },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "Height", value: `${num(ht.value, 3)} m` },
          ],
        };
      }
      case "bmr": {
        const wt = parsePositive(w, "Weight (kg)");
        const ht = parsePositive(h, "Height (cm)");
        const age = parsePositive(a, "Age");
        const sex = parseSex(s);
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (!age.ok) return { error: age.error };
        if (typeof sex === "object") return { error: sex.error };
        const computed = bmrBiology({
          weightKg: wt.value,
          heightCm: ht.value,
          age: age.value,
          sex,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.bmr, 0)} kcal/day`,
          primaryLabel: "Estimated BMR",
          rows: [
            { label: "Sex", value: sex },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "Height", value: `${num(ht.value, 1)} cm` },
            { label: "Age", value: `${num(age.value, 0)} y` },
          ],
        };
      }
      case "ibw": {
        const ht = parsePositive(h, "Height (cm)");
        const sex = parseSex(s);
        if (!ht.ok) return { error: ht.error };
        if (typeof sex === "object") return { error: sex.error };
        const computed = idealBodyWeight({ heightCm: ht.value, sex });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.ibwKg, 2)} kg`,
          primaryLabel: "Ideal body weight (Devine)",
          rows: [
            { label: "Sex", value: sex },
            { label: "Height", value: `${num(ht.value, 1)} cm` },
          ],
        };
      }
      case "lbm": {
        const wt = parsePositive(w, "Weight (kg)");
        const ht = parsePositive(h, "Height (cm)");
        const sex = parseSex(s);
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (typeof sex === "object") return { error: sex.error };
        const computed = leanBodyMass({ weightKg: wt.value, heightCm: ht.value, sex });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.lbmKg, 2)} kg`,
          primaryLabel: "Lean body mass (Boer)",
          rows: [
            { label: "Sex", value: sex },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "Height", value: `${num(ht.value, 1)} cm` },
          ],
        };
      }
      case "bsa": {
        const wt = parsePositive(w, "Weight (kg)");
        const ht = parsePositive(h, "Height (cm)");
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        const computed = bodySurfaceArea({ weightKg: wt.value, heightCm: ht.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.bsaM2, 3)} m²`,
          primaryLabel: "Body surface area",
          rows: [
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "Height", value: `${num(ht.value, 1)} cm` },
          ],
        };
      }
      case "maxHr": {
        const age = parsePositive(a, "Age");
        if (!age.ok) return { error: age.error };
        const computed = maxHeartRate({ age: age.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.maxHr, 0)} bpm`,
          primaryLabel: "Estimated max HR",
          rows: [{ label: "Age", value: `${num(age.value, 0)} y` }],
        };
      }
      case "targetHr": {
        const age = parsePositive(a, "Age");
        const rest = parsePositive(r, "Resting HR");
        if (!age.ok) return { error: age.error };
        if (!rest.ok) return { error: rest.error };
        const computed = targetHeartRate({ age: age.value, restHr: rest.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.moderateLow, 0)}–${num(computed.moderateHigh, 0)} bpm`,
          primaryLabel: "Moderate zone",
          rows: [
            {
              label: "Vigorous zone",
              value: `${num(computed.vigorousLow, 0)}–${num(computed.vigorousHigh, 0)} bpm`,
            },
            { label: "Age", value: `${num(age.value, 0)} y` },
            { label: "Resting HR", value: `${num(rest.value, 0)} bpm` },
          ],
        };
      }
      case "bp": {
        const sys = parsePositive(a, "Systolic");
        const dia = parsePositive(b, "Diastolic");
        if (!sys.ok) return { error: sys.error };
        if (!dia.ok) return { error: dia.error };
        const computed = bloodPressureAnalysis({ systolic: sys.value, diastolic: dia.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.category,
          primaryLabel: "Educational category",
          rows: [
            { label: "Pulse pressure", value: `${num(computed.pulsePressure, 0)} mmHg` },
            { label: "Systolic", value: `${num(sys.value, 0)} mmHg` },
            { label: "Diastolic", value: `${num(dia.value, 0)} mmHg` },
          ],
        };
      }
      case "pulse": {
        const sys = parsePositive(a, "Systolic");
        const dia = parsePositive(b, "Diastolic");
        if (!sys.ok) return { error: sys.error };
        if (!dia.ok) return { error: dia.error };
        const computed = pulsePressure({ systolic: sys.value, diastolic: dia.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pp, 0)} mmHg`,
          primaryLabel: "Pulse pressure",
          rows: [
            { label: "Systolic", value: `${num(sys.value, 0)} mmHg` },
            { label: "Diastolic", value: `${num(dia.value, 0)} mmHg` },
          ],
        };
      }
      case "burn": {
        const mets = parseNonNegative(a, "METs");
        const wt = parsePositive(w, "Weight (kg)");
        const hours = parseNonNegative(t, "Hours");
        if (!mets.ok) return { error: mets.error };
        if (!wt.ok) return { error: wt.error };
        if (!hours.ok) return { error: hours.error };
        const computed = calorieBurn({ mets: mets.value, weightKg: wt.value, hours: hours.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.kcal, 1)} kcal`,
          primaryLabel: "Estimated burn",
          rows: [
            { label: "METs", value: num(mets.value, 2) },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "Duration", value: `${num(hours.value, 2)} h` },
          ],
        };
      }
      case "dailyCal": {
        const bmr = parsePositive(a, "BMR");
        const act = parsePositive(b, "Activity factor");
        if (!bmr.ok) return { error: bmr.error };
        if (!act.ok) return { error: act.error };
        const computed = dailyCalorieNeeds({ bmr: bmr.value, activityFactor: act.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.tdee, 0)} kcal/day`,
          primaryLabel: "Estimated TDEE",
          rows: [
            { label: "BMR", value: `${num(bmr.value, 0)} kcal` },
            { label: "Activity factor", value: num(act.value, 2) },
          ],
        };
      }
      case "vo2": {
        const maxHr = parsePositive(a, "Max HR");
        const rest = parsePositive(r, "Resting HR");
        if (!maxHr.ok) return { error: maxHr.error };
        if (!rest.ok) return { error: rest.error };
        const computed = vo2Max({ maxHr: maxHr.value, restHr: rest.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.vo2, 2)} mL/kg/min`,
          primaryLabel: "Estimated VO₂ max",
          rows: [
            { label: "Max HR", value: `${num(maxHr.value, 0)} bpm` },
            { label: "Resting HR", value: `${num(rest.value, 0)} bpm` },
          ],
        };
      }
      case "mets": {
        const kcal = parseNonNegative(a, "kcal/hour");
        const wt = parsePositive(w, "Weight (kg)");
        if (!kcal.ok) return { error: kcal.error };
        if (!wt.ok) return { error: wt.error };
        const computed = metsFromActivity({ kcalPerHour: kcal.value, weightKg: wt.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mets, 2),
          primaryLabel: "METs",
          rows: [
            { label: "kcal/hour", value: num(kcal.value, 1) },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
          ],
        };
      }
      case "bloodVol": {
        const wt = parsePositive(w, "Weight (kg)");
        const ht = parsePositive(h, "Height (cm)");
        const sex = parseSex(s);
        if (!wt.ok) return { error: wt.error };
        if (!ht.ok) return { error: ht.error };
        if (typeof sex === "object") return { error: sex.error };
        const computed = bloodVolume({ weightKg: wt.value, heightCm: ht.value, sex });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.volumeL, 3)} L`,
          primaryLabel: "Estimated blood volume",
          rows: [
            { label: "Sex", value: sex },
            { label: "Weight", value: `${num(wt.value, 2)} kg` },
            { label: "Height", value: `${num(ht.value, 1)} cm` },
          ],
        };
      }
      case "hb": {
        const measured = parsePositive(a, "Measured Hb");
        const alt = parseNonNegative(b, "Altitude (km)");
        if (!measured.ok) return { error: measured.error };
        if (!alt.ok) return { error: alt.error };
        const computed = hemoglobinCorrection({ measured: measured.value, altitudeKm: alt.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.corrected, 2),
          primaryLabel: "Corrected Hb (educational)",
          rows: [
            { label: "Measured", value: num(measured.value, 2) },
            { label: "Altitude", value: `${num(alt.value, 2)} km` },
          ],
        };
      }
      case "glucose": {
        const value = parsePositive(a, "Glucose value");
        const fromFlag = parseFiniteNumber(b, "From flag (0=mg/dL, 1=mmol/L)");
        if (!value.ok) return { error: value.error };
        if (!fromFlag.ok) return { error: fromFlag.error };
        const from = fromFlag.value === 1 ? "mmol" : "mgdl";
        const computed = glucoseConverter({ value: value.value, from });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.mgdl, 2)} mg/dL · ${num(computed.mmol, 3)} mmol/L`,
          primaryLabel: "Converted glucose",
          rows: [
            { label: "Input from", value: from === "mgdl" ? "mg/dL (b=0)" : "mmol/L (b=1)" },
            { label: "mg/dL", value: num(computed.mgdl, 2) },
            { label: "mmol/L", value: num(computed.mmol, 3) },
          ],
        };
      }
      case "hba1c": {
        const a1c = parsePositive(a, "A1c %");
        if (!a1c.ok) return { error: a1c.error };
        const computed = hba1c({ a1cPercent: a1c.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.eagMgdl, 1)} mg/dL`,
          primaryLabel: "Estimated average glucose",
          rows: [
            { label: "eAG (mmol/L)", value: num(computed.eagMmol, 2) },
            { label: "A1c", value: `${num(a1c.value, 2)} %` },
          ],
        };
      }
    }
  }, [config.mode, a, b, w, h, s, r, t]);

  const needsSex =
    config.mode === "bmr" ||
    config.mode === "ibw" ||
    config.mode === "lbm" ||
    config.mode === "bloodVol";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "bmi" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-w">Weight (kg)</FieldLabel>
                <FieldInput id="bhb-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-h">Height (m)</FieldLabel>
                <FieldInput id="bhb-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "bmr" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-w">Weight (kg)</FieldLabel>
                <FieldInput id="bhb-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-h">Height (cm)</FieldLabel>
                <FieldInput id="bhb-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-a">Age (years)</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ibw" ? (
            <div>
              <FieldLabel htmlFor="bhb-h">Height (cm)</FieldLabel>
              <FieldInput id="bhb-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "lbm" || config.mode === "bsa" || config.mode === "bloodVol" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-w">Weight (kg)</FieldLabel>
                <FieldInput id="bhb-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-h">Height (cm)</FieldLabel>
                <FieldInput id="bhb-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "maxHr" ? (
            <div>
              <FieldLabel htmlFor="bhb-a">Age (years)</FieldLabel>
              <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "targetHr" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">Age (years)</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-r">Resting HR (bpm)</FieldLabel>
                <FieldInput id="bhb-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "bp" || config.mode === "pulse" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">Systolic (mmHg)</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-b">Diastolic (mmHg)</FieldLabel>
                <FieldInput id="bhb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "burn" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">METs</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-w">Weight (kg)</FieldLabel>
                <FieldInput id="bhb-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-t">Duration (hours)</FieldLabel>
                <FieldInput id="bhb-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "dailyCal" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">BMR (kcal/day)</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-b">Activity factor</FieldLabel>
                <FieldInput id="bhb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "vo2" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">Max HR (bpm)</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-r">Resting HR (bpm)</FieldLabel>
                <FieldInput id="bhb-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "mets" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">kcal per hour</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-w">Weight (kg)</FieldLabel>
                <FieldInput id="bhb-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "hb" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">Measured Hb</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-b">Altitude (km)</FieldLabel>
                <FieldInput id="bhb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "glucose" ? (
            <>
              <div>
                <FieldLabel htmlFor="bhb-a">Glucose value</FieldLabel>
                <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bhb-b">From (0 = mg/dL, 1 = mmol/L)</FieldLabel>
                <FieldInput id="bhb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "hba1c" ? (
            <div>
              <FieldLabel htmlFor="bhb-a">A1c (%)</FieldLabel>
              <FieldInput id="bhb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {needsSex ? (
            <div>
              <FieldLabel htmlFor="bhb-s">Sex (male / female)</FieldLabel>
              <FieldInput id="bhb-s" value={s} onChange={(ev) => setS(ev.target.value)} />
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
