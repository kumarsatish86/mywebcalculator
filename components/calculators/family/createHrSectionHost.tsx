"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HR_URL, type HrResult } from "@/lib/calculators/hrHelpers";
import { formatHrResult, HrResultRow } from "./hrHostShared";

export type HrField = { key: keyof typeof HR_URL; label: string; def: string };

export type HrHostConfig<S extends string, I> = {
  title: string;
  description: string;
  fields: HrField[];
  build: (v: Record<string, string>) => I | { error: string };
};

export function createHrSectionHost<S extends string, I extends object>(opts: {
  name: string;
  configs: Record<S, HrHostConfig<S, I>>;
  fallback: S;
  compute: (slug: S, input: I) => HrResult;
  idPrefix: string;
}) {
  const { configs, fallback, compute, idPrefix } = opts;

  return function HrSectionHost({ slug }: { slug: string }) {
    const key = (slug in configs ? slug : fallback) as S;
    const config = configs[key];
    const def = (k: keyof typeof HR_URL) => config.fields.find((f) => f.key === k)?.def ?? "";

    const [a, setA] = useState(useLoanInitialInput(HR_URL.A, def("A")));
    const [b, setB] = useState(useLoanInitialInput(HR_URL.B, def("B")));
    const [c, setC] = useState(useLoanInitialInput(HR_URL.C, def("C")));
    const [d, setD] = useState(useLoanInitialInput(HR_URL.D, def("D")));
    const [n, setN] = useState(useLoanInitialInput(HR_URL.N, def("N")));
    const [m, setM] = useState(useLoanInitialInput(HR_URL.M, def("M")));
    const [p, setP] = useState(useLoanInitialInput(HR_URL.P, def("P")));
    const [h, setH] = useState(useLoanInitialInput(HR_URL.H, def("H")));
    const [r, setR] = useState(useLoanInitialInput(HR_URL.R, def("R")));
    const [t, setT] = useState(useLoanInitialInput(HR_URL.T, def("T")));
    const [l, setL] = useState(useLoanInitialInput(HR_URL.L, def("L")));
    const [w, setW] = useState(useLoanInitialInput(HR_URL.W, def("W")));
    const [v, setV] = useState(useLoanInitialInput(HR_URL.V, def("V")));
    const [s, setS] = useState(useLoanInitialInput(HR_URL.S, def("S")));
    const [q, setQ] = useState(useLoanInitialInput(HR_URL.Q, def("Q")));

    const values: Record<string, string> = { a, b, c, d, n, m, p, h, r, t, l, w, v, s, q };
    const setters: Record<string, (x: string) => void> = {
      a: setA, b: setB, c: setC, d: setD, n: setN, m: setM, p: setP, h: setH,
      r: setR, t: setT, l: setL, w: setW, v: setV, s: setS, q: setQ,
    };

    const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

    const shareParams = useCallback(() => {
      const out: Record<string, string> = {};
      for (const f of config.fields) {
        const val = values[HR_URL[f.key]];
        if (val?.trim()) out[HR_URL[f.key]] = val;
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
      return formatHrResult(compute(key, built as I), num);
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
                  value={values[HR_URL[f.key]]}
                  onChange={(ev) => setters[HR_URL[f.key]](ev.target.value)}
                  inputMode="decimal"
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
                <div className="space-y-2 text-sm">
                  {result.rows.map((row) => (
                    <HrResultRow key={row.label} label={row.label} value={row.value} />
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
