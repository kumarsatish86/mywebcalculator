"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_NEURO_URL,
  circadianRhythm,
  cognitiveLoad,
  reactionTime,
  sleepCycle,
} from "@/lib/calculators/biologyNeuroscience";

type NeuroSlug =
  | "reaction-time-calculator"
  | "cognitive-load-calculator"
  | "sleep-cycle-calculator"
  | "circadian-rhythm-calculator";

type Mode = "reaction" | "cognitive" | "sleep" | "circadian";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<NeuroSlug, Config> = {
  "reaction-time-calculator": {
    title: "Reaction time",
    description: "Mean, min, and max reaction time (ms) from CSV samples. Educational — not clinical.",
    mode: "reaction",
    aDefault: "240,255,230,260,245",
    bDefault: "",
    cDefault: "",
  },
  "cognitive-load-calculator": {
    title: "Cognitive load",
    description: "Load index = (tasks × difficulty) / capacity. Classroom heuristic — not clinical assessment.",
    mode: "cognitive",
    aDefault: "4",
    bDefault: "3",
    cDefault: "10",
  },
  "sleep-cycle-calculator": {
    title: "Sleep cycle",
    description: "Suggests wake times from bedtime (HH:MM) using ~90 min cycles + 15 min fall-asleep buffer.",
    mode: "sleep",
    aDefault: "23:00",
    bDefault: "5",
    cDefault: "",
  },
  "circadian-rhythm-calculator": {
    title: "Circadian rhythm helper",
    description: "Suggested bedtime from wake time and target sleep hours (+15 min wind-down). Educational only.",
    mode: "circadian",
    aDefault: "07:00",
    bDefault: "8",
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

export function BiologyNeuroscienceCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as NeuroSlug] ?? CONFIG["reaction-time-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_NEURO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_NEURO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_NEURO_URL.C, config.cDefault));

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
      case "reaction":
        put(BIOLOGY_NEURO_URL.A, a);
        break;
      case "cognitive":
        put(BIOLOGY_NEURO_URL.A, a);
        put(BIOLOGY_NEURO_URL.B, b);
        put(BIOLOGY_NEURO_URL.C, c);
        break;
      case "sleep":
        put(BIOLOGY_NEURO_URL.A, a);
        put(BIOLOGY_NEURO_URL.B, b);
        break;
      case "circadian":
        put(BIOLOGY_NEURO_URL.A, a);
        put(BIOLOGY_NEURO_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "reaction": {
        const computed = reactionTime({ samplesCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.meanMs, 1)} ms`,
          primaryLabel: "Mean reaction time",
          rows: [
            { label: "Samples (n)", value: num(computed.n, 0) },
            { label: "Min", value: `${num(computed.minMs, 1)} ms` },
            { label: "Max", value: `${num(computed.maxMs, 1)} ms` },
          ],
        };
      }
      case "cognitive": {
        const tasks = parsePositive(a, "Tasks");
        const difficulty = parsePositive(b, "Difficulty");
        const capacity = parsePositive(c, "Capacity");
        if (!tasks.ok) return { error: tasks.error };
        if (!difficulty.ok) return { error: difficulty.error };
        if (!capacity.ok) return { error: capacity.error };
        const computed = cognitiveLoad({
          tasks: tasks.value,
          difficulty: difficulty.value,
          capacity: capacity.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.load, 3)} (${computed.band})`,
          primaryLabel: "Cognitive load index",
          rows: [
            { label: "Tasks", value: num(tasks.value, 0) },
            { label: "Difficulty", value: num(difficulty.value, 2) },
            { label: "Capacity", value: num(capacity.value, 2) },
          ],
        };
      }
      case "sleep": {
        let cycles: number | undefined;
        if (b.trim() !== "") {
          const cyclesP = parsePositive(b, "Cycles");
          if (!cyclesP.ok) return { error: cyclesP.error };
          cycles = cyclesP.value;
        }
        const computed = sleepCycle({ bedtime: a, ...(cycles != null ? { cycles } : {}) });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.wakeTimes.join(", "),
          primaryLabel: "Suggested wake times",
          rows: [
            { label: "Bedtime", value: a.trim() },
            { label: "Cycles", value: cycles != null ? num(cycles, 0) : "5 (default)" },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "circadian": {
        const sleepHours = parsePositive(b, "Sleep hours");
        if (!sleepHours.ok) return { error: sleepHours.error };
        const computed = circadianRhythm({ wakeTime: a, sleepHours: sleepHours.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.bedtime,
          primaryLabel: "Suggested bedtime",
          rows: [
            { label: "Wake time", value: a.trim() },
            { label: "Sleep hours", value: num(sleepHours.value, 1) },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "reaction" ? (
            <div>
              <FieldLabel htmlFor="bnr-samples">Reaction times (ms, CSV)</FieldLabel>
              <FieldInput id="bnr-samples" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "cognitive" ? (
            <>
              <div>
                <FieldLabel htmlFor="bnr-tasks">Tasks</FieldLabel>
                <FieldInput id="bnr-tasks" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bnr-diff">Difficulty</FieldLabel>
                <FieldInput id="bnr-diff" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bnr-cap">Capacity</FieldLabel>
                <FieldInput id="bnr-cap" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "sleep" ? (
            <>
              <div>
                <FieldLabel htmlFor="bnr-bed">Bedtime (HH:MM, 24h)</FieldLabel>
                <FieldInput id="bnr-bed" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bnr-cycles">Cycles (optional, 1–8)</FieldLabel>
                <FieldInput id="bnr-cycles" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "circadian" ? (
            <>
              <div>
                <FieldLabel htmlFor="bnr-wake">Wake time (HH:MM, 24h)</FieldLabel>
                <FieldInput id="bnr-wake" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bnr-hours">Target sleep hours</FieldLabel>
                <FieldInput id="bnr-hours" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
