"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { InsightList, SmartResultPanel } from "@/components/results/SmartResultPanel";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import {
  EXAM_PRESETS,
  PLANNER_URL,
  computeExamDigitalTwin,
  type ExamPresetId,
} from "@/lib/calculators/examStrategyPlanner";
import { parsePositive } from "@/lib/calculators/loanInputParse";

const PRESET_IDS = Object.keys(EXAM_PRESETS) as ExamPresetId[];
const PIE_COLORS = ["var(--accent)", "#64748b", "#94a3b8"];

type WizardStep = 0 | 1 | 2 | 3 | 4;

type SimQ = {
  id: number;
  difficulty: "Easy" | "Medium" | "Hard";
  attempted: boolean | null;
  correct: boolean | null;
};

export function ExamStrategyPlannerHost() {
  const examInit = useLoanInitialInput(PLANNER_URL.EXAM, "jee");
  const [step, setStep] = useState<WizardStep>(0);
  const [examId, setExamId] = useState<ExamPresetId>(
    PRESET_IDS.includes(examInit as ExamPresetId) ? (examInit as ExamPresetId) : "jee",
  );
  const [easyPct, setEasyPct] = useState(useLoanInitialInput(PLANNER_URL.EASY, "50"));
  const [medPct, setMedPct] = useState(useLoanInitialInput(PLANNER_URL.MED, "35"));
  const [hardPct, setHardPct] = useState(useLoanInitialInput(PLANNER_URL.HARD, "15"));
  const [nm, setNm] = useState(useLoanInitialInput(PLANNER_URL.NM, "1") !== "0");
  const [accuracy, setAccuracy] = useState(useLoanInitialInput(PLANNER_URL.ACC, "75"));
  const [confidence, setConfidence] = useState(useLoanInitialInput(PLANNER_URL.CONF, "70"));
  const [generated, setGenerated] = useState(false);

  const [simIndex, setSimIndex] = useState(0);
  const [simQs, setSimQs] = useState<SimQ[]>([]);
  const [simScore, setSimScore] = useState(0);
  const [simDone, setSimDone] = useState(false);
  const [coachPrompt, setCoachPrompt] = useState<string | null>(null);

  const shareParams = useCallback(() => {
    return {
      [PLANNER_URL.EXAM]: examId,
      [PLANNER_URL.EASY]: easyPct,
      [PLANNER_URL.MED]: medPct,
      [PLANNER_URL.HARD]: hardPct,
      [PLANNER_URL.NM]: nm ? "1" : "0",
      [PLANNER_URL.ACC]: accuracy,
      [PLANNER_URL.CONF]: confidence,
    };
  }, [examId, easyPct, medPct, hardPct, nm, accuracy, confidence]);

  useLoanUrlSync(shareParams, [examId, easyPct, medPct, hardPct, nm, accuracy, confidence]);

  const twin = useMemo(() => {
    if (!generated && step < 4) return null;
    const accR = parsePositive(accuracy, "Accuracy");
    const confR = parsePositive(confidence, "Confidence");
    const eaR = parsePositive(easyPct, "Easy %");
    const mdR = parsePositive(medPct, "Medium %");
    const hdR = parsePositive(hardPct, "Hard %");
    const acc = accR.ok ? accR.value : 75;
    const conf = confR.ok ? confR.value : 70;
    const ea = eaR.ok ? eaR.value : 50;
    const md = mdR.ok ? mdR.value : 35;
    const hd = hdR.ok ? hdR.value : 15;
    const result = computeExamDigitalTwin({
      examId,
      easyPct: ea,
      mediumPct: md,
      hardPct: hd,
      negativeMarking: nm,
      accuracyPercent: acc,
      confidenceThreshold: conf,
    });
    return "error" in result ? null : result;
  }, [generated, step, examId, easyPct, medPct, hardPct, nm, accuracy, confidence]);

  const startSim = () => {
    if (!twin) return;
    const qs: SimQ[] = [];
    for (let i = 0; i < 8; i++) {
      const difficulty: SimQ["difficulty"] =
        i < 3 ? "Easy" : i < 6 ? "Medium" : "Hard";
      qs.push({ id: i + 1, difficulty, attempted: null, correct: null });
    }
    setSimQs(qs);
    setSimIndex(0);
    setSimScore(0);
    setSimDone(false);
  };

  const answerSim = (attempt: boolean) => {
    if (!twin || simDone) return;
    const q = simQs[simIndex];
    if (!q) return;
    const p = twin.accuracyPercent / 100;
    const correct = attempt ? Math.random() < p : false;
    const marks = EXAM_PRESETS[examId].marksCorrect;
    const wrong = nm ? EXAM_PRESETS[examId].marksWrong : 0;
    let delta = 0;
    if (attempt) delta = correct ? marks : -wrong;
    const next = [...simQs];
    next[simIndex] = { ...q, attempted: attempt, correct: attempt ? correct : null };
    setSimQs(next);
    setSimScore((s) => s + delta);
    if (simIndex + 1 >= next.length) setSimDone(true);
    else setSimIndex((i) => i + 1);
  };

  const coachReply =
    twin && coachPrompt
      ? twin.coachTips.find((t) => t.prompt === coachPrompt)?.reply
      : null;

  return (
    <CalculatorShell
      title="AI Exam Strategy Planner"
      description="Rules-based digital twin: score bands, attempt strategies, time timeline, and a 7-day study plan. Teaching aid — not official exam rules."
    >
      <div className="space-y-8">
        {/* Wizard */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Step {Math.min(step + 1, 4)} of 4
          </p>

          {step === 0 ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm font-medium text-[var(--text)]">Which exam?</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setExamId(id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase ${
                      examId === id
                        ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent-bright)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {EXAM_PRESETS[id].label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg,white)]"
                onClick={() => setStep(1)}
              >
                Next
              </button>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm font-medium text-[var(--text)]">Difficulty mix (%)</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <FieldLabel htmlFor="ea">Easy</FieldLabel>
                  <FieldInput id="ea" value={easyPct} onChange={(e) => setEasyPct(e.target.value)} />
                </div>
                <div>
                  <FieldLabel htmlFor="md">Medium</FieldLabel>
                  <FieldInput id="md" value={medPct} onChange={(e) => setMedPct(e.target.value)} />
                </div>
                <div>
                  <FieldLabel htmlFor="hd">Hard</FieldLabel>
                  <FieldInput id="hd" value={hardPct} onChange={(e) => setHardPct(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="text-sm text-[var(--muted)]" onClick={() => setStep(0)}>
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg,white)]"
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm font-medium text-[var(--text)]">Negative marking?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNm(true)}
                  className={`rounded-lg border px-4 py-2 text-sm ${nm ? "border-[var(--accent)] text-[var(--accent-bright)]" : "border-[var(--border)]"}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setNm(false)}
                  className={`rounded-lg border px-4 py-2 text-sm ${!nm ? "border-[var(--accent)] text-[var(--accent-bright)]" : "border-[var(--border)]"}`}
                >
                  No
                </button>
              </div>
              <div className="flex gap-2">
                <button type="button" className="text-sm text-[var(--muted)]" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg,white)]"
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-3 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="acc">Accuracy estimate (%)</FieldLabel>
                  <FieldInput id="acc" value={accuracy} onChange={(e) => setAccuracy(e.target.value)} />
                </div>
                <div>
                  <FieldLabel htmlFor="cf">Confidence threshold (%)</FieldLabel>
                  <FieldInput
                    id="cf"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="text-sm text-[var(--muted)]" onClick={() => setStep(2)}>
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg,white)]"
                  onClick={() => {
                    setGenerated(true);
                    setStep(4);
                  }}
                >
                  Generate strategy
                </button>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="text-sm text-[var(--muted)] underline"
                onClick={() => {
                  setStep(0);
                  setGenerated(false);
                }}
              >
                Restart wizard
              </button>
            </div>
          ) : null}
        </div>

        {twin ? (
          <>
            <SmartResultPanel
              primaryLabel="Expected score"
              primaryValue={String(Math.round(twin.expectedScore))}
              statusLabel={twin.statusLabel}
              statusTone={twin.statusTone}
              risk={twin.risk}
              kpis={[
                { label: "Accuracy", value: `${twin.accuracyPercent.toFixed(0)}%` },
                { label: "Min / question", value: twin.minutesPerQuestion.toFixed(2) },
                { label: "Attempt quality", value: twin.attemptQuality },
                {
                  label: "Guessing prob.",
                  value: `${twin.guessingProbabilityPct.toFixed(0)}%`,
                },
                { label: "Best case", value: String(twin.bestScore) },
                { label: "Worst case", value: String(twin.worstScore) },
              ]}
              suggestions={twin.suggestions.map((text) => ({ text }))}
              chart={
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-44">
                    <p className="mb-1 text-xs text-[var(--muted)]">Attempt mix</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={twin.chartAttempt} dataKey="value" nameKey="name" outerRadius={60}>
                          {twin.chartAttempt.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-44">
                    <p className="mb-1 text-xs text-[var(--muted)]">Score range</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={twin.chartScoreRange}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="var(--accent)" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              }
            >
              <InsightList items={twin.insights} />
            </SmartResultPanel>

            {/* Strategy compare */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                Strategy comparison
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {twin.strategies.map((s) => (
                  <div
                    key={s.kind}
                    className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/40 p-4"
                  >
                    <p className="font-semibold text-[var(--text)]">{s.label}</p>
                    <p className="mt-2 font-mono text-2xl text-[var(--accent-bright)]">
                      {Math.round(s.expectedScore)}
                    </p>
                    <p className="text-xs text-[var(--muted)]">expected score</p>
                    <dl className="mt-2 space-y-1 text-xs text-[var(--muted)]">
                      <div className="flex justify-between">
                        <dt>Attempt</dt>
                        <dd className="font-mono text-[var(--text)]">{s.attemptPct}%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Risk</dt>
                        <dd className="font-mono text-[var(--text)]">{s.risk}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                Time simulator
              </h3>
              <ol className="space-y-2">
                {twin.timeline.map((ph) => (
                  <li
                    key={ph.label}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-[var(--text)]">{ph.label}</span>
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {ph.startMin}–{ph.endMin} min
                    </span>
                    <span className="w-full text-xs text-[var(--muted)]">{ph.focus}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Study plan */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                7-day study plan
              </h3>
              <ul className="space-y-2">
                {twin.studyPlan.map((d) => (
                  <li
                    key={d.day}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-[var(--text)]">
                      Day {d.day} · {d.subject} · {d.hours}h
                    </p>
                    <p className="text-xs text-[var(--muted)]">{d.why}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Simulator */}
            <section className="rounded-xl border border-[var(--border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                  Question simulator
                </h3>
                <button
                  type="button"
                  onClick={startSim}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold"
                >
                  {simQs.length ? "Restart" : "Start"} mini mock (8 Q)
                </button>
              </div>
              {simQs.length && !simDone ? (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-[var(--text)]">
                    Question {simIndex + 1} · {simQs[simIndex]?.difficulty}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Attempt this question?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm text-[var(--accent-fg,white)]"
                      onClick={() => answerSim(true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
                      onClick={() => answerSim(false)}
                    >
                      Skip
                    </button>
                  </div>
                  <p className="font-mono text-sm">Running score: {simScore.toFixed(1)}</p>
                </div>
              ) : null}
              {simDone ? (
                <div className="mt-3 text-sm">
                  <p className="font-semibold text-[var(--text)]">Performance summary</p>
                  <p className="text-[var(--muted)]">
                    Score {simScore.toFixed(1)} · Attempted{" "}
                    {simQs.filter((q) => q.attempted).length}/{simQs.length} · Correct{" "}
                    {simQs.filter((q) => q.correct).length}
                  </p>
                </div>
              ) : null}
            </section>

            {/* Coach */}
            <section className="rounded-xl border border-[var(--border)] p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                Strategy coach
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {twin.coachTips.map((t) => (
                  <button
                    key={t.prompt}
                    type="button"
                    onClick={() => setCoachPrompt(t.prompt)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text)] hover:border-[var(--accent)]/40"
                  >
                    {t.prompt}
                  </button>
                ))}
              </div>
              {coachReply ? (
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{coachReply}</p>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
