import { describe, expect, it } from "vitest";
import { degreeOfUnsaturation, hydrocarbonFormula, iupacNameTeaching } from "./chemistryOrganic";

describe("chemistryOrganic", () => {
  it("gives alkane formula", () => {
    const r = hydrocarbonFormula({ n: 4, kind: "alkane" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.formula).toBe("C4H10");
  });

  it("computes DU for benzene C6H6", () => {
    const r = degreeOfUnsaturation({ c: 6, h: 6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.du).toBeCloseTo(4, 5);
  });

  it("names butane", () => {
    const r = iupacNameTeaching({ n: 4, kind: "alkane" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.name).toBe("butane");
  });
});
