import { describe, expect, it } from "vitest";
import { gestationalAge, menstrualCycle, pregnancyDueDate } from "./medicalPregnancy";

describe("medicalPregnancy", () => {
  it("EDD from LMP", () => {
    const r = pregnancyDueDate({ lmp: "2026-01-01" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.edd).toBe("2026-10-08");
  });

  it("gestational age", () => {
    const r = gestationalAge({ lmp: "2026-01-01", today: "2026-01-15" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.totalDays).toBe(14);
    expect(r.weeks).toBe(2);
  });

  it("next period", () => {
    const r = menstrualCycle({ lmp: "2026-01-01", cycleLength: 28 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.nextPeriod).toBe("2026-01-29");
  });
});
