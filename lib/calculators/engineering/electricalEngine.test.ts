import { describe, expect, it } from "vitest";
import { computeElectrical } from "./electricalEngine";

describe("computeElectrical", () => {
  it("solves Ohm’s law for resistance", () => {
    const r = computeElectrical("elec-ohms-law-calculator", { V: 12, I: 2 });
    expect(r.error).toBeUndefined();
    expect(r.lines.some((l) => l.value.includes("6"))).toBe(true);
  });

  it("computes DC power", () => {
    const r = computeElectrical("elec-power-calculator-p-vi", { V: 10, I: 2 });
    expect(r.lines[0].value).toContain("20");
  });

  it("converts kW to hp", () => {
    const r = computeElectrical("elec-kw-to-hp-converter", { kW: 1 });
    expect(r.lines[0].value).toMatch(/1\.34|hp/i);
  });
});
