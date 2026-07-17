import { describe, expect, it } from "vitest";
import { dnaConcentration, labSolutionBiology, serialDilution } from "./biologyLabResearch";

describe("biologyLabResearch", () => {
  it("serial dilutes", () => {
    const r = serialDilution({ cInitial: 1000, dilutionFactor: 10, steps: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.cFinal).toBeCloseTo(1, 5);
  });

  it("estimates DNA concentration", () => {
    const r = dnaConcentration({ a260: 0.5, dilution: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ngPerUl).toBeCloseTo(25, 5);
  });

  it("solves C1V1=C2V2", () => {
    const r = labSolutionBiology({ mode: "c1v1", c1: 10, c2: 1, v2: 50 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.v1).toBeCloseTo(5, 5);
  });
});
