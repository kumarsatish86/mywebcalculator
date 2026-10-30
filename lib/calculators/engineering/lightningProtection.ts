/**
 * Lightning protection teaching estimates — not code approval / design software.
 */

export type LpsStandardId = "iec62305" | "nfpa780" | "is2309" | "bsen62305";
export type LpsClass = "I" | "II" | "III" | "IV";
export type BuildingPresetId =
  | "residential"
  | "commercial"
  | "warehouse"
  | "factory"
  | "telecom"
  | "hospital";

export type LpsRiskLevel = "LOW" | "MODERATE" | "SIGNIFICANT" | "HIGH" | "CRITICAL";

export type LpsStandard = {
  id: LpsStandardId;
  label: string;
  note: string;
  angleDegByClass: Record<LpsClass, number>;
  sphereRadiusMByClass: Record<LpsClass, number>;
  recommendationLead: string;
};

export const LPS_STANDARDS: Record<LpsStandardId, LpsStandard> = {
  iec62305: {
    id: "iec62305",
    label: "IEC 62305",
    note: "IEC 62305 frames risk management and LPS classes. This tool uses simplified cone / sphere teaching models only.",
    angleDegByClass: { I: 20, II: 30, III: 45, IV: 55 },
    sphereRadiusMByClass: { I: 20, II: 30, III: 45, IV: 60 },
    recommendationLead: "Per IEC-style class thinking (educational)",
  },
  nfpa780: {
    id: "nfpa780",
    label: "NFPA 780",
    note: "NFPA 780 covers installation of LPS. Angles/sphere values here are study defaults, not a substitute for the standard.",
    angleDegByClass: { I: 25, II: 35, III: 45, IV: 55 },
    sphereRadiusMByClass: { I: 23, II: 30, III: 46, IV: 61 },
    recommendationLead: "Aligned with NFPA-oriented study defaults",
  },
  is2309: {
    id: "is2309",
    label: "IS 2309",
    note: "IS 2309 (India) protection of buildings against lightning — verify current edition with a licensed engineer.",
    angleDegByClass: { I: 30, II: 45, III: 45, IV: 60 },
    sphereRadiusMByClass: { I: 20, II: 30, III: 45, IV: 60 },
    recommendationLead: "IS 2309-oriented study defaults",
  },
  bsen62305: {
    id: "bsen62305",
    label: "BS EN 62305",
    note: "BS EN 62305 mirrors IEC 62305 in the UK/EU context. Teaching approximations only.",
    angleDegByClass: { I: 20, II: 30, III: 45, IV: 55 },
    sphereRadiusMByClass: { I: 20, II: 30, III: 45, IV: 60 },
    recommendationLead: "BS EN 62305-oriented study defaults",
  },
};

export type BuildingPreset = {
  id: BuildingPresetId;
  label: string;
  heightM: number;
  lengthM: number;
  widthM: number;
  soilOhmM: number;
  rodLengthM: number;
  lpsClass: LpsClass;
  airTerminators: number;
};

export const BUILDING_PRESETS: Record<BuildingPresetId, BuildingPreset> = {
  residential: {
    id: "residential",
    label: "Residential",
    heightM: 12,
    lengthM: 15,
    widthM: 10,
    soilOhmM: 100,
    rodLengthM: 3,
    lpsClass: "III",
    airTerminators: 1,
  },
  commercial: {
    id: "commercial",
    label: "Commercial",
    heightM: 25,
    lengthM: 40,
    widthM: 25,
    soilOhmM: 80,
    rodLengthM: 3,
    lpsClass: "II",
    airTerminators: 2,
  },
  warehouse: {
    id: "warehouse",
    label: "Warehouse",
    heightM: 18,
    lengthM: 60,
    widthM: 40,
    soilOhmM: 120,
    rodLengthM: 3,
    lpsClass: "III",
    airTerminators: 3,
  },
  factory: {
    id: "factory",
    label: "Factory",
    heightM: 22,
    lengthM: 80,
    widthM: 50,
    soilOhmM: 90,
    rodLengthM: 4,
    lpsClass: "II",
    airTerminators: 4,
  },
  telecom: {
    id: "telecom",
    label: "Telecom Tower",
    heightM: 45,
    lengthM: 8,
    widthM: 8,
    soilOhmM: 150,
    rodLengthM: 6,
    lpsClass: "I",
    airTerminators: 1,
  },
  hospital: {
    id: "hospital",
    label: "Hospital",
    heightM: 30,
    lengthM: 50,
    widthM: 35,
    soilOhmM: 70,
    rodLengthM: 4,
    lpsClass: "I",
    airTerminators: 3,
  },
};

