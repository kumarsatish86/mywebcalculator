import { describe, expect, it } from "vitest";
import { packingEfficiency, unitCell } from "./chemistrySolidState";

describe("chemistrySolidState", () => {
  it("gives FCC packing ~74%", () => {
    const r = packingEfficiency({ type: "fcc" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(74.05, 1);
    expect(r.z).toBe(4);
  });

  it("computes unit cell volume", () => {
    const r = unitCell({ mode: "volume", edgeCm: 2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.volumeCm3).toBeCloseTo(8, 5);
  });
});
