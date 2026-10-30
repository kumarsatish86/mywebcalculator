"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItCloud,
  type ItCloudInput,
  type ItCloudResult,
  type ItCloudSlug,
} from "@/lib/calculators/itCloud";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "cost" | "k8s" | "docker" | "container" | "cicd" | "sla" | "autoscale";

type Config = {
  title: string; description: string; mode: Mode;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string; tDefault: string;
  nDefault: string; pDefault: string; qDefault: string; mDefault: string; vDefault: string;
  lDefault: string; wDefault: string; hDefault: string; sDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItCloudSlug, Config> = {
  "it-cloud-cost-calculator-aws-azure-gcp-style": { title: "Cloud cost", description: `rate×hours×instances. ${DISCLAIMER}`, mode: "cost", aDefault: "0.10", bDefault: "730", cDefault: "2", rDefault: "", tDefault: "", nDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-ec2-instance-cost-calculator": { title: "EC2 cost", description: `Instance monthly estimate. ${DISCLAIMER}`, mode: "cost", aDefault: "0.05", bDefault: "730", cDefault: "1", rDefault: "", tDefault: "", nDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-server-cost-calculator": { title: "Server cost", description: `Hourly rate rollup. ${DISCLAIMER}`, mode: "cost", aDefault: "0.08", bDefault: "720", cDefault: "1", rDefault: "", tDefault: "", nDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-kubernetes-resource-calculator": { title: "Kubernetes resources", description: `pods×CPU/mem requests. ${DISCLAIMER}`, mode: "k8s", aDefault: "", bDefault: "", cDefault: "", rDefault: "0.5", tDefault: "1", nDefault: "10", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-pod-resource-estimator": { title: "Pod resources", description: `Per-pod request rollup. ${DISCLAIMER}`, mode: "k8s", aDefault: "", bDefault: "", cDefault: "", rDefault: "0.25", tDefault: "0.5", nDefault: "20", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-docker-resource-calculator": { title: "Docker resources", description: `Container CPU/mem reservation. ${DISCLAIMER}`, mode: "docker", aDefault: "", bDefault: "", cDefault: "", rDefault: "2", tDefault: "4", nDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-container-size-calculator": { title: "Container image size", description: `base + layers×avg. ${DISCLAIMER}`, mode: "container", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", pDefault: "200", qDefault: "5", mDefault: "", vDefault: "50", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-cicd-pipeline-time-estimator": { title: "CI/CD pipeline time", description: `stages × min/stage. ${DISCLAIMER}`, mode: "cicd", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", pDefault: "", qDefault: "", mDefault: "5", vDefault: "8", lDefault: "", wDefault: "", hDefault: "", sDefault: "" },
  "it-uptime-calculator-sla-percent": { title: "SLA downtime", description: `Allowed downtime/year. ${DISCLAIMER}`, mode: "sla", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "", wDefault: "", hDefault: "", sDefault: "99.9" },
  "it-autoscaling-cost-estimator": { title: "Autoscaling cost", description: `Baseline + peak blend. ${DISCLAIMER}`, mode: "autoscale", aDefault: "0.10", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "", pDefault: "", qDefault: "", mDefault: "", vDefault: "", lDefault: "2", wDefault: "6", hDefault: "8", sDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: ItCloudResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.monthlyCost !== undefined) rows.push({ label: "Monthly cost", value: num(res.monthlyCost, 2) });
  if (res.totalCpu !== undefined) rows.push({ label: "Total CPU", value: num(res.totalCpu, 2) });
  if (res.totalMemGb !== undefined) rows.push({ label: "Total mem (GB)", value: num(res.totalMemGb, 2) });
  if (res.sizeMb !== undefined) rows.push({ label: "Image (MB)", value: num(res.sizeMb, 0) });
  if (res.minutes !== undefined) rows.push({ label: "Minutes", value: num(res.minutes, 0) });
  if (res.downtimeMinutesYear !== undefined) rows.push({ label: "Downtime min/year", value: num(res.downtimeMinutesYear, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.monthlyCost !== undefined ? num(res.monthlyCost, 2)
    : res.downtimeMinutesYear !== undefined ? num(res.downtimeMinutesYear, 1)
    : res.minutes !== undefined ? num(res.minutes, 0)
    : res.sizeMb !== undefined ? num(res.sizeMb, 0)
    : res.totalCpu !== undefined ? num(res.totalCpu, 2)
    : "—";
  const primaryLabel =
    res.monthlyCost !== undefined ? "Monthly cost" : res.downtimeMinutesYear !== undefined ? "Downtime (min/yr)"
    : res.minutes !== undefined ? "Pipeline (min)" : res.sizeMb !== undefined ? "Image (MB)" : "Total CPU";
  return { primary, primaryLabel, rows };
}

export function ItCloudCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItCloudSlug;
  const config = CONFIG[key] ?? CONFIG["it-cloud-cost-calculator-aws-azure-gcp-style"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(IT_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(IT_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(IT_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(IT_URL.V, config.vDefault));
  const [l, setL] = useState(useLoanInitialInput(IT_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(IT_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(IT_URL.H, config.hDefault));
  const [s, setS] = useState(useLoanInitialInput(IT_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "cost": put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.C, c); break;
      case "k8s": put(IT_URL.N, n); put(IT_URL.R, r); put(IT_URL.T, t); break;
      case "docker": put(IT_URL.R, r); put(IT_URL.T, t); break;
      case "container": put(IT_URL.P, p); put(IT_URL.Q, q); put(IT_URL.V, v); break;
      case "cicd": put(IT_URL.M, m); put(IT_URL.V, v); break;
      case "sla": put(IT_URL.S, s); break;
      case "autoscale": put(IT_URL.A, a); put(IT_URL.L, l); put(IT_URL.W, w); put(IT_URL.H, h); break;
    }
    return out;
  }, [a, b, c, config.mode, h, l, m, n, p, q, r, s, t, v, w]);

  useLoanUrlSync(shareParams, [a, b, c, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: ItCloudInput = {};
    switch (config.mode) {
      case "cost": {
        const rate = parsePositive(a, "Hourly rate");
        if (!rate.ok) return { error: rate.error };
        input.hourlyRate = rate.value;
        if (b.trim() !== "") {
          const hrs = parsePositive(b, "Hours");
          if (!hrs.ok) return { error: hrs.error };
          input.hours = hrs.value;
        }
        if (c.trim() !== "") {
          const inst = parsePositive(c, "Instances");
          if (!inst.ok) return { error: inst.error };
          input.instances = inst.value;
        }
        break;
      }
      case "k8s": {
        const pods = parsePositive(n, "Pods");
        const cpu = parsePositive(r, "CPU request");
        const mem = parsePositive(t, "Mem (GB)");
        if (!pods.ok) return { error: pods.error };
        if (!cpu.ok) return { error: cpu.error };
        if (!mem.ok) return { error: mem.error };
        input.pods = pods.value;
        input.cpuRequest = cpu.value;
        input.memRequestGb = mem.value;
        break;
      }
      case "docker": {
        const cpu = parsePositive(r, "CPU cores");
        const mem = parsePositive(t, "Memory (GB)");
        if (!cpu.ok) return { error: cpu.error };
        if (!mem.ok) return { error: mem.error };
        input.cpuCores = cpu.value;
        input.memoryGb = mem.value;
        break;
      }
      case "container": {
        const base = parseNonNegative(p, "Base (MB)");
        const layers = parseNonNegative(q, "Layers");
        if (!base.ok) return { error: base.error };
        if (!layers.ok) return { error: layers.error };
        input.imageMb = base.value;
        input.layers = layers.value;
        if (v.trim() !== "") {
          const layerMb = parsePositive(v, "Layer MB");
          if (!layerMb.ok) return { error: layerMb.error };
          input.memRequestGb = layerMb.value / 1024;
        }
        break;
      }
      case "cicd": {
        const stages = parsePositive(m, "Stages");
        const mins = parsePositive(v, "Min/stage");
        if (!stages.ok) return { error: stages.error };
        if (!mins.ok) return { error: mins.error };
        input.stages = stages.value;
        input.minutesPerStage = mins.value;
        break;
      }
      case "sla": {
        const sla = parseNonNegative(s, "SLA %");
        if (!sla.ok) return { error: sla.error };
        if (sla.value > 100) return { error: "SLA % must be 0–100." };
        input.slaPercent = sla.value;
        break;
      }
      case "autoscale": {
        const rate = parsePositive(a, "Hourly rate");
        if (!rate.ok) return { error: rate.error };
        input.hourlyRate = rate.value;
        const base = parsePositive(l, "Baseline instances");
        const peak = parsePositive(w, "Peak instances");
        const peakH = parseNonNegative(h, "Peak hours/day");
        if (!base.ok) return { error: base.error };
        if (!peak.ok) return { error: peak.error };
        if (!peakH.ok) return { error: peakH.error };
        input.baselineInstances = base.value;
        input.peakInstances = peak.value;
        input.peakHoursPerDay = peakH.value;
        break;
      }
    }
    return formatResult(computeItCloud(key in CONFIG ? key : "it-cloud-cost-calculator-aws-azure-gcp-style", input), num);
  }, [a, b, c, config.mode, h, key, l, m, n, p, q, r, s, t, v, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "cost" ? (
            <>
              <div><FieldLabel htmlFor="itca-a">Hourly rate ($)</FieldLabel><FieldInput id="itca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itca-b">Hours (default 730)</FieldLabel><FieldInput id="itca-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itca-c">Instances</FieldLabel><FieldInput id="itca-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "k8s" ? (
            <>
              <div><FieldLabel htmlFor="itca-n">Pods</FieldLabel><FieldInput id="itca-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itca-r">CPU request (cores)</FieldLabel><FieldInput id="itca-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itca-t">Memory request (GB)</FieldLabel><FieldInput id="itca-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "docker" ? (
            <>
              <div><FieldLabel htmlFor="itca-r">CPU cores</FieldLabel><FieldInput id="itca-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itca-t">Memory (GB)</FieldLabel><FieldInput id="itca-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "container" ? (
            <>
              <div><FieldLabel htmlFor="itca-p">Base image (MB)</FieldLabel><FieldInput id="itca-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itca-q">Layers</FieldLabel><FieldInput id="itca-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itca-v">Avg layer (MB)</FieldLabel><FieldInput id="itca-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cicd" ? (
            <>
              <div><FieldLabel htmlFor="itca-m">Stages</FieldLabel><FieldInput id="itca-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itca-v">Minutes per stage</FieldLabel><FieldInput id="itca-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "sla" ? (
            <div><FieldLabel htmlFor="itca-s">SLA % (0–100)</FieldLabel><FieldInput id="itca-s" value={s} onChange={(ev) => setS(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "autoscale" ? (
            <>
              <div><FieldLabel htmlFor="itca-a">Hourly rate ($)</FieldLabel><FieldInput id="itca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itca-l">Baseline instances</FieldLabel><FieldInput id="itca-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itca-w">Peak instances</FieldLabel><FieldInput id="itca-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itca-h">Peak hours per day</FieldLabel><FieldInput id="itca-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
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
