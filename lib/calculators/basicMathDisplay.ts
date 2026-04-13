/** Human-friendly number display for basic math results (avoid ugly toPrecision / scientific for classroom ranges). */

export function formatNumForDisplay(n: number, maxDecimals = 12): string {
  if (!Number.isFinite(n)) return "—";
  if (Object.is(n, -0)) return "0";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
    return n.toPrecision(10).replace(/\.?0+e/, "e");
  }
  const s = n.toFixed(maxDecimals);
  return s.replace(/\.?0+$/, "").replace(/^-0$/, "0");
}

/** Percentage result: no trailing scientific for typical values. */
export function formatPercentForDisplay(n: number): string {
  return `${formatNumForDisplay(n, 10)}%`;
}
