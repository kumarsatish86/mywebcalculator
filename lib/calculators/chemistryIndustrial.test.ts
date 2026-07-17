import { describe, expect, it } from "vitest";
import { conversionEfficiency, materialBalance, processYield } from "./chemistryIndustrial";

describe("chemistryIndustrial", () => {
  it("computes process yield %", () => {
    const r = processYield({ actual: 80, theoretical: 100 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(80, 5);
  });

  it("computes conversion", () => {
    const r = conversionEfficiency({ reacted: 40, fed: 50 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(80, 5);
  });

  it("closes material balance", () => {
    const r = materialBalance({ inlet: 10, outlet: 8, consumed: 2, generated: 0 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.closed).toBe(true);
  });
});
