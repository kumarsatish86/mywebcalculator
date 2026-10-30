import { describe, expect, it } from "vitest";
import { medicalMap, medicalPulsePressure, medicalHeartRate } from "./medicalHeart";

describe("medicalHeart", () => {
  it("max HR", () => {
    const r = medicalHeartRate({ age: 40 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.maxHr).toBe(180);
  });

  it("MAP", () => {
    const r = medicalMap({ systolic: 120, diastolic: 80 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.map).toBeCloseTo(93.33, 1);
  });

  it("pulse pressure", () => {
    const r = medicalPulsePressure({ systolic: 120, diastolic: 80 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.pulsePressure).toBe(40);
  });
});
