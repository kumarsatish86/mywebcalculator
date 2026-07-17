"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_PREGNANCY_URL,
  conception,
  fertilityWindow,
  menstrualCycle,
  ovulation,
  pregnancyDueDate,
  pregnancyWeightGain,
} from "@/lib/calculators/biologyPregnancy";

type PregnancySlug =
  | "ovulation-calculator"
  | "pregnancy-due-date-calculator"
  | "fertility-window-calculator"
  | "menstrual-cycle-calculator"
  | "conception-calculator"
  | "pregnancy-weight-gain-calculator";

type Mode = "ovulation" | "dueDate" | "fertility" | "menstrual" | "conception" | "weightGain";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
};

const CONFIG: Record<PregnancySlug, Config> = {
  "ovulation-calculator": {
    title: "Ovulation estimate",
    description: "Educational estimate: LMP + (cycle length − 14). Not medical advice.",
    mode: "ovulation",
    aDefault: "2026-01-01",
    bDefault: "28",
  },
  "pregnancy-due-date-calculator": {
    title: "Pregnancy due date",
    description: "Naegele-style estimate: LMP + 280 days. Not medical advice.",
    mode: "dueDate",
    aDefault: "2026-01-01",
    bDefault: "",
  },
  "fertility-window-calculator": {
    title: "Fertility window",
    description: "Educational window ≈ ovulation − 5 … ovulation + 1. Not medical advice.",
    mode: "fertility",
    aDefault: "2026-01-01",
    bDefault: "28",
  },
  "menstrual-cycle-calculator": {
    title: "Menstrual cycle",
    description: "Next period and ovulation day from LMP. Educational only — not medical advice.",
    mode: "menstrual",
    aDefault: "2026-01-01",
    bDefault: "28",
  },
  "conception-calculator": {
    title: "Conception estimate",
    description: "Educational estimate near ovulation day. Not medical advice.",
    mode: "conception",
    aDefault: "2026-01-01",
    bDefault: "28",
  },
  "pregnancy-weight-gain-calculator": {
    title: "Pregnancy weight gain band",
    description: "IOM-style total-gain ranges by BMI — educational estimates only, not medical advice.",
    mode: "weightGain",
    aDefault: "22",
    bDefault: "10",
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

export function BiologyPregnancyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PregnancySlug] ?? CONFIG["ovulation-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_PREGNANCY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_PREGNANCY_URL.B, config.bDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "dueDate") {
      return { [BIOLOGY_PREGNANCY_URL.A]: a };
    }
    return {
      [BIOLOGY_PREGNANCY_URL.A]: a,
      [BIOLOGY_PREGNANCY_URL.B]: b,
    };
  }, [a, b, config.mode]);

  useLoanUrlSync(shareParams, [a, b]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "ovulation": {
        const cycleP = parsePositive(b, "Cycle length (days)");
        if (!cycleP.ok) return { error: cycleP.error };
        const computed = ovulation({ lmpYmd: a, cycleLength: cycleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.ovulationYmd,
          primaryLabel: "Estimated ovulation date",
          rows: [
            { label: "LMP", value: a.trim() || "—" },
            { label: "Cycle length", value: `${num(cycleP.value, 0)} days` },
            { label: "Day in cycle", value: `${computed.dayInCycle}` },
          ],
        };
      }
      case "dueDate": {
        const computed = pregnancyDueDate({ lmpYmd: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.dueYmd,
          primaryLabel: "Estimated due date",
          rows: [
            { label: "LMP", value: a.trim() || "—" },
            { label: "Method", value: "LMP + 280 days" },
          ],
        };
      }
      case "fertility": {
        const cycleP = parsePositive(b, "Cycle length (days)");
        if (!cycleP.ok) return { error: cycleP.error };
        const computed = fertilityWindow({ lmpYmd: a, cycleLength: cycleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.startYmd} → ${computed.endYmd}`,
          primaryLabel: "Fertility window",
          rows: [
            { label: "Ovulation", value: computed.ovulationYmd },
            { label: "Start", value: computed.startYmd },
            { label: "End", value: computed.endYmd },
            { label: "LMP", value: a.trim() || "—" },
          ],
        };
      }
      case "menstrual": {
        const cycleP = parsePositive(b, "Cycle length (days)");
        if (!cycleP.ok) return { error: cycleP.error };
        const computed = menstrualCycle({ lmpYmd: a, cycleLength: cycleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.nextPeriodYmd,
          primaryLabel: "Next period (estimate)",
          rows: [
            { label: "Ovulation", value: computed.ovulationYmd },
            { label: "LMP", value: a.trim() || "—" },
            { label: "Cycle length", value: `${num(cycleP.value, 0)} days` },
          ],
        };
      }
      case "conception": {
        const cycleP = parsePositive(b, "Cycle length (days)");
        if (!cycleP.ok) return { error: cycleP.error };
        const computed = conception({ lmpYmd: a, cycleLength: cycleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.conceptionYmd,
          primaryLabel: "Conception estimate",
          rows: [
            { label: "LMP", value: a.trim() || "—" },
            { label: "Cycle length", value: `${num(cycleP.value, 0)} days` },
            { label: "Note", value: "Aligned to ovulation day (educational)" },
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
          primary: `${num(computed.recommendedMinKg)}–${num(computed.recommendedMaxKg)} kg`,
          primaryLabel: "Typical total-gain band",
          rows: [
            { label: "Status", value: computed.status },
            { label: "BMI", value: num(bmiP.value) },
            { label: "Current gain", value: `${num(gainP.value)} kg` },
          ],
        };
      }
    }
  }, [config.mode, a, b]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "ovulation" ||
          config.mode === "fertility" ||
          config.mode === "menstrual" ||
          config.mode === "conception" ? (
            <>
              <div>
                <FieldLabel htmlFor="bpreg-lmp">LMP date (YYYY-MM-DD)</FieldLabel>
                <FieldInput id="bpreg-lmp" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bpreg-cycle">Cycle length (days)</FieldLabel>
                <FieldInput
                  id="bpreg-cycle"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "dueDate" ? (
            <div>
              <FieldLabel htmlFor="bpreg-duelmp">LMP date (YYYY-MM-DD)</FieldLabel>
              <FieldInput id="bpreg-duelmp" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "weightGain" ? (
            <>
              <div>
                <FieldLabel htmlFor="bpreg-bmi">Pre-pregnancy BMI</FieldLabel>
                <FieldInput id="bpreg-bmi" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bpreg-gain">Current weight gain (kg)</FieldLabel>
                <FieldInput id="bpreg-gain" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
