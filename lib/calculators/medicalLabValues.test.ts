import { describe, expect, it } from "vitest";
import { calciumCorrectionLab, serumOsmolality, sodiumCorrection } from "./medicalLabValues";

describe("medicalLabValues", () => {
  it("serum osmolality", () => {
    const r = serumOsmolality({ na: 140, glucoseMgDl: 90, bunMgDl: 14 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.osm).toBeCloseTo(2 * 140 + 90 / 18 + 14 / 2.8, 5);
  });

  it("sodium correction", () => {
    const r = sodiumCorrection({ na: 130, glucoseMgDl: 400 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.correctedNa).toBeCloseTo(134.8, 1);
  });

  it("calcium correction", () => {
    const r = calciumCorrectionLab({ calciumMgDl: 8, albuminGDl: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.corrected).toBeCloseTo(8.8, 5);
  });
});
