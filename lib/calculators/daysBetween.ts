function startOfUtcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function daysBetweenDates(a: Date, b: Date): {
  days: number;
  weeks: number;
  monthsApprox: number;
} {
  const ms = Math.abs(startOfUtcDay(b) - startOfUtcDay(a));
  const days = Math.round(ms / 86400000);
  const weeks = days / 7;
  const monthsApprox = days / 30.437;
  return { days, weeks, monthsApprox };
}
