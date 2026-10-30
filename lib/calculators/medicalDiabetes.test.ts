import { describe, expect, it } from "vitest";
import { bloodSugarConvert, eagFromHba1c, carbohydrateCoverage } from "./medicalDiabetes";

describe("medicalDiabetes", () => {
  it("converts mg/dL to mmol", () => {
    const r = bloodSugarConvert({ value: 180, from: "mgdl" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.mmol).toBeCloseTo(10, 5);
  });

  it("eAG from A1c", () => {
    const r = eagFromHba1c({ hba1cPct: 7 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.eagMgdl).toBeCloseTo(154.2, 1);
  });

  it("carb coverage", () => {
    const r = carbohydrateCoverage({ carbsG: 60, icr: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.units).toBe(6);
  });
});
