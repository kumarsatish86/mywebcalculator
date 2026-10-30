import { describe, expect, it } from "vitest";
import { anionGap, creatinineClearance, dosageMgKg, ivDripRate } from "./medicalDrugDosage";

describe("medicalDrugDosage", () => {
  it("mg/kg dose", () => {
    const r = dosageMgKg({ weightKg: 70, mgPerKg: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.doseMg).toBe(700);
  });

  it("IV drip rate", () => {
    const r = ivDripRate({ volumeMl: 1000, timeMin: 480, dropFactor: 15 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gttPerMin).toBeCloseTo(31.25, 2);
  });

  it("CrCl Cockcroft–Gault", () => {
    const r = creatinineClearance({ age: 40, weightKg: 70, creatinineMgDl: 1, sex: "male" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.crcl).toBeCloseTo(97.22, 1);
  });

  it("anion gap", () => {
    const r = anionGap({ na: 140, cl: 104, hco3: 24 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gap).toBe(12);
  });
});
