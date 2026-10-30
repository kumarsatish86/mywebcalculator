"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { AIGEN_URL, type AigenInput, type AigenResult } from "@/lib/calculators/aigenHelpers";
import { AigenResultRow, formatAigenResult } from "./aigenHostShared";

export type AigenField = { key: keyof typeof AIGEN_URL; label: string; def: string };

export type AigenHostConfig<S extends string> = {
  title: string;
  description: string;
  fields: AigenField[];
  build: (v: Record<string, string>) => AigenInput | { error: string };
};

export function createAigenSectionHost<S extends string>(opts: {
  name: string;
  configs: Record<S, AigenHostConfig<S>>;
  fallback: S;
  compute: (slug: S, input: AigenInput) => AigenResult;
  idPrefix: string;
}) {
  const { configs, fallback, compute, idPrefix } = opts;

  return function AigenSectionHost({ slug }: { slug: string }) {
    const key = (slug in configs ? slug : fallback) as S;
    const config = configs[key];
    const def = (k: keyof typeof AIGEN_URL) => config.fields.find((f) => f.key === k)?.def ?? "";

    const [a, setA] = useState(useLoanInitialInput(AIGEN_URL.A, def("A")));
    const [b, setB] = useState(useLoanInitialInput(AIGEN_URL.B, def("B")));
    const [c, setC] = useState(useLoanInitialInput(AIGEN_URL.C, def("C")));
    const [d, setD] = useState(useLoanInitialInput(AIGEN_URL.D, def("D")));
    const [n, setN] = useState(useLoanInitialInput(AIGEN_URL.N, def("N")));
    const [m, setM] = useState(useLoanInitialInput(AIGEN_URL.M, def("M")));
    const [p, setP] = useState(useLoanInitialInput(AIGEN_URL.P, def("P")));
    const [h, setH] = useState(useLoanInitialInput(AIGEN_URL.H, def("H")));
    const [r, setR] = useState(useLoanInitialInput(AIGEN_URL.R, def("R")));
    const [t, setT] = useState(useLoanInitialInput(AIGEN_URL.T, def("T")));
    const [l, setL] = useState(useLoanInitialInput(AIGEN_URL.L, def("L")));
    const [w, setW] = useState(useLoanInitialInput(AIGEN_URL.W, def("W")));
    const [v, setV] = useState(useLoanInitialInput(AIGEN_URL.V, def("V")));
    const [s, setS] = useState(useLoanInitialInput(AIGEN_URL.S, def("S")));
    const [q, setQ] = useState(useLoanInitialInput(AIGEN_URL.Q, def("Q")));

    const values: Record<string, string> = { a, b, c, d, n, m, p, h, r, t, l, w, v, s, q };
    const setters: Record<string, (x: string) => void> = {
      a: setA,
      b: setB,
      c: setC,
      d: setD,
      n: setN,
      m: setM,
      p: setP,
      h: setH,
      r: setR,
      t: setT,
      l: setL,
      w: setW,
      v: setV,
      s: setS,
      q: setQ,
    };

    const shareParams = useCallback(() => {
      const out: Record<string, string> = {};
      for (const f of config.fields) {
        const val = values[AIGEN_URL[f.key]];
        if (val?.trim()) out[AIGEN_URL[f.key]] = val;
      }
      return out;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.fields, a, b, c, d, n, m, p, h, r, t, l, w, v, s, q]);

    useLoanUrlSync(shareParams, [a, b, c, d, n, m, p, h, r, t, l, w, v, s, q]);

    const result = useMemo(() => {
      const built = config.build(values);
      if (typeof built === "object" && built !== null && "error" in built) {
        return { error: (built as { error: string }).error };
      }
      return formatAigenResult(compute(key, built as AigenInput));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, key, a, b, c, d, n, m, p, h, r, t, l, w, v, s, q]);

    return (
      <CalculatorShell title={config.title} description={config.description}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {config.fields.map((f) => (
              <div key={f.key}>
                <FieldLabel htmlFor={`${idPrefix}-${f.key}`}>{f.label}</FieldLabel>
                <FieldInput
                  id={`${idPrefix}-${f.key}`}
                  value={values[AIGEN_URL[f.key]]}
                  onChange={(ev) => setters[AIGEN_URL[f.key]](ev.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            {"error" in result ? (
              <p className="text-sm text-red-600">{result.error}</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
                </div>
                <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--bg)] p-3 text-sm leading-relaxed">
                  {result.draft}
                </pre>
                <div className="space-y-2 text-sm">
                  {result.rows.map((row) => (
                    <AigenResultRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CalculatorShell>
    );
  };
}
