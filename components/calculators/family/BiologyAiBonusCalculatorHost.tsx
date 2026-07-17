"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_AI_URL,
  aiDietPlanner,
  aiFitnessPlanner,
  aiLabReportGenerator,
  aiStudyAssistantBiology,
} from "@/lib/calculators/biologyAiBonus";

type AiSlug =
  | "ai-diet-planner"
  | "ai-fitness-planner"
  | "ai-study-assistant-biology"
  | "ai-lab-report-generator";

type Mode = "diet" | "fitness" | "study" | "lab";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
};

const CONFIG: Record<AiSlug, Config> = {
  "ai-diet-planner": {
    title: "AI diet planner",
    description: "Rule-based meal template from calories and style — not a live AI model. Not medical advice.",
    mode: "diet",
    aDefault: "2000",
    bDefault: "veg",
  },
  "ai-fitness-planner": {
    title: "AI fitness planner",
    description: "Rule-based weekly focus template — not a live AI model or coach. Not medical advice.",
    mode: "fitness",
    aDefault: "4",
    bDefault: "strength",
  },
  "ai-study-assistant-biology": {
    title: "AI study assistant (biology)",
    description: "Preset study tips by topic keyword — not a live AI tutor or model.",
    mode: "study",
    aDefault: "cell",
    bDefault: "",
  },
  "ai-lab-report-generator": {
    title: "AI lab report generator",
    description: "Rule-based outline by experiment keyword — not a live AI model or auto-written prose.",
    mode: "lab",
    aDefault: "pcr",
    bDefault: "",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono whitespace-pre-wrap text-right">{value}</span>
    </div>
  );
}

export function BiologyAiBonusCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiSlug] ?? CONFIG["ai-diet-planner"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_AI_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_AI_URL.B, config.bDefault));

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
      case "diet":
      case "fitness":
        put(BIOLOGY_AI_URL.A, a);
        put(BIOLOGY_AI_URL.B, b);
        break;
      case "study":
      case "lab":
        put(BIOLOGY_AI_URL.A, a);
        break;
    }
    return out;
  }, [a, b, config.mode]);

  useLoanUrlSync(shareParams, [a, b]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "diet": {
        const cal = parsePositive(a, "Calories");
        if (!cal.ok) return { error: cal.error };
        const computed = aiDietPlanner({ calories: cal.value, style: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.plan,
          primaryLabel: "Day template",
          rows: [
            { label: "Protein", value: `${num(computed.proteinG, 0)} g` },
            { label: "Carbs", value: `${num(computed.carbG, 0)} g` },
            { label: "Fat", value: `${num(computed.fatG, 0)} g` },
            { label: "Calories", value: `${num(cal.value, 0)} kcal` },
            { label: "Style", value: b.trim() || "—" },
          ],
        };
      }
      case "fitness": {
        const days = parsePositive(a, "Days per week");
        if (!days.ok) return { error: days.error };
        const computed = aiFitnessPlanner({ daysPerWeek: days.value, goal: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.plan,
          primaryLabel: "Weekly template",
          rows: [
            { label: "Days/week", value: num(days.value, 0) },
            { label: "Goal", value: b.trim() || "—" },
          ],
        };
      }
      case "study": {
        const computed = aiStudyAssistantBiology({ topic: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.advice,
          primaryLabel: "Study tip",
          rows: [{ label: "Topic", value: a.trim() || "—" }],
        };
      }
      case "lab": {
        const computed = aiLabReportGenerator({ experiment: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.outline,
          primaryLabel: "Report outline",
          rows: [{ label: "Experiment", value: a.trim() || "—" }],
        };
      }
    }
  }, [config.mode, a, b]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "diet" ? (
            <>
              <div>
                <FieldLabel htmlFor="ba-a">Daily calories</FieldLabel>
                <FieldInput id="ba-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ba-b">Style (e.g. veg, mixed)</FieldLabel>
                <FieldInput id="ba-b" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "fitness" ? (
            <>
              <div>
                <FieldLabel htmlFor="ba-a">Days per week (1–7)</FieldLabel>
                <FieldInput id="ba-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ba-b">Goal (strength, endurance, mobility…)</FieldLabel>
                <FieldInput id="ba-b" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "study" ? (
            <div>
              <FieldLabel htmlFor="ba-a">Topic (cell, gene, eco, physio, molec)</FieldLabel>
              <FieldInput id="ba-a" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "lab" ? (
            <div>
              <FieldLabel htmlFor="ba-a">Experiment (dilution, pcr, enzyme, field)</FieldLabel>
              <FieldInput id="ba-a" value={a} onChange={(ev) => setA(ev.target.value)} />
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
                <p className="mt-1 text-lg font-semibold tracking-tight whitespace-pre-wrap">{result.primary}</p>
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
