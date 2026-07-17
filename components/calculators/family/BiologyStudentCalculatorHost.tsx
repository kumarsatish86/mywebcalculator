"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_STUDENT_URL,
  biologyFormula,
  quizScoreBiology,
  revisionPlannerBiology,
  studyTimePlannerBiology,
} from "@/lib/calculators/biologyStudent";

type StudentSlug =
  | "biology-formula-calculator"
  | "quiz-score-calculator-biology"
  | "study-time-planner-biology"
  | "revision-planner-biology";

type Mode = "formula" | "quiz" | "study" | "revision";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<StudentSlug, Config> = {
  "biology-formula-calculator": {
    title: "Biology formula",
    description: "Classroom helpers: magnification, rate, density, or efficiency. Educational only.",
    mode: "formula",
    aDefault: "magnification",
    bDefault: "50",
    cDefault: "5",
  },
  "quiz-score-calculator-biology": {
    title: "Quiz score (biology)",
    description: "Percent and letter grade from correct / total. Educational scoring aid.",
    mode: "quiz",
    aDefault: "18",
    bDefault: "20",
    cDefault: "",
  },
  "study-time-planner-biology": {
    title: "Study time planner",
    description: "Split available hours evenly across topics. Educational planning aid.",
    mode: "study",
    aDefault: "6",
    bDefault: "12",
    cDefault: "",
  },
  "revision-planner-biology": {
    title: "Revision planner",
    description: "Even chapter split until exam day. Educational planning — adjust as needed.",
    mode: "revision",
    aDefault: "12",
    bDefault: "14",
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

export function BiologyStudentCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as StudentSlug] ?? CONFIG["biology-formula-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_STUDENT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_STUDENT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_STUDENT_URL.C, config.cDefault));

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
      case "formula":
        put(BIOLOGY_STUDENT_URL.A, a);
        put(BIOLOGY_STUDENT_URL.B, b);
        put(BIOLOGY_STUDENT_URL.C, c);
        break;
      case "quiz":
      case "study":
      case "revision":
        put(BIOLOGY_STUDENT_URL.A, a);
        put(BIOLOGY_STUDENT_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "formula": {
        const v1 = parseFiniteNumber(b, "Value 1");
        const v2 = parseFiniteNumber(c, "Value 2");
        if (!v1.ok) return { error: v1.error };
        if (!v2.ok) return { error: v2.error };
        const computed = biologyFormula({ kind: a, a: v1.value, b: v2.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.value, 4),
          primaryLabel: "Result",
          rows: [
            { label: "Formula", value: computed.label },
            { label: "Kind", value: a.trim() || "—" },
            { label: "Value 1", value: num(v1.value, 4) },
            { label: "Value 2", value: num(v2.value, 4) },
          ],
        };
      }
      case "quiz": {
        const correct = parseNonNegative(a, "Correct");
        const total = parsePositive(b, "Total");
        if (!correct.ok) return { error: correct.error };
        if (!total.ok) return { error: total.error };
        const computed = quizScoreBiology({ correct: correct.value, total: total.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 1)}% (${computed.grade})`,
          primaryLabel: "Score",
          rows: [
            { label: "Correct", value: num(correct.value, 0) },
            { label: "Total", value: num(total.value, 0) },
            { label: "Grade", value: computed.grade },
          ],
        };
      }
      case "study": {
        const topics = parsePositive(a, "Topics");
        const hours = parsePositive(b, "Hours available");
        if (!topics.ok) return { error: topics.error };
        if (!hours.ok) return { error: hours.error };
        const computed = studyTimePlannerBiology({
          topics: topics.value,
          hoursAvailable: hours.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.hoursPerTopic, 2)} h/topic`,
          primaryLabel: "Time per topic",
          rows: [
            { label: "Minutes/topic", value: `${num(computed.minutesPerTopic, 0)} min` },
            { label: "Topics", value: num(topics.value, 0) },
            { label: "Hours available", value: num(hours.value, 2) },
          ],
        };
      }
      case "revision": {
        const chapters = parsePositive(a, "Chapters");
        const days = parsePositive(b, "Days until exam");
        if (!chapters.ok) return { error: chapters.error };
        if (!days.ok) return { error: days.error };
        const computed = revisionPlannerBiology({
          chapters: chapters.value,
          daysUntilExam: days.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.chaptersPerDay, 2)} chapters/day`,
          primaryLabel: "Pace",
          rows: [
            { label: "Chapters", value: num(chapters.value, 0) },
            { label: "Days", value: num(days.value, 0) },
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
          {config.mode === "formula" ? (
            <>
              <div>
                <FieldLabel htmlFor="bs-a">Kind (magnification, rate, density, efficiency)</FieldLabel>
                <FieldInput id="bs-a" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bs-b">Value 1</FieldLabel>
                <FieldInput id="bs-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bs-c">Value 2</FieldLabel>
                <FieldInput id="bs-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "quiz" ? (
            <>
              <div>
                <FieldLabel htmlFor="bs-a">Correct answers</FieldLabel>
                <FieldInput id="bs-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bs-b">Total questions</FieldLabel>
                <FieldInput id="bs-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "study" ? (
            <>
              <div>
                <FieldLabel htmlFor="bs-a">Number of topics</FieldLabel>
                <FieldInput id="bs-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bs-b">Hours available</FieldLabel>
                <FieldInput id="bs-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "revision" ? (
            <>
              <div>
                <FieldLabel htmlFor="bs-a">Chapters</FieldLabel>
                <FieldInput id="bs-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bs-b">Days until exam</FieldLabel>
                <FieldInput id="bs-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
