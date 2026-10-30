import { describe, expect, it } from "vitest";
import { alveolarGasEquation, lungCapacity, peakFlow } from "./medicalRespiratory";

describe("medicalRespiratory", () => {
  it("sums vital capacity", () => {
    const r = lungCapacity({ irvMl: 3000, tvMl: 500, ervMl: 1000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.vcMl).toBe(4500);
  });

  it("computes % predicted PEF", () => {
    const r = peakFlow({ measured: 400, predicted: 500 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percentPredicted).toBeCloseTo(80, 5);
  });

  it("computes PAO2 on room air", () => {
    const r = alveolarGasEquation({ fio2: 0.21, paco2: 40 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.pao2).toBeCloseTo(0.21 * (760 - 47) - 40 / 0.8, 2);
  });
});
