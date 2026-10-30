"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItUtils,
  type ItUtilsInput,
  type ItUtilsResult,
  type ItUtilsSlug,
} from "@/lib/calculators/itUtils";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "uuid" | "randomNum" | "randomStr" | "slug" | "case" | "diff" | "lines" | "chars" | "regex";

type Config = {
  title: string; description: string; mode: Mode;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string;
  nDefault: string; tDefault: string; mDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItUtilsSlug, Config> = {
  "it-uuid-generator": { title: "UUID generator", description: `UUID v4-shaped sample. ${DISCLAIMER}`, mode: "uuid", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "", mDefault: "" },
  "it-random-number-generator": { title: "Random number", description: `Integer in [min, max]. ${DISCLAIMER}`, mode: "randomNum", aDefault: "", bDefault: "", cDefault: "", rDefault: "0", nDefault: "", tDefault: "", mDefault: "100" },
  "it-random-string-generator": { title: "Random string", description: `Alphanumeric string. ${DISCLAIMER}`, mode: "randomStr", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "16", tDefault: "", mDefault: "" },
  "it-slug-generator": { title: "Slug generator", description: `URL slug from text. ${DISCLAIMER}`, mode: "slug", aDefault: "Hello World!", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "", mDefault: "" },
  "it-case-converter-upper-lower-snake-camel": { title: "Case converter", description: `upper, lower, snake, camel. ${DISCLAIMER}`, mode: "case", aDefault: "helloWorld_example", bDefault: "", cDefault: "snake", rDefault: "", nDefault: "", tDefault: "", mDefault: "" },
  "it-text-diff-checker": { title: "Text diff", description: `Line-oriented diff. ${DISCLAIMER}`, mode: "diff", aDefault: "line1\nline2", bDefault: "line1\nchanged", cDefault: "", rDefault: "", nDefault: "", tDefault: "", mDefault: "" },
  "it-line-count-tool": { title: "Line count", description: `Count lines in text. ${DISCLAIMER}`, mode: "lines", aDefault: "one\ntwo\nthree", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "", mDefault: "" },
  "it-character-count-tool": { title: "Character count", description: `Chars and words. ${DISCLAIMER}`, mode: "chars", aDefault: "hello world", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "", mDefault: "" },
  "it-regex-tester": { title: "Regex tester", description: `JavaScript RegExp matches. ${DISCLAIMER}`, mode: "regex", aDefault: "abc123", bDefault: "", cDefault: "\\d+", rDefault: "g", nDefault: "", tDefault: "", mDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function formatResult(res: ItUtilsResult) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.output) rows.push({ label: "Output", value: res.output });
  if (res.matches) rows.push({ label: "Matches", value: res.matches });
  if (res.lines !== undefined) rows.push({ label: "Lines", value: String(res.lines) });
  if (res.chars !== undefined) rows.push({ label: "Characters", value: String(res.chars) });
  if (res.words !== undefined) rows.push({ label: "Words", value: String(res.words) });
  if (res.count !== undefined && res.lines === undefined) rows.push({ label: "Count", value: String(res.count) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.output?.slice(0, 80) ?? res.matches
    ?? (res.lines !== undefined ? String(res.lines)
    : res.chars !== undefined ? String(res.chars)
    : res.count !== undefined ? String(res.count)
    : "—");
  const primaryLabel =
    res.matches ? "Matches" : res.lines !== undefined ? "Lines"
    : res.chars !== undefined ? "Characters" : res.count !== undefined ? "Count" : "Output";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItUtilsCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItUtilsSlug;
  const config = CONFIG[key] ?? CONFIG["it-uuid-generator"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(IT_URL.M, config.mDefault));

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "uuid": break;
      case "randomNum": put(IT_URL.R, r); put(IT_URL.M, m); break;
      case "randomStr": put(IT_URL.N, n); put(IT_URL.T, t); break;
      case "slug": case "lines": case "chars": put(IT_URL.A, a); break;
      case "case": put(IT_URL.A, a); put(IT_URL.C, c); break;
      case "diff": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "regex": put(IT_URL.A, a); put(IT_URL.C, c); put(IT_URL.R, r); break;
    }
    return out;
  }, [a, b, c, config.mode, m, n, r, t]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, r, t]);

  const result = useMemo(() => {
    const input: ItUtilsInput = {};
    switch (config.mode) {
      case "uuid":
        break;
      case "randomNum": {
        const min = parseFiniteNumber(r, "Min");
        const max = parseFiniteNumber(m, "Max");
        if (!min.ok) return { error: min.error };
        if (!max.ok) return { error: max.error };
        input.min = min.value;
        input.max = max.value;
        break;
      }
      case "randomStr": {
        if (n.trim() !== "") {
          const len = parsePositive(n, "Length");
          if (!len.ok) return { error: len.error };
          input.length = Math.floor(len.value);
        }
        if (t.trim()) input.alphabet = t;
        break;
      }
      case "slug": case "lines": case "chars":
        input.text = a;
        break;
      case "case":
        input.text = a;
        input.mode = c.trim() || "upper";
        break;
      case "diff":
        input.text = a;
        input.textB = b;
        break;
      case "regex":
        input.text = a;
        input.pattern = c.trim() || undefined;
        input.flags = r.trim() || "g";
        break;
    }
    return formatResult(computeItUtils(key in CONFIG ? key : "it-uuid-generator", input));
  }, [a, b, c, config.mode, key, m, n, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "uuid" ? (
            <p className="text-sm text-[var(--muted)]">Click Calculate or refresh — a new UUID is generated on each compute.</p>
          ) : null}
          {config.mode === "randomNum" ? (
            <>
              <div><FieldLabel htmlFor="itu-r">Min</FieldLabel><FieldInput id="itu-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itu-m">Max</FieldLabel><FieldInput id="itu-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "randomStr" ? (
            <>
              <div><FieldLabel htmlFor="itu-n">Length</FieldLabel><FieldInput id="itu-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itu-t">Alphabet (optional)</FieldLabel><FieldInput id="itu-t" value={t} onChange={(ev) => setT(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "slug" || config.mode === "lines" || config.mode === "chars" || config.mode === "case" ? (
            <div><FieldLabel htmlFor="itu-a">Text</FieldLabel><FieldInput id="itu-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
          ) : null}
          {config.mode === "case" ? (
            <div><FieldLabel htmlFor="itu-c">Mode (upper, lower, snake, camel)</FieldLabel><FieldInput id="itu-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
          ) : null}
          {config.mode === "diff" ? (
            <>
              <div><FieldLabel htmlFor="itu-a">Text A</FieldLabel><FieldInput id="itu-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itu-b">Text B</FieldLabel><FieldInput id="itu-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "regex" ? (
            <>
              <div><FieldLabel htmlFor="itu-a">Text</FieldLabel><FieldInput id="itu-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itu-c">Pattern</FieldLabel><FieldInput id="itu-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itu-r">Flags (e.g. g, gi)</FieldLabel><FieldInput id="itu-r" value={r} onChange={(ev) => setR(ev.target.value)} /></div>
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
