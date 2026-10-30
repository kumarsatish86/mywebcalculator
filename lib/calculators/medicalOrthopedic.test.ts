import { describe, expect, it } from "vitest";
import { boneDensity, idealPosture } from "./medicalOrthopedic";

describe("medicalOrthopedic", () => {
  it("computes T-score", () => {
    const r = boneDensity({ bmd: 0.8, youngMean: 1.0, sd: 0.1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.tScore).toBeCloseTo(-2, 5);
  });

  it("estimates desk height", () => {
    const r = idealPosture({ heightCm: 170 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.deskCm).toBeCloseTo(73.1, 1);
  });
});
