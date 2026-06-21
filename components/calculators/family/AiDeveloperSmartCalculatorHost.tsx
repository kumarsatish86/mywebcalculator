"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import {
  ChartBlock,
  HealthScoreBadge,
  InsightPanel,
  ScenarioCards,
  type ChartValueFormat,
} from "@/components/calculators/ai-finance/AiFinanceUi";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { AI_DEV_URL, parseExposure, parseFramework, type ComplianceFramework, type ExposureLevel } from "@/lib/calculators/aiDeveloperSmart";
import { computeDeveloperHostResult } from "./aiDeveloperHostCompute";
import type { AiDeveloperSlug, Mode } from "./aiDeveloperHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  codeComplexity: "Maintainability",
  apiCost: "Cost efficiency",
  cloudCost: "Cloud efficiency",
  serverCapacity: "Capacity health",
  riskScore: "Security posture",
  vulnImpact: "Impact severity",
  complianceGap: "Audit readiness",
  securityBudget: "Budget fit",
};

function chartProps(mode: Mode): { valueFormat: ChartValueFormat; projectionTitle?: string; compareTitle?: string } {
  switch (mode) {
    case "codeComplexity":
      return { valueFormat: "score", compareTitle: "Complexity benchmarks", projectionTitle: "Maintainability improvement path" };
    case "apiCost":
      return { valueFormat: "currency", compareTitle: "API cost benchmarks", projectionTitle: "Spend growth projection" };
    case "cloudCost":
      return { valueFormat: "currency", compareTitle: "Cost mix benchmarks", projectionTitle: "Optimization savings path" };
    case "serverCapacity":
      return { valueFormat: "count", compareTitle: "Capacity benchmarks", projectionTitle: "Traffic growth projection" };
    case "riskScore":
      return { valueFormat: "score", compareTitle: "Security benchmarks", projectionTitle: "Posture improvement path" };
    case "vulnImpact":
      return { valueFormat: "score", compareTitle: "Impact factors", projectionTitle: "Risk reduction scenarios" };
    case "complianceGap":
      return { valueFormat: "score", compareTitle: "Domain gap scores", projectionTitle: "Readiness timeline" };
    case "securityBudget":
      return { valueFormat: "currency", compareTitle: "Budget benchmarks", projectionTitle: "Spend milestones" };
    default:
      return { valueFormat: "currency" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM or professional security audit; educational use only.";

const CONFIG: Record<AiDeveloperSlug, Config> = {
  "aist-ai-code-complexity-analyzer": { title: "AI code complexity analyzer", description: "LOC, cyclomatic complexity, nesting, coverage scoring with refactor hotspots and tech-debt hours.", mode: "codeComplexity" },
  "aist-ai-api-cost-estimator": { title: "AI API cost estimator", description: "Token-based monthly burn, cost per 1K requests, ranked optimization levers, and scale scenarios.", mode: "apiCost" },
  "aist-ai-cloud-cost-calculator": { title: "AI cloud cost calculator", description: "Compute, storage, and egress breakdown with reserved vs optimized scenarios and 90-day phases.", mode: "cloudCost" },
  "aist-ai-server-capacity-planner": { title: "AI server capacity planner", description: "RPS vs CPU/memory utilization, headroom analysis, scale recommendations, and traffic milestones.", mode: "serverCapacity" },
  "aist-ai-risk-score-calculator-security": { title: "AI risk score calculator", description: "Multi-factor security posture score from vulns, patch lag, MFA, and backup readiness.", mode: "riskScore" },
  "aist-ai-vulnerability-impact-analyzer": { title: "AI vulnerability impact analyzer", description: "CVSS + exploitability + blast radius with P0–P3 priority, fix timeline, and containment schedule.", mode: "vulnImpact" },
  "aist-ai-compliance-gap-analyzer": { title: "AI compliance gap analyzer", description: "SOC 2, GDPR, or ISO 27001 readiness with domain gaps, audit timeline, and remediation phases.", mode: "complianceGap" },
  "aist-ai-security-budget-planner": { title: "AI security budget planner", description: "Revenue-based spend recommendation, category allocation, gap analysis, and quarterly roadmap.", mode: "securityBudget" },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function AiDeveloperSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiDeveloperSlug] ?? CONFIG["aist-ai-code-complexity-analyzer"];
  const mode = config.mode;

  const [loc, setLoc] = useState(useLoanInitialInput(AI_DEV_URL.LOC, "12000"));
  const [cc, setCc] = useState(useLoanInitialInput(AI_DEV_URL.CC, "8"));
  const [nest, setNest] = useState(useLoanInitialInput(AI_DEV_URL.NEST, "3"));
  const [fn, setFn] = useState(useLoanInitialInput(AI_DEV_URL.FN, "240"));
  const [cov, setCov] = useState(useLoanInitialInput(AI_DEV_URL.COV, "62"));
  const [req, setReq] = useState(useLoanInitialInput(AI_DEV_URL.REQ, "500000"));
  const [tin, setTin] = useState(useLoanInitialInput(AI_DEV_URL.TIN, "800"));
  const [tout, setTout] = useState(useLoanInitialInput(AI_DEV_URL.TOUT, "400"));
  const [price, setPrice] = useState(useLoanInitialInput(AI_DEV_URL.PRICE, "2500"));
  const [compute, setCompute] = useState(useLoanInitialInput(AI_DEV_URL.COMPUTE, "720"));
  const [storage, setStorage] = useState(useLoanInitialInput(AI_DEV_URL.STORAGE, "500"));
  const [egress, setEgress] = useState(useLoanInitialInput(AI_DEV_URL.EGRESS, "200"));
  const [inst, setInst] = useState(useLoanInitialInput(AI_DEV_URL.INST, "4"));
  const [rps, setRps] = useState(useLoanInitialInput(AI_DEV_URL.RPS, "850"));
  const [lat, setLat] = useState(useLoanInitialInput(AI_DEV_URL.LAT, "120"));
  const [cpu, setCpu] = useState(useLoanInitialInput(AI_DEV_URL.CPU, "8"));
  const [mem, setMem] = useState(useLoanInitialInput(AI_DEV_URL.MEM, "32"));
  const [head, setHead] = useState(useLoanInitialInput(AI_DEV_URL.HEAD, "25"));
  const [assets, setAssets] = useState(useLoanInitialInput(AI_DEV_URL.ASSETS, "450"));
  const [crit, setCrit] = useState(useLoanInitialInput(AI_DEV_URL.CRIT, "3"));
  const [patch, setPatch] = useState(useLoanInitialInput(AI_DEV_URL.PATCH, "18"));
  const [mfa, setMfa] = useState(useLoanInitialInput(AI_DEV_URL.MFA, "78"));
  const [backup, setBackup] = useState(useLoanInitialInput(AI_DEV_URL.BACKUP, "6"));
  const [cvss, setCvss] = useState(useLoanInitialInput(AI_DEV_URL.CVSS, "7.8"));
  const [exploit, setExploit] = useState(useLoanInitialInput(AI_DEV_URL.EXPLOIT, "6"));
  const [aff, setAff] = useState(useLoanInitialInput(AI_DEV_URL.AFFECTED, "12"));
  const [exp, setExp] = useState<ExposureLevel>(parseExposure(useLoanInitialInput(AI_DEV_URL.EXPOSURE, "internet")));
  const [impl, setImpl] = useState(useLoanInitialInput(AI_DEV_URL.IMPL, "68"));
  const [total, setTotal] = useState(useLoanInitialInput(AI_DEV_URL.TOTAL, "92"));
  const [audit, setAudit] = useState(useLoanInitialInput(AI_DEV_URL.AUDIT, "120"));
  const [fw, setFw] = useState<ComplianceFramework>(parseFramework(useLoanInitialInput("fw", "soc2")));
  const [rev, setRev] = useState(useLoanInitialInput(AI_DEV_URL.REV, "50000000"));
  const [spend, setSpend] = useState(useLoanInitialInput(AI_DEV_URL.SPEND, "1800000"));
  const [inc, setInc] = useState(useLoanInitialInput(AI_DEV_URL.INCIDENTS, "4"));
  const [cmp, setCmp] = useState(useLoanInitialInput(AI_DEV_URL.COMPLIANCE, "6"));
  const [emp, setEmp] = useState(useLoanInitialInput(AI_DEV_URL.EMP, "85"));

  const inputs = useMemo(
    () => ({
      loc, cc, nest, fn, cov, req, tin, tout, price, compute, storage, egress, inst,
      rps, lat, cpu, mem, head, assets, crit, patch, mfa, backup, cvss, exploit, aff, exp,
      impl, total, audit, fw, rev, spend, inc, cmp, emp,
    }),
    [loc, cc, nest, fn, cov, req, tin, tout, price, compute, storage, egress, inst, rps, lat, cpu, mem, head, assets, crit, patch, mfa, backup, cvss, exploit, aff, exp, impl, total, audit, fw, rev, spend, inc, cmp, emp],
  );

  const shareParams = useCallback(
    () => ({
      [AI_DEV_URL.LOC]: loc, [AI_DEV_URL.CC]: cc, [AI_DEV_URL.NEST]: nest, [AI_DEV_URL.FN]: fn, [AI_DEV_URL.COV]: cov,
      [AI_DEV_URL.REQ]: req, [AI_DEV_URL.TIN]: tin, [AI_DEV_URL.TOUT]: tout, [AI_DEV_URL.PRICE]: price,
      [AI_DEV_URL.COMPUTE]: compute, [AI_DEV_URL.STORAGE]: storage, [AI_DEV_URL.EGRESS]: egress, [AI_DEV_URL.INST]: inst,
      [AI_DEV_URL.RPS]: rps, [AI_DEV_URL.LAT]: lat, [AI_DEV_URL.CPU]: cpu, [AI_DEV_URL.MEM]: mem, [AI_DEV_URL.HEAD]: head,
      [AI_DEV_URL.ASSETS]: assets, [AI_DEV_URL.CRIT]: crit, [AI_DEV_URL.PATCH]: patch, [AI_DEV_URL.MFA]: mfa, [AI_DEV_URL.BACKUP]: backup,
      [AI_DEV_URL.CVSS]: cvss, [AI_DEV_URL.EXPLOIT]: exploit, [AI_DEV_URL.AFFECTED]: aff, [AI_DEV_URL.EXPOSURE]: exp,
      [AI_DEV_URL.IMPL]: impl, [AI_DEV_URL.TOTAL]: total, [AI_DEV_URL.AUDIT]: audit, fw,
      [AI_DEV_URL.REV]: rev, [AI_DEV_URL.SPEND]: spend, [AI_DEV_URL.INCIDENTS]: inc, [AI_DEV_URL.COMPLIANCE]: cmp, [AI_DEV_URL.EMP]: emp,
    }),
    [loc, cc, nest, fn, cov, req, tin, tout, price, compute, storage, egress, inst, rps, lat, cpu, mem, head, assets, crit, patch, mfa, backup, cvss, exploit, aff, exp, impl, total, audit, fw, rev, spend, inc, cmp, emp],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeDeveloperHostResult(mode, inputs), [mode, inputs]);

  const field = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

  const chart = chartProps(mode);

  return (
    <CalculatorShell
      title={config.title}
      description={`${config.description} ${AI_NOTE}`}
      resultKey={"error" in result ? "err" : `${result.primary}-${result.healthScore ?? 0}`}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-3 text-sm">
            {result.healthScore != null && result.grade ? (
              <HealthScoreBadge score={result.healthScore} grade={result.grade} scoreLabel={SCORE_LABEL[mode]} />
            ) : null}
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-2xl font-semibold text-[var(--accent-bright)] sm:text-3xl">{result.primary}</p>
            </div>
            {result.rows?.map((row, i) => <Row key={`${row.label}-${i}`} label={row.label} value={row.value} />)}
            {result.insights?.length ? <InsightPanel insights={result.insights.slice(0, 3)} /> : null}
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "codeComplexity" && (
          <>
            {field("loc", "Lines of code", loc, setLoc)}
            {field("cc", "Avg cyclomatic complexity", cc, setCc)}
            {field("nest", "Max nesting depth", nest, setNest)}
            {field("fn", "Function count", fn, setFn)}
            {field("cov", "Test coverage %", cov, setCov)}
          </>
        )}
        {mode === "apiCost" && (
          <>
            {field("req", "Requests / month", req, setReq)}
            {field("tin", "Avg input tokens", tin, setTin)}
            {field("tout", "Avg output tokens", tout, setTout)}
            {field("price", "Price per 1M tokens (₹)", price, setPrice)}
          </>
        )}
        {mode === "cloudCost" && (
          <>
            {field("compute", "Compute hours / month", compute, setCompute)}
            {field("storage", "Storage (GB)", storage, setStorage)}
            {field("egress", "Egress (GB)", egress, setEgress)}
            {field("inst", "Instances", inst, setInst)}
          </>
        )}
        {mode === "serverCapacity" && (
          <>
            {field("rps", "Requests / second", rps, setRps)}
            {field("lat", "Avg latency (ms)", lat, setLat)}
            {field("cpu", "CPU cores", cpu, setCpu)}
            {field("mem", "Memory (GB)", mem, setMem)}
            {field("head", "Target headroom %", head, setHead)}
          </>
        )}
        {mode === "riskScore" && (
          <>
            {field("assets", "Asset count", assets, setAssets)}
            {field("crit", "Critical vulns open", crit, setCrit)}
            {field("patch", "Avg patch lag (days)", patch, setPatch)}
            {field("mfa", "MFA coverage %", mfa, setMfa)}
            {field("backup", "Backup score (0–10)", backup, setBackup)}
          </>
        )}
        {mode === "vulnImpact" && (
          <>
            {field("cvss", "CVSS score (0–10)", cvss, setCvss)}
            {field("exploit", "Exploitability (0–10)", exploit, setExploit)}
            {field("aff", "Assets affected", aff, setAff)}
            <div>
              <FieldLabel htmlFor="exp">Exposure</FieldLabel>
              <select id="exp" value={exp} onChange={(e) => setExp(parseExposure(e.target.value))} className={selectCls}>
                <option value="internet">Internet-facing</option>
                <option value="internal">Internal only</option>
                <option value="airgap">Air-gapped</option>
              </select>
            </div>
          </>
        )}
        {mode === "complianceGap" && (
          <>
            <div>
              <FieldLabel htmlFor="fw">Framework</FieldLabel>
              <select id="fw" value={fw} onChange={(e) => setFw(parseFramework(e.target.value))} className={selectCls}>
                <option value="soc2">SOC 2 Type II</option>
                <option value="gdpr">GDPR</option>
                <option value="iso27001">ISO 27001</option>
              </select>
            </div>
            {field("impl", "Controls implemented", impl, setImpl)}
            {field("total", "Total controls", total, setTotal)}
            {field("audit", "Days until audit", audit, setAudit)}
          </>
        )}
        {mode === "securityBudget" && (
          <>
            {field("rev", "Annual revenue (₹)", rev, setRev)}
            {field("spend", "Current security spend (₹/yr)", spend, setSpend)}
            {field("inc", "Incident history (0–10)", inc, setInc)}
            {field("cmp", "Compliance burden (0–10)", cmp, setCmp)}
            {field("emp", "Employees", emp, setEmp)}
          </>
        )}
      </div>

      {"error" in result ? null : (
        <>
          <ChartBlock slices={result.chartSlices} compare={result.compareRows} projection={result.projection} compareTitle={chart.compareTitle} projectionTitle={chart.projectionTitle} valueFormat={chart.valueFormat} compareFormat={chart.valueFormat} />
          {result.hotspots?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Complexity hotspots</p>
              {result.hotspots.map((h) => (
                <div key={h.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{h.name} · <span className="text-[var(--muted)]">{h.metric}</span></span>
                  <span className="font-mono">{h.severity}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedLevers?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Optimization levers</p>
              {result.rankedLevers.map((l) => (
                <div key={l.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{l.name}</span>
                  <span className="font-mono">₹{l.save.toLocaleString("en-IN")} · {l.effort}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.controlGaps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Control domain gaps</p>
              {result.controlGaps.map((g) => (
                <div key={g.domain} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{g.domain}</span>
                  <span className="font-mono">{g.gapPct}% · {g.priority}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.budgetAlloc?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Budget allocation</p>
              {result.budgetAlloc.map((b) => (
                <div key={b.category} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{b.category}</span>
                  <span className="font-mono">₹{b.amount.toLocaleString("en-IN")} · {b.pct}%</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.phases?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Roadmap phases</p>
              {result.phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4"><span className="font-medium">{p.phase}</span><span className="font-mono text-[var(--muted)]">{p.days} days</span></div>
                  <p className="mt-1 text-[var(--muted)]">{p.focus}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.schedule?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Timeline</p>
              {result.schedule.map((s) => (
                <div key={`${s.time}-${s.activity}`} className="flex justify-between gap-4 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--muted)]">{s.time}</span><span>{s.activity}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.steps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Action steps</p>
              {result.steps.map((s) => (
                <div key={s.step} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--accent)]">Step {s.step}: </span>{s.text}
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedItems?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Risk ranking</p>
              {result.rankedItems.map((s) => (
                <div key={s.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.name}</span><span className="font-mono">{s.score} · {s.status}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.milestones?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {mode === "securityBudget" ? "Spend milestones" : mode === "complianceGap" ? "Control milestones" : mode === "serverCapacity" ? "Capacity checkpoints" : "Milestones"}
              </p>
              {result.milestones.map((m) => (
                <div key={m.week} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>
                    {mode === "apiCost" || mode === "securityBudget" ? `Month ${m.week}` : mode === "complianceGap" ? `Week ${m.week}` : `Period ${m.week}`}
                  </span>
                  <span className="font-mono">
                    {mode === "codeComplexity" || mode === "riskScore" ? `${m.target}/100` : mode === "serverCapacity" ? `${m.target} RPS` : mode === "complianceGap" ? `${m.target} controls` : `₹${m.target.toLocaleString("en-IN")}`}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          {result.scenarios?.length ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Scenarios</p>
              <ScenarioCards scenarios={result.scenarios} valueFormat={mode === "serverCapacity" || mode === "vulnImpact" ? "score" : "currency"} />
            </div>
          ) : null}
        </>
      )}
    </CalculatorShell>
  );
}
