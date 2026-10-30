"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CENTER_GOALS,
  CENTER_PROBLEMS,
  CENTER_ROADMAP,
  CENTER_STAGES,
  CENTER_TOOLKITS,
  CENTER_WORKFLOWS,
  EXAM_TABS,
  filterCenterTools,
  getToolMeta,
  type CenterFilterState,
  type DifficultyId,
  type ExamId,
  type GoalId,
  type StageId,
} from "@/lib/education/examSuccessCenter";
import { matchExamNeed, suggestionsForProblem } from "@/lib/education/matchExamNeed";
import { getJourney } from "@/lib/journeys/definitions";
import { RichToolCard } from "./RichToolCard";

const READY_KEY = "mwc-exam-readiness-v1";

type Readiness = { time: number; accuracy: number; revision: number };

function loadReadiness(): Readiness {
  if (typeof window === "undefined") return { time: 40, accuracy: 40, revision: 40 };
  try {
    const raw = localStorage.getItem(READY_KEY);
    if (!raw) return { time: 40, accuracy: 40, revision: 40 };
    return { ...{ time: 40, accuracy: 40, revision: 40 }, ...JSON.parse(raw) };
  } catch {
    return { time: 40, accuracy: 40, revision: 40 };
  }
}

function bumpReadiness(slug: string) {
  const meta = getToolMeta(slug);
  const cur = loadReadiness();
  const next = { ...cur };
  if (!meta) {
    next.time = Math.min(100, next.time + 2);
  } else if (meta.stage === "during" || meta.goals.includes("improve_speed")) {
    next.time = Math.min(100, next.time + 6);
  } else if (meta.goals.includes("improve_accuracy") || meta.goals.includes("reduce_negative")) {
    next.accuracy = Math.min(100, next.accuracy + 6);
  } else if (meta.stage === "before") {
    next.revision = Math.min(100, next.revision + 6);
  } else {
    next.accuracy = Math.min(100, next.accuracy + 3);
    next.revision = Math.min(100, next.revision + 3);
  }
  localStorage.setItem(READY_KEY, JSON.stringify(next));
  return next;
}

