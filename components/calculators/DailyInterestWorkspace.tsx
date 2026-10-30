"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalculatorShell } from "@/components/CalculatorShell";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import {
  DI_URL,
  LOAN_PRESETS,
  computeDailyInterestDecision,
  type DecisionOption,
  type DiMode,
  type LoanPresetId,
} from "@/lib/calculators/dailyInterestDecision";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { DiChartPanel } from "./daily-interest/DiChartPanel";
import { DiCostTimeline } from "./daily-interest/DiCostTimeline";
import { DiDecisionCenter } from "./daily-interest/DiDecisionCenter";
import { DiInputCards } from "./daily-interest/DiInputCards";
import { DiModeTabs } from "./daily-interest/DiModeTabs";
import { DiMoneyFlow } from "./daily-interest/DiMoneyFlow";
import { DiTrustHero } from "./daily-interest/DiTrustHero";

type SavedProject = {
  id: string;
  name: string;
  savedAt: number;
  snapshot: {
    principal: string;
    apr: string;
    days: string;
    presetId: LoanPresetId;
    mode: DiMode;
    delayDays: string;
    penaltyFlat: string;
    prepayAmount: string;
    extraMonthly: string;
    inflation: string;
    remainingMonths: string;
  };
  summary?: {
    daily: number;
    annual: number;
    score: number;
    apr: number;
  };
};

const STORAGE_KEY = "mwc-di-projects";
const PRESET_IDS = Object.keys(LOAN_PRESETS) as LoanPresetId[];
const MODES: DiMode[] = ["quick", "planner", "compare", "delay", "prepay", "penalty"];

function loadProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProjects(list: SavedProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
}