/** Study benchmarks (not code limits). */
export const LPS_BENCHMARKS = {
  coverageTarget: 0.95,
  groundingMaxOhm: 5,
};

/** Indicative INR unit rates for teaching cost bands. */
const COST_INR = {
  airTerminal: 4500,
  groundRod: 3200,
  copperPerM: 850,
};

export type CalcStep = { title: string; detail: string };
export type CoachTip = { prompt: string; reply: string };

export type EngineeringNote = {
  observation: string;
  impact: string;
  recommendation: string;
};

export type DecisionOptionId = "raise_height" | "add_air" | "widen_angle";

export type DecisionOption = {
  id: DecisionOptionId;
  label: string;
  action: string;
  coverageDeltaPct: number;
  riskAfter: LpsRiskLevel;
  expectedBlurb: string;
  /** Patch applied when user clicks the option */
  patch: Partial<{
    heightM: number;
    airTerminators: number;
    protectiveAngleDeg: number;
  }>;
};

export type CostEstimate = {
  airTerminals: number;
  groundRods: number;
  copperM: number;
  totalInr: number;
  note: string;
};

export type LightningInput = {
  standardId: LpsStandardId;
  buildingId: BuildingPresetId;
  heightM: number;
  lengthM: number;
  widthM: number;
  lpsClass: LpsClass;
  protectiveAngleDeg?: number;
  soilOhmM: number;
  rodLengthM: number;
  airTerminators: number;
  sphereRadiusM?: number;
  collectionFactor?: number;
  inputCompleteness?: number;
};

export type LightningResult = {
  protectionRadiusM: number;
  sphereHorizontalM: number;
  halfDiagonalM: number;
  coversFootprint: boolean;
  coverageRatio: number;
  coveragePct: number;
  groundingOhm: number;
  suggestedDownConductors: number;
  suggestedRods: number;
  airTerminalsNeeded: number;
  risk: LpsRiskLevel;
  /** Legacy 3-tone for SmartResultPanel compatibility */
  statusTone: "good" | "warn" | "bad" | "neutral";
  statusLabel: string;
  protectionLabel: string;
  groundingLabel: string;
  angleDeg: number;
  sphereRadiusM: number;
  safetyScore: number;
  compliance: "PASS" | "REVIEW";
  steps: CalcStep[];
  recommendations: string[];
  relatedSlugs: { slug: string; reason: string }[];
  chartHeightVsRadius: { heightM: number; radiusM: number }[];
  confidencePct: number;
  calcConfidencePct: number;
  coachTips: CoachTip[];
  decisionOptions: DecisionOption[];
  cost: CostEstimate;
  engineeringNotes: EngineeringNote[];
  benchmarks: {
    coverageTarget: number;
    coverageYou: number;
    groundingMaxOhm: number;
    groundingYou: number;
  };
  summary: {
    building: string;
    heightM: number;
    risk: string;
    protection: string;
    grounding: string;
    standard: string;
    safetyScore: number;
    costInr: number;
    coverageRatio: number;
  };
  standardNote: string;
  disclaimer: string;
};

function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

function fmt(n: number, d = 1): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function rollingSphereHorizontal(h: number, R: number): number {
  if (h <= 0 || R <= 0) return 0;
  if (h >= 2 * R) return 0;
  return Math.sqrt(Math.max(0, h * (2 * R - h)));
}

