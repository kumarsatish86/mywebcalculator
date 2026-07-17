"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_GPA_CGPA_URL,
  creditWeightedGpa,
  cumulativeGpa,
  gpaToPercentage,
  gradePointFromPercent,
  percentageToGpa,
  unweightedGpa,
} from "@/lib/calculators/examGpaCgpa";

type GpaSlug =
  | "gpa-calculator"
  | "cgpa-calculator"
  | "sgpa-calculator"
  | "semester-gpa-calculator"
  | "cumulative-gpa-calculator"
  | "gpa-to-percentage-converter"
  | "percentage-to-gpa-converter"
  | "weighted-gpa-calculator-exam"
  | "unweighted-gpa-calculator"
  | "grade-point-calculator";

type Mode =
  | "creditWeighted"
  | "creditWeightedSemester"
  | "creditWeightedCgpa"
  | "cumulative"
  | "gpaToPct"
  | "pctToGpa"
  | "unweighted"
  | "gradePoint";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  wDefault: string;
  sDefault: string;
  pointsLabel: string;
  creditsLabel: string;
  creditsOptional: boolean;
};

const CONFIG: Record<GpaSlug, Config> = {
  "gpa-calculator": {
    title: "GPA calculator",
    description: "Credit-weighted GPA from grade points (credits optional — equal weight if blank).",
    mode: "creditWeighted",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "9,8,7.5,8.5",
    sDefault: "3,4,3,4",
    pointsLabel: "Grade points (CSV)",
    creditsLabel: "Credits (CSV, optional)",
    creditsOptional: true,
  },
  "cgpa-calculator": {
    title: "CGPA calculator",
    description: "Credit-weighted CGPA from semester GPAs and matching credit totals.",
    mode: "creditWeightedCgpa",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "7.8,8.2,8.0,8.5",
    sDefault: "20,22,21,24",
    pointsLabel: "Semester GPAs (CSV)",
    creditsLabel: "Semester credits (CSV)",
    creditsOptional: false,
  },
  "sgpa-calculator": {
    title: "SGPA calculator",
    description: "Semester GPA from course grade points and credits.",
    mode: "creditWeightedSemester",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "9,8,7,8.5,9",
    sDefault: "3,3,4,3,2",
    pointsLabel: "Grade points (CSV)",
    creditsLabel: "Credits (CSV, optional)",
    creditsOptional: true,
  },
  "semester-gpa-calculator": {
    title: "Semester GPA",
    description: "Same as SGPA — credit-weighted GPA for one semester's courses.",
    mode: "creditWeightedSemester",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "8,7.5,9,8",
    sDefault: "4,3,3,4",
    pointsLabel: "Grade points (CSV)",
    creditsLabel: "Credits (CSV, optional)",
    creditsOptional: true,
  },
  "cumulative-gpa-calculator": {
    title: "Cumulative GPA",
    description: "Blend prior CGPA/credits with a new semester GPA and credits.",
    mode: "cumulative",
    aDefault: "7.8",
    bDefault: "60",
    cDefault: "8.4",
    rDefault: "22",
    wDefault: "",
    sDefault: "",
    pointsLabel: "",
    creditsLabel: "",
    creditsOptional: true,
  },
  "gpa-to-percentage-converter": {
    title: "GPA to percentage",
    description: "Approximate percentage from GPA on a 4.0 or 10.0 scale.",
    mode: "gpaToPct",
    aDefault: "8.2",
    bDefault: "10",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    sDefault: "",
    pointsLabel: "",
    creditsLabel: "",
    creditsOptional: true,
  },
  "percentage-to-gpa-converter": {
    title: "Percentage to GPA",
    description: "Approximate GPA from percentage on a 4.0 or 10.0 scale.",
    mode: "pctToGpa",
    aDefault: "78",
    bDefault: "10",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    sDefault: "",
    pointsLabel: "",
    creditsLabel: "",
    creditsOptional: true,
  },
  "weighted-gpa-calculator-exam": {
    title: "Weighted GPA",
    description: "Credit-weighted GPA — grade points and credits must match in count.",
    mode: "creditWeighted",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "9,8,7,8.5",
    sDefault: "3,4,3,4",
    pointsLabel: "Grade points (CSV)",
    creditsLabel: "Credits (CSV)",
    creditsOptional: false,
  },
  "unweighted-gpa-calculator": {
    title: "Unweighted GPA",
    description: "Simple average of grade points (each course equal weight).",
    mode: "unweighted",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "4,3.7,3.3,3.0",
    sDefault: "",
    pointsLabel: "Grade points (CSV)",
    creditsLabel: "",
    creditsOptional: true,
  },
  "grade-point-calculator": {
    title: "Grade point from percentage",
    description: "Map a course percentage to letter grade and grade points (4.0 or 10.0 bands).",
    mode: "gradePoint",
    aDefault: "86",
    bDefault: "10",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    sDefault: "",
    pointsLabel: "",
    creditsLabel: "",
    creditsOptional: true,
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

export function ExamGpaCgpaCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as GpaSlug] ?? CONFIG["gpa-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_GPA_CGPA_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_GPA_CGPA_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_GPA_CGPA_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_GPA_CGPA_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(EXAM_GPA_CGPA_URL.W, config.wDefault));
  const [s, setS] = useState(useLoanInitialInput(EXAM_GPA_CGPA_URL.S, config.sDefault));

  const num = (n: number, d = 2) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_GPA_CGPA_URL.A]: a,
      [EXAM_GPA_CGPA_URL.B]: b,
      [EXAM_GPA_CGPA_URL.C]: c,
      [EXAM_GPA_CGPA_URL.R]: r,
    };
    if (
      config.mode === "creditWeighted" ||
      config.mode === "creditWeightedSemester" ||
      config.mode === "creditWeightedCgpa"
    ) {
      return { ...base, [EXAM_GPA_CGPA_URL.W]: w, [EXAM_GPA_CGPA_URL.S]: s };
    }
    if (config.mode === "unweighted") {
      return { ...base, [EXAM_GPA_CGPA_URL.W]: w };
    }
    return base;
  }, [a, b, c, r, w, s, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, w, s]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "creditWeighted":
      case "creditWeightedSemester":
      case "creditWeightedCgpa": {
        if (!w.trim()) return { error: "Enter grade points / GPAs (comma-separated)." };
        if (!config.creditsOptional && !s.trim()) {
          return { error: "Enter credits (comma-separated)." };
        }
        const computed = creditWeightedGpa({
          gradePointsCsv: w,
          creditsCsv: s.trim() ? s : undefined,
        });
        if ("error" in computed) return { error: computed.error };
        const label =
          config.mode === "creditWeightedCgpa"
            ? "CGPA"
            : config.mode === "creditWeightedSemester"
              ? "SGPA"
              : "GPA";
        return {
          primary: num(computed.gpa, 2),
          primaryLabel: label,
          rows: [
            { label: "Courses / terms", value: String(computed.courses) },
            { label: "Total credits", value: num(computed.totalCredits, 1) },
          ],
        };
      }
      case "cumulative": {
        const priorGpaP = parseNonNegative(a, "Prior GPA");
        const priorCredP = parseNonNegative(b, "Prior credits");
        const newGpaP = parseNonNegative(c, "New GPA");
        const newCredP = parsePositive(r, "New credits");
        if (!priorGpaP.ok) return { error: priorGpaP.error };
        if (!priorCredP.ok) return { error: priorCredP.error };
        if (!newGpaP.ok) return { error: newGpaP.error };
        if (!newCredP.ok) return { error: newCredP.error };
        const computed = cumulativeGpa({
          priorGpa: priorGpaP.value,
          priorCredits: priorCredP.value,
          newGpa: newGpaP.value,
          newCredits: newCredP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.cgpa, 2),
          primaryLabel: "Cumulative GPA",
          rows: [{ label: "Total credits", value: num(computed.totalCredits, 1) }],
        };
      }
      case "gpaToPct": {
        const gpaP = parseNonNegative(a, "GPA");
        const scaleP = parsePositive(b, "Scale");
        if (!gpaP.ok) return { error: gpaP.error };
        if (!scaleP.ok) return { error: scaleP.error };
        const computed = gpaToPercentage({ gpa: gpaP.value, scale: scaleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.percent),
          primaryLabel: "Percentage",
          rows: [{ label: "Formula", value: computed.formula }],
        };
      }
      case "pctToGpa": {
        const pctP = parseAprPercent(a, "Percentage");
        const scaleP = parsePositive(b, "Scale");
        if (!pctP.ok) return { error: pctP.error };
        if (!scaleP.ok) return { error: scaleP.error };
        const computed = percentageToGpa({ percent: pctP.value, scale: scaleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gpa, 2),
          primaryLabel: "GPA",
          rows: [{ label: "Formula", value: computed.formula }],
        };
      }
      case "unweighted": {
        if (!w.trim()) return { error: "Enter grade points (comma-separated)." };
        const computed = unweightedGpa({ gradePointsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gpa, 2),
          primaryLabel: "Unweighted GPA",
          rows: [{ label: "Courses", value: String(computed.courses) }],
        };
      }
      case "gradePoint": {
        const pctP = parseAprPercent(a, "Percentage");
        const scaleP = parsePositive(b, "Scale");
        if (!pctP.ok) return { error: pctP.error };
        if (!scaleP.ok) return { error: scaleP.error };
        const computed = gradePointFromPercent({ percent: pctP.value, scale: scaleP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.gradePoint, 1),
          primaryLabel: "Grade point",
          rows: [
            { label: "Letter", value: computed.letter },
            { label: "Percentage", value: pct(pctP.value) },
          ],
        };
      }
    }
  }, [config.mode, config.creditsOptional, a, b, c, r, w, s]);

  const showCsv =
    config.mode === "creditWeighted" ||
    config.mode === "creditWeightedSemester" ||
    config.mode === "creditWeightedCgpa" ||
    config.mode === "unweighted";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showCsv ? (
            <>
              <div>
                <FieldLabel htmlFor="egc-points">{config.pointsLabel}</FieldLabel>
                <FieldInput id="egc-points" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              {config.mode !== "unweighted" ? (
                <div>
                  <FieldLabel htmlFor="egc-credits">{config.creditsLabel}</FieldLabel>
                  <FieldInput id="egc-credits" value={s} onChange={(ev) => setS(ev.target.value)} />
                </div>
              ) : null}
            </>
          ) : null}

          {config.mode === "cumulative" ? (
            <>
              <div>
                <FieldLabel htmlFor="egc-prior-gpa">Prior GPA / CGPA</FieldLabel>
                <FieldInput
                  id="egc-prior-gpa"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="egc-prior-cred">Prior credits</FieldLabel>
                <FieldInput
                  id="egc-prior-cred"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="egc-new-gpa">New semester GPA</FieldLabel>
                <FieldInput
                  id="egc-new-gpa"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="egc-new-cred">New credits</FieldLabel>
                <FieldInput
                  id="egc-new-cred"
                  value={r}
                  onChange={(ev) => setR(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "gpaToPct" ? (
            <>
              <div>
                <FieldLabel htmlFor="egc-gpa">GPA</FieldLabel>
                <FieldInput
                  id="egc-gpa"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="egc-scale">Scale (4 or 10)</FieldLabel>
                <FieldInput
                  id="egc-scale"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "pctToGpa" || config.mode === "gradePoint" ? (
            <>
              <div>
                <FieldLabel htmlFor="egc-percent">Percentage</FieldLabel>
                <FieldInput
                  id="egc-percent"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="egc-scale2">Scale (4 or 10)</FieldLabel>
                <FieldInput
                  id="egc-scale2"
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
