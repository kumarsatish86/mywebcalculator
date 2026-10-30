"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_DRUG_URL,
  anionGap,
  correctedCalcium,
  creatinineClearance,
  dosageMgKg,
  egfrCkdepi,
  infusionRate,
  ivDripRate,
} from "@/lib/calculators/medicalDrugDosage";

type DrugSlug =
  | "medical-dosage-calculator-mg-kg"
  | "medical-iv-drip-rate-calculator"
  | "medical-infusion-rate-calculator"
  | "medical-creatinine-clearance-calculator"
  | "medical-egfr-calculator"
  | "medical-corrected-calcium-calculator"
  | "medical-anion-gap-calculator";

type Mode = "mgKg" | "drip" | "infusion" | "crcl" | "egfr" | "calcium" | "ag";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  sDefault: string;
};

const DISCLAIMER =
  "Educational pharmacology arithmetic only — not a prescription, pharmacy verification, dosing order, or medical advice. Confirm formulas, units, and renal adjustments with qualified clinicians and current labels; never use this tool for patient management.";

const CONFIG: Record<DrugSlug, Config> = {
  "medical-dosage-calculator-mg-kg": {
    title: "Dosage (mg/kg)",
    description: `dose_mg = weight_kg × mg/kg. ${DISCLAIMER}`,
    mode: "mgKg",
    aDefault: "70",
    bDefault: "5",
    cDefault: "",
    sDefault: "",
  },
  "medical-iv-drip-rate-calculator": {
    title: "IV drip rate",
    description: `gtt/min = (volume_mL × drop factor) / time_min. ${DISCLAIMER}`,
    mode: "drip",
    aDefault: "1000",
    bDefault: "480",
    cDefault: "15",
    sDefault: "",
  },
  "medical-infusion-rate-calculator": {
    title: "Infusion rate",
    description: `mL/hr = volume_mL / hours. ${DISCLAIMER}`,
    mode: "infusion",
    aDefault: "1000",
    bDefault: "8",
    cDefault: "",
    sDefault: "",
  },
  "medical-creatinine-clearance-calculator": {
    title: "Creatinine clearance (Cockcroft–Gault)",
    description: `CrCl from age, weight, creatinine (mg/dL), and sex (male|female). ${DISCLAIMER}`,
    mode: "crcl",
    aDefault: "50",
    bDefault: "70",
    cDefault: "1.0",
    sDefault: "male",
  },
  "medical-egfr-calculator": {
    title: "eGFR (CKD-EPI 2021 teaching)",
    description: `Race-free CKD-EPI teaching form from age, creatinine (mg/dL), sex male|female. ${DISCLAIMER}`,
    mode: "egfr",
    aDefault: "50",
    bDefault: "1.0",
    cDefault: "",
    sDefault: "female",
  },
  "medical-corrected-calcium-calculator": {
    title: "Corrected calcium",
    description: `Corrected Ca = measured + 0.8 × (4 − albumin). ${DISCLAIMER}`,
    mode: "calcium",
    aDefault: "8.5",
    bDefault: "3.2",
    cDefault: "",
    sDefault: "",
  },
  "medical-anion-gap-calculator": {
    title: "Anion gap",
    description: `AG = Na − (Cl + HCO₃) with teaching bands. ${DISCLAIMER}`,
    mode: "ag",
    aDefault: "140",
    bDefault: "104",
    cDefault: "24",
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

function parseSex(raw: string): { ok: true; value: "male" | "female" } | { ok: false; error: string } {
  const s = raw.trim().toLowerCase();
  if (s === "male" || s === "female") return { ok: true, value: s };
  return { ok: false, error: "Sex must be male or female." };
}

export function MedicalDrugDosageCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as DrugSlug] ?? CONFIG["medical-dosage-calculator-mg-kg"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_DRUG_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_DRUG_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_DRUG_URL.C, config.cDefault));
  const [s, setS] = useState(useLoanInitialInput(MEDICAL_DRUG_URL.S, config.sDefault));

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
      case "mgKg":
      case "infusion":
      case "calcium":
        put(MEDICAL_DRUG_URL.A, a);
        put(MEDICAL_DRUG_URL.B, b);
        break;
      case "drip":
      case "ag":
        put(MEDICAL_DRUG_URL.A, a);
        put(MEDICAL_DRUG_URL.B, b);
        put(MEDICAL_DRUG_URL.C, c);
        break;
      case "crcl":
        put(MEDICAL_DRUG_URL.A, a);
        put(MEDICAL_DRUG_URL.B, b);
        put(MEDICAL_DRUG_URL.C, c);
        put(MEDICAL_DRUG_URL.S, s);
        break;
      case "egfr":
        put(MEDICAL_DRUG_URL.A, a);
        put(MEDICAL_DRUG_URL.B, b);
        put(MEDICAL_DRUG_URL.S, s);
        break;
    }
    return out;
  }, [a, b, c, s, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, s]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "mgKg": {
        const wP = parsePositive(a, "Weight (kg)");
        const mgP = parsePositive(b, "mg/kg");
        if (!wP.ok) return { error: wP.error };
        if (!mgP.ok) return { error: mgP.error };
        const computed = dosageMgKg({ weightKg: wP.value, mgPerKg: mgP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.doseMg)} mg`,
          primaryLabel: "Dose",
          rows: [
            { label: "Weight (kg)", value: num(wP.value) },
            { label: "mg/kg", value: num(mgP.value) },
          ],
        };
      }
      case "drip": {
        const volP = parsePositive(a, "Volume (mL)");
        const timeP = parsePositive(b, "Time (min)");
        const dropP = parsePositive(c, "Drop factor");
        if (!volP.ok) return { error: volP.error };
        if (!timeP.ok) return { error: timeP.error };
        if (!dropP.ok) return { error: dropP.error };
        const computed = ivDripRate({
          volumeMl: volP.value,
          timeMin: timeP.value,
          dropFactor: dropP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gttPerMin, 1),
          primaryLabel: "gtt/min",
          rows: [{ label: "Volume (mL)", value: num(volP.value) }],
        };
      }
      case "infusion": {
        const volP = parsePositive(a, "Volume (mL)");
        const hrP = parsePositive(b, "Hours");
        if (!volP.ok) return { error: volP.error };
        if (!hrP.ok) return { error: hrP.error };
        const computed = infusionRate({ volumeMl: volP.value, hours: hrP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.mlPerHr)} mL/hr`,
          primaryLabel: "Infusion rate",
          rows: [{ label: "Hours", value: num(hrP.value) }],
        };
      }
      case "crcl": {
        const ageP = parsePositive(a, "Age");
        const wP = parsePositive(b, "Weight (kg)");
        const crP = parsePositive(c, "Creatinine (mg/dL)");
        const sexP = parseSex(s);
        if (!ageP.ok) return { error: ageP.error };
        if (!wP.ok) return { error: wP.error };
        if (!crP.ok) return { error: crP.error };
        if (!sexP.ok) return { error: sexP.error };
        const computed = creatinineClearance({
          age: ageP.value,
          weightKg: wP.value,
          creatinineMgDl: crP.value,
          sex: sexP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.crcl)} mL/min`,
          primaryLabel: "CrCl (Cockcroft–Gault)",
          rows: [{ label: "Sex", value: sexP.value }],
        };
      }
      case "egfr": {
        const ageP = parsePositive(a, "Age");
        const crP = parsePositive(b, "Creatinine (mg/dL)");
        const sexP = parseSex(s);
        if (!ageP.ok) return { error: ageP.error };
        if (!crP.ok) return { error: crP.error };
        if (!sexP.ok) return { error: sexP.error };
        const computed = egfrCkdepi({
          age: ageP.value,
          creatinineMgDl: crP.value,
          sex: sexP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.egfr),
          primaryLabel: "eGFR (mL/min/1.73 m² teaching)",
          rows: [
            { label: "Sex", value: sexP.value },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "calcium": {
        const caP = parsePositive(a, "Calcium (mg/dL)");
        const albP = parsePositive(b, "Albumin (g/dL)");
        if (!caP.ok) return { error: caP.error };
        if (!albP.ok) return { error: albP.error };
        const computed = correctedCalcium({
          calciumMgDl: caP.value,
          albuminGDl: albP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.corrected)} mg/dL`,
          primaryLabel: "Corrected calcium",
          rows: [{ label: "Measured Ca", value: num(caP.value) }],
        };
      }
      case "ag": {
        const naP = parsePositive(a, "Na");
        const clP = parsePositive(b, "Cl");
        const hcoP = parsePositive(c, "HCO₃");
        if (!naP.ok) return { error: naP.error };
        if (!clP.ok) return { error: clP.error };
        if (!hcoP.ok) return { error: hcoP.error };
        const computed = anionGap({ na: naP.value, cl: clP.value, hco3: hcoP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gap, 1),
          primaryLabel: "Anion gap",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c, s]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "mgKg" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-wt">Weight (kg)</FieldLabel>
                <FieldInput
                  id="mdr-wt"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-mgkg">mg/kg</FieldLabel>
                <FieldInput
                  id="mdr-mgkg"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "drip" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-vol">Volume (mL)</FieldLabel>
                <FieldInput
                  id="mdr-vol"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-time">Time (min)</FieldLabel>
                <FieldInput
                  id="mdr-time"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-drop">Drop factor (gtt/mL)</FieldLabel>
                <FieldInput
                  id="mdr-drop"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "infusion" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-ivol">Volume (mL)</FieldLabel>
                <FieldInput
                  id="mdr-ivol"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-hrs">Hours</FieldLabel>
                <FieldInput
                  id="mdr-hrs"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "crcl" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-age">Age (years)</FieldLabel>
                <FieldInput
                  id="mdr-age"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-cwt">Weight (kg)</FieldLabel>
                <FieldInput
                  id="mdr-cwt"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-cr">Creatinine (mg/dL)</FieldLabel>
                <FieldInput
                  id="mdr-cr"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-sex">Sex (male or female)</FieldLabel>
                <FieldInput id="mdr-sex" value={s} onChange={(ev) => setS(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "egfr" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-eage">Age (years)</FieldLabel>
                <FieldInput
                  id="mdr-eage"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-ecr">Creatinine (mg/dL)</FieldLabel>
                <FieldInput
                  id="mdr-ecr"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-esex">Sex (male or female)</FieldLabel>
                <FieldInput id="mdr-esex" value={s} onChange={(ev) => setS(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "calcium" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-ca">Calcium (mg/dL)</FieldLabel>
                <FieldInput
                  id="mdr-ca"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-alb">Albumin (g/dL)</FieldLabel>
                <FieldInput
                  id="mdr-alb"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "ag" ? (
            <>
              <div>
                <FieldLabel htmlFor="mdr-na">Na (mEq/L)</FieldLabel>
                <FieldInput
                  id="mdr-na"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-cl">Cl (mEq/L)</FieldLabel>
                <FieldInput
                  id="mdr-cl"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mdr-hco3">HCO₃ (mEq/L)</FieldLabel>
                <FieldInput
                  id="mdr-hco3"
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
