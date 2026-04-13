/** Half-up style currency cent rounding (2 decimal places). */
export function roundCurrency(x: number): number {
  if (!Number.isFinite(x)) return x;
  return Math.round(x * 100) / 100;
}
