"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CIVIL_URL } from "@/lib/calculators/civilHelpers";
import {
  computeCivilEstimation,
  type CivilEstimationInput,
  type CivilEstimationResult,
  type CivilEstimationSlug,
} from "@/lib/calculators/civilEstimation";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "areaCost" | "material" | "labor" | "project" | "boq" | "rateAnalysis";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  qDefault: string;
  rDefault: string;
  pDefault: string;
  nDefault: string;
};

const DISCLAIMER =
  "Engineering study/estimation only — not a design approval. Verify with a licensed professional and local codes.";

const CONFIG: Record<CivilEstimationSlug, Config> = {
  "civil-construction-cost-calculator": {
    title: "Construction cost", description: `Area × rate/m² estimate. ${DISCLAIMER}`,
    mode: "areaCost", aDefault: "150", bDefault: "", qDefault: "", rDefault: "1200", pDefault: "", nDefault: "",
  },
  "civil-house-construction-cost-calculator": {
    title: "House construction cost", description: `Built-up area × unit rate. ${DISCLAIMER}`,
    mode: "areaCost", aDefault: "120", bDefault: "", qDefault: "", rDefault: "1500", pDefault: "", nDefault: "",
  },
  "civil-material-cost-estimator": {
    title: "Material cost", description: `Quantity × unit rate. ${DISCLAIMER}`,
    mode: "material", aDefault: "", bDefault: "", qDefault: "100", rDefault: "45", pDefault: "", nDefault: "",
  },
  "civil-labor-cost-calculator": {
    title: "Labor cost", description: `Days × crew × daily wage. ${DISCLAIMER}`,
    mode: "labor", aDefault: "", bDefault: "", qDefault: "20", rDefault: "800", pDefault: "", nDefault: "5",
  },
  "civil-project-cost-calculator": {
    title: "Project cost rollup", description: `Materials + labor + OH + profit. ${DISCLAIMER}`,
    mode: "project", aDefault: "500000", bDefault: "200000", qDefault: "", rDefault: "10", pDefault: "10", nDefault: "",
  },
  "civil-boq-bill-of-quantity-calculator": {
    title: "BOQ line amount", description: `Qty × rate (× items). ${DISCLAIMER}`,
    mode: "boq", aDefault: "", bDefault: "", qDefault: "50", rDefault: "120", pDefault: "", nDefault: "1",
  },
  "civil-rate-analysis-calculator": {
    title: "Rate analysis", description: `Unit rate with OH and profit. ${DISCLAIMER}`,
    mode: "rateAnalysis", aDefault: "300", bDefault: "150", qDefault: "1", rDefault: "10", pDefault: "10", nDefault: "",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: CivilEstimationResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.materialCost !== undefined) rows.push({ label: "Material cost", value: num(res.materialCost, 0) });
  if (res.laborCost !== undefined) rows.push({ label: "Labor cost", value: num(res.laborCost, 0) });
  if (res.overhead !== undefined) rows.push({ label: "Overhead", value: num(res.overhead, 0) });
  if (res.profit !== undefined) rows.push({ label: "Profit", value: num(res.profit, 0) });
  if (res.unitRate !== undefined) rows.push({ label: "Unit rate", value: num(res.unitRate, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary = res.totalCost !== undefined ? num(res.totalCost, 0) : "—";
  return { primary, primaryLabel: "Total cost", rows };
}

export function CivilEstimationCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CivilEstimationSlug;
  const config = CONFIG[key] ?? CONFIG["civil-construction-cost-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CIVIL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CIVIL_URL.B, config.bDefault));
  const [q, setQ] = useState(useLoanInitialInput(CIVIL_URL.Q, config.qDefault));
  const [r, setR] = useState(useLoanInitialInput(CIVIL_URL.R, config.rDefault));
  const [p, setP] = useState(useLoanInitialInput(CIVIL_URL.P, config.pDefault));
  const [n, setN] = useState(useLoanInitialInput(CIVIL_URL.N, config.nDefault));

  const num = (nVal: number, dec = 0) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "areaCost":
        put(CIVIL_URL.A, a); put(CIVIL_URL.R, r);
        break;
      case "material":
      case "boq":
        put(CIVIL_URL.Q, q); put(CIVIL_URL.R, r);
        if (config.mode === "boq") put(CIVIL_URL.N, n);
        break;
      case "labor":
        put(CIVIL_URL.Q, q); put(CIVIL_URL.R, r); put(CIVIL_URL.N, n);
        break;
      case "project":
      case "rateAnalysis":
        put(CIVIL_URL.A, a); put(CIVIL_URL.B, b); put(CIVIL_URL.P, p); put(CIVIL_URL.R, r);
        if (config.mode === "rateAnalysis") put(CIVIL_URL.Q, q);
        break;
    }
    return out;
  }, [a, b, config.mode, n, p, q, r]);

  useLoanUrlSync(shareParams, [a, b, n, p, q, r]);

  const result = useMemo(() => {
    const input: CivilEstimationInput = {};
    if (config.mode === "areaCost") {
      const area = parsePositive(a, "Built-up area (m²)");
      const rate = parsePositive(r, "Cost per m²");
      if (!area.ok) return { error: area.error };
      if (!rate.ok) return { error: rate.error };
      input.areaM2 = area.value; input.costPerM2 = rate.value;
    } else if (config.mode === "material" || config.mode === "boq") {
      const qty = parsePositive(q, "Quantity");
      const rate = parsePositive(r, "Unit rate");
      if (!qty.ok) return { error: qty.error };
      if (!rate.ok) return { error: rate.error };
      input.quantity = qty.value; input.rate = rate.value;
      if (config.mode === "boq" && n.trim() !== "") {
        const items = parsePositive(n, "Line items");
        if (!items.ok) return { error: items.error };
        input.items = items.value;
      }
    } else if (config.mode === "labor") {
      const days = parsePositive(q, "Days");
      const wage = parsePositive(r, "Wage per day");
      if (!days.ok) return { error: days.error };
      if (!wage.ok) return { error: wage.error };
      input.days = days.value; input.wagePerDay = wage.value;
      if (n.trim() !== "") {
        const workers = parsePositive(n, "Workers");
        if (!workers.ok) return { error: workers.error };
        input.workers = workers.value;
      }
    } else {
      const mat = parseNonNegative(a, "Material cost");
      const lab = parseNonNegative(b, "Labor cost");
      if (!mat.ok) return { error: mat.error };
      if (!lab.ok) return { error: lab.error };
      input.materialCost = mat.value; input.laborCost = lab.value;
      if (p.trim() !== "") {
        const oh = parseNonNegative(p, "Overhead %");
        if (!oh.ok) return { error: oh.error };
        input.overheadPct = oh.value;
      }
      if (r.trim() !== "") {
        const pr = parseNonNegative(r, "Profit %");
        if (!pr.ok) return { error: pr.error };
        input.profitPct = pr.value;
      }
      if (config.mode === "rateAnalysis") {
        const qty = parsePositive(q, "Quantity");
        if (!qty.ok) return { error: qty.error };
        input.quantity = qty.value;
      }
    }
    return formatResult(computeCivilEstimation(key in CONFIG ? key : "civil-construction-cost-calculator", input), num);
  }, [a, b, config.mode, key, n, p, q, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "areaCost" ? (
            <>
              <div><FieldLabel htmlFor="ce-a">Built-up area (m²)</FieldLabel><FieldInput id="ce-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ce-r">Cost per m²</FieldLabel><FieldInput id="ce-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "material" || config.mode === "boq") ? (
            <>
              <div><FieldLabel htmlFor="ce-q">Quantity</FieldLabel><FieldInput id="ce-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ce-r">Unit rate</FieldLabel><FieldInput id="ce-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              {config.mode === "boq" ? (
                <div><FieldLabel htmlFor="ce-n">Line items (optional)</FieldLabel><FieldInput id="ce-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
              ) : null}
            </>
          ) : null}
          {config.mode === "labor" ? (
            <>
              <div><FieldLabel htmlFor="ce-q">Days</FieldLabel><FieldInput id="ce-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ce-n">Workers</FieldLabel><FieldInput id="ce-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="ce-r">Wage per day</FieldLabel><FieldInput id="ce-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "project" || config.mode === "rateAnalysis") ? (
            <>
              <div><FieldLabel htmlFor="ce-a">Material cost</FieldLabel><FieldInput id="ce-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ce-b">Labor cost</FieldLabel><FieldInput id="ce-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              {config.mode === "rateAnalysis" ? (
                <div><FieldLabel htmlFor="ce-q">Quantity (for unit rate)</FieldLabel><FieldInput id="ce-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
              ) : null}
              <div><FieldLabel htmlFor="ce-p">Overhead (%)</FieldLabel><FieldInput id="ce-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ce-r">Profit (%)</FieldLabel><FieldInput id="ce-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
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
                {result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
