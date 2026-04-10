/** Common rule-of-thumb mapping (not medical). */
export function humanToCatYears(humanYears: number): number {
  if (humanYears <= 0) return 0;
  if (humanYears <= 1) return 15 * humanYears;
  if (humanYears <= 2) return 15 + 9 * (humanYears - 1);
  return 24 + 4 * (humanYears - 2);
}
