import { describe, expect, it } from "vitest";
import { computeCivilConcrete } from "./civilConcrete";
import { computeCivilBrickwork } from "./civilBrickwork";
import { computeCivilAreaVolume } from "./civilAreaVolume";
import { computeCivilSteel } from "./civilSteel";
import { computeCivilPlastering } from "./civilPlastering";
import { computeCivilFoundation } from "./civilFoundation";
import { computeCivilRoad } from "./civilRoad";
import { computeCivilWater } from "./civilWater";
import { computeCivilEstimation } from "./civilEstimation";
import { computeCivilSurveying } from "./civilSurveying";
import { computeCivilAdvanced } from "./civilAdvanced";

describe("civil engines smoke", () => {
  it("concrete volume", () => {
    const r = computeCivilConcrete("civil-concrete-volume-calculator", {
      lengthM: 10,
      widthM: 5,
      depthM: 0.15,
      wastePct: 0,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.volumeM3).toBeCloseTo(7.5);
  });

  it("bricks", () => {
    const r = computeCivilBrickwork("civil-brick-calculator", {
      lengthM: 10,
      heightM: 3,
      wastePct: 0,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.bricks).toBeGreaterThan(100);
  });

  it("area", () => {
    const r = computeCivilAreaVolume("civil-area-calculator-shapes", {
      lengthM: 4,
      widthM: 5,
      shape: "rectangle",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.areaM2).toBe(20);
  });

  it("steel weight", () => {
    const r = computeCivilSteel("civil-steel-weight-calculator", {
      diaMm: 12,
      lengthM: 12,
      bars: 10,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.weightKg).toBeCloseTo((144 / 162) * 12 * 10, 1);
  });

  it("plaster", () => {
    const r = computeCivilPlastering("civil-wall-plaster-calculator", {
      lengthM: 10,
      heightM: 3,
      thicknessMm: 12,
      wastePct: 0,
    });
    expect(r.ok).toBe(true);
  });

  it("footing", () => {
    const r = computeCivilFoundation("civil-footing-calculator", {
      lengthM: 1.5,
      widthM: 1.5,
      depthM: 0.3,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.volumeM3).toBeCloseTo(0.675);
  });

  it("asphalt", () => {
    const r = computeCivilRoad("civil-asphalt-calculator", {
      lengthM: 100,
      widthM: 3.5,
      thicknessM: 0.05,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.volumeM3).toBeCloseTo(17.5);
  });

  it("tank", () => {
    const r = computeCivilWater("civil-water-tank-volume-calculator", {
      lengthM: 2,
      widthM: 2,
      heightM: 1.5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.volumeL).toBe(6000);
  });

  it("construction cost", () => {
    const r = computeCivilEstimation("civil-construction-cost-calculator", {
      areaM2: 100,
      costPerM2: 1500,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCost).toBe(150000);
  });

  it("slope", () => {
    const r = computeCivilSurveying("civil-slope-calculator-civil", { rise: 1, run: 20 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.slopePct).toBe(5);
  });

  it("earthwork", () => {
    const r = computeCivilAdvanced("civil-earthwork-calculator", {
      lengthM: 10,
      widthM: 4,
      depthM: 2,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.volumeM3).toBe(80);
  });
});
