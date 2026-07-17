"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_ACADEMIC_PLANNING_URL,
  daysToCompleteSyllabus,
  examCountdown,
  revisionPlanner,
  studyHours,
  studyPlanGenerator,
} from "@/lib/calculators/examAcademicPlanning";

type PlanningSlug =
  | "study-hours-calculator"
  | "study-plan-generator"
  | "days-to-complete-syllabus-calculator"
  | "revision-planner-calculator"
  | "exam-countdown-calculator";

type Mode = "studyHours" | "studyPlan" | "syllabusDays" | "revision" | "countdown";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  dDefault: string;
};

const CONFIG: Record<PlanningSlug, Config> = {
  "study-hours-calculator": {
    title: "Study hours calculator",
    description: "Total hours and daily load to cover chapters before the exam.",
    mode: "studyHours",
    aDefault: "30",
    bDefault: "2",
    cDefault: "20",
    rDefault: "0",
    dDefault: "2026-12-15",
  },
  "study-plan-generator": {
    title: "Study plan generator",
    description: "Hours per subject and rotation outline across your study window.",
    mode: "studyPlan",
    aDefault: "5",
    bDefault: "60",
    cDefault: "4",
    rDefault: "0",
    dDefault: "2026-12-15",
  },
  "days-to-complete-syllabus-calculator": {
    title: "Days to complete syllabus",
    description: "Base and buffered days to finish topics at your daily pace.",
    mode: "syllabusDays",
    aDefault: "120",
    bDefault: "5",
    cDefault: "0",
    rDefault: "15",
    dDefault: "2026-12-15",
  },
  "revision-planner-calculator": {
    title: "Revision planner",
    description: "Topic-reviews per day across multiple revision passes.",
    mode: "revision",
    aDefault: "80",
    bDefault: "3",
    cDefault: "45",
    rDefault: "0",
    dDefault: "2026-12-15",
  },
  "exam-countdown-calculator": {
    title: "Exam countdown",
    description: "Days and weeks left until your exam date (YYYY-MM-DD).",
    mode: "countdown",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    dDefault: "2026-12-15",
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

export function ExamAcademicPlanningCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PlanningSlug] ?? CONFIG["study-hours-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_ACADEMIC_PLANNING_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_ACADEMIC_PLANNING_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_ACADEMIC_PLANNING_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_ACADEMIC_PLANNING_URL.R, config.rDefault));
  const [examDate, setExamDate] = useState(useLoanInitialInput(EXAM_ACADEMIC_PLANNING_URL.D, config.dDefault));

  const num = (n: number, d = 1) => n.toFixed(d);

  const shareParams = useCallback(() => {
    if (config.mode === "countdown") {
      return { [EXAM_ACADEMIC_PLANNING_URL.D]: examDate };
    }
    const base = {
      [EXAM_ACADEMIC_PLANNING_URL.A]: a,
      [EXAM_ACADEMIC_PLANNING_URL.B]: b,
      [EXAM_ACADEMIC_PLANNING_URL.C]: c,
      [EXAM_ACADEMIC_PLANNING_URL.R]: r,
    };
    return base;
  }, [a, b, c, r, examDate, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, examDate]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "studyHours": {
        const chP = parsePositive(a, "Chapters");
        const hrsP = parsePositive(b, "Hours per chapter");
        const daysP = parsePositive(c, "Days available");
        if (!chP.ok) return { error: chP.error };
        if (!hrsP.ok) return { error: hrsP.error };
        if (!daysP.ok) return { error: daysP.error };
        const computed = studyHours({
          chapters: chP.value,
          hoursPerChapter: hrsP.value,
          daysAvailable: daysP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.hoursPerDay)} h/day`,
          primaryLabel: "Daily study load",
          rows: [
            { label: "Total hours", value: num(computed.totalHours, 0) },
            { label: "Feasible (≤8h/day)?", value: computed.feasible ? "Yes" : "Tight" },
          ],
        };
      }
      case "studyPlan": {
        const subjP = parsePositive(a, "Subjects");
        const daysP = parsePositive(b, "Days");
        const hrsP = parsePositive(c, "Hours per day");
        if (!subjP.ok) return { error: subjP.error };
        if (!daysP.ok) return { error: daysP.error };
        if (!hrsP.ok) return { error: hrsP.error };
        const computed = studyPlanGenerator({
          subjects: subjP.value,
          days: daysP.value,
          hoursPerDay: hrsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.hoursPerSubjectTotal)} h/subject`,
          primaryLabel: "Hours per subject",
          rows: [
            { label: "Sessions per subject", value: String(computed.sessionsPerSubject) },
            ...computed.outline.map((line, i) => ({ label: `Outline ${i + 1}`, value: line })),
          ],
        };
      }
      case "syllabusDays": {
        const topicsP = parsePositive(a, "Topics");
        const perDayP = parsePositive(b, "Topics per day");
        const bufP = r.trim() ? parseAprPercent(r, "Buffer %") : { ok: true as const, value: undefined };
        if (!topicsP.ok) return { error: topicsP.error };
        if (!perDayP.ok) return { error: perDayP.error };
        if (!bufP.ok) return { error: bufP.error };
        const computed = daysToCompleteSyllabus({
          topics: topicsP.value,
          topicsPerDay: perDayP.value,
          bufferPercent: bufP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.bufferedDays} days`,
          primaryLabel: "Buffered completion",
          rows: [
            { label: "Base days", value: String(computed.baseDays) },
            { label: "Weeks (buffered)", value: num(computed.weeks) },
          ],
        };
      }
      case "revision": {
        const topicsP = parsePositive(a, "Topics");
        const revP = parsePositive(b, "Revisions");
        const daysP = parsePositive(c, "Days until exam");
        if (!topicsP.ok) return { error: topicsP.error };
        if (!revP.ok) return { error: revP.error };
        if (!daysP.ok) return { error: daysP.error };
        const computed = revisionPlanner({
          topics: topicsP.value,
          revisions: revP.value,
          daysUntilExam: daysP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.topicsPerDay)} reviews/day`,
          primaryLabel: "Topic-reviews per day",
          rows: [
            { label: "Cycle length (days)", value: String(computed.cycleDays) },
            { label: "Schedule", value: computed.scheduleNote },
          ],
        };
      }
      case "countdown": {
        const computed = examCountdown({ examDateIso: examDate });
        if ("error" in computed) return { error: computed.error };
        const primary =
          computed.status === "today"
            ? "Today"
            : computed.status === "past"
              ? `${Math.abs(computed.daysLeft)} days ago`
              : `${computed.daysLeft} days`;
        return {
          primary,
          primaryLabel: "Time to exam",
          rows: [
            { label: "Status", value: computed.status },
            { label: "Weeks left", value: num(computed.weeksLeft) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, examDate]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "studyHours" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-ch">Chapters</FieldLabel>
                <FieldInput id="ep-ch" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-hpc">Hours per chapter</FieldLabel>
                <FieldInput id="ep-hpc" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-days">Days available</FieldLabel>
                <FieldInput id="ep-days" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "studyPlan" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-subj">Number of subjects</FieldLabel>
                <FieldInput id="ep-subj" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-sdays">Study days</FieldLabel>
                <FieldInput id="ep-sdays" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-hpd">Hours per day</FieldLabel>
                <FieldInput id="ep-hpd" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "syllabusDays" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-topics">Total topics</FieldLabel>
                <FieldInput id="ep-topics" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-tpd">Topics per day</FieldLabel>
                <FieldInput id="ep-tpd" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-buf">Buffer % (optional)</FieldLabel>
                <FieldInput id="ep-buf" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "revision" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-rtop">Topics to revise</FieldLabel>
                <FieldInput id="ep-rtop" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-rev">Revision passes</FieldLabel>
                <FieldInput id="ep-rev" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-rdays">Days until exam</FieldLabel>
                <FieldInput id="ep-rdays" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "countdown" ? (
            <div>
              <FieldLabel htmlFor="ep-date">Exam date (YYYY-MM-DD)</FieldLabel>
              <FieldInput
                id="ep-date"
                value={examDate}
                onChange={(ev) => setExamDate(ev.target.value)}
                placeholder="2026-12-15"
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
