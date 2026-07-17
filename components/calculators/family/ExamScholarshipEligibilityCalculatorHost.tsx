"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_SCHOLARSHIP_URL,
  admissionEligibility,
  collegeCutoffChecker,
  courseEligibility,
  meritScore,
  scholarshipEligibility,
} from "@/lib/calculators/examScholarshipEligibility";

type ScholarshipSlug =
  | "scholarship-eligibility-calculator"
  | "merit-score-calculator"
  | "admission-eligibility-calculator"
  | "college-cutoff-checker"
  | "course-eligibility-calculator";

type Mode = "scholarship" | "merit" | "admission" | "cutoff" | "course";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  mDefault: string;
  wDefault: string;
};

const CONFIG: Record<ScholarshipSlug, Config> = {
  "scholarship-eligibility-calculator": {
    title: "Scholarship eligibility calculator",
    description: "Score and income gates for illustrative scholarship eligibility.",
    mode: "scholarship",
    aDefault: "85",
    bDefault: "500000",
    cDefault: "800000",
    rDefault: "80",
    mDefault: "rank",
    wDefault: "Physics,Chemistry,Math",
  },
  "merit-score-calculator": {
    title: "Merit score calculator",
    description: "Weighted blend of exam and board percentages.",
    mode: "merit",
    aDefault: "75",
    bDefault: "80",
    cDefault: "0",
    rDefault: "60",
    mDefault: "rank",
    wDefault: "Physics,Chemistry,Math",
  },
  "admission-eligibility-calculator": {
    title: "Admission eligibility calculator",
    description: "Cut-off score and optional minimum eligibility percent check.",
    mode: "admission",
    aDefault: "450",
    bDefault: "420",
    cDefault: "72",
    rDefault: "50",
    mDefault: "rank",
    wDefault: "Physics,Chemistry,Math",
  },
  "college-cutoff-checker": {
    title: "College cut-off checker",
    description: "Compare your rank or score against a published cut-off.",
    mode: "cutoff",
    aDefault: "5000",
    bDefault: "8000",
    cDefault: "0",
    rDefault: "0",
    mDefault: "rank",
    wDefault: "Physics,Chemistry,Math",
  },
  "course-eligibility-calculator": {
    title: "Course eligibility calculator",
    description: "Check whether your studied subjects meet course requirements.",
    mode: "course",
    aDefault: "0",
    bDefault: "0",
    cDefault: "Physics,Chemistry,Math,Biology",
    rDefault: "0",
    mDefault: "rank",
    wDefault: "Physics,Chemistry,Math",
  },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function ExamScholarshipEligibilityCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ScholarshipSlug] ?? CONFIG["scholarship-eligibility-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_SCHOLARSHIP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_SCHOLARSHIP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_SCHOLARSHIP_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_SCHOLARSHIP_URL.R, config.rDefault));
  const [mode, setMode] = useState<"rank" | "score">(
    (useLoanInitialInput(EXAM_SCHOLARSHIP_URL.M, config.mDefault) as "rank" | "score") || "rank",
  );
  const [subjectsCsv, setSubjectsCsv] = useState(useLoanInitialInput(EXAM_SCHOLARSHIP_URL.P, config.wDefault));

  const pct = (n: number) => `${n.toFixed(2)}%`;
  const num = (n: number, d = 0) => (d === 0 ? String(Math.round(n)) : n.toFixed(d));

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_SCHOLARSHIP_URL.A]: a,
      [EXAM_SCHOLARSHIP_URL.B]: b,
      [EXAM_SCHOLARSHIP_URL.C]: c,
      [EXAM_SCHOLARSHIP_URL.R]: r,
    };
    if (config.mode === "cutoff") {
      return { ...base, [EXAM_SCHOLARSHIP_URL.M]: mode };
    }
    if (config.mode === "course") {
      return {
        [EXAM_SCHOLARSHIP_URL.P]: subjectsCsv,
        [EXAM_SCHOLARSHIP_URL.C]: c,
      };
    }
    return base;
  }, [a, b, c, r, mode, subjectsCsv, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, mode, subjectsCsv]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "scholarship": {
        const scoreP = parseAprPercent(a, "Score %");
        const minP = parseAprPercent(r, "Min score %");
        const incP = parseNonNegative(b, "Family income");
        const maxIncP = parseNonNegative(c, "Max income");
        if (!scoreP.ok) return { error: scoreP.error };
        if (!minP.ok) return { error: minP.error };
        if (!incP.ok) return { error: incP.error };
        if (!maxIncP.ok) return { error: maxIncP.error };
        const computed = scholarshipEligibility({
          scorePercent: scoreP.value,
          minPercent: minP.value,
          familyIncome: incP.value,
          maxIncome: maxIncP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.eligible ? "Eligible" : "Not eligible",
          primaryLabel: "Scholarship gate",
          rows: [
            { label: "Score OK?", value: computed.scoreOk ? "Yes" : "No" },
            { label: "Income OK?", value: computed.incomeOk ? "Yes" : "No" },
            { label: "Message", value: computed.message },
          ],
        };
      }
      case "merit": {
        const examP = parseAprPercent(a, "Exam %");
        const boardP = parseAprPercent(b, "Board %");
        const weightP = parseAprPercent(r, "Exam weight %");
        if (!examP.ok) return { error: examP.error };
        if (!boardP.ok) return { error: boardP.error };
        if (!weightP.ok) return { error: weightP.error };
        const computed = meritScore({
          examPercent: examP.value,
          boardPercent: boardP.value,
          examWeightPercent: weightP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.meritPercent),
          primaryLabel: "Merit score",
          rows: [{ label: "Board weight %", value: pct(computed.boardWeightPercent) }],
        };
      }
      case "admission": {
        const yoursP = parseNonNegative(a, "Your score");
        const cutP = parseNonNegative(b, "Cut-off score");
        const minElP = r.trim() ? parseAprPercent(r, "Min eligibility %") : { ok: true as const, value: undefined };
        const yourPctP = c.trim() ? parseAprPercent(c, "Your %") : { ok: true as const, value: undefined };
        if (!yoursP.ok) return { error: yoursP.error };
        if (!cutP.ok) return { error: cutP.error };
        if (!minElP.ok) return { error: minElP.error };
        if (!yourPctP.ok) return { error: yourPctP.error };
        const computed = admissionEligibility({
          yourScore: yoursP.value,
          cutoffScore: cutP.value,
          minEligibilityPercent: minElP.value,
          yourPercent: yourPctP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.eligible ? "Eligible" : "Not eligible",
          primaryLabel: "Admission gate",
          rows: [
            { label: "Clears cut-off?", value: computed.clearsCutoff ? "Yes" : "No" },
            { label: "Meets min %?", value: computed.meetsMinEligibility ? "Yes" : "No" },
            { label: "Margin (marks)", value: num(computed.margin) },
          ],
        };
      }
      case "cutoff": {
        const yoursP = parseNonNegative(a, "Your rank/score");
        const cutP = parseNonNegative(b, "Cut-off");
        if (!yoursP.ok) return { error: yoursP.error };
        if (!cutP.ok) return { error: cutP.error };
        const computed = collegeCutoffChecker({
          yourRankOrScore: yoursP.value,
          cutoff: cutP.value,
          mode,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.clears ? "Clears" : "Misses",
          primaryLabel: "Cut-off check",
          rows: [
            { label: "Mode", value: mode },
            { label: "Difference", value: num(computed.difference) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "course": {
        const computed = courseEligibility({
          subjectsCsv,
          requiredCsv: c,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.eligible ? "Eligible" : "Missing subjects",
          primaryLabel: "Course eligibility",
          rows: [
            { label: "Matched", value: `${computed.matched} required` },
            {
              label: "Missing",
              value: computed.missing.length ? computed.missing.join(", ") : "None",
            },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, mode, subjectsCsv]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "scholarship" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-score">Your score %</FieldLabel>
                <FieldInput id="es-score" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-min">Minimum score %</FieldLabel>
                <FieldInput id="es-min" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-income">Family income</FieldLabel>
                <FieldInput id="es-income" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-maxinc">Max income cap</FieldLabel>
                <FieldInput id="es-maxinc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "merit" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-exam">Exam %</FieldLabel>
                <FieldInput id="es-exam" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-board">Board %</FieldLabel>
                <FieldInput id="es-board" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-weight">Exam weight %</FieldLabel>
                <FieldInput id="es-weight" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "admission" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-yours">Your score</FieldLabel>
                <FieldInput id="es-yours" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-cut">Cut-off score</FieldLabel>
                <FieldInput id="es-cut" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-yourpct">Your % (optional)</FieldLabel>
                <FieldInput id="es-yourpct" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-minel">Min eligibility % (optional)</FieldLabel>
                <FieldInput id="es-minel" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cutoff" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-mode">Mode</FieldLabel>
                <select
                  id="es-mode"
                  className={selectCls}
                  value={mode}
                  onChange={(ev) => setMode(ev.target.value as "rank" | "score")}
                >
                  <option value="rank">Rank (lower is better)</option>
                  <option value="score">Score (higher is better)</option>
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="es-yval">Your rank or score</FieldLabel>
                <FieldInput id="es-yval" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-cval">Cut-off</FieldLabel>
                <FieldInput id="es-cval" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "course" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-have">Subjects you have (CSV)</FieldLabel>
                <FieldInput
                  id="es-have"
                  value={subjectsCsv}
                  onChange={(ev) => setSubjectsCsv(ev.target.value)}
                  placeholder="Physics,Chemistry,Math"
                />
              </div>
              <div>
                <FieldLabel htmlFor="es-req">Required subjects (CSV)</FieldLabel>
                <FieldInput
                  id="es-req"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  placeholder="Physics,Chemistry,Math,Biology"
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
