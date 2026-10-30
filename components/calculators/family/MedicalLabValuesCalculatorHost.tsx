"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_LAB_URL,
  albuminCorrectionAg,
  calciumCorrectionLab,
  hemoglobinCorrection,
  potassiumDeficit,
  serumOsmolality,
  sodiumCorrection,
} from "@/lib/calculators/medicalLabValues";

type LabSlug =
  | "medical-hemoglobin-correction-calculator"
  | "medical-serum-osmolality-calculator"
  | "medical-albumin-correction-calculator"
  | "medical-sodium-correction-calculator"
  | "medical-potassium-deficit-calculator"
  | "medical-calcium-correction-calculator";

type Mode = "hb" | "osm" | "albAg" | "na" | "kDef" | "ca";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Educational lab-chemistry arithmetic only — not medical advice, diagnosis, electrolyte protocols, or emergency care. Verify units and formulas with qualified clinicians and your laboratory; never use this tool for patient management.";

const CONFIG: Record<LabSlug, Config> = {
  "medical-hemoglobin-correction-calculator": {
    title: "Hemoglobin altitude correction",
    description: `Illustrative Hb × (1 + 0.03 × altitude_km) — not a WHO cut-off table. ${DISCLAIMER}`,
    mode: "hb",
    aDefault: "14",
    bDefault: "2",
    cDefault: "",
  },
  "medical-serum-osmolality-calculator": {
    title: "Serum osmolality (calculated)",
    description: `2×Na + glucose/18 + BUN/2.8 (mg/dL units). ${DISCLAIMER}`,
    mode: "osm",
    aDefault: "140",
    bDefault: "100",
    cDefault: "14",
  },
  "medical-albumin-correction-calculator": {
    title: "Albumin-corrected anion gap",
    description: `Corrected AG = AG + 2.5 × (4 − albumin). ${DISCLAIMER}`,
    mode: "albAg",
    aDefault: "12",
    bDefault: "3.0",
    cDefault: "",
  },
  "medical-sodium-correction-calculator": {
    title: "Sodium correction (hyperglycemia)",
    description: `Na + 1.6 × ((glucose − 100) / 100). ${DISCLAIMER}`,
    mode: "na",
    aDefault: "130",
    bDefault: "300",
    cDefault: "",
  },
  "medical-potassium-deficit-calculator": {
    title: "Potassium deficit (teaching)",
    description: `(target − current) × 0.4 × weight_kg — rough ECF teaching only. ${DISCLAIMER}`,
    mode: "kDef",
    aDefault: "3.2",
    bDefault: "4.0",
    cDefault: "70",
  },
  "medical-calcium-correction-calculator": {
    title: "Calcium correction (Payne)",
    description: `Corrected Ca = measured + 0.8 × (4 − albumin). ${DISCLAIMER}`,
    mode: "ca",
    aDefault: "8.5",
    bDefault: "3.2",
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

export function MedicalLabValuesCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as LabSlug] ?? CONFIG["medical-hemoglobin-correction-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_LAB_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_LAB_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_LAB_URL.C, config.cDefault));

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
      case "hb":
      case "albAg":
      case "na":
      case "ca":
        put(MEDICAL_LAB_URL.A, a);
        put(MEDICAL_LAB_URL.B, b);
        break;
      case "osm":
      case "kDef":
        put(MEDICAL_LAB_URL.A, a);
        put(MEDICAL_LAB_URL.B, b);
        put(MEDICAL_LAB_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "hb": {
        const hbP = parsePositive(a, "Hemoglobin");
        const altP = parseNonNegative(b, "Altitude (km)");
        if (!hbP.ok) return { error: hbP.error };
        if (!altP.ok) return { error: altP.error };
        const computed = hemoglobinCorrection({ hb: hbP.value, altitudeKm: altP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.corrected),
          primaryLabel: "Corrected Hb (teaching)",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "osm": {
        const naP = parsePositive(a, "Na");
        const gluP = parseNonNegative(b, "Glucose (mg/dL)");
        const bunP = parseNonNegative(c, "BUN (mg/dL)");
        if (!naP.ok) return { error: naP.error };
        if (!gluP.ok) return { error: gluP.error };
        if (!bunP.ok) return { error: bunP.error };
        const computed = serumOsmolality({
          na: naP.value,
          glucoseMgDl: gluP.value,
          bunMgDl: bunP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.osm, 1),
          primaryLabel: "Calculated osm (mOsm/kg teaching)",
          rows: [
            { label: "Na", value: num(naP.value) },
            { label: "Glucose", value: num(gluP.value) },
            { label: "BUN", value: num(bunP.value) },
          ],
        };
      }
      case "albAg": {
        const agP = parseFiniteNumber(a, "Anion gap");
        const albP = parsePositive(b, "Albumin (g/dL)");
        if (!agP.ok) return { error: agP.error };
        if (!albP.ok) return { error: albP.error };
        const computed = albuminCorrectionAg({
          anionGap: agP.value,
          albuminGDl: albP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.correctedGap, 1),
          primaryLabel: "Albumin-corrected AG",
          rows: [{ label: "Measured AG", value: num(agP.value, 1) }],
        };
      }
      case "na": {
        const naP = parsePositive(a, "Na");
        const gluP = parsePositive(b, "Glucose (mg/dL)");
        if (!naP.ok) return { error: naP.error };
        if (!gluP.ok) return { error: gluP.error };
        const computed = sodiumCorrection({ na: naP.value, glucoseMgDl: gluP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.correctedNa, 1),
          primaryLabel: "Corrected Na",
          rows: [{ label: "Measured Na", value: num(naP.value, 1) }],
        };
      }
      case "kDef": {
        const currP = parsePositive(a, "Current K");
        const tgtP = parsePositive(b, "Target K");
        const wP = parsePositive(c, "Weight (kg)");
        if (!currP.ok) return { error: currP.error };
        if (!tgtP.ok) return { error: tgtP.error };
        if (!wP.ok) return { error: wP.error };
        const computed = potassiumDeficit({
          currentK: currP.value,
          targetK: tgtP.value,
          weightKg: wP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deficitMmol)} mmol`,
          primaryLabel: "Teaching K deficit",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "ca": {
        const caP = parsePositive(a, "Calcium (mg/dL)");
        const albP = parsePositive(b, "Albumin (g/dL)");
        if (!caP.ok) return { error: caP.error };
        if (!albP.ok) return { error: albP.error };
        const computed = calciumCorrectionLab({
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
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "hb" ? (
            <>
              <div>
                <FieldLabel htmlFor="mlab-hb">Hemoglobin</FieldLabel>
                <FieldInput
                  id="mlab-hb"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-alt">Altitude (km)</FieldLabel>
                <FieldInput
                  id="mlab-alt"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "osm" ? (
            <>
              <div>
                <FieldLabel htmlFor="mlab-na">Na (mEq/L)</FieldLabel>
                <FieldInput
                  id="mlab-na"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-glu">Glucose (mg/dL)</FieldLabel>
                <FieldInput
                  id="mlab-glu"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-bun">BUN (mg/dL)</FieldLabel>
                <FieldInput
                  id="mlab-bun"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "albAg" ? (
            <>
              <div>
                <FieldLabel htmlFor="mlab-ag">Anion gap</FieldLabel>
                <FieldInput
                  id="mlab-ag"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-alb">Albumin (g/dL)</FieldLabel>
                <FieldInput
                  id="mlab-alb"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "na" ? (
            <>
              <div>
                <FieldLabel htmlFor="mlab-sna">Na (mEq/L)</FieldLabel>
                <FieldInput
                  id="mlab-sna"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-sglu">Glucose (mg/dL)</FieldLabel>
                <FieldInput
                  id="mlab-sglu"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "kDef" ? (
            <>
              <div>
                <FieldLabel htmlFor="mlab-k">Current K (mmol/L)</FieldLabel>
                <FieldInput
                  id="mlab-k"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-kt">Target K (mmol/L)</FieldLabel>
                <FieldInput
                  id="mlab-kt"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-kw">Weight (kg)</FieldLabel>
                <FieldInput
                  id="mlab-kw"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "ca" ? (
            <>
              <div>
                <FieldLabel htmlFor="mlab-ca">Calcium (mg/dL)</FieldLabel>
                <FieldInput
                  id="mlab-ca"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mlab-calb">Albumin (g/dL)</FieldLabel>
                <FieldInput
                  id="mlab-calb"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
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
