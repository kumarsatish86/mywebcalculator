import { describe, expect, it } from "vitest";
import { gad7Score, glasgowComaScale, phq9Score } from "./medicalNeurology";

describe("medicalNeurology", () => {
  it("sums GCS", () => {
    const r = glasgowComaScale({ eye: 4, verbal: 5, motor: 6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gcs).toBe(15);
  });

  it("accepts PHQ-9 total", () => {
    const r = phq9Score({ scoresCsv: "12" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.total).toBe(12);
  });

  it("sums GAD-7 items", () => {
    const r = gad7Score({ scoresCsv: "1,1,1,1,1,1,1" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.total).toBe(7);
  });
});
