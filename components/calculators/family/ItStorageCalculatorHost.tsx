"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItStorage,
  type ItStorageInput,
  type ItStorageResult,
  type ItStorageSlug,
} from "@/lib/calculators/itStorage";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "convert" | "transfer" | "time" | "cost" | "backup" | "compression";

type Config = { title: string; description: string; mode: Mode; aDefault: string; bDefault: string; cDefault: string; pDefault: string; rDefault: string };

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItStorageSlug, Config> = {
  "it-data-storage-converter-kb-mb-gb-tb-pb": { title: "Storage converter", description: `KB/MB/GB/TB/PB (1024). ${DISCLAIMER}`, mode: "convert", aDefault: "1", bDefault: "gb", cDefault: "", pDefault: "", rDefault: "" },
  "it-file-size-calculator": { title: "File size", description: `File size unit conversion. ${DISCLAIMER}`, mode: "convert", aDefault: "500", bDefault: "mb", cDefault: "", pDefault: "", rDefault: "" },
  "it-data-transfer-calculator": { title: "Data transfer time", description: `Time = size ÷ bandwidth. ${DISCLAIMER}`, mode: "transfer", aDefault: "1", bDefault: "gb", cDefault: "100000000", pDefault: "", rDefault: "" },
  "it-bandwidth-calculator": { title: "Bandwidth calculator", description: `Transfer time from link speed. ${DISCLAIMER}`, mode: "transfer", aDefault: "10", bDefault: "gb", cDefault: "1000000000", pDefault: "", rDefault: "" },
  "it-download-time-calculator": { title: "Download time", description: `Download duration estimate. ${DISCLAIMER}`, mode: "time", aDefault: "500", bDefault: "mb", cDefault: "50000000", pDefault: "", rDefault: "" },
  "it-upload-time-calculator": { title: "Upload time", description: `Upload duration estimate. ${DISCLAIMER}`, mode: "time", aDefault: "100", bDefault: "mb", cDefault: "10000000", pDefault: "", rDefault: "" },
  "it-storage-cost-calculator": { title: "Storage cost", description: `Cost ≈ GB × $/GB. ${DISCLAIMER}`, mode: "cost", aDefault: "100", bDefault: "gb", cDefault: "", pDefault: "0.023", rDefault: "" },
  "it-backup-size-estimator": { title: "Backup size", description: `Full + incremental backup estimate. ${DISCLAIMER}`, mode: "backup", aDefault: "500", bDefault: "gb", cDefault: "", pDefault: "", rDefault: "10" },
  "it-compression-ratio-calculator": { title: "Compression ratio", description: `Compressed size from ratio. ${DISCLAIMER}`, mode: "compression", aDefault: "100", bDefault: "mb", cDefault: "2", pDefault: "", rDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: ItStorageResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.gb !== undefined) rows.push({ label: "GB", value: num(res.gb, 4) });
  if (res.mb !== undefined) rows.push({ label: "MB", value: num(res.mb, 2) });
  if (res.tb !== undefined) rows.push({ label: "TB", value: num(res.tb, 4) });
  if (res.seconds !== undefined) rows.push({ label: "Seconds", value: num(res.seconds, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.compressedBytes !== undefined) rows.push({ label: "Compressed (bytes)", value: num(res.compressedBytes, 0) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.seconds !== undefined ? num(res.seconds, 2)
    : res.cost !== undefined ? num(res.cost, 2)
    : res.gb !== undefined ? num(res.gb, 4)
    : res.mb !== undefined ? num(res.mb, 2)
    : "—";
  const primaryLabel =
    res.seconds !== undefined ? "Time (s)"
    : res.cost !== undefined ? "Cost"
    : "Size (GB)";
  return { primary, primaryLabel, rows };
}

export function ItStorageCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItStorageSlug;
  const config = CONFIG[key] ?? CONFIG["it-data-storage-converter-kb-mb-gb-tb-pb"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [p, setP] = useState(useLoanInitialInput(IT_URL.P, config.pDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    put(IT_URL.A, a); put(IT_URL.B, b);
    if (config.mode === "transfer" || config.mode === "time" || config.mode === "compression") put(IT_URL.C, c);
    if (config.mode === "cost") put(IT_URL.P, p);
    if (config.mode === "backup") put(IT_URL.R, r);
    return out;
  }, [a, b, c, config.mode, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, p, r]);

  const result = useMemo(() => {
    const val = parseNonNegative(a, "Value");
    if (!val.ok) return { error: val.error };
    const input: ItStorageInput = { value: val.value, unit: b.trim() || "mb" };
    if (config.mode === "transfer" || config.mode === "time") {
      const bps = parsePositive(c, "Bits/s");
      if (!bps.ok) return { error: bps.error };
      input.bitsPerSecond = bps.value;
    }
    if (config.mode === "cost") {
      const rate = parseNonNegative(p, "$/GB");
      if (!rate.ok) return { error: rate.error };
      input.costPerGb = rate.value;
    }
    if (config.mode === "backup") {
      if (r.trim() !== "") {
        const ch = parseNonNegative(r, "Change %");
        if (!ch.ok) return { error: ch.error };
        input.changeRatePct = ch.value;
      }
    }
    if (config.mode === "compression") {
      const ratio = parsePositive(c, "Compression ratio");
      if (!ratio.ok) return { error: ratio.error };
      input.compressionRatio = ratio.value;
    }
    return formatResult(computeItStorage(key in CONFIG ? key : "it-data-storage-converter-kb-mb-gb-tb-pb", input), num);
  }, [a, b, c, config.mode, key, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div><FieldLabel htmlFor="its-a">Value</FieldLabel><FieldInput id="its-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          <div><FieldLabel htmlFor="its-b">Unit (b, kb, mb, gb, tb, pb)</FieldLabel><FieldInput id="its-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
          {config.mode === "transfer" || config.mode === "time" ? (
            <div><FieldLabel htmlFor="its-c">Link speed (bits/s)</FieldLabel><FieldInput id="its-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "cost" ? (
            <div><FieldLabel htmlFor="its-p">Cost per GB</FieldLabel><FieldInput id="its-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "backup" ? (
            <div><FieldLabel htmlFor="its-r">Change rate (%)</FieldLabel><FieldInput id="its-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "compression" ? (
            <div><FieldLabel htmlFor="its-c">Compression ratio</FieldLabel><FieldInput id="its-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
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
