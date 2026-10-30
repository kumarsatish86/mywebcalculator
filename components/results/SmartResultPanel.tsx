"use client";

import type { ReactNode } from "react";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type SmartKpi = {
  label: string;
  value: string;
  hint?: string;
};

export type SmartSuggestion = {
  text: string;
};

export type SmartResultPanelProps = {
  primaryLabel: string;
  primaryValue: string;
  statusLabel?: string;
  statusTone?: "good" | "warn" | "bad" | "neutral";
  kpis?: SmartKpi[];
  suggestions?: SmartSuggestion[];
  risk?: RiskLevel;
  chart?: ReactNode;
  explain?: ReactNode;
  children?: ReactNode;
};

const statusClass: Record<NonNullable<SmartResultPanelProps["statusTone"]>, string> = {
  good: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warn: "border-amber-500/35 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  bad: "border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  neutral: "border-[var(--border)] bg-[var(--input-bg)] text-[var(--muted)]",
};

const riskClass: Record<RiskLevel, string> = {
  LOW: "text-emerald-600 dark:text-emerald-400",
  MEDIUM: "text-amber-600 dark:text-amber-400",
  HIGH: "text-rose-600 dark:text-rose-400",
};

export function SmartResultPanel({
  primaryLabel,
  primaryValue,
  statusLabel,
  statusTone = "neutral",
  kpis = [],
  suggestions = [],
  risk,
  chart,
  explain,
  children,
}: SmartResultPanelProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[var(--muted)]">{primaryLabel}</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-tight text-[var(--accent-bright)]">
            {primaryValue}
          </p>
        </div>
        {statusLabel ? (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusClass[statusTone]}`}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      {risk ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Risk</p>
          <p className={`mt-0.5 text-sm font-bold ${riskClass[risk]}`}>{risk}</p>
          <RiskMeter level={risk} />
        </div>
      ) : null}

      {kpis.length ? (
        <div className="grid gap-2 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-[var(--border)]/80 bg-[var(--surface)]/40 px-3 py-2">
              <p className="text-xs text-[var(--muted)]">{k.label}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--text)]">{k.value}</p>
              {k.hint ? <p className="mt-0.5 text-[10px] text-[var(--muted)]">{k.hint}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {chart ? <div className="border-t border-[var(--border)] pt-3">{chart}</div> : null}

      {suggestions.length ? <SuggestionChips suggestions={suggestions} /> : null}

      {explain ? <div className="border-t border-[var(--border)] pt-3">{explain}</div> : null}

      {children}
    </div>
  );
}

export function RiskMeter({ level }: { level: RiskLevel }) {
  const fill = level === "LOW" ? 28 : level === "MEDIUM" ? 58 : 88;
  const bar =
    level === "LOW" ? "bg-emerald-500" : level === "MEDIUM" ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]" aria-hidden>
      <div className={`h-full rounded-full ${bar}`} style={{ width: `${fill}%` }} />
    </div>
  );
}

export function InsightList({
  items,
  title = "Insights",
}: {
  items: { title: string; detail: string; tone?: "good" | "warn" | "bad" }[];
  title?: string;
}) {
  if (!items.length) return null;
  const toneClass = {
    good: "border-emerald-500/25 bg-emerald-500/5",
    warn: "border-amber-500/25 bg-amber-500/5",
    bad: "border-rose-500/25 bg-rose-500/5",
  } as const;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">{title}</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={`${it.title}-${i}`}
            className={`rounded-lg border px-3 py-2 ${toneClass[it.tone ?? "good"]}`}
          >
            <p className="font-medium text-[var(--text)]">{it.title}</p>
            <p className="mt-0.5 text-[var(--muted)]">{it.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SuggestionChips({ suggestions }: { suggestions: SmartSuggestion[] }) {
  if (!suggestions.length) return null;
  return (
    <div className="space-y-2 border-t border-[var(--border)] pt-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Suggestions</p>
      <ul className="space-y-1.5">
        {suggestions.map((s, i) => (
          <li key={`${s.text}-${i}`} className="flex gap-2 text-sm text-[var(--text)]">
            <span className="text-emerald-600" aria-hidden>
              ✓
            </span>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
