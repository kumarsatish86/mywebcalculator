"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItDatabase,
  type ItDatabaseInput,
  type ItDatabaseResult,
  type ItDatabaseSlug,
} from "@/lib/calculators/itDatabase";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "rowSize" | "tableSize" | "index" | "growth" | "backup" | "replication" | "iops" | "queryCost";

type Config = {
  title: string; description: string; mode: Mode;
  nDefault: string; aDefault: string; bDefault: string; cDefault: string;
  rDefault: string; tDefault: string; pDefault: string; qDefault: string; mDefault: string; vDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItDatabaseSlug, Config> = {
  "it-row-size-calculator": { title: "Row size", description: `Average bytes per row. ${DISCLAIMER}`, mode: "rowSize", nDefault: "", aDefault: "128", bDefault: "", cDefault: "", rDefault: "", tDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "" },
  "it-table-size-estimator": { title: "Table size", description: `rows×row×(1+index). ${DISCLAIMER}`, mode: "tableSize", nDefault: "1000000", aDefault: "128", bDefault: "0.2", cDefault: "1", rDefault: "", tDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "" },
  "it-database-size-calculator": { title: "Database size", description: `Multi-table size estimate. ${DISCLAIMER}`, mode: "tableSize", nDefault: "500000", aDefault: "256", bDefault: "0.3", cDefault: "10", rDefault: "", tDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "" },
  "it-index-size-calculator": { title: "Index size", description: `Index ≈ rows × key width. ${DISCLAIMER}`, mode: "index", nDefault: "1000000", aDefault: "32", bDefault: "", cDefault: "", rDefault: "", tDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "" },
  "it-data-growth-calculator": { title: "Data growth", description: `Compound growth projection. ${DISCLAIMER}`, mode: "growth", nDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "10", tDefault: "12", pDefault: "100", qDefault: "", mDefault: "", vDefault: "" },
  "it-backup-time-calculator-db": { title: "Backup time", description: `Time ≈ size ÷ throughput. ${DISCLAIMER}`, mode: "backup", nDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", pDefault: "500", qDefault: "100", mDefault: "", vDefault: "" },
  "it-replication-lag-estimator": { title: "Replication lag", description: `Lag ≈ backlog ÷ apply rate. ${DISCLAIMER}`, mode: "replication", nDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", pDefault: "50", qDefault: "", mDefault: "1073741824", vDefault: "" },
  "it-storage-iops-calculator": { title: "Storage IOPS", description: `Throughput from IOPS × IO size. ${DISCLAIMER}`, mode: "iops", nDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "5000" },
  "it-query-cost-estimator": { title: "Query cost", description: `Toy planner cost model. ${DISCLAIMER}`, mode: "queryCost", nDefault: "", aDefault: "100", bDefault: "10", cDefault: "", rDefault: "", tDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: ItDatabaseResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.bytes !== undefined) rows.push({ label: "Bytes", value: num(res.bytes, 0) });
  if (res.gb !== undefined) rows.push({ label: "GB", value: num(res.gb, 3) });
  if (res.seconds !== undefined) rows.push({ label: "Seconds", value: num(res.seconds, 1) });
  if (res.lagSeconds !== undefined) rows.push({ label: "Lag (s)", value: num(res.lagSeconds, 2) });
  if (res.iops !== undefined) rows.push({ label: "IOPS", value: num(res.iops, 0) });
  if (res.costUnits !== undefined) rows.push({ label: "Cost units", value: num(res.costUnits, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.costUnits !== undefined ? num(res.costUnits, 0)
    : res.lagSeconds !== undefined ? num(res.lagSeconds, 2)
    : res.seconds !== undefined ? num(res.seconds, 1)
    : res.gb !== undefined ? num(res.gb, 3)
    : res.bytes !== undefined ? num(res.bytes, 0)
    : "—";
  const primaryLabel =
    res.costUnits !== undefined ? "Query cost" : res.lagSeconds !== undefined ? "Lag (s)"
    : res.seconds !== undefined ? "Time (s)" : res.gb !== undefined ? "Size (GB)" : "Bytes";
  return { primary, primaryLabel, rows };
}

export function ItDatabaseCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItDatabaseSlug;
  const config = CONFIG[key] ?? CONFIG["it-table-size-estimator"];
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [p, setP] = useState(useLoanInitialInput(IT_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(IT_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(IT_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(IT_URL.V, config.vDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "rowSize": put(IT_URL.A, a); break;
      case "tableSize": case "index": put(IT_URL.N, n); put(IT_URL.A, a); if (config.mode === "tableSize") { put(IT_URL.B, b); put(IT_URL.C, c); } break;
      case "growth": put(IT_URL.P, p); put(IT_URL.R, r); put(IT_URL.T, t); break;
      case "backup": put(IT_URL.P, p); put(IT_URL.Q, q); break;
      case "replication": put(IT_URL.M, m); put(IT_URL.P, p); break;
      case "iops": put(IT_URL.V, v); put(IT_URL.S, q); break;
      case "queryCost": put(IT_URL.A, a); put(IT_URL.B, b); break;
    }
    return out;
  }, [a, b, c, config.mode, m, n, p, q, r, t, v]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, p, q, r, t, v]);

  const result = useMemo(() => {
    const input: ItDatabaseInput = {};
    switch (config.mode) {
      case "rowSize": {
        const bpr = parsePositive(a, "Bytes/row");
        if (!bpr.ok) return { error: bpr.error };
        input.bytesPerRow = bpr.value;
        break;
      }
      case "tableSize": case "index": {
        const rows = parsePositive(n, "Rows");
        if (!rows.ok) return { error: rows.error };
        input.rows = rows.value;
        const bpr = parsePositive(a, "Bytes/row");
        if (!bpr.ok) return { error: bpr.error };
        input.bytesPerRow = bpr.value;
        if (config.mode === "tableSize") {
          if (b.trim() !== "") {
            const idx = parseNonNegative(b, "Index factor");
            if (!idx.ok) return { error: idx.error };
            input.indexFactor = idx.value;
          }
          if (c.trim() !== "") {
            const tables = parsePositive(c, "Tables");
            if (!tables.ok) return { error: tables.error };
            input.tables = tables.value;
          }
        }
        break;
      }
      case "growth": {
        const size = parsePositive(p, "Size (GB)");
        if (!size.ok) return { error: size.error };
        input.sizeGb = size.value;
        if (r.trim() !== "") {
          const g = parseNonNegative(r, "Growth %");
          if (!g.ok) return { error: g.error };
          input.growthPct = g.value;
        }
        if (t.trim() !== "") {
          const mo = parsePositive(t, "Months");
          if (!mo.ok) return { error: mo.error };
          input.months = mo.value;
        }
        break;
      }
      case "backup": {
        const size = parsePositive(p, "Size (GB)");
        const mbps = parsePositive(q, "MB/s");
        if (!size.ok) return { error: size.error };
        if (!mbps.ok) return { error: mbps.error };
        input.sizeGb = size.value;
        input.throughputMBps = mbps.value;
        break;
      }
      case "replication": {
        const lag = parseNonNegative(m, "Lag bytes");
        const mbps = parsePositive(p, "Replicate MB/s");
        if (!lag.ok) return { error: lag.error };
        if (!mbps.ok) return { error: mbps.error };
        input.lagBytes = lag.value;
        input.replicateMBps = mbps.value;
        break;
      }
      case "iops": {
        const iops = parsePositive(v, "IOPS");
        if (!iops.ok) return { error: iops.error };
        input.iops = iops.value;
        if (q.trim() !== "") {
          const kb = parsePositive(q, "IO size (KiB)");
          if (!kb.ok) return { error: kb.error };
          input.ioSizeKb = kb.value;
        }
        break;
      }
      case "queryCost": {
        const seq = parseNonNegative(a, "Seq pages");
        const rand = parseNonNegative(b, "Random pages");
        if (!seq.ok) return { error: seq.error };
        if (!rand.ok) return { error: rand.error };
        input.seqPages = seq.value;
        input.randomPages = rand.value;
        break;
      }
    }
    return formatResult(computeItDatabase(key in CONFIG ? key : "it-table-size-estimator", input), num);
  }, [a, b, c, config.mode, key, m, n, p, q, r, t, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "rowSize" ? (
            <div><FieldLabel htmlFor="itdb-a">Bytes per row</FieldLabel><FieldInput id="itdb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "tableSize" || config.mode === "index" ? (
            <>
              <div><FieldLabel htmlFor="itdb-n">Rows</FieldLabel><FieldInput id="itdb-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-a">Bytes per row</FieldLabel><FieldInput id="itdb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tableSize" ? (
            <>
              <div><FieldLabel htmlFor="itdb-b">Index factor (default 0.2)</FieldLabel><FieldInput id="itdb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-c">Tables</FieldLabel><FieldInput id="itdb-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "growth" ? (
            <>
              <div><FieldLabel htmlFor="itdb-p">Current size (GB)</FieldLabel><FieldInput id="itdb-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-r">Growth % per year</FieldLabel><FieldInput id="itdb-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-t">Months</FieldLabel><FieldInput id="itdb-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "backup" ? (
            <>
              <div><FieldLabel htmlFor="itdb-p">Size (GB)</FieldLabel><FieldInput id="itdb-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-q">Throughput (MB/s)</FieldLabel><FieldInput id="itdb-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "replication" ? (
            <>
              <div><FieldLabel htmlFor="itdb-m">Lag (bytes)</FieldLabel><FieldInput id="itdb-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-p">Replicate rate (MB/s)</FieldLabel><FieldInput id="itdb-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "iops" ? (
            <>
              <div><FieldLabel htmlFor="itdb-v">IOPS</FieldLabel><FieldInput id="itdb-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itdb-q">IO size (KiB, default 8)</FieldLabel><FieldInput id="itdb-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "queryCost" ? (
            <>
              <div><FieldLabel htmlFor="itdb-a">Sequential pages</FieldLabel><FieldInput id="itdb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itdb-b">Random pages</FieldLabel><FieldInput id="itdb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" /></div>
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
