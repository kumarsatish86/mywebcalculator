export function compoundFutureValue(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear: number;
}): { futureValue: number; interestEarned: number } | { error: string } {
  const { principal, annualRatePercent, years, compoundsPerYear } = input;
  if (principal < 0) return { error: "Principal cannot be negative." };
  if (years < 0) return { error: "Years cannot be negative." };
  if (compoundsPerYear < 1) return { error: "Compounds per year must be at least 1." };
  const n = compoundsPerYear;
  const r = annualRatePercent / 100;
  const futureValue = principal * (1 + r / n) ** (n * years);
  return { futureValue, interestEarned: futureValue - principal };
}
