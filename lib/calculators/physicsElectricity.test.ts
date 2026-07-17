import { describe, expect, it } from "vitest";
import { ohmsLaw, parallelResistance, seriesResistance } from "./physicsElectricity";

describe("physicsElectricity", () => {
  it("solves Ohm’s law for voltage", () => {
    const r = ohmsLaw({ v: null, i: 2, r: 6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.v).toBeCloseTo(12, 5);
    expect(r.solved).toBe("V");
  });

  it("sums series resistances", () => {
    const r = seriesResistance({ ohmsCsv: "10,20,30" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.totalOhm).toBe(60);
  });

  it("computes parallel equivalent", () => {
    const r = parallelResistance({ ohmsCsv: "10,10" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.totalOhm).toBeCloseTo(5, 5);
  });
});
