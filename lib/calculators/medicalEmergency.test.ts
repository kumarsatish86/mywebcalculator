import { describe, expect, it } from "vitest";
import { apgarScore, newsScore, shockIndex } from "./medicalEmergency";

describe("medicalEmergency", () => {
  it("sums APGAR", () => {
    const r = apgarScore({ scoresCsv: "2,2,2,2,2" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.score).toBe(10);
  });

  it("computes shock index", () => {
    const r = shockIndex({ hr: 100, sbp: 100 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.index).toBeCloseTo(1, 5);
  });

  it("sums NEWS", () => {
    const r = newsScore({ scoresCsv: "0,0,0,0,0,0,0" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.score).toBe(0);
  });
});