export function DailyInterestWorkspace() {
  const { currency } = useLoanCalcPrefs();
  const presetInit = useLoanInitialInput(DI_URL.PRESET, "home");
  const modeInit = useLoanInitialInput(DI_URL.MODE, "quick");

  const [presetId, setPresetId] = useState<LoanPresetId>(
    PRESET_IDS.includes(presetInit as LoanPresetId) ? (presetInit as LoanPresetId) : "home",
  );
  const [mode, setMode] = useState<DiMode>(MODES.includes(modeInit as DiMode) ? (modeInit as DiMode) : "quick");
  const [principal, setPrincipal] = useState(useLoanInitialInput(DI_URL.P, "250000"));
  const [apr, setApr] = useState(
    useLoanInitialInput(DI_URL.A, String(LOAN_PRESETS[presetId]?.apr ?? 8.5)),
  );
  const [days, setDays] = useState(useLoanInitialInput(DI_URL.U, "30"));
  const [delayDays, setDelayDays] = useState(useLoanInitialInput(DI_URL.DELAY, "5"));
  const [penaltyFlat, setPenaltyFlat] = useState(useLoanInitialInput(DI_URL.PEN, ""));
  const [prepayAmount, setPrepayAmount] = useState(useLoanInitialInput(DI_URL.PREPAY, ""));
  const [extraMonthly, setExtraMonthly] = useState(useLoanInitialInput(DI_URL.EXTRA, ""));
  const [inflation, setInflation] = useState(useLoanInitialInput(DI_URL.INF, "5"));
  const [remainingMonths, setRemainingMonths] = useState("60");
  const [coachPrompt, setCoachPrompt] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Home loan study");

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const applyPreset = (id: LoanPresetId) => {
    const p = LOAN_PRESETS[id];
    setPresetId(id);
    setApr(String(p.apr));
    setProjectName(`${p.label} study`);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {
      [DI_URL.P]: principal,
      [DI_URL.A]: apr,
      [DI_URL.U]: days,
      [DI_URL.PRESET]: presetId,
      [DI_URL.MODE]: mode,
      [DI_URL.INF]: inflation,
      [LOAN_URL.CUR]: currency,
    };
    if (delayDays.trim()) out[DI_URL.DELAY] = delayDays;
    if (penaltyFlat.trim()) out[DI_URL.PEN] = penaltyFlat;
    if (prepayAmount.trim()) out[DI_URL.PREPAY] = prepayAmount;
    if (extraMonthly.trim()) out[DI_URL.EXTRA] = extraMonthly;
    return out;
  }, [principal, apr, days, presetId, mode, inflation, delayDays, penaltyFlat, prepayAmount, extraMonthly, currency]);

  useLoanUrlSync(shareParams, [
    principal,
    apr,
    days,
    presetId,
    mode,
    inflation,
    delayDays,
    penaltyFlat,
    prepayAmount,
    extraMonthly,
    currency,
  ]);

  const result = useMemo(() => {
    const p0 = parsePositive(principal, "Principal / balance");
    const a0 = parseAprPercent(apr, "APR");
    const d0 = parsePositive(days, "Days");
    if (!p0.ok) return { error: p0.error };
    if (!a0.ok) return { error: a0.error };
    if (!d0.ok) return { error: d0.error };

    const delayN = delayDays.trim() ? Number(delayDays) : 0;
    const penN = penaltyFlat.trim() ? Number(penaltyFlat) : undefined;
    const prepayN = prepayAmount.trim() ? Number(prepayAmount) : 0;
    const extraN = extraMonthly.trim() ? Number(extraMonthly) : 0;
    const infN = inflation.trim() ? Number(inflation) : 5;
    const remN = remainingMonths.trim() ? Number(remainingMonths) : 60;

    const r = computeDailyInterestDecision({
      principal: p0.value,
      apr: a0.value,
      days: Math.round(d0.value),
      presetId,
      delayDays: Number.isFinite(delayN) ? delayN : 0,
      penaltyFlat: penN != null && Number.isFinite(penN) ? penN : undefined,
      prepayAmount: Number.isFinite(prepayN) ? prepayN : 0,
      extraMonthly: Number.isFinite(extraN) ? extraN : 0,
      inflationPercent: Number.isFinite(infN) ? infN : 5,
      remainingMonths: Number.isFinite(remN) && remN > 0 ? remN : 60,
    });
    if ("error" in r) return { error: r.error };
    return { error: null as string | null, data: r };
  }, [
    principal,
    apr,
    days,
    presetId,
    delayDays,
    penaltyFlat,
    prepayAmount,
    extraMonthly,
    inflation,
    remainingMonths,
  ]);

  const data = result.error ? null : result.data;

  const applyOption = (opt: DecisionOption) => {
    if (opt.patch.prepayAmount != null) {
      setPrepayAmount(String(opt.patch.prepayAmount));
      setMode("prepay");
    }
    if (opt.patch.extraMonthly != null) {
      setExtraMonthly(String(opt.patch.extraMonthly));
      setMode("planner");
    }
    if (opt.patch.apr != null) {
      setApr(String(opt.patch.apr));
      setMode("compare");
    }
  };

  const saveProject = () => {
    const item: SavedProject = {
      id: `p-${Date.now()}`,
      name: projectName.trim() || "Untitled",
      savedAt: Date.now(),
      snapshot: {
        principal,
        apr,
        days,
        presetId,
        mode,
        delayDays,
        penaltyFlat,
        prepayAmount,
        extraMonthly,
        inflation,
        remainingMonths,
      },
      summary: data
        ? {
            daily: data.dailyInterest,
            annual: data.yearlyInterest,
            score: data.healthScore,
            apr: Number(apr) || 0,
          }
        : undefined,
    };
    const next = [item, ...projects];
    setProjects(next);
    saveProjects(next);
  };

  const restoreProject = (p: SavedProject) => {
    const s = p.snapshot;
    setPrincipal(s.principal);
    setApr(s.apr);
    setDays(s.days);
    setPresetId(s.presetId);
    setMode(s.mode);
    setDelayDays(s.delayDays);
    setPenaltyFlat(s.penaltyFlat);
    setPrepayAmount(s.prepayAmount);
    setExtraMonthly(s.extraMonthly);
    setInflation(s.inflation);
    setRemainingMonths(s.remainingMonths);
    setProjectName(p.name);
  };

  const deleteProject = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    saveProjects(next);
    if (compareA === id) setCompareA(null);
    if (compareB === id) setCompareB(null);
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  const daysNum = Math.min(365, Math.max(1, Math.round(Number(days) || 30)));
  const projA = projects.find((p) => p.id === compareA);
  const projB = projects.find((p) => p.id === compareB);
  const coachReply =
    data && coachPrompt ? data.coachTips.find((t) => t.prompt === coachPrompt)?.reply : null;

  return (
    <CalculatorShell
      title="Daily interest calculator"
      description="Financial Decision Workspace — daily cost, delay/prepay sketches, and next actions. Actual/365 teaching aid."
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <LoanCalculatorChrome />
          <button type="button" onClick={copyShare} className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold">
            Share
          </button>
          <button type="button" onClick={saveProject} className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold">
            Save project
          </button>
          <button
            type="button"
            onClick={() => {
              applyPreset("personal");
              setMode("quick");
            }}
            className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold"
          >
            Example
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <DiTrustHero presetId={presetId} onPreset={applyPreset} />
        <DiModeTabs mode={mode} onMode={setMode} />

        <ol className="flex flex-wrap gap-1.5">
          {["Ask", "Analyze", "Visualize", "Decide"].map((label, i) => (
            <li key={label} className="flex items-center gap-1.5">
              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {label}
              </span>
              {i < 3 ? <span className="text-[var(--border)]" aria-hidden>→</span> : null}
            </li>
          ))}
          <li>
            <Link
              href="/journeys/loan-daily-interest"
              className="rounded-full border border-[var(--accent)]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]"
            >
              Loan interest journey
            </Link>
          </li>
        </ol>

        {data ? (
          <div className="sticky top-0 z-30 -mx-1 lg:hidden">
            <DiDecisionCenter
              result={data}
              currency={currency}
              onApplyOption={applyOption}
              compact
            />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          <div className="space-y-4">
            <DiInputCards
              mode={mode}
              presetId={presetId}
              onPreset={applyPreset}
              principal={principal}
              setPrincipal={setPrincipal}
              apr={apr}
              setApr={setApr}
              days={days}
              setDays={setDays}
              delayDays={delayDays}
              setDelayDays={setDelayDays}
              penaltyFlat={penaltyFlat}
              setPenaltyFlat={setPenaltyFlat}
              prepayAmount={prepayAmount}
              setPrepayAmount={setPrepayAmount}
              extraMonthly={extraMonthly}
              setExtraMonthly={setExtraMonthly}
              inflation={inflation}
              setInflation={setInflation}
              remainingMonths={remainingMonths}
              setRemainingMonths={setRemainingMonths}
            />
            {result.error ? <p className="text-sm text-rose-600">{result.error}</p> : null}

            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Projects</p>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <div className="min-w-[140px] flex-1">
                  <FieldLabel htmlFor="di-proj-name">Name</FieldLabel>
                  <FieldInput id="di-proj-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={saveProject}
                  className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-fg,white)]"
                >
                  Save
                </button>
              </div>
              {projects.length ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {projects.map((p) => (
                    <li key={p.id} className="rounded-lg border border-[var(--border)] p-2 text-xs">
                      <button
                        type="button"
                        className="w-full text-left font-semibold text-[var(--text)] hover:text-[var(--accent-bright)]"
                        onClick={() => restoreProject(p)}
                      >
                        {p.name}
                      </button>
                      <p className="text-[var(--muted)]">
                        {LOAN_PRESETS[p.snapshot.presetId]?.label}
                        {p.summary ? ` · score ${p.summary.score} · ${p.summary.apr}%` : ""}
                      </p>
                      <div className="mt-1 flex gap-2">
                        <button type="button" className="text-[10px] text-[var(--accent)]" onClick={() => restoreProject(p)}>
                          Open
                        </button>
                        <button type="button" className="text-[10px] text-rose-600" onClick={() => deleteProject(p.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">No saved projects yet (this device only).</p>
              )}
              {projects.length >= 2 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] font-semibold uppercase text-[var(--muted)]">Compare</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-2 py-1.5 text-xs"
                      value={compareA ?? ""}
                      onChange={(e) => setCompareA(e.target.value || null)}
                    >
                      <option value="">Project A…</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-2 py-1.5 text-xs"
                      value={compareB ?? ""}
                      onChange={(e) => setCompareB(e.target.value || null)}
                    >
                      <option value="">Project B…</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {projA?.summary && projB?.summary ? (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {[projA, projB].map((p) => (
                        <div key={p.id} className="rounded-lg border border-[var(--border)] p-2">
                          <p className="font-semibold">{p.name}</p>
                          <p className="font-mono">Daily {p.summary!.daily.toFixed(2)}</p>
                          <p className="font-mono">Annual {p.summary!.annual.toFixed(0)}</p>
                          <p>Score {p.summary!.score}</p>
                          <p>APR {p.summary!.apr}%</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            {data ? (
              <>
                <div className="hidden lg:block">
                  <DiDecisionCenter
                    result={data}
                    currency={currency}
                    onApplyOption={applyOption}
                    showCompare={mode === "compare"}
                    showDelay={mode === "delay" || mode === "penalty"}
                    showPrepay={mode === "prepay" || mode === "planner"}
                  />
                </div>
                <div className="lg:hidden">
                  <DiDecisionCenter
                    result={data}
                    currency={currency}
                    onApplyOption={applyOption}
                    showCompare={mode === "compare"}
                    showDelay={mode === "delay" || mode === "penalty"}
                    showPrepay={mode === "prepay" || mode === "planner"}
                  />
                </div>
                <DiCostTimeline timeline={data.timeline} currency={currency} />
                <DiMoneyFlow />
                <DiChartPanel
                  result={data}
                  days={daysNum}
                  onDays={(d) => setDays(String(d))}
                  currency={currency}
                />
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Enter a valid balance, APR, and days for Decision Center results.</p>
            )}
          </div>
        </div>

        {showCoach && data ? (
          <div className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Ask advisor (rules)</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Not a live AI model — canned study replies.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.coachTips.map((t) => (
                <button
                  key={t.prompt}
                  type="button"
                  onClick={() => setCoachPrompt(t.prompt)}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                >
                  {t.prompt}
                </button>
              ))}
            </div>
            {coachReply ? (
              <p className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--input-bg)]/40 p-3 text-sm leading-relaxed text-[var(--muted)]">
                {coachReply}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          setShowCoach(true);
          setCoachPrompt(data?.coachTips[0]?.prompt ?? null);
        }}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-fg,white)] shadow-lg"
      >
        Ask advisor
      </button>
    </CalculatorShell>
  );
}
