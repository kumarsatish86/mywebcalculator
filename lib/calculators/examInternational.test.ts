import { describe, expect, it } from "vitest";
import { ieltsBand, satScore, toeflScore } from "./examInternational";

describe("examInternational", () => {
  it("scales SAT sections to total", () => {
    const r = satScore({ readingWritingRaw: 40, mathRaw: 32 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.total).toBe(r.rwScaled + r.mathScaled);
    expect(r.total).toBeGreaterThanOrEqual(400);
    expect(r.band).toBeTruthy();
  });

  it("rounds IELTS overall band to 0.5", () => {
    const r = ieltsBand({ listening: 7, reading: 7, writing: 6.5, speaking: 7 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.overallBand).toBe(7);
    expect(r.average).toBeCloseTo(6.875, 5);
  });

  it("sums TOEFL section scores", () => {
    const r = toeflScore({ reading: 25, listening: 24, speaking: 23, writing: 22 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.total).toBe(94);
    expect(r.band).toBe("Competitive");
  });
});
