import { describe, expect, it } from "vitest";
import { cha2ds2Vasc, curb65Score, meldScore } from "./medicalClinicalRisk";

describe("medicalClinicalRisk", () => {
  it("scores CHA2DS2-VASc", () => {
    const r = cha2ds2Vasc({
      chf: 0,
      htn: 1,
      age75: 0,
      diabetes: 0,
      stroke: 0,
      vascular: 0,
      age65_74: 1,
      female: 1,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.score).toBe(3);
  });

  it("computes MELD", () => {
    const r = meldScore({ bilirubin: 1, inr: 1, creatinine: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.meld).toBe(6);
  });

  it("scores CURB-65", () => {
    const r = curb65Score({ confusion: 1, urea: 0, resp: 1, bp: 0, age65: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.score).toBe(3);
  });
});
