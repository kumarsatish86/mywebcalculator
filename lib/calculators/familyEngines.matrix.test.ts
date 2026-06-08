import { describe, expect, it } from "vitest";
import { FAMILY_SLUG_SETS } from "@/lib/registry";
import { computeBodyMetric } from "./health/bodyMetricsEngine";
import { computeEduMath } from "./edu-math/eduMathEngine";
import { computeElectrical } from "./engineering/electricalEngine";

const bodyPayload: Record<string, unknown> = {
  sex: "male",
  weightKg: 72,
  heightCm: 178,
  ageYears: 34,
  waistCm: 86,
  neckCm: 37,
  hipCm: 98,
};

/** Wide math payload so many branches receive numeric context without throwing. */
const mathPayload: Record<string, unknown> = {
  n: 17,
  a: 1,
  b: -5,
  c: 6,
  x: 2,
  y: 3,
  z: 4,
  list: "12,18,24",
  nums: "3,9,15",
  op: "gcd",
  mode: "prime",
  roman: "XIV",
  digits: "1010",
  fromBase: "16",
  shape: "rect",
  m: 3,
  count: 5,
  k: 7,
  an: 1,
  ad: 2,
  dec: "0.375",
  maxDenom: 1000,
  x2: 0,
  y2: 1,
  c0: 1,
  c1: -3,
  c2: 2,
  c3: 0,
  a11: 1,
  a12: 2,
  a21: 3,
  a22: 4,
  b11: 1,
  b12: 0,
  b21: 0,
  b22: 1,
  ax: 1,
  ay: 0,
  az: 0,
  bx: 0,
  by: 1,
  bz: 0,
  meters: 2.5,
  favorable: 6,
  total: 10,
  mu: 10,
  sigma: 2,
};

const electricalPayload: Record<string, unknown> = {
  V: 230,
  I: 10,
  R: 23,
  P: 2300,
  Pkw: 2.5,
  hours: 120,
  PF: 0.92,
  kVA: 5,
  hp: 3,
  kW: 2.2,
  kWreal: 2,
  Vll: 415,
  Vln: 230,
  kWh: 350,
  tariff: 0.18,
  Sva: 2500,
  X: 0.12,
  L: 0.05,
  C: 1e-4,
  f: 50,
  freqValue: 50,
  freqUnit: "Hz",
  lengthM: 25,
  areaMm2: 10,
  rhoOhmM: 50,
  rodLengthM: 3,
  P1: 800,
  P2: 900,
  P3: 850,
  Ah: 100,
  Vnom: 12,
  surgeFactor: 1.2,
  panelW: 400,
  numPanels: 8,
  kwhPerDay: 18,
  sunHours: 4.5,
  efficiency: 0.19,
  areaM2: 25,
  systemCost: 9000,
  annualSavings: 1100,
  Iline: 15,
  awg: 12,
  numWires: 3,
  wireDiaMm: 2.05,
  RperM: 0.008,
  targetR: 0.5,
  Pin: 1200,
  Pout: 1080,
  fSupply: 50,
  poles: 4,
  slipPct: 3,
  ns: 1500,
  nr: 1455,
  loadW: 2000,
  marginPct: 20,
  individualSum: 40,
  simultaneous: 28,
  connected: 50,
  demand: 35,
  Ztotal: 0.12,
  Iload: 32,
  I1: 10,
  I3: 1.2,
  hoursDay: 6,
  connectedKw: 50,
  demandKw: 35,
  energyKwh: 120,
  Ia: 10,
  Ib: 12,
  Ic: 9,
  Vpri: 230,
  Ipri: 15,
  Np: 800,
  Ns: 40,
  litersPerKwh: 0.28,
};

describe("family engine matrix (no throw, structured result)", () => {
  it("covers education math planned slugs", () => {
    for (const slug of FAMILY_SLUG_SETS.educationMathPlanned) {
      const r = computeEduMath(slug, mathPayload);
      expect(r, slug).toBeTruthy();
      expect(r.error !== undefined || r.lines.length > 0, slug).toBe(true);
    }
  });

  it("covers health body slugs", () => {
    for (const slug of FAMILY_SLUG_SETS.healthBody) {
      const r = computeBodyMetric(slug, bodyPayload);
      expect(r, slug).toBeTruthy();
      expect(r.error !== undefined || r.lines.length > 0, slug).toBe(true);
    }
  });

  it("covers electrical slugs", () => {
    for (const slug of FAMILY_SLUG_SETS.electrical) {
      const r = computeElectrical(slug, electricalPayload);
      expect(r, slug).toBeTruthy();
      expect(r.error !== undefined || r.lines.length > 0, slug).toBe(true);
    }
  });
});
