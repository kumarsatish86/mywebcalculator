import { describe, expect, it } from "vitest";
import { ALL_UNIT_CONVERT_SLUGS, computeUnitConvert } from "./unitConvert";

describe("unit converters smoke", () => {
  it("covers every slug", () => {
    expect(ALL_UNIT_CONVERT_SLUGS.length).toBe(64);
    for (const slug of ALL_UNIT_CONVERT_SLUGS) {
      const r = computeUnitConvert(slug, {
        value: 10,
        valueB: 2,
        moles: 1,
        liters: 2,
        bags: 2,
        bagKg: 50,
        volumeM3: 1,
        densityKgM3: 1600,
        wallAreaM2: 10,
        brickFaceM2: 0.0143,
        mortarPct: 5,
        nm: 40,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("meter to km", () => {
    const r = computeUnitConvert("unit-meter-kilometer-converter", { value: 1000 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.b).toBe(1);
  });

  it("celsius to fahrenheit", () => {
    const r = computeUnitConvert("unit-celsius-fahrenheit-converter", { value: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.b).toBe(32);
  });

  it("liter to gallons", () => {
    const r = computeUnitConvert("unit-liter-gallon-us-uk-converter", { value: 3.785411784 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.b).toBeCloseTo(1);
  });

  it("molarity", () => {
    const r = computeUnitConvert("unit-molarity-converter", { moles: 2, liters: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.a).toBe(2);
  });
});
