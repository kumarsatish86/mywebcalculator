import { describe, expect, it } from "vitest";
import {
  evalMathExpression,
  gcd,
  medianSorted,
  modesOf,
  parseNumberList,
  roundTo,
  simplifyRatioPart,
  suggestScaledIntegersForRatio,
} from "./basicMath";
import { evalExpressionFromString, evalExpressionWithTraceFromString } from "./mathExpressionAst";

describe("parseNumberList", () => {
  it("parses comma and space separated", () => {
    const r = parseNumberList("1, 2  3");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.values).toEqual([1, 2, 3]);
  });

  it("rejects invalid token", () => {
    const r = parseNumberList("1, x");
    expect(r.ok).toBe(false);
  });

  it("accepts newlines and tabs as separators", () => {
    const r = parseNumberList("1\n2\t3");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.values).toEqual([1, 2, 3]);
  });

  it("rejects empty list", () => {
    const r = parseNumberList("   ");
    expect(r.ok).toBe(false);
  });
});

describe("gcd / simplifyRatioPart", () => {
  it("simplifies 4:6", () => {
    const r = simplifyRatioPart(4, 6);
    expect("error" in r ? r : null).toBeNull();
    if (r && !("error" in r)) expect(r).toEqual({ a: 2, b: 3 });
  });
});

describe("suggestScaledIntegersForRatio", () => {
  it("suggests scale for one-decimal pair", () => {
    const s = suggestScaledIntegersForRatio(0.4, 0.6);
    expect(s).not.toBeNull();
    expect(s!.ai).toBe(4);
    expect(s!.bi).toBe(6);
    expect(s!.factor).toBe(10);
  });

  it("returns null when no small power-of-10 scale yields integers", () => {
    const s = suggestScaledIntegersForRatio(Math.PI, Math.E);
    expect(s).toBeNull();
  });
});

describe("medianSorted / modesOf", () => {
  it("median even count", () => {
    expect(medianSorted([1, 2, 3, 4])).toBe(2.5);
  });

  it("mode tie", () => {
    expect(modesOf([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });
});

describe("roundTo", () => {
  it("rounds nearest", () => {
    expect(roundTo(1.2345, 2, "nearest")).toBe(1.23);
  });

  it("banker: half toward even at 0 decimals", () => {
    expect(roundTo(2.5, 0, "banker")).toBe(2);
    expect(roundTo(3.5, 0, "banker")).toBe(4);
    expect(roundTo(-2.5, 0, "banker")).toBe(-2);
    expect(roundTo(-3.5, 0, "banker")).toBe(-4);
  });

  it("banker: 1.235 to two decimals picks even last digit", () => {
    expect(roundTo(1.235, 2, "banker")).toBe(1.24);
  });
});

describe("evalMathExpression", () => {
  it("respects PEMDAS", () => {
    const r = evalMathExpression("2+3*4");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(14);
  });

  it("right-associative power", () => {
    const r = evalMathExpression("2^3^2");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(512);
  });

  it("parens and unary", () => {
    expect(evalMathExpression("(2+3)*4")).toEqual({ ok: true, value: 20 });
    const r = evalMathExpression("-2^2");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(-4);
  });

  it("sqrt and pi", () => {
    const r = evalMathExpression("sqrt(16)+pi");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(4 + Math.PI);
  });
});

const GOLDEN: { expr: string; value: number; opts?: { angleMode?: "rad" | "deg" } }[] = [
  { expr: "2+3*4", value: 14 },
  { expr: "(2+3)*4", value: 20 },
  { expr: "2^3^2", value: 512 },
  { expr: "-2^2", value: -4 },
  { expr: "sqrt(9)-1", value: 2 },
  { expr: "ln(e)", value: 1 },
  { expr: "log(100)", value: 2 },
  { expr: "sin(0)", value: 0 },
];

describe("evalMathExpression and evalExpressionFromString parity", () => {
  it("returns the same numeric results for golden expressions", () => {
    for (const { expr, value, opts } of GOLDEN) {
      const legacy = evalMathExpression(expr, opts);
      const ast = evalExpressionFromString(expr, opts);
      expect(legacy).toEqual(ast);
      expect(legacy.ok).toBe(true);
      if (legacy.ok) expect(legacy.value).toBe(value);
    }
  });
});

describe("evalExpressionWithTraceFromString", () => {
  it("returns multiple steps for multi-operator expressions", () => {
    const r = evalExpressionWithTraceFromString("2+3*4");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toBe(14);
      expect(r.steps.length).toBeGreaterThan(0);
    }
  });

  it("propagates parse errors", () => {
    const r = evalExpressionWithTraceFromString("1+");
    expect(r.ok).toBe(false);
  });
});
