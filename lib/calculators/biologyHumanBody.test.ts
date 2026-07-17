import { describe, expect, it } from "vitest";
import { bmiBiology, glucoseConverter, hba1c } from "./biologyHumanBody";

describe("biologyHumanBody", () => {
  it("computes BMI", () => {
    const r = bmiBiology({ weightKg: 70, heightM: 1.75 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.bmi).toBeCloseTo(22.86, 1);
  });

  it("converts glucose units", () => {
    const r = glucoseConverter({ value: 90, from: "mgdl" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.mmol).toBeCloseTo(5, 0);
  });

  it("estimates eAG from A1c", () => {
    const r = hba1c({ a1cPercent: 7 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.eagMgdl).toBeCloseTo(154.2, 0);
  });
});