function coreMetrics(input: LightningInput) {
  const std = LPS_STANDARDS[input.standardId];
  const angleDeg = input.protectiveAngleDeg ?? std.angleDegByClass[input.lpsClass];
  const sphereR = input.sphereRadiusM ?? std.sphereRadiusMByClass[input.lpsClass];
  const angleRad = degToRad(angleDeg);
  const protectionRadiusM = input.heightM * Math.tan(angleRad);
  const sphereHorizontalM = rollingSphereHorizontal(input.heightM, sphereR);
  const halfDiagonalM = 0.5 * Math.hypot(input.lengthM, input.widthM);
  const effectiveRadius = Math.max(protectionRadiusM, sphereHorizontalM * 0.85);
  const coverageRatio = halfDiagonalM > 0 ? effectiveRadius / halfDiagonalM : 0;
  const groundingOhm = input.soilOhmM / (2 * Math.PI * input.rodLengthM);
  return {
    std,
    angleDeg,
    sphereR,
    protectionRadiusM,
    sphereHorizontalM,
    halfDiagonalM,
    effectiveRadius,
    coverageRatio,
    groundingOhm,
  };
}

export function deriveRiskLevel(
  coverageRatio: number,
  groundingOhm: number,
  heightM: number,
): LpsRiskLevel {
  if (coverageRatio < 0.55 || groundingOhm > 40 || heightM > 60) return "CRITICAL";
  if (coverageRatio < 0.75 || groundingOhm > 25 || heightM > 50) return "HIGH";
  if (coverageRatio < 0.9 || groundingOhm > 12 || heightM > 35) return "SIGNIFICANT";
  if (coverageRatio < 1 || groundingOhm > 5 || heightM > 28) return "MODERATE";
  return "LOW";
}

export function riskToStatusTone(risk: LpsRiskLevel): LightningResult["statusTone"] {
  if (risk === "LOW") return "good";
  if (risk === "MODERATE") return "neutral";
  if (risk === "SIGNIFICANT") return "warn";
  return "bad";
}

function safetyScoreFrom(coverageRatio: number, groundingOhm: number, heightM: number): number {
  const cov = clamp(coverageRatio, 0, 1.2) / 1.2;
  const gnd = 1 - clamp(groundingOhm / 40, 0, 1);
  const hOk = 1 - clamp((heightM - 10) / 60, 0, 1);
  return Math.round(clamp(cov * 45 + gnd * 35 + hOk * 20, 0, 100));
}

