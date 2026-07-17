import { describe, expect, it } from "vitest";
import {
  cbsePercentage,
  internalExternalMarks,
  universityGpa,
} from "./examSchoolCollege";

describe("examSchoolCollege", () => {
  it("computes CBSE-style aggregate percentage", () => {
    const r = cbsePercentage({ marksCsv: "88,92,85,90", maxPerSubject: 100 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.subjects).toBe(4);
    expect(r.percent).toBeCloseTo(88.75, 5);
  });

  it("computes weighted university GPA", () => {
    const r = universityGpa({ gradePointsCsv: "8,9,7", creditsCsv: "4,3,3" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gpa).toBeCloseTo(8, 5);
    expect(r.courses).toBe(3);
  });

  it("blends internal and external marks", () => {
    const r = internalExternalMarks({
      internal: 45,
      external: 72,
      internalMax: 50,
      externalMax: 100,
      internalWeightPercent: 30,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.internalPercent).toBeCloseTo(90, 5);
    expect(r.externalPercent).toBeCloseTo(72, 5);
    expect(r.combinedPercent).toBeCloseTo(77.4, 5);
  });
});
