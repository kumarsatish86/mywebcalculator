"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  RISK_META,
  type DecisionOption,
  type LightningResult,
} from "@/lib/calculators/engineering/lightningProtection";

type Props = {
  result: LightningResult;
  onApplyOption: (opt: DecisionOption) => void;
  compact?: boolean;
};

function AnimatedNum({ value, digits = 1 }: { value: number; digits?: number }) {
  return (
    <motion.span
      key={value.toFixed(digits)}
      initial={{ opacity: 0.4, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="tabular-nums"
    >
      {value.toFixed(digits)}
    </motion.span>
  );
}

export function LpsDecisionCenter({ result, onApplyOption, compact }: Props) {
  const risk = RISK_META[result.risk];
  const note = result.engineeringNotes[0];

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Protection radius</p>
          <p className="font-mono text-xl font-semibold text-[var(--accent-bright)]">
            <AnimatedNum value={result.protectionRadiusM} /> m
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2.5 w-2.5 rounded-full ${risk.dot}`} />
          <span className="font-semibold text-[var(--text)]">{risk.label}</span>
          <span className="text-[var(--muted)]">{result.coveragePct}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Decision Center</p>

      <div className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 px-4 py-5 text-center">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Protection radius</p>
        <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-[var(--accent-bright)] sm:text-5xl">
          <AnimatedNum value={result.protectionRadiusM} />
          <span className="ml-1 text-2xl text-[var(--muted)]">m</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--text)]">{result.protectionLabel}</p>
        <p className="text-xs text-[var(--muted)]">
          Covers <AnimatedNum value={result.coveragePct} digits={0} />%
          {result.airTerminalsNeeded > 0
            ? ` · Need +${result.airTerminalsNeeded} air terminal`
            : " · Footprint covered (study)"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2">
          <span className={`h-3 w-3 rounded-full ${risk.dot}`} aria-hidden />
          <div>
            <p className="text-[10px] uppercase text-[var(--muted)]">Overall status</p>
            <p className="text-sm font-semibold text-[var(--text)]">{risk.label}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <p className="text-[10px] uppercase text-[var(--muted)]">Safety score</p>
          <p className="font-mono text-sm font-semibold">
            <AnimatedNum value={result.safetyScore} digits={0} /> / 100
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <p className="text-[10px] uppercase text-[var(--muted)]">Compliance</p>
          <p className="text-sm font-semibold">
            {result.summary.standard} · {result.compliance}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <p className="text-[10px] uppercase text-[var(--muted)]">Confidence</p>
          <p className="font-mono text-sm font-semibold">{result.calcConfidencePct}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { icon: "🛡", label: "Coverage", value: `${result.coveragePct}%` },
          { icon: "🌍", label: "Grounding", value: `${result.groundingOhm.toFixed(1)} Ω` },
          { icon: "📐", label: "Radius", value: `${result.protectionRadiusM.toFixed(1)} m` },
          { icon: "⚡", label: "Rods", value: String(result.suggestedRods) },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-[var(--border)] px-3 py-2">
            <p className="text-[10px] text-[var(--muted)]">
              <span aria-hidden>{m.icon}</span> {m.label}
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--text)]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs">
          <p className="text-[var(--muted)]">Coverage vs industry study target</p>
          <p className="mt-1 font-mono text-[var(--text)]">
            You {(result.benchmarks.coverageYou * 100).toFixed(0)}% · Target{" "}
            {(result.benchmarks.coverageTarget * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs">
          <p className="text-[var(--muted)]">Grounding vs study benchmark</p>
          <p className="mt-1 font-mono text-[var(--text)]">
            You {result.benchmarks.groundingYou.toFixed(1)}Ω · Rec. &lt;
            {result.benchmarks.groundingMaxOhm}Ω
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Next best actions
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {result.decisionOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onApplyOption(opt)}
              className="rounded-xl border border-[var(--border)] p-3 text-left transition hover:border-[var(--accent)]/50"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">{opt.label}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--text)]">{opt.action}</p>
              <p className="mt-2 font-mono text-sm text-[var(--accent-bright)]">
                {opt.coverageDeltaPct >= 0 ? "+" : ""}
                {opt.coverageDeltaPct}% coverage
              </p>
              <p className="mt-1 text-[10px] text-[var(--muted)]">{opt.expectedBlurb}</p>
            </button>
          ))}
        </div>
      </div>

      {note ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/40 px-3 py-3 text-xs leading-relaxed">
          <p className="font-semibold text-[var(--text)]">Engineering note</p>
          <p className="mt-1 text-[var(--muted)]">
            <span className="font-medium text-[var(--text)]">Observation:</span> {note.observation}
          </p>
          <p className="mt-1 text-[var(--muted)]">
            <span className="font-medium text-[var(--text)]">Impact:</span> {note.impact}
          </p>
          <p className="mt-1 text-[var(--muted)]">
            <span className="font-medium text-[var(--text)]">Recommendation:</span> {note.recommendation}
          </p>
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--border)] px-3 py-3 text-xs">
        <p className="font-semibold text-[var(--text)]">Estimated material (indicative INR)</p>
        <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div>
            <dt className="text-[var(--muted)]">Air terminals</dt>
            <dd className="font-mono">{result.cost.airTerminals}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Ground rods</dt>
            <dd className="font-mono">{result.cost.groundRods}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Copper</dt>
            <dd className="font-mono">{result.cost.copperM} m</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Est. cost</dt>
            <dd className="font-mono font-semibold">₹{result.cost.totalInr.toLocaleString("en-IN")}</dd>
          </div>
        </dl>
        <p className="mt-1 text-[10px] text-[var(--muted)]">{result.cost.note}</p>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Next step toolkit</p>
        <ul className="space-y-1">
          {result.relatedSlugs.map((r) => (
            <li key={r.slug}>
              <Link href={`/calculators/${r.slug}`} className="text-sm text-[var(--text)] hover:text-[var(--accent-bright)]">
                {r.reason} →
              </Link>
            </li>
          ))}
          <li>
            <Link href="/journeys/electrical-protection" className="text-xs font-semibold text-[var(--accent)]">
              Open protection journey →
            </Link>
          </li>
        </ul>
      </div>

      <p className="text-[10px] text-[var(--muted)]">{result.disclaimer}</p>
    </div>
  );
}
