"use client";

import { useState } from "react";
import { computeEduMath } from "@/lib/calculators/edu-math/eduMathEngine";

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

export function EduMathCalculatorHost({ slug }: Props) {
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [out, setOut] = useState<ReturnType<typeof computeEduMath> | null>(null);
  const set = (k: string, v: string) => setRaw((p) => ({ ...p, [k]: v }));

  const run = () => {
    const f: Record<string, unknown> = {
      op: raw.op,
      shape: raw.shape,
      mode: raw.mode,
      roman: raw.roman,
      digits: raw.digits,
      fromBase: raw.fromBase,
      list: raw.list,
      nums: raw.nums,
    };
    const numKeys = [
      "a",
      "b",
      "c",
      "x",
      "y",
      "z",
      "n",
      "m",
      "count",
      "k",
      "an",
      "ad",
      "dec",
      "maxDenom",
      "x2",
      "y2",
      "c0",
      "c1",
      "c2",
      "c3",
      "a11",
      "a12",
      "a21",
      "a22",
      "b11",
      "b12",
      "b21",
      "b22",
      "ax",
      "ay",
      "az",
      "bx",
      "by",
      "bz",
      "meters",
      "favorable",
      "total",
      "mu",
      "sigma",
    ] as const;
    for (const k of numKeys) {
      const v = parseNum(raw[k] ?? "");
      if (v !== undefined) f[k] = v;
    }
    setOut(computeEduMath(slug, f));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Use the fields that match your assignment wording. Many tools accept comma-separated lists in{" "}
        <span className="font-medium text-[var(--text)]">list</span>.
      </p>
      <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>a</label>
          <input className={inputCls} inputMode="decimal" value={raw.a ?? ""} onChange={(e) => set("a", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>b</label>
          <input className={inputCls} inputMode="decimal" value={raw.b ?? ""} onChange={(e) => set("b", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>c</label>
          <input className={inputCls} inputMode="decimal" value={raw.c ?? ""} onChange={(e) => set("c", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>x</label>
          <input className={inputCls} inputMode="decimal" value={raw.x ?? ""} onChange={(e) => set("x", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>n, m, k, count…</label>
          <input className={inputCls} placeholder="n" value={raw.n ?? ""} onChange={(e) => set("n", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>m (multiples)</label>
          <input className={inputCls} value={raw.m ?? ""} onChange={(e) => set("m", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>count</label>
          <input className={inputCls} value={raw.count ?? ""} onChange={(e) => set("count", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>k</label>
          <input className={inputCls} value={raw.k ?? ""} onChange={(e) => set("k", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>List / nums (comma-separated)</label>
          <input className={inputCls} value={raw.list ?? ""} onChange={(e) => set("list", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Numerator / denom (fractions)</label>
          <input className={inputCls} placeholder="an" value={raw.an ?? ""} onChange={(e) => set("an", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>ad</label>
          <input className={inputCls} value={raw.ad ?? ""} onChange={(e) => set("ad", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Polynomial c0–c3, x</label>
          <input className={inputCls} placeholder="c0" value={raw.c0 ?? ""} onChange={(e) => set("c0", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>c1</label>
          <input className={inputCls} value={raw.c1 ?? ""} onChange={(e) => set("c1", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>c2</label>
          <input className={inputCls} value={raw.c2 ?? ""} onChange={(e) => set("c2", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>c3</label>
          <input className={inputCls} value={raw.c3 ?? ""} onChange={(e) => set("c3", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>2×2 matrix A</label>
          <input className={inputCls} placeholder="a11" value={raw.a11 ?? ""} onChange={(e) => set("a11", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className={inputCls} placeholder="a12" value={raw.a12 ?? ""} onChange={(e) => set("a12", e.target.value)} />
          <input className={inputCls} placeholder="a21" value={raw.a21 ?? ""} onChange={(e) => set("a21", e.target.value)} />
          <input className={inputCls} placeholder="a22" value={raw.a22 ?? ""} onChange={(e) => set("a22", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Matrix B (b11…b22)</label>
          <input className={inputCls} placeholder="b11" value={raw.b11 ?? ""} onChange={(e) => set("b11", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className={inputCls} placeholder="b12" value={raw.b12 ?? ""} onChange={(e) => set("b12", e.target.value)} />
          <input className={inputCls} placeholder="b21" value={raw.b21 ?? ""} onChange={(e) => set("b21", e.target.value)} />
          <input className={inputCls} placeholder="b22" value={raw.b22 ?? ""} onChange={(e) => set("b22", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Base digits + fromBase</label>
          <input className={inputCls} placeholder="digits" value={raw.digits ?? ""} onChange={(e) => set("digits", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>fromBase</label>
          <input className={inputCls} value={raw.fromBase ?? ""} onChange={(e) => set("fromBase", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Roman mode</label>
          <select className={inputCls} value={raw.mode ?? "fromRoman"} onChange={(e) => set("mode", e.target.value)}>
            <option value="fromRoman">fromRoman</option>
            <option value="toRoman">toRoman</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>roman string / n for roman</label>
          <input className={inputCls} value={raw.roman ?? ""} onChange={(e) => set("roman", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>shape (area/perimeter)</label>
          <input className={inputCls} placeholder="rectangle | circle" value={raw.shape ?? ""} onChange={(e) => set("shape", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>op (+ - * /)</label>
          <input className={inputCls} value={raw.op ?? ""} onChange={(e) => set("op", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>x2, y2 (distance / midpoint)</label>
          <input className={inputCls} placeholder="x2" value={raw.x2 ?? ""} onChange={(e) => set("x2", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>y2</label>
          <input className={inputCls} value={raw.y2 ?? ""} onChange={(e) => set("y2", e.target.value)} />
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