function parseFilters(sp: URLSearchParams): CenterFilterState {
  const exam = (sp.get("exam") as ExamId | "all") || "all";
  const difficulty = (sp.get("diff") as DifficultyId | "all") || "all";
  const goal = (sp.get("goal") as GoalId | "all") || "all";
  const stage = (sp.get("stage") as StageId | "all") || "all";
  const q = sp.get("q") ?? "";
  return { exam, difficulty, goal, stage, q };
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
        <span>{label}</span>
        <span className="font-mono text-[var(--text)]">{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${clamp(value, 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function ExamSuccessCenter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const [needQuery, setNeedQuery] = useState(filters.q);
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachProblem, setCoachProblem] = useState<string | null>(null);
  const [ready, setReady] = useState<Readiness>({ time: 40, accuracy: 40, revision: 40 });

  useEffect(() => {
    setReady(loadReadiness());
  }, []);

  useEffect(() => {
    setNeedQuery(filters.q);
  }, [filters.q]);

  const setFilter = useCallback(
    (patch: Partial<CenterFilterState>) => {
      const next = { ...filters, ...patch };
      const p = new URLSearchParams();
      if (next.exam !== "all") p.set("exam", next.exam);
      if (next.difficulty !== "all") p.set("diff", next.difficulty);
      if (next.goal !== "all") p.set("goal", next.goal);
      if (next.stage !== "all") p.set("stage", next.stage);
      if (next.q.trim()) p.set("q", next.q.trim());
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router],
  );

  const tools = useMemo(() => filterCenterTools(filters), [filters]);
  const needHits = useMemo(() => {
    if (filters.q.trim()) return matchExamNeed(filters.q, 6);
    return [];
  }, [filters.q]);

  const overall = Math.round((ready.time + ready.accuracy + ready.revision) / 3);

  const onOpenTool = (slug: string) => {
    setReady(bumpReadiness(slug));
  };

  const coachHits = coachProblem ? suggestionsForProblem(coachProblem) : [];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-8 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent-bright)]">
              Education Studio
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
              AI Exam Success Center
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] md:text-base">
              Guided workflows for before, during, and after the exam — not a flat list of calculators.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/calculators/exam-strategy-planner"
              onClick={() => onOpenTool("exam-strategy-planner")}
              className="inline-flex items-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg,white)] transition hover:opacity-90"
            >
              Start Planning
            </Link>
            <a
              href="#workflows"
              className="inline-flex items-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)]/40"
            >
              Browse journeys
            </a>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Choose your goal
            </p>
            <div className="flex flex-wrap gap-2">
              {CENTER_GOALS.map((g) => {
                const active = filters.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    title={g.blurb}
                    onClick={() => setFilter({ goal: active ? "all" : g.id })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent-bright)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              What do you need today?
            </p>
            <div className="flex flex-wrap gap-2">
              {CENTER_PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setFilter({ q: p.label });
                    setCoachProblem(p.id);
                    setCoachOpen(true);
                  }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)]/40 px-3 py-1.5 text-left text-xs text-[var(--text)] hover:border-[var(--accent)]/40"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <form
              className="mt-3 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setFilter({ q: needQuery });
              }}
            >
              <input
                value={needQuery}
                onChange={(e) => setNeedQuery(e.target.value)}
                placeholder='Try: "I finish only 70% paper"'
                className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                aria-label="Describe your exam problem"
              />
              <button
                type="submit"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)]/40"
              >
                Find tools
              </button>
            </form>
            {needHits.length > 0 ? (
              <ul className="mt-3 space-y-1.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/30 p-3">
                <li className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  Recommended
                </li>
                {needHits.map((h) => (
                  <li key={h.slug}>
                    <Link
                      href={`/calculators/${h.slug}`}
                      onClick={() => onOpenTool(h.slug)}
                      className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent-bright)]"
                    >
                      {h.title}
                    </Link>
                    <span className="ml-2 text-xs text-[var(--muted)]">{h.reason}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      {/* Readiness (local) */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-5">
        <h3 className="text-sm font-semibold text-[var(--text)]">Exam readiness (this device)</h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Anonymous progress from tools you open here — not synced to an account.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ProgressBar label="Overall" value={overall} />
          <ProgressBar label="Time management" value={ready.time} />
          <ProgressBar label="Accuracy" value={ready.accuracy} />
          <ProgressBar label="Revision" value={ready.revision} />
        </div>
      </section>

      {/* Sticky filters */}
      <div className="sticky top-0 z-20 -mx-1 space-y-3 border-b border-[var(--border)] bg-[var(--bg)]/95 px-1 py-3 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {EXAM_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter({ exam: t.id })}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                filters.exam === t.id
                  ? "bg-[var(--accent)] text-[var(--accent-fg,white)]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilter({ difficulty: d })}
              className={`rounded-md border px-2.5 py-1 text-[11px] capitalize ${
                filters.difficulty === d
                  ? "border-[var(--accent)] text-[var(--accent-bright)]"
                  : "border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {d === "all" ? "Any level" : d}
            </button>
          ))}
          {CENTER_STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter({ stage: filters.stage === s.id ? "all" : s.id })}
              className={`rounded-md border px-2.5 py-1 text-[11px] ${
                filters.stage === s.id
                  ? "border-[var(--accent)] text-[var(--accent-bright)]"
                  : "border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows */}
      <section id="workflows" className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--text)]">Workflow journeys</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {CENTER_WORKFLOWS.filter(
            (w) => filters.exam === "all" || w.examTags.includes(filters.exam as ExamId),
          ).map((w) => {
            const journey = getJourney(w.journeyId);
            const count = journey?.steps.length ?? 0;
            return (
              <Link
                key={w.id}
                href={`/journeys/${w.journeyId}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/50"
              >
                <p className="text-lg font-semibold text-[var(--text)]">{w.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{w.blurb}</p>
                <dl className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
                  <div>
                    <dt className="uppercase tracking-wider">Tools</dt>
                    <dd className="font-mono text-[var(--text)]">{count}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider">Est. time</dt>
                    <dd className="font-mono text-[var(--text)]">{w.estMinutes} min</dd>
                  </div>
                </dl>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--accent)]">
                  Start journey →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stage rails */}
      {CENTER_STAGES.map((stage) => {
        const stageTools = tools.filter((t) => t.stage === stage.id);
        if (!stageTools.length) return null;
        return (
          <section key={stage.id} className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-[var(--text)]">{stage.title}</h3>
              <p className="text-sm text-[var(--muted)]">{stage.blurb}</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {stageTools.map((t) => (
                <RichToolCard key={t.slug} tool={t} onOpen={onOpenTool} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Toolkits */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--text)]">Exam toolkits</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CENTER_TOOLKITS.map((tk) => (
            <button
              key={tk.id}
              type="button"
              onClick={() => setFilter({ exam: tk.exam, stage: "all" })}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 text-left hover:border-[var(--accent)]/40"
            >
              <p className="font-semibold text-[var(--text)]">{tk.title}</p>
              <p className="mt-1 font-mono text-sm text-[var(--muted)]">{tk.slugs.length} calculators</p>
            </button>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--text)]">Interactive roadmap</h3>
        <ol className="space-y-0">
          {CENTER_ROADMAP.map((step, i) => (
            <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {i < CENTER_ROADMAP.length - 1 ? (
                <span
                  className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-[var(--border)]"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-[1] mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/50 bg-[var(--surface)] text-[10px] font-bold text-[var(--accent-bright)]">
                {i + 1}
              </span>
              <div>
                <Link
                  href={`/calculators/${step.slug}`}
                  onClick={() => onOpenTool(step.slug)}
                  className="font-semibold text-[var(--text)] hover:text-[var(--accent-bright)]"
                >
                  {step.title}
                </Link>
                <p className="text-sm text-[var(--muted)]">{step.blurb}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* SEO insights */}
      <section className="space-y-6 border-t border-[var(--border)] pt-10">
        <h3 className="text-xl font-semibold text-[var(--text)]">Exam strategy insights</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="space-y-2">
            <h4 className="font-semibold text-[var(--text)]">Why students lose marks</h4>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Most score leaks come from random guessing under negative marking, unfinished easy
              sections, and revisiting hard questions too early. Model expected value before you attempt.
            </p>
          </article>
          <article className="space-y-2">
            <h4 className="font-semibold text-[var(--text)]">Top time management mistakes</h4>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Equal time per question ignores difficulty. Front-load high-confidence marks, then medium,
              then hard — leave a deliberate review window at the end.
            </p>
          </article>
          <article className="space-y-2">
            <h4 className="font-semibold text-[var(--text)]">Negative marking strategies</h4>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              If accuracy is below ~70% with −1 penalties, skipping doubtful items often raises expected
              score. Use the Optimal Attempt and Negative Marking tools to check your threshold.
            </p>
          </article>
          <article className="space-y-2">
            <h4 className="font-semibold text-[var(--text)]">Best order to solve questions</h4>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Easy → Medium → Hard with mark-for-review is the default for JEE/NEET/CAT-style papers.
              AIR-oriented plans still protect accuracy first; speed comes after consistency on mocks.
            </p>
          </article>
        </div>
      </section>

      {/* Floating coach */}
      <div className="fixed bottom-4 right-4 z-40 flex max-w-sm flex-col items-end gap-2">
        {coachOpen ? (
          <div className="w-[min(100vw-2rem,22rem)] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text)]">Exam assistant</p>
              <button
                type="button"
                className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
                onClick={() => setCoachOpen(false)}
              >
                Close
              </button>
            </div>
            <p className="text-xs text-[var(--muted)]">What problem are you facing?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CENTER_PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCoachProblem(p.id)}
                  className={`rounded-md border px-2 py-1 text-[10px] ${
                    coachProblem === p.id
                      ? "border-[var(--accent)] text-[var(--accent-bright)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {coachHits.length ? (
              <ul className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-2">
                <li className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                  Recommended
                </li>
                {coachHits.slice(0, 5).map((h) => (
                  <li key={h.slug}>
                    <Link
                      href={`/calculators/${h.slug}`}
                      onClick={() => onOpenTool(h.slug)}
                      className="text-sm text-[var(--text)] hover:text-[var(--accent-bright)]"
                    >
                      {h.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-2 text-[10px] text-[var(--muted)]">Rules-based tips — not a live AI model.</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setCoachOpen((o) => !o)}
          className="rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg,white)] shadow-md"
        >
          Ask assistant
        </button>
      </div>
    </div>
  );
}
