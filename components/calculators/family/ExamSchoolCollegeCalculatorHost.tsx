"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_SCHOOL_COLLEGE_URL,
  cbsePercentage,
  engineeringCgpa,
  icsePercentage,
  internalExternalMarks,
  medicalEntranceScore,
  semesterWiseMarks,
  stateBoardPercentage,
  universityGpa,
} from "@/lib/calculators/examSchoolCollege";

type SchoolSlug =
  | "cbse-percentage-calculator"
  | "icse-percentage-calculator"
  | "state-board-percentage-calculator"
  | "university-gpa-calculator"
  | "engineering-cgpa-calculator"
  | "medical-entrance-score-calculator"
  | "semester-wise-marks-calculator"
  | "internal-external-marks-calculator";

type Mode =
  | "cbse"
  | "icse"
  | "stateBoard"
  | "universityGpa"
  | "engineeringCgpa"
  | "medicalEntrance"
  | "semesterWise"
  | "internalExternal";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
  iDefault: string;
  eDefault: string;
};

const BOARD_MARKS_DEFAULT = "88,92,85,90,78,82";
const BOARD_MAX_DEFAULT = "100";

const CONFIG: Record<SchoolSlug, Config> = {
  "cbse-percentage-calculator": {
    title: "CBSE percentage calculator",
    description: "Board-style aggregate % from comma-separated subject marks (educational only).",
    mode: "cbse",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: BOARD_MAX_DEFAULT,
    tDefault: "0",
    mDefault: BOARD_MARKS_DEFAULT,
    iDefault: "0",
    eDefault: "0",
  },
  "icse-percentage-calculator": {
    title: "ICSE percentage calculator",
    description: "Board-style aggregate % from comma-separated subject marks (educational only).",
    mode: "icse",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: BOARD_MAX_DEFAULT,
    tDefault: "0",
    mDefault: BOARD_MARKS_DEFAULT,
    iDefault: "0",
    eDefault: "0",
  },
  "state-board-percentage-calculator": {
    title: "State board percentage calculator",
    description: "Board-style aggregate % from comma-separated subject marks (educational only).",
    mode: "stateBoard",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: BOARD_MAX_DEFAULT,
    tDefault: "0",
    mDefault: BOARD_MARKS_DEFAULT,
    iDefault: "0",
    eDefault: "0",
  },
  "university-gpa-calculator": {
    title: "University GPA calculator",
    description: "Weighted GPA from grade points and optional credit CSV.",
    mode: "universityGpa",
    aDefault: "8,7.5,9,8.5",
    bDefault: "4,3,4,3",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    mDefault: "",
    iDefault: "0",
    eDefault: "0",
  },
  "engineering-cgpa-calculator": {
    title: "Engineering CGPA calculator",
    description: "CGPA from semester GPA CSV and optional credit weights.",
    mode: "engineeringCgpa",
    aDefault: "8.2,7.8,8.5,9.0",
    bDefault: "22,24,23,20",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    mDefault: "",
    iDefault: "0",
    eDefault: "0",
  },
  "medical-entrance-score-calculator": {
    title: "Medical entrance score calculator",
    description: "Net score from correct/wrong counts and marking scheme.",
    mode: "medicalEntrance",
    aDefault: "145",
    bDefault: "28",
    cDefault: "4",
    rDefault: "1",
    tDefault: "0",
    mDefault: "",
    iDefault: "0",
    eDefault: "0",
  },
  "semester-wise-marks-calculator": {
    title: "Semester-wise marks calculator",
    description: "Per-subject percent and semester average from marks CSV.",
    mode: "semesterWise",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: BOARD_MAX_DEFAULT,
    tDefault: "0",
    mDefault: "78,82,88,75,90",
    iDefault: "0",
    eDefault: "0",
  },
  "internal-external-marks-calculator": {
    title: "Internal + external marks calculator",
    description: "Combined % from internal and external components with weight split.",
    mode: "internalExternal",
    aDefault: "50",
    bDefault: "100",
    cDefault: "0",
    rDefault: "0",
    tDefault: "30",
    mDefault: "",
    iDefault: "45",
    eDefault: "72",
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

export function ExamSchoolCollegeCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as SchoolSlug] ?? CONFIG["cbse-percentage-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.M, config.mDefault));
  const [internal, setInternal] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.I, config.iDefault));
  const [external, setExternal] = useState(useLoanInitialInput(EXAM_SCHOOL_COLLEGE_URL.E, config.eDefault));

  const num = (n: number, d = 2) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(() => {
    if (config.mode === "internalExternal") {
      return {
        [EXAM_SCHOOL_COLLEGE_URL.I]: internal,
        [EXAM_SCHOOL_COLLEGE_URL.E]: external,
        [EXAM_SCHOOL_COLLEGE_URL.A]: a,
        [EXAM_SCHOOL_COLLEGE_URL.B]: b,
        [EXAM_SCHOOL_COLLEGE_URL.T]: t,
      };
    }
    if (
      config.mode === "cbse" ||
      config.mode === "icse" ||
      config.mode === "stateBoard" ||
      config.mode === "semesterWise"
    ) {
      return {
        [EXAM_SCHOOL_COLLEGE_URL.M]: m,
        [EXAM_SCHOOL_COLLEGE_URL.R]: r,
      };
    }
    return {
      [EXAM_SCHOOL_COLLEGE_URL.A]: a,
      [EXAM_SCHOOL_COLLEGE_URL.B]: b,
      [EXAM_SCHOOL_COLLEGE_URL.C]: c,
      [EXAM_SCHOOL_COLLEGE_URL.R]: r,
    };
  }, [a, b, c, r, t, m, internal, external, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, m, internal, external]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "cbse":
      case "icse":
      case "stateBoard": {
        const maxP = r.trim() ? parsePositive(r, "Max per subject") : { ok: true as const, value: 100 };
        if (!maxP.ok) return { error: maxP.error };
        if (!m.trim()) return { error: "Enter subject marks (comma-separated)." };
        const fn =
          config.mode === "cbse"
            ? cbsePercentage
            : config.mode === "icse"
              ? icsePercentage
              : stateBoardPercentage;
        const computed = fn({ marksCsv: m, maxPerSubject: maxP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.percent),
          primaryLabel: "Aggregate percentage",
          rows: [
            { label: "Subjects", value: String(computed.subjects) },
            { label: "Total marks", value: `${num(computed.total, 0)} / ${num(computed.maxTotal, 0)}` },
          ],
        };
      }
      case "universityGpa": {
        if (!a.trim()) return { error: "Enter grade points (comma-separated)." };
        const computed = universityGpa({ gradePointsCsv: a, creditsCsv: b.trim() || undefined });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gpa),
          primaryLabel: "GPA",
          rows: [{ label: "Courses", value: String(computed.courses) }],
        };
      }
      case "engineeringCgpa": {
        if (!a.trim()) return { error: "Enter semester GPAs (comma-separated)." };
        const computed = engineeringCgpa({ semesterGpasCsv: a, creditsCsv: b.trim() || undefined });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gpa),
          primaryLabel: "CGPA",
          rows: [{ label: "Semesters", value: String(computed.courses) }],
        };
      }
      case "medicalEntrance": {
        const corP = parseNonNegative(a, "Correct");
        const wrongP = parseNonNegative(b, "Wrong");
        const mcP = parseNonNegative(c, "Marks per correct");
        const mwP = parseNonNegative(r, "Marks per wrong");
        if (!corP.ok) return { error: corP.error };
        if (!wrongP.ok) return { error: wrongP.error };
        if (!mcP.ok) return { error: mcP.error };
        if (!mwP.ok) return { error: mwP.error };
        const computed = medicalEntranceScore({
          correct: corP.value,
          wrong: wrongP.value,
          marksPerCorrect: mcP.value,
          marksPerWrong: mwP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.score, 1),
          primaryLabel: "Net score",
          rows: [{ label: "Attempted", value: String(computed.attempted) }],
        };
      }
      case "semesterWise": {
        const maxP = r.trim() ? parsePositive(r, "Max per subject") : { ok: true as const, value: 100 };
        if (!maxP.ok) return { error: maxP.error };
        if (!m.trim()) return { error: "Enter semester/subject marks (comma-separated)." };
        const computed = semesterWiseMarks({ marksCsv: m, maxPerSubject: maxP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.averagePercent),
          primaryLabel: "Average %",
          rows: computed.subjects.map((s) => ({
            label: `Subject ${s.index}`,
            value: `${num(s.marks, 0)} (${pct(s.percent)})`,
          })),
        };
      }
      case "internalExternal": {
        const intP = parseNonNegative(internal, "Internal marks");
        const extP = parseNonNegative(external, "External marks");
        const intMaxP = parsePositive(a, "Internal max");
        const extMaxP = parsePositive(b, "External max");
        const weightP = t.trim()
          ? parseAprPercent(t, "Internal weight %")
          : { ok: true as const, value: 30 };
        if (!intP.ok) return { error: intP.error };
        if (!extP.ok) return { error: extP.error };
        if (!intMaxP.ok) return { error: intMaxP.error };
        if (!extMaxP.ok) return { error: extMaxP.error };
        if (!weightP.ok) return { error: weightP.error };
        const computed = internalExternalMarks({
          internal: intP.value,
          external: extP.value,
          internalMax: intMaxP.value,
          externalMax: extMaxP.value,
          internalWeightPercent: weightP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.combinedPercent),
          primaryLabel: "Combined %",
          rows: [
            { label: "Internal %", value: pct(computed.internalPercent) },
            { label: "External %", value: pct(computed.externalPercent) },
            { label: "Internal weight", value: pct(weightP.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, m, internal, external]);

  const boardMode =
    config.mode === "cbse" || config.mode === "icse" || config.mode === "stateBoard";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {boardMode ? (
            <>
              <div>
                <FieldLabel htmlFor="esc-marks">Subject marks (CSV)</FieldLabel>
                <FieldInput id="esc-marks" value={m} onChange={(ev) => setM(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="esc-max">Max per subject</FieldLabel>
                <FieldInput id="esc-max" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "universityGpa" || config.mode === "engineeringCgpa" ? (
            <>
              <div>
                <FieldLabel htmlFor="esc-gp">
                  {config.mode === "engineeringCgpa" ? "Semester GPAs (CSV)" : "Grade points (CSV)"}
                </FieldLabel>
                <FieldInput id="esc-gp" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="esc-cr">Credits (CSV, optional)</FieldLabel>
                <FieldInput id="esc-cr" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "medicalEntrance" ? (
            <>
              <div>
                <FieldLabel htmlFor="esc-cor">Correct</FieldLabel>
                <FieldInput id="esc-cor" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-wrong">Wrong</FieldLabel>
                <FieldInput id="esc-wrong" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-mc">Marks per correct</FieldLabel>
                <FieldInput id="esc-mc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-mw">Marks per wrong</FieldLabel>
                <FieldInput id="esc-mw" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "semesterWise" ? (
            <>
              <div>
                <FieldLabel htmlFor="esc-sem">Subject marks (CSV)</FieldLabel>
                <FieldInput id="esc-sem" value={m} onChange={(ev) => setM(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="esc-smax">Max per subject</FieldLabel>
                <FieldInput id="esc-smax" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "internalExternal" ? (
            <>
              <div>
                <FieldLabel htmlFor="esc-int">Internal marks</FieldLabel>
                <FieldInput id="esc-int" value={internal} onChange={(ev) => setInternal(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-ext">External marks</FieldLabel>
                <FieldInput id="esc-ext" value={external} onChange={(ev) => setExternal(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-imax">Internal max</FieldLabel>
                <FieldInput id="esc-imax" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-emax">External max</FieldLabel>
                <FieldInput id="esc-emax" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="esc-wt">Internal weight %</FieldLabel>
                <FieldInput id="esc-wt" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
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
