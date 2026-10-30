"use client";

import type { CivilConcreteSlug } from "@/lib/calculators/civilConcrete";
import type { CivilBrickworkSlug } from "@/lib/calculators/civilBrickwork";
import type { CivilAreaVolumeSlug } from "@/lib/calculators/civilAreaVolume";
import type { CivilSteelSlug } from "@/lib/calculators/civilSteel";
import type { CivilPlasteringSlug } from "@/lib/calculators/civilPlastering";
import type { CivilFoundationSlug } from "@/lib/calculators/civilFoundation";
import type { CivilRoadSlug } from "@/lib/calculators/civilRoad";
import type { CivilWaterSlug } from "@/lib/calculators/civilWater";
import type { CivilEstimationSlug } from "@/lib/calculators/civilEstimation";
import type { CivilSurveyingSlug } from "@/lib/calculators/civilSurveying";
import type { CivilAdvancedSlug } from "@/lib/calculators/civilAdvanced";
import { CivilConcreteCalculatorHost } from "./CivilConcreteCalculatorHost";
import { CivilBrickworkCalculatorHost } from "./CivilBrickworkCalculatorHost";
import { CivilAreaVolumeCalculatorHost } from "./CivilAreaVolumeCalculatorHost";
import { CivilSteelCalculatorHost } from "./CivilSteelCalculatorHost";
import { CivilPlasteringCalculatorHost } from "./CivilPlasteringCalculatorHost";
import { CivilFoundationCalculatorHost } from "./CivilFoundationCalculatorHost";
import { CivilRoadCalculatorHost } from "./CivilRoadCalculatorHost";
import { CivilWaterCalculatorHost } from "./CivilWaterCalculatorHost";
import { CivilEstimationCalculatorHost } from "./CivilEstimationCalculatorHost";
import { CivilSurveyingCalculatorHost } from "./CivilSurveyingCalculatorHost";
import { CivilAdvancedCalculatorHost } from "./CivilAdvancedCalculatorHost";

const CONCRETE = new Set<string>([
  "civil-concrete-volume-calculator",
  "civil-concrete-mix-ratio-calculator",
  "civil-cement-calculator",
  "civil-sand-calculator",
  "civil-aggregate-calculator",
  "civil-cement-bags-calculator",
  "civil-dry-to-wet-volume-calculator",
  "civil-ready-mix-concrete-rmc-calculator",
  "civil-concrete-cost-calculator",
  "civil-concrete-strength-estimator",
] satisfies CivilConcreteSlug[]);

const BRICKWORK = new Set<string>([
  "civil-brick-calculator",
  "civil-number-of-bricks-calculator",
  "civil-mortar-brickwork-calculator",
  "civil-brick-wall-volume-calculator",
  "civil-brick-bond-calculator",
  "civil-block-calculator-aac-concrete",
  "civil-plaster-brick-wall-calculator",
] satisfies CivilBrickworkSlug[]);

const AREA = new Set<string>([
  "civil-area-calculator-shapes",
  "civil-volume-calculator",
  "civil-perimeter-calculator",
  "civil-floor-area-calculator",
  "civil-built-up-area-calculator",
  "civil-carpet-area-calculator",
  "civil-plot-area-calculator",
  "civil-excavation-volume-calculator",
] satisfies CivilAreaVolumeSlug[]);

const STEEL = new Set<string>([
  "civil-steel-weight-calculator",
  "civil-rebar-calculator",
  "civil-steel-quantity-estimator",
  "civil-reinforcement-bar-calculator",
  "civil-bbs-bar-bending-schedule-calculator",
  "civil-steel-cost-calculator",
  "civil-lap-length-calculator",
  "civil-development-length-calculator",
] satisfies CivilSteelSlug[]);

const PLASTER = new Set<string>([
  "civil-plastering-calculator",
  "civil-wall-plaster-calculator",
  "civil-ceiling-plaster-calculator",
  "civil-paint-quantity-calculator",
  "civil-tile-calculator",
  "civil-flooring-material-calculator",
  "civil-putty-calculator",
] satisfies CivilPlasteringSlug[]);

const FOUNDATION = new Set<string>([
  "civil-footing-calculator",
  "civil-foundation-volume-calculator",
  "civil-column-calculator",
  "civil-beam-calculator",
  "civil-slab-calculator",
  "civil-load-calculation-basic",
  "civil-structural-weight-calculator",
  "civil-pile-foundation-calculator",
] satisfies CivilFoundationSlug[]);

const ROAD = new Set<string>([
  "civil-road-construction-calculator",
  "civil-asphalt-calculator",
  "civil-bitumen-quantity-calculator",
  "civil-road-base-material-calculator",
  "civil-pavement-thickness-calculator",
  "civil-road-cost-calculator",
] satisfies CivilRoadSlug[]);

const WATER = new Set<string>([
  "civil-water-tank-volume-calculator",
  "civil-pipe-volume-calculator",
  "civil-flow-rate-calculator-civil",
  "civil-drainage-calculator",
  "civil-rainwater-harvesting-calculator",
  "civil-plumbing-material-calculator",
] satisfies CivilWaterSlug[]);

const ESTIMATION = new Set<string>([
  "civil-construction-cost-calculator",
  "civil-house-construction-cost-calculator",
  "civil-material-cost-estimator",
  "civil-labor-cost-calculator",
  "civil-project-cost-calculator",
  "civil-boq-bill-of-quantity-calculator",
  "civil-rate-analysis-calculator",
] satisfies CivilEstimationSlug[]);

const SURVEY = new Set<string>([
  "civil-leveling-calculator",
  "civil-elevation-calculator",
  "civil-slope-calculator-civil",
  "civil-land-survey-calculator",
  "civil-cut-fill-calculator",
] satisfies CivilSurveyingSlug[]);

const ADVANCED = new Set<string>([
  "civil-earthwork-calculator",
  "civil-retaining-wall-calculator",
  "civil-staircase-calculator",
  "civil-formwork-calculator",
  "civil-shuttering-calculator",
  "civil-scaffolding-calculator",
  "civil-wind-load-calculator",
  "civil-seismic-load-calculator",
  "civil-bearing-capacity-calculator",
  "civil-soil-compaction-calculator",
] satisfies CivilAdvancedSlug[]);

export function CivilCalculatorRouter({ slug }: { slug: string }) {
  if (CONCRETE.has(slug)) return <CivilConcreteCalculatorHost slug={slug} />;
  if (BRICKWORK.has(slug)) return <CivilBrickworkCalculatorHost slug={slug} />;
  if (AREA.has(slug)) return <CivilAreaVolumeCalculatorHost slug={slug} />;
  if (STEEL.has(slug)) return <CivilSteelCalculatorHost slug={slug} />;
  if (PLASTER.has(slug)) return <CivilPlasteringCalculatorHost slug={slug} />;
  if (FOUNDATION.has(slug)) return <CivilFoundationCalculatorHost slug={slug} />;
  if (ROAD.has(slug)) return <CivilRoadCalculatorHost slug={slug} />;
  if (WATER.has(slug)) return <CivilWaterCalculatorHost slug={slug} />;
  if (ESTIMATION.has(slug)) return <CivilEstimationCalculatorHost slug={slug} />;
  if (SURVEY.has(slug)) return <CivilSurveyingCalculatorHost slug={slug} />;
  if (ADVANCED.has(slug)) return <CivilAdvancedCalculatorHost slug={slug} />;
  return <CivilConcreteCalculatorHost slug={slug} />;
}
