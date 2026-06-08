"use client";

import { useState } from "react";
import { computeBodyMetric } from "@/lib/calculators/health/bodyMetricsEngine";

type Props = { slug: string };

const inputCls =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
const labelCls = "block text-xs font-medium uppercase tracking-wide text-[var(--muted)]";

function parseNum(s: string): number | undefined {
  const t = s.trim();
  if (!t) return undefined;
  const v = Number(t);
  return Number.isFinite(v) ? v : undefined;
}

export function BodyMetricsCalculatorHost({ slug }: Props) {
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [out, setOut] = useState<ReturnType<typeof computeBodyMetric> | null>(null);
  const set = (k: string, v: string) => setRaw((p) => ({ ...p, [k]: v }));

  const run = () => {
    const f: Record<string, unknown> = { sex: raw.sex === "female" ? "female" : "male" };
    const keys = [
      "weightKg",
      "heightCm",
      "ageYears",
      "waistCm",
      "neckCm",
      "hipCm",
      "bodyFatPct",
      "n",
    ] as const;
    for (const k of keys) {
      const v = parseNum(raw[k] ?? "");
      if (v !== undefined) f[k] = v;
    }
    setOut(computeBodyMetric(slug, f));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm text-[var(--muted)]">
        These tools are for general education only—not medical diagnosis, prescription, or emergency use.
      </aside>
      <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Sex (for BMR / Navy)</label>
          <select className={inputCls} value={raw.sex ?? "male"} onChange={(e) => set("sex", e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Weight (kg)</label>
          <input className={inputCls} inputMode="decimal" value={raw.weightKg ?? ""} onChange={(e) => set("weightKg", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Height (cm)</label>
          <input className={inputCls} inputMode="decimal" value={raw.heightCm ?? ""} onChange={(e) => set("heightCm", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Age (years)</label>
          <input className={inputCls} inputMode="decimal" value={raw.ageYears ?? ""} onChange={(e) => set("ageYears", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Waist (cm)</label>
          <input className={inputCls} inputMode="decimal" value={raw.waistCm ?? ""} onChange={(e) => set("waistCm", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Neck (cm)</label>
          <input className={inputCls} inputMode="decimal" value={raw.neckCm ?? ""} onChange={(e) => set("neckCm", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Hip (cm, women Navy)</label>
          <input className={inputCls} inputMode="decimal" value={raw.hipCm ?? ""} onChange={(e) => set("hipCm", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Body fat % (optional)</label>
          <input className={inputCls} inputMode="decimal" value={raw.bodyFatPct ?? ""} onChange={(e) => set("bodyFatPct", e.target.value)} />
        </div>
      </div>
      <button
        type="button"
        onClick={run}
        className="rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gradient)] shadow-[var(--shadow-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        Calculate
      </button>
      {out ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5">
          {out.error ? <p className="text-sm text-amber-700">{out.error}</p> : null}
          <ul className="mt-2 space-y-2 text-sm">
            {out.lines.map((l) => (
              <li key={l.label} className="flex flex-wrap justify-between gap-2 border-b border-[var(--border)]/60 py-2 last:border-0">
                <span className="text-[var(--muted)]">{l.label}</span>
                <span className="font-mono font-medium text-[var(--text)]">{l.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
