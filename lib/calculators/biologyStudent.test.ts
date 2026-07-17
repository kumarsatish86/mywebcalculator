import { describe, expect, it } from "vitest";
import { biologyFormula, quizScoreBiology, studyTimePlannerBiology } from "./biologyStudent";

describe("biologyStudent", () => {
  it("computes magnification", () => {
    const r = biologyFormula({ kind: "magnification", a: 50, b: 5 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.value).toBeCloseTo(10, 5);
  });

  it("scores a quiz", () => {
    const r = quizScoreBiology({ correct: 8, total: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(80, 5);
    expect(r.grade).toBe("B");
  });

  it("splits study time", () => {
    const r = studyTimePlannerBiology({ topics: 4, hoursAvailable: 8 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.hoursPerTopic).toBeCloseTo(2, 5);
  });
});
