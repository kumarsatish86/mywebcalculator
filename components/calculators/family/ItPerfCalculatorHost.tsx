"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItPerf,
  type ItPerfInput,
  type ItPerfResult,
  type ItPerfSlug,
} from "@/lib/calculators/itPerf";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "loadTime" | "rps" | "concurrency" | "response" | "cpu" | "memory" | "diskIo" | "cache";

type Config = {
  title: string; description: string; mode: Mode;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string;
  tDefault: string; nDefault: string; vDefault: string; mDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItPerfSlug, Config> = {
  "it-load-time-calculator": { title: "Load time", description: `payload ÷ bandwidth. ${DISCLAIMER}`, mode: "loadTime", aDefault: "1000000", bDefault: "125000", cDefault: "", rDefault: "", tDefault: "", nDefault: "", vDefault: "", mDefault: "" },
  "it-requests-per-second-calculator": { title: "Requests per second", description: `RPS = requests ÷ seconds. ${DISCLAIMER}`, mode: "rps", aDefault: "10000", bDefault: "60", cDefault: "", rDefault: "", tDefault: "", nDefault: "", vDefault: "", mDefault: "" },
  "it-throughput-calculator": { title: "Throughput", description: `Requests per second. ${DISCLAIMER}`, mode: "rps", aDefault: "5000", bDefault: "10", cDefault: "", rDefault: "", tDefault: "", nDefault: "", vDefault: "", mDefault: "" },
  "it-concurrent-users-calculator": { title: "Concurrent users", description: `Little's law-ish concurrency. ${DISCLAIMER}`, mode: "concurrency", aDefault: "", bDefault: "", cDefault: "100", rDefault: "1", tDefault: "", nDefault: "", vDefault: "", mDefault: "200" },
  "it-response-time-calculator": { title: "Response time", description: `From concurrency/RPS or direct ms. ${DISCLAIMER}`, mode: "response", aDefault: "1000", bDefault: "10", cDefault: "50", rDefault: "", tDefault: "", nDefault: "", vDefault: "", mDefault: "250" },
  "it-cpu-usage-calculator": { title: "CPU usage", description: `CPU% = busy/(busy+idle). ${DISCLAIMER}`, mode: "cpu", aDefault: "75", bDefault: "25", cDefault: "", rDefault: "", tDefault: "", nDefault: "", vDefault: "", mDefault: "" },
  "it-memory-usage-calculator": { title: "Memory usage", description: `Mem% = used/total. ${DISCLAIMER}`, mode: "memory", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "4096", nDefault: "8192", vDefault: "", mDefault: "" },
  "it-disk-io-calculator": { title: "Disk I/O", description: `MB/s from IOPS × IO size. ${DISCLAIMER}`, mode: "diskIo", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", vDefault: "5000", mDefault: "8" },
  "it-cache-hit-ratio-calculator": { title: "Cache hit ratio", description: `hits/(hits+misses). ${DISCLAIMER}`, mode: "cache", aDefault: "950", bDefault: "50", cDefault: "", rDefault: "", tDefault: "", nDefault: "", vDefault: "", mDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: ItPerfResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.rps !== undefined) rows.push({ label: "RPS", value: num(res.rps, 2) });
  if (res.seconds !== undefined) rows.push({ label: "Seconds", value: num(res.seconds, 4) });
  if (res.concurrency !== undefined) rows.push({ label: "Concurrency", value: num(res.concurrency, 2) });
  if (res.responseMs !== undefined) rows.push({ label: "Response (ms)", value: num(res.responseMs, 2) });
  if (res.cpuPct !== undefined) rows.push({ label: "CPU %", value: num(res.cpuPct, 1) });
  if (res.memPct !== undefined) rows.push({ label: "Memory %", value: num(res.memPct, 1) });
  if (res.throughput !== undefined) rows.push({ label: "Throughput (MB/s)", value: num(res.throughput, 2) });
  if (res.hitRatio !== undefined) rows.push({ label: "Hit ratio", value: num(res.hitRatio * 100, 2) + "%" });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.rps !== undefined ? num(res.rps, 2)
    : res.seconds !== undefined ? num(res.seconds, 4)
    : res.concurrency !== undefined ? num(res.concurrency, 2)
    : res.responseMs !== undefined ? num(res.responseMs, 2)
    : res.cpuPct !== undefined ? num(res.cpuPct, 1)
    : res.memPct !== undefined ? num(res.memPct, 1)
    : res.throughput !== undefined ? num(res.throughput, 2)
    : res.hitRatio !== undefined ? num(res.hitRatio * 100, 2) + "%"
    : "—";
  const primaryLabel =
    res.rps !== undefined ? "RPS" : res.seconds !== undefined ? "Load time (s)"
    : res.concurrency !== undefined ? "Concurrency" : res.responseMs !== undefined ? "Response (ms)"
    : res.cpuPct !== undefined ? "CPU %" : res.memPct !== undefined ? "Memory %"
    : res.throughput !== undefined ? "Throughput (MB/s)" : "Hit ratio";
  return { primary, primaryLabel, rows };
}

export function ItPerfCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItPerfSlug;
  const config = CONFIG[key] ?? CONFIG["it-load-time-calculator"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [v, setV] = useState(useLoanInitialInput(IT_URL.V, config.vDefault));
  const [m, setM] = useState(useLoanInitialInput(IT_URL.M, config.mDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "loadTime": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "rps": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "concurrency": put(IT_URL.C, c); put(IT_URL.R, r); put(IT_URL.M, m); break;
      case "response": put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.C, c); put(IT_URL.M, m); break;
      case "cpu": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "memory": put(IT_URL.T, t); put(IT_URL.N, n); break;
      case "diskIo": put(IT_URL.V, v); put(IT_URL.M, m); break;
      case "cache": put(IT_URL.A, a); put(IT_URL.B, b); break;
    }
    return out;
  }, [a, b, c, config.mode, m, n, r, t, v]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, r, t, v]);

  const result = useMemo(() => {
    const input: ItPerfInput = {};
    switch (config.mode) {
      case "loadTime": {
        const bytes = parsePositive(a, "Bytes");
        const bps = parsePositive(b, "Bandwidth (B/s)");
        if (!bytes.ok) return { error: bytes.error };
        if (!bps.ok) return { error: bps.error };
        input.bytes = bytes.value;
        input.bandwidthBps = bps.value;
        break;
      }
      case "rps": {
        const req = parseNonNegative(a, "Requests");
        const sec = parsePositive(b, "Seconds");
        if (!req.ok) return { error: req.error };
        if (!sec.ok) return { error: sec.error };
        input.requests = req.value;
        input.seconds = sec.value;
        break;
      }
      case "concurrency": {
        const users = parsePositive(c, "Users");
        if (!users.ok) return { error: users.error };
        input.users = users.value;
        if (r.trim() !== "") {
          const think = parseNonNegative(r, "Think time (s)");
          if (!think.ok) return { error: think.error };
          input.thinkTimeSec = think.value;
        }
        if (m.trim() !== "") {
          const resp = parsePositive(m, "Response (ms)");
          if (!resp.ok) return { error: resp.error };
          input.responseMs = resp.value;
        }
        break;
      }
      case "response": {
        if (a.trim() !== "" && b.trim() !== "" && c.trim() !== "") {
          const req = parseNonNegative(a, "Requests");
          const sec = parsePositive(b, "Seconds");
          const users = parsePositive(c, "Concurrency");
          if (!req.ok) return { error: req.error };
          if (!sec.ok) return { error: sec.error };
          if (!users.ok) return { error: users.error };
          input.requests = req.value;
          input.seconds = sec.value;
          input.users = users.value;
        } else if (m.trim() !== "") {
          const ms = parsePositive(m, "Response (ms)");
          if (!ms.ok) return { error: ms.error };
          input.responseMs = ms.value;
        } else {
          return { error: "Provide responseMs or requests+seconds+users." };
        }
        break;
      }
      case "cpu": {
        const busy = parseNonNegative(a, "Busy");
        const idle = parseNonNegative(b, "Idle");
        if (!busy.ok) return { error: busy.error };
        if (!idle.ok) return { error: idle.error };
        input.cpuBusy = busy.value;
        input.cpuIdle = idle.value;
        break;
      }
      case "memory": {
        const used = parseNonNegative(t, "Used (MB)");
        const total = parsePositive(n, "Total (MB)");
        if (!used.ok) return { error: used.error };
        if (!total.ok) return { error: total.error };
        input.usedMb = used.value;
        input.totalMb = total.value;
        break;
      }
      case "diskIo": {
        const iops = parsePositive(v, "IOPS");
        if (!iops.ok) return { error: iops.error };
        input.iops = iops.value;
        if (m.trim() !== "") {
          const kb = parsePositive(m, "IO (KiB)");
          if (!kb.ok) return { error: kb.error };
          input.ioKb = kb.value;
        }
        break;
      }
      case "cache": {
        const hits = parseNonNegative(a, "Hits");
        const misses = parseNonNegative(b, "Misses");
        if (!hits.ok) return { error: hits.error };
        if (!misses.ok) return { error: misses.error };
        input.hits = hits.value;
        input.misses = misses.value;
        break;
      }
    }
    return formatResult(computeItPerf(key in CONFIG ? key : "it-load-time-calculator", input), num);
  }, [a, b, c, config.mode, key, m, n, r, t, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "loadTime" ? (
            <>
              <div><FieldLabel htmlFor="itpf-a">Payload (bytes)</FieldLabel><FieldInput id="itpf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-b">Bandwidth (bytes/s)</FieldLabel><FieldInput id="itpf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "rps" ? (
            <>
              <div><FieldLabel htmlFor="itpf-a">Requests</FieldLabel><FieldInput id="itpf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-b">Window (seconds)</FieldLabel><FieldInput id="itpf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "concurrency" ? (
            <>
              <div><FieldLabel htmlFor="itpf-c">Users</FieldLabel><FieldInput id="itpf-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itpf-r">Think time (s)</FieldLabel><FieldInput id="itpf-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-m">Response (ms)</FieldLabel><FieldInput id="itpf-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "response" ? (
            <>
              <div><FieldLabel htmlFor="itpf-a">Requests</FieldLabel><FieldInput id="itpf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-b">Window (seconds)</FieldLabel><FieldInput id="itpf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-c">Concurrency</FieldLabel><FieldInput id="itpf-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-m">Or response (ms)</FieldLabel><FieldInput id="itpf-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cpu" ? (
            <>
              <div><FieldLabel htmlFor="itpf-a">Busy ticks</FieldLabel><FieldInput id="itpf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-b">Idle ticks</FieldLabel><FieldInput id="itpf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "memory" ? (
            <>
              <div><FieldLabel htmlFor="itpf-t">Used (MB)</FieldLabel><FieldInput id="itpf-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-n">Total (MB)</FieldLabel><FieldInput id="itpf-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "diskIo" ? (
            <>
              <div><FieldLabel htmlFor="itpf-v">IOPS</FieldLabel><FieldInput id="itpf-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-m">IO size (KiB)</FieldLabel><FieldInput id="itpf-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cache" ? (
            <>
              <div><FieldLabel htmlFor="itpf-a">Hits</FieldLabel><FieldInput id="itpf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itpf-b">Misses</FieldLabel><FieldInput id="itpf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div><p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p></div>
              <div className="space-y-2 text-sm">{result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
