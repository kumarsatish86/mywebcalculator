"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItTime,
  type ItTimeInput,
  type ItTimeResult,
  type ItTimeSlug,
} from "@/lib/calculators/itTime";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "unix" | "cron" | "tz" | "workHours" | "velocity" | "storyPoints" | "deadline";

type Config = {
  title: string; description: string; mode: Mode;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string; tDefault: string;
  nDefault: string; mDefault: string; pDefault: string; qDefault: string; vDefault: string; sDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItTimeSlug, Config> = {
  "it-unix-timestamp-converter": { title: "Unix timestamp", description: `Unix ↔ ISO UTC. ${DISCLAIMER}`, mode: "unix", aDefault: "0", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", mDefault: "", pDefault: "", qDefault: "", vDefault: "", sDefault: "" },
  "it-cron-expression-generator": { title: "Cron expression", description: `5-field cron builder. ${DISCLAIMER}`, mode: "cron", aDefault: "0", bDefault: "9", cDefault: "*", rDefault: "*", tDefault: "1-5", nDefault: "", mDefault: "", pDefault: "", qDefault: "", vDefault: "", sDefault: "" },
  "it-time-zone-converter": { title: "Time zone converter", description: `Fixed UTC offset shift. ${DISCLAIMER}`, mode: "tz", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "0", mDefault: "5.5", pDefault: "", qDefault: "", vDefault: "", sDefault: "2024-01-01T12:00:00Z" },
  "it-working-hours-calculator": { title: "Working hours", description: `days × hours/day. ${DISCLAIMER}`, mode: "workHours", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", mDefault: "", pDefault: "8", qDefault: "10", vDefault: "", sDefault: "" },
  "it-sprint-velocity-calculator": { title: "Sprint velocity", description: `points ÷ sprints. ${DISCLAIMER}`, mode: "velocity", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", mDefault: "", pDefault: "", qDefault: "40", vDefault: "3", sDefault: "" },
  "it-story-points-calculator": { title: "Story points", description: `backlog ÷ velocity. ${DISCLAIMER}`, mode: "storyPoints", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", mDefault: "", pDefault: "", qDefault: "", vDefault: "13", sDefault: "5" },
  "it-deadline-calculator": { title: "Deadline", description: `start + N calendar days. ${DISCLAIMER}`, mode: "deadline", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", mDefault: "", pDefault: "", qDefault: "", vDefault: "14", sDefault: "2024-06-01" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

function formatResult(res: ItTimeResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.unix !== undefined) rows.push({ label: "Unix", value: String(res.unix) });
  if (res.iso) rows.push({ label: "ISO", value: res.iso });
  if (res.convertedIso) rows.push({ label: "Converted ISO", value: res.convertedIso });
  if (res.cron) rows.push({ label: "Cron", value: res.cron });
  if (res.hours !== undefined) rows.push({ label: "Hours", value: num(res.hours, 1) });
  if (res.velocity !== undefined) rows.push({ label: "Velocity", value: num(res.velocity, 2) });
  if (res.sprintsNeeded !== undefined) rows.push({ label: "Sprints needed", value: num(res.sprintsNeeded, 2) });
  if (res.deadlineIso) rows.push({ label: "Deadline", value: res.deadlineIso });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cron ?? res.iso ?? res.convertedIso ?? res.deadlineIso
    ?? (res.unix !== undefined ? String(res.unix)
    : res.hours !== undefined ? num(res.hours, 1)
    : res.velocity !== undefined ? num(res.velocity, 2)
    : res.sprintsNeeded !== undefined ? num(res.sprintsNeeded, 2)
    : "—");
  const primaryLabel =
    res.cron ? "Cron" : res.deadlineIso ? "Deadline" : res.convertedIso ? "Converted"
    : res.iso ? "ISO" : res.unix !== undefined ? "Unix" : res.velocity !== undefined ? "Velocity" : "Result";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItTimeCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItTimeSlug;
  const config = CONFIG[key] ?? CONFIG["it-unix-timestamp-converter"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [m, setM] = useState(useLoanInitialInput(IT_URL.M, config.mDefault));
  const [p, setP] = useState(useLoanInitialInput(IT_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(IT_URL.Q, config.qDefault));
  const [v, setV] = useState(useLoanInitialInput(IT_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(IT_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "unix": put(IT_URL.A, a); put(IT_URL.S, s); break;
      case "cron": put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.C, c); put(IT_URL.R, r); put(IT_URL.T, t); break;
      case "tz": put(IT_URL.S, s); put(IT_URL.N, n); put(IT_URL.M, m); break;
      case "workHours": put(IT_URL.P, p); put(IT_URL.Q, q); break;
      case "velocity": put(IT_URL.Q, q); put(IT_URL.V, v); break;
      case "storyPoints": put(IT_URL.V, v); put(IT_URL.S, s); break;
      case "deadline": put(IT_URL.S, s); put(IT_URL.V, v); break;
    }
    return out;
  }, [a, b, c, config.mode, m, n, p, q, r, s, t, v]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, p, q, r, s, t, v]);

  const result = useMemo(() => {
    const input: ItTimeInput = {};
    switch (config.mode) {
      case "unix":
        if (s.trim()) input.iso = s.trim();
        else {
          const ts = parseFiniteNumber(a, "Unix timestamp");
          if (!ts.ok) return { error: ts.error };
          input.timestamp = ts.value;
        }
        break;
      case "cron":
        input.minute = a.trim() || "0";
        input.hour = b.trim() || "*";
        input.dom = c.trim() || "*";
        input.month = r.trim() || "*";
        input.dow = t.trim() || "*";
        break;
      case "tz":
        input.iso = s.trim() || undefined;
        if (n.trim() !== "") {
          const from = parseFiniteNumber(n, "From offset");
          if (!from.ok) return { error: from.error };
          input.utcOffsetFrom = from.value;
        }
        if (m.trim() !== "") {
          const to = parseFiniteNumber(m, "To offset");
          if (!to.ok) return { error: to.error };
          input.utcOffsetTo = to.value;
        }
        break;
      case "workHours": {
        const hpd = parsePositive(p, "Hours/day");
        const days = parsePositive(q, "Days");
        if (!hpd.ok) return { error: hpd.error };
        if (!days.ok) return { error: days.error };
        input.hoursPerDay = hpd.value;
        input.days = days.value;
        break;
      }
      case "velocity": {
        const done = parseNonNegative(q, "Points done");
        const sprints = parsePositive(v, "Sprints");
        if (!done.ok) return { error: done.error };
        if (!sprints.ok) return { error: sprints.error };
        input.pointsDone = done.value;
        input.sprints = sprints.value;
        break;
      }
      case "storyPoints": {
        const points = parsePositive(v, "Backlog points");
        const vel = parsePositive(s, "Velocity");
        if (!points.ok) return { error: points.error };
        if (!vel.ok) return { error: vel.error };
        input.points = points.value;
        input.velocity = vel.value;
        break;
      }
      case "deadline":
        input.startIso = s.trim() || undefined;
        if (v.trim() !== "") {
          const days = parseNonNegative(v, "Work days");
          if (!days.ok) return { error: days.error };
          input.workDays = days.value;
        }
        break;
    }
    return formatResult(computeItTime(key in CONFIG ? key : "it-unix-timestamp-converter", input), num);
  }, [a, b, c, config.mode, key, m, n, p, q, r, s, t, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "unix" ? (
            <>
              <div><FieldLabel htmlFor="itt-a">Unix timestamp</FieldLabel><FieldInput id="itt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itt-s">Or ISO date</FieldLabel><FieldInput id="itt-s" value={s} onChange={(ev) => setS(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "cron" ? (
            <>
              <div><FieldLabel htmlFor="itt-a">Minute</FieldLabel><FieldInput id="itt-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itt-b">Hour</FieldLabel><FieldInput id="itt-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itt-c">Day of month</FieldLabel><FieldInput id="itt-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itt-r">Month</FieldLabel><FieldInput id="itt-r" value={r} onChange={(ev) => setR(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itt-t">Day of week</FieldLabel><FieldInput id="itt-t" value={t} onChange={(ev) => setT(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "tz" ? (
            <>
              <div><FieldLabel htmlFor="itt-s">ISO datetime</FieldLabel><FieldInput id="itt-s" value={s} onChange={(ev) => setS(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itt-n">From UTC offset (hours)</FieldLabel><FieldInput id="itt-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itt-m">To UTC offset (hours)</FieldLabel><FieldInput id="itt-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "workHours" ? (
            <>
              <div><FieldLabel htmlFor="itt-p">Hours per day</FieldLabel><FieldInput id="itt-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itt-q">Days</FieldLabel><FieldInput id="itt-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "velocity" ? (
            <>
              <div><FieldLabel htmlFor="itt-q">Points completed</FieldLabel><FieldInput id="itt-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itt-v">Sprints</FieldLabel><FieldInput id="itt-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "storyPoints" ? (
            <>
              <div><FieldLabel htmlFor="itt-v">Backlog points</FieldLabel><FieldInput id="itt-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itt-s">Velocity (pts/sprint)</FieldLabel><FieldInput id="itt-s" value={s} onChange={(ev) => setS(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "deadline" ? (
            <>
              <div><FieldLabel htmlFor="itt-s">Start date (ISO)</FieldLabel><FieldInput id="itt-s" value={s} onChange={(ev) => setS(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itt-v">Work days</FieldLabel><FieldInput id="itt-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div><p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p><p className="mt-1 text-2xl font-semibold tracking-tight break-all">{result.primary}</p></div>
              <div className="space-y-2 text-sm">{result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
