"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_PREGNANCY_URL,
  conceptionCalculator,
  fertilityWindow,
  gestationalAge,
  ivfSuccess,
  menstrualCycle,
  ovulationCalculator,
  pregnancyDueDate,
  pregnancyWeightGain,
} from "@/lib/calculators/medicalPregnancy";

type PregnancySlug =
  | "medical-pregnancy-due-date-calculator"
  | "medical-ovulation-calculator"
  | "medical-fertility-window-calculator"
  | "medical-gestational-age-calculator"
  | "medical-pregnancy-weight-gain-calculator"
  | "medical-conception-calculator"
  | "medical-ivf-success-calculator"
  | "medical-menstrual-cycle-calculator";

type Mode =
  | "dueDate"
  | "ovulation"
  | "fertility"
  | "gestational"
  | "weightGain"
  | "conception"
  | "ivf"
  | "menstrual";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Educational pregnancy/cycle dating arithmetic only — not obstetric diagnosis, prenatal care, fertility treatment, or medical advice. Confirm dates and guidance with qualified clinicians; never use this tool alone for clinical decisions.";

const CONFIG: Record<PregnancySlug, Config> = {
  "medical-pregnancy-due-date-calculator": {
    title: "Pregnancy due date",
    description: `Naegele’s rule: LMP + 280 days (YYYY-MM-DD). ${DISCLAIMER}`,
    mode: "dueDate",
    aDefault: "2026-01-01",
    bDefault: "",
    cDefault: "",
  },
  "medical-ovulation-calculator": {
    title: "Ovulation date",
    description: `Estimates ovulation ~14 days before next period from LMP and cycle length. ${DISCLAIMER}`,
    mode: "ovulation",
    aDefault: "2026-01-01",
    bDefault: "28",
    cDefault: "",
  },
  "medical-fertility-window-calculator": {
    title: "Fertility window",
    description: `Approximate fertile window around estimated ovulation from LMP and cycle length. ${DISCLAIMER}`,
    mode: "fertility",
    aDefault: "2026-01-01",
    bDefault: "28",
    cDefault: "",
  },
  "medical-gestational-age-calculator": {
    title: "Gestational age",
    description: `Weeks/days from LMP to today (optional YYYY-MM-DD). ${DISCLAIMER}`,
    mode: "gestational",
    aDefault: "2026-01-01",
    bDefault: "",
    cDefault: "",
  },
  "medical-pregnancy-weight-gain-calculator": {
    title: "Pregnancy weight gain",
    description: `IOM-style total gain bands by pre-pregnancy BMI vs current gain (kg). ${DISCLAIMER}`,
    mode: "weightGain",
    aDefault: "22",
    bDefault: "8",
    cDefault: "",
  },
  "medical-conception-calculator": {
    title: "Conception estimate",
    description: `Teaching conception estimate aligned with ovulation day from LMP/cycle. ${DISCLAIMER}`,
    mode: "conception",
    aDefault: "2026-01-01",
    bDefault: "28",
    cDefault: "",
  },
  "medical-ivf-success-calculator": {
    title: "IVF success (age band)",
    description: `Illustrative age-band success % only — clinic outcomes vary widely. ${DISCLAIMER}`,
    mode: "ivf",
    aDefault: "32",
    bDefault: "",
    cDefault: "",
  },
  "medical-menstrual-cycle-calculator": {
    title: "Menstrual cycle",
    description: `Next period estimate from LMP + cycle length (YYYY-MM-DD). ${DISCLAIMER}`,
    mode: "menstrual",
    aDefault: "2026-01-01",
    bDefault: "28",
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

function optionalCycle(raw: string): { ok: true; value?: number } | { ok: false; error: string } {
  if (raw.trim() === "") return { ok: true, value: undefined };
  const p = parsePositive(raw, "Cycle length");
  if (!p.ok) return p;
  return { ok: true, value: p.value };
}

export function MedicalPregnancyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PregnancySlug] ?? CONFIG["medical-pregnancy-due-date-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_PREGNANCY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_PREGNANCY_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_PREGNANCY_URL.C, config.cDefault));

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
      case "dueDate":
      case "ivf":
        put(MEDICAL_PREGNANCY_URL.A, a);
        break;
      case "ovulation":
      case "fertility":
      case "conception":
      case "menstrual":
      case "gestational":
      case "weightGain":
        put(MEDICAL_PREGNANCY_URL.A, a);
        put(MEDICAL_PREGNANCY_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "dueDate": {
        const computed = pregnancyDueDate({ lmp: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.edd,
          primaryLabel: "Estimated due date",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "ovulation": {
        const cycle = optionalCycle(b);
        if (!cycle.ok) return { error: cycle.error };
        const computed = ovulationCalculator({ lmp: a, cycleLength: cycle.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.ovulation,
          primaryLabel: "Estimated ovulation",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "fertility": {
        const cycle = optionalCycle(b);
        if (!cycle.ok) return { error: cycle.error };
        const computed = fertilityWindow({ lmp: a, cycleLength: cycle.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.start} → ${computed.end}`,
          primaryLabel: "Fertility window",
          rows: [
            { label: "Start", value: computed.start },
            { label: "End", value: computed.end },
            { label: "Ovulation", value: computed.ovulation },
          ],
        };
      }
      case "gestational": {
        const computed = gestationalAge({
          lmp: a,
          today: b.trim() !== "" ? b : undefined,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.weeks}w ${computed.days}d`,
          primaryLabel: "Gestational age",
          rows: [
            { label: "Total days", value: String(computed.totalDays) },
            { label: "Weeks", value: String(computed.weeks) },
            { label: "Days", value: String(computed.days) },
          ],
        };
      }
      case "weightGain": {
        const bmiP = parsePositive(a, "Pre-pregnancy BMI");
        const gainP = parseFiniteNumber(b, "Current gain (kg)");
        if (!bmiP.ok) return { error: bmiP.error };
        if (!gainP.ok) return { error: gainP.error };
        const computed = pregnancyWeightGain({
          preBmi: bmiP.value,
          currentGainKg: gainP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.recommendedKg} kg`,
          primaryLabel: "Teaching total range",
          rows: [{ label: "Status", value: computed.status }],
        };
      }
      case "conception": {
        const cycle = optionalCycle(b);
        if (!cycle.ok) return { error: cycle.error };
        const computed = conceptionCalculator({ lmp: a, cycleLength: cycle.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.conceptionEstimate,
          primaryLabel: "Conception estimate",
          rows: [{ label: "Aligned with", value: "Estimated ovulation day" }],
        };
      }
      case "ivf": {
        const ageP = parsePositive(a, "Age");
        if (!ageP.ok) return { error: ageP.error };
        const computed = ivfSuccess({ age: ageP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.successPct, 0)}%`,
          primaryLabel: "Illustrative success %",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "menstrual": {
        const cycle = optionalCycle(b);
        if (!cycle.ok) return { error: cycle.error };
        const computed = menstrualCycle({ lmp: a, cycleLength: cycle.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.nextPeriod,
          primaryLabel: "Next period estimate",
          rows: [{ label: "Cycle length (days)", value: String(computed.cycleLength) }],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "dueDate" ? (
            <div>
              <FieldLabel htmlFor="mp-lmp">LMP (YYYY-MM-DD)</FieldLabel>
              <FieldInput id="mp-lmp" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "ovulation" ||
          config.mode === "fertility" ||
          config.mode === "conception" ||
          config.mode === "menstrual" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-lmp-cycle">LMP (YYYY-MM-DD)</FieldLabel>
                <FieldInput id="mp-lmp-cycle" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="mp-cycle">Cycle length (days, optional)</FieldLabel>
                <FieldInput
                  id="mp-cycle"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
            </>
          ) : null}

          {config.mode === "gestational" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-lmp-ga">LMP (YYYY-MM-DD)</FieldLabel>
                <FieldInput id="mp-lmp-ga" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="mp-today">Today (YYYY-MM-DD, optional)</FieldLabel>
                <FieldInput id="mp-today" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "weightGain" ? (
            <>
              <div>
                <FieldLabel htmlFor="mp-bmi">Pre-pregnancy BMI</FieldLabel>
                <FieldInput
                  id="mp-bmi"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="mp-gain">Current gain (kg)</FieldLabel>
                <FieldInput
                  id="mp-gain"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "ivf" ? (
            <div>
              <FieldLabel htmlFor="mp-age">Age (years)</FieldLabel>
              <FieldInput
                id="mp-age"
                value={a}
                onChange={(ev) => setA(ev.target.value)}
                inputMode="numeric"
              />
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
