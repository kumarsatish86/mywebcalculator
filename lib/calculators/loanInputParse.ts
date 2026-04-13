export type ParseOk<T> = { ok: true; value: T };
export type ParseErr = { ok: false; error: string };
export type ParseResult<T> = ParseOk<T> | ParseErr;

const NON_FINITE = "Enter a valid number.";
const POSITIVE = "Must be a positive number.";
const NON_NEGATIVE = "Must be zero or greater.";

export function parseFiniteNumber(raw: string, label: string): ParseResult<number> {
  const t = raw.trim();
  if (t === "") return { ok: false, error: `${label}: required.` };
  const n = Number(t);
  if (!Number.isFinite(n)) return { ok: false, error: `${label}: ${NON_FINITE}` };
  return { ok: true, value: n };
}

export function parsePositive(raw: string, label: string): ParseResult<number> {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  if (p.value <= 0) return { ok: false, error: `${label}: ${POSITIVE}` };
  return p;
}

export function parseNonNegative(raw: string, label: string): ParseResult<number> {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  if (p.value < 0) return { ok: false, error: `${label}: ${NON_NEGATIVE}` };
  return p;
}

/** APR or any percentage; allows 0. */
export function parseAprPercent(raw: string, label: string): ParseResult<number> {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  if (p.value < 0) return { ok: false, error: `${label}: cannot be negative.` };
  if (p.value > 200) return { ok: false, error: `${label}: unrealistically high; check the value.` };
  return p;
}

export type TermMode = "years" | "months";

export function parseTermToMonths(raw: string, mode: TermMode, label: string): ParseResult<number> {
  const p = parsePositive(raw, label);
  if (!p.ok) return p;
  const n = mode === "years" ? Math.round(p.value * 12) : Math.round(p.value);
  if (n < 1) return { ok: false, error: "Term must be at least one month." };
  if (n > 600) return { ok: false, error: "Term exceeds 600 months (50 years); enter a shorter loan." };
  return { ok: true, value: n };
}

export function termMonthsHint(mode: TermMode, raw: string): string | null {
  const p = parsePositive(raw, "Term");
  if (!p.ok) return null;
  if (mode === "years") {
    const n = Math.round(p.value * 12);
    return `= ${n} monthly payments (rounded from years × 12).`;
  }
  const y = (p.value / 12).toFixed(2);
  return `≈ ${y} years (${p.value} months).`;
}
