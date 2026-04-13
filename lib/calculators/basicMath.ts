import { evalExpressionFromString, type AngleMode } from "@/lib/calculators/mathExpressionAst";

/** Parse comma- or whitespace-separated numbers for sum / mean / median / mode. */
export function parseNumberList(raw: string): { ok: true; values: number[] } | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") return { ok: false, error: "Enter at least one number." };
  const parts = t.split(/[\s,;]+/).filter(Boolean);
  const values: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isFinite(n)) return { ok: false, error: `Not a valid number: "${p}"` };
    values.push(n);
  }
  if (values.length === 0) return { ok: false, error: "Enter at least one number." };
  return { ok: true, values };
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function simplifyRatioPart(a: number, b: number): { a: number; b: number } | { error: string } {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return { error: "Enter valid numbers." };
  if (a === 0 && b === 0) return { error: "Both parts cannot be zero." };
  const ai = Math.round(a);
  const bi = Math.round(b);
  if (Math.abs(a - ai) > 1e-9 || Math.abs(b - bi) > 1e-9) {
    return { error: "Use whole numbers for ratio simplification, or round your entries." };
  }
  const g = gcd(ai, bi);
  return { a: ai / g, b: bi / g };
}

const RATIO_SCALE_EPS = 1e-6;

/** If decimals scale to integers by ×10^k for small k, return that pair for UI hints. */
export function suggestScaledIntegersForRatio(a: number, b: number): { ai: number; bi: number; factor: number } | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (a === 0 && b === 0) return null;
  for (let k = 1; k <= 8; k++) {
    const f = 10 ** k;
    const sa = a * f;
    const sb = b * f;
    const ai = Math.round(sa);
    const bi = Math.round(sb);
    if (Math.abs(sa - ai) <= RATIO_SCALE_EPS && Math.abs(sb - bi) <= RATIO_SCALE_EPS) {
      if (ai === 0 && bi === 0) continue;
      return { ai, bi, factor: f };
    }
  }
  return null;
}

export type RoundingMode = "nearest" | "up" | "down" | "toward_zero" | "banker";

/** Half to even at the rounding digit (IEEE-style tie-breaking). */
function roundHalfEvenScaled(scaled: number): number {
  const sign = Math.sign(scaled) || 1;
  const ax = Math.abs(scaled);
  const f = Math.floor(ax + 1e-12);
  const frac = ax - f;
  if (frac < 0.5 - 1e-12) return sign * f;
  if (frac > 0.5 + 1e-12) return sign * (f + 1);
  const low = f;
  const high = f + 1;
  const pick = low % 2 === 0 ? low : high;
  return sign * pick;
}

export function roundTo(value: number, decimals: number, mode: RoundingMode): number {
  const d = Math.max(0, Math.min(20, Math.floor(decimals)));
  const f = 10 ** d;
  const scaled = value * f;
  let r: number;
  switch (mode) {
    case "up":
      r = Math.ceil(scaled - 1e-12 * Math.sign(scaled));
      break;
    case "down":
      r = Math.floor(scaled + 1e-12 * Math.sign(scaled));
      break;
    case "toward_zero":
      r = scaled >= 0 ? Math.floor(scaled + 1e-12) : Math.ceil(scaled - 1e-12);
      break;
    case "banker":
      r = roundHalfEvenScaled(scaled);
      break;
    default:
      r = Math.round(scaled);
  }
  return r / f;
}

export function medianSorted(sorted: number[]): number {
  const n = sorted.length;
  if (n % 2 === 1) return sorted[(n - 1) / 2]!;
  return (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2;
}

export function modesOf(values: number[]): number[] {
  const freq = new Map<number, number>();
  for (const v of values) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  let max = 0;
  for (const c of freq.values()) max = Math.max(max, c);
  if (max <= 1 && values.length > 1) return [];
  const out: number[] = [];
  for (const [k, c] of freq) {
    if (c === max) out.push(k);
  }
  out.sort((a, b) => a - b);
  return out;
}

export type { AngleMode };

/** Safe math expression: + - * / ^, parentheses, unary -, pi, e, sqrt sin cos tan log ln abs. */
export function evalMathExpression(
  src: string,
  opts?: { angleMode?: AngleMode },
): { ok: true; value: number } | { ok: false; error: string } {
  return evalExpressionFromString(src, opts);
}
