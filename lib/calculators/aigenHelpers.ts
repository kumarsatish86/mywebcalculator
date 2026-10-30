/** Shared AI template-generator helpers — in-browser drafts, not live LLMs. */

export const AIGEN_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  L: "l",
  W: "w",
  H: "h",
  D: "d",
  N: "n",
  P: "p",
  Q: "q",
  M: "m",
  V: "v",
  S: "s",
} as const;

export function parseAigenSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AIGEN_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function pos(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function nonNeg(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n < 0) return { error: `${label} must be ≥ 0.` };
  return n;
}

export function finite(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n)) return { error: `${label} must be a finite number.` };
  return n;
}

export const AIGEN_DISCLAIMER =
  "Draft for inspiration only. Verify before use. Not professional, medical, or legal advice.";

export type AigenInput = {
  topic?: string;
  tone?: string;
  audience?: string;
  days?: number;
  budget?: number;
  amount?: number;
  amount2?: number;
  rate?: number;
  count?: number;
  length?: number;
  weight?: number;
  hours?: number;
  seed?: string;
  notes?: string;
  style?: string;
  level?: string;
  goal?: string;
};

export type AigenOkResult = {
  ok: true;
  draft: string;
  lines?: string[];
  score?: number;
  primary?: number;
  note: string;
};

export type AigenResult = { ok: false; error: string } | AigenOkResult;

export function str(v: string | undefined, fallback: string): string {
  const t = (v ?? "").trim();
  return t || fallback;
}

export function numOr(v: number | undefined, fallback: number): number {
  return v !== undefined && Number.isFinite(v) ? v : fallback;
}

export function draftOk(
  lines: string[],
  opts?: { score?: number; primary?: number; note?: string },
): AigenOkResult {
  const clean = lines.map((l) => l.trimEnd()).filter((l) => l.length > 0);
  return {
    ok: true,
    draft: clean.join("\n"),
    lines: clean,
    score: opts?.score,
    primary: opts?.primary,
    note: opts?.note ?? AIGEN_DISCLAIMER,
  };
}

export function draftFail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/** Deterministic 32-bit hash for seed-based pseudo-random generators. */
export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRand(seed: string): () => number {
  let state = hashSeed(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function money(n: number, dec = 0): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: dec, minimumFractionDigits: dec });
}
