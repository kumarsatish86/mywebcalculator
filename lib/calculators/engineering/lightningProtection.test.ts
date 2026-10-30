import { describe, expect, it } from "vitest";
import { parseLengthToMetres, parseResistivityOhmM } from "../parseEngineeringQuantity";
import {
  BUILDING_PRESETS,
  computeLightningProtection,
  deriveRiskLevel,
  heightScenarios,
  rollingSphereHorizontal,
} from "./lightningProtection";

describe("parseEngineeringQuantity", () => {
  it("parses metres and feet", () => {
    const m = parseLengthToMetres("35m");
    expect(m.ok).toBe(true);
    if (m.ok) expect(m.value).toBe(35);
    const ft = parseLengthToMetres("10ft");
    expect(ft.ok).toBe(true);
    if (ft.ok) expect(ft.value).toBeCloseTo(3.048, 2);
  });

  it("parses resistivity", () => {
    const r = parseResistivityOhmM("100");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(100);
  });
});

describe("lightningProtection v2", () => {
  it("returns decision options, cost, and 5-level risk", () => {
    const p = BUILDING_PRESETS.warehouse;
    const r = computeLightningProtection({
      standardId: "iec62305",
      buildingId: "warehouse",
      heightM: p.heightM,
      lengthM: p.lengthM,
      widthM: p.widthM,
      lpsClass: p.lpsClass,
      soilOhmM: p.soilOhmM,
      rodLengthM: p.rodLengthM,
      airTerminators: p.airTerminators,
      inputCompleteness: 1,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.decisionOptions).toHaveLength(3);
    expect(r.cost.totalInr).toBeGreaterThan(0);
    expect(r.safetyScore).toBeGreaterThan(0);
    expect(r.engineeringNotes.length).toBeGreaterThan(0);
    expect(["LOW", "MODERATE", "SIGNIFICANT", "HIGH", "CRITICAL"]).toContain(r.risk);
    expect(r.decisionOptions[0]!.coverageDeltaPct).toBeGreaterThanOrEqual(0);
  });

  it("deriveRiskLevel escalates on poor coverage", () => {
    expect(deriveRiskLevel(0.4, 50, 70)).toBe("CRITICAL");
    expect(deriveRiskLevel(1.1, 3, 12)).toBe("LOW");
  });

  it("rolling sphere and scenarios", () => {
    expect(rollingSphereHorizontal(20, 30)).toBeGreaterThan(0);
    const s = heightScenarios([30, 40], 45);
    expect(s[1]!.radiusM).toBeGreaterThan(s[0]!.radiusM);
  });
});
