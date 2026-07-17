import { describe, expect, it } from "vitest";
import { ovulation, pregnancyDueDate, pregnancyWeightGain } from "./biologyPregnancy";

describe("biologyPregnancy", () => {
  it("estimates ovulation day", () => {
    const r = ovulation({ lmpYmd: "2026-01-01", cycleLength: 28 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ovulationYmd).toBe("2026-01-15");
  });

  it("applies Naegele due date", () => {
    const r = pregnancyDueDate({ lmpYmd: "2026-01-01" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.dueYmd).toBe("2026-10-08");
  });

  it("bands pregnancy weight gain by BMI", () => {
    const r = pregnancyWeightGain({ preBmi: 22, currentGainKg: 12 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.recommendedMinKg).toBe(11.5);
    expect(r.status).toContain("Within");
  });
});
