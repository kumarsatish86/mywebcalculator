import { describe, expect, it } from "vitest";
import { cognitiveScore, fallRisk, lifeExpectancy } from "./medicalGeriatrics";

describe("medicalGeriatrics", () => {
  it("estimates remaining years", () => {
    const r = lifeExpectancy({ age: 70, sex: "male", smoke: 0, exercise: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.estimateYears).toBe(11);
  });

  it("sums fall risk", () => {
    const r = fallRisk({ scoresCsv: "15,10,5" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.score).toBe(30);
  });

  it("sums cognitive items", () => {
    const r = cognitiveScore({ scoresCsv: "26" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.total).toBe(26);
  });
});
