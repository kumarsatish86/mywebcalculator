import { describe, expect, it } from "vitest";
import { computeEduMath } from "./eduMathEngine";

describe("computeEduMath", () => {
  it("computes GCD and LCM", () => {
    expect(computeEduMath("hcf-gcd-calculator", { a: 48, b: 18 }).lines[0].value).toBe("6");
    expect(computeEduMath("lcm-calculator", { a: 12, b: 18 }).lines[0].value).toBe("36");
  });

  it("prime-factors 60", () => {
    const r = computeEduMath("prime-factorization-calculator", { n: 60 });
    expect(r.lines[0].value).toContain("2");
    expect(r.lines[0].value).toContain("3");
    expect(r.lines[0].value).toContain("5");
  });

  it("quadratic roots", () => {
    const r = computeEduMath("quadratic-equation-calculator", { a: 1, b: -5, c: 6 });
    expect(r.lines.length).toBe(2);
  });
});