export function computeLightningProtection(input: LightningInput): LightningResult | { error: string } {
  if (input.heightM <= 0) return { error: "Building height must be positive." };
  if (input.lengthM <= 0 || input.widthM <= 0) return { error: "Footprint length and width must be positive." };
  if (input.rodLengthM <= 0) return { error: "Rod length must be positive." };
  if (input.soilOhmM <= 0) return { error: "Soil resistivity must be positive." };

  const preset = BUILDING_PRESETS[input.buildingId];
  const m = coreMetrics(input);
  const {
    std,
    angleDeg,
    sphereR,
    protectionRadiusM,
    sphereHorizontalM,
    halfDiagonalM,
    effectiveRadius,
    coverageRatio,
    groundingOhm,
  } = m;
  const coversFootprint = coverageRatio >= 1;
  const coveragePct = Math.round(coverageRatio * 100);
  const perimeter = 2 * (input.lengthM + input.widthM);
  const suggestedDownConductors = Math.max(
    input.airTerminators,
    Math.ceil(perimeter / 20),
    input.heightM > 30 ? 2 : 1,
  );
  const suggestedRods = Math.max(1, Math.ceil(suggestedDownConductors / 2), groundingOhm > 10 ? 2 : 1);
  const airTerminalsNeeded = coversFootprint
    ? 0
    : Math.max(1, Math.ceil((halfDiagonalM - effectiveRadius) / Math.max(8, protectionRadiusM * 0.25)));

  let risk = deriveRiskLevel(coverageRatio, groundingOhm, input.heightM);
  const cf = input.collectionFactor ?? 1;
  if (cf > 1.3 && risk === "LOW") risk = "MODERATE";

  const statusTone = riskToStatusTone(risk);
  const statusLabel =
    risk === "LOW"
      ? "Meets study targets"
      : risk === "MODERATE"
        ? "Acceptable with review"
        : risk === "SIGNIFICANT"
          ? "Needs improvement"
          : risk === "HIGH"
            ? "Needs design review"
            : "Critical — escalate to engineer";

  const protectionLabel = coversFootprint
    ? risk === "LOW"
      ? "Excellent"
      : "Good"
    : "Under-covered";

  let groundingLabel = "Typical study range";
  if (groundingOhm <= 5) groundingLabel = "Excellent (study)";
  else if (groundingOhm <= 10) groundingLabel = "Good (study)";
  else if (groundingOhm <= 25) groundingLabel = "Needs improvement";
  else groundingLabel = "High resistance";

  const score = safetyScoreFrom(coverageRatio, groundingOhm, input.heightM);
  const compliance: "PASS" | "REVIEW" =
    coversFootprint && groundingOhm <= 10 && risk !== "CRITICAL" && risk !== "HIGH" ? "PASS" : "REVIEW";

  const steps: CalcStep[] = [
    {
      title: "Protective angle",
      detail: `θ = ${fmt(angleDeg, 0)}° from ${std.label} class ${input.lpsClass} teaching table.`,
    },
    {
      title: "Protection radius (cone)",
      detail: `r = h × tan(θ) = ${fmt(input.heightM)} × tan(${fmt(angleDeg, 0)}°) = ${fmt(protectionRadiusM)} m`,
    },
    {
      title: "Rolling-sphere horizontal (simplified)",
      detail: `R = ${fmt(sphereR)} m → d ≈ √(h(2R−h)) = ${fmt(sphereHorizontalM)} m`,
    },
    {
      title: "Footprint half-diagonal",
      detail: `½√(L²+W²) = ${fmt(halfDiagonalM)} m`,
    },
    {
      title: "Coverage check",
      detail: `Effective radius ${fmt(effectiveRadius)} m vs half-diagonal ${fmt(halfDiagonalM)} m → ${fmt(coverageRatio, 2)} (${coversFootprint ? "covers" : "short"})`,
    },
    {
      title: "Single-rod earthing ballpark",
      detail: `R ≈ ρ / (2πL) = ${fmt(groundingOhm)} Ω`,
    },
  ];

  const recommendations: string[] = [];
  if (!coversFootprint) {
    recommendations.push("Add air-terminations or raise effective height so radius covers the footprint half-diagonal");
  }
  if (groundingOhm > 10) {
    recommendations.push("Improve earthing: longer rods, multiple rods, or lower-resistivity soil treatment");
  }
  if (suggestedDownConductors > input.airTerminators) {
    recommendations.push(`Consider ~${suggestedDownConductors} down-conductors for this perimeter/height band (heuristic)`);
  }
  if (input.heightM > 30) {
    recommendations.push("Tall structures often need mesh / rolling-sphere design by a licensed engineer");
  }
  recommendations.push(`${std.recommendationLead}: verify with the full standard and local AHJ`);

  const relatedSlugs = [
    { slug: "elec-earthing-resistance-calculator", reason: "Refine grounding resistance estimate" },
    { slug: "elec-earthing-grounding-calculator", reason: "Earthing / grounding study math" },
    { slug: "elec-cable-size-calculator", reason: "Size bonding / down-conductor paths" },
    { slug: "elec-voltage-drop-calculator", reason: "Check conductor drop on long runs" },
    { slug: "elec-short-circuit-current-calculator", reason: "Fault current context" },
  ];

  const chartHeightVsRadius: { heightM: number; radiusM: number }[] = [];
  const angleRad = degToRad(angleDeg);
  for (let h = Math.max(5, input.heightM * 0.5); h <= input.heightM * 1.5 + 1; h += Math.max(2, input.heightM * 0.1)) {
    chartHeightVsRadius.push({ heightM: Math.round(h * 10) / 10, radiusM: h * Math.tan(angleRad) });
  }

  const completeness = input.inputCompleteness ?? 0.85;
  const confidencePct = Math.round(completeness * 100);
  const calcConfidencePct = Math.round(
    Math.min(99, 70 + (coversFootprint ? 10 : 0) + (groundingOhm <= 10 ? 10 : 0) + completeness * 10),
  );

  // Option A: +2m height
  const optAHeight = input.heightM + 2;
  const optA = coreMetrics({ ...input, heightM: optAHeight });
  const optARisk = deriveRiskLevel(optA.coverageRatio, optA.groundingOhm, optAHeight);
  const optADelta = Math.round((optA.coverageRatio - coverageRatio) * 100);

  // Option B: +1 air terminal (heuristic: treat as +12% effective coverage toward 1.0)
  const optBAir = input.airTerminators + 1;
  const optBCoverage = Math.min(1.25, coverageRatio + 0.12 + (optBAir > 3 ? 0.04 : 0));
  const optBRisk = deriveRiskLevel(optBCoverage, groundingOhm, input.heightM);
  const optBDelta = Math.round((optBCoverage - coverageRatio) * 100);

  // Option C: +5° angle (capped)
  const optCAngle = Math.min(70, angleDeg + 5);
  const optC = coreMetrics({ ...input, protectiveAngleDeg: optCAngle });
  const optCRisk = deriveRiskLevel(optC.coverageRatio, optC.groundingOhm, input.heightM);
  const optCDelta = Math.round((optC.coverageRatio - coverageRatio) * 100);

  const decisionOptions: DecisionOption[] = [
    {
      id: "raise_height",
      label: "OPTION A",
      action: "Increase rod / air-termination height +2 m",
      coverageDeltaPct: optADelta,
      riskAfter: optARisk,
      expectedBlurb: `Coverage ${coveragePct}% → ~${Math.round(optA.coverageRatio * 100)}%`,
      patch: { heightM: optAHeight },
    },
    {
      id: "add_air",
      label: "OPTION B",
      action: "Add one air terminal",
      coverageDeltaPct: optBDelta,
      riskAfter: optBRisk,
      expectedBlurb: `Heuristic coverage lift ~+${optBDelta}% (multi-rod layout)`,
      patch: { airTerminators: optBAir },
    },
    {
      id: "widen_angle",
      label: "OPTION C",
      action: `Nudge protective angle to ${fmt(optCAngle, 0)}°`,
      coverageDeltaPct: optCDelta,
      riskAfter: optCRisk,
      expectedBlurb: `Only if class/standard allows — study delta ~+${optCDelta}%`,
      patch: { protectiveAngleDeg: optCAngle },
    },
  ];

  const copperM = Math.max(perimeter * 0.35, input.heightM * suggestedDownConductors * 0.4);
  const cost: CostEstimate = {
    airTerminals: Math.max(input.airTerminators, suggestedDownConductors),
    groundRods: suggestedRods,
    copperM: Math.round(copperM),
    totalInr: Math.round(
      Math.max(input.airTerminators, suggestedDownConductors) * COST_INR.airTerminal +
        suggestedRods * COST_INR.groundRod +
        copperM * COST_INR.copperPerM,
    ),
    note: "Indicative INR study band — not a quotation.",
  };

  const engineeringNotes: EngineeringNote[] = [];
  if (!coversFootprint) {
    engineeringNotes.push({
      observation: `${preset.label} footprint half-diagonal (${fmt(halfDiagonalM)} m) exceeds effective protection radius (${fmt(effectiveRadius)} m).`,
      impact: "Possible edge / corner exposure under the cone model.",
      recommendation:
        airTerminalsNeeded > 0
          ? `Increase height or add ~${airTerminalsNeeded} air terminal(s) (heuristic).`
          : "Increase air-termination height or revise LPS class with an engineer.",
    });
  }
  if (groundingOhm > LPS_BENCHMARKS.groundingMaxOhm) {
    engineeringNotes.push({
      observation: `Single-rod earthing ballpark ${fmt(groundingOhm)} Ω is above the study benchmark ${LPS_BENCHMARKS.groundingMaxOhm} Ω.`,
      impact: "Higher touch/step voltage risk in simplified models.",
      recommendation: "Lengthen rods, add rods in parallel, or open the Earthing Resistance calculator.",
    });
  }
  if (input.heightM > 30) {
    engineeringNotes.push({
      observation: "Structure height exceeds 30 m teaching threshold for cone-only estimates.",
      impact: "Rolling-sphere / mesh methods usually dominate for tall façades.",
      recommendation: "Treat this page as a sketch and commission a licensed LPS design.",
    });
  }
  if (engineeringNotes.length === 0) {
    engineeringNotes.push({
      observation: "Coverage and grounding sit within study-friendly bands for this preset.",
      impact: "Low urgency under the teaching heuristics.",
      recommendation: "Still verify against the full selected standard before construction.",
    });
  }

  const coachTips: CoachTip[] = [
    {
      prompt: "Why is my coverage low?",
      reply: `Coverage ratio is ${fmt(coverageRatio, 2)} (target study ${LPS_BENCHMARKS.coverageTarget}). ${decisionOptions[0]!.action} or ${decisionOptions[1]!.action}.`,
    },
    {
      prompt: "Why is my grounding resistance high?",
      reply: `Estimated R ≈ ${fmt(groundingOhm)} Ω with ρ=${fmt(input.soilOhmM)} Ω·m and L=${fmt(input.rodLengthM)} m. Lower ρ, lengthen rods, or add rods in parallel.`,
    },
    {
      prompt: "How do I increase protection radius?",
      reply: `r = h·tan(θ). Raise height (${fmt(input.heightM)} m now) or increase θ only if your LPS class allows.`,
    },
    {
      prompt: "Explain lightning protection",
      reply: `Air terminations intercept strike current; down-conductors take it to earth. This page estimates cone radius and single-rod R — real LPS uses full ${std.label} methods.`,
    },
  ];

  return {
    protectionRadiusM,
    sphereHorizontalM,
    halfDiagonalM,
    coversFootprint,
    coverageRatio,
    coveragePct,
    groundingOhm,
    suggestedDownConductors,
    suggestedRods,
    airTerminalsNeeded,
    risk,
    statusTone,
    statusLabel,
    protectionLabel,
    groundingLabel,
    angleDeg,
    sphereRadiusM: sphereR,
    safetyScore: score,
    compliance,
    steps,
    recommendations,
    relatedSlugs,
    chartHeightVsRadius,
    confidencePct,
    calcConfidencePct,
    coachTips,
    decisionOptions,
    cost,
    engineeringNotes,
    benchmarks: {
      coverageTarget: LPS_BENCHMARKS.coverageTarget,
      coverageYou: coverageRatio,
      groundingMaxOhm: LPS_BENCHMARKS.groundingMaxOhm,
      groundingYou: groundingOhm,
    },
    summary: {
      building: preset.label,
      heightM: input.heightM,
      risk,
      protection: protectionLabel,
      grounding: groundingLabel,
      standard: std.label,
      safetyScore: score,
      costInr: cost.totalInr,
      coverageRatio,
    },
    standardNote: std.note,
    disclaimer:
      "Educational estimation only — not a design approval, not a substitute for IEC/NFPA/IS software or a licensed professional.",
  };
}

export function heightScenarios(
  heightsM: number[],
  angleDeg: number,
): { heightM: number; radiusM: number }[] {
  const t = Math.tan(degToRad(angleDeg));
  return heightsM.map((h) => ({ heightM: h, radiusM: h * t }));
}

export const LPS_URL = {
  STD: "std",
  BLD: "bld",
  H: "h",
  L: "l",
  W: "w",
  CLS: "cls",
  ANG: "ang",
  RHO: "rho",
  ROD: "rod",
  AT: "at",
  SPH: "sph",
  MODE: "mode",
} as const;

export function parseLpsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(LPS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export const RISK_META: Record<
  LpsRiskLevel,
  { label: string; dot: string; bar: string }
> = {
  LOW: { label: "Low", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  MODERATE: { label: "Moderate", dot: "bg-yellow-400", bar: "bg-yellow-400" },
  SIGNIFICANT: { label: "Significant", dot: "bg-orange-500", bar: "bg-orange-500" },
  HIGH: { label: "High", dot: "bg-rose-500", bar: "bg-rose-500" },
  CRITICAL: { label: "Critical", dot: "bg-zinc-800 dark:bg-zinc-200", bar: "bg-zinc-700" },
};
