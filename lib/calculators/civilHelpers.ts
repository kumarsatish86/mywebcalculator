/** Shared civil estimation helpers — study/estimation only. */

export const CIVIL_URL = {
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
} as const;

export function parseCivilSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CIVIL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export { parseCivilSearchParams as parseCivilConcreteSearchParams };
export { parseCivilSearchParams as parseCivilBrickworkSearchParams };
export { parseCivilSearchParams as parseCivilAreaVolumeSearchParams };
export { parseCivilSearchParams as parseCivilSteelSearchParams };
export { parseCivilSearchParams as parseCivilPlasteringSearchParams };
export { parseCivilSearchParams as parseCivilFoundationSearchParams };
export { parseCivilSearchParams as parseCivilRoadSearchParams };
export { parseCivilSearchParams as parseCivilWaterSearchParams };
export { parseCivilSearchParams as parseCivilEstimationSearchParams };
export { parseCivilSearchParams as parseCivilSurveyingSearchParams };
export { parseCivilSearchParams as parseCivilAdvancedSearchParams };

export function pos(n: number, label: string): number | { error: string } {
  if (!Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}
