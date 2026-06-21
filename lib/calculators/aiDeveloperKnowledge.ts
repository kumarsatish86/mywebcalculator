export const COMPLEXITY_BENCHMARKS = { ccMax: 10, nestMax: 4, locPerFn: 50, coverageMin: 70 };

export const API_BENCHMARKS = { costPer1kGood: 0.5, cacheHitTarget: 40, batchSave: 0.25 };

export const CLOUD_BENCHMARKS = { computeRate: 0.04, storageRate: 0.023, egressRate: 0.09, reservedSave: 0.35 };

export const CAPACITY_BENCHMARKS = { cpuTarget: 65, memTarget: 75, latencyP95: 200, headroomMin: 25 };

export const RISK_WEIGHTS = { criticalVuln: 8, patchLag: 0.15, mfaGap: 0.4, backupGap: 5 };

export const COMPLIANCE_DOMAINS = [
  { id: "access", label: "Access control & IAM", weight: 0.18 },
  { id: "data", label: "Data protection & encryption", weight: 0.16 },
  { id: "logging", label: "Logging & monitoring", weight: 0.14 },
  { id: "incident", label: "Incident response", weight: 0.12 },
  { id: "vendor", label: "Vendor & third-party risk", weight: 0.12 },
  { id: "change", label: "Change management", weight: 0.1 },
  { id: "backup", label: "Backup & recovery", weight: 0.1 },
  { id: "training", label: "Security awareness training", weight: 0.08 },
];

export const REFACTOR_STEPS = [
  "Extract functions over 40 LOC — single responsibility per unit.",
  "Reduce nesting: early returns beat deep if/else chains.",
  "Add characterization tests before refactoring hot paths.",
  "Track cyclomatic complexity in CI — fail builds above threshold.",
];

export const API_OPTIMIZE_STEPS = [
  "Cache idempotent reads — target 40%+ cache hit rate.",
  "Batch requests and compress payloads on high-volume endpoints.",
  "Use smaller models for classification; reserve large models for synthesis.",
  "Set per-user rate limits and token budgets to cap runaway spend.",
];

export const CLOUD_OPTIMIZE_PHASES = [
  { phase: "Rightsize (wk 1–2)", focus: "Downsize over-provisioned instances; enable autoscaling" },
  { phase: "Reserved capacity (wk 3–4)", focus: "1-year reserved for steady baseline load" },
  { phase: "Storage tiering (wk 5–8)", focus: "Move cold data to infrequent-access tiers" },
  { phase: "Egress audit (wk 9–12)", focus: "CDN + regional endpoints to cut transfer" },
];

export const SECURITY_BUDGET_ALLOC = [
  { category: "Identity & access", pct: 22 },
  { category: "Detection & response", pct: 20 },
  { category: "Vulnerability management", pct: 18 },
  { category: "Compliance & GRC", pct: 15 },
  { category: "Training & awareness", pct: 10 },
  { category: "Backup & recovery", pct: 15 },
];

export const VULN_FIX_STEPS = [
  "Patch internet-facing assets within 24–72h for CVSS ≥ 7.",
  "Isolate affected systems if active exploitation detected.",
  "Verify fix in staging; roll out with canary deployment.",
  "Post-incident: update runbooks and detection rules.",
];
