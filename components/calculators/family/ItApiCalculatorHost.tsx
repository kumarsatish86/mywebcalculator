"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItApi,
  type ItApiInput,
  type ItApiResult,
  type ItApiSlug,
} from "@/lib/calculators/itApi";

type Mode = "url" | "json" | "xml" | "csv2json" | "json2csv" | "html" | "unicode" | "ascii" | "mime";

type Config = { title: string; description: string; mode: Mode; aDefault: string; bDefault: string; cDefault: string };

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItApiSlug, Config> = {
  "it-url-encoder-decoder": { title: "URL encode/decode", description: `encodeURIComponent / decode. ${DISCLAIMER}`, mode: "url", aDefault: "hello world", bDefault: "encode", cDefault: "" },
  "it-json-formatter-validator": { title: "JSON formatter", description: `Validate and pretty-print JSON. ${DISCLAIMER}`, mode: "json", aDefault: '{"name":"demo"}', bDefault: "", cDefault: "" },
  "it-xml-formatter": { title: "XML formatter", description: `Best-effort XML indent. ${DISCLAIMER}`, mode: "xml", aDefault: "<root><item>1</item></root>", bDefault: "", cDefault: "" },
  "it-csv-to-json-converter": { title: "CSV to JSON", description: `Simple CSV → JSON array. ${DISCLAIMER}`, mode: "csv2json", aDefault: "a,b\n1,2", bDefault: "", cDefault: "" },
  "it-json-to-csv-converter": { title: "JSON to CSV", description: `JSON array → CSV. ${DISCLAIMER}`, mode: "json2csv", aDefault: '[{"a":1,"b":2}]', bDefault: "", cDefault: "" },
  "it-html-encoder-decoder": { title: "HTML encode/decode", description: `Common HTML entities. ${DISCLAIMER}`, mode: "html", aDefault: "<div>&</div>", bDefault: "encode", cDefault: "" },
  "it-unicode-converter": { title: "Unicode code points", description: `Character → U+XXXX. ${DISCLAIMER}`, mode: "unicode", aDefault: "A🙂", bDefault: "", cDefault: "" },
  "it-ascii-converter": { title: "ASCII converter", description: `Text ↔ ASCII codes. ${DISCLAIMER}`, mode: "ascii", aDefault: "Hi", bDefault: "encode", cDefault: "" },
  "it-mime-type-finder": { title: "MIME type finder", description: `Extension → MIME mapping. ${DISCLAIMER}`, mode: "mime", aDefault: "", bDefault: "", cDefault: "json" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function formatResult(res: ItApiResult) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.output) rows.push({ label: "Output", value: res.output });
  if (res.valid !== undefined) rows.push({ label: "Valid", value: res.valid ? "yes" : "no" });
  if (res.mime) rows.push({ label: "MIME", value: res.mime });
  rows.push({ label: "Note", value: res.note });
  const primary = res.mime ?? res.output?.slice(0, 120) ?? (res.valid ? "Valid JSON" : "—");
  const primaryLabel = res.mime ? "MIME type" : res.valid !== undefined ? "JSON" : "Output";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItApiCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItApiSlug;
  const config = CONFIG[key] ?? CONFIG["it-json-formatter-validator"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    if (config.mode === "mime") put(IT_URL.C, c);
    else {
      put(IT_URL.A, a);
      if (config.mode === "url" || config.mode === "html" || config.mode === "ascii") put(IT_URL.B, b);
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    const input: ItApiInput = {};
    if (config.mode === "mime") {
      input.extension = c.trim() || a.trim();
    } else {
      input.text = a;
      if (config.mode === "url" || config.mode === "html" || config.mode === "ascii") {
        input.mode = b.trim() || "encode";
      }
    }
    return formatResult(computeItApi(key in CONFIG ? key : "it-json-formatter-validator", input));
  }, [a, b, c, config.mode, key]);

  const textLabel =
    config.mode === "csv2json" || config.mode === "json2csv" ? "Input data"
    : config.mode === "xml" ? "XML"
    : config.mode === "json" ? "JSON"
    : "Text";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "mime" ? (
            <div><FieldLabel htmlFor="itapi-c">File extension</FieldLabel><FieldInput id="itapi-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
          ) : (
            <>
              <div><FieldLabel htmlFor="itapi-a">{textLabel}</FieldLabel><FieldInput id="itapi-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              {config.mode === "url" || config.mode === "html" || config.mode === "ascii" ? (
                <div><FieldLabel htmlFor="itapi-b">Mode (encode or decode)</FieldLabel><FieldInput id="itapi-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
              ) : null}
            </>
          )}
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
