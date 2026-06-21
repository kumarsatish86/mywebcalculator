export const AI_DEV_URL = {
  LOC: "loc",
  CC: "cc",
  NEST: "nest",
  FN: "fn",
  COV: "cov",
  REQ: "req",
  TIN: "tin",
  TOUT: "tout",
  PRICE: "price",
  COMPUTE: "compute",
  STORAGE: "storage",
  EGRESS: "egress",
  INST: "inst",
  RPS: "rps",
  LAT: "lat",
  CPU: "cpu",
  MEM: "mem",
  HEAD: "head",
  ASSETS: "assets",
  CRIT: "crit",
  PATCH: "patch",
  MFA: "mfa",
  BACKUP: "backup",
  CVSS: "cvss",
  EXPLOIT: "exploit",
  AFFECTED: "aff",
  EXPOSURE: "exp",
  IMPL: "impl",
  TOTAL: "total",
  AUDIT: "audit",
  REV: "rev",
  SPEND: "spend",
  INCIDENTS: "inc",
  COMPLIANCE: "cmp",
  EMP: "emp",
} as const;

export function parseAiDeveloperSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_DEV_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  const fw = sp.fw;
  const fwv = Array.isArray(fw) ? fw[0] : fw;
  if (typeof fwv === "string" && fwv.trim() !== "") out.fw = fwv.trim();
  const model = sp.model;
  const mv = Array.isArray(model) ? model[0] : model;
  if (typeof mv === "string" && mv.trim() !== "") out.model = mv.trim();
  return out;
}

export type ExposureLevel = "internet" | "internal" | "airgap";
export type ComplianceFramework = "soc2" | "gdpr" | "iso27001";

export function parseExposure(raw: string): ExposureLevel {
  if (raw === "internal" || raw === "airgap") return raw;
  return "internet";
}

export function parseFramework(raw: string): ComplianceFramework {
  if (raw === "gdpr" || raw === "iso27001") return raw;
  return "soc2";
}
